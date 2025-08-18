#!/bin/bash

# HaQei Analyzer 開発サーバー起動スクリプト
# ポート8788で確実に起動

echo "🚀 HaQei Analyzer 開発サーバー起動中..."

# 既存のサーバーを停止
echo "🔄 既存サーバーを停止中..."
pkill -f "http.server 8788" 2>/dev/null || true

# 少し待機
sleep 1

# 開発サーバーを起動
echo "📡 ポート8788でサーバーを起動中..."
cd "$(dirname "$0")"
python3 -m http.server 8788 --directory public &

# サーバーPIDを保存
SERVER_PID=$!
echo $SERVER_PID > .server.pid

# サーバーが起動するまで待機
echo "⏳ サーバー起動を確認中..."
sleep 3

# 動作確認
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8788/os_analyzer.html | grep -q "200"; then
    echo "✅ サーバーが正常に起動しました"
    echo "🌐 URL: http://localhost:8788/os_analyzer.html"
    echo "🔧 開発環境準備完了"
    echo ""
    echo "停止するには: ./stop-dev-server.sh または Ctrl+C"
else
    echo "❌ サーバーの起動に失敗しました"
    exit 1
fi

# フォアグラウンドで実行を継続
wait $SERVER_PID