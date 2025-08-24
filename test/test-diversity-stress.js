/**
 * Diversity Stress Test System Tests
 * v4.3.0 - 多様性セレクタの検証とストレステスト
 */

import { 
  EnhancedDiversitySelector,
  DiversityStressTestRunner
} from '../public/js/core/DiversityStressTest.js';
import { SeedableRandom } from '../public/js/core/SeedableRandom.js';

/**
 * テストランナー
 */
class DiversityTestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.random = new SeedableRandom(12345);
    this.selector = new EnhancedDiversitySelector(this.random);
  }
  
  test(name, fn) {
    this.tests.push({ name, fn });
  }
  
  assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }
  
  assertClose(actual, expected, tolerance = 0.001, message) {
    if (Math.abs(actual - expected) > tolerance) {
      throw new Error(`${message}\nExpected: ${expected} ± ${tolerance}\nActual: ${actual}`);
    }
  }
  
  async run() {
    console.log('🎯 Diversity Selector Tests\n');
    console.log('=' .repeat(50));
    
    for (const test of this.tests) {
      try {
        await test.fn.call(this);
        this.passed++;
        console.log(`✅ ${test.name}`);
      } catch (error) {
        this.failed++;
        console.log(`❌ ${test.name}`);
        console.log(`   Error: ${error.message}`);
      }
    }
    
    console.log('=' .repeat(50));
    console.log(`\n📊 Results: ${this.passed} passed, ${this.failed} failed`);
    console.log(`Total: ${this.tests.length} tests`);
    
    return this.failed === 0;
  }
}

const runner = new DiversityTestRunner();

// ===========================================
// 基本機能テスト
// ===========================================

runner.test('セレクタの初期化', function() {
  this.assert(this.selector.random, 'Should have random generator');
  this.assert(this.selector.options, 'Should have options');
  this.assert(this.selector.metrics, 'Should have metrics');
  this.assert(this.selector.options.targetCount === 8, 'Default target should be 8');
});

runner.test('空配列の処理', function() {
  const result = this.selector.selectDiverse([]);
  
  this.assert(Array.isArray(result.selected), 'Should return array');
  this.assert(result.selected.length === 0, 'Should return empty array for empty input');
  this.assert(result.metrics, 'Should have metrics');
  this.assert(!result.metrics.success, 'Should not be successful for empty input');
});

runner.test('候補数不足の処理', function() {
  const candidates = [
    { id: 'a', totalScore: 80 },
    { id: 'b', totalScore: 75 },
    { id: 'c', totalScore: 70 }
  ];
  
  const result = this.selector.selectDiverse(candidates, 8);
  
  this.assert(result.selected.length === 3, 'Should return all candidates when insufficient');
  this.assert(result.metrics.success, 'Should be successful');
  this.assert(result.metrics.warnings.length > 0, 'Should have warning about insufficient candidates');
});

runner.test('8個選択の保証', function() {
  // 20個の候補を生成
  const candidates = Array.from({length: 20}, (_, i) => ({
    id: `scenario_${i}`,
    totalScore: this.random.nextFloat(50, 100),
    path: [
      { hex: this.random.nextInt(1, 64), line: this.random.nextInt(1, 6) },
      { hex: this.random.nextInt(1, 64), line: this.random.nextInt(1, 6) }
    ]
  }));
  
  const result = this.selector.selectDiverse(candidates);
  
  this.assert(result.selected.length === 8, 'Should select exactly 8 candidates');
  this.assert(result.metrics.success, 'Should be successful');
  
  // 重複チェック
  const ids = result.selected.map(s => s.id);
  const unique = new Set(ids);
  this.assert(unique.size === 8, 'Selected candidates should be unique');
});

runner.test('決定論的動作', function() {
  const candidates = Array.from({length: 15}, (_, i) => ({
    id: `test_${i}`,
    totalScore: 80 - i * 2,
    path: [{ hex: i + 1, line: (i % 6) + 1 }]
  }));
  
  const selector1 = new EnhancedDiversitySelector(new SeedableRandom(999));
  const selector2 = new EnhancedDiversitySelector(new SeedableRandom(999));
  
  const result1 = selector1.selectDiverse([...candidates]);
  const result2 = selector2.selectDiverse([...candidates]);
  
  this.assert(result1.selected.length === result2.selected.length, 'Results should have same length');
  
  for (let i = 0; i < result1.selected.length; i++) {
    this.assert(result1.selected[i].id === result2.selected[i].id, 
      `Selected candidate ${i} should match`);
  }
});

// ===========================================
// 類似度計算テスト
// ===========================================

