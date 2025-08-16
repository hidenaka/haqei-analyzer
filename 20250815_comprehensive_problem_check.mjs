/**
 * 包括的問題確認テスト
 * 全体の問題状況を詳細に確認
 */

import { chromium } from 'playwright';

async function comprehensiveProblemCheck() {
    console.log('🔍 包括的問題確認');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox']
    });
    
    const allProblems = {
        innerHTML: [],
        canvasDestruction: [],
        containerIssues: [],
        errors: [],
        domChanges: []
    };
    
    try {
        const page = await browser.newPage();
        
        // DOM変更を監視
        await page.evaluateOnNewDocument(() => {
            window.domMutations = [];
            
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mut => {
                    if (mut.type === 'childList' && mut.removedNodes.length > 0) {
                        Array.from(mut.removedNodes).forEach(node => {
                            if (node.tagName === 'CANVAS' || node.id === 'eight-scenarios-display-container') {
                                window.domMutations.push({
                                    type: 'removed',
                                    element: node.tagName || 'text',
                                    id: node.id,
                                    timestamp: Date.now()
                                });
                            }
                        });
                    }
                });
            });
            
            document.addEventListener('DOMContentLoaded', () => {
                observer.observe(document.body, { 
                    childList: true, 
                    subtree: true 
                });
            });
        });
        
        // エラー監視
        page.on('pageerror', error => {
            allProblems.errors.push({
                type: 'page_error',
                message: error.message,
                stack: error.stack?.split('\n')[0]
            });
        });
        
        page.on('console', msg => {
            if (msg.type() === 'error') {
                allProblems.errors.push({
                    type: 'console_error',
                    text: msg.text()
                });
            } else if (msg.type() === 'log' && msg.text().includes('innerHTML')) {
                allProblems.innerHTML.push({
                    message: msg.text(),
                    location: msg.location()
                });
            }
        });
        
        console.log('📋 Step 1: 初期ロード確認');
        console.log('--------------------------------');
        
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle'
        });
        
        await page.waitForTimeout(2000);
        
        // innerHTML使用箇所を検索
        const innerHTMLUsage = await page.evaluate(() => {
            const scripts = Array.from(document.scripts);
            const results = [];
            
            // 読み込まれているスクリプトファイル
            scripts.forEach(script => {
                if (script.src) {
                    results.push({
                        type: 'external',
                        src: script.src.replace(window.location.origin, '')
                    });
                }
            });
            
            // グローバルオブジェクトの確認
            const globals = {
                SingleDOMManager: typeof window.SingleDOMManager !== 'undefined',
                haqeiFutureSimulator: typeof window.haqeiFutureSimulator !== 'undefined',
                SafeDOMUpdater: typeof window.SafeDOMUpdater !== 'undefined',
                DOMPreserver: typeof window.DOMPreserver !== 'undefined',
                FutureSimulatorDOMIntegration: typeof window.FutureSimulatorDOMIntegration !== 'undefined'
            };
            
            return { scripts: results, globals };
        });
        
        console.log('  読み込まれているスクリプト:');
        innerHTMLUsage.scripts.forEach(s => {
            console.log(`    - ${s.src}`);
        });
        
        console.log('\n  グローバルオブジェクト:');
        Object.entries(innerHTMLUsage.globals).forEach(([name, exists]) => {
            console.log(`    ${name}: ${exists ? '✅' : '❌'}`);
        });
        
        // 初期Canvas状態
        const initialState = await page.evaluate(() => {
            const canvases = document.querySelectorAll('canvas');
            const container = document.getElementById('eight-scenarios-display-container');
            
            return {
                canvasCount: canvases.length,
                canvasIds: Array.from(canvases).map(c => c.id),
                containerExists: !!container,
                containerChildren: container ? container.children.length : 0
            };
        });
        
        console.log('\n  初期状態:');
        console.log(`    Canvas数: ${initialState.canvasCount}個`);
        console.log(`    Container: ${initialState.containerExists ? '✅' : '❌'}`);
        
        console.log('\n📋 Step 2: innerHTML操作の追跡');
        console.log('--------------------------------');
        
        // innerHTML操作を監視
        await page.evaluate(() => {
            const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
            let innerHTMLCalls = [];
            
            Object.defineProperty(Element.prototype, 'innerHTML', {
                set: function(value) {
                    innerHTMLCalls.push({
                        element: this.tagName,
                        id: this.id,
                        className: this.className,
                        value: value.substring(0, 100),
                        stack: new Error().stack.split('\n').slice(2, 5).join('\n')
                    });
                    
                    console.log(`⚠️ innerHTML called on ${this.tagName}#${this.id}`);
                    
                    return originalInnerHTML.set.call(this, value);
                }
            });
            
            window.innerHTMLCalls = innerHTMLCalls;
        });
        
        console.log('  innerHTML監視設定完了');
        
        console.log('\n📋 Step 3: 分析実行と問題追跡');
        console.log('--------------------------------');
        
        // 分析実行
        await page.fill('textarea', 'テスト入力');
        
        await page.evaluate(() => {
            const btn = document.querySelector('#aiGuessBtn');
            if (btn) {
                console.log('Clicking button...');
                btn.click();
            }
        });
        
        console.log('  分析開始...');
        
        await page.waitForTimeout(5000);
        
        // innerHTML呼び出しを収集
        const innerHTMLCalls = await page.evaluate(() => window.innerHTMLCalls || []);
        
        if (innerHTMLCalls.length > 0) {
            console.log(`\n  ⚠️ innerHTML呼び出し検出: ${innerHTMLCalls.length}回`);
            innerHTMLCalls.slice(0, 3).forEach((call, i) => {
                console.log(`\n  呼び出し${i + 1}:`);
                console.log(`    要素: ${call.element}#${call.id || 'no-id'}`);
                console.log(`    スタック:\n${call.stack}`);
            });
            allProblems.innerHTML = innerHTMLCalls;
        }
        
        // DOM変更を収集
        const domChanges = await page.evaluate(() => window.domMutations || []);
        
        if (domChanges.length > 0) {
            console.log(`\n  ⚠️ DOM要素削除検出: ${domChanges.length}件`);
            domChanges.forEach((change, i) => {
                console.log(`    ${i + 1}. ${change.element}#${change.id || 'no-id'} が削除`);
            });
            allProblems.domChanges = domChanges;
        }
        
        // 分析後の状態
        const afterState = await page.evaluate(() => {
            const canvases = document.querySelectorAll('canvas');
            const container = document.getElementById('eight-scenarios-display-container');
            const resultsContainer = document.getElementById('resultsContainer');
            
            return {
                canvasCount: canvases.length,
                canvasIds: Array.from(canvases).map(c => c.id),
                containerExists: !!container,
                resultsVisible: resultsContainer && resultsContainer.style.display !== 'none'
            };
        });
        
        console.log('\n  分析後状態:');
        console.log(`    Canvas数: ${afterState.canvasCount}個`);
        console.log(`    Container: ${afterState.containerExists ? '✅' : '❌'}`);
        console.log(`    結果表示: ${afterState.resultsVisible ? '✅' : '❌'}`);
        
        // Canvas破壊の確認
        if (afterState.canvasCount < initialState.canvasCount) {
            allProblems.canvasDestruction.push({
                before: initialState.canvasCount,
                after: afterState.canvasCount,
                lost: initialState.canvasCount - afterState.canvasCount,
                lostIds: initialState.canvasIds.filter(id => !afterState.canvasIds.includes(id))
            });
        }
        
        // Container問題の確認
        if (initialState.containerExists && !afterState.containerExists) {
            allProblems.containerIssues.push({
                issue: 'Container destroyed',
                wasPresent: true,
                nowPresent: false
            });
        }
        
        console.log('\n📋 Step 4: 問題の根本原因分析');
        console.log('--------------------------------');
        
        // どのファイルが問題を起こしているか特定
        const problematicFiles = await page.evaluate(() => {
            const results = [];
            
            // future-simulator-coreの確認
            if (window.haqeiFutureSimulator) {
                const funcString = window.haqeiFutureSimulator.displayAuthentic386Results?.toString() || '';
                if (funcString.includes('innerHTML')) {
                    results.push('future-simulator-core.js: displayAuthentic386Results uses innerHTML');
                }
            }
            
            // binary-tree-complete-displayの確認
            if (window.displayBinaryTreeResults) {
                const funcString = window.displayBinaryTreeResults.toString();
                if (funcString.includes('innerHTML')) {
                    results.push('binary-tree-complete-display.js: displayBinaryTreeResults uses innerHTML');
                }
            }
            
            return results;
        });
        
        if (problematicFiles.length > 0) {
            console.log('  問題のあるファイル:');
            problematicFiles.forEach(f => console.log(`    ❌ ${f}`));
        }
        
        console.log('\n=====================================');
        console.log('📊 問題サマリー');
        console.log('=====================================\n');
        
        console.log('1. innerHTML使用:');
        console.log(`   検出数: ${allProblems.innerHTML.length}回`);
        if (allProblems.innerHTML.length > 0) {
            const elements = [...new Set(allProblems.innerHTML.map(c => c.element))];
            console.log(`   影響要素: ${elements.join(', ')}`);
        }
        
        console.log('\n2. Canvas破壊:');
        if (allProblems.canvasDestruction.length > 0) {
            const dest = allProblems.canvasDestruction[0];
            console.log(`   ${dest.before}個 → ${dest.after}個 (${dest.lost}個消失)`);
            console.log(`   消失ID: ${dest.lostIds.join(', ')}`);
        } else {
            console.log('   問題なし');
        }
        
        console.log('\n3. Container問題:');
        if (allProblems.containerIssues.length > 0) {
            console.log('   eight-scenarios-display-containerが破壊された');
        } else {
            console.log('   問題なし');
        }
        
        console.log('\n4. エラー:');
        const nonCSPErrors = allProblems.errors.filter(e => 
            !e.message?.includes('CSP') && 
            !e.text?.includes('CSP')
        );
        console.log(`   総数: ${nonCSPErrors.length}件`);
        
        console.log('\n📝 根本原因:');
        if (allProblems.innerHTML.length > 0) {
            console.log('  ❌ innerHTML操作が継続している');
            console.log('  → SingleDOMManagerが完全には機能していない');
        }
        if (allProblems.canvasDestruction.length > 0) {
            console.log('  ❌ Canvas要素が破壊されている');
        }
        if (allProblems.containerIssues.length > 0) {
            console.log('  ❌ Containerが再生成されていない');
        }
        
        // 結果をファイルに保存
        const report = {
            timestamp: new Date().toISOString(),
            problems: {
                innerHTMLCalls: allProblems.innerHTML.length,
                canvasDestroyed: allProblems.canvasDestruction.length > 0,
                containerDestroyed: allProblems.containerIssues.length > 0,
                errors: nonCSPErrors.length
            },
            details: allProblems
        };
        
        console.log('\n📄 詳細レポート生成中...');
        
        return report;
        
    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        allProblems.errors.push({ type: 'fatal', message: error.message });
    } finally {
        console.log('\n⏰ 10秒後にブラウザを閉じます...');
        await page.waitForTimeout(10000);
        await browser.close();
    }
    
    return allProblems;
}

// 実行
comprehensiveProblemCheck().then(report => {
    console.log('\n=====================================');
    console.log('最終レポート:');
    console.log(JSON.stringify(report, null, 2));
    
    // メモリに保存
    const fs = require('fs');
    fs.writeFileSync(
        '20250815_problem_report.json',
        JSON.stringify(report, null, 2)
    );
    
    console.log('\n✅ レポートを 20250815_problem_report.json に保存しました');
}).catch(console.error);