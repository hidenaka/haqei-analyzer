/**
 * HAQEI質問データ管理システム - QuestionManager.js
 * 
 * bunenjin哲学に基づく高品質質問データ管理クラス
 * 易経8次元統合・Triple OS Architecture対応・高性能キャッシング実装
 * 
 * 設計思想:
 * - bunenjin分人アプローチによる質問分類
 * - I Ching 8次元（乾創造性〜兌調和性）との完全統合
 * - Triple OS Architecture（Engine/Interface/Safe Mode）対応
 * - エラー回復機能付きデータ取得
 * - 高性能キャッシング＆メモリ効率化
 * 
 * Author: HAQEI Programmer Agent
 * Version: 1.0.0-bunenjin-integrated
 * Created: 2025-08-05
 */

class QuestionManager {
  constructor(options = {}) {
    this.version = "1.0.0-bunenjin-integrated";
    this.philosophyAlignment = "bunenjin-iching-triple-os";
    
    // 設定オプション
    this.config = {
      enableCaching: options.enableCaching !== false,
      cacheTimeout: options.cacheTimeout || 1800000, // 30分
      enableBunenjinMode: options.enableBunenjinMode !== false,
      enableIChing8Dimensions: options.enableIChing8Dimensions !== false,
      enableTripleOSMode: options.enableTripleOSMode !== false,
      enableErrorRecovery: options.enableErrorRecovery !== false,
      enablePerformanceOptimization: options.enablePerformanceOptimization !== false,
      debugMode: options.debugMode || false,
      memoryOptimization: options.memoryOptimization !== false,
      ...options
    };
    
    // データストレージ
    this.questions = new Map(); // 質問データ本体
    this.questionsByCategory = new Map(); // カテゴリ別インデックス
    this.questionsByDimension = new Map(); // 8次元別インデックス
    this.questionsArray = []; // VirtualQuestionFlowとの互換性
    
    // I Ching 8次元定義
    this.ichingDimensions = {
      '乾_創造性': { 
        trigram: '☰', 
        element: 'metal', 
        nature: 'creative',
        complementary: '坤_受容性',
        conflicting: '艮_安定性'
      },
      '震_行動性': { 
        trigram: '☳', 
        element: 'wood', 
        nature: 'dynamic',
        complementary: '巽_適応性',
        conflicting: '兌_調和性'
      },
      '坎_探求性': { 
        trigram: '☵', 
        element: 'water', 
        nature: 'penetrating',
        complementary: '離_表現性',
        conflicting: '艮_安定性'
      },
      '艮_安定性': { 
        trigram: '☶', 
        element: 'earth', 
        nature: 'stable',
        complementary: '兌_調和性',
        conflicting: '乾_創造性'
      },
      '坤_受容性': { 
        trigram: '☷', 
        element: 'earth', 
        nature: 'receptive',
        complementary: '乾_創造性',
        conflicting: '震_行動性'
      },
      '巽_適応性': { 
        trigram: '☴', 
        element: 'wood', 
        nature: 'gentle',
        complementary: '震_行動性',
        conflicting: '艮_安定性'
      },
      '離_表現性': { 
        trigram: '☲', 
        element: 'fire', 
        nature: 'clinging',
        complementary: '坎_探求性',
        conflicting: '坤_受容性'
      },
      '兌_調和性': { 
        trigram: '☱', 
        element: 'metal', 
        nature: 'joyful',
        complementary: '艮_安定性',
        conflicting: '震_行動性'
      }
    };
    
    // bunenjin分人システム
    this.bunenjinPersonas = {
      analyticalSelf: {
        active: false,
        questions: [],
        approach: 'logical-systematic',
        ichingAlignment: ['坎_探求性', '乾_創造性']
      },
      emotionalSelf: {
        active: false,
        questions: [],
        approach: 'empathetic-intuitive', 
        ichingAlignment: ['兌_調和性', '坤_受容性']
      },
      pragmaticSelf: {
        active: false,
        questions: [],
        approach: 'practical-results',
        ichingAlignment: ['震_行動性', '艮_安定性']
      },
      creativeSelf: {
        active: false,
        questions: [],
        approach: 'innovative-expressive',
        ichingAlignment: ['離_表現性', '巽_適応性']
      }
    };
    
    // Triple OS Architecture対応
    this.tripleOS = {
      engineMode: { questions: [], priority: 'high' },
      interfaceMode: { questions: [], priority: 'medium' },
      safeModeMode: { questions: [], priority: 'low' }
    };
    
    // キャッシュシステム
    this.cache = new Map();
    this.cacheMetadata = new Map();
    
    // パフォーマンス追跡
    this.performanceMetrics = {
      totalQuestions: 0,
      loadTime: 0,
      cacheHitRate: 0,
      memoryUsage: 0,
      categoriesCount: 0,
      dimensionsCount: 0,
      cacheMisses: 0,
      cacheHits: 0,
      dataIntegrityChecks: 0,
      errorRecoveries: 0
    };
    
    // エラー管理
    this.errors = [];
    this.errorRecoveryStrategies = new Map();
    
    // 初期化
    this.initialize();
    
    console.log(`🌟 QuestionManager v${this.version} initialized - bunenjin philosophy integrated`);
  }
  
