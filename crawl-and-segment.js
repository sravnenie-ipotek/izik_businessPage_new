const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

const VIEWPORTS = [
  { name: 'xl', width: 1440, height: 900 },
  { name: 'lg', width: 1024, height: 800 },
  { name: 'md', width: 768, height: 900 },
  { name: 'sm', width: 390, height: 844 }
];

async function discoverPages(page, baseUrl, maxDepth = 1) {
  const visited = new Set();
  const toVisit = [{ url: baseUrl, depth: 0 }];
  const pages = [];
  
  while (toVisit.length > 0) {
    const current = toVisit.shift();
    if (visited.has(current.url) || current.depth > maxDepth) continue;
    
    visited.add(current.url);
    console.log(`Visiting: ${current.url}`);
    
    try {
      await page.goto(current.url, { waitUntil: 'networkidle' });
      pages.push(current.url);
      
      if (current.depth < maxDepth) {
        const links = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('a[href]'))
            .map(a => a.href)
            .filter(href => {
              try {
                const url = new URL(href);
                return url.origin === window.location.origin && 
                       !href.includes('#') && 
                       !href.includes('mailto:') &&
                       !href.includes('tel:');
              } catch {
                return false;
              }
            });
        });
        
        for (const link of links) {
          if (!visited.has(link)) {
            toVisit.push({ url: link, depth: current.depth + 1 });
          }
        }
      }
    } catch (error) {
      console.error(`Error visiting ${current.url}:`, error.message);
    }
  }
  
  return pages;
}

async function segmentPageIntoBlocks(page) {
  // Scroll to load lazy content
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
  
  // Wait for any lazy-loaded content
  await page.waitForTimeout(2000);
  
  // Segment page into blocks
  const blocks = await page.evaluate(() => {
    const blockElements = [];
    const blockSelectors = ['header', 'section', 'footer', 'main > div', 'body > div'];
    
    for (const selector of blockSelectors) {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const styles = window.getComputedStyle(el);
        
        // Skip tiny elements
        if (rect.height < 50) return;
        
        // Check if it's a distinct visual block
        const paddingTop = parseFloat(styles.paddingTop);
        const paddingBottom = parseFloat(styles.paddingBottom);
        const marginTop = parseFloat(styles.marginTop);
        const marginBottom = parseFloat(styles.marginBottom);
        const totalVerticalSpace = paddingTop + paddingBottom + marginTop + marginBottom;
        
        if (rect.height >= 160 || totalVerticalSpace >= 40) {
          blockElements.push({
            element: el,
            top: rect.top + window.scrollY,
            height: rect.height,
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            paddingY: paddingTop + paddingBottom
          });
        }
      });
    }
    
    // Sort by position and merge adjacent similar blocks
    blockElements.sort((a, b) => a.top - b.top);
    
    const mergedBlocks = [];
    let currentBlock = null;
    
    for (const block of blockElements) {
      if (!currentBlock) {
        currentBlock = block;
      } else {
        const gap = block.top - (currentBlock.top + currentBlock.height);
        if (gap < 24 && block.backgroundColor === currentBlock.backgroundColor) {
          // Merge blocks
          currentBlock.height = (block.top + block.height) - currentBlock.top;
        } else {
          mergedBlocks.push(currentBlock);
          currentBlock = block;
        }
      }
    }
    if (currentBlock) mergedBlocks.push(currentBlock);
    
    // Extract block data
    return mergedBlocks.map((block, index) => {
      const el = block.element;
      
      // Find headings
      const headings = el.querySelectorAll('h1, h2, h3');
      const headingSample = headings.length > 0 ? headings[0].textContent.trim().substring(0, 50) : null;
      
      // Find CTAs
      const ctas = Array.from(el.querySelectorAll('a')).filter(a => {
        const styles = window.getComputedStyle(a);
        return styles.display.includes('inline-block') || 
               styles.display === 'block' ||
               a.classList.toString().includes('btn') ||
               a.classList.toString().includes('button');
      }).slice(0, 3).map(a => ({
        label: 'Placeholder CTA',
        href: a.getAttribute('href') || '#'
      }));
      
      // Determine color category
      let colorCategory = 'white';
      const bg = block.backgroundColor;
      if (bg.includes('rgb(0, 0, 0)') || bg.includes('rgb(1, 1, 1)')) {
        colorCategory = 'black';
      } else if (bg.includes('252') || bg.includes('fc5a2b')) {
        colorCategory = 'orange';
      } else if (bg.includes('gray') || bg.includes('248, 248, 248')) {
        colorCategory = 'gray';
      }
      
      return {
        order: index + 1,
        color: colorCategory,
        headingSample: headingSample,
        approxHeight: Math.round(block.height),
        ctas: ctas,
        rawBg: block.backgroundColor
      };
    });
  });
  
  return blocks;
}

