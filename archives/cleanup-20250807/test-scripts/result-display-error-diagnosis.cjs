#!/usr/bin/env node
const { chromium } = require('playwright');

async function resultDisplayErrorDiagnosis() {
  console.log('🔍 結果表示エラー診断 - CSS/JavaScript問題特定');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // 全エラー監視
  const errors = [];
  const warnings = [];
  const networkErrors = [];
  
  page.on('console', msg => {
    const message = {
      type: msg.type(),
      text: msg.text(),
      timestamp: new Date().toISOString()
    };
    
    if (msg.type() === 'error') {
      errors.push(message);
      console.log(`❌ Console Error: ${msg.text()}`);
    } else if (msg.type() === 'warning') {
      warnings.push(message);
      console.log(`⚠️ Warning: ${msg.text()}`);
    }
  });
  
  page.on('pageerror', error => {
    errors.push({
      type: 'pageerror',
      text: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    console.log(`❌ Page Error: ${error.message}`);
  });
  
  page.on('requestfailed', request => {
    networkErrors.push({
      url: request.url(),
      failure: request.failure()?.errorText,
      timestamp: new Date().toISOString()
    });
    console.log(`🌐 Network Error: ${request.url()} - ${request.failure()?.errorText}`);
  });
  
  try {
    console.log('🚀 HAQEI読み込み開始...');
    await page.goto('http://localhost:8788/os_analyzer.html');
    await page.waitForTimeout(3000);
    
    // 開始前CSS確認
    const initialCSS = await page.evaluate(() => {
      const resultsScreen = document.getElementById('results-screen');
      if (!resultsScreen) return { error: 'results-screen not found' };
      
      const computedStyle = window.getComputedStyle(resultsScreen);
      return {
        display: computedStyle.display,
        visibility: computedStyle.visibility,
        opacity: computedStyle.opacity,
        backgroundColor: computedStyle.backgroundColor,
        color: computedStyle.color,
        height: computedStyle.height,
        width: computedStyle.width
      };
    });
    
    console.log('📊 初期CSS状態:', initialCSS);
    
    // 30問高速回答
    console.log('⚡ 高速30問回答開始...');
    await page.click('#start-btn');
    await page.waitForTimeout(2000);
    
    // 高速回答ループ
    for (let i = 1; i <= 30; i++) {
      const options = await page.$$('.option[role="radio"]');
      if (options.length > 0) {
        const randomIndex = Math.floor(Math.random() * options.length);
        await options[randomIndex].click();
        
        if (i < 30) {
          await page.waitForSelector('#next-btn:not([disabled])', { timeout: 3000 });
          await page.click('#next-btn');
        }
      }
      await page.waitForTimeout(100); // 高速化
    }
    
    // 最終ボタンクリック
    await page.waitForSelector('#next-btn:not([disabled])', { timeout: 5000 });
    await page.click('#next-btn');
    
    // 結果画面待機
    console.log('⏳ 結果画面表示待機...');
    await page.waitForSelector('#results-screen.active', { timeout: 30000 });
    await page.waitForTimeout(3000);
    
    // 結果画面CSS詳細診断
    const resultCSSDiagnosis = await page.evaluate(() => {
      const resultsScreen = document.getElementById('results-screen');
      const body = document.body;
      const html = document.documentElement;
      
      return {
        resultsScreen: {
          exists: !!resultsScreen,
          active: resultsScreen?.classList.contains('active'),
          computedStyle: resultsScreen ? {
            display: window.getComputedStyle(resultsScreen).display,
            visibility: window.getComputedStyle(resultsScreen).visibility,
            opacity: window.getComputedStyle(resultsScreen).opacity,
            backgroundColor: window.getComputedStyle(resultsScreen).backgroundColor,
            color: window.getComputedStyle(resultsScreen).color,
            zIndex: window.getComputedStyle(resultsScreen).zIndex
          } : null,
          innerHTML: resultsScreen?.innerHTML?.substring(0, 500) || 'Not found'
        },
        body: {
          backgroundColor: window.getComputedStyle(body).backgroundColor,
          color: window.getComputedStyle(body).color,
          overflow: window.getComputedStyle(body).overflow
        },
        html: {
          backgroundColor: window.getComputedStyle(html).backgroundColor
        },
        allScreens: Array.from(document.querySelectorAll('.screen')).map(screen => ({
          id: screen.id,
          active: screen.classList.contains('active'),
          display: window.getComputedStyle(screen).display,
          visibility: window.getComputedStyle(screen).visibility
        }))
      };
    });
    
    console.log('\n📊 === CSS診断結果 ===');
    console.log('Results Screen:', resultCSSDiagnosis.resultsScreen.exists ? '✅ 存在' : '❌ 未存在');
    console.log('Active:', resultCSSDiagnosis.resultsScreen.active ? '✅' : '❌');
    console.log('CSS:', resultCSSDiagnosis.resultsScreen.computedStyle);
    console.log('Body CSS:', resultCSSDiagnosis.body);
    console.log('All Screens:', resultCSSDiagnosis.allScreens);
    
    // JavaScript状態確認
    const jsState = await page.evaluate(() => {
      const analyzer = window.criticalCSSAnalyzer;
      return {
        analyzer: !!analyzer,
        state: analyzer?.state || null,
        answers: analyzer?.state?.answers?.length || 0,
        currentScreen: analyzer?.currentScreen || 'unknown'
      };
    });
    
    console.log('📋 JavaScript状態:', jsState);
    
    // DOM要素存在確認
    const domElements = await page.evaluate(() => {
      return {
        osCards: document.querySelectorAll('.os-card').length,
        engineOSElements: document.querySelectorAll('#engineOSResult, .engine-os, [data-os="engine"]').length,
        interfaceOSElements: document.querySelectorAll('#interfaceOSResult, .interface-os, [data-os="interface"]').length,
        safeModeOSElements: document.querySelectorAll('#safeModeOSResult, .safemode-os, [data-os="safemode"]').length,
        canvasElements: document.querySelectorAll('canvas').length,
        resultContent: document.getElementById('results-screen')?.textContent?.length || 0
      };
    });
    
    console.log('🔍 DOM要素確認:', domElements);
    
    // 診断レポート作成
    const diagnosis = {
      timestamp: new Date().toISOString(),
      errors: errors,
      warnings: warnings,
      networkErrors: networkErrors,
      cssState: resultCSSDiagnosis,
      jsState: jsState,
      domElements: domElements,
      diagnosis: {
        cssIssue: resultCSSDiagnosis.resultsScreen.computedStyle?.backgroundColor === 'rgba(0, 0, 0, 0)' ||
                  resultCSSDiagnosis.resultsScreen.computedStyle?.color === 'rgb(0, 0, 0)',
        jsError: errors.length > 0,
        contentMissing: domElements.resultContent === 0,
        displayNone: resultCSSDiagnosis.resultsScreen.computedStyle?.display === 'none'
      }
    };
    
    // スクリーンショット
    await page.screenshot({ 
      path: 'result-display-diagnosis.png', 
      fullPage: true 
    });
    
    const fs = require('fs');
    fs.writeFileSync('result-display-diagnosis.json', JSON.stringify(diagnosis, null, 2));
    console.log('📝 診断レポート保存完了');
    
    return diagnosis;
    
  } catch (error) {
    console.error('❌ 診断エラー:', error.message);
    await page.screenshot({ path: 'result-diagnosis-error.png', fullPage: true });
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

resultDisplayErrorDiagnosis();