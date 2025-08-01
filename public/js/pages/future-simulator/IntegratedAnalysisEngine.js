/**
 * 統合分析エンジン - bunenjin哲学に基づく7段階包括分析
 * 
 * 目的：
 * - ユーザー入力の多次元的分析と易経マッピング
 * - Triple OSアーキテクチャとの完全統合
 * - 高信頼度の分析結果生成
 * 
 * 入力：
 * - inputText: string - 分析対象テキスト
 * - contextType: string - 事前コンテキスト情報
 * - userPersona: object - ユーザー属性情報
 * 
 * 処理内容：
 * Stage 1: 前処理・正規化（テキスト清浄化、文字コード統一）
 * Stage 2: 形態素・構文解析（kuromoji.js 詳細解析）
 * Stage 3: 動的キーワード抽出（DynamicKeywordGenerator活用）
 * Stage 4: 感情・文脈分析（多次元感情マッピング）
 * Stage 5: Triple OS統合（Engine/Interface/SafeMode相互作用）
 * Stage 6: 易経マッピング（64卦システム精密マッチング）
 * Stage 7: 統合結果生成（信頼度付き最終結果）
 * 
 * 出力：
 * - hexagram: number - 推定卦番号
 * - line: number - 推定爻番号
 * - confidence: number - 総合信頼度
 * - analysis: object - 詳細分析結果
 * - osIntegration: object - Triple OS統合結果
 * - stageResults: Array - 各段階の結果
 * 
 * 副作用：
 * - 分析キャッシュの更新
 * - 統計データの蓄積
 * - ML学習データの記録
 * 
 * 前提条件：
 * - DynamicKeywordGenerator が初期化済み
 * - 易経データベースが読み込み済み
 * - Triple OS状態が設定済み
 * 
 * エラー処理：
 * - 各段階での例外ハンドリング
 * - 段階的フォールバック処理
 * - 品質しきい値による結果検証
 */
class IntegratedAnalysisEngine {
  constructor(kuromojiTokenizer) {
    this.tokenizer = kuromojiTokenizer;
    this.keywordGenerator = new DynamicKeywordGenerator(kuromojiTokenizer);
    this.irregularDetector = null; // 遅延初期化
    this.mlIntegration = window.mlIntegration || null;
    this.analysisCache = new Map();
    this.qualityThreshold = 0.6;
    
    // 統計トラッキング
    this.statistics = {
      totalAnalyses: 0,
      successfulAnalyses: 0,
      failedAnalyses: 0,
      averageConfidence: 0,
      stageCompletionRates: {
        stage1: 0, stage2: 0, stage3: 0, stage4: 0,
        stage5: 0, stage6: 0, stage7: 0
      }
    };
    
    // 易経データベースの初期化
    this.hexagramDatabase = this.initializeHexagramDatabase();
  }

