// OrthodoxyReportGenerator.js - 易経正統性検証レポート生成システム
// HaQei Analyzer - I-Ching Orthodoxy Validation Report Generator
// 検証結果の詳細なレポート生成とビジュアル表示

/**
 * 易経正統性検証レポート生成システム
 * 
 * IChingOrthodoxyValidatorの検証結果を基に、
 * 詳細な分析レポートを生成し、
 * HTMLベースの見やすい形式で出力します。
 */

class OrthodoxyReportGenerator {
  constructor() {
    this.validator = null;
    this.reportTemplate = null;
    
    console.log("📊 Orthodoxy Report Generator initialized");
  }

  /**
   * 検証レポートを生成
   * @param {Object} validationResults - 検証結果データ
   * @param {Object} options - レポート生成オプション
   * @returns {Object} 生成されたレポート
   */
  async generateReport(validationResults, options = {}) {
    console.log("📊 Generating orthodoxy validation report...");
    
    const reportOptions = {
      format: options.format || 'html', // 'html', 'json', 'markdown'
      includeCharts: options.includeCharts !== false,
      includeDetails: options.includeDetails !== false,
      language: options.language || 'ja',
      ...options
    };
    
    const report = {
      metadata: this.generateReportMetadata(validationResults, reportOptions),
      executive_summary: this.generateExecutiveSummary(validationResults),
      detailed_analysis: this.generateDetailedAnalysis(validationResults),
      visualizations: reportOptions.includeCharts ? this.generateVisualizations(validationResults) : null,
      recommendations: this.generateRecommendationsSection(validationResults),
      appendix: reportOptions.includeDetails ? this.generateAppendix(validationResults) : null
    };
    
    // フォーマット別出力
    switch (reportOptions.format) {
      case 'html':
        return this.generateHTMLReport(report, reportOptions);
      case 'markdown':
        return this.generateMarkdownReport(report, reportOptions);
      case 'json':
        return this.generateJSONReport(report, reportOptions);
      default:
        return report;
    }
  }

  // ========== レポートメタデータ生成 ==========
  
  generateReportMetadata(validationResults, options) {
    return {
      title: "HAQEI Analyzer 易経正統性検証レポート",
      subtitle: "古典易経基準による実装品質評価",
      generated_at: new Date().toISOString(),
      validation_timestamp: validationResults.timestamp,
      processing_time: validationResults.processingTime,
      format: options.format,
      language: options.language,
      overall_score: validationResults.overallAssessment.overallScore,
      assessment_level: validationResults.overallAssessment.assessmentLevel,
      total_issues: this.countTotalIssues(validationResults),
      version: "1.0.0"
    };
  }

  countTotalIssues(validationResults) {
    const issues = validationResults.issues;
    return {
      critical: issues.critical.length,
      important: issues.important.length,
      minor: issues.minor.length,
      total: issues.critical.length + issues.important.length + issues.minor.length
    };
  }

  // ========== エグゼクティブサマリー生成 ==========
  
  generateExecutiveSummary(validationResults) {
    const assessment = validationResults.overallAssessment;
    
    return {
      overall_score: assessment.overallScore,
      assessment_level: assessment.assessmentLevel,
      key_findings: this.generateKeyFindings(validationResults),
      critical_issues: this.extractCriticalIssues(validationResults),
      primary_recommendations: this.extractPrimaryRecommendations(validationResults),
      risk_assessment: this.generateRiskAssessment(validationResults)
    };
  }

