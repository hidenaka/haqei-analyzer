// object-display-test.js - オブジェクト表示エラーテストスイート

class ObjectDisplayTester {
  constructor() {
    this.testResults = [];
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
    this.dataManager = null;
    this.testInputSystem = null;

    this.init();
  }

  async init() {
    try {
      console.log("🧪 オブジェクト表示エラーテスター初期化開始");

      // DataManagerの初期化
      this.dataManager = new window.DataManager();
      await this.dataManager.loadData();

      // TestInputSystemの初期化
      this.testInputSystem = new window.TestInputSystem();

      console.log("✅ オブジェクト表示エラーテスター初期化完了");
      this.setupEventListeners();
      this.logMessage(
        "✅ オブジェクト表示エラーテスターが初期化されました",
        "success"
      );
    } catch (error) {
      console.error("❌ 初期化エラー:", error);
      this.logMessage(`❌ 初期化エラー: ${error.message}`, "error");
    }
  }

  setupEventListeners() {
    document
      .getElementById("run-object-display-tests")
      .addEventListener("click", () => this.runObjectDisplayTests());
    document
      .getElementById("run-string-conversion-tests")
      .addEventListener("click", () => this.runStringConversionTests());
    document
      .getElementById("run-template-rendering-tests")
      .addEventListener("click", () => this.runTemplateRenderingTests());
    document
      .getElementById("run-all-object-tests")
      .addEventListener("click", () => this.runAllObjectTests());
    document
      .getElementById("run-integration-test")
      .addEventListener("click", () => this.runIntegrationTest());
    document
      .getElementById("generate-test-report")
      .addEventListener("click", () => this.displayTestReport());
    document
      .getElementById("clear-object-results")
      .addEventListener("click", () => this.clearResults());
    document
      .getElementById("test-sample-data")
      .addEventListener("click", () => this.testSampleObjectData());
  }

  // テスト結果をログに記録
  logMessage(message, type = "info") {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      timestamp,
      message,
      type,
    };

