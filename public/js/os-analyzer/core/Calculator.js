// Calculator.js - 計算・分析ロジック用クラス（雛形）
// HaQei Analyzer - 8D Calculation Engine
class Calculator {
  constructor() {
    this.dimensionKeys = [
      "乾_創造性",
      "震_行動性",
      "坎_探求性",
      "艮_安定性",
      "坤_受容性",
      "巽_適応性",
      "離_表現性",
      "兌_調和性",
    ];
  }

  // ユーザー回答から8次元ベクトルを構築（易経深化ロジック統合版）
  buildUserVector(answers) {
    const userVector = {};
    // 8次元を初期化
    this.dimensionKeys.forEach((key) => {
      userVector[key] = 0;
    });
    // answersが配列でない場合のハンドリング
    if (!Array.isArray(answers)) {
      console.warn("⚠️ buildUserVector: answers is not an array");
      return userVector;
    }

    // 回答からスコアを加算（易経深化ロジック適用）
    answers.forEach((answer) => {
      if (answer && answer.scoring_tags && Array.isArray(answer.scoring_tags)) {
        // 基本スコアリング
        answer.scoring_tags.forEach((tag) => {
          if (
            tag &&
            typeof tag.key === "string" &&
            typeof tag.value === "number"
          ) {
            if (Object.prototype.hasOwnProperty.call(userVector, tag.key)) {
              userVector[tag.key] += tag.value;
            }
          }
        });

        // 易経深化ロジック適用
        this.applyIChingDeepLogic(answer, userVector);
      }
    });

    console.log("📊 Built user vector with I-Ching logic:", userVector);
    return userVector;
  }

  // 易経深化ロジック適用
  applyIChingDeepLogic(answer, userVector) {
    if (!answer.scoring_tags || !window.OPPOSING_RELATIONSHIPS) return;

    answer.scoring_tags.forEach((tag) => {
      if (!tag || !tag.key || typeof tag.value !== "number") return;

      // 対立関係の処理
      if (tag.type === "conflicting" && window.OPPOSING_RELATIONSHIPS[tag.key]) {
        const opposingDimension = window.OPPOSING_RELATIONSHIPS[tag.key];
        if (userVector.hasOwnProperty(opposingDimension)) {
          const opposingEffect = window.calculateOpposingEffect ? 
            window.calculateOpposingEffect(Math.abs(tag.value), opposingDimension) :
            Math.abs(tag.value) * -0.3;
          userVector[opposingDimension] += opposingEffect;
          console.log(`🔯 Opposing effect: ${tag.key} affects ${opposingDimension} by ${opposingEffect}`);
        }
      }

      // 補完関係の処理
      if (tag.type === "complementary" && window.COMPLEMENTARY_RELATIONSHIPS) {
        const harmony = window.COMPLEMENTARY_RELATIONSHIPS.yin_yang_harmony;
        if (harmony && harmony[tag.key]) {
          const complementaryDimension = harmony[tag.key];
          if (userVector.hasOwnProperty(complementaryDimension)) {
            const complementaryEffect = window.calculateComplementaryEffect ? 
              window.calculateComplementaryEffect(Math.abs(tag.value), complementaryDimension) :
              Math.abs(tag.value) * 0.2;
            userVector[complementaryDimension] += complementaryEffect;
            console.log(`🔯 Complementary effect: ${tag.key} enhances ${complementaryDimension} by ${complementaryEffect}`);
          }
        }
      }

      // 爻辞レベルによる修正
      if (answer.koui_level && window.KOUI_LEVELS) {
        const kouiInfo = window.KOUI_LEVELS[answer.koui_level];
        if (kouiInfo) {
          // 爻辞レベルに基づく係数調整
          const kouiMultiplier = this.getKouiMultiplier(answer.koui_level);
          if (userVector.hasOwnProperty(tag.key)) {
            const originalValue = userVector[tag.key];
            const adjustment = tag.value * (kouiMultiplier - 1.0);
            userVector[tag.key] += adjustment;
            console.log(`🔯 Koui level ${answer.koui_level} adjustment: ${tag.key} ${originalValue} → ${userVector[tag.key]}`);
          }
        }
      }
    });
  }

