import { test, expect } from "@playwright/test";

test.describe('Line state sentences appear on cards', () => {
  const pagePath = '/future_simulator.html';

  test('cards contain 3-phase state sentences', async ({ page, baseURL }) => {
    const url = (baseURL || 'http://localhost:8788') + pagePath;
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Provide an input and run analysis
    const input = page.locator('#worryInput');
    await expect(input).toHaveCount(1, { timeout: 15000 });
    await input.fill('新しい部署での役割が増え、優先順位付けに悩んでいる。どう進めるべきか検討したい。');
    const btn = page.locator('#aiGuessBtn');
    await expect(btn).toHaveCount(1);
    await btn.click();

    // Wait for cards
    const cards = page.locator('.scenario-card');
    await expect(cards).toHaveCount(8, { timeout: 30000 });

    // Pick first card
    const first = cards.first();
    // The three-phase block should be present
    const phases = first.locator('.three-phase-container');
    await expect(phases).toHaveCount(1);

    // Should have 3 phase headers
    await expect(phases.locator('.phase-header')).toHaveCount(3);

    // Should include at least one state label
    const states = phases.locator('.phase-description :text("状態:")');
    const count = await states.count();
    expect(count).toBeGreaterThan(0);

    // Stage narrations exist and follow formatting rules
    const narrs = phases.locator('.stage-narration');
    await expect(narrs.first()).toHaveCount(1);
    const narrCount = await narrs.count();
    expect(narrCount).toBeGreaterThan(0);

    // Quick checks for parentheses prohibition, polite endings, and length
    const texts = await narrs.allTextContents();
    for (const t of texts) {
      const s = t.trim();
      // No JP parentheses
      expect(s).not.toMatch(/[（）]/);
      // Ends with punctuation and uses polite style
      expect(s).toMatch(/[。]$/);
      expect(s).toMatch(/(です|ます|ません)/);
      // Reasonable length constraint (<= 60 chars)
      expect(s.length).toBeLessThanOrEqual(60);
    }
  });
});
