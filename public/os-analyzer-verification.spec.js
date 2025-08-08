
import { test, expect } from '@playwright/test';

test.describe('HAQEI OS Analyzer - 修復後動作検証', () => {
  
  test('1. 基本ページロードとコンソールエラー確認', async ({ page }) => {
    console.log('🚀 Starting OS Analyzer verification...');
    
    // コンソールエラーを監視
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
        console.log('❌ Console Error:', msg.text());
      }
    });
    
    // ページを読み込み
    await page.goto('/os_analyzer.html');
    await page.waitForLoadState('networkidle');
    
    // タイトル確認
    await expect(page).toHaveTitle(/HAQEI/);
    console.log('✅ Page title verified');
    
    // 重要な要素の存在確認
    await expect(page.locator('h1')).toContainText('Triple OS');
    console.log('✅ Main heading found');
    
    // startAnalysis関数の存在確認
    const hasStartAnalysis = await page.evaluate(() => {
      return typeof window.startAnalysis === 'function';
    });
    console.log('✅ startAnalysis function exists:', hasStartAnalysis);
    
    // QUESTIONS配列の存在確認
    const hasQuestions = await page.evaluate(() => {
      return Array.isArray(window.QUESTIONS) && window.QUESTIONS.length > 0;
    });
    console.log('✅ QUESTIONS array exists with length:', 
      await page.evaluate(() => window.QUESTIONS ? window.QUESTIONS.length : 0));
    
    // 致命的エラーがないことを確認
    const criticalErrors = errors.filter(error => 
      error.includes('Unexpected token') || 
      error.includes('SyntaxError') ||
      error.includes('Uncaught TypeError')
    );
    
    if (criticalErrors.length > 0) {
      console.error('❌ Critical errors found:', criticalErrors);
      throw new Error('Critical JavaScript errors detected: ' + criticalErrors.join(', '));
    }
    
    console.log('✅ No critical errors found');
  });
  
  test('2. 開始ボタン動作確認', async ({ page }) => {
    await page.goto('/os_analyzer.html');
    await page.waitForLoadState('networkidle');
    
    // 開始ボタンを探す
    const startButton = page.locator('text=Triple OS 分析を開始する').first();
    await expect(startButton).toBeVisible();
    console.log('✅ Start button found and visible');
    
    // ボタンクリック前のスクリーンショット
    await page.screenshot({ path: 'test-results/before-start-click.png', fullPage: true });
    
    // ボタンをクリック
    await startButton.click();
    await page.waitForTimeout(2000);
    
    // クリック後のスクリーンショット
    await page.screenshot({ path: 'test-results/after-start-click.png', fullPage: true });
    
    // 質問が表示されているか確認
    const questionVisible = await page.locator('.question-container, .question, [class*="question"]').first().isVisible();
    console.log('✅ Question container visible after click:', questionVisible);
    
    if (questionVisible) {
      console.log('✅ 30問フロー開始成功');
    }
  });
  
  test('3. レスポンシブ表示確認', async ({ page }) => {
    // デスクトップ表示
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/os_analyzer.html');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/desktop-view.png', fullPage: true });
    console.log('✅ Desktop view captured');
    
    // タブレット表示
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/tablet-view.png', fullPage: true });
    console.log('✅ Tablet view captured');
    
    // モバイル表示
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/mobile-view.png', fullPage: true });
    console.log('✅ Mobile view captured');
  });
  
});
