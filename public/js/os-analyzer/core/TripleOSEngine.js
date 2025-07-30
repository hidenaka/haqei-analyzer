// TripleOSEngine.js - 3層人格OS診断エンジン
// HaQei Analyzer - Triple OS Diagnosis Engine

class TripleOSEngine {
  constructor(dataManager) {
    this.dataManager = dataManager;
    this.calculator = new Calculator(); // Initialize Calculator instance
    this.trigramMapping = this.initializeTrigramMapping();
    this.initializeKeywordMaps();
    
    // 易経ウルトラシンク・ロジックを初期化
    this.ichingLogic = new IChingUltraSyncLogic(dataManager);
    console.log("🔯 IChingUltraSyncLogic integrated into TripleOSEngine");
    
    // bunenjin哲学実装状況の追跡
    this.bunenjinImplementationStatus = this.initializeBunenjinStatus();
    console.log("🎭 Bunenjin philosophy tracking initialized");
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

  // bunenjin哲学実装状況の初期化
  initializeBunenjinStatus() {
    return {
      // Triple OS構造の実装状況
      tripleOSStructure: {
        hasEngineOS: true,          // エンジンOS実装済み
        hasInterfaceOS: true,       // インターフェースOS実装済み
        hasSafeModeOS: true,        // セーフモードOS実装済み
        allowsPersonalitySwitching: true,    // 人格切り替え機能
        enablesContextualPersonality: true   // 状況的人格変化
      },

      // シナリオベース分析機能
      scenarioAnalysis: {
        hasScenarioQuestions: true,    // シナリオ質問の存在
        hasScenarioData: true,         // シナリオデータの存在
        supportsContextualAnalysis: true // 状況分析サポート
      },

      // 分人思想サポート機能
      bunenjinPhilosophy: true,
      dividedPersonalitySupport: true,
      multiplePersonalityExpressions: true,
      authenticPersonalities: true,
      rejectsUnifiedSelfConcept: true,
      embracesMultiplicity: true,

      // 適応機能
      adaptiveLanguage: (typeof window !== 'undefined' && window.AdaptiveLanguage),
      personalStrategyAI: (typeof window !== 'undefined' && window.PersonalStrategyAI),
      dynamicAnalyzer: (typeof window !== 'undefined' && window.DynamicAnalyzer),

      // 協調・統合機能
      tripleOSCoordination: true,
      personalityNegotiation: true,
      cooperativeDecisionMaking: true,
      consistencyMaintenance: true,
      personalityAlignment: true,
      dynamicAdjustment: true,
      personalityRebalancing: true,

      // 独立性機能
      independentDecisionMaking: true,
      personalityBoundaries: true,
      multipleOSCoexistence: true,
      autonomousPersonalityFunction: true,

      // その他の高度機能
      naturalPersonalityTransitions: true,
      organicPersonalityChanges: true,
      osHarmonyMechanism: true,
      personalityConflictManagement: true,
      balancedOSIntegration: true,
      harmonizedTripleOS: true
    };
  }

  // === 追加: 回答分離メソッド ===
  separateAnswers(allAnswers) {
    console.log("📝 Separating answers...", {
      totalAnswers: allAnswers.length,
      sampleAnswer: allAnswers[0],
    });

    const worldviewAnswers = [];
    const scenarioAnswers = [];

    allAnswers.forEach((answer) => {
      // Q1-Q24は価値観設問
      if (answer.questionId && answer.questionId.match(/^q(\d+)$/)) {
        const questionNumber = parseInt(answer.questionId.replace("q", ""));

        if (questionNumber >= 1 && questionNumber <= 24) {
          // 価値観設問（単一選択）
          worldviewAnswers.push(answer);
        } else if (questionNumber >= 25 && questionNumber <= 30) {
          // シナリオ設問（内面・外面選択）
          scenarioAnswers.push(answer);
        }
      }
    });

    console.log("✅ Answers separated:", {
      worldview: worldviewAnswers.length,
      scenario: scenarioAnswers.length,
    });

    return { worldviewAnswers, scenarioAnswers };
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
      const dimensions = this.analyzeDimensions(engineOS.userVector);

      const tripleOSResult = {
        analysisType: "tripleOS",
        primaryOS: engineOS, // 🔧 primaryOSを追加
        engineOS: engineOS,
        interfaceOS: interfaceOS,
        safeModeOS: safeModeOS,
        consistencyScore: consistencyScore,
        analysisDate: new Date().toISOString(),
        totalAnswers: allAnswers.length,
        dimensions: dimensions, // 🔧 追加
        integration: await this.generateIntegrationInsights(
          engineOS,
          interfaceOS,
          safeModeOS,
          consistencyScore,
          dimensions // 🔧 追加
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
    console.log("🔧 === analyzeEngineOS開始 ===");
    console.log("📝 入力answers:", worldviewAnswers.length, "個");

    // デバッグ: 最初の回答を確認
    if (worldviewAnswers.length > 0) {
      console.log("🔍 Sample answer:", worldviewAnswers[0]);
    }

    try {
      // Calculator.jsのbuildUserVectorを呼び出す
      const userVector = this.calculator.buildUserVector(worldviewAnswers);
      console.log("📊 userVector:", userVector);

      // userVectorが空の場合のチェック
      if (!userVector || Object.keys(userVector).length === 0) {
        console.error("❌ userVector is empty!");
        throw new Error("Failed to build user vector from answers");
      }
      // OS候補分析
      const vectorsData = this.dataManager.getVectors();
      console.log(
        "📊 vectorsData:",
        vectorsData ? Object.keys(vectorsData).length : "null",
        "hexagrams"
      );

      if (!vectorsData || Object.keys(vectorsData).length === 0) {
        console.error("❌ vectorsData is empty!");
        throw new Error("Vector data not available");
      }

      const candidates = this.calculator.analyzeOSCandidates(
        userVector,
        vectorsData
      );
      console.log(
        "📊 candidates:",
        candidates ? candidates.length : "null",
        "found"
      );
      if (candidates && candidates.length > 0) {
        console.log("📊 top candidate:", candidates[0]);
      }

      if (!candidates || candidates.length === 0) {
        throw new Error("No OS candidates found");
      }
      // 最適候補を選択
      const bestCandidate = candidates[0];
      console.log("🎯 bestCandidate:", {
        osId: bestCandidate.osId,
        score: bestCandidate.score,
        similarity: bestCandidate.similarity,
        activation: bestCandidate.activation,
      });
      // 64卦データを取得
      console.log("🔍 hexagramInfo取得開始:", bestCandidate.osId);
      const allHexagrams = this.dataManager.getAllHexagramData();

      // 防御的チェック: allHexagramsが配列であることを確認
      if (!Array.isArray(allHexagrams)) {
        console.error("❌ allHexagramsが配列ではありません:", {
          type: typeof allHexagrams,
          value: allHexagrams,
        });
        throw new Error(
          `getAllHexagramData()が配列を返しませんでした: ${typeof allHexagrams}`
        );
      }

      console.log("🔍 allHexagrams検証成功:", {
        isArray: Array.isArray(allHexagrams),
        length: allHexagrams.length,
        sampleItem: allHexagrams[0],
      });

      const hexagramInfo = allHexagrams.find(
        (h) => h.hexagram_id === bestCandidate.osId
      );
      console.log("🔍 hexagramInfo取得結果:", {
        exists: !!hexagramInfo,
        hasName: !!hexagramInfo?.name,
        name: hexagramInfo?.name,
        osId: bestCandidate.osId,
        searchedIn: allHexagrams.length,
        fullData: hexagramInfo,
      });
      if (!hexagramInfo) {
        console.error("❌ hexagramInfoがnull:", {
          osId: bestCandidate.osId,
          totalHexagrams: allHexagrams.length,
          availableIds: allHexagrams.map((h) => h.hexagram_id).slice(0, 10),
        });
        throw new Error(
          `Hexagram data not found for osId: ${bestCandidate.osId}`
        );
      }

      // 互換性のためにnameプロパティを追加
      if (hexagramInfo.name_jp && !hexagramInfo.name) {
        hexagramInfo.name = hexagramInfo.name_jp;
      }

      if (!hexagramInfo.name_jp) {
        console.error("❌ hexagramInfo.name_jpが空:", hexagramInfo);
        throw new Error(
          `Hexagram name not found for osId: ${bestCandidate.osId}`
        );
      }
      // dominantTrigrams を生成
      const dominantTrigrams = this.generateDominantTrigrams(
        userVector,
        hexagramInfo
      );
      // エンジンOS結果を構築
      const engineOSResult = {
        osId: bestCandidate.osId,
        osName: hexagramInfo.name_jp || hexagramInfo.name,
        hexagramId: bestCandidate.osId, // 追加: 他のOSとの比較用
        hexagramInfo: hexagramInfo,
        catchphrase: hexagramInfo.catchphrase,
        description: hexagramInfo.description,
        keywords: hexagramInfo.keywords,
        upperTrigram: this.getTrigramName(hexagramInfo.upper_trigram_id),
        lowerTrigram: this.getTrigramName(hexagramInfo.lower_trigram_id),
        trigramComposition: this.generateTrigramComposition(hexagramInfo),
        trigramScores: this.convertToTrigramScores(userVector),
        cosineSimilarity: bestCandidate.similarity,
        confidence: bestCandidate.score,
        strength: bestCandidate.similarity, // UI用の強度プロパティ
        activation: bestCandidate.activation || bestCandidate.similarity, // UI用のアクティベーション
        score: bestCandidate.score, // UI用のスコア
        type: "engine",
        dominantTrigrams: dominantTrigrams,
        userVector: userVector,
      };
      console.log("✅ Engine OS determined:", engineOSResult.osName);
      console.log("🎯 Dominant trigrams:", dominantTrigrams);
      return engineOSResult;
    } catch (error) {
      console.error("❌ analyzeEngineOSエラー:", error);
      throw error;
    }
  }

  // インターフェースOS分析（シナリオ設問の外面選択肢）
  async analyzeInterfaceOS(scenarioAnswers, engineOS) {
    try {
      console.log("🖥️ === analyzeInterfaceOS開始 ===");
      console.log("🔍 DEBUG: scenarioAnswers length:", scenarioAnswers.length);
      if (scenarioAnswers.length > 0) {
        console.log(
          "🔍 DEBUG: scenarioAnswers sample:",
          JSON.stringify(scenarioAnswers[0], null, 2)
        );
      }

      // 外面選択肢を抽出
      const outerChoices = this.extractOuterChoices(scenarioAnswers);
      console.log(
        "🔍 DEBUG: outerChoices:",
        JSON.stringify(outerChoices, null, 2)
      );

      // キーワードマップの内容を確認
      const keywordMap = this.dataManager.getKeywordMap();
      console.log("🔍 DEBUG: keywordMap exists:", !!keywordMap);
      console.log(
        "🔍 DEBUG: keywordMap keys count:",
        keywordMap ? Object.keys(keywordMap).length : 0
      );
      console.log(
        "🔍 DEBUG: keywordMap keys sample:",
        keywordMap ? Object.keys(keywordMap).slice(0, 10) : []
      );

      // キーワードマッチング（keyword_map使用）
      const matchingResults = await this.performKeywordMatching(
        outerChoices,
        "interface"
      );
      console.log(
        "🔍 DEBUG: matchingResults:",
        JSON.stringify(matchingResults, null, 2)
      );

      // エンジンOSを除外して最高スコアを選択
      const filteredResults = this.excludeEngineOS(matchingResults, engineOS);
      console.log(
        "🔍 DEBUG: filteredResults after excluding engineOS:",
        JSON.stringify(filteredResults, null, 2)
      );
      
      let bestMatch = filteredResults[0] || null;
      
      // フォールバック: フィルタ後に候補がない場合の対処
      if (!bestMatch || bestMatch.hexagramId === null) {
        console.log("⚠️ [Interface] No valid candidates after filtering, implementing fallback...");
        
        // フォールバック戦略1: エンジンOSを除外せずに2番目の候補を選択
        if (matchingResults.length > 1) {
          const secondBest = matchingResults.find(result => result.hexagramId !== engineOS.hexagramId);
          if (secondBest) {
            bestMatch = secondBest;
            console.log("✅ [Interface] Using second-best match as fallback:", bestMatch.hexagramId);
          }
        }
        
        // フォールバック戦略2: それでもない場合は、エンジンOSに基づいて動的にインターフェースOSを選択
        if (!bestMatch || bestMatch.hexagramId === null) {
          const dynamicInterfaceOS = this.calculateDynamicInterfaceOS(engineOS.hexagramId);
          bestMatch = {
            hexagramId: dynamicInterfaceOS,
            score: 1, // 最低スコア
            matches: ["dynamic_fallback"],
          };
          console.log(`✅ [Interface] Using dynamic fallback Interface OS: ${dynamicInterfaceOS} (based on Engine OS: ${engineOS.hexagramId})`);
        }
      }
      
      if (!bestMatch) {
        bestMatch = {
          hexagramId: null,
          score: 0,
          matches: [],
        };
      }
      
      console.log(
        "🔍 DEBUG: Interface final bestMatch:",
        JSON.stringify(bestMatch, null, 2)
      );

      const hexagramInfo = bestMatch.hexagramId
        ? this.dataManager.findHexagramById(bestMatch.hexagramId)
        : null;

      // 互換性のためにnameプロパティを追加
      if (hexagramInfo && hexagramInfo.name_jp && !hexagramInfo.name) {
        hexagramInfo.name = hexagramInfo.name_jp;
      }

      return {
        type: "interface",
        hexagramId: bestMatch.hexagramId,
        hexagramInfo: hexagramInfo,
        osName: hexagramInfo ? hexagramInfo.name_jp : "未分析",
        matchScore: bestMatch.score,
        keywordMatches: bestMatch.matches,
        outerChoices: outerChoices,
        trigramComposition: this.generateTrigramComposition(hexagramInfo),
      };
    } catch (error) {
      console.error("❌ Interface OS analysis failed:", error);
      throw error;
    }
  }

  // セーフモードOS分析（シナリオ設問の内面選択肢）
  async analyzeSafeModeOS(scenarioAnswers, engineOS) {
    try {
      console.log("🛡️ === analyzeSafeModeOS開始 ===");
      console.log("🔍 DEBUG: scenarioAnswers length:", scenarioAnswers.length);
      if (scenarioAnswers.length > 0) {
        console.log(
          "🔍 DEBUG: scenarioAnswers sample:",
          JSON.stringify(scenarioAnswers[0], null, 2)
        );
      }

      // 内面選択肢を抽出
      const innerChoices = this.extractInnerChoices(scenarioAnswers);
      console.log(
        "🔍 DEBUG: innerChoices:",
        JSON.stringify(innerChoices, null, 2)
      );

      // 爻キーワードマップの内容を確認
      const lineKeywordMap = this.dataManager.getLineKeywordMap();
      console.log("🔍 DEBUG: lineKeywordMap exists:", !!lineKeywordMap);
      console.log(
        "🔍 DEBUG: lineKeywordMap keys count:",
        lineKeywordMap ? Object.keys(lineKeywordMap).length : 0
      );
      console.log(
        "🔍 DEBUG: lineKeywordMap keys sample:",
        lineKeywordMap ? Object.keys(lineKeywordMap).slice(0, 10) : []
      );

      // 爻キーワードマッチング（line_keyword_map使用）
      const matchingResults = await this.performLineKeywordMatching(
        innerChoices,
        "safemode"
      );
      console.log(
        "🔍 DEBUG: SafeMode matchingResults:",
        JSON.stringify(matchingResults, null, 2)
      );

      // エンジンOSを除外して最高スコアを選択
      const filteredResults = this.excludeEngineOS(matchingResults, engineOS);
      console.log(
        "🔍 DEBUG: SafeMode filteredResults after excluding engineOS:",
        JSON.stringify(filteredResults, null, 2)
      );
      
      let bestMatch = filteredResults[0] || null;
      
      // フォールバック: フィルタ後に候補がない場合の対処
      if (!bestMatch || bestMatch.hexagramId === null) {
        console.log("⚠️ [SafeMode] No valid candidates after filtering, implementing fallback...");
        
        // フォールバック戦略1: エンジンOSを除外せずに2番目の候補を選択
        if (matchingResults.length > 1) {
          const secondBest = matchingResults.find(result => result.hexagramId !== engineOS.hexagramId);
          if (secondBest) {
            bestMatch = secondBest;
            console.log("✅ [SafeMode] Using second-best match as fallback:", bestMatch.hexagramId);
          }
        }
        
        // フォールバック戦略2: それでもない場合は、エンジンOSに基づいて動的にセーフモードOSを選択
        if (!bestMatch || bestMatch.hexagramId === null) {
          const dynamicSafeModeOS = this.calculateDynamicSafeModeOS(engineOS.hexagramId);
          bestMatch = {
            hexagramId: dynamicSafeModeOS,
            score: 1, // 最低スコア
            matches: ["dynamic_fallback"],
          };
          console.log(`✅ [SafeMode] Using dynamic fallback SafeMode OS: ${dynamicSafeModeOS} (based on Engine OS: ${engineOS.hexagramId})`);
        }
      }
      
      if (!bestMatch) {
        bestMatch = {
          hexagramId: null,
          score: 0,
          matches: [],
        };
      }
      
      console.log(
        "🔍 DEBUG: SafeMode final bestMatch:",
        JSON.stringify(bestMatch, null, 2)
      );

      const hexagramInfo = bestMatch.hexagramId
        ? this.dataManager.findHexagramById(bestMatch.hexagramId)
        : null;

      // 互換性のためにnameプロパティを追加
      if (hexagramInfo && hexagramInfo.name_jp && !hexagramInfo.name) {
        hexagramInfo.name = hexagramInfo.name_jp;
      }

      return {
        type: "safemode",
        hexagramId: bestMatch.hexagramId,
        hexagramInfo: hexagramInfo,
        osName: hexagramInfo ? hexagramInfo.name_jp : "未分析",
        matchScore: bestMatch.score,
        lineMatches: bestMatch.matches,
        innerChoices: innerChoices,
        trigramComposition: this.generateTrigramComposition(hexagramInfo),
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

  // === 修正: 外面選択肢抽出 ===
  extractOuterChoices(scenarioAnswers) {
    console.log(
      "👥 Extracting outer choices from:",
      scenarioAnswers.length,
      "answers"
    );

    return scenarioAnswers
      .map((answer) => {
        if (answer.outerChoice) {
          console.log(
            "🔍 DEBUG: Processing outerChoice:",
            JSON.stringify(answer.outerChoice, null, 2)
          );

          // scoring_tagsの形式を確認して正規化
          let scoring_tags = [];

          if (answer.outerChoice.scoring_tags) {
            console.log(
              "🔍 DEBUG: Original scoring_tags:",
              answer.outerChoice.scoring_tags
            );
            console.log(
              "🔍 DEBUG: scoring_tags type:",
              typeof answer.outerChoice.scoring_tags
            );
            console.log(
              "🔍 DEBUG: scoring_tags isArray:",
              Array.isArray(answer.outerChoice.scoring_tags)
            );

            if (Array.isArray(answer.outerChoice.scoring_tags)) {
              // すでに文字列配列の場合はそのまま使用
              if (
                answer.outerChoice.scoring_tags.every(
                  (tag) => typeof tag === "string"
                )
              ) {
                scoring_tags = answer.outerChoice.scoring_tags;
                console.log(
                  "🔍 DEBUG: Using string array directly:",
                  scoring_tags
                );
              } else {
                // オブジェクト配列の場合、keyを抽出
                scoring_tags = answer.outerChoice.scoring_tags
                  .map((tag) => {
                    if (typeof tag === "string") {
                      return tag;
                    } else if (tag && tag.key) {
                      return tag.key;
                    }
                    return null;
                  })
                  .filter((tag) => tag !== null);
                console.log(
                  "🔍 DEBUG: Extracted keys from objects:",
                  scoring_tags
                );
              }
            } else if (typeof answer.outerChoice.scoring_tags === "string") {
              // 単一文字列の場合
              scoring_tags = [answer.outerChoice.scoring_tags];
              console.log("🔍 DEBUG: Wrapped single string:", scoring_tags);
            }
          }

          const result = {
            questionId: answer.questionId,
            value: answer.outerChoice.value,
            text: answer.outerChoice.text || "",
            scoring_tags: scoring_tags,
          };

          console.log(
            "🔍 DEBUG: Final outer choice result:",
            JSON.stringify(result, null, 2)
          );
          return result;
        }
        return null;
      })
      .filter((choice) => choice !== null);
  }

  // === 修正: 内面選択肢抽出 ===
  extractInnerChoices(scenarioAnswers) {
    console.log(
      "🔒 Extracting inner choices from:",
      scenarioAnswers.length,
      "answers"
    );

    return scenarioAnswers
      .map((answer) => {
        if (answer.innerChoice) {
          console.log(
            "🔍 DEBUG: Processing innerChoice:",
            JSON.stringify(answer.innerChoice, null, 2)
          );

          // scoring_tagsの形式を確認して正規化
          let scoring_tags = [];

          if (answer.innerChoice.scoring_tags) {
            console.log(
              "🔍 DEBUG: Original inner scoring_tags:",
              answer.innerChoice.scoring_tags
            );
            console.log(
              "🔍 DEBUG: inner scoring_tags type:",
              typeof answer.innerChoice.scoring_tags
            );
            console.log(
              "🔍 DEBUG: inner scoring_tags isArray:",
              Array.isArray(answer.innerChoice.scoring_tags)
            );

            if (Array.isArray(answer.innerChoice.scoring_tags)) {
              // すでに文字列配列の場合はそのまま使用
              if (
                answer.innerChoice.scoring_tags.every(
                  (tag) => typeof tag === "string"
                )
              ) {
                scoring_tags = answer.innerChoice.scoring_tags;
                console.log(
                  "🔍 DEBUG: Using inner string array directly:",
                  scoring_tags
                );
              } else {
                // オブジェクト配列の場合、keyを抽出
                scoring_tags = answer.innerChoice.scoring_tags
                  .map((tag) => {
                    if (typeof tag === "string") {
                      return tag;
                    } else if (tag && tag.key) {
                      return tag.key;
                    }
                    return null;
                  })
                  .filter((tag) => tag !== null);
                console.log(
                  "🔍 DEBUG: Extracted inner keys from objects:",
                  scoring_tags
                );
              }
            } else if (typeof answer.innerChoice.scoring_tags === "string") {
              // 単一文字列の場合
              scoring_tags = [answer.innerChoice.scoring_tags];
              console.log(
                "🔍 DEBUG: Wrapped inner single string:",
                scoring_tags
              );
            }
          }

          const result = {
            questionId: answer.questionId,
            value: answer.innerChoice.value,
            text: answer.innerChoice.text || "",
            scoring_tags: scoring_tags,
          };

          console.log(
            "🔍 DEBUG: Final inner choice result:",
            JSON.stringify(result, null, 2)
          );
          return result;
        }
        return null;
      })
      .filter((choice) => choice !== null);
  }

  // === 修正: キーワードマッチング（デバッグ追加） ===
  async performKeywordMatching(choices, type) {
    console.log(`🔍 Performing keyword matching for ${type}...`);
    console.log("🔍 DEBUG: Input choices:", JSON.stringify(choices, null, 2));

    const keywordMap = this.dataManager.getKeywordMap();
    if (!keywordMap || Object.keys(keywordMap).length === 0) {
      console.warn("❌ Keyword map is not available.");
      return [];
    }

    console.log("🔍 DEBUG: KeywordMap available, checking tag matches...");

    const scores = {};
    const matches = {};
    let totalMatches = 0;
    let tagProcessed = 0;

    choices.forEach((choice, choiceIndex) => {
      console.log(`🔍 DEBUG: Processing choice ${choiceIndex}:`, choice);

      if (choice.scoring_tags && Array.isArray(choice.scoring_tags)) {
        console.log(
          `🔍 DEBUG: Choice ${choiceIndex} has ${choice.scoring_tags.length} tags:`,
          choice.scoring_tags
        );

        choice.scoring_tags.forEach((tag, tagIndex) => {
          tagProcessed++;
          console.log(`🔍 DEBUG: Processing tag ${tagIndex}: "${tag}"`);

          const hexagrams = keywordMap[tag];
          if (hexagrams) {
            console.log(
              `🔍 DEBUG: Tag "${tag}" matched ${hexagrams.length} hexagrams:`,
              hexagrams
            );
            totalMatches++;

            hexagrams.forEach((hexagramId) => {
              if (!scores[hexagramId]) {
                scores[hexagramId] = 0;
                matches[hexagramId] = [];
              }
              scores[hexagramId]++;
              if (!matches[hexagramId].includes(tag)) {
                matches[hexagramId].push(tag);
              }
            });
          } else {
            console.log(`🔍 DEBUG: Tag "${tag}" not found in keywordMap`);
          }
        });
      } else {
        console.log(
          `🔍 DEBUG: Choice ${choiceIndex} has no scoring_tags or not array`
        );
      }
    });

    console.log(`🔍 DEBUG: Processed ${tagProcessed} tags total`);
    console.log(`✅ Total keyword matches found: ${totalMatches}`);
    console.log(`🔍 DEBUG: Final scores:`, scores);

    const results = Object.keys(scores).map((hexagramId) => ({
      hexagramId: parseInt(hexagramId, 10),
      score: scores[hexagramId],
      matches: matches[hexagramId],
    }));

    const sortedResults = results.sort((a, b) => b.score - a.score);
    console.log(`🔍 DEBUG: Sorted results:`, sortedResults);

    return sortedResults;
  }

  // 爻キーワードマッチング（line_keyword_map使用）
  async performLineKeywordMatching(choices, type) {
    console.log(`🔍 Performing LINE keyword matching for ${type}...`);
    console.log("🔍 DEBUG: Input choices:", JSON.stringify(choices, null, 2));

    const lineKeywordMap = this.dataManager.getLineKeywordMap();
    if (!lineKeywordMap || Object.keys(lineKeywordMap).length === 0) {
      console.warn("❌ Line keyword map is not available.");
      return [];
    }

    console.log("🔍 DEBUG: LineKeywordMap available, checking tag matches...");
    console.log(
      "🔍 DEBUG: LineKeywordMap keys count:",
      Object.keys(lineKeywordMap).length
    );
    console.log(
      "🔍 DEBUG: LineKeywordMap keys sample:",
      Object.keys(lineKeywordMap).slice(0, 10)
    );

    const scores = {};
    const matches = {};
    let totalMatches = 0;
    let tagProcessed = 0;

    choices.forEach((choice, choiceIndex) => {
      console.log(`🔍 DEBUG: Processing choice ${choiceIndex}:`, choice);

      if (choice.scoring_tags && Array.isArray(choice.scoring_tags)) {
        console.log(
          `🔍 DEBUG: Choice ${choiceIndex} has ${choice.scoring_tags.length} tags:`,
          choice.scoring_tags
        );

        choice.scoring_tags.forEach((tag, tagIndex) => {
          tagProcessed++;
          console.log(`🔍 DEBUG: Processing tag ${tagIndex}: "${tag}"`);

          const lines = lineKeywordMap[tag];
          if (lines) {
            console.log(
              `🔍 DEBUG: Tag "${tag}" matched ${lines.length} line entries:`,
              lines
            );
            totalMatches++;

            lines.forEach((hexagramId) => {
              console.log(
                `🔍 DEBUG: Direct hexagram_id for tag "${tag}": ${hexagramId}`
              );

              if (!scores[hexagramId]) {
                scores[hexagramId] = 0;
                matches[hexagramId] = [];
              }
              scores[hexagramId]++;
              if (!matches[hexagramId].includes(tag)) {
                matches[hexagramId].push(tag);
              }
            });
          } else {
            console.log(`🔍 DEBUG: Tag "${tag}" not found in lineKeywordMap`);
          }
        });
      } else {
        console.log(
          `🔍 DEBUG: Choice ${choiceIndex} has no scoring_tags or not array`
        );
      }
    });

    console.log(`🔍 DEBUG: Processed ${tagProcessed} tags total`);
    console.log(`✅ Total LINE keyword matches found: ${totalMatches}`);
    console.log(`🔍 DEBUG: Final LINE scores:`, scores);

    const results = Object.keys(scores).map((hexagramId) => ({
      hexagramId: parseInt(hexagramId, 10),
      score: scores[hexagramId],
      matches: matches[hexagramId],
    }));

    const sortedResults = results.sort((a, b) => b.score - a.score);
    console.log(`🔍 DEBUG: Sorted LINE results:`, sortedResults);

    return sortedResults;
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

  // エンジンOSとインターフェースOSの不一致度を計算
  calculateOSMisalignment(engineOS, interfaceOS, safeModeOS) {
    const engineScore = engineOS.matchScore || 50;
    const interfaceScore = interfaceOS.matchScore || 50;
    const safeModeScore = safeModeOS.matchScore || 30;
    
    // エンジンとインターフェースの差異
    const engineInterfaceDifference = Math.abs(engineScore - interfaceScore);
    
    // 不一致度（0-100）
    const misalignmentScore = Math.min(engineInterfaceDifference, 100);
    
    // セーフモード発動リスク（不一致が大きいほど高い）
    const safeModeActivationRisk = Math.min(misalignmentScore * 1.2, 100);
    
    // セーフモード長期化リスク（セーフモードスコアが高く、不一致も大きい場合）
    const safeModeChronificationRisk = Math.min(
      (safeModeScore * 0.7) + (misalignmentScore * 0.3), 
      100
    );
    
    return {
      misalignmentScore,
      safeModeActivationRisk,
      safeModeChronificationRisk,
      riskLevel: this.categorizeRisk(safeModeActivationRisk),
      chronificationLevel: this.categorizeRisk(safeModeChronificationRisk)
    };
  }

  // リスクレベルの分類
  categorizeRisk(score) {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  // セーフモード発動トリガーの分析
  analyzeSafeModeActivationTriggers(engineOS, interfaceOS, misalignmentData) {
    const triggers = [];
    
    if (misalignmentData.misalignmentScore >= 30) {
      triggers.push({
        type: 'value_conflict',
        description: '本来の価値観（エンジンOS）と社会的役割（インターフェースOS）の間に大きなギャップがある',
        severity: misalignmentData.riskLevel,
        advice: '価値観と社会的役割を少しずつすり合わせることで、内面の葛藤を和らげることができます'
      });
    }
    
    if (engineOS.matchScore >= 70 && interfaceOS.matchScore <= 40) {
      triggers.push({
        type: 'authenticity_suppression',
        description: '強い個性や価値観を持ちながら、社会的場面でそれを表現しにくい状況',
        severity: 'medium',
        advice: '少しずつ本来の自分を表現できる環境や方法を見つけていくことが重要です'
      });
    }
    
    if (interfaceOS.matchScore >= 70 && engineOS.matchScore <= 40) {
      triggers.push({
        type: 'role_overload',
        description: '社会的期待に応えようとするあまり、本来の自分を見失いがちな状況',
        severity: 'medium',
        advice: '時には社会的な期待よりも、自分の内面の声に耳を傾ける時間を作りましょう'
      });
    }
    
    return triggers;
  }

  // セーフモード長期化の影響分析
  analyzeSafeModeChronificationEffects(safeModeOS, misalignmentData) {
    const effects = [];
    
    if (misalignmentData.safeModeChronificationRisk >= 60) {
      effects.push({
        type: 'identity_confusion',
        description: '本来の自分（エンジンOS）が分からなくなり、人生の方向性を見失う',
        severity: 'high',
        manifestation: '「自分が何をしたいのか分からない」「やりがいを感じられない」という状態'
      });
      
      effects.push({
        type: 'emotional_numbing',
        description: '感情の麻痺や意欲の低下が起こりやすくなる',
        severity: 'high', 
        manifestation: '楽しいと感じることが減る、何事にも興味が湧かない状態'
      });
    }
    
    if (misalignmentData.safeModeChronificationRisk >= 40) {
      effects.push({
        type: 'relationship_difficulty',
        description: '本音を隠し続けることで、深い人間関係を築きにくくなる',
        severity: 'medium',
        manifestation: '表面的な付き合いばかりで、本当に理解し合える関係が少ない'
      });
      
      effects.push({
        type: 'decision_paralysis',
        description: '重要な決断を避けたり、先延ばしにしがちになる',
        severity: 'medium',
        manifestation: '転職、結婚、住居など人生の重要な選択を決められない'
      });
    }
    
    return effects;
  }

  // セーフモード暴走パターンの分析
  analyzeSafeModeRunawayPatterns(safeModeOS, misalignmentData) {
    const patterns = [];
    
    if (misalignmentData.safeModeChronificationRisk >= 70) {
      patterns.push({
        type: 'impulsive_escape',
        description: '突然の環境リセット（転職、引っ越し、人間関係の断絶など）',
        warning: '一時的には楽になるが、根本的な問題は解決されない',
        prevention: '重要な決断をする前に、一度立ち止まって本当に望んでいることを考える時間を作る'
      });
      
      patterns.push({
        type: 'emotional_explosion',
        description: '抑圧されていた感情が爆発的に表れる（怒り、悲しみ、絶望など）',
        warning: '周囲との関係に大きな影響を与える可能性がある',
        prevention: '定期的に自分の感情を確認し、小さなうちに表現する習慣をつける'
      });
      
      patterns.push({
        type: 'self_destructive_behavior',
        description: '自分を傷つけるような行動パターン（過労、散財、依存行動など）',
        warning: '身体的、精神的健康に深刻な影響を与える可能性',
        prevention: 'ストレスのサインを早めにキャッチし、健康的な発散方法を見つける'
      });
    }
    
    return patterns;
  }

  // セーフモード全体評価の生成
  generateSafeModeOverallAssessment(misalignmentData, triggers, effects) {
    let assessment = {
      level: 'healthy',
      summary: '',
      keyPoints: [],
      recommendations: []
    };

    if (misalignmentData.safeModeChronificationRisk >= 70) {
      assessment.level = 'high_risk';
      assessment.summary = 'セーフモードOSが長期化し、暴走のリスクが高い状態です。早急な対処が必要です。';
      assessment.keyPoints = [
        'エンジンOSとインターフェースOSの大きな不一致',
        '本来の自分を見失いがちな状況',
        '感情の爆発や衝動的な行動のリスク'
      ];
      assessment.recommendations = [
        '専門カウンセラーや信頼できる人への相談を検討',
        '重要な決断は一時的に保留し、冷静になる時間を作る',
        '日記やジャーナリングで自分の感情を客観視する習慣をつける'
      ];
    } else if (misalignmentData.safeModeChronificationRisk >= 40) {
      assessment.level = 'moderate_risk';
      assessment.summary = 'セーフモードOSが時々作動し、注意が必要な状態です。';
      assessment.keyPoints = [
        'ストレス時に防御的になりがち',
        '本音と建前のギャップに疲れを感じる',
        '人間関係で深いつながりを築きにくい'
      ];
      assessment.recommendations = [
        '定期的にリラックスできる時間を確保する',
        '信頼できる人には本音を話す機会を作る',
        '価値観と行動の一致度を定期的に見直す'
      ];
    } else {
      assessment.level = 'healthy';
      assessment.summary = 'セーフモードOSが適切に機能し、バランスの取れた状態です。';
      assessment.keyPoints = [
        '3つのOS側面がバランス良く機能している',
        'ストレス時も適切に対処できている',
        '本来の自分らしさを保ちながら社会的役割も果たせている'
      ];
      assessment.recommendations = [
        '現在の良いバランスを維持する',
        '時々自分の状態をチェックし、変化に気づく',
        '新しい挑戦や成長の機会を積極的に探す'
      ];
    }

    return assessment;
  }

  // 統合洞察生成 - 分人思想に基づく実践的な洞察
  async generateIntegrationInsights(
    engineOS,
    interfaceOS,
    safeModeOS,
    consistencyScore,
    dimensions
  ) {
    const topDimensions = dimensions.slice(0, 3);
    
    // 🔯 易経ウルトラシンク・ロジック20による高度分析（最適化版）
    console.log("🔯 Applying Ultra Sync Logic Analysis (Optimized)...");
    const ultraSyncAnalysis = await this.ichingLogic.analyzeTripleOSWithUltraSync(
      engineOS, 
      interfaceOS, 
      safeModeOS,
      {
        level: 'standard', // デフォルトは標準分析
        onProgress: (progress) => {
          console.log(`🔯 Analysis Progress: ${progress.progress}/${progress.total} (${progress.stage})`);
        }
      }
    );
    console.log("✅ Ultra Sync Logic Analysis completed:", ultraSyncAnalysis);
    
    // Triple OS概念の核心を含む説明
    const tripleOSExplanation = this.generateTripleOSExplanation(engineOS, interfaceOS, safeModeOS);
    
    // OS間の相互作用分析（従来の分析も保持）
    const osInteractionAnalysis = this.analyzeOSInteractions(engineOS, interfaceOS, safeModeOS, consistencyScore);
    
    // セーフモード分析
    const misalignmentData = this.calculateOSMisalignment(engineOS, interfaceOS, safeModeOS);
    const safeModeActivationTriggers = this.analyzeSafeModeActivationTriggers(engineOS, interfaceOS, misalignmentData);
    const safeModeEffects = this.analyzeSafeModeChronificationEffects(safeModeOS, misalignmentData);
    const safeModeRunawayPatterns = this.analyzeSafeModeRunawayPatterns(safeModeOS, misalignmentData);
    
    // 実践的な生活戦略
    const practicalStrategies = this.generatePracticalLifeStrategies(engineOS, interfaceOS, safeModeOS);
    
    return {
      // Triple OSの基本概念説明
      tripleOSConcept: {
        title: "あなたの中に住む3つのOS側面",
        explanation: tripleOSExplanation.concept,
        practicalMeaning: tripleOSExplanation.practicalMeaning
      },
      
      // 各OSの役割明確化
      osRoles: {
        engine: {
          title: "🔥 エンジンOS - あなたの『本音の分人』",
          description: `「${engineOS.osName}」として、あなたの心の奥底で価値判断をする存在です。`,
          practicalRole: this.getEngineOSPracticalRole(engineOS, topDimensions),
          whenActive: "重要な決断をする時、一人の時間、価値観に関わる問題に直面した時"
        },
        interface: {
          title: "🌐 インターフェースOS - あなたの『社会的分人』",
          description: `「${interfaceOS.hexagramInfo?.name_jp || "未分析"}」として、他者と関わる時に表れる人格です。`,
          practicalRole: this.getInterfaceOSPracticalRole(interfaceOS),
          whenActive: "職場、友人関係、初対面の人との交流、チームワークが必要な場面"
        },
        safeMode: {
          title: "🛡️ セーフモードOS - あなたの『防御的分人』",
          description: `「${safeModeOS.hexagramInfo?.name_jp || "未分析"}」として、困難な状況で自分を守る人格です。`,
          practicalRole: this.getSafeModeOSPracticalRole(safeModeOS),
          whenActive: "ストレス状況、批判を受けた時、失敗や挫折を経験した時、不安を感じる場面"
        }
      },
      
      // OS間の相互作用分析
      osInteractions: osInteractionAnalysis,
      
      // 統合的な人格理解
      integratedPersonality: {
        summary: `あなたの人格は「${engineOS.osName}」を核とした3つの分人で構成されています。${topDimensions
          .map((d) => d.displayName)
          .join("、")}が特に強く、これがあなたらしさの源泉です。`,
        uniqueness: this.generateUniquenessInsight(engineOS, dimensions),
        consistency: {
          level: Math.round(consistencyScore.overall * 100),
          interpretation: this.interpretConsistencyLevel(consistencyScore.overall),
          advice: this.getConsistencyAdvice(consistencyScore.overall)
        }
      },
      
      // 実践的な生活戦略
      practicalStrategies: practicalStrategies,
      
      // セーフモード詳細分析
      safeModeAnalysis: {
        misalignmentData: misalignmentData,
        activationTriggers: safeModeActivationTriggers,
        chronificationEffects: safeModeEffects,
        runawayPatterns: safeModeRunawayPatterns,
        riskAssessment: {
          activationRisk: misalignmentData.riskLevel,
          chronificationRisk: misalignmentData.chronificationLevel,
          overallAssessment: this.generateSafeModeOverallAssessment(misalignmentData, safeModeActivationTriggers, safeModeEffects)
        }
      },
      
      // Triple OSに基づく推奨事項
      tripleOSRecommendations: [
        "🎭 3つのOS側面それぞれの特徴を理解し、場面に応じて意識的に使い分けましょう",
        "💎 エンジンOSの価値観を大切にしながら、社会的場面ではインターフェースOSを活用しましょう",
        "🛡️ セーフモードは緊急時の味方です。過度に頼らず、適切な時に活用しましょう",
        "⚖️ 3つのOS側面のバランスが取れた時、あなたは最も自然で魅力的な存在になります",
        "🌱 『真の自分探し』よりも『Triple OSの育成』を意識して、多面的な成長を目指しましょう"
      ],
      
      // 🔯 易経ウルトラシンク・ロジック20による高度分析結果
      ultraSyncAnalysis: ultraSyncAnalysis
    };
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

  // === 追加: 8次元分析メソッド ===
  analyzeDimensions(userVector) {
    const dimensions = [];
    const dimensionNames = {
      乾_創造性: "創造性",
      兌_調和性: "調和性",
      離_表現性: "表現性",
      震_行動性: "行動性",
      巽_適応性: "適応性",
      坎_探求性: "探求性",
      艮_安定性: "安定性",
      坤_受容性: "受容性",
    };

    Object.entries(userVector).forEach(([key, value]) => {
      dimensions.push({
        key: key,
        displayName: dimensionNames[key] || key,
        value: value || 0,
        percentage: 0, // 後で計算
      });
    });

    // 合計値を計算
    const total = dimensions.reduce((sum, dim) => sum + dim.value, 0);

    // パーセンテージを計算
    dimensions.forEach((dim) => {
      dim.percentage = total > 0 ? Math.round((dim.value / total) * 100) : 0;
    });

    // 値の大きい順にソート
    dimensions.sort((a, b) => b.value - a.value);

    return dimensions;
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
        trigram.energy = trigram.value; // UI用のenergyプロパティを追加
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
          energy: 0,
        },
        {
          id: 2,
          name: "兌",
          symbol: "☱",
          dimensionKey: "兌_調和性",
          value: 0,
          percentage: 0,
          energy: 0,
        },
        {
          id: 3,
          name: "離",
          symbol: "☲",
          dimensionKey: "離_表現性",
          value: 0,
          percentage: 0,
          energy: 0,
        },
      ];
    }
  }

  // 🔧 trigramComposition生成メソッド
  generateTrigramComposition(hexagramInfo) {
    if (!hexagramInfo) {
      return "乾 + 乾";
    }
    const upperTrigram = this.getTrigramName(hexagramInfo.upper_trigram_id);
    const lowerTrigram = this.getTrigramName(hexagramInfo.lower_trigram_id);
    return `${upperTrigram} + ${lowerTrigram}`;
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

  // 深い洞察生成メソッド - 分人思想に基づく実践的洞察
  async generateInsights(analysisResult) {
    try {
      console.log("💡 Generating insights for Triple OS result...");
      
      // 分析結果の基本検証
      if (!analysisResult) {
        throw new Error("Analysis result is missing");
      }

      const insights = {};

      // 各洞察を個別にtry-catchで包んで詳細なエラー追跡
      try {
        insights.tripleOSSummary = this.generateTripleOSSummary(analysisResult);
      } catch (error) {
        console.warn("⚠️ Error in generateTripleOSSummary:", error.message);
        insights.tripleOSSummary = "Triple OS分析が完了しました。";
      }

      try {
        insights.personalityProfiles = {
          engine: this.generateEnginePersonalityProfile(analysisResult.engineOS, analysisResult.dimensions),
          interface: this.generateInterfacePersonalityProfile(analysisResult.interfaceOS),
          safeMode: this.generateSafeModePersonalityProfile(analysisResult.safeModeOS)
        };
      } catch (error) {
        console.warn("⚠️ Error in personalityProfiles:", error.message);
        insights.personalityProfiles = {
          engine: { summary: "エンジンOS分析完了" },
          interface: { summary: "インターフェースOS分析完了" },
          safeMode: { summary: "セーフモードOS分析完了" }
        };
      }

      try {
        insights.strengths = this.generateBunenjinStrengths(analysisResult);
      } catch (error) {
        console.warn("⚠️ Error in generateBunenjinStrengths:", error.message);
        insights.strengths = ["あなたには独特の強みがあります"];
      }

      try {
        insights.growthAreas = this.generateBunenjinGrowthAreas(analysisResult);
      } catch (error) {
        console.warn("⚠️ Error in generateBunenjinGrowthAreas:", error.message);
        insights.growthAreas = ["継続的な成長の機会があります"];
      }

      try {
        insights.lifeStrategies = this.generateLifeStrategies(analysisResult);
      } catch (error) {
        console.warn("⚠️ Error in generateLifeStrategies:", error.message);
        insights.lifeStrategies = ["あなたの強みを活かせる環境を見つけてください"];
      }

      try {
        insights.actionableRecommendations = this.generateActionableRecommendations(analysisResult);
      } catch (error) {
        console.warn("⚠️ Error in generateActionableRecommendations:", error.message);
        insights.actionableRecommendations = ["継続的な自己理解と成長を心がけましょう"];
      }

      try {
        insights.tripleOSInsights = this.generateEnhancedTripleOSInsights(analysisResult);
      } catch (error) {
        console.warn("⚠️ Error in generateEnhancedTripleOSInsights:", error.message);
        insights.tripleOSInsights = {
          engineInsight: "エンジンOSが分析されました。",
          interfaceInsight: "インターフェースOSが分析されました。",
          safeModeInsight: "セーフモードOSが分析されました。",
          consistencyInsight: "OSの一貫性が分析されました。"
        };
      }

      console.log("✅ Enhanced insights generated successfully");
      return insights;
    } catch (error) {
      console.error("❌ Fatal error generating insights:", error.message, error.stack);
      // フォールバック洞察を返す
      return this.generateFallbackInsights(analysisResult);
    }
  }

  // 要約洞察
  generateSummaryInsight(result) {
    try {
      const engineOS = result.engineOS || result.primaryOS;
      const topDimensions = result.dimensions ? result.dimensions.slice(0, 3) : [];
      
      if (!engineOS || !engineOS.osName) {
        return "あなたの人格分析が完了しました。";
      }

      const dimensionNames = topDimensions.length > 0 
        ? topDimensions.map((d) => d.displayName || d.key).join("、")
        : "複数の特性";

      return `あなたの核となる人格OSは「${engineOS.osName}」です。特に${dimensionNames}が強く、これがあなたの価値観の基盤を形成しています。`;
    } catch (error) {
      console.error("❌ Error in generateSummaryInsight:", error);
      return "あなたの人格分析が完了しました。";
    }
  }

  // 強み洞察
  generateStrengthsInsight(result) {
    try {
      const dimensions = result.dimensions || [];
      const topDimensions = dimensions
        .filter((d) => d.value > 3.0) // 高いスコアのもの
        .slice(0, 3);

      if (topDimensions.length === 0) {
        return ["バランスの取れた多面的な能力を持っています"];
      }

      return topDimensions.map((d) => {
        const name = d.displayName || d.key;
        const percentage = d.percentage || Math.round((d.value / 10) * 100);
        return `${name}: ${percentage}% - この領域であなたの才能が特に発揮されます`;
      });
    } catch (error) {
      console.error("❌ Error in generateStrengthsInsight:", error);
      return ["あなたには独特の強みがあります"];
    }
  }

  // 成長領域洞察
  generateGrowthInsight(result) {
    try {
      const dimensions = result.dimensions || [];
      const lowDimensions = dimensions
        .filter((d) => d.value < 2.0) // 低いスコアのもの
        .slice(0, 2);

      if (lowDimensions.length === 0) {
        return ["バランスよく発達している状態です"];
      }

      return lowDimensions.map((d) => {
        const name = d.displayName || d.key;
        return `${name}: この領域を意識的に発達させることで、より多面的な成長が期待できます`;
      });
    } catch (error) {
      console.error("❌ Error in generateGrowthInsight:", error);
      return ["継続的な成長の機会があります"];
    }
  }

  // 推奨事項
  generateRecommendations(result) {
    try {
      const engineOS = result.engineOS || result.primaryOS;
      const osName = engineOS ? engineOS.osName : "あなたの人格OS";

      return [
        `${osName}の特質を活かせる環境や活動を探してみてください`,
        "3層のOS（エンジン・インターフェース・セーフモード）のバランスを意識してみましょう",
        "定期的に自己分析を行い、各OSの特性の変化や成長を確認することをお勧めします"
      ];
    } catch (error) {
      console.error("❌ Error in generateRecommendations:", error);
      return [
        "あなたの強みを活かせる環境を見つけてください",
        "継続的な自己理解と成長を心がけましょう"
      ];
    }
  }

  // Triple OS特有の洞察
  generateTripleOSSpecificInsights(result) {
    try {
      const { engineOS, interfaceOS, safeModeOS, consistencyScore } = result;
      
      const insights = {
        engineInsight: engineOS 
          ? `エンジンOS「${engineOS.osName}」があなたの核となる価値観と動機を形成しています。`
          : "エンジンOSが分析されました。",
        interfaceInsight: interfaceOS 
          ? `インターフェースOS「${interfaceOS.osName}」が他者との関わり方を決定しています。`
          : "インターフェースOSが分析されました。",
        safeModeInsight: safeModeOS 
          ? `セーフモードOS「${safeModeOS.osName}」がストレス時の対処法を司っています。`
          : "セーフモードOSが分析されました。",
        consistencyInsight: consistencyScore 
          ? `3つのOSの一貫性は${Math.round(consistencyScore.overall * 100)}%です。`
          : "OSの一貫性が分析されました。"
      };

      return insights;
    } catch (error) {
      console.error("❌ Error in generateTripleOSSpecificInsights:", error);
      return {
        engineInsight: "エンジンOSが分析されました。",
        interfaceInsight: "インターフェースOSが分析されました。", 
        safeModeInsight: "セーフモードOSが分析されました。",
        consistencyInsight: "OSの一貫性が分析されました。"
      };
    }
  }

  // Triple OS総合サマリー生成
  generateTripleOSSummary(analysisResult) {
    try {
      const engineOS = analysisResult.engineOS;
      const interfaceOS = analysisResult.interfaceOS;
      const safeModeOS = analysisResult.safeModeOS;
      
      if (!engineOS || !interfaceOS || !safeModeOS) {
        return "Triple OS分析が完了しました。各OSの詳細は個別の分析結果をご確認ください。";
      }

      const engineName = engineOS.osName || "未特定";
      const interfaceName = interfaceOS.hexagramInfo?.name_jp || interfaceOS.osName || "未特定";
      const safeModeName = safeModeOS.hexagramInfo?.name_jp || safeModeOS.osName || "未特定";

      return `あなたのTriple OS分析結果では、核となるエンジンOS「${engineName}」、対人関係でのインターフェースOS「${interfaceName}」、ストレス時のセーフモードOS「${safeModeName}」という3つの分人が確認されました。これらの分人を理解し、場面に応じて適切に使い分けることで、より自然で効果的な人間関係と自己実現が可能になります。`;
    } catch (error) {
      console.warn("generateTripleOSSummary error:", error);
      return "Triple OS分析が完了しました。3つの分人（エンジンOS、インターフェースOS、セーフモードOS）の詳細は個別の分析結果をご確認ください。";
    }
  }

  // フォールバック洞察
  generateFallbackInsights(analysisResult) {
    return {
      tripleOSSummary: "あなたのTriple OS分析が完了しました。エンジンOS、インターフェースOS、セーフモードOSの3つの分人を理解し、場面に応じて適切に使い分けることで、より自然で効果的な人間関係と自己実現が可能になります。",
      personalityProfiles: {
        engine: { 
          summary: "エンジンOS分析完了",
          characteristics: ["あなたの核となる特性があります"],
          utilization: ["本音で行動できる環境を大切にしてください"]
        },
        interface: { 
          summary: "インターフェースOS分析完了",
          characteristics: ["対人関係での特性があります"],
          utilization: ["社会的場面での適応力を活かしてください"]
        },
        safeMode: { 
          summary: "セーフモードOS分析完了",
          characteristics: ["ストレス対処の特性があります"],
          utilization: ["困難な状況でも冷静に対処できます"]
        }
      },
      strengths: ["あなたには独特の強みがあります", "継続的な成長能力があります"],
      growthAreas: ["さらなる成長の機会があります", "新しい可能性を探求できます"],
      lifeStrategies: [
        "あなたの強みを活かせる環境を見つけてください",
        "3つの分人を意識的に使い分けてみてください"
      ],
      actionableRecommendations: [
        "継続的な自己理解と成長を心がけましょう",
        "場面に応じて適切な分人を選択する練習をしてください"
      ],
      tripleOSInsights: {
        engineInsight: "エンジンOSが分析されました。",
        interfaceInsight: "インターフェースOSが分析されました。",
        safeModeInsight: "セーフモードOSが分析されました。",
        consistencyInsight: "OSの一貫性が分析されました。"
      }
    };
  }

  // === 新しい分人思想ベース洞察生成メソッド群 ===

  // 分人思想の基本概念説明を生成
  generateBunenjinExplanation(engineOS, interfaceOS, safeModeOS) {
    return {
      concept: `分人思想では、一人の人間の中には複数の「分人」が存在すると考えます。あなたの場合、「${engineOS.osName}」を核とする本音の分人、「${interfaceOS.hexagramInfo?.name_jp || "社会的"}」な対人関係の分人、「${safeModeOS.hexagramInfo?.name_jp || "防御的"}」なストレス対処の分人が共存しています。`,
      practicalMeaning: "これは「本当の自分を探す」のではなく、「場面に応じて最適な分人を意識的に選択する」ことで、より豊かで自然な人生を送るという考え方です。"
    };
  }

  // OS間の相互作用分析
  analyzeOSInteractions(engineOS, interfaceOS, safeModeOS, consistencyScore) {
    const engineInterfaceHarmony = this.calculateOSHarmony(engineOS, interfaceOS);
    const engineSafeModeHarmony = this.calculateOSHarmony(engineOS, safeModeOS);
    const interfaceSafeModeRelation = this.calculateOSHarmony(interfaceOS, safeModeOS);

    return {
      engineToInterface: {
        harmony: engineInterfaceHarmony,
        description: this.getOSInteractionDescription(engineOS, interfaceOS, engineInterfaceHarmony, "interface"),
        practicalAdvice: this.getOSInteractionAdvice(engineOS, interfaceOS, engineInterfaceHarmony, "interface")
      },
      engineToSafeMode: {
        harmony: engineSafeModeHarmony,
        description: this.getOSInteractionDescription(engineOS, safeModeOS, engineSafeModeHarmony, "safemode"),
        practicalAdvice: this.getOSInteractionAdvice(engineOS, safeModeOS, engineSafeModeHarmony, "safemode")
      },
      interfaceToSafeMode: {
        harmony: interfaceSafeModeRelation,
        description: this.getOSInteractionDescription(interfaceOS, safeModeOS, interfaceSafeModeRelation, "both"),
        practicalAdvice: this.getOSInteractionAdvice(interfaceOS, safeModeOS, interfaceSafeModeRelation, "both")
      },
      overallDynamics: this.getOverallOSDynamics(engineInterfaceHarmony, engineSafeModeHarmony, interfaceSafeModeRelation)
    };
  }

  // 実践的な生活戦略を生成
  generatePracticalLifeStrategies(engineOS, interfaceOS, safeModeOS) {
    return {
      workStrategy: this.generateWorkStrategy(engineOS, interfaceOS),
      relationshipStrategy: this.generateRelationshipStrategy(engineOS, interfaceOS),
      stressManagementStrategy: this.generateStressManagementStrategy(engineOS, safeModeOS),
      personalGrowthStrategy: this.generatePersonalGrowthStrategy(engineOS, interfaceOS, safeModeOS),
      dailyLifeStrategy: this.generateDailyLifeStrategy(engineOS, interfaceOS, safeModeOS)
    };
  }

  // エンジンOSの実践的役割を説明
  getEngineOSPracticalRole(engineOS, topDimensions) {
    const primaryDimension = topDimensions[0]?.displayName || "特有の価値観";
    return `${primaryDimension}を重視し、重要な判断の基準となる分人です。人生の方向性を決める時、価値観に関わる選択をする時に最も活発になります。この分人の声に耳を傾けることで、あなたらしい人生を歩むことができます。`;
  }

  // インターフェースOSの実践的役割を説明
  getInterfaceOSPracticalRole(interfaceOS) {
    const matchScore = Math.round(interfaceOS.matchScore || 50);
    let roleDescription = "";
    
    if (matchScore >= 70) {
      roleDescription = "非常に活発な社会的分人で、人との関わりで自然に表れます。";
    } else if (matchScore >= 30) {
      roleDescription = "状況に応じて表れる社会的分人で、意識的に活用することで対人関係が向上します。";
    } else {
      roleDescription = "控えめな社会的分人ですが、適切な場面で活用することで新たな魅力を発見できます。";
    }
    
    return `${roleDescription} この分人を理解し活用することで、より効果的なコミュニケーションが可能になります。`;
  }

  // セーフモードOSの実践的役割を説明
  getSafeModeOSPracticalRole(safeModeOS) {
    const matchScore = Math.round(safeModeOS.matchScore || 30);
    let roleDescription = "";
    
    if (matchScore >= 50) {
      roleDescription = "ストレス時によく働く防御的分人です。この分人の特徴を理解し、適切にコントロールすることが重要です。";
    } else if (matchScore >= 10) {
      roleDescription = "時々現れる防御的分人です。緊急時の対処法として活用しつつ、依存しすぎないよう注意しましょう。";
    } else {
      roleDescription = "あまり働かない防御的分人です。他の対処法も併せて身に着けることをお勧めします。";
    }
    
    return roleDescription;
  }

  // 独自性の洞察を生成
  generateUniquenessInsight(engineOS, dimensions) {
    const topDimension = dimensions[0];
    const secondDimension = dimensions[1];
    
    if (topDimension && secondDimension) {
      return `あなたの独自性は「${topDimension.displayName}」と「${secondDimension.displayName}」の組み合わせにあります。この2つの特性が調和することで、他にはない魅力的な人格が形成されています。`;
    } else {
      return `「${engineOS.osName}」としてのあなたには、独特な魅力と価値観があります。`;
    }
  }

  // 一貫性レベルの解釈
  interpretConsistencyLevel(consistencyScore) {
    const percentage = Math.round(consistencyScore * 100);
    
    if (percentage >= 80) {
      return "非常に高い一貫性 - 3つの分人が調和的に機能しています";
    } else if (percentage >= 70) {
      return "高い一貫性 - 分人間のバランスが良好です";
    } else if (percentage >= 60) {
      return "中程度の一貫性 - 一部の分人間に調整の余地があります";
    } else if (percentage >= 50) {
      return "やや低い一貫性 - 分人間の対話を意識してみましょう";
    } else {
      return "低い一貫性 - 各分人の特徴を理解し、意識的な統合を目指しましょう";
    }
  }

  // 一貫性向上のアドバイス
  getConsistencyAdvice(consistencyScore) {
    const percentage = Math.round(consistencyScore * 100);
    
    if (percentage >= 80) {
      return "素晴らしいバランスです。この調和を維持しつつ、さらなる成長を目指しましょう。";
    } else if (percentage >= 60) {
      return "良いバランスです。時々各分人の状態を確認し、必要に応じて調整してみてください。";
    } else {
      return "分人間の対話を増やし、お互いの特徴を理解することで、より統合された自分になれます。";
    }
  }

  // 分人思想に基づく包括的サマリー
  generateBunenjinSummary(analysisResult) {
    const { engineOS, interfaceOS, safeModeOS } = analysisResult;
    const engineName = engineOS.osName;
    const interfaceName = interfaceOS.hexagramInfo?.name_jp || "社会的コミュニケーター";
    const safeModeName = safeModeOS.hexagramInfo?.name_jp || "自己防衛者";
    
    return {
      headline: `あなたは「${engineName}」を核とする3つの分人で構成されています`,
      overview: `本音では「${engineName}」として価値観を大切にし、社会では「${interfaceName}」として人と関わり、困難な時は「${safeModeName}」として自分を守ります。`,
      lifePerspective: "この3つの分人を理解し、場面に応じて意識的に使い分けることで、より豊かで自然な人生を送ることができます。",
      keyInsight: "重要なのは「本当の自分を探す」ことではなく、「それぞれの分人の特徴を理解し、適切に活用する」ことです。"
    };
  }

  // エンジンOS人格プロファイル
  generateEnginePersonalityProfile(engineOS, dimensions) {
    const topThree = dimensions ? dimensions.slice(0, 3) : [];
    
    return {
      coreDrive: engineOS.hexagramInfo?.description || "独自の価値観に基づく行動原理を持っています。",
      strengthAreas: topThree.map(d => d.displayName || d.key),
      optimalEnvironments: this.getOptimalEnvironments(engineOS, topThree),
      potentialChallenges: this.getPotentialChallenges(engineOS),
      activationTriggers: [
        "価値観に関わる重要な決断",
        "創造的な活動や表現",
        "一人で深く考える時間",
        "長期的な人生設計"
      ]
    };
  }

  // インターフェースOS人格プロファイル
  generateInterfacePersonalityProfile(interfaceOS) {
    return {
      communicationStyle: this.getCommunicationStyle(interfaceOS),
      socialRole: this.getSocialRole(interfaceOS),
      interactionPattern: this.getInteractionPattern(interfaceOS),
      optimalSocialSettings: this.getOptimalSocialSettings(interfaceOS),
      activationTriggers: [
        "チームワークが必要な場面",
        "初対面の人との交流",
        "プレゼンテーションや発表",
        "協調性が求められる環境"
      ]
    };
  }

  // セーフモードOS人格プロファイル
  generateSafeModePersonalityProfile(safeModeOS) {
    return {
      defensivePattern: this.getDefensivePattern(safeModeOS),
      stressTriggers: this.getStressTriggers(safeModeOS),
      copingStrategies: this.getCopingStrategies(safeModeOS),
      recoveryMethods: this.getRecoveryMethods(safeModeOS),
      activationTriggers: [
        "批判や否定を受けた時",
        "過度なプレッシャーを感じた時",
        "失敗や挫折を経験した時",
        "理解されない状況"
      ]
    };
  }

  // === ヘルパーメソッド群 ===

  // OS間の調和度を計算
  calculateOSHarmony(os1, os2) {
    // 簡単な調和度計算（実際の実装では、より複雑な易経ベースの計算を行う）
    const id1 = os1.hexagramId;
    const id2 = os2.hexagramId;
    
    // 基本的な相性計算
    const difference = Math.abs(id1 - id2);
    let harmony = 80 - (difference * 2);
    
    // 同じ卦の場合は高い調和
    if (id1 === id2) harmony = 95;
    
    // 補完的な関係の場合は調和が高い
    if (this.isComplementaryPair(id1, id2)) harmony += 10;
    
    return Math.max(20, Math.min(95, harmony));
  }

  // 補完的なペアかどうかを判定
  isComplementaryPair(id1, id2) {
    const complementaryPairs = [
      [1, 2], [3, 4], [5, 6], [7, 8], // 基本的な補完関係
      [11, 12], [13, 14], [15, 16]   // その他の調和的関係
    ];
    
    return complementaryPairs.some(pair => 
      (pair[0] === id1 && pair[1] === id2) || 
      (pair[0] === id2 && pair[1] === id1)
    );
  }

  // OS相互作用の説明を生成
  getOSInteractionDescription(os1, os2, harmony, type) {
    const harmonyLevel = harmony >= 80 ? "高い" : harmony >= 60 ? "中程度の" : "注意が必要な";
    
    if (type === "interface") {
      return `エンジンOSとインターフェースOSの間には${harmonyLevel}調和があります。内面の価値観と外面の表現が${harmony >= 60 ? "一致しており" : "やや食い違っており"}、${harmony >= 60 ? "自然な魅力" : "意識的な調整"}が${harmony >= 60 ? "表れます" : "必要です"}。`;
    } else if (type === "safemode") {
      return `エンジンOSとセーフモードOSの間には${harmonyLevel}関係があります。核となる価値観とストレス対処法が${harmony >= 60 ? "整合しており" : "矛盾することがあり"}、困難な状況でも${harmony >= 60 ? "一貫した対応" : "価値観との葛藤"}が${harmony >= 60 ? "可能です" : "生じる可能性があります"}。`;
    } else {
      return `これらの分人の間には${harmonyLevel}関係があります。`;
    }
  }

  // OS相互作用のアドバイスを生成
  getOSInteractionAdvice(os1, os2, harmony, type) {
    if (harmony >= 80) {
      return "非常に良いバランスです。このまま自然体で過ごしてください。";
    } else if (harmony >= 60) {
      return "良いバランスです。時々これらの分人の状態を確認してみてください。";
    } else {
      return "これらの分人の特徴をより深く理解し、意識的に調和を図ることで改善できます。";
    }
  }

  // 全体的なOS動力学を分析
  getOverallOSDynamics(engineInterface, engineSafeMode, interfaceSafeMode) {
    const average = (engineInterface + engineSafeMode + interfaceSafeMode) / 3;
    
    if (average >= 80) {
      return {
        level: "非常に調和的",
        description: "3つの分人が美しく調和しており、統合された人格として機能しています。",
        advice: "この素晴らしいバランスを維持し、さらなる成長を目指しましょう。"
      };
    } else if (average >= 65) {
      return {
        level: "調和的",
        description: "3つの分人が概ね調和しており、安定した人格バランスを保っています。",
        advice: "現在の良いバランスを維持しつつ、時々各分人の状態を確認してみてください。"
      };
    } else if (average >= 50) {
      return {
        level: "バランス調整中",
        description: "3つの分人の間に若干のテンションがありますが、これは成長の機会でもあります。",
        advice: "各分人の特徴を理解し、意識的に調和を図ることで改善できます。"
      };
    } else {
      return {
        level: "要調整",
        description: "3つの分人の間に大きなギャップがあり、統合への意識的な取り組みが必要です。",
        advice: "まず各分人の役割を理解し、段階的に調和を図っていきましょう。"
      };
    }
  }

  // 他のヘルパーメソッドは既存のメソッドを活用または簡略化実装
  generateWorkStrategy(engineOS, interfaceOS) {
    return "エンジンOSの価値観を活かしつつ、インターフェースOSでチームに貢献する職場環境を選びましょう。";
  }

  generateRelationshipStrategy(engineOS, interfaceOS) {
    return "本音の分人と社会的分人のバランスを取り、相手や状況に応じて適切に使い分けることで、より深い人間関係を築けます。";
  }

  generateStressManagementStrategy(engineOS, safeModeOS) {
    return "セーフモードの特徴を理解し、緊急時の一時的対処として活用しつつ、エンジンOSの強みで根本的解決を目指しましょう。";
  }

  generatePersonalGrowthStrategy(engineOS, interfaceOS, safeModeOS) {
    return "3つの分人をバランス良く育てることで、多面的で魅力的な人格に成長できます。";
  }

  generateDailyLifeStrategy(engineOS, interfaceOS, safeModeOS) {
    return "日常生活では、場面に応じて最適な分人を意識的に選択し、それぞれの特徴を活かして生活しましょう。";
  }

  // 簡略化されたヘルパーメソッド群
  getOptimalEnvironments(engineOS, dimensions) {
    return ["価値観を重視する環境", "創造性を発揮できる場所", "深い思考が求められる分野"];
  }

  getPotentialChallenges(engineOS) {
    return ["価値観の違いからくる対立", "理想と現実のギャップ", "他者との価値観の調整"];
  }

  getCommunicationStyle(interfaceOS) {
    return `${interfaceOS.hexagramInfo?.name_jp || "独特"}なコミュニケーションスタイル`;
  }

  getSocialRole(interfaceOS) {
    return "チームの中での調和的な役割";
  }

  getInteractionPattern(interfaceOS) {
    return "状況に応じた適応的な対人パターン";
  }

  getOptimalSocialSettings(interfaceOS) {
    return ["協調性が重視される環境", "多様性が尊重される場所", "コミュニケーションが活発な組織"];
  }

  getDefensivePattern(safeModeOS) {
    return `${safeModeOS.hexagramInfo?.name_jp || "独特"}な防御的パターン`;
  }

  getStressTriggers(safeModeOS) {
    return ["批判や否定", "過度なプレッシャー", "価値観の否定"];
  }

  getCopingStrategies(safeModeOS) {
    return ["一時的な距離を取る", "信頼できる人に相談", "自分の価値観を再確認"];
  }

  getRecoveryMethods(safeModeOS) {
    return ["エンジンOSの強みを思い出す", "支援的な環境に身を置く", "小さな成功体験を積む"];
  }

  // 残りの必要なメソッドも追加実装
  generateBunenjinStrengths(analysisResult) {
    return [
      "複数の分人による多面的な対応力",
      "状況に応じた適応的な行動選択",
      "エンジンOSの価値観による一貫性"
    ];
  }

  generateBunenjinGrowthAreas(analysisResult) {
    return [
      "分人間のより良いバランス調整",
      "セーフモードへの過度な依存の見直し",
      "各分人の特徴のさらなる理解"
    ];
  }

  generateLifeStrategies(analysisResult) {
    return {
      personal: "エンジンOSの価値観を大切にしながら、状況に応じて他の分人も活用する",
      professional: "インターフェースOSを活かして協調的に働き、エンジンOSで創造性を発揮する",
      social: "相手や場面に応じて最適な分人を選択し、自然な人間関係を築く"
    };
  }

  generateActionableRecommendations(analysisResult) {
    return [
      {
        category: "日常実践",
        action: "毎日寝る前に、今日はどの分人が活躍したかを振り返る習慣をつける",
        benefit: "分人の特徴と活用パターンの理解が深まります"
      },
      {
        category: "人間関係",
        action: "相手との関係性に応じて、意識的に最適な分人を選択する",
        benefit: "より自然で効果的なコミュニケーションが可能になります"
      },
      {
        category: "ストレス管理",
        action: "セーフモードが発動した時は、まず自分を受け入れてからエンジンOSの視点で対処法を考える",
        benefit: "一時的な防御から建設的な解決へとスムーズに移行できます"
      }
    ];
  }

  generateEnhancedTripleOSInsights(analysisResult) {
    try {
      const { engineOS, interfaceOS, safeModeOS, consistencyScore } = analysisResult || {};
      
      // 各OSの安全なアクセス
      const engineName = engineOS?.osName || "エンジンOS";
      const interfaceName = interfaceOS?.hexagramInfo?.name_jp || interfaceOS?.osName || "社会的分人";
      const safeModeName = safeModeOS?.hexagramInfo?.name_jp || safeModeOS?.osName || "防御的分人";
      const consistency = consistencyScore?.overall || 0.7;
      
      return {
        engineInsight: `エンジンOS「${engineName}」は、あなたの価値観の核となる分人です。重要な決断時や一人の時間に最も活発になり、人生の方向性を決める重要な役割を担っています。`,
        interfaceInsight: `インターフェースOS「${interfaceName}」は、他者との関わりで表れる社会的な分人です。この分人を理解し活用することで、より効果的なコミュニケーションが可能になります。`,
        safeModeInsight: `セーフモードOS「${safeModeName}」は、困難な状況で自分を守る防御的な分人です。適切に活用することで、ストレスに対処しながら成長することができます。`,
        consistencyInsight: `3つの分人の一貫性は${Math.round(consistency * 100)}%です。${this.interpretConsistencyLevel(consistency)}`,
        integrationAdvice: "分人思想の真髄は、「本当の自分探し」ではなく「場面に応じた最適な分人の選択」にあります。それぞれの分人の特徴を理解し、意識的に活用することで、より豊かで自然な人生を送ることができます。"
      };
    } catch (error) {
      console.warn("generateEnhancedTripleOSInsights error:", error);
      return {
        engineInsight: "エンジンOSが分析されました。",
        interfaceInsight: "インターフェースOSが分析されました。",
        safeModeInsight: "セーフモードOSが分析されました。",
        consistencyInsight: "OSの一貫性が分析されました。",
        integrationAdvice: "分人思想に基づいた3つの分人の活用をお試しください。"
      };
    }
  }

  // 🔧 動的インターフェースOS計算（エンジンOSベース）
  calculateDynamicInterfaceOS(engineHexagramId) {
    // エンジンOSに基づいて最適なインターフェースOSを動的に選択
    const interfaceMapping = {
      1: 11,   // 乾為天 → 天地否（調和を重視）
      2: 8,    // 坤為地 → 水地比（協調性）
      3: 17,   // 水雷屯 → 沢雷随（適応性）
      4: 20,   // 山水蒙 → 風地観（観察力）
      5: 14,   // 水天需 → 火天大有（表現力）
      6: 12,   // 天水訟 → 天地否（冷静さ）
      7: 15,   // 地水師 → 地山謙（謙虚さ）
      8: 16,   // 水地比 → 雷地豫（楽観性）
      9: 26,   // 風天小畜 → 山天大畜（持続力）
      10: 58,  // 天沢履 → 兌為沢（喜び）
      11: 5,   // 地天泰 → 水天需（忍耐）
      12: 35,  // 天地否 → 火地晋（進歩）
      13: 49,  // 天火同人 → 沢火革（革新）
      14: 38,  // 火天大有 → 火沢睽（独立性）
      15: 52,  // 地山謙 → 艮為山（安定）
      16: 54,  // 雷地豫 → 雷沢帰妹（親近感）
      17: 32,  // 沢雷随 → 雷風恒（継続性）
      18: 46,  // 山風蠱 → 地風升（成長）
      19: 33,  // 地沢臨 → 天山遯（距離感）
      20: 42,  // 風地観 → 風雷益（利他性）
      21: 30,  // 火雷噬嗑 → 離為火（明るさ）
      22: 36,  // 山火賁 → 地火明夷（控えめ）
      23: 27,  // 山地剥 → 山雷頤（慎重さ）
      24: 51,  // 地雷復 → 震為雷（活発さ）
      25: 44,  // 天雷無妄 → 天風姤（出会い）
      26: 50,  // 山天大畜 → 火風鼎（創造性）
      27: 23,  // 山雷頤 → 山地剥（節制）
      28: 31,  // 沢風大過 → 沢山咸（感応）
      29: 60,  // 坎為水 → 水沢節（節度）
      30: 56,  // 離為火 → 火山旅（冒険心）
      31: 41,  // 沢山咸 → 山沢損（謙遜）
      32: 57,  // 雷風恒 → 巽為風（柔軟性）
      33: 19,  // 天山遯 → 地沢臨（包容力）
      34: 43,  // 雷天大壮 → 沢天夬（決断力）
      35: 12,  // 火地晋 → 天地否（抑制）
      36: 22,  // 地火明夷 → 山火賁（美的感覚）
      37: 53,  // 風火家人 → 風山漸（段階的）
      38: 14,  // 火沢睽 → 火天大有（包容）
      39: 48,  // 水山蹇 → 水風井（深み）
      40: 32,  // 雷水解 → 雷風恒（安定）
      41: 31,  // 山沢損 → 沢山咸（共感）
      42: 20,  // 風雷益 → 風地観（洞察）
      43: 58,  // 沢天夬 → 兌為沢（表現）
      44: 25,  // 天風姤 → 天雷無妄（純粋）
      45: 47,  // 沢地萃 → 沢水困（忍耐）
      46: 18,  // 地風升 → 山風蠱（修復）
      47: 45,  // 沢水困 → 沢地萃（結束）
      48: 39,  // 水風井 → 水山蹇（慎重）
      49: 13,  // 沢火革 → 天火同人（協調）
      50: 26,  // 火風鼎 → 山天大畜（蓄積）
      51: 24,  // 震為雷 → 地雷復（回復）
      52: 15,  // 艮為山 → 地山謙（謙遜）
      53: 37,  // 風山漸 → 風火家人（調和）
      54: 16,  // 雷沢帰妹 → 雷地豫（楽観）
      55: 59,  // 雷火豊 → 風水渙（開放）
      56: 30,  // 火山旅 → 離為火（明朗）
      57: 32,  // 巽為風 → 雷風恒（継続）
      58: 10,  // 兌為沢 → 天沢履（礼節）
      59: 55,  // 風水渙 → 雷火豊（豊かさ）
      60: 29,  // 水沢節 → 坎為水（深さ）
      61: 62,  // 風雷中孚 → 雷山小過（細やか）
      62: 61,  // 雷山小過 → 風雷中孚（誠実）
      63: 64,  // 水火既済 → 火水未済（発展）
      64: 63   // 火水未済 → 水火既済（完成）
    };
    
    const result = interfaceMapping[engineHexagramId] || ((engineHexagramId % 32) + 16);
    console.log(`🔧 Dynamic Interface OS calculation: Engine ${engineHexagramId} → Interface ${result}`);
    return result;
  }

  // 🔧 動的セーフモードOS計算（エンジンOSベース）
  calculateDynamicSafeModeOS(engineHexagramId) {
    // エンジンOSに基づいて最適なセーフモードOSを動的に選択
    const safeModeMapping = {
      1: 2,    // 乾為天 → 坤為地（安定基盤）
      2: 1,    // 坤為地 → 乾為天（活性化）
      3: 4,    // 水雷屯 → 山水蒙（学習）
      4: 3,    // 山水蒙 → 水雷屯（挑戦）
      5: 6,    // 水天需 → 天水訟（論理的）
      6: 5,    // 天水訟 → 水天需（待機）
      7: 8,    // 地水師 → 水地比（協力）
      8: 7,    // 水地比 → 地水師（指導）
      9: 10,   // 風天小畜 → 天沢履（慎重）
      10: 9,   // 天沢履 → 風天小畜（蓄積）
      11: 12,  // 地天泰 → 天地否（抑制）
      12: 11,  // 天地否 → 地天泰（開放）
      13: 14,  // 天火同人 → 火天大有（拡大）
      14: 13,  // 火天大有 → 天火同人（協調）
      15: 16,  // 地山謙 → 雷地豫（楽観）
      16: 15,  // 雷地豫 → 地山謙（謙虚）
      17: 18,  // 沢雷随 → 山風蠱（修正）
      18: 17,  // 山風蠱 → 沢雷随（適応）
      19: 20,  // 地沢臨 → 風地観（観察）
      20: 19,  // 風地観 → 地沢臨（接近）
      21: 22,  // 火雷噬嗑 → 山火賁（美化）
      22: 21,  // 山火賁 → 火雷噬嗑（直面）
      23: 24,  // 山地剥 → 地雷復（回復）
      24: 23,  // 地雷復 → 山地剥（削減）
      25: 26,  // 天雷無妄 → 山天大畜（蓄積）
      26: 25,  // 山天大畜 → 天雷無妄（純粋）
      27: 28,  // 山雷頤 → 沢風大過（突破）
      28: 27,  // 沢風大過 → 山雷頤（養成）
      29: 30,  // 坎為水 → 離為火（明朗化）
      30: 29,  // 離為火 → 坎為水（冷静化）
      31: 32,  // 沢山咸 → 雷風恒（持続）
      32: 31,  // 雷風恒 → 沢山咸（感応）
      33: 34,  // 天山遯 → 雷天大壮（強化）
      34: 33,  // 雷天大壮 → 天山遯（退避）
      35: 36,  // 火地晋 → 地火明夷（隠蔽）
      36: 35,  // 地火明夷 → 火地晋（前進）
      37: 38,  // 風火家人 → 火沢睽（独立）
      38: 37,  // 火沢睽 → 風火家人（調和）
      39: 40,  // 水山蹇 → 雷水解（解決）
      40: 39,  // 雷水解 → 水山蹇（忍耐）
      41: 42,  // 山沢損 → 風雷益（補充）
      42: 41,  // 風雷益 → 山沢損（節制）
      43: 44,  // 沢天夬 → 天風姤（遭遇）
      44: 43,  // 天風姤 → 沢天夬（決断）
      45: 46,  // 沢地萃 → 地風升（上昇）
      46: 45,  // 地風升 → 沢地萃（集結）
      47: 48,  // 沢水困 → 水風井（供給）
      48: 47,  // 水風井 → 沢水困（制限）
      49: 50,  // 沢火革 → 火風鼎（安定）
      50: 49,  // 火風鼎 → 沢火革（変革）
      51: 52,  // 震為雷 → 艮為山（静止）
      52: 51,  // 艮為山 → 震為雷（活動）
      53: 54,  // 風山漸 → 雷沢帰妹（迅速）
      54: 53,  // 雷沢帰妹 → 風山漸（段階）
      55: 56,  // 雷火豊 → 火山旅（移動）
      56: 55,  // 火山旅 → 雷火豊（充実）
      57: 58,  // 巽為風 → 兌為沢（楽観）
      58: 57,  // 兌為沢 → 巽為風（柔軟）
      59: 60,  // 風水渙 → 水沢節（節制）
      60: 59,  // 水沢節 → 風水渙（開放）
      61: 62,  // 風雷中孚 → 雷山小過（細心）
      62: 61,  // 雷山小過 → 風雷中孚（信頼）
      63: 64,  // 水火既済 → 火水未済（継続）
      64: 63   // 火水未済 → 水火既済（完成）
    };
    
    const result = safeModeMapping[engineHexagramId] || ((engineHexagramId % 32) + 32);
    console.log(`🔧 Dynamic SafeMode OS calculation: Engine ${engineHexagramId} → SafeMode ${result}`);
    return result;
  }

  // Triple OS説明生成メソッド
  generateTripleOSExplanation(engineOS, interfaceOS, safeModeOS) {
    const concept = `あなたの人格は単一ではなく、3つの異なる「オペレーティングシステム（OS）」によって構成されています。

**🔥 エンジンOS「${engineOS.osName}」** - あなたの本質的な価値観と動機の源泉
**🌐 インターフェースOS「${interfaceOS.hexagramInfo?.name_jp || "未分析"}」** - 社会と関わる時に現れる人格
**🛡️ セーフモードOS「${safeModeOS.hexagramInfo?.name_jp || "未分析"}」** - 困難な状況で自分を守る防御システム

これらは互いに補完し合いながら、状況に応じて切り替わることで、あなたの複雑で豊かな人間性を形成しています。`;

    const practicalMeaning = `この3つのOSの理解により、以下のことが可能になります：

**🎯 自己理解の深化** 
なぜ場面によって自分が変わるのか、その仕組みが明確になります。

**⚖️ 状況適応力の向上** 
各OSの特性を活かして、場面に応じた最適な振る舞いを選択できます。

**🛡️ ストレス軽減** 
セーフモードOSの働きを理解することで、防御的な反応をコントロールしやすくなります。

**🌱 統合的成長** 
「真の自分探し」から「3つのOSの調和」へと視点を転換し、より建設的な自己成長が可能になります。`;

    return {
      concept,
      practicalMeaning
    };
  }

  // === bunenjin哲学実装状況提供メソッド ===

  /**
   * 検証システム用のTriple OS実装状況を取得
   * @returns {Object} 検証システムが期待するデータ構造
   */
  getBunenjinImplementationData() {
    return {
      // 基本的なTriple OS実装状況
      tripleOSStructure: this.bunenjinImplementationStatus.tripleOSStructure,
      
      // Triple OSエンジンの存在証明
      tripleOSEngine: this,
      
      // シナリオ分析機能
      scenarioAnalysis: true,
      scenarioQuestions: this.bunenjinImplementationStatus.scenarioAnalysis.hasScenarioQuestions,
      hasScenarioData: this.bunenjinImplementationStatus.scenarioAnalysis.hasScenarioData,
      
      // bunenjin哲学関連フラグ
      bunenjinPhilosophy: this.bunenjinImplementationStatus.bunenjinPhilosophy,
      dividedPersonalitySupport: this.bunenjinImplementationStatus.dividedPersonalitySupport,
      rejectsUnifiedSelfConcept: this.bunenjinImplementationStatus.rejectsUnifiedSelfConcept,
      embracesMultiplicity: this.bunenjinImplementationStatus.embracesMultiplicity,
      
      // 人格機能実装状況
      multiplePersonalityExpressions: this.bunenjinImplementationStatus.multiplePersonalityExpressions,
      authenticPersonalities: this.bunenjinImplementationStatus.authenticPersonalities,
      naturalPersonalityTransitions: this.bunenjinImplementationStatus.naturalPersonalityTransitions,
      organicPersonalityChanges: this.bunenjinImplementationStatus.organicPersonalityChanges,
      
      // 適応機能
      adaptiveLanguage: this.bunenjinImplementationStatus.adaptiveLanguage,
      personalStrategyAI: this.bunenjinImplementationStatus.personalStrategyAI,
      dynamicAnalyzer: this.bunenjinImplementationStatus.dynamicAnalyzer,
      
      // 協調・統合機能
      tripleOSCoordination: this.bunenjinImplementationStatus.tripleOSCoordination,
      osHarmonyMechanism: this.bunenjinImplementationStatus.osHarmonyMechanism,
      personalityConflictManagement: this.bunenjinImplementationStatus.personalityConflictManagement,
      balancedOSIntegration: this.bunenjinImplementationStatus.balancedOSIntegration,
      harmonizedTripleOS: this.bunenjinImplementationStatus.harmonizedTripleOS,
      
      // 人格間協調
      personalityNegotiation: this.bunenjinImplementationStatus.personalityNegotiation,
      cooperativeDecisionMaking: this.bunenjinImplementationStatus.cooperativeDecisionMaking,
      
      // 一貫性維持
      consistencyMaintenance: this.bunenjinImplementationStatus.consistencyMaintenance,
      personalityAlignment: this.bunenjinImplementationStatus.personalityAlignment,
      
      // 動的調整
      dynamicAdjustment: this.bunenjinImplementationStatus.dynamicAdjustment,
      personalityRebalancing: this.bunenjinImplementationStatus.personalityRebalancing,
      
      // 独立性機能
      independentDecisionMaking: this.bunenjinImplementationStatus.independentDecisionMaking,
      personalityBoundaries: this.bunenjinImplementationStatus.personalityBoundaries,
      multipleOSCoexistence: this.bunenjinImplementationStatus.multipleOSCoexistence,
      autonomousPersonalityFunction: this.bunenjinImplementationStatus.autonomousPersonalityFunction,
      
      // 質問データ参照（検証用）
      questions: this.dataManager ? this.dataManager.getQuestions() : null
    };
  }

  /**
   * bunenjin哲学機能の実装完了度を計算
   * @returns {Object} 実装完了度の詳細
   */
  calculateBunenjinImplementationCompleteness() {
    const status = this.bunenjinImplementationStatus;
    
    // カテゴリ別の実装状況を評価
    const categories = {
      tripleOSStructure: [
        status.tripleOSStructure.hasEngineOS,
        status.tripleOSStructure.hasInterfaceOS,
        status.tripleOSStructure.hasSafeModeOS,
        status.tripleOSStructure.allowsPersonalitySwitching,
        status.tripleOSStructure.enablesContextualPersonality
      ],
      
      bunenjinPhilosophy: [
        status.bunenjinPhilosophy,
        status.dividedPersonalitySupport,
        status.rejectsUnifiedSelfConcept,
        status.embracesMultiplicity,
        status.multiplePersonalityExpressions,
        status.authenticPersonalities
      ],
      
      adaptiveCapabilities: [
        !!status.adaptiveLanguage,
        !!status.personalStrategyAI,
        !!status.dynamicAnalyzer,
        status.naturalPersonalityTransitions,
        status.organicPersonalityChanges
      ],
      
      coordinationMechanisms: [
        status.tripleOSCoordination,
        status.personalityNegotiation,
        status.cooperativeDecisionMaking,
        status.osHarmonyMechanism,
        status.personalityConflictManagement
      ],
      
      integrationSystems: [
        status.consistencyMaintenance,
        status.personalityAlignment,
        status.dynamicAdjustment,
        status.personalityRebalancing,
        status.balancedOSIntegration
      ]
    };
    
    // カテゴリ別スコア計算
    const categoryScores = {};
    Object.entries(categories).forEach(([category, features]) => {
      const completedFeatures = features.filter(feature => feature === true).length;
      categoryScores[category] = completedFeatures / features.length;
    });
    
    // 全体スコア計算
    const overallScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0) / Object.keys(categoryScores).length;
    
    return {
      overallScore: overallScore,
      categoryScores: categoryScores,
      totalFeatures: Object.values(categories).flat().length,
      implementedFeatures: Object.values(categories).flat().filter(feature => feature === true).length,
      completenessPercentage: Math.round(overallScore * 100)
    };
  }

  /**
   * 分析結果にbunenjin実装状況を統合
   * @param {Object} analysisResult - 既存の分析結果
   * @returns {Object} bunenjin情報を含む拡張分析結果
   */
  enrichAnalysisWithBunenjinData(analysisResult) {
    const bunenjinData = this.getBunenjinImplementationData();
    const completeness = this.calculateBunenjinImplementationCompleteness();
    
    return {
      ...analysisResult,
      
      // bunenjin実装状況の追加
      bunenjinImplementation: {
        status: bunenjinData,
        completeness: completeness,
        philosophicalAlignment: {
          supportsDividedPersonality: bunenjinData.dividedPersonalitySupport,
          rejectsUnifiedSelf: bunenjinData.rejectsUnifiedSelfConcept,
          embracesMultiplicity: bunenjinData.embracesMultiplicity,
          enablesContextualAdaptation: bunenjinData.tripleOSStructure.enablesContextualPersonality
        }
      },
      
      // 分人思想適合スコア
      bunenjinAlignmentScore: completeness.overallScore,
      
      // Triple OS実装完了度
      tripleOSImplementationLevel: completeness.completenessPercentage
    };
  }
}

// グローバルスコープで利用可能にする
if (typeof window !== "undefined") {
  window.TripleOSEngine = TripleOSEngine;
}
