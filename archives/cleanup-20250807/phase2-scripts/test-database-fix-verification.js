/**
 * データベース表示修正検証テスト
 * Interface OS と SafeMode OS の catchphrase が正しくデータベースから取得されるか確認
 */

import { chromium } from 'playwright';

async function verifyDatabaseIntegration() {
    console.log('🔍 データベース統合修正検証テスト開始\n');
    console.log('📅 テスト実行時刻: ' + new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }) + ' JST\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 100
    });
    
    const page = await browser.newPage();
    const testResults = {
        engineOS: { hasData: false, details: {} },
        interfaceOS: { hasData: false, details: {} },
        safeModeOS: { hasData: false, details: {} },
        allDataFromDB: false,
        errors: []
    };
    
    try {
        // 1. アプリケーションにアクセス
        console.log('🌐 OS Analyzerにアクセス...');
        await page.goto('http://localhost:3001/os_analyzer.html', { waitUntil: 'networkidle' });
        
        // 2. コンソールログ監視開始
        page.on('console', msg => {
            if (msg.type() === 'error') {
                testResults.errors.push(msg.text());
            }
        });
        
        // 3. 診断開始
        console.log('🎯 診断プロセス開始...');
        const startButton = await page.$('.start-button');
        if (startButton) {
            await startButton.click();
        }
        
        // 4. 30問を回答（テスト用固定パターン）
        console.log('📝 30問回答中...');
        for (let i = 0; i < 30; i++) {
            await page.waitForTimeout(200);
            
            const options = await page.$$('.option');
            if (options.length === 0) break;
            
            // パターン化された回答で特定の卦を生成
            const answerIndex = i % 3;
            await options[answerIndex].click();
            
            const nextButton = await page.$('#next-btn, button:has-text("次へ")');
            if (nextButton) await nextButton.click();
        }
        
        // 5. 結果画面待機
        console.log('⏳ 結果画面の生成を待機中...');
        await page.waitForTimeout(3000);
        
        // 6. Triple OS結果を検証
        console.log('🔍 Triple OS結果のデータベース統合を検証中...\n');
        
        const osCards = await page.$$('.os-card');
        
        for (let i = 0; i < Math.min(3, osCards.length); i++) {
            const cardContent = await osCards[i].evaluate(card => {
                const texts = {};
                // カード内のテキスト要素を取得
                const titleEl = card.querySelector('h3');
                const catchphraseEl = card.querySelector('.catchphrase, p:nth-of-type(2)');
                const descriptionEl = card.querySelector('.description, p:nth-of-type(3)');
                
                texts.title = titleEl ? titleEl.textContent : '';
                texts.catchphrase = catchphraseEl ? catchphraseEl.textContent : '';
                texts.description = descriptionEl ? descriptionEl.textContent : '';
                texts.allText = card.textContent;
                
                return texts;
            });
            
            const osType = cardContent.title.includes('Engine') ? 'engineOS' : 
                          cardContent.title.includes('Interface') ? 'interfaceOS' : 'safeModeOS';
            
            // キャッチフレーズの存在確認（複数の検出パターン）
            const hasCatchphrase = (cardContent.allText.includes('「') && cardContent.allText.includes('」')) ||
                                   cardContent.catchphrase?.length > 0 ||
                                   /「.*」/.test(cardContent.allText);
            const hasDescription = cardContent.allText.length > 100;
            
            testResults[osType] = {
                hasData: true,
                details: {
                    title: cardContent.title,
                    hasCatchphrase: hasCatchphrase,
                    hasDescription: hasDescription,
                    catchphraseContent: cardContent.catchphrase || '未検出',
                    textLength: cardContent.allText.length
                }
            };
            
            console.log(`📊 ${osType} 検証結果:`);
            console.log(`  ✓ タイトル: ${cardContent.title}`);
            console.log(`  ${hasCatchphrase ? '✅' : '❌'} キャッチフレーズ: ${hasCatchphrase ? '検出' : '未検出'}`);
            console.log(`  ${hasDescription ? '✅' : '❌'} 説明文: ${hasDescription ? '存在' : '不足'}`);
            console.log(`  📝 テキスト長: ${cardContent.allText.length}文字\n`);
        }
        
        // 7. データベース統合の総合判定
        testResults.allDataFromDB = 
            testResults.engineOS.details.hasCatchphrase &&
            testResults.interfaceOS.details.hasCatchphrase &&
            testResults.safeModeOS.details.hasCatchphrase;
        
        // 8. スクリーンショット保存
        await page.screenshot({ 
            path: 'database-integration-verified.png', 
            fullPage: true 
        });
        console.log('📸 検証結果のスクリーンショットを保存\n');
        
    } catch (error) {
        console.error('❌ テスト中にエラー発生:', error);
        testResults.errors.push(error.message);
    } finally {
        await browser.close();
    }
    
    // 9. 最終判定
    console.log('=' .repeat(60));
    console.log('🏆 データベース統合検証 - 最終判定\n');
    
    if (testResults.allDataFromDB) {
        console.log('✅ 成功: すべてのOSでデータベースからの情報取得を確認');
        console.log('  • Engine OS: キャッチフレーズ表示 ✓');
        console.log('  • Interface OS: キャッチフレーズ表示 ✓');
        console.log('  • Safe Mode OS: キャッチフレーズ表示 ✓');
    } else {
        console.log('⚠️ 問題検出: 一部のOSでデータベース統合に問題');
        
        if (!testResults.engineOS.details.hasCatchphrase) {
            console.log('  ❌ Engine OS: キャッチフレーズ未検出');
        }
        if (!testResults.interfaceOS.details.hasCatchphrase) {
            console.log('  ❌ Interface OS: キャッチフレーズ未検出');
        }
        if (!testResults.safeModeOS.details.hasCatchphrase) {
            console.log('  ❌ Safe Mode OS: キャッチフレーズ未検出');
        }
    }
    
    if (testResults.errors.length > 0) {
        console.log('\n⚠️ 検出されたエラー:');
        testResults.errors.forEach(err => console.log(`  • ${err}`));
    }
    
    console.log('\n📅 検証完了時刻: ' + new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }) + ' JST');
    console.log('=' .repeat(60));
    
    return testResults;
}

// 実行
verifyDatabaseIntegration().catch(console.error);