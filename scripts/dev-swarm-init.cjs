#!/usr/bin/env node

/**
 * HAQEI開発体制Swarm初期化スクリプト
 * 新しい開発体制をSwarmコマンドから利用できるようにする
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 開発体制テンプレートのパス
const TEMPLATES_DIR = path.join(__dirname, '..', 'docs', 'development-system');

// Swarm設定
const SWARM_CONFIG = {
  // 要件定義用Swarm
  requirements: {
    agents: ['haqei-requirements-analyst', 'haqei-cto', 'researcher'],
    topology: 'hierarchical',
    maxAgents: 3,
    template: '01_要件壁打ちテンプレート.md'
  },
  // 開発用Swarm
  development: {
    agents: ['system-architect', 'coder', 'coder', 'backend-dev', 'tester', 'task-orchestrator'],
    topology: 'mesh',
    maxAgents: 8,
    template: '02_エージェントオーケストレーション運用ガイド.md'
  },
  // テスト用Swarm
  testing: {
    agents: ['tester', 'haqei-qa-tester', 'performance-benchmarker', 'code-analyzer'],
    topology: 'hierarchical',
    maxAgents: 5,
    template: '03_即時テスト実行フロー.md'
  },
  // 品質保証用Swarm
  quality: {
    agents: ['reviewer', 'code-analyzer', 'security-manager', 'documenter'],
    topology: 'star',
    maxAgents: 4,
    template: '06_タスク完了チェックリスト自動化設計.md'
  }
};

// タスクタイプの自動判別
function detectTaskType(taskName) {
  const taskLower = taskName.toLowerCase();
  
  if (taskLower.includes('要件') || taskLower.includes('仕様') || taskLower.includes('設計')) {
    return 'requirements';
  } else if (taskLower.includes('テスト') || taskLower.includes('test')) {
    return 'testing';
  } else if (taskLower.includes('品質') || taskLower.includes('レビュー') || taskLower.includes('チェック')) {
    return 'quality';
  } else {
    return 'development';
  }
}

// Swarm初期化コマンドの生成
function generateSwarmCommand(taskName, options = {}) {
  const taskType = options.type || detectTaskType(taskName);
  const config = SWARM_CONFIG[taskType];
  
  console.log(`🎯 タスクタイプ: ${taskType}`);
  console.log(`📋 使用テンプレート: ${config.template}`);
  console.log(`🤖 起動エージェント: ${config.agents.join(', ')}`);
  
  // テンプレート内容をメモリに保存
  const templatePath = path.join(TEMPLATES_DIR, config.template);
  const templateContent = fs.readFileSync(templatePath, 'utf8');
  
  // Claude Flow memory にテンプレートを保存
  const memoryCommand = `npx claude-flow@alpha memory store --key "haqei/template/${taskType}" --value "${Buffer.from(templateContent).toString('base64')}"`;
  
  try {
    execSync(memoryCommand, { stdio: 'inherit' });
  } catch (error) {
    console.warn('⚠️ テンプレートのメモリ保存に失敗しました（続行します）');
  }
  
  // Swarm起動コマンドの構築
  const swarmCommand = [
    'npx claude-flow@alpha swarm',
    `"${taskName}"`,
    `--topology ${config.topology}`,
    `--agents ${options.agents || config.maxAgents}`,
    '--auto-spawn',
    '--memory-enabled',
    `--context "HAQEI開発体制/${taskType}"`,
    options.resume ? '--resume' : '',
    options.claude ? '--claude' : ''
  ].filter(Boolean).join(' ');
  
  return swarmCommand;
}

// メイン処理
function main() {
  const args = process.argv.slice(2);
  const taskName = process.env.npm_config_task || args[0] || '新機能開発';
  const agentCount = process.env.npm_config_agents || args[1];
  const isResume = process.env.npm_config_resume === 'true';
  const taskType = process.env.npm_config_type;
  
  console.log('🚀 HAQEI開発体制Swarm起動中...');
  console.log(`📝 タスク: ${taskName}`);
  
  // 開発体制ガイドラインをメモリに保存
  const guidelines = `
# HAQEI開発体制ガイドライン

1. 要件定義は必ず壁打ちテンプレートを使用
2. Playwrightでのテストを必須とする（localhost禁止）
3. 並列開発では最大${agentCount || 8}エージェントを同時稼働
4. ドキュメントは日付YYYYMMDD形式で統一
5. タスク完了時は自動チェックリストで品質確認
6. 最終報告書は包括的テンプレートを使用

現在のタスク: ${taskName}
タスクタイプ: ${taskType || detectTaskType(taskName)}
`;
  
  const guidelineCommand = `npx claude-flow@alpha memory store --key "haqei/guidelines/current" --value "${Buffer.from(guidelines).toString('base64')}"`;
  
  try {
    execSync(guidelineCommand, { stdio: 'inherit' });
  } catch (error) {
    console.warn('⚠️ ガイドラインのメモリ保存に失敗しました（続行します）');
  }
  
  // Swarmコマンドの生成と実行
  const swarmCommand = generateSwarmCommand(taskName, {
    agents: agentCount,
    resume: isResume,
    type: taskType,
    claude: true
  });
  
  console.log('\n📊 実行コマンド:');
  console.log(swarmCommand);
  console.log('\n');
  
  // Swarmの起動
  try {
    execSync(swarmCommand, { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Swarm起動エラー:', error.message);
    process.exit(1);
  }
}

// エラーハンドリング
process.on('uncaughtException', (error) => {
  console.error('❌ 予期しないエラー:', error);
  process.exit(1);
});

// 実行
if (require.main === module) {
  main();
}

module.exports = { generateSwarmCommand, detectTaskType };