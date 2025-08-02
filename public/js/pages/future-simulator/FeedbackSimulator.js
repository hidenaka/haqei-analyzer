/**
 * フィードバックシミュレーター - リアルなユーザーフィードバック生成
 * 
 * 目的：
 * - 状況卦算出結果に対する多様なフィードバックの生成
 * - 人間らしい評価・感想・改善要望の表現
 * - PDCAサイクル改善のためのデータ収集
 * 
 * 入力：
 * - testResult: object - SituationalHexagramTesterの実行結果
 * - userProfile: object - テストユーザーのプロファイル
 * - feedbackOptions: object - フィードバック生成オプション
 * 
 * 処理内容：
 * 1. 結果の妥当性評価（ユーザー視点）
 * 2. 感情的反応の生成
 * 3. 具体的な改善要望の生成
 * 4. 満足度スコアの算出
 * 5. フィードバックテキストの構築
 * 6. 統計的分析用データの生成
 * 
 * 出力：
 * - feedback: object - 生成されたフィードバック
 * - satisfactionScore: number - 満足度スコア（0-5）
 * - improvementSuggestions: Array - 改善提案リスト
 * - emotionalResponse: object - 感情的反応の分析
 * 
 * 副作用：
 * - フィードバックパターンの学習
 * - 統計データの蓄積
 * 
 * 前提条件：
 * - テストユーザーの性格特性が利用可能
 * - 易経の基本的な意味データが利用可能
 * 
 * エラー処理：
 * - フィードバック生成失敗時のフォールバック
 * - 不適切な表現の除外
 */
class FeedbackSimulator {
  constructor() {
    // フィードバックタイプの定義
    this.feedbackTypes = {
      positive: {
        name: 'ポジティブ',
        ratio: 0.3,
        characteristics: ['共感', '納得', '希望', '気づき']
      },
      neutral: {
        name: '中立',
        ratio: 0.4,
        characteristics: ['理解', '疑問', '確認', '興味']
      },
      negative: {
        name: 'ネガティブ',
        ratio: 0.2,
        characteristics: ['違和感', '不満', '疑念', '困惑']
      },
      constructive: {
        name: '建設的',
        ratio: 0.1,
        characteristics: ['提案', '要望', 'アイデア', '期待']
      }
    };
    
    // 満足度評価基準
    this.satisfactionCriteria = {
      accuracy: {
        weight: 0.35,
        description: '状況の的確な把握'
      },
      relevance: {
        weight: 0.25,
        description: '悩みとの関連性'
      },
      clarity: {
        weight: 0.20,
        description: '解釈の明確さ'
      },
      actionability: {
        weight: 0.20,
        description: '行動指針の具体性'
      }
    };
    
    // パーソナリティ別反応パターン
    this.personalityReactions = {
      analytical: {
        positivePatterns: ['論理的に納得できました', '分析が的確です', 'データに基づいた解釈'],
        negativePatterns: ['根拠が不明確', '論理的な飛躍がある', '説明が不十分'],
        focusAreas: ['論理性', '根拠', '一貫性']
      },
      emotional: {
        positivePatterns: ['心に響きました', '気持ちを理解してもらえた', '共感できます'],
        negativePatterns: ['感情を理解していない', '冷たく感じる', '心に響かない'],
        focusAreas: ['共感', '感情理解', '温かさ']
      },
      practical: {
        positivePatterns: ['実用的なアドバイス', '具体的で役立つ', '実践しやすい'],
        negativePatterns: ['抽象的すぎる', '実践方法が不明', '現実的でない'],
        focusAreas: ['実用性', '具体性', '実践可能性']
      },
      creative: {
        positivePatterns: ['新しい視点', '創造的な解釈', '発想が面白い'],
        negativePatterns: ['型にはまっている', '新鮮味がない', '想像力不足'],
        focusAreas: ['独創性', '新規性', '創造性']
      }
    };
    
    // 年代別フィードバックスタイル
    this.ageGroupStyles = {
      '18-24': {
        expressions: ['まじで', 'めっちゃ', '〜って感じ', 'ガチ'],
        communication: 'casual',
        detailPreference: 'concise'
      },
      '25-34': {
        expressions: ['なるほど', '確かに', '〜ですね', '思います'],
        communication: 'balanced',
        detailPreference: 'moderate'
      },
      '35-44': {
        expressions: ['納得', '理解できます', '〜と感じました', '考えさせられました'],
        communication: 'polite',
        detailPreference: 'detailed'
      },
      '45-54': {
        expressions: ['深い', '示唆に富む', '〜という点で', '洞察'],
        communication: 'formal',
        detailPreference: 'comprehensive'
      },
      '55+': {
        expressions: ['含蓄', '味わい深い', '経験から', '人生において'],
        communication: 'respectful',
        detailPreference: 'philosophical'
      }
    };
    
    // 改善要望カテゴリー
    this.improvementCategories = {
      interpretation: {
        suggestions: [
          'もっと具体的な解釈が欲しい',
          '抽象的すぎて理解しづらい',
          '現代的な言葉で説明してほしい',
          '例を挙げて説明してほしい'
        ]
      },
      personalization: {
        suggestions: [
          '個人の状況をもっと考慮してほしい',
          '年齢や職業を踏まえた解釈が欲しい',
          'もっとパーソナライズされた内容に',
          '自分の特性を理解した上でのアドバイスが欲しい'
        ]
      },
      actionability: {
        suggestions: [
          '具体的な行動指針が欲しい',
          '実践的なステップを示してほしい',
          '今すぐできることを教えてほしい',
          '長期的な計画の立て方を知りたい'
        ]
      },
      depth: {
        suggestions: [
          'もっと深い分析が欲しい',
          '表面的すぎる',
          '心理的な側面も含めてほしい',
          '根本的な原因分析が不足'
        ]
      },
      clarity: {
        suggestions: [
          'もっとわかりやすく',
          '専門用語を減らしてほしい',
          '要点を明確に',
          '結論を先に示してほしい'
        ]
      }
    };
    
    // 統計データ
    this.statistics = {
      totalFeedbacks: 0,
      satisfactionDistribution: new Map(),
      improvementRequests: new Map(),
      emotionalResponses: new Map()
    };
  }

