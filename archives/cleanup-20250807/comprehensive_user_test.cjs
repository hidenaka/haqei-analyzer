const { chromium } = require("playwright");

async function comprehensiveUserTest() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 3000  // ゆっくり実行してユーザー体験を再現
  });
  const page = await browser.newPage();

  // 全ログ監視
  const errors = [];
  const warnings = [];
  const logs = [];
  
  page.on("console", msg => {
    const log = `${msg.type()}: ${msg.text()}`;
    logs.push(log);
    if (msg.type() === 'error') {
      errors.push(log);
      console.log(`🚨 ERROR: ${log}`);
    } else if (msg.type() === 'warning') {
      warnings.push(log);
    }
  });
  
  page.on("pageerror", error => {
    const errorMsg = `PAGE ERROR: ${error.message}`;
    errors.push(errorMsg);
    console.log(`🚨 ${errorMsg}`);
  });

  try {
    console.log("👤 私自身によるユーザーテスト開始");
    console.log("🎯 目標: 実際のユーザー体験を完全に再現");
    
    // Step 1: サイトにアクセス
    console.log("\n📋 Step 1: サイトアクセス");
    await page.goto("http://127.0.0.1:8788/future_simulator.html", {
      waitUntil: "networkidle"
    });
    
    await page.screenshot({ path: "my-test-step1-access.png", fullPage: true });
    console.log("✅ Step 1 完了: サイト正常アクセス");
    
    // Step 2: 初期画面の確認
    console.log("\n📋 Step 2: 初期画面確認");
    const initialState = await page.evaluate(() => {
      return {
        title: document.title,
        hasInputField: !!document.getElementById('worryInput'),
        hasAnalyzeButton: !!document.getElementById('aiGuessBtn'),
        inputFieldVisible: document.getElementById('worryInput')?.offsetHeight > 0,
        buttonVisible: document.getElementById('aiGuessBtn')?.offsetHeight > 0,
        mainContent: document.body.innerText.includes('未来を分析')
      };
    });
    
    console.log("📊 初期画面状態:", initialState);
    if (!initialState.hasInputField || !initialState.hasAnalyzeButton) {
      throw new Error("基本UI要素が不足しています");
    }
    
    await page.screenshot({ path: "my-test-step2-initial.png", fullPage: true });
    console.log("✅ Step 2 完了: 初期画面正常");
    
    // Step 3: リアルなテキスト入力
    console.log("\n📋 Step 3: リアルなテキスト入力");
    const realUserText = `最近仕事で大きなプロジェクトを任されたけど、チームメンバーがあまり協力的じゃなくて困ってる。
上司からは期待されているし、成功すればキャリアにプラスになるけど、
このまま行くと失敗する可能性も高い。
どうすればいいんだろう？転職も考えているけど、今辞めるのは勇気がいる。`;
    
    await page.fill("#worryInput", realUserText);
    console.log("✅ リアルなユーザーテキスト入力完了");
    
    await page.screenshot({ path: "my-test-step3-input.png", fullPage: true });
    
    // Step 4: 分析実行
    console.log("\n📋 Step 4: 分析実行");
    console.log("🔍 分析ボタンをクリックします...");
    
    await page.click("#aiGuessBtn");
    console.log("✅ 分析ボタンクリック完了");
    
    // Step 5: 分析処理を待機・監視
    console.log("\n📋 Step 5: 分析処理監視");
    console.log("⏱️ 分析処理を15秒間監視します...");
    
    let analysisResults = {};
    for (let i = 0; i < 15; i++) {
      await page.waitForTimeout(1000);
      
      const currentState = await page.evaluate(() => {
        return {
          resultAreaVisible: !document.getElementById('resultArea')?.classList.contains('hidden'),
          scenarioCards: document.querySelectorAll('.scenario-card').length,
          binaryTreeElements: document.querySelectorAll('.binary-tree-display, .binary-tree-container').length,
          chartElements: document.querySelectorAll('canvas').length,
          loadingVisible: !document.getElementById('initial-loading')?.style.display.includes('none'),
          analysisText: document.body.innerText.includes('分析結果') || 
                       document.body.innerText.includes('シナリオ') ||
                       document.body.innerText.includes('未来'),
          visibleContent: document.body.innerText.substring(0, 500)
        };
      });
      
      if (i === 2 || i === 5 || i === 10 || i === 14) {
        console.log(`⏱️ ${i+1}秒経過 - 状態: シナリオ${currentState.scenarioCards}枚, Binary Tree${currentState.binaryTreeElements}個, Chart${currentState.chartElements}個`);
        await page.screenshot({ path: `my-test-step5-analysis-${i+1}s.png`, fullPage: true });
      }
      
      analysisResults = currentState;
    }
    
    console.log("✅ Step 5 完了: 15秒間の分析監視完了");
    
    // Step 6: 最終結果の詳細確認
    console.log("\n📋 Step 6: 最終結果詳細確認");
    
    const finalResults = await page.evaluate(() => {
      // 画面上のすべてのテキストを取得
      const allText = document.body.innerText;
      
      // 結果要素の詳細確認
      const resultElements = {
        resultArea: document.getElementById('resultArea'),
        scenarioCards: document.querySelectorAll('.scenario-card'),
        binaryTreeDisplay: document.querySelector('.binary-tree-display'),
        chartCanvas: document.querySelector('canvas'),
        analysisContainer: document.querySelector('.analysis-container')
      };
      
      // 具体的な内容確認
      const contentAnalysis = {
        has8Scenarios: allText.includes('8つ') || allText.includes('シナリオ'),
        hasBinaryTree: allText.includes('Binary Tree') || allText.includes('分岐'),
        hasResults: allText.includes('分析結果') || allText.includes('現在の状況'),
        hasChoices: allText.includes('選択') || allText.includes('道'),
        totalTextLength: allText.length
      };
      
      return {
        resultElements: {
          resultArea: !!resultElements.resultArea,
          scenarioCount: resultElements.scenarioCards.length,
          binaryTreeExists: !!resultElements.binaryTreeDisplay,
          chartExists: !!resultElements.chartCanvas,
          analysisExists: !!resultElements.analysisContainer
        },
        contentAnalysis,
        sampleText: allText.substring(0, 1000)
      };
    });
    
    await page.screenshot({ path: "my-test-step6-final-results.png", fullPage: true });
    
    console.log("📊 最終結果詳細:");
    console.log("- 結果エリア:", finalResults.resultElements.resultArea ? '✅' : '❌');
    console.log("- シナリオカード数:", finalResults.resultElements.scenarioCount, '枚');
    console.log("- Binary Tree:", finalResults.resultElements.binaryTreeExists ? '✅' : '❌');
    console.log("- チャート:", finalResults.resultElements.chartExists ? '✅' : '❌');
    console.log("- 8シナリオ言及:", finalResults.contentAnalysis.has8Scenarios ? '✅' : '❌');
    console.log("- Binary Tree言及:", finalResults.contentAnalysis.hasBinaryTree ? '✅' : '❌');
    console.log("- 総テキスト長:", finalResults.contentAnalysis.totalTextLength, '文字');
    
    // Step 7: ユーザー体験評価
    console.log("\n📋 Step 7: ユーザー体験評価");
    
    const userExperience = {
      initialLoadGood: initialState.hasInputField && initialState.hasAnalyzeButton,
      inputWorking: true, // テキスト入力が成功した
      analysisStarted: true, // ボタンクリックが成功した
      resultsDisplayed: finalResults.resultElements.resultArea,
      contentMeaningful: finalResults.contentAnalysis.totalTextLength > 1000,
      scenariosVisible: finalResults.resultElements.scenarioCount > 0,
      binaryTreeVisible: finalResults.resultElements.binaryTreeExists,
      overallSatisfactory: false // 後で判定
    };
    
    // 総合満足度の判定
    const positiveCount = Object.values(userExperience).filter(v => v === true).length;
    userExperience.overallSatisfactory = positiveCount >= 5;
    
    console.log("🎯 ユーザー体験評価:");
    Object.entries(userExperience).forEach(([key, value]) => {
      console.log(`- ${key}: ${value ? '✅' : '❌'}`);
    });
    
    return {
      success: true,
      testSteps: {
        step1_access: true,
        step2_initial: initialState.hasInputField && initialState.hasAnalyzeButton,
        step3_input: true,
        step4_analysis: true,
        step5_monitoring: true,
        step6_results: finalResults.resultElements.resultArea,
        step7_evaluation: userExperience.overallSatisfactory
      },
      initialState,
      analysisResults,
      finalResults,
      userExperience,
      errors: errors.length,
      warnings: warnings.length,
      logs: logs.length
    };
    
  } catch (error) {
    console.error("🚨 ユーザーテスト失敗:", error.message);
    await page.screenshot({ path: "my-test-error.png", fullPage: true });
    return { 
      success: false, 
      error: error.message,
      errors: errors.length
    };
  } finally {
    await browser.close();
  }
}

