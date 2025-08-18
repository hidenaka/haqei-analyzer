/**
 * 構文エラーの詳細特定テスト
 */

import { chromium } from 'playwright';

async function findSyntaxError() {
    console.log('🔍 構文エラー詳細特定テスト');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        
        // すべてのエラーを詳細に監視
        page.on('pageerror', error => {
            console.error('❌ Page Error:', error.message);
            console.error('❌ Stack:', error.stack);
            console.error('❌ Line number:', error.lineNumber || 'unknown');
            console.error('❌ Column number:', error.columnNumber || 'unknown');
        });
        
        page.on('console', msg => {
            const type = msg.type();
            if (type === 'error' || type === 'warning') {
                console.log(`[${type.toUpperCase()}] ${msg.text()}`);
                
                // 追加的なコンテキスト情報があれば表示
                const args = msg.args();
                if (args.length > 0) {
                    args.forEach((arg, index) => {
                        console.log(`  Arg ${index}:`, arg.toString());
                    });
                }
            }
        });
        
        console.log('📍 OS Analyzerページを開いています...');
        
        try {
            await page.goto('http://localhost:8788/os_analyzer.html', { 
                waitUntil: 'domcontentloaded',
                timeout: 15000
            });
        } catch (gotoError) {
            console.error('❌ Page load error:', gotoError.message);
        }
        
        console.log('⏱️  5秒待機（エラー詳細収集）...');
        await page.waitForTimeout(5000);
        
        // 基本的なJavaScript実行テスト
        const basicJSTest = await page.evaluate(() => {
            try {
                // 基本的な構文をテスト
                eval('var test = 1;');
                eval('if (true) { var test2 = 2; }');
                eval('function testFunc() { return "OK"; }');
                
                return { success: true };
            } catch (error) {
                return { 
                    success: false, 
                    error: error.message,
                    stack: error.stack 
                };
            }
        });
        
        console.log('🧪 基本JavaScript実行テスト:', basicJSTest.success ? '✅' : '❌');
        if (!basicJSTest.success) {
            console.log('❌ 基本JS Error:', basicJSTest.error);
        }
        
        // スクリプトタグの数と実行状況
        const scriptInfo = await page.evaluate(() => {
            const scripts = document.querySelectorAll('script');
            return {
                totalScripts: scripts.length,
                inlineScripts: Array.from(scripts).filter(s => !s.src).length,
                externalScripts: Array.from(scripts).filter(s => s.src).length
            };
        });
        
        console.log('📊 スクリプト情報:', scriptInfo);
        
        return {
            pageLoaded: true,
            basicJSWorking: basicJSTest.success,
            scriptsFound: scriptInfo.totalScripts > 0
        };
        
    } catch (error) {
        console.error('❌ テストエラー:', error);
        return { success: false, error: error.message };
    } finally {
        // エラー詳細確認のため、少し長めに開いておく
        console.log('🔍 ブラウザを10秒間開いたまま残します（エラー詳細確認用）...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        await browser.close();
    }
}

// 実行
findSyntaxError().then(result => {
    console.log('\n🎯 構文エラー特定結果:', result);
}).catch(console.error);