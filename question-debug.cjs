#!/usr/bin/env node
const { chromium } = require('playwright');

async function questionDebug() {
  console.log('🔍 質問画面デバッグ - input要素確認');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto('http://localhost:8788/os_analyzer.html');
    await page.waitForTimeout(3000);
    
    // 開始ボタンクリック
    await page.click('#start-btn');
    await page.waitForTimeout(5000);
    
    // 質問画面スクリーンショット
    await page.screenshot({ path: 'question-screen-debug.png', fullPage: true });
    console.log('✅ 質問画面キャプチャ完了');
    
    // 全input要素を取得
    const inputs = await page.$$eval('input', inputs => 
      inputs.map(input => ({
        type: input.type,
        name: input.name,
        value: input.value,
        id: input.id,
        className: input.className
      }))
    );
    
    console.log('📋 利用可能なinput要素:');
    inputs.forEach((input, i) => {
      console.log(`${i + 1}. type=${input.type} name=${input.name} value=${input.value} id=${input.id} class=${input.className}`);
    });
    
    // 20秒待機してユーザーが確認
    await page.waitForTimeout(20000);
    
  } catch (error) {
    console.error('❌ エラー:', error.message);
  } finally {
    await browser.close();
  }
}

questionDebug();