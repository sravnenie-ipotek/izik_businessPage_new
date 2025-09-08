const { test, expect } = require('@playwright/test');

test.describe('Simple Navigation Test', () => {
  test('Check navigation structure on homepage', async ({ page }) => {
    await page.goto('http://localhost:4000/');
    await page.waitForLoadState('networkidle');
    
    // Open menu
    const menuToggle = page.locator('#menu-toggle');
    await menuToggle.click();
    await page.waitForTimeout(1000);
    
    // Take screenshot to see what's happening
    await page.screenshot({ path: 'test-results/navigation-debug.png' });
    
    // Log all navigation links
    const allLinks = await page.locator('.nav-menu a, .nav-submenu a').all();
    console.log(`Found ${allLinks.length} navigation links`);
    
    for (let i = 0; i < allLinks.length; i++) {
      const href = await allLinks[i].getAttribute('href');
      const text = await allLinks[i].textContent();
      const isVisible = await allLinks[i].isVisible();
      console.log(`Link ${i}: "${text}" -> "${href}" (visible: ${isVisible})`);
    }
    
    // Check if Class Action link exists
    const classActionLink = page.locator('a[href="class-action.html"]');
    const exists = await classActionLink.count();
    console.log(`Class Action link count: ${exists}`);
    
    if (exists > 0) {
      const isVisible = await classActionLink.isVisible();
      const text = await classActionLink.textContent();
      console.log(`Class Action link: "${text}" (visible: ${isVisible})`);
    }
  });
  
  test('Direct navigation to Class Action page', async ({ page }) => {
    await page.goto('http://localhost:4000/class-action.html');
    await page.waitForLoadState('networkidle');
    
    // Check if page loads successfully
    const title = await page.title();
    console.log(`Class Action page title: "${title}"`);
    
    const heroTitle = await page.locator('.hero-title').textContent();
    console.log(`Hero title: "${heroTitle}"`);
    
    expect(heroTitle).toContain('CLASS ACTION');
  });
});