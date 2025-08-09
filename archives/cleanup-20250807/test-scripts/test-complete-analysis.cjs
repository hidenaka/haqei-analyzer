const puppeteer = require('puppeteer');

async function testCompleteAnalysis() {
    console.log('🚀 完全分析フローテスト開始');
    console.time('Total Time');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 }
    });
    
    const page = await browser.newPage();
    
    // 重要なログを表示
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Analysis process starting') || 
            text.includes('All questions completed') ||
            text.includes('Animation and Analysis complete') ||
            text.includes('Results saved') ||
            text.includes('Error')) {
            console.log(`[Browser] ${text}`);
        }
    });
    
    try {
        // Step 1: 初期化
        console.log('\n📝 Step 1: 初期化とセットアップ');
        await page.goto('http://localhost:3000/os_analyzer.html');
        
        await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
        
        await page.reload({ waitUntil: 'networkidle2' });
        
        // 分析開始
        await page.waitForSelector('#start-analysis-btn', { visible: true });
        await page.click('#start-analysis-btn');
        console.log('✅ 分析開始');
        
        // Step 2: 設問画面でデータセットアップ
        await page.waitForSelector('#questions-container', { visible: true });
        console.log('\n⚡ Step 2: 完全な分析フローをセットアップ');
        
        // すべての回答を設定してproceedToAnalysisを呼ぶ
        const analysisStarted = await page.evaluate(() => {
            // 30問の回答を作成
            const answers = [];
            for (let i = 1; i <= 30; i++) {
                answers.push({
                    questionId: `q${i}`,
                    selectedValue: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
                    timestamp: new Date().toISOString()
                });
            }
            
            // LocalStorageに保存
            localStorage.setItem('haqei_answers', JSON.stringify(answers));
            
            // セッション情報を更新
            const session = JSON.parse(localStorage.getItem('haqei_session') || '{}');
            session.currentQuestionIndex = 29;
            session.stage = 'analysis';
            localStorage.setItem('haqei_session', JSON.stringify(session));
            
            // proceedToAnalysisを直接呼ぶ
            if (typeof proceedToAnalysis === 'function') {
                console.log('🎯 Calling proceedToAnalysis directly');
                proceedToAnalysis(answers);
                return true;
            } else if (window.proceedToAnalysis) {
                console.log('🎯 Calling window.proceedToAnalysis');
                window.proceedToAnalysis(answers);
                return true;
            } else {
                console.error('proceedToAnalysis not found');
                
                // 代替方法：onCompleteを実行
                const app = window.app || window.App;
                if (app && app.questionFlow) {
                    console.log('🎯 Triggering onComplete through questionFlow');
                    
                    // answersを設定
                    app.questionFlow.answers = answers;
                    
                    // onCompleteがある場合は実行
                    if (app.questionFlow.onComplete) {
                        app.questionFlow.onComplete(answers);
                        return true;
                    }
                }
                
                return false;
            }
        });
        
        if (analysisStarted) {
            console.log('✅ 分析処理を開始しました');
        } else {
            console.log('⚠️ 分析処理の開始に失敗しました');
        }
        
        // Step 3: 分析画面の表示を待つ
        console.log('\n⏳ Step 3: 分析処理を待機');
        
        try {
            // 分析画面が表示されるのを待つ
            await page.waitForSelector('#analysis-container', { 
                visible: true, 
                timeout: 10000 
            });
            console.log('✅ 分析画面が表示されました');
            
            // 分析アニメーションが完了するまで待つ（最大20秒）
            await page.waitForFunction(
                () => {
                    // AnalysisViewのonCompleteが呼ばれたかチェック
                    const messages = Array.from(document.querySelectorAll('.analysis-message')).map(el => el.textContent);
                    return messages.some(msg => msg.includes('完了')) || 
                           window.location.pathname.includes('results.html');
                },
                { timeout: 20000 }
            ).catch(() => console.log('分析完了待機タイムアウト'));
            
        } catch (e) {
            console.log('⚠️ 分析画面の表示待機でタイムアウト');
        }
        
        // Step 4: results.htmlへの遷移を確認
        console.log('\n📊 Step 4: 結果の確認');
        
        // 少し待ってからURLを確認
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const currentUrl = page.url();
        console.log(`📍 現在のURL: ${currentUrl}`);
        
        if (currentUrl.includes('results.html')) {
            console.log('🎉 results.htmlに到達！');
            
            // ローディングが終わるまで待つ
            await page.waitForFunction(
                () => {
                    const loading = document.querySelector('.loading-container');
                    return !loading || window.getComputedStyle(loading).display === 'none';
                },
                { timeout: 10000 }
            ).catch(() => console.log('ローディング待機タイムアウト'));
            
            // エラーメッセージの確認
            const hasError = await page.evaluate(() => {
                const errorEl = document.querySelector('.error-message');
                return errorEl && window.getComputedStyle(errorEl).display !== 'none';
            });
            
            if (hasError) {
                const errorText = await page.evaluate(() => {
                    return document.querySelector('.error-message')?.textContent;
                });
                console.log(`❌ エラー: ${errorText}`);
            } else {
                // Triple OSの結果を確認
                const results = await page.evaluate(() => {
                    return {
                        hasVirtualPersona: !!document.querySelector('#virtual-persona-container'),
                        hasTripleOS: !!document.querySelector('.triple-os-results'),
                        engineOS: !!document.querySelector('.engine-os'),
                        interfaceOS: !!document.querySelector('.interface-os'),
                        safeModeOS: !!document.querySelector('.safemode-os'),
                        // LocalStorageのデータも確認
                        storageData: {
                            analysisResult: localStorage.getItem('haqei_analysis_result') !== null,
                            diagnosisResult: localStorage.getItem('haqei_diagnosis_result') !== null,
                            insights: localStorage.getItem('haqei_insights') !== null
                        }
                    };
                });
                
                console.log('\n📊 Results.html状態:');
                console.log(`- 仮想人格: ${results.hasVirtualPersona ? '✅' : '❌'}`);
                console.log(`- Triple OS: ${results.hasTripleOS ? '✅' : '❌'}`);
                console.log(`- Engine OS: ${results.engineOS ? '✅' : '❌'}`);
                console.log(`- Interface OS: ${results.interfaceOS ? '✅' : '❌'}`);
                console.log(`- SafeMode OS: ${results.safeModeOS ? '✅' : '❌'}`);
                console.log('\n💾 LocalStorage:');
                console.log(`- 分析結果: ${results.storageData.analysisResult ? '✅' : '❌'}`);
                console.log(`- 診断結果: ${results.storageData.diagnosisResult ? '✅' : '❌'}`);
                console.log(`- インサイト: ${results.storageData.insights ? '✅' : '❌'}`);
            }
            
            await page.screenshot({ 
                path: 'complete-analysis-results.png', 
                fullPage: true 
            });
            console.log('\n📸 最終結果: complete-analysis-results.png');
            
        } else {
            console.log('⚠️ results.htmlに到達していません');
            
            // 現在の画面状態を確認
            const state = await page.evaluate(() => {
                return {
                    welcome: document.querySelector('#welcome-container')?.style.display !== 'none',
                    questions: document.querySelector('#questions-container')?.style.display !== 'none',
                    analysis: document.querySelector('#analysis-container')?.style.display !== 'none'
                };
            });
            
            console.log('現在の画面:', state);
            
            await page.screenshot({ path: 'complete-analysis-state.png' });
            console.log('📸 現在の状態: complete-analysis-state.png');
        }
        
        console.timeEnd('Total Time');
        console.log('\n✅ 完全分析フローテスト完了！');
        
    } catch (error) {
        console.error('\n❌ エラー:', error.message);
        await page.screenshot({ path: 'complete-analysis-error.png' });
    } finally {
        await new Promise(resolve => setTimeout(resolve, 10000));
        await browser.close();
        console.log('\n🔚 テスト終了');
    }
}

// 実行
testCompleteAnalysis();