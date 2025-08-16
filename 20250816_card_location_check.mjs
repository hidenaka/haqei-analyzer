/**
 * シナリオカードの配置場所を特定
 */

import { chromium } from 'playwright';

async function checkCardLocation() {
    console.log('🔍 シナリオカードの配置場所確認');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false
    });
    
    try {
        const page = await browser.newPage();
        
        console.log('📋 Step 1: ページ読み込み');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle'
        });
        
        await page.waitForTimeout(1000);
        
        console.log('\n📋 Step 2: 分析実行');
        await page.fill('textarea', 'テスト入力');
        await page.evaluate(() => {
            const btn = document.querySelector('#aiGuessBtn');
            if (btn) btn.click();
        });
        
        await page.waitForTimeout(5000);
        
        console.log('\n📋 Step 3: カード配置の詳細確認');
        
        const cardDetails = await page.evaluate(() => {
            const allCards = document.querySelectorAll('.scenario-card');
            const cardInfo = [];
            
            allCards.forEach((card, idx) => {
                let parent = card.parentElement;
                const hierarchy = [];
                
                // 親要素の階層を辿る
                while (parent && parent !== document.body) {
                    hierarchy.push({
                        tag: parent.tagName,
                        id: parent.id || '(no id)',
                        className: parent.className || '(no class)'
                    });
                    parent = parent.parentElement;
                }
                
                cardInfo.push({
                    index: idx,
                    directParent: {
                        tag: card.parentElement?.tagName,
                        id: card.parentElement?.id,
                        className: card.parentElement?.className
                    },
                    hierarchy: hierarchy.slice(0, 3), // 上位3階層まで
                    cardContent: {
                        hasTitle: !!card.querySelector('.card-title, h3, h4'),
                        hasDescription: !!card.querySelector('.description, p'),
                        text: card.textContent?.substring(0, 50)
                    }
                });
            });
            
            // 各コンテナの存在確認
            const containers = {
                resultsContainer: document.getElementById('resultsContainer'),
                eightScenariosContainer: document.getElementById('eight-scenarios-display-container'),
                scenariosGrid: document.getElementById('scenariosGrid'),
                scenariosCards: document.getElementById('scenarios-cards')
            };
            
            const containerInfo = {};
            Object.entries(containers).forEach(([name, elem]) => {
                if (elem) {
                    containerInfo[name] = {
                        exists: true,
                        children: elem.children.length,
                        hasScenarioCards: elem.querySelectorAll('.scenario-card').length,
                        display: window.getComputedStyle(elem).display,
                        visible: window.getComputedStyle(elem).display !== 'none'
                    };
                } else {
                    containerInfo[name] = { exists: false };
                }
            });
            
            return {
                totalCards: allCards.length,
                cards: cardInfo,
                containers: containerInfo
            };
        });
        
        console.log(`\n  シナリオカード総数: ${cardDetails.totalCards}個`);
        
        if (cardDetails.totalCards > 0) {
            console.log('\n  カードの配置場所:');
            
            // 配置場所をグループ化
            const locations = {};
            cardDetails.cards.forEach(card => {
                const key = `${card.directParent.id || card.directParent.className}`;
                if (!locations[key]) {
                    locations[key] = {
                        count: 0,
                        parent: card.directParent,
                        hierarchy: card.hierarchy
                    };
                }
                locations[key].count++;
            });
            
            Object.entries(locations).forEach(([key, info]) => {
                console.log(`\n    📍 ${key}: ${info.count}個のカード`);
                console.log(`       タグ: ${info.parent.tag}`);
                if (info.hierarchy.length > 0) {
                    console.log('       階層:');
                    info.hierarchy.forEach((level, idx) => {
                        console.log(`         ${idx + 1}. ${level.tag}#${level.id} (${level.className})`);
                    });
                }
            });
            
            // サンプルカードの内容
            const sampleCard = cardDetails.cards[0];
            if (sampleCard) {
                console.log('\n  サンプルカード内容:');
                console.log(`    タイトル: ${sampleCard.cardContent.hasTitle ? '✅' : '❌'}`);
                console.log(`    説明: ${sampleCard.cardContent.hasDescription ? '✅' : '❌'}`);
                console.log(`    テキスト: "${sampleCard.cardContent.text}..."`);
            }
        }
        
        console.log('\n  コンテナ状態:');
        Object.entries(cardDetails.containers).forEach(([name, info]) => {
            if (info.exists) {
                console.log(`\n    ${name}:`);
                console.log(`      存在: ✅`);
                console.log(`      子要素: ${info.children}個`);
                console.log(`      内部のカード: ${info.hasScenarioCards}個`);
                console.log(`      display: ${info.display}`);
                console.log(`      表示: ${info.visible ? '✅' : '❌'}`);
            } else {
                console.log(`\n    ${name}: ❌ (存在しない)`);
            }
        });
        
        console.log('\n=====================================');
        console.log('📊 分析結果');
        console.log('=====================================\n');
        
        if (cardDetails.totalCards > 0) {
            const inEightContainer = cardDetails.containers.eightScenariosContainer?.hasScenarioCards || 0;
            const inScenariosGrid = cardDetails.containers.scenariosGrid?.hasScenarioCards || 0;
            const inScenariosCards = cardDetails.containers.scenariosCards?.hasScenarioCards || 0;
            
            if (inEightContainer === 0 && cardDetails.totalCards > 0) {
                console.log('🚨 問題: カードは作成されているが、eight-scenarios-display-containerには配置されていない');
                console.log('\n📝 原因:');
                console.log('  binary-tree-complete-display.jsが独自の場所にカードを作成している');
                console.log('  SafeDOMUpdaterの処理が効いていない');
                
                console.log('\n💡 解決策:');
                console.log('  1. binary-treeが作成したカードをeight-scenarios-display-containerに移動');
                console.log('  2. またはbinary-treeの処理を無効化してSafeDOMUpdaterに任せる');
            } else if (inEightContainer > 0) {
                console.log('✅ カードは正しくeight-scenarios-display-containerに配置されています');
            }
        } else {
            console.log('❌ カードが作成されていません');
        }
        
    } finally {
        console.log('\n⏰ 10秒後にブラウザを閉じます...');
        await page.waitForTimeout(10000);
        await browser.close();
    }
}

// 実行
checkCardLocation().catch(console.error);