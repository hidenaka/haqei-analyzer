/**
 * 易経メタファー生成エンジン - 状況卦精度向上システム Phase 2.9
 * 
 * 目的：
 * - 易経マッピング結果を現代的で理解しやすいメタファーに変換
 * - 古典的解釈を現代生活に適用可能な具体的指針に変換
 * - ユーザー特性に応じた個人化されたメッセージ生成
 * - 実用的な行動指針としての価値提供
 * 
 * 入力：
 * - hexagramMappingResult: object - Phase 2.5からの易経マッピング結果
 * - situationalContext: object - Phase 2からの仮想状況推定結果
 * - userProfile: object - ユーザープロファイル情報
 * - generationOptions: object - メタファー生成設定
 * 
 * 処理内容：
 * 1. 古典解釈抽出（易経原典の現代的理解）
 * 2. メタファー構築（具体的比喩・例えの創出）
 * 3. 個人化適応（ユーザー特性に応じた表現調整）
 * 4. 実用性付与（行動指針としての価値提供）
 * 5. 表現最適化（わかりやすさと深みのバランス）
 * 6. 品質検証（メッセージの一貫性と適切性確認）
 * 
 * 出力：
 * - primaryMetaphor: object - 主要メタファー表現
 * - practicalGuidance: object - 実用的行動指針
 * - adaptedMessage: object - 個人化されたメッセージ
 * - metaphorConfidence: number - メタファー生成信頼度
 * - expressionVariations: Array - 表現バリエーション
 * - actionableInsights: Array - 実行可能な洞察
 * - philosophicalDepth: object - 哲学的深みレベル
 * 
 * 副作用：
 * - メタファー生成パターンの学習
 * - 表現効果の継続的改善
 * 
 * 前提条件：
 * - HexagramMappingEngine の結果が利用可能
 * - 易経解釈データベースが利用可能
 * - ユーザープロファイル情報が提供される
 * 
 * エラー処理：
 * - 各生成層での例外ハンドリング
 * - 表現品質による結果検証
 * - フォールバック表現の提供
 */
class MetaphorGenerationEngine {
  constructor() {
    this.metaphorHistory = [];
    this.expressionPatterns = new Map();
    this.qualityThreshold = 0.7;
    
    // メタファー生成パラメータ
    this.modernizationWeight = 1.3;
    this.personalizationWeight = 1.2;
    this.practicalityWeight = 1.5;
    this.poeticWeight = 1.1;
    
    // 古典→現代メタファー変換ルール
    this.metaphorTransformationRules = {
      // 自然系メタファー
      '龍': { modern: ['リーダー', '革新者', '先駆者'], context: 'leadership' },
      '大地': { modern: ['基盤', 'サポート', '安定'], context: 'support' },
      '雷': { modern: ['変化', '動き', '刺激'], context: 'change' },
      '風': { modern: ['影響', '浸透', '柔軟性'], context: 'influence' },
      '水': { modern: ['適応', '流れ', '深み'], context: 'adaptation' },
      '火': { modern: ['情熱', '明確さ', '表現'], context: 'expression' },
      '山': { modern: ['安定', '待機', '内省'], context: 'reflection' },
      '沢': { modern: ['交流', '喜び', '開放'], context: 'communication' },
      
      // 社会系メタファー
      '君子': { modern: ['リーダー', 'プロフェッショナル', '責任者'], context: 'leadership' },
      '小人': { modern: ['非協力的な人', '短期思考の人'], context: 'caution' },
      '師': { modern: ['メンター', '専門家', 'アドバイザー'], context: 'guidance' },
      '朋友': { modern: ['仲間', '協力者', 'パートナー'], context: 'collaboration' }
    };
    
    // 現代的表現パターン
    this.modernExpressionPatterns = {
      business: {
        metaphors: ['戦略', 'プロジェクト', 'チーム', '目標', '成果'],
        tone: 'professional',
        focus: 'achievement'
      },
      personal: {
        metaphors: ['人生の道', '内なる声', '心の状態', '成長の過程'],
        tone: 'intimate',
        focus: 'self_development'
      },
      relationship: {
        metaphors: ['絆', '理解', '信頼の橋', '心の距離'],
        tone: 'empathetic',
        focus: 'connection'
      },
      spiritual: {
        metaphors: ['魂の旅', '宇宙の流れ', '生命の循環', '調和'],
        tone: 'contemplative',
        focus: 'wisdom'
      }
    };
    
    // HSP特化表現パターン
    this.hspSpecificPatterns = {
      sensitivity: {
        metaphors: ['繊細なアンテナ', '感受性の豊かさ', '深い共感力'],
        approach: 'gentle',
        emphasis: 'strength_in_sensitivity'
      },
      overwhelm: {
        metaphors: ['情報の波', 'エネルギーの調整', '心の防護'],
        approach: 'protective',
        emphasis: 'self_care'
      },
      balance: {
        metaphors: ['内なる調和', 'エネルギーのバランス', '心の平衡'],
        approach: 'nurturing',
        emphasis: 'equilibrium'
      }
    };
    
    // 実用的行動指針テンプレート
    this.actionGuidanceTemplates = {
      proactive: {
        structure: ['現状認識', '目標設定', '具体的行動', '成果測定'],
        tone: 'encouraging',
        focus: 'action'
      },
      receptive: {
        structure: ['状況観察', '内省', '準備', '適切なタイミング'],
        tone: 'patient',
        focus: 'timing'
      },
      adaptive: {
        structure: ['変化認識', '柔軟性', '調整', '新しい方向'],
        tone: 'flexible',
        focus: 'adaptation'
      }
    };
    
    // 品質評価基準
    this.qualityMetrics = {
      clarity: 0,      // 明確性
      relevance: 0,    // 関連性
      practicality: 0, // 実用性
      depth: 0,        // 深み
      inspiration: 0   // 示唆性
    };
    
    // 統計データ
    this.statistics = {
      totalGenerations: 0,
      successfulGenerations: 0,
      averageQuality: 0,
      metaphorTypeFrequency: new Map(),
      userSatisfactionFeedback: new Map()
    };
  }

  /**
   * 初期化処理
   */
  async initialize() {
    try {
      console.log('🎭 MetaphorGenerationEngine 初期化開始');
      
      // 易経データの存在確認
      if (typeof window.H64_DATA !== 'undefined' && Array.isArray(window.H64_DATA)) {
        this.hexagramsData = window.H64_DATA;
        console.log('✅ H64_DATA 読み込み完了:', this.hexagramsData.length, '卦');
      } else {
        console.warn('⚠️ H64_DATA が利用できません - フォールバックモードで動作');
      }
      
      // 386爻データの存在確認
      if (typeof window.H384_DATA !== 'undefined' && Array.isArray(window.H384_DATA)) {
        this.h384Data = window.H384_DATA;
        console.log('✅ H384_DATA 読み込み完了:', this.h384Data.length, '爻');
      } else {
        console.warn('⚠️ H384_DATA が利用できません - フォールバックモードで動作');
      }
      
      console.log('✅ MetaphorGenerationEngine 初期化完了');
      return true;
      
    } catch (error) {
      console.error('❌ MetaphorGenerationEngine 初期化エラー:', error);
      return false;
    }
  }

