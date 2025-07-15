// HaQei Analyzer - Diagnosis Engine (堅牢版)
class DiagnosisEngine {
  constructor(dataManager) {
    this.dataManager = dataManager;
    this.calculator = new Calculator();
  }

  // 🔧 修正: メイン分析実行
  async analyze(allAnswers) {
    try {
      console.log("🔬 Starting robust analysis...");

      // 入力検証
      if (!allAnswers || !Array.isArray(allAnswers)) {
        throw new Error("Invalid answers input");
      }

      // 回答を価値観とシナリオに分離
      const { worldviewAnswers, scenarioAnswers } =
        this.separateAnswers(allAnswers);

      console.log(`📊 Separated answers: worldview(${worldviewAnswers.length}), scenario(${scenarioAnswers.length})`);

      // 8次元ユーザーベクトル構築
      const userVector = this.calculator.buildUserVector(worldviewAnswers);
      
      // ユーザーベクトルの検証
      if (!userVector || typeof userVector !== 'object') {
        throw new Error("Failed to build user vector");
      }

      console.log("📊 User vector built:", userVector);

      // OS候補分析
      const vectorsData = this.dataManager.getVectorsData();
      if (!vectorsData) {
        throw new Error("Vectors data not available");
      }

      const candidates = this.calculator.analyzeOSCandidates(
        userVector,
        vectorsData
      );

      if (!candidates || candidates.length === 0) {
        throw new Error("No OS candidates found");
      }

      // 候補に詳細情報を追加
      const enrichedCandidates = candidates.map((candidate) => {
        try {
          const hexagramInfo = this.dataManager.getHexagramData(candidate.osId);
          const dominantTrigrams = this.generateDominantTrigrams(userVector, hexagramInfo);
          
          return {
            ...candidate,
            hexagramInfo: hexagramInfo,
            matchPercentage: Math.round(candidate.score * 100),
            dominantTrigrams: dominantTrigrams
          };
        } catch (candidateError) {
          console.error(`❌ Error enriching candidate ${candidate.osId}:`, candidateError);
          
          // フォールバック候補データ
          return {
            ...candidate,
            hexagramInfo: { name: "分析エラー", catchphrase: "データ取得に失敗" },
            matchPercentage: Math.round(candidate.score * 100),
            dominantTrigrams: this.getFallbackTrigrams()
          };
        }
      });

      // 分析結果を構築
      const analysisResult = {
        userVector: userVector,
        topCandidates: enrichedCandidates,
        primaryOS: enrichedCandidates[0],
        analysisDate: new Date().toISOString(),
        totalAnswers: allAnswers.length,
        dimensions: this.analyzeDimensions(userVector),
      };

      console.log("✅ Analysis completed successfully");
      console.log("Primary OS:", analysisResult.primaryOS?.hexagramInfo?.name);
      
      return analysisResult;

    } catch (error) {
      console.error("❌ Analysis failed:", error);
      
      // 完全フォールバック
      return this.createFallbackResult(allAnswers);
    }
  }

