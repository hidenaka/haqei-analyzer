/**
 * シナリオカード未表示問題の調査
 * 複雑な表示ロジックの問題を特定
 */

import { chromium } from 'playwright';

async function investigateScenarioCards() {
    console.log('🔍 シナリオカード表示問題調査');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false
    });
    
    try {
        const page = await browser.newPage();
        
        // コンソールログを監視
        const logs = [];
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('scenario') || text.includes('card') || 
                text.includes('SafeDOMUpdater') || text.includes('display')) {
                logs.push({
                    type: msg.type(),
                    text: text
                });
                console.log(`  📝 ${msg.type()}: ${text}`);
            }
        });
        
        // エラーを監視
        page.on('pageerror', error => {
            console.log(`  ❌ Page error: ${error.message}`);
        });
        
        console.log('📋 Step 1: 初期状態の確認');
        console.log('--------------------------------');
        
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle'
        });
        
        await page.waitForTimeout(2000);
        
        // DOM構造を確認
        const initialDOM = await page.evaluate(() => {
            const resultsContainer = document.getElementById('resultsContainer');
            const eightScenariosContainer = document.getElementById('eight-scenarios-display-container');
            const scenariosCards = document.getElementById('scenarios-cards');
            
            return {
                resultsContainer: {
                    exists: !!resultsContainer,
                    display: resultsContainer ? window.getComputedStyle(resultsContainer).display : null,
                    children: resultsContainer ? resultsContainer.children.length : 0
                },
                eightScenariosContainer: {
                    exists: !!eightScenariosContainer,
                    display: eightScenariosContainer ? window.getComputedStyle(eightScenariosContainer).display : null,
                    innerHTML: eightScenariosContainer ? eightScenariosContainer.innerHTML.substring(0, 200) : null
                },
                scenariosCards: {
                    exists: !!scenariosCards,
                    children: scenariosCards ? scenariosCards.children.length : 0
                }
            };
        });
        
        console.log('\n  DOM構造:');
        console.log(`    resultsContainer: ${initialDOM.resultsContainer.exists ? '✅' : '❌'}`);
        console.log(`      - display: ${initialDOM.resultsContainer.display}`);
        console.log(`      - 子要素: ${initialDOM.resultsContainer.children}個`);
        console.log(`    eight-scenarios-display-container: ${initialDOM.eightScenariosContainer.exists ? '✅' : '❌'}`);
        console.log(`      - display: ${initialDOM.eightScenariosContainer.display}`);
        console.log(`    scenarios-cards: ${initialDOM.scenariosCards.exists ? '✅' : '❌'}`);
        
        console.log('\n📋 Step 2: 分析実行と関数呼び出しの追跡');
        console.log('--------------------------------');
        
        // 関数呼び出しを追跡
        await page.evaluate(() => {
            // SafeDOMUpdaterのメソッドを監視
            if (window.SafeDOMUpdater) {
                const originalUpdate = SafeDOMUpdater.prototype.updateResultsContainer;
                SafeDOMUpdater.prototype.updateResultsContainer = function(analysisResult) {
                    console.log('🔄 SafeDOMUpdater.updateResultsContainer called');
                    console.log('  Analysis result keys:', Object.keys(analysisResult || {}));
                    const result = originalUpdate.call(this, analysisResult);
                    console.log('  Return value:', result);
                    return result;
                };
                
                const originalScenarios = SafeDOMUpdater.prototype.updateScenariosDisplay;
                SafeDOMUpdater.prototype.updateScenariosDisplay = function(container, analysisResult) {
                    console.log('🎯 SafeDOMUpdater.updateScenariosDisplay called');
                    const scenarios = this.extractScenarios(analysisResult);
                    console.log('  Extracted scenarios:', scenarios.length);
                    return originalScenarios.call(this, container, analysisResult);
                };
            }
            
            // future-simulator-coreの動作を監視
            if (window.haqeiFutureSimulator) {
                console.log('✅ haqeiFutureSimulator exists');
            } else {
                console.log('❌ haqeiFutureSimulator not found');
            }
        });
        
        // 分析実行
        await page.fill('textarea', '転職を検討中。新しい挑戦をしたい。');
        
        await page.evaluate(() => {
            const btn = document.querySelector('#aiGuessBtn');
            if (btn) {
                console.log('🚀 Clicking analyze button...');
                btn.click();
            }
        });
        
        await page.waitForTimeout(5000);
        
        console.log('\n📋 Step 3: 分析後のDOM状態確認');
        console.log('--------------------------------');
        
        // 分析後のDOM状態
        const afterDOM = await page.evaluate(() => {
            const resultsContainer = document.getElementById('resultsContainer');
            const eightScenariosContainer = document.getElementById('eight-scenarios-display-container');
            const scenariosCards = document.getElementById('scenarios-cards');
            const scenarioCards = document.querySelectorAll('.scenario-card');
            
            // どこにカードが配置されているか確認
            let cardLocations = [];
            scenarioCards.forEach(card => {
                let parent = card.parentElement;
                let location = [];
                while (parent && parent !== document.body) {
                    if (parent.id) {
                        location.push(`#${parent.id}`);
                    } else if (parent.className) {
                        location.push(`.${parent.className.split(' ')[0]}`);
                    }
                    parent = parent.parentElement;
                }
                cardLocations.push(location.reverse().join(' > '));
            });
            
            return {
                resultsContainer: {
                    display: resultsContainer ? window.getComputedStyle(resultsContainer).display : null,
                    visible: resultsContainer ? resultsContainer.style.display !== 'none' : false
                },
                eightScenariosContainer: {
                    exists: !!eightScenariosContainer,
                    display: eightScenariosContainer ? window.getComputedStyle(eightScenariosContainer).display : null,
                    children: eightScenariosContainer ? eightScenariosContainer.children.length : 0,
                    hasGrid: eightScenariosContainer ? !!eightScenariosContainer.querySelector('.scenarios-grid') : false
                },
                scenariosCards: {
                    exists: !!scenariosCards,
                    children: scenariosCards ? scenariosCards.children.length : 0
                },
                scenarioCards: {
                    count: scenarioCards.length,
                    locations: cardLocations
                }
            };
        });
        
        console.log('\n  分析後のDOM:');
        console.log(`    resultsContainer表示: ${afterDOM.resultsContainer.display}`);
        console.log(`    eight-scenarios-display-container:`);
        console.log(`      - 存在: ${afterDOM.eightScenariosContainer.exists ? '✅' : '❌'}`);
        console.log(`      - display: ${afterDOM.eightScenariosContainer.display}`);
        console.log(`      - 子要素: ${afterDOM.eightScenariosContainer.children}個`);
        console.log(`      - .scenarios-grid: ${afterDOM.eightScenariosContainer.hasGrid ? '✅' : '❌'}`);
        console.log(`    シナリオカード: ${afterDOM.scenarioCards.count}個`);
        
        if (afterDOM.scenarioCards.count > 0) {
            console.log('    カードの配置場所:');
            afterDOM.scenarioCards.locations.forEach((loc, i) => {
                console.log(`      ${i + 1}. ${loc}`);
            });
        }
        
        console.log('\n📋 Step 4: データフローの追跡');
        console.log('--------------------------------');
        
        // 分析結果のデータ構造を確認
        const dataFlow = await page.evaluate(() => {
            // グローバル変数から分析結果を探す
            const possibleResults = [];
            
            // よくある変数名
            const varNames = ['analysisResult', 'lastAnalysisResult', 'currentResult', 'globalAnalysisResult'];
            varNames.forEach(name => {
                if (window[name]) {
                    possibleResults.push({
                        name: name,
                        keys: Object.keys(window[name]),
                        hasScenarios: !!(window[name].scenarios || window[name].finalEightPaths || window[name].eightScenarios)
                    });
                }
            });
            
            // localStorageも確認
            const storageKeys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.includes('analysis') || key.includes('result') || key.includes('scenario')) {
                    storageKeys.push(key);
                }
            }
            
            return {
                globalVars: possibleResults,
                storageKeys: storageKeys
            };
        });
        
        console.log('  グローバル変数:');
        if (dataFlow.globalVars.length > 0) {
            dataFlow.globalVars.forEach(v => {
                console.log(`    ${v.name}: ${v.hasScenarios ? '✅ シナリオあり' : '❌ シナリオなし'}`);
                console.log(`      keys: ${v.keys.slice(0, 5).join(', ')}...`);
            });
        } else {
            console.log('    分析結果のグローバル変数が見つかりません');
        }
        
        if (dataFlow.storageKeys.length > 0) {
            console.log('\n  localStorage:');
            dataFlow.storageKeys.forEach(key => {
                console.log(`    - ${key}`);
            });
        }
        
        console.log('\n📋 Step 5: SafeDOMUpdaterの動作確認');
        console.log('--------------------------------');
        
        // SafeDOMUpdaterのメソッドを直接テスト
        const testResult = await page.evaluate(() => {
            if (!window.SafeDOMUpdater) {
                return { error: 'SafeDOMUpdater not found' };
            }
            
            const updater = new window.SafeDOMUpdater();
            
            // テストデータ
            const testData = {
                scenarios: [
                    { name: 'テスト1', description: '説明1', score: 80 },
                    { name: 'テスト2', description: '説明2', score: 70 },
                    { name: 'テスト3', description: '説明3', score: 60 },
                    { name: 'テスト4', description: '説明4', score: 50 },
                    { name: 'テスト5', description: '説明5', score: 40 },
                    { name: 'テスト6', description: '説明6', score: 30 },
                    { name: 'テスト7', description: '説明7', score: 20 },
                    { name: 'テスト8', description: '説明8', score: 10 }
                ]
            };
            
            // extractScenariosをテスト
            const extracted = updater.extractScenarios(testData);
            
            // updateResultsContainerを手動実行
            const updateResult = updater.updateResultsContainer(testData);
            
            // 結果確認
            const cards = document.querySelectorAll('.scenario-card');
            
            return {
                extractedCount: extracted.length,
                updateResult: updateResult,
                cardsAfterUpdate: cards.length,
                containerExists: !!document.getElementById('eight-scenarios-display-container')
            };
        });
        
        console.log('  SafeDOMUpdaterテスト:');
        console.log(`    抽出されたシナリオ: ${testResult.extractedCount}個`);
        console.log(`    updateResultsContainer: ${testResult.updateResult ? '✅' : '❌'}`);
        console.log(`    更新後のカード数: ${testResult.cardsAfterUpdate}個`);
        console.log(`    Container存在: ${testResult.containerExists ? '✅' : '❌'}`);
        
        console.log('\n=====================================');
        console.log('📊 診断結果');
        console.log('=====================================\n');
        
        const issues = [];
        
        if (afterDOM.scenarioCards.count === 0) {
            issues.push('シナリオカードが全く作成されていない');
        }
        
        if (!afterDOM.eightScenariosContainer.hasGrid) {
            issues.push('.scenarios-gridが作成されていない');
        }
        
        if (testResult.cardsAfterUpdate === 0) {
            issues.push('SafeDOMUpdaterのカード作成が機能していない');
        }
        
        if (dataFlow.globalVars.length === 0) {
            issues.push('分析結果がグローバル変数に保存されていない');
        }
        
        if (issues.length > 0) {
            console.log('🚨 発見された問題:');
            issues.forEach((issue, i) => {
                console.log(`  ${i + 1}. ${issue}`);
            });
        } else {
            console.log('✅ 主要な問題は見つかりませんでした');
        }
        
        console.log('\n📝 推奨される対応:');
        console.log('  1. SafeDOMUpdater.updateScenariosDisplayの実装確認');
        console.log('  2. extractScenariosメソッドのデータ取得確認');
        console.log('  3. future-simulator-coreとの連携確認');
        
    } catch (error) {
        console.error('❌ エラー:', error.message);
    } finally {
        console.log('\n⏰ 10秒後にブラウザを閉じます...');
        await page.waitForTimeout(10000);
        await browser.close();
    }
}

// 実行
investigateScenarioCards().catch(console.error);