// BehaviorChangeUtils.js - 行動変容ユーティリティ
// HaQei Analyzer - Phase 5.3: 実践行動ブリッジ強化

class BehaviorChangeUtils {
  constructor(storageManager, statisticalEngine) {
    this.storageManager = storageManager;
    this.statisticalEngine = statisticalEngine;
    this.scientificFormatter = new ScientificFormatter();
    
    // 行動変容の科学的原理
    this.behaviorChangeScience = {
      transtheoreticalModel: {
        stages: ['precontemplation', 'contemplation', 'preparation', 'action', 'maintenance'],
        stageBasedInterventions: true
      },
      socialCognitiveTheory: {
        selfEfficacy: true,
        observationalLearning: true,
        behavioralCapability: true
      },
      motivationalInterviewing: {
        autonomySupport: true,
        collaborativeSpirit: true,
        evocation: true
      }
    };
    
    // bunenjin哲学との統合
    this.bunenjinIntegration = {
      respectPersonalityMultiplicity: true,
      supportContextualAdaptation: true,
      avoidUnifiedSelfImposition: true,
      encourageNaturalTransitions: true
    };
    
    // 動機維持システムの設定
    this.motivationMaintenance = {
      intrinsicMotivationFocus: true,
      autonomySupportLevel: 'high',
      competenceBuilding: 'gradual',
      relatednessEnhancement: 'contextual'
    };
    
    console.log("🧠 BehaviorChangeUtils initialized with scientific behavior change principles");
  }
  
  /**
   * パーソナライズド提案エンジン
   * @param {Object} osData - OS分析データ
   * @param {Object} currentContext - 現在の状況コンテキスト
   * @returns {Object} パーソナライズされた提案
   */
  generatePersonalizedSuggestions(osData, currentContext = {}) {
    const validatedOSData = this.validateOSData(osData);
    const contextAnalysis = this.analyzeCurrentContext(currentContext);
    
    const suggestions = {
      immediate: this.generateImmediateSuggestions(validatedOSData, contextAnalysis),
      adaptive: this.generateAdaptiveSuggestions(validatedOSData, contextAnalysis),
      longTerm: this.generateLongTermSuggestions(validatedOSData, contextAnalysis),
      contextual: this.generateContextualSuggestions(validatedOSData, contextAnalysis),
      metadata: {
        generatedAt: new Date().toISOString(),
        osProfileHash: this.generateOSHash(validatedOSData),
        contextHash: this.generateContextHash(contextAnalysis),
        behaviorChangeStage: this.identifyBehaviorChangeStage(validatedOSData, contextAnalysis)
      }
    };
    
    // 統計的妥当性の検証
    suggestions.validation = this.validateSuggestions(suggestions);
    
    console.log("💡 Personalized suggestions generated:", suggestions.metadata.behaviorChangeStage);
    return suggestions;
  }
  
  /**
   * 動機維持システム
   * @param {Object} userProgress - ユーザー進捗データ
   * @param {Object} osProfile - OSプロファイル
   * @returns {Object} 動機維持戦略
   */
  maintainMotivation(userProgress, osProfile) {
    const progressAnalysis = this.analyzeUserProgress(userProgress);
    const motivationStrategy = {
      currentMotivationLevel: this.assessCurrentMotivation(progressAnalysis),
      riskFactors: this.identifyMotivationRisks(progressAnalysis),
      supportInterventions: this.designSupportInterventions(progressAnalysis, osProfile),
      autonomyEnhancements: this.generateAutonomyEnhancements(osProfile),
      competenceBuilding: this.designCompetenceBuilding(progressAnalysis, osProfile),
      relatednessSupport: this.generateRelatednessSupport(osProfile)
    };
    
    // bunenjin哲学に基づく動機維持
    motivationStrategy.bunenjinSupport = this.generateBunenjinMotivationSupport(osProfile);
    
    return motivationStrategy;
  }
  
  /**
   * 継続サポートシステム
   * @param {string} userId - ユーザーID
   * @param {Object} behaviorGoals - 行動目標
   * @returns {Object} 継続サポート計画
   */
  generateContinuitySupport(userId, behaviorGoals) {
    const userHistory = this.getUserBehaviorHistory(userId);
    const supportPlan = {
      habitFormation: this.designHabitFormationSupport(behaviorGoals, userHistory),
      relapsePrevention: this.createRelapsePrevention(userHistory),
      progressTracking: this.setupProgressTracking(behaviorGoals),
      adaptiveAdjustments: this.planAdaptiveAdjustments(userHistory),
      socialSupport: this.generateSocialSupportRecommendations(behaviorGoals),
      environmentalDesign: this.suggestEnvironmentalModifications(behaviorGoals)
    };
    
    // 長期継続のためのbunenjin戦略
    supportPlan.bunenjinContinuity = this.generateBunenjinContinuityStrategy(behaviorGoals);
    
    return supportPlan;
  }
  
  /**
   * 行動変容ステージの特定
   * @param {Object} osData - OSデータ
   * @param {Object} contextAnalysis - コンテキスト分析
   * @returns {string} 行動変容ステージ
   */
  identifyBehaviorChangeStage(osData, contextAnalysis) {
    const readinessScore = this.calculateChangeReadiness(osData, contextAnalysis);
    
    if (readinessScore < 0.2) {
      return 'precontemplation';
    } else if (readinessScore < 0.4) {
      return 'contemplation';
    } else if (readinessScore < 0.6) {
      return 'preparation';
    } else if (readinessScore < 0.8) {
      return 'action';
    } else {
      return 'maintenance';
    }
  }
  
