/**
 * TextAnalyzer.js - Advanced Text Analysis Module
 * 
 * bunenjin哲学による効率的なテキスト分析システム
 * kuromoji.js統合と高度な言語解析機能
 * 
 * Author: HAQEI Programmer Agent
 * Created: 2025-08-06
 * Version: 2.0.0-modular
 */

export class TextAnalyzer {
  constructor(core) {
    this.core = core;
    this.version = "2.0.0-modular";
    this.analysisCache = new Map();
    this.patterns = this.initializePatterns();
    
    console.log('📊 TextAnalyzer v2.0.0 initializing...');
  }

  /**
   * パターン初期化
   */
  initializePatterns() {
    return {
      // 感情パターン
      emotions: {
        positive: {
          keywords: ['良い', '嬉しい', '楽しい', '素晴らしい', '成功', '希望', '幸せ', '満足', '安心', '喜び'],
          expressions: /(?:よかった|嬉しかった|楽しかった|満足)/g,
          weight: 1.0
        },
        negative: {
          keywords: ['悪い', '悲しい', '困る', '問題', '失敗', '不安', '心配', '辛い', '厳しい', '大変'],
          expressions: /(?:困った|悲しかった|大変だった|不安だった)/g,
          weight: 1.0
        },
        neutral: {
          keywords: ['普通', '通常', '一般的', '標準', '平均'],
          expressions: /(?:普通に|いつも通り|特に)/g,
          weight: 0.5
        }
      },

      // 時間表現パターン
      temporal: {
        past: /(?:昨日|先週|先月|去年|以前|過去|前回)/g,
        present: /(?:今日|現在|今|いま|今回)/g,
        future: /(?:明日|来週|来月|来年|将来|未来|これから)/g
      },

      // 行動パターン
      actions: {
        planning: ['計画', '予定', '企画', '準備', '設計'],
        execution: ['実行', '実施', '開始', '進行', '取り組み'],
        evaluation: ['評価', '検証', '確認', '振り返り', '分析']
      },

      // 関係性パターン
      relationships: {
        self: ['自分', '私', '僕', '俺', '個人的'],
        family: ['家族', '両親', '兄弟', '姉妹', '子供'],
        work: ['同僚', '上司', '部下', '会社', '職場'],
        social: ['友人', '知人', '仲間', 'パートナー', '恋人']
      }
    };
  }

  /**
   * 高度テキスト分析実行
   */
  async analyzeAdvanced(text, options = {}) {
    const cacheKey = this.generateCacheKey(text, options);
    
    // キャッシュ確認
    if (this.analysisCache.has(cacheKey)) {
      return this.analysisCache.get(cacheKey);
    }

    try {
      const analysis = await this.performComprehensiveAnalysis(text, options);
      
      // キャッシュに保存
      this.analysisCache.set(cacheKey, analysis);
      
      return analysis;
      
    } catch (error) {
      console.error('❌ Advanced text analysis failed:', error);
      throw error;
    }
  }

  /**
   * 包括的分析実行
   */
  async performComprehensiveAnalysis(text, options) {
    const startTime = performance.now();

    // 基本分析
    const basicAnalysis = await this.performBasicAnalysis(text);
    
    // 高度分析
    const advancedAnalysis = await Promise.all([
      this.analyzeSentimentDeep(text),
      this.analyzeTemporalAspects(text),
      this.analyzeActionPatterns(text),
      this.analyzeRelationships(text),
      this.analyzeIntention(text),
      this.analyzeConcerns(text)
    ]);

    const [sentiment, temporal, actions, relationships, intention, concerns] = advancedAnalysis;

    // 統合結果
    const result = {
      basic: basicAnalysis,
      sentiment,
      temporal,
      actions,
      relationships,
      intention,
      concerns,
      metadata: {
        analysisTime: performance.now() - startTime,
        textLength: text.length,
        complexity: this.calculateTextComplexity(text),
        confidence: this.calculateConfidenceScore(advancedAnalysis)
      }
    };

    return result;
  }

