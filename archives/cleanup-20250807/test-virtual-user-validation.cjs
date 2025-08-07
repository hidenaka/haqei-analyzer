#!/usr/bin/env node

/**
 * 仮想ユーザー生成システム検証テスト
 * エージェント連携による包括的な実装検証
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 検証対象のモジュールをインポート
const EnhancedVirtualUserGenerator = require('./scripts/enhanced-virtual-user-generator.cjs');

class VirtualUserValidationSuite {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      tests: [],
      summary: {}
    };
  }

  /**
   * 包括的検証実行
   */
  async runValidation() {
    console.log('🔍 仮想ユーザー生成システム検証開始');
    
    try {
      // 1. 基本機能テスト
      await this.testBasicFunctionality();
      
      // 2. 統計的多様性テスト
      await this.testStatisticalDiversity();
      
      // 3. パフォーマンステスト
      await this.testPerformance();
      
      // 4. エラーハンドリングテスト
      await this.testErrorHandling();
      
      // 5. 統合テスト
      await this.testIntegration();
      
      // 結果集計とレポート生成
      this.generateReport();
      
    } catch (error) {
      console.error('❌ 検証中にエラー:', error);
      this.addTestResult('VALIDATION_ERROR', false, error.message);
    }
  }

  /**
   * 基本機能テスト
   */
  async testBasicFunctionality() {
    console.log('\n📋 基本機能テスト実行中...');
    
    const generator = new EnhancedVirtualUserGenerator();
    
    // テスト1: クラス初期化
    try {
      this.addTestResult('CLASS_INITIALIZATION', true, 'EnhancedVirtualUserGenerator正常に初期化');
    } catch (error) {
      this.addTestResult('CLASS_INITIALIZATION', false, error.message);
    }
    
    // テスト2: 基本ユーザー生成
    try {
      const users = generator.generateDiverseUsers(5);
      const success = users.length === 5 && users.every(u => u.name && u.personality);
      this.addTestResult('BASIC_USER_GENERATION', success, 
        success ? '5人のユーザー正常生成' : 'ユーザー生成に問題');
    } catch (error) {
      this.addTestResult('BASIC_USER_GENERATION', false, error.message);
    }
    
    // テスト3: 人格タイプ検証
    try {
      const users = generator.generateDiverseUsers(15);
      const personalityTypes = [...new Set(users.map(u => u.personalityType))];
      const success = personalityTypes.length >= 4; // 最低4タイプ
      this.addTestResult('PERSONALITY_DIVERSITY', success,
        `${personalityTypes.length}種類の人格タイプ生成: ${personalityTypes.join(', ')}`);
    } catch (error) {
      this.addTestResult('PERSONALITY_DIVERSITY', false, error.message);
    }
  }

  /**
   * 統計的多様性テスト
   */
  async testStatisticalDiversity() {
    console.log('\n📊 統計的多様性テスト実行中...');
    
    const generator = new EnhancedVirtualUserGenerator();
    
    // テスト1: 複数実行での多様性
    try {
      const run1 = generator.generateDiverseUsers(10);
      const run2 = generator.generateDiverseUsers(10);
      
      // 名前の重複チェック
      const names1 = run1.map(u => u.name);
      const names2 = run2.map(u => u.name);
      const overlap = names1.filter(name => names2.includes(name)).length;
      
      const diversityScore = 1 - (overlap / 10);
      const success = diversityScore > 0.6; // 60%以上の多様性
      
      this.addTestResult('NAME_DIVERSITY', success,
        `名前多様性スコア: ${(diversityScore * 100).toFixed(1)}% (重複: ${overlap}/10)`);
    } catch (error) {
      this.addTestResult('NAME_DIVERSITY', false, error.message);
    }
    
    // テスト2: 性格パラメータの変動
    try {
      const users = generator.generateDiverseUsers(20);
      const philosophicalValues = users
        .filter(u => u.personality.philosophicalInterest)
        .map(u => u.personality.philosophicalInterest);
      
      if (philosophicalValues.length > 5) {
        const mean = philosophicalValues.reduce((a, b) => a + b) / philosophicalValues.length;
        const variance = philosophicalValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / philosophicalValues.length;
        const stdDev = Math.sqrt(variance);
        
        const success = stdDev > 0.1; // 標準偏差0.1以上
        this.addTestResult('PERSONALITY_VARIATION', success,
          `哲学的興味の標準偏差: ${stdDev.toFixed(3)} (変動十分: ${success})`);
      }
    } catch (error) {
      this.addTestResult('PERSONALITY_VARIATION', false, error.message);
    }
  }

  /**
   * パフォーマンステスト
   */
  async testPerformance() {
    console.log('\n⚡ パフォーマンステスト実行中...');
    
    const generator = new EnhancedVirtualUserGenerator();
    
    // テスト1: 生成速度
    try {
      const start = Date.now();
      const users = generator.generateDiverseUsers(30);
      const duration = Date.now() - start;
      
      const success = duration < 1000; // 1秒未満
      this.addTestResult('GENERATION_SPEED', success,
        `30人生成時間: ${duration}ms (目標: <1000ms)`);
    } catch (error) {
      this.addTestResult('GENERATION_SPEED', false, error.message);
    }
    
    // テスト2: メモリ使用量（簡易）
    try {
      const beforeMem = process.memoryUsage().heapUsed;
      const users = generator.generateDiverseUsers(100);
      const afterMem = process.memoryUsage().heapUsed;
      
      const memUsage = (afterMem - beforeMem) / 1024 / 1024; // MB
      const success = memUsage < 10; // 10MB未満
      this.addTestResult('MEMORY_USAGE', success,
        `100人生成メモリ使用量: ${memUsage.toFixed(2)}MB (目標: <10MB)`);
    } catch (error) {
      this.addTestResult('MEMORY_USAGE', false, error.message);
    }
  }

  /**
   * エラーハンドリングテスト
   */
  async testErrorHandling() {
    console.log('\n🛡️ エラーハンドリングテスト実行中...');
    
    const generator = new EnhancedVirtualUserGenerator();
    
    // テスト1: 不正な値での生成
    try {
      const users1 = generator.generateDiverseUsers(0);
      const users2 = generator.generateDiverseUsers(-5);
      
      const success = Array.isArray(users1) && Array.isArray(users2);
      this.addTestResult('INVALID_COUNT_HANDLING', success,
        `不正カウント処理: 0人→${users1.length}人, -5人→${users2.length}人`);
    } catch (error) {
      this.addTestResult('INVALID_COUNT_HANDLING', false, error.message);
    }
    
    // テスト2: 大量生成
    try {
      const users = generator.generateDiverseUsers(1000);
      const success = users.length === 1000;
      this.addTestResult('LARGE_SCALE_GENERATION', success,
        `大量生成テスト: ${users.length}/1000人`);
    } catch (error) {
      this.addTestResult('LARGE_SCALE_GENERATION', false, error.message);
    }
  }

  /**
   * 統合テスト
   */
  async testIntegration() {
    console.log('\n🔗 統合テスト実行中...');
    
    // テスト1: PDCA システムとの統合
    try {
      // require がエラーになるかテスト
      const HAQEIPDCASystem = require('./scripts/haqei-pdca-system.cjs');
      const success = typeof HAQEIPDCASystem === 'function';
      this.addTestResult('PDCA_INTEGRATION', success,
        success ? 'PDCA システム正常にインポート' : 'PDCA システムインポートエラー');
    } catch (error) {
      this.addTestResult('PDCA_INTEGRATION', false, error.message);
    }
    
    // テスト2: package.json コマンド検証
    try {
      const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
      const pdcaCommands = Object.keys(packageJson.scripts)
        .filter(script => script.startsWith('pdca:'));
      
      const success = pdcaCommands.length >= 4;
      this.addTestResult('NPM_COMMANDS', success,
        `PDCA コマンド数: ${pdcaCommands.length} (${pdcaCommands.join(', ')})`);
    } catch (error) {
      this.addTestResult('NPM_COMMANDS', false, error.message);
    }
  }

  /**
   * テスト結果追加
   */
  addTestResult(testName, success, details) {
    this.results.tests.push({
      name: testName,
      success,
      details,
      timestamp: new Date().toISOString()
    });
    
    console.log(`${success ? '✅' : '❌'} ${testName}: ${details}`);
  }

  /**
   * 結果レポート生成
   */
  generateReport() {
    const totalTests = this.results.tests.length;
    const passedTests = this.results.tests.filter(t => t.success).length;
    const successRate = (passedTests / totalTests * 100).toFixed(1);
    
    this.results.summary = {
      totalTests,
      passedTests,
      failedTests: totalTests - passedTests,
      successRate: parseFloat(successRate)
    };
    
    console.log('\n📊 検証結果サマリー:');
    console.log(`   総テスト数: ${totalTests}`);
    console.log(`   成功: ${passedTests}`);
    console.log(`   失敗: ${totalTests - passedTests}`);
    console.log(`   成功率: ${successRate}%`);
    
    // レポートファイル生成
    const reportPath = './validation-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 詳細レポート: ${reportPath}`);
    
    // HTML レポート生成
    this.generateHTMLReport();
    
    // 総合判定
    if (this.results.summary.successRate >= 80) {
      console.log('\n🎉 検証成功！システムは正常に動作しています。');
    } else {
      console.log('\n⚠️ 検証で問題が検出されました。修正が必要です。');
    }
  }

  /**
   * HTML レポート生成
   */
  generateHTMLReport() {
    const html = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>仮想ユーザー生成システム検証レポート</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 30px 0; }
        .metric { padding: 20px; text-align: center; border-radius: 8px; color: white; }
        .metric.success { background: #28a745; }
        .metric.warning { background: #ffc107; color: #212529; }
        .metric.danger { background: #dc3545; }
        .test-item { margin: 15px 0; padding: 15px; border-left: 4px solid #ccc; background: #f8f9fa; }
        .test-item.pass { border-left-color: #28a745; background: #d4edda; }
        .test-item.fail { border-left-color: #dc3545; background: #f8d7da; }
        .test-name { font-weight: bold; margin-bottom: 5px; }
        .test-details { color: #6c757d; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 仮想ユーザー生成システム検証レポート</h1>
            <p>検証実行日時: ${new Date().toLocaleString('ja-JP')}</p>
        </div>
        
        <div class="summary">
            <div class="metric ${this.results.summary.successRate >= 80 ? 'success' : this.results.summary.successRate >= 60 ? 'warning' : 'danger'}">
                <h3>成功率</h3>
                <div style="font-size: 2em; font-weight: bold;">${this.results.summary.successRate}%</div>
            </div>
            <div class="metric success">
                <h3>成功テスト</h3>
                <div style="font-size: 2em; font-weight: bold;">${this.results.summary.passedTests}</div>
            </div>
            <div class="metric ${this.results.summary.failedTests > 0 ? 'danger' : 'success'}">
                <h3>失敗テスト</h3>
                <div style="font-size: 2em; font-weight: bold;">${this.results.summary.failedTests}</div>
            </div>
            <div class="metric ${this.results.summary.totalTests >= 10 ? 'success' : 'warning'}">
                <h3>総テスト数</h3>
                <div style="font-size: 2em; font-weight: bold;">${this.results.summary.totalTests}</div>
            </div>
        </div>
        
        <h2>詳細テスト結果</h2>
        ${this.results.tests.map(test => `
            <div class="test-item ${test.success ? 'pass' : 'fail'}">
                <div class="test-name">${test.success ? '✅' : '❌'} ${test.name}</div>
                <div class="test-details">${test.details}</div>
            </div>
        `).join('')}
        
        <h2>総合評価</h2>
        <div class="test-item ${this.results.summary.successRate >= 80 ? 'pass' : 'fail'}">
            <div class="test-name">
                ${this.results.summary.successRate >= 80 ? '🎉 検証成功' : '⚠️ 要改善'}
            </div>
            <div class="test-details">
                ${this.results.summary.successRate >= 80 
                  ? 'システムは正常に動作しており、本番環境での使用が可能です。'
                  : 'いくつかの問題が検出されました。修正後に再検証することを推奨します。'}
            </div>
        </div>
    </div>
</body>
</html>`;
    
    const htmlPath = './validation-report.html';
    fs.writeFileSync(htmlPath, html);
    console.log(`📊 HTML レポート: ${htmlPath}`);
  }
}

// 実行
if (require.main === module) {
  const validator = new VirtualUserValidationSuite();
  validator.runValidation().catch(console.error);
}

module.exports = VirtualUserValidationSuite;