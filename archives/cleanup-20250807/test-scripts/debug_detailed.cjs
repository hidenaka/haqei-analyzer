const { chromium } = require("playwright");

async function debugJavaScriptErrors() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  const page = await browser.newPage();

  // コンソールログ監視
  const logs = [];
  const errors = [];
  
  page.on("console", msg => {
    const log = `${msg.type()}: ${msg.text()}`;
    logs.push(log);
    console.log(`📋 CONSOLE: ${log}`);
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
    console.log("🔍 JavaScript/CSS問題詳細調査開始");
    
    await page.goto("http://127.0.0.1:8083/future_simulator.html", {
      waitUntil: "load",
      timeout: 15000
    });
    
    // 5秒待機してログを収集
    await page.waitForTimeout(5000);
    
    console.log("📋 ページ読み込み後の状態確認:");
    
    // body要素の内容確認
    const bodyContent = await page.evaluate(() => {
      return {
        innerHTML: document.body.innerHTML.substring(0, 500),
        childElementCount: document.body.childElementCount,
        hasWorryInput: !!document.getElementById("worryInput"),
        worryInputStyle: document.getElementById("worryInput")?.style.display || "not found"
      };
    });
    
    console.log("🔍 Body content analysis:", bodyContent);
    
    // CSS読み込み状況確認
    const cssStatus = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("link[rel=stylesheet]"));
      return links.map(link => ({
        href: link.href,
        loaded: link.sheet !== null
      }));
    });
    
    console.log("🎨 CSS loading status:", cssStatus);
    
    // JavaScript読み込み状況確認
    const scriptStatus = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll("script[src]"));
      return scripts.map(script => script.src);
    });
    
    console.log("⚙️ Script sources:", scriptStatus);
    
    await page.screenshot({ path: "debug-detailed-analysis.png", fullPage: true });
    
    console.log("📊 調査結果サマリー:");
    console.log("- コンソールログ:", logs.length, "件");
    console.log("- ページエラー:", errors.length, "件");
    console.log("- Body要素数:", bodyContent.childElementCount);
    console.log("- worryInput存在:", bodyContent.hasWorryInput);
    console.log("- worryInputスタイル:", bodyContent.worryInputStyle);
    
    return {
      logs,
      errors,
      bodyContent,
      cssStatus,
      scriptStatus
    };
    
  } catch (error) {
    console.error("❌ 調査エラー:", error.message);
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

debugJavaScriptErrors().then(result => {
  console.log("🎯 最終調査結果:", JSON.stringify(result, null, 2));
});
