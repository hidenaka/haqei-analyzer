#!/usr/bin/env node

/**
 * USEP CLI - Universal Service Evolution Platform コマンドラインツール
 * 
 * 使用方法:
 * npx ts-node src/usep/cli/usep-cli.ts [command] [options]
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { VirtualUserGenerator } from '../core/VirtualUserGenerator.js';
import { ExperienceSimulator } from '../core/ExperienceSimulator.js';
import { AutoImprovementEngine } from '../core/AutoImprovementEngine.js';
import type { ServiceConfig, SimulationConfig } from '../types/index.js';
import * as fs from 'fs/promises';
import * as path from 'path';

const program = new Command();

program
  .name('usep')
  .description('Universal Service Evolution Platform - AI駆動サービス改善ツール')
  .version('1.0.0');

/**
 * generateコマンド - 仮想ユーザー生成
 */
program
  .command('generate')
  .description('仮想ユーザーを生成します')
  .option('-c, --count <number>', 'ユーザー数', '100')
  .option('-s, --service <type>', 'サービスタイプ (haqei, ecommerce, saas等)', 'haqei')
  .option('-o, --output <path>', '出力ファイルパス', './output/virtual-users.json')
  .action(async (options) => {
    const spinner = ora('仮想ユーザー生成中...').start();
    
    try {
      const count = parseInt(options.count);
      const serviceConfig: ServiceConfig = {
        type: options.service,
        name: `${options.service}-demo`,
        features: getDefaultFeatures(options.service)
      };
      
      const generator = new VirtualUserGenerator();
      const users = await generator.generateUserCohort(count, serviceConfig);
      
      // 出力ディレクトリ作成
      await ensureDir(path.dirname(options.output));
      
      // 結果保存
      await fs.writeFile(
        options.output,
        JSON.stringify(users, null, 2)
      );
      
      spinner.succeed(chalk.green(`✅ ${count}人の仮想ユーザーを生成しました`));
      console.log(chalk.gray(`出力: ${options.output}`));
      
      // 統計情報表示
      displayUserStatistics(users);
      
    } catch (error) {
      spinner.fail(chalk.red('エラーが発生しました'));
      console.error(error);
      process.exit(1);
    }
  });

/**
 * simulateコマンド - 体験シミュレーション
 */
program
  .command('simulate')
  .description('ユーザー体験をシミュレートします')
  .option('-i, --input <path>', '仮想ユーザーファイル', './output/virtual-users.json')
  .option('-s, --service <type>', 'サービスタイプ', 'haqei')
  .option('-d, --detail <level>', '詳細レベル (basic, detailed, comprehensive)', 'detailed')
  .option('-o, --output <path>', '出力ファイルパス', './output/experience-reports.json')
  .action(async (options) => {
    const spinner = ora('体験シミュレーション実行中...').start();
    
    try {
      // ユーザーデータ読み込み
      const usersData = await fs.readFile(options.input, 'utf-8');
      const users = JSON.parse(usersData);
      
      const config: SimulationConfig = {
        serviceConfig: {
          type: options.service,
          name: `${options.service}-demo`,
          features: getDefaultFeatures(options.service)
        },
        detailLevel: options.detail,
        emotionalTracking: true,
        realTimeAnalytics: true,
        parallelSimulations: 10
      };
      
      const simulator = new ExperienceSimulator();
      const reports = await simulator.simulateExperiences(users, config);
      
      // 結果保存
      await ensureDir(path.dirname(options.output));
      await fs.writeFile(
        options.output,
        JSON.stringify(reports, null, 2)
      );
      
      spinner.succeed(chalk.green(`✅ ${reports.length}件の体験シミュレーションが完了しました`));
      console.log(chalk.gray(`出力: ${options.output}`));
      
      // 結果サマリー表示
      displaySimulationSummary(reports);
      
    } catch (error) {
      spinner.fail(chalk.red('エラーが発生しました'));
      console.error(error);
      process.exit(1);
    }
  });

/**
 * analyzeコマンド - 改善分析
 */
