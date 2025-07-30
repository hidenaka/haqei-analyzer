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

# haqei-reporterエージェントを使用してドキュメント生成
claude-code task \
  --subagent-type haqei-reporter \
  --description "実装完了ドキュメント生成" \
  --prompt "# 実装完了レポート・データ解説書生成

実装が完了した内容について、以下のドキュメントを $DOCS_DIR に作成してください：

## 作成すべき内容
1. 実装完了レポート（ファイル名：${TIMESTAMP}_implementation_report.md）
2. データ解説書（ファイル名：${TIMESTAMP}_data_explanation.md）
3. 機能説明書（ファイル名：${TIMESTAMP}_feature_guide.md）

## 必須項目
- 実装された機能の詳細説明
- データ構造・アルゴリズムの解説
- 易経的ロジックの実装方法（該当する場合）
- 使用方法・動作例
- トラブルシューティング
- 今後の拡張可能性
- bunenjin哲学との整合性

## コンテキスト情報
実装が完了したエージェント作業について、以下のhookデータを参考にしてください：
\`\`\`json
$HOOK_DATA
\`\`\`

実装されたコードを分析し、技術的詳細と使用方法を分かりやすく文書化してください。
HAQEIアナライザーの全体アーキテクチャとの関連性も説明してください。"

# ログ出力
echo "$(TZ=JST-9 date): Implementation documentation generated successfully" >> "$DOCS_DIR/auto_doc_generation.log"

exit 0