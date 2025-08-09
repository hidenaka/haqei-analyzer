#!/usr/bin/env node
const { chromium } = require('playwright');

async function debugAnalysisFlow() {
  console.log('🔍 Analysis Flow Debug Test');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Console monitoring
  const errors = [];
  const logs = [];
  page.on('console', msg => {
    const message = `[${msg.type()}] ${msg.text()}`;
    if (msg.type() === 'error') {
      errors.push(message);
      console.log(`❌ ${message}`);
    } else {
      logs.push(message);
      if (message.includes('Triple OS') || message.includes('Analysis') || message.includes('results')) {
        console.log(`📝 ${message}`);
      }
    }
  });
  
  try {
    console.log('🚀 Loading HAQEI OS Analyzer...');
    await page.goto('http://localhost:8788/os_analyzer.html');
    await page.waitForTimeout(3000);
    
    // Quick 30-question test
    console.log('⚡ Quick 30-question test...');
    await page.click('#start-btn');
    await page.waitForTimeout(2000);
    
    // Answer all 30 questions quickly with specific values to ensure analysis
    const answers = [2,1,3,1,2,2,1,4,0,2,4,1,3,3,4,1,2,0,4,1,2,2,4,4,2,2,1,1,4,1]; // Consistent answers
    for (let i = 1; i <= 30; i++) {
      const options = await page.$$('.option[role="radio"]');
      if (options.length > 0) {
        const answerIndex = answers[i-1] % options.length;
        await options[answerIndex].click();
        
        if (i < 30) {
          await page.waitForSelector('#next-btn:not([disabled])', { timeout: 3000 });
          await page.click('#next-btn');
        }
      }
      await page.waitForTimeout(50);
    }
    
    // Check analyzer state before analysis
    const preAnalysisState = await page.evaluate(() => {
      const analyzer = window.criticalCSSAnalyzer;
      return {
        analyzerExists: !!analyzer,
        tripleOSEngineExists: !!analyzer?.tripleOSEngine,
        answersLength: analyzer?.state?.answers?.length,
        analyzeTripleOSExists: typeof analyzer?.tripleOSEngine?.analyzeTripleOS === 'function',
        stateAnswers: analyzer?.state?.answers?.map(a => ({ selectedOption: a?.selectedOption, questionId: a?.questionId }))
      };
    });
    
    console.log('🔬 Pre-Analysis State:');
    console.log('   Analyzer exists:', preAnalysisState.analyzerExists ? '✅' : '❌');
    console.log('   TripleOSEngine exists:', preAnalysisState.tripleOSEngineExists ? '✅' : '❌');
    console.log('   analyzeTripleOS function exists:', preAnalysisState.analyzeTripleOSExists ? '✅' : '❌');
    console.log('   Answers length:', preAnalysisState.answersLength);
    console.log('   First few answers:', preAnalysisState.stateAnswers?.slice(0, 3));
    
    // Final analysis button
    console.log('📊 Triggering analysis...');
    await page.waitForSelector('#next-btn:not([disabled])', { timeout: 5000 });
    await page.click('#next-btn');
    
    // Wait for results with detailed monitoring
    console.log('⏳ Waiting for results...');
    await page.waitForTimeout(3000);
    
    // Check if results screen becomes active
    const resultsScreenActive = await page.evaluate(() => {
      const resultsScreen = document.getElementById('results-screen');
      return {
        exists: !!resultsScreen,
        hasActiveClass: resultsScreen?.classList.contains('active'),
        display: resultsScreen ? window.getComputedStyle(resultsScreen).display : 'none'
      };
    });
    
    console.log('📋 Results Screen Status:');
    console.log('   Results screen exists:', resultsScreenActive.exists ? '✅' : '❌');
    console.log('   Has active class:', resultsScreenActive.hasActiveClass ? '✅' : '❌');
    console.log('   Display style:', resultsScreenActive.display);
    
    if (!resultsScreenActive.hasActiveClass) {
      // Force analysis manually
      console.log('🔧 Forcing manual analysis...');
      const manualAnalysis = await page.evaluate(async () => {
        const analyzer = window.criticalCSSAnalyzer;
        try {
          // Try to call analyze manually
          if (analyzer && typeof analyzer.analyze === 'function') {
            console.log('Calling analyzer.analyze()...');
            await analyzer.analyze();
            return { success: true, method: 'analyzer.analyze()' };
          } else if (analyzer?.tripleOSEngine && typeof analyzer.tripleOSEngine.analyzeTripleOS === 'function') {
            console.log('Calling tripleOSEngine.analyzeTripleOS()...');
            const answers = analyzer.state.answers.filter(answer => answer && answer.selectedOption);
            const results = await analyzer.tripleOSEngine.analyzeTripleOS(answers);
            console.log('Manual analysis results:', results);
            return { success: true, method: 'tripleOSEngine.analyzeTripleOS()', results: results };
          }
          return { success: false, error: 'No analysis method found' };
        } catch (error) {
          console.error('Manual analysis error:', error);
          return { success: false, error: error.message };
        }
      });
      
      console.log('🔧 Manual Analysis Result:', manualAnalysis);
      
      await page.waitForTimeout(5000);
    } else {
      await page.waitForTimeout(5000);
    }
    
    // Check final state
    const finalState = await page.evaluate(() => {
      const analyzer = window.criticalCSSAnalyzer;
      const tripleOSResults = analyzer?.state?.tripleOSResults;
      
      return {
        tripleOSResultsExists: !!tripleOSResults,
        engineOS: tripleOSResults?.engineOS,
        interfaceOS: tripleOSResults?.interfaceOS,
        safeModeOS: tripleOSResults?.safeModeOS,
        currentScreen: analyzer?.currentScreen,
        resultsScreenActive: document.getElementById('results-screen')?.classList.contains('active')
      };
    });
    
    console.log('📊 Final Analysis State:');
    console.log('   Triple OS results exist:', finalState.tripleOSResultsExists ? '✅' : '❌');
    console.log('   Results screen active:', finalState.resultsScreenActive ? '✅' : '❌');
    console.log('   Current screen:', finalState.currentScreen);
    
    if (finalState.engineOS) {
      console.log('   Engine OS:', finalState.engineOS.hexagramName);
    }
    if (finalState.interfaceOS) {
      console.log('   Interface OS:', finalState.interfaceOS.hexagramName);
    }
    if (finalState.safeModeOS) {
      console.log('   Safe Mode OS:', finalState.safeModeOS.hexagramName);
    }
    
    // Screenshot for debugging
    await page.screenshot({ 
      path: 'debug-analysis-flow-result.png', 
      fullPage: true 
    });
    
    console.log('✅ Analysis flow debug completed - screenshot saved');
    console.log('📝 Total console errors:', errors.length);
    
    return {
      preAnalysisState,
      resultsScreenActive,
      finalState,
      errors,
      logs: logs.filter(log => log.includes('Triple OS') || log.includes('Analysis') || log.includes('results'))
    };
    
  } catch (error) {
    console.error('❌ Debug test failed:', error.message);
    await page.screenshot({ path: 'debug-analysis-flow-error.png', fullPage: true });
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

debugAnalysisFlow();