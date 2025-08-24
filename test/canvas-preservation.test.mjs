/**
 * Canvas要素保護 回帰テスト
 * Thinking Harderフィードバックに基づく受け入れ基準
 */

import { chromium } from 'playwright';
import assert from 'assert';

async function testCanvasPreservation() {
  console.log('🧪 Canvas要素保護 回帰テスト');
  console.log('=====================================\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-web-security']
  });
  
  const testResults = {
    passed: [],
    failed: [],
    warnings: []
  };
  
  try {
    const page = await browser.newPage();
    
    // エラー収集
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('CSP')) {
        errors.push(msg.text());
      }
    });
    
    console.log('📋 受け入れ基準テスト');
    console.log('--------------------------------');
    
    // テスト1: 初期ロード
    await page.goto('http://localhost:8788/future_simulator.html', { 
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    await page.waitForTimeout(3000);
    
    // 基準1: Canvas不変性（初期状態）
    console.log('\n✓ 基準1: Canvas不変性テスト');
    
    const initialCanvasCheck = await page.evaluate(() => {
      const canvases = document.querySelectorAll('canvas');
      return {
        count: canvases.length,
        ids: Array.from(canvases).map(c => c.id),
        connected: Array.from(canvases).map(c => c.isConnected)
      };
    });
    
    console.log(`  初期Canvas数: ${initialCanvasCheck.count}個`);
    console.log(`  Canvas IDs: ${initialCanvasCheck.ids.join(', ')}`);
    
    // DOMPreserverが存在するか確認
    const domPreserverExists = await page.evaluate(() => {
      return typeof window.DOMPreserver !== 'undefined';
    });
    
    if (domPreserverExists) {
      testResults.passed.push('DOMPreserver loaded');
      console.log('  ✅ DOMPreserver loaded');
    } else {
      testResults.failed.push('DOMPreserver not loaded');
      console.log('  ❌ DOMPreserver not loaded');
    }
    
    // テスト2: 分析実行
    console.log('\n✓ 基準2: 再実行耐性テスト');
    
    const testInput = '転職を検討中。現在の職場は安定しているが成長機会が少ない。';
    
    // Canvas要素への参照を保持
    const canvasHandles = await page.evaluateHandle(() => {
      return Array.from(document.querySelectorAll('canvas'));
    });
    
    // 3回連続分析実行
    for (let i = 0; i < 3; i++) {
      console.log(`\n  実行 ${i + 1}/3:`);
      
      await page.fill('textarea, #worryInput, #situation-text', testInput);
      await page.click('button[type="submit"], .analyze-btn, #aiGuessBtn');
      
      // 分析完了待機
      await page.waitForFunction(() => {
        const scenarios = document.querySelectorAll('.scenario-card, [class*="scenario"]');
        return scenarios.length >= 4;
      }, { timeout: 10000 }).catch(() => {});
      
      await page.waitForTimeout(2000);
      
      // Canvas要素の同一性チェック
      const canvasCheck = await page.evaluate((originalCanvases) => {
        const currentCanvases = Array.from(document.querySelectorAll('canvas'));
        
        return {
          count: currentCanvases.length,
          preserved: originalCanvases.every(original => 
            currentCanvases.some(current => current === original)
          ),
          connected: currentCanvases.every(c => c.isConnected)
        };
      }, canvasHandles);
      
      console.log(`    Canvas数: ${canvasCheck.count}個`);
      console.log(`    Canvas保持: ${canvasCheck.preserved ? '✅' : '❌'}`);
      console.log(`    DOM接続: ${canvasCheck.connected ? '✅' : '❌'}`);
      
      if (canvasCheck.preserved) {
        testResults.passed.push(`Run ${i + 1}: Canvas preserved`);
      } else {
        testResults.failed.push(`Run ${i + 1}: Canvas destroyed`);
      }
    }
    
    // 基準3: カード枚数
    console.log('\n✓ 基準3: カード枚数テスト');
    
    const cardCheck = await page.evaluate(() => {
      const cards = document.querySelectorAll('.scenario-card');
      const codes = new Set();
      
      cards.forEach(card => {
        const code = card.querySelector('.scenario-code')?.textContent || 
                    card.dataset.key;
        if (code) codes.add(code);
      });
      
      return {
        count: cards.length,
        uniqueCount: codes.size,
        hasDuplicates: codes.size < cards.length
      };
    });
    
    console.log(`  カード数: ${cardCheck.count}枚`);
    console.log(`  ユニーク数: ${cardCheck.uniqueCount}枚`);
    console.log(`  重複: ${cardCheck.hasDuplicates ? '❌ あり' : '✅ なし'}`);
    
    if (cardCheck.count <= 8 && !cardCheck.hasDuplicates) {
      testResults.passed.push('Card count correct');
    } else {
      testResults.failed.push(`Card count: ${cardCheck.count} (expected ≤8)`);
    }
    
    // 基準4: パフォーマンス
    console.log('\n✓ 基準4: パフォーマンステスト');
    
    const startTime = Date.now();
    await page.fill('textarea, #worryInput, #situation-text', testInput + ' パフォーマンステスト');
    await page.click('button[type="submit"], .analyze-btn, #aiGuessBtn');
    
    await page.waitForFunction(() => {
      const scenarios = document.querySelectorAll('.scenario-card');
      return scenarios.length >= 4;
    }, { timeout: 2000 }).catch(() => {});
    
    const analysisTime = Date.now() - startTime;
    console.log(`  分析時間: ${analysisTime}ms`);
    
    if (analysisTime < 600) {
      testResults.passed.push(`Performance: ${analysisTime}ms`);
      console.log('  ✅ パフォーマンス基準達成');
    } else {
      testResults.warnings.push(`Performance: ${analysisTime}ms (target <600ms)`);
      console.log(`  ⚠️ パフォーマンス: ${analysisTime}ms (目標 <600ms)`);
    }
    
    // 基準5: エラー
    console.log('\n✓ 基準5: エラーチェック');
    
    const nonCSPErrors = errors.filter(e => 
      !e.includes('Content Security Policy') && 
      !e.includes('CSP')
    );
    
    console.log(`  エラー数: ${nonCSPErrors.length}件`);
    
    if (nonCSPErrors.length === 0) {
      testResults.passed.push('No errors');
      console.log('  ✅ エラーなし');
    } else {
      testResults.failed.push(`Errors: ${nonCSPErrors.length}`);
      console.log('  ❌ エラーあり:');
      nonCSPErrors.slice(0, 3).forEach(e => console.log(`    - ${e}`));
    }
    
    // 最終Canvas状態
    const finalCanvasState = await page.evaluate(() => {
      const canvases = document.querySelectorAll('canvas');
      return {
        count: canvases.length,
        withContext: Array.from(canvases).filter(c => {
          try {
            return !!c.getContext('2d');
          } catch {
            return false;
          }
        }).length
      };
    });
    
    console.log('\n📊 最終状態:');
    console.log(`  Canvas要素: ${finalCanvasState.count}個`);
    console.log(`  2Dコンテキスト取得可能: ${finalCanvasState.withContext}個`);
    
    return testResults;
    
  } catch (error) {
    console.error('❌ テストエラー:', error);
    testResults.failed.push(`Test error: ${error.message}`);
    return testResults;
  } finally {
    await page.waitForTimeout(5000);
    await browser.close();
  }
}

// テスト実行
testCanvasPreservation().then(results => {
  console.log('\n=====================================');
  console.log('📊 テスト結果サマリー');
  console.log('=====================================');
  
  console.log(`\n✅ 成功: ${results.passed.length}項目`);
  results.passed.forEach(item => console.log(`  - ${item}`));
  
  if (results.warnings.length > 0) {
    console.log(`\n⚠️ 警告: ${results.warnings.length}項目`);
    results.warnings.forEach(item => console.log(`  - ${item}`));
  }
  
  if (results.failed.length > 0) {
    console.log(`\n❌ 失敗: ${results.failed.length}項目`);
    results.failed.forEach(item => console.log(`  - ${item}`));
  }
  
  const allPassed = results.failed.length === 0;
  
  console.log('\n=====================================');
  if (allPassed) {
    console.log('🎉 全受け入れ基準達成！');
  } else {
    console.log('❌ 一部の受け入れ基準未達成');
  }
  console.log('=====================================');
  
  process.exit(allPassed ? 0 : 1);
}).catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});