#!/usr/bin/env node
const { chromium } = require('playwright');

async function debugUIDisplayFixed() {
  console.log('🎨 UI Display Fixed Debug Test');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Console monitoring
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.log(`❌ ${msg.text()}`);
    } else if (msg.text().includes('OS Energies') || msg.text().includes('Energy:')) {
      console.log(`⚡ ${msg.text()}`);
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
    
    // Answer all 30 questions
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
    
    // Check actual UI elements with correct selectors
    const uiCheck = await page.evaluate(() => {
      return {
        resultsScreenActive: document.getElementById('results-screen')?.classList.contains('active'),
        osCardsContainer: !!document.getElementById('os-cards-container'),
        osCards: document.querySelectorAll('#os-cards-container .os-card').length,
        tripleOSInteractionSection: !!document.querySelector('.triple-os-interaction-section'),
        interactionVisualization: !!document.querySelector('.interaction-visualization'),
        trigramEnergySection: !!document.querySelector('.trigram-energy-section'),
        layerContents: document.querySelectorAll('.layer-content').length,
        activeLayer: document.querySelector('.layer-content.active')?.getAttribute('data-layer'),
        tabBtns: document.querySelectorAll('.tab-btn').length,
        activeTab: document.querySelector('.tab-btn.active')?.textContent,
        
        // Check if content has been populated
        osCardsHaveContent: document.getElementById('os-cards-container')?.innerHTML.trim().length > 0,
        interactionChartExists: !!document.getElementById('os-interaction-chart'),
        dynamicBalanceDisplay: !!document.getElementById('dynamic-balance-display'),
        
        // Debug content inspection
        osCardsContent: document.getElementById('os-cards-container')?.innerHTML.substring(0, 200) + '...',
        interactionSectionHTML: document.querySelector('.triple-os-interaction-section h3')?.textContent
      };
    });
    
    console.log('🎨 UI Display Check (Correct Selectors):');
    console.log('   Results screen active:', uiCheck.resultsScreenActive ? '✅' : '❌');
    console.log('   OS cards container exists:', uiCheck.osCardsContainer ? '✅' : '❌');
    console.log('   OS cards count:', uiCheck.osCards);
    console.log('   OS cards have content:', uiCheck.osCardsHaveContent ? '✅' : '❌');
    console.log('   Triple OS interaction section:', uiCheck.tripleOSInteractionSection ? '✅' : '❌');
    console.log('   Interaction visualization:', uiCheck.interactionVisualization ? '✅' : '❌');
    console.log('   Trigram energy section:', uiCheck.trigramEnergySection ? '✅' : '❌');
    console.log('   Layer contents count:', uiCheck.layerContents);
    console.log('   Active layer:', uiCheck.activeLayer);
    console.log('   Tab buttons count:', uiCheck.tabBtns);
    console.log('   Active tab:', uiCheck.activeTab);
    console.log('   Interaction chart canvas:', uiCheck.interactionChartExists ? '✅' : '❌');
    console.log('   Dynamic balance display:', uiCheck.dynamicBalanceDisplay ? '✅' : '❌');
    
    if (!uiCheck.osCardsHaveContent) {
      console.log('🔍 OS Cards Content Debug:', uiCheck.osCardsContent);
    }
    
    console.log('📋 Interaction Section Title:', uiCheck.interactionSectionHTML);
    
    // Test Triple OS results data
    const resultsCheck = await page.evaluate(() => {
      const analyzer = window.criticalCSSAnalyzer;
      const results = analyzer?.state?.tripleOSResults;
      
      return {
        hasTripleOSResults: !!results,
        engineOSEnergy: results?.engineOS?.energy,
        interfaceOSEnergy: results?.interfaceOS?.energy,
        safeModeOSEnergy: results?.safeModeOS?.energy,
        engineOSName: results?.engineOS?.hexagramName,
        interfaceOSName: results?.interfaceOS?.hexagramName,
        safeModeOSName: results?.safeModeOS?.hexagramName
      };
    });
    
    console.log('📊 Triple OS Results Check:');
    console.log('   Has results:', resultsCheck.hasTripleOSResults ? '✅' : '❌');
    console.log('   Engine OS:', resultsCheck.engineOSName, `(Energy: ${resultsCheck.engineOSEnergy})`);
    console.log('   Interface OS:', resultsCheck.interfaceOSName, `(Energy: ${resultsCheck.interfaceOSEnergy})`);
    console.log('   Safe Mode OS:', resultsCheck.safeModeOSName, `(Energy: ${resultsCheck.safeModeOSEnergy})`);
    
    // Screenshot for debugging
    await page.screenshot({ 
      path: 'debug-ui-display-fixed-result.png', 
      fullPage: true 
    });
    
    console.log('✅ UI display debug completed - screenshot saved');
    console.log('📝 Console errors:', errors.length);
    
    return {
      uiCheck,
      resultsCheck,
      errors
    };
    
  } catch (error) {
    console.error('❌ Debug test failed:', error.message);
    await page.screenshot({ path: 'debug-ui-display-fixed-error.png', fullPage: true });
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

debugUIDisplayFixed();