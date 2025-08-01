/**
 * /tdd-testcases: 状況分析システム包括的テストスイート
 * 
 * Tsumikiワークフロー: テスト駆動開発による品質保証実装
 * 対象: 4つの致命的問題に対する改善検証
 * 
 * TDD-REQ-001: アーキタイプ判定バランス改善
 * TDD-REQ-002: 64卦多様性確保機構  
 * TDD-REQ-003: 段階的フォールバック品質保証
 * TDD-REQ-004: 信頼度計算透明化
 */

const { expect } = require('@jest/globals');

// テスト対象モジュールのインポート
const SituationClassifier = require('../../public/js/situation-analyzer/SituationClassifier');
const DynamicIChingMapper = require('../../public/js/situation-analyzer/DynamicIChingMapper');
const UltraSituationAnalyzer = require('../../public/js/situation-analyzer/UltraSituationAnalyzer');

// テストデータ生成ユーティリティ
const TestDataGenerator = require('./utils/test-data-generator');
const StatisticalValidator = require('./utils/statistical-validator');

describe('🔴 TDD-REQ-001: アーキタイプ判定バランス改善', () => {
  let situationClassifier;
  let testDataGenerator;
  
  beforeEach(() => {
    situationClassifier = new SituationClassifier();
    testDataGenerator = new TestDataGenerator();
  });

  describe('T1-1: アーキタイプ分布均等性テスト', () => {
    test('100回判定で各アーキタイプ20-30%の範囲内', async () => {
      // 多様なテストケース生成（4アーキタイプバランス）
      const testCases = testDataGenerator.generateBalancedArchetypeTests(100);
      
      const results = [];
      for (const testCase of testCases) {
        const result = await situationClassifier.analyzeSituation(testCase.text);
        results.push({
          text: testCase.text,
          expectedArchetype: testCase.expectedArchetype,
          actualArchetype: result.archetype.primary,
          score: result.archetype.score,
          confidence: result.confidence
        });
      }
      
      // 分布計算
      const distribution = StatisticalValidator.calculateArchetypeDistribution(results);
      
      // 各アーキタイプが20-30%の範囲内であることを検証
      expect(distribution.creation).toBeGreaterThanOrEqual(0.20);
      expect(distribution.creation).toBeLessThanOrEqual(0.30);
      expect(distribution.development).toBeGreaterThanOrEqual(0.20);
      expect(distribution.development).toBeLessThanOrEqual(0.30);
      expect(distribution.transformation).toBeGreaterThanOrEqual(0.20);
      expect(distribution.transformation).toBeLessThanOrEqual(0.30);
      expect(distribution.maturity).toBeGreaterThanOrEqual(0.20);
      expect(distribution.maturity).toBeLessThanOrEqual(0.30);
      
      // 統計的有意性検証（カイ二乗検定）
      const chiSquareResult = StatisticalValidator.chiSquareTest(distribution, 0.25);
      expect(chiSquareResult.pValue).toBeGreaterThan(0.05); // 有意水準5%で均等分布
    });
  });

  describe('T1-2: 軽微変化の過大評価防止テスト', () => {
    test('転職検討レベルの軽微変化はtransformation判定されない', async () => {
      const minorChangeTexts = [
        '転職を少し考えています',
        '副業を始めようかと思います', 
        '資格取得を検討中です',
        '部署異動があるかもしれません',
        '新しいスキルを身につけたいです',
        '今の仕事を見直しています',
        '違う業界に興味があります',
        '転職サイトを見ています'
      ];
      
      const results = [];
      for (const text of minorChangeTexts) {
        const result = await situationClassifier.analyzeSituation(text);
        results.push({
          text: text,
          archetype: result.archetype.primary,
          score: result.archetype.score,
          isTransformation: result.archetype.primary === 'transformation'
        });
        
        // 個別検証
        expect(result.archetype.primary).not.toBe('transformation');
        expect(result.archetype.score).toBeLessThan(3.0); // 軽微判定
      }
      
      // 全体検証：transformation判定率が10%以下
      const transformationRate = results.filter(r => r.isTransformation).length / results.length;
      expect(transformationRate).toBeLessThanOrEqual(0.10);
    });
  });

  describe('T1-3: 真の変革期の適切判定テスト', () => {
    test('人生の根本的変革はtransformation判定される', async () => {
      const majorTransformationTexts = [
        '会社を辞めて起業します。人生を変えたい',
        '離婚して新しい人生をスタートします',
        '故郷を離れ、全く新しい環境で生活を始めます',
        '長年の夢だった海外移住を決意しました',
        'すべてを捨てて、本当にやりたいことに挑戦します',
        '人生の方向性を根本から見直し、全く違う道を歩みます',
        'これまでの価値観を変えて、新しい自分になります'
      ];
      
      for (const text of majorTransformationTexts) {
        const result = await situationClassifier.analyzeSituation(text);
        
        expect(result.archetype.primary).toBe('transformation');
        expect(result.archetype.score).toBeGreaterThan(5.0); // 高確信
        expect(result.confidence).toBeGreaterThan(0.7); // 高信頼度
      }
    });
  });

  describe('T1-4: temporal重み調整効果テスト', () => {
    test('temporal指標重み2.0→1.2調整でバランス改善', async () => {
      // temporal指標を多く含むテキスト
      const temporalHeavyText = '転職して新しい職場で成長したい';
      
      const result = await situationClassifier.analyzeSituation(temporalHeavyText);
      
      // temporal重みが削減されたことで、他の要素も適切に評価される
      expect(result.archetype.scores.transformation).toBeLessThan(4.0);
      expect(result.archetype.scores.development).toBeGreaterThan(3.0);
    });
  });
});