  /**
   * フィードバックの生成
   * 
   * 目的：
   * - テスト結果に対するリアルなフィードバック生成
   * - ユーザー特性に応じた表現の調整
   * 
   * 処理内容：
   * - 満足度評価
   * - 感情的反応の決定
   * - フィードバックテキストの構築
   * 
   * 出力：
   * - 完全なフィードバックオブジェクト
   */
  async generateFeedback(testResult, userProfile, options = {}) {
    console.log(`💭 フィードバック生成: ${userProfile.id}`);
    
    try {
      // 基本情報の抽出
      const hexagramResult = testResult.hexagramResult;
      const analysisQuality = testResult.qualityMetrics;
      
      // ユーザー特性の分析
      const userCharacteristics = this.analyzeUserCharacteristics(userProfile);
      
      // 満足度の評価
      const satisfactionAnalysis = this.evaluateSatisfaction(
        hexagramResult,
        analysisQuality,
        userCharacteristics
      );
      
      // 感情的反応の生成
      const emotionalResponse = this.generateEmotionalResponse(
        satisfactionAnalysis,
        userCharacteristics
      );
      
      // フィードバックタイプの決定
      const feedbackType = this.determineFeedbackType(
        satisfactionAnalysis,
        emotionalResponse,
        userCharacteristics
      );
      
      // フィードバックテキストの生成
      const feedbackText = this.constructFeedbackText({
        type: feedbackType,
        satisfaction: satisfactionAnalysis,
        emotional: emotionalResponse,
        user: userCharacteristics,
        hexagram: hexagramResult
      });
      
      // 改善提案の生成
      const improvements = this.generateImprovementSuggestions(
        satisfactionAnalysis,
        userCharacteristics
      );
      
      // 統計更新
      this.updateStatistics(satisfactionAnalysis, improvements, emotionalResponse);
      
      // 完全なフィードバックオブジェクトを返す
      return {
        feedbackId: `feedback_${Date.now()}_${userProfile.id}`,
        userId: userProfile.id,
        testId: testResult.testId,
        satisfactionScore: satisfactionAnalysis.overall,
        satisfactionDetails: satisfactionAnalysis.details,
        emotionalResponse: emotionalResponse,
        feedbackType: feedbackType,
        feedbackText: feedbackText,
        improvementSuggestions: improvements,
        metadata: {
          timestamp: new Date().toISOString(),
          userAge: userProfile.basicInfo.age,
          userOccupation: userProfile.basicInfo.occupation.specific,
          hexagramId: hexagramResult.hexagramId,
          analysisConfidence: hexagramResult.confidence
        }
      };
      
    } catch (error) {
      console.error('フィードバック生成エラー:', error);
      return this.generateFallbackFeedback(testResult, userProfile);
    }
  }

