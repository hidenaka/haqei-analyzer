#!/bin/bash

# MCP全サーバー停止スクリプト
echo "🛑 すべてのMCPサーバーを停止しています..."

# プロジェクトディレクトリ
PROJECT_DIR="/Users/hideakimacbookair/Desktop/haqei-analyzer"
PID_DIR="$PROJECT_DIR/.mcp-pids"

# PIDファイルからプロセスを停止
if [ -d "$PID_DIR" ]; then
    for pid_file in "$PID_DIR"/*.pid; do
        if [ -f "$pid_file" ]; then
            PID=$(cat "$pid_file")
            SERVER_NAME=$(basename "$pid_file" .pid)
            
            if ps -p "$PID" > /dev/null 2>&1; then
                echo "  ⏹ $SERVER_NAME (PID: $PID) を停止しています..."
                kill "$PID" 2>/dev/null
                
                # 停止を確認（最大5秒待機）
                for i in {1..5}; do
                    if ! ps -p "$PID" > /dev/null 2>&1; then
                        echo "    ✅ $SERVER_NAME が停止しました"
                        break
                    fi
                    sleep 1
                done
                
                # 強制終了が必要な場合
                if ps -p "$PID" > /dev/null 2>&1; then
                    echo "    ⚠️ $SERVER_NAME を強制終了します..."
                    kill -9 "$PID" 2>/dev/null
                fi
            else
                echo "  ℹ️ $SERVER_NAME は既に停止しています"
            fi
            
            rm "$pid_file"
        fi
    done
fi

# 念のため残っているプロセスも終了
echo ""
echo "🧹 残存プロセスをクリーンアップしています..."

pkill -f "cipher-server.js" 2>/dev/null
pkill -f "tsumiki-cli.js" 2>/dev/null
pkill -f "serena.*start-mcp-server" 2>/dev/null
pkill -f "@playwright/mcp" 2>/dev/null
pkill -f "claude-flow.*mcp.*start" 2>/dev/null
pkill -f "ruv-swarm.*mcp.*start" 2>/dev/null

echo ""
echo "✅ すべてのMCPサーバーが停止しました"