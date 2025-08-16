// OS Analyzer 完全フローテスト - 結果画面まで
const { chromium } = require('playwright');

async function testCompleteFlow() {
  console.log('🚀 OS Analyzer Complete Flow Test - 結果画面まで確認');
  
  const browser = await chromium.launch({ 
    headless: true   // ヘッドレスモード
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // エラーとログを監視
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Error') || text.includes('error')) {
      console.log(`❌ Error: ${text}`);
    }
    if (text.includes('Analysis') || text.includes('Result') || text.includes('Triple OS')) {
      console.log(`📝 ${text}`);
    }
  });
  
  // ページを開く
  const filePath = '/Users/hideakimacbookair/Desktop/haqei-analyzer/public/os_analyzer.html';
  await page.goto(`file://${filePath}`);
  
  console.log('✅ Step 1: ウェルカム画面表示');
  await page.waitForTimeout(1000);
  
  // 分析開始ボタンをクリック
  await page.click('button:has-text("分析を始める")');
  console.log('✅ Step 2: 分析開始');
  
  // 36問に順次回答
  for (let i = 0; i < 36; i++) {
    await page.waitForTimeout(300);
    
    // 質問番号を確認
    const progressText = await page.textContent('.progress-text');
    console.log(`📋 ${progressText}`);
    
    // ランダムに選択肢を選ぶ
    const options = await page.$$('input[type="radio"]');
    if (options.length > 0) {
      const randomIndex = Math.floor(Math.random() * options.length);
      await options[randomIndex].click();
      
      // 少し待つ
      await page.waitForTimeout(200);
      
      // 次へボタンをクリック（IDで直接選択）
      try {
        const nextButton = await page.$('#next-btn:not([disabled])');
        if (nextButton) {
          await nextButton.click();
        } else {
          // クラス名でも試す
          await page.click('button:has-text("次の質問")');
        }
      } catch (e) {
        console.log(`⚠️ Question ${i + 1}: 次へボタンクリック失敗`);
      }
    } else {
      console.log(`⚠️ Question ${i + 1}: No options found`);
    }
  }
  
  console.log('✅ Step 3: 36問回答完了');
  
  // 分析画面または結果画面を待つ
  await page.waitForTimeout(5000);
  
  // 各画面の状態を確認
  const screens = await page.evaluate(() => {
    return {
      welcome: document.getElementById('welcome-screen')?.style.display,
      question: document.getElementById('question-screen')?.style.display,
      analysis: document.getElementById('analysis-screen')?.style.display,
      results: document.getElementById('results-screen')?.style.display,
      currentURL: window.location.href,
      userAnswers: Object.keys(window.userAnswers || {}).length
    };
  });
  
  console.log('\n📊 最終状態:');
  console.log(`   回答数: ${screens.userAnswers}/36`);
  console.log(`   ウェルカム画面: ${screens.welcome === 'none' ? '非表示' : '表示'}`);
  console.log(`   質問画面: ${screens.question === 'none' ? '非表示' : '表示'}`);
  console.log(`   分析画面: ${screens.analysis === 'none' ? '非表示' : screens.analysis === 'block' ? '✅ 表示中' : screens.analysis}`);
  console.log(`   結果画面: ${screens.results === 'none' ? '非表示' : screens.results === 'block' ? '✅ 表示中' : screens.results}`);
  
  // 結果画面の内容を確認
  if (screens.results === 'block' || screens.results === '') {
    console.log('\n🎯 結果画面の内容を確認...');
    const resultsContent = await page.evaluate(() => {
      const resultsScreen = document.getElementById('results-screen');
      if (resultsScreen) {
        return {
          visible: true,
          hasEngineOS: !!resultsScreen.querySelector('.engine-os-section'),
          hasInterfaceOS: !!resultsScreen.querySelector('.interface-os-section'),
          hasSafeOS: !!resultsScreen.querySelector('.safe-mode-os-section'),
          innerHTML: resultsScreen.innerHTML.substring(0, 200)
        };
      }
      return { visible: false };
    });
    
    if (resultsContent.visible) {
      console.log('✅ 結果画面が表示されています');
      console.log(`   Engine OS セクション: ${resultsContent.hasEngineOS ? '✅' : '❌'}`);
      console.log(`   Interface OS セクション: ${resultsContent.hasInterfaceOS ? '✅' : '❌'}`);
      console.log(`   Safe Mode OS セクション: ${resultsContent.hasSafeOS ? '✅' : '❌'}`);
    }
  }
  
  // スクリーンショットを撮る
  await page.screenshot({ path: 'os-analyzer-complete-test.png', fullPage: false });
  console.log('\n📸 スクリーンショット保存: os-analyzer-complete-test.png');
  
  // 10秒待ってから終了（結果を確認するため）
  console.log('\n⏳ 10秒後に終了します...');
  await page.waitForTimeout(10000);
  
  await browser.close();
}

testCompleteFlow().catch(console.error);