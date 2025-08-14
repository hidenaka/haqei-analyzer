/**
 * 用九/用六監視システム テスト
 * v4.3.0 - 統計的検証とモニタリング機能のテスト
 */

// Node.js環境用のlocalStorageモック
if (typeof localStorage === 'undefined') {
  global.localStorage = {
    storage: new Map(),
    getItem(key) {
      return this.storage.get(key) || null;
    },
    setItem(key, value) {
      this.storage.set(key, value);
    },
    removeItem(key) {
      this.storage.delete(key);
    },
    clear() {
      this.storage.clear();
    }
  };
}

import { 
  YongProbabilityCalculator, 
  YongTelemetryCollector,
  YongRealTimeMonitor 
} from '../public/js/core/YongProbabilityMonitor.js';

/**
 * テストランナー
 */
class YongMonitorTestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.calculator = new YongProbabilityCalculator();
    this.collector = new YongTelemetryCollector();
    this.monitor = new YongRealTimeMonitor();
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
    console.log('📊 用九/用六監視システム テスト\n');
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
  
  // テスト終了後のクリーンアップ
  cleanup() {
    this.collector.clearData();
  }
}

const runner = new YongMonitorTestRunner();

// ===========================================
// 理論値計算テスト
// ===========================================

runner.test('理論値計算の正確性', function() {
  const theory = this.calculator.calculateTheoreticalProbability();
  
  // 理論値 = (2/64) × (1/4)^6 = 2/64 × 1/4096 = 2/262144 ≈ 7.629e-6
  const expected = (2/64) * Math.pow(0.25, 6);
  
  this.assertClose(theory.theoretical, expected, 1e-10, 'Theoretical probability should match calculation');
  this.assert(theory.percentage.includes('%'), 'Should include percentage');
  this.assert(theory.perMillion > 0, 'Should have per-million value');
  this.assert(theory.calculation.includes('×'), 'Should include calculation formula');
});

runner.test('理論値の範囲確認', function() {
  const theory = this.calculator.calculateTheoreticalProbability();
  
  // 極めて小さい確率であることを確認
  this.assert(theory.theoretical < 0.00001, 'Should be extremely rare (<0.001%)');
  this.assert(theory.perMillion < 10, 'Should be less than 10 per million');
  
  // 実際の計算: (2/64) × (1/4)^6 = 2/262144 ≈ 7.629e-6
  // これは100万回に7.6回程度なので、チェックを緩める
  this.assert(theory.theoretical < 0.00001, 'Should be less than 0.001%');
});

// ===========================================
// 実測値計算テスト
// ===========================================

runner.test('空データの実測値計算', function() {
  const actual = this.calculator.measureActualProbability([]);
  
  this.assert(actual.total === 0, 'Total should be 0 for empty data');
  this.assert(actual.yong9.count === 0, 'Yong9 count should be 0');
  this.assert(actual.yong6.count === 0, 'Yong6 count should be 0');
  this.assert(actual.combined.count === 0, 'Combined count should be 0');
  this.assert(actual.yong9.percentage === '0%', 'Percentage should be 0% for empty data');
});

runner.test('実測値計算の正確性', function() {
  const testData = [
    { overlay: '用九' },
    { overlay: '用九' },
    { overlay: '用六' },
    { overlay: null },
    { overlay: null },
    { overlay: '用九' },
    { overlay: null },
    { overlay: '用六' },
    { overlay: null },
    { overlay: null }
  ];
  
  const actual = this.calculator.measureActualProbability(testData);
  
  this.assert(actual.total === 10, 'Total should be 10');
  this.assert(actual.yong9.count === 3, 'Yong9 count should be 3');
  this.assert(actual.yong6.count === 2, 'Yong6 count should be 2');
  this.assert(actual.combined.count === 5, 'Combined count should be 5');
  
  // 30%
  this.assert(actual.yong9.percentage === '30.000000%', 'Yong9 percentage should be 30%');
  this.assert(actual.yong6.percentage === '20.000000%', 'Yong6 percentage should be 20%');
  this.assert(actual.combined.percentage === '50.000000%', 'Combined percentage should be 50%');
});

// ===========================================
// 統計的検定テスト
// ===========================================

