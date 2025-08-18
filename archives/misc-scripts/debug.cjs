const { chromium } = require("playwright");

async function debug() {
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();
  
  try {
    console.log("Loading page...");
    await page.goto("http://localhost:8888/os_analyzer.html");
    await page.waitForTimeout(3000);
    await page.screenshot({ path: "step1-initial.png" });
    
    console.log("Clicking body...");
    await page.click("body");
    await page.waitForTimeout(3000);
    await page.screenshot({ path: "step2-after-click.png" });
    
    const buttons = await page.locator("button").all();
    console.log("Available buttons:", buttons.length);
    
    for (let b of buttons) {
      const text = await b.textContent();
      console.log("Button text:", text);
      if (text && (text.includes("開始") || text.includes("分析"))) {
        console.log("Found start button, clicking...");
        await b.click();
        await page.waitForTimeout(2000);
        break;
      }
    }
    
    await page.screenshot({ path: "step3-after-start.png" });
    console.log("Debug complete");
    
  } catch (error) {
    console.error("Error:", error.message);
    await page.screenshot({ path: "debug-error.png" });
  }
}

debug();
