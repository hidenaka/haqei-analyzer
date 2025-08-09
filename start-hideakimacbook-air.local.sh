#!/bin/bash
# HAQEI Device-specific launcher for hideakimacbook-air.local

echo "🖥️ Starting HAQEI on hideakimacbook-air.local"
echo "============================"

# デバイス設定読み込み
if [ -f ".env.hideakimacbook-air.local" ]; then
    source ".env.hideakimacbook-air.local"
    echo "✅ Device config loaded"
else
    echo "⚠️ Device config not found, using defaults"
    export CIPHER_PORT=3001
fi

# 自動同期チェック
if [ "$SYNC_ENABLED" = "true" ]; then
    echo "🔄 Checking for updates..."
    ./scripts/cross-device-sync.sh pull 2>/dev/null || echo "Sync not available"
fi

# 環境起動
echo "⚡ Starting Cipher Server on port $CIPHER_PORT..."
CIPHER_PORT=$CIPHER_PORT node cipher-server.js &
CIPHER_PID=$!

echo "✅ HAQEI ready on hideakimacbook-air.local!"
echo "🎮 Start Claude Code: claude"
echo "🔄 Sync changes: ./scripts/cross-device-sync.sh push"
echo "🛑 Stop: kill $CIPHER_PID"

trap 'kill $CIPHER_PID 2>/dev/null' EXIT
wait
