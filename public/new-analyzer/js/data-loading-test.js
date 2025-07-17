// data-loading-test.js - Test script for HAQEI data loading fix
console.log('🧪 Starting HAQEI data loading test...');

// Test 1: Check if DataManager is defined
function testDataManagerClass() {
    console.log('🔍 Testing DataManager class definition...');
    
    if (typeof DataManager === 'undefined') {
        console.error('❌ DataManager class not found');
        return false;
    }
    
    console.log('✅ DataManager class is defined');
    return true;
}

// Test 2: Test DataManager initialization
async function testDataManagerInit() {
    console.log('🔍 Testing DataManager initialization...');
    
    try {
        const dataManager = new DataManager();
        console.log('✅ DataManager instance created successfully');
        
        // Test loadData method
        await dataManager.loadData();
        console.log('✅ DataManager.loadData() completed successfully');
        
        // Test getDataStats method
        const stats = dataManager.getDataStats();
        console.log('✅ getDataStats() method works:', stats);
        
        // Verify data structure
        if (stats.dataStructure) {
            console.log(`✅ Data structure verified - hexagrams: ${stats.dataStructure.hexagrams}, worldview: ${stats.dataStructure.worldviewQuestions}`);
        } else {
            console.warn('⚠️ Data structure not found in stats');
        }
        
        return true;
    } catch (error) {
        console.error('❌ DataManager initialization failed:', error);
        return false;
    }
}

// Test 3: Test global data availability
function testGlobalDataAvailability() {
    console.log('🔍 Testing global data availability...');
    
    const globalData = {
        HAQEI_DATA: typeof window.HAQEI_DATA !== 'undefined',
        WORLDVIEW_QUESTIONS: typeof window.WORLDVIEW_QUESTIONS !== 'undefined',
        SCENARIO_QUESTIONS: typeof window.SCENARIO_QUESTIONS !== 'undefined',
        H64_8D_VECTORS: typeof window.H64_8D_VECTORS !== 'undefined',
        hexagrams_master: typeof window.hexagrams_master !== 'undefined'
    };
    
    console.log('📊 Global data availability:', globalData);
    
    const availableCount = Object.values(globalData).filter(Boolean).length;
    const totalCount = Object.keys(globalData).length;
    
    console.log(`✅ ${availableCount}/${totalCount} global data objects are available`);
    
    return availableCount >= 3; // At least 3 out of 5 should be available
}

// Test 4: Test unified data retrieval
async function testUnifiedDataRetrieval() {
    console.log('🔍 Testing unified data retrieval...');
    
    try {
        const dataManager = new DataManager();
        await dataManager.loadData();
        
        // Test getUnifiedHexagramData method
        const unifiedData = dataManager.getUnifiedHexagramData(1);
        
        if (unifiedData && unifiedData.name) {
            console.log(`✅ Unified data retrieval successful - ID: 1, Name: ${unifiedData.name}`);
            return true;
        } else {
            console.error('❌ Unified data retrieval failed - no data returned');
            return false;
        }
    } catch (error) {
        console.error('❌ Unified data retrieval failed:', error);
        return false;
    }
}

// Test 5: Test QuestionFlow completion methods
function testQuestionFlowCompletionMethods() {
    console.log('🔍 Testing QuestionFlow completion methods...');
    
    if (typeof QuestionFlow === 'undefined') {
        console.error('❌ QuestionFlow class not found');
        return false;
    }
    
    // Check if completion methods exist
    const prototype = QuestionFlow.prototype;
    const methods = [
        'validateAnswerData',
        'findAnswerByQuestionId',
        'validateQuestionCompletion',
        'checkAllQuestionsAnswered',
        'performDataIntegrityCheck'
    ];
    
    let allMethodsPresent = true;
    methods.forEach(method => {
        if (typeof prototype[method] === 'function') {
            console.log(`✅ ${method} method exists`);
        } else {
            console.error(`❌ ${method} method not found`);
            allMethodsPresent = false;
        }
    });
    
    return allMethodsPresent;
}

// Run all tests
async function runAllTests() {
    console.log('🚀 Running all HAQEI data loading tests...');
    
    const results = {
        dataManagerClass: testDataManagerClass(),
        globalDataAvailability: testGlobalDataAvailability(),
        dataManagerInit: await testDataManagerInit(),
        unifiedDataRetrieval: await testUnifiedDataRetrieval(),
        questionFlowMethods: testQuestionFlowCompletionMethods()
    };
    
    console.log('📊 Test Results Summary:', results);
    
    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`🎯 Test Summary: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
        console.log('🎉 All tests passed! HAQEI data loading fix is working correctly.');
    } else {
        console.warn(`⚠️ ${totalTests - passedTests} tests failed. Please review the issues above.`);
    }
    
    return results;
}

// Export for use in HTML
if (typeof window !== 'undefined') {
    window.dataLoadingTest = {
        runAllTests,
        testDataManagerClass,
        testDataManagerInit,
        testGlobalDataAvailability,
        testUnifiedDataRetrieval,
        testQuestionFlowCompletionMethods
    };
}

// Auto-run if this script is loaded directly
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🔍 DOM loaded, running data loading tests...');
        setTimeout(runAllTests, 100);
    });
}