#!/usr/bin/env node

// run-orthodoxy-validation.js - 易経正統性検証実行スクリプト
// HAQEI Analyzer の実装を古典易経基準で検証し、具体的な改善提案を生成

const fs = require('fs');
const path = require('path');

/**
 * 易経正統性検証実行スクリプト
 * 
 * このスクリプトは Node.js 環境で実行され、
 * HAQEI Analyzer の現在の実装を分析し、
 * 古典易経の正統性基準に基づく詳細な検証レポートを生成します。
 */

class OrthodoxyValidationRunner {
  constructor() {
    this.projectRoot = process.cwd();
    this.issues = [];
    this.recommendations = [];
    this.scores = {};
    
    console.log("🔯 易経正統性検証システムを初期化中...");
    console.log(`📁 プロジェクトルート: ${this.projectRoot}`);
  }

  async run() {
    console.log("\n🚀 易経正統性検証を開始します...\n");
    
    try {
      // 1. 現在の実装を分析
      await this.analyzeCurrentImplementation();
      
      // 2. 5つの検証要素を実行
      await this.runAllValidations();
      
      // 3. 総合評価を生成
      const overallAssessment = this.generateOverallAssessment();
      
      // 4. レポートを生成・出力
      await this.generateAndSaveReport(overallAssessment);
      
      // 5. 結果をコンソールに表示
      this.displayResults(overallAssessment);
      
    } catch (error) {
      console.error("❌ 検証中にエラーが発生しました:", error);
      process.exit(1);
    }
  }

  // ========== 現在の実装分析 ==========
  
  async analyzeCurrentImplementation() {
    console.log("📊 現在の実装を分析中...");
    
    this.implementationData = {
      trigramRelationships: await this.analyzeTrigramRelationships(),
      hexagramData: await this.analyzeHexagramData(),
      ultraSyncLogic: await this.analyzeUltraSyncLogic(),
      tripleOSStructure: await this.analyzeTripleOSStructure(),
      lineApplications: await this.analyzeLineApplications()
    };
    
    console.log("✅ 実装分析完了");
  }

