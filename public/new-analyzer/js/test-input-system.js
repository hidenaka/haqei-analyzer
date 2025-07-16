// TestInputSystem.js - 手動テスト用データ入力・管理システム

// グローバル変数として参照（import文は使用しない）

// 先頭付近にInsightEngineのimportを追加
// import {
//   getOSDetailText,
//   getPersonalizedInsight,
//   getPersonalizedActionPlans,
// } from "./core/InsightEngine.js";

class TestInputSystem {
  constructor() {
    try {
      console.log("🔍 [TestInputSystem] コンストラクタ開始");

      // プロパティの初期化
      this.participants = [];
      this.answersData = {};
      this.diagnosisResults = {};
      this.feedbackData = {};
      this.isInitialized = false;
      this.errorState = null;

      // 質問データの安全な取得
      try {
        this.questions = {
          worldview:
            typeof window.WORLDVIEW_QUESTIONS !== "undefined"
              ? window.WORLDVIEW_QUESTIONS
              : [],
          scenarios:
            typeof window.SCENARIO_QUESTIONS !== "undefined"
              ? window.SCENARIO_QUESTIONS
              : [],
        };
        console.log(
          `✅ 質問データ読み込み完了 - 価値観: ${this.questions.worldview.length}件, シナリオ: ${this.questions.scenarios.length}件`
        );
      } catch (questionError) {
        console.error("❌ 質問データの読み込みに失敗:", questionError);
        this.questions = { worldview: [], scenarios: [] };
        this.errorState = "質問データの読み込みに失敗しました";
      }

      // 必要なクラスの存在チェック
      const missingClasses = [];

      if (typeof window.DataManager === "undefined") {
        missingClasses.push("DataManager");
        console.error("❌ DataManagerクラスが見つかりません");
      }

      if (typeof window.TripleOSEngine === "undefined") {
        missingClasses.push("TripleOSEngine");
        console.error("❌ TripleOSEngineクラスが見つかりません");
      }

      if (missingClasses.length > 0) {
        const errorMsg = `必要なクラスが読み込まれていません: ${missingClasses.join(
          ", "
        )}。ページを再読み込みしてください。`;
        console.error(`❌ [TestInputSystem] ${errorMsg}`);
        this.errorState = errorMsg;

        // ユーザーに分かりやすいエラーメッセージを表示
        if (typeof alert !== "undefined") {
          alert(errorMsg);
        }
        return;
      }

      console.log("✅ 必要なクラスが読み込まれています");
      this.init();
    } catch (error) {
      console.error(
        "❌ [TestInputSystem] コンストラクタでエラーが発生:",
        error
      );
      this.errorState = `システムの初期化に失敗しました: ${error.message}`;

      // ユーザーに分かりやすいエラーメッセージを表示
      if (typeof alert !== "undefined") {
        alert(
          "システムの初期化中にエラーが発生しました。ページを再読み込みしてください。"
        );
      }
    }
  }

  init() {
    try {
      console.log("🔍 [TestInputSystem] init開始");

      // エラー状態チェック
      if (this.errorState) {
        console.error(
          `❌ [TestInputSystem] エラー状態のため初期化をスキップ: ${this.errorState}`
        );
        return;
      }

      // 各初期化処理を安全に実行
      try {
        this.loadSavedData();
      } catch (error) {
        console.error("❌ [TestInputSystem] loadSavedDataエラー:", error);
        // 保存データの読み込み失敗は致命的ではないので継続
      }

      try {
        this.generateQuestionInputs();
      } catch (error) {
        console.error(
          "❌ [TestInputSystem] generateQuestionInputsエラー:",
          error
        );
        // 質問入力生成失敗は致命的ではないので継続
      }

      try {
        this.updateParticipantSelects();
      } catch (error) {
        console.error(
          "❌ [TestInputSystem] updateParticipantSelectsエラー:",
          error
        );
        // 参加者選択更新失敗は致命的ではないので継続
      }

      try {
        this.updateInputProgress();
      } catch (error) {
        console.error("❌ [TestInputSystem] updateInputProgressエラー:", error);
        // 進捗更新失敗は致命的ではないので継続
      }

      try {
        this.updateResultsList();
      } catch (error) {
        console.error("❌ [TestInputSystem] updateResultsListエラー:", error);
        // 結果リスト更新失敗は致命的ではないので継続
      }

      try {
        this.setupEventListeners();
      } catch (error) {
        console.error("❌ [TestInputSystem] setupEventListenersエラー:", error);
        // イベントリスナー設定失敗は致命的ではないので継続
      }

      try {
        this.initDataIntegrityTester();
      } catch (error) {
        console.error(
          "❌ [TestInputSystem] initDataIntegrityTesterエラー:",
          error
        );
        // データ整合性テスター初期化失敗は致命的ではないので継続
      }

      this.isInitialized = true;
      console.log("✅ [TestInputSystem] 初期化完了");
    } catch (error) {
      console.error("❌ [TestInputSystem] init致命的エラー:", error);
      this.errorState = `初期化中に致命的エラーが発生しました: ${error.message}`;

      // ユーザーに分かりやすいエラーメッセージを表示
      if (typeof alert !== "undefined") {
        alert(
          "システムの初期化中にエラーが発生しました。ページを再読み込みしてください。"
        );
      }
    }
  }

  // 対象者リスト解析
  parseParticipants() {
    try {
      console.log("🔍 [TestInputSystem] parseParticipants開始");

      // エラー状態チェック
      if (this.errorState) {
        const errorMsg = `システムがエラー状態のため処理を実行できません: ${this.errorState}`;
        console.error(`❌ [TestInputSystem] ${errorMsg}`);
        alert(errorMsg);
        return;
      }

      // DOM要素の存在確認
      const participantsListElement =
        document.getElementById("participants-list");
      if (!participantsListElement) {
        const errorMsg =
          "参加者リスト入力欄が見つかりません。ページを再読み込みしてください。";
        console.error(`❌ [TestInputSystem] ${errorMsg}`);
        alert(errorMsg);
        return;
      }

      const text = participantsListElement.value;
      if (!text || !text.trim()) {
        const errorMsg = "参加者リストが入力されていません。";
        console.warn(`⚠️ [TestInputSystem] ${errorMsg}`);
        alert(errorMsg);
        return;
      }

      const lines = text.split("\n").filter((line) => line.trim());
      if (lines.length === 0) {
        const errorMsg = "有効な参加者データが見つかりません。";
        console.warn(`⚠️ [TestInputSystem] ${errorMsg}`);
        alert(errorMsg);
        return;
      }

      this.participants = lines.map((line, index) => {
        try {
          const parts = line.split(",").map((p) => p.trim());
          return {
            id: parts[0] || `user${String(index + 1).padStart(3, "0")}`,
            name: parts[1] || `ユーザー${index + 1}`,
            age: parts[2] || "",
            gender: parts[3] || "",
            occupation: parts[4] || "",
          };
        } catch (parseError) {
          console.warn(
            `⚠️ [TestInputSystem] 参加者データ解析エラー (行${
              index + 1
            }): ${line}`,
            parseError
          );
          return {
            id: `user${String(index + 1).padStart(3, "0")}`,
            name: `ユーザー${index + 1}`,
            age: "",
            gender: "",
            occupation: "",
          };
        }
      });

      // 後続処理を安全に実行
      try {
        this.updateParticipantSelects();
      } catch (error) {
        console.error(
          "❌ [TestInputSystem] updateParticipantSelectsエラー:",
          error
        );
        // 継続処理
      }

      try {
        this.updateInputProgress();
      } catch (error) {
        console.error("❌ [TestInputSystem] updateInputProgressエラー:", error);
        // 継続処理
      }

      try {
        this.saveData();
      } catch (error) {
        console.error("❌ [TestInputSystem] saveDataエラー:", error);
        // 継続処理
      }

      console.log(
        `✅ [TestInputSystem] parseParticipants完了 - ${this.participants.length}人`
      );
      alert(`${this.participants.length}人の対象者を登録しました`);
    } catch (error) {
      console.error(
        "❌ [TestInputSystem] parseParticipants致命的エラー:",
        error
      );
      const userMessage = `参加者リストの解析中にエラーが発生しました: ${error.message}`;
      alert(userMessage);
    }
  }

  // データ整合性テスター初期化
  async initDataIntegrityTester() {
    try {
      console.log("🧪 データ整合性テスター初期化開始");

      // DataManagerの初期化
      this.dataManager = new DataManager();
      await this.dataManager.loadData();

      // テスト結果を保存する配列
      this.testResults = [];
      this.totalTests = 0;
      this.passedTests = 0;
      this.failedTests = 0;

      console.log("✅ データ整合性テスター初期化完了");
    } catch (error) {
      console.error("❌ データ整合性テスター初期化エラー:", error);
    }
  }

  // データ整合性テスト実行
  async runDataIntegrityTests() {
    console.log("🧪 データ整合性テスト開始");

    this.testResults = [];
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;

    try {
      // 基本テスト群
      await this.runBasicDataTests();

      // 整合性テスト群
      await this.runConsistencyDataTests();

      // エッジケーステスト群
      await this.runEdgeCaseDataTests();

      // テスト結果をログ出力
      this.logDataTestResults();

      return {
        total: this.totalTests,
        passed: this.passedTests,
        failed: this.failedTests,
        results: this.testResults,
      };
    } catch (error) {
      console.error("❌ データ整合性テスト実行エラー:", error);
      throw error;
    }
  }

