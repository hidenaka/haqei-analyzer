/**
 * 無料精度測定・改善システム
 * 
 * 目的：
 * - 改善効果のリアルタイム測定
 * - A/Bテストによる手法比較
 * - 継続的改善サイクルの自動化
 * - コストゼロでの品質保証
 * 
 * 測定機能：
 * 1. ベースライン vs 改善版の精度比較
 * 2. 特殊爻認識率の専用測定
 * 3. ユーザー満足度の推定
 * 4. 処理速度・安定性の監視
 * 
 * 改善機能：
 * - 失敗パターンの自動分析
 * - テンプレート自動調整
 * - 閾値の動的最適化
 * 
 * 前提条件：
 * - ClaudeAnalysisEngineが初期化済み
 * - ContextualMappingSystemが利用可能
 * - SmartTemplateOptimizerが読み込み済み（オプション）
 * 
 * 技術的特徴：
 * - ゼロコスト実装（外部API不使用）
 * - リアルタイム性能監視
 * - 自動改善レコメンデーション
 * - 統計的有意性検定
 */
class ZeroCostAccuracyTester {
  constructor() {
    this.claudeEngine = null;
    this.mappingSystem = null;
    this.templateOptimizer = null;
    
    // テストデータとベンチマーク
    this.testSuites = this.initializeTestSuites();
    this.benchmarkResults = new Map();
    this.improvementHistory = [];
    
    // 精度測定システム
    this.accuracyMetrics = this.initializeAccuracyMetrics();
    this.abTestFramework = this.initializeABTestFramework();
    this.realTimeMonitor = this.initializeRealTimeMonitor();
    
    // 自動改善システム
    this.improvementEngine = this.initializeImprovementEngine();
    this.qualityThresholds = this.initializeQualityThresholds();
    
    // 統計データ
    this.testingStats = {
      totalTests: 0,
      accuracyImprovements: 0,
      averageAccuracyGain: 0,
      processingTimeReduction: 0,
      specialYaoImprovement: 0,
      lastTestDate: null
    };
  }

