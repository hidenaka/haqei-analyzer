#!/bin/bash

# HAQEI Analyzer MCP Services 起動スクリプト

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 環境変数読み込み
if [[ -f ".env.mcp" ]]; then
    source .env.mcp
    echo "✅ 環境変数読み込み完了"
fi

echo "🚀 HAQEI MCP Services 起動開始..."

# Cipher起動
echo "🧠 Cipher Memory Layer 起動中..."
npm run cipher:start &
CIPHER_PID=$!

# 起動確認
sleep 3
if curl -s "http://localhost:3001/health" &> /dev/null; then
    echo "✅ Cipher起動成功 (PID: $CIPHER_PID)"
else
    echo "⚠️  Cipher起動確認できず"
fi

echo "✨ MCP Services 起動完了"
echo "📋 利用可能なコマンド:"
echo "   Cipher停止: npm run cipher:stop"
echo "   Tsumiki: node tsumiki-cli.js [command]"
echo "   Serena: python3 -m serena_mcp"
echo "   Playwright: npx @playwright/mcp"

