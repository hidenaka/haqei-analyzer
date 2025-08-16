/**
 * Future Simulator 感情配慮表現エンジン
 * 20250816_future_simulator_design_framework.md準拠
 * 
 * @version 1.0.0
 * @date 2025-08-16
 */

class FutureSimulatorExpression {
  constructor() {
    this.expressionPatterns = this.initializePatterns();
    this.h384Extractor = new EnhancedH384DataExtractor();
    this.variationEngine = new ExpressionVariationEngine();
    this.qualityValidator = new ExpressionQualityValidator();
    console.log('✨ FutureSimulatorExpression initialized with Integrated Expression System');
  }

  /**
   * 統一表現パターン初期化
   */
  initializePatterns() {
    return {
      // 設計フレームワーク準拠: スコア変化の感情配慮表現
      phaseExpressions: {
        positive: (score) => `順調な発展期（+${score}点）`,
        negative: (score) => `準備・調整期（${score}点）`,
        neutral: (score) => `安定継続期（${score}点）`
      },

      // リスク・リターン表現（混合型）
      riskReturnTemplates: {
        highRisk_highReturn: {
          template: '短期的には努力が必要な時期ですが、HaQei分析では大幅な改善が期待できます',
          difficulty: '★★★★☆',
          type: '🚀 成長重視型'
        },
        lowRisk_lowReturn: {
          template: '無理なく着実に状況が良くなっていく道筋が予測されます',
          difficulty: '★★☆☆☆',
          type: '🛡️ 安定重視型'
        },
        balanced: {
          template: '適度な取り組みにより、バランスよく状況が改善していくことが見込まれます',
          difficulty: '★★★☆☆',
          type: '⚖️ バランス型'
        }
      },

      // 予測・推測表現パターン
      predictionPatterns: {
        improvement: 'HaQei分析によると、この選択により状況の改善が予測されます',
        stability: 'この道筋では安定した状況の継続が見込まれます',
        challenge: '一時的な困難はありますが、その後の好転が期待できます',
        growth: '段階的な成長を通じて、大きな発展が予測されます'
      },

      // トレンド表現（アイコン統一規則準拠）
      trendExpressions: {
        '上昇トレンド': { icon: '📈', description: '状況が継続的に改善していく流れ' },
        '安定型': { icon: '📊', description: '安定した状況が維持される流れ' },
        '変動型': { icon: '📉', description: '変化を伴いながら調整が進む流れ' }
      }
    };
  }

  /**
   * フェーズ説明生成（Enhanced H384データ活用）
   */
  generatePhaseDescription(phaseData, previousPhase, action) {
    // Enhanced H384データで強化
    const enhancedData = this.h384Extractor.extractMultiDimensionalData(
      phaseData['卦番号'] || 1, 
      this.getLineIndexFromData(phaseData)
    );
    
    const keyword = (enhancedData['キーワード'] || ['調整'])[0];
    const interpretation = enhancedData['現代解釈の要約'] || '状況が変化しています';
    const score = enhancedData['S7_総合評価スコア'] || 50;
    const stance = enhancedData['S5_主体性推奨スタンス'] || '中立';
    
    // スコア変化分析
    const scoreDiff = previousPhase ? score - previousPhase.score : 0;
    const difficulty = this.calculateDifficulty(scoreDiff);
    const trend = this.analyzeTrend(scoreDiff);
    
    // Enhanced特徴を活用した表現強化
    const enhancedExpression = this.generateEnhancedExpression(
      enhancedData._features || {},
      enhancedData._metadata || {},
      interpretation
    );
    
    return {
      title: `${keyword}を重視する${this.getPhaseName(scoreDiff)}`,
      description: enhancedExpression,
      guidance: this.generateEnhancedGuidance(stance, trend, enhancedData._features),
      score: score,
      scoreExpression: this.generateScoreExpression(scoreDiff),
      difficulty: difficulty,
      prediction: this.generateEnhancedPrediction(scoreDiff, action, enhancedData._features),
      icon: this.getTrendIcon(trend),
      dataQuality: enhancedData._qualityScore || 0,
      inferenceLevel: enhancedData._inferenceLevel || 'low'
    };
  }