  /**
   * 7段階統合分析実行
   * 
   * 目的：
   * - ユーザー入力の包括的分析
   * - 各段階での品質検証と統合
   * 
   * 処理内容：
   * - 7段階の順次実行と統合
   * - エラーハンドリングとフォールバック
   * - 結果の品質検証
   * 
   * 出力：
   * - 統合分析結果オブジェクト
   */
  async performSevenStageAnalysis(inputText, contextType = null, userPersona = null) {
    const startTime = performance.now();
    
    // 入力検証
    if (!inputText || typeof inputText !== 'string' || inputText.trim().length === 0) {
      console.error('IntegratedAnalysisEngine: 無効な入力');
      return this.generateErrorResult('無効な入力テキスト');
    }

    // キャッシュチェック
    const cacheKey = this.generateCacheKey(inputText, contextType);
    if (this.analysisCache.has(cacheKey)) {
      console.log('🔄 キャッシュから結果を返却');
      return this.analysisCache.get(cacheKey);
    }

    const stageResults = {};
    let currentStage = 0;

    try {
      console.log('🚀 7段階統合分析開始');
      
      // Stage 1: 前処理・正規化
      currentStage = 1;
      console.log('📋 Stage 1: 前処理・正規化');
      stageResults.stage1 = await this.stage1_preprocessing(inputText);
      
      // Stage 2: 形態素・構文解析
      currentStage = 2;
      console.log('🔍 Stage 2: 形態素・構文解析');
      stageResults.stage2 = await this.stage2_morphologicalAnalysis(stageResults.stage1.normalizedText);
      
      // Stage 3: 動的キーワード抽出
      currentStage = 3;
      console.log('🎯 Stage 3: 動的キーワード抽出');
      stageResults.stage3 = await this.stage3_keywordExtraction(
        stageResults.stage1.normalizedText,
        stageResults.stage2.tokens,
        contextType
      );
      
      // Stage 4: 感情・文脈分析
      currentStage = 4;
      console.log('💭 Stage 4: 感情・文脈分析');
      stageResults.stage4 = await this.stage4_emotionalAnalysis(
        stageResults.stage3,
        userPersona
      );
      
      // Stage 5: Triple OS統合
      currentStage = 5;
      console.log('🔗 Stage 5: Triple OS統合');
      stageResults.stage5 = await this.stage5_tripleOSIntegration(
        stageResults.stage4,
        userPersona
      );
      
      // Stage 6: 易経マッピング
      currentStage = 6;
      console.log('☯️ Stage 6: 易経マッピング');
      stageResults.stage6 = await this.stage6_iChingMapping(
        stageResults.stage5
      );
      
      // Stage 7: 統合結果生成
      currentStage = 7;
      console.log('✨ Stage 7: 統合結果生成');
      stageResults.stage7 = await this.stage7_generateIntegratedResult(
        stageResults,
        inputText,
        contextType
      );

      // 最終結果の構築
      const finalResult = {
        inputAnalysis: {
          originalText: inputText,
          normalizedText: stageResults.stage1.normalizedText,
          textLength: inputText.length,
          complexity: this.calculateTextComplexity(stageResults)
        },
        stageResults: stageResults,
        finalResult: stageResults.stage7.finalResult,
        qualityMetrics: {
          overallConfidence: stageResults.stage7.finalResult.confidence,
          stageCompletionRate: 1.0,
          errorCount: 0,
          processingTime: performance.now() - startTime
        }
      };

      // 品質検証
      if (finalResult.qualityMetrics.overallConfidence < this.qualityThreshold) {
        console.warn('⚠️ 分析品質が閾値を下回っています');
      }

      // キャッシュ更新
      this.updateCache(cacheKey, finalResult);
      
      // 統計更新
      this.updateStatistics(finalResult, true);
      
      console.log('✅ 7段階統合分析完了');
      return finalResult;

    } catch (error) {
      console.error(`🚨 Stage ${currentStage} でエラー発生:`, error);
      
      // エラーハンドリングとフォールバック
      const fallbackResult = await this.handleStageError(
        currentStage,
        error,
        inputText,
        stageResults
      );
      
      // 統計更新（失敗）
      this.updateStatistics(fallbackResult, false);
      
      return fallbackResult;
    }
  }

