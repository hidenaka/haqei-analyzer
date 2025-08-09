#!/bin/bash

# HaQei Analyzer 開発サーバー停止スクリプト

echo "🛑 HaQei Analyzer 開発サーバーを停止中..."

# PIDファイルから停止
if [ -f .server.pid ]; then
    SERVER_PID=$(cat .server.pid)
    if kill -0 $SERVER_PID 2>/dev/null; then
        kill $SERVER_PID
        echo "✅ サーバー (PID: $SERVER_PID) を停止しました"
    else
        echo "⚠️  PIDファイルのサーバーは既に停止しています"
    fi
    rm .server.pid
fi

# 念のためポート8788のプロセスを全て停止
pkill -f "http.server 8788" 2>/dev/null && echo "🔄 ポート8788の全プロセスを停止しました"

echo "🏁 開発サーバー停止完了"