  /**
   * 基本分析
   */
  async performBasicAnalysis(text) {
    if (!this.core.tokenizer) {
      throw new Error('Tokenizer not available');
    }

    const tokens = await this.core.tokenizeText(text);
    
    return {
      tokens,
      wordCount: tokens.length,
      uniqueWords: new Set(tokens.map(t => t.basic_form)).size,
      characters: text.length,
      sentences: this.countSentences(text),
      paragraphs: this.countParagraphs(text)
    };
  }

  /**
   * 深層感情分析
   */
  async analyzeSentimentDeep(text) {
    const emotions = this.patterns.emotions;
    const scores = { positive: 0, negative: 0, neutral: 0 };
    const details = { positive: [], negative: [], neutral: [] };

    // キーワードベース分析
    Object.keys(emotions).forEach(emotion => {
      emotions[emotion].keywords.forEach(keyword => {
        const regex = new RegExp(keyword, 'g');
        const matches = text.match(regex);
        if (matches) {
          scores[emotion] += matches.length * emotions[emotion].weight;
          details[emotion].push(...matches.map(match => ({ keyword: match, type: 'keyword' })));
        }
      });

      // 表現パターン分析
      const expressionMatches = text.match(emotions[emotion].expressions) || [];
      scores[emotion] += expressionMatches.length * emotions[emotion].weight * 1.5;
      details[emotion].push(...expressionMatches.map(match => ({ expression: match, type: 'expression' })));
    });

    // 総合スコア計算
    const total = scores.positive + scores.negative + scores.neutral;
    const normalizedScores = {
      positive: total > 0 ? scores.positive / total : 0,
      negative: total > 0 ? scores.negative / total : 0,
      neutral: total > 0 ? scores.neutral / total : 0
    };

    // 感情の強度
    const intensity = Math.max(scores.positive, scores.negative, scores.neutral);
    
    // 主要感情の判定
    const dominantEmotion = Object.keys(normalizedScores).reduce((a, b) => 
      normalizedScores[a] > normalizedScores[b] ? a : b
    );

    return {
      scores: normalizedScores,
      rawScores: scores,
      details,
      dominantEmotion,
      intensity,
      confidence: this.calculateSentimentConfidence(scores, details)
    };
  }

  /**
   * 時間的側面分析
   */
  async analyzeTemporalAspects(text) {
    const temporal = this.patterns.temporal;
    const aspects = { past: [], present: [], future: [] };
    
    Object.keys(temporal).forEach(timeframe => {
      const matches = text.match(temporal[timeframe]) || [];
      aspects[timeframe] = matches;
    });

    // 時間的焦点の分析
    const focusDistribution = {
      past: aspects.past.length,
      present: aspects.present.length,
      future: aspects.future.length
    };

    const total = Object.values(focusDistribution).reduce((sum, count) => sum + count, 0);
    const normalizedFocus = total > 0 ? Object.fromEntries(
      Object.entries(focusDistribution).map(([key, value]) => [key, value / total])
    ) : { past: 0, present: 0, future: 0 };

    // 主要な時間的焦点
    const primaryFocus = Object.keys(normalizedFocus).reduce((a, b) => 
      normalizedFocus[a] > normalizedFocus[b] ? a : b
    );

    return {
      aspects,
      focusDistribution,
      normalizedFocus,
      primaryFocus,
      temporalComplexity: Object.values(focusDistribution).filter(count => count > 0).length
    };
  }

  /**
   * 行動パターン分析
   */
  async analyzeActionPatterns(text) {
    const actions = this.patterns.actions;
    const detectedActions = { planning: [], execution: [], evaluation: [] };
    
    Object.keys(actions).forEach(actionType => {
      actions[actionType].forEach(keyword => {
        const regex = new RegExp(keyword, 'g');
        const matches = text.match(regex) || [];
        detectedActions[actionType].push(...matches);
      });
    });

    // 行動段階の分析
    const actionStages = {
      planning: detectedActions.planning.length,
      execution: detectedActions.execution.length,
      evaluation: detectedActions.evaluation.length
    };

    const total = Object.values(actionStages).reduce((sum, count) => sum + count, 0);
    const stageDistribution = total > 0 ? Object.fromEntries(
      Object.entries(actionStages).map(([key, value]) => [key, value / total])
    ) : { planning: 0, execution: 0, evaluation: 0 };

    // 現在の行動段階
    const currentStage = Object.keys(stageDistribution).reduce((a, b) => 
      stageDistribution[a] > stageDistribution[b] ? a : b
    );

    return {
      detectedActions,
      actionStages,
      stageDistribution,
      currentStage,
      actionComplexity: Object.values(actionStages).filter(count => count > 0).length
    };
  }

