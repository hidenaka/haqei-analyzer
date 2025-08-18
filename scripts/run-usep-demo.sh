#!/bin/bash

# USEP Demo Runner Script
# HaQeiシステムの改善分析デモを簡単に実行するためのスクリプト

echo "🚀 USEP (Universal Service Evolution Platform) デモ実行"
echo "=================================================="
echo ""

# デフォルト値
SIZE="small"
SERVICE="haqei"

# 引数処理
while [[ $# -gt 0 ]]; do
  case $1 in
    -s|--size)
      SIZE="$2"
      shift 2
      ;;
    -t|--type)
      SERVICE="$2"
      shift 2
      ;;
    -h|--help)
      echo "使用方法: ./run-usep-demo.sh [オプション]"
      echo ""
      echo "オプション:"
      echo "  -s, --size     デモサイズ (small|medium|large) デフォルト: small"
      echo "  -t, --type     サービスタイプ (haqei|ecommerce|saas) デフォルト: haqei"
      echo "  -h, --help     このヘルプを表示"
      echo ""
      echo "例:"
      echo "  ./run-usep-demo.sh                    # 小規模HaQeiデモ"
      echo "  ./run-usep-demo.sh -s medium          # 中規模HaQeiデモ"
      echo "  ./run-usep-demo.sh -s large -t saas   # 大規模SaaSデモ"
      exit 0
      ;;
    *)
      echo "不明なオプション: $1"
      exit 1
      ;;
  esac
done

# ユーザー数の設定
case $SIZE in
  small)
    COUNT=10
    DESC="クイック検証"
    ;;
  medium)
    COUNT=100
    DESC="基本検証"
    ;;
  large)
    COUNT=1000
    DESC="本格検証"
    ;;
  *)
    echo "エラー: 無効なサイズ '$SIZE'"
    exit 1
    ;;
esac

echo "設定:"
echo "  - サービスタイプ: $SERVICE"
echo "  - デモサイズ: $SIZE ($COUNT人のユーザー)"
echo "  - 目的: $DESC"
echo ""

# Node.jsとnpmの確認
if ! command -v node &> /dev/null; then
    echo "エラー: Node.jsがインストールされていません"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "エラー: npmがインストールされていません"
    exit 1
fi

# 依存関係の確認
if [ ! -d "node_modules" ]; then
    echo "📦 依存関係をインストールしています..."
    npm install
fi

# TypeScriptとts-nodeの確認
if ! npm list ts-node &> /dev/null; then
    echo "📦 ts-nodeをインストールしています..."
    npm install --save-dev ts-node
fi

# 実行
echo ""
echo "🎯 デモを開始します..."
echo ""

if [ "$SERVICE" = "haqei" ] && [ -f "src/usep/demo/run-haqei-demo.ts" ]; then
    # HaQei専用デモスクリプトを使用
    npx ts-node src/usep/demo/run-haqei-demo.ts $SIZE
else
    # 汎用CLIを使用
    npm run usep:run -- -c $COUNT -s $SERVICE -r
fi

echo ""
echo "✅ デモが完了しました！"
echo ""
echo "📊 結果の確認:"
echo "  - HTMLレポート: output/内の最新フォルダ/report.html"
echo "  - JSONデータ: output/内の最新フォルダ/*.json"
echo ""
echo "💡 ヒント: ブラウザでHTMLレポートを開いて詳細な分析結果を確認してください"