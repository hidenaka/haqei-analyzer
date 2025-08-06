# Future Simulator 修正 詳細要件定義書

**文書番号**: REQ-FS-REPAIR-001  
**作成日**: 2025年08月06日  
**作成者**: HAQEI Requirements Analyst Agent  
**対象システム**: future_simulator.html および関連コンポーネント  
**修正範囲**: 完全動作保証とユーザビリティ改善

---

## 📊 エグゼクティブサマリー

### 現状評価（3エージェント評価結果統合）

**総合判定**: **NO-GO（本番デプロイ不可）**  
**品質スコア**: **69%**（37/54テスト通過）  
**修正完了予想期間**: **3-4週間**

#### 🚨 Critical Issues（即座修正必要）
1. **構文エラー**: H384_DATABASE.js:5607, future_simulator.html:1122
2. **データ読み込みエラー**: H384_DATA変数未定義
3. **セキュリティ脆弱性**: DOMPurify integrity無効化
4. **パフォーマンス問題**: 26MBのJS読み込み、60+スクリプトタグ

---

## 🎯 1. 機能要件

### 1.1 既存HTMLデザイン・構成の完全保持

#### REQ-FUNC-001: デザイン継承性保証
- **要件**: 既存のビジュアルデザインと画面レイアウトを100%維持
- **詳細**:
  - Future Simulator v2.0 CSSスタイルの完全継承
  - 八卦カラーシステムの維持（乾＝金色、兌＝空色、離＝赤色、震＝紫色、巽＝緑色、坎＝青色、艮＝灰色、坤＝茶色）
  - 既存のカード型UIの完全保持
  - bunenjin哲学に基づく「一（Ichi）・簡（Kan）・和（Wa）・静（Sei）」の美学維持

#### REQ-FUNC-002: UI/UX継続性保証
- **要件**: 既存のユーザーインタラクションパターンを維持
- **詳細**:
  - 入力フィールドの配置とサイズ維持
  - ボタン配置とアニメーション維持
  - プログレスバー表示の継続
  - ホバー効果とトランジション維持

### 1.2 入力テキスト→易経現在状況卦算出機能

#### REQ-FUNC-003: 日本語形態素解析システム
- **要件**: kuromoji.js統合による高精度テキスト解析
- **詳細**:
  ```javascript
  // 必須実装メソッド
  - analyzeTextMorphology(text) // 形態素解析
  - extractKeywords(morphemes) // キーワード抽出
  - calculateEmotionalWeight(keywords) // 感情重み計算
  - mapToIchingElements(weights) // 易経要素マッピング
  ```
- **エラーハンドリング**: kuromoji読み込み失敗時のフォールバック機能

#### REQ-FUNC-004: 易経64卦算出ロジック
- **要件**: 入力テキストから現在状況卦を正確に算出
- **詳細**:
  - **八卦変換**: テキスト内容を八卦エレメント（乾兌離震巽坎艮坤）にマッピング
  - **本卦算出**: 上卦・下卦の組み合わせで64卦のうち1卦を決定
  - **変爻判定**: テキストの変化要素から変爻（動爻）を特定
  - **之卦算出**: 変爻がある場合の未来状況卦を算出

#### REQ-FUNC-005: 状況分析精度保証
- **要件**: 90%以上の状況分析精度を達成
- **詳細**:
  - コンテキスト分類精度: 8つの分析コンテキスト（仕事、恋愛、人間関係、健康、学習、創作、スピリチュアル、その他）での分類精度90%以上
  - 感情分析精度: ポジティブ・ニュートラル・ネガティブ判定の精度85%以上
  - キーワード抽出精度: 重要語抽出の適合率80%以上

### 1.3 8つのシナリオ表示機能

#### REQ-FUNC-006: シナリオ生成エンジン
- **要件**: 算出された卦に基づく8つの具体的シナリオを生成
- **詳細**:
  ```javascript
  // 8シナリオ構成
  1. 現在状況の詳細分析
  2. 近い未来（1-3ヶ月）の展開
  3. 中期未来（3-6ヶ月）の可能性
  4. 長期未来（6ヶ月-1年）のビジョン
  5. 最良のケースシナリオ
  6. 注意すべきリスクシナリオ
  7. 推奨されるアクション
  8. 内面的成長の可能性
  ```