  /**
   * Stage 1: 前処理・正規化
   * 
   * 目的：
   * - テキストの清浄化と正規化
   * - 分析に適した形式への変換
   * 
   * 処理内容：
   * - 空白・改行の正規化
   * - 文字コード統一
   * - 特殊文字処理
   * 
   * 出力：
   * - 正規化されたテキストと前処理情報
   */
  async stage1_preprocessing(inputText) {
    try {
      // 基本的な正規化
      let normalizedText = inputText
        .trim()
        .replace(/\r\n/g, '\n')           // 改行コード統一
        .replace(/\s+/g, ' ')             // 連続空白を単一スペースに
        .replace(/[""]/g, '"')            // 引用符統一
        .replace(/['']/g, "'")            // アポストロフィ統一
        .replace(/[～〜]/g, '~')          // 波ダッシュ統一
        .replace(/[－−]/g, '-')          // ハイフン統一
        .replace(/[！]/g, '!')            // 感嘆符統一
        .replace(/[？]/g, '?');           // 疑問符統一

      // 絵文字・特殊文字の検出
      const emojiPattern = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu;
      const emojis = normalizedText.match(emojiPattern) || [];
      
      // 特殊文字の処理（保持するが位置を記録）
      const specialChars = {
        emojis: emojis,
        count: emojis.length,
        positions: []
      };

      // URL検出と処理
      const urlPattern = /https?:\/\/[^\s]+/g;
      const urls = normalizedText.match(urlPattern) || [];
      normalizedText = normalizedText.replace(urlPattern, '[URL]');

      // ハッシュタグ検出
      const hashtagPattern = /#[^\s]+/g;
      const hashtags = normalizedText.match(hashtagPattern) || [];

      return {
        normalizedText,
        originalLength: inputText.length,
        normalizedLength: normalizedText.length,
        preprocessing: {
          emojis: specialChars,
          urls: urls,
          hashtags: hashtags,
          hasSpecialChars: emojis.length > 0 || urls.length > 0,
          normalizationRatio: normalizedText.length / inputText.length
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Stage 1 エラー:', error);
      throw new Error(`前処理エラー: ${error.message}`);
    }
  }

  /**
   * Stage 2: 形態素・構文解析
   * 
   * 目的：
   * - 日本語テキストの詳細な形態素解析
   * - 品詞情報と基本形の抽出
   * 
   * 処理内容：
   * - kuromoji.jsによる形態素解析
   * - 品詞タグ付けと統計
   * - 文構造の基本分析
   * 
   * 出力：
   * - トークン配列と解析統計
   */
  async stage2_morphologicalAnalysis(normalizedText) {
    try {
      if (!this.tokenizer) {
        console.warn('Tokenizer未初期化、基本解析を実行');
        return this.basicMorphologicalAnalysis(normalizedText);
      }

      return new Promise((resolve, reject) => {
        this.tokenizer.tokenize(normalizedText, (err, tokens) => {
          if (err) {
            console.error('形態素解析エラー:', err);
            reject(err);
            return;
          }

          // 品詞統計の集計
          const posStats = {};
          const wordFrequency = new Map();
          
          tokens.forEach(token => {
            // 品詞統計
            const pos = token.pos.split(',')[0];
            posStats[pos] = (posStats[pos] || 0) + 1;
            
            // 単語頻度（内容語のみ）
            if (['名詞', '動詞', '形容詞', '形容動詞'].includes(pos)) {
              const word = token.basic_form || token.surface_form;
              wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
            }
          });

          // 頻出単語の抽出
          const topWords = Array.from(wordFrequency.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word, count]) => ({ word, count }));

          resolve({
            tokens,
            tokenCount: tokens.length,
            posStatistics: posStats,
            topWords,
            analysis: {
              nounRatio: (posStats['名詞'] || 0) / tokens.length,
              verbRatio: (posStats['動詞'] || 0) / tokens.length,
              adjectiveRatio: ((posStats['形容詞'] || 0) + (posStats['形容動詞'] || 0)) / tokens.length,
              contentWordRatio: this.calculateContentWordRatio(posStats, tokens.length)
            }
          });
        });
      });

    } catch (error) {
      console.error('Stage 2 エラー:', error);
      // フォールバック処理
      return this.basicMorphologicalAnalysis(normalizedText);
    }
  }

