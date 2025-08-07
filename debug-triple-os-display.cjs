#!/usr/bin/env node
const { chromium } = require('playwright');

async function debugTripleOSDisplay() {
  console.log('🔄 Triple OS Display Debug Test');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Console monitoring
  const errors = [];
  const warnings = [];
  page.on('console', msg => {
    const message = `[${msg.type()}] ${msg.text()}`;
    if (msg.type() === 'error') {
      errors.push(message);
      console.log(`❌ ${message}`);
    } else if (msg.type() === 'warn') {
      warnings.push(message);
      console.log(`⚠️ ${message}`);
    } else if (message.includes('Triple') || message.includes('OS') || message.includes('Energy') || message.includes('Interface')) {
      console.log(`📝 ${message}`);
    }
  });
  
  try {
    console.log('🚀 Loading HAQEI OS Analyzer...');
    await page.goto('http://localhost:8788/os_analyzer.html');
    await page.waitForTimeout(3000);
    
    // Quick 30-question test to generate results
    console.log('⚡ Quick 30-question test...');
    await page.click('#start-btn');
    await page.waitForTimeout(2000);
    
    // Answer all 30 questions quickly with specific pattern to test Interface OS issue
    const answers = [2,1,3,1,2,2,1,4,0,2,4,1,3,3,4,1,2,0,4,1,2,2,4,4,2,2,1,1,4,1];
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
    
    // Final analysis
    await page.waitForSelector('#next-btn:not([disabled])', { timeout: 5000 });
    await page.click('#next-btn');
    
    // Wait for results
    await page.waitForTimeout(5000);
    
    // Check Triple OS results state
    const resultsState = await page.evaluate(() => {
      const analyzer = window.criticalCSSAnalyzer;
      const results = analyzer?.state?.tripleOSResults;
      
      // Check energy distribution specifically
      const energyData = {
        engineEnergy: results?.engineOS?.energy || 0,
        interfaceEnergy: results?.interfaceOS?.energy || 0,
        safeModeEnergy: results?.safeModeOS?.energy || 0
      };
      
      // Check hexagram mapping
      const hexagramData = {
        engineHex: results?.engineOS?.hexagramId,
        interfaceHex: results?.interfaceOS?.hexagramId,
        safeModeHex: results?.safeModeOS?.hexagramId,
        engineName: results?.engineOS?.hexagramName,
        interfaceName: results?.interfaceOS?.hexagramName,
        safeModeName: results?.safeModeOS?.hexagramName
      };
      
      // Check UI display elements
      const uiElements = {
        resultsScreenActive: document.getElementById('results-screen')?.classList.contains('active'),
        tripleOSSection: !!document.querySelector('.triple-os-section, [data-section="triple-os"]'),
        energyDisplay: !!document.querySelector('.energy-distribution, [data-display="energy"]'),
        relationshipDisplay: !!document.querySelector('.os-relationship, [data-display="relationship"]'),
        basicLayerVisible: !!document.querySelector('.result-layer-basic, [data-layer="basic"]'),
        detailedLayerVisible: !!document.querySelector('.result-layer-detailed, [data-layer="detailed"]')
      };
      
      return {
        tripleOSResults: !!results,
        energyData,
        hexagramData,
        uiElements,
        rawResults: results // For debugging
      };
    });
    
    console.log('📊 Triple OS Results Analysis:');
    console.log('   Results exist:', resultsState.tripleOSResults ? '✅' : '❌');
    
    console.log('⚡ Energy Distribution:');
    console.log('   Engine Energy:', resultsState.energyData.engineEnergy);
    console.log('   Interface Energy:', resultsState.energyData.interfaceEnergy, resultsState.energyData.interfaceEnergy === 0 ? '❌ ZERO!' : '✅');
    console.log('   Safe Mode Energy:', resultsState.energyData.safeModeEnergy);
    
    console.log('🔯 Hexagram Mapping:');
    console.log('   Engine:', resultsState.hexagramData.engineHex, '-', resultsState.hexagramData.engineName);
    console.log('   Interface:', resultsState.hexagramData.interfaceHex, '-', resultsState.hexagramData.interfaceName);
    console.log('   Safe Mode:', resultsState.hexagramData.safeModeHex, '-', resultsState.hexagramData.safeModeName);
    
    console.log('🎨 UI Display Elements:');
    console.log('   Results screen active:', resultsState.uiElements.resultsScreenActive ? '✅' : '❌');
    console.log('   Triple OS section:', resultsState.uiElements.tripleOSSection ? '✅' : '❌');
    console.log('   Energy display:', resultsState.uiElements.energyDisplay ? '✅' : '❌');
    console.log('   Relationship display:', resultsState.uiElements.relationshipDisplay ? '✅' : '❌');
    console.log('   Basic layer visible:', resultsState.uiElements.basicLayerVisible ? '✅' : '❌');
    console.log('   Detailed layer visible:', resultsState.uiElements.detailedLayerVisible ? '✅' : '❌');
    
    // Check if energy distribution calculation is working
    const energyCalculationCheck = await page.evaluate(() => {
      const analyzer = window.criticalCSSAnalyzer;
      const answers = analyzer?.state?.answers;
      
      if (!answers || answers.length === 0) {
        return { error: 'No answers found' };
      }
      
      // Manually calculate Interface OS energy to debug
      let interfaceTotal = 0;
      let interfaceQuestions = 0;
      
      answers.forEach((answer, index) => {
        if (answer && typeof answer.selectedOption === 'number') {
          // Interface OS questions are roughly every 3rd (simplified check)
          if ((index + 1) % 3 === 2 || [2,5,8,11,14,17,20,23,26,29].includes(index + 1)) {
            interfaceTotal += answer.selectedOption;
            interfaceQuestions++;
          }
        }
      });
      
      const calculatedInterfaceEnergy = interfaceQuestions > 0 ? interfaceTotal / interfaceQuestions : 0;
      
      return {
        answersLength: answers.length,
        interfaceQuestionsFound: interfaceQuestions,
        interfaceTotalScore: interfaceTotal,
        calculatedInterfaceEnergy: calculatedInterfaceEnergy,
        firstFewAnswers: answers.slice(0, 5).map(a => ({
          selectedOption: a?.selectedOption,
          questionId: a?.questionId
        }))
      };
    });
    
    console.log('🔬 Energy Calculation Debug:');
    if (energyCalculationCheck.error) {
      console.log('   ❌ Error:', energyCalculationCheck.error);
    } else {
      console.log('   Answers length:', energyCalculationCheck.answersLength);
      console.log('   Interface questions found:', energyCalculationCheck.interfaceQuestionsFound);
      console.log('   Interface total score:', energyCalculationCheck.interfaceTotalScore);
      console.log('   Calculated Interface energy:', energyCalculationCheck.calculatedInterfaceEnergy);
      console.log('   First few answers:', energyCalculationCheck.firstFewAnswers);
    }
    
    // Screenshot for debugging
    await page.screenshot({ 
      path: 'debug-triple-os-display-result.png', 
      fullPage: true 
    });
    
    console.log('✅ Triple OS display debug completed - screenshot saved');
    console.log('📝 Console errors:', errors.length);
    console.log('⚠️ Console warnings:', warnings.length);
    
    return {
      resultsState,
      energyCalculationCheck,
      errors,
      warnings
    };
    
  } catch (error) {
    console.error('❌ Debug test failed:', error.message);
    await page.screenshot({ path: 'debug-triple-os-display-error.png', fullPage: true });
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

debugTripleOSDisplay();