  /**
   * ユーザー特性の分析
   */
  analyzeUserCharacteristics(userProfile) {
    // パーソナリティタイプの判定
    const personalityType = this.determinePersonalityType(userProfile.personality);
    
    // 年齢層の判定
    const ageGroup = this.getAgeGroup(userProfile.basicInfo.age);
    
    // コミュニケーションスタイルの判定
    const communicationStyle = this.determineCommunicationStyle(
      userProfile.personality,
      ageGroup
    );
    
    // HSP特性の考慮
    const sensitivity = userProfile.hspTraits.isHSP ? 'high' : 'normal';
    
    return {
      personalityType: personalityType,
      ageGroup: ageGroup,
      communicationStyle: communicationStyle,
      sensitivity: sensitivity,
      worryDepth: userProfile.worryProfile.depthLevel,
      expectations: this.inferExpectations(personalityType, userProfile.worryProfile)
    };
  }

  /**
   * 満足度評価
   */
  evaluateSatisfaction(hexagramResult, analysisQuality, userCharacteristics) {
    const scores = {};
    let weightedSum = 0;
    let totalWeight = 0;
    
    // 各基準の評価
    for (const [criterion, config] of Object.entries(this.satisfactionCriteria)) {
      let score = 0;
      
      switch (criterion) {
        case 'accuracy':
          // 分析の信頼度と品質に基づく評価
          score = this.evaluateAccuracy(hexagramResult, analysisQuality);
          break;
          
        case 'relevance':
          // 悩みの深さと卦の関連性評価
          score = this.evaluateRelevance(hexagramResult, userCharacteristics);
          break;
          
        case 'clarity':
          // 解釈の明確さ評価（仮想的）
          score = this.evaluateClarity(hexagramResult);
          break;
          
        case 'actionability':
          // 行動指針の具体性評価
          score = this.evaluateActionability(hexagramResult, userCharacteristics);
          break;
      }
      
      scores[criterion] = score;
      weightedSum += score * config.weight;
      totalWeight += config.weight;
    }
    
    // 総合満足度（0-5のスケール）
    const overall = (weightedSum / totalWeight) * 5;
    
    // パーソナリティによる調整
    const adjustedOverall = this.adjustSatisfactionByPersonality(
      overall,
      userCharacteristics
    );
    
    return {
      overall: adjustedOverall,
      details: scores,
      weights: this.satisfactionCriteria
    };
  }

