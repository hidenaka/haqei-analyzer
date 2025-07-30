// HAQEI Analyzer 異常値問題検証テスト
// Node.js環境で実行可能な独立テスト

// 統計エンジンの定義（簡略版）
class TestStatisticalEngine {
  constructor() {
    this.validRanges = {
      'engine': { min: 0.15, max: 0.85 },
      'interface': { min: 0.10, max: 0.90 },
      'safemode': { min: 0.05, max: 0.95 },
      'general': { min: 0.20, max: 0.80 }
    };
  }

  validateScore(score, systemType = 'general') {
    const bounds = this.validRanges[systemType] || this.validRanges.general;
    
    const validation = {
      originalScore: score,
      isValid: true,
      correctedScore: score,
      warnings: []
    };

    if (isNaN(score) || score === null || score === undefined) {
      validation.isValid = false;
      validation.correctedScore = bounds.min + (bounds.max - bounds.min) * 0.5;
      validation.warnings.push('Invalid score detected, using median value');
      return validation;
    }

    if (score < bounds.min) {
      validation.isValid = false;
      validation.correctedScore = bounds.min;
      validation.warnings.push(`Score below minimum threshold (${(bounds.min * 100).toFixed(1)}%)`);
    } else if (score > bounds.max) {
      validation.isValid = false;
      validation.correctedScore = bounds.max;
      validation.warnings.push(`Score above maximum threshold (${(bounds.max * 100).toFixed(1)}%)`);
    }

    return validation;
  }

  formatPercentage(value) {
    if (isNaN(value) || value === null || value === undefined) {
      return "0.0%";
    }
    return `${(value * 100).toFixed(1)}%`;
  }
}

// 計算エンジンの定義（簡略版）
class TestCalculator {
  constructor() {
    this.statisticalEngine = new TestStatisticalEngine();
    this.dimensionKeys = [
      "乾_創造性", "震_行動性", "坎_探求性", "艮_安定性",
      "坤_受容性", "巽_適応性", "離_表現性", "兌_調和性"
    ];
  }

  calculateCosineSimilarity(vectorA, vectorB) {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    this.dimensionKeys.forEach((key) => {
      const a = vectorA[key] || 0;
      const b = vectorB[key] || 0;
      dotProduct += a * b;
      magnitudeA += a * a;
      magnitudeB += b * b;
    });

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }

  calculateActivationScore(vectorA, vectorB) {
    let magnitudeA = 0;
    let magnitudeB = 0;

    this.dimensionKeys.forEach((key) => {
      const a = vectorA[key] || 0;
      const b = vectorB[key] || 0;
      magnitudeA += a * a;
      magnitudeB += b * b;
    });

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) return 0;

    const magnitudeRatio = Math.min(magnitudeA, magnitudeB) / Math.max(magnitudeA, magnitudeB);
    return Math.pow(magnitudeRatio, 0.5);
  }

  calculateFinalScore(userVector, osVector, systemType = 'general') {
    const similarityScore = this.calculateCosineSimilarity(userVector, osVector);
    const activationScore = this.calculateActivationScore(userVector, osVector);
    const rawScore = similarityScore * 0.7 + activationScore * 0.3;

    // 統計的妥当性チェック
    const validation = this.statisticalEngine.validateScore(rawScore, systemType);
    return validation.correctedScore;
  }
}

// テストデータ
const testUserVector = {
  "乾_創造性": 0.7,
  "震_行動性": 0.6,
  "坎_探求性": 0.8,
  "艮_安定性": 0.5,
  "坤_受容性": 0.4,
  "巽_適応性": 0.6,
  "離_表現性": 0.7,
  "兌_調和性": 0.5
};

// 異常値を生成しやすいOSベクター（極端な値）
const anomalousOSVectors = {
  1: {
    "乾_創造性": 9,
    "震_行動性": 7,
    "坎_探求性": 5,
    "艮_安定性": 6,
    "坤_受容性": 1,
    "巽_適応性": 3,
    "離_表現性": 8,
    "兌_調和性": 4
  },
  2: {
    "乾_創造性": 2,
    "震_行動性": 3,
    "坎_探求性": 4,
    "艮_安定性": 8,
    "坤_受容性": 9,
    "巽_適応性": 7,
    "離_表現性": 2,
    "兌_調和性": 6
  },
  3: {
    "乾_創造性": 0.1,
    "震_行動性": 0.1,
    "坎_探求性": 0.1,
    "艮_安定性": 0.1,
    "坤_受容性": 0.1,
    "巽_適応性": 0.1,
    "離_表現性": 0.1,
    "兌_調和性": 0.1
  }
};

