/**
 * OSRelationshipEngine.js - HAQEI OS関係性エンジン
 * 
 * 3つのOS人格間の複雑な関係性をシミュレーション・分析するエンジン
 * - OS間相互作用の動的分析
 * - 内部対話・葛藤・調和パターンの生成
 * - 状況別OS主導権の予測
 * - 人格統合レベルの評価
 * 
 * @version 1.0.0
 * @date 2025-07-31
 */

class OSRelationshipEngine {
  constructor(virtualPersonality) {
    this.virtualPersonality = virtualPersonality;
    this.engineOS = virtualPersonality.engineOS;
    this.interfaceOS = virtualPersonality.interfaceOS;
    this.safeModeOS = virtualPersonality.safeModeOS;
    
    // 関係性マトリックス
    this.relationshipMatrix = this.initializeRelationshipMatrix();
    
    // パターン分析
    this.conflictPatterns = {};
    this.harmonyPatterns = {};
    this.dominanceHistory = [];
    this.negotiationHistory = [];
    
    // 動的状態
    this.currentRelationshipState = 'neutral';
    this.overallIntegrationLevel = 0.0;
    this.relationshipTension = 0.0;
    
    // シミュレーション設定
    this.simulationDepth = 3; // 対話ラウンド数
    this.consensusThreshold = 0.7; // 合意形成の閾値
    
    console.log('🔗 OSRelationshipEngine initialized');
    
    // 初期関係性分析
    this.analyzeInitialRelationships();
  }

  /**
   * 関係性マトリックスの初期化
   */
  initializeRelationshipMatrix() {
    return {
      'engine-interface': {
        compatibility: 0.0,
        trust: 0.5,
        cooperation: 0.0,
        conflict: 0.0,
        influence: { engine: 0.5, interface: 0.5 },
        commonGround: [],
        tensionPoints: [],
        communicationStyle: 'unknown'
      },
      'engine-safemode': {
        compatibility: 0.0,
        trust: 0.5,
        cooperation: 0.0,
        conflict: 0.0,
        influence: { engine: 0.5, safemode: 0.5 },
        commonGround: [],
        tensionPoints: [],
        communicationStyle: 'unknown'
      },
      'interface-safemode': {
        compatibility: 0.0,
        trust: 0.5,
        cooperation: 0.0,
        conflict: 0.0,
        influence: { interface: 0.5, safemode: 0.5 },
        commonGround: [],
        tensionPoints: [],
        communicationStyle: 'unknown'
      }
    };
  }

  /**
   * 初期関係性の分析
   */
  async analyzeInitialRelationships() {
    console.log('🔍 Analyzing initial OS relationships...');
    
    try {
      // Engine-Interface関係性
      await this.analyzeOSPairRelationship('engine', 'interface');
      
      // Engine-SafeMode関係性
      await this.analyzeOSPairRelationship('engine', 'safemode');
      
      // Interface-SafeMode関係性
      await this.analyzeOSPairRelationship('interface', 'safemode');
      
      // 全体的な統合レベルを計算
      this.calculateOverallIntegrationLevel();
      
      // 関係性の緊張度を評価
      this.evaluateRelationshipTension();
      
      console.log('✅ Initial relationship analysis completed');
      
    } catch (error) {
      console.error('❌ Error in initial relationship analysis:', error);
      this.initializeDefaultRelationships();
    }
  }

  /**
   * OS ペア間の関係性分析
   */
  async analyzeOSPairRelationship(osType1, osType2) {
    const key = `${osType1}-${osType2}`;
    const os1 = this.virtualPersonality[`${osType1}OS`];
    const os2 = this.virtualPersonality[`${osType2}OS`];
    
    if (!os1 || !os2) {
      console.warn(`⚠️ OS not found: ${osType1} or ${osType2}`);
      return;
    }

    const relationship = this.relationshipMatrix[key];
    
    // 互換性分析
    relationship.compatibility = this.calculateCompatibility(os1, os2);
    
    // 信頼度評価
    relationship.trust = this.evaluateTrust(os1, os2);
    
    // 協力度と対立度
    relationship.cooperation = this.assessCooperation(os1, os2);
    relationship.conflict = this.assessConflict(os1, os2);
    
    // 影響力バランス
    relationship.influence = this.calculateInfluenceBalance(os1, os2);
    
    // 共通基盤と緊張点
    relationship.commonGround = this.identifyCommonGround(os1, os2);
    relationship.tensionPoints = this.identifyTensionPoints(os1, os2);
    
    // コミュニケーションスタイル
    relationship.communicationStyle = this.determineCommunicationStyle(os1, os2);
    
    console.log(`📊 ${key} relationship analyzed:`, {
      compatibility: relationship.compatibility.toFixed(3),
      cooperation: relationship.cooperation.toFixed(3),
      conflict: relationship.conflict.toFixed(3)
    });
  }

