/**
 * HAQEI Eight Palaces Invariant Test
 * 八宮データの不変条件検証
 */
const fs = require('fs');
const path = require('path');

function testEightPalacesInvariants() {
  console.log('🏛️  Starting Eight Palaces Invariant Test...');
  
  try {
    // 1. Load Eight Palaces data
    const dataPath = path.join(__dirname, '../data/eight_palaces.v1.json');
    if (!fs.existsSync(dataPath)) {
      throw new Error(`Eight Palaces data file not found: ${dataPath}`);
    }
    
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(`   📊 Loaded Eight Palaces data from: ${dataPath}`);
    
    // 2. Extract all hexagrams from all palaces
    const allHexagrams = [];
    const palaceNames = Object.keys(data.palaces || {});
    
    console.log(`   🏛️  Found ${palaceNames.length} palaces`);
    
    palaceNames.forEach(name => {
      const palace = data.palaces[name];
      if (!palace.hexagrams || !Array.isArray(palace.hexagrams)) {
        throw new Error(`Invalid hexagrams array in palace: ${name}`);
      }
      allHexagrams.push(...palace.hexagrams);
      console.log(`   - ${name}: ${palace.hexagrams.length} hexagrams`);
    });
    
    // 3. Test Invariant 1: Total count should be 64
    console.log('3. Testing total hexagram count...');
    if (allHexagrams.length !== 64) {
      throw new Error(`Expected 64 total hexagrams, got ${allHexagrams.length}`);
    }
    console.log('   ✅ Total count: 64 hexagrams');
    
    // 4. Test Invariant 2: All hexagrams should be unique
    console.log('4. Testing hexagram uniqueness...');
    const uniqueHexagrams = new Set(allHexagrams);
    if (uniqueHexagrams.size !== 64) {
      throw new Error(`Expected 64 unique hexagrams, got ${uniqueHexagrams.size}`);
    }
    console.log('   ✅ All hexagrams are unique');
    
    // 5. Test Invariant 3: All hexagrams should be in valid range (1-64)
    console.log('5. Testing hexagram range...');
    const invalidHexagrams = allHexagrams.filter(h => h < 1 || h > 64 || !Number.isInteger(h));
    if (invalidHexagrams.length > 0) {
      throw new Error(`Invalid hexagrams found: ${invalidHexagrams.join(', ')}`);
    }
    console.log('   ✅ All hexagrams in valid range (1-64)');
    
    // 6. Test Invariant 4: Each palace should have exactly 8 hexagrams
    console.log('6. Testing palace size...');
    palaceNames.forEach(name => {
      const palace = data.palaces[name];
      if (palace.hexagrams.length !== 8) {
        throw new Error(`Palace ${name} has ${palace.hexagrams.length} hexagrams, expected 8`);
      }
    });
    console.log('   ✅ Each palace has exactly 8 hexagrams');
    
    // 7. Test Invariant 5: All hexagrams 1-64 should be covered
    console.log('7. Testing complete coverage...');
    for (let i = 1; i <= 64; i++) {
      if (!allHexagrams.includes(i)) {
        throw new Error(`Hexagram ${i} is missing from Eight Palaces mapping`);
      }
    }
    console.log('   ✅ All hexagrams 1-64 are covered');
    
    console.log('🎉 All Eight Palaces invariants passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Eight Palaces invariant test failed:', error.message);
    return false;
  }
}

// CLI execution
if (require.main === module) {
  testEightPalacesInvariants().then ? 
    testEightPalacesInvariants().then(success => process.exit(success ? 0 : 1)) :
    process.exit(testEightPalacesInvariants() ? 0 : 1);
}

module.exports = { testEightPalacesInvariants };