runner.test('データ不足時の統計検定', function() {
  const theory = this.calculator.calculateTheoreticalProbability();
  const actual = this.calculator.measureActualProbability([
    { overlay: null }, { overlay: null }, { overlay: null }
  ]);
  
  const test = this.calculator.performStatisticalTest(actual, theory);
  
  this.assert(test.test === 'insufficient_data', 'Should detect insufficient data');
  this.assert(test.pValue === null, 'P-value should be null for insufficient data');
  this.assert(!test.significant, 'Should not be significant with insufficient data');
});

runner.test('正規近似統計検定', function() {
  const theory = this.calculator.calculateTheoreticalProbability();
  
  // 1000件のデータで理論値通りの結果をシミュレート
  const theoreticalCount = Math.round(1000 * theory.theoretical);
  const testData = Array(1000).fill().map((_, i) => ({
    overlay: i < theoreticalCount ? '用九' : null
  }));
  
  const actual = this.calculator.measureActualProbability(testData);
  const test = this.calculator.performStatisticalTest(actual, theory);
  
  this.assert(test.test === 'binomial_normal_approximation', 'Should use normal approximation');
  this.assert(typeof test.zScore === 'number', 'Should have Z-score');
  this.assert(typeof test.pValue === 'number', 'Should have p-value');
  this.assert(test.pValue >= 0 && test.pValue <= 1, 'P-value should be in [0,1]');
});

// ===========================================
// 信頼区間テスト
// ===========================================

runner.test('信頼区間計算', function() {
  const interval = this.calculator.calculateConfidenceInterval(5, 1000, 0.95);
  
  this.assert(interval.lower >= 0, 'Lower bound should be non-negative');
  this.assert(interval.upper <= 1, 'Upper bound should not exceed 1');
  this.assert(interval.lower <= interval.upper, 'Lower should be <= upper');
  this.assert(interval.width > 0, 'Width should be positive');
  // Wilson区間は調整されるため、centerが正確に5/1000にはならない
  this.assertClose(interval.center, 5/1000, 0.005, 'Center should be close to observed proportion');
});

runner.test('空データの信頼区間', function() {
  const interval = this.calculator.calculateConfidenceInterval(0, 0, 0.95);
  
  this.assert(interval.lower === 0, 'Lower bound should be 0 for no data');
  this.assert(interval.upper === 0, 'Upper bound should be 0 for no data');
  this.assert(interval.width === 0, 'Width should be 0 for no data');
});

// ===========================================
// テレメトリ収集テスト
// ===========================================

runner.test('テレメトリイベント記録', function() {
  // データをクリア
  this.collector.clearData();
  
  // イベントを記録
  this.collector.recordEvent({ overlay: '用九', hexagram: 1 });
  this.collector.recordEvent({ overlay: '用六', hexagram: 2 });
  this.collector.recordEvent({ overlay: null, hexagram: 3 });
  
  const data = this.collector.loadData();
  
  this.assert(data.length === 3, 'Should have 3 recorded events');
  this.assert(data[0].overlay === '用九', 'First event should be recorded correctly');
  this.assert(data[1].overlay === '用六', 'Second event should be recorded correctly');
  this.assert(data[2].overlay === null, 'Third event should be recorded correctly');
  
  // タイムスタンプとバージョンが追加されているか
  this.assert(data[0].timestamp, 'Should have timestamp');
  this.assert(data[0].version, 'Should have version');
});

runner.test('テレメトリデータ制限', function() {
  this.collector.clearData();
  
  // maxEntriesを一時的に小さく設定
  const originalMax = this.collector.maxEntries;
  this.collector.maxEntries = 5;
  
  // 10件のデータを記録
  for (let i = 0; i < 10; i++) {
    this.collector.recordEvent({ overlay: null, index: i });
  }
  
  const data = this.collector.loadData();
  
  this.assert(data.length === 5, 'Should limit to maxEntries');
  this.assert(data[0].index === 5, 'Should keep latest entries');
  this.assert(data[4].index === 9, 'Last entry should be the most recent');
  
  // 設定を戻す
  this.collector.maxEntries = originalMax;
});

runner.test('テレメトリ統計情報', function() {
  this.collector.clearData();
  
  // テストデータを記録
  this.collector.recordEvent({ overlay: '用九' });
  this.collector.recordEvent({ overlay: '用九' });
  this.collector.recordEvent({ overlay: '用六' });
  this.collector.recordEvent({ overlay: null });
  this.collector.recordEvent({ overlay: null });
  
  const stats = this.collector.getStatistics();
  
  this.assert(stats.total === 5, 'Total should be 5');
  this.assert(stats.yong9 === 2, 'Yong9 count should be 2');
  this.assert(stats.yong6 === 1, 'Yong6 count should be 1');
  this.assert(stats.combined === 3, 'Combined count should be 3');
  this.assert(stats.dateRange, 'Should have date range');
});

