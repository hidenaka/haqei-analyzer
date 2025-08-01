/**
 * OSInteractionSimulator.js
 * Triple OS Architecture 相互作用シミュレーター
 * 
 * 目的:
 * - 本質的自己・社会的自己・防衛的自己の動的相互作用をシミュレート
 * - 様々な状況における3つのOSの反応パターンを分析
 * - bunenjin哲学に基づく複雑な人格相互作用の可視化
 * - 易経の変化の哲学を適用した動的システム
 * 
 * 処理内容:
 * 1. 状況設定による3OSの初期反応生成
 * 2. OS間の影響と調整プロセスのシミュレート
 * 3. 最終的な統合反応と行動選択の決定
 * 4. 相互作用パターンの分析と記録
 * 
 * 前提条件:
 * - VirtualPersonaEngineで生成された人格データ
 * - Triple OS Architectureの理解
 * - bunenjin哲学と易経の変化理論
 * 
 * 副作用:
 * - 相互作用履歴の記録と蓄積
 * - 人格発達パターンの学習
 * - 動的バランス調整の実行
 */

class OSInteractionSimulator {
  constructor(personaData) {
    this.personaData = personaData;
    this.interactionHistory = [];
    this.currentState = {
      essence: { activation: 0.5, influence: 0.33, stability: 0.8 },
      social: { activation: 0.5, influence: 0.33, stability: 0.8 },
      defense: { activation: 0.5, influence: 0.33, stability: 0.8 }
    };
    
    // 相互作用の重み係数（動的に調整される）
    this.interactionWeights = {
      essence_to_social: 0.3,
      essence_to_defense: 0.4,
      social_to_essence: 0.25,
      social_to_defense: 0.35,
      defense_to_essence: 0.45,
      defense_to_social: 0.2
    };
    
    // シミュレーション設定
    this.simulationConfig = {
      iterationLimit: 10,
      convergenceThreshold: 0.05,
      stabilityFactor: 0.1,
      randomnessFactor: 0.05
    };
    
    console.log('🔄 OSInteractionSimulator initialized - Triple OS dynamics ready');
  }

  /**
   * 状況に基づく相互作用シミュレーションの実行
   * 
   * 目的:
   * - 特定の状況での3OSの相互作用をシミュレート
   * - 各OSの初期反応から最終的な統合行動まで追跡
   * - 相互作用プロセスの詳細な記録
   * 
   * @param {Object} situation - シミュレート対象の状況
   * @param {Object} options - シミュレーションオプション
   * @returns {Object} シミュレーション結果
   */
  async simulateInteraction(situation, options = {}) {
    try {
      console.log('🎬 Starting OS interaction simulation:', situation.type);
      
      const simulation = {
        id: this.generateSimulationId(),
        situation: situation,
        timestamp: new Date().toISOString(),
        iterations: [],
        finalState: null,
        convergenceAchieved: false,
        metadata: {}
      };
      
      // Phase 1: 初期状態の設定
      this.resetSimulationState(situation);
      
      // Phase 2: 初期反応の生成
      const initialResponses = this.generateInitialResponses(situation);
      simulation.initialResponses = initialResponses;
      
      // Phase 3: 反復的相互作用シミュレーション
      let iteration = 0;
      let converged = false;
      
      while (iteration < this.simulationConfig.iterationLimit && !converged) {
        const iterationResult = await this.executeSimulationIteration(
          iteration, 
          situation, 
          initialResponses
        );
        
        simulation.iterations.push(iterationResult);
        
        // 収束判定
        converged = this.checkConvergence(iterationResult);
        iteration++;
      }
      
      // Phase 4: 最終状態の確定
      simulation.finalState = this.determineFinalState(simulation);
      simulation.convergenceAchieved = converged;
      
      // Phase 5: 相互作用パターンの分析
      simulation.analysisResults = this.analyzeInteractionPatterns(simulation);
      
      // Phase 6: 履歴への記録
      this.recordInteraction(simulation);
      
      console.log('✅ OS interaction simulation completed:', {
        iterations: simulation.iterations.length,
        converged: simulation.convergenceAchieved,
        finalBalance: this.calculateOSBalance(simulation.finalState)
      });
      
      return simulation;
      
    } catch (error) {
      console.error('❌ OS interaction simulation failed:', error);
      return this.createFallbackSimulation(situation, error);
    }
  }