runner.test('パス類似度計算', function() {
  const scenario1 = {
    path: [{ hex: 1, line: 1 }, { hex: 2, line: 2 }]
  };
  const scenario2 = {
    path: [{ hex: 1, line: 1 }, { hex: 2, line: 2 }]
  };
  const scenario3 = {
    path: [{ hex: 10, line: 5 }, { hex: 20, line: 6 }]
  };
  
  const sim12 = this.selector.calculateSimilarity(scenario1, scenario2);
  const sim13 = this.selector.calculateSimilarity(scenario1, scenario3);
  
  this.assertClose(sim12, 0, 0.01, 'Identical paths should have 0 similarity');
  this.assert(sim13 > sim12, 'Different paths should have higher similarity');
});

runner.test('スコア類似度計算（フォールバック）', function() {
  const scenario1 = { totalScore: 80 };
  const scenario2 = { totalScore: 80 };
  const scenario3 = { totalScore: 20 };
  
  const sim12 = this.selector.calculateSimilarity(scenario1, scenario2);
  const sim13 = this.selector.calculateSimilarity(scenario1, scenario3);
  
  this.assertClose(sim12, 1, 0.01, 'Same scores should have high similarity');
  this.assert(sim13 < sim12, 'Different scores should have lower similarity');
});

// ===========================================
// メトリクステスト
// ===========================================

runner.test('メトリクス記録', function() {
  this.selector.resetMetrics();
  
  const candidates = Array.from({length: 10}, (_, i) => ({
    id: `m_${i}`,
    totalScore: 90 - i * 5
  }));
  
  this.selector.selectDiverse(candidates);
  this.selector.selectDiverse(candidates);
  
  const metrics = this.selector.getMetrics();
  
  this.assert(metrics.totalSelections === 2, 'Should record 2 selections');
  this.assert(metrics.averageTime > 0, 'Should have positive average time');
  this.assert(metrics.successRate > 0, 'Should have positive success rate');
  this.assert(metrics.efficiency > 0, 'Should have positive efficiency');
});

runner.test('メトリクスリセット', function() {
  // いくつか選択を実行
  const candidates = [{ id: 'test', totalScore: 50 }];
  this.selector.selectDiverse(candidates);
  
  this.selector.resetMetrics();
  const metrics = this.selector.getMetrics();
  
  this.assert(metrics.totalSelections === 0, 'Total selections should be 0 after reset');
  this.assert(metrics.totalTime === 0, 'Total time should be 0 after reset');
  this.assert(metrics.minTime === Infinity, 'Min time should be reset to Infinity');
});

// ===========================================
// エッジケースとエラー処理テスト
// ===========================================

runner.test('無効な入力の処理', function() {
  let errorCaught = false;
  
  try {
    this.selector.selectDiverse(null);
  } catch (error) {
    errorCaught = true;
  }
  
  this.assert(errorCaught, 'Should handle null input gracefully');
  
  // 文字列入力
  const result = this.selector.selectDiverse('not an array');
  this.assert(!result.metrics.success, 'Should fail for string input');
  this.assert(result.metrics.warnings.length > 0, 'Should have warnings for invalid input');
});

runner.test('非常に類似した候補の処理', function() {
  // 全て同じスコアで同じパスの候補
  const candidates = Array.from({length: 12}, (_, i) => ({
    id: `same_${i}`,
    totalScore: 75,
    path: [{ hex: 1, line: 1 }]
  }));
  
  const result = this.selector.selectDiverse(candidates);
  
  // 類似度が高くても8個選択することを確認
  this.assert(result.selected.length === 8, 'Should select 8 even with similar candidates');
  this.assert(result.metrics.success, 'Should be successful');
  // 閾値は段階的に緩和されるため、最終的には高い値になる
  this.assert(result.metrics.finalThreshold >= 0.6, 'Should use relaxed threshold for similar candidates');
});

runner.test('Levenshtein距離の最適化', function() {
  // 長い文字列でのテスト
  const longStr1 = 'a'.repeat(1000);
  const longStr2 = 'b'.repeat(1000);
  
  const startTime = performance.now();
  const distance = this.selector.levenshteinDistance(longStr1, longStr2);
  const endTime = performance.now();
  
  this.assert(distance === 1000, 'Distance should be 1000 for completely different strings');
  this.assert(endTime - startTime < 100, 'Should complete within 100ms for long strings');
});

// ===========================================
// ストレステストランナーテスト
// ===========================================

runner.test('ストレステストランナーの初期化', function() {
  const testRunner = new DiversityStressTestRunner({
    seedValue: 123,
    maxCandidates: 100,
    testCases: 5
  });
  
  this.assert(testRunner.random, 'Should have random generator');
  this.assert(testRunner.selector, 'Should have selector');
  this.assert(testRunner.options.seedValue === 123, 'Should use custom seed');
  this.assert(testRunner.options.maxCandidates === 100, 'Should use custom max candidates');
});

