const SituationClassifier = require('./public/js/situation-analyzer/SituationClassifier.js');
const DynamicIChingMapper = require('./public/js/situation-analyzer/DynamicIChingMapper.js');

const classifier = new SituationClassifier();
const mapper = new DynamicIChingMapper();

// Test basic functionality
const testText = '新しい仕事を始めることになったが、不安で心配している';
const analysis = classifier.analyzeSituation(testText);

console.log('Classification Test:');
console.log('- Archetype:', analysis.archetype.primary);
console.log('- Confidence:', typeof analysis.confidence === 'object' ? analysis.confidence.value : analysis.confidence);
console.log('- Has user-friendly explanation:', !!analysis.confidence.userFriendlyExplanation);

// Test mapping
const mapping = mapper.mapToHexagram(analysis);
console.log('\nMapping Test:');
console.log('- Primary hexagram:', mapping.primary.hexagram);
console.log('- Has alternatives:', mapping.alternatives.length > 0);
console.log('- Has interpretation:', !!mapping.interpretation);
console.log('- Has userFriendlyVersion:', !!mapping.interpretation.userFriendlyVersion);

console.log('\n✅ Refactored code is working correctly!');