  // 爻辞レベルに基づく係数取得
  getKouiMultiplier(kouiLevel) {
    // 易経の爻の特性に基づく係数
    const multipliers = {
      1: 0.9,  // 初爻：慎重、控えめな効果
      2: 1.1,  // 二爻：協力的、バランス良い効果  
      3: 0.8,  // 三爻：危険段階、効果減少
      4: 1.2,  // 四爻：責任段階、効果増大
      5: 1.3,  // 五爻：統率段階、最大効果
      6: 1.0   // 上爻：完成段階、標準効果
    };
    return multipliers[kouiLevel] || 1.0;
  }

  // ========== 六爻位置的意味システム ==========

  /**
   * 六爻の位置的意味を取得
   * @param {number} position - 爻位（1-6）
   * @returns {Object} 爻位の詳細情報
   */
  getLinePositionMeaning(position) {
    const linePositions = {
      1: { // 初爻
        name: "初爻",
        meaning: "始まり・基礎・潜伏期",
        character: "潜龍勿用",
        socialPosition: "庶民・初心者",
        advice: "慎重に準備し、時機を待つ",
        yinYangPreference: "陽爻が正位",
        stage: "準備段階",
        keyword: "慎重"
      },
      2: { // 二爻
        name: "二爻",
        meaning: "発展・臣位・行動期",
        character: "見龍在田",
        socialPosition: "臣下・補佐役",
        advice: "協力と連携を重視する",
        yinYangPreference: "陰爻が正位",
        stage: "実践段階",
        keyword: "協力"
      },
      3: { // 三爻
        name: "三爻",
        meaning: "転換・進退・困難期",
        character: "君子終日乾乾",
        socialPosition: "中間管理職",
        advice: "注意深く判断し、過度な行動は慎む",
        yinYangPreference: "陽爻が正位",
        stage: "試練段階",
        keyword: "注意"
      },
      4: { // 四爻
        name: "四爻",
        meaning: "進展・近臣・責任期",
        character: "或躍在淵",
        socialPosition: "側近・重臣",
        advice: "責任を持ってリーダーを支える",
        yinYangPreference: "陰爻が正位",
        stage: "責任段階",
        keyword: "支援"
      },
      5: { // 五爻
        name: "五爻",
        meaning: "成熟・君位・統率期",
        character: "飛龍在天",
        socialPosition: "君主・リーダー",
        advice: "高い徳性と決断力で導く",
        yinYangPreference: "陽爻が正位",
        stage: "統率段階",
        keyword: "指導"
      },
      6: { // 上爻
        name: "上爻",
        meaning: "完成・退隠・変化期",
        character: "亢龍有悔",
        socialPosition: "長老・賢者",
        advice: "謙虚さを保ち、次世代に道を譲る",
        yinYangPreference: "陰爻が正位",
        stage: "完成段階",
        keyword: "謙虚"
      }
    };

    return linePositions[position] || null;
  }

  /**
   * 爻の相互関係を分析
   * @param {Array} hexagramLines - 六爻の配列（0=陰爻、1=陽爻）
   * @returns {Object} 相互関係の分析結果
   */
  analyzeLineRelationships(hexagramLines) {
    if (!Array.isArray(hexagramLines) || hexagramLines.length !== 6) {
      console.warn("⚠️ Invalid hexagram lines for relationship analysis");
      return { error: "Invalid hexagram lines" };
    }

    const relationships = {
      correspondence: this.analyzeCorrespondence(hexagramLines),
      adjacency: this.analyzeAdjacency(hexagramLines),
      centrality: this.analyzeCentrality(hexagramLines),
      correctness: this.analyzeCorrectness(hexagramLines)
    };

    return relationships;
  }

