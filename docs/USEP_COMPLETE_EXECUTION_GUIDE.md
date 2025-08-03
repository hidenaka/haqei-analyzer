# USEP (Universal Service Evolution Platform) 完全実行ガイド

**このドキュメントをAIに渡すことで、USEPシステムを実行できます**

## 🎯 システム概要

USEPは、AI駆動の仮想ユーザーを使用してWebサービスの品質を自動的に改善するプラットフォームです。

### 主要機能
- 1,000〜1,000,000人規模の仮想ユーザー生成
- 完全なユーザー体験シミュレーション（感情状態追跡付き）
- データ駆動型の改善提案自動生成
- 優先順位付けとROI計算
- インタラクティブHTMLレポート生成

## 📋 前提条件

以下がインストールされている必要があります：
- Node.js 18以上
- npm (Node.jsに含まれています)
- Git

## 🚀 クイックスタート（最も簡単な方法）

### ステップ1: プロジェクトディレクトリに移動

```bash
cd /Users/nakanohideaki/Desktop/haqei-analyzer
```

### ステップ2: 依存関係のインストール

```bash
npm install
```

### ステップ3: デモの実行

最も簡単なデモ実行（10人の仮想ユーザー）：

```bash
npm run usep:demo
```

これで完了です！結果は `output/demo/` フォルダに生成されます。

## 📖 詳細な実行方法

### 方法1: npm scriptsを使用（推奨）

```bash
# クイックデモ（10人）
npm run usep:quick

# 標準実行（100人）
npm run usep:haqei

# カスタム実行（例：500人）
npm run usep:run -- -c 500 -s haqei -r
```

### 方法2: シェルスクリプトを使用

```bash
# 実行権限を付与（初回のみ）
chmod +x run-usep-demo.sh

# 小規模デモ
./run-usep-demo.sh

# 中規模デモ
./run-usep-demo.sh -s medium

# 大規模デモ
./run-usep-demo.sh -s large
```

### 方法3: CLIを直接使用

```bash
# ヘルプを表示
npx ts-node src/usep/cli/usep-cli.ts --help

# 一括実行
npx ts-node src/usep/cli/usep-cli.ts run -c 100 -s haqei -r

# 個別実行
npx ts-node src/usep/cli/usep-cli.ts generate -c 50 -s haqei
npx ts-node src/usep/cli/usep-cli.ts simulate -i ./output/virtual-users.json
npx ts-node src/usep/cli/usep-cli.ts analyze -i ./output/experience-reports.json -r
```

## 📊 実行結果の確認

### 出力ファイルの場所

実行後、以下の構造でファイルが生成されます：

```
output/
└── demo/  (または usep-haqei-[タイムスタンプ]/)
    ├── virtual-users.json      # 生成された仮想ユーザー
    ├── experience-reports.json # 体験シミュレーション結果
    ├── improvement-analysis.json # 改善分析結果
    └── report.html            # 📊 ビジュアルレポート（これを開く）
```

### HTMLレポートの開き方

1. Finderでファイルを開く：
```bash
open output/demo/report.html
```

2. または、ブラウザにドラッグ&ドロップ

### レポートの内容

- **サマリーメトリクス**: コンバージョン率、満足度、健全性スコア
- **優先改善提案**: 影響度の高い改善項目と期待効果
- **実装ロードマップ**: 即時・短期・長期の改善計画
- **主要な発見**: ユーザー体験の問題点と成功要因

## 🛠️ トラブルシューティング

### エラー: "Cannot find module 'commander'"

依存関係が不足しています：
```bash
npm install
```

### エラー: "Cannot find module 'ts-node'"

TypeScript実行環境をインストール：
```bash
npm install --save-dev ts-node typescript
```

### エラー: "Permission denied"

実行権限を付与：
```bash
chmod +x run-usep-demo.sh
```

### メモリ不足エラー（大規模実行時）

メモリ制限を増やして実行：
```bash
NODE_OPTIONS="--max-old-space-size=8192" npm run usep:run -- -c 10000 -s haqei
```

