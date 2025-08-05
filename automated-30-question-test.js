/**
 * 自動30問テストスクリプト
 * PlaywrightでHAQEI 30問の回答を自動化し、resultsページまでテスト
 */

const { chromium } = require('playwright');

async function run30QuestionTest() {
    console.log('🚀 HAQEI 30問自動テスト開始...');
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // 1. ページへ移動
        console.log('📱 ページ読み込み中...');
        await page.goto('http://localhost:8080/os_analyzer.html');
        await page.waitForTimeout(3000);
        
        // 2. 「分析を開始する」ボタンをクリック
        console.log('🎯 分析開始ボタンをクリック...');
        await page.click('button:has-text("分析を開始する")');
        await page.waitForTimeout(2000);
        
        // 3. 質問画面が表示されるまで待機
        console.log('❓ 質問画面の表示を待機...');
        await page.waitForSelector('haqei-question, .question-item, .question-container', { timeout: 10000 });
        
        // 4. 30問の回答を自動化
        console.log('📝 30問の自動回答を開始...');
        for (let i = 1; i <= 30; i++) {
            console.log(`  📋 質問 ${i}/30 に回答中...`);
            
            try {
                // 質問要素を探す
                const questionSelectors = [
                    'haqei-question',
                    '.question-item',
                    '.question-container',
                    '[data-question-id]'
                ];
                
                let questionFound = false;
                for (const selector of questionSelectors) {
                    const questions = await page.$$(selector);
                    if (questions.length > 0) {
                        // 最初のオプションを選択
                        const firstOption = await page.$(`${selector} input[type="radio"], ${selector} .option-label`);
                        if (firstOption) {
                            await firstOption.click();
                            questionFound = true;
                            console.log(`    ✅ 質問 ${i}: 回答完了`);
                            break;
                        }
                    }
                }
                
                if (!questionFound) {
                    console.log(`    ⚠️ 質問 ${i}: 質問要素が見つかりません`);
                    // スクリーンショットを撮影
                    await page.screenshot({ path: `question_${i}_not_found.png` });
                }
                
                // 次へボタンまたは自動遷移を待つ
                await page.waitForTimeout(1000);
                
                // 次へボタンがあればクリック
                const nextButton = await page.$('button:has-text("次へ"), .next-button, [data-action="next"]');
                if (nextButton) {
                    await nextButton.click();
                    await page.waitForTimeout(1000);
                }
                
            } catch (error) {
                console.error(`    ❌ 質問 ${i} でエラー:`, error.message);
                await page.screenshot({ path: `error_question_${i}.png` });
            }
        }
        
        // 5. 結果画面への遷移を確認
        console.log('🎯 結果画面への遷移を確認中...');
        
        // 結果画面を示す要素を待機
        const resultSelectors = [
            '#results-container',
            '.results-screen',
            '.analysis-results',
            '[href*="results"]',
            'text=結果',
            'text=分析結果',
            'text=あなたの'
        ];
        
        let resultsFound = false;
        for (const selector of resultSelectors) {
            try {
                await page.waitForSelector(selector, { timeout: 5000 });
                console.log(`✅ 結果画面検出: ${selector}`);
                resultsFound = true;
                break;
            } catch (error) {
                // このセレクターでは見つからなかった
                continue;
            }
        }
        
        if (resultsFound) {
            console.log('🎉 30問完了！結果画面への遷移成功');
            await page.screenshot({ path: 'results_page_success.png' });
            
            // 結果画面の内容を確認
            const resultsContent = await page.textContent('body');
            console.log('📊 結果画面の内容プレビュー:', resultsContent.substring(0, 200) + '...');
            
            return {
                success: true,
                message: '30問完了、結果画面遷移成功',
                screenshot: 'results_page_success.png'
            };
        } else {
            console.log('⚠️ 結果画面が見つかりません。現在のページ状況を確認...');
            await page.screenshot({ path: 'final_page_state.png' });
            
            const currentUrl = page.url();
            const currentContent = await page.textContent('body');
            
            return {
                success: false,
                message: '30問は完了したが結果画面への遷移が確認できない',
                currentUrl: currentUrl,
                screenshot: 'final_page_state.png',
                contentPreview: currentContent.substring(0, 200)
            };
        }
        
    } catch (error) {
        console.error('❌ テスト実行中にエラー:', error);
        await page.screenshot({ path: 'test_error.png' });
        
        return {
            success: false,
            message: 'テスト実行エラー',
            error: error.message,
            screenshot: 'test_error.png'
        };
        
    } finally {
        await browser.close();
    }
}

// テスト実行
if (require.main === module) {
    run30QuestionTest().then(result => {
        console.log('\n🎯 テスト結果:', result);
        process.exit(result.success ? 0 : 1);
    });
}

module.exports = { run30QuestionTest };