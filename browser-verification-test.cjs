/**
 * Browser Verification Test - Phase 2統合表現エンジン
 * 実際のブラウザ環境でのFuture Simulator機能検証
 * 
 * @date 2025-08-16
 */

// DOM環境セットアップ
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// グローバルDOM環境構築
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head>
    <title>Future Simulator Test</title>
</head>
<body>
    <div id="main-content">
        <div id="scenario-cards"></div>
        <div id="results"></div>
    </div>
</body>
</html>
`, {
  url: 'http://localhost:8788/future_simulator.html',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.console = console;

/**
 * 実際のファイル読み込みシミュレーション
 */
async function loadSystemFiles() {
  console.log('🔄 システムファイル読み込み開始...');
  
  try {
    // Phase 2実装ファイル順次読み込み（依存関係順序）
    const files = [
      'public/js/core/EnhancedH384DataExtractor.js',
      'public/js/core/ExpressionVariationEngine.js',
      'public/js/core/ExpressionQualityValidator.js',
      'public/js/future-simulator-expression.js',
      'public/js/future-simulator-expression-helpers.js'
    ];
    
    for (const file of files) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        try {
          const code = fs.readFileSync(filePath, 'utf8');
          eval(code);
          console.log(`✅ 読み込み完了: ${file}`);
        } catch (fileError) {
          console.log(`⚠️ ファイル実行エラー: ${file} - ${fileError.message}`);
        }
      } else {
        console.log(`❌ ファイル未発見: ${file}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error(`🚨 ファイル読み込みエラー: ${error.message}`);
    return false;
  }
}

/**
 * H384モックデータ設定
 */
function setupMockData() {
  console.log('📊 モックデータ設定...');
  
  global.window.H384_DATA = [
    {
      '卦番号': 1,
      '爻': '初九',
      'キーワード': ['創造', '始動', '積極'],
      '現代解釈の要約': '新しい始まりの時期で、積極的に行動することで大きな成果を得られる',
      'S7_総合評価スコア': 75,
      'S5_主体性推奨スタンス': '能動',
      'S3_安定性スコア': 60,
      'S4_リスク': 15,
      'S6_変動性スコア': 70
    },
    {
      '卦番号': 2,
      '爻': '六二',
      'キーワード': ['受容', '調和', '安定'],
      '現代解釈の要約': '受け入れることで調和を生み出し、安定した基盤を築くことができる',
      'S7_総合評価スコア': 65,
      'S5_主体性推奨スタンス': '受動',
      'S3_安定性スコア': 80,
      'S4_リスク': 5,
      'S6_変動性スコア': 40
    },
    {
      '卦番号': 3,
      '爻': '九三',
      'キーワード': ['困難', '挑戦', '成長'],
      '現代解釈の要約': '困難な状況だが、挑戦を通じて大きな成長を遂げることができる',
      'S7_総合評価スコア': 55,
      'S5_主体性推奨スタンス': '能動',
      'S3_安定性スコア': 45,
      'S4_リスク': 25,
      'S6_変動性スコア': 85
    }
  ];
  
  console.log('✅ モックデータ設定完了');
}

/**
 * Phase 2統合表現エンジンテスト
 */
