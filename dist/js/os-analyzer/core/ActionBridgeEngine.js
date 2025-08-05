// ActionBridgeEngine.js - 行動変容支援エンジン
// HaQei Analyzer - Phase 5.3: 実践行動ブリッジ強化

class ActionBridgeEngine {
  constructor(storageManager, statisticalEngine) {
    this.storageManager = storageManager;
    this.statisticalEngine = statisticalEngine;
    this.scientificFormatter = new ScientificFormatter();
    
    // 易経的変化原理の実装
    this.changePhilosophy = {
      gradualChange: true,        // 漸進的変化を重視
      naturalFlow: true,          // 自然な流れに従う
      balancePreservation: true,  // バランス保持
      contextualAdaptation: true  // 状況適応
    };
    
    // bunenjin哲学の実装
    this.bunenjinPrinciples = {
      respectMultiplicity: true,    // 多様性の尊重
      rejectUnifiedSelf: true,      // 統一自己の拒否
      supportSituationalPersona: true, // 状況的人格の支援
      maintainAuthenticity: true    // 真正性の維持
    };
    
    // 実験難易度レベル定義
    this.difficultyLevels = {
      micro: { timeMinutes: 2, effortLevel: 1, successThreshold: 0.8 },
      mini: { timeMinutes: 5, effortLevel: 2, successThreshold: 0.7 },
      light: { timeMinutes: 15, effortLevel: 3, successThreshold: 0.6 },
      moderate: { timeMinutes: 30, effortLevel: 4, successThreshold: 0.5 },
      intensive: { timeMinutes: 60, effortLevel: 5, successThreshold: 0.4 }
    };
    
    console.log("🌉 ActionBridgeEngine initialized with bunenjin philosophy integration");
  }
  
  /**
   * Triple OS組み合わせ別の最適化行動戦略を生成
   * @param {Object} osProfile - OS分析結果
   * @returns {Object} 行動戦略パッケージ
   */
  generateOptimizedActions(osProfile) {
    const validatedProfile = this.validateOSProfile(osProfile);
    
    const actionPackage = {
      immediate: this.generateImmediateActions(validatedProfile),
      shortTerm: this.generateShortTermExperiments(validatedProfile),
      longTerm: this.generateLongTermStrategy(validatedProfile),
      contextual: this.generateContextualAdaptations(validatedProfile),
      metadata: {
        generatedAt: new Date().toISOString(),
        osProfileHash: this.generateProfileHash(validatedProfile),
        difficultyProgression: this.calculateDifficultyProgression(validatedProfile)
      }
    };
    
    // 統計的妥当性の検証
    actionPackage.validation = this.validateActionPackage(actionPackage);
    
    console.log("🎯 Action package generated:", actionPackage.metadata);
    return actionPackage;
  }
  
  /**
   * 即座に実行可能な行動（5分以内のmicro-experiment）
   * @param {Object} osProfile - 検証済みOSプロファイル
   * @returns {Array} 即座実行可能な行動リスト
   */
  generateImmediateActions(osProfile) {
    const actions = [];
    const { dominantOS, secondaryOS, emergentOS } = this.identifyOSHierarchy(osProfile);
    
    // Engine OS が優勢な場合
    if (dominantOS === 'engine') {
      actions.push({
        id: 'engine_micro_reflection',
        title: '2分間の内省タイム',
        description: 'あなたの Engine OS（内なる価値観）に問いかけてみましょう',
        instruction: '静かな場所で2分間、「今この瞬間、私が本当に大切にしたいことは何か？」を考えてください',
        timeMinutes: 2,
        difficulty: 'micro',
        expectedOutcome: '内なる声の明確化',
        bunenjinNote: 'これは統一された「本当の自分」を探すのではなく、今この状況での Engine分人の声を聞くものです'
      });
    }
    
    // Interface OS が優勢な場合
    if (dominantOS === 'interface') {
      actions.push({
        id: 'interface_micro_connection',
        title: '3分間の感謝表現',
        description: 'あなたの Interface OS（他者との関係性）を活かした行動',
        instruction: '身近な人に3分以内で感謝のメッセージを送るか、直接伝えてください',
        timeMinutes: 3,
        difficulty: 'micro',
        expectedOutcome: '関係性の質向上',
        bunenjinNote: 'これは社交的な分人の自然な表現です。無理に内向的になる必要はありません'
      });
    }
    
    // SafeMode OS が優勢な場合
    if (dominantOS === 'safemode') {
      actions.push({
        id: 'safemode_micro_grounding',
        title: '5分間のグラウンディング',
        description: 'あなたの SafeMode OS（安全確保）を尊重した安定化行動',
        instruction: '5つの感覚（見る、聞く、触る、嗅ぐ、味わう）それぞれで今この瞬間を確認してください',
        timeMinutes: 5,
        difficulty: 'micro',
        expectedOutcome: '心理的安定の確保',
        bunenjinNote: '安全を求める分人は健全です。この特性を活かして他の分人の基盤を作りましょう'
      });
    }
    
    // OS組み合わせ特有の行動
    actions.push(...this.generateCombinationSpecificActions(osProfile));
    
    return this.prioritizeActions(actions, osProfile);
  }
  
