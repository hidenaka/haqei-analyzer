#!/usr/bin/env node
const { chromium } = require('playwright');

async function javascriptDebug() {
  console.log('🔍 JavaScript Debug - CriticalCSSAnalyzer動作確認');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Console監視
  page.on('console', msg => {
    console.log(`📋 [${msg.type()}] ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    console.log(`❌ Page Error: ${error.message}`);
  });
  
  try {
    await page.goto('http://localhost:8788/os_analyzer.html');
    await page.waitForTimeout(3000);
    
    // JavaScript状態確認
    const jsDebug = await page.evaluate(() => {
      return {
        analyzer: typeof window.criticalCSSAnalyzer,
        analyzerMethods: window.criticalCSSAnalyzer ? Object.getOwnPropertyNames(Object.getPrototypeOf(window.criticalCSSAnalyzer)) : [],
        startBtn: document.getElementById('start-btn') ? 'exists' : 'missing',
        questionScreen: document.getElementById('question-screen') ? 'exists' : 'missing',
        welcomeScreen: document.getElementById('welcome-screen') ? 'exists' : 'missing',
        screens: Array.from(document.querySelectorAll('.screen')).map(s => ({ id: s.id, active: s.classList.contains('active') }))
      };
    });
    
    console.log('📊 JavaScript状態:', jsDebug);
    
    // 開始ボタンクリック前のスクリーンショット
    await page.screenshot({ path: 'js-debug-before-click.png', fullPage: true });
    
    // 手動でstartAnalysis実行
    console.log('🚀 手動startAnalysis実行...');
    const result = await page.evaluate(() => {
      try {
        if (window.criticalCSSAnalyzer && typeof window.criticalCSSAnalyzer.startAnalysis === 'function') {
          window.criticalCSSAnalyzer.startAnalysis();
          return { success: true, message: 'startAnalysis executed' };
        } else {
          return { success: false, message: 'startAnalysis not found' };
        }
      } catch (error) {
        return { success: false, message: error.message };
      }
    });
    
    console.log('📋 startAnalysis結果:', result);
    await page.waitForTimeout(3000);
    
    // 実行後の状態確認
    const afterState = await page.evaluate(() => {
      return {
        currentScreen: Array.from(document.querySelectorAll('.screen.active')).map(s => s.id),
        questionVisible: document.getElementById('question-screen')?.style.display !== 'none',
        currentQuestion: window.criticalCSSAnalyzer?.state?.currentQuestion,
        questionText: document.querySelector('#question-text, .question-text')?.textContent
      };
    });
    
    console.log('📋 実行後状態:', afterState);
    
    await page.screenshot({ path: 'js-debug-after-start.png', fullPage: true });
    
    // 30秒待機してユーザー確認
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('❌ JavaScript Debug Error:', error.message);
  } finally {
    await browser.close();
  }
}

javascriptDebug();