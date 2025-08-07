const puppeteer = require('puppeteer');

async function testUltraFast() {
    console.log('🚀 ウルトラ高速テスト開始');
    console.time('Total Time');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 }
    });
    
    const page = await browser.newPage();
    
    // コンソールログを最小限に
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Checking completion') || 
            text.includes('All questions answered') ||
            text.includes('showAnalysis') ||
            text.includes('分析開始')) {
            console.log(`[Browser] ${text}`);
        }
    });
    
    try {
        // Step 1: 初期化
        console.log('\n📝 Step 1: 初期化');
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
        
        // Step 2: 設問画面が表示されたら即座に全回答を設定
        await page.waitForSelector('#questions-container', { visible: true });
        console.log('\n⚡ Step 2: ウルトラ高速回答設定');
        
        // JavaScriptで直接すべての処理を実行
        const result = await page.evaluate(() => {
            // 30問すべての回答を作成
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
            
            // questionFlowオブジェクトを取得
            const app = window.app || window.App;
            if (!app || !app.questionFlow) {
                return { success: false, error: 'QuestionFlow not found' };
            }
            
            const questionFlow = app.questionFlow;
            
            // answersが配列であることを確認してから更新
            if (!Array.isArray(questionFlow.answers)) {
                questionFlow.answers = [];
            }
            questionFlow.answers = answers; // answersを更新
            
            // 最後の設問に直接ジャンプ
            questionFlow.currentQuestionIndex = 29;
            
            // UIを更新
            questionFlow.updateVisibleRange();
            questionFlow.renderVisibleQuestions();
            questionFlow.updateNavigationButtons();
            
            // 進捗を100%に
            if (typeof questionFlow.onProgress === 'function') {
                questionFlow.onProgress(100);
            }
            
            return { 
                success: true, 
                currentIndex: questionFlow.currentQuestionIndex,
                totalQuestions: questionFlow.questions.length
            };
        });
        
        console.log('📊 設定結果:', result);
        
        if (!result.success) {
            throw new Error(result.error);
        }
        
        // UIが更新されるまで少し待つ
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Step 3: q30の状態を確認
        console.log('\n🎯 Step 3: q30の状態確認');
        
        // 現在の設問番号を確認
        const currentQ = await page.evaluate(() => {
            const activeQ = document.querySelector('.active-question');
            return activeQ ? activeQ.dataset.questionId : null;
        });
        console.log(`📌 現在の設問: ${currentQ}`);
        
        // q30に実際に回答（ボタンを有効にするため）
        const q30Answered = await page.evaluate(() => {
            const activeQuestion = document.querySelector('.active-question');
            if (!activeQuestion) return false;
            
            // Shadow DOMまたは通常のDOM
            const radios = activeQuestion.shadowRoot 
                ? activeQuestion.shadowRoot.querySelectorAll('input[type="radio"]')
                : activeQuestion.querySelectorAll('input[type="radio"]');
            
            if (radios.length > 0) {
                radios[0].click();
                return true;
            }
            return false;
        });
        
        console.log(`📝 q30回答: ${q30Answered ? '成功' : '失敗'}`);
        
        // ボタンの状態を確認
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const buttonInfo = await page.evaluate(() => {
            const btn = document.querySelector('#next-btn');
            return btn ? {
                text: btn.textContent,
                disabled: btn.disabled,
                hasAnalyzeClass: btn.classList.contains('analyze-button')
            } : null;
        });
        
        console.log('\n📊 ボタン状態:');
        console.log(`- テキスト: "${buttonInfo?.text}"`);
        console.log(`- analyze-button: ${buttonInfo?.hasAnalyzeClass}`);
        console.log(`- 状態: ${buttonInfo?.disabled ? '無効' : '有効'}`);
        
        // Step 4: 分析を開始
        console.log('\n🚀 Step 4: 分析開始処理');
        
        if (buttonInfo?.text?.includes('分析開始')) {
            // ボタンをクリック
            if (!buttonInfo.disabled) {
                await page.click('#next-btn');
                console.log('✅ 分析開始ボタンをクリック');
            } else {
                console.log('⚠️ ボタンが無効なので、checkCompletionを直接実行');
                
                // checkCompletionを直接呼ぶ
                await page.evaluate(() => {
                    const app = window.app || window.App;
                    if (app && app.questionFlow && typeof app.questionFlow.checkCompletion === 'function') {
                        app.questionFlow.checkCompletion();
                    }
                });
            }
        } else {
            // ボタンが「分析開始」でない場合も、checkCompletionを試す
            console.log('⚠️ ボタンが「分析開始」ではないので、checkCompletionを直接実行');
            
            await page.evaluate(() => {
                const app = window.app || window.App;
                if (app && app.questionFlow) {
                    app.questionFlow.checkCompletion();
                }
            });
        }
        
        // Step 5: 遷移を確認
        console.log('\n⏳ Step 5: 遷移確認');
        
        // 少し待つ
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // URLの変化を確認
        const newUrl = page.url();
        console.log(`📍 現在のURL: ${newUrl}`);
        
        if (newUrl.includes('results.html')) {
            console.log('🎉 results.htmlに遷移成功！');
            
            // ローディングが終わるまで待つ
            try {
                await page.waitForFunction(
                    () => {
                        const loading = document.querySelector('.loading-container');
                        return !loading || window.getComputedStyle(loading).display === 'none';
                    },
                    { timeout: 5000 }
                );
            } catch (e) {
                console.log('ローディング待機タイムアウト');
            }
            
            // results.htmlの内容を確認
            const results = await page.evaluate(() => {
                return {
                    hasVirtualPersona: !!document.querySelector('#virtual-persona-container'),
                    hasTripleOS: !!document.querySelector('.triple-os-results'),
                    engineOS: !!document.querySelector('.engine-os'),
                    interfaceOS: !!document.querySelector('.interface-os'),
                    safeModeOS: !!document.querySelector('.safemode-os')
                };
            });
            
            console.log('\n📊 Results.html内容:');
            console.log(`- 仮想人格: ${results.hasVirtualPersona ? '✅' : '❌'}`);
            console.log(`- Triple OS: ${results.hasTripleOS ? '✅' : '❌'}`);
            console.log(`- Engine OS: ${results.engineOS ? '✅' : '❌'}`);
            console.log(`- Interface OS: ${results.interfaceOS ? '✅' : '❌'}`);
            console.log(`- SafeMode OS: ${results.safeModeOS ? '✅' : '❌'}`);
            
            await page.screenshot({ path: 'ultra-fast-results.png', fullPage: true });
            console.log('\n📸 最終結果: ultra-fast-results.png');
        } else {
            console.log('⚠️ まだresults.htmlに遷移していません');
            
            // 現在の画面状態を確認
            const state = await page.evaluate(() => {
                return {
                    welcome: document.querySelector('#welcome-container')?.style.display !== 'none',
                    questions: document.querySelector('#questions-container')?.style.display !== 'none',
                    analysis: document.querySelector('#analysis-container')?.style.display !== 'none'
                };
            });
            console.log('現在の画面:', state);
            
            await page.screenshot({ path: 'ultra-fast-final.png' });
            console.log('📸 最終状態: ultra-fast-final.png');
        }
        
        console.timeEnd('Total Time');
        console.log('\n✅ ウルトラ高速テスト完了！');
        
    } catch (error) {
        console.error('\n❌ エラー:', error.message);
        await page.screenshot({ path: 'ultra-fast-error.png' });
    } finally {
        await new Promise(resolve => setTimeout(resolve, 5000));
        await browser.close();
        console.log('\n🔚 終了');
    }
}

// 実行
testUltraFast();