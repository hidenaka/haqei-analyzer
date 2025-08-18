import { chromium } from 'playwright';

/**
 * 🔍 イベントバインディング問題のデバッグ
 */

async function debugEventBinding() {
    console.log('🔍 イベントバインディング問題のデバッグ開始\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1500  // 非常にゆっくり
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // すべてのコンソールメッセージを表示
        page.on('console', msg => {
            console.log(`[CONSOLE ${msg.type()}] ${msg.text()}`);
        });
        
        // エラーを表示
        page.on('pageerror', err => {
            console.error('[PAGE ERROR]', err.message);
        });
        
        // 1. ページロード
        console.log('📡 ページロード...');
        await page.goto('http://localhost:8788/os_analyzer.html');
        await page.waitForTimeout(2000);
        
        // 2. ページ初期化後の状態確認
        console.log('\n📋 ページ初期化後の状態:');
        const initState = await page.evaluate(() => {
            const results = {
                criticalCSSAnalyzer: !!window.criticalCSSAnalyzer,
                currentAnalyzer: !!window.currentAnalyzer,
                showQuestionFn: null,
                selectOptionFn: null
            };
            
            if (window.criticalCSSAnalyzer) {
                results.showQuestionFn = typeof window.criticalCSSAnalyzer.showQuestion;
                results.selectOptionFn = typeof window.criticalCSSAnalyzer.selectOption;
            }
            
            return results;
        });
        
        console.log('初期状態:', JSON.stringify(initState, null, 2));
        
        // 3. 分析開始
        console.log('\n🖱️ 分析開始ボタンクリック...');
        await page.locator('#start-btn').click();
        await page.waitForTimeout(1000);
        
        // 4. 質問画面が表示されているか確認
        const questionVisible = await page.locator('#question-screen').isVisible();
        console.log(`質問画面表示: ${questionVisible ? '✅' : '❌'}`);
        
        // 5. 選択肢のイベントリスナーを確認
        console.log('\n📋 選択肢のイベントリスナー確認:');
        const optionInfo = await page.evaluate(() => {
            const options = document.querySelectorAll('.option');
            const results = {
                optionCount: options.length,
                listeners: []
            };
            
            options.forEach((opt, idx) => {
                // イベントリスナーの存在を確認（Chrome DevTools Protocol経由でないと正確には取得できない）
                // ここでは手動でクリックをシミュレート
                const hasListener = opt.onclick !== null || opt.addEventListener !== undefined;
                results.listeners.push({
                    index: idx,
                    hasOnclick: !!opt.onclick,
                    text: opt.textContent.trim().substring(0, 30)
                });
            });
            
            return results;
        });
        
        console.log('選択肢情報:', JSON.stringify(optionInfo, null, 2));
        
        // 6. 選択肢を手動でクリック（デバッグログ付き）
        console.log('\n🖱️ 最初の選択肢をクリック...');
        
        // クリック前にイベントリスナーを注入
        await page.evaluate(() => {
            console.log('デバッグ: クリック前の状態確認');
            const firstOption = document.querySelector('.option');
            if (firstOption) {
                // 元のクリックイベントを保存
                const originalOnclick = firstOption.onclick;
                
                // デバッグ用のラッパーを追加
                firstOption.addEventListener('click', function(e) {
                    console.log('デバッグ: クリックイベント発火！', {
                        target: e.target,
                        criticalCSSAnalyzer: !!window.criticalCSSAnalyzer,
                        currentQuestion: window.criticalCSSAnalyzer?.state?.currentQuestion
                    });
                }, true); // キャプチャフェーズで実行
                
                console.log('デバッグ用リスナー追加完了');
            }
        });
        
        // 実際にクリック
        await page.locator('.option').first().click();
        await page.waitForTimeout(1000);
        
        // 7. クリック後の状態確認
        console.log('\n📋 クリック後の状態:');
        const afterClickState = await page.evaluate(() => {
            const analyzer = window.criticalCSSAnalyzer;
            if (!analyzer) return { error: 'No analyzer' };
            
            return {
                currentQuestion: analyzer.state?.currentQuestion,
                answersLength: analyzer.state?.answers?.length || 0,
                firstAnswer: analyzer.state?.answers?.[0],
                selectedClass: document.querySelector('.option.selected') ? 'found' : 'not found'
            };
        });
        
        console.log('クリック後の状態:', JSON.stringify(afterClickState, null, 2));
        
        // 8. selectOptionを直接呼び出してみる
        console.log('\n🔧 selectOptionを直接呼び出し...');
        const directCallResult = await page.evaluate(() => {
            const analyzer = window.criticalCSSAnalyzer;
            if (!analyzer) return { error: 'No analyzer' };
            
            try {
                const secondOption = document.querySelectorAll('.option')[1];
                const optionData = {
                    value: 'B',
                    text: 'Direct call test'
                };
                
                console.log('直接呼び出し前:', {
                    hasSelectOption: typeof analyzer.selectOption === 'function',
                    currentQuestion: analyzer.state?.currentQuestion
                });
                
                if (typeof analyzer.selectOption === 'function') {
                    analyzer.selectOption(secondOption, optionData);
                    return {
                        success: true,
                        answersAfter: analyzer.state?.answers?.length || 0,
                        secondAnswer: analyzer.state?.answers?.[0]
                    };
                } else {
                    return { error: 'selectOption is not a function' };
                }
            } catch (e) {
                return { error: e.message };
            }
        });
        
        console.log('直接呼び出し結果:', JSON.stringify(directCallResult, null, 2));
        
        // スクリーンショット
        await page.screenshot({ 
            path: 'event_binding_debug_20250816.png',
            fullPage: false 
        });
        
        return {
            initState,
            optionInfo,
            afterClickState,
            directCallResult
        };
        
    } catch (error) {
        console.error('❌ デバッグエラー:', error);
        return { error: error.message };
    } finally {
        console.log('\n⚠️ ブラウザは開いたままです。手動で確認してください。');
    }
}

// 実行
debugEventBinding()
    .then(result => {
        console.log('\n' + '='.repeat(50));
        console.log('📋 デバッグ完了');
        
        if (!result.error) {
            console.log('\n発見された問題:');
            
            if (!result.initState?.criticalCSSAnalyzer) {
                console.log('❌ criticalCSSAnalyzerが初期化されていない');
            }
            
            if (result.afterClickState?.answersLength === 0) {
                console.log('❌ クリック後も回答が保存されていない');
            }
            
            if (result.directCallResult?.success) {
                console.log('✅ selectOptionの直接呼び出しは成功');
                console.log('   → イベントバインディングの問題の可能性');
            }
        }
        
        console.log('='.repeat(50));
    })
    .catch(error => {
        console.error('❌ 致命的エラー:', error);
    });