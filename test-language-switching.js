const { test, expect } = require('@playwright/test');

test.describe('Language Switching Tests', () => {
  
  test('Website language switching works correctly', async ({ page }) => {
    console.log('🌐 Testing language switching on website...');
    
    // Go to the website
    await page.goto('http://localhost:4000/index.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for animations
    
    // Check initial English content
    const initialTagline = await page.locator('.hero-tagline').textContent();
    const initialTitle = await page.locator('.hero-title').textContent();
    
    console.log('Initial (EN):', { tagline: initialTagline, title: initialTitle });
    expect(initialTagline).toContain('NORMAND');
    expect(initialTitle).toContain('RESULTS');
    
    // Click Russian language button
    await page.click('.lang-btn[data-lang="ru"]');
    await page.waitForTimeout(2000); // Wait for content reload
    
    // Check Russian content
    const ruTagline = await page.locator('.hero-tagline').textContent();
    const ruTitle = await page.locator('.hero-title').textContent();
    
    console.log('Russian (RU):', { tagline: ruTagline, title: ruTitle });
    expect(ruTagline).toContain('НОРМАНД');
    expect(ruTitle).toContain('РЕЗУЛЬТАТЫ');
    
    // Switch back to English
    await page.click('.lang-btn[data-lang="en"]');
    await page.waitForTimeout(2000);
    
    const enTagline = await page.locator('.hero-tagline').textContent();
    const enTitle = await page.locator('.hero-title').textContent();
    
    console.log('Back to English:', { tagline: enTagline, title: enTitle });
    expect(enTagline).toContain('NORMAND');
    expect(enTitle).toContain('RESULTS');
    
    console.log('✅ Language switching works correctly!');
  });
  
  test('Language preference is saved in localStorage', async ({ page }) => {
    console.log('💾 Testing language preference persistence...');
    
    // Go to website and switch to Russian
    await page.goto('http://localhost:4000/index.html');
    await page.waitForLoadState('networkidle');
    await page.click('.lang-btn[data-lang="ru"]');
    await page.waitForTimeout(1000);
    
    // Check localStorage
    const savedLang = await page.evaluate(() => {
      return localStorage.getItem('siteLanguage');
    });
    
    expect(savedLang).toBe('ru');
    console.log('✅ Language preference saved to localStorage');
    
    // Reload page and check if Russian is still active
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const taglineAfterReload = await page.locator('.hero-tagline').textContent();
    expect(taglineAfterReload).toContain('НОРМАНД');
    
    const activeButton = await page.locator('.lang-btn.active').getAttribute('data-lang');
    expect(activeButton).toBe('ru');
    
    console.log('✅ Language preference persists after reload');
  });
  
  test('CMS language switching works', async ({ page }) => {
    console.log('📝 Testing CMS language switching...');
    
    await page.goto('http://localhost:4000/cms.html');
    await page.waitForLoadState('networkidle');
    
    // Check initial language (English)
    const initialContent = await page.locator('#hero-tagline').inputValue();
    console.log('Initial CMS content:', initialContent);
    
    // Switch to Russian in CMS
    await page.selectOption('#cms-language', 'ru');
    await page.waitForTimeout(2000);
    
    // Check Russian content loaded
    const ruContent = await page.locator('#hero-tagline').inputValue();
    console.log('Russian CMS content:', ruContent);
    expect(ruContent).toContain('НОРМАНД');
    
    // Switch back to English
    await page.selectOption('#cms-language', 'en');
    await page.waitForTimeout(2000);
    
    const enContent = await page.locator('#hero-tagline').inputValue();
    console.log('English CMS content:', enContent);
    expect(enContent).toContain('NORMAND');
    
    console.log('✅ CMS language switching works!');
  });
  
  test('No regression in animations', async ({ page }) => {
    console.log('🎭 Testing animations still work...');
    
    await page.goto('http://localhost:4000/index.html');
    await page.waitForLoadState('networkidle');
    
    // Check if elements are visible (opacity > 0 means animations completed)
    const elements = await page.evaluate(() => {
      const tagline = document.querySelector('.hero-tagline');
      const title = document.querySelector('.hero-title');
      const subtitle = document.querySelector('.hero-subtitle');
      
      return {
        taglineOpacity: window.getComputedStyle(tagline).opacity,
        titleOpacity: window.getComputedStyle(title).opacity,
        subtitleOpacity: window.getComputedStyle(subtitle).opacity
      };
    });
    
    expect(parseFloat(elements.taglineOpacity)).toBeGreaterThan(0);
    expect(parseFloat(elements.titleOpacity)).toBeGreaterThan(0);
    expect(parseFloat(elements.subtitleOpacity)).toBeGreaterThan(0);
    
    console.log('✅ Animations still working after language implementation');
  });
});