describe('🔴 TDD-REQ-002: 64卦多様性確保機構', () => {
  let ichingMapper;
  let testDataGenerator;
  
  beforeEach(() => {
    ichingMapper = new DynamicIChingMapper();
    testDataGenerator = new TestDataGenerator();
  });

  describe('T2-1: 全卦使用保証テスト', () => {
    test('100回マッピングで全64卦が最低1回は選択される', async () => {
      // 64卦をターゲットとする多様な状況分析結果を生成
      const diverseAnalyses = testDataGenerator.generateDiverseSituationAnalyses(100);
      
      const mappingResults = [];
      for (const analysis of diverseAnalyses) {
        const result = await ichingMapper.mapToHexagram(analysis);
        mappingResults.push({
          primaryHexagram: result.primary.hexagram,
          alternatives: result.alternatives.map(alt => alt.hexagram),
          analysis: analysis
        });
      }
      
      // 使用された卦の統計
      const hexagramUsage = StatisticalValidator.calculateHexagramUsage(mappingResults);
      
      // 全64卦が使用されていることを検証
      expect(Object.keys(hexagramUsage)).toHaveLength(64);
      
      // 各卦が最低1回は選択されていることを検証
      const unusedHexagrams = [];
      for (let i = 1; i <= 64; i++) {
        if (!hexagramUsage[i] || hexagramUsage[i] === 0) {
          unusedHexagrams.push(i);
        }
      }
      
      expect(unusedHexagrams).toHaveLength(0);
      expect(Math.min(...Object.values(hexagramUsage))).toBeGreaterThan(0);
    });
  });

  describe('T2-2: 上位集中度制限テスト', () => {
    test('上位10卦の占有率が50%以下', async () => {
      const testAnalyses = testDataGenerator.generateBalancedTestCases(100);
      
      const results = [];
      for (const analysis of testAnalyses) {
        const result = await ichingMapper.mapToHexagram(analysis);
        results.push(result.primary.hexagram);
      }
      
      const usage = StatisticalValidator.calculateHexagramFrequency(results);
      const sortedUsage = Object.entries(usage)
        .sort((a, b) => b[1] - a[1])
        .map(([hexagram, count]) => ({ hexagram: parseInt(hexagram), count }));
      
      const top10Count = sortedUsage.slice(0, 10).reduce((sum, item) => sum + item.count, 0);
      const top10Share = top10Count / results.length;
      
      expect(top10Share).toBeLessThanOrEqual(0.50);
      
      // Gini係数による不平等度測定
      const giniCoefficient = StatisticalValidator.calculateGiniCoefficient(Object.values(usage));
      expect(giniCoefficient).toBeLessThan(0.7); // 適度な多様性
    });
  });

  describe('T2-3: 希少卦積極選択テスト', () => {
    test('使用頻度の低い卦が動的にボーナス重み獲得', async () => {
      // 特定の卦（例：49番「革」）を意図的に高頻度使用
      const transformationAnalysis = testDataGenerator.createTransformationAnalysis();
      
      for (let i = 0; i < 10; i++) {
        await ichingMapper.mapToHexagram(transformationAnalysis);
      }
      
      // 使用統計を取得
      const usageStats = ichingMapper.getUsageStatistics();
      
      // 希少卦（例：15番「謙」）をターゲットとする分析を作成
      const rareHexagramAnalysis = testDataGenerator.createRareHexagramTargetAnalysis(15);
      const result = await ichingMapper.mapToHexagram(rareHexagramAnalysis);
      
      // 希少卦がボーナス重みを獲得していることを確認
      const hexagram15Score = result.alternatives.find(alt => alt.hexagram === 15)?.score;
      const baselineScore = testDataGenerator.getBaselineScore(15, rareHexagramAnalysis);
      
      expect(hexagram15Score).toBeGreaterThan(baselineScore * 1.1); // 10%以上のボーナス
      
      // 希少卦ボーナス情報が結果に含まれていることを確認
      expect(result.diversityBonus).toBeDefined();
      expect(result.diversityBonus.appliedHexagrams).toContain(15);
    });
  });

  describe('T2-4: archetype/temporal重み削減効果テスト', () => {
    test('archetype(30→20)とtemporal(20→10)重み削減で多様性向上', async () => {
      const testAnalyses = testDataGenerator.generateSameArchetypeTests(20, 'transformation');
      
      const results = [];
      for (const analysis of testAnalyses) {
        const result = await ichingMapper.mapToHexagram(analysis);
        results.push(result.primary.hexagram);
      }
      
      // 同じアーキタイプでも異なる卦が選択されることを確認
      const uniqueHexagrams = [...new Set(results)];
      expect(uniqueHexagrams.length).toBeGreaterThan(5); // 20回中5種類以上
      
      // transformation卦以外も選択されることを確認
      const transformationHexagrams = [49, 50, 51, 18, 21, 28, 29, 33, 36, 38, 39, 40, 41, 43, 47, 54, 56, 59];
      const nonTransformationCount = results.filter(h => !transformationHexagrams.includes(h)).length;
      expect(nonTransformationCount).toBeGreaterThan(3); // 20回中3回以上は非transformation卦
    });
  });
});