  /**
   * システム初期化
   */
  async initialize() {
    const startTime = performance.now();
    
    try {
      // エラー回復戦略の初期化
      if (this.config.enableErrorRecovery) {
        this.initializeErrorRecoveryStrategies();
      }
      
      // 質問データの読み込み
      await this.loadQuestionData();
      
      // bunenjin分類システムの初期化
      if (this.config.enableBunenjinMode) {
        this.initializeBunenjinClassification();
      }
      
      // I Ching 8次元分析の初期化
      if (this.config.enableIChing8Dimensions) {
        this.initializeIChing8DimensionMapping();
      }
      
      // Triple OS分類の初期化
      if (this.config.enableTripleOSMode) {
        this.initializeTripleOSClassification();
      }
      
      // データ整合性チェック
      this.performDataIntegrityCheck();
      
      // パフォーマンス統計の更新
      this.performanceMetrics.loadTime = performance.now() - startTime;
      this.updatePerformanceMetrics();
      
      console.log(`✅ QuestionManager initialized in ${this.performanceMetrics.loadTime.toFixed(2)}ms`);
      
    } catch (error) {
      console.error('❌ QuestionManager initialization failed:', error);
      this.handleError('INITIALIZATION_FAILED', error);
      
      // 緊急フォールバック
      await this.emergencyFallback();
    }
  }
  
  /**
   * 質問データの読み込み
   */
  async loadQuestionData() {
    // キャッシュから確認
    const cachedData = this.getCachedData('question_data_full');
    if (cachedData && this.isValidCache(cachedData)) {
      this.loadFromCache(cachedData);
      this.performanceMetrics.cacheHits++;
      console.log('📦 Question data loaded from cache');
      return;
    }
    
    try {
      // グローバル質問データの確認
      if (typeof WORLDVIEW_QUESTIONS !== 'undefined' && typeof SCENARIO_QUESTIONS !== 'undefined') {
        const allQuestions = [...WORLDVIEW_QUESTIONS, ...SCENARIO_QUESTIONS];
        this.processRawQuestionData(allQuestions);
        
        // キャッシュに保存
        this.setCacheData('question_data_full', {
          questions: allQuestions,
          processedAt: Date.now(),
          version: this.version
        });
        
        console.log(`📚 Loaded ${allQuestions.length} questions from global data`);
        
      } else {
        // フォールバック: 外部ファイルから読み込み
        await this.loadFromExternalFile();
      }
      
      this.performanceMetrics.cacheMisses++;
      
    } catch (error) {
      console.error('❌ Failed to load question data:', error);
      this.handleError('DATA_LOAD_FAILED', error);
      
      if (this.config.enableErrorRecovery) {
        await this.executeErrorRecovery('DATA_LOAD_FAILED');
      }
    }
  }
  
  /**
   * rawな質問データの処理
   */
  processRawQuestionData(rawQuestions) {
    this.questions.clear();
    this.questionsArray = [];
    
    rawQuestions.forEach((question, index) => {
      // 質問データの正規化とエンリッチメント
      const processedQuestion = this.normalizeQuestionData(question, index);
      
      // 質問データの格納
      this.questions.set(question.id, processedQuestion);
      this.questionsArray[index] = processedQuestion;
      
      // カテゴリ別インデックス
      this.addToCategory(processedQuestion);
      
      // I Ching次元別インデックス
      if (this.config.enableIChing8Dimensions) {
        this.addToIChing8Dimensions(processedQuestion);
      }
    });
    
    this.performanceMetrics.totalQuestions = rawQuestions.length;
    console.log(`🔄 Processed ${rawQuestions.length} questions with enrichment`);
  }
  
