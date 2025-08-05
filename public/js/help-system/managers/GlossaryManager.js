/**
 * HAQEI Intelligent Help System - Glossary Manager
 * 
 * Responsible for managing specialized terminology explanations
 * without changing existing terminology in the HAQEI system.
 * 
 * Key Terms Managed:
 * - Triple OS (Engine/Interface/Safe Mode)
 * - bunenjin (文人) philosophy framework
 * - 64卦 (Hexagram system)
 * - 序卦伝 (Sequential Hexagram Logic)
 * - 爻辞 (Line statements)
 * - Various I Ching concepts
 * 
 * Architecture:
 * ┌─────────────────────────────────────────────────────────────┐
 * │                  GlossaryManager                            │
 * │                                                             │
 * │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
 * │  │Term Database│  │Definition   │  │Context Engine       │  │
 * │  │- Japanese   │  │Engine       │  │- Usage detection    │  │
 * │  │- English    │  │- Multi-lang │  │- Relevance scoring  │  │
 * │  │- Technical  │  │- Examples   │  │- Smart suggestions  │  │
 * │  └─────────────┘  └─────────────┘  └─────────────────────┘  │
 * │                                                             │
 * │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
 * │  │Search Engine│  │Cache System │  │Learning Engine      │  │
 * │  │- Fuzzy match│  │- Fast lookup│  │- Usage patterns     │  │
 * │  │- Phonetic   │  │- Preload    │  │- User preferences   │  │
 * │  │- Semantic   │  │- Expire     │  │- Adaptive learning  │  │
 * │  └─────────────┘  └─────────────┘  └─────────────────────┘  │
 * └─────────────────────────────────────────────────────────────┘
 */

class GlossaryManager {
  constructor(helpSystem) {
    this.helpSystem = helpSystem;
    this.terms = new Map();
    this.searchIndexes = new Map();
    this.cache = new LRUCache(200); // Cache for 200 most accessed terms
    this.learningData = new Map();
    
    // Configuration
    this.config = {
      languages: ['ja', 'en'],
      defaultLanguage: 'ja',
      fuzzyThreshold: 0.7,
      cacheExpiry: 24 * 60 * 60 * 1000, // 24 hours
      maxSearchResults: 10
    };

    this.init();
  }

  async init() {
    try {
      // Load core terminology database
      await this.loadTermDatabase();
      
      // Build search indexes
      this.buildSearchIndexes();
      
      // Setup learning system
      this.initializeLearningSystem();
      
      console.log('✅ GlossaryManager initialized with', this.terms.size, 'terms');
    } catch (error) {
      console.error('❌ Failed to initialize GlossaryManager:', error);
      throw error;
    }
  }

