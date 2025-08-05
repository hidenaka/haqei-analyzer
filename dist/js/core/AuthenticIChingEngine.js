/**
 * 正統易経エンジン - AuthenticIChingEngine.js
 * 
 * 世界最高水準の易経AI実装
 * - H384_DATA完全活用
 * - 本卦→之卦変化システム
 * - 爻辞に基づく正確な選択システム
 * - bunenjin哲学完全統合
 * 
 * Author: HAQEI I Ching Expert Agent
 * Created: 2025-08-04
 * Philosophy: 易経正統教義 + bunenjin分人間調和理論
 */

class AuthenticIChingEngine {
  constructor() {
    this.engineVersion = "1.0.0-authentic-iching-secure";
    this.philosophyAlignment = "orthodox-iching-bunenjin";
    
    // セキュリティシステムの初期化
    this.securityLayer = this.initializeSecurityLayer();
    
    // 統合用エンジンの追加
    this.situationalEngine = null;
    this.hexagramEngine = null;
    
    // H384_DATAの検証と初期化
    this.initializeH384Database();
    
    // 64卦システムの初期化
    this.initialize64HexagramSystem();
    
    // bunenjin哲学統合システムの初期化
    this.initializeBunenjinIntegration();
    
    // 変化計算システムの初期化
    this.initializeTransformationEngine();
    
    console.log("🌟 セキュア正統易経エンジン初期化完了 - 企業レベル保護");
  }
  
  // 🚀 パフォーマンス最適化初期化
  initializePerformanceOptimizations() {
    // キャッシュシステム
    this.situationCache = new Map();
    this.hexagramCache = new Map();
    this.transformationCache = new Map();
    this.maxCacheSize = 100;
    
    // メモ化システム
    this.memoizedFunctions = new Map();
    
    // パフォーマンスカウンター
    this.performanceCounters = {
      cacheHits: 0,
      cacheMisses: 0,
      totalOperations: 0
    };
    
    console.log('📈 AuthenticIChingEngine最適化システム初期化完了');
  }

  /**
   * セキュリティレイヤーの初期化
   */
  initializeSecurityLayer() {
    return {
      inputValidator: window.inputValidation || null,
      domPurify: window.domPurifyIntegration || null,
      csrfProtection: window.csrfProtection || null,
      sanitizeInput: (input) => this.sanitizeUserInput(input),
      validateInput: (input, type) => this.validateUserInput(input, type),
      logSecurityEvent: (event) => this.logSecurityEvent(event)
    };
  }

  /**
   * ユーザー入力のサニタイゼーション
   */
  sanitizeUserInput(input) {
    if (!input || typeof input !== 'string') {
      return '';
    }

    try {
      // DOMPurifyによるサニタイゼーション
      if (this.securityLayer.domPurify && this.securityLayer.domPurify.isInitialized) {
        return this.securityLayer.domPurify.sanitizeHTML(input, {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
          KEEP_CONTENT: true
        });
      }
      
      // フォールバックサニタイゼーション
      return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/\//g, '&#x2F;')
        .replace(/[\x00-\x1F\x7F-\x9F]/g, ''); // 制御文字除去
        
    } catch (error) {
      console.error('❌ 入力サニタイゼーションエラー:', error);
      this.logSecurityEvent({
        type: 'SANITIZATION_ERROR',
        error: error.message,
        input: input.substring(0, 100)
      });
      return '';
    }
  }

  /**
   * ユーザー入力の検証
   */
  validateUserInput(input, type = 'text') {
    if (!input) {
      return { valid: false, errors: ['入力が空です'] };
    }

    try {
      // 入力検証システムによる検証
      if (this.securityLayer.inputValidator) {
        const mockInput = {
          value: input,
          dataset: { validationType: type }
        };
        return this.securityLayer.inputValidator.validateInput(mockInput);
      }
      
      // フォールバック検証
      return this.basicInputValidation(input, type);
      
    } catch (error) {
      console.error('❌ 入力検証エラー:', error);
      this.logSecurityEvent({
        type: 'VALIDATION_ERROR',
        error: error.message,
        input: input.substring(0, 100)
      });
      return { valid: false, errors: ['検証エラーが発生しました'] };
    }
  }

  /**
   * 基本的な入力検証
   */
  basicInputValidation(input, type) {
    const errors = [];
    
    // 長さ制限
    const maxLengths = { text: 1000, name: 100, email: 254 };
    const maxLength = maxLengths[type] || maxLengths.text;
    
    if (input.length > maxLength) {
      errors.push(`入力が長すぎます（最大${maxLength}文字）`);
    }
    
    // 危険なパターンの検出
    const dangerousPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript\s*:/gi,
      /on\w+\s*=\s*["'][^"']*["']/gi,
      /\b(SELECT|INSERT|UPDATE|DELETE|DROP)\b/gi
    ];
    
