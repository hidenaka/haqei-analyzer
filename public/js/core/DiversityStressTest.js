/**
 * Diversity Selector Stress Test System
 * v4.3.0 - 多様性セレクタの大規模ストレステスト
 * 
 * @module DiversityStressTest
 * @description 多様性保証アルゴリズムの性能と信頼性を大規模データで検証
 */

import { SeedableRandom } from './SeedableRandom.js';

/**
 * 多様性セレクタ（v4.3強化版）
 * @class
 */
class EnhancedDiversitySelector {
  constructor(seedableRandom, options = {}) {
    this.random = seedableRandom;
    this.options = {
      targetCount: 8,
      initialThreshold: 0.60,
      maxIterations: 10000,
      timeoutMs: 5000,
      ...options
    };
    
    // 性能メトリクス
    this.metrics = {
      totalSelections: 0,
      totalTime: 0,
      averageTime: 0,
      maxTime: 0,
      minTime: Infinity,
      successRate: 0,
      thresholdDistribution: {},
      candidateCountDistribution: {}
    };
  }
  
  /**
   * 確実に8本の多様なシナリオを選択
   * @param {Array} candidates - 候補シナリオ配列
   * @param {number} targetCount - 目標選択数
   * @returns {Object} 選択結果と詳細メトリクス
   */
  selectDiverse(candidates, targetCount = this.options.targetCount) {
    const startTime = performance.now();
    const result = {
      selected: [],
      metrics: {
        candidateCount: candidates.length,
        iterations: 0,
        finalThreshold: 0,
        selectionTime: 0,
        success: false,
        warnings: []
      }
    };
    
    try {
      // 入力検証
      if (!Array.isArray(candidates) || candidates.length === 0) {
        throw new Error('Candidates must be a non-empty array');
      }
      
      if (candidates.length < targetCount) {
        result.selected = [...candidates];
        result.metrics.success = true;
        result.metrics.warnings.push('Insufficient candidates: returning all');
        return result;
      }
      
      // 決定論的ソート
      const sortedCandidates = this.deterministicSort(candidates);
      
      // 段階的閾値緩和による選択
      const thresholds = this.generateThresholds();
      let selected = [];
      
      for (let i = 0; i < thresholds.length && selected.length < targetCount; i++) {
        const threshold = thresholds[i];
        result.metrics.iterations = i + 1;
        
        // タイムアウトチェック
        if (performance.now() - startTime > this.options.timeoutMs) {
          result.metrics.warnings.push('Selection timeout reached');
          break;
        }
        
        selected = this.selectWithThreshold(sortedCandidates, threshold, targetCount);
        result.metrics.finalThreshold = threshold;
        
        if (selected.length >= targetCount) {
          break;
        }
      }
      
      // 最終的に不足している場合の処理
      if (selected.length < targetCount) {
        selected = this.fillRemainingSlots(selected, sortedCandidates, targetCount);
        result.metrics.warnings.push(`Final filling applied: ${selected.length}/${targetCount}`);
      }
      
      result.selected = selected.slice(0, targetCount);
      result.metrics.success = result.selected.length === targetCount;
      
    } catch (error) {
      result.metrics.warnings.push(`Error: ${error.message}`);
    } finally {
      const endTime = performance.now();
      result.metrics.selectionTime = endTime - startTime;
      this.updateMetrics(result.metrics);
    }
    
    return result;
  }
  
  /**
   * 決定論的ソート
   * @private
   */
  deterministicSort(candidates) {
    return [...candidates].sort((a, b) => {
      // 1. スコアによる第一ソート
      const scoreDiff = (b.totalScore || 0) - (a.totalScore || 0);
      if (Math.abs(scoreDiff) > 0.001) return scoreDiff;
      
      // 2. IDによる第二ソート（完全決定論）
      const aId = a.id || String(a.index || 0);
      const bId = b.id || String(b.index || 0);
      return aId.localeCompare(bId);
    });
  }
  
  /**
   * 閾値配列を生成
   * @private
   */
  generateThresholds() {
    const base = [0.60, 0.65, 0.70, 0.75, 0.80, 0.85, 0.90, 0.95];
    const fine = [];
    
    // より細かい刻みを追加
    for (let i = 0; i < base.length - 1; i++) {
      fine.push(base[i]);
      const step = (base[i + 1] - base[i]) / 3;
      fine.push(base[i] + step);
      fine.push(base[i] + step * 2);
    }
    fine.push(base[base.length - 1]);
    fine.push(0.99, 1.00);
    
    return fine;
  }
  
