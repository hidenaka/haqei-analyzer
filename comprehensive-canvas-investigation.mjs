/**
 * Canvas要素0個問題 - 包括的根本原因調査
 * 
 * 目的: 全てのDOM操作、エラー、Canvas生成フローを詳細に追跡し
 *       根本原因を特定する包括的調査を実施
 */

import { chromium } from 'playwright';
import fs from 'fs';

async function comprehensiveCanvasInvestigation() {
    console.log('🔍 Canvas要素0個問題 - 包括的根本原因調査');
    console.log('==============================================\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    // 調査結果を格納する構造
    const investigation = {
        timestamp: new Date().toISOString(),
        phase1_initialization: {},
        phase2_dom_tracking: {},
        phase3_canvas_lifecycle: {},
        phase4_error_analysis: {},
        phase5_chart_js_investigation: {},
        conclusions: {}
    };
    
    try {
        const page = await browser.newPage();
        
        // 全ログとエラーの詳細収集
        const allLogs = [];
        const allErrors = [];
        const domMutations = [];
        const canvasOperations = [];
        
        page.on('console', msg => {
            const log = {
                timestamp: Date.now(),
                type: msg.type(),
                text: msg.text(),
                location: msg.location()
            };
            allLogs.push(log);
            
            // Canvas関連ログの特別追跡
            if (msg.text().toLowerCase().includes('canvas') || 
                msg.text().toLowerCase().includes('chart') ||
                msg.text().toLowerCase().includes('score')) {
                canvasOperations.push(log);
                console.log(`🎯 [${log.type.toUpperCase()}] ${log.text}`);
            }
        });
        
        page.on('pageerror', error => {
            const errorInfo = {
                timestamp: Date.now(),
                message: error.message,
                stack: error.stack,
                name: error.name
            };
            allErrors.push(errorInfo);
            console.log(`❌ Page Error: ${error.message}`);
        });
        
        console.log('Phase 1: 初期化・環境確認');
        console.log('--------------------------------');
        
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 30000
        });
        
        await page.waitForTimeout(3000);
        
        // Phase 1: 初期化状況の詳細分析
        investigation.phase1_initialization = await page.evaluate(() => {
            return {
                // JavaScript読み込み状況
                libraries: {
                    chartJs: {
                        loaded: typeof window.Chart !== 'undefined',
                        version: window.Chart?.version,
                        availableMethods: window.Chart ? Object.keys(window.Chart) : []
                    },
                    scoreVisualization: {
                        loaded: typeof window.ScoreVisualization !== 'undefined',
                        prototype: window.ScoreVisualization ? Object.getOwnPropertyNames(window.ScoreVisualization.prototype) : []
                    },
                    eightScenarios: {
                        loaded: typeof window.EightScenariosDisplay !== 'undefined',
                        prototype: window.EightScenariosDisplay ? Object.getOwnPropertyNames(window.EightScenariosDisplay.prototype) : []
                    }
                },
                
                // DOM状況
                dom: {
                    readyState: document.readyState,
                    containerExists: !!document.getElementById('eight-scenarios-display-container'),
                    canvasCount: document.querySelectorAll('canvas').length,
                    totalElements: document.querySelectorAll('*').length,
                    scriptTags: document.querySelectorAll('script').length
                },
                
                // CSP状況
                csp: {
                    hasCSP: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
                    cspContent: document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.content || 'none'
                }
            };
        });
        
        console.log('Phase 1 結果:');
        console.log(`  Chart.js: ${investigation.phase1_initialization.libraries.chartJs.loaded ? '✅' : '❌'} (${investigation.phase1_initialization.libraries.chartJs.version})`);
        console.log(`  ScoreVisualization: ${investigation.phase1_initialization.libraries.scoreVisualization.loaded ? '✅' : '❌'}`);
        console.log(`  Container存在: ${investigation.phase1_initialization.dom.containerExists ? '✅' : '❌'}`);
        console.log(`  初期Canvas数: ${investigation.phase1_initialization.dom.canvasCount}個`);
        
        console.log('\\nPhase 2: DOM操作監視セットアップ');
        console.log('--------------------------------');
        
        // Phase 2: DOM操作の詳細監視
        await page.evaluate(() => {
            // DOM操作の監視
            const originalCreateElement = document.createElement;
            document.createElement = function(tagName) {
                const element = originalCreateElement.call(document, tagName);
                
                if (tagName.toLowerCase() === 'canvas') {
                    console.log(`🎨 [DOM] Canvas createElement called`, {
                        timestamp: Date.now(),
                        stackTrace: new Error().stack.split('\\n').slice(1, 4).join(' → ')
                    });
                    
                    // Canvas操作の監視
                    const originalGetContext = element.getContext;
                    element.getContext = function(contextType) {
                        console.log(`🎨 [CANVAS] getContext('${contextType}') called`);
                        return originalGetContext.call(this, contextType);
                    };
                }
                
                return element;
            };
            
            // appendChild監視
            const originalAppendChild = Element.prototype.appendChild;
            Element.prototype.appendChild = function(child) {
                if (child.tagName && child.tagName.toLowerCase() === 'canvas') {
                    console.log(`🔗 [DOM] Canvas appendChild`, {
                        canvasId: child.id,
                        parentId: this.id || this.className || this.tagName,
                        timestamp: Date.now()
                    });
                }
                return originalAppendChild.call(this, child);
            };
            
            // removeChild監視
            const originalRemoveChild = Element.prototype.removeChild;
            Element.prototype.removeChild = function(child) {
                if (child.tagName && child.tagName.toLowerCase() === 'canvas') {
                    console.log(`🗑️ [DOM] Canvas removeChild - Canvas要素が削除されました!`, {
                        canvasId: child.id,
                        parentId: this.id || this.className || this.tagName,
                        stackTrace: new Error().stack.split('\\n').slice(1, 4).join(' → ')
                    });
                }
                return originalRemoveChild.call(this, child);
            };
            
            // innerHTML監視
            const originalInnerHTMLSetter = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;
            Object.defineProperty(Element.prototype, 'innerHTML', {
                set: function(value) {
                    const hadCanvas = this.querySelectorAll('canvas').length > 0;
                    originalInnerHTMLSetter.call(this, value);
                    const hasCanvas = this.querySelectorAll('canvas').length > 0;
                    
                    if (hadCanvas && !hasCanvas) {
                        console.log(`🗑️ [DOM] innerHTML change removed Canvas elements from`, {
                            elementId: this.id || this.className || this.tagName,
                            timestamp: Date.now()
                        });
                    }
                },
                get: Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').get
            });
        });
        
        console.log('DOM監視セットアップ完了');
        
        console.log('\\nPhase 3: 分析実行・Canvas生成ライフサイクル追跡');
        console.log('--------------------------------');
        
        // テスト入力・分析実行
        const testInput = '転職を検討中。現在の職場は安定しているが成長機会が少ない。新しい環境でのスキルアップと、現在の安定性のどちらを優先するか判断が必要。';
        
        await page.fill('textarea, #worryInput, #situation-text', testInput);
        console.log('✅ テスト入力完了');
        
        // 分析実行
        const analysisStartTime = Date.now();
        await page.click('button[type="submit"], .analyze-btn, #aiGuessBtn');
        console.log('🔄 分析実行開始 - 全DOM操作を監視中...');
        
        // 分析完了まで待機
        try {
            await page.waitForFunction(() => {
                const scenarios = document.querySelectorAll('.scenario-card, [class*="scenario"]');
                const hasError = document.body.textContent.includes('エラーが発生');
                const hasAnalysisComplete = document.body.textContent.includes('分析完了') || 
                                           document.body.textContent.includes('易経') ||
                                           scenarios.length >= 4;
                return hasAnalysisComplete || hasError;
            }, { timeout: 20000 });
            
            const analysisTime = Date.now() - analysisStartTime;
            console.log(`⏱️ 分析処理完了 (${(analysisTime/1000).toFixed(1)}秒)`);
            
        } catch (error) {
            console.log('⚠️ 分析タイムアウト（20秒）');
        }
        
        await page.waitForTimeout(5000);
        
        console.log('\\nPhase 4: 最終状態分析・エラー分類');
        console.log('--------------------------------');
        
        // Phase 4: 最終状態とエラー分析
        investigation.phase4_error_analysis = await page.evaluate(() => {
            // DOM最終状態
            const finalDomState = {
                canvasCount: document.querySelectorAll('canvas').length,
                canvasDetails: Array.from(document.querySelectorAll('canvas')).map(canvas => ({
                    id: canvas.id,
                    className: canvas.className,
                    width: canvas.width,
                    height: canvas.height,
                    parentElement: canvas.parentElement?.id || canvas.parentElement?.className || 'no-parent',
                    hasContext: !!(canvas.getContext && canvas.getContext('2d')),
                    isVisible: window.getComputedStyle(canvas).display !== 'none',
                    inDOM: document.contains(canvas)
                })),
                containerState: {
                    exists: !!document.getElementById('eight-scenarios-display-container'),
                    visible: document.getElementById('eight-scenarios-display-container')?.style.display !== 'none',
                    hasContent: document.getElementById('eight-scenarios-display-container')?.innerHTML.length > 100
                }
            };
            
            // Chart.js状態確認
            let chartJsTest = null;
            try {
                if (window.Chart) {
                    // 簡単なChart.js動作テスト
                    const testCanvas = document.createElement('canvas');
                    testCanvas.width = 100;
                    testCanvas.height = 100;
                    const ctx = testCanvas.getContext('2d');
                    
                    const testChart = new window.Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: ['Test'],
                            datasets: [{
                                data: [1],
                                backgroundColor: 'red'
                            }]
                        },
                        options: {
                            animation: false
                        }
                    });
                    
                    chartJsTest = {
                        canCreate: true,
                        chartInstance: !!testChart,
                        error: null
                    };
                    
                    testChart.destroy();
                } else {
                    chartJsTest = { canCreate: false, error: 'Chart.js not loaded' };
                }
            } catch (error) {
                chartJsTest = { 
                    canCreate: false, 
                    error: error.message,
                    stack: error.stack 
                };
            }
            
            return {
                finalDomState,
                chartJsTest
            };
        });
        
        console.log('Phase 4 結果:');
        console.log(`  最終Canvas数: ${investigation.phase4_error_analysis.finalDomState.canvasCount}個`);
        console.log(`  Container状態: ${investigation.phase4_error_analysis.finalDomState.containerState.exists ? '存在' : '不存在'}`);
        console.log(`  Chart.js動作: ${investigation.phase4_error_analysis.chartJsTest.canCreate ? '✅' : '❌'}`);
        
        if (investigation.phase4_error_analysis.chartJsTest.error) {
            console.log(`  Chart.jsエラー: ${investigation.phase4_error_analysis.chartJsTest.error}`);
        }
        
        // 収集したデータの整理
        investigation.phase2_dom_tracking = {
            totalLogs: allLogs.length,
            canvasOperations: canvasOperations.length,
            errors: allErrors
        };
        
        investigation.phase3_canvas_lifecycle = {
            canvasOperationLogs: canvasOperations,
            errorsDuringAnalysis: allErrors.filter(error => 
                error.timestamp >= analysisStartTime
            )
        };
        
        console.log('\\n📊 調査データ収集完了');
        console.log(`  総ログ数: ${allLogs.length}`);
        console.log(`  Canvas関連操作: ${canvasOperations.length}`);
        console.log(`  エラー数: ${allErrors.length}`);
        
        return investigation;
        
    } catch (error) {
        console.error('❌ 調査エラー:', error);
        investigation.conclusions.investigationError = error.message;
        return investigation;
    } finally {
        await page.waitForTimeout(5000);
        await browser.close();
    }
}

