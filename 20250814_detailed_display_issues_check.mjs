/**
 * 分析後の詳細表示問題チェック
 * 8カードやタイムライン表示の問題を特定
 */

import { chromium } from 'playwright';

async function checkDetailedDisplayIssues() {
    console.log('🔍 分析後の詳細表示問題チェック開始');
    console.log('====================================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        
        await page.waitForTimeout(3000);
        
        // テスト分析を実行
        console.log('🧪 テスト分析実行...');
        await page.fill('#situation-text', 'キャリア転換について悩んでいます。現在の安定した仕事を続けるか、新しい挑戦をするか迷っています。');
        await page.click('.analyze-btn.primary');
        
        // 分析完了を待つ
        await page.waitForTimeout(5000);
        
        console.log('\n📊 分析後の詳細表示チェック');
        console.log('============================');
        
        const detailedCheck = await page.evaluate(() => {
            // シナリオカードの詳細チェック
            const scenarioCards = Array.from(document.querySelectorAll('.scenario-card'));
            const phaseBlocks = Array.from(document.querySelectorAll('.phase-block'));
            
            const checkElement = (element, index) => {
                if (!element) return { exists: false, index };
                
                const rect = element.getBoundingClientRect();
                const computedStyle = window.getComputedStyle(element);
                
                // 内部要素のチェック
                const title = element.querySelector('.scenario-title, .phase-title');
                const content = element.querySelector('.scenario-content, .phase-content, .scenario-description');
                const metadata = element.querySelector('.scenario-metadata, .phase-metadata');
                
                return {
                    index,
                    exists: true,
                    visible: rect.width > 0 && rect.height > 0 && 
                            computedStyle.display !== 'none' && 
                            computedStyle.visibility !== 'hidden' &&
                            parseFloat(computedStyle.opacity) > 0,
                    rect: {
                        width: Math.round(rect.width),
                        height: Math.round(rect.height),
                        top: Math.round(rect.top),
                        left: Math.round(rect.left)
                    },
                    style: {
                        display: computedStyle.display,
                        visibility: computedStyle.visibility,
                        opacity: computedStyle.opacity,
                        backgroundColor: computedStyle.backgroundColor,
                        border: computedStyle.border,
                        padding: computedStyle.padding,
                        margin: computedStyle.margin
                    },
                    content: {
                        title: title ? title.textContent?.trim().substring(0, 50) + '...' : 'タイトルなし',
                        description: content ? content.textContent?.trim().substring(0, 80) + '...' : 'コンテンツなし',
                        metadata: metadata ? metadata.textContent?.trim().substring(0, 30) + '...' : 'メタデータなし',
                        innerHTML: element.innerHTML.length
                    },
                    structure: {
                        hasTitle: !!title,
                        hasContent: !!content,
                        hasMetadata: !!metadata,
                        childrenCount: element.children.length,
                        classes: element.className
                    }
                };
            };
            
            // シナリオカードチェック
            const scenarioResults = scenarioCards.map((card, index) => checkElement(card, index));
            
            // フェーズブロックチェック
            const phaseResults = phaseBlocks.map((phase, index) => checkElement(phase, index));
            
            // 全体コンテナのチェック
            const containers = {
                eightScenariosContainer: document.querySelector('.eight-scenarios-container'),
                scenarioGrid: document.querySelector('.scenario-grid'),
                threeStageContainer: document.querySelector('.three-stage-container'),
                threeStageTitle: document.querySelector('.three-stage-title'),
                threeStageSubtitle: document.querySelector('.three-stage-subtitle')
            };
            
            const containerResults = {};
            for (const [key, element] of Object.entries(containers)) {
                containerResults[key] = checkElement(element, 0);
            }
            
            // 表示品質チェック
            const qualityCheck = {
                // スタイリング
                hasCustomStyles: !!document.getElementById('eight-scenarios-styles'),
                
                // レスポンシブ対応
                hasGridLayout: scenarioCards.some(card => {
                    const parent = card.parentElement;
                    return parent && window.getComputedStyle(parent).display === 'grid';
                }),
                
                // カードの統一性
                cardSizesConsistent: (() => {
                    if (scenarioCards.length === 0) return true;
                    const firstCardRect = scenarioCards[0].getBoundingClientRect();
                    return scenarioCards.every(card => {
                        const rect = card.getBoundingClientRect();
                        return Math.abs(rect.height - firstCardRect.height) < 20; // 20px以内の誤差は許容
                    });
                })(),
                
                // テキスト表示の問題
                hasEmptyCards: scenarioResults.filter(card => 
                    card.exists && card.visible && 
                    (!card.content.title || card.content.title.includes('undefined') || card.content.title === 'タイトルなし...')
                ).length,
                
                // 重なり・レイアウト問題
                hasOverlappingCards: (() => {
                    for (let i = 0; i < scenarioCards.length - 1; i++) {
                        const rect1 = scenarioCards[i].getBoundingClientRect();
                        const rect2 = scenarioCards[i + 1].getBoundingClientRect();
                        
                        if (rect1.right > rect2.left && rect1.left < rect2.right &&
                            rect1.bottom > rect2.top && rect1.top < rect2.bottom) {
                            return true;
                        }
                    }
                    return false;
                })()
            };
            
            return {
                scenarios: scenarioResults,
                phases: phaseResults,
                containers: containerResults,
                quality: qualityCheck,
                summary: {
                    totalScenarios: scenarioCards.length,
                    visibleScenarios: scenarioResults.filter(s => s.visible).length,
                    totalPhases: phaseBlocks.length,
                    visiblePhases: phaseResults.filter(p => p.visible).length
                }
            };
        });
        
        // 結果の詳細表示
        console.log('\n🎴 シナリオカード詳細分析:');
        console.log('========================');
        console.log(`総シナリオ数: ${detailedCheck.summary.totalScenarios}枚`);
        console.log(`表示シナリオ数: ${detailedCheck.summary.visibleScenarios}枚`);
        
        detailedCheck.scenarios.forEach((scenario, index) => {
            if (!scenario.exists) {
                console.log(`❌ シナリオ ${index + 1}: 存在しない`);
                return;
            }
            
            const status = scenario.visible ? '✅' : '❌';
            console.log(`\\n${status} シナリオ ${index + 1}:`);
            console.log(`  サイズ: ${scenario.rect.width}x${scenario.rect.height}px`);
            console.log(`  位置: top=${scenario.rect.top}, left=${scenario.rect.left}`);
            console.log(`  表示: ${scenario.style.display}, visibility:${scenario.style.visibility}, opacity:${scenario.style.opacity}`);
            console.log(`  タイトル: "${scenario.content.title}"`);
            console.log(`  内容: "${scenario.content.description}"`);
            console.log(`  構造: title:${scenario.structure.hasTitle}, content:${scenario.structure.hasContent}, children:${scenario.structure.childrenCount}`);
            console.log(`  CSS: ${scenario.structure.classes}`);
            
            // 問題の特定
            const issues = [];
            if (!scenario.visible) issues.push('非表示');
            if (scenario.rect.width === 0 || scenario.rect.height === 0) issues.push('サイズ0');
            if (scenario.content.title.includes('undefined')) issues.push('undefinedタイトル');
            if (!scenario.structure.hasTitle) issues.push('タイトル要素なし');
            if (!scenario.structure.hasContent) issues.push('コンテンツ要素なし');
            
            if (issues.length > 0) {
                console.log(`  ⚠️ 問題: ${issues.join(', ')}`);
            }
        });
        
        console.log('\\n⏰ フェーズブロック詳細分析:');
        console.log('=========================');
        console.log(`総フェーズ数: ${detailedCheck.summary.totalPhases}個`);
        console.log(`表示フェーズ数: ${detailedCheck.summary.visiblePhases}個`);
        
        detailedCheck.phases.slice(0, 6).forEach((phase, index) => {  // 最初の6個のみ表示
            if (!phase.exists) {
                console.log(`❌ フェーズ ${index + 1}: 存在しない`);
                return;
            }
            
            const status = phase.visible ? '✅' : '❌';
            console.log(`${status} フェーズ ${index + 1}: ${phase.rect.width}x${phase.rect.height}px - "${phase.content.title}"`);
            
            if (phase.content.title.includes('undefined') || phase.content.title === 'タイトルなし...') {
                console.log(`  ⚠️ タイトル問題: "${phase.content.title}"`);
            }
        });
        
        console.log('\\n📦 コンテナ構造分析:');
        console.log('==================');
        Object.entries(detailedCheck.containers).forEach(([key, container]) => {
            const status = container.exists ? (container.visible ? '✅' : '❌') : '❌';
            console.log(`${key}: ${status}`);
            if (container.exists) {
                console.log(`  ${container.rect.width}x${container.rect.height}px`);
                if (!container.visible) {
                    console.log(`  問題: ${container.style.display}, ${container.style.visibility}, opacity:${container.style.opacity}`);
                }
            }
        });
        
        console.log('\\n🎨 表示品質分析:');
        console.log('===============');
        console.log(`カスタムスタイル: ${detailedCheck.quality.hasCustomStyles ? '✅' : '❌'}`);
        console.log(`グリッドレイアウト: ${detailedCheck.quality.hasGridLayout ? '✅' : '❌'}`);
        console.log(`カードサイズ統一: ${detailedCheck.quality.cardSizesConsistent ? '✅' : '❌'}`);
        console.log(`空のカード: ${detailedCheck.quality.hasEmptyCards}枚`);
        console.log(`重なり問題: ${detailedCheck.quality.hasOverlappingCards ? '❌あり' : '✅なし'}`);
        
        // 全ページのスクリーンショット
        console.log('\\n📸 フルページスクリーンショット撮影...');
        await page.screenshot({ 
            fullPage: true,
            path: '20250814_full_page_after_analysis.png'
        });
        console.log('✅ フルページスクリーンショット保存: 20250814_full_page_after_analysis.png');
        
        return detailedCheck;
        
    } catch (error) {
        console.error('❌ 詳細チェックエラー:', error);
        return { error: error.message };
    } finally {
        console.log('\\n⏱️ 20秒間表示確認...');
        await new Promise(resolve => setTimeout(resolve, 20000));
        await browser.close();
    }
}

