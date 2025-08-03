# USEP (Universal Service Evolution Platform) 実行ガイド

**作成日**: 2025年8月3日  
**バージョン**: 1.0.0  
**対象**: 開発者、プロダクトマネージャー、品質保証担当者

## 📋 目次

1. [概要](#概要)
2. [セットアップ](#セットアップ)
3. [基本的な使い方](#基本的な使い方)
4. [HaQeiデモの実行](#haqeiデモの実行)
5. [コマンドリファレンス](#コマンドリファレンス)
6. [実行結果の確認](#実行結果の確認)
7. [トラブルシューティング](#トラブルシューティング)

## 📖 概要

USEPは、AI駆動の仮想ユーザーによってWebサービスの品質を自動的に改善するプラットフォームです。1,000〜1,000,000人規模の仮想ユーザーを生成し、体験をシミュレートして、データに基づいた改善提案を生成します。

### 主要機能

- 🎭 **仮想ユーザー生成**: 7次元ペルソナモデルによるリアルなユーザー生成
- 🎮 **体験シミュレーション**: 感情状態を含む完全なユーザージャーニーシミュレーション
- 💡 **自動改善分析**: パターン分析と優先順位付けされた改善提案
- 📊 **レポート生成**: インタラクティブなHTMLレポート

## 🚀 セットアップ

### 前提条件

- Node.js 18以上
- npm または yarn
- TypeScript 5.0以上

### インストール手順

```bash
# 1. 依存関係のインストール
npm install

# 2. TypeScriptのコンパイル（必要に応じて）
npm run build

# 3. 動作確認
npm run usep -- --help
```

## 🎯 基本的な使い方

### 1. クイックデモ（10人の仮想ユーザー）

最も簡単な方法：

```bash
npm run usep:demo
```

これにより以下が実行されます：
- 10人の仮想ユーザー生成
- HaQeiシステムの体験シミュレーション
- 改善分析とHTMLレポート生成

### 2. 標準実行（100人の仮想ユーザー）

```bash
npm run usep:haqei
```

### 3. カスタム実行

```bash
# 1000人のユーザーでEコマースサイトを分析
npm run usep:run -- -c 1000 -s ecommerce

# 50人のユーザーでSaaSを分析（レポート付き）
npm run usep:run -- -c 50 -s saas -r
```

## 🔧 HaQeiデモの実行

### 簡易デモスクリプト

専用のデモスクリプトを使用：

```bash
# 小規模デモ（10人）
npx ts-node src/usep/demo/run-haqei-demo.ts small

# 中規模デモ（100人）
npx ts-node src/usep/demo/run-haqei-demo.ts medium

# 大規模デモ（1000人）
npx ts-node src/usep/demo/run-haqei-demo.ts large
```

### 段階的実行

個別にステップを実行したい場合：

```bash
# Step 1: 仮想ユーザー生成
npm run usep:generate -- -c 100 -s haqei -o ./output/users.json

# Step 2: 体験シミュレーション
npm run usep:simulate -- -i ./output/users.json -s haqei -o ./output/reports.json

# Step 3: 改善分析
npm run usep:analyze -- -i ./output/reports.json -s haqei -o ./output/analysis.json -r
```

## 📘 コマンドリファレンス

### `generate` - 仮想ユーザー生成

```bash
npm run usep:generate -- [options]
```

**オプション:**
- `-c, --count <number>`: ユーザー数（デフォルト: 100）
- `-s, --service <type>`: サービスタイプ（haqei, ecommerce, saas等）
- `-o, --output <path>`: 出力ファイルパス

**例:**
```bash
npm run usep:generate -- -c 500 -s haqei -o ./data/haqei-users.json
```

### `simulate` - 体験シミュレーション

```bash
npm run usep:simulate -- [options]
```

**オプション:**
- `-i, --input <path>`: 仮想ユーザーファイル
- `-s, --service <type>`: サービスタイプ
- `-d, --detail <level>`: 詳細レベル（basic, detailed, comprehensive）
- `-o, --output <path>`: 出力ファイルパス

### `analyze` - 改善分析

```bash
npm run usep:analyze -- [options]
```

**オプション:**
- `-i, --input <path>`: 体験レポートファイル
- `-s, --service <type>`: サービスタイプ
- `-o, --output <path>`: 出力ファイルパス
- `-r, --report`: HTMLレポートも生成

### `run` - 一括実行

```bash
npm run usep:run -- [options]
```

**オプション:**
- `-c, --count <number>`: ユーザー数
- `-s, --service <type>`: サービスタイプ
- `-o, --output-dir <path>`: 出力ディレクトリ
- `-r, --report`: HTMLレポートも生成

## 📊 実行結果の確認

### 出力ファイル構造

```
output/
├── demo/
│   └── haqei-small-2025-08-03T12-00-00/
│       ├── virtual-users.json      # 生成された仮想ユーザー
│       ├── experience-reports.json # 体験シミュレーション結果
│       ├── improvement-analysis.json # 改善分析結果
│       └── report.html            # HTMLレポート
```

### HTMLレポートの内容

1. **サマリーメトリクス**
   - 分析ユーザー数
   - コンバージョン率
   - 平均満足度
   - 全体健全性

2. **優先改善提案**
   - 影響度の高い改善項目
   - 期待される改善効果
   - 実装難易度

3. **実装ロードマップ**
   - 即時対応項目
   - 短期計画
   - 長期計画

4. **主要な発見と成功要因**

### JSON出力の活用

```javascript
// 改善分析結果の読み込み
const fs = require('fs');
const analysis = JSON.parse(fs.readFileSync('./output/improvement-analysis.json', 'utf8'));

// 高優先度の改善提案を抽出
const criticalImprovements = analysis.improvements.filter(
  imp => imp.priority === 'critical'
);

// 期待効果の集計
const totalImpact = analysis.roadmap.estimatedTotalImpact;
console.log(`予測CV改善: +${(totalImpact.conversionImprovement * 100).toFixed(1)}%`);
```

## 🔧 トラブルシューティング

### よくある問題と解決方法

#### 1. メモリ不足エラー

大規模なユーザー数でメモリ不足が発生する場合：

```bash
# Node.jsのメモリ制限を増やす
NODE_OPTIONS="--max-old-space-size=8192" npm run usep:run -- -c 10000
```

#### 2. TypeScriptエラー

```bash
# TypeScriptの型定義を再生成
npm run build

# または直接ts-nodeで実行
npx ts-node --transpile-only src/usep/cli/usep-cli.ts demo
```

#### 3. ファイル権限エラー

```bash
# 出力ディレクトリの権限を確認
chmod -R 755 ./output

# 別の出力ディレクトリを指定
npm run usep:run -- -o /tmp/usep-output
```

### パフォーマンス最適化

#### 並列実行の調整

```javascript
// src/usep/cli/usep-cli.ts の parallelSimulations を調整
const config: SimulationConfig = {
  // ...
  parallelSimulations: 20  // CPUコア数に応じて調整
};
```

#### バッチサイズの調整

大規模実行時は、ScalabilityManagerの設定を調整：

```javascript
// 100万人実行時の推奨設定
const strategy = {
  type: 'distributed',
  batchSize: 10000,
  workerCount: 16
};
```

## 📝 活用例

### 1. 定期的な品質チェック

```bash
# 毎週実行するスクリプト
#!/bin/bash
DATE=$(date +%Y%m%d)
npm run usep:run -- -c 1000 -s haqei -o ./reports/weekly-$DATE -r
```

### 2. A/Bテスト検証

```bash
# バージョンAの分析
npm run usep:run -- -c 500 -s haqei -o ./output/version-a

# バージョンBの分析
npm run usep:run -- -c 500 -s haqei -o ./output/version-b

# 結果を比較
```

### 3. CI/CDパイプライン統合

```yaml
# .github/workflows/usep-analysis.yml
name: USEP Analysis
on:
  schedule:
    - cron: '0 0 * * 0'  # 毎週日曜日
jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run usep:haqei
      - uses: actions/upload-artifact@v3
        with:
          name: usep-report
          path: output/**/*.html
```

## 🎯 まとめ

USEPは、従来の手動テストやユーザーフィードバックに頼らず、AI駆動の仮想ユーザーによって継続的にサービス品質を改善できる強力なツールです。定期的な実行により、ユーザー体験の問題を早期に発見し、データに基づいた改善を実施できます。

---
*本ガイドは、USEPシステムの実行方法を説明したものです。詳細な技術仕様については、技術ドキュメントを参照してください。*