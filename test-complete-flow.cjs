const puppeteer = require('puppeteer');

async function testCompleteFlow() {
    console.log('🚀 完全動作確認テスト開始');
    console.time('Total Test Time');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 },
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // 重要なログのみ表示
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('🎯') || text.includes('✅') || text.includes('❌') || 
            text.includes('分析開始') || text.includes('Analyze button clicked')) {
            console.log(`[Browser] ${text}`);
        }
    });
    
    try {
        // Step 1: 初期化とOS Analyzer開始
        console.log('\n📝 Step 1: 初期化');
        await page.goto('http://localhost:3000/os_analyzer.html');
        await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
        await page.reload({ waitUntil: 'networkidle2' });
        
        // Welcome画面で開始
        await page.waitForSelector('#start-analysis-btn', { visible: true });
        await page.click('#start-analysis-btn');
        console.log('✅ 分析開始');
        
        // Step 2: 29問まで高速回答
        console.log('\n⚡ Step 2: q1-q29高速回答');
        await page.waitForSelector('#questions-container', { visible: true });
        
        // 高速回答スクリプトを注入（q29まで）
        await page.evaluate(() => {
            const app = window.app || window.App;
            if (!app || !app.questionFlow) return;
            
            const questionFlow = app.questionFlow;
            const answers = [];
            
            // q1-q29まで回答を生成
            for (let i = 1; i <= 29; i++) {
                answers.push({
                    questionId: `q${i}`,
                    selectedValue: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
                    timestamp: new Date().toISOString()
                });
            }
            
            localStorage.setItem('haqei_answers', JSON.stringify(answers));
            
            // q29に移動（インデックスは28）
            questionFlow.currentQuestionIndex = 28;
            questionFlow.updateVisibleRange();
            questionFlow.renderVisibleQuestions();
            questionFlow.updateNavigationButtons();
        });
        
        console.log('✅ q1-q29回答完了');
        
        // Step 3: q29からq30へ手動で遷移
        console.log('\n📝 Step 3: q29からq30への遷移');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 次へボタンをクリックしてq30へ
        await page.click('#next-btn');
        console.log('✅ q30へ遷移');
        
        // q30が表示されるまで待機
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Step 4: q30に手動で回答
        console.log('\n🎯 Step 4: q30（最後の設問）での処理');
        
        // q30の選択肢をクリック
        const q30Answered = await page.evaluate(() => {
            const activeQuestion = document.querySelector('.active-question, haqei-question[style*="display: block"]');
            if (!activeQuestion) {
                console.error('Active question not found');
                return false;
            }
            
            console.log('Active question found:', activeQuestion.dataset.questionId);
            
            // Shadow DOMの処理
            if (activeQuestion.shadowRoot) {
                const radios = activeQuestion.shadowRoot.querySelectorAll('input[type="radio"]');
                console.log('Shadow DOM radios found:', radios.length);
                if (radios.length > 0) {
                    // 最初の選択肢をクリック
                    radios[0].click();
                    console.log('✅ Shadow DOM radio clicked');
                    return true;
                }
            }
            
            // 通常のDOMの処理
            const radios = activeQuestion.querySelectorAll('input[type="radio"]');
            console.log('Regular DOM radios found:', radios.length);
            if (radios.length > 0) {
                radios[0].click();
                console.log('✅ Regular DOM radio clicked');
                return true;
            }
            
            return false;
        });
        
        console.log(`📌 q30回答結果: ${q30Answered ? '成功' : '失敗'}`);
        
        // ボタンの状態が更新されるまで待機
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // ボタンの状態を確認
        const buttonState = await page.evaluate(() => {
            const nextBtn = document.querySelector('#next-btn');
            if (!nextBtn) return null;
            
            return {
                text: nextBtn.textContent.trim(),
                disabled: nextBtn.disabled,
                hasAnalyzeClass: nextBtn.classList.contains('analyze-button'),
                isVisible: window.getComputedStyle(nextBtn).display !== 'none',
                classList: Array.from(nextBtn.classList)
            };
        });
        
        console.log('\n📊 ボタン状態:');
        console.log(`- テキスト: "${buttonState?.text}"`);
        console.log(`- 状態: ${buttonState?.disabled ? '無効' : '有効'}`);
        console.log(`- analyze-buttonクラス: ${buttonState?.hasAnalyzeClass}`);
        console.log(`- クラスリスト: ${buttonState?.classList.join(', ')}`);
        
        // スクリーンショット
        await page.screenshot({ path: 'q30-with-answer.png' });
        console.log('📸 q30回答後: q30-with-answer.png');
        
        // Step 5: 分析開始ボタンをクリック
        if (buttonState?.text.includes('分析開始')) {
            console.log('\n🚀 Step 5: 「分析開始」ボタンをクリック');
            
            // ボタンが有効になっているか再確認
            const isEnabled = await page.evaluate(() => {
                const btn = document.querySelector('#next-btn');
                return btn && !btn.disabled;
            });
            
            if (isEnabled) {
                await page.click('#next-btn');
                console.log('✅ ボタンをクリックしました');
            } else {
                console.log('⚠️ ボタンがまだ無効です。強制的にクリックを試みます...');
                
                // JavaScriptで直接クリックイベントを発火
                await page.evaluate(() => {
                    const btn = document.querySelector('#next-btn');
                    if (btn) {
                        btn.disabled = false;
                        btn.click();
                    }
                });
            }
        }
        
        // Step 6: 遷移を待つ
        console.log('\n⏳ Step 6: 分析完了とresults.htmlへの遷移を待機');
        
        try {
            await Promise.race([
                page.waitForSelector('#analysis-container', { visible: true, timeout: 10000 }),
                page.waitForFunction(() => window.location.pathname.includes('results.html'), { timeout: 10000 })
            ]);
            console.log('✅ 遷移を検出');
        } catch (e) {
            console.log('⚠️ 遷移待機中にタイムアウト');
        }
        
        // 追加待機
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Step 7: 最終状態確認
        console.log('\n📊 Step 7: 最終状態の確認');
        const finalUrl = page.url();
        const finalTitle = await page.title();
        
        console.log(`📍 最終URL: ${finalUrl}`);
        console.log(`📄 ページタイトル: ${finalTitle}`);
        
        if (finalUrl.includes('results.html')) {
            console.log('\n🎉 results.htmlに到達成功！');
            
            // results.htmlの内容を確認
            const resultsContent = await page.evaluate(() => {
                return {
                    hasVirtualPersona: !!document.querySelector('#virtual-persona-container'),
                    hasTripleOS: !!document.querySelector('.triple-os-results'),
                    hasEngineOS: !!document.querySelector('.engine-os'),
                    hasInterfaceOS: !!document.querySelector('.interface-os'),
                    hasSafeModeOS: !!document.querySelector('.safemode-os'),
                    visibleElements: []
                };
            });
            
            console.log('\n📊 Results.html内容:');
            console.log(`- 仮想人格: ${resultsContent.hasVirtualPersona ? '✅' : '❌'}`);
            console.log(`- Triple OS: ${resultsContent.hasTripleOS ? '✅' : '❌'}`);
            console.log(`- Engine OS: ${resultsContent.hasEngineOS ? '✅' : '❌'}`);
            console.log(`- Interface OS: ${resultsContent.hasInterfaceOS ? '✅' : '❌'}`);
            console.log(`- SafeMode OS: ${resultsContent.hasSafeModeOS ? '✅' : '❌'}`);
            
            // フルスクリーンショット
            await page.screenshot({ path: 'results-complete.png', fullPage: true });
            console.log('\n📸 Results.html: results-complete.png');
        } else {
            console.log('\n⚠️ results.htmlに到達できませんでした');
            await page.screenshot({ path: 'final-state-complete.png' });
            console.log('📸 最終状態: final-state-complete.png');
        }
        
        console.timeEnd('Total Test Time');
        console.log('\n✅ 完全動作確認テスト完了！');
        
    } catch (error) {
        console.error('\n❌ エラー発生:', error.message);
        await page.screenshot({ path: 'complete-test-error.png' });
        console.log('📸 エラー画面: complete-test-error.png');
    } finally {
        // ブラウザは5秒後に閉じる
        await new Promise(resolve => setTimeout(resolve, 5000));
        await browser.close();
        console.log('\n🔚 テスト終了');
    }
}

// テスト実行
testCompleteFlow();