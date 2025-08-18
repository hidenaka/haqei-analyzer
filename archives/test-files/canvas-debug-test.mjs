/**
 * Canvas要素が0個の原因調査
 * 予想される原因:
 * 1. Chart.jsが読み込まれていない
 * 2. ScoreVisualizationのcreateComparisonChartが実行されていない
 * 3. Canvas作成後にDOMに追加されていない
 * 4. CSPエラーでChart.js初期化が失敗
 */

import { chromium } from 'playwright';

async function debugCanvasIssue() {
    console.log('🔍 Canvas要素0個問題の原因調査');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        
        // リアルタイムログ収集
        const allLogs = [];
        page.on('console', msg => {
            const log = `[${msg.type()}] ${msg.text()}`;
            allLogs.push(log);
            if (log.includes('canvas') || log.includes('Canvas') || log.includes('Chart')) {
                console.log(`🎯 ${log}`);
            }
        });
        
        console.log('Step 1: ページロードとJavaScript確認');
        console.log('--------------------------------');
        
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        
        await page.waitForTimeout(2000);
        
        // Chart.js読み込み状況確認
        const chartStatus = await page.evaluate(() => {
            return {
                chartJsLoaded: typeof window.Chart !== 'undefined',
                scoreVisualizationLoaded: typeof window.ScoreVisualization !== 'undefined',
                eightScenariosDisplayLoaded: typeof window.EightScenariosDisplay !== 'undefined',
                chartJsVersion: window.Chart?.version || 'not-loaded',
                documentReady: document.readyState
            };
        });
        
        console.log('JavaScript読み込み状況:');
        console.log(`  Chart.js: ${chartStatus.chartJsLoaded ? '✅' : '❌'} (${chartStatus.chartJsVersion})`);
        console.log(`  ScoreVisualization: ${chartStatus.scoreVisualizationLoaded ? '✅' : '❌'}`);
        console.log(`  EightScenariosDisplay: ${chartStatus.eightScenariosDisplayLoaded ? '✅' : '❌'}`);
        console.log(`  Document状態: ${chartStatus.documentReady}`);
        
        if (!chartStatus.chartJsLoaded) {
            console.log('❌ 原因特定: Chart.jsが読み込まれていない');
            return;
        }
        
        console.log('\\nStep 2: 分析実行とCanvas生成過程追跡');
        console.log('--------------------------------');
        
        // Canvas生成をリアルタイム監視
        await page.evaluate(() => {
            // Canvas作成監視のオーバーライド
            const originalCreateElement = document.createElement;
            document.createElement = function(tagName) {
                const element = originalCreateElement.call(document, tagName);
                if (tagName.toLowerCase() === 'canvas') {
                    console.log('🎨 Canvas要素が作成されました！', {
                        id: element.id,
                        className: element.className,
                        width: element.width,
                        height: element.height
                    });
                }
                return element;
            };
            
            // appendChild監視
            const originalAppendChild = Element.prototype.appendChild;
            Element.prototype.appendChild = function(child) {
                if (child.tagName && child.tagName.toLowerCase() === 'canvas') {
                    console.log('🔗 Canvas要素がDOMに追加されました！', {
                        id: child.id,
                        parent: this.id || this.className || this.tagName,
                        width: child.width,
                        height: child.height
                    });
                }
                return originalAppendChild.call(this, child);
            };
        });
        
        // テスト入力・分析実行
        const testInput = '転職を検討中。現在の職場は安定しているが成長機会が少ない。';
        await page.fill('textarea, #worryInput, #situation-text', testInput);
        console.log('✅ テスト入力完了');
        
        await page.click('button[type="submit"], .analyze-btn, #aiGuessBtn');
        console.log('🔄 分析実行開始 - Canvas生成を監視中...');
        
        // 分析完了まで待機
        await page.waitForFunction(() => {
            const scenarios = document.querySelectorAll('.scenario-card, [class*="scenario"]');
            const hasError = document.body.textContent.includes('エラーが発生');
            return scenarios.length >= 4 || hasError;
        }, { timeout: 15000 });
        
        console.log('⏱️ 分析処理完了');
        
        await page.waitForTimeout(3000);
        
        console.log('\\nStep 3: Canvas生成状況の詳細分析');
        console.log('--------------------------------');
        
        const canvasAnalysis = await page.evaluate(() => {
            // Canvas要素の詳細調査
            const allCanvas = document.querySelectorAll('canvas');
            const allCanvasDetails = Array.from(allCanvas).map(canvas => ({
                id: canvas.id,
                className: canvas.className,
                width: canvas.width,
                height: canvas.height,
                parentId: canvas.parentElement?.id,
                parentClass: canvas.parentElement?.className,
                hasContext: !!(canvas.getContext('2d')),
                inDocument: document.contains(canvas),
                visible: window.getComputedStyle(canvas).display !== 'none'
            }));
            
            // HTML内のcanvas参照確認
            const htmlCanvasRefs = document.body.innerHTML.match(/canvas[^>]*>/g) || [];
            
            // ScoreVisualization実行確認
            let scoreVizExecuted = false;
            let scoreVizError = null;
            
            try {
                if (window.ScoreVisualization) {
                    const testScenarios = [{
                        name: 'テスト',
                        score: { S1: 70, S2: 65, S3: 60 }
                    }];
                    const viz = new window.ScoreVisualization();
                    const result = viz.createComparisonChart(testScenarios);
                    scoreVizExecuted = true;
                    console.log('✅ ScoreVisualization.createComparisonChart実行成功');
                }
            } catch (error) {
                scoreVizError = error.message;
                console.error('❌ ScoreVisualization実行エラー:', error);
            }
            
            return {
                canvasCount: allCanvas.length,
                canvasDetails: allCanvasDetails,
                htmlCanvasRefs: htmlCanvasRefs.length,
                scoreVizExecuted,
                scoreVizError,
                chartJsWorking: typeof window.Chart !== 'undefined' && window.Chart.version
            };
        });
        
        console.log('Canvas生成分析結果:');
        console.log(`  DOM内Canvas要素数: ${canvasAnalysis.canvasCount}個`);
        console.log(`  HTML内canvas参照数: ${canvasAnalysis.htmlCanvasRefs}個`);
        console.log(`  ScoreVisualization実行: ${canvasAnalysis.scoreVizExecuted ? '✅' : '❌'}`);
        console.log(`  Chart.js動作: ${canvasAnalysis.chartJsWorking ? '✅' : '❌'}`);
        
        if (canvasAnalysis.scoreVizError) {
            console.log(`  ScoreVizエラー: ${canvasAnalysis.scoreVizError}`);
        }
        
        if (canvasAnalysis.canvasCount > 0) {
            console.log('\\n📊 発見されたCanvas要素:');
            canvasAnalysis.canvasDetails.forEach((canvas, i) => {
                console.log(`  Canvas${i+1}:`);
                console.log(`    ID: ${canvas.id || 'なし'}`);
                console.log(`    Class: ${canvas.className || 'なし'}`);
                console.log(`    サイズ: ${canvas.width}x${canvas.height}`);
                console.log(`    親要素: ${canvas.parentId || canvas.parentClass || 'なし'}`);
                console.log(`    Context: ${canvas.hasContext ? '✅' : '❌'}`);
                console.log(`    DOM内: ${canvas.inDocument ? '✅' : '❌'}`);
                console.log(`    表示: ${canvas.visible ? '✅' : '❌'}`);
            });
        } else {
            console.log('\\n❌ Canvas要素が全く作成されていない');
            
            // 原因分析
            console.log('\\n🔍 考えられる原因:');
            console.log('1. ScoreVisualization.createComparisonChart()が呼び出されていない');
            console.log('2. Chart.js初期化エラーでCanvas作成が阻止されている'); 
            console.log('3. CSPエラーでWorker/Canvas操作が制限されている');
            console.log('4. DOM操作タイミングの問題');
        }
        
        // 関連するコンソールログを表示
        const canvasRelatedLogs = allLogs.filter(log => 
            log.toLowerCase().includes('canvas') || 
            log.toLowerCase().includes('chart') ||
            log.toLowerCase().includes('score') ||
            log.toLowerCase().includes('visualization')
        );
        
        if (canvasRelatedLogs.length > 0) {
            console.log('\\n📝 Canvas/Chart関連ログ:');
            canvasRelatedLogs.slice(-10).forEach(log => console.log(`  ${log}`));
        }
        
        return canvasAnalysis;
        
    } catch (error) {
        console.error('❌ デバッグエラー:', error);
        return null;
    } finally {
        await page.waitForTimeout(8000);
        await browser.close();
    }
}

// 実行
debugCanvasIssue().then(result => {
    console.log('\\n=====================================');
    console.log('🔍 Canvas調査完了');
    console.log('=====================================');
    
    if (result) {
        if (result.canvasCount === 0) {
            console.log('\\n❌ 結論: Canvas要素が作成されていない');
            console.log('主な原因候補:');
            console.log('1. ScoreVisualization.createComparisonChart()未実行');
            console.log('2. Chart.js初期化失敗');
            console.log('3. CSPによるCanvas操作制限');
        } else {
            console.log(`\\n✅ 結論: Canvas要素は${result.canvasCount}個作成されている`);
            console.log('検索・表示の問題の可能性');
        }
    }
}).catch(console.error);