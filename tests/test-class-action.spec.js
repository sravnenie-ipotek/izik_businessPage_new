const { test, expect } = require('@playwright/test');

test.describe('Class Action Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Class Action page
    await page.goto('http://localhost:4000/class-action.html');
    await page.waitForLoadState('networkidle');
  });

  test('Page loads without fatal JavaScript errors', async ({ page }) => {
    const errors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    // Filter out external library errors
    const criticalErrors = errors.filter(error => 
      !error.includes('netlify') && 
      !error.includes('identity') &&
      !error.includes('content.js') &&
      !error.includes('Failed to fetch')
    );
    
    console.log('Class Action page - Critical errors:', criticalErrors);
    expect(criticalErrors.length).toBe(0);
  });

  test('Hero section renders with class action content', async ({ page }) => {
    // Check hero elements exist
    await expect(page.locator('.hero-section')).toBeVisible();
    await expect(page.locator('.hero-title')).toBeVisible();
    
    // Check class action specific content
    await expect(page.locator('.hero-title')).toContainText('CLASS ACTION');
  });

  test('Practice area cards are displayed', async ({ page }) => {
    // Should have 3 main practice area cards
    const practiceCards = page.locator('.practice-area-card');
    await expect(practiceCards).toHaveCount(3);
    
    // Check each card has required elements
    for (let i = 0; i < 3; i++) {
      const card = practiceCards.nth(i);
      await expect(card.locator('h3')).toBeVisible();
      await expect(card.locator('p')).toBeVisible();
      await expect(card.locator('.card-icon')).toBeVisible();
    }
  });

  test('Practice area cards link to specific pages', async ({ page }) => {
    // Privacy card should link to privacy page
    const privacyCard = page.locator('.practice-area-card').filter({ hasText: 'Privacy' });
    const privacyLink = privacyCard.locator('a');
    await expect(privacyLink).toHaveAttribute('href', /privacy-class-action\.html/);
    
    // Consumer Protection card should link to consumer protection page
    const consumerCard = page.locator('.practice-area-card').filter({ hasText: 'Consumer' });
    const consumerLink = consumerCard.locator('a');
    await expect(consumerLink).toHaveAttribute('href', /consumer-protection\.html/);
    
    // Insurance card should link to insurance page  
    const insuranceCard = page.locator('.practice-area-card').filter({ hasText: 'Insurance' });
    const insuranceLink = insuranceCard.locator('a');
    await expect(insuranceLink).toHaveAttribute('href', /insurance-class-action\.html/);
  });

  test('Educational content section is present', async ({ page }) => {
    // Check for educational content about class actions
    await expect(page.locator('.educational-content')).toBeVisible();
    await expect(page.locator('.educational-content h2')).toContainText(/What is a Class Action|Understanding Class Action/i);
  });

  test('Contact form is present and functional', async ({ page }) => {
    const contactForm = page.locator('.contact-form');
    await expect(contactForm).toBeVisible();
    
    // Check form fields
    await expect(contactForm.locator('input[name="name"]')).toBeVisible();
    await expect(contactForm.locator('input[name="email"]')).toBeVisible();
    await expect(contactForm.locator('textarea[name="message"]')).toBeVisible();
    await expect(contactForm.locator('button[type="submit"]')).toBeVisible();
  });

  test('Navigation links work correctly', async ({ page }) => {
    // First open the menu
    const menuToggle = page.locator('#menu-toggle');
    await menuToggle.click();
    
    // Wait for menu animation
    await page.waitForTimeout(500);
    
    // Test navigation back to homepage
    const homeLink = page.locator('.nav-menu a[href="index.html"]');
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/index\.html|localhost:4000\/?$/);
    
    // Navigate back to class action page
    await page.goto('http://localhost:4000/class-action.html');
  });

  test('Page has unique design elements', async ({ page }) => {
    // Check for unique class action page elements
    await expect(page.locator('.hero-section')).toBeVisible();
    await expect(page.locator('.practice-areas-grid')).toBeVisible();
    await expect(page.locator('.educational-content')).toBeVisible();
    
    // Check for law-themed content (justice emoji in content-image)
    await expect(page.locator('.content-image')).toBeVisible();
  });

  test('GSAP animations function properly', async ({ page }) => {
    // Check GSAP is loaded
    const gsapLoaded = await page.evaluate(() => typeof window.gsap !== 'undefined');
    expect(gsapLoaded).toBe(true);
    
    // Check for animated elements
    await page.locator('.practice-area-card').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Cards should be visible after animation
    await expect(page.locator('.practice-area-card').first()).toBeVisible();
  });

  test('Content displays correctly', async ({ page }) => {
    // Check that page content is displayed properly
    const hasHeroContent = await page.locator('.hero-title').textContent();
    expect(hasHeroContent).toContain('CLASS ACTION');
    
    // Check practice area content
    const practiceCards = page.locator('.practice-area-card h3');
    await expect(practiceCards).toHaveCount(3);
    
    // Check that all expected sections have content
    await expect(page.locator('.section-title')).toHaveCount(2); // Practice areas + contact sections
  });

  test('Mobile responsiveness', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Hero should be visible on mobile
    await expect(page.locator('.hero-section')).toBeVisible();
    
    // Practice area cards should stack on mobile
    const cards = page.locator('.practice-area-card');
    const firstCardBox = await cards.first().boundingBox();
    const secondCardBox = await cards.nth(1).boundingBox();
    
    // On mobile, cards should be stacked (second card below first)
    expect(secondCardBox.y).toBeGreaterThan(firstCardBox.y);
  });

  test('SEO and meta tags are present', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Class Action.*Normand PLLC/);
    
    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription.length).toBeGreaterThan(50);
  });

  test('Performance is acceptable', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('http://localhost:4000/class-action.html');
    await page.waitForLoadState('networkidle');
    const endTime = Date.now();
    
    const loadTime = endTime - startTime;
    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    
    console.log(`Class Action page load time: ${loadTime}ms`);
  });
});