  /**
   * OS間互換性の計算
   */
  calculateCompatibility(os1, os2) {
    // 特性の重複度
    const traitOverlap = this.calculateTraitOverlap(os1, os2);
    
    // 活性度の調和
    const activationHarmony = this.calculateActivationHarmony(os1, os2);
    
    // 決定スタイルの適合性
    const decisionStyleMatch = this.calculateDecisionStyleMatch(os1, os2);
    
    // 重み付き平均
    return (traitOverlap * 0.4 + activationHarmony * 0.3 + decisionStyleMatch * 0.3);
  }

  /**
   * 特性重複度の計算
   */
  calculateTraitOverlap(os1, os2) {
    const traits1 = os1.characteristics.primary_traits || [];
    const traits2 = os2.characteristics.primary_traits || [];
    
    if (traits1.length === 0 || traits2.length === 0) return 0.5;
    
    const intersection = traits1.filter(trait => traits2.includes(trait));
    const union = [...new Set([...traits1, ...traits2])];
    
    return union.length > 0 ? intersection.length / union.length : 0.5;
  }

  /**
   * 活性度調和の計算
   */
  calculateActivationHarmony(os1, os2) {
    const activation1 = os1.activation || 0.5;
    const activation2 = os2.activation || 0.5;
    
    const difference = Math.abs(activation1 - activation2);
    return 1 - difference; // 差が小さいほど調和
  }

  /**
   * 決定スタイル適合性の計算
   */
  calculateDecisionStyleMatch(os1, os2) {
    // 簡略化された実装
    const styleCompatibility = {
      'engine-interface': 0.7,
      'engine-safemode': 0.5,
      'interface-safemode': 0.8
    };
    
    const key = `${os1.osType}-${os2.osType}`;
    const reverseKey = `${os2.osType}-${os1.osType}`;
    
    return styleCompatibility[key] || styleCompatibility[reverseKey] || 0.5;
  }

  /**
   * 信頼度評価
   */
  evaluateTrust(os1, os2) {
    // 過去の協力履歴があれば参照
    const historyKey = os2.osType;
    const history = os1.relationshipHistory[historyKey];
    
    if (history) {
      const trustFromHistory = history.cooperation - (history.conflict * 0.5);
      return Math.max(0, Math.min(1, 0.5 + trustFromHistory));
    }
    
    // デフォルトは中程度の信頼
    return 0.5;
  }

  /**
   * 協力度評価
   */
  assessCooperation(os1, os2) {
    // 特性の補完性を評価
    const complementarity = this.calculateComplementarity(os1, os2);
    
    // 共通目標の有無
    const sharedGoals = this.identifySharedGoals(os1, os2);
    
    return (complementarity + sharedGoals) / 2;
  }

  /**
   * 特性補完性の計算
   */
  calculateComplementarity(os1, os2) {
    // OSタイプ別の補完性マップ
    const complementarityMap = {
      'engine-interface': 0.8, // 理想と現実のバランス
      'engine-safemode': 0.6,  // 創造性と慎重性
      'interface-safemode': 0.9 // 社交性と安全性
    };
    
    const key = `${os1.osType}-${os2.osType}`;
    const reverseKey = `${os2.osType}-${os1.osType}`;
    
    return complementarityMap[key] || complementarityMap[reverseKey] || 0.5;
  }

  /**
   * 共通目標の特定
   */
  identifySharedGoals(os1, os2) {
    // 簡略化された実装
    // 実際にはOS特性から共通目標を抽出
    return Math.random() * 0.3 + 0.4; // 0.4-0.7の範囲
  }

  /**
   * 対立度評価
   */
  assessConflict(os1, os2) {
    // 特性の対立
    const traitConflict = this.calculateTraitConflict(os1, os2);
    
    // 優先順位の衝突
    const priorityConflict = this.calculatePriorityConflict(os1, os2);
    
    return (traitConflict + priorityConflict) / 2;
  }

  /**
   * 特性対立の計算
   */
  calculateTraitConflict(os1, os2) {
    // OSタイプ別の潜在的対立レベル
    const conflictMap = {
      'engine-interface': 0.3, // 理想 vs 現実的配慮
      'engine-safemode': 0.5,  // 創造性 vs 慎重性
      'interface-safemode': 0.2 // 比較的協調的
    };
    
    const key = `${os1.osType}-${os2.osType}`;
    const reverseKey = `${os2.osType}-${os1.osType}`;
    
    return conflictMap[key] || conflictMap[reverseKey] || 0.3;
  }

