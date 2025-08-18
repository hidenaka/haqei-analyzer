#!/bin/bash

# HAQEI Analyzer MCP環境検証スクリプト
# MacBook Air / Mac mini 両対応版

echo "🔍 HAQEI Analyzer MCP環境検証開始..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 結果記録用
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNINGS=0

# チェック関数
check_result() {
    local test_name="$1"
    local result="$2"
    local details="$3"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [[ "$result" == "PASS" ]]; then
        echo -e "✅ ${GREEN}$test_name${NC} - $details"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    elif [[ "$result" == "WARN" ]]; then
        echo -e "⚠️  ${YELLOW}$test_name${NC} - $details"
        WARNINGS=$((WARNINGS + 1))
    else
        echo -e "❌ ${RED}$test_name${NC} - $details"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
}

echo "🖥️  デバイス情報確認..."
HOSTNAME=$(hostname)
echo "ホスト名: $HOSTNAME"

# デバイスタイプ検出
if [[ "$HOSTNAME" == *"macbook"* ]] || [[ "$HOSTNAME" == *"MacBook"* ]]; then
    DEVICE_TYPE="MacBook Air"
elif [[ "$HOSTNAME" == *"mac-mini"* ]] || [[ "$HOSTNAME" == *"Mac-mini"* ]] || [[ "$HOSTNAME" == *"macmini"* ]]; then
    DEVICE_TYPE="Mac mini"
else
    DEVICE_TYPE="Unknown ($HOSTNAME)"
fi

echo "デバイスタイプ: $DEVICE_TYPE"
echo ""

# 1. ソフトウェア依存関係チェック
echo "📦 ソフトウェア依存関係チェック..."

# Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    if [[ "$NODE_VERSION" > "v22.17.0" ]] || [[ "$NODE_VERSION" == "v22.17.0" ]]; then
        check_result "Node.js" "PASS" "$NODE_VERSION"
    else
        check_result "Node.js" "FAIL" "$NODE_VERSION (required: v22.17.0+)"
    fi
else
    check_result "Node.js" "FAIL" "未インストール"
fi

# Python3
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    check_result "Python3" "PASS" "$PYTHON_VERSION"
else
    check_result "Python3" "FAIL" "未インストール"
fi

# npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    check_result "npm" "PASS" "v$NPM_VERSION"
else
    check_result "npm" "FAIL" "未インストール"
fi

# npx
if command -v npx &> /dev/null; then
    check_result "npx" "PASS" "利用可能"
else
    check_result "npx" "FAIL" "未インストール"
fi

echo ""

# 2. プロジェクトファイル確認
echo "📂 プロジェクトファイル確認..."

PROJECT_FILES=(
    "cipher-server.js:Cipher MCPサーバー"
    "tsumiki-cli.js:Tsumiki CLI"
    ".serena/project.yml:Serena設定"
    "package.json:Node.js設定"
    "CLAUDE.md:プロジェクト指示書"
    "setup-mcp-environment.sh:MCP環境セットアップ"
    "start-mcp-services.sh:サービス起動スクリプト"
)

for file_info in "${PROJECT_FILES[@]}"; do
    IFS=':' read -r file desc <<< "$file_info"
    if [[ -f "$file" ]]; then
        check_result "$desc" "PASS" "$file"
    else
        check_result "$desc" "FAIL" "$file (見つかりません)"
    fi
done

echo ""

# 3. Claude Desktop設定確認
echo "🖥️  Claude Desktop設定確認..."

CLAUDE_CONFIG_PATHS=(
    "$HOME/Library/Application Support/Claude/claude_desktop_config.json"
    "$HOME/.config/claude-desktop/config.json"
    "$HOME/.claude-desktop/config.json"
)

CLAUDE_CONFIG_FOUND=false
for config_path in "${CLAUDE_CONFIG_PATHS[@]}"; do
    if [[ -f "$config_path" ]]; then
        check_result "Claude Desktop設定" "PASS" "$config_path"
        CLAUDE_CONFIG_FOUND=true
        
        # MCP設定内容確認
        if grep -q "mcpServers" "$config_path"; then
            check_result "MCP設定" "PASS" "mcpServers設定確認"
        else
            check_result "MCP設定" "FAIL" "mcpServers設定が見つからない"
        fi
        
        # 各MCPサーバー設定確認
        for server in "cipher" "tsumiki" "serena" "playwright"; do
            if grep -q "\"$server\"" "$config_path"; then
                check_result "$server MCP設定" "PASS" "設定確認"
            else
                check_result "$server MCP設定" "WARN" "設定が見つからない"
            fi
        done
        
        break
    fi
done

if [[ "$CLAUDE_CONFIG_FOUND" == false ]]; then
    check_result "Claude Desktop設定" "FAIL" "設定ファイルが見つからない"
fi

echo ""

# 4. 環境変数ファイル確認
echo "🔧 環境設定ファイル確認..."

ENV_FILES=(
    ".env.mcp:MCP環境変数"
    "cipher.config.yaml:Cipher設定"
    ".env.cipher:Cipher環境変数"
)

for file_info in "${ENV_FILES[@]}"; do
    IFS=':' read -r file desc <<< "$file_info"
    if [[ -f "$file" ]]; then
        check_result "$desc" "PASS" "$file"
    else
        check_result "$desc" "WARN" "$file (オプション)"
    fi
done

echo ""

# 5. Node.js依存関係確認
echo "📦 Node.js依存関係確認..."

