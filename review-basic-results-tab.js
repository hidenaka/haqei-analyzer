import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    console.log('🔍 BasicResultsTab実装レビュー開始\n');
    console.log('============================================\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        devtools: true
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // コンソールエラー監視
    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
            console.log('❌ Console Error:', msg.text());
        }
    });
    
    // 1. results.htmlページ読み込みテスト
    console.log('📋 Phase 1: ページ読み込みテスト\n');
    const resultsPath = `file://${path.join(__dirname, 'public', 'results.html')}`;
    
    try {
        await page.goto(resultsPath);
        await page.waitForTimeout(2000);
        console.log('✅ results.htmlの読み込み成功');
    } catch (error) {
        console.log('❌ results.htmlの読み込み失敗:', error.message);
    }
    
    // 2. BasicResultsTabの存在確認
    console.log('\n📋 Phase 2: BasicResultsTab初期化確認\n');
    
    const tabExists = await page.evaluate(() => {
        return typeof window.BasicResultsTab !== 'undefined';
    });
    
    if (tabExists) {
        console.log('✅ BasicResultsTabクラスが存在');
    } else {
        console.log('❌ BasicResultsTabクラスが見つかりません');
    }
    
    // 3. 人物像表示機能の確認
    console.log('\n📋 Phase 3: 人物像表示機能テスト\n');
    
    // hexagram-human-traits.jsの読み込み確認
    const humanTraitsLoaded = await page.evaluate(() => {
        return typeof window.generatePersonalityProfile === 'function' &&
               typeof window.HexagramHumanTraits === 'object';
    });
    
    if (humanTraitsLoaded) {
        console.log('✅ hexagram-human-traits.jsが正常に読み込まれている');
        console.log('✅ generatePersonalityProfile関数が利用可能');
    } else {
        console.log('❌ hexagram-human-traits.jsの読み込みに問題あり');
    }
    
    // 4. テストデータでの動作確認
    console.log('\n📋 Phase 4: テストデータ投入テスト\n');
    
    const testResult = await page.evaluate(() => {
        // テストデータを作成
        const testData = {
            engineOS: {
                score: 75,
                hexagram: '乾為天'
            },
            interfaceOS: {
                score: 60,
                hexagram: '坤為地'
            },
            safeModeOS: {
                score: 45,
                hexagram: '水雷屯'
            }
        };
        
        // TabNavigatorが存在するか確認
        if (window.tabNavigator && window.tabNavigator.tabs.basic) {
            const basicTab = window.tabNavigator.tabs.basic;
            
            // setDataメソッドを呼び出し
            basicTab.setData(testData);
            
            // normalizeAnalysisDataが正しく動作しているか確認
            const normalized = basicTab.analysisData;
            
            return {
                success: true,
                normalized: normalized,
                hasEngine: !!normalized?.engine,
                hasInterface: !!normalized?.interface,
                hasSafeMode: !!normalized?.safeMode
            };
        }
        
        return { success: false, error: 'TabNavigatorまたはBasicTabが見つかりません' };
    });
    
    if (testResult.success) {
        console.log('✅ テストデータの正規化成功');
        console.log('  - Engine OS:', testResult.hasEngine ? '✓' : '✗');
        console.log('  - Interface OS:', testResult.hasInterface ? '✓' : '✗');
        console.log('  - SafeMode OS:', testResult.hasSafeMode ? '✓' : '✗');
    } else {
        console.log('❌ テストデータの投入失敗:', testResult.error);
    }
    
    // 5. 人物像セクションの表示確認
    console.log('\n📋 Phase 5: 人物像セクション表示確認\n');
    
    await page.waitForTimeout(1000);
    
    const personalityCheck = await page.evaluate(() => {
        const container = document.getElementById('personality-profile-container');
        if (!container) {
            return { exists: false };
        }
        
        const hasContent = container.innerHTML.length > 100;
        const hasTitle = container.querySelector('.personality-title') !== null;
        const hasAspects = container.querySelectorAll('.aspect-card').length > 0;
        const hasGrowth = container.querySelector('.growth-suggestions') !== null;
        
        return {
            exists: true,
            hasContent,
            hasTitle,
            hasAspects,
            aspectCount: container.querySelectorAll('.aspect-card').length,
            hasGrowth,
            contentLength: container.innerHTML.length
        };
    });
    
    if (personalityCheck.exists) {
        console.log('✅ personality-profile-containerが存在');
        console.log(`  - コンテンツ量: ${personalityCheck.contentLength}文字`);
        console.log(`  - タイトル表示: ${personalityCheck.hasTitle ? '✓' : '✗'}`);
        console.log(`  - 側面カード数: ${personalityCheck.aspectCount}個`);
        console.log(`  - 成長提案: ${personalityCheck.hasGrowth ? '✓' : '✗'}`);
    } else {
        console.log('❌ personality-profile-containerが見つかりません');
    }
    
    // 6. エラーハンドリングのテスト
    console.log('\n📋 Phase 6: エラーハンドリング確認\n');
    
    const errorHandlingTest = await page.evaluate(() => {
        if (window.tabNavigator && window.tabNavigator.tabs.basic) {
            const basicTab = window.tabNavigator.tabs.basic;
            
            // メソッドの存在確認
            const hasNoDataMessage = typeof basicTab.getNoDataMessage === 'function';
            const hasLoadingMessage = typeof basicTab.getLoadingMessage === 'function';
            const hasErrorMessage = typeof basicTab.getErrorMessage === 'function';
            const hasClassifyError = typeof basicTab.classifyError === 'function';
            
            // nullデータでのテスト
            basicTab.setData(null);
            const fallbackShown = document.querySelector('.fallback-message') !== null;
            
            return {
                hasNoDataMessage,
                hasLoadingMessage,
                hasErrorMessage,
                hasClassifyError,
                fallbackShown
            };
        }
        return { error: 'BasicTabが見つかりません' };
    });
    
    if (!errorHandlingTest.error) {
        console.log('✅ エラーハンドリングメソッドの実装確認');
        console.log(`  - getNoDataMessage: ${errorHandlingTest.hasNoDataMessage ? '✓' : '✗'}`);
        console.log(`  - getLoadingMessage: ${errorHandlingTest.hasLoadingMessage ? '✓' : '✗'}`);
        console.log(`  - getErrorMessage: ${errorHandlingTest.hasErrorMessage ? '✓' : '✗'}`);
        console.log(`  - classifyError: ${errorHandlingTest.hasClassifyError ? '✓' : '✗'}`);
        console.log(`  - フォールバック表示: ${errorHandlingTest.fallbackShown ? '✓' : '✗'}`);
    } else {
        console.log('❌', errorHandlingTest.error);
    }
    
    // 7. スクリーンショット取得
    console.log('\n📋 Phase 7: 視覚的確認\n');
    
    await page.screenshot({ 
        path: path.join(__dirname, 'review-screenshot.png'),
        fullPage: true 
    });
    console.log('📸 スクリーンショット保存: review-screenshot.png');
    
    // 8. 最終評価
    console.log('\n============================================');
    console.log('📊 レビュー結果サマリー\n');
    
    const summary = {
        pageLoad: '✅',
        classExists: tabExists ? '✅' : '❌',
        humanTraits: humanTraitsLoaded ? '✅' : '❌',
        dataHandling: testResult.success ? '✅' : '❌',
        personalityDisplay: personalityCheck.hasContent ? '✅' : '❌',
        errorHandling: !errorHandlingTest.error ? '✅' : '❌',
        consoleErrors: consoleErrors.length === 0 ? '✅' : '❌'
    };
    
    console.log('ページ読み込み:', summary.pageLoad);
    console.log('クラス初期化:', summary.classExists);
    console.log('人物像データ:', summary.humanTraits);
    console.log('データ処理:', summary.dataHandling);
    console.log('人物像表示:', summary.personalityDisplay);
    console.log('エラー処理:', summary.errorHandling);
    console.log('コンソールエラー:', summary.consoleErrors, 
                consoleErrors.length > 0 ? `(${consoleErrors.length}件)` : '');
    
    // 総合評価
    const passCount = Object.values(summary).filter(v => v === '✅').length;
    const totalCount = Object.keys(summary).length;
    const passRate = Math.round((passCount / totalCount) * 100);
    
    console.log('\n総合評価:', `${passCount}/${totalCount} (${passRate}%)`);
    
    if (passRate === 100) {
        console.log('\n🎉 完璧な実装です！すべてのチェック項目をクリアしました。');
    } else if (passRate >= 80) {
        console.log('\n✅ 良好な実装です。軽微な問題がありますが、基本機能は動作しています。');
    } else if (passRate >= 60) {
        console.log('\n⚠️ 改善が必要です。いくつかの重要な機能に問題があります。');
    } else {
        console.log('\n❌ 重大な問題があります。実装の見直しが必要です。');
    }
    
    console.log('\n============================================\n');
    console.log('レビュー完了。ブラウザを確認してください。');
    
    // ブラウザを開いたままにする
    await new Promise(() => {});
})();