/**
 * PersonalityOS.js - HAQEI 仮想人格OS
 * 
 * 3つの独立したOS人格を実装
 * - Engine OS (価値観OS): 理想、創造性、本質的価値観
 * - Interface OS (社会的OS): 対人関係、社会適応、表面的人格
 * - SafeMode OS (防御OS): 自己保護、安全志向、慎重さ
 */

class PersonalityOS {
  constructor(osType, userAnswers, tripleOSEngine = null) {
    this.osType = osType; // 'engine', 'interface', 'safemode'
    this.osName = this.getOSDisplayName(osType);
    this.tripleOSEngine = tripleOSEngine;
    
    // OS基本属性
    this.hexagramId = null;
    this.hexagramName = '';
    this.activation = 0.0; // 活性度 (0.0-1.0)
    this.dominance = 0.0; // 支配力 (0.0-1.0)
    
    // OS特性データ
    this.characteristics = {};
    this.preferences = {};
    this.behaviorPatterns = {};
    this.emotionalTendencies = {};
    this.decisionMakingStyle = {};
    
    // OS個性
    this.personality = {
      voice: '', // このOSの話し方・表現スタイル
      priorities: [], // 優先順位
      fears: [], // 恐れること
      desires: [], // 欲求
      strengths: [], // 強み
      weaknesses: [] // 弱み
    };
    
    // 内部状態
    this.currentMood = 'neutral';
    this.stressLevel = 0.0;
    this.confidence = 0.5;
    this.lastActivationTime = null;
    
    // 他OSとの関係性記録
    this.relationshipHistory = {
      engine: { cooperation: 0.0, conflict: 0.0, negotiations: [] },
      interface: { cooperation: 0.0, conflict: 0.0, negotiations: [] },
      safemode: { cooperation: 0.0, conflict: 0.0, negotiations: [] }
    };
    
    // ユーザー回答から自己構築
    if (userAnswers) {
      this.buildFromAnswers(userAnswers);
    }
    
    console.log(`🧠 PersonalityOS [${this.osType}] initialized:`, {
      name: this.osName,
      hexagram: this.hexagramId,
      activation: this.activation
    });
  }
  
  /**
   * OSタイプから表示名を取得
   */
  getOSDisplayName(osType) {
    const osNames = {
      'engine': 'Engine OS (価値観OS)',
      'interface': 'Interface OS (社会的OS)', 
      'safemode': 'SafeMode OS (防御OS)'
    };
    return osNames[osType] || `Unknown OS (${osType})`;
  }
  
  /**
   * ユーザー回答からOS特性を構築
   */
  buildFromAnswers(userAnswers) {
    console.log(`🔨 Building ${this.osType} OS from user answers...`);
    
    try {
      // OSタイプ別の回答を分離
      const relevantAnswers = this.extractRelevantAnswers(userAnswers);
      
      if (relevantAnswers.length === 0) {
        console.warn(`⚠️ No relevant answers found for ${this.osType} OS`);
        this.buildDefaultCharacteristics();
        return;
      }
      
      // 特性データ構築
      this.buildCharacteristics(relevantAnswers);
      this.buildBehaviorPatterns(relevantAnswers);
      this.buildEmotionalProfile(relevantAnswers);
      this.buildPersonality(relevantAnswers);
      
      // 64卦との対応
      this.mapToHexagram(relevantAnswers);
      
      console.log(`✅ ${this.osType} OS construction completed:`, {
        characteristics: Object.keys(this.characteristics).length,
        hexagram: this.hexagramId,
        activation: this.activation
      });
      
    } catch (error) {
      console.error(`❌ Error building ${this.osType} OS:`, error);
      this.buildDefaultCharacteristics();
    }
  }
  
  /**
   * OSタイプに関連する回答を抽出
   */
  extractRelevantAnswers(userAnswers) {
    if (!Array.isArray(userAnswers)) {
      console.error('Invalid userAnswers format:', userAnswers);
      return [];
    }
    
    // OSタイプ別の質問フィルタリング
    const osFilters = {
      'engine': (answer) => this.isEngineOSRelevant(answer),
      'interface': (answer) => this.isInterfaceOSRelevant(answer),
      'safemode': (answer) => this.isSafeModeOSRelevant(answer)
    };
    
    const filter = osFilters[this.osType];
    if (!filter) {
      console.warn(`No filter found for OS type: ${this.osType}`);
      return userAnswers; // 全回答を使用
    }
    
    return userAnswers.filter(filter);
  }
  