  /**
   * 応の関係（初応四、二応五、三応上）を分析
   * @param {Array} lines - 六爻の配列
   * @returns {Array} 応の関係の分析結果
   */
  analyzeCorrespondence(lines) {
    const correspondencePairs = [
      { positions: [1, 4], names: ["初爻", "四爻"] },
      { positions: [2, 5], names: ["二爻", "五爻"] },
      { positions: [3, 6], names: ["三爻", "上爻"] }
    ];

    return correspondencePairs.map(pair => {
      const pos1 = pair.positions[0] - 1; // 配列インデックス
      const pos2 = pair.positions[1] - 1;
      const line1 = lines[pos1];
      const line2 = lines[pos2];
      
      const isCorresponding = line1 !== line2; // 陰陽が異なる場合は応
      const relationship = isCorresponding ? "応" : "敵";
      
      return {
        positions: pair.positions,
        names: pair.names,
        lines: [line1, line2],
        relationship: relationship,
        meaning: this.getCorrespondenceMeaning(pair.positions, relationship)
      };
    });
  }

  /**
   * 比の関係（隣接爻位）を分析
   * @param {Array} lines - 六爻の配列
   * @returns {Array} 比の関係の分析結果
   */
  analyzeAdjacency(lines) {
    const adjacentPairs = [
      { positions: [1, 2], names: ["初爻", "二爻"] },
      { positions: [2, 3], names: ["二爻", "三爻"] },
      { positions: [3, 4], names: ["三爻", "四爻"] },
      { positions: [4, 5], names: ["四爻", "五爻"] },
      { positions: [5, 6], names: ["五爻", "上爻"] }
    ];

    return adjacentPairs.map(pair => {
      const pos1 = pair.positions[0] - 1;
      const pos2 = pair.positions[1] - 1;
      const line1 = lines[pos1];
      const line2 = lines[pos2];
      
      const isComplementary = line1 !== line2; // 陰陽が異なる場合は相補的
      const relationship = isComplementary ? "相補比" : "同気比";
      
      return {
        positions: pair.positions,
        names: pair.names,
        lines: [line1, line2],
        relationship: relationship,
        meaning: this.getAdjacencyMeaning(pair.positions, relationship)
      };
    });
  }

  /**
   * 中の位（二爻・五爻）を分析
   * @param {Array} lines - 六爻の配列
   * @returns {Object} 中正の分析結果
   */
  analyzeCentrality(lines) {
    return {
      lowerCentral: {
        position: 2,
        name: "二爻",
        line: lines[1],
        isCorrectPosition: lines[1] === 0, // 陰爻が正位
        meaning: "下卦の中心、協調性を表す"
      },
      upperCentral: {
        position: 5,
        name: "五爻",
        line: lines[4],
        isCorrectPosition: lines[4] === 1, // 陽爻が正位
        meaning: "上卦の中心、指導性を表す"
      }
    };
  }

  /**
   * 正位（奇数位に陽爻、偶数位に陰爻）を分析
   * @param {Array} lines - 六爻の配列
   * @returns {Array} 正位の分析結果
   */
  analyzeCorrectness(lines) {
    return lines.map((line, index) => {
      const position = index + 1;
      const isOddPosition = position % 2 === 1;
      const isCorrectPosition = (isOddPosition && line === 1) || (!isOddPosition && line === 0);
      
      return {
        position: position,
        line: line,
        isCorrectPosition: isCorrectPosition,
        expectedLine: isOddPosition ? 1 : 0,
        positionType: isOddPosition ? "陽位" : "陰位",
        status: isCorrectPosition ? "正位" : "不正位"
      };
    });
  }

  /**
   * 応の関係の意味を取得
   * @param {Array} positions - 爻位の配列
   * @param {string} relationship - 関係性
   * @returns {string} 意味の説明
   */
  getCorrespondenceMeaning(positions, relationship) {
    const meanings = {
      "1,4": {
        "応": "基礎と責任の調和。初心者とリーダーの良い関係",
        "敵": "基礎と責任の対立。方向性の不一致"
      },
      "2,5": {
        "応": "臣と君の理想的関係。協力と指導のバランス",
        "敵": "臣と君の対立。権力争いや不信"
      },
      "3,6": {
        "応": "困難と智慧の結合。試練を智慧で乗り越える",
        "敵": "困難と智慧の分離。混乱と迷い"
      }
    };
    
    const key = positions.join(",");
    return meanings[key]?.[relationship] || "一般的な応の関係";
  }

