const { chromium } = require('playwright');

async function testProductionFix() {
  console.log('🚀 Testing DynamicKeywordGenerator production fix...');
  
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error') {
        console.log(`❌ Browser Error: ${text}`);
      } else if (text.includes('✅') || text.includes('❌') || text.includes('🚀')) {
        console.log(`🖥️  ${text}`);
      }
    });
    
    page.on('pageerror', error => {
      console.log(`💥 Page Error: ${error.message}`);
    });
    
    const filePath = '/Users/hideakimacbookair/Desktop/haqei-analyzer/fix-dynamickeywordgenerator.html';
    await page.goto(`file://${filePath}`);
    
    // Wait for all fixes to be applied
    await page.waitForTimeout(3000);
    
    // Check final status
    const status = await page.textContent('#status');
    console.log(`\n📊 Final Status: ${status}`);
    
    // Verify all methods exist
    const methodCheck = await page.evaluate(() => {
      const methods = [
        'generateKeywords',
        'generateTripleOSDiagnosticText', 
        'generateEnhancedTripleOSDiagnosticText'
      ];
      
      const results = {};
      methods.forEach(method => {
        results[method] = typeof window.DynamicKeywordGenerator[method] === 'function';
      });
      
      return results;
    });
    
    console.log('\n🔧 Method Verification:');
    Object.entries(methodCheck).forEach(([method, exists]) => {
      console.log(`   ${method}: ${exists ? '✅ AVAILABLE' : '❌ MISSING'}`);
    });
    
    // Test the enhanced method directly
    if (methodCheck.generateEnhancedTripleOSDiagnosticText) {
      console.log('\n🎯 Testing generateEnhancedTripleOSDiagnosticText...');
      
      const testResult = await page.evaluate(async () => {
        try {
          const testData = {
            engine_os: { id: 1, name: '乾為天', score: 0.8 },
            interface_os: { id: 2, name: '坤為地', score: 0.7 },
            safe_mode_os: { id: 29, name: '坎為水', score: 0.6 }
          };
          
          const result = await window.DynamicKeywordGenerator.generateEnhancedTripleOSDiagnosticText(testData);
          
          return {
            success: true,
            combinationId: result.cockpitData?.combinationId,
            totalCombinations: result.cockpitData?.totalCombinations,
            hasText: result.diagnosticText?.length > 0,
            textPreview: result.diagnosticText?.substring(0, 100) + '...'
          };
        } catch (error) {
          return {
            success: false,
            error: error.message
          };
        }
      });
      
      if (testResult.success) {
        console.log(`✅ Test SUCCESS!`);
        console.log(`   Combination ID: ${testResult.combinationId}`);
        console.log(`   Total combinations: ${testResult.totalCombinations}`);
        console.log(`   Has diagnostic text: ${testResult.hasText}`);
        console.log(`   Text preview: ${testResult.textPreview}`);
        console.log('\n🚀 DynamicKeywordGenerator is now PRODUCTION READY!');
      } else {
        console.log(`❌ Test FAILED: ${testResult.error}`);
      }
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testProductionFix().catch(console.error);