if [[ -f "package.json" ]]; then
    # 重要な依存関係チェック
    REQUIRED_DEPS=(
        "@playwright/mcp:Playwright MCP"
        "playwright:Playwright"
        "@byterover/cipher:Cipher統合"
        "@google/generative-ai:Gemini API"
    )
    
    for dep_info in "${REQUIRED_DEPS[@]}"; do
        IFS=':' read -r dep desc <<< "$dep_info"
        if grep -q "\"$dep\"" package.json; then
            check_result "$desc" "PASS" "package.jsonに記載"
        else
            check_result "$desc" "WARN" "package.jsonに記載なし"
        fi
    done
    
    # node_modules確認
    if [[ -d "node_modules" ]]; then
        check_result "Node modules" "PASS" "node_modules存在"
    else
        check_result "Node modules" "FAIL" "npm install が必要"
    fi
else
    check_result "package.json" "FAIL" "見つからない"
fi

echo ""

# 6. サービス起動テスト
echo "🚀 サービス起動テスト..."

# Cipher起動テスト
if [[ -f "cipher-server.js" ]]; then
    timeout 5 node cipher-server.js > /dev/null 2>&1 &
    CIPHER_PID=$!
    sleep 2
    
    if curl -s "http://localhost:3001/" &> /dev/null; then
        check_result "Cipher起動テスト" "PASS" "ポート3001で応答"
        kill $CIPHER_PID 2>/dev/null
    else
        check_result "Cipher起動テスト" "WARN" "応答なし（設定確認が必要）"
        kill $CIPHER_PID 2>/dev/null
    fi
else
    check_result "Cipher起動テスト" "FAIL" "cipher-server.js が見つからない"
fi

# Tsumiki CLIテスト
if [[ -f "tsumiki-cli.js" ]]; then
    if timeout 5 node tsumiki-cli.js --help &> /dev/null; then
        check_result "Tsumiki CLIテスト" "PASS" "正常実行"
    else
        check_result "Tsumiki CLIテスト" "WARN" "実行エラー（依存関係確認が必要）"
    fi
else
    check_result "Tsumiki CLIテスト" "FAIL" "tsumiki-cli.js が見つからない"
fi

# Playwright MCPテスト
if command -v npx &> /dev/null; then
    if timeout 10 npx @playwright/mcp --version &> /dev/null; then
        check_result "Playwright MCPテスト" "PASS" "正常実行"
    else
        check_result "Playwright MCPテスト" "WARN" "実行エラー"
    fi
else
    check_result "Playwright MCPテスト" "FAIL" "npx が利用できない"
fi

echo ""

# 7. ポート使用状況確認
echo "🔌 ポート使用状況確認..."

PORTS=(3001 8001 8788 8789)
for port in "${PORTS[@]}"; do
    if lsof -i :$port &> /dev/null; then
        PORT_USER=$(lsof -i :$port | tail -1 | awk '{print $1}')
        check_result "ポート$port" "WARN" "$PORT_USER が使用中"
    else
        check_result "ポート$port" "PASS" "利用可能"
    fi
done

echo ""

# 8. ファイル権限確認
echo "🔐 実行権限確認..."

EXECUTABLE_FILES=(
    "setup-mcp-environment.sh"
    "start-mcp-services.sh"
    "sync-to-macmini.sh"
)

for file in "${EXECUTABLE_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        if [[ -x "$file" ]]; then
            check_result "$file 実行権限" "PASS" "実行可能"
        else
            check_result "$file 実行権限" "WARN" "実行権限なし (chmod +x $file)"
        fi
    else
        check_result "$file 実行権限" "WARN" "ファイル未作成"
    fi
done

echo ""

# 結果サマリー
echo "📊 検証結果サマリー"
echo "=" $(printf '%.0s' {1..50})

TOTAL_SCORE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))

echo "✅ 成功: $PASSED_CHECKS"
echo "❌ 失敗: $FAILED_CHECKS" 
echo "⚠️  警告: $WARNINGS"
echo "📊 総合スコア: $TOTAL_SCORE% ($PASSED_CHECKS/$TOTAL_CHECKS)"

echo ""

# 推奨アクション
if [[ $FAILED_CHECKS -gt 0 ]]; then
    echo "🔧 推奨アクション:"
    echo "   1. 失敗項目を確認して必要なソフトウェアをインストール"
    echo "   2. ./setup-mcp-environment.sh を再実行"
    echo "   3. Claude Desktop を再起動"
elif [[ $WARNINGS -gt 0 ]]; then
    echo "✨ 基本機能は動作可能です"
    echo "   警告項目を確認してより良い環境にできます"
else
    echo "🎉 完璧な設定です！"
    echo "   すべてのMCPサービスが利用可能です"
fi

echo ""

# 次のステップ
echo "🚀 次のステップ:"
if [[ $TOTAL_SCORE -ge 80 ]]; then
    echo "   1. Claude Desktop でMCPサーバー接続を確認"
    echo "   2. ./start-mcp-services.sh でサービス起動"
    echo "   3. 実際のMCPコマンドをテスト"
else
    echo "   1. 失敗項目の修正"
    echo "   2. 必要な依存関係のインストール"
    echo "   3. 設定ファイルの確認・修正"
fi

if [[ "$DEVICE_TYPE" == "MacBook Air" ]]; then
    echo "   4. Mac mini への同期: ./sync-to-macmini.sh"
fi

echo ""
echo "📋 詳細情報:"
echo "   設定ファイル: $CLAUDE_CONFIG_PATHS"
echo "   プロジェクト: $SCRIPT_DIR"
echo "   デバイス: $DEVICE_TYPE"

# 終了コード
if [[ $FAILED_CHECKS -gt 0 ]]; then
    exit 1
else
    exit 0
fi