  /**
   * 質問データの正規化とエンリッチメント
   */
  normalizeQuestionData(rawQuestion, index) {
    const processedQuestion = {
      // 基本データ
      id: rawQuestion.id,
      index: index,
      text: rawQuestion.text,
      options: rawQuestion.options || [],
      
      // メタデータ
      category: this.detectQuestionCategory(rawQuestion),
      type: this.detectQuestionType(rawQuestion),
      difficulty: this.calculateDifficulty(rawQuestion),
      
      // bunenjin分類
      bunenjinPersona: null,
      bunenjinWeight: 0,
      
      // I Ching 8次元分析
      ichingDimensions: new Map(),
      primaryDimension: null,
      dimensionWeights: new Map(),
      
      // Triple OS分類
      tripleOSMode: null,
      osCompatibility: {
        engine: 0,
        interface: 0,
        safeMode: 0
      },
      
      // パフォーマンス情報
      averageResponseTime: 0,
      complexityScore: 0,
      userEngagement: 0,
      
      // 時間情報
      createdAt: Date.now(),
      processedAt: Date.now(),
      
      // 元データ
      rawData: rawQuestion
    };
    
    // オプションの処理とスコアリング分析
    if (rawQuestion.options) {
      processedQuestion.options = rawQuestion.options.map(option => 
        this.processQuestionOption(option, rawQuestion.id)
      );
      
      // スコアリングタグからI Ching次元を抽出
      this.extractIChing8DimensionsFromOptions(processedQuestion);
    }
    
    return processedQuestion;
  }
  
  /**
   * 質問オプションの処理
   */
  processQuestionOption(rawOption, questionId) {
    return {
      value: rawOption.value,
      text: rawOption.text,
      
      // スコアリング情報
      scoringTags: rawOption.scoring_tags || [],
      kouiLevel: rawOption.koui_level || 1,
      
      // I Ching分析
      ichingImpact: this.analyzeIChing8Impact(rawOption.scoring_tags || []),
      
      // bunenjin適合度
      bunenjinAlignment: this.analyzeBunenjinAlignment(rawOption.scoring_tags || []),
      
      // 複雑度と重要度
      complexity: this.calculateOptionComplexity(rawOption),
      weight: this.calculateOptionWeight(rawOption),
      
      // 元データ
      rawData: rawOption
    };
  }
  
  /**
   * I Ching 8次元への影響分析
   */
  analyzeIChing8Impact(scoringTags) {
    const impact = new Map();
    
    scoringTags.forEach(tag => {
      if (this.ichingDimensions[tag.key]) {
        impact.set(tag.key, {
          value: tag.value,
          type: tag.type || 'direct',
          strength: Math.abs(tag.value),
          positive: tag.value > 0
        });
      }
    });
    
    return impact;
  }
  
  /**
   * bunenjin分人適合度の分析
   */
  analyzeBunenjinAlignment(scoringTags) {
    const alignment = {
      analyticalSelf: 0,
      emotionalSelf: 0,
      pragmaticSelf: 0,
      creativeSelf: 0
    };
    
    scoringTags.forEach(tag => {
      const dimension = tag.key;
      const value = tag.value;
      
      // 分人ごとの適合度計算
      Object.keys(this.bunenjinPersonas).forEach(persona => {
        const personaData = this.bunenjinPersonas[persona];
        if (personaData.ichingAlignment.includes(dimension)) {
          alignment[persona] += Math.abs(value) * 0.8;
        }
      });
    });
    
    return alignment;
  }
  
  /**
   * bunenjin分類システムの初期化
   */
  initializeBunenjinClassification() {
    this.questions.forEach(question => {
      const bestPersona = this.determineBestBunenjinPersona(question);
      question.bunenjinPersona = bestPersona.persona;
      question.bunenjinWeight = bestPersona.weight;
      
      // 分人別リストに追加
      this.bunenjinPersonas[bestPersona.persona].questions.push(question.id);
    });
    
    console.log('🎭 bunenjin classification completed');
  }
  
  /**
   * 最適なbunenjin分人の決定
   */
  determineBestBunenjinPersona(question) {
    const scores = {
      analyticalSelf: 0,
      emotionalSelf: 0,
      pragmaticSelf: 0,
      creativeSelf: 0
    };
    
    // オプションからbunenjin適合度を計算
    question.options.forEach(option => {
      Object.entries(option.bunenjinAlignment).forEach(([persona, score]) => {
        scores[persona] += score;
      });
    });
    
    // 最高スコアの分人を選択
    const bestPersona = Object.entries(scores).reduce((best, [persona, score]) => 
      score > best.score ? { persona, score } : best
    , { persona: 'pragmaticSelf', score: 0 });
    
    return {
      persona: bestPersona.persona,
      weight: bestPersona.score / question.options.length
    };
  }
  
  /**
   * I Ching 8次元マッピングの初期化
   */
  initializeIChing8DimensionMapping() {
    Object.keys(this.ichingDimensions).forEach(dimension => {
      this.questionsByDimension.set(dimension, []);
    });
    
    this.questions.forEach(question => {
      this.mapQuestionToIChing8Dimensions(question);
    });
    
    console.log('☯️ I Ching 8-dimension mapping completed');
  }
  
