/**
 * Offline Kuromoji Integration - Bunenjin Philosophy Implementation
 * Triple OS Architecture: Integration Layer Component
 * 
 * 形態素解析エンジン統合システム
 * - Kuromojiとフォールバックシステムの統合
 * - 他システムとの連携インターフェース
 * - 矛盾受容型品質管理
 */

class OfflineKuromojiIntegration {
  constructor() {
    this.initialized = false;
    this.analyzer = null;
    this.connectionManager = null;
    this.integrationPoints = new Map();
    this.qualityMetrics = {
      precision: 0,
      recall: 0,
      f1Score: 0,
      philosophy: 'bunenjin'
    };
    
    // Bunenjin Philosophy: 統合の矛盾を受け入れる
    this.acceptContradiction = {
      perfect_integration: false,
      working_integration: true,
      multiple_systems: true,
      unified_interface: true
    };
    
    this.init();
  }
  
  async init() {
    console.log('🔗 [OfflineKuromojiIntegration] 統合システム初期化開始');
    
    try {
      // Analyzer connection
      await this.connectToAnalyzer();
      
      // System integrations
      await this.setupIntegrationPoints();
      
      // Quality monitoring
      await this.initializeQualityMonitoring();
      
      this.initialized = true;
      console.log('✅ [OfflineKuromojiIntegration] 統合システム準備完了');
      
    } catch (error) {
      console.warn('⚠️ [OfflineKuromojiIntegration] 初期化警告:', error);
      this.initializeMinimalIntegration();
    }
  }
  
