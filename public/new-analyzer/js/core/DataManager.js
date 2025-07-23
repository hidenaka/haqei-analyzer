// DataManager.js - BIBLE_DATA対応修正版

class DataManager {
  constructor() {
    this.data = {};
    this.loaded = false;
    this.loadingErrors = [];
    this.loadingWarnings = [];
    this.loadingInfo = [];
    this.debugMode =
      typeof window !== "undefined" &&
      window.location &&
      window.location.search &&
      window.location.search.includes("debug=true");
  }

  // 統一されたログ出力関数
  logMessage(level, section, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      section,
      message,
      data,
    };

    // レベル別のログ配列に追加
    switch (level) {
      case "error":
        this.loadingErrors.push(logEntry);
        console.error(`❌ [DataManager:${section}] ${message}`, data || "");
        break;
      case "warn":
        this.loadingWarnings.push(logEntry);
        console.warn(`⚠️ [DataManager:${section}] ${message}`, data || "");
        break;
      case "info":
        this.loadingInfo.push(logEntry);
        console.log(`🔍 [DataManager:${section}] ${message}`, data || "");
        break;
      case "debug":
        if (this.debugMode) {
          console.log(`🐛 [DataManager:${section}] ${message}`, data || "");
        }
        break;
      default:
        console.log(`📝 [DataManager:${section}] ${message}`, data || "");
    }
  }

  // ログ取得メソッド
  getLoadingLogs() {
    return {
      errors: this.loadingErrors,
      warnings: this.loadingWarnings,
      info: this.loadingInfo,
      summary: {
        errorCount: this.loadingErrors.length,
        warningCount: this.loadingWarnings.length,
        infoCount: this.loadingInfo.length,
      },
    };
  }

  // ログクリア
  clearLogs() {
    this.loadingErrors = [];
    this.loadingWarnings = [];
    this.loadingInfo = [];
  }

  // データ構造検証メソッド
  validateDataStructure(data) {
    this.logMessage("info", "validateDataStructure", "データ構造検証開始");

    const validationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      details: {},
    };

    try {
      // 必須プロパティの検証
      const requiredProperties = {
        questions: {
          type: "object",
          required: true,
          properties: {
            worldview: { type: "array", required: true },
            scenarios: { type: "array", required: true },
          },
        },
        vectors: { type: "object", required: true },
        hexagrams: { type: "object", required: true },
        osManual: { type: "object", required: true },
      };

      // 各プロパティの検証
      for (const [propName, propConfig] of Object.entries(requiredProperties)) {
        const value = data[propName];

        if (propConfig.required && (value === undefined || value === null)) {
          validationResult.errors.push(
            `必須プロパティ '${propName}' が存在しません`
          );
          validationResult.isValid = false;
          continue;
        }

        if (value !== undefined && value !== null) {
          // 型チェック
          if (propConfig.type === "array" && !Array.isArray(value)) {
            validationResult.errors.push(
              `プロパティ '${propName}' は配列である必要があります`
            );
            validationResult.isValid = false;
          } else if (
            propConfig.type === "object" &&
            (typeof value !== "object" || Array.isArray(value))
          ) {
            validationResult.errors.push(
              `プロパティ '${propName}' はオブジェクトである必要があります`
            );
            validationResult.isValid = false;
          }

          // ネストしたプロパティの検証
          if (propConfig.properties && typeof value === "object") {
            for (const [nestedProp, nestedConfig] of Object.entries(
              propConfig.properties
            )) {
              const nestedValue = value[nestedProp];

              if (
                nestedConfig.required &&
                (nestedValue === undefined || nestedValue === null)
              ) {
                validationResult.errors.push(
                  `必須プロパティ '${propName}.${nestedProp}' が存在しません`
                );
                validationResult.isValid = false;
              }

              if (nestedValue !== undefined && nestedValue !== null) {
                if (
                  nestedConfig.type === "array" &&
                  !Array.isArray(nestedValue)
                ) {
                  validationResult.errors.push(
                    `プロパティ '${propName}.${nestedProp}' は配列である必要があります`
                  );
                  validationResult.isValid = false;
                } else if (
                  nestedConfig.type === "object" &&
                  (typeof nestedValue !== "object" ||
                    Array.isArray(nestedValue))
                ) {
                  validationResult.errors.push(
                    `プロパティ '${propName}.${nestedProp}' はオブジェクトである必要があります`
                  );
                  validationResult.isValid = false;
                }
              }
            }
          }
        }
      }

      // データの詳細統計
      validationResult.details = {
        worldviewQuestions: data.questions?.worldview
          ? data.questions.worldview.length
          : 0,
        scenarioQuestions: data.questions?.scenarios
          ? data.questions.scenarios.length
          : 0,
        hexagramCount: Array.isArray(data.hexagrams)
          ? data.hexagrams.length
          : data.hexagrams
          ? Object.keys(data.hexagrams).length
          : 0,
        osManualCount: data.osManual ? Object.keys(data.osManual).length : 0,
        vectorCount: data.vectors ? Object.keys(data.vectors).length : 0,
        trigramCount: data.trigramsMaster ? data.trigramsMaster.length : 0,
        hasOptionalData: {
          bible: !!data.bible,
          actionPlans: !!data.actionPlans,
          elementRelationships: !!data.elementRelationships,
        },
      };

      // 警告チェック
      if (validationResult.details.worldviewQuestions < 20) {
        validationResult.warnings.push(
          `価値観質問数が少ないです (${validationResult.details.worldviewQuestions}件)`
        );
      }

      if (validationResult.details.hexagramCount < 60) {
        validationResult.warnings.push(
          `卦データ数が少ないです (${validationResult.details.hexagramCount}件)`
        );
      }

      if (validationResult.details.osManualCount < 60) {
        validationResult.warnings.push(
          `OSマニュアルデータ数が少ないです (${validationResult.details.osManualCount}件)`
        );
      }

      // 検証結果をログに記録
      this.logMessage(
        "info",
        "validateDataStructure",
        "データ構造検証完了",
        validationResult
      );

      if (!validationResult.isValid) {
        this.logMessage(
          "error",
          "validateDataStructure",
          "データ構造検証エラー",
          validationResult.errors
        );
      }

      if (validationResult.warnings.length > 0) {
        this.logMessage(
          "warn",
          "validateDataStructure",
          "データ構造検証警告",
          validationResult.warnings
        );
      }

      return validationResult;
    } catch (error) {
      this.logMessage(
        "error",
        "validateDataStructure",
        "データ構造検証中にエラーが発生",
        error
      );
      return {
        isValid: false,
        errors: [`検証プロセスでエラーが発生しました: ${error.message}`],
        warnings: [],
        details: {},
      };
    }
  }

  // データ変換メソッド（後方互換性のため）
  transformDataForBackwardCompatibility(data) {
    this.logMessage(
      "info",
      "transformData",
      "後方互換性のためのデータ変換開始"
    );

    const transformedData = { ...data };

    try {
      // hexagramsデータの正規化（配列形式をオブジェクト形式に変換）
      if (Array.isArray(transformedData.hexagrams)) {
        const hexagramsObject = {};
        transformedData.hexagrams.forEach((hexagram) => {
          if (hexagram.hexagram_id) {
            hexagramsObject[hexagram.hexagram_id] = hexagram;
          }
        });
        transformedData.hexagrams = hexagramsObject;
        this.logMessage(
          "info",
          "transformData",
          `hexagrams配列をオブジェクトに変換: ${
            Object.keys(hexagramsObject).length
          }件`
        );
      }

      // 古い形式のhexagramsデータを新しい形式に変換（後方互換性）
      if (
        transformedData.hexagrams &&
        typeof transformedData.hexagrams === "object"
      ) {
        // hexagrams_masterがある場合の処理
        if (
          transformedData.hexagrams_master &&
          Array.isArray(transformedData.hexagrams_master)
        ) {
          const hexagramsObject = {};
          transformedData.hexagrams_master.forEach((hexagram) => {
            if (hexagram.hexagram_id) {
              hexagramsObject[hexagram.hexagram_id] = hexagram;
            }
          });
          transformedData.hexagrams = hexagramsObject;
        }
      }

      // OSマニュアルデータの正規化
      if (
        transformedData.osManual &&
        typeof transformedData.osManual === "object"
      ) {
        // 各OSエントリの正規化
        for (const [key, value] of Object.entries(transformedData.osManual)) {
          if (value && typeof value === "object") {
            // 必須フィールドの確認と補完
            if (!value.name && !value.title) {
              transformedData.osManual[key] = { ...value, name: key };
            }
          }
        }
      }

      this.logMessage("info", "transformData", "データ変換完了");
      return transformedData;
    } catch (error) {
      this.logMessage(
        "error",
        "transformData",
        "データ変換中にエラーが発生",
        error
      );
      return data; // 変換に失敗した場合は元のデータを返す
    }
  }

  // グローバルデータの読み込み待機関数
  async waitForGlobalData(maxRetries = 30, retryDelay = 200) {
    this.logMessage(
      "info",
      "waitForGlobalData",
      "グローバルデータ読み込み待機開始",
      { maxRetries, retryDelay }
    );

    const startTime = Date.now();

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      this.logMessage(
        "debug",
        "waitForGlobalData",
        `データ読み込み試行 ${attempt}/${maxRetries}`
      );

      const globals = {
        WORLDVIEW_QUESTIONS:
          typeof window.WORLDVIEW_QUESTIONS !== "undefined"
            ? window.WORLDVIEW_QUESTIONS
            : null,
        SCENARIO_QUESTIONS:
          typeof window.SCENARIO_QUESTIONS !== "undefined"
            ? window.SCENARIO_QUESTIONS
            : null,
        H64_8D_VECTORS:
          typeof window.H64_8D_VECTORS !== "undefined"
            ? window.H64_8D_VECTORS
            : null,
        HAQEI_DATA:
          typeof window.HAQEI_DATA !== "undefined" ? window.HAQEI_DATA : null,
        BIBLE_DATA:
          typeof window.BIBLE_DATA !== "undefined" ? window.BIBLE_DATA : null,
      };

      const requiredData = [
        "WORLDVIEW_QUESTIONS",
        "SCENARIO_QUESTIONS",
        "H64_8D_VECTORS",
        "HAQEI_DATA",
      ];
      const availableData = requiredData.filter((key) => globals[key] !== null);

      // データの詳細チェック
      const dataDetails = {
        WORLDVIEW_QUESTIONS: globals.WORLDVIEW_QUESTIONS
          ? `${globals.WORLDVIEW_QUESTIONS.length}件`
          : "未読み込み",
        SCENARIO_QUESTIONS: globals.SCENARIO_QUESTIONS
          ? `${globals.SCENARIO_QUESTIONS.length}件`
          : "未読み込み",
        H64_8D_VECTORS: globals.H64_8D_VECTORS
          ? `${Object.keys(globals.H64_8D_VECTORS).length}件`
          : "未読み込み",
        HAQEI_DATA: globals.HAQEI_DATA ? "読み込み済み" : "未読み込み",
        BIBLE_DATA: globals.BIBLE_DATA ? "読み込み済み" : "未読み込み",
      };

      console.log(
        `🔍 [DataManager] 利用可能なデータ: ${availableData.length}/${requiredData.length}`,
        dataDetails
      );

      // すべての必須データが利用可能な場合
      if (availableData.length === requiredData.length) {
        const loadTime = Date.now() - startTime;
        this.logMessage(
          "info",
          "waitForGlobalData",
          `すべての必須データが利用可能です (${loadTime}ms)`,
          dataDetails
        );
        return globals;
      }

      // HAQEI_DATAが最重要なので、それだけでも利用可能なら続行
      if (globals.HAQEI_DATA && availableData.length >= 2) {
        const loadTime = Date.now() - startTime;
        this.logMessage(
          "warn",
          "waitForGlobalData",
          `部分的なデータで続行します (${loadTime}ms)`,
          dataDetails
        );
        return globals;
      }

      // 最後の試行でない場合は待機
      if (attempt < maxRetries) {
        this.logMessage(
          "debug",
          "waitForGlobalData",
          `${retryDelay}ms待機後に再試行します`
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        // 遅延を徐々に増加（指数バックオフ）
        retryDelay = Math.min(retryDelay * 1.5, 1000);
      }
    }

    // タイムアウトした場合でも利用可能なデータを返す
    const loadTime = Date.now() - startTime;
    this.logMessage(
      "warn",
      "waitForGlobalData",
      `データ読み込みタイムアウト、利用可能なデータで続行します (${loadTime}ms)`
    );

    return {
      WORLDVIEW_QUESTIONS:
        typeof window.WORLDVIEW_QUESTIONS !== "undefined"
          ? window.WORLDVIEW_QUESTIONS
          : null,
      SCENARIO_QUESTIONS:
        typeof window.SCENARIO_QUESTIONS !== "undefined"
          ? window.SCENARIO_QUESTIONS
          : null,
      H64_8D_VECTORS:
        typeof window.H64_8D_VECTORS !== "undefined"
          ? window.H64_8D_VECTORS
          : null,
      HAQEI_DATA:
        typeof window.HAQEI_DATA !== "undefined" ? window.HAQEI_DATA : null,
      BIBLE_DATA:
        typeof window.BIBLE_DATA !== "undefined" ? window.BIBLE_DATA : null,
    };
  }

  async loadData() {
    try {
      this.logMessage("info", "loadData", "DataManager.loadData() 開始");

      // グローバルデータの読み込み待機
      const globals = await this.waitForGlobalData();
      this.logMessage("debug", "loadData", "グローバル変数確認完了", globals);

      // 必須データの確認
      const requiredData = [
        "WORLDVIEW_QUESTIONS",
        "SCENARIO_QUESTIONS",
        "H64_8D_VECTORS",
        "HAQEI_DATA",
      ];
      const missingData = requiredData.filter((key) => !globals[key]);

      if (missingData.length > 0) {
        this.logMessage(
          "warn",
          "loadData",
          `不足データ検出: ${missingData.join(", ")}`
        );

        // HAQEI_DATAが不足している場合の詳細診断と回復処理
        if (missingData.includes("HAQEI_DATA")) {
          this.logMessage("error", "loadData", "HAQEI_DATA詳細診断開始");

          const diagnosticInfo = {
            windowExists: typeof window !== "undefined",
            haqeiDataExists: typeof window.HAQEI_DATA !== "undefined",
            haqeiDataValue: window.HAQEI_DATA,
            scriptElements:
              typeof document !== "undefined"
                ? Array.from(
                    document.querySelectorAll('script[src*="data_box"]')
                  ).map((s) => s.src)
                : [],
            domReadyState:
              typeof document !== "undefined" ? document.readyState : "unknown",
          };

          this.logMessage(
            "debug",
            "loadData",
            "HAQEI_DATA診断情報",
            diagnosticInfo
          );

          // フォールバック処理を試行
          if (typeof window.HAQEI_DATA === "undefined") {
            this.logMessage(
              "warn",
              "loadData",
              "HAQEI_DATAフォールバック処理を実行"
            );

            // 最小限のフォールバックデータを作成
            const fallbackData = {
              hexagrams: {},
              hexagrams_master: [],
              os_manual: {},
              trigrams_master: [],
              element_relationships: [],
              action_plans: {},
              sho_den: {},
              tai_sho_den: {},
              jo_ka_den: {},
              zatsu_ka_den: {},
              tuan_den: {},
            };

            window.HAQEI_DATA = fallbackData;
            globals.HAQEI_DATA = fallbackData;
            this.logMessage(
              "warn",
              "loadData",
              "フォールバックデータを設定しました",
              fallbackData
            );
          }
        }

        // 他の必須データのフォールバック処理
        if (missingData.includes("WORLDVIEW_QUESTIONS")) {
          this.logMessage(
            "warn",
            "loadData",
            "WORLDVIEW_QUESTIONSフォールバック処理"
          );
          window.WORLDVIEW_QUESTIONS = [];
          globals.WORLDVIEW_QUESTIONS = [];
        }

        if (missingData.includes("SCENARIO_QUESTIONS")) {
          this.logMessage(
            "warn",
            "loadData",
            "SCENARIO_QUESTIONSフォールバック処理"
          );
          window.SCENARIO_QUESTIONS = [];
          globals.SCENARIO_QUESTIONS = [];
        }

        if (missingData.includes("H64_8D_VECTORS")) {
          this.logMessage(
            "warn",
            "loadData",
            "H64_8D_VECTORSフォールバック処理"
          );
          window.H64_8D_VECTORS = {};
          globals.H64_8D_VECTORS = {};
        }
      }

      // 🔧 BIBLE_DATA の柔軟な取得（bible.jsから）
      let bible;
      if (globals.BIBLE_DATA) {
        bible = globals.BIBLE_DATA;
        console.log("✅ BIBLE_DATA found as separate file");
      } else {
        console.warn("⚠️ BIBLE_DATA not found, using empty object");
        bible = {};
      }

      // データの統合（安全な取得）
      let rawData = {
        questions: {
          worldview: globals.WORLDVIEW_QUESTIONS || [],
          scenarios: globals.SCENARIO_QUESTIONS || [],
        },
        vectors: globals.H64_8D_VECTORS || {},
        hexagrams: (globals.HAQEI_DATA && globals.HAQEI_DATA.hexagrams) || [],
        osManual: (globals.HAQEI_DATA && globals.HAQEI_DATA.os_manual) || {},
        trigramsMaster:
          (globals.HAQEI_DATA && globals.HAQEI_DATA.trigrams_master) || [],
        elementRelationships:
          (globals.HAQEI_DATA && globals.HAQEI_DATA.element_relationships) ||
          [],
        actionPlans:
          (globals.HAQEI_DATA && globals.HAQEI_DATA.action_plans) || {},
        bible: bible || {}, // 🔧 修正
        tuanDen: (globals.HAQEI_DATA && globals.HAQEI_DATA.tuan_den) || {},
        taiShoDen: (globals.HAQEI_DATA && globals.HAQEI_DATA.tai_sho_den) || {},
        shoDen: (globals.HAQEI_DATA && globals.HAQEI_DATA.sho_den) || {},
        joKaDen: (globals.HAQEI_DATA && globals.HAQEI_DATA.jo_ka_den) || {},
        zatsuKaDen:
          (globals.HAQEI_DATA && globals.HAQEI_DATA.zatsu_ka_den) || {},
        keyword_map:
          (globals.HAQEI_DATA && globals.HAQEI_DATA.keyword_map) || {},
        line_keyword_map:
          (globals.HAQEI_DATA && globals.HAQEI_DATA.line_keyword_map) || {},
      };

      // 後方互換性のためのデータ変換（検証の前に実行）
      const transformedData =
        this.transformDataForBackwardCompatibility(rawData);

      // データ構造検証（変換後のデータで実行）
      const validationResult = this.validateDataStructure(transformedData);
      if (!validationResult.isValid) {
        this.logMessage(
          "error",
          "loadData",
          "データ構造検証に失敗しました",
          validationResult.errors
        );
        // 検証に失敗してもデータを読み込む（フォールバック処理）
      }

      // 変換済みデータを設定
      this.data = transformedData;

      this.loaded = true;

      // 読み込み完了データの統計
      const loadedDataStats = {
        worldview: this.data.questions.worldview?.length || 0,
        scenarios: this.data.questions.scenarios?.length || 0,
        hexagrams: Array.isArray(this.data.hexagrams)
          ? this.data.hexagrams.length
          : Object.keys(this.data.hexagrams).length,
        bible: Object.keys(this.data.bible).length,
        osManual: Object.keys(this.data.osManual).length,
        vectors: Object.keys(this.data.vectors).length,
        trigramsMaster: Array.isArray(this.data.trigramsMaster)
          ? this.data.trigramsMaster.length
          : 0,
        elementRelationships: Array.isArray(this.data.elementRelationships)
          ? this.data.elementRelationships.length
          : 0,
        actionPlans: Object.keys(this.data.actionPlans).length,
      };

      this.logMessage(
        "info",
        "loadData",
        "DataManager.loadData() 完了",
        loadedDataStats
      );

      // 読み込み結果のサマリー
      const totalLoadedItems = Object.values(loadedDataStats).reduce(
        (sum, count) => sum + count,
        0
      );
      this.logMessage(
        "info",
        "loadData",
        `データ読み込み完了 - 総項目数: ${totalLoadedItems}`
      );

      // 🔧 互換性データの読み込みを追加
      try {
        this.logMessage("info", "loadData", "互換性データの読み込み開始");
        await this.loadCompatibilityData();
        this.logMessage("info", "loadData", "互換性データの読み込み完了");
      } catch (compatibilityError) {
        this.logMessage(
          "warn",
          "loadData",
          "互換性データの読み込みに失敗しましたが、処理を続行します",
          compatibilityError
        );
        // 互換性データの読み込みに失敗してもメインの処理は続行
      }

      // 警告レベルの確認
      const warnings = this.getLoadingLogs().warnings;
      if (warnings.length > 0) {
        this.logMessage(
          "warn",
          "loadData",
          `読み込み警告あり: ${warnings.length}件`
        );
      }
    } catch (error) {
      this.logMessage(
        "error",
        "loadData",
        "DataManager.loadData() 致命的エラー",
        error
      );

      // エラーの詳細情報を記録
      const errorDetails = {
        errorMessage: error.message,
        errorStack: error.stack,
        loadingAttempts: this.loaded ? "完了済み" : "未完了",
        globalDataState: {
          HAQEI_DATA: typeof window.HAQEI_DATA !== "undefined",
          WORLDVIEW_QUESTIONS:
            typeof window.WORLDVIEW_QUESTIONS !== "undefined",
          SCENARIO_QUESTIONS: typeof window.SCENARIO_QUESTIONS !== "undefined",
          H64_8D_VECTORS: typeof window.H64_8D_VECTORS !== "undefined",
        },
      };

      this.logMessage("error", "loadData", "エラー詳細情報", errorDetails);

      // ユーザーフレンドリーなエラーメッセージの生成
      let userFriendlyMessage = "データの読み込み中にエラーが発生しました。";

      if (error.message.includes("HAQEI_DATA")) {
        userFriendlyMessage =
          "基本データファイルの読み込みに失敗しました。ページを再読み込みしてください。";
      } else if (error.message.includes("timeout")) {
        userFriendlyMessage =
          "データ読み込みがタイムアウトしました。ネットワーク接続を確認してページを再読み込みしてください。";
      } else if (error.message.includes("validation")) {
        userFriendlyMessage =
          "データ形式に問題があります。管理者にお問い合わせください。";
      }

      throw new Error(userFriendlyMessage);
    }
  }

  // 🔧 BIBLE_DATA 取得メソッド
  getBibleData() {
    try {
      console.log(`🔍 [DataManager] getBibleData開始`);

      if (!this.loaded) {
        const errorMsg = "DataManagerが初期化されていません";
        console.error(`❌ [DataManager] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      const result = this.data.bible || {};
      console.log(
        `✅ [DataManager] getBibleData完了 - ${Object.keys(result).length}件`
      );
      return result;
    } catch (error) {
      console.error(`❌ [DataManager] getBibleDataエラー:`, error);
      throw new Error(`聖書データの取得に失敗しました: ${error.message}`);
    }
  }

  // 既存のメソッドはそのまま維持
  getWorldviewQuestions() {
    try {
      console.log(`🔍 [DataManager] getWorldviewQuestions開始`);

      if (!this.loaded) {
        const errorMsg =
          "DataManagerが初期化されていません。システムの初期化をお待ちください。";
        console.error(`❌ [DataManager] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      if (!this.data) {
        const errorMsg =
          "データオブジェクトが存在しません。ページを再読み込みしてください。";
        console.error(`❌ [DataManager] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      const result = this.data.questions?.worldview || [];

      if (result.length === 0) {
        console.warn(`⚠️ [DataManager] 価値観質問データが空です`);
      }

      console.log(
        `✅ [DataManager] getWorldviewQuestions完了 - ${result.length}件`
      );
      return result;
    } catch (error) {
      console.error(`❌ [DataManager] getWorldviewQuestionsエラー:`, error);

      // ユーザーフレンドリーなエラーメッセージを生成
      let userMessage = "価値観質問データの取得に失敗しました。";
      if (error.message.includes("初期化")) {
        userMessage =
          "システムの初期化が完了していません。しばらく待ってから再試行してください。";
      } else if (error.message.includes("データオブジェクト")) {
        userMessage =
          "データファイルの読み込みに失敗しました。ページを再読み込みしてください。";
      }

      throw new Error(userMessage);
    }
  }

  getScenarioQuestions() {
    try {
      console.log(`🔍 [DataManager] getScenarioQuestions開始`);

      if (!this.loaded) {
        const errorMsg =
          "DataManagerが初期化されていません。システムの初期化をお待ちください。";
        console.error(`❌ [DataManager] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      if (!this.data) {
        const errorMsg =
          "データオブジェクトが存在しません。ページを再読み込みしてください。";
        console.error(`❌ [DataManager] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      const result = this.data.questions?.scenarios || [];

      if (result.length === 0) {
        console.warn(`⚠️ [DataManager] シナリオ質問データが空です`);
      }

      console.log(
        `✅ [DataManager] getScenarioQuestions完了 - ${result.length}件`
      );
      return result;
    } catch (error) {
      console.error(`❌ [DataManager] getScenarioQuestionsエラー:`, error);

      // ユーザーフレンドリーなエラーメッセージを生成
      let userMessage = "シナリオ質問データの取得に失敗しました。";
      if (error.message.includes("初期化")) {
        userMessage =
          "システムの初期化が完了していません。しばらく待ってから再試行してください。";
      } else if (error.message.includes("データオブジェクト")) {
        userMessage =
          "データファイルの読み込みに失敗しました。ページを再読み込みしてください。";
      }

      throw new Error(userMessage);
    }
  }

  getVectors() {
    try {
      console.log(`🔍 [DataManager] getVectors開始`);

      if (!this.loaded) {
        const errorMsg =
          "DataManagerが初期化されていません。システムの初期化をお待ちください。";
        console.error(`❌ [DataManager] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      if (!this.data) {
        const errorMsg =
          "データオブジェクトが存在しません。ページを再読み込みしてください。";
        console.error(`❌ [DataManager] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      const result = this.data.vectors || {};

      if (Object.keys(result).length === 0) {
        console.warn(`⚠️ [DataManager] ベクターデータが空です`);
      }

      console.log(
        `✅ [DataManager] getVectors完了 - ${Object.keys(result).length}件`
      );
      return result;
    } catch (error) {
      console.error(`❌ [DataManager] getVectorsエラー:`, error);

      // ユーザーフレンドリーなエラーメッセージを生成
      let userMessage = "ベクターデータの取得に失敗しました。";
      if (error.message.includes("初期化")) {
        userMessage =
          "システムの初期化が完了していません。しばらく待ってから再試行してください。";
      } else if (error.message.includes("データオブジェクト")) {
        userMessage =
          "データファイルの読み込みに失敗しました。ページを再読み込みしてください。";
      }

      throw new Error(userMessage);
    }
  }

  getAllHexagramData() {
    try {
      console.log(`🔍 [DataManager] getAllHexagramData開始`);

      if (!this.loaded) {
        const errorMsg = "DataManagerが初期化されていません";
        console.error(`❌ [DataManager] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      const hexagramsData = this.data.hexagrams || {};

      // hexagramsデータが配列かオブジェクトかを判定し、常に配列を返す
      let result;
      if (Array.isArray(hexagramsData)) {
        result = hexagramsData;
        console.log(
          `🔍 [DataManager] hexagramsデータは配列形式 - ${result.length}件`
        );
      } else if (typeof hexagramsData === "object" && hexagramsData !== null) {
        // オブジェクトの場合は配列に変換
        result = Object.values(hexagramsData);
        console.log(
          `🔍 [DataManager] hexagramsデータをオブジェクト形式から配列に変換 - ${result.length}件`
        );
      } else {
        console.warn(
          `⚠️ [DataManager] hexagramsデータが予期しない形式:`,
          typeof hexagramsData
        );
        result = [];
      }

      // 結果の検証
      if (!Array.isArray(result)) {
        const errorMsg = "hexagramsデータを配列に変換できませんでした";
        console.error(`❌ [DataManager] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      console.log(
        `✅ [DataManager] getAllHexagramData完了 - ${result.length}件の配列を返却`
      );
      console.log(`🔍 [DataManager] サンプルデータ:`, result[0]);

      return result;
    } catch (error) {
      console.error(`❌ [DataManager] getAllHexagramDataエラー:`, error);
      throw new Error(`卦データの取得に失敗しました: ${error.message}`);
    }
  }

  getOSManual() {
    try {
      console.log(`🔍 [DataManager] getOSManual開始`);

      if (!this.loaded) {
        const errorMsg = "DataManagerが初期化されていません";
        console.error(`❌ [DataManager] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      if (!this.data) {
        const errorMsg = "データオブジェクトが存在しません";
        console.error(`❌ [DataManager] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      const result = this.data.osManual || {};

      if (Object.keys(result).length === 0) {
        console.warn(`⚠️ [DataManager] OSマニュアルデータが空です`);
      }

      console.log(
        `✅ [DataManager] getOSManual完了 - ${Object.keys(result).length}件`
      );
      return result;
    } catch (error) {
      console.error(`❌ [DataManager] getOSManualエラー:`, error);

      // ユーザーフレンドリーなエラーメッセージを生成
      let userMessage = "OSマニュアルデータの取得に失敗しました。";
      if (error.message.includes("初期化")) {
        userMessage =
          "システムの初期化が完了していません。しばらく待ってから再試行してください。";
      } else if (error.message.includes("データオブジェクト")) {
        userMessage =
          "データファイルの読み込みに失敗しました。ページを再読み込みしてください。";
      }

      throw new Error(userMessage);
    }
  }

  getTrigramsMaster() {
    try {
      console.log(`🔍 [DataManager] getTrigramsMaster開始`);

      if (!this.loaded) {
        const errorMsg = "DataManagerが初期化されていません";
        console.error(`❌ [DataManager] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      const result = this.data.trigramsMaster || {};
      console.log(
        `✅ [DataManager] getTrigramsMaster完了 - ${
          Object.keys(result).length
        }件`
      );
      return result;
    } catch (error) {
      console.error(`❌ [DataManager] getTrigramsMasterエラー:`, error);
      throw new Error(
        `三爻マスターデータの取得に失敗しました: ${error.message}`
      );
    }
  }

  getElementRelationships() {
    try {
      console.log(`🔍 [DataManager] getElementRelationships開始`);

      if (!this.loaded) {
        const errorMsg = "DataManagerが初期化されていません";
        console.error(`❌ [DataManager] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      const result = this.data.elementRelationships || {};
      console.log(
        `✅ [DataManager] getElementRelationships完了 - ${
          Object.keys(result).length
        }件`
      );
      return result;
    } catch (error) {
      console.error(`❌ [DataManager] getElementRelationshipsエラー:`, error);
      throw new Error(`要素関係データの取得に失敗しました: ${error.message}`);
    }
  }

  getActionPlans() {
    try {
      console.log(`🔍 [DataManager] getActionPlans開始`);

      if (!this.loaded) {
        const errorMsg = "DataManagerが初期化されていません";
        console.error(`❌ [DataManager] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      const result = this.data.actionPlans || {};
      console.log(
        `✅ [DataManager] getActionPlans完了 - ${Object.keys(result).length}件`
      );
      return result;
    } catch (error) {
      console.error(`❌ [DataManager] getActionPlansエラー:`, error);
      throw new Error(
        `アクションプランデータの取得に失敗しました: ${error.message}`
      );
    }
  }

  getKeywordMap() {
    return this.data.keyword_map || {};
  }

  getLineKeywordMap() {
    return this.data.line_keyword_map || {};
  }

  /**
   * 互換性データを動的に読み込み、keyword_mapとline_keyword_mapを更新
   */
  async loadCompatibilityData() {
    try {
      console.log("🔄 [DataManager] 互換性データの動的読み込み開始");

      if (typeof CompatibilityDataLoader === "undefined") {
        console.error(
          "❌ [DataManager] CompatibilityDataLoader が利用できません"
        );
        return false;
      }

      const loader = new CompatibilityDataLoader();
      const compatibilityData = await loader.loadCompatibilityData();

      // データを更新
      this.data.keyword_map = compatibilityData.keyword_map;
      this.data.line_keyword_map = compatibilityData.line_keyword_map;

      console.log("✅ [DataManager] 互換性データの動的読み込み完了");
      console.log(
        `📊 keyword_map: ${Object.keys(this.data.keyword_map).length}件`
      );
      console.log(
        `📊 line_keyword_map: ${
          Object.keys(this.data.line_keyword_map).length
        }件`
      );

      return true;
    } catch (error) {
      console.error("❌ [DataManager] 互換性データ読み込みエラー:", error);
      return false;
    }
  }

  // データ統計情報を取得するメソッド（不足していたメソッドを追加）
  getDataStats() {
    try {
      this.logMessage("info", "getDataStats", "データ統計情報取得開始");

      if (!this.loaded) {
        const errorMsg = "DataManagerが初期化されていません";
        this.logMessage("error", "getDataStats", errorMsg);

        // 未初期化でも基本的な統計情報を返す
        return {
          loaded: false,
          error: errorMsg,
          loadingErrors: this.loadingErrors?.length || 0,
          loadingWarnings: this.loadingWarnings?.length || 0,
          dataStructure: {
            worldviewQuestions: 0,
            scenarioQuestions: 0,
            hexagrams: 0,
            osManual: 0,
            vectors: 0,
            trigramsMaster: 0,
            elementRelationships: 0,
            actionPlans: 0,
            bible: 0,
            tuanDen: 0,
            taiShoDen: 0,
            shoDen: 0,
            joKaDen: 0,
            zatsuKaDen: 0,
          },
          globalDataAvailability: {
            HAQEI_DATA: typeof window.HAQEI_DATA !== "undefined",
            WORLDVIEW_QUESTIONS:
              typeof window.WORLDVIEW_QUESTIONS !== "undefined",
            SCENARIO_QUESTIONS:
              typeof window.SCENARIO_QUESTIONS !== "undefined",
            H64_8D_VECTORS: typeof window.H64_8D_VECTORS !== "undefined",
            BIBLE_DATA: typeof window.BIBLE_DATA !== "undefined",
          },
          timestamp: new Date().toISOString(),
        };
      }

      if (!this.data) {
        const errorMsg = "データオブジェクトが存在しません";
        this.logMessage("error", "getDataStats", errorMsg);

        // データオブジェクトが存在しない場合でも基本的な統計情報を返す
        return {
          loaded: this.loaded,
          error: errorMsg,
          loadingErrors: this.loadingErrors?.length || 0,
          loadingWarnings: this.loadingWarnings?.length || 0,
          dataStructure: {
            worldviewQuestions: 0,
            scenarioQuestions: 0,
            hexagrams: 0,
            osManual: 0,
            vectors: 0,
            trigramsMaster: 0,
            elementRelationships: 0,
            actionPlans: 0,
            bible: 0,
            tuanDen: 0,
            taiShoDen: 0,
            shoDen: 0,
            joKaDen: 0,
            zatsuKaDen: 0,
          },
          globalDataAvailability: {
            HAQEI_DATA: typeof window.HAQEI_DATA !== "undefined",
            WORLDVIEW_QUESTIONS:
              typeof window.WORLDVIEW_QUESTIONS !== "undefined",
            SCENARIO_QUESTIONS:
              typeof window.SCENARIO_QUESTIONS !== "undefined",
            H64_8D_VECTORS: typeof window.H64_8D_VECTORS !== "undefined",
            BIBLE_DATA: typeof window.BIBLE_DATA !== "undefined",
          },
          timestamp: new Date().toISOString(),
        };
      }

      const stats = {
        loaded: this.loaded,
        loadingErrors: this.loadingErrors.length,
        loadingWarnings: this.loadingWarnings.length,
        dataStructure: {
          worldviewQuestions: this.data.questions?.worldview?.length || 0,
          scenarioQuestions: this.data.questions?.scenarios?.length || 0,
          hexagrams: Array.isArray(this.data.hexagrams)
            ? this.data.hexagrams.length
            : Object.keys(this.data.hexagrams || {}).length,
          osManual: Object.keys(this.data.osManual || {}).length,
          vectors: Object.keys(this.data.vectors || {}).length,
          trigramsMaster: Array.isArray(this.data.trigramsMaster)
            ? this.data.trigramsMaster.length
            : Object.keys(this.data.trigramsMaster || {}).length,
          elementRelationships: Array.isArray(this.data.elementRelationships)
            ? this.data.elementRelationships.length
            : Object.keys(this.data.elementRelationships || {}).length,
          actionPlans: Object.keys(this.data.actionPlans || {}).length,
          bible: Object.keys(this.data.bible || {}).length,
          tuanDen: Object.keys(this.data.tuanDen || {}).length,
          taiShoDen: Object.keys(this.data.taiShoDen || {}).length,
          shoDen: Object.keys(this.data.shoDen || {}).length,
          joKaDen: Object.keys(this.data.joKaDen || {}).length,
          zatsuKaDen: Object.keys(this.data.zatsuKaDen || {}).length,
        },
        globalDataAvailability: {
          HAQEI_DATA: typeof window.HAQEI_DATA !== "undefined",
          WORLDVIEW_QUESTIONS:
            typeof window.WORLDVIEW_QUESTIONS !== "undefined",
          SCENARIO_QUESTIONS: typeof window.SCENARIO_QUESTIONS !== "undefined",
          H64_8D_VECTORS: typeof window.H64_8D_VECTORS !== "undefined",
          BIBLE_DATA: typeof window.BIBLE_DATA !== "undefined",
        },
        timestamp: new Date().toISOString(),
      };

      // 総データ項目数を計算
      const totalItems = Object.values(stats.dataStructure).reduce(
        (sum, count) => sum + count,
        0
      );
      stats.totalDataItems = totalItems;

      // データ完整性チェック
      stats.dataIntegrity = {
        hasRequiredData:
          stats.dataStructure.worldviewQuestions > 0 &&
          stats.dataStructure.hexagrams > 0 &&
          stats.dataStructure.osManual > 0,
        missingCriticalData: [],
      };

      if (stats.dataStructure.worldviewQuestions === 0) {
        stats.dataIntegrity.missingCriticalData.push("worldviewQuestions");
      }
      if (stats.dataStructure.hexagrams === 0) {
        stats.dataIntegrity.missingCriticalData.push("hexagrams");
      }
      if (stats.dataStructure.osManual === 0) {
        stats.dataIntegrity.missingCriticalData.push("osManual");
      }

      this.logMessage("info", "getDataStats", "データ統計情報取得完了", stats);
      return stats;
    } catch (error) {
      this.logMessage(
        "error",
        "getDataStats",
        "データ統計情報取得エラー",
        error
      );

      // エラーが発生した場合でも基本的な統計情報を返す
      return {
        loaded: this.loaded || false,
        loadingErrors: this.loadingErrors?.length || 0,
        loadingWarnings: this.loadingWarnings?.length || 0,
        dataStructure: {},
        globalDataAvailability: {},
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  findHexagramById(hexagramId) {
    try {
      console.log(`🔍 [DataManager] findHexagramById開始 - ID: ${hexagramId}`);

      if (!this.loaded) {
        const errorMsg = "DataManagerが初期化されていません";
        console.error(`❌ [DataManager] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      if (hexagramId == null) {
        console.warn(`⚠️ [DataManager] hexagramIdがnullまたはundefinedです`);
        return null;
      }

      const hexagrams = this.getAllHexagramData();
      if (!Array.isArray(hexagrams)) {
        console.error("❌ [DataManager] 卦データが配列ではありません");
        return null;
      }

      const result = hexagrams.find((h) => h && h.hexagram_id === hexagramId);

      console.log(
        `✅ [DataManager] findHexagramById完了 - ID: ${hexagramId}, found: ${!!result}`
      );
      return result || null;
    } catch (error) {
      console.error(`❌ [DataManager] findHexagramByIdエラー:`, error);
      throw new Error(`卦データの取得に失敗しました: ${error.message}`);
    }
  }

  getTuanDenData(hexagramId) {
    try {
      console.log(`🔍 [DataManager] getTuanDenData開始 - ID: ${hexagramId}`);

      if (!this.loaded) {
        const errorMsg = "DataManagerが初期化されていません";
        console.error(`❌ [DataManager] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      if (hexagramId == null) {
        console.warn(`⚠️ [DataManager] hexagramIdがnullまたはundefinedです`);
        return null;
      }

      const result = this.data.tuanDen?.[hexagramId] || null;
      console.log(
        `✅ [DataManager] getTuanDenData完了 - ID: ${hexagramId}, found: ${!!result}`
      );
      return result;
    } catch (error) {
      console.error(`❌ [DataManager] getTuanDenDataエラー:`, error);
      throw new Error(`彖伝データの取得に失敗しました: ${error.message}`);
    }
  }

  getTaiShoDenData(hexagramId) {
    try {
      console.log(`🔍 [DataManager] getTaiShoDenData開始 - ID: ${hexagramId}`);

      if (!this.loaded) {
        const errorMsg = "DataManagerが初期化されていません";
        console.error(`❌ [DataManager] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      if (hexagramId == null) {
        console.warn(`⚠️ [DataManager] hexagramIdがnullまたはundefinedです`);
        return null;
      }

      const result = this.data.taiShoDen?.[hexagramId] || null;
      console.log(
        `✅ [DataManager] getTaiShoDenData完了 - ID: ${hexagramId}, found: ${!!result}`
      );
      return result;
    } catch (error) {
      console.error(`❌ [DataManager] getTaiShoDenDataエラー:`, error);
      throw new Error(`大象伝データの取得に失敗しました: ${error.message}`);
    }
  }

  // 統一データ取得機能 - 複数のデータソースを統合
  /**
   * Returns unified hexagram data for a given hexagramId.
   * @param {number|string} hexagramId
   * @returns {UnifiedHexagramData|null}
   */
  getUnifiedHexagramData(hexagramId) {
    try {
      console.log(
        `🔍 [DataManager] getUnifiedHexagramData開始 - ID: ${hexagramId}`
      );

      if (!this.loaded) {
        const errorMsg = "DataManagerが初期化されていません";
        console.error(`❌ [DataManager] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      // 入力値の検証
      if (hexagramId == null) {
        console.warn(`⚠️ [DataManager] hexagramIdがnullまたはundefinedです`);
        return null;
      }

      // 型安全なID変換
      let id;
      try {
        id =
          typeof hexagramId === "string"
            ? parseInt(hexagramId, 10)
            : hexagramId;

        // NaNチェック
        if (isNaN(id) || id < 1) {
          console.warn(`⚠️ [DataManager] 無効なID: ${hexagramId} -> ${id}`);
          return null;
        }
      } catch (parseError) {
        console.error(
          `❌ [DataManager] ID変換エラー: ${hexagramId}`,
          parseError
        );
        return null;
      }

      console.log(`🔍 [DataManager] 変換後ID: ${id}`);

      // データ存在チェック
      if (!this.data) {
        const errorMsg = "データオブジェクトが存在しません";
        console.error(`❌ [DataManager] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      // 🔧 データ構造の違いに対応
      // hexagrams: 配列形式（インデックス0 = ID:1）
      // osManual: オブジェクト形式（キー1 = ID:1）
      let hexagramData = null;
      let osManualData = null;

      try {
        if (this.data.hexagrams) {
          hexagramData = Array.isArray(this.data.hexagrams)
            ? this.data.hexagrams.find((h) => h && h.hexagram_id === id)
            : this.data.hexagrams[id];
        }

        if (this.data.osManual) {
          osManualData = this.data.osManual[id];
        }

        console.log(
          `🔍 [DataManager] データ取得結果 - hexagram: ${!!hexagramData}, osManual: ${!!osManualData}`
        );
      } catch (dataAccessError) {
        console.error(
          `❌ [DataManager] データアクセスエラー:`,
          dataAccessError
        );
        // データアクセスエラーでも処理を継続
      }

      if (!hexagramData && !osManualData) {
        console.warn(
          `⚠️ [DataManager] ID ${id} に対応するデータが見つかりません`
        );
        return null;
      }

      // 型安全な文字列変換ヘルパー
      function safeString(val, fieldName = "unknown") {
        try {
          if (typeof val === "string") return val;
          if (val && typeof val === "object") {
            if (val.text) return val.text;
            if (val.content) return val.content;
            if (val.interpretation) return val.interpretation;
            try {
              return JSON.stringify(val);
            } catch (jsonError) {
              console.warn(
                `⚠️ [DataManager] JSON変換失敗 (${fieldName}):`,
                jsonError
              );
              return "";
            }
          }
          return val == null ? "" : String(val);
        } catch (conversionError) {
          console.error(
            `❌ [DataManager] 文字列変換エラー (${fieldName}):`,
            conversionError
          );
          return "";
        }
      }

      // キーワード配列の安全な処理
      function safeKeywords(hexagramKeywords, osManualKeywords) {
        try {
          if (Array.isArray(hexagramKeywords)) {
            return hexagramKeywords;
          }
          if (Array.isArray(osManualKeywords)) {
            return osManualKeywords;
          }
          if (typeof hexagramKeywords === "string") {
            return hexagramKeywords.split(/[,、\s]+/).filter(Boolean);
          }
          if (typeof osManualKeywords === "string") {
            return osManualKeywords.split(/[,、\s]+/).filter(Boolean);
          }
          return [];
        } catch (keywordError) {
          console.error(`❌ [DataManager] キーワード処理エラー:`, keywordError);
          return [];
        }
      }

      // 優先順位: hexagramData > osManualData
      const unifiedData = {
        id: id,
        name: safeString(
          hexagramData?.name_jp || osManualData?.name || "",
          "name"
        ),
        catchphrase: safeString(
          hexagramData?.catchphrase || osManualData?.catchphrase || "",
          "catchphrase"
        ),
        description: safeString(
          hexagramData?.description ||
            osManualData?.summary ||
            osManualData?.description ||
            "",
          "description"
        ),
        strategy: safeString(
          hexagramData?.strategy || osManualData?.strategy || "",
          "strategy"
        ),
        keywords: safeKeywords(hexagramData?.keywords, osManualData?.keywords),
        hexagramData: hexagramData || null,
        osManualData: osManualData || null,
      };

      console.log(
        `✅ [DataManager] 統一データ生成完了 - ID: ${id}, name: "${unifiedData.name}"`
      );
      return unifiedData;
    } catch (error) {
      console.error(
        `❌ [DataManager] getUnifiedHexagramData致命的エラー:`,
        error
      );

      // ユーザーフレンドリーなエラーメッセージを生成
      let userMessage = "データの取得中にエラーが発生しました。";
      if (error.message.includes("not loaded")) {
        userMessage =
          "システムの初期化が完了していません。しばらく待ってから再試行してください。";
      } else if (error.message.includes("データオブジェクト")) {
        userMessage =
          "データファイルの読み込みに失敗しました。ページを再読み込みしてください。";
      }

      // エラー情報をコンソールに詳細出力
      console.error(`❌ [DataManager] エラー詳細:`, {
        originalError: error,
        hexagramId: hexagramId,
        loaded: this.loaded,
        hasData: !!this.data,
        userMessage: userMessage,
      });

      throw new Error(userMessage);
    }
  }

  // Helper method to get specific data safely
  getGlobal(key) {
    return typeof window !== "undefined" && window[key] ? window[key] : null;
  }

  /**
   * 指定されたhexagramIdの詳細情報を取得
   * @param {number} hexagramId 
   * @returns {Object|null} hexagram詳細データ
   */
  getHexagramDetails(hexagramId) {
    try {
      if (!this.loaded) {
        console.warn('DataManagerが初期化されていません');
        return null;
      }

      if (!hexagramId || hexagramId < 1 || hexagramId > 64) {
        console.warn(`無効なhexagramId: ${hexagramId}`);
        return null;
      }

      // まず、グローバル変数の存在を確認
      let hexagramDetails = null;
      
      // 複数の方法でHEXAGRAM_DETAILSにアクセスを試行
      if (typeof HEXAGRAM_DETAILS !== 'undefined') {
        hexagramDetails = HEXAGRAM_DETAILS;
      } else if (typeof window !== 'undefined' && window.HEXAGRAM_DETAILS) {
        hexagramDetails = window.HEXAGRAM_DETAILS;
      } else if (this.data && this.data.hexagram_details) {
        hexagramDetails = this.data.hexagram_details;
      }

      if (!hexagramDetails) {
        console.warn('HEXAGRAM_DETAILSが見つかりません');
        // フォールバック: 基本的な情報のみ返す
        return {
          name_jp: `八卦 ${hexagramId}`,
          catchphrase: '詳細情報を読み込み中...',
          description: 'データが利用できません',
          potential_strengths: ['創造性と行動力', 'リーダーシップ', '問題解決能力'],
          potential_weaknesses: ['完璧主義', 'ストレス管理', '他者との協調']
        };
      }

      if (hexagramDetails[hexagramId]) {
        const details = hexagramDetails[hexagramId];
        
        // engineプロパティから強みと課題を取得
        return {
          name_jp: details.name_jp || `八卦 ${hexagramId}`,
          catchphrase: details.catchphrase || '詳細情報を読み込み中...',
          description: details.description || 'データが利用できません',
          potential_strengths: details.engine?.potential_strengths || ['創造性と行動力', 'リーダーシップ', '問題解決能力'],
          potential_weaknesses: details.engine?.potential_weaknesses || ['完璧主義', 'ストレス管理', '他者との協調']
        };
      }

      console.warn(`hexagramId ${hexagramId} の詳細情報が見つかりません`);
      // フォールバック情報を返す
      return {
        name_jp: `八卦 ${hexagramId}`,
        catchphrase: '詳細情報を読み込み中...',
        description: 'データが利用できません',
        potential_strengths: ['創造性と行動力', 'リーダーシップ', '問題解決能力'],
        potential_weaknesses: ['完璧主義', 'ストレス管理', '他者との協調']
      };
    } catch (error) {
      console.error('getHexagramDetailsでエラー:', error);
      // エラー時のフォールバック
      return {
        name_jp: `八卦 ${hexagramId}`,
        catchphrase: 'エラーが発生しました',
        description: 'データの取得に失敗しました',
        potential_strengths: ['基本的な能力', '適応力', '学習能力'],
        potential_weaknesses: ['データ不足', '情報不足', '詳細不明']
      };
    }
  }
}

// グローバルスコープで利用可能にする
if (typeof window !== "undefined") {
  window.DataManager = DataManager;
}