  /**
   * Engine OS関連の回答かどうか判定
   */
  isEngineOSRelevant(answer) {
    if (!answer || !answer.question) return false;
    
    const engineKeywords = [
      '価値観', '理想', '信念', '哲学', '本質', '創造',
      '目標', '夢', '志', '使命', '原則', '真実'
    ];
    
    const questionText = answer.question.toLowerCase();
    return engineKeywords.some(keyword => questionText.includes(keyword));
  }
  
  /**
   * Interface OS関連の回答かどうか判定
   */
  isInterfaceOSRelevant(answer) {
    if (!answer || !answer.question) return false;
    
    const interfaceKeywords = [
      '人間関係', '社会', '協調', '適応', '調和', '配慮',
      '周囲', '集団', 'チーム', '友人', '同僚', '社交'
    ];
    
    const questionText = answer.question.toLowerCase();
    return interfaceKeywords.some(keyword => questionText.includes(keyword));
  }
  
  /**
   * SafeMode OS関連の回答かどうか判定
   */
  isSafeModeOSRelevant(answer) {
    if (!answer || !answer.question) return false;
    
    const safemodeKeywords = [
      '安全', '慎重', '不安', '心配', '防御', '警戒',
      'リスク', '危険', '保護', '安心', '確実', '堅実'
    ];
    
    const questionText = answer.question.toLowerCase();
    return safemodeKeywords.some(keyword => questionText.includes(keyword));
  }
  
  /**
   * 特性データを構築
   */
  buildCharacteristics(answers) {
    this.characteristics = {
      primary_traits: [],
      secondary_traits: [],
      thinking_style: '',
      communication_style: '',
      decision_approach: '',
      stress_response: '',
      motivation_source: ''
    };
    
    // 回答から特性を抽出・分析
    answers.forEach(answer => {
      this.analyzeAnswerForCharacteristics(answer);
    });
    
    // 活性度計算
    this.activation = this.calculateActivation(answers);
  }
  
  /**
   * 回答から特性を分析
   */
  analyzeAnswerForCharacteristics(answer) {
    if (!answer || !answer.selectedOption) return;
    
    const option = answer.selectedOption;
    const intensity = answer.intensity || 1.0;
    
    // OSタイプ別の特性分析
    switch (this.osType) {
      case 'engine':
        this.analyzeEngineCharacteristics(option, intensity);
        break;
      case 'interface':
        this.analyzeInterfaceCharacteristics(option, intensity);
        break;
      case 'safemode':
        this.analyzeSafeModeCharacteristics(option, intensity);
        break;
    }
  }
  
  /**
   * Engine OS特性分析
   */
  analyzeEngineCharacteristics(option, intensity) {
    if (option.includes('理想') || option.includes('夢')) {
      this.characteristics.primary_traits.push('理想主義的');
      this.characteristics.motivation_source = '内的価値観';
    }
    
    if (option.includes('創造') || option.includes('新しい')) {
      this.characteristics.primary_traits.push('創造的');
      this.characteristics.thinking_style = '発散的思考';
    }
    
    if (option.includes('独立') || option.includes('自分らしく')) {
      this.characteristics.primary_traits.push('独立志向');
      this.characteristics.decision_approach = '内的基準重視';
    }
  }
  
  /**
   * Interface OS特性分析
   */
  analyzeInterfaceCharacteristics(option, intensity) {
    if (option.includes('協調') || option.includes('調和')) {
      this.characteristics.primary_traits.push('協調的');
      this.characteristics.communication_style = '調和重視';
    }
    
    if (option.includes('配慮') || option.includes('気遣い')) {
      this.characteristics.primary_traits.push('思いやり深い');
      this.characteristics.decision_approach = '他者影響考慮';
    }
    
    if (option.includes('適応') || option.includes('柔軟')) {
      this.characteristics.primary_traits.push('適応力がある');
      this.characteristics.thinking_style = '状況対応的';
    }
  }
  
  /**
   * SafeMode OS特性分析
   */
  analyzeSafeModeCharacteristics(option, intensity) {
    if (option.includes('慎重') || option.includes('確実')) {
      this.characteristics.primary_traits.push('慎重');
      this.characteristics.decision_approach = 'リスク回避志向';
    }
    
    if (option.includes('安定') || option.includes('安全')) {
      this.characteristics.primary_traits.push('安定志向');
      this.characteristics.motivation_source = '安全・安心';
    }
    
    if (option.includes('心配') || option.includes('不安')) {
      this.characteristics.stress_response = '不安増大';
      this.characteristics.thinking_style = '予防的思考';
    }
  }
  
