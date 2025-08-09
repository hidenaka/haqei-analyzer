#!/bin/bash

# HAQEI Cross-Device Sync System
# MacBook Air ⇄ Mac mini 完全同期システム

set -e

echo "🔄 HAQEI Cross-Device Sync System"
echo "================================="

# デバイス識別
DEVICE_NAME=$(hostname | tr '[:upper:]' '[:lower:]')
USER_NAME=$(whoami)
PROJECT_ROOT=$(pwd)
ICLOUD_PATH="$HOME/Library/Mobile Documents/com~apple~CloudDocs"

echo "🖥️ Device: $DEVICE_NAME"
echo "👤 User: $USER_NAME"
echo "📂 Project: $PROJECT_ROOT"

# iCloud Drive確認
check_icloud_drive() {
    if [ -d "$ICLOUD_PATH" ]; then
        echo "☁️ iCloud Drive found: $ICLOUD_PATH"
        return 0
    else
        echo "❌ iCloud Drive not found"
        return 1
    fi
}

# 同期ディレクトリ作成
setup_sync_directory() {
    local sync_dir="$ICLOUD_PATH/HAQEI-Cross-Device-Sync"
    
    echo "📁 Setting up sync directory..."
    mkdir -p "$sync_dir/config"
    mkdir -p "$sync_dir/scripts"
    mkdir -p "$sync_dir/snapshots"
    
    # 同期マニフェスト作成
    cat > "$sync_dir/sync-manifest.json" << EOF
{
  "project_name": "HAQEI-Analyzer",
  "sync_version": "1.0",
  "last_sync": "$(date)",
  "devices": {
    "$DEVICE_NAME": {
      "last_active": "$(date)",
      "user": "$USER_NAME",
      "project_path": "$PROJECT_ROOT"
    }
  },
  "sync_strategy": "git-based-safe",
  "exclude_patterns": [
    ".git/worktrees/**",
    "node_modules/**",
    "logs/**",
    "data/cipher-memory/**",
    "*.log"
  ]
}
EOF
    
    echo "✅ Sync directory created: $sync_dir"
    echo "$sync_dir"
}

# 安全な同期実行
perform_safe_sync() {
    local sync_dir=$1
    local operation=$2  # push or pull
    
    echo "🔄 Performing safe sync: $operation"
    
    case $operation in
        "push")
            # 現在の状態をiCloud Driveに保存
            echo "📤 Pushing current state to iCloud Drive..."
            
            # 重要ファイルのみ同期
            rsync -av --exclude='.git' --exclude='node_modules' --exclude='logs' \
                  --exclude='data/cipher-memory' \
                  scripts/ "$sync_dir/scripts/" 2>/dev/null || true
                  
            rsync -av public/css/ "$sync_dir/css/" 2>/dev/null || true
            rsync -av public/js/ "$sync_dir/js/" 2>/dev/null || true
            
            # package.jsonなど設定ファイル
            cp package.json "$sync_dir/package.json" 2>/dev/null || true
            cp cipher-server.js "$sync_dir/cipher-server.js" 2>/dev/null || true
            
            # Git情報（ブランチ名のみ）
            git branch --show-current > "$sync_dir/current-branch.txt" 2>/dev/null || echo "main" > "$sync_dir/current-branch.txt"
            git status --porcelain > "$sync_dir/git-status.txt" 2>/dev/null || true
            
            echo "✅ Push completed"
            ;;
            
        "pull")
            # iCloud Driveから最新状態を取得
            echo "📥 Pulling latest state from iCloud Drive..."
            
            if [ -d "$sync_dir/scripts" ]; then
                rsync -av "$sync_dir/scripts/" scripts/ 2>/dev/null || true
            fi
            
            if [ -d "$sync_dir/css" ]; then
                rsync -av "$sync_dir/css/" public/css/ 2>/dev/null || true
            fi
            
            if [ -d "$sync_dir/js" ]; then
                rsync -av "$sync_dir/js/" public/js/ 2>/dev/null || true
            fi
            
            # 設定ファイル復元
            if [ -f "$sync_dir/package.json" ]; then
                cp "$sync_dir/package.json" package.json
            fi
            
            if [ -f "$sync_dir/cipher-server.js" ]; then
                cp "$sync_dir/cipher-server.js" cipher-server.js
            fi
            
            echo "✅ Pull completed"
            ;;
    esac
}

