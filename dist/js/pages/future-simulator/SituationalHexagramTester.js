/**
 * 状況卦算出テストエンジン - PDCA サイクル用テスト実行システム
 * 
 * 目的：
 * - テストユーザーと生成テキストから状況卦を算出
 * - 既存の状況卦エンジンチェーンを統合実行
 * - 算出結果の妥当性評価
 * - PDCAサイクル用データの収集
 * 
 * 入力：
 * - testUser: object - TestUserGeneratorで生成されたユーザー
 * - worryText: string - RealisticTextGeneratorで生成されたテキスト
 * - testOptions: object - テスト実行オプション
 * 
 * 処理内容：
 * 1. 多次元コンテキスト分析の実行
 * 2. 仮想状況推定の実行
 * 3. 易経マッピングの実行
 * 4. 深層心理分析の実行（オプション）
 * 5. 確率的状況モデリングの実行（オプション）
 * 6. 統合結果の生成と評価
 * 
 * 出力：
 * - hexagramResult: object - 算出された状況卦情報
 * - analysisChain: object - 各エンジンの分析結果
 * - qualityMetrics: object - 品質評価メトリクス
 * - testMetadata: object - テスト実行メタデータ
 * 
 * 副作用：
 * - テスト結果の蓄積
 * - 精度統計の更新
 * 
 * 前提条件：
 * - 各分析エンジンがグローバルに利用可能
 * - hexagrams_master.js がロード済み
 * - H384_DATA がロード済み
 * 
 * エラー処理：
 * - 各エンジンのエラーハンドリング
 * - フォールバック処理
 * - エラー統計の記録
 */
class SituationalHexagramTester {
  constructor() {
    // 分析エンジンの初期化チェック
    this.engines = {
      contextAnalyzer: null,$1
      
    };
    
    // テスト統計
    this.testStatistics = {
      totalTests: 0,
      successfulTests: 0,
      failedTests: 0,
      averageConfidence: 0,
      hexagramDistribution: new Map(),
      errorTypes: new Map(),
      performanceMetrics: {
        averageTime: 0,
        maxTime: 0,
        minTime: Infinity
      }
    };
    
    // 品質評価基準
    this.qualityCriteria = {
      confidenceThreshold: 0.65,
      consistencyThreshold: 0.70,
      relevanceThreshold: 0.60
    };
    
    // エラー追跡
    this.errorLog = [];
    
    // パフォーマンス追跡
    this.performanceLog = [];
  }

  /**
   * エンジンの初期化と検証
   * 
   * 目的：
   * - 必要な分析エンジンの存在確認
   * - エンジンの初期化
   * - データベースの確認
   * 
   * 処理内容：
   * - グローバルオブジェクトのチェック
   * - エンジンインスタンスの作成
   * - 必要データの検証
   * 
   * 出力：
   * - 初期化成功/失敗の状態
   */
  async initializeEngines() {
    console.log('🔧 状況卦テストエンジン初期化開始');
    
    try {
      // MultiDimensionalContextAnalyzer の確認と初期化
      if (typeof MultiDimensionalContextAnalyzer !== 'undefined') {
        this.engines.contextAnalyzer = new MultiDimensionalContextAnalyzer();
        console.log('✅ MultiDimensionalContextAnalyzer 初期化完了');
      } else {
        throw new Error('MultiDimensionalContextAnalyzer が見つかりません');
      }
      
      // SituationalContextEngine の確認と初期化
      if (typeof SituationalContextEngine !== 'undefined') {
        this.engines.situationalEngine = new SituationalContextEngine();
        console.log('✅ SituationalContextEngine 初期化完了');
      } else {
        throw new Error('SituationalContextEngine が見つかりません');
      }
      
      // HexagramMappingEngine の確認と初期化
      if (typeof HexagramMappingEngine !== 'undefined') {
        this.engines.hexagramMapper = new HexagramMappingEngine();
        
        // hexagrams_master データの確認
        if (typeof hexagrams_master !== 'undefined') {
          this.engines.hexagramMapper.hexagramsData = hexagrams_master;
          console.log('✅ hexagrams_master データロード完了');
        } else {
          console.warn('⚠️ hexagrams_master データが見つかりません');
        }
        
        // H384_DATA の確認
        if (typeof window.H384_DATA !== 'undefined') {
          this.engines.hexagramMapper.h384Data = window.H384_DATA;
          console.log('✅ H384_DATA データロード完了');
        } else {
          console.warn('⚠️ H384_DATA が見つかりません');
        }
        
        console.log('✅ HexagramMappingEngine 初期化完了');
      } else {
        throw new Error('HexagramMappingEngine が見つかりません');
      }
      
      // オプショナルエンジンの確認
      if (typeof DeepPsychologicalAnalyzer !== 'undefined') {
        this.engines.psychologicalAnalyzer = new DeepPsychologicalAnalyzer();
        console.log('✅ DeepPsychologicalAnalyzer 初期化完了');
      }      // ProbabilisticSituationModeler初期化ブロック削除 - 正統易経システムに移行
      
      console.log('🎯 全エンジン初期化完了');
      return true;
      
    } catch (error) {
      console.error('🚨 エンジン初期化エラー:', error);
      this.errorLog.push({
        type: 'initialization',
        message: error.message,
        timestamp: new Date().toISOString()
      });
      return false;
    }
  }

