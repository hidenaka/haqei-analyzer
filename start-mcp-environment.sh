#!/bin/bash

# MCP環境のセットアップスクリプト
echo "🚀 MCP環境を初期化しています..."

# プロジェクトディレクトリ
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

# claude-mcp-config.jsonの存在確認
if [ -f "$PROJECT_DIR/claude-mcp-config.json" ]; then
    echo "✅ MCP設定ファイルが存在します"
    echo "📋 設定されているMCPサーバー:"
    echo "  • Cipher: HaQei哲学とプロジェクト記憶の継続管理"
    echo "  • Tsumiki: AI駆動開発フレームワーク"
    echo "  • Serena: セマンティックコード分析"
    echo "  • Playwright: ブラウザ自動化とE2Eテスト"
    echo "  • Claude Flow: エンタープライズグレードAI orchestration"
    echo "  • Ruv Swarm: 分散エージェント協調システム"
else
    echo "❌ claude-mcp-config.jsonが見つかりません"
    echo "📝 設定ファイルを生成します..."
    npm run mcp:generate
fi

echo ""
echo "🚀 MCPサーバーを起動しています..."

# すべてのMCPサーバーを起動
if [ -f "$PROJECT_DIR/start-all-mcp-servers.sh" ]; then
    chmod +x "$PROJECT_DIR/start-all-mcp-servers.sh"
    "$PROJECT_DIR/start-all-mcp-servers.sh"
else
    echo "⚠️ start-all-mcp-servers.sh が見つかりません"
    echo "📝 MCPサーバーは Claude 起動時に自動的に開始されます"
fi

echo "🎉 MCP環境の準備が完了しました！"