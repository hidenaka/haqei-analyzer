/**
 * Phase 2 統合表現エンジン統一性チェック・検証
 * 20250816_implementation_optimization_roadmap.md Phase 2完了確認
 */

const fs = require('fs');
const path = require('path');

// DOM環境セットアップ
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;

// 検証結果
const results = {
  passed: 0,
  failed: 0,
  errors: []
};

function assert(condition, message) {
  if (!condition) {
    results.failed++;
    results.errors.push(message);
    console.log(`❌ ${message}`);
    return false;
  } else {
    results.passed++;
    console.log(`✅ ${message}`);
    return true;
  }
}

async function verifyPhase2Integration() {
  console.log('🔬 Phase 2 統合表現エンジン統一性チェック開始\n');

  // ファイル存在確認
  console.log('📁 ファイル存在確認...');
  const requiredFiles = [
    'public/js/core/EnhancedH384DataExtractor.js',
    'public/js/core/ExpressionVariationEngine.js',
    'public/js/core/ExpressionQualityValidator.js',
    'public/js/future-simulator-expression.js',
    'public/js/future-simulator-expression-helpers.js',
    'dist/js/core/EnhancedH384DataExtractor.js',
    'dist/js/core/ExpressionVariationEngine.js',
    'dist/js/core/ExpressionQualityValidator.js'
  ];

  requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    assert(fs.existsSync(filePath), `必須ファイル存在確認: ${file}`);
  });

  // ファイル同期性チェック
  console.log('\n🔄 ファイル同期性チェック...');
  const syncFiles = [
    'EnhancedH384DataExtractor.js',
    'ExpressionVariationEngine.js', 
    'ExpressionQualityValidator.js'
  ];

  syncFiles.forEach(filename => {
    const publicPath = path.join(__dirname, 'public/js/core', filename);
    const distPath = path.join(__dirname, 'dist/js/core', filename);
    
    if (fs.existsSync(publicPath) && fs.existsSync(distPath)) {
      const publicContent = fs.readFileSync(publicPath, 'utf8');
      const distContent = fs.readFileSync(distPath, 'utf8');
      assert(publicContent === distContent, `ファイル同期確認: ${filename}`);
    }
  });

  // クラス読み込みテスト
  console.log('\n📚 クラス読み込みテスト...');
  try {
    // 依存関係の順序で読み込み
    // 1. EnhancedH384DataExtractor
    const h384Code = fs.readFileSync(path.join(__dirname, 'public/js/core/EnhancedH384DataExtractor.js'), 'utf8');
    eval(h384Code);
    const EnhancedH384DataExtractor = global.window.EnhancedH384DataExtractor;
    assert(typeof EnhancedH384DataExtractor === 'function', 'EnhancedH384DataExtractor クラス読み込み');

    // 2. ExpressionVariationEngine
    const variationCode = fs.readFileSync(path.join(__dirname, 'public/js/core/ExpressionVariationEngine.js'), 'utf8');
    eval(variationCode);
    const ExpressionVariationEngine = global.window.ExpressionVariationEngine;
    assert(typeof ExpressionVariationEngine === 'function', 'ExpressionVariationEngine クラス読み込み');

    // 3. ExpressionQualityValidator
    const validatorCode = fs.readFileSync(path.join(__dirname, 'public/js/core/ExpressionQualityValidator.js'), 'utf8');
    eval(validatorCode);
    const ExpressionQualityValidator = global.window.ExpressionQualityValidator;
    assert(typeof ExpressionQualityValidator === 'function', 'ExpressionQualityValidator クラス読み込み');

    // 4. FutureSimulatorExpression（依存クラスが全て読み込まれた後）
    const expressionCode = fs.readFileSync(path.join(__dirname, 'public/js/future-simulator-expression.js'), 'utf8');
    eval(expressionCode);
    
    // 5. Helper関数
    const helpersCode = fs.readFileSync(path.join(__dirname, 'public/js/future-simulator-expression-helpers.js'), 'utf8');
    eval(helpersCode);
    
    const FutureSimulatorExpression = global.window.FutureSimulatorExpression;
    assert(typeof FutureSimulatorExpression === 'function', 'FutureSimulatorExpression クラス読み込み');

    // インスタンス生成テスト
    console.log('\n🏗️  インスタンス生成テスト...');
    
    const h384Extractor = new EnhancedH384DataExtractor();
    assert(h384Extractor instanceof EnhancedH384DataExtractor, 'EnhancedH384DataExtractor インスタンス生成');
    assert(h384Extractor.dataCache instanceof Map, 'H384DataExtractor キャッシュ初期化');

    const variationEngine = new ExpressionVariationEngine();
    assert(variationEngine instanceof ExpressionVariationEngine, 'ExpressionVariationEngine インスタンス生成');
    assert(typeof variationEngine.variationPatterns === 'object', 'VariationEngine パターン初期化');

    const qualityValidator = new ExpressionQualityValidator();
    assert(qualityValidator instanceof ExpressionQualityValidator, 'ExpressionQualityValidator インスタンス生成');
    assert(typeof qualityValidator.validationRules === 'object', 'QualityValidator ルール初期化');

    const expression = new FutureSimulatorExpression();
    assert(expression instanceof FutureSimulatorExpression, 'FutureSimulatorExpression インスタンス生成');
    assert(typeof expression.h384Extractor === 'object', 'H384抽出器統合確認');
    assert(typeof expression.variationEngine === 'object', 'バリエーションエンジン統合確認');
    assert(typeof expression.qualityValidator === 'object', '品質検証器統合確認');

    // 機能統合テスト
    console.log('\n⚙️  機能統合テスト...');

    // モックデータ設定
    global.window.H384_DATA = [{
      '卦番号': 1,
      '爻': '初九', 
      'キーワード': ['創造', '始動'],
      '現代解釈の要約': 'テスト解釈内容',
      'S7_総合評価スコア': 75,
      'S5_主体性推奨スタンス': '能動'
    }];

    // Enhanced H384データ抽出テスト
    const extractedData = h384Extractor.extractMultiDimensionalData(1, 0);
    assert(typeof extractedData === 'object', 'H384多次元データ抽出');
    assert(extractedData._enhanced === true, 'データ強化マーク確認');
    assert(typeof extractedData._features === 'object', '特徴データ抽出確認');
    assert(typeof extractedData._metadata === 'object', 'メタデータ生成確認');

    // 表現バリエーション生成テスト
    const baseExpression = 'HaQei分析によると、この状況では順調な発展が予測されます';
    const variationResult = variationEngine.generateVariation(baseExpression, 1, 'moderate');
    assert(typeof variationResult === 'object', 'バリエーション生成結果');
    assert(typeof variationResult.variation === 'string', 'バリエーション表現生成');
    assert(variationResult.variation !== baseExpression, 'バリエーション差異確認');
    assert(typeof variationResult.variationMetrics === 'object', 'バリエーション指標生成');

    // 品質検証テスト
    const testExpression = 'HaQei分析によると、適度な取り組みにより、バランスよく状況が改善していくことが見込まれます';
    const validationResult = qualityValidator.validateExpression(testExpression);
    assert(typeof validationResult === 'object', '品質検証結果');
    assert(typeof validationResult.overallScore === 'number', '総合スコア生成');
    assert(typeof validationResult.grade === 'string', '品質等級生成');
    assert(validationResult.overallScore >= 0 && validationResult.overallScore <= 100, 'スコア範囲妥当性');

    // 統合表現エンジンテスト
    const mockScenario = {
      id: 1,
      originalId: 1,
      phases: [
        { score: 50, scenarioId: 1, data: { 'キーワード': ['基準'], 'S7_総合評価スコア': 50 } },
        { score: 65, scenarioId: 1, data: { 'キーワード': ['発展'], 'S7_総合評価スコア': 65 } },
        { score: 70, scenarioId: 1, data: { 'キーワード': ['安定'], 'S7_総合評価スコア': 70 } }
      ],
      trend: '上昇トレンド'
    };

    const cardSummary = expression.generateCardSummary(mockScenario);
    assert(typeof cardSummary === 'object', '統合カード表現生成');
    assert(typeof cardSummary.qualityScore === 'number', 'カード品質スコア');
    assert(typeof cardSummary.strategyName === 'string', '戦略名生成');
    assert(typeof cardSummary.shortDescription === 'string', '短縮説明生成');

    const comprehensiveEvaluation = expression.generateComprehensiveEvaluation(mockScenario);
    assert(typeof comprehensiveEvaluation === 'object', '総合評価生成');
    assert(typeof comprehensiveEvaluation.result === 'string', '評価結果文字列');
    assert(typeof comprehensiveEvaluation.process === 'string', 'プロセス説明');
    assert(comprehensiveEvaluation.systemVersion === '2.0-Integrated', 'システムバージョン確認');

    // 戦略タイプ分散テスト
    console.log('\n🎯 戦略タイプ分散テスト...');
    const strategyTypes = [];
    for (let i = 1; i <= 8; i++) {
      const scenario = {
        phases: [
          { score: 50, scenarioId: i, data: { 'キーワード': ['基準'], 'S7_総合評価スコア': 50 } },
          { score: 50 + i * 5, scenarioId: i, data: { 'キーワード': ['変化'], 'S7_総合評価スコア': 50 + i * 5 } }
        ]
      };
      const strategyType = expression.determineStrategyType(scenario.phases);
      strategyTypes.push(strategyType.type);
    }

    const uniqueStrategyTypes = new Set(strategyTypes);
    assert(uniqueStrategyTypes.size >= 4, `戦略タイプ分散確認: ${uniqueStrategyTypes.size}/8種類 (4+種類必要)`);
    console.log(`   📊 生成された戦略タイプ: ${Array.from(uniqueStrategyTypes).join(', ')}`);

    // HaQei統一性チェック
    console.log('\n🎨 HaQei統一性チェック...');
    const haqeiTexts = [
      comprehensiveEvaluation.logic,
      comprehensiveEvaluation.process,
      cardSummary.shortDescription
    ];
    const haqeiMentions = haqeiTexts.filter(text => text && text.includes('HaQei')).length;
    assert(haqeiMentions >= 2, `HaQei統一性確認: ${haqeiMentions}/3箇所でHaQei言及`);

    // データ活用率テスト
    console.log('\n📈 データ活用率テスト...');
    if (typeof expression.calculateDataUtilizationRate === 'function') {
      const utilizationRate = expression.calculateDataUtilizationRate();
      assert(typeof utilizationRate === 'object', 'データ活用率計算');
      assert(typeof utilizationRate.utilizationScore === 'number', '活用スコア生成');
      console.log(`   📊 データ活用スコア: ${utilizationRate.utilizationScore}%`);
    }

  } catch (error) {
    results.failed++;
    results.errors.push(`統合テスト実行エラー: ${error.message}`);
    console.log(`❌ 統合テスト実行エラー: ${error.message}`);
  }

  // 結果報告
  console.log('\n' + '='.repeat(60));
  console.log('📋 Phase 2 統合表現エンジン統一性チェック結果');
  console.log('='.repeat(60));
  console.log(`✅ 成功: ${results.passed} テスト`);
  console.log(`❌ 失敗: ${results.failed} テスト`);
  
  if (results.errors.length > 0) {
    console.log('\n🚨 エラー詳細:');
    results.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }

  const successRate = Math.round((results.passed / (results.passed + results.failed)) * 100);
  console.log(`\n📊 成功率: ${successRate}%`);

  if (successRate >= 90) {
    console.log('\n🎉 Phase 2統合表現エンジンの統一性チェック完了 - 高品質');
  } else if (successRate >= 75) {
    console.log('\n✅ Phase 2統合表現エンジンの統一性チェック完了 - 良好');
  } else {
    console.log('\n⚠️  Phase 2統合表現エンジンの統一性チェック完了 - 要改善');
  }

  return {
    passed: results.passed,
    failed: results.failed,
    successRate: successRate,
    errors: results.errors
  };
}

// メイン実行
if (require.main === module) {
  verifyPhase2Integration().catch(console.error);
}

module.exports = { verifyPhase2Integration };