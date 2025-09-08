const { test, expect } = require('@playwright/test');

test.describe('Verify Page Animations Working', () => {
  
  test('Class Action page hero animations work on load', async ({ page }) => {
    await page.goto('http://localhost:4000/class-action.html');
    
    // Wait for animations to complete
    await page.waitForTimeout(2000);
    
    // Check hero elements are visible
    const taglineOpacity = await page.locator('.class-action-tagline').evaluate(el => 
      window.getComputedStyle(el).opacity
    );
    const titleOpacity = await page.locator('.class-action-title').evaluate(el => 
      window.getComputedStyle(el).opacity
    );
    const subtitleOpacity = await page.locator('.class-action-subtitle').evaluate(el => 
      window.getComputedStyle(el).opacity
    );
    
    console.log('Class Action animations:');
    console.log('  Tagline opacity:', taglineOpacity);
    console.log('  Title opacity:', titleOpacity);
    console.log('  Subtitle opacity:', subtitleOpacity);
    
    expect(parseFloat(taglineOpacity)).toBeGreaterThan(0.9);
    expect(parseFloat(titleOpacity)).toBeGreaterThan(0.9);
    expect(parseFloat(subtitleOpacity)).toBeGreaterThan(0.9);
  });
  
  test('Privacy page hero animations work on load', async ({ page }) => {
    await page.goto('http://localhost:4000/privacy-class-action.html');
    
    // Wait for animations to complete
    await page.waitForTimeout(2000);
    
    // Check hero elements are visible
    const taglineOpacity = await page.locator('.privacy-tagline').evaluate(el => 
      window.getComputedStyle(el).opacity
    );
    const titleOpacity = await page.locator('.privacy-title').evaluate(el => 
      window.getComputedStyle(el).opacity
    );
    const subtitleOpacity = await page.locator('.privacy-subtitle').evaluate(el => 
      window.getComputedStyle(el).opacity
    );
    
    console.log('Privacy animations:');
    console.log('  Tagline opacity:', taglineOpacity);
    console.log('  Title opacity:', titleOpacity);
    console.log('  Subtitle opacity:', subtitleOpacity);
    
    expect(parseFloat(taglineOpacity)).toBeGreaterThan(0.9);
    expect(parseFloat(titleOpacity)).toBeGreaterThan(0.9);
    expect(parseFloat(subtitleOpacity)).toBeGreaterThan(0.9);
  });
  
  test('Consumer Protection page hero animations work on load', async ({ page }) => {
    await page.goto('http://localhost:4000/consumer-protection.html');
    
    // Wait for animations to complete
    await page.waitForTimeout(2000);
    
    // Check hero elements are visible
    const taglineOpacity = await page.locator('.consumer-tagline').evaluate(el => 
      window.getComputedStyle(el).opacity
    );
    const titleOpacity = await page.locator('.consumer-title').evaluate(el => 
      window.getComputedStyle(el).opacity
    );
    const subtitleOpacity = await page.locator('.consumer-subtitle').evaluate(el => 
      window.getComputedStyle(el).opacity
    );
    
    console.log('Consumer animations:');
    console.log('  Tagline opacity:', taglineOpacity);
    console.log('  Title opacity:', titleOpacity);
    console.log('  Subtitle opacity:', subtitleOpacity);
    
    expect(parseFloat(taglineOpacity)).toBeGreaterThan(0.9);
    expect(parseFloat(titleOpacity)).toBeGreaterThan(0.9);
    expect(parseFloat(subtitleOpacity)).toBeGreaterThan(0.9);
  });
  
  test('Insurance page hero animations work on load', async ({ page }) => {
    await page.goto('http://localhost:4000/insurance-class-action.html');
    
    // Wait for animations to complete
    await page.waitForTimeout(2000);
    
    // Check hero elements are visible
    const taglineOpacity = await page.locator('.hero-tagline').evaluate(el => 
      window.getComputedStyle(el).opacity
    );
    const titleOpacity = await page.locator('.hero-title').evaluate(el => 
      window.getComputedStyle(el).opacity
    );
    const subtitleOpacity = await page.locator('.hero-subtitle').evaluate(el => 
      window.getComputedStyle(el).opacity
    );
    
    console.log('Insurance animations:');
    console.log('  Tagline opacity:', taglineOpacity);
    console.log('  Title opacity:', titleOpacity);
    console.log('  Subtitle opacity:', subtitleOpacity);
    
    expect(parseFloat(taglineOpacity)).toBeGreaterThan(0.9);
    expect(parseFloat(titleOpacity)).toBeGreaterThan(0.9);
    expect(parseFloat(subtitleOpacity)).toBeGreaterThan(0.9);
  });
  
  test('Scroll animations work on all pages', async ({ page }) => {
    const pages = [
      { url: 'class-action.html', cardSelector: '.practice-area-card' },
      { url: 'privacy-class-action.html', cardSelector: '.case-card' },
      { url: 'consumer-protection.html', cardSelector: '.case-card' },
      { url: 'insurance-class-action.html', cardSelector: '.case-card' }
    ];
    
    for (const pageInfo of pages) {
      console.log(`\nTesting scroll animations on ${pageInfo.url}`);
      
      await page.goto(`http://localhost:4000/${pageInfo.url}`);
      await page.waitForTimeout(500);
      
      // Scroll down to trigger animations
      await page.evaluate(() => window.scrollTo(0, 1000));
      await page.waitForTimeout(1500);
      
      // Check if cards are visible
      const cards = await page.locator(pageInfo.cardSelector).all();
      console.log(`  Found ${cards.length} cards`);
      
      if (cards.length > 0) {
        const firstCardOpacity = await cards[0].evaluate(el => 
          window.getComputedStyle(el).opacity
        );
        console.log(`  First card opacity: ${firstCardOpacity}`);
        expect(parseFloat(firstCardOpacity)).toBeGreaterThan(0.5);
      }
    }
  });
  
  test('Check for GSAP errors in console', async ({ page }) => {
    const errors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('gsap')) {
        errors.push(msg.text());
      }
    });
    
    // Visit all pages
    const pages = [
      'class-action.html',
      'privacy-class-action.html',
      'consumer-protection.html',
      'insurance-class-action.html'
    ];
    
    for (const pageUrl of pages) {
      await page.goto(`http://localhost:4000/${pageUrl}`);
      await page.waitForTimeout(1000);
    }
    
    console.log('GSAP errors found:', errors.length === 0 ? 'None' : errors);
    expect(errors.length).toBe(0);
  });
});