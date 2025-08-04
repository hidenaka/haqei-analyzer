/**
 * OfflineKuromojiInitializer.js - Offline-First Kuromoji Initialization System
 * HAQEI Future Simulator - Advanced Dictionary Management
 * 
 * 目的:
 * - オフライン優先のkuromoji初期化
 * - 段階的フォールバック戦略
 * - 辞書整合性の保証
 * - ユーザー体験の最適化
 * 
 * 機能:
 * 1. ローカル辞書優先の初期化
 * 2. オフライン検出との連携
 * 3. 進捗表示とユーザー制御
 * 4. 緊急フォールバック
 */

class OfflineKuromojiInitializer {
  constructor() {
    this.dictionaryManager = null;
    this.offlineDetector = null;
    this.tokenizer = null;
    this.isInitialized = false;
    this.initPromise = null;
    this.progressCallback = null;
    this.userSkipped = false;
    
    console.log('🔧 OfflineKuromojiInitializer created');
  }
  
  /**
   * メイン初期化エントリポイント
   */
  async initialize(options = {}) {
    if (this.initPromise) {
      return this.initPromise;
    }
    
    this.initPromise = this._doInitialize(options);
    return this.initPromise;
  }
  
  /**
   * 実際の初期化処理
   */
  async _doInitialize(options) {
    try {
      console.log('🚀 Starting offline-first kuromoji initialization...');
      
      // 必要なコンポーネントの初期化
      await this.initializeComponents();
      
      // オフライン状態の検出
      const connectionStatus = this.offlineDetector.getStatus();
      const dictionaryStrategy = this.offlineDetector.getDictionaryStrategy();
      
      console.log('📊 Connection status:', connectionStatus);
      console.log('📚 Dictionary strategy:', dictionaryStrategy);
      
      // 進捗表示の開始
      if (options.showProgress !== false) {
        this.showInitializationProgress();
      }
      
      // 戦略に基づく初期化
      const success = await this.initializeBasedOnStrategy(dictionaryStrategy);
      
      if (success) {
        this.isInitialized = true;
        console.log('✅ Kuromoji initialization completed successfully');
        
        if (options.showProgress !== false) {
          this.hideInitializationProgress();
        }
        
        return this.tokenizer;
      } else {
        throw new Error('All initialization strategies failed');
      }
      
    } catch (error) {
      console.error('❌ Kuromoji initialization failed:', error);
      
      if (options.showProgress !== false) {
        this.hideInitializationProgress();
      }
      
      // 緊急フォールバック
      return await this.createEmergencyFallback();
    }
  }
  
  /**
   * 必要なコンポーネントの初期化
   */
  async initializeComponents() {
    // DictionaryManager の初期化
    if (typeof DictionaryManager !== 'undefined') {
      this.dictionaryManager = new DictionaryManager();
      console.log('📚 DictionaryManager initialized');
    } else {
      console.warn('⚠️ DictionaryManager not available');
    }
    
    // OfflineDetector の初期化
    if (typeof OfflineDetector !== 'undefined') {
      this.offlineDetector = new OfflineDetector();
      console.log('🔍 OfflineDetector initialized');
    } else {
      console.warn('⚠️ OfflineDetector not available');
      // 簡易オフライン検出
      this.offlineDetector = {
        getStatus: () => ({ isOnline: navigator.onLine }),
        getDictionaryStrategy: () => ({
          strategy: navigator.onLine ? 'cdn-preferred' : 'local-only'
        })
      };
    }
  }
  
  /**
   * 戦略に基づく初期化
   */
  async initializeBasedOnStrategy(strategy) {
    switch (strategy.strategy) {
      case 'local-only':
        return await this.initializeLocalOnly();
        
      case 'local-preferred':
        return await this.initializeLocalPreferred();
        
      case 'cdn-preferred':
        return await this.initializeCDNPreferred();
        
      default:
        console.warn('⚠️ Unknown strategy, using local-only');
        return await this.initializeLocalOnly();
    }
  }
  
  /**
   * ローカル専用初期化
   */
  async initializeLocalOnly() {
    console.log('📁 Initializing with local-only strategy');
    
    if (this.dictionaryManager) {
      try {
        this.updateProgress('ローカル辞書を読み込んでいます...');
        const tokenizer = await this.dictionaryManager.initialize();
        
        if (tokenizer) {
          this.tokenizer = tokenizer;
          return true;
        }
      } catch (error) {
        console.warn('⚠️ Local dictionary initialization failed:', error.message);
      }
    }
    
    // フォールバック: 直接ローカル読み込み
    return await this.tryDirectLocalInitialization();
  }
  
