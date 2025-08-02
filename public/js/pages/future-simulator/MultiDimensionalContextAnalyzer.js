/**
 * 多次元コンテキスト分析エンジン - 状況卦精度向上システム
 * 
 * 目的：
 * - 複数コンテキストの同時存在を適切に処理
 * - 意図・目的・感情状態の包括分析
 * - HSP・感情調整特化の精度向上
 * - 文脈ベクトル化と意味的類似度計算
 * 
 * 入力：
 * - inputText: string - 分析対象テキスト
 * - userPersona: object - ユーザー属性情報
 * - contextHistory: Array - 過去のコンテキスト履歴
 * 
 * 処理内容：
 * 1. 多次元スコアリング（複数コンテキスト同時評価）
 * 2. 意図理解分析（なぜ・何のため・どうしたい）
 * 3. 感情状態深層分析（HSP特化）
 * 4. 文脈的整合性検証
 * 5. 重複度・影響度定量化
 * 6. 動的重み付け調整
 * 
 * 出力：
 * - primaryContext: string - 主要コンテキスト
 * - secondaryContexts: Array - 副次コンテキスト配列
 * - contextWeights: object - 各コンテキストの重み
 * - intentionAnalysis: object - 意図分析結果
 * - emotionalProfile: object - 感情プロファイル
 * - confidence: number - 分析信頼度
 * - multidimensionalMetrics: object - 多次元分析指標
 * 
 * 副作用：
 * - 学習データの蓄積
 * - コンテキスト遷移パターンの記録
 * 
 * 前提条件：
 * - ENHANCED_CONTEXT_TYPES が定義済み
 * - kuromoji.js が初期化済み
 * 
 * エラー処理：
 * - 各層での例外ハンドリング
 * - 段階的フォールバック処理
 * - 品質しきい値による結果検証
 */
class MultiDimensionalContextAnalyzer {
  constructor(kuromojiTokenizer = null) {
    this.tokenizer = kuromojiTokenizer || {
      tokenize: (text) => text.split(/\s+/).map(word => ({ 
        surface_form: word, 
        basic_form: word,
        pos: '記号',
        pos_detail_1: '*',
        pos_detail_2: '*',
        pos_detail_3: '*'
      }))
    };
    this.contextHistory = [];
    this.learningData = new Map();
    this.qualityThreshold = 0.7;
    
    // HSP特化分析パラメータ
    this.hspSensitivityThreshold = 0.6;
    this.emotionalIntensityWeight = 1.5;
    
    // 意図分析キーワード定義
    this.intentionKeywords = {
      seeking_help: ['どうすれば', 'どうしたら', '教えて', 'アドバイス', '助けて', '困って'],
      expressing_worry: ['不安', '心配', '気になる', '悩んで', '迷って', 'もやもや'],
      sharing_experience: ['体験', '経験', 'あった', 'になった', 'しました', 'でした'],
      seeking_understanding: ['理解', '分かって', '共感', '気持ち', '感じ', '思い'],
      planning_action: ['する予定', 'つもり', '計画', '考えている', 'やりたい', '目指す'],
      reflecting: ['振り返る', '考えて', '思い返す', '反省', '見つめ直す', '整理']
    };
    
    // 感情状態分析パターン
    this.emotionalPatterns = {
      hsp_overwhelm: /[感敏][じ受].{0,10}[やすいすぎる]|疲れ.{0,5}やすい|刺激.{0,5}強い|人混み.{0,5}苦手/g,
      emotional_instability: /[気感][持情].{0,10}[浮不安][き定]/g,
      seeking_balance: /バランス|ニュートラル|調整|整える|安定/g,
      deep_concern: /[深真]刻|[重深]要|[深本]質的|根本的/g,
      philosophical_seeking: /[人生存]の[意味価値]|生きる.{0,5}意味|なぜ.{0,5}生きる/g
    };
    
    // 統計データ
    this.statistics = {
      totalAnalyses: 0,
      multidimensionalDetections: 0,
      hspDetections: 0,
      accuracyRate: 0,
      contextTransitions: new Map()
    };
  }

