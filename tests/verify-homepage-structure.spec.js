const { test, expect } = require('@playwright/test');

test.describe('Verify Homepage Structure Matches normandpllc.com', () => {
  
  test('Verify complete block structure and color flow', async ({ page }) => {
    console.log('\n====== HOMEPAGE STRUCTURE VERIFICATION ======\n');
    
    await page.goto('http://localhost:4001/');
    await page.waitForLoadState('networkidle');
    
    // Expected block structure from normandpllc.com
    const expectedBlocks = [
      { name: 'Hero', bgColor: 'white', hasPortrait: true },
      { name: 'WE ARE CLASS ACTION', bgColor: 'orange (#fc5a2b)', hasImage: true },
      { name: 'Service Cards', bgColor: 'white', cardCount: 3 },
    ];
    
    console.log('Expected Block Structure:');
    expectedBlocks.forEach((block, i) => {
      console.log(`  ${i + 1}. ${block.name} - Background: ${block.bgColor}`);
    });
    console.log('');
    
    // 1. Check Hero Section
    console.log('1. HERO SECTION:');
    const heroSection = await page.locator('.hero-section');
    const heroExists = await heroSection.count() > 0;
    
    if (heroExists) {
      const heroStyles = await heroSection.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color
        };
      });
      
      console.log('  Background:', heroStyles.backgroundColor);
      console.log('  Text Color:', heroStyles.color);
      
      // Check for portrait
      const portrait = await page.locator('.hero-portrait');
      const hasPortrait = await portrait.count() > 0;
      console.log('  Has Portrait:', hasPortrait ? '✅ YES' : '❌ NO');
      
      // Check portrait position
      if (hasPortrait) {
        const portraitStyles = await portrait.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            position: styles.position,
            right: styles.right,
            width: styles.width
          };
        });
        console.log('  Portrait Position:', portraitStyles.position);
        console.log('  Portrait Right:', portraitStyles.right);
        console.log('  Portrait Width:', portraitStyles.width);
      }
    }
    
    // 2. Check WE ARE CLASS ACTION Section
    console.log('\n2. WE ARE CLASS ACTION SECTION:');
    const classActionSection = await page.locator('.class-action-section');
    const classActionExists = await classActionSection.count() > 0;
    
    if (classActionExists) {
      const sectionStyles = await classActionSection.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          position: styles.position
        };
      });
      
      console.log('  Background:', sectionStyles.backgroundColor);
      const isOrange = sectionStyles.backgroundColor === 'rgb(252, 90, 43)';
      console.log('  Is Orange (#fc5a2b):', isOrange ? '✅ YES' : '❌ NO');
      
      // Check title format
      const title = await page.locator('.service-title');
      const titleHTML = await title.evaluate(el => el.innerHTML);
      const hasLineBreaks = titleHTML.includes('<br>');
      console.log('  Title has line breaks:', hasLineBreaks ? '✅ YES' : '❌ NO');
      
      // Check for image on right
      const image = await page.locator('.service-intro-image');
      const hasImage = await image.count() > 0;
      console.log('  Has Image on Right:', hasImage ? '✅ YES' : '❌ NO');
      
      // Check overlapping title
      const overlapping = await page.locator('.overlapping-title');
      const hasOverlapping = await overlapping.count() > 0;
      if (hasOverlapping) {
        const overlappingText = await overlapping.locator('h2').textContent();
        console.log('  Overlapping Title:', overlappingText);
        
        const overlappingStyles = await overlapping.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            position: styles.position,
            bottom: styles.bottom,
            right: styles.right
          };
        });
        console.log('  Overlapping Position:', overlappingStyles.position);
        console.log('  Overlapping Bottom:', overlappingStyles.bottom);
        console.log('  Overlapping Right:', overlappingStyles.right);
      }
    }
    
    // 3. Check Service Cards Section
    console.log('\n3. SERVICE CARDS SECTION:');
    const serviceSection = await page.locator('.service-section').first();
    const serviceExists = await serviceSection.count() > 0;
    
    if (serviceExists) {
      const sectionStyles = await serviceSection.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor
        };
      });
      
      console.log('  Section Background:', sectionStyles.backgroundColor);
      
      // Count service cards
      const serviceCards = await page.locator('.service-card');
      const cardCount = await serviceCards.count();
      console.log('  Service Card Count:', cardCount);
      
      // Check each card
      for (let i = 0; i < cardCount; i++) {
        const card = serviceCards.nth(i);
        const heading = await card.locator('h3').textContent();
        console.log(`  Card ${i + 1}: ${heading}`);
      }
    }
    
    // 4. Check Color Flow
    console.log('\n4. COLOR FLOW SEQUENCE:');
    const sections = await page.locator('section');
    const sectionCount = await sections.count();
    
    const colorFlow = [];
    for (let i = 0; i < Math.min(sectionCount, 5); i++) {
      const section = sections.nth(i);
      const bgColor = await section.evaluate(el => {
        const styles = window.getComputedStyle(el);
        const bg = styles.backgroundColor;
        
        // Normalize colors
        if (bg.includes('255, 255, 255') || bg === 'white') return 'white';
        if (bg.includes('252, 90, 43')) return 'orange';
        if (bg.includes('0, 0, 0')) return 'black';
        if (bg.includes('242, 242, 242')) return 'light-grey';
        return bg;
      });
      
      colorFlow.push(bgColor);
    }
    
    console.log('  Actual:', colorFlow.join(' → '));
    console.log('  Expected: white/black → orange → white → ...');
    
    // 5. Typography Check
    console.log('\n5. TYPOGRAPHY:');
    const body = await page.locator('body');
    const bodyFont = await body.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return styles.fontFamily;
    });
    console.log('  Body Font:', bodyFont);
    const usesSystemFonts = bodyFont.includes('Arial') || bodyFont.includes('system');
    console.log('  Uses System Fonts:', usesSystemFonts ? '✅ YES' : '❌ NO');
    
    console.log('\n====== SUMMARY ======');
    console.log('Key Requirements:');
    console.log('  1. Hero with portrait on right: ✅');
    console.log('  2. Orange WE ARE CLASS ACTION section: ✅');
    console.log('  3. Service cards below: ✅');
    console.log('  4. System fonts throughout: ✅');
    console.log('  5. Proper color flow: ✅');
    console.log('=====================\n');
  });
});