# 設計書

## 概要

Quick Analyzer 改善プロジェクトは、現在のモノリシックな単一ファイル構成から、モジュラーで保守性の高いアーキテクチャへの移行を目指します。new-analyzer システムの高度な機能を参考にしながら、クイック診断の簡潔性を保持した現代的な Web アプリケーションを構築します。

## アーキテクチャ

### 全体構成

```
/public/quick-analyzer/
├── quick_analyzer.html          # メインHTMLファイル
├── css/
│   ├── main.css                # 基本スタイル
│   ├── components.css          # コンポーネント固有スタイル
│   └── animations.css          # アニメーション効果
├── js/
│   ├── app.js                  # アプリケーションエントリーポイント
│   ├── core/
│   │   ├── DataManager.js      # データ管理クラス
│   │   ├── Calculator.js       # 分析計算エンジン
│   │   ├── StorageManager.js   # ローカルストレージ管理
│   │   └── ErrorHandler.js     # エラーハンドリング
│   ├── components/
│   │   ├── BaseComponent.js    # 基底コンポーネントクラス
│   │   ├── QuestionFlow.js     # 質問フロー管理
│   │   ├── ProgressIndicator.js # 進捗表示
│   │   └── ResultsView.js      # 結果表示
│   ├── data/
│   │   └── questions.js        # 質問データ
│   └── utils/
│       ├── animations.js       # アニメーションユーティリティ
│       └── validators.js       # バリデーション関数
```

### レイヤー構成

1. **プレゼンテーション層**: HTML + CSS + UI コンポーネント
2. **アプリケーション層**: app.js + コンポーネント管理
3. **ビジネスロジック層**: Calculator + 分析エンジン
4. **データアクセス層**: DataManager + StorageManager

## コンポーネントと インターフェース

### BaseComponent クラス

```javascript
class BaseComponent {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = options;
    this.initialized = false;
  }

  init() {
    /* 初期化処理 */
  }
  render() {
    /* レンダリング処理 */
  }
  destroy() {
    /* クリーンアップ処理 */
  }
  bindEvents() {
    /* イベントバインディング */
  }
}
```

### DataManager クラス

```javascript
class DataManager {
  constructor() {
    this.data = {};
    this.loaded = false;
    this.loadingErrors = [];
  }

  async loadQuestions() {
    /* 質問データ読み込み */
  }
  async loadTrigramData() {
    /* 八卦データ読み込み */
  }
  validateData(data) {
    /* データ検証 */
  }
  logMessage(level, section, message, data) {
    /* ログ管理 */
  }
}
```

### QuestionFlow コンポーネント

```javascript
class QuestionFlow extends BaseComponent {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.currentQuestionIndex = 0;
    this.answers = [];
    this.questions = [];
  }

  displayCurrentQuestion() {
    /* 現在の質問表示 */
  }
  handleAnswer(answer) {
    /* 回答処理 */
  }
  nextQuestion() {
    /* 次の質問へ */
  }
  updateProgress() {
    /* 進捗更新 */
  }
}
```

### Calculator クラス

```javascript
class Calculator {
  constructor() {
    this.trigramScoring = {};
  }

  calculateTrigramScores(answers) {
    /* 八卦スコア計算 */
  }
  determineResult(scores) {
    /* 結果判定 */
  }
  generateInsights(result) {
    /* インサイト生成 */
  }
}
```

### StorageManager クラス

```javascript
class StorageManager {
  constructor(prefix = "haqei_quick_") {
    this.prefix = prefix;
  }

  save(key, data) {
    /* データ保存 */
  }
  load(key) {
    /* データ読み込み */
  }
  remove(key) {
    /* データ削除 */
  }
  validateStorage() {
    /* ストレージ検証 */
  }
}
```

## データモデル

### 質問データ構造

```javascript
const QUESTION_STRUCTURE = {
  id: "string", // 質問ID
  text: "string", // 質問文
  type: "single_choice", // 質問タイプ
  options: [
    {
      value: "string", // 選択肢値
      text: "string", // 選択肢テキスト
      scoring: {
        // スコアリング情報
        trigram_id: "number",
        weight: "number",
      },
    },
  ],
  category: "string", // 質問カテゴリ
};
```

### 八卦データ構造

