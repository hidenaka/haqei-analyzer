# Future Simulator 問題分析・要件定義報告書

**実施日**: 2025年8月16日  
**準拠**: CLAUDE.md 4-Phase Development Cycle  
**対象**: Future Simulator 8パターン表示システム改善

---

## 🔍 問題分析（5WHY分析）

### 問題1: カード説明文の切り捨て表示
**現象**: 全8枚のカードで説明文が「...」で終わっている

```
Why1: なぜ切り捨てられる？ → generateCardSummary()で30文字制限
Why2: なぜ30文字制限？ → 「.substring(0, 30) + '...'」の固定実装
Why3: なぜ固定実装？ → 表示スペース考慮不足での安全策
Why4: なぜ表示考慮不足？ → レスポンシブ対応とコンテンツ長さバランス未検討
Why5: なぜ設計段階で未検討？ → ユーザビリティ評価プロセス不在

対策: 適応的文字数制限ロジック + 完全版はモーダルで表示
```

### 問題2: 戦略タイプの画一化
**現象**: 8枚全カードが「⚖️ バランス型」表示

```
Why1: なぜ同じ型？ → determineStrategyType()の判定ロジック不十分
Why2: なぜ判定不十分？ → volatility計算で差異が生まれない
Why3: なぜ差異なし？ → 8パターンのスコア変化パターンが類似
Why4: なぜ類似？ → H384データベースの活用方法が表面的
Why5: なぜ表面的？ → キーワード・主体性スタンス等の多次元分析未実装

対策: 多次元分析による戦略タイプ分類アルゴリズム強化
```

---

## 📋 要件定義

### 1. カード説明文改善要件
**目標**: ユーザーが8パターンの違いを即座に理解できる説明文

#### 機能要件:
- **適応的文字数制限**: カード幅に応じた最適文字数自動調整
- **階層的情報表示**: 要点 → 詳細 → 完全版の3段階
- **情報優先順位**: スコア変化 → 戦略特徴 → キーワード
- **感情配慮表現**: 「準備期」「発展期」等の心理的配慮

#### 非機能要件:
- レスポンシブ対応（スマホ～デスクトップ）
- 3秒以内のレンダリング
- アクセシビリティ準拠

### 2. 戦略タイプ判定改善要件
**目標**: 8パターンで明確に異なる戦略タイプ分類

#### 判定基準強化:
```javascript
// 多次元分析アルゴリズム
const strategyFactors = {
  riskLevel: calculateRiskFromVolatility(phases),
  timeHorizon: analyzeProgressionSpeed(phases),
  approachStyle: extractApproachFromKeywords(phases),
  stabilityPreference: evaluateStabilityTrend(phases),
  actionOrientation: analyzeStanceData(phases)
};
```

#### 分類ロジック:
- **🛡️ 安定重視型**: 低リスク + 漸進的改善 + 安定キーワード
- **🚀 成長重視型**: 高リスク + 急成長 + 積極キーワード  
- **⚖️ バランス型**: 中リスク + 適度成長 + 調和キーワード
- **🎯 集中型**: 特定領域重視 + 段階的進展
- **🌊 適応型**: 変動対応 + 柔軟性重視

### 3. 表現バリエーション要件
**目標**: 8パターンの個性が明確に伝わる表現差別化

#### コンテンツ多様化:
- H384データベースの「現代解釈の要約」活用拡大
- 「S5_主体性推奨スタンス」による行動指針分岐
- キーワード組み合わせでの独自性創出
- フェーズ進行パターンの言語化

### 4. H384データベース活用強化要件
**目標**: 384爻データの潜在的価値最大活用

#### 活用データ拡大:
```json
{
  "キーワード": "行動指針として活用",
  "現代解釈の要約": "ベース文章として活用", 
  "S5_主体性推奨スタンス": "戦略タイプ判定要素",
  "S7_総合評価スコア": "スコア計算基準",
  "S6_感情面配慮": "感情配慮表現に反映",
  "卦名・爻": "状況分析の背景情報"
}
```

---

## 🎯 実装タスク分解

### Task 1: カード説明文改善（Priority: High）
```javascript
// 1.1 適応的文字数制限実装
calculateOptimalLength(containerWidth, cardCount)

// 1.2 階層的情報構造設計
{
  summary: "一行要約（20-40文字）",
  detail: "詳細説明（60-100文字）", 
  full: "完全版（モーダル用）"
}

// 1.3 情報優先順位ロジック
prioritizeInformation(scoreChange, strategyType, keywords)
```

### Task 2: 戦略タイプ判定強化（Priority: High）
```javascript
// 2.1 多次元分析アルゴリズム実装
analyzeMultiDimensionalStrategy(phases)

// 2.2 判定基準テーブル作成
strategyClassificationMatrix[riskLevel][timeHorizon]

// 2.3 5タイプ分類ロジック実装
determineAdvancedStrategyType(multidimensionalFactors)
```

### Task 3: H384データ活用強化（Priority: Medium）
```javascript
// 3.1 全属性活用ロジック
extractAllRelevantData(hexagramData)

// 3.2 データ組み合わせアルゴリズム
combineMultipleDataSources(keywords, interpretations, stances)

// 3.3 フォールバック強化
enhancedFallbackGeneration(hexagramIndex, lineIndex)
```

### Task 4: 表現品質向上（Priority: Medium）
```javascript
// 4.1 バリエーション表現エンジン
generateVariedExpressions(baseData, strategyType)

// 4.2 感情配慮表現拡張
expandEmotionalConsiderationPatterns()

// 4.3 HaQeiブランディング統一
unifyHaQeiBrandingTone(allExpressions)
```

---

## 🛡️ 品質保証基準

### 機能品質基準:
- [ ] 8パターン全てで異なる説明文（類似度70%以下）
- [ ] 戦略タイプが最低3種類に分散
- [ ] カード表示崩れゼロ（全デバイス）
- [ ] モーダル詳細表示完全動作

### 表現品質基準:
- [ ] HaQeiロジック言及の統一性
- [ ] 感情配慮表現の適切性
- [ ] 予測・推測トーンの一貫性
- [ ] 視覚的階層の明確性

### パフォーマンス基準:
- [ ] 8パターン生成: 2秒以内
- [ ] レスポンシブ表示: 1秒以内
- [ ] エラーゼロ実行

---

## 📊 期待効果

### ユーザビリティ向上:
1. **理解しやすさ**: 8パターンの違いが一目で分かる
2. **選択支援**: 戦略タイプ別の特徴理解で最適選択可能
3. **信頼性**: HaQei論理分析の一貫性でブランド信頼向上

### システム品質向上:
1. **拡張性**: 多次元分析で将来的な機能拡張基盤構築
2. **保守性**: モジュール化で改善・修正の効率化
3. **再利用性**: 表現エンジンの他機能転用可能

---

## 🚀 実装順序（最適化済み）

1. **Phase 1**: カード説明文改善（即効性重視）
2. **Phase 2**: 戦略タイプ判定強化（差別化重視）  
3. **Phase 3**: H384データ活用拡大（品質向上）
4. **Phase 4**: 表現バリエーション強化（完成度向上）

**次ステップ**: ユーザー確認後、Phase 1実装開始

---

## 📝 記録情報

- **分析完了**: 2025年8月16日
- **準拠フレームワーク**: 20250816_future_simulator_design_framework.md
- **検証方法**: 20250816_user_screen_verification.mjs実行結果基準
- **品質基準**: CLAUDE.md規定品質保証プロセス

この分析結果に基づき、段階的な改善実装を実行します。