const { chromium } = require("playwright");

async function emergencyUserTest() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  const page = await browser.newPage();

  // 全エラー監視
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
      console.log(`⚠️ WARNING: ${log}`);
    }
  });
  
  page.on("pageerror", error => {
    const errorMsg = `PAGE ERROR: ${error.message}`;
    errors.push(errorMsg);
    console.log(`🚨 ${errorMsg}`);
  });

  page.on("requestfailed", request => {
    console.log(`❌ FAILED REQUEST: ${request.url()} - ${request.failure().errorText}`);
  });

  try {
    console.log("🚨 緊急ユーザー検証開始 - 最初の画面表示確認");
    
    // 複数ポートで試行
    const ports = [8084, 8085, 8788];
    let successfulPort = null;
    
    for (const port of ports) {
      try {
        console.log(`🔗 ポート${port}でアクセス試行...`);
        await page.goto(`http://127.0.0.1:${port}/future_simulator.html`, {
          waitUntil: "domcontentloaded",
          timeout: 8000
        });
        successfulPort = port;
        console.log(`✅ ポート${port}でアクセス成功`);
        break;
      } catch (error) {
        console.log(`❌ ポート${port}でアクセス失敗: ${error.message}`);
        continue;
      }
    }
    
    if (!successfulPort) {
      throw new Error("全てのポートでアクセス失敗");
    }
    
    // 緊急スクリーンショット撮影
    await page.screenshot({ path: "emergency-step1-initial-load.png", fullPage: true });
    console.log("📸 緊急スクリーンショット1: 初期読み込み状態");
    
    // 5秒待機
    await page.waitForTimeout(5000);
    await page.screenshot({ path: "emergency-step2-after-wait.png", fullPage: true });
    console.log("📸 緊急スクリーンショット2: 5秒後の状態");
    
    // 基本要素の存在確認
    const basicElements = await page.evaluate(() => {
      return {
        title: document.title,
        bodyExists: !!document.body,
        worryInputExists: !!document.getElementById('worryInput'),
        aiGuessBtnExists: !!document.getElementById('aiGuessBtn'),
        bodyContent: document.body ? document.body.innerText.substring(0, 500) : 'No body',
        htmlContent: document.documentElement.outerHTML.substring(0, 1000)
      };
    });
    
    console.log("🔍 基本要素確認:");
    console.log(`- タイトル: ${basicElements.title}`);
    console.log(`- Body存在: ${basicElements.bodyExists ? '✅' : '❌'}`);
    console.log(`- worryInput存在: ${basicElements.worryInputExists ? '✅' : '❌'}`);
    console.log(`- aiGuessBtn存在: ${basicElements.aiGuessBtnExists ? '✅' : '❌'}`);
    
    // ページの実際の状態確認
    const pageState = await page.evaluate(() => {
      return {
        readyState: document.readyState,
        loadingElements: document.querySelectorAll('[style*="display: none"]').length,
        visibleElements: document.querySelectorAll(':not([style*="display: none"])').length,
        errors: window.console ? 'Console available' : 'No console',
        scripts: document.querySelectorAll('script').length,
        stylesheets: document.querySelectorAll('link[rel="stylesheet"]').length
      };
    });
    
    console.log("📊 ページ状態詳細:");
    console.log(`- Ready State: ${pageState.readyState}`);
    console.log(`- 非表示要素数: ${pageState.loadingElements}`);
    console.log(`- 表示要素数: ${pageState.visibleElements}`);
    console.log(`- Script数: ${pageState.scripts}`);
    console.log(`- CSS数: ${pageState.stylesheets}`);
    
    return {
      success: true,
      port: successfulPort,
      basicElements,
      pageState,
      errors: errors.length,
      warnings: warnings.length,
      logs: logs.length
    };
    
  } catch (error) {
    console.error("🚨 緊急検証失敗:", error.message);
    try {
      await page.screenshot({ path: "emergency-error-state.png", fullPage: true });
    } catch (screenshotError) {
      console.error("スクリーンショット撮影も失敗:", screenshotError.message);
    }
    return { 
      success: false, 
      error: error.message,
      errors: errors.length,
      warnings: warnings.length
    };
  } finally {
    await browser.close();
  }
}

emergencyUserTest().then(result => {
  console.log("\n🎯 緊急ユーザー検証結果:");
  console.log(JSON.stringify(result, null, 2));
  
  if (result.success) {
    console.log("✅ 最初の画面読み込み: 成功");
    if (result.basicElements.worryInputExists && result.basicElements.aiGuessBtnExists) {
      console.log("✅ 基本UI要素: 正常");
    } else {
      console.log("❌ 基本UI要素: 問題あり");
    }
  } else {
    console.log("🚨 最初の画面読み込み: 完全失敗");
  }
});