  /**
   * 状況に対する各OSの初期反応生成
   * 
   * @param {Object} situation - 対象状況
   * @returns {Object} 各OSの初期反応
   */
  generateInitialResponses(situation) {
    const responses = {
      essence: this.generateEssenceResponse(situation),
      social: this.generateSocialResponse(situation),
      defense: this.generateDefenseResponse(situation)
    };
    
    // 各OSの特性に基づく重み付け
    responses.essence.weight = this.calculateResponseWeight('essence', situation);
    responses.social.weight = this.calculateResponseWeight('social', situation);
    responses.defense.weight = this.calculateResponseWeight('defense', situation);
    
    return responses;
  }

  /**
   * 本質的自己の初期反応生成
   */
  generateEssenceResponse(situation) {
    const persona = this.personaData.personas.essence;
    
    return {
      type: 'essence',
      priority: this.calculateEssencePriority(situation),
      response: this.generateEssenceResponseText(situation, persona),
      values: this.extractEssenceValues(situation, persona),
      intensity: this.calculateEssenceIntensity(situation, persona),
      concerns: this.identifyEssenceConcerns(situation, persona)
    };
  }

  /**
   * 社会的自己の初期反応生成
   */
  generateSocialResponse(situation) {
    const persona = this.personaData.personas.social;
    
    return {
      type: 'social',
      priority: this.calculateSocialPriority(situation),
      response: this.generateSocialResponseText(situation, persona),
      relationships: this.analyzeSocialImpact(situation, persona),
      adaptability: this.calculateSocialAdaptability(situation, persona),
      concerns: this.identifySocialConcerns(situation, persona)
    };
  }

  /**
   * 防衛的自己の初期反応生成
   */
  generateDefenseResponse(situation) {
    const persona = this.personaData.personas.defense;
    
    return {
      type: 'defense',
      priority: this.calculateDefensePriority(situation),
      response: this.generateDefenseResponseText(situation, persona),
      risks: this.identifyRisks(situation, persona),
      protections: this.suggestProtections(situation, persona),
      concerns: this.identifyDefenseConcerns(situation, persona)
    };
  }

  /**
   * シミュレーション反復の実行
   * 
   * @param {number} iteration - 反復回数
   * @param {Object} situation - 状況
   * @param {Object} initialResponses - 初期反応
   * @returns {Object} 反復結果
   */
  async executeSimulationIteration(iteration, situation, initialResponses) {
    const iterationResult = {
      iteration: iteration,
      timestamp: Date.now(),
      interactions: [],
      stateChanges: {},
      convergenceMetrics: {}
    };
    
    // 各OS間の相互作用を計算
    const interactions = [
      this.simulateOSInteraction('essence', 'social', situation),
      this.simulateOSInteraction('essence', 'defense', situation),
      this.simulateOSInteraction('social', 'essence', situation),
      this.simulateOSInteraction('social', 'defense', situation),
      this.simulateOSInteraction('defense', 'essence', situation),
      this.simulateOSInteraction('defense', 'social', situation)
    ];
    
    iterationResult.interactions = interactions;
    
    // 状態の更新
    iterationResult.stateChanges = this.updateSimulationState(interactions);
    
    // 収束メトリクスの計算
    iterationResult.convergenceMetrics = this.calculateConvergenceMetrics(iterationResult);
    
    return iterationResult;
  }

  /**
   * 2つのOS間の相互作用をシミュレート
   * 
   * @param {string} sourceOS - 影響を与えるOS
   * @param {string} targetOS - 影響を受けるOS
   * @param {Object} situation - 状況コンテキスト
   * @returns {Object} 相互作用結果
   */
  simulateOSInteraction(sourceOS, targetOS, situation) {
    const sourceState = this.currentState[sourceOS];
    const targetState = this.currentState[targetOS];
    const interactionWeight = this.interactionWeights[`${sourceOS}_to_${targetOS}`];
    
    const interaction = {
      from: sourceOS,
      to: targetOS,
      weight: interactionWeight,
      influence: this.calculateInfluence(sourceState, targetState, situation),
      adjustment: this.calculateAdjustment(sourceOS, targetOS, situation),
      dialogue: this.generateInteractionDialogue(sourceOS, targetOS, situation)
    };
    
    return interaction;
  }

