import { chromium } from 'playwright';

/**
 * 🎯 完全フローテストV2 - 36問回答から分析結果表示まで
 * 404エラー修正後の再テスト
 */

async function fullFlowTestV2() {
    console.log('🎯 完全フローテストV2開始 - 36問回答から結果表示まで\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 100  // さらに高速化
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        const errors = [];
        const notFoundUrls = [];
        
        // エラー監視
        page.on('pageerror', error => {
            errors.push(error.message);
            console.error(`[ERROR] ${error.message}`);
        });
        
        // 404監視
        page.on('response', response => {
            if (response.status() === 404) {
                notFoundUrls.push(response.url());
                console.error(`[404] ${response.url()}`);
            }
        });
        
        // 1. ページロード
        console.log('📡 ページロード中...');
        await page.goto('http://localhost:8788/os_analyzer.html');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);
        
        // 404チェック
        if (notFoundUrls.length > 0) {
            console.log('\n⚠️ 404エラーが検出されました:');
            notFoundUrls.forEach(url => console.log(`  - ${url}`));
        }
        
        // 2. 分析開始
        console.log('🖱️ 分析開始...');
        await page.locator('#start-btn').click();
        await page.waitForTimeout(1000);
        
        // 3. 36問に自動回答
        console.log('\n📝 36問に自動回答中...');
        let lastSuccessfulQuestion = 0;
        
        for (let i = 1; i <= 36; i++) {
            try {
                // 質問番号確認
                const questionNumber = await page.locator('#question-number').textContent();
                process.stdout.write(`\r  質問 ${questionNumber}/36`);
                
                // 最初の選択肢を選択
                const firstOption = page.locator('.option').first();
                await firstOption.click();
                await page.waitForTimeout(100);
                
                // 次へボタンを押す（最後の質問以外）
                if (i < 36) {
                    const nextBtn = page.locator('#next-btn');
                    
                    // ボタンが有効になるまで待つ（最大3秒）
                    let isEnabled = false;
                    for (let retry = 0; retry < 30; retry++) {
                        isEnabled = await nextBtn.isEnabled();
                        if (isEnabled) break;
                        await page.waitForTimeout(100);
                    }
                    
                    if (!isEnabled) {
                        console.error(`\n❌ 質問${i}で次ボタンが有効化されていません！`);
                        
                        // デバッグ情報収集
                        const btnClass = await nextBtn.getAttribute('class');
                        const btnDisabled = await nextBtn.getAttribute('disabled');
                        console.log(`  ボタンclass: ${btnClass}`);
                        console.log(`  disabled属性: ${btnDisabled}`);
                        
                        // エラー画面チェック
                        const errorVisible = await page.locator('.error-message').isVisible();
                        if (errorVisible) {
                            const errorText = await page.locator('.error-message').textContent();
                            console.error(`  エラーメッセージ: ${errorText}`);
                        }
                        
                        return { 
                            success: false, 
                            error: `Question ${i} next button not enabled`,
                            lastSuccessful: lastSuccessfulQuestion
                        };
                    }
                    
                    await nextBtn.click();
                    await page.waitForTimeout(200);
                    lastSuccessfulQuestion = i;
                    
                } else {
                    // 最後の質問の処理
                    console.log('\n\n🔍 最後の質問の処理...');
                    
                    // 次へボタンまたは完了ボタンを探す
                    const nextBtn = page.locator('#next-btn');
                    const completeBtn = page.locator('button:has-text("完了")');
                    const analyzeBtn = page.locator('button:has-text("分析")');
                    
                    // ボタンが有効になるまで待つ
                    await page.waitForTimeout(1000);
                    
                    if (await nextBtn.isVisible() && await nextBtn.isEnabled()) {
                        console.log('  次へボタンをクリック（分析開始）');
                        await nextBtn.click();
                    } else if (await completeBtn.isVisible()) {
                        console.log('  完了ボタンをクリック');
                        await completeBtn.click();
                    } else if (await analyzeBtn.isVisible()) {
                        console.log('  分析ボタンをクリック');
                        await analyzeBtn.click();
                    } else {
                        console.log('  ⚠️ 完了/分析ボタンが見つかりません');
                    }
                    lastSuccessfulQuestion = 36;
                }
                
            } catch (error) {
                console.error(`\n❌ 質問${i}でエラー: ${error.message}`);
                return {
                    success: false,
                    error: error.message,
                    lastSuccessful: lastSuccessfulQuestion
                };
            }
        }
        
        // 4. 分析処理を待機
        console.log('\n⏳ 分析処理を待機中...');
        await page.waitForTimeout(7000);  // 分析により時間をかける
        
        // 5. 結果画面の確認
        console.log('\n🔍 結果画面の確認...');
        
        // 結果画面の要素を探す
        const resultsScreen = await page.locator('#results-screen').isVisible();
        const resultsInQuestion = await page.locator('.results-screen').isVisible();
        const tripleOSDisplay = await page.locator('.os-result-card').count();
        const engineOS = await page.locator('text=/Engine OS/i').isVisible();
        const interfaceOS = await page.locator('text=/Interface OS/i').isVisible();
        const safeModeOS = await page.locator('text=/Safe Mode OS/i').isVisible();
        
        // Triple OSの数値表示確認
        const engineValue = await page.locator('.os-result-card:has-text("Engine OS") .percentage').isVisible().catch(() => false);
        const interfaceValue = await page.locator('.os-result-card:has-text("Interface OS") .percentage').isVisible().catch(() => false);
        const safeModeValue = await page.locator('.os-result-card:has-text("Safe Mode OS") .percentage').isVisible().catch(() => false);
        
        console.log(`  結果画面 (#results-screen): ${resultsScreen}`);
        console.log(`  結果画面 (.results-screen): ${resultsInQuestion}`);
        console.log(`  Triple OSカード数: ${tripleOSDisplay}`);
        console.log(`  Engine OS表示: ${engineOS}`);
        console.log(`  Interface OS表示: ${interfaceOS}`);
        console.log(`  Safe Mode OS表示: ${safeModeOS}`);
        console.log(`  Engine OS数値: ${engineValue}`);
        console.log(`  Interface OS数値: ${interfaceValue}`);
        console.log(`  Safe Mode OS数値: ${safeModeValue}`);
        
        // エラー画面の確認
        const errorScreen = await page.locator('#error-screen').isVisible();
        const errorMessage = await page.locator('.error-message').isVisible();
        
        if (errorScreen || errorMessage) {
            console.error('\n❌ エラー画面が表示されています！');
            const errorText = await page.locator('.error-message').textContent().catch(() => 'エラー内容取得失敗');
            console.error(`  エラー内容: ${errorText}`);
        }
        
        // スクリーンショット
        await page.screenshot({ 
            path: 'full_flow_result_v2_20250816.png',
            fullPage: false 
        });
        console.log('\n📸 スクリーンショット保存: full_flow_result_v2_20250816.png');
        
        // 結果判定
        const resultsDisplayed = resultsScreen || resultsInQuestion || tripleOSDisplay > 0;
        const osDisplayed = engineOS || interfaceOS || safeModeOS;
        const valuesDisplayed = engineValue || interfaceValue || safeModeValue;
        
        return {
            success: resultsDisplayed && osDisplayed && !errorScreen,
            details: {
                questionsCompleted: lastSuccessfulQuestion,
                resultsScreenVisible: resultsScreen || resultsInQuestion,
                tripleOSCardsCount: tripleOSDisplay,
                engineOSVisible: engineOS,
                interfaceOSVisible: interfaceOS,
                safeModeOSVisible: safeModeOS,
                valuesDisplayed: valuesDisplayed,
                errorScreenVisible: errorScreen,
                errors: errors.length,
                notFoundUrls: notFoundUrls.length
            }
        };
        
    } catch (error) {
        console.error('❌ テストエラー:', error.message);
        return {
            success: false,
            error: error.message
        };
    } finally {
        // ブラウザは開いたままにして確認できるようにする
        console.log('\n⚠️ ブラウザは開いたままです。手動で確認後、閉じてください。');
        // await browser.close();
    }
}

// 実行
fullFlowTestV2()
    .then(result => {
        console.log('\n=== 完全フローテストV2結果 ===');
        console.log(JSON.stringify(result, null, 2));
        
        if (result.success) {
            console.log('\n🎉 完全フロー成功！');
            console.log('✅ 36問すべて回答完了');
            console.log('✅ 分析結果画面表示');
            console.log('✅ Triple OS結果表示');
        } else {
            console.log('\n❌ 完全フローに問題があります');
            if (result.details) {
                console.log('詳細:');
                Object.entries(result.details).forEach(([key, value]) => {
                    console.log(`  - ${key}: ${value}`);
                });
            }
        }
    })
    .catch(error => {
        console.error('❌ 致命的エラー:', error);
    });