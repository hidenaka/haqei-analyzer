#!/bin/bash

# シンプルなMCP設定復元スクリプト
echo "📥 iCloud DriveからMCP設定を復元中..."

ICLOUD_MCP_DIR="$HOME/Library/Mobile Documents/com~apple~CloudDocs/MCP-Config"
CLAUDE_CONFIG_DIR="$HOME/Library/Application Support/Claude"
CLAUDE_CONFIG="$CLAUDE_CONFIG_DIR/claude_desktop_config.json"

# Claude設定ディレクトリ作成
mkdir -p "$CLAUDE_CONFIG_DIR"

# iCloud DriveからMCP設定を復元
if [[ -f "$ICLOUD_MCP_DIR/claude_desktop_config.json" ]]; then
    cp "$ICLOUD_MCP_DIR/claude_desktop_config.json" "$CLAUDE_CONFIG"
    echo "✅ MCP設定を復元"
    echo "📍 復元先: $CLAUDE_CONFIG"
    echo ""
    echo "🚀 次のステップ:"
    echo "   1. Claude Desktopを再起動"
    echo "   2. 右下でMCP接続を確認"
else
    echo "❌ iCloud DriveにMCP設定が見つかりません"
    echo "   他のデバイスで simple-mcp-sync.sh を実行してください"
    exit 1
fi