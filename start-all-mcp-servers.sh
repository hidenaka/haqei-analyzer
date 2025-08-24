#!/bin/bash

# MCP全サーバー起動スクリプト
echo "🚀 すべてのMCPサーバーを起動しています..."

# プロジェクトディレクトリ
PROJECT_DIR="/Users/hideakimacbookair/Desktop/haqei-analyzer"
cd "$PROJECT_DIR"

# PIDファイル保存ディレクトリ
PID_DIR="$PROJECT_DIR/.mcp-pids"
mkdir -p "$PID_DIR"

# ログディレクトリ
LOG_DIR="$PROJECT_DIR/.mcp-logs"
mkdir -p "$LOG_DIR"

# 古いプロセスのクリーンアップ
cleanup_old_processes() {
    echo "🧹 古いMCPプロセスをクリーンアップしています..."
    
    # PIDファイルからプロセスを終了
    if [ -d "$PID_DIR" ]; then
        for pid_file in "$PID_DIR"/*.pid; do
            if [ -f "$pid_file" ]; then
                PID=$(cat "$pid_file")
                if ps -p "$PID" > /dev/null 2>&1; then
                    echo "  ⏹ プロセス $PID を終了しています..."
                    kill "$PID" 2>/dev/null
                fi
                rm "$pid_file"
            fi
        done
    fi
    
    # 念のため残っているプロセスも終了
    pkill -f "cipher-server.js" 2>/dev/null
    pkill -f "tsumiki-cli.js" 2>/dev/null
    pkill -f "serena.*start-mcp-server" 2>/dev/null
    pkill -f "@playwright/mcp" 2>/dev/null
    pkill -f "claude-flow.*mcp.*start" 2>/dev/null
    pkill -f "ruv-swarm.*mcp.*start" 2>/dev/null
    
    sleep 2
}

# サーバー起動関数
start_server() {
    local name=$1
    local command=$2
    local log_file="$LOG_DIR/${name}.log"
    local pid_file="$PID_DIR/${name}.pid"
    
    echo "  📦 $name を起動しています..."
    
    # コマンドをバックグラウンドで実行
    eval "$command" > "$log_file" 2>&1 &
    local pid=$!
    
    # PIDを保存
    echo $pid > "$pid_file"
    
    # 起動確認（3秒待機）
    sleep 3
    
    if ps -p $pid > /dev/null 2>&1; then
        echo "    ✅ $name が起動しました (PID: $pid)"
        return 0
    else
        echo "    ❌ $name の起動に失敗しました"
        # エラーログの最後の数行を表示
        if [ -f "$log_file" ]; then
            echo "    📋 エラーログ:"
            tail -n 5 "$log_file" | sed 's/^/        /'
        fi
        return 1
    fi
}

# メイン処理
main() {
    # クリーンアップ
    cleanup_old_processes
    
    echo ""
    echo "📋 MCPサーバーを起動します:"
    echo ""
    
    # 1. Cipher Server（メモリ管理）
    start_server "cipher" "node cipher-server.js"
    
    # 2. Tsumiki CLI（AI駆動開発）
    if [ -f "tsumiki-cli.js" ]; then
        start_server "tsumiki" "node tsumiki-cli.js"
    else
        echo "  ⚠️  Tsumiki CLI (tsumiki-cli.js) が見つかりません - スキップ"
    fi
    
    # 3. Serena（セマンティック分析）
    # uvxコマンドの存在確認
    if command -v uvx &> /dev/null; then
        start_server "serena" "uvx --from git+https://github.com/oraios/serena serena start-mcp-server --context ide-assistant --project $PROJECT_DIR"
    else
        echo "  ⚠️  uvx コマンドが見つかりません - Serenaをスキップ"
    fi
    
    # 4. Playwright MCP（ブラウザ自動化）
    start_server "playwright" "npx @playwright/mcp"
    
    # 5. Claude Flow（AI orchestration）
    start_server "claude-flow" "npx claude-flow@alpha mcp start"
    
    # 6. Ruv Swarm（分散エージェント）
    start_server "ruv-swarm" "npx ruv-swarm@latest mcp start"
    
    echo ""
    echo "🎉 MCPサーバーの起動が完了しました！"
    echo ""
    echo "📊 起動状況:"
    echo "  実行中のMCPプロセス:"
    ps aux | grep -E "(cipher|tsumiki|serena|playwright|claude-flow|ruv-swarm)" | grep -v grep | wc -l | xargs echo "  合計:"
    echo ""
    echo "💡 ヒント:"
    echo "  • ログを確認: tail -f $LOG_DIR/<サーバー名>.log"
    echo "  • プロセス確認: ps aux | grep mcp"
    echo "  • 停止: ./stop-all-mcp-servers.sh"
    echo ""
}

# エラーハンドリング
set -e
trap 'echo "⚠️ エラーが発生しました"' ERR

# メイン処理実行
main