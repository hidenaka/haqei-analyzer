import { chromium } from 'playwright';

console.log('🔍 Future Simulator コンソールログ確認\n');

async function test() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // コンソールログを全て表示
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      console.log(`❌ [ERROR] ${text}`);
    } else if (type === 'warning') {
      console.log(`⚠️ [WARN] ${text}`);
    } else {
      console.log(`📝 [LOG] ${text}`);
    }
  });
  
  try {
    console.log('📄 ページ読み込み...\n');
    await page.goto('file:///Users/hideakimacbookair/Desktop/haqei-analyzer/public/future_simulator.html');
    await page.waitForTimeout(3000);
    
    console.log('\n🔍 初期化状態確認...');
    const state = await page.evaluate(() => {
      return {
        bootstrapped: window.__FS_BOOTSTRAPPED__,
        analyzeWorryType: typeof window.analyzeWorry,
        analyzeWorryExists: typeof window.analyzeWorry === 'function',
        worryInput: !!document.getElementById('worryInput'),
        aiGuessBtn: !!document.getElementById('aiGuessBtn'),
        resultsContainer: !!document.getElementById('resultsContainer')
      };
    });
    
    console.log('状態:', JSON.stringify(state, null, 2));
    
    // analyzeWorry関数の内容を確認
    if (state.analyzeWorryExists) {
      const funcStr = await page.evaluate(() => {
        return window.analyzeWorry.toString().substring(0, 200);
      });
      console.log('\nanalyzeWorry関数の先頭200文字:');
      console.log(funcStr);
    }
    
    console.log('\n📝 入力とクリックテスト...');
    
    // 入力
    const input = await page.$('#worryInput');
    if (input) {
      await input.fill('転職を検討していますが、タイミングが分からず悩んでいます');
      console.log('✅ テキスト入力完了');
    } else {
      console.log('❌ worryInput要素が見つかりません');
      return;
    }
    
    // ボタンを探す
    const button = await page.$('#aiGuessBtn');
    if (button) {
      // ボタンの状態を確認
      const buttonState = await page.evaluate(() => {
        const btn = document.getElementById('aiGuessBtn');
        return {
          disabled: btn.disabled,
          text: btn.textContent,
          visible: btn.offsetParent !== null
        };
      });
      console.log('ボタン状態:', buttonState);
      
      // クリック
      console.log('\n🖱️ ボタンクリック実行...');
      await button.click();
      console.log('✅ クリック完了');
      
      // 5秒待って結果を確認
      await page.waitForTimeout(5000);
      
      // 結果確認
      const result = await page.evaluate(() => {
        const container = document.getElementById('resultsContainer');
        return {
          visible: container && container.style.display !== 'none',
          hasContent: container && container.innerHTML.length > 100,
          contentLength: container ? container.innerHTML.length : 0
        };
      });
      
      console.log('\n📊 結果:', result);
      
    } else {
      console.log('❌ aiGuessBtn要素が見つかりません');
    }
    
    // スクリーンショット
    await page.screenshot({ path: '20250814_console_check.png' });
    console.log('\n📸 スクリーンショット保存: 20250814_console_check.png');
    
    // 10秒間そのまま待機（手動確認用）
    console.log('\n⏳ 10秒間待機中（手動で確認してください）...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('\n❌ エラー:', error.message);
  } finally {
    await browser.close();
  }
}

test();