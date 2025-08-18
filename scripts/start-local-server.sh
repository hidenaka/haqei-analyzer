#!/bin/bash

# HAQEI Analyzer ローカルサーバー起動スクリプト
#
# 目的：
# - ローカル開発サーバーの簡単起動
# - ポート衝突時の自動代替ポート検索
# - ブラウザ自動起動オプション
#
# 使用方法：
# ./start-local-server.sh [PORT] [OPTIONS]
#
# オプション：
# --browser, -b : ブラウザを自動起動
# --port=XXXX   : カスタムポート指定
# --help, -h    : ヘルプ表示

set -e

# デフォルト設定
DEFAULT_PORT=3000
OPEN_BROWSER=false
PORT=$DEFAULT_PORT
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ヘルプ表示
show_help() {
    echo "🚀 HAQEI Analyzer ローカルサーバー起動スクリプト"
    echo ""
    echo "使用方法:"
    echo "  $0 [オプション]"
    echo ""
    echo "オプション:"
    echo "  --port=XXXX, -p XXXX  ポート番号指定 (デフォルト: 3000)"
    echo "  --browser, -b         ブラウザを自動起動"
    echo "  --help, -h            このヘルプを表示"
    echo ""
    echo "例:"
    echo "  $0                    # ポート3000で起動"
    echo "  $0 --port=8080        # ポート8080で起動"
    echo "  $0 -b                 # 起動後ブラウザを開く"
    echo "  $0 --port=4000 -b     # ポート4000で起動してブラウザを開く"
    echo ""
}

# 引数解析
while [[ $# -gt 0 ]]; do
    case $1 in
        --port=*)
            PORT="${1#*=}"
            shift
            ;;
        -p|--port)
            PORT="$2"
            shift 2
            ;;
        -b|--browser)
            OPEN_BROWSER=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        [0-9]*)
            PORT="$1"
            shift
            ;;
        *)
            echo "❌ 不明なオプション: $1"
            show_help
            exit 1
            ;;
    esac
done

# ポート番号検証
if ! [[ "$PORT" =~ ^[0-9]+$ ]] || [ "$PORT" -lt 1 ] || [ "$PORT" -gt 65535 ]; then
    echo "❌ 無効なポート番号: $PORT"
    echo "💡 1-65535の範囲で指定してください"
    exit 1
fi

# Node.js存在確認
if ! command -v node &> /dev/null; then
    echo "❌ Node.jsがインストールされていません"
    echo "💡 https://nodejs.org からNode.jsをインストールしてください"
    exit 1
fi

# ポート使用状況確認
check_port() {
    local port=$1
    if command -v lsof &> /dev/null; then
        lsof -ti:$port &> /dev/null
    elif command -v netstat &> /dev/null; then
        netstat -an | grep ":$port " &> /dev/null
    else
        false
    fi
}

# 代替ポート検索
find_available_port() {
    local start_port=$1
    for ((port=start_port; port<=start_port+50; port++)); do
        if ! check_port $port; then
            echo $port
            return 0
        fi
    done
    return 1
}

# ポート衝突チェック
if check_port $PORT; then
    echo "⚠️  ポート $PORT は既に使用されています"
    
    # 代替ポート検索
    echo "🔍 利用可能なポートを検索中..."
    ALTERNATIVE_PORT=$(find_available_port $((PORT + 1)))
    
    if [ $? -eq 0 ]; then
        echo "💡 代替ポート $ALTERNATIVE_PORT が利用可能です"
        read -p "ポート $ALTERNATIVE_PORT を使用しますか? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            PORT=$ALTERNATIVE_PORT
        else
            echo "❌ 起動をキャンセルしました"
            exit 1
        fi
    else
        echo "❌ 利用可能なポートが見つかりません"
        exit 1
    fi
fi

# プロジェクトディレクトリ確認
if [ ! -f "$SCRIPT_DIR/local-dev-server.js" ]; then
    echo "❌ local-dev-server.js が見つかりません"
    echo "💡 プロジェクトのルートディレクトリで実行してください"
    exit 1
fi

if [ ! -d "$SCRIPT_DIR/public" ]; then
    echo "❌ publicディレクトリが見つかりません"
    echo "💡 HAQEIファイルが正しく配置されているか確認してください"
    exit 1
fi

# サーバー起動情報表示
echo "🚀 HAQEI Analyzer ローカルサーバーを起動します..."
echo "📍 ポート: $PORT"
echo "📁 ディレクトリ: $SCRIPT_DIR/public"
echo ""

# ブラウザ自動起動の準備
if [ "$OPEN_BROWSER" = true ]; then
    # OS判定とブラウザ起動コマンド設定
    case "$(uname -s)" in
        Darwin*)  BROWSER_CMD="open" ;;
        Linux*)   BROWSER_CMD="xdg-open" ;;
        CYGWIN*|MINGW*) BROWSER_CMD="start" ;;
        *) 
            echo "⚠️  このOSでのブラウザ自動起動はサポートされていません"
            OPEN_BROWSER=false
            ;;
    esac
fi

# バックグラウンドでブラウザ起動（サーバー起動後）
if [ "$OPEN_BROWSER" = true ]; then
    (
        sleep 2  # サーバー起動待ち
        echo "🌐 ブラウザを起動中..."
        $BROWSER_CMD "http://localhost:$PORT" 2>/dev/null &
    ) &
fi

# Ctrl+C ハンドリング設定
trap 'echo -e "\n🛑 サーバーを停止しています..."; exit 0' SIGINT SIGTERM

# サーバー起動
echo "⏳ サーバー起動中..."
cd "$SCRIPT_DIR"

# Node.jsサーバー起動
node local-dev-server.js --port=$PORT

# 終了処理
echo "✅ サーバーが正常に終了しました"