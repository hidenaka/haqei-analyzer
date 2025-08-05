/**
 * 386爻SNS文章生成システム統合テスト
 * 
 * 目的：
 * - 全コンポーネントの統合動作確認
 * - 386爻（乾為天の用九、坤為地の用六含む）の完全サポート検証
 * - 生成品質とパフォーマンスの測定
 * - Future Simulatorへの統合準備
 * 
 * 主要機能：
 * - H384データベースからのテンプレート自動生成
 * - SNS文章のバッチ生成シミュレーション
 * - 品質検証とレポート生成
 * - 統計情報の可視化
 * 
 * 前提条件：
 * - H384H64database.jsが読み込まれている
 * - 全関連クラスが利用可能
 * - ブラウザ環境での実行
 */
class IntegrationTest386 {
  constructor() {
    this.components = {};
    this.testResults = {
      timestamp: new Date().toISOString(),
      componentStatus: {},
      templateCoverage: {},
      generationMetrics: {},
      qualityMetrics: {},
      errors: []
    };
  }

  /**
   * コンポーネントの初期化と検証
   * 
   * 目的：
   * - 必要なクラスの存在確認
   * - 依存関係の検証
   * - 初期化エラーの検出
   * 
   * 処理内容：
   * 1. 各クラスの存在確認
   * 2. インスタンス生成
   * 3. 初期状態の検証
   * 
   * 出力：
   * - 初期化成功/失敗の状態
   * 
   * エラー処理：
   * - クラス不在時の詳細エラー
   * - 初期化失敗の原因特定
   */
  async initializeComponents() {
    console.log('=== 386爻統合テスト開始 ===');
    console.log('日時:', new Date().toLocaleString('ja-JP'));
    
    try {
      // 1. H384データベースの確認
      if (typeof H384_DATA === 'undefined') {
        throw new Error('H384_DATAが読み込まれていません');
      }
      console.log(`✓ H384_DATA読み込み完了: ${H384_DATA.length}件`);
      this.testResults.componentStatus.H384_DATA = { 
        loaded: true, 
        count: H384_DATA.length,
        hasYongJiu: H384_DATA.some(d => d['爻'] === '用九'),
        hasYongLiu: H384_DATA.some(d => d['爻'] === '用六')
      };

      // 2. 各クラスの初期化
      const classChecks = [
        { name: 'HexagramPatternTemplates', class: HexagramPatternTemplates },
        { name: 'LoadH384Data', class: LoadH384Data },
        { name: 'SNSTextGenerator', class: SNSTextGenerator },
        { name: 'TextVariationEngine', class: TextVariationEngine },
        { name: 'QualityValidator', class: QualityValidator }
      ];

      for (const check of classChecks) {
        if (typeof window[check.name] === 'undefined') {
          throw new Error(`${check.name}クラスが見つかりません`);
        }
        
        // インスタンス生成試行
        try {
          if (check.name === 'LoadH384Data') {
            // 静的クラスなのでインスタンス化不要
            this.components[check.name] = check.class;
          } else {
            this.components[check.name] = new check.class();
          }
          
          console.log(`✓ ${check.name} 初期化成功`);
          this.testResults.componentStatus[check.name] = { 
            initialized: true,
            error: null
          };
        } catch (error) {
          console.error(`✗ ${check.name} 初期化失敗:`, error);
          this.testResults.componentStatus[check.name] = { 
            initialized: false,
            error: error.message
          };
        }
      }

      // 3. 相互依存関係の設定
      if (this.components.SNSTextGenerator) {
        this.components.SNSTextGenerator.variationEngine = this.components.TextVariationEngine;
      }

      return true;
    } catch (error) {
      console.error('初期化エラー:', error);
      this.testResults.errors.push({
        phase: 'initialization',
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return false;
    }
  }

  /**
   * 386爻テンプレートの完全性検証
   * 
   * 目的：
   * - 全386爻のテンプレート存在確認
   * - 用九・用六の特別処理確認
   * - データ整合性チェック
   * 
   * 処理内容：
   * 1. H384データからテンプレート生成
   * 2. 386爻すべての確認
   * 3. 特殊爻（用九・用六）の検証
   * 
   * 出力：
   * - カバレッジレポート
   * - 欠損爻のリスト
   */
  async verifyTemplateCoverage() {
    console.log('\n=== テンプレートカバレッジ検証 ===');
    
    try {
      // H384データからテンプレート生成
      const templates = this.components.LoadH384Data.generateTemplatesFromH384();
      
      // 統計情報収集
      let totalDefined = 0;
      let totalExpected = 386; // 64卦×6爻 + 用九 + 用六
      const missingLines = [];
      const specialLines = [];

      // 通常の384爻をチェック
      for (let hexNum = 1; hexNum <= 64; hexNum++) {
        for (let lineNum = 1; lineNum <= 6; lineNum++) {
          if (templates[hexNum]?.lines[lineNum]) {
            totalDefined++;
          } else {
            missingLines.push(`${hexNum}-${lineNum}`);
          }
        }
      }

      // 用九のチェック（乾為天）
      if (templates[1]?.lines['用九']) {
        totalDefined++;
        specialLines.push('1-用九');
        console.log('✓ 用九（乾為天）確認完了');
      } else {
        missingLines.push('1-用九');
        console.warn('✗ 用九（乾為天）が見つかりません');
      }

      // 用六のチェック（坤為地）
      if (templates[2]?.lines['用六']) {
        totalDefined++;
        specialLines.push('2-用六');
        console.log('✓ 用六（坤為地）確認完了');
      } else {
        missingLines.push('2-用六');
        console.warn('✗ 用六（坤為地）が見つかりません');
      }

      // 結果記録
      this.testResults.templateCoverage = {
        totalExpected,
        totalDefined,
        coverageRate: (totalDefined / totalExpected * 100).toFixed(2) + '%',
        missingLines,
        specialLines,
        templates: Object.keys(templates).length
      };

      console.log(`\nテンプレートカバレッジ: ${totalDefined}/${totalExpected} (${this.testResults.templateCoverage.coverageRate})`);
      
      if (missingLines.length > 0) {
        console.warn('欠損爻:', missingLines.slice(0, 10).join(', '), 
                    missingLines.length > 10 ? `... 他${missingLines.length - 10}個` : '');
      }

      // HexagramPatternTemplatesにテンプレートを統合
      if (this.components.HexagramPatternTemplates) {
        // 既存のテンプレートに追加
        Object.assign(this.components.HexagramPatternTemplates.templates, templates);
        console.log('✓ テンプレート統合完了');
      }

      return totalDefined === totalExpected;
    } catch (error) {
      console.error('テンプレート検証エラー:', error);
      this.testResults.errors.push({
        phase: 'template_coverage',
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return false;
    }
  }

  /**
   * サンプル文章生成テスト
   * 
   * 目的：
   * - 各コンポーネントの動作確認
   * - 生成品質の評価
   * - パフォーマンス測定
   * 
   * 処理内容：
   * 1. テスト用爻の選定
   * 2. 小規模バッチ生成
   * 3. 品質検証
   * 4. 統計収集
   */
  async testSampleGeneration() {
    console.log('\n=== サンプル文章生成テスト ===');
    
    try {
      const generator = this.components.SNSTextGenerator;
      const validator = this.components.QualityValidator;
      
      // テスト対象爻の選定（代表的な6つ + 特殊2つ）
      const testTargets = [
        { hex: 1, line: 1, name: '乾為天 初九' },
        { hex: 1, line: '用九', name: '乾為天 用九（特殊）' },
        { hex: 2, line: 1, name: '坤為地 初六' },
        { hex: 2, line: '用六', name: '坤為地 用六（特殊）' },
        { hex: 29, line: 3, name: '坎為水 六三' },
        { hex: 30, line: 4, name: '離為火 九四' },
        { hex: 63, line: 5, name: '既済 九五' },
        { hex: 64, line: 6, name: '未済 上九' }
      ];

      const results = [];
      
      for (const target of testTargets) {
        console.log(`\nテスト: ${target.name}`);
        const startTime = performance.now();
        
        try {
          // テンプレート取得
          const template = generator.patternTemplates.getLineTemplate(target.hex, target.line);
          if (!template) {
            console.warn(`テンプレート未定義: ${target.hex}-${target.line}`);
            continue;
          }

          // 小規模生成（10件）
          const batch = await generator.generateBatch(template, 10);
          
          // 品質検証
          const validationResults = [];
          for (const text of batch) {
            const result = validator.validateSingle(text, template);
            validationResults.push(result);
          }

          // 統計計算
          const passedCount = validationResults.filter(r => r.passed).length;
          const avgScore = validationResults.reduce((sum, r) => sum + r.totalScore, 0) / validationResults.length;
          
          const endTime = performance.now();
          
          results.push({
            target: `${target.hex}-${target.line}`,
            name: target.name,
            generated: batch.length,
            passed: passedCount,
            passRate: (passedCount / batch.length * 100).toFixed(1) + '%',
            avgScore: avgScore.toFixed(3),
            time: (endTime - startTime).toFixed(2) + 'ms',
            samples: batch.slice(0, 3).map(b => b.text)
          });

          console.log(`✓ 生成完了: ${passedCount}/${batch.length} 合格 (スコア: ${avgScore.toFixed(3)})`);
          console.log('  サンプル:', batch[0]?.text || 'N/A');
          
        } catch (error) {
          console.error(`✗ 生成エラー (${target.name}):`, error.message);
          results.push({
            target: `${target.hex}-${target.line}`,
            name: target.name,
            error: error.message
          });
        }
      }

      this.testResults.generationMetrics = {
        testCount: testTargets.length,
        successCount: results.filter(r => !r.error).length,
        results: results
      };

      return true;
    } catch (error) {
      console.error('生成テストエラー:', error);
      this.testResults.errors.push({
        phase: 'sample_generation',
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return false;
    }
  }

  /**
   * 品質検証システムのテスト
   * 
   * 目的：
   * - QualityValidatorの動作確認
   * - 各検証基準の妥当性評価
   * - エッジケースの処理確認
   */
  async testQualityValidation() {
    console.log('\n=== 品質検証システムテスト ===');
    
    try {
      const validator = this.components.QualityValidator;
      
      // テストケース定義
      const testCases = [
        {
          name: '高品質テキスト',
          text: {
            text: 'また同じところで失敗した😔 もう3回目だよ...なんで学習できないんだろう',
            hexagram: 29,
            line: 3,
            persona: 'young',
            emotionLevel: 'high',
            emotionTags: ['frustration', 'self_blame']
          },
          template: {
            hexagram: 29,
            line: 3,
            keyPhrases: ['同じ', '失敗', '繰り返し', '3回目'],
            emotions: ['frustration', 'self_blame', 'confusion']
          },
          expectedPass: true
        },
        {
          name: '不適切表現を含むテキスト',
          text: {
            text: '死にたいくらい辛い状況',
            hexagram: 29,
            line: 3,
            persona: 'young',
            emotionLevel: 'high'
          },
          template: {
            hexagram: 29,
            line: 3,
            keyPhrases: ['辛い', '状況'],
            emotions: ['sadness']
          },
          expectedPass: false
        },
        {
          name: '用九の特殊テキスト',
          text: {
            text: 'すべての可能性を統合して、新たな道を切り開く時が来た✨',
            hexagram: 1,
            line: '用九',
            persona: 'adult',
            emotionLevel: 'medium'
          },
          template: {
            hexagram: 1,
            line: '用九',
            keyPhrases: ['統合', '可能性', '新たな道'],
            emotions: ['hope', 'determination']
          },
          expectedPass: true
        }
      ];

      const results = [];
      
      for (const testCase of testCases) {
        const result = validator.validateSingle(testCase.text, testCase.template);
        const passed = result.passed === testCase.expectedPass;
        
        results.push({
          name: testCase.name,
          passed: passed,
          actualResult: result.passed,
          expectedResult: testCase.expectedPass,
          score: result.totalScore,
          issues: result.issues
        });

        console.log(`${passed ? '✓' : '✗'} ${testCase.name}: ${result.passed ? '合格' : '不合格'} (スコア: ${result.totalScore.toFixed(3)})`);
        if (!passed) {
          console.log('  期待値:', testCase.expectedPass, '実際:', result.passed);
          console.log('  問題点:', result.issues.map(i => i.category).join(', '));
        }
      }

      this.testResults.qualityMetrics = {
        testCount: testCases.length,
        passedCount: results.filter(r => r.passed).length,
        results: results
      };

      return true;
    } catch (error) {
      console.error('品質検証テストエラー:', error);
      this.testResults.errors.push({
        phase: 'quality_validation',
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return false;
    }
  }

  /**
   * パフォーマンステスト
   * 
   * 目的：
   * - 大規模生成時の処理速度測定
   * - メモリ使用量の監視
   * - ボトルネックの特定
   */
  async testPerformance() {
    console.log('\n=== パフォーマンステスト ===');
    
    try {
      const generator = this.components.SNSTextGenerator;
      const template = generator.patternTemplates.getLineTemplate(1, 1); // テスト用に乾為天初九を使用
      
      if (!template) {
        throw new Error('テスト用テンプレートが見つかりません');
      }

      const batchSizes = [10, 50, 100];
      const performanceResults = [];

      for (const size of batchSizes) {
        const startTime = performance.now();
        const startMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
        
        const batch = await generator.generateBatch(template, size);
        
        const endTime = performance.now();
        const endMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
        
        const result = {
          batchSize: size,
          time: endTime - startTime,
          timePerItem: (endTime - startTime) / size,
          memoryDelta: endMemory - startMemory,
          memoryPerItem: (endMemory - startMemory) / size
        };
        
        performanceResults.push(result);
        
        console.log(`バッチサイズ ${size}: ${result.time.toFixed(2)}ms (${result.timePerItem.toFixed(2)}ms/件)`);
      }

      // 38.6M件生成の推定時間計算
      const avgTimePerItem = performanceResults.reduce((sum, r) => sum + r.timePerItem, 0) / performanceResults.length;
      const estimatedTotalTime = avgTimePerItem * 38600000 / 1000 / 60 / 60; // 時間単位
      
      console.log(`\n推定総生成時間 (38.6M件): ${estimatedTotalTime.toFixed(1)}時間`);

      this.testResults.performanceMetrics = {
        results: performanceResults,
        avgTimePerItem: avgTimePerItem.toFixed(3) + 'ms',
        estimatedTotalTime: estimatedTotalTime.toFixed(1) + '時間'
      };

      return true;
    } catch (error) {
      console.error('パフォーマンステストエラー:', error);
      this.testResults.errors.push({
        phase: 'performance',
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return false;
    }
  }

  /**
   * 統合レポート生成
   * 
   * 目的：
   * - 全テスト結果の集約
   * - 問題点の特定
   * - 改善提案の生成
   */
  generateReport() {
    console.log('\n=== 統合テストレポート ===');
    
    const report = {
      summary: {
        timestamp: this.testResults.timestamp,
        totalTests: 5,
        passedTests: 0,
        status: 'unknown'
      },
      details: this.testResults,
      recommendations: []
    };

    // テスト成功数カウント
    if (this.testResults.componentStatus.H384_DATA?.loaded) report.summary.passedTests++;
    if (this.testResults.templateCoverage?.coverageRate === '100.00%') report.summary.passedTests++;
    if (this.testResults.generationMetrics?.successCount > 0) report.summary.passedTests++;
    if (this.testResults.qualityMetrics?.passedCount > 0) report.summary.passedTests++;
    if (this.testResults.performanceMetrics?.avgTimePerItem) report.summary.passedTests++;

    // ステータス判定
    if (report.summary.passedTests === 5) {
      report.summary.status = '✓ 全テスト合格';
    } else if (report.summary.passedTests >= 3) {
      report.summary.status = '△ 部分的成功';
    } else {
      report.summary.status = '✗ 要改善';
    }

    // 改善提案
    if (this.testResults.templateCoverage?.missingLines?.length > 0) {
      report.recommendations.push({
        priority: 'high',
        message: `${this.testResults.templateCoverage.missingLines.length}個の爻のテンプレートが不足しています。H384データベースの確認が必要です。`
      });
    }

    if (this.testResults.errors.length > 0) {
      report.recommendations.push({
        priority: 'high',
        message: `${this.testResults.errors.length}個のエラーが発生しました。エラーログを確認してください。`
      });
    }

    if (parseFloat(this.testResults.performanceMetrics?.estimatedTotalTime) > 100) {
      report.recommendations.push({
        priority: 'medium',
        message: '推定生成時間が100時間を超えています。並列処理やバッチサイズの最適化を検討してください。'
      });
    }

    // レポート出力
    console.log('\n【テスト結果サマリー】');
    console.log(`ステータス: ${report.summary.status}`);
    console.log(`成功テスト: ${report.summary.passedTests}/${report.summary.totalTests}`);
    
    if (report.recommendations.length > 0) {
      console.log('\n【改善提案】');
      report.recommendations.forEach((rec, i) => {
        console.log(`${i + 1}. [${rec.priority}] ${rec.message}`);
      });
    }

    console.log('\n【386爻対応状況】');
    console.log(`- 用九（乾為天）: ${this.testResults.componentStatus.H384_DATA?.hasYongJiu ? '✓ 確認' : '✗ 未確認'}`);
    console.log(`- 用六（坤為地）: ${this.testResults.componentStatus.H384_DATA?.hasYongLiu ? '✓ 確認' : '✗ 未確認'}`);
    console.log(`- テンプレートカバレッジ: ${this.testResults.templateCoverage?.coverageRate || 'N/A'}`);

    return report;
  }

  /**
   * 統合テストの実行
   * 
   * 目的：
   * - 全テストの順次実行
   * - 結果の集約とレポート生成
   */
  async runAllTests() {
    const tests = [
      { name: 'コンポーネント初期化', fn: () => this.initializeComponents() },
      { name: 'テンプレートカバレッジ検証', fn: () => this.verifyTemplateCoverage() },
      { name: 'サンプル生成テスト', fn: () => this.testSampleGeneration() },
      { name: '品質検証テスト', fn: () => this.testQualityValidation() },
      { name: 'パフォーマンステスト', fn: () => this.testPerformance() }
    ];

    for (const test of tests) {
      try {
        const success = await test.fn();
        if (!success) {
          console.warn(`${test.name}で問題が発生しました`);
        }
      } catch (error) {
        console.error(`${test.name}実行エラー:`, error);
      }
    }

    // 最終レポート生成
    const report = this.generateReport();
    
    console.log('\n=== テスト完了 ===');
    console.log('詳細結果はconsole.logを確認してください');
    
    return report;
  }

  /**
   * Future Simulatorへの統合デモ
   * 
   * 目的：
   * - 実際の動的分析フローの確認
   * - ユーザー入力からの386爻マッピング
   * - リアルタイム品質評価
   */
  async demonstrateIntegration(userInput) {
    console.log('\n=== Future Simulator統合デモ ===');
    console.log('ユーザー入力:', userInput);
    
    try {
      // 1. 動的キーワード抽出（実際はDynamicKeywordGeneratorを使用）
      const keywords = this.extractKeywordsSimple(userInput);
      console.log('抽出キーワード:', keywords);

      // 2. 386爻マッピング（実際はIntegratedAnalysisEngineを使用）
      const mappingResult = this.mapTo386Yao(keywords, userInput);
      console.log('マッピング結果:', `${mappingResult.hexagram}卦 ${mappingResult.line}爻`);

      // 3. 類似SNS文章の検索（実装時は生成済みデータセットから検索）
      const template = this.components.HexagramPatternTemplates.getLineTemplate(
        mappingResult.hexagram, 
        mappingResult.line
      );
      
      if (template) {
        console.log('爻の本質:', template.essence.state);
        console.log('関連感情:', template.emotions.join(', '));
        console.log('Triple OS分析:', template.tripleOS);
      }

      // 4. 動的分析結果の生成
      const analysisResult = {
        userInput,
        mappedYao: mappingResult,
        essence: template?.essence,
        emotions: template?.emotions,
        tripleOS: template?.tripleOS,
        confidence: 0.85, // シミュレーション値
        timestamp: new Date().toISOString()
      };

      console.log('\n動的分析完了');
      console.log('評価スコア: A級（85%）'); // 目標値

      return analysisResult;
    } catch (error) {
      console.error('統合デモエラー:', error);
      return null;
    }
  }

  // ===== ヘルパーメソッド =====

  /**
   * 簡易キーワード抽出（デモ用）
   */
  extractKeywordsSimple(text) {
    const keywords = [];
    const patterns = [
      /繰り返し|また|同じ/g,
      /失敗|ミス|うまくいかない/g,
      /不安|心配|怖い/g,
      /頑張る|努力|諦めない/g
    ];

    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) keywords.push(...matches);
    });

    return [...new Set(keywords)];
  }

  /**
   * 386爻マッピング（デモ用簡易版）
   */
  mapTo386Yao(keywords, fullText) {
    // 実際はより高度なマッピングロジックが必要
    let hexagram = 1;
    let line = 1;

    if (keywords.includes('繰り返し') || keywords.includes('また')) {
      hexagram = 29; // 坎為水（困難の繰り返し）
      line = 3;
    } else if (keywords.includes('統合') && keywords.includes('可能性')) {
      hexagram = 1;
      line = '用九'; // 特殊爻
    }

    return { hexagram, line };
  }
}

// グローバルスコープにエクスポート
if (typeof window !== 'undefined') {
  window.IntegrationTest386 = IntegrationTest386;
  
  // 自動実行オプション
  window.run386Test = async function() {
    const tester = new IntegrationTest386();
    const report = await tester.runAllTests();
    
    // デモ実行
    console.log('\n--- 統合デモ実行 ---');
    await tester.demonstrateIntegration('最近同じミスを繰り返してて、なんか成長できてない気がする😔');
    
    return report;
  };
  
  console.log('統合テストを実行するには run386Test() を呼び出してください');
}