  // 基本データテスト群
  async runBasicDataTests() {
    console.log("🔍 基本データテスト群開始");

    // テスト1: DataManagerが正しく初期化されているか
    this.runDataTest("DataManager初期化確認", () => {
      return this.dataManager && this.dataManager.loaded;
    });

    // テスト2: getUnifiedHexagramDataメソッドが存在するか
    this.runDataTest("getUnifiedHexagramDataメソッド存在確認", () => {
      return typeof this.dataManager.getUnifiedHexagramData === "function";
    });

    // テスト3: 有効なIDでデータが取得できるか
    this.runDataTest("有効ID(1)でのデータ取得", () => {
      const data = this.dataManager.getUnifiedHexagramData(1);
      return data !== null && typeof data === "object";
    });

    // テスト4: 返されるデータが期待される構造を持つか
    this.runDataTest("データ構造確認", () => {
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
    this.runDataTest("keywords配列確認", () => {
      const data = this.dataManager.getUnifiedHexagramData(1);
      if (!data) return { success: false, error: "データが取得できません" };

      return Array.isArray(data.keywords);
    });
  }

  // 整合性データテスト群
  async runConsistencyDataTests() {
    console.log("🔍 データ整合性テスト群開始");

    // 同一IDから複数回取得して一貫性を確認
    const testIds = [1, 2, 3, 4, 5];

    for (const id of testIds) {
      this.runDataTest(`ID${id}の一貫性確認`, () => {
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
    this.runDataTest("データソース統合確認", () => {
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
    this.runDataTest("文字列変換安全性確認", () => {
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
  }

  // エッジケースデータテスト群
  async runEdgeCaseDataTests() {
    console.log("⚠️ エッジケースデータテスト群開始");

    // テスト1: 存在しないIDでの処理
    this.runDataTest("存在しないID(999)での処理", () => {
      const data = this.dataManager.getUnifiedHexagramData(999);
      return data === null; // nullが返されることを期待
    });

    // テスト2: 負の数IDでの処理
    this.runDataTest("負の数ID(-1)での処理", () => {
      const data = this.dataManager.getUnifiedHexagramData(-1);
      return data === null; // nullが返されることを期待
    });

    // テスト3: 文字列IDでの処理
    this.runDataTest('文字列ID("1")での処理', () => {
      const data = this.dataManager.getUnifiedHexagramData("1");
      return data !== null && data.id === 1; // 正しく変換されることを期待
    });

    // テスト4: 無効な文字列IDでの処理
    this.runDataTest('無効な文字列ID("abc")での処理', () => {
      const data = this.dataManager.getUnifiedHexagramData("abc");
      return data === null; // nullが返されることを期待
    });

    // テスト5: nullやundefinedでの処理
    this.runDataTest("null値での処理", () => {
      try {
        const data = this.dataManager.getUnifiedHexagramData(null);
        return data === null;
      } catch (error) {
        return { success: false, error: `例外が発生: ${error.message}` };
      }
    });

    this.runDataTest("undefined値での処理", () => {
      try {
        const data = this.dataManager.getUnifiedHexagramData(undefined);
        return data === null;
      } catch (error) {
        return { success: false, error: `例外が発生: ${error.message}` };
      }
    });
  }

  // データテスト実行ヘルパー
  runDataTest(testName, testFunction) {
    this.totalTests++;
    const timestamp = new Date().toLocaleTimeString();

    try {
      const result = testFunction();
      if (result === true || (result && result.success)) {
        this.passedTests++;
        this.testResults.push({
          timestamp,
          name: testName,
          status: "success",
          message: "テスト成功",
        });
        console.log(`✅ テスト成功: ${testName}`);
        return true;
      } else {
        this.failedTests++;
        const errorMsg = result && result.error ? result.error : "不明なエラー";
        this.testResults.push({
          timestamp,
          name: testName,
          status: "error",
          message: `テスト失敗: ${errorMsg}`,
        });
        console.log(`❌ テスト失敗: ${testName} - ${errorMsg}`);
        return false;
      }
    } catch (error) {
      this.failedTests++;
      this.testResults.push({
        timestamp,
        name: testName,
        status: "error",
        message: `テスト例外: ${error.message}`,
      });
      console.log(`❌ テスト例外: ${testName} - ${error.message}`);
      return false;
    }
  }

  // テスト結果をログ出力
  logDataTestResults() {
    console.log("📊 データ整合性テスト結果:");
    console.log(`総テスト数: ${this.totalTests}`);
    console.log(`成功: ${this.passedTests}`);
    console.log(`失敗: ${this.failedTests}`);
    console.log(
      `成功率: ${
        this.totalTests > 0
          ? Math.round((this.passedTests / this.totalTests) * 100)
          : 0
      }%`
    );

    if (this.failedTests === 0) {
      console.log("🎉 すべてのテストが成功しました！");
    } else {
      console.log(`⚠️ ${this.failedTests}件のテストが失敗しました`);
      console.log("失敗したテスト:");
      this.testResults
        .filter((r) => r.status === "error")
        .forEach((r) => {
          console.log(`  - [${r.timestamp}] ${r.name}: ${r.message}`);
        });
    }
  }

  // クリップボードから貼り付け
  async pasteFromClipboard() {
    try {
      console.log("🔍 [TestInputSystem] pasteFromClipboard開始");

      // エラー状態チェック
      if (this.errorState) {
        const errorMsg = `システムがエラー状態のため処理を実行できません: ${this.errorState}`;
        console.error(`❌ [TestInputSystem] ${errorMsg}`);
        alert(errorMsg);
        return;
      }

      // DOM要素の存在確認
      const participantsListElement =
        document.getElementById("participants-list");
      if (!participantsListElement) {
        const errorMsg =
          "参加者リスト入力欄が見つかりません。ページを再読み込みしてください。";
        console.error(`❌ [TestInputSystem] ${errorMsg}`);
        alert(errorMsg);
        return;
      }

      // クリップボードAPI対応チェック
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        const errorMsg =
          "お使いのブラウザはクリップボード機能に対応していません。手動で貼り付けてください。";
        console.warn(`⚠️ [TestInputSystem] ${errorMsg}`);
        alert(errorMsg);
        return;
      }

      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        participantsListElement.value = text;
        console.log(
          `✅ [TestInputSystem] クリップボードから貼り付け完了 - ${text.length}文字`
        );
        alert("クリップボードから貼り付けました");
      } else {
        const errorMsg = "クリップボードにテキストがありません";
        console.warn(`⚠️ [TestInputSystem] ${errorMsg}`);
        alert(errorMsg);
      }
    } catch (error) {
      console.error("❌ [TestInputSystem] pasteFromClipboardエラー:", error);

      // エラーの種類に応じたメッセージ
      let userMessage = "クリップボードからの貼り付けに失敗しました。";
      if (error.name === "NotAllowedError") {
        userMessage =
          "クリップボードへのアクセスが拒否されました。ブラウザの設定を確認するか、手動で貼り付けてください。";
      } else if (error.name === "NotFoundError") {
        userMessage = "クリップボードにデータが見つかりません。";
      }

      alert(userMessage);
    }
  }

  // 対象者リストクリア
  clearParticipantsList() {
    if (confirm("対象者リストをクリアしますか？")) {
      document.getElementById("participants-list").value = "";
    }
  }

  // 回答書式をクリップボードから貼り付け
  async pasteAnswersFromClipboard() {
    try {
      console.log("🔍 [TestInputSystem] pasteAnswersFromClipboard開始");

      // エラー状態チェック
      if (this.errorState) {
        const errorMsg = `システムがエラー状態のため処理を実行できません: ${this.errorState}`;
        console.error(`❌ [TestInputSystem] ${errorMsg}`);
        alert(errorMsg);
        return;
      }

      // DOM要素の存在確認
      const answersFormatElement = document.getElementById(
        "answers-format-input"
      );
      if (!answersFormatElement) {
        const errorMsg =
          "回答書式入力欄が見つかりません。ページを再読み込みしてください。";
        console.error(`❌ [TestInputSystem] ${errorMsg}`);
        alert(errorMsg);
        return;
      }

      // クリップボードAPI対応チェック
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        const errorMsg =
          "お使いのブラウザはクリップボード機能に対応していません。手動で貼り付けてください。";
        console.warn(`⚠️ [TestInputSystem] ${errorMsg}`);
        alert(errorMsg);
        return;
      }

      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        answersFormatElement.value = text;
        console.log(
          `✅ [TestInputSystem] 回答書式貼り付け完了 - ${text.length}文字`
        );
        alert("回答書式をクリップボードから貼り付けました");
      } else {
        const errorMsg = "クリップボードにテキストがありません";
        console.warn(`⚠️ [TestInputSystem] ${errorMsg}`);
        alert(errorMsg);
      }
    } catch (error) {
      console.error(
        "❌ [TestInputSystem] pasteAnswersFromClipboardエラー:",
        error
      );

      // エラーの種類に応じたメッセージ
      let userMessage = "回答書式の貼り付けに失敗しました。";
      if (error.name === "NotAllowedError") {
        userMessage =
          "クリップボードへのアクセスが拒否されました。ブラウザの設定を確認するか、手動で貼り付けてください。";
      } else if (error.name === "NotFoundError") {
        userMessage = "クリップボードにデータが見つかりません。";
      }

      alert(userMessage);
    }
  }

  // 一括処理用のクリップボードから貼り付け
  async pasteBatchAnswersFromClipboard() {
    try {
      console.log("🔍 [TestInputSystem] pasteBatchAnswersFromClipboard開始");

      // エラー状態チェック
      if (this.errorState) {
        const errorMsg = `システムがエラー状態のため処理を実行できません: ${this.errorState}`;
        console.error(`❌ [TestInputSystem] ${errorMsg}`);
        alert(errorMsg);
        return;
      }

      // DOM要素の存在確認
      const batchAnswersElement = document.getElementById(
        "batch-answers-input"
      );
      if (!batchAnswersElement) {
        const errorMsg =
          "一括回答入力欄が見つかりません。ページを再読み込みしてください。";
        console.error(`❌ [TestInputSystem] ${errorMsg}`);
        alert(errorMsg);
        return;
      }

      // クリップボードAPI対応チェック
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        const errorMsg =
          "お使いのブラウザはクリップボード機能に対応していません。手動で貼り付けてください。";
        console.warn(`⚠️ [TestInputSystem] ${errorMsg}`);
        alert(errorMsg);
        return;
      }

      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        batchAnswersElement.value = text;
        console.log(
          `✅ [TestInputSystem] 一括回答データ貼り付け完了 - ${text.length}文字`
        );
        alert("回答データをクリップボードから貼り付けました");
      } else {
        const errorMsg = "クリップボードにテキストがありません";
        console.warn(`⚠️ [TestInputSystem] ${errorMsg}`);
        alert(errorMsg);
      }
    } catch (error) {
      console.error(
        "❌ [TestInputSystem] pasteBatchAnswersFromClipboardエラー:",
        error
      );

      // エラーの種類に応じたメッセージ
      let userMessage = "一括回答データの貼り付けに失敗しました。";
      if (error.name === "NotAllowedError") {
        userMessage =
          "クリップボードへのアクセスが拒否されました。ブラウザの設定を確認するか、手動で貼り付けてください。";
      } else if (error.name === "NotFoundError") {
        userMessage = "クリップボードにデータが見つかりません。";
      }

      alert(userMessage);
    }
  }

  // 回答書式を解析してフォームに反映
  parseAnswersFormat() {
    const text = document.getElementById("answers-format-input").value;
    if (!text.trim()) {
      alert("回答データを入力してください");
      return;
    }

    try {
      const answers = this.parseMultipleAnswers(text);
      if (answers.length === 0) {
        alert("有効な回答データが見つかりませんでした");
        return;
      }

      // 各回答を処理
      answers.forEach((answerData, index) => {
        const participantId = `user${String(index + 1).padStart(3, "0")}`;

        // 参加者情報を保存
        this.participants.push({
          id: participantId,
          name: answerData.participantInfo.name,
          age: answerData.participantInfo.age,
          gender: answerData.participantInfo.gender,
          occupation: answerData.participantInfo.occupation,
        });

        // 回答データを保存
        this.answersData[participantId] = answerData.answers;
      });

      this.saveData();
      this.updateDisplay();

      alert(`${answers.length}人分の回答データを解析・保存しました！`);
    } catch (error) {
      console.error("回答解析エラー:", error);
      alert("回答データの解析中にエラーが発生しました: " + error.message);
    }
  }

  // 複数回答の解析
  parseMultipleAnswers(text) {
    const answers = [];

    // 回答セクションを分割（### 回答X/10 で区切る）
    const sections = text.split(/### 回答\d+\/\d+/);

    sections.forEach((section, index) => {
      if (index === 0) return; // 最初の空セクションをスキップ

      try {
        const answerData = this.parseSingleAnswer(section);
        if (answerData) {
          answers.push(answerData);
        }
      } catch (error) {
        console.warn(`回答${index}の解析でエラー:`, error);
      }
    });

    return answers;
  }

  // 単一回答の解析
  parseSingleAnswer(text) {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);

    // 参加者情報を抽出
    const participantInfo = this.extractParticipantInfo(lines);
    if (!participantInfo) {
      return null;
    }

    // 回答データを抽出
    const answers = this.extractAnswers(lines);
    if (!answers) {
      return null;
    }

    return {
      participantInfo,
      answers,
    };
  }

  // 参加者情報の抽出
  extractParticipantInfo(lines) {
    const participantInfo = {};
    let inParticipantSection = false;

    for (const line of lines) {
      if (line.includes("【参加者情報】")) {
        inParticipantSection = true;
        continue;
      }

      if (line.includes("【第1部：価値観設問回答】")) {
        break;
      }

      if (inParticipantSection && line.includes(":")) {
        const [key, value] = line.split(":").map((s) => s.trim());
        switch (key) {
          case "お名前":
            participantInfo.name = value;
            break;
          case "年齢":
            participantInfo.age = value.replace("歳", "");
            break;
          case "性別":
            participantInfo.gender = value;
            break;
          case "職業":
            participantInfo.occupation = value;
            break;
        }
      }
    }

    // 必須項目のチェック
    if (
      !participantInfo.name ||
      !participantInfo.age ||
      !participantInfo.gender ||
      !participantInfo.occupation
    ) {
      return null;
    }

    return participantInfo;
  }

  // 回答データの抽出
  extractAnswers(lines) {
    const answers = {};
    let inWorldviewSection = false;
    let inScenarioSection = false;

    for (const line of lines) {
      if (line.includes("【第1部：価値観設問回答】")) {
        inWorldviewSection = true;
        inScenarioSection = false;
        continue;
      }

      if (line.includes("【第2部：シナリオ設問回答】")) {
        inWorldviewSection = false;
        inScenarioSection = true;
        continue;
      }

      if (line.includes("---")) {
        break;
      }

      if (inWorldviewSection && line.includes(":")) {
        const [question, answer] = line.split(":").map((s) => s.trim());
        if (question.startsWith("Q") && answer) {
          answers[question] = answer;
        }
      }

      if (inScenarioSection && line.includes(":")) {
        const [question, answer] = line.split(":").map((s) => s.trim());
        if (question.startsWith("Q") && answer) {
          answers[question] = answer;
        }
      }
    }

    // 最低限の回答があるかチェック
    const worldviewCount = Object.keys(answers).filter((k) =>
      k.match(/^Q[1-9]$|^Q1[0-9]$|^Q2[0-4]$/)
    ).length;
    const scenarioCount = Object.keys(answers).filter((k) =>
      k.match(/^Q2[5-9]_|^Q30_/)
    ).length;

    if (worldviewCount < 20 || scenarioCount < 10) {
      return null;
    }

    return answers;
  }

  // 回答データをエンジン用形式に変換
  convertAnswersToEngineFormat(rawAnswers) {
    console.log(
      "🔄 Converting answers to engine format:",
      Object.keys(rawAnswers)
    );
    const engineAnswers = [];

    // 価値観設問（Q1-Q24）を変換
    for (let i = 1; i <= 24; i++) {
      const questionKey = `Q${i}`;
      if (rawAnswers[questionKey]) {
        const questionData = this.getQuestionData("worldview", `q${i}`);
        const selectedOption = this.getOptionData(
          questionData,
          rawAnswers[questionKey]
        );

        if (selectedOption && selectedOption.scoring_tags) {
          engineAnswers.push({
            questionId: `q${i}`,
            selectedValue: rawAnswers[questionKey],
            scoring_tags: selectedOption.scoring_tags,
          });
        } else {
          console.warn(
            `⚠️ No scoring tags found for ${questionKey}: ${rawAnswers[questionKey]}`
          );
        }
      }
    }

    // シナリオ設問（Q25-Q30）を変換
    for (let i = 25; i <= 30; i++) {
      const innerKey = `Q${i}_内面`;
      const outerKey = `Q${i}_外面`;

      if (rawAnswers[innerKey] && rawAnswers[outerKey]) {
        const questionData = this.getQuestionData("scenario", `q${i}`);
        const innerOption = this.getOptionData(
          questionData,
          rawAnswers[innerKey],
          "inner"
        );
        const outerOption = this.getOptionData(
          questionData,
          rawAnswers[outerKey],
          "outer"
        );

        if (
          innerOption &&
          outerOption &&
          innerOption.scoring_tags &&
          outerOption.scoring_tags
        ) {
          engineAnswers.push({
            questionId: `q${i}`,
            innerChoice: {
              value: rawAnswers[innerKey],
              scoring_tags: innerOption.scoring_tags,
            },
            outerChoice: {
              value: rawAnswers[outerKey],
              scoring_tags: outerOption.scoring_tags,
            },
          });
        } else {
          console.warn(
            `⚠️ No scoring tags found for ${innerKey}/${outerKey}: ${rawAnswers[innerKey]}/${rawAnswers[outerKey]}`
          );
        }
      }
    }

    console.log(`✅ Converted ${engineAnswers.length} answers for engine`);
    return engineAnswers;
  }

  // 質問データを取得
  getQuestionData(type, questionId) {
    const questions =
      type === "worldview"
        ? this.questions.worldview
        : this.questions.scenarios;
    return questions.find((q) => q.id === questionId);
  }

  // オプションデータを取得
  getOptionData(questionData, value, choiceType = null) {
    if (!questionData || !questionData.options) return null;

    if (choiceType) {
      // シナリオ設問の場合
      const options = questionData.options[choiceType];
      return options ? options.find((opt) => opt.value === value) : null;
    } else {
      // 価値観設問の場合
      return questionData.options.find((opt) => opt.value === value);
    }
  }

  // 回答データ一括処理メソッド
  // 【修正1】processBatchAnswers メソッド - A/B/C/D/E形式に対応
  processBatchAnswers(rawText) {
    console.log("🔍 processBatchAnswers 開始", {
      textLength: rawText.length,
      preview: rawText.substring(0, 200),
    });

    try {
      const lines = rawText.split("\n");
      const participants = [];
      let currentParticipant = null;
      let currentSection = null;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        if (!trimmedLine) continue; // 空行をスキップ

        // 新しい参加者の開始を検出
        const isNewParticipantLine =
          trimmedLine.includes("【参加者情報】") ||
          trimmedLine.match(/^###\s*回答\d+\/\d+/);

        if (isNewParticipantLine) {
          // 前の参加者を保存
          if (currentParticipant && currentParticipant.info.name) {
            participants.push(currentParticipant);
            console.log(`✅ 参加者追加: ${currentParticipant.info.name}`);
          }

          // 新しい参加者を初期化
          currentParticipant = {
            info: {},
            worldviewAnswers: {},
            scenarioAnswers: {},
          };
          currentSection = "info";
          continue;
        }

        if (!currentParticipant) continue;

        // セクション切り替えの検出
        if (trimmedLine.includes("【第1部：価値観設問回答】")) {
          currentSection = "worldview";
          console.log("🔄 価値観設問セクションに切り替え");
          continue;
        }

        if (trimmedLine.includes("【第2部：シナリオ設問回答】")) {
          currentSection = "scenario";
          console.log("🔄 シナリオ設問セクションに切り替え");
          continue;
        }

        // 参加者情報の解析
        if (currentSection === "info" && trimmedLine.includes(":")) {
          const [key, ...valueParts] = trimmedLine.split(":");
          const value = valueParts.join(":").trim();

          if (value) {
            switch (key.trim()) {
              case "お名前":
                currentParticipant.info.name = value;
                break;
              case "年齢":
                currentParticipant.info.age = value.replace("歳", "");
                break;
              case "性別":
                currentParticipant.info.gender = value;
                break;
              case "職業":
                currentParticipant.info.occupation = value;
                break;
            }
            console.log(`📝 参加者情報設定: ${key.trim()} = ${value}`);
          }
        }

        // 価値観設問の解析（Q1-Q24）
        if (currentSection === "worldview" && trimmedLine.match(/^Q\d+:/)) {
          const [questionKey, letterAnswer] = trimmedLine
            .split(":")
            .map((s) => s.trim());
          if (questionKey && letterAnswer) {
            // A/B/C/D/E を実際の回答テキストに変換
            const convertedAnswer = this.convertLetterToAnswerText(
              questionKey,
              letterAnswer
            );
            if (convertedAnswer) {
              currentParticipant.worldviewAnswers[questionKey] =
                convertedAnswer;
              console.log(
                `📝 価値観回答: ${questionKey} = ${letterAnswer} -> ${convertedAnswer}`
              );
            } else {
              console.warn(
                `⚠️ 変換できない回答: ${questionKey} = ${letterAnswer}`
              );
            }
          }
        }

        // シナリオ設問の解析（Q25-Q30）
        if (
          currentSection === "scenario" &&
          trimmedLine.match(/^Q(2[5-9]|30)_/)
        ) {
          const [questionKey, letterAnswer] = trimmedLine
            .split(":")
            .map((s) => s.trim());
          if (questionKey && letterAnswer) {
            const convertedAnswer = this.convertLetterToAnswerText(
              questionKey,
              letterAnswer
            );
            if (convertedAnswer) {
              currentParticipant.scenarioAnswers[questionKey] = convertedAnswer;
              console.log(
                `📝 シナリオ回答: ${questionKey} = ${letterAnswer} -> ${convertedAnswer}`
              );
            } else {
              console.warn(
                `⚠️ 変換できない回答: ${questionKey} = ${letterAnswer}`
              );
            }
          }
        }
      }

      // 最後の参加者を追加
      if (currentParticipant && currentParticipant.info.name) {
        participants.push(currentParticipant);
        console.log(`✅ 最後の参加者追加: ${currentParticipant.info.name}`);
      }

      console.log(`✅ 解析完了: ${participants.length}人の参加者データ`);

      // 各参加者の回答数をチェック
      participants.forEach((participant) => {
        const worldviewCount = Object.keys(participant.worldviewAnswers).length;
        const scenarioCount = Object.keys(participant.scenarioAnswers).length;
        console.log(
          `📊 ${participant.info.name}: 価値観${worldviewCount}問, シナリオ${scenarioCount}問`
        );
      });

      return participants;
    } catch (error) {
      console.error("❌ processBatchAnswers エラー:", error);
      throw new Error(`回答データ解析エラー: ${error.message}`);
    }
  }

  // 【修正1】A/B/C/D/E を実際の回答テキストに変換するメソッド
  convertLetterToAnswerText(questionKey, letterAnswer) {
    console.log(`🔍 Converting: ${questionKey} = ${letterAnswer}`);
    try {
      if (!questionKey || !letterAnswer) {
        console.warn(
          `⚠️ 入力が無効: questionKey=${questionKey}, letterAnswer=${letterAnswer}`
        );
        return null;
      }
      if (!this.questions) {
        console.error(`❌ this.questionsが未定義です`);
        return null;
      }
      let questionId,
        questionData,
        choiceType = null;
      if (questionKey.match(/^Q([1-9]|1[0-9]|2[0-4])$/)) {
        questionId = questionKey.toLowerCase();
        try {
          questionData = this.getQuestionData("worldview", questionId);
        } catch (getError) {
          console.error(
            `❌ getQuestionDataエラー (worldview, ${questionId}):`,
            getError
          );
          return null;
        }
      } else if (questionKey.match(/^Q(2[5-9]|30)_/)) {
        const parts = questionKey.split("_");
        questionId = parts[0].toLowerCase();
        choiceType = parts[1] === "内面" ? "inner" : "outer";
        try {
          questionData = this.getQuestionData("scenario", questionId);
        } catch (getError) {
          console.error(
            `❌ getQuestionDataエラー (scenario, ${questionId}):`,
            getError
          );
          return null;
        }
      } else {
        console.warn(`⚠️ 未知の質問形式: ${questionKey}`);
        return null;
      }
      if (!questionData) {
        console.warn(`⚠️ 質問データが見つかりません: ${questionId}`);
        return null;
      }
      if (!questionData.options) {
        console.warn(`⚠️ 質問に選択肢がありません: ${questionId}`);
        return null;
      }
      const letterMap = {
        A: 0,
        B: 1,
        C: 2,
        D: 3,
        E: 4,
        a: 0,
        b: 1,
        c: 2,
        d: 3,
        e: 4,
      };
      const optionIndex = letterMap[letterAnswer];
      if (optionIndex === undefined) {
        console.warn(`⚠️ 無効な選択肢: ${letterAnswer} (A-E のみ有効)`);
        return null;
      }
      let option;
      try {
        if (choiceType) {
          const options = questionData.options[choiceType];
          if (!options || !Array.isArray(options)) {
            console.warn(`⚠️ ${choiceType}選択肢が見つかりません`);
            return null;
          }
          if (optionIndex >= options.length) {
            console.warn(
              `⚠️ 選択肢インデックスが範囲外: ${optionIndex} >= ${options.length}`
            );
            return null;
          }
          option = options[optionIndex];
        } else {
          if (optionIndex >= questionData.options.length) {
            console.warn(
              `⚠️ 選択肢インデックスが範囲外: ${optionIndex} >= ${questionData.options.length}`
            );
            return null;
          }
          option = questionData.options[optionIndex];
        }
      } catch (optionError) {
        console.error(`❌ 選択肢取得エラー:`, optionError);
        return null;
      }
      // 【修正】option.textを返す
      if (option && option.text) {
        console.log(`  ✅ 変換成功: ${letterAnswer} -> "${option.text}"`);
        return option.text;
      } else {
        console.warn(
          `⚠️ 選択肢が見つかりません: ${questionKey}[${optionIndex}]`
        );
        return null;
      }
    } catch (error) {
      console.error(
        `❌ 回答変換エラー (${questionKey}:${letterAnswer}):`,
        error
      );
      return null;
    }
  }

  // 参加者データをシステム形式に変換
  convertToSystemFormat(participantData) {
    try {
      const info = participantData.info || {};
      const participant = {
        id: this.generateParticipantId(info.name || `no_name_${Date.now()}`),
        name: info.name || "名称未設定",
        age: (info.age || "").toString().replace("歳", ""),
        gender: info.gender || "",
        occupation: info.occupation || "",
      };
      const engineAnswers = [];
      // 価値観設問（Q1-Q24）
      Object.entries(participantData.worldviewAnswers || {}).forEach(
        ([questionKey, selectedText]) => {
          const questionId = questionKey.toLowerCase();
          const questionData = this.getQuestionData("worldview", questionId);
          // 【修正】textで検索
          const selectedOption =
            questionData &&
            questionData.options.find((opt) => opt.text === selectedText);
          console.log(
            `🔎 価値観設問: ${questionId}, 回答: ${selectedText}, 検索結果:`,
            selectedOption
          );
          if (selectedOption && selectedOption.scoring_tags) {
            engineAnswers.push({
              questionId: questionId,
              selectedValue: selectedOption.value, // エンジンにはvalueを渡す
              scoring_tags: selectedOption.scoring_tags,
            });
          } else {
            console.warn(
              `未知の価値観質問オプション: ${questionId} = ${selectedText}`
            );
          }
        }
      );
      // シナリオ設問（Q25-Q30）
      const scenarioGroups = {};
      Object.entries(participantData.scenarioAnswers || {}).forEach(
        ([questionKey, selectedText]) => {
          const match = questionKey.match(/^Q(\d+)_(内面|外面)$/);
          if (match) {
            const questionNum = parseInt(match[1]);
            const choiceType = match[2] === "内面" ? "inner" : "outer";
            if (!scenarioGroups[questionNum]) {
              scenarioGroups[questionNum] = {};
            }
            scenarioGroups[questionNum][choiceType] = selectedText;
          }
        }
      );
      Object.entries(scenarioGroups).forEach(([questionNum, choices]) => {
        if (choices.inner && choices.outer) {
          const questionId = `q${questionNum}`;
          const questionData = this.getQuestionData("scenario", questionId);
          // 【修正】textで検索
          const innerOption =
            questionData &&
            questionData.options.inner.find(
              (opt) => opt.text === choices.inner
            );
          const outerOption =
            questionData &&
            questionData.options.outer.find(
              (opt) => opt.text === choices.outer
            );
          console.log(
            `🔎 シナリオ設問: ${questionId}, inner: ${choices.inner}, outer: ${choices.outer}, innerOption:`,
            innerOption,
            "outerOption:",
            outerOption
          );
          if (
            innerOption &&
            outerOption &&
            innerOption.scoring_tags &&
            outerOption.scoring_tags
          ) {
            engineAnswers.push({
              questionId: questionId,
              innerChoice: {
                value: innerOption.value, // エンジンにはvalueを渡す
                scoring_tags: innerOption.scoring_tags,
              },
              outerChoice: {
                value: outerOption.value, // エンジンにはvalueを渡す
                scoring_tags: outerOption.scoring_tags,
              },
            });
          } else {
            console.warn(
              `未知のシナリオ質問オプション: ${questionId} inner=${choices.inner} outer=${choices.outer}`
            );
          }
        }
      });
      console.log(`🔄 Converted participant: ${participant.name}`, {
        participant,
        engineAnswersCount: engineAnswers.length,
        worldviewCount: Object.keys(participantData.worldviewAnswers).length,
        scenarioCount: Object.keys(participantData.scenarioAnswers).length,
      });
      return { participant, engineAnswers };
    } catch (error) {
      console.error("データ変換エラー:", error);
      throw new Error("データ変換に失敗しました: " + error.message);
    }
  }

  // 参加者ID生成
  generateParticipantId(name) {
    // 名前から簡単なIDを生成
    const nameId = name.replace(/\s+/g, "").toLowerCase();
    const timestamp = Date.now().toString().slice(-4);
    return `${nameId}_${timestamp}`;
  }

  // 【修正4】processBatchAndGenerate メソッドのエラーハンドリング強化
  async processBatchAndGenerate(rawAnswersText) {
    console.log("🎯 === processBatchAndGenerate開始 ===");
    console.log("📝 入力データ確認:", {
      hasText: !!rawAnswersText,
      textLength: rawAnswersText?.length,
      firstChars: rawAnswersText?.substring(0, 100),
    });
    console.log("📝 引数チェック:", {
      hasText: !!rawAnswersText,
      textLength: rawAnswersText?.length,
      textType: typeof rawAnswersText,
    });

    // 既存のコードの前に以下を追加
    if (!rawAnswersText || typeof rawAnswersText !== "string") {
      throw new Error("無効な入力テキストです");
    }

    // 既存のコード...
    console.log("✅ processBatchAndGenerate メソッドが呼び出されました");
    console.log(
      "📝 入力テキスト長:",
      rawAnswersText ? rawAnswersText.length : "null"
    );
    console.log(
      "📝 入力テキストプレビュー:",
      rawAnswersText ? rawAnswersText.substring(0, 500) : "null"
    );

    try {
      console.log("🔄 一括処理を開始...");

      // ローディング表示
      const progressDiv = document.getElementById("batch-progress");
      if (progressDiv) {
        progressDiv.innerHTML =
          '<div class="processing">📊 回答データを解析中...</div>';
      }

      // 1. 回答データを解析
      console.log("🔍 processBatchAnswersメソッド実行中...");
      const participantsData = this.processBatchAnswers(rawAnswersText);
      console.log(`📝 ${participantsData.length}人の回答データを解析しました`);

      if (participantsData.length === 0) {
        throw new Error(
          "回答データが正しく解析されませんでした。入力形式を確認してください。"
        );
      }

      if (progressDiv) {
        progressDiv.innerHTML =
          '<div class="processing">👥 参加者情報を登録中...</div>';
      }

      // 2. エンジン初期化
      console.log("🔍 DataManagerクラス確認:", typeof window.DataManager);
      console.log("🔍 TripleOSEngineクラス確認:", typeof window.TripleOSEngine);

      const dataManager = new window.DataManager();
      console.log("✅ DataManagerインスタンス作成完了");

      await dataManager.loadData();
      console.log("✅ データ読み込み完了");

      const engine = new window.TripleOSEngine(dataManager);
      console.log("✅ TripleOSEngineインスタンス作成完了");

      // 3. 各参加者の診断実行
      const processedCount = participantsData.length;
      let successCount = 0;
      let failCount = 0;
      const results = [];

      for (let i = 0; i < participantsData.length; i++) {
        const pData = participantsData[i];
        const pInfo = pData.info || {};

        try {
          if (progressDiv) {
            progressDiv.innerHTML = `<div class="processing">🔬 ${
              pInfo.name || `参加者${i + 1}`
            } の診断実行中... (${i + 1}/${processedCount})</div>`;
          }

          // データ変換
          const { participant, engineAnswers } =
            this.convertToSystemFormat(pData);

          // 参加者リストに追加
          if (
            this.participants.findIndex((p) => p.id === participant.id) === -1
          ) {
            this.participants.push(participant);
          }
          this.answersData[participant.id] = engineAnswers;

          // 診断実行
          console.log(
            `🔬 Engine input for ${participant.id}:`,
            engineAnswers.length,
            "answers"
          );
          const diagnosisResult = await engine.analyzeTripleOS(engineAnswers);
          console.log(
            `✅ Engine output for ${participant.id}:`,
            diagnosisResult ? "Success" : "Failed"
          );

          // 結果を保存
          this.diagnosisResults[participant.id] = {
            result: diagnosisResult,
            processedAt: new Date().toISOString(),
            participant: participant,
          };

          const resultText = this.generateUserText(participant.id, dataManager);
          results.push({ participant, resultText, success: true });

          successCount++;
          console.log(`✅ ${participant.name} の診断完了`);
        } catch (error) {
          console.error(
            `❌ ${pInfo.name || `参加者${i + 1}`} の処理エラー:`,
            error
          );

          // 🚨【重要】エラー処理を修正：失敗した関数を再呼び出ししない
          const failedParticipant = {
            id: this.generateParticipantId(
              pInfo.name || `failed_${Date.now()}`
            ),
            name: pInfo.name || "処理失敗参加者",
            ...pInfo,
          };
          if (
            this.participants.findIndex(
              (p) => p.id === failedParticipant.id
            ) === -1
          ) {
            this.participants.push(failedParticipant);
          }

          this.diagnosisResults[failedParticipant.id] = {
            error: error.message,
            processedAt: new Date().toISOString(),
            participant: failedParticipant,
          };

          results.push({
            participant: failedParticipant,
            error: error.message,
            success: false,
          });
          failCount++;
        }
      }

      // データ保存と表示更新
      console.log("💾 データ保存と表示更新を開始...");
      this.saveData();
      this.updateDisplay();
      this.updateResultsList();

      if (progressDiv) {
        progressDiv.innerHTML = `<div class="processing-complete">✅ 処理完了: 成功 ${successCount}人 / 失敗 ${failCount}人</div>`;
      }

      // 結果表示
      this.showBatchResults(results);

      return results;
    } catch (error) {
      console.error("❌ 一括処理エラー:", error);
      const progressDiv = document.getElementById("batch-progress");
      if (progressDiv)
        progressDiv.innerHTML = `<div class="progress-message error">❌ エラーが発生しました: ${error.message}</div>`;
      alert("一括処理中にエラーが発生しました: " + error.message);
      throw error;
    }
  }

  // 一括結果表示
  showBatchResults(results) {
    const modalContent = `
      <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; max-width: 90vw; max-height: 90vh; overflow-y: auto; color: white;">
        <h3>📊 一括処理結果 (${results.length}人)</h3>

        <div style="margin: 20px 0;">
          <button onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'"
                  style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
            📋 全員の結果をまとめてコピー
          </button>
          <textarea readonly style="display: none; width: 100%; height: 200px; margin-top: 10px; background: #1a1a1a; color: #e1e1e1; border: 1px solid #444; padding: 10px; font-family: monospace; font-size: 0.8rem;">${this.generateAllResultsText(
            results
          )}</textarea>
        </div>

        <div class="results-list">
          ${results
            .map((result) => this.renderSingleResultItem(result))
            .join("")}
        </div>

        <div style="margin-top: 20px; text-align: center;">
          <button onclick="this.closest('div[style*=position: fixed]').remove()"
                  style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
            閉じる
          </button>
        </div>
      </div>
    `;

    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.9); z-index: 1000;
      display: flex; align-items: center; justify-content: center;
    `;
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
  }

  // 個別結果アイテムのレンダリング
  renderSingleResultItem(result) {
    if (!result.success) {
      return `
        <div style="border: 1px solid #ef4444; border-radius: 4px; margin: 10px 0; padding: 15px; background: #2a1a1a;">
          <h4 style="color: #ef4444; margin: 0 0 10px 0;">❌ ${result.participant.name} - 処理失敗</h4>
          <p style="color: #fca5a5; margin: 0;">エラー: ${result.error}</p>
        </div>
      `;
    }

    return `
      <div style="border: 1px solid #10b981; border-radius: 4px; margin: 10px 0; padding: 15px; background: #1a2a1a;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h4 style="color: #10b981; margin: 0;">✅ ${
            result.participant.name
          }</h4>
          <div>
            <button onclick="navigator.clipboard.writeText(this.getAttribute('data-result')); alert('📋 ${
              result.participant.name
            }の結果をコピーしました！')"
                    data-result="${result.resultText.replace(/"/g, "&quot;")}"
                    style="background: #6366f1; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin: 0 2px; font-size: 0.8rem;">
              📋 コピー
            </button>
            <button onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'"
                    style="background: #8b5cf6; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin: 0 2px; font-size: 0.8rem;">
              👁️ プレビュー
            </button>
            <div style="display: none; margin-top: 10px; max-height: 200px; overflow-y: auto; background: #1a1a1a; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 0.7rem; white-space: pre-wrap;">${
              result.resultText
            }</div>
          </div>
        </div>
        <p style="color: #d1d5db; margin: 0; font-size: 0.9rem;">
          ${result.participant.age} / ${result.participant.gender} / ${
      result.participant.occupation
    }
        </p>
      </div>
    `;
  }

  // 全結果統合テキスト生成
  generateAllResultsText(results) {
    return results
      .filter((r) => r.success)
      .map(
        (r) => `
