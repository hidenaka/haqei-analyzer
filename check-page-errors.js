/**
 * os_analyzer.htmlのエラーチェック
 */

import { chromium } from 'playwright';

async function checkPageErrors() {
  console.log('🔍 os_analyzer.htmlのエラーチェック開始\n');
  
  const browser = await chromium.launch({
    headless: false,
    devtools: true
  });
  
  const page = await browser.newPage();
  
  // コンソールメッセージを記録
  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push({
      type: msg.type(),
      text: msg.text()
    });
  });
  
  // ページエラーを記録
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
  });
  
  try {
    console.log('📱 ページにアクセス中...');
    await page.goto('file:///Users/nakanohideaki/Desktop/haqei-analyzer/public/os_analyzer.html', {
      waitUntil: 'domcontentloaded'
    });
    
    // 少し待つ
    await page.waitForTimeout(3000);
    
    console.log('\n📋 コンソールログ:');
    consoleLogs.forEach((log, i) => {
      console.log(`${i + 1}. [${log.type}] ${log.text}`);
    });
    
    console.log('\n❌ ページエラー:');
    if (pageErrors.length === 0) {
      console.log('エラーなし');
    } else {
      pageErrors.forEach((err, i) => {
        console.log(`${i + 1}. ${err}`);
      });
    }
    
    // DOMの状態を確認
    console.log('\n🏗️ DOM構造の確認:');
    
    const containers = [
      '#app',
      '#welcome-container',
      '#questions-container',
      '#analysis-container',
      '#results-container'
    ];
    
    for (const selector of containers) {
      const element = await page.$(selector);
      if (element) {
        const isVisible = await element.isVisible();
        const childCount = await page.$$eval(selector + ' > *', els => els.length);
        console.log(`${selector}: ${isVisible ? '表示' : '非表示'}, 子要素: ${childCount}個`);
      } else {
        console.log(`${selector}: 見つかりません`);
      }
    }
    
    // スクリプトの読み込み状態を確認
    console.log('\n📜 読み込まれたスクリプト:');
    const scripts = await page.$$eval('script[src]', els => 
      els.map(el => el.src.replace('file:///Users/nakanohideaki/Desktop/haqei-analyzer/public', ''))
    );
    scripts.forEach((src, i) => {
      console.log(`${i + 1}. ${src}`);
    });
    
  } catch (error) {
    console.error('❌ エラー:', error.message);
  } finally {
    console.log('\n⏸️ ブラウザを開いたままにします（開発者ツールで確認してください）');
    // await browser.close();
  }
}

// 実行
checkPageErrors().catch(console.error);