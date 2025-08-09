/**
 * Keyword Expansion Engine - HaQei Philosophy Implementation
 * Triple OS Architecture: Engine Layer Component
 * 
 * キーワード拡張エンジン
 * - セマンティック関連語の生成
 * - コンテキスト理解による拡張
 * - 矛盾受容型語彙展開
 */

class KeywordExpansionEngine {
  constructor() {
    this.initialized = false;
    this.semanticDatabase = null;
    this.expansionRules = null;
    this.contextAnalyzer = null;
    
    // HaQei Philosophy: 語彙の不完全性を受容
    this.acceptContradiction = {
      precise_ambiguous: true,        // 正確な曖昧性
      complete_incomplete: true,      // 完全な不完全性
      logical_associative: true,      // 論理的な連想性
      structured_organic: true        // 構造化された有機性
    };
    
    // Triple OS Architecture Components
    this.engineOS = null;
    this.interfaceOS = null;
    this.safeMode = null;
    
    this.init();
  }
  
  async init() {
    console.log('📚 [KeywordExpansionEngine] 初期化開始 - HaQei 語彙拡張');
    
    try {
      // Triple OS Architecture Setup
      this.initializeTripleOS();
      
      // セマンティックデータベース初期化
      await this.initializeSemanticDatabase();
      
      // 拡張ルール設定
      await this.setupExpansionRules();
      
      // コンテキスト分析器初期化
      await this.initializeContextAnalyzer();
      
      this.initialized = true;
      console.log('✅ [KeywordExpansionEngine] 語彙拡張システム準備完了');
      
    } catch (error) {
      console.error('❌ [KeywordExpansionEngine] 初期化エラー:', error);
      this.activateSafeMode();
    }
  }
  
