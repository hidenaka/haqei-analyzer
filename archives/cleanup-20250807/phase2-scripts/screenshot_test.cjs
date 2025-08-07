const puppeteer = require("puppeteer");

(async () => {
  console.log("Taking I Ching integration screenshots...");
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  
  try {
    // Navigate to page
    await page.goto("http://localhost:8000/future_simulator.html", { 
      waitUntil: "networkidle2",
      timeout: 30000
    });
    
    // Wait for initialization
    await page.waitForTimeout(5000);
    
    // Initial page screenshot
    await page.screenshot({ 
      path: "qa_test_initial_page_$(TZ=\"Asia/Tokyo\" date \"+%Y%m%d\").png", 
      fullPage: true 
    });
    console.log("✓ Initial page screenshot saved");
    
    // Input test text
    await page.type("textarea", "転職を考えているが、現在の会社を辞めるべきか迷っている");
    await page.waitForTimeout(1000);
    
    // Screenshot with input
    await page.screenshot({ 
      path: "qa_test_with_input_$(TZ=\"Asia/Tokyo\" date \"+%Y%m%d\").png", 
      fullPage: true 
    });
    console.log("✓ Input screenshot saved");
    
    // Try to find and click analyze button
    const buttons = await page.$$("button");
    for (let button of buttons) {
      const text = await page.evaluate(el => el.textContent, button);
      if (text.includes("分析")) {
        await button.click();
        console.log("✓ Analyze button clicked");
        break;
      }
    }
    
    // Wait for potential results
    await page.waitForTimeout(5000);
    
    // Final screenshot
    await page.screenshot({ 
      path: "qa_test_after_analysis_$(TZ=\"Asia/Tokyo\" date \"+%Y%m%d\").png", 
      fullPage: true 
    });
    console.log("✓ Analysis result screenshot saved");
    
    console.log("Screenshots completed successfully");
    
  } catch (error) {
    console.error("Screenshot error:", error.message);
  } finally {
    await browser.close();
  }
})();
