// DiagnosisDataFormat.js - 診断データフォーマット処理システム
// HAQEI HaQei哲学：データの陰陽調和による統合処理

/**
 * 診断データフォーマット処理クラス
 */
class DiagnosisDataFormat {
  constructor() {
    
    // v4.3.1 決定論的要件: SeedableRandom統合
    this.rng = options.randomnessManager || window.randomnessManager || 
               (() => { throw new Error('RandomnessManager required for deterministic behavior'); });
    this.formatVersion = '1.0.0';
    this.dataTypes = {
      QUICK: 'quick_analysis',
      OS: 'os_analysis', 
      FUTURE: 'future_simulation'
    };
  }

  /**
   * データフォーマット検証
   * @param {Object} data - 検証対象データ
   * @returns {Object} 検証結果
   */
  validateFormat(data) {
    try {
      if (!data || typeof data !== 'object') {
        return { valid: false, error: 'Invalid data object' };
      }

      return { valid: true, data: data };
    } catch (error) {
      console.error('🔍 Format validation error:', error);
      return { valid: false, error: error.message };
    }
  }

  /**
   * 診断結果をフォーマット
   * @param {Object} rawData - 生データ
   * @param {string} type - データタイプ
   * @returns {Object} フォーマット済みデータ
   */
  formatDiagnosis(rawData, type = 'QUICK') {
    try {
      const formatted = {
        id: this.generateId(),
        type: this.dataTypes[type] || this.dataTypes.QUICK,
        timestamp: new Date().toISOString(),
        version: this.formatVersion,
        data: rawData
      };

      return this.validateFormat(formatted);
    } catch (error) {
      console.error('🔍 Format error:', error);
      return { valid: false, error: error.message };
    }
  }

  /**
   * ユニークID生成
   * @returns {string} ユニークID
   */
  generateId() {
    return `haqei_${Date.now()}_${this.rng.next().toString(36).substr(2, 9)}`;
  }
}

// グローバル公開
if (typeof window !== 'undefined') {
  window.DiagnosisDataFormat = DiagnosisDataFormat;
}