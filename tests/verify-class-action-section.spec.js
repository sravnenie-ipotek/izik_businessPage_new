const { test, expect } = require('@playwright/test');

test.describe('Verify WE ARE CLASS ACTION Section', () => {
  
  test('Check section layout and styling', async ({ page }) => {
    console.log('\n====== WE ARE CLASS ACTION SECTION VERIFICATION ======\n');
    
    await page.goto('http://localhost:4001/');
    await page.waitForLoadState('networkidle');
    
    // Find the class action section
    const classActionSection = await page.locator('.class-action-section');
    
    // Check background color
    const backgroundColor = await classActionSection.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return styles.backgroundColor;
    });
    
    console.log('Section Background Color:', backgroundColor);
    const isOrangeBackground = backgroundColor === 'rgb(252, 90, 43)' || backgroundColor === '#fc5a2b';
    console.log('Is Orange Background (#fc5a2b):', isOrangeBackground ? '✅ YES' : '❌ NO');
    
    // Check title styling
    const title = await page.locator('.service-title').first();
    const titleText = await title.textContent();
    const titleStyles = await title.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        textTransform: styles.textTransform
      };
    });
    
    console.log('\nTitle:', titleText);
    console.log('Title Color:', titleStyles.color);
    console.log('Title Font Size:', titleStyles.fontSize);
    console.log('Title Font Weight:', titleStyles.fontWeight);
    console.log('Title Text Transform:', titleStyles.textTransform);
    
    // Check if title is black
    const isTitleBlack = titleStyles.color === 'rgb(1, 1, 1)' || titleStyles.color === '#010101';
    console.log('Is Title Black:', isTitleBlack ? '✅ YES' : '❌ NO');
    
    // Check layout structure
    const wrapper = await page.locator('.service-intro-wrapper');
    const wrapperDisplay = await wrapper.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return styles.display;
    });
    
    console.log('\nLayout Display:', wrapperDisplay);
    const isFlexLayout = wrapperDisplay === 'flex';
    console.log('Is Flex Layout:', isFlexLayout ? '✅ YES' : '❌ NO');
    
    // Check if image is on the right
    const imageContainer = await page.locator('.service-intro-image');
    const imageExists = await imageContainer.count() > 0;
    console.log('Image Container Exists:', imageExists ? '✅ YES' : '❌ NO');
    
    // Check overlapping title
    const overlappingTitle = await page.locator('.overlapping-title h2');
    const overlappingExists = await overlappingTitle.count() > 0;
    if (overlappingExists) {
      const overlappingText = await overlappingTitle.textContent();
      console.log('\nOverlapping Title:', overlappingText);
      
      const overlappingStyles = await overlappingTitle.evaluate(el => {
        const styles = window.getComputedStyle(el);
        const parent = el.closest('.overlapping-title');
        const parentStyles = window.getComputedStyle(parent);
        return {
          position: parentStyles.position,
          bottom: parentStyles.bottom,
          right: parentStyles.right,
          fontSize: styles.fontSize,
          color: styles.color
        };
      });
      
      console.log('Overlapping Position:', overlappingStyles.position);
      console.log('Overlapping Bottom:', overlappingStyles.bottom);
      console.log('Overlapping Right:', overlappingStyles.right);
      console.log('Overlapping Font Size:', overlappingStyles.fontSize);
    }
    
    // Check service description
    const description = await page.locator('.service-description').first();
    const descriptionText = await description.textContent();
    console.log('\nDescription Text (first 100 chars):', descriptionText.substring(0, 100) + '...');
    
    const descriptionStyles = await description.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        fontSize: styles.fontSize
      };
    });
    
    console.log('Description Color:', descriptionStyles.color);
    const isDescriptionBlack = descriptionStyles.color === 'rgb(1, 1, 1)' || descriptionStyles.color === '#010101';
    console.log('Is Description Black:', isDescriptionBlack ? '✅ YES' : '❌ NO');
    
    console.log('\n====== SUMMARY ======');
    console.log('Section should have:');
    console.log('  1. Orange background (#fc5a2b):', isOrangeBackground ? '✅' : '❌');
    console.log('  2. Black title text:', isTitleBlack ? '✅' : '❌');
    console.log('  3. Flex layout:', isFlexLayout ? '✅' : '❌');
    console.log('  4. Image on right side:', imageExists ? '✅' : '❌');
    console.log('  5. Overlapping "PRIVACY CLASS" title:', overlappingExists ? '✅' : '❌');
    console.log('  6. Black description text:', isDescriptionBlack ? '✅' : '❌');
    console.log('=====================\n');
  });
});