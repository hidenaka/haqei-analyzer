#!/usr/bin/env npx ts-node --esm

/**
 * USEP Browser Automation CLI
 * ブラウザ自動化統合USEP実行コマンド
 */

import { VirtualUserGenerator, ServiceConfig, VirtualUser } from '../core/VirtualUserGenerator.ts';
import { BrowserExperienceSimulator, BrowserTestConfig } from '../core/BrowserExperienceSimulator.ts';

interface USEPBrowserConfig {
  serviceType: 'os-analyzer' | 'future-simulator' | 'strategic-cockpit';
  userCount: number;
  baseUrl: string;
  outputDir: string;
  includeBrowserTests: boolean;
  includePerformanceMetrics: boolean;
  includeAccessibilityCheck: boolean;
  generateScreenshots: boolean;
}

class USEPBrowserCLI {
  private config: USEPBrowserConfig;

  constructor() {
    this.config = this.parseArgs();
  }

  private parseArgs(): USEPBrowserConfig {
    const args = process.argv.slice(2);
    
    return {
      serviceType: this.getArg(args, '--service', 's') as any || 'os-analyzer',
      userCount: parseInt(this.getArg(args, '--users', 'u') || '50'),
      baseUrl: this.getArg(args, '--url') || 'http://localhost:3333',
      outputDir: this.getArg(args, '--output', 'o') || './usep-results',
      includeBrowserTests: !args.includes('--no-browser'),
      includePerformanceMetrics: args.includes('--performance'),
      includeAccessibilityCheck: args.includes('--a11y'),
      generateScreenshots: args.includes('--screenshots')
    };
  }

  private getArg(args: string[], longForm: string, shortForm?: string): string | undefined {
    const longIndex = args.indexOf(longForm);
    const shortIndex = shortForm ? args.indexOf(`-${shortForm}`) : -1;
    
    if (longIndex !== -1 && longIndex + 1 < args.length) {
      return args[longIndex + 1];
    }
    if (shortIndex !== -1 && shortIndex + 1 < args.length) {
      return args[shortIndex + 1];
    }
    
    return undefined;
  }

  /**
   * メイン実行関数
   */
  async run(): Promise<void> {
    console.log('🚀 USEP Browser Automation System 起動');
    console.log(`📊 設定: ${this.config.serviceType}, ${this.config.userCount}ユーザー`);
    console.log(`🌐 URL: ${this.config.baseUrl}`);
    
    try {
      // 1. サービス設定準備
      const serviceConfig = this.createServiceConfig();
      
      // 2. 仮想ユーザー生成
      console.log('\n👥 仮想ユーザー生成中...');
      const userGenerator = new VirtualUserGenerator();
      const virtualUsers = await userGenerator.generateUserCohort(this.config.userCount, serviceConfig);
      
      // 3. ブラウザテスト設定
      if (this.config.includeBrowserTests) {
        console.log('\n🌐 ブラウザ自動化テスト実行中...');
        const browserConfig = this.createBrowserConfig();
        const browserSimulator = new BrowserExperienceSimulator(browserConfig);
        
        // 4. ブラウザ体験シミュレーション実行
        const browserResults = await browserSimulator.simulateUserExperiences(virtualUsers);
        
        // 5. 包括的レポート生成
        console.log('\n📊 分析レポート生成中...');
        const comprehensiveReport = browserSimulator.generateComprehensiveReport();
        
        // 6. 結果表示
        this.displayResults(comprehensiveReport, browserResults);
        
        // 7. ファイル出力
        await this.saveResults(comprehensiveReport, browserResults, virtualUsers);
      }
      
      console.log('\n✅ USEP Browser Automation 完了');
      
    } catch (error) {
      console.error('❌ USEP実行エラー:', error);
      process.exit(1);
    }
  }

