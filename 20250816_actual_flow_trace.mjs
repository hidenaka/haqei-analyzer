/**
 * 実際の実行フローを追跡
 */

import { chromium } from 'playwright';

async function traceActualFlow() {
    console.log('🔍 実際の実行フロー追跡');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false
    });
    
    try {
        const page = await browser.newPage();
        
        // コンソールログを全て記録
        const logs = [];
        page.on('console', msg => {
            const text = msg.text();
            logs.push({
                type: msg.type(),
                text: text,
                time: Date.now()
            });
            
            // 重要なログは表示
            if (text.includes('SafeDOMUpdater') || 
                text.includes('displayAuthentic386Results') ||
                text.includes('displayBinaryTreeResults') ||
                text.includes('scenario') ||
                text.includes('Results displayed')) {
                console.log(`  📝 ${text}`);
            }
        });
        
        console.log('📋 Step 1: ページ読み込み');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle'
        });
        
        await page.waitForTimeout(1000);
        
        // 初期状態確認
        const initial = await page.evaluate(() => {
            const checks = {
                SafeDOMUpdater: typeof window.SafeDOMUpdater,
                haqeiFutureSimulator: typeof window.haqeiFutureSimulator,
                displayBinaryTreeResults: typeof window.displayBinaryTreeResults
            };
            
            // haqeiFutureSimulatorの中身を確認
            if (window.haqeiFutureSimulator) {
                checks.haqeiFutureSimulatorMethods = Object.keys(window.haqeiFutureSimulator);
                checks.hasDisplayAuthentic386 = typeof window.haqeiFutureSimulator.displayAuthentic386Results === 'function';
            }
            
            return checks;
        });
        
        console.log('\n  初期状態:');
        console.log(`    SafeDOMUpdater: ${initial.SafeDOMUpdater}`);
        console.log(`    haqeiFutureSimulator: ${initial.haqeiFutureSimulator}`);
        console.log(`    displayBinaryTreeResults: ${initial.displayBinaryTreeResults}`);
        
        if (initial.haqeiFutureSimulatorMethods) {
            console.log(`    haqeiFutureSimulator methods: ${initial.haqeiFutureSimulatorMethods.join(', ')}`);
            console.log(`    hasDisplayAuthentic386: ${initial.hasDisplayAuthentic386}`);
        }
        
        console.log('\n📋 Step 2: 分析実行');
        
        await page.fill('textarea', 'テスト入力');
        
        // ボタンクリック前にログをクリア
        logs.length = 0;
        
        await page.evaluate(() => {
            const btn = document.querySelector('#aiGuessBtn');
            if (btn) {
                console.log('🚀 === ANALYSIS START ===');
                btn.click();
            }
        });
        
        await page.waitForTimeout(5000);
        
        console.log('\n📋 Step 3: 実行ログの分析');
        console.log('--------------------------------');
        
        // SafeDOMUpdater関連のログを探す
        const safeDOMLogs = logs.filter(log => 
            log.text.includes('SafeDOMUpdater') || 
            log.text.includes('Canvas-safe')
        );
        
        if (safeDOMLogs.length > 0) {
            console.log('\n  SafeDOMUpdater関連:');
            safeDOMLogs.forEach(log => {
                console.log(`    - ${log.text}`);
            });
        }
        
        // Binary Tree関連のログを探す
        const binaryLogs = logs.filter(log => 
            log.text.includes('Binary') || 
            log.text.includes('binary')
        );
        
        if (binaryLogs.length > 0) {
            console.log('\n  BinaryTree関連:');
            binaryLogs.forEach(log => {
                console.log(`    - ${log.text}`);
            });
        }
        
        // シナリオ関連のログを探す
        const scenarioLogs = logs.filter(log => 
            log.text.includes('scenario') || 
            log.text.includes('Scenario')
        );
        
        if (scenarioLogs.length > 0) {
            console.log('\n  シナリオ関連:');
            scenarioLogs.slice(0, 10).forEach(log => {
                console.log(`    - ${log.text}`);
            });
        }
        
        console.log('\n📋 Step 4: 実際にSafeDOMUpdaterが使われたか確認');
        
        const safeDOMUsage = await page.evaluate(() => {
            // localStorageやグローバル変数を確認
            const traces = [];
            
            // window.lastUpdateResultを確認（もしあれば）
            if (window.lastUpdateResult !== undefined) {
                traces.push(`lastUpdateResult: ${window.lastUpdateResult}`);
            }
            
            // DOMを確認
            const eightContainer = document.getElementById('eight-scenarios-display-container');
            const scenarioCards = document.querySelectorAll('.scenario-card');
            
            return {
                traces,
                eightContainerExists: !!eightContainer,
                eightContainerChildren: eightContainer?.children.length || 0,
                scenarioCardsTotal: scenarioCards.length,
                scenarioCardsInEightContainer: eightContainer ? 
                    eightContainer.querySelectorAll('.scenario-card').length : 0
            };
        });
        
        console.log('\n  実行後の状態:');
        console.log(`    eight-scenarios-display-container: ${safeDOMUsage.eightContainerExists ? '✅' : '❌'}`);
        console.log(`    - 子要素: ${safeDOMUsage.eightContainerChildren}個`);
        console.log(`    シナリオカード総数: ${safeDOMUsage.scenarioCardsTotal}個`);
        console.log(`    eightContainer内のカード: ${safeDOMUsage.scenarioCardsInEightContainer}個`);
        
        if (safeDOMUsage.traces.length > 0) {
            console.log('\n  追跡情報:');
            safeDOMUsage.traces.forEach(trace => {
                console.log(`    - ${trace}`);
            });
        }
        
        console.log('\n📋 Step 5: 問題の特定');
        console.log('--------------------------------');
        
        // SafeDOMUpdaterのupdateScenariosDisplayが正しく動作しているか
        const testUpdate = await page.evaluate(() => {
            if (!window.SafeDOMUpdater) {
                return { error: 'SafeDOMUpdater not found' };
            }
            
            const updater = new window.SafeDOMUpdater();
            
            // テストデータ
            const testData = {
                scenarios: [
                    { name: 'テスト1', description: '説明1', score: 80 },
                    { name: 'テスト2', description: '説明2', score: 70 }
                ]
            };
            
            // 直接updateScenariosDisplayを呼ぶ
            const container = document.getElementById('resultsContainer');
            if (container) {
                updater.updateScenariosDisplay(container, testData);
            }
            
            // 結果確認
            const cards = document.querySelectorAll('.scenario-card');
            const eightContainer = document.getElementById('eight-scenarios-display-container');
            const scenariosGrid = eightContainer?.querySelector('.scenarios-grid');
            
            return {
                updateCalled: true,
                cardsCreated: cards.length,
                eightContainerExists: !!eightContainer,
                scenariosGridExists: !!scenariosGrid,
                scenariosGridChildren: scenariosGrid?.children.length || 0
            };
        });
        
        console.log('\n  SafeDOMUpdater.updateScenariosDisplay テスト:');
        console.log(`    カード作成: ${testUpdate.cardsCreated}個`);
        console.log(`    eight-container: ${testUpdate.eightContainerExists ? '✅' : '❌'}`);
        console.log(`    scenarios-grid: ${testUpdate.scenariosGridExists ? '✅' : '❌'}`);
        console.log(`    grid内の要素: ${testUpdate.scenariosGridChildren}個`);
        
        console.log('\n=====================================');
        console.log('📊 診断結果');
        console.log('=====================================\n');
        
        const problems = [];
        
        if (safeDOMLogs.length > 0 && safeDOMUsage.scenarioCardsInEightContainer === 0) {
            problems.push('SafeDOMUpdaterは実行されたが、カードが作成されていない');
        }
        
        if (testUpdate.scenariosGridExists && testUpdate.scenariosGridChildren === 0) {
            problems.push('scenarios-gridは存在するが、カードが追加されていない');
        }
        
        if (!initial.hasDisplayAuthentic386) {
            problems.push('haqeiFutureSimulator.displayAuthentic386Resultsが存在しない');
        }
        
        if (problems.length > 0) {
            console.log('🚨 発見された問題:');
            problems.forEach((problem, i) => {
                console.log(`  ${i + 1}. ${problem}`);
            });
        }
        
        console.log('\n📝 原因:');
        console.log('  SafeDOMUpdaterは正常に動作しているが、');
        console.log('  extractScenariosメソッドが適切なデータを取得できていない');
        console.log('  または、basicScenarioUpdateメソッドでカードが正しく作成されていない');
        
    } finally {
        console.log('\n⏰ 10秒後にブラウザを閉じます...');
        await page.waitForTimeout(10000);
        await browser.close();
    }
}

// 実行
traceActualFlow().catch(console.error);