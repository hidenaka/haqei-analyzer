/**
 * 結果画面を直接表示
 */

import { chromium } from 'playwright';

async function showResultDirectly() {
    console.log('🖥️ HAQEI OS Analyzer 結果画面表示\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 200
    });
    
    const page = await browser.newPage();
    
    try {
        console.log('📱 アプリケーションを開きます...');
        await page.goto('http://localhost:8090/os_analyzer.html');
        await page.waitForTimeout(2000);
        
        console.log('🎯 診断を開始...');
        // 開始ボタンをクリック
        const startBtn = await page.$('.start-button');
        if (startBtn) {
            await startBtn.click();
            await page.waitForTimeout(1000);
        }
        
        console.log('📝 30問に回答中...\n');
        
        // 30問に回答
        for (let i = 0; i < 30; i++) {
            // オプションが表示されるまで待機
            await page.waitForSelector('.option', { timeout: 5000 });
            
            // .optionクラスの要素をクリック
            const options = await page.$$('.option');
            
            if (options.length > 0) {
                // 回答パターン
                const index = i % Math.min(3, options.length);
                await options[index].click();
                
                // 進捗表示
                if ((i + 1) % 10 === 0) {
                    console.log(`  ✓ ${i + 1}/30問完了`);
                }
                
                // 次へボタンを待つ
                await page.waitForTimeout(300);
            } else {
                console.log(`  ⚠️ 質問${i + 1}で選択肢が見つかりません`);
                break;
            }
        }
        
        console.log('\n⏳ 結果画面を生成中...');
        await page.waitForTimeout(5000);
        
        // スクリーンショット保存
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        await page.screenshot({ 
            path: `result-${timestamp}.png`, 
            fullPage: true 
        });
        console.log(`📸 結果画面を保存しました\n`);
        
        // Triple OS結果を確認
        const results = await page.evaluate(() => {
            const cards = document.querySelectorAll('.os-card');
            const results = [];
            
            cards.forEach(card => {
                const title = card.querySelector('.os-name')?.textContent || '';
                const hexagram = card.querySelector('.os-score')?.textContent || '';
                const catchphrase = card.querySelector('.os-catchphrase')?.textContent || '';
                const description = card.querySelector('.os-description')?.textContent || '';
                
                results.push({
                    title,
                    hexagram,
                    catchphrase,
                    hasCatchphrase: catchphrase.includes('「') && catchphrase.includes('」'),
                    description: description.substring(0, 80)
                });
            });
            
            return results;
        });
        
        console.log('📊 Triple OS結果:\n');
        console.log('=' .repeat(70));
        
        results.forEach((result, i) => {
            console.log(`\n${i + 1}. ${result.title}`);
            console.log(`   卦: ${result.hexagram}`);
            
            if (result.hasCatchphrase) {
                console.log(`   ✅ キャッチフレーズ: ${result.catchphrase}`);
            } else {
                console.log(`   ❌ キャッチフレーズが表示されていません`);
            }
            
            console.log(`   説明: ${result.description}...`);
        });
        
        console.log('\n' + '=' .repeat(70));
        
        const allHaveCatchphrase = results.every(r => r.hasCatchphrase);
        
        if (allHaveCatchphrase) {
            console.log('\n✅ 成功: 全てのOSでキャッチフレーズが表示されています');
        } else {
            console.log('\n⚠️ 問題: 一部のOSでキャッチフレーズが表示されていません');
        }
        
        console.log('\n👀 ブラウザウィンドウで直接確認してください');
        console.log('⏸️ 確認後、手動でブラウザを閉じてください\n');
        
        // 無限待機
        await new Promise(() => {});
        
    } catch (error) {
        console.error('❌ エラー:', error.message);
        await page.screenshot({ path: 'error-screen.png' });
    }
}

showResultDirectly().catch(console.error);