  /**
   * 優先順位衝突の計算
   */
  calculatePriorityConflict(os1, os2) {
    // OS固有の優先順位の違いを評価
    const priorities1 = os1.personality.priorities || [];
    const priorities2 = os2.personality.priorities || [];
    
    // 簡略化: 長さの違いから対立度を推定
    if (priorities1.length === 0 || priorities2.length === 0) return 0.3;
    
    const conflictingPriorities = priorities1.filter(p1 => 
      priorities2.some(p2 => this.arePrioritiesConflicting(p1, p2))
    );
    
    return conflictingPriorities.length / Math.max(priorities1.length, priorities2.length);
  }

  /**
   * 優先順位の対立判定
   */
  arePrioritiesConflicting(priority1, priority2) {
    // 簡略化された対立判定
    const conflictPairs = [
      ['安全性', '冒険性'],
      ['個人主義', '集団主義'],
      ['完璧主義', '効率性']
    ];
    
    return conflictPairs.some(pair => 
      (pair[0] === priority1 && pair[1] === priority2) ||
      (pair[1] === priority1 && pair[0] === priority2)
    );
  }

  /**
   * 影響力バランスの計算
   */
  calculateInfluenceBalance(os1, os2) {
    const activation1 = os1.activation || 0.5;
    const activation2 = os2.activation || 0.5;
    const dominance1 = os1.dominance || 0.5;
    const dominance2 = os2.dominance || 0.5;
    
    const influence1 = (activation1 + dominance1) / 2;
    const influence2 = (activation2 + dominance2) / 2;
    
    const total = influence1 + influence2;
    
    if (total === 0) {
      return { [os1.osType]: 0.5, [os2.osType]: 0.5 };
    }
    
    return {
      [os1.osType]: influence1 / total,
      [os2.osType]: influence2 / total
    };
  }

  /**
   * 共通基盤の特定
   */
  identifyCommonGround(os1, os2) {
    const commonGround = [];
    
    // 共通特性
    const traits1 = os1.characteristics.primary_traits || [];
    const traits2 = os2.characteristics.primary_traits || [];
    const sharedTraits = traits1.filter(trait => traits2.includes(trait));
    
    commonGround.push(...sharedTraits.map(trait => `共通特性: ${trait}`));
    
    // OSタイプ別の自然な共通点
    const osTypeCommonalities = {
      'engine-interface': ['創造的表現', '自己実現'],
      'engine-safemode': ['長期視点', '価値観の保護'],
      'interface-safemode': ['関係性の安定', '調和の維持']
    };
    
    const key = `${os1.osType}-${os2.osType}`;
    const reverseKey = `${os2.osType}-${os1.osType}`;
    const typeCommonalities = osTypeCommonalities[key] || osTypeCommonalities[reverseKey] || [];
    
    commonGround.push(...typeCommonalities);
    
    return commonGround;
  }

  /**
   * 緊張点の特定
   */
  identifyTensionPoints(os1, os2) {
    const tensionPoints = [];
    
    // OSタイプ別の典型的緊張点
    const typeTensions = {
      'engine-interface': ['理想と現実のギャップ', '独創性と協調性の対立'],
      'engine-safemode': ['創造性とリスク回避の矛盾', '変化と安定の対立'],
      'interface-safemode': ['開放性と慎重性の対立', '社交性と警戒心の矛盾']
    };
    
    const key = `${os1.osType}-${os2.osType}`;
    const reverseKey = `${os2.osType}-${os1.osType}`;
    const typicalTensions = typeTensions[key] || typeTensions[reverseKey] || [];
    
    tensionPoints.push(...typicalTensions);
    
    // 活性度の大きな差も緊張の原因
    const activationDiff = Math.abs((os1.activation || 0.5) - (os2.activation || 0.5));
    if (activationDiff > 0.3) {
      tensionPoints.push('活性度の大きな差');
    }
    
    return tensionPoints;
  }

  /**
   * コミュニケーションスタイルの決定
   */
  determineCommunicationStyle(os1, os2) {
    const compatibility = this.relationshipMatrix[`${os1.osType}-${os2.osType}`]?.compatibility || 0.5;
    const conflict = this.relationshipMatrix[`${os1.osType}-${os2.osType}`]?.conflict || 0.3;
    
    if (compatibility > 0.7 && conflict < 0.3) {
      return 'collaborative'; // 協調的
    } else if (compatibility > 0.5 && conflict < 0.5) {
      return 'diplomatic'; // 外交的
    } else if (conflict > 0.6) {
      return 'competitive'; // 競合的
    } else {
      return 'cautious'; // 慎重
    }
  }

