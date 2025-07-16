// DataManager.js - BIBLE_DATA対応修正版

class DataManager {
  constructor() {
    this.data = {};
    this.loaded = false;
  }

  async loadData() {
    try {
      console.log("🔍 DataManager.loadData() 開始");

      // グローバル変数の存在確認
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
          typeof window.BIBLE_DATA !== "undefined" ? window.BIBLE_DATA : null, // 🔧 追加
      };

      console.log("🔍 グローバル変数確認:", globals);

      // 必須データの確認
      const requiredData = [
        "WORLDVIEW_QUESTIONS",
        "SCENARIO_QUESTIONS", 
        "H64_8D_VECTORS",
        "HAQEI_DATA",
      ];
      const missingData = requiredData.filter((key) => !globals[key]);

      if (missingData.length > 0) {
        console.warn(`⚠️ Missing data: ${missingData.join(", ")}`);
        // HAQEI_DATAが不足している場合はエラーにする
        if (missingData.includes("HAQEI_DATA")) {
          throw new Error(`Critical data missing: HAQEI_DATA not found`);
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

      // データの統合
      this.data = {
        questions: {
          worldview: globals.WORLDVIEW_QUESTIONS,
          scenarios: globals.SCENARIO_QUESTIONS,
        },
        vectors: globals.H64_8D_VECTORS,
        hexagrams: globals.HAQEI_DATA.hexagrams || {},
        osManual: globals.HAQEI_DATA.os_manual || {},
        trigramsMaster: globals.HAQEI_DATA.trigrams_master || {},
        elementRelationships: globals.HAQEI_DATA.element_relationships || {},
        actionPlans: globals.HAQEI_DATA.action_plans || {},
        bible: bible, // 🔧 修正
        tuanDen: globals.HAQEI_DATA.tuan_den || {},
        taiShoDen: globals.HAQEI_DATA.tai_sho_den || {},
        shoDen: globals.HAQEI_DATA.sho_den || {},
        joKaDen: globals.HAQEI_DATA.jo_ka_den || {},
        zatsuKaDen: globals.HAQEI_DATA.zatsu_ka_den || {},
      };

      this.loaded = true;
      console.log("✅ DataManager.loadData() 完了");
      console.log("📊 読み込み完了データ:", {
        worldview: this.data.questions.worldview?.length || 0,
        scenarios: this.data.questions.scenarios?.length || 0,
        hexagrams: Object.keys(this.data.hexagrams).length,
        bible: Object.keys(this.data.bible).length, // 🔧 修正
        osManual: Object.keys(this.data.osManual).length,
      });
    } catch (error) {
      console.error("❌ DataManager.loadData() エラー:", error);
      throw new Error(`Data loading failed: ${error.message}`);
    }
  }

  // 🔧 BIBLE_DATA 取得メソッド
  getBibleData() {
    if (!this.loaded) {
      throw new Error("Data not loaded yet");
    }
    return this.data.bible || {};
  }

  // 既存のメソッドはそのまま維持
  getWorldviewQuestions() {
    if (!this.loaded) {
      throw new Error("Data not loaded yet");
    }
    return this.data.questions.worldview || [];
  }

  getScenarioQuestions() {
    if (!this.loaded) {
      throw new Error("Data not loaded yet");
    }
    return this.data.questions.scenarios || [];
  }

  getVectors() {
    if (!this.loaded) {
      throw new Error("Data not loaded yet");
    }
    return this.data.vectors || {};
  }

  getAllHexagramData() {
    if (!this.loaded) {
      throw new Error("Data not loaded yet");
    }
    return this.data.hexagrams || {};
  }

  getOSManual() {
    if (!this.loaded) {
      throw new Error("Data not loaded yet");
    }
    return this.data.osManual || {};
  }

  getTrigramsMaster() {
    if (!this.loaded) {
      throw new Error("Data not loaded yet");
    }
    return this.data.trigramsMaster || {};
  }

  getElementRelationships() {
    if (!this.loaded) {
      throw new Error("Data not loaded yet");
    }
    return this.data.elementRelationships || {};
  }

  getActionPlans() {
    if (!this.loaded) {
      throw new Error("Data not loaded yet");
    }
    return this.data.actionPlans || {};
  }

  getTuanDenData(hexagramId) {
    if (!this.loaded) {
      throw new Error("Data not loaded yet");
    }
    return this.data.tuanDen[hexagramId] || null;
  }

  getTaiShoDenData(hexagramId) {
    if (!this.loaded) {
      throw new Error("Data not loaded yet");
    }
    return this.data.taiShoDen[hexagramId] || null;
  }

  // Helper method to get specific data safely
  getGlobal(key) {
    return typeof window !== "undefined" && window[key] ? window[key] : null;
  }
}

// グローバルスコープで利用可能にする
if (typeof window !== "undefined") {
  window.DataManager = DataManager;
}
