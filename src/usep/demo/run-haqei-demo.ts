#!/usr/bin/env node

/**
 * HaQei USEP Demo Runner
 * 
 * HaQeiシステムの改善分析デモを実行する簡易スクリプト
 */

import { VirtualUserGenerator } from '../core/VirtualUserGenerator';
import { ExperienceSimulator } from '../core/ExperienceSimulator';
import { AutoImprovementEngine } from '../core/AutoImprovementEngine';
import { haqeiDemoConfig, haqeiPersonaProfiles, demoScenarios } from '../config/haqei-demo-config';
import * as fs from 'fs/promises';
import * as path from 'path';

// カラー出力用のシンプルな実装
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg: string) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`)
};

/**
 * メイン実行関数
 */
async function runDemo() {
  log.title('🚀 HaQei USEP デモ実行');
  
  // デモサイズ選択
  const demoSize = process.argv[2] || 'small';
  const scenario = demoScenarios[demoSize] || demoScenarios.small;
  
  log.info(`デモサイズ: ${demoSize} (${scenario.userCount}人のユーザー)`);
  log.info(`推定所要時間: ${scenario.duration}`);
  
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const outputDir = path.join('./output', 'demo', `haqei-${demoSize}-${timestamp}`);
  
  try {
    // 出力ディレクトリ作成
    await fs.mkdir(outputDir, { recursive: true });
    
    // Step 1: 仮想ユーザー生成
    log.title('Step 1/3: 仮想ユーザー生成');
    const users = await generateVirtualUsers(scenario.userCount);
    await saveJson(path.join(outputDir, 'virtual-users.json'), users);
    log.success(`${users.length}人の仮想ユーザーを生成しました`);
    displayUserStats(users);
    
    // Step 2: 体験シミュレーション
    log.title('Step 2/3: 体験シミュレーション');
    const reports = await simulateExperiences(users);
    await saveJson(path.join(outputDir, 'experience-reports.json'), reports);
    log.success(`${reports.length}件の体験シミュレーションが完了しました`);
    displaySimulationStats(reports);
    
    // Step 3: 改善分析
    log.title('Step 3/3: 改善分析');
    const analysis = await analyzeAndSuggest(reports);
    await saveJson(path.join(outputDir, 'improvement-analysis.json'), analysis);
    log.success('改善分析が完了しました');
    displayAnalysisResults(analysis);
    
    // HTMLレポート生成
    const htmlPath = path.join(outputDir, 'report.html');
    await generateHtmlReport(analysis, htmlPath);
    log.success(`HTMLレポートを生成しました: ${htmlPath}`);
    
    // 完了メッセージ
    log.title('✅ デモ実行完了！');
    log.info(`結果ディレクトリ: ${outputDir}`);
    log.info(`HTMLレポート: ${htmlPath}`);
    
    // 主要な改善提案を表示
    displayTopImprovements(analysis);
    
  } catch (error) {
    log.error('エラーが発生しました:');
    console.error(error);
    process.exit(1);
  }
}

/**
 * 仮想ユーザー生成
 */
async function generateVirtualUsers(count: number) {
  const generator = new VirtualUserGenerator();
  
  // HaQeiペルソナプロファイルを設定
  generator.setPersonaProfiles(haqeiPersonaProfiles);
  
  return await generator.generateUserCohort(count, haqeiDemoConfig);
}

/**
 * 体験シミュレーション
 */
async function simulateExperiences(users: any[]) {
  const simulator = new ExperienceSimulator();
  
  const config = {
    serviceConfig: haqeiDemoConfig,
    detailLevel: 'detailed' as const,
    emotionalTracking: true,
    realTimeAnalytics: true,
    parallelSimulations: Math.min(10, users.length)
  };
  
  return await simulator.simulateExperiences(users, config);
}

/**
 * 改善分析
 */
async function analyzeAndSuggest(reports: any[]) {
  const engine = new AutoImprovementEngine();
  return await engine.analyzeAndSuggest(reports, haqeiDemoConfig);
}

/**
 * ユーザー統計表示
 */
function displayUserStats(users: any[]) {
  console.log('\n📊 ユーザー統計:');
  
  // ペルソナタイプ分布
  const personaTypes = users.reduce((acc, user) => {
    const type = user.personaType || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  
  Object.entries(personaTypes).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}人`);
  });
}

