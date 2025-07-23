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
    console.log("  - HAQEI_DATA:", typeof window.HAQEI_DATA, window.HAQEI_DATA ? Object.keys(window.HAQEI_DATA).length : 0);
    console.log("  - H64_8D_VECTORS:", typeof window.H64_8D_VECTORS, window.H64_8D_VECTORS ? Object.keys(window.H64_8D_VECTORS).length : 0);
    console.log("  - WORLDVIEW_QUESTIONS:", typeof window.WORLDVIEW_QUESTIONS, window.WORLDVIEW_QUESTIONS ? window.WORLDVIEW_QUESTIONS.length : 0);
    console.log("  - SCENARIO_QUESTIONS:", typeof window.SCENARIO_QUESTIONS, window.SCENARIO_QUESTIONS ? window.SCENARIO_QUESTIONS.length : 0);
    
    // 詳細データ検証
    if (window.HAQEI_DATA) {
      console.log("🔍 [App.js] HAQEI_DATA詳細:", {
        hexagrams_master: window.HAQEI_DATA.hexagrams_master ? window.HAQEI_DATA.hexagrams_master.length : 'missing',
        os_manual: window.HAQEI_DATA.os_manual ? Object.keys(window.HAQEI_DATA.os_manual).length : 'missing'
      });
    }
    
    if (window.H64_8D_VECTORS) {
      const vectorKeys = Object.keys(window.H64_8D_VECTORS);
      console.log("🔍 [App.js] H64_8D_VECTORS詳細:", {
        totalHexagrams: vectorKeys.length,
        firstHexagram: vectorKeys[0],
        sampleVector: window.H64_8D_VECTORS[vectorKeys[0]]
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
    await welcomeScreen.show();
    console.log("✅ [App.js] WelcomeScreen表示完了");

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
          console.log("📊 Using prepared answers for analysis:", answersToAnalyze);
        } else {
          // 古い形式: 直接回答配列
          answersToSave = answerData;
          answersToAnalyze = answerData;
          console.log("📊 Using original answers for analysis:", answersToAnalyze);
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
    console.log("🔬 Proceeding to analysis with answers:", answers);

    // セッションステージを更新
    app.storageManager.updateSession({ stage: "analysis" });

    // 分析画面を表示
    showAnalysisView();

    // Questions画面を非表示
    if (app.questionFlow) {
      await app.questionFlow.hide();
    }

    // 実際の分析を実行（TripleOS分析）
    console.log("🔬 [App] 分析開始 - answers:", answers.length, "個");
    
    let result, insights;
    try {
      result = await app.engine.analyzeTripleOS(answers);
      console.log("🔬 [App] 分析結果:", result);
      
      if (!result || !result.engineOS) {
        console.error("❌ [App] 分析結果が不正:", result);
        throw new Error("分析結果が生成されませんでした");
      }
      
      insights = await app.engine.generateInsights(result);
      console.log("🔬 [App] 洞察生成完了:", insights);
      
    } catch (analysisError) {
      console.error("❌ [App] 分析処理エラー:", analysisError);
      
      // フォールバック結果を生成
      result = {
        engineOS: { hexagramId: 1, strength: 50, properties: {} },
        interfaceOS: { hexagramId: 1, strength: 50, properties: {} },
        safeModeOS: null,
        consistencyScore: 0.5
      };
      insights = { summary: "分析処理中にエラーが発生しました。", details: [] };
    }

    console.log("🎯 Analysis completed:", result);
    console.log("💡 Insights generated:", insights);

    // 結果をストレージに保存
    app.storageManager.saveAnalysisResult(result);
    app.storageManager.saveInsights(insights);
    app.storageManager.updateSession({ stage: "results" });

    // 結果画面を表示
    showResultsView(result, insights);
  } catch (error) {
    console.error("❌ Analysis failed:", error);
    app.storageManager.updateSession({
      stage: "error",
      lastError: error.message,
    });
    alert("分析処理でエラーが発生しました: " + error.message);
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
function showAnalysisView() {
  hideAllScreens();

  const analysisView = new AnalysisView("analysis-container", {
    onAnalysisComplete: function () {
      console.log("🎊 Analysis view completed");
    },
  });

  analysisView.show();
  app.analysisView = analysisView;
}

// 結果画面を表示
function showResultsView(result, insights) {
    console.log("✅ [App] 結果ビュー表示プロセスを開始します。");
    hideAllScreens();
    
    const compatibilityLoader = new CompatibilityDataLoader();

    // これから渡すオプションオブジェクトを定義
    const optionsToPass = {
        analysisResult: result,
        insights: insights,
        compatibilityLoader: compatibilityLoader,
        dataManager: app.dataManager
    };

    // ★★★ 観測所 ★★★
    console.log("🕵️‍♂️ [TRACE-CHECKPOINT 2] TripleOSResultsViewを生成する直前のオプション内容を検証します。", optionsToPass);
    console.log(" -> compatibilityLoaderは有効なインスタンスか？:", optionsToPass.compatibilityLoader instanceof CompatibilityDataLoader);
    
    // TripleOSResultsViewのインスタンスを生成
    app.resultsView = new TripleOSResultsView('results-container', optionsToPass);
    app.resultsView.render();
    
    // BaseComponentのshow()メソッドを使用して正しく表示
    app.resultsView.show();
    console.log("✅ [App] 結果ビューのコンテナ表示が完了しました。");
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
      screen.style.display = "none";
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
function generateTripleOSReport(analysisResult) {
  const reportData = {
    timestamp: new Date().toISOString(),
    analysisType: "tripleOS",
    engineOS: {
      name: analysisResult.engineOS.hexagramInfo.name,
      hexagramId: analysisResult.engineOS.hexagramId,
      strength: analysisResult.engineOS.strength,
      dominantTrigrams: analysisResult.engineOS.dominantTrigrams,
      userVector: analysisResult.engineOS.userVector,
    },
    interfaceOS: {
      name: analysisResult.interfaceOS.hexagramInfo.name,
      hexagramId: analysisResult.interfaceOS.hexagramId,
      matchScore: analysisResult.interfaceOS.matchScore,
      keywordMatches: analysisResult.interfaceOS.keywordMatches,
    },
    safeModeOS: {
      name: analysisResult.safeModeOS.hexagramInfo.name,
      hexagramId: analysisResult.safeModeOS.hexagramId,
      matchScore: analysisResult.safeModeOS.matchScore,
      lineMatches: analysisResult.safeModeOS.lineMatches,
    },
    consistencyScore: analysisResult.consistencyScore,
    integration: analysisResult.integration,
    session: app.storageManager.getSession(),
  };

  const reportJson = JSON.stringify(reportData, null, 2);
  const blob = new Blob([reportJson], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `haqei_triple_os_${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log("📊 TripleOS Report generated and downloaded");
}
