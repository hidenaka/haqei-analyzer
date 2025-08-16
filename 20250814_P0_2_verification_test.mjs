/**
 * P0-2 検証テスト
 * DataDrivenKeywordAnalyzer, MetaphorGenerationEngine, EightScenariosGenerator 修正確認
 */

import { chromium } from 'playwright';

async function testP02Fixes() {
    console.log('[HAQEI][P0-2] 修正確認テスト開始');
    console.log('=====================================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        
        // エラーと成功ログの監視
        const errors = [];
        const successLogs = [];
        
        page.on('pageerror', error => {
            errors.push({
                message: error.message,
                timestamp: new Date().toISOString()
            });
            console.error('❌ Page Error:', error.message);
        });
        
        page.on('console', msg => {
            const text = msg.text();
            
            if (text.includes('[P0-2]') && text.includes('✅')) {
                successLogs.push(text);
                console.log('📋 Success:', text);
            } else if (text.includes('DataDrivenKeywordAnalyzer') || 
                      text.includes('MetaphorGenerationEngine') ||
                      text.includes('EightScenariosGenerator')) {
                console.log('📋 Component:', text);
            }
        });
        
        console.log('[HAQEI][P0-2] Future Simulatorページにアクセス...');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'domcontentloaded',
            timeout: 20000
        });
        
        console.log('[HAQEI][P0-2] 15秒待機（初期化とコンポーネント作成確認）...');
        await page.waitForTimeout(15000);
        
        // P0-2修正の確認
        const p02Results = await page.evaluate(() => {
            const results = {
                // RandomnessManagerの確認
                hasRandomnessManager: !!window.randomnessManager,
                
                // コンポーネント作成テスト
                canCreateDataDrivenKeywordAnalyzer: false,
                canCreateMetaphorGenerationEngine: false,
                canCreateEightScenariosGenerator: false,
                
                // エラーの詳細
                errors: [],
                
                // H384データの状態
                hasH384Data: !!window.H384_DATA,
                h384DataLength: window.H384_DATA ? window.H384_DATA.length : 0
            };
            
            // RandomnessManagerの確認
            if (!results.hasRandomnessManager) {
                results.errors.push('RandomnessManager not available');
            }
            
            // H384データの確認
            if (!results.hasH384Data) {
                results.errors.push('H384_DATA not available');
            }
            
            // DataDrivenKeywordAnalyzer作成テスト
            try {
                if (window.DataDrivenKeywordAnalyzer && window.H384_DATA) {
                    const analyzer = new window.DataDrivenKeywordAnalyzer(window.H384_DATA, {
                        randomnessManager: window.randomnessManager
                    });
                    results.canCreateDataDrivenKeywordAnalyzer = true;
                    console.log('[P0-2] ✅ DataDrivenKeywordAnalyzer creation successful');
                }
            } catch (error) {
                results.errors.push(`DataDrivenKeywordAnalyzer: ${error.message}`);
                console.error('[P0-2] ❌ DataDrivenKeywordAnalyzer creation failed:', error.message);
            }
            
            // MetaphorGenerationEngine作成テスト
            try {
                if (window.MetaphorGenerationEngine) {
                    const engine = new window.MetaphorGenerationEngine({
                        randomnessManager: window.randomnessManager
                    });
                    results.canCreateMetaphorGenerationEngine = true;
                    console.log('[P0-2] ✅ MetaphorGenerationEngine creation successful');
                }
            } catch (error) {
                results.errors.push(`MetaphorGenerationEngine: ${error.message}`);
                console.error('[P0-2] ❌ MetaphorGenerationEngine creation failed:', error.message);
            }
            
            // EightScenariosGenerator作成テスト
            try {
                if (window.EightScenariosGenerator) {
                    const generator = new window.EightScenariosGenerator({
                        randomnessManager: window.randomnessManager
                    });
                    results.canCreateEightScenariosGenerator = true;
                    console.log('[P0-2] ✅ EightScenariosGenerator creation successful');
                }
            } catch (error) {
                results.errors.push(`EightScenariosGenerator: ${error.message}`);
                console.error('[P0-2] ❌ EightScenariosGenerator creation failed:', error.message);
            }
            
            return results;
        });
        
        console.log('\n[HAQEI][P0-2] 修正確認結果:');
        console.log('=====================================');
        console.log(`  🎯 RandomnessManager: ${p02Results.hasRandomnessManager ? '✅' : '❌'}`);
        console.log(`  🎯 H384データ: ${p02Results.hasH384Data ? '✅' : '❌'} (${p02Results.h384DataLength}件)`);
        console.log(`  🎯 DataDrivenKeywordAnalyzer作成: ${p02Results.canCreateDataDrivenKeywordAnalyzer ? '✅' : '❌'}`);
        console.log(`  🎯 MetaphorGenerationEngine作成: ${p02Results.canCreateMetaphorGenerationEngine ? '✅' : '❌'}`);
        console.log(`  🎯 EightScenariosGenerator作成: ${p02Results.canCreateEightScenariosGenerator ? '✅' : '❌'}`);
        
        // 正規化ログの確認
        console.log(`\n[HAQEI][P0-2] 正規化処理ログ: ${successLogs.length}件`);
        if (successLogs.length > 0) {
            successLogs.forEach(log => console.log(`  📋 ${log}`));
        }
        
        // エラーサマリー
        console.log(`\n[HAQEI][P0-2] エラー状況:`);
        console.log(`  🚨 JavaScript errors: ${errors.length}件`);
        console.log(`  🚨 Component errors: ${p02Results.errors.length}件`);
        
        if (p02Results.errors.length > 0) {
            console.log('  詳細:');
            p02Results.errors.forEach(error => console.log(`    - ${error}`));
        }
        
        // 総合評価
        const fixedComponents = [
            p02Results.canCreateDataDrivenKeywordAnalyzer,
            p02Results.canCreateMetaphorGenerationEngine,
            p02Results.canCreateEightScenariosGenerator
        ];
        
        const successCount = fixedComponents.filter(Boolean).length;
        const successRate = Math.round((successCount / fixedComponents.length) * 100);
        
        console.log(`\n[HAQEI][P0-2] 総合評価:`);
        console.log(`=====================================`);
        console.log(`  📊 修正成功率: ${successCount}/${fixedComponents.length} (${successRate}%)`);
        
        if (successRate >= 75) {
            console.log('  🎉 P0-2修正: ✅ 成功');
            if (successRate === 100) {
                console.log('  🌟 完全成功 - P0-2完了');
            } else {
                console.log('  ⚠️  軽微な問題あり、しかし大幅改善');
            }
        } else {
            console.log('  ❌ P0-2修正: 問題あり、追加修正必要');
        }
        
        return {
            success: successRate >= 75,
            successRate,
            results: p02Results,
            errors: errors.length,
            successLogs: successLogs.length
        };
        
    } catch (error) {
        console.error('[HAQEI][P0-2] テストエラー:', error);
        return { 
            success: false, 
            error: error.message 
        };
    } finally {
        console.log('\n[HAQEI][P0-2] 15秒後にブラウザを閉じます...');
        await new Promise(resolve => setTimeout(resolve, 15000));
        await browser.close();
    }
}

// 実行
testP02Fixes().then(result => {
    if (result.success) {
        console.log('\n🎊 P0-2修正確認テスト完了 - 成功');
        console.log('専門家助言のP0-2課題が解決されました');
        console.log('次のステップ: P1実装またはUI改善に進めます');
    } else {
        console.log('\n⚠️ P0-2修正に残存課題があります');
        if (result.error) {
            console.log('エラー:', result.error);
        }
    }
}).catch(console.error);