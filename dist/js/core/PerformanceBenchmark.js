/**
 * Performance Benchmark System
 * v4.3.0 - 包括的なパフォーマンス測定とベンチマーク
 * 
 * @module PerformanceBenchmark
 * @description すべてのコンポーネントの性能測定、ボトルネック特定、最適化提案
 */

import { SeedableRandom } from './SeedableRandom.js';
import { ContextTypeSystem, ContextAwarePrimaryLineSelector } from './ContextTypeSystem.js';
import { YongProbabilityCalculator, YongTelemetryCollector } from './YongProbabilityMonitor.js';
import { EnhancedDiversitySelector } from './DiversityStressTest.js';

/**
 * パフォーマンス測定器
 * @class
 */
class PerformanceMeasurer {
  constructor() {
    this.measurements = new Map();
    this.version = '4.3.0';
  }
  
  /**
   * 関数の実行時間を測定
   * @param {string} name - 測定名
   * @param {Function} fn - 測定対象の関数
   * @param {number} iterations - 実行回数
   * @returns {Object} 測定結果
   */
  async measureFunction(name, fn, iterations = 1000) {
    const times = [];
    let errors = 0;
    let memoryBefore = this.getMemoryUsage();
    
    // ウォームアップ
    for (let i = 0; i < 10; i++) {
      try {
        await fn();
      } catch (error) {
        // ウォームアップエラーは無視
      }
    }
    
    // 実測定
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      
      try {
        await fn();
        const end = performance.now();
        times.push(end - start);
      } catch (error) {
        errors++;
        times.push(NaN);
      }
    }
    
    const memoryAfter = this.getMemoryUsage();
    const validTimes = times.filter(t => !isNaN(t));
    
    const result = {
      name,
      iterations,
      validExecutions: validTimes.length,
      errors,
      times: {
        min: Math.min(...validTimes),
        max: Math.max(...validTimes),
        avg: validTimes.reduce((a, b) => a + b, 0) / validTimes.length,
        median: this.calculateMedian(validTimes),
        p95: this.calculatePercentile(validTimes, 0.95),
        p99: this.calculatePercentile(validTimes, 0.99)
      },
      memory: {
        before: memoryBefore,
        after: memoryAfter,
        delta: memoryAfter - memoryBefore,
        perIteration: (memoryAfter - memoryBefore) / iterations
      },
      throughput: {
        operationsPerSecond: validTimes.length / (validTimes.reduce((a, b) => a + b, 0) / 1000),
        operationsPerMs: validTimes.length / validTimes.reduce((a, b) => a + b, 0)
      },
      errorRate: errors / iterations,
      timestamp: new Date().toISOString()
    };
    
    this.measurements.set(name, result);
    return result;
  }
  
  /**
   * 中央値を計算
   * @private
   */
  calculateMedian(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2 
      : sorted[mid];
  }
  
  /**
   * パーセンタイルを計算
   * @private
   */
  calculatePercentile(arr, percentile) {
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * percentile) - 1;
    return sorted[Math.max(0, index)];
  }
  
  /**
   * メモリ使用量を取得
   * @private
   */
  getMemoryUsage() {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed;
    }
    if (typeof performance !== 'undefined' && performance.memory) {
      return performance.memory.usedJSHeapSize;
    }
    return 0;
  }
  
  /**
   * すべての測定結果を取得
   * @returns {Map} 測定結果のマップ
   */
  getAllMeasurements() {
    return new Map(this.measurements);
  }
  
  /**
   * 測定結果をクリア
   */
  clearMeasurements() {
    this.measurements.clear();
  }
  
  /**
   * 測定結果をCSV形式でエクスポート
   * @returns {string} CSV文字列
   */
  exportToCSV() {
    const headers = [
      'name', 'iterations', 'validExecutions', 'errors',
      'minTime', 'maxTime', 'avgTime', 'medianTime', 'p95Time', 'p99Time',
      'memoryDelta', 'memoryPerIteration', 'operationsPerSecond', 'errorRate'
    ];
    
    const rows = Array.from(this.measurements.values()).map(result => [
      result.name,
      result.iterations,
      result.validExecutions,
      result.errors,
      result.times.min.toFixed(3),
      result.times.max.toFixed(3),
      result.times.avg.toFixed(3),
      result.times.median.toFixed(3),
      result.times.p95.toFixed(3),
      result.times.p99.toFixed(3),
      result.memory.delta,
      result.memory.perIteration.toFixed(1),
      result.throughput.operationsPerSecond.toFixed(1),
      (result.errorRate * 100).toFixed(2)
    ]);
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }
}