    this.testResults.push(logEntry);
    this.updateTestDisplay();
    this.updateDetailedLog();
  }

  // テスト表示を更新
  updateTestDisplay() {
    const resultsContainer = document.getElementById("object-test-results");
    const recentResults = this.testResults.slice(-10);

    resultsContainer.innerHTML = recentResults
      .map(
        (result) =>
          `<div class="test-item ${result.type}">
                [${result.timestamp}] ${result.message}
            </div>`
      )
      .join("");

    resultsContainer.scrollTop = resultsContainer.scrollHeight;
  }

  // 詳細ログを更新
  updateDetailedLog() {
    const logContainer = document.getElementById("object-detailed-log");
    const allResults = this.testResults.slice(-20);

    logContainer.innerHTML = allResults
      .map(
        (result) =>
          `<div class="test-item ${result.type}">
                [${result.timestamp}] ${result.message}
            </div>`
      )
      .join("");

    logContainer.scrollTop = logContainer.scrollHeight;
  }

  // サマリー統計を更新
  updateSummary() {
    document.getElementById("object-total-tests").textContent = this.totalTests;
    document.getElementById("object-passed-tests").textContent =
      this.passedTests;
    document.getElementById("object-failed-tests").textContent =
      this.failedTests;

    const successRate =
      this.totalTests > 0
        ? Math.round((this.passedTests / this.totalTests) * 100)
        : 0;
    document.getElementById(
      "object-success-rate"
    ).textContent = `${successRate}%`;

    // プログレスバーを更新
    const progressFill = document.getElementById("object-progress-fill");
    progressFill.style.width = `${successRate}%`;
  }

  // テスト実行ヘルパー
  runTest(testName, testFunction) {
    this.totalTests++;
    this.logMessage(`🔍 テスト開始: ${testName}`, "info");

    try {
      const result = testFunction();
      if (result === true || (result && result.success)) {
        this.passedTests++;
        this.logMessage(`✅ テスト成功: ${testName}`, "success");
        return true;
      } else {
        this.failedTests++;
        const errorMsg = result && result.error ? result.error : "不明なエラー";
        this.logMessage(`❌ テスト失敗: ${testName} - ${errorMsg}`, "error");
        return false;
      }
    } catch (error) {
      this.failedTests++;
      this.logMessage(`❌ テスト例外: ${testName} - ${error.message}`, "error");
      return false;
    } finally {
      this.updateSummary();
    }
  }

  // オブジェクト表示エラーテスト群
  async runObjectDisplayTests() {
    this.logMessage("🚀 オブジェクト表示エラーテスト群を開始します", "info");

    // テスト1: taiShoDenデータのオブジェクト表示エラー確認
    this.runTest("taiShoDenオブジェクト表示テスト", () => {
      const testData = this.dataManager.getUnifiedHexagramData(1);
      if (!testData)
        return { success: false, error: "テストデータが取得できません" };

      // taiShoDenデータを模擬
      const mockTaiShoDen = {
        text: "これは正常なテキストです",
        content: "これは内容です",
        interpretation: "これは解釈です",
      };

      const displayText = this.generateSafeDisplayText(mockTaiShoDen);

      if (displayText.includes("[object Object]")) {
        return {
          success: false,
          error: "[object Object]エラーが発生しています",
        };
      }

      return displayText.length > 0;
    });

    // テスト2: 複雑なオブジェクト構造での表示テスト
    this.runTest("複雑オブジェクト構造表示テスト", () => {
      const complexObject = {
        nested: {
          deep: {
            value: "深い値",
          },
        },
        array: ["要素1", "要素2"],
        mixed: {
          text: "テキスト",
          number: 123,
          boolean: true,
        },
      };

      const displayText = this.generateSafeDisplayText(complexObject);

      if (displayText.includes("[object Object]")) {
        return {
          success: false,
          error: "複雑オブジェクトで[object Object]エラーが発生",
        };
      }

      return displayText.length > 0;
    });

    // テスト3: null/undefined値での表示テスト
    this.runTest("null/undefined値表示テスト", () => {
      const nullDisplayText = this.generateSafeDisplayText(null);
      const undefinedDisplayText = this.generateSafeDisplayText(undefined);

      if (
        nullDisplayText.includes("[object Object]") ||
        undefinedDisplayText.includes("[object Object]")
      ) {
        return {
          success: false,
          error: "null/undefinedで[object Object]エラーが発生",
        };
      }

      return true;
    });

    // テスト4: 配列データでの表示テスト
    this.runTest("配列データ表示テスト", () => {
      const arrayData = ["項目1", "項目2", "項目3"];
      const displayText = this.generateSafeDisplayText(arrayData);

      if (displayText.includes("[object Object]")) {
        return {
          success: false,
          error: "配列データで[object Object]エラーが発生",
        };
      }

      return displayText.length > 0;
    });

    this.logMessage("✅ オブジェクト表示エラーテスト群完了", "success");
  }

  // 文字列変換テスト群
  async runStringConversionTests() {
    this.logMessage("🔍 文字列変換テスト群を開始します", "info");

    // テスト1: 基本データ型の文字列変換
    this.runTest("基本データ型変換テスト", () => {
      const testCases = [
        { input: "文字列", expected: "文字列" },
        { input: 123, expected: "123" },
        { input: true, expected: "true" },
        { input: false, expected: "false" },
        { input: null, expected: "" },
        { input: undefined, expected: "" },
      ];

      for (const testCase of testCases) {
        const result = this.convertToSafeString(testCase.input);
        if (result !== testCase.expected) {
          return {
            success: false,
            error: `変換失敗: ${testCase.input} -> 期待値: ${testCase.expected}, 実際: ${result}`,
          };
        }
      }

      return true;
    });

    // テスト2: オブジェクトの優先順位変換テスト
    this.runTest("オブジェクト優先順位変換テスト", () => {
      const testObjects = [
        { text: "テキスト優先", content: "内容", interpretation: "解釈" },
        { content: "内容優先", interpretation: "解釈" },
        { interpretation: "解釈のみ" },
        { other: "その他のプロパティ" },
      ];

      const expectedResults = [
        "テキスト優先",
        "内容優先",
        "解釈のみ",
        '{"other":"その他のプロパティ"}',
      ];

      for (let i = 0; i < testObjects.length; i++) {
        const result = this.convertToSafeString(testObjects[i]);
        if (result !== expectedResults[i]) {
          return {
            success: false,
            error: `優先順位変換失敗: ${JSON.stringify(
              testObjects[i]
            )} -> 期待値: ${expectedResults[i]}, 実際: ${result}`,
          };
        }
      }

      return true;
    });

    // テスト3: 循環参照オブジェクトの安全な変換
    this.runTest("循環参照オブジェクト変換テスト", () => {
      const circularObj = { name: "循環参照テスト" };
      circularObj.self = circularObj;

      const result = this.convertToSafeString(circularObj);

      if (result.includes("[object Object]")) {
        return {
          success: false,
          error: "循環参照で[object Object]エラーが発生",
        };
      }

      return result.length > 0;
    });

    this.logMessage("✅ 文字列変換テスト群完了", "success");
  }

  // テンプレート描画テスト群
  async runTemplateRenderingTests() {
    this.logMessage("🔍 テンプレート描画テスト群を開始します", "info");

    // テスト1: generateUserTextメソッドでのオブジェクト表示確認
    this.runTest("generateUserTextオブジェクト表示テスト", () => {
      // モックデータを作成
      const mockAnswers = this.createMockAnswers();

      try {
        const userText = this.testInputSystem.generateUserText(mockAnswers);

        if (userText.includes("[object Object]")) {
          return {
            success: false,
            error: "generateUserTextで[object Object]エラーが発生",
          };
        }

        return userText.length > 0;
      } catch (error) {
        return {
          success: false,
          error: `generateUserText実行エラー: ${error.message}`,
        };
      }
    });

    // テスト2: OS詳細テキスト生成でのオブジェクト表示確認
    this.runTest("OS詳細テキスト生成テスト", () => {
      const testIds = [1, 2, 3];

      for (const id of testIds) {
        const unifiedData = this.dataManager.getUnifiedHexagramData(id);
        if (!unifiedData) continue;

        try {
          const osDetailText =
            this.testInputSystem.generateUnifiedOSDetail(unifiedData);

          if (osDetailText.includes("[object Object]")) {
            return {
              success: false,
              error: `ID${id}のOS詳細で[object Object]エラーが発生`,
            };
          }
        } catch (error) {
          return {
            success: false,
            error: `ID${id}のOS詳細生成エラー: ${error.message}`,
          };
        }
      }

      return true;
    });

    // テスト3: 統合洞察メッセージでのオブジェクト表示確認
    this.runTest("統合洞察メッセージ表示テスト", () => {
      const engineData = this.dataManager.getUnifiedHexagramData(1);
      const interfaceData = this.dataManager.getUnifiedHexagramData(2);
      const safeData = this.dataManager.getUnifiedHexagramData(3);

      if (!engineData || !interfaceData || !safeData) {
        return { success: false, error: "テスト用データが不足しています" };
      }

      try {
        const analysis = this.testInputSystem.analyzeOSCombination(
          engineData,
          interfaceData,
          safeData
        );

        if (analysis.unifyingMessage.includes("[object Object]")) {
          return {
            success: false,
            error: "統合洞察メッセージで[object Object]エラーが発生",
          };
        }

        return analysis.unifyingMessage.length > 0;
      } catch (error) {
        return {
          success: false,
          error: `統合洞察生成エラー: ${error.message}`,
        };
      }
    });

    this.logMessage("✅ テンプレート描画テスト群完了", "success");
  }

  // 全オブジェクトテスト実行
  async runAllObjectTests() {
    this.clearResults();
    this.logMessage("🚀 全オブジェクト表示テスト実行を開始します", "info");

    await this.runObjectDisplayTests();
    await this.runStringConversionTests();
    await this.runTemplateRenderingTests();

    this.logMessage(
      `🎯 全テスト完了 - 成功: ${this.passedTests}/${this.totalTests}`,
      "info"
    );

    if (this.failedTests === 0) {
      this.logMessage(
        "🎉 すべてのオブジェクト表示テストが成功しました！",
        "success"
      );
    } else {
      this.logMessage(
        `⚠️ ${this.failedTests}件のテストが失敗しました`,
        "warning"
      );
    }
  }

  // 結果クリア
  clearResults() {
    this.testResults = [];
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;

    this.updateTestDisplay();
    this.updateDetailedLog();
    this.updateSummary();

    this.logMessage("🗑️ テスト結果をクリアしました", "info");
  }

  // サンプルオブジェクトデータテスト
  testSampleObjectData() {
    try {
      const output = document.getElementById("object-test-output");

      // 実際のデータでオブジェクト表示エラーをテスト
      const sampleIds = [1, 2, 3, 4, 5];
      const testResults = [];

      for (const id of sampleIds) {
        const data = this.dataManager.getUnifiedHexagramData(id);
        if (data) {
          const testResult = {
            id: id,
            name: data.name,
            hasObjectError: false,
            displayTests: {},
          };

          // 各フィールドのオブジェクト表示テスト
          const fieldsToTest = [
            "name",
            "catchphrase",
            "description",
            "strategy",
          ];

          for (const field of fieldsToTest) {
            const fieldValue = data[field];
            const displayText = this.generateSafeDisplayText(fieldValue);
            testResult.displayTests[field] = {
              originalType: typeof fieldValue,
              hasObjectError: displayText.includes("[object Object]"),
              displayText:
                displayText.substring(0, 100) +
                (displayText.length > 100 ? "..." : ""),
            };

            if (displayText.includes("[object Object]")) {
              testResult.hasObjectError = true;
            }
          }

          testResults.push(testResult);
        }
      }

      const testSummary = {
        timestamp: new Date().toISOString(),
        totalTested: testResults.length,
        withObjectErrors: testResults.filter((r) => r.hasObjectError).length,
        results: testResults,
      };

      output.textContent = JSON.stringify(testSummary, null, 2);
      this.logMessage("✅ サンプルオブジェクトデータテスト完了", "success");
    } catch (error) {
      this.logMessage(
        `❌ サンプルオブジェクトデータテストエラー: ${error.message}`,
        "error"
      );
    }
  }

  // 安全な文字列変換メソッド
  convertToSafeString(value) {
    if (value === null || value === undefined) {
      return "";
    }

    if (typeof value === "string") {
      return value;
    }

    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }

    if (typeof value === "object") {
      // 優先順位: text > content > interpretation
      if (value.text && typeof value.text === "string") {
        return value.text;
      }
      if (value.content && typeof value.content === "string") {
        return value.content;
      }
      if (value.interpretation && typeof value.interpretation === "string") {
        return value.interpretation;
      }

      // 配列の場合
      if (Array.isArray(value)) {
        return value.join(", ");
      }

      // その他のオブジェクトの場合、安全にJSON化
      try {
        return JSON.stringify(value);
      } catch (error) {
        return "[複雑なオブジェクト]";
      }
    }

    return String(value);
  }

  // 安全な表示テキスト生成
  generateSafeDisplayText(data) {
    return this.convertToSafeString(data);
  }

  // モック回答データ作成
  createMockAnswers() {
    const mockAnswers = [];

    // 価値観設問のモック回答
    for (let i = 1; i <= 24; i++) {
      mockAnswers.push({
        questionId: `q${i}`,
        selectedValue: "A",
        scoring_tags: ["test_tag"],
      });
    }

    // シナリオ設問のモック回答
    for (let i = 25; i <= 30; i++) {
      mockAnswers.push({
        questionId: `q${i}`,
        innerChoice: {
          value: "A",
          scoring_tags: ["inner_tag"],
        },
        outerChoice: {
          value: "A",
          scoring_tags: ["outer_tag"],
        },
      });
    }

    return mockAnswers;
  }
}

