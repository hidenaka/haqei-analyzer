import { test, expect } from '@playwright/test';

// Use the lightweight harness to avoid network/CDN dependencies
const PAGE = '/public/test/harness.html';

async function runOnce(page, text) {
  await page.goto(PAGE, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#worryInput', { state: 'visible' });
  await page.fill('#worryInput', text);
  await page.click('#aiGuessBtn');

  await page.waitForSelector('#lines384Results', { state: 'visible', timeout: 60000 });

  const name = (await page.textContent('#selectedLineName') || '').trim();
  const hex = (await page.textContent('#selectedLineHexagram') || '').trim();
  const conf = (await page.textContent('#lineConfidence') || '').trim();
  const source = (await page.textContent('#lineDataSource') || '').trim();

  // Save a screenshot of the results section
  await page.locator('#lines384Results').screenshot({ path: 'future-simulator-results.png' });

  return { name, hex, conf, source };
}

test('future_simulator: renders mapping results for input text', async ({ page }) => {
  const input = '新しい環境で挑戦し、困難を乗り越えて成長したい。具体的な行動方針を定めたい';
  const res = await runOnce(page, input);
  expect(res.name.length).toBeGreaterThan(0);
  expect(res.hex.length).toBeGreaterThan(0);
  expect(res.conf.length).toBeGreaterThan(0);
  expect(res.source.length).toBeGreaterThan(0);
});

test('future_simulator: determinism check (same input -> same result)', async ({ page }) => {
  const input = 'チームを率いて意思決定し、責任を持って成果を出したい';
  const first = await runOnce(page, input);
  for (let i = 0; i < 3; i++) {
    const r = await runOnce(page, input);
    expect(r.name).toBe(first.name);
    expect(r.hex).toBe(first.hex);
  }
});
