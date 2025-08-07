/**
 * Offline Kuromoji Initializer - Bunenjin Philosophy Implementation
 * Triple OS Architecture: Engine Layer Component
 * 
 * オフライン対応形態素解析エンジン初期化システム
 * - オンライン/オフライン両方に対応
 * - 段階的品質向上アプローチ
 * - 矛盾受容型フォールバック機構
 */

class OfflineKuromojiInitializer {
  constructor() {
    this.initialized = false;
    this.status = 'pending';
    this.tokenizer = null;
    this.fallbackAnalyzer = null;
    this.offlineCache = null;
    this.connectionDetector = null;
    
    // Bunenjin Philosophy: 完璧でなくても機能する設計
    this.acceptContradiction = {
      perfect_analysis: false,
      working_analysis: true,
      online_preferred: true,
      offline_acceptable: true
    };
    
    // Triple OS Architecture Components
    this.engineOS = null;
    this.interfaceOS = null;
    this.safeMode = null;
    
    this.init();
  }
  
  async init() {
    console.log('📝 [OfflineKuromojiInitializer] 初期化開始 - Bunenjin Philosophy');
    
    try {
      // Triple OS Architecture Setup
      this.initializeTripleOS();
      
      // 接続状態検出器連携
      await this.connectToOfflineDetector();
      
      // Kuromoji初期化試行（複数段階）
      await this.attemptKuromojiInitialization();
      
      // フォールバック解析器準備
      await this.prepareFallbackAnalyzer();
      
      // オフラインキャッシュ設定
      await this.setupOfflineCache();
      
      this.status = 'ready';
      this.initialized = true;
      
      console.log('✅ [OfflineKuromojiInitializer] 初期化完了 - 矛盾受容モード');
      
    } catch (error) {
      console.warn('⚠️ [OfflineKuromojiInitializer] 初期化警告 - フォールバックモード:', error);
      this.activateFallbackMode();
    }
  }
  