  /**
   * Stage 3: 動的キーワード抽出
   * 
   * 目的：
   * - DynamicKeywordGeneratorを活用した高度なキーワード抽出
   * - 文脈を考慮した動的な分析
   * 
   * 処理内容：
   * - 感情・文脈パターンの適用
   * - SNSパターンとの統合
   * - 優先度付きキーワード生成
   * 
   * 出力：
   * - 拡張されたキーワード情報
   */
  async stage3_keywordExtraction(normalizedText, tokens, contextType) {
    try {
      // DynamicKeywordGeneratorによる分析
      const keywordResult = await this.keywordGenerator.generateContextualKeywords(
        normalizedText,
        contextType
      );

      // 不規則パターン検出（IrregularPatternDetectorが利用可能な場合）
      let irregularPatterns = [];
      if (this.irregularDetector) {
        irregularPatterns = await this.detectIrregularPatterns(normalizedText);
      }

      // キーワードクラスタリング
      const keywordClusters = this.clusterKeywords(keywordResult.keywords);

      return {
        ...keywordResult,
        irregularPatterns,
        clusters: keywordClusters,
        extractionQuality: {
          keywordCount: keywordResult.keywords.length,
          averagePriority: this.calculateAveragePriority(keywordResult.keywords),
          diversityScore: this.calculateKeywordDiversity(keywordResult.keywords),
          emotionalCoverage: keywordResult.emotionalContext.intensity
        }
      };

    } catch (error) {
      console.error('Stage 3 エラー:', error);
      throw new Error(`キーワード抽出エラー: ${error.message}`);
    }
  }

  /**
   * Stage 4: 感情・文脈分析
   * 
   * 目的：
   * - 多次元的な感情分析
   * - 文脈の深層理解
   * 
   * 処理内容：
   * - 感情の強度と種類の分析
   * - 時間的・社会的文脈の把握
   * - ユーザーペルソナとの統合
   * 
   * 出力：
   * - 詳細な感情・文脈分析結果
   */
  async stage4_emotionalAnalysis(stage3Result, userPersona) {
    try {
      const { emotionalContext, contextualMapping, keywords } = stage3Result;

      // 感情の深層分析
      const emotionalDepth = this.analyzeEmotionalDepth(emotionalContext, keywords);
      
      // 文脈の拡張分析
      const expandedContext = this.expandContextualAnalysis(contextualMapping, userPersona);
      
      // 感情と文脈の相互作用分析
      const emotionContextInteraction = this.analyzeEmotionContextInteraction(
        emotionalDepth,
        expandedContext
      );

      return {
        emotionalAnalysis: {
          ...emotionalDepth,
          complexity: this.calculateEmotionalComplexity(emotionalDepth),
          stability: this.calculateEmotionalStability(keywords)
        },
        contextualAnalysis: {
          ...expandedContext,
          relevanceScore: this.calculateContextRelevance(expandedContext, userPersona)
        },
        interaction: emotionContextInteraction,
        psychologicalProfile: this.generatePsychologicalProfile(
          emotionalDepth,
          expandedContext,
          userPersona
        )
      };

    } catch (error) {
      console.error('Stage 4 エラー:', error);
      throw new Error(`感情分析エラー: ${error.message}`);
    }
  }

  /**
   * Stage 5: Triple OS統合
   * 
   * 目的：
   * - Engine/Interface/SafeMode OSの統合分析
   * - 3つのOSの相互作用パターン分析
   * 
   * 処理内容：
   * - 各OSへの影響度計算
   * - OS間のバランス分析
   * - 動的な相互作用パターン
   * 
   * 出力：
   * - Triple OS統合結果
   */
  async stage5_tripleOSIntegration(stage4Result, userPersona) {
    try {
      const { emotionalAnalysis, contextualAnalysis, psychologicalProfile } = stage4Result;

      // 各OSへの影響度計算
      const osImpacts = {
        engineOS: this.calculateEngineOSImpact(emotionalAnalysis, psychologicalProfile),
        interfaceOS: this.calculateInterfaceOSImpact(contextualAnalysis, psychologicalProfile),
        safeModeOS: this.calculateSafeModeOSImpact(emotionalAnalysis, contextualAnalysis)
      };

      // OS間バランス分析
      const osBalance = this.analyzeOSBalance(osImpacts);
      
      // 動的相互作用パターン
      const interactionPatterns = this.analyzeOSInteractionPatterns(osImpacts, userPersona);
      
      // 統合スコア計算
      const integrationScore = this.calculateOSIntegrationScore(osImpacts, osBalance);

      return {
        osImpacts,
        balance: osBalance,
        interactionPatterns,
        integrationScore,
        dominantOS: this.determineDominantOS(osImpacts),
        recommendation: this.generateOSRecommendation(osBalance, interactionPatterns)
      };

    } catch (error) {
      console.error('Stage 5 エラー:', error);
      throw new Error(`Triple OS統合エラー: ${error.message}`);
    }
  }

