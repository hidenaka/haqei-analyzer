/**
 * Future Branching Visualizer MCP Test
 * 未来分岐ビジュアライザーのMCPテスト
 */

import { chromium } from 'playwright';

(async () => {
  console.log('🚀 未来分岐ビジュアライザーテスト開始...');
  
  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-web-security', '--allow-running-insecure-content']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1400, height: 1000 }
  });
  
  const page = await context.newPage();
  
  try {
    // ページに移動
    console.log('📄 ページをロード中...');
    await page.goto('http://localhost:8788/future-branching-visualizer.html');
    
    // ローディングが完了するまで待機
    await page.waitForTimeout(3000);
    
    // ローディングオーバーレイが消えるまで待機
    await page.waitForSelector('#loading-overlay', { state: 'hidden', timeout: 10000 });
    
    console.log('✅ ページロード完了');
    
    // 初期スクリーンショット
    await page.screenshot({ path: 'future-branching-initial.png', fullPage: true });
    console.log('📸 初期状態スクリーンショット撮影完了');
    
    // レイアウト切り替えテスト
    console.log('🔄 レイアウト切り替えテスト...');
    
    // タイムラインレイアウト
    const timelineBtn = page.locator('button[data-layout="timeline"]');
    if (await timelineBtn.isVisible()) {
      await timelineBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'future-branching-timeline.png', fullPage: true });
      console.log('📸 タイムラインレイアウトスクリーンショット撮影完了');
    }
    
    // 放射状レイアウト
    const radialBtn = page.locator('button[data-layout="radial"]');
    if (await radialBtn.isVisible()) {
      await radialBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'future-branching-radial.png', fullPage: true });
      console.log('📸 放射状レイアウトスクリーンショット撮影完了');
    }
    
    // クラシックレイアウトに戻す
    const classicBtn = page.locator('button[data-layout="classic"]');
    if (await classicBtn.isVisible()) {
      await classicBtn.click();
      await page.waitForTimeout(1000);
    }
    
    // ペルソナ選択テスト
    console.log('👤 ペルソナ選択テスト...');
    const personaSelect = page.locator('#persona-select');
    if (await personaSelect.isVisible()) {
      // キャリア迷子を選択
      await personaSelect.selectOption('career-seeker');
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'future-branching-career-persona.png', fullPage: true });
      console.log('📸 キャリアペルソナスクリーンショット撮影完了');
      
      // 恋愛悩みを選択
      await personaSelect.selectOption('love-worrier');
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'future-branching-love-persona.png', fullPage: true });
      console.log('📸 恋愛ペルソナスクリーンショット撮影完了');
    }
    
    // 選択肢クリックテスト
    console.log('🎯 選択肢インタラクションテスト...');
    const choiceNodes = page.locator('.choice-selector');
    const choiceCount = await choiceNodes.count();
    
    if (choiceCount > 0) {
      // 最初の選択肢をクリック
      await choiceNodes.first().click();
      await page.waitForTimeout(1000);
      
      // 選択後のスクリーンショット
      await page.screenshot({ path: 'future-branching-choice-selected.png', fullPage: true });
      console.log('📸 選択肢選択後スクリーンショット撮影完了');
    }
    
    // カスタムシナリオ作成テスト
    console.log('✏️ カスタムシナリオテスト...');
    await personaSelect.selectOption(''); // カスタムを選択
    await page.waitForTimeout(2000);
    
    // カスタム入力フォームが表示されているか確認
    const customCurrentInput = page.locator('#custom-current');
    if (await customCurrentInput.isVisible()) {
      await customCurrentInput.fill('人生の転換点に立っており、今後の方向性を決めかねています');
      await page.locator('#custom-choice-1').fill('現在の安定した状況を維持する');
      await page.locator('#custom-choice-2').fill('新しい挑戦に向けて行動を起こす');
      await page.locator('#custom-choice-3').fill('全く異なる分野で創造的な活動を始める');
      
      await page.locator('#create-custom').click();
      await page.waitForTimeout(2000);
      
      await page.screenshot({ path: 'future-branching-custom-scenario.png', fullPage: true });
      console.log('📸 カスタムシナリオスクリーンショット撮影完了');
    }
    
    // モバイル表示テスト
    console.log('📱 モバイル表示テスト...');
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone サイズ
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'future-branching-mobile.png', fullPage: true });
    console.log('📸 モバイル表示スクリーンショット撮影完了');
    
    console.log('✅ 未来分岐ビジュアライザーテスト完了！');
    
    // コンソールログを取得
    const logs = [];
    page.on('console', msg => {
      logs.push(`${msg.type()}: ${msg.text()}`);
    });
    
    // エラーの確認
    const errors = logs.filter(log => log.includes('error') || log.includes('Error'));
    if (errors.length > 0) {
      console.log('⚠️ 検出されたエラー:');
      errors.forEach(error => console.log(`  - ${error}`));
    } else {
      console.log('✅ エラーは検出されませんでした');
    }
    
  } catch (error) {
    console.error('❌ テストエラー:', error);
    await page.screenshot({ path: 'future-branching-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();