program
  .command('analyze')
  .description('体験データを分析し、改善提案を生成します')
  .option('-i, --input <path>', '体験レポートファイル', './output/experience-reports.json')
  .option('-s, --service <type>', 'サービスタイプ', 'haqei')
  .option('-o, --output <path>', '出力ファイルパス', './output/improvement-analysis.json')
  .option('-r, --report', 'HTMLレポートも生成', false)
  .action(async (options) => {
    const spinner = ora('改善分析実行中...').start();
    
    try {
      // レポートデータ読み込み
      const reportsData = await fs.readFile(options.input, 'utf-8');
      const reports = JSON.parse(reportsData);
      
      const serviceConfig: ServiceConfig = {
        type: options.service,
        name: `${options.service}-demo`,
        features: getDefaultFeatures(options.service)
      };
      
      const engine = new AutoImprovementEngine();
      const analysis = await engine.analyzeAndSuggest(reports, serviceConfig);
      
      // 結果保存
      await ensureDir(path.dirname(options.output));
      await fs.writeFile(
        options.output,
        JSON.stringify(analysis, null, 2)
      );
      
      spinner.succeed(chalk.green(`✅ 改善分析が完了しました`));
      console.log(chalk.gray(`出力: ${options.output}`));
      
      // 分析結果サマリー表示
      displayAnalysisSummary(analysis);
      
      // HTMLレポート生成
      if (options.report) {
        const htmlPath = options.output.replace('.json', '.html');
        await generateHtmlReport(analysis, htmlPath);
        console.log(chalk.green(`📊 HTMLレポート生成: ${htmlPath}`));
      }
      
    } catch (error) {
      spinner.fail(chalk.red('エラーが発生しました'));
      console.error(error);
      process.exit(1);
    }
  });

/**
 * runコマンド - 一括実行
 */
program
  .command('run')
  .description('生成→シミュレーション→分析を一括実行します')
  .option('-c, --count <number>', 'ユーザー数', '100')
  .option('-s, --service <type>', 'サービスタイプ', 'haqei')
  .option('-o, --output-dir <path>', '出力ディレクトリ', './output')
  .option('-r, --report', 'HTMLレポートも生成', true)
  .action(async (options) => {
    console.log(chalk.blue('🚀 USEP一括実行開始\n'));
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const outputDir = path.join(options.outputDir, `usep-${options.service}-${timestamp}`);
    
    try {
      // 1. 仮想ユーザー生成
      console.log(chalk.yellow('📋 Step 1/3: 仮想ユーザー生成'));
      const userPath = path.join(outputDir, 'virtual-users.json');
      await runGenerate(parseInt(options.count), options.service, userPath);
      
      // 2. 体験シミュレーション
      console.log(chalk.yellow('\n📋 Step 2/3: 体験シミュレーション'));
      const reportPath = path.join(outputDir, 'experience-reports.json');
      await runSimulate(userPath, options.service, reportPath);
      
      // 3. 改善分析
      console.log(chalk.yellow('\n📋 Step 3/3: 改善分析'));
      const analysisPath = path.join(outputDir, 'improvement-analysis.json');
      await runAnalyze(reportPath, options.service, analysisPath, options.report);
      
      console.log(chalk.green('\n✅ USEP一括実行が完了しました！'));
      console.log(chalk.gray(`結果: ${outputDir}`));
      
      // 最終サマリー表示
      await displayFinalSummary(outputDir);
      
    } catch (error) {
      console.error(chalk.red('エラーが発生しました:'), error);
      process.exit(1);
    }
  });

/**
 * demoコマンド - デモ実行
 */
program
  .command('demo')
  .description('HaQeiの小規模デモを実行します')
  .action(async () => {
    console.log(chalk.blue('🎯 HaQei改善デモ実行\n'));
    
    const outputDir = './output/demo';
    
    try {
      // 10人の仮想ユーザーでデモ実行
      await runGenerate(10, 'haqei', path.join(outputDir, 'users.json'));
      await runSimulate(
        path.join(outputDir, 'users.json'),
        'haqei',
        path.join(outputDir, 'reports.json')
      );
      await runAnalyze(
        path.join(outputDir, 'reports.json'),
        'haqei',
        path.join(outputDir, 'analysis.json'),
        true
      );
      
      console.log(chalk.green('\n✅ デモが完了しました！'));
      console.log(chalk.yellow(`📊 結果を確認: ${outputDir}/analysis.html`));
      
    } catch (error) {
      console.error(chalk.red('エラー:'), error);
      process.exit(1);
    }
  });

// ヘルパー関数

/**
 * ディレクトリ作成
 */
async function ensureDir(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    // ディレクトリが既に存在する場合は無視
  }
}

/**
 * デフォルト機能取得
 */
function getDefaultFeatures(serviceType: string): string[] {
  const features = {
    haqei: ['quick-analysis', 'detailed-analysis', 'future-simulator', 'triple-os'],
    ecommerce: ['product-search', 'cart', 'checkout', 'payment'],
    saas: ['dashboard', 'analytics', 'api', 'billing']
  };
  return features[serviceType] || ['landing', 'signup', 'main-feature'];
}

/**
 * ユーザー統計表示
 */
