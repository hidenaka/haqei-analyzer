#!/bin/bash

# Mac mini用 HAQEI Analyzer クイックスタートスクリプト
# iCloud Drive からの設定同期とMCP環境構築

echo "🖥️  Mac mini用 HAQEI Analyzer クイックスタート"
echo "======================================================"

# Mac mini検出
HOSTNAME=$(hostname)
if [[ "$HOSTNAME" != *"mac-mini"* ]] && [[ "$HOSTNAME" != *"Mac-mini"* ]] && [[ "$HOSTNAME" != *"macmini"* ]]; then
    echo "⚠️  このスクリプトはMac mini用に最適化されています"
    echo "   現在のホスト: $HOSTNAME"
    echo "   続行しますか？ (y/N)"
    read -r CONFIRM
    if [[ "$CONFIRM" != "y" ]] && [[ "$CONFIRM" != "Y" ]]; then
        echo "❌ セットアップを中止しました"
        exit 1
    fi
fi

echo "🚀 Mac mini HAQEI環境構築開始..."

# 基本情報
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ICLOUD_PATH="$HOME/Library/Mobile Documents/com~apple~CloudDocs"
HAQEI_ICLOUD_DIR="$ICLOUD_PATH/HAQEI-Analyzer-Config"

# Step 1: 前提条件チェック
echo ""
echo "📋 Step 1: 前提条件チェック"
echo "----------------------------"

# iCloud Drive確認
if [[ ! -d "$ICLOUD_PATH" ]]; then
    echo "❌ iCloud Drive が利用できません"
    echo ""
    echo "🔧 解決方法:"
    echo "   1. システム設定 > Apple ID > iCloud を開く"
    echo "   2. iCloud Drive を有効にする"
    echo "   3. 同期完了まで待機"
    echo ""
    exit 1
else
    echo "✅ iCloud Drive 利用可能"
fi

# HAQEI設定確認
if [[ ! -d "$HAQEI_ICLOUD_DIR" ]]; then
    echo "❌ HAQEI設定がiCloud Driveに見つかりません"
    echo ""
    echo "🔧 解決方法:"
    echo "   MacBook Airで以下を実行してください:"
    echo "   ./setup-icloud-sync.sh"
    echo ""
    exit 1
else
    echo "✅ HAQEI設定発見: $HAQEI_ICLOUD_DIR"
fi

# Node.js確認
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.js が見つかりません"
    echo ""
    echo "🔧 Node.js インストール方法:"
    echo "   1. https://nodejs.org/ からダウンロード"
    echo "   2. またはHomebrewを使用: brew install node"
    echo ""
    exit 1
fi

# Python確認
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "✅ Python: $PYTHON_VERSION"
else
    echo "❌ Python3 が見つかりません"
    echo ""
    echo "🔧 Python3 インストール方法:"
    echo "   1. Xcodeコマンドラインツール: xcode-select --install"
    echo "   2. またはHomebrewを使用: brew install python"
    echo ""
    exit 1
fi

# Step 2: プロジェクト設定
echo ""
echo "📁 Step 2: プロジェクト設定"
echo "---------------------------"

# プロジェクトディレクトリ確認/作成
PROJECT_DIR="$HOME/Desktop/haqei-analyzer"
if [[ ! -d "$PROJECT_DIR" ]]; then
    echo "📁 プロジェクトディレクトリを作成: $PROJECT_DIR"
    mkdir -p "$PROJECT_DIR"
    cd "$PROJECT_DIR"
else
    echo "✅ プロジェクトディレクトリ存在: $PROJECT_DIR"
    cd "$PROJECT_DIR"
fi

# Step 3: iCloud Driveから設定同期
echo ""
echo "☁️  Step 3: iCloud Drive設定同期"
echo "----------------------------------"

echo "📥 共有設定ファイルをダウンロード中..."

# 共有設定ファイルをコピー
if [[ -d "$HAQEI_ICLOUD_DIR/shared" ]]; then
    find "$HAQEI_ICLOUD_DIR/shared" -type f | while read -r file; do
        RELATIVE_PATH="${file#$HAQEI_ICLOUD_DIR/shared/}"
        TARGET_PATH="$PROJECT_DIR/$RELATIVE_PATH"
        
        # ディレクトリ作成
        mkdir -p "$(dirname "$TARGET_PATH")"
        
        # ファイルコピー
        cp "$file" "$TARGET_PATH"
        echo "✅ $RELATIVE_PATH"
    done
else
    echo "❌ 共有設定フォルダが見つかりません"
    exit 1
fi

# Mac mini用デバイス設定を復元
echo "📱 Mac mini専用設定を復元中..."
MAC_MINI_DIR="$HAQEI_ICLOUD_DIR/device-specific/mac-mini"

if [[ -d "$MAC_MINI_DIR" ]]; then
    # 既存のMac mini設定を復元
    cp -r "$MAC_MINI_DIR/"* "$PROJECT_DIR/"
    echo "✅ Mac mini専用設定を復元"