/**
 * コンポーネントベンチマーク
 * @class
 */
class ComponentBenchmark {
  constructor() {
    this.measurer = new PerformanceMeasurer();
    this.random = new SeedableRandom(42);
    this.setupComponents();
  }
  
  /**
   * コンポーネントを初期化
   * @private
   */
  setupComponents() {
    this.contextSystem = new ContextTypeSystem();
    this.lineSelector = new ContextAwarePrimaryLineSelector();
    this.yongCalculator = new YongProbabilityCalculator();
    this.yongCollector = new YongTelemetryCollector();
    this.diversitySelector = new EnhancedDiversitySelector(this.random);
  }
  
  /**
   * すべてのコンポーネントのベンチマークを実行
   * @returns {Object} ベンチマーク結果
   */
  async runAllBenchmarks() {
    console.log('🚀 Performance Benchmark Starting...\n');
    
    const results = {
      startTime: Date.now(),
      benchmarks: {},
      summary: null,
      endTime: null
    };
    
    const benchmarks = [
      { name: 'SeedableRandom', fn: () => this.benchmarkSeedableRandom() },
      { name: 'ContextTypeSystem', fn: () => this.benchmarkContextSystem() },
      { name: 'PrimaryLineSelector', fn: () => this.benchmarkLineSelector() },
      { name: 'YongProbabilityCalculator', fn: () => this.benchmarkYongCalculator() },
      { name: 'YongTelemetryCollector', fn: () => this.benchmarkYongCollector() },
      { name: 'DiversitySelector', fn: () => this.benchmarkDiversitySelector() }
    ];
    
    for (const benchmark of benchmarks) {
      console.log(`📊 Benchmarking ${benchmark.name}...`);
      results.benchmarks[benchmark.name] = await benchmark.fn();
    }
    
    results.endTime = Date.now();
    results.summary = this.generateSummary(results);
    
    console.log('\n✅ Benchmark Complete!');
    return results;
  }
  
  /**
   * SeedableRandomのベンチマーク
   * @private
   */
  async benchmarkSeedableRandom() {
    const results = {};
    
    // 基本的な乱数生成
    results.next = await this.measurer.measureFunction(
      'SeedableRandom.next',
      () => this.random.next(),
      10000
    );
    
    // 整数生成
    results.nextInt = await this.measurer.measureFunction(
      'SeedableRandom.nextInt',
      () => this.random.nextInt(1, 100),
      5000
    );
    
    // 配列シャッフル
    const testArray = Array.from({length: 50}, (_, i) => i);
    results.shuffle = await this.measurer.measureFunction(
      'SeedableRandom.shuffle',
      () => this.random.shuffle(testArray),
      1000
    );
    
    // 重み付き選択
    const items = ['A', 'B', 'C', 'D', 'E'];
    const weights = [10, 20, 30, 25, 15];
    results.weightedChoice = await this.measurer.measureFunction(
      'SeedableRandom.weightedChoice',
      () => this.random.weightedChoice(items, weights),
      5000
    );
    
    return results;
  }
  
  /**
   * ContextTypeSystemのベンチマーク
   * @private
   */
  async benchmarkContextSystem() {
    const results = {};
    
    // 文字列正規化
    results.normalizeString = await this.measurer.measureFunction(
      'ContextTypeSystem.normalizeContext(string)',
      () => this.contextSystem.normalizeContext('business'),
      10000
    );
    
    // オブジェクト正規化
    const contextObj = { domain: 'personal', urgency: 7, question: 'Test question' };
    results.normalizeObject = await this.measurer.measureFunction(
      'ContextTypeSystem.normalizeContext(object)',
      () => this.contextSystem.normalizeContext(contextObj),
      10000
    );
    
    // シリアライゼーション
    results.serialize = await this.measurer.measureFunction(
      'ContextTypeSystem.serialize',
      () => this.contextSystem.serialize(contextObj),
      5000
    );
    
    // デシリアライゼーション
    const serialized = this.contextSystem.serialize(contextObj);
    results.deserialize = await this.measurer.measureFunction(
      'ContextTypeSystem.deserialize',
      () => this.contextSystem.deserialize(serialized),
      5000
    );
    
    return results;
  }
  