  /**
   * 行動パターンを構築
   */
  buildBehaviorPatterns(answers) {
    this.behaviorPatterns = {
      daily_habits: [],
      crisis_response: '',
      social_behavior: '',
      work_style: '',
      leisure_preferences: [],
      conflict_handling: ''
    };
    
    // OSタイプ別の行動パターン設定
    this.setBehaviorPatternsByOSType();
  }
  
  /**
   * OSタイプ別行動パターン設定
   */
  setBehaviorPatternsByOSType() {
    switch (this.osType) {
      case 'engine':
        this.behaviorPatterns.crisis_response = '価値観に基づいて判断';
        this.behaviorPatterns.work_style = '創造的・自律的';
        this.behaviorPatterns.conflict_handling = '原則を貫く';
        break;
        
      case 'interface':
        this.behaviorPatterns.crisis_response = '周囲と相談して対応';
        this.behaviorPatterns.social_behavior = '協調的・配慮深い';
        this.behaviorPatterns.conflict_handling = '調和を重視して妥協';
        break;
        
      case 'safemode':
        this.behaviorPatterns.crisis_response = '慎重に情報収集してから判断';
        this.behaviorPatterns.work_style = '計画的・確実性重視';
        this.behaviorPatterns.conflict_handling = 'リスクを避けて回避';
        break;
    }
  }
  
  /**
   * 感情プロファイルを構築
   */
  buildEmotionalProfile(answers) {
    this.emotionalTendencies = {
      dominant_emotions: [],
      emotional_stability: 0.5,
      stress_triggers: [],
      joy_sources: [],
      fear_objects: []
    };
    
    // OSタイプ別の感情特性
    this.setEmotionalProfileByOSType();
  }
  
  /**
   * OSタイプ別感情プロファイル設定
   */
  setEmotionalProfileByOSType() {
    switch (this.osType) {
      case 'engine':
        this.emotionalTendencies.dominant_emotions = ['情熱', '憧憬', '確信'];
        this.emotionalTendencies.joy_sources = ['理想の実現', '創造的表現', '真実の発見'];
        this.emotionalTendencies.stress_triggers = ['価値観の妥協', '創造性の制限'];
        break;
        
      case 'interface':
        this.emotionalTendencies.dominant_emotions = ['共感', '親しみ', '配慮'];
        this.emotionalTendencies.joy_sources = ['良好な人間関係', '調和', '他者の幸福'];
        this.emotionalTendencies.stress_triggers = ['対人摩擦', '孤立', '不和'];
        break;
        
      case 'safemode':
        this.emotionalTendencies.dominant_emotions = ['注意', '心配', '警戒'];
        this.emotionalTendencies.joy_sources = ['安全の確保', '予測可能性', '安定'];
        this.emotionalTendencies.stress_triggers = ['未知の状況', 'リスク', '不確実性'];
        break;
    }
  }
  
  /**
   * OS個性を構築
   */
  buildPersonality(answers) {
    // OSタイプ別の個性設定
    this.setPersonalityByOSType();
  }
  
  /**
   * OSタイプ別個性設定
   */
  setPersonalityByOSType() {
    switch (this.osType) {
      case 'engine':
        this.personality.voice = '情熱的で理想主義的な語り口';
        this.personality.priorities = ['真実の追求', '創造的表現', '理想の実現'];
        this.personality.fears = ['妥協', '平凡さ', '価値観の否定'];
        this.personality.desires = ['本質的な価値の創造', '理想的な世界', '真の自己実現'];
        this.personality.strengths = ['創造力', '情熱', '信念の強さ'];
        this.personality.weaknesses = ['現実的配慮不足', '妥協への抵抗', '完璧主義'];
        break;
        
      case 'interface':
        this.personality.voice = '温かく配慮深い話し方';
        this.personality.priorities = ['人間関係の維持', '調和の創造', '他者への貢献'];
        this.personality.fears = ['孤立', '対立', '他者を傷つけること'];
        this.personality.desires = ['皆が幸せな環境', '深い絆', '相互理解'];
        this.personality.strengths = ['共感力', '協調性', '思いやり'];
        this.personality.weaknesses = ['自己主張の弱さ', '境界線の曖昧さ', '過度な配慮'];
        break;
        
      case 'safemode':
        this.personality.voice = '慎重で分析的な表現';
        this.personality.priorities = ['安全の確保', 'リスクの回避', '安定の維持'];
        this.personality.fears = ['未知の危険', '予期せぬ変化', '制御不能な状況'];
        this.personality.desires = ['予測可能な環境', '確実な安全', '準備された対策'];
        this.personality.strengths = ['慎重さ', '分析力', '危機管理能力'];
        this.personality.weaknesses = ['過度な心配', '変化への抵抗', '機会の逸失'];
        break;
    }
  }
  
