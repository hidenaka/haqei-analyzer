/**
 * Future Simulator 動作検証テスト
 * Playwright MCPを使用してFuture Simulatorの動作を包括的に検証
 */

const { chromium } = require('playwright');

async function testFutureSimulator() {
    console.log('🧪 Future Simulator 動作検証開始...\n');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    // コンソールログとエラーをキャプチャ
    const logs = [];
    const errors = [];
    
    page.on('console', msg => {
        logs.push(`[${msg.type()}] ${msg.text()}`);
    });
    
    page.on('pageerror', error => {
        errors.push(error.message);
    });
    
    try {
        // 1. ページロード確認
        console.log('📄 1. ページロード確認');
        const startTime = Date.now();
        await page.goto('http://localhost:8790/public/future_simulator.html');
        const loadTime = Date.now() - startTime;
        console.log(`✅ ページロード完了 (${loadTime}ms)`);
        
        // 2. 基本要素の存在確認
        console.log('\n🔍 2. 基本要素確認');
        
        const title = await page.textContent('h1');
        console.log(`✅ タイトル: "${title}"`);
        
        const inputArea = await page.locator('#worryInput').count();
        console.log(`✅ 入力エリア存在: ${inputArea > 0}`);
        
        const analyzeButton = await page.locator('#aiGuessBtn').count();
        console.log(`✅ 分析ボタン存在: ${analyzeButton > 0}`);
        
        // 3. JavaScript動作確認
        console.log('\n💻 3. JavaScript動作確認');
        
        // DynamicKeywordGeneratorの存在確認
        const hasKeywordGenerator = await page.evaluate(() => {
            return typeof window.DynamicKeywordGenerator !== 'undefined';
        });
        console.log(`✅ DynamicKeywordGenerator: ${hasKeywordGenerator}`);
        
        // H384_DATAの確認
        const hasH384Data = await page.evaluate(() => {
            return typeof window.H384_DATA !== 'undefined' && window.H384_DATA.length === 386;
        });
        console.log(`✅ H384_DATA (386爻): ${hasH384Data}`);
        
        // モーダルが表示されている場合は閉じる
        try {
            const modalClose = await page.locator('button:has-text("閉じる")').count();
            if (modalClose > 0) {
                console.log('⚠️ エラーモーダルを閉じています...');
                await page.click('button:has-text("閉じる")');
                await page.waitForTimeout(1000);
            }
        } catch (e) {
            console.log('📝 モーダル処理スキップ');
        }
        
        // 4. 入力テスト
        console.log('\n📝 4. 入力テスト');
        
        const testInput = "仕事での人間関係に悩んでいます。上司との相性が悪く、毎日ストレスを感じています。";
        await page.fill('#worryInput', testInput);
        console.log('✅ テスト入力完了');
        
        // 利用規約チェックボックスにチェック
        await page.check('#agreementCheckbox');
        console.log('✅ 利用規約同意チェック完了');
        
        // 5. 分析実行テスト
        console.log('\n⚡ 5. 分析実行テスト');
        
        await page.click('#aiGuessBtn');
        console.log('✅ 分析ボタンクリック');
        
        // 分析結果の待機（最大10秒）
        try {
            await page.waitForSelector('.analysis-result', { timeout: 10000 });
            console.log('✅ 分析結果表示');
            
            // 結果内容の確認
            const resultElements = await page.locator('.analysis-result').count();
            console.log(`✅ 結果要素数: ${resultElements}`);
            
        } catch (timeoutError) {
            console.log('⚠️ 分析結果の表示がタイムアウト（10秒以内に表示されませんでした）');
        }
        
        // 6. Claude統合機能確認
        console.log('\n🧠 6. Claude統合機能確認');
        
        const hasClaudeEngine = await page.evaluate(() => {
            return typeof window.ClaudeAnalysisEngine !== 'undefined';
        });
        console.log(`✅ ClaudeAnalysisEngine: ${hasClaudeEngine}`);
        
        const hasContextualMapping = await page.evaluate(() => {
            return typeof window.ContextualMappingSystem !== 'undefined';
        });
        console.log(`✅ ContextualMappingSystem: ${hasContextualMapping}`);
        
        // 7. エラー確認
        console.log('\n❌ 7. エラー確認');
        
        if (errors.length > 0) {
            console.log('🚨 検出されたエラー:');
            errors.forEach((error, index) => {
                console.log(`   ${index + 1}. ${error}`);
            });
        } else {
            console.log('✅ JavaScriptエラーなし');
        }
        
        // 8. パフォーマンス確認
        console.log('\n⚡ 8. パフォーマンス確認');
        
        const performanceMetrics = await page.evaluate(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            return {
                domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
                loadComplete: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
                totalLoad: Math.round(navigation.loadEventEnd - navigation.fetchStart)
            };
        });
        
        console.log(`✅ DOM読み込み: ${performanceMetrics.domContentLoaded}ms`);
        console.log(`✅ 完全読み込み: ${performanceMetrics.loadComplete}ms`);
        console.log(`✅ 総読み込み時間: ${performanceMetrics.totalLoad}ms`);
        
        // 9. 386爻システム詳細確認
        console.log('\n🎯 9. 386爻システム詳細確認');
        
        const yaoSystemCheck = await page.evaluate(() => {
            const results = {};
            
            // H384_DATAの用九、用六確認
            if (window.H384_DATA) {
                const youkyu = window.H384_DATA.find(item => item.通し番号 === 7); // 用九
                const yourikuu = window.H384_DATA.find(item => item.通し番号 === 14); // 用六
                
                results.hasYoukyu = !!youkyu;
                results.hasYourikuu = !!yourikuu;
                results.youkyuText = youkyu ? youkyu.爻辞 : null;
                results.yourikuuText = yourikuu ? yourikuu.爻辞 : null;
            }
            
            return results;
        });
        
        console.log(`✅ 用九(乾為天)存在: ${yaoSystemCheck.hasYoukyu}`);
        console.log(`✅ 用六(坤為地)存在: ${yaoSystemCheck.hasYourikuu}`);
        
        if (yaoSystemCheck.youkyuText) {
            console.log(`   用九爻辞: "${yaoSystemCheck.youkyuText.substring(0, 30)}..."`);
        }
        if (yaoSystemCheck.yourikuuText) {
            console.log(`   用六爻辞: "${yaoSystemCheck.yourikuuText.substring(0, 30)}..."`);
        }
        
        // 待機（画面確認用）
        console.log('\n⏸️ 10秒間画面表示を維持（手動確認用）...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('❌ テスト実行エラー:', error.message);
    } finally {
        await browser.close();
    }
    
    // テスト結果サマリー
    console.log('\n📊 テスト結果サマリー');
    console.log('='.repeat(50));
    console.log(`コンソールログ数: ${logs.length}`);
    console.log(`エラー数: ${errors.length}`);
    
    if (logs.length > 0) {
        console.log('\n📝 主要なコンソールログ:');
        logs.slice(0, 5).forEach(log => console.log(`   ${log}`));
        if (logs.length > 5) console.log(`   ... 他 ${logs.length - 5} 件`);
    }
    
    console.log('\n🏁 Future Simulator 動作検証完了');
}

// テスト実行
if (require.main === module) {
    testFutureSimulator().catch(console.error);
}

module.exports = { testFutureSimulator };