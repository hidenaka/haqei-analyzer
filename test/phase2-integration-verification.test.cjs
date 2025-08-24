/**
 * Phase 2 統合表現エンジン統一性チェック・検証テスト
 * 20250816_implementation_optimization_roadmap.md Phase 2完了確認
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// DOM環境セットアップ（jsdom使用）
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.console = console;

/**
 * Test Phase 2.1: Enhanced H384データ活用強化
 */
describe('Phase 2.1: Enhanced H384データ活用強化', function() {
  let EnhancedH384DataExtractor;
  
  before(function() {
    // ファイル存在確認
    const publicPath = path.join(__dirname, '../public/js/core/EnhancedH384DataExtractor.js');
    const distPath = path.join(__dirname, '../dist/js/core/EnhancedH384DataExtractor.js');
    
    assert(fs.existsSync(publicPath), 'EnhancedH384DataExtractor.js (public) が存在しません');
    assert(fs.existsSync(distPath), 'EnhancedH384DataExtractor.js (dist) が存在しません');
    
    // クラス読み込み
    const code = fs.readFileSync(publicPath, 'utf8');
    eval(code);
    EnhancedH384DataExtractor = global.window.EnhancedH384DataExtractor;
  });

  it('EnhancedH384DataExtractorクラスが正常に初期化されること', function() {
    const extractor = new EnhancedH384DataExtractor();
    assert(extractor instanceof EnhancedH384DataExtractor, 'インスタンス生成失敗');
    assert(extractor.dataCache instanceof Map, 'データキャッシュが初期化されていません');
    assert(typeof extractor.inferenceEngine === 'object', '推論エンジンが初期化されていません');
    assert(typeof extractor.qualityAnalyzer === 'object', '品質分析器が初期化されていません');
  });

  it('多次元データ抽出が正常に動作すること', function() {
    const extractor = new EnhancedH384DataExtractor();
    
    // モックH384データ設定
    global.window.H384_DATA = [{
      '卦番号': 1,
      '爻': '初九',
      'キーワード': ['創造', '始動'],
      '現代解釈の要約': 'テスト解釈',
      'S7_総合評価スコア': 75
    }];
    
    const result = extractor.extractMultiDimensionalData(1, 0);
    
    assert(typeof result === 'object', '結果がオブジェクトでありません');
    assert(result._enhanced === true, 'データが強化されていません');
    assert(typeof result._qualityScore === 'number', '品質スコアが数値でありません');
    assert(typeof result._features === 'object', '特徴データが抽出されていません');
    assert(typeof result._metadata === 'object', 'メタデータが生成されていません');
  });

  it('推論エンジンが正常に動作すること', function() {
    const extractor = new EnhancedH384DataExtractor();
    const inferredData = extractor.generateInferredData(2, 1);
    
    assert(inferredData._inferred === true, '推論データであることがマークされていません');
    assert(typeof inferredData._confidence === 'number', '信頼度が数値でありません');
    assert(Array.isArray(inferredData['キーワード']), 'キーワードが配列でありません');
    assert(typeof inferredData['現代解釈の要約'] === 'string', '解釈が文字列でありません');
  });
});

/**
 * Test Phase 2.2: 表現バリエーション強化
 */
describe('Phase 2.2: 表現バリエーション強化', function() {
  let ExpressionVariationEngine;
  
  before(function() {
    // ファイル存在確認
    const publicPath = path.join(__dirname, '../public/js/core/ExpressionVariationEngine.js');
    const distPath = path.join(__dirname, '../dist/js/core/ExpressionVariationEngine.js');
    
    assert(fs.existsSync(publicPath), 'ExpressionVariationEngine.js (public) が存在しません');
    assert(fs.existsSync(distPath), 'ExpressionVariationEngine.js (dist) が存在しません');
    
    // クラス読み込み
    const code = fs.readFileSync(publicPath, 'utf8');
    eval(code);
    ExpressionVariationEngine = global.window.ExpressionVariationEngine;
  });

  it('ExpressionVariationEngineクラスが正常に初期化されること', function() {
    const engine = new ExpressionVariationEngine();
    assert(engine instanceof ExpressionVariationEngine, 'インスタンス生成失敗');
    assert(typeof engine.variationPatterns === 'object', 'バリエーションパターンが初期化されていません');
    assert(typeof engine.differentiationAlgorithm === 'object', '差別化アルゴリズムが初期化されていません');
    assert(typeof engine.contentDiversifier === 'object', 'コンテンツ多様化エンジンが初期化されていません');
  });

  it('表現バリエーション生成が正常に動作すること', function() {
    const engine = new ExpressionVariationEngine();
    const baseExpression = 'HaQei分析によると、この状況では順調な発展が予測されます';
    
    const result = engine.generateVariation(baseExpression, 1, 'moderate');
    
    assert(typeof result === 'object', '結果がオブジェクトでありません');
    assert(typeof result.variation === 'string', 'バリエーション表現が文字列でありません');
    assert(typeof result.strategy === 'object', '戦略オブジェクトが返されていません');
    assert(typeof result.variationMetrics === 'object', 'バリエーション指標が返されていません');
    assert(result.variation !== baseExpression, 'バリエーションが生成されていません');
  });

  it('差別化アルゴリズムが8シナリオで異なる戦略を生成すること', function() {
    const engine = new ExpressionVariationEngine();
    const baseExpression = 'HaQei分析によると改善が期待できます';
    
    const strategies = [];
    for (let i = 1; i <= 8; i++) {
      const result = engine.generateVariation(baseExpression, i, 'moderate');
      strategies.push(result.strategy);
    }
    
    // スタイルの多様性チェック
    const uniqueStyles = new Set(strategies.map(s => s.style));
    assert(uniqueStyles.size >= 3, 'スタイルの多様性が不足（3種類以上必要）');
    
    // 深度レベルの多様性チェック
    const uniqueDepths = new Set(strategies.map(s => s.depth));
    assert(uniqueDepths.size >= 2, '深度レベルの多様性が不足（2種類以上必要）');
  });
});

