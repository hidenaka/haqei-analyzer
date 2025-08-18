#!/bin/bash

# シンプルなMCP設定同期スクリプト
echo "🔄 MCP設定をiCloud Driveに同期中..."

ICLOUD_MCP_DIR="$HOME/Library/Mobile Documents/com~apple~CloudDocs/MCP-Config"
CLAUDE_CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"

# iCloud Driveフォルダ作成
mkdir -p "$ICLOUD_MCP_DIR"

# 現在のMCP設定をコピー
if [[ -f "$CLAUDE_CONFIG" ]]; then
    cp "$CLAUDE_CONFIG" "$ICLOUD_MCP_DIR/claude_desktop_config.json"
    echo "✅ MCP設定をiCloud Driveに保存"
else
    echo "❌ Claude設定ファイルが見つかりません"
    exit 1
fi

echo "📍 保存場所: $ICLOUD_MCP_DIR/claude_desktop_config.json"