  generateKeyFindings(validationResults) {
    const findings = [];
    const assessment = validationResults.overallAssessment;
    
    // スコアベースの主要発見事項
    if (assessment.overallScore >= 0.9) {
      findings.push("実装は古典易経の正統性を高いレベルで維持しています");
    } else if (assessment.overallScore >= 0.8) {
      findings.push("実装は概ね古典易経の基準に準拠していますが、改善の余地があります");
    } else if (assessment.overallScore >= 0.7) {
      findings.push("実装には古典易経の基準からの逸脱がいくつか見られます");
    } else {
      findings.push("実装は古典易経の基準から大きく逸脱しており、重大な修正が必要です");
    }
    
    // 領域別の発見事項
    const domainScores = assessment.domainScores;
    
    if (domainScores.trigramRelationships < 0.7) {
      findings.push("八卦の相互関係性実装に重大な問題があります");
    }
    if (domainScores.hexagramBalance < 0.7) {
      findings.push("64卦の陰陽バランスが古典的基準を満たしていません");
    }
    if (domainScores.ultraSyncLogic < 0.7) {
      findings.push("ウルトラシンクロジック20の正統性に疑問があります");
    }
    if (domainScores.bunenjinAlignment < 0.7) {
      findings.push("bunenjin哲学との整合性が不十分です");
    }
    if (domainScores.lineApplication < 0.7) {
      findings.push("爻辞レベルの適用に正確性の問題があります");
    }
    
    // 強みの特定
    assessment.strengths.forEach(strength => {
      findings.push(`✅ ${strength}`);
    });
    
    return findings;
  }

  extractCriticalIssues(validationResults) {
    return validationResults.issues.critical.map(issue => ({
      domain: issue.domain,
      score: issue.score,
      severity: issue.severity,
      impact: "高",
      urgency: "immediate"
    }));
  }

  extractPrimaryRecommendations(validationResults) {
    return validationResults.recommendations
      .filter(rec => rec.urgency === "high")
      .slice(0, 3)
      .map(rec => ({
        category: rec.category,
        recommendation: rec.recommendation,
        priority: "最高",
        effort: rec.estimatedEffort,
        impact: rec.expectedImpact
      }));
  }

  generateRiskAssessment(validationResults) {
    const issues = validationResults.issues;
    let riskLevel = "低";
    let riskColor = "green";
    
    if (issues.critical.length > 0) {
      riskLevel = "高";
      riskColor = "red";
    } else if (issues.important.length > 2) {
      riskLevel = "中";
      riskColor = "orange";
    }
    
    return {
      level: riskLevel,
      color: riskColor,
      description: this.getRiskDescription(riskLevel),
      mitigation_urgency: issues.critical.length > 0 ? "immediate" : issues.important.length > 0 ? "within_week" : "within_month"
    };
  }

  getRiskDescription(riskLevel) {
    const descriptions = {
      "高": "実装の正統性に重大な問題があり、即座の対応が必要です。現状では古典易経の思想を正しく反映できていません。",
      "中": "実装にいくつかの問題がありますが、段階的な改善により解決可能です。",
      "低": "実装は概ね良好ですが、より高い品質を目指すための改善点があります。"
    };
    return descriptions[riskLevel] || "リスクレベルを評価できません";
  }

  // ========== 詳細分析生成 ==========
  
  generateDetailedAnalysis(validationResults) {
    return {
      trigram_relationships: this.analyzeTrigra
mRelationships(validationResults.trigramRelationships),
      hexagram_balance: this.analyzeHexagramBalance(validationResults.hexagramBalance),
      ultra_sync_logic: this.analyzeUltraSyncLogic(validationResults.ultraSyncLogic),
      bunenjin_alignment: this.analyzeBunenjinAlignment(validationResults.bunenjinAlignment),
      line_application: this.analyzeLineApplication(validationResults.lineApplication)
    };
  }

