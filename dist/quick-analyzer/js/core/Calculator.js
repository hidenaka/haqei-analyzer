/**
 * Calculator - 分析計算エンジンクラス
 * 八卦スコア計算、結果判定、インサイト生成機能を提供
 */
class Calculator {
  constructor() {
    this.dataManager = null;
    this.initialized = false;
    
    // 計算設定
    this.CALCULATION_CONFIG = {
      minConfidenceThreshold: 0.6,
      maxConfidenceThreshold: 0.9,
      tieBreakingMethod: 'timestamp', // 'random', 'timestamp', 'first'
      enableWeighting: true,
      normalizeScores: true
    };
    
    // 結果タイプの定義
    this.RESULT_TYPES = {
      DEFINITIVE: 'definitive',    // 明確な結果
      PROBABLE: 'probable',        // 可能性が高い結果
      UNCERTAIN: 'uncertain',      // 不確実な結果
      TIE: 'tie'                  // 同点の結果
    };
    
    this.init();
  }

  /**
   * Calculatorを初期化
   */
  async init() {
    try {
      this.log('info', 'init', 'Initializing Calculator');
      
      // DataManagerのインスタンスを取得（グローバルインスタンスを優先）
      if (window.quickAnalyzerApp && window.quickAnalyzerApp.dataManager) {
        this.dataManager = window.quickAnalyzerApp.dataManager;
      } else if (window.DataManager) {
        this.dataManager = new DataManager();
        if (!this.dataManager.isLoaded()) {
          await this.dataManager.init();
        }
      } else {
        throw new Error('DataManager not available');
      }
      
      this.initialized = true;
      this.log('info', 'init', 'Calculator initialized successfully');
      
    } catch (error) {
      this.handleError(error, 'initialization');
      throw error;
    }
  }

  /**
   * 回答データから診断結果を計算
   * @param {Object} answersData - 回答データ
   * @returns {Object} 診断結果
   */
  calculateResult(answersData) {
    try {
      this.log('info', 'calculateResult', 'Starting calculation', {
        answerCount: Object.keys(answersData).length
      });
      
      // 入力データの検証
      this.validateAnswersData(answersData);
      
      // 八卦スコアの計算
      const trigramScores = this.calculateTrigramScores(answersData);
      
      // 結果の判定
      const primaryResult = this.determineResult(trigramScores);
      
      // 信頼度の計算
      const confidence = this.calculateConfidence(trigramScores, primaryResult);
      
      // インサイトの生成
      const insights = this.generateInsights(primaryResult, trigramScores, confidence);
      
      // 結果オブジェクトの作成
      const result = {
        id: this.generateResultId(),
        timestamp: new Date().toISOString(),
        answers: answersData,
        trigramScores,
        primaryTrigram: primaryResult.trigram,
        confidence,
        resultType: primaryResult.type,
        insights,
        metadata: {
          calculationVersion: '1.0',
          dataVersion: this.dataManager?.getConfigValue('version', '1.0'),
          calculationTime: Date.now()
        }
      };
      
      this.log('info', 'calculateResult', 'Calculation completed', {
        primaryTrigramId: primaryResult.trigram.id,
        confidence,
        resultType: primaryResult.type
      });
      
      return result;
      
    } catch (error) {
      this.handleError(error, 'calculation');
      throw error;
    }
  }

  /**
   * 回答データを検証
   * @param {Object} answersData - 回答データ
   */
  validateAnswersData(answersData) {
    if (!answersData || typeof answersData !== 'object') {
      throw new Error('Invalid answers data: must be an object');
    }
    
    const questions = this.dataManager.getQuestions();
    const requiredQuestions = questions.map(q => q.id);
    const providedAnswers = Object.keys(answersData);
    
    // すべての質問に回答されているかチェック
    const missingAnswers = requiredQuestions.filter(qId => !providedAnswers.includes(qId));
    if (missingAnswers.length > 0) {
      throw new Error(`Missing answers for questions: ${missingAnswers.join(', ')}`);
    }
    
    // 不正な回答がないかチェック
    providedAnswers.forEach(questionId => {
      const question = this.dataManager.getQuestion(questionId);
      if (!question) {
        throw new Error(`Invalid question ID: ${questionId}`);
      }
      
      const answer = answersData[questionId];
      const validValues = question.options.map(opt => opt.value);
      if (!validValues.includes(answer)) {
        throw new Error(`Invalid answer for question ${questionId}: ${answer}`);
      }
    });
    
    this.log('debug', 'validateAnswersData', 'Answers data validation passed');
  }

