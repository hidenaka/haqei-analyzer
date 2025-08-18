/**
 * Binary Tree Future Integration Validation Test
 * Tests the integration of BinaryTreeFutureEngine with Future Simulator Core
 */

console.log('🌳 Starting Binary Tree Integration Validation...');

// Test 1: Verify BinaryTreeFutureEngine is available
function testBinaryTreeEngineAvailable() {
  console.log('\n📋 Test 1: Checking BinaryTreeFutureEngine availability...');
  
  if (typeof window !== 'undefined' && window.BinaryTreeFutureEngine) {
    console.log('✅ BinaryTreeFutureEngine is available globally');
    return true;
  } else {
    console.log('❌ BinaryTreeFutureEngine is not available');
    return false;
  }
}

// Test 2: Verify engine can be instantiated  
function testEngineInstantiation() {
  console.log('\n📋 Test 2: Testing engine instantiation...');
  
  try {
    const engine = new window.BinaryTreeFutureEngine();
    if (engine && engine.version) {
      console.log(`✅ Engine instantiated successfully (v${engine.version})`);
      return engine;
    } else {
      console.log('❌ Engine instantiation failed');
      return null;
    }
  } catch (error) {
    console.log('❌ Engine instantiation error:', error.message);
    return null;
  }
}

// Test 3: Test binary tree generation
async function testBinaryTreeGeneration(engine) {
  console.log('\n📋 Test 3: Testing binary tree generation...');
  
  try {
    const testLineNumber = 123; // Test with line 123
    const testContext = { inputText: '新しいプロジェクトを開始する計画について考えています' };
    
    console.log(`🎯 Testing with line ${testLineNumber}...`);
    const result = await engine.generateBinaryTreeFutures(testLineNumber, testContext);
    
    if (result && result.finalEightPaths) {
      console.log(`✅ Binary tree generated: ${result.finalEightPaths.length} paths`);
      console.log(`📊 Processing time: ${result.processingTime}ms`);
      console.log(`🎋 Current line: ${result.currentLine}`);
      
      // Verify structure
      if (result.binaryTree && result.binaryTree.level1) {
        console.log('✅ Binary tree structure verified');
      }
      
      if (result.HaQeiIntegration) {
        console.log('✅ HaQei philosophy integration verified');
      }
      
      return result;
    } else {
      console.log('❌ Binary tree generation failed - no results');
      return null;
    }
  } catch (error) {
    console.log('❌ Binary tree generation error:', error.message);
    return null;
  }
}

// Test 4: Test Future Simulator Core integration
function testFutureSimulatorIntegration() {
  console.log('\n📋 Test 4: Testing Future Simulator Core integration...');
  
  if (typeof window !== 'undefined' && window.FutureSimulator && window.FutureSimulator.Core) {
    const core = window.FutureSimulator.Core;
    
    // Check if displayBinaryTreeResults method exists
    if (typeof core.displayBinaryTreeResults === 'function') {
      console.log('✅ displayBinaryTreeResults method available');
    } else {
      console.log('❌ displayBinaryTreeResults method missing');
      return false;
    }
    
    // Check if generateBinaryTreeHTML method exists
    if (typeof core.generateBinaryTreeHTML === 'function') {
      console.log('✅ generateBinaryTreeHTML method available');
    } else {
      console.log('❌ generateBinaryTreeHTML method missing');
      return false;
    }
    
    // Check if setupBinaryTreeInteractions method exists
    if (typeof core.setupBinaryTreeInteractions === 'function') {
      console.log('✅ setupBinaryTreeInteractions method available');
    } else {
      console.log('❌ setupBinaryTreeInteractions method missing');  
      return false;
    }
    
    console.log('✅ Future Simulator Core integration verified');
    return true;
  } else {
    console.log('❌ Future Simulator Core not available');
    return false;
  }
}

