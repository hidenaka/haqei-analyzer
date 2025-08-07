const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, devtools: true });
  const page = await browser.newPage();
  
  // JavaScript エラーの詳細取得
  page.on('pageerror', err => {
    console.log('❌ PAGE ERROR:', err.message);
    console.log('Stack:', err.stack);
    
    // エラーの詳細をファイル名と行番号で解析
    const errorMatch = err.message.match(/(\d+):(\d+)/);
    if (errorMatch) {
      console.log(`エラー位置: Line ${errorMatch[1]}, Column ${errorMatch[2]}`);
    }
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    } else {
      console.log(`[${msg.type().toUpperCase()}]`, msg.text());
    }
  });
  
  try {
    console.log('🚀 Testing OS Analyzer with fixed assets...');
    await page.goto('http://localhost:8788/os_analyzer.html');
    
    // 5秒待って初期化を確認
    await page.waitForTimeout(5000);
    
    // JavaScriptオブジェクトの存在確認
    const diagnostics = await page.evaluate(() => {
      return {
        hasH384Database: typeof window.H384H64DATABASE !== 'undefined',
        hasEnergyEngine: typeof window.AuthenticEnergyBalanceEngine !== 'undefined',
        hasAnalyzer: typeof window.criticalCSSAnalyzer !== 'undefined',
        hasPersonaEnhancer: typeof window.virtualPersonaEnhancer !== 'undefined'
      };
    });
    
    console.log('🔍 System Diagnostics:', diagnostics);
    
    if (diagnostics.hasAnalyzer) {
      console.log('✅ Main analyzer initialized successfully');
      
      // スタートボタンテスト
      const startBtn = await page.$('.start-button');
      if (startBtn) {
        console.log('✅ Start button found - attempting click...');
        await startBtn.click();
        await page.waitForTimeout(2000);
        
        const questionScreen = await page.$('#question-screen.active');
        if (questionScreen) {
          console.log('🎉 SUCCESS: Successfully transitioned to question screen!');
        } else {
          console.log('❌ Failed to transition to question screen');
        }
      }
    } else {
      console.log('❌ Main analyzer not initialized');
    }
    
  } catch (error) {
    console.log('❌ Test Error:', error.message);
  }
  
  await page.waitForTimeout(3000);
  await browser.close();
})();