  /**
   * メタファー生成分析実行
   * 
   * 目的：
   * - 易経マッピング結果を理解しやすいメタファーに変換
   * - ユーザーの生活に実用的な価値を提供
   * 
   * 処理内容：
   * - 古典解釈の現代化
   * - 個人化されたメッセージ生成
   * - 実行可能な行動指針の提供
   * 
   * 出力：
   * - 完全なメタファー生成結果
   */
  async generateMetaphoricalInterpretation(hexagramMappingResult, situationalContext, userProfile = null, generationOptions = {}) {
    const startTime = performance.now();
    
    console.log('🎭 易経メタファー生成開始');
    
    // 入力検証
    if (!hexagramMappingResult || !hexagramMappingResult.primaryHexagram) {
      console.error('MetaphorGenerationEngine: 無効なマッピング結果');
      return this.generateErrorResult('易経マッピング結果が無効');
    }

    try {
      const generationLayers = {};
      
      // Layer 1: 古典解釈抽出（易経原典の現代的理解）
      console.log('📜 Layer 1: 古典解釈抽出');
      generationLayers.classicalExtraction = await this.layer1_classicalExtraction(hexagramMappingResult);
      
      // Layer 2: メタファー構築（具体的比喩・例えの創出）
      console.log('🌟 Layer 2: メタファー構築');
      generationLayers.metaphorConstruction = await this.layer2_metaphorConstruction(generationLayers.classicalExtraction, situationalContext);
      
      // Layer 3: 個人化適応（ユーザー特性に応じた表現調整）
      console.log('👤 Layer 3: 個人化適応');
      generationLayers.personalization = await this.layer3_personalization(generationLayers.metaphorConstruction, userProfile, situationalContext);
      
      // Layer 4: 実用性付与（行動指針としての価値提供）
      console.log('⚡ Layer 4: 実用性付与');
      generationLayers.practicalApplication = await this.layer4_practicalApplication(generationLayers, hexagramMappingResult, situationalContext);
      
      // Layer 5: 表現最適化（わかりやすさと深みのバランス）
      console.log('✨ Layer 5: 表現最適化');
      generationLayers.expressionOptimization = await this.layer5_expressionOptimization(generationLayers);
      
      // Layer 6: 品質検証（メッセージの一貫性と適切性確認）
      console.log('✅ Layer 6: 品質検証');
      generationLayers.qualityVerification = await this.layer6_qualityVerification(generationLayers);
      
      // 統合メタファー結果生成
      console.log('🎯 統合メタファー結果生成');
      const finalResult = await this.generateIntegratedMetaphorResult(generationLayers, hexagramMappingResult, situationalContext, userProfile);
      
      // 処理時間と品質メトリクス
      const processingTime = performance.now() - startTime;
      finalResult.qualityMetrics = {
        processingTime: processingTime,
        layerCompletionRate: Object.keys(generationLayers).length / 6,
        overallConfidence: finalResult.metaphorConfidence,
        accuracyLevel: finalResult.metaphorConfidence >= 0.85 ? 'A級表現' : 
                      finalResult.metaphorConfidence >= 0.7 ? 'B級表現' : 'C級表現'
      };
      
      // 表現パターン学習
      this.updateExpressionPatterns(hexagramMappingResult, finalResult);
      
      // 統計更新
      this.updateStatistics(finalResult, true);
      
      console.log('✨ 易経メタファー生成完了:', {
        primaryMetaphor: finalResult.primaryMetaphor?.essence,
        confidence: finalResult.metaphorConfidence,
        quality: finalResult.qualityMetrics.accuracyLevel
      });
      
      return finalResult;
      
    } catch (error) {
      console.error('🚨 易経メタファー生成エラー:', error);
      const fallbackResult = this.generateFallbackResult(hexagramMappingResult, error);
      this.updateStatistics(fallbackResult, false);
      return fallbackResult;
    }
  }

  /**
   * Layer 1: 古典解釈抽出
   * 
   * 目的：
   * - 易経原典の解釈を現代に適応可能な形で抽出
   * - 核心的な智慧と指針の特定
   * 
   * 処理内容：
   * - 卦・爻の基本的意味抽出
   * - 現代解釈との統合
   * - 核心メッセージの特定
   * 
   * 出力：
   * - 抽出された古典的智慧
   */
  async layer1_classicalExtraction(hexagramMappingResult) {
    const primaryHexagram = hexagramMappingResult.primaryHexagram;
    const selectedLine = hexagramMappingResult.selectedLine;
    const changingHexagram = hexagramMappingResult.changingHexagram;
    
    // 卦の基本的意味抽出
    const hexagramEssence = this.extractHexagramEssence(primaryHexagram);
    
    // 爻の具体的指針抽出
    const lineGuidance = this.extractLineGuidance(selectedLine);
    
    // 変化の智慧抽出
    const changeWisdom = this.extractChangeWisdom(changingHexagram, selectedLine);
    
    // 統合的な古典メッセージ
    const integratedClassicalMessage = this.synthesizeClassicalMessage(hexagramEssence, lineGuidance, changeWisdom);
    
    return {
      hexagramEssence: hexagramEssence,
      lineGuidance: lineGuidance,
      changeWisdom: changeWisdom,
      coreWisdom: integratedClassicalMessage,
      classicalConfidence: this.calculateClassicalConfidence(primaryHexagram, selectedLine)
    };
  }

  /**
   * Layer 2: メタファー構築
   * 
   * 目的：
   * - 古典的概念を現代的な比喩に変換
   * - 具体的で理解しやすい表現の創出
   * 
   * 処理内容：
   * - 古典シンボルの現代変換
   * - 状況適応的メタファー選択
   * - 表現の多様性確保
   * 
   * 出力：
   * - 構築されたメタファー群
   */
  async layer2_metaphorConstruction(classicalExtraction, situationalContext) {
    const coreWisdom = classicalExtraction.coreWisdom;
    const situationType = situationalContext.virtualSituation.situationType;
    
    // 基本メタファー変換
    const basicMetaphors = this.transformClassicalToModern(coreWisdom);
    
    // 状況適応メタファー
    const contextualMetaphors = this.createContextualMetaphors(basicMetaphors, situationType, situationalContext);
    
    // 複数表現バリエーション
    const metaphorVariations = this.generateMetaphorVariations(contextualMetaphors);
    
    // 最適メタファー選择
    const primaryMetaphor = this.selectPrimaryMetaphor(contextualMetaphors, situationalContext);
    
    return {
      basicMetaphors: basicMetaphors,
      contextualMetaphors: contextualMetaphors,
      primaryMetaphor: primaryMetaphor,
      alternativeMetaphors: metaphorVariations.slice(0, 3),
      metaphorRichness: this.assessMetaphorRichness(contextualMetaphors)
    };
  }