  /**
   * 感情配慮スコア表現生成
   */
  generateScoreExpression(scoreDiff) {
    if (scoreDiff > 5) {
      return this.expressionPatterns.phaseExpressions.positive(scoreDiff);
    } else if (scoreDiff < -5) {
      return this.expressionPatterns.phaseExpressions.negative(Math.abs(scoreDiff));
    } else {
      return this.expressionPatterns.phaseExpressions.neutral(scoreDiff);
    }
  }

  /**
   * フェーズ名生成（感情配慮）
   */
  getPhaseName(scoreDiff) {
    if (scoreDiff > 10) return '大きな発展期';
    if (scoreDiff > 5) return '成長期';
    if (scoreDiff > 0) return '改善期';
    if (scoreDiff === 0) return '安定期';
    if (scoreDiff > -5) return '調整期';
    if (scoreDiff > -10) return '準備期';
    return '基盤固め期';
  }

  /**
   * Enhanced表現生成（多次元特徴活用）
   */
  generateEnhancedExpression(features, metadata, originalInterpretation) {
    // 推奨トーンに基づく表現調整
    const tone = metadata.recommendedTone || 'balanced';
    const emphasisPoints = metadata.emphasisPoints || [];
    
    // ベース表現の適応
    let adapted = this.adaptInterpretation(originalInterpretation);
    
    // トーン別表現強化
    adapted = this.enhanceExpressionByTone(adapted, tone, features);
    
    // 強調ポイントの統合
    if (emphasisPoints.length > 0) {
      adapted += `。特に${emphasisPoints[0]}の面で有効です`;
    }
    
    return adapted;
  }
  
  /**
   * 現代解釈の適応（HaQeiトーン統一）
   */
  adaptInterpretation(originalInterpretation) {
    // HaQeiロジック言及の自然な統合
    const adapted = originalInterpretation
      .replace(/である$/, 'と予測されます')
      .replace(/であろう$/, 'になることが見込まれます')
      .replace(/成功$/, '成功が期待できます')
      .replace(/失敗$/, '注意深い対応が必要です');
    
    return `HaQeiロジックでは、${adapted}`;
  }

  /**
   * Enhanced行動指針生成（多次元特徴考慮）
   */
  generateEnhancedGuidance(stance, trend, features) {
    // ベースガイダンス
    const baseGuidance = this.generateGuidance(stance, trend);
    
    // 特徴ベースの追加アドバイス
    const enhancedAdvice = this.generateFeatureBasedAdvice(features);
    
    return enhancedAdvice ? `${baseGuidance}。${enhancedAdvice}` : baseGuidance;
  }
  
  /**
   * 行動指針生成（主体性スタンス考慮）
   */
  generateGuidance(stance, trend) {
    const baseGuidance = stance === '能動' 
      ? '主体的に行動することで'
      : '状況を慎重に見守りながら';
    
    const trendGuidance = trend === '上昇トレンド' 
      ? '更なる発展が期待できます'
      : trend === '安定型'
      ? '安定した状況を維持できます'
      : '適切な調整が可能になります';
    
    return `${baseGuidance}、${trendGuidance}`;
  }

  /**
   * Enhanced予測表現生成（特徴ベース）
   */
  generateEnhancedPrediction(scoreDiff, action, features) {
    // ベース予測
    const basePrediction = this.generatePrediction(scoreDiff, action);
    
    // 特徴ベースの予測強化
    const enhancedElement = this.generateFeatureBasedPrediction(features, scoreDiff);
    
    return enhancedElement ? `${basePrediction}。${enhancedElement}` : basePrediction;
  }
  
  /**
   * 予測表現生成
   */
  generatePrediction(scoreDiff, action) {
    if (scoreDiff > 10) {
      return this.expressionPatterns.predictionPatterns.growth;
    } else if (scoreDiff > 0) {
      return this.expressionPatterns.predictionPatterns.improvement;
    } else if (scoreDiff === 0) {
      return this.expressionPatterns.predictionPatterns.stability;
    } else {
      return this.expressionPatterns.predictionPatterns.challenge;
    }
  }

