/**
 * HAQEI統一エラーハンドリングシステム統合テスト実行スクリプト
 * Playwrightを使用した自動テスト
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  console.log('🧪 HAQEI統一エラーハンドリングシステム統合テスト開始...');
  
  // 新しいブラウザインスタンスを起動
  const browser = await chromium.launch({
    headless: false,
    args: ['--lang=ja']
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // テストページを開く
    const testPagePath = `file://${__dirname}/test-unified-error-system-integration.html`;
    console.log(`📄 テストページを開いています: ${testPagePath}`);
    await page.goto(testPagePath);
    
    // ページの読み込みを待つ
    await page.waitForLoadState('networkidle');
    console.log('✅ ページ読み込み完了');
    
    // コンソールログを収集
    page.on('console', msg => {
      console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`);
    });
    
    // エラーをキャッチ
    page.on('pageerror', error => {
      console.error(`[Page Error] ${error.message}`);
    });
    
  }
  
  // テスト実行関数
  async function runTest(buttonText, resultId) {
      console.log(`\n🔧 テスト実行: ${buttonText}`);
      
      // ボタンをクリック
      await page.click(`button:has-text("${buttonText}")`);
      
      // 結果の表示を待つ
      await page.waitForTimeout(2000);
      
      // 結果を取得
      const result = await page.textContent(`#${resultId}`);
      console.log(`📊 結果:\n${result}`);
      
      return result;
    }
    
    // 1. システム初期化テスト
    await runTest('システム初期化テスト', 'init-status');
    
    // 2. 設定管理テスト
    await runTest('設定管理テスト', 'config-status');
    
    // 3. エラー分類テスト
    await runTest('分類テスト', 'error-handling-status');
    
    // 4. エラー復旧テスト
    await runTest('復旧テスト', 'error-handling-status');
    
    // 5. グレースフルデグラデーションテスト
    await runTest('デグラデーションテスト', 'graceful-status');
    
    // 6. 易経統合テスト
    await runTest('易経統合テスト', 'iching-status');
    
    // 7. HaQei分人思想テスト
    await runTest('分人システムテスト', 'HaQei-status');
    
    // 8. Triple OS統合テスト
    await runTest('Triple OSテスト', 'tripleos-status');
    
    // 9. パフォーマンステスト
    console.log('\n⚡ パフォーマンステスト実行...');
    await page.click('button:has-text("包括的性能テスト実行")');
    await page.waitForTimeout(3000);
    
    // パフォーマンスメトリクスを取得
    const metrics = {
      detectionSpeed: await page.textContent('#detection-speed'),
      memoryUsage: await page.textContent('#memory-usage'),
      throughput: await page.textContent('#throughput'),
      harmonyScore: await page.textContent('#harmony-score')
    };
    
    console.log('📊 パフォーマンスメトリクス:');
    console.log(`  - エラー検出速度: ${metrics.detectionSpeed}`);
    console.log(`  - メモリ使用量: ${metrics.memoryUsage}`);
    console.log(`  - 処理スループット: ${metrics.throughput}`);
    console.log(`  - 哲学的調和度: ${metrics.harmonyScore}`);
    
    // 10. 完全統合テスト
    console.log('\n🚀 完全統合テスト実行...');
    await page.click('button:has-text("完全統合テスト実行")');
    await page.waitForTimeout(10000); // テスト完了を待つ
    
    const integrationResults = await page.textContent('#integration-results');
    console.log('📋 統合テスト結果:\n' + integrationResults);
    
    // テスト結果のスクリーンショット
    await page.screenshot({ 
      path: 'test-results-screenshot.png',
      fullPage: true 
    });
    console.log('📸 テスト結果のスクリーンショット保存: test-results-screenshot.png');
    
    // JavaScriptコンソールから統合状態を確認
    const integrationStatus = await page.evaluate(() => {
      if (window.HAQEIErrorHandler) {
        return {
          errorHandler: true,
          config: !!window.haqeiConfig,
          bootstrap: !!window.haqeiErrorBootstrap,
          statistics: window.HAQEIErrorHandler.getErrorStatistics ? 
            window.HAQEIErrorHandler.getErrorStatistics() : null
        };
      }
      return { errorHandler: false };
    });
    
    console.log('\n🔍 統合状態確認:');
    console.log(JSON.stringify(integrationStatus, null, 2));
    
    console.log('\n✅ すべてのテストが完了しました！');
    
  } catch (error) {
    console.error('❌ テスト実行中にエラーが発生しました:', error);
  }
  
  // 結果確認のため少し待つ
  console.log('\n⏸️  10秒後にブラウザを閉じます...');
  await page.waitForTimeout(10000);
  
  // ブラウザを閉じる
  await browser.close();
  console.log('🏁 テスト完了！');
})();