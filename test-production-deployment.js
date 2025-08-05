#!/usr/bin/env node
/**
 * HAQEIアナライザー本番環境デプロイテスト
 * 全ての修正項目を検証し、動作確認を実行
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductionDeploymentTester {
  constructor() {
    this.basePath = '/Users/nakanohideaki/Desktop/haqei-analyzer/public';
    this.results = {
      pathFixTests: [],
      integrationTests: [],
      functionalTests: [],
      errors: [],
      warnings: []
    };
  }

  /**
   * 全テストを実行
   */
  async runAllTests() {
    console.log('🚀 HAQEIアナライザー本番環境デプロイテスト開始\n');
    
    try {
      // 1. スクリプトパス修正の検証
      await this.testScriptPaths();
      
      // 2. 新システム統合の検証
      await this.testSystemIntegration();
      
      // 3. 機能動作の検証
      await this.testFunctionality();
      
      // 4. 結果レポート生成
      this.generateReport();
      
    } catch (error) {
      console.error('❌ テスト実行中にエラー:', error);
      this.results.errors.push(`Test execution error: ${error.message}`);
    }
  }

  /**
   * スクリプトパス修正の検証
   */
  async testScriptPaths() {
    console.log('📂 スクリプトパス修正テスト\n');
    
    const htmlFile = path.join(this.basePath, 'os_analyzer.html');
    
    if (!fs.existsSync(htmlFile)) {
      this.results.errors.push('os_analyzer.html not found');
      return;
    }
    
    const htmlContent = fs.readFileSync(htmlFile, 'utf8');
    
    // パス修正の確認
    const pathTests = [
      { pattern: /src="\/js\//g, name: 'Old /js/ paths', shouldNotExist: true },
      { pattern: /href="css\//g, name: 'Old css/ paths', shouldNotExist: true },
      { pattern: /src="\/public\/js\//g, name: 'New /public/js/ paths', shouldExist: true },
      { pattern: /href="\/public\/css\//g, name: 'New /public/css/ paths', shouldExist: true }
    ];
    
    for (const test of pathTests) {
      const matches = htmlContent.match(test.pattern);
      const matchCount = matches ? matches.length : 0;
      
      if (test.shouldNotExist && matchCount > 0) {
        this.results.pathFixTests.push({
          name: test.name,
          status: 'FAIL',
          message: `Found ${matchCount} instances (should be 0)`,
          matches: matches.slice(0, 5) // 最初の5個を表示
        });
      } else if (test.shouldExist && matchCount === 0) {
        this.results.pathFixTests.push({
          name: test.name,
          status: 'FAIL',
          message: 'No instances found (should exist)'
        });
      } else {
        this.results.pathFixTests.push({
          name: test.name,
          status: 'PASS',
          message: `Found ${matchCount} instances`
        });
      }
    }
    
    // ファイル存在確認
    const criticalFiles = [
      'js/ui/DisplayController.js',
      'js/ui/QuestionManager.js',
      'js/os-analyzer/components/HaqeiQuestionElement.js',
      'js/app.js'
    ];
    
    for (const file of criticalFiles) {
      const filePath = path.join(this.basePath, file);
      const exists = fs.existsSync(filePath);
      
      this.results.pathFixTests.push({
        name: `File exists: ${file}`,
        status: exists ? 'PASS' : 'FAIL',
        message: exists ? 'File found' : 'File missing'
      });
    }
  }

  /**
   * システム統合の検証
   */
  async testSystemIntegration() {
    console.log('🔧 システム統合テスト\n');
    
    // DisplayController.js の検証
    await this.testDisplayController();
    
    // QuestionManager.js の検証
    await this.testQuestionManager();
    
    // HaqeiQuestionElement.js v2.0 の検証
    await this.testHaqeiQuestionElement();
    
    // VirtualQuestionFlow統合の検証
    await this.testVirtualQuestionFlowIntegration();
  }

  async testDisplayController() {
    const filePath = path.join(this.basePath, 'js/ui/DisplayController.js');
    
    if (!fs.existsSync(filePath)) {
      this.results.integrationTests.push({
        name: 'DisplayController',
        status: 'FAIL',
        message: 'File not found'
      });
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    const checks = [
      { pattern: /class DisplayController/, name: 'Class declaration' },
      { pattern: /ensureElementVisible/, name: 'ensureElementVisible method' },
      { pattern: /CSSConflictResolver/, name: 'CSSConflictResolver class' },
      { pattern: /window\.DisplayController/, name: 'Global export' }
    ];
    
    let passCount = 0;
    for (const check of checks) {
      if (content.match(check.pattern)) {
        passCount++;
      }
    }
    
    this.results.integrationTests.push({
      name: 'DisplayController',
      status: passCount === checks.length ? 'PASS' : 'PARTIAL',
      message: `${passCount}/${checks.length} checks passed`
    });
  }

  async testQuestionManager() {
    const filePath = path.join(this.basePath, 'js/ui/QuestionManager.js');
    
    if (!fs.existsSync(filePath)) {
      this.results.integrationTests.push({
        name: 'QuestionManager',
        status: 'FAIL',
        message: 'File not found'
      });
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    const checks = [
      { pattern: /class QuestionManager/, name: 'Class declaration' },
      { pattern: /async initialize/, name: 'Initialize method' },
      { pattern: /showCurrentQuestion/, name: 'Show question method' },
      { pattern: /handleAnswer/, name: 'Answer handling' },
      { pattern: /bunenjin/, name: 'bunenjin philosophy reference' }
    ];
    
    let passCount = 0;
    for (const check of checks) {
      if (content.match(check.pattern)) {
        passCount++;
      }
    }
    
    this.results.integrationTests.push({
      name: 'QuestionManager v2.0',
      status: passCount >= checks.length - 1 ? 'PASS' : 'PARTIAL', // bunenjinは必須ではない
      message: `${passCount}/${checks.length} checks passed`
    });
  }

  async testHaqeiQuestionElement() {
    const filePath = path.join(this.basePath, 'js/os-analyzer/components/HaqeiQuestionElement.js');
    
    if (!fs.existsSync(filePath)) {
      this.results.integrationTests.push({
        name: 'HaqeiQuestionElement',
        status: 'FAIL',
        message: 'File not found'
      });
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    const checks = [
      { pattern: /class HaqeiQuestionElement extends HTMLElement/, name: 'Web Component class' },
      { pattern: /v2\.0/, name: 'Version 2.0 reference' },
      { pattern: /DisplayController/, name: 'DisplayController integration' },
      { pattern: /ensureVisibility/, name: 'Visibility ensuring' },
      { pattern: /customElements\.define/, name: 'Web Component registration' }
    ];
    
    let passCount = 0;
    for (const check of checks) {
      if (content.match(check.pattern)) {
        passCount++;
      }
    }
    
    this.results.integrationTests.push({
      name: 'HaqeiQuestionElement v2.0',
      status: passCount === checks.length ? 'PASS' : 'PARTIAL',
      message: `${passCount}/${checks.length} checks passed`
    });
  }

  async testVirtualQuestionFlowIntegration() {
    const filePath = path.join(this.basePath, 'js/os-analyzer/components/VirtualQuestionFlow.js');
    
    if (!fs.existsSync(filePath)) {
      this.results.integrationTests.push({
        name: 'VirtualQuestionFlow Integration',
        status: 'FAIL',
        message: 'File not found'
      });
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    const checks = [
      { pattern: /QuestionManager.*統合/, name: 'QuestionManager integration comment' },
      { pattern: /this\.questionManager/, name: 'QuestionManager instance' },
      { pattern: /useQuestionManager/, name: 'Use QuestionManager flag' },
      { pattern: /useBuiltInQuestionFlow/, name: 'Fallback method' }
    ];
    
    let passCount = 0;
    for (const check of checks) {
      if (content.match(check.pattern)) {
        passCount++;
      }
    }
    
    this.results.integrationTests.push({
      name: 'VirtualQuestionFlow Integration',
      status: passCount >= 3 ? 'PASS' : 'PARTIAL',
      message: `${passCount}/${checks.length} integration points found`
    });
  }

  /**
   * 機能動作の検証
   */
  async testFunctionality() {
    console.log('⚡ 機能動作テスト\n');
    
    // HTMLファイルの構文確認
    this.validateHTMLStructure();
    
    // JavaScript構文確認
    this.validateJavaScriptSyntax();
    
    //依存関係確認
    this.validateDependencies();
  }

  validateHTMLStructure() {
    const htmlFile = path.join(this.basePath, 'os_analyzer.html');
    const content = fs.readFileSync(htmlFile, 'utf8');
    
    const structureChecks = [
      { pattern: /<haqei-question/i, name: 'HaqeiQuestion Web Component usage' },
      { pattern: /id="questions-container"/, name: 'Questions container' },
      { pattern: /id="welcome-container"/, name: 'Welcome container' },
      { pattern: /id="analysis-container"/, name: 'Analysis container' },
      { pattern: /id="results-container"/, name: 'Results container' }
    ];
    
    for (const check of structureChecks) {
      const found = content.match(check.pattern);
      
      this.results.functionalTests.push({
        name: check.name,
        status: found ? 'PASS' : 'WARN',
        message: found ? 'Found in HTML' : 'Not found in HTML'
      });
    }
  }

  validateJavaScriptSyntax() {
    const jsFiles = [
      'js/ui/DisplayController.js',
      'js/ui/QuestionManager.js',
      'js/app.js'
    ];
    
    for (const file of jsFiles) {
      const filePath = path.join(this.basePath, file);
      
      if (!fs.existsSync(filePath)) continue;
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 基本的な構文チェック
        const syntaxErrors = [];
        
        // 未閉じの波括弧チェック
        const openBraces = (content.match(/\{/g) || []).length;
        const closeBraces = (content.match(/\}/g) || []).length;
        
        if (openBraces !== closeBraces) {
          syntaxErrors.push(`Unmatched braces: ${openBraces} open, ${closeBraces} close`);
        }
        
        // 未閉じの括弧チェック
        const openParens = (content.match(/\(/g) || []).length;
        const closeParens = (content.match(/\)/g) || []).length;
        
        if (openParens !== closeParens) {
          syntaxErrors.push(`Unmatched parentheses: ${openParens} open, ${closeParens} close`);
        }
        
        this.results.functionalTests.push({
          name: `Syntax: ${file}`,
          status: syntaxErrors.length === 0 ? 'PASS' : 'FAIL',
          message: syntaxErrors.length === 0 ? 'No syntax errors' : syntaxErrors.join(', ')
        });
        
      } catch (error) {
        this.results.functionalTests.push({
          name: `Syntax: ${file}`,
          status: 'FAIL',
          message: `Read error: ${error.message}`
        });
      }
    }
  }

  validateDependencies() {
    const htmlFile = path.join(this.basePath, 'os_analyzer.html');
    const content = fs.readFileSync(htmlFile, 'utf8');
    
    // スクリプト読み込み順序の確認
    const scriptOrder = [
      'BaseComponent.js',
      'DisplayController.js', 
      'QuestionManager.js',
      'HaqeiQuestionElement.js',
      'VirtualQuestionFlow.js',
      'app.js'
    ];
    
    let lastIndex = -1;
    let orderValid = true;
    
    for (const script of scriptOrder) {
      const regex = new RegExp(`src="[^"]*${script.replace('.', '\\.')}"`, 'i');
      const match = content.search(regex);
      
      if (match !== -1) {
        if (match < lastIndex) {
          orderValid = false;
          break;
        }
        lastIndex = match;
      }
    }
    
    this.results.functionalTests.push({
      name: 'Script loading order',
      status: orderValid ? 'PASS' : 'WARN',
      message: orderValid ? 'Dependencies loaded in correct order' : 'Script order may cause issues'
    });
  }

  /**
   * 結果レポート生成
   */
  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 HAQEIアナライザー本番環境デプロイテスト結果');
    console.log('='.repeat(60));
    
    // スクリプトパス修正結果
    console.log('\n📂 スクリプトパス修正テスト:');
    this.printTestResults(this.results.pathFixTests);
    
    // システム統合結果
    console.log('\n🔧 システム統合テスト:');
    this.printTestResults(this.results.integrationTests);
    
    // 機能動作結果
    console.log('\n⚡ 機能動作テスト:');
    this.printTestResults(this.results.functionalTests);
    
    // エラー・警告
    if (this.results.errors.length > 0) {
      console.log('\n❌ エラー:');
      this.results.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    if (this.results.warnings.length > 0) {
      console.log('\n⚠️ 警告:');
      this.results.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    
    // 総合評価
    const totalTests = [
      ...this.results.pathFixTests,
      ...this.results.integrationTests,
      ...this.results.functionalTests
    ];
    
    const passCount = totalTests.filter(t => t.status === 'PASS').length;
    const partialCount = totalTests.filter(t => t.status === 'PARTIAL').length;
    const failCount = totalTests.filter(t => t.status === 'FAIL').length;
    
    console.log('\n' + '='.repeat(60));
    console.log('📈 総合結果:');
    console.log(`  ✅ PASS:    ${passCount}`);
    console.log(`  ⚠️ PARTIAL: ${partialCount}`);
    console.log(`  ❌ FAIL:    ${failCount}`);
    console.log(`  📊 成功率:   ${Math.round((passCount / totalTests.length) * 100)}%`);
    
    const overallStatus = failCount === 0 ? 
      (partialCount === 0 ? '🎉 完全成功' : '✅ 概ね成功') : 
      '⚠️ 要修正';
    
    console.log(`\n${overallStatus}: 本番環境デプロイ準備状況`);
    
    if (failCount === 0 && partialCount <= 2) {
      console.log('\n🚀 デプロイ推奨: 本番環境への移行が可能です');
    } else {
      console.log('\n🔧 修正推奨: いくつかの問題を解決してからデプロイしてください');
    }
    
    console.log('='.repeat(60));
  }

  printTestResults(tests) {
    for (const test of tests) {
      const icon = test.status === 'PASS' ? '✅' : 
                   test.status === 'PARTIAL' ? '⚠️' : '❌';
      console.log(`  ${icon} ${test.name}: ${test.message}`);
      
      if (test.matches && test.matches.length > 0) {
        test.matches.forEach(match => {
          console.log(`      → ${match}`);
        });
      }
    }
  }
}

// テスト実行
const tester = new ProductionDeploymentTester();
tester.runAllTests().catch(console.error);

export default ProductionDeploymentTester;