// comprehensive-integration-test.js - HaQei診断システム全体統合テスト

class ComprehensiveIntegrationTester {
  constructor() {
    this.testResults = [];
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
    this.performanceMetrics = {};
    this.dataManager = null;
    this.testInputSystem = null;
    this.startTime = null;
    this.endTime = null;

    this.init();
  }

  async init() {
    try {
      console.log("🧪 包括的統合テスター初期化開始");

      // DataManagerの初期化
      this.dataManager = new DataManager();
      await this.dataManager.loadData();

      // TestInputSystemの初期化
      this.testInputSystem = new TestInputSystem();

      console.log("✅ 包括的統合テスター初期化完了");
      this.logMessage("✅ 包括的統合テスターが初期化されました", "success");
      this.updateStatus("overall-status", "success");
    } catch (error) {
      console.error("❌ 初期化エラー:", error);
      this.logMessage(`❌ 初期化エラー: ${error.message}`, "error");
      this.updateStatus("overall-status", "error");
    }
  }

  // ステータスインジケーター更新
  updateStatus(elementId, status) {
    const element = document.getElementById(elementId);
    if (element) {
      element.className = `status-indicator ${status}`;
    }
  }

  // テスト結果をログに記録
  logMessage(message, type = "info", section = "overall") {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      timestamp,
      message,
      type,
      section,
    };

