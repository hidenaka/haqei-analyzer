/**
 * Performance Benchmark System Tests
 * v4.3.0 - パフォーマンス測定システムのテスト
 */

// Node.js環境用のlocalStorageモック
if (typeof localStorage === 'undefined') {
  global.localStorage = {
    storage: new Map(),
    getItem(key) { return this.storage.get(key) || null; },
    setItem(key, value) { this.storage.set(key, value); },
    removeItem(key) { this.storage.delete(key); },
    clear() { this.storage.clear(); }
  };
}

import { 
  PerformanceMeasurer,
  ComponentBenchmark
} from '../public/js/core/PerformanceBenchmark.js';

/**
 * テストランナー
 */
class PerformanceTestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.measurer = new PerformanceMeasurer();
  }
  
  test(name, fn) {
    this.tests.push({ name, fn });
  }
  
  assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }
  
  assertClose(actual, expected, tolerance = 0.1, message) {
    if (Math.abs(actual - expected) > tolerance) {
      throw new Error(`${message}\nExpected: ${expected} ± ${tolerance}\nActual: ${actual}`);
    }
  }
  
  async run() {
    console.log('⚡ Performance Benchmark Tests\n');
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

const runner = new PerformanceTestRunner();

// ===========================================
// PerformanceMeasurer基本テスト
// ===========================================

runner.test('測定器の初期化', function() {
  this.assert(this.measurer.measurements instanceof Map, 'Should have measurements map');
  this.assert(this.measurer.version === '4.3.0', 'Should have correct version');
});

runner.test('単純な関数の測定', async function() {
  const testFn = () => {
    let sum = 0;
    for (let i = 0; i < 100; i++) {
      sum += i;
    }
    return sum;
  };
  
  const result = await this.measurer.measureFunction('simple_loop', testFn, 100);
  
  this.assert(result.name === 'simple_loop', 'Should have correct name');
  this.assert(result.iterations === 100, 'Should have correct iterations');
  this.assert(result.validExecutions === 100, 'Should have all valid executions');
  this.assert(result.errors === 0, 'Should have no errors');
  this.assert(result.times.avg > 0, 'Should have positive average time');
  this.assert(result.times.min <= result.times.avg, 'Min should be <= avg');
  this.assert(result.times.avg <= result.times.max, 'Avg should be <= max');
  this.assert(result.throughput.operationsPerSecond > 0, 'Should have positive throughput');
});

runner.test('エラーを含む関数の測定', async function() {
  let callCount = 0;
  const errorFn = () => {
    callCount++;
    if (callCount % 5 === 0) {
      throw new Error('Test error');
    }
    return 'success';
  };
  
  const result = await this.measurer.measureFunction('error_function', errorFn, 50);
  
  this.assert(result.errors > 0, 'Should have some errors');
  this.assert(result.validExecutions < result.iterations, 'Valid executions should be less than total');
  this.assert(result.errorRate > 0, 'Should have positive error rate');
  this.assert(result.errorRate < 1, 'Error rate should be less than 100%');
});

runner.test('非同期関数の測定', async function() {
  const asyncFn = async () => {
    await new Promise(resolve => setTimeout(resolve, 5));
    return 'async_result';
  };
  
  const result = await this.measurer.measureFunction('async_function', asyncFn, 20);
  
  this.assert(result.validExecutions === 20, 'Should handle async functions');
  this.assert(result.times.avg >= 5, 'Should measure async wait time');
  this.assert(result.errors === 0, 'Should have no errors');
});

runner.test('統計計算の精度', async function() {
  // 固定時間を返す関数（テスト用）
  const fixedTimes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let index = 0;
  const fixedTimeFn = () => {
    const delay = fixedTimes[index % fixedTimes.length];
    index++;
    // performance.nowを模倣
    const start = performance.now();
    while (performance.now() - start < delay) {
      // busy wait
    }
  };
  
  const result = await this.measurer.measureFunction('fixed_time', fixedTimeFn, 10);
  
  // 中央値は5.5 (5と6の平均)
  this.assertClose(result.times.median, 5.5, 1.5, 'Median should be approximately 5.5');
  this.assert(result.times.p95 >= result.times.median, 'P95 should be >= median');
  this.assert(result.times.p99 >= result.times.p95, 'P99 should be >= P95');
});

runner.test('メモリ使用量の測定', async function() {
  const memoryIntensiveFn = () => {
    // 大きな配列を作成（メモリ使用量テスト用）
    const arr = new Array(1000).fill(0).map((_, i) => ({ id: i, data: 'x'.repeat(100) }));
    return arr.length;
  };
  
  const result = await this.measurer.measureFunction('memory_intensive', memoryIntensiveFn, 10);
  
  this.assert(typeof result.memory.before === 'number', 'Should have before memory');
  this.assert(typeof result.memory.after === 'number', 'Should have after memory');
  this.assert(typeof result.memory.delta === 'number', 'Should have memory delta');
  this.assert(typeof result.memory.perIteration === 'number', 'Should have per-iteration memory');
});

// ===========================================
// CSVエクスポート機能テスト
// ===========================================

runner.test('CSVエクスポート機能', async function() {
  // いくつか測定を実行
  await this.measurer.measureFunction('test1', () => Math.random(), 10);
  await this.measurer.measureFunction('test2', () => 'hello'.toUpperCase(), 10);
  
  const csv = this.measurer.exportToCSV();
  
  this.assert(typeof csv === 'string', 'Should return string');
  this.assert(csv.includes('name,'), 'Should have CSV headers');
  this.assert(csv.includes('test1'), 'Should include test1 data');
  this.assert(csv.includes('test2'), 'Should include test2 data');
  
  const lines = csv.split('\n');
  this.assert(lines.length >= 3, 'Should have header + data lines'); // header + 2 data lines
});

// ===========================================
// ComponentBenchmark統合テスト
// ===========================================

runner.test('コンポーネントベンチマークの初期化', function() {
  const benchmark = new ComponentBenchmark();
  
  this.assert(benchmark.measurer, 'Should have measurer');
  this.assert(benchmark.random, 'Should have random generator');
  this.assert(benchmark.contextSystem, 'Should have context system');
  this.assert(benchmark.lineSelector, 'Should have line selector');
  this.assert(benchmark.yongCalculator, 'Should have yong calculator');
  this.assert(benchmark.diversitySelector, 'Should have diversity selector');
});

runner.test('SeedableRandomベンチマーク', async function() {
  const benchmark = new ComponentBenchmark();
  
  const results = await benchmark.benchmarkSeedableRandom();
  
  this.assert(results.next, 'Should have next() benchmark');
  this.assert(results.nextInt, 'Should have nextInt() benchmark');
  this.assert(results.shuffle, 'Should have shuffle() benchmark');
  this.assert(results.weightedChoice, 'Should have weightedChoice() benchmark');
  
  // 性能チェック
  this.assert(results.next.times.avg < 1, 'next() should be very fast (<1ms)');
  this.assert(results.next.errorRate === 0, 'next() should have no errors');
});

runner.test('ContextTypeSystemベンチマーク', async function() {
  const benchmark = new ComponentBenchmark();
  
  const results = await benchmark.benchmarkContextSystem();
  
  this.assert(results.normalizeString, 'Should have string normalization benchmark');
  this.assert(results.normalizeObject, 'Should have object normalization benchmark');
  this.assert(results.serialize, 'Should have serialization benchmark');
  this.assert(results.deserialize, 'Should have deserialization benchmark');
  
  // 性能チェック
  this.assert(results.normalizeString.times.avg < 1, 'String normalization should be fast');
  this.assert(results.normalizeObject.times.avg < 1, 'Object normalization should be fast');
});

runner.test('DiversitySelectorベンチマーク', async function() {
  const benchmark = new ComponentBenchmark();
  
  const results = await benchmark.benchmarkDiversitySelector();
  
  this.assert(results.small, 'Should have small dataset benchmark');
  this.assert(results.medium, 'Should have medium dataset benchmark');
  this.assert(results.large, 'Should have large dataset benchmark');
  this.assert(results.similarity, 'Should have similarity calculation benchmark');
  
  // スケーラビリティチェック
  this.assert(results.small.times.avg < results.medium.times.avg, 'Small should be faster than medium');
  this.assert(results.medium.times.avg < results.large.times.avg, 'Medium should be faster than large');
  this.assert(results.similarity.times.avg < 1, 'Similarity calculation should be fast');
});

runner.test('YongCalculatorベンチマーク', async function() {
  const benchmark = new ComponentBenchmark();
  
  const results = await benchmark.benchmarkYongCalculator();
  
  this.assert(results.theoretical, 'Should have theoretical calculation benchmark');
  this.assert(results.actual, 'Should have actual measurement benchmark');
  this.assert(results.statistical, 'Should have statistical test benchmark');
  
  // 基本的な性能チェック
  this.assert(results.theoretical.times.avg < 5, 'Theoretical calculation should be reasonably fast');
  this.assert(results.actual.errorRate === 0, 'Actual measurement should have no errors');
});

// ===========================================
// 軽量ベンチマーク実行テスト
// ===========================================

runner.test('軽量統合ベンチマーク実行', async function() {
  const benchmark = new ComponentBenchmark();
  
  // 軽量版の実行（実際のベンチマークは時間がかかるため）
  const originalMeasure = benchmark.measurer.measureFunction;
  benchmark.measurer.measureFunction = async function(name, fn, iterations = 10) {
    return originalMeasure.call(this, name, fn, Math.min(iterations, 10));
  };
  
  console.log('   Running lightweight benchmark...');
  const results = await benchmark.runAllBenchmarks();
  
  this.assert(results.benchmarks, 'Should have benchmark results');
  this.assert(results.summary, 'Should have summary');
  this.assert(typeof results.startTime === 'number', 'Should have start time');
  this.assert(typeof results.endTime === 'number', 'Should have end time');
  
  // サマリーの内容チェック
  const summary = results.summary;
  this.assert(summary.totalBenchmarkTime > 0, 'Should have positive total time');
  this.assert(summary.overallStatistics, 'Should have overall statistics');
  this.assert(Array.isArray(summary.recommendations), 'Should have recommendations array');
  this.assert(typeof summary.performanceGrade === 'string', 'Should have performance grade');
  
  console.log(`   Performance Grade: ${summary.performanceGrade}`);
  console.log(`   Average Execution Time: ${summary.overallStatistics.avgExecutionTime.toFixed(2)}ms`);
});

runner.test('レポート生成', async function() {
  const benchmark = new ComponentBenchmark();
  
  // テスト用の結果を作成
  const testResults = {
    startTime: Date.now() - 5000,
    endTime: Date.now(),
    benchmarks: {
      TestComponent: {
        testOperation: {
          name: 'test_operation',
          times: { avg: 1.5, min: 1.0, max: 2.0, median: 1.4, p95: 1.8, p99: 1.9 },
          memory: { delta: 1024, perIteration: 10.24 },
          throughput: { operationsPerSecond: 666 },
          errorRate: 0,
          iterations: 100,
          validExecutions: 100
        }
      }
    },
    summary: {
      totalBenchmarkTime: 5000,
      totalMeasurements: 1,
      overallStatistics: {
        avgExecutionTime: 1.5,
        totalMemoryUsed: 1024,
        overallErrorRate: 0
      },
      rankings: {
        slowest: [{ name: 'test_operation', avgTime: 1.5 }],
        fastest: [{ name: 'test_operation', avgTime: 1.5 }],
        errorProne: [],
        memoryIntensive: [{ name: 'test_operation', memoryDelta: 1024 }]
      },
      recommendations: [
        { type: 'performance', message: 'All systems performing well' }
      ],
      performanceGrade: 'A'
    }
  };
  
  const report = benchmark.generateReport(testResults);
  
  this.assert(typeof report === 'string', 'Should return string report');
  this.assert(report.includes('Performance Benchmark Report'), 'Should include report title');
  this.assert(report.includes('Performance Grade'), 'Should include performance grade');
  this.assert(report.includes('TestComponent'), 'Should include component data');
  this.assert(report.includes('1.50ms'), 'Should include timing data');
});

runner.test('CSV レポート生成', async function() {
  // 軽量測定を実行
  await this.measurer.measureFunction('csv_test', () => 42, 5);
  
  const csvReport = this.measurer.exportToCSV();
  
  this.assert(typeof csvReport === 'string', 'Should return string');
  this.assert(csvReport.includes('csv_test'), 'Should include test name');
  this.assert(csvReport.includes(','), 'Should be CSV format');
  
  const lines = csvReport.split('\n');
  this.assert(lines.length >= 2, 'Should have header and data');
});

// ===========================================
// パフォーマンス品質テスト
// ===========================================

runner.test('パフォーマンス品質評価', function() {
  const benchmark = new ComponentBenchmark();
  
  // 高性能なテストケース
  const highPerformance = [
    { times: { avg: 0.1 }, errorRate: 0, memory: { perIteration: 10 } },
    { times: { avg: 0.2 }, errorRate: 0, memory: { perIteration: 20 } }
  ];
  
  const gradeA = benchmark.calculatePerformanceGrade(highPerformance);
  this.assert(['A+', 'A'].includes(gradeA), `High performance should get A grade, got ${gradeA}`);
  
  // 低性能なテストケース
  const lowPerformance = [
    { times: { avg: 100 }, errorRate: 0.1, memory: { perIteration: 50000 } },
    { times: { avg: 200 }, errorRate: 0.2, memory: { perIteration: 100000 } }
  ];
  
  const gradeD = benchmark.calculatePerformanceGrade(lowPerformance);
  this.assert(['C', 'D'].includes(gradeD), `Low performance should get C or D grade, got ${gradeD}`);
});

runner.test('推奨事項生成の妥当性', function() {
  const benchmark = new ComponentBenchmark();
  
  // 問題のある測定結果
  const problematicMeasurements = [
    { name: 'slow_op', times: { avg: 50 }, errorRate: 0.02, memory: { delta: 2 * 1024 * 1024 } },
    { name: 'error_op', times: { avg: 5 }, errorRate: 0.05, memory: { delta: 1000 } },
    { name: 'memory_op', times: { avg: 2 }, errorRate: 0, memory: { delta: 5 * 1024 * 1024 } }
  ];
  
  const recommendations = benchmark.generateRecommendations(problematicMeasurements);
  
  this.assert(Array.isArray(recommendations), 'Should return array');
  this.assert(recommendations.length > 0, 'Should have recommendations for problematic operations');
  
  const types = recommendations.map(r => r.type);
  this.assert(types.includes('performance'), 'Should recommend performance improvements');
  this.assert(types.includes('reliability'), 'Should recommend reliability improvements');
  this.assert(types.includes('memory'), 'Should recommend memory optimization');
});

// テスト実行
runner.run().then(success => {
  if (typeof process !== 'undefined') {
    process.exit(success ? 0 : 1);
  }
});