  /**
   * 指定閾値での選択
   * @private
   */
  selectWithThreshold(candidates, threshold, targetCount) {
    const selected = [];
    
    for (const candidate of candidates) {
      if (selected.length >= targetCount) break;
      
      // 既に選択済みかチェック
      if (selected.includes(candidate)) continue;
      
      // 類似度チェック
      const passesThreshold = selected.every(s => 
        this.calculateSimilarity(s, candidate) <= threshold
      );
      
      if (passesThreshold) {
        selected.push(candidate);
      }
    }
    
    return selected;
  }
  
  /**
   * 残りスロットを埋める
   * @private
   */
  fillRemainingSlots(selected, candidates, targetCount) {
    const remaining = candidates.filter(c => !selected.includes(c));
    const result = [...selected];
    
    // 最小類似度を維持しながら追加
    for (const candidate of remaining) {
      if (result.length >= targetCount) break;
      
      const similarities = result.map(s => this.calculateSimilarity(s, candidate));
      const minSimilarity = Math.min(...similarities);
      
      // 完全一致でない限り追加
      if (minSimilarity < 1.0) {
        result.push(candidate);
      }
    }
    
    // それでも不足の場合は強制追加
    while (result.length < targetCount && remaining.length > 0) {
      const candidate = remaining.shift();
      if (!result.includes(candidate)) {
        result.push(candidate);
      }
    }
    
    return result;
  }
  
  /**
   * シナリオ間の類似度計算
   * @private
   */
  calculateSimilarity(scenario1, scenario2) {
    // パス比較（主要な類似度指標）
    if (scenario1.path && scenario2.path) {
      return this.pathSimilarity(scenario1.path, scenario2.path);
    }
    
    // スコア比較（フォールバック）
    const score1 = scenario1.totalScore || 0;
    const score2 = scenario2.totalScore || 0;
    const maxScore = Math.max(score1, score2, 1);
    
    return 1 - Math.abs(score1 - score2) / maxScore;
  }
  
  /**
   * パス類似度計算（編集距離ベース）
   * @private
   */
  pathSimilarity(path1, path2) {
    const str1 = Array.isArray(path1) 
      ? path1.map(p => `${p.hex || 0}_${p.line || 0}`).join(',')
      : String(path1);
    const str2 = Array.isArray(path2) 
      ? path2.map(p => `${p.hex || 0}_${p.line || 0}`).join(',')
      : String(path2);
    
    const distance = this.levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length, 1);
    
    return distance / maxLength;
  }
  
  /**
   * Levenshtein距離（最適化版）
   * @private
   */
  levenshteinDistance(str1, str2) {
    if (str1 === str2) return 0;
    if (str1.length === 0) return str2.length;
    if (str2.length === 0) return str1.length;
    
    // 短い文字列を最初にする（メモリ最適化）
    if (str1.length > str2.length) {
      [str1, str2] = [str2, str1];
    }
    
    const len1 = str1.length;
    const len2 = str2.length;
    
    // 2行のみを使用（メモリ最適化）
    let prevRow = Array(len1 + 1).fill(0).map((_, i) => i);
    let currRow = Array(len1 + 1);
    
    for (let i = 1; i <= len2; i++) {
      currRow[0] = i;
      
      for (let j = 1; j <= len1; j++) {
        const cost = str1[j - 1] === str2[i - 1] ? 0 : 1;
        currRow[j] = Math.min(
          currRow[j - 1] + 1,     // 挿入
          prevRow[j] + 1,         // 削除
          prevRow[j - 1] + cost   // 置換
        );
      }
      
      [prevRow, currRow] = [currRow, prevRow];
    }
    
    return prevRow[len1];
  }
  
  /**
   * メトリクスを更新
   * @private
   */
  updateMetrics(selectionMetrics) {
    this.metrics.totalSelections++;
    this.metrics.totalTime += selectionMetrics.selectionTime;
    this.metrics.averageTime = this.metrics.totalTime / this.metrics.totalSelections;
    this.metrics.maxTime = Math.max(this.metrics.maxTime, selectionMetrics.selectionTime);
    this.metrics.minTime = Math.min(this.metrics.minTime, selectionMetrics.selectionTime);
    
    if (selectionMetrics.success) {
      this.metrics.successRate = (this.metrics.successRate * (this.metrics.totalSelections - 1) + 1) / this.metrics.totalSelections;
    } else {
      this.metrics.successRate = this.metrics.successRate * (this.metrics.totalSelections - 1) / this.metrics.totalSelections;
    }
    
    // 閾値分布
    const threshold = selectionMetrics.finalThreshold;
    this.metrics.thresholdDistribution[threshold] = (this.metrics.thresholdDistribution[threshold] || 0) + 1;
    
    // 候補数分布
    const candidateCount = selectionMetrics.candidateCount;
    const bucket = Math.floor(candidateCount / 100) * 100; // 100件単位
    this.metrics.candidateCountDistribution[bucket] = (this.metrics.candidateCountDistribution[bucket] || 0) + 1;
  }
  
  /**
   * メトリクスをリセット
   */
  resetMetrics() {
    this.metrics = {
      totalSelections: 0,
      totalTime: 0,
      averageTime: 0,
      maxTime: 0,
      minTime: Infinity,
      successRate: 0,
      thresholdDistribution: {},
      candidateCountDistribution: {}
    };
  }
  
  /**
   * 現在のメトリクスを取得
   * @returns {Object} メトリクス情報
   */
  getMetrics() {
    return {
      ...this.metrics,
      efficiency: this.metrics.averageTime > 0 ? 1000 / this.metrics.averageTime : 0, // selections per second
      memoryEstimate: this.estimateMemoryUsage()
    };
  }
  
  /**
   * メモリ使用量の推定
   * @private
   */
  estimateMemoryUsage() {
    const baseSize = 1024; // 基本オブジェクトサイズ
    const thresholdSize = Object.keys(this.metrics.thresholdDistribution).length * 64;
    const candidateSize = Object.keys(this.metrics.candidateCountDistribution).length * 64;
    
    return baseSize + thresholdSize + candidateSize;
  }
}

