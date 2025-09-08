const { chromium } = require('playwright');

// Test viewports
const viewports = [
  { name: 'iPhone SE', width: 320, height: 568 },
  { name: 'iPhone 12', width: 375, height: 812 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'Desktop', width: 1366, height: 768 }
];

// Pages to test
const pages = [
  'index.html',
  'class-action.html',
  'consumer-protection.html',
  'privacy-class-action.html',
  'insurance-class-action.html',
  'contact.html'
];

async function testResponsiveFixes() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('🔍 Testing responsive fixes...\n');
  
  let allPassed = true;
  const results = [];
  
  for (const pagePath of pages) {
    console.log(`\n📄 Testing ${pagePath}:`);
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(`file://${__dirname}/${pagePath}`);
      await page.waitForTimeout(500); // Wait for styles to apply
      
      // Test 1: Check for horizontal scrolling
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = viewport.width;
      const hasHorizontalScroll = bodyWidth > viewportWidth;
      
      // Test 2: Check text size
      const smallTextElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('p, span, div, li, a');
        let smallCount = 0;
        elements.forEach(el => {
          const fontSize = window.getComputedStyle(el).fontSize;
          if (parseFloat(fontSize) < 14 && viewport.width <= 375) {
            smallCount++;
          }
        });
        return smallCount;
      });
      
      // Test 3: Check touch targets
      const smallTouchTargets = await page.evaluate(() => {
        const interactive = document.querySelectorAll('button, a, input[type="submit"]');
        let smallCount = 0;
        interactive.forEach(el => {
          const rect = el.getBoundingClientRect();
          if ((rect.height < 44 || rect.width < 44) && viewport.width <= 375) {
            smallCount++;
          }
        });
        return smallCount;
      });
      
      // Test 4: Check if hamburger menu exists on mobile
      const hasHamburgerMenu = await page.evaluate(() => {
        return viewport.width <= 768 ? 
          !!document.querySelector('.hamburger-menu, .mobile-menu-toggle, [class*="hamburger"]') : 
          true;
      });
      
      const testResult = {
        page: pagePath,
        viewport: viewport.name,
        horizontalScroll: hasHorizontalScroll,
        smallText: smallTextElements,
        smallTouchTargets,
        hamburgerMenu: hasHamburgerMenu || viewport.width > 768
      };
      
      results.push(testResult);
      
      // Report results
      const passed = !hasHorizontalScroll && 
                    smallTextElements === 0 && 
                    smallTouchTargets === 0 && 
                    (hasHamburgerMenu || viewport.width > 768);
                    
      const emoji = passed ? '✅' : '❌';
      console.log(`  ${emoji} ${viewport.name} (${viewport.width}x${viewport.height})`);
      
      if (!passed) {
        allPassed = false;
        if (hasHorizontalScroll) console.log(`     ⚠️  Horizontal scroll detected`);
        if (smallTextElements > 0) console.log(`     ⚠️  ${smallTextElements} elements with small text`);
        if (smallTouchTargets > 0) console.log(`     ⚠️  ${smallTouchTargets} small touch targets`);
        if (!hasHamburgerMenu && viewport.width <= 768) console.log(`     ⚠️  No hamburger menu on mobile`);
      }
    }
  }
  
  await browser.close();
  
  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('✅ ALL TESTS PASSED! Site is fully responsive.');
  } else {
    console.log('⚠️  Some responsive issues remain. Review the details above.');
  }
  console.log('='.repeat(50));
  
  return results;
}

// Run tests
testResponsiveFixes().catch(console.error);