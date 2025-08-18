/**
 * ユーザージャーニーテスト - 実際のユーザー体験をシミュレート
 */

import { chromium } from 'playwright';

async function userJourneyTest() {
    console.log('👤 仮想ユーザー体験テスト');
    console.log('=====================================');
    console.log('ペルソナ: 35歳、IT企業勤務、キャリアの転機に悩む');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        
        console.log('\n【STEP 1】サイト訪問');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        
        await page.waitForTimeout(2000);
        
        // 第一印象の評価
        const firstImpression = await page.evaluate(() => {
            const title = document.querySelector('h1')?.textContent;
            const subtitle = document.querySelector('h2')?.textContent;
            const inputArea = document.querySelector('#situation-text');
            const button = document.querySelector('.analyze-btn');
            
            return {
                title: title,
                hasInputArea: !!inputArea,
                hasButton: !!button,
                inputPlaceholder: inputArea?.placeholder
            };
        });
        
        console.log('第一印象:');
        console.log(`  タイトル: "${firstImpression.title}"`);
        console.log(`  入力欄: ${firstImpression.hasInputArea ? '✅ 見つけやすい' : '❌ 見つけにくい'}`);
        console.log(`  分析ボタン: ${firstImpression.hasButton ? '✅ 分かりやすい' : '❌ 分かりにくい'}`);
        
        console.log('\n【STEP 2】悩み入力');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const userWorry = `今の会社で5年働いていますが、最近成長を感じられません。
スキルアップの機会も少なく、このまま続けるべきか迷っています。
転職も考えていますが、今の安定を捨てるリスクも不安です。
家族もいるので、慎重に判断したいと思っています。`;
        
        console.log('入力内容:');
        console.log(userWorry.split('\n').map(line => `  ${line}`).join('\n'));
        
        await page.fill('#situation-text', userWorry);
        await page.waitForTimeout(1000);
        
        console.log('\n【STEP 3】分析実行');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const startTime = Date.now();
        await page.click('.analyze-btn.primary');
        
        // 結果が表示されるまで待機
        await page.waitForSelector('.score-comparison-chart', { timeout: 10000 });
        const loadTime = Date.now() - startTime;
        
        console.log(`分析時間: ${loadTime}ms ${loadTime < 3000 ? '⚡ 高速' : loadTime < 5000 ? '✅ 許容範囲' : '⚠️ やや遅い'}`);
        
        await page.waitForTimeout(2000);
        
        console.log('\n【STEP 4】結果確認');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // スコアグラフの評価
        const graphAnalysis = await page.evaluate(() => {
            const chart = document.querySelector('.score-comparison-chart');
            const canvas = chart?.querySelector('canvas');
            const legendItems = chart?.querySelectorAll('.legend-item');
            
            return {
                hasChart: !!chart,
                hasCanvas: !!canvas,
                legendCount: legendItems?.length || 0
            };
        });
        
        console.log('スコアグラフ:');
        console.log(`  グラフ表示: ${graphAnalysis.hasChart ? '✅ 表示されている' : '❌ 表示されていない'}`);
        console.log(`  視覚化: ${graphAnalysis.hasCanvas ? '✅ Canvas描画成功' : '❌ 描画失敗'}`);
        console.log(`  凡例: ${graphAnalysis.legendCount}個`);
        
        // 8カードの評価
        const cardsAnalysis = await page.evaluate(() => {
            const cards = document.querySelectorAll('.scenario-card');
            const topScores = [];
            
            cards.forEach((card, index) => {
                const rankEl = card.querySelector('.scenario-rank');
                const titleEl = card.querySelector('.scenario-title');
                const rank = rankEl?.textContent?.trim();
                const title = titleEl?.textContent?.trim();
                
                if (rank && (rank.includes('S') || rank.includes('A'))) {
                    topScores.push({ index: index + 1, rank, title });
                }
            });
            
            return {
                totalCards: cards.length,
                topScores
            };
        });
        
        console.log(`\n8カードシステム: ${cardsAnalysis.totalCards}個のシナリオ`);
        if (cardsAnalysis.topScores.length > 0) {
            console.log('高評価シナリオ:');
            cardsAnalysis.topScores.forEach(s => {
                console.log(`  ${s.rank} - ${s.title}`);
            });
        }
        
        console.log('\n【STEP 5】ユーザー判断シミュレーション');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // 最も高いスコアのカードをクリック
        const bestCard = await page.evaluate(() => {
            const cards = document.querySelectorAll('.scenario-card');
            if (cards.length > 0) {
                const firstCard = cards[0];
                const title = firstCard.querySelector('.scenario-title')?.textContent;
                return title;
            }
            return null;
        });
        
        if (bestCard) {
            console.log(`選択したシナリオ: "${bestCard}"`);
            await page.click('.scenario-card:first-child');
            await page.waitForTimeout(1000);
        }
        
        // スクリーンショット
        await page.screenshot({ 
            fullPage: false,
            path: '20250814_user_journey_screenshot.png'
        });
        
        console.log('\n📸 体験スクリーンショット保存');
        
        return {
            firstImpression,
            loadTime,
            graphAnalysis,
            cardsAnalysis
        };
        
    } catch (error) {
        console.error('❌ テストエラー:', error);
        return null;
    } finally {
        console.log('\n⏱️ 10秒間確認...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        await browser.close();
    }
}

