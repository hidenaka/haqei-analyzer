/**
 * シンプルなエラー確認テスト
 */

import { chromium } from 'playwright';

async function checkErrors() {
    console.log('🔍 エラー状態確認');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: true
    });
    
    try {
        const page = await browser.newPage();
        
        // エラー収集
        const errors = [];
        
        page.on('pageerror', error => {
            errors.push(error.message);
        });
        
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });
        
        // ページ読み込み
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle'
        });
        
        await page.waitForTimeout(2000);
        
        // Canvas確認
        const canvasInfo = await page.evaluate(() => {
            const canvases = document.querySelectorAll('canvas');
            const container = document.getElementById('eight-scenarios-display-container');
            const resultsContainer = document.getElementById('resultsContainer');
            
            // SingleDOMManager確認
            const singleDOMExists = typeof window.SingleDOMManager !== 'undefined';
            const singleDOMInit = singleDOMExists && window.SingleDOMManager.initialized;
            
            return {
                canvasCount: canvases.length,
                canvasIds: Array.from(canvases).map(c => c.id || 'no-id'),
                containerExists: !!container,
                resultsContainerExists: !!resultsContainer,
                singleDOMExists,
                singleDOMInit
            };
        });
        
        // 分析実行
        await page.fill('textarea', 'テスト入力');
        
        // ボタンクリック
        await page.evaluate(() => {
            const btn = document.querySelector('#aiGuessBtn');
            if (btn) btn.click();
        });
        
        await page.waitForTimeout(3000);
        
        // 分析後の状態
        const afterAnalysis = await page.evaluate(() => {
            const canvases = document.querySelectorAll('canvas');
            const container = document.getElementById('eight-scenarios-display-container');
            const cards = document.querySelectorAll('.scenario-card');
            
            return {
                canvasCount: canvases.length,
                containerExists: !!container,
                cardCount: cards.length
            };
        });
        
        // 結果出力
        console.log('📊 初期状態:');
        console.log(`  Canvas数: ${canvasInfo.canvasCount}個`);
        console.log(`  Canvas IDs: ${canvasInfo.canvasIds.join(', ')}`);
        console.log(`  Container存在: ${canvasInfo.containerExists ? '✅' : '❌'}`);
        console.log(`  SingleDOMManager存在: ${canvasInfo.singleDOMExists ? '✅' : '❌'}`);
        console.log(`  SingleDOMManager初期化: ${canvasInfo.singleDOMInit ? '✅' : '❌'}`);
        
        console.log('\n📊 分析後:');
        console.log(`  Canvas数: ${afterAnalysis.canvasCount}個`);
        console.log(`  Container存在: ${afterAnalysis.containerExists ? '✅' : '❌'}`);
        console.log(`  カード数: ${afterAnalysis.cardCount}個`);
        
        console.log('\n📋 エラー:');
        const nonCSPErrors = errors.filter(e => !e.includes('CSP') && !e.includes('Content Security'));
        console.log(`  総エラー: ${errors.length}件`);
        console.log(`  CSP以外: ${nonCSPErrors.length}件`);
        
        if (nonCSPErrors.length > 0) {
            console.log('\n  エラー内容:');
            nonCSPErrors.slice(0, 5).forEach((e, i) => {
                console.log(`    ${i+1}. ${e.substring(0, 100)}`);
            });
        }
        
        // 評価
        console.log('\n=====================================');
        console.log('📊 評価結果:');
        console.log('=====================================');
        
        const issues = [];
        
        if (canvasInfo.canvasCount === 0) {
            issues.push('❌ 初期Canvas要素が0個');
        }
        
        if (afterAnalysis.canvasCount < canvasInfo.canvasCount) {
            issues.push('❌ Canvas要素が減少');
        }
        
        if (!afterAnalysis.containerExists) {
            issues.push('❌ eight-scenarios-display-containerが存在しない');
        }
        
        if (!canvasInfo.singleDOMInit) {
            issues.push('❌ SingleDOMManagerが初期化されていない');
        }
        
        if (nonCSPErrors.length > 5) {
            issues.push(`❌ エラーが多い (${nonCSPErrors.length}件)`);
        }
        
        if (issues.length === 0) {
            console.log('✅ エラー解消成功！');
        } else {
            console.log('問題点:');
            issues.forEach(issue => console.log(`  ${issue}`));
        }
        
    } catch (error) {
        console.error('❌ テストエラー:', error.message);
    } finally {
        await browser.close();
    }
}

// 実行
checkErrors().catch(console.error);