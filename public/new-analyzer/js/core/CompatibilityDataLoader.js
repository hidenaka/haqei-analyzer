// CompatibilityDataLoader.js - 相性データ読み込み機能
// HaQei Analyzer - Compatibility Data Loading System
//
// 依存関係:
// - fetch API (ブラウザ標準)
// - Promise API (ブラウザ標準)
// - JSON API (ブラウザ標準)
//
// 使用方法:
// const loader = new CompatibilityDataLoader(options);
// グローバルスコープで定義されるため、window.CompatibilityDataLoader としてアクセス可能

class CompatibilityDataLoader {
  constructor(options = {}) {
    this.options = {
      basePath: "../../js/data/compatibility/",
      cacheEnabled: true,
      cacheTTL: 30 * 60 * 1000, // 30分
      retryAttempts: 3,
      retryDelay: 1000,
      enableCompression: false,
      enableValidation: true,
      ...options,
    };

    this.cache = new Map();
    this.loadingPromises = new Map(); // 重複リクエスト防止
    this.loadedFiles = new Set(); // 読み込み済みファイル追跡
    this.validationCache = new Map();

    console.log("✅ CompatibilityDataLoader initialized");
  }

  /**
   * エンジンOS-インターフェースOS 相性データを取得
   * @param {number} engineId - エンジンOSのID (1-64)
   * @param {number} interfaceId - インターフェースOSのID (1-64)
   * @returns {Promise<Object>} 相性データ
   */
  async getEngineInterfaceCompatibility(engineId, interfaceId) {
    try {
      const cacheKey = `engine-interface-${engineId}-${interfaceId}`;

      // キャッシュチェック
      if (this.options.cacheEnabled && this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.options.cacheTTL) {
          console.log(`📋 Cache hit: ${cacheKey}`);
          return cached.data;
        }
      }

      // データファイルを読み込み
      const fileData = await this.loadEngineInterfaceFile(engineId);

      // キャッシュに保存
      if (this.options.cacheEnabled) {
        this.cache.set(cacheKey, {
          data: fileData,
          timestamp: Date.now(),
        });
      }

      return fileData;
    } catch (error) {
      console.error(
        `❌ Engine-Interface compatibility loading error (${engineId}-${interfaceId}):`,
        error
      );
      throw new Error(`相性データの読み込みに失敗しました: ${error.message}`);
    }
  }

  /**
   * エンジンOS-セーフモードOS 相性データを取得
   * @param {number} engineId - エンジンOSのID (1-64)
   * @param {number} safeModeId - セーフモードOSのID (1-64)
   * @returns {Promise<Object>} 相性データ
   */
  async getEngineSafeModeCompatibility(engineId, safeModeId) {
    try {
      const cacheKey = `engine-safemode-${engineId}-${safeModeId}`;

      // キャッシュチェック
      if (this.options.cacheEnabled && this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.options.cacheTTL) {
          console.log(`📋 Cache hit: ${cacheKey}`);
          return cached.data;
        }
      }

      // データファイルを読み込み
      const fileData = await this.loadEngineSafeModeFile(engineId);

      // キャッシュに保存
      if (this.options.cacheEnabled) {
        this.cache.set(cacheKey, {
          data: fileData,
          timestamp: Date.now(),
        });
      }

      return fileData;
    } catch (error) {
      console.error(
        `❌ Engine-SafeMode compatibility loading error (${engineId}-${safeModeId}):`,
        error
      );
      throw new Error(`相性データの読み込みに失敗しました: ${error.message}`);
    }
  }

  /**
   * インターフェース-セーフモード 相性データを取得（推定）
   * @param {number} interfaceId - インターフェースOSのID (1-64)
   * @param {number} safeModeId - セーフモードOSのID (1-64)
   * @returns {Promise<Object>} 相性データ
   */
  async getInterfaceSafeModeCompatibility(interfaceId, safeModeId) {
    try {
      const cacheKey = `interface-safemode-${interfaceId}-${safeModeId}`;

      // キャッシュチェック
      if (this.options.cacheEnabled && this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.options.cacheTTL) {
          console.log(`📋 Cache hit: ${cacheKey}`);
          return cached.data;
        }
      }

      // インターフェース-セーフモード専用データが存在しない場合、
      // 既存のエンジン-インターフェース/エンジン-セーフモードデータから推定
      const estimation = await this.estimateInterfaceSafeModeCompatibility(
        interfaceId,
        safeModeId
      );

      // キャッシュに保存
      if (this.options.cacheEnabled) {
        this.cache.set(cacheKey, {
          data: estimation,
          timestamp: Date.now(),
        });
      }

      console.log(
        `✅ Estimated compatibility: Interface ${interfaceId} - SafeMode ${safeModeId}`
      );
      return estimation;
    } catch (error) {
      console.error(
        `❌ Failed to get interface-safemode compatibility:`,
        error
      );

      // フォールバック: 基本的な相性データを生成
      return this.generateFallbackCompatibility(
        "interface-safemode",
        interfaceId,
        safeModeId,
        error
      );
    }
  }

  /**
   * 三重OS全体の相性分析を取得
   * @param {number} engineId - エンジンOSのID (1-64)
   * @param {number} interfaceId - インターフェースOSのID (1-64)
   * @param {number} safeModeId - セーフモードOSのID (1-64)
   * @returns {Promise<Object>} 統合相性データ
   */
  async getTripleOSCompatibility(engineId, interfaceId, safeModeId) {
    try {
      const cacheKey = `triple-os-${engineId}-${interfaceId}-${safeModeId}`;

      // キャッシュチェック
      if (this.options.cacheEnabled && this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.options.cacheTTL) {
          console.log(`📋 Cache hit: ${cacheKey}`);
          return cached.data;
        }
      }

      // 並行して各相性データを取得
      const [engineInterface, engineSafeMode, interfaceSafeMode] =
        await Promise.all([
          this.getEngineInterfaceCompatibility(engineId, interfaceId),
          this.getEngineSafeModeCompatibility(engineId, safeModeId),
          this.getInterfaceSafeModeCompatibility(interfaceId, safeModeId),
        ]);

      // 統合分析を実行
      const integratedAnalysis = this.analyzeTripleOSIntegration(
        engineInterface,
        engineSafeMode,
        interfaceSafeMode
      );

      const result = {
        engineId,
        interfaceId,
        safeModeId,
        engineInterface,
        engineSafeMode,
        interfaceSafeMode,
        integration: integratedAnalysis,
        metadata: {
          dataSource: "triple-os-integration",
          loadedAt: new Date().toISOString(),
          componentsLoaded: 3,
        },
      };

      // キャッシュに保存
      if (this.options.cacheEnabled) {
        this.cache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
        });
      }

      console.log(
        `✅ Loaded triple OS compatibility: ${engineId}-${interfaceId}-${safeModeId}`
      );
      return result;
    } catch (error) {
      console.error(`❌ Failed to get triple OS compatibility:`, error);
      throw error;
    }
  }

  /**
   * エンジン-インターフェース データファイルを読み込み
   */
  async loadEngineInterfaceFile(engineId) {
    const fileName = `hexagram_${String(engineId).padStart(2, "0")}.json`;
    const filePath = `${this.options.basePath}engine-interface/${fileName}`;

    return await this.loadJSONFile(filePath, `engine-interface-${engineId}`);
  }

  /**
   * エンジン-セーフモード データファイルを読み込み
   */
  async loadEngineSafeModeFile(engineId) {
    const fileName = `hexagram_${String(engineId).padStart(2, "0")}.json`;
    const filePath = `${this.options.basePath}engine-safemode/${fileName}`;

    return await this.loadJSONFile(filePath, `engine-safemode-${engineId}`);
  }

  /**
   * JSONファイルを読み込み（リトライ機能付き）
   */
  async loadJSONFile(filePath, cacheKey) {
    // 既に読み込み中の場合は、そのPromiseを返す
    if (this.loadingPromises.has(cacheKey)) {
      return await this.loadingPromises.get(cacheKey);
    }

    const loadPromise = this.performJSONLoad(filePath, cacheKey);
    this.loadingPromises.set(cacheKey, loadPromise);

    try {
      const result = await loadPromise;
      this.loadedFiles.add(filePath);
      return result;
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  }

  /**
   * 実際のJSON読み込み処理
   */
  async performJSONLoad(filePath, cacheKey) {
    let lastError = null;

    for (let attempt = 1; attempt <= this.options.retryAttempts; attempt++) {
      try {
        console.log(`📡 Loading JSON file: ${filePath} (attempt ${attempt})`);

        const response = await fetch(filePath);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // データ検証
        if (this.options.enableValidation) {
          this.validateCompatibilityData(data, filePath);
        }

        console.log(`✅ Successfully loaded: ${filePath}`);
        return data;
      } catch (error) {
        lastError = error;
        console.warn(
          `⚠️ Failed to load ${filePath} (attempt ${attempt}):`,
          error.message
        );

        // 最後の試行でなければ待機
        if (attempt < this.options.retryAttempts) {
          await this.delay(this.options.retryDelay * attempt);
        }
      }
    }

    throw new Error(
      `Failed to load ${filePath} after ${this.options.retryAttempts} attempts: ${lastError.message}`
    );
  }

  /**
   * インターフェース-セーフモード相性を推定
   */
  async estimateInterfaceSafeModeCompatibility(interfaceId, safeModeId) {
    // 複数のエンジンOSでの相性データを収集して推定
    const sampleEngineIds = [1, 2, 11, 49]; // 代表的なエンジンOSのサンプル
    const estimations = [];

    for (const engineId of sampleEngineIds) {
      try {
        const [engineInterface, engineSafeMode] = await Promise.all([
          this.getEngineInterfaceCompatibility(engineId, interfaceId),
          this.getEngineSafeModeCompatibility(engineId, safeModeId),
        ]);

        estimations.push({
          engineId,
          engineInterface,
          engineSafeMode,
        });
      } catch (error) {
        console.warn(
          `⚠️ Failed to get estimation data for engine ${engineId}:`,
          error.message
        );
      }
    }

    if (estimations.length === 0) {
      throw new Error("No estimation data available");
    }

    // 推定アルゴリズム: 平均値ベース
    const avgScore =
      estimations.reduce((sum, est) => {
        return (
          sum +
          (est.engineInterface.overallScore + est.engineSafeMode.overallScore) /
            2
        );
      }, 0) / estimations.length;

    // 推定タイプを決定
    const estimatedType = this.determineCompatibilityType(avgScore);

    return {
      interfaceId: interfaceId,
      safeModeId: safeModeId,
      interfaceName: `インターフェースOS-${interfaceId}`,
      safeModeName: `セーフモードOS-${safeModeId}`,
      type: estimatedType,
      overallScore: avgScore,
      summary: `推定相性: ${estimatedType}タイプ (スコア: ${Math.round(
        avgScore * 100
      )}%)`,
      evaluation: this.generateEstimatedEvaluation(avgScore),
      advice: this.generateEstimatedAdvice(estimatedType, avgScore),
      metadata: {
        dataSource: "estimated",
        estimationMethod: "multi-engine-average",
        sampleSize: estimations.length,
        loadedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * 三重OS統合分析
   */
  analyzeTripleOSIntegration(
    engineInterface,
    engineSafeMode,
    interfaceSafeMode
  ) {
    const scores = [
      engineInterface.overallScore,
      engineSafeMode.overallScore,
      interfaceSafeMode.overallScore,
    ];

    const avgScore =
      scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance =
      scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) /
      scores.length;
    const stability = 1 - Math.sqrt(variance);

    return {
      overallScore: avgScore,
      stability: Math.max(0, stability),
      balance: this.calculateBalance(scores),
      dominantPattern: this.identifyDominantPattern([
        engineInterface,
        engineSafeMode,
        interfaceSafeMode,
      ]),
      integrationAdvice: this.generateIntegrationAdvice(
        engineInterface,
        engineSafeMode,
        interfaceSafeMode
      ),
      riskFactors: this.identifyRiskFactors([
        engineInterface,
        engineSafeMode,
        interfaceSafeMode,
      ]),
      strengths: this.identifyStrengths([
        engineInterface,
        engineSafeMode,
        interfaceSafeMode,
      ]),
    };
  }

  /**
   * データ検証
   */
  validateCompatibilityData(data, filePath) {
    const validationKey = filePath;

    if (this.validationCache.has(validationKey)) {
      return this.validationCache.get(validationKey);
    }

    const errors = [];

    // 基本構造チェック
    if (!data.hexagram_id || !data.internal_team_analysis) {
      errors.push("Missing required root properties");
    }

    // 相性データの構造チェック
    const combinations =
      data.internal_team_analysis.interface_combinations ||
      data.internal_team_analysis.safemode_combinations;

    if (!combinations || !Array.isArray(combinations)) {
      errors.push("Missing or invalid combinations array");
    } else {
      combinations.forEach((combo, index) => {
        if (!combo.overall_score || typeof combo.overall_score !== "number") {
          errors.push(`Invalid overall_score at combination ${index}`);
        }
        if (
          !combo.type ||
          !["SYNERGY", "HARMONY", "TENSION", "CONFLICT", "CHAOS"].includes(
            combo.type
          )
        ) {
          errors.push(`Invalid type at combination ${index}`);
        }
      });
    }

    if (errors.length > 0) {
      console.warn(`⚠️ Data validation warnings for ${filePath}:`, errors);
    }

    const isValid = errors.length === 0;
    this.validationCache.set(validationKey, isValid);

    return isValid;
  }

  /**
   * フォールバック相性データ生成
   */
  generateFallbackCompatibility(type, id1, id2, error) {
    console.warn(
      `🔄 Generating fallback compatibility for ${type}: ${id1}-${id2}`
    );

    // 基本的な相性スコアを生成（IDベース）
    const baseScore = ((id1 + id2) % 100) / 100;
    const adjustedScore = Math.max(0.1, Math.min(0.9, baseScore));

    return {
      [`${type.split("-")[0]}Id`]: id1,
      [`${type.split("-")[1]}Id`]: id2,
      type: this.determineCompatibilityType(adjustedScore),
      overallScore: adjustedScore,
      summary: `基本相性分析 (フォールバック): スコア ${Math.round(
        adjustedScore * 100
      )}%`,
      evaluation: this.generateEstimatedEvaluation(adjustedScore),
      advice: this.generateEstimatedAdvice(
        this.determineCompatibilityType(adjustedScore),
        adjustedScore
      ),
      metadata: {
        dataSource: "fallback",
        reason: error.message,
        generatedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * ヘルパーメソッド
   */

  determineCompatibilityType(score) {
    if (score >= 0.9) return "SYNERGY";
    if (score >= 0.7) return "HARMONY";
    if (score >= 0.4) return "TENSION";
    if (score >= 0.2) return "CONFLICT";
    return "CHAOS";
  }

  generateEstimatedEvaluation(score) {
    return {
      functional_efficiency: { score: score * 0.9, description: "推定効率性" },
      growth_potential: { score: score * 1.1, description: "推定成長可能性" },
      stress_resilience: { score: score, description: "推定ストレス耐性" },
      creativity: { score: score * 0.8, description: "推定創造性" },
      integration_challenge: { score: score, description: "推定統合難易度" },
    };
  }

  generateEstimatedAdvice(type, score) {
    const adviceMap = {
      SYNERGY: {
        strengths: ["高い協調性"],
        challenges: ["過度の安定"],
        recommendations: ["新しい挑戦を取り入れる"],
      },
      HARMONY: {
        strengths: ["バランス"],
        challenges: ["変化への対応"],
        recommendations: ["柔軟性を保つ"],
      },
      TENSION: {
        strengths: ["創造的緊張"],
        challenges: ["葛藤管理"],
        recommendations: ["対話を重視する"],
      },
      CONFLICT: {
        strengths: ["多様性"],
        challenges: ["対立解決"],
        recommendations: ["共通目標を設定する"],
      },
      CHAOS: {
        strengths: ["変革力"],
        challenges: ["安定性"],
        recommendations: ["構造化を図る"],
      },
    };

    return adviceMap[type] || adviceMap["TENSION"];
  }

  calculateBalance(scores) {
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    return 1 - (max - min);
  }

  identifyDominantPattern(compatibilities) {
    const types = compatibilities.map((c) => c.type);
    const typeCounts = {};
    types.forEach((type) => (typeCounts[type] = (typeCounts[type] || 0) + 1));

    return Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0][0];
  }

  generateIntegrationAdvice(
    engineInterface,
    engineSafeMode,
    interfaceSafeMode
  ) {
    return [
      `エンジン-インターフェース: ${engineInterface.type}パターンを活用`,
      `エンジン-セーフモード: ${engineSafeMode.type}パターンに注意`,
      `インターフェース-セーフモード: ${interfaceSafeMode.type}バランスを保つ`,
    ];
  }

  identifyRiskFactors(compatibilities) {
    return compatibilities
      .filter((c) => c.overallScore < 0.4)
      .map((c) => `${c.metadata.dataSource}: 低相性リスク`);
  }

  identifyStrengths(compatibilities) {
    return compatibilities
      .filter((c) => c.overallScore > 0.7)
      .map((c) => `${c.metadata.dataSource}: 高相性ポテンシャル`);
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * キャッシュクリア
   */
  clearCache() {
    this.cache.clear();
    this.validationCache.clear();
    console.log("🗑️ Compatibility data cache cleared");
  }

  /**
   * 統計情報取得
   */
  getStats() {
    return {
      cacheSize: this.cache.size,
      loadedFiles: this.loadedFiles.size,
      validationCacheSize: this.validationCache.size,
      loadingInProgress: this.loadingPromises.size,
    };
  }
}

// CompatibilityDataLoader クラスはグローバルスコープで利用可能
// 使用例: const loader = new CompatibilityDataLoader();