  initializeTripleOS() {
    console.log('🔧 [KeywordExpansionEngine] Triple OS Architecture 初期化');
    
    // Engine OS (Core Expansion Logic)
    this.engineOS = {
      name: 'Keyword Engine OS',
      version: '1.0.0',
      philosophy: 'haqei-expansion',
      
      async expandKeywords(keywords, context = {}) {
        try {
          if (!keywords || keywords.length === 0) {
            return this.createEmptyExpansion();
          }
          
          const expansions = new Map();
          
          for (const keyword of keywords) {
            const expansion = await this.expandSingleKeyword(keyword, context);
            expansions.set(keyword, expansion);
          }
          
          const consolidated = this.consolidateExpansions(expansions);
          const contextFiltered = this.filterByContext(consolidated, context);
          
          return {
            original: keywords,
            expanded: contextFiltered,
            totalExpansions: contextFiltered.length,
            expansionRatio: contextFiltered.length / keywords.length,
            context: context,
            philosophy: 'haqei-expanded'
          };
          
        } catch (error) {
          console.warn('⚠️ キーワード拡張エラー:', error);
          return this.createBasicExpansion(keywords);
        }
      },
      
      async expandSingleKeyword(keyword, context) {
        const expansions = [];
        
        // セマンティック関連語
        expansions.push(...this.findSemanticRelations(keyword));
        
        // 同義語・類義語
        expansions.push(...this.findSynonyms(keyword));
        
        // 連想語
        expansions.push(...this.findAssociations(keyword, context));
        
        // 上位・下位概念
        expansions.push(...this.findHierarchicalRelations(keyword));
        
        // コンテキスト特化語
        expansions.push(...this.findContextSpecificTerms(keyword, context));
        
        // 易経関連展開
        expansions.push(...this.findIChingRelations(keyword));
        
        return {
          keyword: keyword,
          expansions: this.deduplicateAndScore(expansions),
          method: 'multi_strategy',
          philosophy: 'haqei-semantic'
        };
      },
      
      findSemanticRelations(keyword) {
        const relations = [];
        const semanticMap = this.getSemanticMap();
        
        // 直接的セマンティック関係
        if (semanticMap.has(keyword)) {
          const related = semanticMap.get(keyword);
          relations.push(...related.map(term => ({
            term: term.word,
            relation: 'semantic',
            strength: term.strength || 0.7,
            category: term.category || 'general'
          })));
        }
        
        // パターンマッチングによる関連語発見
        relations.push(...this.findPatternBasedRelations(keyword));
        
        return relations;
      },
      
      findSynonyms(keyword) {
        const synonyms = [];
        const synonymMap = this.getSynonymMap();
        
        if (synonymMap.has(keyword)) {
          const syns = synonymMap.get(keyword);
          synonyms.push(...syns.map(syn => ({
            term: syn,
            relation: 'synonym',
            strength: 0.9,
            category: 'equivalent'
          })));
        }
        
        return synonyms;
      },
      
      findAssociations(keyword, context) {
        const associations = [];
        
        // コンテキストベースの連想
        if (context.domain) {
          associations.push(...this.findDomainAssociations(keyword, context.domain));
        }
        
        // 感情的連想
        associations.push(...this.findEmotionalAssociations(keyword));
        
        // 時間的連想
        associations.push(...this.findTemporalAssociations(keyword));
        
        // 空間的連想
        associations.push(...this.findSpatialAssociations(keyword));
        
        return associations;
      },
      
      findDomainAssociations(keyword, domain) {
        const domainMaps = this.getDomainMaps();
        const associations = [];
        
        if (domainMaps.has(domain)) {
          const domainMap = domainMaps.get(domain);
          
          if (domainMap.has(keyword)) {
            const related = domainMap.get(keyword);
            associations.push(...related.map(term => ({
              term: term,
              relation: 'domain_association',
              strength: 0.6,
              category: domain
            })));
          }
        }
        
        return associations;
      },
      
      findEmotionalAssociations(keyword) {
        const emotional = [];
        const emotionMap = this.getEmotionMap();
        
        // 感情語との関連性チェック
        for (const [emotion, relatedTerms] of emotionMap) {
          if (relatedTerms.includes(keyword)) {
            emotional.push(...this.getEmotionalExpansions(emotion).map(term => ({
              term: term,
              relation: 'emotional',
              strength: 0.5,
              category: emotion
            })));
          }
        }
        
        return emotional;
      },
      
      findTemporalAssociations(keyword) {
        const temporal = [];
        const timeWords = ['過去', '現在', '未来', '時間', '瞬間', '永遠'];
        
        if (timeWords.some(tw => keyword.includes(tw))) {
          temporal.push(...[
            { term: '変化', relation: 'temporal', strength: 0.6, category: 'time' },
            { term: '流れ', relation: 'temporal', strength: 0.5, category: 'time' },
            { term: '循環', relation: 'temporal', strength: 0.4, category: 'time' }
          ]);
        }
        
        return temporal;
      },
      
      findSpatialAssociations(keyword) {
        const spatial = [];
        const spaceWords = ['場所', '空間', '距離', '位置', '方向'];
        
        if (spaceWords.some(sw => keyword.includes(sw))) {
          spatial.push(...[
            { term: '境界', relation: 'spatial', strength: 0.6, category: 'space' },
            { term: '広がり', relation: 'spatial', strength: 0.5, category: 'space' },
            { term: '中心', relation: 'spatial', strength: 0.4, category: 'space' }
          ]);
        }
        
        return spatial;
      },
      
      findHierarchicalRelations(keyword) {
        const hierarchical = [];
        const hierarchyMap = this.getHierarchyMap();
        
        if (hierarchyMap.has(keyword)) {
          const relations = hierarchyMap.get(keyword);
          
          // 上位概念
          if (relations.superordinates) {
            hierarchical.push(...relations.superordinates.map(term => ({
              term: term,
              relation: 'hypernym',
              strength: 0.7,
              category: 'hierarchy'
            })));
          }
          
          // 下位概念
          if (relations.subordinates) {
            hierarchical.push(...relations.subordinates.map(term => ({
              term: term,
              relation: 'hyponym',
              strength: 0.6,
              category: 'hierarchy'
            })));
          }
        }
        
        return hierarchical;
      },
      
      findContextSpecificTerms(keyword, context) {
        const contextTerms = [];
        
        if (context.situation) {
          contextTerms.push(...this.findSituationalTerms(keyword, context.situation));
        }
        
        if (context.emotion) {
          contextTerms.push(...this.findEmotionalContext(keyword, context.emotion));
        }
        
        if (context.timeframe) {
          contextTerms.push(...this.findTemporalContext(keyword, context.timeframe));
        }
        
        return contextTerms;
      },
      
      findSituationalTerms(keyword, situation) {
        const situationMap = {
          'decision': ['選択', '判断', '決断', '方針', '方向'],
          'relationship': ['人間関係', '絆', '信頼', '理解', '協力'],
          'career': ['仕事', '職業', '成長', '成功', '目標'],
          'health': ['健康', '体調', 'バランス', '回復', '維持'],
          'learning': ['学習', '知識', '理解', '発見', '成長']
        };
        
        const terms = situationMap[situation] || [];
        
        return terms.map(term => ({
          term: term,
          relation: 'situational',
          strength: 0.5,
          category: situation
        }));
      },
      
      findIChingRelations(keyword) {
        const ichingRelations = [];
        const ichingMap = this.getIChingMap();
        
        // 易経概念との関連性チェック
        for (const [concept, relatedTerms] of ichingMap) {
          if (relatedTerms.includes(keyword) || keyword.includes(concept)) {
            ichingRelations.push(...this.getIChingExpansions(concept).map(term => ({
              term: term,
              relation: 'iching',
              strength: 0.6,
              category: 'philosophy'
            })));
          }
        }
        
        return ichingRelations;
      },
      
      findPatternBasedRelations(keyword) {
        const patterns = [];
        
        // 語尾パターンによる関連語
        if (keyword.endsWith('する')) {
          const base = keyword.slice(0, -2);
          patterns.push(...[
            { term: base + 'できる', relation: 'pattern', strength: 0.4, category: 'ability' },
            { term: base + 'したい', relation: 'pattern', strength: 0.4, category: 'desire' },
            { term: base + 'される', relation: 'pattern', strength: 0.3, category: 'passive' }
          ]);
        }
        
        // 語頭パターンによる関連語
        if (keyword.startsWith('不')) {
          const base = keyword.slice(1);
          patterns.push({ term: base, relation: 'negation', strength: 0.8, category: 'opposite' });
        }
        
        return patterns;
      },
      
      deduplicateAndScore(expansions) {
        const unique = new Map();
        
        expansions.forEach(exp => {
          const key = exp.term;
          if (unique.has(key)) {
            // 既存の項目がある場合、より高いスコアを保持
            const existing = unique.get(key);
            if (exp.strength > existing.strength) {
              unique.set(key, exp);
            }
          } else {
            unique.set(key, exp);
          }
        });
        
        return Array.from(unique.values())
          .sort((a, b) => b.strength - a.strength) // スコア順ソート
          .slice(0, 20); // 上位20件に制限
      },
      
      consolidateExpansions(expansions) {
        const consolidated = [];
        
        expansions.forEach((expansion, originalKeyword) => {
          expansion.expansions.forEach(exp => {
            consolidated.push({
              original: originalKeyword,
              expanded: exp.term,
              relation: exp.relation,
              strength: exp.strength,
              category: exp.category
            });
          });
        });
        
        return consolidated;
      },
      
      filterByContext(expansions, context) {
        if (!context.filter) {
          return expansions;
        }
        
        return expansions.filter(exp => {
          // 最低スコア閾値
          if (context.minStrength && exp.strength < context.minStrength) {
            return false;
          }
          
          // カテゴリーフィルター
          if (context.categories && !context.categories.includes(exp.category)) {
            return false;
          }
          
          // 関係タイプフィルター
          if (context.relations && !context.relations.includes(exp.relation)) {
            return false;
          }
          
          return true;
        });
      },
      
      createEmptyExpansion() {
        return {
          original: [],
          expanded: [],
          totalExpansions: 0,
          expansionRatio: 0,
          context: {},
          philosophy: 'haqei-empty'
        };
      },
      
      createBasicExpansion(keywords) {
        const basicExpansions = keywords.flatMap(keyword => [
          { original: keyword, expanded: keyword + '関連', relation: 'basic', strength: 0.3, category: 'general' },
          { original: keyword, expanded: keyword + '的', relation: 'basic', strength: 0.3, category: 'general' }
        ]);
        
        return {
          original: keywords,
          expanded: basicExpansions,
          totalExpansions: basicExpansions.length,
          expansionRatio: 2, // 基本的に2倍拡張
          context: {},
          philosophy: 'haqei-basic'
        };
      }
    };
    
    // Interface OS (User Interaction Layer)
    this.interfaceOS = {
      name: 'Keyword Interface OS',
      
      formatExpansionResult(result) {
        return {
          display: {
            summary: {
              original: result.original.length,
              expanded: result.totalExpansions,
              ratio: this.formatRatio(result.expansionRatio)
            },
            categories: this.groupByCategory(result.expanded),
            relations: this.groupByRelation(result.expanded),
            topExpansions: this.getTopExpansions(result.expanded, 10)
          },
          philosophy: result.philosophy
        };
      },
      
      formatRatio(ratio) {
        return `${Math.round(ratio * 10) / 10}x`;
      },
      
      groupByCategory(expansions) {
        const grouped = {};
        
        expansions.forEach(exp => {
          const category = exp.category || 'uncategorized';
          if (!grouped[category]) {
            grouped[category] = [];
          }
          grouped[category].push(exp);
        });
        
        return Object.entries(grouped).map(([category, items]) => ({
          category: this.formatCategoryName(category),
          count: items.length,
          items: items.slice(0, 5) // 上位5件表示
        }));
      },
      
      groupByRelation(expansions) {
        const grouped = {};
        
        expansions.forEach(exp => {
          const relation = exp.relation || 'unrelated';
          if (!grouped[relation]) {
            grouped[relation] = [];
          }
          grouped[relation].push(exp);
        });
        
        return Object.entries(grouped).map(([relation, items]) => ({
          relation: this.formatRelationName(relation),
          count: items.length,
          averageStrength: this.calculateAverageStrength(items)
        }));
      },
      
      getTopExpansions(expansions, count = 10) {
        return expansions
          .sort((a, b) => b.strength - a.strength)
          .slice(0, count)
          .map(exp => ({
            term: exp.expanded,
            original: exp.original,
            strength: this.formatPercentage(exp.strength),
            relation: this.formatRelationName(exp.relation),
            category: this.formatCategoryName(exp.category)
          }));
      },
      
      formatCategoryName(category) {
        const categoryNames = {
          general: '📋 一般',
          equivalent: '🔄 同等',
          hierarchy: '📊 階層',
          time: '⏰ 時間',
          space: '🗺️ 空間',
          emotion: '🎭 感情',
          philosophy: '☯️ 哲学',
          decision: '🎯 決断',
          relationship: '👥 人間関係',
          career: '💼 仕事',
          health: '🏥 健康',
          learning: '📚 学習',
          ability: '💪 能力',
          desire: '💝 願望'
        };
        
        return categoryNames[category] || `📌 ${category}`;
      },
      
      formatRelationName(relation) {
        const relationNames = {
          semantic: '🧠 意味的',
          synonym: '🔄 同義',
          association: '🔗 連想',
          hypernym: '⬆️ 上位概念',
          hyponym: '⬇️ 下位概念',
          emotional: '🎭 感情的',
          temporal: '⏰ 時間的',
          spatial: '🗺️ 空間的',
          situational: '🎬 状況的',
          iching: '☯️ 易経',
          pattern: '🔍 パターン',
          negation: '❌ 否定',
          basic: '🛡️ 基本'
        };
        
        return relationNames[relation] || `🔗 ${relation}`;
      },
      
      calculateAverageStrength(items) {
        if (items.length === 0) return 0;
        const sum = items.reduce((total, item) => total + item.strength, 0);
        return Math.round((sum / items.length) * 100) / 100;
      },
      
      formatPercentage(ratio) {
        return Math.round(ratio * 100) + '%';
      }
    };
    
    // Safe Mode OS (Fallback Layer)
    this.safeMode = {
      name: 'Keyword Safe Mode OS',
      active: false,
      
      activate() {
        console.log('🛡️ [KeywordExpansionEngine] Safe Mode 起動');
        this.active = true;
        
        return {
          basicExpansion: true,
          advancedFeatures: false,
          philosophy: 'haqei-safe'
        };
      },
      
      generateSafeExpansion(keywords) {
        const safeExpansions = keywords.flatMap(keyword => [
          {
            original: keyword,
            expanded: keyword,
            relation: 'identity',
            strength: 1.0,
            category: 'safe'
          }
        ]);
        
        return {
          original: keywords,
          expanded: safeExpansions,
          totalExpansions: safeExpansions.length,
          expansionRatio: 1.0,
          context: {},
          philosophy: 'haqei-safe'
        };
      }
    };
    
    console.log('✅ [KeywordExpansionEngine] Triple OS Architecture 準備完了');
  }
  