  analyzeTrigramRelationships(trigramData) {
    return {
      overall_score: trigramData.overallScore,
      status: this.getStatusFromScore(trigramData.overallScore),
      
      opposition_relationships: {
        score: trigramData.oppositionRelationships.score,
        correct_count: trigramData.oppositionRelationships.correctCount,
        total_count: trigramData.oppositionRelationships.totalCount,
        accuracy_percentage: Math.round(trigramData.oppositionRelationships.score * 100),
        issues: trigramData.oppositionRelationships.issues
      },
      
      complementary_relationships: {
        score: trigramData.complementaryRelationships.score,
        correct_count: trigramData.complementaryRelationships.correctCount,
        total_count: trigramData.complementaryRelationships.totalCount,
        accuracy_percentage: Math.round(trigramData.complementaryRelationships.score * 100),
        issues: trigramData.complementaryRelationships.issues
      },
      
      five_element_cycles: {
        score: trigramData.fiveElementCycles.score,
        generation_accuracy: trigramData.fiveElementCycles.generation?.score || 0,
        restriction_accuracy: trigramData.fiveElementCycles.restriction?.score || 0,
        issues: trigramData.fiveElementCycles.issues
      },
      
      family_dynamics: {
        score: trigramData.familyDynamics.score,
        correct_count: trigramData.familyDynamics.correctCount,
        total_count: trigramData.familyDynamics.totalCount,
        accuracy_percentage: Math.round(trigramData.familyDynamics.score * 100),
        issues: trigramData.familyDynamics.issues
      },
      
      recommendations: this.generateTrigramRecommendations(trigramData)
    };
  }

  analyzeHexagramBalance(hexagramData) {
    return {
      overall_score: hexagramData.overallScore,
      status: this.getStatusFromScore(hexagramData.overallScore),
      
      pure_hexagrams: {
        score: hexagramData.pureHexagrams.score,
        correct_count: hexagramData.pureHexagrams.correctCount,
        total_count: hexagramData.pureHexagrams.totalCount,
        issues: hexagramData.pureHexagrams.issues
      },
      
      sequence_alignment: {
        score: hexagramData.sequenceAlignment.score,
        correct_count: hexagramData.sequenceAlignment.correctCount,
        total_count: hexagramData.sequenceAlignment.totalCount,
        issues: hexagramData.sequenceAlignment.issues
      },
      
      symmetry_relationships: {
        score: hexagramData.symmetryRelationships.score,
        correct_count: hexagramData.symmetryRelationships.correctCount,
        total_count: hexagramData.symmetryRelationships.totalCount,
        issues: hexagramData.symmetryRelationships.issues
      },
      
      seasonal_hexagrams: {
        score: hexagramData.seasonalHexagrams.score,
        correct_count: hexagramData.seasonalHexagrams.correctCount,
        total_count: hexagramData.seasonalHexagrams.totalCount,
        issues: hexagramData.seasonalHexagrams.issues
      },
      
      recommendations: this.generateHexagramRecommendations(hexagramData)
    };
  }

  analyzeUltraSyncLogic(ultraSyncData) {
    return {
      overall_score: ultraSyncData.overallScore,
      status: this.getStatusFromScore(ultraSyncData.overallScore),
      
      basic_logics: {
        score: ultraSyncData.basicLogicValidation.score,
        correct_count: ultraSyncData.basicLogicValidation.correctCount,
        total_count: ultraSyncData.basicLogicValidation.totalCount,
        issues: ultraSyncData.basicLogicValidation.issues
      },
      
      advanced_logics: {
        score: ultraSyncData.advancedLogicValidation.score,
        correct_count: ultraSyncData.advancedLogicValidation.correctCount,
        total_count: ultraSyncData.advancedLogicValidation.totalCount,
        issues: ultraSyncData.advancedLogicValidation.issues
      },
      
      high_level_logics: {
        score: ultraSyncData.highLevelLogicValidation.score,
        correct_count: ultraSyncData.highLevelLogicValidation.correctCount,
        total_count: ultraSyncData.highLevelLogicValidation.totalCount,
        issues: ultraSyncData.highLevelLogicValidation.issues
      },
      
      logic_integration: {
        score: ultraSyncData.logicIntegration.score,
        aspects: ultraSyncData.logicIntegration.aspects,
        issues: ultraSyncData.logicIntegration.issues
      },
      
      recommendations: this.generateUltraSyncRecommendations(ultraSyncData)
    };
  }