  /**
   * 感情的反応の生成
   */
  generateEmotionalResponse(satisfactionAnalysis, userCharacteristics) {
    const overall = satisfactionAnalysis.overall;
    
    // 基本的な感情カテゴリーの決定
    let primaryEmotion, intensity;
    
    if (overall >= 4.0) {
      primaryEmotion = 'positive';
      intensity = 'strong';
    } else if (overall >= 3.0) {
      primaryEmotion = 'positive';
      intensity = 'moderate';
    } else if (overall >= 2.5) {
      primaryEmotion = 'neutral';
      intensity = 'moderate';
    } else if (overall >= 1.5) {
      primaryEmotion = 'negative';
      intensity = 'moderate';
    } else {
      primaryEmotion = 'negative';
      intensity = 'strong';
    }
    
    // HSP特性による感情強度の調整
    if (userCharacteristics.sensitivity === 'high') {
      intensity = intensity === 'moderate' ? 'strong' : intensity;
    }
    
    // 二次的感情の追加
    const secondaryEmotions = this.generateSecondaryEmotions(
      primaryEmotion,
      userCharacteristics
    );
    
    // 感情表現の生成
    const expressions = this.generateEmotionalExpressions(
      primaryEmotion,
      intensity,
      userCharacteristics
    );
    
    return {
      primary: primaryEmotion,
      intensity: intensity,
      secondary: secondaryEmotions,
      expressions: expressions,
      overallTone: this.determineOverallTone(primaryEmotion, intensity)
    };
  }

  /**
   * フィードバックタイプの決定
   */
  determineFeedbackType(satisfaction, emotional, characteristics) {
    const score = satisfaction.overall;
    const emotion = emotional.primary;
    
    // スコアと感情に基づいてタイプを決定
    if (score >= 3.5 && emotion === 'positive') {
      return 'positive';
    } else if (score < 2.5 && emotion === 'negative') {
      return 'negative';
    } else if (characteristics.personalityType === 'analytical') {
      return 'constructive';
    } else {
      return 'neutral';
    }
  }

  /**
   * フィードバックテキストの構築
   */
  constructFeedbackText(params) {
    const { type, satisfaction, emotional, user, hexagram } = params;
    const segments = [];
    
    // 開始部分（感情表現）
    segments.push(this.generateOpeningStatement(emotional, user));
    
    // 卦に対する反応
    segments.push(this.generateHexagramReaction(hexagram, type, user));
    
    // 満足/不満足の理由
    segments.push(this.generateSatisfactionReasoning(satisfaction, type, user));
    
    // パーソナリティ特有の視点
    segments.push(this.generatePersonalitySpecificComment(user, hexagram));
    
    // 改善要望や期待（建設的な場合）
    if (type === 'constructive' || type === 'negative') {
      segments.push(this.generateImprovementRequest(satisfaction, user));
    }
    
    // 締めの言葉
    segments.push(this.generateClosingStatement(type, user));
    
    // セグメントを自然に結合
    let text = segments.join(' ');
    
    // 年代別の言語スタイル適用
    text = this.applyAgeGroupStyle(text, user.ageGroup);
    
    return text;
  }

  /**
   * 改善提案の生成
   */
  generateImprovementSuggestions(satisfaction, characteristics) {
    const suggestions = [];
    
    // 満足度の低い項目に基づいて提案を生成
    for (const [criterion, score] of Object.entries(satisfaction.details)) {
      if (score < 0.6) {
        const category = this.mapCriterionToImprovementCategory(criterion);
        const categorysuggestions = this.improvementCategories[category].suggestions;
        
        // パーソナリティに応じた提案を選択
        const selectedSuggestion = this.selectSuggestionByPersonality(
          categorysuggestions,
          characteristics
        );
        
        suggestions.push({
          category: category,
          suggestion: selectedSuggestion,
          priority: this.calculatePriority(score, criterion),
          criterion: criterion
        });
      }
    }
    
    // 優先度順にソート
    suggestions.sort((a, b) => b.priority - a.priority);
    
    // 最大3つまでに限定
    return suggestions.slice(0, 3);
  }

  // ========== 評価ヘルパーメソッド ==========

  /**
   * 正確性評価
   */
  evaluateAccuracy(hexagramResult, analysisQuality) {
    // 信頼度と品質メトリクスに基づいて評価
    const confidence = hexagramResult.confidence || 0.5;
    const quality = analysisQuality?.overall || 0.5;
    
    return (confidence + quality) / 2;
  }