  async initializeSemanticDatabase() {
    console.log('🧠 [KeywordExpansionEngine] セマンティックデータベース初期化');
    
    this.semanticDatabase = {
      semanticMap: this.createSemanticMap(),
      synonymMap: this.createSynonymMap(),
      hierarchyMap: this.createHierarchyMap(),
      domainMaps: this.createDomainMaps(),
      emotionMap: this.createEmotionMap(),
      ichingMap: this.createIChingMap()
    };
  }
  
  createSemanticMap() {
    const semanticMap = new Map();
    
    // 基本的なセマンティック関係
    semanticMap.set('未来', [
      { word: '希望', strength: 0.8, category: 'emotion' },
      { word: '計画', strength: 0.7, category: 'action' },
      { word: '予測', strength: 0.6, category: 'cognition' },
      { word: '変化', strength: 0.7, category: 'process' }
    ]);
    
    semanticMap.set('決断', [
      { word: '選択', strength: 0.9, category: 'action' },
      { word: '判断', strength: 0.8, category: 'cognition' },
      { word: '意思決定', strength: 0.9, category: 'process' },
      { word: '責任', strength: 0.6, category: 'ethics' }
    ]);
    
    semanticMap.set('変化', [
      { word: '成長', strength: 0.7, category: 'process' },
      { word: '進歩', strength: 0.6, category: 'improvement' },
      { word: '転換', strength: 0.8, category: 'transformation' },
      { word: '発展', strength: 0.7, category: 'development' }
    ]);
    
    semanticMap.set('問題', [
      { word: '課題', strength: 0.9, category: 'challenge' },
      { word: '困難', strength: 0.8, category: 'obstacle' },
      { word: '解決', strength: 0.7, category: 'solution' },
      { word: '対応', strength: 0.6, category: 'response' }
    ]);
    
    return semanticMap;
  }
  
