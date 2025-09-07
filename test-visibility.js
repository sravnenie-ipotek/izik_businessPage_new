const { test, expect } = require('@playwright/test');

test('Verify text is visible on normandpllc-replica.html', async ({ page }) => {
  console.log('🔍 Testing text visibility...');
  
  // Go to the page
  await page.goto('http://localhost:4000/normandpllc-replica.html');
  
  // Wait for content to load and animations to start
  await page.waitForTimeout(4000);
  
  // Check if hero elements exist and get their styles
  const heroElements = await page.evaluate(() => {
    const tagline = document.querySelector('.hero-tagline');
    const title = document.querySelector('.hero-title');
    const subtitle = document.querySelector('.hero-subtitle');
    
    const getElementInfo = (element) => {
      if (!element) return null;
      const computedStyle = window.getComputedStyle(element);
      return {
        text: element.textContent,
        opacity: computedStyle.opacity,
        transform: computedStyle.transform,
        display: computedStyle.display,
        visibility: computedStyle.visibility,
        exists: true
      };
    };
    
    return {
      tagline: getElementInfo(tagline),
      title: getElementInfo(title),
      subtitle: getElementInfo(subtitle)
    };
  });
  
  console.log('Hero elements status:');
  console.log('Tagline:', heroElements.tagline);
  console.log('Title:', heroElements.title);  
  console.log('Subtitle:', heroElements.subtitle);
  
  // Verify elements exist
  expect(heroElements.tagline).toBeTruthy();
  expect(heroElements.title).toBeTruthy();
  expect(heroElements.subtitle).toBeTruthy();
  
  // Verify they have text content
  expect(heroElements.tagline.text).toContain('NORMAND');
  expect(heroElements.title.text).toContain('RESULTS');
  expect(heroElements.subtitle.text).toContain('EXPERTS');
  
  // Check if they are visible (opacity > 0)
  const taglineVisible = parseFloat(heroElements.tagline.opacity) > 0;
  const titleVisible = parseFloat(heroElements.title.opacity) > 0;
  const subtitleVisible = parseFloat(heroElements.subtitle.opacity) > 0;
  
  console.log(`Visibility status: tagline=${taglineVisible}, title=${titleVisible}, subtitle=${subtitleVisible}`);
  
  // Report results
  if (taglineVisible && titleVisible && subtitleVisible) {
    console.log('✅ SUCCESS: All hero text elements are visible!');
  } else {
    console.log('❌ ISSUE: Some hero text elements are not visible');
    console.log('This might be due to CSS opacity: 0 or GSAP animation issues');
    
    // Check console logs for errors
    const logs = await page.evaluate(() => {
      return window.console._logs || [];
    });
    
    console.log('Browser console logs would show animation status...');
  }
  
  // Verify all elements are visible
  expect(taglineVisible).toBe(true);
  expect(titleVisible).toBe(true);
  expect(subtitleVisible).toBe(true);
});