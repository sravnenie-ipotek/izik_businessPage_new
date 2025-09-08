const { test, expect } = require('@playwright/test');

test('Test Privacy page with proper scroll distance', async ({ page }) => {
  await page.goto('http://localhost:4000/privacy-class-action.html');
  await page.waitForTimeout(1000);
  
  // Get card positions
  const cardInfo = await page.evaluate(() => {
    const cards = document.querySelectorAll('.case-card');
    return {
      cardCount: cards.length,
      firstCardTop: cards[0]?.offsetTop,
      triggerPoint: cards[0] ? cards[0].offsetTop - (window.innerHeight * 0.85) : 0
    };
  });
  
  console.log('Card info:', cardInfo);
  
  // Scroll to the trigger point
  await page.evaluate(scrollY => {
    window.scrollTo({ top: scrollY, behavior: 'smooth' });
  }, cardInfo.triggerPoint + 100); // Add 100px to ensure we pass the trigger
  
  // Wait for animation
  await page.waitForTimeout(2000);
  
  // Check opacity
  const afterScroll = await page.evaluate(() => {
    const cards = document.querySelectorAll('.case-card');
    return Array.from(cards).map(card => ({
      opacity: window.getComputedStyle(card).opacity,
      transform: window.getComputedStyle(card).transform,
      boundingRect: card.getBoundingClientRect().top
    }));
  });
  
  console.log('After scrolling to trigger point:', afterScroll);
  
  // Test should pass now
  expect(parseFloat(afterScroll[0].opacity)).toBeGreaterThan(0.5);
});