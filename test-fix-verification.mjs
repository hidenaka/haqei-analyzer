/**
 * 修正後検証テスト
 * 期待される改善：
 * 1. eight-scenarios-display-container が存在する
 * 2. Line data required エラーが解決される
 * 3. Canvasやスコアグラフが表示される
 */

import { chromium } from 'playwright';

async function testFixVerification() {
    console.log('🔧 修正後検証テスト');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        
        // JavaScript エラーとメッセージをキャッチ
        const jsErrors = [];
        const consoleMessages = [];
        
        page.on('console', msg => {
            consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
            if (msg.type() === 'error') {
                jsErrors.push(msg.text());
            }
        });
        
        page.on('pageerror', error => {
            jsErrors.push(`Page Error: ${error.message}`);
        });
        
        console.log('🌐 Step 1: ページロード・Container存在確認');
        console.log('--------------------------------');
        
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        
        await page.waitForTimeout(2000);
        
        // Container存在確認
        const containerCheck = await page.evaluate(() => {
            const container = document.getElementById('eight-scenarios-display-container');
            const canvas = document.getElementById('scenarioComparisonChart');
            
            return {
                containerExists: !!container,
                containerVisible: container ? window.getComputedStyle(container).display !== 'none' : false,
                canvasExists: !!canvas,
                containerHTML: container ? container.outerHTML.substring(0, 200) + '...' : null
            };
        });
        
        console.log('Container確認結果:');
        console.log(`  eight-scenarios-display-container: ${containerCheck.containerExists ? '✅' : '❌'}`);
        console.log(`  Container可視状態: ${containerCheck.containerVisible ? '✅' : '❌'}`);
        console.log(`  scenarioComparisonChart Canvas: ${containerCheck.canvasExists ? '✅' : '❌'}`);
        
        if (containerCheck.containerExists) {
            console.log(`  Container HTML: ${containerCheck.containerHTML}`);
        }
        
        console.log('\\n🔄 Step 2: 分析実行・エラー確認');
        console.log('--------------------------------');
        
        // テスト入力
        const testInput = '転職を検討中。現在の職場は安定しているが成長機会が少ない。';
        
        await page.fill('textarea, #worryInput, #situation-text', testInput);
        console.log('✅ テスト入力完了');
        
        // 分析実行
        await page.click('button[type="submit"], .analyze-btn, #aiGuessBtn');
        console.log('🔄 分析実行開始');
        
        // 結果待機（15秒）
        try {
            await page.waitForFunction(() => {
                // スコアグラフやCanvas要素の確認
                const canvas = document.querySelectorAll('canvas');
                const scenarios = document.querySelectorAll('.scenario-card, [class*="scenario"]');
                const hasError = document.body.textContent.includes('エラーが発生');
                
                return canvas.length > 0 || scenarios.length >= 4 || hasError;
            }, { timeout: 15000 });
            
            console.log('⏱️ 分析完了を検出');
            
            await page.waitForTimeout(3000);
            
        } catch (error) {
            console.log('⚠️ 分析タイムアウト（15秒）');
        }
        
        // エラー分析
        console.log('\\n📊 結果確認:');
        console.log('--------------------------------');
        
        const results = await page.evaluate(() => {
            return {
                canvasCount: document.querySelectorAll('canvas').length,
                scenarioCards: document.querySelectorAll('.scenario-card, [class*="scenario"]').length,
                hasLineDataError: document.body.textContent.includes('Line data is required'),
                hasContainerError: document.body.textContent.includes('Container not found'),
                hasAnalysisError: document.body.textContent.includes('分析中にエラー'),
                hasScoreVisualization: document.body.textContent.includes('スコア') || document.body.textContent.includes('点'),
                containerDisplay: document.getElementById('eight-scenarios-display-container')?.style.display || 'not-found'
            };
        });
        
        // エラー分類
        const criticalErrors = jsErrors.filter(error => 
            error.includes('Line data is required') || 
            error.includes('Container not found')
        );
        
        const cspErrors = jsErrors.filter(error => 
            error.includes('Content Security Policy') || 
            error.includes('Worker')
        );
        
        console.log(`Canvas要素: ${results.canvasCount}個`);
        console.log(`シナリオカード: ${results.scenarioCards}個`);
        console.log(`Line data エラー: ${results.hasLineDataError ? '❌' : '✅'}`);
        console.log(`Container エラー: ${results.hasContainerError ? '❌' : '✅'}`);
        console.log(`分析エラー: ${results.hasAnalysisError ? '❌' : '✅'}`);
        console.log(`スコア表示: ${results.hasScoreVisualization ? '✅' : '❌'}`);
        
        if (criticalErrors.length > 0) {
            console.log('\\n🚨 重要エラー（修正対象）:');
            criticalErrors.forEach((error, i) => {
                console.log(`${i+1}. ${error}`);
            });
        } else {
            console.log('\\n✅ 重要エラー解消済み');
        }
        
        if (cspErrors.length > 0) {
            console.log(`\\n⚠️ CSPエラー: ${cspErrors.length}件（後回し可能）`);
        }
        
        // スコア算出
        let score = 0;
        let maxScore = 100;
        
        if (containerCheck.containerExists) score += 30;
        if (!results.hasLineDataError) score += 25;
        if (!results.hasContainerError) score += 25;
        if (results.canvasCount > 0) score += 20;
        
        console.log(`\\n修正効果スコア: ${score}/${maxScore}点`);
        
        if (score >= 75) {
            console.log('✅ 重要な修正が成功！基本機能復旧');
        } else if (score >= 50) {
            console.log('⚠️ 部分的改善。追加修正が必要');
        } else {
            console.log('❌ 修正が不十分。追加調査が必要');
        }
        
        // デバッグスクリーンショット
        await page.screenshot({ 
            path: '20250814_after_container_fix.png',
            fullPage: false
        });
        console.log('\\n📸 修正後スクリーンショット保存');
        
        return { score, results };
        
    } catch (error) {
        console.error('❌ テストエラー:', error);
        return null;
    } finally {
        await new Promise(resolve => setTimeout(resolve, 8000));
        await browser.close();
    }
}

// 実行
testFixVerification().then(result => {
    console.log('\\n=====================================');
    console.log('🔧 修正後検証テスト完了');
    console.log('=====================================');
    
    if (result && result.score >= 75) {
        console.log('\\n🎉 Phase 3 修正成功！');
        console.log('次のステップ: CSPエラー対応とUI改善');
    }
}).catch(console.error);