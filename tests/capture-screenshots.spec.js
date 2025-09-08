const { test } = require('@playwright/test');

test.describe('Capture Screenshots for Comparison', () => {
  
  test('Capture our implementation', async ({ page }) => {
    await page.goto('http://localhost:4001/');
    await page.waitForLoadState('networkidle');
    
    // Scroll to services section
    await page.evaluate(() => {
      document.querySelector('.normand-services').scrollIntoView();
    });
    
    await page.waitForTimeout(1000);
    
    // Take screenshot of services section
    const servicesSection = await page.locator('.normand-services');
    await servicesSection.screenshot({ 
      path: 'screenshots/our-services-section.png',
      fullPage: false 
    });
    
    console.log('Screenshot saved: screenshots/our-services-section.png');
  });
});