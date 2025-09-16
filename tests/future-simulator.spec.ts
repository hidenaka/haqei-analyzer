import { test, expect } from '@playwright/test';

// Basic smoke to verify styles and core containers render
test.describe('Future Simulator UI smoke', () => {
  const pagePath = '/future_simulator.html';

  test('loads page and applies dark styles', async ({ page, baseURL }) => {
    const url = (baseURL || 'http://localhost:8788') + pagePath;
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Wait for critical containers (tolerate dynamic insertion)
    await expect(page.locator('#i-ching-container')).toHaveCount(1, { timeout: 15000 });

    // Check computed styles for body
    const styles = await page.evaluate(() => {
      const cs = getComputedStyle(document.body);
      return { bg: cs.backgroundColor, color: cs.color };
    });

    // Expect dark slate background and white-ish text
    // Allow slight variance due to blending: rgb(15, 23, 42)
    expect(styles.bg).toMatch(/rgb\(15,\s*23,\s*42\)/);
    // color can be pure white or close
    expect(styles.color).toMatch(/rgb\(\s*255,\s*255,\s*255\s*\)/);

    // Ensure results containers exist or are created later
    await expect(page.locator('#resultsContainer')).toHaveCount(1, { timeout: 15000 });

    // Take a screenshot for visual confirmation
    await page.screenshot({ path: 'test-results/future-simulator-initial.png', fullPage: true });
  });

  test('runs analysis and renders 8 scenarios', async ({ page, baseURL }) => {
    page.on('console', msg => {
      // echo page logs for debugging
      // eslint-disable-next-line no-console
      console.log(`[browser] ${msg.type()}: ${msg.text()}`);
      if (msg.type() === 'error') throw new Error(`Console error: ${msg.text()}`);
    });
    test.setTimeout(120_000);
    const url = (baseURL || 'http://localhost:8788') + pagePath;
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Input text and trigger analysis
    const input = page.locator('#worryInput');
    const button = page.locator('#aiGuessBtn');
    await expect(input).toHaveCount(1, { timeout: 15000 });
    await input.fill('新しい仕事で人手不足。今のチームでどう乗り切るべきか悩んでいる。');
    await expect(button).toHaveCount(1);
    // Prefer calling Integration orchestrator directly to avoid legacy handlers interference
    await page.evaluate(() => {
      const txt = (document.getElementById('worryInput') as HTMLInputElement)?.value || '';
      // @ts-ignore
      if (window.futureSimulator && typeof window.futureSimulator.performAnalysis === 'function') {
        // @ts-ignore
        window.futureSimulator.performAnalysis(txt);
      } else {
        (document.getElementById('aiGuessBtn') as HTMLButtonElement)?.click();
      }
    });

    // Wait for results area to become visible
    const results = page.locator('#resultArea');
    await results.waitFor({ state: 'visible', timeout: 30000 }).catch(() => {});

    // Eight scenarios container/cards should appear eventually
    const scenariosContainer = page.locator('#eight-scenarios-display, #eight-scenarios-display-container').first();
    await scenariosContainer.waitFor({ state: 'attached', timeout: 45000 });

    // Cards (scoped)
    const cards = scenariosContainer.locator('.scenario-card');
    await expect(cards).toHaveCount(8, { timeout: 10000 });

    // Screenshot after render
    await page.screenshot({ path: 'test-results/future-simulator-after-analysis.png', fullPage: true });
  });

  test('cards show normalized probability and one-liner in detail', async ({ page, baseURL }) => {
    page.on('console', msg => {
      console.log(`[browser] ${msg.type()}: ${msg.text()}`);
      if (msg.type() === 'error') throw new Error(`Console error: ${msg.text()}`);
    });
    const url = (baseURL || 'http://localhost:8788') + pagePath;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.fill('#worryInput', '手元のチームで納期が厳しく、人手不足で困っている。');
    await page.click('#aiGuessBtn');

    const cards = page.locator('.scenario-card');
    await expect(cards).toHaveCount(8, { timeout: 20000 });

    // 最初のカードの確率テキストが0-100%以内
    const firstProbText = await cards.first().locator('.probability-text').innerText();
    const match = firstProbText.match(/([0-9]+\.?[0-9]*)%/);
    expect(match).not.toBeNull();
    const val = parseFloat(match![1]);
    expect(val).toBeGreaterThanOrEqual(0);
    expect(val).toBeLessThanOrEqual(100);

    // カード面の one-liner が表示されている
    const oneliner = cards.first().locator('.scenario-oneliner');
    await expect(oneliner).toHaveCount(1);
    const onelinerText = await oneliner.innerText();
    expect(onelinerText.trim().length).toBeGreaterThan(2);

    // 詳細パネルの one-liner が空でない（カードクリック）
    await cards.first().click();
    const detail = page.locator('#scenario-detail-panel .one-liner');
    await expect(detail).toHaveCount(1, { timeout: 10000 });
    const one = await detail.innerText();
    expect(one.trim().length).toBeGreaterThan(2);
  });

  test('technical brief is collapsible', async ({ page, baseURL }) => {
    const url = (baseURL || 'http://localhost:8788') + pagePath;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    // 技術ブリーフはページに1つだけ存在
    await expect(page.locator('#tech-brief')).toHaveCount(1);
    const tech = page.locator('details#tech-brief > summary');
    await expect(tech).toHaveCount(1);
    await tech.click();
    // After expanding, some known text should be visible
    await expect(page.locator('#tech-brief')).toContainText('386爻データ使用');
  });

  test('accessibility basics: progressbar ARIA and keyboard activation', async ({ page, baseURL }) => {
    const url = (baseURL || 'http://localhost:8788') + pagePath;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.fill('#worryInput', 'アクセシビリティ検証');
    await page.click('#aiGuessBtn');
    const firstCard = page.locator('.scenario-card').first();
    await expect(firstCard).toHaveCount(1);
    const bar = firstCard.locator('.probability-bar[role="progressbar"]');
    await expect(bar).toHaveCount(1);
    const valNow = await bar.getAttribute('aria-valuenow');
    expect(valNow).not.toBeNull();
    const num = parseFloat(valNow || '0');
    expect(num).toBeGreaterThanOrEqual(0);
    expect(num).toBeLessThanOrEqual(100);

    // キーボード操作で詳細を開ける
    await firstCard.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#scenario-detail-panel')).toHaveCount(1);
    // A11y: role=dialog and aria-modal
    const role = await page.locator('#scenario-detail-panel').getAttribute('role');
    expect(role).toBe('dialog');
    const modal = await page.locator('#scenario-detail-panel').getAttribute('aria-modal');
    expect(modal).toBe('true');
    // Escape で閉じてフォーカスがカードへ戻る
    await page.keyboard.press('Escape');
    await expect(page.locator('#scenario-detail-panel')).toBeHidden();
    // Focus check: document.activeElement should be within the first card
    const focusedInCard = await page.evaluate(() => {
      const first = document.querySelector('.scenario-card');
      return first ? first.contains(document.activeElement) : false;
    });
    expect(focusedInCard).toBeTruthy();
  });

  test('probability band class is applied on cards', async ({ page, baseURL }) => {
    const url = (baseURL || 'http://localhost:8788') + pagePath;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.fill('#worryInput', '確率帯の検証を行うための十分な長さの入力文です');
    await page.click('#aiGuessBtn');
    const firstCard = page.locator('.scenario-card').first();
    await expect(firstCard).toHaveCount(1);
    const band = await firstCard.locator('.scenario-probability');
    await expect(band).toHaveCount(1);
    const className = await band.getAttribute('class');
    expect(className).toMatch(/prob-band-(low|mid|high)/);
  });

  test('responsive snapshots (mobile and desktop)', async ({ page, baseURL }) => {
    const url = (baseURL || 'http://localhost:8788') + pagePath;
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.fill('#worryInput', 'レスポンシブ テスト');
    await page.click('#aiGuessBtn');
    await expect(page.locator('.scenario-card')).toHaveCount(8, { timeout: 20000 });
    await page.screenshot({ path: 'test-results/future-simulator-mobile.png', fullPage: true });
    // Desktop
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.fill('#worryInput', 'レスポンシブ テスト');
    await page.click('#aiGuessBtn');
    await expect(page.locator('.scenario-card')).toHaveCount(8, { timeout: 20000 });
    await page.screenshot({ path: 'test-results/future-simulator-desktop.png', fullPage: true });
  });

  test('Card triad phases render correctly', async ({ page, baseURL }) => {
    const url = (baseURL || 'http://localhost:8788') + pagePath;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.fill('#worryInput', '三段の変化UIの検証。ステッパーと指標ラベルを確認します。');
    await page.click('#aiGuessBtn');

    // Ensure eight scenario cards are present
    const scenariosContainer = page.locator('#eight-scenarios-display, #eight-scenarios-display-container').first();
    await scenariosContainer.waitFor({ state: 'attached', timeout: 45000 });
    const cards = scenariosContainer.locator('.scenario-card');
    await expect(cards).toHaveCount(8, { timeout: 20000 });

    // Each card contains triad phases container
    await cards.first().click();
    const firstCardPhases = cards.first().locator('.three-phase-container');
    await expect(firstCardPhases).toHaveCount(1);
    const phaseHeaders = firstCardPhases.locator('.phase-header');
    await expect(phaseHeaders).toHaveCount(3);

    // Probability label shows updated text
    const firstProbAria = await cards.first().locator('.probability-bar').getAttribute('aria-label');
    expect(firstProbAria === '指標（総合評価）' || firstProbAria === '実現可能性').toBeTruthy();
    const firstProbText = await cards.first().locator('.probability-text').innerText();
    expect(firstProbText).toMatch(/(指標（総合評価）|実現可能性):\s*\d+\.?\d*%/);

    // Header uses updated title structure
    const header = await cards.first().locator('.scenario-title').innerText();
    expect(header).toMatch(/シナリオ\s+\d+:/);

    // Final labels include 最終卦/最終爻 in the detail panel
    await cards.first().press('Enter');
    const detail = page.locator('#scenario-detail-panel');
    await expect(detail).toHaveCount(1);
    const detailText = await detail.innerText();
    expect(detailText).toMatch(/最終卦/);
    expect(detailText).toMatch(/最終爻/);

    await page.screenshot({ path: 'test-results/future-simulator-triad-ui.png', fullPage: true });
  });
  test('click analyze button shows 8 scenarios', async ({ page, baseURL }) => {
    page.on('console', msg => {
      console.log(`[browser] ${msg.type()}: ${msg.text()}`);
      if (msg.type() === 'error') throw new Error(`Console error: ${msg.text()}`);
    });
    const url = (baseURL || 'http://localhost:8788') + pagePath;
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const input = page.locator('#worryInput');
    const button = page.locator('#aiGuessBtn');
    await input.fill('手元のチームで納期が厳しく、人手不足で困っている。');

    // 待機してからクリック
    await page.waitForTimeout(200);
    await button.click();

    const scenariosContainer = page.locator('#eight-scenarios-display, #eight-scenarios-display-container').first();
    await scenariosContainer.waitFor({ state: 'attached', timeout: 45000 });
    const cards = scenariosContainer.locator('.scenario-card');
    await expect(cards).toHaveCount(8, { timeout: 15000 });

    await page.screenshot({ path: 'test-results/future-simulator-after-click.png', fullPage: true });
  });
});
