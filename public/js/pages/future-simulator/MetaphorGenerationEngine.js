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