  /**
   * 質問のI Ching 8次元へのマッピング
   */
  mapQuestionToIChing8Dimensions(question) {
    const dimensionScores = new Map();
    
    // オプションからI Ching次元を抽出
    question.options.forEach(option => {
      option.ichingImpact.forEach((impact, dimension) => {
        const currentScore = dimensionScores.get(dimension) || 0;
        dimensionScores.set(dimension, currentScore + impact.strength);
      });
    });
    
    // 主要次元の決定
    if (dimensionScores.size > 0) {
      const primaryDimension = [...dimensionScores.entries()].reduce((max, current) => 
        current[1] > max[1] ? current : max
      )[0];
      
      question.primaryDimension = primaryDimension;
      question.dimensionWeights = dimensionScores;
      
      // 次元別インデックスに追加
      this.questionsByDimension.get(primaryDimension).push(question.id);
    }
  }
  
  /**
   * オプションからI Ching 8次元を抽出
   */
  extractIChing8DimensionsFromOptions(question) {
    const dimensionMap = new Map();
    
    question.options.forEach(option => {
      if (option.rawData.scoring_tags) {
        option.rawData.scoring_tags.forEach(tag => {
          if (this.ichingDimensions[tag.key]) {
            const current = dimensionMap.get(tag.key) || { total: 0, count: 0 };
            dimensionMap.set(tag.key, {
              total: current.total + Math.abs(tag.value),
              count: current.count + 1
            });
          }
        });
      }
    });
    
    question.ichingDimensions = dimensionMap;
  }
  
  /**
   * Triple OS分類の初期化
   */
  initializeTripleOSClassification() {
    this.questions.forEach(question => {
      const osClassification = this.classifyForTripleOS(question);
      question.tripleOSMode = osClassification.mode;
      question.osCompatibility = osClassification.compatibility;
      
      // Triple OS別リストに追加
      this.tripleOS[osClassification.mode + 'Mode'].questions.push(question.id);
    });
    
    console.log('🔺 Triple OS classification completed');
  }
  
  /**
   * Triple OS分類の実行
   */
  classifyForTripleOS(question) {
    const compatibility = {
      engine: 0,
      interface: 0,
      safeMode: 0
    };
    
    // 質問の特性からOS適合度を計算
    if (question.complexity > 0.7) compatibility.engine += 0.8;
    if (question.userEngagement > 0.6) compatibility.interface += 0.7;
    if (question.difficulty < 0.4) compatibility.safeMode += 0.9;
    
    // bunenjin分人からの影響
    switch (question.bunenjinPersona) {
      case 'analyticalSelf':
        compatibility.engine += 0.6;
        break;
      case 'emotionalSelf':
        compatibility.interface += 0.7;
        break;
      case 'pragmaticSelf':
        compatibility.safeMode += 0.5;
        break;
      case 'creativeSelf':
        compatibility.engine += 0.4;
        compatibility.interface += 0.4;
        break;
    }
    
    // 最適なOSモードの決定
    const bestMode = Object.entries(compatibility).reduce((best, [mode, score]) => 
      score > best.score ? { mode, score } : best
    , { mode: 'safeMode', score: 0 });
    
    return {
      mode: bestMode.mode,
      compatibility: compatibility
    };
  }
  
  /**
   * 質問取得メソッド群
   */
  
  /**
   * 全質問の取得
   */
  getAllQuestions() {
    return Array.from(this.questions.values());
  }
  
  /**
   * 質問配列の取得（VirtualQuestionFlow互換）
   */
  getQuestionsArray() {
    return this.questionsArray;
  }
  
  /**
   * IDによる質問取得
   */
  getQuestionById(id) {
    return this.questions.get(id);
  }
  
  /**
   * インデックスによる質問取得
   */
  getQuestionByIndex(index) {
    return this.questionsArray[index];
  }
  
  /**
   * カテゴリ別質問取得
   */
  getQuestionsByCategory(category) {
    const questionIds = this.questionsByCategory.get(category) || [];
    return questionIds.map(id => this.questions.get(id)).filter(Boolean);
  }
  
  /**
   * I Ching次元別質問取得
   */
  getQuestionsByIChing8Dimension(dimension) {
    const questionIds = this.questionsByDimension.get(dimension) || [];
    return questionIds.map(id => this.questions.get(id)).filter(Boolean);
  }
  