  /**
   * PrimaryLineSelectorのベンチマーク
   * @private
   */
  async benchmarkLineSelector() {
    const results = {};
    
    // 単一爻選択
    results.singleLine = await this.measurer.measureFunction(
      'PrimaryLineSelector.selectPrimaryLine(single)',
      () => this.lineSelector.selectPrimaryLine([3], 'business'),
      10000
    );
    
    // 複数爻選択
    results.multipleLines = await this.measurer.measureFunction(
      'PrimaryLineSelector.selectPrimaryLine(multiple)',
      () => this.lineSelector.selectPrimaryLine([2, 4, 5], 'business'),
      10000
    );
    
    // 解釈モード決定
    results.interpretationMode = await this.measurer.measureFunction(
      'PrimaryLineSelector.determineInterpretation',
      () => this.lineSelector.determineInterpretation([1, 3, 5], { domain: 'personal' }),
      5000
    );
    
    return results;
  }
  
  /**
   * YongProbabilityCalculatorのベンチマーク
   * @private
   */
  async benchmarkYongCalculator() {
    const results = {};
    
    // 理論値計算
    results.theoretical = await this.measurer.measureFunction(
      'YongCalculator.calculateTheoreticalProbability',
      () => this.yongCalculator.calculateTheoreticalProbability(),
      5000
    );
    
    // 実測値計算
    const testData = Array.from({length: 1000}, (_, i) => ({
      overlay: i < 5 ? '用九' : i < 10 ? '用六' : null
    }));
    results.actual = await this.measurer.measureFunction(
      'YongCalculator.measureActualProbability',
      () => this.yongCalculator.measureActualProbability(testData),
      1000
    );
    
    // 統計検定
    const theoretical = this.yongCalculator.calculateTheoreticalProbability();
    const actual = this.yongCalculator.measureActualProbability(testData);
    results.statistical = await this.measurer.measureFunction(
      'YongCalculator.performStatisticalTest',
      () => this.yongCalculator.performStatisticalTest(actual, theoretical),
      1000
    );
    
    return results;
  }
  
  /**
   * YongTelemetryCollectorのベンチマーク
   * @private
   */
  async benchmarkYongCollector() {
    const results = {};
    
    // Node.js環境でのlocalStorageモック
    if (typeof localStorage === 'undefined') {
      global.localStorage = {
        storage: new Map(),
        getItem(key) { return this.storage.get(key) || null; },
        setItem(key, value) { this.storage.set(key, value); },
        removeItem(key) { this.storage.delete(key); },
        clear() { this.storage.clear(); }
      };
    }
    
    // データクリア
    this.yongCollector.clearData();
    
    // イベント記録
    results.recordEvent = await this.measurer.measureFunction(
      'YongCollector.recordEvent',
      () => this.yongCollector.recordEvent({ overlay: '用九', hexagram: 1 }),
      5000
    );
    
    // データ読み込み
    results.loadData = await this.measurer.measureFunction(
      'YongCollector.loadData',
      () => this.yongCollector.loadData(),
      5000
    );
    
    // 統計取得
    results.getStatistics = await this.measurer.measureFunction(
      'YongCollector.getStatistics',
      () => this.yongCollector.getStatistics(),
      1000
    );
    
    return results;
  }
  
  /**
   * DiversitySelectorのベンチマーク
   * @private
   */
  async benchmarkDiversitySelector() {
    const results = {};
    
    // 小規模選択（50件）
    const smallCandidates = this.generateTestCandidates(50);
    results.small = await this.measurer.measureFunction(
      'DiversitySelector.selectDiverse(50)',
      () => this.diversitySelector.selectDiverse(smallCandidates),
      500
    );
    
    // 中規模選択（200件）
    const mediumCandidates = this.generateTestCandidates(200);
    results.medium = await this.measurer.measureFunction(
      'DiversitySelector.selectDiverse(200)',
      () => this.diversitySelector.selectDiverse(mediumCandidates),
      100
    );
    
    // 大規模選択（1000件）
    const largeCandidates = this.generateTestCandidates(1000);
    results.large = await this.measurer.measureFunction(
      'DiversitySelector.selectDiverse(1000)',
      () => this.diversitySelector.selectDiverse(largeCandidates),
      20
    );
    
    // 類似度計算
    const scenario1 = smallCandidates[0];
    const scenario2 = smallCandidates[1];
    results.similarity = await this.measurer.measureFunction(
      'DiversitySelector.calculateSimilarity',
      () => this.diversitySelector.calculateSimilarity(scenario1, scenario2),
      10000
    );
    
    return results;
  }
  
