#!/usr/bin/env node
const { chromium } = require('playwright');

async function debugConsoleCheck() {
  console.log('🔍 Console Error調査 - データベースとJavaScript問題確認');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Consoleメッセージ監視
  page.on('console', msg => {
    console.log(`📋 Console [${msg.type()}]:`, msg.text());
  });
  
  // エラー監視
  page.on('pageerror', error => {
    console.error(`❌ Page Error:`, error.message);
  });
  
  try {
    await page.goto('http://localhost:8788/os_analyzer.html');
    await page.waitForTimeout(3000);
    
    console.log('✅ ページ読み込み完了');
    
    // データベース読み込み確認
    const databaseCheck = await page.evaluate(() => {
      return {
        hexagrams: typeof HEXAGRAMS !== 'undefined' ? HEXAGRAMS.length : 'undefined',
        h384: typeof H384_DATA !== 'undefined' ? H384_DATA.length : 'undefined',
        startAnalysis: typeof startAnalysis !== 'undefined'
      };
    });
    
    console.log('📊 データベース状況:', databaseCheck);
    
    // 開始ボタンの状態確認
    const buttonCheck = await page.evaluate(() => {
      const button = document.querySelector('button');
      return {
        exists: !!button,
        text: button?.textContent,
        onclick: button?.onclick?.toString(),
        disabled: button?.disabled
      };
    });
    
    console.log('🔘 開始ボタン状況:', buttonCheck);
    
    // 手動で開始関数を実行
    console.log('🚀 手動でstartAnalysis()実行...');
    await page.evaluate(() => {
      if (typeof startAnalysis === 'function') {
        startAnalysis();
      } else {
        console.error('startAnalysis function not found');
      }
    });
    
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'debug-after-manual-start.png', fullPage: true });
    
    // 15秒待機
    await page.waitForTimeout(15000);
    
  } catch (error) {
    console.error('❌ Debug Error:', error.message);
  } finally {
    await browser.close();
  }
}

debugConsoleCheck();