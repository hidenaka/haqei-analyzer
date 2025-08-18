/**
 * eight-scenarios-display-container消失の追跡
 */

import { chromium } from 'playwright';

async function traceContainerDestruction() {
    console.log('🔍 Container消失の追跡');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false
    });
    
    try {
        const page = await browser.newPage();
        
        // DOM変更を監視
        await page.evaluateOnNewDocument(() => {
            window.domChanges = [];
            
            // DOMContentLoaded後に監視開始
            document.addEventListener('DOMContentLoaded', () => {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach(mutation => {
                        if (mutation.type === 'childList') {
                            // eight-scenarios-display-containerの削除を検出
                            Array.from(mutation.removedNodes).forEach(node => {
                                if (node.id === 'eight-scenarios-display-container') {
                                    console.error('🚨 eight-scenarios-display-container was REMOVED!');
                                    window.domChanges.push({
                                        type: 'CONTAINER_REMOVED',
                                        timestamp: Date.now(),
                                        parentId: mutation.target.id || mutation.target.className,
                                        stack: new Error().stack
                                    });
                                }
                            });
                            
                            // resultsContainerへのinnerHTML操作を検出
                            if (mutation.target.id === 'resultsContainer' && mutation.removedNodes.length > 0) {
                                window.domChanges.push({
                                    type: 'RESULTS_CONTAINER_CLEARED',
                                    timestamp: Date.now(),
                                    removedCount: mutation.removedNodes.length,
                                    stack: new Error().stack
                                });
                            }
                        }
                    });
                });
                
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            });
            
            // innerHTML操作を監視
            const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
            Object.defineProperty(Element.prototype, 'innerHTML', {
                set: function(value) {
                    if (this.id === 'resultsContainer') {
                        console.warn('⚠️ innerHTML set on resultsContainer');
                        window.domChanges.push({
                            type: 'INNERHTML_ON_RESULTS',
                            timestamp: Date.now(),
                            valueLength: value.length,
                            containsEightScenarios: value.includes('eight-scenarios')
                        });
                    }
                    return originalInnerHTML.set.call(this, value);
                }
            });
        });
        
        console.log('📋 Step 1: 初期状態');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle'
        });
        
        await page.waitForTimeout(1000);
        
        const initial = await page.evaluate(() => {
            const container = document.getElementById('eight-scenarios-display-container');
            return {
                exists: !!container,
                parent: container?.parentElement?.id,
                innerHTML: container?.innerHTML.substring(0, 100)
            };
        });
        
        console.log(`  Container: ${initial.exists ? '✅' : '❌'}`);
        if (initial.exists) {
            console.log(`  Parent: ${initial.parent}`);
        }
        
        console.log('\n📋 Step 2: 分析実行');
        
        await page.fill('textarea', 'テスト');
        await page.evaluate(() => {
            const btn = document.querySelector('#aiGuessBtn');
            if (btn) btn.click();
        });
        
        await page.waitForTimeout(5000);
        
        console.log('\n📋 Step 3: DOM変更の分析');
        
        const changes = await page.evaluate(() => window.domChanges || []);
        
        if (changes.length > 0) {
            console.log(`\n  検出された変更: ${changes.length}件`);
            changes.forEach((change, i) => {
                console.log(`\n  ${i + 1}. ${change.type}`);
                console.log(`     時刻: ${new Date(change.timestamp).toLocaleTimeString()}`);
                
                if (change.type === 'CONTAINER_REMOVED') {
                    console.log(`     ❌ Containerが削除された！`);
                    console.log(`     親要素: ${change.parentId}`);
                }
                
                if (change.type === 'INNERHTML_ON_RESULTS') {
                    console.log(`     innerHTML操作`);
                    console.log(`     eight-scenarios含む: ${change.containsEightScenarios ? '✅' : '❌'}`);
                }
                
                if (change.stack) {
                    const stackLines = change.stack.split('\n').slice(1, 4);
                    console.log('     スタックトレース:');
                    stackLines.forEach(line => {
                        console.log(`       ${line.trim()}`);
                    });
                }
            });
        }
        
        // どのファイルがinnerHTMLを使っているか特定
        console.log('\n📋 Step 4: innerHTML使用箇所の特定');
        
        const culprit = await page.evaluate(() => {
            // binary-tree-complete-displayの確認
            if (window.displayBinaryTreeResults) {
                const code = window.displayBinaryTreeResults.toString();
                return {
                    hasBinaryTreeDisplay: true,
                    usesInnerHTML: code.includes('innerHTML'),
                    codeSnippet: code.substring(0, 500)
                };
            }
            return { hasBinaryTreeDisplay: false };
        });
        
        if (culprit.hasBinaryTreeDisplay) {
            console.log(`\n  binary-tree-complete-display:`);
            console.log(`    innerHTML使用: ${culprit.usesInnerHTML ? '❌ YES' : '✅ NO'}`);
        }
        
        console.log('\n=====================================');
        console.log('📊 診断結果');
        console.log('=====================================\n');
        
        const containerRemoved = changes.some(c => c.type === 'CONTAINER_REMOVED');
        const innerHTMLUsed = changes.some(c => c.type === 'INNERHTML_ON_RESULTS');
        
        if (containerRemoved) {
            console.log('❌ eight-scenarios-display-containerが削除されている');
        }
        
        if (innerHTMLUsed) {
            console.log('❌ resultsContainerにinnerHTMLが使用されている');
            console.log('   → これがContainerを破壊している原因');
        }
        
        console.log('\n📝 解決策:');
        console.log('  1. binary-tree-complete-displayのinnerHTML使用を停止');
        console.log('  2. またはSafeDOMUpdaterでContainerを保護');
        console.log('  3. またはbinary-treeとeight-scenariosの表示を分離');
        
    } finally {
        await page.waitForTimeout(5000);
        await browser.close();
    }
}

// 実行
traceContainerDestruction().catch(console.error);