#### REQ-FUNC-007: シナリオ表示UI
- **要件**: 8つのシナリオを視覚的に魅力的に表示
- **詳細**:
  - **カードレイアウト**: 2x4または4x2のグリッドレイアウト
  - **色彩コーディング**: 各シナリオに対応する八卦カラーを適用
  - **アニメーション**: 段階的なフェードイン表示（100ms間隔）
  - **確率表示**: 各シナリオの発生確率を%で表示

#### REQ-FUNC-008: シナリオ詳細展開機能
- **要件**: 各シナリオカードをクリックで詳細表示
- **詳細**:
  - **モーダル表示**: オーバーレイによる詳細情報表示
  - **易経解説**: 対応する卦の意味と解釈
  - **具体的アドバイス**: 実践的な行動指針
  - **関連リンク**: 関連する易経の教えへの参照

### 1.4 エラーなし動作保証

#### REQ-FUNC-009: エラーハンドリング完全性
- **要件**: 全ての想定されるエラー状況で適切な処理を実行
- **詳細**:
  ```javascript
  // 必須エラーハンドリング
  - ネットワークエラー時の処理
  - データ読み込み失敗時のフォールバック
  - 入力値バリデーション
  - セキュリティエラーの適切な処理
  - ブラウザ互換性エラーの回避
  ```

#### REQ-FUNC-010: ロバストネス保証
- **要件**: 異常な入力や環境でも安定動作
- **詳細**:
  - **入力長制限**: 1000文字以内での制限と警告
  - **特殊文字処理**: 絵文字・記号文字の適切な処理
  - **空文字処理**: 未入力時のユーザーフレンドリーな案内
  - **サニタイゼーション**: XSS攻撃防止のための入力値清浄化

---

## ⚙️ 2. 技術要件

### 2.1 kuromoji.js日本語形態素解析

#### REQ-TECH-001: kuromoji統合要件
- **要件**: kuromoji.js v0.1.2以上の統合
- **技術仕様**:
  ```javascript
  // 必須構成
  - kuromoji辞書: https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/
  - 読み込み方式: 非同期読み込みによるパフォーマンス最適化
  - メモリ使用量: 30MB以下での動作保証
  - 処理速度: 1000文字のテキスト解析を2秒以内
  ```

#### REQ-TECH-002: オフライン対応
- **要件**: ネットワーク未接続時の代替処理
- **技術仕様**:
  - **フォールバック辞書**: 基本的な日本語処理用のローカル辞書
  - **簡易解析**: 正規表現ベースの基本的な単語分割
  - **ユーザー通知**: オフライン状態の明示

### 2.2 易経64卦ロジック

#### REQ-TECH-003: 卦算出アルゴリズム
- **要件**: 数学的に正確な易経卦算出システム
- **技術仕様**:
  ```javascript
  // 核心アルゴリズム
  class IChingCalculator {
    calculateHexagram(textAnalysis) {
      // 1. 八卦要素抽出
      const elements = this.extractEightTrigrams(textAnalysis);
      
      // 2. 上卦・下卦決定
      const upperTrigram = this.determineUpperTrigram(elements);
      const lowerTrigram = this.determineLowerTrigram(elements);
      
      // 3. 本卦決定
      const primaryHexagram = this.combineToHexagram(upperTrigram, lowerTrigram);
      
      // 4. 変爻判定
      const changingLines = this.determineChangingLines(textAnalysis);
      
      // 5. 之卦算出
      const derivedHexagram = this.applyChangingLines(primaryHexagram, changingLines);
      
      return {
        primary: primaryHexagram,
        derived: derivedHexagram,
        changingLines: changingLines
      };
    }
  }
  ```

#### REQ-TECH-004: データ構造設計
- **要件**: 効率的な卦データ管理システム
- **技術仕様**:
  ```javascript
  // 64卦データ構造
  const hexagramData = {
    1: { // 乾為天
      name: "乾為天",
      chinese: "乾",
      binary: "111111",
      upperTrigram: "heaven",
      lowerTrigram: "heaven",
      meaning: "創造・リーダーシップ・強い意志",
      keywords: ["創造", "指導", "強さ", "天"],
      element: "金",
      color: "#FFD700"
    }
    // ... 全64卦の完全定義
  };
  ```