  /**
   * 関連性評価
   */
  evaluateRelevance(hexagramResult, characteristics) {
    // 悩みの深さと卦の性質の対応を評価
    const worryDepth = characteristics.worryDepth;
    const hexagramId = hexagramResult.hexagramId;
    
    // 深い悩みに対する重い卦の対応
    const deepWorryHexagrams = [29, 47, 36, 6, 12, 23];
    const moderateWorryHexagrams = [5, 9, 39, 60, 61, 62];
    
    if (worryDepth === 'deep' && deepWorryHexagrams.includes(hexagramId)) {
      return 0.9;
    } else if (worryDepth === 'moderate' && moderateWorryHexagrams.includes(hexagramId)) {
      return 0.8;
    } else if (worryDepth === 'surface') {
      return 0.7;
    }
    
    return 0.5;
  }

  /**
   * 明確性評価
   */
  evaluateClarity(hexagramResult) {
    // 卦の解釈の明確性を仮想的に評価
    return 0.6 + Math.random() * 0.3;
  }

  /**
   * 行動可能性評価
   */
  evaluateActionability(hexagramResult, characteristics) {
    // 実践的なパーソナリティほど高い基準
    if (characteristics.personalityType === 'practical') {
      return 0.5 + Math.random() * 0.3;
    }
    
    return 0.6 + Math.random() * 0.3;
  }

  /**
   * パーソナリティによる満足度調整
   */
  adjustSatisfactionByPersonality(baseScore, characteristics) {
    const adjustments = {
      'analytical': -0.3,  // より批判的
      'emotional': 0.2,    // より受容的
      'practical': -0.2,   // 結果重視
      'creative': 0.1      // 新規性を評価
    };
    
    const adjustment = adjustments[characteristics.personalityType] || 0;
    return Math.max(0, Math.min(5, baseScore + adjustment));
  }

  // ========== テキスト生成ヘルパーメソッド ==========

  /**
   * 開始文の生成
   */
  generateOpeningStatement(emotional, user) {
    const templates = {
      positive: {
        strong: ['すごく納得できました！', '心に響きました。', '期待以上でした！'],
        moderate: ['なるほどと思いました。', '参考になりました。', '良い気づきがありました。']
      },
      negative: {
        strong: ['正直、期待外れでした。', 'ちょっと違うかなと思います。', 'もっと深い分析が欲しかったです。'],
        moderate: ['少し物足りなさを感じました。', 'もう一歩という感じです。', '悪くはないですが...']
      },
      neutral: {
        moderate: ['興味深い結果でした。', '考えさせられる内容でした。', 'いくつか気づきがありました。']
      }
    };
    
    const options = templates[emotional.primary][emotional.intensity];
    return options[Math.floor(Math.random() * options.length)];
  }

  /**
   * 卦への反応生成
   */
  generateHexagramReaction(hexagram, type, user) {
    const hexagramName = hexagram.hexagramName || '不明';
    
    const reactions = {
      positive: `「${hexagramName}」という卦が出たのは、今の私の状況をよく表していると思います。`,
      negative: `「${hexagramName}」という卦が出ましたが、正直ピンときませんでした。`,
      neutral: `「${hexagramName}」という卦について、もう少し詳しく知りたいです。`,
      constructive: `「${hexagramName}」の解釈は興味深いですが、より具体的な説明があるとよいと思います。`
    };
    
    return reactions[type];
  }

  /**
   * 満足度の理由説明
   */
  generateSatisfactionReasoning(satisfaction, type, user) {
    const lowestCriterion = Object.entries(satisfaction.details)
      .sort(([,a], [,b]) => a - b)[0][0];
    
    const reasoning = {
      accuracy: {
        positive: '私の状況を的確に捉えていると感じました。',
        negative: '私の実際の状況とは少しズレがあるように感じます。'
      },
      relevance: {
        positive: '悩みの核心に触れていて良かったです。',
        negative: '悩みとの関連性が薄いように思えました。'
      },
      clarity: {
        positive: '解釈がわかりやすくて良かったです。',
        negative: '説明が抽象的でわかりにくかったです。'
      },
      actionability: {
        positive: '具体的な行動指針があって助かりました。',
        negative: '何をすればいいのか具体的にわかりませんでした。'
      }
    };
    
    const isPositive = type === 'positive';
    return reasoning[lowestCriterion][isPositive ? 'positive' : 'negative'];
  }

