// StatisticalEngine.js - 統計的信頼性エンジン
// HaQei Analyzer - Phase 5.1: 統計システム根本改革

class StatisticalEngine {
  constructor() {
    // 統計的妥当範囲の定義
    this.validRanges = {
      'engine': { min: 0.15, max: 0.85 },      // 15-85%
      'interface': { min: 0.10, max: 0.90 },   // 10-90%
      'safemode': { min: 0.05, max: 0.95 },    // 5-95%
      'general': { min: 0.20, max: 0.80 }      // 一般的な人格特性 20-80%
    };

    // 統計的信頼区間設定
    this.confidenceLevel = 0.95; // 95%信頼区間
    this.standardError = 0.05;   // 標準誤差 ±5%

    // 有効数字設定
    this.significantDigits = 1;  // 小数点以下1桁
    
    console.log("📊 StatisticalEngine initialized with confidence level:", this.confidenceLevel);
  }

  /**
   * スコアの統計的妥当性を検証
   * @param {number} score - 検証対象スコア
   * @param {string} systemType - システムタイプ
   * @returns {Object} 検証結果
   */
  validateScore(score, systemType = 'general') {
    const bounds = this.validRanges[systemType] || this.validRanges.general;
    
    const validation = {
      originalScore: score,
      isValid: true,
      correctedScore: score,
      confidence: this.confidenceLevel,
      boundaryType: 'normal',
      warnings: []
    };

    // NaN チェック
    if (isNaN(score) || score === null || score === undefined) {
      validation.isValid = false;
      validation.correctedScore = bounds.min + (bounds.max - bounds.min) * 0.5; // 中央値
      validation.warnings.push('Invalid score detected, using median value');
      validation.boundaryType = 'fallback';
      return validation;
    }

    // 異常値検出と修正
    if (score < bounds.min) {
      validation.isValid = false;
      validation.correctedScore = bounds.min;
      validation.warnings.push(`Score below minimum threshold (${(bounds.min * 100).toFixed(1)}%)`);
      validation.boundaryType = 'lower_bound';
    } else if (score > bounds.max) {
      validation.isValid = false;
      validation.correctedScore = bounds.max;
      validation.warnings.push(`Score above maximum threshold (${(bounds.max * 100).toFixed(1)}%)`);
      validation.boundaryType = 'upper_bound';
    }

    // 極端値の警告（統計的に稀な値）
    const range = bounds.max - bounds.min;
    const extremeThreshold = range * 0.05; // 上下5%を極端値とする
    
    if (score <= bounds.min + extremeThreshold) {
      validation.warnings.push('Score in extreme lower range');
    } else if (score >= bounds.max - extremeThreshold) {
      validation.warnings.push('Score in extreme upper range');
    }

    return validation;
  }

  /**
   * 複数スコアの一括検証
   * @param {Object} scores - スコア群
   * @param {string} systemType - システムタイプ
   * @returns {Object} 検証結果
   */
  validateScoreSet(scores, systemType = 'general') {
    const results = {
      validatedScores: {},
      overallValid: true,
      corrections: 0,
      warnings: [],
      statisticalSummary: null
    };

    Object.keys(scores).forEach(key => {
      const validation = this.validateScore(scores[key], systemType);
      results.validatedScores[key] = validation.correctedScore;
      
      if (!validation.isValid) {
        results.overallValid = false;
        results.corrections++;
        results.warnings.push(`${key}: ${validation.warnings.join(', ')}`);
      }
    });

    // 統計サマリーの生成
    results.statisticalSummary = this.generateStatisticalSummary(results.validatedScores);

    console.log(`📊 Score validation completed: ${results.corrections} corrections made`);
    return results;
  }

  /**
   * 統計サマリーの生成
   * @param {Object} scores - スコア群
   * @returns {Object} 統計サマリー
   */
  generateStatisticalSummary(scores) {
    const values = Object.values(scores).filter(v => !isNaN(v));
    
    if (values.length === 0) {
      return {
        mean: 0,
        median: 0,
        standardDeviation: 0,
        count: 0,
        range: { min: 0, max: 0 }
      };
    }

    const sorted = values.sort((a, b) => a - b);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);

