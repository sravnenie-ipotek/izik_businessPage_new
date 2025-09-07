const { test, expect } = require('@playwright/test');

test.describe('Insurance Class Action Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Insurance Class Action page
    await page.goto('http://localhost:4000/insurance-class-action.html');
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
    
    console.log('Insurance page - Critical errors:', criticalErrors);
    expect(criticalErrors.length).toBe(0);
  });

  test('Hero section renders with insurance content', async ({ page }) => {
    // Check hero elements exist
    await expect(page.locator('.hero-section')).toBeVisible();
    await expect(page.locator('.hero-title')).toBeVisible();
    await expect(page.locator('.hero-subtitle')).toBeVisible();
    
    // Check insurance specific content
    await expect(page.locator('.hero-tagline')).toContainText('WE ARE RESULTS');
    await expect(page.locator('.hero-title')).toContainText('INSURANCE');
    await expect(page.locator('.hero-subtitle')).toContainText('First Party Insurance Class Actions');
    await expect(page.locator('.hero-description')).toContainText('national reputation as a leader');
  });

  test('All main content sections are present', async ({ page }) => {
    // Check all required section titles
    const expectedSections = [
      'Our Insurance Practice Areas',
      'Representative Cases & Results',
      'Common Insurance Violations We Pursue'
    ];
    
    for (const sectionTitle of expectedSections) {
      await expect(page.locator('.section-title').filter({ hasText: sectionTitle })).toBeVisible();
    }
  });

  test('Focus areas display with correct content', async ({ page }) => {
    // Check focus areas section
    await expect(page.locator('.focus-areas').first()).toBeVisible();
    
    // Check all three main focus cards
    const focusCards = page.locator('.focus-card');
    await expect(focusCards.first()).toBeVisible();
    
    // Check Car Rental Insurance
    await expect(focusCards.first().locator('.focus-title')).toContainText('Car Rental Insurance Class Actions');
    await expect(focusCards.first()).toContainText('unfair and deceptive charges');
    await expect(focusCards.first()).toContainText('supplemental liability insurance');
    
    // Check Property Damage Insurance
    const propertyCard = focusCards.nth(1);
    await expect(propertyCard.locator('.focus-title')).toContainText('Property Damage Insurance Claims');
    await expect(propertyCard).toContainText('Total loss vehicle underpayments');
    
    // Check First Party Insurance
    const firstPartyCard = focusCards.nth(2);
    await expect(firstPartyCard.locator('.focus-title')).toContainText('First Party Insurance Disputes');
    await expect(firstPartyCard).toContainText('Bad faith claim denials');
  });

  test('Representative cases display with settlement amounts', async ({ page }) => {
    // Check cases section
    await expect(page.locator('.cases-section')).toBeVisible();
    
    // Check all three case cards are present
    const caseCards = page.locator('.case-card');
    await expect(caseCards).toHaveCount(3);
    
    // Check State Farm case
    const stateFarmCase = caseCards.first();
    await expect(stateFarmCase.locator('.case-company')).toContainText('State Farm Auto');
    await expect(stateFarmCase.locator('.case-result')).toContainText('Multi-Million Dollar Judgment');
    await expect(stateFarmCase).toContainText('100% recovery for class members');
    
    // Check GEICO case
    const geicoCase = caseCards.nth(1);
    await expect(geicoCase.locator('.case-company')).toContainText('GEICO');
    await expect(geicoCase.locator('.case-result')).toContainText('$79 Million Settlement');
    await expect(geicoCase).toContainText('vehicle total loss claims');
    
    // Check Infinity case
    const infinityCase = caseCards.nth(2);
    await expect(infinityCase.locator('.case-company')).toContainText('Infinity Insurance');
    await expect(infinityCase.locator('.case-result')).toContainText('Groundbreaking Settlement');
    await expect(infinityCase).toContainText('First known settlement of its kind');
  });

  test('Quote section displays with proper styling', async ({ page }) => {
    // Check quote section exists
    const quoteSection = page.locator('.quote-section');
    await expect(quoteSection).toBeVisible();
    
    // Check quote content
    await expect(page.locator('.quote-text')).toContainText('investigate the case, identify the wrong and file suit');
    await expect(page.locator('.quote-author')).toContainText('Normand PLLC Insurance Practice');
  });

  test('Insurance violations grid displays all categories', async ({ page }) => {
    // Check violations section
    const violationsSection = page.locator('.focus-areas').nth(1);
    await expect(violationsSection).toBeVisible();
    
    // Check violation categories in the grid
    const violationCards = violationsSection.locator('.focus-card');
    await expect(violationCards).toHaveCount(3);
    
    // Check Claim Underpayments
    await expect(violationCards.first().locator('.focus-title')).toContainText('Claim Underpayments');
    await expect(violationCards.first()).toContainText('Systematic undervaluation');
    
    // Check Coverage Denials
    await expect(violationCards.nth(1).locator('.focus-title')).toContainText('Coverage Denials');
    await expect(violationCards.nth(1)).toContainText('Bad faith claim denials');
    
    // Check Premium Issues
    await expect(violationCards.nth(2).locator('.focus-title')).toContainText('Premium Issues');
    await expect(violationCards.nth(2)).toContainText('Unauthorized premium increases');
  });

  test('Contact section has all contact methods', async ({ page }) => {
    // Check contact section
    await expect(page.locator('.contact-section')).toBeVisible();
    await expect(page.locator('.contact-header h2')).toContainText('Fight for Your Insurance Rights');
    
    // Check all contact methods
    const contactMethods = page.locator('.contact-method');
    await expect(contactMethods).toHaveCount(3);
    
    // Check phone contact
    await expect(contactMethods.first().locator('h3')).toContainText('Call Today');
    await expect(contactMethods.first().locator('a[href="tel:407-603-6031"]')).toBeVisible();
    
    // Check email contact
    await expect(contactMethods.nth(1).locator('h3')).toContainText('Email Us');
    await expect(contactMethods.nth(1).locator('a[href="mailto:office@normandpllc.com"]')).toBeVisible();
    
    // Check office location
    await expect(contactMethods.nth(2).locator('h3')).toContainText('Office Location');
    await expect(contactMethods.nth(2)).toContainText('3165 McCrory Place');
    await expect(contactMethods.nth(2)).toContainText('Orlando, FL 32803');
  });

  test('Navigation includes active state for Insurance page', async ({ page }) => {
    // Open navigation menu
    const menuToggle = page.locator('#menu-toggle');
    await menuToggle.click();
    await page.waitForTimeout(500);
    
    // Check that Insurance link has active class
    const insuranceLink = page.locator('.nav-submenu a[href="insurance-class-action.html"]');
    await expect(insuranceLink).toHaveClass(/active/);
    
    // Check that Insurance link is visible
    await expect(insuranceLink).toBeVisible();
    await expect(insuranceLink).toContainText('Insurance Class Action');
  });

  test('Insurance teal design elements are present', async ({ page }) => {
    // Check insurance teal color scheme in hero
    const heroSection = page.locator('.hero-section');
    await expect(heroSection).toBeVisible();
    
    // Check teal-themed background pattern
    const heroBackground = await heroSection.evaluate(el => 
      getComputedStyle(el).backgroundImage
    );
    expect(heroBackground).toContain('linear-gradient'); // Gradient present
    
    // Check section titles use insurance teal color
    const firstSectionTitle = page.locator('.section-title').first();
    const titleColor = await firstSectionTitle.evaluate(el => 
      getComputedStyle(el).color
    );
    // Should be insurance teal (#00695c), but in RGB format
    expect(titleColor).toContain('rgb(0, 105, 92)');
  });

  test('GSAP animations function properly', async ({ page }) => {
    // Check GSAP is loaded
    const gsapLoaded = await page.evaluate(() => typeof window.gsap !== 'undefined');
    expect(gsapLoaded).toBe(true);
    
    // Check ScrollTrigger is loaded
    const scrollTriggerLoaded = await page.evaluate(() => typeof window.ScrollTrigger !== 'undefined');
    expect(scrollTriggerLoaded).toBe(true);
    
    // Check that animated elements become visible
    await page.locator('.cases-section').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Case cards should be visible after animation
    await expect(page.locator('.case-card').first()).toBeVisible();
  });

  test('Custom cursor with insurance theme works on desktop', async ({ page, isMobile }) => {
    if (isMobile) {
      test.skip('Cursor test only applies to desktop');
    }
    
    const cursor = page.locator('#cursor');
    await expect(cursor).toBeAttached();
    
    const cursorInner = cursor.locator('.cursor-inner');
    const cursorOuter = cursor.locator('.cursor-outer');
    
    await expect(cursorInner).toBeAttached();
    await expect(cursorOuter).toBeAttached();
    
    // Move mouse to make cursor visible
    await page.mouse.move(100, 100);
    await page.waitForTimeout(100);
    
    // Check cursor uses insurance teal color
    const cursorInnerBg = await cursorInner.evaluate(el => 
      getComputedStyle(el).backgroundColor
    );
    expect(cursorInnerBg).toContain('rgb(0, 105, 92)'); // Insurance teal
  });

  test('Mobile responsiveness works correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Hero should be visible on mobile
    await expect(page.locator('.hero-section')).toBeVisible();
    
    // Case cards should stack on mobile
    const caseCards = page.locator('.case-card');
    const firstCardBox = await caseCards.first().boundingBox();
    const secondCardBox = await caseCards.nth(1).boundingBox();
    
    // On mobile, second card should be below first card
    expect(secondCardBox.y).toBeGreaterThan(firstCardBox.y);
    
    // Contact methods should stack on mobile
    const contactMethods = page.locator('.contact-method');
    const firstMethodBox = await contactMethods.first().boundingBox();
    const secondMethodBox = await contactMethods.nth(1).boundingBox();
    
    expect(secondMethodBox.y).toBeGreaterThan(firstMethodBox.y);
  });

  test('SEO and meta tags are optimized for insurance', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Insurance Class Action.*First Party Insurance.*Normand PLLC/);
    
    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription).toContain('We are results');
    expect(metaDescription).toContain('National leader');
    expect(metaDescription).toContain('first party insurance');
    expect(metaDescription).toContain('class action');
    
    // Check keywords
    const metaKeywords = await page.locator('meta[name="keywords"]').getAttribute('content');
    expect(metaKeywords).toContain('insurance class action');
    expect(metaKeywords).toContain('first party insurance');
    expect(metaKeywords).toContain('GEICO settlement');
    expect(metaKeywords).toContain('State Farm judgment');
  });

  test('Smooth scroll and anchor links work', async ({ page }) => {
    // Click on consultation CTA
    const ctaButton = page.locator('.hero-cta[href="#consultation"]');
    await ctaButton.click();
    
    // Wait for smooth scroll animation
    await page.waitForTimeout(1500);
    
    // Check that contact section is visible in viewport
    const contactSection = page.locator('.contact-section');
    await expect(contactSection).toBeInViewport();
  });

  test('Cross-browser compatibility - navigation to other pages', async ({ page }) => {
    // Open navigation menu
    const menuToggle = page.locator('#menu-toggle');
    await menuToggle.click();
    await page.waitForTimeout(500);
    
    // Click on Consumer Protection link
    const consumerLink = page.locator('.nav-submenu a[href="consumer-protection.html"]');
    await expect(consumerLink).toBeVisible();
    await consumerLink.click();
    
    // Wait for page load
    await page.waitForLoadState('networkidle');
    
    // Should be on Consumer Protection page
    await expect(page).toHaveURL(/consumer-protection\.html$/);
    await expect(page.locator('.hero-title')).toContainText('CONSUMER PROTECTION');
  });

  test('Performance is acceptable', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('http://localhost:4000/insurance-class-action.html');
    await page.waitForLoadState('networkidle');
    const endTime = Date.now();
    
    const loadTime = endTime - startTime;
    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    
    console.log(`Insurance page load time: ${loadTime}ms`);
  });

  test('Content structure matches normandpllc.com format', async ({ page }) => {
    // Verify the page follows the exact content structure
    
    // Check section order
    const sections = page.locator('section');
    await expect(sections.nth(0)).toHaveClass(/hero-section/);
    await expect(sections.nth(1)).toHaveClass(/content-section/);
    
    // Check that representative cases have proper financial details
    await expect(page.locator('.case-result')).toHaveCount(3);
    await expect(page.locator('.case-result').nth(1)).toContainText('$79 Million');
    
    // Check contact information completeness
    await expect(page.locator('a[href="tel:407-603-6031"]')).toBeVisible();
    await expect(page.locator('a[href="mailto:office@normandpllc.com"]')).toBeVisible();
    await expect(page.getByText('888-974-2175')).toBeVisible(); // Fax number
  });
});