  /**
   * テストスイートの初期化
   * 
   * 目的：
   * - 包括的なテストケースの定義
   * - ベンチマーク用ゴールデンスタンダード
   * - 特殊爻専用テストの準備
   * 
   * 処理内容：
   * 1. 基本精度テストケース作成
   * 2. 特殊爻認識テストケース
   * 3. エッジケース・困難事例
   * 4. パフォーマンステストケース
   * 
   * 出力：
   * - 構造化テストデータセット
   * - 正解ラベル付きテストケース
   */
  initializeTestSuites() {
    return {
      // 基本精度テストスイート
      basic_accuracy: {
        name: '基本精度テスト',
        description: '一般的なユーザー入力の認識精度測定',
        testCases: [
          {
            id: 'basic_001',
            input: '最近同じミスを繰り返してて、なんか成長できてない気がする😔',
            expectedResult: { hexagram: 29, line: 3 },
            category: 'repetitive_struggle',
            difficulty: 'medium',
            emotions: ['frustration', 'self_doubt'],
            confidence: 0.85
          },
          {
            id: 'basic_002',
            input: '新しいプロジェクトが始まって、ワクワクするけど少し不安もある',
            expectedResult: { hexagram: 3, line: 1 },
            category: 'new_beginning',
            difficulty: 'easy',
            emotions: ['hope', 'anxiety'],
            confidence: 0.8
          },
          {
            id: 'basic_003',
            input: '今の状況をしっかり受け入れて、流れに任せてみることにした',
            expectedResult: { hexagram: 2, line: 2 },
            category: 'acceptance',
            difficulty: 'medium',
            emotions: ['calm', 'receptive'],
            confidence: 0.75
          },
          {
            id: 'basic_004',
            input: 'チームをまとめて大きな成果を出せた！みんなで協力した結果だ',
            expectedResult: { hexagram: 1, line: 5 },
            category: 'leadership_success',
            difficulty: 'medium',
            emotions: ['pride', 'gratitude'],
            confidence: 0.8
          },
          {
            id: 'basic_005',
            input: '迷いに迷って、どの道を選べばいいか全然分からない状態',
            expectedResult: { hexagram: 4, line: 2 },
            category: 'confusion',
            difficulty: 'easy',
            emotions: ['confusion', 'anxiety'],
            confidence: 0.9
          }
        ]
      },

      // 特殊爻認識テストスイート
      special_yao: {
        name: '特殊爻認識テスト',
        description: '用九・用六の高精度認識測定',
        testCases: [
          {
            id: 'special_001',
            input: 'すべての要素が統合されて、新しい次元への準備が整った✨',
            expectedResult: { hexagram: 1, line: '用九' },
            category: 'integration_mastery',
            difficulty: 'high',
            emotions: ['transcendence', 'completion'],
            confidence: 0.9
          },
          {
            id: 'special_002',
            input: '全ての可能性を受け入れ包み込んで、最高の柔軟性を発揮している',
            expectedResult: { hexagram: 2, line: '用六' },
            category: 'receptive_mastery',
            difficulty: 'high',
            emotions: ['serenity', 'wisdom'],
            confidence: 0.85
          },
          {
            id: 'special_003',
            input: 'リーダーとして完璧な統率力を発揮し、チーム全体を次のレベルに導いた',
            expectedResult: { hexagram: 1, line: '用九' },
            category: 'leadership_transcendence',
            difficulty: 'high',
            emotions: ['mastery', 'fulfillment'],
            confidence: 0.88
          },
          {
            id: 'special_004',
            input: '完全なる受容の境地に達し、すべてを包み込む母性を発揮している',
            expectedResult: { hexagram: 2, line: '用六' },
            category: 'nurturing_perfection',
            difficulty: 'high',
            emotions: ['compassion', 'wisdom'],
            confidence: 0.87
          }
        ]
      },

      // 困難事例テストスイート
      edge_cases: {
        name: '困難事例テスト',
        description: '矛盾・皮肉・複雑な文脈の処理能力測定',
        testCases: [
          {
            id: 'edge_001',
            input: 'うまくいってるって言われるけど、なんか違う気がするんだよね...',
            expectedResult: { hexagram: 61, line: 4 },
            category: 'inner_contradiction',
            difficulty: 'very_high',
            emotions: ['confusion', 'dissatisfaction'],
            confidence: 0.6,
            specialHandling: 'contradiction_resolution'
          },
          {
            id: 'edge_002',
            input: '「順調です」って答えてるけど、内心はパニック状態😅',
            expectedResult: { hexagram: 58, line: 2 },
            category: 'surface_vs_reality',
            difficulty: 'very_high',
            emotions: ['anxiety', 'masking'],
            confidence: 0.65,
            specialHandling: 'irony_detection'
          },
          {
            id: 'edge_003',
            input: '前は失敗ばかりだったけど、今は成長してる。でもまだ不安',
            expectedResult: { hexagram: 24, line: 3 },
            category: 'temporal_complexity',
            difficulty: 'high',
            emotions: ['growth', 'residual_anxiety'],
            confidence: 0.7,
            specialHandling: 'temporal_analysis'
          }
        ]
      },

      // パフォーマンステストスイート
      performance: {
        name: 'パフォーマンステスト',
        description: '処理速度・安定性・リソース使用量の測定',
        testCases: [
          {
            id: 'perf_001',
            input: '短い',
            expectedProcessingTime: 100, // ms
            category: 'minimal_input'
          },
          {
            id: 'perf_002',
            input: '非常に長い文章で、多くの情報が含まれており、感情も複雑で、状況も入り組んでいて、過去と現在と未来の要素が混在し、複数の人間関係が関わり、様々な感情が交錯している複雑な状況の説明テキスト',
            expectedProcessingTime: 500, // ms
            category: 'complex_input'
          },
          {
            id: 'perf_003',
            input: '絵文字🎉と顔文字(^^)と記号！？が混在した現代的なSNS風のテキスト✨',
            expectedProcessingTime: 200, // ms
            category: 'mixed_characters'
          }
        ]
      }
    };
  }