/**
 * シミュレーション統計表示
 */
function displaySimulationStats(reports: any[]) {
  console.log('\n📊 シミュレーション結果:');
  
  const stats = {
    completed: reports.filter(r => r.journey?.every(s => s.success)).length,
    converted: reports.filter(r => r.converted).length,
    avgSatisfaction: reports.reduce((sum, r) => sum + r.metrics.satisfactionScore, 0) / reports.length,
    avgNPS: reports.reduce((sum, r) => sum + r.npsScore, 0) / reports.length
  };
  
  console.log(`  完遂率: ${((stats.completed / reports.length) * 100).toFixed(1)}%`);
  console.log(`  コンバージョン率: ${((stats.converted / reports.length) * 100).toFixed(1)}%`);
  console.log(`  平均満足度: ${(stats.avgSatisfaction * 100).toFixed(1)}%`);
  console.log(`  平均NPS: ${stats.avgNPS.toFixed(1)}`);
}

/**
 * 分析結果表示
 */
function displayAnalysisResults(analysis: any) {
  console.log('\n📊 改善分析結果:');
  console.log(`  全体健全性: ${analysis.summary.overallHealth}`);
  console.log(`  改善提案数: ${analysis.improvements.length}`);
  console.log(`  処理時間: ${analysis.metrics.processingTime}ms`);
  
  // 優先度別
  const byPriority = analysis.improvements.reduce((acc, imp) => {
    acc[imp.priority] = (acc[imp.priority] || 0) + 1;
    return acc;
  }, {});
  
  console.log('\n  優先度別提案数:');
  Object.entries(byPriority).forEach(([priority, count]) => {
    console.log(`    ${priority}: ${count}件`);
  });
}

/**
 * トップ改善提案表示
 */
function displayTopImprovements(analysis: any) {
  console.log('\n🎯 重要な改善提案:');
  
  const topImprovements = analysis.improvements
    .filter(imp => imp.priority === 'critical' || imp.priority === 'high')
    .slice(0, 5);
  
  topImprovements.forEach((imp, index) => {
    console.log(`\n${index + 1}. ${imp.title}`);
    console.log(`   ${imp.description}`);
    console.log(`   期待効果: CV +${(imp.estimatedImpact.conversionImprovement * 100).toFixed(1)}%, 満足度 +${(imp.estimatedImpact.satisfactionImprovement * 100).toFixed(1)}%`);
    console.log(`   実装難易度: ${imp.implementationComplexity}`);
  });
}

/**
 * HTMLレポート生成
 */
