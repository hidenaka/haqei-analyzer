/**
 * 最終的な結果画面を表示
 */

import { chromium } from 'playwright';

async function displayFinalResult() {
    console.log('🎯 HAQEI OS Analyzer - データベース統合確認\n');
    console.log('📅 実行時刻: ' + new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }) + ' JST\n');
    
    const browser = await chromium.launch({ 
        headless: false,  // 画面を表示
        slowMo: 300       // 操作を見やすく
    });
    
    const page = await browser.newPage();
    
    try {
        // 1. アプリケーション起動
        console.log('🌐 アプリケーションを開いています...');
        await page.goto('http://localhost:8090/os_analyzer.html');
        await page.waitForTimeout(2000);
        
        // 2. 診断開始
        console.log('▶️ 診断を開始...');
        await page.click('.start-button');
        await page.waitForTimeout(1000);
        
        // 3. 30問に回答（選択肢は直接のdiv要素）
        console.log('📝 30問に回答中...\n');
        
        for (let i = 0; i < 30; i++) {
            await page.waitForTimeout(200);
            
            // 選択肢のdiv要素を直接クリック
            const options = await page.$$('.question-card > div:not(.question-text):not([style*="display: flex"])');
            
            if (options.length >= 5) {
                // 多様な回答パターンで特定の卦を生成
                let answerIndex;
                if (i < 10) answerIndex = 0;      // 最初の10問は1番目
                else if (i < 20) answerIndex = 2; // 次の10問は3番目
                else answerIndex = 4;             // 最後の10問は5番目
                
                await options[answerIndex].click();
                
                if ((i + 1) % 10 === 0) {
                    console.log(`  ✓ ${i + 1}/30問完了`);
                }
            }
            
            // 次へボタン
            await page.waitForTimeout(100);
            const nextButton = await page.$('button:has-text("次の質問")');
            if (nextButton) {
                await nextButton.click();
            }
        }
        
        // 4. 結果画面を待機
        console.log('\n⏳ 結果画面生成中...');
        await page.waitForTimeout(5000);
        
        // 5. スクリーンショット保存
        const screenshotPath = `final-result-${Date.now()}.png`;
        await page.screenshot({ 
            path: screenshotPath, 
            fullPage: true 
        });
        console.log(`📸 結果画面を保存: ${screenshotPath}\n`);
        
        // 6. Triple OS結果の確認
        console.log('🔍 Triple OS結果（データベース統合確認）:\n');
        console.log('=' .repeat(60));
        
        const osCards = await page.$$('.os-card');
        
        for (let i = 0; i < osCards.length; i++) {
            const cardInfo = await osCards[i].evaluate(card => {
                return {
                    title: card.querySelector('.os-name')?.textContent || '',
                    hexagram: card.querySelector('.os-score')?.textContent || '',
                    catchphrase: card.querySelector('.os-catchphrase')?.textContent || '',
                    description: card.querySelector('.os-description')?.textContent || '',
                    hasCatchphrase: card.innerHTML.includes('os-catchphrase')
                };
            });
            
            console.log(`📊 ${cardInfo.title}`);
            console.log(`  卦名: ${cardInfo.hexagram}`);
            
            // キャッチフレーズ確認
            if (cardInfo.catchphrase && cardInfo.catchphrase.includes('「')) {
                console.log(`  ✅ キャッチフレーズ: ${cardInfo.catchphrase}`);
            } else {
                console.log(`  ❌ キャッチフレーズ: 表示されていません`);
            }
            
            console.log(`  説明: ${cardInfo.description.substring(0, 60)}...`);
            console.log('  ' + '-'.repeat(56));
        }
        
        console.log('=' .repeat(60));
        
        // 7. データベース統合の最終判定
        const allCardsHaveCatchphrase = await page.evaluate(() => {
            const cards = document.querySelectorAll('.os-card');
            let count = 0;
            cards.forEach(card => {
                if (card.querySelector('.os-catchphrase')) count++;
            });
            return count === cards.length && cards.length >= 3;
        });
        
        console.log('\n📋 最終判定:');
        if (allCardsHaveCatchphrase) {
            console.log('✅ データベース統合成功 - 全てのOSでキャッチフレーズが表示されています');
        } else {
            console.log('⚠️ データベース統合に問題 - 一部のキャッチフレーズが表示されていません');
        }
        
        // 8. ブラウザを開いたまま維持
        console.log('\n👀 ブラウザで結果を直接確認してください');
        console.log('📌 確認ポイント:');
        console.log('  1. 3つのOSカードが表示されているか');
        console.log('  2. 各カードに「」で囲まれたキャッチフレーズがあるか');
        console.log('  3. 卦名と説明文が表示されているか\n');
        
        console.log('⏸️ 確認が終わったらブラウザを手動で閉じてください\n');
        
        // 無限待機
        await new Promise(() => {});
        
    } catch (error) {
        console.error('❌ エラー:', error.message);
        await page.screenshot({ path: 'error-final.png' });
    }
}

displayFinalResult().catch(console.error);