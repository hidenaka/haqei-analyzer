/**
 * Expression Variation Engine
 * Phase 2 Task 2.2: 表現バリエーション強化
 * 
 * @version 2.0.0
 * @date 2025-08-16
 */

class ExpressionVariationEngine {
  constructor() {
    this.variationPatterns = this.initializeVariationPatterns();
    this.differentiationAlgorithm = new DifferentiationAlgorithm();
    this.contentDiversifier = new ContentDiversificationEngine();
    this.emotionalCareExpander = new EmotionalCareExpansion();
    console.log('🎨 ExpressionVariationEngine initialized with advanced diversification');
  }

  /**
   * バリエーションパターン初期化
   */
  initializeVariationPatterns() {
    return {
      // 表現スタイルバリエーション
      expressionStyles: {
        analytical: {
          prefix: 'HaQei分析によると',
          connector: 'このため',
          conclusion: 'という結果が導き出されます'
        },
        intuitive: {
          prefix: 'HaQeiの智慧では',
          connector: 'その結果',
          conclusion: 'ということが示されています'
        },
        practical: {
          prefix: 'HaQei実践論では',
          connector: 'したがって',
          conclusion: 'という道筋が推奨されます'
        },
        philosophical: {
          prefix: 'HaQei哲学において',
          connector: 'すなわち',
          conclusion: 'という洞察が得られます'
        }
      },

      // 説明深度レベル
      depthLevels: {
        surface: {
          detail: 0.3,
          complexity: 'simple',
          focus: 'result'
        },
        moderate: {
          detail: 0.6,
          complexity: 'balanced',
          focus: 'process'
        },
        deep: {
          detail: 0.9,
          complexity: 'comprehensive',
          focus: 'analysis'
        }
      },

      // 感情配慮バリエーション
      emotionalVariations: {
        encouraging: {
          tone: 'positive',
          keywords: ['期待', '可能性', '発展', '向上'],
          modifiers: ['順調に', '着実に', '確実に']
        },
        reassuring: {
          tone: 'stable',
          keywords: ['安定', '継続', '維持', '持続'],
          modifiers: ['安心して', '穏やかに', '堅実に']
        },
        motivating: {
          tone: 'dynamic',
          keywords: ['挑戦', '成長', '進歩', '飛躍'],
          modifiers: ['積極的に', '意欲的に', 'エネルギッシュに']
        },
        cautious: {
          tone: 'careful',
          keywords: ['注意', '慎重', '配慮', '検討'],
          modifiers: ['慎重に', '丁寧に', '注意深く']
        }
      },

      // 時制・側面バリエーション
      perspectiveVariations: {
        temporal: ['現在の状況として', '将来の展望として', '過程の分析として'],
        scope: ['全体的に見ると', '個別に考えると', '総合的に判断すると'],
        certainty: ['確実に', 'おそらく', '可能性として', '期待として']
      }
    };
  }

  /**
   * 表現バリエーション生成メイン
   */
  generateVariation(baseExpression, scenarioId, variationLevel = 'moderate') {
    // 基本表現分析
    const expressionAnalysis = this.analyzeBaseExpression(baseExpression);
    
    // 差別化アルゴリズム適用
    const differentiationStrategy = this.differentiationAlgorithm.determineDifferentiation(
      scenarioId, expressionAnalysis
    );
    
    // コンテンツ多様化適用
    const diversifiedContent = this.contentDiversifier.diversifyContent(
      baseExpression, differentiationStrategy, variationLevel
    );
    
    // 感情配慮表現拡張
    const emotionallyEnhanced = this.emotionalCareExpander.expandEmotionalCare(
      diversifiedContent, expressionAnalysis
    );
    
    return {
      variation: emotionallyEnhanced,
      strategy: differentiationStrategy,
      originalAnalysis: expressionAnalysis,
      variationMetrics: this.calculateVariationMetrics(baseExpression, emotionallyEnhanced)
    };
  }

  /**
   * 基本表現分析
   */
  analyzeBaseExpression(expression) {
    return {
      length: expression.length,
      complexity: this.calculateComplexity(expression),
      tone: this.detectTone(expression),
      haqeiMentions: (expression.match(/HaQei/g) || []).length,
      predictionElements: this.extractPredictionElements(expression),
      emotionalIndicators: this.extractEmotionalIndicators(expression),
      structuralElements: this.analyzeStructure(expression)
    };
  }

  /**
   * 複雑度計算
   */
  calculateComplexity(text) {
    const sentenceCount = (text.match(/[。！？]/g) || []).length;
    const averageWordsPerSentence = text.length / Math.max(sentenceCount, 1);
    const complexWords = (text.match(/[分析|予測|推奨|期待|見込]/g) || []).length;
    
    const complexityScore = (averageWordsPerSentence * 0.3) + (complexWords * 0.7);
    
    if (complexityScore > 20) return 'high';
    if (complexityScore > 10) return 'medium';
    return 'low';
  }

