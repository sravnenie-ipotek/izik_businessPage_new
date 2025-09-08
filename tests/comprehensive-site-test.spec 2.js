const { test, expect } = require('@playwright/test');

test.describe('Comprehensive Site Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the site
    await page.goto('http://localhost:4000/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('Page loads without fatal JavaScript errors', async ({ page }) => {
    const errors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait a bit for any async errors
    await page.waitForTimeout(2000);
    
    // Filter out external library errors (Netlify, etc.)
    const criticalErrors = errors.filter(error => 
      !error.includes('netlify') && 
      !error.includes('identity') &&
      !error.includes('content.js') && // External Netlify CMS file
      !error.includes('Failed to fetch') // Network errors from external services
    );
    
    console.log('All errors:', errors);
    console.log('Critical errors:', criticalErrors);
    
    expect(criticalErrors.length).toBe(0);
  });

  test('Hero section renders correctly', async ({ page }) => {
    // Check hero elements exist
    await expect(page.locator('.hero-tagline')).toBeVisible();
    await expect(page.locator('.hero-subtitle')).toBeVisible();  
    await expect(page.locator('.hero-title')).toBeVisible();
    await expect(page.locator('.hero-secondary')).toBeVisible();
    
    // Check hero content
    await expect(page.locator('.hero-tagline')).toHaveText('NORMAND');
    await expect(page.locator('.hero-subtitle')).toHaveText('EXPERTS IN CLASS ACTION');
    await expect(page.locator('.hero-title')).toHaveText('WE ARE RESULTS');
  });

  test('Navigation menu functions correctly', async ({ page }) => {
    const menuToggle = page.locator('#menu-toggle');
    const navigation = page.locator('#main-navigation');
    
    // Menu should be initially closed
    await expect(navigation).not.toHaveClass(/active/);
    
    // Click to open menu
    await menuToggle.click();
    await expect(navigation).toHaveClass(/active/);
    
    // Test menu items are visible
    const menuItems = page.locator('.nav-menu a');
    await expect(menuItems).toHaveCount(4);
    
    // Test submenu items are visible  
    const submenuItems = page.locator('.nav-submenu a');
    await expect(submenuItems).toHaveCount(3);
  });

  test('Menu closes when clicking on navigation links', async ({ page }) => {
    const menuToggle = page.locator('#menu-toggle');
    const navigation = page.locator('#main-navigation');
    
    // Open menu
    await menuToggle.click();
    await expect(navigation).toHaveClass(/active/);
    
    // Click on a navigation link
    await page.locator('.nav-menu a').first().click();
    
    // Wait for menu animation to complete
    await page.waitForTimeout(500);
    
    // Menu should be closed
    await expect(navigation).not.toHaveClass(/active/);
  });

  test('All section anchor links exist on page', async ({ page }) => {
    // Check that all the anchor targets exist
    const requiredSections = [
      '#home', '#class-action', '#privacy', 
      '#consumer', '#insurance', '#results', 
      '#team', '#news', '#contact', '#disclaimer', 
      '#privacy-policy'
    ];
    
    for (const sectionId of requiredSections) {
      const section = page.locator(sectionId);
      await expect(section).toBeAttached();
    }
  });

  test('Service cards are present and visible', async ({ page }) => {
    // Scroll to services section to trigger animations
    await page.locator('.services-grid').scrollIntoViewIfNeeded();
    
    const serviceCards = page.locator('.service-card');
    await expect(serviceCards).toHaveCount(3);
    
    // Check each card has required elements
    for (let i = 0; i < 3; i++) {
      const card = serviceCards.nth(i);
      await expect(card.locator('.service-icon')).toBeVisible();
      await expect(card.locator('h3')).toBeVisible();
      await expect(card.locator('p')).toBeVisible();
    }
  });

  test('GSAP animations load and function', async ({ page }) => {
    // Check that GSAP is loaded
    const gsapLoaded = await page.evaluate(() => {
      return typeof window.gsap !== 'undefined';
    });
    expect(gsapLoaded).toBe(true);
    
    // Check ScrollTrigger is loaded
    const scrollTriggerLoaded = await page.evaluate(() => {
      return typeof window.ScrollTrigger !== 'undefined';
    });
    expect(scrollTriggerLoaded).toBe(true);
  });

  test('Content manager loads successfully', async ({ page }) => {
    // Wait for content manager to initialize
    await page.waitForTimeout(1000);
    
    const contentManagerLoaded = await page.evaluate(() => {
      return typeof window.ContentManager !== 'undefined' && 
             window.contentManager !== undefined;
    });
    expect(contentManagerLoaded).toBe(true);
  });

  test('Custom cursor initializes on desktop', async ({ page, isMobile }) => {
    if (isMobile) {
      test.skip('Cursor test only applies to desktop');
    }
    
    const cursor = page.locator('#cursor');
    await expect(cursor).toBeVisible();
    
    const cursorInner = cursor.locator('.cursor-inner');
    const cursorOuter = cursor.locator('.cursor-outer');
    
    await expect(cursorInner).toBeVisible();
    await expect(cursorOuter).toBeVisible();
  });

  test('Language switcher buttons exist', async ({ page }) => {
    const langButtons = page.locator('.lang-btn');
    await expect(langButtons).toHaveCount(2);
    
    // Check EN button is active by default
    await expect(langButtons.first()).toHaveClass(/active/);
  });

  test('Header scroll effect works', async ({ page }) => {
    const header = page.locator('.site-header');
    
    // Initially should not have scrolled class
    await expect(header).not.toHaveClass(/scrolled/);
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 100));
    await page.waitForTimeout(100);
    
    // Should have scrolled class
    await expect(header).toHaveClass(/scrolled/);
    
    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);
    
    // Should not have scrolled class
    await expect(header).not.toHaveClass(/scrolled/);
  });

  test('Page performance is acceptable', async ({ page }) => {
    // Measure page load performance
    const startTime = Date.now();
    await page.goto('http://localhost:4000/');
    await page.waitForLoadState('networkidle');
    const endTime = Date.now();
    
    const loadTime = endTime - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    console.log(`Page load time: ${loadTime}ms`);
  });

  test('No critical accessibility violations', async ({ page }) => {
    // Check for basic accessibility requirements
    
    // Page should have a title
    await expect(page).toHaveTitle(/\w+/);
    
    // All images should have alt attributes (or be decorative)
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const hasAlt = await img.getAttribute('alt');
      const hasAriaLabel = await img.getAttribute('aria-label');
      const isDecorative = await img.getAttribute('role') === 'presentation';
      
      expect(hasAlt !== null || hasAriaLabel !== null || isDecorative).toBe(true);
    }
    
    // Navigation should be keyboard accessible
    const menuToggle = page.locator('#menu-toggle');
    await expect(menuToggle).toBeFocused();
  });

  test('Console warnings are within acceptable limits', async ({ page }) => {
    const warnings = [];
    
    page.on('console', msg => {
      if (msg.type() === 'warn') {
        warnings.push(msg.text());
      }
    });
    
    await page.waitForTimeout(3000);
    
    // Filter out expected warnings from external libraries
    const unexpectedWarnings = warnings.filter(warning => 
      !warning.includes('Cursor element not found') && // Expected on mobile
      !warning.includes('netlify') &&
      !warning.includes('identity') &&
      !warning.includes('elements not found on this page') // Expected from content manager
    );
    
    console.log('All warnings:', warnings);
    console.log('Unexpected warnings:', unexpectedWarnings);
    
    // Should have minimal unexpected warnings
    expect(unexpectedWarnings.length).toBeLessThan(3);
  });
});