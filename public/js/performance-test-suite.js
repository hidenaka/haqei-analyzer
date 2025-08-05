/**
 * HAQEI Performance Test Suite - 1秒以内応答テスト完全版
 * 
 * 目的：
 * - 全機能の1秒以内応答を厳密にテスト
 * - 負荷テスト（1000回連続実行）
 * - メモリリークテスト
 * - CPU使用率測定
 * - パフォーマンス回帰テスト
 */
class HAQEIPerformanceTestSuite {
  constructor() {
    this.version = "1.0.0-comprehensive";
    this.testResults = {
      responseTimeTests: [],
      loadTests: [],
      memoryTests: [],
      cpuTests: [],
      regressionTests: [],
      summary: {}
    };
    
    // テスト設定
    this.testConfig = {
      targetResponseTime: 1000,    // 1秒
      loadTestIterations: 1000,    // 1000回
      memoryLeakThreshold: 50,     // 50MB増加でリーク判定
      cpuUsageThreshold: 30,       // 30%以下
      regressionThreshold: 0.2     // 20%以上の劣化で回帰と判定
    };
    
    // テストデータ
    this.testInputs = [
      "最近、仕事でストレスを感じることが多く、将来への不安が募っています。",
      "人間関係で悩んでいて、どう対処したらいいか分からない状況です。",
      "新しいプロジェクトが始まるけれど、自分の能力に自信が持てません。",
      "家族との関係で問題があり、心が重い日々が続いています。",
      "転職を考えているが、今の状況を変える勇気が出ない。",
      "HSPの特性があり、環境の変化に敏感で疲れやすい。",
      "自分の将来の方向性が見えず、迷いの中にいる。",
      "恋愛関係で相手との価値観の違いに悩んでいる。",
      "起業を考えているが、失敗への恐れが強い。",
      "親の介護と仕事の両立で精神的に追い詰められている。"
    ];
    
    console.log('🧪 HAQEI Performance Test Suite v1.0.0 初期化完了');
  }

