/**
 * SNS文章生成品質検証システム
 * 
 * 目的：
 * - 生成された文章が386爻の本質を正しく反映しているか検証
 * - 不適切な表現や重複の検出
 * - 多様性と一貫性のバランス確認
 * - 学習データとしての品質保証
 * 
 * 主要機能：
 * - 爻の本質との一致度測定
 * - 感情表現の適切性検証
 * - キーワード含有率チェック
 * - 文章の自然さ評価
 * - 統計的品質メトリクス
 * 
 * 前提条件：
 * - HexagramPatternTemplatesが初期化済み
 * - H384_DATAが利用可能
 * - 日本語自然言語処理の基本知識
 */
class QualityValidator {
  constructor() {
    this.patternTemplates = new HexagramPatternTemplates();
    this.validationRules = this.initializeValidationRules();
    this.qualityMetrics = this.initializeQualityMetrics();
    this.inappropriatePatterns = this.initializeInappropriatePatterns();
    this.naturalityCheckers = this.initializeNaturalityCheckers();
  }

  /**
   * 検証ルールの初期化
   * 
   * 目的：
   * - 各検証項目の基準値設定
   * - 閾値の定義
   * - 重み付けの設定
   */
  initializeValidationRules() {
    return {
      // 爻の本質との一致度
      essenceMatch: {
        minScore: 0.6,
        weight: 0.3,
        criteria: {
          keywordMatch: 0.4,    // キーワード一致率
          emotionMatch: 0.3,    // 感情一致率
          situationMatch: 0.3   // 状況説明との一致
        }
      },
      
      // 感情表現の適切性
      emotionAppropriate: {
        minScore: 0.7,
        weight: 0.2,
        criteria: {
          consistency: 0.5,     // 感情の一貫性
          intensity: 0.3,       // 強度の適切性
          authenticity: 0.2     // 自然さ
        }
      },
      
      // 文章の自然さ
      naturality: {
        minScore: 0.7,
        weight: 0.25,
        criteria: {
          grammar: 0.4,         // 文法的正しさ
          fluency: 0.3,         // 流暢さ
          coherence: 0.3        // 一貫性
        }
      },
      
      // 多様性
      diversity: {
        minScore: 0.5,
        weight: 0.15,
        criteria: {
          lexical: 0.5,         // 語彙の多様性
          structural: 0.3,      // 構造の多様性
          semantic: 0.2         // 意味の多様性
        }
      },
      
      // 適切性
      appropriateness: {
        minScore: 0.95,
        weight: 0.1,
        criteria: {
          noInappropriate: 0.7, // 不適切表現なし
          noSensitive: 0.3      // センシティブ内容なし
        }
      }
    };
  }

  /**
   * 品質メトリクスの初期化
   * 
   * 目的：
   * - 統計的指標の定義
   * - 集計方法の設定
   */
  initializeQualityMetrics() {
    return {
      // 基本統計
      basic: {
        totalValidated: 0,
        totalPassed: 0,
        totalFailed: 0,
        averageScore: 0
      },
      
      // カテゴリ別統計
      byCategory: {
        essenceMatch: { passed: 0, failed: 0, avgScore: 0 },
        emotionAppropriate: { passed: 0, failed: 0, avgScore: 0 },
        naturality: { passed: 0, failed: 0, avgScore: 0 },
        diversity: { passed: 0, failed: 0, avgScore: 0 },
        appropriateness: { passed: 0, failed: 0, avgScore: 0 }
      },
      
      // 爻別統計
      byHexagramLine: new Map(), // "hexNum-lineNum" -> metrics
      
      // ペルソナ別統計
      byPersona: {
        young: { passed: 0, failed: 0, avgScore: 0 },
        adult: { passed: 0, failed: 0, avgScore: 0 },
        senior: { passed: 0, failed: 0, avgScore: 0 }
      }
    };
  }

  /**
   * 不適切表現パターンの初期化
   * 
   * 目的：
   * - 除外すべき表現の定義
   * - センシティブな内容の検出
   */
  initializeInappropriatePatterns() {
    return {
      // 暴力的表現
      violence: [
        /殺[す害]/,
        /死[ね亡]/,
        /自殺/,
        /暴[力行]/
      ],
      
      // 差別的表現
      discrimination: [
        // パターンは実装時に慎重に定義
      ],
      
      // 過度にネガティブな表現
      extremeNegative: [
        /絶望的/,
        /最悪すぎ/,
        /人生終/,
        /生きてる意味な/
      ],
      
      // スパム的表現
      spam: [
        /(.)\1{5,}/, // 同じ文字の5回以上の繰り返し
        /[！？]{5,}/, // 記号の過度な繰り返し
      ]
    };
  }

