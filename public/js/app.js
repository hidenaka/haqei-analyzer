// HaQei Analyzer - Main Application
console.log("🎯 HaQei Analyzer starting...");

let app = null;
let storageManager = null;

/**
 * デバウンス関数 - パフォーマンス最適化版
 * @param {Function} func - 実行する関数
 * @param {number} wait - 待機時間（ミリ秒）
 * @param {boolean} immediate - 即座実行フラグ
 * @returns {Function} デバウンスされた関数
 */
function debounce(func, wait, immediate = false) {
  let timeout;
  let callCount = 0;
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) {
        callCount++;
        func.apply(this, args);
      }
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) {
      callCount++;
      func.apply(this, args);
    }
  };
}

/**
 * 動的スクリプト読み込み関数 - エラーハンドリング強化版
 * @param {string} src - スクリプトのURL
 * @param {Object} options - オプション設定
 * @returns {Promise<Event>} 読み込み完了Promise
 */
async function loadScript(src, options = {}) {
  const { 
    retryCount = 3, 
    timeout = 10000,
    integrity = null,
    crossOrigin = null 
  } = options;
  
  let attempt = 0;
  
  const tryLoad = () => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    
    if (integrity) script.integrity = integrity;
    if (crossOrigin) script.crossOrigin = crossOrigin;
    
    // タイムアウト設定
    const timeoutId = setTimeout(() => {
      script.remove();
      reject(new Error(`Script load timeout: ${src}`));
    }, timeout);
    
    script.onload = (event) => {
      clearTimeout(timeoutId);
      resolve(event);
    };
    
    script.onerror = (error) => {
      clearTimeout(timeoutId);
      script.remove();
      reject(new Error(`Script load failed: ${src} - ${error.message || 'Unknown error'}`));
    };
    
    document.head.appendChild(script);
  });
  
  while (attempt < retryCount) {
    try {
      attempt++;
      const cacheBustedSrc = attempt > 1 ? `${src}?t=${Date.now()}&retry=${attempt}` : src;
      const result = tryLoad();
      
      if (attempt > 1) {
        console.log(`✅ Script loaded after ${attempt} attempts: ${src}`);
      }
      return result;
      
    } catch (error) {
      if (attempt >= retryCount) {
        console.error(`❌ Script load failed after ${retryCount} attempts: ${src}`, error);
        throw error;
      }
      
      console.warn(`⚠️ Script load attempt ${attempt} failed, retrying: ${src}`);
      // await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

/**
 * ModuleLoader-based Dynamic Loading System
 * 
 * Phase 2 Optimization: Aggressive code splitting and lazy loading
 * Target: Reduce bundle from 4.76MB to 3MB through strategic loading
 * 
 * Bundle Strategy:
 * - Core Bundle (~800KB): Essential startup components
 * - Question Bundle (~600KB): Question flow and UI
 * - Analysis Bundle (~1200KB): All analysis engines and logic
 * - Results Bundle (~800KB): Results display and charts
 * - Optional Bundle (~400KB): Help system and advanced features
 */
async function loadAnalysisEngines() {
  console.log("🚀 ModuleLoader-based progressive loading initialized");
  
  // Ensure ModuleLoader is available
  if (!window.moduleLoader) {
    console.error("❌ ModuleLoader not available, falling back to direct loading");
    return loadAnalysisEnginesFallback();
  }
  
  try {
    // Stage 1: Core Bundle (immediately needed)
    console.log("📦 Loading Core Bundle...");
    window.moduleLoader.loadBundle('core');
    
    // Stage 2: Question Bundle (loaded on demand)
    window.loadQuestionBundle = async function() {
      console.log("📦 Loading Question Bundle...");
      return window.moduleLoader.loadBundle('questions');
    };
    
    // Stage 3: Analysis Bundle (loaded when analysis starts)
    window.loadAnalysisBundle = async function() {
      console.log("📦 Loading Analysis Bundle...");
      const modules = window.moduleLoader.loadBundle('analysis');
      window.heavyEnginesLoaded = true;
      return modules;
    };
    
    // Stage 4: Results Bundle (loaded when showing results)
    window.loadResultsBundle = async function() {
      console.log("📦 Loading Results Bundle...");
      return window.moduleLoader.loadBundle('results');
    };
    
    // Stage 5: Optional Bundle (loaded on first use)
    window.loadOptionalBundle = async function() {
      console.log("📦 Loading Optional Bundle...");
      return window.moduleLoader.loadBundle('optional');
    };
    
    // Predictive preloading based on user context
    window.enablePredictiveLoading = function(context) {
      if (window.moduleLoader) {
        window.moduleLoader.predictNextModules(context);
      }
    };
    
    console.log("✅ ModuleLoader progressive loading system ready");
    console.log("📊 Estimated bundle size reduction: ~37% (1.76MB saved)");
    
  } catch (error) {
    console.error("❌ ModuleLoader initialization failed, using fallback:", error);
    return loadAnalysisEnginesFallback();
  }
}

// Fallback to original loading system if ModuleLoader fails
async function loadAnalysisEnginesFallback() {
  console.log("🔄 Using fallback loading system");
  
  const criticalEngines = [
    '/js/os-analyzer/core/StatisticalEngine.js',
    '/js/os-analyzer/core/Calculator.js',
    '/js/os-analyzer/components/AnalysisView.js'
  ];
  
  Promise.all(criticalEngines.map(engine => loadScript(engine)));
  console.log("✅ Critical engines loaded (fallback mode)");
  
  // Minimal secondary engine loading
  window.loadSecondaryEngines = async function() {
    const secondaryEngines = [
      '/js/os-analyzer/engines/CompatibilityDataLoader.js',
      '/js/os-analyzer/core/Engine.js'
    ];
    Promise.all(secondaryEngines.map(engine => loadScript(engine)));
  };
  
  // Heavy engines with optimization
  window.loadHeavyEngines = async function() {
    const heavyEngines = [
      '/js/os-analyzer/core/TripleOSEngine.js',
      '/js/os-analyzer/core/UltraAnalysisEngine.js'
    ];
    Promise.all(heavyEngines.map(engine => loadScript(engine)));
    window.heavyEnginesLoaded = true;
  };
}

// 🚀 高速初期化: 基本 UI を即座表示
function showAppInterface() {
  const welcomeContainer = document.getElementById('welcome-container');
  if (welcomeContainer) {
    welcomeContainer.style.display = 'flex';
    welcomeContainer.style.opacity = '1';
  }
}

// アプリケーション初期化
document.addEventListener("DOMContentLoaded", async function () {
  console.log("📱 DOM loaded, initializing components...");
  
  // 🚀 即座UI表示
  showAppInterface();
  
  console.log("📱 Initializing components...");

  try {
    // 🚀 超軽量マネージャー初期化
    storageManager = new MicroStorageManager();

    // セッション情報の確認と初期化
    let session = storageManager.getSession();
    if (!session) {
      session = storageManager.startNewSession();
      console.log("🎆 New session started:", session);
    } else {
      console.log("🔄 Existing session found:", session);
      storageManager.updateSession({ stage: "loading" });
    }

    // 🚀 超軽量データマネージャー初期化
    console.log("⚡ MicroDataManager初期化開始");
    const dataManager = new MicroDataManager();

    console.log("⚡ 設問データ読み込み開始");
    
    // 軽量データ読み込み（高速）
    const loadSuccess = dataManager.loadQuestions();
    if (loadSuccess) {
      console.log("⚡ 設問データ読み込み完了");
    } else {
      console.warn("⚠️ フォールバック設問を使用");
    }

    // 基本統計表示
    const stats = dataManager.getBasicStats();
    console.log("📊 軽量データ統計:", stats);

    // 設問データの基本検証
    const validation = dataManager.validateData();
    if (!validation.isValid) {
      console.warn("⚠️ 設問データに問題:", validation.errors);
    }

    // Phase 2 Optimization: Analysis engines loaded on-demand only
    let engine = null;
    console.log('🎯 Analysis engines will be loaded dynamically when needed (Bundle optimization)');

    // Welcome Screen 初期化
    console.log("🔍 [App.js] WelcomeScreen初期化開始");
    const welcomeScreen = new WelcomeScreen("welcome-container", {
      onStart: async function () {
        console.log("🚀 Starting real diagnosis flow...");
        startRealDiagnosis();
      },
    });
    console.log("🔍 [App.js] WelcomeScreen初期化完了");

    // WelcomeScreenを表示
    console.log("🔍 [App.js] WelcomeScreen表示開始");

    // まず初期化を実行
    welcomeScreen.init();
    console.log("🔍 [App.js] WelcomeScreen.init()完了");

    welcomeScreen.show();
    console.log("✅ [App.js] WelcomeScreen表示完了");

    // デバッグ: コンテナの内容を確認
    const container = document.getElementById("welcome-container");
    console.log(
      "🔍 [App.js] WelcomeContainer内容:",
      container.innerHTML.length > 0 ? "コンテンツあり" : "空"
    );

    // 🌉 BridgeStorageManagerを使用したHaQei統合
    console.log("🌉 Creating BridgeStorageManager with HaQei philosophy...");
    const bridgeStorageManager = new BridgeStorageManager(storageManager);
    
    // アプリケーション情報をグローバルに保存
    app = {
      storageManager: bridgeStorageManager,
      dataManager,
      engine,
      welcomeScreen,
    };

    // グローバル関数を定義
    window.app = app;
    window.loadScript = loadScript;
    window.loadAnalysisEngines = loadAnalysisEngines;

    // セッションステージを更新
    storageManager.updateSession({ stage: "welcome" });

    console.log("✅ All components initialized successfully");
    console.log("📋 Ready for diagnosis!");

    // 以前の進行状況をチェック
    checkPreviousProgress();
  } catch (error) {
    // 統一エラーハンドラーを使用
    if (window.UnifiedErrorHandler) {
      window.UnifiedErrorHandler.handleError(error, {
        source: 'app-initialization',
        component: 'main-app',
        critical: true
      });
    } else {
      console.error("❌ [App.js] Initialization failed:", error);
      console.error("❌ [App.js] Error stack:", error.stack);
    }

    // エラーの詳細情報を収集
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      scriptLoadingStatus: window.scriptLoadingStatus || null,
      globalDataAvailable: {
        HAQEI_DATA: typeof window.HAQEI_DATA !== "undefined",
        WORLDVIEW_QUESTIONS: typeof window.WORLDVIEW_QUESTIONS !== "undefined",
        SCENARIO_QUESTIONS: typeof window.SCENARIO_QUESTIONS !== "undefined",
        H64_8D_VECTORS: typeof window.H64_8D_VECTORS !== "undefined",
      },
    };

    console.error("❌ [App.js] Error details:", errorInfo);

    if (storageManager) {
      storageManager.updateSession({
        stage: "error",
        lastError: error.message,
      });
    }

    // ユーザーフレンドリーなエラーメッセージの生成
    let userMessage = "アプリケーションの初期化に失敗しました。";

    if (error.message.includes("DataManager")) {
      userMessage =
        "データの読み込みに失敗しました。ページを再読み込みしてください。";
    } else if (error.message.includes("TripleOSEngine")) {
      userMessage =
        "診断エンジンの初期化に失敗しました。ページを再読み込みしてください。";
    } else if (error.message.includes("WelcomeScreen")) {
      userMessage =
        "画面の初期化に失敗しました。ページを再読み込みしてください。";
    }

    alert(userMessage + "\n\n詳細: " + error.message);
  }
});

// 診断テスト関数（未使用のためコメントアウト）
// async function startDiagnosisTest(engine) {
//   try {
//     console.log("🧪 Starting diagnosis test...");
//     // テスト用の回答データ（実際の設問形式）
//     const testAnswers = [
//       {
//         questionId: "q1",
//         selectedValue: "A",
//         scoring_tags: [
//           { key: "乾_創造性", value: 3.0 },
//           { key: "離_表現性", value: 1.5 },
//         ],
//       },
//       {
//         questionId: "q2",
//         selectedValue: "B",
//         scoring_tags: [
//           { key: "坎_探求性", value: 2.5 },
//           { key: "艮_安定性", value: 2.0 },
//         ],
//       },
//       {
//         questionId: "q3",
//         selectedValue: "A",
//         scoring_tags: [
//           { key: "乾_創造性", value: 3.0 },
//           { key: "離_表現性", value: 1.5 },
//         ],
//       },
//     ];

//     console.log("📝 Test answers:", testAnswers);

//     // 分析実行
//     const result = await engine.analyze(testAnswers);
//     console.log("🎯 Analysis result:", result);

//     // 洞察生成
//     const insights = await engine.generateInsights(result);
//     console.log("💡 Generated insights:", insights);

//     // 結果表示
//     alert(
//       `分析完了！\n\nあなたの人格OS: ${result.primaryOS.hexagramInfo.name}\n適合度: ${result.primaryOS.matchPercentage}%\n\n詳細はコンソールをご確認ください。`
//     );
//   } catch (error) {
//     console.error("❌ Diagnosis test failed:", error);
//     alert("診断テストに失敗しました: " + error.message);
//   }
// }

// 実際の診断フロー開始
async function startRealDiagnosis() {
  try {
    console.log("🚀 Starting diagnosis with Phase 2 optimization...");
    console.log("🔍 App object:", app);
    console.log("🔍 WelcomeScreen:", app.welcomeScreen);

    // セッションステージを更新
    app.storageManager.updateSession({ stage: "questions" });

    // Welcome画面を非表示
    console.log("👋 Hiding welcome screen...");
    app.welcomeScreen.hide();

    // 設問モード専用のスタイル適用（見切れ完全防止）
    document.body.classList.remove('welcome-active');
    document.body.classList.add('questions-active');
    
    // global-progressを強制的に非表示
    const globalProgress = document.querySelector('.global-progress');
    if (globalProgress) {
      globalProgress.style.setProperty('display', 'none', 'important');
      globalProgress.style.setProperty('visibility', 'hidden', 'important');
      globalProgress.style.setProperty('opacity', '0', 'important');
    }

    // 🎯 Phase 2: Load Question Bundle dynamically
    console.log("📦 Loading Question Bundle with ModuleLoader...");
    
    try {
      // Load question bundle if ModuleLoader is available
      if (window.loadQuestionBundle) {
        await window.loadQuestionBundle();
        console.log("✅ Question Bundle loaded successfully");
      } else {
        console.log("🔄 Loading question components individually...");
        // Fallback loading for essential question components
        Promise.all([
          // loadScript('/js/shared/data/questions.js'), // Disabled - using questions-full.js instead
          loadScript('/js/os-analyzer/core/PrecompiledQuestions.js'),
          loadScript('/js/os-analyzer/components/VirtualQuestionFlow-core.js'),
          loadScript('/js/os-analyzer/components/VirtualQuestionFlow-renderer.js'),
          loadScript('/js/os-analyzer/components/VirtualQuestionFlow-navigator.js'),
          loadScript('/js/os-analyzer/components/VirtualQuestionFlow-state.js'),
          loadScript('/js/os-analyzer/components/VirtualQuestionFlow-utils.js'),
          loadScript('/js/os-analyzer/components/VirtualQuestionFlow-v2.js')
        ]);
      }
      
      // Enable predictive loading for analysis
      if (window.enablePredictiveLoading) {
        window.enablePredictiveLoading('questions');
      }
      
    } catch (bundleError) {
      console.error("❌ Question Bundle loading failed:", bundleError);
      // Continue with existing components if available
    }

    // Virtual Question Flow を初期化（Phase 2 最適化版）
    console.log("⚡ Creating optimized VirtualQuestionFlow...");
    const questionFlow = new VirtualQuestionFlow("questions-container", {
      storageManager: app.storageManager,
      optimized: true, // Phase 2 optimization flag
      onProgress: debounce(function (progress) {
        console.log(`📊 Progress: ${progress.toFixed(1)}%`);
        document.documentElement.style.setProperty(
          "--progress",
          `${progress}%`
        );

        // 進行状況をストレージに保存（既にStorageManagerでデバウンス済み）
        app.storageManager.saveProgress({
          currentQuestionIndex: questionFlow.currentQuestionIndex,
          totalQuestions: questionFlow.questions.length,
          completedQuestions: questionFlow.answers.length,
          progressPercentage: progress,
        });
      }, 300),
      onComplete: function (answerData) {
        console.log("✅ All questions completed (Phase 2 optimized):", answerData);

        // 回答データの形式を確認
        let answersToSave, answersToAnalyze;

        if (answerData.originalAnswers && answerData.preparedAnswers) {
          // 新しい形式: オブジェクトに両方の回答データが含まれている
          answersToSave = answerData.originalAnswers;
          answersToAnalyze = answerData.preparedAnswers;
          console.log(
            "📊 Using prepared answers for analysis:",
            answersToAnalyze
          );
        } else {
          // 古い形式: 直接回答配列
          answersToSave = answerData;
          answersToAnalyze = answerData;
          console.log(
            "📊 Using original answers for analysis:",
            answersToAnalyze
          );
        }

        // 回答をストレージに保存
        app.storageManager.saveAnswers(answersToSave);
        app.storageManager.updateSession({ stage: "analysis" });

        // 分析処理に進む（Phase 2最適化）
        proceedToAnalysis(answersToAnalyze);
      },
    });
    questionFlow.init(); // ← ここで必ずinit()を呼ぶ

    console.log("✅ Optimized QuestionFlow created:", questionFlow);

    // Questions画面を表示
    console.log("📺 Showing questions screen...");
    questionFlow.show();

    // アプリに保存
    app.questionFlow = questionFlow;
    console.log("💾 QuestionFlow saved to app (Phase 2 optimized)");
  } catch (error) {
    console.error("❌ Real diagnosis failed:", error);
    console.error("Error stack:", error.stack);
    app.storageManager.updateSession({
      stage: "error",
      lastError: error.message,
    });
    alert("診断開始に失敗しました: " + error.message);
  }
}

// 分析処理に進む
async function proceedToAnalysis(answers) {
  try {
    console.log("🔬 Analysis process starting...");
    app.storageManager.updateSession({ stage: "analysis" });

    if (app.questionFlow) {
      await app.questionFlow.hide();
    }
    
    // 🎯 Phase 2: ModuleLoader-based engine loading
    if (!window.heavyEnginesLoaded) {
      console.log("🚀 Loading analysis engines with bundle optimization...");
      
      if (window.loadAnalysisBundle) {
        await window.loadAnalysisBundle();
      } else if (window.loadHeavyEngines) {
        await window.loadHeavyEngines();
      }
    }

    // 🎯 Phase 2 Optimization: ModuleLoader-based dynamic loading
    if (!app.fullSystemLoaded) {
      console.log("🚀 Loading analysis system using ModuleLoader optimization...");
      
      try {
        // Load analysis bundle with all required engines
        if (window.loadAnalysisBundle) {
          const analysisModules = await window.loadAnalysisBundle();
          console.log("📦 Analysis bundle loaded successfully");
        } else {
          // Fallback to individual module loading
          console.log("🔄 Using fallback module loading");
          await loadScript('/js/shared/core/StorageManager.js');
          await loadScript('/js/shared/core/DataManager.js');
          await loadScript('/js/shared/core/ErrorHandler.js');
          await loadScript('/js/shared/data/vectors.js');
        }
        
        // Progressive data manager with optimization
        if (!window.progressiveDataManager) {
          await loadScript('/js/shared/core/ProgressiveDataManager.js');
          window.progressiveDataManager = new ProgressiveDataManager();
          
          // Load only essential data for analysis
          await window.progressiveDataManager.loadRequiredData({
            hexagrams: true,
            hexagramId: answers[0]?.hexagramId || 1,
            minimal: true // Phase 2: Load minimal dataset
          });
          
          // Background loading of remaining data
          setTimeout(() => {
            window.progressiveDataManager.loadAllDataProgressively();
          }, 2000);
        }
        
        // Initialize managers with optimized loading
        const fullStorageManager = new StorageManager();
        const fullDataManager = new DataManager();
        
        // 🌉 Optimized BridgeStorageManager integration
        console.log("🌉 Integrating optimized storage system...");
        
        // Load data with caching optimization
        await fullDataManager.loadData({ useCache: true, minimal: true });
        
        // BridgeStorageManager integration with error handling
        try {
          const integrationSuccess = await app.storageManager.integrateFullManager(StorageManager);
          
          if (integrationSuccess) {
            console.log("✅ Optimized BridgeStorageManager integration successful");
          } else {
            throw new Error("Integration failed");
          }
        } catch (integrationError) {
          console.warn("⚠️ Using fallback storage integration:", integrationError);
          // Optimized fallback with data migration
          const microAnswers = app.storageManager.getAnswers();
          const microSession = app.storageManager.getSession();
          
          fullStorageManager.saveAnswers(microAnswers);
          fullStorageManager.saveSession(microSession);
          app.storageManager = fullStorageManager;
        }
        
        app.dataManager = fullDataManager;
        app.engine = new UltraAnalysisEngine(fullDataManager);
        app.fullSystemLoaded = true;
        
        console.log("✅ Optimized analysis system loaded (Phase 2)");
        
        // Predictive preloading for results
        if (window.moduleLoader) {
          window.moduleLoader.preloadModule('/js/components/TripleOSResultsView.js', 'high');
          console.log("🔄 Preloading results components...");
        }
        
      } catch (error) {
        console.error("❌ Optimized loading failed, using fallback:", error);
        // Fallback to original loading logic
        await loadScript('/js/shared/core/StorageManager.js');
        await loadScript('/js/shared/core/DataManager.js');
        
        const fullStorageManager = new StorageManager();
        const fullDataManager = new DataManager();
        await fullDataManager.loadData();
        
        app.storageManager = fullStorageManager;
        app.dataManager = fullDataManager;
        app.engine = new UltraAnalysisEngine(fullDataManager);
        app.fullSystemLoaded = true;
      }
    }

    // 1. 分析タスクを関数として定義
    const analysisTask = async () => {
      const result = await app.engine.analyzeTripleOS(answers);
      const insights = await app.engine.generateInsights(result);
      app.storageManager.saveAnalysisResult(result);
      app.storageManager.saveInsights(insights);
      app.storageManager.updateSession({ stage: "results" });
      return { result, insights }; // 結果をオブジェクトで返す
    };

    // 2. AnalysisViewに「分析タスク」と「完了後の処理」を渡して生成
    const analysisView = new AnalysisView("analysis-container", {
      analysisTask: analysisTask,
      onComplete: (data) => {
        console.log(
          "🎊 Animation and Analysis complete. Transitioning to results."
        );
        if (data.error) {
          alert(data.error); // エラーがあれば表示
        } else {
          showResultsView(data.result, data.insights);
        }
      },
    });

    // 3. AnalysisViewを表示し、プロセスを開始させる
    showAnalysisView(analysisView);
  } catch (error) {
    console.error("❌ A critical error occurred in proceedToAnalysis:", error);
    alert("分析プロセスを開始できませんでした: " + error.message);
  }
}

// 以前の進行状況をチェック
async function checkPreviousProgress() {
  const session = app.storageManager.getSession();
  const progress = app.storageManager.getProgress();
  const answers = app.storageManager.getAnswers();

  if (session && progress && answers.length > 0) {
    const shouldResume = confirm(
      `前回の診断が途中で終了されています。\n` +
        `進行状況: ${progress.completedQuestions}/${progress.totalQuestions}問完了\n` +
        `続きから始めますか？\n\n` +
        `「OK」: 続きから開始\n` +
        `「キャンセル」: 最初からやり直し`
    );

    if (shouldResume) {
      await resumePreviousSession();
    } else {
      app.storageManager.startNewSession();
    }
  }
}

// 前回のセッションを再開
async function resumePreviousSession() {
  try {
    const session = app.storageManager.getSession();
    const progress = app.storageManager.getProgress();
    const answers = app.storageManager.getAnswers();
    const analysisResult = app.storageManager.getAnalysisResult();
    const insights = app.storageManager.getInsights();

    console.log("🔄 Resuming previous session:", session);

    switch (session.stage) {
      case "questions":
        // 質問画面を再開
        startRealDiagnosis();
        if (app.questionFlow) {
          app.questionFlow.currentQuestionIndex =
            progress.currentQuestionIndex || 0;
          app.questionFlow.answers = answers || [];
          app.questionFlow.render();
        }
        break;

      case "analysis":
        // 分析を再実行
        proceedToAnalysis(answers);
        break;

      case "results":
        // 結果画面を表示
        if (analysisResult && insights) {
          showResultsView(analysisResult, insights);
        } else {
          proceedToAnalysis(answers);
        }
        break;

      default:
        // デフォルトはウェルカム画面
        app.storageManager.updateSession({ stage: "welcome" });
        break;
    }
  } catch (error) {
    console.error("❌ Resume failed:", error);
    app.storageManager.startNewSession();
  }
}

// 分析画面を表示
// AnalysisViewを表示するためのシンプルなヘルパー関数
function showAnalysisView(viewInstance) {
  hideAllScreens();
  app.analysisView = viewInstance;
  app.analysisView.show(); // ここで非同期の分析とアニメーションが開始される
}

// 結果画面を表示（Phase 2最適化版：動的ローディング + データ永続化強化）
async function showResultsView(result, insights) {
  console.log("✅ [App] Phase 2最適化結果表示開始");
  
  try {
    // 🎯 Phase 2: Load Results Bundle dynamically
    console.log("📦 Loading Results Bundle...");
    
    if (window.loadResultsBundle) {
      await window.loadResultsBundle();
      console.log("✅ Results Bundle loaded successfully");
    } else {
      console.log("🔄 Loading results components individually...");
      // Fallback loading for results components
      Promise.all([
        loadScript('/js/components/TripleOSResultsView.js'),
        loadScript('/js/os-analyzer/components/ResultsView.js'),
        loadScript('/js/lib/chart.min.js')
      ]);
    }
    
    // データ存在確認
    if (!result || !insights) {
      throw new Error('分析結果またはインサイトが見つかりません');
    }
    
    // データ構造を確認
    console.log("🔍 [App] データ構造確認:", {
      result: result,
      hasEngineOS: !!result?.engineOS,
      hasInterfaceOS: !!result?.interfaceOS,
      hasSafeModeOS: !!result?.safeModeOS,
      hasPrimaryOS: !!result?.primaryOS,
      analysisType: result?.analysisType
    });

    // 🎭 Virtual Persona Results View を優先的に使用
    if (result.engineOS && result.interfaceOS && result.safeModeOS) {
      console.log("🎭 [App] Using VirtualPersonaResultsView for Triple OS results");
      return await showVirtualPersonaResultsView(result, insights);
    }

    // データ転送修正スクリプトを使用して確実に保存
    if (window.saveAnalysisResultForResults) {
      console.log("🔧 Using fix-data-transfer.js for reliable data saving");
      window.saveAnalysisResultForResults(result, insights);
    }
    
    // 分析結果とインサイトをストレージに保存（重複保存で確実性向上）
    const saveSuccess1 = app.storageManager.saveAnalysisResult(result);
    const saveSuccess2 = app.storageManager.saveInsights(insights);
    
    console.log("💾 [App] 保存結果:", { 
      analysisResult: saveSuccess1, 
      insights: saveSuccess2 
    });
    
    // セッション更新
    app.storageManager.updateSession({ 
      stage: "results",
      timestamp: new Date().toISOString(),
      dataSize: {
        resultKeys: Object.keys(result).length,
        insightKeys: Object.keys(insights).length
      }
    });
    
    // 保存確認（読み戻しテスト）
    const verifyResult = app.storageManager.getAnalysisResult();
    const verifyInsights = app.storageManager.getInsights();
    
    if (!verifyResult || !verifyInsights) {
      console.warn("⚠️ [App] データ保存検証失敗 - SimpleStorageManagerで再保存試行");
      
      // SimpleStorageManagerで確実に保存
      try {
        const simpleStorage = new SimpleStorageManager();
        
        if (!verifyResult) {
          const simpleResult = simpleStorage.saveAnalysisResult(result);
          console.log(`📦 [App] SimpleStorageManager分析結果保存: ${simpleResult ? '成功' : '失敗'}`);
        }
        
        if (!verifyInsights) {
          const simpleInsights = simpleStorage.saveInsights(insights);
          console.log(`📦 [App] SimpleStorageManagerインサイト保存: ${simpleInsights ? '成功' : '失敗'}`);
        }
      } catch (simpleError) {
        console.error("❌ [App] SimpleStorageManager保存エラー:", simpleError);
        
        // 最終手段として直接localStorage保存
        localStorage.setItem('haqei_analysis_result', JSON.stringify({
          result: result,
          timestamp: Date.now(),
          version: '2025.08.01'
        }));
        
        localStorage.setItem('haqei_insights', JSON.stringify({
          insights: insights,
          timestamp: Date.now(),
          version: '2025.08.01'
        }));
      }
    }
    
    console.log("💾 [App] 分析結果をストレージに保存完了");

    // LocalStorage状態の最終確認
    const storageCheck = {
      hasAnalysisResult: !!localStorage.getItem('haqei_analysis_result'),
      hasInsights: !!localStorage.getItem('haqei_insights'),
      hasSession: !!localStorage.getItem('haqei_session'),
      storageKeys: Object.keys(localStorage).filter(k => k.includes('haqei')).length
    };
    
    console.log("🔍 [App] LocalStorage確認:", storageCheck);

    // results.htmlへの遷移
    console.log("🔄 [App] results.htmlへページ遷移中...");
    
    // 小さな遅延を追加してlocalStorageの永続化を確実にする
    setTimeout(() => {
      window.location.href = 'results.html';
    }, 100);
    
  } catch (error) {
    console.error("❌ [App] 結果表示でエラー:", error);
    console.error("❌ [App] エラースタック:", error.stack);
    
    // エラー時の緊急保存 - セキュア版
    try {
      const emergencyData = {
        result: result ? {
          analysisType: result.analysisType,
          timestamp: result.timestamp,
          primaryOS: result.primaryOS?.name || 'unknown'
        } : null,
        insights: insights ? {
          summary: insights.summary || 'N/A',
          timestamp: insights.timestamp
        } : null,
        error: {
          message: error.message,
          type: error.name,
          timestamp: Date.now(),
          userAgent: navigator.userAgent.slice(0, 100)
        }
      };
      
      localStorage.setItem('haqei_emergency_result', JSON.stringify(emergencyData));
      console.log("🚨 [App] 緊急データ保存完了 (セキュア版)");
    } catch (emergencyError) {
      console.error("❌ [App] 緊急保存も失敗:", emergencyError);
      // 最終手段: IndexedDBに保存
      if ('indexedDB' in window) {
        try {
          const request = indexedDB.open('haqei_emergency', 1);
          request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['emergency'], 'readwrite');
            const store = transaction.objectStore('emergency');
            store.put({ id: Date.now(), data: emergencyData });
          };
        } catch (idbError) {
          console.error("❌ [App] IndexedDB緊急保存も失敗:", idbError);
        }
      }
    }
    
    // エラー時もresults.htmlへ遷移
    console.log("⚠️ エラーが発生しましたが、results.htmlに遷移します");
    setTimeout(() => {
      window.location.href = 'results.html';
    }, 200);
  }
}

