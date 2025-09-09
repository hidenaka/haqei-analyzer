import { chromium } from 'playwright';

async function testV3Database() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // ページを開く
    await page.goto('file:///Users/hideakimacbookair/Desktop/haqei-analyzer/results-dynamic-mockup.html');
    
    // パターン1: イノベーター型をテスト
    console.log('パターン1: イノベーター型をテスト');
    await page.click('button:has-text("パターン1: イノベーター型")');
    await page.waitForTimeout(500);
    
    // Engine OS (乾為天)の確認
    const engineOS1 = await page.locator('h3:has-text("Engine OS: 乾為天")').isVisible();
    console.log('✓ Engine OS 乾為天表示:', engineOS1);
    
    // Interface OS (兌為澤)の確認
    const interfaceOS1 = await page.locator('h3:has-text("Interface OS: 兌為澤")').isVisible();
    console.log('✓ Interface OS 兌為澤表示:', interfaceOS1);
    
    // SafeMode OS (坤為地)の確認
    const safeOS1 = await page.locator('h3:has-text("SafeMode OS: 坤為地")').isVisible();
    console.log('✓ SafeMode OS 坤為地表示:', safeOS1);
    
    // パターン2: サポーター型をテスト
    console.log('\nパターン2: サポーター型をテスト');
    await page.click('button:has-text("パターン2: サポーター型")');
    await page.waitForTimeout(500);
    
    // Engine OS (坤為地)の確認
    const engineOS2 = await page.locator('h3:has-text("Engine OS: 坤為地")').isVisible();
    console.log('✓ Engine OS 坤為地表示:', engineOS2);
    
    // Interface OS (山水蒙)の確認
    const interfaceOS2 = await page.locator('h3:has-text("Interface OS: 山水蒙")').isVisible();
    console.log('✓ Interface OS 山水蒙表示:', interfaceOS2);
    
    // SafeMode OS (水雷屯)の確認
    const safeOS2 = await page.locator('h3:has-text("SafeMode OS: 水雷屯")').isVisible();
    console.log('✓ SafeMode OS 水雷屯表示:', safeOS2);
    
    // パターン3: バランス型をテスト
    console.log('\nパターン3: バランス型をテスト');
    await page.click('button:has-text("パターン3: バランス型")');
    await page.waitForTimeout(500);
    
    // Engine OS (水天需)の確認
    const engineOS3 = await page.locator('h3:has-text("Engine OS: 水天需")').isVisible();
    console.log('✓ Engine OS 水天需表示:', engineOS3);
    
    // Interface OS (坤為地)の確認
    const interfaceOS3b = await page.locator('h3:has-text("Interface OS: 坤為地")').isVisible();
    console.log('✓ Interface OS 坤為地表示:', interfaceOS3b);
    
    // SafeMode OS (兌為澤)の確認
    const safeOS3 = await page.locator('h3:has-text("SafeMode OS: 兌為澤")').isVisible();
    console.log('✓ SafeMode OS 兌為澤表示:', safeOS3);
    
    // 各OSのV3データ詳細が表示されているか確認
    console.log('\nV3データの詳細表示確認:');
    
    // Engine OSの詳細確認（戦略立案エンジン）
    const engineProfile = await page.locator('text="戦略立案エンジン"').isVisible();
    console.log('✓ Engine OS プロファイル（戦略立案エンジン）表示:', engineProfile);
    
    // Interface OSの詳細確認（調和型）
    const interfaceProfile = await page.locator('text="調和型"').isVisible();
    console.log('✓ Interface OS プロファイル（調和型）表示:', interfaceProfile);
    
    // SafeMode OSの詳細確認（楽観維持型）
    const safeProfile = await page.locator('text="楽観維持型"').isVisible();
    console.log('✓ SafeMode OS プロファイル（楽観維持型）表示:', safeProfile);
    
    // コンソールエラーの確認
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ コンソールエラー:', msg.text());
      }
    });
    
    // 全パターンでのデータ表示を再確認
    console.log('\n=== 全パターン再確認 ===');
    
    // パターン1に戻る
    await page.click('button:has-text("パターン1: イノベーター型")');
    await page.waitForTimeout(500);
    let hasError1 = await page.locator('text="undefined"').count() > 0;
    console.log('パターン1 エラーチェック:', hasError1 ? '❌ エラーあり' : '✅ 正常');
    
    // パターン2
    await page.click('button:has-text("パターン2: サポーター型")');
    await page.waitForTimeout(500);
    let hasError2 = await page.locator('text="undefined"').count() > 0;
    console.log('パターン2 エラーチェック:', hasError2 ? '❌ エラーあり' : '✅ 正常');
    
    // パターン3
    await page.click('button:has-text("パターン3: バランス型")');
    await page.waitForTimeout(500);
    let hasError3 = await page.locator('text="undefined"').count() > 0;
    console.log('パターン3 エラーチェック:', hasError3 ? '❌ エラーあり' : '✅ 正常');
    
    // スクリーンショットを撮る
    await page.screenshot({ path: 'v3-data-verification.png', fullPage: false });
    console.log('\n📸 スクリーンショット保存: v3-data-verification.png');
    
    console.log('\n✅ V3データベース表示テスト完了！');
    
  } catch (error) {
    console.error('テストエラー:', error);
  } finally {
    await browser.close();
  }
}

testV3Database();