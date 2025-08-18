/**
 * スコアグラフ表示テスト（RED→GREEN確認）
 * 期待される動作：分析後にスコアグラフとCanvas要素が表示される
 */

import { chromium } from 'playwright';

async function testScoreGraph() {
    console.log('📊 スコアグラフ表示テスト');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        
        // コンソールエラーをキャッチ
        const jsErrors = [];
        const consoleMessages = [];
        
        page.on('console', msg => {
            consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
            if (msg.type() === 'error') {
                jsErrors.push(msg.text());
            }
        });
        
        page.on('pageerror', error => {
            jsErrors.push(`Page Error: ${error.message}`);
        });
        
        console.log('🌐 Step 1: ページアクセスとJavaScript読み込み確認');
        console.log('--------------------------------');
        
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        
        await page.waitForTimeout(2000);
        
        // JavaScript読み込み状況確認
        const jsLoadStatus = await page.evaluate(() => {
            return {
                ScoreVisualization: typeof window.ScoreVisualization !== 'undefined',
                EightScenariosDisplay: typeof window.EightScenariosDisplay !== 'undefined',
                haqeiScenariosGenerator: typeof window.haqeiScenariosGenerator !== 'undefined',
                H384_DATA: typeof window.H384_DATA !== 'undefined' && Array.isArray(window.H384_DATA),
                H384DataLength: window.H384_DATA ? window.H384_DATA.length : 0
            };
        });
        
        console.log('JavaScript読み込み状況:');
        console.log(`  ScoreVisualization: ${jsLoadStatus.ScoreVisualization ? '✅' : '❌'}`);
        console.log(`  EightScenariosDisplay: ${jsLoadStatus.EightScenariosDisplay ? '✅' : '❌'}`);
        console.log(`  haqeiScenariosGenerator: ${jsLoadStatus.haqeiScenariosGenerator ? '✅' : '❌'}`);
        console.log(`  H384_DATA: ${jsLoadStatus.H384_DATA ? '✅' : '❌'} (${jsLoadStatus.H384DataLength}件)`);
        
        if (jsErrors.length > 0) {
            console.log('\n❌ JavaScript エラー:');
            jsErrors.forEach(error => console.log(`  • ${error}`));
        } else {
            console.log('\n✅ JavaScript エラーなし');
        }
        
        console.log('\n🔍 Step 2: 分析実行とスコアグラフ生成テスト');
        console.log('--------------------------------');
        
        // テスト入力
        const testInput = '転職を検討中。現在の職場は安定しているが成長機会が少ない。新しい環境でのスキルアップと、現在の安定性のどちらを優先するか判断が必要。';
        
        await page.fill('textarea, #worryInput, #situation-text', testInput);
        console.log('✅ テスト入力完了');
        
        // 分析実行
        const analysisStartTime = Date.now();
        await page.click('button[type="submit"], .analyze-btn, #aiGuessBtn');
        console.log('🔄 分析実行');
        
        // 結果表示を待機
        try {
            // より詳細な待機条件
            await page.waitForFunction(() => {
                // スコアグラフ関連要素の確認
                const scoreChart = document.querySelector('.score-comparison-chart, .score-visualization, canvas');
                const scenarioCards = document.querySelectorAll('.scenario-card, [class*="scenario"]');
                
                // 分析完了の兆候
                const hasResults = scoreChart || scenarioCards.length > 0;
                const hasError = document.body.textContent.includes('エラーが発生');
                
                return hasResults || hasError;
            }, { timeout: 15000 });
            
            const analysisTime = Date.now() - analysisStartTime;
            console.log(`⏱️ 分析完了: ${(analysisTime/1000).toFixed(1)}秒`);
            
            await page.waitForTimeout(2000);
            
            // 結果の詳細分析
            const results = await page.evaluate(() => {
                // スコアグラフ要素の詳細確認
                const scoreChartSelectors = [
                    '.score-comparison-chart',
                    '.score-visualization', 
                    '.score-distribution',
                    'canvas',
                    '[id*="score"]',
                    '[class*="score"]'
                ];
                
                let scoreElement = null;
                let scoreSelector = '';
                
                for (const selector of scoreChartSelectors) {
                    const element = document.querySelector(selector);
                    if (element) {
                        scoreElement = element;
                        scoreSelector = selector;
                        break;
                    }
                }
                
                // Canvas要素の確認
                const allCanvas = document.querySelectorAll('canvas');
                const canvasDetails = Array.from(allCanvas).map(canvas => ({
                    width: canvas.width,
                    height: canvas.height,
                    style: canvas.style.cssText,
                    parent: canvas.parentElement?.className || 'no-parent'
                }));
                
                // シナリオカードの確認
                const scenarioCards = document.querySelectorAll('.scenario-card, [class*="scenario"], [class*="card"]');
                const cardDetails = Array.from(scenarioCards).slice(0, 5).map(card => ({
                    className: card.className,
                    text: card.textContent?.substring(0, 50) + '...',
                    hasTitle: !!card.querySelector('[class*="title"], h3, h4')
                }));
                
                // エラーメッセージの確認
                const hasError = document.body.textContent.includes('エラーが発生') || 
                                document.body.textContent.includes('分析中にエラー');
                
                // H384データベース参照の確認
                const hasH384Reference = document.body.textContent.includes('H384') || 
                                       document.body.textContent.includes('384');
                
                return {
                    scoreGraph: {
                        found: !!scoreElement,
                        selector: scoreSelector,
                        element: scoreElement ? {
                            tagName: scoreElement.tagName,
                            className: scoreElement.className,
                            id: scoreElement.id
                        } : null
                    },
                    canvas: {
                        count: allCanvas.length,
                        details: canvasDetails
                    },
                    scenarios: {
                        count: scenarioCards.length,
                        details: cardDetails
                    },
                    hasError,
                    hasH384Reference,
                    analysisCompleted: window.futureAnalysisCompleted || false
                };
            });
            
            console.log('\n📈 結果分析:');
            console.log('--------------------------------');
            
            // スコアグラフ評価
            if (results.scoreGraph.found) {
                console.log(`✅ スコアグラフ要素発見: ${results.scoreGraph.selector}`);
                console.log(`   タグ: ${results.scoreGraph.element.tagName}`);
                console.log(`   クラス: "${results.scoreGraph.element.className}"`);
            } else {
                console.log('❌ スコアグラフ要素が見つからない');
            }
            
            // Canvas評価
            console.log(`Canvas要素: ${results.canvas.count}個`);
            if (results.canvas.count > 0) {
                results.canvas.details.forEach((canvas, i) => {
                    console.log(`  Canvas${i+1}: ${canvas.width}×${canvas.height}px, 親:${canvas.parent}`);
                });
            }
            
            // シナリオカード評価
            console.log(`シナリオカード: ${results.scenarios.count}個`);
            if (results.scenarios.count !== 8) {
                console.log(`⚠️ 期待値8個と異なる: ${results.scenarios.count}個`);
            }
            
            // H384データベース参照
            console.log(`H384データベース参照: ${results.hasH384Reference ? '✅' : '❌'}`);
            
            // エラー確認
            if (results.hasError) {
                console.log('❌ 分析エラーが発生している');
            }
            
            // 分析完了フラグ
            console.log(`分析完了フラグ: ${results.analysisCompleted ? '✅' : '❌'}`);
            
        } catch (error) {
            console.log('❌ 分析結果の表示でタイムアウト');
            console.log('   15秒以内に期待される要素が表示されなかった');
        }
        
        // 最新のJavaScriptエラー確認
        if (jsErrors.length > 0) {
            console.log('\n🚨 発生したJavaScriptエラー:');
            jsErrors.forEach((error, i) => {
                console.log(`${i+1}. ${error}`);
            });
        }
        
        // コンソールメッセージから重要な情報を抽出
        const importantMessages = consoleMessages.filter(msg => 
            msg.includes('score') || 
            msg.includes('H384') || 
            msg.includes('scenario') ||
            msg.includes('error') ||
            msg.includes('failed')
        );
        
        if (importantMessages.length > 0) {
            console.log('\n📝 重要なコンソールメッセージ:');
            importantMessages.slice(-10).forEach(msg => {
                console.log(`  ${msg}`);
            });
        }
        
        // スクリーンショット
        await page.screenshot({ 
            path: '20250814_score_graph_debug.png',
            fullPage: false
        });
        
        console.log('\n📸 デバッグスクリーンショット保存');
        
        return results;
        
    } catch (error) {
        console.error('❌ テストエラー:', error);
        return null;
    } finally {
        console.log('\n⏱️ 10秒間画面確認...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        await browser.close();
    }
}

// 実行
testScoreGraph().then(result => {
    console.log('\n=====================================');
    console.log('📊 スコアグラフテスト完了');
    console.log('=====================================');
    
    if (result) {
        let score = 0;
        let maxScore = 100;
        
        // 評価
        if (result.scoreGraph.found) score += 40;
        if (result.canvas.count > 0) score += 30;
        if (result.scenarios.count >= 6) score += 20;
        if (result.hasH384Reference) score += 10;
        
        console.log(`\n最終スコア: ${score}/${maxScore}点`);
        
        if (score >= 80) {
            console.log('✅ スコアグラフ正常動作');
        } else if (score >= 40) {
            console.log('⚠️ 部分的動作 - 改善が必要');
        } else {
            console.log('❌ スコアグラフ非表示 - 修正が必要');
            
            console.log('\n🔧 推奨される調査項目:');
            console.log('1. ScriptタグでのJavaScript読み込み順序');
            console.log('2. H384データベースの非同期読み込み');
            console.log('3. Canvas生成タイミング');
            console.log('4. EightScenariosDisplay初期化');
        }
    }
}).catch(console.error);