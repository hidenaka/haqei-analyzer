import { test, expect } from '@playwright/test';

const PORT = 8789;
const BASE = `http://localhost:${PORT}`;

test.describe('EightBranches UI smoke', () => {
  test('shows Now reason from line-states and 8 branch cards', async ({ page }) => {
    await page.goto(`${BASE}/future_simulator.html`, { waitUntil: 'domcontentloaded' });

    // Ensure feature flag is on (default true, but set explicitly just in case)
    await page.addInitScript(() => {
      (window as any).HAQEI_CONFIG = (window as any).HAQEI_CONFIG || {};
      (window as any).HAQEI_CONFIG.useEightBranches = true;
    });

    // Reload to apply init script early
    await page.reload({ waitUntil: 'domcontentloaded' });

    // Input > 10 chars and click
    await page.locator('#worryInput').fill('将来の方向性について迷っています。次の一歩は？');
    await page.locator('#aiGuessBtn').click();

    // Wait for loading to finish and current summary to be populated
    const summary = page.locator('#currentSummary');
    await expect(summary).toBeVisible({ timeout: 20000 });
    await expect(summary).not.toHaveText('', { timeout: 20000 });

    // Eight branches container should be present
    const branches = page.locator('#eight-branches-display');
    await expect(branches).toBeVisible({ timeout: 20000 });

    // Expect 8 cards (by title text pattern 分岐n｜)
    const titles = branches.locator('div', { hasText: /分岐\d+｜(進|変)/ });
    await expect(titles).toHaveCount(8, { timeout: 20000 });

    // Ensure no legacy stats are shown (keywords/direction hidden)
    const keywords = page.locator('#currentKeywords');
    const direction = page.locator('#recommendedDirection');
    if (await keywords.count()) {
      await expect(keywords).toBeHidden();
    }
    if (await direction.count()) {
      await expect(direction).toBeHidden();
    }
  });
});