  /**
   * 短期実験（1週間～1ヶ月）の生成
   * @param {Object} osProfile - 検証済みOSプロファイル
   * @returns {Array} 短期実験リスト
   */
  generateShortTermExperiments(osProfile) {
    const experiments = [];
    const osBalance = this.calculateOSBalance(osProfile);
    
    // バランス型実験
    if (osBalance.isBalanced) {
      experiments.push({
        id: 'balanced_weekly_rotation',
        title: '週次OS意識ローテーション',
        description: '3つのOSを意識的に切り替える週次実験',
        duration: '3週間',
        structure: {
          week1: 'Engine OS週間 - 内なる価値観に従った決断を意識',
          week2: 'Interface OS週間 - 他者との関係性を重視した行動',
          week3: 'SafeMode OS週間 - 安全と安定を確保する選択'
        },
        metrics: ['意識的切り替え回数', '各OS使用時の満足度', '状況適応性'],
        bunenjinInsight: '複数の分人を意識的に使い分けることで、より柔軟で豊かな人生が可能になります'
      });
    }
    
    // 不均衡改善実験
    if (!osBalance.isBalanced) {
      const weakOS = osBalance.weakestOS;
      experiments.push({
        id: `strengthen_${weakOS}_experiment`,
        title: `${this.getOSDisplayName(weakOS)}強化実験`,
        description: `最も活用されていない${this.getOSDisplayName(weakOS)}を意識的に育成`,
        duration: '2週間',
        weeklyGoals: this.generateWeakOSStrengtheningGoals(weakOS),
        progressTracking: '毎日3分間の振り返り記録',
        bunenjinInsight: `弱い分人も大切な一部です。無理に変えるのではなく、その分人が活躍できる場面を探しましょう`
      });
    }
    
    return experiments;
  }
  
  /**
   * 長期戦略（3ヶ月～1年）の生成
   * @param {Object} osProfile - 検証済みOSプロファイル
   * @returns {Object} 長期戦略計画
   */
  generateLongTermStrategy(osProfile) {
    const strategy = {
      vision: this.generateBunenjinVision(osProfile),
      milestones: this.generateMilestones(osProfile),
      adaptationPlan: this.generateAdaptationPlan(osProfile),
      sustainabilityMeasures: this.generateSustainabilityMeasures(osProfile)
    };
    
    return strategy;
  }
  
  /**
   * 状況別適応行動の生成
   * @param {Object} osProfile - 検証済みOSプロファイル
   * @returns {Object} 状況別適応ガイド
   */
  generateContextualAdaptations(osProfile) {
    return {
      workplace: this.generateWorkplaceAdaptations(osProfile),
      relationships: this.generateRelationshipAdaptations(osProfile),
      stressful: this.generateStressAdaptations(osProfile),
      creative: this.generateCreativeAdaptations(osProfile),
      social: this.generateSocialAdaptations(osProfile)
    };
  }
  
