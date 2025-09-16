/**
 * Future Simulator（詳細版 oneLine 対応）E2E
 * - MCP Playwrightでの基本動作確認
 */
import { test, expect } from '@playwright/test';

test('future_simulator: 詳細データ（detailed）適用とS1の埋め込み', async ({ page }) => {
  // ページ表示（旧URL）
  await page.goto('http://localhost:8788/public/future_simulator.html', { waitUntil: 'domcontentloaded', timeout: 60000 });

  // Now を 井（hex48）・初爻(line1) に固定（統合分析の結果をモック）
  await page.evaluate(() => {
    window.integratedAnalysisResult = {
      iching: { hexagram: { number: 48, name: '水風井' }, yao: { position: 1, name: '初六' } },
      context: {}
    };
  });

  // 分析開始
  let clicked = false;
  const btn1 = page.locator('#aiGuessBtn');
  if (await btn1.count()) { await btn1.first().click(); clicked = true; }
  if (!clicked) {
    const btn2 = page.getByText('分析を始める', { exact: false });
    if (await btn2.count()) { await btn2.first().click(); clicked = true; }
  }

  // カードが描画されるまで待機
  await page.waitForTimeout(2000);

  // 「今とつながる:」が表示されないこと（置き換え）
  const hasNowLink = await page.locator('text=今とつながる:').count();
  expect(hasNowLink).toBe(0);

  // 8カードに detailed の「到達時の様子:」が表示されることを待機
  await page.waitForSelector('text=到達時の様子:', { timeout: 8000 });
  const anyDetail = await page.locator('text=到達時の様子:').count();
  expect(anyDetail).toBeGreaterThan(0);

  // S1埋め込み（data-test=s1-values）から最初の値が H384_DATA の S1 と一致
  const s1Text = await page.locator('[data-test="s1-values"]').first().textContent();
  expect((s1Text||'').length).toBeGreaterThan(0);
  const firstS1 = Number((s1Text||'').split(',')[0] || 'NaN');
  const expectedS1 = await page.evaluate(() => {
    const data = window.H384_DATA || [];
    // hex48 line1 -> 初六
    const entry = data.find(e => Number(e['卦番号'])===48 && String(e['爻'])==='初六');
    return Number(entry && entry['S1_基本スコア']);
  });
  expect(firstS1).toBe(expectedS1);
});