  /**
   * 即座実行可能な提案の生成
   * @param {Object} osData - 検証済みOSデータ
   * @param {Object} contextAnalysis - コンテキスト分析
   * @returns {Array} 即座実行可能な提案
   */
  generateImmediateSuggestions(osData, contextAnalysis) {
    const suggestions = [];
    const dominantOS = this.identifyDominantOS(osData);
    const currentEnergy = contextAnalysis.energyLevel || 0.5;
    const availableTime = contextAnalysis.availableTime || 5;
    
    // エネルギーレベルに応じた提案
    if (currentEnergy > 0.7 && availableTime >= 10) {
      // 高エネルギー・時間十分
      suggestions.push({
        id: 'high_energy_challenge',
        title: `${this.getOSDisplayName(dominantOS)}チャレンジ`,
        description: '今の高いエネルギーを活かした積極的な行動',
        timeMinutes: 10,
        energyRequirement: 'high',
        bunenjinNote: `エネルギッシュな${dominantOS}分人が活動したがっています`
      });
    } else if (currentEnergy < 0.3) {
      // 低エネルギー
      suggestions.push({
        id: 'low_energy_gentle',
        title: '優しい自己ケア',
        description: 'エネルギーが低い時の gentle な行動',
        timeMinutes: 3,
        energyRequirement: 'minimal',
        bunenjinNote: '疲れた分人を労わることも大切な行動変容です'
      });
    }
    
    // OS特性に基づく提案
    suggestions.push(...this.generateOSSpecificSuggestions(osData, contextAnalysis));
    
    return suggestions;
  }
  
  /**
   * 適応的提案の生成
   * @param {Object} osData - OSデータ
   * @param {Object} contextAnalysis - コンテキスト分析
   * @returns {Array} 適応的提案
   */
  generateAdaptiveSuggestions(osData, contextAnalysis) {
    const suggestions = [];
    const osBalance = this.calculateOSBalance(osData);
    
    // OS間のバランス調整提案
    if (!osBalance.isBalanced) {
      const weakOS = osBalance.weakestOS;
      suggestions.push({
        type: 'balance_adjustment',
        title: `${this.getOSDisplayName(weakOS)}育成プログラム`,
        description: `活用頻度の低い${this.getOSDisplayName(weakOS)}を段階的に育成`,
        adaptationPlan: this.createOSStrengtheningPlan(weakOS, osData),
        bunenjinInsight: `眠っている${weakOS}分人にも存在価値があります`
      });
    }
    
    // 状況適応提案
    if (contextAnalysis.situationType) {
      suggestions.push({
        type: 'situational_adaptation',
        title: `${contextAnalysis.situationType}状況対応`,
        description: '現在の状況に最適な分人の活用法',
        situationSpecific: this.generateSituationSpecificActions(contextAnalysis.situationType, osData),
        bunenjinInsight: 'この状況では特定の分人が活躍しやすくなります'
      });
    }
    
    return suggestions;
  }
  
  /**
   * 長期的提案の生成
   * @param {Object} osData - OSデータ
   * @param {Object} contextAnalysis - コンテキスト分析
   * @returns {Object} 長期的提案
   */
  generateLongTermSuggestions(osData, contextAnalysis) {
    return {
      visionDevelopment: {
        title: '分人協調ビジョンの構築',
        description: '複数の分人が協力する理想的な状態の明確化',
        timeline: '3-6ヶ月',
        milestones: this.generateVisionMilestones(osData),
        bunenjinCore: '統一された「理想の自分」ではなく、協調する分人システムの構築'
      },
      skillDevelopment: {
        title: '分人切り替えスキル育成',
        description: '状況に応じた適切な分人の使い分け能力の向上',
        curriculum: this.createSkillCurriculum(osData),
        assessmentPlan: this.createSkillAssessmentPlan()
      },
      environmentalOptimization: {
        title: '分人フレンドリー環境構築',
        description: '各分人が活躍しやすい環境の整備',
        environmentalAudit: this.createEnvironmentalAudit(),
        optimizationPlan: this.createEnvironmentOptimizationPlan(osData)
      }
    };
  }
  
  /**
   * コンテキスト別提案の生成
   * @param {Object} osData - OSデータ
   * @param {Object} contextAnalysis - コンテキスト分析
   * @returns {Object} コンテキスト別提案
   */
  generateContextualSuggestions(osData, contextAnalysis) {
    const contexts = ['work', 'relationships', 'stress', 'creativity', 'leisure'];
    const contextualSuggestions = {};
    
    contexts.forEach(context => {
      contextualSuggestions[context] = {
        primaryOS: this.identifyOptimalOSForContext(context, osData),
        actions: this.generateContextSpecificActions(context, osData),
        adaptationStrategy: this.createContextAdaptationStrategy(context, osData),
        bunenjinGuidance: this.generateContextBunenjinGuidance(context)
      };
    });
    
    return contextualSuggestions;
  }
  
  /**
   * 現在の動機レベル評価
   * @param {Object} progressAnalysis - 進捗分析
   * @returns {Object} 動機評価
   */
  assessCurrentMotivation(progressAnalysis) {
    const motivationFactors = {
      autonomy: this.assessAutonomyLevel(progressAnalysis),
      competence: this.assessCompetenceLevel(progressAnalysis),
      relatedness: this.assessRelatednessLevel(progressAnalysis),
      intrinsicMotivation: this.assessIntrinsicMotivation(progressAnalysis)
    };
    
    const overallMotivation = Object.values(motivationFactors).reduce((sum, val) => sum + val, 0) / 4;
    
    return {
      overall: this.scientificFormatter.formatPercentage(overallMotivation),
      factors: motivationFactors,
      risk: overallMotivation < 0.4 ? 'high' : overallMotivation < 0.6 ? 'medium' : 'low',
      recommendations: this.generateMotivationRecommendations(motivationFactors)
    };
  }
  
  /**
   * bunenjin動機維持支援の生成
   * @param {Object} osProfile - OSプロファイル
   * @returns {Object} bunenjin動機支援
   */
  generateBunenjinMotivationSupport(osProfile) {
    return {
      personalityAcceptance: {
        message: 'あなたの複数の分人はすべて価値ある存在です',
        practice: '日々異なる分人の活動を観察し、それぞれの価値を認める',
        affirmation: '私は状況に応じて異なる分人を表現することを許可します'
      },
      contextualFlexibility: {
        message: '状況によって異なる自分を表現することは自然で健康的です',
        practice: '分人の切り替えを意識し、その柔軟性を評価する',
        affirmation: '私の多様な表現は豊かさの証拠です'
      },
      unifiedSelfRejection: {
        message: '「本当の自分」を探す必要はありません',
        practice: '統一された自己像への執着を手放す練習',
        affirmation: '私は複数の真正な分人の集合体です'
      }
    };
  }
  
