const { chromium } = require('playwright');

async function testDesktopIssues() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Test desktop viewport
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('file://' + __dirname + '/index.html');
  await page.waitForTimeout(1000);
  
  console.log('🖥️  DESKTOP LAYOUT ANALYSIS (1366x768)');
  console.log('=' .repeat(50));
  
  const issues = await page.evaluate(() => {
    const problems = [];
    
    // Check hero section layout
    const heroContent = document.querySelector('.hero-content');
    const heroPortrait = document.querySelector('.hero-portrait');
    const heroTitle = document.querySelector('.hero-title');
    
    if (heroContent && heroPortrait) {
      const contentRect = heroContent.getBoundingClientRect();
      const portraitRect = heroPortrait.getBoundingClientRect();
      
      console.log('Hero Content:', {
        left: contentRect.left,
        right: contentRect.right,
        width: contentRect.width
      });
      console.log('Hero Portrait:', {
        left: portraitRect.left,
        right: portraitRect.right,
        width: portraitRect.width
      });
      
      // Check overlap
      if (contentRect.right > portraitRect.left && portraitRect.width > 0) {
        problems.push(`Text overlaps portrait: content right ${contentRect.right} > portrait left ${portraitRect.left}`);
      }
      
      // Check content width
      if (contentRect.width > window.innerWidth * 0.7) {
        problems.push(`Content too wide: ${contentRect.width}px (should be max 60% of ${window.innerWidth}px)`);
      }
    }
    
    if (heroTitle) {
      const fontSize = parseFloat(window.getComputedStyle(heroTitle).fontSize);
      if (fontSize < 60) {
        problems.push(`Hero title too small: ${fontSize}px (should be 70-75px on desktop)`);
      }
    }
    
    // Check hero section positioning
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      const styles = window.getComputedStyle(heroSection);
      console.log('Hero Section styles:', {
        paddingLeft: styles.paddingLeft,
        display: styles.display,
        alignItems: styles.alignItems,
        justifyContent: styles.justifyContent
      });
      
      if (styles.paddingLeft === '24px') {
        problems.push('Hero section has mobile padding on desktop (24px instead of 150px)');
      }
    }
    
    // Check menu positioning
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
      const menuStyles = window.getComputedStyle(menuToggle);
      if (menuStyles.width !== '130px' && menuStyles.position !== 'absolute') {
        problems.push('Menu toggle not positioned as desktop sidebar');
      }
    }
    
    return problems;
  });
  
  console.log('Issues found:');
  if (issues.length === 0) {
    console.log('✅ No desktop layout issues detected');
  } else {
    issues.forEach(issue => console.log(`❌ ${issue}`));
  }
  
  await page.screenshot({ path: 'desktop-test.png' });
  await browser.close();
  
  return issues;
}

testDesktopIssues().catch(console.error);