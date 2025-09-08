const { chromium } = require('playwright');

// Mobile viewports to test
const mobileViewports = [
  { name: 'iPhone SE', width: 320, height: 568 },
  { name: 'iPhone 12', width: 375, height: 812 },
  { name: 'iPhone 14 Pro', width: 393, height: 852 },
  { name: 'iPhone Plus', width: 414, height: 896 }
];

// Pages to test
const pages = [
  'index.html',
  'class-action.html',
  'consumer-protection.html',
  'privacy-class-action.html',
  'insurance-class-action.html',
  'contact.html',
  'about.html'
];

async function compareWithNormandPLLC() {
  const browser = await chromium.launch({ headless: false }); // Show browser for visual check
  const context = await browser.newContext();
  
  console.log('📱 Comparing Mobile Responsiveness with normandpllc.com\n');
  console.log('=' .repeat(60));
  
  for (const viewport of mobileViewports) {
    console.log(`\n📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
    console.log('-'.repeat(40));
    
    const page = await context.newPage();
    await page.setViewportSize(viewport);
    
    // Test our site
    for (const pagePath of pages) {
      await page.goto(`file://${__dirname}/${pagePath}`);
      await page.waitForTimeout(1000);
      
      // Check critical mobile issues
      const issues = await page.evaluate((vw) => {
        const problems = [];
        
        // 1. Check hero text overlap
        const heroTitle = document.querySelector('.hero-title, h1');
        if (heroTitle) {
          const rect = heroTitle.getBoundingClientRect();
          const styles = window.getComputedStyle(heroTitle);
          const fontSize = parseFloat(styles.fontSize);
          
          if (fontSize > 60 && vw <= 375) {
            problems.push(`Hero text too large: ${fontSize}px (should be ~54px on mobile)`);
          }
        }
        
        // 2. Check for text overlap
        const overlappingElements = [];
        const allElements = document.querySelectorAll('h1, h2, h3, .hero-title, .hero-subtitle');
        allElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          const parent = el.parentElement;
          if (parent) {
            const parentRect = parent.getBoundingClientRect();
            if (rect.right > parentRect.right || rect.bottom > parentRect.bottom) {
              overlappingElements.push(el.tagName + '.' + el.className);
            }
          }
        });
        if (overlappingElements.length > 0) {
          problems.push(`Text overflow detected: ${overlappingElements.join(', ')}`);
        }
        
        // 3. Check navigation menu
        const menuToggle = document.querySelector('.menu-toggle, .hamburger-menu');
        if (!menuToggle && vw <= 768) {
          problems.push('No mobile menu toggle found');
        }
        
        // 4. Check horizontal scroll
        if (document.body.scrollWidth > vw) {
          problems.push(`Horizontal scroll: body width ${document.body.scrollWidth}px > viewport ${vw}px`);
        }
        
        // 5. Check font sizes
        const textElements = document.querySelectorAll('p, span, div');
        let tooSmallCount = 0;
        textElements.forEach(el => {
          const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
          if (fontSize < 14 && vw <= 375) {
            tooSmallCount++;
          }
        });
        if (tooSmallCount > 5) {
          problems.push(`${tooSmallCount} elements with text < 14px`);
        }
        
        // 6. Check touch targets
        const buttons = document.querySelectorAll('button, a, input[type="submit"]');
        let smallTargets = 0;
        buttons.forEach(el => {
          const rect = el.getBoundingClientRect();
          if ((rect.height < 44 || rect.width < 44) && vw <= 414) {
            smallTargets++;
          }
        });
        if (smallTargets > 0) {
          problems.push(`${smallTargets} touch targets < 44px`);
        }
        
        return problems;
      }, viewport.width);
      
      if (issues.length > 0) {
        console.log(`\n❌ ${pagePath}:`);
        issues.forEach(issue => console.log(`   - ${issue}`));
      } else {
        console.log(`✅ ${pagePath}: Mobile optimized`);
      }
      
      // Take screenshot for visual comparison
      await page.screenshot({ 
        path: `screenshots/${pagePath.replace('.html', '')}-${viewport.width}px.png`,
        fullPage: false 
      });
    }
    
    await page.close();
  }
  
  // Now compare with normandpllc.com
  console.log('\n\n📊 Comparing with normandpllc.com...');
  console.log('=' .repeat(60));
  
  const page = await context.newPage();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('https://www.normandpllc.com');
  await page.waitForTimeout(2000);
  
  const normandFeatures = await page.evaluate(() => {
    const features = {};
    
    // Get hero text size
    const h1 = document.querySelector('h1');
    if (h1) {
      features.heroFontSize = window.getComputedStyle(h1).fontSize;
    }
    
    // Check menu
    features.hasHamburgerMenu = !!document.querySelector('.menu-toggle');
    
    // Get spacing
    const container = document.querySelector('.content-container, .container, main');
    if (container) {
      const styles = window.getComputedStyle(container);
      features.containerPadding = styles.paddingLeft;
    }
    
    // Check font family
    features.bodyFont = window.getComputedStyle(document.body).fontFamily;
    
    return features;
  });
  
  console.log('\n✨ Normandpllc.com Mobile Features:');
  console.log(`   Hero font size: ${normandFeatures.heroFontSize}`);
  console.log(`   Has hamburger menu: ${normandFeatures.hasHamburgerMenu}`);
  console.log(`   Container padding: ${normandFeatures.containerPadding}`);
  console.log(`   Body font: ${normandFeatures.bodyFont}`);
  
  await browser.close();
  
  console.log('\n' + '=' .repeat(60));
  console.log('📋 RECOMMENDATIONS:');
  console.log('1. Reduce hero text size to ~54px on 320px viewport');
  console.log('2. Ensure hamburger menu is visible and functional');
  console.log('3. Add proper container padding (24px on mobile)');
  console.log('4. Fix any text overflow issues');
  console.log('5. Ensure all touch targets are 44x44px minimum');
  console.log('=' .repeat(60));
}

// Create screenshots directory
const fs = require('fs');
if (!fs.existsSync('screenshots')) {
  fs.mkdirSync('screenshots');
}

// Run comparison
compareWithNormandPLLC().catch(console.error);