  async connectToAnalyzer() {
    console.log('📝 [OfflineKuromojiIntegration] 解析器接続');
    
    // Wait for OfflineKuromojiInitializer
    let retries = 0;
    const maxRetries = 30; // 3秒待機
    
    while (retries < maxRetries) {
      if (window.OfflineKuromojiInitializer) {
        this.analyzer = window.OfflineKuromojiInitializer;
        
        // Wait for analyzer initialization
        if (this.analyzer.initialized) {
          break;
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      retries++;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (!this.analyzer) {
      throw new Error('OfflineKuromojiInitializer not available');
    }
    
    console.log('✅ [OfflineKuromojiIntegration] 解析器接続成功');
  }
  
  async setupIntegrationPoints() {
    console.log('🔧 [OfflineKuromojiIntegration] 統合ポイント設定');
    
    // Future Simulator integration
    this.integrationPoints.set('future-simulator', {
      name: 'Future Simulator Integration',
      
      async analyzeScenarioText(scenarioText) {
        if (!this.analyzer) {
          return this.createFallbackAnalysis(scenarioText);
        }
        
        const analysis = await this.analyzer.analyze(scenarioText);
        
        return {
          ...analysis,
          scenarioKeywords: this.extractScenarioKeywords(analysis.tokens),
          futureIndicators: this.findFutureIndicators(analysis.tokens),
          emotionalTone: this.analyzeEmotionalTone(analysis.tokens),
          philosophy: 'bunenjin-scenario'
        };
      },
      
      extractScenarioKeywords(tokens) {
        const keywords = [];
        const scenarioPatterns = [
          '未来', '将来', '今後', 'これから',
          '問題', '課題', '困難', 'トラブル',
          '希望', '目標', '夢', '願い',
          '変化', '改善', '成長', '発展'
        ];
        
        tokens.forEach(token => {
          if (scenarioPatterns.includes(token.surface_form)) {
            keywords.push({
              word: token.surface_form,
              importance: this.calculateKeywordImportance(token),
              category: this.categorizeKeyword(token.surface_form)
            });
          }
        });
        
        return keywords;
      },
      
      findFutureIndicators(tokens) {
        const indicators = [];
        const futurePatterns = [
          { pattern: '〜でしょう', type: 'speculation' },
          { pattern: '〜かもしれない', type: 'possibility' },
          { pattern: '〜だろう', type: 'assumption' },
          { pattern: '〜すべき', type: 'necessity' }
        ];
        
        // Simple pattern matching for future indicators
        const fullText = tokens.map(t => t.surface_form).join('');
        
        futurePatterns.forEach(({ pattern, type }) => {
          if (fullText.includes(pattern)) {
            indicators.push({ pattern, type, confidence: 0.8 });
          }
        });
        
        return indicators;
      },
      
      analyzeEmotionalTone(tokens) {
        const emotionalWords = {
          positive: ['良い', '素晴らしい', '最高', '嬉しい', '楽しい', '幸せ'],
          negative: ['悪い', 'ひどい', '最悪', '悲しい', 'つらい', '苦しい'],
          neutral: ['普通', '平均的', 'まあまあ', 'そこそこ']
        };
        
        let positiveCount = 0;
        let negativeCount = 0;
        let neutralCount = 0;
        
        tokens.forEach(token => {
          if (emotionalWords.positive.includes(token.surface_form)) {
            positiveCount++;
          } else if (emotionalWords.negative.includes(token.surface_form)) {
            negativeCount++;
          } else if (emotionalWords.neutral.includes(token.surface_form)) {
            neutralCount++;
          }
        });
        
        const total = positiveCount + negativeCount + neutralCount;
        
        return {
          positive: total > 0 ? positiveCount / total : 0,
          negative: total > 0 ? negativeCount / total : 0,
          neutral: total > 0 ? neutralCount / total : 0,
          dominant: this.getDominantTone(positiveCount, negativeCount, neutralCount)
        };
      },
      
      getDominantTone(pos, neg, neu) {
        if (pos > neg && pos > neu) return 'positive';
        if (neg > pos && neg > neu) return 'negative';
        return 'neutral';
      },
      
      calculateKeywordImportance(token) {
        // Simple importance calculation
        const importance = {
          '名詞': 0.8,
          '動詞': 0.7,
          '形容詞': 0.6,
          '副詞': 0.4
        };
        
        return importance[token.pos] || 0.3;
      },
      
      categorizeKeyword(word) {
        const categories = {
          '時間': ['未来', '将来', '今後', 'これから', '過去', '現在'],
          '感情': ['希望', '不安', '恐怖', '喜び', '悲しみ'],
          '行動': ['選択', '決断', '変化', '改善', '挑戦'],
          '関係': ['人間', '社会', '家族', '友人', '仕事']
        };
        
        for (const [category, words] of Object.entries(categories)) {
          if (words.includes(word)) {
            return category;
          }
        }
        
        return 'その他';
      }
    });
    
    // I Ching system integration
    this.integrationPoints.set('iching-system', {
      name: 'I Ching Integration',
      
      async analyzeForHexagram(text) {
        const analysis = await this.analyzer.analyze(text);
        
        return {
          ...analysis,
          ichingConcepts: this.mapToIChingConcepts(analysis.tokens),
          elementalBalance: this.analyzeElementalBalance(analysis.tokens),
          changePatterns: this.identifyChangePatterns(analysis.tokens),
          philosophy: 'bunenjin-iching'
        };
      },
      
      mapToIChingConcepts(tokens) {
        const conceptMap = {
          '変化': ['乾', '坤', '震', '巽'],
          '調和': ['泰', '否', '同人', '大有'],
          '困難': ['坎', '艮', '蹇', '困'],
          '成長': ['漸', '豊', '升', '井'],
          '関係': ['咸', '恒', '家人', '睽']
        };
        
        const concepts = [];
        
        tokens.forEach(token => {
          Object.entries(conceptMap).forEach(([concept, hexagrams]) => {
            if (token.surface_form.includes(concept)) {
              concepts.push({
                concept,
                hexagrams,
                relevance: this.calculateConceptRelevance(token, concept),
                position: token.index || 0
              });
            }
          });
        });
        
        return concepts;
      },
      
      analyzeElementalBalance(tokens) {
        const elements = {
          fire: ['火', '熱', '光', '明るい', '激しい', '情熱'],
          water: ['水', '流れ', '深い', '静か', '冷たい', '流動'],
          earth: ['土', '安定', '固い', '基盤', '現実', '堅実'],
          metal: ['金', '鋭い', '切れる', '規則', '秩序', '精密'],
          wood: ['木', '成長', '柔軟', '生命', '発展', '拡大']
        };
        
        const elementCounts = {};
        Object.keys(elements).forEach(element => {
          elementCounts[element] = 0;
        });
        
        tokens.forEach(token => {
          Object.entries(elements).forEach(([element, words]) => {
            if (words.some(word => token.surface_form.includes(word))) {
              elementCounts[element]++;
            }
          });
        });
        
        return elementCounts;
      },
      
      identifyChangePatterns(tokens) {
        const changeWords = ['変化', '変える', '変わる', '改善', '発展', '成長', '衰退', '減少'];
        const patterns = [];
        
        tokens.forEach((token, index) => {
          if (changeWords.includes(token.surface_form)) {
            patterns.push({
              type: 'change_indicator',
              word: token.surface_form,
              position: index,
              context: this.getContext(tokens, index, 2)
            });
          }
        });
        
        return patterns;
      },
      
      getContext(tokens, centerIndex, radius) {
        const start = Math.max(0, centerIndex - radius);
        const end = Math.min(tokens.length, centerIndex + radius + 1);
        
        return tokens.slice(start, end).map(token => token.surface_form);
      },
      
      calculateConceptRelevance(token, concept) {
        // Simple relevance scoring
        const posWeights = {
          '名詞': 1.0,
          '動詞': 0.8,
          '形容詞': 0.6,
          '副詞': 0.4
        };
        
        return posWeights[token.pos] || 0.3;
      }
    });
    
    // Dictionary Manager integration
    this.integrationPoints.set('dictionary-manager', {
      name: 'Dictionary Manager Integration',
      
      async enhanceDictionaryAnalysis(text) {
        const analysis = await this.analyzer.analyze(text);
        
        return {
          ...analysis,
          enhancedTokens: this.enhanceTokens(analysis.tokens),
          semanticGroups: this.groupSemanticallySimilar(analysis.tokens),
          philosophy: 'bunenjin-dictionary'
        };
      },
      
      enhanceTokens(tokens) {
        return tokens.map(token => ({
          ...token,
          semanticCategory: this.categorizeToken(token),
          importance: this.calculateTokenImportance(token),
          relations: this.findTokenRelations(token, tokens)
        }));
      },
      
      categorizeToken(token) {
        // Semantic categorization based on POS and surface form
        if (token.pos === '名詞') {
          if (token.surface_form.match(/[時期月日年]/)) return 'temporal';
          if (token.surface_form.match(/[人者]/)) return 'person';
          if (token.surface_form.match(/[事物品]/)) return 'object';
          return 'concept';
        }
        
        if (token.pos === '動詞') {
          return 'action';
        }
        
        if (token.pos === '形容詞') {
          return 'quality';
        }
        
        return 'other';
      },
      
      calculateTokenImportance(token) {
        let importance = 0.5;
        
        // POS-based importance
        const posImportance = {
          '名詞': 0.8,
          '動詞': 0.7,
          '形容詞': 0.6,
          '副詞': 0.4,
          '助詞': 0.1
        };
        
        importance = posImportance[token.pos] || 0.3;
        
        // Length-based adjustment
        if (token.surface_form.length > 3) {
          importance += 0.1;
        }
        
        return Math.min(importance, 1.0);
      },
      
      findTokenRelations(token, allTokens) {
        const relations = [];
        
        // Find tokens with similar readings or meanings
        allTokens.forEach(otherToken => {
          if (token !== otherToken) {
            if (this.areRelated(token, otherToken)) {
              relations.push({
                token: otherToken.surface_form,
                relation: this.getRelationType(token, otherToken)
              });
            }
          }
        });
        
        return relations;
      },
      
      areRelated(token1, token2) {
        // Simple relation detection
        if (token1.pos === token2.pos && token1.pos === '名詞') {
          return token1.surface_form.length > 1 && token2.surface_form.length > 1;
        }
        
        return false;
      },
      
      getRelationType(token1, token2) {
        if (token1.pos === token2.pos) return 'same_pos';
        return 'other';
      },
      
      groupSemanticallySimilar(tokens) {
        const groups = {};
        
        tokens.forEach(token => {
          const category = this.categorizeToken(token);
          if (!groups[category]) {
            groups[category] = [];
          }
          groups[category].push(token);
        });
        
        return groups;
      }
    });
    
    console.log('✅ [OfflineKuromojiIntegration] 統合ポイント設定完了');
  }
  
  async initializeQualityMonitoring() {
    console.log('📊 [OfflineKuromojiIntegration] 品質監視初期化');
    
    // Bunenjin Philosophy: 完璧でない品質も受け入れる
    this.qualityMetrics = {
      precision: 0.75, // 初期値
      recall: 0.70,
      f1Score: 0.725,
      philosophy: 'bunenjin-adaptive',
      
      update(newMetrics) {
        this.precision = (this.precision + newMetrics.precision) / 2;
        this.recall = (this.recall + newMetrics.recall) / 2;
        this.f1Score = 2 * (this.precision * this.recall) / (this.precision + this.recall);
      }
    };
  }
  
  initializeMinimalIntegration() {
    console.log('🛡️ [OfflineKuromojiIntegration] 最小統合モード');
    
    // Fallback integration
    this.analyzer = {
      analyze: (text) => ({
        tokens: text.split(/\s+/).map(word => ({ surface_form: word, pos: '名詞' })),
        method: 'minimal',
        philosophy: 'bunenjin-minimal'
      })
    };
    
    this.initialized = true;
  }
  
  createFallbackAnalysis(text) {
    return {
      tokens: text.split(/\s+/).map((word, index) => ({
        surface_form: word,
        pos: '名詞',
        index: index
      })),
      keywords: [],
      concepts: [],
      method: 'fallback',
      philosophy: 'bunenjin-fallback'
    };
  }
  
  // Public API
  async analyzeForSystem(systemName, text, options = {}) {
    if (!this.initialized) {
      await this.init();
    }
    
    const integrationPoint = this.integrationPoints.get(systemName);
    
    if (!integrationPoint) {
      console.warn(`⚠️ [OfflineKuromojiIntegration] 未知のシステム: ${systemName}`);
      return await this.analyzer.analyze(text);
    }
    
    try {
      // System-specific analysis
      switch (systemName) {
        case 'future-simulator':
          return await integrationPoint.analyzeScenarioText(text);
        case 'iching-system':
          return await integrationPoint.analyzeForHexagram(text);
        case 'dictionary-manager':
          return await integrationPoint.enhanceDictionaryAnalysis(text);
        default:
          return await this.analyzer.analyze(text);
      }
    } catch (error) {
      console.error(`❌ [OfflineKuromojiIntegration] ${systemName}解析エラー:`, error);
      return this.createFallbackAnalysis(text);
    }
  }
  
  getIntegrationStatus() {
    return {
      initialized: this.initialized,
      analyzerAvailable: !!this.analyzer,
      integrationPoints: Array.from(this.integrationPoints.keys()),
      qualityMetrics: this.qualityMetrics,
      philosophy: 'bunenjin'
    };
  }
  
  registerCustomIntegration(name, integrationConfig) {
    console.log(`🔧 [OfflineKuromojiIntegration] カスタム統合登録: ${name}`);
    
    this.integrationPoints.set(name, {
      name: integrationConfig.name || name,
      ...integrationConfig
    });
  }
}

// Global instance and API
if (typeof window !== 'undefined') {
  window.OfflineKuromojiIntegration = new OfflineKuromojiIntegration();
  
  // Global convenience functions
  window.analyzeForFutureSimulator = async function(text) {
    return await window.OfflineKuromojiIntegration.analyzeForSystem('future-simulator', text);
  };
  
  window.analyzeForIChingSystem = async function(text) {
    return await window.OfflineKuromojiIntegration.analyzeForSystem('iching-system', text);
  };
  
  window.enhanceDictionaryAnalysis = async function(text) {
    return await window.OfflineKuromojiIntegration.analyzeForSystem('dictionary-manager', text);
  };
}

console.log('✅ [OfflineKuromojiIntegration] Bunenjin Philosophy Implementation Loaded');