  /**
   * 全テストスイート実行
   */
  async runFullTestSuite() {
    console.log('🚀 HAQEI Performance Test Suite 開始');
    console.time('FullTestSuite');
    
    try {
      // テスト環境準備
      await this.prepareTestEnvironment();
      
      // 1. 応答時間テスト
      console.log('📊 1. 応答時間テスト開始');
      await this.runResponseTimeTests();
      
      // 2. 負荷テスト
      console.log('⚡ 2. 負荷テスト開始');
      await this.runLoadTests();
      
      // 3. メモリリークテスト
      console.log('🧠 3. メモリリークテスト開始');
      await this.runMemoryLeakTests();
      
      // 4. CPU使用率テスト
      console.log('💻 4. CPU使用率テスト開始');
      await this.runCPUUsageTests();
      
      // 5. 回帰テスト
      console.log('🔄 5. 回帰テスト開始');
      await this.runRegressionTests();
      
      // テスト結果分析
      this.analyzeTestResults();
      
      console.timeEnd('FullTestSuite');
      console.log('✅ 全テストスイート完了');
      
      return this.generateFinalReport();
      
    } catch (error) {
      console.error('❌ テストスイート実行エラー:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * テスト環境準備
   */
  async prepareTestEnvironment() {
    // パフォーマンス最適化システムの初期化確認
    if (window.ultraSpeedOptimizer) {
      console.log('⚡ UltraSpeedOptimizer利用可能');
    }
    
    if (window.advancedCacheSystem) {
      console.log('🗃️ AdvancedCacheSystem利用可能');
    }
    
    if (window.performanceOptimizer) {
      console.log('🚀 PerformanceOptimizer利用可能');
    }
    
    // ガベージコレクション実行
    if (window.gc) {
      window.gc();
    }
    
    // ベースラインメトリクス記録
    this.baseline = {
      memory: this.getCurrentMemoryUsage(),
      timestamp: Date.now()
    };
    
    console.log('🏁 テスト環境準備完了');
  }

  /**
   * 応答時間テスト
   */
  async runResponseTimeTests() {
    const results = [];
    
    for (let i = 0; i < this.testInputs.length; i++) {
      const input = this.testInputs[i];
      console.log(`📋 テストケース ${i + 1}/${this.testInputs.length}: "${input.substring(0, 30)}..."`);
      
      // 3回測定して平均値を取る
      const measurements = [];
      
      for (let j = 0; j < 3; j++) {
        const startTime = performance.now();
        
        try {
          // 最適化された分析実行
          let result;
          if (window.ultraSpeedOptimizer) {
            result = await window.ultraSpeedOptimizer.optimizeComprehensiveAnalysis(input, null, null);
          } else if (window.IntegratedAnalysisEngine) {
            const engine = new window.IntegratedAnalysisEngine();
            await engine.initialize();
            result = await engine.executeComprehensiveAnalysis(input);
          } else {
            throw new Error('分析エンジンが利用できません');
          }
          
          const responseTime = performance.now() - startTime;
          measurements.push({
            responseTime: responseTime,
            success: true,
            result: result
          });
          
          console.log(`  測定 ${j + 1}: ${responseTime.toFixed(2)}ms`);
          
        } catch (error) {
          const responseTime = performance.now() - startTime;
          measurements.push({
            responseTime: responseTime,
            success: false,
            error: error.message
          });
          
          console.error(`  測定 ${j + 1} エラー:`, error);
        }
        
        // 測定間隔
        await this.sleep(100);
      }
      
      // 結果集計
      const successfulMeasurements = measurements.filter(m => m.success);
      const avgResponseTime = successfulMeasurements.length > 0 
        ? successfulMeasurements.reduce((sum, m) => sum + m.responseTime, 0) / successfulMeasurements.length
        : Infinity;
      
      const testResult = {
        testCase: i + 1,
        input: input.substring(0, 50) + '...',
        measurements: measurements,
        averageResponseTime: avgResponseTime,
        targetMet: avgResponseTime <= this.testConfig.targetResponseTime,
        successRate: (successfulMeasurements.length / measurements.length) * 100
      };
      
      results.push(testResult);
      
      const status = testResult.targetMet ? '✅' : '❌';
      console.log(`  ${status} 平均応答時間: ${avgResponseTime.toFixed(2)}ms (目標: ${this.testConfig.targetResponseTime}ms)`);
    }
    
    this.testResults.responseTimeTests = results;
    
    // サマリー
    const allTargetsMet = results.every(r => r.targetMet);
    const averageTime = results.reduce((sum, r) => sum + r.averageResponseTime, 0) / results.length;
    
    console.log(`📊 応答時間テスト完了: ${allTargetsMet ? '✅ 全目標達成' : '❌ 目標未達成あり'}`);
    console.log(`📊 全体平均応答時間: ${averageTime.toFixed(2)}ms`);
  }

  /**
   * 負荷テスト
   */
  async runLoadTests() {
    console.log(`⚡ ${this.testConfig.loadTestIterations}回連続実行負荷テスト開始`);
    
    const results = {
      iterations: this.testConfig.loadTestIterations,
      startTime: Date.now(),
      measurements: [],
      memorySnapshots: [],
      errors: []
    };
    
    // 初期メモリスナップショット
    results.memorySnapshots.push({
      iteration: 0,
      memory: this.getCurrentMemoryUsage(),
      timestamp: Date.now()
    });
    
    for (let i = 0; i < this.testConfig.loadTestIterations; i++) {
      const input = this.testInputs[i % this.testInputs.length];
      const startTime = performance.now();
      
      try {
        let result;
        if (window.ultraSpeedOptimizer) {
          result = await window.ultraSpeedOptimizer.optimizeComprehensiveAnalysis(input, null, null);
        } else if (window.IntegratedAnalysisEngine) {
          const engine = new window.IntegratedAnalysisEngine();
          result = await engine.executeComprehensiveAnalysis(input);
        }
        
        const responseTime = performance.now() - startTime;
        
        results.measurements.push({
          iteration: i + 1,
          responseTime: responseTime,
          success: true
        });
        
        // 進捗表示
        if ((i + 1) % 100 === 0) {
          const progress = ((i + 1) / this.testConfig.loadTestIterations * 100).toFixed(1);
          const avgTime = results.measurements.slice(-100).reduce((sum, m) => sum + m.responseTime, 0) / 100;
          console.log(`  進捗: ${progress}% (直近100回平均: ${avgTime.toFixed(2)}ms)`);
          
          // メモリスナップショット
          results.memorySnapshots.push({
            iteration: i + 1,
            memory: this.getCurrentMemoryUsage(),
            timestamp: Date.now()
          });
        }
        
      } catch (error) {
        const responseTime = performance.now() - startTime;
        
        results.measurements.push({
          iteration: i + 1,
          responseTime: responseTime,
          success: false,
          error: error.message
        });
        
        results.errors.push({
          iteration: i + 1,
          error: error.message,
          timestamp: Date.now()
        });
      }
      
      // CPU負荷軽減のための短い待機
      if (i % 50 === 0) {
        await this.sleep(10);
      }
    }
    
    results.endTime = Date.now();
    results.totalDuration = results.endTime - results.startTime;
    
    // 負荷テスト分析
    this.analyzeLoadTestResults(results);
    this.testResults.loadTests = results;
    
    console.log(`⚡ 負荷テスト完了: ${results.totalDuration}ms`);
  }

  /**
   * 負荷テスト結果分析
   */
  analyzeLoadTestResults(results) {
    const successfulMeasurements = results.measurements.filter(m => m.success);
    const failedMeasurements = results.measurements.filter(m => !m.success);
    
    results.analysis = {
      successRate: (successfulMeasurements.length / results.measurements.length) * 100,
      averageResponseTime: successfulMeasurements.reduce((sum, m) => sum + m.responseTime, 0) / successfulMeasurements.length,
      minResponseTime: Math.min(...successfulMeasurements.map(m => m.responseTime)),
      maxResponseTime: Math.max(...successfulMeasurements.map(m => m.responseTime)),
      errorRate: (failedMeasurements.length / results.measurements.length) * 100,
      throughput: (successfulMeasurements.length / (results.totalDuration / 1000)).toFixed(2), // req/sec
      memoryGrowth: this.calculateMemoryGrowth(results.memorySnapshots)
    };
    
    console.log(`📈 成功率: ${results.analysis.successRate.toFixed(1)}%`);
    console.log(`📈 平均応答時間: ${results.analysis.averageResponseTime.toFixed(2)}ms`);
    console.log(`📈 スループット: ${results.analysis.throughput} req/sec`);
    console.log(`📈 メモリ増加: ${results.analysis.memoryGrowth.toFixed(2)}MB`);
  }

  /**
   * メモリリークテスト
   */
  async runMemoryLeakTests() {
    console.log('🧠 メモリリークテスト開始');
    
    const results = {
      testDuration: 60000, // 1分間
      startTime: Date.now(),
      memorySnapshots: [],
      leakDetected: false,
      leakRate: 0
    };
    
    const testInput = this.testInputs[0];
    let iteration = 0;
    
    // 初期メモリ測定
    results.memorySnapshots.push({
      iteration: 0,
      memory: this.getCurrentMemoryUsage(),
      timestamp: Date.now()
    });
    
    const startTime = Date.now();
    
    while ((Date.now() - startTime) < results.testDuration) {
      try {
        // 分析実行
        if (window.ultraSpeedOptimizer) {
          await window.ultraSpeedOptimizer.optimizeComprehensiveAnalysis(testInput, null, null);
        }
        
        iteration++;
        
        // 5秒ごとにメモリ測定
        if (iteration % 20 === 0) {
          const currentMemory = this.getCurrentMemoryUsage();
          results.memorySnapshots.push({
            iteration: iteration,
            memory: currentMemory,
            timestamp: Date.now()
          });
          
          console.log(`  反復 ${iteration}: メモリ使用量 ${currentMemory.toFixed(2)}MB`);
        }
        
        // 短い待機
        await this.sleep(250);
        
      } catch (error) {
        console.warn('メモリリークテスト中のエラー:', error);
      }
    }
    
    // メモリリーク分析
    this.analyzeMemoryLeak(results);
    this.testResults.memoryTests = results;
    
    const status = results.leakDetected ? '❌ リーク検出' : '✅ リークなし';
    console.log(`🧠 メモリリークテスト完了: ${status}`);
  }

  /**
   * メモリリーク分析
   */
  analyzeMemoryLeak(results) {
    if (results.memorySnapshots.length < 2) return;
    
    const initialMemory = results.memorySnapshots[0].memory;
    const finalMemory = results.memorySnapshots[results.memorySnapshots.length - 1].memory;
    const memoryIncrease = finalMemory - initialMemory;
    
    results.memoryIncrease = memoryIncrease;
    results.leakDetected = memoryIncrease > this.testConfig.memoryLeakThreshold;
    
    // リーク率計算（MB/分）
    const durationMinutes = (results.memorySnapshots[results.memorySnapshots.length - 1].timestamp - results.memorySnapshots[0].timestamp) / 60000;
    results.leakRate = memoryIncrease / durationMinutes;
    
    console.log(`📊 メモリ増加: ${memoryIncrease.toFixed(2)}MB`);
    console.log(`📊 リーク率: ${results.leakRate.toFixed(2)}MB/分`);
  }

  /**
   * CPU使用率テスト
   */
  async runCPUUsageTests() {
    console.log('💻 CPU使用率テスト開始');
    
    const results = {
      testDuration: 30000, // 30秒間
      measurements: [],
      averageCPUUsage: 0,
      maxCPUUsage: 0,
      thresholdExceeded: false
    };
    
    const testInput = this.testInputs[0];
    const startTime = Date.now();
    
    while ((Date.now() - startTime) < results.testDuration) {
      const cpuStartTime = performance.now();
      
      try {
        // CPU集約的な処理実行
        if (window.ultraSpeedOptimizer) {
          await window.ultraSpeedOptimizer.optimizeComprehensiveAnalysis(testInput, null, null);
        }
        
        // CPU使用率推定（処理時間ベース）
        const processingTime = performance.now() - cpuStartTime;
        const estimatedCPUUsage = Math.min((processingTime / 100) * 100, 100); // 簡易推定
        
        results.measurements.push({
          timestamp: Date.now(),
          processingTime: processingTime,
          estimatedCPUUsage: estimatedCPUUsage
        });
        
        // 短い待機
        await this.sleep(1000);
        
      } catch (error) {
        console.warn('CPU使用率テスト中のエラー:', error);
      }
    }
    
    // CPU使用率分析
    this.analyzeCPUUsage(results);
    this.testResults.cpuTests = results;
    
    const status = results.thresholdExceeded ? '❌ 閾値超過' : '✅ 正常範囲';
    console.log(`💻 CPU使用率テスト完了: ${status} (平均: ${results.averageCPUUsage.toFixed(1)}%)`);
  }

  /**
   * CPU使用率分析
   */
  analyzeCPUUsage(results) {
    if (results.measurements.length === 0) return;
    
    const cpuUsages = results.measurements.map(m => m.estimatedCPUUsage);
    
    results.averageCPUUsage = cpuUsages.reduce((sum, usage) => sum + usage, 0) / cpuUsages.length;
    results.maxCPUUsage = Math.max(...cpuUsages);
    results.thresholdExceeded = results.averageCPUUsage > this.testConfig.cpuUsageThreshold;
    
    console.log(`📊 平均CPU使用率: ${results.averageCPUUsage.toFixed(1)}%`);
    console.log(`📊 最大CPU使用率: ${results.maxCPUUsage.toFixed(1)}%`);
  }

  /**
   * 回帰テスト
   */
  async runRegressionTests() {
    console.log('🔄 回帰テスト開始');
    
    // ベースライン性能を測定
    const baselineResults = await this.measureBaselinePerformance();
    
    // 最適化機能を無効にして比較
    const results = {
      baseline: baselineResults,
      optimized: await this.measureOptimizedPerformance(),
      regression: false,
      improvement: 0
    };
    
    // 回帰分析
    this.analyzeRegression(results);
    this.testResults.regressionTests = results;
    
    const status = results.regression ? '❌ 回帰検出' : '✅ 性能向上';
    console.log(`🔄 回帰テスト完了: ${status} (改善率: ${results.improvement.toFixed(1)}%)`);
  }

  /**
   * ベースライン性能測定
   */
  async measureBaselinePerformance() {
    const measurements = [];
    
    for (const input of this.testInputs.slice(0, 5)) {
      const startTime = performance.now();
      
      try {
        // 基本の分析エンジンを使用
        if (window.IntegratedAnalysisEngine) {
          const engine = new window.IntegratedAnalysisEngine();
          await engine.executeComprehensiveAnalysis(input);
        }
        
        const responseTime = performance.now() - startTime;
        measurements.push(responseTime);
        
      } catch (error) {
        measurements.push(Infinity);
      }
    }
    
    return {
      averageTime: measurements.reduce((sum, time) => sum + time, 0) / measurements.length,
      measurements: measurements
    };
  }

  /**
   * 最適化後性能測定
   */
  async measureOptimizedPerformance() {
    const measurements = [];
    
    for (const input of this.testInputs.slice(0, 5)) {
      const startTime = performance.now();
      
      try {
        // 最適化された分析エンジンを使用
        if (window.ultraSpeedOptimizer) {
          await window.ultraSpeedOptimizer.optimizeComprehensiveAnalysis(input, null, null);
        }
        
        const responseTime = performance.now() - startTime;
        measurements.push(responseTime);
        
      } catch (error) {
        measurements.push(Infinity);
      }
    }
    
    return {
      averageTime: measurements.reduce((sum, time) => sum + time, 0) / measurements.length,
      measurements: measurements
    };
  }

  /**
   * 回帰分析
   */
  analyzeRegression(results) {
    const baselineTime = results.baseline.averageTime;
    const optimizedTime = results.optimized.averageTime;
    
    const performanceChange = (baselineTime - optimizedTime) / baselineTime;
    
    results.improvement = performanceChange * 100;
    results.regression = performanceChange < -this.testConfig.regressionThreshold;
    
    console.log(`📊 ベースライン: ${baselineTime.toFixed(2)}ms`);
    console.log(`📊 最適化後: ${optimizedTime.toFixed(2)}ms`);
    console.log(`📊 性能変化: ${results.improvement.toFixed(1)}%`);
  }

  /**
   * テスト結果分析
   */
  analyzeTestResults() {
    const summary = {
      overall: {
        allTestsPassed: true,
        totalTests: 0,
        passedTests: 0
      },
      responseTime: {
        targetMet: this.testResults.responseTimeTests.every(r => r.targetMet),
        averageTime: this.testResults.responseTimeTests.reduce((sum, r) => sum + r.averageResponseTime, 0) / this.testResults.responseTimeTests.length
      },
      load: {
        successRate: this.testResults.loadTests.analysis?.successRate || 0,
        averageTime: this.testResults.loadTests.analysis?.averageResponseTime || 0,
        throughput: this.testResults.loadTests.analysis?.throughput || 0
      },
      memory: {
        leakDetected: this.testResults.memoryTests.leakDetected,
        memoryIncrease: this.testResults.memoryTests.memoryIncrease || 0
      },
      cpu: {
        thresholdExceeded: this.testResults.cpuTests.thresholdExceeded,
        averageUsage: this.testResults.cpuTests.averageCPUUsage || 0
      },
      regression: {
        detected: this.testResults.regressionTests.regression,
        improvement: this.testResults.regressionTests.improvement || 0
      }
    };
    
    // 全体の合格判定
    summary.overall.allTestsPassed = 
      summary.responseTime.targetMet &&
      summary.load.successRate > 95 &&
      !summary.memory.leakDetected &&
      !summary.cpu.thresholdExceeded &&
      !summary.regression.detected;
    
    this.testResults.summary = summary;
    
    console.log('📊 テスト結果サマリー:');
    console.log(`  応答時間目標達成: ${summary.responseTime.targetMet ? '✅' : '❌'}`);
    console.log(`  負荷テスト成功率: ${summary.load.successRate.toFixed(1)}%`);
    console.log(`  メモリリーク: ${summary.memory.leakDetected ? '❌ 検出' : '✅ なし'}`);
    console.log(`  CPU使用率: ${summary.cpu.thresholdExceeded ? '❌ 超過' : '✅ 正常'}`);
    console.log(`  回帰: ${summary.regression.detected ? '❌ 検出' : '✅ なし'}`);
    console.log(`  総合判定: ${summary.overall.allTestsPassed ? '✅ 合格' : '❌ 不合格'}`);
  }

  /**
   * 最終レポート生成
   */
  generateFinalReport() {
    const report = {
      version: this.version,
      timestamp: new Date().toISOString(),
      testConfiguration: this.testConfig,
      results: this.testResults,
      recommendations: this.generateRecommendations(),
      conclusion: this.generateConclusion()
    };
    
    console.log('📋 最終レポート生成完了');
    return report;
  }

  /**
   * 推奨事項生成
   */
  generateRecommendations() {
    const recommendations = [];
    const summary = this.testResults.summary;
    
    if (!summary.responseTime.targetMet) {
      recommendations.push({
        category: 'performance',
        priority: 'high',
        message: '応答時間目標未達成。並列処理の拡張やキャッシュ戦略の見直しを推奨します。'
      });
    }
    
    if (summary.load.successRate < 95) {
      recommendations.push({
        category: 'reliability',
        priority: 'high',
        message: '負荷テストで失敗が多発。エラーハンドリングの強化が必要です。'
      });
    }
    
    if (summary.memory.leakDetected) {
      recommendations.push({
        category: 'memory',
        priority: 'critical',
        message: 'メモリリークが検出されました。オブジェクトの生成・破棄パターンを見直してください。'
      });
    }
    
    if (summary.cpu.thresholdExceeded) {
      recommendations.push({
        category: 'cpu',
        priority: 'medium',
        message: 'CPU使用率が高すぎます。アルゴリズムの最適化やWebWorker活用を検討してください。'
      });
    }
    
    if (summary.regression.detected) {
      recommendations.push({
        category: 'regression',
        priority: 'high',
        message: '性能回帰が検出されました。最近の変更を見直してください。'
      });
    }
    
    return recommendations;
  }

  /**
   * 結論生成
   */
  generateConclusion() {
    const summary = this.testResults.summary;
    
    if (summary.overall.allTestsPassed) {
      return {
        status: 'PASS',
        message: 'すべてのパフォーマンステストに合格しました。1秒以内応答目標を達成しています。',
        confidence: 'HIGH'
      };
    } else {
      const issues = [];
      if (!summary.responseTime.targetMet) issues.push('応答時間');
      if (summary.load.successRate < 95) issues.push('負荷耐性');
      if (summary.memory.leakDetected) issues.push('メモリリーク');
      if (summary.cpu.thresholdExceeded) issues.push('CPU使用率');
      if (summary.regression.detected) issues.push('性能回帰');
      
      return {
        status: 'FAIL',
        message: `以下の項目で問題が検出されました: ${issues.join(', ')}。修正が必要です。`,
        confidence: 'HIGH'
      };
    }
  }

  /**
   * ヘルパーメソッド群
   */
  
  getCurrentMemoryUsage() {
    if (performance.memory) {
      return performance.memory.usedJSHeapSize / (1024 * 1024); // MB
    }
    return 0;
  }
  
  calculateMemoryGrowth(snapshots) {
    if (snapshots.length < 2) return 0;
    const initial = snapshots[0].memory;
    const final = snapshots[snapshots.length - 1].memory;
    return final - initial;
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * テストレポートをHTMLで出力
   */
  generateHTMLReport() {
    const report = this.generateFinalReport();
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>HAQEI Performance Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { background: #2c3e50; color: white; padding: 20px; border-radius: 8px; }
        .summary { background: #ecf0f1; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .test-section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .pass { color: #27ae60; font-weight: bold; }
        .fail { color: #e74c3c; font-weight: bold; }
        .metric { display: inline-block; margin: 10px 20px 10px 0; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #34495e; color: white; }
    </style>
</head>
<body>
    <div class="header">
        <h1>HAQEI Performance Test Report</h1>
        <p>Generated: ${report.timestamp}</p>
        <p>Version: ${report.version}</p>
    </div>
    
    <div class="summary">
        <h2>Test Summary</h2>
        <div class="metric">Overall Status: <span class="${report.conclusion.status === 'PASS' ? 'pass' : 'fail'}">${report.conclusion.status}</span></div>
        <div class="metric">Response Time Target: <span class="${report.results.summary.responseTime.targetMet ? 'pass' : 'fail'}">${report.results.summary.responseTime.targetMet ? 'MET' : 'NOT MET'}</span></div>
        <div class="metric">Average Response Time: ${report.results.summary.responseTime.averageTime.toFixed(2)}ms</div>
        <div class="metric">Load Test Success Rate: ${report.results.summary.load.successRate.toFixed(1)}%</div>
        <div class="metric">Memory Leak: <span class="${report.results.summary.memory.leakDetected ? 'fail' : 'pass'}">${report.results.summary.memory.leakDetected ? 'DETECTED' : 'NONE'}</span></div>
    </div>
    
    <div class="test-section">
        <h2>Response Time Tests</h2>
        <table>
            <tr><th>Test Case</th><th>Input</th><th>Avg Time (ms)</th><th>Target Met</th><th>Success Rate</th></tr>
            ${report.results.responseTimeTests.map(test => `
                <tr>
                    <td>${test.testCase}</td>
                    <td>${test.input}</td>
                    <td>${test.averageResponseTime.toFixed(2)}</td>
                    <td class="${test.targetMet ? 'pass' : 'fail'}">${test.targetMet ? 'YES' : 'NO'}</td>
                    <td>${test.successRate.toFixed(1)}%</td>
                </tr>
            `).join('')}
        </table>
    </div>
    
    <div class="test-section">
        <h2>Load Test Results</h2>
        <div class="metric">Iterations: ${report.results.loadTests.iterations}</div>
        <div class="metric">Success Rate: ${report.results.loadTests.analysis.successRate.toFixed(1)}%</div>
        <div class="metric">Average Response Time: ${report.results.loadTests.analysis.averageResponseTime.toFixed(2)}ms</div>
        <div class="metric">Throughput: ${report.results.loadTests.analysis.throughput} req/sec</div>
        <div class="metric">Memory Growth: ${report.results.loadTests.analysis.memoryGrowth.toFixed(2)}MB</div>
    </div>
    
    <div class="test-section">
        <h2>Recommendations</h2>
        <ul>
            ${report.recommendations.map(rec => `
                <li><strong>${rec.category.toUpperCase()} (${rec.priority})</strong>: ${rec.message}</li>
            `).join('')}
        </ul>
    </div>
    
    <div class="test-section">
        <h2>Conclusion</h2>
        <p><strong>Status:</strong> <span class="${report.conclusion.status === 'PASS' ? 'pass' : 'fail'}">${report.conclusion.status}</span></p>
        <p><strong>Message:</strong> ${report.conclusion.message}</p>
        <p><strong>Confidence:</strong> ${report.conclusion.confidence}</p>
    </div>
</body>
</html>
    `;
    
    return html;
  }
}

// グローバルインスタンス作成
if (typeof window !== 'undefined') {
  window.HAQEIPerformanceTestSuite = HAQEIPerformanceTestSuite;
  window.performanceTestSuite = new HAQEIPerformanceTestSuite();
  
  console.log('🧪 HAQEI Performance Test Suite 利用可能');
  
  // 自動実行オプション
  if (window.location.hash === '#run-tests') {
    console.log('🚀 自動テスト実行開始...');
    window.performanceTestSuite.runFullTestSuite().then(report => {
      console.log('📋 テスト完了 - 詳細レポート:', report);
    });
  }
}