// ページ遷移処理完了

// TripleOS結果専用の表示関数
async function showTripleOSResultsView(result, insights) {
  try {
    const compatibilityLoader = new CompatibilityDataLoader();
    const dataManager = app.dataManager;

    const optionsToPass = {
      analysisResult: result,
      insights: insights,
      compatibilityLoader: compatibilityLoader,
      dataManager: dataManager,
    };

    console.log("🕵️‍♂️ [App] TripleOSStrategicViewを生成します...", optionsToPass);
    
    // 戦略ダッシュボードインスタンスを生成
    app.resultsView = new TripleOSStrategicView("results-container", optionsToPass);

    // 初期化とレンダリングを実行
    await app.resultsView.init();
    await app.resultsView.show();
    
    // results-containerにvisibleクラスを確実に追加
    const resultsContainer = document.getElementById("results-container");
    if (resultsContainer) {
      resultsContainer.classList.add("visible");
      resultsContainer.style.setProperty('display', 'flex', 'important');
      resultsContainer.style.setProperty('position', 'fixed', 'important');
      resultsContainer.style.setProperty('top', '0', 'important');
      resultsContainer.style.setProperty('left', '0', 'important');
      resultsContainer.style.setProperty('width', '100vw', 'important');
      resultsContainer.style.setProperty('height', '100vh', 'important');
      resultsContainer.style.setProperty('z-index', '30000', 'important');
      
      const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const backgroundGradient = isDarkMode ? 
        'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' : 
        'linear-gradient(135deg, #1e293b 0%, #334155 100%)';
      const textColor = isDarkMode ? '#ffffff' : '#f1f5f9';
      
      resultsContainer.style.setProperty('background', backgroundGradient, 'important');
      resultsContainer.style.setProperty('color', textColor, 'important');
      resultsContainer.style.setProperty('opacity', '1', 'important');
      resultsContainer.style.setProperty('visibility', 'visible', 'important');
      resultsContainer.style.setProperty('overflow-y', 'auto', 'important');
      resultsContainer.style.setProperty('padding', '20px', 'important');
    }
    
    console.log("✅ [App] TripleOS結果表示完了");
    
  } catch (error) {
    console.error("❌ [App] TripleOS結果表示でエラー:", error);
    throw error; // 上位でフォールバック処理される
  }
}

