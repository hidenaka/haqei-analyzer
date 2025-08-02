const puppeteer = require('puppeteer');

async function testOptimizedFlow() {
    console.log('🚀 最適化版 OS Analyzer → Results.html テスト開始');
    console.time('Total Test Time');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 },
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // 簡潔なログのみ
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('🎯') || text.includes('✅') || text.includes('❌')) {
            console.log(`[Browser] ${text}`);
        }
    });
    
    try {
        // Step 1: 事前にlocalStorageをクリア
        console.log('\n📝 Step 1: 初期化');
        await page.goto('http://localhost:3000/os_analyzer.html');
        await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
        
        // ページをリロード
        await page.reload({ waitUntil: 'networkidle2' });
        
        // Welcome画面で開始
        await page.waitForSelector('#start-analysis-btn', { 
            visible: true,
            timeout: 5000 
        });
        await page.click('#start-analysis-btn');
        console.log('✅ 分析開始');
        
        // Step 2: 高速回答（JavaScriptで直接操作）
        console.log('\n⚡ Step 2: 高速回答モード');
        console.time('All Questions');
        
        // 設問画面が表示されるまで待機
        await page.waitForSelector('#questions-container', { 
            visible: true,
            timeout: 5000 
        });
        
        // すべての設問に一括で回答する関数を注入
        await page.evaluate(() => {
            window.rapidAnswer = async function() {
                console.log('🚀 Rapid answer mode activated');
                
                // 現在のquestionFlowオブジェクトを取得
                const app = window.app || window.App;
                if (!app || !app.questionFlow) {
                    console.error('QuestionFlow not found');
                    return false;
                }
                
                const questionFlow = app.questionFlow;
                const answers = [];
                
                // 30問すべてに対してランダムな回答を生成
                for (let i = 1; i <= 30; i++) {
                    const answer = {
                        questionId: `q${i}`,
                        selectedValue: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
                        timestamp: new Date().toISOString()
                    };
                    answers.push(answer);
                    
                    // LocalStorageに直接保存
                    localStorage.setItem('haqei_answers', JSON.stringify(answers));
                }
                
                // 最後の設問（29番目のインデックス）に移動
                questionFlow.currentQuestionIndex = 29;
                questionFlow.updateVisibleRange();
                questionFlow.renderVisibleQuestions();
                questionFlow.updateNavigationButtons();
                
                // updateProgressBarメソッドが存在する場合のみ呼び出し
                if (typeof questionFlow.updateProgressBar === 'function') {
                    questionFlow.updateProgressBar();
                }
                
                // 進捗を手動で更新
                if (typeof questionFlow.onProgress === 'function') {
                    questionFlow.onProgress(100);
                }
                
                console.log('✅ All 30 questions answered');
                return true;
            };
        });
        
        // 高速回答を実行
        const rapidSuccess = await page.evaluate(() => window.rapidAnswer());
        if (!rapidSuccess) {
            throw new Error('高速回答に失敗しました');
        }
        
        console.timeEnd('All Questions');
        console.log('✅ 30問への回答完了');
        
        // Step 3: 最後の設問（q30）でのボタン確認
        console.log('\n🎯 Step 3: 最後の設問での「分析開始」ボタン確認');
        
        // 少し待ってUIが更新されるのを待つ
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // q30に実際に回答する
        console.log('📝 q30に回答中...');
        const q30Answered = await page.evaluate(() => {
            const activeQuestion = document.querySelector('.active-question');
            if (!activeQuestion) return false;
            
            // Shadow DOMの場合
            if (activeQuestion.shadowRoot) {
                const radios = activeQuestion.shadowRoot.querySelectorAll('input[type="radio"]');
                if (radios.length > 0) {
                    radios[Math.floor(Math.random() * radios.length)].click();
                    return true;
                }
            }
            
            // 通常のDOMの場合
            const radios = activeQuestion.querySelectorAll('input[type="radio"]');
            if (radios.length > 0) {
                radios[Math.floor(Math.random() * radios.length)].click();
                return true;
            }
            
            return false;
        });
        
        if (q30Answered) {
            console.log('✅ q30に回答しました');
        } else {
            console.log('❌ q30への回答に失敗');
        }
        
        // ボタンが有効になるまで少し待つ
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 現在表示されている設問を確認
        const currentQuestion = await page.evaluate(() => {
            const activeQuestion = document.querySelector('.active-question');
            return activeQuestion ? activeQuestion.dataset.questionId : null;
        });
        console.log(`📌 現在の設問: ${currentQuestion}`);
        
        // ボタンの状態を確認
        const buttonInfo = await page.evaluate(() => {
            const nextBtn = document.querySelector('#next-btn');
            if (!nextBtn) return null;
            
            return {
                text: nextBtn.textContent.trim(),
                disabled: nextBtn.disabled,
                hasAnalyzeClass: nextBtn.classList.contains('analyze-button'),
                isVisible: window.getComputedStyle(nextBtn).display !== 'none'
            };
        });
        
        if (buttonInfo) {
            console.log(`📌 ボタンテキスト: "${buttonInfo.text}"`);
            console.log(`📌 analyze-buttonクラス: ${buttonInfo.hasAnalyzeClass}`);
            console.log(`📌 ボタン状態: ${buttonInfo.disabled ? '無効' : '有効'}`);
            
            // スクリーンショット
            await page.screenshot({ path: 'q30-final-state.png' });
            console.log('📸 Q30の状態: q30-final-state.png');
            
            // 「分析開始」ボタンをクリック
            if (buttonInfo.text.includes('分析開始') && !buttonInfo.disabled) {
                console.log('\n🚀 「分析開始」ボタンをクリック');
                await page.click('#next-btn');
            } else {
                console.log('⚠️ ボタンが期待した状態ではありません');
            }
        }
        
        // Step 4: 遷移を待つ
        console.log('\n⏳ Step 4: 分析完了と遷移を待機');
        
        try {
            // 分析画面またはresults.htmlへの遷移を待つ
            await Promise.race([
                page.waitForSelector('#analysis-container', { 
                    visible: true, 
                    timeout: 15000 
                }),
                page.waitForFunction(
                    () => window.location.pathname.includes('results.html'),
                    { timeout: 15000 }
                )
            ]);
            
            console.log('✅ 遷移を検出');
            
            // 追加で待機（分析処理のため）
            await new Promise(resolve => setTimeout(resolve, 3000));
            
        } catch (e) {
            console.log('⚠️ 遷移タイムアウト');
        }
        
        // Step 5: 最終状態を確認
        console.log('\n📊 Step 5: 最終状態の確認');
        
        const finalUrl = page.url();
        const finalTitle = await page.title();
        
        console.log(`📍 最終URL: ${finalUrl}`);
        console.log(`📄 ページタイトル: ${finalTitle}`);
        
        if (finalUrl.includes('results.html')) {
            console.log('\n🎉 results.htmlに到達！');
            
            // ページ内容を確認
            const pageState = await page.evaluate(() => {
                return {
                    hasLoading: !!document.querySelector('.loading-container'),
                    hasVirtualPersona: !!document.querySelector('#virtual-persona-container'),
                    hasTripleOS: !!document.querySelector('.triple-os-results'),
                    visibleContainers: Array.from(document.querySelectorAll('[id$="-container"]'))
                        .filter(el => window.getComputedStyle(el).display !== 'none')
                        .map(el => el.id)
                };
            });
            
            console.log('\n📊 ページ状態:');
            console.log(`- ローディング: ${pageState.hasLoading ? '表示中' : '非表示'}`);
            console.log(`- 仮想人格: ${pageState.hasVirtualPersona ? '✅' : '❌'}`);
            console.log(`- Triple OS: ${pageState.hasTripleOS ? '✅' : '❌'}`);
            console.log(`- 表示中: ${pageState.visibleContainers.join(', ')}`);
            
            // スクリーンショット
            await page.screenshot({ 
                path: 'results-final.png',
                fullPage: true 
            });
            console.log('\n📸 最終結果: results-final.png');
        } else {
            console.log('\n⚠️ results.htmlに到達しませんでした');
            
            // 現在の画面状態を保存
            await page.screenshot({ path: 'final-state-not-results.png' });
            console.log('📸 最終状態: final-state-not-results.png');
        }
        
        console.timeEnd('Total Test Time');
        console.log('\n✅ 最適化テスト完了！');
        
    } catch (error) {
        console.error('\n❌ エラー発生:', error.message);
        await page.screenshot({ path: 'optimized-error.png' });
        console.log('📸 エラー画面: optimized-error.png');
    } finally {
        // ブラウザを閉じる（テスト完了後）
        await new Promise(resolve => setTimeout(resolve, 5000));
        await browser.close();
        console.log('\n🔚 ブラウザを閉じました');
    }
}

// テスト実行
testOptimizedFlow();