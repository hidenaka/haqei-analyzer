// Playwright E2E test for future_simulator.html
// - Navigates to the page
// - Inputs sample text and runs analysis
// - Verifies key result fields render
// - Checks determinism by repeating the same input
// - Captures a screenshot of the results section

import { test, expect } from '@playwright/test';

const PAGE = '/future_simulator.html';

async function runOnce(page, text) {
  await page.goto(PAGE, { waitUntil: 'domcontentloaded' });
  // Wait input visible
  await page.waitForSelector('#worryInput', { state: 'visible' });
  await page.fill('#worryInput', text);
  await page.click('#aiGuessBtn');

  // Wait for result block to appear
  await page.waitForSelector('#lines384Results', { state: 'visible', timeout: 30000 });
  // Wait core fields
  const name = await page.textContent('#selectedLineName');
  const hex = await page.textContent('#selectedLineHexagram');
  const conf = await page.textContent('#lineConfidence');
  const source = await page.textContent('#lineDataSource');

  return {
    name: (name || '').trim(),
    hex: (hex || '').trim(),
    confidence: (conf || '').trim(),
    dataSource: (source || '').trim(),
  };
}

test('Analyze text -> 386-yao mapping renders expected fields', async ({ page }) => {
  const input = '新しい環境で挑戦し、困難を乗り越えて成長したい。具体的な行動方針を定めたい';
  const res = await runOnce(page, input);

  expect(res.name.length).toBeGreaterThan(0);
  expect(res.hex.length).toBeGreaterThan(0);
  expect(res.confidence.length).toBeGreaterThan(0);
  expect(res.dataSource.length).toBeGreaterThan(0);

  // Metrics panel exists (if wired)
  const hasMetrics = await page.$('#metrics-panel');
  expect(!!hasMetrics).toBeTruthy();

  // Screenshot results block
  await page.locator('#lines384Results').screenshot({ path: 'future-simulator-results.png' });
});

test('Determinism: same input yields same selected line across runs', async ({ page }) => {
  const input = 'チームを率いて意思決定し、責任を持って成果を出したい';
  const first = await runOnce(page, input);
  // Repeat 4 times, expect same selection
  for (let i = 0; i < 4; i++) {
    const r = await runOnce(page, input);
    expect(r.name).toBe(first.name);
    expect(r.hex).toBe(first.hex);
  }
});
