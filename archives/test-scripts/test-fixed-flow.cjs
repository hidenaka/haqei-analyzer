// OS Analyzer修正版フローテスト
const { chromium } = require('playwright');

async function testFixedFlow() {
  console.log('🚀 OS Analyzer Fixed Flow Test Starting...');
  
  const browser = await chromium.launch({ 
    headless: true  // ヘッドレスで実行
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // コンソールログを取得
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Answer saved') || text.includes('Starting Triple OS analysis')) {
      console.log(`📝 ${text}`);
    }
  });
  
  // ページを開く
  const filePath = '/Users/hideakimacbookair/Desktop/haqei-analyzer/public/os_analyzer.html';
  await page.goto(`file://${filePath}`);
  
  console.log('✅ Page loaded');
  
  // 分析開始ボタンをクリック
  await page.click('button:has-text("分析を始める")');
  console.log('✅ Started analysis');
  
  // 36問に順次回答
  for (let i = 0; i < 36; i++) {
    await page.waitForTimeout(200); // 画面遷移を待つ
    
    // ランダムに選択肢を選ぶ
    const options = await page.$$('input[type="radio"]');
    if (options.length > 0) {
      const randomIndex = Math.floor(Math.random() * options.length);
      await options[randomIndex].click();
      
      // 次へボタンをクリック
      const nextButton = await page.$('button.nav-button.next:not([disabled])');
      if (nextButton) {
        await nextButton.click();
      }
    }
  }
  
  // 分析画面を待つ
  await page.waitForTimeout(3000);
  
  // 結果を確認
  const userAnswers = await page.evaluate(() => window.userAnswers);
  const resultsVisible = await page.isVisible('#results-screen');
  const analysisVisible = await page.isVisible('#analysis-screen');
  
  console.log(`\n📊 Final Status:`);
  console.log(`   Answers collected: ${Object.keys(userAnswers).length}/36`);
  console.log(`   Results Screen: ${resultsVisible ? '✅ VISIBLE' : '❌ NOT VISIBLE'}`);
  console.log(`   Analysis Screen: ${analysisVisible ? '✅ VISIBLE' : '❌ NOT VISIBLE'}`);
  
  if (Object.keys(userAnswers).length === 36) {
    console.log('✅ All 36 answers saved successfully!');
  } else {
    console.log('❌ Not all answers were saved');
  }
  
  // スクリーンショットを撮る
  await page.screenshot({ path: 'os-analyzer-fixed-test.png' });
  console.log(`📸 Screenshot saved: os-analyzer-fixed-test.png`);
  
  await browser.close();
}

testFixedFlow().catch(console.error);