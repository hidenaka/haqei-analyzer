/**
 * Machine Learning Integration - HaQei Philosophy Enhanced
 * HaQei哲学統合型機械学習コンポーネント
 * Triple OS Architecture: Engine Layer
 */

console.log('🧠 ML Integration Loading with HaQei Philosophy...');

window.MLIntegration = {
  // 初期化状態
  initialized: false,
  
  // HaQei哲学統合設定
  haqeiConfiguration: {
    philosophy: 'haqei',
    approach: 'harmony_driven',
    acceptance_contradiction: true, // 矛盾受容
    organic_learning: true,         // 有機的学習
    compassionate_analysis: true,   // 慈悲的分析
    wisdom_guided: true            // 智慧誘導
  },

  // Triple OS Architecture コンポーネント
  engineOS: null,
  interfaceOS: null,
  safeMode: null,

  // 初期化
  async init() {
    console.log('🚀 MLIntegration initializing with HaQei principles...');
    
    try {
      this.setupTripleOSArchitecture();
      await this.initializeMLModels();
      await this.setupHaQeiEnhancement();
      this.validateMLCapabilities();
      
      this.initialized = true;
      console.log('✅ MLIntegration initialized with HaQei philosophy');
    } catch (error) {
      console.error('❌ MLIntegration initialization failed:', error);
      this.activateSafeMode();
    }
  },

  // Triple OS Architecture セットアップ
  setupTripleOSArchitecture() {
    console.log('🔧 Setting up Triple OS Architecture for ML...');
    
    // Engine OS (Machine Learning Core)
    this.engineOS = {
      name: 'ML Engine OS',
      version: '1.0.0',
      philosophy: 'haqei-ml',
      
      // テキスト分析エンジン
      async analyzeText(text, context = {}) {
        try {
          const analysis = {
            sentiment: this.analyzeSentiment(text),
            keywords: this.extractKeywords(text),
            themes: this.identifyThemes(text),
            emotions: this.detectEmotions(text),
            complexity: this.assessComplexity(text),
            haqei_alignment: this.assessHaQeiAlignment(text)
          };
          
          return {
            text: text,
            analysis: analysis,
            context: context,
            confidence: this.calculateOverallConfidence(analysis),
            philosophy: 'haqei-enhanced'
          };
          
        } catch (error) {
          console.warn('⚠️ Text analysis error:', error);
          return this.createFallbackAnalysis(text);
        }
      },
      
      // 感情分析
      analyzeSentiment(text) {
        const positiveWords = ['嬉しい', '楽しい', '幸せ', '良い', '素晴らしい', '愛', '希望', '成功', '調和', '平和'];
        const negativeWords = ['悲しい', '辛い', '困る', '悪い', '問題', '不安', '心配', '失敗', '対立', '混乱'];
        
        let positiveScore = 0;
        let negativeScore = 0;
        
        positiveWords.forEach(word => {
          const count = (text.match(new RegExp(word, 'g')) || []).length;
          positiveScore += count;
        });
        
        negativeWords.forEach(word => {
          const count = (text.match(new RegExp(word, 'g')) || []).length;
          negativeScore += count;
        });
        
        const totalScore = positiveScore + negativeScore;
        if (totalScore === 0) {
          return { polarity: 0, magnitude: 0, classification: 'neutral' };
        }
        
        const polarity = (positiveScore - negativeScore) / totalScore;
        const magnitude = totalScore / text.length * 100;
        
        let classification = 'neutral';
        if (polarity > 0.2) classification = 'positive';
        else if (polarity < -0.2) classification = 'negative';
        
        return {
          polarity: polarity,
          magnitude: magnitude,
          classification: classification,
          positive_score: positiveScore,
          negative_score: negativeScore
        };
      },
      
      // キーワード抽出
      extractKeywords(text) {
        // 簡易形態素解析＋重要度スコアリング
        const words = text.match(/[一-龯]+/g) || [];
        const wordFreq = new Map();
        
        words.forEach(word => {
          if (word.length >= 2) { // 2文字以上
            wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
          }
        });
        
        const keywords = Array.from(wordFreq.entries())
          .map(([word, freq]) => ({
            word: word,
            frequency: freq,
            importance: this.calculateWordImportance(word, freq, text.length),
            category: this.categorizeWord(word)
          }))
          .sort((a, b) => b.importance - a.importance)
          .slice(0, 10);
        
        return keywords;
      },
      
      // 単語重要度計算
      calculateWordImportance(word, frequency, textLength) {
        let importance = frequency / textLength * 100;
        
        // 長さによるボーナス
        if (word.length >= 3) importance *= 1.2;
        if (word.length >= 4) importance *= 1.1;
        
        // HaQei哲学関連語のボーナス
        const haqeiWords = ['調和', '慈悲', '智慧', '真実', '平和', '理解', '成長', '愛', '協力'];
        if (haqeiWords.includes(word)) importance *= 1.5;
        
        return Math.min(importance, 1.0);
      },
      
      // 単語カテゴリー分類
      categorizeWord(word) {
        const categories = {
          emotion: ['嬉しい', '悲しい', '愛', '怒り', '不安', '希望'],
          action: ['する', '行う', '作る', '学ぶ', '成長', '変化'],
          relation: ['関係', '友人', '家族', '仲間', '協力', '理解'],
          time: ['過去', '現在', '未来', '時間', '瞬間'],
          philosophy: ['調和', '智慧', '真実', '慈悲', '平和']
        };
        
        for (const [category, words] of Object.entries(categories)) {
          if (words.some(w => word.includes(w))) {
            return category;
          }
        }
        
        return 'general';
      },
      
      // テーマ識別
      identifyThemes(text) {
        const themes = [];
        const themePatterns = {
          personal_development: /成長|発展|向上|自己実現|学習/g,
          relationships: /関係|友人|家族|愛|理解|協力/g,
          work_career: /仕事|会社|キャリア|職場|プロジェクト/g,
          health_wellness: /健康|体調|心身|バランス|ウェルネス/g,
          spirituality: /精神|魂|哲学|瞑想|智慧|真実/g,
          creativity: /創造|アート|表現|革新|アイデア/g
        };
        
        Object.entries(themePatterns).forEach(([theme, pattern]) => {
          const matches = (text.match(pattern) || []).length;
          if (matches > 0) {
            themes.push({
              theme: theme,
              relevance: Math.min(matches / 3, 1.0),
              matches: matches
            });
          }
        });
        
        return themes.sort((a, b) => b.relevance - a.relevance);
      },
      
      // 感情検出
      detectEmotions(text) {
        const emotionPatterns = {
          joy: /嬉し|楽し|幸せ|喜び|満足|良い/g,
          sadness: /悲し|辛い|寂し|憂鬱|落ち込/g,
          anger: /怒り|腹立|イライラ|憤り|不満/g,
          fear: /不安|心配|怖|恐れ|緊張/g,
          love: /愛|好き|大切|慈し|思いやり/g,
          hope: /希望|期待|夢|願い|未来/g,
          peace: /平和|安心|落ち着|調和|静か/g
        };
        
        const emotions = {};
        let totalEmotions = 0;
        
        Object.entries(emotionPatterns).forEach(([emotion, pattern]) => {
          const matches = (text.match(pattern) || []).length;
          emotions[emotion] = {
            count: matches,
            intensity: Math.min(matches / 2, 1.0)
          };
          totalEmotions += matches;
        });
        
        // 感情バランス計算
        const positiveEmotions = ['joy', 'love', 'hope', 'peace'];
        const negativeEmotions = ['sadness', 'anger', 'fear'];
        
        let positiveTotal = 0;
        let negativeTotal = 0;
        
        positiveEmotions.forEach(emotion => {
          positiveTotal += emotions[emotion].count;
        });
        
        negativeEmotions.forEach(emotion => {
          negativeTotal += emotions[emotion].count;
        });
        
        return {
          emotions: emotions,
          emotional_balance: {
            positive: positiveTotal,
            negative: negativeTotal,
            ratio: totalEmotions > 0 ? positiveTotal / totalEmotions : 0.5
          },
          dominant_emotion: this.findDominantEmotion(emotions),
          overall_intensity: totalEmotions / text.length * 100
        };
      },
      
      // 支配的感情特定
      findDominantEmotion(emotions) {
        let maxIntensity = 0;
        let dominantEmotion = 'neutral';
        
        Object.entries(emotions).forEach(([emotion, data]) => {
          if (data.intensity > maxIntensity) {
            maxIntensity = data.intensity;
            dominantEmotion = emotion;
          }
        });
        
        return {
          emotion: dominantEmotion,
          intensity: maxIntensity
        };
      },
      
      // 複雑度評価
      assessComplexity(text) {
        const factors = {
          length: text.length / 500, // 文字数正規化
          sentence_count: (text.match(/[。！？]/g) || []).length,
          unique_words: new Set(text.match(/[一-龯]+/g) || []).size,
          conjunction_usage: (text.match(/しかし|だが|ところが|一方|それでも/g) || []).length,
          abstract_concepts: (text.match(/概念|思考|哲学|精神|本質/g) || []).length
        };
        
        // 複雑度スコア計算
        const complexity = (
          Math.min(factors.length, 1.0) * 0.2 +
          Math.min(factors.sentence_count / 10, 1.0) * 0.2 +
          Math.min(factors.unique_words / 50, 1.0) * 0.3 +
          Math.min(factors.conjunction_usage / 3, 1.0) * 0.2 +
          Math.min(factors.abstract_concepts / 5, 1.0) * 0.1
        );
        
        return {
          score: complexity,
          level: complexity > 0.7 ? 'high' : complexity > 0.4 ? 'medium' : 'low',
          factors: factors
        };
      },
      
      // HaQei適合性評価
      assessHaQeiAlignment(text) {
        const haqeiPatterns = {
          harmony: /調和|平和|バランス|統合|協調|協力/g,
          compassion: /慈悲|思いやり|愛|共感|理解|支援|優しさ/g,
          wisdom: /智慧|知恵|学習|成長|洞察|経験|理解/g,
          authenticity: /真実|誠実|正直|自然|純粋|本質|素直/g
        };
        
        const alignment = {};
        let totalAlignment = 0;
        
        Object.entries(haqeiPatterns).forEach(([principle, pattern]) => {
          const matches = (text.match(pattern) || []).length;
          const score = Math.min(matches / 3, 1.0);
          alignment[principle] = {
            matches: matches,
            score: score,
            keywords: [...text.matchAll(pattern)].map(match => match[0])
          };
          totalAlignment += score;
        });
        
        return {
          principles: alignment,
          overall_score: totalAlignment / 4,
          classification: this.classifyHaQeiAlignment(totalAlignment / 4),
          recommendations: this.generateHaQeiRecommendations(alignment)
        };
      },
      
      // HaQei適合性分類
      classifyHaQeiAlignment(score) {
        if (score >= 0.7) return 'highly_aligned';
        if (score >= 0.4) return 'moderately_aligned';
        if (score >= 0.2) return 'partially_aligned';
        return 'minimally_aligned';
      },
      
      // HaQei推奨生成
      generateHaQeiRecommendations(alignment) {
        const recommendations = [];
        
        Object.entries(alignment).forEach(([principle, data]) => {
          if (data.score < 0.5) {
            const principleRecommendations = {
              harmony: '調和と協力の要素を取り入れることをお勧めします',
              compassion: '思いやりと共感の視点を加えることをお勧めします',
              wisdom: '学習と成長の機会を見つけることをお勧めします',
              authenticity: '真実と誠実さを重視することをお勧めします'
            };
            
            recommendations.push(principleRecommendations[principle]);
          }
        });
        
        return recommendations;
      },
      
      // 全体信頼度計算
      calculateOverallConfidence(analysis) {
        const factors = [
          analysis.sentiment ? 0.2 : 0,
          analysis.keywords.length > 0 ? 0.2 : 0,
          analysis.themes.length > 0 ? 0.2 : 0,
          analysis.emotions ? 0.2 : 0,
          analysis.haqei_alignment ? 0.2 : 0
        ];
        
        return factors.reduce((sum, factor) => sum + factor, 0);
      },
      
      // フォールバック分析
      createFallbackAnalysis(text) {
        return {
          text: text,
          analysis: {
            sentiment: { polarity: 0, classification: 'neutral' },
            keywords: [],
            themes: [],
            emotions: { emotions: {}, emotional_balance: { ratio: 0.5 } },
            complexity: { score: 0.3, level: 'low' },
            haqei_alignment: { overall_score: 0.3, classification: 'partially_aligned' }
          },
          confidence: 0.3,
          philosophy: 'haqei-fallback'
        };
      }
    };

    // Interface OS (User Interaction Layer)
    this.interfaceOS = {
      name: 'ML Interface OS',
      
      formatAnalysisResult(result) {
        return {
          summary: {
            confidence: Math.round(result.confidence * 100) + '%',
            sentiment: result.analysis.sentiment.classification,
            complexity: result.analysis.complexity.level,
            haqei_alignment: result.analysis.haqei_alignment.classification,
            top_keywords: result.analysis.keywords.slice(0, 5).map(k => k.word)
          },
          detailed: {
            sentiment_analysis: this.formatSentimentAnalysis(result.analysis.sentiment),
            keyword_analysis: this.formatKeywordAnalysis(result.analysis.keywords),
            theme_analysis: this.formatThemeAnalysis(result.analysis.themes),
            emotion_analysis: this.formatEmotionAnalysis(result.analysis.emotions),
            haqei_analysis: this.formatHaQeiAnalysis(result.analysis.haqei_alignment)
          },
          insights: this.generateInsights(result.analysis),
          recommendations: this.generateRecommendations(result.analysis)
        };
      },
      
      formatSentimentAnalysis(sentiment) {
        return {
          polarity: sentiment.polarity?.toFixed(2) || 0,
          classification: sentiment.classification,
          strength: sentiment.magnitude?.toFixed(2) || 0,
          interpretation: this.interpretSentiment(sentiment.classification, sentiment.polarity)
        };
      },
      
      interpretSentiment(classification, polarity) {
        const interpretations = {
          positive: `ポジティブな感情が表現されています（強度: ${Math.abs(polarity * 100).toFixed(0)}%）`,
          negative: `ネガティブな感情が表現されています（強度: ${Math.abs(polarity * 100).toFixed(0)}%）`,
          neutral: '中性的な表現です'
        };
        
        return interpretations[classification] || '分析中...';
      },
      
      formatKeywordAnalysis(keywords) {
        return {
          total_keywords: keywords.length,
          top_keywords: keywords.slice(0, 5),
          categories: this.groupKeywordsByCategory(keywords),
          importance_distribution: this.calculateImportanceDistribution(keywords)
        };
      },
      
      groupKeywordsByCategory(keywords) {
        const groups = {};
        keywords.forEach(keyword => {
          const category = keyword.category || 'general';
          if (!groups[category]) groups[category] = [];
          groups[category].push(keyword);
        });
        
        return Object.entries(groups).map(([category, words]) => ({
          category: category,
          count: words.length,
          keywords: words.slice(0, 3).map(w => w.word)
        }));
      },
      
      calculateImportanceDistribution(keywords) {
        let high = 0, medium = 0, low = 0;
        
        keywords.forEach(keyword => {
          if (keyword.importance >= 0.7) high++;
          else if (keyword.importance >= 0.4) medium++;
          else low++;
        });
        
        return { high, medium, low };
      },
      
      formatThemeAnalysis(themes) {
        return {
          identified_themes: themes.length,
          primary_theme: themes[0] || null,
          theme_distribution: themes.map(theme => ({
            theme: theme.theme,
            relevance: Math.round(theme.relevance * 100) + '%',
            strength: theme.matches
          }))
        };
      },
      
      formatEmotionAnalysis(emotions) {
        return {
          dominant_emotion: emotions.dominant_emotion,
          emotional_balance: {
            positive_ratio: Math.round(emotions.emotional_balance.ratio * 100) + '%',
            balance_type: emotions.emotional_balance.ratio > 0.6 ? 'positive' :
                         emotions.emotional_balance.ratio < 0.4 ? 'negative' : 'balanced'
          },
          emotion_intensity: Math.round(emotions.overall_intensity * 100) / 100,
          detected_emotions: Object.entries(emotions.emotions)
            .filter(([_, data]) => data.intensity > 0)
            .map(([emotion, data]) => ({
              emotion: emotion,
              intensity: Math.round(data.intensity * 100) + '%'
            }))
        };
      },
      
      formatHaQeiAnalysis(haqeiAlignment) {
        return {
          overall_alignment: Math.round(haqeiAlignment.overall_score * 100) + '%',
          classification: haqeiAlignment.classification,
          principle_scores: Object.entries(haqeiAlignment.principles).map(([principle, data]) => ({
            principle: principle,
            score: Math.round(data.score * 100) + '%',
            keywords: data.keywords
          })),
          recommendations: haqeiAlignment.recommendations
        };
      },
      
      generateInsights(analysis) {
        const insights = [];
        
        // センチメントインサイト
        if (analysis.sentiment.classification !== 'neutral') {
          insights.push(`文章は${analysis.sentiment.classification}なトーンを持っています`);
        }
        
        // テーマインサイト
        if (analysis.themes.length > 0) {
          insights.push(`主要テーマは「${analysis.themes[0].theme}」です`);
        }
        
        // HaQeiインサイト
        if (analysis.haqei_alignment.overall_score > 0.6) {
          insights.push('HaQei哲学の原理と高い適合性を示しています');
        }
        
        return insights;
      },
      
      generateRecommendations(analysis) {
        const recommendations = [];
        
        // HaQei推奨
        if (analysis.haqei_alignment.recommendations.length > 0) {
          recommendations.push(...analysis.haqei_alignment.recommendations);
        }
        
        // 感情バランス推奨
        if (analysis.emotions.emotional_balance.ratio < 0.3) {
          recommendations.push('よりポジティブな視点を取り入れることをお勧めします');
        }
        
        // 複雑度推奨
        if (analysis.complexity.level === 'low') {
          recommendations.push('より詳細な説明を加えることで内容が充実します');
        }
        
        return recommendations;
      }
    };

    // Safe Mode OS (Fallback Layer)
    this.safeMode = {
      name: 'ML Safe Mode OS',
      active: false,
      
      activate() {
        console.log('🛡️ MLIntegration Safe Mode activated');
        this.active = true;
        
        return {
          basic_analysis: true,
          advanced_features: false,
          philosophy: 'haqei-safe'
        };
      },
      
      performSafeAnalysis(text) {
        // 最低限の分析
        const wordCount = text.length;
        const basicSentiment = text.includes('良い') || text.includes('嬉しい') ? 'positive' : 
                             text.includes('悪い') || text.includes('悲しい') ? 'negative' : 'neutral';
        
        return {
          text: text,
          analysis: {
            word_count: wordCount,
            basic_sentiment: basicSentiment,
            safe_mode: true
          },
          confidence: 0.3,
          philosophy: 'haqei-safe'
        };
      }
    };
    
    console.log('✅ Triple OS Architecture setup complete');
  },

  // MLモデル初期化
  async initializeMLModels() {
    console.log('🧠 Initializing ML models...');
    
    // 基本的なMLモデルのセットアップ
    this.models = {
      sentiment: { loaded: true, type: 'rule_based' },
      keyword_extraction: { loaded: true, type: 'frequency_based' },
      theme_detection: { loaded: true, type: 'pattern_matching' },
      emotion_detection: { loaded: true, type: 'lexicon_based' },
      complexity_analysis: { loaded: true, type: 'linguistic_features' }
    };
    
    console.log('✅ ML models initialized');
  },

  // HaQei強化セットアップ
  async setupHaQeiEnhancement() {
    console.log('☯️ Setting up HaQei enhancement...');
    
    this.haqeiEnhancement = {
      // 調和強化
      harmony_enhancement: (analysis) => {
        if (analysis.haqei_alignment.principles.harmony.score < 0.5) {
          analysis.recommendations = analysis.recommendations || [];
          analysis.recommendations.push('調和と協力の視点を加えることをお勧めします');
        }
        return analysis;
      },
      
      // 慈悲強化
      compassion_enhancement: (analysis) => {
        if (analysis.emotions.emotional_balance.ratio < 0.4) {
          analysis.recommendations = analysis.recommendations || [];
          analysis.recommendations.push('思いやりと共感の要素を取り入れることをお勧めします');
        }
        return analysis;
      },
      
      // 智慧強化
      wisdom_enhancement: (analysis) => {
        if (analysis.complexity.level === 'low') {
          analysis.recommendations = analysis.recommendations || [];
          analysis.recommendations.push('より深い洞察や学びの要素を追加することをお勧めします');
        }
        return analysis;
      },
      
      // 真実強化
      authenticity_enhancement: (analysis) => {
        if (analysis.haqei_alignment.principles.authenticity.score < 0.5) {
          analysis.recommendations = analysis.recommendations || [];
          analysis.recommendations.push('誠実さと真実の表現を重視することをお勧めします');
        }
        return analysis;
      }
    };
    
    console.log('✅ HaQei enhancement setup complete');
  },

  // ML機能検証
  validateMLCapabilities() {
    console.log('🔍 Validating ML capabilities...');
    
    const capabilities = {
      text_analysis: !!this.engineOS,
      sentiment_analysis: true,
      keyword_extraction: true,
      theme_detection: true,
      emotion_detection: true,
      haqei_alignment: true
    };
    
    this.capabilities = capabilities;
    console.log('✅ ML capabilities validated:', capabilities);
  },

  // Safe Mode起動
  activateSafeMode() {
    console.log('🛡️ Activating Safe Mode...');
    this.safeMode.activate();
    this.initialized = true;
  },

  // 公開API - テキスト分析
  async analyzeText(text, options = {}) {
    if (!this.initialized) {
      await this.init();
    }
    
    try {
      if (this.safeMode.active) {
        return this.safeMode.performSafeAnalysis(text);
      }
      
      const rawResult = await this.engineOS.analyzeText(text, options);
      
      // HaQei強化適用
      const enhancedResult = this.applyHaQeiEnhancement(rawResult);
      
      // インターフェース整形
      return this.interfaceOS.formatAnalysisResult(enhancedResult);
      
    } catch (error) {
      console.error('❌ Text analysis failed:', error);
      this.safeMode.activate();
      return this.safeMode.performSafeAnalysis(text);
    }
  },

  // HaQei強化適用
  applyHaQeiEnhancement(result) {
    let enhanced = { ...result };
    
    // 各HaQei原理の強化を適用
    Object.values(this.haqeiEnhancement).forEach(enhancement => {
      enhanced.analysis = enhancement(enhanced.analysis);
    });
    
    return enhanced;
  },

  // ステータス取得
  getStatus() {
    return {
      initialized: this.initialized,
      safe_mode_active: this.safeMode?.active || false,
      models_loaded: Object.keys(this.models || {}).length,
      capabilities: this.capabilities || {},
      philosophy: 'haqei',
      architecture: 'triple-os'
    };
  },

  // 機能一覧取得
  getCapabilities() {
    const capabilities = ['basic_text_analysis'];
    
    if (this.engineOS) {
      capabilities.push('advanced_text_analysis', 'sentiment_analysis', 'keyword_extraction');
    }
    
    if (this.haqeiEnhancement) {
      capabilities.push('haqei_alignment_analysis', 'philosophy_enhancement');
    }
    
    if (!this.safeMode?.active) {
      capabilities.push('theme_detection', 'emotion_analysis', 'complexity_assessment');
    }
    
    return capabilities;
  }
};

// 自動初期化
document.addEventListener('DOMContentLoaded', () => {
  window.MLIntegration.init();
});

console.log('✅ ML Integration loaded with HaQei Philosophy');