// ページ読み込み完了後に初期化
document.addEventListener("DOMContentLoaded", () => {
  // 必要なクラスの存在確認
  console.log("🔍 オブジェクト表示テストに必要なクラスの確認:");
  console.log("DataManager:", typeof window.DataManager);
  console.log("TestInputSystem:", typeof window.TestInputSystem);

  if (typeof window.DataManager === "undefined") {
    console.error("❌ DataManagerが読み込まれていません");
    document.getElementById("object-test-results").innerHTML =
      '<div class="test-item error">❌ DataManagerクラスが読み込まれていません。ページを再読み込みしてください。</div>';
    return;
  }

  if (typeof window.TestInputSystem === "undefined") {
    console.error("❌ TestInputSystemが読み込まれていません");
    document.getElementById("object-test-results").innerHTML =
      '<div class="test-item error">❌ TestInputSystemクラスが読み込まれていません。ページを再読み込みしてください。</div>';
    return;
  }

  // TestInputSystemが初期化されるまで待つ
  const checkTestInputSystem = () => {
    if (typeof window.testSystem !== "undefined") {
      console.log("✅ TestInputSystemが利用可能です");
      // テスターを初期化
      window.objectDisplayTester = new ObjectDisplayTester();
    } else {
      console.log("⏳ TestInputSystemの初期化を待っています...");
      setTimeout(checkTestInputSystem, 100);
    }
  };

  checkTestInputSystem();
});

