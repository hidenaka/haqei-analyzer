#!/bin/bash
#
# HAQEI Single HTML Assertion Script
# os_analyzer.html が1つだけ存在することを確認
#
set -e

echo "🔍 Checking for os_analyzer.html files..."

# Git管理下のファイルから os_analyzer.html を検索
COUNT=$(git ls-files | grep -E '/?os_analyzer\.html$' | wc -l | tr -d ' ')

echo "   Found $COUNT os_analyzer.html files"

if [ "$COUNT" -ne "1" ]; then
  echo "❌ os_analyzer.html は 1 個だけであるべきです。現在: $COUNT"
  echo ""
  echo "Found files:"
  git ls-files | grep -E '/?os_analyzer\.html$' | sed 's/^/   - /'
  echo ""
  echo "Expected: exactly 1 file at public/os_analyzer.html"
  exit 1
fi

# 正しい場所にあることを確認
EXPECTED_FILE="public/os_analyzer.html"
if ! git ls-files | grep -q "^${EXPECTED_FILE}$"; then
  echo "❌ os_analyzer.html が期待される場所にありません: $EXPECTED_FILE"
  echo ""
  echo "Actual files:"
  git ls-files | grep -E '/?os_analyzer\.html$' | sed 's/^/   - /'
  exit 1
fi

echo "✅ os_analyzer.html は正しく 1 個のみ存在します: $EXPECTED_FILE"