#!/bin/bash

# HAQEI Analyzer MCP環境セットアップスクリプト
# MacBook Air / Mac mini 両対応版

echo "🚀 HAQEI Analyzer MCP環境セットアップ開始..."

# 基本情報
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="haqei-analyzer"
HOSTNAME=$(hostname)

echo "📍 実行場所: $SCRIPT_DIR"
echo "🖥️  ホスト名: $HOSTNAME"

# OSとアーキテクチャ検出
if [[ "$HOSTNAME" == *"macbook"* ]] || [[ "$HOSTNAME" == *"MacBook"* ]]; then
    DEVICE_TYPE="macbook"
    echo "💻 デバイス: MacBook Air 検出"
elif [[ "$HOSTNAME" == *"mac-mini"* ]] || [[ "$HOSTNAME" == *"Mac-mini"* ]] || [[ "$HOSTNAME" == *"macmini"* ]]; then
    DEVICE_TYPE="macmini"  
    echo "🖥️  デバイス: Mac mini 検出"
else
    DEVICE_TYPE="unknown"
    echo "❓ デバイス: 不明 ($HOSTNAME)"
fi

# Claude Desktop設定ディレクトリ検索
echo "🔍 Claude Desktop設定ディレクトリを検索中..."

# 複数の可能性をチェック
CLAUDE_CONFIG_PATHS=(
    "$HOME/Library/Application Support/Claude"
    "$HOME/.config/claude-desktop"
    "$HOME/.claude-desktop"
    "$HOME/Library/Preferences/Claude"
)

CLAUDE_CONFIG_DIR=""
for path in "${CLAUDE_CONFIG_PATHS[@]}"; do
    if [[ -d "$path" ]]; then
        CLAUDE_CONFIG_DIR="$path"
        echo "✅ Claude設定ディレクトリ発見: $path"
        break
    fi
done

# Claude Desktop設定ディレクトリが見つからない場合は作成
if [[ -z "$CLAUDE_CONFIG_DIR" ]]; then
    CLAUDE_CONFIG_DIR="$HOME/Library/Application Support/Claude"
    echo "📁 Claude設定ディレクトリを作成: $CLAUDE_CONFIG_DIR"
    mkdir -p "$CLAUDE_CONFIG_DIR"
fi

# MCPサーバー設定ファイルのパス
MCP_CONFIG_FILE="$CLAUDE_CONFIG_DIR/claude_desktop_config.json"

echo "📝 MCP設定ファイル: $MCP_CONFIG_FILE"

# 既存設定のバックアップ
if [[ -f "$MCP_CONFIG_FILE" ]]; then
    BACKUP_FILE="${MCP_CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
    echo "💾 既存設定をバックアップ: $BACKUP_FILE"
    cp "$MCP_CONFIG_FILE" "$BACKUP_FILE"
fi

# デバイス固有の設定
case "$DEVICE_TYPE" in
    "macbook")
        PROJECT_PATH="/Users/hideakimacbookair/Desktop/haqei-analyzer"
        NODE_PATH="/Users/hideakimacbookair/.nvm/versions/node/v22.17.0/bin/node"
        ;;
    "macmini")
        # Mac mini用のパス（想定）
        PROJECT_PATH="/Users/$(whoami)/Desktop/haqei-analyzer"
        NODE_PATH="$(which node)"
        ;;
    *)
        # 汎用設定
        PROJECT_PATH="$SCRIPT_DIR"
        NODE_PATH="$(which node)"
        ;;
esac

echo "🎯 プロジェクトパス: $PROJECT_PATH"
echo "🟢 Node.jsパス: $NODE_PATH"

# MCP設定ファイル生成
echo "⚙️  MCP設定ファイルを生成中..."

