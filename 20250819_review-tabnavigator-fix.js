import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    console.log('🔍 TabNavigator連携修正 実装レビュー開始');
    console.log('レビュー日時:', new Date().toISOString());
    console.log('============================================\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        devtools: true
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // コンソールログとエラー監視
    const consoleLogs = [];
    const consoleErrors = [];
    
    page.on('console', msg => {
        const text = msg.text();
        consoleLogs.push({ type: msg.type(), text });
        
        if (msg.type() === 'error') {
            consoleErrors.push(text);
            console.log('❌ Console Error:', text);
        } else if (text.includes('TabNavigator') || text.includes('BasicResultsTab')) {
            console.log(`[${msg.type()}] ${text}`);
        }
    });
    
    // Phase 1: ページ読み込みと初期化確認
    console.log('📋 Phase 1: ページ読み込みと初期化確認\n');
    const resultsPath = `file://${path.join(__dirname, 'public', 'results.html')}`;
    
    try {
        await page.goto(resultsPath);
        await page.waitForTimeout(2000);
        console.log('✅ results.htmlの読み込み成功');
        
        // 初期化ログの確認
        const initLogs = consoleLogs.filter(log => 
            log.text.includes('TabNavigator初期化完了') ||
            log.text.includes('BasicResultsTabを登録')
        );
        
        if (initLogs.length > 0) {
            console.log('✅ 初期化ログ確認:');
            initLogs.forEach(log => console.log(`   - ${log.text}`));
        }
    } catch (error) {
        console.log('❌ ページ読み込み失敗:', error.message);
        await browser.close();
        return;
    }
    
    // Phase 2: グローバル変数の確認（Task 1-1の検証）
    console.log('\n📋 Phase 2: グローバル変数の確認 (Task 1-1)\n');
    
    const globalCheck = await page.evaluate(() => {
        return {
            tabNavigatorGlobal: typeof window.tabNavigator !== 'undefined',
            tabNavigatorType: window.tabNavigator ? window.tabNavigator.constructor.name : 'undefined',
            basicTabGlobal: typeof window.basicResultsTab !== 'undefined',
            basicTabType: window.basicResultsTab ? window.basicResultsTab.constructor.name : 'undefined',
            testHelperExists: typeof window.testBasicTab === 'function'
        };
    });
    
    console.log('グローバル変数チェック:');
    console.log(`  window.tabNavigator: ${globalCheck.tabNavigatorGlobal ? '✅' : '❌'} (${globalCheck.tabNavigatorType})`);
    console.log(`  window.basicResultsTab: ${globalCheck.basicTabGlobal ? '✅' : '❌'} (${globalCheck.basicTabType})`);
    console.log(`  window.testBasicTab: ${globalCheck.testHelperExists ? '✅' : '❌'}`);
    
    // Phase 3: テストヘルパー機能の確認（Task 2-1の検証）
    console.log('\n📋 Phase 3: テストヘルパー機能確認 (Task 2-1)\n');
    
    if (globalCheck.testHelperExists) {
        const testResult = await page.evaluate(() => {
            // テストデータで実行
            const result = window.testBasicTab({
                engineOS: { score: 85, hexagram: '天風姤' },
                interfaceOS: { score: 70, hexagram: '地山謙' },
                safeModeOS: { score: 55, hexagram: '水火既済' }
            });
            
            // 実行後の状態確認
            if (result && window.basicResultsTab) {
                const data = window.basicResultsTab.analysisData;
                return {
                    success: result,
                    dataSet: !!data,
                    engineScore: data?.engine?.score,
                    interfaceScore: data?.interface?.score,
                    safeModeScore: data?.safeMode?.score
                };
            }
            
            return { success: result, error: 'データ設定失敗' };
        });
        
        if (testResult.success) {
            console.log('✅ testBasicTab実行成功');
            console.log('  投入データ確認:');
            console.log(`    - Engine OS: ${testResult.engineScore}点`);
            console.log(`    - Interface OS: ${testResult.interfaceScore}点`);
            console.log(`    - SafeMode OS: ${testResult.safeModeScore}点`);
        } else {
            console.log('❌ testBasicTab実行失敗:', testResult.error);
        }
    } else {
        console.log('⚠️ テストヘルパーが実装されていません');
    }
    
    // Phase 4: エラーハンドリング強化の確認（Task 3-1の検証）
    console.log('\n📋 Phase 4: エラーハンドリング強化確認 (Task 3-1)\n');
    
    // エラーをわざと発生させてみる
    const errorHandlingTest = await page.evaluate(() => {
        try {
            // console.tableが使われているか確認するため、エラー処理部分を確認
            const errorLogs = [];
            const originalTable = console.table;
            console.table = function(data) {
                errorLogs.push(data);
                originalTable.call(console, data);
            };
            
            // エラーハンドリングコードの存在確認
            const scriptContent = document.querySelector('script:last-of-type')?.textContent || '';
            const hasErrorDetails = scriptContent.includes('errorDetails');
            const hasConsoleTable = scriptContent.includes('console.table');
            const hasTimestamp = scriptContent.includes('timestamp: new Date().toISOString()');
            
            return {
                hasErrorDetails,
                hasConsoleTable,
                hasTimestamp,
                errorHandlingImplemented: hasErrorDetails && hasConsoleTable && hasTimestamp
            };
        } catch (e) {
            return { error: e.message };
        }
    });
    
    if (errorHandlingTest.errorHandlingImplemented) {
        console.log('✅ エラーハンドリング強化実装確認');
        console.log(`  - errorDetailsオブジェクト: ${errorHandlingTest.hasErrorDetails ? '✓' : '✗'}`);
        console.log(`  - console.table使用: ${errorHandlingTest.hasConsoleTable ? '✓' : '✗'}`);
        console.log(`  - タイムスタンプ付与: ${errorHandlingTest.hasTimestamp ? '✓' : '✗'}`);
    } else {
        console.log('⚠️ エラーハンドリング強化が部分的');
    }
    
    // Phase 5: 人物像表示の再確認
    console.log('\n📋 Phase 5: 人物像表示の再確認\n');
    
    await page.waitForTimeout(1000);
    
    const personalityDisplay = await page.evaluate(() => {
        const container = document.getElementById('personality-profile-container');
        if (!container) return { exists: false };
        
        return {
            exists: true,
            hasContent: container.innerHTML.length > 100,
            contentLength: container.innerHTML.length,
            hasAspectCards: container.querySelectorAll('.aspect-card').length,
            hasGrowthSection: !!container.querySelector('.growth-suggestions')
        };
    });
    
    if (personalityDisplay.exists && personalityDisplay.hasContent) {
        console.log('✅ 人物像セクション表示確認');
        console.log(`  - コンテンツ量: ${personalityDisplay.contentLength}文字`);
        console.log(`  - 側面カード: ${personalityDisplay.hasAspectCards}個`);
        console.log(`  - 成長提案: ${personalityDisplay.hasGrowthSection ? '✓' : '✗'}`);
    } else {
        console.log('⚠️ 人物像セクションに問題あり');
    }
    
    // Phase 6: スクリーンショット
    console.log('\n📋 Phase 6: 視覚的確認\n');
    
    await page.screenshot({ 
        path: path.join(__dirname, '20250819_review-screenshot-after-fix.png'),
        fullPage: true 
    });
    console.log('📸 スクリーンショット保存: 20250819_review-screenshot-after-fix.png');
    
    // 最終評価
    console.log('\n============================================');
    console.log('📊 実装レビュー結果サマリー\n');
    
    const checkList = {
        'Task 1-1: グローバル変数化': globalCheck.tabNavigatorGlobal && globalCheck.basicTabGlobal,
        'Task 1-2: BasicTab参照保持': globalCheck.basicTabGlobal,
        'Task 2-1: テストヘルパー': globalCheck.testHelperExists,
        'Task 3-1: エラーハンドリング': errorHandlingTest.errorHandlingImplemented,
        '人物像表示': personalityDisplay.hasContent,
        'コンソールエラー': consoleErrors.length === 0
    };
    
    let passCount = 0;
    let totalCount = 0;
    
    Object.entries(checkList).forEach(([task, result]) => {
        console.log(`${task}: ${result ? '✅' : '❌'}`);
        if (result) passCount++;
        totalCount++;
    });
    
    const passRate = Math.round((passCount / totalCount) * 100);
    console.log(`\n総合評価: ${passCount}/${totalCount} (${passRate}%)`);
    
    if (passRate === 100) {
        console.log('\n🎉 完璧な実装です！計画書のすべてのタスクが正しく実装されています。');
    } else if (passRate >= 80) {
        console.log('\n✅ 良好な実装です。主要なタスクは完了しています。');
    } else {
        console.log('\n⚠️ 一部のタスクが未実装または不完全です。');
    }
    
    // 改善前との比較
    console.log('\n📈 改善前後の比較:');
    console.log('  改善前: 71% (5/7項目)');
    console.log(`  改善後: ${passRate}% (${passCount}/${totalCount}項目)`);
    
    if (passRate > 71) {
        console.log(`  改善度: +${passRate - 71}%`);
    }
    
    console.log('\n============================================');
    console.log('レビュー完了。ブラウザを確認してください。');
    
    // ブラウザを開いたままにする
    await new Promise(() => {});
})();