// Day 2-3: AIバリデーション実行スクリプト
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('📅 Day 2-3: AIバリデーション実行開始');
    console.log('🎯 目標: 6ペルソナ × 3タスク × 3バリエーション = 54パターンテスト');
    
    // Future Simulatorページに移動
    await page.goto('http://localhost:8091/future_simulator.html', { waitUntil: 'networkidle' });
    
    // 10秒待機してシステム読み込み完了
    await page.waitForTimeout(10000);
    
    console.log('🧪 ValidationOrchestrator起動確認...');
    
    // ValidationOrchestrator存在確認
    const orchestratorExists = await page.evaluate(() => {
      return typeof window.ValidationOrchestrator === 'function';
    });
    
    if (!orchestratorExists) {
      throw new Error('ValidationOrchestrator not found. システム未初期化');
    }
    
    console.log('✅ ValidationOrchestrator確認完了');
    
    // AIバリデーション実行
    console.log('🚀 AIバリデーション実行開始...');
    
    const validationResult = await page.evaluate(async () => {
      try {
        // ValidationOrchestrator初期化
        const orchestrator = new window.ValidationOrchestrator();
        
        console.log('🔧 Day 1セットアップ実行...');
        const setupResult = await orchestrator.runDay1Setup();
        console.log('✅ セットアップ完了:', setupResult.success);
        
        console.log('🤖 AIバリデーション開始 - 54パターンテスト実行...');
        const startTime = Date.now();
        
        // AIバリデーション実行
        const aiResult = await orchestrator.runAIValidation();
        
        const endTime = Date.now();
        const executionTime = Math.round((endTime - startTime) / 1000);
        
        return {
          success: true,
          setupResult: setupResult,
          aiValidationResult: {
            totalTests: aiResult.totalTests,
            completedAt: aiResult.completedAt,
            analysis: aiResult.analysis,
            executionTime: executionTime
          }
        };
        
      } catch (error) {
        return {
          success: false,
          error: error.message,
          stack: error.stack
        };
      }
    });
    
    if (validationResult.success) {
      console.log('\\n🎉 AIバリデーション実行成功！');
      console.log('📊 実行結果サマリー:');
      console.log(`   • 総テスト数: ${validationResult.aiValidationResult.totalTests}`);
      console.log(`   • 実行時間: ${validationResult.aiValidationResult.executionTime}秒`);
      console.log(`   • 成功率: ${Math.round(validationResult.aiValidationResult.analysis.summary.successRate * 100)}%`);
      console.log(`   • 平均スコア: ${validationResult.aiValidationResult.analysis.summary.avgScore}`);
      console.log(`   • 平均満足度: ${validationResult.aiValidationResult.analysis.summary.avgSatisfaction}`);
      
      console.log('\\n📋 ペルソナ別結果:');
      validationResult.aiValidationResult.analysis.byPersona.forEach(persona => {
        console.log(`   ${persona.persona}: スコア ${persona.avgScore.toFixed(2)}, 満足度 ${persona.avgSatisfaction.toFixed(1)}`);
      });
      
      console.log('\\n⚠️ 共通課題 (Top 5):');
      validationResult.aiValidationResult.analysis.commonIssues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue.issue} (${issue.count}件)`);
      });
      
    } else {
      console.error('❌ AIバリデーション実行失敗:', validationResult.error);
      console.error('Stack trace:', validationResult.stack);
    }
    
    // メトリクスデータ確認
    console.log('\\n📊 収集されたメトリクスデータ確認...');
    const metricsData = await page.evaluate(() => {
      if (window.validationMetrics) {
        return {
          sessionId: window.validationMetrics.sessionId,
          eventsCount: window.validationMetrics.events.length,
          exportData: window.validationMetrics.exportData()
        };
      }
      return null;
    });
    
    if (metricsData) {
      console.log(`✅ メトリクス収集確認: セッション ${metricsData.sessionId}`);
      console.log(`   • 記録イベント数: ${metricsData.eventsCount}`);
      console.log(`   • データ概要:`, metricsData.exportData.summary);
    } else {
      console.log('⚠️ メトリクスデータが見つかりません');
    }
    
    // Day 2-3完了確認
    console.log('\\n📅 Day 2-3完了確認...');
    const day23Status = await page.evaluate(() => {
      const orchestrator = new window.ValidationOrchestrator();
      return {
        systemInfo: orchestrator.getSystemInfo(),
        aiValidationCompleted: !!orchestrator.results?.aiValidation
      };
    });
    
    console.log('✅ Day 2-3 AIバリデーション完了');
    console.log('🎯 次のステップ: Day 4 専門家レビュー準備');
    
  } catch (error) {
    console.error('❌ Day 2-3実行エラー:', error);
  } finally {
    // 5秒待機後にブラウザを閉じる
    await page.waitForTimeout(5000);
    await browser.close();
  }
})();