/**
 * Test Phase 2.3: 統合表現エンジン完成
 */
describe('Phase 2.3: 統合表現エンジン完成', function() {
  let FutureSimulatorExpression, ExpressionQualityValidator;
  
  before(function() {
    // ファイル存在確認と読み込み
    const files = [
      '../public/js/core/EnhancedH384DataExtractor.js',
      '../public/js/core/ExpressionVariationEngine.js', 
      '../public/js/core/ExpressionQualityValidator.js',
      '../public/js/future-simulator-expression.js',
      '../public/js/future-simulator-expression-helpers.js'
    ];
    
    files.forEach(file => {
      const filePath = path.join(__dirname, file);
      assert(fs.existsSync(filePath), `${file} が存在しません`);
      
      const code = fs.readFileSync(filePath, 'utf8');
      eval(code);
    });
    
    FutureSimulatorExpression = global.window.FutureSimulatorExpression;
    ExpressionQualityValidator = global.window.ExpressionQualityValidator;
  });

  it('統合表現エンジンが正常に初期化されること', function() {
    const expression = new FutureSimulatorExpression();
    
    assert(expression instanceof FutureSimulatorExpression, 'インスタンス生成失敗');
    assert(typeof expression.h384Extractor === 'object', 'H384抽出器が統合されていません');
    assert(typeof expression.variationEngine === 'object', 'バリエーションエンジンが統合されていません');
    assert(typeof expression.qualityValidator === 'object', '品質検証器が統合されていません');
  });

  it('ExpressionQualityValidatorが正常に動作すること', function() {
    const validator = new ExpressionQualityValidator();
    const testExpression = 'HaQei分析によると、適度な取り組みにより、バランスよく状況が改善していくことが見込まれます';
    
    const result = validator.validateExpression(testExpression);
    
    assert(typeof result === 'object', '検証結果がオブジェクトでありません');
    assert(typeof result.overallScore === 'number', '総合スコアが数値でありません');
    assert(typeof result.grade === 'string', '品質等級が文字列でありません');
    assert(typeof result.passed === 'boolean', '合格判定がブール値でありません');
    assert(Array.isArray(result.suggestions), '改善提案が配列でありません');
    assert(result.overallScore >= 0 && result.overallScore <= 100, 'スコア範囲が不正');
  });

  it('統合カード表現生成が正常に動作すること', function() {
    const expression = new FutureSimulatorExpression();
    
    // モックシナリオデータ
    const mockScenario = {
      id: 1,
      originalId: 1,
      phases: [
        { score: 50, action: null, data: { 'キーワード': ['基準'], 'S7_総合評価スコア': 50 } },
        { score: 65, action: '進爻', data: { 'キーワード': ['発展'], 'S7_総合評価スコア': 65 } },
        { score: 70, action: '変爻', data: { 'キーワード': ['安定'], 'S7_総合評価スコア': 70 } }
      ],
      trend: '上昇トレンド'
    };
    
    const result = expression.generateCardSummary(mockScenario);
    
    assert(typeof result === 'object', '結果がオブジェクトでありません');
    assert(typeof result.strategyIcon === 'string', '戦略アイコンが文字列でありません');
    assert(typeof result.strategyName === 'string', '戦略名が文字列でありません');
    assert(typeof result.shortDescription === 'string', '短縮説明が文字列でありません');
    assert(typeof result.difficulty === 'string', '難易度が文字列でありません');
    assert(typeof result.qualityScore === 'number', '品質スコアが数値でありません');
  });

  it('総合評価テキスト生成が統合システムを活用していること', function() {
    const expression = new FutureSimulatorExpression();
    
    // モックシナリオデータ
    const mockScenario = {
      id: 2,
      phases: [
        { score: 45, data: { 'キーワード': ['準備'], 'S7_総合評価スコア': 45 } },
        { score: 60, data: { 'キーワード': ['発展'], 'S7_総合評価スコア': 60 } },
        { score: 75, data: { 'キーワード': ['成功'], 'S7_総合評価スコア': 75 } }
      ]
    };
    
    const result = expression.generateComprehensiveEvaluation(mockScenario);
    
    assert(typeof result === 'object', '結果がオブジェクトでありません');
    assert(typeof result.result === 'string', '結果文字列が返されていません');
    assert(typeof result.process === 'string', 'プロセス説明が返されていません');
    assert(typeof result.logic === 'string', '論理的根拠が返されていません');
    assert(typeof result.phaseDetails === 'string', 'フェーズ詳細が返されていません');
    assert(result.systemVersion === '2.0-Integrated', 'システムバージョンが統合版でありません');
    
    // HaQei統一性チェック
    assert(result.logic.includes('HaQei'), '論理的根拠にHaQei言及がありません');
  });
});