cat > "$MCP_CONFIG_FILE" << EOF
{
  "mcpServers": {
    "cipher": {
      "command": "$NODE_PATH",
      "args": ["cipher-server.js"],
      "cwd": "$PROJECT_PATH",
      "env": {
        "NODE_ENV": "development",
        "CIPHER_PORT": "3001",
        "CIPHER_PROJECT_PATH": "$PROJECT_PATH"
      },
      "timeout": 30000
    },
    "tsumiki": {
      "command": "$NODE_PATH", 
      "args": ["tsumiki-cli.js"],
      "cwd": "$PROJECT_PATH",
      "env": {
        "NODE_ENV": "development",
        "TSUMIKI_PROJECT_PATH": "$PROJECT_PATH"
      },
      "timeout": 60000
    },
    "serena": {
      "command": "python3",
      "args": ["-m", "serena_mcp"],
      "cwd": "$PROJECT_PATH",
      "env": {
        "PYTHONPATH": "$PROJECT_PATH",
        "SERENA_PROJECT_CONFIG": "$PROJECT_PATH/.serena/project.yml"
      },
      "timeout": 45000
    },
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp"],
      "cwd": "$PROJECT_PATH",
      "env": {
        "NODE_ENV": "development"
      },
      "timeout": 30000
    }
  }
}
EOF

echo "✅ MCP設定ファイル生成完了"

# 依存関係チェック
echo "🔍 依存関係チェック開始..."

# Node.js確認
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.js が見つかりません"
fi

# Python確認  
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "✅ Python: $PYTHON_VERSION"
else
    echo "❌ Python3 が見つかりません"
fi

# npx確認
if command -v npx &> /dev/null; then
    echo "✅ npx 利用可能"
else
    echo "❌ npx が見つかりません"
fi

# プロジェクトファイル確認
echo "📂 プロジェクトファイル確認..."

PROJECT_FILES=(
    "cipher-server.js"
    "tsumiki-cli.js"
    ".serena/project.yml"
    "package.json"
)

for file in "${PROJECT_FILES[@]}"; do
    if [[ -f "$PROJECT_PATH/$file" ]]; then
        echo "✅ $file"
    else
        echo "❌ $file (見つかりません)"
    fi
done

# Playwright MCP確認
echo "🎭 Playwright MCP確認..."
if [[ -d "$PROJECT_PATH/node_modules/@playwright/mcp" ]]; then
    echo "✅ Playwright MCP インストール済み"
else
    echo "📦 Playwright MCP をインストール中..."
    cd "$PROJECT_PATH"
    npm install @playwright/mcp --save-dev
fi

# 設定テスト
echo "🧪 設定テスト実行..."

# Cipher接続テスト
echo "Testing Cipher connection..."
if curl -s "http://localhost:3001/health" &> /dev/null; then
    echo "✅ Cipher サーバー接続成功"
else
    echo "⚠️  Cipher サーバー未起動（正常）"
fi

# Tsumiki CLI テスト
if [[ -f "$PROJECT_PATH/tsumiki-cli.js" ]]; then
    echo "✅ Tsumiki CLI 利用可能"
else
    echo "❌ Tsumiki CLI が見つかりません"
fi

# 環境変数設定ファイル生成
ENV_FILE="$PROJECT_PATH/.env.mcp"
echo "📝 環境変数ファイル生成: $ENV_FILE"

cat > "$ENV_FILE" << EOF
# HAQEI Analyzer MCP Environment Configuration
# Generated: $(date)
# Device: $DEVICE_TYPE ($HOSTNAME)

# Project Configuration
PROJECT_PATH=$PROJECT_PATH
NODE_PATH=$NODE_PATH

# Cipher Configuration
CIPHER_PORT=3001
CIPHER_PROJECT_PATH=$PROJECT_PATH

# Tsumiki Configuration  
TSUMIKI_PROJECT_PATH=$PROJECT_PATH

# Serena Configuration
SERENA_PROJECT_CONFIG=$PROJECT_PATH/.serena/project.yml

# Playwright Configuration
PLAYWRIGHT_BROWSERS_PATH=$PROJECT_PATH/node_modules/playwright-core/.local-browsers
EOF

# 起動スクリプト生成
STARTUP_SCRIPT="$PROJECT_PATH/start-mcp-services.sh"
echo "🚀 起動スクリプト生成: $STARTUP_SCRIPT"

