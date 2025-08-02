const puppeteer = require('puppeteer');

async function testDirectCompletion() {
    console.log('🚀 ダイレクト完了テスト開始');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 }
    });
    
    const page = await browser.newPage();
    
    // 重要なログのみ
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('🎯') || text.includes('✅') || text.includes('❌') || 
            text.includes('All questions answered') || text.includes('starting analysis')) {
            console.log(`[Browser] ${text}`);
        }
    });
    
    try {
        // Step 1: OS Analyzerを開いて初期化
        console.log('\n📝 Step 1: 初期化とセットアップ');
        await page.goto('http://localhost:3000/os_analyzer.html');
        
        // LocalStorageをクリア
        await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
        
        await page.reload({ waitUntil: 'networkidle2' });
        
        // 分析開始
        await page.waitForSelector('#start-analysis-btn', { visible: true });
        await page.click('#start-analysis-btn');
        console.log('✅ 分析開始');
        
        // Step 2: すべての設問に回答を設定
        console.log('\n⚡ Step 2: 全30問の回答を直接設定');
        await page.waitForSelector('#questions-container', { visible: true });
        
        const allAnswered = await page.evaluate(() => {
            const answers = [];
            
            // 30問すべての回答を生成
            for (let i = 1; i <= 30; i++) {
                answers.push({
                    questionId: `q${i}`,
                    selectedValue: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
                    timestamp: new Date().toISOString(),
                    responseTime: Math.floor(Math.random() * 5000) + 1000
                });
            }
            
            // LocalStorageに保存
            localStorage.setItem('haqei_answers', JSON.stringify(answers));
            
            // セッション情報も更新
            const session = JSON.parse(localStorage.getItem('haqei_session') || '{}');
            session.currentQuestionIndex = 29; // 最後の設問
            session.completedQuestions = 30;
            localStorage.setItem('haqei_session', JSON.stringify(session));
            
            console.log('✅ All 30 questions answered and saved');
            return true;
        });
        
        if (allAnswered) {
            console.log('✅ 全30問の回答を設定完了');
        }
        
        // Step 3: checkCompletionを直接呼び出す
        console.log('\n🚀 Step 3: 分析完了処理を直接実行');
        
        const completionTriggered = await page.evaluate(() => {
            const app = window.app || window.App;
            if (!app || !app.questionFlow) {
                console.error('QuestionFlow not found');
                return false;
            }
            
            const questionFlow = app.questionFlow;
            
            // checkCompletionメソッドが存在するか確認
            if (typeof questionFlow.checkCompletion === 'function') {
                console.log('🎯 Calling checkCompletion directly');
                questionFlow.checkCompletion();
                return true;
            } else {
                console.error('checkCompletion method not found');
                // onCompleteコールバックを直接呼ぶ
                if (typeof questionFlow.onComplete === 'function') {
                    console.log('🎯 Calling onComplete directly');
                    questionFlow.onComplete();
                    return true;
                }
            }
            
            return false;
        });
        
        if (completionTriggered) {
            console.log('✅ 完了処理をトリガーしました');
        } else {
            console.log('❌ 完了処理のトリガーに失敗');
            
            // 代替方法：app.jsのshowAnalysisを直接呼ぶ
            console.log('📝 代替方法：showAnalysisを直接呼び出し');
            await page.evaluate(() => {
                const app = window.app || window.App;
                if (app && typeof app.showAnalysis === 'function') {
                    console.log('🎯 Calling showAnalysis directly');
                    app.showAnalysis();
                }
            });
        }
        
        // Step 4: 遷移を待つ
        console.log('\n⏳ Step 4: 分析とresults.htmlへの遷移を待機');
        
        try {
            await Promise.race([
                // 分析画面の表示を待つ
                page.waitForSelector('#analysis-container', { visible: true, timeout: 10000 })
                    .then(() => 'analysis'),
                // results.htmlへの遷移を待つ
                page.waitForFunction(
                    () => window.location.pathname.includes('results.html'),
                    { timeout: 10000 }
                ).then(() => 'results'),
                // 10秒でタイムアウト
                new Promise(resolve => setTimeout(() => resolve('timeout'), 10000))
            ]).then(result => {
                console.log(`✅ 遷移結果: ${result}`);
            });
        } catch (e) {
            console.log('⚠️ 遷移待機中にエラー');
        }
        
        // 追加で待機
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Step 5: 最終確認
        console.log('\n📊 Step 5: 最終状態の確認');
        const finalUrl = page.url();
        const finalTitle = await page.title();
        
        console.log(`📍 最終URL: ${finalUrl}`);
        console.log(`📄 ページタイトル: ${finalTitle}`);
        
        if (finalUrl.includes('results.html')) {
            console.log('\n🎉 results.htmlに到達成功！');
            
            // ローディングが終わるまで待機
            await page.waitForFunction(
                () => {
                    const loading = document.querySelector('.loading-container');
                    return !loading || window.getComputedStyle(loading).display === 'none';
                },
                { timeout: 10000 }
            ).catch(() => console.log('ローディング待機タイムアウト'));
            
            // results.htmlの内容を詳細に確認
            const resultsDetail = await page.evaluate(() => {
                const data = {
                    containers: {},
                    tripleOS: {}
                };
                
                // コンテナの確認
                const containerIds = [
                    'virtual-persona-container',
                    'personality-construction-container',
                    'dialogue-section'
                ];
                
                containerIds.forEach(id => {
                    const el = document.getElementById(id);
                    data.containers[id] = {
                        exists: !!el,
                        visible: el ? window.getComputedStyle(el).display !== 'none' : false
                    };
                });
                
                // Triple OSの詳細
                const osTypes = ['engine', 'interface', 'safemode'];
                osTypes.forEach(type => {
                    const el = document.querySelector(`.${type}-os`);
                    if (el) {
                        data.tripleOS[type] = {
                            exists: true,
                            title: el.querySelector('h3')?.textContent,
                            hexagram: el.querySelector('.hexagram-name')?.textContent,
                            score: el.querySelector('.score-value')?.textContent
                        };
                    }
                });
                
                return data;
            });
            
            console.log('\n📊 Results.html詳細:');
            console.log('コンテナ:');
            for (const [id, info] of Object.entries(resultsDetail.containers)) {
                console.log(`- ${id}: ${info.exists ? (info.visible ? '✅ 表示中' : '⚠️ 非表示') : '❌ なし'}`);
            }
            
            console.log('\nTriple OS:');
            for (const [type, info] of Object.entries(resultsDetail.tripleOS)) {
                if (info) {
                    console.log(`- ${type}: ${info.title || 'タイトルなし'} / ${info.hexagram || '卦なし'} / ${info.score || 'スコアなし'}`);
                }
            }
            
            // スクリーンショット
            await page.screenshot({ path: 'results-direct-test.png', fullPage: true });
            console.log('\n📸 Results.html: results-direct-test.png');
            
        } else if (finalUrl.includes('os_analyzer.html')) {
            // まだos_analyzer.htmlにいる場合、どの画面が表示されているか確認
            const currentScreen = await page.evaluate(() => {
                return {
                    welcome: document.querySelector('#welcome-container')?.style.display !== 'none',
                    questions: document.querySelector('#questions-container')?.style.display !== 'none',
                    analysis: document.querySelector('#analysis-container')?.style.display !== 'none'
                };
            });
            
            console.log('\n⚠️ まだos_analyzer.htmlにいます');
            console.log('現在の画面:', currentScreen);
            
            await page.screenshot({ path: 'stuck-on-analyzer.png' });
            console.log('📸 現在の状態: stuck-on-analyzer.png');
        }
        
        console.log('\n✅ ダイレクト完了テスト終了');
        
    } catch (error) {
        console.error('\n❌ エラー発生:', error.message);
        await page.screenshot({ path: 'direct-test-error.png' });
        console.log('📸 エラー画面: direct-test-error.png');
    } finally {
        await new Promise(resolve => setTimeout(resolve, 5000));
        await browser.close();
        console.log('\n🔚 ブラウザを閉じました');
    }
}

// テスト実行
testDirectCompletion();