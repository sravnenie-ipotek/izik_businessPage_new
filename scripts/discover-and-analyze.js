import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { BLOCK_EXTRACTOR_JS, TOKEN_EXTRACTOR_JS, DETECT_FORMS_JS } from './evaluators.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

// Configuration
const BASE_URL = 'https://www.normandpllc.com';
const MAX_DEPTH = 4;
const MAX_URLS = 300;
const VIEWPORTS = [
  { name: 'xl', width: 1440, height: 900 },
  { name: 'lg', width: 1024, height: 800 },
  { name: 'md', width: 768, height: 900 },
  { name: 'sm', width: 390, height: 844 }
];

class SiteAnalyzer {
  constructor() {
    this.visited = new Set();
    this.pages = [];
    this.navLinks = { topNav: [], footerNav: [] };
    this.templates = new Map();
    this.tokens = {};
  }

  async discover(browser) {
    console.log('🔍 Starting discovery phase...');
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1366, height: 900 });
    
    const toVisit = [{ url: BASE_URL, depth: 0, discoveredFrom: 'root' }];
    
    while (toVisit.length > 0 && this.pages.length < MAX_URLS) {
      const current = toVisit.shift();
      
      // Normalize URL
      let normalizedUrl = current.url;
      try {
        const urlObj = new URL(current.url);
        // Remove trailing slashes except for root
        if (urlObj.pathname !== '/' && urlObj.pathname.endsWith('/')) {
          urlObj.pathname = urlObj.pathname.slice(0, -1);
        }
        normalizedUrl = urlObj.toString();
      } catch (e) {
        continue;
      }
      
      if (this.visited.has(normalizedUrl) || current.depth > MAX_DEPTH) continue;
      
      this.visited.add(normalizedUrl);
      
      try {
        console.log(`  Visiting: ${normalizedUrl} (depth: ${current.depth})`);
        await page.goto(normalizedUrl, { waitUntil: 'networkidle', timeout: 30000 });
        
        // Skip non-HTML pages
        const contentType = await page.evaluate(() => document.contentType);
        if (!contentType.includes('html')) continue;
        
        this.pages.push({
          url: normalizedUrl,
          depth: current.depth,
          discoveredFrom: current.discoveredFrom,
          title: await page.title()
        });
        
        // Extract navigation links on first page
        if (normalizedUrl === BASE_URL || normalizedUrl === BASE_URL + '/') {
          const navData = await page.evaluate(() => {
            const topNav = [];
            const footerNav = [];
            
            // Top navigation
            const topNavEl = document.querySelector('nav, header nav, .nav, .navigation');
            if (topNavEl) {
              topNavEl.querySelectorAll('a').forEach(a => {
                if (a.href && !a.href.includes('javascript:') && !a.href.includes('mailto:')) {
                  topNav.push({ label: a.textContent.trim(), url: a.href });
                }
              });
            }
            
            // Footer navigation
            const footerEl = document.querySelector('footer');
            if (footerEl) {
              footerEl.querySelectorAll('a').forEach(a => {
                if (a.href && !a.href.includes('javascript:') && !a.href.includes('mailto:')) {
                  footerNav.push({ label: a.textContent.trim(), url: a.href });
                }
              });
            }
            
            return { topNav, footerNav };
          });
          
          this.navLinks = navData;
        }
        
        // Discover more links
        if (current.depth < MAX_DEPTH) {
          const links = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('a[href]'))
              .map(a => a.href)
              .filter(href => {
                try {
                  const url = new URL(href);
                  return url.origin === window.location.origin && 
                         !href.includes('#') && 
                         !href.includes('mailto:') &&
                         !href.includes('tel:') &&
                         !href.includes('.pdf') &&
                         !href.includes('.zip');
                } catch {
                  return false;
                }
              });
          });
          
          for (const link of links) {
            if (!this.visited.has(link) && toVisit.length < MAX_URLS * 2) {
              toVisit.push({ 
                url: link, 
                depth: current.depth + 1, 
                discoveredFrom: normalizedUrl 
              });
            }
          }
        }
      } catch (error) {
        console.error(`  ❌ Error visiting ${normalizedUrl}:`, error.message);
      }
    }
    
    await page.close();
    console.log(`✅ Discovered ${this.pages.length} pages`);
    
    // Save sitemap and navigation
    await fs.writeFile(
      path.join(ROOT_DIR, 'output', 'sitemap.json'),
      JSON.stringify(this.pages, null, 2)
    );
    
    await fs.writeFile(
      path.join(ROOT_DIR, 'output', 'nav-links.json'),
      JSON.stringify(this.navLinks, null, 2)
    );
  }

  async analyzeTemplates(browser) {
    console.log('📋 Analyzing templates...');
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1366, height: 900 });
    
    for (const pageData of this.pages.slice(0, 50)) { // Analyze first 50 for templates
      try {
        console.log(`  Analyzing: ${pageData.url}`);
        await page.goto(pageData.url, { waitUntil: 'networkidle', timeout: 30000 });
        
        // Scroll to reveal lazy content
        await page.evaluate(() => {
          return new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;
              if(totalHeight >= scrollHeight){
                clearInterval(timer);
                window.scrollTo(0, 0);
                resolve();
              }
            }, 100);
          });
        });
        
        // Extract blocks
        const blocks = await page.evaluate(BLOCK_EXTRACTOR_JS);
        
        // Build fingerprint
        const fingerprint = {
          blockCount: blocks.length,
          colorRhythm: blocks.map(b => b.color).join('-'),
          hasHero: blocks.some(b => b.hasHero),
          hasFAQ: blocks.some(b => b.hasFAQ),
          hasForms: blocks.some(b => b.hasForms),
          hasGallery: blocks.some(b => b.hasGallery),
          headingSequence: blocks.filter(b => b.headingSample).length,
          totalHeight: blocks.reduce((sum, b) => sum + b.approxHeight, 0)
        };
        
        // Find similar template
        let templateId = null;
        for (const [tid, tpl] of this.templates) {
          if (this.similarFingerprint(fingerprint, tpl.fingerprint)) {
            templateId = tid;
            tpl.pages.push(pageData.url);
            break;
          }
        }
        
        if (!templateId) {
          templateId = `template_${this.templates.size + 1}`;
          this.templates.set(templateId, {
            id: templateId,
            fingerprint: fingerprint,
            pages: [pageData.url],
            sampleBlocks: blocks
          });
        }
        
        pageData.templateId = templateId;
        pageData.blocks = blocks;
      } catch (error) {
        console.error(`  ❌ Error analyzing ${pageData.url}:`, error.message);
      }
    }
    
    await page.close();
    console.log(`✅ Found ${this.templates.size} templates`);
    
    // Save templates
    const templatesArray = Array.from(this.templates.values());
    await fs.writeFile(
      path.join(ROOT_DIR, 'output', 'templates.json'),
      JSON.stringify(templatesArray, null, 2)
    );
    
    // Create human-readable summary
    let summary = '# Template Analysis\n\n';
    templatesArray.forEach(tpl => {
      summary += `## ${tpl.id}\n`;
      summary += `- Pages: ${tpl.pages.length}\n`;
      summary += `- Blocks: ${tpl.fingerprint.blockCount}\n`;
      summary += `- Color Rhythm: ${tpl.fingerprint.colorRhythm}\n`;
      summary += `- Components: ${tpl.fingerprint.hasHero ? '✓ Hero ' : ''}${tpl.fingerprint.hasForms ? '✓ Forms ' : ''}${tpl.fingerprint.hasFAQ ? '✓ FAQ ' : ''}${tpl.fingerprint.hasGallery ? '✓ Gallery' : ''}\n`;
      summary += `- Sample URLs:\n`;
      tpl.pages.slice(0, 3).forEach(url => {
        summary += `  - ${url}\n`;
      });
      summary += '\n';
    });
    
    await fs.writeFile(
      path.join(ROOT_DIR, 'output', 'templates.md'),
      summary
    );
  }

  similarFingerprint(fp1, fp2) {
    // Simple similarity check
    return Math.abs(fp1.blockCount - fp2.blockCount) <= 1 &&
           fp1.colorRhythm === fp2.colorRhythm &&
           fp1.hasHero === fp2.hasHero &&
           fp1.hasForms === fp2.hasForms;
  }

  async generateBlockMaps(browser) {
    console.log('🗺️ Generating block maps...');
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1366, height: 900 });
    
    for (const pageData of this.pages) {
      try {
        const slug = this.urlToSlug(pageData.url);
        console.log(`  Processing: ${slug}`);
        
        await page.goto(pageData.url, { waitUntil: 'networkidle', timeout: 30000 });
        
        // Scroll to reveal all content
        await page.evaluate(() => {
          return new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;
              if(totalHeight >= scrollHeight){
                clearInterval(timer);
                window.scrollTo(0, 0);
                setTimeout(resolve, 1000);
              }
            }, 100);
          });
        });
        
        // Extract blocks
        const blocks = await page.evaluate(BLOCK_EXTRACTOR_JS);
        
        // Save block map
        await fs.writeFile(
          path.join(ROOT_DIR, 'output', 'pages', `${slug}.blocks.json`),
          JSON.stringify(blocks, null, 2)
        );
        
        // Take screenshot
        await page.screenshot({
          path: path.join(ROOT_DIR, 'output', 'pages', `${slug}.png`),
          fullPage: true
        });
      } catch (error) {
        console.error(`  ❌ Error processing ${pageData.url}:`, error.message);
      }
    }
    
    await page.close();
    console.log(`✅ Generated ${this.pages.length} block maps`);
  }

  async extractTokens(browser) {
    console.log('🎨 Extracting design tokens...');
    const page = await browser.newPage();
    
    // Global tokens from homepage
    const globalTokens = {};
    const breakpointTokens = {};
    
    for (const viewport of VIEWPORTS) {
      console.log(`  Viewport: ${viewport.name}`);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
      
      const heroTokens = await page.evaluate(TOKEN_EXTRACTOR_JS, 'hero');
      const footerTokens = await page.evaluate(TOKEN_EXTRACTOR_JS, 'footer');
      
      const combined = { ...heroTokens, ...footerTokens };
      
      if (viewport.name === 'xl') {
        globalTokens.hero = heroTokens;
        globalTokens.footer = footerTokens;
      }
      
      breakpointTokens[viewport.name] = combined;
    }
    
    // Per-template tokens
    const templateTokens = {};
    for (const [tid, tpl] of this.templates) {
      if (tpl.pages.length > 0) {
        console.log(`  Template ${tid}`);
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto(tpl.pages[0], { waitUntil: 'networkidle', timeout: 30000 });
        
        const heroTokens = await page.evaluate(TOKEN_EXTRACTOR_JS, 'hero');
        const footerTokens = await page.evaluate(TOKEN_EXTRACTOR_JS, 'footer');
        
        templateTokens[tid] = { hero: heroTokens, footer: footerTokens };
      }
    }
    
    await page.close();
    
    // Save tokens
    await fs.writeFile(
      path.join(ROOT_DIR, 'output', 'tokens.global.json'),
      JSON.stringify(globalTokens, null, 2)
    );
    
    await fs.writeFile(
      path.join(ROOT_DIR, 'output', 'tokens.breakpoints.json'),
      JSON.stringify(breakpointTokens, null, 2)
    );
    
    await fs.writeFile(
      path.join(ROOT_DIR, 'output', 'tokens.templates.json'),
      JSON.stringify(templateTokens, null, 2)
    );
    
    console.log('✅ Extracted all design tokens');
    
    // Check for proprietary fonts and suggest alternatives
    await this.suggestFontAlternatives(globalTokens);
  }

  async suggestFontAlternatives(tokens) {
    let notes = '# Visual Parity Notes\n\n## Font Alternatives\n\n';
    
    const proprietaryFonts = {
      'Knockout': 'Bebas Neue',
      'Gotham': 'Inter',
      'Proxima': 'Roboto',
      'Helvetica Neue': 'Inter',
      'Avenir': 'Nunito Sans',
      'Futura': 'Bebas Neue',
      'DIN': 'Barlow'
    };
    
    const headingFont = tokens.hero?.typography?.heading?.family || '';
    const bodyFont = tokens.hero?.typography?.body?.family || '';
    
    for (const [prop, alt] of Object.entries(proprietaryFonts)) {
      if (headingFont.toLowerCase().includes(prop.toLowerCase())) {
        notes += `- Heading font: "${headingFont}" → Use "${alt}" (open alternative)\n`;
      }
      if (bodyFont.toLowerCase().includes(prop.toLowerCase())) {
        notes += `- Body font: "${bodyFont}" → Use "${alt}" (open alternative)\n`;
      }
    }
    
    notes += '\n## Other Notes\n\n';
    notes += '- All measurements extracted from computed styles\n';
    notes += '- Colors converted to hex/rgb for Tailwind compatibility\n';
    notes += '- Letter-spacing may need fine-tuning (±0.01em)\n';
    
    await fs.writeFile(
      path.join(ROOT_DIR, 'output', 'parity-notes.md'),
      notes
    );
  }

  urlToSlug(url) {
    try {
      const urlObj = new URL(url);
      let slug = urlObj.pathname.replace(/\//g, '-').replace(/^-|-$/g, '') || 'home';
      // Clean up slug
      slug = slug.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-');
      return slug;
    } catch {
      return 'page';
    }
  }

  async detectFormPages(browser) {
    console.log('📝 Detecting form pages...');
    const page = await browser.newPage();
    const formPages = [];
    
    for (const pageData of this.pages.slice(0, 100)) { // Check first 100 pages
      try {
        await page.goto(pageData.url, { waitUntil: 'networkidle', timeout: 20000 });
        const formData = await page.evaluate(DETECT_FORMS_JS);
        
        if (formData.hasForms) {
          formPages.push({
            url: pageData.url,
            formCount: formData.formCount,
            isContactPage: formData.isContactPage,
            isCheckoutPage: formData.isCheckoutPage
          });
        }
      } catch (error) {
        console.error(`  Error checking ${pageData.url}:`, error.message);
      }
    }
    
    await page.close();
    console.log(`✅ Found ${formPages.length} pages with forms`);
    
    return formPages;
  }
}

// Main execution
async function main() {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--disable-blink-features=AutomationControlled']
  });
  
  try {
    const analyzer = new SiteAnalyzer();
    
    // Phase 1: Discovery
    await analyzer.discover(browser);
    
    // Phase 2: Template Analysis
    await analyzer.analyzeTemplates(browser);
    
    // Phase 3: Block Maps
    await analyzer.generateBlockMaps(browser);
    
    // Phase 4: Token Extraction
    await analyzer.extractTokens(browser);
    
    // Phase 5: Form Detection
    const formPages = await analyzer.detectFormPages(browser);
    await fs.writeFile(
      path.join(ROOT_DIR, 'output', 'form-pages.json'),
      JSON.stringify(formPages, null, 2)
    );
    
    console.log('\n✨ Discovery and analysis complete!');
    console.log(`📊 Summary:`);
    console.log(`  - Pages discovered: ${analyzer.pages.length}`);
    console.log(`  - Templates found: ${analyzer.templates.size}`);
    console.log(`  - Form pages: ${formPages.length}`);
    
  } finally {
    await browser.close();
  }
}

main().catch(console.error);