async function testIntegratedExpressionEngine() {
  console.log('\n🎯 Phase 2統合表現エンジン検証開始');
  
  const results = {
    passed: 0,
    failed: 0,
    errors: []
  };
  
  try {
    // 1. クラス初期化テスト
    console.log('\n1️⃣ クラス初期化テスト');
    
    // クラス存在確認
    if (typeof global.window.FutureSimulatorExpression === 'undefined') {
      console.log('❌ FutureSimulatorExpressionクラスが見つかりません');
      results.failed++;
      results.errors.push('FutureSimulatorExpressionクラスが未定義');
      return results;
    }
    
    const expression = new global.window.FutureSimulatorExpression();
    
    if (expression.h384Extractor && expression.variationEngine && expression.qualityValidator) {
      console.log('✅ 統合表現エンジン初期化成功');
      results.passed++;
    } else {
      console.log('❌ 統合表現エンジン初期化失敗');
      results.failed++;
      results.errors.push('統合表現エンジン初期化失敗');
    }
    
    // 2. Enhanced H384データ抽出テスト
    console.log('\n2️⃣ Enhanced H384データ抽出テスト');
    const extractedData = expression.h384Extractor.extractMultiDimensionalData(1, 0);
    
    if (extractedData._enhanced && extractedData._features && extractedData._metadata) {
      console.log('✅ H384データ抽出・強化成功');
      console.log(`   📊 品質スコア: ${extractedData._qualityScore}`);
      console.log(`   🎯 特徴量: ${Object.keys(extractedData._features).length}個`);
      results.passed++;
    } else {
      console.log('❌ H384データ抽出失敗');
      results.failed++;
      results.errors.push('H384データ抽出失敗');
    }
    
    // 3. 表現バリエーション生成テスト
    console.log('\n3️⃣ 表現バリエーション生成テスト');
    const baseExpression = 'HaQei分析によると、この状況では順調な発展が予測されます';
    const variationResult = expression.variationEngine.generateVariation(baseExpression, 1, 'moderate');
    
    if (variationResult.variation && variationResult.variation !== baseExpression) {
      console.log('✅ 表現バリエーション生成成功');
      console.log(`   📝 原文: ${baseExpression}`);
      console.log(`   🎨 変換: ${variationResult.variation}`);
      console.log(`   📊 多様性スコア: ${variationResult.variationMetrics.diversityScore}%`);
      results.passed++;
    } else {
      console.log('❌ 表現バリエーション生成失敗');
      results.failed++;
      results.errors.push('表現バリエーション生成失敗');
    }
    
    // 4. 品質検証テスト
    console.log('\n4️⃣ 品質検証テスト');
    const testExpression = 'HaQei分析によると、適度な取り組みにより、バランスよく状況が改善していくことが見込まれます';
    const validationResult = expression.qualityValidator.validateExpression(testExpression);
    
    if (validationResult.overallScore && validationResult.grade && validationResult.passed !== undefined) {
      console.log('✅ 品質検証成功');
      console.log(`   📊 総合スコア: ${validationResult.overallScore}点`);
      console.log(`   🏆 品質等級: ${validationResult.grade}`);
      console.log(`   ✅ 合格: ${validationResult.passed ? 'はい' : 'いいえ'}`);
      if (validationResult.suggestions.length > 0) {
        console.log(`   💡 改善提案: ${validationResult.suggestions[0]}`);
      }
      results.passed++;
    } else {
      console.log('❌ 品質検証失敗');
      results.failed++;
      results.errors.push('品質検証失敗');
    }
    
    // 5. 統合システム動作テスト（シナリオ生成）
    console.log('\n5️⃣ 統合システム動作テスト');
    const mockScenario = {
      id: 1,
      originalId: 1,
      phases: [
        { score: 50, scenarioId: 1, data: { 'キーワード': ['基準'], 'S7_総合評価スコア': 50 } },
        { score: 65, scenarioId: 1, data: { 'キーワード': ['発展'], 'S7_総合評価スコア': 65 } },
        { score: 75, scenarioId: 1, data: { 'キーワード': ['成功'], 'S7_総合評価スコア': 75 } }
      ],
      trend: '上昇トレンド'
    };
    
    const cardSummary = expression.generateCardSummary(mockScenario);
    
    if (cardSummary.strategyName && cardSummary.shortDescription && cardSummary.qualityScore !== undefined) {
      console.log('✅ 統合システム動作成功');
      console.log(`   🎯 戦略タイプ: ${cardSummary.strategyIcon} ${cardSummary.strategyName}`);
      console.log(`   📝 短縮説明: ${cardSummary.shortDescription}`);
      console.log(`   ⭐ 難易度: ${cardSummary.difficulty}`);
      console.log(`   📊 品質スコア: ${cardSummary.qualityScore.overallScore || cardSummary.qualityScore}点`);
      results.passed++;
    } else {
      console.log('❌ 統合システム動作失敗');
      results.failed++;
      results.errors.push('統合システム動作失敗');
    }
    
    // 6. 戦略タイプ分散テスト
    console.log('\n6️⃣ 戦略タイプ分散テスト');
    const strategies = [];
    for (let i = 1; i <= 8; i++) {
      const scenario = {
        phases: [
          { score: 50, scenarioId: i, data: { 'キーワード': ['基準'], 'S7_総合評価スコア': 50 } },
          { score: 50 + i * 5, scenarioId: i, data: { 'キーワード': ['変化'], 'S7_総合評価スコア': 50 + i * 5 } }
        ]
      };
      const strategyType = expression.determineStrategyType(scenario.phases);
      strategies.push(strategyType.type);
    }
    
    const uniqueStrategies = new Set(strategies);
    if (uniqueStrategies.size >= 4) {
      console.log('✅ 戦略タイプ分散成功');
      console.log(`   📊 生成タイプ数: ${uniqueStrategies.size}/8`);
      console.log(`   🎯 タイプ一覧: ${Array.from(uniqueStrategies).join(', ')}`);
      results.passed++;
    } else {
      console.log('❌ 戦略タイプ分散不足');
      console.log(`   📊 生成タイプ数: ${uniqueStrategies.size}/8 (4+必要)`);
      results.failed++;
      results.errors.push(`戦略タイプ分散不足: ${uniqueStrategies.size}種類`);
    }
    
    // 7. HaQei統一性テスト
    console.log('\n7️⃣ HaQei統一性テスト');
    const comprehensiveEvaluation = expression.generateComprehensiveEvaluation(mockScenario);
    const haqeiMentions = [
      comprehensiveEvaluation.logic,
      comprehensiveEvaluation.process,
      cardSummary.shortDescription
    ].filter(text => text && text.includes('HaQei')).length;
    
    if (haqeiMentions >= 2) {
      console.log('✅ HaQei統一性確認');
      console.log(`   📝 HaQei言及: ${haqeiMentions}/3箇所`);
      results.passed++;
    } else {
      console.log('❌ HaQei統一性不足');
      console.log(`   📝 HaQei言及: ${haqeiMentions}/3箇所 (2+必要)`);
      results.failed++;
      results.errors.push(`HaQei統一性不足: ${haqeiMentions}箇所`);
    }
    
  } catch (error) {
    console.error(`🚨 テスト実行エラー: ${error.message}`);
    results.failed++;
    results.errors.push(`テスト実行エラー: ${error.message}`);
  }
  
  return results;
}

