# /tdd-requirements: TDD改善要件定義

## 🎯 Tsumikiワークフロー実行

**実行コマンド**: `/tdd-requirements`  
**対象**: 状況分析システムの4つの致命的問題に対するTDD改善要件  
**実行日**: 2025年8月1日  
**前提**: /rev-design、/rev-requirements完了済み  

## 📋 TDD改善要件概要

### TDD適用方針
- **Red-Green-Refactor**サイクルでの段階的改善
- **テストファースト**による品質保証
- **統計的検証**による客観的改善確認
- **継続的改善**による長期品質維持

### 改善対象問題
1. アーキタイプ判定バランス崩壊（transformation 35%偏重）
2. 64卦多様性破綻（18卦永続未使用）
3. フォールバック品質激減（64→8卦）
4. 信頼度計算不透明性（ブラックボックス）

## 🔴 TDD要件1: アーキタイプ判定バランス改善

### 要件ID: TDD-REQ-001
**目的**: transformation偏重を解消し、4アーキタイプの均等分布を実現

### テスト要件定義

#### T1-1: アーキタイプ分布均等性テスト
```javascript
describe('アーキタイプ分布均等性', () => {
  test('100回判定で各アーキタイプ20-30%の範囲内', async () => {
    const testCases = generateDiverseTestCases(100);
    const results = await classifyBatch(testCases);
    const distribution = calculateArchetypeDistribution(results);
    
    expect(distribution.creation).toBeGreaterThanOrEqual(0.20);
    expect(distribution.creation).toBeLessThanOrEqual(0.30);
    expect(distribution.development).toBeGreaterThanOrEqual(0.20);
    expect(distribution.development).toBeLessThanOrEqual(0.30);
    expect(distribution.transformation).toBeGreaterThanOrEqual(0.20);
    expect(distribution.transformation).toBeLessThanOrEqual(0.30);
    expect(distribution.maturity).toBeGreaterThanOrEqual(0.20);
    expect(distribution.maturity).toBeLessThanOrEqual(0.30);
  });
});
```

#### T1-2: 軽微変化の過大評価防止テスト
```javascript
describe('軽微変化の適切判定', () => {
  test('転職検討レベルの軽微変化はtransformation判定されない', async () => {
    const minorChangeTexts = [
      '転職を少し考えています',
      '副業を始めようかと思います',
      '資格取得を検討中です'
    ];
    
    for (const text of minorChangeTexts) {
      const result = await situationClassifier.analyzeSituation(text);
      expect(result.archetype.primary).not.toBe('transformation');
      expect(result.archetype.score).toBeLessThan(3.0); // 軽微判定
    }
  });
});
```

#### T1-3: 真の変革期の適切判定テスト
```javascript
describe('真の変革期の適切判定', () => {
  test('人生の根本的変革はtransformation判定される', async () => {
    const majorTransformationTexts = [
      '会社を辞めて起業します。人生を変えたい',
      '離婚して新しい人生をスタートします',
      '故郷を離れ、全く新しい環境で生活を始めます'
    ];
    
    for (const text of majorTransformationTexts) {
      const result = await situationClassifier.analyzeSituation(text);
      expect(result.archetype.primary).toBe('transformation');
      expect(result.archetype.score).toBeGreaterThan(5.0); // 高確信
    }
  });
});
```

### 実装要件
- temporal指標重み: 2.0 → 1.2 に調整
- emotional指標重み: 1.5 → 1.8 に強化
- contextual指標重み: 1.0 → 1.5 に強化
- 軽微変化と根本変革の判定基準厳格化

## 🔴 TDD要件2: 64卦多様性確保機構

### 要件ID: TDD-REQ-002
**目的**: 18個未使用卦を解消し、64卦の豊かな表現力を活用

### テスト要件定義

#### T2-1: 全卦使用保証テスト
```javascript
describe('64卦完全活用', () => {
  test('100回マッピングで全64卦が最低1回は選択される', async () => {
    const diverseAnalyses = generateDiverseSituationAnalyses(100);
    const mappingResults = await mapBatch(diverseAnalyses);
    const hexagramUsage = calculateHexagramUsage(mappingResults);
    
    expect(Object.keys(hexagramUsage)).toHaveLength(64);
    expect(Math.min(...Object.values(hexagramUsage))).toBeGreaterThan(0);
  });
});
```

#### T2-2: 上位集中度制限テスト
```javascript
describe('卦選択多様性', () => {
  test('上位10卦の占有率が50%以下', async () => {
    const testAnalyses = generateBalancedTestCases(100);
    const results = await mapBatch(testAnalyses);
    const usage = calculateHexagramUsage(results);
    const sortedUsage = Object.values(usage).sort((a, b) => b - a);
    const top10Share = sortedUsage.slice(0, 10).reduce((sum, count) => sum + count, 0) / 100;
    
    expect(top10Share).toBeLessThanOrEqual(0.50);
  });
});
```

