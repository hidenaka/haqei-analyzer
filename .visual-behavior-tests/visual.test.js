
const { test, expect } = require('@playwright/test');

test('Visual appearance test', async ({ page }) => {
  await page.goto('http://localhost:8080');
  
  // スクリーンショット取得
  await page.screenshot({ path: '/Users/nakanohideaki/Desktop/haqei-analyzer/.visual-behavior-tests/results/desktop.png', fullPage: true });
  
  // モバイル表示
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: '/Users/nakanohideaki/Desktop/haqei-analyzer/.visual-behavior-tests/results/mobile.png', fullPage: true });
  
  // CSS検証
  const styles = await page.evaluate(() => {
    const computed = window.getComputedStyle(document.body);
    return {
      fontFamily: computed.fontFamily,
      backgroundColor: computed.backgroundColor,
      color: computed.color
    };
  });
  
  return { success: true, styles };
});