/**
 * 検証結果レポート生成
 */
function generateVerificationReport(results) {
  const totalTests = results.passed + results.failed;
  const successRate = Math.round((results.passed / totalTests) * 100);
  
  console.log('\n' + '='.repeat(60));
  console.log('📋 Phase 2統合表現エンジン ユーザー画面検証結果');
  console.log('='.repeat(60));
  console.log(`✅ 成功: ${results.passed} テスト`);
  console.log(`❌ 失敗: ${results.failed} テスト`);
  console.log(`📊 成功率: ${successRate}%`);
  
  if (results.errors.length > 0) {
    console.log('\n🚨 検出された問題:');
    results.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }
  
  // 評価
  let evaluation;
  if (successRate >= 90) {
    evaluation = '🎉 優秀 - Production Ready';
  } else if (successRate >= 75) {
    evaluation = '✅ 良好 - Minor Issues';
  } else if (successRate >= 60) {
    evaluation = '⚠️ 改善要 - Major Issues';
  } else {
    evaluation = '🚨 不合格 - Critical Issues';
  }
  
  console.log(`\n📊 総合評価: ${evaluation}`);
  
  return {
    totalTests,
    successRate,
    evaluation,
    errors: results.errors
  };
}

/**
 * メイン実行関数
 */
async function runBrowserVerification() {
  console.log('🔍 Phase 2統合表現エンジン ブラウザ検証開始');
  console.log(`📅 実行日時: ${new Date().toISOString()}`);
  
  // ファイル読み込み
  const filesLoaded = await loadSystemFiles();
  if (!filesLoaded) {
    console.error('❌ ファイル読み込み失敗により検証中止');
    return;
  }
  
  // モックデータセットアップ
  setupMockData();
  
  // 統合システムテスト実行
  const testResults = await testIntegratedExpressionEngine();
  
  // レポート生成
  const report = generateVerificationReport(testResults);
  
  return {
    ...report,
    timestamp: new Date().toISOString(),
    testDetails: testResults
  };
}

// メイン実行
if (require.main === module) {
  runBrowserVerification().catch(console.error);
}

module.exports = { runBrowserVerification };