  analyzeBunenjinAlignment(bunenjinData) {
    return {
      overall_score: bunenjinData.overallScore,
      status: this.getStatusFromScore(bunenjinData.overallScore),
      
      divided_performance: {
        score: bunenjinData.dividedPerformanceSupport.score,
        valid_count: bunenjinData.dividedPerformanceSupport.validCount,
        total_count: bunenjinData.dividedPerformanceSupport.totalCount,
        issues: bunenjinData.dividedPerformanceSupport.issues
      },
      
      situational_adaptation: {
        score: bunenjinData.situationalAdaptation.score,
        issues: bunenjinData.situationalAdaptation.issues
      },
      
      authentic_multiplicity: {
        score: bunenjinData.authenticMultiplicity.score,
        issues: bunenjinData.authenticMultiplicity.issues
      },
      
      harmonious_integration: {
        score: bunenjinData.harmoniousIntegration.score,
        issues: bunenjinData.harmoniousIntegration.issues
      },
      
      recommendations: this.generateBunenjinRecommendations(bunenjinData)
    };
  }

  analyzeLineApplication(lineData) {
    return {
      overall_score: lineData.overallScore,
      status: this.getStatusFromScore(lineData.overallScore),
      
      line_position_meanings: {
        score: lineData.linePositionMeanings.score,
        correct_count: lineData.linePositionMeanings.correctCount,
        total_count: lineData.linePositionMeanings.totalCount,
        issues: lineData.linePositionMeanings.issues
      },
      
      line_relationships: {
        score: lineData.lineRelationships.score,
        correspondence: lineData.lineRelationships.correspondence,
        adjacency: lineData.lineRelationships.adjacency,
        issues: lineData.lineRelationships.issues
      },
      
      correct_position_usage: {
        score: lineData.correctPositionUsage.score,
        issues: lineData.correctPositionUsage.issues
      },
      
      line_transformations: {
        score: lineData.lineTransformations.score,
        issues: lineData.lineTransformations.issues
      },
      
      recommendations: this.generateLineRecommendations(lineData)
    };
  }

  getStatusFromScore(score) {
    if (score >= 0.9) return { level: "優秀", color: "green" };
    if (score >= 0.8) return { level: "良好", color: "blue" };
    if (score >= 0.7) return { level: "改善要", color: "orange" };
    return { level: "要修正", color: "red" };
  }

  // ========== ビジュアライゼーション生成 ==========
  
  generateVisualizations(validationResults) {
    return {
      score_radar_chart: this.generateScoreRadarChart(validationResults),
      issue_distribution_chart: this.generateIssueDistributionChart(validationResults),
      improvement_priority_chart: this.generateImprovementPriorityChart(validationResults),
      score_trend_chart: this.generateScoreTrendChart(validationResults)
    };
  }

  generateScoreRadarChart(validationResults) {
    const domainScores = validationResults.overallAssessment.domainScores;
    
    return {
      type: "radar",
      title: "領域別スコア分布",
      data: {
        labels: [
          "八卦関係性",
          "64卦バランス", 
          "ウルトラシンクロジック",
          "bunenjin整合性",
          "爻辞適用"
        ],
        datasets: [{
          label: "現在のスコア",
          data: [
            Math.round(domainScores.trigramRelationships * 100),
            Math.round(domainScores.hexagramBalance * 100),
            Math.round(domainScores.ultraSyncLogic * 100),
            Math.round(domainScores.bunenjinAlignment * 100),
            Math.round(domainScores.lineApplication * 100)
          ],
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 2
        }]
      }
    };
  }

  generateIssueDistributionChart(validationResults) {
    const issues = validationResults.issues;
    
    return {
      type: "doughnut",
      title: "問題重要度別分布",
      data: {
        labels: ["重大", "重要", "軽微"],
        datasets: [{
          data: [
            issues.critical.length,
            issues.important.length,
            issues.minor.length
          ],
          backgroundColor: [
            "#FF6384",
            "#FF9F40",
            "#FFCD56"
          ]
        }]
      }
    };
  }

