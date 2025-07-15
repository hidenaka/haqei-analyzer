// TripleOSEngine.js - 3層人格OS診断エンジン
// HaQei Analyzer - Triple OS Diagnosis Engine

class TripleOSEngine extends DiagnosisEngine {
  constructor(dataManager) {
    super(dataManager);
    this.trigramMapping = this.initializeTrigramMapping();
    this.initializeKeywordMaps();
  }

  // 8次元→八卦マッピング初期化
  initializeTrigramMapping() {
    return {
      乾_創造性: { trigram: "乾", id: 1, name: "乾（天）" },
      兌_調和性: { trigram: "兌", id: 2, name: "兌（沢）" },
      離_表現性: { trigram: "離", id: 3, name: "離（火）" },
      震_行動性: { trigram: "震", id: 4, name: "震（雷）" },
      巽_適応性: { trigram: "巽", id: 5, name: "巽（風）" },
      坎_探求性: { trigram: "坎", id: 6, name: "坎（水）" },
      艮_安定性: { trigram: "艮", id: 7, name: "艮（山）" },
      坤_受容性: { trigram: "坤", id: 8, name: "坤（地）" },
    };
  }

  // キーワードマップ初期化
  initializeKeywordMaps() {
    // DataManagerから取得する予定
    this.keywordMap = null;
    this.lineKeywordMap = null;
  }

  // メイン3層OS分析
  async analyzeTripleOS(allAnswers) {
    try {
      console.log("🔬 Starting Triple OS Analysis...");

      // 回答を分離
      const { worldviewAnswers, scenarioAnswers } =
        this.separateAnswers(allAnswers);

      console.log("📊 Worldview answers:", worldviewAnswers.length);
      console.log("📊 Scenario answers:", scenarioAnswers.length);

      // 1. エンジンOS分析（価値観設問から）
      const engineOS = await this.analyzeEngineOS(worldviewAnswers);
      console.log("🔧 Engine OS:", engineOS);

      // 2. インターフェースOS分析（シナリオ設問の外面選択肢から）
      const interfaceOS = await this.analyzeInterfaceOS(
        scenarioAnswers,
        engineOS
      );
      console.log("🖥️ Interface OS:", interfaceOS);

      // 3. セーフモードOS分析（シナリオ設問の内面選択肢から）
      const safeModeOS = await this.analyzeSafeModeOS(
        scenarioAnswers,
        engineOS
      );
      console.log("🛡️ SafeMode OS:", safeModeOS);

      // 4. 人格一貫性スコア算出
      const consistencyScore = this.calculateConsistencyScore(
        engineOS,
        interfaceOS,
        safeModeOS
      );
      console.log("📈 Consistency Score:", consistencyScore);

      // 5. 統合分析結果構築
      const tripleOSResult = {
        analysisType: "tripleOS",
        engineOS: engineOS,
        interfaceOS: interfaceOS,
        safeModeOS: safeModeOS,
        consistencyScore: consistencyScore,
        analysisDate: new Date().toISOString(),
        totalAnswers: allAnswers.length,
        integration: this.generateIntegrationInsights(
          engineOS,
          interfaceOS,
          safeModeOS,
          consistencyScore
        ),
      };

      console.log("✅ Triple OS Analysis completed:", tripleOSResult);
      return tripleOSResult;
    } catch (error) {
      console.error("❌ Triple OS Analysis failed:", error);
      throw error;
    }
  }

