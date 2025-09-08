// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  testMatch: ['test-cms-workflow.js', 'test-visibility.js', 'test-direct-save.js', 'test-language-switching.js', 'test-admin-cms.js', 'tests/normandpllc-system.spec.js', 'tests/comprehensive-site-test.spec.js', 'tests/test-class-action.spec.js', 'tests/test-navigation-flow.spec.js', 'tests/test-simple-navigation.spec.js', 'tests/test-privacy-page.spec.js', 'tests/test-consumer-protection.spec.js', 'tests/test-insurance-class-action.spec.js', 'tests/compare-with-normandpllc.spec.js'],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:4000',
    headless: false, // Run with visible browser
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        ...require('@playwright/test').devices['Desktop Chrome'],
      },
    },
  ],
  webServer: {
    command: 'python3 -m http.server 4000',
    url: 'http://localhost:4000',
    reuseExistingServer: true, // Always reuse existing server
    timeout: 10000,
  },
});