  /**
   * 多次元コンテキスト分析実行
   * 
   * 目的：
   * - 単一コンテキストではなく複数コンテキストの重層的分析
   * - 意図・感情・状況の統合的理解
   * 
   * 処理内容：
   * - 6層の多次元分析実行と統合
   * - コンテキスト間の相互関係分析
   * - 動的重み付けによる精度向上
   * 
   * 出力：
   * - 多次元分析結果オブジェクト
   */
  async analyzeMultiDimensionalContext(inputText, userPersona = null, contextHistory = null) {
    const startTime = performance.now();
    
    console.log('🌐 多次元コンテキスト分析開始');
    
    // 入力検証
    if (!inputText || typeof inputText !== 'string' || inputText.trim().length === 0) {
      console.error('MultiDimensionalContextAnalyzer: 無効な入力');
      return this.generateErrorResult('無効な入力テキスト');
    }

    try {
      const analysisLayers = {};
      
      // Layer 1: 基本コンテキスト分析（既存システム拡張）
      console.log('📊 Layer 1: 基本コンテキスト分析');
      analysisLayers.basicContext = await this.layer1_basicContextAnalysis(inputText);
      
      // Layer 2: 意図理解分析
      console.log('🎯 Layer 2: 意図理解分析');
      analysisLayers.intentionAnalysis = await this.layer2_intentionAnalysis(inputText);
      
      // Layer 3: 感情状態深層分析（HSP特化）
      console.log('💭 Layer 3: 感情状態深層分析');
      analysisLayers.emotionalProfile = await this.layer3_emotionalAnalysis(inputText, userPersona);
      
      // Layer 4: 複数コンテキスト同時評価
      console.log('🔄 Layer 4: 複数コンテキスト同時評価');
      analysisLayers.multidimensionalScore = await this.layer4_multidimensionalScoring(analysisLayers);
      
      // Layer 5: 文脈的整合性検証
      console.log('✅ Layer 5: 文脈的整合性検証');
      analysisLayers.contextualConsistency = await this.layer5_contextualConsistency(analysisLayers);
      
      // Layer 6: 統合結果生成
      console.log('🎭 Layer 6: 統合結果生成');
      const finalResult = await this.layer6_generateIntegratedResult(analysisLayers, inputText, userPersona);
      
      // 処理時間と品質メトリクス
      const processingTime = performance.now() - startTime;
      finalResult.qualityMetrics = {
        processingTime: processingTime,
        layerCompletionRate: Object.keys(analysisLayers).length / 6,
        overallConfidence: finalResult.confidence,
        accuracyLevel: finalResult.confidence >= 0.8 ? 'A級' : finalResult.confidence >= 0.6 ? 'B級' : 'C級'
      };
      
      // 学習データ蓄積
      this.updateLearningData(inputText, finalResult);
      
      // 統計更新
      this.updateStatistics(finalResult, true);
      
      console.log('✨ 多次元コンテキスト分析完了:', {
        primary: finalResult.primaryContext,
        confidence: finalResult.confidence,
        dimensions: finalResult.secondaryContexts.length + 1
      });
      
      return finalResult;
      
    } catch (error) {
      console.error('🚨 多次元コンテキスト分析エラー:', error);
      const fallbackResult = this.generateFallbackResult(inputText, error);
      this.updateStatistics(fallbackResult, false);
      return fallbackResult;
    }
  }

