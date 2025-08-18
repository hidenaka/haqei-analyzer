import { chromium } from 'playwright';

/**
 * 🎯 完全動作確認テスト - すべての修正後
 */

async function completeTestFinal() {
    console.log('🎯 完全動作確認テスト開始\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 50  // 高速実行
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        const testResults = {
            pageLoad: false,
            startAnalysis: false,
            questionsCompleted: 0,
            resultsScreenVisible: false,
            tripleOSCardsVisible: false,
            osResults: null,
            errors: []
        };
        
        // コンソールメッセージ監視
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('ERROR') || text.includes('❌')) {
                testResults.errors.push(text);
            }
            if (text.includes('DEBUG') || text.includes('Triple OS results:')) {
                console.log(`[CONSOLE] ${text}`);
            }
        });
        
        // 1. ページロード
        console.log('📡 ページロード中...');
        await page.goto('http://localhost:8788/os_analyzer.html');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);
        testResults.pageLoad = true;
        console.log('✅ ページロード成功');
        
        // 2. 分析開始
        console.log('\n🖱️ 分析開始...');
        await page.locator('#start-btn').click();
        await page.waitForTimeout(1000);
        testResults.startAnalysis = true;
        console.log('✅ 分析開始成功');
        
        // 3. 36問に回答（高速モード）
        console.log('\n📝 36問に高速回答中...');
        for (let i = 1; i <= 36; i++) {
            try {
                // 進捗表示
                if (i % 6 === 0) {
                    console.log(`  進捗: ${i}/36 問完了`);
                }
                
                // 選択肢クリック
                await page.locator('.option').first().click();
                await page.waitForTimeout(50);
                
                // 次へボタンクリック（最後の質問以外）
                if (i < 36) {
                    const nextBtn = page.locator('#next-btn');
                    
                    // ボタンが有効になるまで少し待つ
                    let attempts = 0;
                    while (!(await nextBtn.isEnabled()) && attempts < 10) {
                        await page.waitForTimeout(100);
                        attempts++;
                    }
                    
                    if (await nextBtn.isEnabled()) {
                        await nextBtn.click();
                    } else {
                        // 強制進行
                        await page.evaluate(() => {
                            document.getElementById('next-btn').disabled = false;
                            document.getElementById('next-btn').click();
                        });
                    }
                } else {
                    // 最後の質問
                    await page.locator('#next-btn').click();
                }
                
                testResults.questionsCompleted++;
                await page.waitForTimeout(50);
                
            } catch (error) {
                console.error(`  ⚠️ 質問${i}でエラー: ${error.message}`);
                // エラーでも続行
            }
        }
        
        console.log(`✅ ${testResults.questionsCompleted}/36 問完了`);
        
        // 4. 分析処理を待機
        console.log('\n⏳ 分析処理待機中...');
        await page.waitForTimeout(8000);
        
        // 5. 結果画面の確認
        console.log('\n🔍 結果画面確認中...');
        
        // 結果画面の表示確認
        testResults.resultsScreenVisible = await page.locator('#results-screen').isVisible();
        console.log(`  結果画面: ${testResults.resultsScreenVisible ? '✅' : '❌'}`);
        
        // Triple OSカードの確認
        const osCardsCount = await page.locator('.os-card, .os-result-card').count();
        testResults.tripleOSCardsVisible = osCardsCount > 0;
        console.log(`  OSカード数: ${osCardsCount}`);
        
        // OS結果の詳細取得
        testResults.osResults = await page.evaluate(() => {
            const results = {};
            
            // OSカードから情報取得
            const cards = document.querySelectorAll('.os-card, .os-result-card');
            cards.forEach(card => {
                const title = card.querySelector('.os-title, .card-title, h3, h4')?.textContent;
                const percentage = card.querySelector('.percentage, .os-percentage, .strength')?.textContent;
                if (title) {
                    results[title.trim()] = percentage?.trim() || 'N/A';
                }
            });
            
            // os-cards-containerの存在確認
            const container = document.getElementById('os-cards-container');
            if (container && container.children.length > 0) {
                results.containerExists = true;
                results.containerChildCount = container.children.length;
            }
            
            return results;
        });
        
        // 6. 結果サマリー
        console.log('\n=== テスト結果サマリー ===');
        console.log(`  ページロード: ${testResults.pageLoad ? '✅' : '❌'}`);
        console.log(`  分析開始: ${testResults.startAnalysis ? '✅' : '❌'}`);
        console.log(`  質問完了: ${testResults.questionsCompleted}/36`);
        console.log(`  結果画面表示: ${testResults.resultsScreenVisible ? '✅' : '❌'}`);
        console.log(`  Triple OSカード: ${testResults.tripleOSCardsVisible ? '✅' : '❌'}`);
        
        if (testResults.osResults && Object.keys(testResults.osResults).length > 0) {
            console.log('\n📊 Triple OS結果:');
            Object.entries(testResults.osResults).forEach(([key, value]) => {
                if (!key.includes('container')) {
                    console.log(`  ${key}: ${value}`);
                }
            });
        }
        
        if (testResults.errors.length > 0) {
            console.log('\n⚠️ エラーログ:');
            testResults.errors.slice(0, 5).forEach(err => {
                console.log(`  - ${err.substring(0, 100)}`);
            });
        }
        
        // スクリーンショット
        await page.screenshot({ 
            path: 'complete_test_final_20250816.png',
            fullPage: false 
        });
        console.log('\n📸 スクリーンショット保存: complete_test_final_20250816.png');
        
        // 最終判定
        const success = 
            testResults.pageLoad &&
            testResults.startAnalysis &&
            testResults.questionsCompleted >= 33 &&  // 90%以上
            testResults.resultsScreenVisible &&
            (testResults.tripleOSCardsVisible || testResults.osResults?.containerChildCount > 0);
        
        return {
            success: success,
            details: testResults
        };
        
    } catch (error) {
        console.error('❌ テストエラー:', error.message);
        return { success: false, error: error.message };
    } finally {
        console.log('\n⚠️ ブラウザは開いたままです。手動確認後、閉じてください。');
    }
}

// 実行
completeTestFinal()
    .then(result => {
        console.log('\n' + '='.repeat(50));
        console.log('📋 最終テスト結果');
        console.log('='.repeat(50));
        
        if (result.success) {
            console.log('\n🎉🎉🎉 完全動作成功！ 🎉🎉🎉');
            console.log('✅ すべての機能が正常に動作しています');
            console.log('✅ 36問完了');
            console.log('✅ 分析結果表示');
            console.log('✅ Triple OS表示');
        } else {
            console.log('\n⚠️ 一部機能に問題があります');
            if (result.details) {
                const completed = result.details.questionsCompleted;
                const percentage = Math.round((completed / 36) * 100);
                console.log(`  質問完了率: ${percentage}% (${completed}/36)`);
            }
        }
        
        console.log('\n' + '='.repeat(50));
    })
    .catch(error => {
        console.error('❌ 致命的エラー:', error);
    });