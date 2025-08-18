#!/bin/bash  
# Portable HAQEI Future Simulator Environment
# 複数Mac対応・現在のディレクトリで動作

# 自動Mac識別
MAC_ID=$(hostname | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]//g')
CURRENT_USER=$(whoami)

echo "🖥️ Detected Mac: $MAC_ID"
echo "👤 User: $CURRENT_USER"
echo "📂 Working in: $(pwd)"

# 動的環境設定
export CIPHER_PORT=$(python3 -c "import random; print(random.randint(3011, 3020))")
export WORKTREE_NAME="future-simulator-$MAC_ID"
export NODE_OPTIONS="--max-old-space-size=1024"

echo "⚡ Starting portable Future Simulator environment"
echo "🌐 Port: $CIPHER_PORT"
echo "💻 Environment: $WORKTREE_NAME"

# Git branch識別・作成
BRANCH_NAME="feature/future-simulator-$MAC_ID"
git checkout -b "$BRANCH_NAME" 2>/dev/null || git checkout "$BRANCH_NAME"

echo "🌿 Branch: $BRANCH_NAME"

# Cipher起動
CIPHER_PORT=$CIPHER_PORT node cipher-server.js &
CIPHER_PID=$!

echo "✅ Portable Future Simulator environment ready!"
echo "🎯 Focus: Bunenjin Philosophy & Future Prediction"
echo "🎮 Start Claude: claude"
echo "🔄 Sync changes: git add . && git commit -m 'Update from $MAC_ID'"

trap 'kill $CIPHER_PID 2>/dev/null' EXIT
wait