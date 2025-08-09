#!/bin/bash

# HAQEI Analyzer iCloud Drive からの同期スクリプト

echo "☁️  iCloud Drive から設定を同期中..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ICLOUD_PATH="$HOME/Library/Mobile Documents/com~apple~CloudDocs"
HAQEI_ICLOUD_DIR="$ICLOUD_PATH/HAQEI-Analyzer-Config"

# iCloud Drive 利用可能性チェック
if [[ ! -d "$HAQEI_ICLOUD_DIR" ]]; then
    echo "❌ iCloud Drive にHAQEI設定が見つかりません"
    echo "   他のデバイスでsetup-icloud-sync.shを実行してください"
    exit 1
fi

echo "📥 共有設定ファイルをダウンロード中..."

# 共有設定ファイルをローカルにコピー
SHARED_FILES=()

for file in "${SHARED_FILES[@]}"; do
    RELATIVE_PATH="${file#$HAQEI_ICLOUD_DIR/shared/}"
    TARGET_PATH="$SCRIPT_DIR/$RELATIVE_PATH"
    
    # ディレクトリ作成
    mkdir -p "$(dirname "$TARGET_PATH")"
    
    # ファイルコピー（既存ファイルは確認）
    if [[ -f "$TARGET_PATH" ]]; then
        echo "⚠️  $RELATIVE_PATH は既に存在します（スキップ）"
    else
        cp "$file" "$TARGET_PATH"
        echo "✅ $RELATIVE_PATH をダウンロード"
    fi
done

# デバイス固有設定の確認
HOSTNAME=$(hostname)
if [[ "$HOSTNAME" == *"macbook"* ]] || [[ "$HOSTNAME" == *"MacBook"* ]]; then
    DEVICE_ID="macbook-air"
elif [[ "$HOSTNAME" == *"mac-mini"* ]] || [[ "$HOSTNAME" == *"Mac-mini"* ]] || [[ "$HOSTNAME" == *"macmini"* ]]; then
    DEVICE_ID="mac-mini"
else
    DEVICE_ID="unknown-$(hostname | tr '.' '-')"
fi

DEVICE_DIR="$HAQEI_ICLOUD_DIR/device-specific/$DEVICE_ID"

if [[ -d "$DEVICE_DIR" ]]; then
    echo "📱 デバイス固有設定を復元中..."
    
    # .env.mcp復元
    if [[ -f "$DEVICE_DIR/.env.mcp" ]]; then
        cp "$DEVICE_DIR/.env.mcp" "$SCRIPT_DIR/.env.mcp"
        echo "✅ 環境変数を復元"
    fi
    
    # Claude Desktop設定復元
    if [[ -f "$DEVICE_DIR/claude_desktop_config.json" ]]; then
        CLAUDE_CONFIG_DIR="$HOME/Library/Application Support/Claude"
        mkdir -p "$CLAUDE_CONFIG_DIR"
        cp "$DEVICE_DIR/claude_desktop_config.json" "$CLAUDE_CONFIG_DIR/claude_desktop_config.json"
        echo "✅ Claude Desktop設定を復元"
    fi
else
    echo "⚠️  このデバイス($DEVICE_ID)の専用設定が見つかりません"
    echo "   setup-mcp-environment.sh を実行して新規設定を作成してください"
fi

echo "🔧 MCP環境セットアップを実行中..."
if [[ -f "$SCRIPT_DIR/setup-mcp-environment.sh" ]]; then
    chmod +x "$SCRIPT_DIR/setup-mcp-environment.sh"
    "$SCRIPT_DIR/setup-mcp-environment.sh"
else
    echo "❌ setup-mcp-environment.sh が見つかりません"
fi

echo "✅ iCloud Drive同期完了！"
echo ""
echo "🚀 次のステップ:"
echo "   1. Claude Desktop を再起動"
echo "   2. ./start-mcp-services.sh でサービス起動テスト"
echo "   3. ./verify-mcp-setup.sh で環境検証"