  /**
   * 比の関係の意味を取得
   * @param {Array} positions - 爻位の配列
   * @param {string} relationship - 関係性
   * @returns {string} 意味の説明
   */
  getAdjacencyMeaning(positions, relationship) {
    const meanings = {
      "相補比": "隣接する陰陽が互いを補完し合う良い関係",
      "同気比": "同じ性質の爻が並び、協力または競合する関係"
    };
    
    return meanings[relationship] || "一般的な比の関係";
  }

  /**
   * 爻辞レベル適用の精度を向上させるメソッド
   * @param {Array} hexagramLines - 六爻の配列
   * @param {Object} userVector - ユーザーベクター
   * @returns {Object} 爻辞レベル適用結果
   */
  applyLineApplicationAccuracy(hexagramLines, userVector) {
    if (!Array.isArray(hexagramLines) || hexagramLines.length !== 6) {
      console.warn("⚠️ Invalid hexagram lines for line application");
      return { error: "Invalid hexagram lines" };
    }

    const lineAnalysis = this.analyzeLineRelationships(hexagramLines);
    const enhancedVector = { ...userVector };

    // 1. 爻位の位置的意味に基づく調整
    hexagramLines.forEach((line, index) => {
      const position = index + 1;
      const lineInfo = this.getLinePositionMeaning(position);
      
      if (lineInfo) {
        const adjustmentFactor = this.calculateLineAdjustmentFactor(position, line, lineInfo);
        
        // 各次元に爻位の特性を反映
        this.dimensionKeys.forEach(key => {
          const positionInfluence = this.getPositionInfluenceOnDimension(position, key);
          enhancedVector[key] += (enhancedVector[key] || 0) * adjustmentFactor * positionInfluence;
        });

        console.log(`🔯 Line ${position} (${lineInfo.name}) adjustment applied: factor=${adjustmentFactor.toFixed(3)}`);
      }
    });

    // 2. 応の関係に基づく調整
    if (lineAnalysis.correspondence) {
      lineAnalysis.correspondence.forEach(corr => {
        if (corr.relationship === "応") {
          const harmonicBonus = this.calculateHarmonicBonus(corr);
          this.dimensionKeys.forEach(key => {
            enhancedVector[key] += harmonicBonus;
          });
          console.log(`🔯 Correspondence harmony bonus applied: ${harmonicBonus.toFixed(3)}`);
        }
      });
    }

    // 3. 中正に基づる調整
    if (lineAnalysis.centrality) {
      const centralityBonus = this.calculateCentralityBonus(lineAnalysis.centrality);
      this.dimensionKeys.forEach(key => {
        enhancedVector[key] += centralityBonus;
      });
      console.log(`🔯 Centrality bonus applied: ${centralityBonus.toFixed(3)}`);
    }

    return {
      enhancedVector: enhancedVector,
      lineAnalysis: lineAnalysis,
      adjustments: {
        positionAdjustments: true,
        correspondenceAdjustments: true,
        centralityAdjustments: true
      }
    };
  }

  /**
   * 爻位の調整係数を計算
   * @param {number} position - 爻位
   * @param {number} line - 爻の値（0=陰、1=陽）
   * @param {Object} lineInfo - 爻位情報
   * @returns {number} 調整係数
   */
  calculateLineAdjustmentFactor(position, line, lineInfo) {
    // 正位かどうかによる基本調整
    const isOddPosition = position % 2 === 1;
    const isCorrectPosition = (isOddPosition && line === 1) || (!isOddPosition && line === 0);
    
    let baseFactor = isCorrectPosition ? 1.1 : 0.9; // 正位は1.1倍、不正位は0.9倍

    // 爻位の重要度による調整
    const importanceFactors = {
      2: 1.2, // 二爻（下卦の中）
      5: 1.3, // 五爻（上卦の中、君位）
      1: 1.0, // 初爻
      3: 0.9, // 三爻（困難の位）
      4: 1.1, // 四爻
      6: 1.0  // 上爻
    };

    return baseFactor * (importanceFactors[position] || 1.0);
  }

