const puppeteer = require("puppeteer");

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  console.log("Taking fluidity insight section screenshot...");
  
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
    
    // Scroll to find the fluidity insight section
    await page.evaluate(() => {
      const fluiditySection = document.querySelector('.fluidity-insight-section');
      if (fluiditySection) {
        fluiditySection.scrollIntoView({ behavior: 'instant', block: 'start' });
      } else {
        // If specific class not found, try alternative selectors
        const element = document.querySelector('h2');
        if (element) {
          const elements = document.querySelectorAll('h2, h3');
          for (let el of elements) {
            if (el.textContent.includes('人格の流動性') || el.textContent.includes('流動性') || el.textContent.includes('発見')) {
              el.scrollIntoView({ behavior: 'instant', block: 'start' });
              break;
            }
          }
        }
        // If still not found, scroll to middle of page
        window.scrollTo(0, document.body.scrollHeight * 0.4);
      }
    });
    
    await sleep(2000);
    
    // Take screenshot of this section
    await page.screenshot({ 
      path: `fluidity_section_${Date.now()}.png`,
      fullPage: false,
      clip: { x: 0, y: 0, width: 1200, height: 2400 }
    });
    
    console.log("✓ Fluidity section screenshot saved");
    
    // Also take a full vertical screenshot to see more content
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(1000);
    
    await page.screenshot({ 
      path: `full_vertical_${Date.now()}.png`,
      fullPage: false,
      clip: { x: 0, y: 0, width: 1200, height: 6000 }
    });
    
    console.log("✓ Extended vertical screenshot saved");
    
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await browser.close();
  }
})();