/**
 * スコアグラフ機能のテスト
 */

import { chromium } from 'playwright';

async function testScoreGraph() {
    console.log('📊 スコアグラフ機能テスト');
    console.log('=====================================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        
        // コンソールログを監視
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log('❌ エラー:', msg.text());
            }
        });
        
        console.log('📄 ページアクセス...');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        
        await page.waitForTimeout(2000);
        
        // 分析実行
        console.log('\n🧪 分析実行...');
        await page.fill('#situation-text', 'スコアグラフ表示のテスト分析です。新しい視覚的表現を確認します。');
        await page.click('.analyze-btn.primary');
        
        await page.waitForTimeout(5000);
        
        // グラフ要素の確認
        console.log('\n📊 グラフ要素チェック:');
        const graphCheck = await page.evaluate(() => {
            const results = {
                comparisonChart: null,
                radarCharts: [],
                timelineCharts: [],
                canvasElements: []
            };
            
            // 比較チャート確認
            const compChart = document.querySelector('.score-comparison-chart');
            if (compChart) {
                const canvas = compChart.querySelector('canvas');
                results.comparisonChart = {
                    exists: true,
                    canvasFound: !!canvas,
                    title: compChart.querySelector('h3')?.textContent,
                    subtitle: compChart.querySelector('.chart-subtitle')?.textContent,
                    legendItems: compChart.querySelectorAll('.legend-item').length
                };
            }
            
            // レーダーチャート確認
            const radarCharts = document.querySelectorAll('.score-radar-chart');
            radarCharts.forEach(chart => {
                const canvas = chart.querySelector('.radar-canvas');
                results.radarCharts.push({
                    canvasFound: !!canvas,
                    totalScore: chart.querySelector('.total-score')?.textContent
                });
            });
            
            // タイムラインチャート確認
            const timelineCharts = document.querySelectorAll('.timeline-chart');
            timelineCharts.forEach(chart => {
                const canvas = chart.querySelector('.timeline-canvas');
                results.timelineCharts.push({
                    canvasFound: !!canvas,
                    title: chart.querySelector('.timeline-title')?.textContent
                });
            });
            
            // すべてのCanvas要素を数える
            results.canvasElements = document.querySelectorAll('canvas').length;
            
            return results;
        });
        
        if (graphCheck.comparisonChart) {
            console.log('✅ 比較チャート: 存在');
            console.log(`  タイトル: "${graphCheck.comparisonChart.title}"`);
            console.log(`  サブタイトル: "${graphCheck.comparisonChart.subtitle}"`);
            console.log(`  Canvas: ${graphCheck.comparisonChart.canvasFound ? '✅' : '❌'}`);
            console.log(`  凡例項目: ${graphCheck.comparisonChart.legendItems}個`);
        } else {
            console.log('❌ 比較チャート: 見つかりません');
        }
        
        console.log(`\nレーダーチャート: ${graphCheck.radarCharts.length}個`);
        graphCheck.radarCharts.forEach((chart, i) => {
            console.log(`  ${i+1}. Canvas: ${chart.canvasFound ? '✅' : '❌'}, スコア: ${chart.totalScore}`);
        });
        
        console.log(`\nタイムラインチャート: ${graphCheck.timelineCharts.length}個`);
        
        console.log(`\n合計Canvas要素: ${graphCheck.canvasElements}個`);
        
        // スクリーンショット
        await page.screenshot({ 
            fullPage: true,
            path: '20250814_score_graph_screenshot.png'
        });
        console.log('\n📸 スクリーンショット保存: 20250814_score_graph_screenshot.png');
        
        return graphCheck;
        
    } catch (error) {
        console.error('❌ テストエラー:', error);
    } finally {
        console.log('\n⏱️ 15秒間表示確認...');
        await new Promise(resolve => setTimeout(resolve, 15000));
        await browser.close();
    }
}

// 実行
testScoreGraph().then(result => {
    console.log('\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 スコアグラフ機能テスト結果');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (result && result.comparisonChart) {
        console.log('\n✅ スコアグラフ機能が正常に動作しています');
        console.log('H384データベースのスコアを活用した視覚化が実装されました');
    } else {
        console.log('\n⚠️ スコアグラフが表示されていません');
        console.log('実装を確認してください');
    }
});