/**
 * ストレステストランナー
 * @class
 */
class DiversityStressTestRunner {
  constructor(options = {}) {
    this.options = {
      seedValue: 42,
      maxCandidates: 10000,
      testCases: 100,
      timeoutMs: 10000,
      reportInterval: 10,
      ...options
    };
    
    this.random = new SeedableRandom(this.options.seedValue);
    this.selector = new EnhancedDiversitySelector(this.random, {
      timeoutMs: this.options.timeoutMs
    });
    
    this.results = {
      testCases: [],
      summary: null,
      startTime: null,
      endTime: null
    };
  }
  
  /**
   * フルストレステストを実行
   * @returns {Object} テスト結果
   */
  async runFullStressTest() {
    console.log('🚀 Diversity Selector Stress Test Starting...');
    this.results.startTime = Date.now();
    
    const testSizes = [10, 50, 100, 500, 1000, 2000, 5000, 10000];
    
    for (const size of testSizes) {
      console.log(`\n📊 Testing with ${size} candidates...`);
      await this.runSizeTest(size);
    }
    
    this.results.endTime = Date.now();
    this.results.summary = this.generateSummary();
    
    console.log('\n✅ Stress Test Complete!');
    return this.results;
  }
  
  /**
   * 特定サイズでのテスト
   * @private
   */
  async runSizeTest(candidateCount) {
    const testCase = {
      candidateCount,
      iterations: Math.min(this.options.testCases, Math.ceil(1000 / candidateCount)),
      results: [],
      avgTime: 0,
      successRate: 0,
      memoryPeak: 0
    };
    
    for (let i = 0; i < testCase.iterations; i++) {
      if (i % this.options.reportInterval === 0) {
        process.stdout.write(`   Progress: ${i}/${testCase.iterations}\r`);
      }
      
      // テストデータ生成
      const candidates = this.generateTestCandidates(candidateCount);
      
      // メモリ使用量測定（Node.js環境）
      const memBefore = this.getMemoryUsage();
      
      // 選択実行
      const result = this.selector.selectDiverse(candidates);
      
      const memAfter = this.getMemoryUsage();
      result.memoryDelta = memAfter - memBefore;
      
      testCase.results.push(result);
      testCase.memoryPeak = Math.max(testCase.memoryPeak, result.memoryDelta);
      
      // 短時間の休憩（メモリ回収）
      if (i % 10 === 0) {
        await this.sleep(1);
      }
    }
    
    // 統計計算
    testCase.avgTime = testCase.results.reduce((sum, r) => sum + r.metrics.selectionTime, 0) / testCase.results.length;
    testCase.successRate = testCase.results.filter(r => r.metrics.success).length / testCase.results.length;
    
    this.results.testCases.push(testCase);
    
    console.log(`   Avg Time: ${testCase.avgTime.toFixed(2)}ms, Success: ${(testCase.successRate * 100).toFixed(1)}%`);
  }
  