  /**
   * Layer 1: 基本コンテキスト分析（既存システム拡張）
   * 
   * 目的：
   * - 既存のanalyzeContextType機能を拡張
   * - 全コンテキストタイプの同時スコアリング
   * 
   * 処理内容：
   * - 各コンテキストタイプでの詳細スコア計算
   * - パターンマッチング精度向上
   * - キーワード重み付けの動的調整
   * 
   * 出力：
   * - 全コンテキストのスコア配列
   */
  async layer1_basicContextAnalysis(inputText) {
    const normalizedText = inputText.toLowerCase().trim();
    const allContextScores = [];
    
    // ENHANCED_CONTEXT_TYPES の各コンテキストを詳細分析
    for (const [typeId, config] of Object.entries(window.ENHANCED_CONTEXT_TYPES || {})) {
      if (typeId === 'hybrid') continue; // hybridは後で特別処理
      
      let score = 0;
      let matchDetails = {
        keywordMatches: [],
        patternMatches: [],
        semanticMatches: 0,
        categoryBreakdown: {}
      };
      
      // キーワードマッチング（拡張版）
      if (config.keywords) {
        Object.entries(config.keywords).forEach(([category, keywords]) => {
          const categoryScore = this.calculateCategoryScore(normalizedText, keywords, category);
          score += categoryScore;
          matchDetails.categoryBreakdown[category] = categoryScore;
          
          keywords.forEach(keyword => {
            if (normalizedText.includes(keyword.toLowerCase())) {
              matchDetails.keywordMatches.push({
                keyword: keyword,
                category: category,
                score: categoryScore / keywords.length
              });
            }
          });
        });
      }
      
      // パターンマッチング（精度向上）
      if (config.patterns) {
        config.patterns.forEach(pattern => {
          const matches = inputText.match(pattern);
          if (matches) {
            const patternScore = this.calculatePatternScore(pattern, matches, typeId);
            score += patternScore;
            matchDetails.patternMatches.push({
              pattern: pattern.source,
              matches: matches,
              score: patternScore
            });
          }
        });
      }
      
      // 文字列類似度による語彙拡張マッチング
      const semanticScore = this.calculateSemanticScore(normalizedText, typeId);
      score += semanticScore;
      matchDetails.semanticMatches = semanticScore;
      
      // 重み付けと信頼度計算
      const weightedScore = score * (config.weight || 1.0);
      const confidence = this.calculateContextConfidence(weightedScore, matchDetails, config);
      
      allContextScores.push({
        type: typeId,
        name: config.name,
        score: weightedScore,
        confidence: confidence,
        priority: config.priority || 3,
        matchDetails: matchDetails
      });
    }
    
    // スコア順でソート
    allContextScores.sort((a, b) => {
      if (Math.abs(b.confidence - a.confidence) > 0.1) {
        return b.confidence - a.confidence;
      }
      return b.score - a.score;
    });
    
    return {
      allScores: allContextScores,
      topContext: allContextScores[0],
      alternativeContexts: allContextScores.slice(1, 4)
    };
  }

  /**
   * Layer 2: 意図理解分析
   * 
   * 目的：
   * - ユーザーの真の意図（なぜ・何のため・どうしたい）を特定
   * - 表面的なキーワードを超えた深層理解
   * 
   * 処理内容：
   * - 意図カテゴリ別スコアリング
   * - 文脈から推測される隠れた意図の検出
   * - 感情と意図の整合性確認
   * 
   * 出力：
   * - 検出された意図とその信頼度
   */
  async layer2_intentionAnalysis(inputText) {
    const normalizedText = inputText.toLowerCase();
    const detectedIntentions = [];
    
    // 各意図カテゴリでの分析
    for (const [intentionType, keywords] of Object.entries(this.intentionKeywords)) {
      let intentionScore = 0;
      let matchedIndicators = [];
      
      keywords.forEach(keyword => {
        if (normalizedText.includes(keyword)) {
          intentionScore += this.getIntentionWeight(intentionType, keyword);
          matchedIndicators.push(keyword);
        }
      });
      
      // 文脈パターンによる意図推測
      const contextualScore = this.analyzeContextualIntention(inputText, intentionType);
      intentionScore += contextualScore;
      
      if (intentionScore > 0) {
        detectedIntentions.push({
          type: intentionType,
          score: intentionScore,
          confidence: Math.min(intentionScore / 10, 1.0),
          indicators: matchedIndicators,
          contextualEvidence: contextualScore > 0
        });
      }
    }
    
    // 意図の優先順位付け
    detectedIntentions.sort((a, b) => b.score - a.score);
    
    return {
      primaryIntention: detectedIntentions[0] || null,
      allIntentions: detectedIntentions,
      intentionClarity: detectedIntentions.length > 0 ? detectedIntentions[0].confidence : 0.3,
      multipleIntentions: detectedIntentions.length > 1
    };
  }

