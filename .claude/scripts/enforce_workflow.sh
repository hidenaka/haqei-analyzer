#!/bin/bash

# ワークフロー強制スクリプト
# 実装タスク前にリサーチとプランを要求

HOOK_DATA=$(cat)
TIMESTAMP=$(TZ=JST-9 date +"%Y%m%d_%H%M%S")
DOCS_DIR="/Users/hideakimacbookair/Desktop/haqei-analyzer/docs"

# プロンプト内容から実装タスクかどうかを判定
if echo "$HOOK_DATA" | grep -q -E "(実装|作成|修正|追加|変更)"; then
    
    echo "🚨 実装タスクが検出されました。必須ワークフローを開始します。" >&2
    echo "" >&2
    echo "📋 必須事項:" >&2
    echo "1. 関連ファイルの徹底調査" >&2
    echo "2. 既存パターンの理解" >&2
    echo "3. 詳細実装プランの提示" >&2
    echo "4. テストファーストアプローチ" >&2
    echo "" >&2
    echo "💡 CLAUDE.mdの作業指示を確認してください。" >&2
    
    # ワークフロー確認ログ
    echo "$(TZ=JST-9 date): Workflow enforcement triggered for implementation task" >> "$DOCS_DIR/workflow_enforcement.log"
    
    # 実装前チェックリスト表示を要求
    cat >&2 << EOF

🔍 実装前チェックリスト:
□ 関連ファイルをGlob/Grepで検索済み
□ 既存コードをReadで理解済み
□ 実装プランをTodoWriteで整理済み
□ テスト戦略を検討済み
□ bunenjin哲学との整合性を確認済み

⚠️  この要件を満たさずに実装を開始することはできません。

EOF

fi

exit 0