  /**
   * 自然さチェッカーの初期化
   * 
   * 目的：
   * - 日本語として自然な文章かの判定基準
   * - 文法・流暢さのチェック
   */
  initializeNaturalityCheckers() {
    return {
      // 基本的な文構造チェック
      structure: {
        hasSubjectPredicate: (text) => {
          // 主語と述語の存在をチェック（簡易版）
          return /[はがをに]/.test(text) && /[るたいすだ]/.test(text);
        },
        
        balancedParentheses: (text) => {
          // 括弧のバランスチェック
          const pairs = [['「', '」'], ['（', '）'], ['【', '】']];
          for (const [open, close] of pairs) {
            const openCount = (text.match(new RegExp(open, 'g')) || []).length;
            const closeCount = (text.match(new RegExp(close, 'g')) || []).length;
            if (openCount !== closeCount) return false;
          }
          return true;
        }
      },
      
      // 文の長さチェック
      length: {
        notTooShort: (text) => text.length >= 5,
        notTooLong: (text) => text.length <= 200,
        appropriateForSNS: (text) => text.length >= 10 && text.length <= 140
      },
      
      // 文字種のバランス
      characterBalance: {
        hasJapanese: (text) => /[ぁ-んァ-ヶー一-龠]/.test(text),
        notOnlyEmoji: (text) => text.replace(/[\u{1F000}-\u{1F9FF}]/gu, '').length > 5,
        mixedScript: (text) => {
          const hasHiragana = /[ぁ-ん]/.test(text);
          const hasKanji = /[一-龠]/.test(text);
          return hasHiragana; // 最低限ひらがなは必須
        }
      }
    };
  }

  /**
   * 単一文章の検証（メイン関数）
   * 
   * 目的：
   * - 生成された文章の総合的な品質評価
   * - 各検証項目のスコア計算
   * 
   * 入力：
   * - generatedText: 生成された文章データ
   * - template: 対応する爻のテンプレート
   * 
   * 出力：
   * - 検証結果オブジェクト
   */
  validateSingle(generatedText, template) {
    const results = {
      passed: false,
      totalScore: 0,
      scores: {},
      issues: [],
      timestamp: new Date().toISOString()
    };
    
    // 1. 爻の本質との一致度
    const essenceScore = this.validateEssenceMatch(generatedText, template);
    results.scores.essenceMatch = essenceScore;
    
    // 2. 感情表現の適切性
    const emotionScore = this.validateEmotionAppropriate(generatedText, template);
    results.scores.emotionAppropriate = emotionScore;
    
    // 3. 文章の自然さ
    const naturalityScore = this.validateNaturality(generatedText.text);
    results.scores.naturality = naturalityScore;
    
    // 4. 多様性（バッチ検証時に使用）
    results.scores.diversity = 1.0; // 単一検証では満点
    
    // 5. 適切性
    const appropriatenessScore = this.validateAppropriateness(generatedText.text);
    results.scores.appropriateness = appropriatenessScore;
    
    // 総合スコア計算
    results.totalScore = this.calculateTotalScore(results.scores);
    
    // 合格判定
    results.passed = this.isPassed(results.scores, results.totalScore);
    
    // 問題点の抽出
    results.issues = this.extractIssues(results.scores);
    
    // 統計更新
    this.updateMetrics(results, generatedText, template);
    
    return results;
  }

  /**
   * 爻の本質との一致度検証
   * 
   * 目的：
   * - キーワード、感情、状況との一致確認
   * - テンプレートとの整合性評価
   */
  validateEssenceMatch(generatedText, template) {
    const criteria = this.validationRules.essenceMatch.criteria;
    let score = 0;
    
    // キーワード一致率
    const keywordMatch = this.calculateKeywordMatch(
      generatedText.text, 
      template.keyPhrases
    );
    score += keywordMatch * criteria.keywordMatch;
    
    // 感情一致率
    const emotionMatch = this.calculateEmotionMatch(
      generatedText.emotionTags || [],
      template.emotions
    );
    score += emotionMatch * criteria.emotionMatch;
    
    // 状況説明との一致
    const situationMatch = this.calculateSituationMatch(
      generatedText.text,
      template.essence.state
    );
    score += situationMatch * criteria.situationMatch;
    
    return score;
  }

