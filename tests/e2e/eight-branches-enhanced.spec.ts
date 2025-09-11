import { test, expect } from '@playwright/test'

test.describe('EightBranches Enhanced UI', () => {
  test('renders 8 cards with enhanced elements (JP)', async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).HAQEI_CONFIG = (window as any).HAQEI_CONFIG || {};
      (window as any).HAQEI_CONFIG.featureFlags = Object.assign(
        { layoutClassic: false, enableTop3Mode: false },
        (window as any).HAQEI_CONFIG.featureFlags || {}
      );
      try {
        const prefs = { summary: true, compare: true, evidence: true, learn: true };
        window.localStorage.setItem('haqei_view_prefs', JSON.stringify(prefs));
      } catch {}
    });

    await page.goto('/future_simulator.html', { waitUntil: 'domcontentloaded' });

    // 入力→分析
    await page.locator('#worryInput').fill('新しい仕事、マジで人足りてない！Aさんは頑張ってくれてるけど、Bさんは全然やる気ないし…。このままだと絶対間に合わない。どうすりゃいいんだ…。焦る。');
    await page.locator('#aiGuessBtn').click();

    // Eight branches root
    const root = page.locator('#eight-branches-display');
    await expect(root).toBeVisible({ timeout: 20000 });

    // グリッドとカード数
    const grid = root.locator('[data-role="branches-grid"]');
    await expect(grid).toBeVisible({ timeout: 20000 });
    await expect(grid.locator(':scope > *')).toHaveCount(8, { timeout: 20000 });

    // Enhanced 要素（少なくとも一枚のカードで確認）
    await expect(root.locator('text=選ぶ理由').first()).toBeVisible({ timeout: 20000 });
    await expect(root.locator('text=次の一手').first()).toBeVisible({ timeout: 20000 });
    // 特徴(卦・爻) は learn セクションに属するため、prefsでONにした上で可視確認
    await expect(root.locator('text=特徴(卦・爻)').first()).toBeVisible({ timeout: 20000 });

    // 意思決定支援
    await expect(root.locator('text=合う条件').first()).toBeVisible();
    await expect(root.locator('text=注意点').first()).toBeVisible();
    await expect(root.locator('text=成果イメージ').first()).toBeVisible();

    // 影響語/影響度/確信度（いずれかが表示されていること）
    const influence = root.locator('text=影響語');
    const influencePct = root.locator('text=影響度');
    const confidence = root.locator('text=確信度');
    await expect(
      influence.or(influencePct).or(confidence).first()
    ).toBeVisible();

    // Step一覧のdetailsが8件
    const details = root.locator('details >> text=詳細を見る');
    await expect(details).toHaveCount(8);
  });
});
