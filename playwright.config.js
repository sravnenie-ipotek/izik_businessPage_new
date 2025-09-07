// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  testMatch: ['test-cms-workflow.js', 'test-visibility.js', 'test-direct-save.js', 'test-language-switching.js'],
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