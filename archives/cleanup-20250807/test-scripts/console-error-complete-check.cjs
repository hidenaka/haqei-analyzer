#!/usr/bin/env node
const { chromium } = require('playwright');

async function consoleErrorCompleteCheck() {
  console.log('🔍 Console Error 完全確認 - 絶対法則準拠');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // 全Consoleメッセージ監視
  const consoleMessages = [];
  const errors = [];
  const warnings = [];
  const networkErrors = [];
  
  page.on('console', msg => {
    const message = {
      type: msg.type(),
      text: msg.text(),
      location: msg.location(),
      timestamp: new Date().toISOString()
    };
    consoleMessages.push(message);
    
    if (msg.type() === 'error') {
      errors.push(message);
      console.log(`❌ Console Error: ${msg.text()}`);
    } else if (msg.type() === 'warning') {
      warnings.push(message);
      console.log(`⚠️ Console Warning: ${msg.text()}`);
    } else if (msg.type() === 'log') {
      console.log(`📋 Console Log: ${msg.text()}`);
    }
  });
  
  // Page Error監視
  page.on('pageerror', error => {
    const pageError = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };
    errors.push(pageError);
    console.log(`❌ Page Error: ${error.message}`);
  });
  
  // Network失敗監視
  page.on('requestfailed', request => {
    const networkError = {
      url: request.url(),
      failure: request.failure()?.errorText,
      timestamp: new Date().toISOString()
    };
    networkErrors.push(networkError);
    console.log(`🌐 Network Error: ${request.url()} - ${request.failure()?.errorText}`);
  });
  
  // Response Error監視
  page.on('response', response => {
    if (response.status() >= 400) {
      const responseError = {
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        timestamp: new Date().toISOString()
      };
      networkErrors.push(responseError);
      console.log(`🚫 HTTP Error: ${response.status()} - ${response.url()}`);
    }
  });
  
  try {
    // 1. 初期ページ読み込み
    console.log('🚀 HAQEI OS Analyzer読み込み開始...');
    await page.goto('http://localhost:8788/os_analyzer.html');
    await page.waitForTimeout(5000);
    
    // データベース読み込み確認
    const dbStatus = await page.evaluate(() => {
      return {
        hexagrams: typeof HEXAGRAMS !== 'undefined' ? HEXAGRAMS.length : 'undefined',
        h384: typeof H384_DATA !== 'undefined' ? H384_DATA.length : 'undefined',
        globalObjects: Object.keys(window).filter(key => key.includes('HEXAGRAM') || key.includes('H384'))
      };
    });
    console.log('📊 Database Status:', dbStatus);
    
    // 2. 開始ボタンクリック
    console.log('🎯 開始ボタンクリック...');
    await page.click('#start-btn');
    await page.waitForTimeout(3000);
    
    // 3. 質問画面でのエラー確認
    console.log('❓ 質問画面エラーチェック...');
    await page.waitForSelector('#question-screen', { timeout: 10000 });
    
    // 質問表示確認
    const questionInfo = await page.evaluate(() => {
      const questionText = document.querySelector('.question-text, #question-text, h2, h3');
      const choices = document.querySelectorAll('button, .choice, .option');
      return {
        question: questionText?.textContent || 'Not found',
        choiceCount: choices.length,
        choiceTexts: Array.from(choices).map(c => c.textContent?.substring(0, 30))
      };
    });
    console.log('📋 Question Info:', questionInfo);
    
    // 4. 選択肢クリックテスト
    console.log('🖱️ 選択肢クリックテスト...');
    const choices = await page.$$('button');
    if (choices.length >= 5) {
      await choices[2].click(); // 3番目の選択肢をクリック
      await page.waitForTimeout(1000);
    }
    
    // 5. エラーサマリー生成
    await page.waitForTimeout(2000);
    
    console.log('\n📊 === Console Error Complete Analysis ===');
    console.log(`🔥 Total Errors: ${errors.length}`);
    console.log(`⚠️ Total Warnings: ${warnings.length}`);
    console.log(`🌐 Network Issues: ${networkErrors.length}`);
    console.log(`📋 Total Messages: ${consoleMessages.length}`);
    
    if (errors.length > 0) {
      console.log('\n❌ === CRITICAL ERRORS ===');
      errors.forEach((error, i) => {
        console.log(`${i+1}. ${error.message || error.text}`);
        if (error.stack) console.log(`   Stack: ${error.stack.split('\n')[0]}`);
      });
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️ === WARNINGS ===');
      warnings.forEach((warning, i) => {
        console.log(`${i+1}. ${warning.text}`);
      });
    }
    
    if (networkErrors.length > 0) {
      console.log('\n🌐 === NETWORK ERRORS ===');
      networkErrors.forEach((netError, i) => {
        console.log(`${i+1}. ${netError.url} - ${netError.failure || netError.status}`);
      });
    }
    
    // 最終スクリーンショット
    await page.screenshot({ 
      path: 'console-error-analysis-final.png', 
      fullPage: true 
    });
    console.log('✅ Console Error分析完了 - スクリーンショット保存済み');
    
    // JSON Report出力
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        errors: errors.length,
        warnings: warnings.length,
        networkErrors: networkErrors.length,
        totalMessages: consoleMessages.length
      },
      databaseStatus: dbStatus,
      questionInfo: questionInfo,
      errors: errors,
      warnings: warnings,
      networkErrors: networkErrors,
      allMessages: consoleMessages.slice(0, 50) // 最初の50件のみ
    };
    
    const fs = require('fs');
    fs.writeFileSync('console-error-report.json', JSON.stringify(report, null, 2));
    console.log('📝 Console Error Report保存完了: console-error-report.json');
    
    return report;
    
  } catch (error) {
    console.error('❌ Console Error Check Failed:', error.message);
    await page.screenshot({ path: 'console-error-check-failure.png', fullPage: true });
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

// 実行
consoleErrorCompleteCheck()
  .then(result => {
    if (result.summary) {
      console.log('\n🎉 Console Error完全確認完了');
      console.log(`📊 Summary: ${result.summary.errors} errors, ${result.summary.warnings} warnings`);
      process.exit(result.summary.errors > 0 ? 1 : 0);
    } else {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('致命的エラー:', error);
    process.exit(1);
  });