  /**
   * パーソナリティ固有のコメント
   */
  generatePersonalitySpecificComment(user, hexagram) {
    const reactions = this.personalityReactions[user.personalityType];
    const isPositive = Math.random() > 0.5;
    
    const patterns = isPositive ? reactions.positivePatterns : reactions.negativePatterns;
    const selected = patterns[Math.floor(Math.random() * patterns.length)];
    
    return selected;
  }

  /**
   * 改善要望の生成
   */
  generateImprovementRequest(satisfaction, user) {
    const lowestScore = Math.min(...Object.values(satisfaction.details));
    
    if (lowestScore < 0.4) {
      return '大幅な改善が必要だと思います。';
    } else if (lowestScore < 0.6) {
      return 'いくつか改善してほしい点があります。';
    } else {
      return '細かい点ですが、改善の余地があると思います。';
    }
  }

  /**
   * 締めの言葉
   */
  generateClosingStatement(type, user) {
    const closings = {
      positive: ['今後も利用したいと思います。', 'ありがとうございました！', '友人にも勧めたいです。'],
      negative: ['改善を期待しています。', '次回はもっと良い結果を期待します。', '残念でした。'],
      neutral: ['参考にさせていただきます。', '考えてみます。', 'ありがとうございました。'],
      constructive: ['より良いサービスになることを期待しています。', '今後の発展を楽しみにしています。']
    };
    
    const options = closings[type];
    return options[Math.floor(Math.random() * options.length)];
  }

  /**
   * 年代別スタイルの適用
   */
  applyAgeGroupStyle(text, ageGroup) {
    const style = this.ageGroupStyles[ageGroup];
    
    if (!style) return text;
    
    // 若い世代向けのカジュアル化
    if (ageGroup === '18-24') {
      text = text.replace(/です。/g, 'っす。');
      text = text.replace(/でした。/g, 'でした！');
    }
    
    return text;
  }

  // ========== ユーティリティメソッド ==========

  /**
   * パーソナリティタイプの判定
   */
  determinePersonalityType(personality) {
    // 最も高いスコアの特性から判定
    const scores = {
      analytical: personality.conscientiousness.value + personality.openness.value,
      emotional: personality.neuroticism.value + personality.agreeableness.value,
      practical: personality.conscientiousness.value,
      creative: personality.openness.value
    };
    
    return Object.entries(scores)
      .sort(([,a], [,b]) => b - a)[0][0];
  }

  /**
   * 年齢グループの取得
   */
  getAgeGroup(age) {
    if (age <= 24) return '18-24';
    if (age <= 34) return '25-34';
    if (age <= 44) return '35-44';
    if (age <= 54) return '45-54';
    return '55+';
  }

  /**
   * コミュニケーションスタイルの判定
   */
  determineCommunicationStyle(personality, ageGroup) {
    const extraversion = personality.extraversion.value;
    const agreeableness = personality.agreeableness.value;
    
    if (extraversion > 0.6 && agreeableness > 0.6) {
      return 'friendly';
    } else if (extraversion < 0.4) {
      return 'reserved';
    } else {
      return 'balanced';
    }
  }

  /**
   * 期待値の推論
   */
  inferExpectations(personalityType, worryProfile) {
    const expectations = {
      analytical: ['論理的説明', '根拠', '体系的分析'],
      emotional: ['共感', '感情理解', '寄り添い'],
      practical: ['具体的解決策', '実践方法', '結果'],
      creative: ['新しい視点', '独創的解釈', 'インスピレーション']
    };
    
    return expectations[personalityType] || ['バランスの取れた分析'];
  }