  createSynonymMap() {
    const synonymMap = new Map();
    
    synonymMap.set('問題', ['課題', 'トラブル', '困難', '障害']);
    synonymMap.set('解決', ['対処', '解消', '克服', '改善']);
    synonymMap.set('未来', ['将来', '今後', 'これから']);
    synonymMap.set('過去', ['以前', '昔', 'かつて']);
    synonymMap.set('現在', ['今', '現時点', '目下']);
    
    return synonymMap;
  }
  
  createHierarchyMap() {
    const hierarchyMap = new Map();
    
    hierarchyMap.set('感情', {
      superordinates: ['心理', '精神', '内面'],
      subordinates: ['喜び', '悲しみ', '怒り', '恐怖', '愛']
    });
    
    hierarchyMap.set('行動', {
      superordinates: ['活動', '動作', '実践'],
      subordinates: ['歩く', '話す', '考える', '決める', '作る']
    });
    
    return hierarchyMap;
  }
  
  createDomainMaps() {
    const domainMaps = new Map();
    
    // ビジネス・仕事ドメイン
    const businessMap = new Map();
    businessMap.set('成功', ['達成', '成果', '業績', '結果', '効果']);
    businessMap.set('目標', ['ゴール', '狙い', '目的', '理想', 'ビジョン']);
    domainMaps.set('business', businessMap);
    
    // 人間関係ドメイン
    const relationshipMap = new Map();
    relationshipMap.set('信頼', ['安心', '確信', '頼り', '依存', '絆']);
    relationshipMap.set('愛', ['愛情', '慈愛', '恋愛', '愛着', '好意']);
    domainMaps.set('relationship', relationshipMap);
    
    return domainMaps;
  }
  
