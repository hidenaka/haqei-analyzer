/**
 * Future Simulator 状況卦精度向上システム実装検証
 * QA Tester による包括的テスト実行
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🎯 Future Simulator 状況卦精度向上システム実装検証開始');

class FutureSimulatorValidator {
  constructor() {
    this.testResults = [];
    this.startTime = Date.now();
  }

  /**
   * HTMLファイル構造検証
   */
  validateHTMLStructure() {
    console.log('\n📋 HTMLファイル構造検証中...');
    
    const filePath = path.join(__dirname, 'public', 'future_simulator.html');
    
    if (!fs.existsSync(filePath)) {
      this.addTestResult('HTMLファイル存在確認', false, 'ファイルが見つかりません');
      return;
    }
    
    const fileStats = fs.statSync(filePath);
    const fileSizeKB = Math.round(fileStats.size / 1024);
    
    this.addTestResult('HTMLファイル存在確認', true, `ファイルサイズ: ${fileSizeKB}KB`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 重要システムの存在確認
    const systemChecks = [
      { name: '8分類コンテキストシステム', pattern: /ENHANCED_CONTEXT_TYPES.*=.*\{/s },
      { name: 'analyzeContextType関数', pattern: /function analyzeContextType\(text\)/ },
      { name: 'DynamicKeywordGeneratorクラス', pattern: /class DynamicKeywordGenerator/ },
      { name: 'IrregularPatternDetectorクラス', pattern: /class IrregularPatternDetector/ },
      { name: 'IntegratedAnalysisEngineクラス', pattern: /class IntegratedAnalysisEngine/ },
      { name: 'callAIAssistant統合', pattern: /async function callAIAssistant/ },
      { name: 'kuromoji.js統合', pattern: /kuromoji\.js|kuromojiTokenizer/ }
    ];
    
    systemChecks.forEach(check => {
      const found = check.pattern.test(content);
      this.addTestResult(check.name, found, found ? '実装確認' : '実装なし');
    });
    
    return content;
  }

  /**
   * コンテキスト分析システム検証
   */
  validateContextSystem(content) {
    console.log('\n🔍 8分類コンテキストシステム検証中...');
    
    // コンテキストタイプの確認
    const contextTypes = ['personal', 'social', 'relationship', 'business', 'philosophical', 'technical', 'temporal', 'hybrid'];
    
    contextTypes.forEach(type => {
      const pattern = new RegExp(`${type}:\\s*\\{`, 'g');
      const found = pattern.test(content);
      this.addTestResult(`コンテキスト「${type}」定義`, found, found ? '定義確認' : '定義なし');
    });
    
    // キーワード構造の確認
    const keywordStructures = ['primary', 'secondary', 'emotional', 'crisis', 'strategic', 'abstract', 'academic', 'temporal'];
    
    keywordStructures.forEach(structure => {
      const pattern = new RegExp(`${structure}:\\s*\\[`, 'g');
      const found = pattern.test(content);
      this.addTestResult(`キーワード構造「${structure}」`, found, found ? '構造確認' : '構造なし');
    });
  }

  /**
   * 動的キーワード生成システム検証
   */
  validateDynamicKeywordSystem(content) {
    console.log('\n🔤 動的キーワード生成システム検証中...');
    
    const methods = [
      'generateDynamicKeywords',
      'extractKeywordsFromTokens', 
      'getRelatedWords',
      'generateStemRelated',
      'generateEmotionalKeywords',
      'basicKeywordExpansion'
    ];
    
    methods.forEach(method => {
      const pattern = new RegExp(`${method}\\s*\\([^)]*\\)\\s*\\{`, 'g');
      const found = pattern.test(content);
      this.addTestResult(`動的キーワード「${method}」メソッド`, found, found ? 'メソッド確認' : 'メソッドなし');
    });
    
    // 関連語マッピング辞書の確認
    const semanticRelationsCheck = /semanticRelations.*=.*this\.initializeSemanticRelations\(\)/.test(content);
    this.addTestResult('関連語マッピング辞書', semanticRelationsCheck, semanticRelationsCheck ? '辞書確認' : '辞書なし');
    
    // 感情強度マッピングの確認
    const emotionalIntensityCheck = /emotionalIntensity.*=.*this\.initializeEmotionalIntensity\(\)/.test(content);
    this.addTestResult('感情強度マッピング', emotionalIntensityCheck, emotionalIntensityCheck ? 'マッピング確認' : 'マッピングなし');
  }

  /**
   * イレギュラー検出システム検証
   */
  validateIrregularDetectionSystem(content) {
    console.log('\n⚠️ イレギュラー検出システム検証中...');
    
    const patternCategories = ['emotional_extreme', 'language_patterns', 'content_patterns', 'context_patterns'];
    
    patternCategories.forEach(category => {
      const pattern = new RegExp(`${category}:\\s*\\{`, 'g');
      const found = pattern.test(content);
      this.addTestResult(`イレギュラーパターン「${category}」`, found, found ? 'パターン確認' : 'パターンなし');
    });
    
    // 15種類の異常パターン検出の確認
    const irregularPatterns = [
      'too_emotional_positive', 'too_emotional_negative', 'too_cold', 'excessive_caps',
      'too_short', 'too_long', 'dialect_heavy', 'slang_heavy', 'repetitive_words',
      'too_abstract', 'too_concrete', 'time_unclear', 'no_emotion_context', 'question_heavy',
      'mixed_languages', 'professional_jargon', 'contradictions'
    ];
    
    let detectedPatterns = 0;
    irregularPatterns.forEach(pattern => {
      if (content.includes(pattern)) {
        detectedPatterns++;
      }
    });
    
    this.addTestResult('15種類異常パターン検出', detectedPatterns >= 15, `検出パターン数: ${detectedPatterns}/17`);
  }

  /**
   * 統合分析エンジン検証
   */
  validateIntegratedAnalysisEngine(content) {
    console.log('\n🚀 統合分析エンジン検証中...');
    
    const engineMethods = [
      'performIntegratedAnalysis',
      'performMultiLayerMatching',
      'calculateIntegratedScore',
      'generateAlternatives',
      'generateDetailedReasoning',
      'generateFallbackResult'
    ];
    
    engineMethods.forEach(method => {
      const pattern = new RegExp(`${method}\\s*\\([^)]*\\)\\s*\\{`, 'g');
      const found = pattern.test(content);
      this.addTestResult(`統合エンジン「${method}」メソッド`, found, found ? 'メソッド確認' : 'メソッドなし');
    });
    
    // 7段階処理システムの確認
    const phases = ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5', 'Phase 6', 'Phase 7'];
    let phaseCount = 0;
    
    phases.forEach(phase => {
      if (content.includes(phase)) {
        phaseCount++;
      }
    });
    
    this.addTestResult('7段階処理システム', phaseCount >= 7, `確認段階数: ${phaseCount}/7`);
  }

  /**
   * callAIAssistant統合検証
   */
  validateCallAIAssistantIntegration(content) {
    console.log('\n🔗 callAIAssistant統合検証中...');
    
    const integrationChecks = [
      { name: 'integratedEngine初期化', pattern: /integratedEngine.*=.*new IntegratedAnalysisEngine/ },
      { name: 'performIntegratedAnalysis呼び出し', pattern: /performIntegratedAnalysis\s*\(/ },
      { name: '統合分析結果処理', pattern: /analysisResult.*=.*await.*performIntegratedAnalysis/ },
      { name: 'イレギュラー検出結果活用', pattern: /inputAdvice.*show/ },
      { name: '代替候補表示機能', pattern: /alternatives.*length.*>.*0/ },
      { name: 'エラーハンドリング', pattern: /catch.*error.*統合分析エラー/ }
    ];
    
    integrationChecks.forEach(check => {
      const found = check.pattern.test(content);
      this.addTestResult(check.name, found, found ? '統合確認' : '統合なし');
    });
  }

  /**
   * パフォーマンス・最適化機能検証
   */
  validatePerformanceOptimizations(content) {
    console.log('\n⚡ パフォーマンス・最適化機能検証中...');
    
    const optimizations = [
      { name: 'キャッシュシステム（関連語）', pattern: /relationCache.*=.*new Map/ },
      { name: 'キャッシュシステム（語幹）', pattern: /stemCache.*=.*new Map/ },
      { name: 'キャッシュシステム（分析結果）', pattern: /analysisCache.*=.*new Map/ },
      { name: 'キャッシュサイズ制限', pattern: /maxCacheSize.*=.*\d+/ },
      { name: 'キャッシュ管理機能', pattern: /if.*Cache\.size.*>=.*maxCacheSize/ },
      { name: '重複除去処理', pattern: /\.\.\.\s*new Set\(.*\)/ }
    ];
    
    optimizations.forEach(opt => {
      const found = opt.pattern.test(content);
      this.addTestResult(opt.name, found, found ? '最適化確認' : '最適化なし');
    });
  }

  /**
   * テスト結果記録
   */
  addTestResult(testName, passed, details) {
    this.testResults.push({
      name: testName,
      passed,
      details,
      timestamp: new Date().toISOString()
    });
    
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${testName}: ${details}`);
  }

  /**
   * 総合レポート生成
   */
  generateReport() {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    const successRate = Math.round((passedTests / totalTests) * 100);
    const executionTime = Date.now() - this.startTime;
    
    console.log('\n' + '='.repeat(80));
    console.log('🎯 Future Simulator 状況卦精度向上システム実装検証レポート');
    console.log('='.repeat(80));
    console.log(`📊 テスト総数: ${totalTests}`);
    console.log(`✅ 成功: ${passedTests}`);
    console.log(`❌ 失敗: ${failedTests}`);
    console.log(`📈 成功率: ${successRate}%`);
    console.log(`⏱️ 実行時間: ${executionTime}ms`);
    console.log('='.repeat(80));
    
    if (failedTests > 0) {
      console.log('\n❌ 失敗したテスト:');
      this.testResults.filter(r => !r.passed).forEach(result => {
        console.log(`  • ${result.name}: ${result.details}`);
      });
    }
    
    // システム別成功率
    const systemCategories = {
      'HTML構造': ['HTMLファイル存在確認'],
      'コンテキスト分析': this.testResults.filter(r => r.name.includes('コンテキスト')).map(r => r.name),
      '動的キーワード': this.testResults.filter(r => r.name.includes('動的キーワード')).map(r => r.name),
      'イレギュラー検出': this.testResults.filter(r => r.name.includes('イレギュラー')).map(r => r.name),
      '統合分析': this.testResults.filter(r => r.name.includes('統合')).map(r => r.name),
      'パフォーマンス': this.testResults.filter(r => r.name.includes('キャッシュ') || r.name.includes('最適化')).map(r => r.name)
    };
    
    console.log('\n📋 システム別成功率:');
    Object.entries(systemCategories).forEach(([category, tests]) => {
      if (tests.length > 0) {
        const categoryResults = this.testResults.filter(r => tests.includes(r.name));
        const categoryPassed = categoryResults.filter(r => r.passed).length;
        const categoryRate = Math.round((categoryPassed / categoryResults.length) * 100);
        console.log(`  ${category}: ${categoryPassed}/${categoryResults.length} (${categoryRate}%)`);
      }
    });
    
    console.log('\n🎯 検証結論:');
    if (successRate >= 90) {
      console.log('✅ 実装品質: 優秀 - 本格運用可能');
    } else if (successRate >= 75) {
      console.log('⚠️ 実装品質: 良好 - 軽微な改善が推奨');
    } else if (successRate >= 60) {
      console.log('🔧 実装品質: 要改善 - 重要な問題の修正が必要');
    } else {
      console.log('❌ 実装品質: 不十分 - 大幅な修正が必要');
    }
    
    return {
      totalTests,
      passedTests,
      failedTests,
      successRate,
      executionTime,
      status: successRate >= 75 ? 'PASS' : 'FAIL'
    };
  }

  /**
   * メイン検証実行
   */
  async run() {
    try {
      console.log('🚀 Future Simulator 状況卦精度向上システム実装検証開始');
      
      const content = this.validateHTMLStructure();
      if (!content) {
        console.error('❌ HTMLファイルの読み込みに失敗しました');
        return;
      }
      
      this.validateContextSystem(content);
      this.validateDynamicKeywordSystem(content);
      this.validateIrregularDetectionSystem(content);
      this.validateIntegratedAnalysisEngine(content);
      this.validateCallAIAssistantIntegration(content);
      this.validatePerformanceOptimizations(content);
      
      const report = this.generateReport();
      
      // JSONレポート出力
      const reportData = {
        timestamp: new Date().toISOString(),
        summary: report,
        details: this.testResults
      };
      
      fs.writeFileSync('future-simulator-validation-report.json', JSON.stringify(reportData, null, 2));
      console.log('\n📄 詳細レポートを future-simulator-validation-report.json に出力しました');
      
      return report;
      
    } catch (error) {
      console.error('❌ 検証実行エラー:', error);
      throw error;
    }
  }
}

// 検証実行
const validator = new FutureSimulatorValidator();
validator.run().then(result => {
  console.log(`\n🎯 検証完了: ${result.status}`);
  process.exit(result.status === 'PASS' ? 0 : 1);
}).catch(error => {
  console.error('検証失敗:', error);
  process.exit(1);
});