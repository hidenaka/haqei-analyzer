# HAQEI Future Simulator - 易経変化パターン体系設計書

## 概要
この設計書は、HAQEI Future Simulatorにおける易経の変化パターンを体系的に整理し、ユーザーの多様な悩みに対応できる適応的システムを実現するためのものです。

## 1. 易経変化パターンの完全分類

### 1.1 基本変化パターン（現在実装済み）

#### 進（爻の推移）
- **意味**: 時間の経過による自然な発展
- **適用場面**: 長期的視点での成長や変化を見る場合
- **計算方法**: 現在の爻から次の段階への移行
- **表示方法**: 段階的プロセスの可視化

#### 変（爻変）
- **意味**: 特定条件下での急激な変化
- **適用場面**: 重要な決断点や転換期の分析
- **計算方法**: 変爻の発生とそれによる卦の変化
- **表示方法**: Before/After比較表示

### 1.2 拡張変化パターン（実装予定）

#### 卦変（本卦→之卦）
- **意味**: 現状から理想状態への完全変化
- **適用場面**: 根本的な問題解決や人生の転換を求める場合
- **計算ロジック**:
  ```javascript
  function calculateZhiGua(originalHexagram, changingLines) {
    let newBinary = getHexagramBinary(originalHexagram);
    changingLines.forEach(linePos => {
      newBinary[linePos - 1] = newBinary[linePos - 1] === 1 ? 0 : 1;
    });
    return binaryToHexagramNumber(newBinary);
  }
  ```
- **UI表示**: 現状→理想のストーリー形式

#### 互卦（隠れた本質）
- **意味**: 表面に現れない潜在的な性質や影響
- **適用場面**: 複雑な人間関係や深層心理の理解
- **計算ロジック**:
  ```javascript
  function calculateMutualHexagram(hexagramNumber) {
    const binary = getHexagramBinary(hexagramNumber);
    // 2-4爻で上卦、3-5爻で下卦を形成
    const upperTrigram = [binary[1], binary[2], binary[3]];
    const lowerTrigram = [binary[2], binary[3], binary[4]];
    return combineTrigramsToHexagram(upperTrigram, lowerTrigram);
  }
  ```
- **UI表示**: 「隠された側面」として別パネルで表示

#### 綜卦（視点の転換）
- **意味**: 180度異なる視点からの解釈
- **適用場面**: 行き詰まりや対立状況での新たな視点発見
- **計算ロジック**:
  ```javascript
  function calculateReversedHexagram(hexagramNumber) {
    const binary = getHexagramBinary(hexagramNumber);
    return binaryToHexagramNumber(binary.reverse());
  }
  ```
- **UI表示**: 「相手の視点」「逆の発想」として提示

#### 錯卦（完全な対立）
- **意味**: すべての要素が反転した状態
- **適用場面**: 極端な状況や完全に異なるアプローチを検討する場合
- **計算ロジック**:
  ```javascript
  function calculateOppositeHexagram(hexagramNumber) {
    const binary = getHexagramBinary(hexagramNumber);
    const opposite = binary.map(line => line === 1 ? 0 : 1);
    return binaryToHexagramNumber(opposite);
  }
  ```
- **UI表示**: 「対極的アプローチ」として警告とともに表示

#### 序卦伝の論理（卦の系列関係）
- **意味**: 64卦の自然な順序と相互関係
- **適用場面**: 長期的な人生の流れや成長過程の理解
- **実装方法**:
  ```javascript
  const sequenceLogic = {
    1: { next: 2, theme: "創造から受容へ" },
    2: { next: 3, theme: "受容から困難へ" },
    3: { next: 4, theme: "困難から学習へ" },
    // ... 64卦の完全なシーケンス
  };
  ```
- **UI表示**: タイムライン形式での段階表示

## 2. 悩みの類型化システム

### 2.1 悩みの主要分類

#### A. 緊急度による分類
- **緊急・重要**: 卦変（本卦→之卦）を優先使用
- **緊急・非重要**: 進（爻の推移）で短期的解決策を提示
- **非緊急・重要**: 序卦伝の論理で長期的アプローチ
- **非緊急・非重要**: 互卦で隠れた意味を探求

#### B. 性質による分類
- **人間関係の悩み**: 綜卦（相手の視点）を重視
- **自己成長の悩み**: 進（爻の推移）と序卦伝を組み合わせ
- **決断・選択の悩み**: 卦変と錯卦で選択肢を比較
- **漠然とした不安**: 互卦で潜在的要因を探求

