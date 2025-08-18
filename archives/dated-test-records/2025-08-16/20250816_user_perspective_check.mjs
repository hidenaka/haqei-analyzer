/**
 * ユーザー視点での機能確認
 * Future Simulatorが本来の目的を果たしているか検証
 */

import { chromium } from 'playwright';

async function checkUserPerspective() {
    console.log('🎯 Future Simulator ユーザー視点検証');
    console.log('=====================================\n');
    console.log('【目的】ユーザーの悩みから8つの未来シナリオを生成・表示する');
    console.log('【期待】8枚のシナリオカードが表示され、未来の可能性が示される\n');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false
    });
    
    try {
        const page = await browser.newPage();
        
        console.log('📋 Step 1: ページアクセス');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle'
        });
        
        await page.waitForTimeout(2000);
        
        // 初期状態の確認
        const initialState = await page.evaluate(() => {
            return {
                title: document.querySelector('h1')?.textContent,
                subtitle: document.querySelector('.subtitle')?.textContent,
                inputAreaExists: !!document.querySelector('textarea'),
                buttonExists: !!document.querySelector('#aiGuessBtn'),
                resultsContainerExists: !!document.querySelector('#resultsContainer')
            };
        });
        
        console.log('  初期画面:');
        console.log(`    タイトル: ${initialState.title || '不明'}`);
        console.log(`    入力エリア: ${initialState.inputAreaExists ? '✅' : '❌'}`);
        console.log(`    分析ボタン: ${initialState.buttonExists ? '✅' : '❌'}`);
        console.log(`    結果エリア: ${initialState.resultsContainerExists ? '✅' : '❌'}`);
        
        console.log('\n📋 Step 2: ユーザー入力');
        const userInput = '転職すべきか現職に留まるべきか悩んでいます。将来のキャリアが不安です。';
        console.log(`  入力内容: "${userInput}"`);
        
        await page.fill('textarea', userInput);
        
        console.log('\n📋 Step 3: 分析実行');
        await page.click('#aiGuessBtn');
        console.log('  ボタンクリック: ✅');
        
        // 分析完了を待つ
        await page.waitForTimeout(6000);
        
        console.log('\n📋 Step 4: 結果確認（ユーザー視点）');
        
        const results = await page.evaluate(() => {
            // シナリオカードの確認
            const scenarioCards = document.querySelectorAll('.scenario-card');
            const cardDetails = [];
            
            scenarioCards.forEach((card, idx) => {
                const title = card.querySelector('.card-title, h3, h4')?.textContent || 
                             card.querySelector('[class*="title"]')?.textContent;
                const description = card.querySelector('.description, p')?.textContent ||
                                  card.querySelector('[class*="desc"]')?.textContent;
                const visible = window.getComputedStyle(card).display !== 'none';
                
                cardDetails.push({
                    index: idx + 1,
                    title: title?.trim(),
                    hasDescription: !!description,
                    descriptionPreview: description?.substring(0, 50),
                    visible: visible
                });
            });
            
            // その他の要素確認
            const canvasElements = document.querySelectorAll('canvas');
            const graphs = [];
            canvasElements.forEach(canvas => {
                const parent = canvas.parentElement;
                graphs.push({
                    width: canvas.width,
                    height: canvas.height,
                    visible: window.getComputedStyle(canvas).display !== 'none',
                    parentId: parent?.id || parent?.className
                });
            });
            
            // 8シナリオコンテナの確認
            const eightContainer = document.getElementById('eight-scenarios-display-container');
            const scenariosGrid = document.querySelector('.scenarios-grid');
            
            // 何か結果が表示されているか
            const resultsContainer = document.getElementById('resultsContainer');
            const hasAnyContent = resultsContainer && resultsContainer.textContent.length > 100;
            
            return {
                scenarioCards: {
                    count: scenarioCards.length,
                    details: cardDetails
                },
                graphs: {
                    count: canvasElements.length,
                    details: graphs
                },
                containers: {
                    eightContainerExists: !!eightContainer,
                    eightContainerVisible: eightContainer ? 
                        window.getComputedStyle(eightContainer).display !== 'none' : false,
                    scenariosGridExists: !!scenariosGrid
                },
                resultsDisplayed: hasAnyContent
            };
        });
        
        console.log('\n🎯 ユーザーが見える結果:');
        console.log('--------------------------------');
        
        // シナリオカード評価
        console.log(`\n  📊 8つのシナリオカード:`);
        if (results.scenarioCards.count === 0) {
            console.log('    ❌ カードが1枚も表示されていません！');
            console.log('    → ユーザーは未来の可能性を見ることができません');
        } else if (results.scenarioCards.count < 8) {
            console.log(`    ⚠️ ${results.scenarioCards.count}/8枚のみ表示`);
            results.scenarioCards.details.forEach(card => {
                console.log(`      ${card.index}. ${card.title || '(タイトルなし)'}`);
            });
        } else {
            console.log(`    ✅ ${results.scenarioCards.count}枚表示`);
            results.scenarioCards.details.slice(0, 3).forEach(card => {
                console.log(`      ${card.index}. ${card.title || '(タイトルなし)'}`);
            });
            console.log('      ...');
        }
        
        // グラフ評価
        console.log(`\n  📈 分析グラフ:`);
        if (results.graphs.count === 0) {
            console.log('    ❌ グラフが表示されていません');
        } else {
            console.log(`    ✅ ${results.graphs.count}個のグラフ表示`);
        }
        
        // 全体的な結果表示
        console.log(`\n  📝 結果表示:`);
        if (results.resultsDisplayed) {
            console.log('    ✅ 何らかの結果が表示されています');
        } else {
            console.log('    ❌ 結果が表示されていません');
        }
        
        console.log('\n=====================================');
        console.log('📊 総合評価（ユーザー視点）');
        console.log('=====================================\n');
        
        const score = {
            input: initialState.inputAreaExists ? 1 : 0,
            button: initialState.buttonExists ? 1 : 0,
            scenarios: Math.min(results.scenarioCards.count / 8, 1),
            graphs: results.graphs.count > 0 ? 1 : 0,
            results: results.resultsDisplayed ? 1 : 0
        };
        
        const totalScore = (
            score.input * 0.1 + 
            score.button * 0.1 + 
            score.scenarios * 0.5 +  // シナリオカードは最重要
            score.graphs * 0.2 + 
            score.results * 0.1
        ) * 100;
        
        console.log('  評価項目:');
        console.log(`    入力フォーム: ${score.input ? '✅' : '❌'} (10%)`);
        console.log(`    分析ボタン: ${score.button ? '✅' : '❌'} (10%)`);
        console.log(`    8シナリオカード: ${results.scenarioCards.count}/8 (50%)`);
        console.log(`    分析グラフ: ${score.graphs ? '✅' : '❌'} (20%)`);
        console.log(`    結果表示: ${score.results ? '✅' : '❌'} (10%)`);
        
        console.log(`\n  総合スコア: ${Math.round(totalScore)}%`);
        
        if (totalScore >= 80) {
            console.log('  判定: ✅ 期待通りの機能を提供');
        } else if (totalScore >= 60) {
            console.log('  判定: ⚠️ 部分的に機能（要改善）');
        } else {
            console.log('  判定: ❌ 中核機能が動作していない');
        }
        
        console.log('\n🔍 根本的な問題:');
        if (results.scenarioCards.count === 0) {
            console.log('  1. シナリオカードが全く表示されない');
            console.log('     → Future Simulatorの存在意義が失われている');
            console.log('  2. ユーザーは未来の可能性を見ることができない');
            console.log('     → 価値提供ができていない');
        }
        
        console.log('\n💡 必要な対応:');
        console.log('  優先度1: シナリオカードを表示させる（技術的詳細より重要）');
        console.log('  優先度2: 8枚すべてのカードを適切に配置');
        console.log('  優先度3: カード内容の充実（タイトル、説明、スコア）');
        
    } finally {
        console.log('\n⏰ 10秒後にブラウザを閉じます...');
        await page.waitForTimeout(10000);
        await browser.close();
    }
}

// 実行
checkUserPerspective().catch(console.error);