describe('🔴 TDD-REQ-003: 段階的フォールバック品質保証', () => {
  let ichingMapper;
  
  beforeEach(() => {
    ichingMapper = new DynamicIChingMapper();
  });

  describe('T3-1: 段階的フォールバックテスト', () => {
    test('64→32→16→8卦の段階的品質縮退', async () => {
      const testAnalysis = testDataGenerator.createStandardAnalysis();
      
      const levels = [64, 32, 16, 8];
      const qualityResults = [];
      
      for (const level of levels) {
        ichingMapper.setFallbackLevel(level);
        const result = await ichingMapper.mapToHexagram(testAnalysis);
        
        qualityResults.push({
          level: level,
          availableHexagrams: result.metadata.availableHexagrams,
          selectedHexagram: result.primary.hexagram,
          confidence: result.confidence,
          qualityLevel: result.metadata.qualityLevel
        });
        
        // 基本検証
        expect(result.metadata.availableHexagrams).toBe(level);
        expect(result.metadata.qualityLevel).toBeGreaterThan(level / 64 * 0.8); // 80%品質保持
        expect(result.fallbackInfo.level).toBe(level);
      }
      
      // 品質の段階的低下を確認（ただし極端ではない）
      for (let i = 1; i < qualityResults.length; i++) {
        const current = qualityResults[i];
        const previous = qualityResults[i - 1];
        
        expect(current.qualityLevel).toBeLessThanOrEqual(previous.qualityLevel);
        expect(current.qualityLevel).toBeGreaterThan(previous.qualityLevel * 0.7); // 30%以内の品質低下
      }
    });
  });

  describe('T3-2: フォールバック透明性テスト', () => {
    test('フォールバックモード使用時にユーザーに明示', async () => {
      // データベース障害をシミュレート
      ichingMapper.simulateDatabaseFailure();
      
      const testAnalysis = testDataGenerator.createStandardAnalysis();
      const result = await ichingMapper.mapToHexagram(testAnalysis);
      
      // フォールバック情報が適切に提供されることを確認
      expect(result.fallbackInfo).toBeDefined();
      expect(result.fallbackInfo.level).toBe(8);
      expect(result.fallbackInfo.isActive).toBe(true);
      expect(result.fallbackInfo.message).toContain('基本8卦モード');
      expect(result.fallbackInfo.qualityImpact).toBeDefined();
      expect(result.fallbackInfo.availableFeatures).toBeDefined();
      
      // ユーザー向け説明が適切であることを確認
      expect(result.fallbackInfo.userMessage).toContain('一時的');
      expect(result.fallbackInfo.userMessage).not.toContain('エラー'); // 不安を与えない表現
      expect(result.fallbackInfo.recoveryAction).toBeDefined();
    });
  });

  describe('T3-3: 最小品質保証テスト', () => {
    test('8卦モードでも基本的多様性を確保', async () => {
      ichingMapper.setFallbackLevel(8);
      
      // 4アーキタイプをバランスよく含むテストケース
      const diverseTests = testDataGenerator.generateArchetypeBalancedTests(32);
      
      const results = [];
      for (const test of diverseTests) {
        const result = await ichingMapper.mapToHexagram(test);
        results.push({
          hexagram: result.primary.hexagram,
          archetype: result.primary.essence.archetype,
          expectedArchetype: test.essence.archetype
        });
      }
      
      // アーキタイプ分布の確認
      const archetypeDistribution = StatisticalValidator.calculateArchetypeDistribution(results);
      
      // 8卦でも4アーキタイプをカバー
      expect(Object.keys(archetypeDistribution)).toHaveLength(4);
      expect(Math.min(...Object.values(archetypeDistribution))).toBeGreaterThan(0.10); // 最低10%
      
      // 使用された卦が8個であることを確認
      const uniqueHexagrams = [...new Set(results.map(r => r.hexagram))];
      expect(uniqueHexagrams).toHaveLength(8);
      
      // 基本的な品質指標
      const accuracy = results.filter(r => r.archetype === r.expectedArchetype).length / results.length;
      expect(accuracy).toBeGreaterThan(0.6); // 60%以上の精度維持
    });
  });

  describe('T3-4: 自動復旧テスト', () => {
    test('データベース復旧時の自動フルモード復帰', async () => {
      // 障害状態でテスト
      ichingMapper.simulateDatabaseFailure();
      let result = await ichingMapper.mapToHexagram(testDataGenerator.createStandardAnalysis());
      expect(result.fallbackInfo.level).toBe(8);
      
      // 復旧をシミュレート
      ichingMapper.simulateDatabaseRecovery();
      result = await ichingMapper.mapToHexagram(testDataGenerator.createStandardAnalysis());
      
      expect(result.metadata.availableHexagrams).toBe(64);
      expect(result.fallbackInfo.isActive).toBe(false);
      expect(result.metadata.qualityLevel).toBeGreaterThan(0.95); // フル品質復旧
    });
  });
});

