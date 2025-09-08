const { test, expect } = require('@playwright/test');

test.describe('Multi-Page Navigation Flow Tests', () => {
  test('Homepage to Class Action page navigation works', async ({ page }) => {
    // Start on homepage
    await page.goto('http://localhost:4000/');
    await page.waitForLoadState('networkidle');
    
    // Verify we're on homepage
    await expect(page.locator('.hero-title')).toContainText('WE ARE RESULTS');
    
    // Open navigation menu
    const menuToggle = page.locator('#menu-toggle');
    await menuToggle.click();
    await page.waitForTimeout(500);
    
    // Click on Class Action link (now managed by ContentManager)
    const classActionLink = page.locator('a[href="class-action.html"]');
    await expect(classActionLink).toBeVisible();
    await classActionLink.click();
    
    // Wait for page load
    await page.waitForLoadState('networkidle');
    
    // Verify we're on Class Action page
    await expect(page).toHaveURL(/class-action\.html$/);
    await expect(page.locator('.hero-title')).toContainText('CLASS ACTION LITIGATION');
    
    // Verify page elements are present
    await expect(page.locator('.practice-areas-grid')).toBeVisible();
    await expect(page.locator('.practice-area-card')).toHaveCount(3);
  });
  
  test('Class Action page back to Homepage navigation works', async ({ page }) => {
    // Start on Class Action page
    await page.goto('http://localhost:4000/class-action.html');
    await page.waitForLoadState('networkidle');
    
    // Verify we're on Class Action page
    await expect(page.locator('.hero-title')).toContainText('CLASS ACTION LITIGATION');
    
    // Open navigation menu
    const menuToggle = page.locator('#menu-toggle');
    await menuToggle.click();
    await page.waitForTimeout(500);
    
    // Click on Home link
    const homeLink = page.locator('a[href="index.html"]');
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    
    // Wait for page load
    await page.waitForLoadState('networkidle');
    
    // Verify we're back on homepage
    await expect(page).toHaveURL(/index\.html$|localhost:4000\/?$/);
    await expect(page.locator('.hero-title')).toContainText('WE ARE RESULTS');
  });
  
  test('All navigation links in header point to correct files', async ({ page }) => {
    await page.goto('http://localhost:4000/');
    
    // Open menu
    const menuToggle = page.locator('#menu-toggle');
    await menuToggle.click();
    await page.waitForTimeout(500);
    
    // Check main menu links
    await expect(page.locator('a[href="index.html"]')).toBeVisible();
    await expect(page.locator('a[href="class-action.html"]')).toBeVisible();
    await expect(page.locator('a[href="status-results.html"]')).toBeVisible();
    await expect(page.locator('a[href="our-team.html"]')).toBeVisible();
    await expect(page.locator('a[href="news-articles.html"]')).toBeVisible();
    
    // Check submenu links
    await expect(page.locator('a[href="privacy-class-action.html"]')).toBeVisible();
    await expect(page.locator('a[href="consumer-protection.html"]')).toBeVisible();
    await expect(page.locator('a[href="insurance-class-action.html"]')).toBeVisible();
    await expect(page.locator('a[href="contact.html"]')).toBeVisible();
    await expect(page.locator('a[href="disclaimer.html"]')).toBeVisible();
    await expect(page.locator('a[href="privacy-policy.html"]')).toBeVisible();
  });
  
  test('Menu animations work consistently across pages', async ({ page }) => {
    // Test on homepage
    await page.goto('http://localhost:4000/');
    await page.waitForLoadState('networkidle');
    
    const menuToggle = page.locator('#menu-toggle');
    const navigation = page.locator('#main-navigation');
    
    // Test menu open animation
    await menuToggle.click();
    await page.waitForTimeout(500);
    await expect(navigation).toHaveClass(/active/);
    
    // Test menu close animation
    await menuToggle.click();
    await page.waitForTimeout(500);
    await expect(navigation).not.toHaveClass(/active/);
    
    // Navigate to Class Action page
    await menuToggle.click();
    await page.waitForTimeout(500);
    await page.locator('a[href="class-action.html"]').click();
    await page.waitForLoadState('networkidle');
    
    // Test menu animations on Class Action page
    const classActionMenuToggle = page.locator('#menu-toggle');
    const classActionNavigation = page.locator('#main-navigation');
    
    // Test menu open animation on new page
    await classActionMenuToggle.click();
    await page.waitForTimeout(500);
    await expect(classActionNavigation).toHaveClass(/active/);
    
    // Test menu close animation on new page
    await classActionMenuToggle.click();
    await page.waitForTimeout(500);
    await expect(classActionNavigation).not.toHaveClass(/active/);
  });
  
  test('Page transitions preserve scroll position and animations', async ({ page }) => {
    // Start on homepage and scroll down
    await page.goto('http://localhost:4000/');
    await page.waitForLoadState('networkidle');
    
    // Let homepage animations complete
    await page.waitForTimeout(2000);
    
    // Navigate to Class Action page
    const menuToggle = page.locator('#menu-toggle');
    await menuToggle.click();
    await page.waitForTimeout(300);
    await page.locator('a[href="class-action.html"]').click();
    await page.waitForLoadState('networkidle');
    
    // Check that Class Action page loads at top
    const scrollPosition = await page.evaluate(() => window.pageYOffset);
    expect(scrollPosition).toBe(0);
    
    // Check that animations are working on Class Action page
    await page.waitForTimeout(1000);
    const heroVisible = await page.locator('.hero-title').isVisible();
    expect(heroVisible).toBe(true);
    
    const practiceCardsVisible = await page.locator('.practice-area-card').first().isVisible();
    expect(practiceCardsVisible).toBe(true);
  });
});