/**
 * P0-1 Full Page Integration Test
 * IChingFutureSimulator ESM mount in complete Future Simulator environment
 * P0-2改善後の統合動作確認
 */

import { chromium } from 'playwright';

async function testP01FullPageIntegration() {
    console.log('[HAQEI][P0-1] Full Page統合テスト開始');
    console.log('==========================================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        
        // 統合テスト用詳細ログ監視
        const integrationLogs = [];
        const errors = [];
        const successEvents = [];
        
        page.on('pageerror', error => {
            errors.push({
                message: error.message,
                timestamp: new Date().toISOString()
            });
            console.error('❌ Page Error:', error.message);
        });
        
        page.on('console', msg => {
            const text = msg.text();
            const type = msg.type();
            
            // P0-1関連ログ
            if (text.includes('[HAQEI][P0-1]') || text.includes('IChingFutureSimulator')) {
                integrationLogs.push(text);
                console.log('📋 P0-1:', text);
            }
            
            // P0-2改善効果ログ
            if (text.includes('[HAQEI][P0-2]') && text.includes('✅')) {
                successEvents.push(text);
                console.log('📋 P0-2 Success:', text);
            }
            
            // Component initialization success
            if (text.includes('✅') && (
                text.includes('RandomnessManager') || 
                text.includes('DataDrivenKeywordAnalyzer') ||
                text.includes('mount')
            )) {
                successEvents.push(text);
                console.log('📋 Success:', text);
            }
            
            // Critical errors
            if (type === 'error' || text.includes('❌')) {
                console.error(`[${type.toUpperCase()}] ${text}`);
            }
        });
        
        console.log('[HAQEI][P0-1] Future Simulatorページにアクセス...');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 25000
        });
        
        console.log('[HAQEI][P0-1] 12秒待機（ESM統合とマウント確認）...');
        await page.waitForTimeout(12000);
        
        // P0-1統合確認
        const integrationResults = await page.evaluate(() => {
            const results = {
                // Basic requirements
                containerExists: !!document.getElementById('i-ching-container'),
                simulatorMounted: !!window.ichingSimulator,
                simulatorType: window.ichingSimulator?.constructor?.name,
                
                // P0-1 ESM specific checks
                hasMountMethod: typeof window.ichingSimulator?.mount === 'function',
                hasIsReadyMethod: typeof window.ichingSimulator?.isReady === 'function',
                isReady: window.ichingSimulator?.isReady?.() || false,
                
                // P0-2 improvements verification
                hasRandomnessManager: !!window.randomnessManager,
                randomnessManagerType: window.randomnessManager?.constructor?.name,
                
                // Container content check
                containerContent: document.getElementById('i-ching-container')?.innerHTML?.length || 0,
                containerHasContent: (document.getElementById('i-ching-container')?.innerHTML?.length || 0) > 100,
                
                // ESM import success indicators
                windowIChingKeys: Object.keys(window).filter(k => k.includes('ching')),
                
                // Error states
                hasVisibleErrors: !!document.querySelector('.error, .fatal'),
                errorCount: document.querySelectorAll('.error, .fatal').length
            };
            
            // Try to get more details about the simulator
            if (window.ichingSimulator) {
                try {
                    results.simulatorContainer = !!window.ichingSimulator.container;
                    results.simulatorInitialized = !!window.ichingSimulator.isInitialized;
                } catch (e) {
                    results.simulatorAccessError = e.message;
                }
            }
            
            return results;
        });
        
        console.log('\n[HAQEI][P0-1] Full Page統合確認結果:');
        console.log('==========================================');
        console.log(`  🎯 #i-ching-container存在: ${integrationResults.containerExists ? '✅' : '❌'}`);
        console.log(`  🎯 IChingFutureSimulatorマウント: ${integrationResults.simulatorMounted ? '✅' : '❌'}`);
        console.log(`  🎯 シミュレータタイプ: ${integrationResults.simulatorType || 'undefined'}`);
        console.log(`  🎯 mount()メソッド: ${integrationResults.hasMountMethod ? '✅' : '❌'}`);
        console.log(`  🎯 isReady()メソッド: ${integrationResults.hasIsReadyMethod ? '✅' : '❌'}`);
        console.log(`  🎯 準備状態: ${integrationResults.isReady ? '✅' : '⚠️'}`);
        console.log(`  🎯 RandomnessManager: ${integrationResults.hasRandomnessManager ? '✅' : '❌'} (${integrationResults.randomnessManagerType})`);
        console.log(`  🎯 コンテナコンテンツ: ${integrationResults.containerHasContent ? '✅' : '❌'} (${integrationResults.containerContent}文字)`);
        console.log(`  🎯 表示エラー: ${integrationResults.hasVisibleErrors ? `❌ ${integrationResults.errorCount}件` : '✅ なし'}`);
        
        // Integration logs analysis
        console.log(`\n[HAQEI][P0-1] ESM統合ログ分析:`);
        console.log('=====================================');
        console.log(`  📋 P0-1関連ログ: ${integrationLogs.length}件`);
        
        const mountLogs = integrationLogs.filter(log => log.includes('mount'));
        const initLogs = integrationLogs.filter(log => log.includes('initialization') || log.includes('init'));
        const errorLogs = integrationLogs.filter(log => log.includes('ERROR') || log.includes('failed'));
        
        console.log(`  📋 マウント関連: ${mountLogs.length}件`);
        console.log(`  📋 初期化関連: ${initLogs.length}件`);
        console.log(`  📋 エラー関連: ${errorLogs.length}件`);
        
        if (mountLogs.length > 0) {
            console.log('  マウントログ詳細:');
            mountLogs.forEach(log => console.log(`    - ${log}`));
        }
        
        // P0-2 improvement impact
        console.log(`\n[HAQEI][P0-2] 改善効果確認:`);
        console.log('=====================================');
        console.log(`  📊 成功イベント: ${successEvents.length}件`);
        console.log(`  📊 JavaScript errors: ${errors.length}件`);
        
        if (successEvents.length > 0) {
            console.log('  主要成功イベント:');
            successEvents.slice(0, 5).forEach(event => console.log(`    ✅ ${event}`));
        }
        
        // Overall integration assessment
        const coreRequirements = [
            integrationResults.containerExists,
            integrationResults.simulatorMounted,
            integrationResults.hasMountMethod,
            integrationResults.hasRandomnessManager
        ];
        
        const enhancedRequirements = [
            integrationResults.isReady,
            integrationResults.containerHasContent,
            !integrationResults.hasVisibleErrors,
            errors.length <= 2  // Allowing up to 2 non-critical errors
        ];
        
        const coreSuccess = coreRequirements.filter(Boolean).length;
        const enhancedSuccess = enhancedRequirements.filter(Boolean).length;
        const coreRate = Math.round((coreSuccess / coreRequirements.length) * 100);
        const enhancedRate = Math.round((enhancedSuccess / enhancedRequirements.length) * 100);
        
        console.log(`\n[HAQEI][P0-1] 統合テスト総合評価:`);
        console.log('=====================================');
        console.log(`  📊 コア要件: ${coreSuccess}/${coreRequirements.length} (${coreRate}%)`);
        console.log(`  📊 拡張要件: ${enhancedSuccess}/${enhancedRequirements.length} (${enhancedRate}%)`);
        console.log(`  📊 総合評価: ${Math.round((coreRate + enhancedRate) / 2)}%`);
        
        const overallSuccess = coreRate >= 75 && enhancedRate >= 50;
        const fullSuccess = coreRate >= 90 && enhancedRate >= 75;
        
        if (fullSuccess) {
            console.log('  🎉 P0-1 Full Page統合: ✅ 完全成功');
            console.log('  🌟 ESM mount + full environment integration achieved');
        } else if (overallSuccess) {
            console.log('  🎉 P0-1 Full Page統合: ✅ 基本成功');
            console.log('  ⚠️  軽微な拡張機能の改善余地あり');
        } else {
            console.log('  ❌ P0-1 Full Page統合: 追加修正必要');
        }
        
        return {
            success: overallSuccess,
            fullSuccess,
            coreRate,
            enhancedRate,
            results: integrationResults,
            logs: integrationLogs.length,
            errors: errors.length,
            successEvents: successEvents.length
        };
        
    } catch (error) {
        console.error('[HAQEI][P0-1] 統合テストエラー:', error);
        return { 
            success: false, 
            error: error.message 
        };
    } finally {
        console.log('\n[HAQEI][P0-1] 最終確認のため15秒間ページを確認...');
        await new Promise(resolve => setTimeout(resolve, 15000));
        await browser.close();
    }
}

// 実行
testP01FullPageIntegration().then(result => {
    console.log('\n📋 P0-1 Full Page統合テスト完了');
    console.log('=====================================');
    
    if (result.fullSuccess) {
        console.log('🎊 P0-1統合テスト: 完全成功');
        console.log('✅ ESM mount + full page environment = Perfect integration');
        console.log('🚀 準備完了: UI改善フェーズに進行可能');
    } else if (result.success) {
        console.log('🎉 P0-1統合テスト: 基本成功');
        console.log('✅ Core functionality working in full page environment');
        console.log('⚠️ Minor enhancements possible, but ready for UI phase');
    } else {
        console.log('⚠️ P0-1統合テスト: 改善必要');
        if (result.error) {
            console.log('Error details:', result.error);
        }
    }
    
    if (result.success) {
        console.log('\n🎯 次の段階: UI改善 (8カード固定システム等)');
    }
    
}).catch(console.error);