  createEmotionMap() {
    const emotionMap = new Map();
    
    emotionMap.set('joy', ['嬉しい', '楽しい', '幸せ', '満足', '喜び']);
    emotionMap.set('sadness', ['悲しい', '寂しい', '辛い', '苦しい', '憂鬱']);
    emotionMap.set('anger', ['怒り', '憤り', 'イライラ', '腹立つ', '激怒']);
    emotionMap.set('fear', ['不安', '恐怖', '心配', '怖い', '緊張']);
    emotionMap.set('love', ['愛', '好き', '大切', '愛情', '慈しみ']);
    
    return emotionMap;
  }
  
  createIChingMap() {
    const ichingMap = new Map();
    
    ichingMap.set('乾', ['天', '創造', '強健', '積極', 'リーダー']);
    ichingMap.set('坤', ['地', '受容', '柔順', '母性', '包容']);
    ichingMap.set('震', ['雷', '動き', '始まり', '発動', '覚醒']);
    ichingMap.set('巽', ['風', '浸透', '影響', '柔軟', '適応']);
    ichingMap.set('坎', ['水', '危険', '困難', '流動', '深淵']);
    ichingMap.set('離', ['火', '明智', '光明', '分離', '美']);
    ichingMap.set('艮', ['山', '静止', '瞑想', '境界', '安定']);
    ichingMap.set('兌', ['沢', '喜悦', '満足', '交流', '調和']);
    
    return ichingMap;
  }
  
