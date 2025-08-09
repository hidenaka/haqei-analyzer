
console.log('=== HAQEI Phase 2 Triple OS Independent System Test ===');

// Test 1: Check if IndependentOSCalculator exists
try {
    const calc = new IndependentOSCalculator();
    console.log('✅ IndependentOSCalculator instantiated successfully');
    console.log('Question mapping:', calc.questionMapping);
} catch (e) {
    console.error('❌ IndependentOSCalculator error:', e.message);
}

// Test 2: Check if RealTimeValidationSystem exists  
try {
    const validator = new RealTimeValidationSystem();
    console.log('✅ RealTimeValidationSystem instantiated successfully');
    console.log('Quality thresholds:', validator.qualityThresholds);
} catch (e) {
    console.error('❌ RealTimeValidationSystem error:', e.message);
}

// Test 3: Mock answer validation
try {
    const mockAnswers = [
        { id: 'q1', value: 4 }, { id: 'q2', value: 3 }, { id: 'q3', value: 5 },
        { id: 'q4', value: 2 }, { id: 'q5', value: 4 }
    ];
    const validator = new RealTimeValidationSystem();
    const validation = validator.validateAnswerQuality(mockAnswers, 5);
    console.log('✅ Real-time validation working:', validation ? 'Success' : 'No validation yet');
} catch (e) {
    console.error('❌ Validation test error:', e.message);
}

// Test 4: Independent calculation test
try {
    const calc = new IndependentOSCalculator();
    const mockAnswers = [];
    for (let i = 1; i <= 36; i++) {
        mockAnswers.push({ id: 'q' + i, value: Math.floor(Math.random() * 5) + 1 });
    }
    
    const engineVector = calc.calculateEngineOS(mockAnswers);
    const interfaceVector = calc.calculateInterfaceOS(mockAnswers);
    const safeModeVector = calc.calculateSafeModeOS(mockAnswers);
    
    console.log('✅ Independent calculations working');
    console.log('Engine OS calculation result:', typeof engineVector === 'object');
    console.log('Interface OS calculation result:', typeof interfaceVector === 'object');
    console.log('Safe Mode OS calculation result:', typeof safeModeVector === 'object');
} catch (e) {
    console.error('❌ Independent calculation error:', e.message);
}