### 2.3 既存チャート・カードUI保持

#### REQ-TECH-005: CSS継承システム
- **要件**: 既存スタイルの完全継承と最適化
- **技術仕様**:
  ```css
  /* 継承必須スタイル */
  .future-simulator-container {
    /* 既存のコンテナスタイル維持 */
  }
  
  .scenario-card {
    /* 既存のカードスタイル維持 */
    transition: all 0.3s ease;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  
  .hexagram-display {
    /* 八卦表示スタイル維持 */
  }
  ```

#### REQ-TECH-006: JavaScriptアーキテクチャ
- **要件**: モジュール化による保守性向上
- **技術仕様**:
  ```javascript
  // モジュール構成
  ├── core/
  │   ├── FutureSimulatorCore.js     // 中核システム
  │   ├── TextAnalyzer.js           // テキスト解析
  │   ├── IChingEngine.js           // 易経エンジン
  │   └── ScenarioGenerator.js      // シナリオ生成
  ├── ui/
  │   ├── UIController.js           // UI制御
  │   ├── CardRenderer.js           // カード描画
  │   └── AnimationManager.js       // アニメーション
  └── utils/
      ├── ErrorHandler.js           // エラー処理
      ├── ValidationUtils.js        // バリデーション
      └── StorageManager.js         // データ保存
  ```

### 2.4 パフォーマンス目標

#### REQ-TECH-007: 読み込み速度目標
- **要件**: 初期読み込み時間の大幅短縮
- **目標値**:
  ```
  現在: 15秒以上 → 目標: 3秒以下（80%改善）
  
  詳細目標:
  - HTMLパース完了: 500ms以内
  - CSS読み込み完了: 1秒以内
  - JavaScript初期化完了: 2秒以内
  - kuromoji読み込み完了: 3秒以内
  ```

#### REQ-TECH-008: メモリ使用量最適化
- **要件**: メモリ使用量の効率化
- **目標値**:
  ```
  現在: 150MB以上 → 目標: 80MB以下（47%削減）
  
  内訳:
  - kuromoji辞書: 30MB以下
  - 画像リソース: 10MB以下
  - JavaScript実行時: 40MB以下
  ```

#### REQ-TECH-009: レスポンシブ性能
- **要件**: ユーザー操作への即座反応
- **目標値**:
  ```
  - 入力レスポンス: 100ms以内
  - 分析開始レスポンス: 200ms以内
  - 結果表示開始: 3秒以内
  - カードアニメーション: 60fps維持
  ```

---

## 🎨 3. 品質要件

### 3.1 動作検証項目

#### REQ-QA-001: 機能テストケース
```javascript
// 必須テストケース（54項目）
const testCases = [
  // 基本機能テスト（18項目）
  {
    id: "FUNC-001",
    category: "基本機能",
    description: "テキスト入力と分析開始",
    input: "最近仕事が忙しくて疲れています",
    expected: "分析が正常に開始され、プログレスバーが表示される"
  },
  {
    id: "FUNC-002", 
    category: "基本機能",
    description: "kuromoji形態素解析",
    input: "明日の会議が心配です",
    expected: "形態素解析が正常に実行され、キーワードが抽出される"
  },
  // 卦算出テスト（12項目）
  {
    id: "HEXAGRAM-001",
    category: "易経算出",
    description: "ポジティブ入力の卦算出",
    input: "新しい挑戦にワクワクしています",
    expected: "震（雷）または乾（天）系の卦が算出される"
  },
  // シナリオ生成テスト（12項目）
  {
    id: "SCENARIO-001",
    category: "シナリオ生成",
    description: "8シナリオ表示",
    expected: "8つのシナリオカードが正しく表示される"
  },
  // エラーハンドリングテスト（12項目）
  {
    id: "ERROR-001",
    category: "エラー処理",
    description: "空文字入力時の処理",
    input: "",
    expected: "適切なエラーメッセージが表示される"
  }
];
```

#### REQ-QA-002: パフォーマンステスト
```javascript
// パフォーマンス測定項目
const performanceTests = [
  {
    metric: "初期読み込み時間",
    target: "3秒以下",
    measurement: "DOMContentLoaded → 分析可能状態"
  },
  {
    metric: "分析処理時間",
    target: "5秒以下",
    measurement: "分析開始 → 結果表示開始"
  },
  {
    metric: "メモリ使用量",
    target: "80MB以下",
    measurement: "ページ読み込み完了時点"
  }
];
```

