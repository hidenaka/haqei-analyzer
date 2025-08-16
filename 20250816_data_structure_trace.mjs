/**
 * 実際のデータ構造を詳細に追跡
 */

import { chromium } from 'playwright';

async function traceDataStructure() {
    console.log('🔍 データ構造の詳細追跡');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false
    });
    
    try {
        const page = await browser.newPage();
        
        // 詳細なログ記録
        const detailedLogs = [];
        page.on('console', msg => {
            const text = msg.text();
            detailedLogs.push({
                type: msg.type(),
                text: text,
                time: Date.now()
            });
        });
        
        console.log('📋 Step 1: ページ読み込みとインターセプト設定');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle'
        });
        
        // データフローをインターセプト
        await page.evaluate(() => {
            window.dataFlowTrace = [];
            
            // 1. SafeDOMUpdaterのupdateResultsContainerをインターセプト
            if (window.SafeDOMUpdater) {
                const original = SafeDOMUpdater.prototype.updateResultsContainer;
                SafeDOMUpdater.prototype.updateResultsContainer = function(analysisResult) {
                    console.log('🔵 SafeDOMUpdater.updateResultsContainer called');
                    
                    // analysisResultの構造を記録
                    window.dataFlowTrace.push({
                        method: 'SafeDOMUpdater.updateResultsContainer',
                        dataKeys: analysisResult ? Object.keys(analysisResult) : [],
                        hasScenarios: !!(analysisResult?.scenarios),
                        hasFinalEightPaths: !!(analysisResult?.finalEightPaths),
                        hasEightScenarios: !!(analysisResult?.eightScenarios),
                        scenariosLength: analysisResult?.scenarios?.length || 0,
                        finalEightPathsLength: analysisResult?.finalEightPaths?.length || 0,
                        eightScenariosLength: analysisResult?.eightScenarios?.length || 0,
                        sampleData: analysisResult?.scenarios?.[0] || 
                                   analysisResult?.finalEightPaths?.[0] || 
                                   analysisResult?.eightScenarios?.[0] || null
                    });
                    
                    return original.call(this, analysisResult);
                };
            }
            
            // 2. displayBinaryTreeResultsをインターセプト
            if (window.displayBinaryTreeResults) {
                const original = window.displayBinaryTreeResults;
                window.displayBinaryTreeResults = function(result) {
                    console.log('🟢 displayBinaryTreeResults called');
                    
                    window.dataFlowTrace.push({
                        method: 'displayBinaryTreeResults',
                        dataKeys: result ? Object.keys(result) : [],
                        hasFinalEightPaths: !!(result?.finalEightPaths),
                        finalEightPathsLength: result?.finalEightPaths?.length || 0,
                        samplePath: result?.finalEightPaths?.[0] || null
                    });
                    
                    return original.call(this, result);
                };
            }
            
            // 3. future-simulator-coreのdisplayAuthentic386Resultsをインターセプト
            if (window.haqeiFutureSimulator?.displayAuthentic386Results) {
                const original = window.haqeiFutureSimulator.displayAuthentic386Results;
                window.haqeiFutureSimulator.displayAuthentic386Results = function(analysisResult) {
                    console.log('🟡 displayAuthentic386Results called');
                    
                    window.dataFlowTrace.push({
                        method: 'displayAuthentic386Results',
                        dataKeys: analysisResult ? Object.keys(analysisResult) : [],
                        hasChartData: !!(analysisResult?.chartData),
                        hasScenarios: !!(analysisResult?.scenarios),
                        hasAuthentic386Analysis: !!(analysisResult?.authentic386Analysis),
                        sampleData: analysisResult
                    });
                    
                    return original.call(this, analysisResult);
                };
            }
            
            console.log('✅ Data flow interceptors installed');
        });
        
        await page.waitForTimeout(1000);
        
        console.log('\n📋 Step 2: 分析実行');
        
        await page.fill('textarea', '新しいプロジェクトを検討中');
        await page.evaluate(() => {
            const btn = document.querySelector('#aiGuessBtn');
            if (btn) {
                console.log('🚀 Starting analysis...');
                btn.click();
            }
        });
        
        await page.waitForTimeout(5000);
        
        console.log('\n📋 Step 3: データフローの分析');
        console.log('--------------------------------');
        
        const traces = await page.evaluate(() => window.dataFlowTrace || []);
        
        if (traces.length > 0) {
            console.log(`\n  キャプチャされたデータフロー: ${traces.length}件\n`);
            
            traces.forEach((trace, i) => {
                console.log(`  ${i + 1}. ${trace.method}`);
                console.log(`     データキー: ${trace.dataKeys.join(', ')}`);
                
                if (trace.hasScenarios !== undefined) {
                    console.log(`     scenarios: ${trace.hasScenarios ? `✅ (${trace.scenariosLength}個)` : '❌'}`);
                }
                if (trace.hasFinalEightPaths !== undefined) {
                    console.log(`     finalEightPaths: ${trace.hasFinalEightPaths ? `✅ (${trace.finalEightPathsLength}個)` : '❌'}`);
                }
                if (trace.hasEightScenarios !== undefined) {
                    console.log(`     eightScenarios: ${trace.hasEightScenarios ? `✅ (${trace.eightScenariosLength}個)` : '❌'}`);
                }
                
                if (trace.sampleData) {
                    console.log(`     サンプルデータ構造:`);
                    if (typeof trace.sampleData === 'object') {
                        const keys = Object.keys(trace.sampleData).slice(0, 5);
                        console.log(`       キー: ${keys.join(', ')}`);
                    }
                }
                console.log('');
            });
        } else {
            console.log('  データフローがキャプチャされませんでした');
        }
        
        console.log('\n📋 Step 4: 実際のDOMとデータの関係');
        
        const domDataRelation = await page.evaluate(() => {
            const eightContainer = document.getElementById('eight-scenarios-display-container');
            const scenarioCards = document.querySelectorAll('.scenario-card');
            const resultsContainer = document.getElementById('resultsContainer');
            
            // localStorage内のデータも確認
            const storageKeys = Object.keys(localStorage).filter(k => 
                k.includes('analysis') || k.includes('scenario') || k.includes('future')
            );
            
            // window内のデータも確認
            const windowData = {
                hasLastAnalysisResult: typeof window.lastAnalysisResult !== 'undefined',
                lastAnalysisResultKeys: window.lastAnalysisResult ? Object.keys(window.lastAnalysisResult) : [],
                hasCurrentDisplayData: typeof window.currentDisplayData !== 'undefined',
                currentDisplayDataKeys: window.currentDisplayData ? Object.keys(window.currentDisplayData) : []
            };
            
            return {
                dom: {
                    eightContainerExists: !!eightContainer,
                    eightContainerChildren: eightContainer?.children.length || 0,
                    scenarioCardsTotal: scenarioCards.length,
                    resultsContainerChildren: resultsContainer?.children.length || 0
                },
                storage: {
                    relevantKeys: storageKeys,
                    hasData: storageKeys.length > 0
                },
                window: windowData
            };
        });
        
        console.log('\n  DOM状態:');
        console.log(`    eight-scenarios-display-container: ${domDataRelation.dom.eightContainerExists ? '✅' : '❌'}`);
        console.log(`    - 子要素: ${domDataRelation.dom.eightContainerChildren}個`);
        console.log(`    シナリオカード総数: ${domDataRelation.dom.scenarioCardsTotal}個`);
        console.log(`    resultsContainer子要素: ${domDataRelation.dom.resultsContainerChildren}個`);
        
        console.log('\n  データ状態:');
        if (domDataRelation.storage.hasData) {
            console.log(`    localStorage キー: ${domDataRelation.storage.relevantKeys.join(', ')}`);
        }
        if (domDataRelation.window.hasLastAnalysisResult) {
            console.log(`    window.lastAnalysisResult キー: ${domDataRelation.window.lastAnalysisResultKeys.join(', ')}`);
        }
        if (domDataRelation.window.hasCurrentDisplayData) {
            console.log(`    window.currentDisplayData キー: ${domDataRelation.window.currentDisplayDataKeys.join(', ')}`);
        }
        
        console.log('\n=====================================');
        console.log('📊 診断結果');
        console.log('=====================================\n');
        
        // 問題の特定
        const problems = [];
        const safeDOMTrace = traces.find(t => t.method === 'SafeDOMUpdater.updateResultsContainer');
        const binaryTrace = traces.find(t => t.method === 'displayBinaryTreeResults');
        
        if (safeDOMTrace) {
            if (!safeDOMTrace.hasScenarios && !safeDOMTrace.hasFinalEightPaths && !safeDOMTrace.hasEightScenarios) {
                problems.push('SafeDOMUpdaterに渡されるデータにシナリオ情報が含まれていない');
            }
        }
        
        if (binaryTrace && binaryTrace.hasFinalEightPaths && binaryTrace.finalEightPathsLength > 0) {
            problems.push('displayBinaryTreeResultsがfinalEightPathsを持っているが、SafeDOMUpdaterに渡されていない可能性');
        }
        
        if (domDataRelation.dom.scenarioCardsTotal === 0 && traces.length > 0) {
            problems.push('データは処理されたがカードが作成されていない');
        }
        
        if (problems.length > 0) {
            console.log('🚨 発見された問題:');
            problems.forEach((problem, i) => {
                console.log(`  ${i + 1}. ${problem}`);
            });
            
            console.log('\n📝 推奨される修正:');
            console.log('  1. future-simulator-core.jsでSafeDOMUpdaterに渡すデータ構造を確認');
            console.log('  2. displayBinaryTreeResultsのデータをSafeDOMUpdaterでも利用できるように統合');
            console.log('  3. extractScenariosメソッドでfinalEightPathsの構造に対応');
        } else {
            console.log('✅ データフローは正常に見えます');
        }
        
    } catch (error) {
        console.error('❌ エラー:', error.message);
    } finally {
        console.log('\n⏰ 10秒後にブラウザを閉じます...');
        await page.waitForTimeout(10000);
        await browser.close();
    }
}

// 実行
traceDataStructure().catch(console.error);