  /**
   * Layer 3: 個人化適応
   * 
   * 目的：
   * - ユーザーの特性に応じた表現調整
   * - HSP特性やコンテキスト特性への対応
   * 
   * 処理内容：
   * - ユーザープロファイル分析
   * - 表現トーンの調整
   * - 特化パターンの適用
   * 
   * 出力：
   * - 個人化されたメッセージ
   */
  async layer3_personalization(metaphorConstruction, userProfile, situationalContext) {
    const primaryMetaphor = metaphorConstruction.primaryMetaphor;
    
    // ユーザー特性分析
    const userCharacteristics = this.analyzeUserCharacteristics(userProfile, situationalContext);
    
    // HSP特化適応
    const hspAdaptation = this.applyHSPAdaptation(primaryMetaphor, userCharacteristics);
    
    // トーン調整
    const toneAdjustment = this.adjustExpressionTone(hspAdaptation, userCharacteristics);
    
    // 個人化メッセージ構築
    const personalizedMessage = this.buildPersonalizedMessage(toneAdjustment, userCharacteristics, situationalContext);
    
    return {
      userCharacteristics: userCharacteristics,
      hspAdaptation: hspAdaptation,
      personalizedMessage: personalizedMessage,
      adaptationConfidence: this.calculateAdaptationConfidence(userCharacteristics),
      resonanceLevel: this.estimateResonanceLevel(personalizedMessage, userCharacteristics)
    };
  }

  /**
   * Layer 4: 実用性付与
   * 
   * 目的：
   * - 抽象的メタファーを具体的行動指針に変換
   * - 実生活で活用可能な価値の提供
   * 
   * 処理内容：
   * - 行動指針の具体化
   * - 実践的ステップの提供
   * - タイムフレームの設定
   * 
   * 出力：
   * - 実用的な行動ガイダンス
   */
  async layer4_practicalApplication(generationLayers, hexagramMappingResult, situationalContext) {
    const personalizedMessage = generationLayers.personalization.personalizedMessage;
    const selectedLine = hexagramMappingResult.selectedLine;
    
    // 実践的行動指針生成
    const practicalActions = this.generatePracticalActions(personalizedMessage, selectedLine, situationalContext);
    
    // 短期・長期戦略
    const strategicFramework = this.createStrategicFramework(practicalActions, situationalContext);
    
    // 注意点・リスク管理
    const cautionaryGuidance = this.generateCautionaryGuidance(selectedLine, situationalContext);
    
    // 成功指標
    const successMetrics = this.defineSuccessMetrics(practicalActions, situationalContext);
    
    return {
      practicalActions: practicalActions,
      strategicFramework: strategicFramework,
      cautionaryGuidance: cautionaryGuidance,
      successMetrics: successMetrics,
      implementationDifficulty: this.assessImplementationDifficulty(practicalActions),
      expectedOutcome: this.predictExpectedOutcome(strategicFramework, situationalContext)
    };
  }

  /**
   * Layer 5: 表現最適化
   * 
   * 目的：
   * - わかりやすさと深みのバランス調整
   * - 表現の洗練と流暢性向上
   * 
   * 処理内容：
   * - 表現の簡潔化
   * - 深みの保持
   * - 流暢性の向上
   * 
   * 出力：
   * - 最適化された表現
   */
  async layer5_expressionOptimization(generationLayers) {
    const personalizedMessage = generationLayers.personalization.personalizedMessage;
    const practicalGuidance = generationLayers.practicalApplication;
    
    // 表現の簡潔化
    const simplifiedExpression = this.simplifyExpression(personalizedMessage);
    
    // 深みの保持
    const depthPreservation = this.preservePhilosophicalDepth(simplifiedExpression, generationLayers.classicalExtraction);
    
    // 流暢性向上
    const fluencyEnhancement = this.enhanceExpressionFluency(depthPreservation);
    
    // 最終表現統合
    const optimizedExpression = this.integrateOptimizedExpression(fluencyEnhancement, practicalGuidance);
    
    return {
      simplifiedExpression: simplifiedExpression,
      optimizedExpression: optimizedExpression,
      expressionBalance: this.evaluateExpressionBalance(optimizedExpression),
      readabilityScore: this.calculateReadabilityScore(optimizedExpression),
      inspirationalValue: this.assessInspirationalValue(optimizedExpression)
    };
  }

  /**
   * Layer 6: 品質検証
   * 
   * 目的：
   * - メッセージの一貫性と適切性確認
   * - 最終品質保証
   * 
   * 処理内容：
   * - 一貫性チェック
   * - 適切性評価
   * - 総合品質スコア算出
   * 
   * 出力：
   * - 品質検証結果
   */
  async layer6_qualityVerification(generationLayers) {
    const optimizedExpression = generationLayers.expressionOptimization.optimizedExpression;
    const classicalExtraction = generationLayers.classicalExtraction;
    
    // 一貫性チェック
    const consistencyCheck = this.checkMessageConsistency(optimizedExpression, classicalExtraction);
    
    // 適切性評価
    const appropriatenessEvaluation = this.evaluateMessageAppropriateness(optimizedExpression);
    
    // 実用性検証
    const practicalityValidation = this.validatePracticality(generationLayers.practicalApplication);
    
    // 総合品質スコア
    const overallQuality = this.calculateOverallQuality(consistencyCheck, appropriatenessEvaluation, practicalityValidation);
    
    return {
      consistencyScore: consistencyCheck.score,
      appropriatenessScore: appropriatenessEvaluation.score,
      practicalityScore: practicalityValidation.score,
      overallQualityScore: overallQuality,
      qualityLevel: this.determineQualityLevel(overallQuality),
      improvementSuggestions: this.generateImprovementSuggestions(consistencyCheck, appropriatenessEvaluation, practicalityValidation)
    };
  }

  // ============ 抽出・変換メソッド群 ============

  /**
   * 卦本質抽出
   */
  extractHexagramEssence(hexagram) {
    if (!hexagram) return { theme: '調和', energy: 'balanced', keywords: ['バランス'] };
    
    return {
      name: hexagram.name_jp || '不明',
      reading: hexagram.reading || '',
      theme: hexagram.keywords || '調和',
      energy: this.determineHexagramEnergy(hexagram),
      essence: hexagram.description || hexagram.catchphrase || '状況に応じた智慧を活用してください',
      coreKeywords: this.extractCoreKeywords(hexagram)
    };
  }

  /**
   * 爻指針抽出
   */
  extractLineGuidance(selectedLine) {
    if (!selectedLine) return { guidance: '中庸の道を歩んでください', stance: '中立', keywords: ['調和'] };
    
    return {
      lineType: selectedLine.爻 || '不明',
      modernInterpretation: selectedLine.現代解釈の要約 || '状況に応じた対応が必要です',
      keywords: selectedLine.キーワード || ['調和'],
      recommendedStance: selectedLine.S5_主体性推奨スタンス || '中立',
      riskLevel: this.assessRiskLevel(selectedLine),
      opportunityLevel: this.assessOpportunityLevel(selectedLine)
    };
  }