  /**
   * 精度測定指標の初期化
   * 
   * 目的：
   * - 多角度からの精度評価
   * - 統計的有意性の確保
   * - 改善効果の定量化
   * 
   * 処理内容：
   * 1. 基本精度指標の定義
   * 2. 特殊爻専用指標
   * 3. ユーザビリティ指標
   * 4. システム性能指標
   * 
   * 出力：
   * - 包括的評価フレームワーク
   */
  initializeAccuracyMetrics() {
    return {
      // 基本精度指標
      basic_metrics: {
        top1_accuracy: {
          name: 'Top-1 精度',
          description: '最上位予測の正解率',
          weight: 0.4,
          target: 0.7,
          current: 0,
          history: []
        },
        
        top3_accuracy: {
          name: 'Top-3 精度',
          description: '上位3候補以内の正解率',
          weight: 0.3,
          target: 0.85,
          current: 0,
          history: []
        },
        
        top5_accuracy: {
          name: 'Top-5 精度',
          description: '上位5候補以内の正解率',
          weight: 0.2,
          target: 0.9,
          current: 0,
          history: []
        },
        
        mean_reciprocal_rank: {
          name: '平均逆順位',
          description: '正解の平均順位の逆数',
          weight: 0.1,
          target: 0.8,
          current: 0,
          history: []
        }
      },

      // 特殊爻専用指標
      special_yao_metrics: {
        yong_jiu_precision: {
          name: '用九精度',
          description: '用九の正確な認識率',
          weight: 0.5,
          target: 0.85,
          current: 0,
          history: []
        },
        
        yong_liu_precision: {
          name: '用六精度',
          description: '用六の正確な認識率',
          weight: 0.5,
          target: 0.85,
          current: 0,
          history: []
        },
        
        special_yao_recall: {
          name: '特殊爻再現率',
          description: '特殊爻状況の検出率',
          weight: 0.3,
          target: 0.8,
          current: 0,
          history: []
        },
        
        false_positive_rate: {
          name: '誤検出率',
          description: '通常爻を特殊爻と誤判定する率',
          weight: 0.2,
          target: 0.05, // 低いほど良い
          current: 0,
          history: [],
          inverse: true // 低い値が良い指標
        }
      },

      // ユーザビリティ指標
      usability_metrics: {
        confidence_accuracy: {
          name: '信頼度精度',
          description: '予測信頼度と実際の正確性の相関',
          weight: 0.4,
          target: 0.8,
          current: 0,
          history: []
        },
        
        response_naturalness: {
          name: '応答自然さ',
          description: 'ユーザーにとっての納得感',
          weight: 0.3,
          target: 0.75,
          current: 0,
          history: []
        },
        
        explanation_clarity: {
          name: '説明明確性',
          description: '分析理由の理解しやすさ',
          weight: 0.3,
          target: 0.8,
          current: 0,
          history: []
        }
      },

      // システム性能指標
      performance_metrics: {
        average_response_time: {
          name: '平均応答時間',
          description: '分析処理の平均時間（ms）',
          weight: 0.4,
          target: 200, // ms
          current: 0,
          history: [],
          inverse: true // 低い値が良い指標
        },
        
        memory_efficiency: {
          name: 'メモリ効率',
          description: 'メモリ使用量の効率性',
          weight: 0.2,
          target: 0.8,
          current: 0,
          history: []
        },
        
        system_stability: {
          name: 'システム安定性',
          description: 'エラー発生率の低さ',
          weight: 0.4,
          target: 0.95,
          current: 0,
          history: []
        }
      }
    };
  }

  /**
   * A/Bテストフレームワークの初期化
   * 
   * 目的：
   * - 改善手法の客観的比較
   * - 統計的有意性の確保
   * - 最適な設定の発見
   * 
   * 処理内容：
   * 1. 実験設計フレームワーク
   * 2. サンプルサイズ計算
   * 3. 統計的検定機能
   * 4. 結果解釈システム
   * 
 * 出力：
   * - A/Bテスト実行環境
   * - 統計解析機能
   */
  initializeABTestFramework() {
    return {
      // 実験設計
      experiment_design: {
        sample_size_calculator: {
          alpha: 0.05,        // 有意水準
          beta: 0.2,          // 第二種過誤率
          effect_size: 0.1,   // 検出したい効果サイズ
          minimum_samples: 30  // 最小サンプル数
        },
        
        randomization: {
          method: 'simple_randomization',
          seed: null, // 再現性のためのシード値
          stratification: ['difficulty', 'category'] // 層化要因
        }
      },

      // 実験バリアント管理
      variants: new Map(),
      
      // 実験結果記録
      experiment_results: new Map(),
      
      // 統計的検定
      statistical_tests: {
        // t検定（平均値の差）
        t_test: {
          paired: true,
          alpha: 0.05,
          alternative: 'two-sided'
        },
        
        // カイ二乗検定（比率の差）
        chi_square: {
          alpha: 0.05,
          yates_correction: true
        },
        
        // ウィルコクソン符号順位検定（ノンパラメトリック）
        wilcoxon: {
          alpha: 0.05,
          alternative: 'two-sided'
        }
      },
      
      // 実験管理
      active_experiments: new Map(),
      completed_experiments: []
    };
  }

  /**
   * リアルタイム監視システムの初期化
   * 
   * 目的：
   * - 継続的な性能監視
   * - 異常検知と自動アラート
   * - トレンド分析機能
   * 
   * 処理内容：
   * 1. 監視対象指標の定義
   * 2. 異常検知アルゴリズム
   * 3. アラート機構
   * 4. レポート生成機能
   * 
   * 出力：
   * - リアルタイム監視システム
   * - 自動アラート機能
   */
  initializeRealTimeMonitor() {
    return {
      // 監視指標
      monitored_metrics: [
        'accuracy_trend',
        'response_time_trend', 
        'error_rate',
        'confidence_distribution',
        'special_yao_detection_rate'
      ],
      
      // データ収集
      data_collector: {
        collection_interval: 1000, // 1秒間隔
        buffer_size: 1000,
        retention_period: 7 * 24 * 60 * 60 * 1000 // 7日間
      },
      
      // 異常検知
      anomaly_detection: {
        // 移動平均ベースの異常検知
        moving_average: {
          window_size: 50,
          threshold_multiplier: 2.0
        },
        
        // 統計的異常検知
        statistical: {
          z_score_threshold: 2.5,
          iqr_multiplier: 1.5
        }
      },
      
      // アラート設定
      alerts: {
        accuracy_drop: {
          threshold: -0.1, // 10%以上の精度低下
          severity: 'high'
        },
        
        response_time_spike: {
          threshold: 2.0, // 2倍以上の応答時間増加
          severity: 'medium'
        },
        
        error_rate_increase: {
          threshold: 0.05, // 5%以上のエラー率
          severity: 'high'
        }
      },
      
      // データ保存
      data_storage: {
        current_buffer: [],
        historical_data: new Map(),
        last_cleanup: Date.now()
      }
    };
  }