  /**
   * 感情表現の適切性検証
   * 
   * 目的：
   * - 感情の一貫性確認
   * - 強度の適切性評価
   */
  validateEmotionAppropriate(generatedText, template) {
    const criteria = this.validationRules.emotionAppropriate.criteria;
    let score = 0;
    
    // 感情の一貫性
    const consistency = this.checkEmotionConsistency(
      generatedText.text,
      generatedText.emotionLevel,
      template.emotions
    );
    score += consistency * criteria.consistency;
    
    // 強度の適切性
    const intensity = this.checkEmotionIntensity(
      generatedText.text,
      generatedText.emotionLevel
    );
    score += intensity * criteria.intensity;
    
    // 自然さ
    const authenticity = this.checkEmotionAuthenticity(
      generatedText.text,
      generatedText.persona
    );
    score += authenticity * criteria.authenticity;
    
    return score;
  }

  /**
   * 文章の自然さ検証
   * 
   * 目的：
   * - 日本語として自然な文章か確認
   * - 文法・流暢さ・一貫性の評価
   */
  validateNaturality(text) {
    const criteria = this.validationRules.naturality.criteria;
    let score = 0;
    
    // 文法的正しさ
    const grammar = this.checkGrammar(text);
    score += grammar * criteria.grammar;
    
    // 流暢さ
    const fluency = this.checkFluency(text);
    score += fluency * criteria.fluency;
    
    // 一貫性
    const coherence = this.checkCoherence(text);
    score += coherence * criteria.coherence;
    
    return score;
  }

  /**
   * 適切性検証
   * 
   * 目的：
   * - 不適切表現の検出
   * - センシティブ内容のチェック
   */
  validateAppropriateness(text) {
    const criteria = this.validationRules.appropriateness.criteria;
    let score = 1.0; // 減点方式
    
    // 不適切表現チェック
    const inappropriateFound = this.checkInappropriate(text);
    if (inappropriateFound.length > 0) {
      score -= (1 - criteria.noInappropriate);
    }
    
    // センシティブ内容チェック
    const sensitiveFound = this.checkSensitive(text);
    if (sensitiveFound.length > 0) {
      score -= (1 - criteria.noSensitive);
    }
    
    return Math.max(0, score);
  }

  /**
   * バッチ検証
   * 
   * 目的：
   * - 複数文章の一括検証
   * - 多様性の評価
   * - 統計的品質確認
   */
  validateBatch(generatedTexts, template) {
    const batchResults = {
      totalCount: generatedTexts.length,
      passedCount: 0,
      failedCount: 0,
      averageScore: 0,
      diversityScore: 0,
      individualResults: [],
      summary: {}
    };
    
    // 個別検証
    let totalScore = 0;
    for (const text of generatedTexts) {
      const result = this.validateSingle(text, template);
      batchResults.individualResults.push(result);
      
      if (result.passed) {
        batchResults.passedCount++;
      } else {
        batchResults.failedCount++;
      }
      
      totalScore += result.totalScore;
    }
    
    // 平均スコア
    batchResults.averageScore = totalScore / generatedTexts.length;
    
    // 多様性評価
    batchResults.diversityScore = this.calculateDiversityScore(generatedTexts);
    
    // サマリー作成
    batchResults.summary = this.createBatchSummary(batchResults);
    
    return batchResults;
  }

  // ===== 詳細な検証メソッド =====

  /**
   * キーワード一致率計算
   */
  calculateKeywordMatch(text, keyPhrases) {
    if (!keyPhrases || keyPhrases.length === 0) return 0;
    
    let matchCount = 0;
    for (const phrase of keyPhrases) {
      if (text.includes(phrase)) {
        matchCount++;
      }
    }
    
    return matchCount / keyPhrases.length;
  }

  /**
   * 感情一致率計算
   */
  calculateEmotionMatch(textEmotions, templateEmotions) {
    if (!templateEmotions || templateEmotions.length === 0) return 1;
    
    let matchCount = 0;
    for (const emotion of templateEmotions) {
      if (textEmotions.includes(emotion)) {
        matchCount++;
      }
    }
    
    return matchCount / templateEmotions.length;
  }

