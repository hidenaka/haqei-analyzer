const puppeteer = require("puppeteer");

(async () => {
  console.log("=== I Ching Integration Test Starting ===");
  
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    
    // Capture console logs
    page.on("console", msg => console.log("BROWSER:", msg.text()));
    page.on("pageerror", error => console.log("ERROR:", error.message));
    
    console.log("Phase 1: Navigation Test");
    await page.goto("http://localhost:8000/future_simulator.html", { 
      waitUntil: "networkidle2",
      timeout: 30000
    });
    
    const title = await page.title();
    console.log("✓ Page title:", title);
    
    console.log("Phase 2: UI Elements Test");
    const textareaCount = await page.$$eval("textarea", els => els.length);
    console.log("✓ Textareas found:", textareaCount);
    
    const buttonCount = await page.$$eval("button", els => els.length);
    console.log("✓ Buttons found:", buttonCount);
    
    console.log("Phase 3: Input Test");
    if (textareaCount > 0) {
      await page.type("textarea", "転職について迷っています");
      console.log("✓ Text input successful");
    }
    
    console.log("Phase 4: Analysis Test");
    const analyzeButtons = await page.$x("//button[contains(text(), \"分析\")]");
    if (analyzeButtons.length > 0) {
      await analyzeButtons[0].click();
      console.log("✓ Analyze button clicked");
      await page.waitForTimeout(3000);
    }
    
    console.log("Phase 5: Results Check");
    const content = await page.content();
    const hasHexagram = content.includes("卦") || content.includes("hexagram");
    const hasScenarios = content.includes("シナリオ") || content.includes("scenario");
    
    console.log("✓ Hexagram content:", hasHexagram);
    console.log("✓ Scenario content:", hasScenarios);
    
    console.log("=== Test Completed ===");
    
  } catch (error) {
    console.error("Test failed:", error.message);
  } finally {
    if (browser) await browser.close();
  }
})();