  /**
   * bunenjin分人別質問取得
   */
  getQuestionsByBunenjinPersona(persona) {
    if (!this.bunenjinPersonas[persona]) return [];
    
    const questionIds = this.bunenjinPersonas[persona].questions;
    return questionIds.map(id => this.questions.get(id)).filter(Boolean);
  }
  
  /**
   * Triple OS別質問取得
   */
  getQuestionsByTripleOS(osMode) {
    const modeKey = osMode + 'Mode';
    if (!this.tripleOS[modeKey]) return [];
    
    const questionIds = this.tripleOS[modeKey].questions;
    return questionIds.map(id => this.questions.get(id)).filter(Boolean);
  }
  
  /**
   * 高度な質問検索
   */
  
  /**
   * 複合条件での質問検索
   */
  searchQuestions(criteria) {
    let results = Array.from(this.questions.values());
    
    // カテゴリフィルター
    if (criteria.category) {
      results = results.filter(q => q.category === criteria.category);
    }
    
    // bunenjin分人フィルター
    if (criteria.bunenjinPersona) {
      results = results.filter(q => q.bunenjinPersona === criteria.bunenjinPersona);
    }
    
    // I Ching次元フィルター
    if (criteria.ichingDimension) {
      results = results.filter(q => q.primaryDimension === criteria.ichingDimension);
    }
    
    // Triple OSフィルター
    if (criteria.tripleOSMode) {
      results = results.filter(q => q.tripleOSMode === criteria.tripleOSMode);
    }
    
    // 難易度フィルター
    if (criteria.minDifficulty !== undefined) {
      results = results.filter(q => q.difficulty >= criteria.minDifficulty);
    }
    
    if (criteria.maxDifficulty !== undefined) {
      results = results.filter(q => q.difficulty <= criteria.maxDifficulty);
    }
    
    // ソート
    if (criteria.sortBy) {
      results.sort((a, b) => {
        const aVal = a[criteria.sortBy];
        const bVal = b[criteria.sortBy];
        return criteria.sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      });
    }
    
    // リミット
    if (criteria.limit) {
      results = results.slice(0, criteria.limit);
    }
    
    return results;
  }
  
  /**
   * I Ching相生相克による関連質問取得
   */
  getRelatedQuestionsByIChing8(questionId) {
    const question = this.questions.get(questionId);
    if (!question || !question.primaryDimension) return [];
    
    const dimension = this.ichingDimensions[question.primaryDimension];
    const relatedQuestions = [];
    
    // 補完関係の質問
    if (dimension.complementary) {
      relatedQuestions.push(
        ...this.getQuestionsByIChing8Dimension(dimension.complementary)
      );
    }
    
    // 対立関係の質問（バランス用）
    if (dimension.conflicting) {
      relatedQuestions.push(
        ...this.getQuestionsByIChing8Dimension(dimension.conflicting).slice(0, 2)
      );
    }
    
    return relatedQuestions.filter(q => q.id !== questionId);
  }
  
  /**
   * bunenjin分人別推奨質問の取得
   */
  getRecommendedQuestionsForPersona(persona, currentAnswers = []) {
    const personaQuestions = this.getQuestionsByBunenjinPersona(persona);
    const answeredIds = new Set(currentAnswers.map(a => a.questionId));
    
    // 未回答の質問のみフィルタリング
    const unansweredQuestions = personaQuestions.filter(q => !answeredIds.has(q.id));
    
    // bunenjin重要度でソート
    return unansweredQuestions.sort((a, b) => b.bunenjinWeight - a.bunenjinWeight);
  }
  
  /**
   * ユーティリティメソッド群
   */
  
  /**
   * 質問カテゴリの検出
   */
  detectQuestionCategory(question) {
    if (question.scenario || (question.inner_q && question.outer_q)) {
      return 'scenario';
    }
    
    if (question.id && question.id.match(/^q([1-9]|1[0-9]|2[0-4])$/)) {
      return 'worldview';
    }
    
    return 'general';
  }
  
  /**
   * 質問タイプの検出
   */
  detectQuestionType(question) {
    if (question.options && typeof question.options === 'object' && !Array.isArray(question.options)) {
      return 'scenario-choice';
    }
    
    if (question.options && Array.isArray(question.options)) {
      return 'multiple-choice';
    }
    
    return 'unknown';
  }
  
  /**
   * 質問難易度の計算
   */
  calculateDifficulty(question) {
    let difficulty = 0.5; // 基準値
    
    // オプション数による調整
    if (question.options) {
      const optionCount = Array.isArray(question.options) ? question.options.length : Object.keys(question.options).length;
      difficulty += (optionCount - 4) * 0.1; // 4選択肢を基準
    }
    
    // テキスト長による調整
    if (question.text) {
      difficulty += Math.min(question.text.length / 200, 0.3);
    }
    
    return Math.max(0, Math.min(1, difficulty));
  }
  
