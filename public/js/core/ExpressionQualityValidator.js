/**
 * Expression Quality Validator
 * Phase 2 Task 2.3: 統合表現エンジン完成 - 品質検証システム
 * 
 * @version 2.0.0
 * @date 2025-08-16
 */

class ExpressionQualityValidator {
  constructor() {
    this.validationRules = this.initializeValidationRules();
    this.qualityMetrics = this.initializeQualityMetrics();
    console.log('✅ ExpressionQualityValidator initialized with comprehensive validation');
  }

  /**
   * バリデーションルール初期化
   */
  initializeValidationRules() {
    return {
      // HaQei統一性ルール
      haqeiConsistency: {
        requiredMentions: 1,
        acceptedTerms: ['HaQei分析', 'HaQeiロジック', 'HaQei智慧', 'HaQei実践論', 'HaQei哲学'],
        weight: 25
      },

      // 予測表現ルール
      predictionQuality: {
        requiredPatterns: ['予測されます', '見込まれます', '期待できます', '推奨されます'],
        weight: 20
      },

      // 文章構造ルール
      structuralIntegrity: {
        minLength: 20,
        maxLength: 150,
        sentenceBalance: true,
        weight: 20
      },

      // 感情配慮ルール
      emotionalCare: {
        harshTerms: ['失敗', '危険', '問題', '困難'],
        gentleAlternatives: ['課題', '注意点', '調整期', '慎重期'],
        weight: 15
      },

      // 論理性ルール
      logicalFlow: {
        requiredFlow: ['前提', '推論', '結論'],
        coherenceThreshold: 0.7,
        weight: 20
      }
    };
  }

  /**
   * 品質指標初期化
   */
  initializeQualityMetrics() {
    return {
      // 品質等級定義
      gradeThresholds: {
        S: 95, // 最高品質
        A: 85, // 高品質
        B: 70, // 良好
        C: 55, // 基準
        D: 40, // 要改善
        F: 0   // 不合格
      },

      // 重要度係数
      criticalFactors: {
        haqeiCompliance: 0.3,
        expressionClarity: 0.25,
        emotionalSafety: 0.25,
        logicalSoundness: 0.2
      }
    };
  }

  /**
   * 表現品質検証メイン
   */
  validateExpression(expression, context = {}) {
    if (!expression || typeof expression !== 'string') {
      return this.createValidationResult(0, 'F', ['表現が空または無効'], {});
    }

    // 各品質要素の検証
    const haqeiScore = this.validateHaqeiConsistency(expression);
    const predictionScore = this.validatePredictionQuality(expression);
    const structuralScore = this.validateStructuralIntegrity(expression);
    const emotionalScore = this.validateEmotionalCare(expression);
    const logicalScore = this.validateLogicalFlow(expression);

    // 重み付け総合スコア計算
    const totalScore = this.calculateWeightedScore({
      haqei: haqeiScore,
      prediction: predictionScore,
      structural: structuralScore,
      emotional: emotionalScore,
      logical: logicalScore
    });

    // 品質等級決定
    const grade = this.determineQualityGrade(totalScore);

    // 改善提案生成
    const suggestions = this.generateImprovementSuggestions({
      haqei: haqeiScore,
      prediction: predictionScore,
      structural: structuralScore,
      emotional: emotionalScore,
      logical: logicalScore
    }, expression);

    // 詳細分析
    const analysis = this.performDetailedAnalysis(expression, context);

    return this.createValidationResult(totalScore, grade, suggestions, analysis);
  }

  /**
   * HaQei統一性検証
   */
  validateHaqeiConsistency(expression) {
    const rules = this.validationRules.haqeiConsistency;
    let score = 0;

    // HaQei言及回数チェック
    const haqeiMatches = expression.match(/HaQei/g) || [];
    if (haqeiMatches.length >= rules.requiredMentions) {
      score += 50;
    }

    // 承認された用語の使用チェック
    const hasAcceptedTerm = rules.acceptedTerms.some(term => expression.includes(term));
    if (hasAcceptedTerm) {
      score += 50;
    }

    return Math.min(100, score);
  }

  /**
   * 予測表現品質検証
   */
  validatePredictionQuality(expression) {
    const rules = this.validationRules.predictionQuality;
    let score = 0;

    // 予測パターンの存在チェック
    const hasPredictionPattern = rules.requiredPatterns.some(pattern => 
      expression.includes(pattern)
    );
    
    if (hasPredictionPattern) {
      score += 60;
    }

    // 予測の具体性チェック
    if (expression.includes('期待できます') || expression.includes('見込まれます')) {
      score += 25;
    }

    // 曖昧表現の回避チェック
    const ambiguousTerms = ['かもしれません', '可能性があります', '思われます'];
    const hasAmbiguous = ambiguousTerms.some(term => expression.includes(term));
    if (!hasAmbiguous) {
      score += 15;
    }

    return Math.min(100, score);
  }

