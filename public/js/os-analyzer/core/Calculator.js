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
