const { chromium } = require("playwright");

async function testJavaScriptErrors() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  const page = await browser.newPage();

  // JavaScript エラー監視
  const errors = [];
  const logs = [];
  
  page.on("console", msg => {
    const log = `${msg.type()}: ${msg.text()}`;
    logs.push(log);
    if (msg.type() === 'error') {
      console.log(`🚨 CONSOLE ERROR: ${log}`);
      errors.push(log);
    }
  });
  
  page.on("pageerror", error => {
    const errorMsg = `PAGE ERROR: ${error.message}`;
    errors.push(errorMsg);
    console.log(`🚨 ${errorMsg}`);
  });

  try {
    console.log("🔧 JavaScript修正効果テスト開始");
    
    await page.goto("http://127.0.0.1:8084/future_simulator.html", {
      waitUntil: "load",
      timeout: 15000
    });
    
    // 5秒待機してエラー収集
    await page.waitForTimeout(5000);
    
    console.log("📊 修正後エラー分析:");
    console.log(`- 総コンソールメッセージ: ${logs.length}件`);
    console.log(`- エラーメッセージ: ${errors.length}件`);
    
    // 修正対象エラーの確認
    const criticalErrors = errors.filter(error => 
      error.includes('loadConceptDatabase') ||
      error.includes('createSpatialFramework') ||
      error.includes('createUrgencyFramework') ||
      error.includes('loadLineData') ||
      error.includes('setupCharacterCounter') ||
      error.includes('bind')
    );
    
    console.log(`- 修正対象エラー: ${criticalErrors.length}件`);
    criticalErrors.forEach(error => console.log(`  ❌ ${error}`));
    
    // Chart.js読み込み確認
    const chartLoaded = await page.evaluate(() => {
      return typeof window.Chart !== 'undefined';
    });
    console.log(`- Chart.js読み込み: ${chartLoaded ? '✅ 成功' : '❌ 失敗'}`);
    
    // worryInput動作確認
    const inputWorking = await page.evaluate(() => {
      const input = document.getElementById('worryInput');
      return input && input.offsetWidth > 0 && input.offsetHeight > 0;
    });
    console.log(`- worryInput動作: ${inputWorking ? '✅ 正常' : '❌ 問題'}`);
    
    await page.screenshot({ path: "javascript-fix-test.png", fullPage: true });
    
    return {
      totalLogs: logs.length,
      totalErrors: errors.length,
      criticalErrors: criticalErrors.length,
      chartLoaded,
      inputWorking,
      errors: errors.slice(0, 10) // 最初の10件のエラーのみ
    };
    
  } catch (error) {
    console.error("❌ テストエラー:", error.message);
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

testJavaScriptErrors().then(result => {
  console.log("🎯 JavaScript修正テスト結果:");
  console.log(JSON.stringify(result, null, 2));
});