// テスト実行
function runAnomalyTests() {
  console.log("🔬 HAQEI Analyzer 異常値問題検証テスト");
  console.log("=" .repeat(50));

  const calculator = new TestCalculator();
  const results = [];

  console.log("\n📊 テストデータ:");
  console.log("ユーザーベクター:", testUserVector);

  console.log("\n🔍 異常値生成テスト:");
  
  Object.keys(anomalousOSVectors).forEach(osId => {
    const osVector = anomalousOSVectors[osId];
    
    console.log(`\n--- OS ${osId} テスト ---`);
    console.log("OSベクター:", osVector);
    
    // 修正前の計算（統計チェックなし）
    const similarity = calculator.calculateCosineSimilarity(testUserVector, osVector);
    const activation = calculator.calculateActivationScore(testUserVector, osVector);
    const rawScore = similarity * 0.7 + activation * 0.3;
    
    // 修正後の計算（統計チェックあり）
    const correctedScore = calculator.calculateFinalScore(testUserVector, osVector, 'general');
    
    // 結果記録
    const result = {
      osId: osId,
      similarity: similarity,
      activation: activation,
      rawScore: rawScore,
      correctedScore: correctedScore,
      isAnomalous: rawScore < 0.2 || rawScore > 0.8,
      wasCorrected: Math.abs(rawScore - correctedScore) > 0.001
    };
    
    results.push(result);
    
    console.log(`類似度: ${similarity.toFixed(6)}`);
    console.log(`活性化: ${activation.toFixed(6)}`);
    console.log(`生スコア: ${rawScore.toFixed(6)} (${(rawScore * 100).toFixed(3)}%)`);
    console.log(`修正後: ${correctedScore.toFixed(6)} (${calculator.statisticalEngine.formatPercentage(correctedScore)})`);
    console.log(`異常値: ${result.isAnomalous ? 'YES' : 'NO'}`);
    console.log(`修正: ${result.wasCorrected ? 'YES' : 'NO'}`);
  });

  console.log("\n🏆 テスト結果サマリー:");
  console.log("=" .repeat(50));
  
  const anomalousCount = results.filter(r => r.isAnomalous).length;
  const correctedCount = results.filter(r => r.wasCorrected).length;
  
  console.log(`総テスト数: ${results.length}`);
  console.log(`異常値検出数: ${anomalousCount}`);
  console.log(`修正適用数: ${correctedCount}`);
  console.log(`修正率: ${(correctedCount / results.length * 100).toFixed(1)}%`);

  console.log("\n📈 Before/After 比較:");
  results.forEach(result => {
    if (result.wasCorrected) {
      console.log(`OS ${result.osId}: ${(result.rawScore * 100).toFixed(3)}% → ${calculator.statisticalEngine.formatPercentage(result.correctedScore)}`);
    }
  });

  console.log("\n✅ 異常値問題修正状況:");
  if (correctedCount > 0) {
    console.log("🎯 統計的妥当性チェックが正常に機能しています");
    console.log("🔬 99%や0.88%のような異常値は自動修正されます");
    console.log("📊 表示は小数点以下1桁に統一されます");
  } else {
    console.log("⚠️  異常値が検出されませんでした。テストデータを確認してください。");
  }

  return results;
}

// 手動で異常値を生成するテスト
function testExtremeValues() {
  console.log("\n🚨 極端値直接テスト:");
  console.log("=" .repeat(30));
  
  const engine = new TestStatisticalEngine();
  const extremeValues = [0.99, 0.0088, 1.2, -0.1, NaN, null, undefined];
  
  extremeValues.forEach(value => {
    const validation = engine.validateScore(value, 'general');
    console.log(`入力: ${value} → 修正: ${engine.formatPercentage(validation.correctedScore)} (${validation.isValid ? '正常' : '修正済'})`);
    if (validation.warnings.length > 0) {
      console.log(`  警告: ${validation.warnings.join(', ')}`);
    }
  });
}

// テスト実行
runAnomalyTests();
testExtremeValues();