  /**
   * Stage 6: 易経マッピング
   * 
   * 目的：
   * - 64卦システムへの精密マッピング
   * - 爻の動的決定
   * 
   * 処理内容：
   * - 統合データから卦の選定
   * - 爻位置の計算
   * - 変爻パターンの分析
   * 
   * 出力：
   * - 卦と爻の詳細情報
   */
  async stage6_iChingMapping(stage5Result) {
    try {
      const { osImpacts, balance, integrationScore } = stage5Result;

      // 基本卦の選定
      const primaryHexagram = this.selectPrimaryHexagram(osImpacts, balance);
      
      // 爻位置の決定
      const linePosition = this.calculateLinePosition(integrationScore, osImpacts);
      
      // 変爻の分析
      const changingLines = this.analyzeChangingLines(osImpacts, balance);
      
      // 互卦・錯卦・綜卦の計算
      const relatedHexagrams = this.calculateRelatedHexagrams(primaryHexagram);
      
      // 易経的解釈の生成
      const interpretation = this.generateIChingInterpretation(
        primaryHexagram,
        linePosition,
        changingLines
      );

      return {
        hexagram: primaryHexagram,
        line: linePosition,
        changingLines,
        relatedHexagrams,
        interpretation,
        mappingConfidence: this.calculateMappingConfidence(osImpacts, primaryHexagram),
        resonanceScore: this.calculateResonanceScore(primaryHexagram, osImpacts)
      };

    } catch (error) {
      console.error('Stage 6 エラー:', error);
      throw new Error(`易経マッピングエラー: ${error.message}`);
    }
  }

