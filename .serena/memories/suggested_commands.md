# 推奨コマンド一覧

## 🚀 開発開始時

### 環境セットアップ
```bash
# プロジェクトルートで依存関係インストール
npm install

# Vue 3版開発環境セットアップ
cd haqei-vue
npm install

# 開発サーバー起動（Vue 3版）
npm run dev
# → http://localhost:3000 でアクセス

# レガシー版開発サーバー起動
npm run dev:legacy
```

## 🧪 テスト関連

### Vue 3版テスト
```bash
cd haqei-vue

# ユニットテスト（watch mode）
npm run test:unit

# ユニットテスト（1回実行）
vitest run

# E2Eテスト
npm run test:e2e

# カバレッジレポート
npm run test:coverage
```

### レガシー版テスト
```bash
# レガシーシステムテスト
npm run test:legacy

# 自動検証
npm run validate:legacy
```

## 🔍 コード品質チェック

### リント・フォーマット
```bash
cd haqei-vue

# ESLintチェック
npm run lint

# ESLint自動修正
npm run lint --fix

# Prettierフォーマット
npm run format

# フォーマットチェック（CIで使用）
npm run format:check
```

## 🏗️ ビルド関連

### プロダクションビルド
```bash
cd haqei-vue

# TypeScriptコンパイル + Viteビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

## 🐛 デバッグ・トラブルシューティング

### 開発ツール
```bash
# Viteデバッグモード
DEBUG=vite:* npm run dev

# TypeScriptコンパイルチェック
npx vue-tsc --noEmit

# 依存関係の脆弱性チェック
npm audit

# 依存関係の自動修正
npm audit fix
```

### ログレベル調整
```bash
# 詳細ログでの起動
VITE_LOG_LEVEL=info npm run dev

# エラーログのみ
VITE_LOG_LEVEL=error npm run dev
```

## 📊 プロジェクト管理

### Git運用
```bash
# ブランチ確認
git status

# 変更の確認
git diff

# レガシー版とVue版の変更確認
git diff public/ haqei-vue/

# コミット前の品質チェック
npm run lint && npm run test:unit
```

## 🔧 その他ユーティリティ

### Cipher統合（記憶システム）
```bash
# Cipherサーバー起動
npm run cipher:start

# Cipherサーバー停止
npm run cipher:stop

# Cipher設定テスト
npm run cipher:test
```

### macOS固有
```bash
# システム情報
uname -a

# ポート使用状況確認
lsof -i :3000

# プロセス強制終了
pkill -f "node.*vite"
```

## ⚠️ よくある問題の解決

### ポート競合
```bash
# 別ポートで起動
npm run dev -- --port 3001
```

### Node.js/npm問題
```bash
# npmキャッシュクリア
npm cache clean --force

# node_modules再インストール
rm -rf node_modules package-lock.json
npm install
```

### TypeScript型エラー
```bash
# 型チェックのみ実行
npx vue-tsc --noEmit --watch
```