// 実行と結果保存
comprehensiveCanvasInvestigation().then(investigation => {
    console.log('\\n==============================================');
    console.log('🔍 包括的調査完了');
    console.log('==============================================');
    
    // 調査結果をファイルに保存
    const reportPath = `20250814_canvas_root_cause_investigation.json`;
    fs.writeFileSync(reportPath, JSON.stringify(investigation, null, 2));
    
    console.log(`\\n📋 詳細調査結果を保存: ${reportPath}`);
    
    // 主要な発見を要約
    console.log('\\n🎯 主要な発見:');
    
    if (investigation.phase1_initialization?.dom?.canvasCount === 0 && 
        investigation.phase4_error_analysis?.finalDomState?.canvasCount === 0) {
        console.log('❌ Canvas要素が最初から最後まで0個');
        console.log('   → Canvas生成処理自体が実行されていない可能性');
    } else if (investigation.phase3_canvas_lifecycle?.canvasOperationLogs?.length > 0) {
        console.log('✅ Canvas生成操作は検出されている');
        console.log('   → DOM操作中にCanvas要素が削除されている可能性');
    }
    
    if (investigation.phase4_error_analysis?.chartJsTest?.canCreate === false) {
        console.log('❌ Chart.js基本動作テスト失敗');
        console.log(`   → エラー: ${investigation.phase4_error_analysis.chartJsTest.error}`);
    }
    
    console.log('\\n📝 次のステップ: 外部専門家向けドキュメント作成');
    
}).catch(error => {
    console.error('❌ 調査実行エラー:', error);
});