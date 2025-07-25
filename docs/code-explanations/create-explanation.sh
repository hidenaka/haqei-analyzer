#!/bin/bash

# 『コード解説書』自動作成スクリプト
# 使用方法: ./create-explanation.sh [カテゴリ] [簡潔な説明]
# 例: ./create-explanation.sh bugfix analyzer-display-issue

if [ $# -ne 2 ]; then
    echo "使用方法: $0 [カテゴリ] [簡潔な説明]" 
    echo "カテゴリ: bugfix, feature, enhancement, maintenance"
    exit 1
fi

CATEGORY=$1
DESCRIPTION=$2
DATE=$(date +%Y%m%d)
YEAR_MONTH=$(date +%Y-%m)

# ファイル名生成
FILENAME="${DATE}_${CATEGORY}_${DESCRIPTION}.md"

# ディレクトリ作成（必要に応じて）
mkdir -p "by-date/${YEAR_MONTH}"

# 日付別ディレクトリに主ファイル作成
cp template.md "by-date/${YEAR_MONTH}/${FILENAME}"

# 機能別ディレクトリの決定とシンボリックリンク作成
case $CATEGORY in
    "bugfix")
        FEATURE_DIR="bug-fixes"
        PRIORITY_DIR="critical"
        ;;
    "feature")
        FEATURE_DIR="ui-components"  # デフォルト、必要に応じて変更
        PRIORITY_DIR="enhancement"
        ;;
    "enhancement")
        FEATURE_DIR="ui-components"  # デフォルト、必要に応じて変更
        PRIORITY_DIR="enhancement"
        ;;
    "maintenance")
        FEATURE_DIR="data-processing"  # デフォルト、必要に応じて変更
        PRIORITY_DIR="maintenance"
        ;;
    *)
        FEATURE_DIR="ui-components"  # デフォルト
        PRIORITY_DIR="enhancement"
        ;;
esac

# シンボリックリンク作成
ln -s "../../by-date/${YEAR_MONTH}/${FILENAME}" "by-feature/${FEATURE_DIR}/${FILENAME}"
ln -s "../../by-date/${YEAR_MONTH}/${FILENAME}" "by-priority/${PRIORITY_DIR}/${FILENAME}"

echo "✅ 解説書テンプレートを作成しました: by-date/${YEAR_MONTH}/${FILENAME}"
echo "📝 エディタで編集してください"
echo "🔗 シンボリックリンクも作成済み:"
echo "   - by-feature/${FEATURE_DIR}/${FILENAME}"
echo "   - by-priority/${PRIORITY_DIR}/${FILENAME}"
echo ""
echo "⚠️  作成後は index.md の更新も忘れずに行ってください"