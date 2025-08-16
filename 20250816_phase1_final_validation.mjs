/**
 * Phase 1 最終検証テスト
 */

import { chromium } from 'playwright';

async function finalValidation() {
  console.log('🎯 Phase 1 最終検証開始');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:8788/future_simulator.html', { waitUntil: 'networkidle' });
    
    // テスト入力
    await page.fill('textarea', '新しい挑戦と安定のバランスを考えている');
    await page.click('#aiGuessBtn');
    await page.waitForTimeout(3000);
    
    const results = await page.evaluate(() => {
      const cards = document.querySelectorAll('.scenario-card');
      const descriptions = Array.from(cards).map(card => {
        const desc = card.querySelector('.process-description')?.innerText || '';
        return { length: desc.length, hasEllipsis: desc.includes('...'), content: desc };
      });
      
      const strategyTypes = [...new Set(Array.from(cards).map(card => 
        card.querySelector('.strategy-type')?.innerText || 'なし'
      ))];
      
      const bodyText = document.body.innerText;
      
      return {
        cardCount: cards.length,
        descriptions: descriptions,
        strategyTypeCount: strategyTypes.length,
        strategyTypes: strategyTypes,
        hasHaQei: bodyText.includes('HaQei'),
        hasPrediction: bodyText.includes('予測され') || bodyText.includes('見込まれ')
      };
    });
    
    // 検証結果
    console.log('📊 最終検証結果:');
    console.log(`  カード数: ${results.cardCount}枚`);
    console.log(`  戦略タイプ数: ${results.strategyTypeCount}種類 (${results.strategyTypes.join(', ')})`);
    console.log(`  HaQei言及: ${results.hasHaQei ? '✅' : '❌'}`);
    console.log(`  予測表現: ${results.hasPrediction ? '✅' : '❌'}`);
    
    const avgLength = results.descriptions.reduce((sum, d) => sum + d.length, 0) / results.descriptions.length;
    console.log(`  平均説明文長: ${Math.round(avgLength)}文字`);
    
    const success = results.cardCount === 8 && 
                   results.strategyTypeCount >= 4 && 
                   results.hasHaQei && 
                   avgLength > 40;
    
    console.log(`\\n🎯 Phase 1 実装結果: ${success ? '✅ 成功' : '⚠️ 要改善'}`);
    
    return success;
    
  } finally {
    await page.waitForTimeout(5000);
    await browser.close();
  }
}

const success = await finalValidation().catch(console.error);
console.log('\\n📄 最終検証完了');