  /**
   * 八卦スコアを計算
   * @param {Object} answersData - 回答データ
   * @returns {Object} 八卦スコア
   */
  calculateTrigramScores(answersData) {
    const scoringLogic = this.dataManager.getScoringLogic();
    const scores = {};
    
    // 全八卦のスコアを0で初期化
    for (let i = 1; i <= 8; i++) {
      scores[i] = 0;
    }
    
    // 各回答に基づいてスコアを計算
    Object.entries(answersData).forEach(([questionId, answer]) => {
      const questionScoring = scoringLogic[questionId];
      if (questionScoring && questionScoring[answer]) {
        const trigrams = questionScoring[answer];
        
        // 重み付けスコアリング
        const weight = this.getQuestionWeight(questionId);
        const scorePerTrigram = weight / trigrams.length;
        
        trigrams.forEach(trigramId => {
          scores[trigramId] += scorePerTrigram;
        });
      }
    });
    
    // スコアの正規化
    if (this.CALCULATION_CONFIG.normalizeScores) {
      const maxPossibleScore = Object.keys(answersData).length;
      Object.keys(scores).forEach(trigramId => {
        scores[trigramId] = scores[trigramId] / maxPossibleScore;
      });
    }
    
    this.log('debug', 'calculateTrigramScores', 'Trigram scores calculated', scores);
    return scores;
  }

  /**
   * 質問の重みを取得
   * @param {string} questionId - 質問ID
   * @returns {number}
   */
  getQuestionWeight(questionId) {
    if (!this.CALCULATION_CONFIG.enableWeighting) {
      return 1.0;
    }
    
    const question = this.dataManager.getQuestion(questionId);
    return question?.weight || 1.0;
  }

  /**
   * 結果を判定
   * @param {Object} trigramScores - 八卦スコア
   * @returns {Object} 判定結果
   */
  determineResult(trigramScores) {
    // スコアでソート
    const sortedTrigrams = Object.entries(trigramScores)
      .sort(([, a], [, b]) => b - a)
      .map(([id, score]) => ({
        id: parseInt(id),
        score,
        trigram: this.dataManager.getTrigram(parseInt(id))
      }));
    
    const topTrigram = sortedTrigrams[0];
    const secondTrigram = sortedTrigrams[1];
    
    // 同点チェック
    const scoreDifference = topTrigram.score - secondTrigram.score;
    const isTie = Math.abs(scoreDifference) < 0.001; // 浮動小数点の誤差を考慮
    
    if (isTie) {
      // 同点の場合のタイブレーキング
      const tieBreakWinner = this.handleTieBreaking([topTrigram, secondTrigram]);
      return {
        trigram: tieBreakWinner.trigram,
        score: tieBreakWinner.score,
        type: this.RESULT_TYPES.TIE,
        tiedWith: [topTrigram, secondTrigram].filter(t => t.id !== tieBreakWinner.id)
      };
    }
    
    // 信頼度による結果タイプの判定
    const confidence = this.calculateBasicConfidence(topTrigram.score, secondTrigram.score);
    
    let resultType;
    if (confidence >= this.CALCULATION_CONFIG.maxConfidenceThreshold) {
      resultType = this.RESULT_TYPES.DEFINITIVE;
    } else if (confidence >= this.CALCULATION_CONFIG.minConfidenceThreshold) {
      resultType = this.RESULT_TYPES.PROBABLE;
    } else {
      resultType = this.RESULT_TYPES.UNCERTAIN;
    }
    
    return {
      trigram: topTrigram.trigram,
      score: topTrigram.score,
      type: resultType,
      runner_up: secondTrigram
    };
  }

