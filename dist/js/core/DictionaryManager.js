/**
 * DictionaryManager - HaQei Philosophy Dictionary System
 * 辞書管理システム - HaQei哲学統合
 * Triple OS Architecture: Engine Layer
 */

console.log('📚 DictionaryManager Loading with HaQei Philosophy...');

window.DictionaryManager = {
  // 初期化状態
  initialized: false,
  
  // Triple OS Architecture
  engineOS: null,
  interfaceOS: null,
  safeMode: null,
  
  // HaQei哲学辞書データ
  dictionaries: {
    haqei_philosophy: null,
    iching_terms: null,
    semantic_relations: null,
    emotional_lexicon: null,
    wisdom_patterns: null
  },
  
  // 初期化
  async init() {
    console.log('🚀 DictionaryManager initializing...');
    
    try {
      this.setupTripleOSArchitecture();
      await this.loadHaQeiDictionaries();
      await this.buildSemanticNetworks();
      this.validateDictionaryIntegrity();
      
      this.initialized = true;
      console.log('✅ DictionaryManager initialized with HaQei philosophy');
    } catch (error) {
      console.error('❌ DictionaryManager initialization failed:', error);
      this.activateSafeMode();
    }
  },
  
  // Triple OS Architecture セットアップ
  setupTripleOSArchitecture() {
    console.log('🔧 Setting up Triple OS Architecture for Dictionary...');
    
    // Engine OS (Dictionary Core Engine)
    this.engineOS = {
      name: 'Dictionary Engine OS',
      version: '1.0.0',
      philosophy: 'haqei-dictionary',
      
      // 語彙検索エンジン
      async lookupTerm(term, options = {}) {
        try {
          const results = {
            term: term,
            definitions: [],
            semantic_relations: [],
            haqei_associations: [],
            usage_examples: [],
            emotional_connotations: [],
            wisdom_connections: []
          };
          
          // 基本定義検索
          results.definitions = this.findDefinitions(term);
          
          // セマンティック関係検索
          results.semantic_relations = this.findSemanticRelations(term);
          
          // HaQei関連検索
          results.haqei_associations = this.findHaQeiAssociations(term);
          
          // 使用例検索
          results.usage_examples = this.findUsageExamples(term);
          
          // 感情的含意
          results.emotional_connotations = this.analyzeEmotionalConnotations(term);
          
          // 智慧的関連
          results.wisdom_connections = this.findWisdomConnections(term);
          
          return {
            query: term,
            results: results,
            confidence: this.calculateLookupConfidence(results),
            philosophy: 'haqei-enhanced'
          };
          
        } catch (error) {
          console.warn('⚠️ Dictionary lookup error:', error);
          return this.createFallbackLookup(term);
        }
      },
      
      // 基本定義検索
      findDefinitions(term) {
        const definitions = [];
        
        // HaQei哲学辞書から検索
        if (this.dictionaries.haqei_philosophy && this.dictionaries.haqei_philosophy.has(term)) {
          const haqeiDef = this.dictionaries.haqei_philosophy.get(term);
          definitions.push({
            source: 'haqei_philosophy',
            definition: haqeiDef.definition,
            principles: haqeiDef.principles,
            applications: haqeiDef.applications
          });
        }
        
        // 易経用語辞書から検索
        if (this.dictionaries.iching_terms && this.dictionaries.iching_terms.has(term)) {
          const ichingDef = this.dictionaries.iching_terms.get(term);
          definitions.push({
            source: 'iching_terms',
            definition: ichingDef.definition,
            hexagram: ichingDef.hexagram,
            trigram: ichingDef.trigram,
            classical_meaning: ichingDef.classical_meaning
          });
        }
        
        // 一般辞書フォールバック
        if (definitions.length === 0) {
          definitions.push(this.generateBasicDefinition(term));
        }
        
        return definitions;
      },
      
      // セマンティック関係検索
      findSemanticRelations(term) {
        const relations = [];
        
        if (this.dictionaries.semantic_relations) {
          const network = this.dictionaries.semantic_relations.get(term);
          if (network) {
            relations.push(...network.synonyms.map(syn => ({ type: 'synonym', term: syn, strength: 0.9 })));
            relations.push(...network.antonyms.map(ant => ({ type: 'antonym', term: ant, strength: 0.8 })));
            relations.push(...network.hypernyms.map(hyp => ({ type: 'hypernym', term: hyp, strength: 0.7 })));
            relations.push(...network.hyponyms.map(hypo => ({ type: 'hyponym', term: hypo, strength: 0.7 })));
            relations.push(...network.meronyms.map(mer => ({ type: 'meronym', term: mer, strength: 0.6 })));
            relations.push(...network.holonyms.map(hol => ({ type: 'holonym', term: hol, strength: 0.6 })));
          }
        }
        
        return relations.sort((a, b) => b.strength - a.strength);
      },
      
      // HaQei関連検索
      findHaQeiAssociations(term) {
        const associations = [];
        
        // 調和原理との関連
        const harmonyTerms = ['調和', '平和', 'バランス', '協調', '統合'];
        if (harmonyTerms.some(ht => term.includes(ht) || ht.includes(term))) {
          associations.push({
            principle: 'harmony',
            connection: 'direct',
            description: '調和の原理に直接関連する概念です',
            practical_application: '協力と統合を促進する文脈で使用されます'
          });
        }
        
        // 慈悲原理との関連
        const compassionTerms = ['慈悲', '愛', '思いやり', '共感', '理解', '支援'];
        if (compassionTerms.some(ct => term.includes(ct) || ct.includes(term))) {
          associations.push({
            principle: 'compassion',
            connection: 'direct',
            description: '慈悲の原理に直接関連する概念です',
            practical_application: '他者への理解と支援の文脈で使用されます'
          });
        }
        
        // 智慧原理との関連
        const wisdomTerms = ['智慧', '知恵', '学習', '成長', '洞察', '理解'];
        if (wisdomTerms.some(wt => term.includes(wt) || wt.includes(term))) {
          associations.push({
            principle: 'wisdom',
            connection: 'direct',
            description: '智慧の原理に直接関連する概念です',
            practical_application: '学習と成長の文脈で使用されます'
          });
        }
        
        // 真実原理との関連
        const authenticityTerms = ['真実', '誠実', '正直', '自然', '純粋'];
        if (authenticityTerms.some(at => term.includes(at) || at.includes(term))) {
          associations.push({
            principle: 'authenticity',
            connection: 'direct',
            description: '真実の原理に直接関連する概念です',
            practical_application: '誠実な表現と行動の文脈で使用されます'
          });
        }
        
        return associations;
      },
      
      // 使用例検索
      findUsageExamples(term) {
        const examples = [];
        
        // HaQei哲学的使用例
        const haqeiExamples = {
          '調和': [
            '人々の調和を促進することが重要です',
            'この解決策は全体の調和を保ちます',
            '内面の調和が外面に反映されます'
          ],
          '慈悲': [
            '慈悲深い心で他者に接します',
            'この行動は慈悲の精神から生まれました',
            '慈悲は智慧と共に歩みます'
          ],
          '智慧': [
            '経験から智慧を得ることができます',
            'この智慧を日常生活に活かします',
            '智慧は実践によって深まります'
          ],
          '真実': [
            '真実を語ることの大切さを学びました',
            'この真実は心の奥深くから湧き上がります',
            '真実は時として厳しいものです'
          ]
        };
        
        if (haqeiExamples[term]) {
          examples.push(...haqeiExamples[term].map(example => ({
            text: example,
            context: 'haqei_philosophy',
            usage_type: 'philosophical'
          })));
        }
        
        return examples;
      },
      
      // 感情的含意分析
      analyzeEmotionalConnotations(term) {
        const connotations = [];
        
        if (this.dictionaries.emotional_lexicon) {
          const emotionData = this.dictionaries.emotional_lexicon.get(term);
          if (emotionData) {
            connotations.push({
              valence: emotionData.valence, // positive/negative/neutral
              arousal: emotionData.arousal,  // high/medium/low
              dominance: emotionData.dominance, // high/medium/low
              primary_emotions: emotionData.primary_emotions,
              secondary_emotions: emotionData.secondary_emotions
            });
          }
        }
        
        return connotations;
      },
      
      // 智慧的関連検索
      findWisdomConnections(term) {
        const connections = [];
        
        if (this.dictionaries.wisdom_patterns) {
          const patterns = this.dictionaries.wisdom_patterns.get(term);
          if (patterns) {
            connections.push(...patterns.map(pattern => ({
              pattern_type: pattern.type,
              wisdom_tradition: pattern.tradition,
              teaching: pattern.teaching,
              application: pattern.application,
              relevance_score: pattern.relevance
            })));
          }
        }
        
        return connections.sort((a, b) => b.relevance_score - a.relevance_score);
      },
      
      // 基本定義生成
      generateBasicDefinition(term) {
        return {
          source: 'generated',
          definition: `「${term}」に関連する概念`,
          note: 'HaQei辞書に定義が見つからないため、基本的な説明を提供しています',
          suggestion: 'より詳細な定義については、HaQei哲学の文脈での使用例を参照してください'
        };
      },
      
      // ルックアップ信頼度計算
      calculateLookupConfidence(results) {
        let confidence = 0;
        
        if (results.definitions.length > 0) confidence += 0.3;
        if (results.semantic_relations.length > 0) confidence += 0.2;
        if (results.haqei_associations.length > 0) confidence += 0.2;
        if (results.usage_examples.length > 0) confidence += 0.15;
        if (results.emotional_connotations.length > 0) confidence += 0.1;
        if (results.wisdom_connections.length > 0) confidence += 0.05;
        
        return Math.min(confidence, 1.0);
      },
      
      // フォールバックルックアップ
      createFallbackLookup(term) {
        return {
          query: term,
          results: {
            term: term,
            definitions: [this.generateBasicDefinition(term)],
            semantic_relations: [],
            haqei_associations: [],
            usage_examples: [],
            emotional_connotations: [],
            wisdom_connections: []
          },
          confidence: 0.2,
          philosophy: 'haqei-fallback'
        };
      }
    };
    
    // Interface OS (User Interaction Layer)
    this.interfaceOS = {
      name: 'Dictionary Interface OS',
      
      formatLookupResult(result) {
        return {
          query: result.query,
          summary: {
            confidence: Math.round(result.confidence * 100) + '%',
            definitions_found: result.results.definitions.length,
            relations_found: result.results.semantic_relations.length,
            haqei_relevance: result.results.haqei_associations.length > 0 ? 'high' : 'low'
          },
          definitions: this.formatDefinitions(result.results.definitions),
          relations: this.formatRelations(result.results.semantic_relations),
          haqei_insights: this.formatHaQeiInsights(result.results.haqei_associations),
          usage_guide: this.formatUsageGuide(result.results.usage_examples),
          emotional_profile: this.formatEmotionalProfile(result.results.emotional_connotations),
          wisdom_teachings: this.formatWisdomTeachings(result.results.wisdom_connections)
        };
      },
      
      formatDefinitions(definitions) {
        return definitions.map(def => ({
          source: this.formatSourceName(def.source),
          definition: def.definition,
          additional_info: this.extractAdditionalInfo(def)
        }));
      },
      
      formatSourceName(source) {
        const sourceNames = {
          haqei_philosophy: '📚 HaQei哲学辞書',
          iching_terms: '☯️ 易経用語辞書',
          emotional_lexicon: '💭 感情語彙辞書',
          generated: '🔍 自動生成'
        };
        
        return sourceNames[source] || `📖 ${source}`;
      },
      
      extractAdditionalInfo(definition) {
        const info = {};
        
        if (definition.principles) info.principles = definition.principles;
        if (definition.applications) info.applications = definition.applications;
        if (definition.hexagram) info.hexagram = definition.hexagram;
        if (definition.trigram) info.trigram = definition.trigram;
        
        return info;
      },
      
      formatRelations(relations) {
        return relations.slice(0, 10).map(rel => ({
          type: this.formatRelationType(rel.type),
          term: rel.term,
          strength: Math.round(rel.strength * 100) + '%'
        }));
      },
      
      formatRelationType(type) {
        const typeNames = {
          synonym: '🔄 同義語',
          antonym: '↔️ 対義語',
          hypernym: '⬆️ 上位語',
          hyponym: '⬇️ 下位語',
          meronym: '🧩 部分語',
          holonym: '🏢 全体語'
        };
        
        return typeNames[type] || `🔗 ${type}`;
      },
      
      formatHaQeiInsights(associations) {
        return associations.map(assoc => ({
          principle: this.formatPrincipleName(assoc.principle),
          connection: assoc.connection,
          description: assoc.description,
          application: assoc.practical_application
        }));
      },
      
      formatPrincipleName(principle) {
        const principleNames = {
          harmony: '🤝 調和',
          compassion: '💖 慈悲',
          wisdom: '🧠 智慧',
          authenticity: '✨ 真実'
        };
        
        return principleNames[principle] || `🔷 ${principle}`;
      },
      
      formatUsageGuide(examples) {
        return {
          total_examples: examples.length,
          sample_usage: examples.slice(0, 3).map(ex => ({
            text: ex.text,
            context: ex.context,
            type: ex.usage_type
          }))
        };
      },
      
      formatEmotionalProfile(connotations) {
        if (connotations.length === 0) return null;
        
        const profile = connotations[0];
        return {
          valence: profile.valence,
          arousal: profile.arousal,
          dominance: profile.dominance,
          primary_emotions: profile.primary_emotions || [],
          secondary_emotions: profile.secondary_emotions || []
        };
      },
      
      formatWisdomTeachings(connections) {
        return connections.slice(0, 3).map(conn => ({
          tradition: conn.wisdom_tradition,
          teaching: conn.teaching,
          application: conn.application,
          relevance: Math.round(conn.relevance_score * 100) + '%'
        }));
      }
    };
    
    // Safe Mode OS (Fallback Layer)
    this.safeMode = {
      name: 'Dictionary Safe Mode OS',
      active: false,
      
      activate() {
        console.log('🛡️ DictionaryManager Safe Mode activated');
        this.active = true;
        
        return {
          basic_lookup: true,
          advanced_features: false,
          philosophy: 'haqei-safe'
        };
      },
      
      performSafeLookup(term) {
        return {
          query: term,
          results: {
            term: term,
            definitions: [{
              source: 'safe_mode',
              definition: `「${term}」の基本的な概念`,
              note: 'Safe Mode実行中 - 詳細な辞書機能は利用できません'
            }],
            semantic_relations: [],
            haqei_associations: [],
            usage_examples: [],
            emotional_connotations: [],
            wisdom_connections: []
          },
          confidence: 0.1,
          philosophy: 'haqei-safe'
        };
      }
    };
    
    console.log('✅ Triple OS Architecture setup complete');
  },
  
  // HaQei辞書読み込み
  async loadHaQeiDictionaries() {
    console.log('📖 Loading HaQei dictionaries...');
    
    // HaQei哲学辞書
    this.dictionaries.haqei_philosophy = new Map([
      ['調和', {
        definition: '異なる要素が統合され、バランスの取れた状態',
        principles: ['unity', 'balance', 'cooperation'],
        applications: ['conflict_resolution', 'team_building', 'personal_growth']
      }],
      ['慈悲', {
        definition: '他者への無条件の愛と思いやり',
        principles: ['compassion', 'empathy', 'kindness'],
        applications: ['healing', 'support', 'understanding']
      }],
      ['智慧', {
        definition: '深い理解と賢明な判断力',
        principles: ['insight', 'discernment', 'understanding'],
        applications: ['decision_making', 'learning', 'guidance']
      }],
      ['真実', {
        definition: '偽りのない純粋で自然な状態',
        principles: ['honesty', 'authenticity', 'purity'],
        applications: ['communication', 'self_expression', 'integrity']
      }]
    ]);
    
    // 易経用語辞書
    this.dictionaries.iching_terms = new Map([
      ['乾', {
        definition: '天・創造的な力・父性原理',
        hexagram: 1,
        trigram: '乾',
        classical_meaning: '強健・創造・指導'
      }],
      ['坤', {
        definition: '地・受容的な力・母性原理',
        hexagram: 2,
        trigram: '坤',
        classical_meaning: '柔順・受容・育成'
      }],
      ['泰', {
        definition: '天地交通・平和・調和',
        hexagram: 11,
        trigram: '坤/乾',
        classical_meaning: '通泰・繁栄・協力'
      }]
    ]);
    
    // セマンティック関係
    this.dictionaries.semantic_relations = new Map([
      ['調和', {
        synonyms: ['平和', 'バランス', '統合', '協調'],
        antonyms: ['対立', '混乱', '不和', '分裂'],
        hypernyms: ['状態', '関係', '概念'],
        hyponyms: ['内的調和', '外的調和', '社会的調和'],
        meronyms: ['相互理解', '協力', 'バランス'],
        holonyms: ['平和', '幸福', '成功']
      }],
      ['愛', {
        synonyms: ['慈悲', '思いやり', '愛情', '慈愛'],
        antonyms: ['憎しみ', '無関心', '冷淡'],
        hypernyms: ['感情', '心情', '精神状態'],
        hyponyms: ['家族愛', '友愛', '自愛', '博愛'],
        meronyms: ['思いやり', '共感', '理解'],
        holonyms: ['幸福', '調和', '平和']
      }]
    ]);
    
    // 感情辞書
    this.dictionaries.emotional_lexicon = new Map([
      ['調和', {
        valence: 'positive',
        arousal: 'medium',
        dominance: 'high',
        primary_emotions: ['peace', 'satisfaction'],
        secondary_emotions: ['balance', 'unity']
      }],
      ['慈悲', {
        valence: 'positive',
        arousal: 'medium',
        dominance: 'medium',
        primary_emotions: ['love', 'compassion'],
        secondary_emotions: ['kindness', 'empathy']
      }]
    ]);
    
    // 智慧パターン
    this.dictionaries.wisdom_patterns = new Map([
      ['調和', [
        {
          type: 'balance_principle',
          tradition: 'eastern_philosophy',
          teaching: '中庸の道を歩む',
          application: '極端を避け、バランスを保つ',
          relevance: 0.9
        },
        {
          type: 'integration_wisdom',
          tradition: 'haqei_philosophy',
          teaching: '対立を統合に変える',
          application: '異なる視点を調和させる',
          relevance: 0.95
        }
      ]],
      ['智慧', [
        {
          type: 'learning_principle',
          tradition: 'universal_wisdom',
          teaching: '経験から学ぶ',
          application: '失敗を成長の機会とする',
          relevance: 0.85
        }
      ]]
    ]);
    
    console.log('✅ HaQei dictionaries loaded');
  },
  
  // セマンティックネットワーク構築
  async buildSemanticNetworks() {
    console.log('🕸️ Building semantic networks...');
    
    // 辞書間の関連性を構築
    this.semanticNetwork = {
      // HaQei原理間の関連
      principle_relations: new Map([
        ['調和', ['慈悲', '智慧', '真実']],
        ['慈悲', ['調和', '智慧', '真実']],
        ['智慧', ['調和', '慈悲', '真実']],
        ['真実', ['調和', '慈悲', '智慧']]
      ]),
      
      // 易経との関連
      iching_relations: new Map([
        ['調和', ['泰', '謙', '既済']],
        ['創造', ['乾', '震', '離']],
        ['受容', ['坤', '巽', '坎']]
      ])
    };
    
    console.log('✅ Semantic networks built');
  },
  
  // 辞書整合性検証
  validateDictionaryIntegrity() {
    console.log('🔍 Validating dictionary integrity...');
    
    const validation = {
      haqei_philosophy: this.dictionaries.haqei_philosophy?.size || 0,
      iching_terms: this.dictionaries.iching_terms?.size || 0,
      semantic_relations: this.dictionaries.semantic_relations?.size || 0,
      emotional_lexicon: this.dictionaries.emotional_lexicon?.size || 0,
      wisdom_patterns: this.dictionaries.wisdom_patterns?.size || 0
    };
    
    this.validationResults = validation;
    console.log('✅ Dictionary integrity validated:', validation);
  },
  
  // Safe Mode起動
  activateSafeMode() {
    console.log('🛡️ Activating Safe Mode...');
    this.safeMode.activate();
    this.initialized = true;
  },
  
  // 公開API - 用語検索
  async lookupTerm(term, options = {}) {
    if (!this.initialized) {
      await this.init();
    }
    
    try {
      if (this.safeMode.active) {
        return this.safeMode.performSafeLookup(term);
      }
      
      const rawResult = await this.engineOS.lookupTerm(term, options);
      
      return this.interfaceOS.formatLookupResult(rawResult);
      
    } catch (error) {
      console.error('❌ Term lookup failed:', error);
      this.safeMode.activate();
      return this.safeMode.performSafeLookup(term);
    }
  },
  
  // 複数用語一括検索
  async lookupMultipleTerms(terms, options = {}) {
    const results = [];
    
    for (const term of terms) {
      const result = await this.lookupTerm(term, options);
      results.push(result);
    }
    
    return {
      query_terms: terms,
      results: results,
      total_found: results.filter(r => r.summary.confidence !== '10%').length
    };
  },
  
  // セマンティック関係検索
  async findSemanticRelations(term, relation_type = 'all') {
    if (!this.initialized) {
      await this.init();
    }
    
    if (this.dictionaries.semantic_relations.has(term)) {
      const relations = this.dictionaries.semantic_relations.get(term);
      
      if (relation_type === 'all') {
        return relations;
      } else {
        return relations[relation_type] || [];
      }
    }
    
    return [];
  },
  
  // HaQei原理関連検索
  async findHaQeiRelations(term) {
    if (!this.initialized) {
      await this.init();
    }
    
    const relations = [];
    
    if (this.semanticNetwork?.principle_relations?.has(term)) {
      const related = this.semanticNetwork.principle_relations.get(term);
      relations.push(...related.map(rel => ({ type: 'haqei_principle', term: rel })));
    }
    
    return relations;
  },
  
  // ステータス取得
  getStatus() {
    return {
      initialized: this.initialized,
      safe_mode_active: this.safeMode?.active || false,
      dictionaries_loaded: Object.keys(this.dictionaries).length,
      total_entries: Object.values(this.dictionaries).reduce((total, dict) => {
        return total + (dict?.size || 0);
      }, 0),
      validation_results: this.validationResults || {},
      philosophy: 'haqei',
      architecture: 'triple-os'
    };
  },
  
  // 辞書機能一覧取得
  getCapabilities() {
    const capabilities = ['basic_lookup'];
    
    if (this.dictionaries.haqei_philosophy) {
      capabilities.push('haqei_philosophy_lookup');
    }
    
    if (this.dictionaries.iching_terms) {
      capabilities.push('iching_terms_lookup');
    }
    
    if (this.dictionaries.semantic_relations) {
      capabilities.push('semantic_relations_search');
    }
    
    if (this.semanticNetwork) {
      capabilities.push('semantic_network_analysis');
    }
    
    if (!this.safeMode?.active) {
      capabilities.push('advanced_lookup', 'emotional_analysis', 'wisdom_connections');
    }
    
    return capabilities;
  }
};

// 自動初期化
document.addEventListener('DOMContentLoaded', () => {
  window.DictionaryManager.init();
});

console.log('✅ DictionaryManager loaded with HaQei Philosophy');