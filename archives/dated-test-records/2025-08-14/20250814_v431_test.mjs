import { chromium } from 'playwright';

console.log('🔍 Future Simulator v4.3.1 動作テスト\n');

async function testV431() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 200
  });
  const page = await browser.newPage();
  
  // コンソールログ監視
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('v4.3.1')) {
      console.log(`✅ [v4.3.1] ${text}`);
    } else if (text.includes('error') || text.includes('Error')) {
      console.log(`❌ [ERROR] ${text}`);
    }
  });
  
  try {
    console.log('📄 ページ読み込み...');
    await page.goto('file:///Users/hideakimacbookair/Desktop/haqei-analyzer/public/future_simulator.html');
    await page.waitForTimeout(3000);
    
    // v4.3.1の初期化確認
    const v431Status = await page.evaluate(() => {
      return {
        v431Exists: !!window.FutureSimulatorV431,
        buttonBound: document.getElementById('aiGuessBtn')?.dataset?.bound === '1'
      };
    });
    
    console.log('\n📊 v4.3.1 初期化状態:');
    console.log(`  FutureSimulatorV431: ${v431Status.v431Exists ? '✅' : '❌'}`);
    console.log(`  ボタンバインド: ${v431Status.buttonBound ? '✅' : '❌'}`);
    
    // テスト実行
    console.log('\n📝 テスト実行...');
    await page.fill('#worryInput', '転職を検討していますが、タイミングが分からず悩んでいます');
    await page.click('#aiGuessBtn');
    
    console.log('⏳ 結果を待機中...');
    await page.waitForTimeout(3000);
    
    // 結果確認
    const results = await page.evaluate(() => {
      // v4.3.1のカードを探す
      const v431Cards = document.querySelectorAll('.scenario-card-v431');
      const oldCards = document.querySelectorAll('.scenario-card');
      const resultsContainer = document.getElementById('resultsContainer');
      
      // Trace ID確認
      const traceElement = Array.from(document.querySelectorAll('div')).find(
        el => el.textContent.includes('Trace ID:')
      );
      
      return {
        v431CardCount: v431Cards.length,
        oldCardCount: oldCards.length,
        resultsVisible: resultsContainer?.style.display !== 'none',
        hasTraceId: !!traceElement,
        traceId: traceElement?.textContent.match(/FS-[\d-]+/)?.[0]
      };
    });
    
    console.log('\n📊 実行結果:');
    console.log(`  v4.3.1カード数: ${results.v431CardCount} ${results.v431CardCount === 8 ? '✅' : '❌'}`);
    console.log(`  旧カード数: ${results.oldCardCount}`);
    console.log(`  結果表示: ${results.resultsVisible ? '✅' : '❌'}`);
    console.log(`  Trace ID: ${results.hasTraceId ? results.traceId : 'なし'}`);
    
    // モーダルテスト
    if (results.v431CardCount > 0) {
      console.log('\n🖱️ モーダルテスト...');
      await page.click('.scenario-card-v431');
      await page.waitForTimeout(1000);
      
      const modalExists = await page.evaluate(() => {
        return !!document.getElementById('scenario-modal-v431');
      });
      
      console.log(`  モーダル表示: ${modalExists ? '✅' : '❌'}`);
      
      if (modalExists) {
        // モーダルを閉じる
        await page.click('#scenario-modal-v431 button');
      }
    }
    
    // 専門用語チェック
    console.log('\n📝 専門用語チェック...');
    const termCheck = await page.evaluate(() => {
      const cardTexts = Array.from(document.querySelectorAll('.scenario-card-v431')).map(
        card => card.textContent
      );
      const allText = cardTexts.join(' ');
      
      const forbiddenTerms = ['両者敗北', '進爻', '変爻', '六三', '九二'];
      const foundTerms = forbiddenTerms.filter(term => allText.includes(term));
      
      return {
        hasForbiddenTerms: foundTerms.length > 0,
        foundTerms
      };
    });
    
    if (termCheck.hasForbiddenTerms) {
      console.log(`  ❌ 専門用語が本文に含まれています: ${termCheck.foundTerms.join(', ')}`);
    } else {
      console.log('  ✅ 専門用語は本文から排除されています');
    }
    
    // スクリーンショット
    await page.screenshot({ path: '20250814_v431_test.png', fullPage: false });
    console.log('\n📸 スクリーンショット: 20250814_v431_test.png');
    
    // 判定
    console.log('\n' + '='.repeat(50));
    const success = 
      results.v431CardCount === 8 && 
      results.oldCardCount === 0 && 
      results.hasTraceId &&
      !termCheck.hasForbiddenTerms;
    
    if (success) {
      console.log('✅ v4.3.1 実装成功！');
      console.log('  - 8枚のカード表示 ✅');
      console.log('  - 重複なし ✅');
      console.log('  - Trace ID表示 ✅');
      console.log('  - 専門用語排除 ✅');
    } else {
      console.log('❌ 問題が残っています');
    }
    
    console.log('\n⏳ 手動確認用（10秒待機）...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ エラー:', error.message);
  } finally {
    await browser.close();
  }
}

testV431();