module.exports = {
  testDir: '.',
  testMatch: '**/*test.cjs',
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
      use: { 
        ...require('@playwright/test').devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      }
    }
  ],
  reporter: [
    ['line'],
    ['json', { outputFile: './test-results/test-results.json' }]
  ]
};