function displayUserStatistics(users: any[]) {
  console.log(chalk.cyan('\n📊 生成ユーザー統計:'));
  
  // 年齢分布
  const ageGroups = users.reduce((acc, user) => {
    const age = user.demographics?.age || 30;
    const group = `${Math.floor(age / 10) * 10}代`;
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});
  
  console.log('年齢分布:', ageGroups);
  
  // デジタルネイティブ度
  const digitalNativeAvg = users.reduce((sum, user) => 
    sum + (user.behavioral?.digitalNative || 0.5), 0) / users.length;
  
  console.log(`デジタルネイティブ度平均: ${(digitalNativeAvg * 100).toFixed(1)}%`);
}

/**
 * シミュレーションサマリー表示
 */
function displaySimulationSummary(reports: any[]) {
  console.log(chalk.cyan('\n📊 シミュレーション結果:'));
  
  const conversionRate = reports.filter(r => r.converted).length / reports.length;
  const avgSatisfaction = reports.reduce((sum, r) => 
    sum + r.metrics.satisfactionScore, 0) / reports.length;
  const avgNPS = reports.reduce((sum, r) => 
    sum + r.npsScore, 0) / reports.length;
  
  console.log(`コンバージョン率: ${(conversionRate * 100).toFixed(1)}%`);
  console.log(`平均満足度: ${(avgSatisfaction * 100).toFixed(1)}%`);
  console.log(`平均NPS: ${avgNPS.toFixed(1)}`);
}

/**
 * 分析サマリー表示
 */