### 3.2 ユーザビリティテスト項目

#### REQ-QA-003: ユーザビリティ評価
```javascript
// ユーザビリティ測定項目
const usabilityTests = [
  {
    id: "UX-001",
    category: "使いやすさ",
    task: "初回利用時の操作理解",
    target: "説明なしで80%のユーザーが操作可能",
    measurement: "タスク完了率"
  },
  {
    id: "UX-002",
    category: "効率性", 
    task: "分析実行から結果確認まで",
    target: "平均3分以内で完了",
    measurement: "タスク完了時間"
  },
  {
    id: "UX-003",
    category: "満足度",
    task: "分析結果の理解と活用",
    target: "満足度4.0以上（5点満点）",
    measurement: "ユーザー評価スコア"
  },
  {
    id: "UX-004",
    category: "継続利用意向",
    task: "再利用したいと思うか",
    target: "80%以上が再利用意向を示す",
    measurement: "継続利用意向率"
  }
];
```

#### REQ-QA-004: アクセシビリティ要件
```javascript
// アクセシビリティチェック項目
const accessibilityTests = [
  {
    standard: "WCAG 2.1 AA",
    items: [
      "キーボードナビゲーション対応",
      "スクリーンリーダー対応（ARIA属性）",
      "色盲対応（コントラスト比4.5:1以上）",
      "フォーカス表示の明確化",
      "エラーメッセージの読み上げ対応"
    ]
  }
];
```

### 3.3 エラーハンドリング要件

#### REQ-QA-005: エラー分類と処理
```javascript
// エラー分類別処理要件
const errorHandling = {
  // Critical Errors（システム停止エラー）
  critical: {
    "KUROMOJI_LOAD_FAILED": {
      message: "テキスト解析システムの読み込みに失敗しました",
      fallback: "簡易解析モードに切り替え",
      userAction: "ページを再読み込みしてください"
    },
    "H384_DATA_MISSING": {
      message: "易経データの読み込みに失敗しました", 
      fallback: "基本データを使用",
      userAction: "しばらくしてから再試行してください"
    }
  },
  
  // Warning Errors（機能制限エラー）
  warning: {
    "NETWORK_OFFLINE": {
      message: "オフライン状態です",
      fallback: "ローカル機能のみ利用可能",
      userAction: "ネットワーク接続を確認してください"
    },
    "INPUT_TOO_LONG": {
      message: "入力文字数が上限を超えています",
      fallback: "1000文字まで自動切り詰め",
      userAction: "文字数を調整してください"
    }
  },
  
  // Info Errors（情報エラー）
  info: {
    "EMPTY_INPUT": {
      message: "分析したい内容を入力してください",
      fallback: "入力例を表示",
      userAction: "テキストを入力してください"
    }
  }
};
```

---

## 🔒 4. 制約条件

### 4.1 既存ファイル構造維持

#### REQ-CONST-001: ファイル構造制約
```
維持必須ファイル:
├── future_simulator.html                    // メインHTML（変更最小限）
├── css/
│   ├── future-simulator-v2.css.min.css    // 既存スタイル維持
│   ├── ui-enhancements.css                // UI強化スタイル維持
│   └── tailwind.css                       // ベーススタイル維持
├── js/
│   ├── future-simulator-core.js           // コア機能（修正可）
│   ├── future-simulator-ui-enhancements.js // UI強化（修正可）
│   └── security/                          // セキュリティ機能維持
```

#### REQ-CONST-002: 依存関係制約
```javascript
// 維持必須の外部依存関係
const requiredDependencies = [
  "kuromoji@0.1.2",           // 日本語形態素解析
  "dompurify@3.0.8",          // XSS防止
  "tailwindcss",              // CSSフレームワーク
  "chart.js",                 // チャート表示（オプション）
];

// 削除・変更禁止の内部モジュール
const protectedModules = [
  "SecurityHeaderManager.js",   // セキュリティヘッダー
  "CSRFProtectionSystem.js",   // CSRF防止
  "H384_DATABASE.js"          // 易経データベース（修正のみ可）
];
```

### 4.2 デザイン変更最小限