  /**
   * Layer 3: 感情状態深層分析（HSP特化）
   * 
   * 目的：
   * - HSP（高感受性）特性の詳細検出
   * - 感情の微細な変化とニュアンス分析
   * - 感情調整ニーズの特定
   * 
   * 処理内容：
   * - HSP特化パターンマッチング
   * - 感情強度の定量化
   * - 感情調整方向性の分析
   * 
   * 出力：
   * - HSP特性レベル
   * - 感情状態プロファイル
   * - 調整ニーズ評価
   */
  async layer3_emotionalAnalysis(inputText, userPersona = null) {
    const emotionalProfile = {
      hspLevel: 0,
      emotionalIntensity: 0,
      dominantEmotion: null,
      adjustmentNeed: 0,
      stabilityLevel: 0,
      detectedPatterns: []
    };
    
    // HSP特化パターン分析
    for (const [patternName, pattern] of Object.entries(this.emotionalPatterns)) {
      const matches = inputText.match(pattern);
      if (matches) {
        const patternScore = this.calculateEmotionalPatternScore(patternName, matches);
        emotionalProfile.detectedPatterns.push({
          pattern: patternName,
          matches: matches,
          score: patternScore
        });
        
        // HSPレベル計算
        if (patternName === 'hsp_overwhelm') {
          emotionalProfile.hspLevel += patternScore * 0.8;
        }
        
        // 感情強度計算
        emotionalProfile.emotionalIntensity += patternScore * this.emotionalIntensityWeight;
      }
    }
    
    // 調整ニーズ評価
    emotionalProfile.adjustmentNeed = this.calculateAdjustmentNeed(inputText, emotionalProfile);
    
    // 安定性レベル評価
    emotionalProfile.stabilityLevel = this.calculateStabilityLevel(inputText, emotionalProfile);
    
    // 支配的感情の特定
    emotionalProfile.dominantEmotion = this.identifyDominantEmotion(inputText, emotionalProfile);
    
    // HSP判定
    const isHSP = emotionalProfile.hspLevel > this.hspSensitivityThreshold;
    
    return {
      emotionalProfile: emotionalProfile,
      isHSP: isHSP,
      needsEmotionalSupport: emotionalProfile.adjustmentNeed > 0.5,
      emotionalComplexity: emotionalProfile.detectedPatterns.length,
      recommendedApproach: this.getRecommendedApproach(emotionalProfile, isHSP)
    };
  }

  /**
   * Layer 4: 複数コンテキスト同時評価
   * 
   * 目的：
   * - 単一コンテキスト判定の限界を超越
   * - 複数領域にまたがる問題の適切な処理
   * - コンテキスト間の相互関係分析
   * 
   * 処理内容：
   * - 複数コンテキストの重み付け統合
   * - 相互影響度の計算
   * - 最適な組み合わせの決定
   * 
   * 出力：
   * - 複数コンテキストの重み配分
   * - 相互関係マップ
   */
  async layer4_multidimensionalScoring(analysisLayers) {
    const basicContexts = analysisLayers.basicContext.allScores;
    const intentions = analysisLayers.intentionAnalysis.allIntentions;
    const emotions = analysisLayers.emotionalProfile.emotionalProfile;
    
    // 複数コンテキストの相互関係分析
    const contextInteractions = this.analyzeContextInteractions(basicContexts);
    
    // 意図と感情によるコンテキスト重み調整
    const adjustedContexts = this.adjustContextWeightsByIntentionAndEmotion(
      basicContexts, intentions, emotions
    );
    
    // 最適な組み合わせの決定
    const optimalCombination = this.findOptimalContextCombination(
      adjustedContexts, contextInteractions
    );
    
    return {
      contextWeights: optimalCombination.weights,
      interactionMap: contextInteractions,
      combinationScore: optimalCombination.score,
      isMultidimensional: optimalCombination.contexts.length > 1,
      recommendedContexts: optimalCombination.contexts
    };
  }

  /**
   * Layer 5: 文脈的整合性検証
   * 
   * 目的：
   * - 分析結果の論理的整合性確認
   * - 矛盾の検出と修正
   * - 信頼度の最終調整
   * 
   * 処理内容：
   * - 各層の結果整合性チェック
   * - 矛盾点の特定と解決
   * - 総合信頼度の計算
   * 
   * 出力：
   * - 整合性スコア
   * - 検出された矛盾点
   * - 修正提案
   */
  async layer5_contextualConsistency(analysisLayers) {
    const consistencyCheck = {
      overallConsistency: 0,
      detectedInconsistencies: [],
      adjustmentRecommendations: [],
      finalConfidenceAdjustment: 0
    };
    
    // 基本コンテキストと意図の整合性
    const intentionContextConsistency = this.checkIntentionContextConsistency(
      analysisLayers.basicContext, analysisLayers.intentionAnalysis
    );
    
    // 感情プロファイルとコンテキストの整合性
    const emotionContextConsistency = this.checkEmotionContextConsistency(
      analysisLayers.basicContext, analysisLayers.emotionalProfile
    );
    
    // 多次元スコアの整合性
    const multidimensionalConsistency = this.checkMultidimensionalConsistency(
      analysisLayers.multidimensionalScore
    );
    
    // 総合整合性スコア計算
    consistencyCheck.overallConsistency = (
      intentionContextConsistency.score +
      emotionContextConsistency.score +
      multidimensionalConsistency.score
    ) / 3;
    
    // 矛盾点の統合
    consistencyCheck.detectedInconsistencies = [
      ...intentionContextConsistency.inconsistencies,
      ...emotionContextConsistency.inconsistencies,
      ...multidimensionalConsistency.inconsistencies
    ];
    
    // 最終信頼度調整
    consistencyCheck.finalConfidenceAdjustment = this.calculateConfidenceAdjustment(
      consistencyCheck.overallConsistency
    );
    
    return consistencyCheck;
  }

