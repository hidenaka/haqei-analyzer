/**
 * 表示統合問題のデバッグ
 */

import { chromium } from 'playwright';

async function debugDisplayIntegration() {
    console.log('[DISPLAY DEBUG] 表示統合問題デバッグ開始');
    console.log('==========================================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        
        // 詳細ログ監視
        const logs = [];
        const errors = [];
        
        page.on('pageerror', error => {
            errors.push(error.message);
            console.error('❌ Page Error:', error.message);
        });
        
        page.on('console', msg => {
            const text = msg.text();
            logs.push(text);
            
            // 表示関連ログのみフィルタ
            if (text.includes('EightScenarios') || 
                text.includes('display') || 
                text.includes('container') ||
                text.includes('grid') ||
                text.includes('initialize') ||
                text.includes('futureAnalysisCompleted')) {
                console.log('📋 Display Log:', text);
            }
        });
        
        console.log('[DISPLAY DEBUG] ページアクセス...');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        
        await page.waitForTimeout(8000);
        
        // 分析前の表示状態確認
        const beforeAnalysis = await page.evaluate(() => {
            return {
                futureAnalysisCompleted: window.futureAnalysisCompleted,
                eightScenariosDisplay: !!window.EightScenariosDisplay,
                displayContainer: !!document.getElementById('eight-scenarios-display-container'),
                containsEightScenarios: !!document.querySelector('.eight-scenarios-container'),
                containsScenarioGrid: !!document.querySelector('.scenario-grid'),
                scenarioCards: document.querySelectorAll('.scenario-card').length
            };
        });
        
        console.log('\\n[DISPLAY DEBUG] 分析前の表示状態:');
        console.log('====================================');
        console.log(`  📊 futureAnalysisCompleted: ${beforeAnalysis.futureAnalysisCompleted ? '✅' : '❌'}`);
        console.log(`  📊 EightScenariosDisplay: ${beforeAnalysis.eightScenariosDisplay ? '✅' : '❌'}`);
        console.log(`  📊 display-container: ${beforeAnalysis.displayContainer ? '✅' : '❌'}`);
        console.log(`  📊 eight-scenarios-container: ${beforeAnalysis.containsEightScenarios ? '✅' : '❌'}`);
        console.log(`  📊 scenario-grid: ${beforeAnalysis.containsScenarioGrid ? '✅' : '❌'}`);
        console.log(`  📊 シナリオカード数: ${beforeAnalysis.scenarioCards}枚`);
        
        // 分析実行
        console.log('\\n[DISPLAY DEBUG] 分析実行...');
        const analysisResult = await page.evaluate(() => {
            const textarea = document.getElementById('situation-text');
            const analyzeBtn = document.querySelector('.analyze-btn.primary');
            
            if (textarea && analyzeBtn) {
                textarea.value = '新しいプロジェクトを始めるかどうか迷っています。成功の可能性と失敗のリスクを考えると決断に困ります。';
                analyzeBtn.click();
                return { triggered: true };
            }
            
            return { triggered: false };
        });
        
        console.log(`  🔧 分析トリガー: ${analysisResult.triggered ? '✅' : '❌'}`);
        
        // 分析完了まで段階的チェック
        console.log('\\n[DISPLAY DEBUG] 分析完了待機...');
        
        let analysisCompleted = false;
        for (let i = 0; i < 10; i++) {
            await page.waitForTimeout(3000);
            
            const currentState = await page.evaluate(() => {
                return {
                    futureAnalysisCompleted: window.futureAnalysisCompleted,
                    statusText: document.querySelector('.status-text')?.textContent || 'No status',
                    displayContainer: !!document.getElementById('eight-scenarios-display-container'),
                    displayContainerContent: document.getElementById('eight-scenarios-display-container')?.innerHTML?.length || 0,
                    containsEightScenarios: !!document.querySelector('.eight-scenarios-container'),
                    containsScenarioGrid: !!document.querySelector('.scenario-grid'),
                    scenarioCards: document.querySelectorAll('.scenario-card').length,
                    threePhaseContainers: document.querySelectorAll('.three-phase-container').length,
                    phaseBlocks: document.querySelectorAll('.phase-block').length
                };
            });
            
            console.log(`  ⏱️ ${i*3}秒後:`);
            console.log(`    Status: "${currentState.statusText}"`);
            console.log(`    futureAnalysisCompleted: ${currentState.futureAnalysisCompleted ? '✅' : '❌'}`);
            console.log(`    display-container content: ${currentState.displayContainerContent}文字`);
            console.log(`    eight-scenarios-container: ${currentState.containsEightScenarios ? '✅' : '❌'}`);
            console.log(`    scenario-grid: ${currentState.containsScenarioGrid ? '✅' : '❌'}`);
            console.log(`    シナリオカード: ${currentState.scenarioCards}枚`);
            
            if (currentState.statusText.includes('完了') && currentState.displayContainerContent > 0) {
                analysisCompleted = true;
                break;
            }
        }
        
        // 最終確認と詳細調査
        const finalState = await page.evaluate(() => {
            return {
                // グローバル変数
                futureAnalysisCompleted: window.futureAnalysisCompleted,
                ichingSimulator: !!window.ichingSimulator,
                eightScenariosDisplay: !!window.EightScenariosDisplay,
                
                // DOM状態
                displayContainer: document.getElementById('eight-scenarios-display-container'),
                displayContainerExists: !!document.getElementById('eight-scenarios-display-container'),
                displayContainerContent: document.getElementById('eight-scenarios-display-container')?.innerHTML || '',
                
                // 表示要素
                containsEightScenarios: !!document.querySelector('.eight-scenarios-container'),
                containsScenarioGrid: !!document.querySelector('.scenario-grid'),
                scenarioCards: document.querySelectorAll('.scenario-card').length,
                threeStageHeader: !!document.querySelector('.three-stage-header'),
                stageSelector: !!document.querySelector('.stage-selector'),
                
                // HTML構造サンプル
                containerHTML: document.getElementById('eight-scenarios-display-container')?.innerHTML?.substring(0, 500) || 'No content'
            };
        });
        
        console.log('\\n[DISPLAY DEBUG] 最終表示状態:');
        console.log('===============================');
        console.log(`  📊 futureAnalysisCompleted: ${finalState.futureAnalysisCompleted ? '✅' : '❌'}`);
        console.log(`  📊 ichingSimulator: ${finalState.ichingSimulator ? '✅' : '❌'}`);
        console.log(`  📊 EightScenariosDisplay: ${finalState.eightScenariosDisplay ? '✅' : '❌'}`);
        console.log(`  📊 display-container exists: ${finalState.displayContainerExists ? '✅' : '❌'}`);
        console.log(`  📊 eight-scenarios-container: ${finalState.containsEightScenarios ? '✅' : '❌'}`);
        console.log(`  📊 scenario-grid: ${finalState.containsScenarioGrid ? '✅' : '❌'}`);
        console.log(`  📊 three-stage-header: ${finalState.threeStageHeader ? '✅' : '❌'}`);
        console.log(`  📊 stage-selector: ${finalState.stageSelector ? '✅' : '❌'}`);
        console.log(`  📊 シナリオカード数: ${finalState.scenarioCards}枚`);
        
        // コンテナの詳細内容
        if (finalState.displayContainerExists) {
            console.log(`\\n[DISPLAY DEBUG] コンテナ内容サンプル:\\n${finalState.containerHTML}\\n`);
        }
        
        // 表示関連ログ分析
        const displayLogs = logs.filter(log => 
            log.includes('EightScenarios') || 
            log.includes('display') || 
            log.includes('initialize') ||
            log.includes('container')
        );
        
        console.log(`\\n[DISPLAY DEBUG] 表示関連ログ: ${displayLogs.length}件`);
        displayLogs.slice(0, 15).forEach(log => {
            console.log(`  📋 ${log}`);
        });
        
        console.log(`\\n[DISPLAY DEBUG] エラー: ${errors.length}件`);
        errors.forEach(error => {
            console.log(`  ❌ ${error}`);
        });
        
        const success = finalState.containsEightScenarios && finalState.scenarioCards >= 8;
        
        return {
            success,
            analysisCompleted,
            finalState,
            displayLogs: displayLogs.length,
            errors: errors.length
        };
        
    } catch (error) {
        console.error('[DISPLAY DEBUG] エラー:', error);
        return { 
            success: false, 
            error: error.message 
        };
    } finally {
        console.log('\\n[DISPLAY DEBUG] 結果確認のため20秒間表示...');
        await new Promise(resolve => setTimeout(resolve, 20000));
        await browser.close();
    }
}

// 実行
debugDisplayIntegration().then(result => {
    console.log('\\n📋 表示統合デバッグ完了');
    console.log('=========================');
    
    if (result.success) {
        console.log('✅ 表示統合: 正常動作');
    } else {
        console.log('❌ 表示統合: 問題あり');
        if (result.error) {
            console.log('Error:', result.error);
        }
        console.log('→ EightScenariosDisplay初期化・表示処理の問題');
    }
    
}).catch(console.error);