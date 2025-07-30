// IChingUltraSyncLogic.js - 易経ウルトラシンク・ロジック20
// HaQei Analyzer - 易経に基づいた高度な診断ロジック実装

class IChingUltraSyncLogic {
  constructor(dataManager) {
    this.dataManager = dataManager;
    this.hexagramData = null;
    this.trigramData = null;
    this.elementData = null;
    
    // 性能最適化のためのキャッシュ
    this.analysisCache = new Map();
    this.lastCacheCleanup = Date.now();
    this.cacheTimeout = 5 * 60 * 1000; // 5分間キャッシュ
    
    // 分析レベル設定
    this.analysisLevel = 'essential'; // 'essential', 'standard', 'comprehensive'
    
    // 初期化
    this.initialize();
  }

  async initialize() {
    try {
      // 必要なデータを読み込み
      this.hexagramData = this.dataManager.getAllHexagramData();
      this.trigramData = this.loadTrigramData();
      this.elementData = this.loadElementData();
      
      console.log("🔯 IChingUltraSyncLogic initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize IChingUltraSyncLogic:", error);
    }
  }

  // メイン分析メソッド - 最適化された並列実行
  async analyzeTripleOSWithUltraSync(engineOS, interfaceOS, safeModeOS, options = {}) {
    const startTime = performance.now();
    console.log("🔯 Starting Ultra Sync Logic Analysis (Optimized)...");
    
    // キャッシュキーを生成
    const cacheKey = this.generateCacheKey(engineOS, interfaceOS, safeModeOS, options);
    
    // キャッシュから結果を取得
    const cachedResult = this.getCachedResult(cacheKey);
    if (cachedResult) {
      console.log("💨 Using cached analysis result");
      return cachedResult;
    }
    
    // 分析レベルを決定
    const analysisLevel = options.level || this.analysisLevel;
    
    // プログレス追跡
    const progressCallback = options.onProgress || (() => {});
    
    try {
      // 分析レベルに応じた並列実行
      const results = await this.executeParallelAnalysis(
        engineOS, interfaceOS, safeModeOS, 
        analysisLevel, progressCallback
      );
      
      // 統合分析結果を生成
      const integratedInsights = this.generateIntegratedInsights(results);
      
      const finalResult = {
        logicResults: results,
        integratedInsights: integratedInsights,
        overallAssessment: this.generateOverallAssessment(results),
        analysisLevel: analysisLevel,
        processingTime: performance.now() - startTime
      };
      
      // 結果をキャッシュ
      this.setCachedResult(cacheKey, finalResult);
      
      console.log(`✅ Ultra Sync Logic Analysis completed in ${finalResult.processingTime.toFixed(2)}ms`);
      
      return finalResult;
      
    } catch (error) {
      console.error("❌ Ultra Sync Logic Analysis failed:", error);
      
      // フォールバック: 基本分析のみ実行
      return this.executeBasicAnalysis(engineOS, interfaceOS, safeModeOS);
    }
  }

  // ========== 最適化された分析実行システム ==========
  
  // 分析レベル定義
  getAnalysisConfiguration(level) {
    const configurations = {
      essential: {
        name: "必須分析",
        methods: [
          'greatTheme', 'internalExternalInversion', 'trigramResonance'
        ],
        description: "コア分析のみ実行（最高速度）"
      },
      standard: {
        name: "標準分析",
        methods: [
          'greatTheme', 'internalExternalInversion', 'trigramResonance',
          'lineCorrespondence', 'fiveElementCycles', 'nuclearHexagram',
          'changingHexagram', 'seasonalMismatch'
        ],
        description: "バランスの取れた分析（推奨）"
      },
      comprehensive: {
        name: "包括分析",
        methods: [
          'greatTheme', 'internalExternalInversion', 'trigramResonance',
          'lineCorrespondence', 'fiveElementCycles', 'nuclearHexagram',
          'invertedHexagram', 'flippedHexagram', 'changingHexagram', 
          'seasonalMismatch', 'rulerMinisterAlignment', 'comingGoing',
          'timelyModeration', 'ritualOracle', 'familyDynamics',
          'vehicle', 'vessel', 'virtue', 'symbolicAnimals', 'unchanging'
        ],
        description: "全20種類の分析を実行（最高精度）"
      }
    };
    
    return configurations[level] || configurations.standard;
  }
  
  // 並列分析実行
  async executeParallelAnalysis(engineOS, interfaceOS, safeModeOS, level, progressCallback) {
    const config = this.getAnalysisConfiguration(level);
    const methods = config.methods;
    const totalMethods = methods.length;
    
    progressCallback({ stage: 'initialization', progress: 0, total: totalMethods });
    
    // バッチサイズを決定（同時実行数を制限してメモリ効率化）
    const batchSize = level === 'comprehensive' ? 5 : 3;
    const results = {};
    
    // バッチごとに並列実行
    for (let i = 0; i < methods.length; i += batchSize) {
      const batch = methods.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (methodName) => {
        try {
          const methodMap = {
            'greatTheme': () => this.analyzeGreatTheme(engineOS, interfaceOS, safeModeOS),
            'internalExternalInversion': () => this.analyzeInternalExternalInversion(engineOS, interfaceOS, safeModeOS),
            'trigramResonance': () => this.analyzeTrigramResonance(engineOS, interfaceOS, safeModeOS),
            'lineCorrespondence': () => this.analyzeLineCorrespondence(engineOS, interfaceOS, safeModeOS),
            'fiveElementCycles': () => this.analyzeFiveElementCycles(engineOS, interfaceOS, safeModeOS),
            'nuclearHexagram': () => this.analyzeNuclearHexagram(engineOS, interfaceOS, safeModeOS),
            'invertedHexagram': () => this.analyzeInvertedHexagram(engineOS, interfaceOS, safeModeOS),
            'flippedHexagram': () => this.analyzeFlippedHexagram(engineOS, interfaceOS, safeModeOS),
            'changingHexagram': () => this.analyzeChangingHexagram(engineOS, interfaceOS, safeModeOS),
            'seasonalMismatch': () => this.analyzeSeasonalMismatch(engineOS, interfaceOS, safeModeOS),
            'rulerMinisterAlignment': () => this.analyzeRulerMinisterAlignment(engineOS, interfaceOS, safeModeOS),
            'comingGoing': () => this.analyzeComingGoing(engineOS, interfaceOS, safeModeOS),
            'timelyModeration': () => this.analyzeTimelyModeration(engineOS, interfaceOS, safeModeOS),
            'ritualOracle': () => this.analyzeRitualOracle(engineOS, interfaceOS, safeModeOS),
            'familyDynamics': () => this.analyzeFamilyDynamics(engineOS, interfaceOS, safeModeOS),
            'vehicle': () => this.analyzeVehicle(engineOS, interfaceOS, safeModeOS),
            'vessel': () => this.analyzeVessel(engineOS, interfaceOS, safeModeOS),
            'virtue': () => this.analyzeVirtue(engineOS, interfaceOS, safeModeOS),
            'symbolicAnimals': () => this.analyzeSymbolicAnimals(engineOS, interfaceOS, safeModeOS),
            'unchanging': () => this.analyzeUnchanging(engineOS, interfaceOS, safeModeOS)
          };
          
          const result = await methodMap[methodName]();
          return { methodName, result };
        } catch (error) {
          console.warn(`⚠️ Analysis method ${methodName} failed:`, error);
          return { methodName, result: this.getDefaultAnalysisResult(methodName) };
        }
      });
      
      // バッチの並列実行
      const batchResults = await Promise.all(batchPromises);
      
      // 結果をマージ
      batchResults.forEach(({ methodName, result }) => {
        results[methodName] = result;
      });
      
      // プログレス更新
      const completedMethods = Math.min(i + batchSize, totalMethods);
      progressCallback({ 
        stage: 'analysis', 
        progress: completedMethods, 
        total: totalMethods,
        currentBatch: batch
      });
    }
    
    progressCallback({ stage: 'completion', progress: totalMethods, total: totalMethods });
    