  /**
   * タイブレーキングを処理
   * @param {Array} tiedTrigrams - 同点の八卦
   * @returns {Object}
   */
  handleTieBreaking(tiedTrigrams) {
    switch (this.CALCULATION_CONFIG.tieBreakingMethod) {
      case 'random':
        return tiedTrigrams[Math.floor(Math.random() * tiedTrigrams.length)];
      
      case 'timestamp':
        // より新しいタイムスタンプを持つ八卦を選択（実際は最初の八卦）
        return tiedTrigrams[0];
      
      case 'first':
      default:
        return tiedTrigrams[0];
    }
  }

  /**
   * 基本的な信頼度を計算
   * @param {number} topScore - 最高スコア
   * @param {number} secondScore - 2番目のスコア
   * @returns {number}
   */
  calculateBasicConfidence(topScore, secondScore) {
    const scoreDifference = topScore - secondScore;
    const maxPossibleDifference = 1.0; // 正規化後の最大差
    
    return Math.min(scoreDifference / maxPossibleDifference, 1.0);
  }

  /**
   * 詳細な信頼度を計算
   * @param {Object} trigramScores - 八卦スコア
   * @param {Object} primaryResult - 主要結果
   * @returns {number}
   */
  calculateConfidence(trigramScores, primaryResult) {
    const scores = Object.values(trigramScores).sort((a, b) => b - a);
    const topScore = scores[0];
    const secondScore = scores[1];
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    // 複数の要因を考慮した信頼度計算
    const scoreDifferenceConfidence = this.calculateBasicConfidence(topScore, secondScore);
    const distributionConfidence = (topScore - avgScore) / (1.0 - avgScore);
    const consistencyConfidence = this.calculateConsistencyConfidence(trigramScores);
    
    // 重み付け平均
    const confidence = (
      scoreDifferenceConfidence * 0.5 +
      distributionConfidence * 0.3 +
      consistencyConfidence * 0.2
    );
    
    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * 一貫性信頼度を計算
   * @param {Object} trigramScores - 八卦スコア
   * @returns {number}
   */
  calculateConsistencyConfidence(trigramScores) {
    const scores = Object.values(trigramScores);
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);
    
    // 標準偏差が大きいほど一貫性が高い（最高スコアが明確に分離している）
    return Math.min(standardDeviation * 4, 1.0); // 4は調整係数
  }

  /**
   * インサイトを生成
   * @param {Object} primaryResult - 主要結果
   * @param {Object} trigramScores - 八卦スコア
   * @param {number} confidence - 信頼度
   * @returns {Object}
   */
  generateInsights(primaryResult, trigramScores, confidence) {
    const primaryTrigram = primaryResult.trigram;
    
    // 基本インサイト
    const basicInsights = this.generateBasicInsights(primaryTrigram);
    
    // パーソナライズされたインサイト
    const personalizedInsights = this.generatePersonalizedInsights(
      primaryTrigram, 
      trigramScores, 
      confidence
    );
    
    // 行動推奨
    const actionRecommendations = this.generateActionRecommendations(
      primaryTrigram, 
      primaryResult.type,
      confidence
    );
    
    return {
      basic: basicInsights,
      personalized: personalizedInsights,
      actions: actionRecommendations,
      confidence: {
        level: confidence,
        description: this.getConfidenceDescription(confidence),
        reliability: this.getReliabilityDescription(primaryResult.type)
      }
    };
  }

  /**
   * 基本インサイトを生成
   * @param {Object} trigram - 八卦データ
   * @returns {Object}
   */
  generateBasicInsights(trigram) {
    return {
      strengths: trigram.insights?.strengths || [],
      challenges: trigram.insights?.challenges || [],
      characteristics: trigram.characteristics || []
    };
  }