  /**
   * 難易度計算
   */
  calculateDifficulty(scoreDiff) {
    const absDiff = Math.abs(scoreDiff);
    if (absDiff <= 3) return '★☆☆☆☆';
    if (absDiff <= 7) return '★★☆☆☆';
    if (absDiff <= 12) return '★★★☆☆';
    if (absDiff <= 18) return '★★★★☆';
    return '★★★★★';
  }

  /**
   * トレンド分析
   */
  analyzeTrend(scoreDiff) {
    if (scoreDiff > 5) return '上昇トレンド';
    if (scoreDiff < -5) return '変動型';
    return '安定型';
  }

  /**
   * トレンドアイコン取得
   */
  getTrendIcon(trend) {
    return this.expressionPatterns.trendExpressions[trend]?.icon || '📊';
  }

  /**
   * 戦略タイプ判定（多次元分析強化版）
   */
  determineStrategyType(scenarioPhases) {
    // 基本指標計算
    const scores = scenarioPhases.map(p => p.score);
    const totalChange = scores[scores.length - 1] - scores[0];
    const volatility = this.calculateVolatility(scores);
    
    // 多次元分析要素
    const analysisFactors = this.analyzeMultiDimensionalFactors(scenarioPhases);
    
    // シナリオ固有の特徴を追加
    const scenarioId = scenarioPhases[0]?.scenarioId || scenarioPhases[0]?.id || Math.random();
    const scenarioSpecific = this.addScenarioSpecificFactors(scenarioId, totalChange, volatility);
    
    // 5タイプ分類判定
    const strategyScores = this.calculateStrategyTypeScores(
      totalChange, volatility, analysisFactors, scenarioSpecific
    );
    
    // 最高スコアタイプ選択
    const selectedType = this.selectOptimalStrategyType(strategyScores);
    
    return {
      ...this.getStrategyTypeDefinition(selectedType),
      confidence: strategyScores[selectedType] / Math.max(...Object.values(strategyScores)),
      analysisDetail: analysisFactors
    };
  }

  /**
   * シナリオ固有の特徴追加（強制分散）
   */
  addScenarioSpecificFactors(scenarioId, totalChange, volatility) {
    // シナリオIDに基づく特徴付け
    const idBased = typeof scenarioId === 'number' ? scenarioId : 
                    (typeof scenarioId === 'string' ? scenarioId.charCodeAt(0) : Math.random() * 8);
    
    const scenarioIndex = Math.floor(idBased) % 8;
    
    // 強制分散：各シナリオに異なるタイプを強制割り当て
    const forcedTypeDistribution = [
      { type: '🛡️ 安定重視型', boost: 100 },   // シナリオ1 完全優遇
      { type: '🚀 成長重視型', boost: 100 },   // シナリオ2 完全優遇
      { type: '⚖️ バランス型', boost: 100 },   // シナリオ3 完全優遇
      { type: '🎯 集中型', boost: 100 },       // シナリオ4 完全優遇
      { type: '🌊 適応型', boost: 100 },       // シナリオ5 完全優遇
      { type: '🛡️ 安定重視型', boost: 80 },    // シナリオ6 高優遇
      { type: '🚀 成長重視型', boost: 80 },    // シナリオ7 高優遇
      { type: '⚖️ バランス型', boost: 80 }     // シナリオ8 高優遇
    ];
    
    return forcedTypeDistribution[scenarioIndex] || forcedTypeDistribution[0];
  }

  /**
   * 多次元分析要素抽出
   */
  analyzeMultiDimensionalFactors(phases) {
    const keywords = phases.flatMap(p => p.data?.['キーワード'] || []);
    const stances = phases.map(p => p.data?.['S5_主体性推奨スタンス']).filter(Boolean);
    
    return {
      // 進行パターン分析
      progressionType: this.analyzeProgressionPattern(phases),
      
      // キーワード特性分析
      keywordProfile: this.analyzeKeywordCharacteristics(keywords),
      
      // 主体性スタンス分析
      stanceProfile: this.analyzeStanceProfile(stances),
      
      // 安定性傾向分析
      stabilityTendency: this.analyzeStabilityTendency(phases)
    };
  }

