const puppeteer = require('puppeteer');

async function testResultsWithMCP() {
    console.log('🚀 Results.html MCP テスト開始');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 }
    });
    
    const page = await browser.newPage();
    
    // コンソールログを監視
    page.on('console', msg => {
        const text = msg.text();
        if (!text.includes('[DataManager]')) { // DataManagerのログを除外
            console.log(`[Browser] ${text}`);
        }
    });
    
    try {
        // Step 1: テストデータ投入ページを開く
        console.log('\n📝 Step 1: テストデータを投入');
        await page.goto('http://localhost:3000/test-results-with-data.html', { 
            waitUntil: 'networkidle2' 
        });
        
        // データ投入ボタンをクリック
        await page.click('button[onclick="injectCompleteData()"]');
        console.log('✅ 分析結果データを投入しました');
        
        await page.waitForTimeout(1000);
        
        // Step 2: Results.htmlを開く
        console.log('\n📱 Step 2: Results.htmlを開く');
        await page.goto('http://localhost:3000/results.html', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        
        console.log('✅ Results.htmlが読み込まれました');
        
        // ローディング画面が消えるまで待機
        await page.waitForFunction(
            () => {
                const loadingElement = document.querySelector('.loading-container');
                return !loadingElement || loadingElement.style.display === 'none';
            },
            { timeout: 10000 }
        );
        
        console.log('✅ ローディング画面が終了しました');
        
        // Step 3: 画面の内容を確認
        console.log('\n🔍 Step 3: 画面内容の確認');
        
        // タイトルを確認
        const pageTitle = await page.title();
        console.log(`📄 ページタイトル: ${pageTitle}`);
        
        // 主要なコンテナの表示状態を確認
        const containers = await page.evaluate(() => {
            const results = {};
            
            // 各コンテナの表示状態を確認
            const selectors = {
                virtualPersona: '#virtual-persona-container',
                personalityConstruction: '#personality-construction-container',
                dialogueSection: '#dialogue-section',
                tripleOS: '.triple-os-results',
                engineOS: '.engine-os',
                interfaceOS: '.interface-os',
                safeModeOS: '.safemode-os'
            };
            
            for (const [name, selector] of Object.entries(selectors)) {
                const element = document.querySelector(selector);
                results[name] = {
                    exists: !!element,
                    visible: element ? window.getComputedStyle(element).display !== 'none' : false,
                    content: element ? element.textContent.substring(0, 100) : null
                };
            }
            
            return results;
        });
        
        console.log('\n📊 コンテナの表示状態:');
        for (const [name, info] of Object.entries(containers)) {
            if (info.exists && info.visible) {
                console.log(`✅ ${name}: 表示中`);
            } else if (info.exists && !info.visible) {
                console.log(`⚠️  ${name}: 非表示`);
            } else {
                console.log(`❌ ${name}: 存在しない`);
            }
        }
        
        // Step 4: Triple OSの詳細を確認
        console.log('\n🎯 Step 4: Triple OSの詳細確認');
        
        const tripleOSData = await page.evaluate(() => {
            const data = {};
            
            // Engine OS
            const engineElement = document.querySelector('.engine-os');
            if (engineElement) {
                data.engineOS = {
                    title: engineElement.querySelector('h3')?.textContent,
                    hexagram: engineElement.querySelector('.hexagram-name')?.textContent,
                    score: engineElement.querySelector('.score-value')?.textContent,
                    description: engineElement.querySelector('.os-description')?.textContent
                };
            }
            
            // Interface OS
            const interfaceElement = document.querySelector('.interface-os');
            if (interfaceElement) {
                data.interfaceOS = {
                    title: interfaceElement.querySelector('h3')?.textContent,
                    hexagram: interfaceElement.querySelector('.hexagram-name')?.textContent,
                    score: interfaceElement.querySelector('.score-value')?.textContent,
                    description: interfaceElement.querySelector('.os-description')?.textContent
                };
            }
            
            // SafeMode OS
            const safeModeElement = document.querySelector('.safemode-os');
            if (safeModeElement) {
                data.safeModeOS = {
                    title: safeModeElement.querySelector('h3')?.textContent,
                    hexagram: safeModeElement.querySelector('.hexagram-name')?.textContent,
                    score: safeModeElement.querySelector('.score-value')?.textContent,
                    description: safeModeElement.querySelector('.os-description')?.textContent
                };
            }
            
            return data;
        });
        
        if (tripleOSData.engineOS) {
            console.log('\n🔷 Engine OS (価値観システム):');
            console.log(`  - タイトル: ${tripleOSData.engineOS.title}`);
            console.log(`  - 卦: ${tripleOSData.engineOS.hexagram}`);
            console.log(`  - スコア: ${tripleOSData.engineOS.score}`);
        }
        
        if (tripleOSData.interfaceOS) {
            console.log('\n🔶 Interface OS (社会的システム):');
            console.log(`  - タイトル: ${tripleOSData.interfaceOS.title}`);
            console.log(`  - 卦: ${tripleOSData.interfaceOS.hexagram}`);
            console.log(`  - スコア: ${tripleOSData.interfaceOS.score}`);
        }
        
        if (tripleOSData.safeModeOS) {
            console.log('\n🔴 SafeMode OS (防御システム):');
            console.log(`  - タイトル: ${tripleOSData.safeModeOS.title}`);
            console.log(`  - 卦: ${tripleOSData.safeModeOS.hexagram}`);
            console.log(`  - スコア: ${tripleOSData.safeModeOS.score}`);
        }
        
        // Step 5: スクリーンショットを撮る
        console.log('\n📸 Step 5: スクリーンショットを保存');
        
        await page.screenshot({ 
            path: 'results-page-full.png',
            fullPage: true 
        });
        console.log('✅ フルページスクリーンショット: results-page-full.png');
        
        // Triple OS部分のスクリーンショット
        const tripleOSElement = await page.$('.triple-os-results');
        if (tripleOSElement) {
            await tripleOSElement.screenshot({ path: 'results-triple-os.png' });
            console.log('✅ Triple OSスクリーンショット: results-triple-os.png');
        }
        
        // Step 6: ナビゲーションボタンの確認
        console.log('\n🔘 Step 6: ナビゲーションボタンの確認');
        
        const buttons = await page.evaluate(() => {
            const buttonElements = document.querySelectorAll('button, .nav-button, .action-button');
            return Array.from(buttonElements).map(btn => ({
                text: btn.textContent.trim(),
                className: btn.className,
                disabled: btn.disabled,
                visible: window.getComputedStyle(btn).display !== 'none'
            }));
        });
        
        console.log(`\n見つかったボタン: ${buttons.length}個`);
        buttons.forEach(btn => {
            if (btn.visible) {
                console.log(`- "${btn.text}" (${btn.disabled ? '無効' : '有効'})`);
            }
        });
        
        console.log('\n✅ Results.html MCPテスト完了！');
        
    } catch (error) {
        console.error('\n❌ エラー発生:', error.message);
        await page.screenshot({ path: 'results-mcp-error.png' });
        console.log('📸 エラースクリーンショット: results-mcp-error.png');
    } finally {
        console.log('\n💡 ブラウザは開いたままです。手動で確認後、Ctrl+Cで終了してください。');
    }
}

// テスト実行
testResultsWithMCP();