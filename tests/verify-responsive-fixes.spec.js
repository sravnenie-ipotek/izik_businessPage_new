const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Verify Responsive Design Fixes', () => {

  test('Verify fixes are applied - Homepage mobile', async ({ page }) => {
    // Test the homepage with fixes applied
    const testHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Test - Responsive Fixes</title>
  <link rel="stylesheet" href="css/responsive-fixes.css">
  <style>
    /* Basic test styles */
    body { margin: 0; font-family: Arial, sans-serif; }
    .main-navigation { background: #f0f0f0; padding: 10px; }
    .main-navigation ul { list-style: none; margin: 0; padding: 0; display: flex; }
    .main-navigation li { margin-right: 20px; }
    .main-navigation a { text-decoration: none; color: #333; padding: 5px 10px; }
    button { background: #fc5a2b; color: white; border: none; padding: 8px 16px; }
    input { padding: 8px; border: 1px solid #ccc; }
    .small-text { font-size: 12px; }
  </style>
</head>
<body>
  <header>
    <nav class="main-navigation">
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>
  
  <main>
    <h1>Test Page</h1>
    <p>This is regular text that should be readable.</p>
    <p class="small-text">This is small text that should be fixed.</p>
    
    <button>Small Button</button>
    <input type="text" placeholder="Test input">
    
    <form>
      <label>Email:</label>
      <input type="email" placeholder="your@email.com">
      <button type="submit">Submit</button>
    </form>
  </main>
  
  <script src="js/responsive-navigation.js"></script>
</body>
</html>
    `;
    
    // Write test file
    const testPath = path.join(__dirname, '../test-responsive-fixes.html');
    require('fs').writeFileSync(testPath, testHtml);
    
    // Set mobile viewport
    await page.setViewportSize({ width: 320, height: 568 });
    
    // Navigate to test page
    await page.goto(`file://${testPath}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Test 1: Check for horizontal scrolling (should be none)
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    
    console.log(`Scroll width: ${scrollWidth}px, Client width: ${clientWidth}px`);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5); // 5px tolerance
    
    // Test 2: Check minimum font sizes
    const smallTextFontSize = await page.locator('.small-text').evaluate(el => {
      return parseInt(window.getComputedStyle(el).fontSize);
    });
    
    console.log(`Small text font size: ${smallTextFontSize}px`);
    expect(smallTextFontSize).toBeGreaterThanOrEqual(14);
    
    // Test 3: Check button touch targets
    const button = page.locator('button').first();
    const buttonBox = await button.boundingBox();
    
    console.log(`Button size: ${Math.round(buttonBox.width)}x${Math.round(buttonBox.height)}px`);
    expect(buttonBox.width).toBeGreaterThanOrEqual(44);
    expect(buttonBox.height).toBeGreaterThanOrEqual(44);
    
    // Test 4: Check input touch targets
    const input = page.locator('input[type="email"]');
    const inputBox = await input.boundingBox();
    
    console.log(`Input size: ${Math.round(inputBox.width)}x${Math.round(inputBox.height)}px`);
    expect(inputBox.height).toBeGreaterThanOrEqual(44);
    
    // Test 5: Check hamburger menu is created
    await page.waitForTimeout(500); // Wait for JS to run
    const hamburger = await page.locator('.hamburger-menu').isVisible();
    
    console.log(`Hamburger menu visible: ${hamburger}`);
    expect(hamburger).toBe(true);
    
    // Test 6: Check navigation is hidden on mobile
    const navVisible = await page.locator('.main-navigation').isVisible();
    
    console.log(`Navigation visible on mobile: ${navVisible}`);
    expect(navVisible).toBe(false);
    
    // Test 7: Test hamburger menu functionality
    await page.locator('.hamburger-menu').click();
    await page.waitForTimeout(100);
    
    const navVisibleAfterClick = await page.locator('.main-navigation').isVisible();
    console.log(`Navigation visible after hamburger click: ${navVisibleAfterClick}`);
    expect(navVisibleAfterClick).toBe(true);
    
    // Clean up test file
    require('fs').unlinkSync(testPath);
    
    console.log('✅ All responsive fixes verified successfully!');
  });

  test('Verify fixes on desktop - should not interfere', async ({ page }) => {
    // Test the same page on desktop to ensure fixes don't break desktop experience
    const testHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Test - Desktop Responsive Fixes</title>
  <link rel="stylesheet" href="css/responsive-fixes.css">
  <style>
    body { margin: 0; font-family: Arial, sans-serif; }
    .main-navigation { background: #f0f0f0; padding: 10px; }
    .main-navigation ul { list-style: none; margin: 0; padding: 0; display: flex; }
    .main-navigation li { margin-right: 20px; }
    .main-navigation a { text-decoration: none; color: #333; padding: 5px 10px; }
  </style>
</head>
<body>
  <header>
    <nav class="main-navigation">
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>
  
  <main>
    <h1>Desktop Test Page</h1>
    <p>This text should display normally on desktop.</p>
  </main>
  
  <script src="js/responsive-navigation.js"></script>
</body>
</html>
    `;
    
    // Write test file
    const testPath = path.join(__dirname, '../test-desktop-fixes.html');
    require('fs').writeFileSync(testPath, testHtml);
    
    // Set desktop viewport
    await page.setViewportSize({ width: 1366, height: 768 });
    
    // Navigate to test page
    await page.goto(`file://${testPath}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Test 1: Hamburger menu should be hidden on desktop
    const hamburgerVisible = await page.locator('.hamburger-menu').isVisible();
    
    console.log(`Hamburger visible on desktop: ${hamburgerVisible}`);
    expect(hamburgerVisible).toBe(false);
    
    // Test 2: Navigation should be visible on desktop
    const navVisible = await page.locator('.main-navigation').isVisible();
    
    console.log(`Navigation visible on desktop: ${navVisible}`);
    expect(navVisible).toBe(true);
    
    // Clean up test file
    require('fs').unlinkSync(testPath);
    
    console.log('✅ Desktop experience preserved!');
  });

});