// Test 5: Test startAnalysis integration
function testStartAnalysisIntegration() {
  console.log('\n📋 Test 5: Testing startAnalysis integration...');
  
  if (typeof window !== 'undefined' && window.FutureSimulator && window.FutureSimulator.Core) {
    const core = window.FutureSimulator.Core;
    
    // Check if the startAnalysis method has been modified to include binary tree logic
    const startAnalysisString = core.startAnalysis.toString();
    
    if (startAnalysisString.includes('BinaryTreeFutureEngine')) {
      console.log('✅ startAnalysis method includes BinaryTreeFutureEngine logic');
    } else {
      console.log('❌ startAnalysis method missing BinaryTreeFutureEngine integration');
      return false;
    }
    
    if (startAnalysisString.includes('displayBinaryTreeResults')) {
      console.log('✅ startAnalysis method includes displayBinaryTreeResults call');
    } else {
      console.log('❌ startAnalysis method missing displayBinaryTreeResults call');
      return false;
    }
    
    console.log('✅ startAnalysis integration verified');
    return true;
  } else {
    console.log('❌ Cannot test startAnalysis integration - core not available');
    return false;
  }
}

// Test 6: Test HTML structure generation
async function testHTMLGeneration(binaryResult) {
  console.log('\n📋 Test 6: Testing HTML generation...');
  
  if (!binaryResult) {
    console.log('❌ No binary result to test HTML generation');
    return false;
  }
  
  try {
    const core = window.FutureSimulator.Core;
    const html = core.generateBinaryTreeHTML(binaryResult);
    
    if (html && html.includes('binary-tree-results')) {
      console.log('✅ HTML contains binary-tree-results class');
    } else {
      console.log('❌ HTML missing binary-tree-results class');
      return false;
    }
    
    if (html.includes('level-1-selection')) {
      console.log('✅ HTML contains level-1-selection');
    } else {
      console.log('❌ HTML missing level-1-selection');
      return false;
    }
    
    if (html.includes('final-patterns-display')) {
      console.log('✅ HTML contains final-patterns-display');
    } else {
      console.log('❌ HTML missing final-patterns-display');
      return false;
    }
    
    console.log('✅ HTML generation verified');
    return true;
  } catch (error) {
    console.log('❌ HTML generation error:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🌳 Binary Tree Future Integration Validation Suite');
  console.log('=' .repeat(60));
  
  const results = {
    engineAvailable: false,
    engineInstantiation: null,
    binaryTreeGeneration: null,
    coreIntegration: false,
    startAnalysisIntegration: false,
    htmlGeneration: false
  };
  
  // Test 1: Engine availability
  results.engineAvailable = testBinaryTreeEngineAvailable();
  
  if (!results.engineAvailable) {
    console.log('\n❌ Cannot continue testing - BinaryTreeFutureEngine not available');
    return results;
  }
  
  // Test 2: Engine instantiation
  results.engineInstantiation = testEngineInstantiation();
  
  if (!results.engineInstantiation) {
    console.log('\n❌ Cannot continue testing - Engine instantiation failed');
    return results;
  }
  
  // Test 3: Binary tree generation
  results.binaryTreeGeneration = await testBinaryTreeGeneration(results.engineInstantiation);
  
  // Test 4: Core integration
  results.coreIntegration = testFutureSimulatorIntegration();
  
  // Test 5: StartAnalysis integration
  results.startAnalysisIntegration = testStartAnalysisIntegration();
  
  // Test 6: HTML generation
  if (results.binaryTreeGeneration) {
    results.htmlGeneration = await testHTMLGeneration(results.binaryTreeGeneration);
  }
  
  // Summary
  console.log('\n🌳 VALIDATION SUMMARY');
  console.log('=' .repeat(40));
  console.log(`Engine Available: ${results.engineAvailable ? '✅' : '❌'}`);
  console.log(`Engine Instantiation: ${results.engineInstantiation ? '✅' : '❌'}`);
  console.log(`Binary Tree Generation: ${results.binaryTreeGeneration ? '✅' : '❌'}`);
  console.log(`Core Integration: ${results.coreIntegration ? '✅' : '❌'}`);
  console.log(`StartAnalysis Integration: ${results.startAnalysisIntegration ? '✅' : '❌'}`);
  console.log(`HTML Generation: ${results.htmlGeneration ? '✅' : '❌'}`);
  
  const passedTests = Object.values(results).filter(result => !!result).length;
  const totalTests = 6;
  
  console.log(`\n📊 OVERALL RESULT: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Binary Tree integration is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the implementation.');
  }
  
  return results;
}

// Export for browser testing
if (typeof window !== 'undefined') {
  window.validateBinaryTreeIntegration = runAllTests;
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runAllTests };
}

console.log('🚀 Binary Tree Integration Validator loaded. Call runAllTests() to execute.');