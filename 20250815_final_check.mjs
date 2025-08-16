/**
 * 最終確認テスト
 * サーバー再起動後の状態確認
 */

import { chromium } from 'playwright';

async function finalCheck() {
    console.log('🔍 最終確認テスト（サーバー再起動後）');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false
    });
    
    try {
        const page = await browser.newPage();
        
        // スクリプト読み込みを監視
        const scripts = [];
        page.on('response', response => {
            const url = response.url();
            if (url.includes('SafeDOMUpdater')) {
                console.log(`  📝 SafeDOMUpdater response: ${response.status()}`);
            }
        });
        
        console.log('📋 ページ読み込み');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle'
        });
        
        await page.waitForTimeout(2000);
        
        // 状態確認
        const status = await page.evaluate(() => {
            const safeDOMScript = document.querySelector('script[src*="SafeDOMUpdater"]');
            return {
                SafeDOMUpdater: typeof window.SafeDOMUpdater,
                SingleDOMManager: typeof window.SingleDOMManager,
                scriptTag: !!safeDOMScript,
                scriptSrc: safeDOMScript?.src,
                canvasCount: document.querySelectorAll('canvas').length
            };
        });
        
        console.log('\n📊 結果:');
        console.log(`  SafeDOMUpdater: ${status.SafeDOMUpdater} ${status.SafeDOMUpdater !== 'undefined' ? '✅' : '❌'}`);
        console.log(`  SingleDOMManager: ${status.SingleDOMManager} ${status.SingleDOMManager !== 'undefined' ? '✅' : '❌'}`);
        console.log(`  scriptタグ: ${status.scriptTag ? '✅' : '❌'}`);
        if (status.scriptSrc) {
            console.log(`  src: ${status.scriptSrc}`);
        }
        console.log(`  Canvas数: ${status.canvasCount}`);
        
        if (status.SafeDOMUpdater === 'undefined') {
            console.log('\n⚠️ SafeDOMUpdaterがまだ読み込まれていません');
            
            // 手動で読み込みを試行
            console.log('\n📋 手動読み込み試行...');
            const manual = await page.evaluate(async () => {
                try {
                    const response = await fetch('/js/core/SafeDOMUpdater.js');
                    const text = await response.text();
                    eval(text);
                    return {
                        success: true,
                        afterEval: typeof window.SafeDOMUpdater
                    };
                } catch (e) {
                    return { success: false, error: e.message };
                }
            });
            
            if (manual.success) {
                console.log(`  ✅ 手動読み込み成功`);
                console.log(`  eval後: ${manual.afterEval}`);
                
                if (manual.afterEval !== 'undefined') {
                    console.log('\n✅ SafeDOMUpdaterは正常に動作可能');
                    console.log('   HTMLファイルの問題の可能性が高い');
                }
            } else {
                console.log(`  ❌ エラー: ${manual.error}`);
            }
        } else {
            console.log('\n✅ SafeDOMUpdaterが正常に読み込まれています！');
            
            // 動作テスト
            console.log('\n📋 動作テスト...');
            await page.fill('textarea', 'テスト');
            await page.evaluate(() => {
                const btn = document.querySelector('#aiGuessBtn');
                if (btn) btn.click();
            });
            
            await page.waitForTimeout(3000);
            
            const afterTest = await page.evaluate(() => {
                return {
                    canvasCount: document.querySelectorAll('canvas').length,
                    containerExists: !!document.getElementById('eight-scenarios-display-container'),
                    cardCount: document.querySelectorAll('.scenario-card').length
                };
            });
            
            console.log('\n分析後:');
            console.log(`  Canvas数: ${afterTest.canvasCount}`);
            console.log(`  Container: ${afterTest.containerExists ? '✅' : '❌'}`);
            console.log(`  カード数: ${afterTest.cardCount}`);
        }
        
    } finally {
        console.log('\n⏰ 5秒後にブラウザを閉じます...');
        await page.waitForTimeout(5000);
        await browser.close();
    }
}

// 実行
finalCheck().catch(console.error);