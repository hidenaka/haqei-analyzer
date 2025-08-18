const fs = require('fs');

// スキーマ読み込み
const schema = JSON.parse(fs.readFileSync('/Users/hideakimacbookair/Desktop/haqei-analyzer/config/kingwen-mapping.schema.json', 'utf8'));
const completeMapping = JSON.parse(fs.readFileSync('/Users/hideakimacbookair/Desktop/haqei-analyzer/config/kingwen-mapping-complete.json', 'utf8'));

console.log('🔍 Validating complete 64-hexagram mapping...\n');

let errors = 0;
let warnings = 0;

// 基本構造検証
if (!completeMapping.hexagrams || typeof completeMapping.hexagrams !== 'object') {
  console.error('❌ Missing hexagrams object');
  errors++;
}

const hexagramCount = Object.keys(completeMapping.hexagrams).length;
console.log(`📊 Total hexagrams: ${hexagramCount}`);

if (hexagramCount !== 64) {
  console.error('❌ Expected 64 hexagrams, found', hexagramCount);
  errors++;
} else {
  console.log('✅ Correct hexagram count');
}

// 各卦の検証
Object.entries(completeMapping.hexagrams).forEach(([num, hex]) => {
  const hexNum = parseInt(num);
  
  // 基本フィールド検証
  if (!hex.name || typeof hex.name !== 'string') {
    console.error(`❌ Hexagram ${num}: Missing or invalid name`);
    errors++;
  }
  
  if (!Array.isArray(hex.lines) || hex.lines.length !== 6) {
    console.error(`❌ Hexagram ${num}: Invalid lines array`);
    errors++;
  } else {
    // 線の値検証
    const validLines = hex.lines.every(line => line === 0 || line === 1);
    if (!validLines) {
      console.error(`❌ Hexagram ${num}: Lines must be 0 or 1`);
      errors++;
    }
  }
  
  if (!Array.isArray(hex.trigrams) || hex.trigrams.length !== 2) {
    console.error(`❌ Hexagram ${num}: Invalid trigrams array`);
    errors++;
  } else {
    // 八卦名検証
    const validTrigrams = ['乾', '坤', '震', '坎', '艮', '巽', '離', '兌'];
    hex.trigrams.forEach((trigram, i) => {
      if (!validTrigrams.includes(trigram)) {
        if (trigram === 'unknown') {
          console.warn(`⚠️ Hexagram ${num}: Unknown trigram at position ${i}`);
          warnings++;
        } else {
          console.error(`❌ Hexagram ${num}: Invalid trigram "${trigram}" at position ${i}`);
          errors++;
        }
      }
    });
  }
});

// King Wen順序検証
console.log('\n🔢 Checking King Wen sequence...');
const expectedNumbers = Array.from({length: 64}, (_, i) => i + 1);
const actualNumbers = Object.keys(completeMapping.hexagrams).map(n => parseInt(n)).sort((a, b) => a - b);

if (JSON.stringify(expectedNumbers) === JSON.stringify(actualNumbers)) {
  console.log('✅ All 64 hexagrams in correct King Wen sequence');
} else {
  console.error('❌ Missing hexagrams in King Wen sequence');
  const missing = expectedNumbers.filter(n => !actualNumbers.includes(n));
  if (missing.length > 0) {
    console.error(`Missing: ${missing.join(', ')}`);
    errors++;
  }
}

// 特定の重要な卦の検証
console.log('\n🎯 Checking critical hexagrams...');
const criticalHexagrams = [
  { num: 1, name: '乾為天', trigrams: ['乾', '乾'] },
  { num: 2, name: '坤為地', trigrams: ['坤', '坤'] },
  { num: 11, name: '地天泰', trigrams: ['坤', '乾'] },
  { num: 12, name: '天地否', trigrams: ['乾', '坤'] },
  { num: 63, name: '水火既済', trigrams: ['坎', '離'] },
  { num: 64, name: '火水未済', trigrams: ['離', '坎'] }
];

criticalHexagrams.forEach(expected => {
  const actual = completeMapping.hexagrams[expected.num];
  if (actual) {
    if (actual.name === expected.name && 
        JSON.stringify(actual.trigrams) === JSON.stringify(expected.trigrams)) {
      console.log(`✅ Hexagram ${expected.num}: ${expected.name} - correct`);
    } else {
      console.log(`🔍 Hexagram ${expected.num}: Expected ${expected.name}, got ${actual.name}`);
      console.log(`   Trigrams: expected [${expected.trigrams.join(',')}], got [${actual.trigrams.join(',')}]`);
      if (actual.name !== expected.name) {
        console.error(`❌ Hexagram ${expected.num}: Name mismatch`);
        errors++;
      }
      if (JSON.stringify(actual.trigrams) !== JSON.stringify(expected.trigrams)) {
        console.error(`❌ Hexagram ${expected.num}: Trigram mismatch`);
        errors++;
      }
    }
  }
});

// 結果サマリー
console.log('\n=== Validation Summary ===');
console.log(`✅ Successes: ${64 - errors} hexagrams`);
if (warnings > 0) console.log(`⚠️ Warnings: ${warnings}`);
if (errors > 0) {
  console.log(`❌ Errors: ${errors}`);
  console.log('❌ Validation FAILED');
  process.exit(1);
} else {
  console.log('✅ Validation PASSED - Ready for production use!');
}