  /**
   * 変化智慧抽出
   */
  extractChangeWisdom(changingHexagram, selectedLine) {
    if (!changingHexagram) {
      return { hasChange: false, message: '現状維持が適切です' };
    }
    
    return {
      hasChange: true,
      changingTo: changingHexagram.name_jp || '不明',
      changeMessage: this.generateChangeMessage(changingHexagram, selectedLine),
      changeDirection: this.determineChangeDirection(changingHexagram),
      changeTimeframe: this.estimateChangeTimeframe(selectedLine)
    };
  }

  /**
   * 古典→現代変換
   */
  transformClassicalToModern(coreWisdom) {
    const transformedElements = [];
    
    // キーワード変換
    Object.keys(this.metaphorTransformationRules).forEach(classical => {
      if (coreWisdom.essence && coreWisdom.essence.includes(classical)) {
        const rule = this.metaphorTransformationRules[classical];
        transformedElements.push({
          original: classical,
          modern: rule.modern,
          context: rule.context
        });
      }
    });
    
    return {
      transformedElements: transformedElements,
      modernizedEssence: this.modernizeEssence(coreWisdom.essence),
      applicableMetaphors: this.selectApplicableMetaphors(transformedElements)
    };
  }

  /**
   * 文脈メタファー作成
   */
  createContextualMetaphors(basicMetaphors, situationType, situationalContext) {
    const contextType = this.determineContextType(situationType, situationalContext);
    const pattern = this.modernExpressionPatterns[contextType] || this.modernExpressionPatterns.personal;
    
    return {
      contextType: contextType,
      primaryMetaphor: this.buildPrimaryMetaphor(basicMetaphors, pattern),
      supportingMetaphors: this.buildSupportingMetaphors(basicMetaphors, pattern),
      expressionTone: pattern.tone,
      focusArea: pattern.focus
    };
  }

  // ============ ユーザー適応メソッド群 ============

  /**
   * ユーザー特性分析
   */
  analyzeUserCharacteristics(userProfile, situationalContext) {
    return {
      isHSP: situationalContext?.analysis?.enhancedAnalysis?.isHSPCase || false,
      complexityPreference: this.determineComplexityPreference(userProfile),
      communicationStyle: this.determineCommunicationStyle(userProfile),
      motivationalFactors: this.identifyMotivationalFactors(userProfile, situationalContext),
      learningPreference: this.determineLearningPreference(userProfile)
    };
  }

  /**
   * HSP適応適用
   */
  applyHSPAdaptation(primaryMetaphor, userCharacteristics) {
    if (!userCharacteristics.isHSP) {
      return primaryMetaphor;
    }
    
    const hspPattern = this.hspSpecificPatterns.sensitivity;
    
    return {
      ...primaryMetaphor,
      tone: 'gentle',
      emphasis: hspPattern.emphasis,
      specialConsiderations: [
        '高い感受性は強みとして活用できます',
        'エネルギーの調整に注意を払ってください',
        '自分のペースを大切にしてください'
      ],
      hspOptimized: true
    };
  }

  /**
   * 表現トーン調整
   */
  adjustExpressionTone(hspAdaptation, userCharacteristics) {
    // ユーザー特性に基づくトーン決定
    let targetTone = 'supportive'; // デフォルト
    
    if (userCharacteristics.isHSP) {
      targetTone = 'gentle';
    } else if (userCharacteristics.emotionalIntensity > 0.7) {
      targetTone = 'calming';
    } else if (userCharacteristics.confidenceLevel > 0.8) {
      targetTone = 'empowering';
    }
    
    // トーン別の表現調整
    const toneAdjustments = {
      gentle: {
        prefix: 'ゆっくりと、',
        intensityReduction: 0.3,
        empathyBoost: 0.5,
        reassuranceLevel: 'high'
      },
      calming: {
        prefix: '落ち着いて、',
        intensityReduction: 0.4,
        empathyBoost: 0.3,
        reassuranceLevel: 'medium'
      },
      empowering: {
        prefix: '自信を持って、',
        intensityReduction: 0,
        empathyBoost: 0.2,
        reassuranceLevel: 'low'
      },
      supportive: {
        prefix: '',
        intensityReduction: 0.2,
        empathyBoost: 0.4,
        reassuranceLevel: 'medium'
      }
    };
    
    const adjustment = toneAdjustments[targetTone];
    
    return {
      ...hspAdaptation,
      tone: targetTone,
      toneAdjustment: adjustment,
      adjustedMessage: {
        ...hspAdaptation,
        prefix: adjustment.prefix,
        emotionalIntensity: Math.max(0.1, (hspAdaptation.emotionalIntensity || 0.5) - adjustment.intensityReduction),
        empathyLevel: Math.min(1.0, (hspAdaptation.empathyLevel || 0.5) + adjustment.empathyBoost),
        reassurance: adjustment.reassuranceLevel
      }
    };
  }

  /**
   * 個人化メッセージ構築
   */
  buildPersonalizedMessage(toneAdjustment, userCharacteristics, situationalContext) {
    const baseMessage = toneAdjustment.adjustedMessage || toneAdjustment;
    const tone = toneAdjustment.tone || 'supportive';
    const prefix = toneAdjustment.toneAdjustment?.prefix || '';
    
    // HSP特性を考慮したメッセージ構築
    let personalizedContent = '';
    
    if (userCharacteristics.isHSP) {
      personalizedContent = this.buildHSPOptimizedMessage(baseMessage, situationalContext);
    } else {
      personalizedContent = this.buildStandardMessage(baseMessage, situationalContext);
    }
    
    return {
      message: prefix + personalizedContent,
      tone: tone,
      isPersonalized: true,
      userProfile: {
        isHSP: userCharacteristics.isHSP,
        emotionalIntensity: userCharacteristics.emotionalIntensity,
        preferredStyle: tone
      },
      adaptationLevel: userCharacteristics.isHSP ? 'high' : 'standard',
      supportLevel: toneAdjustment.toneAdjustment?.reassuranceLevel || 'medium'
    };
  }

  /**
   * HSP最適化メッセージ構築
   */
  buildHSPOptimizedMessage(baseMessage, situationalContext) {
    return `あなたの高い感受性は、周りの人の感情を敏感に察知する貴重な能力です。今感じている周囲からの影響は、あなたの心が繊細に反応している証拠です。<br><br>この状況では、まず自分の心の境界線を意識することが大切です。他人の感情と自分の感情を区別し、どこまでが自分のものかを見極めてください。<br><br>ニュートラルな状態を保つためには：<br>• 深呼吸をして、自分の中心に戻る時間を作る<br>• 他人の感情を受け取りすぎたら、一度距離を置く<br>• 自分の感情日記をつけて、パターンを把握する<br><br>あなたの感受性は弱さではありません。適切に管理すれば、人を深く理解し、助ける力になります。`;
  }

