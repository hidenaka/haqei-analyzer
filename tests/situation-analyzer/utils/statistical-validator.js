/**
 * 統計的検証ユーティリティ
 * 
 * TDDテストケースでの統計的検証、品質メトリクス計算
 * アーキタイプ分布、卦多様性、信頼度精度などの統計分析
 */

class StatisticalValidator {
  
  /**
   * アーキタイプ分布計算
   */
  static calculateArchetypeDistribution(results) {
    const distribution = {
      creation: 0,
      development: 0,
      transformation: 0,
      maturity: 0
    };
    
    const total = results.length;
    
    results.forEach(result => {
      const archetype = result.actualArchetype || result.situation?.archetype?.primary || result.archetype;
      if (Object.prototype.hasOwnProperty.call(distribution, archetype)) {
        distribution[archetype]++;
      }
    });
    
    // 比率に変換
    Object.keys(distribution).forEach(key => {
      distribution[key] = distribution[key] / total;
    });
    
    return distribution;
  }

  /**
   * 卦使用頻度計算
   */
  static calculateHexagramUsage(results) {
    const usage = {};
    
    results.forEach(result => {
      const hexagram = result.primaryHexagram || 
                      result.iching?.hexagram?.number || 
                      result.primary?.hexagram;
      
      if (hexagram) {
        usage[hexagram] = (usage[hexagram] || 0) + 1;
      }
      
      // 代替卦も考慮
      const alternatives = result.alternatives || result.iching?.alternatives || [];
      alternatives.forEach(alt => {
        const altHexagram = alt.hexagram || alt.number;
        if (altHexagram) {
          usage[altHexagram] = (usage[altHexagram] || 0) + 0.3; // 重み付け
        }
      });
    });
    
    return usage;
  }

  /**
   * 卦使用頻度（主要卦のみ）
   */
  static calculateHexagramFrequency(hexagramArray) {
    const frequency = {};
    
    hexagramArray.forEach(hexagram => {
      frequency[hexagram] = (frequency[hexagram] || 0) + 1;
    });
    
    return frequency;
  }