  /**
   * Load the comprehensive term database
   */
  async loadTermDatabase() {
    // Core HAQEI terminology with detailed explanations
    const coreTerms = {
      // Triple OS Architecture
      'Triple OS': {
        id: 'triple-os',
        term: 'Triple OS',
        altTerms: ['トリプルOS', 'triple operating system'],
        category: 'architecture',
        definition: {
          ja: 'HAQEIシステムの中核となる3層アーキテクチャ。Engine（処理層）、Interface（操作層）、Safe Mode（安全層）から構成され、ユーザーの人格分析を多角的に実行する革新的なシステム構造です。',
          en: 'The core three-layer architecture of the HAQEI system, consisting of Engine (processing layer), Interface (operation layer), and Safe Mode (safety layer), providing a revolutionary system structure for multi-faceted personality analysis.'
        },
        explanation: {
          ja: {
            overview: 'Triple OSは、ユーザーの複雑な人格を安全かつ効率的に分析するために設計された3層構造システムです。',
            layers: {
              engine: 'Engine層：I Ching（易経）の64卦システムと現代心理学を融合した分析エンジン',
              interface: 'Interface層：ユーザーフレンドリーな操作インターフェースと結果表示システム',
              safemode: 'Safe Mode層：プライバシー保護と分析結果の安全な管理システム'
            },
            benefits: [
              '多角的な人格分析による高精度な結果',
              'ユーザープライバシーの徹底的な保護',
              '段階的な深い洞察の提供',
              '古代の叡智と現代技術の融合'
            ]
          },
          en: {
            overview: 'Triple OS is a three-layer system designed to analyze complex human personalities safely and efficiently.',
            layers: {
              engine: 'Engine Layer: Analysis engine combining I Ching 64 hexagram system with modern psychology',
              interface: 'Interface Layer: User-friendly operation interface and result display system',
              safemode: 'Safe Mode Layer: Privacy protection and secure management of analysis results'
            },
            benefits: [
              'High-precision results through multi-faceted personality analysis',
              'Thorough protection of user privacy',
              'Progressive provision of deep insights',
              'Fusion of ancient wisdom and modern technology'
            ]
          }
        },
        examples: [
          'Triple OSのEngine層が64卦の変化を分析します',
          'Interface層でユーザーの質問に答えてください',
          'Safe Mode層がプライバシーを保護しています'
        ],
        relatedTerms: ['64卦', 'bunenjin', '序卦伝', 'Engine', 'Interface', 'Safe Mode'],
        difficulty: 'intermediate',
        frequency: 'high'
      },

      'bunenjin': {
        id: 'bunenjin',
        term: 'bunenjin',
        altTerms: ['文人', 'ぶんじん', 'literati'],
        category: 'philosophy',
        definition: {
          ja: '古代中国の文人思想を現代に応用した、HAQEIシステムの哲学的基盤。知識、品格、洞察力を重視し、人格分析において深い精神性と実用性を両立させる思想的フレームワークです。',
          en: 'The philosophical foundation of the HAQEI system, applying ancient Chinese literati thought to modern times. A conceptual framework that emphasizes knowledge, character, and insight, balancing deep spirituality with practicality in personality analysis.'
        },
        explanation: {
          ja: {
            origin: 'bunenjinは古代中国の文人（学識と品格を備えた知識人）の思想を源流とします',
            principles: [
              '知識への敬意と継続的な学習',
              '品格と道徳的な判断力',
              '深い洞察力と直観的理解',
              '古典の叡智と現代的な応用の融合'
            ],
            application: 'HAQEIシステムでは、この哲学に基づいて人格分析のアルゴリズムが設計され、ユーザーに対して単なるデータ分析ではなく、人生の指針となる洞察を提供します。',
            modernRelevance: '現代社会においても、bunenjinの思想は自己理解と成長のための重要な視点を提供します。'
          },
          en: {
            origin: 'bunenjin originates from the ancient Chinese literati (intellectuals with learning and character) tradition',
            principles: [
              'Respect for knowledge and continuous learning',
              'Character and moral judgment',
              'Deep insight and intuitive understanding',
              'Fusion of classical wisdom with modern application'
            ],
            application: 'In the HAQEI system, personality analysis algorithms are designed based on this philosophy, providing users not just data analysis but life-guiding insights.',
            modernRelevance: 'Even in modern society, bunenjin thought provides important perspectives for self-understanding and growth.'
          }
        },
        examples: [
          'bunenjin哲学に基づいた分析結果をご覧ください',
          'この洞察はbunenjinの智慧から導かれています',
          'bunenjinアプローチで人格の深層を探求します'
        ],
        relatedTerms: ['Triple OS', '64卦', '序卦伝', '智慧', '洞察'],
        difficulty: 'advanced',
        frequency: 'medium'
      },

      '64卦': {
        id: '64-hexagram',
        term: '64卦',
        altTerms: ['ろくじゅうしけ', '64 hexagrams', 'sixty-four hexagrams', 'hexagram system'],
        category: 'iching',
        definition: {
          ja: 'I Ching（易経）の中核をなす64の卦象システム。各卦は6本の爻（陰爻・陽爻）から構成され、人生の状況や人格の特性を象徴的に表現する古代中国の智慧体系です。',
          en: 'The 64 hexagram system that forms the core of I Ching (Book of Changes). Each hexagram consists of 6 lines (yin and yang), representing a wisdom system from ancient China that symbolically expresses life situations and personality characteristics.'
        },
        explanation: {
          ja: {
            structure: '各卦は上卦（外卦）と下卦（内卦）の組み合わせで構成され、計64通りの状況を表現します',
            meaning: '卦は単なる占いではなく、人生の局面における適切な行動指針を示す智慧の体系です',
            application: 'HAQEIシステムでは、64卦を現代心理学と融合させ、科学的な人格分析手法として活用しています',
            examples: [
              '乾卦（第1卦）：創造的なリーダーシップを表す',
              '坤卦（第2卦）：受容性と協調性を表す',
              '屯卦（第3卦）：新しい始まりの困難を表す'
            ]
          },
          en: {
            structure: 'Each hexagram consists of an upper trigram (outer) and lower trigram (inner), expressing a total of 64 different situations',
            meaning: 'Hexagrams are not mere divination but a wisdom system that shows appropriate action guidelines for life situations',
            application: 'The HAQEI system fuses the 64 hexagrams with modern psychology, utilizing them as a scientific personality analysis method',
            examples: [
              'Qian (Hexagram 1): Represents creative leadership',
              'Kun (Hexagram 2): Represents receptivity and cooperation',
              'Zhun (Hexagram 3): Represents difficulties of new beginnings'
            ]
          }
        },
        examples: [
          '64卦システムがあなたの人格パターンを分析しています',
          'この結果は第23卦「山地剥」の智慧に基づいています',
          '64卦の相互関係から最適な行動指針を導出します'
        ],
        relatedTerms: ['序卦伝', '爻辞', 'bunenjin', 'Triple OS', 'I Ching'],
        difficulty: 'intermediate',
        frequency: 'high'
      },

      '序卦伝': {
        id: 'sequence-hexagram',
        term: '序卦伝',
        altTerms: ['じょかでん', 'Sequence of Hexagrams', 'hexagram sequence'],
        category: 'iching',
        definition: {
          ja: 'I Ching（易経）における64卦の配列原理と相互関係を説明する重要な解説書。各卦の論理的な配置と変化の法則を明確にし、人生の発展段階を体系的に示す古典的な智慧です。',
          en: 'An important commentary explaining the arrangement principles and interrelationships of the 64 hexagrams in I Ching. Classical wisdom that clarifies the logical placement of each hexagram and the laws of change, systematically showing life development stages.'
        },
        explanation: {
          ja: {
            purpose: '序卦伝は64卦がランダムに配置されているのではなく、深い論理と意味に基づいて順序付けられていることを解説します',
            logic: '各卦は前の卦から必然的に生まれ、次の卦へと発展していく有機的な関係性を持っています',
            application: 'HAQEIシステムでは、この論理を活用して人格の発展段階や成長の方向性を分析します',
            significance: '序卦伝の理解により、単独の卦の意味だけでなく、人生の流れ全体を把握できます'
          },
          en: {
            purpose: 'The Sequence of Hexagrams explains that the 64 hexagrams are not randomly arranged but ordered based on deep logic and meaning',
            logic: 'Each hexagram necessarily emerges from the previous one and develops into the next, forming organic relationships',
            application: 'The HAQEI system utilizes this logic to analyze personality development stages and growth directions',
            significance: 'Understanding the sequence allows grasping not just individual hexagram meanings but the entire flow of life'
          }
        },
        examples: [
          '序卦伝の論理に従って、次の発展段階を予測します',
          'この変化は序卦伝の法則に完全に一致しています',
          '序卦伝から見ると、現在は転換点にあります'
        ],
        relatedTerms: ['64卦', '爻辞', 'I Ching', '変化', '発展'],
        difficulty: 'advanced',
        frequency: 'low'
      },

      '爻辞': {
        id: 'line-statement',
        term: '爻辞',
        altTerms: ['こうじ', 'line statement', 'line text', 'yao text'],
        category: 'iching',
        definition: {
          ja: 'I Ching（易経）において、各卦を構成する6本の爻（線）に付けられた個別の解説文。具体的な状況における行動指針や注意点を詩的な表現で示す、実践的な智慧の集大成です。',
          en: 'Individual commentary texts attached to each of the 6 lines (yao) that compose each hexagram in I Ching. A compilation of practical wisdom that poetically expresses action guidelines and precautions for specific situations.'
        },
        explanation: {
          ja: {
            structure: '各卦には6つの爻があり、それぞれに固有の爻辞が付けられています',
            function: '爻辞は抽象的な卦の意味を具体的な行動レベルまで落とし込む役割を果たします',
            interpretation: '象徴的な表現が多いため、文脈と状況に応じた深い理解が必要です',
            practical: 'HAQEIシステムでは、爻辞を現代的に解釈して具体的なアドバイスを提供します'
          },
          en: {
            structure: 'Each hexagram has 6 lines, each with its unique line statement',
            function: 'Line statements serve to translate abstract hexagram meanings into concrete action levels',
            interpretation: 'Due to many symbolic expressions, deep understanding according to context and situation is necessary',
            practical: 'The HAQEI system provides concrete advice by interpreting line statements in a modern context'
          }
        },
        examples: [
          'この爻辞は「慎重な準備が成功の鍵」と示唆しています',
          '第3爻の爻辞が現在の状況に最も適合しています',
          '爻辞の智慧を現代の文脈で解釈すると...'
        ],
        relatedTerms: ['64卦', '序卦伝', 'I Ching', '智慧', '象徴'],
        difficulty: 'advanced',
        frequency: 'low'
      }
    };

    // Extended terminology for comprehensive coverage
    const extendedTerms = {
      'Engine': {
        id: 'engine-layer',
        term: 'Engine',
        altTerms: ['エンジン', 'engine layer', '処理層'],
        category: 'architecture',
        definition: {
          ja: 'Triple OSアーキテクチャの処理層。I Ching（易経）の64卦システムと現代心理学を融合した高度な分析アルゴリズムを実行し、ユーザーの深層心理を解析します。',
          en: 'The processing layer of Triple OS architecture. Executes advanced analysis algorithms that fuse the I Ching 64 hexagram system with modern psychology to analyze users\' deep psychology.'
        },
        relatedTerms: ['Triple OS', 'Interface', 'Safe Mode', '64卦'],
        difficulty: 'intermediate',
        frequency: 'medium'
      },

      'Interface': {
        id: 'interface-layer', 
        term: 'Interface',
        altTerms: ['インターフェース', 'interface layer', '操作層'],
        category: 'architecture',
        definition: {
          ja: 'Triple OSアーキテクチャの操作層。ユーザーフレンドリーな質問フローと直感的な結果表示を提供し、複雑な分析プロセスを分かりやすい形で体験できるようにします。',
          en: 'The operation layer of Triple OS architecture. Provides user-friendly question flows and intuitive result displays, making complex analysis processes accessible in an understandable format.'
        },
        relatedTerms: ['Triple OS', 'Engine', 'Safe Mode', 'UX'],
        difficulty: 'beginner',
        frequency: 'medium'
      },

      'Safe Mode': {
        id: 'safe-mode-layer',
        term: 'Safe Mode', 
        altTerms: ['セーフモード', 'safe mode layer', '安全層'],
        category: 'architecture',
        definition: {
          ja: 'Triple OSアーキテクチャの安全層。ユーザーのプライバシー保護、データセキュリティ、分析結果の適切な管理を担当し、安心してシステムを利用できる環境を提供します。',
          en: 'The safety layer of Triple OS architecture. Handles user privacy protection, data security, and appropriate management of analysis results, providing a secure environment for system use.'
        },
        relatedTerms: ['Triple OS', 'Engine', 'Interface', 'プライバシー'],
        difficulty: 'intermediate',
        frequency: 'low'
      }
    };

    // Merge all terms
    const allTerms = { ...coreTerms, ...extendedTerms };

    // Convert to Map for efficient access
    Object.entries(allTerms).forEach(([key, termData]) => {
      this.terms.set(key, termData);
      
      // Add alternative terms for search
      if (termData.altTerms) {
        termData.altTerms.forEach(altTerm => {
          this.terms.set(altTerm.toLowerCase(), termData);
        });
      }
    });
  }

