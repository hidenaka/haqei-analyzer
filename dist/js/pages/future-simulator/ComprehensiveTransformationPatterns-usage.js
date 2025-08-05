/**
 * ComprehensiveTransformationPatterns 使用例とテストスイート
 * 
 * Created: 2025-08-04
 * Purpose: 7変化パターンエンジンの使用方法とテスト
 */

// 使用例デモンストレーション
class TransformationPatternsDemo {
  constructor() {
    this.engine = null;
    this.testResults = [];
  }

  /**
   * エンジン初期化とデモ実行
   */
  async runDemo() {
    console.log('🎯 ComprehensiveTransformationPatterns デモ開始');
    
    try {
      // エンジン初期化
      this.engine = new ComprehensiveTransformationPatterns();
      
      // 基本使用例
      await this.demoBasicUsage();
      
      // 無料版vs有料版比較
      await this.demoFreemiumComparison();
      
      // パフォーマンステスト
      await this.demoPerformanceTest();
      
      // エラーハンドリングテスト
      await this.demoErrorHandling();
      
      // キャッシュ機能テスト
      await this.demoCacheSystem();
      
      console.log('✅ 全デモ完了');
      this.generateReport();
      
    } catch (error) {
      console.error('❌ デモ実行エラー:', error);
    }
  }