  /**
   * 段階的難易度調整システム
   * @param {string} userId - ユーザーID（localStorage key）
   * @param {number} successRate - 成功率
   * @param {string} currentLevel - 現在の難易度レベル
   * @returns {Object} 調整された難易度とその理由
   */
  adjustDifficultyProgression(userId, successRate, currentLevel) {
    const userProgress = this.storageManager.get(`user_progress_${userId}`) || {};
    const currentLevelData = this.difficultyLevels[currentLevel];
    
    let newLevel = currentLevel;
    let adjustmentReason = '';
    
    // 易経的変化原理に基づく漸進的調整
    if (successRate >= currentLevelData.successThreshold + 0.1) {
      // 成功率が高い場合、徐々にレベルアップ
      newLevel = this.getNextDifficultyLevel(currentLevel);
      adjustmentReason = '高い成功率により、次のレベルへの準備が整いました';
    } else if (successRate < currentLevelData.successThreshold - 0.2) {
      // 成功率が低い場合、レベルダウンで安定化
      newLevel = this.getPreviousDifficultyLevel(currentLevel);
      adjustmentReason = '無理のないペースで着実に進歩するため、レベルを調整しました';
    }
    
    // 調整履歴の記録
    userProgress.difficultyHistory = userProgress.difficultyHistory || [];
    userProgress.difficultyHistory.push({
      timestamp: new Date().toISOString(),
      fromLevel: currentLevel,
      toLevel: newLevel,
      successRate: this.scientificFormatter.formatPercentage(successRate),
      reason: adjustmentReason
    });
    
    // 最近10回の記録のみ保持
    if (userProgress.difficultyHistory.length > 10) {
      userProgress.difficultyHistory = userProgress.difficultyHistory.slice(-10);
    }
    
    this.storageManager.set(`user_progress_${userId}`, userProgress);
    
    return {
      newLevel,
      adjustmentReason,
      levelData: this.difficultyLevels[newLevel],
      isProgression: newLevel !== currentLevel
    };
  }
  
  /**
   * 行動パッケージの統計的妥当性検証
   * @param {Object} actionPackage - 行動パッケージ
   * @returns {Object} 検証結果
   */
  validateActionPackage(actionPackage) {
    const validation = {
      isValid: true,
      issues: [],
      recommendations: [],
      qualityScore: 0
    };
    
    // 即座実行可能性の検証
    if (!actionPackage.immediate || actionPackage.immediate.length === 0) {
      validation.issues.push('即座実行可能な行動が不足');
      validation.isValid = false;
    }
    
    // bunenjin哲学との整合性検証
    const bunenjinCompliance = this.checkBunenjinCompliance(actionPackage);
    if (!bunenjinCompliance.isCompliant) {
      validation.issues.push(...bunenjinCompliance.issues);
      validation.isValid = false;
    }
    
    // 品質スコアの算出
    validation.qualityScore = this.calculateActionQualityScore(actionPackage);
    
    return validation;
  }
  
  /**
   * OSプロファイルの妥当性検証
   * @param {Object} osProfile - OSプロファイル
   * @returns {Object} 検証済みプロファイル
   */
  validateOSProfile(osProfile) {
    if (!osProfile || typeof osProfile !== 'object') {
      console.warn("⚠️ Invalid OS profile, using default");
      return this.getDefaultOSProfile();
    }
    
    // StatisticalEngineによる検証
    const engineValidation = this.statisticalEngine.validateScore(osProfile.engine_score || 0, 'engine');
    const interfaceValidation = this.statisticalEngine.validateScore(osProfile.interface_score || 0, 'interface');
    const safemodeValidation = this.statisticalEngine.validateScore(osProfile.safemode_score || 0, 'safemode');
    
    return {
      engine_score: engineValidation.correctedScore,
      interface_score: interfaceValidation.correctedScore,
      safemode_score: safemodeValidation.correctedScore,
      validation: {
        engine: engineValidation,
        interface: interfaceValidation,
        safemode: safemodeValidation
      }
    };
  }
  
  /**
   * OS階層の特定（優勢、第二、潜在）
   * @param {Object} osProfile - OSプロファイル
   * @returns {Object} OS階層情報
   */
  identifyOSHierarchy(osProfile) {
    const scores = [
      { name: 'engine', score: osProfile.engine_score },
      { name: 'interface', score: osProfile.interface_score },
      { name: 'safemode', score: osProfile.safemode_score }
    ].sort((a, b) => b.score - a.score);
    
    return {
      dominantOS: scores[0].name,
      secondaryOS: scores[1].name,
      emergentOS: scores[2].name,
      dominanceGap: scores[0].score - scores[1].score,
      isBalanced: scores[0].score - scores[2].score < 0.2
    };
  }
  