  // エンジンOS分析（価値観設問→8次元→64卦ベクトル類似度方式）
  async analyzeEngineOS(worldviewAnswers) {
    try {
      console.log("🔥 Analyzing Engine OS from worldview questions...");
      // 8次元ユーザーベクトル構築
      const userVector = this.calculator.buildUserVector(worldviewAnswers);
      console.log("📊 User vector:", userVector);
      // OS候補分析
      const vectorsData = this.dataManager.getVectorsData();
      const candidates = this.calculator.analyzeOSCandidates(
        userVector,
        vectorsData
      );
      if (!candidates || candidates.length === 0) {
        throw new Error("No OS candidates found");
      }
      // 最適候補を選択
      const bestCandidate = candidates[0];
      const hexagramInfo = this.dataManager.getHexagramData(bestCandidate.osId);
      if (!hexagramInfo) {
        throw new Error(`Hexagram info not found for OS ${bestCandidate.osId}`);
      }
      // dominantTrigrams を生成
      const dominantTrigrams = this.generateDominantTrigrams(
        userVector,
        hexagramInfo
      );
      // エンジンOS結果を構築
      const engineOSResult = {
        osId: bestCandidate.osId,
        osName: hexagramInfo.name || hexagramInfo.name_jp,
        catchphrase: hexagramInfo.catchphrase,
        description: hexagramInfo.description,
        keywords: hexagramInfo.keywords,
        upperTrigram: this.getTrigramName(hexagramInfo.upper_trigram_id),
        lowerTrigram: this.getTrigramName(hexagramInfo.lower_trigram_id),
        trigramScores: this.convertToTrigramScores(userVector),
        cosineSimilarity: bestCandidate.similarity,
        confidence: bestCandidate.score,
        type: "engine",
        dominantTrigrams: dominantTrigrams,
      };
      console.log("✅ Engine OS determined:", engineOSResult.osName);
      console.log("🎯 Dominant trigrams:", dominantTrigrams);
      return engineOSResult;
    } catch (error) {
      console.error("❌ Error in analyzeEngineOS:", error);
      throw error;
    }
  }

  // インターフェースOS分析（シナリオ設問の外面選択肢）
  async analyzeInterfaceOS(scenarioAnswers, engineOS) {
    try {
      // 外面選択肢を抽出
      const outerChoices = this.extractOuterChoices(scenarioAnswers);
      console.log("👥 Outer choices:", outerChoices);

      // キーワードマッチング（keyword_map使用）
      const matchingResults = await this.performKeywordMatching(
        outerChoices,
        "interface"
      );

      // エンジンOSを除外して最高スコアを選択
      const filteredResults = this.excludeEngineOS(matchingResults, engineOS);
      const bestMatch = filteredResults[0];

      return {
        type: "interface",
        hexagramId: bestMatch.hexagramId,
        hexagramInfo: this.dataManager.getHexagramData(bestMatch.hexagramId),
        matchScore: bestMatch.score,
        keywordMatches: bestMatch.matches,
        outerChoices: outerChoices,
      };
    } catch (error) {
      console.error("❌ Interface OS analysis failed:", error);
      throw error;
    }
  }

  // セーフモードOS分析（シナリオ設問の内面選択肢）
  async analyzeSafeModeOS(scenarioAnswers, engineOS) {
    try {
      // 内面選択肢を抽出
      const innerChoices = this.extractInnerChoices(scenarioAnswers);
      console.log("🔒 Inner choices:", innerChoices);

      // 爻キーワードマッチング（line_keyword_map使用）
      const matchingResults = await this.performLineKeywordMatching(
        innerChoices,
        "safemode"
      );

      // エンジンOSを除外して最高スコアを選択
      const filteredResults = this.excludeEngineOS(matchingResults, engineOS);
      const bestMatch = filteredResults[0];

      return {
        type: "safemode",
        hexagramId: bestMatch.hexagramId,
        hexagramInfo: this.dataManager.getHexagramData(bestMatch.hexagramId),
        matchScore: bestMatch.score,
        lineMatches: bestMatch.matches,
        innerChoices: innerChoices,
      };
    } catch (error) {
      console.error("❌ SafeMode OS analysis failed:", error);
      throw error;
    }
  }

  // 八卦エネルギー計算
  calculateTrigramEnergies(userVector) {
    const trigramEnergies = [];

    Object.entries(this.trigramMapping).forEach(([dimension, trigramInfo]) => {
      const energy = userVector[dimension] || 0;
      trigramEnergies.push({
        dimension: dimension,
        trigram: trigramInfo.trigram,
        trigramId: trigramInfo.id,
        name: trigramInfo.name,
        energy: energy,
      });
    });

    // エネルギー順にソート
    trigramEnergies.sort((a, b) => b.energy - a.energy);

    return trigramEnergies;
  }

  // 八卦から64卦へのマッピング
  mapTrigramsToHexagram(upperTrigram, lowerTrigram) {
    // 上卦と下卦の組み合わせから64卦IDを計算
    // 上卦のID * 8 + 下卦のID - 8 = 64卦ID
    const hexagramId =
      (upperTrigram.trigramId - 1) * 8 + lowerTrigram.trigramId;

    console.log(
      `🔮 Mapping: ${upperTrigram.name} (上卦) + ${lowerTrigram.name} (下卦) → 64卦ID: ${hexagramId}`
    );

    return hexagramId;
  }