// 実行
checkDetailedDisplayIssues().then(result => {
    console.log('\\n🎯 詳細表示問題チェック完了');
    console.log('============================');
    
    if (result.error) {
        console.log(`❌ エラー: ${result.error}`);
        return;
    }
    
    // 修正が必要な問題をまとめる
    console.log('\\n⚠️ 修正が必要な表示問題まとめ:');
    console.log('=============================');
    
    let issueCount = 0;
    
    // シナリオカードの問題
    const scenarioIssues = result.scenarios.filter(s => 
        !s.visible || 
        s.rect.width === 0 || 
        s.rect.height === 0 || 
        s.content.title.includes('undefined') ||
        !s.structure.hasTitle ||
        !s.structure.hasContent
    );
    
    if (scenarioIssues.length > 0) {
        console.log(`\\n❌ シナリオカード問題: ${scenarioIssues.length}枚`);
        scenarioIssues.forEach(issue => {
            console.log(`  - シナリオ${issue.index + 1}: ${issue.visible ? '表示中' : '非表示'}, タイトル:"${issue.content.title}"`);
        });
        issueCount++;
    }
    
    // フェーズブロックの問題
    const phaseIssues = result.phases.filter(p => 
        !p.visible || 
        p.content.title.includes('undefined') ||
        p.content.title === 'タイトルなし...'
    );
    
    if (phaseIssues.length > 0) {
        console.log(`\\n❌ フェーズブロック問題: ${phaseIssues.length}個`);
        console.log(`  主な問題: undefinedタイトル、非表示要素`);
        issueCount++;
    }
    
    // コンテナの問題
    const containerIssues = Object.entries(result.containers).filter(([key, container]) => 
        !container.exists || !container.visible
    );
    
    if (containerIssues.length > 0) {
        console.log(`\\n❌ コンテナ問題: ${containerIssues.length}個`);
        containerIssues.forEach(([key, container]) => {
            console.log(`  - ${key}: ${container.exists ? '存在するが非表示' : '存在しない'}`);
        });
        issueCount++;
    }
    
    // 品質問題
    if (!result.quality.hasCustomStyles) {
        console.log('\\n❌ スタイリング問題: カスタムスタイルが適用されていない');
        issueCount++;
    }
    
    if (result.quality.hasEmptyCards > 0) {
        console.log(`\\n❌ コンテンツ問題: 空のカードが${result.quality.hasEmptyCards}枚`);
        issueCount++;
    }
    
    if (result.quality.hasOverlappingCards) {
        console.log('\\n❌ レイアウト問題: カードの重なりが発生');
        issueCount++;
    }
    
    if (issueCount === 0) {
        console.log('✅ 重大な表示問題は見つかりませんでした');
    } else {
        console.log(`\\n📋 合計 ${issueCount} 種類の表示問題を発見しました`);
    }
    
}).catch(console.error);