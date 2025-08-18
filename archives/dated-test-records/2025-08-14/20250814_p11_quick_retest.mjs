/**
 * P1-1: 修正後の簡易再テスト（30秒）
 */

import { chromium } from 'playwright';

async function quickRetest() {
    console.log('🔧 P1-1: 修正後の簡易再テスト');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        
        // コンソールログ監視
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('HAQEI') || text.includes('Triple OS') || text.includes('storage')) {
                console.log(`[CONSOLE] ${text}`);
            }
        });
        
        console.log('📍 OS Analyzerページを開いています...');
        await page.goto('http://localhost:8788/os_analyzer.html', { 
            waitUntil: 'load',
            timeout: 15000
        });
        
        console.log('⏱️  8秒待機（モジュール読み込み完了を待つ）...');
        await page.waitForTimeout(8000);
        
        // 修正後の状態確認
        const moduleStatus = await page.evaluate(() => {
            return {
                criticalCSSAnalyzerExists: !!window.criticalCSSAnalyzer,
                saveMethodExists: !!(window.criticalCSSAnalyzer && window.criticalCSSAnalyzer.saveTripleOSToStorage),
                showToastExists: !!(window.criticalCSSAnalyzer && window.criticalCSSAnalyzer.showToast),
                consoleMessages: [] // リアルタイムでは取れないが、コンソール監視で確認
            };
        });
        
        console.log('🔍 修正後の状態:');
        console.log('  - criticalCSSAnalyzer:', moduleStatus.criticalCSSAnalyzerExists ? '✅' : '❌');
        console.log('  - saveTripleOSToStorage method:', moduleStatus.saveMethodExists ? '✅' : '❌'); 
        console.log('  - showToast method:', moduleStatus.showToastExists ? '✅' : '❌');
        
        // トースト表示テスト
        if (moduleStatus.showToastExists) {
            console.log('🧪 トースト表示テストを実行...');
            await page.evaluate(() => {
                window.criticalCSSAnalyzer.showToast('P1-1テスト: モジュール読み込み成功', 'success');
            });
            await page.waitForTimeout(2000);
            console.log('✅ トースト表示テスト完了');
        }
        
        // 保存機能の簡易テスト（モックデータ）
        if (moduleStatus.saveMethodExists) {
            console.log('🧪 保存機能の簡易テスト...');
            const testResult = await page.evaluate(() => {
                try {
                    // モックデータで保存テスト
                    const mockTripleOSResults = {
                        engineOS: { hexagram: '探求型', name: 'TestEngine' },
                        interfaceOS: { hexagram: '調整型', name: 'TestInterface' },
                        safeModeOS: { hexagram: '防衛型', name: 'TestSafeMode' }
                    };
                    
                    window.criticalCSSAnalyzer.saveTripleOSToStorage(mockTripleOSResults);
                    
                    // 保存確認
                    const saved = localStorage.getItem('haqei.tripleOS.v1');
                    return {
                        success: !!saved,
                        data: saved ? JSON.parse(saved) : null
                    };
                } catch (error) {
                    return {
                        success: false,
                        error: error.message
                    };
                }
            });
            
            if (testResult.success) {
                console.log('✅ 保存機能テスト成功');
                console.log('  - engineOS:', testResult.data?.engineOS);
                console.log('  - interfaceOS:', testResult.data?.interfaceOS);
                console.log('  - safeModeOS:', testResult.data?.safeModeOS);
                console.log('  - version:', testResult.data?.version);
            } else {
                console.log('❌ 保存機能テスト失敗:', testResult.error);
            }
        }
        
        const allWorking = moduleStatus.criticalCSSAnalyzerExists && 
                          moduleStatus.saveMethodExists && 
                          moduleStatus.showToastExists;
                          
        return {
            success: allWorking,
            details: moduleStatus
        };
        
    } catch (error) {
        console.error('❌ テストエラー:', error);
        return { success: false, error: error.message };
    } finally {
        await browser.close();
    }
}

// 実行
quickRetest().then(result => {
    console.log('\n🎯 修正後テスト結果:', result.success ? '✅ 成功' : '❌ 失敗');
    if (result.success) {
        console.log('🎉 P1-1基本機能実装完了 - 手動テスト準備OK');
        console.log('📋 次: OS Analyzerで実際の診断を完了させて保存機能を確認');
    } else {
        console.log('💥 追加修正が必要:', result.error || 'Details in console');
    }
}).catch(console.error);