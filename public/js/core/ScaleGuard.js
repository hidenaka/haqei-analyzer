/**
 * Explainability Scale Unification Guard
 * v4.3.1 - 寄与度計算で必ずスケール済み値のみを受け付ける
 * 
 * 監査強化：0-1正規化の一貫性を物理的に保証
 */

class ScaleGuard {
  constructor() {
    this.SCALE_MIN = 0.0;
    this.SCALE_MAX = 1.0;
    this.TOLERANCE = 1e-10;
  }

  /**
   * スケール済み値のみを受け付けるガード関数
   * @param {number} value - 検証対象の値
   * @param {string} context - エラー時のコンテキスト情報
   * @returns {number} 検証済みの値
   * @throws {ScaleViolationError} スケール範囲外の場合
   */
  enforceScaled(value, context = 'unknown') {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new ScaleViolationError(
        `Non-numeric value in ${context}: ${value}`,
        { value, context, expected: '[0, 1]' }
      );
    }

    if (value < this.SCALE_MIN - this.TOLERANCE || value > this.SCALE_MAX + this.TOLERANCE) {
      throw new ScaleViolationError(
        `Value outside [0, 1] range in ${context}: ${value}`,
        { value, context, range: [this.SCALE_MIN, this.SCALE_MAX] }
      );
    }

    // Clamp to exact bounds (handle floating point precision)
    return Math.max(this.SCALE_MIN, Math.min(this.SCALE_MAX, value));
  }

  /**
   * 配列全体のスケール統一チェック
   * @param {number[]} values - 検証対象の配列
   * @param {string} context - エラー時のコンテキスト情報
   * @returns {number[]} 検証済みの配列
   */
  enforceScaledArray(values, context = 'unknown') {
    if (!Array.isArray(values)) {
      throw new ScaleViolationError(
        `Expected array in ${context}, got ${typeof values}`,
        { values, context }
      );
    }

    return values.map((value, index) => 
      this.enforceScaled(value, `${context}[${index}]`)
    );
  }

  /**
   * 寄与度オブジェクトのスケール統一
   * @param {Object} contributions - 寄与度オブジェクト
   * @param {string} context - エラー時のコンテキスト情報
   * @returns {Object} 検証済みの寄与度オブジェクト
   */
  enforceContributions(contributions, context = 'contributions') {
    if (!contributions || typeof contributions !== 'object') {
      throw new ScaleViolationError(
        `Invalid contributions object in ${context}`,
        { contributions, context }
      );
    }

    const scaled = {};
    for (const [key, value] of Object.entries(contributions)) {
      scaled[key] = this.enforceScaled(value, `${context}.${key}`);
    }

    // 寄与度の合計チェック（必須）
    const sum = Object.values(scaled).reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 1.0) > this.TOLERANCE) {
      throw new ScaleViolationError(
        `Contributions do not sum to 1.0 in ${context}: ${sum}`,
        { contributions: scaled, sum, context }
      );
    }

    return scaled;
  }

  /**
   * 自動スケーリング（デバッグ用、本番では使用禁止）
   * @param {number[]} values - 元の値配列
   * @param {string} context - コンテキスト情報
   * @returns {number[]} 0-1スケールされた配列
   */
  autoScale(values, context = 'unknown') {
    console.warn(`⚠️ Auto-scaling used in ${context} - should be pre-scaled in production`);
    
    if (!Array.isArray(values) || values.length === 0) {
      return [];
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;

    if (range === 0) {
      return values.map(() => 0.5); // Equal distribution
    }

    return values.map(v => (v - min) / range);
  }
}

/**
 * スケール違反専用エラークラス
 */
class ScaleViolationError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ScaleViolationError';
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

// シングルトンインスタンス
const scaleGuard = new ScaleGuard();

/**
 * 便利関数：寄与度計算の入り口で必ずスケールチェック
 * @param {Object} rawContributions - 生の寄与度
 * @param {string} source - 計算元の識別子
 * @returns {Object} 検証済み寄与度
 */
function guaranteeScaledContributions(rawContributions, source = 'unknown') {
  return scaleGuard.enforceContributions(rawContributions, `explainability.${source}`);
}

/**
 * デバッグ用：現在の値がスケール済みかチェック
 * @param {any} value - チェック対象
 * @returns {boolean} スケール済みかどうか
 */
function isScaled(value) {
  try {
    scaleGuard.enforceScaled(value);
    return true;
  } catch (error) {
    return false;
  }
}

// グローバル公開
window.ScaleGuard = ScaleGuard;
window.ScaleViolationError = ScaleViolationError;
window.scaleGuard = scaleGuard;
window.guaranteeScaledContributions = guaranteeScaledContributions;
window.isScaled = isScaled;