  /**
   * 爻位が各次元に与える影響度を計算
   * @param {number} position - 爻位
   * @param {string} dimensionKey - 次元キー
   * @returns {number} 影響度（0.0-1.0）
   */
  getPositionInfluenceOnDimension(position, dimensionKey) {
    // 爻位と八卦次元の相関関係マップ
    const influences = {
      1: { // 初爻 - 基礎・慎重
        "艮_安定性": 0.3,
        "坤_受容性": 0.2,
        "坎_探求性": 0.1,
        "震_行動性": 0.05,
        "乾_創造性": 0.1,
        "巽_適応性": 0.1,
        "離_表現性": 0.05,
        "兌_調和性": 0.1
      },
      2: { // 二爻 - 協力・実践
        "坤_受容性": 0.3,
        "兌_調和性": 0.25,
        "巽_適応性": 0.2,
        "坎_探求性": 0.1,
        "艮_安定性": 0.1,
        "離_表現性": 0.05,
        "震_行動性": 0.05,
        "乾_創造性": 0.05
      },
      3: { // 三爻 - 困難・注意
        "坎_探求性": 0.3,
        "震_行動性": 0.2,
        "離_表現性": 0.15,
        "艮_安定性": 0.1,
        "巽_適応性": 0.1,
        "乾_創造性": 0.1,
        "坤_受容性": 0.03,
        "兌_調和性": 0.02
      },
      4: { // 四爻 - 責任・支援
        "巽_適応性": 0.3,
        "坤_受容性": 0.25,
        "兌_調和性": 0.2,
        "離_表現性": 0.1,
        "艮_安定性": 0.1,
        "坎_探求性": 0.03,
        "震_行動性": 0.01,
        "乾_創造性": 0.01
      },
      5: { // 五爻 - 指導・統率
        "乾_創造性": 0.35,
        "離_表現性": 0.25,
        "震_行動性": 0.2,
        "坎_探求性": 0.1,
        "兌_調和性": 0.05,
        "巽_適応性": 0.03,
        "艮_安定性": 0.01,
        "坤_受容性": 0.01
      },
      6: { // 上爻 - 完成・謙虚
        "艮_安定性": 0.3,
        "坤_受容性": 0.25,
        "兌_調和性": 0.2,
        "巽_適応性": 0.1,
        "離_表現性": 0.08,
        "坎_探求性": 0.05,
        "震_行動性": 0.01,
        "乾_創造性": 0.01
      }
    };

    return influences[position]?.[dimensionKey] || 0.1;
  }

  /**
   * 応の関係による調和ボーナスを計算
   * @param {Object} correspondence - 応の関係情報
   * @returns {number} 調和ボーナス
   */
  calculateHarmonicBonus(correspondence) {
    // 応の関係によるボーナスは関係の重要度によって変化
    const bonusMap = {
      "1,4": 0.05, // 初応四
      "2,5": 0.08, // 二応五（最重要）
      "3,6": 0.06  // 三応上
    };
    
    const key = correspondence.positions.join(",");
    return bonusMap[key] || 0.05;
  }

  /**
   * 中正による調整ボーナスを計算
   * @param {Object} centrality - 中正情報
   * @returns {number} 中正ボーナス
   */
  calculateCentralityBonus(centrality) {
    let bonus = 0;
    
    // 二爻が正位（陰爻）の場合
    if (centrality.lowerCentral.isCorrectPosition) {
      bonus += 0.03;
    }
    
    // 五爻が正位（陽爻）の場合
    if (centrality.upperCentral.isCorrectPosition) {
      bonus += 0.05; // 五爻の方が重要
    }
    
    return bonus;
  }