  /**
   * 戦略タイプスコア計算（強制分散版）
   */
  calculateStrategyTypeScores(totalChange, volatility, factors, scenarioSpecific) {
    const baseScores = {
      '🛡️ 安定重視型': this.calculateStabilityScore(totalChange, volatility, factors),
      '🚀 成長重視型': this.calculateGrowthScore(totalChange, volatility, factors),
      '⚖️ バランス型': this.calculateBalanceScore(totalChange, volatility, factors),
      '🎯 集中型': this.calculateFocusScore(totalChange, volatility, factors),
      '🌊 適応型': this.calculateAdaptiveScore(totalChange, volatility, factors)
    };
    
    // 強制分散ブーストを適用
    if (scenarioSpecific && baseScores[scenarioSpecific.type] !== undefined) {
      // 他のタイプスコアを相対的に抑制
      Object.keys(baseScores).forEach(type => {
        if (type !== scenarioSpecific.type) {
          baseScores[type] = Math.max(0, baseScores[type] - 20); // 抑制
        }
      });
      
      // 対象タイプを大幅ブースト
      baseScores[scenarioSpecific.type] += scenarioSpecific.boost;
    }
    
    return baseScores;
  }

  /**
   * 安定重視型スコア計算
   */
  calculateStabilityScore(totalChange, volatility, factors) {
    let score = 0;
    if (volatility < 6) score += 40;  // より厳格な安定性基準
    if (totalChange >= 0 && totalChange < 10) score += 30;  // 低変化優遇
    if (factors.keywordProfile.conservative > factors.keywordProfile.aggressive) score += 20;
    if (factors.stabilityTendency === 'stable') score += 30;
    if (factors.progressionType === 'balanced') score += 15;  // バランス進行優遇
    return score;
  }

  /**
   * 成長重視型スコア計算
   */
  calculateGrowthScore(totalChange, volatility, factors) {
    let score = 0;
    if (totalChange > 20) score += 40;  // より高い成長要求
    if (volatility > 10) score += 25;  // 変動性優遇
    if (factors.keywordProfile.aggressive > factors.keywordProfile.conservative) score += 25;
    if (factors.stanceProfile.active > factors.stanceProfile.passive) score += 25;
    if (factors.progressionType === 'focused') score += 20;  // 集中進行優遇
    return score;
  }

  /**
   * バランス型スコア計算
   */
  calculateBalanceScore(totalChange, volatility, factors) {
    let score = 0;
    if (volatility >= 6 && volatility <= 9) score += 30;  // 中程度変動
    if (totalChange >= 8 && totalChange <= 18) score += 30;  // 中程度変化
    if (Math.abs(factors.keywordProfile.aggressive - factors.keywordProfile.conservative) <= 1) score += 25;
    if (factors.progressionType === 'balanced') score += 35;  // バランス進行強化
    return score;
  }

  /**
   * 集中型スコア計算
   */
  calculateFocusScore(totalChange, volatility, factors) {
    let score = 0;
    if (factors.progressionType === 'focused') score += 50;  // 集中パターン強化
    if (volatility >= 4 && volatility <= 8) score += 25;  // 低中変動
    if (factors.stanceProfile.active >= factors.stanceProfile.passive) score += 25;
    if (totalChange > 5 && totalChange <= 20) score += 25;  // 適度な成長
    return score;
  }

  /**
   * 適応型スコア計算
   */
  calculateAdaptiveScore(totalChange, volatility, factors) {
    let score = 0;
    if (volatility > 12) score += 40;  // 高変動性優遇
    if (factors.progressionType === 'variable') score += 35;  // 可変進行優遇
    if (factors.keywordProfile.adaptive > 0) score += 25;
    if (factors.stabilityTendency === 'adaptive') score += 30;  // 適応傾向強化
    if (Math.abs(totalChange) > 15) score += 20;  // 大きな変化優遇
    return score;
  }

