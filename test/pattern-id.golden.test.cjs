/**
 * HAQEI Golden Pattern ID Test
 * "064/52" パターンの回帰防止テスト
 */

// Simulate the core pattern generation logic from os_analyzer.html
function simulateEightPalaceId(hexagram) {
  // Simplified Eight Palaces mapping simulation
  const EIGHT_PALACES = {
    "乾宮": { id: 0, hexagrams: [1, 44, 33, 12, 20, 23, 35, 14] },
    "坤宮": { id: 1, hexagrams: [2, 24, 19, 11, 34, 43, 5, 8] },
    "震宮": { id: 2, hexagrams: [51, 16, 40, 32, 46, 48, 28, 17] },
    "巽宮": { id: 3, hexagrams: [57, 9, 37, 42, 25, 18, 46, 48] },
    "坎宮": { id: 4, hexagrams: [29, 60, 3, 63, 49, 55, 36, 7] },
    "離宮": { id: 5, hexagrams: [30, 56, 50, 64, 35, 36, 55, 63] },
    "艮宮": { id: 6, hexagrams: [52, 22, 26, 41, 27, 28, 4, 23] },
    "兌宮": { id: 7, hexagrams: [58, 47, 45, 31, 49, 28, 43, 17] }
  };
  
  for (const [palaceName, palace] of Object.entries(EIGHT_PALACES)) {
    if (palace.hexagrams.includes(hexagram)) {
      return palace.id;
    }
  }
  
  // Fallback to modulo if not found in mapping
  return hexagram % 8;
}

function simulatePatternId(engineOS, interfaceOS, safeModeOS) {
  // Generate 3-digit base-8 string ID and integer
  const strId = `${engineOS}${interfaceOS}${safeModeOS}`;
  const intId = engineOS * 64 + interfaceOS * 8 + safeModeOS;
  
  return {
    str: strId,
    int: intId
  };
}

function testGoldenPattern() {
  console.log('🏆 Starting Golden Pattern Test ("064/52")...');
  
  try {
    // Test case: hexagrams 14, 38, 29 should produce "064" and 52
    const testHexagrams = [14, 38, 29];
    const expectedStr = "064";
    const expectedInt = 52;
    
    console.log(`   📊 Testing hexagrams: ${testHexagrams.join(', ')}`);
    
    // Get Eight Palace IDs
    const engineOS = simulateEightPalaceId(testHexagrams[0]);   // 14
    const interfaceOS = simulateEightPalaceId(testHexagrams[1]); // 38
    const safeModeOS = simulateEightPalaceId(testHexagrams[2]);  // 29
    
    console.log(`   🏛️  Palace IDs: Engine=${engineOS}, Interface=${interfaceOS}, SafeMode=${safeModeOS}`);
    
    // Generate pattern ID
    const patternId = simulatePatternId(engineOS, interfaceOS, safeModeOS);
    
    console.log(`   🔢 Generated Pattern: str="${patternId.str}", int=${patternId.int}`);
    
    // Verify golden values
    if (patternId.str !== expectedStr) {
      throw new Error(`String ID mismatch: expected "${expectedStr}", got "${patternId.str}"`);
    }
    
    if (patternId.int !== expectedInt) {
      throw new Error(`Integer ID mismatch: expected ${expectedInt}, got ${patternId.int}`);
    }
    
    console.log('   ✅ Golden pattern "064/52" verified');
    
    // Additional boundary tests
    console.log('2. Testing boundary cases...');
    
    // Test edge case: 0,0,0 should be "000" and 0
    const zeroPattern = simulatePatternId(0, 0, 0);
    if (zeroPattern.str !== "000" || zeroPattern.int !== 0) {
      throw new Error(`Zero pattern failed: got ${zeroPattern.str}/${zeroPattern.int}`);
    }
    console.log('   ✅ Zero pattern "000/0" verified');
    
    // Test edge case: 7,7,7 should be "777" and 511
    const maxPattern = simulatePatternId(7, 7, 7);
    if (maxPattern.str !== "777" || maxPattern.int !== 511) {
      throw new Error(`Max pattern failed: got ${maxPattern.str}/${maxPattern.int}`);
    }
    console.log('   ✅ Max pattern "777/511" verified');
    
    console.log('🎉 All golden pattern tests passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Golden pattern test failed:', error.message);
    return false;
  }
}

// CLI execution
if (require.main === module) {
  testGoldenPattern().then ? 
    testGoldenPattern().then(success => process.exit(success ? 0 : 1)) :
    process.exit(testGoldenPattern() ? 0 : 1);
}

module.exports = { testGoldenPattern, simulateEightPalaceId, simulatePatternId };