  /**
   * パーソナライズされたインサイトを生成
   * @param {Object} primaryTrigram - 主要八卦
   * @param {Object} trigramScores - 八卦スコア
   * @param {number} confidence - 信頼度
   * @returns {Object}
   */
  generatePersonalizedInsights(primaryTrigram, trigramScores, confidence) {
    const insights = {
      dominantTraits: [],
      secondaryInfluences: [],
      balanceAnalysis: {},
      developmentAreas: []
    };
    
    // 主要特性
    insights.dominantTraits = this.identifyDominantTraits(primaryTrigram, confidence);
    
    // 副次的影響
    insights.secondaryInfluences = this.identifySecondaryInfluences(trigramScores, primaryTrigram.id);
    
    // バランス分析
    insights.balanceAnalysis = this.analyzeBalance(trigramScores);
    
    // 発達領域
    insights.developmentAreas = this.identifyDevelopmentAreas(trigramScores, primaryTrigram);
    
    return insights;
  }

  /**
   * 主要特性を特定
   * @param {Object} trigram - 八卦データ
   * @param {number} confidence - 信頼度
   * @returns {Array}
   */
  identifyDominantTraits(trigram, confidence) {
    const traits = trigram.characteristics || [];
    
    // 信頼度に基づいて特性の数を調整
    const traitCount = confidence > 0.8 ? traits.length : Math.max(2, Math.floor(traits.length * confidence));
    
    return traits.slice(0, traitCount);
  }

  /**
   * 副次的影響を特定
   * @param {Object} trigramScores - 八卦スコア
   * @param {number} primaryTrigramId - 主要八卦ID
   * @returns {Array}
   */
  identifySecondaryInfluences(trigramScores, primaryTrigramId) {
    const influences = [];
    
    // スコア順にソート（主要八卦を除く）
    const sortedScores = Object.entries(trigramScores)
      .filter(([id]) => parseInt(id) !== primaryTrigramId)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2); // 上位2つの副次的影響
    
    sortedScores.forEach(([id, score]) => {
      if (score > 0.3) { // 閾値以上の場合のみ
        const trigram = this.dataManager.getTrigram(parseInt(id));
        if (trigram) {
          influences.push({
            trigram: trigram,
            score: score,
            influence: this.calculateInfluenceLevel(score)
          });
        }
      }
    });
    
