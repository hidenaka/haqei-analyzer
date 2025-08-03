# HAQEI Vue 3 + Supabase アプリケーション

HAQEIプロジェクトのモダンなVue 3 + TypeScript + Supabase統合アプリケーションです。

## 🎯 プロジェクト概要

HAQEI (Harmony Analysis through Quantum Eastern Intelligence) は、易経の64卦システムとTriple OS Architecture（Engine・Interface・SafeMode）を統合した革新的な自己分析プラットフォームです。

### 主要機能

- **Triple OS 分析**: 価値観・社会性・防御機能の3つのOSを分析
- **易経64卦システム**: 古典的な易経理論の現代的解釈
- **Supabaseデータベース**: 安全でスケーラブルなクラウドデータベース
- **データマイグレーション**: ローカルストレージからSupabaseへの完全移行
- **リアルタイム更新**: PostgreSQL NOTIFY/LISTENによるリアルタイム同期
- **bunenjin哲学**: プライバシー最優先の設計思想

## 🛠️ 技術スタック

- **Vue 3** - Composition API + `<script setup>`
- **TypeScript** - 型安全性の確保
- **Supabase** - PostgreSQLベースのBaaS
- **Pinia** - Vue 3専用状態管理
- **Vite** - 高速ビルドツール
- **Chart.js** - データ可視化
- **Tailwind CSS** - ユーティリティファーストCSS

## 🚀 セットアップ

### 1. 環境変数の設定

```bash
# .env.example を .env にコピー
cp .env.example .env

# Supabase設定を記入
# VITE_SUPABASE_URL=your_supabase_project_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

## 📊 データベース・マイグレーション

### Supabaseへのデータ移行

```bash
# ローカルデータのスキャン
npm run migrate:dry-run

# バックアップ作成
npm run migrate:backup

# 完全移行実行
npm run migrate:to-supabase

# バックアップからの復元
npm run migrate:restore -- --restore backup_key
```

### 移行オプション

- `--dry-run`: ドライラン（実際の移行は行わない）
- `--backup-only`: バックアップのみ作成
- `--force`: 確認プロンプトをスキップ
- `--cleanup`: 移行成功後にローカルデータをクリーンアップ
- `--verbose`: 詳細ログ出力

## 🎨 CRUD操作の使用方法

### useCRUDOperations Composable

```typescript
import { useCRUDOperations } from '@/composables/useCRUDOperations'

// 分析結果の管理
const analysisResults = useCRUDOperations('analysis_results', {
  autoLoad: true,
  enableRealtime: true,
  pageSize: 10
})

// データの読み込み
await analysisResults.loadAll()

// 新しいデータの作成
await analysisResults.create({
  session_id: 'session123',
  analysis_data: { /* ... */ },
  triple_os_data: { /* ... */ }
})

// データの更新
await analysisResults.update('id123', {
  status: 'completed'
})

// データの削除
await analysisResults.remove('id123')
```

### 特化型Composables

```typescript
// 分析結果管理
const { items, isLoading, create, update, remove } = useAnalysisResults()

// 診断履歴管理
const { items, pagination, loadNextPage } = useDiagnosisHistory()

// ユーザー管理
const { currentUser, createOrGetUser } = useUsers()
```

## 🔄 データマイグレーション Dashboard

Vue 3コンポーネントとしてマイグレーション操作を提供：

```vue
<template>
  <MigrationDashboard />
</template>

<script setup>
import MigrationDashboard from '@/components/features/MigrationDashboard.vue'
</script>
```

### 主要機能

- **接続状態監視**: Supabase接続の自動監視
- **データスキャン**: ローカルデータの自動検出・分析
- **進捗表示**: リアルタイム移行進捗の可視化
- **バックアップ管理**: 自動バックアップ・復元機能
- **エラーハンドリング**: 詳細なエラー情報とロールバック

## 📁 プロジェクト構造

```
src/
├── components/
│   ├── common/          # 再利用可能なコンポーネント
│   ├── features/        # 機能特化コンポーネント
│   └── layout/          # レイアウトコンポーネント
├── composables/
│   ├── useDatabase.ts   # データベース操作
│   ├── useCRUDOperations.ts  # CRUD操作
│   └── useSupabase.ts   # Supabase統合
├── services/
│   ├── supabase.ts      # Supabaseクライアント
│   └── supabaseMigration.ts  # マイグレーション
├── types/
│   └── supabase.ts      # 型定義
├── stores/              # Pinia状態管理
├── views/               # ページコンポーネント
└── scripts/
    └── migrateToSupabase.ts  # CLIマイグレーション
```

## 🔐 セキュリティ・プライバシー

### bunenjin哲学準拠

- **プライバシー最優先**: 個人データの完全な制御
- **オフライン対応**: インターネット接続なしでの動作保証
- **データ主権**: ユーザーによる完全なデータ管理
- **透明性**: すべての処理の明確化

### Row Level Security (RLS)

```typescript
// RLS設定の例
await supabase.rls.setUserContext(userId, 'maximum')
const { hasAccess } = await supabase.rls.checkDataAccess('analysis_results', 'result123')
```

## 🧪 テスト

```bash
# 単体テスト
npm run test:unit

# E2Eテスト
npm run test:e2e

# 型チェック
npm run type-check
```

## 📦 ビルド・デプロイ

```bash
# プロダクションビルド
npm run build

# プレビュー
npm run preview
```

## 🔧 開発ツール

### VSCode推奨拡張機能

- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier

### 設定ファイル

- `vite.config.ts` - Vite設定
- `tsconfig.json` - TypeScript設定
- `eslint.config.js` - ESLint設定

## 📚 参考資料

### 公式ドキュメント

- [Vue 3 Guide](https://vuejs.org/guide/)
- [Supabase Documentation](https://supabase.com/docs)
- [Pinia Documentation](https://pinia.vuejs.org/)

### HAQEI固有ドキュメント

- [Triple OS Architecture](../docs/implementation/)
- [易経64卦システム](../docs/guides/)
- [bunenjin哲学](../docs/requirements/)

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。

## 🐛 問題の報告

問題やバグを発見した場合は、[Issues](https://github.com/your-repo/haqei-vue/issues) で報告してください。

---

**開発チーム**: HAQEI Project Contributors  
**最終更新**: 2025-08-03  
**バージョン**: 1.0.0