  /**
   * 相互作用の影響力を計算
   */
  calculateInfluence(sourceState, targetState, situation) {
    const baseInfluence = sourceState.activation * sourceState.influence;
    const receptivity = 1 - targetState.stability;
    const situationalFactor = this.getSituationalFactor(situation);
    
    return baseInfluence * receptivity * situationalFactor;
  }

  /**
   * 状態調整値を計算
   */
  calculateAdjustment(sourceOS, targetOS, situation) {
    const compatibility = this.getOSCompatibility(sourceOS, targetOS);
    const situationalPressure = this.getSituationalPressure(situation, targetOS);
    const randomFactor = (Math.random() - 0.5) * this.simulationConfig.randomnessFactor;
    
    return compatibility * situationalPressure + randomFactor;
  }

  /**
   * OS間の対話を生成
   */
  generateInteractionDialogue(sourceOS, targetOS, situation) {
    const sourcePersona = this.personaData.personas[sourceOS];
    const targetPersona = this.personaData.personas[targetOS];
    
    return {
      source: {
        name: sourcePersona.name,
        message: this.generateOSMessage(sourceOS, targetOS, situation, 'influence')
      },
      target: {
        name: targetPersona.name,
        message: this.generateOSMessage(targetOS, sourceOS, situation, 'response')
      }
    };
  }

  /**
   * OSメッセージの生成
   */
  generateOSMessage(fromOS, toOS, situation, messageType) {
    const messageTemplates = {
      essence: {
        influence: [
          "この状況では、本質的な価値を重視すべきです",
          "長期的な意味を考慮してください",
          "自分らしさを保つことが重要です"
        ],
        response: [
          "その視点も理解できますが、価値観との整合性を確認したいです",
          "本質的な部分で妥協したくありません",
          "より深い意味を見出したいと思います"
        ]
      },
      social: {
        influence: [
          "周囲への影響も考慮しましょう",
          "協調性を保つことが大切です",
          "関係性を維持する方法を検討しませんか"
        ],
        response: [
          "人間関係への配慮も必要ですね",
          "みんなにとって良い方法を探したいです",
          "協力的な解決策を見つけましょう"
        ]
      },
      defense: {
        influence: [
          "リスクを慎重に評価しましょう",
          "安全性を確保することが優先です",
          "長期的な安定性を考慮してください"
        ],
        response: [
          "確かに慎重さは必要ですね",
          "リスク管理は重要な視点です",
          "安全な選択肢を検討しましょう"
        ]
      }
    };
    
    const templates = messageTemplates[fromOS][messageType];
    const randomIndex = Math.floor(Math.random() * templates.length);
    return templates[randomIndex];
  }

  /**
   * シミュレーション状態の更新
   */
  updateSimulationState(interactions) {
    const stateChanges = {
      essence: { activation: 0, influence: 0, stability: 0 },
      social: { activation: 0, influence: 0, stability: 0 },
      defense: { activation: 0, influence: 0, stability: 0 }
    };
    
    // 各相互作用による状態変化を積算
    interactions.forEach(interaction => {
      const change = interaction.adjustment * interaction.influence;
      stateChanges[interaction.to].activation += change * 0.4;
      stateChanges[interaction.to].influence += change * 0.3;
      stateChanges[interaction.to].stability += change * 0.3;
    });
    
    // 状態の更新（制限値内に収める）
    Object.keys(stateChanges).forEach(osType => {
      Object.keys(stateChanges[osType]).forEach(property => {
        this.currentState[osType][property] = Math.max(0, Math.min(1, 
          this.currentState[osType][property] + stateChanges[osType][property]
        ));
      });
    });
    
    return stateChanges;
  }

