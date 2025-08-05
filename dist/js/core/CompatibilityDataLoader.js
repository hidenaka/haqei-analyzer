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
      
      // 八次元キーワードの存在をデバッグ
      const dimensionKeywords = ["乾_創造性", "兌_調和性", "離_表現性", "震_行動性", "巽_適応性", "坎_探求性", "艮_安定性", "坤_受容性"];
      console.log("🔍 [CompatibilityDataLoader] 八次元キーワード検証:");
      dimensionKeywords.forEach(keyword => {
        const inKeywordMap = this.keywordMap[keyword] ? this.keywordMap[keyword].length : 0;
        const inLineKeywordMap = this.lineKeywordMap[keyword] ? this.lineKeywordMap[keyword].length : 0;
        console.log(`  ${keyword}: keywordMap(${inKeywordMap}件), lineKeywordMap(${inLineKeywordMap}件)`);
      });
      
      // サンプルキーワードマップを表示
      const sampleKeys = Object.keys(this.keywordMap).slice(0, 10);
      console.log("🔍 [CompatibilityDataLoader] keyword_map サンプル:", sampleKeys);
      const sampleLineKeys = Object.keys(this.lineKeywordMap).slice(0, 10);
      console.log("🔍 [CompatibilityDataLoader] line_keyword_map サンプル:", sampleLineKeys);

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

    // まず、八卦の組み合わせから直接的なマッピングを作成
    this._addTrigramBasedMapping(hexagramId);

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
    // SafeMode データ構造: internal_team_analysis.safemode_combinations
    if (
      !data.internal_team_analysis ||
      !data.internal_team_analysis.safemode_combinations
    ) {
      return;
    }

    // 八卦の組み合わせから直接的なマッピングを作成
    this._addTrigramBasedMapping(hexagramId);

    // safemode_combinationsから特徴的なキーワードを抽出
    data.internal_team_analysis.safemode_combinations.forEach(
      (combination) => {
        // trigger_warning, meltdown_symptoms, recovery_strategies からキーワードを抽出
        if (combination.advice) {
          if (combination.advice.trigger_warning) {
            const keywords = this._extractKeywords(combination.advice.trigger_warning);
            keywords.forEach((keyword) => {
              this._addToLineKeywordMap(keyword, hexagramId, 0);
            });
          }

          if (combination.advice.meltdown_symptoms) {
            const keywords = this._extractKeywords(combination.advice.meltdown_symptoms);
            keywords.forEach((keyword) => {
              this._addToLineKeywordMap(keyword, hexagramId, 0);
            });
          }

          if (combination.advice.recovery_strategies) {
            const keywords = this._extractKeywords(combination.advice.recovery_strategies);
            keywords.forEach((keyword) => {
              this._addToLineKeywordMap(keyword, hexagramId, 0);
            });
          }
        }

        // 評価項目からもキーワードを抽出
        if (combination.evaluation) {
          Object.values(combination.evaluation).forEach((evaluation) => {
            if (evaluation.description) {
              const keywords = this._extractKeywords(evaluation.description);
              keywords.forEach((keyword) => {
                this._addToLineKeywordMap(keyword, hexagramId, 0);
              });
            }
          });
        }

        // summary からもキーワードを抽出
        if (combination.summary) {
          const keywords = this._extractKeywords(combination.summary);
          keywords.forEach((keyword) => {
            this._addToLineKeywordMap(keyword, hexagramId, 0);
          });
        }
      }
    );
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
   * TripleOSEngineとの互換性のため、hexagram_idの配列形式も追加
   */
  _addToLineKeywordMap(keyword, hexagramId, lineNumber) {
    if (!keyword || typeof keyword !== "string") return;

    const cleanKeyword = keyword.trim();
    if (cleanKeyword.length === 0) return;

    if (!this.lineKeywordMap[cleanKeyword]) {
      this.lineKeywordMap[cleanKeyword] = [];
    }

    // TripleOSEngineが期待する形式：hexagram_idの配列
    // 既存のhexagram_idが含まれていない場合のみ追加
    if (!this.lineKeywordMap[cleanKeyword].includes(hexagramId)) {
      this.lineKeywordMap[cleanKeyword].push(hexagramId);
    }
  }

  /**
   * テキストから重要なキーワードを抽出（改良版）
   */
  _extractKeywords(text) {
    if (!text || typeof text !== "string") return [];

    // 日本語の重要なキーワードを抽出する包括的な方法
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
      "創造",
      "クリエイティブ",
      "調和性",
      "調和",
      "バランス",
      "協調",
      "表現性",
      "表現",
      "コミュニケーション",
      "発信",
      "行動性",
      "行動",
      "実行",
      "アクション",
      "適応性",
      "適応",
      "柔軟",
      "変化対応",
      "探求性",
      "探求",
      "研究",
      "分析",
      "深掘り",
      "安定性",
      "安定",
      "継続",
      "持続",
      "受容性",
      "受容",
      "包容",
      "理解",
      "共感",
    ];
    dimensionKeywords.forEach((dimension) => {
      if (text.includes(dimension)) {
        keywords.push(dimension);
      }
    });

    // 感情・行動関連のキーワード（拡張版）
    const behaviorKeywords = [
      // リーダーシップ系
      "リーダーシップ",
      "指導",
      "統率",
      "主導",
      "率先",
      // 協調・チームワーク系
      "協調",
      "チームワーク",
      "連携",
      "協力",
      "サポート",
      // 創造・革新系
      "創造",
      "革新",
      "イノベーション",
      "発想",
      "アイデア",
      // 安定・継続系
      "安定",
      "継続",
      "持続",
      "維持",
      "保持",
      // 変化・適応系
      "変化",
      "適応",
      "柔軟",
      "対応",
      "調整",
      // 探求・分析系
      "探求",
      "分析",
      "研究",
      "調査",
      "検討",
      // 表現・コミュニケーション系
      "表現",
      "伝達",
      "発信",
      "共有",
      "説明",
      // 行動・実行系
      "行動",
      "実行",
      "実践",
      "遂行",
      "推進",
      // 受容・理解系
      "受容",
      "理解",
      "共感",
      "包容",
      "寛容",
      // 性格特性系
      "積極的",
      "消極的",
      "内向的",
      "外向的",
      "慎重",
      "大胆",
      "論理的",
      "感情的",
      "直感的",
      "現実的",
      "理想的",
      // 対人関係系
      "社交的",
      "内省的",
      "協力的",
      "競争的",
      "支援的",
      "独立的",
      "依存的",
      "開放的",
      "閉鎖的",
      // 仕事・業務系
      "効率的",
      "丁寧",
      "迅速",
      "正確",
      "革新的",
      "保守的",
      "挑戦的",
      "安全志向",
      "リスク志向",
    ];
    behaviorKeywords.forEach((behavior) => {
      if (text.includes(behavior)) {
        keywords.push(behavior);
      }
    });

    // 形容詞・状態系キーワード
    const adjectiveKeywords = [
      "強い",
      "弱い",
      "高い",
      "低い",
      "深い",
      "浅い",
      "速い",
      "遅い",
      "大きい",
      "小さい",
      "広い",
      "狭い",
      "明るい",
      "暗い",
      "軽い",
      "重い",
      "新しい",
      "古い",
      "優しい",
      "厳しい",
      "温かい",
      "冷たい",
      "静か",
      "活発",
    ];
    adjectiveKeywords.forEach((adj) => {
      if (text.includes(adj)) {
        keywords.push(adj);
      }
    });

    // 動詞系キーワード
    const verbKeywords = [
      "考える",
      "感じる",
      "行う",
      "作る",
      "変える",
      "守る",
      "進める",
      "止める",
      "始める",
      "終える",
      "続ける",
      "やめる",
      "話す",
      "聞く",
      "見る",
      "読む",
      "書く",
      "学ぶ",
      "教える",
      "助ける",
      "支える",
      "導く",
      "従う",
      "反対",
    ];
    verbKeywords.forEach((verb) => {
      if (text.includes(verb)) {
        keywords.push(verb);
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
      console.log(
        `🔄 [CompatibilityDataLoader] Interface data from cache: ${engineOsId}`
      );
      return this.interfaceDataCache[engineOsId];
    }

    try {
      const paddedId = engineOsId.toString().padStart(2, "0");
      const url = `../js/data/compatibility/engine-interface/hexagram_${paddedId}.json`;

      console.log(
        `🔄 [CompatibilityDataLoader] Loading interface data: ${url}`
      );

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `HTTPエラー！ ステータス: ${response.status} ${response.statusText} URL: ${url}`
        );
      }

      const data = await response.json();

      // データ検証
      if (!data || typeof data !== "object") {
        throw new Error(`Invalid data format from ${url}`);
      }

      // キャッシュに保存
      this.interfaceDataCache[engineOsId] = data;

      console.log(
        `✅ [CompatibilityDataLoader] Interface data loaded successfully: hexagram_${paddedId}`
      );
      return data;
    } catch (error) {
      console.error(
        `❌ [CompatibilityDataLoader] 致命的な読み込み失敗: ID ${engineOsId} のインターフェースデータが取得できませんでした。`,
        error
      );
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
      console.log(
        `🔄 [CompatibilityDataLoader] Safemode data from cache: ${engineOsId}`
      );
      return this.safemodeDataCache[engineOsId];
    }

    try {
      const paddedId = engineOsId.toString().padStart(2, "0");
      const url = `../js/data/compatibility/engine-safemode/hexagram_${paddedId}.json`;

      console.log(`🔄 [CompatibilityDataLoader] Loading safemode data: ${url}`);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `HTTPエラー！ ステータス: ${response.status} ${response.statusText} URL: ${url}`
        );
      }

      const data = await response.json();

      // データ検証
      if (!data || typeof data !== "object") {
        throw new Error(`Invalid data format from ${url}`);
      }

      // キャッシュに保存
      this.safemodeDataCache[engineOsId] = data;

      console.log(
        `✅ [CompatibilityDataLoader] Safemode data loaded successfully: hexagram_${paddedId}`
      );
      return data;
    } catch (error) {
      console.error(
        `❌ [CompatibilityDataLoader] 致命的な読み込み失敗: ID ${engineOsId} のセーフモードデータが取得できませんでした。`,
        error
      );
      throw error;
    }
  }

  /**
   * 八卦構成から八次元キーワードへの直接マッピングを追加
   */
  _addTrigramBasedMapping(hexagramId) {
    // 64卦の八卦構成データを取得
    const hexagramInfo = this._getHexagramInfo(hexagramId);
    if (!hexagramInfo) return;

    // 八卦ID to 八次元キーワードのマッピング
    const trigramToDimension = {
      1: "乾_創造性",  // 乾
      2: "兌_調和性",  // 兌
      3: "離_表現性",  // 離
      4: "震_行動性",  // 震
      5: "巽_適応性",  // 巽
      6: "坎_探求性",  // 坎
      7: "艮_安定性",  // 艮
      8: "坤_受容性",  // 坤
    };

    // 上卦と下卦の八次元キーワードを追加
    if (hexagramInfo.upper_trigram_id) {
      const upperDimension = trigramToDimension[hexagramInfo.upper_trigram_id];
      if (upperDimension) {
        this._addToKeywordMap(upperDimension, hexagramId);
        this._addToLineKeywordMap(upperDimension, hexagramId, 0);
      }
    }

    if (hexagramInfo.lower_trigram_id) {
      const lowerDimension = trigramToDimension[hexagramInfo.lower_trigram_id];
      if (lowerDimension) {
        this._addToKeywordMap(lowerDimension, hexagramId);
        this._addToLineKeywordMap(lowerDimension, hexagramId, 0);
      }
    }
  }

  /**
   * 六十四卦情報を取得するヘルパーメソッド
   */
  _getHexagramInfo(hexagramId) {
    // 簡易的な64卦の八卦構成マッピング（実際のデータソースから取得するのが理想）
    // 64卦 = (上卦-1) * 8 + 下卦 の関係から逆算
    const upperTrigramId = Math.floor((hexagramId - 1) / 8) + 1;
    const lowerTrigramId = ((hexagramId - 1) % 8) + 1;

    return {
      hexagram_id: hexagramId,
      upper_trigram_id: upperTrigramId,
      lower_trigram_id: lowerTrigramId,
    };
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

  /**
   * エンジン-インターフェース相性データを読み込む（エイリアス）
   * TripleOSResultsViewとの互換性のため
   * @param {number} engineOsId - エンジンOSの卦ID (1-64)
   * @returns {Promise<Object>} インターフェース相性データ
   */
  async loadEngineInterfaceCompatibility(engineOsId) {
    console.log(`🔄 [CompatibilityDataLoader] loadEngineInterfaceCompatibility called for engineOsId: ${engineOsId}`);
    return await this.loadInterfaceData(engineOsId);
  }

  /**
   * エンジン-セーフモード相性データを読み込む（エイリアス）
   * TripleOSResultsViewとの互換性のため
   * @param {number} engineOsId - エンジンOSの卦ID (1-64) 
   * @returns {Promise<Object>} セーフモード相性データ
   */
  async loadEngineSafemodeCompatibility(engineOsId) {
    console.log(`🔄 [CompatibilityDataLoader] loadEngineSafemodeCompatibility called for engineOsId: ${engineOsId}`);
    return await this.loadSafemodeData(engineOsId);
  }
}

// グローバルに公開
window.CompatibilityDataLoader = CompatibilityDataLoader;