function displayAnalysisSummary(analysis: any) {
  console.log(chalk.cyan('\n📊 改善分析結果:'));
  console.log(`全体健全性: ${analysis.summary.overallHealth}`);
  console.log(`改善提案数: ${analysis.improvements.length}`);
  
  // 優先度別提案数
  const priorities = analysis.improvements.reduce((acc, imp) => {
    acc[imp.priority] = (acc[imp.priority] || 0) + 1;
    return acc;
  }, {});
  
  console.log('優先度別:', priorities);
  
  // 上位3つの改善提案
  console.log(chalk.yellow('\n🔝 上位改善提案:'));
  analysis.improvements.slice(0, 3).forEach((imp, i) => {
    console.log(`${i + 1}. ${imp.title} (${imp.priority})`);
    console.log(`   影響: CV +${(imp.estimatedImpact.conversionImprovement * 100).toFixed(1)}%`);
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
  <title>USEP改善分析レポート</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 {
      color: #2c3e50;
      border-bottom: 3px solid #3498db;
      padding-bottom: 10px;
    }
    h2 {
      color: #34495e;
      margin-top: 30px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }
    .metric {
      background: #ecf0f1;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .metric-value {
      font-size: 2em;
      font-weight: bold;
      color: #3498db;
    }
    .metric-label {
      color: #7f8c8d;
      font-size: 0.9em;
    }
    .improvement {
      background: #f8f9fa;
      padding: 20px;
      margin: 15px 0;
      border-radius: 8px;
      border-left: 4px solid #3498db;
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
    .priority-low {
      border-left-color: #95a5a6;
    }
    .impact {
      display: flex;
      gap: 20px;
      margin-top: 10px;
    }
    .impact-item {
      flex: 1;
      text-align: center;
      padding: 10px;
      background: white;
      border-radius: 5px;
    }
    .roadmap {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: 20px;
    }
    .phase {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
    }
    .phase h3 {
      margin-top: 0;
      color: #34495e;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 USEP改善分析レポート</h1>
    
    <div class="summary">
      <div class="metric">
        <div class="metric-value">${analysis.summary.totalUsers}</div>
        <div class="metric-label">分析ユーザー数</div>
      </div>
      <div class="metric">
        <div class="metric-value">${(analysis.summary.conversionRate * 100).toFixed(1)}%</div>
        <div class="metric-label">コンバージョン率</div>
      </div>
      <div class="metric">
        <div class="metric-value">${(analysis.summary.averageSatisfaction * 100).toFixed(1)}%</div>
        <div class="metric-label">平均満足度</div>
      </div>
      <div class="metric">
        <div class="metric-value">${analysis.summary.overallHealth}</div>
        <div class="metric-label">全体健全性</div>
      </div>
    </div>

    <h2>🎯 改善提案</h2>
    ${analysis.improvements.slice(0, 10).map(imp => `
      <div class="improvement priority-${imp.priority}">
        <h3>${imp.title}</h3>
        <p>${imp.description}</p>
        <div class="impact">
          <div class="impact-item">
            <strong>CV改善</strong><br>
            +${(imp.estimatedImpact.conversionImprovement * 100).toFixed(1)}%
          </div>
          <div class="impact-item">
            <strong>満足度改善</strong><br>
            +${(imp.estimatedImpact.satisfactionImprovement * 100).toFixed(1)}%
          </div>
          <div class="impact-item">
            <strong>実装難易度</strong><br>
            ${imp.implementationComplexity}
          </div>
        </div>
      </div>
    `).join('')}

    <h2>📅 実装ロードマップ</h2>
    <div class="roadmap">
      <div class="phase">
        <h3>即時対応（${analysis.roadmap.immediate.length}件）</h3>
        <ul>
          ${analysis.roadmap.immediate.slice(0, 5).map(imp => 
            `<li>${imp.title}</li>`
          ).join('')}
        </ul>
      </div>
      <div class="phase">
        <h3>短期計画（${analysis.roadmap.shortTerm.length}件）</h3>
        <ul>
          ${analysis.roadmap.shortTerm.slice(0, 5).map(imp => 
            `<li>${imp.title}</li>`
          ).join('')}
        </ul>
      </div>
      <div class="phase">
        <h3>長期計画（${analysis.roadmap.longTerm.length}件）</h3>
        <ul>
          ${analysis.roadmap.longTerm.slice(0, 5).map(imp => 
            `<li>${imp.title}</li>`
          ).join('')}
        </ul>
      </div>
    </div>

    <h2>💡 主要な発見</h2>
    <ul>
      ${analysis.summary.topIssues.map(issue => 
        `<li>${issue}</li>`
      ).join('')}
    </ul>

    <p style="text-align: center; color: #7f8c8d; margin-top: 40px;">
      Generated by USEP - ${new Date().toLocaleString('ja-JP')}
    </p>
  </div>
</body>
</html>
  `;
  
  await fs.writeFile(outputPath, html);
}

/**
 * 個別実行関数
 */
async function runGenerate(count: number, service: string, output: string) {
  const spinner = ora(`${count}人の仮想ユーザー生成中...`).start();
  
  const serviceConfig: ServiceConfig = {
    type: service,
    name: `${service}-demo`,
    features: getDefaultFeatures(service)
  };
  
  const generator = new VirtualUserGenerator();
  const users = await generator.generateUserCohort(count, serviceConfig);
  
  await ensureDir(path.dirname(output));
  await fs.writeFile(output, JSON.stringify(users, null, 2));
  
  spinner.succeed(chalk.green(`✅ 仮想ユーザー生成完了`));
}

async function runSimulate(input: string, service: string, output: string) {
  const spinner = ora('体験シミュレーション実行中...').start();
  
  const usersData = await fs.readFile(input, 'utf-8');
  const users = JSON.parse(usersData);
  
  const config: SimulationConfig = {
    serviceConfig: {
      type: service,
      name: `${service}-demo`,
      features: getDefaultFeatures(service)
    },
    detailLevel: 'detailed',
    emotionalTracking: true,
    realTimeAnalytics: true,
    parallelSimulations: 10
  };
  
  const simulator = new ExperienceSimulator();
  const reports = await simulator.simulateExperiences(users, config);
  
  await fs.writeFile(output, JSON.stringify(reports, null, 2));
  
  spinner.succeed(chalk.green(`✅ シミュレーション完了`));
}

async function runAnalyze(input: string, service: string, output: string, generateReport: boolean) {
  const spinner = ora('改善分析実行中...').start();
  
  const reportsData = await fs.readFile(input, 'utf-8');
  const reports = JSON.parse(reportsData);
  
  const serviceConfig: ServiceConfig = {
    type: service,
    name: `${service}-demo`,
    features: getDefaultFeatures(service)
  };
  
  const engine = new AutoImprovementEngine();
  const analysis = await engine.analyzeAndSuggest(reports, serviceConfig);
  
  await fs.writeFile(output, JSON.stringify(analysis, null, 2));
  
  if (generateReport) {
    const htmlPath = output.replace('.json', '.html');
    await generateHtmlReport(analysis, htmlPath);
  }
  
  spinner.succeed(chalk.green(`✅ 改善分析完了`));
}

/**
 * 最終サマリー表示
 */
async function displayFinalSummary(outputDir: string) {
  const analysisPath = path.join(outputDir, 'improvement-analysis.json');
  const analysisData = await fs.readFile(analysisPath, 'utf-8');
  const analysis = JSON.parse(analysisData);
  
  console.log(chalk.cyan('\n📊 実行結果サマリー:'));
  console.log(`全体健全性: ${analysis.summary.overallHealth}`);
  console.log(`改善提案数: ${analysis.improvements.length}`);
  console.log(`予測改善効果:`);
  console.log(`  - コンバージョン: +${(analysis.roadmap.estimatedTotalImpact.conversionImprovement * 100).toFixed(1)}%`);
  console.log(`  - 満足度: +${(analysis.roadmap.estimatedTotalImpact.satisfactionImprovement * 100).toFixed(1)}%`);
}

// プログラム実行
program.parse(process.argv);