  /**
   * bunenjinビジョンの生成
   * @param {Object} osProfile - OSプロファイル
   * @returns {Object} 分人思想に基づくビジョン
   */
  generateBunenjinVision(osProfile) {
    const hierarchy = this.identifyOSHierarchy(osProfile);
    
    return {
      coreMessage: '複数の分人が協調し、状況に応じて最適な自分を表現できる人生',
      osSpecificVisions: {
        engine: 'あなたの内なる価値観分人が、適切な場面で力を発揮する',
        interface: 'あなたの関係性分人が、豊かな人間関係を築き続ける', 
        safemode: 'あなたの安全確保分人が、他の分人の活動基盤を支え続ける'
      },
      integrationGoal: '統一された「真の自分」ではなく、多様で豊かな分人の協調体系の構築',
      adaptabilityFocus: '状況変化に応じて、最適な分人を自然に表現できる柔軟性の獲得'
    };
  }
  
  /**
   * デフォルトOSプロファイルの生成
   * @returns {Object} デフォルトプロファイル
   */
  getDefaultOSProfile() {
    return {
      engine_score: 0.5,
      interface_score: 0.5,
      safemode_score: 0.5,
      isDefault: true
    };
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
   * 次の難易度レベルを取得
   * @param {string} currentLevel - 現在のレベル
   * @returns {string} 次のレベル
   */
  getNextDifficultyLevel(currentLevel) {
    const levels = ['micro', 'mini', 'light', 'moderate', 'intensive'];
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : currentLevel;
  }
  
  /**
   * 前の難易度レベルを取得
   * @param {string} currentLevel - 現在のレベル
   * @returns {string} 前のレベル
   */
  getPreviousDifficultyLevel(currentLevel) {
    const levels = ['micro', 'mini', 'light', 'moderate', 'intensive'];
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex > 0 ? levels[currentIndex - 1] : currentLevel;
  }
  
  /**
   * プロファイルハッシュの生成（データ一意性確保）
   * @param {Object} osProfile - OSプロファイル
   * @returns {string} ハッシュ値
   */
  generateProfileHash(osProfile) {
    const dataString = JSON.stringify(osProfile);
    // 簡易ハッシュ関数
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32bit整数に変換
    }
    return Math.abs(hash).toString(16);
  }
  
  /**
   * OS組み合わせ特有行動の生成
   * @param {Object} osProfile - OSプロファイル
   * @returns {Array} 組み合わせ特有行動
   */
  generateCombinationSpecificActions(osProfile) {
    // ACTION_PLANSデータと統合
    const actions = [];
    const hierarchy = this.identifyOSHierarchy(osProfile);
    
    // 実装例：Engine優勢 + Interface次位の場合
    if (hierarchy.dominantOS === 'engine' && hierarchy.secondaryOS === 'interface') {
      actions.push({
        id: 'engine_interface_bridge',
        title: '価値観の共有実験',
        description: 'あなたの内なる価値観を他者と共有する練習',
        instruction: '今日感じた価値観の気づきを、信頼できる人に1つだけ話してみましょう',
        timeMinutes: 5,
        difficulty: 'mini',
        expectedOutcome: '内面と外面の橋渡し体験',
        bunenjinNote: '内向的分人と社交的分人が協力する瞬間です'
      });
    }
    
    return actions;
  }
  
  /**
   * 行動の優先順位付け
   * @param {Array} actions - 行動リスト
   * @param {Object} osProfile - OSプロファイル
   * @returns {Array} 優先順位付き行動リスト
   */
  prioritizeActions(actions, osProfile) {
    return actions.sort((a, b) => {
      // 難易度が低い順
      const difficultyOrder = ['micro', 'mini', 'light', 'moderate', 'intensive'];
      const aDifficultyIndex = difficultyOrder.indexOf(a.difficulty);
      const bDifficultyIndex = difficultyOrder.indexOf(b.difficulty);
      
      if (aDifficultyIndex !== bDifficultyIndex) {
        return aDifficultyIndex - bDifficultyIndex;
      }
      
      // 時間が短い順
      return a.timeMinutes - b.timeMinutes;
    });
  }
  