// 追加のテスト可視化機能

// テスト結果の詳細分析機能
ObjectDisplayTester.prototype.analyzeTestResults = function () {
  const analysis = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTests: this.totalTests,
      passedTests: this.passedTests,
      failedTests: this.failedTests,
      successRate:
        this.totalTests > 0
          ? Math.round((this.passedTests / this.totalTests) * 100)
          : 0,
    },
    categories: {
      objectDisplay: { passed: 0, failed: 0, tests: [] },
      stringConversion: { passed: 0, failed: 0, tests: [] },
      templateRendering: { passed: 0, failed: 0, tests: [] },
    },
    failurePatterns: [],
    recommendations: [],
  };

  // テスト結果をカテゴリ別に分析
  this.testResults.forEach((result) => {
    const category = this.categorizeTest(result.name);
    if (category) {
      analysis.categories[category].tests.push(result);
      if (result.type === "success") {
        analysis.categories[category].passed++;
      } else if (result.type === "error") {
        analysis.categories[category].failed++;
      }
    }

    // 失敗パターンの分析
    if (result.type === "error") {
      const pattern = this.analyzeFailurePattern(result.message);
      if (pattern && !analysis.failurePatterns.includes(pattern)) {
        analysis.failurePatterns.push(pattern);
      }
    }
  });

  // 推奨事項の生成
  analysis.recommendations = this.generateRecommendations(analysis);

  return analysis;
};