  generateImprovementPriorityChart(validationResults) {
    const priorities = validationResults.overallAssessment.improvementPriorities;
    
    return {
      type: "bar",
      title: "改善優先度",
      data: {
        labels: priorities.map(p => p.domain),
        datasets: [{
          label: "スコア",
          data: priorities.map(p => Math.round(p.score * 100)),
          backgroundColor: priorities.map(p => 
            p.urgency === "high" ? "#FF6384" :
            p.urgency === "medium" ? "#FF9F40" : "#36A2EB"
          )
        }]
      }
    };
  }

  generateScoreTrendChart(validationResults) {
    // 将来の改善予測チャート（現在は基準値として表示）
    return {
      type: "line",
      title: "スコア改善目標",
      data: {
        labels: ["現在", "1ヶ月後", "3ヶ月後", "6ヶ月後"],
        datasets: [{
          label: "目標スコア",
          data: [
            Math.round(validationResults.overallAssessment.overallScore * 100),
            Math.min(100, Math.round(validationResults.overallAssessment.overallScore * 100) + 10),
            Math.min(100, Math.round(validationResults.overallAssessment.overallScore * 100) + 20),
            Math.min(100, Math.round(validationResults.overallAssessment.overallScore * 100) + 30)
          ],
          borderColor: "#36A2EB",
          fill: false
        }]
      }
    };
  }

  // ========== 推奨事項セクション生成 ==========
  
  generateRecommendationsSection(validationResults) {
    return {
      immediate_actions: this.generateImmediateActions(validationResults),
      short_term_improvements: this.generateShortTermImprovements(validationResults),
      long_term_enhancements: this.generateLongTermEnhancements(validationResults),
      implementation_roadmap: this.generateImplementationRoadmap(validationResults)
    };
  }

  generateImmediateActions(validationResults) {
    return validationResults.recommendations
      .filter(rec => rec.urgency === "high")
      .map(rec => ({
        action: rec.recommendation,
        category: rec.category,
        timeline: "即座",
        effort: rec.estimatedEffort,
        impact: rec.expectedImpact,
        priority: 1
      }));
  }

  generateShortTermImprovements(validationResults) {
    return validationResults.recommendations
      .filter(rec => rec.urgency === "medium")
      .map(rec => ({
        action: rec.recommendation,
        category: rec.category,
        timeline: "1-2週間",
        effort: rec.estimatedEffort,
        impact: rec.expectedImpact,
        priority: 2
      }));
  }

  generateLongTermEnhancements(validationResults) {
    const longTermActions = [
      {
        action: "古典易経のさらなる深い研究と実装への反映",
        category: "知識基盤",
        timeline: "3-6ヶ月",
        effort: "大",
        impact: "高",
        priority: 3
      },
      {
        action: "多文化的な易経解釈の統合検討",
        category: "国際展開",
        timeline: "6-12ヶ月",
        effort: "大",
        impact: "中",
        priority: 4
      },
      {
        action: "AI技術を活用した動的な正統性チェック機能の開発",
        category: "技術革新",
        timeline: "12ヶ月以上",
        effort: "特大",
        impact: "高",
        priority: 5
      }
    ];
    
    return longTermActions;
  }

  generateImplementationRoadmap(validationResults) {
    const priorities = validationResults.overallAssessment.improvementPriorities;
    
    return {
      phase1: {
        name: "緊急修正フェーズ",
        duration: "1-2週間",
        targets: priorities.filter(p => p.urgency === "high").map(p => p.domain),
        goal: "重大な問題の解決"
      },
      phase2: {
        name: "品質向上フェーズ",
        duration: "1-2ヶ月",
        targets: priorities.filter(p => p.urgency === "medium").map(p => p.domain),
        goal: "全体的な品質の底上げ"
      },
      phase3: {
        name: "最適化フェーズ",
        duration: "3-6ヶ月",
        targets: ["パフォーマンス最適化", "新機能追加", "ユーザビリティ向上"],
        goal: "競合優位性の確立"
      }
    };
  }

  // ========== 付録生成 ==========
  
