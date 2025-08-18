/**
 * スクリプト読み込み確認
 */

import { chromium } from 'playwright';

async function checkScriptLoading() {
    console.log('🔍 スクリプト読み込み確認');
    
    const browser = await chromium.launch({ 
        headless: false
    });
    
    try {
        const page = await browser.newPage();
        
        // ネットワークリクエストを監視
        const loadedScripts = [];
        page.on('response', response => {
            const url = response.url();
            if (url.includes('.js')) {
                loadedScripts.push({
                    url: url.replace('http://localhost:8788/', ''),
                    status: response.status()
                });
            }
        });
        
        // コンソールエラーを監視
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log(`  ❌ Console error: ${msg.text()}`);
            }
        });
        
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle'
        });
        
        await page.waitForTimeout(2000);
        
        console.log('\n読み込まれたスクリプト:');
        loadedScripts.forEach(script => {
            const icon = script.status === 200 ? '✅' : '❌';
            console.log(`  ${icon} ${script.url} (${script.status})`);
        });
        
        // SafeDOMUpdater.jsが読み込まれているか
        const safeDOMLoaded = loadedScripts.some(s => s.url.includes('SafeDOMUpdater.js'));
        console.log(`\nSafeDOMUpdater.js: ${safeDOMLoaded ? '✅ 読み込み済み' : '❌ 未読み込み'}`);
        
        // window オブジェクトを確認
        const windowCheck = await page.evaluate(() => {
            return {
                SafeDOMUpdater: typeof window.SafeDOMUpdater,
                SingleDOMManager: typeof window.SingleDOMManager,
                scripts: Array.from(document.scripts).map(s => s.src.replace(window.location.origin, ''))
            };
        });
        
        console.log('\nwindowオブジェクト:');
        console.log(`  SafeDOMUpdater: ${windowCheck.SafeDOMUpdater}`);
        console.log(`  SingleDOMManager: ${windowCheck.SingleDOMManager}`);
        
        console.log('\nHTMLのscriptタグ:');
        windowCheck.scripts.filter(s => s).forEach(s => {
            console.log(`  - ${s}`);
        });
        
        // SafeDOMUpdater.jsの内容を確認
        if (windowCheck.SafeDOMUpdater === 'undefined') {
            const scriptContent = await page.evaluate(async () => {
                try {
                    const response = await fetch('/js/core/SafeDOMUpdater.js');
                    const text = await response.text();
                    return {
                        success: true,
                        firstLine: text.split('\n')[0],
                        lastLine: text.split('\n').slice(-2)[0],
                        hasWindowExport: text.includes('window.SafeDOMUpdater')
                    };
                } catch (e) {
                    return { success: false, error: e.message };
                }
            });
            
            console.log('\nSafeDOMUpdater.jsファイル内容:');
            if (scriptContent.success) {
                console.log(`  最初の行: ${scriptContent.firstLine}`);
                console.log(`  最後の行: ${scriptContent.lastLine}`);
                console.log(`  window.SafeDOMUpdater設定: ${scriptContent.hasWindowExport ? '✅' : '❌'}`);
            } else {
                console.log(`  ❌ エラー: ${scriptContent.error}`);
            }
        }
        
    } finally {
        await page.waitForTimeout(5000);
        await browser.close();
    }
}

// 実行
checkScriptLoading().catch(console.error);