async function extractDesignTokens(page, viewport) {
  return await page.evaluate(() => {
    const tokens = {
      colors: {},
      typography: {
        heading: {},
        body: {}
      },
      layout: {},
      controls: {
        input: {},
        button: {}
      },
      decor: {
        rotatedMenuLabel: { exists: false }
      }
    };
    
    // Extract from hero section
    const hero = document.querySelector('header, .hero, [class*="hero"], section:first-of-type');
    if (hero) {
      const heroStyles = window.getComputedStyle(hero);
      tokens.colors.bg = heroStyles.backgroundColor;
      tokens.colors.text = heroStyles.color;
      
      const heading = hero.querySelector('h1, h2');
      if (heading) {
        const hStyles = window.getComputedStyle(heading);
        tokens.typography.heading.family = hStyles.fontFamily;
        tokens.typography.heading.weight = hStyles.fontWeight;
        tokens.typography.heading.sizes = {
          xl: hStyles.fontSize,
          lg: hStyles.fontSize,
          md: hStyles.fontSize,
          sm: hStyles.fontSize
        };
        tokens.typography.heading.lineHeight = hStyles.lineHeight;
        tokens.typography.heading.letterSpacing = hStyles.letterSpacing;
        tokens.typography.heading.transform = hStyles.textTransform;
      }
      
      const body = hero.querySelector('p');
      if (body) {
        const bStyles = window.getComputedStyle(body);
        tokens.typography.body.family = bStyles.fontFamily;
        tokens.typography.body.weight = bStyles.fontWeight;
        tokens.typography.body.size = bStyles.fontSize;
        tokens.typography.body.lineHeight = bStyles.lineHeight;
        tokens.typography.body.letterSpacing = bStyles.letterSpacing;
      }
    }
    
    // Extract from footer
    const footer = document.querySelector('footer');
    if (footer) {
      const link = footer.querySelector('a');
      if (link) {
        const linkStyles = window.getComputedStyle(link);
        tokens.colors.link = linkStyles.color;
        
        // Simulate hover
        link.style.cssText += '; opacity: 0.8;';
        const hoverStyles = window.getComputedStyle(link);
        tokens.colors.linkHover = hoverStyles.color;
      }
      
      const input = footer.querySelector('input[type="text"], input[type="email"]');
      if (input) {
        const iStyles = window.getComputedStyle(input);
        tokens.controls.input.height = iStyles.height;
        tokens.controls.input.radius = iStyles.borderRadius;
        tokens.controls.input.borderWidth = iStyles.borderWidth;
        tokens.controls.input.borderColor = iStyles.borderColor;
      }
      
      const button = footer.querySelector('button, [type="submit"], .btn, .button');
      if (button) {
        const bStyles = window.getComputedStyle(button);
        tokens.controls.button.height = bStyles.height;
        tokens.controls.button.radius = bStyles.borderRadius;
        tokens.controls.button.borderWidth = bStyles.borderWidth;
        tokens.controls.button.shadow = bStyles.boxShadow;
        tokens.colors.btnBg = bStyles.backgroundColor;
        tokens.colors.btnText = bStyles.color;
        tokens.colors.btnBorder = bStyles.borderColor;
      }
    }
    
    // Layout tokens
    const container = document.querySelector('.container, .wrapper, main > div, body > div');
    if (container) {
      const cStyles = window.getComputedStyle(container);
      tokens.layout.maxWidth = cStyles.maxWidth;
      tokens.layout.sectionPaddingY = cStyles.paddingTop;
    }
    
    // Check for rotated menu label
    const menuLabel = document.querySelector('[class*="rotate"], [style*="rotate"]');
    if (menuLabel && menuLabel.textContent.toLowerCase().includes('menu')) {
      tokens.decor.rotatedMenuLabel.exists = true;
      tokens.decor.rotatedMenuLabel.angle = -90;
    }
    
    return tokens;
  });
}

async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const baseUrl = 'https://www.normandpllc.com';
  
  // Step 1: Discover pages
  console.log('Discovering pages...');
  const pages = await discoverPages(page, baseUrl, 1);
  
  await fs.writeFile(
    path.join('output', 'sitemap.json'),
    JSON.stringify({ pages, crawledAt: new Date().toISOString() }, null, 2)
  );
  
  // Step 2: Process each page at different viewports
  const allTokens = {};
  
  for (const pageUrl of pages.slice(0, 3)) { // Process first 3 pages
    const slug = new URL(pageUrl).pathname.replace(/\//g, '-').replace(/^-|-$/g, '') || 'home';
    console.log(`Processing ${slug}...`);
    
    for (const viewport of VIEWPORTS) {
      console.log(`  Viewport: ${viewport.name}`);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(pageUrl, { waitUntil: 'networkidle' });
      
      // Segment blocks (only for xl viewport)
      if (viewport.name === 'xl') {
        const blocks = await segmentPageIntoBlocks(page);
        await fs.writeFile(
          path.join('output', `${slug}.blocks.json`),
          JSON.stringify(blocks, null, 2)
        );
        
        // Take screenshot
        await page.screenshot({ 
          path: path.join('output', `${slug}.png`),
          fullPage: true 
        });
      }
      
      // Extract tokens
      const tokens = await extractDesignTokens(page, viewport);
      if (!allTokens[viewport.name]) allTokens[viewport.name] = {};
      allTokens[viewport.name][slug] = tokens;
    }
  }
  
  // Save tokens
  await fs.writeFile(
    path.join('output', 'tokens.json'),
    JSON.stringify(allTokens.xl.home || {}, null, 2)
  );
  
  await fs.writeFile(
    path.join('output', 'tokens.breakpoints.json'),
    JSON.stringify(allTokens, null, 2)
  );
  
  await browser.close();
  console.log('Crawling and segmentation complete!');
}

main().catch(console.error);