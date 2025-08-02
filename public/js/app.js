// HaQei Analyzer - Main Application
console.log("🎯 HaQei Analyzer starting...");

let app = null;
let storageManager = null;

// デバウンス関数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 動的スクリプト読み込み関数
async function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = (error) => {
      console.error(`❌ Failed to load script: ${src}`);
      console.error('Error details:', error);
      // DataManager.jsの場合は代替手段を試す
      if (src.includes('DataManager.js')) {
        console.log('⚠️ Trying fallback for DataManager.js...');
        // Service Workerを回避するためにタイムスタンプを追加
        const fallbackSrc = src + '?t=' + Date.now();
        const fallbackScript = document.createElement('script');
        fallbackScript.src = fallbackSrc;
        fallbackScript.onload = resolve;
        fallbackScript.onerror = reject;
        document.head.appendChild(fallbackScript);
      } else {
        reject(error);
      }
    };
    document.head.appendChild(script);
  });
}

/**
 * 分析エンジンとコンポーネントの動的読み込み
 * 
 * 目的：
 * - 分析に必要なすべてのエンジンとUIコンポーネントを読み込む
 * - 依存関係の順序を保証
 * 
 * 処理内容：
 * 1. 統計エンジン、計算機、互換性データローダーを読み込み
 * 2. コアエンジン（Engine, IChingUltraSyncLogic, TripleOSEngine）を読み込み
 * 3. 最終的な分析エンジン（UltraAnalysisEngine）を読み込み
 * 4. UI コンポーネント（AnalysisView）を読み込み
 * 
 * 注意事項：
 * - 読み込み順序は依存関係に基づいて設定されている
 * - AnalysisViewは分析プロセスの表示に必須
 */
async function loadAnalysisEngines() {
  const engines = [
    '/js/os-analyzer/core/StatisticalEngine.js',
    '/js/os-analyzer/core/Calculator.js', 
    '/js/os-analyzer/engines/CompatibilityDataLoader.js',
    '/js/os-analyzer/core/Engine.js',
    '/js/os-analyzer/core/IChingUltraSyncLogic.js',
    '/js/os-analyzer/core/TripleOSEngine.js',
    '/js/os-analyzer/core/UltraAnalysisEngine.js',
    // AnalysisViewコンポーネントも読み込む
    '/js/os-analyzer/components/AnalysisView.js'
  ];
  
  for (const engine of engines) {
    await loadScript(engine);
  }
  
  console.log("✅ All analysis engines and components loaded");
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
    const loadSuccess = await dataManager.loadQuestions();
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

    // 診断エンジンは設問完了後に動的読み込み
    let engine = null;
    console.log('⚡ UltraAnalysisEngine will be loaded dynamically after questions complete');

    // Welcome Screen 初期化
    console.log("🔍 [App.js] WelcomeScreen初期化開始");
    const welcomeScreen = new WelcomeScreen("welcome-container", {
      onStart: function () {
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

    await welcomeScreen.show();
    console.log("✅ [App.js] WelcomeScreen表示完了");

    // デバッグ: コンテナの内容を確認
    const container = document.getElementById("welcome-container");
    console.log(
      "🔍 [App.js] WelcomeContainer内容:",
      container.innerHTML.length > 0 ? "コンテンツあり" : "空"
    );

    // 🌉 BridgeStorageManagerを使用したbunenjin統合
    console.log("🌉 Creating BridgeStorageManager with bunenjin philosophy...");
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
    console.error("❌ [App.js] Initialization failed:", error);
    console.error("❌ [App.js] Error stack:", error.stack);

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
function startRealDiagnosis() {
  try {
    console.log("📝 Starting real diagnosis with full questions...");
    console.log("🔍 App object:", app);
    console.log("🔍 WelcomeScreen:", app.welcomeScreen);

    // セッションステージを更新
    app.storageManager.updateSession({ stage: "questions" });

    // Welcome画面を非表示
    console.log("👋 Hiding welcome screen...");
    app.welcomeScreen.hide();

    // Virtual Question Flow を初期化（超高速版）
    console.log("⚡ Creating VirtualQuestionFlow...");
    const questionFlow = new VirtualQuestionFlow("questions-container", {
      storageManager: app.storageManager,
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
        console.log("✅ All questions completed:", answerData);

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

        // 分析処理に進む
        proceedToAnalysis(answersToAnalyze);
      },
    });
    questionFlow.init(); // ← ここで必ずinit()を呼ぶ

    console.log("✅ QuestionFlow created:", questionFlow);

    // Questions画面を表示
    console.log("📺 Showing questions screen...");
    questionFlow.show();

    // アプリに保存
    app.questionFlow = questionFlow;
    console.log("💾 QuestionFlow saved to app");
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

    // 🚀 Level 1 ロード: 完全なシステムを動的読み込み
    if (!app.fullSystemLoaded) {
      console.log("⚡ Loading full system for analysis...");
      
      // 完全なStorageManagerとDataManagerを読み込み
      await loadScript('/js/shared/core/StorageManager.js');
      await loadScript('/js/shared/core/DataManager.js');
      await loadScript('/js/shared/core/ErrorHandler.js');
      await loadScript('/js/shared/data/vectors.js');
      await loadScript('/js/data/data_box.js');
      
      // 分析エンジン群を読み込み
      await loadAnalysisEngines();
      
      // 完全なマネージャーで置き換え
      const fullStorageManager = new StorageManager();
      const fullDataManager = new DataManager();
      
      // 🌉 bunenjin BridgeStorageManager統合
      console.log("🌉 Integrating full StorageManager with BridgeStorageManager...");
      
      // フルデータ読み込み
      await fullDataManager.loadData();
      
      // BridgeStorageManagerにフルStorageManagerを統合
      const integrationSuccess = await app.storageManager.integrateFullManager(StorageManager);
      
      if (integrationSuccess) {
        console.log("✅ BridgeStorageManager successfully integrated with full system");
      } else {
        console.warn("⚠️ BridgeStorageManager integration failed, using fallback");
        // フォールバック: データ移行
        const microAnswers = app.storageManager.getAnswers();
        const microSession = app.storageManager.getSession();
        
        fullStorageManager.saveAnswers(microAnswers);
        fullStorageManager.saveSession(microSession);
        
        // 直接置換（従来方式）
        app.storageManager = fullStorageManager;
      }
      app.dataManager = fullDataManager;
      app.engine = new UltraAnalysisEngine(fullDataManager);
      app.fullSystemLoaded = true;
      
      console.log("✅ Full system loaded and initialized");
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
function checkPreviousProgress() {
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
      resumePreviousSession();
    } else {
      app.storageManager.startNewSession();
    }
  }
}

// 前回のセッションを再開
function resumePreviousSession() {
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

// 結果画面を表示（修正版：データ永続化と検証を強化）
async function showResultsView(result, insights) {
  console.log("✅ [App] 結果表示開始");
  
  try {
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
    
    // エラー時の緊急保存
    try {
      localStorage.setItem('haqei_emergency_result', JSON.stringify({
        result: result,
        insights: insights,
        error: error.message,
        timestamp: Date.now()
      }));
      console.log("🚨 [App] 緊急データ保存完了");
    } catch (emergencyError) {
      console.error("❌ [App] 緊急保存も失敗:", emergencyError);
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