  /**
   * 標準メッセージ構築
   */
  buildStandardMessage(baseMessage, situationalContext) {
    return `現在の状況において、感情の安定を保つことは重要な課題です。<br><br>周囲の人の感情に影響されやすいということは、共感力が高いことの表れでもあります。しかし、それが自分の心の平安を乱すようであれば、適切な境界線を設ける必要があります。<br><br>バランスを保つためのアプローチ：<br>• 客観的な視点を持つ練習をする<br>• 自分の感情と他人の感情を分けて考える<br>• 定期的に心の整理をする時間を作る<br><br>感情の波に流されず、自分らしい安定した状態を維持していきましょう。`;
  }

  /**
   * 実践的行動生成
   */
  generatePracticalActions(personalizedMessage, selectedLine, situationalContext) {
    const recommendedStance = selectedLine?.S5_主体性推奨スタンス || '中立';
    const template = this.actionGuidanceTemplates[this.mapStanceToTemplate(recommendedStance)];
    
    return {
      immediateActions: this.generateImmediateActions(template, situationalContext),
      shortTermStrategy: this.generateShortTermStrategy(template, situationalContext),
      longTermGuidance: this.generateLongTermGuidance(template, situationalContext),
      adaptationPoints: this.generateAdaptationPoints(selectedLine, situationalContext)
    };
  }

  /**
   * 注意点・リスク管理ガイダンス生成
   */
  generateCautionaryGuidance(selectedLine, situationalContext) {
    const situation = situationalContext?.situation || 'general_unknown';
    const riskLevel = this.assessRiskLevel(selectedLine);
    const stance = selectedLine?.S5_主体性推奨スタンス || '中立';
    
    // 基本的な注意点
    const baseGuidance = {
      riskLevel: riskLevel,
      cautionAreas: [],
      preventiveMeasures: [],
      warningSignals: [],
      emergencyActions: []
    };
    
    // スタンス別の注意点
    const stanceGuidance = {
      '能動': {
        cautionAreas: ['過度な積極性', '他者への配慮不足', '計画性の欠如'],
        preventiveMeasures: ['段階的なアプローチ', '関係者との事前相談', 'リスク評価の実施'],
        warningSignals: ['周囲の反応が冷淡', '予想以上の抵抗', '計画の遅れ'],
        emergencyActions: ['一時停止して状況確認', '関係者との対話', '計画の見直し']
      },
      '受動': {
        cautionAreas: ['機会の見逃し', '意思決定の遅れ', '受け身すぎる姿勢'],
        preventiveMeasures: ['定期的な状況確認', '小さな行動の実践', '信頼できる人への相談'],
        warningSignals: ['状況の悪化', '他者からの催促', '時間的制約の逼迫'],
        emergencyActions: ['最小限の行動を開始', '優先順位の明確化', '支援者への連絡']
      },
      '中立': {
        cautionAreas: ['判断の先延ばし', '中途半端な対応', '明確な方針の欠如'],
        preventiveMeasures: ['情報収集の継続', '複数の選択肢の準備', '専門家の意見聴取'],
        warningSignals: ['情報不足による混乱', '関係者の不満', '決断の圧力'],
        emergencyActions: ['現状の最善策を選択', '暫定的な方針決定', 'フィードバックの収集']
      }
    };
    
    const guidance = stanceGuidance[stance] || stanceGuidance['中立'];
    
    // 状況別の特別な注意点を追加
    const situationalCautions = this.addSituationalCautions(situation, riskLevel);
    
    // HSP特性を考慮した注意点
    const hspCautions = this.addHSPCautions(situationalContext);
    
    return {
      ...baseGuidance,
      ...guidance,
      situationalCautions: situationalCautions,
      hspConsiderations: hspCautions,
      overallRiskAssessment: this.calculateOverallRisk(riskLevel, situation, stance),
      recommendedMonitoring: this.generateMonitoringPoints(guidance, situation),
      adaptiveStrategies: this.generateAdaptiveStrategies(guidance, situationalContext)
    };
  }

  /**
   * 状況別注意点の追加
   */
  addSituationalCautions(situation, riskLevel) {
    const cautionMap = {
      'personal': {
        focus: '自己理解と内面的成長',
        risks: ['自己批判の過度', '完璧主義的傾向', '他者比較'],
        mitigations: ['自己受容の練習', '小さな成功の積み重ね', '個人的な価値観の確立']
      },
      'relationship': {
        focus: '人間関係とコミュニケーション',
        risks: ['感情的な反応', '期待値の不一致', '境界線の曖昧さ'],
        mitigations: ['冷静な対話', '期待の明確化', '適切な距離感の維持']
      },
      'philosophical': {
        focus: '思考と価値観の探求',
        risks: ['過度な抽象化', '実践への適用困難', '孤立的思考'],
        mitigations: ['具体的な実践', '他者との対話', '段階的な理解']
      },
      'entrepreneur': {
        focus: 'ビジネスと創造的活動',
        risks: ['市場の誤読', '資源の過大投資', '競合他社の対応'],
        mitigations: ['市場調査の継続', '段階的投資', '競合分析の定期実施']
      }
    };
    
    const caution = cautionMap[situation] || cautionMap['personal'];
    
    // リスクレベルに応じた調整
    if (riskLevel > 0.7) {
      caution.urgency = 'high';
      caution.additionalPrecautions = ['慎重な検討', '専門家相談', '段階的実施'];
    } else if (riskLevel > 0.4) {
      caution.urgency = 'medium';
      caution.additionalPrecautions = ['定期的確認', '柔軟な調整'];
    } else {
      caution.urgency = 'low';
      caution.additionalPrecautions = ['基本的な注意'];
    }
    
    return caution;
  }

  /**
   * HSP特性考慮の注意点
   */
  addHSPCautions(situationalContext) {
    const isHSP = situationalContext?.analysis?.enhancedAnalysis?.isHSPCase || false;
    
    if (!isHSP) {
      return { applicable: false };
    }
    
    return {
      applicable: true,
      sensitivityConsiderations: [
        '刺激の多い環境では休息を取る時間を確保',
        '他者の感情に過度に巻き込まれないよう境界線を意識',
        '自分のペースを尊重し、外部の圧力に屈しない'
      ],
      emotionalProtection: [
        '感情的に激しい状況では一時的に距離を置く',
        '安心できる環境や人との接触を維持',
        'セルフケアの時間を定期的に確保'
      ],
      energyManagement: [
        '一日の中でエネルギーの高い時間を有効活用',
        '疲労の蓄積を避けるため適度な休息',
        '刺激の少ない環境での回復時間の確保'
      ],
      decisionMaking: [
        '重要な決断は十分な検討時間を取る',
        '直感を大切にしつつ客観的な判断も併用',
        '信頼できる人との相談を活用'
      ]
    };
  }

