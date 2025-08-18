/**
 * 分析フロー詳細デバッグ
 */

import { chromium } from 'playwright';

async function debugAnalysisFlow() {
    console.log('[ANALYSIS DEBUG] 分析フロー詳細デバッグ開始');
    console.log('============================================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        
        // 全ログ監視
        const logs = [];
        const errors = [];
        
        page.on('pageerror', error => {
            errors.push(error.message);
            console.error('❌ Page Error:', error.message);
        });
        
        page.on('console', msg => {
            const text = msg.text();
            logs.push(text);
            
            // 分析関連ログのみフィルタ
            if (text.includes('[DEBUG]') || 
                text.includes('analyzeSituation') || 
                text.includes('scenario') ||
                text.includes('Analysis') ||
                text.includes('✅') && text.includes('Situation') ||
                text.includes('❌')) {
                console.log('📋 Debug Log:', text);
            }
        });
        
        console.log('[ANALYSIS DEBUG] ページアクセス...');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        
        await page.waitForTimeout(8000);
        
        // 分析実行とリアルタイム監視
        console.log('\n[ANALYSIS DEBUG] 分析実行開始...');
        const analysisFlow = await page.evaluate(() => {
            const textarea = document.getElementById('situation-text');
            const analyzeBtn = document.querySelector('.analyze-btn.primary');
            
            if (!textarea || !analyzeBtn) {
                return { error: 'UI elements not found' };
            }
            
            // グローバル変数確認
            const globals = {
                ichingSimulator: !!window.ichingSimulator,
                situationAnalyzer: !!window.ichingSimulator?.situationAnalyzer,
                metaphorDisplay: !!window.ichingSimulator?.metaphorDisplay,
                haqeiScenariosGenerator: !!window.haqeiScenariosGenerator,
                eightScenariosDisplay: !!window.EightScenariosDisplay,
                randomnessManager: !!window.randomnessManager
            };
            
            // テキスト設定
            const testText = '新しいビジネスを始めるべきか、現在の安定した収入を重視すべきか悩んでいます。';
            textarea.value = testText;
            
            // 分析実行前にイベントリスナーを追加
            let analysisStarted = false;
            let analysisCompleted = false;
            
            // カスタムイベント監視
            document.addEventListener('analysisStarted', () => {
                analysisStarted = true;
                console.log('🎯 [DEBUG] Custom event: analysisStarted');
            });
            
            document.addEventListener('analysisCompleted', () => {
                analysisCompleted = true;
                console.log('🎯 [DEBUG] Custom event: analysisCompleted');
            });
            
            // 分析実行（フォームのsubmitを直接トリガー）
            console.log('🎯 [DEBUG] Triggering form submit...');
            const form = document.getElementById('situation-analysis-form');
            if (form) {
                form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                console.log('🎯 [DEBUG] Form submit event dispatched');
            } else {
                console.log('🎯 [DEBUG] Fallback: Clicking analyze button...');
                analyzeBtn.click();
            }
            
            return {
                globals,
                inputText: testText,
                analysisTriggered: true,
                analysisStarted,
                analysisCompleted
            };
        });
        
        console.log('\n[ANALYSIS DEBUG] 分析状態:');
        console.log('================================');
        console.log(`  🔧 ichingSimulator: ${analysisFlow.globals?.ichingSimulator ? '✅' : '❌'}`);
        console.log(`  🔧 situationAnalyzer: ${analysisFlow.globals?.situationAnalyzer ? '✅' : '❌'}`);
        console.log(`  🔧 metaphorDisplay: ${analysisFlow.globals?.metaphorDisplay ? '✅' : '❌'}`);
        console.log(`  🔧 haqeiScenariosGenerator: ${analysisFlow.globals?.haqeiScenariosGenerator ? '✅' : '❌'}`);
        console.log(`  🔧 EightScenariosDisplay: ${analysisFlow.globals?.eightScenariosDisplay ? '✅' : '❌'}`);
        console.log(`  🔧 分析トリガー: ${analysisFlow.analysisTriggered ? '✅' : '❌'}`);
        
        // 長時間待機しながら段階的チェック
        console.log('\n[ANALYSIS DEBUG] 処理監視開始...');
        
        for (let i = 0; i < 10; i++) {
            await page.waitForTimeout(3000);
            
            const currentState = await page.evaluate(() => {
                return {
                    containerContent: document.getElementById('i-ching-container')?.innerHTML?.length || 0,
                    statusText: document.querySelector('.status-text')?.textContent || 'No status',
                    scenariosContainer: !!document.querySelector('.eight-scenarios-container'),
                    scenariosCount: document.querySelectorAll('.scenario-card').length,
                    displayContainer: !!document.getElementById('eight-scenarios-display-container')
                };
            });
            
            console.log(`  ⏱️ ${i*3}秒後: コンテンツ ${currentState.containerContent}文字, ステータス: "${currentState.statusText}", シナリオ: ${currentState.scenariosCount}枚`);
            
            if (currentState.scenariosCount > 0) {
                console.log('✅ シナリオ表示確認！');
                break;
            }
        }
        
        // 最終状態確認
        const finalState = await page.evaluate(() => {
            return {
                // コンテナ系
                iChingContainer: !!document.getElementById('i-ching-container'),
                scenariosDisplayContainer: !!document.getElementById('eight-scenarios-display-container'),
                scenariosContainer: !!document.querySelector('.eight-scenarios-container'),
                scenarioGrid: !!document.querySelector('.scenario-grid'),
                
                // シナリオ系
                scenarioCards: document.querySelectorAll('.scenario-card').length,
                phaseContainers: document.querySelectorAll('.three-phase-container').length,
                phaseBlocks: document.querySelectorAll('.phase-block').length,
                
                // ステータス
                statusText: document.querySelector('.status-text')?.textContent || 'No status',
                
                // HTMLダンプ（一部）
                containerHTML: document.getElementById('i-ching-container')?.innerHTML?.substring(0, 1000) || 'No container'
            };
        });
        
        console.log('\n[ANALYSIS DEBUG] 最終結果:');
        console.log('================================');
        console.log(`  📊 i-ching-container: ${finalState.iChingContainer ? '✅' : '❌'}`);
        console.log(`  📊 eight-scenarios-display-container: ${finalState.scenariosDisplayContainer ? '✅' : '❌'}`);
        console.log(`  📊 eight-scenarios-container: ${finalState.scenariosContainer ? '✅' : '❌'}`);
        console.log(`  📊 scenario-grid: ${finalState.scenarioGrid ? '✅' : '❌'}`);
        console.log(`  📊 シナリオカード: ${finalState.scenarioCards}枚`);
        console.log(`  📊 フェーズコンテナ: ${finalState.phaseContainers}個`);
        console.log(`  📊 フェーズブロック: ${finalState.phaseBlocks}個`);
        console.log(`  📊 ステータス: "${finalState.statusText}"`);
        
        // デバッグログ分析
        const debugLogs = logs.filter(log => log.includes('[DEBUG]'));
        console.log(`\n[ANALYSIS DEBUG] デバッグログ: ${debugLogs.length}件`);
        debugLogs.slice(0, 15).forEach(log => {
            console.log(`  📋 ${log}`);
        });
        
        console.log(`\n[ANALYSIS DEBUG] エラー: ${errors.length}件`);
        errors.forEach(error => {
            console.log(`  ❌ ${error}`);
        });
        
        const success = finalState.scenarioCards >= 8;
        
        return {
            success,
            finalState,
            debugLogs: debugLogs.length,
            errors: errors.length,
            logs: logs.length
        };
        
    } catch (error) {
        console.error('[ANALYSIS DEBUG] テストエラー:', error);
        return { 
            success: false, 
            error: error.message 
        };
    } finally {
        console.log('\n[ANALYSIS DEBUG] 最終確認のため15秒間表示...');
        await new Promise(resolve => setTimeout(resolve, 15000));
        await browser.close();
    }
}

// 実行
debugAnalysisFlow().then(result => {
    console.log('\n📋 分析フロー詳細デバッグ完了');
    console.log('=================================');
    
    if (result.success) {
        console.log('✅ 分析フロー: 正常動作');
        console.log('✅ 8カードシナリオ表示が動作確認');
    } else {
        console.log('❌ 分析フロー: 問題あり');
        console.log(`  デバッグログ: ${result.debugLogs}件`);
        console.log(`  エラー: ${result.errors}件`);
        console.log(`  総ログ: ${result.logs}件`);
        if (result.error) {
            console.log(`  Error: ${result.error}`);
        }
    }
    
}).catch(console.error);