  /**
   * Build search indexes for efficient term lookup
   */
  buildSearchIndexes() {
    this.searchIndexes.set('byCategory', new Map());
    this.searchIndexes.set('byDifficulty', new Map());
    this.searchIndexes.set('byFrequency', new Map());
    this.searchIndexes.set('fuzzy', new Map());

    this.terms.forEach((termData, key) => {
      // Category index
      const categoryIndex = this.searchIndexes.get('byCategory');
      if (!categoryIndex.has(termData.category)) {
        categoryIndex.set(termData.category, new Set());
      }
      categoryIndex.get(termData.category).add(key);

      // Difficulty index
      const difficultyIndex = this.searchIndexes.get('byDifficulty');
      if (!difficultyIndex.has(termData.difficulty)) {
        difficultyIndex.set(termData.difficulty, new Set());
      }
      difficultyIndex.get(termData.difficulty).add(key);

      // Frequency index
      const frequencyIndex = this.searchIndexes.get('byFrequency');
      if (!frequencyIndex.has(termData.frequency)) {
        frequencyIndex.set(termData.frequency, new Set());
      }
      frequencyIndex.get(termData.frequency).add(key);

      // Fuzzy search preparation
      const fuzzyIndex = this.searchIndexes.get('fuzzy');
      const searchText = (termData.term + ' ' + (termData.altTerms?.join(' ') || '')).toLowerCase();
      fuzzyIndex.set(key, searchText);
    });
  }

