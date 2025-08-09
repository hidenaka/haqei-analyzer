#!/usr/bin/env node
const { chromium } = require('playwright');

async function criticalIssueInvestigation() {
  console.log('🔍 CRITICAL ISSUE原因調査 - 選択肢ボタンdisabled問題特定');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto('http://localhost:8788/os_analyzer.html');
    await page.waitForTimeout(3000);
    
    // 開始前状態確認
    console.log('📊 開始前状態確認...');
    const beforeStart = await page.evaluate(() => {
      return {
        analyzer: typeof window.criticalCSSAnalyzer,
        welcomeScreen: document.getElementById('welcome-screen')?.classList.contains('active'),
        questionScreen: document.getElementById('question-screen')?.classList.contains('active')
      };
    });
    console.log('Before Start:', beforeStart);
    
    // 開始ボタンクリック
    await page.click('#start-btn');
    await page.waitForTimeout(3000);
    
    // 開始後状態確認
    const afterStart = await page.evaluate(() => {
      const currentScreen = Array.from(document.querySelectorAll('.screen.active')).map(s => s.id);
      const questionContainer = document.querySelector('.question-container, #question-container, .question-content');
      const optionButtons = document.querySelectorAll('.option-button, .answer-option, .choice-button');
      
      return {
        currentScreen: currentScreen,
        questionContainer: !!questionContainer,
        optionButtonsCount: optionButtons.length,
        optionButtonsDisabled: Array.from(optionButtons).map(btn => ({
          text: btn.textContent?.substring(0, 30),
          disabled: btn.disabled,
          className: btn.className,
          onclick: btn.onclick ? 'has onclick' : 'no onclick'
        }))
      };
    });
    
    console.log('📋 開始後状態:', afterStart);
    
    // HTML構造詳細調査
    console.log('\n🔍 HTML構造詳細調査...');
    const htmlStructure = await page.evaluate(() => {
      const questionScreen = document.getElementById('question-screen');
      if (!questionScreen) return { error: 'question-screen not found' };
      
      return {
        questionScreenHTML: questionScreen.innerHTML.substring(0, 1000),
        allButtons: Array.from(document.querySelectorAll('button')).map(btn => ({
          id: btn.id,
          className: btn.className,
          disabled: btn.disabled,
          textContent: btn.textContent?.trim().substring(0, 40)
        }))
      };
    });
    
    console.log('HTML Structure Sample:', htmlStructure.questionScreenHTML);
    console.log('All Buttons:', htmlStructure.allButtons);
    
    // JavaScript状態確認
    const jsState = await page.evaluate(() => {
      const analyzer = window.criticalCSSAnalyzer;
      if (!analyzer) return { error: 'analyzer not found' };
      
      return {
        currentQuestion: analyzer.state?.currentQuestion,
        answers: analyzer.state?.answers,
        isAnalyzing: analyzer.state?.isAnalyzing,
        questions: typeof QUESTIONS !== 'undefined' ? QUESTIONS.length : 'undefined',
        questionsType: typeof QUESTIONS
      };
    });
    
    console.log('📊 JavaScript State:', jsState);
    
    // 手動で選択肢生成テスト
    console.log('\n🛠️ 手動選択肢生成テスト...');
    const manualGeneration = await page.evaluate(() => {
      const analyzer = window.criticalCSSAnalyzer;
      if (!analyzer) return { error: 'analyzer not found' };
      
      try {
        // showQuestion関数を直接呼び出し
        if (typeof analyzer.showQuestion === 'function') {
          analyzer.showQuestion(0);
          return { success: true, message: 'showQuestion(0) executed' };
        } else {
          return { error: 'showQuestion not found' };
        }
      } catch (error) {
        return { error: error.message };
      }
    });
    
    console.log('Manual Generation Result:', manualGeneration);
    await page.waitForTimeout(2000);
    
    // 生成後の選択肢確認
    const afterGeneration = await page.evaluate(() => {
      const optionButtons = document.querySelectorAll('.option-button, .answer-option, .choice-button');
      return {
        optionCount: optionButtons.length,
        options: Array.from(optionButtons).map((btn, i) => ({
          index: i,
          text: btn.textContent?.trim().substring(0, 50),
          disabled: btn.disabled,
          clickable: !btn.disabled && btn.style.pointerEvents !== 'none'
        }))
      };
    });
    
    console.log('📋 生成後選択肢状態:', afterGeneration);
    
    // スクリーンショット
    await page.screenshot({ 
      path: 'critical-issue-investigation.png', 
      fullPage: true 
    });
    
    return {
      beforeStart,
      afterStart,
      htmlStructure,
      jsState,
      manualGeneration,
      afterGeneration
    };
    
  } catch (error) {
    console.error('❌ Critical Issue Investigation Error:', error.message);
    await page.screenshot({ path: 'critical-investigation-error.png', fullPage: true });
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

criticalIssueInvestigation();