  /**
   * 関係性分析
   */
  async analyzeRelationships(text) {
    const relationships = this.patterns.relationships;
    const detectedRelationships = { self: [], family: [], work: [], social: [] };
    
    Object.keys(relationships).forEach(relType => {
      relationships[relType].forEach(keyword => {
        const regex = new RegExp(keyword, 'g');
        const matches = text.match(regex) || [];
        detectedRelationships[relType].push(...matches);
      });
    });

    // 関係性の分布
    const relationshipDistribution = {
      self: detectedRelationships.self.length,
      family: detectedRelationships.family.length,
      work: detectedRelationships.work.length,
      social: detectedRelationships.social.length
    };

    const total = Object.values(relationshipDistribution).reduce((sum, count) => sum + count, 0);
    const normalizedDistribution = total > 0 ? Object.fromEntries(
      Object.entries(relationshipDistribution).map(([key, value]) => [key, value / total])
    ) : { self: 0, family: 0, work: 0, social: 0 };

    // 主要な関係性
    const primaryRelationship = Object.keys(normalizedDistribution).reduce((a, b) => 
      normalizedDistribution[a] > normalizedDistribution[b] ? a : b
    );

    return {
      detectedRelationships,
      relationshipDistribution,
      normalizedDistribution,
      primaryRelationship,
      relationshipComplexity: Object.values(relationshipDistribution).filter(count => count > 0).length
    };
  }

  /**
   * 意図分析
   */
  async analyzeIntention(text) {
    const intentionPatterns = {
      seeking_advice: /(?:どうしたら|どのように|何をすれば|助けて|相談)/g,
      expressing_concern: /(?:心配|不安|気になる|困っている)/g,
      sharing_experience: /(?:経験した|体験した|感じた|思った)/g,
      planning_action: /(?:しようと思う|予定|計画|するつもり)/g,
      reflecting: /(?:振り返る|考える|思い返す|反省)/g
    };

    const intentions = {};
    let totalMatches = 0;

    Object.keys(intentionPatterns).forEach(intention => {
      const matches = text.match(intentionPatterns[intention]) || [];
      intentions[intention] = {
        count: matches.length,
        matches: matches
      };
      totalMatches += matches.length;
    });

    // 意図の正規化
    const normalizedIntentions = Object.fromEntries(
      Object.entries(intentions).map(([key, value]) => [
        key, 
        { 
          ...value, 
          probability: totalMatches > 0 ? value.count / totalMatches : 0 
        }
      ])
    );

    // 主要意図
    const primaryIntention = Object.keys(normalizedIntentions).reduce((a, b) => 
      normalizedIntentions[a].probability > normalizedIntentions[b].probability ? a : b
    );

    return {
      intentions: normalizedIntentions,
      primaryIntention: totalMatches > 0 ? primaryIntention : 'unknown',
      intentionClarity: totalMatches / Math.max(text.length / 100, 1) // テキスト長に対する意図の明確さ
    };
  }