  /**
   * テスト用候補データを生成
   * @private
   */
  generateTestCandidates(count) {
    const candidates = [];
    
    for (let i = 0; i < count; i++) {
      candidates.push({
        id: `scenario_${i}`,
        index: i,
        totalScore: this.random.nextFloat(0, 100),
        path: this.generateRandomPath(),
        metadata: {
          risk: this.random.nextFloat(0, 100),
          potential: this.random.nextFloat(0, 100)
        }
      });
    }
    
    return candidates;
  }
  
  /**
   * ランダムパスを生成
   * @private
   */
  generateRandomPath() {
    const pathLength = this.random.nextInt(3, 8);
    const path = [];
    
    for (let i = 0; i < pathLength; i++) {
      path.push({
        hex: this.random.nextInt(1, 64),
        line: this.random.nextInt(1, 6)
      });
    }
    
    return path;
  }
  
  /**
   * メモリ使用量を取得
   * @private
   */
  getMemoryUsage() {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed;
    }
    return 0;
  }
  
  /**
   * 短時間のスリープ
   * @private
   */
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * サマリーを生成
   * @private
   */
  generateSummary() {
    const totalTime = this.results.endTime - this.results.startTime;
    const allResults = this.results.testCases.flatMap(tc => tc.results);
    
    const avgTimes = this.results.testCases.map(tc => tc.avgTime);
    const successRates = this.results.testCases.map(tc => tc.successRate);
    
    return {
      totalTestTime: totalTime,
      totalIterations: allResults.length,
      overallSuccessRate: successRates.reduce((a, b) => a + b, 0) / successRates.length,
      averageSelectionTime: avgTimes.reduce((a, b) => a + b, 0) / avgTimes.length,
      maxSelectionTime: Math.max(...allResults.map(r => r.metrics.selectionTime)),
      minSelectionTime: Math.min(...allResults.map(r => r.metrics.selectionTime)),
      performanceMetrics: this.selector.getMetrics(),
      scalabilityAnalysis: this.analyzeScalability(),
      qualityMetrics: this.analyzeQuality(),
      recommendations: this.generateRecommendations()
    };
  }
  
  /**
   * スケーラビリティ分析
   * @private
   */
  analyzeScalability() {
    const cases = this.results.testCases;
    
    // 時間複雑度の推定
    const timeComplexity = this.estimateTimeComplexity(cases);
    
    // スループット計算
    const throughput = cases.map(tc => tc.iterations / (tc.avgTime / 1000));
    
    return {
      timeComplexity,
      maxCandidatesProcessed: Math.max(...cases.map(tc => tc.candidateCount)),
      throughputRange: {
        min: Math.min(...throughput),
        max: Math.max(...throughput),
        avg: throughput.reduce((a, b) => a + b, 0) / throughput.length
      },
      memoryEfficiency: this.analyzeMemoryEfficiency(cases)
    };
  }
  
  /**
   * 時間複雑度を推定
   * @private
   */
  estimateTimeComplexity(cases) {
    if (cases.length < 3) return 'insufficient_data';
    
    // 線形回帰で傾きを求める
    const x = cases.map(tc => Math.log(tc.candidateCount));
    const y = cases.map(tc => Math.log(tc.avgTime));
    
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    if (slope < 1.2) return 'O(n)';
    if (slope < 1.8) return 'O(n log n)';
    if (slope < 2.2) return 'O(n^2)';
    return 'O(n^2+)';
  }
  
  /**
   * メモリ効率性分析
   * @private
   */
  analyzeMemoryEfficiency(cases) {
    const memoryGrowth = cases.map(tc => tc.memoryPeak / tc.candidateCount);
    
    return {
      perCandidateMemory: {
        avg: memoryGrowth.reduce((a, b) => a + b, 0) / memoryGrowth.length,
        max: Math.max(...memoryGrowth),
        min: Math.min(...memoryGrowth)
      },
      totalPeakMemory: Math.max(...cases.map(tc => tc.memoryPeak))
    };
  }
  
  /**
   * 品質分析
   * @private
   */
  analyzeQuality() {
    const allResults = this.results.testCases.flatMap(tc => tc.results);
    
    // 多様性品質の分析
    const diversityScores = allResults.map(r => this.calculateDiversityScore(r.selected));
    
    // 選択失敗の分析
    const failures = allResults.filter(r => !r.metrics.success);
    const failureReasons = this.analyzeFailures(failures);
    
    return {
      diversityQuality: {
        avg: diversityScores.reduce((a, b) => a + b, 0) / diversityScores.length,
        min: Math.min(...diversityScores),
        max: Math.max(...diversityScores)
      },
      selectionQuality: {
        perfectSelections: allResults.filter(r => r.selected.length === 8).length,
        partialSelections: allResults.filter(r => r.selected.length > 0 && r.selected.length < 8).length,
        failures: failures.length
      },
      failureAnalysis: failureReasons
    };
  }
  
  /**
   * 多様性スコアを計算
   * @private
   */
  calculateDiversityScore(selected) {
    if (selected.length < 2) return 0;
    
    let totalSimilarity = 0;
    let pairCount = 0;
    
    for (let i = 0; i < selected.length; i++) {
      for (let j = i + 1; j < selected.length; j++) {
        totalSimilarity += this.selector.calculateSimilarity(selected[i], selected[j]);
        pairCount++;
      }
    }
    
    const avgSimilarity = totalSimilarity / pairCount;
    return 1 - avgSimilarity; // 類似度が低いほど多様性が高い
  }
  
  /**
   * 失敗原因を分析
   * @private
   */
  analyzeFailures(failures) {
    const reasons = {
      timeout: 0,
      insufficient_diversity: 0,
      other: 0
    };
    
    failures.forEach(failure => {
      const warnings = failure.metrics.warnings || [];
      if (warnings.some(w => w.includes('timeout'))) {
        reasons.timeout++;
      } else if (warnings.some(w => w.includes('filling'))) {
        reasons.insufficient_diversity++;
      } else {
        reasons.other++;
      }
    });
    
    return reasons;
  }
  
  /**
   * 推奨事項を生成
   * @private
   */
  generateRecommendations() {
    const recommendations = [];
    const summary = this.results.summary;
    
    if (summary.overallSuccessRate < 0.95) {
      recommendations.push({
        type: 'reliability',
        message: `成功率が${(summary.overallSuccessRate * 100).toFixed(1)}%と低いです。閾値設定の見直しを推奨します。`
      });
    }
    
    if (summary.averageSelectionTime > 100) {
      recommendations.push({
        type: 'performance',
        message: `平均選択時間が${summary.averageSelectionTime.toFixed(1)}msと長いです。アルゴリズムの最適化を検討してください。`
      });
    }
    
    if (summary.scalabilityAnalysis.timeComplexity.includes('O(n^2')) {
      recommendations.push({
        type: 'scalability',
        message: '時間複雑度がO(n^2)以上です。大規模データでの使用時は注意が必要です。'
      });
    }
    
    return recommendations;
  }
  
  /**
   * レポートを生成
   * @returns {string} フォーマットされたレポート
   */
  generateReport() {
    const summary = this.results.summary;
    
    return `
# Diversity Selector Stress Test Report

## Test Configuration
- Seed: ${this.options.seedValue}
- Max Candidates: ${this.options.maxCandidates}
- Test Cases: ${summary.totalIterations}
- Total Test Time: ${(summary.totalTestTime / 1000).toFixed(1)}s

## Performance Results
- Overall Success Rate: ${(summary.overallSuccessRate * 100).toFixed(2)}%
- Average Selection Time: ${summary.averageSelectionTime.toFixed(2)}ms
- Time Range: ${summary.minSelectionTime.toFixed(1)}ms - ${summary.maxSelectionTime.toFixed(1)}ms

## Scalability Analysis
- Time Complexity: ${summary.scalabilityAnalysis.timeComplexity}
- Max Candidates Processed: ${summary.scalabilityAnalysis.maxCandidatesProcessed}
- Throughput Range: ${summary.scalabilityAnalysis.throughputRange.min.toFixed(1)} - ${summary.scalabilityAnalysis.throughputRange.max.toFixed(1)} selections/sec

## Quality Metrics
- Average Diversity Score: ${summary.qualityMetrics.diversityQuality.avg.toFixed(3)}
- Perfect Selections: ${summary.qualityMetrics.selectionQuality.perfectSelections}
- Partial Selections: ${summary.qualityMetrics.selectionQuality.partialSelections}
- Failures: ${summary.qualityMetrics.selectionQuality.failures}

## Recommendations
${summary.recommendations.map(r => `- ${r.message}`).join('\n')}
`;
  }
}

// グローバルエクスポート
if (typeof window !== 'undefined') {
  window.EnhancedDiversitySelector = EnhancedDiversitySelector;
  window.DiversityStressTestRunner = DiversityStressTestRunner;
}

// ES6モジュールエクスポート
export { 
  EnhancedDiversitySelector,
  DiversityStressTestRunner
};

console.log('✅ Diversity Stress Test System v4.3.0 loaded');