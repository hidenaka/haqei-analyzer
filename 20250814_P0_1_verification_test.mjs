/**
 * P0-1 実装確認テスト
 * IChingFutureSimulator の ESM import + mount() 検証
 */

import { chromium } from 'playwright';

async function testP01Implementation() {
    console.log('[HAQEI][P0-1] 実装確認テスト開始');
    console.log('=====================================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        
        // コンソールログの監視
        const logs = [];
        const errors = [];
        
        page.on('console', msg => {
            const text = msg.text();
            logs.push(text);
            
            if (text.includes('[HAQEI][P0-1]')) {
                console.log('  📋', text);
            }
        });
        
        page.on('pageerror', error => {
            errors.push(error.message);
            console.error('  ❌ Page Error:', error.message);
        });
        
        console.log('[HAQEI][P0-1] Future Simulatorページにアクセス...');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 15000
        });
        
        console.log('[HAQEI][P0-1] 10秒待機（ESM初期化確認）...');
        await page.waitForTimeout(10000);
        
        // P0-1実装の確認
        const p01Results = await page.evaluate(() => {
            const results = {
                containerExists: !!document.getElementById('i-ching-container'),
                simulatorMounted: !!window.ichingSimulator,
                simulatorType: window.ichingSimulator?.constructor?.name,
                mountMethodExists: typeof window.ichingSimulator?.mount === 'function',
                isReadyMethodExists: typeof window.ichingSimulator?.isReady === 'function',
                globalFunctionExists: typeof window.getIChingSimulator === 'function'
            };
            
            return results;
        });
        
        console.log('\n[HAQEI][P0-1] 実装検証結果:');
        console.log('=====================================');
        console.log(`  🎯 #i-ching-container 存在: ${p01Results.containerExists ? '✅' : '❌'}`);
        console.log(`  🎯 IChingFutureSimulator マウント: ${p01Results.simulatorMounted ? '✅' : '❌'}`);
        console.log(`  🎯 シミュレータ型: ${p01Results.simulatorType || 'undefined'}`);
        console.log(`  🎯 mount() メソッド: ${p01Results.mountMethodExists ? '✅' : '❌'}`);
        console.log(`  🎯 isReady() メソッド: ${p01Results.isReadyMethodExists ? '✅' : '❌'}`);
        console.log(`  🎯 グローバル関数: ${p01Results.globalFunctionExists ? '✅' : '❌'}`);
        
        // ESMログの確認
        const esmLogs = logs.filter(log => log.includes('[HAQEI][P0-1]'));
        console.log(`\n[HAQEI][P0-1] ESM初期化ログ: ${esmLogs.length}件`);
        
        const importSuccess = esmLogs.some(log => log.includes('ESM mount initialization starting'));
        const mountSuccess = esmLogs.some(log => log.includes('ESM mount successful'));
        
        console.log(`  📋 ESM初期化開始: ${importSuccess ? '✅' : '❌'}`);
        console.log(`  📋 マウント成功: ${mountSuccess ? '✅' : '❌'}`);
        
        // 総合評価
        const criticalChecks = [
            p01Results.containerExists,
            p01Results.simulatorMounted, 
            p01Results.mountMethodExists,
            importSuccess
        ];
        
        const passedChecks = criticalChecks.filter(check => check).length;
        const successRate = Math.round((passedChecks / criticalChecks.length) * 100);
        
        console.log(`\n[HAQEI][P0-1] 総合評価:`);
        console.log(`=====================================`);
        console.log(`  📊 成功率: ${passedChecks}/${criticalChecks.length} (${successRate}%)`);
        console.log(`  🚨 エラー数: ${errors.length}件`);
        
        if (successRate >= 75) {
            console.log('  🎉 P0-1実装: ✅ 成功');
            if (successRate === 100) {
                console.log('  🌟 完全成功 - P0-1完了');
            } else {
                console.log('  ⚠️  軽微な問題あり、しかし動作可能');
            }
        } else {
            console.log('  ❌ P0-1実装: 問題あり、追加修正必要');
        }
        
        return {
            success: successRate >= 75,
            successRate,
            results: p01Results,
            logs: esmLogs,
            errors
        };
        
    } catch (error) {
        console.error('[HAQEI][P0-1] テストエラー:', error);
        return { 
            success: false, 
            error: error.message 
        };
    } finally {
        console.log('\n[HAQEI][P0-1] 15秒後にブラウザを閉じます...');
        await new Promise(resolve => setTimeout(resolve, 15000));
        await browser.close();
    }
}

// 実行
testP01Implementation().then(result => {
    if (result.success) {
        console.log('\n🎊 P0-1実装確認テスト完了 - 成功');
        console.log('次のステップ: P0-2の実装に進めます');
    } else {
        console.log('\n⚠️ P0-1実装に問題があります');
        console.log('追加修正が必要です');
    }
}).catch(console.error);