  /**
   * 全体的統合レベルの計算
   */
  calculateOverallIntegrationLevel() {
    const relationships = Object.values(this.relationshipMatrix);
    
    const avgCompatibility = relationships.reduce((sum, rel) => sum + rel.compatibility, 0) / relationships.length;
    const avgCooperation = relationships.reduce((sum, rel) => sum + rel.cooperation, 0) / relationships.length;
    const avgConflict = relationships.reduce((sum, rel) => sum + rel.conflict, 0) / relationships.length;
    
    // 統合レベル = (互換性 + 協力度 - 対立度) の正規化
    this.overallIntegrationLevel = Math.max(0, Math.min(1, 
      (avgCompatibility + avgCooperation - avgConflict) / 2
    ));
    
    console.log(`🧩 Overall integration level: ${this.overallIntegrationLevel.toFixed(3)}`);
  }

  /**
   * 関係性緊張度の評価
   */
  evaluateRelationshipTension() {
    const relationships = Object.values(this.relationshipMatrix);
    
    const avgConflict = relationships.reduce((sum, rel) => sum + rel.conflict, 0) / relationships.length;
    const maxConflict = Math.max(...relationships.map(rel => rel.conflict));
    
    // 緊張度 = 平均対立 * 1.5 + 最大対立 * 0.5
    this.relationshipTension = Math.min(1, (avgConflict * 1.5 + maxConflict * 0.5) / 2);
    
    console.log(`⚡ Relationship tension: ${this.relationshipTension.toFixed(3)}`);
  }

  /**
   * 複雑な内部対話のシミュレーション
   */
  simulateComplexInternalDialogue(scenario, options = {}) {
    console.log(`💬 Simulating complex internal dialogue for: "${scenario}"`);
    
    const dialogue = {
      scenario,
      timestamp: new Date(),
      rounds: [],
      finalConsensus: null,
      consensusLevel: 0.0,
      dominantVoice: null,
      relationshipChanges: {}
    };
    
    try {
      // 多ラウンドの対話をシミュレーション
      for (let round = 1; round <= this.simulationDepth; round++) {
        const roundResult = this.simulateDialogueRound(scenario, round, dialogue.rounds);
        dialogue.rounds.push(roundResult);
        
        // 早期合意チェック
        if (roundResult.consensusLevel > this.consensusThreshold) {
          console.log(`🤝 Early consensus reached in round ${round}`);
          break;
        }
      }
      
      // 最終合意の形成
      dialogue.finalConsensus = this.formFinalConsensus(dialogue.rounds);
      dialogue.consensusLevel = this.calculateFinalConsensusLevel(dialogue.rounds);
      dialogue.dominantVoice = this.identifyDominantVoice(dialogue.rounds);
      
      // 関係性への影響を評価
      dialogue.relationshipChanges = this.evaluateRelationshipChanges(dialogue);
      
      return dialogue;
      
    } catch (error) {
      console.error('❌ Error in complex dialogue simulation:', error);
      return this.generateFallbackComplexDialogue(scenario);
    }
  }

  /**
   * 対話ラウンドのシミュレーション
   */
  simulateDialogueRound(scenario, roundNumber, previousRounds) {
    const round = {
      roundNumber,
      exchanges: [],
      agreements: [],
      disagreements: [],
      newPositions: {},
      consensusLevel: 0.0
    };
    
    // 各OSの発言を生成
    const osOrder = this.determineDialogueOrder(roundNumber);
    
    osOrder.forEach((osType, index) => {
      const os = this.virtualPersonality[`${osType}OS`];
      const exchange = this.generateOSExchange(os, scenario, roundNumber, previousRounds, index);
      round.exchanges.push(exchange);
    });
    
    // ラウンド内での合意・不合意を分析
    this.analyzeRoundDynamics(round);
    
    return round;
  }

  /**
   * 対話順序の決定
   */
  determineDialogueOrder(roundNumber) {
    // ラウンドに応じて発言順序を変更
    const orders = [
      ['engine', 'interface', 'safemode'],
      ['interface', 'safemode', 'engine'],
      ['safemode', 'engine', 'interface']
    ];
    
    return orders[(roundNumber - 1) % orders.length];
  }

  /**
   * OS発言の生成
   */
  generateOSExchange(os, scenario, roundNumber, previousRounds, speakingOrder) {
    // コンテキストを構築
    const context = this.buildDialogueContext(scenario, roundNumber, previousRounds, speakingOrder);
    
    // OSの性格と状況に基づいて発言を生成
    const position = this.generateOSPosition(os, scenario, context);
    const tone = this.determineOSTone(os, context);
    const concerns = this.identifyOSConcerns(os, scenario, context);
    
    return {
      speaker: os.osType,
      speakingOrder,
      position,
      tone,
      concerns,
      proposals: this.generateOSProposals(os, scenario, context),
      responses: this.generateResponsesToOthers(os, previousRounds),
      timestamp: new Date()
    };
  }

