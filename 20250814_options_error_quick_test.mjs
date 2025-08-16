/**
 * options参照エラー修正の簡易検証
 */

import { chromium } from 'playwright';

async function quickOptionsTest() {
    console.log('🔧 options参照エラー修正検証');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        
        // エラー監視
        const errors = [];
        page.on('pageerror', error => {
            if (error.message.includes('options is not defined')) {
                errors.push('options error still exists');
            }
            console.error('Error:', error.message);
        });
        
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('EightScenariosDisplay') || text.includes('options')) {
                console.log(`[${msg.type().toUpperCase()}] ${text}`);
            }
        });
        
        console.log('📍 Future Simulatorページを開いています...');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'load',
            timeout: 10000
        });
        
        console.log('⏱️  5秒待機（初期化完了）...');
        await page.waitForTimeout(5000);
        
        // EightScenariosDisplay初期化状況確認
        const initStatus = await page.evaluate(() => {
            return {
                classAvailable: typeof EightScenariosDisplay !== 'undefined',
                canCreateInstance: (() => {
                    try {
                        const instance = new EightScenariosDisplay();
                        return { success: true, created: !!instance };
                    } catch (error) {
                        return { success: false, error: error.message };
                    }
                })()
            };
        });
        
        console.log('🔍 EightScenariosDisplay状況:');
        console.log('  - Class available:', initStatus.classAvailable ? '✅' : '❌');
        console.log('  - Can create instance:', initStatus.canCreateInstance.success ? '✅' : '❌');
        if (!initStatus.canCreateInstance.success) {
            console.log('  - Error:', initStatus.canCreateInstance.error);
        }
        
        return {
            success: errors.length === 0 && initStatus.canCreateInstance.success,
            optionsErrorsCount: errors.length,
            canCreateInstance: initStatus.canCreateInstance.success
        };
        
    } catch (error) {
        console.error('❌ テストエラー:', error);
        return { success: false, error: error.message };
    } finally {
        await browser.close();
    }
}

// 実行
quickOptionsTest().then(result => {
    console.log('\\n🎯 options参照エラー修正結果:');
    if (result.success) {
        console.log('✅ options参照エラーが修正されました');
        console.log('🎉 EightScenariosDisplayが正常に初期化できます');
    } else {
        console.log('❌ まだ問題が残っています:', result.error || 'Details above');
    }
}).catch(console.error);