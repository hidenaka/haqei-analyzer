#!/bin/bash

# HAQEI Multi-Mac Sync Development Environment
# マルチMac対応同期開発環境セットアップ

set -e

echo "🌐 HAQEI Multi-Mac Sync Development Setup"
echo "========================================"

# 設定ファイル
CONFIG_FILE="$HOME/.haqei-multi-mac-config"

# 初期設定
setup_multi_mac_config() {
    echo "📝 Multi-Mac Configuration Setup"
    
    # ユーザー情報取得
    read -p "Enter your GitHub username: " GITHUB_USER
    read -p "Enter main Mac identifier (e.g., MacBook-Pro): " MAIN_MAC
    read -p "Enter current Mac identifier (e.g., MacBook-Air): " CURRENT_MAC
    read -p "Enter iCloud Drive sync folder (optional): " ICLOUD_FOLDER
    
    # 設定保存
    cat > "$CONFIG_FILE" << EOF
# HAQEI Multi-Mac Configuration
GITHUB_USER="$GITHUB_USER"
MAIN_MAC="$MAIN_MAC"
CURRENT_MAC="$CURRENT_MAC"
ICLOUD_FOLDER="$ICLOUD_FOLDER"
SYNC_METHOD="git-branches"
CREATED_DATE="$(date)"
EOF
    
    echo "✅ Configuration saved to $CONFIG_FILE"
}

# Git-based並行開発セットアップ
setup_git_based_parallel() {
    local feature_name=$1
    local mac_id=$2
    
    echo "🔀 Setting up Git-based parallel development"
    
    # Mac固有ブランチ作成
    local branch_name="feature/${feature_name}-${mac_id}"
    
    git checkout -b "$branch_name" 2>/dev/null || git checkout "$branch_name"
    
    # Mac固有設定
    cat > ".env.${mac_id}" << EOF
# Mac-specific environment for $mac_id
CIPHER_PORT=3001
MAC_IDENTIFIER=$mac_id
FEATURE_NAME=$feature_name
BRANCH_NAME=$branch_name
SYNC_ENABLED=true
EOF
    
    # 同期スクリプト作成
    cat > "sync-${mac_id}.sh" << EOF
#!/bin/bash
echo "🔄 Syncing $feature_name development on $mac_id"

# 現在の変更をコミット
git add .
git commit -m "[$mac_id] Auto-sync: \$(date)" || echo "No changes to commit"

# リモートと同期
git push origin $branch_name
git fetch origin

# 他のMacの変更をマージ（必要に応じて）
echo "✅ Sync completed for $mac_id"
EOF
    
    chmod +x "sync-${mac_id}.sh"
    
    echo "✅ Git-based parallel setup completed"
    echo "   📂 Branch: $branch_name"
    echo "   🔄 Sync: ./sync-${mac_id}.sh"
}

# iCloud Drive安全同期（設定ファイルのみ）
setup_icloud_safe_sync() {
    local icloud_path=$1
    
    if [ -n "$icloud_path" ] && [ -d "$icloud_path" ]; then
        echo "☁️ Setting up iCloud Drive safe sync"
        
        # 設定ファイルのみ同期
        mkdir -p "$icloud_path/haqei-sync"
        
        # 同期対象（危険でないファイルのみ）
        cat > "$icloud_path/haqei-sync/sync-manifest.json" << EOF
{
  "sync_files": [
    "package.json",
    "scripts/*.sh",
    ".env.*",
    "docs/**/*.md",
    "public/css/*.css",
    "public/js/components/*.js"
  ],
  "exclude_patterns": [
    ".git/**",
    "node_modules/**",
    "logs/**",
    "data/**",
    "*.log"
  ],
  "last_sync": "$(date)",
  "sync_type": "safe-files-only"
}
EOF
        
        # 安全同期スクリプト
        cat > "icloud-safe-sync.sh" << 'EOF'
#!/bin/bash
ICLOUD_SYNC="$1/haqei-sync"

echo "☁️ Safe iCloud sync (files only, no git)"

# 設定ファイル同期
rsync -av --exclude='.git' --exclude='node_modules' \
  scripts/ "$ICLOUD_SYNC/scripts/" 2>/dev/null || true
  
rsync -av public/css/ "$ICLOUD_SYNC/css/" 2>/dev/null || true
rsync -av public/js/components/ "$ICLOUD_SYNC/components/" 2>/dev/null || true

echo "✅ Safe files synced to iCloud"
EOF
        chmod +x "icloud-safe-sync.sh"
        
        echo "✅ iCloud safe sync configured"
    else
        echo "⚠️ iCloud path not found, skipping iCloud sync"
    fi
}

# ポータブル開発環境作成
create_portable_environment() {
    local env_name=$1
    
    echo "📦 Creating portable development environment: $env_name"
    
    # ポータブル設定
    cat > "portable-${env_name}.sh" << EOF
#!/bin/bash
# Portable HAQEI Development Environment

# 自動Mac識別
MAC_ID=\$(hostname | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]//g')
CURRENT_USER=\$(whoami)

echo "🖥️ Detected Mac: \$MAC_ID"
echo "👤 User: \$CURRENT_USER"

# 動的環境設定
export CIPHER_PORT=\$(python3 -c "import random; print(random.randint(3001, 3010))")
export WORKTREE_NAME="${env_name}-\$MAC_ID"
export NODE_OPTIONS="--max-old-space-size=1024"

echo "⚡ Starting portable $env_name environment"
echo "🌐 Port: \$CIPHER_PORT"
echo "💻 Environment: \$WORKTREE_NAME"

# Cipher起動
CIPHER_PORT=\$CIPHER_PORT node cipher-server.js &
CIPHER_PID=\$!

echo "✅ Portable environment ready!"
echo "🎮 Start Claude: claude"

trap 'kill \$CIPHER_PID 2>/dev/null' EXIT
wait
EOF
    
    chmod +x "portable-${env_name}.sh"
    
    echo "✅ Portable environment created: ./portable-${env_name}.sh"
}

# メニュー表示
show_menu() {
    echo ""
    echo "Choose setup type:"
    echo "1) Initial Multi-Mac Configuration"
    echo "2) Git-based Parallel Development"  
    echo "3) iCloud Safe File Sync"
    echo "4) Create Portable Environment"
    echo "5) Show Current Configuration"
    echo "0) Exit"
    echo ""
}

# メイン処理
main() {
    while true; do
        show_menu
        read -p "Select option: " choice
        
        case $choice in
            1)
                setup_multi_mac_config
                ;;
            2)
                read -p "Enter feature name: " feature_name
                read -p "Enter Mac identifier: " mac_id
                setup_git_based_parallel "$feature_name" "$mac_id"
                ;;
            3)
                read -p "Enter iCloud Drive path: " icloud_path
                setup_icloud_safe_sync "$icloud_path"
                ;;
            4)
                read -p "Enter environment name: " env_name
                create_portable_environment "$env_name"
                ;;
            5)
                if [ -f "$CONFIG_FILE" ]; then
                    echo "📋 Current Configuration:"
                    cat "$CONFIG_FILE"
                else
                    echo "❌ No configuration found. Run option 1 first."
                fi
                ;;
            0)
                echo "🌐 Happy multi-Mac development!"
                exit 0
                ;;
            *)
                echo "❌ Invalid option"
                ;;
        esac
    done
}

main