  /**
   * 構造的整合性検証
   */
  validateStructuralIntegrity(expression) {
    const rules = this.validationRules.structuralIntegrity;
    let score = 0;

    // 長さチェック
    if (expression.length >= rules.minLength && expression.length <= rules.maxLength) {
      score += 40;
    } else if (expression.length >= rules.minLength) {
      score += 20; // 最小要件は満たす
    }

    // 文の構造チェック
    const sentences = expression.match(/[^。！？]+[。！？]*/g) || [];
    if (sentences.length >= 1 && sentences.length <= 3) {
      score += 30;
    }

    // 読みやすさチェック
    const readabilityScore = this.calculateReadabilityScore(expression);
    score += readabilityScore * 0.3;

    return Math.min(100, score);
  }

  /**
   * 感情配慮検証
   */
  validateEmotionalCare(expression) {
    const rules = this.validationRules.emotionalCare;
    let score = 100;

    // 厳しい表現のチェック
    const harshCount = rules.harshTerms.filter(term => expression.includes(term)).length;
    score -= harshCount * 20;

    // 配慮表現のボーナス
    const gentleCount = rules.gentleAlternatives.filter(alt => expression.includes(alt)).length;
    score += gentleCount * 10;

    // ポジティブトーンのチェック
    const positiveTerms = ['期待', '向上', '改善', '発展', '成長'];
    const positiveCount = positiveTerms.filter(term => expression.includes(term)).length;
    score += positiveCount * 5;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * 論理的流れ検証
   */
  validateLogicalFlow(expression) {
    let score = 0;

    // 論理的接続詞の存在チェック
    const logicalConnectors = ['そのため', 'したがって', 'その結果', 'により', 'ことから'];
    const hasConnector = logicalConnectors.some(connector => expression.includes(connector));
    if (hasConnector) {
      score += 30;
    }

    // 因果関係の明確性
    if (expression.includes('により') || expression.includes('ため')) {
      score += 25;
    }

    // 結論の明確性
    if (expression.match(/予測されます$|見込まれます$|期待できます$/)) {
      score += 25;
    }

    // 文脈の一貫性
    const consistencyScore = this.checkContextualConsistency(expression);
    score += consistencyScore * 0.2;

    return Math.min(100, score);
  }

  /**
   * 重み付けスコア計算
   */
  calculateWeightedScore(scores) {
    const weights = this.validationRules;
    
    return Math.round(
      (scores.haqei * weights.haqeiConsistency.weight +
       scores.prediction * weights.predictionQuality.weight +
       scores.structural * weights.structuralIntegrity.weight +
       scores.emotional * weights.emotionalCare.weight +
       scores.logical * weights.logicalFlow.weight) / 100
    );
  }

  /**
   * 品質等級決定
   */
  determineQualityGrade(score) {
    const thresholds = this.qualityMetrics.gradeThresholds;
    
    if (score >= thresholds.S) return 'S';
    if (score >= thresholds.A) return 'A';
    if (score >= thresholds.B) return 'B';
    if (score >= thresholds.C) return 'C';
    if (score >= thresholds.D) return 'D';
    return 'F';
  }

  /**
   * 改善提案生成
   */
  generateImprovementSuggestions(scores, expression) {
    const suggestions = [];

    if (scores.haqei < 70) {
      suggestions.push('HaQei用語の言及を追加してください（HaQei分析、HaQeiロジックなど）');
    }

    if (scores.prediction < 70) {
      suggestions.push('予測表現を明確化してください（「予測されます」「期待できます」など）');
    }

    if (scores.structural < 70) {
      if (expression.length < 20) {
        suggestions.push('表現をより詳細にしてください');
      } else if (expression.length > 150) {
        suggestions.push('表現を簡潔にまとめてください');
      }
    }

    if (scores.emotional < 70) {
      suggestions.push('より配慮ある表現に調整してください');
    }

    if (scores.logical < 70) {
      suggestions.push('論理的な接続詞を追加して流れを改善してください');
    }

    return suggestions;
  }

  /**
   * 詳細分析実行
   */
  performDetailedAnalysis(expression, context) {
    return {
      // 基本統計
      statistics: {
        length: expression.length,
        sentenceCount: (expression.match(/[。！？]/g) || []).length,
        wordCount: expression.match(/[\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/g)?.length || 0
      },

      // 語彙分析
      vocabulary: {
        haqeiTerms: (expression.match(/HaQei[^\s、。]*/g) || []).length,
        predictionTerms: this.countPredictionTerms(expression),
        emotionalTerms: this.countEmotionalTerms(expression)
      },

      // 構造分析
      structure: {
        hasIntroduction: expression.startsWith('HaQei'),
        hasConclusion: /予測されます$|見込まれます$|期待できます$/.test(expression),
        logicalFlow: this.analyzeLogicalFlow(expression)
      },

      // コンテキスト適合度
      contextFit: this.analyzeContextFit(expression, context)
    };
  }

  /**
   * 補助メソッド群
   */
  calculateReadabilityScore(text) {
    const avgSentenceLength = text.length / Math.max(1, (text.match(/[。！？]/g) || []).length);
    const complexWords = (text.match(/[分析|予測|推奨|期待|見込]/g) || []).length;
    
    let score = 50;
    if (avgSentenceLength < 30) score += 20;
    if (avgSentenceLength < 50) score += 10;
    if (complexWords <= 3) score += 20;
    
    return Math.min(100, score);
  }

  checkContextualConsistency(expression) {
    const keywords = expression.match(/[\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/g) || [];
    const uniqueKeywords = new Set(keywords);
    
    return Math.min(100, (uniqueKeywords.size / keywords.length) * 100);
  }

  countPredictionTerms(expression) {
    const predictionTerms = ['予測', '見込', '期待', '推奨', '示唆'];
    return predictionTerms.filter(term => expression.includes(term)).length;
  }

  countEmotionalTerms(expression) {
    const emotionalTerms = ['期待', '安心', '希望', '不安', '心配'];
    return emotionalTerms.filter(term => expression.includes(term)).length;
  }

  analyzeLogicalFlow(expression) {
    const hasStart = /^HaQei/.test(expression);
    const hasMiddle = /により|ため|その結果/.test(expression);
    const hasEnd = /予測されます$|見込まれます$/.test(expression);
    
    return {
      hasStart,
      hasMiddle,
      hasEnd,
      score: (hasStart ? 30 : 0) + (hasMiddle ? 40 : 0) + (hasEnd ? 30 : 0)
    };
  }

  analyzeContextFit(expression, context) {
    if (!context.scenarioType) return 50;
    
    // シナリオタイプに応じた適合度評価
    let score = 50;
    
    if (context.scenarioType === 'growth' && expression.includes('成長')) score += 20;
    if (context.scenarioType === 'stability' && expression.includes('安定')) score += 20;
    if (context.scenarioType === 'challenge' && expression.includes('慎重')) score += 20;
    
    return Math.min(100, score);
  }

  /**
   * 検証結果オブジェクト作成
   */
  createValidationResult(score, grade, suggestions, analysis) {
    return {
      overallScore: score,
      grade: grade,
      passed: score >= this.qualityMetrics.gradeThresholds.C,
      suggestions: suggestions,
      analysis: analysis,
      timestamp: new Date().toISOString(),
      version: '2.0.0'
    };
  }

  /**
   * バッチ検証（複数表現）
   */
  validateMultipleExpressions(expressions, context = {}) {
    return expressions.map((expr, index) => ({
      index,
      expression: expr,
      validation: this.validateExpression(expr, context)
    }));
  }

  /**
   * 統計レポート生成
   */
  generateQualityReport(validationResults) {
    const grades = validationResults.map(r => r.validation.grade);
    const scores = validationResults.map(r => r.validation.overallScore);
    
    return {
      totalExpressions: validationResults.length,
      averageScore: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
      gradeDistribution: this.calculateGradeDistribution(grades),
      passRate: Math.round((validationResults.filter(r => r.validation.passed).length / validationResults.length) * 100),
      commonIssues: this.identifyCommonIssues(validationResults)
    };
  }

  calculateGradeDistribution(grades) {
    const distribution = { S: 0, A: 0, B: 0, C: 0, D: 0, F: 0 };
    grades.forEach(grade => distribution[grade]++);
    return distribution;
  }

  identifyCommonIssues(results) {
    const allSuggestions = results.flatMap(r => r.validation.suggestions);
    const issueCount = {};
    
    allSuggestions.forEach(suggestion => {
      issueCount[suggestion] = (issueCount[suggestion] || 0) + 1;
    });
    
    return Object.entries(issueCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([issue, count]) => ({ issue, count }));
  }
}

// グローバルに公開
window.ExpressionQualityValidator = ExpressionQualityValidator;