  /**
   * 状況一致度計算
   */
  calculateSituationMatch(text, situationDescription) {
    // 簡易的な意味的類似度（実際はより高度な手法が必要）
    const keywords = this.extractKeywordsFromSituation(situationDescription);
    return this.calculateKeywordMatch(text, keywords);
  }

  /**
   * 状況説明からキーワード抽出
   */
  extractKeywordsFromSituation(situation) {
    // 重要な名詞・動詞を抽出（簡易版）
    const keywords = [];
    const importantWords = situation.match(/[\u4e00-\u9fa5]{2,}/g) || [];
    
    for (const word of importantWords) {
      if (word.length >= 2 && word.length <= 4) {
        keywords.push(word);
      }
    }
    
    return keywords.slice(0, 5);
  }

  /**
   * 感情の一貫性チェック
   */
  checkEmotionConsistency(text, emotionLevel, emotions) {
    // 感情レベルと実際の表現の一致を確認
    const detectedLevel = this.detectEmotionLevel(text);
    const levelMatch = Math.abs(this.emotionLevelToScore(detectedLevel) - 
                               this.emotionLevelToScore(emotionLevel)) < 0.3;
    
    return levelMatch ? 1.0 : 0.5;
  }

  /**
   * 感情レベル検出
   */
  detectEmotionLevel(text) {
    const highIntensityWords = ['めっちゃ', 'マジで', '超', '最高', '最悪'];
    const mediumIntensityWords = ['かなり', 'けっこう', 'そこそこ'];
    
    for (const word of highIntensityWords) {
      if (text.includes(word)) return 'high';
    }
    
    for (const word of mediumIntensityWords) {
      if (text.includes(word)) return 'medium';
    }
    
    return 'low';
  }

  /**
   * 感情レベルをスコアに変換
   */
  emotionLevelToScore(level) {
    const scores = { low: 0.3, medium: 0.6, high: 0.9 };
    return scores[level] || 0.5;
  }

  /**
   * 感情強度の適切性チェック
   */
  checkEmotionIntensity(text, emotionLevel) {
    const detectedLevel = this.detectEmotionLevel(text);
    return detectedLevel === emotionLevel ? 1.0 : 0.7;
  }

  /**
   * 感情表現の自然さチェック
   */
  checkEmotionAuthenticity(text, persona) {
    // ペルソナに応じた感情表現の自然さを評価
    const style = this.getPersonaStyle(persona);
    let score = 1.0;
    
    // 若年層なのに堅い表現
    if (persona === 'young' && /でございます|存じます/.test(text)) {
      score -= 0.3;
    }
    
    // シニア層なのに若者言葉
    if (persona === 'senior' && /マジ|ヤバ|ガチ/.test(text)) {
      score -= 0.3;
    }
    
    return Math.max(0.3, score);
  }

  /**
   * ペルソナスタイル取得
   */
  getPersonaStyle(persona) {
    const styles = {
      young: { formal: false, emoji: true },
      adult: { formal: true, emoji: false },
      senior: { formal: true, emoji: false }
    };
    return styles[persona] || styles.adult;
  }

  /**
   * 文法チェック
   */
  checkGrammar(text) {
    let score = 1.0;
    
    // 基本的な文構造チェック
    if (!this.naturalityCheckers.structure.hasSubjectPredicate(text)) {
      score -= 0.2;
    }
    
    if (!this.naturalityCheckers.structure.balancedParentheses(text)) {
      score -= 0.1;
    }
    
    return Math.max(0.3, score);
  }

  /**
   * 流暢さチェック
   */
  checkFluency(text) {
    let score = 1.0;
    
    // 文の長さチェック
    if (!this.naturalityCheckers.length.appropriateForSNS(text)) {
      score -= 0.2;
    }
    
    // 同じ文字の過度な繰り返し
    if (/(.)\1{3,}/.test(text)) {
      score -= 0.3;
    }
    
    return Math.max(0.3, score);
  }

  /**
   * 一貫性チェック
   */
  checkCoherence(text) {
    let score = 1.0;
    
    // 文字種のバランス
    if (!this.naturalityCheckers.characterBalance.hasJapanese(text)) {
      score -= 0.5;
    }
    
    if (!this.naturalityCheckers.characterBalance.notOnlyEmoji(text)) {
      score -= 0.3;
    }
    
    return Math.max(0.2, score);
  }

