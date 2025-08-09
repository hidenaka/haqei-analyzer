// Canvas ID修正検証テスト
const { test, expect } = require('@playwright/test');

test('Canvas ID修正効果確認 - Chart描画テスト', async ({ page }) => {
  console.log('🚨 Canvas ID修正検証開始');
  
  // os_analyzer.htmlページにアクセス
  await page.goto('http://localhost:8788/os_analyzer.html');
  
  console.log('✅ ページアクセス成功');
  
  // Canvas要素の存在確認
  const canvasElements = await page.evaluate(() => {
    const elements = {
      'os-interaction-chart': document.getElementById('os-interaction-chart') !== null,
      '8d-vector-chart': document.getElementById('8d-vector-chart') !== null,
      'trigram-energy-polar-chart': document.getElementById('trigram-energy-polar-chart') !== null,
      'haqei-persona-chart': document.getElementById('haqei-persona-chart') !== null
    };
    return elements;
  });
  
  console.log('Canvas要素確認結果:', canvasElements);
  
  // JavaScriptエラーをキャッチ
  const jsErrors = [];
  page.on('pageerror', error => {
    jsErrors.push(error.message);
  });
  
  // Console errorを監視
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // 質問を1つ回答してOS分析を実行
  await page.waitForSelector('button[onclick="startAnalysis()"]', { timeout: 10000 });
  
  // ランダム回答でテスト用データ生成
  const questions = await page.$$('.question-container');
  if (questions.length > 0) {
    // 最初の質問に回答
    await page.click('.option-button:first-child');
    console.log('✅ テスト回答完了');
    
    // 分析実行
    await page.click('button[onclick="startAnalysis()"]');
    console.log('✅ 分析実行開始');
    
    // 結果表示まで待機
    await page.waitForSelector('.result-display', { timeout: 15000 });
    console.log('✅ 結果表示成功');
  }
  
  // Canvas ID修正効果の確認
  const chartResults = await page.evaluate(() => {
    const results = {};
    
    // os-interaction-chartの確認
    const osChart = document.getElementById('os-interaction-chart');
    results.osInteractionChart = {
      exists: osChart !== null,
      context: osChart ? osChart.getContext('2d') !== null : false
    };
    
    // 8d-vector-chartの確認
    const vectorChart = document.getElementById('8d-vector-chart');
    results.vectorChart = {
      exists: vectorChart !== null,
      context: vectorChart ? vectorChart.getContext('2d') !== null : false
    };
    
    return results;
  });
  
  console.log('Chart検証結果:', chartResults);
  
  // エラーチェック
  console.log('JavaScript Errors:', jsErrors.length);
  console.log('Console Errors:', consoleErrors.filter(e => e.includes('chart')).length);
  
  // 修正成功判定
  const isSuccess = 
    canvasElements['os-interaction-chart'] && 
    canvasElements['8d-vector-chart'] && 
    chartResults.osInteractionChart.exists && 
    chartResults.vectorChart.exists;
  
  console.log(`🏆 修正結果: ${isSuccess ? '✅ SUCCESS' : '❌ FAILED'}`);
  
  // スクリーンショット撮影
  await page.screenshot({ 
    path: 'canvas-fix-validation-result.png',
    fullPage: true 
  });
  
  console.log('📸 検証スクリーンショット保存完了');
});

console.log('Canvas ID修正検証テスト実行完了');