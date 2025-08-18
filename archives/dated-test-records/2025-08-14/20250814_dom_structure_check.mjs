import { chromium } from 'playwright';

console.log('🔍 DOM構造の重複チェック\n');

async function checkDuplicates() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    await page.goto('file:///Users/hideakimacbookair/Desktop/haqei-analyzer/public/future_simulator.html');
    await page.waitForTimeout(2000);
    
    // テスト実行
    await page.fill('#worryInput', '転職を検討していますが、タイミングが分からず悩んでいます');
    await page.click('#aiGuessBtn');
    await page.waitForTimeout(5000);
    
    // 重複チェック
    const analysis = await page.evaluate(() => {
      // シナリオカードの検出
      const allCards = document.querySelectorAll('.scenario-card');
      const cardsInContainer = document.querySelectorAll('#scenarioCardsContainer .scenario-card');
      const cardsOutside = document.querySelectorAll('.scenarios-container .scenario-card');
      
      // テキスト重複チェック
      const textMap = new Map();
      allCards.forEach((card, i) => {
        const text = card.textContent.trim().substring(0, 50);
        if (!textMap.has(text)) {
          textMap.set(text, []);
        }
        textMap.get(text).push(i);
      });
      
      const duplicates = [];
      textMap.forEach((indices, text) => {
        if (indices.length > 1) {
          duplicates.push({ text, count: indices.length, indices });
        }
      });
      
      return {
        totalCards: allCards.length,
        inContainer: cardsInContainer.length,
        outside: cardsOutside.length,
        duplicates,
        containers: {
          scenarioCardsContainer: !!document.getElementById('scenarioCardsContainer'),
          resultsContainer: !!document.getElementById('resultsContainer'),
          scenariosContainer: !!document.querySelector('.scenarios-container')
        }
      };
    });
    
    console.log('📊 DOM分析結果:');
    console.log(`  総カード数: ${analysis.totalCards}`);
    console.log(`  scenarioCardsContainer内: ${analysis.inContainer}`);
    console.log(`  scenarios-container内: ${analysis.outside}`);
    console.log(`  重複: ${analysis.duplicates.length}個`);
    
    if (analysis.duplicates.length > 0) {
      console.log('\n⚠️ 重複カード:');
      analysis.duplicates.forEach(d => {
        console.log(`  "${d.text}..." × ${d.count}回`);
      });
    }
    
    console.log('\nコンテナ存在確認:', analysis.containers);
    
    // スクリーンショット
    await page.screenshot({ path: '20250814_dom_check.png', fullPage: true });
    
    console.log('\n⏳ 手動確認用（10秒待機）...');
    await page.waitForTimeout(10000);
    
  } finally {
    await browser.close();
  }
}

checkDuplicates();