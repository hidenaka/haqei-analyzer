/**
 * SafeDOMUpdater動作検証テスト
 */

import { chromium } from 'playwright';

async function verifySafeDOMUpdater() {
    console.log('🔍 SafeDOMUpdater動作検証');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false
    });
    
    try {
        const page = await browser.newPage();
        
        // エラー監視
        const errors = [];
        page.on('pageerror', error => {
            errors.push(error.message);
        });
        
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            } else if (msg.type() === 'log' && 
                      (msg.text().includes('SafeDOMUpdater') || 
                       msg.text().includes('Canvas'))) {
                console.log(`  📝 ${msg.text()}`);
            }
        });
        
        console.log('📋 Step 1: ページ読み込みと初期確認');
        console.log('--------------------------------');
        
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle'
        });
        
        await page.waitForTimeout(2000);
        
        // SafeDOMUpdaterの存在確認
        const initialCheck = await page.evaluate(() => {
            return {
                safeDOMUpdater: typeof window.SafeDOMUpdater !== 'undefined',
                singleDOMManager: typeof window.SingleDOMManager !== 'undefined',
                haqeiFutureSimulator: typeof window.haqeiFutureSimulator !== 'undefined',
                canvasCount: document.querySelectorAll('canvas').length,
                containerExists: !!document.getElementById('eight-scenarios-display-container')
            };
        });
        
        console.log(`  SafeDOMUpdater: ${initialCheck.safeDOMUpdater ? '✅' : '❌'}`);
        console.log(`  SingleDOMManager: ${initialCheck.singleDOMManager ? '✅' : '❌'}`);
        console.log(`  haqeiFutureSimulator: ${initialCheck.haqeiFutureSimulator ? '✅' : '❌'}`);
        console.log(`  初期Canvas数: ${initialCheck.canvasCount}個`);
        console.log(`  Container: ${initialCheck.containerExists ? '✅' : '❌'}`);
        
        if (!initialCheck.safeDOMUpdater) {
            console.error('❌ SafeDOMUpdaterが読み込まれていません');
            return;
        }
        
        console.log('\n📋 Step 2: 分析実行とSafeDOMUpdater動作確認');
        console.log('--------------------------------');
        
        // 分析実行
        await page.fill('textarea', 'テスト入力');
        
        // SafeDOMUpdaterの呼び出しを監視
        const updaterCalled = await page.evaluate(() => {
            // 呼び出しをトラッキング
            window.safeDOMUpdaterCalled = false;
            
            // future-simulator-core.jsの動作を確認
            const btn = document.querySelector('#aiGuessBtn');
            if (btn) {
                btn.click();
                return true;
            }
            return false;
        });
        
        console.log(`  分析開始: ${updaterCalled ? '✅' : '❌'}`);
        
        await page.waitForTimeout(5000);
        
        // 分析後の状態確認
        const afterAnalysis = await page.evaluate(() => {
            const canvases = document.querySelectorAll('canvas');
            const container = document.getElementById('eight-scenarios-display-container');
            const cards = document.querySelectorAll('.scenario-card');
            const resultsVisible = document.getElementById('resultsContainer')?.style.display !== 'none';
            
            // SafeDOMUpdaterが呼ばれたかログを確認
            const logs = [];
            const consoleProxy = new Proxy(console.log, {
                apply: function(target, thisArg, args) {
                    if (args[0] && args[0].includes('SafeDOMUpdater')) {
                        logs.push(args[0]);
                    }
                    return target.apply(thisArg, args);
                }
            });
            
            return {
                canvasCount: canvases.length,
                canvasIds: Array.from(canvases).map(c => c.id),
                containerExists: !!container,
                containerVisible: container ? window.getComputedStyle(container).display !== 'none' : false,
                cardCount: cards.length,
                resultsVisible,
                safeDOMUpdaterUsed: window.safeDOMUpdaterCalled || logs.length > 0
            };
        });
        
        console.log(`\n  分析後の状態:`);
        console.log(`    Canvas数: ${afterAnalysis.canvasCount}個`);
        console.log(`    Container: ${afterAnalysis.containerExists ? '✅' : '❌'}`);
        console.log(`    カード数: ${afterAnalysis.cardCount}個`);
        console.log(`    結果表示: ${afterAnalysis.resultsVisible ? '✅' : '❌'}`);
        
        // Canvas維持の確認
        const canvasMaintained = afterAnalysis.canvasCount >= initialCheck.canvasCount;
        console.log(`    Canvas維持: ${canvasMaintained ? '✅' : '❌'}`);
        
        // エラー確認
        const nonCSPErrors = errors.filter(e => !e.includes('CSP') && !e.includes('Content Security'));
        console.log(`\n  エラー: ${nonCSPErrors.length}件`);
        if (nonCSPErrors.length > 0) {
            nonCSPErrors.slice(0, 3).forEach(e => {
                console.log(`    - ${e.substring(0, 100)}`);
            });
        }
        
        console.log('\n=====================================');
        console.log('📊 検証結果');
        console.log('=====================================\n');
        
        const success = [];
        const issues = [];
        
        if (initialCheck.safeDOMUpdater) {
            success.push('SafeDOMUpdater読み込み成功');
        } else {
            issues.push('SafeDOMUpdater読み込み失敗');
        }
        
        if (canvasMaintained) {
            success.push('Canvas要素維持成功');
        } else {
            issues.push(`Canvas要素減少（${initialCheck.canvasCount}→${afterAnalysis.canvasCount}）`);
        }
        
        if (afterAnalysis.containerExists) {
            success.push('Container維持成功');
        } else {
            issues.push('Container消失');
        }
        
        if (afterAnalysis.cardCount > 0) {
            success.push(`シナリオカード表示（${afterAnalysis.cardCount}個）`);
        } else {
            issues.push('シナリオカード未表示');
        }
        
        if (nonCSPErrors.length === 0) {
            success.push('エラーなし');
        } else {
            issues.push(`エラー${nonCSPErrors.length}件`);
        }
        
        console.log('成功項目:');
        success.forEach(s => console.log(`  ✅ ${s}`));
        
        if (issues.length > 0) {
            console.log('\n問題項目:');
            issues.forEach(i => console.log(`  ❌ ${i}`));
        }
        
        const score = (success.length / (success.length + issues.length)) * 100;
        console.log(`\n総合スコア: ${Math.round(score)}%`);
        
        if (score >= 80) {
            console.log('🎉 SafeDOMUpdater動作成功！');
        } else if (score >= 60) {
            console.log('⚠️ 部分的成功');
        } else {
            console.log('❌ 追加対応必要');
        }
        
    } catch (error) {
        console.error('❌ エラー:', error.message);
    } finally {
        console.log('\n⏰ 5秒後にブラウザを閉じます...');
        await page.waitForTimeout(5000);
        await browser.close();
    }
}

// 実行
verifySafeDOMUpdater().catch(console.error);