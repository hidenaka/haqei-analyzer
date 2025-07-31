#!/bin/bash

# HAQEI Analyzer Git Worktree Setup Script
# HAQEIプロジェクト専用worktree管理スクリプト

set -e

echo "🌳 HAQEI Git Worktree Setup"
echo "=========================="

# 関数定義
create_worktree() {
    local name=$1
    local branch=$2
    local port=$3
    
    echo "📁 Creating worktree: $name (branch: $branch, port: $port)"
    
    # worktree作成
    git worktree add "../$name" -b "$branch" 2>/dev/null || git worktree add "../$name" "$branch"
    
    # 環境設定ファイル作成
    cat > "../$name/.env.worktree" << EOF
# Worktree専用環境設定
CIPHER_PORT=$port
CIPHER_HOST=localhost
WORKTREE_NAME=$name
NODE_ENV=development
EOF
    
    # 起動スクリプト作成
    cat > "../$name/start-worktree.sh" << 'EOF'
#!/bin/bash
source .env.worktree
echo "🚀 Starting $WORKTREE_NAME on port $CIPHER_PORT"
CIPHER_PORT=$CIPHER_PORT node cipher-server.js &
echo "Claude Code ready for $WORKTREE_NAME development!"
EOF
    
    chmod +x "../$name/start-worktree.sh"
    
    echo "✅ Worktree $name created successfully!"
    echo "   📂 Location: ../$name"
    echo "   🌐 Cipher Port: $port"
    echo "   🚀 Start with: cd ../$name && ./start-worktree.sh"
    echo ""
}

# worktree一覧表示
list_worktrees() {
    echo "📋 Current Worktrees:"
    git worktree list
    echo ""
}

# メインメニュー
show_menu() {
    echo "Choose an option:"
    echo "1) Create Feature Development Worktree (port 3002)"
    echo "2) Create Hotfix Worktree (port 3003)"
    echo "3) Create Experiment Worktree (port 3004)"
    echo "4) Create Custom Worktree"
    echo "5) List Current Worktrees"
    echo "6) Cleanup Worktree"
    echo "0) Exit"
    echo ""
}

# メイン処理
main() {
    list_worktrees
    
    while true; do
        show_menu
        read -p "Select option: " choice
        
        case $choice in
            1)
                read -p "Enter feature name: " feature_name
                create_worktree "haqei-feature-$feature_name" "feature/$feature_name" 3002
                ;;
            2)
                read -p "Enter hotfix name: " hotfix_name
                create_worktree "haqei-hotfix-$hotfix_name" "hotfix/$hotfix_name" 3003
                ;;
            3)
                read -p "Enter experiment name: " exp_name
                create_worktree "haqei-experiment-$exp_name" "experiment/$exp_name" 3004
                ;;
            4)
                read -p "Enter worktree name: " wt_name
                read -p "Enter branch name: " br_name
                read -p "Enter port number: " pt_num
                create_worktree "$wt_name" "$br_name" "$pt_num"
                ;;
            5)
                list_worktrees
                ;;
            6)
                read -p "Enter worktree path to remove: " remove_path
                git worktree remove "$remove_path"
                echo "✅ Worktree removed"
                ;;
            0)
                echo "👋 Good luck with parallel development!"
                exit 0
                ;;
            *)
                echo "❌ Invalid option"
                ;;
        esac
    done
}

# 実行
main