## 📝 ユースケース別実行例

### 1. HaQeiの品質チェック（推奨）

```bash
# 100人でHaQeiを分析
npm run usep:haqei
```

### 2. 異なるサービスタイプの分析

```bash
# Eコマースサイト
npm run usep:run -- -c 200 -s ecommerce -r

# SaaSアプリケーション
npm run usep:run -- -c 150 -s saas -r
```

### 3. 大規模な本格分析

```bash
# 1000人での詳細分析
npm run usep:run -- -c 1000 -s haqei -r
```

### 4. 段階的な実行（デバッグ用）

```bash
# Step 1: ユーザー生成のみ
npm run usep:generate -- -c 50 -o ./test-users.json

# Step 2: シミュレーションのみ
npm run usep:simulate -- -i ./test-users.json -o ./test-reports.json

# Step 3: 分析のみ
npm run usep:analyze -- -i ./test-reports.json -r
```

## 🎯 期待される結果

### 実行時間の目安

- 小規模（10人）: 約1-2分
- 中規模（100人）: 約5-10分
- 大規模（1000人）: 約30-60分

### 生成される改善提案の例

1. **UI/UX改善**
   - フォームの簡素化
   - ナビゲーションの最適化
   - モバイル体験の向上

2. **パフォーマンス改善**
   - ページ読み込み速度の最適化
   - レスポンシブデザインの修正

3. **コンテンツ改善**
   - 価値提案の明確化
   - オンボーディングフローの改善

## 💡 実行のベストプラクティス

1. **初回は小規模で実行**
   - まず `npm run usep:demo` で動作確認
   - その後、必要に応じて規模を拡大

2. **定期的な実行**
   - 週次または月次で実行し、改善の進捗を追跡
   - 結果を保存して比較分析

3. **結果の活用**
   - HTMLレポートをチームで共有
   - 高優先度の改善から実装
   - 実装後に再度分析を実行して効果測定

## 📌 重要なファイルパス

```
/Users/nakanohideaki/Desktop/haqei-analyzer/
├── src/usep/              # USEPシステムのソースコード
│   ├── cli/               # CLIツール
│   ├── core/              # コアエンジン
│   ├── config/            # 設定ファイル
│   └── demo/              # デモスクリプト
├── output/                # 実行結果の出力先
├── package.json           # npm設定とスクリプト
└── run-usep-demo.sh       # 便利な実行スクリプト
```

## 🔗 コマンドリファレンス

### 利用可能なnpmスクリプト

```bash
npm run usep              # CLIヘルプを表示
npm run usep:demo         # デモ実行（10人）
npm run usep:quick        # クイック実行（10人）
npm run usep:haqei        # HaQei分析（100人）
npm run usep:generate     # ユーザー生成のみ
npm run usep:simulate     # シミュレーションのみ
npm run usep:analyze      # 分析のみ
npm run usep:run          # カスタム実行
```

### CLIオプション

```
-c, --count <number>      ユーザー数（デフォルト: 100）
-s, --service <type>      サービスタイプ（haqei|ecommerce|saas）
-o, --output <path>       出力パス
-r, --report              HTMLレポートも生成
-d, --detail <level>      詳細レベル（basic|detailed|comprehensive）
```

## ✅ 実行チェックリスト

1. □ プロジェクトディレクトリに移動した
2. □ `npm install` を実行した
3. □ `npm run usep:demo` でテスト実行した
4. □ `output/` フォルダに結果が生成された
5. □ HTMLレポートをブラウザで開いた

## 📞 サポート

問題が発生した場合：

1. エラーメッセージをコピー
2. 実行したコマンドを記録
3. Node.jsのバージョンを確認: `node --version`
4. npmのバージョンを確認: `npm --version`

---

**このドキュメントの内容をそのままコピーして実行すれば、USEPシステムを使用できます。**

最初は `npm run usep:demo` から始めることをお勧めします。