  /**
   * 収束判定
   */
  checkConvergence(iterationResult) {
    const totalChange = Object.values(iterationResult.stateChanges)
      .reduce((sum, osChanges) => {
        return sum + Object.values(osChanges)
          .reduce((osSum, change) => osSum + Math.abs(change), 0);
      }, 0);
    
    return totalChange < this.simulationConfig.convergenceThreshold;
  }

  /**
   * 最終状態の決定
   */
  determineFinalState(simulation) {
    const finalIteration = simulation.iterations[simulation.iterations.length - 1];
    
    return {
      osStates: { ...this.currentState },
      dominantOS: this.identifyDominantOS(),
      balance: this.calculateOSBalance(this.currentState),
      stability: this.calculateOverallStability(),
      finalDecision: this.generateFinalDecision(simulation),
      confidence: this.calculateDecisionConfidence(simulation)
    };
  }

  /**
   * 相互作用パターンの分析
   */
  analyzeInteractionPatterns(simulation) {
    return {
      communicationFlow: this.analyzeCommunicationFlow(simulation),
      influencePatterns: this.analyzeInfluencePatterns(simulation),
      conflictResolution: this.analyzeConflictResolution(simulation),
      emergentBehaviors: this.identifyEmergentBehaviors(simulation),
      learningOpportunities: this.identifyLearningOpportunities(simulation)
    };
  }

