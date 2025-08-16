/**
 * 問題確認テスト（修正版）
 */

import { chromium } from 'playwright';
import fs from 'fs';

async function checkAllProblems() {
    console.log('🔍 全体問題確認');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false
    });
    
    const problems = {
        innerHTML: [],
        canvas: {},
        container: {},
        errors: []
    };
    
    try {
        const page = await browser.newPage();
        
        // エラー監視
        page.on('pageerror', error => {
            problems.errors.push(error.message);
        });
        
        page.on('console', msg => {
            if (msg.type() === 'error') {
                problems.errors.push(msg.text());
            }
        });
        
        console.log('📋 Step 1: ページ読み込み');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle'
        });
        
        await page.waitForTimeout(2000);
        
        // 初期状態
        const initial = await page.evaluate(() => {
            const canvases = document.querySelectorAll('canvas');
            const container = document.getElementById('eight-scenarios-display-container');
            
            // SingleDOMManagerが機能しているか
            const singleDOM = window.SingleDOMManager;
            
            return {
                canvas: {
                    count: canvases.length,
                    ids: Array.from(canvases).map(c => c.id)
                },
                container: !!container,
                singleDOM: {
                    exists: !!singleDOM,
                    initialized: singleDOM?.initialized
                }
            };
        });
        
        console.log(`  Canvas初期: ${initial.canvas.count}個`);
        console.log(`  Container: ${initial.container ? '✅' : '❌'}`);
        console.log(`  SingleDOMManager: ${initial.singleDOM.initialized ? '✅' : '❌'}`);
        
        console.log('\n📋 Step 2: innerHTML監視設定');
        
        // innerHTML使用を監視
        await page.evaluate(() => {
            const original = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
            window.innerHTMLLog = [];
            
            Object.defineProperty(Element.prototype, 'innerHTML', {
                set: function(value) {
                    window.innerHTMLLog.push({
                        element: this.tagName,
                        id: this.id,
                        value: value.substring(0, 50)
                    });
                    console.warn(`innerHTML used on ${this.tagName}#${this.id}`);
                    return original.set.call(this, value);
                },
                get: original.get
            });
        });
        
        console.log('  監視設定完了');
        
        console.log('\n📋 Step 3: 分析実行');
        
        // 分析実行
        await page.fill('textarea', 'テスト');
        await page.evaluate(() => {
            const btn = document.querySelector('#aiGuessBtn');
            if (btn) btn.click();
        });
        
        await page.waitForTimeout(5000);
        
        // innerHTML呼び出し確認
        const innerHTMLLog = await page.evaluate(() => window.innerHTMLLog || []);
        
        if (innerHTMLLog.length > 0) {
            console.log(`  ⚠️ innerHTML呼び出し: ${innerHTMLLog.length}回`);
            innerHTMLLog.slice(0, 3).forEach(log => {
                console.log(`    - ${log.element}#${log.id}`);
            });
            problems.innerHTML = innerHTMLLog;
        }
        
        // 分析後状態
        const after = await page.evaluate(() => {
            const canvases = document.querySelectorAll('canvas');
            const container = document.getElementById('eight-scenarios-display-container');
            const cards = document.querySelectorAll('.scenario-card');
            
            return {
                canvas: {
                    count: canvases.length,
                    ids: Array.from(canvases).map(c => c.id)
                },
                container: !!container,
                cards: cards.length
            };
        });
        
        console.log(`\n  Canvas分析後: ${after.canvas.count}個`);
        console.log(`  Container: ${after.container ? '✅' : '❌'}`);
        console.log(`  カード: ${after.cards}個`);
        
        // 問題判定
        problems.canvas = {
            before: initial.canvas.count,
            after: after.canvas.count,
            destroyed: initial.canvas.count - after.canvas.count,
            lostIds: initial.canvas.ids.filter(id => !after.canvas.ids.includes(id))
        };
        
        problems.container = {
            before: initial.container,
            after: after.container,
            destroyed: initial.container && !after.container
        };
        
        // innerHTML使用ファイル特定
        console.log('\n📋 Step 4: 問題ファイル特定');
        
        const sourceCheck = await page.evaluate(() => {
            const checks = {};
            
            // future-simulator-core
            if (window.haqeiFutureSimulator?.displayAuthentic386Results) {
                const code = window.haqeiFutureSimulator.displayAuthentic386Results.toString();
                checks['future-simulator-core'] = code.includes('innerHTML');
            }
            
            // binary-tree-complete-display
            if (window.displayBinaryTreeResults) {
                const code = window.displayBinaryTreeResults.toString();
                checks['binary-tree-complete-display'] = code.includes('innerHTML');
            }
            
            return checks;
        });
        
        Object.entries(sourceCheck).forEach(([file, hasInnerHTML]) => {
            if (hasInnerHTML) {
                console.log(`  ❌ ${file}: innerHTML使用`);
            }
        });
        
        console.log('\n=====================================');
        console.log('📊 問題サマリー');
        console.log('=====================================\n');
        
        const summary = {
            innerHTMLCalls: problems.innerHTML.length,
            canvasDestroyed: problems.canvas.destroyed,
            containerDestroyed: problems.container.destroyed,
            errors: problems.errors.filter(e => !e.includes('CSP')).length
        };
        
        console.log(`innerHTML呼び出し: ${summary.innerHTMLCalls}回`);
        console.log(`Canvas破壊: ${summary.canvasDestroyed}個`);
        console.log(`Container破壊: ${summary.containerDestroyed ? '✅' : '❌'}`);
        console.log(`エラー: ${summary.errors}件`);
        
        if (summary.canvasDestroyed > 0) {
            console.log(`\n消失したCanvas: ${problems.canvas.lostIds.join(', ')}`);
        }
        
        // 根本原因
        console.log('\n📝 根本原因:');
        if (summary.innerHTMLCalls > 0) {
            console.log('❌ innerHTML操作が残存');
        }
        if (summary.canvasDestroyed > 0) {
            console.log('❌ Canvas要素が破壊される');
        }
        if (summary.containerDestroyed) {
            console.log('❌ Containerが再生成されない');
        }
        
        // レポート保存
        const report = {
            timestamp: new Date().toISOString(),
            summary,
            details: problems
        };
        
        fs.writeFileSync(
            '20250815_problem_report.json',
            JSON.stringify(report, null, 2)
        );
        
        console.log('\n✅ レポート保存: 20250815_problem_report.json');
        
        return report;
        
    } finally {
        await page.waitForTimeout(5000);
        await browser.close();
    }
}

// 実行
checkAllProblems().catch(console.error);