  /**
   * Gini係数計算（不平等度測定）
   */
  static calculateGiniCoefficient(values) {
    if (values.length === 0) return 0;
    
    const sortedValues = [...values].sort((a, b) => a - b);
    const n = sortedValues.length;
    const mean = sortedValues.reduce((sum, val) => sum + val, 0) / n;
    
    if (mean === 0) return 0;
    
    let numerator = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        numerator += Math.abs(sortedValues[i] - sortedValues[j]);
      }
    }
    
    return numerator / (2 * n * n * mean);
  }

  /**
   * カイ二乗検定
   */
  static chiSquareTest(observed, expected = null) {
    const values = Object.values(observed);
    const total = values.reduce((sum, val) => sum + val, 0);
    
    // 期待値が指定されていない場合は均等分布を仮定
    const expectedValue = expected || (total / values.length);
    const expectedValues = Array(values.length).fill(expectedValue);
    
    let chiSquare = 0;
    for (let i = 0; i < values.length; i++) {
      const observed_i = values[i] * total; // 実際の頻度
      const expected_i = expectedValues[i] * total; // 期待される頻度
      
      if (expected_i > 0) {
        chiSquare += Math.pow(observed_i - expected_i, 2) / expected_i;
      }
    }
    
    // 自由度
    const degreesOfFreedom = values.length - 1;
    
    // p値の近似計算（簡易版）
    const pValue = this.chiSquarePValue(chiSquare, degreesOfFreedom);
    
    return {
      chiSquare: chiSquare,
      degreesOfFreedom: degreesOfFreedom,
      pValue: pValue,
      isSignificant: pValue < 0.05
    };
  }

  /**
   * カイ二乗分布のp値近似計算
   */
  static chiSquarePValue(chiSquare, df) {
    // 簡易近似（正確な計算にはより複雑な実装が必要）
    if (df === 1) {
      if (chiSquare < 0.455) return 0.5;
      if (chiSquare < 2.706) return 0.1;
      if (chiSquare < 3.841) return 0.05;
      if (chiSquare < 6.635) return 0.01;
      return 0.001;
    } else if (df === 3) {
      if (chiSquare < 2.366) return 0.5;
      if (chiSquare < 6.251) return 0.1;
      if (chiSquare < 7.815) return 0.05;
      if (chiSquare < 11.345) return 0.01;
      return 0.001;
    }
    
    // その他の自由度は簡易近似
    const criticalValue = df + 2 * Math.sqrt(df); // 5%水準の近似
    return chiSquare > criticalValue ? 0.01 : 0.1;
  }

  /**
   * 相関係数計算
   */
  static calculateCorrelation(x, y) {
    if (x.length !== y.length || x.length === 0) return 0;
    
    const n = x.length;
    const meanX = x.reduce((sum, val) => sum + val, 0) / n;
    const meanY = y.reduce((sum, val) => sum + val, 0) / n;
    
    let numerator = 0;
    let sumXSquared = 0;
    let sumYSquared = 0;
    
    for (let i = 0; i < n; i++) {
      const deltaX = x[i] - meanX;
      const deltaY = y[i] - meanY;
      
      numerator += deltaX * deltaY;
      sumXSquared += deltaX * deltaX;
      sumYSquared += deltaY * deltaY;
    }
    
    const denominator = Math.sqrt(sumXSquared * sumYSquared);
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  /**
   * 標準偏差計算
   */
  static calculateStandardDeviation(values) {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDifferences = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDifferences.reduce((sum, val) => sum + val, 0) / values.length;
    
    return Math.sqrt(variance);
  }

  /**
   * 信頼区間計算
   */
  static calculateConfidenceInterval(values, confidenceLevel = 0.95) {
    if (values.length === 0) return { lower: 0, upper: 0, mean: 0 };
    
    const sortedValues = [...values].sort((a, b) => a - b);
    const mean = sortedValues.reduce((sum, val) => sum + val, 0) / sortedValues.length;
    const std = this.calculateStandardDeviation(sortedValues);
    
    // t分布の近似（大標本の場合）
    const alpha = 1 - confidenceLevel;
    const tValue = 1.96; // 95%信頼区間の場合（正規分布近似）
    
    const marginOfError = tValue * (std / Math.sqrt(sortedValues.length));
    
    return {
      mean: mean,
      lower: mean - marginOfError,
      upper: mean + marginOfError,
      marginOfError: marginOfError
    };
  }

  /**
   * 品質メトリクス計算
   */
  static calculateQualityMetrics(results) {
    const metrics = {};
    
    // アーキタイプバランス品質
    const archetypeDistribution = this.calculateArchetypeDistribution(results);
    metrics.archetypeBalance = {
      distribution: archetypeDistribution,
      giniCoefficient: this.calculateGiniCoefficient(Object.values(archetypeDistribution)),
      isBalanced: this.isArchetypeBalanced(archetypeDistribution)
    };
    
    // 卦多様性品質
    const hexagramUsage = this.calculateHexagramUsage(results);
    const usageValues = Object.values(hexagramUsage);
    const sortedUsage = usageValues.sort((a, b) => b - a);
    
    metrics.hexagramDiversity = {
      totalHexagrams: Object.keys(hexagramUsage).length,
      unusedCount: 64 - Object.keys(hexagramUsage).length,
      top10Share: sortedUsage.slice(0, 10).reduce((sum, val) => sum + val, 0) / results.length,
      giniCoefficient: this.calculateGiniCoefficient(usageValues),
      diversityIndex: this.calculateDiversityIndex(hexagramUsage)
    };
    
    // 透明性品質
    const transparencyScores = results
      .map(r => r.situation?.confidence?.readabilityScore || r.confidence?.readabilityScore)
      .filter(score => score !== undefined);
    
    metrics.transparency = {
      userUnderstanding: transparencyScores.length > 0 ? 
        transparencyScores.reduce((sum, score) => sum + score, 0) / transparencyScores.length : 0,
      hasExplanation: results.filter(r => 
        r.situation?.confidence?.explanation || r.confidence?.explanation
      ).length / results.length
    };
    
    // 信頼性品質
    const accuracyScores = results
      .map(r => r.expectedArchetype === (r.situation?.archetype?.primary || r.archetype) ? 1 : 0);
    
    metrics.reliability = {
      accuracy: accuracyScores.reduce((sum, score) => sum + score, 0) / accuracyScores.length,
      confidenceCorrelation: this.calculateConfidenceAccuracyCorrelation(results)
    };
    
    // ユーザー満足度
    const satisfactionScores = results
      .map(r => r.userSatisfactionScore)
      .filter(score => score !== undefined);
    
    metrics.userSatisfaction = {
      overall: satisfactionScores.length > 0 ? 
        satisfactionScores.reduce((sum, score) => sum + score, 0) / satisfactionScores.length : 0,
      confidenceInterval: this.calculateConfidenceInterval(satisfactionScores)
    };
    
    return metrics;
  }

  /**
   * アーキタイプバランス判定
   */
  static isArchetypeBalanced(distribution, tolerance = 0.1) {
    const expected = 0.25; // 25%期待値
    
    return Object.values(distribution).every(value => 
      Math.abs(value - expected) <= tolerance
    );
  }

  /**
   * 多様性インデックス計算（シャノン多様性指数）
   */
  static calculateDiversityIndex(usage) {
    const total = Object.values(usage).reduce((sum, val) => sum + val, 0);
    
    if (total === 0) return 0;
    
    let diversity = 0;
    Object.values(usage).forEach(count => {
      if (count > 0) {
        const proportion = count / total;
        diversity -= proportion * Math.log2(proportion);
      }
    });
    
    return diversity;
  }

  /**
   * 信頼度と精度の相関計算
   */
  static calculateConfidenceAccuracyCorrelation(results) {
    const confidenceValues = [];
    const accuracyValues = [];
    
    results.forEach(result => {
      const confidence = result.situation?.confidence?.value || 
                        result.confidence?.value || 
                        result.confidence || 0;
      const accuracy = result.expectedArchetype === 
                      (result.situation?.archetype?.primary || result.archetype) ? 1 : 0;
      
      confidenceValues.push(confidence);
      accuracyValues.push(accuracy);
    });
    
    return this.calculateCorrelation(confidenceValues, accuracyValues);
  }

  /**
   * 総合品質グレード計算
   */
  static calculateOverallGrade(metrics) {
    const scores = [];
    
    // アーキタイプバランス（25%）
    const balanceScore = metrics.archetypeBalance.giniCoefficient < 0.3 ? 1 : 
                        metrics.archetypeBalance.giniCoefficient < 0.5 ? 0.7 : 0.4;
    scores.push({ score: balanceScore, weight: 0.25 });
    
    // 卦多様性（25%）
    const diversityScore = metrics.hexagramDiversity.unusedCount === 0 ? 1 :
                          metrics.hexagramDiversity.unusedCount < 10 ? 0.8 :
                          metrics.hexagramDiversity.unusedCount < 20 ? 0.6 : 0.3;
    scores.push({ score: diversityScore, weight: 0.25 });
    
    // 透明性（20%）
    const transparencyScore = metrics.transparency.userUnderstanding >= 4.0 ? 1 :
                             metrics.transparency.userUnderstanding >= 3.5 ? 0.8 :
                             metrics.transparency.userUnderstanding >= 3.0 ? 0.6 : 0.4;
    scores.push({ score: transparencyScore, weight: 0.20 });
    
    // 信頼性（20%）
    const reliabilityScore = metrics.reliability.accuracy >= 0.8 ? 1 :
                            metrics.reliability.accuracy >= 0.7 ? 0.8 :
                            metrics.reliability.accuracy >= 0.6 ? 0.6 : 0.4;
    scores.push({ score: reliabilityScore, weight: 0.20 });
    
    // ユーザー満足度（10%）
    const satisfactionScore = metrics.userSatisfaction.overall >= 4.0 ? 1 :
                             metrics.userSatisfaction.overall >= 3.5 ? 0.8 :
                             metrics.userSatisfaction.overall >= 3.0 ? 0.6 : 0.4;
    scores.push({ score: satisfactionScore, weight: 0.10 });
    
    // 重み付け平均計算
    const totalScore = scores.reduce((sum, item) => sum + (item.score * item.weight), 0);
    
    // グレード判定
    if (totalScore >= 0.9) return 'A';
    if (totalScore >= 0.8) return 'B';
    if (totalScore >= 0.7) return 'C';
    if (totalScore >= 0.6) return 'D';
    return 'F';
  }

  /**
   * 統計的有意性テスト
   */
  static performSignificanceTests(beforeResults, afterResults) {
    const tests = {};
    
    // アーキタイプ分布の改善テスト
    const beforeDistribution = this.calculateArchetypeDistribution(beforeResults);
    const afterDistribution = this.calculateArchetypeDistribution(afterResults);
    
    tests.archetypeImprovement = {
      before: this.calculateGiniCoefficient(Object.values(beforeDistribution)),
      after: this.calculateGiniCoefficient(Object.values(afterDistribution)),
      improvementPercentage: null
    };
    
    tests.archetypeImprovement.improvementPercentage = 
      ((tests.archetypeImprovement.before - tests.archetypeImprovement.after) / 
       tests.archetypeImprovement.before) * 100;
    
    // 多様性改善テスト
    const beforeUsage = this.calculateHexagramUsage(beforeResults);
    const afterUsage = this.calculateHexagramUsage(afterResults);
    
    tests.diversityImprovement = {
      beforeUnused: 64 - Object.keys(beforeUsage).length,
      afterUnused: 64 - Object.keys(afterUsage).length,
      improvementCount: null
    };
    
    tests.diversityImprovement.improvementCount = 
      tests.diversityImprovement.beforeUnused - tests.diversityImprovement.afterUnused;
    
    return tests;
  }

  /**
   * レポート生成
   */
  static generateQualityReport(metrics, tests = null) {
    const report = {
      timestamp: new Date().toISOString(),
      overallGrade: this.calculateOverallGrade(metrics),
      summary: {
        archetypeBalance: metrics.archetypeBalance.isBalanced,
        hexagramDiversity: metrics.hexagramDiversity.unusedCount === 0,
        transparency: metrics.transparency.userUnderstanding >= 4.0,
        reliability: metrics.reliability.accuracy >= 0.8,
        userSatisfaction: metrics.userSatisfaction.overall >= 4.0
      },
      detailedMetrics: metrics,
      recommendations: this.generateRecommendations(metrics)
    };
    
    if (tests) {
      report.improvementTests = tests;
    }
    
    return report;
  }

  /**
   * 改善推奨事項生成
   */
  static generateRecommendations(metrics) {
    const recommendations = [];
    
    if (metrics.archetypeBalance.giniCoefficient > 0.3) {
      recommendations.push({
        priority: 'high',
        category: 'archetype_balance',
        issue: 'アーキタイプ分布の偏り',
        suggestion: 'temporal指標の重み調整、判定基準の見直し'
      });
    }
    
    if (metrics.hexagramDiversity.unusedCount > 0) {
      recommendations.push({
        priority: 'high',
        category: 'hexagram_diversity',
        issue: `${metrics.hexagramDiversity.unusedCount}個の未使用卦`,
        suggestion: '希少卦ボーナス機構、重み配分の再設計'
      });
    }
    
    if (metrics.transparency.userUnderstanding < 4.0) {
      recommendations.push({
        priority: 'medium',
        category: 'transparency',
        issue: 'ユーザー理解度不足',
        suggestion: '説明文の改善、技術用語の平易化'
      });
    }
    
    if (metrics.reliability.accuracy < 0.8) {
      recommendations.push({
        priority: 'high',
        category: 'reliability',
        issue: '判定精度不足',
        suggestion: 'アルゴリズム全体の見直し、学習機構の導入'
      });
    }
    
    return recommendations;
  }
}

module.exports = StatisticalValidator;