// ===========================================
// リアルタイム監視テスト
// ===========================================

runner.test('監視システムの初期化', function() {
  this.assert(this.monitor.calculator, 'Should have calculator');
  this.assert(this.monitor.collector, 'Should have collector');
  this.assert(this.monitor.alertThresholds, 'Should have alert thresholds');
  this.assert(this.monitor.callbacks instanceof Set, 'Should have callbacks set');
});

runner.test('コールバック管理', function() {
  let callCount = 0;
  const callback = () => callCount++;
  
  this.monitor.addCallback(callback);
  this.assert(this.monitor.callbacks.has(callback), 'Should add callback');
  
  this.monitor.removeCallback(callback);
  this.assert(!this.monitor.callbacks.has(callback), 'Should remove callback');
});

runner.test('分析実行', function() {
  this.monitor.collector.clearData();
  
  // テストデータを追加
  this.monitor.collector.recordEvent({ overlay: '用九' });
  this.monitor.collector.recordEvent({ overlay: null });
  this.monitor.collector.recordEvent({ overlay: null });
  
  const analysis = this.monitor.performAnalysis();
  
  this.assert(analysis.theoretical, 'Should have theoretical data');
  this.assert(analysis.actual, 'Should have actual data');
  this.assert(analysis.statistical, 'Should have statistical test');
  this.assert(analysis.confidence, 'Should have confidence interval');
  this.assert(analysis.timestamp, 'Should have timestamp');
  this.assert(['normal', 'warning'].includes(analysis.status), 'Should have valid status');
});

runner.test('レポート生成', function() {
  this.monitor.collector.clearData();
  
  // テストデータを追加
  for (let i = 0; i < 10; i++) {
    this.monitor.collector.recordEvent({ overlay: i < 2 ? '用九' : null });
  }
  
  const report = this.monitor.generateReport();
  
  this.assert(report.summary, 'Should have summary');
  this.assert(report.theoretical, 'Should have theoretical data');
  this.assert(report.actual, 'Should have actual data');
  this.assert(report.statistical, 'Should have statistical test');
  this.assert(report.recommendations, 'Should have recommendations');
  this.assert(report.generatedAt, 'Should have generation timestamp');
  
  this.assert(Array.isArray(report.recommendations), 'Recommendations should be array');
  this.assert(report.summary.totalSamples === 10, 'Should count samples correctly');
});

// ===========================================
// エッジケースとエラー処理テスト
// ===========================================

runner.test('localStorage無効時の処理', function() {
  // localStorageを一時的に無効化
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = () => {
    throw new Error('Storage disabled');
  };
  
  try {
    // エラーが発生してもクラッシュしないことを確認
    this.collector.recordEvent({ overlay: '用九' });
    this.assert(true, 'Should handle storage errors gracefully');
  } catch (error) {
    this.assert(false, 'Should not throw error when storage fails');
  } finally {
    // 元に戻す
    localStorage.setItem = originalSetItem;
  }
});

runner.test('文書用テキスト生成', function() {
  const docs = this.calculator.getDocumentationText();
  
  this.assert(docs.technical, 'Should have technical description');
  this.assert(docs.userFacing, 'Should have user-facing description');
  this.assert(docs.tooltip, 'Should have tooltip text');
  this.assert(docs.category, 'Should have category');
  this.assert(docs.rarity, 'Should have rarity classification');
  
  this.assert(['mythical', 'legendary', 'rare'].includes(docs.rarity), 'Rarity should be valid');
});

runner.test('正規分布CDF近似の精度', function() {
  // 標準的な値での近似精度をテスト
  const testCases = [
    { x: 0, expected: 0.5 },
    { x: 1.96, expected: 0.975 },
    { x: -1.96, expected: 0.025 }
  ];
  
  for (const testCase of testCases) {
    const actual = this.calculator.normalCDF(testCase.x);
    this.assertClose(actual, testCase.expected, 0.01, 
      `Normal CDF at ${testCase.x} should be approximately ${testCase.expected}`);
  }
});

// テスト実行
runner.run().then(success => {
  runner.cleanup();
  if (typeof process !== 'undefined') {
    process.exit(success ? 0 : 1);
  }
});