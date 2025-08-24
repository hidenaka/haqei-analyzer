import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // 画像サイズを抑制するための設定
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1, // Retinaディスプレイでの2倍化を防ぐ
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        deviceScaleFactor: 1,
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        deviceScaleFactor: 1,
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        deviceScaleFactor: 1,
      },
    },
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        deviceScaleFactor: 1,
      },
    },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        deviceScaleFactor: 1,
      },
    },
  ],

  webServer: {
    command: 'npx http-server public -p 5173 -c-1',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
})