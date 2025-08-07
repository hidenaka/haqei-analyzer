const { chromium } = require('playwright');

async function test() {
  console.log('HAQEI修正後システム検証開始');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('http://127.0.0.1:8083/future_simulator.html');
    console.log('✅ ページロード成功');
    
    await page.screenshot({ path: 'test-screenshot.png' });
    console.log('✅ スクリーンショット保存');
    
    const title = await page.title();
    console.log('ページタイトル:', title);
    
    return true;
  } catch (error) {
    console.error('エラー:', error);
    return false;
  } finally {
    await browser.close();
  }
}

test().then(success => {
  console.log('結果:', success ? '成功' : '失敗');
});
EOF < /dev/null