  // 🔧 修正: dominantTrigrams生成メソッド（堅牢版）
  generateDominantTrigrams(userVector, hexagramInfo) {
    try {
      console.log("🔥 Generating dominant trigrams (robust)...");
      
      // 入力検証
      if (!userVector || typeof userVector !== 'object') {
        console.error("❌ Invalid userVector for trigrams:", userVector);
        return this.getFallbackTrigrams();
      }

      // 8次元を八卦にマッピング
      const trigramMapping = {
        "乾_創造性": { id: 1, name: "乾", symbol: "☰" },
        "兌_調和性": { id: 2, name: "兌", symbol: "☱" },
        "離_表現性": { id: 3, name: "離", symbol: "☲" },
        "震_行動性": { id: 4, name: "震", symbol: "☳" },
        "巽_適応性": { id: 5, name: "巽", symbol: "☴" },
        "坎_探求性": { id: 6, name: "坎", symbol: "☵" },
        "艮_安定性": { id: 7, name: "艮", symbol: "☶" },
        "坤_受容性": { id: 8, name: "坤", symbol: "☷" }
      };

      // ユーザーベクトルから八卦スコアを計算
      const trigramScores = [];
      let totalScore = 0;

      Object.entries(trigramMapping).forEach(([dimensionKey, trigram]) => {
        try {
          // userVectorから値を安全に取得
          let value = 0;
          
          if (dimensionKey in userVector) {
            const rawValue = userVector[dimensionKey];
            if (typeof rawValue === 'number' && !isNaN(rawValue)) {
              value = rawValue;
            } else {
              console.warn(`⚠️ Invalid value for ${dimensionKey}:`, rawValue);
            }
          } else {
            console.warn(`⚠️ Missing dimension ${dimensionKey} in userVector`);
          }

          trigramScores.push({
            id: trigram.id,
            name: trigram.name,
            symbol: trigram.symbol,
            dimensionKey: dimensionKey,
            value: value,
            percentage: 0 // 後で計算
          });
          
          totalScore += value;

        } catch (trigramError) {
          console.error(`❌ Error processing trigram ${dimensionKey}:`, trigramError);
          
          // エラー時のフォールバック値
          trigramScores.push({
            id: trigram.id,
            name: trigram.name,
            symbol: trigram.symbol,
            dimensionKey: dimensionKey,
            value: 0,
            percentage: 0
          });
        }
      });

      // パーセンテージを計算
      trigramScores.forEach(trigram => {
        try {
          if (totalScore > 0) {
            trigram.percentage = Math.round((trigram.value / totalScore) * 100 * 10) / 10;
          } else {
            trigram.percentage = 0;
          }
        } catch (percentError) {
          console.error(`❌ Error calculating percentage for ${trigram.name}:", percentError);
          trigram.percentage = 0;
        }
      });

      // スコア順でソート（降順）
      trigramScores.sort((a, b) => {
        const valueA = typeof a.value === 'number' ? a.value : 0;
        const valueB = typeof b.value === 'number' ? b.value : 0;
        return valueB - valueA;
      });

      // 上位3つを返す
      const dominantTrigrams = trigramScores.slice(0, 3);

      // 最終検証
      const validTrigrams = dominantTrigrams.every(trigram => 
        trigram && 
        typeof trigram === 'object' && 
        trigram.name && 
        trigram.symbol &&
        typeof trigram.value === 'number'
      );

      if (!validTrigrams) {
        console.warn("⚠️ Generated trigrams failed validation, using fallback");
        return this.getFallbackTrigrams();
      }

      console.log("🎯 Dominant trigrams calculated successfully:", 
        dominantTrigrams.map(t => `${t.name}(${t.value}/${t.percentage}%)`).join(', '));
      
      return dominantTrigrams;

    } catch (error) {
      console.error("❌ Error generating dominant trigrams:", error);
      console.error("Stack trace:", error.stack);
      
      // エラー時のフォールバック
      return this.getFallbackTrigrams();
    }
  }

  // 🔧 新規追加: フォールバック用の安全なトリグラムデータ
  getFallbackTrigrams() {
    return [
      {
        id: 1,
        name: "乾",
        symbol: "☰",
        dimensionKey: "乾_創造性",
        value: 1,
        percentage: 33.3
      },
      {
        id: 2,
        name: "兌",
        symbol: "☱",
        dimensionKey: "兌_調和性",
        value: 1,
        percentage: 33.3
      },
      {
        id: 3,
        name: "離",
        symbol: "☲",
        dimensionKey: "離_表現性",
        value: 1,
        percentage: 33.3
      }
    ];
  }

  // 🔧 新規追加: 完全フォールバック結果
  createFallbackResult(allAnswers) {
    console.log("🚨 Creating fallback analysis result");
    
    const fallbackVector = {
      "乾_創造性": 5,
      "震_行動性": 5,
      "坎_探求性": 5,
      "艮_安定性": 5,
      "坤_受容性": 5,
      "巽_適応性": 5,
      "離_表現性": 5,
      "兌_調和性": 5
    };

    const fallbackCandidate = {
      osId: 1,
      score: 0.5,
      similarity: 0.5,
      activation: 0.5,
      hexagramInfo: {
        name: "乾為天",
        catchphrase: "分析エラーのため既定値",
        description: "システムエラーが発生しました"
      },
      matchPercentage: 50,
      dominantTrigrams: this.getFallbackTrigrams()
    };

    return {
      userVector: fallbackVector,
      topCandidates: [fallbackCandidate],
      primaryOS: fallbackCandidate,
      analysisDate: new Date().toISOString(),
      totalAnswers: allAnswers?.length || 0,
      dimensions: this.analyzeDimensions(fallbackVector),
      isEmergencyFallback: true
    };
  }

  // 🔧 新規追加: ユーザーベクトルのデバッグ
  debugUserVector(userVector) {
    console.log("🔍 User Vector Debug:");
    console.log("- Type:", typeof userVector);
    console.log("- Is object:", typeof userVector === 'object' && userVector !== null);
    
    if (userVector) {
      console.log("- Keys:", Object.keys(userVector));
      console.log("- Values:", Object.values(userVector));
      
      const expectedKeys = [
        "乾_創造性", "震_行動性", "坎_探求性", "艮_安定性",
        "坤_受容性", "巽_適応性", "離_表現性", "兌_調和性"
      ];
      
      expectedKeys.forEach(key => {
        const hasKey = key in userVector;
        const value = userVector[key];
        const isValidValue = typeof value === 'number' && !isNaN(value);
        console.log(`- ${key}: ${hasKey ? '✅' : '❌'} exists, value: ${value} (${isValidValue ? 'valid' : 'invalid'})`);
      });
    }
  }

  // 回答を価値観とシナリオに分離
  separateAnswers(allAnswers) {
    const worldviewAnswers = [];
    const scenarioAnswers = [];

    allAnswers.forEach((answer) => {
      // questions.jsの形式に合わせて分離
      if (
        answer.questionId &&
        answer.questionId.startsWith("q") &&
        parseInt(answer.questionId.substring(1)) <= 24
      ) {
        // Q1-Q24は価値観設問
        worldviewAnswers.push(answer);
      } else {
        // Q25-Q30はシナリオ設問
        scenarioAnswers.push(answer);
      }
    });

    return { worldviewAnswers, scenarioAnswers };
  }

  // 8次元分析
  analyzeDimensions(userVector) {
    const dimensions = [];

    Object.entries(userVector).forEach(([key, value]) => {
      const displayName = this.getDimensionDisplayName(key);
      dimensions.push({
        key: key,
        displayName: displayName,
        value: value,
        level: this.getDimensionLevel(value),
        description: this.getDimensionDescription(key, value),
      });
    });

    // 値でソート（高い順）
    dimensions.sort((a, b) => b.value - a.value);

    return dimensions;
  }

  // 次元表示名を取得
  getDimensionDisplayName(key) {
    const displayMap = {
      乾_創造性: "天_創造性",
      震_行動性: "雷_行動性",
      坎_探求性: "水_探求性",
      艮_安定性: "山_安定性",
      坤_受容性: "地_受容性",
      巽_適応性: "風_適応性",
      離_表現性: "火_表現性",
      兌_調和性: "沢_調和性",
    };

    return displayMap[key] || key;
  }

  // 次元レベルを判定
  getDimensionLevel(value) {
    if (value >= 20) return "very-high";
    if (value >= 15) return "high";
    if (value >= 10) return "medium";
    if (value >= 5) return "low";
    return "very-low";
  }

  // 次元説明を生成
  getDimensionDescription(key, value) {
    const descriptions = {
      乾_創造性: {
        high: "新しいアイデアを生み出し、革新を起こす力が非常に強い",
        medium: "創造的な思考を持ち、新しい取り組みを好む",
        low: "安定した方法を好み、創造性はやや控えめ",
      },
      震_行動性: {
        high: "エネルギッシュで、積極的に行動を起こす力が強い",
        medium: "必要に応じて行動し、適度な実行力を持つ",
        low: "慎重に行動し、じっくりと考えてから動く",
      },
      坎_探求性: {
        high: "物事の本質を深く追求し、真理を探求する力が強い",
        medium: "興味のあることを深く学び、理解を深める",
        low: "実用的な知識を重視し、深い探求はやや控えめ",
      },
      艮_安定性: {
        high: "継続性と安定性を重視し、着実に物事を進める",
        medium: "バランスを保ちながら、堅実に取り組む",
        low: "変化を好み、安定よりも動的な環境を選ぶ",
      },
      坤_受容性: {
        high: "他者を受け入れ、支援する力が非常に強い",
        medium: "人との関係を大切にし、協調性を持つ",
        low: "独立性を重視し、自分のペースを大切にする",
      },
      巽_適応性: {
        high: "状況に応じて柔軟に対応し、調整力が高い",
        medium: "変化に適応し、臨機応変に対応する",
        low: "一貫した方針を重視し、変化への適応はやや慎重",
      },
      離_表現性: {
        high: "自分の考えを明確に表現し、影響力を発揮する",
        medium: "適切な場面で自己表現し、コミュニケーションを取る",
        low: "控えめな表現を好み、静かに影響を与える",
      },
      兌_調和性: {
        high: "人との調和を重視し、喜びを分かち合う力が強い",
        medium: "良好な関係性を築き、協調性を持つ",
        low: "個人の価値観を重視し、調和よりも自立を選ぶ",
      },
    };

    const dimDesc = descriptions[key];
    if (!dimDesc) return "この次元の分析結果です";

    const level = this.getDimensionLevel(value);
    if (level === "very-high" || level === "high") return dimDesc.high;
    if (level === "medium") return dimDesc.medium;
    return dimDesc.low;
  }

  // 深い洞察生成
  async generateInsights(analysisResult) {
    const insights = {
      summary: this.generateSummaryInsight(analysisResult),
      strengths: this.generateStrengthsInsight(analysisResult),
      growthAreas: this.generateGrowthInsight(analysisResult),
      recommendations: this.generateRecommendations(analysisResult),
    };

    return insights;
  }

  // 要約洞察
  generateSummaryInsight(result) {
    const primary = result.primaryOS;
    const topDimensions = result.dimensions.slice(0, 3);

    return `あなたの人格OSは「${
      primary.hexagramInfo.name
    }」です。特に${topDimensions
      .map((d) => d.displayName)
      .join("、")}が強く、これがあなたの核となる価値観を形成しています。`;
  }

  // 強み洞察
  generateStrengthsInsight(result) {
    const topDimensions = result.dimensions
      .filter((d) => d.level === "very-high" || d.level === "high")
      .slice(0, 3);

    return topDimensions.map((d) => `${d.displayName}: ${d.description}`);
  }

  // 成長領域洞察
  generateGrowthInsight(result) {
    const lowDimensions = result.dimensions
      .filter((d) => d.level === "low" || d.level === "very-low")
      .slice(0, 2);

    return lowDimensions.map(
      (d) =>
        `${d.displayName}: この領域を意識的に発達させることで、より多面的な成長が期待できます`
    );
  }

  // 推奨事項
  generateRecommendations(result) {
    const primary = result.primaryOS;

    return [
      `${primary.hexagramInfo.name}の特質を活かせる環境や活動を探してみてください`,
      "強い価値観を基盤として、成長領域にも意識的に取り組んでみましょう",
      "定期的に自己分析を行い、価値観の変化や成長を確認することをお勧めします",
    ];
  }
}