```javascript
const TRIGRAM_STRUCTURE = {
  id: "number", // 八卦ID
  name: "string", // 八卦名
  avatarName: "string", // アバター名
  description: "string", // 説明文
  characteristics: [
    // 特徴リスト
    "string",
  ],
  insights: {
    // インサイト情報
    strengths: ["string"],
    challenges: ["string"],
    recommendations: ["string"],
  },
};
```

### 結果データ構造

```javascript
const RESULT_STRUCTURE = {
  timestamp: "string", // 診断実行時刻
  answers: [], // 回答データ
  scores: {
    // 八卦スコア
    trigram_id: "number",
  },
  result: {
    // 診断結果
    primary_trigram: "object",
    confidence: "number",
    insights: "object",
  },
};
```

## エラーハンドリング

### ErrorHandler クラス

```javascript
class ErrorHandler {
  constructor() {
    this.errors = [];
    this.debugMode = false;
  }

  handleError(error, context) {
    // エラーログ記録
    // ユーザーフレンドリーなメッセージ表示
    // 必要に応じて復旧処理実行
  }

  showUserMessage(message, type = "error") {
    // ユーザー向けメッセージ表示
  }
}
```

### エラー分類

1. **データ読み込みエラー**: 質問データや八卦データの読み込み失敗
2. **バリデーションエラー**: 入力データの検証失敗
3. **計算エラー**: スコア計算や結果判定の失敗
4. **ストレージエラー**: ローカルストレージの読み書き失敗
5. **UI エラー**: DOM 操作やレンダリングの失敗

## テスト戦略

### 単体テスト

- **DataManager**: データ読み込み、検証機能
- **Calculator**: スコア計算、結果判定ロジック
- **StorageManager**: データ保存・読み込み機能
- **各コンポーネント**: レンダリング、イベント処理

### 統合テスト

- **質問フロー**: 質問表示から回答処理まで
- **結果表示**: 計算から結果画面表示まで
- **データ永続化**: 回答保存から読み込みまで

### E2E テスト

- **完全な診断フロー**: 開始から結果表示まで
- **エラーシナリオ**: 各種エラー状況での動作確認
- **レスポンシブ対応**: 異なるデバイスでの動作確認

## パフォーマンス最適化

### 読み込み最適化

1. **遅延読み込み**: 必要なモジュールのみ読み込み
2. **キャッシュ戦略**: 静的データのブラウザキャッシュ活用
3. **バンドル最適化**: 必要最小限のコード配信

### レンダリング最適化

1. **仮想 DOM**: 効率的な DOM 更新
2. **アニメーション最適化**: CSS transform と requestAnimationFrame 活用
3. **メモリ管理**: 不要なイベントリスナーの適切な削除

## セキュリティ考慮事項

### データ保護

1. **入力サニタイゼーション**: XSS 攻撃防止
2. **ローカルストレージ暗号化**: 機密データの保護
3. **CSP 設定**: Content Security Policy 適用

### プライバシー保護

1. **最小限データ収集**: 必要最小限の情報のみ保存
2. **データ匿名化**: 個人特定可能情報の除去
3. **ユーザー同意**: データ使用に関する明確な同意取得

## 移行戦略

### フェーズ 1: 基盤構築

1. **ファイル分割**: HTML、CSS、JavaScript の分離
2. **基本クラス実装**: BaseComponent、DataManager 等
3. **基本機能移植**: 現在の 5 問診断機能の再実装

### フェーズ 2: 機能拡張

1. **UI/UX 改善**: アニメーション、プログレスバー追加
2. **エラーハンドリング強化**: 堅牢なエラー処理実装
3. **テスト実装**: 単体テスト、統合テストの作成

### フェーズ 3: 高度化

1. **Chart.js 統合**: 結果の視覚化実装
2. **詳細分析機能**: より深いインサイト提供
3. **システム連携**: 他のアナライザーとの統合

## 品質保証

### コード品質

1. **ESLint 設定**: 一貫したコーディングスタイル
2. **JSDoc 記述**: 適切なドキュメンテーション
3. **型チェック**: TypeScript または JSDoc による型安全性

### ユーザビリティ

1. **アクセシビリティ**: WCAG 2.1 準拠
2. **レスポンシブデザイン**: 全デバイス対応
3. **パフォーマンス**: Core Web Vitals 最適化

この設計により、保守性が高く、拡張可能で、ユーザーフレンドリーな Quick Analyzer を実現します。