  /**
   * 対話コンテキストの構築
   */
  buildDialogueContext(scenario, roundNumber, previousRounds, speakingOrder) {
    return {
      scenario,
      roundNumber,
      speakingOrder,
      previousPositions: this.extractPreviousPositions(previousRounds),
      emergingThemes: this.identifyEmergingThemes(previousRounds),
      unresolvedIssues: this.identifyUnresolvedIssues(previousRounds)
    };
  }

  /**
   * 前回のポジションから情報を抽出
   */
  extractPreviousPositions(previousRounds) {
    const positions = {};
    
    previousRounds.forEach(round => {
      round.exchanges.forEach(exchange => {
        if (!positions[exchange.speaker]) {
          positions[exchange.speaker] = [];
        }
        positions[exchange.speaker].push({
          position: exchange.position,
          tone: exchange.tone,
          concerns: exchange.concerns
        });
      });
    });
    
    return positions;
  }

  /**
   * 新しいテーマの特定
   */
  identifyEmergingThemes(previousRounds) {
    const themes = new Set();
    
    previousRounds.forEach(round => {
      round.exchanges.forEach(exchange => {
        if (exchange.concerns) {
          exchange.concerns.forEach(concern => themes.add(concern));
        }
        if (exchange.proposals) {
          exchange.proposals.forEach(proposal => themes.add(proposal));
        }
      });
    });
    
    return Array.from(themes);
  }

  /**
   * 未解決の問題を特定
   */
  identifyUnresolvedIssues(previousRounds) {
    const issues = [];
    
    previousRounds.forEach(round => {
      round.disagreements.forEach(disagreement => {
        if (!this.isIssueResolved(disagreement, previousRounds)) {
          issues.push(disagreement);
        }
      });
    });
    
    return issues;
  }

  /**
   * 問題が解決されているかチェック
   */
  isIssueResolved(issue, rounds) {
    // 簡略化された解決判定
    return rounds.some(round => 
      round.agreements.some(agreement => 
        agreement.includes(issue) || agreement.topic === issue
      )
    );
  }

