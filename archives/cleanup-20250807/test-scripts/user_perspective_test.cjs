const { chromium } = require("playwright");

async function testUserPerspective() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 2000
  });
  const page = await browser.newPage();

  // コンソールエラー監視
  const errors = [];
  const logs = [];
  
  page.on("console", msg => {
    const log = `${msg.type()}: ${msg.text()}`;
    logs.push(log);
    if (msg.type() === 'error') {
      errors.push(log);
    }
  });

  try {
    console.log("👥 ユーザー目線での動作確認開始");
    
    await page.goto("http://127.0.0.1:8084/future_simulator.html", {
      waitUntil: "networkidle"
    });
    
    // 初期画面のスクリーンショット
    await page.screenshot({ path: "user-test-step1-initial.png", fullPage: true });
    console.log("📸 Step1: 初期画面撮影完了");
    
    // Step1: テキスト入力
    console.log("✏️ Step2: テキスト入力テスト");
    const testInput = "最近仕事でストレスが多く、将来への不安を感じています。どのような選択をすべきか迷っています。";
    
    await page.fill("#worryInput", testInput);
    await page.screenshot({ path: "user-test-step2-input.png", fullPage: true });
    console.log("📸 Step2: テキスト入力完了");
    
    // Step3: 分析ボタンクリック
    console.log("🔍 Step3: 分析実行テスト");
    await page.click("#aiGuessBtn");
    
    // 分析処理を待機（最大30秒）
    console.log("⏱️ 分析処理待機中...");
    await page.waitForTimeout(5000);
    
    // 結果エリアの確認
    const resultAreaVisible = await page.isVisible("#resultArea");
    console.log(`📋 結果エリア表示: ${resultAreaVisible ? '✅ 表示中' : '❌ 非表示'}`);
    
    // 分析後のスクリーンショット
    await page.screenshot({ path: "user-test-step3-analysis.png", fullPage: true });
    console.log("📸 Step3: 分析後画面撮影完了");
    
    // Step4: 結果内容の詳細確認
    console.log("📊 Step4: 結果内容詳細確認");
    
    const resultContent = await page.evaluate(() => {
      const resultArea = document.getElementById('resultArea');
      const binaryTreeDisplay = document.querySelector('.binary-tree-display');
      const scenarioCards = document.querySelectorAll('.scenario-card');
      const chartCanvas = document.querySelector('canvas');
      
      return {
        resultAreaExists: !!resultArea,
        resultAreaVisible: resultArea ? !resultArea.classList.contains('hidden') : false,
        resultAreaContent: resultArea ? resultArea.innerHTML.substring(0, 500) : 'Not found',
        binaryTreeExists: !!binaryTreeDisplay,
        scenarioCount: scenarioCards.length,
        chartExists: !!chartCanvas,
        pageContent: document.body.innerHTML.substring(0, 1000)
      };
    });
    
    console.log("📋 結果詳細分析:");
    console.log(`- 結果エリア存在: ${resultContent.resultAreaExists ? '✅' : '❌'}`);
    console.log(`- 結果エリア表示: ${resultContent.resultAreaVisible ? '✅' : '❌'}`);
    console.log(`- Binary Tree表示: ${resultContent.binaryTreeExists ? '✅' : '❌'}`);
    console.log(`- シナリオカード数: ${resultContent.scenarioCount}枚`);
    console.log(`- チャート存在: ${resultContent.chartExists ? '✅' : '❌'}`);
    
    // さらに待機して最終結果確認
    console.log("⏱️ 最終結果待機（10秒）...");
    await page.waitForTimeout(10000);
    
    await page.screenshot({ path: "user-test-step4-final-results.png", fullPage: true });
    console.log("📸 Step4: 最終結果画面撮影完了");
    
    // 最終状態の確認
    const finalState = await page.evaluate(() => {
      // 画面上の全てのテキスト要素を確認
      const allText = document.body.innerText;
      const hasResults = allText.includes('分析結果') || allText.includes('シナリオ') || allText.includes('Binary Tree');
      
      // 結果表示エリアの詳細確認
      const resultElements = {
        resultArea: !!document.getElementById('resultArea'),
        scenarioContainer: !!document.querySelector('.scenarios-container'),
        binaryTreeContainer: !!document.querySelector('.binary-tree-container'),
        chartContainer: !!document.querySelector('canvas')
      };
      
      return {
        hasResults,
        resultElements,
        visibleText: allText.substring(0, 2000)
      };
    });
    
    console.log("🎯 最終ユーザー体験評価:");
    console.log(`- 結果表示成功: ${finalState.hasResults ? '✅' : '❌'}`);
    console.log("- 結果要素状況:", finalState.resultElements);
    
    return {
      success: true,
      testSteps: {
        step1_initial: true,
        step2_input: true,
        step3_analysis: true,
        step4_results: resultContent.resultAreaVisible
      },
      resultContent,
      finalState,
      errors: errors.length,
      logs: logs.length
    };
    
  } catch (error) {
    console.error("❌ ユーザーテストエラー:", error.message);
    await page.screenshot({ path: "user-test-error.png", fullPage: true });
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

testUserPerspective().then(result => {
  console.log("\n🎯 ユーザー目線テスト結果:");
  console.log(JSON.stringify(result, null, 2));
  
  if (result.success && result.testSteps.step4_results) {
    console.log("✅ ユーザー体験: 良好 - 結果が適切に表示されています");
  } else {
    console.log("❌ ユーザー体験: 問題あり - 結果表示に課題があります");
  }
});