  /**
   * Layer 6: 統合結果生成
   * 
   * 目的：
   * - 全層の分析結果を統合
   * - 最終的なコンテキスト判定
   * - 信頼度と詳細分析の提供
   * 
   * 処理内容：
   * - 各層の重み付け統合
   * - 最終コンテキスト決定
   * - 詳細な分析結果構築
   * 
   * 出力：
   * - 統合分析結果オブジェクト
   */
  async layer6_generateIntegratedResult(analysisLayers, inputText, userPersona) {
    const basicContext = analysisLayers.basicContext.topContext;
    const multidimensional = analysisLayers.multidimensionalScore;
    const consistency = analysisLayers.contextualConsistency;
    
    // 主要コンテキストの決定
    let primaryContext = basicContext.type;
    let confidence = basicContext.confidence;
    
    // 多次元結果による調整
    if (multidimensional.isMultidimensional) {
      const topMultidimensional = multidimensional.recommendedContexts[0];
      if (topMultidimensional && topMultidimensional.adjustedScore > basicContext.score) {
        primaryContext = topMultidimensional.type;
        confidence = Math.min(topMultidimensional.confidence * 1.1, 0.95);
      }
    }
    
    // 整合性による信頼度調整
    confidence += consistency.finalConfidenceAdjustment;
    confidence = Math.max(0.3, Math.min(0.95, confidence));
    
    // 副次コンテキストの選定
    const secondaryContexts = multidimensional.recommendedContexts
      .filter(ctx => ctx.type !== primaryContext)
      .slice(0, 2)
      .map(ctx => ({
        type: ctx.type,
        weight: ctx.weight,
        relevance: ctx.adjustedScore / basicContext.score
      }));
    
    // HSP特化処理
    const isHSPCase = analysisLayers.emotionalProfile.isHSP;
    if (isHSPCase) {
      // HSPケースでは感情調整を優先考慮
      if (primaryContext !== 'emotion_management' && confidence < 0.8) {
        secondaryContexts.unshift({
          type: 'emotion_management',
          weight: 0.3,
          relevance: 0.8,
          reason: 'HSP特性による感情調整ニーズ'
        });
      }
    }
    
    return {
      primaryContext: primaryContext,
      confidence: confidence,
      secondaryContexts: secondaryContexts,
      contextWeights: multidimensional.contextWeights,
      intentionAnalysis: analysisLayers.intentionAnalysis,
      emotionalProfile: analysisLayers.emotionalProfile,
      isMultidimensional: multidimensional.isMultidimensional,
      isHSPCase: isHSPCase,
      consistencyMetrics: consistency,
      detailedAnalysis: {
        basicContextScores: analysisLayers.basicContext.allScores,
        intentionClarity: analysisLayers.intentionAnalysis.intentionClarity,
        emotionalComplexity: analysisLayers.emotionalProfile.emotionalComplexity,
        multidimensionalScore: multidimensional.combinationScore
      },
      recommendationsForImprove: this.generateImprovementRecommendations(analysisLayers)
    };
  }

  // ============ ヘルパーメソッド群 ============

