/**
 * IChingSituationAnalyzer options エラー修正テスト
 */

import { chromium } from 'playwright';

async function testOptionsErrorFix() {
    console.log('[HAQEI][修正] IChingSituationAnalyzer options エラー修正テスト開始');
    console.log('========================================================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        
        // エラー監視
        const errors = [];
        page.on('pageerror', error => {
            errors.push({
                message: error.message,
                timestamp: new Date().toISOString()
            });
            console.error('❌ Page Error:', error.message);
        });
        
        console.log('[HAQEI][修正] Future Simulatorページにアクセス...');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        
        console.log('[HAQEI][修正] 5秒待機（初期化確認）...');
        await page.waitForTimeout(5000);
        
        // IChingSituationAnalyzer作成テスト
        const testResult = await page.evaluate(() => {
            const results = {
                // IChingSituationAnalyzer関連
                IChingSituationAnalyzer: typeof window.IChingSituationAnalyzer,
                canCreateInstance: false,
                creationError: null,
                hasOptionsParam: false,
                
                // RandomnessManager確認
                hasRandomnessManager: !!window.randomnessManager,
                randomnessManagerType: window.randomnessManager?.constructor?.name,
                
                // 既存インスタンス確認
                existingSimulator: !!window.ichingSimulator,
                situationAnalyzer: !!window.ichingSimulator?.situationAnalyzer
            };
            
            // インスタンス作成テスト
            try {
                const analyzer = new window.IChingSituationAnalyzer();
                results.canCreateInstance = true;
                results.hasOptionsParam = true;
                
                // メソッド確認
                results.hasAnalyzeSituationMethod = typeof analyzer.analyzeSituation === 'function';
                results.hasInitMethod = typeof analyzer.init === 'function';
                
                console.log('✅ [修正成功] IChingSituationAnalyzer インスタンス作成成功');
            } catch (error) {
                results.creationError = error.message;
                console.error('❌ [修正失敗] IChingSituationAnalyzer作成エラー:', error.message);
            }
            
            return results;
        });
        
        console.log('\n[HAQEI][修正] テスト結果:');
        console.log('==========================================');
        console.log(`  🔧 IChingSituationAnalyzer型: ${testResult.IChingSituationAnalyzer}`);
        console.log(`  🔧 インスタンス作成: ${testResult.canCreateInstance ? '✅' : '❌'}`);
        console.log(`  🔧 作成エラー: ${testResult.creationError || 'なし'}`);
        console.log(`  🔧 RandomnessManager: ${testResult.hasRandomnessManager ? '✅' : '❌'} (${testResult.randomnessManagerType})`);
        console.log(`  🔧 既存シミュレータ: ${testResult.existingSimulator ? '✅' : '❌'}`);
        console.log(`  🔧 状況分析器: ${testResult.situationAnalyzer ? '✅' : '❌'}`);
        
        console.log(`\n[HAQEI][修正] JavaScript errors: ${errors.length}件`);
        if (errors.length > 0) {
            errors.forEach(error => {
                console.log(`  ❌ ${error.message}`);
            });
        }
        
        // 成功判定
        const success = testResult.canCreateInstance && !testResult.creationError;
        
        if (success) {
            console.log('\n🎉 [修正成功] IChingSituationAnalyzer optionsエラー修正完了');
            console.log('✅ constructorでoptions = {}デフォルト引数が正常動作');
        } else {
            console.log('\n❌ [修正失敗] まだ問題が残存');
        }
        
        return { success, testResult, errors: errors.length };
        
    } catch (error) {
        console.error('[HAQEI][修正] テストエラー:', error);
        return { 
            success: false, 
            error: error.message 
        };
    } finally {
        console.log('\n[HAQEI][修正] 5秒間確認...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        await browser.close();
    }
}

// 実行
testOptionsErrorFix().then(result => {
    console.log('\n📋 IChingSituationAnalyzer options修正テスト完了');
    console.log('===============================================');
    
    if (result.success) {
        console.log('🎊 修正テスト: 完全成功');
        console.log('✅ IChingSituationAnalyzer constructor(options = {})が正常動作');
        console.log('✅ "options is not defined"エラー解決完了');
    } else {
        console.log('⚠️ 修正テスト: 改善必要');
        if (result.error) {
            console.log('Error details:', result.error);
        }
    }
    
}).catch(console.error);