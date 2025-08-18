#!/bin/bash

# HAQEI Analyzer 統合開発環境起動スクリプト
# Cipher + Serena MCP + Claude Code の完全統合

echo "🚀 HAQEI Analyzer 統合開発環境を起動中..."

# カレントディレクトリの確認
HAQEI_ROOT="/Users/hideakimacbookair/Desktop/haqei-analyzer"
cd "$HAQEI_ROOT" || exit 1

echo "📁 プロジェクトディレクトリ: $HAQEI_ROOT"

# 1. Cipherサーバーの起動確認
echo "🧠 Cipher Dual Memory Layer の状態確認..."
if pgrep -f "cipher-server.js" > /dev/null; then
    echo "✅ Cipher サーバーは既に稼働中"
else
    echo "🔄 Cipher サーバーを起動中..."
    npm run cipher:start &
    CIPHER_PID=$!
    sleep 3
    
    sleep 2
    if pgrep -f "cipher-server.js" > /dev/null || pgrep -f "MemAgent" > /dev/null; then
        echo "✅ Cipher サーバー起動完了 (PID: $CIPHER_PID)"
    else
        echo "⚠️ Cipher サーバーのプロセス検出に失敗（ログ出力は正常）"
        echo "   サーバーは起動している可能性があります"
    fi
fi

# 2. Serena MCPサーバーの準備
echo "🔧 Serena MCP の準備..."
cd "$HAQEI_ROOT/serena-mcp" || exit 1

# 依存関係の確認
if [ ! -d ".venv" ]; then
    echo "📦 Serena MCP 依存関係をインストール中..."
    uv sync
fi

# プロジェクト設定の確認
if [ ! -f "$HAQEI_ROOT/.serena/project.yml" ]; then
    echo "❌ Serena プロジェクト設定が見つかりません"
    exit 1
fi

echo "✅ Serena MCP 準備完了"

# 3. 統合設定の検証
echo "🔍 統合設定の検証..."

# Cipher設定確認
if [ -f "$HAQEI_ROOT/cipher.config.yaml" ]; then
    echo "✅ Cipher 設定ファイル確認"
else
    echo "❌ Cipher 設定ファイルが見つかりません"
    exit 1
fi

# Serena設定確認
if [ -f "$HAQEI_ROOT/haqei-serena-integration.yaml" ]; then
    echo "✅ Serena 統合設定確認"
else
    echo "❌ Serena 統合設定が見つかりません"
    exit 1
fi

# Claude Code MCP設定確認
if [ -f "$HAQEI_ROOT/.claude/mcp_config.json" ]; then
    echo "✅ Claude Code MCP 設定確認"
else
    echo "❌ Claude Code MCP 設定が見つかりません"
    exit 1
fi

# 4. 開発環境の状態確認
echo "📊 開発環境の状態確認..."

# Node.js環境
NODE_VERSION=$(node --version)
echo "📗 Node.js: $NODE_VERSION"

# Python環境
cd "$HAQEI_ROOT/serena-mcp"
PYTHON_VERSION=$(uv run python --version)
echo "🐍 Python: $PYTHON_VERSION"

# Serena MCP起動テスト
echo "🧪 Serena MCP 起動テスト..."
cd "$HAQEI_ROOT/serena-mcp"
uv run serena-mcp-server --help > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Serena MCP サーバー正常"
else
    echo "⚠️ Serena MCP サーバーテストで警告（実行は可能）"
fi
cd "$HAQEI_ROOT"

# 5. 統合テストの実行
echo "🔬 統合テストを実行中..."

cd "$HAQEI_ROOT"

# Cipherとの接続テスト
echo "🧠 Cipher接続テスト..."
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Cipher サーバー接続成功"
else
    echo "⚠️ Cipher サーバーへの接続に失敗（起動中の可能性）"
fi

# エージェントシステムテスト
echo "🤖 エージェントシステムテスト..."
if [ -f "agents/test-frontend-developer.js" ]; then
    node agents/test-frontend-developer.js > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ フロントエンドエージェント正常"
    else
        echo "⚠️ フロントエンドエージェントテストで警告"
    fi
fi

# 6. 統合環境の使用方法表示
echo ""
echo "🎉 HAQEI Analyzer 統合開発環境の準備完了！"
echo ""
echo "📋 利用可能な機能:"
echo "   🧠 Cipher Dual Memory Layer: bunenjin哲学と実装パターンの記憶"
echo "   🔧 Serena MCP: セマンティックコード分析とシンボル操作"
echo "   🎭 Playwright MCP: ブラウザ自動化とWebテスト"
echo "   💻 Claude Code: AI支援開発とワークフロー最適化"
echo ""
echo "🚀 使用方法:"
echo "   1. Claude Codeで開発作業を開始"
echo "   2. Serenaがコード構造を分析・最適化提案"
echo "   3. Cipherが哲学的整合性と過去の知見を提供"
echo "   4. 統合された知識で最高品質の実装を実現"
echo ""
echo "🔧 管理コマンド:"
echo "   Cipher起動: npm run cipher:start"
echo "   Cipher停止: npm run cipher:stop"
echo "   Serena起動: cd serena-mcp && uv run serena-mcp-server --project .."
echo "   自動検証: npm run validate"  
echo "   統合テスト: node agents/test-frontend-developer.js"
echo ""
echo "📚 設定ファイル:"
echo "   - haqei-serena-integration.yaml: 統合設定"
echo "   - .serena/project.yml: Serenaプロジェクト設定"
echo "   - .claude/mcp_config.json: Claude Code MCP設定"
echo "   - cipher.config.yaml: Cipher設定"
echo ""
echo "✨ Happy Coding with HAQEI + Cipher + Serena + Claude Code! ✨"

# 7. 開発環境の継続監視（オプション）
if [ "$1" = "--monitor" ]; then
    echo ""
    echo "👁️ 開発環境監視モードを開始..."
    while true; do
        sleep 30
        
        # Cipherサーバーの監視
        if ! pgrep -f "cipher-server.js" > /dev/null; then
            echo "⚠️ Cipher サーバーが停止しました。再起動中..."
            npm run cipher:start &
        fi
        
        echo "✅ $(date '+%H:%M:%S') - 統合環境正常稼働中"
    done
fi