#### C. 対象による分類
- **個人的問題**: 個人卦の詳細分析
- **組織・集団問題**: 複合卦の分析
- **社会的問題**: 大象伝との対応

### 2.2 自動分類アルゴリズム

```javascript
class ConcernClassifier {
  classifyConcern(inputText, emotionalAnalysis, contextualAnalysis) {
    const urgency = this.calculateUrgency(inputText, emotionalAnalysis);
    const importance = this.calculateImportance(contextualAnalysis);
    const nature = this.determineNature(inputText);
    const scope = this.determineScope(contextualAnalysis);
    
    return {
      urgency: urgency,      // high, medium, low
      importance: importance, // high, medium, low
      nature: nature,        // relationship, growth, decision, anxiety
      scope: scope,          // personal, organizational, social
      recommendedPatterns: this.selectOptimalPatterns(urgency, importance, nature, scope)
    };
  }
  
  selectOptimalPatterns(urgency, importance, nature, scope) {
    const patterns = [];
    
    // 緊急度・重要度マトリックス
    if (urgency === 'high' && importance === 'high') {
      patterns.push('hexagram_change', 'opposite_hexagram');
    } else if (urgency === 'low' && importance === 'high') {
      patterns.push('sequence_logic', 'mutual_hexagram');
    }
    
    // 性質による追加パターン
    if (nature === 'relationship') {
      patterns.push('reversed_hexagram');
    }
    if (nature === 'anxiety') {
      patterns.push('mutual_hexagram');
    }
    
    return patterns;
  }
}
```

## 3. 適応的表示システム

### 3.1 ユーザー特性の判定

#### 易経経験レベル
- **初心者**: 基本的な卦名と分かりやすい解釈のみ
- **中級者**: 複数パターンの比較表示
- **上級者**: 全パターンの詳細分析と古典的解釈

#### 性格特性
- **直感型**: 象徴的表現とメタファーを重視
- **論理型**: 構造的分析と根拠の明示
- **感情型**: 感情面への配慮と共感的表現
- **実践型**: 具体的行動指針の提示

### 3.2 動的UI調整

```javascript
class AdaptiveDisplayManager {
  adjustDisplay(analysisResult, userProfile, concernType) {
    const display = {
      patterns: this.selectDisplayPatterns(concernType.recommendedPatterns),
      depth: this.determineDisplayDepth(userProfile.experienceLevel),
      style: this.selectDisplayStyle(userProfile.personalityType),
      urgency: this.setUrgencyIndicators(concernType.urgency)
    };
    
    return this.generateAdaptiveUI(display, analysisResult);
  }
  
  selectDisplayPatterns(recommendedPatterns) {
    return recommendedPatterns.map(pattern => ({
      type: pattern,
      weight: this.calculatePatternWeight(pattern),
      displayOrder: this.determineDisplayOrder(pattern)
    }));
  }
}
```

## 4. 実装優先順位と段階的展開

### Phase 1: 基盤強化（1-2週間）
1. 既存のIChingTransformationEngineの機能拡張
2. ConcernClassifierの実装
3. 基本的な適応的表示機能

### Phase 2: パターン統合（2-3週間）
1. 全変化パターンの統合実装
2. 序卦伝論理の実装
3. ユーザープロファイリング機能

### Phase 3: UI最適化（1-2週間）
1. 適応的表示システムの完成
2. パフォーマンスの最適化
3. ユーザビリティテスト

### Phase 4: 高度化（継続的）
1. 機械学習による分類精度向上
2. 文化的適応機能
3. 多言語対応

## 5. 品質保証と検証

### 5.1 易経正統性の検証
- ClassicalIChingStandardsとの整合性確認
- 古典テキストとの対照検証
- 易経専門家によるレビュー

### 5.2 ユーザビリティ検証
- 異なる経験レベルでのテスト
- 実際の悩み解決における効果測定
- フィードバックによる継続的改善

## 6. bunenjin哲学との統合

### 6.1 「分かれた演技」概念の実装
- 複数の視点（互卦・綜卦・錯卦）を同時に提示
- ユーザーが選択的に受容できる仕組み
- 矛盾する解釈の共存を許容

### 6.2 Triple OSアーキテクチャとの連携
- Engine OS: 内的変化パターン（進・卦変）
- Interface OS: 関係性パターン（綜卦・互卦）
- Safe Mode OS: 防御的パターン（錯卦・序卦伝）

この設計により、古典易経の深い知恵を現代の多様な悩みに適応させ、個人の特性に応じた最適な指導を提供できるシステムを実現します。