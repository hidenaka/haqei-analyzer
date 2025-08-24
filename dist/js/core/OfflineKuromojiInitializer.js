/**
 * OfflineKuromojiInitializer - HaQei Philosophy Offline Morphological Analysis
 * オフライン形態素解析初期化システム - HaQei哲学統合
 * Triple OS Architecture: Engine Layer (Offline Mode)
 */

console.log('📝 OfflineKuromojiInitializer Loading with HaQei Philosophy...');

window.OfflineKuromojiInitializer = {
  // 初期化状態
  initialized: false,
  
  // Kuromoji.js の状態
  kuromojiStatus: {
    available: false,
    loading: false,
    error: null,
    tokenizer: null,
    dictPath: null
  },
  
  // HaQei哲学適応
  haqeiAdaptation: {
    // 調和原理：オンライン・オフライン機能の調和
    harmony: {
      seamless_fallback: true,
      consistent_behavior: true,
      balanced_performance: true
    },
    
    // 慈悲原理：ユーザーへの思いやり
    compassion: {
      transparent_loading: true,
      gentle_error_handling: true,
      preserve_functionality: true
    },
    
    // 智慧原理：適応的な形態素解析
    wisdom: {
      context_aware_analysis: true,
      intelligent_caching: true,
      progressive_enhancement: true
    },
    
    // 真実原理：正確な解析結果
    authenticity: {
      reliable_analysis: true,
      honest_limitations: true,
      transparent_confidence: true
    }
  },
  
  // フォールバックシステム
  fallbackAnalyzer: null,
  
  // 初期化
  async init() {
    console.log('🚀 OfflineKuromojiInitializer initializing...');
    
    try {
      await this.detectKuromojiAvailability();
      await this.setupFallbackAnalyzer();
      await this.initializeKuromoji();
      this.setupProgressiveEnhancement();
      
      this.initialized = true;
      console.log('✅ OfflineKuromojiInitializer initialized with HaQei philosophy');
    } catch (error) {
      console.error('❌ OfflineKuromojiInitializer initialization failed:', error);
      this.handleInitializationFailure(error);
    }
  },
  
  // Kuromoji.js 利用可能性検出
  async detectKuromojiAvailability() {
    console.log('🔍 Detecting Kuromoji.js availability...');
    
    try {
      // Kuromoji.js の存在チェック
      if (typeof kuromoji !== 'undefined') {
        this.kuromojiStatus.available = true;
        console.log('✅ Kuromoji.js detected');
        return true;
      }
      
      // 動的ロード試行
      await this.attemptDynamicLoad();
      return this.kuromojiStatus.available;
      
    } catch (error) {
      console.warn('⚠️ Kuromoji.js not available:', error);
      this.kuromojiStatus.available = false;
      this.kuromojiStatus.error = error.message;
      return false;
    }
  },
  
  // 動的ロード試行
  async attemptDynamicLoad() {
    console.log('📦 Attempting dynamic Kuromoji.js load...');
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/build/kuromoji.js';
      script.onload = () => {
        if (typeof kuromoji !== 'undefined') {
          this.kuromojiStatus.available = true;
          console.log('✅ Kuromoji.js dynamically loaded');
          resolve(true);
        } else {
          reject(new Error('Kuromoji.js loaded but not available'));
        }
      };
      script.onerror = () => {
        reject(new Error('Failed to load Kuromoji.js'));
      };
      
      document.head.appendChild(script);
      
      // タイムアウト設定（10秒）
      setTimeout(() => {
        reject(new Error('Kuromoji.js load timeout'));
      }, 10000);
    });
  },
  
  // フォールバック解析器セットアップ
  async setupFallbackAnalyzer() {
    console.log('🛡️ Setting up fallback analyzer...');
    
    this.fallbackAnalyzer = {
      // 簡易形態素解析
      tokenize: (text) => {
        const tokens = [];
        
        // ひらがな・カタカナ・漢字・英数字で分割
        const segments = text.match(/[\u3040-\u309F]+|[\u30A0-\u30FF]+|[\u4E00-\u9FAF]+|[a-zA-Z0-9]+|[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAFa-zA-Z0-9]/g) || [];
        
        segments.forEach((segment, index) => {
          tokens.push({
            surface_form: segment,
            pos: this.estimatePartOfSpeech(segment),
            pos_detail_1: '*',
            pos_detail_2: '*',
            pos_detail_3: '*',
            conjugated_type: '*',
            conjugated_form: '*',
            basic_form: segment,
            reading: this.estimateReading(segment),
            pronunciation: this.estimateReading(segment),
            word_id: index,
            word_type: 'KNOWN',
            word_position: index
          });
        });
        
        return tokens;
      },
      
      // 品詞推定
      estimatePartOfSpeech: (text) => {
        // 簡易的な品詞推定
        if (/^[\u3040-\u309F]+$/.test(text)) {
          if (text.endsWith('る') || text.endsWith('う') || text.endsWith('く')) {
            return '動詞';
          } else if (text.endsWith('い')) {
            return '形容詞';
          } else {
            return '助詞';
          }
        } else if (/^[\u30A0-\u30FF]+$/.test(text)) {
          return '名詞';
        } else if (/^[\u4E00-\u9FAF]+$/.test(text)) {
          return '名詞';
        } else if (/^[a-zA-Z]+$/.test(text)) {
          return '名詞';
        } else if (/^[0-9]+$/.test(text)) {
          return '名詞';
        } else {
          return '記号';
        }
      },
      
      // 読み推定
      estimateReading: (text) => {
        if (/^[\u3040-\u309F]+$/.test(text)) {
          // ひらがなはそのまま
          return text;
        } else if (/^[\u30A0-\u30FF]+$/.test(text)) {
          // カタカナもそのまま
          return text;
        } else {
          // その他は推定不可
          return '*';
        }
      }
    };
    
    console.log('✅ Fallback analyzer setup complete');
  },
  
  // Kuromoji.js 初期化
  async initializeKuromoji() {
    if (!this.kuromojiStatus.available) {
      console.log('📝 Using fallback analyzer (Kuromoji.js not available)');
      return;
    }
    
    console.log('🔧 Initializing Kuromoji.js...');
    this.kuromojiStatus.loading = true;
    
    try {
      // 辞書パス設定
      this.kuromojiStatus.dictPath = 'https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/';
      
      // トークナイザー構築
      const tokenizer = await this.buildTokenizer();
      this.kuromojiStatus.tokenizer = tokenizer;
      this.kuromojiStatus.loading = false;
      
      console.log('✅ Kuromoji.js initialized successfully');
    } catch (error) {
      console.error('❌ Kuromoji.js initialization failed:', error);
      this.kuromojiStatus.loading = false;
      this.kuromojiStatus.error = error.message;
    }
  },
  
  // トークナイザー構築
  buildTokenizer() {
    return new Promise((resolve, reject) => {
      kuromoji.builder({ dicPath: this.kuromojiStatus.dictPath }).build((err, tokenizer) => {
        if (err) {
          reject(err);
        } else {
          resolve(tokenizer);
        }
      });
    });
  },
  
  // プログレッシブエンハンスメント設定
  setupProgressiveEnhancement() {
    console.log('🚀 Setting up progressive enhancement...');
    
    this.progressiveEnhancement = {
      // レベル1：基本的なテキスト分割
      basic: {
        available: true,
        features: ['simple_segmentation', 'character_type_detection']
      },
      
      // レベル2：フォールバック形態素解析
      fallback: {
        available: !!this.fallbackAnalyzer,
        features: ['part_of_speech_estimation', 'basic_tokenization']
      },
      
      // レベル3：完全な形態素解析
      full: {
        available: !!this.kuromojiStatus.tokenizer,
        features: ['accurate_morphological_analysis', 'reading_pronunciation', 'detailed_pos']
      }
    };
    
    console.log('✅ Progressive enhancement setup complete');
  },
  
  // 初期化失敗処理
  handleInitializationFailure(error) {
    console.error('💥 OfflineKuromojiInitializer failed:', error);
    
    // 最低限の機能で動作
    this.initialized = true;
    this.kuromojiStatus.error = error.message;
    
    // HaQei慈悲原理：ユーザーへの思いやり
    console.log('🛡️ Continuing with basic text analysis capabilities');
  },
  
  // 公開API - テキスト解析
  async analyzeText(text, options = {}) {
    if (!this.initialized) {
      await this.init();
    }
    
    try {
      // HaQei智慧原理：最適な解析レベルを選択
      const analysisLevel = this.determineAnalysisLevel(text, options);
      return await this.performAnalysis(text, analysisLevel, options);
      
    } catch (error) {
      console.error('❌ Text analysis failed:', error);
      return this.createFallbackAnalysis(text);
    }
  },
  
  // 解析レベル決定
  determineAnalysisLevel(text, options) {
    // テキスト長による判定
    if (text.length > 1000 && !options.forceFullAnalysis) {
      return 'fallback'; // 長文は軽量解析
    }
    
    // Kuromoji利用可能性による判定
    if (this.kuromojiStatus.tokenizer && !this.kuromojiStatus.loading) {
      return 'full';
    } else if (this.fallbackAnalyzer) {
      return 'fallback';
    } else {
      return 'basic';
    }
  },
  
  // 解析実行
  async performAnalysis(text, level, options) {
    const startTime = performance.now();
    
    let tokens = [];
    let confidence = 0;
    let method = '';
    
    switch (level) {
      case 'full':
        tokens = this.kuromojiStatus.tokenizer.tokenize(text);
        confidence = 0.9;
        method = 'kuromoji';
        break;
        
      case 'fallback':
        tokens = this.fallbackAnalyzer.tokenize(text);
        confidence = 0.6;
        method = 'fallback';
        break;
        
      case 'basic':
      default:
        tokens = this.basicTokenize(text);
        confidence = 0.3;
        method = 'basic';
        break;
    }
    
    const endTime = performance.now();
    
    return {
      text: text,
      tokens: tokens,
      analysis: {
        method: method,
        confidence: confidence,
        processing_time: endTime - startTime,
        token_count: tokens.length,
        haqei_enhanced: this.enhanceWithHaQeiWisdom(tokens)
      },
      metadata: {
        timestamp: Date.now(),
        level: level,
        philosophy: 'haqei'
      }
    };
  },
  
  // 基本トークナイズ
  basicTokenize(text) {
    const tokens = [];
    const chars = Array.from(text);
    
    chars.forEach((char, index) => {
      tokens.push({
        surface_form: char,
        pos: this.classifyCharacterType(char),
        basic_form: char,
        word_position: index,
        word_type: 'BASIC'
      });
    });
    
    return tokens;
  },
  
  // 文字種分類
  classifyCharacterType(char) {
    if (/[\u3040-\u309F]/.test(char)) return 'ひらがな';
    if (/[\u30A0-\u30FF]/.test(char)) return 'カタカナ';
    if (/[\u4E00-\u9FAF]/.test(char)) return '漢字';
    if (/[a-zA-Z]/.test(char)) return '英字';
    if (/[0-9]/.test(char)) return '数字';
    return '記号';
  },
  
  // HaQei智慧による拡張
  enhanceWithHaQeiWisdom(tokens) {
    const enhancement = {
      harmony_indicators: [],
      compassion_indicators: [],
      wisdom_indicators: [],
      authenticity_indicators: []
    };
    
    // HaQei原理関連語の検出
    tokens.forEach(token => {
      const surface = token.surface_form;
      
      // 調和関連
      if (['調和', '平和', 'バランス', '協調'].includes(surface)) {
        enhancement.harmony_indicators.push({
          word: surface,
          position: token.word_position,
          principle: 'harmony'
        });
      }
      
      // 慈悲関連
      if (['愛', '思いやり', '慈悲', '優しさ'].includes(surface)) {
        enhancement.compassion_indicators.push({
          word: surface,
          position: token.word_position,
          principle: 'compassion'
        });
      }
      
      // 智慧関連
      if (['知恵', '智慧', '学び', '成長'].includes(surface)) {
        enhancement.wisdom_indicators.push({
          word: surface,
          position: token.word_position,
          principle: 'wisdom'
        });
      }
      
      // 真実関連
      if (['真実', '誠実', '正直', '純粋'].includes(surface)) {
        enhancement.authenticity_indicators.push({
          word: surface,
          position: token.word_position,
          principle: 'authenticity'
        });
      }
    });
    
    return enhancement;
  },
  
  // フォールバック解析作成
  createFallbackAnalysis(text) {
    return {
      text: text,
      tokens: this.basicTokenize(text),
      analysis: {
        method: 'emergency_fallback',
        confidence: 0.1,
        processing_time: 0,
        token_count: text.length,
        haqei_enhanced: {
          harmony_indicators: [],
          compassion_indicators: [],
          wisdom_indicators: [],
          authenticity_indicators: []
        }
      },
      metadata: {
        timestamp: Date.now(),
        level: 'emergency',
        philosophy: 'haqei-safe'
      },
      warning: 'Emergency fallback mode - limited analysis capabilities'
    };
  },
  
  // 公開API - キーワード抽出
  async extractKeywords(text, options = {}) {
    const analysis = await this.analyzeText(text, options);
    const keywords = [];
    
    // 名詞と動詞を抽出
    analysis.tokens.forEach(token => {
      if (token.pos && (token.pos.includes('名詞') || token.pos.includes('動詞'))) {
        if (token.surface_form.length >= 2) { // 2文字以上
          keywords.push({
            word: token.surface_form,
            pos: token.pos,
            basic_form: token.basic_form || token.surface_form,
            reading: token.reading || '*',
            position: token.word_position
          });
        }
      }
    });
    
    return {
      keywords: keywords,
      analysis_info: analysis.analysis,
      haqei_enhancement: analysis.analysis.haqei_enhanced
    };
  },
  
  // 公開API - 品詞分析
  async analyzePOS(text, options = {}) {
    const analysis = await this.analyzeText(text, options);
    const posCount = {};
    
    analysis.tokens.forEach(token => {
      const pos = token.pos || 'unknown';
      posCount[pos] = (posCount[pos] || 0) + 1;
    });
    
    return {
      pos_distribution: posCount,
      total_tokens: analysis.tokens.length,
      analysis_method: analysis.analysis.method,
      confidence: analysis.analysis.confidence
    };
  },
  
  // ステータス取得
  getStatus() {
    return {
      initialized: this.initialized,
      kuromoji_available: this.kuromojiStatus.available,
      kuromoji_loading: this.kuromojiStatus.loading,
      kuromoji_error: this.kuromojiStatus.error,
      fallback_ready: !!this.fallbackAnalyzer,
      progressive_enhancement: this.progressiveEnhancement || null,
      philosophy: 'haqei',
      architecture: 'triple-os'
    };
  },
  
  // 機能一覧取得
  getCapabilities() {
    const capabilities = ['basic_tokenization', 'character_classification'];
    
    if (this.fallbackAnalyzer) {
      capabilities.push('fallback_morphological_analysis', 'pos_estimation');
    }
    
    if (this.kuromojiStatus.tokenizer) {
      capabilities.push('full_morphological_analysis', 'accurate_pos_tagging', 'reading_pronunciation');
    }
    
    capabilities.push('haqei_wisdom_enhancement', 'keyword_extraction', 'pos_distribution');
    
    return capabilities;
  }
};

// 自動初期化
document.addEventListener('DOMContentLoaded', () => {
  window.OfflineKuromojiInitializer.init();
});

console.log('✅ OfflineKuromojiInitializer loaded with HaQei Philosophy');