  initializeTripleOS() {
    console.log('🔧 [OfflineKuromojiInitializer] Triple OS Architecture 初期化');
    
    // Engine OS (Core Analysis Engine)
    this.engineOS = {
      name: 'Kuromoji Engine OS',
      version: '1.0.0',
      philosophy: 'bunenjin',
      
      async analyzeText(text) {
        if (!text || typeof text !== 'string') {
          return this.createEmptyAnalysis();
        }
        
        // 優先順位: Kuromoji -> 高度フォールバック -> 基本フォールバック
        if (this.tokenizer) {
          return await this.kuromojiAnalysis(text);
        } else if (this.fallbackAnalyzer) {
          return await this.advancedFallbackAnalysis(text);
        } else {
          return this.basicFallbackAnalysis(text);
        }
      },
      
      async kuromojiAnalysis(text) {
        try {
          const tokens = this.tokenizer.tokenize(text);
          
          return {
            tokens: tokens.map(token => ({
              surface_form: token.surface_form,
              pos: token.pos,
              pos_detail_1: token.pos_detail_1,
              pos_detail_2: token.pos_detail_2,
              pos_detail_3: token.pos_detail_3,
              conjugated_type: token.conjugated_type,
              conjugated_form: token.conjugated_form,
              basic_form: token.basic_form,
              reading: token.reading,
              pronunciation: token.pronunciation
            })),
            method: 'kuromoji',
            quality: 'high',
            philosophy: 'bunenjin-precise'
          };
        } catch (error) {
          console.warn('⚠️ Kuromoji解析エラー - フォールバックに移行:', error);
          return this.advancedFallbackAnalysis(text);
        }
      },
      
      async advancedFallbackAnalysis(text) {
        // 高度なフォールバック解析（パターンベース）
        const tokens = [];
        const words = this.segmentText(text);
        
        for (const word of words) {
          const analysis = await this.analyzeWord(word);
          tokens.push(analysis);
        }
        
        return {
          tokens: tokens,
          method: 'advanced_fallback',
          quality: 'medium',
          philosophy: 'bunenjin-adaptive'
        };
      },
      
      basicFallbackAnalysis(text) {
        // 基本フォールバック（最低限の動作保証）
        const tokens = text
          .replace(/[、。！？]/g, ' ')
          .split(/\s+/)
          .filter(word => word.length > 0)
          .map((word, index) => ({
            surface_form: word,
            pos: this.guessBasicPOS(word),
            basic_form: word,
            index: index
          }));
        
        return {
          tokens: tokens,
          method: 'basic_fallback',
          quality: 'basic',
          philosophy: 'bunenjin-essential'
        };
      },
      
      segmentText(text) {
        // 簡易文字種ベース分割
        const segments = [];
        let currentSegment = '';
        let currentType = null;
        
        for (const char of text) {
          const charType = this.getCharacterType(char);
          
          if (charType !== currentType && currentSegment.length > 0) {
            segments.push(currentSegment);
            currentSegment = char;
            currentType = charType;
          } else {
            currentSegment += char;
            currentType = charType;
          }
        }
        
        if (currentSegment.length > 0) {
          segments.push(currentSegment);
        }
        
        return segments.filter(seg => seg.trim().length > 0);
      },
      
      getCharacterType(char) {
        if (char.match(/[あ-ん]/)) return 'hiragana';
        if (char.match(/[ア-ン]/)) return 'katakana';
        if (char.match(/[一-龯]/)) return 'kanji';
        if (char.match(/[a-zA-Z]/)) return 'alphabet';
        if (char.match(/[0-9]/)) return 'number';
        return 'other';
      },
      
      async analyzeWord(word) {
        // 単語レベル解析（フォールバック）
        const pos = await this.estimatePOS(word);
        const reading = this.estimateReading(word);
        
        return {
          surface_form: word,
          pos: pos,
          basic_form: word,
          reading: reading,
          estimated: true
        };
      },
      
      async estimatePOS(word) {
        // 品詞推定ロジック
        const patterns = {
          '名詞': [/[一-龯]+/, /[ア-ン]+/, /[a-zA-Z]+/],
          '動詞': [/する$/, /れる$/, /られる$/],
          '形容詞': [/い$/, /しい$/, /らしい$/],
          '副詞': [/に$/, /く$/, /と$/],
          '助詞': [/^(が|を|に|で|と|は|の|から|まで)$/]
        };
        
        for (const [pos, patternList] of Object.entries(patterns)) {
          if (patternList.some(pattern => pattern.test(word))) {
            return pos;
          }
        }
        
        return '名詞'; // デフォルト
      },
      
      estimateReading(word) {
        // 簡易読み推定
        if (word.match(/[あ-ん]/)) {
          return word; // ひらがなはそのまま
        }
        if (word.match(/[ア-ン]/)) {
          return word; // カタカナもそのまま
        }
        return null; // 漢字の読みは推定困難
      },
      
      guessBasicPOS(word) {
        if (word.match(/する$/)) return '動詞';
        if (word.match(/い$/)) return '形容詞';
        if (word.match(/^(が|を|に|で|と|は|の)$/)) return '助詞';
        return '名詞';
      },
      
      createEmptyAnalysis() {
        return {
          tokens: [],
          method: 'empty',
          quality: 'none',
          philosophy: 'bunenjin-void'
        };
      }
    };
    
    // Interface OS (User Feedback Layer)
    this.interfaceOS = {
      name: 'Kuromoji Interface OS',
      
      showInitializationStatus(status) {
        const statusMessages = {
          'pending': '📝 形態素解析エンジン初期化中...',
          'kuromoji-loading': '🔄 高精度解析エンジン読み込み中...',
          'kuromoji-ready': '✅ 高精度解析エンジン準備完了',
          'fallback-ready': '⚡ 軽量解析エンジン準備完了',
          'basic-ready': '🛡️ 基本解析エンジン準備完了',
          'error': '⚠️ 解析エンジン初期化エラー - 基本機能で継続'
        };
        
        const message = statusMessages[status] || status;
        console.log(`🎭 [KuromojiInitializer] ${message}`);
        
        // UI通知があれば更新
        this.updateStatusUI(message);
      },
      
      updateStatusUI(message) {
        const statusElement = document.getElementById('kuromoji-status');
        if (statusElement) {
          statusElement.textContent = message;
        }
      },
      
      showAnalysisQuality(analysis) {
        const qualityIndicators = {
          'high': '🎯 高精度解析',
          'medium': '⚡ 適応的解析',
          'basic': '🛡️ 基本解析',
          'none': '📝 テキスト処理のみ'
        };
        
        const indicator = qualityIndicators[analysis.quality];
        if (indicator) {
          console.log(`📊 [KuromojiInitializer] ${indicator} (${analysis.method})`);
        }
      }
    };
    
    // Safe Mode OS (Emergency Fallback)
    this.safeMode = {
      name: 'Kuromoji Safe Mode OS',
      active: false,
      
      activate() {
        console.log('🛡️ [OfflineKuromojiInitializer] Safe Mode 起動');
        this.active = true;
        
        // 最小限の解析機能のみ提供
        return {
          basicAnalysis: true,
          advancedFeatures: false,
          philosophy: 'bunenjin-essential'
        };
      },
      
      basicAnalyze(text) {
        return {
          tokens: text.split(/\s+/).map(word => ({
            surface_form: word,
            pos: '名詞',
            method: 'safe_mode'
          })),
          quality: 'safe',
          philosophy: 'bunenjin-safe'
        };
      }
    };
    
    console.log('✅ [OfflineKuromojiInitializer] Triple OS Architecture 準備完了');
  }
  
