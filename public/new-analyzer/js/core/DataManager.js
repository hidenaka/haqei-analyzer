// DataManager.js - データ管理・取得用クラス（雛形）
// HaQei Analyzer - Data Manager
class DataManager {
  constructor() {
    this.isLoaded = false;
    this.data = {
      questions: null,
      scenarios: null,
      vectors: null,
      hexagrams: null,
    };
  }

  async loadData() {
    try {
      console.log("📊 Loading data...");

      // データの存在確認
      if (typeof WORLDVIEW_QUESTIONS === "undefined") {
        throw new Error("WORLDVIEW_QUESTIONS not found");
      }

      if (typeof SCENARIO_QUESTIONS === "undefined") {
        throw new Error("SCENARIO_QUESTIONS not found");
      }

      if (typeof H64_8D_VECTORS === "undefined") {
        throw new Error("H64_8D_VECTORS not found");
      }

      // データを内部に保存
      this.data.questions = WORLDVIEW_QUESTIONS;
      this.data.scenarios = SCENARIO_QUESTIONS;
      this.data.vectors = H64_8D_VECTORS;

      // 基本的な64卦データを生成（後で既存データから移行予定）
      this.data.hexagrams = this.generateBasicHexagramData();

      this.isLoaded = true;
      console.log("✅ Data loaded successfully");

      return true;
    } catch (error) {
      console.error("❌ Data loading failed:", error);
      throw error;
    }
  }

  // 価値観設問を取得
  getWorldviewQuestions() {
    this.checkDataLoaded();
    return this.data.questions;
  }

  // シナリオ設問を取得
  getScenarioQuestions() {
    this.checkDataLoaded();
    return this.data.scenarios;
  }

  // 全設問を取得
  getAllQuestions() {
    this.checkDataLoaded();
    return {
      worldview: this.data.questions,
      scenarios: this.data.scenarios,
      total: this.data.questions.length + this.data.scenarios.length,
    };
  }

  // 8次元ベクトルデータを取得
  getVectorsData() {
    this.checkDataLoaded();
    return this.data.vectors;
  }

  // 64卦データを取得
  getHexagramData(osId) {
    this.checkDataLoaded();
    const hexData = this.data.hexagrams[osId];
    if (!hexData) return null;

    // 既存形式に合わせて name_jp プロパティも追加
    return {
      ...hexData,
      name_jp: hexData.name, // 既存コードとの互換性のため
    };
  }

  // 全64卦データを取得
  getAllHexagramData() {
    this.checkDataLoaded();
    return this.data.hexagrams;
  }

  // データ読み込み確認
  checkDataLoaded() {
    if (!this.isLoaded) {
      throw new Error("Data not loaded. Call loadData() first.");
    }
  }

  // 基本的な64卦データを生成（仮データ）
  generateBasicHexagramData() {
    // 既存のhexagrams_masterがあれば変換して使用
    if (typeof hexagrams_master !== "undefined") {
      console.log("✅ Using existing hexagrams_master data");

      const hexagramData = {};
      hexagrams_master.forEach((hex) => {
        hexagramData[hex.hexagram_id] = {
          id: hex.hexagram_id,
          name: hex.name_jp,
          reading: hex.reading,
          catchphrase: hex.catchphrase,
          description: hex.description,
          keywords: hex.keywords,
          upper_trigram_id: hex.upper_trigram_id,
          lower_trigram_id: hex.lower_trigram_id,
        };
      });

      return hexagramData;
    }

    console.log("⚠️  hexagrams_master not found, generating minimal data");
    return {
      1: {
        id: 1,
        name: "乾為天",
        catchphrase: "天性のリーダー",
        description: "創造性に優れる",
      },
    };
  }

  // データ統計情報
  getDataStats() {
    if (!this.isLoaded) return null;

    return {
      worldviewQuestions: this.data.questions ? this.data.questions.length : 0,
      scenarioQuestions: this.data.scenarios ? this.data.scenarios.length : 0,
      totalQuestions:
        (this.data.questions?.length || 0) + (this.data.scenarios?.length || 0),
      vectorData: this.data.vectors ? Object.keys(this.data.vectors).length : 0,
      hexagramData: this.data.hexagrams
        ? Object.keys(this.data.hexagrams).length
        : 0,
    };
  }
}

// グローバルスコープで利用可能にする
if (typeof window !== "undefined") {
  window.DataManager = DataManager;
}