  /**
   * 不適切表現チェック
   */
  checkInappropriate(text) {
    const found = [];
    
    for (const [category, patterns] of Object.entries(this.inappropriatePatterns)) {
      for (const pattern of patterns) {
        if (pattern.test(text)) {
          found.push({ category, pattern: pattern.toString() });
        }
      }
    }
    
    return found;
  }

  /**
   * センシティブ内容チェック
   */
  checkSensitive(text) {
    // 実装は慎重に行う必要がある
    return [];
  }

  /**
   * 総合スコア計算
   */
  calculateTotalScore(scores) {
    let total = 0;
    
    for (const [category, rule] of Object.entries(this.validationRules)) {
      const score = scores[category] || 0;
      total += score * rule.weight;
    }
    
    return total;
  }

  /**
   * 合格判定
   */
  isPassed(scores, totalScore) {
    // 各カテゴリの最低スコアを満たしているか
    for (const [category, rule] of Object.entries(this.validationRules)) {
      const score = scores[category] || 0;
      if (score < rule.minScore) {
        return false;
      }
    }
    
    // 総合スコアが基準以上か
    return totalScore >= 0.7;
  }

  /**
   * 問題点の抽出
   */
  extractIssues(scores) {
    const issues = [];
    
    for (const [category, rule] of Object.entries(this.validationRules)) {
      const score = scores[category] || 0;
      if (score < rule.minScore) {
        issues.push({
          category,
          score,
          minRequired: rule.minScore,
          severity: score < rule.minScore * 0.5 ? 'critical' : 'warning'
        });
      }
    }
    
    return issues;
  }

  /**
   * 多様性スコア計算
   */
  calculateDiversityScore(texts) {
    if (texts.length < 2) return 1.0;
    
    // 語彙の多様性
    const uniqueWords = new Set();
    const totalWords = [];
    
    for (const text of texts) {
      const words = text.text.match(/[\u4e00-\u9fa5]{2,}/g) || [];
      words.forEach(w => {
        uniqueWords.add(w);
        totalWords.push(w);
      });
    }
    
    const lexicalDiversity = uniqueWords.size / totalWords.length;
    
    // 文構造の多様性（簡易版）
    const lengths = texts.map(t => t.text.length);
    const avgLength = lengths.reduce((a, b) => a + b) / lengths.length;
    const lengthVariance = lengths.reduce((sum, len) => 
      sum + Math.pow(len - avgLength, 2), 0) / lengths.length;
    const structuralDiversity = Math.min(1, lengthVariance / 1000);
    
    return lexicalDiversity * 0.7 + structuralDiversity * 0.3;
  }

  /**
   * バッチサマリー作成
   */
  createBatchSummary(batchResults) {
    return {
      passRate: batchResults.passedCount / batchResults.totalCount,
      qualityGrade: this.calculateQualityGrade(batchResults.averageScore),
      diversityGrade: this.calculateDiversityGrade(batchResults.diversityScore),
      recommendations: this.generateRecommendations(batchResults)
    };
  }

  /**
   * 品質グレード計算
   */
  calculateQualityGrade(score) {
    if (score >= 0.9) return 'A+';
    if (score >= 0.85) return 'A';
    if (score >= 0.8) return 'B+';
    if (score >= 0.75) return 'B';
    if (score >= 0.7) return 'C+';
    if (score >= 0.65) return 'C';
    return 'D';
  }

  /**
   * 多様性グレード計算
   */
  calculateDiversityGrade(score) {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    if (score >= 0.4) return 'Fair';
    return 'Poor';
  }

  /**
   * 改善提案生成
   */
  generateRecommendations(batchResults) {
    const recommendations = [];
    
    if (batchResults.passRate < 0.8) {
      recommendations.push('品質基準を満たさない文章が多いです。生成パラメータの調整を検討してください。');
    }
    
    if (batchResults.diversityScore < 0.6) {
      recommendations.push('文章の多様性が不足しています。バリエーションエンジンの設定を見直してください。');
    }
    
    if (batchResults.averageScore < 0.75) {
      recommendations.push('全体的な品質向上が必要です。テンプレートとの整合性を確認してください。');
    }
    
    return recommendations;
  }