describe('🔴 TDD-REQ-004: 信頼度計算透明化', () => {
  let situationClassifier;
  
  beforeEach(() => {
    situationClassifier = new SituationClassifier();
  });

  describe('T4-1: 計算過程透明性テスト', () => {
    test('計算過程の完全説明情報付与', async () => {
      const testText = '新しい仕事を始めて、様々な人間関係に悩んでいます';
      const result = await situationClassifier.analyzeSituation(testText);
      
      // 説明情報の存在確認
      expect(result.confidence.explanation).toBeDefined();
      expect(result.confidence.factors).toBeDefined();
      expect(result.confidence.calculation).toBeDefined();
      
      // 各要素の詳細確認
      expect(result.confidence.factors.temporal).toBeDefined();
      expect(result.confidence.factors.temporal.weight).toBeDefined();
      expect(result.confidence.factors.temporal.score).toBeDefined();
      expect(result.confidence.factors.temporal.reasoning).toBeDefined();
      
      expect(result.confidence.factors.dynamics).toBeDefined();
      expect(result.confidence.factors.archetype).toBeDefined();
      expect(result.confidence.factors.emotional).toBeDefined();
      
      // 説明文の内容確認
      expect(result.confidence.explanation).toContain('時間軸の明確さ');
      expect(result.confidence.explanation).toContain('力学の複雑さ');
      expect(result.confidence.explanation).toContain('アーキタイプの確実性');
      expect(result.confidence.explanation).toContain('感情の識別度');
      
      // 計算過程の透明性
      expect(result.confidence.calculation.formula).toBeDefined();
      expect(result.confidence.calculation.steps).toBeDefined();
      expect(result.confidence.calculation.steps.length).toBeGreaterThan(3);
    });
  });

  describe('T4-2: 動的重み調整テスト', () => {
    test('状況複雑さに応じた重み動的調整', async () => {
      const simpleText = '今日は良い天気です';
      const complexText = '転職を考えているが、家族との関係、経済的状況、将来への不安、現在の職場での人間関係、スキルアップの必要性が複雑に絡み合っている';
      
      const simpleResult = await situationClassifier.analyzeSituation(simpleText);
      const complexResult = await situationClassifier.analyzeSituation(complexText);
      
      // 複雑さ検出の確認
      expect(complexResult.metadata.complexity).toBeGreaterThan(simpleResult.metadata.complexity);
      
      // 動的重み調整の確認
      expect(complexResult.confidence.weights.dynamics).toBeGreaterThan(
        simpleResult.confidence.weights.dynamics
      );
      expect(complexResult.confidence.weights.temporal).toBeLessThan(
        simpleResult.confidence.weights.temporal
      );
      
      // 調整理由の説明
      expect(complexResult.confidence.weightAdjustment).toBeDefined();
      expect(complexResult.confidence.weightAdjustment.reason).toContain('複雑');
      expect(complexResult.confidence.weightAdjustment.adjustments).toBeDefined();
    });
  });

  describe('T4-3: ユーザー理解度テスト', () => {
    test('信頼度説明のユーザー理解度4.0/5.0以上', async () => {
      const userTestTexts = testDataGenerator.generateUserFriendlyTestTexts(20);
      
      for (const testText of userTestTexts) {
        const result = await situationClassifier.analyzeSituation(testText);
        
        // ユーザーフレンドリーな説明の存在
        expect(result.confidence.userFriendlyExplanation).toBeDefined();
        
        // 読みやすさスコア
        expect(result.confidence.readabilityScore).toBeGreaterThan(4.0);
        
        // 技術用語の制限
        expect(result.confidence.technicalJargonCount).toBeLessThan(3);
        
        // 平易な日本語での説明
        expect(result.confidence.userFriendlyExplanation).not.toContain('コサイン類似度');
        expect(result.confidence.userFriendlyExplanation).not.toContain('重み付け合計');
        expect(result.confidence.userFriendlyExplanation).toMatch(/[。、].*[。、]/); // 適切な句読点
        
        // 長さの適切性（長すぎず短すぎず）
        expect(result.confidence.userFriendlyExplanation.length).toBeGreaterThan(50);
        expect(result.confidence.userFriendlyExplanation.length).toBeLessThan(300);
      }
    });
  });

  describe('T4-4: 信頼度精度テスト', () => {
    test('信頼度と実際の妥当性の相関80%以上', async () => {
      const validationTests = testDataGenerator.generateValidationTests(50);
      
      const results = [];
      for (const test of validationTests) {
        const result = await situationClassifier.analyzeSituation(test.text);
        results.push({
          confidence: result.confidence.value,
          actualAccuracy: test.expectedArchetype === result.archetype.primary ? 1 : 0,
          text: test.text
        });
      }
      
      // 信頼度と精度の相関計算
      const correlation = StatisticalValidator.calculateCorrelation(
        results.map(r => r.confidence),
        results.map(r => r.actualAccuracy)
      );
      
      expect(correlation).toBeGreaterThan(0.8); // 80%以上の相関
      
      // 高信頼度ケース（>0.8）の精度確認
      const highConfidenceResults = results.filter(r => r.confidence > 0.8);
      const highConfidenceAccuracy = highConfidenceResults.reduce((sum, r) => sum + r.actualAccuracy, 0) / highConfidenceResults.length;
      expect(highConfidenceAccuracy).toBeGreaterThan(0.9); // 90%以上の精度
    });
  });
});