cat > "$STARTUP_SCRIPT" << 'EOF'
#!/bin/bash

# HAQEI Analyzer MCP Services 起動スクリプト

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 環境変数読み込み
if [[ -f ".env.mcp" ]]; then
    source .env.mcp
    echo "✅ 環境変数読み込み完了"
fi

echo "🚀 HAQEI MCP Services 起動開始..."

# Cipher起動
echo "🧠 Cipher Memory Layer 起動中..."
npm run cipher:start &
CIPHER_PID=$!

# 起動確認
sleep 3
if curl -s "http://localhost:3001/health" &> /dev/null; then
    echo "✅ Cipher起動成功 (PID: $CIPHER_PID)"
else
    echo "⚠️  Cipher起動確認できず"
fi

echo "✨ MCP Services 起動完了"
echo "📋 利用可能なコマンド:"
echo "   Cipher停止: npm run cipher:stop"
echo "   Tsumiki: node tsumiki-cli.js [command]"
echo "   Serena: python3 -m serena_mcp"
echo "   Playwright: npx @playwright/mcp"

EOF

chmod +x "$STARTUP_SCRIPT"

# Mac mini用同期スクリプト生成
SYNC_SCRIPT="$PROJECT_PATH/sync-to-macmini.sh"
echo "🔄 Mac mini同期スクリプト生成: $SYNC_SCRIPT"

cat > "$SYNC_SCRIPT" << 'EOF'
#!/bin/bash

# MacBook Air → Mac mini 環境同期スクリプト

echo "🔄 Mac mini環境同期開始..."

# 設定ファイルリスト
CONFIG_FILES=(
    "claude-mcp-config.json"
    ".env.mcp"
    "claude_desktop_config.json"
    "setup-mcp-environment.sh"
    "start-mcp-services.sh"
)

# Mac mini情報（実際の値に変更してください）
MAC_MINI_USER="hideaki"  # Mac miniのユーザー名
MAC_MINI_HOST="mac-mini.local"  # Mac miniのホスト名
MAC_MINI_PATH="/Users/$MAC_MINI_USER/Desktop/haqei-analyzer"

echo "🎯 転送先: $MAC_MINI_USER@$MAC_MINI_HOST:$MAC_MINI_PATH"

# ファイル転送
for file in "${CONFIG_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "📁 転送中: $file"
        scp "$file" "$MAC_MINI_USER@$MAC_MINI_HOST:$MAC_MINI_PATH/"
    fi
done

# Mac mini側でセットアップ実行
echo "🖥️  Mac mini側セットアップ実行..."
ssh "$MAC_MINI_USER@$MAC_MINI_HOST" "cd $MAC_MINI_PATH && ./setup-mcp-environment.sh"

echo "✅ Mac mini環境同期完了"

EOF

chmod +x "$SYNC_SCRIPT"

# 完了メッセージ
echo ""
echo "🎉 HAQEI Analyzer MCP環境セットアップ完了！"
echo ""
echo "📋 生成されたファイル:"
echo "   MCP設定: $MCP_CONFIG_FILE"
echo "   環境変数: $ENV_FILE"  
echo "   起動スクリプト: $STARTUP_SCRIPT"
echo "   同期スクリプト: $SYNC_SCRIPT"
echo ""
echo "🚀 次のステップ:"
echo "   1. Claude Desktopを再起動"
echo "   2. MCP Services起動: ./start-mcp-services.sh"
echo "   3. Mac mini同期: ./sync-to-macmini.sh"
echo ""
echo "💡 利用可能なMCPサーバー:"
echo "   🧠 Cipher: bunenjin哲学とプロジェクト記憶"
echo "   🏗️ Tsumiki: AI駆動開発フレームワーク"
echo "   🔧 Serena: セマンティックコード分析"
echo "   🎭 Playwright: ブラウザ自動化テスト"
echo ""
echo "✨ Happy Coding with HAQEI + MCP! ✨"