  /**
   * ヘルパーメソッド群
   */
  generateSimulationId() {
    return `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 本質的自己の反応生成関連メソッド
  calculateEssencePriority(situation) {
    const priorityMap = {
      'creative_challenge': 0.9,
      'value_alignment': 0.95,
      'social_conflict': 0.6,
      'risk_assessment': 0.4
    };
    return priorityMap[situation.type] || 0.5;
  }

  generateEssenceResponseText(situation, persona) {
    const responses = {
      'creative_challenge': `${persona.name}として、この創造的な挑戦に心から取り組みたいと感じます。`,
      'value_alignment': `自分の核となる価値観を大切にしながら、この状況に向き合いたいです。`,
      'social_conflict': `人間関係は大切ですが、自分の本質を見失わないことも重要です。`,
      'risk_assessment': `リスクは気になりますが、本当に価値あることなら挑戦する意味があります。`
    };
    return responses[situation.type] || `${persona.name}として、この状況を自分らしく捉えたいと思います。`;
  }

  extractEssenceValues(situation, persona) {
    return ['authenticity', 'creativity', 'meaning', 'growth'];
  }

  calculateEssenceIntensity(situation, persona) {
    return Math.min(1.0, (persona.intensity || 0.7) * this.calculateEssencePriority(situation));
  }

  identifyEssenceConcerns(situation, persona) {
    return ['価値観の妥協', '本質からの逸脱', '意味の喪失'];
  }

  // 社会的自己の反応生成関連メソッド
  calculateSocialPriority(situation) {
    const priorityMap = {
      'social_conflict': 0.95,
      'creative_challenge': 0.6,
      'value_alignment': 0.7,
      'risk_assessment': 0.75
    };
    return priorityMap[situation.type] || 0.5;
  }

  generateSocialResponseText(situation, persona) {
    const responses = {
      'social_conflict': `${persona.name}として、関係者全員にとって良い解決策を見つけたいです。`,
      'creative_challenge': `周囲の人たちと協力して、より良い成果を生み出せるでしょう。`,
      'value_alignment': `自分の価値観を大切にしつつ、他者との調和も図りたいです。`,
      'risk_assessment': `チーム全体への影響も考慮して、慎重に判断したいと思います。`
    };
    return responses[situation.type] || `${persona.name}として、人との関係性を大切に考えたいです。`;
  }

  analyzeSocialImpact(situation, persona) {
    return {
      stakeholders: ['family', 'friends', 'colleagues'],
      impactLevel: 0.7,
      relationshipRisk: 0.3
    };
  }

  calculateSocialAdaptability(situation, persona) {
    return persona.adaptability || 0.8;
  }

  identifySocialConcerns(situation, persona) {
    return ['関係性の悪化', '孤立のリスク', '協調性の欠如'];
  }

  // 防衛的自己の反応生成関連メソッド
  calculateDefensePriority(situation) {
    const priorityMap = {
      'risk_assessment': 0.95,
      'social_conflict': 0.8,
      'creative_challenge': 0.5,
      'value_alignment': 0.6
    };
    return priorityMap[situation.type] || 0.5;
  }

  generateDefenseResponseText(situation, persona) {
    const responses = {
      'risk_assessment': `${persona.name}として、潜在的なリスクを慎重に評価する必要があります。`,
      'social_conflict': `対立が拡大しないよう、慎重にアプローチすることが重要です。`,
      'creative_challenge': `新しい挑戦は魅力的ですが、準備と計画が不可欠です。`,
      'value_alignment': `価値観を大切にしつつも、現実的な制約も考慮すべきです。`
    };
    return responses[situation.type] || `${persona.name}として、安全性を最優先に考えたいです。`;
  }

  identifyRisks(situation, persona) {
    const riskMap = {
      'creative_challenge': ['失敗のリスク', '時間的コスト', '機会費用'],
      'social_conflict': ['関係悪化', '評判への影響', '精神的ストレス'],
      'risk_assessment': ['財務的損失', '安全性の問題', '長期的影響'],
      'value_alignment': ['価値観の妥協', '後悔のリスク', '一貫性の欠如']
    };
    return riskMap[situation.type] || ['不確実性', '予期しない結果'];
  }

  suggestProtections(situation, persona) {
    return ['段階的アプローチ', '事前準備の徹底', 'バックアッププランの策定'];
  }

  identifyDefenseConcerns(situation, persona) {
    return ['過度のリスク', '準備不足', '不確実な結果'];
  }

  // 相互作用計算関連メソッド
  calculateResponseWeight(osType, situation) {
    const basePriority = this[`calculate${osType.charAt(0).toUpperCase() + osType.slice(1)}Priority`](situation);
    const situationalFactor = this.getSituationalFactor(situation);
    return basePriority * situationalFactor;
  }

  getSituationalFactor(situation) {
    const factors = {
      'creative_challenge': 1.2,
      'social_conflict': 1.1,
      'risk_assessment': 1.3,
      'value_alignment': 1.0
    };
    return factors[situation.type] || 1.0;
  }

  getSituationalPressure(situation, targetOS) {
    const pressureMatrix = {
      'creative_challenge': { essence: 0.8, social: 0.5, defense: 0.3 },
      'social_conflict': { essence: 0.4, social: 0.9, defense: 0.6 },
      'risk_assessment': { essence: 0.3, social: 0.6, defense: 0.9 },
      'value_alignment': { essence: 0.9, social: 0.7, defense: 0.5 }
    };
    return pressureMatrix[situation.type]?.[targetOS] || 0.5;
  }

  getOSCompatibility(sourceOS, targetOS) {
    const compatibilityMatrix = {
      'essence_social': 0.7,
      'essence_defense': 0.4,
      'social_essence': 0.6,
      'social_defense': 0.8,
      'defense_essence': 0.3,
      'defense_social': 0.7
    };
    return compatibilityMatrix[`${sourceOS}_${targetOS}`] || 0.5;
  }

  calculateConvergenceMetrics(iterationResult) {
    const totalChange = Object.values(iterationResult.stateChanges)
      .reduce((sum, osChanges) => {
        return sum + Object.values(osChanges)
          .reduce((osSum, change) => osSum + Math.abs(change), 0);
      }, 0);
    
    return {
      totalChange: totalChange,
      maxIndividualChange: Math.max(...Object.values(iterationResult.stateChanges)
        .map(osChanges => Math.max(...Object.values(osChanges).map(Math.abs)))),
      averageInfluence: iterationResult.interactions
        .reduce((sum, interaction) => sum + interaction.influence, 0) / iterationResult.interactions.length
    };
  }

  calculateOverallStability() {
    const states = this.currentState;
    return (states.essence.stability + states.social.stability + states.defense.stability) / 3;
  }

  generateFinalDecision(simulation) {
    const finalState = simulation.finalState || simulation;
    const dominantOS = finalState.dominantOS;
    const situation = simulation.situation;
    
    const decisionTemplates = {
      essence: {
        'creative_challenge': 'この創造的挑戦に全力で取り組み、自分らしい価値を生み出すことを決断します。',
        'social_conflict': '自分の価値観を大切にしながら、建設的な対話を通じて解決を図ります。',
        'risk_assessment': '本質的に価値があると判断されるため、慎重に準備してリスクを取ります。',
        'value_alignment': '核となる価値観に忠実に、一貫性を保った選択をします。'
      },
      social: {
        'creative_challenge': 'チームワークを活かして、協力的にプロジェクトを進めることを選択します。',
        'social_conflict': '全関係者の立場を理解し、互いに納得できる解決策を模索します。',
        'risk_assessment': '関係者との合意形成を重視し、共同でリスク管理を行います。',
        'value_alignment': '個人の価値観と社会的責任のバランスを取った判断をします。'
      },
      defense: {
        'creative_challenge': '十分な準備と計画を立て、段階的にリスクを管理しながら進めます。',
        'social_conflict': '冷静に状況を分析し、感情的な対立を避けて合理的な解決を図ります。',
        'risk_assessment': 'リスクを最小限に抑える安全な選択肢を慎重に検討し実行します。',
        'value_alignment': '現実的な制約を考慮しつつ、可能な範囲で価値観を実現します。'
      }
    };
    
    return decisionTemplates[dominantOS]?.[situation.type] || 
           '複合的な視点から総合的に判断し、バランスの取れた決断を行います。';
  }

  calculateDecisionConfidence(simulation) {
    const convergenceBonus = simulation.convergenceAchieved ? 0.2 : 0;
    const balanceScore = this.calculateBalanceScore(simulation.finalState.balance);
    const iterationPenalty = Math.min(0.1, simulation.iterations.length * 0.01);
    
    return Math.max(0.1, Math.min(1.0, 0.6 + convergenceBonus + balanceScore - iterationPenalty));
  }

  calculateBalanceScore(balance) {
    // バランスが取れているほど高スコア（完全に均等だと0.2、一極集中で0）
    const entropy = -Object.values(balance).reduce((sum, val) => 
      sum + (val > 0 ? val * Math.log(val) : 0), 0) / Math.log(3);
    return entropy * 0.2;
  }

  // 分析メソッド群
  analyzeCommunicationFlow(simulation) {
    const interactions = simulation.iterations.flatMap(iter => iter.interactions);
    const flowCounts = {};
    
    interactions.forEach(interaction => {
      const key = `${interaction.from}_to_${interaction.to}`;
      flowCounts[key] = (flowCounts[key] || 0) + 1;
    });
    
    return {
      totalInteractions: interactions.length,
      flowDistribution: flowCounts,
      dominantFlow: Object.entries(flowCounts)
        .sort(([,a], [,b]) => b - a)[0]
    };
  }

  analyzeInfluencePatterns(simulation) {
    const interactions = simulation.iterations.flatMap(iter => iter.interactions);
    const influenceByOS = { essence: 0, social: 0, defense: 0 };
    
    interactions.forEach(interaction => {
      influenceByOS[interaction.from] += interaction.influence;
    });
    
    return {
      totalInfluence: Object.values(influenceByOS).reduce((a, b) => a + b, 0),
      influenceDistribution: influenceByOS,
      mostInfluentialOS: Object.entries(influenceByOS)
        .sort(([,a], [,b]) => b - a)[0][0]
    };
  }

  analyzeConflictResolution(simulation) {
    const iterations = simulation.iterations;
    const conflictReduction = iterations.length > 1 ? 
      (iterations[0].convergenceMetrics.totalChange - 
       iterations[iterations.length - 1].convergenceMetrics.totalChange) : 0;
    
    return {
      initialConflict: iterations[0]?.convergenceMetrics?.totalChange || 0,
      finalConflict: iterations[iterations.length - 1]?.convergenceMetrics?.totalChange || 0,
      conflictReduction: conflictReduction,
      resolutionEfficiency: conflictReduction / iterations.length
    };
  }

  identifyEmergentBehaviors(simulation) {
    return [
      '適応的バランス調整',
      '段階的収束パターン',
      'OS間相互学習'
    ];
  }

  identifyLearningOpportunities(simulation) {
    return [
      '本質的価値観の明確化',
      '社会的適応力の向上',
      '防衛メカニズムの最適化'
    ];
  }

  resetSimulationState(situation) {
    // 状況に応じた初期状態の調整
    const adjustment = this.getSituationalAdjustment(situation);
    
    Object.keys(this.currentState).forEach(osType => {
      this.currentState[osType].activation = 0.5 + (adjustment[osType] || 0);
      this.currentState[osType].influence = 0.33;
      this.currentState[osType].stability = 0.8;
    });
  }

  getSituationalAdjustment(situation) {
    const adjustments = {
      'creative_challenge': { essence: 0.2, social: 0, defense: -0.1 },
      'social_conflict': { essence: 0, social: 0.3, defense: 0.1 },
      'risk_assessment': { essence: -0.1, social: 0, defense: 0.3 },
      'value_alignment': { essence: 0.3, social: 0.1, defense: 0 }
    };
    
    return adjustments[situation.type] || { essence: 0, social: 0, defense: 0 };
  }

  calculateOSBalance(state) {
    const total = state.essence.activation + state.social.activation + state.defense.activation;
    return {
      essence: state.essence.activation / total,
      social: state.social.activation / total,
      defense: state.defense.activation / total
    };
  }

  identifyDominantOS() {
    const states = this.currentState;
    let maxActivation = 0;
    let dominantOS = null;
    
    Object.keys(states).forEach(osType => {
      if (states[osType].activation > maxActivation) {
        maxActivation = states[osType].activation;
        dominantOS = osType;
      }
    });
    
    return dominantOS;
  }

  recordInteraction(simulation) {
    this.interactionHistory.push({
      id: simulation.id,
      timestamp: simulation.timestamp,
      situation: simulation.situation.type,
      iterations: simulation.iterations.length,
      convergenceAchieved: simulation.convergenceAchieved,
      finalBalance: simulation.finalState.balance,
      dominantOS: simulation.finalState.dominantOS
    });
    
    // 履歴サイズの制限
    if (this.interactionHistory.length > 100) {
      this.interactionHistory.shift();
    }
  }

  createFallbackSimulation(situation, error) {
    return {
      id: this.generateSimulationId(),
      situation: situation,
      error: error.message,
      fallback: true,
      finalState: {
        osStates: this.currentState,
        dominantOS: 'essence',
        balance: { essence: 0.33, social: 0.33, defense: 0.34 },
        finalDecision: '状況の分析中にエラーが発生しました',
        confidence: 0.1
      }
    };
  }

  /**
   * 公開API：事前定義された状況パターンでのシミュレーション
   */
  async simulateCommonScenarios() {
    const scenarios = [
      {
        type: 'creative_challenge',
        name: '創造的挑戦',
        description: '新しいプロジェクトや創造的な課題に直面した状況'
      },
      {
        type: 'social_conflict', 
        name: '社会的対立',
        description: '人間関係での対立や意見の相違が生じた状況'
      },
      {
        type: 'risk_assessment',
        name: 'リスク評価',
        description: '重要な決断でリスクを評価する必要がある状況'
      },
      {
        type: 'value_alignment',
        name: '価値観の調整',
        description: '個人の価値観と外部の要求が衝突した状況'
      }
    ];
    
    const results = [];
    for (const scenario of scenarios) {
      const simulation = await this.simulateInteraction(scenario);
      results.push(simulation);
    }
    
    return results;
  }

  /**
   * シミュレーション履歴の取得
   */
  getInteractionHistory() {
    return [...this.interactionHistory];
  }

  /**
   * 現在の状態取得
   */
  getCurrentState() {
    return { ...this.currentState };
  }
}

// グローバル登録
if (typeof window !== 'undefined') {
  window.OSInteractionSimulator = OSInteractionSimulator;
}

console.log('🔄 OSInteractionSimulator loaded - Triple OS dynamics system ready');