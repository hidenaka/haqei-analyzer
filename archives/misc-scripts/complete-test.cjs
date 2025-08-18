const { chromium } = require("playwright");

async function completeQuestions() {
  const browser = await chromium.launch({ headless: false, slowMo: 800 });
  const page = await browser.newPage();
  
  try {
    await page.goto("http://localhost:8888/os_analyzer.html");
    await page.waitForTimeout(2000);
    await page.click("body");
    await page.waitForTimeout(2000);
    
    // 開始ボタンをクリック
    const buttons = await page.locator("button").all();
    for (let b of buttons) {
      const text = await b.textContent();
      if (text && text.includes("分析")) {
        await b.click();
        break;
      }
    }
    
    await page.waitForTimeout(2000);
    
    // 質問に回答
    let questionCount = 0;
    while (questionCount < 50) { // 最大50問まで対応
      try {
        // 選択肢を探す
        const choices = await page.locator("button").all();
        let answered = false;
        
        for (let choice of choices) {
          const text = await choice.textContent();
          // 選択肢らしいボタンを見つけたらクリック
          if (text && (text.includes("積極的") || text.includes("慎重") || text.includes("周り") || text.length < 50)) {
            await choice.click();
            questionCount++;
            console.log(`質問 ${questionCount} 回答完了`);
            answered = true;
            await page.waitForTimeout(1500);
            break;
          }
        }
        
        if (!answered) {
          // 結果画面に到達したかチェック
          const resultIndicators = await page.locator("text=結果, text=性格分析, text=あなたの, text=Engine OS, text=Interface OS").count();
          if (resultIndicators > 0) {
            console.log("結果画面に到達しました");
            break;
          } else {
            console.log("選択肢が見つからないため終了");
            break;
          }
        }
        
      } catch (error) {
        console.log("エラーまたは完了:", error.message);
        break;
      }
    }
    
    // 結果画面のスクリーンショット
    await page.waitForTimeout(3000);
    await page.screenshot({ path: "final-result-desktop.png", fullPage: true });
    console.log("デスクトップ版結果画面を保存しました");
    
    // モバイル版テスト
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: "final-result-mobile.png", fullPage: true });
    console.log("モバイル版結果画面を保存しました");
    
    // タブレット版テスト
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: "final-result-tablet.png", fullPage: true });
    console.log("タブレット版結果画面を保存しました");
    
    console.log("全てのテスト完了！");
    
  } catch (error) {
    console.error("Error:", error.message);
    await page.screenshot({ path: "final-error.png" });
  } finally {
    // ブラウザを開いたまま詳細確認用
    console.log("ブラウザは開いたままです。結果画面を手動で確認してください。");
  }
}

completeQuestions();