  /**
   * オプション複雑度の計算
   */
  calculateOptionComplexity(option) {
    let complexity = 0.3; // 基準値
    
    // スコアリングタグ数
    if (option.scoring_tags) {
      complexity += option.scoring_tags.length * 0.1;
    }
    
    // テキスト長
    if (option.text) {
      complexity += Math.min(option.text.length / 100, 0.4);
    }
    
    return Math.max(0, Math.min(1, complexity));
  }
  
  /**
   * オプション重要度の計算
   */
  calculateOptionWeight(option) {
    let weight = 1.0; // 基準値
    
    // 効位レベル
    if (option.koui_level) {
      weight += (option.koui_level - 3) * 0.2; // 三爻を基準
    }
    
    // スコアリング値の総和
    if (option.scoring_tags) {
      const totalScore = option.scoring_tags.reduce((sum, tag) => sum + Math.abs(tag.value), 0);
      weight += totalScore * 0.1;
    }
    
    return Math.max(0.1, weight);
  }
  
  /**
   * カテゴリへの追加
   */
  addToCategory(question) {
    if (!this.questionsByCategory.has(question.category)) {
      this.questionsByCategory.set(question.category, []);
    }
    this.questionsByCategory.get(question.category).push(question.id);
  }
  
  /**
   * I Ching 8次元への追加
   */
  addToIChing8Dimensions(question) {
    question.ichingDimensions.forEach((data, dimension) => {
      if (!this.questionsByDimension.has(dimension)) {
        this.questionsByDimension.set(dimension, []);
      }
      // 重複チェック
      if (!this.questionsByDimension.get(dimension).includes(question.id)) {
        this.questionsByDimension.get(dimension).push(question.id);
      }
    });
  }
  
  /**
   * キャッシュシステム
   */
  
  /**
   * キャッシュデータの取得
   */
  getCachedData(key) {
    if (!this.config.enableCaching) return null;
    
    const cached = this.cache.get(key);
    const metadata = this.cacheMetadata.get(key);
    
    if (cached && metadata && this.isValidCache(metadata)) {
      return cached;
    }
    
    return null;
  }
  
  /**
   * キャッシュデータの設定
   */
  setCacheData(key, data) {
    if (!this.config.enableCaching) return;
    
    this.cache.set(key, data);
    this.cacheMetadata.set(key, {
      createdAt: Date.now(),
      expiresAt: Date.now() + this.config.cacheTimeout,
      version: this.version
    });
  }
  
  /**
   * キャッシュの有効性チェック
   */
  isValidCache(metadata) {
    return metadata.expiresAt > Date.now() && metadata.version === this.version;
  }
  
  /**
   * キャッシュからの読み込み
   */
  loadFromCache(cachedData) {
    if (cachedData.questions) {
      this.processRawQuestionData(cachedData.questions);
    }
  }
  
  /**
   * エラー管理システム
   */
  
  /**
   * エラー回復戦略の初期化
   */
  initializeErrorRecoveryStrategies() {
    this.errorRecoveryStrategies.set('DATA_LOAD_FAILED', {
      strategy: 'fallback-to-local-storage',
      maxAttempts: 3,
      fallback: 'create-minimal-dataset'
    });
    
    this.errorRecoveryStrategies.set('CACHE_ERROR', {
      strategy: 'disable-caching',
      maxAttempts: 1,
      fallback: 'memory-only-mode'
    });
    
    this.errorRecoveryStrategies.set('PROCESSING_ERROR', {
      strategy: 'skip-problematic-question',
      maxAttempts: 2,
      fallback: 'use-simplified-processing'
    });
    
    console.log('🛡️ Error recovery strategies initialized');
  }
  
  /**
   * エラーハンドリング
   */
  handleError(errorType, error) {
    const errorData = {
      type: errorType,
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      context: this.getErrorContext()
    };
    
    this.errors.push(errorData);
    
    // エラーログの制限
    if (this.errors.length > 50) {
      this.errors.shift();
    }
    
    console.error(`❌ QuestionManager Error [${errorType}]:`, error);
  }
  
  /**
   * エラー回復の実行
   */
  async executeErrorRecovery(errorType) {
    const strategy = this.errorRecoveryStrategies.get(errorType);
    if (!strategy) return false;
    
    try {
      switch (strategy.strategy) {
        case 'fallback-to-local-storage':
          return await this.fallbackToLocalStorage();
        case 'disable-caching':
          return this.disableCaching();
        case 'skip-problematic-question':
          return this.skipProblematicQuestions();
        case 'create-minimal-dataset':
          return this.createMinimalDataset();
        default:
          return false;
      }
    } catch (recoveryError) {
      console.error(`❌ Error recovery failed for ${errorType}:`, recoveryError);
      this.performanceMetrics.errorRecoveries++;
      return false;
    }
  }
  