  generateAppendix(validationResults) {
    return {
      technical_details: this.generateTechnicalDetails(validationResults),
      standards_reference: this.generateStandardsReference(),
      glossary: this.generateGlossary(),
      bibliography: this.generateBibliography()
    };
  }

  generateTechnicalDetails(validationResults) {
    return {
      validation_methodology: "古典易経正統性基準に基づく5段階検証プロセス",
      scoring_algorithm: "重み付き平均スコア算出（八卦25%、64卦20%、ウルトラシンク25%、bunenjin15%、爻辞15%）",
      issue_classification: "重要度とスコアに基づく3段階分類（重大<0.6、重要0.6-0.8、軽微>0.8）",
      recommendation_logic: "優先度とインパクトの組み合わせによる段階的推奨事項"
    };
  }

  generateStandardsReference() {
    return {
      classical_sources: [
        "『易経』（周易）- 原典",
        "『十翼』- 易経注釈書",
        "『序卦伝』- 64卦の論理的配列",
        "『雑卦伝』- 卦の特性分析"
      ],
      modern_interpretations: [
        "bunenjin思想（平野啓一郎）",
        "多重人格理論",
        "状況的人格変動理論"
      ],
      technical_standards: [
        "八卦の正統な属性定義",
        "64卦の陰陽バランス基準",
        "爻位の位置的意味と関係性",
        "五行相生・相剋の正確な対応"
      ]
    };
  }

  generateGlossary() {
    return {
      "八卦": "易経の基本要素。乾・兌・離・震・巽・坎・艮・坤の8つの象徴",
      "64卦": "八卦を上下に組み合わせた64の卦（か）",
      "爻": "卦を構成する線。陰爻（⚋）と陽爻（⚊）がある",
      "序卦伝": "64卦の論理的配列を説明した古典文献",
      "互卦": "2,3,4爻と3,4,5爻から生成される隠れた卦",
      "錯卦": "全ての爻を陰陽反転させた卦",
      "綜卦": "卦を上下逆転させた卦",
      "bunenjin": "平野啓一郎による分人思想。一人の人間の複数の人格面"
    };
  }

  generateBibliography() {
    return [
      "『易経』（中国古典）",
      "平野啓一郎『私とは何か――「個人」から「分人」へ』講談社現代新書",
      "高田真治・後藤基巳訳『易経』岩波文庫",
      "加藤大岳『易学大講座』全12巻",
      "Jung, C.G. 'Synchronicity: An Acausal Connecting Principle'",
      "Wilhelm, Richard 'The I Ching or Book of Changes'"
    ];
  }

  // ========== HTML レポート生成 ==========
  
  generateHTMLReport(report, options) {
    return `<!DOCTYPE html>
<html lang="${options.language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${report.metadata.title}</title>
    <style>
        ${this.getReportCSS()}
    </style>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="report-container">
        ${this.generateHTMLHeader(report.metadata)}
        ${this.generateHTMLExecutiveSummary(report.executive_summary)}
        ${this.generateHTMLDetailedAnalysis(report.detailed_analysis)}
        ${options.includeCharts ? this.generateHTMLVisualizations(report.visualizations) : ''}
        ${this.generateHTMLRecommendations(report.recommendations)}
        ${options.includeDetails ? this.generateHTMLAppendix(report.appendix) : ''}
    </div>
    
    <script>
        ${this.getReportJavaScript(report.visualizations)}
    </script>
</body>
</html>`;
  }

