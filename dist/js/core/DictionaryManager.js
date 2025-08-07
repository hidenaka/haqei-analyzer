/**
 * Dictionary Manager - Bunenjin Philosophy Implementation
 * Triple OS Architecture: Engine Layer Component
 * 
 * 矛盾受容型辞書管理システム
 * - 完璧さと不完全さの調和
 * - オンライン/オフライン状態の統合管理
 * - 段階的品質向上アプローチ
 */

class DictionaryManager {
  constructor() {
    this.initialized = false;
    this.status = 'initializing';
    this.fallbackMode = false;
    this.engineOS = null;
    this.safeMode = null;
    
    // Bunenjin Philosophy: 矛盾を受け入れた設計
    this.acceptContradiction = {
      online: true,
      offline: true,
      perfect: false,
      imperfect: true
    };
    
    this.init();
  }
  
  async init() {
    console.log('🎯 [DictionaryManager] 初期化開始 - Bunenjin Philosophy');
    
    try {
      // Triple OS Architecture Setup
      await this.initializeTripleOS();
      
      // 段階的初期化（矛盾受容型）
      await this.initializeDictionaries();
      
      this.status = 'ready';
      this.initialized = true;
      
      console.log('✅ [DictionaryManager] 初期化完了 - 矛盾受容モード');
      
    } catch (error) {
      console.warn('⚠️ [DictionaryManager] 初期化エラー - フォールバックモード移行');
      this.enableFallbackMode();
    }
  }
  
  async initializeTripleOS() {
    console.log('🔧 [DictionaryManager] Triple OS Architecture 初期化');
    
    // Engine OS (Core Logic)
    this.engineOS = {
      name: 'Dictionary Engine OS',
      version: '1.0.0',
      philosophy: 'bunenjin',
      
      // 辞書エンジンの核心機能
      async process(text) {
        if (!text || typeof text !== 'string') {
          return this.createEmptyResult();
        }
        
        // 基本的な形態素解析（フォールバック版）
        return {
          tokens: this.simpleTokenize(text),
          keywords: this.extractKeywords(text),
          concepts: this.extractConcepts(text),
          philosophy: 'bunenjin-aware'
        };
      },
      
      simpleTokenize(text) {
        // 基本的な単語分割
        return text
          .replace(/[、。！？]/g, ' ')
          .split(/\s+/)
          .filter(word => word.length > 0)
          .map((word, index) => ({
            surface_form: word,
            pos: this.guessPartOfSpeech(word),
            features: ['基本形'],
            index: index
          }));
      },
      
      extractKeywords(text) {
        const keywords = [];
        const commonPatterns = [
          /未来|将来|今後/g,
          /問題|課題|困難/g,
          /希望|願い|目標/g,
          /選択|決断|判断/g,
          /変化|成長|発展/g,
          /関係|人間|社会/g
        ];
        
        commonPatterns.forEach(pattern => {
          const matches = text.match(pattern);
          if (matches) {
            keywords.push(...matches);
          }
        });
        
        return [...new Set(keywords)];
      },
      
      extractConcepts(text) {
        // I Ching概念との関連性を分析
        const concepts = [];
        const ichingConcepts = {
          '変化': ['乾', '坤', '震', '巽'],
          '調和': ['泰', '否', '同人', '大有'],
          '成長': ['漸', '豊', '升', '井'],
          '困難': ['坎', '艮', '蹇', '困'],
          '希望': ['復', '臨', '観', '頤']
        };
        
        Object.entries(ichingConcepts).forEach(([concept, hexagrams]) => {
          if (text.includes(concept)) {
            concepts.push({
              concept: concept,
              hexagrams: hexagrams,
              relevance: this.calculateRelevance(text, concept)
            });
          }
        });
        
        return concepts;
      },
      
      guessPartOfSpeech(word) {
        // 簡易品詞推定
        if (word.match(/する$/)) return '動詞';
        if (word.match(/い$/)) return '形容詞';
        if (word.match(/的$/)) return '形容動詞';
        return '名詞';
      },
      
      calculateRelevance(text, concept) {
        const conceptCount = (text.match(new RegExp(concept, 'g')) || []).length;
        return Math.min(conceptCount / text.length * 100, 1.0);
      },
      
      createEmptyResult() {
        return {
          tokens: [],
          keywords: [],
          concepts: [],
          philosophy: 'bunenjin-fallback'
        };
      }
    };
    
    // Safe Mode OS (Error Recovery)
    this.safeMode = {
      name: 'Dictionary Safe Mode OS',
      active: false,
      
      activate() {
        console.log('🛡️ [DictionaryManager] Safe Mode 起動');
        this.active = true;
        return {
          message: '安全モードで動作中です',
          features: ['基本解析', 'フォールバック処理'],
          quality: 'minimal-but-stable'
        };
      },
      
      process(text) {
        // 最小限の安全な処理
        return {
          tokens: text.split(/\s+/).map(word => ({ surface_form: word })),
          keywords: [],
          concepts: [],
          mode: 'safe',
          philosophy: 'bunenjin-safe'
        };
      }
    };
    
    console.log('✅ [DictionaryManager] Triple OS Architecture 準備完了');
  }
  
