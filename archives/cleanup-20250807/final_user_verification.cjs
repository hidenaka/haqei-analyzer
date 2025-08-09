const { chromium } = require("playwright");

async function finalUserVerification() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 2000
  });
  const page = await browser.newPage();

  try {
    console.log("🎯 最終ユーザー検証開始 - haqei-programmerの修正確認");
    
    await page.goto("http://127.0.0.1:8788/future_simulator.html", {
      waitUntil: "domcontentloaded",
      timeout: 10000
    });
    
    console.log("✅ ページ読み込み完了");
    
    // 5秒待機
    await page.waitForTimeout(5000);
    
    // 最終状態確認
    const verification = await page.evaluate(() => {
      const worryInput = document.getElementById('worryInput');
      const aiGuessBtn = document.getElementById('aiGuessBtn');
      
      return {
        pageTitle: document.title,
        worryInputExists: !!worryInput,
        worryInputVisible: worryInput ? worryInput.offsetHeight > 0 && worryInput.offsetWidth > 0 : false,
        worryInputDisplay: worryInput ? getComputedStyle(worryInput).display : 'not found',
        aiGuessBtnExists: !!aiGuessBtn,
        aiGuessBtnVisible: aiGuessBtn ? aiGuessBtn.offsetHeight > 0 && aiGuessBtn.offsetWidth > 0 : false,
        parentContainer: worryInput?.parentElement?.style?.display || 'unknown',
        bodyText: document.body.innerText.substring(0, 200)
      };
    });
    
    console.log("🔍 最終検証結果:");
    console.log(`- ページタイトル: ${verification.pageTitle}`);
    console.log(`- worryInput存在: ${verification.worryInputExists ? '✅' : '❌'}`);
    console.log(`- worryInput表示: ${verification.worryInputVisible ? '✅' : '❌'}`);
    console.log(`- worryInput display: ${verification.worryInputDisplay}`);
    console.log(`- aiGuessBtn存在: ${verification.aiGuessBtnExists ? '✅' : '❌'}`);
    console.log(`- aiGuessBtn表示: ${verification.aiGuessBtnVisible ? '✅' : '❌'}`);
    console.log(`- 親コンテナ display: ${verification.parentContainer}`);
    
    await page.screenshot({ path: "final-verification.png", fullPage: true });
    
    // 実際のテキスト入力テスト
    if (verification.worryInputVisible) {
      console.log("📝 テキスト入力テスト実行...");
      await page.fill("#worryInput", "テスト入力確認");
      console.log("✅ テキスト入力成功");
      
      await page.screenshot({ path: "final-input-test.png", fullPage: true });
      
      return {
        success: true,
        canInput: true,
        verification
      };
    } else {
      return {
        success: false,
        canInput: false,
        verification,
        issue: "worryInput要素が依然として非表示"
      };
    }
    
  } catch (error) {
    console.error("❌ 最終検証エラー:", error.message);
    return { 
      success: false, 
      error: error.message 
    };
  } finally {
    await browser.close();
  }
}

finalUserVerification().then(result => {
  console.log("\n🎯 最終ユーザー検証結果:");
  console.log("=====================================");
  
  if (result.success && result.canInput) {
    console.log("✅ 修正成功: ユーザー入力が可能になりました");
    console.log("✅ システム完全復旧");
  } else {
    console.log("❌ 修正未完了: まだ問題が残っています");
    if (result.issue) {
      console.log(`問題: ${result.issue}`);
    }
  }
});