/**
 * フォームサブミット問題の詳細デバッグ
 */

import { chromium } from 'playwright';

async function debugFormSubmit() {
    console.log('[FORM DEBUG] フォームサブミット問題デバッグ開始');
    console.log('============================================');
    
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
            
            // フォーム・分析関連ログのみフィルタ
            if (text.includes('form') || 
                text.includes('submit') || 
                text.includes('button') ||
                text.includes('click') ||
                text.includes('analyze') ||
                text.includes('handleSituationInput') ||
                text.includes('analyzeSituation') ||
                text.includes('[DEBUG]')) {
                console.log('📋 Form Log:', text);
            }
        });
        
        console.log('[FORM DEBUG] ページアクセス...');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        
        await page.waitForTimeout(8000);
        
        // フォーム要素とイベントリスナーの確認
        const formState = await page.evaluate(() => {
            const textarea = document.getElementById('situation-text');
            const analyzeBtn = document.querySelector('.analyze-btn.primary');
            const form = document.getElementById('situation-analysis-form');
            
            return {
                textarea: {
                    exists: !!textarea,
                    id: textarea?.id,
                    value: textarea?.value || ''
                },
                button: {
                    exists: !!analyzeBtn,
                    className: analyzeBtn?.className,
                    textContent: analyzeBtn?.textContent?.trim()
                },
                form: {
                    exists: !!form,
                    id: form?.id,
                    action: form?.action,
                    method: form?.method
                },
                ichingSimulator: {
                    exists: !!window.ichingSimulator,
                    isReady: window.ichingSimulator?.isReady?.() || false,
                    hasSituationAnalyzer: !!window.ichingSimulator?.situationAnalyzer,
                    hasHandleSituationInput: typeof window.ichingSimulator?.handleSituationInput === 'function'
                }
            };
        });
        
        console.log('\\n[FORM DEBUG] フォーム状態確認:');
        console.log('============================');
        console.log('📊 Textarea:');
        console.log(`  - exists: ${formState.textarea.exists ? '✅' : '❌'}`);
        console.log(`  - id: ${formState.textarea.id}`);
        console.log('📊 Analyze Button:');
        console.log(`  - exists: ${formState.button.exists ? '✅' : '❌'}`);
        console.log(`  - className: ${formState.button.className}`);
        console.log(`  - textContent: "${formState.button.textContent}"`);
        console.log('📊 Form:');
        console.log(`  - exists: ${formState.form.exists ? '✅' : '❌'}`);
        console.log(`  - id: ${formState.form.id}`);
        console.log('📊 I Ching Simulator:');
        console.log(`  - exists: ${formState.ichingSimulator.exists ? '✅' : '❌'}`);
        console.log(`  - isReady: ${formState.ichingSimulator.isReady ? '✅' : '❌'}`);
        console.log(`  - hasSituationAnalyzer: ${formState.ichingSimulator.hasSituationAnalyzer ? '✅' : '❌'}`);
        console.log(`  - hasHandleSituationInput: ${formState.ichingSimulator.hasHandleSituationInput ? '✅' : '❌'}`);
        
        if (!formState.textarea.exists || !formState.button.exists) {
            console.log('❌ [FORM DEBUG] 必要な要素が見つからない - UIが正しく初期化されていない');
            return { success: false, error: 'Missing UI elements' };
        }
        
        // テキスト入力とボタンクリック
        console.log('\\n[FORM DEBUG] フォーム操作実行...');
        const operationResult = await page.evaluate(() => {
            const textarea = document.getElementById('situation-text');
            const analyzeBtn = document.querySelector('.analyze-btn.primary');
            
            // テキスト入力
            const testText = '新しいプロジェクトを始めるかどうか迷っています。成功の可能性と失敗のリスクを考えます。';
            textarea.value = testText;
            
            console.log('🎯 [DEBUG] Text input completed:', testText);
            
            // ボタンクリック前の状態確認
            const preClickState = {
                ichingSimulatorReady: window.ichingSimulator?.isReady?.() || false,
                hasAnalyzeSituation: typeof window.ichingSimulator?.analyzeSituation === 'function',
                hasHandleSituationInput: typeof window.ichingSimulator?.handleSituationInput === 'function'
            };
            
            console.log('🎯 [DEBUG] Pre-click state:', preClickState);
            
            // ボタンクリック
            console.log('🎯 [DEBUG] Clicking analyze button...');
            analyzeBtn.click();
            console.log('🎯 [DEBUG] Button click completed');
            
            return {
                textSet: true,
                inputText: testText,
                buttonClicked: true,
                preClickState
            };
        });
        
        console.log('\\n[FORM DEBUG] 操作結果:');
        console.log('=====================');
        console.log(`  📊 テキスト設定: ${operationResult.textSet ? '✅' : '❌'}`);
        console.log(`  📊 入力内容: "${operationResult.inputText}"`);
        console.log(`  📊 ボタンクリック: ${operationResult.buttonClicked ? '✅' : '❌'}`);
        console.log(`  📊 事前状態 - ichingSimulatorReady: ${operationResult.preClickState.ichingSimulatorReady ? '✅' : '❌'}`);
        console.log(`  📊 事前状態 - hasAnalyzeSituation: ${operationResult.preClickState.hasAnalyzeSituation ? '✅' : '❌'}`);
        console.log(`  📊 事前状態 - hasHandleSituationInput: ${operationResult.preClickState.hasHandleSituationInput ? '✅' : '❌'}`);
        
        // 分析処理の監視（詳細ログ出力）
        console.log('\\n[FORM DEBUG] 分析処理監視（20秒間）...');
        
        for (let i = 0; i < 7; i++) {
            await page.waitForTimeout(3000);
            
            const currentState = await page.evaluate(() => {
                return {
                    statusText: document.querySelector('.status-text')?.textContent || 'No status',
                    futureAnalysisCompleted: window.futureAnalysisCompleted,
                    containerContent: document.getElementById('i-ching-container')?.innerHTML?.length || 0,
                    displayContainer: !!document.getElementById('eight-scenarios-display-container')
                };
            });
            
            console.log(`  ⏱️ ${i*3}秒後:`);
            console.log(`    Status: "${currentState.statusText}"`);
            console.log(`    futureAnalysisCompleted: ${currentState.futureAnalysisCompleted ? '✅' : '❌'}`);
            console.log(`    Container content: ${currentState.containerContent}文字`);
            
            if (currentState.statusText.includes('分析') && currentState.statusText !== '易経シミュレーター準備完了') {
                console.log('    → 分析プロセスが開始された可能性');
                break;
            }
        }
        
        // 詳細ログ分析
        const formLogs = logs.filter(log => 
            log.includes('form') || 
            log.includes('submit') || 
            log.includes('analyze') ||
            log.includes('[DEBUG]') ||
            log.includes('click')
        );
        
        console.log(`\\n[FORM DEBUG] フォーム関連ログ: ${formLogs.length}件`);
        formLogs.slice(0, 20).forEach(log => {
            console.log(`  📋 ${log}`);
        });
        
        console.log(`\\n[FORM DEBUG] エラー: ${errors.length}件`);
        errors.forEach(error => {
            console.log(`  ❌ ${error}`);
        });
        
        const success = formLogs.some(log => log.includes('analyzeSituation') || log.includes('handleSituationInput'));
        
        return {
            success,
            formState,
            operationResult,
            formLogs: formLogs.length,
            errors: errors.length
        };
        
    } catch (error) {
        console.error('[FORM DEBUG] エラー:', error);
        return { 
            success: false, 
            error: error.message 
        };
    } finally {
        console.log('\\n[FORM DEBUG] 結果確認のため15秒間表示...');
        await new Promise(resolve => setTimeout(resolve, 15000));
        await browser.close();
    }
}

// 実行
debugFormSubmit().then(result => {
    console.log('\\n📋 フォームサブミットデバッグ完了');
    console.log('==================================');
    
    if (result.success) {
        console.log('✅ フォームサブミット: 正常動作');
    } else {
        console.log('❌ フォームサブミット: 問題あり');
        if (result.error) {
            console.log('Error:', result.error);
        }
        console.log('→ イベントリスナーまたはフォーム処理の問題');
    }
    
}).catch(console.error);