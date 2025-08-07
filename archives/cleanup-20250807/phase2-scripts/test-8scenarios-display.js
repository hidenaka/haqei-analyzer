/**
 * 8シナリオ・Binary Tree表示検証スクリプト
 * 緊急修正後の動作確認用
 */

const puppeteer = require('puppeteer');

async function test8ScenariosDisplay() {
    console.log('🎯 8シナリオ・Binary Tree表示検証開始');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        devtools: true,
        defaultViewport: null
    });
    
    try {
        const page = await browser.newPage();
        
        // コンソールログ監視
        page.on('console', msg => {
            console.log('PAGE LOG:', msg.text());
        });
        
        // エラー監視
        page.on('pageerror', error => {
            console.error('PAGE ERROR:', error.message);
        });
        
        console.log('🌐 Future Simulatorページアクセス');
        await page.goto('http://localhost:8788/future_simulator.html', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        console.log('⏳ ページ読み込み完了待機');
        await page.waitForTimeout(3000);
        
        // テスト用入力文章を入力
        const testInput = 'テストケース: 仕事の方向性で迷っています。新しい挑戦をするか、現在の安定を続けるか、どちらが良いでしょうか？';
        
        console.log('📝 テスト入力文章設定');
        await page.type('#worryInput', testInput);
        await page.waitForTimeout(1000);
        
        console.log('🔍 分析ボタンクリック');
        const analysisButton = await page.$('#aiGuessBtn');
        if (analysisButton) {
            await analysisButton.click();
        }
        
        console.log('⏳ 分析処理完了待機 (30秒)');
        await page.waitForTimeout(30000);
        
        // 結果表示の確認
        console.log('🔍 結果要素確認開始');
        
        const resultElements = await page.evaluate(() => {
            const results = {
                // 8シナリオ関連要素
                scenariosContainer: !!document.querySelector('.scenarios-grid, #scenarios-container, .scenarios-section'),
                scenarioCards: document.querySelectorAll('.scenario-card, .scenario-item').length,
                scenariosTitle: !!document.querySelector('h3:contains("8つの"), h3:contains("シナリオ")'),
                
                // Binary Tree関連要素
                binaryTreeContainer: !!document.querySelector('.binary-tree-container, #binary-tree-container, .binary-tree-section'),
                binaryTreeVisualization: !!document.querySelector('.binary-tree-visualization, .tree-structure'),
                binaryTreeTitle: !!document.querySelector('h3:contains("二分木"), h3:contains("分岐")'),
                
                // 統合表示関連
                resultsContainer: !!document.querySelector('.haqei-results-container, #future-analysis-results'),
                integrationSection: !!document.querySelector('.integration-section, .haqei-integration'),
                
                // 全体的な結果表示
                resultArea: !!document.querySelector('#resultArea, .result-area, #results-section'),
                anyResults: document.querySelectorAll('[class*="result"], [id*="result"]').length,
                
                // エラー要素確認
                errorElements: document.querySelectorAll('[class*="error"]').length,
                
                // JavaScriptエラー確認
                consoleErrors: window.haqeiConsoleErrors || []
            };
            
            return results;
        });
        
        console.log('📊 結果要素確認完了:', JSON.stringify(resultElements, null, 2));
        
        // スクリーンショット撮影
        const screenshot = await page.screenshot({
            fullPage: true,
            path: `8scenarios-binary-tree-verification-${Date.now()}.png`
        });
        
        console.log('📸 スクリーンショット保存完了');
        
        // 検証結果レポート
        const verificationResult = {
            timestamp: new Date().toISOString(),
            testInput: testInput,
            elements: resultElements,
            
            // 成功判定
            success: {
                scenarios: resultElements.scenarioCards > 0 || resultElements.scenariosContainer,
                binaryTree: resultElements.binaryTreeContainer || resultElements.binaryTreeVisualization,
                integration: resultElements.integrationSection,
                overall: (resultElements.scenarioCards > 0 || resultElements.scenariosContainer) &&
                        (resultElements.binaryTreeContainer || resultElements.binaryTreeVisualization)
            },
            
            // 問題指摘
            issues: {
                noScenarios: resultElements.scenarioCards === 0 && !resultElements.scenariosContainer,
                noBinaryTree: !resultElements.binaryTreeContainer && !resultElements.binaryTreeVisualization,
                noResults: resultElements.anyResults === 0,
                hasErrors: resultElements.errorElements > 0
            }
        };
        
        console.log('🎯 検証結果レポート:');
        console.log(JSON.stringify(verificationResult, null, 2));
        
        // ファイルに検証結果保存
        require('fs').writeFileSync(
            'verification-result-8scenarios.json',
            JSON.stringify(verificationResult, null, 2)
        );
        
        // 成功・失敗判定
        if (verificationResult.success.overall) {
            console.log('✅ 8シナリオ・Binary Tree表示検証: 成功');
        } else {
            console.log('❌ 8シナリオ・Binary Tree表示検証: 失敗');
            console.log('問題:', verificationResult.issues);
        }
        
        // ブラウザを5秒間開いたままにして手動確認可能にする
        console.log('👀 5秒間手動確認タイム...');
        await page.waitForTimeout(5000);
        
        return verificationResult;
        
    } catch (error) {
        console.error('❌ 検証エラー:', error);
        return { success: false, error: error.message };
    } finally {
        await browser.close();
    }
}

// 実行
test8ScenariosDisplay()
    .then(result => {
        console.log('🏁 検証完了');
        process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
        console.error('💥 検証実行エラー:', error);
        process.exit(1);
    });