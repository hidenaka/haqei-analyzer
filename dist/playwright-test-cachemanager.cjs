const { chromium } = require('playwright');

(async () => {
  console.log('🚀 CacheManager修正テスト開始');
  
  // ブラウザを起動（別プロファイル）
  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    viewport: { width: 1280, height: 800 }
  });
  
  const page = await context.newPage();
  
  // コンソールログを収集
  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push({
      type: msg.type(),
      text: msg.text(),
      time: new Date().toISOString()
    });
  });
  
  try {
    // Step 1: テストページにアクセス
    console.log('📋 Step 1: テストページにアクセス');
    await page.goto('http://localhost:8788/test-cache-manager-fix.html');
    await page.waitForTimeout(2000);
    
    // テスト結果を取得
    const testResults = await page.evaluate(() => {
      const results = [];
      document.querySelectorAll('.test-result').forEach(el => {
        results.push({
          text: el.textContent,
          isSuccess: el.classList.contains('success')
        });
      });
      return results;
    });
    
    console.log('テスト結果:', testResults);
    await page.screenshot({ path: 'test-cachemanager-results.png' });
    
    // Step 2: OS Analyzerにアクセス
    console.log('\n📋 Step 2: OS Analyzerにアクセス');
    await page.goto('http://localhost:8788/os_analyzer.html');
    await page.waitForTimeout(3000);
    
    // エラーチェック
    const hasErrors = consoleLogs.some(log => 
      log.type === 'error' && log.text.includes('CacheManager')
    );
    
    if (hasErrors) {
      console.error('❌ CacheManagerエラーが検出されました');
    } else {
      console.log('✅ CacheManagerエラーなし');
    }
    
    // Step 3: 分析開始ボタンをクリック
    console.log('\n📋 Step 3: 分析開始ボタンをクリック');
    const startButton = await page.$('button:has-text("分析を開始する"), .start-button');
    
    if (startButton) {
      await page.screenshot({ path: 'before-click.png' });
      await startButton.click();
      await page.waitForTimeout(2000);
      
      // クリック後のエラーチェック
      const clickErrors = consoleLogs.filter(log => 
        log.type === 'error' && 
        new Date(log.time) > new Date(Date.now() - 2000)
      );
      
      if (clickErrors.length > 0) {
        console.error('❌ クリック後にエラー発生:', clickErrors);
      } else {
        console.log('✅ クリック後もエラーなし');
      }
      
      await page.screenshot({ path: 'after-click.png' });
    } else {
      console.error('❌ 開始ボタンが見つかりません');
    }
    
    // 最終レポート
    console.log('\n📊 最終レポート');
    console.log('総コンソールログ数:', consoleLogs.length);
    console.log('エラー数:', consoleLogs.filter(log => log.type === 'error').length);
    console.log('警告数:', consoleLogs.filter(log => log.type === 'warning').length);
    
    // エラーログの詳細
    const errors = consoleLogs.filter(log => log.type === 'error');
    if (errors.length > 0) {
      console.log('\n❌ エラー詳細:');
      errors.forEach(err => console.log(`  - ${err.text}`));
    }
    
  } catch (error) {
    console.error('テスト実行エラー:', error);
  } finally {
    await browser.close();
    console.log('\n🏁 テスト完了');
  }
})();