  /**
   * 64卦との対応を設定
   */
  mapToHexagram(answers) {
    if (this.tripleOSEngine && this.tripleOSEngine.calculator) {
      try {
        // TripleOSEngineの分析結果から64卦を取得
        const analysisResult = this.getOSAnalysisResult();
        if (analysisResult && analysisResult.hexagramId) {
          this.hexagramId = analysisResult.hexagramId;
          this.hexagramName = analysisResult.hexagramName || `第${this.hexagramId}卦`;
        }
      } catch (error) {
        console.warn(`Could not get hexagram for ${this.osType}:`, error);
      }
    }
    
    // フォールバック: デフォルト64卦設定
    if (!this.hexagramId) {
      this.setDefaultHexagram();
    }
  }
  
  /**
   * TripleOSEngineからOS分析結果を取得
   */
  getOSAnalysisResult() {
    // この実装は後でTripleOSEngineとの統合時に完成
    return null;
  }
  
  /**
   * デフォルト64卦設定
   */
  setDefaultHexagram() {
    const defaultHexagrams = {
      'engine': 1, // 乾卦 - 創造、リーダーシップ
      'interface': 19, // 臨卦 - 接近、親しみ
      'safemode': 52 // 艮卦 - 停止、慎重さ
    };
    
    this.hexagramId = defaultHexagrams[this.osType] || 1;
    this.hexagramName = `第${this.hexagramId}卦`;
  }
  
  /**
   * デフォルト特性を構築（エラー時のフォールバック）
   */
  buildDefaultCharacteristics() {
    console.log(`🔄 Building default characteristics for ${this.osType} OS`);
    
    this.characteristics = { primary_traits: ['標準的'] };
    this.activation = 0.5;
    this.behaviorPatterns = { crisis_response: '標準的な対応' };
    this.emotionalTendencies = { dominant_emotions: ['中立'] };
    this.setPersonalityByOSType();
    this.setDefaultHexagram();
  }
  
  /**
   * 活性度を計算
   */
  calculateActivation(answers) {
    if (!answers || answers.length === 0) return 0.5;
    
    // 回答の強度と関連性から活性度を計算
    let totalIntensity = 0;
    let validAnswers = 0;
    
    answers.forEach(answer => {
      if (answer && answer.intensity) {
        totalIntensity += answer.intensity;
        validAnswers++;
      }
    });
    
    if (validAnswers === 0) return 0.5;
    
    const averageIntensity = totalIntensity / validAnswers;
    return Math.max(0.0, Math.min(1.0, averageIntensity));
  }
  
  // === OS行動メソッド ===
  
  /**
   * このOSとしての意思決定
   */
  makeDecision(context) {
    console.log(`🤔 ${this.osName} making decision for:`, context);
    
    this.updateActivation(context);
    
    const decision = {
      osType: this.osType,
      reasoning: this.getDecisionReasoning(context),
      confidence: this.confidence,
      alternatives: this.generateAlternatives(context),
      concerns: this.identifyConcerns(context),
      timestamp: new Date()
    };
    
    this.lastActivationTime = new Date();
    return decision;
  }
  
  /**
   * 意思決定の理由を生成
   */
  getDecisionReasoning(context) {
    const reasoningTemplates = {
      'engine': `価値観的には「${context}」について、私の信念に基づいて判断します。`,
      'interface': `社会的な観点から「${context}」を考慮し、周囲との調和を重視します。`,
      'safemode': `安全性を最優先に「${context}」のリスクを慎重に評価します。`
    };
    
    return reasoningTemplates[this.osType] || `${this.osType}として判断します。`;
  }
  
