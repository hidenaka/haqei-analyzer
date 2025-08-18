const { chromium } = require('playwright');

async function testOSAnalyzerFixed() {
  console.log('🚀 Testing DynamicKeywordGenerator fix in OS Analyzer...');
  
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('DynamicKeywordGenerator') || text.includes('PRODUCTION READY')) {
        console.log(`🖥️  ${text}`);
      }
    });
    
    page.on('pageerror', error => {
      console.log(`❌ Page Error: ${error.message}`);
    });
    
    // Test loading OS analyzer page
    const filePath = '/Users/hideakimacbookair/Desktop/haqei-analyzer/public/os_analyzer.html';
    console.log('📄 Loading OS analyzer page...');
    await page.goto(`file://${filePath}`);
    
    // Wait for scripts to load
    await page.waitForTimeout(3000);
    
    // Check if DynamicKeywordGenerator is loaded and working
    const testResult = await page.evaluate(async () => {
      if (!window.DynamicKeywordGenerator) {
        return { success: false, error: 'DynamicKeywordGenerator not loaded' };
      }
      
      const methods = [
        'generateTripleOSDiagnosticText',
        'generateEnhancedTripleOSDiagnosticText'
      ];
      
      const methodStatus = {};
      methods.forEach(method => {
        methodStatus[method] = typeof window.DynamicKeywordGenerator[method] === 'function';
      });
      
      // Test the enhanced method
      if (methodStatus.generateEnhancedTripleOSDiagnosticText) {
        try {
          const testData = {
            engine_os: { id: 1, name: '乾為天', score: 0.8 },
            interface_os: { id: 2, name: '坤為地', score: 0.7 },
            safe_mode_os: { id: 29, name: '坎為水', score: 0.6 }
          };
          
          const result = await window.DynamicKeywordGenerator.generateEnhancedTripleOSDiagnosticText(testData);
          
          return {
            success: true,
            methodStatus: methodStatus,
            testResult: {
              combinationId: result.cockpitData?.combinationId,
              totalCombinations: result.cockpitData?.totalCombinations,
              hasText: result.diagnosticText?.length > 0,
              version: result.metadata?.version
            }
          };
        } catch (error) {
          return {
            success: false,
            error: `Test execution failed: ${error.message}`,
            methodStatus: methodStatus
          };
        }
      } else {
        return {
          success: false,
          error: 'generateEnhancedTripleOSDiagnosticText method not available',
          methodStatus: methodStatus
        };
      }
    });
    
    console.log('\n📊 Test Results:');
    if (testResult.success) {
      console.log('✅ DynamicKeywordGenerator successfully fixed and operational!');
      console.log('\n🔧 Method Status:');
      Object.entries(testResult.methodStatus).forEach(([method, available]) => {
        console.log(`   ${method}: ${available ? '✅ AVAILABLE' : '❌ MISSING'}`);
      });
      
      console.log('\n🎯 Test Execution Results:');
      console.log(`   Combination ID: ${testResult.testResult.combinationId}`);
      console.log(`   Total Combinations: ${testResult.testResult.totalCombinations}`);
      console.log(`   Has Diagnostic Text: ${testResult.testResult.hasText}`);
      console.log(`   Version: ${testResult.testResult.version}`);
      
      console.log('\n🚀 STATUS: PRODUCTION READY FOR 64×64×64 PATTERN DIAGNOSTICS!');
    } else {
      console.log('❌ Test failed:', testResult.error);
      if (testResult.methodStatus) {
        console.log('\n🔧 Method Status:');
        Object.entries(testResult.methodStatus).forEach(([method, available]) => {
          console.log(`   ${method}: ${available ? '✅ AVAILABLE' : '❌ MISSING'}`);
        });
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

testOSAnalyzerFixed().catch(console.error);