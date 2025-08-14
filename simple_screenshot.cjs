const puppeteer = require("puppeteer");

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  console.log("Taking simple OS Analyzer screenshot...");
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  
  try {
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1200, height: 800 });
    
    // Navigate to page
    await page.goto("http://localhost:8090/os_analyzer.html", { 
      waitUntil: "domcontentloaded"
    });
    
    // Wait a bit for content to load
    await sleep(5000);
    
    // Take screenshot
    await page.screenshot({ 
      path: `os_analyzer_evaluation_${Date.now()}.png`,
      fullPage: false,
      clip: { x: 0, y: 0, width: 1200, height: 3000 }
    });
    
    console.log("✓ Screenshot saved successfully");
    
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await browser.close();
  }
})();