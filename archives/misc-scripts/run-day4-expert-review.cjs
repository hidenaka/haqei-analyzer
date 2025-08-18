// Day 4: 専門家レビュー実行スクリプト
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('📅 Day 4: 専門家レビュー実行開始');
    console.log('🎯 目標: 易経・HaQei・UX の3専門家による詳細評価');
    
    // Future Simulatorページに移動
    await page.goto('http://localhost:8091/future_simulator.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(10000);
    
    console.log('🔍 専門家レビュー実行...');
    
    const expertReviewResult = await page.evaluate(async () => {
      try {
        const orchestrator = new window.ValidationOrchestrator();
        
        console.log('📋 専門家レビュー開始...');
        const expertResult = await orchestrator.runExpertReview();
        
        return {
          success: true,
          expertReview: expertResult
        };
        
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    });
    
    if (expertReviewResult.success) {
      const review = expertReviewResult.expertReview;
      
      console.log('\\n🎉 専門家レビュー実行成功！');
      console.log('📊 専門家評価結果:');
      console.log(`   • 総合スコア: ${review.overallScore.toFixed(2)}/5.0`);
      
      console.log('\\n👨‍🎓 易経専門家評価:');
      console.log(`   • スコア: ${review.evaluations.ichingExpert.score}/5.0`);
      console.log(`   • 評価: ${review.evaluations.ichingExpert.feedback}`);
      console.log('   • 推奨改善:');
      review.evaluations.ichingExpert.recommendations.forEach(rec => {
        console.log(`     - ${rec}`);
      });
      
      console.log('\\n🧠 HaQei哲学専門家評価:');
      console.log(`   • スコア: ${review.evaluations.haqeiExpert.score}/5.0`);
      console.log(`   • 評価: ${review.evaluations.haqeiExpert.feedback}`);
      console.log('   • 推奨改善:');
      review.evaluations.haqeiExpert.recommendations.forEach(rec => {
        console.log(`     - ${rec}`);
      });
      
      console.log('\\n🎨 UX専門家評価:');
      console.log(`   • スコア: ${review.evaluations.uxExpert.score}/5.0`);
      console.log(`   • 評価: ${review.evaluations.uxExpert.feedback}`);
      console.log('   • 推奨改善:');
      review.evaluations.uxExpert.recommendations.forEach(rec => {
        console.log(`     - ${rec}`);
      });
      
      console.log('\\n📋 合否基準評価:');
      console.log(`   • 基準クリア: ${review.passingCriteria.pass ? 'YES' : 'NO'}`);
      console.log(`   • 平均スコア: ${review.passingCriteria.avgScore}/5.0 (基準: ${review.passingCriteria.threshold}/5.0)`);
      
      console.log('\\n💡 統合改善推奨 (Top 5):');
      review.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec}`);
      });
      
      // 合否判定
      const passThreshold = 4.0;
      if (review.overallScore >= passThreshold) {
        console.log('\\n✅ 専門家レビュー: 基準クリア');
        console.log('🚀 Day 5ユーザーテストへ進行可能');
      } else {
        console.log('\\n⚠️ 専門家レビュー: 改善が必要');
        console.log(`現在 ${review.overallScore.toFixed(2)}/5.0, 必要 ${passThreshold}/5.0`);
      }
      
    } else {
      console.error('❌ 専門家レビュー実行失敗:', expertReviewResult.error);
    }
    
    // Day 4完了確認
    console.log('\\n📅 Day 4完了ステータス確認...');
    const day4Status = await page.evaluate(() => {
      const orchestrator = new window.ValidationOrchestrator();
      const results = orchestrator.results;
      
      return {
        day1Setup: results.day1Setup,
        aiValidationCompleted: !!results.aiValidation,
        expertReviewCompleted: !!results.expertReview,
        systemInfo: orchestrator.getSystemInfo()
      };
    });
    
    console.log('📊 スプリント進行状況:');
    console.log(`   • Day 1セットアップ: ${day4Status.day1Setup ? '✅' : '❌'}`);
    console.log(`   • Day 2-3 AIバリデーション: ${day4Status.aiValidationCompleted ? '✅' : '❌'}`);
    console.log(`   • Day 4専門家レビュー: ${day4Status.expertReviewCompleted ? '✅' : '❌'}`);
    
    if (day4Status.day1Setup && day4Status.aiValidationCompleted && day4Status.expertReviewCompleted) {
      console.log('\\n🎯 Day 4専門家レビュー完了');
      console.log('📅 次のステップ: Day 5ユーザーテスト実行');
    } else {
      console.log('\\n⚠️ Day 4未完了項目があります');
    }
    
  } catch (error) {
    console.error('❌ Day 4実行エラー:', error);
  } finally {
    await page.waitForTimeout(3000);
    await browser.close();
  }
})();