    return influences;
  }

  /**
   * 影響レベルを計算
   * @param {number} score - スコア
   * @returns {string}
   */
  calculateInfluenceLevel(score) {
    if (score > 0.7) return 'strong';
    if (score > 0.5) return 'moderate';
    if (score > 0.3) return 'mild';
    return 'weak';
  }

  /**
   * バランス分析
   * @param {Object} trigramScores - 八卦スコア
   * @returns {Object}
   */
  analyzeBalance(trigramScores) {
    const scores = Object.values(trigramScores);
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    
    return {
      overall: mean,
      diversity: 1 - Math.sqrt(variance), // 低い分散 = 高い多様性
      polarization: Math.sqrt(variance),  // 高い分散 = 高い偏極化
      interpretation: this.interpretBalance(mean, Math.sqrt(variance))
    };
  }

  /**
   * バランス解釈
   * @param {number} mean - 平均
   * @param {number} stdDev - 標準偏差
   * @returns {string}
   */
  interpretBalance(mean, stdDev) {
    if (stdDev > 0.3) {
      return '特定の特性が強く現れる明確な個性を持っています。';
    } else if (stdDev > 0.2) {
      return 'バランスの取れた性格で、様々な特性を併せ持っています。';
    } else {
      return '多面的な性格で、状況に応じて様々な面を見せることができます。';
    }
  }

  /**
   * 発達領域を特定
   * @param {Object} trigramScores - 八卦スコア
   * @param {Object} primaryTrigram - 主要八卦
   * @returns {Array}
   */
  identifyDevelopmentAreas(trigramScores, primaryTrigram) {
    const developmentAreas = [];
    
    // 低スコアの八卦から発達機会を特定
    const lowScoreTrigrams = Object.entries(trigramScores)
      .filter(([, score]) => score < 0.3)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2);
    
    lowScoreTrigrams.forEach(([id, score]) => {
      const trigram = this.dataManager.getTrigram(parseInt(id));
      if (trigram) {
        developmentAreas.push({
          area: trigram.name,
          description: `${trigram.avatarName}の特性を伸ばすことで、より多面的な成長が期待できます。`,
          suggestions: trigram.insights?.recommendations || []
        });
      }
    });
    
    return developmentAreas;
  }

  /**
   * 行動推奨を生成
   * @param {Object} trigram - 八卦データ
   * @param {string} resultType - 結果タイプ
   * @param {number} confidence - 信頼度
   * @returns {Object}
   */
  generateActionRecommendations(trigram, resultType, confidence) {
    const recommendations = {
      immediate: [],
      longTerm: [],
      cautions: []
    };
    
    // 基本推奨事項
    const baseRecommendations = trigram.insights?.recommendations || [];
    
    // 信頼度とタイプに基づいて推奨事項を調整
    if (confidence > 0.7) {
      recommendations.immediate = baseRecommendations.slice(0, 2);
      recommendations.longTerm = baseRecommendations.slice(2);
    } else {
      recommendations.immediate = ['まずは自分の特性をもう少し探求してみてください。'];
      recommendations.longTerm = baseRecommendations;
    }
    
    // 注意事項
    recommendations.cautions = trigram.insights?.challenges?.map(challenge => 
      `${challenge}に注意しながら取り組みましょう。`
    ) || [];
    
    return recommendations;
  }

  /**
   * 信頼度の説明を取得
   * @param {number} confidence - 信頼度
   * @returns {string}
   */
  getConfidenceDescription(confidence) {
    if (confidence > 0.8) {
      return '非常に明確な結果です。あなたの特性がはっきりと現れています。';
    } else if (confidence > 0.6) {
      return '比較的明確な結果です。主要な特性が特定できています。';
    } else if (confidence > 0.4) {
      return '中程度の明確さです。複数の特性が混在している可能性があります。';
    } else {
      return '特性が多様で、状況に応じて異なる面を見せる可能性があります。';
    }
  }

  /**
   * 信頼性の説明を取得
   * @param {string} resultType - 結果タイプ
   * @returns {string}
   */
  getReliabilityDescription(resultType) {
    switch (resultType) {
      case this.RESULT_TYPES.DEFINITIVE:
        return '高い信頼性があります';
      case this.RESULT_TYPES.PROBABLE:
        return '十分な信頼性があります';
      case this.RESULT_TYPES.UNCERTAIN:
        return '参考程度の信頼性です';
      case this.RESULT_TYPES.TIE:
        return '複数の特性が同程度に現れています';
      default:
        return '標準的な信頼性です';
    }
  }

  /**
   * 結果IDを生成
   * @returns {string}
   */
  generateResultId() {
    return `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * エラーハンドリング
   * @param {Error} error - エラーオブジェクト
   * @param {string} context - コンテキスト
   */
  handleError(error, context) {
    this.log('error', 'handleError', `Error in ${context}`, error);
    
    // ErrorHandlerが利用可能な場合は通知
    if (window.ErrorHandler && typeof window.ErrorHandler.createError === 'function') {
      window.ErrorHandler.createError('calculation', error.message, { context });
    }
  }

  /**
   * ログ出力
   * @param {string} level - ログレベル
   * @param {string} method - メソッド名
   * @param {string} message - メッセージ
   * @param {*} data - データ
   */
  log(level, method, message, data = null) {
    const logData = {
      component: 'Calculator',
      method,
      message,
      timestamp: new Date().toISOString(),
      ...(data && { data })
    };
    
    console[level](`[Calculator] ${message}`, logData);
  }
}

// グローバルに公開
window.Calculator = Calculator;