  /**
   * 緊急フォールバック
   */
  async emergencyFallback() {
    console.warn('🚨 Emergency fallback activated');
    
    // 最小限のデータセットを作成
    await this.createMinimalDataset();
    
    // キャッシング無効化
    this.config.enableCaching = false;
    
    // 高度な機能を無効化
    this.config.enableBunenjinMode = false;
    this.config.enableIChing8Dimensions = false;
    this.config.enableTripleOSMode = false;
    
    console.log('✅ Emergency fallback completed');
  }
  
  /**
   * 最小限のデータセット作成
   */
  createMinimalDataset() {
    const minimalQuestions = [
      {
        id: "fallback_q1",
        text: "システムエラーが発生しました。基本的な分析を行いますか？",
        options: [
          { value: "A", text: "はい", scoring_tags: [{ key: "乾_創造性", value: 1.0 }] },
          { value: "B", text: "いいえ", scoring_tags: [{ key: "坤_受容性", value: 1.0 }] }
        ]
      }
    ];
    
    try {
      this.processRawQuestionData(minimalQuestions);
      console.log('🛡️ Minimal dataset created successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to create minimal dataset:', error);
      return false;
    }
  }
  
  /**
   * パフォーマンス監視とメトリクス
   */
  
  /**
   * パフォーマンスメトリクスの更新
   */
  updatePerformanceMetrics() {
    this.performanceMetrics.categoriesCount = this.questionsByCategory.size;
    this.performanceMetrics.dimensionsCount = this.questionsByDimension.size;
    this.performanceMetrics.cacheHitRate = this.calculateCacheHitRate();
    
    if (performance.memory) {
      this.performanceMetrics.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
    }
  }
  
  /**
   * キャッシュヒット率の計算
   */
  calculateCacheHitRate() {
    const total = this.performanceMetrics.cacheHits + this.performanceMetrics.cacheMisses;
    return total > 0 ? (this.performanceMetrics.cacheHits / total) * 100 : 0;
  }
  
  /**
   * データ整合性チェック
   */
  performDataIntegrityCheck() {
    let issues = 0;
    
    // 質問データの整合性チェック
    this.questions.forEach((question, id) => {
      if (question.id !== id) {
        console.warn(`⚠️ Question ID mismatch: ${id} vs ${question.id}`);
        issues++;
      }
      
      if (!question.options || question.options.length === 0) {
        console.warn(`⚠️ Question ${id} has no options`);
        issues++;
      }
    });
    
    // インデックスの整合性チェック
    this.questionsByCategory.forEach((questionIds, category) => {
      questionIds.forEach(id => {
        if (!this.questions.has(id)) {
          console.warn(`⚠️ Category ${category} references non-existent question ${id}`);
          issues++;
        }
      });
    });
    
    this.performanceMetrics.dataIntegrityChecks = issues;
    
    if (issues > 0) {
      console.warn(`⚠️ Found ${issues} data integrity issues`);
    } else {
      console.log('✅ Data integrity check passed');
    }
  }
  
  /**
   * 統計情報とレポート
   */
  
  /**
   * システム統計の取得
   */
  getSystemStatistics() {
    this.updatePerformanceMetrics();
    
    return {
      version: this.version,
      totalQuestions: this.performanceMetrics.totalQuestions,
      categories: Array.from(this.questionsByCategory.keys()),
      ichingDimensions: Object.keys(this.ichingDimensions),
      bunenjinPersonas: Object.keys(this.bunenjinPersonas),
      tripleOSModes: Object.keys(this.tripleOS),
      performanceMetrics: { ...this.performanceMetrics },
      errorCount: this.errors.length,
      cacheSize: this.cache.size,
      memoryUsage: this.performanceMetrics.memoryUsage,
      uptime: Date.now() - (this.performanceMetrics.startTime || Date.now())
    };
  }
  
  /**
   * bunenjin分析レポート
   */
  getBunenjinAnalysisReport() {
    const report = {
      totalQuestions: this.performanceMetrics.totalQuestions,
      personas: {}
    };
    
    Object.entries(this.bunenjinPersonas).forEach(([persona, data]) => {
      report.personas[persona] = {
        questionCount: data.questions.length,
        percentage: (data.questions.length / this.performanceMetrics.totalQuestions) * 100,
        approach: data.approach,
        ichingAlignment: data.ichingAlignment,
        active: data.active
      };
    });
    
    return report;
  }
  
