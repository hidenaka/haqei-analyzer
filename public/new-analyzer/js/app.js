// HaQei Analyzer - Main Application
console.log("🎯 HaQei Analyzer starting...");

let app = null;
let storageManager = null;

// アプリケーション初期化
document.addEventListener("DOMContentLoaded", async function () {
  console.log("📱 DOM loaded, initializing components...");

  try {
    // ストレージマネージャー初期化
    storageManager = new StorageManager();
    storageManager.setupAutoSave();
    
    // セッション情報の確認と初期化
    let session = storageManager.getSession();
    if (!session) {
      session = storageManager.startNewSession();
      console.log('🎆 New session started:', session);
    } else {
      console.log('🔄 Existing session found:', session);
      storageManager.updateSession({ stage: 'loading' });
    }
    
    // データマネージャー初期化
    const dataManager = new DataManager();
    await dataManager.loadData();

    // データ統計表示
    const stats = dataManager.getDataStats();
    console.log("📊 Data stats:", stats);

    // 診断エンジン初期化（TripleOSEngine使用）
    const engine = new TripleOSEngine(dataManager);

    // Welcome Screen 初期化
    const welcomeScreen = new WelcomeScreen("welcome-container", {
      onStart: function () {
        console.log("🚀 Starting real diagnosis flow...");
        startRealDiagnosis();
      },
    });

    // アプリケーション情報をグローバルに保存
    app = {
      storageManager,
      dataManager,
      engine,
      welcomeScreen,
    };
    
    // セッションステージを更新
    storageManager.updateSession({ stage: 'welcome' });

    console.log("✅ All components initialized successfully");
    console.log("📋 Ready for diagnosis!");
    
    // 以前の進行状況をチェック
    checkPreviousProgress();
  } catch (error) {
    console.error("❌ Initialization failed:", error);
    if (storageManager) {
      storageManager.updateSession({ stage: 'error', lastError: error.message });
    }
    alert("初期化に失敗しました: " + error.message);
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
    app.storageManager.updateSession({ stage: 'questions' });

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
          progressPercentage: progress
        });
      },
      onComplete: function (answers) {
        console.log("✅ All questions completed:", answers);
        
        // 回答をストレージに保存
        app.storageManager.saveAnswers(answers);
        app.storageManager.updateSession({ stage: 'analysis' });
        
        // 分析処理に進む
        proceedToAnalysis(answers);
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
    app.storageManager.updateSession({ stage: 'error', lastError: error.message });
    alert("診断開始に失敗しました: " + error.message);
  }
}

// 分析処理に進む
async function proceedToAnalysis(answers) {
  try {
    console.log("🔬 Proceeding to analysis with answers:", answers);
    
    // セッションステージを更新
    app.storageManager.updateSession({ stage: 'analysis' });
    
    // 分析画面を表示
    showAnalysisView();
    
    // Questions画面を非表示
    if (app.questionFlow) {
      await app.questionFlow.hide();
    }
    
    // 実際の分析を実行（TripleOS分析）
    const result = await app.engine.analyzeTripleOS(answers);
    const insights = await app.engine.generateInsights(result);
    
    console.log("🎯 Analysis completed:", result);
    console.log("💡 Insights generated:", insights);
    
    // 結果をストレージに保存
    app.storageManager.saveAnalysisResult(result);
    app.storageManager.saveInsights(insights);
    app.storageManager.updateSession({ stage: 'results' });
    
    // 結果画面を表示
    showResultsView(result, insights);
    
  } catch (error) {
    console.error("❌ Analysis failed:", error);
    app.storageManager.updateSession({ stage: 'error', lastError: error.message });
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
      case 'questions':
        // 質問画面を再開
        startRealDiagnosis();
        if (app.questionFlow) {
          app.questionFlow.currentQuestionIndex = progress.currentQuestionIndex || 0;
          app.questionFlow.answers = answers || [];
          app.questionFlow.render();
        }
        break;
        
      case 'analysis':
        // 分析を再実行
        proceedToAnalysis(answers);
        break;
        
      case 'results':
        // 結果画面を表示
        if (analysisResult && insights) {
          showResultsView(analysisResult, insights);
        } else {
          proceedToAnalysis(answers);
        }
        break;
        
      default:
        // デフォルトはウェルカム画面
        app.storageManager.updateSession({ stage: 'welcome' });
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
    onAnalysisComplete: function() {
      console.log("🎊 Analysis view completed");
    }
  });
  
  analysisView.show();
  app.analysisView = analysisView;
}

