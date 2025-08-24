const { test, expect } = require('@playwright/test');

test.describe('OSアナライザー完全フローテスト', () => {
  test('36問回答からresults.html表示まで', async ({ page }) => {
    // 1. OSアナライザーへアクセス
    await page.goto('http://localhost:8000/os_analyzer.html');
    await expect(page).toHaveTitle(/HAQEI|OSアナライザー/i);
    
    // 2. 36問に回答
    console.log('36問への回答開始...');
    
    // Engine OS系 (q1-q12) - 主に4-5
    for (let i = 1; i <= 12; i++) {
      const value = i % 2 === 0 ? 5 : 4;
      await page.locator(`input[name="q${i}"][value="${value}"]`).click();
    }
    
    // Interface OS系 (q13-q24) - 主に3-4
    for (let i = 13; i <= 24; i++) {
      const value = i % 2 === 0 ? 3 : 4;
      await page.locator(`input[name="q${i}"][value="${value}"]`).click();
    }
    
    // SafeMode OS系 (q25-q36) - 主に2-3
    for (let i = 25; i <= 36; i++) {
      const value = i % 2 === 0 ? 2 : 3;
      await page.locator(`input[name="q${i}"][value="${value}"]`).click();
    }
    
    // 3. 分析ボタンをクリック
    await page.locator('#analyze-button').click();
    await page.waitForTimeout(2000);
    
    // 4. LocalStorageデータ確認
    const analysisData = await page.evaluate(() => {
      const data = localStorage.getItem('osAnalysisResult');
      return data ? JSON.parse(data) : null;
    });
    
    expect(analysisData).toBeTruthy();
    expect(analysisData.engineOS).toBeTruthy();
    expect(analysisData.interfaceOS).toBeTruthy();
    expect(analysisData.safeModeOS).toBeTruthy();
    
    console.log('分析結果:');
    console.log(`  Engine OS: ${analysisData.engineOS?.score}点`);
    console.log(`  Interface OS: ${analysisData.interfaceOS?.score}点`);
    console.log(`  SafeMode OS: ${analysisData.safeModeOS?.score}点`);
    
    // 5. results.htmlへ移動
    await page.goto('http://localhost:8000/results.html');
    await page.waitForLoadState('networkidle');
    
    // 6. 表示確認
    const pageState = await page.evaluate(() => {
      return {
        tabNavigator: !!window.tabNavigator,
        basicResultsTab: !!window.basicResultsTab,
        osCards: document.querySelectorAll('.os-card').length,
        personalityContainer: !!document.querySelector('.personality-profile-container')
      };
    });
    
    console.log('\n表示状態:');
    console.log(`  TabNavigator: ${pageState.tabNavigator ? '✅' : '❌'}`);
    console.log(`  BasicResultsTab: ${pageState.basicResultsTab ? '✅' : '❌'}`);
    console.log(`  OSカード数: ${pageState.osCards}`);
    console.log(`  人物像コンテナ: ${pageState.personalityContainer ? '✅' : '❌'}`);
    
    // スクリーンショット
    await page.screenshot({ path: 'test-results/results-page.png', fullPage: true });
  });
});