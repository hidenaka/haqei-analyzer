#!/bin/bash

# Enhanced Development Commands for HAQEI Analyzer
# Usage examples:
#   ./scripts/enhanced-dev-commands.sh new "ユーザー認証機能実装" 6
#   ./scripts/enhanced-dev-commands.sh resume "ユーザー認証機能実装（続き）" 6

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}🚀 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Parse arguments
MODE=${1:-new}  # new, resume
TASK=${2:-"新機能開発"}
AGENTS=${3:-6}
TYPE=${4:-""}

# Validate mode
if [[ "$MODE" != "new" && "$MODE" != "resume" ]]; then
    print_error "モードは 'new' または 'resume' を指定してください"
    exit 1
fi

print_status "HAQEI開発体制起動中..."
echo "📝 タスク: $TASK"
echo "🤖 エージェント数: $AGENTS"
echo "🔄 モード: $MODE"

# Setup MCP environment
print_status "MCP環境セットアップ中..."
npm run mcp:setup

# Set environment variables and run the swarm
export npm_config_task="$TASK"
export npm_config_agents="$AGENTS"
export npm_config_type="$TYPE"

if [[ "$MODE" == "resume" ]]; then
    export npm_config_resume="true"
    print_status "継続モードで起動中..."
else
    print_status "新規開発モードで起動中..."
fi

# Run the swarm initialization
node scripts/dev-swarm-init.cjs

print_success "開発体制起動完了！"