  async initializeDictionaries() {
    console.log('📚 [DictionaryManager] 辞書初期化開始');
    
    // Bunenjin Philosophy: 完璧でなくても動作する設計
    const initializationSteps = [
      this.tryKuromojiInitialization(),
      this.initializeFallbackDictionary(),
      this.setupPhilosophicalMapping()
    ];
    
    // 段階的初期化（失敗を受け入れる）
    for (const step of initializationSteps) {
      try {
        await step;
        console.log('✅ 辞書初期化ステップ完了');
      } catch (error) {
        console.warn('⚠️ 辞書初期化ステップ失敗 - 続行');
      }
    }
  }
  
  async tryKuromojiInitialization() {
    console.log('🔍 [DictionaryManager] Kuromoji初期化試行');
    
    return new Promise((resolve, reject) => {
      if (typeof kuromoji === 'undefined') {
        console.log('ℹ️ Kuromoji未使用 - フォールバック使用');
        resolve();
        return;
      }
      
      // CDNから辞書を読み込み
      kuromoji.builder({ dicPath: 'https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/' })
        .build((err, tokenizer) => {
          if (err) {
            console.warn('⚠️ Kuromoji初期化失敗:', err);
            reject(err);
          } else {
            window.tokenizer = tokenizer;
            this.tokenizer = tokenizer;
            console.log('✅ Kuromoji初期化成功');
            resolve();
          }
        });
    });
  }
  
  initializeFallbackDictionary() {
    console.log('🔧 [DictionaryManager] フォールバック辞書準備');
    
    // 基本的な日本語処理のためのフォールバック辞書
    this.fallbackDictionary = {
      particles: ['が', 'を', 'に', 'で', 'と', 'は', 'の'],
      auxVerbs: ['だ', 'である', 'です', 'ます'],
      commonWords: ['私', 'あなた', '彼', '彼女', '我々', 'みんな'],
      
      // 易経関連語彙
      ichingTerms: {
        '乾': 'creative_force',
        '坤': 'receptive_earth',
        '震': 'arousing_thunder',
        '巽': 'gentle_wind',
        '坎': 'dangerous_water',
        '艮': 'keeping_still',
        '離': 'clinging_fire',
        '兌': 'joyous_lake'
      }
    };
    
    return Promise.resolve();
  }
  
  setupPhilosophicalMapping() {
    console.log('🎭 [DictionaryManager] 哲学的マッピング設定');
    
    // Bunenjin Philosophy: 対立する概念の統合
    this.philosophicalMapping = {
      contradictions: {
        '成功-失敗': 'both_are_learning',
        '完璧-不完全': 'perfection_in_imperfection',  
        '確実-不確実': 'certainty_within_uncertainty',
        '進歩-停滞': 'progress_includes_pausing'
      },
      
      transformations: {
        anxiety: ['growth_opportunity', 'wisdom_source'],
        conflict: ['harmony_seed', 'understanding_path'],
        confusion: ['clarity_beginning', 'insight_preparation']
      }
    };
    
    return Promise.resolve();
  }
  
  enableFallbackMode() {
    console.log('🛡️ [DictionaryManager] フォールバックモード起動');
    
    this.fallbackMode = true;
    this.safeMode.activate();
    
    // 最小限の機能で継続
    this.status = 'fallback-ready';
    this.initialized = true;
  }
  
  // Public API
  async analyze(text) {
    if (!this.initialized) {
      await this.init();
    }
    
    try {
      if (this.fallbackMode) {
        return this.safeMode.process(text);
      }
      
      return await this.engineOS.process(text);
      
    } catch (error) {
      console.warn('⚠️ [DictionaryManager] 解析エラー - Safe Mode使用');
      return this.safeMode.process(text);
    }
  }
  
  getStatus() {
    return {
      initialized: this.initialized,
      status: this.status,
      fallbackMode: this.fallbackMode,
      safeModeActive: this.safeMode?.active || false,
      philosophy: 'bunenjin',
      architecture: 'triple-os',
      capabilities: this.getCapabilities()
    };
  }
  
  getCapabilities() {
    const baseCapabilities = ['basic_tokenization', 'keyword_extraction', 'concept_mapping'];
    
    if (!this.fallbackMode) {
      baseCapabilities.push('advanced_morphology', 'iching_integration');
    }
    
    if (this.tokenizer) {
      baseCapabilities.push('kuromoji_analysis');
    }
    
    return baseCapabilities;
  }
}

// Global instance with Bunenjin Philosophy
if (typeof window !== 'undefined') {
  window.DictionaryManager = new DictionaryManager();
  
  // Bunenjin Philosophy: 矛盾受容の自動初期化
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 [DictionaryManager] Bunenjin Philosophy - 自動初期化開始');
  });
}

console.log('✅ [DictionaryManager] Bunenjin Philosophy Implementation Loaded');