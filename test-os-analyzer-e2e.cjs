const puppeteer = require('puppeteer');

async function testOSAnalyzer() {
    console.log('🚀 OS Analyzer E2Eテスト開始');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 }
    });
    
    const page = await browser.newPage();
    
    // コンソールログを監視
    page.on('console', msg => {
        console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`);
    });
    
    try {
        // OS Analyzerページを開く
        console.log('📱 OS Analyzerページを開いています...');
        await page.goto('http://localhost:3000/os_analyzer.html', { waitUntil: 'networkidle2' });
        
        // ページタイトル確認
        const title = await page.title();
        console.log(`📄 ページタイトル: ${title}`);
        
        // Welcome画面の確認
        const welcomeVisible = await page.evaluate(() => {
            const welcomeContainer = document.querySelector('#welcome-container');
            return welcomeContainer && welcomeContainer.style.display !== 'none';
        });
        console.log(`✅ Welcome画面表示: ${welcomeVisible}`);
        
        // 「分析を開始する」ボタンをクリック
        await page.waitForSelector('#start-analysis-btn', { visible: true });
        await page.click('#start-analysis-btn');
        console.log('✅ 分析開始ボタンをクリック');
        
        // 設問画面が表示されるまで待機
        await page.waitForSelector('#questions-container', { visible: true });
        console.log('✅ 設問画面が表示されました');
        
        // 高速で設問に回答していく（テスト用）
        for (let i = 1; i <= 30; i++) {
            console.log(`\n📝 設問 ${i}/30 に回答中...`);
            
            // 現在の設問が表示されるまで待機
            await page.waitForFunction(
                (index) => {
                    const activeQuestion = document.querySelector('.active-question');
                    return activeQuestion && activeQuestion.dataset.questionId === `q${index}`;
                },
                { timeout: 5000 },
                i
            );
            
            // ランダムに選択肢を選ぶ
            const answered = await page.evaluate((questionIndex) => {
                const activeQuestion = document.querySelector('.active-question');
                if (!activeQuestion) return false;
                
                // Shadow DOMの場合の処理
                if (activeQuestion.shadowRoot) {
                    const options = activeQuestion.shadowRoot.querySelectorAll('input[type="radio"]');
                    if (options.length > 0) {
                        const randomOption = options[Math.floor(Math.random() * options.length)];
                        randomOption.click();
                        return true;
                    }
                }
                
                // 通常のDOMの場合
                const options = activeQuestion.querySelectorAll('input[type="radio"]');
                if (options.length > 0) {
                    const randomOption = options[Math.floor(Math.random() * options.length)];
                    randomOption.click();
                    return true;
                }
                
                return false;
            }, i);
            
            if (answered) {
                console.log(`✅ 設問 ${i} に回答しました`);
            } else {
                console.log(`❌ 設問 ${i} の回答に失敗`);
            }
            
            // 最後の設問でなければ次へ
            if (i < 30) {
                // 次へボタンが有効になるまで待機
                await page.waitForFunction(
                    () => {
                        const nextBtn = document.querySelector('#next-btn');
                        return nextBtn && !nextBtn.disabled;
                    },
                    { timeout: 5000 }
                );
                
                await page.click('#next-btn');
                console.log('➡️  次の設問へ');
            }
        }
        
        // 最後の設問（q30）での確認
        console.log('\n🎯 最後の設問（q30）に到達しました');
        
        // ボタンテキストの確認
        const buttonText = await page.evaluate(() => {
            const nextBtn = document.querySelector('#next-btn');
            return nextBtn ? nextBtn.textContent : null;
        });
        console.log(`📌 ボタンテキスト: "${buttonText}"`);
        
        // analyze-buttonクラスの確認
        const hasAnalyzeClass = await page.evaluate(() => {
            const nextBtn = document.querySelector('#next-btn');
            return nextBtn ? nextBtn.classList.contains('analyze-button') : false;
        });
        console.log(`📌 analyze-buttonクラス: ${hasAnalyzeClass}`);
        
        // スクリーンショットを撮る
        await page.screenshot({ path: 'q30-analyze-button.png' });
        console.log('📸 スクリーンショット保存: q30-analyze-button.png');
        
        // 分析開始ボタンをクリック
        if (buttonText === '分析開始 →') {
            console.log('\n🚀 分析開始ボタンをクリックします...');
            await page.click('#next-btn');
            
            // 分析画面への遷移を待つ
            await page.waitForTimeout(2000);
            
            // 現在の画面状態を確認
            const currentState = await page.evaluate(() => {
                const analysisScreen = document.querySelector('#analysis-container');
                const questionsScreen = document.querySelector('#questions-container');
                return {
                    analysisVisible: analysisScreen && analysisScreen.style.display !== 'none',
                    questionsVisible: questionsScreen && questionsScreen.style.display !== 'none',
                    url: window.location.href
                };
            });
            
            console.log('📊 現在の状態:', currentState);
            
            // 最終スクリーンショット
            await page.screenshot({ path: 'final-state.png' });
            console.log('📸 最終スクリーンショット保存: final-state.png');
        }
        
        console.log('\n✅ テスト完了！');
        
    } catch (error) {
        console.error('❌ エラー発生:', error);
        await page.screenshot({ path: 'error-screenshot.png' });
    } finally {
        // ブラウザは開いたままにする（手動確認のため）
        console.log('\n💡 ブラウザは開いたままです。手動で確認後、Ctrl+Cで終了してください。');
    }
}

// テスト実行
testOSAnalyzer();