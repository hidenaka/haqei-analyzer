/**
 * 用九/用六実測監視システム
 * v4.3.0 - 理論値と実測値の継続的監視
 * 
 * @module YongProbabilityMonitor
 * @description 用九/用六の発生率を実測し、理論値との比較分析を行う
 */

import { SeedableRandom } from './SeedableRandom.js';

/**
 * 用九/用六確率計算器
 * @class
 */
class YongProbabilityCalculator {
  constructor() {
    this.version = '4.3.0';
  }
  
  /**
   * 理論的発生率の計算
   * @returns {Object} 理論値情報
   */
  calculateTheoreticalProbability() {
    // 前提条件
    const totalHexagrams = 64;
    const qualifyingHexagrams = 2;  // 乾、坤のみ
    const requiredChangedLines = 6;  // 全変
    
    // 1. 起点が乾または坤である確率
    const startProbability = qualifyingHexagrams / totalHexagrams;
    
    // 2. 6本すべてが変化する確率（コイン法の場合）
    // 各爻が動爻になる確率 = 1/4（老陽or老陰）
    // 6本すべてが動爻 = (1/4)^6
    const allChangesProbability = Math.pow(0.25, 6);
    
    // 3. 複合確率
    const yongProbability = startProbability * allChangesProbability;
    
    return {
      theoretical: yongProbability,
      percentage: (yongProbability * 100).toFixed(6) + '%',
      perMillion: Math.round(yongProbability * 1000000),
      description: 'コイン法での理論値',
      calculation: `(2/64) × (1/4)^6 = ${yongProbability.toExponential(6)}`,
      components: {
        startProbability,
        allChangesProbability,
        qualifyingHexagrams,
        totalHexagrams
      }
    };
  }
  
  /**
   * 実測値の記録と集計
   * @param {Array} telemetryData - テレメトリデータ配列
   * @returns {Object} 実測統計
   */
  measureActualProbability(telemetryData) {
    const totalGenerations = telemetryData.length;
    let yong9Count = 0;
    let yong6Count = 0;
    
    telemetryData.forEach(event => {
      if (event.overlay === '用九') yong9Count++;
      if (event.overlay === '用六') yong6Count++;
    });
    
    const combined = yong9Count + yong6Count;
    
    return {
      total: totalGenerations,
      yong9: {
        count: yong9Count,
        percentage: totalGenerations > 0 ? ((yong9Count / totalGenerations) * 100).toFixed(6) + '%' : '0%',
        perMillion: totalGenerations > 0 ? Math.round((yong9Count / totalGenerations) * 1000000) : 0
      },
      yong6: {
        count: yong6Count,
        percentage: totalGenerations > 0 ? ((yong6Count / totalGenerations) * 100).toFixed(6) + '%' : '0%',
        perMillion: totalGenerations > 0 ? Math.round((yong6Count / totalGenerations) * 1000000) : 0
      },
      combined: {
        count: combined,
        percentage: totalGenerations > 0 ? ((combined / totalGenerations) * 100).toFixed(6) + '%' : '0%',
        perMillion: totalGenerations > 0 ? Math.round((combined / totalGenerations) * 1000000) : 0
      }
    };
  }
  
  /**
   * 統計的有意性の検定
   * @param {Object} actual - 実測値
   * @param {Object} theoretical - 理論値
   * @returns {Object} 検定結果
   */
  performStatisticalTest(actual, theoretical) {
    const n = actual.total;
    const p = theoretical.theoretical;
    const observed = actual.combined.count;
    
    if (n < 100) {
      return {
        test: 'insufficient_data',
        pValue: null,
        significant: false,
        message: '統計的検定には最低100件のデータが必要'
      };
    }
    
    // 二項検定（正規近似）
    const expected = n * p;
    const variance = n * p * (1 - p);
    const standardError = Math.sqrt(variance);
    
    // 連続性補正を適用したZ統計量
    const correction = 0.5;
    const z = Math.abs(observed - expected - correction) / standardError;
    
    // 両側検定のp値（正規分布近似）
    const pValue = 2 * (1 - this.normalCDF(z));
    
    return {
      test: 'binomial_normal_approximation',
      observed,
      expected,
      zScore: z,
      pValue,
      significant: pValue < 0.05,
      confidence: pValue < 0.01 ? '99%' : pValue < 0.05 ? '95%' : 'none',
      message: pValue < 0.05 
        ? '理論値との有意な差が検出されました' 
        : '理論値との有意な差は検出されませんでした'
    };
  }
  
