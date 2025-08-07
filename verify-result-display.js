/**
 * 結果表示の動作確認スクリプト
 */

import { chromium } from 'playwright';

async function verifyResultDisplay() {
    console.log('🔍 結果表示動作確認開始\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 200
    });
    
    const page = await browser.newPage();
    
    // コンソールメッセージを監視
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('❌ エラー検出:', msg.text());
        }
    });
    
    try {
        console.log('📱 アプリケーションを開きます...');
        await page.goto('http://localhost:8090/os_analyzer.html');
        await page.waitForTimeout(2000);
        
        console.log('🎯 診断を開始...');
        const startBtn = await page.$('.start-button');
        if (startBtn) {
            await startBtn.click();
            await page.waitForTimeout(1000);
        }
        
        console.log('📝 30問に回答中...\n');
        
        for (let i = 0; i < 30; i++) {
            await page.waitForSelector('.option', { timeout: 5000 });
            
            const options = await page.$$('.option');
            
            if (options.length > 0) {
                const index = i % Math.min(3, options.length);
                await options[index].click();
                
                if ((i + 1) % 10 === 0) {
                    console.log(`  ✓ ${i + 1}/30問完了`);
                }
                
                await page.waitForTimeout(300);
            }
        }
        
        console.log('\n⏳ 結果画面を生成中...');
        await page.waitForTimeout(5000);
        
        // 結果画面の要素を確認
        console.log('\n📊 結果画面の要素確認:');
        
        // OSカードの確認
        const osCards = await page.$$('.os-card');
        console.log(`  OSカード数: ${osCards.length}`);
        
        // 各OSカードの内容確認
        for (let i = 0; i < osCards.length; i++) {
            const cardContent = await osCards[i].evaluate(card => {
                return {
                    title: card.querySelector('.os-name')?.textContent || '',
                    hexagram: card.querySelector('.os-score')?.textContent || '',
                    catchphrase: card.querySelector('.os-catchphrase')?.textContent || '',
                    description: card.querySelector('.os-description')?.textContent || '',
                    hasEnergy: !!card.querySelector('.os-energy-section')
                };
            });
            
            console.log(`\n  カード${i + 1}: ${cardContent.title}`);
            console.log(`    卦: ${cardContent.hexagram || '❌ 表示されていない'}`);
            console.log(`    キャッチフレーズ: ${cardContent.catchphrase ? '✅' : '❌'}`);
            console.log(`    説明: ${cardContent.description ? '✅' : '❌'}`);
            console.log(`    エネルギー分布: ${cardContent.hasEnergy ? '✅' : '❌'}`);
        }
        
        // チャートの確認
        const charts = await page.$$('canvas');
        console.log(`\n  チャート数: ${charts.length}`);
        
        // レイヤータブの確認
        const tabs = await page.$$('.tab-btn');
        console.log(`  レイヤータブ数: ${tabs.length}`);
        
        // 各レイヤーの内容確認
        const layers = ['basic', 'detailed', 'expert', 'integrated'];
        for (const layer of layers) {
            const layerContent = await page.$(`[data-layer="${layer}"]`);
            if (layerContent) {
                const hasContent = await layerContent.evaluate(el => {
                    return el.innerHTML.trim().length > 100;
                });
                console.log(`  ${layer}層: ${hasContent ? '✅ コンテンツあり' : '❌ 空または不足'}`);
            }
        }
        
        // スクリーンショット保存
        await page.screenshot({ 
            path: 'result-display-verification.png', 
            fullPage: true 
        });
        console.log('\n📸 結果画面を保存: result-display-verification.png');
        
        // 問題の診断
        console.log('\n🔍 問題診断:');
        
        if (osCards.length === 0) {
            console.log('  ❌ OSカードが一つも表示されていません');
            console.log('     → renderBasicLayerが実行されていない可能性');
        } else if (osCards.length < 3) {
            console.log('  ⚠️ OSカードが3つ未満です');
            console.log('     → Triple OS計算が不完全な可能性');
        }
        
        if (charts.length === 0) {
            console.log('  ❌ チャートが表示されていません');
            console.log('     → Chart.js初期化の問題の可能性');
        }
        
        // JavaScriptエラーの確認
        const jsErrors = await page.evaluate(() => {
            return window.jsErrors || [];
        });
        
        if (jsErrors.length > 0) {
            console.log('\n  ❌ JavaScriptエラー検出:');
            jsErrors.forEach(err => console.log(`     ${err}`));
        }
        
        console.log('\n✅ 確認完了');
        console.log('ブラウザウィンドウで結果を確認してください\n');
        
        // ブラウザを開いたまま維持
        await new Promise(() => {});
        
    } catch (error) {
        console.error('❌ エラー:', error.message);
        await page.screenshot({ path: 'error-verification.png' });
    }
}

verifyResultDisplay().catch(console.error);