  // 外面選択肢抽出
  extractOuterChoices(scenarioAnswers) {
    return scenarioAnswers
      .map((answer) => {
        if (answer.outerChoice) {
          return {
            questionId: answer.questionId,
            value: answer.outerChoice.value,
            text: answer.outerChoice.text || "",
            scoring_tags: answer.outerChoice.scoring_tags || [],
          };
        }
        return null;
      })
      .filter((choice) => choice !== null);
  }

  // 内面選択肢抽出
  extractInnerChoices(scenarioAnswers) {
    return scenarioAnswers
      .map((answer) => {
        if (answer.innerChoice) {
          return {
            questionId: answer.questionId,
            value: answer.innerChoice.value,
            text: answer.innerChoice.text || "",
            scoring_tags: answer.innerChoice.scoring_tags || [],
          };
        }
        return null;
      })
      .filter((choice) => choice !== null);
  }

  // キーワードマッチング（keyword_map使用）
  async performKeywordMatching(choices, type) {
    // 実装予定：DataManagerからkeyword_mapを取得してマッチング
    // 暫定的にモック実装
    return this.mockKeywordMatching(choices, type);
  }

  // 爻キーワードマッチング（line_keyword_map使用）
  async performLineKeywordMatching(choices, type) {
    // 実装予定：DataManagerからline_keyword_mapを取得してマッチング
    // 暫定的にモック実装
    return this.mockLineKeywordMatching(choices, type);
  }

  // エンジンOSを除外
  excludeEngineOS(matchingResults, engineOS) {
    return matchingResults.filter(
      (result) => result.hexagramId !== engineOS.hexagramId
    );
  }

  // エンジン強度計算
  calculateEngineStrength(trigramEnergies) {
    if (trigramEnergies.length < 2) return 0;

    const topTwo = trigramEnergies.slice(0, 2);
    const totalEnergy = topTwo.reduce(
      (sum, trigram) => sum + trigram.energy,
      0
    );
    const maxPossibleEnergy = 50; // 想定最大値

    return Math.min(totalEnergy / maxPossibleEnergy, 1.0);
  }

  // 人格一貫性スコア計算
  calculateConsistencyScore(engineOS, interfaceOS, safeModeOS) {
    // 3つのOSの相関を計算
    const engineVector = engineOS.userVector;
    const interfaceScore = interfaceOS.matchScore || 0;
    const safeModeScore = safeModeOS.matchScore || 0;

    // 暫定的な計算式
    const baseConsistency = 0.7; // ベースライン
    const scoreVariation = Math.abs(interfaceScore - safeModeScore) / 100;
    const consistencyScore = Math.max(0, baseConsistency - scoreVariation);

    return {
      overall: consistencyScore,
      engineInterface: this.calculatePairConsistency(engineOS, interfaceOS),
      engineSafeMode: this.calculatePairConsistency(engineOS, safeModeOS),
      interfaceSafeMode: this.calculatePairConsistency(interfaceOS, safeModeOS),
    };
  }

  // ペア一貫性計算
  calculatePairConsistency(osA, osB) {
    // 暫定実装
    return 0.8;
  }

  // 統合洞察生成
  generateIntegrationInsights(
    engineOS,
    interfaceOS,
    safeModeOS,
    consistencyScore
  ) {
    return {
      summary: `あなたの人格は3層構造で構成されています。`,
      engineInsight: `エンジンOS「${engineOS.osName}」が核となる価値観を形成しています。`,
      interfaceInsight: `インターフェースOS「${interfaceOS.hexagramInfo.name}」が外面的な行動パターンを決定しています。`,
      safeModeInsight: `セーフモードOS「${safeModeOS.hexagramInfo.name}」が内面的な防御機制として働いています。`,
      consistencyInsight: `全体的な一貫性は${Math.round(
        consistencyScore.overall * 100
      )}%です。`,
      recommendations: [
        "3つのOSの特徴を理解し、状況に応じて適切に使い分けましょう",
        "一貫性を高めるために、内面と外面のバランスを意識してください",
        "各OSの強みを活かせる環境を見つけることが重要です",
      ],
    };
  }