  /**
   * 単一テストの実行
   * 
   * 目的：
   * - 1人のテストユーザーに対する状況卦算出
   * - 各エンジンの連携実行
   * - 結果の評価と記録
   * 
   * 処理内容：
   * - 分析チェーンの実行
   * - 品質評価
   * - 統計更新
   * 
   * 出力：
   * - 完全なテスト結果オブジェクト
   */
  async runSingleTest(testUser, worryText, options = {}) {
    const testId = `test_${Date.now()}_${testUser.id}`;
    const startTime = performance.now();
    
    console.log(`\n🧪 テスト実行: ${testUser.id}`);
    console.log(`  年齢: ${testUser.basicInfo.age}, 職業: ${testUser.basicInfo.occupation.specific}`);
    console.log(`  悩みの深さ: ${testUser.worryProfile.depthLevel}`);
    
    try {
      // Phase 1: 多次元コンテキスト分析
      const contextAnalysis = await this.runContextAnalysis(worryText, testUser);
      
      // Phase 2: 仮想状況推定
      const situationalResult = await this.runSituationalAnalysis(
        worryText, 
        contextAnalysis, 
        testUser
      );
      
      // Phase 2.5: 易経マッピング
      const hexagramResult = await this.runHexagramMapping(
        situationalResult, 
        testUser
      );
      
      // Phase 3: 深層心理分析（オプション）
      let psychologicalResult = null;
      if (this.engines.psychologicalAnalyzer && options.includePsychological) {
        psychologicalResult = await this.runPsychologicalAnalysis(
          situationalResult,
          hexagramResult,
          testUser
        );
      }
      
      // Phase 4: 確率的モデリング - REMOVED: 正統易経システムに移行
      let probabilisticResult = null;
      
      // 統合結果の生成
      const integratedResult = this.generateIntegratedResult({
        contextAnalysis,
        situationalResult,
        hexagramResult,
        psychologicalResult,
        probabilisticResult
      });
      
      // 品質評価
      const qualityMetrics = this.evaluateQuality(integratedResult, testUser);
      
      // 処理時間の計算
      const processingTime = performance.now() - startTime;
      
      // 統計更新
      this.updateStatistics(integratedResult, qualityMetrics, processingTime, true);
      
      // 完全な結果を返す
      return {
        testId: testId,
        testUser: {
          id: testUser.id,
          age: testUser.basicInfo.age,
          occupation: testUser.basicInfo.occupation,
          worryDepth: testUser.worryProfile.depthLevel,
          hsp: testUser.hspTraits.isHSP
        },
        worryText: worryText,
        hexagramResult: {
          hexagramId: hexagramResult.primaryHexagram?.hexagram_id,
          hexagramName: hexagramResult.primaryHexagram?.name_jp,
          selectedLine: hexagramResult.selectedLine?.爻,
          confidence: hexagramResult.mappingConfidence
        },
        analysisChain: integratedResult,
        qualityMetrics: qualityMetrics,
        testMetadata: {
          timestamp: new Date().toISOString(),
          processingTime: processingTime,
          engineVersions: this.getEngineVersions()
        }
      };
      
    } catch (error) {
      console.error(`🚨 テストエラー (${testUser.id}):`, error);
      
      // エラー記録
      this.errorLog.push({
        testId: testId,
        userId: testUser.id,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      
      // 統計更新
      this.updateStatistics(null, null, 0, false);
      
      // エラー結果を返す
      return {
        testId: testId,
        testUser: {
          id: testUser.id
        },
        error: {
          message: error.message,
          type: error.name
        },
        testMetadata: {
          timestamp: new Date().toISOString(),
          failed: true
        }
      };
    }
  }

  /**
   * バッチテストの実行
   * 
   * 目的：
   * - 複数のテストユーザーに対する一括テスト
   * - 並列処理による効率化
   * - 進捗モニタリング
   * 
   * 処理内容：
   * - バッチ処理の管理
   * - 進捗表示
   * - 結果の集約
   * 
   * 出力：
   * - バッチテスト結果と統計
   */
  async runBatchTest(testUsers, textGenerator, options = {}) {
    console.log(`\n🔬 バッチテスト開始: ${testUsers.length}人のユーザー`);
    
    const batchResults = [];
    const batchSize = options.batchSize || 10;
    const startTime = performance.now();
    
    // バッチ処理
    for (let i = 0; i < testUsers.length; i += batchSize) {
      const batch = testUsers.slice(i, Math.min(i + batchSize, testUsers.length));
      const batchPromises = [];
      
      for (const user of batch) {
        // テキスト生成
        const worryTextResult = await textGenerator.generateWorryText(user);
        
        // テスト実行（非同期）
        const testPromise = this.runSingleTest(
          user, 
          worryTextResult.text, 
          options
        );
        
        batchPromises.push(testPromise);
      }
      
      // バッチの完了を待つ
      const batchResults_ = await Promise.all(batchPromises);
      batchResults.push(...batchResults_);
      
      // 進捗表示
      const progress = Math.min(i + batchSize, testUsers.length);
      console.log(`  進捗: ${progress}/${testUsers.length} (${(progress/testUsers.length*100).toFixed(1)}%)`);
    }
    
    const totalTime = performance.now() - startTime;
    
    // 統計サマリーの生成
    const summary = this.generateBatchSummary(batchResults, totalTime);
    
    console.log(`\n✅ バッチテスト完了`);
    console.log(`  総テスト数: ${batchResults.length}`);
    console.log(`  成功率: ${(summary.successRate * 100).toFixed(1)}%`);
    console.log(`  平均信頼度: ${summary.averageConfidence.toFixed(3)}`);
    console.log(`  総処理時間: ${(totalTime / 1000).toFixed(1)}秒`);
    
    return {
      results: batchResults,
      summary: summary,
      statistics: this.testStatistics,
      errorLog: this.errorLog
    };
  }

  // ========== 各フェーズの実行メソッド ==========

  /**
   * Phase 1: 多次元コンテキスト分析
   */
  async runContextAnalysis(text, user) {
    if (!this.engines.contextAnalyzer) {
      throw new Error('MultiDimensionalContextAnalyzer が初期化されていません');
    }
    
    return await this.engines.contextAnalyzer.analyzeMultiDimensionalContext(
      text,
      { userProfile: user }
    );
  }

  /**
   * Phase 2: 仮想状況推定
   */
  async runSituationalAnalysis(text, contextAnalysis, user) {
    if (!this.engines.situationalEngine) {
      throw new Error('SituationalContextEngine が初期化されていません');
    }
    
    return await this.engines.situationalEngine.analyzeSituationalContext(
      text,
      contextAnalysis,
      user
    );
  }

  /**
   * Phase 2.5: 易経マッピング
   */
  async runHexagramMapping(situationalResult, user) {
    if (!this.engines.hexagramMapper) {
      throw new Error('HexagramMappingEngine が初期化されていません');
    }
    
    return await this.engines.hexagramMapper.mapToHexagram(
      situationalResult,
      user
    );
  }

  /**
   * Phase 3: 深層心理分析（オプション）
   */
  async runPsychologicalAnalysis(situationalResult, hexagramResult, user) {
    if (!this.engines.psychologicalAnalyzer) {
      return null;
    }
    
    return await this.engines.psychologicalAnalyzer.analyzeDeepPsychologicalPatterns(
      situationalResult,
      hexagramResult,
      user
    );
  }

  // ========== 評価・統計メソッド ==========

  /**
   * 統合結果の生成
   */
  generateIntegratedResult(results) {
    return {
      contextAnalysis: results.contextAnalysis,
      situationalAnalysis: results.situationalResult,
      hexagramMapping: results.hexagramResult,
      psychologicalAnalysis: results.psychologicalResult,
      probabilisticAnalysis: results.probabilisticResult,
      integrationTimestamp: new Date().toISOString()
    };
  }

  /**
   * 品質評価
   */
  evaluateQuality(integratedResult, testUser) {
    const metrics = {
      confidence: 0,
      consistency: 0,
      relevance: 0,
      completeness: 0,
      overall: 0
    };
    
    // 信頼度評価
    if (integratedResult.hexagramMapping?.mappingConfidence) {
      metrics.confidence = integratedResult.hexagramMapping.mappingConfidence;
    }
    
    // 一貫性評価
    if (integratedResult.situationalAnalysis?.consistencyScore) {
      metrics.consistency = integratedResult.situationalAnalysis.consistencyScore;
    }
    
    // 関連性評価（悩みの深さと卦の対応）
    metrics.relevance = this.evaluateRelevance(
      testUser.worryProfile,
      integratedResult.hexagramMapping
    );
    
    // 完全性評価
    metrics.completeness = this.evaluateCompleteness(integratedResult);
    
    // 総合評価
    metrics.overall = (
      metrics.confidence * 0.3 +
      metrics.consistency * 0.25 +
      metrics.relevance * 0.25 +
      metrics.completeness * 0.2
    );
    
    return metrics;
  }

  /**
   * 関連性評価
   */
  evaluateRelevance(worryProfile, hexagramMapping) {
    // 悩みの深さと卦の特性の対応を評価
    if (!hexagramMapping || !hexagramMapping.primaryHexagram) {
      return 0;
    }
    
    const depthScores = {
      'surface': 0.3,
      'moderate': 0.6,
      'deep': 0.9
    };
    
    const baseScore = depthScores[worryProfile.depthLevel] || 0.5;
    
    // 卦の特性による調整（簡易版）
    const hexagramId = hexagramMapping.primaryHexagram.hexagram_id;
    const criticalHexagrams = [29, 47, 36, 6]; // 困難を表す卦
    
    if (worryProfile.depthLevel === 'deep' && criticalHexagrams.includes(hexagramId)) {
      return Math.min(baseScore + 0.2, 1.0);
    }
    
    return baseScore;
  }

  /**
   * 完全性評価
   */
  evaluateCompleteness(result) {
    let score = 0;
    const components = [
      'contextAnalysis',
      'situationalAnalysis',
      'hexagramMapping'
    ];
    
    components.forEach(component => {
      if (result[component] && Object.keys(result[component]).length > 0) {
        score += 0.33;
      }
    });
    
    return Math.min(score, 1.0);
  }

  /**
   * 統計更新
   */
  updateStatistics(result, metrics, processingTime, success) {
    this.testStatistics.totalTests++;
    
    if (success) {
      this.testStatistics.successfulTests++;
      
      // 信頼度の更新
      const currentAvg = this.testStatistics.averageConfidence;
      const newAvg = (currentAvg * (this.testStatistics.successfulTests - 1) + 
                     metrics.overall) / this.testStatistics.successfulTests;
      this.testStatistics.averageConfidence = newAvg;
      
      // 卦分布の更新
      if (result?.hexagramMapping?.primaryHexagram) {
        const hexId = result.hexagramMapping.primaryHexagram.hexagram_id;
        const count = this.testStatistics.hexagramDistribution.get(hexId) || 0;
        this.testStatistics.hexagramDistribution.set(hexId, count + 1);
      }
      
      // パフォーマンス統計
      this.updatePerformanceMetrics(processingTime);
      
    } else {
      this.testStatistics.failedTests++;
      
      // エラータイプの記録
      const errorType = result?.error?.type || 'unknown';
      const count = this.testStatistics.errorTypes.get(errorType) || 0;
      this.testStatistics.errorTypes.set(errorType, count + 1);
    }
  }

  /**
   * パフォーマンスメトリクス更新
   */
  updatePerformanceMetrics(processingTime) {
    const metrics = this.testStatistics.performanceMetrics;
    const successCount = this.testStatistics.successfulTests;
    
    // 平均時間の更新
    metrics.averageTime = (metrics.averageTime * (successCount - 1) + 
                          processingTime) / successCount;
    
    // 最大・最小時間の更新
    metrics.maxTime = Math.max(metrics.maxTime, processingTime);
    metrics.minTime = Math.min(metrics.minTime, processingTime);
  }

  /**
   * バッチサマリーの生成
   */
  generateBatchSummary(results, totalTime) {
    const successful = results.filter(r => !r.error).length;
    const failed = results.filter(r => r.error).length;
    
    // 卦分布の分析
    const hexagramCounts = new Map();
    results.forEach(r => {
      if (r.hexagramResult?.hexagramId) {
        const id = r.hexagramResult.hexagramId;
        hexagramCounts.set(id, (hexagramCounts.get(id) || 0) + 1);
      }
    });
    
    // 最頻出卦トップ5
    const topHexagrams = Array.from(hexagramCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    // 信頼度分布
    const confidences = results
      .filter(r => r.hexagramResult?.confidence)
      .map(r => r.hexagramResult.confidence);
    
    const avgConfidence = confidences.length > 0 ?
      confidences.reduce((a, b) => a + b, 0) / confidences.length : 0;
    
    return {
      totalTests: results.length,
      successful: successful,
      failed: failed,
      successRate: successful / results.length,
      averageConfidence: avgConfidence,
      topHexagrams: topHexagrams,
      totalProcessingTime: totalTime,
      averageProcessingTime: totalTime / results.length,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * エンジンバージョンの取得
   */
  getEngineVersions() {
    return {
      contextAnalyzer: '1.0.0',
      situationalEngine: '2.0.0',
      hexagramMapper: '2.5.0',$1
      // probabilisticModeler: '4.0.0' // REMOVED: 正統易経システムに移行
    };
  }

  /**
   * テスト結果のエクスポート
   */
  exportTestResults(results, format = 'json') {
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        totalResults: results.length,
        engineVersions: this.getEngineVersions()
      },
      results: results,
      statistics: this.testStatistics,
      errorLog: this.errorLog
    };
    
    if (format === 'json') {
      return JSON.stringify(exportData, null, 2);
    } else if (format === 'csv') {
      // CSV形式への変換（簡易版）
      const headers = ['testId', 'userId', 'age', 'occupation', 'worryDepth', 
                      'hexagramId', 'hexagramName', 'confidence', 'overallQuality'];
      
      const rows = results.map(r => [
        r.testId,
        r.testUser.id,
        r.testUser.age,
        r.testUser.occupation?.specific || '',
        r.testUser.worryDepth,
        r.hexagramResult?.hexagramId || '',
        r.hexagramResult?.hexagramName || '',
        r.hexagramResult?.confidence || 0,
        r.qualityMetrics?.overall || 0
      ]);
      
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
    
    return exportData;
  }
}

// グローバル利用のためのエクスポート
window.SituationalHexagramTester = SituationalHexagramTester;