const puppeteer = require("puppeteer");

(async () => {
  console.log("Taking OS Analyzer HaQei philosophy evaluation screenshots...");
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  
  // Set viewport size for better screenshots
  await page.setViewport({ 
    width: 1920, 
    height: 1080,
    deviceScaleFactor: 1
  });
  
  try {
    // Navigate to os_analyzer.html with simpler loading strategy
    await page.goto("http://localhost:8090/os_analyzer.html", { 
      waitUntil: "domcontentloaded",
      timeout: 10000
    });
    
    // Wait for page to fully load
    await page.waitFor(3000);
    
    // Take full page screenshot 
    await page.screenshot({ 
      path: `os_analyzer_full_page_evaluation_${Date.now()}.png`, 
      fullPage: false,  // Avoiding fullPage to prevent oversized images
      clip: { x: 0, y: 0, width: 1920, height: 4000 } // Capture first 4000px height
    });
    console.log("✓ Full page overview screenshot saved");
    
    // Try to scroll to the personality fluidity section
    await page.evaluate(() => {
      const fluiditySection = document.querySelector('.fluidity-insight-section');
      if (fluiditySection) {
        fluiditySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    
    await page.waitFor(2000);
    
    // Take focused screenshot of the fluidity insight section
    await page.screenshot({ 
      path: `os_analyzer_fluidity_section_${Date.now()}.png`, 
      fullPage: false,
      clip: { x: 0, y: 0, width: 1920, height: 2000 }
    });
    console.log("✓ Personality fluidity section screenshot saved");
    
    // Take mobile-responsive screenshot
    await page.setViewport({ 
      width: 375, 
      height: 667,
      deviceScaleFactor: 2,
      isMobile: true
    });
    
    await page.waitFor(1000);
    
    await page.screenshot({ 
      path: `os_analyzer_mobile_view_${Date.now()}.png`, 
      fullPage: false,
      clip: { x: 0, y: 0, width: 375, height: 2000 }
    });
    console.log("✓ Mobile responsive view screenshot saved");
    
    console.log("All evaluation screenshots completed successfully");
    
  } catch (error) {
    console.error("Screenshot error:", error.message);
  } finally {
    await browser.close();
  }
})();