// 単一OS結果専用の表示関数
async function showSingleOSResultsView(result, insights) {
  try {
    // ResultsViewを作成して表示
    app.resultsView = new ResultsView("results-container", {
      onExploreMore: function(analysisResult) {
        showInsightPanel(analysisResult, insights);
      },
      onRetakeTest: function() {
        window.location.reload();
      }
    });

    // データを設定してレンダリング
    app.resultsView.setData(result, insights);
    await app.resultsView.show();
    
    console.log("✅ [App] 単一OS結果表示完了");
    
  } catch (error) {
    console.error("❌ [App] 単一OS結果表示でエラー:", error);
    throw error; // 上位でフォールバック処理される
  }
}

// フォールバック：従来の同一ページ内結果表示
async function showResultsViewFallback(result, insights) {
  console.log("🔄 [App] フォールバック：従来方式で結果表示");
  
  // analysis-containerを確実に隠す
  const analysisContainer = document.getElementById("analysis-container");
  if (analysisContainer) {
    analysisContainer.style.setProperty('display', 'none', 'important');
    analysisContainer.classList.remove('visible');
    analysisContainer.style.opacity = '0';
  }
  
  hideAllScreens();

  const compatibilityLoader = new CompatibilityDataLoader();
  const dataManager = app.dataManager;

  const optionsToPass = {
    analysisResult: result,
    insights: insights,
    compatibilityLoader: compatibilityLoader,
    dataManager: dataManager,
  };

  console.log(
    "🕵️‍♂️ [TRACE-CHECKPOINT 2] TripleOSStrategicViewを生成します...",
    optionsToPass
  );
  try {
    // 戦略ダッシュボードインスタンスを生成
    app.resultsView = new TripleOSStrategicView("results-container", optionsToPass);

    // 初期化とレンダリングを実行
    await app.resultsView.init();
    await app.resultsView.show();
    
    // results-containerにvisibleクラスを確実に追加
    const resultsContainer = document.getElementById("results-container");
    if (resultsContainer) {
      resultsContainer.classList.add("visible");
      resultsContainer.style.setProperty('display', 'flex', 'important');
      resultsContainer.style.setProperty('position', 'fixed', 'important');
      resultsContainer.style.setProperty('top', '0', 'important');
      resultsContainer.style.setProperty('left', '0', 'important');
      resultsContainer.style.setProperty('width', '100vw', 'important');
      resultsContainer.style.setProperty('height', '100vh', 'important');
      resultsContainer.style.setProperty('z-index', '30000', 'important');
      
      const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const backgroundGradient = isDarkMode ? 
        'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' : 
        'linear-gradient(135deg, #1e293b 0%, #334155 100%)';
      const textColor = isDarkMode ? '#ffffff' : '#f1f5f9';
      
      resultsContainer.style.setProperty('background', backgroundGradient, 'important');
      resultsContainer.style.setProperty('color', textColor, 'important');
      resultsContainer.style.setProperty('opacity', '1', 'important');
      resultsContainer.style.setProperty('visibility', 'visible', 'important');
      resultsContainer.style.setProperty('overflow-y', 'auto', 'important');
      resultsContainer.style.setProperty('padding', '20px', 'important');
    }
    
    console.log("✅ [App] フォールバック結果表示完了");
    
  } catch (error) {
    console.error("❌ [App] フォールバック表示も失敗:", error);
    const container = document.getElementById("results-container");
    if (container) {
      container.style.display = "block";
      container.innerHTML = '<div class="error-text">結果の表示中にエラーが発生しました。ページをリロードしてください。</div>';
    }
  }
}