  /**
   * 自動改善エンジンの初期化
   * 
   * 目的：
   * - 自動的な性能改善
   * - 適応的パラメータ調整
   * - 継続学習機能
   * 
   * 処理内容：
   * 1. 改善戦略の定義
   * 2. パラメータ最適化
   * 3. 学習アルゴリズム
   * 4. 効果測定機能
   * 
   * 出力：
   * - 自動改善システム
   * - 学習機能
   */
  initializeImprovementEngine() {
    return {
      // 改善戦略
      improvement_strategies: [
        {
          name: 'threshold_optimization',
          description: '閾値の動的最適化',
          trigger: 'accuracy_below_target',
          action: 'adjust_confidence_thresholds',
          parameters: {
            adjustment_rate: 0.01,
            max_adjustment: 0.1
          }
        },
        
        {
          name: 'weight_rebalancing',
          description: '特徴量重みの再調整',
          trigger: 'category_specific_errors',
          action: 'rebalance_feature_weights',
          parameters: {
            learning_rate: 0.005,
            momentum: 0.9
          }
        },
        
        {
          name: 'template_enhancement',
          description: 'テンプレートの自動強化',
          trigger: 'consistent_misclassification',
          action: 'enhance_problem_templates',
          parameters: {
            enhancement_threshold: 0.6,
            max_enhancements_per_cycle: 10
          }
        }
      ],
      
      // 学習履歴
      learning_history: [],
      
      // パラメータ最適化
      parameter_optimization: {
        current_parameters: new Map(),
        optimization_history: [],
        best_parameters: new Map()
      },
      
      // 改善効果測定
      improvement_tracking: {
        baseline_metrics: new Map(),
        improvement_deltas: [],
        cumulative_improvement: 0
      }
    };
  }

  /**
   * 品質閾値の初期化
   * 
   * 目的：
   * - 品質基準の明確化
   * - 段階的品質評価
   * - 自動判定基準
   */
  initializeQualityThresholds() {
    return {
      // 精度閾値
      accuracy_thresholds: {
        excellent: 0.9,   // A+級
        good: 0.8,        // A級
        acceptable: 0.7,  // B級
        needs_improvement: 0.6, // C級
        unacceptable: 0.5 // D級以下
      },
      
      // 特殊爻専用閾値
      special_yao_thresholds: {
        excellent: 0.95,
        good: 0.85,
        acceptable: 0.75,
        needs_improvement: 0.65,
        unacceptable: 0.55
      },
      
      // パフォーマンス閾値
      performance_thresholds: {
        response_time: {
          excellent: 100,   // ms
          good: 200,
          acceptable: 500,
          slow: 1000,
          unacceptable: 2000
        },
        
        memory_usage: {
          excellent: 10,    // MB
          good: 25,
          acceptable: 50,
          high: 100,
          unacceptable: 200
        }
      }
    };
  }

