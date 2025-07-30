// HaQei Analyzer - 診断偏り検証システム
// OS Analyzer Bias Analysis Tool

class DiagnosisBiasAnalyzer {
  constructor() {
    this.calculator = new Calculator();
    this.diagnosisEngine = new DiagnosisEngine(null);
    this.results = {
      patternCounts: {},
      hexagramDistribution: {},
      dimensionBias: {},
      extremePatterns: [],
      biasReport: []
    };
    
    // 8次元キー
    this.dimensionKeys = [
      "乾_創造性", "震_行動性", "坎_探求性", "艮_安定性",
      "坤_受容性", "巽_適応性", "離_表現性", "兌_調和性"
    ];
    
    console.log("🔍 診断偏り検証システム初期化完了");
  }

  // 全回答パターン生成器
  generateAllAnswerPatterns(sampleSize = 1000) {
    console.log(`📊 ${sampleSize}パターンの回答を生成中...`);
    
    const patterns = [];
    
    // 1. 極端パターン（全A、全B等）
    patterns.push(...this.generateExtremePatterns());
    
    // 2. ランダムパターン
    for (let i = 0; i < sampleSize - 20; i++) {
      patterns.push(this.generateRandomPattern());
    }
    
    // 3. 現実的パターン（正規分布ベース）
    patterns.push(...this.generateRealisticPatterns(20));
    
    console.log(`✅ ${patterns.length}パターンの回答生成完了`);
    return patterns;
  }

  // 極端パターン生成
  generateExtremePatterns() {
    const patterns = [];
    const choices = ['A', 'B', 'C', 'D', 'E'];
    
    // 全て同じ選択肢のパターン
    choices.forEach(choice => {
      const pattern = this.createAnswerPattern(choice);
      pattern._label = `全${choice}選択`;
      patterns.push(pattern);
    });
    
    // 価値観とシナリオで逆パターン
    choices.forEach(choice1 => {
      choices.forEach(choice2 => {
        if (choice1 !== choice2) {
          const pattern = this.createMixedPattern(choice1, choice2);
          pattern._label = `価値観${choice1}_シナリオ${choice2}`;
          patterns.push(pattern);
        }
      });
    });
    
    return patterns.slice(0, 20); // 上位20パターンのみ
  }

  // 現実的パターン生成（正規分布）
  generateRealisticPatterns(count) {
    const patterns = [];
    
    for (let i = 0; i < count; i++) {
      // 正規分布に基づく選択確率
      const pattern = [];
      
      // 価値観設問（Q1-Q24）
      for (let q = 1; q <= 24; q++) {
        const questionId = `q${q}`;
        const choice = this.getWeightedRandomChoice(['A', 'B', 'C', 'D'], [0.3, 0.3, 0.25, 0.15]);
        
        pattern.push({
          questionId: questionId,
          selectedValue: choice,
          scoring_tags: this.getQuestionScoringTags(questionId, choice),
          timestamp: new Date().toISOString()
        });
      }
      
      // シナリオ設問（Q25-Q30）
      for (let q = 25; q <= 30; q++) {
        const questionId = `q${q}`;
        const innerChoice = this.getWeightedRandomChoice(['A', 'B', 'C', 'D', 'E'], [0.2, 0.25, 0.25, 0.2, 0.1]);
        const outerChoice = this.getWeightedRandomChoice(['A', 'B', 'C', 'D', 'E'], [0.2, 0.25, 0.25, 0.2, 0.1]);
        
        pattern.push({
          questionId: questionId,
          innerChoice: {
            value: innerChoice,
            scoring_tags: this.getQuestionScoringTags(questionId, innerChoice, 'inner')
          },
          outerChoice: {
            value: outerChoice,
            scoring_tags: this.getQuestionScoringTags(questionId, outerChoice, 'outer')
          },
          timestamp: new Date().toISOString()
        });
      }
      
      pattern._label = `現実的パターン${i + 1}`;
      patterns.push(pattern);
    }
    
    return patterns;
  }

  // 単一選択肢パターン作成
  createAnswerPattern(choice) {
    const pattern = [];
    
    // 価値観設問（Q1-Q24）
    for (let q = 1; q <= 24; q++) {
      const questionId = `q${q}`;
      pattern.push({
        questionId: questionId,
        selectedValue: choice,
        scoring_tags: this.getQuestionScoringTags(questionId, choice),
        timestamp: new Date().toISOString()
      });
    }
    
    // シナリオ設問（Q25-Q30）
    for (let q = 25; q <= 30; q++) {
      const questionId = `q${q}`;
      pattern.push({
        questionId: questionId,
        innerChoice: {
          value: choice,
          scoring_tags: this.getQuestionScoringTags(questionId, choice, 'inner')
        },
        outerChoice: {
          value: choice,
          scoring_tags: this.getQuestionScoringTags(questionId, choice, 'outer')
        },
        timestamp: new Date().toISOString()
      });
    }
    
    return pattern;
  }