#### T2-3: 希少卦積極選択テスト
```javascript
describe('希少卦積極選択機構', () => {
  test('使用頻度の低い卦が動的にボーナス重み獲得', async () => {
    const mapper = new DynamicIChingMapper();
    // 卦49を意図的に高頻度使用
    for (let i = 0; i < 10; i++) {
      await mapper.mapToHexagram(transformationAnalysis);
    }
    
    // 希少卦（例：卦15）が選択されやすくなることを確認
    const rareHexagramAnalysis = createRareHexagramTargetAnalysis();
    const result = await mapper.mapToHexagram(rareHexagramAnalysis);
    const rareHexagramScore = result.alternatives.find(alt => alt.hexagram === 15)?.score;
    
    expect(rareHexagramScore).toBeGreaterThan(baselineScore * 1.1); // 10%ボーナス
  });
});
```

### 実装要件
- archetype重み: 30点 → 20点 に削減
- temporal重み: 20点 → 10点 に大幅削減
- 希少卦ボーナス機構: 新規10点枠を追加
- dynamics重み: 25点 → 30点 に強化

## 🔴 TDD要件3: 段階的フォールバック品質保証

### 要件ID: TDD-REQ-003
**目的**: 64→8卦の極端な品質低下を防止し、段階的品質縮退を実現

### テスト要件定義

#### T3-1: 段階的フォールバックテスト
```javascript
describe('段階的フォールバック機構', () => {
  test('64→32→16→8卦の段階的品質縮退', async () => {
    const mapper = new DynamicIChingMapper();
    
    // 各フォールバックレベルをテスト
    const levels = [64, 32, 16, 8];
    for (const level of levels) {
      mapper.setFallbackLevel(level);
      const result = await mapper.mapToHexagram(testAnalysis);
      
      expect(result.availableHexagrams).toBe(level);
      expect(result.qualityLevel).toBeGreaterThan(level / 64 * 0.8); // 80%品質保持
    }
  });
});
```

#### T3-2: フォールバック透明性テスト
```javascript
describe('フォールバック状態透明性', () => {
  test('フォールバックモード使用時にユーザーに明示', async () => {
    const mapper = new DynamicIChingMapper();
    mapper.simulateDatabaseFailure();
    
    const result = await mapper.mapToHexagram(testAnalysis);
    
    expect(result.fallbackInfo).toBeDefined();
    expect(result.fallbackInfo.level).toBe(8);
    expect(result.fallbackInfo.message).toContain('基本8卦モード');
    expect(result.fallbackInfo.qualityImpact).toBeDefined();
  });
});
```

#### T3-3: 最小品質保証テスト
```javascript
describe('最小品質保証', () => {
  test('8卦モードでも基本的多様性を確保', async () => {
    const mapper = new DynamicIChingMapper();
    mapper.setFallbackLevel(8);
    
    const diverseTests = generateArchetypeBalancedTests(32);
    const results = await mapBatch(diverseTests);
    const archetypeDistribution = calculateArchetypeDistribution(results);
    
    // 8卦でも4アーキタイプをカバー
    expect(Object.keys(archetypeDistribution)).toHaveLength(4);
    expect(Math.min(...Object.values(archetypeDistribution))).toBeGreaterThan(0.10);
  });
});
```

### 実装要件
- 4段階フォールバック機構: 64→32→16→8卦
- 透明性機構: フォールバック状態のユーザー明示
- 品質保証: 各段階での最小多様性確保
- 自動復旧: データベース復旧時の自動フルモード復帰

## 🔴 TDD要件4: 信頼度計算透明化

### 要件ID: TDD-REQ-004
**目的**: ブラックボックス計算を透明化し、ユーザー理解可能性を向上

### テスト要件定義

#### T4-1: 計算過程透明性テスト
```javascript
describe('信頼度計算透明性', () => {
  test('計算過程の完全説明情報付与', async () => {
    const result = await situationClassifier.analyzeSituation(testText);
    
    expect(result.confidence.explanation).toBeDefined();
    expect(result.confidence.factors).toBeDefined();
    expect(result.confidence.factors.temporal).toBeDefined();
    expect(result.confidence.factors.dynamics).toBeDefined();
    expect(result.confidence.factors.archetype).toBeDefined();
    expect(result.confidence.factors.emotional).toBeDefined();
    
    // 各要素の寄与度が説明されている
    expect(result.confidence.explanation).toContain('時間軸の明確さ');
    expect(result.confidence.explanation).toContain('力学の複雑さ');
  });
});
```