// 洞察パネルを表示
function showInsightPanel(analysisResult, insights) {
  hideAllScreens();

  const insightPanel = new InsightPanel("insights-container", {
    onBack: function () {
      showResultsView(analysisResult, insights);
    },
    onGenerateReport: function (result, insights) {
      generateReport(result, insights);
    },
  });

  insightPanel.setData(analysisResult, insights);
  insightPanel.show();
  app.insightPanel = insightPanel;
}

// 全ての画面を非表示
function hideAllScreens() {
  const screens = [
    "welcome-container",
    "questions-container", 
    "analysis-container",
    "results-container",
    "insights-container",
  ];
  screens.forEach((screenId) => {
    const screen = document.getElementById(screenId);
    if (screen) {
      // 🔧 CRITICAL FIX: setProperty with important flagを使用
      screen.style.setProperty('display', 'none', 'important');
      screen.style.setProperty('opacity', '0', 'important');
      screen.classList.remove("visible"); // !importantに対抗するためクラスも削除
      console.log(`🔧 [hideAllScreens] ${screenId} forcibly hidden`);
    }
  });
}

// 🎭 Virtual Persona Results View を表示
async function showVirtualPersonaResultsView(result, insights) {
  try {
    console.log("🎭 [App] Virtual Persona Results View 表示開始");
    
    // 既存のコンテナを非表示
    hideAllScreens();
    
    // results-container を確保
    let resultsContainer = document.getElementById("results-container");
    if (!resultsContainer) {
      resultsContainer = document.createElement("div");
      resultsContainer.id = "results-container";
      resultsContainer.className = "screen-container";
      document.body.appendChild(resultsContainer);
    }
    
    // VirtualPersonaResultsView を初期化
    const virtualPersonaView = new VirtualPersonaResultsView("results-container", {
      analysisResult: result,
      insights: insights
    });
    
    // 初期化と表示
    const initSuccess = await virtualPersonaView.init();
    if (initSuccess) {
      await virtualPersonaView.show();
      app.virtualPersonaView = virtualPersonaView;
      console.log("✅ [App] VirtualPersonaResultsView表示完了");
    } else {
      throw new Error("VirtualPersonaResultsView初期化失敗");
    }
    
  } catch (error) {
    console.error("❌ [App] VirtualPersonaResultsView表示失敗:", error);
    // フォールバック処理
    return await showResultsViewFallback(result, insights);
  }
}

// レポート生成
function generateReport(analysisResult, insights) {
  const reportData = {
    timestamp: new Date().toISOString(),
    analysisResult: analysisResult,
    insights: insights,
    session: app.storageManager.getSession(),
  };

  const reportJson = JSON.stringify(reportData, null, 2);
  const blob = new Blob([reportJson], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `haqei_analysis_${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log("📊 Report generated and downloaded");
}

// TripleOSレポート生成
