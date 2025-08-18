# 📋 HaQei Triple OS Analyzer 要件定義書（既存資産活用版）

**作成日**: 2025年8月16日  
**バージョン**: 2.0（既存資産ベース）  
**プロジェクト**: os_analyzer.html再構築  

---

## 1. プロジェクト概要

### 1.1 目的
既存の動作している資産を最大限活用し、os_analyzer.htmlを整理・最適化する。

### 1.2 基本方針
- **破壊的変更禁止**: 動作している機能は維持
- **既存データ完全保持**: questions-full.js、H384H64database.js等
- **分析エンジン保護**: TripleOSInteractionAnalyzer.js等は変更最小限
- **UI層のみ簡潔化**: HTMLとCSSの整理に注力

---

## 2. 機能要件（既存仕様の維持）

### 2.1 画面構成（現行維持）
```
[ウェルカム画面] → [質問画面(36問)] → [分析処理] → [結果画面]
```

### 2.2 ウェルカム画面要件
- **必須要素**:
  - `id="welcome-screen"` セクション
  - `id="start-btn"` 開始ボタン
  - Triple OS説明（Engine/Interface/Safe Mode）
- **使用ファイル**: 既存HTMLテンプレート参照

### 2.3 質問画面要件（questions-full.js使用）
- **データソース**: `/public/assets/js/questions-full.js`（変更禁止）
- **質問構成**:
  ```javascript
  // 既存の36問構成を完全維持
  Q1-Q12: ENGINE OS測定
    - 乾_創造性（Q1-Q3）
    - 震_行動性（Q4-Q6）
    - 坎_探求性（Q7-Q9）
    - その他（Q10-Q12）
  
  Q13-Q24: INTERFACE OS測定
    - 兌_調和性
    - 離_表現性
    - 巽_適応性
  
  Q25-Q36: SAFE MODE OS測定
    - 艮_安定性
    - 坤_受容性
  ```
- **八卦スコアリング**: 既存のscoring構造を維持
  ```javascript
  scoring: { 
    "乾_創造性": 3.0, 
    "離_表現性": 1.5, 
    "艮_安定性": -1.0 
  }
  ```

### 2.4 分析処理要件（既存エンジン使用）
- **メインエンジン**: `TripleOSInteractionAnalyzer.js`（v1.2維持）
- **補助エンジン**:
  - `ExpressionGenerator.js`（表現生成）
  - `KeywordAnalyzer.js`（キーワード分析）
  - `DynamicKeywordGenerator.js`（64×64×64動的生成）
- **データベース**: `H384H64database.js`（384爻データ）
- **処理フロー**: 既存の分析ロジック完全維持

### 2.5 結果画面要件（既存表示維持）
- **必須DOM要素**（追加済み）:
  ```html
  <div id="os-cards-container"></div>
  <div id="summary-view"></div>
  <div id="hexagram-display"></div>
  ```
- **表示内容**:
  - Triple OSカード（Engine/Interface/Safe Mode）
  - 各OSのスコア、易卦番号、易卦名
  - 8卦エネルギーバランス（Chart.js使用）
  - 相互作用説明

---

## 3. 非機能要件（既存達成レベル維持）

### 3.1 パフォーマンス（Phase 4: 100%達成済み）
- First Paint: 284ms（目標1500ms達成）
- 初期ロード: 309ms
- Critical CSS: 30KB以下

### 3.2 セキュリティ（Phase 4: 80%達成済み）
- CSP実装済み
- XSS Protection実装済み
- LocalStorage暗号化済み

### 3.3 ブラウザ互換性（検証済み）
- Chrome/Firefox/Safari対応確認済み
- モバイル/タブレット対応済み

---

## 4. 技術要件（既存資産活用）

### 4.1 必須ファイル構成
```
os_analyzer.html
├── CSS
│   └── styles.css（既存活用）
├── JavaScript（Head）
│   ├── assets/H384H64database.js（変更禁止）
│   ├── js/core/ExpressionGenerator.js（変更禁止）
│   └── js/core/TripleOSInteractionAnalyzer.js（変更禁止）
└── JavaScript（Body末尾）
    ├── assets/js/questions-full.js（変更禁止）
    ├── assets/js/app.js（軽微な調整可）
    └── js/os-analyzer-main.js（軽微な調整可）
```