  getReportCSS() {
    return `
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .report-container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 3px solid #2c3e50; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #2c3e50; margin: 0; font-size: 2.5em; }
        .header h2 { color: #7f8c8d; margin: 5px 0; font-size: 1.2em; font-weight: normal; }
        .metadata { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .metadata-item { background: #ecf0f1; padding: 15px; border-radius: 5px; text-align: center; }
        .metadata-item .label { font-size: 0.9em; color: #7f8c8d; margin-bottom: 5px; }
        .metadata-item .value { font-size: 1.3em; font-weight: bold; color: #2c3e50; }
        .section { margin: 40px 0; }
        .section h2 { color: #2c3e50; border-left: 4px solid #3498db; padding-left: 15px; margin-bottom: 20px; }
        .score-badge { display: inline-block; padding: 8px 15px; border-radius: 20px; color: white; font-weight: bold; margin: 5px; }
        .score-excellent { background-color: #27ae60; }
        .score-good { background-color: #3498db; }
        .score-needs-improvement { background-color: #f39c12; }
        .score-needs-fix { background-color: #e74c3c; }
        .issue-list { list-style: none; padding: 0; }
        .issue-item { background: #fff; border-left: 4px solid #e74c3c; padding: 15px; margin: 10px 0; border-radius: 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .recommendation { background: #e8f5e8; border-left: 4px solid #27ae60; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .chart-container { margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 5px; }
        .chart-container canvas { max-height: 400px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f1f1f1; font-weight: bold; }
    `;
  }

  generateHTMLHeader(metadata) {
    return `
        <div class="header">
            <h1>${metadata.title}</h1>
            <h2>${metadata.subtitle}</h2>
            <div class="metadata">
                <div class="metadata-item">
                    <div class="label">総合スコア</div>
                    <div class="value">${Math.round(metadata.overall_score * 100)}%</div>
                </div>
                <div class="metadata-item">
                    <div class="label">評価レベル</div>
                    <div class="value">${metadata.assessment_level}</div>
                </div>
                <div class="metadata-item">
                    <div class="label">総問題数</div>
                    <div class="value">${metadata.total_issues.total}</div>
                </div>
                <div class="metadata-item">
                    <div class="label">生成日時</div>
                    <div class="value">${new Date(metadata.generated_at).toLocaleString('ja-JP')}</div>
                </div>
            </div>
        </div>
    `;
  }

  generateHTMLExecutiveSummary(summary) {
    return `
        <div class="section">
            <h2>エグゼクティブサマリー</h2>
            <div class="score-badge ${this.getScoreClass(summary.overall_score)}">
                総合スコア: ${Math.round(summary.overall_score * 100)}% (${summary.assessment_level})
            </div>
            
            <h3>主要発見事項</h3>
            <ul>
                ${summary.key_findings.map(finding => `<li>${finding}</li>`).join('')}
            </ul>
            
            ${summary.critical_issues.length > 0 ? `
                <h3>重大な問題</h3>
                <ul class="issue-list">
                    ${summary.critical_issues.map(issue => `
                        <li class="issue-item">
                            <strong>${issue.domain}</strong>: スコア ${Math.round(issue.score * 100)}%
                        </li>
                    `).join('')}
                </ul>
            ` : ''}
            
            <h3>最優先推奨事項</h3>
            ${summary.primary_recommendations.map(rec => `
                <div class="recommendation">
                    <strong>${rec.category}</strong><br>
                    ${rec.recommendation}<br>
                    <small>影響度: ${rec.impact} | 工数: ${rec.effort}</small>
                </div>
            `).join('')}
        </div>
    `;
  }

  generateHTMLDetailedAnalysis(analysis) {
    // 詳細分析のHTML生成（長いため省略し、主要部分のみ実装）
    return `
        <div class="section">
            <h2>詳細分析</h2>
            <!-- 詳細分析内容をここに展開 -->
        </div>
    `;
  }

  generateHTMLVisualizations(visualizations) {
    if (!visualizations) return '';
    
    return `
        <div class="section">
            <h2>視覚的分析</h2>
            <div class="chart-container">
                <canvas id="scoreRadarChart"></canvas>
            </div>
            <div class="chart-container">
                <canvas id="issueDistributionChart"></canvas>
            </div>
        </div>
    `;
  }

