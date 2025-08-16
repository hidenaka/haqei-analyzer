#!/bin/bash
# T18: 重複HTML検知スクリプト（人手混入防止）
# Usage: bash scripts/assert-single-html.sh

set -e

echo "🔍 重複HTMLファイル検出を実行中..."

# os_analyzer.htmlファイルの検出
HTML_FILES=$(find . -name "os_analyzer.html" -type f | grep -v node_modules | grep -v .git || true)
HTML_COUNT=$(echo "$HTML_FILES" | grep -v '^$' | wc -l)

echo "検出されたos_analyzer.htmlファイル:"
echo "$HTML_FILES"

if [ "$HTML_COUNT" -eq 1 ]; then
    CANONICAL_FILE=$(echo "$HTML_FILES" | head -1)
    if [ "$CANONICAL_FILE" = "./public/os_analyzer.html" ]; then
        echo "✅ 正常: public/os_analyzer.htmlが1つだけ存在"
        exit 0
    else
        echo "❌ エラー: os_analyzer.htmlが正しくないディレクトリにあります"
        echo "期待値: ./public/os_analyzer.html"
        echo "実際値: $CANONICAL_FILE"
        exit 1
    fi
elif [ "$HTML_COUNT" -gt 1 ]; then
    echo "❌ エラー: os_analyzer.htmlの重複が検出されました (${HTML_COUNT}個)"
    echo "以下のファイルを削除してください:"
    echo "$HTML_FILES" | grep -v "./public/os_analyzer.html" || true
    exit 1
else
    echo "❌ エラー: os_analyzer.htmlが見つかりません"
    exit 1
fi