  /**
   * OSバランスの計算
   * @param {Object} osProfile - OSプロファイル
   * @returns {Object} バランス情報
   */
  calculateOSBalance(osProfile) {
    const scores = [osProfile.engine_score, osProfile.interface_score, osProfile.safemode_score];
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    const range = max - min;
    
    const weakestOS = ['engine', 'interface', 'safemode'][scores.indexOf(min)];
    
    return {
      isBalanced: range < 0.3,
      range,
      weakestOS,
      balanceScore: 1 - range // 0-1スケール
    };
  }
  
  /**
   * 弱いOS強化目標の生成
   * @param {string} weakOS - 強化対象OS
   * @returns {Array} 週次目標
   */
  generateWeakOSStrengtheningGoals(weakOS) {
    const goals = {
      engine: [
        '週3回、5分間の内省時間を確保',
        '自分の価値観について1つ新しい気づきを得る',
        '価値観に基づいた小さな決断を1つ実行'
      ],
      interface: [
        '週2回、新しい人と短い会話をする',
        '既存の関係で感謝を1回表現する',
        '他者の視点を理解する機会を1回作る'
      ],
      safemode: [
        '週1回、安全確保の仕組みを見直す',
        'ストレス軽減法を1つ新しく試す',
        '心理的安全感を高める環境づくりを1つ実行'
      ]
    };
    
    return goals[weakOS] || [];
  }
  
  /**
   * bunenjin哲学準拠性のチェック
   * @param {Object} actionPackage - 行動パッケージ
   * @returns {Object} 準拠性チェック結果
   */
  checkBunenjinCompliance(actionPackage) {
    const compliance = {
      isCompliant: true,
      issues: []
    };
    
    // 統一自己概念の押し付けチェック
    const hasUnifiedSelfLanguage = JSON.stringify(actionPackage).includes('本当の自分') ||
                                  JSON.stringify(actionPackage).includes('真の自分');
    
    if (hasUnifiedSelfLanguage) {
      compliance.isCompliant = false;
      compliance.issues.push('統一自己概念の言語が検出されました');
    }
    
    // 多様性尊重のチェック
    const respectsMultiplicity = JSON.stringify(actionPackage).includes('分人') ||
                                JSON.stringify(actionPackage).includes('多様');
    
    if (!respectsMultiplicity) {
      compliance.issues.push('分人多様性への言及が不足しています');
    }
    
    return compliance;
  }
  
  /**
   * 行動品質スコアの算出
   * @param {Object} actionPackage - 行動パッケージ
   * @returns {number} 品質スコア（0-1）
   */
  calculateActionQualityScore(actionPackage) {
    let score = 0;
    
    // 即座実行可能性 (0.3)
    if (actionPackage.immediate && actionPackage.immediate.length > 0) {
      score += 0.3;
    }
    
    // 短期実験の存在 (0.2)
    if (actionPackage.shortTerm && actionPackage.shortTerm.length > 0) {
      score += 0.2;
    }
    
    // 長期戦略の存在 (0.2)
    if (actionPackage.longTerm && Object.keys(actionPackage.longTerm).length > 0) {
      score += 0.2;
    }
    
    // bunenjin哲学統合 (0.3)
    const bunenjinCompliance = this.checkBunenjinCompliance(actionPackage);
    if (bunenjinCompliance.isCompliant) {
      score += 0.3;
    }
    
    return Math.min(score, 1.0);
  }
  
  /**
   * 難易度進行の計算
   * @param {Object} osProfile - OSプロファイル
   * @returns {Object} 難易度進行情報
   */
  calculateDifficultyProgression(osProfile) {
    const balance = this.calculateOSBalance(osProfile);
    
    // バランスが良いほど高難易度から開始可能
    let startingLevel = 'micro';
    if (balance.balanceScore > 0.7) {
      startingLevel = 'mini';
    } else if (balance.balanceScore > 0.5) {
      startingLevel = 'micro';
    }
    
    return {
      recommendedStartingLevel: startingLevel,
      progressionRate: balance.balanceScore,
      maxRecommendedLevel: balance.balanceScore > 0.8 ? 'moderate' : 'light'
    };
  }
}

// グローバルスコープで利用可能にする
if (typeof window !== "undefined") {
  window.ActionBridgeEngine = ActionBridgeEngine;
}

// Node.js環境での利用
if (typeof module !== "undefined" && module.exports) {
  module.exports = ActionBridgeEngine;
}