else
    # MacBook Air設定をテンプレートとして使用
    MACBOOK_DIR="$HAQEI_ICLOUD_DIR/device-specific/macbook-air"
    if [[ -d "$MACBOOK_DIR" ]]; then
        echo "📋 MacBook Air設定をテンプレートとして使用"
        
        # 必要な設定ファイルのみコピー
        if [[ -f "$MACBOOK_DIR/claude_desktop_config.json" ]]; then
            cp "$MACBOOK_DIR/claude_desktop_config.json" "$PROJECT_DIR/claude_desktop_config.json.template"
            echo "✅ Claude設定テンプレートを取得"
        fi
    fi
fi

# Step 4: 依存関係インストール
echo ""
echo "📦 Step 4: 依存関係インストール"
echo "-------------------------------"

if [[ -f "package.json" ]]; then
    echo "📦 Node.js依存関係をインストール中..."
    npm install
    echo "✅ npm install 完了"
else
    echo "❌ package.json が見つかりません"
fi

# Step 5: MCP環境構築
echo ""
echo "⚙️  Step 5: MCP環境構築"
echo "----------------------"

# Mac mini用に環境セットアップスクリプトを調整
if [[ -f "setup-mcp-environment.sh" ]]; then
    echo "🔧 MCP環境をセットアップ中..."
    chmod +x setup-mcp-environment.sh
    ./setup-mcp-environment.sh
else
    echo "⚠️  setup-mcp-environment.sh が見つかりません"
    echo "   基本的なMCP設定を手動で作成します..."
    
    # 最小限のMCP設定を作成
    CLAUDE_CONFIG_DIR="$HOME/Library/Application Support/Claude"
    mkdir -p "$CLAUDE_CONFIG_DIR"
    
    cat > "$CLAUDE_CONFIG_DIR/claude_desktop_config.json" << EOF
{
  "mcpServers": {
    "cipher": {
      "command": "$(which node)",
      "args": ["cipher-server.js"],
      "cwd": "$PROJECT_DIR",
      "env": {
        "NODE_ENV": "development",
        "CIPHER_PORT": "3001"
      },
      "timeout": 30000
    },
    "tsumiki": {
      "command": "$(which node)",
      "args": ["tsumiki-cli.js"],
      "cwd": "$PROJECT_DIR",
      "env": {
        "NODE_ENV": "development"
      },
      "timeout": 60000
    },
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp"],
      "cwd": "$PROJECT_DIR",
      "env": {
        "NODE_ENV": "development"
      },
      "timeout": 30000
    }
  }
}
EOF
    echo "✅ 基本MCP設定を作成"
fi

# Step 6: 動作確認
echo ""
echo "🧪 Step 6: 動作確認"
echo "------------------"

# 重要ファイルの存在確認
REQUIRED_FILES=(
    "cipher-server.js"
    "tsumiki-cli.js"
    "package.json"
    "CLAUDE.md"
)

echo "📂 必要ファイル確認..."
for file in "${REQUIRED_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "✅ $file"
    else
        echo "❌ $file (見つかりません)"
    fi
done

# サービス起動スクリプト確認
if [[ -f "start-mcp-services.sh" ]]; then
    chmod +x start-mcp-services.sh
    echo "✅ サービス起動スクリプト準備完了"
fi

# 検証スクリプト確認
if [[ -f "verify-mcp-setup.sh" ]]; then
    chmod +x verify-mcp-setup.sh
    echo "✅ 検証スクリプト準備完了"
fi

# Step 7: 完了とNext Steps
echo ""
echo "🎉 Mac mini セットアップ完了！"
echo "================================"
echo ""
echo "📋 セットアップ結果:"
echo "   🖥️  デバイス: Mac mini ($HOSTNAME)"
echo "   📁 プロジェクト: $PROJECT_DIR"
echo "   ☁️  iCloud同期: 有効"
echo "   ⚙️  MCP設定: 完了"
echo ""
echo "🚀 次のステップ:"
echo "   1. Claude Desktop を再起動"
echo "      • Claude Desktop を完全終了"
echo "      • Claude Desktop を再起動"
echo "      • 右下にMCP接続状況を確認"
echo ""
echo "   2. MCP Services起動テスト"
echo "      cd $PROJECT_DIR"
echo "      ./start-mcp-services.sh"
echo ""
echo "   3. 環境検証"
echo "      ./verify-mcp-setup.sh"
echo ""
echo "💡 利用可能なMCPサーバー:"
echo "   🧠 Cipher: bunenjin哲学とプロジェクト記憶"
echo "   🏗️ Tsumiki: AI駆動開発フレームワーク"
echo "   🎭 Playwright: ブラウザ自動化テスト"
echo ""
echo "🔄 継続的同期:"
echo "   ./sync-from-icloud.sh  # 設定を最新に同期"
echo "   ./setup-auto-sync.sh   # 自動同期を有効化"
echo ""
echo "❓ トラブルシューティング:"
echo "   • MCP接続エラー → Claude Desktop再起動"
echo "   • サービス起動エラー → ポート競合確認 (lsof -i :3001)"
echo "   • 設定同期エラー → iCloud Drive同期状況確認"
echo ""
echo "✨ Happy Coding with HAQEI on Mac mini! ✨"

# 成功時は作業ディレクトリをプロジェクトフォルダに設定
cd "$PROJECT_DIR"
echo ""
echo "📍 現在の作業ディレクトリ: $(pwd)"