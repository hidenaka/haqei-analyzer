/**
 * 新しい表示システムのテスト
 */

import { chromium } from 'playwright';

async function testNewDisplay() {
  console.log('🌟 新表示システムテスト開始');
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
    await page.fill('textarea', '新しいプロジェクトを始めたいが、タイミングが分からない。準備は整っているが、市場の反応が読めない。');
    
    console.log('🔍 分析実行');
    await page.click('#aiGuessBtn');
    
    // 表示待機
    await page.waitForTimeout(3000);
    
    // 新しい表示確認
    const displayCheck = await page.evaluate(() => {
      const container = document.getElementById('resultsContainer');
      const hasNewDisplay = !!document.querySelector('.future-simulator-container');
      const hasCards = document.querySelectorAll('.scenario-card').length;
      const hasChart = !!document.getElementById('scoreChart');
      
      return {
        containerVisible: container?.style.display !== 'none',
        hasNewDisplay: hasNewDisplay,
        cardCount: hasCards,
        hasChart: hasChart,
        currentSituation: document.querySelector('.current-situation .situation-info')?.innerText
      };
    });
    
    console.log('\n📊 表示チェック結果:');
    console.log(`  コンテナ表示: ${displayCheck.containerVisible ? '✅' : '❌'}`);
    console.log(`  新表示システム: ${displayCheck.hasNewDisplay ? '✅' : '❌'}`);
    console.log(`  カード数: ${displayCheck.cardCount}枚`);
    console.log(`  グラフ表示: ${displayCheck.hasChart ? '✅' : '❌'}`);
    
    if (displayCheck.currentSituation) {
      console.log('\n📍 現在の状況:');
      console.log(`  ${displayCheck.currentSituation}`);
    }
    
    // カードクリックテスト
    if (displayCheck.cardCount > 0) {
      console.log('\n🖱️ カードクリックテスト');
      await page.click('.scenario-card:first-child');
      await page.waitForTimeout(1000);
      
      const modalVisible = await page.evaluate(() => {
        const modal = document.getElementById('detailModal');
        return modal?.style.display !== 'none';
      });
      
      console.log(`  モーダル表示: ${modalVisible ? '✅' : '❌'}`);
      
      if (modalVisible) {
        const modalContent = await page.evaluate(() => {
          const body = document.getElementById('modalBody');
          return {
            hasContent: !!body?.innerHTML,
            hasSummary: !!body?.querySelector('.summary')
          };
        });
        
        console.log(`  詳細コンテンツ: ${modalContent.hasContent ? '✅' : '❌'}`);
        console.log(`  総合評価セクション: ${modalContent.hasSummary ? '✅' : '❌'}`);
      }
    }
    
    // スクリーンショット
    await page.screenshot({ 
      path: '20250816_new_display_test.png',
      fullPage: false
    });
    console.log('\n📸 スクリーンショット: 20250816_new_display_test.png');
    
    // 成功判定
    const success = displayCheck.hasNewDisplay && 
                   displayCheck.cardCount === 8 && 
                   displayCheck.hasChart;
    
    console.log('\n' + (success ? '✅ テスト成功！' : '❌ テスト失敗'));
    
  } finally {
    console.log('\n⏰ 10秒後にブラウザを閉じます...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
}

// 実行
testNewDisplay().catch(console.error);