/**
 * エラー解消検証テスト
 * CLAUDE.md準拠：エラーが解消されたか確認
 */

import { chromium } from 'playwright';

async function verifyErrorResolution() {
    console.log('🔍 エラー解消検証テスト');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    const testResults = {
        initialErrors: [],
        analysisErrors: [],
        multipleRunErrors: [],
        canvasStatus: {},
        summary: {}
    };
    
    try {
        const page = await browser.newPage();
        
        // エラー収集設定
        const allErrors = [];
        const consoleErrors = [];
        
        page.on('pageerror', error => {
            allErrors.push({
                type: 'page_error',
                message: error.message,
                stack: error.stack
            });
        });
        
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push({
                    type: 'console_error',
                    text: msg.text(),
                    location: msg.location()
                });
            }
        });
        
        console.log('📋 Step 1: 初期ロード時のエラー確認');
        console.log('--------------------------------');
        
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 30000
        });
        
        await page.waitForTimeout(3000);
        
        // 初期エラーの収集
        testResults.initialErrors = [...allErrors];
        
        const nonCSPInitialErrors = testResults.initialErrors.filter(e => 
            !e.message.includes('Content Security Policy') && 
            !e.message.includes('CSP')
        );
        
        console.log(`  総エラー数: ${testResults.initialErrors.length}件`);
        console.log(`  CSP以外のエラー: ${nonCSPInitialErrors.length}件`);
        
        if (nonCSPInitialErrors.length > 0) {
            console.log('  初期エラー内容:');
            nonCSPInitialErrors.slice(0, 3).forEach((e, i) => {
                console.log(`    ${i+1}. ${e.message.substring(0, 100)}`);
            });
        }
        
        // Canvas初期状態
        const initialCanvas = await page.evaluate(() => {
            const canvases = document.querySelectorAll('canvas');
            return {
                count: canvases.length,
                ids: Array.from(canvases).map(c => c.id || 'unnamed'),
                connected: Array.from(canvases).every(c => c.isConnected)
            };
        });
        
        console.log(`\n  初期Canvas数: ${initialCanvas.count}個`);
        console.log(`  Canvas IDs: ${initialCanvas.ids.join(', ')}`);
        
        console.log('\n📋 Step 2: 分析実行時のエラー確認');
        console.log('--------------------------------');
        
        // エラーをクリア
        allErrors.length = 0;
        consoleErrors.length = 0;
        
        // 分析実行
        const testInput = '転職を検討中。現在の職場は安定しているが成長機会が少ない。';
        
        await page.fill('textarea, #worryInput, #situation-text', testInput);
        
        // ボタンが有効になるまで待機
        await page.waitForFunction(() => {
            const btn = document.querySelector('#aiGuessBtn');
            return btn && !btn.disabled;
        }, { timeout: 5000 }).catch(() => {
            console.log('  ⚠️ ボタンが有効になりませんでした');
        });
        
        // クリック実行
        await page.click('button[type="submit"]:not([disabled]), .analyze-btn:not([disabled]), #aiGuessBtn:not([disabled])').catch(async () => {
            console.log('  ⚠️ 通常クリック失敗、JavaScriptで実行');
            await page.evaluate(() => {
                const btn = document.querySelector('#aiGuessBtn');
                if (btn) btn.click();
            });
        });
        
        console.log('  ✅ 分析開始');
        
        // 分析完了待機
        await page.waitForFunction(() => {
            const scenarios = document.querySelectorAll('.scenario-card, [class*="scenario"]');
            const hasResult = scenarios.length >= 4 || 
                             document.body.textContent.includes('分析完了') ||
                             document.body.textContent.includes('易経');
            return hasResult;
        }, { timeout: 15000 }).catch(() => {
            console.log('  ⚠️ 分析タイムアウト');
        });
        
        await page.waitForTimeout(3000);
        
        // 分析時のエラー収集
        testResults.analysisErrors = [...allErrors, ...consoleErrors];
        
        const nonCSPAnalysisErrors = testResults.analysisErrors.filter(e => {
            const msg = e.message || e.text || '';
            return !msg.includes('Content Security Policy') && 
                   !msg.includes('CSP') &&
                   !msg.includes('blob:');
        });
        
        console.log(`  分析時エラー数: ${testResults.analysisErrors.length}件`);
        console.log(`  CSP以外のエラー: ${nonCSPAnalysisErrors.length}件`);
        
        if (nonCSPAnalysisErrors.length > 0) {
            console.log('  エラー内容:');
            nonCSPAnalysisErrors.slice(0, 5).forEach((e, i) => {
                const msg = e.message || e.text || '';
                console.log(`    ${i+1}. ${msg.substring(0, 150)}`);
            });
        }
        
        // Canvas分析後状態
        const afterCanvas = await page.evaluate(() => {
            const canvases = document.querySelectorAll('canvas');
            const container = document.getElementById('eight-scenarios-display-container');
            return {
                count: canvases.length,
                ids: Array.from(canvases).map(c => c.id || 'unnamed'),
                connected: Array.from(canvases).every(c => c.isConnected),
                containerExists: !!container,
                containerChildren: container ? container.children.length : 0
            };
        });
        
        console.log(`\n  分析後Canvas数: ${afterCanvas.count}個`);
        console.log(`  Canvas維持: ${afterCanvas.count >= initialCanvas.count ? '✅' : '❌'}`);
        console.log(`  Container存在: ${afterCanvas.containerExists ? '✅' : '❌'}`);
        
        console.log('\n📋 Step 3: 複数回実行のエラー確認');
        console.log('--------------------------------');
        
        // 3回連続実行
        for (let i = 0; i < 3; i++) {
            allErrors.length = 0;
            consoleErrors.length = 0;
            
            await page.fill('textarea, #worryInput, #situation-text', `テスト${i + 1}`);
            
            await page.click('button[type="submit"]:not([disabled]), #aiGuessBtn:not([disabled])').catch(async () => {
                await page.evaluate(() => {
                    const btn = document.querySelector('#aiGuessBtn');
                    if (btn && !btn.disabled) btn.click();
                });
            });
            
            await page.waitForTimeout(2000);
            
            const runErrors = [...allErrors, ...consoleErrors].filter(e => {
                const msg = e.message || e.text || '';
                return !msg.includes('CSP') && !msg.includes('blob:');
            });
            
            console.log(`  実行${i + 1}: エラー${runErrors.length}件`);
            
            if (runErrors.length > 0) {
                testResults.multipleRunErrors.push(...runErrors);
            }
        }
        
        // 最終状態確認
        const finalState = await page.evaluate(() => {
            const canvases = document.querySelectorAll('canvas');
            const scenarios = document.querySelectorAll('.scenario-card');
            const container = document.getElementById('eight-scenarios-display-container');
            
            // 特定のエラーメッセージを確認
            const errorMessages = {
                containerNotFound: document.body.textContent.includes('Container not found'),
                lineDataRequired: document.body.textContent.includes('Line data is required'),
                analysisError: document.body.textContent.includes('分析中にエラー'),
                systemError: document.body.textContent.includes('System Error')
            };
            
            return {
                canvas: {
                    count: canvases.length,
                    allConnected: Array.from(canvases).every(c => c.isConnected)
                },
                scenarios: {
                    count: scenarios.length,
                    expectedCount: scenarios.length === 8
                },
                container: {
                    exists: !!container,
                    visible: container ? window.getComputedStyle(container).display !== 'none' : false
                },
                errorMessages
            };
        });
        
        console.log('\n📊 最終状態:');
        console.log('--------------------------------');
        console.log(`  Canvas数: ${finalState.canvas.count}個`);
        console.log(`  Canvas接続: ${finalState.canvas.allConnected ? '✅' : '❌'}`);
        console.log(`  シナリオカード: ${finalState.scenarios.count}個 ${finalState.scenarios.expectedCount ? '✅' : '❌'}`);
        console.log(`  Container: ${finalState.container.exists ? '✅' : '❌'}`);
        
        console.log('\n  エラーメッセージ検出:');
        Object.entries(finalState.errorMessages).forEach(([key, detected]) => {
            console.log(`    ${key}: ${detected ? '❌ 検出' : '✅ なし'}`);
        });
        
        // サマリー作成
        testResults.summary = {
            initialErrors: nonCSPInitialErrors.length,
            analysisErrors: nonCSPAnalysisErrors.length,
            multipleRunErrors: testResults.multipleRunErrors.length,
            canvasPreserved: afterCanvas.count >= initialCanvas.count,
            containerExists: afterCanvas.containerExists,
            finalCanvasCount: finalState.canvas.count,
            errorMessagesDetected: Object.values(finalState.errorMessages).some(v => v)
        };
        
        return testResults;
        
    } catch (error) {
        console.error('❌ テストエラー:', error.message);
        testResults.summary.testError = error.message;
        return testResults;
    } finally {
        await page.waitForTimeout(5000);
        await browser.close();
    }
}