// 結果画面を表示
function showResultsView(analysisResult, insights) {
  hideAllScreens();
  
  // TripleOS分析結果かどうかで表示を分岐
  if (analysisResult.analysisType === 'tripleOS') {
    // TripleOS結果表示
    const tripleOSResultsView = new TripleOSResultsView("results-container", {
      onExploreMore: function(result) {
        showInsightPanel(result, insights);
      },
      onRetakeTest: function() {
        app.storageManager.startNewSession();
        location.reload();
      },
      onGenerateReport: function(result) {
        generateTripleOSReport(result);
      }
    });
    
    tripleOSResultsView.setData(analysisResult);
    tripleOSResultsView.show();
    app.tripleOSResultsView = tripleOSResultsView;
  } else {
    // 従来の結果表示
    const resultsView = new ResultsView("results-container", {
      onExploreMore: function(result) {
        showInsightPanel(result, insights);
      },
      onRetakeTest: function() {
        app.storageManager.startNewSession();
        location.reload();
      }
    });
    
    resultsView.setData(analysisResult, insights);
    resultsView.show();
    app.resultsView = resultsView;
  }
}

// 洞察パネルを表示
function showInsightPanel(analysisResult, insights) {
  hideAllScreens();
  
  const insightPanel = new InsightPanel("insights-container", {
    onBack: function() {
      showResultsView(analysisResult, insights);
    },
    onGenerateReport: function(result, insights) {
      generateReport(result, insights);
    }
  });
  
  insightPanel.setData(analysisResult, insights);
  insightPanel.show();
  app.insightPanel = insightPanel;
}

// 全ての画面を非表示
function hideAllScreens() {
  const screens = ['welcome-container', 'questions-container', 'analysis-container', 'results-container', 'insights-container'];
  screens.forEach(screenId => {
    const screen = document.getElementById(screenId);
    if (screen) {
      screen.style.display = 'none';
    }
  });
}

// レポート生成
function generateReport(analysisResult, insights) {
  const reportData = {
    timestamp: new Date().toISOString(),
    analysisResult: analysisResult,
    insights: insights,
    session: app.storageManager.getSession()
  };
  
  const reportJson = JSON.stringify(reportData, null, 2);
  const blob = new Blob([reportJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `haqei_analysis_${new Date().toISOString().split('T')[0]}.json`;
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
    analysisType: 'tripleOS',
    engineOS: {
      name: analysisResult.engineOS.hexagramInfo.name,
      hexagramId: analysisResult.engineOS.hexagramId,
      strength: analysisResult.engineOS.strength,
      dominantTrigrams: analysisResult.engineOS.dominantTrigrams,
      userVector: analysisResult.engineOS.userVector
    },
    interfaceOS: {
      name: analysisResult.interfaceOS.hexagramInfo.name,
      hexagramId: analysisResult.interfaceOS.hexagramId,
      matchScore: analysisResult.interfaceOS.matchScore,
      keywordMatches: analysisResult.interfaceOS.keywordMatches
    },
    safeModeOS: {
      name: analysisResult.safeModeOS.hexagramInfo.name,
      hexagramId: analysisResult.safeModeOS.hexagramId,
      matchScore: analysisResult.safeModeOS.matchScore,
      lineMatches: analysisResult.safeModeOS.lineMatches
    },
    consistencyScore: analysisResult.consistencyScore,
    integration: analysisResult.integration,
    session: app.storageManager.getSession()
  };
  
  const reportJson = JSON.stringify(reportData, null, 2);
  const blob = new Blob([reportJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `haqei_triple_os_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  console.log("📊 TripleOS Report generated and downloaded");
}