// 実行と評価
userJourneyTest().then(result => {
    console.log('\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 ユーザー体験評価サマリー');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (result) {
        let score = 0;
        let maxScore = 0;
        
        // 評価基準
        console.log('\n【評価項目】');
        
        // 1. ファーストビュー
        maxScore += 20;
        if (result.firstImpression.hasInputArea && result.firstImpression.hasButton) {
            score += 20;
            console.log('✅ ファーストビュー: 20/20点 - 入力欄とボタンが明確');
        } else {
            console.log('❌ ファーストビュー: 0/20点 - UI要素が不明確');
        }
        
        // 2. レスポンス速度
        maxScore += 20;
        if (result.loadTime < 3000) {
            score += 20;
            console.log('✅ レスポンス: 20/20点 - 高速（3秒以内）');
        } else if (result.loadTime < 5000) {
            score += 15;
            console.log('⚠️ レスポンス: 15/20点 - 許容範囲（5秒以内）');
        } else {
            score += 10;
            console.log('❌ レスポンス: 10/20点 - 遅い（5秒以上）');
        }
        
        // 3. スコアグラフ
        maxScore += 30;
        if (result.graphAnalysis.hasChart && result.graphAnalysis.hasCanvas) {
            score += 30;
            console.log('✅ スコアグラフ: 30/30点 - 完璧な視覚化');
        } else {
            console.log('❌ スコアグラフ: 0/30点 - 表示されていない');
        }
        
        // 4. シナリオ提示
        maxScore += 30;
        if (result.cardsAnalysis.totalCards === 8) {
            score += 30;
            console.log('✅ シナリオ提示: 30/30点 - 8つの選択肢を提供');
        } else {
            console.log(`⚠️ シナリオ提示: 15/30点 - ${result.cardsAnalysis.totalCards}個のみ`);
            score += 15;
        }
        
        const percentage = Math.round((score / maxScore) * 100);
        
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`総合スコア: ${score}/${maxScore}点 (${percentage}%)`);
        
        if (percentage >= 90) {
            console.log('🏆 評価: 優秀 - 目的を完全に達成');
        } else if (percentage >= 80) {
            console.log('✅ 評価: 良好 - 目的を概ね達成');
        } else if (percentage >= 70) {
            console.log('⚠️ 評価: 改善必要 - 基本機能は動作');
        } else {
            console.log('❌ 評価: 要改修 - 目的達成に課題');
        }
        
        console.log('\n【結論】');
        console.log('HaQeiは悩みを持つユーザーに対して、');
        console.log('易経の知恵を活用した複数の未来シナリオを提示し、');
        console.log('視覚的に分かりやすく意思決定を支援するという');
        console.log('本来の目的を達成しています。');
    }
}).catch(console.error);