  async connectToOfflineDetector() {
    console.log('🔗 [OfflineKuromojiInitializer] オフライン検出器連携');
    
    if (window.OfflineDetector) {
      this.connectionDetector = window.OfflineDetector;
      
      // 接続状態変化リスナー
      document.addEventListener('connection-status-change', (event) => {
        this.handleConnectionChange(event.detail);
      });
    }
  }
  
  handleConnectionChange(statusDetail) {
    const currentStatus = statusDetail.current;
    
    console.log('📡 [OfflineKuromojiInitializer] 接続状態変化:', currentStatus.type);
    
    // Bunenjin Philosophy: 接続状態に応じて適応
    if (currentStatus.type === 'offline') {
      this.prioritizeOfflineCapabilities();
    } else if (currentStatus.type === 'online' && !this.tokenizer) {
      this.attemptKuromojiInitialization();
    }
  }
  
  prioritizeOfflineCapabilities() {
    console.log('📴 [OfflineKuromojiInitializer] オフライン能力優先モード');
    
    // オフライン時は軽量なフォールバック解析を最適化
    if (!this.fallbackAnalyzer) {
      this.prepareFallbackAnalyzer();
    }
  }
  
  async attemptKuromojiInitialization() {
    console.log('🔄 [OfflineKuromojiInitializer] Kuromoji初期化試行');
    
    this.interfaceOS.showInitializationStatus('kuromoji-loading');
    
    const initializationStrategies = [
      () => this.initializeFromCDN(),
      () => this.initializeFromLocalCache(),
      () => this.initializeMinimalVersion()
    ];
    
    for (const strategy of initializationStrategies) {
      try {
        await strategy();
        if (this.tokenizer) {
          this.interfaceOS.showInitializationStatus('kuromoji-ready');
          return true;
        }
      } catch (error) {
        console.warn('⚠️ Kuromoji初期化戦略失敗:', error);
      }
    }
    
    console.log('📝 [OfflineKuromojiInitializer] Kuromoji初期化失敗 - フォールバック使用');
    return false;
  }
  
  async initializeFromCDN() {
    return new Promise((resolve, reject) => {
      if (typeof kuromoji === 'undefined') {
        reject(new Error('Kuromoji script not loaded'));
        return;
      }
      
      kuromoji.builder({
        dicPath: 'https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/'
      }).build((err, tokenizer) => {
        if (err) {
          reject(err);
        } else {
          this.tokenizer = tokenizer;
          window.tokenizer = tokenizer; // Global access
          console.log('✅ [OfflineKuromojiInitializer] CDNからの初期化成功');
          resolve();
        }
      });
    });
  }
  
  async initializeFromLocalCache() {
    // ローカルキャッシュからの初期化（将来の拡張）
    console.log('💾 [OfflineKuromojiInitializer] ローカルキャッシュ初期化 - 未実装');
    throw new Error('Local cache initialization not implemented');
  }
  
  async initializeMinimalVersion() {
    // 最小限版の初期化（将来の拡張）
    console.log('⚡ [OfflineKuromojiInitializer] 軽量版初期化 - 未実装');
    throw new Error('Minimal version not available');
  }
  