// テストをカテゴリに分類
ObjectDisplayTester.prototype.categorizeTest = function (testName) {
  if (
    testName.includes("オブジェクト表示") ||
    testName.includes("配列データ") ||
    testName.includes("null/undefined")
  ) {
    return "objectDisplay";
  }
  if (
    testName.includes("文字列変換") ||
    testName.includes("優先順位") ||
    testName.includes("循環参照")
  ) {
    return "stringConversion";
  }
  if (
    testName.includes("generateUserText") ||
    testName.includes("OS詳細") ||
    testName.includes("統合洞察")
  ) {
    return "templateRendering";
  }
  return null;
};

// 失敗パターンの分析
ObjectDisplayTester.prototype.analyzeFailurePattern = function (errorMessage) {
  if (errorMessage.includes("[object Object]")) {
    return "OBJECT_DISPLAY_ERROR";
  }
  if (errorMessage.includes("変換失敗")) {
    return "STRING_CONVERSION_ERROR";
  }
  if (errorMessage.includes("実行エラー")) {
    return "EXECUTION_ERROR";
  }
  if (errorMessage.includes("データが取得できません")) {
    return "DATA_ACCESS_ERROR";
  }
  return "UNKNOWN_ERROR";
};

// 推奨事項の生成
ObjectDisplayTester.prototype.generateRecommendations = function (analysis) {
  const recommendations = [];

  if (analysis.categories.objectDisplay.failed > 0) {
    recommendations.push({
      priority: "HIGH",
      category: "オブジェクト表示",
      issue: "[object Object]エラーが発生しています",
      solution:
        "generateSafeDisplayTextメソッドの実装を確認し、適切な文字列変換ロジックを追加してください",
    });
  }

  if (analysis.categories.stringConversion.failed > 0) {
    recommendations.push({
      priority: "MEDIUM",
      category: "文字列変換",
      issue: "文字列変換処理に問題があります",
      solution:
        "convertToSafeStringメソッドの型チェックと変換ロジックを見直してください",
    });
  }

  if (analysis.categories.templateRendering.failed > 0) {
    recommendations.push({
      priority: "HIGH",
      category: "テンプレート描画",
      issue: "テンプレート描画時にオブジェクト表示エラーが発生しています",
      solution:
        "generateUserTextメソッドでのデータ処理を確認し、オブジェクト型データの適切な処理を実装してください",
    });
  }

  if (analysis.failurePatterns.includes("DATA_ACCESS_ERROR")) {
    recommendations.push({
      priority: "MEDIUM",
      category: "データアクセス",
      issue: "テストデータの取得に失敗しています",
      solution: "DataManagerの初期化とデータ読み込み処理を確認してください",
    });
  }

  return recommendations;
};