  /**
   * Initialize learning system for adaptive help
   */
  initializeLearningSystem() {
    // Load user learning data
    try {
      const saved = localStorage.getItem('haqei-help-learning');
      if (saved) {
        const data = JSON.parse(saved);
        this.learningData = new Map(Object.entries(data));
      }
    } catch (error) {
      console.warn('Failed to load learning data:', error);
    }

    // Setup periodic learning data save
    setInterval(() => {
      this.saveLearningData();
    }, 30000); // Save every 30 seconds
  }

  /**
   * Find term definition with context awareness
   */
  findTerm(query, context = {}) {
    const cacheKey = `find:${query}:${JSON.stringify(context)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    let results = [];

    // Exact match first
    const exactMatch = this.terms.get(query) || this.terms.get(query.toLowerCase());
    if (exactMatch) {
      results.push({ term: exactMatch, score: 1.0, matchType: 'exact' });
    }

    // Fuzzy matching
    const fuzzyResults = this.fuzzySearch(query);
    results.push(...fuzzyResults);

    // Context-aware filtering and scoring
    if (context.currentPage || context.userAction) {
      results = this.applyContextualScoring(results, context);
    }

    // Sort by relevance score
    results.sort((a, b) => b.score - a.score);

    // Limit results
    results = results.slice(0, this.config.maxSearchResults);

    // Cache results
    this.cache.set(cacheKey, results);

    // Update learning data
    this.updateLearningData(query, results[0]?.term);

    return results;
  }

  /**
   * Fuzzy search implementation
   */
  fuzzySearch(query) {
    const results = [];
    const queryLower = query.toLowerCase();
    const fuzzyIndex = this.searchIndexes.get('fuzzy');

    fuzzyIndex.forEach((searchText, termKey) => {
      const score = this.calculateSimilarity(queryLower, searchText);
      if (score >= this.config.fuzzyThreshold) {
        const termData = this.terms.get(termKey);
        if (termData) {
          results.push({ 
            term: termData, 
            score, 
            matchType: 'fuzzy' 
          });
        }
      }
    });

    return results;
  }

  /**
   * Calculate string similarity using multiple algorithms
   */
  calculateSimilarity(str1, str2) {
    // Combine multiple similarity measures
    const jaccardScore = this.jaccardSimilarity(str1, str2);
    const levenshteinScore = this.levenshteinSimilarity(str1, str2);
    const containsScore = str2.includes(str1) ? 0.8 : 0;

    // Weighted combination
    return Math.max(
      jaccardScore * 0.4 + levenshteinScore * 0.4 + containsScore * 0.2,
      containsScore
    );
  }

  /**
   * Apply contextual scoring based on current usage context
   */
  applyContextualScoring(results, context) {
    return results.map(result => {
      let contextScore = 1.0;

      // Boost score based on current page context
      if (context.currentPage) {
        if (result.term.category === this.getRelevantCategory(context.currentPage)) {
          contextScore *= 1.3;
        }
      }

      // Boost based on user level
      if (context.userLevel) {
        if (result.term.difficulty === context.userLevel) {
          contextScore *= 1.2;
        }
      }

      // Boost frequently used terms
      if (result.term.frequency === 'high') {
        contextScore *= 1.1;
      }

      return {
        ...result,
        score: result.score * contextScore
      };
    });
  }

  /**
   * Get contextual help suggestions
   */
  getContextualSuggestions(context) {
    const suggestions = [];
    const currentPage = context.currentPage || '';

    // Page-specific suggestions
    if (currentPage.includes('os_analyzer')) {
      suggestions.push(...this.getTermsByCategory('architecture'));
      suggestions.push(...this.getTermsByCategory('iching'));
    }

    if (currentPage.includes('future_simulator')) {
      suggestions.push(...this.getTermsByCategory('iching'));
      suggestions.push(...this.getTermsByCategory('philosophy'));
    }

    // User level appropriate suggestions
    const userLevel = context.userLevel || 'beginner';
    const levelAppropriate = this.getTermsByDifficulty(userLevel);
    suggestions.push(...levelAppropriate);

    return this.deduplicateAndLimit(suggestions, 5);
  }

  /**
   * Get terms by category
   */
  getTermsByCategory(category) {
    const categoryIndex = this.searchIndexes.get('byCategory');
    const termKeys = categoryIndex.get(category) || new Set();
    return Array.from(termKeys).map(key => this.terms.get(key)).filter(Boolean);
  }

  /**
   * Get terms by difficulty level
   */
  getTermsByDifficulty(difficulty) {
    const difficultyIndex = this.searchIndexes.get('byDifficulty');
    const termKeys = difficultyIndex.get(difficulty) || new Set();
    return Array.from(termKeys).map(key => this.terms.get(key)).filter(Boolean);
  }

  /**
   * Update learning data based on user interactions
   */
  updateLearningData(query, selectedTerm) {
    const key = query.toLowerCase();
    const current = this.learningData.get(key) || { 
      count: 0, 
      lastAccessed: Date.now(),
      selectedTerms: new Map()
    };

    current.count++;
    current.lastAccessed = Date.now();

    if (selectedTerm) {
      const termCount = current.selectedTerms.get(selectedTerm.id) || 0;
      current.selectedTerms.set(selectedTerm.id, termCount + 1);
    }

    this.learningData.set(key, current);
  }

  /**
   * Save learning data to localStorage
   */
  saveLearningData() {
    try {
      const data = Object.fromEntries(
        Array.from(this.learningData.entries()).map(([key, value]) => [
          key,
          {
            ...value,
            selectedTerms: Object.fromEntries(value.selectedTerms)
          }
        ])
      );
      localStorage.setItem('haqei-help-learning', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save learning data:', error);
    }
  }

  // Utility methods
  jaccardSimilarity(str1, str2) {
    const set1 = new Set(str1.split(''));
    const set2 = new Set(str2.split(''));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
  }

  levenshteinSimilarity(str1, str2) {
    const distance = this.levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    return maxLength === 0 ? 1 : 1 - distance / maxLength;
  }

  levenshteinDistance(str1, str2) {
    const matrix = Array(str2.length + 1).fill().map(() => Array(str1.length + 1).fill(0));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j - 1][i] + 1,
          matrix[j][i - 1] + 1,
          matrix[j - 1][i - 1] + cost
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  getRelevantCategory(page) {
    if (page.includes('os_analyzer')) return 'architecture';
    if (page.includes('future_simulator')) return 'iching';
    if (page.includes('philosophy')) return 'philosophy';
    return 'general';
  }

  deduplicateAndLimit(items, limit) {
    const seen = new Set();
    const unique = items.filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
    return unique.slice(0, limit);
  }

  // Public API
  search(query, context = {}) {
    return this.findTerm(query, context);
  }

  getDefinition(termId, language = 'ja') {
    const term = this.terms.get(termId);
    if (!term) return null;

    return {
      term: term.term,
      definition: term.definition[language] || term.definition.ja,
      explanation: term.explanation[language] || term.explanation.ja,
      examples: term.examples || [],
      relatedTerms: term.relatedTerms || []
    };
  }

  getSuggestions(context = {}) {
    return this.getContextualSuggestions(context);
  }

  getStats() {
    return {
      totalTerms: this.terms.size,
      cacheSize: this.cache.size,
      learningDataSize: this.learningData.size
    };
  }
}

// Simple LRU Cache implementation
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return null;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  get size() {
    return this.cache.size;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GlossaryManager;
} else if (typeof window !== 'undefined') {
  window.GlossaryManager = GlossaryManager;
}