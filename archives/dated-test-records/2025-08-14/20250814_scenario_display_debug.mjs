/**
 * シナリオ表示が動作しない問題のデバッグ
 */

import { chromium } from 'playwright';

async function debugScenarioDisplay() {
    console.log('[DEBUG] シナリオ表示問題デバッグ開始');
    console.log('=======================================');
    
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
            if (text.includes('analyze') || text.includes('scenario') || text.includes('display')) {
                console.log('📋 Log:', text);
            }
        });
        
        console.log('[DEBUG] Future Simulatorページアクセス...');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        
        await page.waitForTimeout(8000);
        
        // 分析前の状態確認
        const beforeAnalysis = await page.evaluate(() => {
            return {
                ichingSimulator: !!window.ichingSimulator,
                situationAnalyzer: !!window.ichingSimulator?.situationAnalyzer,
                isReady: window.ichingSimulator?.isReady?.() || false,
                textareaExists: !!document.getElementById('situation-text'),
                analyzeBtnExists: !!document.querySelector('.analyze-btn.primary'),
                eightscenariosDisplay: !!window.EightScenariosDisplay,
                haqeiScenariosGenerator: !!window.haqeiScenariosGenerator
            };
        });
        
        console.log('\n[DEBUG] 分析前の状態:');
        console.log('============================');
        console.log(`  🔧 ichingSimulator: ${beforeAnalysis.ichingSimulator ? '✅' : '❌'}`);
        console.log(`  🔧 situationAnalyzer: ${beforeAnalysis.situationAnalyzer ? '✅' : '❌'}`);
        console.log(`  🔧 isReady: ${beforeAnalysis.isReady ? '✅' : '❌'}`);
        console.log(`  🔧 textarea: ${beforeAnalysis.textareaExists ? '✅' : '❌'}`);
        console.log(`  🔧 analyzeBtn: ${beforeAnalysis.analyzeBtnExists ? '✅' : '❌'}`);
        console.log(`  🔧 EightScenariosDisplay: ${beforeAnalysis.eightscenariosDisplay ? '✅' : '❌'}`);
        console.log(`  🔧 ScenariosGenerator: ${beforeAnalysis.haqeiScenariosGenerator ? '✅' : '❌'}`);
        
        if (!beforeAnalysis.textareaExists || !beforeAnalysis.analyzeBtnExists) {
            console.log('❌ [DEBUG] 必要なUI要素が見つからない');
            return { success: false, error: 'Missing UI elements' };
        }
        
        // テキスト入力と分析実行
        console.log('\n[DEBUG] 分析実行中...');
        const analysisResult = await page.evaluate(() => {
            const textarea = document.getElementById('situation-text');
            const analyzeBtn = document.querySelector('.analyze-btn.primary');
            
            if (textarea && analyzeBtn) {
                textarea.value = '新しいプロジェクトを始めるかどうか迷っています。成功の可能性と失敗のリスクを考えると決断に困ります。';
                
                // 分析ボタンクリック
                analyzeBtn.click();
                
                return {
                    inputSet: true,
                    buttonClicked: true,
                    inputText: textarea.value
                };
            }
            
            return { inputSet: false, buttonClicked: false };
        });
        
        console.log(`  🔧 入力設定: ${analysisResult.inputSet ? '✅' : '❌'}`);
        console.log(`  🔧 ボタンクリック: ${analysisResult.buttonClicked ? '✅' : '❌'}`);
        
        // 分析処理待機
        console.log('[DEBUG] 分析処理待機（20秒）...');
        await page.waitForTimeout(20000);
        
        // 分析後の状態確認
        const afterAnalysis = await page.evaluate(() => {
            return {
                // コンテナ系
                iChingContainer: !!document.getElementById('i-ching-container'),
                iChingContainerContent: document.getElementById('i-ching-container')?.innerHTML?.length || 0,
                
                // シナリオ表示系
                eightScenariosContainer: !!document.querySelector('.eight-scenarios-container'),
                scenarioGrid: !!document.querySelector('.scenario-grid'),
                scenarioCards: document.querySelectorAll('.scenario-card').length,
                
                // 分析結果系
                metaphorDisplay: !!document.querySelector('.metaphor-container'),
                analysisResults: !!document.querySelector('.analysis-result'),
                
                // イベント系
                analysisCompleted: window.futureAnalysisCompleted || false,
                
                // HTML構造確認
                htmlStructure: {
                    body: document.body.children.length,
                    container: document.getElementById('i-ching-container') ? 'found' : 'missing',
                    innerContent: document.getElementById('i-ching-container')?.children.length || 0
                }
            };
        });
        
        console.log('\n[DEBUG] 分析後の状態:');
        console.log('============================');
        console.log(`  📊 i-ching-container: ${afterAnalysis.iChingContainer ? '✅' : '❌'}`);
        console.log(`  📊 コンテナ内容量: ${afterAnalysis.iChingContainerContent}文字`);
        console.log(`  📊 eight-scenarios-container: ${afterAnalysis.eightScenariosContainer ? '✅' : '❌'}`);
        console.log(`  📊 scenario-grid: ${afterAnalysis.scenarioGrid ? '✅' : '❌'}`);
        console.log(`  📊 シナリオカード数: ${afterAnalysis.scenarioCards}枚`);
        console.log(`  📊 分析完了フラグ: ${afterAnalysis.analysisCompleted ? '✅' : '❌'}`);
        console.log(`  📊 コンテナ子要素: ${afterAnalysis.htmlStructure.innerContent}個`);
        
        // さらに詳細なHTMLダンプ
        if (afterAnalysis.iChingContainer) {
            const htmlContent = await page.evaluate(() => {
                const container = document.getElementById('i-ching-container');
                return container ? container.innerHTML.substring(0, 500) + '...' : 'No content';
            });
            console.log(`\n[DEBUG] コンテナ内容サンプル:\n${htmlContent}\n`);
        }
        
        // ログ分析
        const scenarioLogs = logs.filter(log => 
            log.includes('scenario') || 
            log.includes('display') || 
            log.includes('analysis') ||
            log.includes('mount') ||
            log.includes('Eight')
        );
        
        console.log(`\n[DEBUG] 関連ログ分析: ${scenarioLogs.length}件`);
        scenarioLogs.slice(0, 10).forEach(log => {
            console.log(`  📋 ${log}`);
        });
        
        console.log(`\n[DEBUG] JavaScript Errors: ${errors.length}件`);
        errors.forEach(error => {
            console.log(`  ❌ ${error}`);
        });
        
        const success = afterAnalysis.scenarioCards >= 8 && afterAnalysis.eightScenariosContainer;
        
        return {
            success,
            beforeAnalysis,
            afterAnalysis,
            logs: scenarioLogs.length,
            errors: errors.length
        };
        
    } catch (error) {
        console.error('[DEBUG] エラー:', error);
        return { 
            success: false, 
            error: error.message 
        };
    } finally {
        console.log('\n[DEBUG] 結果確認のため20秒間表示...');
        await new Promise(resolve => setTimeout(resolve, 20000));
        await browser.close();
    }
}

// 実行
debugScenarioDisplay().then(result => {
    console.log('\n📋 シナリオ表示デバッグ完了');
    console.log('==============================');
    
    if (result.success) {
        console.log('✅ シナリオ表示: 正常動作');
    } else {
        console.log('❌ シナリオ表示: 問題あり');
        if (result.error) {
            console.log('Error:', result.error);
        }
        console.log('→ 根本的な実装見直しが必要');
    }
    
}).catch(console.error);