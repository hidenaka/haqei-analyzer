# 技術スタック詳細

## 📦 主要依存関係

### Vue 3版（haqei-vue/）
- **Vue 3.5.18**: メインフレームワーク
- **TypeScript 5.8.3**: 型安全性
- **Vite 7.0.4**: ビルドツール
- **Pinia 3.0.3**: 状態管理
- **Vue Router 4.5.1**: ルーティング
- **Chart.js 4.5.0**: データ可視化
- **Vitest 3.2.4**: ユニットテスト
- **Playwright**: E2Eテスト

### レガシー版（public/）
- **Vanilla JavaScript ES6+**: モジュラー構造
- **Chart.js 3.9.1**: データビジュアライゼーション
- **Custom CSS**: CSS変数システム

## 🔧 開発ツール

### コード品質
- **ESLint**: コード品質チェック
- **Prettier**: コードフォーマット
- **Husky**: Git hooks
- **lint-staged**: ステージングファイルのリント

### テスト環境
- **Vitest**: ユニットテスト（jsdom環境）
- **@testing-library/vue**: Vueコンポーネントテスト
- **Playwright**: E2Eテスト
- **jsdom**: ブラウザ環境シミュレーション

## 🚀 実行コマンド

### Vue 3版開発
```bash
cd haqei-vue
npm run dev          # 開発サーバー
npm run build        # プロダクションビルド
npm run test:unit    # ユニットテスト
npm run lint         # コードチェック
npm run format       # コードフォーマット
```

### レガシー版開発
```bash
npm run dev:legacy   # レガシー開発サーバー
npm run test:legacy  # レガシーテスト
```

## 📁 パス設定

### TypeScript パスマッピング
```typescript
"paths": {
  "@/*": ["./src/*"],
  "@components/*": ["./src/components/*"],
  "@views/*": ["./src/views/*"],
  "@utils/*": ["./src/utils/*"],
  "@stores/*": ["./src/stores/*"],
  "@types/*": ["./src/types/*"]
}
```