### 4.2 既存データ構造（変更禁止）
```javascript
// questions-full.jsの構造
window.QUESTIONS = [
  {
    id: "q1",
    text: "質問文",
    category: { title: "乾_創造性", description: "..." },
    options: [
      { 
        value: "A", 
        text: "選択肢", 
        scoring: { /* 八卦スコア */ } 
      }
    ]
  }
  // ... 36問
];

// H384H64database.jsの構造
let H384_DATA = [
  {
    通し番号: 1,
    卦番号: 1,
    卦名: '乾為天',
    爻: '初九',
    // ... 7つのスコア項目
  }
  // ... 384爻
];
```

---

## 5. HTML構造要件（最小限構成）

### 5.1 必須HTML構造
```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HaQei Triple OS Analyzer</title>
    <link rel="stylesheet" href="styles.css">
    
    <!-- 既存の必須スクリプト（順序維持） -->
    <script src="assets/H384H64database.js"></script>
    <script src="js/core/ExpressionGenerator.js"></script>
    <script src="js/core/KeywordAnalyzer.js"></script>
    <script src="js/core/TripleOSInteractionAnalyzer.js"></script>
</head>
<body>
    <!-- ウェルカム画面 -->
    <section id="welcome-screen" class="screen active">
        <!-- 既存のウェルカムコンテンツ -->
        <button id="start-btn">分析を開始</button>
    </section>
    
    <!-- 質問画面 -->
    <section id="question-screen" class="screen">
        <div id="question-container"></div>
        <div id="options-container"></div>
        <button id="prev-btn">前へ</button>
        <button id="next-btn">次へ</button>
    </section>
    
    <!-- 結果画面 -->
    <section id="results-screen" class="screen">
        <div id="os-cards-container"></div>
        <div id="summary-view"></div>
        <div id="hexagram-display"></div>
    </section>
    
    <!-- 既存の必須スクリプト（Body末尾） -->
    <script src="assets/js/questions-full.js"></script>
    <script src="assets/js/app.js"></script>
    <script src="js/os-analyzer-main.js"></script>
    
    <!-- オプション：動的生成システム -->
    <script src="js/pages/future-simulator/DynamicKeywordGenerator.js"></script>
</body>
</html>
```

---

## 6. 移行計画

### 6.1 段階的移行
1. **Phase 1**: 既存HTMLのバックアップ作成
2. **Phase 2**: 不要な要素の特定と削除
3. **Phase 3**: 必須要素の整理と最適化
4. **Phase 4**: 動作確認とテスト

### 6.2 チェックリスト
- [ ] questions-full.jsが正しく読み込まれる
- [ ] 36問すべてが表示される
- [ ] 回答がすべて保存される
- [ ] TripleOSInteractionAnalyzerが動作する
- [ ] 結果が正しく表示される
- [ ] 易卦名と番号が表示される

---

## 7. 制約事項

### 7.1 変更禁止項目
- questions-full.jsのデータ構造
- H384H64database.jsの内容
- 八卦スコアリングシステム
- Triple OS分析ロジック

### 7.2 維持必須項目
- 36問の質問フロー
- 5択回答システム
- 易卦マッピング機能
- 動的生成システム（DynamicKeywordGenerator）

---

## 8. 成功基準

### 8.1 機能面
- ✅ 36問すべて回答可能
- ✅ Triple OS分析が正常動作
- ✅ 易卦情報が正しく表示
- ✅ エラーなし（コンソール）

### 8.2 品質面
- ✅ 既存のパフォーマンススコア維持（100%）
- ✅ 既存のセキュリティレベル維持（80%）
- ✅ コードの可読性向上

---

**注意**: この要件定義書は既存の動作している資産を前提としており、新規開発ではなく再構築・最適化を目的としています。