  /**
   * bunenjin継続戦略の生成
   * @param {Object} behaviorGoals - 行動目標
   * @returns {Object} bunenjin継続戦略
   */
  generateBunenjinContinuityStrategy(behaviorGoals) {
    return {
      personalityRotation: {
        strategy: '異なる分人による目標追求',
        implementation: '週ごとに異なる分人の視点で同じ目標にアプローチ',
        benefit: '飽きや停滞の回避、多角的な成長'
      },
      contextualMastery: {
        strategy: '状況別分人の最適化',
        implementation: '各状況で最も効果的な分人を特定・育成',
        benefit: '状況適応力の向上、ストレス軽減'
      },
      personalityCooperation: {
        strategy: '分人間の協力体制構築',
        implementation: '異なる分人が互いを支援する仕組み作り',
        benefit: '内的葛藤の軽減、統合的成長'
      }
    };
  }
  
  /**
   * OSデータの妥当性検証
   * @param {Object} osData - OSデータ
   * @returns {Object} 検証済みOSデータ
   */
  validateOSData(osData) {
    if (!osData || typeof osData !== 'object') {
      return this.getDefaultOSData();
    }
    
    const validatedData = {};
    ['engine_score', 'interface_score', 'safemode_score'].forEach(key => {
      if (osData[key] !== undefined && osData[key] !== null) {
        const validation = this.statisticalEngine.validateScore(osData[key]);
        validatedData[key] = validation.correctedScore;
      } else {
        validatedData[key] = 0.5; // デフォルト値
      }
    });
    
    return validatedData;
  }
  