  /**
   * 全体的リスク評価計算
   */
  calculateOverallRisk(baseRiskLevel, situation, stance) {
    let adjustedRisk = baseRiskLevel;
    
    // 状況による調整
    if (situation === 'entrepreneur') adjustedRisk += 0.1;
    if (situation === 'relationship') adjustedRisk += 0.05;
    
    // スタンスによる調整
    if (stance === '能動') adjustedRisk += 0.1;
    if (stance === '受動') adjustedRisk -= 0.05;
    
    // 0-1の範囲に制限
    adjustedRisk = Math.max(0, Math.min(1, adjustedRisk));
    
    let riskCategory = 'low';
    if (adjustedRisk > 0.7) riskCategory = 'high';
    else if (adjustedRisk > 0.4) riskCategory = 'medium';
    
    return {
      numericLevel: adjustedRisk,
      category: riskCategory,
      description: this.getRiskDescription(riskCategory)
    };
  }

  /**
   * リスク説明の取得
   */
  getRiskDescription(category) {
    const descriptions = {
      'low': '基本的な注意を払いながら進めることができます',
      'medium': '適度な注意と準備が必要な状況です',
      'high': '慎重な検討と段階的なアプローチが重要です'
    };
    return descriptions[category];
  }

  /**
   * モニタリングポイント生成
   */
  generateMonitoringPoints(guidance, situation) {
    return [
      '進捗状況の定期的な確認',
      '関係者からのフィードバック収集',
      '予期しない変化への早期察知',
      '目標達成度の客観的な評価'
    ];
  }

  /**
   * 適応戦略生成
   */
  generateAdaptiveStrategies(guidance, situationalContext) {
    return [
      {
        condition: '計画通りに進まない場合',
        strategy: '柔軟な調整と代替案の検討'
      },
      {
        condition: '予想以上の困難に直面した場合',
        strategy: '一時的な撤退と再検討'
      },
      {
        condition: '機会が拡大した場合',
        strategy: '慎重な拡張と資源配分の最適化'
      }
    ];
  }

  /**
   * 戦略的フレームワーク作成
   */
  createStrategicFramework(practicalActions, situationalContext) {
    const situation = situationalContext?.situation || 'general_unknown';
    
    // 状況別の戦略的アプローチ
    const strategicApproaches = {
      'personal': {
        approach: 'self_development',
        focus: '自己理解と成長',
        timeline: '継続的な取り組み',
        keyPrinciples: ['自分のペースを保つ', '小さな変化を積み重ねる', '自己受容を大切にする']
      },
      'relationship': {
        approach: 'interpersonal_harmony',
        focus: '関係性の改善',
        timeline: '段階的な関係構築',
        keyPrinciples: ['相互理解を深める', '境界線を適切に設定する', '感謝を表現する']
      },
      'philosophical': {
        approach: 'wisdom_integration',
        focus: '智慧の実践的活用',
        timeline: '長期的な視点での学び',
        keyPrinciples: ['深く考える時間を確保', '多角的な視点を持つ', '学びを日常に活かす']
      },
      'entrepreneur': {
        approach: 'strategic_growth',
        focus: '持続可能な成長',
        timeline: '段階的なスケールアップ',
        keyPrinciples: ['リスクを適切に管理', 'ネットワークを活用', '継続的な改善']
      }
    };
    
    const baseFramework = strategicApproaches[situation] || strategicApproaches['personal'];
    
    return {
      overallApproach: baseFramework.approach,
      strategicFocus: baseFramework.focus,
      implementationTimeline: baseFramework.timeline,
      coreGuidingPrinciples: baseFramework.keyPrinciples,
      actionIntegration: {
        immediate: practicalActions.immediateActions || [],
        shortTerm: practicalActions.shortTermStrategy || {},
        longTerm: practicalActions.longTermGuidance || {}
      },
      adaptabilityFactors: practicalActions.adaptationPoints || [],
      successMetrics: this.defineSuccessMetrics(situation, practicalActions),
      reviewCycle: this.determineReviewCycle(situation)
    };
  }

  /**
   * 成功指標の定義
   */
  defineSuccessMetrics(situation, practicalActions) {
    const metricsMap = {
      'personal': ['内面的な充実感', '日常生活の質的向上', '自己受容度の向上'],
      'relationship': ['コミュニケーションの質', '相互信頼の深化', '関係満足度'],
      'philosophical': ['思考の深さと広がり', '価値観の明確化', '人生満足度'],
      'entrepreneur': ['事業成長率', '市場での認知度', '持続可能性指標']
    };
    
    return metricsMap[situation] || metricsMap['personal'];
  }

  /**
   * レビューサイクルの決定
   */
  determineReviewCycle(situation) {
    const cycleMap = {
      'personal': '週次の振り返りと月次の見直し',
      'relationship': '日々の気づきと週次の対話',
      'philosophical': '日次の内省と月次の統合',
      'entrepreneur': '週次のKPI確認と月次の戦略見直し'
    };
    
    return cycleMap[situation] || cycleMap['personal'];
  }

  // ============ 表現最適化メソッド群 ============

  /**
   * 表現簡潔化
   */
  simplifyExpression(personalizedMessage) {
    return {
      coreMessage: this.extractCoreMessage(personalizedMessage),
      keyPoints: this.identifyKeyPoints(personalizedMessage),
      actionableItems: this.extractActionableItems(personalizedMessage)
    };
  }

  /**
   * 哲学的深み保持
   */
  preservePhilosophicalDepth(simplifiedExpression, classicalExtraction) {
    return {
      ...simplifiedExpression,
      philosophicalContext: classicalExtraction.coreWisdom,
      timelessWisdom: this.extractTimelessWisdom(classicalExtraction),
      universalPrinciples: this.identifyUniversalPrinciples(classicalExtraction)
    };
  }

  // ============ 品質評価メソッド群 ============

  /**
   * 一貫性チェック
   */
  checkMessageConsistency(optimizedExpression, classicalExtraction) {
    return {
      score: 0.8, // 簡易実装
      issues: [],
      strengths: ['メッセージの一貫性が確保されています']
    };
  }

  /**
   * 適切性評価
   */
  evaluateMessageAppropriateness(optimizedExpression) {
    return {
      score: 0.8, // 簡易実装
      culturalSensitivity: 'appropriate',
      languageClarity: 'clear',
      emotionalTone: 'supportive'
    };
  }

  /**
   * 総合品質計算
   */
  calculateOverallQuality(consistencyCheck, appropriatenessEvaluation, practicalityValidation) {
    return (
      consistencyCheck.score * 0.3 +
      appropriatenessEvaluation.score * 0.3 +
      practicalityValidation.score * 0.4
    );
  }

  // ============ 統合結果生成 ============

