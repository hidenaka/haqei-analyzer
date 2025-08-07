#!/usr/bin/env node
const { chromium } = require('playwright');

async function buttonDebugAnalysis() {
  console.log('🔍 Button Debug Analysis - 選択肢ボタン非活性問題調査');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto('http://localhost:8788/os_analyzer.html');
    await page.waitForTimeout(3000);
    
    await page.click('#start-btn');
    await page.waitForTimeout(3000);
    
    // 全ボタン状態確認
    const buttonStates = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      return Array.from(buttons).map((btn, i) => ({
        index: i,
        text: btn.textContent?.trim().substring(0, 40),
        disabled: btn.disabled,
        className: btn.className,
        id: btn.id,
        onclick: btn.onclick ? 'has onclick' : 'no onclick',
        style: btn.style.cssText
      }));
    });
    
    console.log('🔘 全ボタン状態:');
    buttonStates.forEach(btn => {
      const status = btn.disabled ? '❌ DISABLED' : '✅ ENABLED';
      console.log(`${btn.index}: ${status} "${btn.text}" (${btn.className})`);
    });
    
    // 選択肢ボタンのみフィルタ
    const choiceButtons = buttonStates.filter(btn => 
      btn.text && 
      !btn.text.includes('前の質問') && 
      !btn.text.includes('次の質問') &&
      !btn.text.includes('Triple') &&
      !btn.text.includes('もう一度') &&
      btn.text.length > 5
    );
    
    console.log('\n🎯 選択肢ボタンのみ:');
    choiceButtons.forEach(btn => {
      const status = btn.disabled ? '❌ DISABLED' : '✅ ENABLED';
      console.log(`${btn.index}: ${status} "${btn.text}"`);
    });
    
    // JavaScript状態確認
    const jsState = await page.evaluate(() => {
      return {
        currentQuestion: window.criticalCSSAnalyzer?.currentQuestion || 'undefined',
        selectedAnswer: window.criticalCSSAnalyzer?.selectedAnswer || 'undefined',
        isAnalyzing: window.criticalCSSAnalyzer?.isAnalyzing || 'undefined',
        analyzer: typeof window.criticalCSSAnalyzer
      };
    });
    
    console.log('\n📊 JavaScript State:', jsState);
    
    // 手動でボタンを有効化テスト
    console.log('\n🔧 選択肢ボタン強制有効化テスト...');
    await page.evaluate(() => {
      document.querySelectorAll('button').forEach((btn, i) => {
        if (i >= 1 && i <= 5) { // 選択肢ボタンと推定される範囲
          btn.disabled = false;
          btn.style.pointerEvents = 'auto';
          btn.style.opacity = '1';
        }
      });
    });
    
    await page.waitForTimeout(1000);
    
    // 有効化後のクリックテスト
    console.log('🖱️ 有効化後クリックテスト...');
    const enabledButtons = await page.$$('button:not([disabled])');
    console.log(`✅ 有効ボタン数: ${enabledButtons.length}`);
    
    if (enabledButtons.length >= 3) {
      await enabledButtons[1].click(); // 2番目の有効ボタンをクリック
      console.log('✅ ボタンクリック成功！');
      await page.waitForTimeout(2000);
    }
    
    await page.screenshot({ 
      path: 'button-debug-after-enable.png', 
      fullPage: true 
    });
    
  } catch (error) {
    console.error('❌ Button Debug Error:', error.message);
    await page.screenshot({ path: 'button-debug-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

buttonDebugAnalysis();