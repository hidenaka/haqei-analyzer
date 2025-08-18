/**
 * Future Simulator Expression Helpers
 * Phase 2 Task 2.1: Enhanced H384データ活用サポート関数
 * 
 * @version 2.0.0
 * @date 2025-08-16
 */

// FutureSimulatorExpressionクラスの拡張メソッド
Object.assign(FutureSimulatorExpression.prototype, {
  
  /**
   * 爻データからライン位置取得
   */
  getLineIndexFromData(phaseData) {
    const lineName = phaseData['爻'];
    if (!lineName) return 0;
    
    const positions = {
      '初九': 0, '初六': 0,
      '九二': 1, '六二': 1,
      '九三': 2, '六三': 2,
      '九四': 3, '六四': 3,
      '九五': 4, '六五': 4,
      '上九': 5, '上六': 5
    };
    return positions[lineName] || 0;
  },

  /**
   * トーン別表現強化
   */
  enhanceExpressionByTone(baseExpression, tone, features) {
    const emotional = features.emotionalProfile || {};
    
    switch (tone) {
      case 'optimistic':
        return baseExpression.replace(/予測されます$/, '期待できます').replace(/見込まれます$/, '実現が見込まれます');
      
      case 'cautious':
        return baseExpression.replace(/予測されます$/, '慎重に進むことが推奨されます').replace(/見込まれます$/, '注意深く取り組むことが重要です');
      
      case 'dynamic':
        return baseExpression.replace(/予測されます$/, '積極的な展開が予測されます').replace(/見込まれます$/, 'エネルギッシュな発展が見込まれます');
      
      case 'stable':
        return baseExpression.replace(/予測されます$/, '安定した進展が予測されます').replace(/見込まれます$/, '着実な改善が見込まれます');
      
      default:
        return baseExpression;
    }
  },

  /**
   * 特徴ベース追加アドバイス生成
   */
  generateFeatureBasedAdvice(features) {
    const advice = [];
    
    if (!features) return '';
    
    // 社会性特徴のアドバイス
    if (features.socialProfile) {
      if (features.socialProfile.cooperation > 70) {
        advice.push('チームワークを活かすことで更なる効果が期待できます');
      }
      if (features.socialProfile.leadership > 70) {
        advice.push('リーダーシップを発揮する絶好の機会です');
      }
    }
    
    // 行動特性のアドバイス
    if (features.actionProfile) {
      if (features.actionProfile.riskTolerance < 30) {
        advice.push('リスク管理を最優先に進めることが重要です');
      }
      if (features.actionProfile.adaptability > 70) {
        advice.push('変化に対する柔軟性が成功の鍵となります');
      }
    }
    
    // 創造性・安定性のバランス
    if (features.creativityIndex > 70 && features.stabilityIndex > 70) {
      advice.push('創造性と安定性の両立が可能な状況です');
    }
    
    return advice.length > 0 ? advice[0] : '';
  },

  /**
   * 特徴ベース予測強化
   */
  generateFeatureBasedPrediction(features, scoreDiff) {
    if (!features) return '';
    
    const predictions = [];
    
    // 成長可能性による予測
    if (features.growthPotential > 80) {
      predictions.push('長期的な成長ポテンシャルが非常に高い状況です');
    }
    
    // 時間軸特性による予測
    if (features.temporalProfile) {
      if (features.temporalProfile.shortTermFocus > 50) {
        predictions.push('短期的な成果が重要な局面となります');
      }
      if (features.temporalProfile.longTermFocus > 50) {
        predictions.push('長期的視点での取り組みが功を奏します');
      }
    }
    
    // 感情安定性による予測
    if (features.emotionalProfile && features.emotionalProfile.emotionalStability > 80) {
      predictions.push('感情的に安定した判断が可能な時期です');
    }
    
    return predictions.length > 0 ? predictions[0] : '';
  },

  /**
   * データ活用率計算
   */
  calculateDataUtilizationRate() {
    // 過去24時間のキャッシュデータを分析
    const cacheEntries = Array.from(this.h384Extractor.dataCache.entries());
    const enhancedEntries = cacheEntries.filter(([key, data]) => data._enhanced);
    const totalEntries = cacheEntries.length;
    
    if (totalEntries === 0) return 0;
    
    const enhancementRate = (enhancedEntries.length / totalEntries) * 100;
    const avgQualityScore = enhancedEntries.reduce((sum, [key, data]) => sum + (data._qualityScore || 0), 0) / enhancedEntries.length;
    
    return {
      enhancementRate: Math.round(enhancementRate),
      averageQuality: Math.round(avgQualityScore),
      totalProcessed: totalEntries,
      utilizationScore: Math.round((enhancementRate + avgQualityScore) / 2)
    };
  },

  /**
   * H384データ統計取得
   */
  getH384DataStatistics() {
    const stats = {
      cacheHits: 0,
      inferredData: 0,
      qualityDistribution: { A: 0, B: 0, C: 0, D: 0 },
      featureComplexity: []
    };
    
    this.h384Extractor.dataCache.forEach((data, key) => {
      stats.cacheHits++;
      
      if (data._inferred) {
        stats.inferredData++;
      }
      
      if (data._metadata && data._metadata.haqeiIntegrationLevel) {
        const grade = data._metadata.haqeiIntegrationLevel.grade;
        if (stats.qualityDistribution[grade] !== undefined) {
          stats.qualityDistribution[grade]++;
        }
      }
      
      if (data._features) {
        const complexity = Object.keys(data._features).length;
        stats.featureComplexity.push(complexity);
      }
    });
    
    // 平均特徴複雑度計算
    if (stats.featureComplexity.length > 0) {
      stats.averageFeatureComplexity = Math.round(
        stats.featureComplexity.reduce((sum, c) => sum + c, 0) / stats.featureComplexity.length
      );
    }
    
    // 推論率計算
    stats.inferenceRate = stats.cacheHits > 0 ? Math.round((stats.inferredData / stats.cacheHits) * 100) : 0;
    
    return stats;
  },

  /**
   * 表現品質評価
   */
  evaluateExpressionQuality(scenario) {
    const evaluation = {
      dataRichness: 0,
      expressionVariety: 0,
      haqeiCompliance: 0,
      overallScore: 0
    };
    
    // データ豊富度評価
    const phases = scenario.phases || [];
    let totalQuality = 0;
    let validPhases = 0;
    
    phases.forEach(phase => {
      if (phase.dataQuality !== undefined) {
        totalQuality += phase.dataQuality;
        validPhases++;
      }
    });
    
    evaluation.dataRichness = validPhases > 0 ? Math.round(totalQuality / validPhases) : 0;
    
    // 表現多様性評価
    const descriptions = phases.map(p => p.description).filter(Boolean);
    const uniqueDescriptions = new Set(descriptions);
    evaluation.expressionVariety = descriptions.length > 0 ? 
      Math.round((uniqueDescriptions.size / descriptions.length) * 100) : 0;
    
    // HaQei準拠度評価
    const haqeiMentions = descriptions.filter(d => d.includes('HaQei')).length;
    evaluation.haqeiCompliance = descriptions.length > 0 ? 
      Math.round((haqeiMentions / descriptions.length) * 100) : 0;
    
    // 総合スコア
    evaluation.overallScore = Math.round(
      (evaluation.dataRichness + evaluation.expressionVariety + evaluation.haqeiCompliance) / 3
    );
    
    return evaluation;
  },

  /**
   * キャッシュクリア（パフォーマンス管理）
   */
  clearDataCache() {
    if (this.h384Extractor && this.h384Extractor.dataCache) {
      const cacheSize = this.h384Extractor.dataCache.size;
      this.h384Extractor.dataCache.clear();
      console.log(`🧹 H384データキャッシュクリア完了: ${cacheSize}エントリ削除`);
      return cacheSize;
    }
    return 0;
  },

  /**
   * デバッグ情報出力
   */
  outputDebugInfo() {
    const utilizationRate = this.calculateDataUtilizationRate();
    const statistics = this.getH384DataStatistics();
    
    console.log('🔬 Enhanced H384 Data Extractor Status:');
    console.log('  データ活用率:', utilizationRate);
    console.log('  統計情報:', statistics);
    
    return {
      utilization: utilizationRate,
      statistics: statistics,
      timestamp: new Date().toISOString()
    };
  }
});

console.log('🔗 Future Simulator Expression Helpers loaded');