  async analyzeTrigramRelationships() {
    const relationshipsFile = path.join(this.projectRoot, 'public/js/os-analyzer/data/iching_relationships.js');
    
    if (!fs.existsSync(relationshipsFile)) {
      this.issues.push({
        severity: 'critical',
        category: '八卦関係性',
        description: 'iching_relationships.js ファイルが見つかりません',
        recommendation: 'ファイルを作成し、正統な八卦相互関係を定義してください'
      });
      return { hasImplementation: false };
    }
    
    const content = fs.readFileSync(relationshipsFile, 'utf8');
    
    // 対立関係の分析
    const oppositionMatches = content.match(/OPPOSING_RELATIONSHIPS\s*=\s*{([^}]+)}/s);
    const complementMatches = content.match(/COMPLEMENTARY_RELATIONSHIPS\s*=\s*{([^}]+)}/s);
    
    const analysis = {
      hasImplementation: true,
      hasOpposingRelationships: !!oppositionMatches,
      hasComplementaryRelationships: !!complementMatches,
      opposingPairsCount: oppositionMatches ? this.countOpposingPairs(oppositionMatches[1]) : 0,
      implementationQuality: 'good'
    };
    
    // 品質チェック
    if (analysis.opposingPairsCount < 8) {
      this.issues.push({
        severity: 'high',
        category: '八卦関係性',
        description: `対立関係の定義が不完全です（${analysis.opposingPairsCount}/8）`,
        recommendation: '8つの八卦すべての対立関係を正確に定義してください'
      });
    }
    
    return analysis;
  }

  countOpposingPairs(content) {
    const matches = content.match(/["']([^"']+)["']\s*:\s*["']([^"']+)["']/g);
    return matches ? matches.length / 2 : 0; // 双方向なので半分
  }

  async analyzeHexagramData() {
    const hexagramsFile = path.join(this.projectRoot, 'public/js/data/hexagrams.js');
    
    if (!fs.existsSync(hexagramsFile)) {
      this.issues.push({
        severity: 'critical',
        category: '64卦データ',
        description: 'hexagrams.js ファイルが見つかりません',
        recommendation: '64卦の完全なデータファイルを作成してください'
      });
      return { hasImplementation: false };
    }
    
    const content = fs.readFileSync(hexagramsFile, 'utf8');
    
    // 卦の数をカウント
    const hexagramMatches = content.match(/hexagram_id\s*:\s*\d+/g);
    const hexagramCount = hexagramMatches ? hexagramMatches.length : 0;
    
    // 陰陽バランスのチェック
    const yinYangBalance = this.analyzeYinYangBalance(content);
    
    const analysis = {
      hasImplementation: true,
      hexagramCount: hexagramCount,
      isComplete: hexagramCount === 64,
      yinYangBalance: yinYangBalance,
      implementationQuality: hexagramCount === 64 ? 'good' : 'needs_improvement'
    };
    
    if (!analysis.isComplete) {
      this.issues.push({
        severity: 'high',
        category: '64卦データ',
        description: `64卦のうち${hexagramCount}卦のみが定義されています`,
        recommendation: 'すべての64卦を定義し、古典易経の順序に従って配列してください'
      });
    }
    
    return analysis;
  }

  analyzeYinYangBalance(content) {
    // 簡略化した陰陽バランス分析
    const yangKeywords = ['創造', 'リーダーシップ', '行動', '力強い', '積極'];
    const yinKeywords = ['受容', '育成', 'サポート', '柔軟', '調和'];
    
    let yangCount = 0;
    let yinCount = 0;
    
    yangKeywords.forEach(keyword => {
      const matches = content.match(new RegExp(keyword, 'g'));
      yangCount += matches ? matches.length : 0;
    });
    
    yinKeywords.forEach(keyword => {
      const matches = content.match(new RegExp(keyword, 'g'));
      yinCount += matches ? matches.length : 0;
    });
    
    const total = yangCount + yinCount;
    const balance = total > 0 ? Math.abs(yangCount - yinCount) / total : 1;
    
    return {
      yangCount: yangCount,
      yinCount: yinCount,
      balanceScore: 1 - balance, // 0-1, 1が完全バランス
      isBalanced: balance < 0.2
    };
  }

  async analyzeUltraSyncLogic() {
    const ultraSyncFile = path.join(this.projectRoot, 'public/js/os-analyzer/core/IChingUltraSyncLogic.js');
    
    if (!fs.existsSync(ultraSyncFile)) {
      this.issues.push({
        severity: 'critical',
        category: 'ウルトラシンクロジック',
        description: 'IChingUltraSyncLogic.js ファイルが見つかりません',
        recommendation: 'ウルトラシンクロジック20を実装してください'
      });
      return { hasImplementation: false };
    }
    
    const content = fs.readFileSync(ultraSyncFile, 'utf8');
    
    // 20個のロジックメソッドを確認
    const expectedMethods = [
      'analyzeGreatTheme', 'analyzeInternalExternalInversion', 'analyzeTrigramResonance',
      'analyzeLineCorrespondence', 'analyzeFiveElementCycles', 'analyzeNuclearHexagram',
      'analyzeInvertedHexagram', 'analyzeFlippedHexagram', 'analyzeChangingHexagram',
      'analyzeSeasonalMismatch', 'analyzeRulerMinisterAlignment', 'analyzeComingGoing',
      'analyzeTimelyModeration', 'analyzeRitualOracle', 'analyzeFamilyDynamics',
      'analyzeVehicle', 'analyzeVessel', 'analyzeVirtue', 'analyzeSymbolicAnimals',
      'analyzeUnchanging'
    ];
    
    let implementedMethods = 0;
    const missingMethods = [];
    
    expectedMethods.forEach(method => {
      if (content.includes(method)) {
        implementedMethods++;
      } else {
        missingMethods.push(method);
      }
    });
    
    const analysis = {
      hasImplementation: true,
      implementedMethodsCount: implementedMethods,
      totalMethodsCount: expectedMethods.length,
      completionRate: implementedMethods / expectedMethods.length,
      missingMethods: missingMethods,
      implementationQuality: implementedMethods === 20 ? 'excellent' : 
                           implementedMethods >= 15 ? 'good' : 
                           implementedMethods >= 10 ? 'needs_improvement' : 'poor'
    };
    
    if (analysis.completionRate < 1.0) {
      this.issues.push({
        severity: analysis.completionRate < 0.5 ? 'high' : 'medium',
        category: 'ウルトラシンクロジック',
        description: `20個のロジックのうち${implementedMethods}個のみが実装されています`,
        recommendation: '残りのロジックを実装し、古典易経の原理に従って動作するよう調整してください',
        details: { missingMethods: missingMethods }
      });
    }
    
    return analysis;
  }

  async analyzeTripleOSStructure() {
    // Triple OS 構造の分析
    const engineFiles = this.findFiles('TripleOSEngine.js');
    const interfaceFiles = this.findFiles('Interface');
    const safeModeFiles = this.findFiles('SafeMode');
    
    const analysis = {
      hasTripleOSEngine: engineFiles.length > 0,
      hasInterfaceOS: interfaceFiles.length > 0,
      hasSafeModeOS: safeModeFiles.length > 0,
      bunenjinSupport: this.checkBunenjinSupport(),
      implementationQuality: 'good'
    };
    
    if (!analysis.hasTripleOSEngine) {
      this.issues.push({
        severity: 'critical',
        category: 'Triple OS',
        description: 'TripleOSEngine.js が見つかりません',
        recommendation: 'bunenjin哲学に基づくTriple OS構造を実装してください'
      });
    }
    
    return analysis;
  }

  async analyzeLineApplications() {
    // 爻辞レベルの適用分析
    const files = this.findFiles('hexagram_details.js');
    
    if (files.length === 0) {
      this.issues.push({
        severity: 'high',
        category: '爻辞適用',
        description: '詳細な卦情報ファイルが見つかりません',
        recommendation: '各卦の爻辞レベルでの詳細解釈を実装してください'
      });
      return { hasImplementation: false };
    }
    
    const content = fs.readFileSync(files[0], 'utf8');
    
    // 爻位情報の確認
    const linePositions = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
    let lineImplementationCount = 0;
    
    linePositions.forEach(position => {
      if (content.includes(position)) {
        lineImplementationCount++;
      }
    });
    
    const analysis = {
      hasImplementation: true,
      linePositionImplementation: lineImplementationCount,
      hasRelationshipAnalysis: content.includes('応') || content.includes('比'),
      implementationQuality: lineImplementationCount >= 4 ? 'good' : 'needs_improvement'
    };
    
    if (lineImplementationCount < 6) {
      this.issues.push({
        severity: 'medium',
        category: '爻辞適用',
        description: `六爻のうち${lineImplementationCount}爻のみが実装されています`,
        recommendation: 'すべての爻位の正統な意味と関係性を実装してください'
      });
    }
    
    return analysis;
  }

  // ========== 検証実行 ==========
  
  async runAllValidations() {
    console.log("🔍 5つの検証要素を実行中...");
    
    this.scores.trigramRelationships = this.validateTrigramRelationships();
    this.scores.hexagramBalance = this.validateHexagramBalance();
    this.scores.ultraSyncLogic = this.validateUltraSyncLogic();
    this.scores.bunenjinAlignment = this.validateBunenjinAlignment();
    this.scores.lineApplication = this.validateLineApplication();
    
    console.log("✅ 全検証完了");
  }

  validateTrigramRelationships() {
    const data = this.implementationData.trigramRelationships;
    
    if (!data.hasImplementation) return 0.0;
    
    let score = 0.5; // 基本実装で50%
    
    if (data.hasOpposingRelationships) score += 0.2;
    if (data.hasComplementaryRelationships) score += 0.2;
    if (data.opposingPairsCount >= 8) score += 0.1;
    
    return Math.min(score, 1.0);
  }

  validateHexagramBalance() {
    const data = this.implementationData.hexagramData;
    
    if (!data.hasImplementation) return 0.0;
    
    let score = 0.3; // 基本実装で30%
    
    if (data.isComplete) score += 0.4; // 64卦完備で40%追加
    if (data.yinYangBalance.isBalanced) score += 0.3; // バランスで30%追加
    
    return Math.min(score, 1.0);
  }

  validateUltraSyncLogic() {
    const data = this.implementationData.ultraSyncLogic;
    
    if (!data.hasImplementation) return 0.0;
    
    return data.completionRate; // 実装率がそのままスコア
  }

  validateBunenjinAlignment() {
    const data = this.implementationData.tripleOSStructure;
    
    let score = 0.0;
    
    if (data.hasTripleOSEngine) score += 0.4;
    if (data.hasInterfaceOS) score += 0.2;
    if (data.hasSafeModeOS) score += 0.2;
    if (data.bunenjinSupport) score += 0.2;
    
    return score;
  }

  validateLineApplication() {
    const data = this.implementationData.lineApplications;
    
    if (!data.hasImplementation) return 0.0;
    
    let score = 0.3; // 基本実装で30%
    
    score += (data.linePositionImplementation / 6) * 0.5; // 爻位実装で最大50%
    if (data.hasRelationshipAnalysis) score += 0.2; // 関係性分析で20%
    
    return Math.min(score, 1.0);
  }

  // ========== 総合評価生成 ==========
  
  generateOverallAssessment() {
    // 重み付きスコア計算
    const weights = {
      trigramRelationships: 0.25,
      hexagramBalance: 0.20,
      ultraSyncLogic: 0.25,
      bunenjinAlignment: 0.15,
      lineApplication: 0.15
    };
    
    const overallScore = 
      this.scores.trigramRelationships * weights.trigramRelationships +
      this.scores.hexagramBalance * weights.hexagramBalance +
      this.scores.ultraSyncLogic * weights.ultraSyncLogic +
      this.scores.bunenjinAlignment * weights.bunenjinAlignment +
      this.scores.lineApplication * weights.lineApplication;
    
    // 評価レベルの決定
    let assessmentLevel = "";
    if (overallScore >= 0.9) assessmentLevel = "優秀";
    else if (overallScore >= 0.8) assessmentLevel = "良好";
    else if (overallScore >= 0.7) assessmentLevel = "改善要";
    else assessmentLevel = "要修正";
    
    // 改善推奨事項の生成
    this.generateRecommendations();
    
    return {
      overallScore: overallScore,
      assessmentLevel: assessmentLevel,
      domainScores: this.scores,
      issues: this.issues,
      recommendations: this.recommendations,
      strengths: this.identifyStrengths(),
      weaknesses: this.identifyWeaknesses()
    };
  }

  generateRecommendations() {
    // スコアに基づく推奨事項
    Object.entries(this.scores).forEach(([domain, score]) => {
      if (score < 0.7) {
        this.recommendations.push({
          category: this.getDomainName(domain),
          urgency: score < 0.5 ? 'high' : 'medium',
          recommendation: this.getDomainRecommendation(domain),
          currentScore: Math.round(score * 100),
          targetScore: Math.min(100, Math.round(score * 100) + 30)
        });
      }
    });
  }

  getDomainName(domain) {
    const names = {
      trigramRelationships: '八卦相互関係性',
      hexagramBalance: '64卦陰陽バランス',
      ultraSyncLogic: 'ウルトラシンクロジック20',
      bunenjinAlignment: 'bunenjin哲学整合性',
      lineApplication: '爻辞レベル適用'
    };
    return names[domain] || domain;
  }

  getDomainRecommendation(domain) {
    const recommendations = {
      trigramRelationships: '古典易経の先天八卦・後天八卦配置に基づいて、八卦の対立・補完関係を正確に実装してください',
      hexagramBalance: '64卦すべてを定義し、序卦伝の論理的順序と陰陽バランスを正しく実装してください',
      ultraSyncLogic: '20個のロジックをすべて実装し、古典易経の原理に従って動作するよう調整してください',
      bunenjinAlignment: 'Triple OS構造をbunenjin思想により適合するよう設計し、分人機能を強化してください',
      lineApplication: '六爻すべての位置的意味と相互関係（応・比・中・正）を正確に実装してください'
    };
    return recommendations[domain] || '該当領域の改善が必要です';
  }

  identifyStrengths() {
    const strengths = [];
    
    Object.entries(this.scores).forEach(([domain, score]) => {
      if (score >= 0.8) {
        strengths.push(`${this.getDomainName(domain)}の実装が優秀（${Math.round(score * 100)}%）`);
      }
    });
    
    if (strengths.length === 0) {
      strengths.push("改善により大幅な品質向上が期待できます");
    }
    
    return strengths;
  }

  identifyWeaknesses() {
    const weaknesses = [];
    
    Object.entries(this.scores).forEach(([domain, score]) => {
      if (score < 0.7) {
        weaknesses.push(`${this.getDomainName(domain)}に重要な改善点（${Math.round(score * 100)}%）`);
      }
    });
    
    return weaknesses;
  }

  // ========== レポート生成・保存 ==========
  
  async generateAndSaveReport(assessment) {
    console.log("📝 レポートを生成中...");
    
    const report = this.generateTextReport(assessment);
    const reportPath = path.join(this.projectRoot, 'orthodoxy-validation-report.md');
    
    fs.writeFileSync(reportPath, report, 'utf8');
    
    console.log(`✅ レポートを保存しました: ${reportPath}`);
  }

  generateTextReport(assessment) {
    const timestamp = new Date().toLocaleString('ja-JP');
    
    return `# HAQEI Analyzer 易経正統性検証レポート

## 検証概要

- **検証日時**: ${timestamp}
- **総合スコア**: ${Math.round(assessment.overallScore * 100)}%
- **評価レベル**: ${assessment.assessmentLevel}
- **検証対象**: HAQEI Analyzer 易経実装

## エグゼクティブサマリー

HAQEI Analyzerの易経実装を古典易経の正統性基準で検証した結果、総合スコア${Math.round(assessment.overallScore * 100)}%（${assessment.assessmentLevel}）という結果となりました。

### 主要発見事項

${assessment.strengths.map(strength => `- ✅ ${strength}`).join('\n')}

${assessment.weaknesses.map(weakness => `- ⚠️ ${weakness}`).join('\n')}

## 詳細分析

### 領域別スコア

| 検証領域 | スコア | 状態 |
|---------|--------|------|
| 八卦相互関係性 | ${Math.round(this.scores.trigramRelationships * 100)}% | ${this.getStatusText(this.scores.trigramRelationships)} |
| 64卦陰陽バランス | ${Math.round(this.scores.hexagramBalance * 100)}% | ${this.getStatusText(this.scores.hexagramBalance)} |
| ウルトラシンクロジック20 | ${Math.round(this.scores.ultraSyncLogic * 100)}% | ${this.getStatusText(this.scores.ultraSyncLogic)} |
| bunenjin哲学整合性 | ${Math.round(this.scores.bunenjinAlignment * 100)}% | ${this.getStatusText(this.scores.bunenjinAlignment)} |
| 爻辞レベル適用 | ${Math.round(this.scores.lineApplication * 100)}% | ${this.getStatusText(this.scores.lineApplication)} |

### 発見された問題

${this.issues.map((issue, index) => `
#### ${index + 1}. ${issue.category} [${issue.severity.toUpperCase()}]

**問題**: ${issue.description}

**推奨対応**: ${issue.recommendation}

${issue.details ? `**詳細**: ${JSON.stringify(issue.details, null, 2)}` : ''}
`).join('\n')}

## 推奨事項

### 即座の対応が必要

${this.recommendations.filter(rec => rec.urgency === 'high').map((rec, index) => `
${index + 1}. **${rec.category}**
   - 現在のスコア: ${rec.currentScore}%
   - 目標スコア: ${rec.targetScore}%
   - 推奨対応: ${rec.recommendation}
`).join('\n')}

### 中期的改善

${this.recommendations.filter(rec => rec.urgency === 'medium').map((rec, index) => `
${index + 1}. **${rec.category}**
   - 現在のスコア: ${rec.currentScore}%
   - 目標スコア: ${rec.targetScore}%
   - 推奨対応: ${rec.recommendation}
`).join('\n')}

## 実装状況詳細

### 八卦相互関係性
- 実装状況: ${this.implementationData.trigramRelationships.hasImplementation ? '✅' : '❌'}
- 対立関係: ${this.implementationData.trigramRelationships.hasOpposingRelationships ? '✅' : '❌'}
- 補完関係: ${this.implementationData.trigramRelationships.hasComplementaryRelationships ? '✅' : '❌'}

### 64卦データ
- 実装状況: ${this.implementationData.hexagramData.hasImplementation ? '✅' : '❌'}
- 卦の数: ${this.implementationData.hexagramData.hexagramCount}/64
- 完全性: ${this.implementationData.hexagramData.isComplete ? '✅' : '❌'}

### ウルトラシンクロジック
- 実装状況: ${this.implementationData.ultraSyncLogic.hasImplementation ? '✅' : '❌'}
- 実装済みメソッド: ${this.implementationData.ultraSyncLogic.implementedMethodsCount}/20
- 完成度: ${Math.round(this.implementationData.ultraSyncLogic.completionRate * 100)}%

### Triple OS構造
- エンジンOS: ${this.implementationData.tripleOSStructure.hasTripleOSEngine ? '✅' : '❌'}
- インターフェースOS: ${this.implementationData.tripleOSStructure.hasInterfaceOS ? '✅' : '❌'}
- セーフモードOS: ${this.implementationData.tripleOSStructure.hasSafeModeOS ? '✅' : '❌'}

### 爻辞レベル適用
- 実装状況: ${this.implementationData.lineApplications.hasImplementation ? '✅' : '❌'}
- 爻位実装: ${this.implementationData.lineApplications.linePositionImplementation}/6
- 関係性分析: ${this.implementationData.lineApplications.hasRelationshipAnalysis ? '✅' : '❌'}

## 結論

${assessment.assessmentLevel === '要修正' ? 
`現在の実装は古典易経の基準から大きく逸脱しており、緊急の修正が必要です。特に${this.getLowestScoringDomain()}の改善を優先的に行ってください。` :
assessment.assessmentLevel === '改善要' ?
`実装には改善の余地がありますが、段階的な修正により品質を向上させることができます。${this.getLowestScoringDomain()}から改善を始めることを推奨します。` :
assessment.assessmentLevel === '良好' ?
`実装は概ね良好ですが、より高い品質を目指すためのいくつかの改善点があります。` :
`実装は古典易経の正統性を高いレベルで維持しており、優秀な品質です。継続的な改善により、さらなる向上が期待できます。`}

## 参考資料

- 『易経』（周易）- 原典
- 『序卦伝』- 64卦の論理的配列
- bunenjin思想（平野啓一郎）
- 古典易経研究文献

---

*このレポートは古典易経の正統性基準に基づく自動検証システムにより生成されました。*
*継続的な改善により、より高い品質の易経実装を目指してください。*
`;
  }

  getStatusText(score) {
    if (score >= 0.9) return "優秀";
    if (score >= 0.8) return "良好";
    if (score >= 0.7) return "改善要";
    return "要修正";
  }

  getLowestScoringDomain() {
    let lowestDomain = '';
    let lowestScore = 1.0;
    
    Object.entries(this.scores).forEach(([domain, score]) => {
      if (score < lowestScore) {
        lowestScore = score;
        lowestDomain = this.getDomainName(domain);
      }
    });
    
    return lowestDomain;
  }

  // ========== 結果表示 ==========
  
  displayResults(assessment) {
    console.log("\n" + "=".repeat(60));
    console.log("🔯 HAQEI Analyzer 易経正統性検証結果");
    console.log("=".repeat(60));
    
    console.log(`\n📊 総合評価: ${Math.round(assessment.overallScore * 100)}% (${assessment.assessmentLevel})`);
    
    console.log("\n📈 領域別スコア:");
    Object.entries(this.scores).forEach(([domain, score]) => {
      const emoji = score >= 0.8 ? "✅" : score >= 0.7 ? "⚠️" : "❌";
      console.log(`  ${emoji} ${this.getDomainName(domain)}: ${Math.round(score * 100)}%`);
    });
    
    console.log("\n💪 強み:");
    assessment.strengths.forEach(strength => {
      console.log(`  ✅ ${strength}`);
    });
    
    console.log("\n⚠️ 改善点:");
    assessment.weaknesses.forEach(weakness => {
      console.log(`  ⚠️ ${weakness}`);
    });
    
    if (this.issues.length > 0) {
      console.log(`\n🚨 発見された問題: ${this.issues.length}件`);
      this.issues.forEach((issue, index) => {
        console.log(`  ${index + 1}. [${issue.severity.toUpperCase()}] ${issue.category}: ${issue.description}`);
      });
    }
    
    if (this.recommendations.length > 0) {
      console.log(`\n💡 推奨事項: ${this.recommendations.length}件`);
      this.recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. [${rec.urgency.toUpperCase()}] ${rec.category}: ${rec.recommendation}`);
      });
    }
    
    console.log("\n📄 詳細レポートが orthodoxy-validation-report.md に保存されました");
    console.log("=".repeat(60));
  }

  // ========== ユーティリティ ==========
  
  findFiles(pattern) {
    const files = [];
    
    function searchDir(dir) {
      try {
        if (!fs.existsSync(dir)) return;
        
        const items = fs.readdirSync(dir);
        items.forEach(item => {
          try {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
              searchDir(fullPath);
            } else if (item.includes(pattern)) {
              files.push(fullPath);
            }
          } catch (error) {
            // シンボリックリンクエラーなどを無視
            console.warn(`⚠️ ファイルアクセスエラーを無視: ${item}`);
          }
        });
      } catch (error) {
        console.warn(`⚠️ ディレクトリアクセスエラーを無視: ${dir}`);
      }
    }
    
    searchDir(this.projectRoot);
    return files;
  }

  checkBunenjinSupport() {
    // bunenjin機能のサポート確認
    const files = this.findFiles('bunenjin');
    return files.length > 0 || this.findFiles('分人').length > 0;
  }
}

// ========== メイン実行 ==========

async function main() {
  const runner = new OrthodoxyValidationRunner();
  await runner.run();
}

// スクリプトとして実行された場合
if (require.main === module) {
  main().catch(error => {
    console.error("❌ 実行エラー:", error);
    process.exit(1);
  });
}

module.exports = OrthodoxyValidationRunner;