  // 混合パターン作成
  createMixedPattern(worldviewChoice, scenarioChoice) {
    const pattern = [];
    
    // 価値観設問
    for (let q = 1; q <= 24; q++) {
      const questionId = `q${q}`;
      pattern.push({
        questionId: questionId,
        selectedValue: worldviewChoice,
        scoring_tags: this.getQuestionScoringTags(questionId, worldviewChoice),
        timestamp: new Date().toISOString()
      });
    }
    
    // シナリオ設問
    for (let q = 25; q <= 30; q++) {
      const questionId = `q${q}`;
      pattern.push({
        questionId: questionId,
        innerChoice: {
          value: scenarioChoice,
          scoring_tags: this.getQuestionScoringTags(questionId, scenarioChoice, 'inner')
        },
        outerChoice: {
          value: scenarioChoice,
          scoring_tags: this.getQuestionScoringTags(questionId, scenarioChoice, 'outer')
        },
        timestamp: new Date().toISOString()
      });
    }
    
    return pattern;
  }

  // ランダムパターン生成
  generateRandomPattern() {
    const pattern = [];
    const choices = ['A', 'B', 'C', 'D', 'E'];
    
    // 価値観設問
    for (let q = 1; q <= 24; q++) {
      const questionId = `q${q}`;
      const choice = choices[Math.floor(Math.random() * 4)]; // A-Dのみ
      
      pattern.push({
        questionId: questionId,
        selectedValue: choice,
        scoring_tags: this.getQuestionScoringTags(questionId, choice),
        timestamp: new Date().toISOString()
      });
    }
    
    // シナリオ設問
    for (let q = 25; q <= 30; q++) {
      const questionId = `q${q}`;
      const innerChoice = choices[Math.floor(Math.random() * 5)];
      const outerChoice = choices[Math.floor(Math.random() * 5)];
      
      pattern.push({
        questionId: questionId,
        innerChoice: {
          value: innerChoice,
          scoring_tags: this.getQuestionScoringTags(questionId, innerChoice, 'inner')
        },
        outerChoice: {
          value: outerChoice,
          scoring_tags: this.getQuestionScoringTags(questionId, outerChoice, 'outer')
        },
        timestamp: new Date().toISOString()
      });
    }
    
    pattern._label = `ランダム_${Math.random().toString(36).substr(2, 9)}`;
    return pattern;
  }

  // 重み付きランダム選択
  getWeightedRandomChoice(choices, weights) {
    const random = Math.random();
    let weightSum = 0;
    
    for (let i = 0; i < choices.length; i++) {
      weightSum += weights[i];
      if (random <= weightSum) {
        return choices[i];
      }
    }
    
    return choices[choices.length - 1];
  }

  // 質問のスコアリングタグ取得（簡易版）
  getQuestionScoringTags(questionId, choice, type = null) {
    // 実際の質問データからスコアリングタグを取得
    // ここでは簡易版として固定パターンを返す
    const baseScores = {
      'A': [{ key: "乾_創造性", value: 2.5 }, { key: "震_行動性", value: 1.0 }],
      'B': [{ key: "坎_探求性", value: 2.0 }, { key: "艮_安定性", value: 1.5 }],
      'C': [{ key: "坤_受容性", value: 2.5 }, { key: "巽_適応性", value: 1.0 }],
      'D': [{ key: "離_表現性", value: 2.0 }, { key: "兌_調和性", value: 1.5 }],
      'E': [{ key: "震_行動性", value: 1.5 }, { key: "離_表現性", value: 2.0 }]
    };
    
    return baseScores[choice] || [];
  }

  // 結果分布分析
  async analyzeResultDistribution(patterns) {
    console.log("📊 結果分布分析開始...");
    
    const results = [];
    
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];
      