  /**
   * ローカル優先初期化
   */
  async initializeLocalPreferred() {
    console.log('📁➡️🌐 Initializing with local-preferred strategy');
    
    // まずローカルを試行
    const localSuccess = await this.initializeLocalOnly();
    if (localSuccess) {
      return true;
    }
    
    // ローカル失敗時はCDNを試行
    console.log('🌐 Local failed, trying CDN fallback');
    return await this.initializeCDNFallback();
  }
  
  /**
   * CDN優先初期化
   */
  async initializeCDNPreferred() {
    console.log('🌐➡️📁 Initializing with CDN-preferred strategy');
    
    // まずCDNを試行
    const cdnSuccess = await this.initializeCDNFallback();
    if (cdnSuccess) {
      return true;
    }
    
    // CDN失敗時はローカルを試行
    console.log('📁 CDN failed, trying local fallback');
    return await this.initializeLocalOnly();
  }
  
  /**
   * 直接ローカル初期化
   */
  async tryDirectLocalInitialization() {
    console.log('📁 Trying direct local initialization');
    
    return new Promise((resolve) => {
      if (typeof kuromoji === 'undefined') {
        console.error('❌ Kuromoji library not loaded');
        resolve(false);
        return;
      }
      
      const timeout = setTimeout(() => {
        console.warn('⏰ Direct local initialization timeout');
        resolve(false);
      }, 15000);
      
      this.updateProgress('ローカル辞書を構築しています...');
      
      kuromoji.builder({ dicPath: './dict/' }).build((err, tokenizer) => {
        clearTimeout(timeout);
        
        if (err) {
          console.error('❌ Direct local build failed:', err);
          resolve(false);
          return;
        }
        
        this.tokenizer = tokenizer;
        this.tokenizer.isLocal = true;
        this.tokenizer.source = 'direct-local';
        
        console.log('✅ Direct local initialization successful');
        resolve(true);
      });
    });
  }
  
  /**
   * CDNフォールバック初期化
   */
  async initializeCDNFallback() {
    const cdnPaths = [
      'https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/',
      'https://unpkg.com/kuromoji@0.1.2/dict/',
      'https://cdnjs.cloudflare.com/ajax/libs/kuromoji/0.1.2/dict/'
    ];
    
    for (let i = 0; i < cdnPaths.length; i++) {
      const cdnPath = cdnPaths[i];
      const cdnName = this.getCDNName(cdnPath);
      
      try {
        this.updateProgress(`CDN (${cdnName}) から辞書を読み込んでいます...`);
        
        const success = await this.tryInitializeFromCDN(cdnPath, cdnName);
        if (success) {
          return true;
        }
        
      } catch (error) {
        console.warn(`❌ CDN initialization failed (${cdnName}):`, error.message);
        continue;
      }
    }
    
    return false;
  }
  
