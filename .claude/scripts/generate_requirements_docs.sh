#!/bin/bash

# 実装開始時の自動要件定義書生成スクリプト
# UserPromptSubmit hookから呼び出される

# hookからのJSONデータを読み取り
HOOK_DATA=$(cat)

# 現在の日時を取得（日本時刻）
TIMESTAMP=$(TZ=JST-9 date +"%Y%m%d_%H%M%S")

# プロジェクトのdocsディレクトリを確認
DOCS_DIR="/Users/hideakimacbookair/Desktop/haqei-analyzer/docs"
mkdir -p "$DOCS_DIR"

# ユーザープロンプトから実装関連キーワードをチェック
if echo "$HOOK_DATA" | grep -q -E "(実装|機能追加|バグ修正|プログラマー|haqei-programmer)"; then
    
    # 要件定義開始ログを記録（claude-codeコマンド使用を避ける）
    cat > "$DOCS_DIR/${TIMESTAMP}_requirements_trigger.log" << EOF
# Requirements Analysis Trigger Log - $TIMESTAMP

## User Prompt Data
\`\`\`json
$HOOK_DATA
\`\`\`

## Status
Implementation requirements analysis triggered at $(TZ=JST-9 date)

## Required Analysis Items
- bunenjin philosophy alignment
- I Ching approach integration (if applicable)
- HAQEI Analyzer existing architecture integration
- Usability considerations
- Security requirements
- Performance requirements
- Test requirements
- Implementation priority

## Note
Manual requirements analysis recommended by haqei-requirements-analyst agent.
Consider Triple OS Architecture and 7-Stage Navigation System integration.
EOF

    # ログ出力
    echo "$(TZ=JST-9 date): Requirements documentation generated successfully" >> "$DOCS_DIR/auto_doc_generation.log"
    
else
    # 実装関連でない場合はスキップ
    echo "$(TZ=JST-9 date): Skipped - not implementation related prompt" >> "$DOCS_DIR/auto_doc_generation.log"
fi

exit 0