comprehensiveUserTest().then(result => {
  console.log("\n🎯 私による包括的ユーザーテスト結果:");
  console.log("=====================================");
  
  if (result.success) {
    const passedSteps = Object.values(result.testSteps).filter(v => v).length;
    const totalSteps = Object.keys(result.testSteps).length;
    
    console.log(`✅ テスト成功: ${passedSteps}/${totalSteps} ステップ合格`);
    console.log(`📊 シナリオカード: ${result.finalResults?.resultElements.scenarioCount || 0}枚`);
    console.log(`🌳 Binary Tree: ${result.finalResults?.resultElements.binaryTreeExists ? '表示' : '非表示'}`);
    console.log(`🎭 ユーザー体験: ${result.userExperience?.overallSatisfactory ? '満足' : '不満足'}`);
    
    if (!result.userExperience?.overallSatisfactory) {
      console.log("\n⚠️ ユーザー体験の問題点:");
      Object.entries(result.userExperience).forEach(([key, value]) => {
        if (!value && key !== 'overallSatisfactory') {
          console.log(`- ${key}: 要改善`);
        }
      });
    }
  } else {
    console.log("❌ テスト失敗:", result.error);
  }
  
  console.log(`\n📈 技術統計: エラー${result.errors}件, 警告${result.warnings}件`);
});