  /**
   * CDNからの初期化試行
   */
  async tryInitializeFromCDN(cdnPath, cdnName) {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.warn(`⏰ CDN initialization timeout: ${cdnName}`);
        resolve(false);
      }, 20000);
      
      kuromoji.builder({ dicPath: cdnPath }).build((err, tokenizer) => {
        clearTimeout(timeout);
        
        if (err) {
          console.warn(`❌ CDN build failed (${cdnName}):`, err.message);
          resolve(false);
          return;
        }
        
        this.tokenizer = tokenizer;
        this.tokenizer.isLocal = false;
        this.tokenizer.source = cdnName;
        
        console.log(`✅ CDN initialization successful: ${cdnName}`);
        resolve(true);
      });
    });
  }
  
  /**
   * CDN名の取得
   */
  getCDNName(cdnPath) {
    if (cdnPath.includes('jsdelivr')) return 'jsdelivr';
    if (cdnPath.includes('unpkg')) return 'unpkg';
    if (cdnPath.includes('cdnjs')) return 'cdnjs';
    return 'unknown';
  }
  
  /**
   * 緊急フォールバック
   */
  async createEmergencyFallback() {
    console.log('🚨 Creating emergency fallback tokenizer');
    
    this.tokenizer = {
      tokenize: (text) => {
        // 基本的な日本語文字分割
        const tokens = [];
        let current = '';
        
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const code = char.charCodeAt(0);
          
          // 日本語文字の判定
          const isJapanese = (code >= 0x3040 && code <= 0x309F) || // ひらがな
                           (code >= 0x30A0 && code <= 0x30FF) || // カタカナ
                           (code >= 0x4E00 && code <= 0x9FAF);   // 漢字
          
          if (isJapanese) {
            if (current && !/^[\\u3040-\\u309F\\u30A0-\\u30FF\\u4E00-\\u9FAF]*$/.test(current)) {
              tokens.push(this.createFallbackToken(current, i - current.length));
              current = '';
            }
            current += char;
          } else {
            if (current) {
              tokens.push(this.createFallbackToken(current, i - current.length));
              current = '';
            }
            if (char.trim()) {
              tokens.push(this.createFallbackToken(char, i));
            }
          }
        }
        
        if (current) {
          tokens.push(this.createFallbackToken(current, text.length - current.length));
        }
        
        return tokens;
      },
      
      isSimple: true,
      isFallback: true,
      isEmergency: true,
      source: 'emergency-fallback'
    };
    
    this.isInitialized = true;
    console.log('✅ Emergency fallback tokenizer created');
    return this.tokenizer;
  }
  
  /**
   * フォールバック用トークンの作成
   */
  createFallbackToken(surface, position) {
    return {
      surface_form: surface,
      pos: this.guessPartOfSpeech(surface),
      pos_detail_1: '*',
      pos_detail_2: '*',
      pos_detail_3: '*',
      conjugated_type: '*',
      conjugated_form: '*',
      basic_form: surface,
      reading: surface,
      pronunciation: surface,
      word_id: position,
      word_type: 'UNKNOWN',
      word_position: position
    };
  }
  
  /**
   * 品詞の推測
   */
  guessPartOfSpeech(word) {
    if (/^[あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん]+$/.test(word)) {
      return 'ひらがな';
    }
    if (/^[ア-ン]+$/.test(word)) {
      return 'カタカナ';
    }
    if (/^[0-9]+$/.test(word)) {
      return '数詞';
    }
    if (/^[A-Za-z]+$/.test(word)) {
      return '名詞';
    }
    return '名詞';
  }
  
  /**
   * 進捗表示
   */
  showInitializationProgress() {
    const progressHtml = `
      <div id=\"offlineKuromojiProgressModal\" class=\"fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50\">
        <div class=\"bg-gray-800 p-8 rounded-lg max-w-md w-full mx-4 border border-gray-600\">
          <h2 class=\"text-2xl font-bold text-blue-400 mb-6 text-center\">🧠 AI言語解析エンジン初期化中</h2>
          
          <div class=\"mb-6\">
            <div id=\"kuromojiProgressBar\" class=\"w-full bg-gray-700 rounded-full h-3 mb-4\">
              <div class=\"bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300\" style=\"width: 0%\"></div>
            </div>
            <p id=\"kuromojiProgressText\" class=\"text-gray-300 text-center mb-4\">辞書システムを準備しています...</p>
          </div>
          
          <div class=\"text-center\">
            <button id=\"skipKuromojiBtn\" class=\"bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg transition-colors mr-3\">
              ⚡ 簡易モードで開始
            </button>
            <button id=\"offlineKuromojiBtn\" class=\"bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors\">
              📴 オフラインモード
            </button>
          </div>
          
          <div class=\"mt-4 text-xs text-gray-400 text-center\">
            ✨ より正確な分析のため、辞書を読み込んでいます<br>
            📱 読み込みが遅い場合は簡易モードをお試しください
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', progressHtml);
    
    // イベントリスナーの設定
    document.getElementById('skipKuromojiBtn')?.addEventListener('click', () => {
      this.userSkipped = true;
      this.hideInitializationProgress();
    });
    
    document.getElementById('offlineKuromojiBtn')?.addEventListener('click', () => {
      this.forceOfflineMode = true;
      this.updateProgress('オフラインモードに切り替えています...');
    });
  }
  
  /**
   * 進捗表示の更新
   */
  updateProgress(message, progress = null) {
    const progressText = document.getElementById('kuromojiProgressText');
    const progressBar = document.querySelector('#kuromojiProgressBar > div');
    
    if (progressText) {
      progressText.textContent = message;
    }
    
    if (progress !== null && progressBar) {
      progressBar.style.width = `${progress}%`;
    }
    
    if (this.progressCallback) {
      this.progressCallback({ message, progress });
    }
  }
  
  /**
   * 進捗表示の非表示
   */
  hideInitializationProgress() {
    const progressModal = document.getElementById('offlineKuromojiProgressModal');
    if (progressModal) {
      progressModal.remove();
    }
  }
  
  /**
   * トークナイザーの取得
   */
  getTokenizer() {
    return this.tokenizer;
  }
  
  /**
   * 初期化状態の確認
   */
  isReady() {
    return this.isInitialized && this.tokenizer !== null;
  }
  
  /**
   * 状態情報の取得
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      hasTokenizer: this.tokenizer !== null,
      tokenizerSource: this.tokenizer?.source || 'none',
      isLocal: this.tokenizer?.isLocal || false,
      isFallback: this.tokenizer?.isFallback || false,
      isEmergency: this.tokenizer?.isEmergency || false,
      connectionStatus: this.offlineDetector?.getStatus() || null
    };
  }
  
  /**
   * 進捗コールバックの設定
   */
  setProgressCallback(callback) {
    this.progressCallback = callback;
  }
}

// グローバルエクスポート
window.OfflineKuromojiInitializer = OfflineKuromojiInitializer;

console.log('🚀 OfflineKuromojiInitializer module loaded');