  // シナリオ回答から8次元ベクトルを構築（状況卦修正適用）
  buildScenarioVector(scenarioAnswers, vectorType = "interface") {
    const scenarioVector = {};
    // 8次元を初期化
    this.dimensionKeys.forEach((key) => {
      scenarioVector[key] = 0;
    });

    if (!Array.isArray(scenarioAnswers)) {
      console.warn("⚠️ buildScenarioVector: scenarioAnswers is not an array");
      return scenarioVector;
    }

    // シナリオ回答からスコアを加算
    scenarioAnswers.forEach((answer) => {
      if (!answer || !answer.questionId) return;

      // 質問IDから状況卦を取得
      const questionId = answer.questionId;
      const situationHexagram = this.getSituationHexagramByQuestionId(questionId);

      // 内面・外面選択肢を処理
      const choices = vectorType === "interface" ? 
        (answer.outerChoice ? [answer.outerChoice] : []) :
        (answer.innerChoice ? [answer.innerChoice] : []);

      choices.forEach((choice) => {
        if (choice && choice.scoring_tags && Array.isArray(choice.scoring_tags)) {
          choice.scoring_tags.forEach((tag) => {
            if (tag && typeof tag.key === "string" && typeof tag.value === "number") {
              if (Object.prototype.hasOwnProperty.call(scenarioVector, tag.key)) {
                let adjustedValue = tag.value;

                // 状況卦による修正適用
                if (situationHexagram && window.getSituationalModifier) {
                  const modifier = window.getSituationalModifier(situationHexagram, tag.key);
                  adjustedValue = tag.value * modifier;
                  console.log(`🔯 Situational modifier for ${questionId} (${situationHexagram}): ${tag.key} ${tag.value} → ${adjustedValue}`);
                }

                scenarioVector[tag.key] += adjustedValue;
              }
            }
          });

          // 易経深化ロジック適用
          this.applyIChingDeepLogic(choice, scenarioVector);
        }
      });
    });

    console.log(`📊 Built ${vectorType} scenario vector:`, scenarioVector);
    return scenarioVector;
  }

  // 質問IDから状況卦を取得
  getSituationHexagramByQuestionId(questionId) {
    if (!window.SITUATIONAL_HEXAGRAMS) return null;
    
    const hexagramData = window.SITUATIONAL_HEXAGRAMS[questionId];
    return hexagramData ? hexagramData.name : null;
  }

  // 8次元ベクトル正規化
  normalizeVectors(userVector, osVector) {
    const normalizedUser = {};
    const normalizedOS = {};

    this.dimensionKeys.forEach((key) => {
      normalizedUser[key] = userVector[key] || 0;
      normalizedOS[key] = osVector[key] || 0;
    });

    return { normalizedUser, normalizedOS };
  }

  // コサイン類似度計算
  calculateCosineSimilarity(vectorA, vectorB) {
    const { normalizedUser: vecA, normalizedOS: vecB } = this.normalizeVectors(
      vectorA,
      vectorB
    );

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    Object.keys(vecA).forEach((key) => {
      dotProduct += vecA[key] * vecB[key];
      magnitudeA += vecA[key] * vecA[key];
      magnitudeB += vecB[key] * vecB[key];
    });

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) return 0;