  /**
   * 関心事分析
   */
  async analyzeConcerns(text) {
    const concernCategories = {
      health: ['健康', '体調', '病気', '治療', '医療', '疲れ', '睡眠'],
      career: ['仕事', '職場', '転職', 'キャリア', '昇進', '業務', '会社'],
      relationships: ['人間関係', '恋愛', '友人', '家族', 'パートナー', '結婚'],
      finance: ['お金', '収入', '支出', '投資', '貯金', '経済', '財政'],
      education: ['勉強', '学習', '教育', 'スキル', '資格', '知識'],
      lifestyle: ['生活', 'ライフスタイル', '趣味', '時間', '自由', 'バランス']
    };

    const concerns = {};
    let totalConcerns = 0;

    Object.keys(concernCategories).forEach(category => {
      let count = 0;
      const foundKeywords = [];
      
      concernCategories[category].forEach(keyword => {
        const regex = new RegExp(keyword, 'g');
        const matches = text.match(regex) || [];
        count += matches.length;
        if (matches.length > 0) {
          foundKeywords.push(...matches);
        }
      });

      concerns[category] = {
        count,
        keywords: foundKeywords,
        weight: count * (category === 'health' ? 1.2 : category === 'relationships' ? 1.1 : 1.0)
      };
      totalConcerns += concerns[category].weight;
    });

    // 関心事の正規化
    const normalizedConcerns = Object.fromEntries(
      Object.entries(concerns).map(([key, value]) => [
        key, 
        { 
          ...value, 
          probability: totalConcerns > 0 ? value.weight / totalConcerns : 0 
        }
      ])
    );

    // 上位関心事
    const topConcerns = Object.entries(normalizedConcerns)
      .sort(([,a], [,b]) => b.probability - a.probability)
      .slice(0, 3)
      .map(([category, data]) => ({ category, ...data }));

    return {
      concerns: normalizedConcerns,
      topConcerns,
      concernDiversity: Object.values(normalizedConcerns).filter(c => c.probability > 0.05).length
    };
  }

  /**
   * 文数カウント
   */
  countSentences(text) {
    return (text.match(/[。！？.!?]/g) || []).length;
  }

  /**
   * 段落数カウント
   */
  countParagraphs(text) {
    return text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  }

  /**
   * テキスト複雑性計算
   */
  calculateTextComplexity(text) {
    const sentences = this.countSentences(text);
    const words = text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF]+|[a-zA-Z0-9]+/g) || [];
    const avgWordsPerSentence = sentences > 0 ? words.length / sentences : 0;
    const avgCharsPerWord = words.length > 0 ? words.reduce((sum, word) => sum + word.length, 0) / words.length : 0;
    
    return {
      sentences,
      words: words.length,
      avgWordsPerSentence,
      avgCharsPerWord,
      complexityScore: (avgWordsPerSentence * 0.4 + avgCharsPerWord * 0.6) / 10
    };
  }

  /**
   * 感情分析信頼度計算
   */
  calculateSentimentConfidence(scores, details) {
    const totalIndicators = Object.values(details).reduce((sum, arr) => sum + arr.length, 0);
    const maxScore = Math.max(...Object.values(scores));
    const scoreVariance = Object.values(scores).reduce((sum, score) => sum + Math.pow(score - maxScore, 2), 0) / Object.values(scores).length;
    
    return Math.min(1.0, (totalIndicators * 0.1 + (1 / (scoreVariance + 0.1)) * 0.1));
  }

  /**
   * 信頼度スコア計算
   */
  calculateConfidenceScore(analyses) {
    const confidenceFactors = [
      analyses[0].confidence || 0.5, // sentiment confidence
      analyses[1].temporalComplexity > 0 ? 0.8 : 0.3, // temporal analysis
      analyses[2].actionComplexity > 0 ? 0.8 : 0.3, // action analysis
      analyses[3].relationshipComplexity > 0 ? 0.8 : 0.3, // relationship analysis
      analyses[4].intentionClarity > 0.1 ? 0.8 : 0.3, // intention clarity
      analyses[5].concernDiversity > 0 ? 0.8 : 0.3 // concern diversity
    ];
    
    return confidenceFactors.reduce((sum, factor) => sum + factor, 0) / confidenceFactors.length;
  }

  /**
   * キャッシュキー生成
   */
  generateCacheKey(text, options) {
    const textHash = text.substring(0, 100).replace(/[^a-zA-Z0-9]/g, '');
    const optionsHash = JSON.stringify(options).replace(/[^a-zA-Z0-9]/g, '');
    return `analysis_${textHash}_${optionsHash}`;
  }

  /**
   * キャッシュクリア
   */
  clearCache() {
    this.analysisCache.clear();
    console.log('🧹 TextAnalyzer cache cleared');
  }

  /**
   * 分析統計取得
   */
  getAnalysisStats() {
    return {
      version: this.version,
      cacheSize: this.analysisCache.size,
      patternsLoaded: Object.keys(this.patterns).length
    };
  }
}

export default TextAnalyzer;