async function generateHtmlReport(analysis: any, outputPath: string) {
  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HaQei USEP改善分析レポート</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      min-height: 100vh;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: white;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      margin-bottom: 30px;
      text-align: center;
    }
    .header h1 {
      color: #2c3e50;
      font-size: 2.5em;
      margin-bottom: 10px;
    }
    .header .subtitle {
      color: #7f8c8d;
      font-size: 1.2em;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }
    .metric-card {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.08);
      text-align: center;
      transition: transform 0.3s ease;
    }
    .metric-card:hover {
      transform: translateY(-5px);
    }
    .metric-value {
      font-size: 3em;
      font-weight: bold;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 10px 0;
    }
    .metric-label {
      color: #7f8c8d;
      font-size: 1.1em;
    }
    .section {
      background: white;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }
    .section h2 {
      color: #2c3e50;
      margin-bottom: 30px;
      font-size: 2em;
      border-bottom: 3px solid #667eea;
      padding-bottom: 10px;
    }
    .improvement-card {
      background: #f8f9fa;
      padding: 25px;
      margin: 20px 0;
      border-radius: 12px;
      border-left: 5px solid #667eea;
      transition: all 0.3s ease;
    }
    .improvement-card:hover {
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
    }
    .priority-critical {
      border-left-color: #e74c3c;
    }
    .priority-high {
      border-left-color: #f39c12;
    }
    .priority-medium {
      border-left-color: #3498db;
    }
    .improvement-title {
      font-size: 1.3em;
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 10px;
    }
    .improvement-impact {
      display: flex;
      gap: 20px;
      margin-top: 15px;
      flex-wrap: wrap;
    }
    .impact-badge {
      background: #667eea;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.9em;
    }
    .roadmap-timeline {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
      margin-top: 30px;
    }
    .timeline-phase {
      text-align: center;
    }
    .timeline-circle {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 2em;
      font-weight: bold;
      margin: 0 auto 20px;
    }
    .insights-list {
      list-style: none;
      padding: 0;
    }
    .insights-list li {
      background: #f8f9fa;
      padding: 15px 20px;
      margin: 10px 0;
      border-radius: 8px;
      border-left: 3px solid #667eea;
    }
    .footer {
      text-align: center;
      color: #7f8c8d;
      margin-top: 50px;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>HaQei USEP改善分析レポート</h1>
      <div class="subtitle">AI駆動による体験改善提案</div>
    </div>

    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">分析ユーザー数</div>
        <div class="metric-value">${analysis.summary.totalUsers}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">コンバージョン率</div>
        <div class="metric-value">${(analysis.summary.conversionRate * 100).toFixed(1)}%</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">平均満足度</div>
        <div class="metric-value">${(analysis.summary.averageSatisfaction * 100).toFixed(1)}%</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">全体健全性</div>
        <div class="metric-value">${analysis.summary.overallHealth}</div>
      </div>
    </div>

    <div class="section">
      <h2>🎯 優先改善提案</h2>
      ${analysis.improvements
        .filter(imp => imp.priority === 'critical' || imp.priority === 'high')
        .slice(0, 10)
        .map(imp => `
          <div class="improvement-card priority-${imp.priority}">
            <div class="improvement-title">${imp.title}</div>
            <p>${imp.description}</p>
            <div class="improvement-impact">
              <span class="impact-badge">CV +${(imp.estimatedImpact.conversionImprovement * 100).toFixed(1)}%</span>
              <span class="impact-badge">満足度 +${(imp.estimatedImpact.satisfactionImprovement * 100).toFixed(1)}%</span>
              <span class="impact-badge">難易度: ${imp.implementationComplexity}</span>
            </div>
          </div>
        `).join('')}
    </div>

    <div class="section">
      <h2>📅 実装ロードマップ</h2>
      <div class="roadmap-timeline">
        <div class="timeline-phase">
          <div class="timeline-circle">${analysis.roadmap.immediate.length}</div>
          <h3>即時対応</h3>
          <p>1-2週間以内</p>
        </div>
        <div class="timeline-phase">
          <div class="timeline-circle">${analysis.roadmap.shortTerm.length}</div>
          <h3>短期計画</h3>
          <p>1-3ヶ月</p>
        </div>
        <div class="timeline-phase">
          <div class="timeline-circle">${analysis.roadmap.longTerm.length}</div>
          <h3>長期計画</h3>
          <p>3-6ヶ月</p>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>💡 主要な発見</h2>
      <ul class="insights-list">
        ${analysis.summary.topIssues.map(issue => 
          `<li>${issue}</li>`
        ).join('')}
      </ul>
    </div>

    <div class="section">
      <h2>🎉 成功要因</h2>
      <ul class="insights-list">
        ${analysis.summary.keySuccesses.map(success => 
          `<li>${success}</li>`
        ).join('')}
      </ul>
    </div>

    <div class="footer">
      <p>Generated by Universal Service Evolution Platform (USEP)</p>
      <p>${new Date().toLocaleString('ja-JP')}</p>
    </div>
  </div>
</body>
</html>
  `;
  
  await fs.writeFile(outputPath, html);
}

/**
 * JSONデータ保存
 */
async function saveJson(filepath: string, data: any) {
  await fs.writeFile(filepath, JSON.stringify(data, null, 2));
}

// 実行
if (require.main === module) {
  runDemo().catch(console.error);
}