  /**
   * OS立場の生成
   */
  generateOSPosition(os, scenario, context) {
    const positionTemplates = {
      engine: [
        `価値観として${scenario}については、理想的な解決を目指すべきです。`,
        `本質的に考えると、${scenario}は私たちの核心的価値を反映すべき問題です。`,
        `長期的視点で${scenario}を見ると、創造的なアプローチが必要です。`
      ],
      interface: [
        `${scenario}について、周囲の人との関係を考慮する必要があります。`,
        `社会的な観点から${scenario}を見ると、調和を保つことが重要です。`,
        `皆が納得できる${scenario}の解決策を見つけたいと思います。`
      ],
      safemode: [
        `${scenario}のリスクを慎重に分析する必要があります。`,
        `安全性を第一に${scenario}を検討すべきです。`,
        `${scenario}について、予期せぬ問題が起こらないよう準備が必要です。`
      ]
    };

    const templates = positionTemplates[os.osType] || ['標準的な立場を取ります。'];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * OSトーンの決定
   */
  determineOSTone(os, context) {
    const toneOptions = {
      engine: ['情熱的', '理想主義的', '確信に満ちた', '創造的'],
      interface: ['協調的', '配慮深い', '外交的', '温和'],
      safemode: ['慎重', '分析的', '警戒的', '現実的']
    };

    const tones = toneOptions[os.osType] || ['中立的'];
    return tones[Math.floor(Math.random() * tones.length)];
  }

  /**
   * OS懸念事項の特定
   */
  identifyOSConcerns(os, scenario, context) {
    const concernTemplates = {
      engine: [
        '価値観に妥協することになるのではないか',
        '理想を諦めることになるのではないか',
        '創造性が制限されるのではないか'
      ],
      interface: [
        '人間関係にひびが入るのではないか',
        '誰かを傷つけることになるのではないか',
        '調和が崩れるのではないか'
      ],
      safemode: [
        '予期せぬリスクがあるのではないか',
        '失敗した時の対処法は準備できているか',
        'より安全な選択肢はないのか'
      ]
    };

    return concernTemplates[os.osType] || ['特に大きな懸念はありません'];
  }

  /**
   * OS提案の生成
   */
  generateOSProposals(os, scenario, context) {
    const proposalTemplates = {
      engine: [
        '理想的な解決策を一緒に探してみませんか',
        '創造的なアプローチを試してみるのはどうでしょう',
        'もっと本質的な解決方法があるのではないでしょうか'
      ],
      interface: [
        '皆で話し合って決めるのはどうでしょう',
        '関係者全員が納得できる方法を探しませんか',
        'より協力的なアプローチを取ってみませんか'
      ],
      safemode: [
        'まずリスクを詳しく分析してから決めませんか',
        'より安全な方法から始めてみるのはどうでしょう',
        '準備をもう少し充実させてから実行しませんか'
      ]
    };

    return proposalTemplates[os.osType] || ['様子を見てみましょう'];
  }

  /**
   * 他OSへの反応生成
   */
  generateResponsesToOthers(os, previousRounds) {
    const responses = {};
    
    if (previousRounds.length === 0) return responses;
    
    const lastRound = previousRounds[previousRounds.length - 1];
    
    lastRound.exchanges.forEach(exchange => {
      if (exchange.speaker !== os.osType) {
        responses[exchange.speaker] = this.generateResponseToOS(os, exchange);
      }
    });
    
    return responses;
  }

  /**
   * 特定OSへの反応生成
   */
  generateResponseToOS(respondingOS, targetExchange) {
    const responsePatterns = {
      engine: {
        interface: '社会的配慮は大切ですが、理想も忘れずに',
        safemode: '慎重さは理解できますが、チャレンジも必要では'
      },
      interface: {
        engine: '理想は素晴らしいですが、現実的配慮も',
        safemode: '安全性は大事ですが、関係性への影響も考慮を'
      },
      safemode: {
        engine: '理想の追求も大切ですが、リスク管理を',
        interface: '調和は重要ですが、安全性の確保も'
      }
    };

    const patterns = responsePatterns[respondingOS.osType];
    return patterns?.[targetExchange.speaker] || 'なるほど、それも一つの考え方ですね';
  }

  /**
   * ラウンドダイナミクスの分析
   */
  analyzeRoundDynamics(round) {
    // 合意点の特定
    const commonThemes = this.findCommonThemes(round.exchanges);
    round.agreements = commonThemes.agreements;
    
    // 不合意点の特定
    const conflicts = this.findConflicts(round.exchanges);
    round.disagreements = conflicts;
    
    // 新しい立場の記録
    round.newPositions = this.identifyNewPositions(round.exchanges);
    
    // ラウンドの合意レベル計算
    round.consensusLevel = this.calculateRoundConsensus(round);
  }

  /**
   * 共通テーマの発見
   */
  findCommonThemes(exchanges) {
    const themes = {};
    const agreements = [];
    
    exchanges.forEach(exchange => {
      if (exchange.proposals) {
        exchange.proposals.forEach(proposal => {
          if (!themes[proposal]) themes[proposal] = 0;
          themes[proposal]++;
        });
      }
    });
    
    // 複数のOSが同じ提案をした場合は合意とみなす
    Object.entries(themes).forEach(([theme, count]) => {
      if (count >= 2) {
        agreements.push({
          topic: theme,
          supportingOSes: count,
          strength: count / exchanges.length
        });
      }
    });
    
    return { agreements };
  }

  /**
   * 対立点の発見
   */
  findConflicts(exchanges) {
    const conflicts = [];
    
    for (let i = 0; i < exchanges.length; i++) {
      for (let j = i + 1; j < exchanges.length; j++) {
        const conflict = this.detectConflictBetween(exchanges[i], exchanges[j]);
        if (conflict) {
          conflicts.push(conflict);
        }
      }
    }
    
    return conflicts;
  }

  /**
   * 2つの発言間の対立検出
   */
  detectConflictBetween(exchange1, exchange2) {
    // 簡略化された対立検出
    if (exchange1.tone === '強硬' && exchange2.tone === '妥協的') {
      return {
        participants: [exchange1.speaker, exchange2.speaker],
        issue: 'アプローチの違い',
        intensity: 0.6
      };
    }
    
    // 懸念事項の対立チェック
    if (exchange1.concerns && exchange2.concerns) {
      const conflictingConcerns = exchange1.concerns.filter(concern1 =>
        exchange2.concerns.some(concern2 => this.areConcernsConflicting(concern1, concern2))
      );
      
      if (conflictingConcerns.length > 0) {
        return {
          participants: [exchange1.speaker, exchange2.speaker],
          issue: conflictingConcerns[0],
          intensity: conflictingConcerns.length * 0.3
        };
      }
    }
    
    return null;
  }

  /**
   * 懸念事項の対立判定
   */
  areConcernsConflicting(concern1, concern2) {
    const conflictPairs = [
      ['リスク回避', '積極的行動'],
      ['個人の理想', '集団の調和'],
      ['安全性重視', '創造性追求']
    ];
    
    return conflictPairs.some(pair =>
      (concern1.includes(pair[0]) && concern2.includes(pair[1])) ||
      (concern1.includes(pair[1]) && concern2.includes(pair[0]))
    );
  }

  /**
   * 新しい立場の特定
   */
  identifyNewPositions(exchanges) {
    const newPositions = {};
    
    exchanges.forEach(exchange => {
      // 前回から変化した立場があるかチェック
      if (this.isPositionNew(exchange)) {
        newPositions[exchange.speaker] = {
          position: exchange.position,
          change: 'evolved',
          significance: 'moderate'
        };
      }
    });
    
    return newPositions;
  }

  /**
   * 立場が新しいかチェック
   */
  isPositionNew(exchange) {
    // 簡略化: ランダムに新しい立場があるとする
    return Math.random() > 0.7;
  }

  /**
   * ラウンド合意レベル計算
   */
  calculateRoundConsensus(round) {
    const totalExchanges = round.exchanges.length;
    const agreementCount = round.agreements.length;
    const conflictCount = round.disagreements.length;
    
    if (totalExchanges === 0) return 0;
    
    const consensusScore = (agreementCount * 2 - conflictCount) / totalExchanges;
    return Math.max(0, Math.min(1, consensusScore));
  }

  /**
   * 最終合意の形成
   */
  formFinalConsensus(rounds) {
    if (rounds.length === 0) return '対話なし';
    
    const lastRound = rounds[rounds.length - 1];
    const allAgreements = rounds.flatMap(round => round.agreements);
    
    if (allAgreements.length === 0) {
      return '各OSが異なる視点を維持しつつ、相互理解を深めることができました';
    }
    
    const strongestAgreement = allAgreements.reduce((strongest, current) => 
      (current.strength > strongest.strength) ? current : strongest
    );
    
    return `${strongestAgreement.topic}について、${strongestAgreement.supportingOSes}つのOSが合意に達しました`;
  }

  /**
   * 最終合意レベル計算
   */
  calculateFinalConsensusLevel(rounds) {
    if (rounds.length === 0) return 0;
    
    const avgConsensus = rounds.reduce((sum, round) => sum + round.consensusLevel, 0) / rounds.length;
    const progressionBonus = this.calculateConsensusProgression(rounds);
    
    return Math.min(1, avgConsensus + progressionBonus);
  }

  /**
   * 合意進捗ボーナス計算
   */
  calculateConsensusProgression(rounds) {
    if (rounds.length < 2) return 0;
    
    const firstHalf = rounds.slice(0, Math.floor(rounds.length / 2));
    const secondHalf = rounds.slice(Math.floor(rounds.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, round) => sum + round.consensusLevel, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, round) => sum + round.consensusLevel, 0) / secondHalf.length;
    
    return Math.max(0, (secondAvg - firstAvg) * 0.3);
  }

