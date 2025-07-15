// HaQei Analyzer - Main Application
console.log("🎯 HaQei Analyzer starting...");

let app = null;

// アプリケーション初期化
document.addEventListener("DOMContentLoaded", async function () {
  console.log("📱 DOM loaded, initializing components...");

  try {
    // データマネージャー初期化
    const dataManager = new DataManager();
    await dataManager.loadData();

    // データ統計表示
    const stats = dataManager.getDataStats();
    console.log("📊 Data stats:", stats);

    // 診断エンジン初期化
    const engine = new DiagnosisEngine(dataManager);

    // Welcome Screen 初期化
    const welcomeScreen = new WelcomeScreen("welcome-container", {
      onStart: function () {
        console.log("🚀 Starting real diagnosis flow...");
        startRealDiagnosis();
      },
    });

    // アプリケーション情報をグローバルに保存
    app = {
      dataManager,
      engine,
      welcomeScreen,
    };

    console.log("✅ All components initialized successfully");
    console.log("📋 Ready for diagnosis!");
  } catch (error) {
    console.error("❌ Initialization failed:", error);
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

    // Welcome画面を非表示
    console.log("👋 Hiding welcome screen...");
    app.welcomeScreen.hide();

    // Question Flow を初期化
    console.log("❓ Creating QuestionFlow...");
    const questionFlow = new QuestionFlow("questions-container", {
      onProgress: function (progress) {
        console.log(`📊 Progress: ${progress.toFixed(1)}%`);
        document.documentElement.style.setProperty(
          "--progress",
          `${progress}%`
        );
      },
      onComplete: function (answers) {
        console.log("✅ All questions completed:", answers);
        alert("分析完了！回答数: " + answers.length);
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
    alert("診断開始に失敗しました: " + error.message);
  }
}

// 分析処理に進む
async function proceedToAnalysis(answers) {
  try {
    console.log("🔬 Proceeding to analysis with answers:", answers);
    // Questions画面を非表示
    if (app.questionFlow) {
      await app.questionFlow.hide();
    }
    // 実際の分析を実行
    const result = await app.engine.analyze(answers);
    const insights = await app.engine.generateInsights(result);
    console.log("🎯 Analysis completed:", result);
    console.log("💡 Insights generated:", insights);
    // 結果をアラート表示（後で美しい結果画面に置き換え予定）
    alert(
      `分析完了！\n\nあなたの人格OS: ${result.primaryOS.hexagramInfo.name}\n適合度: ${result.primaryOS.matchPercentage}%\n\n${insights.summary}`
    );
  } catch (error) {
    console.error("❌ Analysis failed:", error);
    alert("分析処理でエラーが発生しました: " + error.message);
  }
}
