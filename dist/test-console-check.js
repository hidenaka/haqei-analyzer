// Test script to check if critical functions are defined
console.log('🔧 Testing critical function availability...');

// Test the three functions that were causing empty tabs
const criticalFunctions = [
    'displayGoldenPatternAnalysis64',
    'displayTripleOSInteractionAnalysis', 
    'displayCompatibilityDiagnosis64'
];

criticalFunctions.forEach(funcName => {
    if (typeof window[funcName] === 'function') {
        console.log(`✅ ${funcName} - Available as global function`);
    } else {
        console.error(`❌ ${funcName} - NOT available globally`);
    }
});

// Test if they can be called
try {
    if (typeof displayGoldenPatternAnalysis64 === 'function') {
        console.log('✅ displayGoldenPatternAnalysis64 can be referenced directly');
    } else {
        console.error('❌ displayGoldenPatternAnalysis64 cannot be referenced directly');
    }
} catch (e) {
    console.error('❌ Error accessing displayGoldenPatternAnalysis64:', e.message);
}

console.log('🔧 Function availability check complete');