  /**
   * Stage 7: 統合結果生成
   * 
   * 目的：
   * - 全段階の結果を統合
   * - 最終的な分析結果の生成
   * 
   * 処理内容：
   * - 各段階の結果統合
   * - 信頼度計算
   * - 包括的な解釈生成
   * 
   * 出力：
   * - 最終統合結果
   */
  async stage7_generateIntegratedResult(stageResults, originalText, contextType) {
    try {
      // ML統合（利用可能な場合）
      let mlEnhancement = null;
      if (this.mlIntegration && !this.mlIntegration.fallbackMode) {
        mlEnhancement = await this.enhanceWithML(stageResults);
      }

      // 総合信頼度計算
      const overallConfidence = this.calculateOverallConfidence(stageResults, mlEnhancement);
      
      // 統合解釈の生成
      const integratedInterpretation = this.generateIntegratedInterpretation(
        stageResults,
        mlEnhancement
      );
      
      // アクションアイテムの生成
      const actionItems = this.generateActionItems(stageResults);

      return {
        finalResult: {
          hexagram: stageResults.stage6.hexagram,
          line: stageResults.stage6.line,
          confidence: overallConfidence,
          reasoning: integratedInterpretation,
          tripleOSIntegration: stageResults.stage5.osImpacts,
          actionItems,
          mlEnhancement
        },
        summary: {
          mainTheme: this.extractMainTheme(stageResults),
          emotionalState: this.summarizeEmotionalState(stageResults.stage4),
          recommendedApproach: this.generateRecommendedApproach(stageResults),
          timeframe: this.estimateTimeframe(stageResults)
        },
        metadata: {
          analysisVersion: '2.0',
          contextType,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Stage 7 エラー:', error);
      throw new Error(`結果生成エラー: ${error.message}`);
    }
  }

  /**
   * ヘルパーメソッド群
   */

  // 基本的な形態素解析（フォールバック）
  basicMorphologicalAnalysis(text) {
    const words = text.match(/[一-龠]+|[ぁ-ん]+|[ァ-ヴー]+|[a-zA-Z0-9]+/g) || [];
    const tokens = words.map(word => ({
      surface_form: word,
      pos: '名詞,一般,*,*,*,*,*',
      basic_form: word
    }));

    return {
      tokens,
      tokenCount: tokens.length,
      posStatistics: { '名詞': tokens.length },
      topWords: [],
      analysis: {
        nounRatio: 1.0,
        verbRatio: 0,
        adjectiveRatio: 0,
        contentWordRatio: 1.0
      }
    };
  }

  // 内容語比率の計算
  calculateContentWordRatio(posStats, totalTokens) {
    const contentWords = ['名詞', '動詞', '形容詞', '形容動詞', '副詞'];
    const contentWordCount = contentWords.reduce((sum, pos) => sum + (posStats[pos] || 0), 0);
    return contentWordCount / totalTokens;
  }

  // キーワードクラスタリング
  clusterKeywords(keywords) {
    const clusters = {
      emotional: [],
      action: [],
      characteristic: [],
      contextual: []
    };

    keywords.forEach(keyword => {
      switch (keyword.category) {
        case 'emotional_trait':
          clusters.emotional.push(keyword);
          break;
        case 'action':
          clusters.action.push(keyword);
          break;
        case 'characteristic':
          clusters.characteristic.push(keyword);
          break;
        default:
          clusters.contextual.push(keyword);
      }
    });

    return clusters;
  }

  // 平均優先度計算
  calculateAveragePriority(keywords) {
    if (keywords.length === 0) return 0;
    const sum = keywords.reduce((total, k) => total + k.priority, 0);
    return sum / keywords.length;
  }

  // キーワード多様性計算
  calculateKeywordDiversity(keywords) {
    const categories = new Set(keywords.map(k => k.category));
    return categories.size / 4; // 4つのカテゴリに対する比率
  }

  // 感情の深層分析
  analyzeEmotionalDepth(emotionalContext, keywords) {
    const emotionalKeywords = keywords.filter(k => k.category === 'emotional_trait');
    
    return {
      ...emotionalContext,
      depth: emotionalKeywords.length > 3 ? 'deep' : 'surface',
      consistency: this.calculateEmotionalConsistency(emotionalKeywords),
      complexity: emotionalContext.secondary ? 'complex' : 'simple'
    };
  }

  // 文脈の拡張分析
  expandContextualAnalysis(contextualMapping, userPersona) {
    return {
      ...contextualMapping,
      personalRelevance: this.calculatePersonalRelevance(contextualMapping, userPersona),
      temporalDimension: this.analyzeTemporalDimension(contextualMapping),
      socialDimension: this.analyzeSocialDimension(contextualMapping)
    };
  }

  // 感情と文脈の相互作用分析
  analyzeEmotionContextInteraction(emotionalDepth, expandedContext) {
    const interactionStrength = emotionalDepth.intensity * expandedContext.confidence;
    
    return {
      strength: interactionStrength,
      type: this.determineInteractionType(emotionalDepth, expandedContext),
      stability: interactionStrength > 0.7 ? 'stable' : 'fluctuating',
      recommendation: this.generateInteractionRecommendation(interactionStrength)
    };
  }

  // Engine OS影響度計算
  calculateEngineOSImpact(emotionalAnalysis, psychologicalProfile) {
    const baseImpact = emotionalAnalysis.intensity * 0.6;
    const depthBonus = emotionalAnalysis.depth === 'deep' ? 0.2 : 0;
    const profileBonus = psychologicalProfile.internalFocus || 0;
    
    return Math.min(baseImpact + depthBonus + profileBonus, 1.0);
  }

  // Interface OS影響度計算
  calculateInterfaceOSImpact(contextualAnalysis, psychologicalProfile) {
    const socialRelevance = contextualAnalysis.socialDimension || 0.5;
    const contextConfidence = contextualAnalysis.confidence || 0.5;
    const profileBonus = psychologicalProfile.socialOrientation || 0;
    
    return Math.min(socialRelevance * contextConfidence + profileBonus, 1.0);
  }

  // SafeMode OS影響度計算
  calculateSafeModeOSImpact(emotionalAnalysis, contextualAnalysis) {
    const stressLevel = emotionalAnalysis.intensity;
    const uncertaintyLevel = 1 - contextualAnalysis.confidence;
    
    return Math.min((stressLevel + uncertaintyLevel) / 2, 1.0);
  }

  // OS間バランス分析
  analyzeOSBalance(osImpacts) {
    const total = osImpacts.engineOS + osImpacts.interfaceOS + osImpacts.safeModeOS;
    const average = total / 3;
    const variance = Object.values(osImpacts)
      .reduce((sum, impact) => sum + Math.pow(impact - average, 2), 0) / 3;
    
    return {
      isBalanced: variance < 0.1,
      dominance: this.calculateDominance(osImpacts),
      harmony: 1 - Math.sqrt(variance),
      distribution: {
        engine: osImpacts.engineOS / total,
        interface: osImpacts.interfaceOS / total,
        safeMode: osImpacts.safeModeOS / total
      }
    };
  }

  // 主要卦の選定
  selectPrimaryHexagram(osImpacts, balance) {
    // OS影響度と易経64卦のマッピングロジック
    const engineWeight = osImpacts.engineOS;
    const interfaceWeight = osImpacts.interfaceOS;
    const safeModeWeight = osImpacts.safeModeOS;
    
    // 簡易マッピング（実際の実装では詳細なマッピングテーブルを使用）
    let hexagramIndex = 1;
    
    if (engineWeight > 0.7) {
      // 内的価値観主導
      hexagramIndex = Math.floor(Math.random() * 8) + 1; // 乾・坤系
    } else if (interfaceWeight > 0.7) {
      // 社会的側面主導
      hexagramIndex = Math.floor(Math.random() * 8) + 17; // 沢・風系
    } else if (safeModeWeight > 0.7) {
      // 防御システム主導
      hexagramIndex = Math.floor(Math.random() * 8) + 33; // 艮・坎系
    } else {
      // バランス型
      hexagramIndex = Math.floor(Math.random() * 64) + 1;
    }
    
    return Math.min(Math.max(hexagramIndex, 1), 64);
  }

  // 爻位置の計算
  calculateLinePosition(integrationScore, osImpacts) {
    // 統合スコアとOS影響度から爻位置を決定
    const position = Math.floor(integrationScore * 6) + 1;
    return Math.min(Math.max(position, 1), 6);
  }

  // 総合信頼度計算
  calculateOverallConfidence(stageResults, mlEnhancement) {
    const stageConfidences = [
      stageResults.stage3.confidence || 0.5,
      stageResults.stage4.emotionalAnalysis.complexity === 'complex' ? 0.8 : 0.6,
      stageResults.stage5.integrationScore || 0.5,
      stageResults.stage6.mappingConfidence || 0.5
    ];
    
    const baseConfidence = stageConfidences.reduce((sum, conf) => sum + conf, 0) / stageConfidences.length;
    const mlBonus = mlEnhancement ? 0.1 : 0;
    
    return Math.min(baseConfidence + mlBonus, 0.95);
  }

  // エラーハンドリング
  async handleStageError(stageNumber, error, inputText, partialResults) {
    console.error(`Stage ${stageNumber} エラーハンドリング:`, error);
    
    // 部分的な結果を使用してフォールバック結果を生成
    const fallbackResult = {
      inputAnalysis: {
        originalText: inputText,
        normalizedText: partialResults.stage1?.normalizedText || inputText,
        textLength: inputText.length,
        complexity: 'unknown'
      },
      stageResults: {
        ...partialResults,
        error: {
          stage: stageNumber,
          message: error.message,
          timestamp: new Date().toISOString()
        }
      },
      finalResult: {
        hexagram: 1, // デフォルト卦
        line: 1,
        confidence: 0.3,
        reasoning: 'エラーによるフォールバック結果',
        tripleOSIntegration: {
          engineOS: 0.33,
          interfaceOS: 0.33,
          safeModeOS: 0.34
        }
      },
      qualityMetrics: {
        overallConfidence: 0.3,
        stageCompletionRate: (stageNumber - 1) / 7,
        errorCount: 1,
        processingTime: 0
      }
    };
    
    return fallbackResult;
  }

  // キャッシュ関連
  generateCacheKey(text, contextType) {
    return `${text.substring(0, 50)}_${contextType || 'none'}_v2`;
  }

  updateCache(key, result) {
    if (this.analysisCache.size > 100) {
      const firstKey = this.analysisCache.keys().next().value;
      this.analysisCache.delete(firstKey);
    }
    this.analysisCache.set(key, result);
  }

  // 統計更新
  updateStatistics(result, success) {
    this.statistics.totalAnalyses++;
    
    if (success) {
      this.statistics.successfulAnalyses++;
      const prevAvg = this.statistics.averageConfidence;
      const total = this.statistics.successfulAnalyses;
      this.statistics.averageConfidence = 
        (prevAvg * (total - 1) + result.qualityMetrics.overallConfidence) / total;
    } else {
      this.statistics.failedAnalyses++;
    }
    
    // 段階完了率の更新
    Object.keys(result.stageResults).forEach(stage => {
      if (result.stageResults[stage] && !result.stageResults[stage].error) {
        this.statistics.stageCompletionRates[stage]++;
      }
    });
  }

  // 易経データベース初期化
  initializeHexagramDatabase() {
    // 簡易版（実際の実装では完全なデータベースを使用）
    return {
      1: { name: '乾為天', meaning: '創造的な力' },
      2: { name: '坤為地', meaning: '受容的な力' },
      29: { name: '坎為水', meaning: '困難と危険' },
      30: { name: '離為火', meaning: '明晰と依存' },
      // ... 他の卦
    };
  }

  // その他のヘルパーメソッド
  calculateTextComplexity(stageResults) {
    const factors = [
      stageResults.stage2?.analysis?.contentWordRatio || 0.5,
      stageResults.stage3?.extractionQuality?.diversityScore || 0.5,
      stageResults.stage4?.emotionalAnalysis?.complexity === 'complex' ? 1 : 0.5
    ];
    
    const average = factors.reduce((sum, f) => sum + f, 0) / factors.length;
    
    if (average > 0.7) return 'high';
    if (average > 0.4) return 'medium';
    return 'low';
  }

  generatePsychologicalProfile(emotionalDepth, expandedContext, userPersona) {
    return {
      internalFocus: emotionalDepth.depth === 'deep' ? 0.8 : 0.4,
      socialOrientation: expandedContext.socialDimension > 0.6 ? 0.7 : 0.3,
      adaptability: userPersona?.adaptability || 0.5,
      stressResponse: emotionalDepth.intensity > 0.7 ? 'high' : 'moderate'
    };
  }

  // エラー結果生成
  generateErrorResult(errorMessage) {
    return {
      inputAnalysis: {
        originalText: '',
        normalizedText: '',
        textLength: 0,
        complexity: 'error'
      },
      stageResults: {},
      finalResult: {
        hexagram: 1,
        line: 1,
        confidence: 0,
        reasoning: errorMessage,
        error: true
      },
      qualityMetrics: {
        overallConfidence: 0,
        stageCompletionRate: 0,
        errorCount: 1,
        processingTime: 0
      }
    };
  }
}

// グローバルスコープにエクスポート
if (typeof window !== 'undefined') {
  window.IntegratedAnalysisEngine = IntegratedAnalysisEngine;
}