const puppeteer = require('puppeteer');

async function testResultsPage() {
    console.log('🚀 Results.html テスト開始');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 }
    });
    
    const page = await browser.newPage();
    
    // コンソールログを監視
    page.on('console', msg => {
        console.log(`[Browser] ${msg.text()}`);
    });
    
    page.on('error', err => {
        console.error(`[Browser Error] ${err.message}`);
    });
    
    try {
        // まず、テスト用のデータをLocalStorageに設定
        console.log('📝 テスト用データを準備中...');
        
        await page.evaluateOnNewDocument(() => {
            // テスト用の分析結果データ
            const testAnalysisResults = {
                engineOS: {
                    type: 'mountain',
                    hexagram: '山',
                    traits: ['安定性', '内省的', '慎重'],
                    score: 75,
                    description: 'あなたの価値観システムは山のように安定しています。'
                },
                interfaceOS: {
                    type: 'water',
                    hexagram: '水',
                    traits: ['柔軟性', '適応力', '流動的'],
                    score: 65,
                    description: '社会的な場面では水のように柔軟に対応します。'
                },
                safeModeOS: {
                    type: 'thunder',
                    hexagram: '雷',
                    traits: ['瞬発力', '決断力', '行動的'],
                    score: 80,
                    description: '危機的状況では雷のように素早く反応します。'
                },
                compatibility: {
                    engineInterface: 70,
                    engineSafeMode: 60,
                    interfaceSafeMode: 75
                },
                timestamp: new Date().toISOString()
            };
            
            // LocalStorageに保存
            localStorage.setItem('haqei_analysis_results', JSON.stringify(testAnalysisResults));
            localStorage.setItem('haqei_session', JSON.stringify({
                sessionId: 'test-session-' + Date.now(),
                stage: 'results',
                completedAt: new Date().toISOString()
            }));
        });
        
        // Results.htmlを開く
        console.log('📱 Results.htmlを開いています...');
        await page.goto('http://localhost:3000/results.html', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        
        // ページタイトル確認
        const title = await page.title();
        console.log(`📄 ページタイトル: ${title}`);
        
        // ページが読み込まれるまで待機
        await page.waitForTimeout(2000);
        
        // エラーメッセージの確認
        const errorVisible = await page.evaluate(() => {
            const errorElement = document.querySelector('.error-message');
            return errorElement && errorElement.style.display !== 'none';
        });
        
        if (errorVisible) {
            const errorText = await page.evaluate(() => {
                const errorElement = document.querySelector('.error-message');
                return errorElement ? errorElement.textContent : null;
            });
            console.log(`❌ エラーメッセージが表示されています: ${errorText}`);
        } else {
            console.log('✅ エラーメッセージは表示されていません');
        }
        
        // Triple OSの結果が表示されているか確認
        const tripleOSVisible = await page.evaluate(() => {
            const container = document.querySelector('#triple-os-results');
            return container && container.style.display !== 'none';
        });
        console.log(`📊 Triple OS結果表示: ${tripleOSVisible ? '表示中' : '非表示'}`);
        
        // 各OSの結果を確認
        const osResults = await page.evaluate(() => {
            const results = {};
            
            // Engine OS
            const engineElement = document.querySelector('.engine-os-card');
            if (engineElement) {
                results.engine = {
                    visible: true,
                    title: engineElement.querySelector('h3')?.textContent,
                    score: engineElement.querySelector('.score-value')?.textContent
                };
            }
            
            // Interface OS
            const interfaceElement = document.querySelector('.interface-os-card');
            if (interfaceElement) {
                results.interface = {
                    visible: true,
                    title: interfaceElement.querySelector('h3')?.textContent,
                    score: interfaceElement.querySelector('.score-value')?.textContent
                };
            }
            
            // SafeMode OS
            const safeModeElement = document.querySelector('.safemode-os-card');
            if (safeModeElement) {
                results.safeMode = {
                    visible: true,
                    title: safeModeElement.querySelector('h3')?.textContent,
                    score: safeModeElement.querySelector('.score-value')?.textContent
                };
            }
            
            return results;
        });
        
        console.log('\n🔍 OS結果の確認:');
        console.log('Engine OS:', osResults.engine || '表示されていません');
        console.log('Interface OS:', osResults.interface || '表示されていません');
        console.log('SafeMode OS:', osResults.safeMode || '表示されていません');
        
        // スクリーンショットを撮る
        await page.screenshot({ 
            path: 'results-page-test.png',
            fullPage: true 
        });
        console.log('\n📸 スクリーンショット保存: results-page-test.png');
        
        // ナビゲーションボタンの確認
        const navigationButtons = await page.evaluate(() => {
            const buttons = [];
            const navElements = document.querySelectorAll('.navigation-button, .nav-button, button');
            navElements.forEach(btn => {
                buttons.push({
                    text: btn.textContent.trim(),
                    disabled: btn.disabled,
                    className: btn.className
                });
            });
            return buttons;
        });
        
        console.log('\n🔘 ナビゲーションボタン:');
        navigationButtons.forEach(btn => {
            console.log(`- "${btn.text}" (${btn.disabled ? '無効' : '有効'})`);
        });
        
        // LocalStorageの状態を確認
        const storageData = await page.evaluate(() => {
            return {
                session: localStorage.getItem('haqei_session'),
                results: localStorage.getItem('haqei_analysis_results'),
                answers: localStorage.getItem('haqei_answers')
            };
        });
        
        console.log('\n💾 LocalStorage状態:');
        console.log('- セッション:', storageData.session ? 'あり' : 'なし');
        console.log('- 分析結果:', storageData.results ? 'あり' : 'なし');
        console.log('- 回答データ:', storageData.answers ? 'あり' : 'なし');
        
        console.log('\n✅ Results.htmlのテスト完了！');
        
    } catch (error) {
        console.error('❌ エラー発生:', error.message);
        await page.screenshot({ path: 'results-error-screenshot.png' });
        console.log('📸 エラースクリーンショット保存: results-error-screenshot.png');
    } finally {
        console.log('\n💡 ブラウザは開いたままです。手動で確認後、Ctrl+Cで終了してください。');
    }
}

// テスト実行
testResultsPage();