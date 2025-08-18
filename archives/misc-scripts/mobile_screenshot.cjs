const puppeteer = require("puppeteer");

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  console.log("Taking mobile responsive screenshot...");
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  
  try {
    const page = await browser.newPage();
    
    // Set mobile viewport
    await page.setViewport({ 
      width: 375, 
      height: 667,
      deviceScaleFactor: 2,
      isMobile: true
    });
    
    await page.goto("http://localhost:8090/os_analyzer.html", { 
      waitUntil: "domcontentloaded"
    });
    
    await sleep(5000);
    
    // Take mobile screenshot  
    await page.screenshot({ 
      path: `mobile_responsive_${Date.now()}.png`,
      fullPage: false,
      clip: { x: 0, y: 0, width: 375, height: 3000 }
    });
    
    console.log("✓ Mobile responsive screenshot saved");
    
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await browser.close();
  }
})();