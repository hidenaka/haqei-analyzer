/**
 * VirtualPersonality.js - HAQEI 仮想人格システム
 * 
 * ユーザーの回答から仮想人格（デジタル分身）を構築し、
 * 3つの独立したOS人格が相互作用するシステムを管理
 */

class VirtualPersonality {
  constructor(userAnswers, tripleOSEngine = null) {
    // 基本識別情報
    this.id = `personality_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.createdAt = new Date();
    this.lastUpdated = new Date();
    this.version = '1.0.0';
    
    // 関連システム
    this.tripleOSEngine = tripleOSEngine;
    this.userAnswers = userAnswers || [];
    
    // 3つの独立したOS人格を構築
    console.log('🎭 Creating Virtual Personality with 3 OS personalities...');
    
    this.engineOS = new PersonalityOS('engine', userAnswers, tripleOSEngine);
    this.interfaceOS = new PersonalityOS('interface', userAnswers, tripleOSEngine);
    this.safeModeOS = new PersonalityOS('safemode', userAnswers, tripleOSEngine);
    
    // OS関係性エンジンの統合（循環参照回避）
    this.relationshipEngine = null;
    this.metaphorEngine = null;
    
    // 弱参照を使用してエンジンを初期化
    this.initializeEngines();
    
    // 仮想人格の統合状態
    this.personalityState = {
      currentDominantOS: null, // 現在主導的なOS
      osBalance: { // OS間のバランス
        engine: 0.33,
        interface: 0.33,
        safemode: 0.34
      },
      overallCoherence: 0.0, // 全体的な一貫性 (0.0-1.0)
      internalHarmony: 0.0, // 内的調和度 (0.0-1.0)
      adaptabilityIndex: 0.0 // 適応性指数 (0.0-1.0)
    };
    
    // OS活性履歴
    this.osActivationHistory = [];
    
    // 仮想人格メタデータ
    this.personalityMetadata = this.generateMetadata();
    
    // 内部対話システム
    this.internalDialogue = {
      currentConversation: null,
      dialogueHistory: [],
      activeTopics: [],
      consensusLevel: 0.0
    };
    
    // シミュレーション状態
    this.simulationState = {
      isActive: false,
      currentScenario: null,
      scenarioHistory: [],
      predictedBehaviors: []
    };
    
    // 仮想人格の初期化
    this.initialize();
    
    console.log(`✅ Virtual Personality created:`, {
      id: this.id,
      engineOS: this.engineOS.osName,
      interfaceOS: this.interfaceOS.osName,
      safeModeOS: this.safeModeOS.osName,
      dominantOS: this.personalityState.currentDominantOS
    });
  }

  /**
   * エンジンの初期化（循環参照回避）
   */
  initializeEngines() {
    // WeakMapを使用して循環参照を回避
    if (!VirtualPersonality.engineWeakMap) {
      VirtualPersonality.engineWeakMap = new WeakMap();
    }
    
    // 関係性エンジンを初期化
    this.relationshipEngine = new OSRelationshipEngine(this);
    
    // メタファーエンジンを初期化  
    this.metaphorEngine = new IchingMetaphorEngine(this);
    
    // WeakMapに登録
    VirtualPersonality.engineWeakMap.set(this, {
      relationshipEngine: this.relationshipEngine,
      metaphorEngine: this.metaphorEngine
    });

    console.log('🔧 Engines initialized with memory leak prevention');
  }

  /**
   * リソースのクリーンアップ
   */
  cleanup() {
    console.log('🧹 Cleaning up VirtualPersonality resources...');
    
    // エンジンの参照をクリア
    if (this.relationshipEngine) {
      this.relationshipEngine = null;
    }
    
    if (this.metaphorEngine) {
      this.metaphorEngine = null;
    }
    
    // WeakMapからも削除
    if (VirtualPersonality.engineWeakMap) {
      VirtualPersonality.engineWeakMap.delete(this);
    }
    
    // OS参照もクリア
    this.engineOS = null;
    this.interfaceOS = null;
    this.safeModeOS = null;
    
    console.log('✅ VirtualPersonality cleanup completed');
  }
  
  /**
   * 仮想人格の初期化
   */
  initialize() {
    console.log('🔧 Initializing Virtual Personality...');
    
    try {
      // OS間のバランスを計算
      this.calculateOSBalance();
      
      // 現在の主導OSを決定
      this.determineDominantOS();
      
      // 全体的な一貫性を評価  
      this.evaluateOverallCoherence();
      
      // 内的調和度を計算
      this.calculateInternalHarmony();
      
      // 適応性指数を計算
      this.calculateAdaptabilityIndex();
      
      console.log('✅ Virtual Personality initialization completed');
      
    } catch (error) {
      console.error('❌ Error during Virtual Personality initialization:', error);
      this.initializeWithDefaults();
    }
  }
  
  /**
   * デフォルト値での初期化
   */
  initializeWithDefaults() {
    console.log('🔄 Initializing with default values...');
    
    this.personalityState.currentDominantOS = 'engine';
    this.personalityState.overallCoherence = 0.5;
    this.personalityState.internalHarmony = 0.5;
    this.personalityState.adaptabilityIndex = 0.5;
  }
  
  /**
   * OS間のバランスを計算
   */
  calculateOSBalance() {
    const engineActivation = this.engineOS.activation || 0.33;
    const interfaceActivation = this.interfaceOS.activation || 0.33;
    const safeModeActivation = this.safeModeOS.activation || 0.33;
    
    const total = engineActivation + interfaceActivation + safeModeActivation;
    
    if (total > 0) {
      this.personalityState.osBalance = {
        engine: engineActivation / total,
        interface: interfaceActivation / total,
        safemode: safeModeActivation / total
      };
    }
    
    console.log('📊 OS Balance calculated:', this.personalityState.osBalance);
  }
  
  /**
   * 現在の主導OSを決定
   */
  determineDominantOS() {
    const balance = this.personalityState.osBalance;
    
    let dominantOS = 'engine';
    let maxBalance = balance.engine;
    
    if (balance.interface > maxBalance) {
      dominantOS = 'interface';
      maxBalance = balance.interface;
    }
    
    if (balance.safemode > maxBalance) {
      dominantOS = 'safemode';
    }
    
    this.personalityState.currentDominantOS = dominantOS;
    
    console.log(`👑 Dominant OS determined: ${dominantOS}`);
  }
  
  /**
   * 全体的な一貫性を評価
   */
  evaluateOverallCoherence() {
    // OS間の特性の一貫性を評価
    const engineTraits = this.engineOS.characteristics.primary_traits || [];
    const interfaceTraits = this.interfaceOS.characteristics.primary_traits || [];
    const safeModeTraits = this.safeModeOS.characteristics.primary_traits || [];
    
    // 簡略化された一貫性計算
    const traitOverlap = this.calculateTraitOverlap(engineTraits, interfaceTraits, safeModeTraits);
    const balanceStability = this.calculateBalanceStability();
    
    this.personalityState.overallCoherence = (traitOverlap + balanceStability) / 2;
    
    console.log(`🧩 Overall coherence: ${this.personalityState.overallCoherence.toFixed(3)}`);
  }
  
  /**
   * 特性の重複度を計算
   */
  calculateTraitOverlap(engineTraits, interfaceTraits, safeModeTraits) {
    // 特性間の調和度を計算（簡略化）
    return Math.random() * 0.3 + 0.4; // 0.4-0.7の範囲
  }
  
  /**
   * バランスの安定性を計算
   */
  calculateBalanceStability() {
    const balance = this.personalityState.osBalance;
    const values = Object.values(balance);
    
    // 分散を計算（バランスが取れているほど安定）
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    // 分散が小さいほど安定（1から分散を引く）
    return Math.max(0, 1 - variance * 3);
  }
  
  /**
   * 内的調和度を計算
   */
  calculateInternalHarmony() {
    // OS間の協調性を評価
    const cooperationLevels = [];
    
    // Engine-Interface間の協調
    cooperationLevels.push(this.assessOSCooperation(this.engineOS, this.interfaceOS));
    
    // Engine-SafeMode間の協調
    cooperationLevels.push(this.assessOSCooperation(this.engineOS, this.safeModeOS));
    
    // Interface-SafeMode間の協調
    cooperationLevels.push(this.assessOSCooperation(this.interfaceOS, this.safeModeOS));
    
    this.personalityState.internalHarmony = cooperationLevels.reduce((a, b) => a + b, 0) / cooperationLevels.length;
    
    console.log(`☯️ Internal harmony: ${this.personalityState.internalHarmony.toFixed(3)}`);
  }
  
  /**
   * OS間の協調性を評価
   */
  assessOSCooperation(os1, os2) {
    // OS特性の相性を評価（簡略化）
    const compatibility = this.calculateOSCompatibility(os1, os2);
    const activationSynergy = this.calculateActivationSynergy(os1, os2);
    
    return (compatibility + activationSynergy) / 2;
  }
  
  /**
   * OS互換性を計算
   */
  calculateOSCompatibility(os1, os2) {
    // 特性の相性を評価（実装簡略化）
    const typeCompatibility = {
      'engine-interface': 0.7,
      'engine-safemode': 0.5,
      'interface-safemode': 0.8
    };
    
    const key = `${os1.osType}-${os2.osType}`;
    const reverseKey = `${os2.osType}-${os1.osType}`;
    
    return typeCompatibility[key] || typeCompatibility[reverseKey] || 0.5;
  }
  
  /**
   * 活性シナジーを計算
   */
  calculateActivationSynergy(os1, os2) {
    const activation1 = os1.activation || 0.5;
    const activation2 = os2.activation || 0.5;
    
    // 活性度が近いほどシナジー効果が高い
    const activationDiff = Math.abs(activation1 - activation2);
    return Math.max(0, 1 - activationDiff);
  }
  
  /**
   * 適応性指数を計算
   */
  calculateAdaptabilityIndex() {
    // 3つのOSの多様性と柔軟性を評価
    const diversity = this.calculateOSDiversity();
    const flexibility = this.calculateOSFlexibility();
    
    this.personalityState.adaptabilityIndex = (diversity + flexibility) / 2;
    
    console.log(`🔄 Adaptability index: ${this.personalityState.adaptabilityIndex.toFixed(3)}`);
  }
  
  /**
   * OS多様性を計算
   */
  calculateOSDiversity() {
    // OS間の特性の多様性を評価
    const activations = [
      this.engineOS.activation || 0.5,
      this.interfaceOS.activation || 0.5,
      this.safeModeOS.activation || 0.5
    ];
    
    // 標準偏差を多様性の指標とする
    const mean = activations.reduce((a, b) => a + b, 0) / activations.length;
    const variance = activations.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / activations.length;
    const stdDev = Math.sqrt(variance);
    
    // 標準偏差を0-1の範囲に正規化
    return Math.min(1, stdDev * 3);
  }
  
  /**
   * OS柔軟性を計算
   */
  calculateOSFlexibility() {
    // OSの活性度変化の潜在能力を評価（簡略化）
    return Math.random() * 0.3 + 0.5; // 0.5-0.8の範囲
  }
  
  /**
   * メタデータを生成
   */
  generateMetadata() {
    return {
      personalityType: this.classifyPersonalityType(),
      complexityLevel: this.calculateComplexityLevel(),
      uniquenessScore: this.calculateUniquenessScore(),
      stabilityIndex: this.calculateStabilityIndex(),
      createdFrom: {
        answerCount: this.userAnswers.length,
        dominantThemes: this.extractDominantThemes(),
        analysisDepth: this.calculateAnalysisDepth()
      },
      tags: this.generatePersonalityTags()
    };
  }
  
  /**
   * 人格タイプを分類
   */
  classifyPersonalityType() {
    const dominantOS = this.personalityState.currentDominantOS;
    const harmony = this.personalityState.internalHarmony;
    
    const typeMap = {
      'engine': harmony > 0.7 ? '理想主義統合型' : harmony > 0.4 ? '理想主義標準型' : '理想主義葛藤型',
      'interface': harmony > 0.7 ? '社交的統合型' : harmony > 0.4 ? '社交的標準型' : '社交的葛藤型',
      'safemode': harmony > 0.7 ? '慎重統合型' : harmony > 0.4 ? '慎重標準型' : '慎重葛藤型'
    };
    
    return typeMap[dominantOS] || '標準型';
  }
  
  /**
   * 複雑性レベルを計算
   */
  calculateComplexityLevel() {
    const coherence = this.personalityState.overallCoherence;
    const diversity = this.calculateOSDiversity();
    
    // 多様性が高く一貫性が保たれているほど複雑
    return diversity * coherence;
  }
  
  /**
   * 独自性スコアを計算
   */
  calculateUniquenessScore() {
    // OS間のバランスの独特さを評価
    const balance = this.personalityState.osBalance;
    const values = Object.values(balance);
    
    // 標準的な均等分割(0.33, 0.33, 0.34)からの偏差
    const standardDeviation = values.map((val, idx) => Math.abs(val - 0.33)).reduce((a, b) => a + b, 0);
    
    return Math.min(1, standardDeviation * 2);
  }
  
  /**
   * 安定性指数を計算
   */
  calculateStabilityIndex() {
    return this.personalityState.internalHarmony * this.personalityState.overallCoherence;
  }
  
  /**
   * 主要テーマを抽出
   */
  extractDominantThemes() {
    const themes = [];
    
    // 各OSの主要特性を収集
    [this.engineOS, this.interfaceOS, this.safeModeOS].forEach(os => {
      if (os.characteristics && os.characteristics.primary_traits) {
        themes.push(...os.characteristics.primary_traits);
      }
    });
    
    // 重複を除去
    return [...new Set(themes)];
  }
  
  /**
   * 分析深度を計算
   */
  calculateAnalysisDepth() {
    // 回答数と特性の豊富さから深度を計算
    const answerCount = this.userAnswers.length;
    const traitCount = this.extractDominantThemes().length;
    
    return Math.min(1, (answerCount * 0.02) + (traitCount * 0.05));
  }
  
  /**
   * 人格タグを生成
   */
  generatePersonalityTags() {
    const tags = [];
    
    // 主導OSに基づくタグ
    const osTagMap = {
      'engine': ['理想主義', '創造的', '価値観重視'],
      'interface': ['社交的', '協調的', '配慮深い'],
      'safemode': ['慎重', '安定志向', '分析的']
    };
    
    tags.push(...osTagMap[this.personalityState.currentDominantOS] || []);
    
    // 調和度に基づくタグ
    const harmony = this.personalityState.internalHarmony;
    if (harmony > 0.8) tags.push('高調和');
    else if (harmony > 0.6) tags.push('中調和');
    else tags.push('要調整');
    
    // 複雑性に基づくタグ
    const complexity = this.personalityMetadata?.complexityLevel || 0;
    if (complexity > 0.7) tags.push('高複雑性');
    else if (complexity > 0.4) tags.push('中複雑性');
    else tags.push('シンプル');
    
    return tags;
  }
  
  // === 仮想人格シミュレーションメソッド ===
  
  /**
   * 内部対話をシミュレーション
   */
  simulateInternalDialogue(scenario) {
    console.log(`💭 Starting internal dialogue simulation for scenario: "${scenario}"`);
    
    const dialogue = {
      scenario: scenario,
      timestamp: new Date(),
      participants: ['engineOS', 'interfaceOS', 'safeModeOS'],
      exchanges: [],
      outcome: null,
      consensusLevel: 0.0
    };
    
    try {
      // Phase 1: 各OSの初期反応
      const initialReactions = this.getInitialOSReactions(scenario);
      dialogue.exchanges.push(...initialReactions);
      
      // Phase 2: OS間の議論
      const discussions = this.simulateOSDiscussion(scenario, initialReactions);
      dialogue.exchanges.push(...discussions);
      
      // Phase 3: 合意形成
      const consensus = this.attemptConsensusBuilding(scenario, dialogue.exchanges);
      dialogue.outcome = consensus.decision;
      dialogue.consensusLevel = consensus.level;
      
      // Phase 4: 対話の記録
      this.internalDialogue.dialogueHistory.push(dialogue);
      this.internalDialogue.currentConversation = dialogue;
      
      console.log(`✅ Internal dialogue completed. Consensus level: ${dialogue.consensusLevel.toFixed(2)}`);
      
      return dialogue;
      
    } catch (error) {
      console.error('❌ Error in internal dialogue simulation:', error);
      return this.generateFallbackDialogue(scenario);
    }
  }
  
  /**
   * 各OSの初期反応を取得
   */
  getInitialOSReactions(scenario) {
    const reactions = [];
    
    // Engine OSの反応
    const engineReaction = this.engineOS.reactToStimulus(scenario);
    reactions.push({
      speaker: 'engineOS',
      type: 'initial_reaction',
      content: engineReaction,
      timestamp: new Date(),
      order: 1
    });
    
    // Interface OSの反応
    const interfaceReaction = this.interfaceOS.reactToStimulus(scenario);
    reactions.push({
      speaker: 'interfaceOS',
      type: 'initial_reaction',
      content: interfaceReaction,
      timestamp: new Date(),
      order: 2
    });
    
    // SafeMode OSの反応
    const safeModeReaction = this.safeModeOS.reactToStimulus(scenario);
    reactions.push({
      speaker: 'safeModeOS',
      type: 'initial_reaction',
      content: safeModeReaction,
      timestamp: new Date(),
      order: 3
    });
    
    return reactions;
  }
  
  /**
   * OS間の議論をシミュレーション
   */
  simulateOSDiscussion(scenario, initialReactions) {
    const discussions = [];
    
    // Engine OSが他のOSに意見を求める
    const engineOpinion = this.engineOS.expressOpinion(scenario);
    discussions.push({
      speaker: 'engineOS',
      type: 'opinion',
      content: engineOpinion,
      timestamp: new Date(),
      order: 4
    });
    
    // Interface OSが応答
    const interfaceResponse = this.interfaceOS.expressOpinion(`${scenario} (Engine OSの意見を受けて)`);
    discussions.push({
      speaker: 'interfaceOS',
      type: 'response',
      content: interfaceResponse,
      timestamp: new Date(),
      order: 5
    });
    
    // SafeMode OSが懸念を表明
    const safeModeResponse = this.safeModeOS.expressOpinion(`${scenario} (リスク評価として)`);
    discussions.push({
      speaker: 'safeModeOS',
      type: 'concern',
      content: safeModeResponse,
      timestamp: new Date(),
      order: 6
    });
    
    return discussions;
  }
  
  /**
   * 合意形成を試行
   */
  attemptConsensusBuilding(scenario, exchanges) {
    console.log('🤝 Attempting consensus building...');
    
    // 各OSの交渉を実行
    const allOSes = [this.engineOS, this.interfaceOS, this.safeModeOS];
    
    const negotiations = allOSes.map(os => {
      const otherOSes = allOSes.filter(other => other.osType !== os.osType);
      return os.negotiateWith(otherOSes);
    });
    
    // 合意レベルを計算
    const consensusLevel = this.calculateConsensusLevel(negotiations);
    
    // 最終決定を生成
    const decision = this.generateFinalDecision(scenario, negotiations, consensusLevel);
    
    return {
      decision: decision,
      level: consensusLevel,
      negotiations: negotiations
    };
  }
  
  /**
   * 合意レベルを計算
   */
  calculateConsensusLevel(negotiations) {
    // 簡略化された合意計算
    const conflictCount = negotiations.reduce((count, neg) => {
      return count + (neg.dealBreakers || []).length;
    }, 0);
    
    const maxConflicts = negotiations.length * 2; // 仮の最大対立数
    return Math.max(0, 1 - (conflictCount / maxConflicts));
  }
  
  /**
   * 最終決定を生成
   */
  generateFinalDecision(scenario, negotiations, consensusLevel) {
    const dominantOS = this.personalityState.currentDominantOS;
    
    if (consensusLevel > 0.7) {
      return `「${scenario}」について、3つのOSが協調的に合意に達しました。`;
    } else if (consensusLevel > 0.4) {
      return `「${scenario}」について、${dominantOS}が主導で部分的な合意を形成しました。`;
    } else {
      return `「${scenario}」について、OSs間で意見が分かれており、慎重な検討が必要です。`;
    }
  }
  
  /**
   * フォールバック対話を生成
   */
  generateFallbackDialogue(scenario) {
    return {
      scenario: scenario,
      timestamp: new Date(),
      participants: ['engineOS', 'interfaceOS', 'safeModeOS'],
      exchanges: [{
        speaker: 'system',
        type: 'fallback',
        content: `${scenario}について各OSが思考中...`,
        timestamp: new Date(),
        order: 1
      }],
      outcome: `${scenario}についてシステムが分析中です`,
      consensusLevel: 0.5
    };
  }
  
  /**
   * 現在のOS設定を取得
   */
  getCurrentOSConfiguration() {
    return {
      engineOS: this.engineOS.getCurrentState(),
      interfaceOS: this.interfaceOS.getCurrentState(),
      safeModeOS: this.safeModeOS.getCurrentState(),
      relationships: this.getOSRelationships(),
      state: this.personalityState,
      lastUpdated: this.lastUpdated
    };
  }
  
  /**
   * OS関係性を取得
   */
  getOSRelationships() {
    return {
      'engine-interface': this.assessOSCooperation(this.engineOS, this.interfaceOS),
      'engine-safemode': this.assessOSCooperation(this.engineOS, this.safeModeOS),
      'interface-safemode': this.assessOSCooperation(this.interfaceOS, this.safeModeOS)
    };
  }
  
  /**
   * 行動を予測
   */
  predictBehavior(situation) {
    console.log(`🔮 Predicting behavior for situation: "${situation}"`);
    
    // 各OSからの決定を取得
    const engineDecision = this.engineOS.makeDecision(situation);
    const interfaceDecision = this.interfaceOS.makeDecision(situation);
    const safeModeDecision = this.safeModeOS.makeDecision(situation);
    
    // 統合的な行動予測を生成
    const prediction = {
      situation: situation,
      timestamp: new Date(),
      osDecisions: {
        engine: engineDecision,
        interface: interfaceDecision,
        safemode: safeModeDecision
      },
      integratedPrediction: this.generateIntegratedPrediction(
        situation, 
        engineDecision, 
        interfaceDecision, 
        safeModeDecision
      ),
      confidence: this.calculatePredictionConfidence(engineDecision, interfaceDecision, safeModeDecision),
      alternativeScenarios: this.generateAlternativeScenarios(situation)
    };
    
    // 予測履歴に追加
    this.simulationState.predictedBehaviors.push(prediction);
    
    return prediction;
  }
  
  /**
   * 統合的予測を生成
   */
  generateIntegratedPrediction(situation, engineDecision, interfaceDecision, safeModeDecision) {
    const dominantOS = this.personalityState.currentDominantOS;
    const harmony = this.personalityState.internalHarmony;
    
    if (harmony > 0.7) {
      return `${situation}では、3つのOSが協調して行動します。主に${dominantOS}の判断に基づきながら、他のOSの視点も統合した決定を行うでしょう。`;
    } else if (harmony > 0.4) {
      return `${situation}では、${dominantOS}が主導しつつ、他のOSとの調整を図りながら行動します。多少の内的葛藤があるかもしれません。`;
    } else {
      return `${situation}では、OS間で意見が分かれ、決定に時間がかかる可能性があります。最終的には${dominantOS}の判断が優先されるでしょう。`;
    }
  }
  
  /**
   * 予測信頼度を計算
   */
  calculatePredictionConfidence(engineDecision, interfaceDecision, safeModeDecision) {
    const confidences = [
      engineDecision.confidence || 0.5,
      interfaceDecision.confidence || 0.5,
      safeModeDecision.confidence || 0.5
    ];
    
    const averageConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length;
    const harmony = this.personalityState.internalHarmony;
    
    // 調和度が高いほど予測信頼度も高い
    return averageConfidence * (0.5 + harmony * 0.5);
  }
  
  /**
   * 代替シナリオを生成
   */
  generateAlternativeScenarios(situation) {
    return [
      `${situation} (ストレス状態での反応)`,
      `${situation} (リラックス状態での反応)`,
      `${situation} (時間的余裕がある場合)`
    ];
  }
  
  /**
   * 人格ナラティブを生成
   */
  generatePersonalityNarrative() {
    const narrative = {
      introduction: this.generateIntroduction(),
      osPersonalities: this.generateOSPersonalityDescriptions(),
      relationshipDynamics: this.generateRelationshipDescription(),
      behavioralPatterns: this.generateBehavioralPatternDescription(),
      uniqueCharacteristics: this.generateUniqueCharacteristics(),
      developmentSuggestions: this.generateDevelopmentSuggestions()
    };
    
    return narrative;
  }
  
  /**
   * 導入部を生成
   */
  generateIntroduction() {
    const dominantOS = this.personalityState.currentDominantOS;
    const personalityType = this.personalityMetadata.personalityType;
    
    return `あなたの心の中には3つの独立したOS（人格オペレーティングシステム）が存在しています。現在、${dominantOS}が主導的な役割を果たしており、全体として「${personalityType}」という特徴を示しています。`;
  }
  
  /**
   * OS人格説明を生成
   */
  generateOSPersonalityDescriptions() {
    return {
      engineOS: {
        name: this.engineOS.osName,
        hexagram: `第${this.engineOS.hexagramId}卦 ${this.engineOS.hexagramName}`,
        description: this.generateOSDescription(this.engineOS),
        voice: this.engineOS.personality.voice,
        strengths: this.engineOS.personality.strengths,
        challenges: this.engineOS.personality.weaknesses
      },
      interfaceOS: {
        name: this.interfaceOS.osName,
        hexagram: `第${this.interfaceOS.hexagramId}卦 ${this.interfaceOS.hexagramName}`,
        description: this.generateOSDescription(this.interfaceOS),
        voice: this.interfaceOS.personality.voice,
        strengths: this.interfaceOS.personality.strengths,
        challenges: this.interfaceOS.personality.weaknesses
      },
      safeModeOS: {
        name: this.safeModeOS.osName,
        hexagram: `第${this.safeModeOS.hexagramId}卦 ${this.safeModeOS.hexagramName}`,
        description: this.generateOSDescription(this.safeModeOS),
        voice: this.safeModeOS.personality.voice,
        strengths: this.safeModeOS.personality.strengths,
        challenges: this.safeModeOS.personality.weaknesses
      }
    };
  }
  
  /**
   * OS説明を生成
   */
  generateOSDescription(os) {
    const traits = os.characteristics.primary_traits || [];
    const motivation = os.characteristics.motivation_source || 'バランスの取れた動機';
    
    return `このOSは${traits.join('、')}という特性を持ち、${motivation}によって動機づけられています。`;
  }
  
  /**
   * 関係性説明を生成
   */
  generateRelationshipDescription() {
    const harmony = this.personalityState.internalHarmony;
    const relationships = this.getOSRelationships();
    
    let description = '';
    
    if (harmony > 0.7) {
      description = '3つのOSは非常に調和的な関係を築いており、お互いを尊重し協力し合っています。';
    } else if (harmony > 0.4) {
      description = '3つのOSは基本的に協調的ですが、時として意見の相違があります。';
    } else {
      description = '3つのOSの間には緊張があり、統合に向けた努力が必要です。';
    }
    
    return {
      overview: description,
      specificRelationships: {
        engineInterface: relationships['engine-interface'],
        engineSafemode: relationships['engine-safemode'],
        interfaceSafemode: relationships['interface-safemode']
      }
    };
  }
  
  /**
   * 行動パターン説明を生成
   */
  generateBehavioralPatternDescription() {
    const dominantOS = this.personalityState.currentDominantOS;
    const adaptability = this.personalityState.adaptabilityIndex;
    
    return {
      primaryPattern: `主に${dominantOS}が意思決定をリードし、その判断に基づいて行動します。`,
      adaptabilityLevel: adaptability > 0.7 ? '高い適応性' : adaptability > 0.4 ? '中程度の適応性' : '低い適応性',
      typicalScenarios: this.generateTypicalScenarios()
    };
  }
  
  /**
   * 典型的なシナリオを生成
   */
  generateTypicalScenarios() {
    const dominantOS = this.personalityState.currentDominantOS;
    
    const scenarioMap = {
      'engine': ['理想的な解決策を模索する', '創造的なアプローチを試みる', '価値観に基づいて判断する'],
      'interface': ['他者との調和を優先する', '周囲の意見を聞いてから決める', '関係性を重視した選択をする'],
      'safemode': ['リスクを慎重に評価する', '安全な選択肢を探す', '十分な準備をしてから行動する']
    };
    
    return scenarioMap[dominantOS] || ['バランスの取れた判断をする'];
  }
  
  /**
   * 独自特徴を生成
   */
  generateUniqueCharacteristics() {
    return {
      uniquenessScore: this.personalityMetadata.uniquenessScore,
      complexityLevel: this.personalityMetadata.complexityLevel,
      tags: this.personalityMetadata.tags,
      distinctiveTraits: this.extractDistinctiveTraits()
    };
  }
  
  /**
   * 特徴的な特性を抽出
   */
  extractDistinctiveTraits() {
    const allTraits = [
      ...(this.engineOS.characteristics.primary_traits || []),
      ...(this.interfaceOS.characteristics.primary_traits || []),
      ...(this.safeModeOS.characteristics.primary_traits || [])
    ];
    
    // 重複を除去し、上位3つを返す
    const uniqueTraits = [...new Set(allTraits)];
    return uniqueTraits.slice(0, 3);
  }
  
  /**
   * 発達提案を生成
   */
  generateDevelopmentSuggestions() {
    const harmony = this.personalityState.internalHarmony;
    const adaptability = this.personalityState.adaptabilityIndex;
    
    const suggestions = [];
    
    if (harmony < 0.5) {
      suggestions.push('OS間の調和を改善するため、内的対話の時間を増やしましょう');
    }
    
    if (adaptability < 0.5) {
      suggestions.push('適応性を高めるため、新しい経験に積極的に挑戦してみましょう');
    }
    
    if (this.personalityState.osBalance.engine < 0.2) {
      suggestions.push('理想や価値観を見つめ直す時間を作りましょう');
    }
    
    if (this.personalityState.osBalance.interface < 0.2) {
      suggestions.push('人間関係や社会とのつながりを大切にしましょう');
    }
    
    if (this.personalityState.osBalance.safemode < 0.2) {
      suggestions.push('安全性や安定性について考える時間を持ちましょう');
    }
    
    return suggestions.length > 0 ? suggestions : ['現在のバランスを維持し、さらなる成長を目指しましょう'];
  }
  
  /**
   * 仮想人格の完全な状態を取得
   */
  getFullState() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      lastUpdated: this.lastUpdated,
      version: this.version,
      personalityState: this.personalityState,
      personalityMetadata: this.personalityMetadata,
      osStates: {
        engineOS: this.engineOS.getCurrentState(),
        interfaceOS: this.interfaceOS.getCurrentState(),
        safeModeOS: this.safeModeOS.getCurrentState()
      },
      internalDialogue: this.internalDialogue,
      simulationState: this.simulationState,
      relationships: this.getOSRelationships()
    };
  }
  
  /**
   * JSON形式で出力
   */
  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      lastUpdated: this.lastUpdated.toISOString(),
      version: this.version,
      personalityState: this.personalityState,
      personalityMetadata: this.personalityMetadata,
      osPersonalities: {
        engineOS: this.engineOS.toJSON(),
        interfaceOS: this.interfaceOS.toJSON(),
        safeModeOS: this.safeModeOS.toJSON()
      },
      narrative: this.generatePersonalityNarrative()
    };
  }
}

// グローバルスコープで利用可能にする
if (typeof window !== 'undefined') {
  window.VirtualPersonality = VirtualPersonality;
}

// Node.js環境での利用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VirtualPersonality;
}