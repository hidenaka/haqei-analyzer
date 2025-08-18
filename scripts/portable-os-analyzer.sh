#!/bin/bash
# Portable HAQEI OS Analyzer Environment
# 複数Mac対応・現在のディレクトリで動作

# 自動Mac識別
MAC_ID=$(hostname | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]//g')
CURRENT_USER=$(whoami)

echo "🖥️ Detected Mac: $MAC_ID"
echo "👤 User: $CURRENT_USER"
echo "📂 Working in: $(pwd)"

# 動的環境設定
export CIPHER_PORT=$(python3 -c "import random; print(random.randint(3001, 3010))")
export WORKTREE_NAME="os-analyzer-$MAC_ID"
export NODE_OPTIONS="--max-old-space-size=1024"

echo "⚡ Starting portable OS Analyzer environment"
echo "🌐 Port: $CIPHER_PORT"
echo "💻 Environment: $WORKTREE_NAME"

# Git branch識別・作成
BRANCH_NAME="feature/os-analyzer-$MAC_ID"
git checkout -b "$BRANCH_NAME" 2>/dev/null || git checkout "$BRANCH_NAME"

echo "🌿 Branch: $BRANCH_NAME"

# Cipher起動
CIPHER_PORT=$CIPHER_PORT node cipher-server.js &
CIPHER_PID=$!

echo "✅ Portable OS Analyzer environment ready!"
echo "🎯 Focus: Triple OS Architecture & Analysis Engine"
echo "🎮 Start Claude: claude"
echo "🔄 Sync changes: git add . && git commit -m 'Update from $MAC_ID'"

trap 'kill $CIPHER_PID 2>/dev/null' EXIT
wait