#!/usr/bin/env node
const { chromium } = require('playwright');

async function manualDatabaseTest() {
  console.log('🔍 手動データベース連携確認テスト');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // HAQEI OS Analyzer アクセス
    await page.goto('http://localhost:8788/os_analyzer.html');
    await page.waitForTimeout(3000);
    
    console.log('✅ 初期画面表示完了');
    await page.screenshot({ path: 'manual-test-step1.png', fullPage: true });
    
    // 開始ボタンクリック
    await page.click('text=仮想人格生成を開始する');
    await page.waitForTimeout(5000);
    
    console.log('✅ 開始ボタンクリック完了 - 質問画面遷移確認中...');
    await page.screenshot({ path: 'manual-test-step2-after-start.png', fullPage: true });
    
    // 画面上の全要素を取得してセレクター確認
    const elements = await page.$$eval('*', elements => 
      elements.map(el => ({
        tagName: el.tagName,
        id: el.id,
        className: el.className,
        text: el.textContent?.substring(0, 50)
      })).filter(el => el.text && el.text.trim())
    );
    
    console.log('📋 画面上の主要要素:');
    elements.slice(0, 20).forEach((el, i) => {
      console.log(`${i + 1}. ${el.tagName}${el.id ? '#' + el.id : ''}${el.className ? '.' + el.className.split(' ')[0] : ''}: "${el.text}"`);
    });
    
    // 30秒待機してユーザーが手動操作できるようにする
    console.log('⏳ 30秒間手動操作可能 - 質問回答してセレクター確認してください...');
    await page.waitForTimeout(30000);
    
    // 最終画面キャプチャ
    await page.screenshot({ path: 'manual-test-final.png', fullPage: true });
    
  } catch (error) {
    console.error('❌ エラー:', error.message);
    await page.screenshot({ path: 'manual-test-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

manualDatabaseTest();