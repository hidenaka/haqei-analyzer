/**
 * 表示ロジック競合の原因調査
 * 複数のシステムがどのように競合しているか特定
 */

import { chromium } from 'playwright';

async function investigateDisplayConflict() {
    console.log('🔍 表示ロジック競合の調査');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false
    });
    
    try {
        const page = await browser.newPage();
        
        // 全ての関数呼び出しを追跡
        const functionCalls = [];
        
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('display') || text.includes('scenario') || 
                text.includes('update') || text.includes('render')) {
                functionCalls.push({
                    type: msg.type(),
                    text: text,
                    time: Date.now()
                });
            }
        });
        
        console.log('📋 Step 1: 関数フックの設定');
        console.log('--------------------------------');
        
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle'
        });
        
        // 競合するシステムを監視
        await page.evaluate(() => {
            window.displayCalls = [];
            
            // 1. SafeDOMUpdaterの監視
            if (window.SafeDOMUpdater) {
                const original = SafeDOMUpdater.prototype.updateResultsContainer;
                SafeDOMUpdater.prototype.updateResultsContainer = function(analysisResult) {
                    console.log('🔵 [1] SafeDOMUpdater.updateResultsContainer called');
                    window.displayCalls.push({
                        system: 'SafeDOMUpdater',
                        method: 'updateResultsContainer',
                        time: Date.now(),
                        hasData: !!analysisResult,
                        dataKeys: analysisResult ? Object.keys(analysisResult) : []
                    });
                    return original.call(this, analysisResult);
                };
                
                const originalScenarios = SafeDOMUpdater.prototype.updateScenariosDisplay;
                SafeDOMUpdater.prototype.updateScenariosDisplay = function(container, analysisResult) {
                    console.log('🔵 [2] SafeDOMUpdater.updateScenariosDisplay called');
                    const scenarios = this.extractScenarios(analysisResult);
                    window.displayCalls.push({
                        system: 'SafeDOMUpdater',
                        method: 'updateScenariosDisplay',
                        time: Date.now(),
                        extractedScenarios: scenarios.length,
                        containerExists: !!container
                    });
                    return originalScenarios.call(this, container, analysisResult);
                };
                
                const originalExtract = SafeDOMUpdater.prototype.extractScenarios;
                SafeDOMUpdater.prototype.extractScenarios = function(analysisResult) {
                    const result = originalExtract.call(this, analysisResult);
                    console.log('🔵 [3] SafeDOMUpdater.extractScenarios:', result.length, 'scenarios');
                    window.displayCalls.push({
                        system: 'SafeDOMUpdater',
                        method: 'extractScenarios',
                        time: Date.now(),
                        scenariosFound: result.length,
                        sourceKeys: analysisResult ? Object.keys(analysisResult).filter(k => 
                            k.includes('scenario') || k.includes('path') || k.includes('eight')
                        ) : []
                    });
                    return result;
                };
            }
            
            // 2. binary-tree-complete-displayの監視
            if (window.displayBinaryTreeResults) {
                const original = window.displayBinaryTreeResults;
                window.displayBinaryTreeResults = function(result) {
                    console.log('🟢 [4] displayBinaryTreeResults called');
                    window.displayCalls.push({
                        system: 'BinaryTree',
                        method: 'displayBinaryTreeResults',
                        time: Date.now(),
                        hasResult: !!result,
                        hasFinalEightPaths: !!(result && result.finalEightPaths)
                    });
                    return original.call(this, result);
                };
            }
            
            // 3. future-simulator-coreの監視
            if (window.haqeiFutureSimulator) {
                if (window.haqeiFutureSimulator.displayAuthentic386Results) {
                    const original = window.haqeiFutureSimulator.displayAuthentic386Results;
                    window.haqeiFutureSimulator.displayAuthentic386Results = function(analysisResult) {
                        console.log('🟡 [5] haqeiFutureSimulator.displayAuthentic386Results called');
                        window.displayCalls.push({
                            system: 'FutureSimulator',
                            method: 'displayAuthentic386Results',
                            time: Date.now(),
                            hasAnalysisResult: !!analysisResult
                        });
                        return original.call(this, analysisResult);
                    };
                }
            }
            
            // 4. EightScenariosDisplayの監視
            if (window.EightScenariosDisplay) {
                const original = window.EightScenariosDisplay;
                window.EightScenariosDisplay = function(scenarios, container) {
                    console.log('🟠 [6] EightScenariosDisplay constructor called');
                    window.displayCalls.push({
                        system: 'EightScenariosDisplay',
                        method: 'constructor',
                        time: Date.now(),
                        scenariosCount: scenarios ? scenarios.length : 0,
                        containerProvided: !!container
                    });
                    return original.call(this, scenarios, container);
                };
            }
            
            console.log('✅ Display function hooks installed');
        });
        
        await page.waitForTimeout(1000);
        
        console.log('\n📋 Step 2: 分析実行と呼び出し追跡');
        console.log('--------------------------------');
        
        // 分析実行
        await page.fill('textarea', 'テスト入力');
        await page.evaluate(() => {
            const btn = document.querySelector('#aiGuessBtn');
            if (btn) {
                console.log('🚀 Starting analysis...');
                btn.click();
            }
        });
        
        await page.waitForTimeout(5000);
        
        console.log('\n📋 Step 3: 呼び出し順序の分析');
        console.log('--------------------------------');
        
        const calls = await page.evaluate(() => window.displayCalls || []);
        
        if (calls.length > 0) {
            console.log(`\n  検出された呼び出し: ${calls.length}件\n`);
            
            let lastTime = 0;
            calls.forEach((call, i) => {
                const timeDiff = lastTime > 0 ? call.time - lastTime : 0;
                console.log(`  ${i + 1}. [${call.system}] ${call.method}`);
                if (timeDiff > 0) {
                    console.log(`     (+${timeDiff}ms)`);
                }
                
                // 詳細情報
                if (call.dataKeys && call.dataKeys.length > 0) {
                    console.log(`     データキー: ${call.dataKeys.join(', ')}`);
                }
                if (call.extractedScenarios !== undefined) {
                    console.log(`     抽出シナリオ: ${call.extractedScenarios}個`);
                }
                if (call.scenariosFound !== undefined) {
                    console.log(`     発見シナリオ: ${call.scenariosFound}個`);
                }
                if (call.sourceKeys && call.sourceKeys.length > 0) {
                    console.log(`     ソースキー: ${call.sourceKeys.join(', ')}`);
                }
                if (call.hasFinalEightPaths !== undefined) {
                    console.log(`     finalEightPaths: ${call.hasFinalEightPaths ? '✅' : '❌'}`);
                }
                
                lastTime = call.time;
            });
        } else {
            console.log('  呼び出しが検出されませんでした');
        }
        
        console.log('\n📋 Step 4: データフローの追跡');
        console.log('--------------------------------');
        
        // どこでデータが失われているか確認
        const dataFlow = await page.evaluate(() => {
            // SafeDOMUpdaterの状態確認
            if (window.SafeDOMUpdater) {
                const updater = new window.SafeDOMUpdater();
                
                // テストデータで確認
                const testData1 = {
                    scenarios: [{ name: 'Test1' }]
                };
                const extracted1 = updater.extractScenarios(testData1);
                
                const testData2 = {
                    finalEightPaths: [{ name: 'Test2' }]
                };
                const extracted2 = updater.extractScenarios(testData2);
                
                const testData3 = {
                    eightScenarios: [{ name: 'Test3' }]
                };
                const extracted3 = updater.extractScenarios(testData3);
                
                return {
                    safeDOMUpdater: {
                        exists: true,
                        extractTest: {
                            scenarios: extracted1.length,
                            finalEightPaths: extracted2.length,
                            eightScenarios: extracted3.length
                        }
                    }
                };
            }
            
            return { safeDOMUpdater: { exists: false } };
        });
        
        console.log('\n  SafeDOMUpdater.extractScenarios テスト:');
        if (dataFlow.safeDOMUpdater.exists) {
            console.log(`    scenarios: ${dataFlow.safeDOMUpdater.extractTest.scenarios}個`);
            console.log(`    finalEightPaths: ${dataFlow.safeDOMUpdater.extractTest.finalEightPaths}個`);
            console.log(`    eightScenarios: ${dataFlow.safeDOMUpdater.extractTest.eightScenarios}個`);
        }
        
        console.log('\n📋 Step 5: DOM操作の競合確認');
        console.log('--------------------------------');
        
        const domState = await page.evaluate(() => {
            const resultsContainer = document.getElementById('resultsContainer');
            const eightContainer = document.getElementById('eight-scenarios-display-container');
            const scenariosGrid = document.getElementById('scenariosGrid');
            const scenarioCards = document.querySelectorAll('.scenario-card');
            
            // どこにカードがあるか
            const cardParents = {};
            scenarioCards.forEach(card => {
                const parentId = card.parentElement?.id || card.parentElement?.className || 'unknown';
                cardParents[parentId] = (cardParents[parentId] || 0) + 1;
            });
            
            return {
                resultsContainer: {
                    children: resultsContainer?.children.length || 0,
                    hasInnerHTML: resultsContainer?.innerHTML.length > 1000
                },
                eightContainer: {
                    exists: !!eightContainer,
                    children: eightContainer?.children.length || 0,
                    hasGrid: !!eightContainer?.querySelector('.scenarios-grid')
                },
                scenariosGrid: {
                    exists: !!scenariosGrid,
                    children: scenariosGrid?.children.length || 0
                },
                cards: {
                    total: scenarioCards.length,
                    locations: cardParents
                }
            };
        });
        
        console.log('\n  DOM状態:');
        console.log(`    resultsContainer: ${domState.resultsContainer.children}個の子要素`);
        console.log(`    eight-scenarios-display-container: ${domState.eightContainer.exists ? '✅' : '❌'}`);
        if (domState.eightContainer.exists) {
            console.log(`      - 子要素: ${domState.eightContainer.children}個`);
            console.log(`      - .scenarios-grid: ${domState.eightContainer.hasGrid ? '✅' : '❌'}`);
        }
        console.log(`    scenariosGrid: ${domState.scenariosGrid.exists ? '✅' : '❌'}`);
        if (domState.scenariosGrid.exists) {
            console.log(`      - 子要素: ${domState.scenariosGrid.children}個`);
        }
        console.log(`\n    シナリオカード配置:`);
        Object.entries(domState.cards.locations).forEach(([location, count]) => {
            console.log(`      ${location}: ${count}個`);
        });
        
        console.log('\n=====================================');
        console.log('📊 競合分析結果');
        console.log('=====================================\n');
        
        // 競合パターンの特定
        const conflicts = [];
        
        if (calls.some(c => c.system === 'SafeDOMUpdater') && 
            calls.some(c => c.system === 'BinaryTree')) {
            conflicts.push('SafeDOMUpdaterとBinaryTreeが両方実行されている');
        }
        
        if (domState.scenariosGrid.exists && domState.scenariosGrid.children > 0 &&
            domState.eightContainer.exists && domState.eightContainer.children === 0) {
            conflicts.push('カードがscenarioGridに作成され、eight-containerには反映されない');
        }
        
        const safeDOMCalls = calls.filter(c => c.system === 'SafeDOMUpdater');
        const noScenarios = safeDOMCalls.some(c => c.extractedScenarios === 0);
        if (noScenarios) {
            conflicts.push('SafeDOMUpdaterがシナリオデータを抽出できていない');
        }
        
        if (conflicts.length > 0) {
            console.log('🚨 発見された競合:');
            conflicts.forEach((conflict, i) => {
                console.log(`  ${i + 1}. ${conflict}`);
            });
        } else {
            console.log('✅ 明確な競合は検出されませんでした');
        }
        
        console.log('\n📝 推奨される解決策:');
        console.log('  1. BinaryTreeのカードをeight-containerに移動');
        console.log('  2. SafeDOMUpdaterのデータ取得を修正');
        console.log('  3. どちらか一方のシステムを無効化');
        
    } catch (error) {
        console.error('❌ エラー:', error.message);
    } finally {
        console.log('\n⏰ 10秒後にブラウザを閉じます...');
        await page.waitForTimeout(10000);
        await browser.close();
    }
}

// 実行
investigateDisplayConflict().catch(console.error);