#### T4-2: 動的重み調整テスト
```javascript
describe('動的重み調整機構', () => {
  test('状況複雑さに応じた重み動的調整', async () => {
    const simpleText = '今日は良い天気です';
    const complexText = '転職を考えているが、家族との関係、経済的状況、将来への不安が複雑に絡み合っている';
    
    const simpleResult = await situationClassifier.analyzeSituation(simpleText);
    const complexResult = await situationClassifier.analyzeSituation(complexText);
    
    // 複雑な状況では動的要素の重みが増加
    expect(complexResult.confidence.weights.dynamics).toBeGreaterThan(
      simpleResult.confidence.weights.dynamics
    );
    expect(complexResult.confidence.weights.temporal).toBeLessThan(
      simpleResult.confidence.weights.temporal
    );
  });
});
```

#### T4-3: ユーザー理解度テスト
```javascript
describe('ユーザー理解可能性', () => {
  test('信頼度説明のユーザー理解度4.0/5.0以上', async () => {
    const results = await analyzeBatch(userTestTexts);
    
    for (const result of results) {
      expect(result.confidence.userFriendlyExplanation).toBeDefined();
      expect(result.confidence.readabilityScore).toBeGreaterThan(4.0);
      expect(result.confidence.technicalJargonCount).toBeLessThan(3);
    }
  });
});
```

### 実装要件
- 計算過程完全説明機能
- 動的重み調整アルゴリズム
- ユーザーフレンドリーな説明文生成
- 技術用語の平易化機能

## 📊 統計的品質保証要件

### 全体品質メトリクス

#### 品質基準テスト
```javascript
describe('統計的品質保証', () => {
  test('100人テストでの総合品質達成', async () => {
    const testResults = await runComprehensiveTest(100);
    
    // アーキタイプ分布品質
    expect(testResults.archetypeBalance.giniCoefficient).toBeLessThan(0.3);
    
    // 卦多様性品質
    expect(testResults.hexagramDiversity.unusedCount).toBe(0);
    expect(testResults.hexagramDiversity.top10Share).toBeLessThan(0.5);
    
    // 信頼度品質
    expect(testResults.confidenceQuality.transparency).toBeGreaterThan(4.0);
    expect(testResults.confidenceQuality.accuracy).toBeGreaterThan(0.8);
    
    // ユーザー満足度
    expect(testResults.userSatisfaction.overall).toBeGreaterThan(4.0);
    expect(testResults.userSatisfaction.diversity).toBeGreaterThan(3.5);
  });
});
```

### A級品質判定基準
- **アーキタイプバランス**: Gini係数0.3以下
- **卦多様性**: 未使用卦0個、上位10卦占有率50%以下
- **透明性**: ユーザー理解度4.0/5.0以上
- **信頼度精度**: 実際妥当性80%以上
- **総合満足度**: 4.0/5.0以上

## 🔄 継続的改善要件

### 学習機構テスト
```javascript
describe('継続的改善機構', () => {
  test('ユーザーフィードバック自動学習', async () => {
    const learningSystem = new AdaptiveLearningSystem();
    
    // 負のフィードバックを学習
    await learningSystem.processFeedback({
      analysis: transformationAnalysis,
      userFeedback: 'そんな大げさじゃない',
      correctArchetype: 'development'
    });
    
    // 学習効果を確認
    const improvedResult = await situationClassifier.analyzeSituation(
      transformationAnalysis.originalText
    );
    expect(improvedResult.archetype.primary).toBe('development');
  });
});
```

## 📋 次のTsumikiステップ準備

### TDD要件定義完了確認
- ✅ 4つの改善要件をTDD基準で定義
- ✅ 包括的テストケース仕様作成
- ✅ 統計的品質保証基準設定
- ✅ 継続的改善機構要件追加

### /tdd-testcases 移行準備完了
**テスト実装対象**:
1. 20個の具体的テストケース（T1-1〜T4-3 + 品質保証）
2. 100人テストデータでの統計的検証
3. A級品質判定の自動化テスト
4. 継続的改善効果の測定テスト

### 実行予定
1. ✅ `/rev-design` - 設計書逆生成（完了）
2. ✅ `/rev-requirements` - 要件書逆算（完了）  
3. ✅ `/tdd-requirements` - TDD改善要件定義（完了）
4. ⏭️ `/tdd-testcases` - テストケース詳細実装
5. 🔄 `/tdd-red` - Red段階（テスト失敗確認）
6. 🔄 `/tdd-green` - Green段階（最小実装）
7. 🔄 `/tdd-refactor` - Refactor段階（品質向上）

このTDD改善要件定義により、テストファーストでの品質保証された改善実装の準備が整いました。次のステップで具体的なテストケース実装に移行します。