# USEP AIクイックコマンド集

**このファイルのコマンドをコピー&ペーストするだけでUSEPを実行できます**

## 🚀 最速実行（推奨）

```bash
# 1. プロジェクトに移動
cd /Users/nakanohideaki/Desktop/haqei-analyzer

# 2. 依存関係インストール（初回のみ）
npm install

# 3. デモ実行
npm run usep:demo

# 4. 結果を開く
open output/demo/report.html
```

## 📋 よく使うコマンド集

### 基本コマンド

```bash
# 小規模テスト（10人）
npm run usep:demo

# 標準分析（100人）
npm run usep:haqei

# 大規模分析（1000人）
npm run usep:run -- -c 1000 -s haqei -r
```

### サービス別分析

```bash
# HaQei分析
npm run usep:run -- -c 100 -s haqei -r

# Eコマース分析
npm run usep:run -- -c 100 -s ecommerce -r

# SaaS分析
npm run usep:run -- -c 100 -s saas -r
```

### 結果確認

```bash
# 最新の結果フォルダを探す
ls -la output/

# HTMLレポートを開く（Macの場合）
open output/*/report.html

# JSONデータを確認
cat output/*/improvement-analysis.json | jq '.summary'
```

## 🔧 トラブルシューティングコマンド

```bash
# Node.jsバージョン確認
node --version

# npmバージョン確認
npm --version

# 依存関係の再インストール
rm -rf node_modules package-lock.json
npm install

# TypeScriptエラーの場合
npm install --save-dev typescript ts-node @types/node

# 実行権限エラーの場合
chmod +x run-usep-demo.sh

# メモリ不足の場合（大規模実行）
NODE_OPTIONS="--max-old-space-size=8192" npm run usep:run -- -c 10000 -s haqei
```

## 📊 分析結果の活用コマンド

```bash
# 改善提案の上位5件を表示
cat output/*/improvement-analysis.json | jq '.improvements[:5] | .[] | {title, priority, impact: .estimatedImpact.conversionImprovement}'

# コンバージョン率を確認
cat output/*/improvement-analysis.json | jq '.summary.conversionRate'

# 全体健全性を確認
cat output/*/improvement-analysis.json | jq '.summary.overallHealth'

# 結果をCSVに変換（簡易版）
cat output/*/improvement-analysis.json | jq -r '.improvements[] | [.priority, .title, .estimatedImpact.conversionImprovement] | @csv' > improvements.csv
```

## 🎯 ワンライナー実行

### すべてを一度に実行（デモ）

```bash
cd /Users/nakanohideaki/Desktop/haqei-analyzer && npm install && npm run usep:demo && open output/demo/report.html
```

### HaQei本格分析（100人）

```bash
cd /Users/nakanohideaki/Desktop/haqei-analyzer && npm run usep:haqei && open output/usep-haqei-*/report.html
```

## 📝 実行後の確認事項

```bash
# 生成されたファイルを確認
find output -name "*.html" -mtime -1 | head -5

# 最新のレポートを開く
open $(find output -name "report.html" -mtime -1 | head -1)

# 実行ログを保存
npm run usep:demo > usep-execution.log 2>&1

# 結果をバックアップ
cp -r output/usep-haqei-* ~/Desktop/usep-backup-$(date +%Y%m%d)
```

## 💡 便利なエイリアス設定

以下を ~/.bashrc または ~/.zshrc に追加：

```bash
# USEP shortcuts
alias usep-demo="cd /Users/nakanohideaki/Desktop/haqei-analyzer && npm run usep:demo"
alias usep-haqei="cd /Users/nakanohideaki/Desktop/haqei-analyzer && npm run usep:haqei"
alias usep-report="open /Users/nakanohideaki/Desktop/haqei-analyzer/output/*/report.html"
```

## 🔄 定期実行スクリプト

```bash
#!/bin/bash
# weekly-usep-analysis.sh

cd /Users/nakanohideaki/Desktop/haqei-analyzer
DATE=$(date +%Y%m%d_%H%M%S)
OUTPUT_DIR="output/weekly-analysis-$DATE"

# 実行
npm run usep:run -- -c 500 -s haqei -o $OUTPUT_DIR -r

# 結果を開く
open $OUTPUT_DIR/report.html

# Slackに通知（オプション）
# curl -X POST -H 'Content-type: application/json' --data '{"text":"USEP分析が完了しました"}' YOUR_SLACK_WEBHOOK_URL
```

---

**これらのコマンドをコピー&ペーストするだけで、USEPシステムを実行できます。**

最初は基本コマンドの「npm run usep:demo」から始めてください。