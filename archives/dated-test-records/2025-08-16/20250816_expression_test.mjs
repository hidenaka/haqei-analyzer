/**
 * 感情配慮表現エンジンテスト
 */

import { chromium } from 'playwright';

async function testExpressionEngine() {
  console.log('🎭 感情配慮表現エンジンテスト開始');
  console.log('=====================================\n');
  
  const browser = await chromium.launch({ 
    headless: false
  });
  
  try {
    const page = await browser.newPage();
    
    await page.goto('http://localhost:8788/future_simulator.html', { 
      waitUntil: 'networkidle'
    });
    
    console.log('📝 テスト入力実行');
    await page.fill('textarea', '新しい挑戦をしたいが、失敗のリスクが心配。今は安定しているが将来への不安もある。');
    
    console.log('🔍 分析実行');
    await page.click('#aiGuessBtn');
    
    // 表示待機
    await page.waitForTimeout(3000);
    
    // 表現エンジンの動作確認
    const expressionCheck = await page.evaluate(() => {
      // 表現エンジンが読み込まれているか
      const hasExpressionEngine = !!window.FutureSimulatorExpression;
      
      // カードの表現改善確認
      const cards = document.querySelectorAll('.scenario-card');
      const cardTexts = Array.from(cards).slice(0, 3).map(card => ({
        header: card.querySelector('.card-header')?.innerText,
        strategyType: card.querySelector('.strategy-type')?.innerText,
        processDescription: card.querySelector('.process-description')?.innerText,
        difficulty: card.querySelector('.difficulty')?.innerText,
        trend: card.querySelector('.trend')?.innerText
      }));
      
      return {
        hasExpressionEngine,
        cardCount: cards.length,
        cardTexts,
        hasStrategyIcons: !!document.querySelector('.strategy-type'),
        hasDifficulty: !!document.querySelector('.difficulty')
      };
    });
    
    console.log('\n📊 表現エンジンチェック結果:');
    console.log(`  表現エンジン読み込み: ${expressionCheck.hasExpressionEngine ? '✅' : '❌'}`);
    console.log(`  カード数: ${expressionCheck.cardCount}枚`);
    console.log(`  戦略タイプ表示: ${expressionCheck.hasStrategyIcons ? '✅' : '❌'}`);
    console.log(`  難易度表示: ${expressionCheck.hasDifficulty ? '✅' : '❌'}`);
    
    // カード内容詳細確認
    if (expressionCheck.cardTexts.length > 0) {
      console.log('\n📋 カード表現内容:');
      expressionCheck.cardTexts.forEach((card, i) => {
        console.log(`  カード${i+1}:`);
        console.log(`    ヘッダー: ${card.header || 'なし'}`);
        console.log(`    戦略タイプ: ${card.strategyType || 'なし'}`);
        console.log(`    説明: ${card.processDescription || 'なし'}`);
        console.log(`    難易度: ${card.difficulty || 'なし'}`);
        console.log(`    トレンド: ${card.trend || 'なし'}`);
      });
    }
    
    // モーダル詳細表現確認
    if (expressionCheck.cardCount > 0) {
      console.log('\n🖱️ モーダル表現テスト');
      await page.click('.scenario-card:first-child');
      await page.waitForTimeout(1000);
      
      const modalExpressionCheck = await page.evaluate(() => {
        const modal = document.getElementById('detailModal');
        const modalBody = document.getElementById('modalBody');
        
        return {
          modalVisible: modal?.style.display !== 'none',
          hasScoreExpression: !!modalBody?.querySelector('.score-expression'),
          hasGuidance: !!modalBody?.querySelector('.guidance'),
          hasPrediction: !!modalBody?.querySelector('.prediction'),
          hasPredictionSummary: !!modalBody?.querySelector('.prediction-summary'),
          modalContent: modalBody?.innerText?.substring(0, 200)
        };
      });
      
      console.log(`  モーダル表示: ${modalExpressionCheck.modalVisible ? '✅' : '❌'}`);
      console.log(`  感情配慮スコア: ${modalExpressionCheck.hasScoreExpression ? '✅' : '❌'}`);
      console.log(`  行動指針: ${modalExpressionCheck.hasGuidance ? '✅' : '❌'}`);
      console.log(`  予測表現: ${modalExpressionCheck.hasPrediction ? '✅' : '❌'}`);
      console.log(`  予測サマリー: ${modalExpressionCheck.hasPredictionSummary ? '✅' : '❌'}`);
      
      if (modalExpressionCheck.modalContent) {
        console.log(`\n📝 モーダル内容サンプル:\n  "${modalExpressionCheck.modalContent}..."`);
      }
    }
    
    // 統一性チェック
    const unityCheck = await page.evaluate(() => {
      const hasHaQeiMentions = document.body.innerText.includes('HaQei');
      const hasPredictionLanguage = document.body.innerText.includes('予測され') || 
                                   document.body.innerText.includes('見込まれ') ||
                                   document.body.innerText.includes('期待でき');
      const hasEmotionalCare = document.body.innerText.includes('準備・調整期') ||
                              document.body.innerText.includes('順調な発展期');
      
      return {
        hasHaQeiMentions,
        hasPredictionLanguage,
        hasEmotionalCare
      };
    });
    
    console.log('\n🎯 統一性チェック:');
    console.log(`  HaQeiブランド言及: ${unityCheck.hasHaQeiMentions ? '✅' : '❌'}`);
    console.log(`  予測・推測表現: ${unityCheck.hasPredictionLanguage ? '✅' : '❌'}`);
    console.log(`  感情配慮表現: ${unityCheck.hasEmotionalCare ? '✅' : '❌'}`);
    
    // スクリーンショット
    await page.screenshot({ 
      path: '20250816_expression_test.png',
      fullPage: false
    });
    console.log('\n📸 スクリーンショット: 20250816_expression_test.png');
    
    // 総合評価
    const success = expressionCheck.hasExpressionEngine && 
                   expressionCheck.hasStrategyIcons && 
                   unityCheck.hasHaQeiMentions &&
                   unityCheck.hasPredictionLanguage;
    
    console.log('\n' + (success ? '✅ 感情配慮表現テスト成功！' : '❌ テスト失敗'));
    
  } finally {
    console.log('\n⏰ 10秒後にブラウザを閉じます...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
}

// 実行
testExpressionEngine().catch(console.error);