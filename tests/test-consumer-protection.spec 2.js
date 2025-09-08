const { test, expect } = require('@playwright/test');

test.describe('Consumer Protection Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Consumer Protection page
    await page.goto('http://localhost:4000/consumer-protection.html');
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
    
    console.log('Consumer Protection page - Critical errors:', criticalErrors);
    expect(criticalErrors.length).toBe(0);
  });

  test('Hero section renders with consumer protection content', async ({ page }) => {
    // Check hero elements exist
    await expect(page.locator('.hero-section')).toBeVisible();
    await expect(page.locator('.hero-title')).toBeVisible();
    await expect(page.locator('.hero-subtitle')).toBeVisible();
    
    // Check consumer protection specific content
    await expect(page.locator('.hero-title')).toContainText('CONSUMER PROTECTION');
    await expect(page.locator('.hero-subtitle')).toContainText('Consumer Class Actions');
    await expect(page.locator('.hero-tagline')).toContainText('CONSUMER JUSTICE');
    await expect(page.locator('.hero-description')).toContainText('Protecting Your Consumer Rights');
  });

  test('Legal framework section is present and comprehensive', async ({ page }) => {
    // Check legal framework section exists
    await expect(page.locator('.legal-framework')).toBeVisible();
    
    // Check section title
    await expect(page.locator('.legal-framework h2')).toContainText('Legal Framework for Consumer Protection');
    
    // Check Florida statute references
    await expect(page.locator('.legal-framework')).toContainText('Florida Deceptive and Unfair Trade Practices Act (FDUTPA)');
    await expect(page.locator('.legal-framework')).toContainText('Chapter 501, Florida Statutes');
    await expect(page.locator('.legal-framework')).toContainText('Magnuson-Moss Warranty Act');
    await expect(page.locator('.legal-framework')).toContainText('Fair Credit Reporting Act (FCRA)');
    await expect(page.locator('.legal-framework')).toContainText('Truth in Lending Act (TILA)');
  });

  test('All main content sections are present', async ({ page }) => {
    // Check all required section titles
    const expectedSections = [
      'Legal Framework for Consumer Protection',
      'Types of Consumer Protection Cases',
      'Recent Case Examples',
      'Common Consumer Protection Violations',
      'How to Pursue a Consumer Protection Claim'
    ];
    
    for (const sectionTitle of expectedSections) {
      await expect(page.locator('.section-title').filter({ hasText: sectionTitle })).toBeVisible();
    }
  });

  test('Case example cards display with settlement details', async ({ page }) => {
    // Check case examples section
    await expect(page.locator('.case-examples')).toBeVisible();
    
    // Check all three case cards are present
    const caseCards = page.locator('.case-card');
    await expect(caseCards).toHaveCount(3);
    
    // Check Avis/Budget case
    const avisCase = caseCards.first();
    await expect(avisCase.locator('.case-title')).toContainText('Car Rental Overcharges');
    await expect(avisCase.locator('.case-company')).toContainText('Avis/Budget');
    await expect(avisCase.locator('.case-settlement')).toContainText('$8.2 Million');
    await expect(avisCase.locator('.case-description')).toContainText('hidden fees and deceptive billing');
    
    // Check Airlines case
    const airlinesCase = caseCards.nth(1);
    await expect(airlinesCase.locator('.case-title')).toContainText('Airline Fee Deception');
    await expect(airlinesCase.locator('.case-company')).toContainText('Major Airlines');
    await expect(airlinesCase.locator('.case-settlement')).toContainText('$12.5 Million');
    await expect(airlinesCase.locator('.case-description')).toContainText('undisclosed baggage fees');
    
    // Check Bank Fees case
    const bankCase = caseCards.nth(2);
    await expect(bankCase.locator('.case-title')).toContainText('Bank Overdraft Practices');
    await expect(bankCase.locator('.case-company')).toContainText('National Banks');
    await expect(bankCase.locator('.case-settlement')).toContainText('$15 Million');
    await expect(bankCase.locator('.case-description')).toContainText('manipulating transaction order');
  });

  test('Violations list boxes with detailed categories are present', async ({ page }) => {
    // Check violations info boxes exist
    const violationsSection = page.locator('.violations-list');
    await expect(violationsSection).toBeVisible();
    
    // Check violation categories
    const violationBoxes = page.locator('.violation-category');
    await expect(violationBoxes).toHaveCount(4);
    
    // Check Deceptive Advertising
    await expect(violationBoxes.first().locator('h3')).toContainText('Deceptive Advertising');
    await expect(violationBoxes.first().locator('li')).toHaveCount(4);
    
    // Check Unfair Business Practices
    await expect(violationBoxes.nth(1).locator('h3')).toContainText('Unfair Business Practices');
    await expect(violationBoxes.nth(1).locator('li')).toHaveCount(4);
    
    // Check Financial Services Violations
    await expect(violationBoxes.nth(2).locator('h3')).toContainText('Financial Services Violations');
    await expect(violationBoxes.nth(2).locator('li')).toHaveCount(3);
    
    // Check Product/Service Issues
    await expect(violationBoxes.nth(3).locator('h3')).toContainText('Product/Service Issues');
    await expect(violationBoxes.nth(3).locator('li')).toHaveCount(3);
  });

  test('Contact section has all contact methods', async ({ page }) => {
    // Check contact section
    await expect(page.locator('.contact-section')).toBeVisible();
    await expect(page.locator('.contact-header h2')).toContainText('Protect Your Consumer Rights');
    
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

  test('Navigation includes active state for Consumer Protection page', async ({ page }) => {
    // Open navigation menu
    const menuToggle = page.locator('#menu-toggle');
    await menuToggle.click();
    await page.waitForTimeout(500);
    
    // Check that Consumer Protection link has active class
    const consumerLink = page.locator('.nav-submenu a[href="consumer-protection.html"]');
    await expect(consumerLink).toHaveClass(/active/);
    
    // Check that Consumer Protection link is visible
    await expect(consumerLink).toBeVisible();
    await expect(consumerLink).toContainText('Consumer Protection');
  });

  test('Consumer protection green design elements are present', async ({ page }) => {
    // Check consumer protection green color scheme in hero
    const heroSection = page.locator('.hero-section');
    await expect(heroSection).toBeVisible();
    
    // Check consumer-themed background pattern
    const heroBackground = await heroSection.evaluate(el => 
      getComputedStyle(el).backgroundImage
    );
    expect(heroBackground).toContain('data:image/svg+xml'); // SVG pattern
    
    // Check section titles use consumer green color
    const firstSectionTitle = page.locator('.section-title').first();
    const titleColor = await firstSectionTitle.evaluate(el => 
      getComputedStyle(el).color
    );
    // Should be consumer green (#2e7d32), but in RGB format
    expect(titleColor).toContain('rgb(46, 125, 50)');
  });

  test('GSAP animations function properly', async ({ page }) => {
    // Check GSAP is loaded
    const gsapLoaded = await page.evaluate(() => typeof window.gsap !== 'undefined');
    expect(gsapLoaded).toBe(true);
    
    // Check ScrollTrigger is loaded
    const scrollTriggerLoaded = await page.evaluate(() => typeof window.ScrollTrigger !== 'undefined');
    expect(scrollTriggerLoaded).toBe(true);
    
    // Check that animated elements become visible
    await page.locator('.case-examples').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Case cards should be visible after animation
    await expect(page.locator('.case-card').first()).toBeVisible();
  });

  test('Custom cursor with consumer protection theme works on desktop', async ({ page, isMobile }) => {
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
    
    // Check cursor uses consumer green color
    const cursorInnerBg = await cursorInner.evaluate(el => 
      getComputedStyle(el).backgroundColor
    );
    expect(cursorInnerBg).toContain('rgb(46, 125, 50)'); // Consumer green
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

  test('SEO and meta tags are optimized for consumer protection', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Consumer Protection.*Class Actions.*Consumer Rights.*Normand PLLC/);
    
    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription).toContain('Consumer Justice');
    expect(metaDescription).toContain('consumer rights');
    expect(metaDescription).toContain('unfair practices');
    expect(metaDescription.length).toBeGreaterThan(100);
    
    // Check keywords
    const metaKeywords = await page.locator('meta[name="keywords"]').getAttribute('content');
    expect(metaKeywords).toContain('consumer protection');
    expect(metaKeywords).toContain('unfair practices');
    expect(metaKeywords).toContain('deceptive advertising');
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

  test('Cross-browser compatibility - back to Class Action page', async ({ page }) => {
    // Open navigation menu
    const menuToggle = page.locator('#menu-toggle');
    await menuToggle.click();
    await page.waitForTimeout(500);
    
    // Click on Class Action link
    const classActionLink = page.locator('.nav-submenu a[href="class-action.html"]');
    await expect(classActionLink).toBeVisible();
    await classActionLink.click();
    
    // Wait for page load
    await page.waitForLoadState('networkidle');
    
    // Should be on Class Action page
    await expect(page).toHaveURL(/class-action\.html$/);
    await expect(page.locator('.hero-title')).toContainText('CLASS ACTION LITIGATION');
  });

  test('Performance is acceptable', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('http://localhost:4000/consumer-protection.html');
    await page.waitForLoadState('networkidle');
    const endTime = Date.now();
    
    const loadTime = endTime - startTime;
    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    
    console.log(`Consumer Protection page load time: ${loadTime}ms`);
  });

  test('Content structure matches normandpllc.com format', async ({ page }) => {
    // Verify the page follows the exact content structure
    
    // Check section order
    const sections = page.locator('section');
    await expect(sections.nth(0)).toHaveClass(/hero-section/);
    await expect(sections.nth(1)).toHaveClass(/content-section/);
    
    // Check that legal framework content is properly structured
    await expect(page.locator('.legal-framework ul li')).toHaveCount(5); // 5 legal acts
    
    // Check that case studies have proper financial details
    await expect(page.locator('.case-settlement')).toHaveCount(3);
    await expect(page.locator('.case-settlement').first()).toContainText('$8.2 Million');
    await expect(page.locator('.case-settlement').nth(1)).toContainText('$12.5 Million');
    await expect(page.locator('.case-settlement').nth(2)).toContainText('$15 Million');
    
    // Check violations list completeness
    await expect(page.locator('.violation-category ul li')).toHaveCount(14); // 4+4+3+3 = 14 total violations
    
    // Check contact information completeness
    await expect(page.locator('a[href="tel:407-603-6031"]')).toBeVisible();
    await expect(page.locator('a[href="mailto:office@normandpllc.com"]')).toBeVisible();
    await expect(page.getByText('888-974-2175')).toBeVisible(); // Fax number
  });

  test('Legal framework information is accurate and comprehensive', async ({ page }) => {
    // Check that all key statutes are mentioned
    await expect(page.locator('.legal-framework')).toContainText('501.204');
    await expect(page.locator('.legal-framework')).toContainText('15 U.S.C. § 2301');
    await expect(page.locator('.legal-framework')).toContainText('15 U.S.C. § 1681');
    await expect(page.locator('.legal-framework')).toContainText('15 U.S.C. § 1601');
    
    // Check damage information
    await expect(page.locator('.legal-framework')).toContainText('actual damages');
    await expect(page.locator('.legal-framework')).toContainText('attorney\'s fees');
    await expect(page.locator('.legal-framework')).toContainText('injunctive relief');
  });
});