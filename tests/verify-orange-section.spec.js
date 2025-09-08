const { test, expect } = require('@playwright/test');

test.describe('Verify Orange Services Section', () => {
  
  test('Check orange section matches reference', async ({ page }) => {
    console.log('\n====== ORANGE SERVICES SECTION VERIFICATION ======\n');
    
    await page.goto('http://localhost:4001/');
    await page.waitForLoadState('networkidle');
    
    // Check orange section
    const orangeSection = await page.locator('.services-orange-section');
    const exists = await orangeSection.count() > 0;
    
    if (exists) {
      const sectionStyles = await orangeSection.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          padding: styles.padding
        };
      });
      
      console.log('Orange Section:');
      console.log('  Background:', sectionStyles.backgroundColor);
      const isOrange = sectionStyles.backgroundColor === 'rgb(252, 90, 43)';
      console.log('  Is Orange (#fc5a2b):', isOrange ? '✅ YES' : '❌ NO');
      
      // Check title
      const title = await page.locator('.services-main-title');
      const titleText = await title.textContent();
      console.log('\nMain Title:', titleText);
      
      // Check content wrapper
      const contentWrapper = await page.locator('.services-content-wrapper');
      const wrapperStyles = await contentWrapper.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          display: styles.display,
          alignItems: styles.alignItems
        };
      });
      
      console.log('\nContent Layout:');
      console.log('  Display:', wrapperStyles.display);
      console.log('  Is Flex:', wrapperStyles.display === 'flex' ? '✅ YES' : '❌ NO');
      
      // Check for image
      const hasImage = await page.locator('.services-image img').count() > 0;
      console.log('  Has Image on Right:', hasImage ? '✅ YES' : '❌ NO');
      
      // Check privacy overlap section
      const privacySection = await page.locator('.privacy-overlap-section');
      const hasPrivacy = await privacySection.count() > 0;
      
      if (hasPrivacy) {
        const privacyTitle = await page.locator('.privacy-overlap-title').textContent();
        console.log('\nPrivacy Overlap Section:');
        console.log('  Title:', privacyTitle.replace(/\\s+/g, ' '));
      }
    }
    
    // Check white service cards section
    const cardsSection = await page.locator('.service-cards-section');
    const hasCards = await cardsSection.count() > 0;
    
    if (hasCards) {
      const cardsSectionStyles = await cardsSection.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor
        };
      });
      
      console.log('\nService Cards Section:');
      console.log('  Background:', cardsSectionStyles.backgroundColor);
      const isWhite = cardsSectionStyles.backgroundColor === 'rgb(255, 255, 255)';
      console.log('  Is White:', isWhite ? '✅ YES' : '❌ NO');
      
      // Count cards
      const cardCount = await page.locator('.service-card').count();
      console.log('  Number of Cards:', cardCount);
      
      // Check each card
      const cards = await page.locator('.service-card');
      for (let i = 0; i < cardCount; i++) {
        const card = cards.nth(i);
        const title = await card.locator('h3').textContent();
        console.log(`  Card ${i + 1}: ${title}`);
      }
    }
    
    console.log('\n====== SUMMARY ======');
    console.log('Expected Structure:');
    console.log('  1. Orange background section with text/image');
    console.log('  2. Privacy overlap content in orange section');
    console.log('  3. White background section with 3 service cards');
    console.log('=====================\n');
  });
});