  /**
   * I Ching 8次元分析レポート
   */
  getIChing8DimensionReport() {
    const report = {
      totalQuestions: this.performanceMetrics.totalQuestions,
      dimensions: {}
    };
    
    Object.entries(this.ichingDimensions).forEach(([dimension, data]) => {
      const questionIds = this.questionsByDimension.get(dimension) || [];
      report.dimensions[dimension] = {
        questionCount: questionIds.length,
        percentage: (questionIds.length / this.performanceMetrics.totalQuestions) * 100,
        trigram: data.trigram,
        element: data.element,
        nature: data.nature,
        complementary: data.complementary,
        conflicting: data.conflicting,
        questions: questionIds
      };
    });
    
    return report;
  }
  
  /**
   * ヘルスチェック
   */
  performHealthCheck() {
    const health = {
      status: 'healthy',
      score: 100,
      issues: [],
      recommendations: []
    };
    
    // データ整合性
    if (this.performanceMetrics.dataIntegrityChecks > 0) {
      health.status = 'warning';
      health.score -= 20;
      health.issues.push('Data integrity issues detected');
      health.recommendations.push('Run data validation and repair');
    }
    
    // エラー率
    if (this.errors.length > 10) {
      health.status = 'critical';
      health.score -= 30;
      health.issues.push('High error rate');
      health.recommendations.push('Review error logs and fix issues');
    }
    
    // メモリ使用量
    if (this.performanceMetrics.memoryUsage > 100) {
      health.score -= 15;
      health.issues.push('High memory usage');
      health.recommendations.push('Enable memory optimization');
    }
    
    // キャッシュ効率
    if (this.performanceMetrics.cacheHitRate < 70) {
      health.score -= 10;
      health.issues.push('Low cache hit rate');
      health.recommendations.push('Optimize caching strategy');
    }
    
    return health;
  }
  
  /**
   * エラーコンテキストの取得
   */
  getErrorContext() {
    return {
      questionsLoaded: this.questions.size,
      categoriesCount: this.questionsByCategory.size,
      dimensionsCount: this.questionsByDimension.size,
      cacheSize: this.cache.size,
      memoryUsage: this.performanceMetrics.memoryUsage,
      config: { ...this.config }
    };
  }
  
  /**
   * 外部ファイルからの読み込み（フォールバック）
   */
  async loadFromExternalFile() {
    try {
      // questions.jsファイルの動的読み込み
      const module = await import('/js/shared/data/questions.js');
      if (module.WORLDVIEW_QUESTIONS && module.SCENARIO_QUESTIONS) {
        const allQuestions = [...module.WORLDVIEW_QUESTIONS, ...module.SCENARIO_QUESTIONS];
        this.processRawQuestionData(allQuestions);
        console.log('📚 Questions loaded from external file');
        return true;
      }
    } catch (error) {
      console.error('❌ Failed to load from external file:', error);
    }
    
    return false;
  }
  
  /**
   * LocalStorageへのフォールバック
   */
  async fallbackToLocalStorage() {
    try {
      const stored = localStorage.getItem('haqei_question_data');
      if (stored) {
        const data = JSON.parse(stored);
        this.processRawQuestionData(data.questions || []);
        console.log('📦 Questions loaded from localStorage');
        return true;
      }
    } catch (error) {
      console.error('❌ LocalStorage fallback failed:', error);
    }
    
    return false;
  }
  
  /**
   * キャッシングの無効化
   */
  disableCaching() {
    this.config.enableCaching = false;
    this.cache.clear();
    this.cacheMetadata.clear();
    console.log('🚫 Caching disabled due to errors');
    return true;
  }
  
  /**
   * 問題のある質問のスキップ
   */
  skipProblematicQuestions() {
    // 実装は使用ケースに応じて
    console.log('⏭️ Skipping problematic questions');
    return true;
  }
  
  /**
   * クリーンアップ
   */
  cleanup() {
    // キャッシュクリア
    this.cache.clear();
    this.cacheMetadata.clear();
    
    // データクリア
    this.questions.clear();
    this.questionsByCategory.clear();
    this.questionsByDimension.clear();
    this.questionsArray = [];
    
    // エラーログクリア
    this.errors = [];
    
    console.log('🧹 QuestionManager cleaned up');
  }
}

// グローバル公開
if (typeof window !== 'undefined') {
  window.QuestionManager = QuestionManager;
}

// Node.js環境での公開
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuestionManager;
}

console.log("🌟 QuestionManager.js loaded - bunenjin philosophy & I Ching 8-dimension ready");