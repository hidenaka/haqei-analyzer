#!/usr/bin/env node
const { chromium } = require('playwright');

async function debugPersonaSimple() {
  console.log('🎭 Simple Persona Debug');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Console monitoring
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error' || text.includes('404') || text.includes('script')) {
      console.log(`[${type.toUpperCase()}] ${text}`);
    }
  });
  
  try {
    console.log('🚀 Loading page...');
    await page.goto('http://localhost:8788/os_analyzer.html', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for page to fully load
    await page.waitForTimeout(5000);
    
    // Check what actually loaded
    const loadStatus = await page.evaluate(() => {
      return {
        hexagramsExists: typeof HEXAGRAMS !== 'undefined',
        hexagramsLength: window.HEXAGRAMS?.length || 0,
        h384Exists: typeof H384_DATA !== 'undefined', 
        h384Length: window.H384_DATA?.length || 0,
        vpeClassExists: typeof VirtualPersonaEnhancer !== 'undefined',
        vpeInstanceExists: !!window.virtualPersonaEnhancer,
        docReady: document.readyState,
        scriptsLoaded: Array.from(document.scripts).map(s => s.src || 'inline').slice(-5)
      };
    });
    
    console.log('📊 Load Status:');
    console.log('   HEXAGRAMS:', loadStatus.hexagramsExists ? `✅ (${loadStatus.hexagramsLength})` : '❌');
    console.log('   H384_DATA:', loadStatus.h384Exists ? `✅ (${loadStatus.h384Length})` : '❌');
    console.log('   VPE Class:', loadStatus.vpeClassExists ? '✅' : '❌');
    console.log('   VPE Instance:', loadStatus.vpeInstanceExists ? '✅' : '❌');
    console.log('   Document ready:', loadStatus.docReady);
    console.log('   Scripts loaded:', loadStatus.scriptsLoaded);
    
    // If data loaded correctly, test persona generation
    if (loadStatus.hexagramsExists && loadStatus.vpeClassExists) {
      const personaTest = await page.evaluate(() => {
        try {
          if (!window.virtualPersonaEnhancer) {
            window.virtualPersonaEnhancer = new VirtualPersonaEnhancer();
          }
          
          // Test specific hexagrams
          const results = {};
          [1, 34, 47, 61].forEach(hexId => {
            const persona = window.virtualPersonaEnhancer.enhanceOSResult(
              { hexagramId: hexId }, 
              'engine'
            );
            results[hexId] = {
              success: !!persona.persona,
              name: persona.persona?.name || 'Unknown',
              hexagramName: persona.persona?.hexagramName || 'Unknown'
            };
          });
          
          return { success: true, results };
        } catch (error) {
          return { success: false, error: error.message };
        }
      });
      
      console.log('🧪 Persona Generation Test:');
      if (personaTest.success) {
        Object.entries(personaTest.results).forEach(([hexId, result]) => {
          console.log(`   Hexagram ${hexId}: ${result.success ? '✅' : '❌'} ${result.hexagramName} (${result.name})`);
        });
      } else {
        console.log('   ❌ Error:', personaTest.error);
      }
    }
    
    return loadStatus;
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

debugPersonaSimple();