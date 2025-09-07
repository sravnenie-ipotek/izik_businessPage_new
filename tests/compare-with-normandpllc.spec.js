const { test, expect } = require('@playwright/test');

test.describe('Compare with normandpllc.com - Flow and Animations', () => {
  
  test('Analyze normandpllc.com animation patterns', async ({ page }) => {
    // Visit normandpllc.com to understand their animations
    await page.goto('https://www.normandpllc.com/class-action');
    await page.waitForLoadState('networkidle');
    
    // Check for GSAP presence
    const hasGSAP = await page.evaluate(() => {
      return typeof window.gsap !== 'undefined';
    });
    console.log('normandpllc.com has GSAP:', hasGSAP);
    
    // Check animation timings on hero
    const heroAnimations = await page.evaluate(() => {
      const hero = document.querySelector('.hero-section, .section-hero, [class*="hero"]');
      if (hero) {
        const styles = window.getComputedStyle(hero);
        return {
          transition: styles.transition,
          transform: styles.transform,
          opacity: styles.opacity,
          animation: styles.animation
        };
      }
      return null;
    });
    console.log('Hero animations:', heroAnimations);
    
    // Check scroll behavior
    const scrollBehavior = await page.evaluate(() => {
      return {
        smoothScroll: document.documentElement.style.scrollBehavior,
        hasScrollTrigger: typeof window.ScrollTrigger !== 'undefined'
      };
    });
    console.log('Scroll behavior:', scrollBehavior);
    
    // Analyze section reveals
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(1000);
    
    const sectionVisibility = await page.evaluate(() => {
      const sections = document.querySelectorAll('section, .section, [class*="section"]');
      return Array.from(sections).map(s => ({
        className: s.className,
        opacity: window.getComputedStyle(s).opacity,
        transform: window.getComputedStyle(s).transform,
        visible: s.getBoundingClientRect().top < window.innerHeight
      }));
    });
    console.log('Section visibility on scroll:', sectionVisibility);
  });
  
  test('Compare Class Action page flow', async ({ browser }) => {
    const context = await browser.newContext();
    
    // Open both pages
    const normandPage = await context.newPage();
    const ourPage = await context.newPage();
    
    await normandPage.goto('https://www.normandpllc.com/class-action');
    await ourPage.goto('http://localhost:4000/class-action.html');
    
    // Compare hero sections
    const normandHero = await normandPage.evaluate(() => {
      const hero = document.querySelector('[class*="hero"], .banner-section, .page-header');
      if (hero) {
        return {
          exists: true,
          text: hero.innerText,
          height: hero.offsetHeight,
          background: window.getComputedStyle(hero).background
        };
      }
      return { exists: false };
    });
    
    const ourHero = await ourPage.evaluate(() => {
      const hero = document.querySelector('.hero-section');
      if (hero) {
        return {
          exists: true,
          text: hero.innerText,
          height: hero.offsetHeight,
          background: window.getComputedStyle(hero).background
        };
      }
      return { exists: false };
    });
    
    console.log('Normand hero:', normandHero);
    console.log('Our hero:', ourHero);
    
    // Compare section structure
    const normandSections = await normandPage.evaluate(() => {
      const sections = document.querySelectorAll('section, .section, [class*="section"]');
      return Array.from(sections).map(s => ({
        className: s.className,
        heading: s.querySelector('h1, h2, h3')?.innerText || 'No heading',
        hasCards: s.querySelectorAll('.card, [class*="card"]').length > 0
      }));
    });
    
    const ourSections = await ourPage.evaluate(() => {
      const sections = document.querySelectorAll('section');
      return Array.from(sections).map(s => ({
        className: s.className,
        heading: s.querySelector('h1, h2, h3')?.innerText || 'No heading',
        hasCards: s.querySelectorAll('.practice-card, .info-box').length > 0
      }));
    });
    
    console.log('Normand sections:', normandSections);
    console.log('Our sections:', ourSections);
    
    await context.close();
  });
  
  test('Check animation timing patterns', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Check our implementation
    await page.goto('http://localhost:4000/class-action.html');
    await page.waitForLoadState('networkidle');
    
    // Verify GSAP is loaded
    const gsapDetails = await page.evaluate(() => {
      if (typeof window.gsap !== 'undefined') {
        return {
          loaded: true,
          version: window.gsap.version,
          hasScrollTrigger: typeof window.ScrollTrigger !== 'undefined'
        };
      }
      return { loaded: false };
    });
    console.log('Our GSAP setup:', gsapDetails);
    
    // Check timeline animations
    const animationDetails = await page.evaluate(() => {
      const details = [];
      
      // Check hero animations
      const heroTitle = document.querySelector('.hero-title');
      if (heroTitle) {
        const style = window.getComputedStyle(heroTitle);
        details.push({
          element: 'hero-title',
          opacity: style.opacity,
          transform: style.transform
        });
      }
      
      // Check cards
      const cards = document.querySelectorAll('.practice-card');
      cards.forEach((card, i) => {
        const style = window.getComputedStyle(card);
        details.push({
          element: `card-${i}`,
          opacity: style.opacity,
          transform: style.transform
        });
      });
      
      return details;
    });
    console.log('Animation states:', animationDetails);
    
    // Trigger scroll animations
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(1000);
    
    const scrolledState = await page.evaluate(() => {
      const cards = document.querySelectorAll('.practice-card');
      return Array.from(cards).map((card, i) => ({
        card: i,
        visible: card.getBoundingClientRect().top < window.innerHeight,
        opacity: window.getComputedStyle(card).opacity
      }));
    });
    console.log('After scroll:', scrolledState);
    
    await context.close();
  });
  
  test('Verify navigation menu behavior', async ({ page }) => {
    await page.goto('http://localhost:4000/class-action.html');
    
    // Check menu structure
    const menuStructure = await page.evaluate(() => {
      const menuToggle = document.querySelector('#menu-toggle, .menu-toggle');
      const navMenu = document.querySelector('#nav-menu, .nav-menu');
      const submenuLinks = document.querySelectorAll('.nav-submenu a');
      
      return {
        hasToggle: !!menuToggle,
        hasMenu: !!navMenu,
        menuItems: Array.from(submenuLinks).map(a => ({
          text: a.innerText,
          href: a.getAttribute('href')
        }))
      };
    });
    console.log('Menu structure:', menuStructure);
    
    // Test menu interaction
    const menuToggle = page.locator('#menu-toggle');
    if (await menuToggle.isVisible()) {
      await menuToggle.click();
      await page.waitForTimeout(500);
      
      const menuVisible = await page.locator('#nav-menu').isVisible();
      console.log('Menu visible after click:', menuVisible);
    }
  });
  
  test('Compare all page animations side by side', async ({ browser }) => {
    const pages = [
      { name: 'Class Action', url: 'class-action.html', normandUrl: 'class-action' },
      { name: 'Privacy', url: 'privacy-class-action.html', normandUrl: 'privacy' },
      { name: 'Consumer', url: 'consumer-protection.html', normandUrl: 'consumer-protection' },
      { name: 'Insurance', url: 'insurance-class-action.html', normandUrl: 'insurance' }
    ];
    
    for (const pageInfo of pages) {
      console.log(`\n=== Checking ${pageInfo.name} ===`);
      
      const context = await browser.newContext();
      const page = await context.newPage();
      
      // Check our page
      await page.goto(`http://localhost:4000/${pageInfo.url}`);
      await page.waitForLoadState('networkidle');
      
      const ourPageDetails = await page.evaluate(() => {
        // Get all animated elements
        const animatedElements = document.querySelectorAll('[class*="hero"], [class*="card"], [class*="section"]');
        
        return {
          totalElements: animatedElements.length,
          gsapLoaded: typeof window.gsap !== 'undefined',
          scrollTriggerLoaded: typeof window.ScrollTrigger !== 'undefined',
          heroBackground: document.querySelector('.hero-section')?.style.background || 'none'
        };
      });
      
      console.log(`Our ${pageInfo.name} page:`, ourPageDetails);
      
      // Scroll to trigger animations
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight / 2);
      });
      await page.waitForTimeout(1000);
      
      const animationState = await page.evaluate(() => {
        const cards = document.querySelectorAll('[class*="card"]');
        return Array.from(cards).slice(0, 3).map(card => ({
          opacity: window.getComputedStyle(card).opacity,
          transform: window.getComputedStyle(card).transform
        }));
      });
      console.log(`Animation state after scroll:`, animationState);
      
      await context.close();
    }
  });
});