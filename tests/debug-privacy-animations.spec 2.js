const { test, expect } = require('@playwright/test');

test('Debug Privacy page scroll animations', async ({ page }) => {
  await page.goto('http://localhost:4000/privacy-class-action.html');
  await page.waitForTimeout(1000);
  
  // Check initial state
  const initialState = await page.evaluate(() => {
    const cards = document.querySelectorAll('.case-card');
    return Array.from(cards).map((card, i) => ({
      index: i,
      initialOpacity: window.getComputedStyle(card).opacity,
      initialTransform: window.getComputedStyle(card).transform,
      offsetTop: card.offsetTop,
      boundingTop: card.getBoundingClientRect().top,
      windowHeight: window.innerHeight,
      triggerPoint: card.offsetTop - (window.innerHeight * 0.85) // top 85%
    }));
  });
  
  console.log('Initial card states:', initialState);
  
  // Scroll to different positions
  const scrollPositions = [500, 1000, 1500, 2000, 2500, 3000];
  
  for (const position of scrollPositions) {
    await page.evaluate(pos => window.scrollTo(0, pos), position);
    await page.waitForTimeout(1000);
    
    const state = await page.evaluate(() => {
      const cards = document.querySelectorAll('.case-card');
      const scrollY = window.scrollY;
      
      return {
        scrollY,
        cards: Array.from(cards).map((card, i) => ({
          index: i,
          opacity: window.getComputedStyle(card).opacity,
          transform: window.getComputedStyle(card).transform,
          isInView: card.getBoundingClientRect().top < window.innerHeight * 0.85,
          boundingTop: card.getBoundingClientRect().top,
          shouldTrigger: scrollY > (card.offsetTop - window.innerHeight * 0.85)
        }))
      };
    });
    
    console.log(`\nScroll position ${position}:`, state);
  }
  
  // Check if GSAP and ScrollTrigger are working
  const gsapInfo = await page.evaluate(() => {
    return {
      gsapLoaded: typeof window.gsap !== 'undefined',
      scrollTriggerLoaded: typeof window.ScrollTrigger !== 'undefined',
      scrollTriggers: window.ScrollTrigger ? ScrollTrigger.getAll().length : 0
    };
  });
  
  console.log('\nGSAP Info:', gsapInfo);
  
  // Try to manually trigger the animation
  await page.evaluate(() => {
    const cards = document.querySelectorAll('.case-card');
    cards.forEach(card => {
      // Force the animation
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.5
      });
    });
  });
  
  await page.waitForTimeout(1000);
  
  const manualState = await page.evaluate(() => {
    const cards = document.querySelectorAll('.case-card');
    return Array.from(cards).map(card => ({
      opacity: window.getComputedStyle(card).opacity,
      transform: window.getComputedStyle(card).transform
    }));
  });
  
  console.log('\nAfter manual animation:', manualState);
});