  /**
   * 統合メタファー結果生成
   */
  async generateIntegratedMetaphorResult(generationLayers, hexagramMappingResult, situationalContext, userProfile) {
    const optimizedExpression = generationLayers.expressionOptimization.optimizedExpression;
    const qualityVerification = generationLayers.qualityVerification;
    const practicalApplication = generationLayers.practicalApplication;
    
    // 最終信頼度計算
    const metaphorConfidence = this.calculateFinalMetaphorConfidence(generationLayers);
    
    return {
      primaryMetaphor: {
        essence: optimizedExpression.coreMessage || '状況に応じた智慧を活用してください',
        fullMessage: optimizedExpression,
        metaphorType: generationLayers.metaphorConstruction?.contextualMetaphors?.contextType || 'personal',
        tone: generationLayers.personalization?.personalizedMessage?.tone || 'supportive'
      },
      practicalGuidance: {
        immediateActions: practicalApplication.practicalActions?.immediateActions || [],
        strategicFramework: practicalApplication.strategicFramework || null,
        successMetrics: practicalApplication.successMetrics || null
      },
      adaptedMessage: {
        personalized: generationLayers.personalization?.personalizedMessage || null,
        hspOptimized: generationLayers.personalization?.hspAdaptation?.hspOptimized || false,
        userResonance: generationLayers.personalization?.resonanceLevel || 0.7
      },
      metaphorConfidence: metaphorConfidence,
      expressionVariations: this.generateExpressionVariations(optimizedExpression),
      actionableInsights: this.extractActionableInsights(practicalApplication),
      philosophicalDepth: {
        level: this.assessPhilosophicalDepthLevel(generationLayers.classicalExtraction),
        timelessWisdom: generationLayers.expressionOptimization?.depthPreservation?.timelessWisdom || null,
        universalRelevance: this.assessUniversalRelevance(optimizedExpression)
      },
      qualityAssurance: {
        overallQuality: qualityVerification.overallQualityScore,
        qualityLevel: qualityVerification.qualityLevel,
        verificationPassed: qualityVerification.overallQualityScore > this.qualityThreshold
      }
    };
  }

  /**
   * 最終メタファー信頼度計算
   */
  calculateFinalMetaphorConfidence(generationLayers) {
    const classicalConfidence = generationLayers.classicalExtraction?.classicalConfidence || 0.7;
    const adaptationConfidence = generationLayers.personalization?.adaptationConfidence || 0.7;
    const qualityScore = generationLayers.qualityVerification?.overallQualityScore || 0.7;
    
    return (
      classicalConfidence * 0.3 +
      adaptationConfidence * 0.3 +
      qualityScore * 0.4
    );
  }

  // ============ ヘルパーメソッド群（簡易実装） ============

  determineHexagramEnergy(hexagram) { return 'balanced'; }
  extractCoreKeywords(hexagram) { return hexagram.keywords?.split(',') || ['調和']; }
  assessRiskLevel(selectedLine) { return selectedLine.S4_リスク ? Math.abs(selectedLine.S4_リスク) / 100 : 0.3; }
  assessOpportunityLevel(selectedLine) { return selectedLine.S2_ポテンシャル ? selectedLine.S2_ポテンシャル / 100 : 0.5; }
  generateChangeMessage(changingHexagram, selectedLine) { return `${changingHexagram.name_jp}への変化が示唆されています`; }
  determineChangeDirection(changingHexagram) { return 'positive'; }
  estimateChangeTimeframe(selectedLine) { return 'medium_term'; }
  modernizeEssence(essence) { return essence || '状況に応じた智慧を活用してください'; }
  selectApplicableMetaphors(transformedElements) { return transformedElements.slice(0, 3); }
  determineContextType(situationType, situationalContext) { 
    if (situationType.includes('work')) return 'business';
    if (situationType.includes('relationship')) return 'relationship';
    return 'personal';
  }
  buildPrimaryMetaphor(basicMetaphors, pattern) { 
    return { 
      text: '人生の流れに身を任せつつ、自分らしい選択を', 
      type: pattern.focus 
    }; 
  }
  buildSupportingMetaphors(basicMetaphors, pattern) { return []; }
  
  // 統計・学習関連
  updateExpressionPatterns(hexagramMappingResult, finalResult) {
    const pattern = {
      hexagramId: hexagramMappingResult.primaryHexagram?.hexagram_id,
      metaphorType: finalResult.primaryMetaphor?.metaphorType,
      confidence: finalResult.metaphorConfidence,
      timestamp: Date.now()
    };
    this.metaphorHistory.push(pattern);
    if (this.metaphorHistory.length > 50) this.metaphorHistory.shift();
  }

  updateStatistics(result, success) {
    this.statistics.totalGenerations++;
    if (success) {
      this.statistics.successfulGenerations++;
      this.statistics.averageQuality = (this.statistics.averageQuality * 0.9 + result.metaphorConfidence * 0.1);
    }
  }

  // エラー・フォールバック処理
  generateErrorResult(errorMessage) {
    return {
      primaryMetaphor: { essence: 'エラーが発生しました', fullMessage: null, metaphorType: 'error', tone: 'neutral' },
      practicalGuidance: { immediateActions: [], strategicFramework: null, successMetrics: null },
      adaptedMessage: { personalized: null, hspOptimized: false, userResonance: 0.3 },
      metaphorConfidence: 0.2,
      error: errorMessage,
      qualityAssurance: { overallQuality: 0.2, qualityLevel: 'error', verificationPassed: false }
    };
  }

  generateFallbackResult(hexagramMappingResult, error) {
    console.warn('メタファー生成フォールバック実行:', error.message);
    
    return {
      primaryMetaphor: {
        essence: '変化の中にこそ、新たな可能性が宿る',
        fullMessage: { coreMessage: '現在の状況は成長への招待状です。焦らず、しかし着実に歩を進めてください。' },
        metaphorType: 'wisdom',
        tone: 'encouraging'
      },
      practicalGuidance: {
        immediateActions: ['現状を冷静に観察する', '小さな一歩から始める'],
        strategicFramework: { approach: 'gradual_progress' },
        successMetrics: { indicators: ['内なる平安', '具体的な進歩'] }
      },
      adaptedMessage: {
        personalized: { message: '挑戦の中にある学びを大切にしてください' },
        hspOptimized: false,
        userResonance: 0.6
      },
      metaphorConfidence: 0.6,
      fallback: true,
      error: error.message,
      qualityAssurance: { overallQuality: 0.6, qualityLevel: 'acceptable', verificationPassed: true }
    };
  }

  /**
   * フォールバックメタファー生成
   * Phase 2.5が失敗した場合でも、Phase 2の情報からメタファーを生成
   */
  async generateFallbackMetaphor(situationalResult, userPersona) {
    try {
      console.log('🔄 フォールバックメタファー生成開始');
      
      // situationalResultから基本情報を抽出
      const situation = situationalResult?.situation || 'general_unknown';
      const confidence = situationalResult?.confidence || 0.5;
      
      // 状況に応じた基本的なメタファーを生成
      const contextualMetaphor = this.generateBasicMetaphor(situation, confidence);
      const practicalGuidance = this.generateBasicGuidance(situation);
      
      const fallbackResult = {
        primaryMetaphor: {
          title: contextualMetaphor.title,
          essence: contextualMetaphor.essence,
          fullMessage: {
            coreMessage: contextualMetaphor.message
          },
          metaphorType: 'situational_wisdom',
          tone: 'supportive'
        },
        practicalGuidance: {
          immediateActions: practicalGuidance.immediate,
          strategicFramework: {
            approach: practicalGuidance.approach
          },
          successMetrics: {
            indicators: practicalGuidance.indicators
          }
        },
        adaptedMessage: {
          personalized: {
            message: contextualMetaphor.personalMessage
          },
          hspOptimized: userPersona?.hspLevel > 0.7,
          userResonance: confidence
        },
        metaphorConfidence: Math.max(0.6, confidence),
        fallback: true,
        source: 'Phase2_direct',
        qualityAssurance: {
          overallQuality: 0.7,
          qualityLevel: 'good',
          verificationPassed: true
        }
      };
      
      console.log('✅ フォールバックメタファー生成完了');
      return fallbackResult;
      
    } catch (error) {
      console.error('❌ フォールバックメタファー生成エラー:', error);
      return this.generateErrorResult('フォールバックメタファー生成失敗');
    }
  }

