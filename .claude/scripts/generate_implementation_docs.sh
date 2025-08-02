#!/bin/bash

# 実装完了時の自動ドキュメント生成スクリプト
# SubagentStop hookから呼び出される

# hookからのJSONデータを読み取り
HOOK_DATA=$(cat)

# 現在の日時を取得（日本時刻）
TIMESTAMP=$(TZ=JST-9 date +"%Y%m%d_%H%M%S")

# プロジェクトのdocsディレクトリを確認
DOCS_DIR="/Users/hideakimacbookair/Desktop/haqei-analyzer/docs"
mkdir -p "$DOCS_DIR"

# 実装完了ログを記録（claude-codeコマンド使用を避ける）
cat > "$DOCS_DIR/${TIMESTAMP}_implementation_completed.log" << EOF
# Implementation Completed Log - $TIMESTAMP

## Hook Data
\`\`\`json
$HOOK_DATA
\`\`\`

## Status
Implementation task completed at $(TZ=JST-9 date)

## Note
Auto-documentation generation hook triggered.
Manual documentation creation recommended for detailed analysis.
EOF

# ログ出力
echo "$(TZ=JST-9 date): Implementation documentation generated successfully" >> "$DOCS_DIR/auto_doc_generation.log"

exit 0