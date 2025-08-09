const { chromium } = require("playwright");

async function test() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  const page = await browser.newPage();

  try {
    console.log("🚨 HAQEI修正後システム完全動作検証開始");
    
    await page.goto("http://127.0.0.1:8083/future_simulator.html", {
      waitUntil: "networkidle"
    });
    console.log("✅ ページロード成功");
    
    await page.screenshot({ path: "screenshot-initial.png", fullPage: true });
    console.log("✅ 初期スクリーンショット保存");
    
    const title = await page.title();
    console.log("📄 ページタイトル:", title);
    
    // テスト文章入力
    const testInput = "転職を考えているが、現在の安定した職を手放すリスクが心配。新しい挑戦をしたい気持ちと安全を求める気持ちが混在している。";
    
    try {
      await page.waitForSelector("#worryInput", { timeout: 5000 });
      await page.fill("#worryInput", testInput);
      console.log("✅ テスト文章入力完了");
      
      await page.screenshot({ path: "screenshot-input.png", fullPage: true });
      
      await page.click("#aiGuessBtn");
      console.log("✅ 分析ボタンクリック完了");
      
      await page.waitForTimeout(3000);
      
      // 結果表示確認
      const resultArea = await page.$("#resultArea");
      const isVisible = resultArea ? await resultArea.isVisible() : false;
      console.log("🎯 結果表示状態:", isVisible ? "表示中" : "非表示");
      
      await page.screenshot({ path: "screenshot-final.png", fullPage: true });
      console.log("✅ 最終スクリーンショット保存");
      
      console.log("🎊 検証完了 - 結果:", isVisible ? "成功" : "失敗");
      return isVisible;
      
    } catch (elementError) {
      console.error("❌ 要素操作エラー:", elementError.message);
      await page.screenshot({ path: "screenshot-error.png", fullPage: true });
      return false;
    }
    
  } catch (error) {
    console.error("❌ 全体エラー:", error.message);
    return false;
  } finally {
    await browser.close();
  }
}

test().then(success => {
  if (success) {
    console.log("🎊 修正後システム: 完全動作確認 ✅");
  } else {
    console.log("🚨 修正後システム: 問題検出 ❌");
  }
});
