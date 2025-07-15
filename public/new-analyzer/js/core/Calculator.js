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

  // ユーザー回答から8次元ベクトルを構築
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
    // 回答からスコアを加算
    answers.forEach((answer) => {
      if (answer && answer.scoring_tags && Array.isArray(answer.scoring_tags)) {
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
      }
    });
    console.log("📊 Built user vector:", userVector);
    return userVector;
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
    const candidates = [];

    Object.keys(vectorsData).forEach((osId) => {
      const osVector = vectorsData[osId];
      const finalScore = this.calculateFinalScore(userVector, osVector);

      candidates.push({
        osId: parseInt(osId),
        score: finalScore,
        similarity: this.calculateCosineSimilarity(userVector, osVector),
        activation: this.calculateActivationScore(userVector, osVector),
      });
    });

    // スコア順でソート、上位4候補を返す
    return candidates.sort((a, b) => b.score - a.score).slice(0, 4);
  }
}