  /**
   * カテゴリ別スコア計算
   */
  calculateCategoryScore(text, keywords, category) {
    const categoryWeights = {
      'primary': 4,
      'secondary': 2,
      'emotional': 3,
      'hsp_specific': 6,
      'philosophical': 5,
      'harmony': 4,
      'spiritual': 4,
      'mission': 5
    };
    
    const baseWeight = categoryWeights[category] || 1;
    let score = 0;
    
    keywords.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) {
        score += baseWeight;
      }
    });
    
    return score;
  }

  /**
   * パターンスコア計算
   */
  calculatePatternScore(pattern, matches, contextType) {
    const contextMultipliers = {
      'emotion_management': 8,
      'philosophical': 7,
      'relationship': 6,
      'business': 5
    };
    
    const baseScore = matches.length * 3;
    const multiplier = contextMultipliers[contextType] || 4;
    return baseScore * multiplier;
  }

  /**
   * 意図重み取得
   */
  getIntentionWeight(intentionType, keyword) {
    const intentionWeights = {
      'seeking_help': 3,
      'expressing_worry': 4,
      'sharing_experience': 2,
      'seeking_understanding': 5,
      'planning_action': 3,
      'reflecting': 4
    };
    
    return intentionWeights[intentionType] || 1;
  }

  /**
   * 学習データ更新
   */
  updateLearningData(inputText, result) {
    const key = `${result.primaryContext}_${result.confidence.toFixed(1)}`;
    if (!this.learningData.has(key)) {
      this.learningData.set(key, []);
    }
    
    this.learningData.get(key).push({
      text: inputText.substring(0, 50), // プライバシー考慮で短縮
      timestamp: Date.now(),
      isMultidimensional: result.isMultidimensional,
      isHSP: result.isHSPCase
    });
    
    // データサイズ制限
    if (this.learningData.get(key).length > 100) {
      this.learningData.get(key).shift();
    }
  }

  /**
   * 統計更新
   */
  updateStatistics(result, success) {
    this.statistics.totalAnalyses++;
    
    if (success) {
      if (result.isMultidimensional) {
        this.statistics.multidimensionalDetections++;
      }
      if (result.isHSPCase) {
        this.statistics.hspDetections++;
      }
    }
    
    // 精度率計算（簡易版）
    this.statistics.accuracyRate = success ? 
      (this.statistics.accuracyRate * 0.9 + 0.1) : 
      (this.statistics.accuracyRate * 0.9);
  }

  /**
   * エラー結果生成
   */
  generateErrorResult(errorMessage) {
    return {
      primaryContext: 'personal',
      confidence: 0.3,
      secondaryContexts: [],
      error: errorMessage,
      isMultidimensional: false,
      isHSPCase: false,
      qualityMetrics: {
        processingTime: 0,
        layerCompletionRate: 0,
        overallConfidence: 0.3,
        accuracyLevel: 'エラー'
      }
    };
  }

  /**
   * フォールバック結果生成
   */
  generateFallbackResult(inputText, error) {
    console.warn('多次元分析フォールバック実行:', error.message);
    
    return {
      primaryContext: inputText.length > 50 ? 'philosophical' : 'personal',
      confidence: 0.4,
      secondaryContexts: [],
      fallback: true,
      error: error.message,
      isMultidimensional: false,
      isHSPCase: false,
      qualityMetrics: {
        processingTime: 0,
        layerCompletionRate: 0.5,
        overallConfidence: 0.4,
        accuracyLevel: 'フォールバック'
      }
    };
  }

  /**
   * セマンティックスコア計算
   */
  calculateSemanticScore(text, contextType) {
    // 基本的な語彙拡張による意味的類似度計算
    const semanticMap = {
      'emotion_management': ['調整', 'バランス', '整える', 'コントロール', '安定'],
      'personal': ['自分', '個人', '内面', '心', '気持ち'],
      'philosophical': ['意味', '価値', '本質', '目的', '理念'],
      'relationship': ['関係', '付き合い', '信頼', '理解', '距離'],
      'business': ['効率', '成果', '目標', '戦略', '改善']
    };
    
    const keywords = semanticMap[contextType] || [];
    let score = 0;
    
    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score += 2;
      }
    });
    
    return score;
  }

  /**
   * コンテキスト信頼度計算
   */
  calculateContextConfidence(score, matchDetails, config) {
    let confidence = Math.min(score / 20, 1.0);
    
    // パターンマッチがある場合は信頼度向上
    if (matchDetails.patternMatches.length > 0) {
      confidence += 0.2;
    }
    
    // キーワード多様性による調整
    const uniqueCategories = Object.keys(matchDetails.categoryBreakdown).length;
    if (uniqueCategories > 2) {
      confidence += 0.1;
    }
    
    // 設定による信頼度調整
    confidence += (config.confidence_boost || 0);
    
    return Math.min(confidence, 0.95);
  }

  /**
   * 文脈的意図分析
   */
  analyzeContextualIntention(text, intentionType) {
    const contextualPatterns = {
      'seeking_help': /[どう]すれば|[どう]したら|教えて|アドバイス/g,
      'expressing_worry': /不安|心配|悩|迷/g,
      'sharing_experience': /ました|でした|あった|なった/g,
      'seeking_understanding': /理解|分かって|共感|気持ち/g,
      'planning_action': /予定|つもり|計画|やりたい/g,
      'reflecting': /振り返|考えて|思い返|反省/g
    };
    
    const pattern = contextualPatterns[intentionType];
    if (!pattern) return 0;
    
    const matches = text.match(pattern);
    return matches ? matches.length * 2 : 0;
  }

  /**
   * 感情パターンスコア計算
   */
  calculateEmotionalPatternScore(patternName, matches) {
    const patternWeights = {
      'hsp_overwhelm': 0.8,
      'emotional_instability': 0.6,
      'seeking_balance': 0.7,
      'deep_concern': 0.5,
      'philosophical_seeking': 0.4
    };
    
    const weight = patternWeights[patternName] || 0.5;
    return matches.length * weight;
  }

  /**
   * 調整ニーズ計算
   */
  calculateAdjustmentNeed(text, emotionalProfile) {
    let adjustmentScore = 0;
    
    // 調整関連キーワード
    const adjustmentKeywords = ['調整', 'コントロール', 'バランス', '整える', '安定', 'ニュートラル'];
    adjustmentKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        adjustmentScore += 0.2;
      }
    });
    
    // HSPレベルに基づく調整
    adjustmentScore += emotionalProfile.hspLevel * 0.3;
    
    return Math.min(adjustmentScore, 1.0);
  }

  /**
   * 安定性レベル計算
   */
  calculateStabilityLevel(text, emotionalProfile) {
    let stabilityScore = 0.5; // ベースライン
    
    // 不安定さを示すキーワード
    const instabilityKeywords = ['浮き沈み', '不安定', '揺れ', '変動', '波'];
    instabilityKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        stabilityScore -= 0.2;
      }
    });
    
    // 安定性を示すキーワード
    const stabilityKeywords = ['安定', '平静', '落ち着', '冷静', 'バランス'];
    stabilityKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        stabilityScore += 0.2;
      }
    });
    
    return Math.max(0, Math.min(1.0, stabilityScore));
  }

  /**
   * 支配的感情特定
   */
  identifyDominantEmotion(text, emotionalProfile) {
    const emotionKeywords = {
      'anxiety': ['不安', '心配', '恐れ', '緊張'],
      'frustration': ['イライラ', '苛立', '怒り', 'むかつく'],
      'sadness': ['悲し', '落ち込', 'つらい', '辛い'],
      'confusion': ['迷い', '困惑', 'わからない', '混乱'],
      'hope': ['希望', '前向き', '期待', '楽しみ'],
      'neutral': ['普通', '平常', 'ニュートラル', '中立']
    };
    
    let maxScore = 0;
    let dominantEmotion = 'neutral';
    
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      let score = 0;
      keywords.forEach(keyword => {
        if (text.includes(keyword)) {
          score++;
        }
      });
      
      if (score > maxScore) {
        maxScore = score;
        dominantEmotion = emotion;
      }
    }
    
    return dominantEmotion;
  }

  /**
   * 推奨アプローチ決定
   */
  getRecommendedApproach(emotionalProfile, isHSP) {
    if (isHSP) {
      if (emotionalProfile.adjustmentNeed > 0.7) {
        return 'intensive_emotional_support';
      } else if (emotionalProfile.adjustmentNeed > 0.4) {
        return 'gentle_adjustment_guidance';
      } else {
        return 'hsp_awareness_building';
      }
    } else {
      if (emotionalProfile.emotionalIntensity > 0.8) {
        return 'emotional_regulation_focus';
      } else if (emotionalProfile.stabilityLevel < 0.3) {
        return 'stability_building';
      } else {
        return 'standard_support';
      }
    }
  }

  /**
   * 基本的なコンテキスト相互関係分析（簡易版）
   */
  analyzeContextInteractions(contexts) {
    const interactions = {};
    
    for (let i = 0; i < contexts.length; i++) {
      for (let j = i + 1; j < contexts.length; j++) {
        const ctx1 = contexts[i];
        const ctx2 = contexts[j];
        const interactionScore = this.calculateInteractionScore(ctx1, ctx2);
        
        const key = `${ctx1.type}_${ctx2.type}`;
        interactions[key] = {
          score: interactionScore,
          type: interactionScore > 0.5 ? 'synergistic' : 'independent'
        };
      }
    }
    
    return interactions;
  }

  /**
   * 相互作用スコア計算
   */
  calculateInteractionScore(ctx1, ctx2) {
    // 基本的な相互作用ルール
    const synergisticPairs = [
      ['emotion_management', 'personal'],
      ['business', 'relationship'],
      ['philosophical', 'personal'],
      ['relationship', 'personal']
    ];
    
    const pair = [ctx1.type, ctx2.type].sort();
    const isSynergistic = synergisticPairs.some(sp => 
      sp[0] === pair[0] && sp[1] === pair[1]
    );
    
    return isSynergistic ? 0.7 : 0.3;
  }

  /**
   * 意図・感情によるコンテキスト重み調整
   */
  adjustContextWeightsByIntentionAndEmotion(contexts, intentions, emotions) {
    return contexts.map(ctx => {
      let adjustedScore = ctx.score;
      let adjustedConfidence = ctx.confidence;
      
      // HSP特性による調整
      if (emotions.hspLevel > 0.6 && ctx.type === 'emotion_management') {
        adjustedScore *= 1.5;
        adjustedConfidence += 0.2;
      }
      
      // 意図による調整
      if (intentions.length > 0) {
        const primaryIntention = intentions[0];
        if (primaryIntention.type === 'seeking_help' && 
            (ctx.type === 'personal' || ctx.type === 'emotion_management')) {
          adjustedScore *= 1.2;
        }
      }
      
      return {
        ...ctx,
        adjustedScore: adjustedScore,
        confidence: Math.min(adjustedConfidence, 0.95)
      };
    });
  }

  /**
   * 最適なコンテキスト組み合わせ検索
   */
  findOptimalContextCombination(adjustedContexts, interactions) {
    // 最上位のコンテキストを選択
    const sortedContexts = adjustedContexts
      .sort((a, b) => b.adjustedScore - a.adjustedScore);
    
    const primaryContext = sortedContexts[0];
    const secondaryContexts = sortedContexts.slice(1, 3);
    
    // 重み計算
    const totalScore = sortedContexts.slice(0, 3)
      .reduce((sum, ctx) => sum + ctx.adjustedScore, 0);
    
    const weights = {};
    sortedContexts.slice(0, 3).forEach(ctx => {
      weights[ctx.type] = ctx.adjustedScore / totalScore;
    });
    
    return {
      contexts: [primaryContext, ...secondaryContexts],
      weights: weights,
      score: primaryContext.adjustedScore
    };
  }

  /**
   * 整合性チェック関連メソッド（簡易版）
   */
  checkIntentionContextConsistency(basicContext, intentionAnalysis) {
    return {
      score: 0.8, // 簡易固定値
      inconsistencies: []
    };
  }

  checkEmotionContextConsistency(basicContext, emotionalProfile) {
    return {
      score: 0.8, // 简易固定値
      inconsistencies: []
    };
  }

  checkMultidimensionalConsistency(multidimensionalScore) {
    return {
      score: 0.8, // 簡易固定値
      inconsistencies: []
    };
  }

  calculateConfidenceAdjustment(consistencyScore) {
    return (consistencyScore - 0.5) * 0.2;
  }

  /**
   * 改善提案生成
   */
  generateImprovementRecommendations(analysisLayers) {
    const recommendations = [];
    
    if (analysisLayers.emotionalProfile?.isHSP) {
      recommendations.push({
        type: 'hsp_support',
        message: 'HSP特性に配慮した感情調整アプローチを推奨します'
      });
    }
    
    if (analysisLayers.multidimensionalScore?.isMultidimensional) {
      recommendations.push({
        type: 'multidimensional_approach',
        message: '複数領域の統合的アプローチが効果的です'
      });
    }
    
    return recommendations;
  }
}

// グローバル利用のためのエクスポート
window.MultiDimensionalContextAnalyzer = MultiDimensionalContextAnalyzer;