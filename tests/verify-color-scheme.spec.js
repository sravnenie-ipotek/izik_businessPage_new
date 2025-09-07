const { test, expect } = require('@playwright/test');

test.describe('Verify Color Scheme Matches normandpllc.com', () => {
  
  test('Compare color schemes across all pages', async ({ page }) => {
    const pages = [
      { name: 'Class Action', url: 'class-action.html' },
      { name: 'Privacy', url: 'privacy-class-action.html' },
      { name: 'Consumer', url: 'consumer-protection.html' },
      { name: 'Insurance', url: 'insurance-class-action.html' }
    ];
    
    console.log('\n====== COLOR SCHEME VERIFICATION ======\n');
    console.log('Expected (from normandpllc.com):');
    console.log('  Hero background: #ffffff (white)');
    console.log('  Body background: #ffffff (white)');
    console.log('  Section alternating: #ffffff / #f2f2f2');
    console.log('  Primary accent: #fc5a2b (orange)');
    console.log('  Text color: #010101 (near-black)');
    console.log('\n=======================================\n');
    
    for (const pageInfo of pages) {
      console.log(`\n=== ${pageInfo.name} Page ===`);
      await page.goto(`http://localhost:4000/${pageInfo.url}`);
      await page.waitForLoadState('networkidle');
      
      // Check hero section background
      const heroBackground = await page.evaluate(() => {
        const hero = document.querySelector('.hero-section');
        if (hero) {
          const styles = window.getComputedStyle(hero);
          return {
            background: styles.background,
            backgroundColor: styles.backgroundColor,
            backgroundImage: styles.backgroundImage
          };
        }
        return null;
      });
      
      console.log('Hero section:');
      if (heroBackground) {
        console.log('  Background color:', heroBackground.backgroundColor);
        console.log('  Has gradient:', heroBackground.backgroundImage.includes('gradient') ? '❌ YES (should be NO)' : '✅ NO');
        
        // Check if it's white
        const isWhite = heroBackground.backgroundColor === 'rgb(255, 255, 255)' || 
                       heroBackground.backgroundColor === '#ffffff' ||
                       heroBackground.backgroundColor === 'white';
        console.log('  Is white background:', isWhite ? '✅ YES' : '❌ NO (should be white)');
      }
      
      // Check body background
      const bodyBackground = await page.evaluate(() => {
        const styles = window.getComputedStyle(document.body);
        return styles.backgroundColor;
      });
      console.log('\nBody background:', bodyBackground);
      
      // Check for colored themes (should not exist)
      const coloredElements = await page.evaluate(() => {
        const results = [];
        
        // Check for blue theme (privacy)
        const blueElements = document.querySelectorAll('[style*="#2c5aa0"], [style*="rgb(44, 90, 160)"]');
        if (blueElements.length > 0) {
          results.push({ color: 'blue (#2c5aa0)', count: blueElements.length });
        }
        
        // Check for green theme (consumer)
        const greenElements = document.querySelectorAll('[style*="#2e7d32"], [style*="rgb(46, 125, 50)"]');
        if (greenElements.length > 0) {
          results.push({ color: 'green (#2e7d32)', count: greenElements.length });
        }
        
        // Check for teal theme (insurance)
        const tealElements = document.querySelectorAll('[style*="#00695c"], [style*="rgb(0, 105, 92)"]');
        if (tealElements.length > 0) {
          results.push({ color: 'teal (#00695c)', count: tealElements.length });
        }
        
        // Check CSS for theme colors
        const sheets = Array.from(document.styleSheets);
        const hasColorTheme = sheets.some(sheet => {
          try {
            const rules = Array.from(sheet.cssRules || []);
            return rules.some(rule => {
              if (rule.style) {
                const css = rule.style.cssText;
                return css.includes('#2c5aa0') || // blue
                       css.includes('#2e7d32') || // green
                       css.includes('#00695c') || // teal
                       css.includes('linear-gradient'); // gradients
              }
              return false;
            });
          } catch (e) {
            return false;
          }
        });
        
        return { results, hasColorTheme };
      });
      
      console.log('\nColor theme check:');
      if (coloredElements.results.length > 0) {
        coloredElements.results.forEach(item => {
          console.log(`  ❌ Found ${item.color} in ${item.count} elements`);
        });
      } else {
        console.log('  ✅ No colored themes found in inline styles');
      }
      
      if (coloredElements.hasColorTheme) {
        console.log('  ❌ Page has color theme in CSS (should use standard colors)');
      }
      
      // Check sections for alternating backgrounds
      const sections = await page.evaluate(() => {
        const sectionElements = document.querySelectorAll('section, .content-section');
        return Array.from(sectionElements).map((section, index) => {
          const styles = window.getComputedStyle(section);
          return {
            index,
            backgroundColor: styles.backgroundColor,
            className: section.className
          };
        });
      });
      
      console.log('\nSection backgrounds:');
      sections.forEach(section => {
        const expectedBg = section.index % 2 === 0 ? 'white' : '#f2f2f2';
        const isCorrect = section.backgroundColor === 'rgb(255, 255, 255)' || 
                         section.backgroundColor === 'rgb(242, 242, 242)';
        console.log(`  Section ${section.index}: ${section.backgroundColor} (expected: ${expectedBg})`);
      });
      
      // Check CTA buttons
      const ctaButtons = await page.evaluate(() => {
        const buttons = document.querySelectorAll('.hero-cta, .cta-button, [class*="cta"]');
        return Array.from(buttons).map(btn => {
          const styles = window.getComputedStyle(btn);
          return {
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            text: btn.textContent.trim().substring(0, 30)
          };
        });
      });
      
      if (ctaButtons.length > 0) {
        console.log('\nCTA Buttons:');
        ctaButtons.forEach(btn => {
          const isOrange = btn.backgroundColor.includes('252, 90, 43') || 
                          btn.backgroundColor.includes('#fc5a2b');
          console.log(`  "${btn.text}": ${isOrange ? '✅' : '❌'} ${btn.backgroundColor}`);
        });
      }
    }
    
    console.log('\n====== SUMMARY ======');
    console.log('All pages should have:');
    console.log('  1. White hero backgrounds (no gradients)');
    console.log('  2. White body backgrounds');
    console.log('  3. Orange (#fc5a2b) accent color only');
    console.log('  4. No page-specific color themes');
    console.log('  5. Alternating white/grey sections');
    console.log('=====================\n');
  });
  
  test('Check specific gradient issues', async ({ page }) => {
    const pages = [
      'class-action.html',
      'privacy-class-action.html',
      'consumer-protection.html',
      'insurance-class-action.html'
    ];
    
    console.log('\n=== Gradient Check ===');
    
    for (const pageUrl of pages) {
      await page.goto(`http://localhost:4000/${pageUrl}`);
      
      const gradients = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const gradientElements = [];
        
        elements.forEach(el => {
          const styles = window.getComputedStyle(el);
          if (styles.backgroundImage.includes('gradient') || 
              styles.background.includes('gradient')) {
            gradientElements.push({
              tagName: el.tagName,
              className: el.className,
              background: styles.background.substring(0, 100)
            });
          }
        });
        
        return gradientElements;
      });
      
      console.log(`\n${pageUrl}:`);
      if (gradients.length > 0) {
        console.log(`  ❌ Found ${gradients.length} elements with gradients:`);
        gradients.slice(0, 3).forEach(el => {
          console.log(`    - ${el.tagName}.${el.className}: ${el.background}...`);
        });
      } else {
        console.log('  ✅ No gradient backgrounds found');
      }
    }
  });
});