  /**
   * 包括的精度テストの実行
   * 
   * 目的：
   * - 全面的なシステム性能評価
   * - ベースラインとの比較
   * - 改善効果の定量測定
   * 
   * 入力：
   * - testOptions: テスト設定
   * 
   * 処理内容：
   * 1. 全テストスイートの実行
   * 2. 精度指標の計算
   * 3. 統計的分析
   * 4. 改善提案の生成
   * 
   * 出力：
   * - 包括的テスト結果
   * - 改善提案レポート
   * 
   * エラー処理：
   * - テスト失敗時の継続実行
   * - 部分結果の適切な処理
   */
  async runComprehensiveAccuracyTest(testOptions = {}) {
    const startTime = performance.now();
    
    console.log('=== 包括的精度テスト開始 ===');
    
    const options = {
      include_basic: true,
      include_special_yao: true,
      include_edge_cases: true,
      include_performance: true,
      save_results: true,
      generate_report: true,
      ...testOptions
    };
    
    const testResults = {
      timestamp: new Date().toISOString(),
      options: options,
      suiteResults: new Map(),
      overallMetrics: {},
      improvements: [],
      recommendations: [],
      processingTime: 0,
      errors: []
    };
    
    try {
      // 1. 基本精度テスト
      if (options.include_basic) {
        console.log('\n--- 基本精度テスト実行 ---');
        const basicResults = await this.runTestSuite('basic_accuracy');
        testResults.suiteResults.set('basic_accuracy', basicResults);
        console.log(`基本精度: ${(basicResults.accuracy * 100).toFixed(1)}%`);
      }
      
      // 2. 特殊爻認識テスト
      if (options.include_special_yao) {
        console.log('\n--- 特殊爻認識テスト実行 ---');
        const specialResults = await this.runTestSuite('special_yao');
        testResults.suiteResults.set('special_yao', specialResults);
        console.log(`特殊爻精度: ${(specialResults.accuracy * 100).toFixed(1)}%`);
      }
      
      // 3. 困難事例テスト
      if (options.include_edge_cases) {
        console.log('\n--- 困難事例テスト実行 ---');
        const edgeResults = await this.runTestSuite('edge_cases');
        testResults.suiteResults.set('edge_cases', edgeResults);
        console.log(`困難事例精度: ${(edgeResults.accuracy * 100).toFixed(1)}%`);
      }
      
      // 4. パフォーマンステスト
      if (options.include_performance) {
        console.log('\n--- パフォーマンステスト実行 ---');
        const perfResults = await this.runPerformanceTest();
        testResults.suiteResults.set('performance', perfResults);
        console.log(`平均応答時間: ${perfResults.averageResponseTime.toFixed(1)}ms`);
      }
      
      // 5. 全体メトリクスの計算
      testResults.overallMetrics = this.calculateOverallMetrics(testResults.suiteResults);
      
      // 6. 改善効果の分析
      testResults.improvements = this.analyzeImprovements(testResults);
      
      // 7. 改善提案の生成
      testResults.recommendations = this.generateRecommendations(testResults);
      
      // 8. 結果の保存
      if (options.save_results) {
        this.saveTestResults(testResults);
      }
      
      // 9. レポート生成
      if (options.generate_report) {
        const report = this.generateAccuracyReport(testResults);
        console.log('\n=== テストレポート ===');
        console.log(report.summary);
      }
      
      const endTime = performance.now();
      testResults.processingTime = endTime - startTime;
      
      // 10. 統計更新
      this.updateTestingStats(testResults);
      
      console.log(`\n=== テスト完了 ===`);
      console.log(`総合精度: ${(testResults.overallMetrics.overallAccuracy * 100).toFixed(1)}%`);
      console.log(`処理時間: ${(testResults.processingTime / 1000).toFixed(2)}秒`);
      
      return testResults;
      
    } catch (error) {
      console.error('包括テストエラー:', error);
      testResults.errors.push({
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return testResults;
    }
  }

  /**
   * 個別テストスイートの実行
   * 
   * 目的：
   * - 特定カテゴリの詳細評価
   * - 詳細な分析結果の生成
   * - 問題点の特定
   * 
   * 処理内容：
   * 1. テストケースの順次実行
   * 2. 結果の記録と分析
   * 3. エラーハンドリング
   * 4. 統計計算
   * 
   * 出力：
   * - テストスイート結果
   * - 詳細分析データ
   */
  async runTestSuite(suiteName) {
    const suite = this.testSuites[suiteName];
    if (!suite) {
      throw new Error(`テストスイート '${suiteName}' が見つかりません`);
    }
    
    const suiteResults = {
      suiteName: suiteName,
      totalCases: suite.testCases.length,
      passedCases: 0,
      failedCases: 0,
      accuracy: 0,
      averageConfidence: 0,
      processingTime: 0,
      detailed_results: [],
      error_analysis: {}
    };
    
    const startTime = performance.now();
    
    for (const testCase of suite.testCases) {
      try {
        const caseResult = await this.runSingleTestCase(testCase);
        suiteResults.detailed_results.push(caseResult);
        
        if (caseResult.passed) {
          suiteResults.passedCases++;
        } else {
          suiteResults.failedCases++;
        }
        
        suiteResults.averageConfidence += caseResult.confidence;
        
      } catch (error) {
        console.error(`テストケース実行エラー (${testCase.id}):`, error);
        suiteResults.detailed_results.push({
          testCaseId: testCase.id,
          passed: false,
          error: error.message,
          confidence: 0
        });
        suiteResults.failedCases++;
      }
    }
    
    // 統計計算
    suiteResults.accuracy = suiteResults.passedCases / suiteResults.totalCases;
    suiteResults.averageConfidence = suiteResults.averageConfidence / suiteResults.totalCases;
    suiteResults.processingTime = performance.now() - startTime;
    
    // エラー分析
    suiteResults.error_analysis = this.analyzeTestErrors(suiteResults.detailed_results);
    
    return suiteResults;
  }

  /**
   * 単一テストケースの実行
   * 
   * 目的：
   * - 個別テストケースの詳細評価
   * - 分析システムとの統合
   * - 結果の検証
   * 
   * 処理内容：
   * 1. マッピングシステムの呼び出し
   * 2. 結果の正解との比較
   * 3. 信頼度の評価
   * 4. 詳細分析の記録
   * 
   * 出力：
   * - 単一テスト結果
   * - 詳細分析データ
   */
  async runSingleTestCase(testCase) {
    const caseResult = {
      testCaseId: testCase.id,
      input: testCase.input,
      expectedResult: testCase.expectedResult,
      actualResult: null,
      passed: false,
      confidence: 0,
      processingTime: 0,
      analysis: null
    };
    
    const startTime = performance.now();
    
    try {
      // マッピングシステムでの分析実行
      let mappingResult = null;
      
      if (this.mappingSystem) {
        mappingResult = await this.mappingSystem.performContextualMapping(testCase.input);
      } else if (this.claudeEngine) {
        mappingResult = await this.claudeEngine.analyzeUserInput(testCase.input);
      } else {
        throw new Error('分析システムが初期化されていません');
      }
      
      // 結果の抽出
      caseResult.actualResult = {
        hexagram: mappingResult.primaryResult?.hexagram || mappingResult.mappingResults?.[0]?.hexagram,
        line: mappingResult.primaryResult?.line || mappingResult.mappingResults?.[0]?.line
      };
      
      caseResult.confidence = mappingResult.confidence || mappingResult.primaryResult?.confidence || 0;
      caseResult.analysis = mappingResult;
      
      // 正解判定
      caseResult.passed = this.evaluateTestResult(
        caseResult.expectedResult,
        caseResult.actualResult,
        testCase
      );
      
      caseResult.processingTime = performance.now() - startTime;
      
    } catch (error) {
      caseResult.error = error.message;
      caseResult.processingTime = performance.now() - startTime;
    }
    
    return caseResult;
  }

  /**
   * テスト結果の評価
   * 
   * 目的：
   * - 正解判定の実行
   * - 部分正解の評価
   * - 特殊ケースの処理
   * 
   * 処理内容：
   * 1. 完全一致の確認
   * 2. 近似一致の評価
   * 3. 特殊爻の特別処理
   * 4. 信頼度による調整
   * 
   * 出力：
   * - 合格・不合格判定
   * - 評価詳細
   */
  evaluateTestResult(expected, actual, testCase) {
    if (!expected || !actual) {
      return false;
    }
    
    // 完全一致
    if (expected.hexagram === actual.hexagram && expected.line === actual.line) {
      return true;
    }
    
    // 特殊爻の場合の特別処理
    if (testCase.category?.includes('special') || testCase.difficulty === 'high') {
      // 特殊爻は完全一致のみ合格
      return false;
    }
    
    // 近似判定（同一卦内の他爻）
    if (expected.hexagram === actual.hexagram) {
      // 同一卦内なら部分的に正解とみなす（信頼度を下げて）
      return testCase.difficulty === 'easy'; // 簡単な問題のみ部分正解を認める
    }
    
    return false;
  }

  /**
   * パフォーマンステストの実行
   * 
   * 目的：
   * - システム性能の詳細測定
   * - ボトルネックの特定
   * - 改善効果の確認
   * 
   * 処理内容：
   * 1. 応答時間測定
   * 2. メモリ使用量監視
   * 3. スループット測定
   * 4. 安定性評価
   * 
   * 出力：
   * - パフォーマンス指標
   * - システム診断結果
   */
  async runPerformanceTest() {
    const perfResults = {
      averageResponseTime: 0,
      maxResponseTime: 0,
      minResponseTime: Infinity,
      throughput: 0,
      memoryUsage: 0,
      errorRate: 0,
      detailed_metrics: []
    };
    
    const performanceTestCases = this.testSuites.performance.testCases;
    const responseTimes = [];
    let errorCount = 0;
    
    const startTime = performance.now();
    
    for (const testCase of performanceTestCases) {
      const caseStartTime = performance.now();
      
      try {
        // 実際の分析実行
        if (this.mappingSystem) {
          await this.mappingSystem.performContextualMapping(testCase.input);
        } else if (this.claudeEngine) {
          await this.claudeEngine.analyzeUserInput(testCase.input);
        }
        
        const responseTime = performance.now() - caseStartTime;
        responseTimes.push(responseTime);
        
        perfResults.detailed_metrics.push({
          testCase: testCase.id,
          responseTime: responseTime,
          success: true
        });
        
      } catch (error) {
        errorCount++;
        const responseTime = performance.now() - caseStartTime;
        
        perfResults.detailed_metrics.push({
          testCase: testCase.id,
          responseTime: responseTime,
          success: false,
          error: error.message
        });
      }
    }
    
    // 統計計算
    if (responseTimes.length > 0) {
      perfResults.averageResponseTime = responseTimes.reduce((a, b) => a + b) / responseTimes.length;
      perfResults.maxResponseTime = Math.max(...responseTimes);
      perfResults.minResponseTime = Math.min(...responseTimes);
    }
    
    const totalTime = performance.now() - startTime;
    perfResults.throughput = performanceTestCases.length / (totalTime / 1000); // cases per second
    perfResults.errorRate = errorCount / performanceTestCases.length;
    
    // メモリ使用量（ブラウザがサポートしている場合）
    if (performance.memory) {
      perfResults.memoryUsage = performance.memory.usedJSHeapSize / (1024 * 1024); // MB
    }
    
    return perfResults;
  }

  /**
   * A/Bテストの実行
   * 
   * 目的：
   * - 複数手法の客観的比較
   * - 統計的有意性の確認
   * - 最適設定の発見
   * 
   * 入力：
   * - variantA: 比較対象A
   * - variantB: 比較対象B
   * - testConfig: テスト設定
   * 
   * 処理内容：
   * 1. 実験設計の検証
   * 2. ランダム化テストの実行
   * 3. 統計的検定
   * 4. 結果の解釈
   * 
   * 出力：
   * - A/Bテスト結果
   * - 統計的有意性
   * - 推奨事項
   */
  async runABTest(variantA, variantB, testConfig = {}) {
    console.log('=== A/Bテスト開始 ===');
    console.log(`Variant A: ${variantA.name}`);
    console.log(`Variant B: ${variantB.name}`);
    
    const config = {
      sample_size: 50,
      significance_level: 0.05,
      test_suites: ['basic_accuracy', 'special_yao'],
      ...testConfig
    };
    
    const abTestResult = {
      timestamp: new Date().toISOString(),
      variantA: variantA,
      variantB: variantB,
      config: config,
      results: {
        variantA: {},
        variantB: {}
      },
      statistical_analysis: {},
      conclusion: null,
      recommendation: null
    };
    
    try {
      // Variant A のテスト実行
      console.log('\n--- Variant A テスト実行 ---');
      for (const suiteName of config.test_suites) {
        abTestResult.results.variantA[suiteName] = await this.runTestSuite(suiteName);
      }
      
      // Variant B のテスト実行  
      console.log('\n--- Variant B テスト実行 ---');
      // 実際の実装では、Variant B の設定を適用してテスト実行
      for (const suiteName of config.test_suites) {
        abTestResult.results.variantB[suiteName] = await this.runTestSuite(suiteName);
      }
      
      // 統計的分析
      abTestResult.statistical_analysis = this.performStatisticalAnalysis(
        abTestResult.results.variantA,
        abTestResult.results.variantB,
        config
      );
      
      // 結論の生成
      abTestResult.conclusion = this.generateABTestConclusion(abTestResult.statistical_analysis);
      
      // 推奨事項
      abTestResult.recommendation = this.generateABTestRecommendation(abTestResult);
      
      console.log('\n=== A/Bテスト結果 ===');
      console.log(`結論: ${abTestResult.conclusion}`);
      console.log(`推奨: ${abTestResult.recommendation}`);
      
      return abTestResult;
      
    } catch (error) {
      console.error('A/Bテストエラー:', error);
      abTestResult.error = error.message;
      return abTestResult;
    }
  }

  /**
   * システムの初期化と依存関係確立
   * 
   * 目的：
   * - 必要なコンポーネントとの連携
   * - テスト環境の準備
   * - 基本動作確認
   */
  async initialize() {
    console.log('=== 無料精度測定システム初期化 ===');
    
    try {
      // 1. 依存関係の確認と初期化
      if (typeof ClaudeAnalysisEngine !== 'undefined') {
        this.claudeEngine = new ClaudeAnalysisEngine();
        console.log('✓ ClaudeAnalysisEngine統合完了');
      }
      
      if (typeof ContextualMappingSystem !== 'undefined') {
        this.mappingSystem = new ContextualMappingSystem();
        await this.mappingSystem.initialize();
        console.log('✓ ContextualMappingSystem統合完了');
      }
      
      if (typeof SmartTemplateOptimizer !== 'undefined') {
        this.templateOptimizer = new SmartTemplateOptimizer();
        console.log('✓ SmartTemplateOptimizer統合完了');
      }
      
      // 2. リアルタイム監視の開始
      this.startRealTimeMonitoring();
      console.log('✓ リアルタイム監視開始');
      
      // 3. 既存データの読み込み
      this.loadHistoricalData();
      console.log('✓ 履歴データ読み込み完了');
      
      console.log('=== 初期化完了 ===\n');
      return true;
      
    } catch (error) {
      console.error('初期化エラー:', error);
      return false;
    }
  }

  /**
   * リアルタイム監視の開始
   */
  startRealTimeMonitoring() {
    const monitor = this.realTimeMonitor;
    
    setInterval(() => {
      // 性能指標の収集
      const currentMetrics = this.collectCurrentMetrics();
      monitor.data_storage.current_buffer.push({
        timestamp: Date.now(),
        metrics: currentMetrics
      });
      
      // バッファサイズの管理
      if (monitor.data_storage.current_buffer.length > monitor.data_collector.buffer_size) {
        monitor.data_storage.current_buffer.shift();
      }
      
      // 異常検知
      this.detectAnomalies(currentMetrics);
      
    }, monitor.data_collector.collection_interval);
  }

  /**
   * 現在の指標収集
   */
  collectCurrentMetrics() {
    return {
      accuracy: this.accuracyMetrics.basic_metrics.top1_accuracy.current,
      responseTime: this.accuracyMetrics.performance_metrics.average_response_time.current,
      confidence: this.mappingSystem?.getMappingStatistics()?.averageConfidence || 0,
      errorRate: 1 - (this.mappingSystem?.getMappingStatistics()?.successRate || 0),
      specialYaoRate: this.mappingSystem?.getMappingStatistics()?.specialYaoDetectionRate || 0
    };
  }

  /**
   * 異常検知
   */
  detectAnomalies(currentMetrics) {
    const alerts = this.realTimeMonitor.alerts;
    
    // 精度低下の検知
    if (currentMetrics.accuracy < alerts.accuracy_drop.threshold) {
      this.triggerAlert('accuracy_drop', currentMetrics.accuracy);
    }
    
    // 応答時間の異常
    if (currentMetrics.responseTime > alerts.response_time_spike.threshold) {
      this.triggerAlert('response_time_spike', currentMetrics.responseTime);
    }
    
    // エラー率の増加
    if (currentMetrics.errorRate > alerts.error_rate_increase.threshold) {
      this.triggerAlert('error_rate_increase', currentMetrics.errorRate);
    }
  }

  /**
   * アラートの発行
   */
  triggerAlert(alertType, value) {
    const alert = {
      type: alertType,
      value: value,
      timestamp: new Date().toISOString(),
      severity: this.realTimeMonitor.alerts[alertType].severity
    };
    
    console.warn(`🚨 アラート発生: ${alertType} (値: ${value})`);
    
    // 自動改善の実行
    this.executeAutoImprovement(alertType, alert);
  }

  /**
   * 自動改善の実行
   */
  executeAutoImprovement(alertType, alert) {
    const strategies = this.improvementEngine.improvement_strategies;
    
    for (const strategy of strategies) {
      if (this.shouldExecuteStrategy(strategy, alertType, alert)) {
        console.log(`🔧 自動改善実行: ${strategy.name}`);
        this.executeImprovementStrategy(strategy, alert);
      }
    }
  }

  /**
   * 戦略実行判定
   */
  shouldExecuteStrategy(strategy, alertType, alert) {
    // 簡易的な判定ロジック
    return strategy.trigger.includes(alertType) || 
           (alertType === 'accuracy_drop' && strategy.trigger === 'accuracy_below_target');
  }

  /**
   * 改善戦略の実行
   */
  executeImprovementStrategy(strategy, alert) {
    switch (strategy.action) {
      case 'adjust_confidence_thresholds':
        this.adjustConfidenceThresholds(strategy.parameters);
        break;
        
      case 'rebalance_feature_weights':
        this.rebalanceFeatureWeights(strategy.parameters);
        break;
        
      case 'enhance_problem_templates':
        this.enhanceProblemTemplates(strategy.parameters);
        break;
        
      default:
        console.warn(`未実装の改善アクション: ${strategy.action}`);
    }
  }

  /**
   * 統計更新
   */
  updateTestingStats(testResults) {
    this.testingStats.totalTests++;
    this.testingStats.lastTestDate = new Date().toISOString();
    
    // 精度改善の記録
    const overallAccuracy = testResults.overallMetrics?.overallAccuracy || 0;
    if (overallAccuracy > 0) {
      const previousAccuracy = this.accuracyMetrics.basic_metrics.top1_accuracy.current || 0;
      const improvement = overallAccuracy - previousAccuracy;
      
      if (improvement > 0) {
        this.testingStats.accuracyImprovements++;
        
        // 平均改善効果の更新
        const totalGain = this.testingStats.averageAccuracyGain * (this.testingStats.accuracyImprovements - 1);
        this.testingStats.averageAccuracyGain = (totalGain + improvement) / this.testingStats.accuracyImprovements;
      }
      
      // 現在の精度を更新
      this.accuracyMetrics.basic_metrics.top1_accuracy.current = overallAccuracy;
      this.accuracyMetrics.basic_metrics.top1_accuracy.history.push({
        value: overallAccuracy,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * テスト統計の取得
   */
  getTestingStatistics() {
    return {
      ...this.testingStats,
      currentAccuracy: this.accuracyMetrics.basic_metrics.top1_accuracy.current,
      accuracyHistory: this.accuracyMetrics.basic_metrics.top1_accuracy.history,
      improvementRate: this.testingStats.accuracyImprovements / (this.testingStats.totalTests || 1)
    };
  }
}

// グローバルスコープにエクスポート
if (typeof window !== 'undefined') {
  window.ZeroCostAccuracyTester = ZeroCostAccuracyTester;
}