  /**
   * 二次的感情の生成
   */
  generateSecondaryEmotions(primary, characteristics) {
    const emotions = {
      positive: ['期待', '安心', '希望'],
      negative: ['失望', '不信', '疑問'],
      neutral: ['興味', '考察', '保留']
    };
    
    return emotions[primary].slice(0, 2);
  }

  /**
   * 感情表現の生成
   */
  generateEmotionalExpressions(primary, intensity, characteristics) {
    const expressions = [];
    
    if (primary === 'positive' && intensity === 'strong') {
      expressions.push('本当に素晴らしい');
    } else if (primary === 'negative' && intensity === 'strong') {
      expressions.push('かなり期待外れ');
    }
    
    return expressions;
  }

  /**
   * 全体的なトーンの決定
   */
  determineOverallTone(primary, intensity) {
    return `${primary}_${intensity}`;
  }

  /**
   * 基準と改善カテゴリーのマッピング
   */
  mapCriterionToImprovementCategory(criterion) {
    const mapping = {
      accuracy: 'interpretation',
      relevance: 'personalization',
      clarity: 'clarity',
      actionability: 'actionability'
    };
    
    return mapping[criterion] || 'interpretation';
  }

  /**
   * パーソナリティに応じた提案選択
   */
  selectSuggestionByPersonality(suggestions, characteristics) {
    // パーソナリティタイプに最も適した提案を選択
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }

  /**
   * 優先度計算
   */
  calculatePriority(score, criterion) {
    const weight = this.satisfactionCriteria[criterion].weight;
    return (1 - score) * weight;
  }

  /**
   * 統計更新
   */
  updateStatistics(satisfaction, improvements, emotional) {
    this.statistics.totalFeedbacks++;
    
    // 満足度分布
    const scoreRange = Math.floor(satisfaction.overall);
    const count = this.statistics.satisfactionDistribution.get(scoreRange) || 0;
    this.statistics.satisfactionDistribution.set(scoreRange, count + 1);
    
    // 改善要望
    improvements.forEach(imp => {
      const reqCount = this.statistics.improvementRequests.get(imp.category) || 0;
      this.statistics.improvementRequests.set(imp.category, reqCount + 1);
    });
    
    // 感情的反応
    const emotionCount = this.statistics.emotionalResponses.get(emotional.primary) || 0;
    this.statistics.emotionalResponses.set(emotional.primary, emotionCount + 1);
  }

  /**
   * フォールバックフィードバック生成
   */
  generateFallbackFeedback(testResult, userProfile) {
    return {
      feedbackId: `feedback_fallback_${Date.now()}`,
      userId: userProfile.id,
      satisfactionScore: 2.5,
      feedbackText: '結果を確認しました。いくつか参考になる点がありました。',
      improvementSuggestions: [],
      fallback: true
    };
  }

  /**
   * 統計サマリーの生成
   */
  generateStatisticsSummary() {
    return {
      totalFeedbacks: this.statistics.totalFeedbacks,
      averageSatisfaction: this.calculateAverageSatisfaction(),
      satisfactionDistribution: Object.fromEntries(this.statistics.satisfactionDistribution),
      topImprovementRequests: this.getTopImprovementRequests(),
      emotionalDistribution: Object.fromEntries(this.statistics.emotionalResponses)
    };
  }

  /**
   * 平均満足度計算
   */
  calculateAverageSatisfaction() {
    let total = 0;
    let count = 0;
    
    for (const [score, frequency] of this.statistics.satisfactionDistribution) {
      total += score * frequency;
      count += frequency;
    }
    
    return count > 0 ? total / count : 0;
  }

  /**
   * トップ改善要望の取得
   */
  getTopImprovementRequests() {
    return Array.from(this.statistics.improvementRequests.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  }
}

// グローバル利用のためのエクスポート
window.FeedbackSimulator = FeedbackSimulator;