  /**
   * テスト用候補データ生成
   * @private
   */
  generateTestCandidates(count) {
    return Array.from({length: count}, (_, i) => ({
      id: `candidate_${i}`,
      totalScore: this.random.nextFloat(0, 100),
      path: Array.from({length: this.random.nextInt(2, 6)}, () => ({
        hex: this.random.nextInt(1, 64),
        line: this.random.nextInt(1, 6)
      })),
      metadata: {
        risk: this.random.nextFloat(0, 100),
        potential: this.random.nextFloat(0, 100)
      }
    }));
  }
  
  /**
   * サマリーを生成
   * @private
   */
  generateSummary(results) {
    const totalTime = results.endTime - results.startTime;
    const allMeasurements = Object.values(results.benchmarks)
      .flatMap(component => Object.values(component));
    
    // 最も遅い操作
    const slowestOperations = allMeasurements
      .sort((a, b) => b.times.avg - a.times.avg)
      .slice(0, 5);
    
    // 最も速い操作
    const fastestOperations = allMeasurements
      .sort((a, b) => a.times.avg - b.times.avg)
      .slice(0, 5);
    
    // エラー率の高い操作
    const errorProneOperations = allMeasurements
      .filter(m => m.errorRate > 0)
      .sort((a, b) => b.errorRate - a.errorRate);
    
    // メモリ使用量の多い操作
    const memoryIntensiveOperations = allMeasurements
      .sort((a, b) => b.memory.delta - a.memory.delta)
      .slice(0, 5);
    
    return {
      totalBenchmarkTime: totalTime,
      totalMeasurements: allMeasurements.length,
      overallStatistics: {
        avgExecutionTime: allMeasurements.reduce((sum, m) => sum + m.times.avg, 0) / allMeasurements.length,
        totalMemoryUsed: allMeasurements.reduce((sum, m) => sum + m.memory.delta, 0),
        overallErrorRate: allMeasurements.reduce((sum, m) => sum + m.errorRate, 0) / allMeasurements.length
      },
      rankings: {
        slowest: slowestOperations.map(op => ({ name: op.name, avgTime: op.times.avg })),
        fastest: fastestOperations.map(op => ({ name: op.name, avgTime: op.times.avg })),
        errorProne: errorProneOperations.map(op => ({ name: op.name, errorRate: op.errorRate })),
        memoryIntensive: memoryIntensiveOperations.map(op => ({ name: op.name, memoryDelta: op.memory.delta }))
      },
      recommendations: this.generateRecommendations(allMeasurements),
      performanceGrade: this.calculatePerformanceGrade(allMeasurements)
    };
  }
  
  /**
   * 推奨事項を生成
   * @private
   */
  generateRecommendations(measurements) {
    const recommendations = [];
    
    // 遅い操作の特定
    const slowOperations = measurements.filter(m => m.times.avg > 10);
    if (slowOperations.length > 0) {
      recommendations.push({
        type: 'performance',
        severity: 'medium',
        message: `${slowOperations.length}個の操作が10ms以上かかっています。最適化を検討してください。`,
        operations: slowOperations.map(op => op.name)
      });
    }
    
    // エラー率の高い操作
    const errorOperations = measurements.filter(m => m.errorRate > 0.01);
    if (errorOperations.length > 0) {
      recommendations.push({
        type: 'reliability',
        severity: 'high',
        message: `${errorOperations.length}個の操作でエラー率が1%を超えています。`,
        operations: errorOperations.map(op => op.name)
      });
    }
    
    // メモリ使用量が多い操作
    const memoryOperations = measurements.filter(m => m.memory.delta > 1024 * 1024); // 1MB
    if (memoryOperations.length > 0) {
      recommendations.push({
        type: 'memory',
        severity: 'medium',
        message: `${memoryOperations.length}個の操作でメモリ使用量が1MB以上です。`,
        operations: memoryOperations.map(op => op.name)
      });
    }
    
    // 全体的なパフォーマンス
    const avgTime = measurements.reduce((sum, m) => sum + m.times.avg, 0) / measurements.length;
    if (avgTime < 1) {
      recommendations.push({
        type: 'performance',
        severity: 'info',
        message: '全体的に優秀なパフォーマンスです。現在の実装を維持してください。'
      });
    }
    
    return recommendations;
  }
  