    this.testResults.push(logEntry);
    this.updateTestDisplay(section);
  }

  // テスト表示を更新
  updateTestDisplay(section = "overall") {
    const sectionResults = this.testResults.filter(
      (r) => r.section === section
    );
    const containerId =
      section === "overall"
        ? "overall-test-results"
        : `${section}-test-results`;
    const container = document.getElementById(containerId);

    if (!container) return;

    const recentResults = sectionResults.slice(-10);
    container.innerHTML = recentResults
      .map(
        (result) =>
          `<div class="test-item ${result.type}">
          [${result.timestamp}] ${result.message}
        </div>`
      )
      .join("");

    container.scrollTop = container.scrollHeight;
  }

  // サマリー統計を更新
  updateSummary() {
    document.getElementById("total-tests").textContent = this.totalTests;
    document.getElementById("passed-tests").textContent = this.passedTests;
    document.getElementById("failed-tests").textContent = this.failedTests;

    const successRate =
      this.totalTests > 0
        ? Math.round((this.passedTests / this.totalTests) * 100)
        : 0;
    document.getElementById("success-rate").textContent = `${successRate}%`;

    // プログレスバーを更新
    const progressFill = document.getElementById("progress-fill");
    progressFill.style.width = `${successRate}%`;
  }

  // テスト実行ヘルパー
  runTest(testName, testFunction, section = "overall") {
    this.totalTests++;
    this.logMessage(`🔍 テスト開始: ${testName}`, "info", section);

    const testStartTime = performance.now();

    try {
      const result = testFunction();
      const testEndTime = performance.now();
      const duration = testEndTime - testStartTime;

      if (result === true || (result && result.success)) {
        this.passedTests++;
        this.logMessage(
          `✅ テスト成功: ${testName} (${duration.toFixed(2)}ms)`,
          "success",
          section
        );
        return { success: true, duration };
      } else {
        this.failedTests++;
        const errorMsg = result && result.error ? result.error : "不明なエラー";
        this.logMessage(
          `❌ テスト失敗: ${testName} - ${errorMsg} (${duration.toFixed(2)}ms)`,
          "error",
          section
        );
        return { success: false, error: errorMsg, duration };
      }
    } catch (error) {
      const testEndTime = performance.now();
      const duration = testEndTime - testStartTime;

      this.failedTests++;
      this.logMessage(
        `❌ テスト例外: ${testName} - ${error.message} (${duration.toFixed(
          2
        )}ms)`,
        "error",
        section
      );
      return { success: false, error: error.message, duration };
    } finally {
      this.updateSummary();
    }
  }

  // 包括的テスト実行
  async runComprehensiveTest() {
    this.clearAllResults();
    this.startTime = performance.now();
    this.updateStatus("overall-status", "running");

    this.logMessage("🚀 包括的統合テストを開始します", "info");

    try {
      // 1. データ整合性テスト
      await this.runDataIntegrityTests();

      // 2. オブジェクト表示テスト
      await this.runObjectDisplayTests();

      // 3. 統合洞察テスト
      await this.runInsightQualityTests();

      // 4. パフォーマンステスト
      await this.runPerformanceTest();

      // 5. 回帰テスト
      await this.runRegressionTests();

      this.endTime = performance.now();
      const totalDuration = this.endTime - this.startTime;

      this.logMessage(
        `🎯 包括的テスト完了 - 成功: ${this.passedTests}/${
          this.totalTests
        } (${totalDuration.toFixed(2)}ms)`,
        "info"
      );

      if (this.failedTests === 0) {
        this.logMessage("🎉 すべてのテストが成功しました！", "success");
        this.updateStatus("overall-status", "success");
      } else {
        this.logMessage(
          `⚠️ ${this.failedTests}件のテストが失敗しました`,
          "warning"
        );
        this.updateStatus("overall-status", "error");
      }

      // 詳細レポートを自動生成
      this.generateDetailedReport();
    } catch (error) {
      this.logMessage(`❌ 包括的テスト実行エラー: ${error.message}`, "error");
      this.updateStatus("overall-status", "error");
    }
  }

  // データ整合性テスト群
  async runDataIntegrityTests() {
    this.updateStatus("data-status", "running");
    this.logMessage("🔍 データ整合性テスト群を開始します", "info", "data");

    // テスト1: DataManagerの初期化確認
    this.runTest(
      "DataManager初期化確認",
      () => {
        return this.dataManager && this.dataManager.loaded;
      },
      "data"
    );

    // テスト2: getUnifiedHexagramDataメソッド存在確認
    this.runTest(
      "getUnifiedHexagramDataメソッド存在確認",
      () => {
        return typeof this.dataManager.getUnifiedHexagramData === "function";
      },
      "data"
    );

    // テスト3: 統一データ取得テスト
    const testIds = [1, 2, 3, 4, 5];
    for (const id of testIds) {
      this.runTest(
        `統一データ取得テスト(ID:${id})`,
        () => {
          const data = this.dataManager.getUnifiedHexagramData(id);
          if (!data) return { success: false, error: "データが取得できません" };

          const requiredFields = [
            "id",
            "name",
            "catchphrase",
            "description",
            "strategy",
            "keywords",
          ];
          const missingFields = requiredFields.filter(
            (field) => !(field in data)
          );

          if (missingFields.length > 0) {
            return {
              success: false,
              error: `必須フィールドが不足: ${missingFields.join(", ")}`,
            };
          }

          return true;
        },
        "data"
      );
    }

    // テスト4: データ一貫性確認
    this.runTest(
      "データ一貫性確認",
      () => {
        const data1 = this.dataManager.getUnifiedHexagramData(1);
        const data2 = this.dataManager.getUnifiedHexagramData(1);

        if (!data1 || !data2) {
          return { success: false, error: "データが取得できません" };
        }

        const fieldsToCheck = ["id", "name", "catchphrase", "description"];
        for (const field of fieldsToCheck) {
          if (data1[field] !== data2[field]) {
            return {
              success: false,
              error: `${field}フィールドが一貫していません`,
            };
          }
        }

        return true;
      },
      "data"
    );

    // テスト5: エラーハンドリング確認
    this.runTest(
      "存在しないIDでのエラーハンドリング",
      () => {
        const data = this.dataManager.getUnifiedHexagramData(999);
        return data === null;
      },
      "data"
    );

    this.updateStatus("data-status", this.getTestStatusForSection("data"));
    this.logMessage("✅ データ整合性テスト群完了", "success", "data");
  }

  // オブジェクト表示テスト群
  async runObjectDisplayTests() {
    this.updateStatus("object-status", "running");
    this.logMessage(
      "🔍 オブジェクト表示テスト群を開始します",
      "info",
      "object"
    );

    // テスト1: 基本的なオブジェクト表示エラー確認
    this.runTest(
      "基本オブジェクト表示テスト",
      () => {
        const mockObject = {
          text: "これは正常なテキストです",
          content: "これは内容です",
          interpretation: "これは解釈です",
        };

        const displayText = this.generateSafeDisplayText(mockObject);

        if (displayText.includes("[object Object]")) {
          return {
            success: false,
            error: "[object Object]エラーが発生しています",
          };
        }

        return displayText.length > 0;
      },
      "object"
    );

    // テスト2: generateUserTextでのオブジェクト表示確認
    this.runTest(
      "generateUserTextオブジェクト表示テスト",
      () => {
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
      },
      "object"
    );

    // テスト3: 複雑なオブジェクト構造での表示テスト
    this.runTest(
      "複雑オブジェクト構造表示テスト",
      () => {
        const complexObject = {
          nested: { deep: { value: "深い値" } },
          array: ["要素1", "要素2"],
          mixed: { text: "テキスト", number: 123, boolean: true },
        };

        const displayText = this.generateSafeDisplayText(complexObject);

        if (displayText.includes("[object Object]")) {
          return {
            success: false,
            error: "複雑オブジェクトで[object Object]エラーが発生",
          };
        }

        return displayText.length > 0;
      },
      "object"
    );

    // テスト4: null/undefined値での表示テスト
    this.runTest(
      "null/undefined値表示テスト",
      () => {
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
      },
      "object"
    );

    this.updateStatus("object-status", this.getTestStatusForSection("object"));
    this.logMessage("✅ オブジェクト表示テスト群完了", "success", "object");
  }

  // 統合洞察テスト群
  async runInsightQualityTests() {
    this.updateStatus("insight-status", "running");
    this.logMessage("🔍 統合洞察テスト群を開始します", "info", "insight");

    // テスト1: OS組み合わせ分析機能確認
    this.runTest(
      "OS組み合わせ分析機能確認",
      () => {
        return typeof this.testInputSystem.analyzeOSCombination === "function";
      },
      "insight"
    );

    // テスト2: 矛盾検出機能テスト
    this.runTest(
      "矛盾検出機能テスト",
      () => {
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

          if (!analysis || typeof analysis !== "object") {
            return { success: false, error: "OS組み合わせ分析が失敗しました" };
          }

          return true;
        } catch (error) {
          return { success: false, error: `分析実行エラー: ${error.message}` };
        }
      },
      "insight"
    );

    // テスト3: 統合洞察メッセージ生成テスト
    this.runTest(
      "統合洞察メッセージ生成テスト",
      () => {
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

          if (
            !analysis.unifyingMessage ||
            analysis.unifyingMessage.length < 50
          ) {
            return { success: false, error: "統合メッセージが不十分です" };
          }

          if (analysis.unifyingMessage.includes("[object Object]")) {
            return {
              success: false,
              error: "統合メッセージで[object Object]エラーが発生",
            };
          }

          return true;
        } catch (error) {
          return {
            success: false,
            error: `メッセージ生成エラー: ${error.message}`,
          };
        }
      },
      "insight"
    );

    // テスト4: 複数パターンでの洞察品質テスト
    const testCombinations = [
      { name: "乾為天+坤為地+震為雷", engine: 1, interface: 2, safe: 3 },
      { name: "巽為風+離為火+坎為水", engine: 57, interface: 30, safe: 29 },
    ];

    for (const combination of testCombinations) {
      this.runTest(
        `洞察品質テスト: ${combination.name}`,
        () => {
          try {
            const engineData = this.dataManager.getUnifiedHexagramData(
              combination.engine
            );
            const interfaceData = this.dataManager.getUnifiedHexagramData(
              combination.interface
            );
            const safeData = this.dataManager.getUnifiedHexagramData(
              combination.safe
            );

            if (!engineData || !interfaceData || !safeData) {
              return { success: false, error: "OSデータの取得に失敗しました" };
            }

            const analysis = this.testInputSystem.analyzeOSCombination(
              engineData,
              interfaceData,
              safeData
            );
            const quality = this.evaluateMessageQuality(
              analysis.unifyingMessage
            );

            if (quality.score < 60) {
              return {
                success: false,
                error: `品質スコアが低すぎます（${quality.score}点）`,
              };
            }

            return true;
          } catch (error) {
            return { success: false, error: `実行エラー: ${error.message}` };
          }
        },
        "insight"
      );
    }

    this.updateStatus(
      "insight-status",
      this.getTestStatusForSection("insight")
    );
    this.logMessage("✅ 統合洞察テスト群完了", "success", "insight");
  }

  // パフォーマンステスト群
  async runPerformanceTest() {
    this.updateStatus("performance-status", "running");
    this.logMessage(
      "⚡ パフォーマンステスト群を開始します",
      "info",
      "performance"
    );

    const performanceResults = {};

    // テスト1: データ取得パフォーマンス
    const dataFetchStart = performance.now();
    for (let i = 1; i <= 10; i++) {
      this.dataManager.getUnifiedHexagramData(i);
    }
    const dataFetchEnd = performance.now();
    performanceResults.dataFetch = dataFetchEnd - dataFetchStart;

    this.runTest(
      "データ取得パフォーマンス",
      () => {
        const avgTime = performanceResults.dataFetch / 10;
        if (avgTime > 10) {
          // 10ms以上は遅い
          return {
            success: false,
            error: `データ取得が遅すぎます（平均${avgTime.toFixed(2)}ms）`,
          };
        }
        return true;
      },
      "performance"
    );

    // テスト2: generateUserTextパフォーマンス
    const mockAnswers = this.createMockAnswers();
    const generateTextStart = performance.now();

    try {
      this.testInputSystem.generateUserText(mockAnswers);
      const generateTextEnd = performance.now();
      performanceResults.generateText = generateTextEnd - generateTextStart;

      this.runTest(
        "generateUserTextパフォーマンス",
        () => {
          if (performanceResults.generateText > 1000) {
            // 1秒以上は遅い
            return {
              success: false,
              error: `テキスト生成が遅すぎます（${performanceResults.generateText.toFixed(
                2
              )}ms）`,
            };
          }
          return true;
        },
        "performance"
      );
    } catch (error) {
      this.runTest(
        "generateUserTextパフォーマンス",
        () => {
          return {
            success: false,
            error: `テキスト生成エラー: ${error.message}`,
          };
        },
        "performance"
      );
    }

    // テスト3: OS組み合わせ分析パフォーマンス
    const analysisStart = performance.now();
    try {
      const engineData = this.dataManager.getUnifiedHexagramData(1);
      const interfaceData = this.dataManager.getUnifiedHexagramData(2);
      const safeData = this.dataManager.getUnifiedHexagramData(3);

      this.testInputSystem.analyzeOSCombination(
        engineData,
        interfaceData,
        safeData
      );
      const analysisEnd = performance.now();
      performanceResults.osAnalysis = analysisEnd - analysisStart;

      this.runTest(
        "OS組み合わせ分析パフォーマンス",
        () => {
          if (performanceResults.osAnalysis > 500) {
            // 500ms以上は遅い
            return {
              success: false,
              error: `OS分析が遅すぎます（${performanceResults.osAnalysis.toFixed(
                2
              )}ms）`,
            };
          }
          return true;
        },
        "performance"
      );
    } catch (error) {
      this.runTest(
        "OS組み合わせ分析パフォーマンス",
        () => {
          return { success: false, error: `OS分析エラー: ${error.message}` };
        },
        "performance"
      );
    }

    // パフォーマンスメトリクスを保存
    this.performanceMetrics = performanceResults;
    this.displayPerformanceMetrics();

    this.updateStatus(
      "performance-status",
      this.getTestStatusForSection("performance")
    );
    this.logMessage("✅ パフォーマンステスト群完了", "success", "performance");
  }

  // 回帰テスト群
  async runRegressionTests() {
    this.updateStatus("regression-status", "running");
    this.logMessage("🔄 回帰テスト群を開始します", "info", "regression");

    // テスト1: 既存機能の動作確認
    this.runTest(
      "既存機能動作確認",
      () => {
        // DataManagerの基本機能が動作することを確認
        const hexagramData = this.dataManager.getAllHexagramData();
        const osManual = this.dataManager.getOSManual();

        if (!hexagramData || !osManual) {
          return {
            success: false,
            error: "既存データ取得機能に問題があります",
          };
        }

        return true;
      },
      "regression"
    );

    // テスト2: 修正前の問題が解決されているか確認
    this.runTest(
      "データ参照一貫性の修正確認",
      () => {
        const data1 = this.dataManager.getUnifiedHexagramData(1);
        const data2 = this.dataManager.getUnifiedHexagramData(1);

        if (!data1 || !data2) {
          return { success: false, error: "統一データ取得に失敗" };
        }

        // 同じIDから取得したデータが一貫していることを確認
        if (
          data1.name !== data2.name ||
          data1.catchphrase !== data2.catchphrase
        ) {
          return {
            success: false,
            error: "データ参照の一貫性に問題があります",
          };
        }

        return true;
      },
      "regression"
    );

    // テスト3: オブジェクト表示エラーの修正確認
    this.runTest(
      "オブジェクト表示エラーの修正確認",
      () => {
        const mockAnswers = this.createMockAnswers();

        try {
          const userText = this.testInputSystem.generateUserText(mockAnswers);
          const objectErrorCount = (userText.match(/\[object Object\]/g) || [])
            .length;

          if (objectErrorCount > 0) {
            return {
              success: false,
              error: `${objectErrorCount}個の[object Object]エラーが残存しています`,
            };
          }

          return true;
        } catch (error) {
          return {
            success: false,
            error: `テキスト生成エラー: ${error.message}`,
          };
        }
      },
      "regression"
    );

    // テスト4: 統合洞察機能の実装確認
    this.runTest(
      "統合洞察機能の実装確認",
      () => {
        const engineData = this.dataManager.getUnifiedHexagramData(1);
        const interfaceData = this.dataManager.getUnifiedHexagramData(2);
        const safeData = this.dataManager.getUnifiedHexagramData(3);

        if (!engineData || !interfaceData || !safeData) {
          return { success: false, error: "テスト用データが不足" };
        }

        try {
          const analysis = this.testInputSystem.analyzeOSCombination(
            engineData,
            interfaceData,
            safeData
          );

          if (
            !analysis.unifyingMessage ||
            analysis.unifyingMessage.length < 50
          ) {
            return {
              success: false,
              error: "統合洞察機能が正しく実装されていません",
            };
          }

          return true;
        } catch (error) {
          return {
            success: false,
            error: `統合洞察機能エラー: ${error.message}`,
          };
        }
      },
      "regression"
    );

    this.updateStatus(
      "regression-status",
      this.getTestStatusForSection("regression")
    );
    this.logMessage("✅ 回帰テスト群完了", "success", "regression");
  }

  // セクション別テスト状況取得
  getTestStatusForSection(section) {
    const sectionResults = this.testResults.filter(
      (r) => r.section === section
    );
    const hasErrors = sectionResults.some((r) => r.type === "error");
    const hasSuccess = sectionResults.some((r) => r.type === "success");

    if (hasErrors) return "error";
    if (hasSuccess) return "success";
    return "idle";
  }

  // パフォーマンスメトリクス表示
  displayPerformanceMetrics() {
    const container = document.getElementById("performance-metrics");
    if (!container) return;

    const metrics = [
      {
        label: "データ取得",
        value: `${(this.performanceMetrics.dataFetch || 0).toFixed(2)}ms`,
        key: "dataFetch",
      },
      {
        label: "テキスト生成",
        value: `${(this.performanceMetrics.generateText || 0).toFixed(2)}ms`,
        key: "generateText",
      },
      {
        label: "OS分析",
        value: `${(this.performanceMetrics.osAnalysis || 0).toFixed(2)}ms`,
        key: "osAnalysis",
      },
      {
        label: "メモリ使用量",
        value: `${(
          performance.memory?.usedJSHeapSize / 1024 / 1024 || 0
        ).toFixed(2)}MB`,
        key: "memory",
      },
    ];

    container.innerHTML = metrics
      .map(
        (metric) =>
          `<div class="metric-card">
        <div class="metric-value">${metric.value}</div>
        <div class="metric-label">${metric.label}</div>
      </div>`
      )
      .join("");
  }

  // 詳細レポート生成
  generateDetailedReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: this.totalTests,
        passedTests: this.passedTests,
        failedTests: this.failedTests,
        successRate:
          this.totalTests > 0
            ? Math.round((this.passedTests / this.totalTests) * 100)
            : 0,
        duration:
          this.endTime && this.startTime ? this.endTime - this.startTime : 0,
      },
      performanceMetrics: this.performanceMetrics,
      testResults: this.testResults,
      sections: {
        dataIntegrity: this.testResults.filter((r) => r.section === "data"),
        objectDisplay: this.testResults.filter((r) => r.section === "object"),
        insightQuality: this.testResults.filter((r) => r.section === "insight"),
        performance: this.testResults.filter(
          (r) => r.section === "performance"
        ),
        regression: this.testResults.filter((r) => r.section === "regression"),
      },
      recommendations: this.generateRecommendations(),
    };

    const reportContainer = document.getElementById("detailed-report");
    if (reportContainer) {
      reportContainer.textContent = JSON.stringify(report, null, 2);
    }

    return report;
  }

  // 推奨事項生成
  generateRecommendations() {
    const recommendations = [];

    if (this.failedTests > 0) {
      recommendations.push({
        priority: "HIGH",
        category: "品質改善",
        issue: `${this.failedTests}件のテストが失敗しています`,
        solution:
          "失敗したテストの詳細を確認し、根本原因を特定して修正してください",
      });
    }

    if (this.performanceMetrics.generateText > 500) {
      recommendations.push({
        priority: "MEDIUM",
        category: "パフォーマンス",
        issue: "テキスト生成処理が遅い可能性があります",
        solution: "generateUserTextメソッドの最適化を検討してください",
      });
    }

    if (this.performanceMetrics.dataFetch > 50) {
      recommendations.push({
        priority: "LOW",
        category: "パフォーマンス",
        issue: "データ取得処理の最適化余地があります",
        solution: "データキャッシュ機能の実装を検討してください",
      });
    }

    if (this.totalTests < 20) {
      recommendations.push({
        priority: "MEDIUM",
        category: "テストカバレッジ",
        issue: "テストケースが不足している可能性があります",
        solution: "エッジケースや境界値テストの追加を検討してください",
      });
    }

    return recommendations;
  }

  // 結果エクスポート
  exportTestResults() {
    const report = this.generateDetailedReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `haqei-integration-test-report-${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/:/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.logMessage("📄 テスト結果をエクスポートしました", "success");
  }

  // 全結果クリア
  clearAllResults() {
    this.testResults = [];
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
    this.performanceMetrics = {};
    this.startTime = null;
    this.endTime = null;

    // 全セクションの表示をクリア
    const sections = ["data", "object", "insight", "performance", "regression"];
    sections.forEach((section) => {
      this.updateTestDisplay(section);
      this.updateStatus(`${section}-status`, "idle");
    });

    this.updateSummary();
    this.updateStatus("overall-status", "idle");

    // パフォーマンスメトリクスとレポートをクリア
    const performanceContainer = document.getElementById("performance-metrics");
    const reportContainer = document.getElementById("detailed-report");

    if (performanceContainer) performanceContainer.innerHTML = "";
    if (reportContainer) reportContainer.innerHTML = "";

    this.logMessage("🗑️ 全テスト結果をクリアしました", "info");
  }

  // ヘルパーメソッド群

  // 安全な表示テキスト生成
  generateSafeDisplayText(data) {
    if (data === null || data === undefined) {
      return "";
    }

    if (typeof data === "string") {
      return data;
    }

    if (typeof data === "number" || typeof data === "boolean") {
      return String(data);
    }

    if (typeof data === "object") {
      // 優先順位: text > content > interpretation
      if (data.text && typeof data.text === "string") {
        return data.text;
      }
      if (data.content && typeof data.content === "string") {
        return data.content;
      }
      if (data.interpretation && typeof data.interpretation === "string") {
        return data.interpretation;
      }

      // 配列の場合
      if (Array.isArray(data)) {
        return data.join(", ");
      }

      // その他のオブジェクトの場合、安全にJSON化
      try {
        return JSON.stringify(data);
      } catch (error) {
        return "[複雑なオブジェクト]";
      }
    }

    return String(data);
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

  // メッセージ品質評価
  evaluateMessageQuality(message) {
    if (!message || typeof message !== "string") {
      return { score: 0, details: { error: "メッセージが無効です" } };
    }

    let score = 0;
    const details = {};

    // 長さの評価（20点満点）
    if (message.length >= 100) {
      score += 20;
      details.length = "適切";
    } else if (message.length >= 50) {
      score += 15;
      details.length = "短め";
    } else {
      score += 5;
      details.length = "短すぎる";
    }

    // 肯定的表現の評価（30点満点）
    const positiveKeywords = [
      "魅力",
      "多面的",
      "リーダーシップ",
      "強み",
      "才能",
      "能力",
      "特徴",
      "優れた",
    ];
    const positiveCount = positiveKeywords.filter((keyword) =>
      message.includes(keyword)
    ).length;
    score += Math.min(positiveCount * 5, 30);
    details.positiveExpression = `${positiveCount}個の肯定的表現`;

    // 統合性の評価（30点満点）
    const unifyingKeywords = [
      "統合",
      "組み合わせ",
      "融合",
      "調和",
      "バランス",
      "相互作用",
    ];
    const unifyingCount = unifyingKeywords.filter((keyword) =>
      message.includes(keyword)
    ).length;
    score += Math.min(unifyingCount * 6, 30);
    details.unification = `${unifyingCount}個の統合表現`;

    // 読みやすさの評価（20点満点）
    const sentences = message
      .split(/[。！？]/)
      .filter((s) => s.trim().length > 0);
    if (sentences.length >= 3 && sentences.length <= 6) {
      score += 20;
      details.readability = "適切な文章構成";
    } else if (sentences.length >= 2) {
      score += 15;
      details.readability = "文章構成やや不適切";
    } else {
      score += 5;
      details.readability = "文章構成不適切";
    }

    return {
      score: Math.min(score, 100),
      details: details,
    };
  }
}

// グローバル変数
let comprehensiveIntegrationTester = null;

// ページ読み込み時の初期化
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // 必要なクラスの存在確認
    if (typeof DataManager === "undefined") {
      console.error("❌ DataManagerが読み込まれていません");
      return;
    }

    if (typeof TestInputSystem === "undefined") {
      console.error("❌ TestInputSystemが読み込まれていません");
      return;
    }

    comprehensiveIntegrationTester = new ComprehensiveIntegrationTester();
    console.log("✅ 包括的統合テスターが初期化されました");
  } catch (error) {
    console.error("❌ 包括的統合テスター初期化エラー:", error);
  }
});

// グローバル関数（HTMLから呼び出し用）
async function runComprehensiveTest() {
  if (!comprehensiveIntegrationTester) {
    alert("テスターが初期化されていません。ページを再読み込みしてください。");
    return;
  }

  await comprehensiveIntegrationTester.runComprehensiveTest();
}

async function runDataIntegrityTests() {
  if (!comprehensiveIntegrationTester) {
    alert("テスターが初期化されていません。");
    return;
  }

  await comprehensiveIntegrationTester.runDataIntegrityTests();
}

async function runObjectDisplayTests() {
  if (!comprehensiveIntegrationTester) {
    alert("テスターが初期化されていません。");
    return;
  }

  await comprehensiveIntegrationTester.runObjectDisplayTests();
}

async function runInsightQualityTests() {
  if (!comprehensiveIntegrationTester) {
    alert("テスターが初期化されていません。");
    return;
  }

  await comprehensiveIntegrationTester.runInsightQualityTests();
}

async function runPerformanceTest() {
  if (!comprehensiveIntegrationTester) {
    alert("テスターが初期化されていません。");
    return;
  }

  await comprehensiveIntegrationTester.runPerformanceTest();
}

async function runRegressionTests() {
  if (!comprehensiveIntegrationTester) {
    alert("テスターが初期化されていません。");
    return;
  }

  await comprehensiveIntegrationTester.runRegressionTests();
}

function generateDetailedReport() {
  if (!comprehensiveIntegrationTester) {
    alert("テスターが初期化されていません。");
    return;
  }

  return comprehensiveIntegrationTester.generateDetailedReport();
}

function exportTestResults() {
  if (!comprehensiveIntegrationTester) {
    alert("テスターが初期化されていません。");
    return;
  }

  comprehensiveIntegrationTester.exportTestResults();
}

function clearAllResults() {
  if (!comprehensiveIntegrationTester) {
    alert("テスターが初期化されていません。");
    return;
  }

  comprehensiveIntegrationTester.clearAllResults();
}