    return dotProduct / (magnitudeA * magnitudeB);
  }

  // H64_8D_VECTORSのオブジェクト形式を配列に変換
  convertToVectorArray(hexagramData) {
    // 引数が不正な場合は全て0の配列を返す
    if (!hexagramData || typeof hexagramData !== "object") {
      console.warn("⚠️ Invalid hexagramData, returning zero vector array");
      return [0, 0, 0, 0, 0, 0, 0, 0];
    }
    return this.dimensionKeys.map((key) => hexagramData[key] ?? 0);
  }

  // 配列形式のコサイン類似度
  calculateCosineSimilarityArray(vectorA, vectorB) {
    if (
      !Array.isArray(vectorA) ||
      !Array.isArray(vectorB) ||
      vectorA.length !== 8 ||
      vectorB.length !== 8
    ) {
      console.warn("⚠️ Invalid input vectors for cosine similarity (array)");
      return 0;
    }
    const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
    const magnitudeA = Math.sqrt(
      vectorA.reduce((sum, val) => sum + val * val, 0)
    );
    const magnitudeB = Math.sqrt(
      vectorB.reduce((sum, val) => sum + val * val, 0)
    );
    if (magnitudeA === 0 || magnitudeB === 0) {
      console.warn("⚠️ Zero magnitude in cosine similarity (array)");
      return 0;
    }
    return dotProduct / (magnitudeA * magnitudeB);
  }

  // マグニチュード活性化スコア計算
  calculateActivationScore(vectorA, vectorB) {
    const { normalizedUser: vecA, normalizedOS: vecB } = this.normalizeVectors(
      vectorA,
      vectorB
    );

    let magnitudeA = 0;
    let magnitudeB = 0;

    Object.keys(vecA).forEach((key) => {
      magnitudeA += vecA[key] * vecA[key];
      magnitudeB += vecB[key] * vecB[key];
    });

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) return 0;

    const magnitudeRatio =
      Math.min(magnitudeA, magnitudeB) / Math.max(magnitudeA, magnitudeB);
    return Math.pow(magnitudeRatio, 0.5);
  }

  // 最終スコア計算（70:30重み付け）
  calculateFinalScore(userVector, osVector) {
    const similarityScore = this.calculateCosineSimilarity(
      userVector,
      osVector
    );
    const activationScore = this.calculateActivationScore(userVector, osVector);

    return similarityScore * 0.7 + activationScore * 0.3;
  }

  // OS候補分析
  analyzeOSCandidates(userVector, vectorsData) {
    console.log("🔍 OS候補分析開始");
    
    // 入力検証
    if (!userVector || typeof userVector !== 'object') {
      console.error("❌ Invalid userVector:", userVector);
      throw new Error("ユーザーベクターが無効です");
    }
    
    if (!vectorsData || typeof vectorsData !== 'object') {
      console.error("❌ Invalid vectorsData:", vectorsData);
      throw new Error("ベクターデータが無効です");
    }
    
    const vectorKeys = Object.keys(vectorsData);
    if (vectorKeys.length === 0) {
      console.error("❌ Empty vectorsData");
      throw new Error("ベクターデータが空です");
    }
    
    console.log(`📊 分析対象: ${vectorKeys.length}個のヘキサグラム`);
    console.log("📊 ユーザーベクター:", userVector);

    const candidates = [];

    Object.keys(vectorsData).forEach((osId) => {
      const osVector = vectorsData[osId];
      
      // 各ベクターの妥当性チェック
      if (!osVector || typeof osVector !== 'object') {
        console.warn(`⚠️ Invalid osVector for ID ${osId}:`, osVector);
        return;
      }
      
      try {
        const finalScore = this.calculateFinalScore(userVector, osVector);
        const similarity = this.calculateCosineSimilarity(userVector, osVector);
        const activation = this.calculateActivationScore(userVector, osVector);
        
        // スコアの妥当性チェック
        if (isNaN(finalScore) || isNaN(similarity) || isNaN(activation)) {
          console.warn(`⚠️ Invalid scores for ID ${osId}: final=${finalScore}, sim=${similarity}, act=${activation}`);
          return;
        }
        
        candidates.push({
          osId: parseInt(osId),
          score: finalScore,
          similarity: similarity,
          activation: activation,
        });
        
      } catch (scoreError) {
        console.error(`❌ Score calculation error for ID ${osId}:`, scoreError);
      }
    });

    if (candidates.length === 0) {
      console.error("❌ No valid candidates generated");
      throw new Error("有効な候補が生成されませんでした");
    }

    // スコア順でソート、上位4候補を返す
    const sortedCandidates = candidates.sort((a, b) => b.score - a.score).slice(0, 4);
    
    console.log(`✅ OS候補分析完了: ${sortedCandidates.length}個の候補`);
    console.log("📊 トップ候補:", sortedCandidates.map(c => `ID=${c.osId}, Score=${c.score.toFixed(3)}`));
    
    return sortedCandidates;
  }
}

// グローバルスコープで利用可能にする
if (typeof window !== "undefined") {
  window.Calculator = Calculator;
}