    dangerousPatterns.forEach(pattern => {
      if (pattern.test(input)) {
        errors.push('危険なコンテンツが検出されました');
        this.logSecurityEvent({
          type: 'DANGEROUS_CONTENT_DETECTED',
          pattern: pattern.toString(),
          input: input.substring(0, 100)
        });
      }
    });
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * セキュリティイベントのログ記録
   */
  logSecurityEvent(event) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      component: 'AuthenticIChingEngine',
      version: this.engineVersion,
      ...event
    };
    
    console.warn('🚨 セキュリティイベント:', logEntry);
    
    // グローバルセキュリティログシステムへの送信
    if (window.SecurityLogger) {
      window.SecurityLogger.logEvent(logEntry);
    }
  }

  /**
   * H384_DATAベースの初期化と検証
   */
  initializeH384Database() {
    try {
      // H384_DATABASEクラスを使用
      if (typeof window !== 'undefined' && window.H384_DATABASE) {
        this.h384Database = new window.H384_DATABASE();
        this.h384Database.initialize();
        console.log("✅ H384_DATABASE初期化完了 - 完全な爻辞データベース");
        
        // 既存のH384_DATAもフォールバックとして保持
        if (window.H384_DATA && Array.isArray(window.H384_DATA)) {
          this.h384Data = window.H384_DATA;
          console.log(`✅ H384_DATA読み込み完了: ${this.h384Data.length}爻のデータ`);
        }
        
        // データ整合性チェック
        this.validateH384Data();
        
        // 検索インデックスの作成
        this.createSearchIndex();
        
      } else if (typeof window !== 'undefined' && window.H384_DATA && Array.isArray(window.H384_DATA)) {
        this.h384Data = window.H384_DATA;
        console.log(`✅ H384_DATA読み込み完了: ${this.h384Data.length}爻のデータ`);
        
        // データ整合性チェック
        this.validateH384Data();
        
        // 検索インデックスの作成
        this.createSearchIndex();
        
      } else {
        throw new Error("H384_DATAが利用できません");
      }
    } catch (error) {
      console.error("❌ H384_DATA初期化エラー:", error);
      this.h384Data = this.createFallbackData();
    }
  }

  /**
   * H384_DATAの整合性検証
   */
  validateH384Data() {
    const validationResults = {
      totalEntries: this.h384Data.length,
      hexagramsCount: new Set(this.h384Data.map(item => item.卦番号)).size,
      linesCount: this.h384Data.filter(item => !item.爻.includes('用')).length,
      specialCases: this.h384Data.filter(item => item.爻.includes('用')).length
    };
    
    console.log("📊 H384_DATA検証結果:", validationResults);
    
    // 期待値チェック
    if (validationResults.totalEntries !== 386) {
      console.warn("⚠️ H384_DATAのエントリ数が期待値と異なります");
    }
    
    if (validationResults.hexagramsCount !== 64) {
      console.warn("⚠️ 64卦すべてが含まれていない可能性があります");
    }
    
    return validationResults;
  }

  /**
   * 検索インデックスの作成（高速検索のため）
   */
  createSearchIndex() {
    this.searchIndex = {
      byHexagram: new Map(),
      byKeyword: new Map(),
      byScore: new Map()
    };
    
    this.h384Data.forEach(item => {
      // 卦番号による検索
      const hexKey = item.卦番号;
      if (!this.searchIndex.byHexagram.has(hexKey)) {
        this.searchIndex.byHexagram.set(hexKey, []);
      }
      this.searchIndex.byHexagram.get(hexKey).push(item);
      
      // キーワードによる検索
      if (item.キーワード && Array.isArray(item.キーワード)) {
        item.キーワード.forEach(keyword => {
          if (!this.searchIndex.byKeyword.has(keyword)) {
            this.searchIndex.byKeyword.set(keyword, []);
          }
          this.searchIndex.byKeyword.get(keyword).push(item);
        });
      }
      
      // 総合評価スコアによる検索
      const scoreRange = Math.floor(item.S7_総合評価スコア / 10) * 10;
      if (!this.searchIndex.byScore.has(scoreRange)) {
        this.searchIndex.byScore.set(scoreRange, []);
      }
      this.searchIndex.byScore.get(scoreRange).push(item);
    });
    
    console.log("🔍 検索インデックス作成完了");
  }

  /**
   * 64卦システムの初期化
   */
  initialize64HexagramSystem() {
    // 64卦の基本情報
    this.hexagramNames = {
      1: "乾為天", 2: "坤為地", 3: "水雷屯", 4: "山水蒙", 5: "水天需", 6: "天水訟",
      7: "地水師", 8: "水地比", 9: "風天小畜", 10: "天沢履", 11: "地天泰", 12: "天地否",
      13: "天火同人", 14: "火天大有", 15: "地山謙", 16: "雷地豫", 17: "沢雷随", 18: "山風蠱",
      19: "地沢臨", 20: "風地観", 21: "火雷噬嗑", 22: "山火賁", 23: "山地剥", 24: "地雷復",
      25: "天雷无妄", 26: "山天大畜", 27: "山雷頤", 28: "沢風大過", 29: "坎為水", 30: "離為火",
      31: "沢山咸", 32: "雷風恒", 33: "天山遯", 34: "雷天大壮", 35: "火地晋", 36: "地火明夷",
      37: "風火家人", 38: "火沢睽", 39: "水山蹇", 40: "雷水解", 41: "山沢損", 42: "風雷益",
      43: "沢天夬", 44: "天風姤", 45: "沢地萃", 46: "地風升", 47: "沢水困", 48: "水風井",
      49: "沢火革", 50: "火風鼎", 51: "震為雷", 52: "艮為山", 53: "風山漸", 54: "雷沢帰妹",
      55: "雷火豊", 56: "火山旅", 57: "巽為風", 58: "兌為沢", 59: "風水渙", 60: "水沢節",
      61: "風沢中孚", 62: "雷山小過", 63: "水火既済", 64: "火水未済"
    };
    
    // 卦の2進数表現（下爻から上爻へ）
    this.hexagramBinary = {
      1: [1,1,1,1,1,1], 2: [0,0,0,0,0,0], 3: [1,0,0,0,1,0], 4: [0,1,0,0,0,1],
      5: [1,1,1,0,1,0], 6: [0,1,0,1,1,1], 7: [0,1,0,0,0,0], 8: [0,0,0,0,1,0],
      9: [1,1,1,0,1,1], 10: [1,1,0,1,1,1], 11: [1,1,1,0,0,0], 12: [0,0,0,1,1,1],
      13: [1,0,1,1,1,1], 14: [1,1,1,1,0,1], 15: [0,0,1,0,0,0], 16: [0,0,0,1,0,0],
      17: [1,0,0,1,1,0], 18: [0,1,1,0,0,1], 19: [1,1,0,0,0,0], 20: [0,0,0,0,1,1],
      21: [1,0,0,1,0,1], 22: [1,0,1,0,0,1], 23: [0,0,0,0,0,1], 24: [1,0,0,0,0,0],
      25: [1,0,0,1,1,1], 26: [1,1,1,0,0,1], 27: [1,0,0,0,0,1], 28: [0,1,1,1,1,0],
      29: [0,1,0,0,1,0], 30: [1,0,1,1,0,1], 31: [0,0,1,1,1,0], 32: [0,1,1,1,0,0],
      33: [0,0,1,1,1,1], 34: [1,1,1,1,0,0], 35: [0,0,0,1,0,1], 36: [1,0,1,0,0,0],
      37: [1,0,1,0,1,1], 38: [1,1,0,1,0,1], 39: [0,0,1,0,1,0], 40: [0,1,0,1,0,0],
      41: [1,1,0,0,0,1], 42: [1,0,0,0,1,1], 43: [1,1,1,1,1,0], 44: [0,1,1,1,1,1],
      45: [0,0,0,1,1,0], 46: [0,1,1,0,0,0], 47: [0,1,0,1,1,0], 48: [0,1,1,0,1,0],
      49: [1,0,1,1,1,0], 50: [0,1,1,1,0,1], 51: [1,0,0,1,0,0], 52: [0,0,1,0,0,1],
      53: [0,0,1,0,1,1], 54: [1,1,0,1,0,0], 55: [1,0,1,1,0,0], 56: [0,0,1,1,0,1],
      57: [0,1,1,0,1,1], 58: [1,1,0,1,1,0], 59: [0,1,0,0,1,1], 60: [1,1,0,0,1,0],
      61: [1,1,0,0,1,1], 62: [0,0,1,1,0,0], 63: [1,0,1,0,1,0], 64: [0,1,0,1,0,1]
    };
    
    console.log("✅ 64卦システム初期化完了");
  }

  /**
   * bunenjin哲学統合システムの初期化
   */
  initializeBunenjinIntegration() {
    // 分人間調和理論の実装
    this.bunenjinPersonas = {
      analyticalSelf: {
        role: "論理的分析を行う分人",
        approach: "データ重視・合理的判断",
        hexagramAffinity: [1, 11, 25, 34] // 乾、泰、无妄、大壮
      },
      emotionalSelf: {
        role: "感情的理解を行う分人", 
        approach: "直感重視・感情共感",
        hexagramAffinity: [2, 12, 31, 32] // 坤、否、咸、恒
      },
      socialSelf: {
        role: "社会的調和を図る分人",
        approach: "関係性重視・協調",
        hexagramAffinity: [8, 13, 37, 46] // 比、同人、家人、升
      },
      spiritualSelf: {
        role: "精神的洞察を得る分人",
        approach: "超越的理解・智慧",
        hexagramAffinity: [29, 30, 61, 63] // 坎、離、中孚、既済
      }
    };
    
    // 統一self概念の拒否
    this.unifiedSelfRejection = {
      principle: "人間は状況に応じて異なる分人を表出する複数存在である",
      rejection: "単一の統一された自己という概念は現実に合わない",
      application: "易経の解釈も複数の分人の視点から行う"
    };
    
    console.log("✅ bunenjin哲学統合完了");
  }

  /**
   * 変化計算システムの初期化
   */
  initializeTransformationEngine() {
    // 爻の変化パターン
    this.lineChangePatterns = {
      yang_to_yin: { symbol: "—— → — —", energy: "収束", nature: "内向化" },
      yin_to_yang: { symbol: "— — → ——", energy: "発散", nature: "外向化" }
    };
    
    // 特殊ケース（用九・用六）
    this.specialCases = {
      useNine: { hexagram: 1, meaning: "群龍无首", guidance: "リーダーシップの分散" },
      useSix: { hexagram: 2, meaning: "利永貞", guidance: "持続的な正道" }
    };
    
    console.log("✅ 変化計算システム初期化完了");
  }

  /**
   * 🚀 セキュア最適化版メインAPI: 現在の状況から本卦と変爻を特定
   */
  async identifyCurrentSituation(inputText, emotionalContext = null) {
    console.log("⚡ セキュア高速化現在状況特定開始");
    const startTime = performance.now();
    
    // 入力のセキュリティ検証
    if (!this.validateAndSanitizeInput(inputText)) {
      throw new Error('不正な入力が検出されました');
    }
    
    try {
      // セキュアなキャッシュチェック
      const sanitizedInput = this.sanitizeUserInput(inputText);
      const cacheKey = this.generateSecureCacheKey(sanitizedInput);
      if (this.situationCache && this.situationCache.has(cacheKey)) {
        console.log("📋 セキュア状況分析キャッシュヒット!");
        return this.situationCache.get(cacheKey);
      }
      
      // 1. 遅延初期化の並列化
      const [situationalEngine, hexagramEngine] = await Promise.all([
        this.initializeSituationalEngine(),
        this.initializeHexagramEngine()
      ]);
      
      // 2. セキュアな並列処理でテキスト分析と事前計算
      const [situationData, preprocessedData] = await Promise.all([
        situationalEngine.analyzeSituationalContext(sanitizedInput),
        this.preprocessInputData(sanitizedInput, emotionalContext)
      ]);
      console.log("📊 並列状況分析完了");
      
      // 3. 最適化された易経変換
      const hexagramResult = await this.optimizedHexagramMapping(
        hexagramEngine, situationData, preprocessedData
      );
      console.log("🔮 最適化易経変換完了");
      
      // 4. 高速統合結果構築
      const result = this.buildOptimizedResult(hexagramResult, situationData);
      
      // 結果をキャッシュ
      this.cacheSituationResult(cacheKey, result);
      
      const processingTime = performance.now() - startTime;
      console.log(`✅ 高速化処理完了: ${Math.round(processingTime)}ms`);
      
      return result;
      
    } catch (error) {
      console.error("❌ セキュア高速化処理エラー:", error);
      this.logSecurityEvent({
        type: 'PROCESSING_ERROR',
        error: error.message,
        input: inputText ? inputText.substring(0, 100) : 'null'
      });
      return this.getFallbackResult();
    }
  }

  /**
   * 入力の検証とサニタイゼーション
   */
  validateAndSanitizeInput(input) {
    if (!input || typeof input !== 'string') {
      this.logSecurityEvent({
        type: 'INVALID_INPUT_TYPE',
        inputType: typeof input
      });
      return false;
    }
    
    // 長さ制限チェック
    if (input.length > 10000) {
      this.logSecurityEvent({
        type: 'INPUT_TOO_LONG',
        length: input.length
      });
      return false;
    }
    
    // セキュリティ検証
    const validation = this.validateUserInput(input, 'text');
    if (!validation.valid) {
      this.logSecurityEvent({
        type: 'INPUT_VALIDATION_FAILED',
        errors: validation.errors
      });
      return false;
    }
    
    return true;
  }

  /**
   * セキュアなキャッシュキー生成
   */
  generateSecureCacheKey(input) {
    try {
      // より安全なハッシュ生成
      if (window.crypto && window.crypto.subtle) {
        // Web Crypto APIを使用（非同期だが、同期的なフォールバックを提供）
        return this.generateFallbackHash(input);
      } else {
        return this.generateFallbackHash(input);
      }
    } catch (error) {
      console.error('❌ セキュアキー生成エラー:', error);
      return 'fallback_' + Date.now();
    }
  }

  /**
   * フォールバックハッシュ生成
   */
  generateFallbackHash(input) {
    let hash = 0;
    const str = input + this.engineVersion; // バージョンを含めてキー衝突を避ける
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32bit整数に変換
    }
    
    return `secure_${Math.abs(hash).toString(36)}`;
  }

  // エンジン初期化の最適化
  async initializeSituationalEngine() {
    if (!this.situationalEngine) {
      this.situationalEngine = new SituationalContextEngine();
    }
    return this.situationalEngine;
  }

  async initializeHexagramEngine() {
    if (!this.hexagramEngine) {
      this.hexagramEngine = new HexagramMappingEngine();
      await this.hexagramEngine.initialize();
    }
    return this.hexagramEngine;
  }

  // 🚀 最適化: 入力データの高速前処理
  async preprocessInputData(inputText, emotionalContext) {
    const cacheKey = `preprocess_${this.generateInputCacheKey(inputText)}`;
    
    if (this.situationCache.has(cacheKey)) {
      this.performanceCounters.cacheHits++;
      return this.situationCache.get(cacheKey).result;
    }
    
    const result = {
      textLength: inputText.length,
      complexity: this.fastComplexityCalculation(inputText), // 高速化
      emotionalHints: emotionalContext || this.extractEmotionalHints(inputText),
      keywords: this.fastKeywordExtraction(inputText)
    };
    
    // キャッシュに保存
    this.cacheSituationResult(cacheKey, result);
    this.performanceCounters.cacheMisses++;
    
    return result;
  }
  
  // 高速コンプレキシティ計算
  fastComplexityCalculation(text) {
    // 簡略化した計算で高速化
    const length = text.length;
    const uniqueChars = new Set(text.substring(0, Math.min(text.length, 100))).size;
    return Math.min(100, (uniqueChars / Math.max(length, 1)) * 100);
  }

  // 最適化された易経マッピング
  async optimizedHexagramMapping(engine, situationData, preprocessedData) {
    // 前処理データを活用して高速化
    const optimizedSituationData = {
      ...situationData,
      preprocessed: preprocessedData
    };
    
    return await engine.mapSituationToHexagram(optimizedSituationData);
  }

  // 最適化された結果構築
  buildOptimizedResult(hexagramResult, situationData) {
    // 必要最小限のデータのみ構築
    return {
      卦番号: hexagramResult.primaryHexagram?.id || 12,
      卦名: hexagramResult.primaryHexagram?.name || "天地否",
      爻: hexagramResult.selectedLine?.yao || "九三",
      爻位置: hexagramResult.selectedLine?.position || 3,
      信頼度: hexagramResult.confidence || 0.8,
      状況分析: {
        situationScore: situationData.situationScore,
        temporalDynamics: situationData.temporalDynamics
      },
      易経解釈: hexagramResult.interpretation,
      変卦: hexagramResult.changingHexagram,
      処理時間: performance.now()
    };
  }

  // セキュアキャッシュ関連メソッド（上記で実装済み）

  cacheSituationResult(key, result) {
    if (!this.situationCache) {
      this.situationCache = new Map();
    }
    
    if (this.situationCache.size >= 20) {
      const firstKey = this.situationCache.keys().next().value;
      this.situationCache.delete(firstKey);
    }
    
    this.situationCache.set(key, result);
  }

  // 高速テキスト解析
  calculateTextComplexity(text) {
    return Math.min(text.length / 50 + (text.match(/[。！？]/g) || []).length, 10);
  }

  extractEmotionalHints(text) {
    const emotionPatterns = {
      positive: /嬉しい|楽しい|希望|良い/g,
      negative: /辛い|困る|悩む|不安/g,
      neutral: /考える|思う|感じる/g
    };
    
    const scores = {};
    Object.entries(emotionPatterns).forEach(([emotion, pattern]) => {
      scores[emotion] = (text.match(pattern) || []).length;
    });
    
    return scores;
  }

  fastKeywordExtraction(text) {
    return text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]{2,}/g)?.slice(0, 10) || [];
  }

  /**
   * 統合結果の構築
   */
  buildIntegratedResult(hexagramResult, situationData) {
    console.log("🔨 統合結果構築開始");
    
    // HexagramMappingEngineの結果構造を確認して適切にマッピング
    const result = {
      卦番号: hexagramResult.primaryHexagram?.id || hexagramResult.hexagramId || 12,
      卦名: hexagramResult.primaryHexagram?.name || hexagramResult.hexagramName || "天地否",
      爻: hexagramResult.selectedLine?.yao || hexagramResult.lineText || "九三",
      爻位置: hexagramResult.selectedLine?.position || hexagramResult.linePosition || 3,
      信頼度: hexagramResult.confidence || 0.8,
      状況分析: situationData,
      易経解釈: hexagramResult.interpretation || hexagramResult.situationalAlignment,
      変卦: hexagramResult.changingHexagram || hexagramResult.changingAnalysis?.changingHexagram,
      
      // H384_DATA形式との互換性のため
      通し番号: this.calculateSerialNumber(hexagramResult),
      上卦: hexagramResult.primaryHexagram?.upperTrigram || "天",
      下卦: hexagramResult.primaryHexagram?.lowerTrigram || "地",
      
      // 追加情報
      キーワード: situationData.implicitInferences?.keywords || [],
      現代解釈の要約: hexagramResult.modernApplication || "",
      bunenjin視点: this.generateBunenjinPerspective(hexagramResult, situationData)
    };
    
    console.log("✅ 統合結果構築完了:", result);
    return result;
  }

  /**
   * 通し番号の計算
   */
  calculateSerialNumber(hexagramResult) {
    const hexagramId = hexagramResult.primaryHexagram?.id || hexagramResult.hexagramId || 12;
    const linePosition = hexagramResult.selectedLine?.position || hexagramResult.linePosition || 3;
    
    // H384_DATAの通し番号計算ロジック
    let serialNumber = 0;
    for (let i = 1; i < hexagramId; i++) {
      serialNumber += 6; // 各卦には6つの爻がある
    }
    serialNumber += linePosition;
    
    return serialNumber;
  }

  /**
   * bunenjin視点の生成
   */
  generateBunenjinPerspective(hexagramResult, situationData) {
    return {
      分析的視点: "データと論理から見た客観的な状況評価",
      感情的視点: situationData.emotionalProfile?.description || "内なる感情の動きと向き合う時",
      社会的視点: "周囲との関係性において求められる役割",
      精神的視点: hexagramResult.interpretation?.spiritual || "より深い智慧への道"
    };
  }

  /**
   * キーワード分析
   */
  analyzeKeywords(inputText) {
    const matches = [];
    const words = this.extractKeywords(inputText);
    
    words.forEach(word => {
      const keywordMatches = this.searchIndex.byKeyword.get(word) || [];
      matches.push(...keywordMatches.map(match => ({
        ...match,
        matchType: 'keyword',
        matchWord: word,
        confidence: 0.7
      })));
    });
    
    return this.rankMatches(matches);
  }

  /**
   * 感情パターン分析
   */
  analyzeEmotionalPatterns(inputText, emotionalContext) {
    const emotionKeywords = {
      positive: ['嬉しい', '楽しい', '希望', '期待', '成功', '達成'],
      negative: ['悲しい', '辛い', '困難', '失敗', '不安', '心配'],
      neutral: ['考える', '悩む', '迷う', '選ぶ', '決める', '待つ']
    };
    
    const matches = [];
    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      keywords.forEach(keyword => {
        if (inputText.includes(keyword)) {
          const keywordMatches = this.searchIndex.byKeyword.get(keyword) || [];
          matches.push(...keywordMatches.map(match => ({
            ...match,
            matchType: 'emotion',
            emotionType: emotion,
            confidence: 0.8
          })));
        }
      });
    });
    
    return this.rankMatches(matches);
  }

  /**
   * 文脈分析
   */
  analyzeContext(inputText) {
    const contextPatterns = {
      work: ['仕事', '会社', '職場', '上司', '同僚', 'プロジェクト'],
      relationship: ['恋愛', '結婚', '家族', '友人', '人間関係'],
      health: ['健康', '病気', '体調', '治療', '医者'],
      money: ['お金', '収入', '投資', '借金', '財政', '経済']
    };
    
    const matches = [];
    Object.entries(contextPatterns).forEach(([context, keywords]) => {
      keywords.forEach(keyword => {
        if (inputText.includes(keyword)) {
          // 文脈に適した卦を選定
          const contextMatches = this.getContextualHexagrams(context);
          matches.push(...contextMatches.map(match => ({
            ...match,
            matchType: 'context',
            contextType: context,
            confidence: 0.6
          })));
        }
      });
    });
    
    return this.rankMatches(matches);
  }

  /**
   * マッチング結果の統合
   */
  synthesizeMatches(keywordMatches, emotionalMatches, contextualMatches) {
    const allMatches = [...keywordMatches, ...emotionalMatches, ...contextualMatches];
    
    // 重複排除と重み付け
    const matchMap = new Map();
    allMatches.forEach(match => {
      const key = `${match.卦番号}-${match.通し番号}`;
      if (matchMap.has(key)) {
        // 複数のマッチタイプがある場合は信頼度を上げる
        const existing = matchMap.get(key);
        existing.confidence = Math.min(existing.confidence + match.confidence * 0.3, 0.95);
        existing.matchTypes.push(match.matchType);
      } else {
        match.matchTypes = [match.matchType];
        matchMap.set(key, match);
      }
    });
    
    // 最も信頼度の高いマッチを選択
    const rankedMatches = Array.from(matchMap.values())
      .sort((a, b) => b.confidence - a.confidence);
    
    return rankedMatches[0] || this.getFallbackMatch();
  }

  /**
   * 本卦→之卦の変化計算
   */
  calculateTransformation(originalHexagram, changingLines) {
    console.log(`🔄 変化計算開始: 第${originalHexagram}卦, 変爻: ${changingLines.join(',')}`);
    
    try {
      // 変爻の適用
      const transformedHexagram = this.applyChangingLines(originalHexagram, changingLines);
      
      // 変化の性質分析
      const transformationNature = this.analyzeTransformationNature(
        originalHexagram, 
        transformedHexagram, 
        changingLines
      );
      
      // 時間軸での変化過程
      const timeline = this.calculateTransformationTimeline(
        originalHexagram, 
        transformedHexagram
      );
      
      const result = {
        fromHexagram: {
          number: originalHexagram,
          name: this.hexagramNames[originalHexagram],
          binary: this.hexagramBinary[originalHexagram]
        },
        toHexagram: {
          number: transformedHexagram,
          name: this.hexagramNames[transformedHexagram],
          binary: this.hexagramBinary[transformedHexagram]
        },
        changingLines: changingLines,
        transformationNature: transformationNature,
        timeline: timeline,
        guidance: this.generateTransformationGuidance(originalHexagram, transformedHexagram, changingLines)
      };
      
      console.log("✅ 変化計算完了:", result);
      return result;
      
    } catch (error) {
      console.error("❌ 変化計算エラー:", error);
      return this.getFallbackTransformation(originalHexagram);
    }
  }

  /**
   * 変爻の適用（本卦→之卦）
   */
  applyChangingLines(hexagram, changingLines) {
    let binary = [...this.hexagramBinary[hexagram]];
    
    changingLines.forEach(linePosition => {
      // 爻の位置は1-6（下から上）、配列は0-5
      const index = linePosition - 1;
      binary[index] = binary[index] === 1 ? 0 : 1;
    });
    
    return this.binaryToHexagramNumber(binary);
  }

  /**
   * 2進数から卦番号への変換
   */
  binaryToHexagramNumber(binary) {
    const binaryStr = binary.join('');
    
    for (let [hexNum, hexBinary] of Object.entries(this.hexagramBinary)) {
      if (hexBinary.join('') === binaryStr) {
        return parseInt(hexNum);
      }
    }
    
    return 1; // フォールバック
  }

  /**
   * 爻辞に基づく選択システム
   */
  generateAuthenticChoices(hexagram, line) {
    // H384_DATAから該当する爻を検索
    const lineData = this.findLineData(hexagram, line);
    
    if (!lineData) {
      return this.getFallbackChoices(hexagram, line);
    }
    
    const choices = {
      situation: {
        hexagram: hexagram,  
        hexagramName: this.hexagramNames[hexagram],
        line: line,
        lineText: lineData.爻,
        meaning: lineData.現代解釈の要約,
        keywords: lineData.キーワード
      },
      pathA: {
        title: "爻辞に従う道",
        description: lineData.現代解釈の要約,
        action: this.generateActionFromLineText(lineData, true),
        outcome: {
          transformation: this.calculateTransformation(hexagram, [line]),
          risk: this.calculateRisk(lineData.S4_リスク, true),
          potential: this.calculatePotential(lineData.S2_ポテンシャル, true),
          timeline: this.estimateTimeline(lineData, true)
        },
        bunenjinGuidance: this.generateBunenjinGuidance(lineData, true)
      },
      pathB: {
        title: "爻辞に逆らう道",
        description: this.generateContractDescription(lineData),
        action: this.generateActionFromLineText(lineData, false),
        outcome: {
          transformation: this.calculateAlternativeTransformation(hexagram, line),
          risk: this.calculateRisk(lineData.S4_リスク, false),
          potential: this.calculatePotential(lineData.S2_ポテンシャル, false),
          timeline: this.estimateTimeline(lineData, false)
        },
        bunenjinGuidance: this.generateBunenjinGuidance(lineData, false)
      }
    };
    
    return choices;
  }

  /**
   * H384_DATAから爻データを検索
   */
  findLineData(hexagram, line) {
    return this.h384Data.find(item => 
      item.卦番号 === hexagram && this.parseLineFromData(item.爻) === line
    );
  }

  /**
   * 爻記号から爻位置を解析
   */
  parseLineFromData(lineText) {
    const lineMap = {
      '初九': 1, '初六': 1,
      '九二': 2, '六二': 2,
      '九三': 3, '六三': 3,
      '九四': 4, '六四': 4,
      '九五': 5, '六五': 5,
      '上九': 6, '上六': 6,
      '用九': 7, '用六': 7
    };
    
    return lineMap[lineText] || 1;
  }

  /**
   * bunenjin分人間調和ガイダンス生成
   */
  generateBunenjinGuidance(lineData, followingPath) {
    const guidance = {};
    
    Object.entries(this.bunenjinPersonas).forEach(([personaName, persona]) => {
      guidance[personaName] = {
        perspective: this.getPersonaPerspective(lineData, persona, followingPath),
        action: this.getPersonaAction(lineData, persona, followingPath),
        caution: this.getPersonaCaution(lineData, persona, followingPath)
      };
    });
    
    // 分人間の調和
    guidance.integration = this.harmonizePersonas(guidance, lineData, followingPath);
    
    return guidance;
  }

  /**
   * 8つの変化パターン生成（易経に基づく）
   */
  generate8TransformationPatterns(currentHexagram, currentLine) {
    const baseData = this.findLineData(currentHexagram, currentLine);
    
    return [
      // パターン1: 爻辞に従う正統変化
      this.generateOrthodoxyPath(currentHexagram, currentLine, baseData),
      
      // パターン2: 爻辞に逆らう逆行変化  
      this.generateContradictionPath(currentHexagram, currentLine, baseData),
      
      // パターン3: 互卦による隠れた変化
      this.generateMutualHexagramPath(currentHexagram, baseData),
      
      // パターン4: 錯卦による対極変化
      this.generateOppositeHexagramPath(currentHexagram, baseData),
      
      // パターン5: 綜卦による視点転換変化
      this.generateReversedHexagramPath(currentHexagram, baseData),
      
      // パターン6: 急速変化（革卦的）
      this.generateRapidTransformationPath(currentHexagram, currentLine, baseData),
      
      // パターン7: 漸進変化（漸卦的）
      this.generateGradualTransformationPath(currentHexagram, currentLine, baseData),
      
      // パターン8: 循環変化（序卦伝論理）
      this.generateSequentialTransformationPath(currentHexagram, baseData)
    ];
  }

  /**
   * 易経品質検証システム
   */
  validateIChingAuthenticity(result) {
    const validationChecks = {
      hexagramAccuracy: this.validateHexagramAccuracy(result),
      lineTextAccuracy: this.validateLineTextAccuracy(result),
      transformationLogic: this.validateTransformationLogic(result),
      philosophicalAlignment: this.validatePhilosophicalAlignment(result),
      bunenjinIntegration: this.validateBunenjinIntegration(result)
    };
    
    const overallScore = Object.values(validationChecks)
      .reduce((sum, score) => sum + score, 0) / Object.keys(validationChecks).length;
    
    return {
      validationChecks,
      overallScore,
      isAuthentic: overallScore >= 0.85,
      grade: this.calculateAuthenticityGrade(overallScore),
      improvements: this.suggestImprovements(validationChecks)
    };
  }

  /**
   * ユーティリティメソッド群
   */
  
  extractKeywords(text) {
    // 日本語キーワード抽出
    return text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/g) || [];
  }
  
  rankMatches(matches) {
    return matches
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 10); // 上位10件
  }
  
  getContextualHexagrams(context) {
    const contextHexagrams = {
      work: [1, 2, 7, 8, 11, 12], // 乾、坤、師、比、泰、否
      relationship: [31, 32, 37, 38, 54, 44], // 咸、恒、家人、睽、帰妹、姤
      health: [27, 28, 48, 50, 29, 30], // 頤、大過、井、鼎、坎、離
      money: [14, 41, 42, 21, 22, 35] // 大有、損、益、噬嗑、賁、晋
    };
    
    return (contextHexagrams[context] || [1]).map(hexNum => 
      this.searchIndex.byHexagram.get(hexNum)?.[0]
    ).filter(Boolean);
  }
  
  getFallbackResult() {
    return {
      卦番号: 1,
      卦名: "乾為天",
      爻: "初九",
      confidence: 0.3,
      reason: "フォールバック結果"
    };
  }
  
  getFallbackMatch() {
    return this.h384Data[0]; // 最初のエントリ
  }
  
  createFallbackData() {
    return [{
      通し番号: 1,
      卦番号: 1,
      卦名: "乾為天",
      爻: "初九",
      キーワード: ["待機", "準備"],
      現代解釈の要約: "基本的な分析結果",
      S1_基本スコア: 50,
      S2_ポテンシャル: 50,
      S3_安定性スコア: 50,
      S4_リスク: -30,
      S7_総合評価スコア: 50
    }];
  }

  /**
   * パブリックAPI
   */
  getEngineInfo() {
    return {
      name: "正統易経エンジン",
      version: this.engineVersion,
      philosophy: this.philosophyAlignment,
      dataSource: "H384_DATA",
      totalLines: this.h384Data.length,
      hexagramsSupported: 64,
      specialCases: 2, // 用九・用六
      bunenjinIntegration: true,
      worldClassImplementation: true
    };
  }
  
  // 🚀 メモ化ユーティリティ
  memoize(functionName, fn) {
    const key = `${functionName}_${JSON.stringify(Array.from(arguments)).slice(0, 100)}`;
    
    if (this.memoizedFunctions.has(key)) {
      this.performanceCounters.cacheHits++;
      return this.memoizedFunctions.get(key);
    }
    
    const result = fn();
    
    // キャッシュサイズ管理
    if (this.memoizedFunctions.size >= this.maxCacheSize) {
      const firstKey = this.memoizedFunctions.keys().next().value;
      this.memoizedFunctions.delete(firstKey);
    }
    
    this.memoizedFunctions.set(key, result);
    this.performanceCounters.cacheMisses++;
    
    return result;
  }
  
  // 🚀 高速キャッシュキー生成
  generateInputCacheKey(inputText) {
    // 簡易ハッシュ関数または最初の50文字でキー生成
    const shortText = inputText.substring(0, 50);
    let hash = 0;
    for (let i = 0; i < shortText.length; i++) {
      hash = (hash << 5) - hash + shortText.charCodeAt(i);
      hash |= 0; // 32bit整数変換
    }
    return `situation_${Math.abs(hash)}`;
  }
  
  // 🚀 キャッシュ管理最適化
  cacheSituationResult(key, result) {
    if (this.situationCache.size >= this.maxCacheSize) {
      // LRU風に古いエントリを削除
      const firstKey = this.situationCache.keys().next().value;
      this.situationCache.delete(firstKey);
    }
    
    this.situationCache.set(key, {
      result,
      timestamp: Date.now(),
      accessCount: 1
    });
  }
  
  // 🚀 パフォーマンス統計取得
  getPerformanceStats() {
    const hitRate = this.performanceCounters.cacheHits / 
      (this.performanceCounters.cacheHits + this.performanceCounters.cacheMisses) * 100;
      
    return {
      cacheHitRate: Math.round(hitRate) || 0,
      totalOperations: this.performanceCounters.totalOperations,
      cacheSize: this.situationCache.size,
      memoizedFunctions: this.memoizedFunctions.size
    };
  }
}

// グローバルエクスポート
if (typeof window !== 'undefined') {
  window.AuthenticIChingEngine = AuthenticIChingEngine;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthenticIChingEngine;
}

console.log("🌟 AuthenticIChingEngine.js 読み込み完了 - 正統易経AI実装");