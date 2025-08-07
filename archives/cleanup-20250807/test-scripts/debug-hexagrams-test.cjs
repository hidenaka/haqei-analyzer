#!/usr/bin/env node
const { chromium } = require('playwright');

async function debugHexagramsTest() {
  console.log('🔍 HEXAGRAMS Database Debug Test');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Console monitoring
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.log(`❌ Console Error: ${msg.text()}`);
    }
  });
  
  try {
    console.log('🚀 Loading HAQEI OS Analyzer...');
    await page.goto('http://localhost:8788/os_analyzer.html');
    await page.waitForTimeout(3000);
    
    // Test HEXAGRAMS database
    const hexagramsTest = await page.evaluate(() => {
      return {
        hexagramsExists: typeof HEXAGRAMS !== 'undefined',
        hexagramsLength: HEXAGRAMS?.length,
        hexagram34Exists: HEXAGRAMS?.find(h => h.hexagram_id === 34) ? true : false,
        hexagram47Exists: HEXAGRAMS?.find(h => h.hexagram_id === 47) ? true : false,
        hexagram34Data: HEXAGRAMS?.find(h => h.hexagram_id === 34),
        hexagram47Data: HEXAGRAMS?.find(h => h.hexagram_id === 47),
        h384DataExists: typeof H384_DATA !== 'undefined',
        h384DataLength: H384_DATA?.length,
        h384Hexagram34Count: H384_DATA?.filter(item => item['卦番号'] === 34).length,
        h384Hexagram47Count: H384_DATA?.filter(item => item['卦番号'] === 47).length
      };
    });
    
    console.log('📊 HEXAGRAMS Database Test Results:');
    console.log(`   HEXAGRAMS exists: ${hexagramsTest.hexagramsExists ? '✅' : '❌'}`);
    console.log(`   HEXAGRAMS length: ${hexagramsTest.hexagramsLength}`);
    console.log(`   Hexagram 34 exists: ${hexagramsTest.hexagram34Exists ? '✅' : '❌'}`);
    console.log(`   Hexagram 47 exists: ${hexagramsTest.hexagram47Exists ? '✅' : '❌'}`);
    
    if (hexagramsTest.hexagram34Data) {
      console.log(`   Hexagram 34: ${hexagramsTest.hexagram34Data.name_jp} - ${hexagramsTest.hexagram34Data.catchphrase}`);
    }
    if (hexagramsTest.hexagram47Data) {
      console.log(`   Hexagram 47: ${hexagramsTest.hexagram47Data.name_jp} - ${hexagramsTest.hexagram47Data.catchphrase}`);
    }
    
    console.log(`   H384_DATA exists: ${hexagramsTest.h384DataExists ? '✅' : '❌'}`);
    console.log(`   H384_DATA length: ${hexagramsTest.h384DataLength}`);
    console.log(`   H384 entries for hexagram 34: ${hexagramsTest.h384Hexagram34Count}`);
    console.log(`   H384 entries for hexagram 47: ${hexagramsTest.h384Hexagram47Count}`);
    
    // Quick 30-question test
    console.log('⚡ Quick 30-question test...');
    await page.click('#start-btn');
    await page.waitForTimeout(2000);
    
    // Answer all 30 questions quickly
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
      await page.waitForTimeout(100);
    }
    
    // Final analysis button
    await page.waitForSelector('#next-btn:not([disabled])', { timeout: 5000 });
    await page.click('#next-btn');
    
    // Wait for results
    await page.waitForSelector('#results-screen.active', { timeout: 30000 });
    await page.waitForTimeout(5000);
    
    // Debug analysis process
    const analysisDebug = await page.evaluate(() => {
      const analyzer = window.criticalCSSAnalyzer;
      return {
        analyzerExists: !!analyzer,
        state: analyzer?.state,
        answers: analyzer?.state?.answers,
        currentScreen: analyzer?.currentScreen,
        // Try to manually trigger analysis
        manualAnalysis: analyzer?.analyzeTripleOS ? 'function exists' : 'function missing'
      };
    });
    
    console.log('🔬 Analysis Debug Results:');
    console.log('   Analyzer exists:', analysisDebug.analyzerExists ? '✅' : '❌');
    console.log('   Current screen:', analysisDebug.currentScreen);
    console.log('   Answers length:', analysisDebug.answers?.length);
    console.log('   Manual analysis function:', analysisDebug.manualAnalysis);
    
    // Screenshot for debugging
    await page.screenshot({ 
      path: 'debug-hexagrams-result.png', 
      fullPage: true 
    });
    
    console.log('✅ Debug test completed - screenshot saved');
    
    return {
      hexagramsTest,
      analysisDebug,
      errors
    };
    
  } catch (error) {
    console.error('❌ Debug test failed:', error.message);
    await page.screenshot({ path: 'debug-hexagrams-error.png', fullPage: true });
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

debugHexagramsTest();