  /**
   * 主導的な声の特定
   */
  identifyDominantVoice(rounds) {
    const voiceInfluence = { engine: 0, interface: 0, safemode: 0 };
    
    rounds.forEach(round => {
      round.agreements.forEach(agreement => {
        // 合意に貢献したOSの影響力を増加
        round.exchanges.forEach(exchange => {
          if (exchange.proposals && exchange.proposals.includes(agreement.topic)) {
            voiceInfluence[exchange.speaker] += agreement.strength;
          }
        });
      });
    });
    
    return Object.entries(voiceInfluence).reduce((dominant, [os, influence]) => 
      influence > dominant.influence ? { os, influence } : dominant
    , { os: 'balanced', influence: 0 }).os;
  }

  /**
   * 関係性への影響評価
   */
  evaluateRelationshipChanges(dialogue) {
    const changes = {};
    
    // 対話による関係性の変化を評価
    Object.keys(this.relationshipMatrix).forEach(relationshipKey => {
      const relationship = this.relationshipMatrix[relationshipKey];
      const [os1, os2] = relationshipKey.split('-');
      
      // 対話での協力・対立をもとに関係性を更新
      const cooperationChange = this.calculateCooperationChange(dialogue, os1, os2);
      const conflictChange = this.calculateConflictChange(dialogue, os1, os2);
      
      changes[relationshipKey] = {
        cooperationDelta: cooperationChange,
        conflictDelta: conflictChange,
        overallImpact: cooperationChange - conflictChange
      };
      
      // 実際の関係性値を更新
      relationship.cooperation = Math.max(0, Math.min(1, relationship.cooperation + cooperationChange));
      relationship.conflict = Math.max(0, Math.min(1, relationship.conflict + conflictChange));
    });
    
    return changes;
  }

