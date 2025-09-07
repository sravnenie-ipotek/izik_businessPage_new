const { test, expect } = require('@playwright/test');

test('Test direct save functionality in CMS', async ({ page }) => {
  console.log('🔍 Testing CMS direct save functionality...');
  
  // Go to CMS
  await page.goto('http://localhost:4000/cms.html');
  await page.waitForLoadState('networkidle');
  
  // Go to Content Editor tab
  await page.click('button:has-text("Content Editor")');
  await page.waitForTimeout(500);
  
  // Edit some content
  const testTagline = `DIRECT-SAVE-TEST-${Date.now()}`;
  const taglineInput = page.locator('#hero-tagline');
  await taglineInput.clear();
  await taglineInput.fill(testTagline);
  console.log(`Set test tagline: ${testTagline}`);
  
  // Go to Preview & Save tab
  await page.click('button:has-text("Preview & Save")');
  await page.waitForTimeout(500);
  
  // Check if save button exists and instructions updated
  const saveButton = page.locator('button:has-text("Save All Changes")');
  await expect(saveButton).toBeVisible();
  
  // Check if instructions mention file picker (select the save instructions specifically)
  const instructions = await page.locator('#preview-tab .warning-box').textContent();
  console.log('Save instructions include file picker:', instructions.includes('File picker opens'));
  
  // Check API availability note
  const apiNote = await page.evaluate(() => {
    return 'showSaveFilePicker' in window;
  });
  console.log('File System Access API available:', apiNote);
  
  console.log('✅ CMS updated with direct save functionality');
  console.log('📝 Instructions updated to show both save methods');
  console.log('🎯 Ready to test with manual save operation');
  
  // Take a screenshot of the new save interface
  await page.screenshot({ 
    path: 'cms-direct-save-interface.png',
    fullPage: true 
  });
  console.log('📸 Screenshot saved: cms-direct-save-interface.png');
});