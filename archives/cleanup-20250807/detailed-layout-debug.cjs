const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    console.log('🔍 Starting detailed layout debug...');
    await page.goto('http://127.0.0.1:8788/public/future_simulator.html');
    await page.waitForTimeout(3000);
    
    const results = await page.evaluate(() => {
      const worryInput = document.getElementById('worryInput');
      const aiGuessBtn = document.getElementById('aiGuessBtn');
      
      const getElementInfo = (element, name) => {
        if (!element) return { name, exists: false };
        
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        
        return {
          name,
          exists: true,
          offsetWidth: element.offsetWidth,
          offsetHeight: element.offsetHeight,
          clientWidth: element.clientWidth,
          clientHeight: element.clientHeight,
          rect: {
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left
          },
          styles: {
            display: style.display,
            visibility: style.visibility,
            opacity: style.opacity,
            position: style.position,
            zIndex: style.zIndex,
            width: style.width,
            height: style.height,
            maxWidth: style.maxWidth,
            maxHeight: style.maxHeight,
            overflow: style.overflow,
            transform: style.transform
          },
          parentInfo: element.parentElement ? {
            tagName: element.parentElement.tagName,
            className: element.parentElement.className,
            display: getComputedStyle(element.parentElement).display,
            visibility: getComputedStyle(element.parentElement).visibility,
            overflow: getComputedStyle(element.parentElement).overflow,
            width: element.parentElement.offsetWidth,
            height: element.parentElement.offsetHeight
          } : null
        };
      };
      
      return {
        worryInput: getElementInfo(worryInput, 'worryInput'),
        aiGuessBtn: getElementInfo(aiGuessBtn, 'aiGuessBtn'),
        bodyInfo: {
          scrollHeight: document.body.scrollHeight,
          scrollWidth: document.body.scrollWidth,
          clientHeight: document.body.clientHeight,
          clientWidth: document.body.clientWidth
        },
        documentInfo: {
          readyState: document.readyState,
          scriptsLoaded: document.scripts.length,
          hasMainContent: Boolean(document.getElementById('main-content')),
          hasInputContent: Boolean(document.getElementById('input-content'))
        }
      };
    });
    
    console.log('🚨 DETAILED LAYOUT DEBUG RESULTS:');
    console.log(JSON.stringify(results, null, 2));
    
    // 要素を強制表示してテスト
    await page.evaluate(() => {
      const worryInput = document.getElementById('worryInput');
      const aiGuessBtn = document.getElementById('aiGuessBtn');
      
      if (worryInput) {
        worryInput.style.cssText = `
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          width: 500px !important;
          height: 100px !important;
          background-color: #1f2937 !important;
          color: white !important;
          border: 2px solid #6366f1 !important;
          position: fixed !important;
          top: 50px !important;
          left: 50px !important;
          z-index: 9999 !important;
        `;
      }
      
      if (aiGuessBtn) {
        aiGuessBtn.style.cssText = `
          display: flex !important;
          visibility: visible !important;
          opacity: 1 !important;
          width: 200px !important;
          height: 50px !important;
          background-color: #0d9488 !important;
          color: white !important;
          border: none !important;
          position: fixed !important;
          top: 200px !important;
          left: 50px !important;
          z-index: 9999 !important;
        `;
      }
    });
    
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'force-visible-debug.png', 
      fullPage: true 
    });
    
    console.log('📸 Force visible screenshot saved');
    
    await browser.close();
    
  } catch (error) {
    console.error('❌ Detailed debug failed:', error);
  }
})();