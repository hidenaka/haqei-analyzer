const { chromium } = require("playwright");

async function simpleDebug() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  const page = await browser.newPage();

  try {
    console.log("🔍 簡易デバッグ開始");
    
    await page.goto("http://127.0.0.1:8083/future_simulator.html");
    
    await page.waitForTimeout(3000);
    
    // worryInput要素の詳細確認
    const elementInfo = await page.evaluate(() => {
      const element = document.getElementById("worryInput");
      if (!element) return { found: false };
      
      return {
        found: true,
        tagName: element.tagName,
        display: getComputedStyle(element).display,
        visibility: getComputedStyle(element).visibility,
        opacity: getComputedStyle(element).opacity,
        offsetWidth: element.offsetWidth,
        offsetHeight: element.offsetHeight,
        parentVisible: element.parentElement ? getComputedStyle(element.parentElement).display : "no parent",
        className: element.className,
        hidden: element.hidden
      };
    });
    
    console.log("🔍 worryInput要素詳細:", elementInfo);
    
    await page.screenshot({ path: "debug-simple.png", fullPage: true });
    
    return elementInfo;
    
  } catch (error) {
    console.error("❌ デバッグエラー:", error.message);
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

simpleDebug().then(result => {
  console.log("結果:", JSON.stringify(result, null, 2));
});
