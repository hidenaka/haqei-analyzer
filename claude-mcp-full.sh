#!/bin/bash

# Claude Code with MCP統合起動スクリプト
# 完全環境セットアップとClaude Code起動を1コマンドで実行

echo "🚀 Claude Code with MCP 統合環境を起動します..."

# 1. 完全環境セットアップ
echo "📦 MCP環境をセットアップ中..."
npm run mcp:setup

# セットアップが成功したか確認
if [ $? -ne 0 ]; then
    echo "❌ MCPセットアップに失敗しました"
    exit 1
fi

# 少し待機（サービスが完全に起動するまで）
echo "⏳ サービスの起動を待機中..."
sleep 2

# 2. Claude Code with MCP起動
echo "🎯 Claude Code with MCPを起動中..."
if [ "$1" = "--unsafe" ]; then
    echo "⚠️  権限チェックをスキップして起動します"
    claude --mcp-config claude-mcp-config.json --dangerously-skip-permissions
else
    claude --mcp-config claude-mcp-config.json
fi

echo "✅ 統合環境の起動が完了しました！"