  /**
   * 基本使用例
   */
  async demoBasicUsage() {
    console.log('\n📋 基本使用例デモ');
    
    const inputData = {
      hexagram: 29,      // 坎為水（水の困難）
      changingLines: [2, 5], // 第2爻と第5爻が変化
      userType: 'premium',
      context: {
        situation: 'career_challenge',
        urgency: 'high',
        timeframe: 'immediate'
      }
    };
    
    console.log('入力:', inputData);
    
    const result = await this.engine.calculateAllPatterns(inputData);
    
    console.log('結果概要:');
    console.log(`- 計算パターン数: ${result.patterns.length}`);
    console.log(`- 信頼度: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`- 支配的パターン: ${result.integration.dominantPattern?.name || 'なし'}`);
    
    this.testResults.push({
      test: 'basic_usage',
      success: result.patterns.length > 0,
      patternsCount: result.patterns.length,
      confidence: result.confidence
    });
  }

  /**
   * 無料版vs有料版比較デモ
   */
  async demoFreemiumComparison() {
    console.log('\n💰 無料版vs有料版比較デモ');
    
    const inputData = {
      hexagram: 51, // 震為雷（雷の衝撃）
      changingLines: [1, 3, 6],
      context: { situation: 'life_change' }
    };
    
    // 無料版結果
    const freeResult = await this.engine.calculateAllPatterns({
      ...inputData,
      userType: 'free'
    });
    
    // 有料版結果
    const premiumResult = await this.engine.calculateAllPatterns({
      ...inputData,
      userType: 'premium'
    });
    
    console.log('無料版結果:');
    console.log(`- 表示パターン数: ${freeResult.patterns.length}`);
    console.log(`- 隠れたパターン数: ${freeResult.hiddenPatternsCount}`);
    console.log(`- 表示パターン: ${freeResult.visiblePatternNames.join(', ')}`);
    
    console.log('\n有料版結果:');
    console.log(`- 全パターン数: ${premiumResult.patterns.length}`);
    console.log(`- フルアクセス: ${premiumResult.fullAccess}`);
    
    this.testResults.push({
      test: 'freemium_comparison',
      success: freeResult.patterns.length < premiumResult.patterns.length,
      freePatterns: freeResult.patterns.length,
      premiumPatterns: premiumResult.patterns.length
    });
  }

  /**
   * パフォーマンステスト
   */
  async demoPerformanceTest() {
    console.log('\n⚡ パフォーマンステスト');
    
    const testCases = [
      { hexagram: 1, changingLines: [] },
      { hexagram: 2, changingLines: [1] },
      { hexagram: 64, changingLines: [1, 2, 3, 4, 5, 6] }
    ];
    
    const startTime = performance.now();
    const results = [];
    
    // 並列実行テスト
    const promises = testCases.map(async (testCase) => {
      const caseStart = performance.now();
      const result = await this.engine.calculateAllPatterns({
        ...testCase,
        userType: 'premium'
      });
      const caseTime = performance.now() - caseStart;
      
      return {
        case: testCase,
        time: caseTime,
        success: !result.error
      };
    });
    
    const caseResults = await Promise.all(promises);
    const totalTime = performance.now() - startTime;
    
    console.log(`総実行時間: ${totalTime.toFixed(2)}ms`);
    console.log('個別ケース結果:');
    
    caseResults.forEach((caseResult, index) => {
      console.log(`  ケース${index + 1}: ${caseResult.time.toFixed(2)}ms (成功: ${caseResult.success})`);
    });
    
    const averageTime = caseResults.reduce((sum, r) => sum + r.time, 0) / caseResults.length;
    const under1Second = averageTime < 1000;
    
    console.log(`平均応答時間: ${averageTime.toFixed(2)}ms`);
    console.log(`1秒以内目標達成: ${under1Second ? '✅' : '❌'}`);
    
    this.testResults.push({
      test: 'performance',
      success: under1Second,
      averageTime,
      totalTime,
      under1Second
    });
  }

  /**
   * エラーハンドリングテスト
   */
  async demoErrorHandling() {
    console.log('\n🛡️ エラーハンドリングテスト');
    
    const errorCases = [
      { description: '無効な卦番号', data: { hexagram: 0 } },
      { description: '範囲外の卦番号', data: { hexagram: 100 } },
      { description: '無効な変爻', data: { hexagram: 1, changingLines: [0, 7] } },
      { description: 'null入力', data: null },
      { description: '空オブジェクト', data: {} }
    ];
    
    let errorHandlingSuccess = 0;
    
    for (const errorCase of errorCases) {
      try {
        console.log(`テスト: ${errorCase.description}`);
        const result = await this.engine.calculateAllPatterns(errorCase.data);
        
        if (result.error || result.fallbackResult) {
          console.log('  ✅ エラーが適切に処理された');
          errorHandlingSuccess++;
        } else {
          console.log('  ❌ エラーが検出されなかった');
        }
      } catch (error) {
        console.log('  ✅ 例外が適切にキャッチされた:', error.message);
        errorHandlingSuccess++;
      }
    }
    
    const errorHandlingRate = errorHandlingSuccess / errorCases.length;
    console.log(`エラーハンドリング成功率: ${(errorHandlingRate * 100).toFixed(1)}%`);
    
    this.testResults.push({
      test: 'error_handling',
      success: errorHandlingRate >= 0.8,
      successRate: errorHandlingRate,
      casesHandled: errorHandlingSuccess,
      totalCases: errorCases.length
    });
  }

  /**
   * キャッシュ機能テスト
   */
  async demoCacheSystem() {
    console.log('\n💾 キャッシュ機能テスト');
    
    const testData = {
      hexagram: 15, // 地山謙
      changingLines: [2, 4],
      userType: 'premium'
    };
    
    // 初回実行（キャッシュなし）
    const firstStart = performance.now();
    const firstResult = await this.engine.calculateAllPatterns(testData);
    const firstTime = performance.now() - firstStart;
    
    // 二回目実行（キャッシュヒット期待）
    const secondStart = performance.now();
    const secondResult = await this.engine.calculateAllPatterns(testData);
    const secondTime = performance.now() - secondStart;
    
    const speedImprovement = firstTime / secondTime;
    const cacheWorking = speedImprovement > 2; // 2倍以上高速化期待
    
    console.log(`初回実行時間: ${firstTime.toFixed(2)}ms`);
    console.log(`二回目実行時間: ${secondTime.toFixed(2)}ms`);
    console.log(`高速化倍率: ${speedImprovement.toFixed(2)}倍`);
    console.log(`キャッシュ動作: ${cacheWorking ? '✅' : '❌'}`);
    
    // 統計情報確認
    const stats = this.engine.getStatistics();
    console.log('キャッシュ統計:', stats.cacheStats);
    
    this.testResults.push({
      test: 'cache_system',
      success: cacheWorking,
      speedImprovement,
      firstTime,
      secondTime,
      cacheStats: stats.cacheStats
    });
  }

  /**
   * レポート生成
   */
  generateReport() {
    console.log('\n📊 テスト結果レポート');
    console.log('=' .repeat(50));
    
    const successfulTests = this.testResults.filter(r => r.success).length;
    const totalTests = this.testResults.length;
    const successRate = (successfulTests / totalTests * 100).toFixed(1);
    
    console.log(`総合成功率: ${successRate}% (${successfulTests}/${totalTests})`);
    console.log('');
    
    this.testResults.forEach((result, index) => {
      const status = result.success ? '✅' : '❌';
      console.log(`${index + 1}. ${result.test}: ${status}`);
      
      // 詳細情報
      Object.entries(result).forEach(([key, value]) => {
        if (key !== 'test' && key !== 'success') {
          console.log(`   ${key}: ${JSON.stringify(value)}`);
        }
      });
      console.log('');
    });
    
    // システム統計
    const systemStats = this.engine.getStatistics();
    console.log('システム統計:');
    console.log(`  バージョン: ${systemStats.version}`);
    console.log(`  サポートパターン数: ${systemStats.supportedPatterns.length}`);
    console.log(`  パフォーマンス:`, systemStats.performance);
    
    // 推奨事項
    console.log('\n💡 推奨事項:');
    if (successRate < 100) {
      console.log('- 失敗したテストケースの原因を調査してください');
    }
    if (systemStats.performance.averageResponseTime > 1000) {
      console.log('- 応答時間の最適化を検討してください');
    }
    if (systemStats.cacheStats.memorySize === 0) {
      console.log('- キャッシュシステムが動作していません');
    }
    if (successRate === 100) {
      console.log('- 全テストが成功しました！本格運用可能です');
    }
  }

  /**
   * 7パターン個別詳細テスト
   */
  async testIndividualPatterns() {
    console.log('\n🔍 7パターン個別詳細テスト');
    
    const testHexagram = 47; // 沢水困
    const testLines = [1, 4];
    
    const result = await this.engine.calculateAllPatterns({
      hexagram: testHexagram,
      changingLines: testLines,
      userType: 'premium',
      context: { situation: 'detailed_analysis' }
    });
    
    if (result.patterns) {
      result.patterns.forEach((pattern) => {
        console.log(`\n${pattern.name}（${pattern.pattern}）:`);
        console.log(`  説明: ${pattern.description}`);
        console.log(`  無料版表示: ${pattern.displayInFree ? 'あり' : 'なし'}`);
        
        // パターン固有の詳細情報表示
        this.displayPatternDetails(pattern);
      });
    }
  }

  /**
   * パターン詳細表示
   */
  displayPatternDetails(pattern) {
    const details = {};
    
    // パターン固有フィールドを抽出
    Object.keys(pattern).forEach(key => {
      if (!['pattern', 'name', 'description', 'displayInFree', 'error', 'fallback'].includes(key)) {
        details[key] = pattern[key];
      }
    });
    
    if (Object.keys(details).length > 0) {
      console.log('  詳細:', JSON.stringify(details, null, 4));
    }
  }

  /**
   * Gemini API統合テスト準備
   */
  async demoGeminiIntegration() {
    console.log('\n🤖 Gemini API統合準備テスト');
    
    const result = await this.engine.calculateAllPatterns({
      hexagram: 1,
      changingLines: [1, 6],
      userType: 'premium'
    });
    
    // Gemini用データ構造準備
    const geminiData = this.engine.prepareGeminiData(result);
    
    console.log('Gemini用データ構造:');
    console.log(JSON.stringify(geminiData, null, 2));
    
    // データ構造検証
    const hasRequiredFields = geminiData.patterns && geminiData.context;
    const hasInsights = geminiData.patterns.every(p => p.insights);
    
    console.log(`必須フィールド: ${hasRequiredFields ? '✅' : '❌'}`);
    console.log(`洞察データ: ${hasInsights ? '✅' : '❌'}`);
    
    this.testResults.push({
      test: 'gemini_integration',
      success: hasRequiredFields && hasInsights,
      dataStructure: geminiData
    });
  }
}

/**
 * 簡易テスト実行関数
 */
async function quickTest() {
  console.log('🚀 ComprehensiveTransformationPatterns 簡易テスト');
  
  const engine = new ComprehensiveTransformationPatterns();
  
  // 基本テスト
  const result = await engine.calculateAllPatterns({
    hexagram: 29,
    changingLines: [2, 5],
    userType: 'free'
  });
  
  console.log('テスト結果:', {
    success: !result.error,
    patternsCount: result.patterns?.length || 0,
    userType: result.userType,
    hiddenPatterns: result.hiddenPatternsCount || 0
  });
  
  return result;
}

/**
 * パフォーマンス診断
 */
async function runDiagnostics() {
  console.log('🔍 システム診断実行');
  
  const engine = new ComprehensiveTransformationPatterns();
  const diagnostics = await engine.runDiagnostics();
  
  console.log('診断結果:', diagnostics);
  
  return diagnostics;
}

// 使用例：HTMLページで実行
async function initializeAndTest() {
  try {
    // デモ実行
    const demo = new TransformationPatternsDemo();
    await demo.runDemo();
    
    // 個別パターンテスト
    await demo.testIndividualPatterns();
    
    // Gemini統合テスト
    await demo.demoGeminiIntegration();
    
    console.log('🎉 全テスト完了！');
    
  } catch (error) {
    console.error('❌ テスト実行エラー:', error);
  }
}

// グローバルスコープにエクスポート
if (typeof window !== 'undefined') {
  window.TransformationPatternsDemo = TransformationPatternsDemo;
  window.quickTest = quickTest;
  window.runDiagnostics = runDiagnostics;
  window.initializeAndTest = initializeAndTest;
}

console.log('📚 ComprehensiveTransformationPatterns 使用例とテストスイート読み込み完了');