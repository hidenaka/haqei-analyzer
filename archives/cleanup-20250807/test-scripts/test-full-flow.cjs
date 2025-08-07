const puppeteer = require('puppeteer');

async function testFullFlow() {
    console.log('🚀 OS Analyzer → Results.html フルフローテスト開始');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 }
    });
    
    const page = await browser.newPage();
    
    // コンソールログを監視
    page.on('console', msg => {
        const text = msg.text();
        if (!text.includes('[DataManager]') && !text.includes('利用可能なデータ')) {
            console.log(`[Browser] ${text}`);
        }
    });
    
    try {
        // Step 1: OS Analyzerを開く
        console.log('\n📱 Step 1: OS Analyzerを開く');
        await page.goto('http://localhost:3000/os_analyzer.html', { 
            waitUntil: 'networkidle2' 
        });
        
        // Welcome画面で「分析を開始する」ボタンをクリック
        await page.waitForSelector('#start-analysis-btn', { visible: true });
        await page.click('#start-analysis-btn');
        console.log('✅ 分析開始ボタンをクリック');
        
        // 設問画面が表示されるまで待機
        await page.waitForSelector('#questions-container', { visible: true });
        console.log('✅ 設問画面が表示されました');
        
        // Step 2: 高速で30問に回答
        console.log('\n⚡ Step 2: 高速回答モード（30問）');
        
        for (let i = 1; i <= 30; i++) {
            // 現在の設問が表示されるまで少し待つ
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // アクティブな設問を探して回答
            const answered = await page.evaluate((questionIndex) => {
                // アクティブな設問を見つける
                const activeQuestion = document.querySelector('.active-question, haqei-question[style*="display: block"]');
                if (!activeQuestion) {
                    console.log(`設問 ${questionIndex} が見つかりません`);
                    return false;
                }
                
                // Shadow DOMの場合
                if (activeQuestion.shadowRoot) {
                    const radios = activeQuestion.shadowRoot.querySelectorAll('input[type="radio"]');
                    if (radios.length > 0) {
                        // ランダムに選択
                        const randomRadio = radios[Math.floor(Math.random() * radios.length)];
                        randomRadio.click();
                        return true;
                    }
                }
                
                // 通常のDOMの場合
                const radios = activeQuestion.querySelectorAll('input[type="radio"]');
                if (radios.length > 0) {
                    const randomRadio = radios[Math.floor(Math.random() * radios.length)];
                    randomRadio.click();
                    return true;
                }
                
                return false;
            }, i);
            
            if (!answered) {
                console.log(`⚠️ 設問 ${i} の回答に失敗`);
                continue;
            }
            
            // 回答後、ボタンの状態を確認
            await page.waitForFunction(
                () => {
                    const nextBtn = document.querySelector('#next-btn');
                    return nextBtn && !nextBtn.disabled;
                },
                { timeout: 2000 }
            );
            
            // 現在の設問番号とボタンテキストを取得
            const buttonInfo = await page.evaluate(() => {
                const nextBtn = document.querySelector('#next-btn');
                return {
                    text: nextBtn ? nextBtn.textContent : '',
                    hasAnalyzeClass: nextBtn ? nextBtn.classList.contains('analyze-button') : false
                };
            });
            
            console.log(`✓ 設問 ${i}/30 回答完了 - ボタン: "${buttonInfo.text}"`);
            
            // 最後の設問（q30）の場合は特別な処理
            if (i === 30) {
                console.log('\n🎯 最後の設問（q30）に到達！');
                console.log(`📌 ボタンテキスト: "${buttonInfo.text}"`);
                console.log(`📌 analyze-buttonクラス: ${buttonInfo.hasAnalyzeClass}`);
                
                // スクリーンショットを撮る
                await page.screenshot({ path: 'q30-button-state.png' });
                console.log('📸 Q30のボタン状態: q30-button-state.png');
                
                // 「分析開始」ボタンをクリック
                if (buttonInfo.text.includes('分析開始')) {
                    console.log('\n🚀 「分析開始」ボタンをクリックします...');
                    await page.click('#next-btn');
                } else {
                    console.log('⚠️ ボタンが「分析開始」になっていません');
                    await page.click('#next-btn');
                }
            } else {
                // 次の設問へ
                await page.click('#next-btn');
            }
        }
        
        // Step 3: 分析画面への遷移を待つ
        console.log('\n⏳ Step 3: 分析画面への遷移を待機中...');
        
        // 分析画面が表示されるか、results.htmlに遷移するまで待機
        const transitioned = await Promise.race([
            // 分析画面の表示を待つ
            page.waitForSelector('#analysis-container', { visible: true, timeout: 10000 })
                .then(() => 'analysis'),
            // URL変更を待つ
            page.waitForFunction(
                () => window.location.pathname.includes('results.html'),
                { timeout: 10000 }
            ).then(() => 'results'),
            // タイムアウト
            new Promise(resolve => setTimeout(() => resolve('timeout'), 10000))
        ]);
        
        console.log(`📊 遷移結果: ${transitioned}`);
        
        if (transitioned === 'analysis') {
            console.log('✅ 分析画面が表示されました');
            
            // 分析完了を待つ
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // results.htmlへの自動遷移を待つ
            await page.waitForFunction(
                () => window.location.pathname.includes('results.html'),
                { timeout: 10000 }
            );
            console.log('✅ results.htmlに遷移しました');
        } else if (transitioned === 'results') {
            console.log('✅ 直接results.htmlに遷移しました');
        } else {
            console.log('⚠️ 遷移がタイムアウトしました');
        }
        
        // Step 4: 現在のURLとページ状態を確認
        const currentUrl = await page.url();
        const pageTitle = await page.title();
        
        console.log(`\n📍 現在のURL: ${currentUrl}`);
        console.log(`📄 ページタイトル: ${pageTitle}`);
        
        // results.htmlの内容を確認
        if (currentUrl.includes('results.html')) {
            console.log('\n🎉 results.htmlに到達しました！');
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // ページの内容を確認
            const pageContent = await page.evaluate(() => {
                const content = {
                    hasVirtualPersona: !!document.querySelector('#virtual-persona-container'),
                    hasTripleOS: !!document.querySelector('.triple-os-results'),
                    hasDialogue: !!document.querySelector('#dialogue-section'),
                    visibleSections: []
                };
                
                // 表示されているセクションを確認
                document.querySelectorAll('[id$="-container"], .results-section').forEach(el => {
                    if (window.getComputedStyle(el).display !== 'none') {
                        content.visibleSections.push(el.id || el.className);
                    }
                });
                
                return content;
            });
            
            console.log('\n📊 ページ内容:');
            console.log(`- 仮想人格コンテナ: ${pageContent.hasVirtualPersona ? '✅' : '❌'}`);
            console.log(`- Triple OS結果: ${pageContent.hasTripleOS ? '✅' : '❌'}`);
            console.log(`- 対話セクション: ${pageContent.hasDialogue ? '✅' : '❌'}`);
            console.log(`- 表示中のセクション: ${pageContent.visibleSections.join(', ')}`);
            
            // フルページスクリーンショット
            await page.screenshot({ 
                path: 'results-full-flow.png',
                fullPage: true 
            });
            console.log('\n📸 Results.html スクリーンショット: results-full-flow.png');
        } else {
            console.log('\n⚠️ results.htmlに遷移しませんでした');
            await page.screenshot({ path: 'final-state.png' });
            console.log('📸 最終状態: final-state.png');
        }
        
        console.log('\n✅ フルフローテスト完了！');
        
    } catch (error) {
        console.error('\n❌ エラー発生:', error.message);
        await page.screenshot({ path: 'full-flow-error.png' });
        console.log('📸 エラースクリーンショット: full-flow-error.png');
    } finally {
        console.log('\n💡 ブラウザは開いたままです。手動で確認してください。');
    }
}

// テスト実行
testFullFlow();