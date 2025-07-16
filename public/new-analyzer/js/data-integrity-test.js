// data-integrity-test.js - DataManager.getUnifiedHexagramData メソッドのテストスイート

class DataIntegrityTester {
  constructor() {
    this.dataManager = null;
    this.testResults = [];
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;

    this.init();
  }

  async init() {
    try {
      console.log("🧪 データ整合性テスター初期化開始");

      // DataManagerの初期化
      this.dataManager = new DataManager();
      await this.dataManager.loadData();

      console.log("✅ DataManager初期化完了");
      this.setupEventListeners();
      this.logMessage("✅ データ整合性テスターが初期化されました", "success");
    } catch (error) {
      console.error("❌ 初期化エラー:", error);
      this.logMessage(`❌ 初期化エラー: ${error.message}`, "error");
    }
  }

  setupEventListeners() {
    document
      .getElementById("run-basic-tests")
      .addEventListener("click", () => this.runBasicTests());
    document
      .getElementById("run-consistency-tests")
      .addEventListener("click", () => this.runConsistencyTests());
    document
      .getElementById("run-edge-case-tests")
      .addEventListener("click", () => this.runEdgeCaseTests());
    document
      .getElementById("run-all-tests")
      .addEventListener("click", () => this.runAllTests());
    document
      .getElementById("clear-results")
      .addEventListener("click", () => this.clearResults());
    document
      .getElementById("inspect-data-structure")
      .addEventListener("click", () => this.inspectDataStructure());
    document
      .getElementById("validate-sample-data")
      .addEventListener("click", () => this.validateSampleData());
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
    const resultsContainer = document.getElementById("test-results");
    const recentResults = this.testResults.slice(-10); // 最新10件を表示

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
    const logContainer = document.getElementById("detailed-log");
    const allResults = this.testResults.slice(-20); // 最新20件を表示

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

  // 基本テスト群
  async runBasicTests() {
    this.logMessage("🚀 基本テスト群を開始します", "info");

    // テスト1: DataManagerが正しく初期化されているか
    this.runTest("DataManager初期化確認", () => {
      return this.dataManager && this.dataManager.loaded;
    });

    // テスト2: getUnifiedHexagramDataメソッドが存在するか
    this.runTest("getUnifiedHexagramDataメソッド存在確認", () => {
      return typeof this.dataManager.getUnifiedHexagramData === "function";
    });

    // テスト3: 有効なIDでデータが取得できるか
    this.runTest("有効ID(1)でのデータ取得", () => {
      const data = this.dataManager.getUnifiedHexagramData(1);
      return data !== null && typeof data === "object";
    });

    // テスト4: 返されるデータが期待される構造を持つか
    this.runTest("データ構造確認", () => {
      const data = this.dataManager.getUnifiedHexagramData(1);
      if (!data) return { success: false, error: "データが取得できません" };

      const requiredFields = [
        "id",
        "name",
        "catchphrase",
        "description",
        "strategy",
        "keywords",
      ];
      const missingFields = requiredFields.filter((field) => !(field in data));

      if (missingFields.length > 0) {
        return {
          success: false,
          error: `必須フィールドが不足: ${missingFields.join(", ")}`,
        };
      }

      return true;
    });

    // テスト5: keywordsが配列として返されるか
    this.runTest("keywords配列確認", () => {
      const data = this.dataManager.getUnifiedHexagramData(1);
      if (!data) return { success: false, error: "データが取得できません" };

      return Array.isArray(data.keywords);
    });

    this.logMessage("✅ 基本テスト群完了", "success");
  }

  // データ整合性テスト群
  async runConsistencyTests() {
    this.logMessage("🔍 データ整合性テスト群を開始します", "info");

    // 同一IDから複数回取得して一貫性を確認
    const testIds = [1, 2, 3, 4, 5];

    for (const id of testIds) {
      this.runTest(`ID${id}の一貫性確認`, () => {
        const data1 = this.dataManager.getUnifiedHexagramData(id);
        const data2 = this.dataManager.getUnifiedHexagramData(id);

        if (!data1 || !data2) {
          return { success: false, error: "データが取得できません" };
        }

        // 主要フィールドの一貫性をチェック
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
      });
    }

    // hexagramDataとosManualDataの統合確認
    this.runTest("データソース統合確認", () => {
      const data = this.dataManager.getUnifiedHexagramData(1);
      if (!data) return { success: false, error: "データが取得できません" };

      // hexagramDataまたはosManualDataのいずれかが存在することを確認
      const hasHexagramData = data.hexagramData !== null;
      const hasOsManualData = data.osManualData !== null;

      if (!hasHexagramData && !hasOsManualData) {
        return { success: false, error: "元データソースが両方ともnullです" };
      }

      return true;
    });

    // 文字列変換の安全性確認
    this.runTest("文字列変換安全性確認", () => {
      const data = this.dataManager.getUnifiedHexagramData(1);
      if (!data) return { success: false, error: "データが取得できません" };

      const stringFields = ["name", "catchphrase", "description", "strategy"];
      for (const field of stringFields) {
        if (typeof data[field] !== "string") {
          return {
            success: false,
            error: `${field}が文字列ではありません: ${typeof data[field]}`,
          };
        }
      }

      return true;
    });

    this.logMessage("✅ データ整合性テスト群完了", "success");
  }

  // エッジケーステスト群
  async runEdgeCaseTests() {
    this.logMessage("⚠️ エッジケーステスト群を開始します", "warning");

    // テスト1: 存在しないIDでの処理
    this.runTest("存在しないID(999)での処理", () => {
      const data = this.dataManager.getUnifiedHexagramData(999);
      return data === null; // nullが返されることを期待
    });

    // テスト2: 負の数IDでの処理
    this.runTest("負の数ID(-1)での処理", () => {
      const data = this.dataManager.getUnifiedHexagramData(-1);
      return data === null; // nullが返されることを期待
    });

    // テスト3: 文字列IDでの処理
    this.runTest('文字列ID("1")での処理', () => {
      const data = this.dataManager.getUnifiedHexagramData("1");
      return data !== null && data.id === 1; // 正しく変換されることを期待
    });

    // テスト4: 無効な文字列IDでの処理
    this.runTest('無効な文字列ID("abc")での処理', () => {
      const data = this.dataManager.getUnifiedHexagramData("abc");
      return data === null; // nullが返されることを期待
    });

    // テスト5: nullやundefinedでの処理
    this.runTest("null値での処理", () => {
      try {
        const data = this.dataManager.getUnifiedHexagramData(null);
        return data === null;
      } catch (error) {
        return { success: false, error: `例外が発生: ${error.message}` };
      }
    });

    this.runTest("undefined値での処理", () => {
      try {
        const data = this.dataManager.getUnifiedHexagramData(undefined);
        return data === null;
      } catch (error) {
        return { success: false, error: `例外が発生: ${error.message}` };
      }
    });

    this.logMessage("✅ エッジケーステスト群完了", "success");
  }

  // 全テスト実行
  async runAllTests() {
    this.clearResults();
    this.logMessage("🚀 全テスト実行を開始します", "info");

    await this.runBasicTests();
    await this.runConsistencyTests();
    await this.runEdgeCaseTests();

    this.logMessage(
      `🎯 全テスト完了 - 成功: ${this.passedTests}/${this.totalTests}`,
      "info"
    );

    if (this.failedTests === 0) {
      this.logMessage("🎉 すべてのテストが成功しました！", "success");
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

  // データ構造検査
  inspectDataStructure() {
    try {
      const output = document.getElementById("data-structure-output");

      // 利用可能なデータの概要を取得
      const hexagrams = this.dataManager.getAllHexagramData();
      const osManual = this.dataManager.getOSManual();

      const inspection = {
        timestamp: new Date().toISOString(),
        hexagramsData: {
          type: Array.isArray(hexagrams) ? "Array" : "Object",
          count: Array.isArray(hexagrams)
            ? hexagrams.length
            : Object.keys(hexagrams).length,
          sampleKeys: Array.isArray(hexagrams)
            ? hexagrams[0]
              ? Object.keys(hexagrams[0])
              : []
            : Object.keys(hexagrams).slice(0, 5),
        },
        osManualData: {
          type: "Object",
          count: Object.keys(osManual).length,
          sampleKeys: Object.keys(osManual).slice(0, 5),
        },
        sampleUnifiedData: this.dataManager.getUnifiedHexagramData(1),
      };

      output.textContent = JSON.stringify(inspection, null, 2);
      this.logMessage("✅ データ構造検査完了", "success");
    } catch (error) {
      this.logMessage(`❌ データ構造検査エラー: ${error.message}`, "error");
    }
  }

  // サンプルデータ検証
  validateSampleData() {
    try {
      const output = document.getElementById("data-structure-output");
      const sampleIds = [1, 2, 3, 4, 5];
      const validationResults = [];

      for (const id of sampleIds) {
        const data = this.dataManager.getUnifiedHexagramData(id);
        validationResults.push({
          id: id,
          exists: data !== null,
          name: data ? data.name : null,
          hasHexagramData: data ? data.hexagramData !== null : false,
          hasOsManualData: data ? data.osManualData !== null : false,
          keywordsCount: data ? data.keywords.length : 0,
        });
      }

      const validation = {
        timestamp: new Date().toISOString(),
        results: validationResults,
        summary: {
          totalTested: sampleIds.length,
          existingData: validationResults.filter((r) => r.exists).length,
          withHexagramData: validationResults.filter((r) => r.hasHexagramData)
            .length,
          withOsManualData: validationResults.filter((r) => r.hasOsManualData)
            .length,
        },
      };

      output.textContent = JSON.stringify(validation, null, 2);
      this.logMessage("✅ サンプルデータ検証完了", "success");
    } catch (error) {
      this.logMessage(`❌ サンプルデータ検証エラー: ${error.message}`, "error");
    }
  }
}

// ページ読み込み完了後に初期化
document.addEventListener("DOMContentLoaded", () => {
  // グローバル変数の存在確認
  console.log("🔍 必要なデータの確認:");
  console.log("HAQEI_DATA:", typeof window.HAQEI_DATA);
  console.log("DataManager:", typeof window.DataManager);

  if (typeof window.DataManager === "undefined") {
    console.error("❌ DataManagerが読み込まれていません");
    document.getElementById("test-results").innerHTML =
      '<div class="test-item error">❌ DataManagerクラスが読み込まれていません。ページを再読み込みしてください。</div>';
    return;
  }

  // テスターを初期化
  window.dataIntegrityTester = new DataIntegrityTester();
});
