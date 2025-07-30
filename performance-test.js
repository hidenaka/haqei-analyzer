// Performance Test for IChingUltraSyncLogic Optimization
// HaQei Analyzer - パフォーマンステスト

// Mock DataManager
class MockDataManager {
  getAllHexagramData() {
    const hexagrams = {};
    for (let i = 1; i <= 64; i++) {
      hexagrams[i] = {
        name: `Test Hexagram ${i}`,
        chinese: `测试卦${i}`,
        judgment: `Test judgment ${i}`,
        image: `Test image ${i}`
      };
    }
    return hexagrams;
  }
}

// Mock Triple OS data
const mockEngineOS = {
  osId: 1,
  hexagramId: 1,
  name: "Test Engine OS",
  confidence: 0.85
};

const mockInterfaceOS = {
  hexagramId: 2,
  name: "Test Interface OS", 
  confidence: 0.78
};

const mockSafeModeOS = {
  hexagramId: 3,
  name: "Test SafeMode OS",
  confidence: 0.72
};

// Performance testing function
async function runPerformanceTest() {
  console.log("🚀 Starting Performance Test for IChingUltraSyncLogic");
  console.log("=" .repeat(60));
  
  // Initialize the logic
  const dataManager = new MockDataManager();
  const logic = new IChingUltraSyncLogic(dataManager);
  
  // Wait for initialization
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Test different analysis levels
  const levels = ['essential', 'standard', 'comprehensive'];
  const results = {};
  
  for (const level of levels) {
    console.log(`\n📊 Testing ${level.toUpperCase()} level analysis...`);
    
    const times = [];
    const iterations = 3;
    
    for (let i = 0; i < iterations; i++) {
      console.log(`  Iteration ${i + 1}/${iterations}`);
      
      const startTime = performance.now();
      
      try {
        const analysisResult = await logic.analyzeTripleOSWithUltraSync(
          mockEngineOS,
          mockInterfaceOS, 
          mockSafeModeOS,
          {
            level: level,
            onProgress: (progress) => {
              if (progress.stage === 'completion') {
                console.log(`    ✅ ${progress.progress}/${progress.total} methods completed`);
              }
            }
          }
        );
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        times.push(duration);
        
        console.log(`    ⏱️  Time: ${duration.toFixed(2)}ms`);
        console.log(`    📈 Methods executed: ${Object.keys(analysisResult.logicResults).length}`);
        console.log(`    💾 Cache used: ${analysisResult.processingTime !== undefined ? 'No' : 'Yes'}`);
        
      } catch (error) {
        console.error(`    ❌ Error:`, error.message);
        times.push(null);
      }
    }
    
    // Calculate averages
    const validTimes = times.filter(t => t !== null);
    if (validTimes.length > 0) {
      const avgTime = validTimes.reduce((a, b) => a + b, 0) / validTimes.length;
      const minTime = Math.min(...validTimes);
      const maxTime = Math.max(...validTimes);
      
      results[level] = {
        average: avgTime,
        min: minTime,
        max: maxTime,
        samples: validTimes.length
      };
      
      console.log(`  📊 ${level} Results:`);
      console.log(`    Average: ${avgTime.toFixed(2)}ms`);
      console.log(`    Min: ${minTime.toFixed(2)}ms`);
      console.log(`    Max: ${maxTime.toFixed(2)}ms`);
    }
  }
  
  // Test cache effectiveness
  console.log(`\n💾 Testing Cache Effectiveness...`);
  
  const cacheTestStart = performance.now();
  
  // First call (no cache)
  const firstCall = await logic.analyzeTripleOSWithUltraSync(
    mockEngineOS, mockInterfaceOS, mockSafeModeOS, { level: 'standard' }
  );
  const firstCallTime = performance.now() - cacheTestStart;
  
  // Second call (should use cache)
  const secondCallStart = performance.now();
  const secondCall = await logic.analyzeTripleOSWithUltraSync(
    mockEngineOS, mockInterfaceOS, mockSafeModeOS, { level: 'standard' }
  );
  const secondCallTime = performance.now() - secondCallStart;
  
  console.log(`  First call (no cache): ${firstCallTime.toFixed(2)}ms`);
  console.log(`  Second call (with cache): ${secondCallTime.toFixed(2)}ms`);
  console.log(`  Cache speedup: ${(firstCallTime / secondCallTime).toFixed(2)}x`);
  
  // Summary
  console.log(`\n📈 PERFORMANCE SUMMARY`);
  console.log("=" .repeat(60));
  
  Object.entries(results).forEach(([level, data]) => {
    const config = logic.getAnalysisConfiguration(level);
    console.log(`${level.toUpperCase()}:`);
    console.log(`  Methods: ${config.methods.length}`);
    console.log(`  Average time: ${data.average.toFixed(2)}ms`);
    console.log(`  Time per method: ${(data.average / config.methods.length).toFixed(2)}ms`);
    console.log(`  Description: ${config.description}`);
    console.log("");
  });
  
  // Performance recommendations
  console.log("🎯 RECOMMENDATIONS:");
  if (results.essential && results.comprehensive) {
    const speedup = results.comprehensive.average / results.essential.average;
    console.log(`- Essential analysis is ${speedup.toFixed(1)}x faster than comprehensive`);
    console.log("- Use 'essential' for real-time applications");
    console.log("- Use 'standard' for balanced performance/accuracy");
    console.log("- Use 'comprehensive' for detailed analysis when time allows");
  }
  
  console.log("- Cache provides significant speedup for repeated requests");
  console.log("- Parallel processing reduces overall analysis time");
  console.log("\n✅ Performance test completed!");
}

// Export for use in browser
if (typeof window !== 'undefined') {
  window.runPerformanceTest = runPerformanceTest;
} else if (typeof module !== 'undefined') {
  module.exports = { runPerformanceTest };
}

// Auto-run if in Node.js environment
if (typeof window === 'undefined' && typeof require !== 'undefined') {
  runPerformanceTest().catch(console.error);
}