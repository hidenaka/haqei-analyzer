#!/bin/bash

echo "🔧 HAQEI Analyzer MCP環境セットアップ"
echo "=================================="

# ユーザー検出
CURRENT_USER=$(whoami)
echo "👤 現在のユーザー: $CURRENT_USER"

# プロジェクトディレクトリ確認
PROJECT_DIR=$(pwd)
echo "📁 プロジェクトディレクトリ: $PROJECT_DIR"

# 必要なファイルの存在確認
echo ""
echo "📋 必要ファイル確認中..."

FILES_TO_CHECK=(
    "cipher-server.js"
    "generate-mcp-config.js"
    "package.json"
    "cipher.config.yaml"
)

ALL_FILES_EXIST=true
for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (見つかりません)"
        ALL_FILES_EXIST=false
    fi
done

if [ "$ALL_FILES_EXIST" = false ]; then
    echo ""
    echo "❌ 必要なファイルが不足しています。"
    exit 1
fi

echo ""
echo "🚀 MCP環境セットアップ開始..."

# 1. MCP設定ファイル生成
echo "1️⃣ MCP設定ファイル生成中..."
npm run mcp:generate

if [ $? -eq 0 ]; then
    echo "   ✅ MCP設定ファイル生成成功"
else
    echo "   ❌ MCP設定ファイル生成失敗"
    exit 1
fi

# 2. Cipherサーバー状態確認
echo ""
echo "2️⃣ Cipherサーバー状態確認..."
if lsof -i :3001 > /dev/null 2>&1; then
    echo "   ✅ Cipherサーバーは既に稼働中 (ポート3001)"
else
    echo "   🔄 Cipherサーバー起動中..."
    npm run cipher:start &
    sleep 3
    if lsof -i :3001 > /dev/null 2>&1; then
        echo "   ✅ Cipherサーバー起動成功"
    else
        echo "   ❌ Cipherサーバー起動失敗"
        exit 1
    fi
fi

# 3. Playwright MCP準備確認
echo ""
echo "3️⃣ Playwright MCP準備確認..."
if npx @playwright/mcp --version > /dev/null 2>&1; then
    echo "   ✅ Playwright MCP利用可能 (バージョン: $(npx @playwright/mcp --version))"
    echo "   💡 コンソールログ機能: playwright_console_logs ツール利用可能"
else
    echo "   ❌ Playwright MCP利用不可"
    echo "   🔄 インストール中..."
    npm install @playwright/mcp
fi

# 4. 設定確認
echo ""
echo "4️⃣ 生成された設定確認..."
if [ -f "claude-mcp-config.json" ]; then
    echo "   ✅ claude-mcp-config.json 生成完了"
    echo "   📝 設定ファイルの場所: $PROJECT_DIR/claude-mcp-config.json"
else
    echo "   ❌ claude-mcp-config.json 生成失敗"
    exit 1
fi

echo ""
echo "🎉 MCP環境セットアップ完了！"
echo "=================================="
echo ""
echo "📖 使用方法:"
echo ""
echo "  Claude Code with MCP統合起動:"
echo "    claude --mcp-config claude-mcp-config.json"
echo ""
echo "  または、既存のClaude Codeセッションで:"
echo "    /tools cipher"
echo "    /tools tsumiki" 
echo "    /tools serena"
echo "    /tools playwright"
echo ""
echo "🔗 利用可能なサービス:"
echo "  • Cipher (ポート3001) - bunenjin哲学とプロジェクト記憶"
echo "  • Tsumiki - AI駆動開発フレームワーク"
echo "  • Serena - セマンティックコード分析"
echo "  • Playwright - ブラウザ自動化 & コンソールログ取得"
echo "  • Claude Flow - AI協調オーケストレーション (87専門ツール)"
echo "  • Ruv Swarm - 分散エージェント協調システム"
echo ""
echo "💡 ヒント:"
echo "  • どちらのユーザー (hideakimacbookair/nakanohideaki) でも使用可能"
echo "  • ユーザー切り替え時は 'npm run mcp:generate' で設定を再生成"
echo ""