runner.test('テストデータ生成', function() {
  const testRunner = new DiversityStressTestRunner();
  const candidates = testRunner.generateTestCandidates(10);
  
  this.assert(candidates.length === 10, 'Should generate 10 candidates');
  this.assert(candidates[0].id, 'Should have ID');
  this.assert(typeof candidates[0].totalScore === 'number', 'Should have score');
  this.assert(Array.isArray(candidates[0].path), 'Should have path');
  this.assert(candidates[0].metadata, 'Should have metadata');
});

runner.test('小規模ストレステスト', async function() {
  const testRunner = new DiversityStressTestRunner({
    maxCandidates: 50,
    testCases: 3,
    seedValue: 456
  });
  
  // 小規模テストを実行
  await testRunner.runSizeTest(20);
  
  this.assert(testRunner.results.testCases.length === 1, 'Should have 1 test case');
  
  const testCase = testRunner.results.testCases[0];
  this.assert(testCase.candidateCount === 20, 'Should test with 20 candidates');
  this.assert(testCase.results.length === 3, 'Should have 3 iterations');
  this.assert(testCase.avgTime > 0, 'Should have positive average time');
  this.assert(testCase.successRate >= 0 && testCase.successRate <= 1, 'Success rate should be valid');
});

runner.test('テストケース実行と結果構造', async function() {
  const testRunner = new DiversityStressTestRunner({
    maxCandidates: 20,
    testCases: 2,
    seedValue: 777
  });
  
  // 実際に小規模テストを実行
  await testRunner.runSizeTest(10);
  
  this.assert(testRunner.results.testCases.length === 1, 'Should have one test case');
  const testCase = testRunner.results.testCases[0];
  
  this.assert(testCase.candidateCount === 10, 'Should test with 10 candidates');
  this.assert(testCase.results.length === 2, 'Should have 2 results');
  this.assert(typeof testCase.avgTime === 'number', 'Should have average time');
  this.assert(typeof testCase.successRate === 'number', 'Should have success rate');
});

runner.test('時間複雑度推定', function() {
  const testRunner = new DiversityStressTestRunner();
  
  // 線形の成長パターンをシミュレート
  const linearCases = [
    { candidateCount: 10, avgTime: 1 },
    { candidateCount: 20, avgTime: 2 },
    { candidateCount: 40, avgTime: 4 }
  ];
  
  const complexity = testRunner.estimateTimeComplexity(linearCases);
  
  this.assert(['O(n)', 'O(n log n)'].includes(complexity), 
    `Should detect linear or near-linear complexity, got ${complexity}`);
});

runner.test('レポート生成', function() {
  const testRunner = new DiversityStressTestRunner();
  
  // 必要なデータ構造を設定
  testRunner.options.seedValue = 999;
  testRunner.results.summary = {
    totalTestTime: 5000,
    totalIterations: 10,
    overallSuccessRate: 0.95,
    averageSelectionTime: 15.5,
    minSelectionTime: 5,
    maxSelectionTime: 25,
    scalabilityAnalysis: {
      timeComplexity: 'O(n)',
      maxCandidatesProcessed: 100,
      throughputRange: { min: 50, max: 200, avg: 100 }
    },
    qualityMetrics: {
      diversityQuality: { avg: 0.85 },
      selectionQuality: { perfectSelections: 8, partialSelections: 2, failures: 0 }
    },
    recommendations: [
      { message: 'Test recommendation' }
    ]
  };
  
  const report = testRunner.generateReport();
  
  this.assert(typeof report === 'string', 'Should return string report');
  this.assert(report.includes('Test Configuration'), 'Should include configuration section');
  this.assert(report.includes('Performance Results'), 'Should include performance section');
  this.assert(report.includes('95.00%'), 'Should include success rate');
  this.assert(report.includes('O(n)'), 'Should include complexity analysis');
});

// ===========================================
// パフォーマンステスト
// ===========================================

runner.test('中規模パフォーマンステスト', async function() {
  const candidates = Array.from({length: 500}, (_, i) => ({
    id: `perf_${i}`,
    totalScore: Math.random() * 100,
    path: Array.from({length: 4}, () => ({
      hex: Math.floor(Math.random() * 64) + 1,
      line: Math.floor(Math.random() * 6) + 1
    }))
  }));
  
  const startTime = performance.now();
  const result = this.selector.selectDiverse(candidates);
  const endTime = performance.now();
  
  const selectionTime = endTime - startTime;
  
  this.assert(result.selected.length === 8, 'Should select 8 from 500 candidates');
  this.assert(result.metrics.success, 'Should be successful');
  this.assert(selectionTime < 1000, 'Should complete within 1 second for 500 candidates');
  
  console.log(`   Performance: ${selectionTime.toFixed(2)}ms for 500 candidates`);
});

// テスト実行
runner.run().then(success => {
  if (typeof process !== 'undefined') {
    process.exit(success ? 0 : 1);
  }
});