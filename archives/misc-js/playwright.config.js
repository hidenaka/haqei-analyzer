
module.exports = {
  testDir: './.visual-behavior-tests',
  timeout: 30000,
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['iPhone 12'] }
    }
  ],
  reporter: [
    ['html'],
    ['json', { outputFile: '.visual-behavior-tests/results/test-results.json' }]
  ]
};
