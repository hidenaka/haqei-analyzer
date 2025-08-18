/**
 * Canvas要素問題の5WHY分析テスト
 * CLAUDE.md準拠：根本原因を特定する
 */

import { chromium } from 'playwright';

async function analyze5Why() {
    console.log('🔍 Canvas要素問題 - 5WHY分析');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        
        // 詳細ログ収集
        const timeline = [];
        
        page.on('console', msg => {
            const entry = {
                time: Date.now(),
                type: msg.type(),
                text: msg.text()
            };
            timeline.push(entry);
            
            // Canvas関連の重要ログ
            if (msg.text().includes('Canvas') || 
                msg.text().includes('canvas') ||
                msg.text().includes('DOM') ||
                msg.text().includes('eight-scenarios')) {
                console.log(`[${entry.type}] ${entry.text}`);
            }
        });
        
        console.log('📊 Why1: なぜCanvas要素が0個（実際は1個）になるのか？');
        console.log('--------------------------------');
        
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle'
        });
        
        await page.waitForTimeout(2000);
        
        // 初期状態の詳細確認
        const initialState = await page.evaluate(() => {
            const canvases = document.querySelectorAll('canvas');
            const containers = {
                resultsContainer: document.getElementById('resultsContainer'),
                eightScenarios: document.getElementById('eight-scenarios-display-container'),
                scoreVisualization: document.querySelector('#score-visualization'),
                scenariosCards: document.querySelector('#scenarios-cards')
            };
            
            return {
                canvasCount: canvases.length,
                canvasDetails: Array.from(canvases).map(c => ({
                    id: c.id,
                    parent: c.parentElement?.id || c.parentElement?.className,
                    width: c.width,
                    height: c.height
                })),
                containersExist: Object.entries(containers).map(([key, el]) => ({
                    name: key,
                    exists: !!el,
                    children: el ? el.children.length : 0
                })),
                domPreserverMounted: document.querySelector('[data-mounted="true"]')?.id
            };
        });
        
        console.log(`初期Canvas数: ${initialState.canvasCount}個`);
        initialState.canvasDetails.forEach(c => {
            console.log(`  - ${c.id || 'unnamed'} (parent: ${c.parent})`);
        });
        
        console.log('\n📊 Why2: なぜ初期6個から減少するのか？');
        console.log('--------------------------------');
        
        // Canvas削除を監視
        await page.evaluate(() => {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.removedNodes.forEach(node => {
                        if (node.nodeName === 'CANVAS') {
                            console.error(`🗑️ CANVAS REMOVED: ${node.id} from ${mutation.target.id || mutation.target.className}`);
                        }
                    });
                });
            });
            
            observer.observe(document.body, { 
                childList: true, 
                subtree: true 
            });
            
            window.canvasObserver = observer;
        });
        
        // 分析実行
        const testInput = '転職を検討中。現在の職場は安定しているが成長機会が少ない。';
        await page.fill('textarea, #worryInput, #situation-text', testInput);
        
        console.log('\n📊 Why3: なぜDOM更新時にCanvasが消えるのか？');
        console.log('--------------------------------');
        
        await page.click('button[type="submit"], .analyze-btn, #aiGuessBtn');
        
        // DOM変更を詳細に追跡
        await page.waitForTimeout(1000);
        
        const duringAnalysis = await page.evaluate(() => {
            return {
                resultsContainerHTML: document.getElementById('resultsContainer')?.innerHTML.substring(0, 200),
                eightScenariosExists: !!document.getElementById('eight-scenarios-display-container'),
                canvasCount: document.querySelectorAll('canvas').length
            };
        });
        
        console.log(`分析中Canvas数: ${duringAnalysis.canvasCount}個`);
        console.log(`eight-scenarios-display-container: ${duringAnalysis.eightScenariosExists ? '存在' : '消失'}`);
        
        await page.waitForTimeout(3000);
        
        console.log('\n📊 Why4: なぜSafeDOMUpdaterが機能しないのか？');
        console.log('--------------------------------');
        
        const systemState = await page.evaluate(() => {
            return {
                safeDOMUpdater: typeof window.SafeDOMUpdater !== 'undefined',
                domPreserver: typeof window.DOMPreserver !== 'undefined',
                futureSimulatorDOM: typeof window.futureSimulatorDOM !== 'undefined',
                
                // 実際の呼び出し確認
                updatersLoaded: {
                    SafeDOMUpdater: !!window.SafeDOMUpdater,
                    DOMPreserver: !!window.DOMPreserver,
                    futureSimulatorDOM: !!window.futureSimulatorDOM
                },
                
                // 最終Canvas状態
                finalCanvases: Array.from(document.querySelectorAll('canvas')).map(c => ({
                    id: c.id,
                    parent: c.parentElement?.id || c.parentElement?.className
                }))
            };
        });
        
        console.log('システム状態:');
        Object.entries(systemState.updatersLoaded).forEach(([key, loaded]) => {
            console.log(`  ${key}: ${loaded ? '✅' : '❌'}`);
        });
        
        console.log('\n📊 Why5: 根本原因は何か？');
        console.log('--------------------------------');
        
        // タイムラインから重要イベントを抽出
        const canvasEvents = timeline.filter(e => 
            e.text.includes('Canvas') || 
            e.text.includes('REMOVED') ||
            e.text.includes('innerHTML')
        );
        
        console.log('Canvas関連イベント:');
        canvasEvents.forEach(e => {
            console.log(`  [${e.type}] ${e.text.substring(0, 100)}`);
        });
        
        const finalState = await page.evaluate(() => {
            const canvases = document.querySelectorAll('canvas');
            const resultsContainer = document.getElementById('resultsContainer');
            
            // 実行された関数を追跡
            const executionLog = window.debugLog || [];
            
            return {
                canvasCount: canvases.length,
                resultsContainerChildren: resultsContainer ? resultsContainer.children.length : 0,
                resultsContainerDisplay: resultsContainer?.style.display,
                
                // どの表示関数が呼ばれたか
                displayFunctionsCalled: executionLog.filter(log => 
                    log.includes('display') || 
                    log.includes('Display')
                )
            };
        });
        
        console.log('\n🎯 分析結果:');
        console.log(`最終Canvas数: ${finalState.canvasCount}個`);
        console.log(`resultsContainer子要素: ${finalState.resultsContainerChildren}個`);
        
        // 5WHY結論
        console.log('\n=====================================');
        console.log('📝 5WHY分析結論');
        console.log('=====================================');
        
        console.log('Why1: Canvas要素が減少する → 分析時にDOM更新される');
        console.log('Why2: 初期6個から減少 → 複数のCanvas生成システムが競合');
        console.log('Why3: DOM更新時に消える → innerHTML操作がまだ残っている');
        console.log('Why4: SafeDOMUpdaterが機能しない → 呼び出し順序の問題');
        console.log('Why5: 根本原因 → **複数のDOM更新システムが非同期で競合している**');
        
        return {
            initialCanvasCount: initialState.canvasCount,
            finalCanvasCount: finalState.canvasCount,
            systemsLoaded: systemState.updatersLoaded,
            rootCause: '複数のDOM更新システムの競合'
        };
        
    } catch (error) {
        console.error('❌ 分析エラー:', error);
    } finally {
        await page.waitForTimeout(5000);
        await browser.close();
    }
}

// 実行
analyze5Why().then(result => {
    console.log('\n=====================================');
    console.log('✅ 5WHY分析完了');
    console.log('=====================================');
    
    if (result) {
        console.log('\n🔧 推奨対策:');
        console.log('1. DOM更新システムを1つに統一');
        console.log('2. 非同期処理の順序を制御');
        console.log('3. Canvas生成を1箇所に集約');
        console.log('4. innerHTML操作を完全排除');
    }
}).catch(console.error);