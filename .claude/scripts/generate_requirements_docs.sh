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
    
    # haqei-requirements-analystエージェントを使用して要件定義書生成
    claude-code task \
      --subagent-type haqei-requirements-analyst \
      --description "要件定義書自動生成" \
      --prompt "# 要件定義書自動生成

実装が開始される内容について、以下の要件定義書を $DOCS_DIR に作成してください：

## 作成すべき内容
1. 技術仕様書（ファイル名：${TIMESTAMP}_technical_specification.md）
2. 実装要件書（ファイル名：${TIMESTAMP}_implementation_requirements.md）
3. テスト計画書（ファイル名：${TIMESTAMP}_test_plan.md）

## 必須項目
- bunenjin哲学との整合性
- 易経的アプローチの組み込み（該当する場合）
- HAQEIアナライザーの既存アーキテクチャとの統合
- ユーザビリティ考慮事項
- セキュリティ要件
- パフォーマンス要件
- テスト要件
- 実装優先順位

## コンテキスト情報
以下のユーザープロンプトを元に要件定義を行ってください：
\`\`\`json
$HOOK_DATA
\`\`\`

現在のプロジェクト状況と実装予定を分析し、詳細な要件定義を行ってください。
特に、Triple OS Architecture（Engine/Interface/Safe Mode）や7-Stage Navigation Systemとの統合を考慮してください。"

    # ログ出力
    echo "$(TZ=JST-9 date): Requirements documentation generated successfully" >> "$DOCS_DIR/auto_doc_generation.log"
    
else
    # 実装関連でない場合はスキップ
    echo "$(TZ=JST-9 date): Skipped - not implementation related prompt" >> "$DOCS_DIR/auto_doc_generation.log"
fi

exit 0