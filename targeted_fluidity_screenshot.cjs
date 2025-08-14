const puppeteer = require("puppeteer");

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  console.log("Taking targeted fluidity insight section screenshot...");
  
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
    
    // Wait for content to load
    await sleep(5000);
    
    // Get page height and section position
    const elementInfo = await page.evaluate(() => {
      const fluiditySection = document.querySelector('.fluidity-insight-section');
      if (fluiditySection) {
        const rect = fluiditySection.getBoundingClientRect();
        const scrollY = window.scrollY;
        return {
          found: true,
          top: rect.top + scrollY,
          height: rect.height,
          pageHeight: document.body.scrollHeight
        };
      }
      return { found: false, pageHeight: document.body.scrollHeight };
    });
    
    console.log("Element info:", elementInfo);
    
    if (elementInfo.found) {
      // Scroll to the section
      await page.evaluate((top) => {
        window.scrollTo(0, Math.max(0, top - 100));
      }, elementInfo.top);
      
      await sleep(2000);
      
      // Take screenshot of the fluidity section
      await page.screenshot({ 
        path: `targeted_fluidity_${Date.now()}.png`,
        fullPage: false,
        clip: { x: 0, y: 0, width: 1200, height: 2000 }
      });
      
      console.log("✓ Targeted fluidity section screenshot saved");
    } else {
      console.log("Fluidity section not found, taking full page screenshot...");
      
      // Take multiple screenshots at different scroll positions
      const screenshots = [];
      const pageHeight = elementInfo.pageHeight;
      const viewportHeight = 2000;
      const steps = Math.ceil(pageHeight / viewportHeight);
      
      for (let i = 0; i < steps; i++) {
        const scrollTop = i * viewportHeight;
        await page.evaluate((top) => {
          window.scrollTo(0, top);
        }, scrollTop);
        
        await sleep(1000);
        
        await page.screenshot({ 
          path: `page_section_${i + 1}_${Date.now()}.png`,
          fullPage: false,
          clip: { x: 0, y: 0, width: 1200, height: Math.min(viewportHeight, pageHeight - scrollTop) }
        });
        
        console.log(`✓ Page section ${i + 1} screenshot saved`);
      }
    }
    
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await browser.close();
  }
})();