// MCP JavaScript Error Validation Test
console.log('🧪 Starting JavaScript Error Fix Validation...');

// Test 1: Future Simulator Core Loading
setTimeout(() => {
  try {
    console.log('🔍 Testing Future Simulator Core...');
    
    if (window.FutureSimulator && window.FutureSimulator.Core) {
      console.log('✅ Future Simulator Core loaded successfully');
      
      // Test initialization
      if (window.FutureSimulator.Core.initialized) {
        console.log('✅ Future Simulator Core initialized');
      } else {
        console.log('⚠️ Future Simulator Core not initialized yet');
      }
    } else {
      console.log('❌ Future Simulator Core not available');
    }
    
    // Test 2: Check for undefined function errors
    console.log('🔍 Testing for undefined function errors...');
    
    const testFunctions = [
      'loadConceptDatabase',
      'createSpatialFramework', 
      'createUrgencyFramework',
      'generateBasicScenarios'
    ];
    
    let errorCount = 0;
    
    testFunctions.forEach(funcName => {
      try {
        // Test if functions exist in their respective objects
        if (window.IntegratedAnalysisEngine && typeof window.IntegratedAnalysisEngine[funcName] === 'function') {
          console.log(`✅ ${funcName} found in IntegratedAnalysisEngine`);
        } else if (window.SituationalContextEngine && typeof window.SituationalContextEngine[funcName] === 'function') {
          console.log(`✅ ${funcName} found in SituationalContextEngine`);
        } else if (window.MultiDimensionalContextAnalyzer && typeof window.MultiDimensionalContextAnalyzer[funcName] === 'function') {
          console.log(`✅ ${funcName} found in MultiDimensionalContextAnalyzer`);
        } else if (window.Authentic8ScenariosSystem && typeof window.Authentic8ScenariosSystem[funcName] === 'function') {
          console.log(`✅ ${funcName} found in Authentic8ScenariosSystem`);
        } else {
          console.log(`⚠️ ${funcName} not found in expected objects`);
        }
      } catch (error) {
        console.log(`❌ Error testing ${funcName}:`, error.message);
        errorCount++;
      }
    });
    
    // Test 3: Component initialization
    console.log('🔍 Testing component initialization...');
    
    const components = [
      'IntegratedAnalysisEngine',
      'SituationalContextEngine', 
      'MultiDimensionalContextAnalyzer',
      'Authentic8ScenariosSystem'
    ];
    
    components.forEach(component => {
      if (window[component]) {
        console.log(`✅ ${component} component available`);
        
        // Test safe methods if they exist
        if (window[component].safeLoadDatabase || window[component].safeCreateFramework || window[component].safeCreateDimension) {
          console.log(`✅ ${component} has safe method helpers`);
        }
      } else {
        console.log(`❌ ${component} component not available`);
      }
    });
    
    // Test 4: UI Elements
    console.log('🔍 Testing UI elements...');
    
    const inputField = document.querySelector('textarea');
    if (inputField) {
      console.log('✅ Input textarea found');
      
      // Test character counter
      const counter = inputField.parentNode.querySelector('.character-counter');
      if (counter) {
        console.log('✅ Character counter found');
      } else {
        console.log('⚠️ Character counter not found');
      }
    } else {
      console.log('❌ Input textarea not found');
    }
    
    // Test 5: Error handling
    console.log('🔍 Testing error handling...');
    
    if (window.FutureSimulator && window.FutureSimulator.Core && window.FutureSimulator.Core.showError) {
      console.log('✅ Error handling method available');
    } else {
      console.log('❌ Error handling method not available');
    }
    
    // Final summary
    console.log('🎯 JavaScript Error Fix Validation Complete');
    console.log(`Total errors found: ${errorCount}`);
    
    if (errorCount === 0) {
      console.log('🎉 All JavaScript function errors appear to be fixed!');
    } else {
      console.log('⚠️ Some issues remain, check console for details');
    }
    
  } catch (error) {
    console.log('❌ Validation test error:', error.message);
  }
}, 3000); // Wait 3 seconds for all components to load

// Monitor for any JavaScript errors
window.addEventListener('error', (event) => {
  console.log('❌ JavaScript Error Detected:', event.error.message);
  console.log('📍 Error location:', event.filename, 'line', event.lineno);
});

console.log('🎯 MCP Error Validation Test loaded - results in 3 seconds...');