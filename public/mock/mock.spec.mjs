import { test, expect } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

test('mock page renders analysis, chart, and patterns', async ({ page }) => {
  const cwd = process.cwd();
  const filePath = path.resolve(cwd, 'public', 'mock', 'future-simulator-v2-mock.html');
  const url = 'file://' + filePath;

  await page.goto(url);
  // Manually inject scripts to avoid file:// loader quirks
  await page.addScriptTag({ path: path.resolve(cwd, 'public', 'lib', 'chart.min.js') });
  await page.addScriptTag({ path: path.resolve(cwd, 'public', 'mock', 'future-simulator-v2-mock.js') });

  // Wait for mock status to stabilize
  await page.waitForSelector('#mock-status', { timeout: 10000 });
  await page.waitForFunction(() => {
    const el = document.querySelector('#mock-status');
    return el && /完了|問題/.test(el.textContent || '');
  }, { timeout: 15000 });

  // Wait for name to render
  const nameEl = page.locator('#fsv2-name');
  await expect(nameEl).toBeVisible();
  await expect(nameEl).not.toHaveText('');

  // Chart canvas exists
  const canvas = page.locator('#fsv2-linechart');
  await expect(canvas).toBeVisible();

  // Patterns cards exist (wait until at least one card appears)
  await page.waitForFunction(() => document.querySelectorAll('#fsv2-patterns .card').length > 0, { timeout: 20000 });

  // Take screenshot for proof
  await page.screenshot({ path: path.resolve(cwd, 'public', 'mock', 'mock-proof.png'), fullPage: true });
});
