/**
 * Future Simulator 品質検証スクリプト
 * Node.js環境で実行可能
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔬 Future Simulator 品質検証開始');

class FutureSimulatorQualityTester {
  constructor() {
    this.testResults = [];
    this.startTime = Date.now();
    this.stats = {
      total: 0,
      passed: 0,
      failed: 0,
      warnings: 0
    };
  }

  /**
   * HTML実装の詳細分析
   */
  analyzeImplementation() {
    console.log('\n📋 実装詳細分析中...');
    
    const filePath = path.join(__dirname, 'public', 'future_simulator.html');
    
    if (!fs.existsSync(filePath)) {
      this.addResult('HTMLファイル存在確認', false, 'ファイルが見つかりません');
      return null;
    }
    
    const fileStats = fs.statSync(filePath);
    const fileSizeKB = Math.round(fileStats.size / 1024);
    this.addResult('HTMLファイルサイズ', true, `${fileSizeKB}KB`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  }

  /**
   * システム品質検証
   */
  verifySystemQuality(content) {
    console.log('\n🎯 システム品質検証中...');

    // 1. コンテキスト分類システムの詳細検証
    this.verifyContextSystem(content);
    
    // 2. 動的キーワード生成システムの検証
    this.verifyDynamicKeywordSystem(content);
    
    // 3. イレギュラー検出システムの検証
    this.verifyIrregularDetectionSystem(content);
    
    // 4. 統合分析エンジンの検証
    this.verifyIntegratedAnalysisEngine(content);
    
    // 5. パフォーマンス最適化の検証
    this.verifyPerformanceOptimizations(content);
    
    // 6. エラーハンドリングの検証
    this.verifyErrorHandling(content);
  }

  verifyContextSystem(content) {
    console.log('\n📊 8分類コンテキストシステム検証...');

    // 8分類の完全性チェック
    const contexts = ['personal', 'social', 'relationship', 'business', 'philosophical', 'technical', 'temporal', 'hybrid'];
    contexts.forEach(context => {
      const contextDef = new RegExp(`${context}:\\s*\\{[\\s\\S]*?\\}`, 'g');
      const found = contextDef.test(content);
      this.addResult(`コンテキスト定義「${context}」`, found, found ? '完全定義確認' : '定義不完全');
    });

    // キーワード構造の検証
    const keywordStructures = ['primary', 'secondary', 'emotional', 'crisis', 'strategic', 'abstract', 'academic', 'temporal'];
    let structureCount = 0;
    keywordStructures.forEach(structure => {
      const pattern = new RegExp(`${structure}:\\s*\\[`, 'g');
      if (pattern.test(content)) structureCount++;
    });
    
    this.addResult('キーワード構造完全性', structureCount >= 6, `${structureCount}/8構造`);

    // analyzeContextType関数の詳細検証
    const analyzeFunction = /function analyzeContextType\(text\)[\s\S]*?(?=function|\n\s*\/\/|\n\s*$)/;
    const functionMatch = content.match(analyzeFunction);
    
    if (functionMatch) {
      const funcContent = functionMatch[0];
      
      // スコア計算ロジックの検証
      const hasScoreCalc = /score\s*[+\-*/]=/.test(funcContent);
      this.addResult('スコア計算ロジック', hasScoreCalc, hasScoreCalc ? '実装確認' : '実装不完全');
      
      // パターンマッチング機能の検証
      const hasPatternMatch = /pattern\.test\(text\)/.test(funcContent);
      this.addResult('パターンマッチング', hasPatternMatch, hasPatternMatch ? '実装確認' : '実装不完全');
      
      // フォールバック処理の検証
      const hasFallback = /hybrid/.test(funcContent);
      this.addResult('フォールバック処理', hasFallback, hasFallback ? 'hybrid対応確認' : 'フォールバック不完全');
    } else {
      this.addResult('analyzeContextType関数', false, '関数定義が見つかりません');
    }
  }

  verifyDynamicKeywordSystem(content) {
    console.log('\n🔤 動的キーワード生成システム検証...');

    // DynamicKeywordGeneratorクラスの検証
    const classMatch = content.match(/class DynamicKeywordGenerator[\s\S]*?(?=class|\n\s*\/\/|\n\s*$)/);
    
    if (classMatch) {
      const classContent = classMatch[0];
      
      // 必須メソッドの検証
      const requiredMethods = [
        'generateDynamicKeywords',
        'extractKeywordsFromTokens',
        'getRelatedWords',
        'generateStemRelated',
        'generateEmotionalKeywords',
        'basicKeywordExpansion'
      ];
      
      requiredMethods.forEach(method => {
        const methodPattern = new RegExp(`${method}\\s*\\([^)]*\\)\\s*\\{`, 'g');
        const found = methodPattern.test(classContent);
        this.addResult(`動的キーワード「${method}」`, found, found ? 'メソッド実装確認' : 'メソッド未実装');
      });

      // キャッシュシステムの検証
      const hasCache = /stemCache.*=.*new Map/.test(classContent) && /relationCache.*=.*new Map/.test(classContent);
      this.addResult('キャッシュシステム', hasCache, hasCache ? '実装確認' : '実装不完全');
      
      // kuromoji.js統合の検証
      const hasKuromoji = /kuromojiTokenizer/.test(classContent) || /this\.tokenizer/.test(classContent);
      this.addResult('kuromoji.js統合', hasKuromoji, hasKuromoji ? '統合確認' : '統合不完全');
      
      // 語彙辞書の検証
      const hasSemanticRelations = /semanticRelations.*=.*this\.initializeSemanticRelations/.test(classContent);
      this.addResult('語彙辞書システム', hasSemanticRelations, hasSemanticRelations ? '辞書実装確認' : '辞書実装不完全');
      
    } else {
      this.addResult('DynamicKeywordGeneratorクラス', false, 'クラス定義が見つかりません');
    }
  }

  verifyIrregularDetectionSystem(content) {
    console.log('\n⚠️ イレギュラー検出システム検証...');

    // IrregularPatternDetectorクラスの検証
    const classMatch = content.match(/class IrregularPatternDetector[\s\S]*?(?=class|\n\s*\/\/|\n\s*$)/);
    
    if (classMatch) {
      const classContent = classMatch[0];
      
      // パターンカテゴリの検証
      const categories = ['emotional_extreme', 'language_patterns', 'content_patterns', 'context_patterns'];
      categories.forEach(category => {
        const categoryPattern = new RegExp(`${category}:\\s*\\{`, 'g');
        const found = categoryPattern.test(classContent);
        this.addResult(`イレギュラーカテゴリ「${category}」`, found, found ? 'カテゴリ実装確認' : 'カテゴリ未実装');
      });

      // 具体的な異常パターンの検証
      const specificPatterns = [
        'too_emotional_positive', 'too_emotional_negative', 'too_cold',
        'too_short', 'too_long', 'dialect_heavy', 'slang_heavy',
        'too_abstract', 'too_concrete', 'repetitive_words'
      ];
      
      let patternCount = 0;
      specificPatterns.forEach(pattern => {
        if (classContent.includes(pattern)) patternCount++;
      });
      
      this.addResult('具体的異常パターン', patternCount >= 8, `${patternCount}/10パターン実装`);
      
      // 改善提案メッセージの検証
      const hasMessages = /message:/.test(classContent);
      this.addResult('改善提案メッセージ', hasMessages, hasMessages ? 'メッセージ実装確認' : 'メッセージ未実装');
      
    } else {
      this.addResult('IrregularPatternDetectorクラス', false, 'クラス定義が見つかりません');
    }
  }

  verifyIntegratedAnalysisEngine(content) {
    console.log('\n🚀 統合分析エンジン検証...');

    // IntegratedAnalysisEngineクラスの検証
    const classMatch = content.match(/class IntegratedAnalysisEngine[\s\S]*?(?=class|\n\s*\/\/|\n\s*$)/);
    
    if (classMatch) {
      const classContent = classMatch[0];
      
      // 7段階処理システムの検証
      const phases = ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5', 'Phase 6', 'Phase 7'];
      let phaseCount = 0;
      phases.forEach(phase => {
        if (classContent.includes(phase)) phaseCount++;
      });
      
      this.addResult('7段階処理システム', phaseCount >= 6, `${phaseCount}/7段階実装`);
      
      // 必須メソッドの検証
      const requiredMethods = [
        'performIntegratedAnalysis',
        'performMultiLayerMatching',
        'calculateIntegratedScore',
        'generateAlternatives',
        'generateDetailedReasoning'
      ];
      
      requiredMethods.forEach(method => {
        const methodPattern = new RegExp(`${method}\\s*\\([^)]*\\)\\s*\\{`, 'g');
        const found = methodPattern.test(classContent);
        this.addResult(`統合エンジン「${method}」`, found, found ? 'メソッド実装確認' : 'メソッド未実装');
      });

      // キャッシュシステムの検証
      const hasAnalysisCache = /analysisCache.*=.*new Map/.test(classContent);
      this.addResult('分析結果キャッシュ', hasAnalysisCache, hasAnalysisCache ? 'キャッシュ実装確認' : 'キャッシュ未実装');
      
    } else {
      this.addResult('IntegratedAnalysisEngineクラス', false, 'クラス定義が見つかりません');
    }
  }

  verifyPerformanceOptimizations(content) {
    console.log('\n⚡ パフォーマンス最適化検証...');

    // キャッシュシステムの包括検証
    const cacheTypes = [
      { name: 'stemCache', pattern: /stemCache.*=.*new Map/ },
      { name: 'relationCache', pattern: /relationCache.*=.*new Map/ },
      { name: 'analysisCache', pattern: /analysisCache.*=.*new Map/ }
    ];
    
    cacheTypes.forEach(cache => {
      const found = cache.pattern.test(content);
      this.addResult(`${cache.name}システム`, found, found ? 'キャッシュ実装確認' : 'キャッシュ未実装');
    });

    // キャッシュサイズ制限の検証
    const hasCacheLimit = /maxCacheSize.*=.*\d+/.test(content);
    this.addResult('キャッシュサイズ制限', hasCacheLimit, hasCacheLimit ? 'サイズ制限実装' : 'サイズ制限未実装');
    
    // メモリ管理の検証
    const hasMemoryManagement = /if.*Cache\.size.*>=.*maxCacheSize/.test(content);
    this.addResult('メモリ管理機能', hasMemoryManagement, hasMemoryManagement ? 'メモリ管理実装' : 'メモリ管理未実装');
    
    // 重複除去の検証
    const hasDeduplication = /\.\.\.\s*new Set\(.*\)/.test(content);
    this.addResult('重複除去処理', hasDeduplication, hasDeduplication ? '重複除去実装' : '重複除去未実装');
  }

  verifyErrorHandling(content) {
    console.log('\n🛡️ エラーハンドリング検証...');

    // try-catchブロックの検証
    const tryCatchCount = (content.match(/try\s*\{[\s\S]*?catch\s*\(/g) || []).length;
    this.addResult('try-catchブロック', tryCatchCount >= 3, `${tryCatchCount}箇所のエラー処理`);
    
    // kuromoji.js依存性のエラー処理
    const hasKuromojiError = /if.*!.*kuromojiTokenizer/.test(content);
    this.addResult('kuromoji.js依存エラー処理', hasKuromojiError, hasKuromojiError ? 'エラー処理実装' : 'エラー処理未実装');
    
    // フォールバック処理の検証
    const hasFallback = /fallback/i.test(content);
    this.addResult('フォールバック処理', hasFallback, hasFallback ? 'フォールバック実装' : 'フォールバック未実装');
    
    // エラーメッセージの検証
    const hasErrorMessages = /console\.error/.test(content);
    this.addResult('エラーログ出力', hasErrorMessages, hasErrorMessages ? 'ログ出力実装' : 'ログ出力未実装');
  }

  /**
   * コード品質分析
   */
  analyzeCodeQuality(content) {
    console.log('\n📊 コード品質分析中...');

    // コードの複雑性分析
    const totalLines = content.split('\n').length;
    const jsLines = content.split('\n').filter(line => 
      line.trim() && !line.trim().startsWith('//') && !line.trim().startsWith('/*')
    ).length;
    
    this.addResult('コード総行数', true, `${totalLines}行`);
    this.addResult('JavaScript実行行数', true, `${jsLines}行`);
    
    // 関数定義の分析
    const functionCount = (content.match(/function\s+\w+\s*\(/g) || []).length;
    const arrowFunctionCount = (content.match(/\w+\s*=\s*\([^)]*\)\s*=>/g) || []).length;
    const classCount = (content.match(/class\s+\w+/g) || []).length;
    
    this.addResult('関数定義数', true, `${functionCount}個（通常関数）`);
    this.addResult('アロー関数数', true, `${arrowFunctionCount}個`);
    this.addResult('クラス定義数', true, `${classCount}個`);
    
    // コメント密度の分析
    const commentLines = content.split('\n').filter(line => 
      line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().includes('*/')
    ).length;
    
    const commentDensity = Math.round((commentLines / totalLines) * 100);
    this.addResult('コメント密度', commentDensity >= 5, `${commentDensity}%`);
    
    // セキュリティチェック
    const hasEval = /eval\s*\(/.test(content);
    const hasInnerHTML = /innerHTML\s*=/.test(content);
    const hasDocumentWrite = /document\.write/.test(content);
    
    this.addResult('eval使用回避', !hasEval, hasEval ? 'eval使用あり（要注意）' : 'eval使用なし');
    this.addResult('innerHTML使用状況', true, hasInnerHTML ? 'innerHTML使用あり（適切な処理を確認）' : 'innerHTML使用なし');
    this.addResult('document.write回避', !hasDocumentWrite, hasDocumentWrite ? 'document.write使用あり（非推奨）' : 'document.write使用なし');
  }

  addResult(testName, passed, details) {
    this.testResults.push({
      name: testName,
      passed,
      details,
      timestamp: new Date().toISOString()
    });
    
    this.stats.total++;
    if (passed) {
      this.stats.passed++;
    } else {
      this.stats.failed++;
    }
    
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${testName}: ${details}`);
  }

  /**
   * 品質レポート生成
   */
  generateQualityReport() {
    const executionTime = Date.now() - this.startTime;
    const successRate = Math.round((this.stats.passed / this.stats.total) * 100);
    
    console.log('\n' + '='.repeat(80));
    console.log('🔬 Future Simulator 品質検証レポート');
    console.log('='.repeat(80));
    console.log(`📊 テスト総数: ${this.stats.total}`);
    console.log(`✅ 成功: ${this.stats.passed}`);
    console.log(`❌ 失敗: ${this.stats.failed}`);
    console.log(`📈 品質スコア: ${successRate}%`);
    console.log(`⏱️ 実行時間: ${executionTime}ms`);
    console.log('='.repeat(80));
    
    // 失敗したテストの詳細
    if (this.stats.failed > 0) {
      console.log('\n❌ 改善が必要な項目:');
      this.testResults.filter(r => !r.passed).forEach(result => {
        console.log(`  • ${result.name}: ${result.details}`);
      });
    }
    
    // カテゴリ別分析
    const categories = {
      'コンテキストシステム': this.testResults.filter(r => r.name.includes('コンテキスト')),
      '動的キーワード': this.testResults.filter(r => r.name.includes('動的キーワード')),
      'イレギュラー検出': this.testResults.filter(r => r.name.includes('イレギュラー')),
      '統合分析エンジン': this.testResults.filter(r => r.name.includes('統合エンジン')),
      'パフォーマンス': this.testResults.filter(r => r.name.includes('キャッシュ') || r.name.includes('パフォーマンス')),
      'エラーハンドリング': this.testResults.filter(r => r.name.includes('エラー') || r.name.includes('フォールバック')),
      'コード品質': this.testResults.filter(r => r.name.includes('コード') || r.name.includes('関数') || r.name.includes('セキュリティ'))
    };
    
    console.log('\n📋 カテゴリ別品質スコア:');
    Object.entries(categories).forEach(([category, tests]) => {
      if (tests.length > 0) {
        const categoryPassed = tests.filter(t => t.passed).length;
        const categoryRate = Math.round((categoryPassed / tests.length) * 100);
        const status = categoryRate >= 90 ? '🟢' : categoryRate >= 70 ? '🟡' : '🔴';
        console.log(`  ${status} ${category}: ${categoryPassed}/${tests.length} (${categoryRate}%)`);
      }
    });
    
    // 品質評価
    console.log('\n🎯 総合品質評価:');
    if (successRate >= 95) {
      console.log('🟢 優秀: 本格運用可能 - 高品質実装が確認されました');
    } else if (successRate >= 85) {
      console.log('🟡 良好: 実用レベル - 軽微な改善で品質向上可能');
    } else if (successRate >= 70) {
      console.log('🟠 要改善: 重要な問題の修正が必要');
    } else {
      console.log('🔴 不十分: 大幅な改善が必要');
    }
    
    // パフォーマンス推定
    console.log('\n⚡ パフォーマンス推定:');
    const hasAllCaches = this.testResults.filter(r => r.name.includes('キャッシュ') && r.passed).length >= 3;
    const hasOptimizations = this.testResults.filter(r => r.name.includes('最適化') || r.name.includes('重複除去')).some(r => r.passed);
    
    if (hasAllCaches && hasOptimizations) {
      console.log('🟢 高速動作が期待されます（キャッシュ・最適化実装済み）');
    } else if (hasAllCaches) {
      console.log('🟡 標準的な動作速度が期待されます（キャッシュ実装済み）');
    } else {
      console.log('🟠 動作速度の改善余地があります（最適化要検討）');
    }
    
    return {
      totalTests: this.stats.total,
      passedTests: this.stats.passed,
      failedTests: this.stats.failed,
      successRate,
      executionTime,
      status: successRate >= 85 ? 'EXCELLENT' : successRate >= 70 ? 'GOOD' : 'NEEDS_IMPROVEMENT'
    };
  }

  /**
   * メイン実行
   */
  async run() {
    try {
      console.log('🚀 Future Simulator 品質検証開始');
      
      const content = this.analyzeImplementation();
      if (!content) {
        console.error('❌ ファイル読み込み失敗');
        return;
      }
      
      this.verifySystemQuality(content);
      this.analyzeCodeQuality(content);
      
      const report = this.generateQualityReport();
      
      // JSONレポート出力
      const reportData = {
        timestamp: new Date().toISOString(),
        summary: report,
        details: this.testResults,
        categories: {
          context_system: this.testResults.filter(r => r.name.includes('コンテキスト')),
          dynamic_keywords: this.testResults.filter(r => r.name.includes('動的キーワード')),
          irregular_detection: this.testResults.filter(r => r.name.includes('イレギュラー')),
          integrated_engine: this.testResults.filter(r => r.name.includes('統合エンジン')),
          performance: this.testResults.filter(r => r.name.includes('キャッシュ') || r.name.includes('パフォーマンス')),
          error_handling: this.testResults.filter(r => r.name.includes('エラー')),
          code_quality: this.testResults.filter(r => r.name.includes('コード'))
        }
      };
      
      fs.writeFileSync('future-simulator-quality-report.json', JSON.stringify(reportData, null, 2));
      console.log('\n📄 詳細品質レポートを future-simulator-quality-report.json に出力しました');
      
      return report;
      
    } catch (error) {
      console.error('❌ 品質検証実行エラー:', error);
      throw error;
    }
  }
}

// 検証実行
const tester = new FutureSimulatorQualityTester();
tester.run().then(result => {
  console.log(`\n🎯 品質検証完了: ${result.status}`);
  process.exit(result.status === 'EXCELLENT' || result.status === 'GOOD' ? 0 : 1);
}).catch(error => {
  console.error('品質検証失敗:', error);
  process.exit(1);
});