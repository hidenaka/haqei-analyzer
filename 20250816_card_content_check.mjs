/**
 * シナリオカードの内容詳細確認
 * カードは表示されているが内容が空の可能性を検証
 */

import { chromium } from 'playwright';

async function checkCardContent() {
    console.log('🔍 シナリオカード内容詳細確認');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false
    });
    
    try {
        const page = await browser.newPage();
        
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle'
        });
        
        await page.waitForTimeout(1000);
        
        // 分析実行
        await page.fill('textarea', '新しい挑戦をすべきか迷っています');
        await page.click('#aiGuessBtn');
        await page.waitForTimeout(6000);
        
        console.log('📋 シナリオカード内容の詳細分析');
        console.log('--------------------------------\n');
        
        const cardAnalysis = await page.evaluate(() => {
            // すべてのカード風の要素を探す
            const possibleCards = [];
            
            // 1. .scenario-cardクラスを探す
            document.querySelectorAll('.scenario-card').forEach((card, idx) => {
                possibleCards.push({
                    type: 'scenario-card class',
                    index: idx,
                    html: card.outerHTML.substring(0, 200),
                    textContent: card.textContent?.trim().substring(0, 100),
                    childrenCount: card.children.length,
                    visible: window.getComputedStyle(card).display !== 'none'
                });
            });
            
            // 2. .cardクラスを探す
            document.querySelectorAll('.card').forEach((card, idx) => {
                if (!card.classList.contains('scenario-card')) {
                    possibleCards.push({
                        type: 'card class',
                        index: idx,
                        html: card.outerHTML.substring(0, 200),
                        textContent: card.textContent?.trim().substring(0, 100),
                        childrenCount: card.children.length,
                        visible: window.getComputedStyle(card).display !== 'none'
                    });
                }
            });
            
            // 3. data-key属性を持つ要素を探す
            document.querySelectorAll('[data-key]').forEach((elem, idx) => {
                possibleCards.push({
                    type: 'data-key element',
                    index: idx,
                    dataKey: elem.dataset.key,
                    tagName: elem.tagName,
                    className: elem.className,
                    html: elem.outerHTML.substring(0, 200),
                    textContent: elem.textContent?.trim().substring(0, 100),
                    childrenCount: elem.children.length,
                    visible: window.getComputedStyle(elem).display !== 'none'
                });
            });
            
            // 4. eight-scenarios-display-container内の要素
            const eightContainer = document.getElementById('eight-scenarios-display-container');
            let eightContainerContent = null;
            if (eightContainer) {
                const childElements = [];
                for (let child of eightContainer.children) {
                    childElements.push({
                        tagName: child.tagName,
                        className: child.className,
                        id: child.id,
                        textLength: child.textContent?.length,
                        innerHTML: child.innerHTML.substring(0, 100)
                    });
                }
                eightContainerContent = {
                    exists: true,
                    childCount: eightContainer.children.length,
                    children: childElements,
                    totalText: eightContainer.textContent?.length
                };
            }
            
            // 5. resultsContainer内の構造
            const resultsContainer = document.getElementById('resultsContainer');
            let resultsStructure = null;
            if (resultsContainer) {
                const structure = [];
                const walkDOM = (element, depth = 0) => {
                    if (depth > 3) return;
                    
                    for (let child of element.children) {
                        const info = {
                            depth: depth,
                            tagName: child.tagName,
                            className: child.className,
                            id: child.id,
                            childCount: child.children.length,
                            hasText: child.textContent?.trim().length > 0
                        };
                        
                        if (child.className?.includes('card') || 
                            child.className?.includes('scenario')) {
                            info.important = true;
                            info.textPreview = child.textContent?.trim().substring(0, 50);
                        }
                        
                        structure.push(info);
                        walkDOM(child, depth + 1);
                    }
                };
                
                walkDOM(resultsContainer);
                resultsStructure = structure;
            }
            
            return {
                possibleCards,
                eightContainerContent,
                resultsStructure
            };
        });
        
        // 結果を分析
        console.log(`見つかったカード風要素: ${cardAnalysis.possibleCards.length}個\n`);
        
        if (cardAnalysis.possibleCards.length > 0) {
            console.log('📊 カード要素の詳細:');
            cardAnalysis.possibleCards.forEach((card, idx) => {
                console.log(`\n  ${idx + 1}. ${card.type}`);
                if (card.dataKey) {
                    console.log(`     data-key: ${card.dataKey}`);
                }
                console.log(`     タグ: ${card.tagName || 'N/A'}`);
                console.log(`     クラス: ${card.className || 'N/A'}`);
                console.log(`     子要素: ${card.childrenCount}個`);
                console.log(`     表示: ${card.visible ? '✅' : '❌'}`);
                console.log(`     テキスト: "${card.textContent || '(空)'}"`);
                if (card.html) {
                    console.log(`     HTML: ${card.html}...`);
                }
            });
        }
        
        if (cardAnalysis.eightContainerContent) {
            console.log('\n📦 eight-scenarios-display-container:');
            console.log(`  存在: ✅`);
            console.log(`  子要素: ${cardAnalysis.eightContainerContent.childCount}個`);
            console.log(`  総テキスト長: ${cardAnalysis.eightContainerContent.totalText}`);
            
            if (cardAnalysis.eightContainerContent.children.length > 0) {
                console.log('  子要素の詳細:');
                cardAnalysis.eightContainerContent.children.forEach((child, idx) => {
                    console.log(`    ${idx + 1}. ${child.tagName}#${child.id} (${child.className})`);
                    console.log(`       テキスト長: ${child.textLength}`);
                    console.log(`       HTML: ${child.innerHTML}...`);
                });
            }
        }
        
        if (cardAnalysis.resultsStructure && cardAnalysis.resultsStructure.length > 0) {
            console.log('\n🏗️ resultsContainer内の重要な要素:');
            cardAnalysis.resultsStructure
                .filter(elem => elem.important)
                .forEach(elem => {
                    console.log(`  ${'  '.repeat(elem.depth)}${elem.tagName}.${elem.className}`);
                    if (elem.textPreview) {
                        console.log(`  ${'  '.repeat(elem.depth)}→ "${elem.textPreview}..."`);
                    }
                });
        }
        
        console.log('\n=====================================');
        console.log('📊 診断結果');
        console.log('=====================================\n');
        
        const hasRealCards = cardAnalysis.possibleCards.some(card => 
            card.visible && card.textContent && card.textContent.length > 10
        );
        
        const hasEmptyCards = cardAnalysis.possibleCards.some(card => 
            card.visible && (!card.textContent || card.textContent.length < 10)
        );
        
        if (hasRealCards) {
            console.log('✅ 実際にコンテンツを持つカードが表示されています');
        } else if (hasEmptyCards) {
            console.log('⚠️ カード要素は存在するが、コンテンツが空または不十分');
            console.log('\n原因の可能性:');
            console.log('  1. データが正しく渡されていない');
            console.log('  2. テンプレート処理でエラーが発生');
            console.log('  3. CSSで内容が隠されている');
        } else {
            console.log('❌ カード要素が見つかりません');
        }
        
    } finally {
        console.log('\n⏰ 10秒後にブラウザを閉じます...');
        await page.waitForTimeout(10000);
        await browser.close();
    }
}

// 実行
checkCardContent().catch(console.error);