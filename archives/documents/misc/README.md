# HAQEI Analyzer

**易経の知恵とAI技術を融合した、戦略的人生ナビゲーションシステム**

## 🌟 プロジェクト概要

HAQEI Analyzerは、古代中国の易経の知恵と最新のAI技術を組み合わせた、革新的な自己理解ツールです。Triple OS（価値観・社会的・防御システム）分析により、あなたの本質を多角的に解明し、具体的な行動指針を提供します。

### 🎯 現在のステータス
- **バージョン**: v2.0.0 (Production Ready)
- **リリース日**: 2025年1月12日
- **ステータス**: ✅ 本番環境展開済み
- **品質**: 致命的バグ修正完了、ユーザー検証合格

## 📁 プロジェクト構造

```
haqei-analyzer/
├── 📄 README.md                    # このファイル
├── 📄 package.json                 # Node.js依存関係
├── 📄 eslint.config.mjs            # ESLint設定
├── 🔧 public/                      # Webアプリケーション本体
│   ├── os_analyzer.html            # メイン分析ページ
│   ├── results.html                # 結果表示ページ
│   ├── css/                        # スタイルシート群
│   ├── js/                         # JavaScript機能群
│   └── assets/                     # データベースファイル
├── 📚 docs/                        # ドキュメント
│   ├── development/                # 開発関連文書
│   ├── guides/                     # ガイド・説明書
│   └── requirements/               # 要件書・仕様書
├── 🗄️ data/                        # データファイル
│   ├── haqei_database.db           # メインデータベース
│   └── sources/                    # データ生成元ファイル
├── 🗃️ archives/                    # アーカイブ・バックアップ
│   └── backup/                     # 旧版ファイル
├── ⚙️ functions/                   # サーバーサイド機能
│   ├── api/                        # API エンドポイント
│   └── lib/                        # ライブラリ関数
└── 🛠️ scripts/                     # ユーティリティスクリプト
```

## 🚀 主要機能

### ✨ コア機能
- **対話型分析フロー**: 直感的な質問ベースの分析
- **3OS統合戦略システム**: 3つの視点からの総合分析
- **八卦ビジュアライゼーション**: 伝統的な易経シンボルの現代的表現
- **レスポンシブUI**: デスクトップ・タブレット・スマートフォン対応

### 🎯 分析機能
- **パーソナリティ分析**: 深い自己理解のための多角的分析
- **相性・互換性評価**: 関係性の力学分析
- **戦略的洞察**: 個人の強みと課題の特定
- **行動計画生成**: 具体的な改善・成長提案

## 🛠️ 技術スタック

### 現在の構成（レガシー）
- **HTML5/CSS3**: 静的ページ
- **JavaScript (ES6+)**: モジュラー構造
- **Chart.js 3.9.1**: データビジュアライゼーション

### 移行先の構成（開発中）
- **Frontend**: Vue 3 + TypeScript + Vite
- **Styling**: Custom CSS with CSS Variables
- **State Management**: Pinia
- **Router**: Vue Router 4
- **Testing**: Vitest + Playwright
- **CI/CD**: GitHub Actions
- **Backend**: Edge Functions (Cloudflare Workers)
- **Database**: Supabase (PostgreSQL)
- **Payment**: Stripe

## 🏃‍♂️ クイックスタート

### 必要環境
- Node.js 18+ 
- モダンブラウザ (Chrome, Firefox, Safari, Edge)

### セットアップ
```bash
# リポジトリクローン
git clone <repository-url>
cd haqei-analyzer

# 依存関係インストール
npm install

# 開発サーバー起動（Vue 3版）
npm run dev

# レガシー版の起動
npm run dev:legacy
```

### 開発コマンド
```bash
# コードの検証
npm run lint
npm run lint:fix

# コードフォーマット
npm run format
npm run format:check

# テストの実行
npm run test          # Vitestのwatch mode
npm run test:unit     # ユニットテスト
npm run test:e2e      # E2Eテスト
npm run test:coverage # カバレッジレポート

# ビルド
npm run build         # プロダクションビルド
npm run preview       # ビルドのプレビュー
```

### 主要ページ
- **メイン分析**: `/os_analyzer.html`
- **結果表示**: `/results.html`
- **戦略コックピット**: `/cockpit.html`

## 📖 ドキュメント

詳細なドキュメントは `docs/` ディレクトリにあります：

- **[開発ガイド](docs/development/)**: 開発者向け情報
- **[実装ガイド](docs/guides/)**: 機能実装の詳細
- **[要件書](docs/requirements/)**: プロジェクト要件・仕様

## 🤝 コントリビューション

1. フォークしてブランチ作成
2. 機能実装・バグ修正
3. テスト実行・確認
4. プルリクエスト提出

## 📄 ライセンス

このプロジェクトは独自ライセンスの下で公開されています。詳細は `LICENSE` ファイルを参照してください。

## 📧 連絡先

プロジェクトに関する質問・提案は Issues よりお願いします。

## 🔄 移行計画

現在、レガシーシステムからモダンアーキテクチャへの段階的移行を実施中です。

### Phase 1: MVP強化（3ヶ月）
- [x] Vite + Vue 3環境構築
- [x] TypeScript設定
- [x] ESLint + Prettier設定
- [x] Git Hooks設定
- [x] Vitest + Playwright設定
- [x] CI/CD基本設定
- [ ] コンポーネント移植
- [ ] データ層統合

### Phase 2: 収益化実装（3ヶ月）
- [ ] 認証システム
- [ ] 決済システム（Stripe）
- [ ] サブスクリプション管理
- [ ] 本番環境準備

詳細は[移行計画書](docs/development/20250802_DEV_HAQEI_Migration_Plan_v1.md)を参照してください。

---

**HAQEI Analyzer** - 易経×AI×戦略的思考による、新しい人生ナビゲーション体験

© 2025 HAQEI Analyzer. All rights reserved.