  /**
   * 代替案を生成
   */
  generateAlternatives(context) {
    // OSタイプ別の代替案生成ロジック
    const alternatives = [];
    
    switch (this.osType) {
      case 'engine':
        alternatives.push('理想的な解決策を追求する');
        alternatives.push('創造的なアプローチを試す');
        break;
      case 'interface':
        alternatives.push('関係者と話し合って決める');
        alternatives.push('皆が納得できる妥協案を探す');
        break;
      case 'safemode':
        alternatives.push('より安全な選択肢を選ぶ');
        alternatives.push('十分な準備をしてから実行');
        break;
    }
    
    return alternatives;
  }
  
  /**
   * 懸念事項を特定
   */
  identifyConcerns(context) {
    const concerns = [];
    
    switch (this.osType) {
      case 'engine':
        concerns.push('価値観との整合性');
        concerns.push('創造性の制限');
        break;
      case 'interface':
        concerns.push('人間関係への影響');
        concerns.push('調和の破綻');
        break;
      case 'safemode':
        concerns.push('予期せぬリスク');
        concerns.push('不確実な結果');
        break;
    }
    
    return concerns;
  }
  
  /**
   * このOSの意見を表明
   */
  expressOpinion(topic) {
    const opinion = {
      osType: this.osType,
      stance: this.getStanceOnTopic(topic),
      reasoning: this.getOpinionReasoning(topic),
      emotion: this.getCurrentEmotion(),
      confidence: this.confidence
    };
    
    console.log(`💭 ${this.osName} opinion on "${topic}":`, opinion.stance);
    return opinion;
  }
  
  /**
   * トピックに対するスタンスを取得
   */
  getStanceOnTopic(topic) {
    // 簡略化された実装
    const stanceTemplates = {
      'engine': `「${topic}」については、私の価値観から見て...`,
      'interface': `「${topic}」について、皆さんはどう思われますか？私は...`,
      'safemode': `「${topic}」は慎重に検討する必要があります...`
    };
    
    return stanceTemplates[this.osType] || `${topic}について考えてみます`;
  }
  
  /**
   * 意見の理由を生成
   */
  getOpinionReasoning(topic) {
    return `${this.osType}の観点から${topic}を分析した結果です`;
  }
  
  /**
   * 刺激への反応
   */
  reactToStimulus(stimulus) {
    console.log(`⚡ ${this.osName} reacting to stimulus:`, stimulus);
    
    const reaction = {
      osType: this.osType,
      emotionalResponse: this.getEmotionalResponse(stimulus),
      behavioralResponse: this.getBehavioralResponse(stimulus),
      thoughts: this.getThoughtResponse(stimulus),
      intensity: this.calculateReactionIntensity(stimulus)
    };
    
    this.updateMoodFromStimulus(stimulus);
    return reaction;
  }
  
  /**
   * 感情的反応を取得
   */
  getEmotionalResponse(stimulus) {
    // OSタイプ別の感情反応
    const emotionalResponses = {
      'engine': ['情熱', '共感', '反発'],
      'interface': ['配慮', '心配', '喜び'],
      'safemode': ['警戒', '不安', '安堵']
    };
    
    const emotions = emotionalResponses[this.osType] || ['中立'];
    return emotions[Math.floor(Math.random() * emotions.length)];
  }
  
  /**
   * 行動的反応を取得
   */
  getBehavioralResponse(stimulus) {
    const behaviorResponses = {
      'engine': '価値観に基づいて行動する',
      'interface': '周囲の反応を確認してから対応',
      'safemode': '慎重に状況を分析してから判断'
    };
    
    return behaviorResponses[this.osType] || '様子を見る';
  }
  
  /**
   * 思考的反応を取得
   */
  getThoughtResponse(stimulus) {
    return `${this.osType}として${stimulus}について考えています`;
  }
  
  /**
   * 反応の強度を計算
   */
  calculateReactionIntensity(stimulus) {
    // 刺激の内容とOSの特性に基づいて強度を計算
    return Math.random() * this.activation;
  }
  
  /**
   * 他OSとの交渉
   */
  negotiateWith(otherOSList) {
    console.log(`🤝 ${this.osName} negotiating with other OSes`);
    
    const negotiation = {
      proposer: this.osType,
      proposal: this.generateNegotiationProposal(),
      concessions: this.identifyPossibleConcessions(),
      dealBreakers: this.identifyDealBreakers(),
      preferredOutcome: this.getPreferredOutcome()
    };
    
    // 交渉履歴を記録
    this.recordNegotiation(negotiation, otherOSList);
    
    return negotiation;
  }
  