# デバイス固有設定生成
generate_device_config() {
    local device=$1
    
    cat > ".env.$device" << EOF
# Device-specific configuration for $device
DEVICE_NAME=$device
USER_NAME=$USER_NAME
PROJECT_ROOT=$PROJECT_ROOT

# Port configuration (avoid conflicts)
CIPHER_PORT_BASE=3001
CIPHER_PORT_OS_ANALYZER=3002
CIPHER_PORT_FUTURE_SIMULATOR=3003

# Device-specific optimizations
NODE_OPTIONS="--max-old-space-size=1024 --gc-interval=100"
UV_THREADPOOL_SIZE=4

# Sync settings
SYNC_ENABLED=true
LAST_SYNC="$(date)"
EOF

    echo "✅ Device config generated: .env.$device"
}

# デバイス別起動スクリプト作成
create_device_launcher() {
    local device=$1
    
    cat > "start-$device.sh" << EOF
#!/bin/bash
# HAQEI Device-specific launcher for $device

echo "🖥️ Starting HAQEI on $device"
echo "============================"

# デバイス設定読み込み
if [ -f ".env.$device" ]; then
    source ".env.$device"
    echo "✅ Device config loaded"
else
    echo "⚠️ Device config not found, using defaults"
    export CIPHER_PORT=3001
fi

# 自動同期チェック
if [ "\$SYNC_ENABLED" = "true" ]; then
    echo "🔄 Checking for updates..."
    ./scripts/cross-device-sync.sh pull 2>/dev/null || echo "Sync not available"
fi

# 環境起動
echo "⚡ Starting Cipher Server on port \$CIPHER_PORT..."
CIPHER_PORT=\$CIPHER_PORT node cipher-server.js &
CIPHER_PID=\$!

echo "✅ HAQEI ready on $device!"
echo "🎮 Start Claude Code: claude"
echo "🔄 Sync changes: ./scripts/cross-device-sync.sh push"
echo "🛑 Stop: kill \$CIPHER_PID"

trap 'kill \$CIPHER_PID 2>/dev/null' EXIT
wait
EOF

    chmod +x "start-$device.sh"
    echo "✅ Device launcher created: start-$device.sh"
}

# メイン処理
main() {
    local command=${1:-"menu"}
    
    case $command in
        "setup")
            echo "🔧 Setting up cross-device sync..."
            if check_icloud_drive; then
                local sync_dir=$(setup_sync_directory)
                generate_device_config "$DEVICE_NAME"
                create_device_launcher "$DEVICE_NAME"
                echo "✅ Cross-device sync setup completed!"
                echo "📋 Next steps:"
                echo "   1. Copy this project to your other Mac"
                echo "   2. Run: ./scripts/cross-device-sync.sh setup"
                echo "   3. Use: ./start-$DEVICE_NAME.sh to launch"
            fi
            ;;
            
        "push")
            if check_icloud_drive; then
                local sync_dir="$ICLOUD_PATH/HAQEI-Cross-Device-Sync"
                perform_safe_sync "$sync_dir" "push"
            fi
            ;;
            
        "pull")
            if check_icloud_drive; then
                local sync_dir="$ICLOUD_PATH/HAQEI-Cross-Device-Sync"
                perform_safe_sync "$sync_dir" "pull"
            fi
            ;;
            
        "menu"|*)
            echo "📋 Available commands:"
            echo "   setup - Initial cross-device setup"
            echo "   push  - Upload current state to iCloud Drive"
            echo "   pull  - Download latest state from iCloud Drive"
            echo ""
            echo "Usage: $0 [setup|push|pull]"
            ;;
    esac
}

main "$@"