  /**
   * 標準正規分布の累積分布関数（近似）
   * @private
   */
  normalCDF(x) {
    // Abramowitz & Stegun近似
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.7814779 + t * (-1.8212560 + t * 1.3302744))));
    
    return x >= 0 ? 1 - prob : prob;
  }
  
  /**
   * 信頼区間の計算
   * @param {number} count - 観測回数
   * @param {number} total - 総試行回数
   * @param {number} confidence - 信頼度（0.95 = 95%）
   * @returns {Object} 信頼区間
   */
  calculateConfidenceInterval(count, total, confidence = 0.95) {
    if (total === 0) {
      return { lower: 0, upper: 0, width: 0 };
    }
    
    const p = count / total;
    const alpha = 1 - confidence;
    const z = this.getZScore(1 - alpha / 2);
    
    // Wilson区間（小さい確率に適している）
    const n = total;
    const center = (p + z * z / (2 * n)) / (1 + z * z / n);
    const width = z * Math.sqrt((p * (1 - p) + z * z / (4 * n)) / n) / (1 + z * z / n);
    
    return {
      lower: Math.max(0, center - width),
      upper: Math.min(1, center + width),
      width: 2 * width,
      center
    };
  }
  
  /**
   * Z値の取得（主要な信頼度のみ）
   * @private
   */
  getZScore(probability) {
    const zTable = {
      0.975: 1.96,  // 95%信頼区間
      0.995: 2.576, // 99%信頼区間
      0.999: 3.291  // 99.8%信頼区間
    };
    
    return zTable[probability] || 1.96;
  }
  
  /**
   * 文書用の表現を生成
   * @returns {Object} 文書用テキスト
   */
  getDocumentationText() {
    const theory = this.calculateTheoreticalProbability();
    
    return {
      technical: theory.calculation,
      userFacing: `極めて稀少（${theory.perMillion}回に1回程度）`,
      tooltip: `理論値: ${theory.percentage}`,
      category: 'legendary',
      rarity: theory.perMillion < 10 ? 'mythical' : theory.perMillion < 100 ? 'legendary' : 'rare'
    };
  }
}

/**
 * テレメトリ収集システム
 * @class
 */
class YongTelemetryCollector {
  constructor() {
    this.storageKey = 'haqei_yong_telemetry';
    this.maxEntries = 100000;  // 最大10万件
    this.version = '4.3.0';
  }
  
  /**
   * イベントを記録
   * @param {Object} event - 記録するイベント
   */
  recordEvent(event) {
    const timestamp = new Date().toISOString();
    const entry = {
      timestamp,
      version: this.version,
      ...event
    };
    
    try {
      const existing = this.loadData();
      existing.push(entry);
      
      // 最大件数制限
      if (existing.length > this.maxEntries) {
        existing.splice(0, existing.length - this.maxEntries);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(existing));
    } catch (error) {
      console.error('Failed to record telemetry:', error);
    }
  }
  
  /**
   * データを読み込み
   * @returns {Array} テレメトリデータ
   */
  loadData() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load telemetry:', error);
      return [];
    }
  }
  
  /**
   * データをクリア
   */
  clearData() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Failed to clear telemetry:', error);
    }
  }
  
  /**
   * データをエクスポート
   * @returns {Object} エクスポートデータ
   */
  exportData() {
    const data = this.loadData();
    return {
      version: this.version,
      exportDate: new Date().toISOString(),
      totalEntries: data.length,
      data
    };
  }
  
  /**
   * 統計情報を取得
   * @returns {Object} 統計情報
   */
  getStatistics() {
    const data = this.loadData();
    
    if (data.length === 0) {
      return {
        total: 0,
        yong9: 0,
        yong6: 0,
        combined: 0,
        dateRange: null
      };
    }
    
    const yong9Count = data.filter(d => d.overlay === '用九').length;
    const yong6Count = data.filter(d => d.overlay === '用六').length;
    
    const dates = data.map(d => new Date(d.timestamp)).sort();
    
    return {
      total: data.length,
      yong9: yong9Count,
      yong6: yong6Count,
      combined: yong9Count + yong6Count,
      dateRange: {
        start: dates[0].toISOString(),
        end: dates[dates.length - 1].toISOString()
      }
    };
  }
}

/**
 * リアルタイム監視システム
 * @class
 */
class YongRealTimeMonitor {
  constructor() {
    this.calculator = new YongProbabilityCalculator();
    this.collector = new YongTelemetryCollector();
    this.alertThresholds = {
      minSamples: 1000,      // 最小サンプル数
      maxDeviation: 5.0,     // 理論値からの最大乖離（標準偏差の倍数）
      significanceLevel: 0.01 // 統計的有意水準
    };
    this.callbacks = new Set();
  }
  
