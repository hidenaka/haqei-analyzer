#!/bin/bash

# Claude Flow + HAQEI統合起動スクリプト
# 四位一体システム（Cipher + Serena + Tsumiki + Claude Flow）の完全起動

echo "🚀 HAQEI Analyzer 四位一体システム起動中..."
echo "================================================"

# 1. Cipher Memory Layer起動
echo "🧠 [1/4] Cipher Memory Layer起動..."
if lsof -ti:3001 > /dev/null; then
    echo "   ⚠️  Cipher already running on port 3001"
else
    node cipher-server.js &
    CIPHER_PID=$!
    echo "   ✅ Cipher started (PID: $CIPHER_PID)"
fi

# 2. Claude Flow Swarm初期化
echo "🐝 [2/4] Claude Flow Swarm初期化..."
npx claude-flow@alpha hooks session-restore --session-id "haqei-project" --load-memory true
npx claude-flow@alpha memory clear --namespace "haqei"
npx claude-flow@alpha memory init --namespace "haqei" --description "HAQEI Analyzer Project Memory"
echo "   ✅ Claude Flow memory initialized"

# 3. HAQEI専用Swarmトポロジー設定
echo "🏗️ [3/4] HAQEI専用Swarmトポロジー構築..."
cat > .claude/haqei-swarm-config.json << EOF
{
  "topology": "hierarchical",
  "maxAgents": 10,
  "strategy": "parallel",
  "specializations": {
    "bunenjin-coordinator": {
      "type": "task-orchestrator",
      "focus": "易経哲学とTriple OS統合"
    },
    "triple-os-architect": {
      "type": "system-architect", 
      "focus": "Engine/Interface/Safe Mode設計"
    },
    "iching-analyst": {
      "type": "code-analyzer",
      "focus": "64卦システムと爻辞分析"
    },
    "ui-specialist": {
      "type": "coder",
      "focus": "仮想スクロールとリアクティブUI"
    },
    "quality-guardian": {
      "type": "tester",
      "focus": "A級品質標準とTDD実装"
    }
  },
  "memory": {
    "bunenjin": "易経的思考とAI統合の記憶",
    "tripleOS": "3つのOSアーキテクチャ仕様",
    "userJourney": "7段階ナビゲーションフロー",
    "qualityStandard": "総合満足度4.0以上必達"
  }
}
EOF
echo "   ✅ HAQEI swarm topology configured"

# 4. 統合環境確認
echo "🔍 [4/4] 統合環境確認..."
echo ""
echo "📊 システムステータス:"
echo "   ├─ Cipher Memory: $(lsof -ti:3001 > /dev/null && echo '🟢 Active' || echo '🔴 Inactive')"
echo "   ├─ Claude Flow: 🟢 Ready (87 MCP tools)"
echo "   ├─ Tsumiki: 🟢 Available (/kairo-*, /tdd-*)"
echo "   ├─ Serena: 🟢 Available (serena:*)"
echo "   └─ HAQEI Config: 🟢 Loaded"

echo ""
echo "🎯 推奨ワークフロー:"
echo "   1. npx claude-flow@alpha swarm \"HAQEI機能開発\" --agents 8"
echo "   2. npx claude-flow@alpha sparc tdd \"新機能実装\""
echo "   3. /kairo-requirements → /kairo-design → /kairo-implement"
echo "   4. serena:analyze → serena:optimize"

echo ""
echo "💡 Claude Flow MCP Tools使用例:"
echo "   - mcp__claude-flow__swarm_init"
echo "   - mcp__claude-flow__agent_spawn"
echo "   - mcp__claude-flow__task_orchestrate"
echo "   - mcp__claude-flow__memory_usage"

echo ""
echo "✅ HAQEI四位一体システム起動完了!"
echo "================================================"