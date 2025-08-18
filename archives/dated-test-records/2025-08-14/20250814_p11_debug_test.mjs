/**
 * P1-1: CriticalCSSAnalyzer作成問題のデバッグテスト
 */

import { chromium } from 'playwright';

async function debugCriticalCSSAnalyzer() {
    console.log('🕵️ P1-1: CriticalCSSAnalyzer問題デバッグ');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        
        // すべてのコンソールログとエラーを監視
        page.on('console', msg => {
            const type = msg.type();
            const text = msg.text();
            console.log(`[${type.toUpperCase()}] ${text}`);
        });
        
        page.on('pageerror', error => {
            console.error('❌ Page Error:', error.message);
            console.error('Stack:', error.stack);
        });
        
        console.log('📍 OS Analyzerページを開いています...');
        await page.goto('http://localhost:8788/os_analyzer.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        
        console.log('⏱️  3秒待機（基本読み込み完了）...');
        await page.waitForTimeout(3000);
        
        // CriticalCSSAnalyzerクラス定義の存在確認
        const classExists = await page.evaluate(() => {
            return typeof CriticalCSSAnalyzer !== 'undefined';
        });
        console.log('🔍 CriticalCSSAnalyzer class defined:', classExists ? '✅' : '❌');
        
        // 依存クラスの存在確認
        const dependencies = await page.evaluate(() => {
            return {
                HaQeiState: typeof HaQeiState !== 'undefined',
                TripleOSEngine: typeof TripleOSEngine !== 'undefined'
            };
        });
        console.log('🔍 Dependencies:');
        console.log('  - HaQeiState:', dependencies.HaQeiState ? '✅' : '❌');
        console.log('  - TripleOSEngine:', dependencies.TripleOSEngine ? '✅' : '❌');
        
        // 手動インスタンス作成テスト
        console.log('🧪 手動でCriticalCSSAnalyzer作成を試行...');
        const manualCreationResult = await page.evaluate(() => {
            try {
                if (typeof CriticalCSSAnalyzer === 'undefined') {
                    return { success: false, error: 'CriticalCSSAnalyzer class not found' };
                }
                
                const analyzer = new CriticalCSSAnalyzer();
                window.testAnalyzer = analyzer; // テスト用に格納
                return { success: true };
                
            } catch (error) {
                return { success: false, error: error.message, stack: error.stack };
            }
        });
        
        if (manualCreationResult.success) {
            console.log('✅ 手動作成成功');
            
            // showToastメソッド追加テスト
            await page.evaluate(() => {
                window.testAnalyzer.showToast = function(message, type = 'info') {
                    console.log(`Toast: ${message} (${type})`);
                    
                    const toast = document.createElement('div');
                    toast.textContent = message;
                    toast.style.cssText = `
                        position: fixed; top: 20px; right: 20px; z-index: 10000;
                        padding: 12px; background: #22c55e; color: white; border-radius: 8px;
                    `;
                    document.body.appendChild(toast);
                    
                    setTimeout(() => toast.remove(), 2000);
                };
            });
            
            // テストトースト表示
            await page.evaluate(() => {
                window.testAnalyzer.showToast('手動作成テスト成功', 'success');
            });
            
            console.log('✅ showToast追加・テスト完了');
            
        } else {
            console.log('❌ 手動作成失敗:', manualCreationResult.error);
            if (manualCreationResult.stack) {
                console.log('Stack:', manualCreationResult.stack);
            }
        }
        
        console.log('⏱️  さらに5秒待機（自動実行確認）...');
        await page.waitForTimeout(5000);
        
        // window.criticalCSSAnalyzerの最終確認
        const finalAnalyzerState = await page.evaluate(() => {
            return {
                exists: !!window.criticalCSSAnalyzer,
                type: typeof window.criticalCSSAnalyzer,
                hasShowToast: !!(window.criticalCSSAnalyzer && window.criticalCSSAnalyzer.showToast),
                hasSaveMethod: !!(window.criticalCSSAnalyzer && window.criticalCSSAnalyzer.saveTripleOSToStorage)
            };
        });
        
        console.log('🔍 最終的なwindow.criticalCSSAnalyzer状態:');
        console.log('  - exists:', finalAnalyzerState.exists ? '✅' : '❌');
        console.log('  - type:', finalAnalyzerState.type);
        console.log('  - hasShowToast:', finalAnalyzerState.hasShowToast ? '✅' : '❌');
        console.log('  - hasSaveMethod:', finalAnalyzerState.hasSaveMethod ? '✅' : '❌');
        
        return {
            classExists,
            dependencies,
            manualCreation: manualCreationResult.success,
            finalAnalyzer: finalAnalyzerState.exists,
            issues: !classExists ? ['Class not defined'] :
                   !dependencies.HaQeiState ? ['HaQeiState missing'] :
                   !dependencies.TripleOSEngine ? ['TripleOSEngine missing'] :
                   !manualCreationResult.success ? ['Constructor error'] :
                   !finalAnalyzerState.exists ? ['Auto-creation failed'] :
                   []
        };
        
    } catch (error) {
        console.error('❌ デバッグテストエラー:', error);
        return { success: false, error: error.message };
    } finally {
        await browser.close();
    }
}

// 実行
debugCriticalCSSAnalyzer().then(result => {
    console.log('\n🎯 デバッグ結果:', result);
    if (result.issues && result.issues.length > 0) {
        console.log('💡 修正すべき問題:', result.issues);
    } else {
        console.log('✅ 大きな問題は見つかりませんでした');
    }
}).catch(console.error);