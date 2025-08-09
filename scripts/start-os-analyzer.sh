#!/bin/bash
# OS Analyzer 専用起動スクリプト
# 独立ポートでOS Analyzerを起動

set -e

# 設定
DEFAULT_PORT=8001
FALLBACK_PORTS=(8002 8003 8004 8005)
APP_NAME="OS Analyzer"

echo "🔍 $APP_NAME 起動準備中..."

# ポート利用可能性確認関数
check_port() {
  local port=$1
  if command -v lsof >/dev/null 2>&1; then
    ! lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1
  else
    ! netstat -ln 2>/dev/null | grep -q ":$port "
  fi
}

# 利用可能ポート検索
find_available_port() {
  if check_port $DEFAULT_PORT; then
    echo $DEFAULT_PORT
    return
  fi
  
  echo "⚠️  デフォルトポート $DEFAULT_PORT は使用中" >&2
  
  for port in "${FALLBACK_PORTS[@]}"; do
    if check_port $port; then
      echo "🔄 フォールバックポート $port を使用" >&2
      echo $port
      return
    fi
  done
  
  echo "❌ 利用可能なポートが見つかりません" >&2
  exit 1
}

# ポート決定
SELECTED_PORT=$(find_available_port)

# 環境変数設定
export OS_ANALYZER_PORT=$SELECTED_PORT
export APP_MODE="os-analyzer"
export NODE_OPTIONS="--max-old-space-size=1024"

# Cipher起動（専用ポート）
CIPHER_PORT=$((SELECTED_PORT + 1000))
if check_port $CIPHER_PORT; then
  echo "🧠 Cipher Server 起動中 (ポート: $CIPHER_PORT)"
  CIPHER_PORT=$CIPHER_PORT node cipher-server.js &
  CIPHER_PID=$!
else
  echo "⚠️  Cipher Server ポート $CIPHER_PORT は使用中"
  CIPHER_PID=""
fi

# サーバー起動
echo "🚀 $APP_NAME 起動中..."
echo "🌐 URL: http://localhost:$SELECTED_PORT"
echo "🎯 専用機能: Triple OS Architecture Analysis"
echo ""
echo "📝 使用方法:"
echo "   - OS分析: http://localhost:$SELECTED_PORT/os-analyzer.html"
echo "   - トリプルOS: http://localhost:$SELECTED_PORT/triple-os.html"
echo "   - 停止: Ctrl+C"
echo ""

# クリーンアップ関数
cleanup() {
  echo ""
  echo "🛑 $APP_NAME 停止中..."
  if [ ! -z "$CIPHER_PID" ]; then
    kill $CIPHER_PID 2>/dev/null || true
    echo "   Cipher Server 停止"
  fi
  echo "✅ 正常終了"
}

# シグナルハンドリング
trap cleanup EXIT INT TERM

# HTTPサーバー起動
cd "$(dirname "$0")/.."
python3 -m http.server $SELECTED_PORT --directory public

wait