#### REQ-CONST-003: デザイン制約
```css
/* 変更禁止要素 */
- 八卦カラーパレット（8色の色相・彩度・明度）
- カードレイアウトのサイズ比率
- アニメーション方向・速度・イージング
- フォントファミリー（Inter, Noto Sans JP）
- レスポンシブブレイクポイント（768px, 1024px）

/* 変更許可要素 */
- マイナーなmargin/padding調整
- hover/focus状態の微調整
- ローディングアニメーションの改善
- エラー表示のスタイル改善
```

#### REQ-CONST-004: bunenjin哲学制約
```
設計原則の厳守:
- 一（Ichi）: 本質的機能への集中、装飾的要素の排除
- 簡（Kan）: シンプルなUI、直感的な操作フロー
- 和（Wa）: 色調・形状・動作の調和
- 静（Sei）: 落ち着いた色調、適度な余白の確保

禁止事項:
- 派手な色彩・グラデーションの追加
- 不要なアニメーション・エフェクトの追加
- 複雑なナビゲーション構造の導入
- 広告的・商業的デザイン要素の追加
```

### 4.3 ブラウザ互換性制約

#### REQ-CONST-005: サポート対象ブラウザ
```javascript
// 動作保証対象（市場シェア95%カバー）
const supportedBrowsers = {
  chrome: "≥90",      // 75%市場シェア
  safari: "≥14",      // 15%市場シェア  
  firefox: "≥88",     // 4%市場シェア
  edge: "≥90",        // 4%市場シェア
  // IE11: サポート対象外（市場シェア <1%）
};

// 必須対応機能
const requiredFeatures = [
  "ES2020 (async/await, optional chaining)",
  "CSS Grid Layout",
  "CSS Flexbox", 
  "Web Workers",
  "Local Storage",
  "Fetch API"
];
```

### 4.4 セキュリティ制約

#### REQ-CONST-006: セキュリティ要件
```javascript
// 必須セキュリティ対策
const securityRequirements = {
  xss: {
    requirement: "全ユーザー入力のサニタイゼーション",
    implementation: "DOMPurify使用必須",
    validation: "入力値検証テスト実施"
  },
  
  csp: {
    requirement: "Content Security Policy実装",
    implementation: "script-src, style-src制限",
    validation: "CSP違反テスト実施"
  },
  
  https: {
    requirement: "HTTPS通信の強制",
    implementation: "mixed content防止",
    validation: "HTTP→HTTPS自動リダイレクト"
  },
  
  headers: {
    requirement: "セキュリティヘッダー設定",
    implementation: "X-Frame-Options, X-XSS-Protection等",
    validation: "セキュリティスキャン実施"
  }
};
```

---

## 🎯 5. 成功基準

### 5.1 技術的成功基準

#### 目標達成指標
```javascript
const successCriteria = {
  functionality: {
    target: "95%以上",
    current: "69%",
    measurement: "54テストケース中51以上が通過"
  },
  
  performance: {
    loadTime: {
      target: "3秒以下",
      current: "15秒以上", 
      measurement: "初期表示完了まで"
    },
    analysisTime: {
      target: "5秒以下",
      current: "測定未実施",
      measurement: "分析開始から結果表示まで"
    }
  },
  
  reliability: {
    errorRate: {
      target: "1%以下",
      current: "31%",
      measurement: "エラー発生頻度"
    },
    availability: {
      target: "99.9%以上",
      current: "測定未実施",
      measurement: "サービス稼働率"
    }
  }
};
```

### 5.2 ユーザビリティ成功基準

#### ユーザーエクスペリエンス指標
```javascript
const uxSuccessCriteria = {
  completion: {
    target: "85%以上",
    current: "69%", 
    measurement: "タスク完了率"
  },
  
  satisfaction: {
    target: "4.2/5.0以上",
    current: "測定未実施",
    measurement: "ユーザー満足度スコア"
  },
  
  efficiency: {
    target: "3分以内",
    current: "測定未実施",
    measurement: "分析完了まで平均所要時間"
  },
  
  learnability: {
    target: "80%以上",
    current: "測定未実施", 
    measurement: "初回利用成功率"
  }
};
```

### 5.3 品質成功基準