      try {
        // 価値観とシナリオに分離
        const { worldviewAnswers, scenarioAnswers } = this.separateAnswers(pattern);
        
        // 8次元ユーザーベクトル構築
        const userVector = this.calculator.buildUserVector(worldviewAnswers);
        
        // 上位OS候補分析（モックデータ使用）
        const candidates = this.mockAnalyzeOSCandidates(userVector);
        
        if (candidates && candidates.length > 0) {
          const primaryOS = candidates[0];
          results.push({
            pattern: pattern._label || `パターン${i + 1}`,
            primaryOSId: primaryOS.osId,
            score: primaryOS.score,
            userVector: userVector,
            candidates: candidates
          });
          
          // ヘキサグラム分布をカウント
          if (!this.results.hexagramDistribution[primaryOS.osId]) {
            this.results.hexagramDistribution[primaryOS.osId] = 0;
          }
          this.results.hexagramDistribution[primaryOS.osId]++;
        }
        
        // プログレス表示
        if ((i + 1) % 100 === 0) {
          console.log(`進捗: ${i + 1}/${patterns.length} (${((i + 1) / patterns.length * 100).toFixed(1)}%)`);
        }
        
      } catch (error) {
        console.error(`パターン${i + 1}の分析でエラー:`, error);
      }
    }
    
    console.log(`✅ ${results.length}パターンの分析完了`);
    return results;
  }

  // 回答分離（価値観・シナリオ）
  separateAnswers(allAnswers) {
    const worldviewAnswers = [];
    const scenarioAnswers = [];
    
    allAnswers.forEach(answer => {
      if (answer.questionId && answer.questionId.match(/^q(\d+)$/)) {
        const questionNumber = parseInt(answer.questionId.replace('q', ''));
        
        if (questionNumber <= 24) {
          worldviewAnswers.push(answer);
        } else {
          scenarioAnswers.push(answer);
        }
      }
    });
    
    return { worldviewAnswers, scenarioAnswers };
  }

  // モックOS候補分析
  mockAnalyzeOSCandidates(userVector) {
    const candidates = [];
    
    // 簡易版：64卦の基本スコア計算
    for (let osId = 1; osId <= 64; osId++) {
      const score = this.calculateMockScore(userVector, osId);
      candidates.push({
        osId: osId,
        score: score,
        similarity: score * 0.8,
        activation: score * 0.9
      });
    }
    
    // スコア順でソート、上位4候補を返す
    return candidates.sort((a, b) => b.score - a.score).slice(0, 4);
  }

  // モックスコア計算
  calculateMockScore(userVector, osId) {
    // 簡易版：各次元の合計値とOSIDに基づく計算
    let totalScore = 0;
    
    this.dimensionKeys.forEach(key => {
      totalScore += userVector[key] || 0;
    });
    
    // OSIDに基づく調整（1-64の範囲で異なる特性を模擬）
    const osBonus = Math.sin(osId * 0.1) * 0.3 + 0.7; // 0.4-1.0の範囲
    
    return Math.max(0, Math.min(1, (totalScore / 100) * osBonus));
  }

  // 極端な偏り検出
  detectExtremeOutliers(results) {
    console.log("🔍 極端な偏り検出中...");
    
    const hexagramCounts = this.results.hexagramDistribution;
    const totalResults = results.length;
    const expectedFrequency = totalResults / 64; // 理想的には1/64 = 1.56%
    
    const outliers = [];
    
    Object.entries(hexagramCounts).forEach(([hexagramId, count]) => {
      const actualFrequency = count / totalResults;
      const expectedRatio = actualFrequency / (expectedFrequency / totalResults);
      
      // 期待値の3倍以上または1/3以下を極端な偏りとする
      if (expectedRatio > 3.0 || expectedRatio < 0.33) {
        outliers.push({
          hexagramId: parseInt(hexagramId),
          count: count,
          frequency: actualFrequency,
          expectedRatio: expectedRatio,
          severity: expectedRatio > 3.0 ? 'over-represented' : 'under-represented'
        });
      }
    });
    
    // 深刻度順でソート
    outliers.sort((a, b) => {
      const severityA = Math.abs(Math.log(a.expectedRatio));
      const severityB = Math.abs(Math.log(b.expectedRatio));
      return severityB - severityA;
    });
    
    this.results.extremePatterns = outliers;
    console.log(`⚠️ ${outliers.length}個の極端な偏りを検出`);
    
    return outliers;
  }

  // 偏り分析レポート生成
  generateBiasReport(results, outliers) {
    console.log("📋 偏り分析レポート生成中...");
    
    const report = {
      summary: {
        totalPatterns: results.length,
        uniqueHexagrams: Object.keys(this.results.hexagramDistribution).length,
        averageScore: this.calculateAverageScore(results),
        biasLevel: this.calculateOverallBiasLevel(outliers)
      },
      distribution: {
        hexagramDistribution: this.results.hexagramDistribution,
        topHexagrams: this.getTopHexagrams(5),
        bottomHexagrams: this.getBottomHexagrams(5)
      },
      outliers: outliers,
      dimensionAnalysis: this.analyzeDimensionBias(results),
      recommendations: this.generateRecommendations(outliers)
    };
    
    this.results.biasReport = report;
    console.log("✅ 偏り分析レポート生成完了");
    
    return report;
  }

  // 平均スコア計算
  calculateAverageScore(results) {
    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    return totalScore / results.length;
  }

  // 全体偏りレベル計算
  calculateOverallBiasLevel(outliers) {
    if (outliers.length === 0) return 'minimal';
    if (outliers.length <= 5) return 'moderate';
    if (outliers.length <= 15) return 'significant';
    return 'severe';
  }

  // 上位ヘキサグラム取得
  getTopHexagrams(count) {
    return Object.entries(this.results.hexagramDistribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, count)
      .map(([id, count]) => ({ hexagramId: parseInt(id), count }));
  }

  // 下位ヘキサグラム取得
  getBottomHexagrams(count) {
    return Object.entries(this.results.hexagramDistribution)
      .sort(([,a], [,b]) => a - b)
      .slice(0, count)
      .map(([id, count]) => ({ hexagramId: parseInt(id), count }));
  }

  // 次元偏り分析
  analyzeDimensionBias(results) {
    const dimensionSums = {};
    this.dimensionKeys.forEach(key => {
      dimensionSums[key] = 0;
    });
    
    results.forEach(result => {
      this.dimensionKeys.forEach(key => {
        dimensionSums[key] += result.userVector[key] || 0;
      });
    });
    
    const dimensionAverages = {};
    this.dimensionKeys.forEach(key => {
      dimensionAverages[key] = dimensionSums[key] / results.length;
    });
    
    return dimensionAverages;
  }

  // 推奨事項生成
  generateRecommendations(outliers) {
    const recommendations = [];
    
    if (outliers.length === 0) {
      recommendations.push({
        type: 'positive',
        message: '診断システムには深刻な偏りは検出されませんでした。'
      });
    } else {
      recommendations.push({
        type: 'warning',
        message: `${outliers.length}個の偏りが検出されました。質問の配点調整を検討してください。`
      });
      
      // 最も偏りの大きいヘキサグラムに対する推奨
      const mostBiased = outliers[0];
      if (mostBiased.severity === 'over-represented') {
        recommendations.push({
          type: 'action',
          message: `ヘキサグラム${mostBiased.hexagramId}が過剰出現しています。対応する次元のスコア配分を見直してください。`
        });
      } else {
        recommendations.push({
          type: 'action',
          message: `ヘキサグラム${mostBiased.hexagramId}が過小出現しています。対応する次元のスコア配分を増やすことを検討してください。`
        });
      }
    }
    
    return recommendations;
  }

  // 完全な偏り分析実行
  async runCompleteAnalysis(sampleSize = 1000) {
    console.log("🔬 OS Analyzer 完全偏り分析開始");
    const startTime = performance.now();
    
    try {
      // 1. 回答パターン生成
      const patterns = this.generateAllAnswerPatterns(sampleSize);
      
      // 2. 結果分布分析
      const results = await this.analyzeResultDistribution(patterns);
      
      // 3. 極端な偏り検出
      const outliers = this.detectExtremeOutliers(results);
      
      // 4. 偏り分析レポート生成
      const report = this.generateBiasReport(results, outliers);
      
      const endTime = performance.now();
      console.log(`✅ 完全偏り分析完了 (${(endTime - startTime).toFixed(2)}ms)`);
      
      // 結果表示
      this.displayResults(report);
      
      return report;
      
    } catch (error) {
      console.error("❌ 偏り分析でエラーが発生:", error);
      throw error;
    }
  }

  // 結果表示
  displayResults(report) {
    console.group("📊 OS Analyzer 偏り分析結果");
    
    console.log("📋 分析サマリー:");
    console.table(report.summary);
    
    console.log("📈 上位5ヘキサグラム:");
    console.table(report.distribution.topHexagrams);
    
    console.log("📉 下位5ヘキサグラム:");
    console.table(report.distribution.bottomHexagrams);
    
    if (report.outliers.length > 0) {
      console.log("⚠️ 検出された偏り:");
      console.table(report.outliers);
    }
    
    console.log("💡 推奨事項:");
    report.recommendations.forEach(rec => {
      console.log(`${rec.type === 'warning' ? '⚠️' : rec.type === 'action' ? '🔧' : '✅'} ${rec.message}`);
    });
    
    console.groupEnd();
  }
}

// グローバルスコープで利用可能にする
if (typeof window !== 'undefined') {
  window.DiagnosisBiasAnalyzer = DiagnosisBiasAnalyzer;
}

// 使用例
/*
const analyzer = new DiagnosisBiasAnalyzer();
analyzer.runCompleteAnalysis(500).then(report => {
  console.log('偏り分析完了:', report);
});
*/