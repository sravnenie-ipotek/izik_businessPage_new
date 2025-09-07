const { test, expect } = require('@playwright/test');

test.describe('Privacy Class Action Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Privacy Class Action page
    await page.goto('http://localhost:4000/privacy-class-action.html');
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
    
    console.log('Privacy page - Critical errors:', criticalErrors);
    expect(criticalErrors.length).toBe(0);
  });

  test('Hero section renders with privacy-specific content', async ({ page }) => {
    // Check hero elements exist
    await expect(page.locator('.hero-section')).toBeVisible();
    await expect(page.locator('.hero-title')).toBeVisible();
    await expect(page.locator('.hero-subtitle')).toBeVisible();
    
    // Check privacy-specific content
    await expect(page.locator('.hero-title')).toContainText('PRIVACY');
    await expect(page.locator('.hero-subtitle')).toContainText('Privacy Class Actions');
    await expect(page.locator('.hero-tagline')).toContainText('DATA ACCOUNTABILITY');
    await expect(page.locator('.hero-description')).toContainText('Leaders in Data Accountability');
  });

  test('Robert Mueller quote section is present and formatted correctly', async ({ page }) => {
    // Check expert quote section exists
    await expect(page.locator('.expert-quote')).toBeVisible();
    
    // Check quote content
    await expect(page.locator('.quote-text')).toContainText('There are only two types of companies');
    await expect(page.locator('.quote-text')).toContainText('those that have been hacked');
    
    // Check attribution
    await expect(page.locator('.quote-attribution')).toContainText('Robert Mueller');
    await expect(page.locator('.quote-attribution')).toContainText('Former FBI Director');
  });

  test('All main content sections are present', async ({ page }) => {
    // Check all required section titles
    const expectedSections = [
      'Data Privacy & Cybersecurity',
      'Claims Involving Stolen Private Information',
      'What is a Data Breach?',
      'Harm to Consumers from Data Breaches',
      'Data Breach Case Results'
    ];
    
    for (const sectionTitle of expectedSections) {
      await expect(page.locator('.section-title').filter({ hasText: sectionTitle })).toBeVisible();
    }
  });

  test('Information boxes with technical details are present', async ({ page }) => {
    // Check info boxes exist
    const infoBoxes = page.locator('.info-box');
    await expect(infoBoxes).toHaveCount(2);
    
    // Check first info box - Types of Privacy Violations
    await expect(infoBoxes.first().locator('h3')).toContainText('Types of Privacy Violations');
    await expect(infoBoxes.first().locator('li')).toHaveCount(5);
    
    // Check second info box - Common Types of Compromised Data
    await expect(infoBoxes.nth(1).locator('h3')).toContainText('Common Types of Compromised Data');
    await expect(infoBoxes.nth(1).locator('li')).toHaveCount(6);
  });

  test('Case study cards display with settlement amounts', async ({ page }) => {
    // Check case examples section
    await expect(page.locator('.case-examples')).toBeVisible();
    
    // Check both case cards are present
    const caseCards = page.locator('.case-card');
    await expect(caseCards).toHaveCount(2);
    
    // Check Resnick v. AvMed case
    const avmedCase = caseCards.first();
    await expect(avmedCase.locator('.case-title')).toContainText('Resnick v. AvMed');
    await expect(avmedCase.locator('.case-settlement')).toContainText('$3 Million');
    await expect(avmedCase.locator('.case-description')).toContainText('healthcare data breach');
    
    // Check Warcraft case
    const warcraftCase = caseCards.nth(1);
    await expect(warcraftCase.locator('.case-title')).toContainText('Warcraft Text Campaign');
    await expect(warcraftCase.locator('.case-settlement')).toContainText('$19 Million');
    await expect(warcraftCase.locator('.case-description')).toContainText('text message marketing');
  });

  test('Contact section has all contact methods', async ({ page }) => {
    // Check contact section
    await expect(page.locator('.contact-section')).toBeVisible();
    await expect(page.locator('.contact-header h2')).toContainText('Protect Your Privacy Rights');
    
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

  test('Navigation includes active state for Privacy page', async ({ page }) => {
    // Open navigation menu
    const menuToggle = page.locator('#menu-toggle');
    await menuToggle.click();
    await page.waitForTimeout(500);
    
    // Check that Privacy link has active class
    const privacyLink = page.locator('.nav-submenu a[href="privacy-class-action.html"]');
    await expect(privacyLink).toHaveClass(/active/);
    
    // Check that Privacy link is visible
    await expect(privacyLink).toBeVisible();
    await expect(privacyLink).toContainText('Privacy');
  });

  test('Privacy-specific design elements are present', async ({ page }) => {
    // Check privacy blue color scheme in hero
    const heroSection = page.locator('.hero-section');
    await expect(heroSection).toBeVisible();
    
    // Check privacy-themed background pattern
    const heroBackground = await heroSection.evaluate(el => 
      getComputedStyle(el).backgroundImage
    );
    expect(heroBackground).toContain('data:image/svg+xml'); // SVG pattern
    
    // Check section titles use privacy blue color
    const firstSectionTitle = page.locator('.section-title').first();
    const titleColor = await firstSectionTitle.evaluate(el => 
      getComputedStyle(el).color
    );
    // Should be privacy blue (#2c5aa0), but in RGB format
    expect(titleColor).toContain('rgb(44, 90, 160)');
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

  test('Custom cursor with privacy theme works on desktop', async ({ page, isMobile }) => {
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
    
    // Check cursor uses privacy blue color
    const cursorInnerBg = await cursorInner.evaluate(el => 
      getComputedStyle(el).backgroundColor
    );
    expect(cursorInnerBg).toContain('rgb(44, 90, 160)'); // Privacy blue
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

  test('SEO and meta tags are optimized for privacy', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Privacy Class Actions.*Data Breach.*Privacy Rights.*Normand PLLC/);
    
    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription).toContain('Data Accountability');
    expect(metaDescription).toContain('privacy rights');
    expect(metaDescription).toContain('data breach');
    expect(metaDescription.length).toBeGreaterThan(100);
    
    // Check keywords
    const metaKeywords = await page.locator('meta[name="keywords"]').getAttribute('content');
    expect(metaKeywords).toContain('privacy class action');
    expect(metaKeywords).toContain('data breach');
    expect(metaKeywords).toContain('cybersecurity');
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
    await page.goto('http://localhost:4000/privacy-class-action.html');
    await page.waitForLoadState('networkidle');
    const endTime = Date.now();
    
    const loadTime = endTime - startTime;
    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    
    console.log(`Privacy Class Action page load time: ${loadTime}ms`);
  });

  test('Content structure matches normandpllc.com format', async ({ page }) => {
    // Verify the page follows the exact content structure
    
    // Check section order
    const sections = page.locator('section');
    await expect(sections.nth(0)).toHaveClass(/hero-section/);
    await expect(sections.nth(1)).toHaveClass(/content-section/);
    
    // Check that technical content is properly structured
    await expect(page.locator('.info-box ul li')).toHaveCount(11); // 5 + 6 list items
    
    // Check that case studies have proper financial details
    await expect(page.locator('.case-settlement')).toHaveCount(2);
    await expect(page.locator('.case-settlement').first()).toContainText('$3 Million');
    await expect(page.locator('.case-settlement').nth(1)).toContainText('$19 Million');
    
    // Check contact information completeness
    await expect(page.locator('a[href="tel:407-603-6031"]')).toBeVisible();
    await expect(page.locator('a[href="mailto:office@normandpllc.com"]')).toBeVisible();
    await expect(page.getByText('888-974-2175')).toBeVisible(); // Fax number
  });
});