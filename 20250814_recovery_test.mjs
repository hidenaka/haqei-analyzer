import { chromium } from 'playwright';

console.log('🔍 Future Simulator 回復テスト開始\n');

async function test() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // 1. ページ読み込み
    console.log('📄 ページ読み込み...');
    await page.goto('file:///Users/hideakimacbookair/Desktop/haqei-analyzer/public/future_simulator.html');
    await page.waitForTimeout(2000);
    
    // コンソールログを監視
    page.on('console', msg => {
      console.log(`[Browser Console] ${msg.text()}`);
    });
    
    // 2. 初期化確認
    console.log('🔍 初期化状態確認...');
    const initLogs = await page.evaluate(() => {
      return {
        bootstrapped: window.__FS_BOOTSTRAPPED__,
        analyzeWorryExists: typeof window.analyzeWorry === 'function'
      };
    });
    console.log('初期化状態:', initLogs);
    
    // 3. DOM要素確認
    console.log('🔍 DOM要素確認...');
    const worryInput = await page.$('[data-testid="worryInput"]');
    const aiGuessBtn = await page.$('[data-testid="aiGuessBtn"]');
    const resultsContainer = await page.$('[data-testid="resultsContainer"]');
    
    console.log('要素存在確認:', {
      worryInput: !!worryInput,
      aiGuessBtn: !!aiGuessBtn,
      resultsContainer: !!resultsContainer
    });
    
    if (!worryInput || !aiGuessBtn) {
      throw new Error('必要な要素が見つかりません');
    }
    
    // 4. テスト1: 短い入力で警告確認
    console.log('\n📝 テスト1: 短い入力での警告...');
    await worryInput.fill('短い');
    await aiGuessBtn.click();
    await page.waitForTimeout(1000);
    
    // 警告メッセージが表示されたか確認
    const warningVisible = await page.evaluate(() => {
      const msgs = document.querySelectorAll('div[style*="position:fixed"]');
      return Array.from(msgs).some(m => m.textContent.includes('10文字以上'));
    });
    console.log('警告表示:', warningVisible ? '✅ 成功' : '❌ 失敗');
    
    // 5. テスト2: 正常な入力での解析実行
    console.log('\n📝 テスト2: 正常な入力での解析...');
    await worryInput.fill('転職を検討していますが、タイミングが分からず悩んでいます');
    
    // ボタンクリック前の状態記録
    const beforeClick = await aiGuessBtn.textContent();
    console.log('クリック前のボタンテキスト:', beforeClick);
    
    await aiGuessBtn.click();
    await page.waitForTimeout(500);
    
    // ボタンのテキストが変わったか確認
    const duringAnalysis = await aiGuessBtn.textContent();
    console.log('解析中のボタンテキスト:', duringAnalysis);
    
    // 結果が表示されるまで待つ（最大10秒）
    try {
      await page.waitForFunction(() => {
        const container = document.getElementById('resultsContainer');
        return container && container.style.display !== 'none' && container.innerHTML.length > 100;
      }, { timeout: 10000 });
      
      console.log('✅ 結果が表示されました');
      
      // 結果の内容を確認
      const resultContent = await page.evaluate(() => {
        const container = document.getElementById('resultsContainer');
        return {
          visible: container.style.display !== 'none',
          hasContent: container.innerHTML.length > 0,
          contentLength: container.innerHTML.length
        };
      });
      console.log('結果の状態:', resultContent);
      
    } catch (error) {
      console.log('❌ 結果表示タイムアウト');
      
      // デバッグ情報
      const debugInfo = await page.evaluate(() => {
        const container = document.getElementById('resultsContainer');
        return {
          display: container ? container.style.display : 'no container',
          innerHTML: container ? container.innerHTML.substring(0, 200) : 'no content'
        };
      });
      console.log('デバッグ情報:', debugInfo);
    }
    
    // 6. スクリーンショット保存
    await page.screenshot({ 
      path: '20250814_recovery_test_result.png',
      fullPage: false 
    });
    console.log('\n📸 スクリーンショット保存: 20250814_recovery_test_result.png');
    
    // 最終状態確認
    const finalState = await page.evaluate(() => {
      const container = document.getElementById('resultsContainer');
      const scenarios = container ? container.querySelectorAll('li').length : 0;
      return {
        scenarioCount: scenarios,
        containerVisible: container && container.style.display !== 'none'
      };
    });
    
    console.log('\n📊 最終結果:');
    console.log('- シナリオ数:', finalState.scenarioCount);
    console.log('- 結果表示:', finalState.containerVisible ? '✅' : '❌');
    
    if (finalState.scenarioCount > 0) {
      console.log('\n🎉 テスト成功！Future Simulatorが正常に動作しています');
    } else {
      console.log('\n⚠️ 警告: 結果は表示されましたが、シナリオが見つかりません');
    }
    
  } catch (error) {
    console.error('\n❌ エラー:', error.message);
  } finally {
    await browser.close();
  }
}

test().catch(error => {
  console.error('テストエラー:', error);
  process.exit(1);
});