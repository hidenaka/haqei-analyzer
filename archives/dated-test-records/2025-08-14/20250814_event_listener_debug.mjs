/**
 * イベントリスナー詳細デバッグ
 */

import { chromium } from 'playwright';

async function debugEventListeners() {
    console.log('[EVENT DEBUG] イベントリスナー詳細デバッグ開始');
    console.log('===========================================');
    
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
        });
        
        console.log('[EVENT DEBUG] ページアクセス...');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        
        await page.waitForTimeout(8000);
        
        // DOM要素の詳細情報取得
        const domAnalysis = await page.evaluate(() => {
            const textarea = document.getElementById('situation-text');
            const analyzeBtn = document.querySelector('.analyze-btn.primary');
            const form = document.getElementById('situation-analysis-form');
            
            // イベントリスナーの確認（デバッガ用）
            function getEventListeners(element) {
                // ブラウザでgetEventListenersは開発者ツールでのみ利用可能
                // 代替手法でイベントを確認
                return {
                    onclick: element.onclick !== null,
                    onsubmit: element.onsubmit !== null,
                    hasClickAttribute: element.hasAttribute('onclick'),
                    hasSubmitAttribute: element.hasAttribute('onsubmit')
                };
            }
            
            return {
                textarea: {
                    exists: !!textarea,
                    parentForm: textarea?.form?.id || null
                },
                button: {
                    exists: !!analyzeBtn,
                    type: analyzeBtn?.type || null,
                    form: analyzeBtn?.form?.id || null,
                    events: analyzeBtn ? getEventListeners(analyzeBtn) : null
                },
                form: {
                    exists: !!form,
                    action: form?.action || '',
                    method: form?.method || '',
                    events: form ? getEventListeners(form) : null,
                    childrenCount: form?.children.length || 0
                },
                // IChingFutureSimulatorのインスタンス確認
                ichingSimulator: {
                    exists: !!window.ichingSimulator,
                    type: window.ichingSimulator?.constructor?.name || 'unknown',
                    isReady: typeof window.ichingSimulator?.isReady === 'function' ? window.ichingSimulator.isReady() : false
                }
            };
        });
        
        console.log('\\n[EVENT DEBUG] DOM分析:');
        console.log('======================');
        console.log('📊 Textarea:');
        console.log(`  - exists: ${domAnalysis.textarea.exists ? '✅' : '❌'}`);
        console.log(`  - parentForm: ${domAnalysis.textarea.parentForm}`);
        console.log('📊 Analyze Button:');
        console.log(`  - exists: ${domAnalysis.button.exists ? '✅' : '❌'}`);
        console.log(`  - type: ${domAnalysis.button.type}`);
        console.log(`  - form: ${domAnalysis.button.form}`);
        console.log(`  - events:`, domAnalysis.button.events);
        console.log('📊 Form:');
        console.log(`  - exists: ${domAnalysis.form.exists ? '✅' : '❌'}`);
        console.log(`  - action: "${domAnalysis.form.action}"`);
        console.log(`  - method: "${domAnalysis.form.method}"`);
        console.log(`  - childrenCount: ${domAnalysis.form.childrenCount}`);
        console.log(`  - events:`, domAnalysis.form.events);
        console.log('📊 I Ching Simulator:');
        console.log(`  - exists: ${domAnalysis.ichingSimulator.exists ? '✅' : '❌'}`);
        console.log(`  - type: ${domAnalysis.ichingSimulator.type}`);
        console.log(`  - isReady: ${domAnalysis.ichingSimulator.isReady ? '✅' : '❌'}`);
        
        // 手動でイベント発火テスト
        console.log('\\n[EVENT DEBUG] 手動イベント発火テスト...');
        const eventTest = await page.evaluate(() => {
            const textarea = document.getElementById('situation-text');
            const form = document.getElementById('situation-analysis-form');
            
            // テキスト入力
            textarea.value = 'イベントテスト用の入力テキストです。';
            
            let submitEventFired = false;
            
            // 一時的なリスナー追加でイベント発火を確認
            const tempListener = (e) => {
                submitEventFired = true;
                e.preventDefault();
                console.log('🎯 [TEMP DEBUG] Submit event fired successfully');
            };
            
            form.addEventListener('submit', tempListener);
            
            // フォームのsubmitイベントを手動発火
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            form.dispatchEvent(submitEvent);
            
            // 一時リスナー削除
            form.removeEventListener('submit', tempListener);
            
            return {
                submitEventFired,
                inputText: textarea.value
            };
        });
        
        console.log('\\n[EVENT DEBUG] イベント発火テスト結果:');
        console.log('===================================');
        console.log(`  📊 Submit Event Fired: ${eventTest.submitEventFired ? '✅' : '❌'}`);
        console.log(`  📊 Input Text: "${eventTest.inputText}"`);
        
        // さらに詳細な分析: ボタンクリックの実際の動作
        console.log('\\n[EVENT DEBUG] ボタンクリック実行...');
        await page.evaluate(() => {
            const textarea = document.getElementById('situation-text');
            const analyzeBtn = document.querySelector('.analyze-btn.primary');
            
            textarea.value = 'ボタンクリックテスト用入力';
            
            // クリックイベント発火前のコンソール出力
            console.log('🎯 [EVENT DEBUG] About to click analyze button');
            console.log('🎯 [EVENT DEBUG] Button exists:', !!analyzeBtn);
            console.log('🎯 [EVENT DEBUG] Button type:', analyzeBtn?.type);
            console.log('🎯 [EVENT DEBUG] Form exists:', !!document.getElementById('situation-analysis-form'));
            
            if (analyzeBtn) {
                analyzeBtn.click();
                console.log('🎯 [EVENT DEBUG] Button click executed');
            }
        });
        
        // クリック後の状態確認
        await page.waitForTimeout(3000);
        
        const postClickLogs = logs.filter(log => 
            log.includes('[EVENT DEBUG]') || 
            log.includes('[DEBUG]') ||
            log.includes('Form submitted') ||
            log.includes('handleSituationInput')
        ).slice(-10);
        
        console.log('\\n[EVENT DEBUG] クリック後のログ:');
        console.log('==============================');
        postClickLogs.forEach(log => {
            console.log(`  📋 ${log}`);
        });
        
        console.log(`\\n[EVENT DEBUG] 総ログ数: ${logs.length}件`);
        console.log(`[EVENT DEBUG] エラー数: ${errors.length}件`);
        
        const success = postClickLogs.some(log => log.includes('Form submitted') || log.includes('handleSituationInput'));
        
        return {
            success,
            domAnalysis,
            eventTest,
            postClickLogs: postClickLogs.length,
            totalLogs: logs.length,
            errors: errors.length
        };
        
    } catch (error) {
        console.error('[EVENT DEBUG] エラー:', error);
        return { 
            success: false, 
            error: error.message 
        };
    } finally {
        console.log('\\n[EVENT DEBUG] 結果確認のため15秒間表示...');
        await new Promise(resolve => setTimeout(resolve, 15000));
        await browser.close();
    }
}

// 実行
debugEventListeners().then(result => {
    console.log('\\n📋 イベントリスナーデバッグ完了');
    console.log('==============================');
    
    if (result.success) {
        console.log('✅ イベントリスナー: 正常動作');
    } else {
        console.log('❌ イベントリスナー: 問題あり');
        if (result.error) {
            console.log('Error:', result.error);
        }
        console.log('→ フォームsubmitイベントが発火していない');
    }
    
}).catch(console.error);