// ScientificFormatter.js - 科学的数値表記ユーティリティ
// HaQei Analyzer - Phase 5.1: 数値表記科学化

class ScientificFormatter {
  constructor() {
    // 科学的表記の設定
    this.settings = {
      decimalPlaces: 1,           // 小数点以下1桁
      confidenceLevel: 0.95,      // 95%信頼区間
      standardError: 0.05,        // ±5%の標準誤差
      showUncertainty: false,     // デフォルトは不確実性非表示
      useScientificNotation: false, // 科学的記数法は通常使用しない
      minForScientific: 0.001,    // この値以下で科学的記数法
      maxForScientific: 1000      // この値以上で科学的記数法
    };

    console.log("🔬 ScientificFormatter initialized");
  }

  /**
   * スコアを科学的にフォーマット
   * @param {number} score - フォーマット対象スコア (0-1)
   * @param {Object} options - フォーマットオプション
   * @returns {string} フォーマットされたスコア
   */
  formatScore(score, options = {}) {
    const opts = { ...this.settings, ...options };
    
    // 無効値のハンドリング
    if (this.isInvalidNumber(score)) {
      return "0.0";
    }

    // 範囲チェック（0-1）
    const clampedScore = Math.max(0, Math.min(1, score));
    
    if (clampedScore !== score) {
      console.warn(`⚠️ Score clamped: ${score} → ${clampedScore}`);
    }

    // 基本フォーマット
    const formatted = clampedScore.toFixed(opts.decimalPlaces);
    
    // 不確実性表示
    if (opts.showUncertainty) {
      const uncertainty = (opts.standardError).toFixed(opts.decimalPlaces);
      return `${formatted} (±${uncertainty})`;
    }

    return formatted;
  }

  /**
   * パーセンテージを科学的にフォーマット
   * @param {number} value - フォーマット対象値 (0-1)
   * @param {Object} options - フォーマットオプション
   * @returns {string} フォーマットされたパーセンテージ
   */
  formatPercentage(value, options = {}) {
    const opts = { ...this.settings, ...options };
    
    // 無効値のハンドリング
    if (this.isInvalidNumber(value)) {
      return "0.0%";
    }

    // 範囲チェック（0-1）
    const clampedValue = Math.max(0, Math.min(1, value));
    const percentage = clampedValue * 100;
    
    // 基本フォーマット
    const formatted = percentage.toFixed(opts.decimalPlaces);
    
    // 不確実性表示
    if (opts.showUncertainty) {
      const uncertaintyPercent = (opts.standardError * 100).toFixed(opts.decimalPlaces);
      return `${formatted}% (±${uncertaintyPercent}%)`;
    }

    return `${formatted}%`;
  }

  /**
   * 信頼区間付きフォーマット
   * @param {number} value - 中央値
   * @param {number} margin - 誤差範囲
   * @param {Object} options - フォーマットオプション
   * @returns {string} 信頼区間付きの値
   */
  formatWithConfidenceInterval(value, margin = null, options = {}) {
    const opts = { ...this.settings, ...options };
    
    if (this.isInvalidNumber(value)) {
      return "0.0 (信頼区間算出不可)";
    }

    const actualMargin = margin || opts.standardError;
    const lower = Math.max(0, value - actualMargin);
    const upper = Math.min(1, value + actualMargin);
    
    const valueStr = value.toFixed(opts.decimalPlaces);
    const lowerStr = lower.toFixed(opts.decimalPlaces);
    const upperStr = upper.toFixed(opts.decimalPlaces);
    
    return `${valueStr} (95%CI: ${lowerStr}-${upperStr})`;
  }

  /**
   * 統計サマリーをフォーマット
   * @param {Object} stats - 統計データ
   * @param {Object} options - フォーマットオプション
   * @returns {Object} フォーマットされた統計データ
   */
  formatStatistics(stats, options = {}) {
    const opts = { ...this.settings, ...options };
    
    return {
      mean: this.formatScore(stats.mean, opts),
      median: this.formatScore(stats.median, opts),
      standardDeviation: this.formatScore(stats.standardDeviation, opts),
      range: {
        min: this.formatScore(stats.range?.min, opts),
        max: this.formatScore(stats.range?.max, opts)
      },
      count: stats.count,
      formatted: true
    };
  }