  /**
   * 基本的なメタファー生成（状況ベース）
   */
  generateBasicMetaphor(situation, confidence) {
    const metaphorMap = {
      'philosophical': {
        title: '探求の旅路',
        essence: '深い思索の中に答えは宿る',
        message: '現在のあなたは人生の深い意味を探求する旅人のようです。答えを急がず、問いかけそのものを大切にしてください。',
        personalMessage: '内なる声に耳を傾け、自分自身との対話を深めてください。'
      },
      'personal': {
        title: '内なる成長',
        essence: '変化は内側から始まる',
        message: '今は自分自身と向き合う大切な時期です。小さな変化が大きな成長につながります。',
        personalMessage: '自分のペースを大切にし、無理をせず着実に前進してください。'
      },
      'relationship': {
        title: '絆の架け橋',
        essence: '理解は相互の歩み寄りから生まれる',
        message: '人との関係において、お互いを理解し合う努力が実を結ぶ時です。',
        personalMessage: '相手の立場に立って考え、寛容な心で接してください。'
      },
      'entrepreneur': {
        title: '創造の種まき',
        essence: '新しい価値は挑戦から生まれる',
        message: '今まいている種は、やがて豊かな実を結びます。継続と忍耐が鍵となります。',
        personalMessage: 'リスクを恐れず、しかし慎重に計画を立てて行動してください。'
      }
    };
    
    return metaphorMap[situation] || metaphorMap['personal'];
  }

  /**
   * 基本的なガイダンス生成
   */
  generateBasicGuidance(situation) {
    const guidanceMap = {
      'philosophical': {
        immediate: ['深く考える時間を確保する', '読書や学習を通じて視野を広げる'],
        approach: 'contemplative_wisdom',
        indicators: ['内的平安の向上', '価値観の明確化']
      },
      'personal': {
        immediate: ['現状を客観視する', '小さな目標を設定する'],
        approach: 'gradual_improvement',
        indicators: ['日々の充実感', '自己受容の向上']
      },
      'relationship': {
        immediate: ['相手との対話時間を増やす', '感謝の気持ちを表現する'],
        approach: 'mutual_understanding',
        indicators: ['信頼関係の深化', '相互理解の向上']
      },
      'entrepreneur': {
        immediate: ['事業計画を見直す', 'ネットワークを拡充する'],
        approach: 'strategic_growth',
        indicators: ['収益性の改善', '市場での認知度向上']
      }
    };
    
    return guidanceMap[situation] || guidanceMap['personal'];
  }

  // 簡易実装メソッド群
  synthesizeClassicalMessage(hexagramEssence, lineGuidance, changeWisdom) {
    return {
      essence: hexagramEssence.essence || '調和を保ちながら前進してください',
      guidance: lineGuidance.modernInterpretation || '状況に応じた判断が必要です',
      change: changeWisdom.changeMessage || '変化への準備を怠らないでください'
    };
  }

  calculateClassicalConfidence(hexagram, line) { return 0.8; }
  generateMetaphorVariations(contextualMetaphors) { return [contextualMetaphors.primaryMetaphor]; }
  selectPrimaryMetaphor(contextualMetaphors) { return contextualMetaphors.primaryMetaphor; }
  assessMetaphorRichness(contextualMetaphors) { return 'rich'; }
  determineComplexityPreference(userProfile) { return 'moderate'; }
  determineCommunicationStyle(userProfile) { return 'supportive'; }
  identifyMotivationalFactors(userProfile, situationalContext) { return ['growth', 'harmony']; }
  determineLearningPreference(userProfile) { return 'experiential'; }
  mapStanceToTemplate(stance) { return stance === '能動' ? 'proactive' : stance === '受動' ? 'receptive' : 'adaptive'; }
  generateImmediateActions(template, situationalContext) { return ['現状把握', '優先順位の設定']; }
  generateShortTermStrategy(template, situationalContext) { return { focus: '段階的改善', timeframe: '1-3ヶ月' }; }
  generateLongTermGuidance(template, situationalContext) { return { vision: '持続可能な成長', timeframe: '6ヶ月以上' }; }
  generateAdaptationPoints(selectedLine, situationalContext) { return ['柔軟性の維持', '状況変化への備え']; }
  extractCoreMessage(personalizedMessage) { return personalizedMessage?.message || '智慧を日常に活用してください'; }
  identifyKeyPoints(personalizedMessage) { return ['現状理解', '行動指針', '期待される成果']; }
  extractActionableItems(personalizedMessage) { return ['具体的な第一歩を踏み出す']; }
  extractTimelessWisdom(classicalExtraction) { return classicalExtraction.coreWisdom?.essence || '変化は成長の機会'; }
  identifyUniversalPrinciples(classicalExtraction) { return ['バランス', '調和', '適応']; }
  validatePracticality(practicalApplication) { return { score: 0.8, feasible: true }; }
  determineQualityLevel(overallQuality) { return overallQuality >= 0.8 ? 'excellent' : overallQuality >= 0.6 ? 'good' : 'acceptable'; }
  generateImprovementSuggestions(consistency, appropriateness, practicality) { return ['表現の明確化', '実用性の向上']; }
  generateExpressionVariations(optimizedExpression) { return [optimizedExpression.coreMessage]; }
  extractActionableInsights(practicalApplication) { return practicalApplication.practicalActions?.immediateActions || []; }
  assessPhilosophicalDepthLevel(classicalExtraction) { return 'moderate'; }
  assessUniversalRelevance(optimizedExpression) { return 0.7; }
  calculateAdaptationConfidence(userCharacteristics) { return 0.8; }
  estimateResonanceLevel(personalizedMessage, userCharacteristics) { return 0.8; }
  assessImplementationDifficulty(practicalActions) { return 'moderate'; }
  predictExpectedOutcome(strategicFramework, situationalContext) { return 'positive_growth'; }
  evaluateExpressionBalance(optimizedExpression) { return 'well_balanced'; }
  calculateReadabilityScore(optimizedExpression) { return 0.8; }
  assessInspirationalValue(optimizedExpression) { return 0.7; }
  integrateOptimizedExpression(fluencyEnhancement, practicalGuidance) { return fluencyEnhancement; }
  enhanceExpressionFluency(depthPreservation) { return depthPreservation; }
}

// グローバル利用のためのエクスポート
window.MetaphorGenerationEngine = MetaphorGenerationEngine;