  /**
   * トーン検出
   */
  detectTone(text) {
    const positiveWords = ['期待', '改善', '発展', '成功', '向上', '順調'];
    const negativeWords = ['困難', '注意', '慎重', 'リスク', '問題'];
    const neutralWords = ['分析', '予測', '状況', '変化', '調整'];

    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;
    const neutralCount = neutralWords.filter(word => text.includes(word)).length;

    if (positiveCount > negativeCount && positiveCount > neutralCount) return 'positive';
    if (negativeCount > positiveCount && negativeCount > neutralCount) return 'negative';
    return 'neutral';
  }

  /**
   * 予測要素抽出
   */
  extractPredictionElements(text) {
    const predictionPatterns = [
      '予測されます', '見込まれます', '期待できます', '推奨されます',
      'と考えられます', 'ことが示されています'
    ];
    
    return predictionPatterns.filter(pattern => text.includes(pattern));
  }

  /**
   * 感情的指標抽出
   */
  extractEmotionalIndicators(text) {
    const emotionalWords = {
      positive: ['期待', '喜び', '希望', '安心', '満足'],
      negative: ['不安', '心配', '困惑', '懸念'],
      neutral: ['状況', '分析', '検討', '評価']
    };

    const indicators = {};
    Object.keys(emotionalWords).forEach(category => {
      indicators[category] = emotionalWords[category].filter(word => text.includes(word)).length;
    });

    return indicators;
  }

  /**
   * 構造分析
   */
  analyzeStructure(text) {
    return {
      hasIntroduction: text.includes('HaQei'),
      hasConclusion: text.includes('予測され') || text.includes('見込まれ'),
      hasExplanation: text.includes('ため') || text.includes('により'),
      sentenceCount: (text.match(/[。！？]/g) || []).length,
      paragraphStyle: text.length > 50 ? 'detailed' : 'concise'
    };
  }

  /**
   * バリエーション指標計算
   */
  calculateVariationMetrics(original, variation) {
    const lengthDifference = Math.abs(variation.length - original.length) / original.length;
    const wordOverlap = this.calculateWordOverlap(original, variation);
    const structuralSimilarity = this.calculateStructuralSimilarity(original, variation);
    
    return {
      lengthDifference: Math.round(lengthDifference * 100),
      wordOverlap: Math.round(wordOverlap * 100),
      structuralSimilarity: Math.round(structuralSimilarity * 100),
      diversityScore: Math.round((1 - wordOverlap) * 100),
      qualityScore: this.calculateQualityScore(variation)
    };
  }

