/**
 * Future Simulator（詳細版 oneLine 対応）E2E
 * - MCP Playwrightでの基本動作確認
 */
import { test, expect } from '@playwright/test';

test('Future Simulator: 基本UIとデータ表示', async ({ page }) => {
  // 1) ページ表示
  await page.goto('http://localhost:8788/public/futuresimulator.html', { waitUntil: 'networkidle', timeout: 30000 });
  await expect(page.locator('text=Future Simulator')).toBeVisible();

  // 2) コア要素の存在
  const hex = page.locator('#hexSelect');
  const line = page.locator('#lineSelect');
  const grid = page.locator('#patternGrid');
  const one = page.locator('#oneLine');
  await expect(hex).toBeVisible();
  await expect(line).toBeVisible();
  await expect(grid).toBeVisible();
  await expect(one).toBeVisible();

  // 3) 既定状態の強制設定: hex=64, line=1, triad=JJJ
  await hex.selectOption('64');
  await line.fill('1');
  // クリックで JJJ を選択
  const jjj = page.locator('#patternGrid .pattern-item', { hasText: 'JJJ' }).first();
  await jjj.click();

  // 4) oneLine が表示されるまで待機（スケルトン解除）
  await page.waitForFunction(() => {
    const el = document.getElementById('oneLine');
    return el && !el.classList.contains('skeleton') && el.textContent && el.textContent.trim().length > 0;
  }, { timeout: 10000 });
  const text64 = await one.textContent();
  expect(text64 || '').toContain('静かに進む'); // hex-64_1_JJJ の一部

  // 5) lineナビ（次へ）→ 値が変わり、テキストが空でない
  await page.click('#nextLine');
  await expect(line).toHaveValue('2');
  await page.waitForFunction(() => {
    const el = document.getElementById('oneLine');
    return el && !el.classList.contains('skeleton') && el.textContent && el.textContent.trim().length > 0;
  }, { timeout: 10000 });
  const textAfterLine = await one.textContent();
  expect((textAfterLine || '').length).toBeGreaterThan(0);

  // 6) パターンNext → テキストが空でない
  await page.click('#nextPattern');
  await page.waitForFunction(() => {
    const el = document.getElementById('oneLine');
    return el && !el.classList.contains('skeleton') && el.textContent && el.textContent.trim().length > 0;
  }, { timeout: 10000 });
  const textAfterPattern = await one.textContent();
  expect((textAfterPattern || '').length).toBeGreaterThan(0);

  // 7) モード切替（簡易）
  await page.click('#mode-simple');
  await expect(page.locator('#mode-simple')).toHaveAttribute('aria-pressed', 'true');
  await page.waitForFunction(() => {
    const el = document.getElementById('oneLine');
    return el && !el.classList.contains('skeleton') && /^series:/.test(el.textContent || '');
  }, { timeout: 10000 });
  const simpleText = await one.textContent();
  expect((simpleText || '')).toMatch(/series:/);

  // 8) 検索 → ヒットがあれば1件クリックで遷移
  await page.click('#mode-detailed');
  await page.fill('#searchInput', '静かに進む');
  await page.click('#searchBtn');
  const searchItem = page.locator('.search-item').first();
  if (await searchItem.count() > 0) {
    await searchItem.click();
    await page.waitForTimeout(300);
    await page.waitForFunction(() => {
      const el = document.getElementById('oneLine');
      return el && !el.classList.contains('skeleton') && el.textContent && el.textContent.trim().length > 0;
    }, { timeout: 10000 });
  }

  // 9) お気に入り登録 → ボタン出現
  await page.click('#favBtn');
  await expect(page.locator('#favList .fav').first()).toBeVisible();

  // 10) アクセシビリティ属性の簡易検査
  await expect(page.locator('#patternGrid')).toHaveAttribute('role','radiogroup');
  const firstRadio = page.locator('#patternGrid .pattern-item').first();
  await expect(firstRadio).toHaveAttribute('role','radio');
});