  /**
   * イベントリスナーを追加
   * @param {Function} callback - コールバック関数
   */
  addCallback(callback) {
    this.callbacks.add(callback);
  }
  
  /**
   * イベントリスナーを削除
   * @param {Function} callback - コールバック関数
   */
  removeCallback(callback) {
    this.callbacks.delete(callback);
  }
  
  /**
   * 全リスナーに通知
   * @private
   */
  notifyCallbacks(data) {
    this.callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Monitor callback error:', error);
      }
    });
  }
  
  /**
   * イベントを記録し分析
   * @param {Object} event - 記録するイベント
   */
  recordAndAnalyze(event) {
    // 記録
    this.collector.recordEvent(event);
    
    // 分析
    const analysis = this.performAnalysis();
    
    // 通知
    this.notifyCallbacks({
      type: 'analysis_update',
      event,
      analysis,
      timestamp: new Date().toISOString()
    });
    
    // アラートチェック
    if (analysis.alert) {
      this.notifyCallbacks({
        type: 'alert',
        alert: analysis.alert,
        analysis,
        timestamp: new Date().toISOString()
      });
    }
    
    return analysis;
  }
  
  /**
   * 現在の分析を実行
   * @returns {Object} 分析結果
   */
  performAnalysis() {
    const data = this.collector.loadData();
    const theoretical = this.calculator.calculateTheoreticalProbability();
    const actual = this.calculator.measureActualProbability(data);
    const statistical = this.calculator.performStatisticalTest(actual, theoretical);
    
    // 信頼区間
    const confidence = this.calculator.calculateConfidenceInterval(
      actual.combined.count, 
      actual.total, 
      0.95
    );
    
    // アラートチェック
    let alert = null;
    
    if (actual.total >= this.alertThresholds.minSamples) {
      if (statistical.significant && statistical.pValue < this.alertThresholds.significanceLevel) {
        alert = {
          type: 'statistical_anomaly',
          severity: 'high',
          message: `用九/用六の発生率が理論値から有意に乖離しています (p=${statistical.pValue.toFixed(6)})`,
          recommendation: '乱数生成器の動作を確認してください'
        };
      } else if (Math.abs(statistical.zScore) > this.alertThresholds.maxDeviation) {
        alert = {
          type: 'high_deviation',
          severity: 'medium',
          message: `用九/用六の発生率が理論値から大きく乖離しています (Z=${statistical.zScore.toFixed(2)})`,
          recommendation: 'データの蓄積を継続してください'
        };
      }
    }
    
    return {
      theoretical,
      actual,
      statistical,
      confidence,
      alert,
      timestamp: new Date().toISOString(),
      status: alert ? 'warning' : 'normal'
    };
  }
  
  /**
   * 監視レポートを生成
   * @returns {Object} 監視レポート
   */
  generateReport() {
    const analysis = this.performAnalysis();
    const stats = this.collector.getStatistics();
    
    return {
      summary: {
        totalSamples: stats.total,
        yong9Occurrences: stats.yong9,
        yong6Occurrences: stats.yong6,
        combinedOccurrences: stats.combined,
        dateRange: stats.dateRange,
        status: analysis.status
      },
      theoretical: analysis.theoretical,
      actual: analysis.actual,
      statistical: analysis.statistical,
      confidence: analysis.confidence,
      alerts: analysis.alert ? [analysis.alert] : [],
      recommendations: this.generateRecommendations(analysis),
      generatedAt: new Date().toISOString()
    };
  }
  
  /**
   * 推奨事項を生成
   * @private
   */
  generateRecommendations(analysis) {
    const recommendations = [];
    
    if (analysis.actual.total < 1000) {
      recommendations.push({
        type: 'data_collection',
        message: 'より正確な分析のため、1000件以上のデータ収集を推奨します'
      });
    }
    
    if (analysis.alert) {
      recommendations.push({
        type: 'investigation',
        message: 'アラートが発生しています。システムの動作を確認してください'
      });
    } else if (analysis.actual.total > 10000) {
      recommendations.push({
        type: 'monitoring',
        message: '十分なデータが蓄積されました。継続的な監視を推奨します'
      });
    }
    
    return recommendations;
  }
}

// グローバルエクスポート
if (typeof window !== 'undefined') {
  window.YongProbabilityCalculator = YongProbabilityCalculator;
  window.YongTelemetryCollector = YongTelemetryCollector;
  window.YongRealTimeMonitor = YongRealTimeMonitor;
}

// グローバル公開済み

console.log('✅ Yong Probability Monitor v4.3.0 loaded');