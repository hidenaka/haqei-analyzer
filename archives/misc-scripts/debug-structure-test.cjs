const { chromium } = require('playwright');

async function debugStructure() {
  console.log('🔧 Debugging DynamicKeywordGenerator object structure...');
  
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    page.on('console', msg => {
      console.log(`🖥️  ${msg.text()}`);
    });
    
    page.on('pageerror', error => {
      console.log(`❌ ${error.message}`);
    });
    
    const filePath = '/Users/hideakimacbookair/Desktop/haqei-analyzer/debug-object-structure.html';
    await page.goto(`file://${filePath}`);
    await page.waitForTimeout(2000);
    
    // Get the full structure analysis
    const analysis = await page.evaluate(() => {
      if (!window.DynamicKeywordGenerator) {
        return { error: 'DynamicKeywordGenerator not found' };
      }
      
      const result = {
        topLevel: [],
        engineOS: [],
        interfaceOS: [],
        safeMode: [],
        missingMethods: []
      };
      
      // Top level methods
      Object.getOwnPropertyNames(window.DynamicKeywordGenerator).forEach(prop => {
        const type = typeof window.DynamicKeywordGenerator[prop];
        if (type === 'function') {
          result.topLevel.push(prop);
        }
      });
      
      // Check nested objects
      const nestedObjects = ['engineOS', 'interfaceOS', 'safeMode'];
      nestedObjects.forEach(objName => {
        if (window.DynamicKeywordGenerator[objName]) {
          Object.getOwnPropertyNames(window.DynamicKeywordGenerator[objName]).forEach(prop => {
            const type = typeof window.DynamicKeywordGenerator[objName][prop];
            if (type === 'function') {
              result[objName].push(prop);
            }
          });
        }
      });
      
      // Check for specific missing methods
      const targetMethods = [
        'generateKeywords',
        'generateTripleOSDiagnosticText', 
        'generateEnhancedTripleOSDiagnosticText'
      ];
      
      targetMethods.forEach(method => {
        const topLevelExists = typeof window.DynamicKeywordGenerator[method] === 'function';
        const engineExists = window.DynamicKeywordGenerator.engineOS && 
                           typeof window.DynamicKeywordGenerator.engineOS[method] === 'function';
        
        result.missingMethods.push({
          method: method,
          topLevel: topLevelExists,
          engineOS: engineExists
        });
      });
      
      return result;
    });
    
    console.log('\n📊 Analysis Results:');
    console.log('🔧 Top-level methods:', analysis.topLevel);
    console.log('⚙️  engineOS methods:', analysis.engineOS);
    console.log('🖥️  interfaceOS methods:', analysis.interfaceOS);
    console.log('🛡️  safeMode methods:', analysis.safeMode);
    console.log('\n🎯 Target methods status:');
    analysis.missingMethods.forEach(item => {
      console.log(`   ${item.method}:`);
      console.log(`     Top level: ${item.topLevel ? '✅' : '❌'}`);
      console.log(`     engineOS: ${item.engineOS ? '✅' : '❌'}`);
    });
    
  } catch (error) {
    console.error('💥 Debug failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

debugStructure().catch(console.error);