describe('📊 統計的品質保証テスト', () => {
  let ultraAnalyzer;
  let testDataGenerator;
  
  beforeEach(() => {
    ultraAnalyzer = new UltraSituationAnalyzer();
    testDataGenerator = new TestDataGenerator();
  });

  describe('全体品質メトリクス', () => {
    test('100人テストでの総合品質達成', async () => {
      // 100人相当のテストデータ生成
      const comprehensiveTests = testDataGenerator.generateComprehensiveTests(100);
      
      const testResults = {
        archetypeBalance: {},
        hexagramDiversity: {},
        confidenceQuality: {},
        userSatisfaction: {}
      };
      
      const allResults = [];
      for (const test of comprehensiveTests) {
        const result = await ultraAnalyzer.analyze(test.text);
        allResults.push({
          ...result,
          expectedArchetype: test.expectedArchetype,
          userSatisfactionScore: test.userSatisfactionScore
        });
      }
      
      // アーキタイプ分布品質
      const archetypeDistribution = StatisticalValidator.calculateArchetypeDistribution(allResults);
      testResults.archetypeBalance.giniCoefficient = StatisticalValidator.calculateGiniCoefficient(
        Object.values(archetypeDistribution)
      );
      expect(testResults.archetypeBalance.giniCoefficient).toBeLessThan(0.3);
      
      // 卦多様性品質
      const hexagramUsage = StatisticalValidator.calculateHexagramUsage(allResults);
      testResults.hexagramDiversity.unusedCount = 64 - Object.keys(hexagramUsage).length;
      expect(testResults.hexagramDiversity.unusedCount).toBe(0);
      
      const sortedUsage = Object.values(hexagramUsage).sort((a, b) => b - a);
      testResults.hexagramDiversity.top10Share = sortedUsage.slice(0, 10).reduce((sum, count) => sum + count, 0) / 100;
      expect(testResults.hexagramDiversity.top10Share).toBeLessThan(0.5);
      
      // 信頼度品質
      const transparencyScores = allResults.map(r => r.situation.confidence.readabilityScore || 0);
      testResults.confidenceQuality.transparency = transparencyScores.reduce((sum, score) => sum + score, 0) / transparencyScores.length;
      expect(testResults.confidenceQuality.transparency).toBeGreaterThan(4.0);
      
      const accuracyScores = allResults.map(r => 
        r.expectedArchetype === r.situation.archetype.primary ? 1 : 0
      );
      testResults.confidenceQuality.accuracy = accuracyScores.reduce((sum, score) => sum + score, 0) / accuracyScores.length;
      expect(testResults.confidenceQuality.accuracy).toBeGreaterThan(0.8);
      
      // ユーザー満足度
      testResults.userSatisfaction.overall = allResults.reduce((sum, r) => sum + r.userSatisfactionScore, 0) / allResults.length;
      expect(testResults.userSatisfaction.overall).toBeGreaterThan(4.0);
      
      const diversityScores = allResults.map(r => r.diversityScore || 3.5);
      testResults.userSatisfaction.diversity = diversityScores.reduce((sum, score) => sum + score, 0) / diversityScores.length;
      expect(testResults.userSatisfaction.diversity).toBeGreaterThan(3.5);
    });
  });

  describe('A級品質判定テスト', () => {
    test('A級品質基準の全項目達成', async () => {
      const qualityTests = testDataGenerator.generateQualityAssuranceTests(100);
      const results = await Promise.all(
        qualityTests.map(test => ultraAnalyzer.analyze(test.text))
      );
      
      // A級品質基準チェック
      const qualityMetrics = StatisticalValidator.calculateQualityMetrics(results);
      
      // 各基準をA級として判定
      expect(qualityMetrics.archetypeBalance.giniCoefficient).toBeLessThan(0.3); // ✓
      expect(qualityMetrics.hexagramDiversity.unusedCount).toBe(0); // ✓
      expect(qualityMetrics.hexagramDiversity.top10Share).toBeLessThan(0.5); // ✓
      expect(qualityMetrics.transparency.userUnderstanding).toBeGreaterThan(4.0); // ✓
      expect(qualityMetrics.reliability.accuracy).toBeGreaterThan(0.8); // ✓
      expect(qualityMetrics.userSatisfaction.overall).toBeGreaterThan(4.0); // ✓
      
      // 総合A級判定
      const overallGrade = StatisticalValidator.calculateOverallGrade(qualityMetrics);
      expect(overallGrade).toBe('A');
    });
  });
});

