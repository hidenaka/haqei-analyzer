# コードベース構造概要

## 📁 プロジェクト全体構造

```
haqei-analyzer/
├── 🔧 haqei-vue/              # Vue 3版（開発中）
├── 🌐 public/                 # レガシー版（稼働中）
├── 📚 docs/                   # ドキュメント
├── 🧪 tests/                  # E2Eテスト
├── 📄 package.json            # Node.js依存関係（ルート）
├── 📄 tsconfig.json           # TypeScript設定（ルート）
├── 📄 CLAUDE.md               # プロジェクト作業指示
└── 📄 README.md               # プロジェクト概要
```

## 🔧 Vue 3版詳細構造

### haqei-vue/src/ ディレクトリ
```
src/
├── 📱 components/            # Vueコンポーネント
│   ├── common/              # 共通コンポーネント
│   ├── charts/              # チャート関連
│   ├── hexagram/            # 易経関連
│   ├── results/             # 結果表示
│   ├── tripleOS/            # Triple OS関連
│   └── __tests__/           # コンポーネントテスト
├── 🎬 views/                # ページビュー
├── 🗄️ stores/               # Pinia状態管理
├── 🧰 utils/                # ユーティリティ関数
├── 🎛️ composables/          # Vue Composition API
├── 📊 data/                 # データ定義・設問データ
├── 🎨 styles/               # CSS・SCSS
├── 🔌 plugins/              # Vue plugins
├── 🗺️ router/               # Vue Router設定
└── 📄 main.ts               # エントリーポイント
```

### 主要コンポーネント
- **QuestionFlow.vue**: 設問フロー表示
- **ProgressIndicator.vue**: 進捗表示
- **ErrorBoundary.vue**: エラーハンドリング
- **charts/**: Chart.js統合チャート群

## 🌐 レガシー版構造

### public/ ディレクトリ
```
public/
├── 📄 os_analyzer.html       # メイン分析ページ
├── 📄 results.html           # 結果表示ページ
├── 📄 index.html             # ランディングページ
├── 🎨 css/                   # スタイルシート
│   ├── unified-design.css   # 統一デザイン
│   ├── responsive-design.css # レスポンシブ
│   └── chart-styles.css     # チャート専用
├── ⚙️ js/                    # JavaScript機能
│   ├── shared/              # 共通ライブラリ
│   ├── os-analyzer/         # メインシステム
│   ├── pages/               # 個別ページ
│   └── quick-analyzer/      # 軽量システム
└── 📊 assets/               # データベースファイル
```

### JavaScript階層構造
```
js/
├── shared/                  # 共通ライブラリ
│   ├── core/               # BaseComponent, StorageManager, DataManager
│   ├── utils/              # validators, animations, A11yHelpers
│   └── data/               # questions, vectors
├── os-analyzer/            # メインシステム専用
│   ├── core/               # Engine, Calculator, TripleOSEngine
│   ├── components/         # WelcomeScreen, QuestionFlow, AnalysisView
│   ├── engines/            # CompatibilityEngine, InsightEngine
│   └── data/               # hexagrams, action_plans
├── pages/                  # 個別ページ専用
│   ├── cockpit/           # 戦略コックピット
│   ├── future-simulator/  # 未来シミュレーター
│   └── library/           # ライブラリ機能
└── quick-analyzer/         # 軽量システム
```

## 📚 ドキュメント構造

### docs/ ディレクトリ
```
docs/
├── development/            # 開発関連
│   ├── 20250802_DEV_Migration_Task_Tracker_v1.md
│   └── DEVELOPMENT_GUIDE.md
├── reports/               # 完成レポート・分析結果
├── implementation/        # 実装記録・技術仕様
├── requirements/          # 要件・仕様書
├── guides/               # 操作・設定ガイド
└── analysis/             # 分析・調査レポート
```

## 🧪 テスト構造

### Vue 3版テスト
```
haqei-vue/
├── tests/
│   └── setup.ts           # テスト環境設定
└── src/
    └── **/__tests__/      # 各ディレクトリ内のテスト
        ├── *.spec.ts      # ユニットテスト
        └── *.test.ts      # 統合テスト
```

### E2Eテスト
```
tests/
├── e2e/                   # E2Eテストスクリプト
├── setup.ts               # テスト環境セットアップ
└── unit/                  # 追加ユニットテスト
```

## 🔄 Vue 3移行状況

### 完了済み（haqei-vue/src/）
- ✅ **基盤構築**: Vite, TypeScript, ESLint, Prettier
- ✅ **データ層**: questions.ts, types.ts, hexagrams.ts
- ✅ **コンポーネント**: QuestionFlow, ProgressIndicator, ErrorBoundary
- ✅ **ユーティリティ**: calculator.ts, validators.ts, helpers.ts
- ✅ **状態管理**: analysis.ts (Pinia)

### 進行中・未完了
- 🔄 **ビュー移植**: HomeView, QuestionsView, ResultsView
- 🔄 **チャート統合**: Chart.js 4.5.0対応
- ⏳ **API統合**: Gemini API統合（Stage 4-5）
- ⏳ **認証システム**: ユーザー管理・決済システム

## 📊 ファイル統計
- **Vue 3版**: 約50ファイル、TypeScript中心
- **レガシー版**: 約60ファイル、JavaScript中心
- **総計**: 約110ファイル、現在約20MB