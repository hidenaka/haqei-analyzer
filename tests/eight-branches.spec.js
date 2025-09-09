const { test, expect } = require('@playwright/test');

const PORT = 8789;
const BASE = `http://localhost:${PORT}`;

test.describe('EightBranches UI smoke', () => {
  test('shows Now reason and 8 branch cards', async ({ page }) => {
    await page.goto(`${BASE}/future_simulator.html`, { waitUntil: 'domcontentloaded' });

    // Ensure feature flag is on
    await page.addInitScript(() => {
      window.HAQEI_CONFIG = window.HAQEI_CONFIG || {};
      window.HAQEI_CONFIG.useEightBranches = true;
    });
    await page.reload({ waitUntil: 'domcontentloaded' });

    // Fill input (>10 chars) and analyze
    await page.locator('#worryInput').fill('将来の方向性について迷っています。次の一歩は？');
    await page.locator('#aiGuessBtn').click();

    // Wait for Now reason
    const summary = page.locator('#currentSummary');
    await expect(summary).toBeVisible({ timeout: 20000 });
    await expect(summary).not.toHaveText('', { timeout: 20000 });

    // Wait for 8-branches grid
    const branches = page.locator('#eight-branches-display');
    await expect(branches).toBeVisible({ timeout: 20000 });
    const titles = branches.locator('div', { hasText: /分岐\d+｜(進|変)/ });
    await expect(titles).toHaveCount(8, { timeout: 20000 });

    // Legacy elements hidden
    const keywords = page.locator('#currentKeywords');
    if (await keywords.count()) await expect(keywords).toBeHidden();
    const direction = page.locator('#recommendedDirection');
    if (await direction.count()) await expect(direction).toBeHidden();
  });
});

