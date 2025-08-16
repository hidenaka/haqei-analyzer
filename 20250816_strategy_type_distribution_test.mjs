/**
 * 戦略タイプ分散改善検証テスト
 * 強制分散ロジック効果測定
 */

import { chromium } from 'playwright';

async function strategyTypeDistributionTest() {
  console.log('🎯 戦略タイプ分散改善検証開始');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:8788/future_simulator.html', { waitUntil: 'networkidle' });
    
    // テスト入力
    await page.fill('textarea', '新しい挑戦と安定のバランスを考えている');
    await page.click('#aiGuessBtn');
    await page.waitForTimeout(3000);
    
    // コンソールログをキャプチャ
    const logs = [];
    page.on('console', msg => {
      if (msg.text().includes('戦略タイプスコア分布') || msg.text().includes('選択された戦略タイプ')) {
        logs.push(msg.text());
      }
    });
    
    // 1秒待ってからコンソールログを収集
    await page.waitForTimeout(1000);
    
    const results = await page.evaluate(() => {
      const cards = document.querySelectorAll('.scenario-card');
      const strategyTypes = [...new Set(Array.from(cards).map(card => 
        card.querySelector('.strategy-type')?.innerText || 'なし'
      ))];
      
      const typeDistribution = {};
      Array.from(cards).forEach(card => {
        const type = card.querySelector('.strategy-type')?.innerText || 'なし';
        typeDistribution[type] = (typeDistribution[type] || 0) + 1;
      });
      
      return {
        cardCount: cards.length,
        strategyTypeCount: strategyTypes.length,
        strategyTypes: strategyTypes,
        typeDistribution: typeDistribution,
        detailedTypes: Array.from(cards).map((card, index) => ({
          scenarioId: index + 1,
          type: card.querySelector('.strategy-type')?.innerText || 'なし',
          description: card.querySelector('.process-description')?.innerText || ''
        }))
      };
    });
    
    // 結果分析
    console.log('📊 戦略タイプ分散改善検証結果:');
    console.log(`  カード数: ${results.cardCount}枚`);
    console.log(`  戦略タイプ数: ${results.strategyTypeCount}種類`);
    console.log('  タイプ分布:');
    Object.entries(results.typeDistribution).forEach(([type, count]) => {
      console.log(`    ${type}: ${count}枚`);
    });
    
    console.log('\n🎯 シナリオ別戦略タイプ:');
    results.detailedTypes.forEach(item => {
      console.log(`  シナリオ${item.scenarioId}: ${item.type}`);
    });
    
    // コンソールログ出力
    if (logs.length > 0) {
      console.log('\n🔍 コンソールログ:');
      logs.forEach(log => console.log(`  ${log}`));
    }
    
    // 成功判定
    const success = results.cardCount === 8 && 
                   results.strategyTypeCount >= 4;
    
    console.log(`\n🎯 改善結果: ${success ? '✅ 成功 (4+種類達成)' : '⚠️ 要追加改善'}`);
    
    return {
      success,
      typeCount: results.strategyTypeCount,
      distribution: results.typeDistribution,
      details: results.detailedTypes
    };
    
  } finally {
    await page.waitForTimeout(5000);
    await browser.close();
  }
}

const testResult = await strategyTypeDistributionTest().catch(console.error);
console.log('\n📄 戦略タイプ分散改善検証完了');

export default testResult;