  generateHTMLRecommendations(recommendations) {
    return `
        <div class="section">
            <h2>推奨事項</h2>
            
            <h3>即座の対応が必要</h3>
            ${recommendations.immediate_actions.map(action => `
                <div class="recommendation">
                    <strong>${action.category}</strong><br>
                    ${action.action}<br>
                    <small>期限: ${action.timeline} | 工数: ${action.effort} | 影響: ${action.impact}</small>
                </div>
            `).join('')}
            
            <h3>短期改善</h3>
            ${recommendations.short_term_improvements.map(improvement => `
                <div class="recommendation">
                    <strong>${improvement.category}</strong><br>
                    ${improvement.action}<br>
                    <small>期限: ${improvement.timeline} | 工数: ${improvement.effort} | 影響: ${improvement.impact}</small>
                </div>
            `).join('')}
        </div>
    `;
  }

  generateHTMLAppendix(appendix) {
    if (!appendix) return '';
    
    return `
        <div class="section">
            <h2>付録</h2>
            <!-- 付録内容 -->
        </div>
    `;
  }

  getReportJavaScript(visualizations) {
    if (!visualizations) return '';
    
    return `
        // Chart.js によるグラフ描画
        const ctx1 = document.getElementById('scoreRadarChart').getContext('2d');
        new Chart(ctx1, ${JSON.stringify(visualizations.score_radar_chart)});
        
        const ctx2 = document.getElementById('issueDistributionChart').getContext('2d');
        new Chart(ctx2, ${JSON.stringify(visualizations.issue_distribution_chart)});
    `;
  }

  getScoreClass(score) {
    if (score >= 0.9) return 'score-excellent';
    if (score >= 0.8) return 'score-good';
    if (score >= 0.7) return 'score-needs-improvement';
    return 'score-needs-fix';
  }

  // ========== 推奨事項生成ヘルパー ==========
  
  generateTrigramRecommendations(trigramData) {
    const recommendations = [];
    
    if (trigramData.oppositionRelationships.score < 0.8) {
      recommendations.push("八卦の対立関係を古典易経の先天八卦配置に基づいて修正してください");
    }
    if (trigramData.fiveElementCycles.score < 0.7) {
      recommendations.push("五行相生・相剋の実装を見直し、正確な循環関係を実装してください");
    }
    
    return recommendations;
  }

  generateHexagramRecommendations(hexagramData) {
    const recommendations = [];
    
    if (hexagramData.sequenceAlignment.score < 0.9) {
      recommendations.push("序卦伝の論理的順序を再検討し、64卦の配列を正しく実装してください");
    }
    
    return recommendations;
  }

  generateUltraSyncRecommendations(ultraSyncData) {
    const recommendations = [];
    
    if (ultraSyncData.basicLogicValidation.score < 0.8) {
      recommendations.push("基礎ロジック（1-5）の古典易経準拠性を強化してください");
    }
    
    return recommendations;
  }

  generateBunenjinRecommendations(bunenjinData) {
    const recommendations = [];
    
    if (bunenjinData.dividedPerformanceSupport.score < 0.8) {
      recommendations.push("Triple OS構造をbunenjin思想により適合するよう改善してください");
    }
    
    return recommendations;
  }

  generateLineRecommendations(lineData) {
    const recommendations = [];
    
    if (lineData.linePositionMeanings.score < 0.8) {
      recommendations.push("六爻の位置的意味を古典易経の基準に合わせて修正してください");
    }
    
    return recommendations;
  }

  // ========== Markdown/JSON 出力 ==========
  
  generateMarkdownReport(report, options) {
    // Markdown形式のレポート生成（簡略実装）
    return `# ${report.metadata.title}\n\n## エグゼクティブサマリー\n\n...`;
  }

  generateJSONReport(report, options) {
    return JSON.stringify(report, null, 2);
  }
}

// グローバル変数として登録
if (typeof window !== "undefined") {
  window.OrthodoxyReportGenerator = OrthodoxyReportGenerator;
  console.log("📊 Orthodoxy Report Generator loaded successfully");
}

// Node.js環境での使用
if (typeof module !== "undefined" && module.exports) {
  module.exports = OrthodoxyReportGenerator;
}