    return {
      mean: this.formatStatisticalValue(mean),
      median: this.formatStatisticalValue(median),
      standardDeviation: this.formatStatisticalValue(standardDeviation),
      count: values.length,
      range: {
        min: this.formatStatisticalValue(sorted[0]),
        max: this.formatStatisticalValue(sorted[sorted.length - 1])
      }
    };
  }

  /**
   * 科学的数値フォーマット（小数点以下1桁、信頼区間付き）
   * @param {number} value - フォーマット対象値
   * @param {boolean} includeConfidenceInterval - 信頼区間を含めるか
   * @returns {string} フォーマットされた値
   */
  formatStatisticalValue(value, includeConfidenceInterval = false) {
    if (isNaN(value) || value === null || value === undefined) {
      return "0.0";
    }

    const formattedValue = Number(value).toFixed(this.significantDigits);
    
    if (includeConfidenceInterval) {
      const errorMargin = this.standardError;
      const lower = Math.max(0, value - errorMargin);
      const upper = Math.min(1, value + errorMargin);
      return `${formattedValue} (±${(errorMargin * 100).toFixed(1)}%)`;
    }

    return formattedValue;
  }

  /**
   * パーセンテージフォーマット（科学的表記）
   * @param {number} value - 0-1の値
   * @param {boolean} includeUncertainty - 不確実性を含めるか
   * @returns {string} フォーマットされたパーセンテージ
   */
  formatPercentage(value, includeUncertainty = false) {
    if (isNaN(value) || value === null || value === undefined) {
      return "0.0%";
    }

    const percentage = (value * 100).toFixed(this.significantDigits);
    
    if (includeUncertainty) {
      const uncertainty = (this.standardError * 100).toFixed(1);
      return `${percentage}% (±${uncertainty}%)`;
    }

    return `${percentage}%`;
  }

  /**
   * 算出方法の透明化レポート生成
   * @param {Object} calculationData - 計算データ
   * @returns {Object} 透明化レポート
   */
  generateTransparencyReport(calculationData) {
    return {
      methodology: {
        algorithm: "コサイン類似度 + 活性化スコア",
        weighting: "類似度70% + 活性化30%",
        normalization: "8次元ベクトル正規化",
        validationStandards: "統計的妥当範囲適用"
      },
      dataQuality: {
        sampleSize: calculationData.sampleSize || "不明",
        confidenceLevel: `${(this.confidenceLevel * 100).toFixed(0)}%`,
        standardError: `±${(this.standardError * 100).toFixed(1)}%`,
        significantDigits: this.significantDigits
      },
      validationResults: calculationData.validation || {},
      limitations: [
        "自己報告型回答に基づく分析",
        "文化的・個人的バイアスの可能性",
        "状況依存性の考慮制限",
        "長期的変化の追跡不可"
      ]
    };
  }

  /**
   * 信頼区間の計算
   * @param {number} value - 基準値
   * @param {number} sampleSize - サンプルサイズ
   * @returns {Object} 信頼区間
   */
  calculateConfidenceInterval(value, sampleSize = 100) {
    // サンプルサイズに基づく標準誤差の調整
    const adjustedError = this.standardError * Math.sqrt(100 / Math.max(sampleSize, 30));
    
    const margin = adjustedError * 1.96; // 95%信頼区間のz値
    
    return {
      lower: Math.max(0, value - margin),
      upper: Math.min(1, value + margin),
      margin: margin,
      confidence: this.confidenceLevel
    };
  }

  /**
   * 異常値検出アルゴリズム（IQR法）
   * @param {Array} values - 値の配列
   * @returns {Object} 異常値検出結果
   */
  detectOutliers(values) {
    if (!Array.isArray(values) || values.length < 4) {
      return { outliers: [], cleanedValues: values, method: 'insufficient_data' };
    }

    const sorted = values.filter(v => !isNaN(v)).sort((a, b) => a - b);
    const q1Index = Math.floor(sorted.length * 0.25);
    const q3Index = Math.floor(sorted.length * 0.75);
    
    const q1 = sorted[q1Index];
    const q3 = sorted[q3Index];
    const iqr = q3 - q1;
    
    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;
    
    const outliers = values.filter(v => v < lowerFence || v > upperFence);
    const cleanedValues = values.filter(v => v >= lowerFence && v <= upperFence);
    
    return {
      outliers: outliers,
      cleanedValues: cleanedValues,
      fences: { lower: lowerFence, upper: upperFence },
      quartiles: { q1, q3 },
      method: 'IQR'
    };
  }

  /**
   * 品質スコアの算出
   * @param {Object} validationResults - 検証結果
   * @returns {Object} 品質評価
   */
  assessDataQuality(validationResults) {
    const totalScores = Object.keys(validationResults.validatedScores).length;
    const corrections = validationResults.corrections;
    const qualityRatio = (totalScores - corrections) / totalScores;
    
    let qualityGrade, description;
    
    if (qualityRatio >= 0.95) {
      qualityGrade = 'A';
      description = '非常に高い統計的信頼性';
    } else if (qualityRatio >= 0.85) {
      qualityGrade = 'B';
      description = '高い統計的信頼性';
    } else if (qualityRatio >= 0.70) {
      qualityGrade = 'C';
      description = '中程度の統計的信頼性';
    } else if (qualityRatio >= 0.50) {
      qualityGrade = 'D';
      description = '限定的な統計的信頼性';
    } else {
      qualityGrade = 'F';
      description = '統計的信頼性に課題';
    }

    return {
      grade: qualityGrade,
      ratio: qualityRatio,
      description: description,
      recommendations: this.generateQualityRecommendations(qualityRatio)
    };
  }

  /**
   * 品質改善推奨事項の生成
   * @param {number} qualityRatio - 品質比率
   * @returns {Array} 推奨事項
   */
  generateQualityRecommendations(qualityRatio) {
    const recommendations = [];
    
    if (qualityRatio < 0.95) {
      recommendations.push("算出ロジックの精度向上");
    }
    
    if (qualityRatio < 0.85) {
      recommendations.push("入力データの品質チェック強化");
    }
    
    if (qualityRatio < 0.70) {
      recommendations.push("統計的妥当性基準の見直し");
    }
    
    if (qualityRatio < 0.50) {
      recommendations.push("計算アルゴリズムの根本的改善");
    }

    return recommendations;
  }
}

// グローバルスコープで利用可能にする
if (typeof window !== "undefined") {
  window.StatisticalEngine = StatisticalEngine;
}

// Node.js環境での利用
if (typeof module !== "undefined" && module.exports) {
  module.exports = StatisticalEngine;
}