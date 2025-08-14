const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './',
  testMatch: 'test-64-hexagram-actual-playwright.cjs',
  timeout: 60000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  
  reporter: [
    ['html', { outputFolder: 'playwright-report-64-hexagram' }],
    ['json', { outputFile: 'test-results-64-hexagram.json' }]
  ],
  
  use: {
    baseURL: 'http://localhost:8090',
    headless: false,
    screenshot: 'always',
    video: 'retain-on-failure',
    trace: 'on-first-retry'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
  
  // webServerを無効にして既存のサーバーを使用
  // webServer: undefined
});