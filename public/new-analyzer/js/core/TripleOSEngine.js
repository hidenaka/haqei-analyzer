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
        integration: this.generateIntegrationInsights(
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
      const candidates = this.calculator.analyzeOSCandidates(
        userVector,
        vectorsData
      );
      console.log("📊 candidates:", candidates);
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
      const bestMatch = filteredResults[0] || {
        hexagramId: null,
        score: 0,
        matches: [],
      };
      console.log(
        "🔍 DEBUG: bestMatch for Interface OS:",
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
      const bestMatch = filteredResults[0] || {
        hexagramId: null,
        score: 0,
        matches: [],
      };
      console.log(
        "🔍 DEBUG: SafeMode bestMatch:",
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
    console.log("🔍 DEBUG: LineKeywordMap keys count:", Object.keys(lineKeywordMap).length);
    console.log("🔍 DEBUG: LineKeywordMap keys sample:", Object.keys(lineKeywordMap).slice(0, 10));

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
              console.log(`🔍 DEBUG: Direct hexagram_id for tag "${tag}": ${hexagramId}`);
              
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

  // 統合洞察生成
  generateIntegrationInsights(
    engineOS,
    interfaceOS,
    safeModeOS,
    consistencyScore,
    dimensions
  ) {
    const topDimensions = dimensions.slice(0, 3);

    return {
      summary: `あなたの人格OSは「${engineOS.osName}」です。特に${topDimensions
        .map((d) => d.displayName)
        .join("、")}が強く、これがあなたの核となる価値観を形成しています。`,
      engineInsight: `エンジンOS「${engineOS.osName}」が核となる価値観を形成しています。`,
      interfaceInsight: `インターフェースOS「${
        interfaceOS.hexagramInfo?.name_jp || "未分析"
      }」が外面的な行動パターンを決定しています。`,
      safeModeInsight: `セーフモードOS「${
        safeModeOS.hexagramInfo?.name_jp || "未分析"
      }」が内面的な防御機制として働いています。`,
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
}

// グローバルスコープで利用可能にする
if (typeof window !== "undefined") {
  window.TripleOSEngine = TripleOSEngine;
}