  /**
   * メトリクス更新
   */
  updateMetrics(result, generatedText, template) {
    // 基本統計更新
    this.qualityMetrics.basic.totalValidated++;
    if (result.passed) {
      this.qualityMetrics.basic.totalPassed++;
    } else {
      this.qualityMetrics.basic.totalFailed++;
    }
    
    // カテゴリ別統計更新
    for (const [category, score] of Object.entries(result.scores)) {
      const catMetrics = this.qualityMetrics.byCategory[category];
      if (catMetrics) {
        if (score >= this.validationRules[category].minScore) {
          catMetrics.passed++;
        } else {
          catMetrics.failed++;
        }
        // 平均スコア更新（簡易版）
        catMetrics.avgScore = (catMetrics.avgScore * (catMetrics.passed + catMetrics.failed - 1) + score) / 
                             (catMetrics.passed + catMetrics.failed);
      }
    }
    
    // 爻別統計更新
    const hexLineKey = `${template.hexagram}-${template.line}`;
    if (!this.qualityMetrics.byHexagramLine.has(hexLineKey)) {
      this.qualityMetrics.byHexagramLine.set(hexLineKey, {
        passed: 0, failed: 0, avgScore: 0
      });
    }
    const hexMetrics = this.qualityMetrics.byHexagramLine.get(hexLineKey);
    if (result.passed) {
      hexMetrics.passed++;
    } else {
      hexMetrics.failed++;
    }
    
    // ペルソナ別統計更新
    const personaMetrics = this.qualityMetrics.byPersona[generatedText.persona];
    if (personaMetrics) {
      if (result.passed) {
        personaMetrics.passed++;
      } else {
        personaMetrics.failed++;
      }
    }
  }

  /**
   * 統計レポート生成
   */
  generateReport() {
    const report = {
      summary: {
        totalValidated: this.qualityMetrics.basic.totalValidated,
        passRate: this.qualityMetrics.basic.totalPassed / 
                  (this.qualityMetrics.basic.totalValidated || 1),
        averageScore: this.qualityMetrics.basic.averageScore
      },
      byCategory: {},
      topIssues: [],
      recommendations: []
    };
    
    // カテゴリ別分析
    for (const [category, metrics] of Object.entries(this.qualityMetrics.byCategory)) {
      report.byCategory[category] = {
        passRate: metrics.passed / (metrics.passed + metrics.failed || 1),
        averageScore: metrics.avgScore
      };
    }
    
    // 主要な問題点
    report.topIssues = this.identifyTopIssues();
    
    // 改善提案
    report.recommendations = this.generateOverallRecommendations();
    
    return report;
  }

  /**
   * 主要な問題点の特定
   */
  identifyTopIssues() {
    const issues = [];
    
    for (const [category, metrics] of Object.entries(this.qualityMetrics.byCategory)) {
      const passRate = metrics.passed / (metrics.passed + metrics.failed || 1);
      if (passRate < 0.7) {
        issues.push({
          category,
          passRate,
          severity: passRate < 0.5 ? 'critical' : 'warning'
        });
      }
    }
    
    return issues.sort((a, b) => a.passRate - b.passRate).slice(0, 5);
  }

  /**
   * 全体的な改善提案
   */
  generateOverallRecommendations() {
    const recommendations = [];
    const overallPassRate = this.qualityMetrics.basic.totalPassed / 
                           (this.qualityMetrics.basic.totalValidated || 1);
    
    if (overallPassRate < 0.8) {
      recommendations.push({
        priority: 'high',
        message: '全体的な品質向上が必要です。生成アルゴリズムの見直しを推奨します。'
      });
    }
    
    // カテゴリ別の提案
    for (const issue of this.identifyTopIssues()) {
      if (issue.category === 'essenceMatch') {
        recommendations.push({
          priority: 'high',
          message: '爻の本質との一致度が低いです。テンプレートの精度向上が必要です。'
        });
      } else if (issue.category === 'naturality') {
        recommendations.push({
          priority: 'medium',
          message: '文章の自然さに問題があります。言語モデルの調整を検討してください。'
        });
      }
    }
    
    return recommendations;
  }
}

// グローバルスコープにエクスポート
if (typeof window !== 'undefined') {
  window.QualityValidator = QualityValidator;
}