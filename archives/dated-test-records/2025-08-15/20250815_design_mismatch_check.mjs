/**
 * 設計不整合確認テスト
 * 実際の表示設計と変更中の設計のチグハグを特定
 */

import { chromium } from 'playwright';
import fs from 'fs';

async function checkDesignMismatch() {
    console.log('🔍 設計不整合確認');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false
    });
    
    const designInfo = {
        original: {},
        current: {},
        mismatches: []
    };
    
    try {
        const page = await browser.newPage();
        
        console.log('📋 Step 1: 元の設計構造の確認');
        console.log('--------------------------------');
        
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle'
        });
        
        await page.waitForTimeout(2000);
        
        // 元の設計で期待される要素
        const originalDesign = await page.evaluate(() => {
            const info = {
                // 元の設計での表示関数
                displayFunctions: {
                    displayAuthentic386Results: typeof window.haqeiFutureSimulator?.displayAuthentic386Results === 'function',
                    displayBinaryTreeResults: typeof window.displayBinaryTreeResults === 'function',
                    displayEightScenarios: typeof window.displayEightScenarios === 'function'
                },
                
                // 元の設計でのコンテナ
                containers: {
                    resultsContainer: document.getElementById('resultsContainer'),
                    eightScenariosContainer: document.getElementById('eight-scenarios-display-container'),
                    futurePathsContainer: document.getElementById('future-paths-container'),
                    authentic386Container: document.getElementById('authentic386-container')
                },
                
                // Canvas要素の配置
                canvases: {
                    threeStage: document.querySelector('canvas[id*="three-stage"]'),
                    currentPosition: document.getElementById('currentPositionChart'),
                    futureBranching: document.getElementById('futureBranchingChart'),
                    scenarioComparison: document.getElementById('scenarioComparisonChart')
                }
            };
            
            // 実際に存在する要素
            info.actualContainers = {};
            Object.entries(info.containers).forEach(([key, elem]) => {
                info.actualContainers[key] = {
                    exists: !!elem,
                    id: elem?.id,
                    className: elem?.className,
                    parent: elem?.parentElement?.id
                };
            });
            
            info.actualCanvases = {};
            Object.entries(info.canvases).forEach(([key, elem]) => {
                info.actualCanvases[key] = {
                    exists: !!elem,
                    id: elem?.id,
                    parent: elem?.parentElement?.id
                };
            });
            
            return info;
        });
        
        console.log('  表示関数:');
        Object.entries(originalDesign.displayFunctions).forEach(([name, exists]) => {
            console.log(`    ${name}: ${exists ? '✅' : '❌'}`);
        });
        
        console.log('\n  コンテナ要素:');
        Object.entries(originalDesign.actualContainers).forEach(([name, info]) => {
            console.log(`    ${name}: ${info.exists ? '✅' : '❌'} ${info.exists ? `(#${info.id})` : ''}`);
        });
        
        console.log('\n  Canvas要素:');
        Object.entries(originalDesign.actualCanvases).forEach(([name, info]) => {
            console.log(`    ${name}: ${info.exists ? '✅' : '❌'} ${info.exists ? `(#${info.id})` : ''}`);
        });
        
        designInfo.original = originalDesign;
        
        console.log('\n📋 Step 2: 新しい設計（変更中）の確認');
        console.log('--------------------------------');
        
        // 新しい設計での要素
        const currentDesign = await page.evaluate(() => {
            const info = {
                // 新しいDOM管理システム
                domManagers: {
                    SingleDOMManager: typeof window.SingleDOMManager !== 'undefined',
                    SafeDOMUpdater: typeof window.SafeDOMUpdater !== 'undefined',
                    DOMPreserver: typeof window.DOMPreserver !== 'undefined',
                    FutureSimulatorDOMIntegration: typeof window.FutureSimulatorDOMIntegration !== 'undefined'
                },
                
                // SingleDOMManagerの状態
                singleDOMState: null,
                
                // 期待される新構造
                expectedStructure: {
                    scenariosCards: document.getElementById('scenarios-cards'),
                    canvasContainer: document.getElementById('canvas-container')
                }
            };
            
            if (window.SingleDOMManager) {
                info.singleDOMState = {
                    initialized: window.SingleDOMManager.initialized,
                    methods: Object.keys(window.SingleDOMManager)
                };
            }
            
            info.actualNewStructure = {};
            Object.entries(info.expectedStructure).forEach(([key, elem]) => {
                info.actualNewStructure[key] = {
                    exists: !!elem,
                    id: elem?.id,
                    parent: elem?.parentElement?.id
                };
            });
            
            return info;
        });
        
        console.log('  DOM管理システム:');
        Object.entries(currentDesign.domManagers).forEach(([name, exists]) => {
            console.log(`    ${name}: ${exists ? '✅' : '❌'}`);
        });
        
        if (currentDesign.singleDOMState) {
            console.log(`\n  SingleDOMManager:`);
            console.log(`    初期化: ${currentDesign.singleDOMState.initialized ? '✅' : '❌'}`);
            console.log(`    メソッド: ${currentDesign.singleDOMState.methods.join(', ')}`);
        }
        
        console.log('\n  新構造の要素:');
        Object.entries(currentDesign.actualNewStructure).forEach(([name, info]) => {
            console.log(`    ${name}: ${info.exists ? '✅' : '❌'}`);
        });
        
        designInfo.current = currentDesign;
        
        console.log('\n📋 Step 3: 分析実行時の動作確認');
        console.log('--------------------------------');
        
        // 分析前の状態記録
        const beforeAnalysis = await page.evaluate(() => {
            return {
                resultsVisible: document.getElementById('resultsContainer')?.style.display !== 'none',
                canvasCount: document.querySelectorAll('canvas').length,
                containerCount: document.querySelectorAll('[id*="container"]').length
            };
        });
        
        // 分析実行
        await page.fill('textarea', 'テスト入力');
        await page.evaluate(() => {
            const btn = document.querySelector('#aiGuessBtn');
            if (btn) btn.click();
        });
        
        console.log('  分析実行中...');
        await page.waitForTimeout(5000);
        
        // 分析後の動作確認
        const afterAnalysis = await page.evaluate(() => {
            // どの関数が実際に呼ばれたか
            const callTrace = [];
            
            // 結果表示の状態
            const resultsContainer = document.getElementById('resultsContainer');
            const eightScenariosContainer = document.getElementById('eight-scenarios-display-container');
            
            const state = {
                resultsVisible: resultsContainer?.style.display !== 'none',
                canvasCount: document.querySelectorAll('canvas').length,
                containerCount: document.querySelectorAll('[id*="container"]').length,
                scenarioCards: document.querySelectorAll('.scenario-card').length,
                
                // 実際の表示場所
                displayLocations: {
                    resultsInResultsContainer: resultsContainer?.children.length > 0,
                    scenariosInEightContainer: eightScenariosContainer?.querySelector('.scenario-card') !== null,
                    scenariosInScenariosCards: document.getElementById('scenarios-cards')?.children.length > 0
                }
            };
            
            return state;
        });
        
        console.log(`\n  分析前後の変化:`);
        console.log(`    結果表示: ${beforeAnalysis.resultsVisible} → ${afterAnalysis.resultsVisible}`);
        console.log(`    Canvas数: ${beforeAnalysis.canvasCount} → ${afterAnalysis.canvasCount}`);
        console.log(`    Container数: ${beforeAnalysis.containerCount} → ${afterAnalysis.containerCount}`);
        console.log(`    カード数: 0 → ${afterAnalysis.scenarioCards}`);
        
        console.log(`\n  実際の表示場所:`);
        Object.entries(afterAnalysis.displayLocations).forEach(([location, hasContent]) => {
            console.log(`    ${location}: ${hasContent ? '✅' : '❌'}`);
        });
        
        console.log('\n📋 Step 4: 不整合の特定');
        console.log('--------------------------------');
        
        // 不整合を検出
        const mismatches = [];
        
        // 1. 複数のDOM管理システムが存在
        const domManagerCount = Object.values(currentDesign.domManagers).filter(exists => exists).length;
        if (domManagerCount > 1) {
            mismatches.push({
                type: '複数DOM管理システム',
                issue: `${domManagerCount}個のシステムが競合`,
                systems: Object.entries(currentDesign.domManagers)
                    .filter(([_, exists]) => exists)
                    .map(([name]) => name)
            });
        }
        
        // 2. 元の設計と新設計の要素の不一致
        if (originalDesign.actualContainers.eightScenariosContainer.exists && 
            !currentDesign.actualNewStructure.scenariosCards.exists) {
            mismatches.push({
                type: 'コンテナ構造不一致',
                issue: '元のeight-scenarios-display-containerは存在するが、新しいscenarios-cardsは存在しない'
            });
        }
        
        // 3. 表示場所の不整合
        if (afterAnalysis.scenarioCards > 0 && !afterAnalysis.displayLocations.scenariosInEightContainer) {
            mismatches.push({
                type: '表示場所不整合',
                issue: 'カードは作成されているが、期待される場所に表示されていない'
            });
        }
        
        // 4. Canvas数の変化
        if (afterAnalysis.canvasCount !== beforeAnalysis.canvasCount) {
            mismatches.push({
                type: 'Canvas要素不安定',
                issue: `Canvas数が${beforeAnalysis.canvasCount}から${afterAnalysis.canvasCount}に変化`
            });
        }
        
        designInfo.mismatches = mismatches;
        
        console.log(`\n  検出された不整合: ${mismatches.length}件`);
        mismatches.forEach((mismatch, i) => {
            console.log(`\n  ${i + 1}. ${mismatch.type}`);
            console.log(`     ${mismatch.issue}`);
            if (mismatch.systems) {
                console.log(`     競合システム: ${mismatch.systems.join(', ')}`);
            }
        });
        
        console.log('\n=====================================');
        console.log('📊 設計不整合サマリー');
        console.log('=====================================\n');
        
        console.log('【元の設計】');
        console.log('  - displayAuthentic386Results関数で結果表示');
        console.log('  - resultsContainerに内容を配置');
        console.log('  - eight-scenarios-display-containerにシナリオ表示');
        
        console.log('\n【新しい設計（変更中）】');
        console.log('  - SingleDOMManagerで管理');
        console.log('  - scenarios-cardsにカード配置（想定）');
        console.log('  - canvas-containerにCanvas配置（想定）');
        
        console.log('\n【主要な不整合】');
        if (mismatches.length === 0) {
            console.log('  ✅ 不整合なし');
        } else {
            mismatches.forEach(m => {
                console.log(`  ❌ ${m.type}: ${m.issue}`);
            });
        }
        
        console.log('\n【推奨される対応】');
        console.log('  1. DOM管理システムを1つに統一');
        console.log('  2. 元の設計のコンテナ構造を尊重');
        console.log('  3. SingleDOMManagerを元の構造に合わせて修正');
        console.log('  4. 新旧の要素IDの混在を解消');
        
        // レポート保存
        const report = {
            timestamp: new Date().toISOString(),
            original: designInfo.original,
            current: designInfo.current,
            mismatches: designInfo.mismatches,
            recommendation: [
                '元の設計構造（eight-scenarios-display-container）を維持',
                'SingleDOMManagerを元の構造に適応させる',
                '不要なDOM管理システムを削除',
                'innerHTML操作を差分更新に置換'
            ]
        };
        
        fs.writeFileSync(
            '20250815_design_mismatch_report.json',
            JSON.stringify(report, null, 2)
        );
        
        console.log('\n✅ レポート保存: 20250815_design_mismatch_report.json');
        
    } catch (error) {
        console.error('❌ エラー:', error.message);
    } finally {
        await page.waitForTimeout(5000);
        await browser.close();
    }
}

// 実行
checkDesignMismatch().catch(console.error);