/**
 * Test: システム統一性チェック
 */
describe('Phase 2 システム統一性チェック', function() {
  it('すべてのコンポーネントが連携して動作すること', function() {
    // 全体統合テスト
    const expression = new FutureSimulatorExpression();
    
    // モック8シナリオ実行
    const scenarios = [];
    for (let i = 1; i <= 8; i++) {
      scenarios.push({
        id: i,
        originalId: i,
        phases: [
          { score: 50, scenarioId: i, data: { 'キーワード': ['基準'], 'S7_総合評価スコア': 50 } },
          { score: 50 + i * 5, scenarioId: i, data: { 'キーワード': ['変化'], 'S7_総合評価スコア': 50 + i * 5 } },
          { score: 50 + i * 8, scenarioId: i, data: { 'キーワード': ['結果'], 'S7_総合評価スコア': 50 + i * 8 } }
        ]
      });
    }
    
    // 戦略タイプ分散チェック
    const strategyTypes = scenarios.map(scenario => {
      const strategyType = expression.determineStrategyType(scenario.phases);
      return strategyType.type;
    });
    
    const uniqueTypes = new Set(strategyTypes);
    assert(uniqueTypes.size >= 4, `戦略タイプ分散不足: ${uniqueTypes.size}/8 (4+種類必要)`);
    
    // カード表現生成チェック
    const cardSummaries = scenarios.map(scenario => expression.generateCardSummary(scenario));
    
    cardSummaries.forEach((summary, index) => {
      assert(typeof summary.qualityScore === 'number', `シナリオ${index + 1}: 品質スコアが数値でありません`);
      assert(summary.qualityScore >= 40, `シナリオ${index + 1}: 品質スコアが低すぎます (${summary.qualityScore})`);
      assert(summary.shortDescription.includes('HaQei') || summary.shortDescription.length > 0, `シナリオ${index + 1}: 表現が適切でありません`);
    });
    
    // 表現多様性チェック
    const descriptions = cardSummaries.map(s => s.shortDescription);
    const uniqueDescriptions = new Set(descriptions);
    const diversityRate = uniqueDescriptions.size / descriptions.length;
    assert(diversityRate >= 0.7, `表現多様性不足: ${Math.round(diversityRate * 100)}% (70%以上必要)`);
  });

  it('ファイル同期性チェック', function() {
    const filesToCheck = [
      'EnhancedH384DataExtractor.js',
      'ExpressionVariationEngine.js',
      'ExpressionQualityValidator.js'
    ];
    
    filesToCheck.forEach(filename => {
      const publicPath = path.join(__dirname, '../public/js/core', filename);
      const distPath = path.join(__dirname, '../dist/js/core', filename);
      
      assert(fs.existsSync(publicPath), `public/${filename} が存在しません`);
      assert(fs.existsSync(distPath), `dist/${filename} が存在しません`);
      
      const publicContent = fs.readFileSync(publicPath, 'utf8');
      const distContent = fs.readFileSync(distPath, 'utf8');
      
      assert(publicContent === distContent, `${filename} のpublic/distファイルが同期されていません`);
    });
  });

  it('HaQei統一性チェック', function() {
    const expression = new FutureSimulatorExpression();
    
    // サンプル表現生成
    const mockScenario = {
      id: 1,
      phases: [
        { score: 50, data: { 'キーワード': ['テスト'], 'S7_総合評価スコア': 50 } },
        { score: 70, data: { 'キーワード': ['改善'], 'S7_総合評価スコア': 70 } }
      ]
    };
    
    const evaluation = expression.generateComprehensiveEvaluation(mockScenario);
    const cardSummary = expression.generateCardSummary(mockScenario);
    
    // HaQei言及チェック
    const haqeiMentions = [
      evaluation.logic,
      evaluation.process,
      cardSummary.shortDescription
    ].filter(text => text.includes('HaQei')).length;
    
    assert(haqeiMentions >= 2, `HaQei統一性不足: ${haqeiMentions}/3 (2+必要)`);
  });
});

console.log('🔬 Phase 2 統合表現エンジン統一性チェック・検証テスト完了');