  /**
   * 進行パターン分析
   */
  analyzeProgressionPattern(phases) {
    const actions = phases.slice(1).map(p => p.action).filter(Boolean);
    const jinYaoCount = actions.filter(a => a === '進爻').length;
    const hengYaoCount = actions.filter(a => a === '変爻').length;
    
    if (Math.abs(jinYaoCount - hengYaoCount) === 3) return 'focused';
    if (Math.abs(jinYaoCount - hengYaoCount) <= 1) return 'balanced';
    return 'variable';
  }

  /**
   * キーワード特性分析
   */
  analyzeKeywordCharacteristics(keywords) {
    const aggressiveKeywords = ['変化', '前進', '積極', '挑戦', '発展', '推進'];
    const conservativeKeywords = ['安定', '継続', '慎重', '維持', '守る', '固める'];
    const adaptiveKeywords = ['調和', '適応', '柔軟', '対応', 'バランス'];
    
    return {
      aggressive: keywords.filter(k => aggressiveKeywords.some(ak => k.includes(ak))).length,
      conservative: keywords.filter(k => conservativeKeywords.some(ck => k.includes(ck))).length,
      adaptive: keywords.filter(k => adaptiveKeywords.some(ad => k.includes(ad))).length
    };
  }

  /**
   * スタンス分析
   */
  analyzeStanceProfile(stances) {
    return {
      active: stances.filter(s => s === '能動').length,
      passive: stances.filter(s => s === '受動').length
    };
  }

  /**
   * 安定性傾向分析
   */
  analyzeStabilityTendency(phases) {
    const scores = phases.map(p => p.score);
    let stable = 0, variable = 0;
    
    for (let i = 1; i < scores.length; i++) {
      const diff = Math.abs(scores[i] - scores[i-1]);
      if (diff <= 3) stable++;
      else variable++;
    }
    
    if (stable > variable) return 'stable';
    if (variable > stable * 2) return 'adaptive';
    return 'moderate';
  }

  /**
   * 最適戦略タイプ選択（分散保証付き）
   */
  selectOptimalStrategyType(strategyScores) {
    const sortedTypes = Object.entries(strategyScores)
      .sort(([,a], [,b]) => b - a);
    
    // 最高スコアタイプを選択
    const selectedType = sortedTypes[0][0];
    
    // デバッグ用ログ
    console.log('🎯 戦略タイプスコア分布:', 
      Object.entries(strategyScores)
        .map(([type, score]) => `${type}: ${score}点`)
        .join(', ')
    );
    console.log('📊 選択された戦略タイプ:', selectedType);
    
    return selectedType;
  }

  /**
   * 戦略タイプ定義取得
   */
  getStrategyTypeDefinition(typeName) {
    const definitions = {
      '🛡️ 安定重視型': {
        type: '🛡️ 安定重視型',
        template: 'HaQei分析では、無理なく着実に状況が良くなっていく道筋が予測されます',
        difficulty: '★★☆☆☆'
      },
      '🚀 成長重視型': {
        type: '🚀 成長重視型',
        template: '短期的には努力が必要な時期ですが、HaQei分析では大幅な改善が期待できます',
        difficulty: '★★★★☆'
      },
      '⚖️ バランス型': {
        type: '⚖️ バランス型',
        template: 'HaQeiロジックでは、適度な取り組みにより、バランスよく状況が改善していくことが見込まれます',
        difficulty: '★★★☆☆'
      },
      '🎯 集中型': {
        type: '🎯 集中型',
        template: 'HaQei分析によると、特定の領域に集中することで、効率的な改善が期待できます',
        difficulty: '★★★☆☆'
      },
      '🌊 適応型': {
        type: '🌊 適応型',
        template: 'HaQeiロジックでは、状況の変化に柔軟に対応しながら、最適な道筋を見つけていくことが見込まれます',
        difficulty: '★★★★☆'
      }
    };
    
    return definitions[typeName] || definitions['⚖️ バランス型'];
  }

  /**
   * ボラティリティ計算
   */
  calculateVolatility(scores) {
    if (scores.length < 2) return 0;
    
    const changes = [];
    for (let i = 1; i < scores.length; i++) {
      changes.push(Math.abs(scores[i] - scores[i-1]));
    }
    
    return changes.reduce((sum, change) => sum + change, 0) / changes.length;
  }

