/**
 * 最終検証テスト - エラー解消確認
 */

import { chromium } from 'playwright';

async function finalVerification() {
    console.log('🎯 最終エラー解消検証');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // エラー収集
        const errors = [];
        let containerNotFoundError = false;
        
        page.on('pageerror', error => {
            errors.push({
                type: 'page_error',
                message: error.message
            });
        });
        
        page.on('console', msg => {
            if (msg.type() === 'error') {
                const text = msg.text();
                errors.push({
                    type: 'console_error',
                    message: text
                });
                
                if (text.includes('Container not found: eight-scenarios-display-container')) {
                    containerNotFoundError = true;
                }
            }
        });
        
        console.log('📋 Step 1: ページ読み込み');
        console.log('--------------------------------');
        
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle'
        });
        
        await page.waitForTimeout(2000);
        
        // 初期状態の確認
        const initialState = await page.evaluate(() => {
            const canvases = document.querySelectorAll('canvas');
            const container = document.getElementById('eight-scenarios-display-container');
            const resultsContainer = document.getElementById('resultsContainer');
            const singleDOM = window.SingleDOMManager;
            
            // デバッグ情報
            console.log('Canvas elements:', canvases.length);
            console.log('Container exists:', !!container);
            console.log('SingleDOMManager:', singleDOM);
            
            return {
                canvas: {
                    count: canvases.length,
                    ids: Array.from(canvases).map(c => c.id || 'unnamed')
                },
                containers: {
                    eight: !!container,
                    results: !!resultsContainer
                },
                singleDOM: {
                    exists: !!singleDOM,
                    initialized: singleDOM?.initialized || false
                }
            };
        });
        
        console.log(`  Canvas要素: ${initialState.canvas.count}個`);
        console.log(`  eight-scenarios-display-container: ${initialState.containers.eight ? '✅' : '❌'}`);
        console.log(`  SingleDOMManager: ${initialState.singleDOM.initialized ? '✅ 初期化済み' : '❌ 未初期化'}`);
        
        const initialErrors = errors.filter(e => 
            !e.message.includes('CSP') && 
            !e.message.includes('Content Security')
        );
        console.log(`  初期エラー: ${initialErrors.length}件`);
        
        console.log('\n📋 Step 2: 分析実行');
        console.log('--------------------------------');
        
        // エラーリセット
        errors.length = 0;
        containerNotFoundError = false;
        
        // 分析実行
        await page.fill('textarea', '転職を検討中。新しい挑戦をしたい。');
        
        await page.evaluate(() => {
            const btn = document.querySelector('#aiGuessBtn');
            if (btn && !btn.disabled) {
                console.log('Clicking analyze button...');
                btn.click();
            }
        });
        
        console.log('  分析開始...');
        
        // 結果待機
        await page.waitForFunction(() => {
            const cards = document.querySelectorAll('.scenario-card');
            const hasContent = document.body.textContent.includes('分析結果') || 
                             document.body.textContent.includes('易経') ||
                             cards.length > 0;
            return hasContent;
        }, { timeout: 15000 }).catch(() => {
            console.log('  ⚠️ 結果表示タイムアウト');
        });
        
        await page.waitForTimeout(3000);
        
        // 分析後の状態
        const afterState = await page.evaluate(() => {
            const canvases = document.querySelectorAll('canvas');
            const container = document.getElementById('eight-scenarios-display-container');
            const cards = document.querySelectorAll('.scenario-card');
            const cardsContainer = document.getElementById('scenarios-cards');
            
            // コンテナの内容を詳細に確認
            let containerInfo = null;
            if (container) {
                containerInfo = {
                    visible: window.getComputedStyle(container).display !== 'none',
                    children: container.children.length,
                    hasCards: container.querySelector('.scenario-card') !== null,
                    innerHTML: container.innerHTML.substring(0, 100)
                };
            }
            
            return {
                canvas: {
                    count: canvases.length,
                    ids: Array.from(canvases).map(c => c.id || 'unnamed'),
                    allConnected: Array.from(canvases).every(c => c.isConnected)
                },
                container: {
                    exists: !!container,
                    info: containerInfo
                },
                cards: {
                    count: cards.length,
                    inContainer: cardsContainer ? cardsContainer.children.length : 0
                }
            };
        });
        
        console.log(`  Canvas要素: ${afterState.canvas.count}個 (${afterState.canvas.allConnected ? '接続済み' : '切断'})`);
        console.log(`  Container: ${afterState.container.exists ? '✅' : '❌'}`);
        if (afterState.container.info) {
            console.log(`    - 表示: ${afterState.container.info.visible ? '✅' : '❌'}`);
            console.log(`    - 子要素: ${afterState.container.info.children}個`);
            console.log(`    - カード有: ${afterState.container.info.hasCards ? '✅' : '❌'}`);
        }
        console.log(`  シナリオカード: ${afterState.cards.count}個`);
        console.log(`  Container内カード: ${afterState.cards.inContainer}個`);
        
        const analysisErrors = errors.filter(e => 
            !e.message.includes('CSP') && 
            !e.message.includes('Content Security')
        );
        console.log(`  分析時エラー: ${analysisErrors.length}件`);
        
        if (containerNotFoundError) {
            console.log('  ⚠️ "Container not found" エラーが発生');
        }
        
        console.log('\n📋 Step 3: Canvas維持確認');
        console.log('--------------------------------');
        
        const canvasComparison = {
            before: initialState.canvas.count,
            after: afterState.canvas.count,
            maintained: afterState.canvas.count >= initialState.canvas.count
        };
        
        console.log(`  初期: ${canvasComparison.before}個`);
        console.log(`  分析後: ${canvasComparison.after}個`);
        console.log(`  維持状態: ${canvasComparison.maintained ? '✅ 維持' : '❌ 減少'}`);
        
        console.log('\n=====================================');
        console.log('📊 最終評価');
        console.log('=====================================\n');
        
        const success = [];
        const issues = [];
        
        // 成功項目
        if (initialState.singleDOM.initialized) {
            success.push('✅ SingleDOMManager初期化完了');
        }
        
        if (afterState.container.exists) {
            success.push('✅ eight-scenarios-display-container存在');
        }
        
        if (canvasComparison.maintained) {
            success.push('✅ Canvas要素維持');
        }
        
        if (analysisErrors.length === 0) {
            success.push('✅ CSP以外のエラーなし');
        }
        
        if (!containerNotFoundError) {
            success.push('✅ Container not foundエラーなし');
        }
        
        // 問題項目
        if (!initialState.singleDOM.initialized) {
            issues.push('❌ SingleDOMManager未初期化');
        }
        
        if (!afterState.container.exists) {
            issues.push('❌ eight-scenarios-display-container不在');
        }
        
        if (!canvasComparison.maintained) {
            issues.push(`❌ Canvas要素減少 (${canvasComparison.before} → ${canvasComparison.after})`);
        }
        
        if (afterState.cards.count === 0) {
            issues.push('❌ シナリオカード未表示');
        }
        
        if (containerNotFoundError) {
            issues.push('❌ Container not foundエラー発生');
        }
        
        // 結果表示
        if (success.length > 0) {
            console.log('成功項目:');
            success.forEach(s => console.log(`  ${s}`));
        }
        
        if (issues.length > 0) {
            console.log('\n要改善項目:');
            issues.forEach(i => console.log(`  ${i}`));
        }
        
        // 総合判定
        const score = (success.length / (success.length + issues.length)) * 100;
        
        console.log(`\n総合スコア: ${Math.round(score)}%`);
        
        if (score >= 80) {
            console.log('🎉 エラー解消成功！');
        } else if (score >= 60) {
            console.log('⚠️ 部分的改善達成');
        } else {
            console.log('❌ 追加対応必要');
        }
        
        // メモリに保存する内容
        const report = {
            date: new Date().toISOString(),
            score: Math.round(score),
            canvas: canvasComparison,
            errors: {
                initial: initialErrors.length,
                analysis: analysisErrors.length,
                containerNotFound: containerNotFoundError
            },
            success: success.length,
            issues: issues.length
        };
        
        console.log('\n📝 レポート:');
        console.log(JSON.stringify(report, null, 2));
        
    } catch (error) {
        console.error('❌ Fatal error:', error.message);
    } finally {
        console.log('\n⏰ 5秒後にブラウザを閉じます...');
        await page.waitForTimeout(5000);
        await browser.close();
    }
}

// 実行
finalVerification().catch(console.error);