  /**
   * 協力変化の計算
   */
  calculateCooperationChange(dialogue, os1, os2) {
    let cooperationBonus = 0;
    
    dialogue.rounds.forEach(round => {
      round.agreements.forEach(agreement => {
        const os1Participated = round.exchanges.some(ex => ex.speaker === os1 && 
          ex.proposals && ex.proposals.includes(agreement.topic));
        const os2Participated = round.exchanges.some(ex => ex.speaker === os2 && 
          ex.proposals && ex.proposals.includes(agreement.topic));
        
        if (os1Participated && os2Participated) {
          cooperationBonus += 0.1 * agreement.strength;
        }
      });
    });
    
    return cooperationBonus;
  }

  /**
   * 対立変化の計算
   */
  calculateConflictChange(dialogue, os1, os2) {
    let conflictIncrease = 0;
    
    dialogue.rounds.forEach(round => {
      round.disagreements.forEach(disagreement => {
        if (disagreement.participants.includes(os1) && disagreement.participants.includes(os2)) {
          conflictIncrease += 0.05 * disagreement.intensity;
        }
      });
    });
    
    return conflictIncrease;
  }

  /**
   * フォールバック複雑対話の生成
   */
  generateFallbackComplexDialogue(scenario) {
    return {
      scenario,
      timestamp: new Date(),
      rounds: [{
        roundNumber: 1,
        exchanges: [
          {
            speaker: 'engine',
            position: `価値観として${scenario}について理想的な解決を目指したいと思います`,
            tone: '情熱的',
            concerns: ['価値観の妥協'],
            proposals: ['理想的解決策の追求']
          },
          {
            speaker: 'interface',
            position: `${scenario}について皆が納得できる方法を探しませんか`,
            tone: '協調的',
            concerns: ['人間関係への影響'],
            proposals: ['協力的アプローチ']
          },
          {
            speaker: 'safemode',
            position: `${scenario}のリスクを慎重に分析する必要があります`,
            tone: '慎重',
            concerns: ['予期せぬリスク'],
            proposals: ['リスク分析の実施']
          }
        ],
        agreements: [],
        disagreements: [],
        consensusLevel: 0.3
      }],
      finalConsensus: '各OSが異なる視点を表明し、バランスの取れた検討が行われました',
      consensusLevel: 0.3,
      dominantVoice: 'balanced',
      relationshipChanges: {}
    };
  }

  // その他の詳細メソッドは実装を継続...
  
  /**
   * デフォルト関係性の初期化
   */
  initializeDefaultRelationships() {
    console.log('🔄 Initializing default relationships...');
    
    Object.keys(this.relationshipMatrix).forEach(key => {
      const relationship = this.relationshipMatrix[key];
      relationship.compatibility = 0.5;
      relationship.trust = 0.5;
      relationship.cooperation = 0.5;
      relationship.conflict = 0.3;
      relationship.communicationStyle = 'diplomatic';
    });
    
    this.overallIntegrationLevel = 0.5;
    this.relationshipTension = 0.3;
  }

  /**
   * 関係性レポートの生成
   */
  generateRelationshipReport() {
    return {
      timestamp: new Date().toISOString(),
      overallIntegrationLevel: this.overallIntegrationLevel,
      relationshipTension: this.relationshipTension,
      currentState: this.currentRelationshipState,
      relationships: this.relationshipMatrix,
      patterns: {
        conflicts: this.conflictPatterns,
        harmonies: this.harmonyPatterns
      },
      recommendations: this.generateRelationshipRecommendations()
    };
  }

  /**
   * 関係性改善の推奨事項生成
   */
  generateRelationshipRecommendations() {
    const recommendations = [];
    
    if (this.overallIntegrationLevel < 0.5) {
      recommendations.push('OS間の対話時間を増やし、相互理解を深めましょう');
    }
    
    if (this.relationshipTension > 0.6) {
      recommendations.push('対立点を明確にし、建設的な解決策を模索しましょう');
    }
    
    // 各関係性の個別推奨事項
    Object.entries(this.relationshipMatrix).forEach(([key, relationship]) => {
      if (relationship.conflict > 0.6) {
        recommendations.push(`${key}間の対立解消に重点的に取り組みましょう`);
      }
    });
    
    return recommendations.length > 0 ? recommendations : ['現在の関係性バランスを維持しましょう'];
  }

  // 追加の複雑なメソッドは実装継続可能...
}

// グローバルスコープでの利用可能化
if (typeof window !== 'undefined') {
  window.OSRelationshipEngine = OSRelationshipEngine;
}

console.log('✅ OSRelationshipEngine.js loaded successfully');