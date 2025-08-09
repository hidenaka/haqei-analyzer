#!/bin/bash

# MacBook Air → Mac mini 環境同期スクリプト

echo "🔄 Mac mini環境同期開始..."

# 設定ファイルリスト
CONFIG_FILES=(
    "claude-mcp-config.json"
    ".env.mcp"
    "claude_desktop_config.json"
    "setup-mcp-environment.sh"
    "start-mcp-services.sh"
)

# Mac mini情報（実際の値に変更してください）
MAC_MINI_USER="hideaki"  # Mac miniのユーザー名
MAC_MINI_HOST="mac-mini.local"  # Mac miniのホスト名
MAC_MINI_PATH="/Users/$MAC_MINI_USER/Desktop/haqei-analyzer"

echo "🎯 転送先: $MAC_MINI_USER@$MAC_MINI_HOST:$MAC_MINI_PATH"

# ファイル転送
for file in "${CONFIG_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "📁 転送中: $file"
        scp "$file" "$MAC_MINI_USER@$MAC_MINI_HOST:$MAC_MINI_PATH/"
    fi
done

# Mac mini側でセットアップ実行
echo "🖥️  Mac mini側セットアップ実行..."
ssh "$MAC_MINI_USER@$MAC_MINI_HOST" "cd $MAC_MINI_PATH && ./setup-mcp-environment.sh"

echo "✅ Mac mini環境同期完了"