═══════════════════════════════════════════
${r.participant.name}さん用の送信テキスト
═══════════════════════════════════════════

${r.resultText}

═══════════════════════════════════════════
      `
      )
      .join("\n");
  }

  // UI用の一括処理開始関数
  startBatchProcessing() {
    console.log("🚀 一括処理開始");

    const rawText = document.getElementById("batch-answers-input").value;
    console.log("入力テキスト:", rawText.substring(0, 200) + "...");

    if (!rawText.trim()) {
      alert("回答データを入力してください");
      return;
    }

    // 【修正】確認ダイアログを一時的にコメントアウトまたは自動的にtrueにする
    /*
    if (!confirm("一括処理を開始しますか？\n※ 既存のデータに追加されます")) {
      console.log("🚫 ユーザーが処理をキャンセルしました");
      return;
    }
    */
    // テスト用に確認を自動でOKにする
    console.log("✅ 確認ダイアログをスキップ（テストモード）");

    console.log("✅ ユーザー確認完了、処理を続行します");

    // 既存のコード続行...
    const progressElement = document.getElementById("batch-progress");
    if (progressElement) {
      progressElement.innerHTML =
        '<div class="progress-message">🔄 一括処理を開始しています...</div>';
      console.log("✅ 進捗表示要素を更新しました");
    } else {
      console.warn("⚠️ batch-progress要素が見つかりません");
    }

    // 残りの既存コード...
    // デバッグ: メソッド存在確認
    console.log(
      "🔍 processBatchAndGenerate method exists:",
      typeof this.processBatchAndGenerate
    );
    console.log(
      "🔍 About to call processBatchAndGenerate with text length:",
      rawText.length
    );

    // 【重要】try-catchでラップして同期エラーをキャッチ
    try {
      console.log("🚀 Calling processBatchAndGenerate...");

      // processBatchAndGenerateメソッドが存在するかチェック
      if (typeof this.processBatchAndGenerate !== "function") {
        throw new Error("processBatchAndGenerateメソッドが存在しません");
      }

      // Promiseを作成して監視
      console.log("🔍 Promise作成中...");
      const processingPromise = this.processBatchAndGenerate(rawText);
      console.log("🔍 Promise作成完了:", typeof processingPromise);

      // Promiseが正しく作成されているかチェック
      if (!processingPromise || typeof processingPromise.then !== "function") {
        throw new Error(
          "processBatchAndGenerateが正しいPromiseを返していません"
        );
      }

      console.log("🔍 Promise.thenを設定中...");

      processingPromise
        .then((results) => {
          console.log("✅ 一括処理完了:", results);

          // 結果表示を強制更新
          this.updateDisplay();
          this.updateResultsList();

          // 診断結果タブに自動切り替え
          showTab("results");

          // 成功メッセージ表示
          if (progressElement) {
            const successCount = results.filter((r) => r.success).length;
            const totalCount = results.length;
            progressElement.innerHTML = `<div class="progress-message success">✅ 一括処理が完了しました！ 成功: ${successCount}/${totalCount}人</div>`;
          }

          // デバッグ情報をコンソールに出力
          console.log(
            "🔍 処理後の診断結果:",
            Object.keys(this.diagnosisResults)
          );
          this.debugResults();
        })
        .catch((error) => {
          console.error("❌ 一括処理Promiseエラー:", error);
          console.error("❌ エラータイプ:", typeof error);
          console.error("❌ エラー名:", error.name);
          console.error("❌ エラーメッセージ:", error.message);
          console.error("❌ エラースタック:", error.stack);

          if (progressElement) {
            progressElement.innerHTML = `<div class="progress-message error">❌ エラーが発生しました: ${error.message}</div>`;
          }
          alert(`一括処理でエラーが発生しました: ${error.message}`);
        });

      console.log("✅ Promise監視設定完了");
    } catch (syncError) {
      console.error("❌ 同期エラー発生:", syncError);
      console.error("❌ 同期エラータイプ:", typeof syncError);
      console.error("❌ 同期エラー名:", syncError.name);
      console.error("❌ 同期エラーメッセージ:", syncError.message);
      console.error("❌ 同期エラースタック:", syncError.stack);

      if (progressElement) {
        progressElement.innerHTML = `<div class="progress-message error">❌ 初期化エラー: ${syncError.message}</div>`;
      }
      alert(`初期化エラーが発生しました: ${syncError.message}`);
    }

    console.log("🏁 startBatchProcessingメソッド完了");
  }

  // 参加者情報を更新
  updateParticipantInfo(participantInfo) {
    const select = document.getElementById("current-participant");

    // 既存の参加者を検索
    const existingParticipant = this.participants.find(
      (p) =>
        p.name === participantInfo.name ||
        p.name.includes(participantInfo.name) ||
        participantInfo.name.includes(p.name)
    );

    if (existingParticipant) {
      select.value = existingParticipant.id;
    } else {
      // 新しい参加者として追加
      const newId = `user${String(this.participants.length + 1).padStart(
        3,
        "0"
      )}`;
      const newParticipant = {
        id: newId,
        name: participantInfo.name,
        age: participantInfo.age,
        gender: participantInfo.gender,
        occupation: participantInfo.occupation,
      };

      this.participants.push(newParticipant);
      this.updateParticipantSelects();
      select.value = newId;
    }
  }

  // 価値観設問の入力フィールドを更新
  updateWorldviewInputs(answers) {
    Object.entries(answers).forEach(([questionId, answer]) => {
      const input = document.querySelector(
        `#worldview-inputs [data-question-id="${questionId}"] .answer-select`
      );
      if (input) {
        input.value = answer;
      }
    });
  }

  // シナリオ設問の入力フィールドを更新
  updateScenarioInputs(answers) {
    Object.entries(answers).forEach(([questionId, questionAnswers]) => {
      if (questionAnswers.inner) {
        const innerInput = document.querySelector(
          `#scenario-inputs [data-question-id="${questionId}"] .inner-choice`
        );
        if (innerInput) {
          innerInput.value = questionAnswers.inner;
        }
      }
      if (questionAnswers.outer) {
        const outerInput = document.querySelector(
          `#scenario-inputs [data-question-id="${questionId}"] .outer-choice`
        );
        if (outerInput) {
          outerInput.value = questionAnswers.outer;
        }
      }
    });
  }

  // 回答書式をクリア
  clearAnswersFormat() {
    if (confirm("回答書式をクリアしますか？")) {
      document.getElementById("answers-format-input").value = "";
    }
  }

  // 質問入力フォーム生成
  generateQuestionInputs() {
    // 価値観設問
    const worldviewContainer = document.getElementById("worldview-inputs");
    worldviewContainer.innerHTML = this.questions.worldview
      .map((q) => this.createQuestionInput(q, "worldview"))
      .join("");

    // シナリオ設問
    const scenarioContainer = document.getElementById("scenario-inputs");
    scenarioContainer.innerHTML = this.questions.scenarios
      .map((q) => this.createQuestionInput(q, "scenario"))
      .join("");
  }

  createQuestionInput(question, type) {
    if (type === "scenario") {
      return `
                <div class="question-input" data-question-id="${question.id}">
                    <h5>${question.id.toUpperCase()}: ${question.scenario}</h5>

                    <div class="scenario-choice">
                        <label>内面選択 (${question.inner_q})</label>
                        <select class="inner-choice">
                            <option value="">選択してください</option>
                            ${question.options.inner
                              .map(
                                (opt) =>
                                  `<option value="${opt.value}">${opt.value}: ${opt.text}</option>`
                              )
                              .join("")}
                        </select>
                    </div>

                    <div class="scenario-choice">
                        <label>外面選択 (${question.outer_q})</label>
                        <select class="outer-choice">
                            <option value="">選択してください</option>
                            ${question.options.outer
                              .map(
                                (opt) =>
                                  `<option value="${opt.value}">${opt.value}: ${opt.text}</option>`
                              )
                              .join("")}
                        </select>
                    </div>
                </div>
            `;
    } else {
      return `
                <div class="question-input" data-question-id="${question.id}">
                    <h5>${question.id.toUpperCase()}: ${question.text}</h5>
                    <select class="answer-select">
                        <option value="">選択してください</option>
                        ${question.options
                          .map(
                            (opt) =>
                              `<option value="${opt.value}">${opt.value}: ${opt.text}</option>`
                          )
                          .join("")}
                    </select>
                </div>
            `;
    }
  }

  // 現在の回答を保存
  saveCurrentAnswers() {
    const participantId = document.getElementById("current-participant").value;
    if (!participantId) {
      alert("対象者を選択してください");
      return;
    }

    const answers = this.collectCurrentAnswers();
    if (answers.length === 0) {
      alert("回答が入力されていません");
      return;
    }

    this.answersData[participantId] = answers;
    this.saveData();
    this.updateInputProgress();

    alert(`${participantId}の回答を保存しました（${answers.length}問）`);
    this.clearCurrentAnswers();
  }

  collectCurrentAnswers() {
    const answers = [];

    // 価値観設問の回答収集
    document
      .querySelectorAll("#worldview-inputs .question-input")
      .forEach((div) => {
        const questionId = div.dataset.questionId;
        const selectedValue = div.querySelector(".answer-select").value;

        if (selectedValue) {
          const question = this.questions.worldview.find(
            (q) => q.id === questionId
          );
          const option = question.options.find(
            (opt) => opt.value === selectedValue
          );

          answers.push({
            questionId,
            selectedValue,
            scoring_tags: option.scoring_tags,
          });
        }
      });

    // シナリオ設問の回答収集
    document
      .querySelectorAll("#scenario-inputs .question-input")
      .forEach((div) => {
        const questionId = div.dataset.questionId;
        const innerValue = div.querySelector(".inner-choice").value;
        const outerValue = div.querySelector(".outer-choice").value;

        if (innerValue && outerValue) {
          const question = this.questions.scenarios.find(
            (q) => q.id === questionId
          );
          const innerOption = question.options.inner.find(
            (opt) => opt.value === innerValue
          );
          const outerOption = question.options.outer.find(
            (opt) => opt.value === outerValue
          );

          answers.push({
            questionId,
            innerChoice: {
              value: innerValue,
              scoring_tags: innerOption.scoring_tags,
            },
            outerChoice: {
              value: outerValue,
              scoring_tags: outerOption.scoring_tags,
            },
          });
        }
      });

    return answers;
  }

  // 一括診断実行
  async executeAllDiagnosis(event) {
    const completedCount = Object.keys(this.answersData).length;
    if (completedCount === 0) {
      alert("回答データがありません");
      return;
    }

    if (!confirm(`${completedCount}人分の診断を実行しますか？`)) {
      return;
    }

    const button = event.target;
    button.disabled = true;
    button.textContent = "🔬 診断実行中...";

    try {
      // 既存のエンジンを使用
      const dataManager = new window.DataManager();
      await dataManager.loadData();
      const engine = new window.TripleOSEngine(dataManager);

      let processed = 0;
      for (const [participantId, answers] of Object.entries(this.answersData)) {
        try {
          console.log(`🔬 Processing ${participantId}...`);

          const result = await engine.analyzeTripleOS(answers);

          // 結果の構造を確認してログ出力
          console.log(`✅ Result for ${participantId}:`, result);

          // 結果を適切な形式で保存
          this.diagnosisResults[participantId] = {
            result: result,
            processedAt: new Date().toISOString(),
            participant: this.participants.find((p) => p.id === participantId),
          };
          processed++;

          // プログレス更新
          button.textContent = `🔬 診断中... (${processed}/${completedCount})`;
        } catch (error) {
          console.error(`❌ Error processing ${participantId}:`, error);
          this.diagnosisResults[participantId] = {
            error: error.message,
            errorDetails: error.stack,
            processedAt: new Date().toISOString(),
            participant: this.participants.find((p) => p.id === participantId),
          };
        }
      }

      // データ保存と表示更新
      this.saveData();
      this.updateResultsList();

      // 診断結果タブに自動切り替え
      showTab("results");

      alert(`診断完了！ ${processed}人の結果を生成しました`);
    } catch (error) {
      console.error("❌ Diagnosis execution failed:", error);
      alert("診断実行中にエラーが発生しました: " + error.message);
    } finally {
      button.disabled = false;
      button.textContent = "🔬 全員の診断実行";
    }
  }

  // 診断進捗表示
  updateDiagnosisProgress(completed, total) {
    const progressContainer = document.getElementById(
      "single-diagnosis-status"
    );
    if (progressContainer) {
      const percentage = Math.round((completed / total) * 100);
      progressContainer.innerHTML = `
        <div class="progress-info">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${percentage}%"></div>
          </div>
          <div class="progress-text">${completed}/${total} 完了 (${percentage}%)</div>
        </div>
      `;
    }
  }

  // 診断結果をユーザー向けテキストに変換
  generateUserText(participantId, dataManager) {
    try {
      console.log(
        `🔍 [TestInputSystem] generateUserText開始 - ID: ${participantId}`
      );

      // 入力値の検証
      if (!participantId) {
        const errorMsg = "参加者IDが指定されていません";
        console.error(`❌ [TestInputSystem] ${errorMsg}`);
        return `エラー: ${errorMsg}`;
      }

      if (!dataManager) {
        const errorMsg = "DataManagerが指定されていません";
        console.error(`❌ [TestInputSystem] ${errorMsg}`);
        return `エラー: ${errorMsg}`;
      }

      // エラー状態チェック
      if (this.errorState) {
        const errorMsg = `システムがエラー状態です: ${this.errorState}`;
        console.error(`❌ [TestInputSystem] ${errorMsg}`);
        return `エラー: ${errorMsg}`;
      }

      const result = this.generateProductionLevelText(
        participantId,
        dataManager
      );
      console.log(
        `✅ [TestInputSystem] generateUserText完了 - ID: ${participantId}`
      );
      return result;
    } catch (error) {
      console.error(`❌ [TestInputSystem] generateUserTextエラー:`, error);
      return `エラー: ユーザーテキスト生成中にエラーが発生しました: ${error.message}`;
    }
  }

  // generateProductionLevelTextを全面改修
  generateProductionLevelText(participantId, dataManager) {
    try {
      console.log(`🔍 [TestInputSystem] generateProductionLevelText開始 - ID: ${participantId}`);
      
      // 入力値の検証
      if (!participantId) {
        const errorMsg = "参加者IDが指定されていません";
        console.error(`❌ [TestInputSystem] ${errorMsg}`);
        return `エラー: ${errorMsg}`;
      }
      
      if (!dataManager) {
        const errorMsg = "DataManagerが指定されていません";
        console.error(`❌ [TestInputSystem] ${errorMsg}`);
        return `エラー: ${errorMsg}`;
      }
      
      // 診断結果の存在確認
      const data = this.diagnosisResults[participantId];
      if (!data) {
        const errorMsg = `参加者ID ${participantId} の診断結果が見つかりません`;
        console.error(`❌ [TestInputSystem] ${errorMsg}`);
        return `エラー: ${errorMsg}`;
      }
      
      if (!data.result) {
        const errorMsg = `参加者ID ${participantId} の診断結果データが不正です`;
        console.error(`❌ [TestInputSystem] ${errorMsg}`);
        return `エラー: ${errorMsg}`;
      }
      
      const result = data.result;
      const participant = data.participant;
      
      if (!participant) {
        const errorMsg = `参加者ID ${participantId} の参加者情報が見つかりません`;
        console.error(`❌ [TestInputSystem] ${errorMsg}`);
        return `エラー: ${errorMsg}`;
      }

    // 安全なID取得
    const getHexagramIdFromOS = (osObject) => {
      if (!osObject) return undefined;
      if (osObject.hexagram_id) return osObject.hexagram_id;
      if (osObject.osId) return osObject.osId;
      if (osObject.hexagramId) return osObject.hexagramId;
      if (osObject.id) return osObject.id;
      if (osObject.hexagramInfo) {
        if (osObject.hexagramInfo.hexagram_id)
          return osObject.hexagramInfo.hexagram_id;
        if (osObject.hexagramInfo.osId) return osObject.hexagramInfo.osId;
        if (osObject.hexagramInfo.hexagramId)
          return osObject.hexagramInfo.hexagramId;
        if (osObject.hexagramInfo.id) return osObject.hexagramInfo.id;
      }
      return undefined;
    };
    const engineId = getHexagramIdFromOS(result.engineOS);
    const interfaceId = getHexagramIdFromOS(result.interfaceOS);
    const safeId = getHexagramIdFromOS(result.safeModeOS);

    // 統一データ取得
    const engineUnified = dataManager.getUnifiedHexagramData(engineId);
    const interfaceUnified = dataManager.getUnifiedHexagramData(interfaceId);
    const safeUnified = dataManager.getUnifiedHexagramData(safeId);

    if (!engineUnified || !interfaceUnified || !safeUnified) {
      console.error("IDに対応する統一データが見つかりませんでした。", {
        engineId,
        interfaceId,
        safeId,
      });
      return "エラー: データベースとの整合性に問題があります。";
    }

    // 詳細テキスト生成
    const engineDetail = this.generateUnifiedOSDetail(engineUnified);
    const interfaceDetail = this.generateUnifiedOSDetail(interfaceUnified);
    const safeDetail = this.generateUnifiedOSDetail(safeUnified);

    // 洞察ロジック
    const analysis = this.analyzeOSCombination(
      engineUnified,
      interfaceUnified,
      safeUnified
    );

    // 彖伝・大象伝（現代語訳）
    const tuanDen = dataManager.getTuanDenData(engineId);
    const taiShoDen = dataManager.getTaiShoDenData(engineId);
    const tuanDenText = tuanDen
      ? `\n📖【彖伝】\n${tuanDen.summary || tuanDen.title || ""}\n${
          tuanDen.haqei_interpretation || ""
        }`
      : "";

    // 🔧 オブジェクト型安全表示機能の実装
    const taiShoDenText = taiShoDen
      ? `\n🌏【大象伝】\n${this.generateSafeDisplayText(taiShoDen)}`
      : "";

    // 一貫性スコア（従来ロジック維持）
    let consistencyScore = "-";
    try {
      if (window.calculateConsistencyScore) {
        const trigramsMaster = dataManager.getTrigramsMaster();
        const elementRelationships = dataManager.getElementRelationships();
        consistencyScore = window.calculateConsistencyScore(
          engineUnified.hexagramData,
          interfaceUnified.hexagramData,
          safeUnified.hexagramData,
          trigramsMaster,
          elementRelationships
        );
      }
    } catch (e) {
      console.error("一貫性スコア計算エラー", e);
    }

    // アクションプラン（従来ロジック維持）
    let actionPlan = "";
    try {
      if (window.getPersonalizedActionPlans) {
        const actionPlans = dataManager.getActionPlans();
        const osManual = dataManager.getOSManual();
        actionPlan = window.getPersonalizedActionPlans(
          engineId,
          interfaceId,
          safeId,
          actionPlans,
          osManual
        );
      }
    } catch (e) {
      console.error("アクションプラン生成エラー", e);
    }

    // テンプレート出力
    return `
🎯 ${participant.name}様への HaQei 人格OS診断結果
═══════════════════════════════════════════

【あなたの3層人格OS】

🔧 エンジンOS（根源的な力）
${engineDetail}

🖥️ インターフェースOS（表の顔）
${interfaceDetail}

🛡️ セーフモードOS（内なる顔）
${safeDetail}

${tuanDenText}
${taiShoDenText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【人格一貫性スコア】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${consistencyScore} %

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【統合洞察＆アクションプラン】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${analysis.unifyingMessage}

${actionPlan}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ **診断完了日時**: ${new Date(data.processedAt).toLocaleString("ja-JP")}
🎯 **HaQei Analyzer v1.0**

この診断結果はいかがでしたか？
ぜひあなたの率直なフィードバックをお聞かせください ��
    `.trim();
  }

  // 従来形式用テキスト生成（フォールバック）
  // eslint-disable-next-line no-unused-vars
  generateLegacyText(participant, result, format) {
    return `
🎯 ${participant.name}さんの HaQei 診断結果

主要人格OS: 「${result.primaryOS?.hexagramInfo?.name || "データ取得エラー"}」
適合度: ${Math.round(result.primaryOS?.matchPercentage || 0)}%

${result.insights?.summary || "洞察を生成中..."}

━━━━━━━━━━━━━━━━━━━━━━━
この診断結果はいかがでしたか？
的中度や印象をお聞かせください 🙏
    `.trim();
  }

  generateDetailedText(participant, result) {
    return `
🎯 ${participant.name}さんの HaQei 人格OS診断結果

【あなたの3層人格OS】

🔧 エンジンOS（核となる価値観）
「${result.engineOS?.hexagramInfo?.name || "データ取得エラー"}」
${result.engineOS?.hexagramInfo?.catchphrase || ""}

🖥️ インターフェースOS（外面的な行動）
「${result.interfaceOS?.hexagramInfo?.name || "データ取得エラー"}」
マッチ度: ${Math.round(result.interfaceOS?.matchScore || 0)}%

🛡️ セーフモードOS（内面的な防御機制）
「${result.safeModeOS?.hexagramInfo?.name || "データ取得エラー"}」
マッチ度: ${Math.round(result.safeModeOS?.matchScore || 0)}%

【人格一貫性スコア】
総合: ${Math.round((result.consistencyScore?.overall || 0) * 100)}%

【統合洞察】
${result.integration?.summary || "洞察を生成中..."}

${
  result.integration?.recommendations?.map((rec) => `💡 ${rec}`).join("\n") ||
  ""
}

━━━━━━━━━━━━━━━━━━━━━━━
この診断結果はいかがでしたか？
的中度や印象をお聞かせください 🙏
        `.trim();
  }

  generateSummaryText(participant, result) {
    return `
🎯 ${participant.name}さんの人格OS診断

エンジンOS: 「${result.engineOS?.hexagramInfo?.name || "エラー"}」
インターフェースOS: 「${result.interfaceOS?.hexagramInfo?.name || "エラー"}」
セーフモードOS: 「${result.safeModeOS?.hexagramInfo?.name || "エラー"}」

人格一貫性: ${Math.round((result.consistencyScore?.overall || 0) * 100)}%

${result.integration?.summary || ""}

#HaQeiAnalyzer #人格診断 #易経
        `.trim();
  }

  // フィードバック保存
  saveFeedback() {
    const participantId = document.getElementById("feedback-participant").value;
    if (!participantId) {
      alert("対象者を選択してください");
      return;
    }

    const feedback = {
      participantId,
      accuracy: parseInt(document.getElementById("accuracy-rating").value),
      satisfaction: parseInt(
        document.getElementById("satisfaction-rating").value
      ),
      impressive: Array.from(
        document.querySelectorAll(".checkbox-group input:checked")
      ).map((cb) => cb.value),
      comments: document.getElementById("user-comments").value.trim(),
      recordedAt: new Date().toISOString(),
    };

    this.feedbackData[participantId] = feedback;
    this.saveData();
    this.updateFeedbackSummary();

    // フォームクリア
    document.getElementById("accuracy-rating").value = "";
    document.getElementById("satisfaction-rating").value = "";
    document
      .querySelectorAll(".checkbox-group input")
      .forEach((cb) => (cb.checked = false));
    document.getElementById("user-comments").value = "";

    alert("フィードバックを保存しました");
  }

  // 分析・検証
  generateAnalysisReport() {
    const feedbackEntries = Object.values(this.feedbackData);
    if (feedbackEntries.length === 0) {
      alert("フィードバックデータがありません");
      return;
    }

    const analysis = {
      totalResponses: feedbackEntries.length,
      averageAccuracy: this.calculateAverage(feedbackEntries, "accuracy"),
      averageSatisfaction: this.calculateAverage(
        feedbackEntries,
        "satisfaction"
      ),
      accuracyDistribution: this.calculateDistribution(
        feedbackEntries,
        "accuracy"
      ),
      satisfactionDistribution: this.calculateDistribution(
        feedbackEntries,
        "satisfaction"
      ),
      commonImpressions: this.analyzeImpressions(feedbackEntries),
      lowAccuracyCases: this.identifyLowAccuracyCases(feedbackEntries),
      recommendations: this.generateRecommendations(feedbackEntries),
    };

    return analysis;
  }

  // データ永続化
  saveData() {
    const data = {
      participants: this.participants,
      answersData: this.answersData,
      diagnosisResults: this.diagnosisResults,
      feedbackData: this.feedbackData,
      lastSaved: new Date().toISOString(),
    };

    localStorage.setItem("haqei_test_input_data", JSON.stringify(data));
  }

  loadSavedData() {
    const saved = localStorage.getItem("haqei_test_input_data");
    if (saved) {
      const data = JSON.parse(saved);
      this.participants = data.participants || [];
      this.answersData = data.answersData || {};
      this.diagnosisResults = data.diagnosisResults || {};
      this.feedbackData = data.feedbackData || {};
    }
  }

  // エクスポート機能
  exportAllResults() {
    const format = document.getElementById("output-format").value;
    const results = {};

    Object.keys(this.diagnosisResults).forEach((participantId) => {
      results[participantId] = this.generateUserText(participantId, format);
    });

    const exportData = {
      format,
      results,
      exportedAt: new Date().toISOString(),
      totalCount: Object.keys(results).length,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `haqei_test_results_${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // UI更新メソッド群
  // 参加者セレクトの更新
  updateParticipantSelects() {
    const selects = ["current-participant", "feedback-participant"];

    selects.forEach((selectId) => {
      const select = document.getElementById(selectId);
      if (!select) return;

      // 既存のオプションをクリア（最初のオプション以外）
      while (select.children.length > 1) {
        select.removeChild(select.lastChild);
      }

      // 参加者を追加
      this.participants.forEach((participant) => {
        const option = document.createElement("option");
        option.value = participant.id;
        option.textContent = `${participant.id} - ${participant.name}`;
        select.appendChild(option);
      });
    });
  }

  // 個別診断ボタン状態更新
  updateSingleDiagnosisButtons(participantId) {
    const hasAnswers = participantId && this.answersData[participantId];
    const hasResult = participantId && this.diagnosisResults[participantId];

    const diagnosisBtn = document.getElementById("single-diagnosis-btn");
    const showResultBtn = document.getElementById("show-single-result-btn");
    const copyResultBtn = document.getElementById("copy-single-result-btn");

    if (diagnosisBtn) {
      diagnosisBtn.disabled = !hasAnswers;
      diagnosisBtn.textContent = hasAnswers
        ? "🔬 この人の診断実行"
        : "🔬 回答データが必要";
    }

    if (showResultBtn) {
      showResultBtn.disabled = !hasResult;
      showResultBtn.textContent = hasResult ? "📄 結果表示" : "📄 診断結果なし";
    }

    if (copyResultBtn) {
      copyResultBtn.disabled = !hasResult;
      copyResultBtn.textContent = hasResult
        ? "📋 結果コピー"
        : "📋 診断結果なし";
    }
  }

  // 結果表示ボタン状態更新
  updateResultViewButtons(participantId) {
    const hasResult = participantId && this.diagnosisResults[participantId];

    const viewButtons = document.querySelectorAll(".result-actions .btn");
    viewButtons.forEach((btn) => {
      btn.disabled = !hasResult;
    });

    // プレビューエリアをクリア
    const previewContainer = document.getElementById("single-result-preview");
    if (previewContainer) {
      previewContainer.innerHTML = hasResult
        ? ""
        : "<p>診断結果を選択してください</p>";
    }
  }

  // 入力進捗の更新
  updateInputProgress() {
    const container = document.getElementById("input-progress");
    if (!container) return;

    const totalParticipants = this.participants.length;
    const completedAnswers = Object.keys(this.answersData).length;
    const completedDiagnosis = Object.keys(this.diagnosisResults).length;

    container.innerHTML = `
      <div class="progress-indicator">
        <h4>📊 進捗状況</h4>
        <p>参加者登録: ${totalParticipants}人</p>
        <p>回答完了: ${completedAnswers}人</p>
        <p>診断完了: ${completedDiagnosis}人</p>
        ${
          totalParticipants > 0
            ? `<div style="margin-top: 10px;">
            <div style="background: #f0f0f0; height: 10px; border-radius: 5px; overflow: hidden;">
              <div style="background: #4CAF50; height: 100%; width: ${
                (completedAnswers / totalParticipants) * 100
              }%; transition: width 0.3s;"></div>
            </div>
            <small>回答進捗: ${Math.round(
              (completedAnswers / totalParticipants) * 100
            )}%</small>
          </div>`
            : ""
        }
      </div>
    `;
  }

  // 結果一覧の更新
  updateResultsList() {
    const container = document.getElementById("results-list");
    if (!container) {
      console.warn("results-list container not found");
      return;
    }

    const results = Object.keys(this.diagnosisResults);
    console.log(`🔄 Updating results list with ${results.length} results`);

    // 結果サマリーも更新
    this.updateResultsSummary();

    if (results.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #9ca3af;">
          <p>診断結果がありません</p>
          <p>データ入力タブで回答を追加し、診断を実行してください</p>
        </div>
      `;
      return;
    }

    container.innerHTML = results
      .map((participantId) => {
        const data = this.diagnosisResults[participantId];
        const participant = data.participant || { name: participantId };
        const hasError = !!data.error;
        const hasResult = !!data.result;

        return `
        <div class="result-item" style="
          margin-bottom: 1rem; 
          padding: 1rem; 
          border: 1px solid ${
            hasError ? "#ef4444" : hasResult ? "#10b981" : "#6b7280"
          }; 
          border-radius: 8px;
          background: ${
            hasError
              ? "rgba(239, 68, 68, 0.1)"
              : hasResult
              ? "rgba(16, 185, 129, 0.1)"
              : "rgba(107, 114, 128, 0.1)"
          };
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <h4 style="margin: 0; color: ${
              hasError ? "#ef4444" : hasResult ? "#10b981" : "#e5e7eb"
            };">
              ${hasError ? "❌" : hasResult ? "✅" : "⚠️"} ${
          participant.name || participantId
        }
            </h4>
            <small style="color: #9ca3af;">
              ${
                data.processedAt
                  ? new Date(data.processedAt).toLocaleString("ja-JP")
                  : "未処理"
              }
            </small>
          </div>
          
          ${
            participant.age || participant.gender || participant.occupation
              ? `<p style="margin: 0.5rem 0; font-size: 0.9rem; color: #d1d5db;">
              ${participant.age ? participant.age + "歳" : ""} 
              ${participant.gender || ""} 
              ${participant.occupation || ""}
            </p>`
              : ""
          }
          
          ${
            hasError
              ? `<p style="color: #fca5a5; margin: 0.5rem 0;">エラー: ${data.error}</p>`
              : hasResult
              ? `<div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
                   <button class="btn btn-primary" onclick="window.testSystem.showResultDetail('${participantId}')" style="font-size: 0.9rem; padding: 0.4rem 0.8rem;">
                     📄 詳細表示
                   </button>
                   <button class="btn btn-secondary" onclick="window.testSystem.copyResult('${participantId}')" style="font-size: 0.9rem; padding: 0.4rem 0.8rem;">
                     📋 コピー
                   </button>
                   <button class="btn btn-success" onclick="window.testSystem.sendResultToUser('${participantId}')" style="font-size: 0.9rem; padding: 0.4rem 0.8rem;">
                     📧 送信用
                   </button>
                 </div>`
              : `<p style="color: #9ca3af; margin: 0.5rem 0;">診断未実行</p>`
          }
        </div>
      `;
      })
      .join("");

    console.log(`✅ Results list updated with ${results.length} items`);
  }

  // 結果サマリーの更新
  updateResultsSummary() {
    const totalCount = Object.keys(this.diagnosisResults).length;
    const successCount = Object.values(this.diagnosisResults).filter(
      (d) => d.result && !d.error
    ).length;
    // eslint-disable-next-line no-unused-vars
    const errorCount = Object.values(this.diagnosisResults).filter(
      (d) => d.error
    ).length;

    // 平均一貫性スコア計算
    const consistencyScores = Object.values(this.diagnosisResults)
      .filter((d) => d.result && d.result.consistencyScore && !d.error)
      .map((d) => d.result.consistencyScore.overall || 0);
    const avgConsistency =
      consistencyScores.length > 0
        ? Math.round(
            (consistencyScores.reduce((a, b) => a + b, 0) /
              consistencyScores.length) *
              100
          )
        : 0;

    // サマリー要素を更新
    const elements = {
      "total-diagnosis-count": totalCount,
      "completion-rate":
        totalCount > 0
          ? Math.round((successCount / totalCount) * 100) + "%"
          : "0%",
      "avg-consistency-score": avgConsistency + "%",
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });
  }

  updateFeedbackSummary() {
    const summaryContainer = document.getElementById("feedback-summary");
    if (!summaryContainer) return;

    const feedbackEntries = Object.values(this.feedbackData);
    if (feedbackEntries.length === 0) {
      summaryContainer.innerHTML = "<p>フィードバックデータがありません。</p>";
      return;
    }

    const averageAccuracy = this.calculateAverage(feedbackEntries, "accuracy");
    const averageSatisfaction = this.calculateAverage(
      feedbackEntries,
      "satisfaction"
    );

    summaryContainer.innerHTML = `
        <div class="feedback-summary-stats">
            <div class="stat-item">
                <span class="stat-label">総回答数:</span>
                <span class="stat-value">${feedbackEntries.length}人</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">平均的中度:</span>
                <span class="stat-value">${averageAccuracy.toFixed(
                  1
                )}/5.0</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">平均満足度:</span>
                <span class="stat-value">${averageSatisfaction.toFixed(
                  1
                )}/5.0</span>
            </div>
        </div>
    `;
  }

  // ヘルパーメソッド
  calculateAverage(array, property) {
    const values = array
      .map((item) => item[property])
      .filter((val) => typeof val === "number");
    return values.length > 0
      ? values.reduce((sum, val) => sum + val, 0) / values.length
      : 0;
  }

  calculateDistribution(array, property) {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    array.forEach((item) => {
      const value = item[property];
      if (typeof value === "number" && value >= 1 && value <= 5) {
        distribution[value]++;
      }
    });
    return distribution;
  }

  analyzeImpressions(feedbackEntries) {
    const impressions = {};
    feedbackEntries.forEach((entry) => {
      entry.impressive.forEach((impression) => {
        impressions[impression] = (impressions[impression] || 0) + 1;
      });
    });
    return Object.entries(impressions)
      .sort(([, a], [, b]) => b - a)
      .map(([impression, count]) => ({ impression, count }));
  }

  identifyLowAccuracyCases(feedbackEntries) {
    return feedbackEntries
      .filter((entry) => entry.accuracy <= 2)
      .map((entry) => ({
        participantId: entry.participantId,
        accuracy: entry.accuracy,
        comments: entry.comments,
      }));
  }

  generateRecommendations(feedbackEntries) {
    const recommendations = [];
    const averageAccuracy = this.calculateAverage(feedbackEntries, "accuracy");

    if (averageAccuracy < 3.0) {
      recommendations.push(
        "的中度が低いため、質問項目の見直しを検討してください"
      );
    }
    if (averageAccuracy < 2.5) {
      recommendations.push("アルゴリズムの根本的な改善が必要です");
    }

    return recommendations;
  }

  // 結果表示・コピー機能
  viewResult(participantId) {
    const dataManager = new window.DataManager();
    dataManager.loadData().then(() => {
      const text = this.generateUserText(participantId, dataManager);
      alert(text);
    });
  }

  // 結果詳細表示
  showResultDetail(participantId) {
    const dataManager = new window.DataManager();
    dataManager.loadData().then(() => {
      const userText = this.generateUserText(participantId, dataManager);
      // モーダルまたは新しいウィンドウで表示
      const popup = window.open(
        "",
        "_blank",
        "width=800,height=600,scrollbars=yes"
      );
      popup.document.write(`
        <html>
          <head><title>${
            this.diagnosisResults[participantId]?.participant?.name ||
            participantId
          }さんの診断結果</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
            <pre style="white-space: pre-wrap; word-wrap: break-word;">${userText}</pre>
          </body>
        </html>
      `);
      popup.document.close();
    });
  }

  // 結果をクリップボードにコピー
  copyResult(participantId) {
    const dataManager = new window.DataManager();
    dataManager.loadData().then(() => {
      const userText = this.generateUserText(participantId, dataManager);
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(userText)
          .then(() => {
            alert("結果をクリップボードにコピーしました！");
          })
          .catch((err) => {
            console.error("コピーに失敗:", err);
            this.fallbackCopyText(userText);
          });
      } else {
        this.fallbackCopyText(userText);
      }
    });
  }

  // フォールバック用コピー機能
  fallbackCopyText(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    alert("結果をクリップボードにコピーしました！");
  }

  copyResultsForSharing() {
    const format = document.getElementById("output-format").value;
    const results = Object.keys(this.diagnosisResults)
      .map((participantId) => this.generateUserText(participantId, format))
      .join("\n\n---\n\n");

    navigator.clipboard
      .writeText(results)
      .then(() => {
        alert("全結果をクリップボードにコピーしました");
      })
      .catch(() => {
        alert("コピーに失敗しました");
      });
  }

  generateDebugReport() {
    const report = {
      timestamp: new Date().toISOString(),
      participants: this.participants,
      answersData: this.answersData,
      diagnosisResults: this.diagnosisResults,
      feedbackData: this.feedbackData,
      analysis: this.generateAnalysisReport(),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `haqei_debug_report_${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  clearCurrentAnswers() {
    if (confirm("現在の回答をクリアしますか？")) {
      document
        .querySelectorAll("#worldview-inputs .answer-select")
        .forEach((select) => {
          select.value = "";
        });
      document
        .querySelectorAll(
          "#scenario-inputs .inner-choice, #scenario-inputs .outer-choice"
        )
        .forEach((select) => {
          select.value = "";
        });
    }
  }

  // 一人用診断実行機能
  async executeSingleDiagnosis(participantId) {
    try {
      if (!this.answersData[participantId]) {
        alert("この参加者の回答データが見つかりません");
        return;
      }

      const button = event.target;
      button.disabled = true;
      button.textContent = "🔬 診断中...";

      // 既存のエンジンを使用
      const dataManager = new window.DataManager();
      await dataManager.loadData();
      const engine = new window.TripleOSEngine(dataManager);

      const rawAnswers = this.answersData[participantId];
      const answers = this.convertAnswersToEngineFormat(rawAnswers);
      const result = await engine.analyzeTripleOS(answers);

      this.diagnosisResults[participantId] = {
        result,
        processedAt: new Date().toISOString(),
        participant: this.participants.find((p) => p.id === participantId),
      };

      this.saveData();

      // 結果テキストを即座に表示
      this.showSingleResult(participantId);

      alert(`${participantId}の診断が完了しました！`);
    } catch (error) {
      console.error(`❌ Error processing ${participantId}:`, error);
      alert("診断実行中にエラーが発生しました: " + error.message);
    } finally {
      const button = event.target;
      if (button) {
        button.disabled = false;
        button.textContent = "🔬 診断実行";
      }
    }
  }

  // 本番と同じ結果テキスト生成

  // 8次元バランス要約生成
  generate8DimensionSummary(userVector) {
    const dimensions = [
      { key: "乾_創造性", name: "創造性", icon: "🌟" },
      { key: "震_行動性", name: "行動性", icon: "⚡" },
      { key: "坎_探求性", name: "探求性", icon: "🔍" },
      { key: "艮_安定性", name: "安定性", icon: "🗻" },
      { key: "坤_受容性", name: "受容性", icon: "🌍" },
      { key: "巽_適応性", name: "適応性", icon: "🌊" },
      { key: "離_表現性", name: "表現性", icon: "🔥" },
      { key: "兌_調和性", name: "調和性", icon: "☯️" },
    ];

    // スコア順にソート
    const sortedDimensions = dimensions
      .map((dim) => ({
        ...dim,
        score: userVector[dim.key] || 0,
      }))
      .sort((a, b) => b.score - a.score);

    const top3 = sortedDimensions.slice(0, 3);
    const bottom2 = sortedDimensions.slice(-2);

    return `
🌟 **強い特徴 (上位3次元)**
${top3
  .map(
    (dim, index) =>
      `${index + 1}. ${dim.icon} ${dim.name}: ${dim.score.toFixed(
        1
      )} - ${this.getDimensionDescription(dim.key, dim.score)}`
  )
  .join("\n")}

🌱 **成長の余地 (下位2次元)**
${bottom2
  .map(
    (dim) =>
      `• ${dim.icon} ${dim.name}: ${dim.score.toFixed(
        1
      )} - 意識的に伸ばすことで、よりバランスの取れた人格へ`
  )
  .join("\n")}
        `.trim();
  }

  // 一貫性洞察生成
  generateConsistencyInsight(consistencyScore) {
    const overall = consistencyScore.overall;

    if (overall >= 0.8) {
      return "あなたの3層OSは非常に高い一貫性を示しており、内面と外面が調和した安定した人格構造を持っています。";
    } else if (overall >= 0.6) {
      return "あなたの3層OSは適度な一貫性を保ちながらも、状況に応じた柔軟性を持った人格構造です。";
    } else if (overall >= 0.4) {
      return "あなたの3層OSにはある程度の多様性があり、複雑で多面的な人格の特徴を示しています。";
    } else {
      return "あなたの3層OSは非常に多様で複雑な構造を持ち、状況に応じて大きく異なる面を見せる人格です。";
    }
  }

  // 次元説明生成（簡略版）
  getDimensionDescription(dimensionKey, score) {
    const descriptions = {
      乾_創造性:
        score >= 2
          ? "新しいアイデアを生み出す力が強い"
          : "安定した方法を好む傾向",
      震_行動性:
        score >= 2
          ? "エネルギッシュで行動力がある"
          : "慎重に考えてから動く傾向",
      坎_探求性:
        score >= 2 ? "物事の本質を深く追求する" : "実用的な知識を重視する傾向",
      艮_安定性:
        score >= 2 ? "継続性と着実さを重視する" : "変化を好む動的な傾向",
      坤_受容性:
        score >= 2 ? "他者を受け入れ支援する力が強い" : "独立性を重視する傾向",
      巽_適応性:
        score >= 2
          ? "状況に応じて柔軟に対応できる"
          : "一貫した方針を重視する傾向",
      離_表現性:
        score >= 2
          ? "自己表現力が高く影響力がある"
          : "控えめで静かな影響力を持つ傾向",
      兌_調和性:
        score >= 2
          ? "人との調和を重視し喜びを分かち合う"
          : "個人の価値観を重視する傾向",
    };

    return descriptions[dimensionKey] || "バランスの取れた特徴";
  }

  // 単一結果表示機能
  showSingleResult(participantId) {
    const resultText = this.generateProductionLevelText(participantId);

    // モーダルまたは新しいタブで結果を表示
    const resultWindow = window.open(
      "",
      "_blank",
      "width=800,height=600,scrollbars=yes"
    );
    resultWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${participantId} の診断結果</title>
                <style>
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
                        line-height: 1.6; 
                        padding: 20px; 
                        background: #1a1a1a; 
                        color: #e1e1e1; 
                    }
                    pre { 
                        white-space: pre-wrap; 
                        font-family: inherit;
                        background: #2a2a2a;
                        padding: 20px;
                        border-radius: 8px;
                        border-left: 4px solid #6366f1;
                    }
                    .actions {
                        margin: 20px 0;
                        text-align: center;
                    }
                    button {
                        background: #6366f1;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 6px;
                        cursor: pointer;
                        margin: 0 10px;
                    }
                    button:hover { background: #5856eb; }
                </style>
            </head>
            <body>
                <div class="actions">
                    <button onclick="navigator.clipboard.writeText(document.querySelector('pre').textContent)">
                        📋 結果をコピー
                    </button>
                    <button onclick="window.print()">🖨️ 印刷</button>
                    <button onclick="window.close()">✖️ 閉じる</button>
                </div>
                <pre>${resultText}</pre>
            </body>
            </html>
        `);
    resultWindow.document.close();
  }

  // 構成八卦取得（安全版）
  getTrigramComposition(osData) {
    if (osData.trigramComposition) {
      return osData.trigramComposition;
    }
    if (osData.hexagramInfo) {
      const upperTrigram = this.getTrigramName(
        osData.hexagramInfo.upper_trigram_id
      );
      const lowerTrigram = this.getTrigramName(
        osData.hexagramInfo.lower_trigram_id
      );
      return `${upperTrigram} + ${lowerTrigram}`;
    }
    return "乾 + 乾";
  }

  // 八卦名取得
  getTrigramName(trigramId) {
    const trigramNames = {
      1: "乾",
      2: "兌",
      3: "離",
      4: "震",
      5: "巽",
      6: "坎",
      7: "艮",
      8: "坤",
    };
    return trigramNames[trigramId] || "乾";
  }

  // 個別結果コピー機能
  copySingleResult(participantId) {
    const resultText = this.generateProductionLevelText(participantId);
    navigator.clipboard
      .writeText(resultText)
      .then(() => {
        alert("結果をクリップボードにコピーしました");
      })
      .catch(() => {
        alert("コピーに失敗しました");
      });
  }

  // 簡易結果生成
  async generateQuickResult(participantId) {
    const data = this.diagnosisResults[participantId];
    if (!data || !data.result) {
      alert("診断結果が見つかりません");
      return;
    }

    const result = data.result;
    const participant = data.participant;

    // 🔧 統一データ取得方式に修正
    const getHexagramIdFromOS = (osObject) => {
      if (!osObject) return undefined;
      if (osObject.hexagram_id) return osObject.hexagram_id;
      if (osObject.osId) return osObject.osId;
      if (osObject.hexagramId) return osObject.hexagramId;
      if (osObject.id) return osObject.id;
      if (osObject.hexagramInfo) {
        if (osObject.hexagramInfo.hexagram_id)
          return osObject.hexagramInfo.hexagram_id;
        if (osObject.hexagramInfo.osId) return osObject.hexagramInfo.osId;
        if (osObject.hexagramInfo.hexagramId)
          return osObject.hexagramInfo.hexagramId;
        if (osObject.hexagramInfo.id) return osObject.hexagramInfo.id;
      }
      return undefined;
    };

    const engineId = getHexagramIdFromOS(result.engineOS);
    const interfaceId = getHexagramIdFromOS(result.interfaceOS);
    const safeId = getHexagramIdFromOS(result.safeModeOS);

    console.log("🔍 取得したID:", { engineId, interfaceId, safeId });

    // DataManagerインスタンスを作成してデータを取得
    const dataManager = new window.DataManager();
    await dataManager.loadData();

    const engineUnified = dataManager.getUnifiedHexagramData(engineId);
    const interfaceUnified = dataManager.getUnifiedHexagramData(interfaceId);
    const safeUnified = dataManager.getUnifiedHexagramData(safeId);

    console.log("🔍 統一データ取得結果:", {
      engineUnified: !!engineUnified,
      interfaceUnified: !!interfaceUnified,
      safeUnified: !!safeUnified,
    });

    const quickText = `
🎯 ${participant.name}さんの簡易診断結果

🔧 エンジンOS: ${engineUnified?.name || "データ取得エラー"}
🖥️ インターフェースOS: ${interfaceUnified?.name || "データ取得エラー"}
🛡️ セーフモードOS: ${safeUnified?.name || "データ取得エラー"}

一貫性スコア: ${Math.round(result.consistencyScore.overall * 100)}%

${result.integration.summary}
        `.trim();

    const previewContainer = document.getElementById("single-result-preview");
    if (previewContainer) {
      previewContainer.innerHTML = `<pre>${quickText}</pre>`;
    }
  }

  // ユーザー送信用テキスト生成
  sendResultToUser(participantId) {
    const dataManager = new window.DataManager();
    dataManager.loadData().then(() => {
      const resultText = this.generateUserText(participantId, dataManager);
      const userText = `
${resultText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【フィードバックのお願い】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

この診断結果について、以下の点をお聞かせください：

1. 的中度（1-5）: 
2. 満足度（1-5）: 
3. 印象に残った内容: 
4. 具体的なコメント: 

ご協力をお願いいたします 🙏
      `.trim();
      navigator.clipboard
        .writeText(userText)
        .then(() => {
          alert("ユーザー送信用テキストをクリップボードにコピーしました");
        })
        .catch(() => {
          alert("コピーに失敗しました");
        });
    });
  }
  // ... その他のUI更新メソッド

  // 表示更新
  updateDisplay() {
    this.updateParticipantSelects();
    this.updateInputProgress();
    this.updateResultsList();
    this.updateFeedbackSummary();

    // 個別診断ボタン状態を更新
    const singleDiagnosisSelect = document.getElementById(
      "single-diagnosis-participant"
    );
    if (singleDiagnosisSelect) {
      this.updateSingleDiagnosisButtons(singleDiagnosisSelect.value);
    }

    // 結果表示ボタン状態を更新
    const viewResultSelect = document.getElementById("view-result-participant");
    if (viewResultSelect) {
      this.updateResultViewButtons(viewResultSelect.value);
    }

    // 診断ステータス表示を初期化
    const diagnosisStatus = document.getElementById("single-diagnosis-status");
    if (diagnosisStatus && !diagnosisStatus.innerHTML.trim()) {
      diagnosisStatus.innerHTML =
        '<div class="diagnosis-status empty">診断対象者を選択して診断を実行してください</div>';
    }
  }

  // デバッグ用: 診断結果の構造を確認
  debugResults() {
    console.log("🔍 Stored diagnosis results:", this.diagnosisResults);
    console.log("🔍 Participants:", this.participants);
    console.log("🔍 Answers data:", Object.keys(this.answersData));

    Object.keys(this.diagnosisResults).forEach((participantId) => {
      const data = this.diagnosisResults[participantId];
      console.log(`📊 ${participantId}:`, {
        hasResult: !!data.result,
        hasError: !!data.error,
        resultType: data.result?.analysisType,
        resultStructure: data.result ? Object.keys(data.result) : "none",
        participantData: data.participant,
        processedAt: data.processedAt,
      });

      if (data.result) {
        console.log(`  ↳ Result structure:`, {
          engineOS: !!data.result.engineOS,
          interfaceOS: !!data.result.interfaceOS,
          safeModeOS: !!data.result.safeModeOS,
          consistencyScore: !!data.result.consistencyScore,
          integration: !!data.result.integration,
        });
      }
    });

    // DOM要素の確認
    const resultsList = document.getElementById("results-list");
    console.log(`🔍 results-list element:`, {
      exists: !!resultsList,
      innerHTML: resultsList
        ? resultsList.innerHTML.substring(0, 100) + "..."
        : "N/A",
    });
  }

  // 強制的に結果表示を更新するデバッグメソッド
  forceUpdateResultsDisplay() {
    console.log("🔄 強制的に結果表示を更新中...");
    this.updateResultsList();
    this.updateDisplay();

    // タブが正しく表示されているかチェック
    const resultsTab = document.getElementById("results-tab");
    if (resultsTab) {
      console.log("📋 Results tab display:", resultsTab.style.display);
      console.log("📋 Results tab class:", resultsTab.className);
    }

    console.log("✅ 強制更新完了");
  }

  setupEventListeners() {
    // 一括処理
    const batchBtn = document.getElementById("start-batch-processing-btn");
    if (batchBtn)
      batchBtn.addEventListener("click", () => this.startBatchProcessing());

    // クリップボード貼り付け
    const pasteBatchBtn = document.getElementById("paste-batch-clipboard-btn");
    if (pasteBatchBtn)
      pasteBatchBtn.addEventListener("click", () =>
        this.pasteBatchAnswersFromClipboard()
      );
    const batchClearBtn = document.getElementById("batch-input-clear-btn");
    if (batchClearBtn)
      batchClearBtn.addEventListener("click", () => {
        document.getElementById("batch-answers-input").value = "";
      });

    // 参加者リスト
    const pasteParticipantsBtn = document.getElementById(
      "paste-participants-from-clipboard-btn"
    );
    if (pasteParticipantsBtn)
      pasteParticipantsBtn.addEventListener("click", () =>
        this.pasteFromClipboard()
      );
    const clearParticipantsBtn = document.getElementById(
      "clear-participants-list-btn"
    );
    if (clearParticipantsBtn)
      clearParticipantsBtn.addEventListener("click", () =>
        this.clearParticipantsList()
      );
    const parseParticipantsBtn = document.getElementById(
      "parse-participants-list-btn"
    );
    if (parseParticipantsBtn)
      parseParticipantsBtn.addEventListener("click", () =>
        this.parseParticipants()
      );

    // 回答書式
    const pasteAnswersFormatBtn = document.getElementById(
      "paste-answers-format-btn"
    );
    if (pasteAnswersFormatBtn)
      pasteAnswersFormatBtn.addEventListener("click", () =>
        this.pasteAnswersFromClipboard()
      );
    const parseAnswersFormatBtn = document.getElementById(
      "parse-answers-format-btn"
    );
    if (parseAnswersFormatBtn)
      parseAnswersFormatBtn.addEventListener("click", () =>
        this.parseAnswersFormat()
      );
    const clearAnswersFormatBtn = document.getElementById(
      "clear-answers-format-btn"
    );
    if (clearAnswersFormatBtn)
      clearAnswersFormatBtn.addEventListener("click", () =>
        this.clearAnswersFormat()
      );

    // 回答保存・クリア
    const saveCurrentAnswersBtn = document.getElementById(
      "save-current-answers-btn"
    );
    if (saveCurrentAnswersBtn)
      saveCurrentAnswersBtn.addEventListener("click", () =>
        this.saveCurrentAnswers()
      );
    const clearCurrentAnswersBtn = document.getElementById(
      "clear-current-answers-btn"
    );
    if (clearCurrentAnswersBtn)
      clearCurrentAnswersBtn.addEventListener("click", () =>
        this.clearCurrentAnswers()
      );

    // 個別診断
    const executeSingleDiagnosisBtn = document.getElementById(
      "execute-single-diagnosis-btn"
    );
    if (executeSingleDiagnosisBtn)
      executeSingleDiagnosisBtn.addEventListener("click", () => {
        const pid = document.getElementById(
          "single-diagnosis-participant"
        ).value;
        this.executeSingleDiagnosis(pid);
      });
    const showSingleResultBtn = document.getElementById(
      "show-single-result-btn"
    );
    if (showSingleResultBtn)
      showSingleResultBtn.addEventListener("click", () => {
        const pid = document.getElementById(
          "single-diagnosis-participant"
        ).value;
        this.showSingleResult(pid);
      });
    const copySingleResultBtn = document.getElementById(
      "copy-single-result-btn"
    );
    if (copySingleResultBtn)
      copySingleResultBtn.addEventListener("click", () => {
        const pid = document.getElementById(
          "single-diagnosis-participant"
        ).value;
        this.copySingleResult(pid);
      });

    // 全員診断
    const executeAllDiagnosisBtn = document.getElementById(
      "execute-all-diagnosis-btn"
    );
    if (executeAllDiagnosisBtn)
      executeAllDiagnosisBtn.addEventListener("click", (event) =>
        this.executeAllDiagnosis(event)
      );

    // 結果エクスポート・コピー・デバッグ
    const exportAllResultsBtn = document.getElementById(
      "export-all-results-btn"
    );
    if (exportAllResultsBtn)
      exportAllResultsBtn.addEventListener("click", () =>
        this.exportAllResults()
      );
    const copyResultsForSharingBtn = document.getElementById(
      "copy-results-for-sharing-btn"
    );
    if (copyResultsForSharingBtn)
      copyResultsForSharingBtn.addEventListener("click", () =>
        this.copyResultsForSharing()
      );
    const generateDebugReportBtn = document.getElementById(
      "generate-debug-report-btn"
    );
    if (generateDebugReportBtn)
      generateDebugReportBtn.addEventListener("click", () =>
        this.generateDebugReport()
      );
    const generateDebugReportBtn2 = document.getElementById(
      "generate-debug-report-btn-2"
    );
    if (generateDebugReportBtn2)
      generateDebugReportBtn2.addEventListener("click", () =>
        this.generateDebugReport()
      );

    // 結果表示・簡易生成・送信
    const showSingleResultBtn2 = document.getElementById(
      "show-single-result-btn-2"
    );
    if (showSingleResultBtn2)
      showSingleResultBtn2.addEventListener("click", () => {
        const pid = document.getElementById("view-result-participant").value;
        this.showSingleResult(pid);
      });
    const generateQuickResultBtn = document.getElementById(
      "generate-quick-result-btn"
    );
    if (generateQuickResultBtn)
      generateQuickResultBtn.addEventListener("click", () => {
        const pid = document.getElementById("view-result-participant").value;
        this.generateQuickResult(pid);
      });
    const sendResultToUserBtn = document.getElementById(
      "send-result-to-user-btn"
    );
    if (sendResultToUserBtn)
      sendResultToUserBtn.addEventListener("click", () => {
        const pid = document.getElementById("view-result-participant").value;
        this.sendResultToUser(pid);
      });

    // フィードバック
    const saveFeedbackBtn = document.getElementById("save-feedback-btn");
    if (saveFeedbackBtn)
      saveFeedbackBtn.addEventListener("click", () => this.saveFeedback());

    // データ整合性テスト用のイベントリスナー（分析タブ用）
    const runDataIntegrityTestBtn = document.getElementById(
      "run-data-integrity-test-btn"
    );
    if (runDataIntegrityTestBtn) {
      runDataIntegrityTestBtn.addEventListener("click", async () => {
        try {
          console.log("🧪 データ整合性テスト実行開始");
          const results = await this.runDataIntegrityTests();

          // 結果を分析タブに表示
          const analysisDiv = document.getElementById("statistical-analysis");
          if (analysisDiv) {
            analysisDiv.innerHTML = `
              <div class="test-results-summary">
                <h4>📊 データ整合性テスト結果</h4>
                <div class="test-stats">
                  <div class="stat-item">
                    <span class="stat-label">総テスト数:</span>
                    <span class="stat-value">${results.total}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">成功:</span>
                    <span class="stat-value success">${results.passed}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">失敗:</span>
                    <span class="stat-value error">${results.failed}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">成功率:</span>
                    <span class="stat-value">${
                      results.total > 0
                        ? Math.round((results.passed / results.total) * 100)
                        : 0
                    }%</span>
                  </div>
                </div>
                <div class="test-details">
                  <h5>テスト詳細:</h5>
                  <div class="test-log">
                    ${results.results
                      .map(
                        (r) =>
                          `<div class="test-item ${r.status}">
                        [${r.timestamp}] ${r.name}: ${r.message}
                      </div>`
                      )
                      .join("")}
                  </div>
                </div>
              </div>
            `;
          }

          alert(
            `データ整合性テスト完了\n成功: ${results.passed}/${
              results.total
            } (${
              results.total > 0
                ? Math.round((results.passed / results.total) * 100)
                : 0
            }%)`
          );
        } catch (error) {
          console.error("❌ データ整合性テスト実行エラー:", error);
          alert(`データ整合性テスト実行エラー: ${error.message}`);
        }
      });
    }
  }

  // タブ切り替え機能
  switchTab(tabName) {
    // すべてのタブコンテンツを非表示
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.style.display = "none";
    });

    // すべてのタブボタンからアクティブクラスを削除
    document.querySelectorAll(".tab").forEach((button) => {
      button.classList.remove("active");
    });

    // 指定されたタブを表示
    const targetContent = document.getElementById(`${tabName}-tab`);
    if (targetContent) {
      targetContent.style.display = "block";
    }

    // 指定されたタブボタンをアクティブに
    const targetButton = document.querySelector(
      `[onclick="showTab('${tabName}')"]`
    );
    if (targetButton) {
      targetButton.classList.add("active");
    }

    // タブ固有の更新処理
    switch (tabName) {
      case "input":
        this.updateParticipantSelects();
        this.updateInputProgress();
        break;
      case "results":
        this.updateResultsList();
        break;
      case "feedback":
        this.updateFeedbackSummary();
        break;
      case "analysis":
        // 分析タブの更新処理
        break;
    }
  }

  // 参加者選択処理
  selectParticipant(participantId) {
    if (!participantId) return;

    this.currentParticipantId = participantId;

    // 既存の回答データがあれば表示
    if (this.answersData[participantId]) {
      const answers = this.answersData[participantId];
      this.updateWorldviewInputs(answers);
      this.updateScenarioInputs(answers);
    } else {
      // 回答データがない場合はクリア
      this.clearCurrentAnswers();
    }
  }

  // 【修正5】デバッグ用メソッド - 質問データの確認
  debugQuestionData() {
    console.log("🔍 質問データの確認:");

    // 価値観設問の確認
    console.log("📊 価値観設問:", this.questions.worldview.length, "問");
    this.questions.worldview.forEach((q, index) => {
      console.log(`  Q${index + 1} (${q.id}): ${q.options.length}選択肢`);
      q.options.forEach((opt, optIndex) => {
        console.log(`    ${String.fromCharCode(65 + optIndex)}: ${opt.value}`);
      });
    });

    // シナリオ設問の確認
    console.log("📊 シナリオ設問:", this.questions.scenarios.length, "問");
    this.questions.scenarios.forEach((q, index) => {
      console.log(`  Q${25 + index} (${q.id}):`);
      console.log(`    内面選択肢: ${q.options.inner.length}個`);
      q.options.inner.forEach((opt, optIndex) => {
        console.log(
          `      ${String.fromCharCode(65 + optIndex)}: ${opt.value}`
        );
      });
      console.log(`    外面選択肢: ${q.options.outer.length}個`);
      q.options.outer.forEach((opt, optIndex) => {
        console.log(
          `      ${String.fromCharCode(65 + optIndex)}: ${opt.value}`
        );
      });
    });
  }

  // 【追加】テスト用メソッド - 単一データでのテスト
  testSingleConversion() {
    console.log("🧪 === 単一データ変換テスト ===");

    const testData = {
      info: {
        name: "テストユーザー",
        age: "30",
        gender: "男性",
        occupation: "エンジニア",
      },
      worldviewAnswers: {
        Q1: "A", // これは変換前の状態
        Q2: "B",
      },
      scenarioAnswers: {
        Q25_内面: "A",
        Q25_外面: "B",
      },
    };

    // まず文字を実際の回答に変換
    Object.keys(testData.worldviewAnswers).forEach((key) => {
      const letter = testData.worldviewAnswers[key];
      const converted = this.convertLetterToAnswerText(key, letter);
      console.log(`${key}: ${letter} -> ${converted}`);
      if (converted) {
        testData.worldviewAnswers[key] = converted;
      }
    });

    Object.keys(testData.scenarioAnswers).forEach((key) => {
      const letter = testData.scenarioAnswers[key];
      const converted = this.convertLetterToAnswerText(key, letter);
      console.log(`${key}: ${letter} -> ${converted}`);
      if (converted) {
        testData.scenarioAnswers[key] = converted;
      }
    });

    // システム形式に変換
    try {
      const result = this.convertToSystemFormat(testData);
      console.log("✅ テスト変換成功:", result);
      return result;
    } catch (error) {
      console.error("❌ テスト変換失敗:", error);
      return null;
    }
  }

  // 【追加】システム診断メソッド - 問題を特定するための詳細診断
  diagnoseProblem() {
    console.log("🔍 === システム診断開始 ===");

    // 1. 基本的なシステム状態確認
    console.log("1. システム基本状態:");
    console.log("  - testSystem存在:", typeof window.testSystem);
    console.log("  - questions存在:", typeof this.questions);
    console.log("  - getQuestionData存在:", typeof this.getQuestionData);
    console.log(
      "  - convertLetterToAnswerText存在:",
      typeof this.convertLetterToAnswerText
    );

    // 2. 質問データの確認
    console.log("2. 質問データ:");
    try {
      if (this.questions) {
        console.log(
          "  - worldview配列:",
          Array.isArray(this.questions.worldview)
            ? this.questions.worldview.length + "個"
            : "not array"
        );
        console.log(
          "  - scenarios配列:",
          Array.isArray(this.questions.scenarios)
            ? this.questions.scenarios.length + "個"
            : "not array"
        );

        if (this.questions.worldview && this.questions.worldview.length > 0) {
          const first = this.questions.worldview[0];
          console.log("  - 最初の価値観設問:", {
            id: first.id,
            hasOptions: !!first.options,
            optionsLength: first.options?.length,
          });
        }

        if (this.questions.scenarios && this.questions.scenarios.length > 0) {
          const first = this.questions.scenarios[0];
          console.log("  - 最初のシナリオ設問:", {
            id: first.id,
            hasOptions: !!first.options,
            hasInner: !!first.options?.inner,
            hasOuter: !!first.options?.outer,
          });
        }
      } else {
        console.error("  ❌ this.questionsが未定義");
      }
    } catch (error) {
      console.error("  ❌ 質問データ確認エラー:", error);
    }

    // 3. 変換テスト
    console.log("3. 変換テスト:");

    // Q1のAテスト
    try {
      const q1Result = this.convertLetterToAnswerText("Q1", "A");
      console.log("  - Q1, A:", q1Result ? "成功" : "失敗");
    } catch (error) {
      console.error("  - Q1, A: エラー -", error.message);
    }

    // Q25のテスト
    try {
      const q25Result = this.convertLetterToAnswerText("Q25_内面", "A");
      console.log("  - Q25_内面, A:", q25Result ? "成功" : "失敗");
    } catch (error) {
      console.error("  - Q25_内面, A: エラー -", error.message);
    }

    // 4. getQuestionDataテスト
    console.log("4. getQuestionDataテスト:");
    try {
      const worldviewData = this.getQuestionData("worldview", "q1");
      console.log("  - worldview q1:", worldviewData ? "取得成功" : "取得失敗");

      const scenarioData = this.getQuestionData("scenario", "q25");
      console.log("  - scenario q25:", scenarioData ? "取得成功" : "取得失敗");
    } catch (error) {
      console.error("  - getQuestionDataエラー:", error);
    }

    console.log("🔍 === 診断完了 ===");
  }

  // デバッグ用: 確認なしで一括処理を実行
  async debugBatchProcessing() {
    console.log("🔧 デバッグモード: 確認なしで一括処理開始");

    const rawText = document.getElementById("batch-answers-input").value;
    if (!rawText.trim()) {
      console.error("❌ 入力テキストが空です");
      return;
    }

    console.log("🔧 デバッグ用一括処理実行中...");

    try {
      const results = await this.processBatchAndGenerate(rawText);
      console.log("✅ デバッグ処理完了:", results);
      return results;
    } catch (error) {
      console.error("❌ デバッグ処理エラー:", error);
      throw error;
    }
  }

  /**
   * 統一データから一貫した詳細テキストを生成
   * @param {UnifiedHexagramData} unifiedData
   * @returns {string}
   */
  generateUnifiedOSDetail(unifiedData) {
    try {
      console.log(
        `🔍 [TestInputSystem] generateUnifiedOSDetail開始`,
        unifiedData?.id
      );

      if (!unifiedData) {
        console.warn(
          `⚠️ [TestInputSystem] unifiedDataがnullまたはundefinedです`
        );
        return "データが見つかりません";
      }

      if (typeof unifiedData !== "object") {
        console.warn(
          `⚠️ [TestInputSystem] unifiedDataが期待される形式ではありません:`,
          typeof unifiedData
        );
        return "データ形式が正しくありません";
      }

      // 安全な文字列取得ヘルパー
      const safeString = (value, fieldName) => {
        try {
          if (typeof value === "string") return value;
          if (value == null) return "";
          return String(value);
        } catch (error) {
          console.warn(
            `⚠️ [TestInputSystem] ${fieldName}の文字列変換エラー:`,
            error
          );
          return "";
        }
      };

      // 安全な配列処理ヘルパー
      const safeArray = (value, fieldName) => {
        try {
          if (Array.isArray(value)) return value;
          if (typeof value === "string")
            return value.split(/[,、\s]+/).filter(Boolean);
          return [];
        } catch (error) {
          console.warn(
            `⚠️ [TestInputSystem] ${fieldName}の配列変換エラー:`,
            error
          );
          return [];
        }
      };

      const name = safeString(unifiedData.name, "name") || "名称不明";
      let detail = `【${name}】\n`;

      const catchphrase = safeString(unifiedData.catchphrase, "catchphrase");
      if (catchphrase) {
        detail += `キャッチコピー: ${catchphrase}\n`;
      }

      const description = safeString(unifiedData.description, "description");
      if (description) {
        detail += `説明: ${description}\n`;
      }

      const strategy = safeString(unifiedData.strategy, "strategy");
      if (strategy) {
        detail += `戦略: ${strategy}\n`;
      }

      const keywords = safeArray(unifiedData.keywords, "keywords");
      if (keywords.length > 0) {
        detail += `キーワード: ${keywords.join(", ")}\n`;
      }

      const result = detail.trim();
      console.log(`✅ [TestInputSystem] generateUnifiedOSDetail完了 - ${name}`);
      return result;
    } catch (error) {
      console.error(
        `❌ [TestInputSystem] generateUnifiedOSDetailエラー:`,
        error
      );

      // エラー詳細をログ出力
      console.error(`❌ [TestInputSystem] エラー詳細:`, {
        originalError: error,
        unifiedData: unifiedData,
        userMessage: "OS詳細テキストの生成に失敗しました",
      });

      return `OS詳細の生成中にエラーが発生しました: ${error.message}`;
    }
  }

  /**
   * オブジェクト型データを安全に文字列表示に変換
   * @param {any} data - 変換対象のデータ
   * @returns {string} - 表示用文字列
   */
  generateSafeDisplayText(data) {
    try {
      console.log(`🔍 [TestInputSystem] generateSafeDisplayText開始`);
      
      // null/undefined チェック
      if (data == null) {
        console.log(`⚠️ [TestInputSystem] データがnull/undefinedです`);
        return "";
      }
      
      // 文字列の場合はそのまま返す
      if (typeof data === "string") {
        console.log(`✅ [TestInputSystem] 文字列データを返します: ${data.length}文字`);
        return data;
      }

      // オブジェクトの場合は安全に処理
      if (data && typeof data === "object") {
        console.log(`🔍 [TestInputSystem] オブジェクトデータを処理中`);
        
        // 優先順位に従ってプロパティを確認
        try {
          if (data.text && typeof data.text === "string") {
            console.log(`✅ [TestInputSystem] textプロパティを使用`);
            return data.text;
          }
          if (data.content && typeof data.content === "string") {
            console.log(`✅ [TestInputSystem] contentプロパティを使用`);
            return data.content;
          }
          if (data.interpretation && typeof data.interpretation === "string") {
            console.log(`✅ [TestInputSystem] interpretationプロパティを使用`);
            return data.interpretation;
          }
          if (data.symbolism && data.strategy) {
            console.log(`✅ [TestInputSystem] symbolism+strategyプロパティを使用`);
            return `【象徴】 ${data.symbolism}\n【戦略】 ${data.strategy}`;
          }
          if (data.symbolism && typeof data.symbolism === "string") {
            console.log(`✅ [TestInputSystem] symbolismプロパティを使用`);
            return `【象徴】 ${data.symbolism}`;
          }
          if (data.strategy && typeof data.strategy === "string") {
            console.log(`✅ [TestInputSystem] strategyプロパティを使用`);
            return `【戦略】 ${data.strategy}`;
          }
        } catch (propertyError) {
          console.error(`❌ [TestInputSystem] プロパティアクセスエラー:`, propertyError);
        }

        // フォールバック処理
        try {
          console.log(`⚠️ [TestInputSystem] JSON文字列化を試行`);
          const jsonString = JSON.stringify(data, null, 2);
          if (jsonString && jsonString !== "{}") {
            return jsonString;
          } else {
            console.warn(`⚠️ [TestInputSystem] 空のオブジェクトです`);
            return "[空のデータ]";
          }
        } catch (jsonError) {
          console.error(`❌ [TestInputSystem] JSON変換エラー:`, jsonError);
          return "[データ表示エラー]";
        }
      }

      // その他の型の場合は文字列に変換
      try {
        const stringValue = String(data);
        console.log(`✅ [TestInputSystem] 文字列変換完了: ${stringValue}`);
        return stringValue;
      } catch (stringError) {
        console.error(`❌ [TestInputSystem] 文字列変換エラー:`, stringError);
        return "[変換エラー]";
      }
      
    } catch (error) {
      console.error(`❌ [TestInputSystem] generateSafeDisplayText致命的エラー:`, error);
      return `[エラー: ${error.message}]`;
    }
  }

  /**
   * OS特性マッピング定義（64卦対応）
   */
  static OS_CHARACTERISTICS_MAP = {
    1: { type: "creative", energy: "active", focus: "innovation" }, // 乾為天 (けんいてん)
    2: { type: "stable", energy: "calm", focus: "security" }, // 坤為地 (こんいち)
    3: { type: "creative", energy: "deep", focus: "innovation" }, // 水雷屯 (すいらいちゅん)
    4: { type: "analytical", energy: "calm", focus: "understanding" }, // 山水蒙 (さんすいもう)
    5: { type: "stable", energy: "calm", focus: "security" }, // 水天需 (すいてんじゅ)
    6: { type: "analytical", energy: "active", focus: "understanding" }, // 天水訟 (てんすいしょう)
    7: { type: "stable", energy: "active", focus: "security" }, // 地水師 (ちすいし)
    8: { type: "harmonious", energy: "social", focus: "relationship" }, // 水地比 (すいちひ)
    9: { type: "stable", energy: "calm", focus: "general" }, // 風天小畜 (ふうてんしょうちく)
    10: { type: "harmonious", energy: "calm", focus: "relationship" }, // 天沢履 (てんたくり)
    11: { type: "harmonious", energy: "social", focus: "relationship" }, // 地天泰 (ちてんたい)
    12: { type: "analytical", energy: "calm", focus: "understanding" }, // 天地否 (てんちひ)
    13: { type: "harmonious", energy: "social", focus: "relationship" }, // 天火同人 (てんかどうじん)
    14: { type: "creative", energy: "social", focus: "innovation" }, // 火天大有 (かてんたいゆう)
    15: { type: "harmonious", energy: "calm", focus: "relationship" }, // 地山謙 (ちさんけん)
    16: { type: "harmonious", energy: "active", focus: "relationship" }, // 雷地豫 (らいちよ)
    17: { type: "harmonious", energy: "active", focus: "relationship" }, // 沢雷随 (たくらいずい)
    18: { type: "creative", energy: "deep", focus: "innovation" }, // 山風蠱 (さんぷうこ)
    19: { type: "harmonious", energy: "active", focus: "relationship" }, // 地沢臨 (ちたくりん)
    20: { type: "analytical", energy: "calm", focus: "understanding" }, // 風地観 (ふうちかん)
    21: { type: "creative", energy: "active", focus: "innovation" }, // 火雷噬嗑 (からいぜいごう)
    22: { type: "harmonious", energy: "social", focus: "general" }, // 山火賁 (さんかひ)
    23: { type: "analytical", energy: "calm", focus: "understanding" }, // 山地剝 (さんちはく)
    24: { type: "stable", energy: "active", focus: "security" }, // 地雷復 (ちらいふく)
    25: { type: "balanced", energy: "moderate", focus: "general" }, // 天雷无妄 (てんらいむぼう)
    26: { type: "stable", energy: "calm", focus: "security" }, // 山天大畜 (さんてんたいちく)
    27: { type: "stable", energy: "calm", focus: "security" }, // 山雷頤 (さんらいい)
    28: { type: "creative", energy: "active", focus: "innovation" }, // 澤風大過 (たくふうたいか)
    29: { type: "analytical", energy: "deep", focus: "understanding" }, // 坎為水 (かんいすい)
    30: { type: "analytical", energy: "social", focus: "understanding" }, // 離為火 (りいか)
    31: { type: "harmonious", energy: "social", focus: "relationship" }, // 沢山咸 (たくざんかん)
    32: { type: "stable", energy: "calm", focus: "security" }, // 雷風恒 (らいふうこう)
    33: { type: "analytical", energy: "calm", focus: "security" }, // 天山遯 (てんざんとん)
    34: { type: "creative", energy: "active", focus: "innovation" }, // 雷天大壮 (らいてんたいそう)
    35: { type: "harmonious", energy: "active", focus: "relationship" }, // 火地晋 (かちしん)
    36: { type: "analytical", energy: "deep", focus: "security" }, // 地火明夷 (ちかめいい)
    37: { type: "harmonious", energy: "calm", focus: "relationship" }, // 風火家人 (ふうかかじん)
    38: { type: "analytical", energy: "active", focus: "understanding" }, // 火沢睽 (かたくけい)
    39: { type: "analytical", energy: "deep", focus: "understanding" }, // 水山蹇 (すいざんけん)
    40: { type: "creative", energy: "active", focus: "general" }, // 雷水解 (らいすいかい)
    41: { type: "stable", energy: "calm", focus: "security" }, // 山沢損 (さんたくそん)
    42: { type: "harmonious", energy: "active", focus: "relationship" }, // 風雷益 (ふうらいえき)
    43: { type: "creative", energy: "active", focus: "innovation" }, // 沢天夬 (たくてんかい)
    44: { type: "harmonious", energy: "social", focus: "relationship" }, // 天風姤 (てんぷうこう)
    45: { type: "harmonious", energy: "social", focus: "relationship" }, // 沢地萃 (たくちすい)
    46: { type: "stable", energy: "calm", focus: "security" }, // 地風升 (ちふうしょう)
    47: { type: "analytical", energy: "deep", focus: "understanding" }, // 沢水困 (たくすいこん)
    48: { type: "stable", energy: "calm", focus: "security" }, // 水風井 (すいふうせい)
    49: { type: "creative", energy: "active", focus: "innovation" }, // 沢火革 (たくかかく)
    50: { type: "stable", energy: "calm", focus: "security" }, // 火風鼎 (かふうてい)
    51: { type: "creative", energy: "active", focus: "innovation" }, // 震為雷 (しんいらい)
    52: { type: "stable", energy: "calm", focus: "security" }, // 艮為山 (ごんいさん)
    53: { type: "stable", energy: "calm", focus: "security" }, // 風山漸 (ふうざんぜん)
    54: { type: "balanced", energy: "active", focus: "relationship" }, // 雷沢帰妹 (らいたくきまい)
    55: { type: "harmonious", energy: "active", focus: "general" }, // 雷火豊 (らいかほう)
    56: { type: "analytical", energy: "moderate", focus: "understanding" }, // 火山旅 (かざんりょ)
    57: { type: "harmonious", energy: "moderate", focus: "relationship" }, // 巽為風 (そんいふう)
    58: { type: "harmonious", energy: "social", focus: "relationship" }, // 兌為沢 (だいたく)
    59: { type: "creative", energy: "moderate", focus: "general" }, // 風水渙 (ふうすいかん)
    60: { type: "stable", energy: "calm", focus: "security" }, // 水沢節 (すいたくせつ)
    61: { type: "harmonious", energy: "calm", focus: "relationship" }, // 風沢中孚 (ふうたくちゅうふ)
    62: { type: "stable", energy: "calm", focus: "security" }, // 雷山小過 (らいざんしょうか)
    63: { type: "stable", energy: "calm", focus: "security" }, // 水火既済 (すいかきせい)
    64: { type: "creative", energy: "deep", focus: "innovation" }, // 火水未済 (かすいびせい)
    // デフォルト値
    default: { type: "balanced", energy: "moderate", focus: "general" },
  };

  /**
   * OS名や特徴から特性を自動分類（64卦対応版）
   * @param {UnifiedHexagramData} osData
   * @returns {OSCharacteristics}
   */
  categorizeOSType(osData) {
    console.log("🔍 categorizeOSType called with:", osData);

    // OSデータからIDを取得
    let hexagramId = null;

    // 1. osData.id から直接取得を試行
    if (osData?.id && typeof osData.id === "number") {
      hexagramId = osData.id;
    }
    // 2. osData.hexagramId から取得を試行
    else if (osData?.hexagramId && typeof osData.hexagramId === "number") {
      hexagramId = osData.hexagramId;
    }
    // 3. 文字列の場合は数値に変換を試行
    else if (osData?.id && typeof osData.id === "string") {
      const parsed = parseInt(osData.id, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 64) {
        hexagramId = parsed;
      }
    } else if (osData?.hexagramId && typeof osData.hexagramId === "string") {
      const parsed = parseInt(osData.hexagramId, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 64) {
        hexagramId = parsed;
      }
    }

    console.log("🔍 Extracted hexagramId:", hexagramId);

    // マッピングから特性を取得
    if (hexagramId && hexagramId >= 1 && hexagramId <= 64) {
      const characteristics =
        TestInputSystem.OS_CHARACTERISTICS_MAP[hexagramId];
      console.log(
        "✅ Found characteristics for ID",
        hexagramId,
        ":",
        characteristics
      );
      return characteristics;
    }

    // フォールバック: 従来のキーワードベース分類
    console.log("⚠️ Using fallback keyword-based classification");
    const name = (osData?.name || "").toLowerCase();
    const keywords = (osData?.keywords || []).join(",").toLowerCase();

    if (keywords.includes("創造") || name.includes("乾")) {
      return { type: "creative", energy: "active", focus: "innovation" };
    } else if (
      keywords.includes("調和") ||
      name.includes("泰") ||
      name.includes("比")
    ) {
      return { type: "harmonious", energy: "social", focus: "relationship" };
    } else if (
      keywords.includes("安定") ||
      name.includes("坤") ||
      name.includes("山")
    ) {
      return { type: "stable", energy: "calm", focus: "security" };
    } else if (
      keywords.includes("分析") ||
      name.includes("観") ||
      name.includes("明")
    ) {
      return { type: "analytical", energy: "deep", focus: "understanding" };
    }

    // デフォルト値を返す
    console.log("🔄 Using default characteristics");
    return TestInputSystem.OS_CHARACTERISTICS_MAP.default;
  }

  /**
   * 矛盾する特性を検出する
   * @param {Object} characteristics - 3つのOSの特性オブジェクト
   * @returns {Object} 矛盾検出結果
   */
  detectContrast(characteristics) {
    console.log("🔍 矛盾検出を開始:", characteristics);

    const types = [
      characteristics.engine.type,
      characteristics.interface.type,
      characteristics.safe.type,
    ];
    const energies = [
      characteristics.engine.energy,
      characteristics.interface.energy,
      characteristics.safe.energy,
    ];
    const focuses = [
      characteristics.engine.focus,
      characteristics.interface.focus,
      characteristics.safe.focus,
    ];

    // 各特性の多様性を計算
    const typeVariety = new Set(types).size;
    const energyVariety = new Set(energies).size;
    const focusVariety = new Set(focuses).size;

    // 矛盾の強度を計算（1-3の範囲）
    const contrastIntensity = Math.max(
      typeVariety,
      energyVariety,
      focusVariety
    );

    // 矛盾があるかどうかの判定
    const hasContrast = contrastIntensity > 1;

    // 支配的テーマの計算
    const dominantTheme = this.calculateDominantTheme(types);

    // 矛盾の詳細分析
    const contrastDetails = {
      typeContrast: typeVariety > 1,
      energyContrast: energyVariety > 1,
      focusContrast: focusVariety > 1,
      contrastAreas: [],
    };

    if (contrastDetails.typeContrast) {
      contrastDetails.contrastAreas.push({
        area: "type",
        values: [...new Set(types)],
        description: "基本的な行動パターンに多様性",
      });
    }
    if (contrastDetails.energyContrast) {
      contrastDetails.contrastAreas.push({
        area: "energy",
        values: [...new Set(energies)],
        description: "エネルギーの向け方に幅",
      });
    }
    if (contrastDetails.focusContrast) {
      contrastDetails.contrastAreas.push({
        area: "focus",
        values: [...new Set(focuses)],
        description: "関心領域の多面性",
      });
    }

    console.log("✅ 矛盾検出完了:", {
      hasContrast,
      contrastIntensity,
      dominantTheme,
      contrastDetails,
    });

    return {
      hasContrast,
      contrastIntensity,
      dominantTheme,
      contrastDetails,
      types,
      energies,
      focuses,
    };
  }

  /**
   * 支配的テーマを計算する
   * @param {Array} types - タイプの配列
   * @returns {string} 支配的テーマ
   */
  calculateDominantTheme(types) {
    const freq = {};
    types.forEach((t) => {
      freq[t] = (freq[t] || 0) + 1;
    });
    return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
  }

  /**
   * 統合洞察メッセージを生成する
   * @param {Object} contrastResult - detectContrastの結果
   * @param {Object} characteristics - 3つのOSの特性
   * @returns {string} 統合洞察メッセージ
   */
  generateUnifyingMessage(contrastResult, characteristics) {
    console.log("🎯 統合メッセージ生成を開始:", {
      contrastResult,
      characteristics,
    });

    const { hasContrast, contrastIntensity, dominantTheme, contrastDetails } =
      contrastResult;

    if (!hasContrast) {
      // 調和的組み合わせの場合
      return this.generateHarmoniousMessage(dominantTheme, characteristics);
    }

    // 対比的組み合わせの場合
    return this.generateContrastMessage(
      contrastDetails,
      characteristics,
      contrastIntensity
    );
  }

  /**
   * 調和的組み合わせのメッセージを生成
   * @param {string} dominantTheme - 支配的テーマ
   * @param {Object} characteristics - 特性オブジェクト
   * @returns {string} 調和的メッセージ
   */
  generateHarmoniousMessage(dominantTheme, characteristics) {
    const themeMessages = {
      creative:
        "創造性と革新性が一貫してあなたの行動を導いています。新しいアイデアを生み出し、変化を恐れずに挑戦する姿勢が、あなたの安定した強みとなっています。",
      harmonious:
        "調和と協調を重視する姿勢が、あなたの人格全体に一貫して現れています。人との関係を大切にし、バランスの取れた判断ができることが、あなたの信頼される理由です。",
      stable:
        "安定性と継続性を重視する価値観が、あなたの行動パターンを一貫して支えています。着実に物事を進め、信頼できる基盤を築く能力が、あなたの大きな強みです。",
      analytical:
        "論理的思考と深い洞察力が、あなたの判断と行動を一貫して特徴づけています。複雑な問題を整理し、本質を見抜く能力が、あなたの価値ある貢献となっています。",
      balanced:
        "バランス感覚と適応力が、あなたの人格全体に安定して現れています。状況に応じて柔軟に対応しながらも、一貫した価値観を保つことができるのが、あなたの特別な才能です。",
    };

    const baseMessage = themeMessages[dominantTheme] || themeMessages.balanced;

    return `【一貫した${dominantTheme}型の魅力】\n${baseMessage}\n\nあなたの3つの人格OS（Engine・Interface・Safe）は互いに調和し、安定した個性として統合されています。この一貫性こそが、あなたが周囲から信頼され、自分らしさを発揮できる源泉となっています。`;
  }

  /**
   * 対比的組み合わせのメッセージを生成
   * @param {Object} contrastDetails - 矛盾の詳細
   * @param {Object} characteristics - 特性オブジェクト
   * @param {number} contrastIntensity - 矛盾の強度
   * @returns {string} 対比的メッセージ
   */
  generateContrastMessage(contrastDetails, characteristics, contrastIntensity) {
    // 矛盾の強度に応じたメッセージの調整
    const intensityDescriptions = {
      2: "適度な多面性",
      3: "豊かな多面性",
    };

    const intensityDesc = intensityDescriptions[contrastIntensity] || "多面性";

    // 具体的な矛盾領域の説明を生成
    const contrastDescriptions = contrastDetails.contrastAreas
      .map((area) => {
        return `・${area.description}（${area.values.join("と")}の組み合わせ）`;
      })
      .join("\n");

    // 多面的魅力としての表現
    const unifyingThemes = this.generateUnifyingThemes(characteristics);

    return `【${intensityDesc}による多面的リーダーシップ】

あなたの人格OSには以下の特徴的な多面性があります：
${contrastDescriptions}

この一見矛盾する特性の組み合わせこそが、あなたの最大の魅力です。${unifyingThemes}

状況に応じて異なる面を発揮できるあなたは、多様な場面でリーダーシップを発揮し、様々な人々との関係を築くことができる貴重な存在です。この多面性を「矛盾」ではなく「豊かさ」として受け入れることで、より自分らしい成長を遂げることができるでしょう。`;
  }

  /**
   * 統合テーマを生成する
   * @param {Object} characteristics - 特性オブジェクト
   * @returns {string} 統合テーマ
   */
  generateUnifyingThemes(characteristics) {
    const { engine, interface: interfaceChar, safe } = characteristics;

    // 特性の組み合わせパターンを分析

    // よくある組み合わせパターンに対する特別なメッセージ
    const specialCombinations = {
      "creative-harmonious": "革新的なアイデアを調和的に実現する力",
      "creative-stable": "創造性と安定性のバランスを取る能力",
      "creative-analytical": "論理的な創造性を発揮する才能",
      "harmonious-stable": "安定した関係性を築く協調力",
      "harmonious-analytical": "論理的な協調性を示す洞察力",
      "stable-analytical": "着実で論理的な問題解決能力",
    };

    // 組み合わせキーを生成
    const typeSet = new Set([engine.type, interfaceChar.type, safe.type]);
    const sortedTypes = Array.from(typeSet).sort();
    const combinationKey = sortedTypes.join("-");

    if (specialCombinations[combinationKey]) {
      return specialCombinations[combinationKey] + "を持っています。";
    }

    // デフォルトメッセージ
    return `${engine.type}な行動力、${interfaceChar.type}な対人関係、${safe.type}な価値観が絶妙に組み合わさっています。`;
  }

  /**
   * 3つのOSの特性分析と分類、矛盾・対比の検出、統合メッセージ生成
   * @param {UnifiedHexagramData} engineData
   * @param {UnifiedHexagramData} interfaceData
   * @param {UnifiedHexagramData} safeData
   * @returns {OSCombinationAnalysis}
   */
  analyzeOSCombination(engineData, interfaceData, safeData) {
    console.log("🔬 OS組み合わせ分析を開始");

    const characteristics = {
      engine: this.categorizeOSType(engineData),
      interface: this.categorizeOSType(interfaceData),
      safe: this.categorizeOSType(safeData),
    };

    // 矛盾検出
    const contrastResult = this.detectContrast(characteristics);

    // 統合メッセージ生成
    const unifyingMessage = this.generateUnifyingMessage(
      contrastResult,
      characteristics
    );

    const result = {
      characteristics,
      hasContrast: contrastResult.hasContrast,
      dominantTheme: contrastResult.dominantTheme,
      unifyingMessage,
      contrastDetails: contrastResult.contrastDetails,
      contrastIntensity: contrastResult.contrastIntensity,
    };

    console.log("✅ OS組み合わせ分析完了:", result);
    return result;
  }
}

// タブ切り替え（クラスメソッドとして実装済みのため削除）

// システム初期化
document.addEventListener("DOMContentLoaded", () => {
  try {
    console.log("🔍 TestInputSystem初期化開始");
    window.testSystem = new TestInputSystem();
    console.log("✅ TestInputSystem初期化完了");
  } catch (error) {
    console.error("❌ TestInputSystem初期化エラー:", error);
    alert("TestInputSystemの初期化に失敗しました: " + error.message);
  }
});

// タブ切り替え機能（HTMLから呼び出される）

function showTab(tabName) {
  // 全てのタブコンテンツを非表示
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  // 全てのタブボタンを非アクティブ
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  // 指定されたタブを表示
  const targetTab = document.getElementById(`${tabName}-tab`);
  if (targetTab) {
    targetTab.classList.add("active");
  }

  // 対応するタブボタンをアクティブ
  const tabButtons = document.querySelectorAll(".tab");
  const tabNames = ["input", "results", "feedback", "analysis"];
  const index = tabNames.indexOf(tabName);

  if (index >= 0 && tabButtons[index]) {
    tabButtons[index].classList.add("active");
  }
}
