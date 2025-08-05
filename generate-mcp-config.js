#!/usr/bin/env node

/**
 * 動的MCP設定生成スクリプト
 * 
 * 目的: 
 * - 現在のユーザーディレクトリを自動検出
 * - claude-mcp-config.jsonを動的生成
 * - hideakimacbookairとnakanohideakiの両方のユーザーで使用可能
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 現在のプロジェクトディレクトリを取得
const currentProjectPath = process.cwd();
const currentUser = os.userInfo().username;

console.log(`🔧 MCP設定生成中...`);
console.log(`👤 現在のユーザー: ${currentUser}`);
console.log(`📁 プロジェクトパス: ${currentProjectPath}`);

// MCP設定テンプレート
const mcpConfig = {
  "mcpServers": {
    "cipher": {
      "command": "node",
      "args": ["cipher-server.js"],
      "cwd": currentProjectPath,
      "env": {
        "NODE_ENV": "development",
        "CIPHER_PORT": "3001",
        "CIPHER_PROJECT_PATH": currentProjectPath
      },
      "timeout": 30000,
      "description": "Cipher Dual Memory Layer - bunenjin哲学とプロジェクト記憶の継続管理"
    },
    "tsumiki": {
      "command": "node",
      "args": ["tsumiki-cli.js"],
      "cwd": currentProjectPath,
      "env": {
        "NODE_ENV": "development",
        "TSUMIKI_PROJECT_PATH": currentProjectPath
      },
      "timeout": 60000,
      "description": "Tsumiki AI駆動開発フレームワーク - 構造化品質管理システム"
    },
    "serena": {
      "command": "uvx",
      "args": [
        "--from",
        "git+https://github.com/oraios/serena",
        "serena",
        "start-mcp-server",
        "--context",
        "ide-assistant",
        "--project",
        currentProjectPath
      ],
      "cwd": currentProjectPath,
      "env": {
        "SERENA_PROJECT_CONFIG": path.join(currentProjectPath, ".serena", "project.yml")
      },
      "timeout": 45000,
      "description": "Serena セマンティックコード分析とファイル監視システム"
    },
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp"],
      "cwd": currentProjectPath,
      "env": {
        "NODE_ENV": "development"
      },
      "timeout": 30000,
      "description": "Playwright MCP - ブラウザ自動化とE2Eテスト"
    },
    "claude-flow": {
      "command": "npx",
      "args": ["claude-flow@alpha", "mcp", "start"],
      "type": "stdio",
      "env": {
        "NODE_ENV": "development",
        "CLAUDE_FLOW_PROJECT_PATH": currentProjectPath
      },
      "timeout": 60000,
      "description": "Claude Flow v2 - エンタープライズグレードAI orchestration、Hive-Mind Intelligence、87の専門MCPツール"
    },
    "ruv-swarm": {
      "command": "npx",
      "args": ["ruv-swarm@latest", "mcp", "start"],
      "type": "stdio",
      "env": {
        "NODE_ENV": "development"
      },
      "timeout": 30000,
      "description": "Ruv Swarm - 分散エージェント協調システム"
    }
  },
  "globalShortcuts": {
    "cipher": {
      "startMemoryLayer": "cipher:start",
      "stopMemoryLayer": "cipher:stop", 
      "testConfiguration": "cipher:test"
    },
    "tsumiki": {
      "requirements": "/kairo-requirements",
      "design": "/kairo-design", 
      "tasks": "/kairo-tasks",
      "implement": "/kairo-implement",
      "tddRequirements": "/tdd-requirements",
      "tddTestcases": "/tdd-testcases",
      "tddRed": "/tdd-red",
      "tddGreen": "/tdd-green",
      "tddRefactor": "/tdd-refactor",
      "tddVerifyComplete": "/tdd-verify-complete"
    },
    "serena": {
      "analyzeProject": "serena:analyze",
      "optimizeCode": "serena:optimize",
      "watchFiles": "serena:watch"
    },
    "claudeFlow": {
      "swarmInit": "mcp__claude-flow__swarm_init",
      "agentSpawn": "mcp__claude-flow__agent_spawn",
      "taskOrchestrate": "mcp__claude-flow__task_orchestrate",
      "memoryUsage": "mcp__claude-flow__memory_usage",
      "neuralStatus": "mcp__claude-flow__neural_status",
      "githubSwarm": "mcp__claude-flow__github_swarm",
      "repoAnalyze": "mcp__claude-flow__repo_analyze",
      "prEnhance": "mcp__claude-flow__pr_enhance"
    }
  },
  "integrationWorkflow": {
    "quadrupleSystem": {
      "description": "Cipher + Serena + Tsumiki + Claude Flow 四位一体運用",
      "workflow": [
        "1. Cipher（記憶・哲学）: bunenjin哲学とプロジェクト記憶の継続",
        "2. Serena（分析・最適化）: セマンティックコード分析とファイル監視", 
        "3. Tsumiki（構造化・品質）: 標準化されたAI駆動開発プロセス",
        "4. Claude Flow（協調・並列）: Hive-Mind IntelligenceとSwarm協調実行"
      ],
      "feedbackLoop": "Cipher（記憶） → Claude Flow（協調） → Tsumiki（構造化） → Serena（最適化） → 統合フィードバック → Cipher（学習蓄積）",
      "claudeFlowIntegration": {
        "swarmCoordination": "87のMCPツールによる並列協調実行",
        "neuralEnhancement": "27以上の認知モデルによる学習最適化",
        "memoryPersistence": "SQLiteによる永続的な記憶管理",
        "parallelExecution": "2.8-4.4倍の速度向上"
      }
    },
    "developmentPhases": {
      "planning": ["cipher:start", "mcp__claude-flow__swarm_init", "/kairo-requirements", "/kairo-design"],
      "implementation": ["mcp__claude-flow__agent_spawn", "/kairo-tasks", "/kairo-implement", "serena:analyze"],
      "testing": ["mcp__claude-flow__task_orchestrate", "/tdd-red", "/tdd-green", "/tdd-refactor"],
      "validation": ["/tdd-verify-complete", "serena:optimize", "playwright:test", "mcp__claude-flow__neural_status"]
    }
  },
  "projectSpecific": {
    "haqeiAnalyzer": {
      "bunenjinPhilosophy": true,
      "tripleOSArchitecture": true,
      "iChingIntegration": true,
      "qualityStandard": "A級（Tsumiki標準）"
    }
  },
  "metadata": {
    "generatedBy": "generate-mcp-config.js",
    "generatedAt": new Date().toISOString(),
    "currentUser": currentUser,
    "projectPath": currentProjectPath
  }
};

// 設定ファイルを書き出し
const configPath = path.join(currentProjectPath, 'claude-mcp-config.json');
fs.writeFileSync(configPath, JSON.stringify(mcpConfig, null, 2), 'utf8');

console.log(`✅ MCP設定ファイル生成完了: ${configPath}`);
console.log(`📝 設定内容:`);
console.log(`   - Cipher: ${mcpConfig.mcpServers.cipher.cwd}`);
console.log(`   - Tsumiki: ${mcpConfig.mcpServers.tsumiki.cwd}`);
console.log(`   - Serena: ${mcpConfig.mcpServers.serena.cwd}`);
console.log(`   - Playwright: ${mcpConfig.mcpServers.playwright.cwd}`);
console.log(`   - Claude Flow: ${mcpConfig.mcpServers['claude-flow'].description}`);
console.log(`   - Ruv Swarm: ${mcpConfig.mcpServers['ruv-swarm'].description}`);
console.log(`🚀 使用方法: claude --mcp-config claude-mcp-config.json`);