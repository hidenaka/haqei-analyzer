import { chromium } from 'playwright';
import fs from 'fs';

console.log('🔍 Future Simulator v4.3.1 最終動作検証\n');
console.log('=' .repeat(60));

async function finalVerification() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300
  });
  const page = await browser.newPage();
  
  const testResults = {
    timestamp: new Date().toISOString(),
    version: 'v4.3.1',
    tests: [],
    screenshots: [],
    summary: {}
  };
  
  // コンソールエラー監視
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  try {
    // ========================================
    // 1. 初期化テスト
    // ========================================
    console.log('\n📋 TEST 1: 初期化確認');
    console.log('-' .repeat(40));
    
    await page.goto('file:///Users/hideakimacbookair/Desktop/haqei-analyzer/public/future_simulator.html');
    await page.waitForTimeout(3000);
    
    const initState = await page.evaluate(() => {
      return {
        v431Loaded: !!window.FutureSimulatorV431,
        buttonBound: document.getElementById('aiGuessBtn')?.dataset?.bound === '1',
        inputExists: !!document.getElementById('worryInput'),
        containerExists: !!document.getElementById('resultsContainer')
      };
    });
    
    console.log(`  v4.3.1ロード: ${initState.v431Loaded ? '✅' : '❌'}`);
    console.log(`  ボタンバインド: ${initState.buttonBound ? '✅' : '❌'}`);
    console.log(`  入力フィールド: ${initState.inputExists ? '✅' : '❌'}`);
    console.log(`  結果コンテナ: ${initState.containerExists ? '✅' : '❌'}`);
    
    testResults.tests.push({
      name: '初期化',
      passed: initState.v431Loaded && initState.buttonBound,
      details: initState
    });
    
    // スクリーンショット1: 初期状態
    await page.screenshot({ path: '20250814_1_initial.png' });
    testResults.screenshots.push('20250814_1_initial.png');
    
    // ========================================
    // 2. 入力検証テスト
    // ========================================
    console.log('\n📋 TEST 2: 入力検証');
    console.log('-' .repeat(40));
    
    // 短い入力テスト
    await page.fill('#worryInput', '短い');
    await page.click('#aiGuessBtn');
    await page.waitForTimeout(1000);
    
    const shortInputResult = await page.evaluate(() => {
      const messages = Array.from(document.querySelectorAll('div')).filter(
        el => el.style.cssText && el.style.cssText.includes('position: fixed')
      );
      return messages.some(m => m.textContent.includes('10文字以上'));
    });
    
    console.log(`  短入力警告: ${shortInputResult ? '✅' : '❌'}`);
    
    testResults.tests.push({
      name: '短入力検証',
      passed: shortInputResult,
      details: { warningShown: shortInputResult }
    });
    
    // ========================================
    // 3. 正常動作テスト
    // ========================================
    console.log('\n📋 TEST 3: 正常動作');
    console.log('-' .repeat(40));
    
    const testInput = '転職を検討していますが、現在の会社での立場も安定しており、新しいチャレンジをすべきか悩んでいます。';
    await page.fill('#worryInput', testInput);
    
    // スクリーンショット2: 入力後
    await page.screenshot({ path: '20250814_2_input.png' });
    testResults.screenshots.push('20250814_2_input.png');
    
    await page.click('#aiGuessBtn');
    console.log('  分析実行中...');
    await page.waitForTimeout(3000);
    
    // スクリーンショット3: 結果表示
    await page.screenshot({ path: '20250814_3_results.png', fullPage: true });
    testResults.screenshots.push('20250814_3_results.png');
    
    const analysisResult = await page.evaluate(() => {
      // v4.3.1カード確認
      const v431Cards = document.querySelectorAll('.scenario-card-v431');
      const oldCards = document.querySelectorAll('.scenario-card');
      const container = document.getElementById('resultsContainer');
      
      // カードのIDを収集
      const cardIds = Array.from(v431Cards).map(card => card.dataset.scenarioId);
      
      // Trace ID確認
      const traceElement = Array.from(document.querySelectorAll('div')).find(
        el => el.textContent.includes('Trace ID:')
      );
      const traceId = traceElement?.textContent.match(/FS-[\d-]+/)?.[0];
      
      // カードテキスト確認
      const cardTexts = Array.from(v431Cards).map(card => ({
        id: card.dataset.scenarioId,
        summary: card.querySelector('p')?.textContent
      }));
      
      return {
        v431CardCount: v431Cards.length,
        oldCardCount: oldCards.length,
        cardIds,
        expectedIds: ['JJJ', 'JJH', 'JHJ', 'JHH', 'HJJ', 'HJH', 'HHJ', 'HHH'],
        idsMatch: JSON.stringify(cardIds.sort()) === JSON.stringify(['JJJ', 'JJH', 'JHJ', 'JHH', 'HJJ', 'HJH', 'HHJ', 'HHH'].sort()),
        containerVisible: container?.style.display !== 'none',
        hasTraceId: !!traceId,
        traceId,
        cardTexts: cardTexts.slice(0, 3)
      };
    });
    
    console.log(`  v4.3.1カード数: ${analysisResult.v431CardCount}/8 ${analysisResult.v431CardCount === 8 ? '✅' : '❌'}`);
    console.log(`  旧カード数: ${analysisResult.oldCardCount} ${analysisResult.oldCardCount === 0 ? '✅' : '❌'}`);
    console.log(`  カードID順序: ${analysisResult.idsMatch ? '✅' : '❌'}`);
    console.log(`  Trace ID: ${analysisResult.hasTraceId ? analysisResult.traceId : '❌'}`);
    
    testResults.tests.push({
      name: '8カード生成',
      passed: analysisResult.v431CardCount === 8 && analysisResult.oldCardCount === 0,
      details: analysisResult
    });
    
    // ========================================
    // 4. 専門用語チェック
    // ========================================
    console.log('\n📋 TEST 4: 専門用語排除');
    console.log('-' .repeat(40));
    
    const termCheck = await page.evaluate(() => {
      const cards = document.querySelectorAll('.scenario-card-v431');
      const cardTexts = Array.from(cards).map(card => card.textContent);
      const allText = cardTexts.join(' ');
      
      const forbiddenTerms = ['両者敗北', '進爻', '変爻', '六三', '九二', '用九', '用六'];
      const foundTerms = forbiddenTerms.filter(term => allText.includes(term));
      
      // 平易文チェック
      const hasPlainText = allText.includes('着実') || allText.includes('基盤') || 
                          allText.includes('挑戦') || allText.includes('変化');
      
      return {
        hasForbiddenTerms: foundTerms.length > 0,
        foundTerms,
        hasPlainText
      };
    });
    
    console.log(`  専門用語排除: ${!termCheck.hasForbiddenTerms ? '✅' : '❌'}`);
    if (termCheck.foundTerms.length > 0) {
      console.log(`    発見された専門用語: ${termCheck.foundTerms.join(', ')}`);
    }
    console.log(`  平易文使用: ${termCheck.hasPlainText ? '✅' : '❌'}`);
    
    testResults.tests.push({
      name: '専門用語排除',
      passed: !termCheck.hasForbiddenTerms && termCheck.hasPlainText,
      details: termCheck
    });
    
    // ========================================
    // 5. モーダル動作テスト
    // ========================================
    console.log('\n📋 TEST 5: モーダル表示');
    console.log('-' .repeat(40));
    
    // 最初のカードをクリック
    await page.click('.scenario-card-v431:first-child');
    await page.waitForTimeout(1500);
    
    const modalCheck = await page.evaluate(() => {
      const modal = document.getElementById('scenario-modal-v431');
      if (!modal) return { exists: false };
      
      // 3段階タイムライン確認
      const stages = modal.querySelectorAll('h4');
      const hasThreeStages = stages.length >= 3;
      
      // メトリクス表示確認
      const metricsText = modal.textContent;
      const hasMetrics = metricsText.includes('安全性') && 
                         metricsText.includes('安定性') && 
                         metricsText.includes('可能性');
      
      // 用語説明確認
      const hasGlossary = metricsText.includes('用語説明') || 
                         modal.querySelector('[style*="background: rgba(255, 255, 255, 0.03)"]');
      
      return {
        exists: true,
        hasThreeStages,
        hasMetrics,
        hasGlossary
      };
    });
    
    console.log(`  モーダル表示: ${modalCheck.exists ? '✅' : '❌'}`);
    if (modalCheck.exists) {
      console.log(`  3段階表示: ${modalCheck.hasThreeStages ? '✅' : '❌'}`);
      console.log(`  メトリクス表示: ${modalCheck.hasMetrics ? '✅' : '❌'}`);
      console.log(`  用語説明: ${modalCheck.hasGlossary ? '✅' : '❌'}`);
    }
    
    // スクリーンショット4: モーダル
    await page.screenshot({ path: '20250814_4_modal.png' });
    testResults.screenshots.push('20250814_4_modal.png');
    
    testResults.tests.push({
      name: 'モーダル機能',
      passed: modalCheck.exists && modalCheck.hasThreeStages,
      details: modalCheck
    });
    
    // モーダルを閉じる
    if (modalCheck.exists) {
      await page.click('#scenario-modal-v431 button');
      await page.waitForTimeout(500);
    }
    
    // ========================================
    // 6. 決定論テスト
    // ========================================
    console.log('\n📋 TEST 6: 決定論（同一入力→同一出力）');
    console.log('-' .repeat(40));
    
    // 1回目の結果を記録
    const firstResult = await page.evaluate(() => {
      const cards = document.querySelectorAll('.scenario-card-v431');
      return Array.from(cards).map(card => ({
        id: card.dataset.scenarioId,
        text: card.querySelector('p')?.textContent
      }));
    });
    
    // リロードして2回目実行
    await page.reload();
    await page.waitForTimeout(2000);
    await page.fill('#worryInput', testInput);
    await page.click('#aiGuessBtn');
    await page.waitForTimeout(2000);
    
    const secondResult = await page.evaluate(() => {
      const cards = document.querySelectorAll('.scenario-card-v431');
      return Array.from(cards).map(card => ({
        id: card.dataset.scenarioId,
        text: card.querySelector('p')?.textContent
      }));
    });
    
    const isDeterministic = JSON.stringify(firstResult) === JSON.stringify(secondResult);
    console.log(`  決定論的動作: ${isDeterministic ? '✅' : '❌'}`);
    
    testResults.tests.push({
      name: '決定論',
      passed: isDeterministic,
      details: { 
        firstIds: firstResult.map(r => r.id),
        secondIds: secondResult.map(r => r.id),
        match: isDeterministic
      }
    });
    
    // ========================================
    // 7. パフォーマンステスト
    // ========================================
    console.log('\n📋 TEST 7: パフォーマンス');
    console.log('-' .repeat(40));
    
    const startTime = Date.now();
    await page.fill('#worryInput', '性能テスト用の入力テキストです。これは処理時間を測定するためのものです。');
    await page.click('#aiGuessBtn');
    
    // 結果が表示されるまで待つ
    await page.waitForSelector('.scenario-card-v431', { timeout: 5000 });
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`  応答時間: ${responseTime}ms ${responseTime < 2000 ? '✅' : '⚠️'}`);
    
    testResults.tests.push({
      name: 'パフォーマンス',
      passed: responseTime < 2000,
      details: { responseTime }
    });
    
    // ========================================
    // サマリー
    // ========================================
    console.log('\n' + '=' .repeat(60));
    console.log('📊 テスト結果サマリー');
    console.log('=' .repeat(60));
    
    const passedTests = testResults.tests.filter(t => t.passed).length;
    const totalTests = testResults.tests.length;
    
    testResults.tests.forEach(test => {
      console.log(`  ${test.name}: ${test.passed ? '✅ PASS' : '❌ FAIL'}`);
    });
    
    console.log('-' .repeat(60));
    console.log(`合格率: ${passedTests}/${totalTests} (${Math.round(passedTests/totalTests*100)}%)`);
    
    // コンソールエラー確認
    if (consoleErrors.length > 0) {
      console.log(`\n⚠️ コンソールエラー: ${consoleErrors.length}件`);
      consoleErrors.slice(0, 3).forEach(err => {
        console.log(`  - ${err.substring(0, 100)}`);
      });
    }
    
    testResults.summary = {
      totalTests,
      passedTests,
      failedTests: totalTests - passedTests,
      passRate: Math.round(passedTests/totalTests*100),
      consoleErrors: consoleErrors.length
    };
    
    // 結果をJSONファイルに保存
    fs.writeFileSync(
      '20250814_final_test_results.json',
      JSON.stringify(testResults, null, 2)
    );
    
    console.log('\n📁 詳細結果: 20250814_final_test_results.json');
    console.log('📸 スクリーンショット:');
    testResults.screenshots.forEach(s => console.log(`  - ${s}`));
    
    // 最終判定
    const allPassed = passedTests === totalTests;
    console.log('\n' + '=' .repeat(60));
    if (allPassed) {
      console.log('🎉 全テスト合格！v4.3.1は正常に動作しています');
    } else {
      console.log('⚠️ 一部テストが失敗しています。詳細を確認してください。');
    }
    console.log('=' .repeat(60));
    
    // ブラウザを開いたまま待機
    console.log('\n⏳ 手動確認用（10秒待機）...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('\n❌ テストエラー:', error.message);
    testResults.error = error.message;
  } finally {
    await browser.close();
  }
  
  return testResults;
}

finalVerification();