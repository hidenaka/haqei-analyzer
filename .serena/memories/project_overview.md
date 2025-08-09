# HAQEI Analyzer プロジェクト概要

## 🎯 プロジェクトの目的
HAQEI Analyzerは、古代中国の易経の知恵と最新のAI技術を組み合わせた、革新的な自己理解ツールです。Triple OS（価値観・社会的・防御システム）分析により、ユーザーの本質を多角的に解明し、具体的な行動指針を提供します。

## 🛠️ 技術スタック

### レガシー版（現在稼働中）
- **HTML5/CSS3**: 静的ページ
- **JavaScript (ES6+)**: モジュラー構造
- **Chart.js 3.9.1**: データビジュアライゼーション

### Vue 3版（開発中）
- **Frontend**: Vue 3 + TypeScript + Vite
- **Styling**: Custom CSS with CSS Variables
- **State Management**: Pinia
- **Router**: Vue Router 4
- **Testing**: Vitest + Playwright
- **CI/CD**: GitHub Actions

## 🏗️ プロジェクト構造

```
haqei-analyzer/
├── haqei-vue/                   # Vue 3版（開発中）
│   ├── src/
│   │   ├── components/         # Vueコンポーネント
│   │   ├── views/             # ページビュー
│   │   ├── stores/            # Pinia状態管理
│   │   ├── utils/             # ユーティリティ関数
│   │   └── data/              # データ定義
│   └── tests/                 # テストファイル
├── public/                    # レガシー版（稼働中）
│   ├── os_analyzer.html       # メイン分析ページ
│   ├── results.html           # 結果表示ページ
│   ├── css/                   # スタイルシート
│   ├── js/                    # JavaScript機能
│   └── assets/                # データベースファイル
├── docs/                      # ドキュメント
└── tests/                     # E2Eテスト
```

## 🎭 HaQei基本思想

### 仮想人格形成アプローチ
- **脱・単純診断**: 静的な診断ではなく動的なプロセス
- **仮想人格の構築**: ユーザーの回答を元に3つのOSが相互作用する仮想人格を構築
- **易経メタファー**: 分析結果を易経の深遠なメタファーで解説

### Triple OS Architecture
- **Engine OS（価値観システム）**: 核となる価値観・重要な判断基準
- **Interface OS（社会的システム）**: 他者に見せる自分・社会的表現  
- **SafeMode OS（防御システム）**: 内なる自分の防御機制・ストレス対処