/**
 * Dynamic Keyword Generator - HaQei Philosophy Implementation
 * Triple OS Architecture: Interface Layer Component
 * 
 * 動的キーワード生成エンジン
 * - ユーザー入力の意図理解
 * - コンテキスト特化キーワード展開
 * - HaQei哲学準拠の語彙生成
 */

console.log('🔄 DynamicKeywordGenerator Loading...');

window.DynamicKeywordGenerator = {
  // Triple OS Architecture準拠の初期化
  init() {
    console.log('🔧 DynamicKeywordGenerator initializing...');
    this.setupTripleOS();
    this.initializeGenerationRules();
    this.loadContextDatabase();
    console.log('✅ DynamicKeywordGenerator initialized successfully');
  },

  // Triple OS Architecture セットアップ
  setupTripleOS() {
    // Engine OS (Core Generation Logic)
    this.engineOS = {
      name: 'Dynamic Keyword Engine OS',
      version: '1.0.0',
      philosophy: 'haqei-dynamic',
      
      async generateKeywords(input, context = {}) {
        try {
          const analyzed = this.analyzeInput(input);
          const baseKeywords = this.extractBaseKeywords(analyzed);
          const expandedKeywords = await this.expandKeywords(baseKeywords, context);
          const contextualKeywords = this.generateContextualKeywords(expandedKeywords, context);
          const refinedKeywords = this.refineKeywords(contextualKeywords, analyzed);
          
          return {
            original: input,
            base: baseKeywords,
            expanded: expandedKeywords,
            contextual: contextualKeywords,
            final: refinedKeywords,
            metadata: {
              totalGenerated: refinedKeywords.length,
              expansionRatio: refinedKeywords.length / baseKeywords.length,
              contextQuality: this.calculateContextQuality(context),
              philosophy: 'haqei-dynamic'
            }
          };
          
        } catch (error) {
          console.warn('⚠️ Dynamic keyword generation error:', error);
          return this.createFallbackKeywords(input);
        }
      },
      
      analyzeInput(input) {
        const analysis = {
          text: input,
          tokens: this.tokenize(input),
          entities: this.extractEntities(input),
          intent: this.detectIntent(input),
          emotion: this.detectEmotion(input),
          complexity: this.calculateComplexity(input)
        };
        
        return analysis;
      },
      
      tokenize(text) {
        // 簡易形態素解析
        return text
          .replace(/[。、！？]/g, ' ')
          .split(/\s+/)
          .filter(token => token.length > 0)
          .map(token => ({
            surface: token,
            reading: this.inferReading(token),
            pos: this.inferPOS(token),
            importance: this.calculateTokenImportance(token)
          }));
      },
      
      extractEntities(input) {
        const entities = [];
        const patterns = {
          person: /([一-龯]+)(さん|くん|ちゃん|氏|先生)/g,
          organization: /(会社|企業|組織|団体|部門|チーム)/g,
          location: /(東京|大阪|地域|場所|会場)/g,
          time: /(今日|明日|来週|来月|将来|過去|現在)/g,
          number: /(\d+|一|二|三|四|五|六|七|八|九|十)/g
        };
        
        for (const [type, pattern] of Object.entries(patterns)) {
          let match;
          while ((match = pattern.exec(input)) !== null) {
            entities.push({
              text: match[0],
              type: type,
              position: match.index,
              confidence: 0.8
            });
          }
        }
        
        return entities;
      },
      
      detectIntent(input) {
        const intentPatterns = {
          question: /[？?]|どう|なぜ|いつ|どこ|だれ|なに/,
          request: /してください|お願い|欲しい|必要/,
          decision: /決める|選ぶ|判断|迷って/,
          future: /未来|将来|これから|予想|予測/,
          problem: /問題|困った|悩み|心配|不安/,
          goal: /目標|ゴール|達成|成功|実現/
        };
        
        for (const [intent, pattern] of Object.entries(intentPatterns)) {
          if (pattern.test(input)) {
            return intent;
          }
        }
        
        return 'general';
      },
      
      detectEmotion(input) {
        const emotionPatterns = {
          positive: /嬉しい|楽しい|幸せ|満足|喜び|良い/,
          negative: /悲しい|辛い|苦しい|不安|心配|悪い/,
          excited: /興奮|わくわく|期待|楽しみ/,
          calm: /落ち着|平静|穏やか|安心/,
          anxious: /不安|心配|緊張|怖い/,
          confident: /自信|確信|大丈夫|できる/
        };
        
        for (const [emotion, pattern] of Object.entries(emotionPatterns)) {
          if (pattern.test(input)) {
            return emotion;
          }
        }
        
        return 'neutral';
      },
      
      calculateComplexity(input) {
        const factors = {
          length: input.length / 100, // 0-1 正規化
          uniqueChars: new Set(input).size / input.length,
          kanji: (input.match(/[一-龯]/g) || []).length / input.length,
          punctuation: (input.match(/[。、！？]/g) || []).length / input.length
        };
        
        const complexity = Object.values(factors).reduce((sum, val) => sum + val, 0) / 4;
        return Math.min(complexity, 1.0);
      },
      
      extractBaseKeywords(analysis) {
        const keywords = [];
        
        // 重要なトークンから抽出
        analysis.tokens
          .filter(token => token.importance > 0.5)
          .forEach(token => {
            keywords.push({
              word: token.surface,
              source: 'token',
              importance: token.importance,
              pos: token.pos
            });
          });
        
        // エンティティから抽出
        analysis.entities.forEach(entity => {
          keywords.push({
            word: entity.text,
            source: 'entity',
            importance: entity.confidence,
            type: entity.type
          });
        });
        
        // 意図ベースキーワード
        const intentKeywords = this.getIntentKeywords(analysis.intent);
        intentKeywords.forEach(keyword => {
          keywords.push({
            word: keyword,
            source: 'intent',
            importance: 0.7,
            intent: analysis.intent
          });
        });
        
        // 感情ベースキーワード
        if (analysis.emotion !== 'neutral') {
          const emotionKeywords = this.getEmotionKeywords(analysis.emotion);
          emotionKeywords.forEach(keyword => {
            keywords.push({
              word: keyword,
              source: 'emotion',
              importance: 0.6,
              emotion: analysis.emotion
            });
          });
        }
        
        return this.deduplicateKeywords(keywords);
      },
      
      async expandKeywords(baseKeywords, context) {
        const expanded = [];
        
        for (const keyword of baseKeywords) {
          // セマンティック展開
          const semantic = this.getSemanticExpansions(keyword.word);
          expanded.push(...semantic.map(word => ({
            word: word,
            source: 'semantic',
            parent: keyword.word,
            importance: keyword.importance * 0.8
          })));
          
          // 関連語展開
          const related = this.getRelatedWords(keyword.word, context);
          expanded.push(...related.map(word => ({
            word: word,
            source: 'related',
            parent: keyword.word,
            importance: keyword.importance * 0.7
          })));
          
          // 同義語展開
          const synonyms = this.getSynonyms(keyword.word);
          expanded.push(...synonyms.map(word => ({
            word: word,
            source: 'synonym',
            parent: keyword.word,
            importance: keyword.importance * 0.9
          })));
        }
        
        return [...baseKeywords, ...this.deduplicateKeywords(expanded)];
      },
      
      generateContextualKeywords(keywords, context) {
        const contextual = [...keywords];
        
        // ドメイン特化キーワード
        if (context.domain) {
          const domainKeywords = this.getDomainKeywords(context.domain);
          contextual.push(...domainKeywords.map(word => ({
            word: word,
            source: 'domain',
            importance: 0.6,
            domain: context.domain
          })));
        }
        
        // 時間軸キーワード
        if (context.timeframe) {
          const timeKeywords = this.getTimeframeKeywords(context.timeframe);
          contextual.push(...timeKeywords.map(word => ({
            word: word,
            source: 'timeframe',
            importance: 0.5,
            timeframe: context.timeframe
          })));
        }
        
        // 状況特化キーワード
        if (context.situation) {
          const situationKeywords = this.getSituationKeywords(context.situation);
          contextual.push(...situationKeywords.map(word => ({
            word: word,
            source: 'situation',
            importance: 0.6,
            situation: context.situation
          })));
        }
        
        return this.deduplicateKeywords(contextual);
      },
      
      refineKeywords(keywords, analysis) {
        // 重要度でソート
        const sorted = keywords.sort((a, b) => b.importance - a.importance);
        
        // 品質フィルタリング
        const filtered = sorted.filter(keyword => {
          // 最低重要度チェック
          if (keyword.importance < 0.3) return false;
          
          // 長さチェック
          if (keyword.word.length < 2 || keyword.word.length > 15) return false;
          
          // 不適切な文字チェック
          if (/[0-9a-zA-Z]/.test(keyword.word) && keyword.word.length < 3) return false;
          
          return true;
        });
        
        // 多様性確保
        const diversified = this.ensureDiversity(filtered);
        
        // 上位30件に制限
        return diversified.slice(0, 30);
      },
      
      deduplicateKeywords(keywords) {
        const unique = new Map();
        
        keywords.forEach(keyword => {
          const key = keyword.word;
          if (unique.has(key)) {
            const existing = unique.get(key);
            if (keyword.importance > existing.importance) {
              unique.set(key, keyword);
            }
          } else {
            unique.set(key, keyword);
          }
        });
        
        return Array.from(unique.values());
      },
      
      ensureDiversity(keywords) {
        const diversified = [];
        const usedSources = new Set();
        const usedTypes = new Set();
        
        // 多様性を確保しながら選択
        for (const keyword of keywords) {
          const sourceCount = Array.from(usedSources).filter(s => s === keyword.source).length;
          const typeCount = keyword.type ? Array.from(usedTypes).filter(t => t === keyword.type).length : 0;
          
          // 同一ソースまたはタイプの偏りをチェック
          if (sourceCount < 5 && typeCount < 3) {
            diversified.push(keyword);
            usedSources.add(keyword.source);
            if (keyword.type) usedTypes.add(keyword.type);
            
            if (diversified.length >= 30) break;
          }
        }
        
        return diversified;
      },
      
      createFallbackKeywords(input) {
        const fallbackWords = input
          .replace(/[。、！？]/g, ' ')
          .split(/\s+/)
          .filter(word => word.length > 1)
          .slice(0, 10)
          .map(word => ({
            word: word,
            source: 'fallback',
            importance: 0.5
          }));
        
        return {
          original: input,
          base: fallbackWords,
          expanded: fallbackWords,
          contextual: fallbackWords,
          final: fallbackWords,
          metadata: {
            totalGenerated: fallbackWords.length,
            expansionRatio: 1.0,
            contextQuality: 0.3,
            philosophy: 'haqei-fallback'
          }
        };
      }
    };

    // Interface OS (UI Integration Layer)
    this.interfaceOS = {
      name: 'Dynamic Keyword Interface OS',
      
      formatGenerationResult(result) {
        return {
          display: {
            summary: {
              input: result.original.substring(0, 50) + (result.original.length > 50 ? '...' : ''),
              generated: result.metadata.totalGenerated,
              expansion: `${result.metadata.expansionRatio.toFixed(1)}x`,
              quality: this.formatQuality(result.metadata.contextQuality)
            },
            keywords: this.formatKeywordList(result.final),
            breakdown: this.createBreakdown(result),
            suggestions: this.generateSuggestions(result)
          },
          philosophy: result.metadata.philosophy
        };
      },
      
      formatKeywordList(keywords) {
        return keywords.map(keyword => ({
          word: keyword.word,
          importance: Math.round(keyword.importance * 100) + '%',
          source: this.formatSource(keyword.source),
          category: this.determineCategory(keyword)
        }));
      },
      
      createBreakdown(result) {
        const breakdown = {
          sources: {},
          importance: { high: 0, medium: 0, low: 0 },
          categories: {}
        };
        
        result.final.forEach(keyword => {
          // ソース別カウント
          breakdown.sources[keyword.source] = (breakdown.sources[keyword.source] || 0) + 1;
          
          // 重要度別カウント
          if (keyword.importance >= 0.7) breakdown.importance.high++;
          else if (keyword.importance >= 0.5) breakdown.importance.medium++;
          else breakdown.importance.low++;
          
          // カテゴリー別カウント
          const category = this.determineCategory(keyword);
          breakdown.categories[category] = (breakdown.categories[category] || 0) + 1;
        });
        
        return breakdown;
      },
      
      generateSuggestions(result) {
        const suggestions = [];
        
        // 不足している分野の提案
        const categories = ['action', 'emotion', 'time', 'place', 'person'];
        const presentCategories = new Set(result.final.map(k => this.determineCategory(k)));
        
        categories.forEach(category => {
          if (!presentCategories.has(category)) {
            suggestions.push(`${category}に関するキーワードを追加することをお勧めします`);
          }
        });
        
        // 品質改善提案
        if (result.metadata.contextQuality < 0.5) {
          suggestions.push('より具体的な状況説明があると、質の高いキーワードを生成できます');
        }
        
        return suggestions;
      },
      
      formatSource(source) {
        const sourceNames = {
          token: '📝 文章解析',
          entity: '🏷️ 固有表現',
          intent: '🎯 意図推定',
          emotion: '💭 感情分析',
          semantic: '🧠 意味関係',
          related: '🔗 関連語',
          synonym: '🔄 同義語',
          domain: '🏢 ドメイン',
          timeframe: '⏰ 時間軸',
          situation: '🎬 状況',
          fallback: '🛡️ フォールバック'
        };
        
        return sourceNames[source] || `📌 ${source}`;
      },
      
      determineCategory(keyword) {
        const categoryPatterns = {
          action: /する|やる|行う|実行|実施|取組/,
          emotion: /嬉し|悲し|怖|不安|楽し|幸せ|満足/,
          time: /時|日|週|月|年|過去|現在|未来|いつ/,
          place: /場所|所|地域|会場|家|会社|学校/,
          person: /人|者|さん|くん|ちゃん|先生|友/
        };
        
        for (const [category, pattern] of Object.entries(categoryPatterns)) {
          if (pattern.test(keyword.word)) {
            return category;
          }
        }
        
        return 'general';
      },
      
      formatQuality(quality) {
        if (quality >= 0.8) return '🌟 高品質';
        if (quality >= 0.6) return '✨ 良好';
        if (quality >= 0.4) return '👍 普通';
        return '🔄 要改善';
      }
    };

    // Safe Mode OS (Error Recovery Layer)
    this.safeMode = {
      name: 'Dynamic Keyword Safe Mode OS',
      active: false,
      
      activate() {
        console.log('🛡️ DynamicKeywordGenerator Safe Mode activated');
        this.active = true;
        
        return {
          basicGeneration: true,
          advancedFeatures: false,
          philosophy: 'haqei-safe'
        };
      },
      
      generateSafeKeywords(input) {
        // 最低限のキーワード生成
        const words = input
          .replace(/[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF]/g, ' ')
          .split(/\s+/)
          .filter(word => word.length >= 2)
          .slice(0, 10);
        
        return {
          original: input,
          base: words.map(word => ({ word, source: 'safe', importance: 0.5 })),
          expanded: words.map(word => ({ word, source: 'safe', importance: 0.5 })),
          contextual: words.map(word => ({ word, source: 'safe', importance: 0.5 })),
          final: words.map(word => ({ word, source: 'safe', importance: 0.5 })),
          metadata: {
            totalGenerated: words.length,
            expansionRatio: 1.0,
            contextQuality: 0.3,
            philosophy: 'haqei-safe'
          }
        };
      }
    };
  },

  // 初期化メソッド群
  initializeGenerationRules() {
    this.generationRules = {
      maxKeywords: 30,
      minImportance: 0.3,
      expansionRatio: 3.0,
      diversityThreshold: 0.7
    };
  },

  loadContextDatabase() {
    this.contextDatabase = {
      intents: {
        question: ['疑問', '質問', '理由', '方法', '時期', '場所', '対象'],
        request: ['依頼', '要求', '希望', '必要', '欲求', '願い'],
        decision: ['判断', '選択', '決定', '方針', '方向', '結論'],
        future: ['予測', '計画', '目標', '見通し', '期待', '希望'],
        problem: ['課題', '困難', '障害', '悩み', '心配', '対処'],
        goal: ['目的', '理想', '達成', '成功', '実現', '完遂']
      },
      emotions: {
        positive: ['喜び', '満足', '幸福', '楽しさ', '嬉しさ', '安心'],
        negative: ['悲しみ', '不安', '心配', '辛さ', '苦しさ', '困惑'],
        excited: ['興奮', '期待', 'わくわく', '楽しみ', '待望'],
        calm: ['落ち着き', '平静', '穏やか', '安定', '静寂'],
        anxious: ['不安', '緊張', '心配', '恐れ', '動揺'],
        confident: ['自信', '確信', '信念', '決意', '意志']
      },
      domains: {
        business: ['仕事', '会社', '職場', '業務', 'ビジネス', '企業', '組織'],
        relationship: ['人間関係', '友人', '恋人', '家族', '仲間', '絆'],
        health: ['健康', '体調', '病気', '治療', '予防', '運動'],
        learning: ['学習', '勉強', '知識', 'スキル', '成長', '理解'],
        hobby: ['趣味', '娯楽', '楽しみ', 'リラックス', '余暇']
      }
    };
  },

  // ヘルパーメソッド群
  inferReading(token) {
    // 簡易読み推定（実際の実装ではより高度な処理が必要）
    if (/[ひらがな]/.test(token)) return token;
    if (/[カタカナ]/.test(token)) return token;
    return token; // 漢字の読みは複雑なので、ここでは元のまま返す
  },

  inferPOS(token) {
    // 簡易品詞推定
    if (token.endsWith('する')) return '動詞';
    if (token.endsWith('だ') || token.endsWith('である')) return '助動詞';
    if (token.endsWith('な') || token.endsWith('の')) return '連体詞';
    if (/[。、！？]/.test(token)) return '記号';
    return '名詞'; // デフォルト
  },

  calculateTokenImportance(token) {
    let importance = 0.5; // 基準値
    
    // 長さによる重要度調整
    if (token.length >= 3) importance += 0.2;
    if (token.length >= 5) importance += 0.1;
    
    // 漢字が含まれる場合の重要度アップ
    if (/[一-龯]/.test(token)) importance += 0.2;
    
    // ひらがなのみの場合の重要度ダウン
    if (/^[あ-ん]+$/.test(token) && token.length <= 2) importance -= 0.3;
    
    return Math.max(0.1, Math.min(importance, 1.0));
  },

  getIntentKeywords(intent) {
    return this.contextDatabase.intents[intent] || [];
  },

  getEmotionKeywords(emotion) {
    return this.contextDatabase.emotions[emotion] || [];
  },

  getSemanticExpansions(word) {
    // 基本的なセマンティック展開
    const expansions = [];
    
    if (word.includes('問題')) expansions.push('課題', '困難', '解決');
    if (word.includes('未来')) expansions.push('将来', '希望', '計画');
    if (word.includes('成功')) expansions.push('達成', '成果', '結果');
    if (word.includes('関係')) expansions.push('繋がり', '絆', '交流');
    
    return expansions;
  },

  getRelatedWords(word, context) {
    const related = [];
    
    // コンテキストベースの関連語
    if (context.domain === 'business' && word.includes('目標')) {
      related.push('売上', '成果', 'KPI', '業績');
    }
    
    if (context.domain === 'relationship' && word.includes('信頼')) {
      related.push('理解', '尊重', '協力', '支援');
    }
    
    return related;
  },

  getSynonyms(word) {
    const synonymMap = {
      '問題': ['課題', 'トラブル', '困難'],
      '解決': ['対処', '解消', '改善'],
      '未来': ['将来', '今後', 'これから'],
      '成功': ['達成', '成果', '勝利']
    };
    
    return synonymMap[word] || [];
  },

  getDomainKeywords(domain) {
    return this.contextDatabase.domains[domain] || [];
  },

  getTimeframeKeywords(timeframe) {
    const timeframes = {
      past: ['経験', '学習', '反省', '記憶'],
      present: ['現状', '状況', '対応', '行動'],
      future: ['計画', '目標', '希望', '予測']
    };
    
    return timeframes[timeframe] || [];
  },

  getSituationKeywords(situation) {
    const situations = {
      crisis: ['緊急', '対応', '解決', '支援'],
      opportunity: ['チャンス', '可能性', '成長', '発展'],
      routine: ['日常', '習慣', '継続', '安定']
    };
    
    return situations[situation] || [];
  },

  calculateContextQuality(context) {
    let quality = 0.3; // 基準値
    
    if (context.domain) quality += 0.2;
    if (context.emotion && context.emotion !== 'neutral') quality += 0.2;
    if (context.timeframe) quality += 0.1;
    if (context.situation) quality += 0.2;
    
    return Math.min(quality, 1.0);
  },

  // 公開API
  async generateDynamicKeywords(input, context = {}) {
    if (!this.engineOS) {
      await this.init();
    }
    
    try {
      if (this.safeMode.active) {
        return this.safeMode.generateSafeKeywords(input);
      }
      
      const result = await this.engineOS.generateKeywords(input, context);
      return this.interfaceOS.formatGenerationResult(result);
      
    } catch (error) {
      console.error('❌ Dynamic keyword generation failed:', error);
      this.safeMode.activate();
      return this.safeMode.generateSafeKeywords(input);
    }
  },

  getGenerationCapabilities() {
    const capabilities = ['basic_generation', 'text_analysis'];
    
    if (this.contextDatabase) {
      capabilities.push('context_aware', 'domain_specific', 'intent_detection');
    }
    
    if (!this.safeMode.active) {
      capabilities.push('semantic_expansion', 'emotion_detection', 'entity_extraction');
    }
    
    return capabilities;
  }
};

// 自動初期化
document.addEventListener('DOMContentLoaded', () => {
  window.DynamicKeywordGenerator.init();
});

console.log('✅ DynamicKeywordGenerator loaded successfully with HaQei Philosophy');