#!/bin/bash

# HAQEI Lightweight Worktree Setup
# IDE処理落ち対策版 - リソース最適化

set -e

echo "⚡ HAQEI Lightweight Worktree Setup (Performance Optimized)"
echo "============================================================"

# システムリソース確認
check_system_resources() {
    echo "📊 System Resource Check:"
    echo "   Memory: $(vm_stat | head -4)"
    echo "   CPU Usage: $(ps -A -o %cpu | awk '{s+=$1} END {print s "%"}')"
    echo ""
}

# 軽量worktree作成
create_lightweight_worktree() {
    local name=$1
    local branch=$2
    local port=$3
    local focus=$4
    
    echo "🪶 Creating lightweight worktree: $name"
    
    # worktree作成
    git worktree add "../$name" -b "$branch" 2>/dev/null || git worktree add "../$name" "$branch"
    
    # 軽量環境設定
    cat > "../$name/.env.lightweight" << EOF
# Lightweight Development Environment
CIPHER_PORT=$port
CIPHER_HOST=localhost
WORKTREE_NAME=$name
NODE_ENV=development

# Performance Optimizations
NODE_OPTIONS="--max-old-space-size=1024 --gc-interval=100"
UV_THREADPOOL_SIZE=4
EOF

    # 最小限ファイル監視設定
    cat > "../$name/.vscode/settings.json" << EOF
{
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/.git/**": true,
    "**/logs/**": true,
    "**/data/**": true,
    "**/*.log": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/logs": true,
    "**/data": true
  },
  "extensions.autoUpdate": false,
  "extensions.autoCheckUpdates": false,
  "typescript.preferences.includePackageJsonAutoImports": "off",
  "javascript.preferences.includePackageJsonAutoImports": "off",
  "editor.semanticHighlighting.enabled": false,
  "editor.minimap.enabled": false,
  "breadcrumbs.enabled": false,
  "workbench.activityBar.visible": true,
  "workbench.statusBar.visible": true,
  "workbench.editor.enablePreview": false
}
EOF

    # 軽量起動スクリプト
    cat > "../$name/start-lightweight.sh" << EOF
#!/bin/bash
source .env.lightweight

echo "⚡ Starting Lightweight $WORKTREE_NAME Environment"
echo "Focus: $focus"
echo "Port: \$CIPHER_PORT | Memory Limit: 1GB"

# メモリ制限付きCipher起動
NODE_OPTIONS="\$NODE_OPTIONS" CIPHER_PORT=\$CIPHER_PORT node cipher-server.js &
CIPHER_PID=\$!

echo "✅ Lightweight environment ready!"
echo "🔋 Memory optimized | 🎯 Focus: $focus"
echo "💻 Start Claude: claude"
echo "🛑 Stop: kill \$CIPHER_PID"

trap 'kill \$CIPHER_PID 2>/dev/null' EXIT
wait
EOF
    
    chmod +x "../$name/start-lightweight.sh"
    mkdir -p "../$name/.vscode"
    
    echo "✅ Lightweight worktree created: $name"
    echo "   🎯 Focus: $focus"
    echo "   🌐 Port: $port"
    echo "   🚀 Start: cd ../$name && ./start-lightweight.sh"
    echo ""
}

# リソース監視ツール
create_resource_monitor() {
    cat > resource-monitor.sh << 'EOF'
#!/bin/bash
echo "🔍 HAQEI Resource Monitor"
echo "========================"

while true; do
    clear
    echo "⏰ $(date)"
    echo ""
    
    # CPU使用率
    echo "🔥 CPU Usage:"
    ps -A -o %cpu,comm | sort -nr | head -5
    echo ""
    
    # メモリ使用量
    echo "🧠 Memory Usage:"
    ps -A -o %mem,rss,comm | sort -nr | head -5
    echo ""
    
    # Cipher/Claude プロセス
    echo "⚡ HAQEI Processes:"
    ps aux | grep -E "(cipher|claude)" | grep -v grep
    echo ""
    
    echo "Press Ctrl+C to exit"
    sleep 5
done
EOF
    chmod +x resource-monitor.sh
}

# メニュー表示
show_menu() {
    check_system_resources
    echo "Choose lightweight worktree type:"
    echo "1) OS Analyzer (Minimal UI focus)"
    echo "2) Future Simulator (Logic focus)" 
    echo "3) API/Backend (Server focus)"
    echo "4) Testing (Test focus)"
    echo "5) Create Resource Monitor"
    echo "0) Exit"
    echo ""
}

# メイン処理
main() {
    create_resource_monitor
    
    while true; do
        show_menu
        read -p "Select option: " choice
        
        case \$choice in
            1)
                read -p "Enter feature name: " feature_name
                create_lightweight_worktree "haqei-os-lite-\$feature_name" "feature/os-\$feature_name" 3002 "OS Analysis UI"
                ;;
            2)
                read -p "Enter feature name: " feature_name
                create_lightweight_worktree "haqei-future-lite-\$feature_name" "feature/future-\$feature_name" 3003 "Future Simulation Logic"
                ;;
            3)
                read -p "Enter API name: " api_name
                create_lightweight_worktree "haqei-api-lite-\$api_name" "feature/api-\$api_name" 3004 "Backend/API Development"
                ;;
            4)
                read -p "Enter test suite name: " test_name
                create_lightweight_worktree "haqei-test-lite-\$test_name" "feature/test-\$test_name" 3005 "Testing & QA"
                ;;
            5)
                echo "✅ Resource monitor created: ./resource-monitor.sh"
                ;;
            0)
                echo "⚡ Happy lightweight development!"
                exit 0
                ;;
            *)
                echo "❌ Invalid option"
                ;;
        esac
    done
}

main