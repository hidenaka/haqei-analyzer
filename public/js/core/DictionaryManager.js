/**
 * DictionaryManager.js - Local Dictionary Management for Offline Kuromoji
 * HAQEI Future Simulator - Offline-First Japanese Text Analysis
 * 
 * 目的:
 * - kuromoji辞書のローカル管理とオフライン対応
 * - CDN障害時の自動フォールバック
 * - 辞書データの整合性保証とバージョン管理
 * - IndexedDBを活用した高速アクセス
 * 
 * 機能:
 * 1. ローカル辞書ファイルの管理
 * 2. オフライン検出と自動切り替え
 * 3. 辞書データのキャッシュ管理
 * 4. バージョン管理と自動更新
 * 5. 辞書整合性の検証
 */

class DictionaryManager {
  constructor() {
    this.version = '1.0.0';
    this.dbName = 'haqei_dictionary_db';
    this.dbVersion = 1;
    this.storeName = 'dictionary_files';
    this.db = null;
    this.isOnline = navigator.onLine;
    
    // ローカル辞書ファイルパス
    this.localDictPath = './dict/';
    this.dictFiles = [
      'base.dat.gz',
      'cc.dat.gz', 
      'check.dat.gz',
      'tid.dat.gz',
      'tid_map.dat.gz',
      'tid_pos.dat.gz',
      'unk.dat.gz',
      'unk_char.dat.gz',
      'unk_compat.dat.gz',
      'unk_invoke.dat.gz',
      'unk_map.dat.gz',
      'unk_pos.dat.gz'
    ];
    
    // CDN辞書パス（フォールバック用）
    this.cdnPaths = [
      'https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/',
      'https://unpkg.com/kuromoji@0.1.2/dict/',
      'https://cdnjs.cloudflare.com/ajax/libs/kuromoji/0.1.2/dict/'
    ];
    
    this.tokenizer = null;
    this.isInitialized = false;
    this.initPromise = null;
    
    // オンライン状態監視
    this.setupOnlineDetection();
    
    console.log('🔧 DictionaryManager initialized');
  }
  
  /**
   * オンライン状態の監視設定
   */
  setupOnlineDetection() {
    window.addEventListener('online', () => {
      console.log('🌐 Online detected');
      this.isOnline = true;
    });
    
    window.addEventListener('offline', () => {
      console.log('📴 Offline detected - switching to local dictionary');
      this.isOnline = false;
    });
  }
  