  /**
   * サービス設定作成
   */
  private createServiceConfig(): ServiceConfig {
    const configs = {
      'os-analyzer': {
        type: 'personality-analysis',
        name: 'Triple OS Analyzer',
        features: ['64hexagram', 'triple-os', 'HaQei-philosophy', 'strategic-insights']
      },
      'future-simulator': {
        type: 'scenario-simulation',
        name: 'Future Scenario Simulator',
        features: ['timeline-analysis', 'decision-tree', 'outcome-prediction']
      },
      'strategic-cockpit': {
        type: 'strategic-dashboard',
        name: 'Strategic Life Cockpit',
        features: ['gap-analysis', 'life-optimization', 'decision-support']
      }
    };
    
    return configs[this.config.serviceType] || configs['os-analyzer'];
  }

  /**
   * ブラウザテスト設定作成
   */
  private createBrowserConfig(): BrowserTestConfig {
    return {
      baseUrl: this.config.baseUrl,
      testDevices: ['desktop', 'mobile', 'tablet'],
      browsers: ['chromium', 'firefox', 'webkit'],
      performanceMetrics: this.config.includePerformanceMetrics,
      accessibilityCheck: this.config.includeAccessibilityCheck,
      screenshotCapture: this.config.generateScreenshots
    };
  }

  /**
   * 結果表示
   */
  private displayResults(report: any, browserResults: any[]): void {
    console.log('\n📊 === USEP ブラウザ分析結果 ===');
    
    // サマリー表示
    console.log('\n🎯 総合結果:');
    console.log(`  👥 テストユーザー数: ${report.summary.totalUsers}名`);
    console.log(`  ✅ 成功率: ${report.summary.successRate}%`);
    console.log(`  ⚡ 平均読み込み時間: ${report.summary.avgLoadTime}ms`);
    console.log(`  ♿ アクセシビリティスコア: ${report.summary.avgA11yScore}点`);
    console.log(`  ❌ 総エラー数: ${report.summary.totalErrors}件`);
    
    // デバイス別結果
    console.log('\n📱 デバイス別分析:');
    report.deviceAnalysis.forEach((device: any) => {
      console.log(`  ${device.device}: 成功率${Math.round(device.successRate * 100)}%, 読み込み${Math.round(device.avgLoadTime)}ms`);
    });
    
    // 優先改善項目
    console.log('\n🔧 優先改善項目 (上位5件):');
    report.improvementPriorities.slice(0, 5).forEach((improvement: string, index: number) => {
      console.log(`  ${index + 1}. ${improvement}`);
    });
    
    console.log('\n💡 Playwright MCP による実際の自動化テストを併用することで、より詳細な分析が可能です');
  }

  /**
   * 結果保存
   */
  private async saveResults(report: any, browserResults: any[], users: VirtualUser[]): Promise<void> {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    // 出力ディレクトリ作成
    await fs.mkdir(this.config.outputDir, { recursive: true });
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // レポートファイル保存
    const reportPath = path.join(this.config.outputDir, `usep-browser-report-${timestamp}.json`);
    await fs.writeFile(reportPath, JSON.stringify({
      config: this.config,
      report,
      browserResults,
      users,
      generatedAt: new Date().toISOString()
    }, null, 2));
    
    // HTMLレポート生成
    const htmlReport = this.generateHTMLReport(report, browserResults);
    const htmlPath = path.join(this.config.outputDir, `usep-browser-report-${timestamp}.html`);
    await fs.writeFile(htmlPath, htmlReport);
    
    console.log(`\n📄 レポート保存完了:`);
    console.log(`  JSON: ${reportPath}`);
    console.log(`  HTML: ${htmlPath}`);
  }

