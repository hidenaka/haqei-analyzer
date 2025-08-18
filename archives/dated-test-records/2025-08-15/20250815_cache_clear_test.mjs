/**
 * キャッシュクリアテスト
 * ブラウザのキャッシュを無効化して確認
 */

import { chromium } from 'playwright';

async function testWithCacheClear() {
    console.log('🔍 キャッシュクリアテスト');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: [
            '--disable-cache',
            '--disable-application-cache',
            '--disable-offline-load-stale-cache',
            '--disable-gpu-shader-disk-cache',
            '--disable-dev-shm-usage',
            '--disable-web-security'
        ]
    });
    
    try {
        const context = await browser.newContext({
            // キャッシュを完全に無効化
            bypassCSP: false,
            ignoreHTTPSErrors: true,
            offline: false
        });
        
        const page = await context.newPage();
        
        // キャッシュを無効化
        await page.route('**/*', (route) => {
            route.continue({
                headers: {
                    ...route.request().headers(),
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
        });
        
        console.log('📋 Step 1: ハードリロードでページ読み込み');
        console.log('--------------------------------');
        
        // スクリプト読み込みを監視
        const loadedScripts = [];
        page.on('response', response => {
            const url = response.url();
            if (url.includes('SafeDOMUpdater')) {
                console.log(`  🔍 SafeDOMUpdater response: ${response.status()}`);
                loadedScripts.push({
                    url: url.replace('http://localhost:8788/', ''),
                    status: response.status()
                });
            }
        });
        
        // ハードリロード（Ctrl+Shift+R相当）
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            // キャッシュを無視
            waitForLoadState: 'domcontentloaded'
        });
        
        // 追加で強制リロード
        await page.keyboard.down('Control');
        await page.keyboard.down('Shift');
        await page.keyboard.press('R');
        await page.keyboard.up('Shift');
        await page.keyboard.up('Control');
        
        await page.waitForTimeout(3000);
        
        console.log('\n📋 Step 2: SafeDOMUpdater読み込み確認');
        console.log('--------------------------------');
        
        // window オブジェクトを確認
        const check = await page.evaluate(() => {
            // 手動でスクリプトを読み込んでみる
            const manualLoad = async () => {
                try {
                    const response = await fetch('/js/core/SafeDOMUpdater.js?t=' + Date.now());
                    const text = await response.text();
                    
                    // スクリプトを直接評価
                    eval(text);
                    
                    return {
                        fetchSuccess: true,
                        scriptLength: text.length,
                        windowSafeDOMUpdaterAfterEval: typeof window.SafeDOMUpdater
                    };
                } catch (e) {
                    return {
                        fetchSuccess: false,
                        error: e.message
                    };
                }
            };
            
            return {
                beforeManualLoad: {
                    SafeDOMUpdater: typeof window.SafeDOMUpdater,
                    SingleDOMManager: typeof window.SingleDOMManager
                },
                manualLoadResult: manualLoad()
            };
        });
        
        const manualResult = await check.manualLoadResult;
        
        console.log('  初期状態:');
        console.log(`    SafeDOMUpdater: ${check.beforeManualLoad.SafeDOMUpdater}`);
        console.log(`    SingleDOMManager: ${check.beforeManualLoad.SingleDOMManager}`);
        
        console.log('\n  手動読み込み試行:');
        if (manualResult.fetchSuccess) {
            console.log(`    ✅ ファイル取得成功 (${manualResult.scriptLength} bytes)`);
            console.log(`    eval後: ${manualResult.windowSafeDOMUpdaterAfterEval}`);
        } else {
            console.log(`    ❌ エラー: ${manualResult.error}`);
        }
        
        // もう一度確認
        const afterManual = await page.evaluate(() => {
            return {
                SafeDOMUpdater: typeof window.SafeDOMUpdater,
                SafeDOMUpdaterClass: window.SafeDOMUpdater ? 'class exists' : 'not found'
            };
        });
        
        console.log('\n  手動読み込み後の状態:');
        console.log(`    SafeDOMUpdater: ${afterManual.SafeDOMUpdater}`);
        console.log(`    Class: ${afterManual.SafeDOMUpdaterClass}`);
        
        console.log('\n📋 Step 3: HTMLのscriptタグ確認');
        console.log('--------------------------------');
        
        // HTMLから直接scriptタグを確認
        const htmlCheck = await page.evaluate(() => {
            const scripts = Array.from(document.scripts);
            const safeDOMScript = scripts.find(s => s.src.includes('SafeDOMUpdater'));
            
            return {
                totalScripts: scripts.length,
                safeDOMScriptFound: !!safeDOMScript,
                safeDOMScriptSrc: safeDOMScript?.src,
                scriptsWithCore: scripts.filter(s => s.src.includes('/core/')).map(s => s.src.split('/').pop())
            };
        });
        
        console.log(`  総scriptタグ数: ${htmlCheck.totalScripts}`);
        console.log(`  SafeDOMUpdater scriptタグ: ${htmlCheck.safeDOMScriptFound ? '✅' : '❌'}`);
        if (htmlCheck.safeDOMScriptSrc) {
            console.log(`    src: ${htmlCheck.safeDOMScriptSrc}`);
        }
        console.log(`\n  /core/内のスクリプト:`);
        htmlCheck.scriptsWithCore.forEach(s => {
            console.log(`    - ${s}`);
        });
        
        console.log('\n=====================================');
        console.log('📊 診断結果');
        console.log('=====================================\n');
        
        if (!htmlCheck.safeDOMScriptFound) {
            console.log('❌ 問題: HTMLにSafeDOMUpdater.jsのscriptタグが存在しない');
            console.log('   → HTMLファイルの編集が反映されていない');
        } else if (afterManual.SafeDOMUpdater === 'undefined') {
            console.log('❌ 問題: scriptタグはあるが読み込まれていない');
            console.log('   → スクリプトの読み込みエラー');
        } else {
            console.log('✅ SafeDOMUpdaterは正常に読み込まれた');
        }
        
    } catch (error) {
        console.error('❌ エラー:', error.message);
    } finally {
        await browser.close();
    }
}

// 実行
testWithCacheClear().catch(console.error);