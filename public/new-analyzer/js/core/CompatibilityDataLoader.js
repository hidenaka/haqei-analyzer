/**
 * CompatibilityDataLoader - 互換性データの動的読み込みとマップ生成
 * インターフェースOSとセーフモードOSの分析に必要なkeyword_mapとline_keyword_mapを生成
 */
class CompatibilityDataLoader {
  constructor() {
    this.keywordMap = {};
    this.lineKeywordMap = {};
    this.isLoaded = false;
    this.loadingPromise = null;
    // 個別ファイルのキャッシュ
    this.interfaceDataCache = {};
    this.safemodeDataCache = {};
  }

  /**
   * 互換性データを読み込み、keyword_mapとline_keyword_mapを生成
   */
  async loadCompatibilityData() {
    if (this.isLoaded) {
      return {
        keyword_map: this.keywordMap,
        line_keyword_map: this.lineKeywordMap,
      };
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = this._performLoad();
    return this.loadingPromise;
  }

  async _performLoad() {
    console.log("🔄 [CompatibilityDataLoader] 互換性データの読み込み開始");

    try {
      // 1. engine-interfaceデータの読み込み
      await this._loadEngineInterfaceData();

      // 2. engine-safemodeデータの読み込み
      await this._loadEngineSafemodeData();

      this.isLoaded = true;

      console.log("✅ [CompatibilityDataLoader] 互換性データの読み込み完了");
      console.log(`📊 keyword_map: ${Object.keys(this.keywordMap).length}件`);
      console.log(
        `📊 line_keyword_map: ${Object.keys(this.lineKeywordMap).length}件`
      );

      return {
        keyword_map: this.keywordMap,
        line_keyword_map: this.lineKeywordMap,
      };
    } catch (error) {
      console.error(
        "❌ [CompatibilityDataLoader] データ読み込みエラー:",
        error
      );
      throw error;
    }
  }

  /**
   * engine-interfaceデータを読み込んでkeyword_mapを生成
   */
  async _loadEngineInterfaceData() {
    console.log(
      "🔄 [CompatibilityDataLoader] engine-interfaceデータ読み込み中"
    );

    for (let hexagramId = 1; hexagramId <= 64; hexagramId++) {
      try {
        const response = await fetch(
          `js/data/compatibility/engine-interface/hexagram_${hexagramId
            .toString()
            .padStart(2, "0")}.json`
        );

        if (!response.ok) {
          console.warn(
            `⚠️ [CompatibilityDataLoader] hexagram_${hexagramId} interface data not found`
          );
          continue;
        }

        const data = await response.json();
        this._processInterfaceData(data, hexagramId);
      } catch (error) {
        console.warn(
          `⚠️ [CompatibilityDataLoader] Error loading interface data for hexagram ${hexagramId}:`,
          error
        );
      }
    }
  }

  /**
   * engine-safemodeデータを読み込んでline_keyword_mapを生成
   */
  async _loadEngineSafemodeData() {
    console.log("🔄 [CompatibilityDataLoader] engine-safemodeデータ読み込み中");

    for (let hexagramId = 1; hexagramId <= 64; hexagramId++) {
      try {
        const response = await fetch(
          `js/data/compatibility/engine-safemode/hexagram_${hexagramId
            .toString()
            .padStart(2, "0")}.json`
        );

        if (!response.ok) {
          console.warn(
            `⚠️ [CompatibilityDataLoader] hexagram_${hexagramId} safemode data not found`
          );
          continue;
        }

        const data = await response.json();
        this._processSafemodeData(data, hexagramId);
      } catch (error) {
        console.warn(
          `⚠️ [CompatibilityDataLoader] Error loading safemode data for hexagram ${hexagramId}:`,
          error
        );
      }
    }
  }

  /**
   * インターフェースデータを処理してkeyword_mapに追加
   */
  _processInterfaceData(data, hexagramId) {
    if (
      !data.internal_team_analysis ||
      !data.internal_team_analysis.interface_combinations
    ) {
      return;
    }

    // interface_combinationsから特徴的なキーワードを抽出
    data.internal_team_analysis.interface_combinations.forEach(
      (combination) => {
        if (combination.advice && combination.advice.strengths) {
          combination.advice.strengths.forEach((strength) => {
            this._addToKeywordMap(strength, hexagramId);
          });
        }

        if (combination.advice && combination.advice.challenges) {
          combination.advice.challenges.forEach((challenge) => {
            this._addToKeywordMap(challenge, hexagramId);
          });
        }

        // 評価項目からもキーワードを抽出
        if (combination.evaluation) {
          Object.values(combination.evaluation).forEach((evaluation) => {
            if (evaluation.description) {
              // 重要なキーワードを抽出（簡易版）
              const keywords = this._extractKeywords(evaluation.description);
              keywords.forEach((keyword) => {
                this._addToKeywordMap(keyword, hexagramId);
              });
            }
          });
        }
      }
    );
  }

  /**
   * セーフモードデータを処理してline_keyword_mapに追加
   */
  _processSafemodeData(data, hexagramId) {
    if (!data.line_analysis || !Array.isArray(data.line_analysis)) {
      return;
    }

    // line_analysisから爻別のキーワードを抽出
    data.line_analysis.forEach((line, lineIndex) => {
      if (line.keywords && Array.isArray(line.keywords)) {
        line.keywords.forEach((keyword) => {
          this._addToLineKeywordMap(keyword, hexagramId, lineIndex + 1);
        });
      }

      if (line.description) {
        const keywords = this._extractKeywords(line.description);
        keywords.forEach((keyword) => {
          this._addToLineKeywordMap(keyword, hexagramId, lineIndex + 1);
        });
      }
    });
  }

  /**
   * keyword_mapにキーワードを追加
   */
  _addToKeywordMap(keyword, hexagramId) {
    if (!keyword || typeof keyword !== "string") return;

    const cleanKeyword = keyword.trim();
    if (cleanKeyword.length === 0) return;

    if (!this.keywordMap[cleanKeyword]) {
      this.keywordMap[cleanKeyword] = [];
    }

    if (!this.keywordMap[cleanKeyword].includes(hexagramId)) {
      this.keywordMap[cleanKeyword].push(hexagramId);
    }
  }

  /**
   * line_keyword_mapにキーワードを追加
   */
  _addToLineKeywordMap(keyword, hexagramId, lineNumber) {
    if (!keyword || typeof keyword !== "string") return;

    const cleanKeyword = keyword.trim();
    if (cleanKeyword.length === 0) return;

    if (!this.lineKeywordMap[cleanKeyword]) {
      this.lineKeywordMap[cleanKeyword] = [];
    }

    const lineInfo = {
      hexagram_id: hexagramId,
      line_number: lineNumber,
    };

    // 重複チェック
    const exists = this.lineKeywordMap[cleanKeyword].some(
      (item) =>
        item.hexagram_id === hexagramId && item.line_number === lineNumber
    );

    if (!exists) {
      this.lineKeywordMap[cleanKeyword].push(lineInfo);
    }
  }

  /**
   * テキストから重要なキーワードを抽出（簡易版）
   */
  _extractKeywords(text) {
    if (!text || typeof text !== "string") return [];

    // 日本語の重要なキーワードを抽出する簡易的な方法
    const keywords = [];

    // 八卦関連のキーワード
    const trigramKeywords = ["乾", "兌", "離", "震", "巽", "坎", "艮", "坤"];
    trigramKeywords.forEach((trigram) => {
      if (text.includes(trigram)) {
        keywords.push(trigram);
      }
    });

    // 8次元関連のキーワード
    const dimensionKeywords = [
      "創造性",
      "調和性",
      "表現性",
      "行動性",
      "適応性",
      "探求性",
      "安定性",
      "受容性",
    ];
    dimensionKeywords.forEach((dimension) => {
      if (text.includes(dimension)) {
        keywords.push(dimension);
      }
    });

    // 感情・行動関連のキーワード
    const behaviorKeywords = [
      "リーダーシップ",
      "協調",
      "創造",
      "安定",
      "変化",
      "探求",
      "表現",
      "行動",
      "受容",
      "調和",
      "適応",
      "革新",
    ];
    behaviorKeywords.forEach((behavior) => {
      if (text.includes(behavior)) {
        keywords.push(behavior);
      }
    });

    return [...new Set(keywords)]; // 重複除去
  }

  /**
   * 指定されたengineOsIdに対応するインターフェース相性データを読み込む
   * @param {number} engineOsId - エンジンOSの卦ID (1-64)
   * @returns {Promise<Object>} インターフェース相性データ
   */
  async loadInterfaceData(engineOsId) {
    if (!engineOsId || engineOsId < 1 || engineOsId > 64) {
      throw new Error(`Invalid engineOsId: ${engineOsId}`);
    }

    // キャッシュから返す
    if (this.interfaceDataCache[engineOsId]) {
      console.log(`🔄 [CompatibilityDataLoader] Interface data from cache: ${engineOsId}`);
      return this.interfaceDataCache[engineOsId];
    }

    try {
      const paddedId = engineOsId.toString().padStart(2, "0");
      const url = `../js/data/compatibility/engine-interface/hexagram_${paddedId}.json`;
      
      console.log(`🔄 [CompatibilityDataLoader] Loading interface data: ${url}`);
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTPエラー！ ステータス: ${response.status} ${response.statusText} URL: ${url}`);
      }

      const data = await response.json();
      
      // データ検証
      if (!data || typeof data !== 'object') {
        throw new Error(`Invalid data format from ${url}`);
      }
      
      // キャッシュに保存
      this.interfaceDataCache[engineOsId] = data;
      
      console.log(`✅ [CompatibilityDataLoader] Interface data loaded successfully: hexagram_${paddedId}`);
      return data;

    } catch (error) {
      console.error(`❌ [CompatibilityDataLoader] 致命的な読み込み失敗: ID ${engineOsId} のインターフェースデータが取得できませんでした。`, error);
      throw error;
    }
  }

  /**
   * 指定されたengineOsIdに対応するセーフモード相性データを読み込む
   * @param {number} engineOsId - エンジンOSの卦ID (1-64)
   * @returns {Promise<Object>} セーフモード相性データ
   */
  async loadSafemodeData(engineOsId) {
    if (!engineOsId || engineOsId < 1 || engineOsId > 64) {
      throw new Error(`Invalid engineOsId: ${engineOsId}`);
    }

    // キャッシュから返す
    if (this.safemodeDataCache[engineOsId]) {
      console.log(`🔄 [CompatibilityDataLoader] Safemode data from cache: ${engineOsId}`);
      return this.safemodeDataCache[engineOsId];
    }

    try {
      const paddedId = engineOsId.toString().padStart(2, "0");
      const url = `../js/data/compatibility/engine-safemode/hexagram_${paddedId}.json`;
      
      console.log(`🔄 [CompatibilityDataLoader] Loading safemode data: ${url}`);
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTPエラー！ ステータス: ${response.status} ${response.statusText} URL: ${url}`);
      }

      const data = await response.json();
      
      // データ検証
      if (!data || typeof data !== 'object') {
        throw new Error(`Invalid data format from ${url}`);
      }
      
      // キャッシュに保存
      this.safemodeDataCache[engineOsId] = data;
      
      console.log(`✅ [CompatibilityDataLoader] Safemode data loaded successfully: hexagram_${paddedId}`);
      return data;

    } catch (error) {
      console.error(`❌ [CompatibilityDataLoader] 致命的な読み込み失敗: ID ${engineOsId} のセーフモードデータが取得できませんでした。`, error);
      throw error;
    }
  }

  /**
   * キャッシュをクリアする
   */
  clearCache() {
    this.interfaceDataCache = {};
    this.safemodeDataCache = {};
    console.log("🗑️ [CompatibilityDataLoader] Cache cleared");
  }

  /**
   * 生成されたマップを取得
   */
  getKeywordMap() {
    return this.keywordMap;
  }

  getLineKeywordMap() {
    return this.lineKeywordMap;
  }

  /**
   * データが読み込み済みかチェック
   */
  isDataLoaded() {
    return this.isLoaded;
  }

  /**
   * 統計情報を取得
   */
  getStats() {
    return {
      keywordMapSize: Object.keys(this.keywordMap).length,
      lineKeywordMapSize: Object.keys(this.lineKeywordMap).length,
      isLoaded: this.isLoaded,
      totalKeywords:
        Object.keys(this.keywordMap).length +
        Object.keys(this.lineKeywordMap).length,
    };
  }
}

// グローバルに公開
window.CompatibilityDataLoader = CompatibilityDataLoader;
