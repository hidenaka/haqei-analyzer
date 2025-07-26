// HaQei Analyzer - Main Application
console.log("🎯 HaQei Analyzer starting...");

let app = null;
let storageManager = null;

// 拡張スクリプトローディングシステムの完了を待機する関数（無効化）
// 注意: 現在はより高機能な読み込みチェック機構 (LoadingCheck) を使用しているため
// この古い機能はコメントアウトしました
// async function waitForScriptLoadingComplete() {
//   return new Promise((resolve) => {
//     const checkInterval = setInterval(() => {
//       if (
//         window.scriptLoadingStatus &&
//         window.scriptLoadingStatus.initializationComplete
//       ) {
//         clearInterval(checkInterval);
//         console.log("✅ [App.js] スクリプト読み込み完了確認");
//         resolve();
//       }
//     }, 50);

//     // 10秒後にタイムアウト
//     setTimeout(() => {
//       clearInterval(checkInterval);
//       console.warn(
//         "⚠️ [App.js] スクリプト読み込み完了待機がタイムアウトしました"
//       );
//       resolve(); // タイムアウトでも続行
//     }, 10000);
//   });
// }

// アプリケーション初期化
document.addEventListener("DOMContentLoaded", async function () {
  console.log("📱 DOM loaded, initializing components...");

  // 注意: waitForScriptLoadingComplete の呼び出しをコメントアウト
  // より高機能な読み込みチェック機構 (LoadingCheck) が自動で処理します
  // await waitForScriptLoadingComplete();

  console.log("📱 Initializing components...");

  try {
    // ストレージマネージャー初期化
    storageManager = new StorageManager();
    storageManager.setupAutoSave();

    // セッション情報の確認と初期化
    let session = storageManager.getSession();
    if (!session) {
      session = storageManager.startNewSession();
      console.log("🎆 New session started:", session);
    } else {
      console.log("🔄 Existing session found:", session);
      storageManager.updateSession({ stage: "loading" });
    }

    // データマネージャー初期化
    console.log("🔍 [App.js] DataManager初期化開始");
    const dataManager = new DataManager();

    console.log("🔍 [App.js] DataManager.loadData()実行開始");

    // データ読み込みにタイムアウトを設定（15秒）
    const dataLoadingPromise = dataManager.loadData();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("データ読み込みがタイムアウトしました（15秒）"));
      }, 15000);
    });

    try {
      await Promise.race([dataLoadingPromise, timeoutPromise]);
      console.log("🔍 [App.js] DataManager.loadData()完了");
    } catch (error) {
      console.warn("⚠️ [App.js] データ読み込み警告:", error.message);
      console.log("🔍 [App.js] 利用可能なデータで続行します");
    }

    // データ統計表示
    const stats = dataManager.getDataStats();
    console.log("📊 [App.js] Data stats:", stats);

    // 重要なデータ内容の検証
    console.log("🔍 [App.js] データ内容検証:");
    console.log(
      "  - HAQEI_DATA:",
      typeof window.HAQEI_DATA,
      window.HAQEI_DATA ? Object.keys(window.HAQEI_DATA).length : 0
    );
    console.log(
      "  - H64_8D_VECTORS:",
      typeof window.H64_8D_VECTORS,
      window.H64_8D_VECTORS ? Object.keys(window.H64_8D_VECTORS).length : 0
    );
    console.log(
      "  - WORLDVIEW_QUESTIONS:",
      typeof window.WORLDVIEW_QUESTIONS,
      window.WORLDVIEW_QUESTIONS ? window.WORLDVIEW_QUESTIONS.length : 0
    );
    console.log(
      "  - SCENARIO_QUESTIONS:",
      typeof window.SCENARIO_QUESTIONS,
      window.SCENARIO_QUESTIONS ? window.SCENARIO_QUESTIONS.length : 0
    );

    // 詳細データ検証
    if (window.HAQEI_DATA) {
      console.log("🔍 [App.js] HAQEI_DATA詳細:", {
        hexagrams_master: window.HAQEI_DATA.hexagrams_master
          ? window.HAQEI_DATA.hexagrams_master.length
          : "missing",
        os_manual: window.HAQEI_DATA.os_manual
          ? Object.keys(window.HAQEI_DATA.os_manual).length
          : "missing",
      });
    }

    if (window.H64_8D_VECTORS) {
      const vectorKeys = Object.keys(window.H64_8D_VECTORS);
      console.log("🔍 [App.js] H64_8D_VECTORS詳細:", {
        totalHexagrams: vectorKeys.length,
        firstHexagram: vectorKeys[0],
        sampleVector: window.H64_8D_VECTORS[vectorKeys[0]],
      });
    }

    // 重要なデータの存在確認
    if (!stats.loaded) {
      console.error(
        "❌ [App.js] DataManagerの読み込みに失敗しました:",
        stats.error
      );
      throw new Error(`DataManager読み込みエラー: ${stats.error}`);
    }

    // 基本的なデータ検証
    if (stats.dataStructure.hexagrams === 0) {
      console.warn("⚠️ [App.js] 卦データが読み込まれていません");
    }

    if (stats.dataStructure.worldviewQuestions === 0) {
      console.warn("⚠️ [App.js] 価値観質問データが読み込まれていません");
    }

    // 診断エンジン初期化（TripleOSEngine使用）
    const engine = new TripleOSEngine(dataManager);

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

    // アプリケーション情報をグローバルに保存
    app = {
      storageManager,
      dataManager,
      engine,
      welcomeScreen,
    };

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

    // Question Flow を初期化
    console.log("❓ Creating QuestionFlow...");
    const questionFlow = new QuestionFlow("questions-container", {
      storageManager: app.storageManager,
      onProgress: function (progress) {
        console.log(`📊 Progress: ${progress.toFixed(1)}%`);
        document.documentElement.style.setProperty(
          "--progress",
          `${progress}%`
        );

        // 進行状況をストレージに保存
        app.storageManager.saveProgress({
          currentQuestionIndex: questionFlow.currentQuestionIndex,
          totalQuestions: questionFlow.questions.length,
          completedQuestions: questionFlow.answers.length,
          progressPercentage: progress,
        });
      },
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

// 結果画面を表示（新設計：別ページにリダイレクト）
async function showResultsView(result, insights) {
  console.log("✅ [App] 結果表示：別ページへリダイレクト開始");
  
  try {
    // 分析結果とインサイトをストレージに保存（results.htmlで読み込み用）
    app.storageManager.saveAnalysisResult(result);
    app.storageManager.saveInsights(insights);
    app.storageManager.updateSession({ stage: "results" });
    
    console.log("💾 [App] 分析結果をストレージに保存完了");
    console.log("🔄 [App] results.htmlにリダイレクトします...");
    
    // 別ページ（results.html）にリダイレクト
    window.location.href = 'results.html';
    
  } catch (error) {
    console.error("❌ [App] 結果ページへのリダイレクトに失敗:", error);
    
    // フォールバック：従来の同一ページ内表示
    console.log("🔄 [App] フォールバック：同一ページ内表示を実行");
    await showResultsViewFallback(result, insights);
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
