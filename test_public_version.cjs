const { chromium } = require("playwright");

async function testPublicVersion() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  const page = await browser.newPage();

  try {
    console.log("🔄 Public版テスト開始");
    
    await page.goto("http://127.0.0.1:8084/future_simulator.html", {
      waitUntil: "networkidle"
    });
    
    await page.screenshot({ path: "screenshot-public-version.png", fullPage: true });
    console.log("✅ Public版スクリーンショット保存");
    
    const title = await page.title();
    console.log("📄 タイトル:", title);
    
    // worryInput要素の確認
    try {
      await page.waitForSelector("#worryInput", { timeout: 3000 });
      const isVisible = await page.isVisible("#worryInput");
      console.log("✅ worryInput要素:", isVisible ? "表示中" : "非表示");
      
      if (isVisible) {
        await page.fill("#worryInput", "テスト入力");
        console.log("✅ テスト入力成功");
        await page.screenshot({ path: "screenshot-public-input-success.png", fullPage: true });
        return true;
      }
    } catch (e) {
      console.log("❌ worryInput要素エラー:", e.message);
    }
    
    return false;
    
  } catch (error) {
    console.error("❌ Public版テストエラー:", error.message);
    return false;
  } finally {
    await browser.close();
  }
}

testPublicVersion().then(success => {
  console.log("🎯 Public版結果:", success ? "成功" : "失敗");
});