#### 品質保証指標
```javascript
const qualitySuccessCriteria = {
  accuracy: {
    target: "90%以上",
    current: "測定未実施",
    measurement: "卦算出精度"
  },
  
  accessibility: {
    target: "WCAG 2.1 AA準拠",
    current: "部分対応",
    measurement: "アクセシビリティ監査スコア"
  },
  
  security: {
    target: "脆弱性0件",
    current: "3件検出",
    measurement: "セキュリティスキャン結果"
  },
  
  maintainability: {
    target: "80点以上",
    current: "測定未実施",
    measurement: "コード品質スコア（SonarQube等）"
  }
};
```

---

## 📋 6. 実装フェーズ計画

### Phase 1: 緊急修正（1週間）
```javascript
const phase1Tasks = [
  {
    priority: "Critical",
    task: "H384_DATABASE.js構文エラー修正",
    estimate: "4時間",
    success: "構文エラー0件"
  },
  {
    priority: "Critical", 
    task: "future_simulator.html構文エラー修正",
    estimate: "4時間",
    success: "HTML validation通過"
  },
  {
    priority: "High",
    task: "kuromoji読み込みエラー修正",
    estimate: "8時間",
    success: "形態素解析機能正常動作"
  },
  {
    priority: "High",
    task: "セキュリティ脆弱性修正",
    estimate: "8時間", 
    success: "DOMPurify正常動作、CSP適用"
  }
];
```

### Phase 2: 機能完成（2-3週間）
```javascript
const phase2Tasks = [
  {
    category: "Core Engine",
    task: "IChingEngine完全実装",
    estimate: "40時間",
    success: "64卦算出100%動作"
  },
  {
    category: "UI/UX",
    task: "8シナリオ表示システム実装", 
    estimate: "32時間",
    success: "シナリオ表示・詳細展開機能完成"
  },
  {
    category: "Performance",
    task: "読み込み速度最適化",
    estimate: "24時間",
    success: "初期読み込み3秒以下達成"
  }
];
```

### Phase 3: 品質保証（3-4週間）
```javascript
const phase3Tasks = [
  {
    category: "Testing",
    task: "54テストケース完全実装・実行",
    estimate: "32時間", 
    success: "95%以上のテスト通過"
  },
  {
    category: "Performance",
    task: "パフォーマンス最適化完了",
    estimate: "24時間",
    success: "全パフォーマンス目標達成"
  },
  {
    category: "Security",
    task: "セキュリティ監査・修正完了",
    estimate: "16時間",
    success: "脆弱性0件、セキュリティスコア90+点"
  }
];
```

---

## 📊 7. リスク分析と対策

### 高リスク項目
```javascript
const riskMatrix = [
  {
    risk: "kuromoji.js統合の複雑性",
    probability: "High",
    impact: "Critical", 
    mitigation: "段階的統合、フォールバック機能実装"
  },
  {
    risk: "パフォーマンス目標未達",
    probability: "Medium",
    impact: "High",
    mitigation: "コード分割、遅延読み込み、CDN活用"
  },
  {
    risk: "易経算出ロジックの精度不足", 
    probability: "Medium",
    impact: "High",
    mitigation: "専門家監修、テストケース拡充"
  }
];
```

---

## ✅ 8. 完了基準チェックリスト

### 機能完成基準
- [ ] テキスト入力→形態素解析が100%動作
- [ ] 易経64卦算出が95%精度で動作
- [ ] 8シナリオ表示が完全動作
- [ ] 全エラーハンドリングが適切に動作
- [ ] 54テストケース中51以上が通過

### 品質基準
- [ ] 初期読み込み3秒以下達成
- [ ] メモリ使用量80MB以下達成
- [ ] WCAG 2.1 AA準拠達成
- [ ] セキュリティ脆弱性0件達成
- [ ] ユーザビリティスコア4.2以上達成

### デプロイ準備基準
- [ ] 本番環境動作検証完了
- [ ] パフォーマンステスト完了
- [ ] セキュリティ監査完了
- [ ] ユーザビリティテスト完了
- [ ] ドキュメント整備完了

---

**文書承認**:  
- 技術責任者: [ ] 承認待ち  
- セキュリティ責任者: [ ] 承認待ち  
- 品質保証責任者: [ ] 承認待ち

**最終更新**: 2025年08月06日  
**次回レビュー予定**: 実装開始1週間後