  /**
   * 交渉提案を生成
   */
  generateNegotiationProposal() {
    const proposals = {
      'engine': '理想的な解決策を一緒に見つけましょう',
      'interface': '皆が納得できる方法を探しませんか',
      'safemode': 'まずリスクを整理してから進めませんか'
    };
    
    return proposals[this.osType] || '話し合いましょう';
  }
  
  /**
   * 可能な譲歩を特定
   */
  identifyPossibleConcessions() {
    const concessions = {
      'engine': ['部分的な妥協', '段階的な実現'],
      'interface': ['個人的な好みの調整', '実施方法の柔軟性'],
      'safemode': ['リスク対策の追加', '実施時期の調整']
    };
    
    return concessions[this.osType] || [];
  }
  
  /**
   * 交渉決裂条件を特定
   */
  identifyDealBreakers() {
    const dealBreakers = {
      'engine': ['価値観の根本的否定', '創造性の完全な制限'],
      'interface': ['人間関係の破綻', '孤立の強要'],
      'safemode': ['明らかな危険', '制御不能な状況']
    };
    
    return dealBreakers[this.osType] || [];
  }
  
  /**
   * 希望する結果を取得
   */
  getPreferredOutcome() {
    const outcomes = {
      'engine': '理想の実現と創造的表現',
      'interface': '調和と相互理解',
      'safemode': '安全で予測可能な結果'
    };
    
    return outcomes[this.osType] || '良い結果';
  }
  
  /**
   * 交渉を記録
   */
  recordNegotiation(negotiation, otherOSList) {
    otherOSList.forEach(otherOS => {
      if (otherOS && otherOS.osType !== this.osType) {
        if (!this.relationshipHistory[otherOS.osType]) {
          this.relationshipHistory[otherOS.osType] = {
            cooperation: 0.0,
            conflict: 0.0,
            negotiations: []
          };
        }
        
        this.relationshipHistory[otherOS.osType].negotiations.push({
          timestamp: new Date(),
          proposal: negotiation.proposal,
          outcome: 'pending'
        });
      }
    });
  }
  
  // === ユーティリティメソッド ===
  
  /**
   * 活性度を更新
   */
  updateActivation(context) {
    // コンテキストに基づいて活性度を動的に調整
    const relevance = this.calculateContextRelevance(context);
    this.activation = Math.max(0.0, Math.min(1.0, this.activation + relevance * 0.1));
  }
  
  /**
   * コンテキストとの関連性を計算
   */
  calculateContextRelevance(context) {
    // 簡略化された実装
    return Math.random() * 0.2 - 0.1; // -0.1 to 0.1
  }
  
  /**
   * 現在の感情を取得
   */
  getCurrentEmotion() {
    return this.currentMood;
  }
  
  /**
   * 刺激から気分を更新
   */
  updateMoodFromStimulus(stimulus) {
    // 刺激の種類に基づいて気分を更新
    // 簡略化された実装
    const moodOptions = ['positive', 'negative', 'neutral', 'excited', 'cautious'];
    this.currentMood = moodOptions[Math.floor(Math.random() * moodOptions.length)];
  }
  
  /**
   * OSの現在状態を取得
   */
  getCurrentState() {
    return {
      osType: this.osType,
      osName: this.osName,
      hexagramId: this.hexagramId,
      hexagramName: this.hexagramName,
      activation: this.activation,
      dominance: this.dominance,
      currentMood: this.currentMood,
      stressLevel: this.stressLevel,
      confidence: this.confidence,
      lastActivationTime: this.lastActivationTime,
      characteristics: this.characteristics,
      personality: this.personality
    };
  }
  
  /**
   * OS情報をJSON形式で出力
   */
  toJSON() {
    return {
      osType: this.osType,
      osName: this.osName,
      hexagramId: this.hexagramId,
      hexagramName: this.hexagramName,
      activation: this.activation,
      characteristics: this.characteristics,
      behaviorPatterns: this.behaviorPatterns,
      emotionalTendencies: this.emotionalTendencies,
      personality: this.personality,
      relationshipHistory: this.relationshipHistory,
      timestamp: new Date().toISOString()
    };
  }
}

// グローバルスコープで利用可能にする
if (typeof window !== 'undefined') {
  window.PersonalityOS = PersonalityOS;
}

// Node.js環境での利用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PersonalityOS;
}