  /**
   * パフォーマンスグレードを計算
   * @private
   */
  calculatePerformanceGrade(measurements) {
    const avgTime = measurements.reduce((sum, m) => sum + m.times.avg, 0) / measurements.length;
    const avgErrorRate = measurements.reduce((sum, m) => sum + m.errorRate, 0) / measurements.length;
    const avgMemoryPerOp = measurements.reduce((sum, m) => sum + m.memory.perIteration, 0) / measurements.length;
    
    let score = 100;
    
    // 実行時間ペナルティ
    if (avgTime > 50) score -= 30;
    else if (avgTime > 20) score -= 20;
    else if (avgTime > 10) score -= 10;
    else if (avgTime > 5) score -= 5;
    
    // エラー率ペナルティ
    if (avgErrorRate > 0.05) score -= 40;
    else if (avgErrorRate > 0.01) score -= 20;
    else if (avgErrorRate > 0.001) score -= 10;
    
    // メモリ使用量ペナルティ
    if (avgMemoryPerOp > 10000) score -= 15;
    else if (avgMemoryPerOp > 5000) score -= 10;
    else if (avgMemoryPerOp > 1000) score -= 5;
    
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
  }
  
  /**
   * レポートを生成
   * @param {Object} results - ベンチマーク結果
   * @returns {string} フォーマットされたレポート
   */
  generateReport(results) {
    const summary = results.summary;
    
    return `
# Performance Benchmark Report v4.3.0

## Executive Summary
- **Performance Grade**: ${summary.performanceGrade}
- **Total Benchmark Time**: ${(summary.totalBenchmarkTime / 1000).toFixed(1)}s
- **Average Execution Time**: ${summary.overallStatistics.avgExecutionTime.toFixed(2)}ms
- **Overall Error Rate**: ${(summary.overallStatistics.overallErrorRate * 100).toFixed(3)}%

## Performance Rankings

### Slowest Operations
${summary.rankings.slowest.map((op, i) => `${i+1}. ${op.name}: ${op.avgTime.toFixed(2)}ms`).join('\n')}

### Fastest Operations  
${summary.rankings.fastest.map((op, i) => `${i+1}. ${op.name}: ${op.avgTime.toFixed(3)}ms`).join('\n')}

## Component Analysis

${Object.entries(results.benchmarks).map(([component, tests]) => `
### ${component}
${Object.entries(tests).map(([test, result]) => 
  `- **${test}**: ${result.times.avg.toFixed(2)}ms avg (${result.throughput.operationsPerSecond.toFixed(0)} ops/sec)`
).join('\n')}
`).join('')}

## Recommendations
${summary.recommendations.map((rec, i) => `${i+1}. **${rec.type.toUpperCase()}**: ${rec.message}`).join('\n')}

## Memory Usage
- **Total Memory Used**: ${(summary.overallStatistics.totalMemoryUsed / 1024 / 1024).toFixed(2)} MB
- **Most Memory Intensive**: ${summary.rankings.memoryIntensive[0]?.name || 'N/A'}

Generated at: ${new Date().toISOString()}
`;
  }
  
  /**
   * CSVレポートを生成
   * @param {Object} results - ベンチマーク結果
   * @returns {string} CSV形式のレポート
   */
  generateCSVReport(results) {
    return this.measurer.exportToCSV();
  }
}

// グローバルエクスポート
if (typeof window !== 'undefined') {
  window.PerformanceMeasurer = PerformanceMeasurer;
  window.ComponentBenchmark = ComponentBenchmark;
}

// グローバル公開済み

console.log('✅ Performance Benchmark System v4.3.0 loaded');