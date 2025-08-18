/**
 * 実際の画面を表示してユーザーに確認してもらう
 */

import { chromium } from 'playwright';

async function showActualDisplay() {
    console.log('🖥️ 実際の画面を表示します\n');
    console.log('📅 表示時刻: ' + new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }) + ' JST\n');
    
    const browser = await chromium.launch({ 
        headless: false,  // 画面を表示
        slowMo: 500       // ゆっくり動作で確認しやすく
    });
    
    const page = await browser.newPage();
    
    try {
        // 1. アプリケーションにアクセス
        console.log('🌐 HAQEI OS Analyzerを開いています...');
        await page.goto('http://localhost:8090/os_analyzer.html', { 
            waitUntil: 'networkidle' 
        });
        await page.waitForTimeout(1000);
        
        console.log('✅ アプリケーションが表示されました\n');
        
        // 2. 診断開始ボタンをクリック
        console.log('🎯 診断を開始します...');
        await page.click('.start-button');
        await page.waitForTimeout(1000);
        
        // 3. 30問に自動回答
        console.log('📝 30問に自動回答中...\n');
        
        for (let i = 0; i < 30; i++) {
            await page.waitForTimeout(500);
            
            // 選択肢を探す（複数のセレクタを試す）
            let options = await page.$$('.option-button');
            if (options.length === 0) {
                options = await page.$$('.choice-button');
            }
            if (options.length === 0) {
                options = await page.$$('button[data-answer]');
            }
            
            if (options.length > 0) {
                // 多様な回答パターン
                const answerIndex = (i % 3 === 0) ? 0 : (i % 3 === 1) ? 1 : 2;
                if (options[answerIndex]) {
                    await options[answerIndex].click();
                    console.log(`✓ 質問${i + 1}に回答`);
                }
            } else {
                console.log(`⚠️ 質問${i + 1}で選択肢が見つかりません`);
            }
            
            // 次へボタンを探してクリック
            const nextButton = await page.$('#next-btn');
            if (nextButton) {
                await nextButton.click();
            }
        }
        
        // 4. 結果画面を待機
        console.log('\n⏳ 結果画面の生成を待機中...');
        await page.waitForTimeout(5000);
        
        // 5. 結果画面のスクリーンショット保存
        const timestamp = Date.now();
        const screenshotPath = `result-display-${timestamp}.png`;
        await page.screenshot({ 
            path: screenshotPath, 
            fullPage: true 
        });
        console.log(`📸 結果画面を保存: ${screenshotPath}\n`);
        
        // 6. Triple OS結果の詳細取得
        console.log('🔍 Triple OS結果の詳細:\n');
        
        const osCards = await page.$$('.os-card');
        console.log(`検出されたOSカード数: ${osCards.length}\n`);
        
        for (let i = 0; i < osCards.length; i++) {
            const cardData = await osCards[i].evaluate(card => {
                const getData = (selector) => {
                    const el = card.querySelector(selector);
                    return el ? el.textContent.trim() : null;
                };
                
                return {
                    title: getData('.os-name'),
                    hexagram: getData('.os-score'),
                    catchphrase: getData('.os-catchphrase'),
                    description: getData('.os-description'),
                    fullText: card.textContent
                };
            });
            
            console.log(`📊 カード${i + 1}: ${cardData.title || 'タイトル未検出'}`);
            console.log(`  卦名: ${cardData.hexagram || '未検出'}`);
            console.log(`  キャッチフレーズ: ${cardData.catchphrase || '❌ キャッチフレーズが表示されていません'}`);
            console.log(`  説明: ${cardData.description ? cardData.description.substring(0, 50) + '...' : '未検出'}`);
            
            // キャッチフレーズの存在確認
            if (cardData.catchphrase && cardData.catchphrase.includes('「') && cardData.catchphrase.includes('」')) {
                console.log(`  ✅ データベースからキャッチフレーズを正しく取得`);
            } else {
                console.log(`  ⚠️ キャッチフレーズの表示に問題があります`);
            }
            console.log('');
        }
        
        // 7. 最終メッセージ
        console.log('=' .repeat(70));
        console.log('📱 画面表示完了');
        console.log('');
        console.log('👀 ブラウザウィンドウで以下を確認してください:');
        console.log('  1. Triple OS（Engine/Interface/SafeMode）が3つ表示されているか');
        console.log('  2. 各OSカードにキャッチフレーズ「」が表示されているか');
        console.log('  3. 卦名と説明文が表示されているか');
        console.log('');
        console.log('📝 問題があれば、画面のどの部分に問題があるか教えてください');
        console.log('=' .repeat(70));
        
        // ブラウザを開いたまま維持
        console.log('\n⏸️ ブラウザは開いたままです。確認が終わったら手動で閉じてください。\n');
        
        // 無限待機
        await new Promise(() => {});
        
    } catch (error) {
        console.error('❌ エラー発生:', error.message);
        await page.screenshot({ 
            path: 'error-display.png', 
            fullPage: true 
        });
        console.log('📸 エラー画面を保存: error-display.png');
    }
}

// 実行
showActualDisplay().catch(console.error);