// 実行
verifyErrorResolution().then(results => {
    console.log('\n=====================================');
    console.log('📊 エラー解消検証結果');
    console.log('=====================================');
    
    const summary = results.summary;
    
    // 評価
    const scores = {
        initialErrors: summary.initialErrors === 0 ? 20 : 0,
        analysisErrors: summary.analysisErrors === 0 ? 30 : (summary.analysisErrors < 5 ? 15 : 0),
        multipleRunErrors: summary.multipleRunErrors === 0 ? 20 : (summary.multipleRunErrors < 3 ? 10 : 0),
        canvasPreserved: summary.canvasPreserved ? 20 : 0,
        containerExists: summary.containerExists ? 10 : 0
    };
    
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    
    console.log('\n評価項目:');
    console.log(`  初期エラーなし: ${scores.initialErrors}/20点`);
    console.log(`  分析時エラーなし: ${scores.analysisErrors}/30点`);
    console.log(`  複数回実行エラーなし: ${scores.multipleRunErrors}/20点`);
    console.log(`  Canvas保護: ${scores.canvasPreserved}/20点`);
    console.log(`  Container存在: ${scores.containerExists}/10点`);
    
    console.log(`\n総合スコア: ${totalScore}/100点`);
    
    if (totalScore >= 80) {
        console.log('✅ エラー解消成功！');
    } else if (totalScore >= 60) {
        console.log('⚠️ 部分的改善、追加対応が必要');
    } else {
        console.log('❌ エラー解消不十分');
    }
    
    console.log('\n詳細:');
    console.log(`  初期エラー: ${summary.initialErrors}件`);
    console.log(`  分析時エラー: ${summary.analysisErrors}件`);
    console.log(`  複数回実行エラー: ${summary.multipleRunErrors}件`);
    console.log(`  最終Canvas数: ${summary.finalCanvasCount}個`);
    console.log(`  エラーメッセージ: ${summary.errorMessagesDetected ? '❌ あり' : '✅ なし'}`);
    
    process.exit(totalScore >= 60 ? 0 : 1);
}).catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});