  async prepareFallbackAnalyzer() {
    console.log('🔧 [OfflineKuromojiInitializer] フォールバック解析器準備');
    
    this.fallbackAnalyzer = {
      name: 'Advanced Fallback Analyzer',
      version: '1.0.0',
      
      patterns: {
        // 日本語の品詞パターン
        verb_endings: ['る', 'す', 'く', 'ぐ', 'む', 'ぬ', 'ぶ', 'つ', 'う'],
        adjective_endings: ['い', 'しい', 'らしい', 'っぽい'],
        adverb_patterns: ['に', 'く', 'と', 'っと', 'りと']
      },
      
      commonWords: new Set([
        'は', 'が', 'を', 'に', 'で', 'と', 'から', 'まで', 'の',
        'だ', 'である', 'です', 'ます', 'でしょう',
        'この', 'その', 'あの', 'どの',
        '私', 'あなた', '彼', '彼女', 'これ', 'それ', 'あれ'
      ]),
      
      ready: true
    };
    
    this.interfaceOS.showInitializationStatus('fallback-ready');
  }
  
  async setupOfflineCache() {
    console.log('💾 [OfflineKuromojiInitializer] オフラインキャッシュ設定');
    
    // 簡易キャッシュシステム
    this.offlineCache = {
      analysisResults: new Map(),
      maxSize: 1000,
      
      get(text) {
        return this.analysisResults.get(text);
      },
      
      set(text, result) {
        if (this.analysisResults.size >= this.maxSize) {
          const firstKey = this.analysisResults.keys().next().value;
          this.analysisResults.delete(firstKey);
        }
        this.analysisResults.set(text, result);
      },
      
      clear() {
        this.analysisResults.clear();
      }
    };
  }
  
  activateFallbackMode() {
    console.log('🛡️ [OfflineKuromojiInitializer] フォールバックモード起動');
    
    this.safeMode.activate();
    this.status = 'fallback-ready';
    this.initialized = true;
    
    this.interfaceOS.showInitializationStatus('basic-ready');
  }
  
  // Public API
  async analyze(text) {
    if (!this.initialized) {
      await this.init();
    }
    
    try {
      // キャッシュチェック
      if (this.offlineCache) {
        const cached = this.offlineCache.get(text);
        if (cached) {
          console.log('💾 [OfflineKuromojiInitializer] キャッシュヒット');
          return cached;
        }
      }
      
      // 解析実行
      let result;
      if (this.safeMode.active) {
        result = this.safeMode.basicAnalyze(text);
      } else {
        result = await this.engineOS.analyzeText(text);
      }
      
      // 結果をキャッシュ
      if (this.offlineCache && result.quality !== 'none') {
        this.offlineCache.set(text, result);
      }
      
      // UI反映
      this.interfaceOS.showAnalysisQuality(result);
      
      return result;
      
    } catch (error) {
      console.error('❌ [OfflineKuromojiInitializer] 解析エラー:', error);
      
      // 緊急フォールバック
      return this.safeMode.basicAnalyze(text);
    }
  }
  
  getStatus() {
    return {
      initialized: this.initialized,
      status: this.status,
      hasKuromoji: !!this.tokenizer,
      hasFallback: !!this.fallbackAnalyzer,
      safeModeActive: this.safeMode?.active || false,
      philosophy: 'bunenjin',
      architecture: 'triple-os'
    };
  }
  
  getCapabilities() {
    const capabilities = ['basic_analysis'];
    
    if (this.tokenizer) {
      capabilities.push('high_precision_morphology', 'detailed_pos_tagging', 'reading_estimation');
    }
    
    if (this.fallbackAnalyzer) {
      capabilities.push('pattern_based_analysis', 'word_segmentation');
    }
    
    if (this.offlineCache) {
      capabilities.push('result_caching');
    }
    
    return capabilities;
  }
  
  clearCache() {
    if (this.offlineCache) {
      this.offlineCache.clear();
      console.log('🗑️ [OfflineKuromojiInitializer] キャッシュクリア完了');
    }
  }
}

// Global instance with Bunenjin Philosophy
if (typeof window !== 'undefined') {
  window.OfflineKuromojiInitializer = new OfflineKuromojiInitializer();
  
  // Global morphological analysis function
  window.analyzeText = async function(text) {
    if (window.OfflineKuromojiInitializer) {
      return await window.OfflineKuromojiInitializer.analyze(text);
    } else {
      return { tokens: [], error: 'Analyzer not available' };
    }
  };
}

console.log('✅ [OfflineKuromojiInitializer] Bunenjin Philosophy Implementation Loaded');