  // Utility methods
  getSemanticMap() {
    return this.semanticDatabase?.semanticMap || new Map();
  }
  
  getSynonymMap() {
    return this.semanticDatabase?.synonymMap || new Map();
  }
  
  getHierarchyMap() {
    return this.semanticDatabase?.hierarchyMap || new Map();
  }
  
  getDomainMaps() {
    return this.semanticDatabase?.domainMaps || new Map();
  }
  
  getEmotionMap() {
    return this.semanticDatabase?.emotionMap || new Map();
  }
  
  getIChingMap() {
    return this.semanticDatabase?.ichingMap || new Map();
  }
  
  getEmotionalExpansions(emotion) {
    const expansions = {
      joy: ['幸福', '満足', '達成', '成功'],
      sadness: ['失望', '孤独', '損失', '別れ'],
      anger: ['不満', '対立', '競争', '挑戦'],
      fear: ['危険', '未知', '変化', '失敗'],
      love: ['絆', '調和', '統合', '平和']
    };
    
    return expansions[emotion] || [];
  }
  
  getIChingExpansions(concept) {
    const expansions = {
      '乾': ['創造性', '指導力', '決断力', '積極性'],
      '坤': ['受容性', '協調性', '柔軟性', '忍耐力'],
      '震': ['行動力', '変革力', '発動力', '覚醒'],
      '巽': ['影響力', '浸透力', '適応力', '調整'],
      '坎': ['困難', '試練', '深さ', '流動'],
      '離': ['明晰性', '理解', '分別', '美'],
      '艮': ['静寂', '集中', '境界', '停止'],
      '兌': ['喜び', '交流', '満足', '調和']
    };
    
    return expansions[concept] || [];
  }
  
  async setupExpansionRules() {
    console.log('📋 [KeywordExpansionEngine] 拡張ルール設定');
    
    this.expansionRules = {
      maxExpansionsPerKeyword: 20,
      minStrength: 0.3,
      
      strengthWeights: {
        semantic: 1.0,
        synonym: 0.9,
        association: 0.6,
        hierarchy: 0.7,
        contextual: 0.5,
        iching: 0.6,
        pattern: 0.4
      },
      
      categoryPriorities: {
        philosophy: 0.8,
        emotion: 0.7,
        action: 0.6,
        cognition: 0.6,
        time: 0.5,
        space: 0.5
      }
    };
  }
  
