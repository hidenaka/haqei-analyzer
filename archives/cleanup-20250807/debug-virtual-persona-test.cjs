#!/usr/bin/env node
const { chromium } = require('playwright');

async function debugVirtualPersonaTest() {
  console.log('🎭 Virtual Persona Debug Test');
  
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
    } else if (message.includes('Persona') || message.includes('hexagram') || message.includes('not found')) {
      console.log(`📝 ${message}`);
    }
  });
  
  try {
    console.log('🚀 Loading HAQEI OS Analyzer...');
    await page.goto('http://localhost:8788/os_analyzer.html');
    await page.waitForTimeout(3000);
    
    // Check Virtual Persona Enhancer initialization
    const vpeStatus = await page.evaluate(() => {
      return {
        vpeExists: typeof window.VirtualPersonaEnhancer !== 'undefined',
        vpeInstanceExists: !!window.virtualPersonaEnhancer,
        hexagramsExists: typeof window.HEXAGRAMS !== 'undefined',
        hexagramsLength: window.HEXAGRAMS?.length || 0,
        vpeInitialized: window.virtualPersonaEnhancer?.isInitialized || false,
        vpeHexagrams: window.virtualPersonaEnhancer?.hexagrams?.length || 0
      };
    });
    
    console.log('🔍 Virtual Persona Enhancer Status:');
    console.log('   VPE class exists:', vpeStatus.vpeExists ? '✅' : '❌');
    console.log('   VPE instance exists:', vpeStatus.vpeInstanceExists ? '✅' : '❌');
    console.log('   HEXAGRAMS exists:', vpeStatus.hexagramsExists ? '✅' : '❌');
    console.log('   HEXAGRAMS length:', vpeStatus.hexagramsLength);
    console.log('   VPE initialized:', vpeStatus.vpeInitialized ? '✅' : '❌');
    console.log('   VPE hexagrams:', vpeStatus.vpeHexagrams);
    
    // Test specific hexagram persona generation
    const personaTests = await page.evaluate(() => {
      if (!window.virtualPersonaEnhancer || !window.virtualPersonaEnhancer.generateDynamicPersona) {
        return { error: 'VirtualPersonaEnhancer not available or not initialized' };
      }
      
      const results = {};
      const testHexagrams = [34, 47, 1, 2]; // Test specific hexagrams
      
      testHexagrams.forEach(hexId => {
        try {
          const persona = window.virtualPersonaEnhancer.generateDynamicPersona(hexId, 'engine');
          results[hexId] = {
            success: true,
            hexagramName: persona?.hexagramName || 'Unknown',
            name: persona?.name || 'Unknown',
            description: persona?.description || 'No description',
            hasTrigramData: !!(persona?.trigramSymbols && persona?.colors)
          };
        } catch (error) {
          results[hexId] = {
            success: false,
            error: error.message
          };
        }
      });
      
      return results;
    });
    
    console.log('🎭 Persona Generation Tests:');
    if (personaTests.error) {
      console.log('   ❌ Error:', personaTests.error);
    } else {
      Object.entries(personaTests).forEach(([hexId, result]) => {
        console.log(`   Hexagram ${hexId}:`, result.success ? '✅' : '❌');
        if (result.success) {
          console.log(`      Name: ${result.hexagramName} (${result.name})`);
          console.log(`      Has trigram data: ${result.hasTrigramData ? '✅' : '❌'}`);
        } else {
          console.log(`      Error: ${result.error}`);
        }
      });
    }
    
    // Quick 30-question test to see if personas generate correctly
    console.log('⚡ Quick 30-question test for persona generation...');
    await page.click('#start-btn');
    await page.waitForTimeout(2000);
    
    // Answer all 30 questions quickly
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
    
    // Final analysis button
    await page.waitForSelector('#next-btn:not([disabled])', { timeout: 5000 });
    await page.click('#next-btn');
    
    // Wait for results and check persona display
    await page.waitForTimeout(5000);
    
    // Check if personas are properly displayed in results
    const resultsPersonaCheck = await page.evaluate(() => {
      const resultsScreen = document.getElementById('results-screen');
      if (!resultsScreen || !resultsScreen.classList.contains('active')) {
        return { error: 'Results screen not active' };
      }
      
      // Check for persona-related content
      const personaElements = resultsScreen.querySelectorAll('[data-persona], .persona, .hexagram-display');
      const hasPersonaContent = personaElements.length > 0;
      
      // Check for specific OS displays
      const engineOS = resultsScreen.querySelector('[data-os="engine"]')?.textContent || 'Not found';
      const interfaceOS = resultsScreen.querySelector('[data-os="interface"]')?.textContent || 'Not found';
      const safeModeOS = resultsScreen.querySelector('[data-os="safemode"]')?.textContent || 'Not found';
      
      return {
        personaElementsFound: personaElements.length,
        hasPersonaContent,
        engineOS,
        interfaceOS,
        safeModeOS,
        resultsHTML: resultsScreen.innerHTML.substring(0, 500) + '...'
      };
    });
    
    console.log('📊 Results Persona Display Check:');
    if (resultsPersonaCheck.error) {
      console.log('   ❌ Error:', resultsPersonaCheck.error);
    } else {
      console.log('   Persona elements found:', resultsPersonaCheck.personaElementsFound);
      console.log('   Has persona content:', resultsPersonaCheck.hasPersonaContent ? '✅' : '❌');
      console.log('   Engine OS:', resultsPersonaCheck.engineOS);
      console.log('   Interface OS:', resultsPersonaCheck.interfaceOS);
      console.log('   Safe Mode OS:', resultsPersonaCheck.safeModeOS);
    }
    
    // Screenshot for debugging
    await page.screenshot({ 
      path: 'debug-virtual-persona-result.png', 
      fullPage: true 
    });
    
    console.log('✅ Virtual Persona debug test completed - screenshot saved');
    console.log('📝 Console errors:', errors.length);
    console.log('⚠️ Console warnings:', warnings.length);
    
    return {
      vpeStatus,
      personaTests,
      resultsPersonaCheck,
      errors,
      warnings: warnings.filter(w => w.includes('Persona') || w.includes('hexagram') || w.includes('not found'))
    };
    
  } catch (error) {
    console.error('❌ Debug test failed:', error.message);
    await page.screenshot({ path: 'debug-virtual-persona-error.png', fullPage: true });
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

debugVirtualPersonaTest();