  /**
   * 単語重複計算
   */
  calculateWordOverlap(text1, text2) {
    const words1 = new Set(text1.match(/[\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/g) || []);
    const words2 = new Set(text2.match(/[\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/g) || []);
    
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  /**
   * 構造類似度計算
   */
  calculateStructuralSimilarity(text1, text2) {
    const struct1 = this.analyzeStructure(text1);
    const struct2 = this.analyzeStructure(text2);
    
    let similarities = 0;
    let total = 0;
    
    ['hasIntroduction', 'hasConclusion', 'hasExplanation'].forEach(key => {
      total++;
      if (struct1[key] === struct2[key]) similarities++;
    });
    
    return total > 0 ? similarities / total : 0;
  }

  /**
   * 品質スコア計算
   */
  calculateQualityScore(text) {
    let score = 50; // ベーススコア
    
    // HaQei言及があるか
    if (text.includes('HaQei')) score += 20;
    
    // 予測表現があるか
    if (text.includes('予測され') || text.includes('見込まれ')) score += 15;
    
    // 文章の長さが適切か
    if (text.length >= 30 && text.length <= 100) score += 10;
    
    // 複雑度が適切か
    const complexity = this.calculateComplexity(text);
    if (complexity === 'medium') score += 5;
    
    return Math.min(100, score);
  }
}

/**
 * 差別化アルゴリズム
 */
class DifferentiationAlgorithm {
  constructor() {
    this.differentiationStrategies = this.initializeStrategies();
  }

  initializeStrategies() {
    return {
      // 8シナリオ用差別化戦略
      scenarioStrategies: [
        { id: 1, style: 'analytical', depth: 'moderate', emotion: 'encouraging' },
        { id: 2, style: 'intuitive', depth: 'deep', emotion: 'motivating' },
        { id: 3, style: 'practical', depth: 'surface', emotion: 'reassuring' },
        { id: 4, style: 'philosophical', depth: 'moderate', emotion: 'cautious' },
        { id: 5, style: 'analytical', depth: 'deep', emotion: 'encouraging' },
        { id: 6, style: 'practical', depth: 'moderate', emotion: 'motivating' },
        { id: 7, style: 'intuitive', depth: 'surface', emotion: 'reassuring' },
        { id: 8, style: 'philosophical', depth: 'deep', emotion: 'cautious' }
      ]
    };
  }

  determineDifferentiation(scenarioId, expressionAnalysis) {
    const scenarioIndex = (scenarioId - 1) % 8;
    const baseStrategy = this.differentiationStrategies.scenarioStrategies[scenarioIndex];
    
    // 表現分析結果に基づく調整
    const adjustedStrategy = this.adjustStrategyByAnalysis(baseStrategy, expressionAnalysis);
    
    return {
      ...adjustedStrategy,
      differentiationLevel: this.calculateDifferentiationLevel(scenarioId),
      targetDiversity: this.calculateTargetDiversity(scenarioId)
    };
  }

  adjustStrategyByAnalysis(baseStrategy, analysis) {
    const adjusted = { ...baseStrategy };
    
    // 既存の複雑度に基づく調整
    if (analysis.complexity === 'high') {
      adjusted.depth = 'surface'; // 複雑度を下げる
    } else if (analysis.complexity === 'low') {
      adjusted.depth = 'deep'; // 複雑度を上げる
    }
    
    // 既存のトーンに基づく調整
    if (analysis.tone === 'positive') {
      adjusted.emotion = 'encouraging';
    } else if (analysis.tone === 'negative') {
      adjusted.emotion = 'reassuring';
    }
    
    return adjusted;
  }

  calculateDifferentiationLevel(scenarioId) {
    // シナリオIDに基づく差別化レベル設定
    const levels = ['subtle', 'moderate', 'strong', 'maximum'];
    return levels[(scenarioId - 1) % 4];
  }

  calculateTargetDiversity(scenarioId) {
    // 目標多様性スコア（70%以下達成のため）
    return Math.max(30, 70 - (scenarioId * 5)); // シナリオごとに調整
  }
}

/**
 * コンテンツ多様化エンジン
 */
class ContentDiversificationEngine {
  constructor() {
    this.templates = this.initializeTemplates();
  }

  initializeTemplates() {
    return {
      introduction: [
        'HaQei分析によると',
        'HaQeiの智慧では',
        'HaQei実践論では',
        'HaQei哲学において',
        'HaQeiロジックでは'
      ],
      transition: [
        'このため',
        'その結果',
        'したがって',
        'すなわち',
        'それにより'
      ],
      conclusion: [
        'という結果が導き出されます',
        'ということが示されています',
        'という道筋が推奨されます',
        'という洞察が得られます',
        'ということが予測されます'
      ]
    };
  }

  diversifyContent(baseExpression, strategy, variationLevel) {
    // 戦略に基づくテンプレート選択
    const selectedTemplates = this.selectTemplatesByStrategy(strategy);
    
    // バリエーションレベルに基づく変更度合い調整
    const changeIntensity = this.getChangeIntensity(variationLevel);
    
    // コンテンツ変換適用
    let diversified = this.applyContentTransformation(
      baseExpression, selectedTemplates, changeIntensity
    );
    
    // 追加的多様化
    diversified = this.applyAdditionalDiversification(diversified, strategy);
    
    return diversified;
  }

  selectTemplatesByStrategy(strategy) {
    const styleIndex = ['analytical', 'intuitive', 'practical', 'philosophical'].indexOf(strategy.style) || 0;
    
    return {
      introduction: this.templates.introduction[styleIndex] || this.templates.introduction[0],
      transition: this.templates.transition[styleIndex] || this.templates.transition[0],
      conclusion: this.templates.conclusion[styleIndex] || this.templates.conclusion[0]
    };
  }

  getChangeIntensity(variationLevel) {
    const intensityMap = {
      'subtle': 0.3,
      'moderate': 0.6,
      'strong': 0.8,
      'maximum': 1.0
    };
    return intensityMap[variationLevel] || 0.6;
  }

  applyContentTransformation(text, templates, intensity) {
    let transformed = text;
    
    // HaQei導入部の変更
    if (this.rng.next() < intensity) {
      transformed = transformed.replace(/HaQei[^、]*?では?[、]/g, `${templates.introduction}、`);
    }
    
    // 接続詞の変更
    if (this.rng.next() < intensity * 0.8) {
      transformed = transformed.replace(/[、。]([^。]*?)予測され/g, `。${templates.transition}$1予測され`);
    }
    
    // 結論部の変更
    if (this.rng.next() < intensity * 0.9) {
      transformed = transformed.replace(/予測されます$/, templates.conclusion);
      transformed = transformed.replace(/見込まれます$/, templates.conclusion);
    }
    
    return transformed;
  }

  applyAdditionalDiversification(text, strategy) {
    // 深度レベルに基づく詳細度調整
    if (strategy.depth === 'deep') {
      text = this.expandDetails(text);
    } else if (strategy.depth === 'surface') {
      text = this.simplifyExpression(text);
    }
    
    // 差別化レベルに基づく追加変更
    if (strategy.differentiationLevel === 'maximum') {
      text = this.applyMaximumDifferentiation(text);
    }
    
    return text;
  }

  expandDetails(text) {
    // 詳細説明の追加
    const expansions = [
      '詳細な分析により、',
      '多角的な検討の結果、',
      '包括的な評価として、'
    ];
    const randomExpansion = expansions[Math.floor(this.rng.next() * expansions.length)];
    return text.replace('HaQei', `${randomExpansion}HaQei`);
  }

  simplifyExpression(text) {
    // 表現の簡素化
    return text
      .replace(/詳細な|包括的な|多角的な/g, '')
      .replace(/、[^、]*?により/g, 'により')
      .replace(/\s+/g, ' ');
  }

  applyMaximumDifferentiation(text) {
    // 最大差別化の適用
    const alternativeExpressions = {
      '状況': '局面',
      '改善': '向上',
      '予測': '見通し',
      '期待': '展望',
      '可能性': 'ポテンシャル'
    };
    
    Object.entries(alternativeExpressions).forEach(([original, alternative]) => {
      if (this.rng.next() < 0.6) {
        text = text.replace(new RegExp(original, 'g'), alternative);
      }
    });
    
    return text;
  }
}

/**
 * 感情配慮表現拡張
 */
class EmotionalCareExpansion {
  constructor() {
    this.carePatterns = this.initializeCarePatterns();
  }

  initializeCarePatterns() {
    return {
      softening: {
        harsh: ['失敗', '困難', '問題', '危険'],
        gentle: ['課題', '調整期', '注意点', '慎重期']
      },
      encouragement: {
        neutral: ['変化', '状況', '結果'],
        positive: ['発展', '成長', '向上']
      },
      reassurance: {
        uncertain: ['可能性', 'かもしれません'],
        confident: ['見込み', 'ことが期待されます']
      }
    };
  }

  expandEmotionalCare(text, expressionAnalysis) {
    let enhanced = text;
    
    // 感情的指標に基づく配慮適用
    if (expressionAnalysis.emotionalIndicators.negative > 0) {
      enhanced = this.applySoftening(enhanced);
    }
    
    if (expressionAnalysis.tone === 'neutral') {
      enhanced = this.applyEncouragement(enhanced);
    }
    
    if (expressionAnalysis.predictionElements.length === 0) {
      enhanced = this.applyReassurance(enhanced);
    }
    
    // 追加的感情配慮
    enhanced = this.applyContextualCare(enhanced, expressionAnalysis);
    
    return enhanced;
  }

  applySoftening(text) {
    Object.entries(this.carePatterns.softening).forEach(([category, words]) => {
      if (category === 'harsh') {
        words.forEach((word, index) => {
          const gentleWord = this.carePatterns.softening.gentle[index];
          if (gentleWord) {
            text = text.replace(new RegExp(word, 'g'), gentleWord);
          }
        });
      }
    });
    return text;
  }

  applyEncouragement(text) {
    Object.entries(this.carePatterns.encouragement.neutral).forEach((word, index) => {
      const positiveWord = this.carePatterns.encouragement.positive[index];
      if (positiveWord && this.rng.next() < 0.4) {
        text = text.replace(new RegExp(word, 'g'), positiveWord);
      }
    });
    return text;
  }

  applyReassurance(text) {
    this.carePatterns.reassurance.uncertain.forEach((uncertain, index) => {
      const confident = this.carePatterns.reassurance.confident[index];
      if (confident) {
        text = text.replace(new RegExp(uncertain, 'g'), confident);
      }
    });
    return text;
  }

  applyContextualCare(text, analysis) {
    // 文脈に応じた配慮
    if (analysis.complexity === 'high') {
      text = text.replace(/^/, '分かりやすく言うと、');
    }
    
    if (analysis.length > 80) {
      text = this.addBreathingSpace(text);
    }
    
    return text;
  }

  addBreathingSpace(text) {
    // 長い文章に息継ぎを追加
    return text.replace(/。([^。]{20,})/g, '。 $1');
  }
}

// グローバルに公開
window.ExpressionVariationEngine = ExpressionVariationEngine;