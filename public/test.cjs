const { chromium } = require('playwright');

async function test() {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:8888/os_analyzer.html');
    await page.waitForTimeout(3000);
    await page.click('body');
    await page.waitForTimeout(2000);
    await page.click('button:has-text("分析開始")');
    await page.waitForTimeout(3000);
    
    // 質問に回答
    for (let q = 0; q < 36; q++) {
      try {
        const buttons = await page.locator('button').all();
        if (buttons.length > 0) {
          await buttons[0].click();
          console.log('Question', q + 1, 'answered');
          await page.waitForTimeout(800);
        }
      } catch (e) {
        break;
      }
    }
    
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'result-full.png', fullPage: true });
    
    // モバイルテスト
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'result-mobile.png' });
    
    console.log('Test completed');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

test();