  async initializeContextAnalyzer() {
    console.log('🔍 [KeywordExpansionEngine] コンテキスト分析器初期化');
    
    this.contextAnalyzer = {
      analyzeSituation: (context) => {
        return {
          domain: context.domain || 'general',
          emotion: context.emotion || 'neutral',
          timeframe: context.timeframe || 'present',
          complexity: context.complexity || 0.5
        };
      },
      
      inferContext: (keywords) => {
        const inferred = {
          domain: 'general',
          emotion: 'neutral',
          timeframe: 'present'
        };
        
        // ドメイン推定
        if (keywords.some(k => ['仕事', '会社', 'ビジネス'].includes(k))) {
          inferred.domain = 'business';
        } else if (keywords.some(k => ['愛', '恋愛', '友人', '家族'].includes(k))) {
          inferred.domain = 'relationship';
        }
        
        // 感情推定
        if (keywords.some(k => ['嬉しい', '楽しい', '幸せ'].includes(k))) {
          inferred.emotion = 'positive';
        } else if (keywords.some(k => ['悲しい', '辛い', '苦しい'].includes(k))) {
          inferred.emotion = 'negative';
        }
        
        // 時間軸推定
        if (keywords.some(k => ['未来', '将来', 'これから'].includes(k))) {
          inferred.timeframe = 'future';
        } else if (keywords.some(k => ['過去', '昔', '以前'].includes(k))) {
          inferred.timeframe = 'past';
        }
        
        return inferred;
      }
    };
  }
  
  activateSafeMode() {
    console.log('🛡️ [KeywordExpansionEngine] Safe Mode 起動');
    this.safeMode.activate();
    this.initialized = true;
  }
  
  // Public API
  async expandKeywords(keywords, context = {}) {
    if (!this.initialized) {
      await this.init();
    }
    
    try {
      if (this.safeMode.active) {
        return this.safeMode.generateSafeExpansion(keywords);
      }
      
      // コンテキスト自動推定
      if (!context.domain && !context.emotion && !context.timeframe) {
        context = { ...context, ...this.contextAnalyzer.inferContext(keywords) };
      }
      
      const result = await this.engineOS.expandKeywords(keywords, context);
      return this.interfaceOS.formatExpansionResult(result);
      
    } catch (error) {
      console.error('❌ [KeywordExpansionEngine] 拡張エラー:', error);
      return this.safeMode.generateSafeExpansion(keywords);
    }
  }
  
  getStatus() {
    return {
      initialized: this.initialized,
      safeModeActive: this.safeMode?.active || false,
      databaseReady: !!this.semanticDatabase,
      rulesReady: !!this.expansionRules,
      analyzerReady: !!this.contextAnalyzer,
      philosophy: 'haqei',
      architecture: 'triple-os'
    };
  }
  
  getExpansionCapabilities() {
    const capabilities = ['basic_expansion'];
    
    if (this.semanticDatabase) {
      capabilities.push('semantic_relations', 'synonym_mapping', 'hierarchical_expansion');
    }
    
    if (this.contextAnalyzer) {
      capabilities.push('context_inference', 'domain_specific_expansion');
    }
    
    if (!this.safeMode?.active) {
      capabilities.push('iching_expansion', 'emotional_associations', 'pattern_matching');
    }
    
    return capabilities;
  }
}

// Global instance with HaQei Philosophy
if (typeof window !== 'undefined') {
  window.KeywordExpansionEngine = new KeywordExpansionEngine();
  
  // Global convenience function
  window.expandKeywords = async function(keywords, context) {
    return await window.KeywordExpansionEngine.expandKeywords(keywords, context);
  };
}

console.log('✅ [KeywordExpansionEngine] HaQei Philosophy Implementation Loaded');