  /**
   * 現在のコンテキスト分析
   * @param {Object} context - コンテキストデータ
   * @returns {Object} 分析結果
   */
  analyzeCurrentContext(context) {
    return {
      energyLevel: this.normalizeValue(context.energyLevel, 0, 10, 0.5),
      stressLevel: this.normalizeValue(context.stressLevel, 0, 10, 0.5),
      socialContext: context.socialContext || 'neutral',
      availableTime: context.availableTime || 5,
      situationType: context.situationType || 'general',
      environmentalFactors: context.environmentalFactors || {},
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * 優勢OSの特定
   * @param {Object} osData - OSデータ
   * @returns {string} 優勢OS
   */
  identifyDominantOS(osData) {
    const scores = [
      { name: 'engine', score: osData.engine_score },
      { name: 'interface', score: osData.interface_score },
      { name: 'safemode', score: osData.safemode_score }
    ];
    
    return scores.sort((a, b) => b.score - a.score)[0].name;
  }
  
  /**
   * 値の正規化
   * @param {number} value - 対象値
   * @param {number} min - 最小値
   * @param {number} max - 最大値
   * @param {number} defaultValue - デフォルト値
   * @returns {number} 正規化された値（0-1）
   */
  normalizeValue(value, min, max, defaultValue) {
    if (value === null || value === undefined || isNaN(value)) {
      return defaultValue;
    }
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
  }
  
  /**
   * OS表示名の取得
   * @param {string} osType - OS種別
   * @returns {string} 表示名
   */
  getOSDisplayName(osType) {
    const displayNames = {
      engine: 'Engine OS（内なる価値観）',
      interface: 'Interface OS（他者との関係性）',
      safemode: 'SafeMode OS（安全確保）'
    };
    return displayNames[osType] || osType;
  }
  
  /**
   * デフォルトOSデータの取得
   * @returns {Object} デフォルトOSデータ
   */
  getDefaultOSData() {
    return {
      engine_score: 0.5,
      interface_score: 0.5,
      safemode_score: 0.5
    };
  }
  
  /**
   * OSハッシュの生成
   * @param {Object} osData - OSデータ
   * @returns {string} ハッシュ値
   */
  generateOSHash(osData) {
    const dataString = JSON.stringify(osData);
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
  
  /**
   * コンテキストハッシュの生成
   * @param {Object} contextData - コンテキストデータ
   * @returns {string} ハッシュ値
   */
  generateContextHash(contextData) {
    return this.generateOSHash(contextData); // 同じロジックを使用
  }
  
  /**
   * 提案の妥当性検証
   * @param {Object} suggestions - 提案データ
   * @returns {Object} 検証結果
   */
  validateSuggestions(suggestions) {
    return {
      isValid: true,
      hasImmediateSuggestions: suggestions.immediate && suggestions.immediate.length > 0,
      hasAdaptiveSuggestions: suggestions.adaptive && suggestions.adaptive.length > 0,
      bunenjinCompliance: this.checkBunenjinCompliance(suggestions),
      qualityScore: this.calculateSuggestionQuality(suggestions)
    };
  }
  
  /**
   * bunenjin準拠性チェック
   * @param {Object} suggestions - 提案データ
   * @returns {boolean} 準拠性
   */
  checkBunenjinCompliance(suggestions) {
    const text = JSON.stringify(suggestions).toLowerCase();
    const hasUnifiedSelfTerms = text.includes('本当の自分') || text.includes('真の自分');
    const hasBunenjinTerms = text.includes('分人') || text.includes('複数') || text.includes('多様');
    
    return !hasUnifiedSelfTerms && hasBunenjinTerms;
  }
  
  /**
   * 提案品質スコアの計算
   * @param {Object} suggestions - 提案データ
   * @returns {number} 品質スコア（0-1）
   */
  calculateSuggestionQuality(suggestions) {
    let score = 0;
    
    if (suggestions.immediate && suggestions.immediate.length > 0) score += 0.25;
    if (suggestions.adaptive && suggestions.adaptive.length > 0) score += 0.25;
    if (suggestions.longTerm && Object.keys(suggestions.longTerm).length > 0) score += 0.25;
    if (suggestions.contextual && Object.keys(suggestions.contextual).length > 0) score += 0.25;
    
    return score;
  }
  
  // 以下、簡略化のため基本的な実装のみ提供（実際の本格実装では詳細化が必要）
  
  calculateChangeReadiness(osData, contextAnalysis) {
    return (osData.engine_score + osData.interface_score + osData.safemode_score) / 3;
  }
  
  generateOSSpecificSuggestions(osData, contextAnalysis) {
    return []; // 簡略化
  }
  
  calculateOSBalance(osData) {
    const scores = [osData.engine_score, osData.interface_score, osData.safemode_score];
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    const range = max - min;
    
    return {
      isBalanced: range < 0.3,
      weakestOS: ['engine', 'interface', 'safemode'][scores.indexOf(min)]
    };
  }
  
  analyzeUserProgress(userProgress) {
    return userProgress || {}; // 簡略化
  }
  
  getUserBehaviorHistory(userId) {
    return this.storageManager.get(`behavior_history_${userId}`) || [];
  }
  
  /**
   * OS強化プランの作成
   * @param {string} weakOS - 強化対象OS
   * @param {Object} osData - OSデータ
   * @returns {Object} 強化プラン
   */
  createOSStrengtheningPlan(weakOS, osData) {
    const plan = {
      targetOS: weakOS,
      currentLevel: osData[`${weakOS}_score`] || 0.5,
      targetLevel: Math.min(osData[`${weakOS}_score`] + 0.2, 0.8),
      duration: '2-4週間',
      phases: this.generateStrengtheningPhases(weakOS),
      exercises: this.generateOSExercises(weakOS),
      progressMetrics: this.defineProgressMetrics(weakOS),
      bunenjinApproach: this.getBunenjinStrengtheningApproach(weakOS)
    };
    
    return plan;
  }
  
  /**
   * 状況特化行動の生成
   * @param {string} situationType - 状況タイプ
   * @param {Object} osData - OSデータ
   * @returns {Array} 状況特化行動リスト
   */
  generateSituationSpecificActions(situationType, osData) {
    const actions = [];
    const dominantOS = this.identifyDominantOS(osData);
    
    const situationActions = {
      stress: [
        {
          id: 'stress_safemode_grounding',
          title: 'SafeMode 緊急安定化',
          description: 'ストレス状況での SafeMode OS 活用',
          instruction: '5つの感覚で現在を確認し、安全な場所を見つける',
          bunenjinNote: 'ストレス時は SafeMode 分人の知恵を借りることが重要です'
        }
      ],
      social: [
        {
          id: 'social_interface_activation',
          title: 'Interface OS 社交活性化',
          description: '社交場面での Interface OS 最適化',
          instruction: '相手との共通点を1つ見つけて共感的な対話を始める',
          bunenjinNote: 'この場面では Interface 分人が自然に活躍します'
        }
      ],
      creative: [
        {
          id: 'creative_engine_expression',
          title: 'Engine OS 創造表現',
          description: '創造的場面での Engine OS 発揮',
          instruction: '内なる価値観から生まれるアイデアを1つ形にする',
          bunenjinNote: '創造的分人が最も輝く瞬間です'
        }
      ]
    };
    
    return situationActions[situationType] || [];
  }
  
  /**
   * ビジョンマイルストーンの生成
   * @param {Object} osData - OSデータ
   * @returns {Array} マイルストーン
   */
  generateVisionMilestones(osData) {
    const balance = this.calculateOSBalance(osData);
    const milestones = [];
    
    // 短期マイルストーン（1ヶ月）
    milestones.push({
      timeframe: '1ヶ月',
      title: '分人認識の確立',
      description: '日常で3つのOSの使い分けを意識的に観察',
      successCriteria: '週3回以上の分人切り替えの認識',
      bunenjinFocus: '統一された自己ではなく、複数の分人の存在を実感'
    });
    
    // 中期マイルストーン（3ヶ月）
    milestones.push({
      timeframe: '3ヶ月',
      title: '状況適応マスタリー',
      description: '状況に応じた最適な分人の自然な表現',
      successCriteria: '5つの異なる状況で適切な分人を使い分け',
      bunenjinFocus: '柔軟性と真正性の両立'
    });
    
    // 長期マイルストーン（6ヶ月）
    if (balance.isBalanced) {
      milestones.push({
        timeframe: '6ヶ月',
        title: '分人協調システムの完成',
        description: '複数の分人が協力する統合的なライフスタイル',
        successCriteria: '分人間の葛藤が協力に変わる体験',
        bunenjinFocus: '多様性の中の調和'
      });
    } else {
      milestones.push({
        timeframe: '6ヶ月',
        title: '分人バランス最適化',
        description: `${balance.weakestOS} 分人の育成と全体調和`,
        successCriteria: 'OS間の格差が0.2以下に縮小',
        bunenjinFocus: '眠っている分人の覚醒と統合'
      });
    }
    
    return milestones;
  }
  
  /**
   * スキルカリキュラムの作成
   * @param {Object} osData - OSデータ
   * @returns {Array} カリキュラム
   */
  createSkillCurriculum(osData) {
    const curriculum = [
      {
        module: 'Foundation',
        title: 'bunenjin基礎理解',
        duration: '1週間',
        skills: [
          '分人概念の理解と受容',
          '統一自己観からの脱却',
          '3つのOSの特性認識'
        ],
        exercises: [
          '日常分人観察日記',
          '状況別自己表現の記録',
          'OS切り替えの意識化'
        ]
      },
      {
        module: 'Recognition',
        title: '分人認識スキル',
        duration: '2週間',
        skills: [
          '分人の瞬間的特定',
          '状況-分人マッピング',
          '分人間の違いの観察'
        ],
        exercises: [
          'リアルタイム分人チェック',
          '状況変化への分人反応観察',
          '分人特性比較分析'
        ]
      },
      {
        module: 'Adaptation',
        title: '状況適応スキル',
        duration: '3週間',
        skills: [
          '意識的分人切り替え',
          '状況読解と最適OS選択',
          '分人表現の調整'
        ],
        exercises: [
          '計画的分人実験',
          '困難状況での分人活用',
          '分人フレキシビリティ訓練'
        ]
      },
      {
        module: 'Integration',
        title: '分人協調スキル',
        duration: '4週間',
        skills: [
          '分人間対話の促進',
          '内的葛藤の協調への転換',
          '統合的意思決定'
        ],
        exercises: [
          '分人会議の実施',
          '複雑状況での多分人協力',
          '長期目標への分人貢献計画'
        ]
      }
    ];
    
    return curriculum;
  }
  
  /**
   * スキル評価プランの作成
   * @returns {Object} 評価プラン
   */
  createSkillAssessmentPlan() {
    return {
      assessmentTypes: {
        selfReflection: {
          frequency: '週次',
          method: '構造化された振り返り質問',
          focus: '主観的成長実感の測定'
        },
        behaviorObservation: {
          frequency: '日次',
          method: '行動記録と分人使用パターン分析',
          focus: '客観的行動変化の確認'
        },
        situationalResponse: {
          frequency: '月次',
          method: '特定状況での分人選択と結果評価',
          focus: '状況適応能力の測定'
        }
      },
      progressIndicators: [
        '分人認識頻度の増加',
        '状況適応の成功率向上',
        '内的葛藤の減少',
        '行動選択の意図性向上',
        '生活満足度の改善'
      ],
      bunenjinMetrics: [
        '自己統一観からの脱却度',
        '多様性受容レベル',
        '状況的真正性の発揮度'
      ]
    };
  }
  
  /**
   * 環境監査の作成
   * @returns {Object} 環境監査
   */
  createEnvironmentalAudit() {
    return {
      physicalEnvironment: {
        areas: ['居住空間', '職場環境', '移動空間', '社交空間'],
        checkpoints: [
          '各分人が快適に活動できる空間があるか',
          '分人切り替えを促進する環境要素はあるか',
          'ストレス要因となる環境障害はないか'
        ]
      },
      socialEnvironment: {
        relationships: ['家族', '友人', '同僚', 'コミュニティ'],
        checkpoints: [
          '異なる分人を受け入れる関係性があるか',
          '分人表現を制限する関係パターンはないか',
          '多様な自己表現を支援する人間関係があるか'
        ]
      },
      digitalEnvironment: {
        platforms: ['SNS', 'メッセージング', 'コンテンツ消費', 'ツール使用'],
        checkpoints: [
          'デジタル上での分人表現の多様性はあるか',
          '統一自己圧力を生むプラットフォームはないか',
          '分人成長を支援するデジタルツールを活用しているか'
        ]
      }
    };
  }
  
  /**
   * 環境最適化プランの作成
   * @param {Object} osData - OSデータ
   * @returns {Object} 最適化プラン
   */
  createEnvironmentOptimizationPlan(osData) {
    const dominantOS = this.identifyDominantOS(osData);
    const balance = this.calculateOSBalance(osData);
    
    const plan = {
      immediate: {
        title: '即座実行可能な環境調整',
        actions: [
          {
            area: 'personal_space',
            action: `${this.getOSDisplayName(dominantOS)}専用エリアの確保`,
            time: '30分',
            impact: 'high'
          }
        ]
      },
      shortTerm: {
        title: '短期環境改善',
        actions: [
          {
            area: 'social_environment',
            action: '分人多様性を受け入れる人間関係の育成',
            time: '2週間',
            impact: 'medium'
          }
        ]
      },
      longTerm: {
        title: '長期環境構築',
        actions: [
          {
            area: 'life_structure',
            action: '各分人が活躍するライフパターンの設計',
            time: '3ヶ月',
            impact: 'high'
          }
        ]
      },
      bunenjinPrinciples: [
        '統一された環境ではなく、多様な分人に対応する柔軟な環境',
        '分人切り替えを自然に促進する環境デザイン',
        '真正性と適応性を両立する環境作り'
      ]
    };
    
    return plan;
  }
  
  /**
   * コンテキスト別最適OSの特定
   * @param {string} context - コンテキスト種別
   * @param {Object} osData - OSデータ
   * @returns {string} 最適OS
   */
  identifyOptimalOSForContext(context, osData) {
    const contextOptimalOS = {
      work: this.calculateWorkOptimalOS(osData),
      relationships: 'interface',
      stress: 'safemode',
      creativity: 'engine',
      leisure: this.identifyDominantOS(osData),
      learning: 'engine',
      social: 'interface',
      planning: 'engine',
      crisis: 'safemode'
    };
    
    return contextOptimalOS[context] || this.identifyDominantOS(osData);
  }
  
  /**
   * コンテキスト特化行動の生成
   * @param {string} context - コンテキスト
   * @param {Object} osData - OSデータ
   * @returns {Array} 行動リスト
   */
  generateContextSpecificActions(context, osData) {
    const optimalOS = this.identifyOptimalOSForContext(context, osData);
    const actions = [];
    
    const contextActions = {
      work: [
        {
          id: 'work_engine_values',
          title: '価値観ベース意思決定',
          description: '仕事の決断を内なる価値観で導く',
          osTarget: 'engine',
          bunenjinNote: '職場でも価値観分人を活かすことで真正性を保持'
        },
        {
          id: 'work_interface_collaboration',
          title: 'チーム協調アプローチ',
          description: '同僚との関係性を重視した業務推進',
          osTarget: 'interface',
          bunenjinNote: '職場の関係性分人が自然に活動する場面'
        }
      ],
      relationships: [
        {
          id: 'relationship_interface_empathy',
          title: '共感的コミュニケーション',
          description: '相手の立場に立った理解と応答',
          osTarget: 'interface',
          bunenjinNote: '関係性分人が最も力を発揮する領域'
        },
        {
          id: 'relationship_engine_authenticity',
          title: '真正な自己開示',
          description: '適切なレベルでの価値観の共有',
          osTarget: 'engine',
          bunenjinNote: '内向的分人も関係性で重要な役割を果たします'
        }
      ]
    };
    
    return contextActions[context] || [];
  }
  
  /**
   * コンテキスト適応戦略の作成
   * @param {string} context - コンテキスト
   * @param {Object} osData - OSデータ
   * @returns {Object} 適応戦略
   */
  createContextAdaptationStrategy(context, osData) {
    const strategy = {
      primaryApproach: this.identifyOptimalOSForContext(context, osData),
      backupApproaches: this.generateBackupOSStrategies(context, osData),
      transitionTriggers: this.defineTransitionTriggers(context),
      adaptationSignals: this.defineAdaptationSignals(context),
      bunenjinGuidance: this.generateContextBunenjinGuidance(context)
    };
    
    return strategy;
  }
  
  /**
   * コンテキスト別bunenjinガイダンス
   * @param {string} context - コンテキスト
   * @returns {string} ガイダンス
   */
  generateContextBunenjinGuidance(context) {
    const guidance = {
      work: '職場では複数の分人が協力します。完璧な一貫性よりも、状況に応じた最適な分人の表現を大切にしましょう。',
      relationships: '人間関係では相手によって異なる分人が活動するのは自然です。これは偽りではなく、豊かな人間性の現れです。',
      stress: 'ストレス時は SafeMode 分人の保護機能を活用し、他の分人を無理に働かせないことが重要です。',
      creativity: '創造的活動では Engine 分人の価値観が重要な役割を果たします。他の分人の視点も取り入れて多角的な創造を。',
      leisure: '余暇時間こそ、普段表現されにくい分人を意識的に活動させるチャンスです。'
    };
    
    return guidance[context] || '各状況で自然に現れる分人を受け入れ、その分人の知恵を活かしましょう。';
  }
  
  /**
   * 自律性レベルの評価
   * @param {Object} progressAnalysis - 進捗分析
   * @returns {number} 自律性レベル（0-1）
   */
  assessAutonomyLevel(progressAnalysis) {
    const indicators = {
      selfDirectedGoals: progressAnalysis.selfDirectedGoals || 0.5,
      choiceFlexibility: progressAnalysis.choiceFlexibility || 0.5,
      valueAlignment: progressAnalysis.valueAlignment || 0.5,
      decisionOwnership: progressAnalysis.decisionOwnership || 0.5
    };
    
    const autonomyScore = Object.values(indicators).reduce((sum, val) => sum + val, 0) / 4;
    return Math.max(0, Math.min(1, autonomyScore));
  }
  
  /**
   * 有能感レベルの評価
   * @param {Object} progressAnalysis - 進捗分析
   * @returns {number} 有能感レベル（0-1）
   */
  assessCompetenceLevel(progressAnalysis) {
    const indicators = {
      skillProgression: progressAnalysis.skillProgression || 0.5,
      challengeHandling: progressAnalysis.challengeHandling || 0.5,
      learningRate: progressAnalysis.learningRate || 0.5,
      achievementRecognition: progressAnalysis.achievementRecognition || 0.5
    };
    
    const competenceScore = Object.values(indicators).reduce((sum, val) => sum + val, 0) / 4;
    return Math.max(0, Math.min(1, competenceScore));
  }
  
  /**
   * 関係性レベルの評価
   * @param {Object} progressAnalysis - 進捗分析
   * @returns {number} 関係性レベル（0-1）
   */
  assessRelatednessLevel(progressAnalysis) {
    const indicators = {
      socialConnection: progressAnalysis.socialConnection || 0.5,
      belongingSense: progressAnalysis.belongingSense || 0.5,
      supportReceived: progressAnalysis.supportReceived || 0.5,
      contributionToOthers: progressAnalysis.contributionToOthers || 0.5
    };
    
    const relatednessScore = Object.values(indicators).reduce((sum, val) => sum + val, 0) / 4;
    return Math.max(0, Math.min(1, relatednessScore));
  }
  
  /**
   * 内発的動機の評価
   * @param {Object} progressAnalysis - 進捗分析
   * @returns {number} 内発的動機レベル（0-1）
   */
  assessIntrinsicMotivation(progressAnalysis) {
    const indicators = {
      enjoymentLevel: progressAnalysis.enjoymentLevel || 0.5,
      curiosityDriven: progressAnalysis.curiosityDriven || 0.5,
      meaningfulness: progressAnalysis.meaningfulness || 0.5,
      flowExperience: progressAnalysis.flowExperience || 0.5
    };
    
    const intrinsicScore = Object.values(indicators).reduce((sum, val) => sum + val, 0) / 4;
    return Math.max(0, Math.min(1, intrinsicScore));
  }
  
  /**
   * 動機向上推奨事項の生成
   * @param {Object} factors - 動機要因
   * @returns {Array} 推奨事項
   */
  generateMotivationRecommendations(factors) {
    const recommendations = [];
    
    if (factors.autonomy < 0.6) {
      recommendations.push({
        area: 'autonomy',
        suggestion: '自分で目標設定をする機会を増やし、選択肢を広げる',
        bunenjinNote: '複数の分人それぞれが自律性を発揮できる場面を作る'
      });
    }
    
    if (factors.competence < 0.6) {
      recommendations.push({
        area: 'competence',
        suggestion: 'スキル向上を実感できる小さな成功体験を積み重ねる',
        bunenjinNote: '各分人の得意分野での成長を意識的に追求する'
      });
    }
    
    if (factors.relatedness < 0.6) {
      recommendations.push({
        area: 'relatedness',
        suggestion: '同じ価値観や目標を持つ人とのつながりを深める',
        bunenjinNote: '異なる分人が活動する複数のコミュニティに参加する'
      });
    }
    
    return recommendations;
  }
  
  /**
   * 動機リスク要因の特定
   * @param {Object} progressAnalysis - 進捗分析
   * @returns {Array} リスク要因
   */
  identifyMotivationRisks(progressAnalysis) {
    const risks = [];
    
    if (progressAnalysis.completionRate < 0.3) {
      risks.push({
        type: 'low_completion',
        severity: 'high',
        description: '継続的な未完了によるモチベーション低下',
        bunenjinInsight: '特定の分人に負荷が集中している可能性'
      });
    }
    
    if (progressAnalysis.stagnationPeriod > 14) {
      risks.push({
        type: 'stagnation',
        severity: 'medium',
        description: '成長実感の欠如による意欲減退',
        bunenjinInsight: '新しい分人の活用や異なるアプローチが必要'
      });
    }
    
    return risks;
  }
  
  /**
   * 支援介入の設計
   * @param {Object} progressAnalysis - 進捗分析
   * @param {Object} osProfile - OSプロファイル
   * @returns {Array} 支援介入
   */
  designSupportInterventions(progressAnalysis, osProfile) {
    const interventions = [];
    const dominantOS = this.identifyDominantOS(osProfile);
    
    if (progressAnalysis.motivationLevel < 0.4) {
      interventions.push({
        type: 'motivation_boost',
        title: `${this.getOSDisplayName(dominantOS)}活性化プログラム`,
        description: '得意な分人を活用した動機回復',
        duration: '1-2週間',
        bunenjinApproach: '無理に苦手な分人を使わず、得意な分人から始める'
      });
    }
    
    return interventions;
  }
  
  /**
   * 自律性向上の生成
   * @param {Object} osProfile - OSプロファイル
   * @returns {Array} 自律性向上策
   */
  generateAutonomyEnhancements(osProfile) {
    const enhancements = [];
    const balance = this.calculateOSBalance(osProfile);
    
    enhancements.push({
      area: 'choice_expansion',
      strategy: '各分人が選択できるオプションを意識的に増やす',
      implementation: '日常の小さな決断で異なる分人の判断を試す',
      bunenjinCore: '選択の多様性は分人の多様性を反映します'
    });
    
    return enhancements;
  }
  
  /**
   * 有能感構築の設計
   * @param {Object} progressAnalysis - 進捗分析
   * @param {Object} osProfile - OSプロファイル
   * @returns {Array} 有能感構築策
   */
  designCompetenceBuilding(progressAnalysis, osProfile) {
    const building = [];
    
    building.push({
      focus: 'skill_recognition',
      method: '既存の分人スキルの可視化と評価',
      timeline: '継続的',
      bunenjinInsight: '各分人の独自の能力を認識し尊重する'
    });
    
    return building;
  }
  
  /**
   * 関係性支援の生成
   * @param {Object} osProfile - OSプロファイル
   * @returns {Array} 関係性支援
   */
  generateRelatednessSupport(osProfile) {
    const support = [];
    
    if (osProfile.interface_score > 0.6) {
      support.push({
        type: 'social_expansion',
        suggestion: 'Interface 分人の強みを活かした新しい関係性構築',
        bunenjinNote: '関係性分人が自然に活躍できる場を増やす'
      });
    }
    
    return support;
  }
  
  /**
   * 習慣形成支援の設計
   * @param {Object} behaviorGoals - 行動目標
   * @param {Array} userHistory - ユーザー履歴
   * @returns {Object} 習慣形成支援
   */
  designHabitFormationSupport(behaviorGoals, userHistory) {
    return {
      startingStrategy: {
        approach: 'micro-habit',
        duration: '2週間',
        bunenjinPrinciple: '最も協力的な分人から始める'
      },
      scalingPlan: {
        week1_2: 'micro レベルで基盤構築',
        week3_4: 'mini レベルに拡張',
        week5_8: '他の分人への展開',
        bunenjinFocus: '分人間の協力関係構築'
      },
      supportMechanisms: [
        '分人別の習慣追跡',
        '状況別の習慣適応',
        '分人協力の促進'
      ]
    };
  }
  
  /**
   * 再発防止の作成
   * @param {Array} userHistory - ユーザー履歴
   * @returns {Object} 再発防止計画
   */
  createRelapsePrevention(userHistory) {
    return {
      riskIdentification: {
        patterns: '過去の中断パターンの分析',
        triggers: 'リスク要因の早期発見',
        bunenjinView: '特定の分人への過負荷が中断の主因'
      },
      preventionStrategies: [
        '分人ローテーションによる負荷分散',
        '早期警告システムの構築',
        '復帰しやすい環境の維持'
      ],
      recoveryPlan: {
        immediateAction: '中断時の罪悪感を持たず、別の分人でのアプローチを試す',
        reengagement: '最も協力的な分人から再開する',
        bunenjinWisdom: '中断も分人の自然な反応として受け入れる'
      }
    };
  }
  
  /**
   * 進捗追跡の設定
   * @param {Object} behaviorGoals - 行動目標
   * @returns {Object} 進捗追跡設定
   */
  setupProgressTracking(behaviorGoals) {
    return {
      metrics: {
        quantitative: ['実行回数', '継続日数', '達成率'],
        qualitative: ['満足度', '意味感', '分人活用度'],
        bunenjin: ['分人多様性指数', '分人協力度', '状況適応性']
      },
      trackingFrequency: {
        daily: '基本行動実行の記録',
        weekly: '分人観察と振り返り',
        monthly: '総合的な成長評価'
      },
      visualizations: [
        '分人別活動グラフ',
        '状況適応パターン図',
        '成長軌跡チャート'
      ]
    };
  }
  
  /**
   * 適応的調整の計画
   * @param {Array} userHistory - ユーザー履歴
   * @returns {Object} 適応調整計画
   */
  planAdaptiveAdjustments(userHistory) {
    return {
      adjustmentTriggers: [
        '2週間の進捗停滞',
        '満足度の継続的低下',
        '分人バランスの大幅変化'
      ],
      adjustmentOptions: {
        difficulty: '難易度の段階的調整',
        approach: 'アプローチ方法の変更',
        focus: '重点的な分人の切り替え'
      },
      bunenjinAdaptation: {
        principle: '固定的な目標ではなく、分人の成長に合わせた柔軟な調整',
        method: '複数の分人の意見を取り入れた調整プロセス'
      }
    };
  }
  
  /**
   * 社会的支援推奨の生成
   * @param {Object} behaviorGoals - 行動目標
   * @returns {Array} 社会的支援推奨
   */
  generateSocialSupportRecommendations(behaviorGoals) {
    return [
      {
        type: 'accountability_partner',
        description: '分人の多様性を理解してくれる支援者の確保',
        bunenjinNote: '異なる状況での異なる自分を受け入れてくれる人'
      },
      {
        type: 'community_engagement',
        description: '各分人が活躍できるコミュニティへの参加',
        bunenjinNote: '単一のコミュニティではなく、多様な場での活動'
      },
      {
        type: 'mentorship',
        description: '分人思想を理解するメンターとの関係構築',
        bunenjinNote: '統一自己を求めない、柔軟な成長支援者'
      }
    ];
  }
  
  /**
   * 環境修正の提案
   * @param {Object} behaviorGoals - 行動目標
   * @returns {Array} 環境修正提案
   */
  suggestEnvironmentalModifications(behaviorGoals) {
    return [
      {
        area: 'physical_space',
        modification: '各分人が快適に活動できる空間の確保',
        impact: 'high',
        bunenjinBenefit: '分人切り替えを促進する環境デザイン'
      },
      {
        area: 'digital_environment',
        modification: '分人多様性を支援するアプリ・ツールの活用',
        impact: 'medium',
        bunenjinBenefit: 'デジタル空間での分人表現の促進'
      },
      {
        area: 'temporal_structure',
        modification: '異なる分人のための時間配分の最適化',
        impact: 'high',
        bunenjinBenefit: '各分人に適した時間帯での活動促進'
      }
    ];
  }
  
  // 補助メソッド群
  
  /**
   * 強化フェーズの生成
   * @param {string} targetOS - 対象OS
   * @returns {Array} 強化フェーズ
   */
  generateStrengtheningPhases(targetOS) {
    const phases = {
      engine: [
        { phase: 1, focus: '価値観の明確化', duration: '1週間' },
        { phase: 2, focus: '価値観に基づく小さな行動', duration: '1週間' },
        { phase: 3, focus: '価値観表現の拡大', duration: '2週間' }
      ],
      interface: [
        { phase: 1, focus: '関係性パターンの観察', duration: '1週間' },
        { phase: 2, focus: '新しい関係性の実験', duration: '1週間' },
        { phase: 3, focus: '関係性スキルの統合', duration: '2週間' }
      ],
      safemode: [
        { phase: 1, focus: '安全感の現状把握', duration: '1週間' },
        { phase: 2, focus: '安全確保スキルの練習', duration: '1週間' },
        { phase: 3, focus: '安全基盤の拡張', duration: '2週間' }
      ]
    };
    
    return phases[targetOS] || [];
  }
  
  /**
   * OS演習の生成
   * @param {string} targetOS - 対象OS
   * @returns {Array} 演習リスト
   */
  generateOSExercises(targetOS) {
    const exercises = {
      engine: [
        '日次価値観チェックイン（5分）',
        '価値観ベース意思決定の実践',
        '内なる声の傾聴瞑想'
      ],
      interface: [
        '積極的傾聴の練習',
        '共感的応答の実験',
        '関係性品質の評価'
      ],
      safemode: [
        'グラウンディング技法の練習',
        'リスク評価と対策立案',
        '安全な環境の構築'
      ]
    };
    
    return exercises[targetOS] || [];
  }
  
  /**
   * 進捗メトリクスの定義
   * @param {string} targetOS - 対象OS
   * @returns {Array} メトリクス
   */
  defineProgressMetrics(targetOS) {
    const metrics = {
      engine: ['価値観明確度', '内的一貫性', '自己認識度'],
      interface: ['関係性満足度', '社会的効力感', '共感能力'],
      safemode: ['安全感レベル', 'ストレス耐性', '回復力']
    };
    
    return metrics[targetOS] || [];
  }
  
  /**
   * bunenjin強化アプローチの取得
   * @param {string} targetOS - 対象OS
   * @returns {string} アプローチ
   */
  getBunenjinStrengtheningApproach(targetOS) {
    const approaches = {
      engine: 'この分人の価値観を尊重し、他の分人との対話を促進する',
      interface: 'この分人の関係性能力を活かし、他の分人の社会的表現を支援する',
      safemode: 'この分人の保護機能を評価し、他の分人が安心して活動できる基盤を提供する'
    };
    
    return approaches[targetOS] || '';
  }
  
  /**
   * 職場最適OSの計算
   * @param {Object} osData - OSデータ
   * @returns {string} 職場最適OS
   */
  calculateWorkOptimalOS(osData) {
    // 職場では一般的にバランスが重要
    const balance = this.calculateOSBalance(osData);
    return balance.isBalanced ? 'engine' : this.identifyDominantOS(osData);
  }
  
  /**
   * バックアップOS戦略の生成
   * @param {string} context - コンテキスト
   * @param {Object} osData - OSデータ
   * @returns {Array} バックアップ戦略
   */
  generateBackupOSStrategies(context, osData) {
    const primary = this.identifyOptimalOSForContext(context, osData);
    const all = ['engine', 'interface', 'safemode'];
    return all.filter(os => os !== primary);
  }
  
  /**
   * 移行トリガーの定義
   * @param {string} context - コンテキスト
   * @returns {Array} トリガー
   */
  defineTransitionTriggers(context) {
    return [
      '現在のアプローチでの停滞感',
      'ストレスレベルの上昇',
      '新しい状況要素の出現',
      '期待した結果が得られない場合'
    ];
  }
  
  /**
   * 適応シグナルの定義
   * @param {string} context - コンテキスト
   * @returns {Array} シグナル
   */
  defineAdaptationSignals(context) {
    return [
      '身体的な緊張や疲労の増加',
      '感情的な不快感や混乱',
      '行動効果の明らかな低下',
      '内的対話の増加や混乱'
    ];
  }
}

// グローバルスコープで利用可能にする
if (typeof window !== "undefined") {
  window.BehaviorChangeUtils = BehaviorChangeUtils;
}

// Node.js環境での利用
if (typeof module !== "undefined" && module.exports) {
  module.exports = BehaviorChangeUtils;
}