  /**
   * 品質グレードの視覚的表示
   * @param {string} grade - 品質グレード (A-F)
   * @param {number} ratio - 品質比率
   * @returns {Object} 視覚的品質表示
   */
  formatQualityGrade(grade, ratio) {
    const colors = {
      'A': '#10B981', // green-500
      'B': '#059669', // green-600
      'C': '#F59E0B', // amber-500
      'D': '#F97316', // orange-500
      'F': '#EF4444'  // red-500
    };

    const icons = {
      'A': '🏆',
      'B': '✅',
      'C': '⚠️',
      'D': '❌',
      'F': '🚨'
    };

    return {
      grade: grade,
      ratio: this.formatPercentage(ratio),
      color: colors[grade] || colors['F'],
      icon: icons[grade] || icons['F'],
      display: `${icons[grade]} ${grade}級 (${this.formatPercentage(ratio)})`
    };
  }

  /**
   * 数値の妥当性チェック
   * @param {any} value - チェック対象値
   * @returns {boolean} 有効な数値かどうか
   */
  isInvalidNumber(value) {
    return value === null || 
           value === undefined || 
           isNaN(value) || 
           !isFinite(value);
  }

  /**
   * 科学的記数法が必要かチェック
   * @param {number} value - チェック対象値
   * @returns {boolean} 科学的記数法が必要か
   */
  needsScientificNotation(value) {
    if (this.isInvalidNumber(value)) return false;
    
    const absValue = Math.abs(value);
    return absValue < this.settings.minForScientific || 
           absValue > this.settings.maxForScientific;
  }

  /**
   * 科学的記数法でフォーマット
   * @param {number} value - フォーマット対象値
   * @param {number} precision - 精度
   * @returns {string} 科学的記数法の値
   */
  toScientificNotation(value, precision = 2) {
    if (this.isInvalidNumber(value)) {
      return "0.0 × 10⁰";
    }

    return value.toExponential(precision);
  }

  /**
   * 相対誤差の計算とフォーマット
   * @param {number} measured - 測定値
   * @param {number} actual - 実際値
   * @returns {string} 相対誤差
   */
  formatRelativeError(measured, actual) {
    if (this.isInvalidNumber(measured) || this.isInvalidNumber(actual) || actual === 0) {
      return "算出不可";
    }

    const relativeError = Math.abs((measured - actual) / actual);
    return this.formatPercentage(relativeError);
  }

  /**
   * 有効数字の調整
   * @param {number} value - 調整対象値
   * @param {number} significantFigures - 有効数字数
   * @returns {string} 有効数字調整後の値
   */
  toSignificantFigures(value, significantFigures = 3) {
    if (this.isInvalidNumber(value)) {
      return "0";
    }

    if (value === 0) {
      return "0";
    }

    const magnitude = Math.floor(Math.log10(Math.abs(value)));
    const factor = Math.pow(10, significantFigures - magnitude - 1);
    const rounded = Math.round(value * factor) / factor;
    
    return rounded.toString();
  }

  /**
   * デバッグ用：詳細な数値情報の表示
   * @param {number} value - 調査対象値
   * @returns {Object} 詳細情報
   */
  debugNumberInfo(value) {
    return {
      original: value,
      type: typeof value,
      isValid: !this.isInvalidNumber(value),
      isFinite: isFinite(value),
      isNaN: isNaN(value),
      formatted: this.formatScore(value),
      percentage: this.formatPercentage(value),
      scientific: this.needsScientificNotation(value) ? 
                  this.toScientificNotation(value) : 
                  "標準記法で十分",
      significantFigures: this.toSignificantFigures(value)
    };
  }
}

// グローバルスコープで利用可能にする
if (typeof window !== "undefined") {
  window.ScientificFormatter = ScientificFormatter;
}

// Node.js環境での利用
if (typeof module !== "undefined" && module.exports) {
  module.exports = ScientificFormatter;
}