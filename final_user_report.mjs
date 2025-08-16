import { chromium } from 'playwright';

/**
 * 📋 最終ユーザー体験レポート
 */

async function finalUserReport() {
    console.log('📋 最終ユーザー体験レポート作成\n');
    console.log('=' .repeat(60));
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 50
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // 1. アプリ起動
        console.log('【1. アプリケーション起動】');
        await page.goto('http://localhost:8788/os_analyzer.html');
        await page.waitForTimeout(2000);
        
        const welcomeVisible = await page.locator('#welcome-screen').isVisible();
        console.log(`✅ ウェルカム画面: ${welcomeVisible ? '正常表示' : '表示エラー'}`);
        
        // 2. 分析開始
        console.log('\n【2. 分析開始】');
        await page.locator('#start-btn').click();
        await page.waitForTimeout(1000);
        
        const questionVisible = await page.locator('#question-screen').isVisible();
        console.log(`✅ 質問画面への遷移: ${questionVisible ? '成功' : '失敗'}`);
        
        // 3. 36問回答
        console.log('\n【3. 36問回答プロセス】');
        let savedCount = 0;
        let nextButtonIssues = [];
        
        for (let i = 0; i < 36; i++) {
            const optionValue = ['A', 'B', 'C', 'D', 'E'][i % 5];
            await page.locator(`input[value="${optionValue}"]`).first().click();
            await page.waitForTimeout(30);
            
            // 保存確認
            const saved = await page.evaluate((index) => {
                const analyzer = window.criticalCSSAnalyzer;
                return analyzer?.state?.answers?.[index] ? true : false;
            }, i);
            
            if (saved) savedCount++;
            
            // 次へボタン
            if (i < 35) {
                const nextBtn = page.locator('#next-btn');
                const enabled = await nextBtn.isEnabled();
                if (!enabled) {
                    nextButtonIssues.push(i + 1);
                    await page.evaluate(() => {
                        const btn = document.getElementById('next-btn');
                        if (btn) {
                            btn.disabled = false;
                            btn.click();
                        }
                    });
                } else {
                    await nextBtn.click();
                }
                await page.waitForTimeout(30);
            }
        }
        
        console.log(`✅ 回答保存: ${savedCount}/36問`);
        if (nextButtonIssues.length > 0) {
            console.log(`⚠️ 次ボタン無効化問題: 質問${nextButtonIssues.join(', ')}`);
        }
        
        // 4. 分析実行
        console.log('\n【4. 分析処理】');
        await page.locator('#next-btn').click();
        console.log('⏳ 分析中...');
        await page.waitForTimeout(8000);
        
        // 5. 結果表示
        console.log('\n【5. 分析結果】');
        const resultsVisible = await page.locator('#results-screen').isVisible();
        console.log(`✅ 結果画面: ${resultsVisible ? '表示成功' : '表示失敗'}`);
        
        if (resultsVisible) {
            // OSカード情報取得
            const osInfo = await page.evaluate(() => {
                const cards = document.querySelectorAll('.os-card, .os-result-card');
                const results = [];
                cards.forEach(card => {
                    const name = card.querySelector('.os-name, .card-title, h3')?.textContent;
                    const percentage = card.querySelector('.os-percentage, .percentage, .strength, .os-strength')?.textContent;
                    if (name) {
                        results.push({ name: name.trim(), percentage: percentage?.trim() || 'N/A' });
                    }
                });
                return results;
            });
            
            console.log(`✅ Triple OSカード: ${osInfo.length}枚表示`);
            osInfo.forEach((os, i) => {
                console.log(`   ${i + 1}. ${os.name}: ${os.percentage}`);
            });
        }
        
        // スクリーンショット
        await page.screenshot({ 
            path: 'final_user_report_20250816.png',
            fullPage: false 
        });
        
        // 最終評価
        console.log('\n' + '=' .repeat(60));
        console.log('【最終評価】');
        console.log('=' .repeat(60));
        
        const checks = {
            'ウェルカム画面': welcomeVisible,
            '質問画面遷移': questionVisible,
            '36問回答保存': savedCount === 36,
            '次ボタン動作': nextButtonIssues.length === 0,
            '結果画面表示': resultsVisible
        };
        
        const passedCount = Object.values(checks).filter(v => v).length;
        const totalCount = Object.keys(checks).length;
        const score = (passedCount / totalCount * 100).toFixed(0);
        
        console.log('\n項目別評価:');
        Object.entries(checks).forEach(([item, passed]) => {
            console.log(`  ${passed ? '✅' : '❌'} ${item}`);
        });
        
        console.log(`\n総合スコア: ${score}%`);
        
        if (score === '100') {
            console.log('🎉 完璧！すべての機能が正常に動作しています！');
        } else if (score >= '80') {
            console.log('✅ 良好！主要機能は正常に動作しています。');
        } else {
            console.log('⚠️ 要改善。いくつかの機能に問題があります。');
        }
        
        return {
            score,
            checks,
            savedCount,
            nextButtonIssues
        };
        
    } catch (error) {
        console.error('❌ エラー:', error.message);
        return { error: error.message };
    } finally {
        console.log('\n📸 スクリーンショット保存: final_user_report_20250816.png');
        console.log('⏰ 10秒後にブラウザを閉じます...');
        await page.waitForTimeout(10000);
        await browser.close();
    }
}

// 実行
finalUserReport()
    .then(result => {
        console.log('\n' + '='.repeat(60));
        console.log('📊 レポート完了');
        console.log('='.repeat(60));
    })
    .catch(error => {
        console.error('❌ 致命的エラー:', error);
    });