describe('🔄 継続的改善機構テスト', () => {
  let learningSystem;
  
  beforeEach(() => {
    learningSystem = new AdaptiveLearningSystem();
  });

  describe('学習機構テスト', () => {
    test('ユーザーフィードバック自動学習', async () => {
      const transformationAnalysis = testDataGenerator.createTransformationAnalysis();
      const originalText = '転職を考えています';
      
      // 負のフィードバックを学習
      await learningSystem.processFeedback({
        originalText: originalText,
        analysis: transformationAnalysis,
        userFeedback: 'そんな大げさじゃない',
        correctArchetype: 'development',
        feedbackType: 'archetype_correction'
      });
      
      // 学習効果の確認
      const situationClassifier = new SituationClassifier();
      situationClassifier.loadLearningData(learningSystem.getTrainingData());
      
      const improvedResult = await situationClassifier.analyzeSituation(originalText);
      expect(improvedResult.archetype.primary).toBe('development');
      expect(improvedResult.archetype.scores.transformation).toBeLessThan(
        transformationAnalysis.archetype.scores.transformation
      );
      
      // 学習統計の確認
      const learningStats = learningSystem.getLearningStatistics();
      expect(learningStats.totalFeedbacks).toBe(1);
      expect(learningStats.archetypeCorrections).toBe(1);
      expect(learningStats.improvementRate).toBeDefined();
    });

    test('パターン学習による品質向上', async () => {
      // 複数の類似フィードバックを学習
      const feedbacks = [
        { text: '転職を考えています', correct: 'development', wrong: 'transformation' },
        { text: '副業を始めたいです', correct: 'development', wrong: 'transformation' },
        { text: '資格を取ろうと思います', correct: 'development', wrong: 'transformation' }
      ];
      
      for (const feedback of feedbacks) {
        await learningSystem.processFeedback({
          originalText: feedback.text,
          userFeedback: '軽微な変化です',
          correctArchetype: feedback.correct,
          incorrectArchetype: feedback.wrong
        });
      }
      
      // パターン学習の効果確認
      const patterns = learningSystem.getLearnedPatterns();
      expect(patterns.minorChangePatterns).toBeDefined();
      expect(patterns.minorChangePatterns.length).toBeGreaterThan(0);
      
      // 新しい類似ケースでの改善確認
      const situationClassifier = new SituationClassifier();
      situationClassifier.loadLearningData(learningSystem.getTrainingData());
      
      const newSimilarCase = '新しいスキルを身につけたいです';
      const result = await situationClassifier.analyzeSituation(newSimilarCase);
      expect(result.archetype.primary).toBe('development');
    });
  });
});

module.exports = {
  // テストスイート設定
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // カバレッジ設定
  collectCoverageFrom: [
    'public/js/situation-analyzer/**/*.js',
    '!public/js/situation-analyzer/**/*.test.js'
  ],
  
  // テスト実行設定
  verbose: true,
  bail: false, // 全テスト実行
  
  // 品質基準
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};