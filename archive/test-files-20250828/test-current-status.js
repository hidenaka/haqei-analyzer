// Quick test to check current 384爻 system status
const fs = require('fs');
const path = require('path');

// Read the TextTo384LinesBridge file
const bridgeCode = fs.readFileSync(
    path.join(__dirname, 'public/js/ai/TextTo384LinesBridge.js'), 
    'utf-8'
);

// Extract position weights
const weightsMatch = bridgeCode.match(/const positionWeights = \[([\d.,\s]+)\]/);
if (weightsMatch) {
    const weights = weightsMatch[1].split(',').map(w => parseFloat(w.trim()));
    console.log('=== Current Position Weights ===');
    console.log('1爻 (初爻):', weights[0]);
    console.log('2爻 (二爻):', weights[1]); 
    console.log('3爻 (三爻):', weights[2]);
    console.log('4爻 (四爻):', weights[3]);
    console.log('5爻 (五爻):', weights[4], weights[4] > 0.8 ? '✅ Heavily weighted' : '❌ Needs adjustment');
    console.log('6爻 (上爻):', weights[5]);
}

// Check for 5爻 keywords
const keywordsMatch = bridgeCode.match(/5:\s*\[([^\]]+)\]/);
if (keywordsMatch) {
    const keywords = keywordsMatch[1].match(/'[^']+'/g) || [];
    console.log('\n=== 5爻 Keywords ===');
    console.log('Count:', keywords.length);
    console.log('Keywords:', keywords.slice(0, 10).join(', ') + (keywords.length > 10 ? '...' : ''));
}

// Check for exploration noise
const hasNoise = bridgeCode.includes('explorationNoise');
const hasBaseChance = bridgeCode.includes('baseChance');

console.log('\n=== Coverage Enhancement Features ===');
console.log('Exploration Noise:', hasNoise ? '✅ Implemented' : '❌ Not implemented');
console.log('Base Chance:', hasBaseChance ? '✅ Implemented' : '❌ Not implemented');

// Check usage counter
const hasUsageCounter = bridgeCode.includes('this.usageCount');
console.log('Usage Counter:', hasUsageCounter ? '✅ Implemented' : '❌ Not implemented');

console.log('\n=== Summary ===');
const issues = [];
if (weights && weights[4] < 0.8) issues.push('5爻 weight too low');
if (!hasNoise && !hasBaseChance) issues.push('No coverage enhancement');
if (!hasUsageCounter) issues.push('No usage balancing');

if (issues.length === 0) {
    console.log('✅ All critical features appear to be implemented');
} else {
    console.log('❌ Issues found:');
    issues.forEach(issue => console.log('  -', issue));
}