  /**
   * HTMLレポート生成
   */
  private generateHTMLReport(report: any, browserResults: any[]): string {
    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>USEP ブラウザ分析レポート</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 40px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .metric { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
        .metric-value { font-size: 2em; font-weight: bold; color: #007bff; }
        .metric-label { color: #666; margin-top: 8px; }
        .section { margin-bottom: 40px; }
        .device-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
        .device-card { border: 1px solid #ddd; padding: 15px; border-radius: 6px; }
        .improvements { list-style: none; padding: 0; }
        .improvements li { background: #fff3cd; margin: 5px 0; padding: 10px; border-radius: 4px; border-left: 4px solid #ffc107; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 USEP ブラウザ自動化分析レポート</h1>
        <p>生成日時: ${new Date().toLocaleString('ja-JP')}</p>
    </div>
    
    <div class="summary">
        <div class="metric">
            <div class="metric-value">${report.summary.totalUsers}</div>
            <div class="metric-label">テストユーザー数</div>
        </div>
        <div class="metric">
            <div class="metric-value">${report.summary.successRate}%</div>
            <div class="metric-label">成功率</div>
        </div>
        <div class="metric">
            <div class="metric-value">${report.summary.avgLoadTime}ms</div>
            <div class="metric-label">平均読み込み時間</div>
        </div>
        <div class="metric">
            <div class="metric-value">${report.summary.avgA11yScore}</div>
            <div class="metric-label">A11yスコア</div>
        </div>
    </div>
    
    <div class="section">
        <h2>📱 デバイス別分析</h2>
        <div class="device-stats">
            ${report.deviceAnalysis.map((device: any) => `
                <div class="device-card">
                    <h3>${device.device}</h3>
                    <p>テスト数: ${device.count}</p>
                    <p>成功率: ${Math.round(device.successRate * 100)}%</p>
                    <p>平均読み込み: ${Math.round(device.avgLoadTime)}ms</p>
                </div>
            `).join('')}
        </div>
    </div>
    
    <div class="section">
        <h2>🔧 優先改善項目</h2>
        <ol class="improvements">
            ${report.improvementPriorities.slice(0, 10).map((improvement: string) => `
                <li>${improvement}</li>
            `).join('')}
        </ol>
    </div>
    
    <div class="section">
        <h2>💡 実装推奨事項</h2>
        <p>このレポートはUSEPシステムによるシミュレーション結果です。より詳細な分析のために、以下の実装を推奨します：</p>
        <ul>
            <li><strong>Playwright MCP統合</strong>: Claude Codeでの実際のブラウザ自動化</li>
            <li><strong>リアルタイム監視</strong>: 継続的なパフォーマンス測定</li>
            <li><strong>A/Bテスト機能</strong>: 改善効果の定量的測定</li>
            <li><strong>ユーザー行動分析</strong>: 実際のユーザーデータとの比較</li>
        </ul>
    </div>
</body>
</html>`;
  }

  /**
   * ヘルプ表示
   */
  private static showHelp(): void {
    console.log(`
🚀 USEP Browser Automation CLI

使用方法:
  npx ts-node src/usep/cli/browser-usep-cli.ts [オプション]

オプション:
  -s, --service <type>    対象サービス (os-analyzer|future-simulator|strategic-cockpit)
  -u, --users <number>    仮想ユーザー数 (デフォルト: 50)
      --url <url>         テストURL (デフォルト: http://localhost:3333)
  -o, --output <dir>      出力ディレクトリ (デフォルト: ./usep-results)
      --no-browser        ブラウザテストをスキップ
      --performance       パフォーマンス測定を含める
      --a11y              アクセシビリティチェックを含める
      --screenshots       スクリーンショット生成を含める
      --help              このヘルプを表示

例:
  # OS Analyzerの基本テスト
  npx ts-node src/usep/cli/browser-usep-cli.ts -s os-analyzer -u 100

  # 全機能付きテスト
  npx ts-node src/usep/cli/browser-usep-cli.ts --performance --a11y --screenshots

  # Future Simulatorテスト
  npx ts-node src/usep/cli/browser-usep-cli.ts -s future-simulator --url http://localhost:8788
    `);
  }
}

// CLI実行
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    USEPBrowserCLI.showHelp();
    process.exit(0);
  }
  
  const cli = new USEPBrowserCLI();
  cli.run().catch(error => {
    console.error('❌ CLI実行エラー:', error);
    process.exit(1);
  });
}

export default USEPBrowserCLI;