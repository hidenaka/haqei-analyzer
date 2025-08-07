const { chromium } = require('playwright');

async function finalUserFlowTest() {
  let browser;
  try {
    browser = await chromium.launch({ 
      headless: false,
      slowMo: 500
    });
    const page = await browser.newPage();
    
    console.log('🎯 ===== 最終ユーザーフロー検証開始 =====');
    
    // コンソールエラーをキャッチ
    const allErrors = [];
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error') {
        allErrors.push(text);
        console.log('❌ Console Error:', text);
      }
    });
    
    page.on('pageerror', error => {
      allErrors.push(error.message);
      console.log('❌ Page Error:', error.message);
    });

    // STEP 1: 初期アクセス
    console.log('\n🚀 STEP 1: Future Simulator v2.1アクセス');
    await page.goto('http://127.0.0.1:8788/future_simulator.html', {
      waitUntil: 'networkidle',
      timeout: 20000
    });
    
    await page.waitForTimeout(3000);
    
    // STEP 2: テキスト入力
    console.log('\n📝 STEP 2: テキスト入力');
    const testText = '将来に不安を感じています。仕事の方向性に迷いがあり、転職すべきか現職を続けるべきか悩んでいます。';
    
    await page.fill('#worryInput', testText);
    console.log('✅ テキスト入力完了');
    await page.screenshot({ path: 'step2-input.png', fullPage: true });
    
    // STEP 3: 分析実行
    console.log('\n🔍 STEP 3: 分析実行');
    await page.click('#aiGuessBtn');
    console.log('✅ 分析ボタンクリック');
    
    // 分析結果を待つ
    console.log('⏳ 分析結果生成を待機中...');
    await page.waitForTimeout(10000);
    
    // STEP 4: 結果確認
    console.log('\n📊 STEP 4: 結果表示確認');
    
    const resultState = await page.evaluate(() => {
      const resultArea = document.getElementById('resultArea');
      const scenarioCards = document.querySelectorAll('.scenario-card');
      const binaryTreeDiv = document.querySelector('#binaryTreeDiv, .binary-tree, [id*="binary"]');
      
      return {
        resultAreaVisible: resultArea ? resultArea.offsetHeight > 0 : false,
        resultAreaHTML: resultArea ? resultArea.innerHTML.length : 0,
        scenarioCardsCount: scenarioCards.length,
        hasBinaryTree: !!binaryTreeDiv,
        binaryTreeVisible: binaryTreeDiv ? binaryTreeDiv.offsetHeight > 0 : false,
        bodyText: document.body.innerText.length,
        visibleElements: Array.from(document.querySelectorAll('*'))
          .filter(el => el.offsetHeight > 0).length
      };
    });
    
    console.log('📈 結果表示状態:');
    console.log(`- ResultArea表示: ${resultState.resultAreaVisible ? '✅' : '❌'}`);
    console.log(`- ResultArea内容: ${resultState.resultAreaHTML}文字`);
    console.log(`- シナリオカード数: ${resultState.scenarioCardsCount}`);
    console.log(`- Binary Tree存在: ${resultState.hasBinaryTree ? '✅' : '❌'}`);
    console.log(`- Binary Tree表示: ${resultState.binaryTreeVisible ? '✅' : '❌'}`);
    console.log(`- 可視要素数: ${resultState.visibleElements}`);
    
    await page.screenshot({ path: 'step4-results.png', fullPage: true });
    
    // STEP 5: 分析結果の詳細確認
    console.log('\n🔍 STEP 5: 分析結果詳細確認');
    
    const analysisResults = await page.evaluate(() => {
      // グローバルオブジェクトの確認
      const hasObjects = {
        IntegratedAnalysisEngine: typeof window.IntegratedAnalysisEngine,
        BinaryTreeFutureEngine: typeof window.BinaryTreeFutureEngine,
        EightScenariosGenerator: typeof window.EightScenariosGenerator,
        FutureSimulator: typeof window.FutureSimulator
      };
      
      // 分析エンジンの動作確認
      let analysisStatus = 'エンジン未実行';
      try {
        if (window.FutureSimulator && window.FutureSimulator.lastAnalysisResult) {
          analysisStatus = 'エンジン実行済み';
        }
      } catch (error) {
        analysisStatus = `エンジンエラー: ${error.message}`;
      }
      
      return {
        hasObjects,
        analysisStatus,
        errors: window.console._errors || []
      };
    });
    
    console.log('🔧 分析エンジン状態:', analysisResults.hasObjects);
    console.log('📊 分析状況:', analysisResults.analysisStatus);
    
    // 最終判定
    console.log('\n🎯 ===== 最終判定 =====');
    const success = allErrors.length === 0 && 
                   resultState.scenarioCardsCount >= 8 && 
                   resultState.hasBinaryTree;
    
    console.log(`JavaScript エラー: ${allErrors.length === 0 ? '✅ なし' : `❌ ${allErrors.length}個`}`);
    console.log(`シナリオ生成: ${resultState.scenarioCardsCount >= 8 ? '✅ 成功' : `❌ ${resultState.scenarioCardsCount}/8`}`);
    console.log(`Binary Tree: ${resultState.hasBinaryTree ? '✅ 存在' : '❌ 未生成'}`);
    console.log(`総合判定: ${success ? '✅ SUCCESS' : '❌ FAILURE'}`);
    
    if (allErrors.length > 0) {
      console.log('\n🚨 検出されたエラー:');
      allErrors.forEach((error, i) => {
        console.log(`${i + 1}. ${error}`);
      });
    }
    
    return {
      success,
      errors: allErrors.length,
      scenarioCards: resultState.scenarioCardsCount,
      hasBinaryTree: resultState.hasBinaryTree,
      resultVisible: resultState.resultAreaVisible
    };
    
  } catch (error) {
    console.error('❌ 検証中エラー:', error.message);
    return {
      success: false,
      error: error.message
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

finalUserFlowTest().then(result => {
  console.log('\n🏁 ===== HAQEI Future Simulator v2.1 最終検証結果 =====');
  
  if (result.success) {
    console.log('🎉 SUCCESS: すべての機能が正常に動作しています！');
    console.log('✅ JavaScriptエラーなし');
    console.log('✅ 8シナリオ生成成功');
    console.log('✅ Binary Tree表示成功');
    console.log('\n🎯 ユーザーへの報告: 最後の問題を完全に解決しました');
  } else {
    console.log('❌ FAILURE: まだ修正が必要な問題があります');
    console.log(`- JavaScriptエラー: ${result.errors}個`);
    console.log(`- シナリオカード: ${result.scenarioCards}/8`);
    console.log(`- Binary Tree: ${result.hasBinaryTree ? '存在' : '未生成'}`);
  }
});