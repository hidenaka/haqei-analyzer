import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: '20250816_*.mjs',
  use: {
    baseURL: 'http://localhost:8788',
    headless: false,
    trace: 'on-first-retry',
  },
  // webServerは起動済みのサーバーを使用するため無効
});