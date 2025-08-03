/**
 * Statistical Engine - 統計的妥当性チェックエンジン
 * 
 * 目的：
 * - スコアの統計的妥当性を検証
 * - 異常値検出と修正
 * - データ品質評価
 */

export interface ValidationResult {
  isValid: boolean
  originalScore: number
  correctedScore: number
  warnings: string[]
  boundaryType: string
  confidence: number
}

export interface OutlierAnalysis {
  outliers: number[]
  cleanedValues: number[]
  method: string
}

export interface DataQualityAssessment {
  overall: string
  details: {
    validationRate: number
    correctionRate: number
    confidenceLevel: number
  }
}

export interface ValidRange {
  min: number
  max: number
  mean: number
  stdDev: number
}

export class StatisticalEngine {
  validRanges: { [systemType: string]: ValidRange } = {
    general: { min: 0.1, max: 0.9, mean: 0.5, stdDev: 0.2 },
    engine: { min: 0.15, max: 0.85, mean: 0.5, stdDev: 0.18 },
    interface: { min: 0.12, max: 0.88, mean: 0.5, stdDev: 0.19 },
    safeMode: { min: 0.08, max: 0.92, mean: 0.5, stdDev: 0.21 }
  }

  /**
   * スコアの妥当性を検証
   */
  validateScore(score: number, systemType: string = 'general'): ValidationResult {
    const range = this.validRanges[systemType] || this.validRanges.general
    const warnings: string[] = []
    let correctedScore = score
    let boundaryType = 'normal'
    
    // 範囲外チェック
    if (score < range.min) {
      warnings.push(`Score below minimum (${range.min})`)
      correctedScore = range.min
      boundaryType = 'lower'
    } else if (score > range.max) {
      warnings.push(`Score above maximum (${range.max})`)
      correctedScore = range.max
      boundaryType = 'upper'
    }
    
    // 極端な値のチェック
    const zScore = Math.abs((score - range.mean) / range.stdDev)
    if (zScore > 3) {
      warnings.push('Extreme value detected (>3σ)')
      // 3σを超える場合は、3σの範囲に収める
      if (score < range.mean) {
        correctedScore = Math.max(correctedScore, range.mean - 3 * range.stdDev)
      } else {
        correctedScore = Math.min(correctedScore, range.mean + 3 * range.stdDev)
      }
    }
    
    return {
      isValid: warnings.length === 0,
      originalScore: score,
      correctedScore: correctedScore,
      warnings: warnings,
      boundaryType: boundaryType,
      confidence: warnings.length === 0 ? 0.95 : 0.85
    }
  }

  /**
   * 異常値を検出
   */
  detectOutliers(values: number[]): OutlierAnalysis {
    if (values.length === 0) {
      return { outliers: [], cleanedValues: [], method: 'none' }
    }
    
    // IQR法による異常値検出
    const sorted = [...values].sort((a, b) => a - b)
    const q1Index = Math.floor(sorted.length * 0.25)
    const q3Index = Math.floor(sorted.length * 0.75)
    const q1 = sorted[q1Index]
    const q3 = sorted[q3Index]
    const iqr = q3 - q1
    
    const lowerBound = q1 - 1.5 * iqr
    const upperBound = q3 + 1.5 * iqr
    
    const outliers: number[] = []
    const cleanedValues: number[] = []
    
    values.forEach(value => {
      if (value < lowerBound || value > upperBound) {
        outliers.push(value)
      } else {
        cleanedValues.push(value)
      }
    })
    
    return {
      outliers: outliers,
      cleanedValues: cleanedValues,
      method: 'IQR'
    }
  }

  /**
   * データ品質を評価
   */
  assessDataQuality(data: {
    validatedScores: { [key: number]: number }
    corrections: number
  }): DataQualityAssessment {
    const scores = Object.values(data.validatedScores)
    const validationRate = scores.length > 0 ? 1 - (data.corrections / scores.length) : 0
    
    let overall = 'Good'
    if (validationRate < 0.7) overall = 'Poor'
    else if (validationRate < 0.9) overall = 'Fair'
    
    return {
      overall: overall,
      details: {
        validationRate: validationRate,
        correctionRate: data.corrections / scores.length,
        confidenceLevel: validationRate > 0.9 ? 0.95 : 0.85
      }
    }
  }

  /**
   * パーセンテージ形式でフォーマット
   */
  formatPercentage(score: number): string {
    return `${(score * 100).toFixed(1)}%`
  }

  /**
   * 透明性レポートを生成
   */
  generateTransparencyReport(data: any): any {
    return {
      statisticalValidation: {
        enabled: true,
        method: 'Range validation with outlier detection',
        sampleSize: data.sampleSize || 0,
        correctionRate: data.correctionRate || 0,
        confidenceLevel: 0.95
      },
      validationDetails: data.validation || {},
      timestamp: new Date().toISOString()
    }
  }
}

// Export composable function for Vue 3
export function useStatisticalEngine() {
  return new StatisticalEngine()
}