  // モックキーワードマッチング
  mockKeywordMatching(choices, type) {
    const mockResults = [];

    for (let i = 1; i <= 64; i++) {
      mockResults.push({
        hexagramId: i,
        score: Math.random() * 100,
        matches: [`mock_keyword_${i}`],
      });
    }

    return mockResults.sort((a, b) => b.score - a.score);
  }

  // モック爻キーワードマッチング
  mockLineKeywordMatching(choices, type) {
    const mockResults = [];

    for (let i = 1; i <= 64; i++) {
      mockResults.push({
        hexagramId: i,
        score: Math.random() * 100,
        matches: [`mock_line_keyword_${i}`],
      });
    }

    return mockResults.sort((a, b) => b.score - a.score);
  }

  // 八卦名取得ヘルパー
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
    return trigramNames[trigramId] || "未定義";
  }

  // dominantTrigrams生成メソッド
  generateDominantTrigrams(userVector, hexagramInfo) {
    try {
      console.log("🔥 Generating dominant trigrams for Engine OS...");
      // 8次元を八卦にマッピング
      const trigramMapping = {
        乾_創造性: { id: 1, name: "乾", symbol: "☰" },
        兌_調和性: { id: 2, name: "兌", symbol: "☱" },
        離_表現性: { id: 3, name: "離", symbol: "☲" },
        震_行動性: { id: 4, name: "震", symbol: "☳" },
        巽_適応性: { id: 5, name: "巽", symbol: "☴" },
        坎_探求性: { id: 6, name: "坎", symbol: "☵" },
        艮_安定性: { id: 7, name: "艮", symbol: "☶" },
        坤_受容性: { id: 8, name: "坤", symbol: "☷" },
      };
      // userVectorが配列の場合はオブジェクトに変換
      let vectorObj = userVector;
      if (Array.isArray(userVector)) {
        // 8次元配列→オブジェクト変換
        const keys = Object.keys(trigramMapping);
        vectorObj = {};
        for (let i = 0; i < keys.length; i++) {
          vectorObj[keys[i]] = userVector[i] || 0;
        }
      }
      // ユーザーベクトルから八卦スコアを計算
      const trigramScores = [];
      let totalScore = 0;
      Object.entries(trigramMapping).forEach(([dimensionKey, trigram]) => {
        const value = vectorObj[dimensionKey] || 0;
        trigramScores.push({
          id: trigram.id,
          name: trigram.name,
          symbol: trigram.symbol,
          dimensionKey: dimensionKey,
          value: value,
          percentage: 0,
        });
        totalScore += value;
      });
      // パーセンテージを計算
      trigramScores.forEach((trigram) => {
        trigram.percentage =
          totalScore > 0
            ? Math.round((trigram.value / totalScore) * 1000) / 10
            : 0;
      });
      // スコア順でソート（降順）
      trigramScores.sort((a, b) => b.value - a.value);
      // 上位3つを返す
      const dominantTrigrams = trigramScores.slice(0, 3);
      console.log(
        "🎯 Dominant trigrams calculated:",
        dominantTrigrams.map((t) => `${t.name}(${t.percentage}%)`).join(", ")
      );
      return dominantTrigrams;
    } catch (error) {
      console.error("❌ Error generating dominant trigrams:", error);
      // エラー時のフォールバック
      return [
        {
          id: 1,
          name: "乾",
          symbol: "☰",
          dimensionKey: "乾_創造性",
          value: 0,
          percentage: 0,
        },
        {
          id: 2,
          name: "兌",
          symbol: "☱",
          dimensionKey: "兌_調和性",
          value: 0,
          percentage: 0,
        },
        {
          id: 3,
          name: "離",
          symbol: "☲",
          dimensionKey: "離_表現性",
          value: 0,
          percentage: 0,
        },
      ];
    }
  }

  // 8次元から八卦スコアに変換
  convertToTrigramScores(userVector) {
    const trigramScores = {};
    const dimensionToTrigram = {
      乾_創造性: 1,
      兌_調和性: 2,
      離_表現性: 3,
      震_行動性: 4,
      巽_適応性: 5,
      坎_探求性: 6,
      艮_安定性: 7,
      坤_受容性: 8,
    };
    Object.entries(userVector).forEach(([dimensionKey, value]) => {
      const trigramId = dimensionToTrigram[dimensionKey];
      if (trigramId) {
        trigramScores[trigramId] = value || 0;
      }
    });
    return trigramScores;
  }
}