  /**
   * IndexedDB の初期化
   */
  async initializeDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => {
        console.error('❌ IndexedDB initialization failed:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ IndexedDB initialized successfully');
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // 辞書ファイル用ストア
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'filename' });
          store.createIndex('version', 'version', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          console.log('🏗️ Dictionary store created');
        }
      };
    });
  }
  
  /**
   * 辞書の初期化（メインエントリポイント）
   */
  async initialize() {
    if (this.initPromise) {
      return this.initPromise;
    }
    
    this.initPromise = this._doInitialize();
    return this.initPromise;
  }
  
  async _doInitialize() {
    try {
      console.log('🚀 Dictionary initialization starting...');
      
      // IndexedDBの初期化
      await this.initializeDB();
      
      // オフライン優先でローカル辞書を試行
      if (!this.isOnline || await this.tryLocalDictionary()) {
        console.log('📚 Using local dictionary (offline-first)');
        this.isInitialized = true;
        return this.tokenizer;
      }
      
      // オンラインでCDNフォールバック
      console.log('🌐 Falling back to CDN dictionary');
      await this.tryCDNDictionary();
      
      this.isInitialized = true;
      return this.tokenizer;
      
    } catch (error) {
      console.error('❌ Dictionary initialization failed:', error);
      
      // 緊急フォールバック - 簡易トークナイザー
      this.createFallbackTokenizer();
      return this.tokenizer;
    }
  }
  
  /**
   * ローカル辞書での初期化を試行
   */
  async tryLocalDictionary() {
    try {
      console.log('📁 Attempting local dictionary initialization...');
      
      // 既存の辞書キャッシュをチェック
      const cachedDict = await this.getCachedDictionary();
      if (cachedDict && this.isValidDictionary(cachedDict)) {
        console.log('💾 Using cached dictionary data');
        return await this.buildTokenizerFromCache(cachedDict);
      }
      
      // ローカル辞書ファイルから読み込み
      return await this.loadLocalDictionary();
      
    } catch (error) {
      console.warn('⚠️ Local dictionary failed:', error.message);
      return false;
    }
  }
  
  /**
   * ローカル辞書ファイルの読み込み
   */
  async loadLocalDictionary() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Local dictionary load timeout'));
      }, 15000);
      
      if (typeof kuromoji === 'undefined') {
        clearTimeout(timeout);
        reject(new Error('Kuromoji library not loaded'));
        return;
      }
      
      kuromoji.builder({ dicPath: this.localDictPath }).build((err, tokenizer) => {
        clearTimeout(timeout);
        
        if (err) {
          console.error('❌ Local dictionary build failed:', err);
          reject(err);
          return;
        }
        
        this.tokenizer = tokenizer;
        this.tokenizer.isLocal = true;
        this.tokenizer.source = 'local';
        
        console.log('✅ Local dictionary loaded successfully');
        
        // 成功した辞書をキャッシュ
        this.cacheDictionary(tokenizer, 'local');
        
        resolve(true);
      });
    });
  }
  
  /**
   * CDN辞書での初期化（フォールバック）
   */
  async tryCDNDictionary() {
    for (let i = 0; i < this.cdnPaths.length; i++) {
      const cdnPath = this.cdnPaths[i];
      const cdnName = this.getCDNName(cdnPath);
      
      try {
        console.log(`🌐 Trying CDN: ${cdnName}`);
        
        const success = await this.loadCDNDictionary(cdnPath, cdnName);
        if (success) {
          console.log(`✅ CDN dictionary loaded: ${cdnName}`);
          return true;
        }
        
      } catch (error) {
        console.warn(`❌ CDN failed (${cdnName}):`, error.message);
        continue;
      }
    }
    
    throw new Error('All CDN sources failed');
  }
  
  /**
   * CDN辞書の読み込み
   */
  async loadCDNDictionary(cdnPath, cdnName) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`CDN timeout: ${cdnName}`));
      }, 20000);
      
      kuromoji.builder({ dicPath: cdnPath }).build((err, tokenizer) => {
        clearTimeout(timeout);
        
        if (err) {
          reject(new Error(`CDN build failed: ${err.message}`));
          return;
        }
        
        this.tokenizer = tokenizer;
        this.tokenizer.isLocal = false;
        this.tokenizer.source = cdnName;
        
        // CDN辞書もキャッシュ
        this.cacheDictionary(tokenizer, cdnName);
        
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
   * 辞書のキャッシュ保存
   */
  async cacheDictionary(tokenizer, source) {
    try {
      if (!this.db) return;
      
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const dictData = {
        filename: `dict_${source}`,
        version: this.version,
        source: source,
        timestamp: Date.now(),
        isLocal: tokenizer.isLocal || false,
        // トークナイザーの設定情報のみ保存（データ本体は大きすぎるため）
        config: {
          dicPath: tokenizer.dicPath || this.localDictPath,
          source: source
        }
      };
      
      await store.put(dictData);
      console.log(`💾 Dictionary cached: ${source}`);
      
    } catch (error) {
      console.warn('⚠️ Dictionary caching failed:', error);
    }
  }
  
  /**
   * キャッシュされた辞書の取得
   */
  async getCachedDictionary() {
    try {
      if (!this.db) return null;
      
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      
      // ローカル辞書のキャッシュを優先
      const localDict = await store.get('dict_local');
      if (localDict && this.isRecentCache(localDict)) {
        return localDict;
      }
      
      // CDN辞書のキャッシュ
      const index = store.index('timestamp');
      const recentDicts = await index.getAll();
      
      // recentDictsが配列でない場合の対処
      const dictsArray = Array.isArray(recentDicts) ? recentDicts : [];
      
      const validDict = dictsArray
        .filter(dict => this.isRecentCache(dict))
        .sort((a, b) => b.timestamp - a.timestamp)[0];
      
      return validDict || null;
      
    } catch (error) {
      console.warn('⚠️ Cache retrieval failed:', error);
      return null;
    }
  }
  
  /**
   * キャッシュされた辞書からトークナイザーを構築
   */
  async buildTokenizerFromCache(cachedDict) {
    try {
      const dicPath = cachedDict.isLocal ? this.localDictPath : cachedDict.config.dicPath;
      
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Cached dictionary build timeout'));
        }, 10000);
        
        kuromoji.builder({ dicPath }).build((err, tokenizer) => {
          clearTimeout(timeout);
          
          if (err) {
            reject(err);
            return;
          }
          
          this.tokenizer = tokenizer;
          this.tokenizer.isLocal = cachedDict.isLocal;
          this.tokenizer.source = cachedDict.source;
          
          console.log(`✅ Dictionary built from cache: ${cachedDict.source}`);
          resolve(true);
        });
      });
      
    } catch (error) {
      console.warn('⚠️ Cache build failed:', error);
      return false;
    }
  }
  
  /**
   * 辞書の妥当性チェック
   */
  isValidDictionary(dictData) {
    if (!dictData) return false;
    
    const requiredFields = ['version', 'source', 'timestamp', 'config'];
    return requiredFields.every(field => field in dictData);
  }
  
  /**
   * キャッシュの新しさチェック
   */
  isRecentCache(dictData) {
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7日間
    return (Date.now() - dictData.timestamp) < maxAge;
  }
  
  /**
   * 緊急フォールバック用の簡易トークナイザー
   */
  createFallbackTokenizer() {
    console.log('🚨 Creating fallback tokenizer...');
    
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
            if (current && !/^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]*$/.test(current)) {
              tokens.push(this.createToken(current, i - current.length));
              current = '';
            }
            current += char;
          } else {
            if (current) {
              tokens.push(this.createToken(current, i - current.length));
              current = '';
            }
            if (char.trim()) {
              tokens.push(this.createToken(char, i));
            }
          }
        }
        
        if (current) {
          tokens.push(this.createToken(current, text.length - current.length));
        }
        
        return tokens;
      },
      
      isSimple: true,
      isFallback: true,
      source: 'fallback'
    };
    
    console.log('✅ Fallback tokenizer created');
  }
  
  /**
   * 簡易トークンの作成
   */
  createToken(surface, position) {
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
   * 品詞の推測（簡易版）
   */
  guessPartOfSpeech(word) {
    // 簡易的な品詞推定
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
    
    return '名詞'; // デフォルト
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
   * ステータス情報の取得
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      isOnline: this.isOnline,
      source: this.tokenizer?.source || 'none',
      isLocal: this.tokenizer?.isLocal || false,
      isFallback: this.tokenizer?.isFallback || false,
      version: this.version
    };
  }
  
  /**
   * キャッシュのクリア
   */
  async clearCache() {
    try {
      if (!this.db) return;
      
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      await store.clear();
      console.log('🗑️ Dictionary cache cleared');
      
    } catch (error) {
      console.warn('⚠️ Cache clear failed:', error);
    }
  }
  
  /**
   * 辞書の整合性検証
   */
  async validateDictionary() {
    if (!this.tokenizer) {
      return { valid: false, error: 'No tokenizer available' };
    }
    
    try {
      // テスト文章で動作確認
      const testText = 'これはテストです。正常に動作していますか？';
      const tokens = this.tokenizer.tokenize(testText);
      
      const isValid = tokens && tokens.length > 0 && 
                     tokens.every(token => token.surface_form && token.pos);
      
      return {
        valid: isValid,
        tokenCount: tokens.length,
        source: this.tokenizer.source,
        isLocal: this.tokenizer.isLocal,
        isFallback: this.tokenizer.isFallback
      };
      
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
}

// グローバルエクスポート
window.DictionaryManager = DictionaryManager;

console.log('📚 DictionaryManager module loaded');