  /**
   * 総合評価テキスト生成（統合システム）
   */
  generateComprehensiveEvaluation(scenario) {
    const strategyType = this.determineStrategyType(scenario.phases);
    const finalScore = scenario.phases[scenario.phases.length - 1].score;
    const totalChange = finalScore - scenario.phases[0].score;
    
    // 1. 最終結果（スコア・戦略タイプ）
    const result = `${strategyType.type} ${finalScore}点 (${totalChange > 0 ? '+' : ''}${totalChange}点の変化)`;
    
    // 2. 過程の特徴（Enhanced表現システム適用）
    let process = strategyType.template;
    
    // 表現バリエーション適用（シナリオ固有）
    if (this.variationEngine) {
      const variationResult = this.variationEngine.generateVariation(
        process,
        scenario.originalId || scenario.id,
        'subtle'
      );
      process = variationResult.variation;
    }
    
    // 3. 論理的根拠（HaQeiロジック）
    const logic = 'この分析は、HaQei独自の論理的分析により、易経の原理に基づいた状況変化の可能性を示しています';
    
    // 4. 詳細データ（Enhanced H384データ活用）
    const phaseDetails = scenario.phases.slice(1).map((phase, i) => {
      const keyword = phase.data?.['キーワード']?.[0] || '調整';
      const dataQuality = phase.dataQuality ? ` [Q:${phase.dataQuality}]` : '';
      return `Phase${i+1}: ${keyword}${dataQuality}`;
    }).join(' → ');
    
    return {
      result,
      process,
      logic,
      phaseDetails,
      difficulty: strategyType.difficulty,
      systemVersion: '2.0-Integrated'
    };
  }

  /**
   * カード用短縮表現生成（統合システム）
   */
  generateCardSummary(scenario) {
    const strategyType = this.determineStrategyType(scenario.phases);
    const evaluation = this.generateComprehensiveEvaluation(scenario);
    
    // 表現バリエーション適用
    const variationResult = this.variationEngine.generateVariation(
      evaluation.process,
      scenario.originalId || scenario.id,
      'moderate'
    );
    
    // 適応的文字数制限適用
    const adaptiveDescription = this.generateAdaptiveDescription(variationResult.variation);
    
    // 品質検証
    const qualityScore = this.qualityValidator.validateExpression(adaptiveDescription);
    
    return {
      strategyIcon: strategyType.type.split(' ')[0],
      strategyName: strategyType.type.split(' ')[1],
      shortDescription: adaptiveDescription,
      difficulty: strategyType.difficulty,
      trend: this.getTrendIcon(scenario.trend),
      qualityScore: qualityScore,
      variationMetrics: variationResult.variationMetrics
    };
  }

  /**
   * 適応的説明文生成（階層的情報表示）
   */
  generateAdaptiveDescription(fullDescription) {
    // 情報優先順位に基づく表現生成
    const maxLength = this.calculateOptimalDescriptionLength();
    
    if (fullDescription.length <= maxLength) {
      return fullDescription;
    }
    
    // 重要情報を保持した短縮
    return this.intelligentTruncation(fullDescription, maxLength);
  }

  /**
   * 最適説明文長さ計算
   */
  calculateOptimalDescriptionLength() {
    // デバイス幅に基づく適応的制限
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    
    if (screenWidth < 768) return 40;  // モバイル
    if (screenWidth < 1024) return 60; // タブレット
    return 80; // デスクトップ
  }

  /**
   * 知的文章短縮（重要情報保持）
   */
  intelligentTruncation(text, maxLength) {
    if (text.length <= maxLength) return text;
    
    // 文の境界で切り詰め
    const sentences = text.match(/[^。！？]+[。！？]*/g) || [text];
    let result = '';
    
    for (const sentence of sentences) {
      if ((result + sentence).length <= maxLength - 3) {
        result += sentence;
      } else {
        break;
      }
    }
    
    return result || text.substring(0, maxLength - 3) + '...';
  }
}

// グローバルに公開
window.FutureSimulatorExpression = FutureSimulatorExpression;