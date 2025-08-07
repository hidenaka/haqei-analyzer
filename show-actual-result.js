/**
 * 実際の画面を表示して結果を確認
 */

import { chromium } from 'playwright';

async function showActualResult() {
    console.log('🖥️ 実際の画面を表示して確認します\n');
    
    const browser = await chromium.launch({ 
        headless: false,  // 画面を表示
        slowMo: 200       // ゆっくり動作
    });
    
    const page = await browser.newPage();
    
    try {
        // 1. アプリケーションにアクセス
        console.log('📱 HAQEI OS Analyzerを開いています...');
        await page.goto('http://localhost:3001/os_analyzer.html', { 
            waitUntil: 'networkidle' 
        });
        
        // 初期画面のスクリーンショット
        await page.screenshot({ 
            path: 'screen-1-initial.png', 
            fullPage: false 
        });
        console.log('📸 初期画面を保存: screen-1-initial.png');
        
        // 2. 診断開始
        console.log('\n🎯 診断を開始します...');
        const startButton = await page.$('.start-button');
        if (startButton) {
            await startButton.click();
            await page.waitForTimeout(500);
        }
        
        // 3. 30問回答（実際のユーザー体験をシミュレート）
        console.log('📝 30問に回答中...\n');
        
        for (let i = 0; i < 30; i++) {
            await page.waitForTimeout(300);
            
            // 質問画面のスクリーンショット（5問ごと）
            if (i % 5 === 0) {
                await page.screenshot({ 
                    path: `screen-2-question-${i + 1}.png`, 
                    fullPage: false 
                });
                console.log(`📸 質問${i + 1}の画面を保存`);
            }
            
            const options = await page.$$('.option');
            if (options.length === 0) {
                console.log(`⚠️ 質問${i + 1}で選択肢が見つかりません`);
                break;
            }
            
            // パターン化された回答
            const answerIndex = i % 3;
            await options[answerIndex].click();
            
            const nextButton = await page.$('#next-btn, button:has-text("次へ")');
            if (nextButton) {
                await nextButton.click();
            }
            
            // 進捗表示
            if ((i + 1) % 10 === 0) {
                console.log(`✅ ${i + 1}/30問完了`);
            }
        }
        
        // 4. 結果画面を待機
        console.log('\n⏳ 結果画面の生成を待機中...');
        await page.waitForTimeout(5000);  // 十分な待機時間
        
        // 5. 結果画面のスクリーンショット
        await page.screenshot({ 
            path: 'screen-3-result-full.png', 
            fullPage: true 
        });
        console.log('📸 結果画面全体を保存: screen-3-result-full.png');
        
        // 6. Triple OSカードの詳細確認
        console.log('\n🔍 Triple OS結果を確認中...\n');
        
        const osCards = await page.$$('.os-card');
        console.log(`📊 検出されたOSカード数: ${osCards.length}\n`);
        
        for (let i = 0; i < Math.min(3, osCards.length); i++) {
            const cardInfo = await osCards[i].evaluate(card => {
                const result = {
                    title: '',
                    hexagramName: '',
                    catchphrase: '',
                    description: '',
                    fullText: card.textContent || ''
                };
                
                // タイトル取得
                const titleEl = card.querySelector('.os-name');
                if (titleEl) result.title = titleEl.textContent;
                
                // 卦名取得
                const scoreEl = card.querySelector('.os-score');
                if (scoreEl) result.hexagramName = scoreEl.textContent;
                
                // キャッチフレーズ取得
                const catchphraseEl = card.querySelector('.os-catchphrase');
                if (catchphraseEl) result.catchphrase = catchphraseEl.textContent;
                
                // 説明取得
                const descEl = card.querySelector('.os-description');
                if (descEl) result.description = descEl.textContent;
                
                return result;
            });
            
            console.log(`🎯 ${cardInfo.title}:`);
            console.log(`  卦名: ${cardInfo.hexagramName}`);
            console.log(`  キャッチフレーズ: ${cardInfo.catchphrase || '❌ 未検出'}`);
            console.log(`  説明: ${cardInfo.description.substring(0, 50)}...`);
            console.log('');
        }
        
        // 7. 最終確認メッセージ
        console.log('=' .repeat(60));
        console.log('✅ 画面表示完了');
        console.log('👀 ブラウザウィンドウで直接確認してください');
        console.log('📁 スクリーンショットも保存されました:');
        console.log('  • screen-1-initial.png - 初期画面');
        console.log('  • screen-2-question-*.png - 質問画面');
        console.log('  • screen-3-result-full.png - 結果画面全体');
        console.log('=' .repeat(60));
        
        // ブラウザを開いたままにする
        console.log('\n⏸️ ブラウザは開いたままです。確認後、手動で閉じてください。');
        
        // 無限待機（手動で終了するまで）
        await new Promise(() => {});
        
    } catch (error) {
        console.error('❌ エラー発生:', error.message);
        await page.screenshot({ 
            path: 'error-screenshot.png', 
            fullPage: true 
        });
        console.log('📸 エラー時の画面を保存: error-screenshot.png');
    }
}

// 実行
showActualResult().catch(console.error);