    return results;
  }
  
  // フォールバック用基本分析
  executeBasicAnalysis(engineOS, interfaceOS, safeModeOS) {
    console.log("🔄 Executing fallback basic analysis...");
    
    try {
      return {
        logicResults: {
          greatTheme: this.analyzeGreatTheme(engineOS, interfaceOS, safeModeOS),
          internalExternalInversion: this.analyzeInternalExternalInversion(engineOS, interfaceOS, safeModeOS),
          trigramResonance: this.analyzeTrigramResonance(engineOS, interfaceOS, safeModeOS)
        },
        integratedInsights: { summary: "基本分析のみ実行されました" },
        overallAssessment: { level: "basic", confidence: 0.7 },
        analysisLevel: "essential",
        processingTime: 0,
        fallback: true
      };
    } catch (error) {
      console.error("❌ Even basic analysis failed:", error);
      return this.getEmptyAnalysisResult();
    }
  }
  
  // キャッシュシステム
  generateCacheKey(engineOS, interfaceOS, safeModeOS, options) {
    const keyData = {
      engine: engineOS.osId,
      interface: interfaceOS.hexagramId,
      safeMode: safeModeOS.hexagramId,
      level: options.level || this.analysisLevel
    };
    return JSON.stringify(keyData);
  }
  
  getCachedResult(cacheKey) {
    this.cleanupExpiredCache();
    
    const cached = this.analysisCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.result;
    }
    return null;
  }
  
  setCachedResult(cacheKey, result) {
    this.analysisCache.set(cacheKey, {
      result: result,
      timestamp: Date.now()
    });
    
    // メモリ使用量制限
    if (this.analysisCache.size > 100) {
      this.cleanupExpiredCache();
    }
  }
  
  cleanupExpiredCache() {
    const now = Date.now();
    if (now - this.lastCacheCleanup < 60000) return; // 1分に1回のみ実行
    
    for (const [key, cached] of this.analysisCache.entries()) {
      if (now - cached.timestamp > this.cacheTimeout) {
        this.analysisCache.delete(key);
      }
    }
    
    this.lastCacheCleanup = now;
  }
  
  // デフォルト結果生成
  getDefaultAnalysisResult(methodName) {
    return {
      type: methodName,
      diagnosis: "分析処理中にエラーが発生しました",
      confidence: 0.5,
      fallback: true
    };
  }
  
  getEmptyAnalysisResult() {
    return {
      logicResults: {},
      integratedInsights: { summary: "分析を実行できませんでした" },
      overallAssessment: { level: "error", confidence: 0 },
      analysisLevel: "none",
      processingTime: 0,
      error: true
    };
  }
  
  // 分析レベル動的変更
  setAnalysisLevel(level) {
    if (['essential', 'standard', 'comprehensive'].includes(level)) {
      this.analysisLevel = level;
      console.log(`🔧 Analysis level changed to: ${level}`);
    } else {
      console.warn(`⚠️ Invalid analysis level: ${level}`);
    }
  }
  
  // ========== 基礎ロジック（1-5） ==========

  // 1. 大テーマの論理 (Logic of the Great Theme)
  analyzeGreatTheme(engineOS, interfaceOS, safeModeOS) {
    console.log("🔯 Analyzing Great Theme Logic...");
    
    const engineTheme = this.getHexagramTheme(engineOS.osId);
    const interfaceTheme = this.getHexagramTheme(interfaceOS.hexagramId);
    const safeModeTheme = this.getHexagramTheme(safeModeOS.hexagramId);
    
    // 卦辞の調和性・対立性を分析
    const themeHarmony = this.calculateThemeHarmony(engineTheme, interfaceTheme, safeModeTheme);
    const themePattern = this.identifyThemePattern(engineTheme, interfaceTheme, safeModeTheme);
    
    return {
      type: "大テーマの論理",
      engineTheme: engineTheme,
      interfaceTheme: interfaceTheme,
      safeModeTheme: safeModeTheme,
      harmony: themeHarmony,
      pattern: themePattern,
      diagnosis: this.generateGreatThemeDiagnosis(themePattern, themeHarmony),
      practicalManifestation: this.getGreatThemeManifestation(themePattern)
    };
  }

  // 2. 内外の反転論理 (Logic of Internal/External Inversion)
  analyzeInternalExternalInversion(engineOS, interfaceOS, safeModeOS) {
    console.log("🔯 Analyzing Internal/External Inversion Logic...");
    
    const engineInversion = this.analyzeInternalExternalBalance(engineOS.osId);
    const interfaceInversion = this.analyzeInternalExternalBalance(interfaceOS.hexagramId);
    const safeModeInversion = this.analyzeInternalExternalBalance(safeModeOS.hexagramId);
    
    // エネルギーの逆流パターンを検出
    const inversionPattern = this.detectInversionPattern(engineInversion, interfaceInversion, safeModeInversion);
    const energyFlow = this.analyzeEnergyFlow(inversionPattern);
    
    return {
      type: "内外の反転論理",
      engineInversion: engineInversion,
      interfaceInversion: interfaceInversion,
      safeModeInversion: safeModeInversion,
      pattern: inversionPattern,
      energyFlow: energyFlow,
      diagnosis: this.generateInversionDiagnosis(inversionPattern, energyFlow),
      practicalManifestation: this.getInversionManifestation(inversionPattern)
    };
  }

  // 3. 八卦の共鳴論理 (Logic of Trigram Resonance)
  analyzeTrigramResonance(engineOS, interfaceOS, safeModeOS) {
    console.log("🔯 Analyzing Trigram Resonance Logic...");
    
    // 各OSの上下八卦を取得
    const engineTrigrams = this.getHexagramTrigrams(engineOS.osId);
    const interfaceTrigrams = this.getHexagramTrigrams(interfaceOS.hexagramId);
    const safeModeTrigrams = this.getHexagramTrigrams(safeModeOS.hexagramId);
    
    // 八卦の重複パターンを分析
    const resonancePattern = this.findTrigramResonance(engineTrigrams, interfaceTrigrams, safeModeTrigrams);
    const dominantTrigrams = this.identifyDominantTrigrams(resonancePattern);
    
    return {
      type: "八卦の共鳴論理",
      engineTrigrams: engineTrigrams,
      interfaceTrigrams: interfaceTrigrams,
      safeModeTrigrams: safeModeTrigrams,
      resonancePattern: resonancePattern,
      dominantTrigrams: dominantTrigrams,
      diagnosis: this.generateResonanceDiagnosis(resonancePattern, dominantTrigrams),
      practicalManifestation: this.getResonanceManifestation(dominantTrigrams)
    };
  }

  // 4. 爻位対応の論理 (Logic of Line-by-Line Correspondence)
  analyzeLineCorrespondence(engineOS, interfaceOS, safeModeOS) {
    console.log("🔯 Analyzing Line Correspondence Logic...");
    
    // 各OSの爻位（6つの線の陰陽）を取得
    const engineLines = this.getHexagramLines(engineOS.osId);
    const interfaceLines = this.getHexagramLines(interfaceOS.hexagramId);
    const safeModeLines = this.getHexagramLines(safeModeOS.hexagramId);
    
    // 同じ爻位での陰陽の対応関係を分析
    const correspondencePattern = this.analyzeLineCorrespondencePattern(engineLines, interfaceLines, safeModeLines);
    const conflictPositions = this.identifyLineConflicts(correspondencePattern);
    
    return {
      type: "爻位対応の論理",
      engineLines: engineLines,
      interfaceLines: interfaceLines,
      safeModeLines: safeModeLines,
      correspondencePattern: correspondencePattern,
      conflictPositions: conflictPositions,
      diagnosis: this.generateLineCorrespondenceDiagnosis(correspondencePattern, conflictPositions),
      practicalManifestation: this.getLineCorrespondenceManifestation(conflictPositions)
    };
  }

  // 5. 五行の相生・相剋論理 (Logic of Five-Element Cycles)
  analyzeFiveElementCycles(engineOS, interfaceOS, safeModeOS) {
    console.log("🔯 Analyzing Five Element Cycles Logic...");
    
    // 各OSの八卦を五行に変換
    const engineElements = this.convertToFiveElements(engineOS.osId);
    const interfaceElements = this.convertToFiveElements(interfaceOS.hexagramId);
    const safeModeElements = this.convertToFiveElements(safeModeOS.hexagramId);
    
    // 五行の相生・相剋関係を分析
    const elementFlow = this.analyzeFiveElementFlow(engineElements, interfaceElements, safeModeElements);
    const harmoniousFlow = this.identifyHarmoniousFlow(elementFlow);
    const conflictingFlow = this.identifyConflictingFlow(elementFlow);
    
    return {
      type: "五行の相生・相剋論理",
      engineElements: engineElements,
      interfaceElements: interfaceElements,
      safeModeElements: safeModeElements,
      elementFlow: elementFlow,
      harmoniousFlow: harmoniousFlow,
      conflictingFlow: conflictingFlow,
      diagnosis: this.generateFiveElementDiagnosis(elementFlow, harmoniousFlow, conflictingFlow),
      practicalManifestation: this.getFiveElementManifestation(elementFlow)
    };
  }

  // ========== 応用ロジック（6-10） ==========

  // 6. 互卦の隠れOS論理 (Logic of the Nuclear Hexagram)
  analyzeNuclearHexagram(engineOS, interfaceOS, safeModeOS) {
    console.log("🔯 Analyzing Nuclear Hexagram Logic...");
    
    // 各OSの互卦を計算
    const engineNuclear = this.calculateNuclearHexagram(engineOS.osId);
    const interfaceNuclear = this.calculateNuclearHexagram(interfaceOS.hexagramId);
    const safeModeNuclear = this.calculateNuclearHexagram(safeModeOS.hexagramId);
    
    // 互卦の関係性を分析
    const nuclearPattern = this.analyzeNuclearPattern(engineNuclear, interfaceNuclear, safeModeNuclear);
    const hiddenQualities = this.identifyHiddenQualities(nuclearPattern);
    
    return {
      type: "互卦の隠れOS論理",
      engineNuclear: engineNuclear,
      interfaceNuclear: interfaceNuclear,
      safeModeNuclear: safeModeNuclear,
      pattern: nuclearPattern,
      hiddenQualities: hiddenQualities,
      diagnosis: this.generateNuclearDiagnosis(nuclearPattern, hiddenQualities),
      practicalManifestation: this.getNuclearManifestation(hiddenQualities)
    };
  }

  // 7. 錯卦の裏人格論理 (Logic of the Inverted Hexagram)
  analyzeInvertedHexagram(engineOS, interfaceOS, safeModeOS) {
    console.log("🔯 Analyzing Inverted Hexagram Logic...");
    
    // 各OSの錯卦（陰陽反転）を計算
    const engineInverted = this.calculateInvertedHexagram(engineOS.osId);
    const interfaceInverted = this.calculateInvertedHexagram(interfaceOS.hexagramId);
    const safeModeInverted = this.calculateInvertedHexagram(safeModeOS.hexagramId);
    
    // 錯卦の一致パターンを分析
    const inversionMatches = this.findInversionMatches(
      {engine: engineOS.osId, interface: interfaceOS.hexagramId, safeMode: safeModeOS.hexagramId},
      {engine: engineInverted, interface: interfaceInverted, safeMode: safeModeInverted}
    );
    
    return {
      type: "錯卦の裏人格論理",
      engineInverted: engineInverted,
      interfaceInverted: interfaceInverted,
      safeModeInverted: safeModeInverted,
      inversionMatches: inversionMatches,
      diagnosis: this.generateInvertedDiagnosis(inversionMatches),
      practicalManifestation: this.getInvertedManifestation(inversionMatches)
    };
  }

  // 8. 綜卦の視点転換論理 (Logic of the Flipped Hexagram)
  analyzeFlippedHexagram(engineOS, interfaceOS, safeModeOS) {
    console.log("🔯 Analyzing Flipped Hexagram Logic...");
    
    // 各OSの綜卦（上下反転）を計算
    const engineFlipped = this.calculateFlippedHexagram(engineOS.osId);
    const interfaceFlipped = this.calculateFlippedHexagram(interfaceOS.hexagramId);
    const safeModeFlipped = this.calculateFlippedHexagram(safeModeOS.hexagramId);
    
    // 綜卦の一致パターンを分析
    const flippedMatches = this.findFlippedMatches(
      {engine: engineOS.osId, interface: interfaceOS.hexagramId, safeMode: safeModeOS.hexagramId},
      {engine: engineFlipped, interface: interfaceFlipped, safeMode: safeModeFlipped}
    );
    
    return {
      type: "綜卦の視点転換論理",
      engineFlipped: engineFlipped,
      interfaceFlipped: interfaceFlipped,
      safeModeFlipped: safeModeFlipped,
      flippedMatches: flippedMatches,
      diagnosis: this.generateFlippedDiagnosis(flippedMatches),
      practicalManifestation: this.getFlippedManifestation(flippedMatches)
    };
  }

  // 9. 変卦の移行プロセス論理 (Logic of the Changing Hexagram)  
  analyzeChangingHexagram(engineOS, interfaceOS, safeModeOS) {
    console.log("🔯 Analyzing Changing Hexagram Logic...");
    
    // インターフェースからセーフモードへの移行パスを分析
    const transitionPath = this.findTransitionPath(interfaceOS.hexagramId, safeModeOS.hexagramId);
    const changingLines = this.identifyChangingLines(transitionPath);
    const triggers = this.analyzeTransitionTriggers(changingLines);
    
    return {
      type: "変卦の移行プロセス論理",
      transitionPath: transitionPath,
      changingLines: changingLines,
      triggers: triggers,
      diagnosis: this.generateChangingDiagnosis(transitionPath, triggers),
      practicalManifestation: this.getChangingManifestation(triggers)
    };
  }

  // 10. 季節卦の不一致論理 (Logic of Seasonal Mismatch)
  analyzeSeasonalMismatch(engineOS, interfaceOS, safeModeOS) {
    console.log("🔯 Analyzing Seasonal Mismatch Logic...");
    
    // 各OSの季節性を分析
    const engineSeason = this.getHexagramSeason(engineOS.osId);
    const interfaceSeason = this.getHexagramSeason(interfaceOS.hexagramId);
    const safeModeSeason = this.getHexagramSeason(safeModeOS.hexagramId);
    
    // 季節の不一致パターンを分析
    const seasonalMismatch = this.calculateSeasonalMismatch(engineSeason, interfaceSeason, safeModeSeason);
    
    return {
      type: "季節卦の不一致論理",
      engineSeason: engineSeason,
      interfaceSeason: interfaceSeason,
      safeModeSeason: safeModeSeason,
      mismatch: seasonalMismatch,
      diagnosis: this.generateSeasonalDiagnosis(seasonalMismatch),
      practicalManifestation: this.getSeasonalManifestation(seasonalMismatch)
    };
  }

  // ========== 高度ロジック（11-20） ==========

  // 11. 君臣不応論理 (Logic of Ruler-Minister Disharmony)
  analyzeRulerMinisterAlignment(engineOS, interfaceOS, safeModeOS) {
    console.log("🔯 Analyzing Ruler-Minister Alignment Logic...");
    
    // 五爻（君位）と二爻（臣位）の対応関係を分析
    const engineLines = this.getHexagramLines(engineOS.osId).lines;
    const interfaceLines = this.getHexagramLines(interfaceOS.hexagramId).lines;
    const safeModeLines = this.getHexagramLines(safeModeOS.hexagramId).lines;
    
    const rulerMinisterAnalysis = {
      engine: this.analyzeRulerMinisterInHexagram(engineLines),
      interface: this.analyzeRulerMinisterInHexagram(interfaceLines),
      safeMode: this.analyzeRulerMinisterInHexagram(safeModeLines)
    };
    
    const overallAlignment = this.calculateRulerMinisterAlignment(rulerMinisterAnalysis);
    const hierarchyPattern = this.identifyHierarchyPattern(rulerMinisterAnalysis);
    
    return {
      type: "君臣不応論理",
      rulerMinisterAnalysis: rulerMinisterAnalysis,
      overallAlignment: overallAlignment,
      hierarchyPattern: hierarchyPattern,
      diagnosis: this.generateRulerMinisterDiagnosis(overallAlignment, hierarchyPattern),
      practicalManifestation: this.getRulerMinisterManifestation(hierarchyPattern)
    };
  }

  // 12. 往来循環論理 (Logic of Coming and Going Circulation)
  analyzeComingGoing(engineOS, interfaceOS, safeModeOS) {
    console.log("🔯 Analyzing Coming and Going Logic...");
    
    // 各OSの動的エネルギーの流れを分析
    const engineFlow = this.analyzeHexagramFlow(engineOS.osId);
    const interfaceFlow = this.analyzeHexagramFlow(interfaceOS.hexagramId);
    const safeModeFlow = this.analyzeHexagramFlow(safeModeOS.hexagramId);
    
    // OS間のエネルギー循環パターンを特定
    const circulationPattern = this.identifyCirculationPattern(engineFlow, interfaceFlow, safeModeFlow);
    const flowObstacles = this.identifyFlowObstacles(circulationPattern);
    
    return {
      type: "往来循環論理",
      engineFlow: engineFlow,
      interfaceFlow: interfaceFlow,
      safeModeFlow: safeModeFlow,
      circulationPattern: circulationPattern,
      flowObstacles: flowObstacles,
      diagnosis: this.generateComingGoingDiagnosis(circulationPattern, flowObstacles),
      practicalManifestation: this.getComingGoingManifestation(circulationPattern)
    };
  }

  // 13. 時中論理 (Logic of Timely Moderation) 
  analyzeTimelyModeration(engineOS, interfaceOS, safeModeOS) {
    console.log("🔯 Analyzing Timely Moderation Logic...");
    
    // 各OSの時機的適切性を分析
    const engineTiming = this.analyzeTimingAppropriateness(engineOS.osId);
    const interfaceTiming = this.analyzeTimingAppropriateness(interfaceOS.hexagramId);
    const safeModeTiming = this.analyzeTimingAppropriateness(safeModeOS.hexagramId);
    
    // 三者の時機調和度を計算
    const timingHarmony = this.calculateTimingHarmony(engineTiming, interfaceTiming, safeModeTiming);
    const moderationPattern = this.identifyModerationPattern(timingHarmony);
    
    return {
      type: "時中論理",
      engineTiming: engineTiming,
      interfaceTiming: interfaceTiming,
      safeModeTiming: safeModeTiming,
      timingHarmony: timingHarmony,
      moderationPattern: moderationPattern,
      diagnosis: this.generateTimelyModerationDiagnosis(timingHarmony, moderationPattern),
      practicalManifestation: this.getTimelyModerationManifestation(moderationPattern)
    };
  }

  // 14. 祭祀神託論理 (Logic of Ritual and Oracle)
  analyzeRitualOracle(engineOS, interfaceOS, safeModeOS) {
    console.log("🔯 Analyzing Ritual Oracle Logic...");
    
    // 各OSの神聖性・直感性を分析
    const engineSacredness = this.analyzeSacredness(engineOS.osId);
    const interfaceSacredness = this.analyzeSacredness(interfaceOS.hexagramId);
    const safeModeSacredness = this.analyzeSacredness(safeModeOS.hexagramId);
    
    // 直感的洞察力の統合パターンを分析
    const oraclePattern = this.identifyOraclePattern(engineSacredness, interfaceSacredness, safeModeSacredness);
    const intuitionLevel = this.calculateIntuitionLevel(oraclePattern);
    
    return {
      type: "祭祀神託論理",
      engineSacredness: engineSacredness,
      interfaceSacredness: interfaceSacredness,
      safeModeSacredness: safeModeSacredness,
      oraclePattern: oraclePattern,
      intuitionLevel: intuitionLevel,
      diagnosis: this.generateRitualOracleDiagnosis(oraclePattern, intuitionLevel),
      practicalManifestation: this.getRitualOracleManifestation(oraclePattern)
    };
  }

  // 15. 家族関係論理 (Logic of Family Dynamics)
  analyzeFamilyDynamics(engineOS, interfaceOS, safeModeOS) {
    console.log("🔯 Analyzing Family Dynamics Logic...");
    
    // 各OSの家族的役割を分析（八卦の家族的性質から）
    const engineFamily = this.analyzeFamilyRole(engineOS.osId);
    const interfaceFamily = this.analyzeFamilyRole(interfaceOS.hexagramId);
    const safeModeFamily = this.analyzeFamilyRole(safeModeOS.hexagramId);
    
    // 家族内力学の調和性を分析
    const familyDynamics = this.analyzeFamilySystemDynamics(engineFamily, interfaceFamily, safeModeFamily);
    const relationshipPatterns = this.identifyRelationshipPatterns(familyDynamics);
    
    return {
      type: "家族関係論理",
      engineFamily: engineFamily,
      interfaceFamily: interfaceFamily,
      safeModeFamily: safeModeFamily,
      familyDynamics: familyDynamics,
      relationshipPatterns: relationshipPatterns,
      diagnosis: this.generateFamilyDynamicsDiagnosis(familyDynamics, relationshipPatterns),
      practicalManifestation: this.getFamilyDynamicsManifestation(relationshipPatterns)
    };
  }

  // 16. 乗り物論理 (Logic of Vehicle/Movement) 
  analyzeVehicle(engineOS, interfaceOS, safeModeOS) {
    console.log("🔯 Analyzing Vehicle Logic...");
    
    // 各OSの動的な推進力を分析
    const engineVehicle = this.analyzeMovementCapacity(engineOS.osId);
    const interfaceVehicle = this.analyzeMovementCapacity(interfaceOS.hexagramId);
    const safeModeVehicle = this.analyzeMovementCapacity(safeModeOS.hexagramId);
    
    // 統合的移動能力を評価
    const overallMobility = this.calculateOverallMobility(engineVehicle, interfaceVehicle, safeModeVehicle);
    const vehiclePattern = this.identifyVehiclePattern(overallMobility);
    
    return {
      type: "乗り物論理",
      engineVehicle: engineVehicle,
      interfaceVehicle: interfaceVehicle,
      safeModeVehicle: safeModeVehicle,
      overallMobility: overallMobility,
      vehiclePattern: vehiclePattern,
      diagnosis: this.generateVehicleDiagnosis(overallMobility, vehiclePattern),
      practicalManifestation: this.getVehicleManifestation(vehiclePattern)
    };
  }

  // 17. 器論理 (Logic of Vessel/Container)
  analyzeVessel(engineOS, interfaceOS, safeModeOS) {
    console.log("🔯 Analyzing Vessel Logic...");
    
    // 各OSの容器的性質（受容性・保持力）を分析
    const engineVessel = this.analyzeContainerCapacity(engineOS.osId);
    const interfaceVessel = this.analyzeContainerCapacity(interfaceOS.hexagramId);
    const safeModeVessel = this.analyzeContainerCapacity(safeModeOS.hexagramId);
    
    // 統合的な受容能力を評価
    const vesselCapacity = this.calculateVesselCapacity(engineVessel, interfaceVessel, safeModeVessel);
    const vesselPattern = this.identifyVesselPattern(vesselCapacity);
    
    return {
      type: "器論理",
      engineVessel: engineVessel,
      interfaceVessel: interfaceVessel,
      safeModeVessel: safeModeVessel,
      vesselCapacity: vesselCapacity,
      vesselPattern: vesselPattern,
      diagnosis: this.generateVesselDiagnosis(vesselCapacity, vesselPattern),
      practicalManifestation: this.getVesselManifestation(vesselPattern)
    };
  }

  // 18. 徳性論理 (Logic of Virtue/Moral Character)  
  analyzeVirtue(engineOS, interfaceOS, safeModeOS) {
    console.log("🔯 Analyzing Virtue Logic...");
    
    // 各OSの徳性レベルを分析
    const engineVirtue = this.analyzeVirtueLevel(engineOS.osId);
    const interfaceVirtue = this.analyzeVirtueLevel(interfaceOS.hexagramId);
    const safeModeVirtue = this.analyzeVirtueLevel(safeModeOS.hexagramId);
    
    // 徳性の統合パターンを分析
    const virtueIntegration = this.analyzeVirtueIntegration(engineVirtue, interfaceVirtue, safeModeVirtue);
    const moralCharacter = this.identifyMoralCharacter(virtueIntegration);
    
    return {
      type: "徳性論理",
      engineVirtue: engineVirtue,
      interfaceVirtue: interfaceVirtue,
      safeModeVirtue: safeModeVirtue,
      virtueIntegration: virtueIntegration,
      moralCharacter: moralCharacter,
      diagnosis: this.generateVirtueDiagnosis(virtueIntegration, moralCharacter),
      practicalManifestation: this.getVirtueManifestation(moralCharacter)
    };
  }

  // 19. 象徴動物論理 (Logic of Symbolic Animals)
  analyzeSymbolicAnimals(engineOS, interfaceOS, safeModeOS) {
    console.log("🔯 Analyzing Symbolic Animals Logic...");
    
    // 各OSの象徴動物を特定
    const engineAnimal = this.identifySymbolicAnimal(engineOS.osId);
    const interfaceAnimal = this.identifySymbolicAnimal(interfaceOS.hexagramId);
    const safeModeAnimal = this.identifySymbolicAnimal(safeModeOS.hexagramId);
    
    // 動物の生態系的関係を分析
    const ecosystemDynamics = this.analyzeEcosystemDynamics(engineAnimal, interfaceAnimal, safeModeAnimal);
    const animalPattern = this.identifyAnimalPattern(ecosystemDynamics);
    
    return {
      type: "象徴動物論理",
      engineAnimal: engineAnimal,
      interfaceAnimal: interfaceAnimal,
      safeModeAnimal: safeModeAnimal,
      ecosystemDynamics: ecosystemDynamics,
      animalPattern: animalPattern,
      diagnosis: this.generateSymbolicAnimalDiagnosis(ecosystemDynamics, animalPattern),
      practicalManifestation: this.getSymbolicAnimalManifestation(animalPattern)
    };
  }

  // 20. 不変論理 (Logic of the Unchanging)
  analyzeUnchanging(engineOS, interfaceOS, safeModeOS) {
    console.log("🔯 Analyzing Unchanging Logic...");
    
    // 各OSの不変的核心を特定
    const engineCore = this.identifyUnchangingCore(engineOS.osId);
    const interfaceCore = this.identifyUnchangingCore(interfaceOS.hexagramId);
    const safeModeCore = this.identifyUnchangingCore(safeModeOS.hexagramId);
    
    // 3つのOSの不変的統合性を分析
    const coreIntegrity = this.analyzeCoreIntegrity(engineCore, interfaceCore, safeModeCore);
    const unchangingPattern = this.identifyUnchangingPattern(coreIntegrity);
    
    return {
      type: "不変論理",
      engineCore: engineCore,
      interfaceCore: interfaceCore,
      safeModeCore: safeModeCore,
      coreIntegrity: coreIntegrity,
      unchangingPattern: unchangingPattern,
      diagnosis: this.generateUnchangingDiagnosis(coreIntegrity, unchangingPattern),
      practicalManifestation: this.getUnchangingManifestation(unchangingPattern)
    };
  }

  // ========== ヘルパーメソッド ==========

  // 八卦データを読み込み
  loadTrigramData() {
    // データマネージャーから八卦データを取得
    return {
      1: { name: "乾", element: "金", family: "父", attribute: "創造", nature: "天" },
      2: { name: "兌", element: "金", family: "少女", attribute: "喜悦", nature: "沢" },
      3: { name: "離", element: "火", family: "中女", attribute: "知性", nature: "火" },
      4: { name: "震", element: "木", family: "長男", attribute: "行動", nature: "雷" },
      5: { name: "巽", element: "木", family: "長女", attribute: "適応", nature: "風" },
      6: { name: "坎", element: "水", family: "中男", attribute: "探求", nature: "水" },
      7: { name: "艮", element: "土", family: "少男", attribute: "安定", nature: "山" },
      8: { name: "坤", element: "土", family: "母", attribute: "受容", nature: "地" }
    };
  }

  // 五行関係データを読み込み
  loadElementData() {
    return {
      相生: {
        "木": "火", "火": "土", "土": "金", "金": "水", "水": "木"
      },
      相剋: {
        "木": "土", "土": "水", "水": "火", "火": "金", "金": "木"
      }
    };
  }

  // 卦のテーマを取得
  getHexagramTheme(hexagramId) {
    const hexagram = this.hexagramData.find(h => h.hexagram_id === hexagramId);
    return {
      id: hexagramId,
      name: hexagram?.name_jp || "未知",
      theme: hexagram?.catchphrase || "不明",
      keywords: hexagram?.keywords || [],
      fortune: this.classifyFortune(hexagram?.catchphrase || "")
    };
  }

  // 卦の内外関係を分析
  analyzeInternalExternalBalance(hexagramId) {
    const trigrams = this.getHexagramTrigrams(hexagramId);
    return {
      internal: trigrams.lower,
      external: trigrams.upper,
      balance: this.calculateInternalExternalBalance(trigrams.lower, trigrams.upper),
      energyDirection: this.getEnergyDirection(trigrams.lower, trigrams.upper)
    };
  }

  // 64卦の八卦構成を取得
  getHexagramTrigrams(hexagramId) {
    const hexagram = this.hexagramData.find(h => h.hexagram_id === hexagramId);
    return {
      upper: hexagram?.upper_trigram_id || 1,
      lower: hexagram?.lower_trigram_id || 1,
      upperData: this.trigramData[hexagram?.upper_trigram_id || 1],
      lowerData: this.trigramData[hexagram?.lower_trigram_id || 1]
    };
  }

  // 64卦の爻の陰陽を取得（1=陽爻、0=陰爻）
  getHexagramLines(hexagramId) {
    // 64卦の爻の陰陽データ（下から上へ：初爻、二爻、三爻、四爻、五爻、六爻）
    const hexagramLines = {
      1: [1,1,1,1,1,1],   // 乾為天 ☰☰
      2: [0,0,0,0,0,0],   // 坤為地 ☷☷
      3: [1,0,0,0,1,0],   // 水雷屯 ☵☳
      4: [0,1,0,1,0,0],   // 山水蒙 ☶☵
      5: [1,1,1,0,1,0],   // 水天需 ☵☰
      6: [0,1,0,1,1,1],   // 天水訟 ☰☵
      7: [0,1,0,0,0,0],   // 地水師 ☷☵
      8: [0,0,0,0,1,0],   // 水地比 ☵☷
      9: [1,1,1,0,1,1],   // 風天小畜 ☴☰
      10: [1,1,0,1,1,1],  // 天沢履 ☰☱
      11: [1,1,1,0,0,0],  // 地天泰 ☷☰
      12: [0,0,0,1,1,1],  // 天地否 ☰☷
      13: [1,0,1,1,1,1],  // 天火同人 ☰☲
      14: [1,1,1,1,0,1],  // 火天大有 ☲☰
      15: [0,0,1,0,0,0],  // 地山謙 ☷☶
      16: [0,0,0,1,0,0],  // 雷地豫 ☳☷
      17: [1,0,0,0,1,1],  // 沢雷随 ☱☳
      18: [1,1,0,0,0,1],  // 山風蠱 ☶☴
      19: [1,1,0,0,0,0],  // 地沢臨 ☷☱
      20: [0,0,0,0,1,1],  // 風地観 ☴☷
      21: [1,0,0,1,0,1],  // 火雷噬嗑 ☲☳
      22: [1,0,1,0,0,1],  // 山火賁 ☶☲
      23: [0,0,0,0,0,1],  // 山地剥 ☶☷
      24: [1,0,0,0,0,0],  // 地雷復 ☷☳
      25: [1,0,0,1,1,1],  // 天雷無妄 ☰☳
      26: [1,1,1,0,0,1],  // 山天大畜 ☶☰
      27: [1,0,0,0,0,1],  // 山雷頤 ☶☳
      28: [0,1,1,1,1,0],  // 沢風大過 ☱☴
      29: [0,1,0,0,1,0],  // 坎為水 ☵☵
      30: [1,0,1,1,0,1],  // 離為火 ☲☲
      31: [0,0,1,1,1,0],  // 沢山咸 ☱☶
      32: [0,1,1,1,0,0],  // 雷風恒 ☳☴
      33: [0,0,1,1,1,1],  // 天山遯 ☰☶
      34: [1,1,1,1,0,0],  // 雷天大壮 ☳☰
      35: [0,0,0,1,0,1],  // 火地晋 ☲☷
      36: [1,0,1,0,0,0],  // 地火明夷 ☷☲
      37: [1,0,1,0,1,1],  // 風火家人 ☴☲
      38: [1,1,0,1,0,1],  // 火沢睽 ☲☱
      39: [0,0,1,0,1,0],  // 水山蹇 ☵☶
      40: [0,1,0,1,0,0],  // 雷水解 ☳☵
      41: [1,1,0,0,0,1],  // 山沢損 ☶☱
      42: [1,0,0,0,1,1],  // 風雷益 ☴☳
      43: [1,1,1,1,1,0],  // 沢天夬 ☱☰
      44: [0,1,1,1,1,1],  // 天風姤 ☰☴
      45: [0,0,0,1,1,0],  // 沢地萃 ☱☷
      46: [0,1,1,0,0,0],  // 地風升 ☷☴
      47: [0,1,0,1,1,0],  // 沢水困 ☱☵
      48: [0,1,1,0,1,0],  // 水風井 ☵☴
      49: [1,0,1,1,1,0],  // 沢火革 ☱☲
      50: [0,1,1,1,0,1],  // 火風鼎 ☲☴
      51: [1,0,0,1,0,0],  // 震為雷 ☳☳
      52: [0,0,1,0,0,1],  // 艮為山 ☶☶
      53: [0,0,1,0,1,1],  // 風山漸 ☴☶
      54: [1,1,0,1,0,0],  // 雷沢帰妹 ☳☱
      55: [1,0,1,1,0,0],  // 雷火豊 ☳☲
      56: [0,0,1,1,0,1],  // 火山旅 ☲☶
      57: [0,1,1,0,1,1],  // 巽為風 ☴☴
      58: [1,1,0,0,1,1],  // 兌為沢 ☱☱
      59: [0,1,0,0,1,1],  // 風水渙 ☴☵
      60: [1,1,0,0,1,0],  // 水沢節 ☵☱
      61: [1,1,0,0,1,1],  // 風沢中孚 ☴☱
      62: [0,0,1,1,0,0],  // 雷山小過 ☳☶
      63: [1,0,1,0,1,0],  // 水火既済 ☵☲
      64: [0,1,0,1,0,1]   // 火水未済 ☲☵
    };
    
    return { 
      lines: hexagramLines[hexagramId] || [1,0,1,0,1,0] // デフォルト値
    };
  }
  // 互卦（Nuclear Hexagram）を計算 - 2,3,4爻を内卦、3,4,5爻を外卦とする
  calculateNuclearHexagram(hexagramId) {
    const lines = this.getHexagramLines(hexagramId).lines;
    
    // 互卦の爻を計算（中央4爻から新しい6爻を生成）
    const nuclearLines = [
      lines[1], // 二爻 → 初爻
      lines[2], // 三爻 → 二爻  
      lines[3], // 四爻 → 三爻
      lines[2], // 三爻 → 四爻
      lines[3], // 四爻 → 五爻
      lines[4]  // 五爻 → 六爻
    ];
    
    // 互卦IDを計算
    const nuclearId = this.linesToHexagramId(nuclearLines);
    
    return { 
      id: hexagramId, 
      nuclear: nuclearId,
      nuclearLines: nuclearLines,
      meaning: "隠れた本質・潜在的性質"
    };
  }

  // 錯卦（Inverted Hexagram）を計算 - 全ての爻の陰陽を反転
  calculateInvertedHexagram(hexagramId) {
    const lines = this.getHexagramLines(hexagramId).lines;
    
    // 全ての爻を反転（陰→陽、陽→陰）
    const invertedLines = lines.map(line => line === 1 ? 0 : 1);
    
    // 錯卦IDを計算
    const invertedId = this.linesToHexagramId(invertedLines);
    
    return {
      original: hexagramId,
      inverted: invertedId,
      invertedLines: invertedLines,
      meaning: "対極の性質・裏の人格"
    };
  }

  // 綜卦（Flipped Hexagram）を計算 - 卦を上下反転
  calculateFlippedHexagram(hexagramId) {
    const lines = this.getHexagramLines(hexagramId).lines;
    
    // 爻の順序を逆転（上下反転）
    const flippedLines = [...lines].reverse();
    
    // 綜卦IDを計算
    const flippedId = this.linesToHexagramId(flippedLines);
    
    return {
      original: hexagramId,
      flipped: flippedId,
      flippedLines: flippedLines,
      meaning: "相手の視点・立場転換"
    };
  }

  // 季節性を分析 - 十二消息卦に基づく
  getHexagramSeason(hexagramId) {
    // 十二消息卦（12ヶ月の季節卦）
    const seasonalHexagrams = {
      // 春
      11: { season: "春", month: "2月", energy: "復活", phase: "初春" }, // 地天泰
      34: { season: "春", month: "3月", energy: "成長", phase: "仲春" }, // 雷天大壮  
      43: { season: "春", month: "4月", energy: "拡大", phase: "晩春" }, // 沢天夬
      
      // 夏  
      1: { season: "夏", month: "5月", energy: "最盛", phase: "初夏" },  // 乾為天
      44: { season: "夏", month: "6月", energy: "接触", phase: "仲夏" }, // 天風姤
      33: { season: "夏", month: "7月", energy: "退避", phase: "晩夏" }, // 天山遯
      
      // 秋
      12: { season: "秋", month: "8月", energy: "閉塞", phase: "初秋" }, // 天地否
      20: { season: "秋", month: "9月", energy: "観察", phase: "仲秋" }, // 風地観
      23: { season: "秋", month: "10月", energy: "剥落", phase: "晩秋" }, // 山地剥
      
      // 冬
      2: { season: "冬", month: "11月", energy: "静寂", phase: "初冬" },  // 坤為地
      24: { season: "冬", month: "12月", energy: "復帰", phase: "仲冬" }, // 地雷復
      19: { season: "冬", month: "1月", energy: "接近", phase: "晩冬" }   // 地沢臨
    };
    
    // 直接対応がある場合
    if (seasonalHexagrams[hexagramId]) {
      return seasonalHexagrams[hexagramId];
    }
    
    // 八卦による季節判定
    const trigrams = this.getHexagramTrigrams(hexagramId);
    const seasonByTrigram = {
      4: "春", // 震（雷）- 春の象徴
      5: "春", // 巽（風）- 春の象徴  
      3: "夏", // 離（火）- 夏の象徴
      2: "夏", // 兌（沢）- 夏の象徴
      1: "秋", // 乾（天）- 秋の象徴
      7: "秋", // 艮（山）- 秋の象徴
      6: "冬", // 坎（水）- 冬の象徴
      8: "冬"  // 坤（地）- 冬の象徴
    };
    
    const upperSeason = seasonByTrigram[trigrams.upper];
    const lowerSeason = seasonByTrigram[trigrams.lower];
    
    // 上下卦から季節を推定
    if (upperSeason === lowerSeason) {
      return { 
        season: upperSeason, 
        energy: "調和", 
        phase: "中期",
        confidence: "高"
      };
    } else {
      return { 
        season: upperSeason || "混合", 
        energy: "変化", 
        phase: "転換期",
        confidence: "中",
        secondary: lowerSeason
      };
    }
  }

  // 爻の配列から64卦IDを計算するヘルパー
  linesToHexagramId(lines) {
    // 6爻の陰陽パターンから64卦のIDを逆算
    // 簡略化された実装（実際は64卦データベースとの照合が必要）
    
    // バイナリパターンから数値計算
    let binaryValue = 0;
    for (let i = 0; i < 6; i++) {
      if (lines[i] === 1) {
        binaryValue += Math.pow(2, i);
      }
    }
    
    // 1-64の範囲に正規化（簡略化）
    const hexagramId = (binaryValue % 64) + 1;
    
    return hexagramId;
  }
  
  // 統合分析結果を生成
  generateIntegratedInsights(results) {
    return {
      primaryPatterns: this.identifyPrimaryPatterns(results),
      deepInsights: this.extractDeepInsights(results),
      practicalAdvice: this.synthesizePracticalAdvice(results),
      warningSignals: this.identifyWarningSignals(results)
    };
  }

  // 総合評価を生成
  generateOverallAssessment(results) {
    return {
      harmonyLevel: this.calculateOverallHarmony(results),
      complexityLevel: this.calculateComplexity(results),
      potentialLevel: this.calculatePotential(results),
      riskLevel: this.calculateRisk(results)
    };
  }

  // ========== 基礎ロジック詳細実装 ==========

  // 1. 大テーマの論理 - 詳細実装
  calculateThemeHarmony(engineTheme, interfaceTheme, safeModeTheme) {
    const engineFortune = this.getFortuneValue(engineTheme.fortune);
    const interfaceFortune = this.getFortuneValue(interfaceTheme.fortune);
    const safeModeFortune = this.getFortuneValue(safeModeTheme.fortune);
    
    // 卦辞の意味的距離を計算
    const semanticDistance = this.calculateSemanticDistance(
      engineTheme.keywords, 
      interfaceTheme.keywords, 
      safeModeTheme.keywords
    );
    
    // 調和度スコア算出（0-1）
    const harmonyScore = (engineFortune + interfaceFortune + safeModeFortune) / 3 - semanticDistance;
    return Math.max(0, Math.min(1, harmonyScore));
  }

  identifyThemePattern(engineTheme, interfaceTheme, safeModeTheme) {
    const fortunes = [engineTheme.fortune, interfaceTheme.fortune, safeModeTheme.fortune];
    
    if (fortunes.every(f => f === "吉")) return "三吉調和型";
    if (fortunes.every(f => f === "凶")) return "三凶困難型";
    if (fortunes.filter(f => f === "吉").length === 2) return "吉凶混合型";
    if (fortunes.includes("亨")) return "通達成長型";
    if (fortunes.includes("利")) return "利益追求型";
    if (fortunes.includes("吝")) return "困難克服型";
    
    return "複合変化型";
  }

  generateGreatThemeDiagnosis(themePattern, themeHarmony) {
    const harmonyLevel = themeHarmony > 0.8 ? "非常に高い" : 
                        themeHarmony > 0.6 ? "高い" : 
                        themeHarmony > 0.4 ? "中程度" : 
                        themeHarmony > 0.2 ? "低い" : "非常に低い";
    
    const patternDiagnosis = {
      "三吉調和型": "3つのOSすべてが吉の象意を持ち、極めて安定した精神構造を有しています。",
      "三凶困難型": "3つのOSすべてが困難な象意を持ち、継続的な試練に直面する傾向があります。",
      "吉凶混合型": "吉と凶の象意が混在し、状況により大きく運勢が変動する特徴があります。",
      "通達成長型": "物事が通じる力を持ち、停滞を打破し発展へと導く能力があります。",
      "利益追求型": "利を得る能力に長けており、実利的な成果を上げやすい特質があります。",
      "困難克服型": "困難に直面しやすいが、それを乗り越える強い意志力を持っています。",
      "複合変化型": "多様な側面を持ち、状況に応じて異なる性質を発揮します。"
    };

    return `【大テーマ調和度: ${harmonyLevel}】${patternDiagnosis[themePattern] || "独特なテーマパターンを持っています。"}`;
  }

  getGreatThemeManifestation(themePattern) {
    const manifestations = {
      "三吉調和型": ["自己評価が安定している", "一貫した価値観を持つ", "周囲から信頼される"],
      "三凶困難型": ["自己評価の乱高下", "順境と逆境でのパフォーマンス極端差", "内的葛藤の慢性化"],
      "吉凶混合型": ["状況により自信が大きく変動", "成功と失敗の波が激しい", "感情の起伏が大きい"],
      "通達成長型": ["停滞を嫌い常に前進を求める", "問題解決能力が高い", "変化を恐れない"],
      "利益追求型": ["実益を重視する判断", "効率性を求める", "結果にこだわる"],
      "困難克服型": ["逆境に強い精神力", "困難を成長の機会と捉える", "諦めない粘り強さ"]
    };
    
    return Array.isArray(manifestations[themePattern]) ? 
           manifestations[themePattern] : 
           [manifestations[themePattern] || "複雑な表れ方をします"];
  }

  // 2. 内外の反転論理 - 詳細実装
  detectInversionPattern(engineInversion, interfaceInversion, safeModeInversion) {
    const patterns = [];
    
    // エンジンとインターフェースの反転チェック
    if (engineInversion.energyDirection !== interfaceInversion.energyDirection) {
      patterns.push("エンジン-インターフェース反転");
    }
    
    // インターフェースとセーフモードの反転チェック
    if (interfaceInversion.energyDirection !== safeModeInversion.energyDirection) {
      patterns.push("インターフェース-セーフモード反転");
    }
    
    // 三者の完全反転チェック
    const directions = [engineInversion.energyDirection, interfaceInversion.energyDirection, safeModeInversion.energyDirection];
    if (new Set(directions).size === 2 && directions.filter(d => d === "内向").length === 1) {
      patterns.push("完全反転型");
    }
    
    return patterns.length > 0 ? patterns : ["標準型"];
  }

  analyzeEnergyFlow(inversionPattern) {
    if (inversionPattern.includes("完全反転型")) {
      return {
        type: "エネルギー逆流",
        severity: "高",
        description: "内面と外面のエネルギーが激しく対立しています"
      };
    } else if (inversionPattern.includes("エンジン-インターフェース反転")) {
      return {
        type: "社会的仮面疲弊",
        severity: "中",
        description: "本音と建前の乖離によりエネルギーが消耗しています"
      };
    } else if (inversionPattern.includes("インターフェース-セーフモード反転")) {
      return {
        type: "防御機制混乱",
        severity: "中",
        description: "社会的対応と防御的対応が矛盾しています"
      };
    }
    
    return {
      type: "順流",
      severity: "低",
      description: "エネルギーの流れは自然で健全です"
    };
  }

  generateInversionDiagnosis(inversionPattern, energyFlow) {
    const baseMessage = `【反転パターン: ${inversionPattern.join("、")}】`;
    const flowMessage = energyFlow.description;
    
    if (energyFlow.severity === "高") {
      return `${baseMessage}${flowMessage}。オンとオフのギャップが激しく、燃え尽き症候群のリスクがあります。`;
    } else if (energyFlow.severity === "中") {
      return `${baseMessage}${flowMessage}。時々内面と外面の使い分けに疲れを感じることがあります。`;
    }
    
    return `${baseMessage}${flowMessage}。内外のバランスが良く取れています。`;
  }

  getInversionManifestation(inversionPattern) {
    if (inversionPattern.includes("完全反転型")) {
      return ["社会的な仮面による疲弊", "オンとオフのギャップ", "燃え尽き症候群"];
    } else if (inversionPattern.includes("エンジン-インターフェース反転")) {
      return ["本音を隠すストレス", "社会的役割への違和感", "自分らしさの模索"];
    } else if (inversionPattern.includes("インターフェース-セーフモード反転")) {
      return ["危機対応の混乱", "ストレス時の判断ミス", "防御方法の迷い"];
    }
    
    return ["自然な内外バランス", "一貫した自己表現", "安定した人間関係"];
  }

  // 3. 八卦の共鳴論理 - 詳細実装
  findTrigramResonance(engineTrigrams, interfaceTrigrams, safeModeTrigrams) {
    const allTrigrams = [
      { os: "engine", upper: engineTrigrams.upper, lower: engineTrigrams.lower },
      { os: "interface", upper: interfaceTrigrams.upper, lower: interfaceTrigrams.lower },
      { os: "safeMode", upper: safeModeTrigrams.upper, lower: safeModeTrigrams.lower }
    ];
    
    const resonances = [];
    const trigramCount = {};
    
    // 各個卦の出現回数をカウント
    allTrigrams.forEach(osData => {
      [osData.upper, osData.lower].forEach(trigram => {
        trigramCount[trigram] = (trigramCount[trigram] || 0) + 1;
      });
    });
    
    // 重複する八卦を特定
    Object.entries(trigramCount).forEach(([trigramId, count]) => {
      if (count > 1) {
        const positions = [];
        allTrigrams.forEach(osData => {
          if (osData.upper == trigramId) positions.push(`${osData.os}-上`);
          if (osData.lower == trigramId) positions.push(`${osData.os}-下`);
        });
        
        resonances.push({
          trigram: parseInt(trigramId),
          trigramName: this.trigramData[trigramId]?.name || "不明",
          count: count,
          positions: positions,
          strength: count >= 3 ? "強" : "中"
        });
      }
    });
    
    return resonances;
  }

  identifyDominantTrigrams(resonancePattern) {
    return resonancePattern
      .filter(resonance => resonance.count >= 2)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }

  generateResonanceDiagnosis(resonancePattern, dominantTrigrams) {
    if (dominantTrigrams.length === 0) {
      return "【八卦共鳴: なし】各OSが独立した八卦で構成されており、多様性に富んだ人格構造を持っています。";
    }
    
    if (dominantTrigrams.length === 1 && dominantTrigrams[0].count >= 3) {
      const trigramName = dominantTrigrams[0].trigramName;
      return `【八卦共鳴: 強固】「${trigramName}」が3つのOSを強く支配しており、この性質があなたの根源・社会性・防御すべてに現れます。`;
    }
    
    const trigramNames = dominantTrigrams.map(d => d.trigramName).join("、");
    return `【八卦共鳴: 適度】「${trigramNames}」の性質が複数のOSに現れ、これらがあなたの特徴的な能力となっています。`;
  }

  getResonanceManifestation(dominantTrigrams) {
    if (dominantTrigrams.length === 0) {
      return ["多面的な能力", "状況適応力", "バランスの良い人格"];
    }
    
    const manifestations = dominantTrigrams.flatMap(trigram => {
      const trigramAttributes = {
        1: ["圧倒的なリーダーシップ", "創造力の発現", "権威への志向"],
        2: ["コミュニケーション能力", "調和を重視", "喜びを分かち合う"],
        3: ["知的な魅力", "表現力の豊かさ", "情熱的な活動"],
        4: ["行動力の高さ", "変化への適応", "エネルギッシュな性格"],
        5: ["柔軟性と適応力", "細やかな配慮", "協調性の発揮"],
        6: ["深い洞察力", "探求心の強さ", "困難な状況での冷静さ"],
        7: ["安定志向", "慎重な判断", "継続力の発揮"],
        8: ["受容性の高さ", "支援能力", "包容力の発現"]
      };
      
      return trigramAttributes[trigram.trigram] || ["特殊な能力"];
    });
    
    // 重複を除去して上位3つを返す
    return [...new Set(manifestations)].slice(0, 3);
  }

  // 4. 爻位対応の論理 - 詳細実装
  analyzeLineCorrespondencePattern(engineLines, interfaceLines, safeModeLines) {
    const correspondences = {};
    
    for (let position = 1; position <= 6; position++) {
      const engineLine = engineLines.lines[position - 1];
      const interfaceLine = interfaceLines.lines[position - 1];
      const safeModeLine = safeModeLines.lines[position - 1];
      
      correspondences[position] = {
        position: position,
        positionName: this.getLinePositionName(position),
        engine: engineLine,
        interface: interfaceLine,
        safeMode: safeModeLine,
        consistency: this.calculateLineConsistency(engineLine, interfaceLine, safeModeLine),
        roleConflict: this.analyzeRoleConflict(position, engineLine, interfaceLine, safeModeLine)
      };
    }
    
    return correspondences;
  }

  identifyLineConflicts(correspondencePattern) {
    return Object.values(correspondencePattern)
      .filter(line => line.consistency < 0.5 || line.roleConflict)
      .map(line => ({
        position: line.position,
        positionName: line.positionName,
        conflictType: line.roleConflict ? "役割葛藤" : "陰陽不一致",
        severity: line.consistency < 0.3 ? "高" : "中"
      }));
  }

  generateLineCorrespondenceDiagnosis(correspondencePattern, conflictPositions) {
    if (conflictPositions.length === 0) {
      return "【爻位対応: 良好】各立場・役割での一貫性が保たれており、安定した行動パターンを持っています。";
    }
    
    const conflictAreas = conflictPositions.map(conflict => 
      `${conflict.positionName}(${conflict.conflictType})`
    ).join("、");
    
    const severity = conflictPositions.some(c => c.severity === "高") ? "強い" : "軽度の";
    
    return `【爻位対応: 注意】${conflictAreas}で${severity}葛藤があり、特定の立場や役職でストレスを感じやすい傾向があります。`;
  }

  getLineCorrespondenceManifestation(conflictPositions) {
    if (conflictPositions.length === 0) {
      return ["役割に応じた適切な行動", "立場への自然な適応", "一貫した行動パターン"];
    }
    
    const manifestations = conflictPositions.map(conflict => {
      const positionManifestations = {
        1: "新しい環境や始まりの場面でのストレス",
        2: "部下や協力者としての立場での違和感",
        3: "中間管理職的な位置での葛藤",
        4: "実行責任者としての重圧",
        5: "リーダーや責任者としての役割負担",
        6: "最終決定者や長老的立場での孤独感"
      };
      
      return positionManifestations[conflict.position] || "特定の立場でのストレス";
    });
    
    return manifestations;
  }

  // 5. 五行の相生・相剋論理 - 詳細実装
  convertToFiveElements(hexagramId) {
    const trigrams = this.getHexagramTrigrams(hexagramId);
    return {
      upper: this.trigramData[trigrams.upper]?.element || "不明",
      lower: this.trigramData[trigrams.lower]?.element || "不明",
      upperTrigram: trigrams.upper,
      lowerTrigram: trigrams.lower
    };
  }

  analyzeFiveElementFlow(engineElements, interfaceElements, safeModeElements) {
    const flows = [];
    
    // エンジン → インターフェース の流れ
    const engineToInterface = this.getFiveElementRelation(
      engineElements.upper, interfaceElements.upper
    );
    flows.push({
      from: "engine",
      to: "interface",
      relation: engineToInterface,
      description: this.getFiveElementFlowDescription(engineToInterface, "エンジン", "インターフェース")
    });
    
    // インターフェース → セーフモード の流れ
    const interfaceToSafeMode = this.getFiveElementRelation(
      interfaceElements.upper, safeModeElements.upper
    );
    flows.push({
      from: "interface",
      to: "safeMode",
      relation: interfaceToSafeMode,
      description: this.getFiveElementFlowDescription(interfaceToSafeMode, "インターフェース", "セーフモード")
    });
    
    // エンジン → セーフモード の流れ
    const engineToSafeMode = this.getFiveElementRelation(
      engineElements.upper, safeModeElements.upper
    );
    flows.push({
      from: "engine",
      to: "safeMode",
      relation: engineToSafeMode,
      description: this.getFiveElementFlowDescription(engineToSafeMode, "エンジン", "セーフモード")
    });
    
    return flows;
  }

  identifyHarmoniousFlow(elementFlow) {
    return elementFlow.filter(flow => flow.relation === "相生").length > 0;
  }

  identifyConflictingFlow(elementFlow) {
    return elementFlow.filter(flow => flow.relation === "相剋").length > 0;
  }

  generateFiveElementDiagnosis(elementFlow, harmoniousFlow, conflictingFlow) {
    const harmoniousCount = elementFlow.filter(f => f.relation === "相生").length;
    const conflictingCount = elementFlow.filter(f => f.relation === "相剋").length;
    
    if (harmoniousCount === 3) {
      return "【五行の流れ: 完全調和】全ての五行の流れが相生関係にあり、エネルギーが非常にスムーズに循環しています。";
    } else if (conflictingCount === 3) {
      return "【五行の流れ: 全面対立】全ての五行の流れが相剋関係にあり、エネルギーの対立が激しい状態です。";
    } else if (harmoniousCount > conflictingCount) {
      return "【五行の流れ: 調和優勢】相生の流れが優勢で、全体的にエネルギーの循環が良好です。";
    } else if (conflictingCount > harmoniousCount) {
      return "【五行の流れ: 対立優勢】相剋の流れが優勢で、エネルギーの対立により疲労が蓄積しやすい傾向があります。";
    }
    
    return "【五行の流れ: バランス型】相生と相剋が均衡し、状況に応じてエネルギーが変化します。";
  }

  getFiveElementManifestation(elementFlow) {
    const harmoniousCount = elementFlow.filter(f => f.relation === "相生").length;
    const conflictingCount = elementFlow.filter(f => f.relation === "相剋").length;
    
    if (harmoniousCount >= 2) {
      return ["行動が次の幸運を呼ぶパターン", "エネルギーの好循環", "自然な成長と発展"];
    } else if (conflictingCount >= 2) {
      return ["特定の行動が必ず裏目に出るパターン", "エネルギーの消耗", "慢性的な疲労感"];
    }
    
    return ["状況に応じたエネルギー変化", "バランスの取れた活動", "適度な緊張と緩和"];
  }
  // ========== ヘルパーメソッド詳細実装 ==========

  // 運勢値を数値に変換
  getFortuneValue(fortune) {
    const fortuneValues = {
      "吉": 0.8,
      "亨": 0.7,
      "利": 0.6,
      "貞": 0.5,
      "中庸": 0.5,
      "吝": 0.3,
      "凶": 0.2
    };
    return fortuneValues[fortune] || 0.5;
  }

  // キーワード間の意味的距離を計算
  calculateSemanticDistance(keywords1, keywords2, keywords3) {
    // 簡化された実装（実際にはより高度な意味解析が必要）
    const allKeywords = [...(keywords1 || []), ...(keywords2 || []), ...(keywords3 || [])];
    const uniqueKeywords = new Set(allKeywords);
    
    // 重複が多いほど意味的距離が小さい（調和度が高い）
    const overlapRatio = (allKeywords.length - uniqueKeywords.size) / allKeywords.length;
    return 1 - overlapRatio;
  }

  // 爻位の名称を取得
  getLinePositionName(position) {
    const positionNames = {
      1: "初爻(始まり)",
      2: "二爻(協力者)",
      3: "三爻(転換点)",
      4: "四爻(実行者)",
      5: "五爻(指導者)",
      6: "六爻(完成者)"
    };
    return positionNames[position] || `${position}爻`;
  }

  // 爻の一貫性を計算
  calculateLineConsistency(engineLine, interfaceLine, safeModeLine) {
    const lines = [engineLine, interfaceLine, safeModeLine];
    const yinCount = lines.filter(line => line === 0).length;
    const yangCount = lines.filter(line => line === 1).length;
    
    // 全て同じなら1.0、2対1なら0.67、完全バラバラなら0.33
    if (yinCount === 3 || yangCount === 3) return 1.0;
    if (yinCount === 2 || yangCount === 2) return 0.67;
    return 0.33;
  }

  // 役割葛藤を分析
  analyzeRoleConflict(position, engineLine, interfaceLine, safeModeLine) {
    // 五爻（指導者位）で陰陽がバラバラの場合は役割葛藤あり
    if (position === 5) {
      return this.calculateLineConsistency(engineLine, interfaceLine, safeModeLine) < 0.67;
    }
    
    // 二爻（協力者位）で完全に不一致の場合も役割葛藤
    if (position === 2) {
      return this.calculateLineConsistency(engineLine, interfaceLine, safeModeLine) < 0.5;
    }
    
    return false;
  }

  // 五行の関係を取得
  getFiveElementRelation(element1, element2) {
    if (!this.elementData || !element1 || !element2) return "中性";
    
    if (this.elementData.相生[element1] === element2) return "相生";
    if (this.elementData.相剋[element1] === element2) return "相剋";
    return "中性";
  }

  // 五行の流れの説明を生成
  getFiveElementFlowDescription(relation, from, to) {
    const descriptions = {
      "相生": `${from}が${to}を育み、エネルギーが自然に流れています`,
      "相剋": `${from}が${to}を抑制し、エネルギーの対立が生じています`,
      "中性": `${from}と${to}の間は中性的な関係です`
    };
    return descriptions[relation] || "不明な関係です";
  }

  // 内外バランスを計算
  calculateInternalExternalBalance(lowerTrigram, upperTrigram) {
    // 八卦の性質から内外バランスを計算
    const trigramStrengths = {
      1: 0.9, // 乾（強い外向性）
      2: 0.7, // 兌（調和的外向性）
      3: 0.8, // 離（表現的外向性）
      4: 0.6, // 震（行動的外向性）
      5: 0.4, // 巽（柔軟な内向性）
      6: 0.3, // 坎（深い内向性）
      7: 0.2, // 艮（安定した内向性）
      8: 0.1  // 坤（受容的内向性）
    };
    
    const lowerStrength = trigramStrengths[lowerTrigram] || 0.5;
    const upperStrength = trigramStrengths[upperTrigram] || 0.5;
    
    // 内卦と外卦のバランスを計算
    return Math.abs(lowerStrength - upperStrength) < 0.3 ? 0.8 : 0.5;
  }

  // エネルギー方向を取得
  getEnergyDirection(lowerTrigram, upperTrigram) {
    const trigramDirections = {
      1: "外向", 2: "外向", 3: "外向", 4: "外向",
      5: "内向", 6: "内向", 7: "内向", 8: "内向"
    };
    
    const lowerDirection = trigramDirections[lowerTrigram];
    const upperDirection = trigramDirections[upperTrigram];
    
    if (lowerDirection === upperDirection) return lowerDirection;
    return "混合";
  }

  // ========== 応用ロジック詳細実装 ==========

  // 6. 互卦の隠れOS論理 - 詳細実装
  analyzeNuclearPattern(engineNuclear, interfaceNuclear, safeModeNuclear) {
    const patterns = [];
    
    // 互卦の一致パターンを分析
    if (engineNuclear.nuclear === interfaceNuclear.nuclear) {
      patterns.push("エンジン-インターフェース互卦一致");
    }
    if (engineNuclear.nuclear === safeModeNuclear.nuclear) {
      patterns.push("エンジン-セーフモード互卦一致");
    }
    if (interfaceNuclear.nuclear === safeModeNuclear.nuclear) {
      patterns.push("インターフェース-セーフモード互卦一致");
    }
    
    // 3つ全てが同じ互卦の場合
    if (engineNuclear.nuclear === interfaceNuclear.nuclear && 
        interfaceNuclear.nuclear === safeModeNuclear.nuclear) {
      patterns.push("全OS互卦統一");
    }
    
    return patterns.length > 0 ? patterns.join("・") : "独立互卦型";
  }

  identifyHiddenQualities(nuclearPattern) {
    const qualityMap = {
      "全OS互卦統一": ["強固な潜在核", "一貫した深層動機", "隠れた支配的価値観"],
      "エンジン-インターフェース互卦一致": ["表面と内面の統一性", "自然な魅力", "隠れたカリスマ性"],
      "エンジン-セーフモード互卦一致": ["危機時の本質発現", "ストレス下での一貫性", "困難を乗り越える核"],
      "インターフェース-セーフモード互卦一致": ["社会性と防御の統合", "適応能力の高さ", "バランス感覚"],
      "独立互卦型": ["多面的な潜在性", "状況適応力", "隠れた複雑性"]
    };
    
    return qualityMap[nuclearPattern] || ["特殊な潜在性"];
  }

  generateNuclearDiagnosis(nuclearPattern, hiddenQualities) {
    const patternDiagnosis = {
      "全OS互卦統一": "3つのOSすべてが同じ互卦を持ち、極めて強固で一貫した潜在的核を持っています。",
      "エンジン-インターフェース互卦一致": "内面の価値観と社会的表現の根底に共通する隠れた動機があります。",
      "エンジン-セーフモード互卦一致": "根源的価値観と危機対応の深層に同じ本質が隠れており、困難時に真の力を発揮します。",
      "インターフェース-セーフモード互卦一致": "社会的対応と防御的対応の根底に共通する適応メカニズムがあります。",
      "独立互卦型": "各OSが独立した互卦を持ち、多層的で複雑な潜在構造を有しています。"
    };
    
    return `【互卦パターン: ${nuclearPattern}】${patternDiagnosis[nuclearPattern] || "特殊な互卦構造を持っています。"}`;
  }

  getNuclearManifestation(hiddenQualities) {
    return hiddenQualities.slice(0, 3); // 上位3つの潜在的特質
  }

  // 7. 錯卦の裏人格論理 - 詳細実装
  findInversionMatches(originalOSs, invertedOSs) {
    const matches = [];
    
    // エンジンOSの錯卦が他のOSと一致するかチェック
    if (invertedOSs.engine === originalOSs.interface) {
      matches.push({
        type: "エンジン錯卦-インターフェース一致",
        meaning: "内面の対極が社会的表現として現れる",
        risk: "中"
      });
    }
    if (invertedOSs.engine === originalOSs.safeMode) {
      matches.push({
        type: "エンジン錯卦-セーフモード一致", 
        meaning: "内面の対極が危機対応として現れる",
        risk: "高"
      });
    }
    
    // インターフェースOSの錯卦チェック
    if (invertedOSs.interface === originalOSs.safeMode) {
      matches.push({
        type: "インターフェース錯卦-セーフモード一致",
        meaning: "社会的表現の対極が危機時に暴発する",
        risk: "高"
      });
    }
    
    return matches;
  }

  generateInvertedDiagnosis(inversionMatches) {
    if (inversionMatches.length === 0) {
      return "【錯卦関係: 独立型】各OSの錯卦は他のOSと独立しており、裏の性質が直接表面化することはありません。";
    }
    
    const highRiskMatches = inversionMatches.filter(m => m.risk === "高");
    if (highRiskMatches.length > 0) {
      const riskDescriptions = highRiskMatches.map(m => m.meaning).join("、");
      return `【錯卦関係: 高リスク型】${riskDescriptions}。エネルギーが尽きた時に極端な反転が起こる可能性があります。`;
    }
    
    const meanings = inversionMatches.map(m => m.meaning).join("、");
    return `【錯卦関係: 中リスク型】${meanings}。適度な自己理解により制御可能です。`;
  }

  getInvertedManifestation(inversionMatches) {
    if (inversionMatches.length === 0) {
      return ["安定した人格統合", "裏表のない自然な振る舞い", "一貫した自己表現"];
    }
    
    const manifestations = inversionMatches.flatMap(match => {
      const manifestationMap = {
        "エンジン錯卦-インターフェース一致": ["本音と建前の極端な乖離", "社会的仮面への過度な依存"],
        "エンジン錯卦-セーフモード一致": ["価値観の根本的動揺", "危機時の人格変貌"],
        "インターフェース錯卦-セーフモード一致": ["突然の豹変", "社会的エネルギー枯渇時の暴発"]
      };
      return manifestationMap[match.type] || ["予期しない行動変化"];
    });
    
    return [...new Set(manifestations)];
  }

  // 8. 綜卦の視点転換論理 - 詳細実装
  findFlippedMatches(originalOSs, flippedOSs) {
    const matches = [];
    
    // 各OSの綜卦が他のOSと一致するかチェック
    if (flippedOSs.engine === originalOSs.interface) {
      matches.push({
        type: "エンジン綜卦-インターフェース一致",
        meaning: "内面を相手視点で見ると社会的表現になる",
        ability: "自然な共感能力"
      });
    }
    if (flippedOSs.interface === originalOSs.engine) {
      matches.push({
        type: "インターフェース綜卦-エンジン一致",
        meaning: "社会的表現を相手視点で見ると内面が見える",
        ability: "透明な自己表現"
      });
    }
    
    return matches;
  }

  generateFlippedDiagnosis(flippedMatches) {
    if (flippedMatches.length === 0) {
      return "【綜卦関係: 独立型】視点転換による特別な相互関係はありませんが、客観的な自己認識能力があります。";
    }
    
    const abilities = flippedMatches.map(m => m.ability).join("、");
    const meanings = flippedMatches.map(m => m.meaning).join("、");
    return `【綜卦関係: 統合型】${meanings}。${abilities}に優れています。`;
  }

  getFlippedManifestation(flippedMatches) {
    if (flippedMatches.length === 0) {
      return ["客観的な自己分析", "多角的な視点", "バランスの取れた判断"];
    }
    
    return flippedMatches.map(match => match.ability);
  }

  // 9. 変卦の移行プロセス論理 - 詳細実装
  findTransitionPath(interfaceId, safeModeId) {
    const interfaceLines = this.getHexagramLines(interfaceId).lines;
    const safeModeLines = this.getHexagramLines(safeModeId).lines;
    
    // 変化する爻を特定
    const changingLines = [];
    for (let i = 0; i < 6; i++) {
      if (interfaceLines[i] !== safeModeLines[i]) {
        changingLines.push({
          position: i + 1,
          from: interfaceLines[i] === 1 ? "陽" : "陰",
          to: safeModeLines[i] === 1 ? "陽" : "陰",
          positionName: this.getLinePositionName(i + 1)
        });
      }
    }
    
    // 変化の困難度を評価
    const changeCount = changingLines.length;
    let difficulty = "普通";
    if (changeCount === 0) difficulty = "なし";
    else if (changeCount <= 2) difficulty = "容易";
    else if (changeCount <= 4) difficulty = "普通";
    else difficulty = "困難";
    
    return {
      path: changingLines,
      difficulty: difficulty,
      changeCount: changeCount,
      stability: changeCount <= 2 ? "安定" : "不安定"
    };
  }

  identifyChangingLines(transitionPath) {
    return transitionPath.path.map(change => ({
      position: change.position,
      positionName: change.positionName,
      change: `${change.from}→${change.to}`,
      trigger: this.getLineChangeTrigger(change.position, change.from, change.to)
    }));
  }

  analyzeTransitionTriggers(changingLines) {
    const triggers = changingLines.map(line => line.trigger);
    const uniqueTriggers = [...new Set(triggers)];
    
    return uniqueTriggers.length > 0 ? uniqueTriggers : ["一般的ストレス"];
  }

  generateChangingDiagnosis(transitionPath, triggers) {
    const { difficulty, changeCount, stability } = transitionPath;
    const triggerList = triggers.join("、");
    
    return `【変卦分析: ${difficulty}】インターフェースからセーフモードへの移行は${changeCount}つの爻が変化し、${stability}です。主なトリガー: ${triggerList}`;
  }

  getChangingManifestation(triggers) {
    const manifestationMap = {
      "権威からの圧力": "上司や権威者からの批判に過敏に反応",
      "協調性の破綻": "チームワークが必要な場面でのストレス",
      "決断の重圧": "重要な判断を迫られた時のプレッシャー",
      "責任の重荷": "リーダーシップを取る場面での不安",
      "一般的ストレス": "日常的なストレス状況での防御反応"
    };
    
    return triggers.map(trigger => manifestationMap[trigger] || trigger);
  }

  // 10. 季節卦の不一致論理 - 詳細実装
  calculateSeasonalMismatch(engineSeason, interfaceSeason, safeModeSeason) {
    const seasons = [engineSeason.season, interfaceSeason.season, safeModeSeason.season];
    const uniqueSeasons = new Set(seasons);
    
    // 季節の統一度を計算
    let mismatchLevel = "低";
    let mismatchType = "調和";
    
    if (uniqueSeasons.size === 1) {
      mismatchLevel = "なし";
      mismatchType = "完全調和";
    } else if (uniqueSeasons.size === 2) {
      mismatchLevel = "中";
      mismatchType = "部分不一致";
    } else {
      mismatchLevel = "高";
      mismatchType = "全面不一致";
    }
    
    // 季節の対立関係をチェック
    const oppositeSeasons = {
      "春": "秋", "夏": "冬", "秋": "春", "冬": "夏"
    };
    
    const hasOpposition = seasons.some(season1 => 
      seasons.some(season2 => oppositeSeasons[season1] === season2)
    );
    
    if (hasOpposition) {
      mismatchType = "対立型";
      mismatchLevel = "高";
    }
    
    return {
      level: mismatchLevel,
      type: mismatchType,
      seasonalSpread: [...uniqueSeasons],
      hasOpposition: hasOpposition,
      dominantSeason: this.findDominantSeason(seasons)
    };
  }

  generateSeasonalDiagnosis(seasonalMismatch) {
    const { level, type, seasonalSpread, hasOpposition, dominantSeason } = seasonalMismatch;
    
    if (level === "なし") {
      return `【季節調和: 完全統一】全てのOSが${dominantSeason}の性質を持ち、極めて自然で一貫したエネルギーフローを持っています。`;
    }
    
    if (hasOpposition) {
      return `【季節調和: 対立型】${seasonalSpread.join("と")}の対立する季節性を持ち、内的な緊張とエネルギーの不安定さがあります。`;
    }
    
    if (level === "高") {
      return `【季節調和: 多様型】${seasonalSpread.join("・")}の多様な季節性を持ち、複雑で変化に富んだ人格構造です。`;
    }
    
    return `【季節調和: ${type}】適度な季節的変化があり、状況に応じて異なるエネルギーを発揮します。`;
  }

  getSeasonalManifestation(seasonalMismatch) {
    const { type, hasOpposition, seasonalSpread } = seasonalMismatch;
    
    if (type === "完全調和") {
      return ["時期に応じた自然な行動", "季節感のある生活", "エネルギーの安定"];
    }
    
    if (hasOpposition) {
      return ["季節による気分の激変", "エネルギーの不安定", "内的葛藤の慢性化"];
    }
    
    return ["多様な適応能力", "状況に応じた柔軟性", "豊かな表現力"];
  }

  // ヘルパーメソッド
  getLineChangeTrigger(position, from, to) {
    const triggers = {
      1: "新環境への適応プレッシャー",
      2: "協調性への要求", 
      3: "判断の分岐点でのストレス",
      4: "実行責任のプレッシャー",
      5: "権威からの圧力",
      6: "完成への重圧"
    };
    
    return triggers[position] || "一般的ストレス";
  }

  findDominantSeason(seasons) {
    const seasonCount = {};
    seasons.forEach(season => {
      seasonCount[season] = (seasonCount[season] || 0) + 1;
    });
    
    return Object.entries(seasonCount).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  }
  classifyFortune(catchphrase) { 
    if (!catchphrase || typeof catchphrase !== 'string') return "中庸";
    
    if (catchphrase.includes("吉")) return "吉";
    if (catchphrase.includes("凶")) return "凶";
    if (catchphrase.includes("亨")) return "亨";
    if (catchphrase.includes("利")) return "利";
    if (catchphrase.includes("吝")) return "吝";
    if (catchphrase.includes("貞")) return "貞";
    return "中庸";
  }
  
  // 統合分析用メソッド
  identifyPrimaryPatterns(results) { 
    const patterns = [];
    if (results.greatTheme?.harmony > 0.7) patterns.push("大テーマ調和");
    if (results.trigramResonance?.dominantTrigrams?.length > 0) patterns.push("八卦共鳴");
    if (results.fiveElementCycles?.harmoniousFlow) patterns.push("五行調和");
    return patterns;
  }
  
  extractDeepInsights(results) { 
    const insights = [];
    if (results.internalExternalInversion?.energyFlow?.severity === "高") {
      insights.push("内外エネルギーの激しい対立があり、燃え尽き症候群のリスクが高い");
    }
    if (results.lineCorrespondence?.conflictPositions?.length > 0) {
      insights.push("特定の立場や役職でストレスを感じやすい傾向がある");
    }
    return insights;
  }
  
  synthesizePracticalAdvice(results) { 
    const advice = [];
    if (results.greatTheme?.harmony > 0.7) {
      advice.push("現在の内面的調和を維持し、この安定性を活用してください");
    }
    if (results.internalExternalInversion?.energyFlow?.severity === "高") {
      advice.push("オンとオフを明確に分け、定期的な休息を心がけてください");
    }
    if (results.trigramResonance?.dominantTrigrams?.length > 0) {
      advice.push("あなたの特徴的な能力を意識的に活用することで、より良い結果を得られます");
    }
    return advice;
  }
  
  identifyWarningSignals(results) { 
    const warnings = [];
    if (results.internalExternalInversion?.energyFlow?.severity === "高") {
      warnings.push("燃え尽き症候群のリスク");
    }
    if (results.lineCorrespondence?.conflictPositions?.some(c => c.severity === "高")) {
      warnings.push("特定の役職でのストレス過多");
    }
    return warnings;
  }
  
  calculateOverallHarmony(results) { 
    const harmonies = [
      results.greatTheme?.harmony || 0.5,
      results.trigramResonance?.dominantTrigrams?.length > 0 ? 0.7 : 0.5,
      results.fiveElementCycles?.harmoniousFlow ? 0.8 : results.fiveElementCycles?.conflictingFlow ? 0.3 : 0.5
    ];
    return harmonies.reduce((sum, h) => sum + h, 0) / harmonies.length;
  }
  
  calculateComplexity(results) { 
    let complexity = 0.5;
    if (results.trigramResonance?.dominantTrigrams?.length > 2) complexity += 0.2;
    if (results.lineCorrespondence?.conflictPositions?.length > 2) complexity += 0.2;
    if (results.internalExternalInversion?.pattern?.length > 1) complexity += 0.1;
    return Math.min(1.0, complexity);
  }
  
  calculatePotential(results) { 
    let potential = 0.5;
    if (results.greatTheme?.pattern === "通達成長型") potential += 0.2;
    if (results.trigramResonance?.dominantTrigrams?.some(t => [1, 3, 4].includes(t.trigram))) potential += 0.2;
    if (results.fiveElementCycles?.harmoniousFlow) potential += 0.1;
    return Math.min(1.0, potential);
  }
  
  calculateRisk(results) { 
    let risk = 0.2;
    if (results.internalExternalInversion?.energyFlow?.severity === "高") risk += 0.3;
    if (results.lineCorrespondence?.conflictPositions?.some(c => c.severity === "高")) risk += 0.2;
    if (results.greatTheme?.pattern === "三凶困難型") risk += 0.2;
    return Math.min(1.0, risk);
  }

  // ========== 高度ロジック詳細実装 ==========

  // 11. 君臣不応論理 - 詳細実装
  analyzeRulerMinisterInHexagram(lines) {
    const rulerLine = lines[4]; // 五爻（君位）
    const ministerLine = lines[1]; // 二爻（臣位）
    
    const alignment = rulerLine === ministerLine ? "一致" : "不一致";
    const power = rulerLine === 1 ? "陽君" : "陰君";
    const support = ministerLine === 1 ? "陽臣" : "陰臣";
    
    return {
      ruler: { line: rulerLine, type: power, position: 5 },
      minister: { line: ministerLine, type: support, position: 2 },
      alignment: alignment,
      balance: this.calculateRulerMinisterBalance(rulerLine, ministerLine)
    };
  }

  calculateRulerMinisterAlignment(rulerMinisterAnalysis) {
    const alignments = [
      rulerMinisterAnalysis.engine.alignment,
      rulerMinisterAnalysis.interface.alignment,
      rulerMinisterAnalysis.safeMode.alignment
    ];
    
    const matchCount = alignments.filter(a => a === "一致").length;
    return {
      overallScore: matchCount / 3,
      pattern: matchCount === 3 ? "完全調和" : matchCount === 2 ? "部分調和" : matchCount === 1 ? "部分不調和" : "完全不調和"
    };
  }

  identifyHierarchyPattern(rulerMinisterAnalysis) {
    const patterns = [];
    
    const rulerTypes = [
      rulerMinisterAnalysis.engine.ruler.type,
      rulerMinisterAnalysis.interface.ruler.type,
      rulerMinisterAnalysis.safeMode.ruler.type
    ];
    
    const ministerTypes = [
      rulerMinisterAnalysis.engine.minister.type,
      rulerMinisterAnalysis.interface.minister.type,
      rulerMinisterAnalysis.safeMode.minister.type
    ];
    
    if (rulerTypes.every(r => r === "陽君")) patterns.push("強力指導型");
    if (rulerTypes.every(r => r === "陰君")) patterns.push("柔軟指導型");
    if (ministerTypes.every(m => m === "陽臣")) patterns.push("積極支援型");
    if (ministerTypes.every(m => m === "陰臣")) patterns.push("謙虚支援型");
    
    return patterns.length > 0 ? patterns.join("・") : "混合型";
  }

  generateRulerMinisterDiagnosis(overallAlignment, hierarchyPattern) {
    const alignmentLevel = overallAlignment.overallScore > 0.8 ? "非常に良好" :
                          overallAlignment.overallScore > 0.6 ? "良好" :
                          overallAlignment.overallScore > 0.4 ? "注意" : "問題";
    
    return `【君臣関係: ${alignmentLevel}】${hierarchyPattern}の特徴を持ち、リーダーシップと協力関係において${overallAlignment.pattern}を示しています。`;
  }

  getRulerMinisterManifestation(hierarchyPattern) {
    const manifestations = {
      "強力指導型": ["強いリーダーシップを発揮", "権威を自然に行使", "決断力が高い"],
      "柔軟指導型": ["調和を重視した指導", "包容力のあるリーダー", "協調的な決定"],
      "積極支援型": ["能動的なサポート", "建設的な提案", "チームワークを重視"],
      "謙虚支援型": ["献身的なサポート", "控えめだが確実な支援", "調和を保つ"]
    };
    
    return manifestations[hierarchyPattern] || ["バランスの取れた対人関係"];
  }

  // 12. 往来循環論理 - 詳細実装
  analyzeHexagramFlow(hexagramId) {
    const lines = this.getHexagramLines(hexagramId).lines;
    const trigrams = this.getHexagramTrigrams(hexagramId);
    
    // エネルギーの流れの方向性を分析
    const upperFlow = this.getTrigramFlow(trigrams.upper);
    const lowerFlow = this.getTrigramFlow(trigrams.lower);
    
    return {
      upperFlow: upperFlow,
      lowerFlow: lowerFlow,
      overallDirection: this.calculateOverallDirection(upperFlow, lowerFlow),
      flowStrength: this.calculateFlowStrength(lines),
      flowPattern: this.identifyFlowPattern(upperFlow, lowerFlow)
    };
  }

  identifyCirculationPattern(engineFlow, interfaceFlow, safeModeFlow) {
    const flows = [engineFlow, interfaceFlow, safeModeFlow];
    const directions = flows.map(f => f.overallDirection);
    const strengths = flows.map(f => f.flowStrength);
    
    const avgStrength = strengths.reduce((sum, s) => sum + s, 0) / 3;
    const uniformDirection = new Set(directions).size === 1;
    
    return {
      pattern: uniformDirection ? "統一循環" : "複合循環",
      strength: avgStrength,
      balance: this.calculateCirculationBalance(directions),
      efficiency: avgStrength * (uniformDirection ? 1.2 : 0.8)
    };
  }

  identifyFlowObstacles(circulationPattern) {
    const obstacles = [];
    
    if (circulationPattern.strength < 0.4) obstacles.push("エネルギー不足");
    if (circulationPattern.balance < 0.5) obstacles.push("方向性の混乱");
    if (circulationPattern.efficiency < 0.6) obstacles.push("循環効率の低下");
    
    return obstacles;
  }

  generateComingGoingDiagnosis(circulationPattern, flowObstacles) {
    if (flowObstacles.length === 0) {
      return `【往来循環: 良好】${circulationPattern.pattern}でエネルギーがスムーズに循環し、効率的な活動が可能です。`;
    }
    
    const obstacleList = flowObstacles.join("、");
    return `【往来循環: 注意】${obstacleList}により、エネルギーの循環に支障があります。${circulationPattern.pattern}の調整が必要です。`;
  }

  getComingGoingManifestation(circulationPattern) {
    if (circulationPattern.efficiency > 0.8) {
      return ["エネルギーの好循環", "持続可能な活動", "自然な成長"];
    } else if (circulationPattern.efficiency < 0.4) {
      return ["エネルギーの停滞", "疲労の蓄積", "活動の低下"];
    }
    
    return ["変動的なエネルギー", "波のある活動", "調整が必要"];
  }

  // 13. 時中論理 - 詳細実装
  analyzeTimingAppropriateness(hexagramId) {
    const hexagram = this.hexagramData.find(h => h.hexagram_id === hexagramId);
    const seasonality = this.getHexagramSeason(hexagramId);
    
    // 時機的適切性を多角的に分析
    return {
      seasonal: seasonality.confidence === "高" ? 0.8 : 0.6,
      contextual: this.getContextualTiming(hexagram),
      developmental: this.getDevelopmentalTiming(hexagramId),
      overall: 0
    };
  }

  calculateTimingHarmony(engineTiming, interfaceTiming, safeModeTiming) {
    const timings = [engineTiming, interfaceTiming, safeModeTiming];
    const avgTiming = timings.reduce((sum, t) => sum + (t.seasonal + t.contextual + t.developmental) / 3, 0) / 3;
    
    return {
      harmony: avgTiming,
      consistency: this.calculateTimingConsistency(timings),
      synchronization: this.calculateTimingSynchronization(timings)
    };
  }

  identifyModerationPattern(timingHarmony) {
    if (timingHarmony.harmony > 0.8 && timingHarmony.consistency > 0.7) {
      return "完全時中";
    } else if (timingHarmony.harmony > 0.6) {
      return "適度時中";
    } else if (timingHarmony.synchronization > 0.6) {
      return "部分時中";
    }
    return "時機不適";
  }

  generateTimelyModerationDiagnosis(timingHarmony, moderationPattern) {
    const harmonyLevel = timingHarmony.harmony > 0.7 ? "高い" : timingHarmony.harmony > 0.5 ? "適度" : "低い";
    return `【時中適応: ${moderationPattern}】時機を捉える能力が${harmonyLevel}レベルにあり、適切なタイミングでの行動が可能です。`;
  }

  getTimelyModerationManifestation(moderationPattern) {
    const manifestations = {
      "完全時中": ["絶妙なタイミング感覚", "機会を逃さない", "自然な流れに乗る"],
      "適度時中": ["良いタイミング感覚", "機会を活かす", "状況に応じた対応"],
      "部分時中": ["時々良いタイミング", "機会の一部を活用", "改善の余地あり"],
      "時機不適": ["タイミングが合わない", "機会を逃しやすい", "調整が必要"]
    };
    
    return manifestations[moderationPattern] || ["タイミングの模索中"];
  }

  // 14. 祭祀神託論理 - 詳細実装
  analyzeSacredness(hexagramId) {
    const trigrams = this.getHexagramTrigrams(hexagramId);
    const sacredElements = this.getSacredElements(trigrams);
    
    return {
      level: this.calculateSacredLevel(sacredElements),
      type: this.identifySacredType(sacredElements),
      intuitionStrength: this.calculateIntuitionStrength(trigrams),
      oracleCapacity: this.calculateOracleCapacity(hexagramId)
    };
  }

  identifyOraclePattern(engineSacredness, interfaceSacredness, safeModeSacredness) {
    const sacredLevels = [
      engineSacredness.level,
      interfaceSacredness.level,
      safeModeSacredness.level
    ];
    
    const avgSacred = sacredLevels.reduce((sum, level) => sum + level, 0) / 3;
    const maxSacred = Math.max(...sacredLevels);
    
    return {
      strength: avgSacred,
      peak: maxSacred,
      pattern: maxSacred > 0.8 ? "神託型" : avgSacred > 0.6 ? "直感型" : "分析型"
    };
  }

  calculateIntuitionLevel(oraclePattern) {
    return {
      overall: oraclePattern.strength,
      peak: oraclePattern.peak,
      reliability: oraclePattern.strength > 0.7 ? "高" : oraclePattern.strength > 0.5 ? "中" : "低"
    };
  }

  generateRitualOracleDiagnosis(oraclePattern, intuitionLevel) {
    return `【神託直感: ${oraclePattern.pattern}】直感的洞察力が${intuitionLevel.reliability}レベルにあり、${oraclePattern.pattern}の特徴を持っています。`;
  }

  getRitualOracleManifestation(oraclePattern) {
    const manifestations = {
      "神託型": ["強い直感力", "霊的な洞察", "予知的な感覚"],
      "直感型": ["良い直感", "感覚的な判断", "雰囲気を読む"],
      "分析型": ["論理的思考", "データ重視", "慎重な判断"]
    };
    
    return manifestations[oraclePattern.pattern] || ["バランスの取れた判断"];
  }

  // 15. 家族関係論理 - 詳細実装
  analyzeFamilyRole(hexagramId) {
    const trigrams = this.getHexagramTrigrams(hexagramId);
    const upperFamily = this.trigramData[trigrams.upper]?.family || "不明";
    const lowerFamily = this.trigramData[trigrams.lower]?.family || "不明";
    
    return {
      upperRole: upperFamily,
      lowerRole: lowerFamily,
      dominantRole: this.identifyDominantFamilyRole(upperFamily, lowerFamily),
      familyDynamics: this.getFamilyDynamics(upperFamily, lowerFamily)
    };
  }

  analyzeFamilySystemDynamics(engineFamily, interfaceFamily, safeModeFamily) {
    const allRoles = [
      engineFamily.upperRole, engineFamily.lowerRole,
      interfaceFamily.upperRole, interfaceFamily.lowerRole,
      safeModeFamily.upperRole, safeModeFamily.lowerRole
    ];
    
    const roleCount = {};
    allRoles.forEach(role => {
      roleCount[role] = (roleCount[role] || 0) + 1;
    });
    
    return {
      roleDistribution: roleCount,
      balance: this.calculateFamilyBalance(roleCount),
      harmony: this.calculateFamilyHarmony(allRoles)
    };
  }

  identifyRelationshipPatterns(familyDynamics) {
    const patterns = [];
    const { roleDistribution, balance, harmony } = familyDynamics;
    
    if (roleDistribution["父"] > 0 && roleDistribution["母"] > 0) patterns.push("両親型");
    if (roleDistribution["長男"] > 0 || roleDistribution["長女"] > 0) patterns.push("長子型");
    if (balance > 0.7) patterns.push("調和型");
    if (harmony < 0.4) patterns.push("葛藤型");
    
    return patterns.length > 0 ? patterns.join("・") : "複合型";
  }

  generateFamilyDynamicsDiagnosis(familyDynamics, relationshipPatterns) {
    const harmonyLevel = familyDynamics.harmony > 0.7 ? "良好" : 
                        familyDynamics.harmony > 0.5 ? "普通" : "改善要";
    
    return `【家族力学: ${relationshipPatterns}】家族的な役割バランスが${harmonyLevel}で、${relationshipPatterns}の特徴を示しています。`;
  }

  getFamilyDynamicsManifestation(relationshipPatterns) {
    if (relationshipPatterns.includes("調和型")) {
      return ["自然な人間関係", "サポート体制", "安定した絆"];
    } else if (relationshipPatterns.includes("葛藤型")) {
      return ["人間関係の複雑さ", "役割の混乱", "調整が必要"];
    }
    
    return ["多様な人間関係", "状況に応じた役割", "適応的な対応"];
  }

  // 16-20の詳細実装は簡略化版で継続
  analyzeMovementCapacity(hexagramId) {
    const trigrams = this.getHexagramTrigrams(hexagramId);
    return {
      mobility: this.calculateMobility(trigrams),
      direction: this.getMovementDirection(trigrams),
      speed: this.getMovementSpeed(trigrams)
    };
  }

  calculateOverallMobility(engineVehicle, interfaceVehicle, safeModeVehicle) {
    const avgMobility = (engineVehicle.mobility + interfaceVehicle.mobility + safeModeVehicle.mobility) / 3;
    return {
      overall: avgMobility,
      pattern: avgMobility > 0.7 ? "高機動" : avgMobility > 0.4 ? "中機動" : "低機動"
    };
  }

  identifyVehiclePattern(overallMobility) {
    return overallMobility.pattern;
  }

  generateVehicleDiagnosis(overallMobility, vehiclePattern) {
    return `【推進力: ${vehiclePattern}】動的な活動能力が${vehiclePattern}レベルにあります。`;
  }

  getVehicleManifestation(vehiclePattern) {
    const manifestations = {
      "高機動": ["迅速な行動", "機敏な対応", "積極的な活動"],
      "中機動": ["適度な活動", "バランスの取れた動き", "状況対応"],
      "低機動": ["慎重な行動", "安定志向", "じっくりと進む"]
    };
    
    return manifestations[vehiclePattern] || ["適度な活動"];
  }

  // 残りの高度ロジックも同様に簡略実装
  analyzeContainerCapacity(hexagramId) {
    const trigrams = this.getHexagramTrigrams(hexagramId);
    return {
      capacity: this.calculateContainerCapacity(trigrams),
      stability: this.getContainerStability(trigrams)
    };
  }

  calculateVesselCapacity(engineVessel, interfaceVessel, safeModeVessel) {
    const avgCapacity = (engineVessel.capacity + interfaceVessel.capacity + safeModeVessel.capacity) / 3;
    return { overall: avgCapacity };
  }

  identifyVesselPattern(vesselCapacity) {
    return vesselCapacity.overall > 0.7 ? "大容量" : vesselCapacity.overall > 0.4 ? "中容量" : "小容量";
  }

  generateVesselDiagnosis(vesselCapacity, vesselPattern) {
    return `【受容力: ${vesselPattern}】物事を受け入れ保持する能力が${vesselPattern}レベルです。`;
  }

  getVesselManifestation(vesselPattern) {
    const manifestations = {
      "大容量": ["高い受容性", "包容力", "多様性の受け入れ"],
      "中容量": ["適度な受容性", "バランス感覚", "選択的受容"],
      "小容量": ["慎重な受容", "質重視", "厳選主義"]
    };
    return manifestations[vesselPattern] || ["適度な受容性"];
  }

  // ヘルパーメソッドの簡略実装
  calculateRulerMinisterBalance(rulerLine, ministerLine) {
    return rulerLine === ministerLine ? 1.0 : 0.3;
  }

  getTrigramFlow(trigramId) {
    const flowMap = { 1: "上昇", 2: "表出", 3: "放射", 4: "振動", 5: "浸透", 6: "下降", 7: "停止", 8: "受容" };
    return flowMap[trigramId] || "中性";
  }

  calculateOverallDirection(upperFlow, lowerFlow) {
    if (upperFlow === "上昇" || lowerFlow === "上昇") return "上昇";
    if (upperFlow === "下降" || lowerFlow === "下降") return "下降";
    return "平行";
  }

  calculateFlowStrength(lines) {
    const yangCount = lines.filter(line => line === 1).length;
    return yangCount / 6;
  }

  identifyFlowPattern(upperFlow, lowerFlow) {
    return upperFlow === lowerFlow ? "統一" : "複合";
  }

  calculateCirculationBalance(directions) {
    return new Set(directions).size === 1 ? 1.0 : 0.5;
  }

  getContextualTiming(hexagram) {
    return hexagram?.catchphrase?.includes("時") ? 0.8 : 0.5;
  }

  getDevelopmentalTiming(hexagramId) {
    return hexagramId <= 32 ? 0.7 : 0.6; // 前半卦は発展期
  }

  calculateTimingConsistency(timings) {
    const avgTiming = timings.reduce((sum, t) => sum + t.seasonal, 0) / timings.length;
    const variance = timings.reduce((sum, t) => sum + Math.pow(t.seasonal - avgTiming, 2), 0) / timings.length;
    return 1 - Math.sqrt(variance);
  }

  calculateTimingSynchronization(timings) {
    return timings.every(t => t.seasonal > 0.6) ? 0.9 : 0.5;
  }

  getSacredElements(trigrams) {
    const sacredTrigrams = [1, 6, 8]; // 乾、坎、坤は神聖
    return {
      upper: sacredTrigrams.includes(trigrams.upper),
      lower: sacredTrigrams.includes(trigrams.lower)
    };
  }

  calculateSacredLevel(sacredElements) {
    let level = 0.3;
    if (sacredElements.upper) level += 0.3;
    if (sacredElements.lower) level += 0.3;
    return level;
  }

  identifySacredType(sacredElements) {
    if (sacredElements.upper && sacredElements.lower) return "完全神聖";
    if (sacredElements.upper || sacredElements.lower) return "部分神聖";
    return "世俗";
  }

  calculateIntuitionStrength(trigrams) {
    const intuitionTrigrams = [6, 3]; // 坎、離は直感
    let strength = 0.3;
    if (intuitionTrigrams.includes(trigrams.upper)) strength += 0.3;
    if (intuitionTrigrams.includes(trigrams.lower)) strength += 0.3;
    return strength;
  }

  calculateOracleCapacity(hexagramId) {
    return hexagramId === 4 || hexagramId === 20 ? 0.9 : 0.5; // 蒙、観は神託
  }

  identifyDominantFamilyRole(upperFamily, lowerFamily) {
    const hierarchy = { "父": 4, "母": 4, "長男": 3, "中男": 2, "少男": 1, "長女": 3, "中女": 2, "少女": 1 };
    return hierarchy[upperFamily] > hierarchy[lowerFamily] ? upperFamily : lowerFamily;
  }

  getFamilyDynamics(upperFamily, lowerFamily) {
    return upperFamily === lowerFamily ? "統一" : "多様";
  }

  calculateFamilyBalance(roleCount) {
    const roles = Object.keys(roleCount);
    return roles.length / 8; // 最大8役割での比率
  }

  calculateFamilyHarmony(allRoles) {
    const uniqueRoles = new Set(allRoles);
    return uniqueRoles.size <= 4 ? 0.8 : 0.5; // 多様性適度なら調和
  }

  calculateMobility(trigrams) {
    const mobilityMap = { 1: 0.9, 2: 0.7, 3: 0.8, 4: 0.9, 5: 0.6, 6: 0.4, 7: 0.2, 8: 0.3 };
    return (mobilityMap[trigrams.upper] + mobilityMap[trigrams.lower]) / 2;
  }

  getMovementDirection(trigrams) {
    const directionMap = { 1: "上", 2: "右上", 3: "右", 4: "左", 5: "左下", 6: "下", 7: "左上", 8: "下" };
    return directionMap[trigrams.upper] || "中央";
  }

  getMovementSpeed(trigrams) {
    const speedMap = { 1: 0.9, 2: 0.7, 3: 0.8, 4: 0.9, 5: 0.6, 6: 0.5, 7: 0.2, 8: 0.3 };
    return (speedMap[trigrams.upper] + speedMap[trigrams.lower]) / 2;
  }

  calculateContainerCapacity(trigrams) {
    const capacityMap = { 1: 0.3, 2: 0.7, 3: 0.5, 4: 0.4, 5: 0.6, 6: 0.8, 7: 0.7, 8: 0.9 };
    return (capacityMap[trigrams.upper] + capacityMap[trigrams.lower]) / 2;
  }

  getContainerStability(trigrams) {
    const stabilityMap = { 1: 0.9, 2: 0.6, 3: 0.5, 4: 0.4, 5: 0.5, 6: 0.7, 7: 0.9, 8: 0.9 };
    return (stabilityMap[trigrams.upper] + stabilityMap[trigrams.lower]) / 2;
  }

  // 残りの簡略実装メソッド
  analyzeVirtueLevel(hexagramId) {
    const virtue = hexagramId <= 30 ? 0.7 : 0.6;
    return { level: virtue, type: virtue > 0.6 ? "高徳" : "中徳" };
  }

  analyzeVirtueIntegration(engineVirtue, interfaceVirtue, safeModeVirtue) {
    const avgVirtue = (engineVirtue.level + interfaceVirtue.level + safeModeVirtue.level) / 3;
    return { overall: avgVirtue };
  }

  identifyMoralCharacter(virtueIntegration) {
    return virtueIntegration.overall > 0.7 ? "高潔" : virtueIntegration.overall > 0.5 ? "良好" : "発展中";
  }

  generateVirtueDiagnosis(virtueIntegration, moralCharacter) {
    return `【徳性品格: ${moralCharacter}】道徳的品格が${moralCharacter}レベルにあります。`;
  }

  getVirtueManifestation(moralCharacter) {
    const manifestations = {
      "高潔": ["高い道徳性", "誠実な行動", "信頼される人格"],
      "良好": ["基本的な道徳性", "適切な判断", "バランスの取れた行動"],
      "発展中": ["成長する道徳性", "学習する姿勢", "向上への意欲"]
    };
    return manifestations[moralCharacter] || ["道徳的成長"];
  }

  identifySymbolicAnimal(hexagramId) {
    const animalMap = {
      1: "竜", 2: "牛", 3: "魚", 4: "亀", 5: "鳥", 6: "豚", 7: "犬", 8: "馬",
      // 簡略化して主要なもののみ
    };
    return { animal: animalMap[hexagramId] || "未分類", characteristics: ["力強い", "安定"] };
  }

  analyzeEcosystemDynamics(engineAnimal, interfaceAnimal, safeModeAnimal) {
    return {
      compatibility: 0.7,
      foodChain: "バランス",
      habitat: "共存可能"
    };
  }

  identifyAnimalPattern(ecosystemDynamics) {
    return ecosystemDynamics.compatibility > 0.6 ? "調和生態系" : "競争生態系";
  }

  generateSymbolicAnimalDiagnosis(ecosystemDynamics, animalPattern) {
    return `【象徴動物: ${animalPattern}】動物的本能と行動パターンが${animalPattern}を形成しています。`;
  }

  getSymbolicAnimalManifestation(animalPattern) {
    return animalPattern === "調和生態系" ? ["自然な行動", "本能的調和", "生態系的バランス"] : ["競争本能", "生存戦略", "適応力"];
  }

  identifyUnchangingCore(hexagramId) {
    return {
      core: hexagramId <= 32 ? "成長核" : "完成核",
      stability: 0.8,
      essence: "不変の本質"
    };
  }

  analyzeCoreIntegrity(engineCore, interfaceCore, safeModeCore) {
    return {
      integration: 0.7,
      consistency: 0.8,
      strength: 0.75
    };
  }

  identifyUnchangingPattern(coreIntegrity) {
    return coreIntegrity.integration > 0.7 ? "統合核心" : "多様核心";
  }

  generateUnchangingDiagnosis(coreIntegrity, unchangingPattern) {
    return `【不変核心: ${unchangingPattern}】変わらない本質的な核が${unchangingPattern}パターンを形成しています。`;
  }

  getUnchangingManifestation(unchangingPattern) {
    return unchangingPattern === "統合核心" ? ["一貫した価値観", "不変の信念", "核心的安定性"] : ["多面的な核心", "状況適応的本質", "複合的安定性"];
  }
}

// グローバルに公開
window.IChingUltraSyncLogic = IChingUltraSyncLogic;