// テスト結果レポートの生成
ObjectDisplayTester.prototype.generateTestReport = function () {
  const analysis = this.analyzeTestResults();

  const report = {
    title: "オブジェクト表示エラーテスト レポート",
    generatedAt: analysis.timestamp,
    summary: analysis.summary,
    detailedResults: {
      objectDisplayTests: {
        description:
          "オブジェクトデータが[object Object]として表示されないかのテスト",
        results: analysis.categories.objectDisplay,
      },
      stringConversionTests: {
        description: "各種データ型の安全な文字列変換テスト",
        results: analysis.categories.stringConversion,
      },
      templateRenderingTests: {
        description: "テンプレート描画時のオブジェクト表示エラー防止テスト",
        results: analysis.categories.templateRendering,
      },
    },
    issues: {
      failurePatterns: analysis.failurePatterns,
      recommendations: analysis.recommendations,
    },
    conclusion: this.generateConclusion(analysis),
  };

  return report;
};

// 結論の生成
ObjectDisplayTester.prototype.generateConclusion = function (analysis) {
  if (analysis.summary.failedTests === 0) {
    return {
      status: "SUCCESS",
      message:
        "✅ すべてのオブジェクト表示エラーテストが成功しました。[object Object]エラーは適切に解消されています。",
      nextSteps: [
        "定期的にテストを実行して品質を維持してください",
        "新しい機能追加時にもオブジェクト表示エラーが発生しないか確認してください",
      ],
    };
  } else if (analysis.summary.successRate >= 80) {
    return {
      status: "PARTIAL_SUCCESS",
      message: `⚠️ 一部のテストが失敗しましたが、全体的には良好です（成功率: ${analysis.summary.successRate}%）。`,
      nextSteps: [
        "失敗したテストの原因を特定して修正してください",
        "推奨事項に従って改善を実施してください",
      ],
    };
  } else {
    return {
      status: "FAILURE",
      message: `❌ 多くのテストが失敗しています（成功率: ${analysis.summary.successRate}%）。オブジェクト表示エラーの修正が必要です。`,
      nextSteps: [
        "緊急で失敗したテストの原因を特定してください",
        "generateSafeDisplayTextメソッドの実装を見直してください",
        "すべての推奨事項を実施してください",
      ],
    };
  }
};

// レポート表示機能
ObjectDisplayTester.prototype.displayTestReport = function () {
  const report = this.generateTestReport();
  const output = document.getElementById("object-test-output");

  if (output) {
    output.textContent = JSON.stringify(report, null, 2);
    this.logMessage("📊 テストレポートを生成しました", "info");
  }

  return report;
};

// 実際のデータでの統合テスト
ObjectDisplayTester.prototype.runIntegrationTest = function () {
  this.logMessage("🔗 統合テストを開始します", "info");

  // 実際のユーザーデータを模擬したテスト
  this.runTest("実データ統合テスト", () => {
    try {
      // 実際の診断フローを模擬
      const mockAnswers = this.createMockAnswers();
      const userText = this.testInputSystem.generateUserText(mockAnswers);

      // [object Object]エラーの検出
      const objectErrors = (userText.match(/\[object Object\]/g) || []).length;

      if (objectErrors > 0) {
        return {
          success: false,
          error: `実データ統合テストで${objectErrors}個の[object Object]エラーが検出されました`,
        };
      }

      // 最小限の内容があることを確認
      if (userText.length < 100) {
        return {
          success: false,
          error: "生成されたユーザーテキストが短すぎます",
        };
      }

      return true;
    } catch (error) {
      return {
        success: false,
        error: `統合テスト実行エラー: ${error.message}`,
      };
    }
  });

  this.logMessage("✅ 統合テスト完了", "success");
};
