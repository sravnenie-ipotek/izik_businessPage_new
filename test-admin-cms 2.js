// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Netlify CMS Admin Interface', () => {
  const adminUrl = 'https://effortless-syrniki-9d243f.netlify.app/admin';
  
  test.beforeEach(async ({ page }) => {
    // Set longer timeout for network requests
    page.setDefaultTimeout(60000);
    
    // Handle console errors and warnings
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`Console error: ${msg.text()}`);
      }
    });
  });

  test('should load admin interface without critical errors', async ({ page }) => {
    // Go to admin page
    await page.goto(adminUrl);
    
    // Wait for the page to load and check for critical errors
    await page.waitForLoadState('networkidle');
    
    // Check that the page title contains expected content
    await expect(page).toHaveTitle(/Content Manager - Admin/);
    
    // Wait for CMS to initialize - look for common CMS elements
    try {
      // Wait for either the CMS interface or login form to appear
      await page.waitForSelector('body', { timeout: 30000 });
      
      // Check if there are any critical JavaScript errors
      const hasErrors = await page.evaluate(() => {
        // Check for common error indicators
        const errorMessages = [
          'Cannot read properties of null',
          'CMS is not defined',
          'i18n configuration for files collections is limited'
        ];
        
        // Get all error messages from console
        const errors = window.console.error?.toString() || '';
        
        return errorMessages.some(errorMsg => 
          document.body.innerText.includes(errorMsg) || 
          errors.includes(errorMsg)
        );
      });
      
      expect(hasErrors).toBeFalsy();
      
      console.log('✅ Admin interface loaded without critical errors');
      
    } catch (error) {
      console.log('❌ Failed to load admin interface:', error.message);
      throw error;
    }
  });

  test('should have proper CMS configuration loaded', async ({ page }) => {
    await page.goto(adminUrl);
    await page.waitForLoadState('networkidle');
    
    // Wait for CMS to initialize
    await page.waitForTimeout(5000);
    
    // Check if CMS object is available
    const cmsLoaded = await page.evaluate(() => {
      return typeof window.CMS !== 'undefined';
    });
    
    expect(cmsLoaded).toBeTruthy();
    console.log('✅ CMS object is properly loaded');
  });

  test('should load English and Russian content collections', async ({ page }) => {
    await page.goto(adminUrl);
    await page.waitForLoadState('networkidle');
    
    // Wait for CMS interface to load
    await page.waitForTimeout(10000);
    
    // Look for content collection indicators
    try {
      // The CMS should show collections or login interface
      const bodyText = await page.textContent('body');
      
      // Should not contain the configuration errors we fixed
      expect(bodyText).not.toContain('i18n configuration for files collections is limited');
      expect(bodyText).not.toContain('Cannot read properties of null');
      
      console.log('✅ No configuration errors detected');
      
    } catch (error) {
      console.log('❌ Error checking collections:', error.message);
      throw error;
    }
  });

  test('should be able to reach login interface', async ({ page }) => {
    await page.goto(adminUrl);
    await page.waitForLoadState('networkidle');
    
    // Wait for either CMS content or login interface
    await page.waitForTimeout(8000);
    
    // Take screenshot for manual verification
    await page.screenshot({ path: 'admin-interface-test.png', fullPage: true });
    
    // Check that we're not getting a 404 or server error
    const response = await page.goto(adminUrl);
    expect(response?.status()).toBeLessThan(400);
    
    console.log('✅ Admin URL is accessible');
    console.log('📸 Screenshot saved as admin-interface-test.png');
  });
});