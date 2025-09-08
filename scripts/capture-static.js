const playwright = require('playwright');
const fs = require('fs').promises;
const path = require('path');

async function captureStaticHTML() {
  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    javaScriptEnabled: false // Disable JavaScript
  });
  
  const page = await context.newPage();
  
  console.log('📸 Capturing normandpllc.com without JavaScript...');
  await page.goto('https://www.normandpllc.com/', { 
    waitUntil: 'networkidle',
    timeout: 30000 
  });
  
  // Wait a bit for CSS to load
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ 
    path: 'output/normandpllc-static.png',
    fullPage: true 
  });
  
  // Get the HTML
  const html = await page.content();
  await fs.writeFile('output/normandpllc-static.html', html);
  
  console.log('✅ Static capture saved to output/normandpllc-static.png');
  
  // Also capture with JavaScript enabled for comparison
  const contextWithJS = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    javaScriptEnabled: true
  });
  
  const pageWithJS = await contextWithJS.newPage();
  
  console.log('📸 Capturing normandpllc.com with JavaScript...');
  await pageWithJS.goto('https://www.normandpllc.com/', { 
    waitUntil: 'networkidle',
    timeout: 30000 
  });
  
  // Wait for animations
  await pageWithJS.waitForTimeout(5000);
  
  await pageWithJS.screenshot({ 
    path: 'output/normandpllc-dynamic.png',
    fullPage: true 
  });
  
  console.log('✅ Dynamic capture saved to output/normandpllc-dynamic.png');
  
  await browser.close();
}

captureStaticHTML().catch(console.error);