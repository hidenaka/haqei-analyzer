/**
 * UI構成の現状分析 - 重複と不整合を洗い出す
 */

import { chromium } from 'playwright';

async function analyzeUIStructure() {
    console.log('🔍 UI構成分析 - 現在の要素配置を調査');
    console.log('=====================================');
    
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
        
        await page.waitForTimeout(2000);
        
        console.log('\n【初期状態】');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // 初期状態の主要エリア確認
        const initialState = await page.evaluate(() => {
            const areas = {
                leftPanel: document.querySelector('.left-panel, .panel-left, #left-panel'),
                rightPanel: document.querySelector('.right-panel, .panel-right, #right-panel'),
                resultsContainer: document.getElementById('resultsContainer'),
                inputSection: document.getElementById('situation-input-section'),
                statusPanel: document.querySelector('.status-panel, #simulator-status'),
                diagnosticsBar: document.querySelector('.diagnostics, .debug-bar, [class*="diagnostic"]')
            };
            
            const results = {};
            for (const [name, elem] of Object.entries(areas)) {
                if (elem) {
                    const rect = elem.getBoundingClientRect();
                    const style = window.getComputedStyle(elem);
                    results[name] = {
                        exists: true,
                        visible: style.display !== 'none' && style.visibility !== 'hidden',
                        position: `(${rect.left.toFixed(0)}, ${rect.top.toFixed(0)})`,
                        size: `${rect.width.toFixed(0)}x${rect.height.toFixed(0)}`,
                        content: elem.textContent?.trim().substring(0, 50)
                    };
                } else {
                    results[name] = { exists: false };
                }
            }
            return results;
        });
        
        console.log('検出されたエリア:');
        for (const [name, info] of Object.entries(initialState)) {
            if (info.exists) {
                console.log(`✓ ${name}: ${info.visible ? '表示中' : '非表示'} ${info.position} ${info.size}`);
                if (info.content) {
                    console.log(`  内容: "${info.content}..."`);
                }
            } else {
                console.log(`✗ ${name}: 存在しない`);
            }
        }
        
        // 分析実行
        console.log('\n【分析実行後】');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        await page.fill('#situation-text', 'UI構成テストのための分析');
        await page.click('.analyze-btn.primary');
        await page.waitForTimeout(5000);
        
        // 分析後の要素確認
        const afterAnalysis = await page.evaluate(() => {
            // 結果表示に関わる全要素を収集
            const resultElements = {
                // 8カードシステム
                scenarioCards: document.querySelectorAll('.scenario-card'),
                threePhaseContainers: document.querySelectorAll('.three-phase-container'),
                
                // その他の結果表示
                currentSituation: document.querySelector('.panel-title'),
                statusAnalysis: document.querySelector('[class*="status-analysis"]'),
                resultsArea: document.querySelector('#resultsContainer'),
                
                // 重複の可能性がある要素
                duplicateResults: []
            };
            
            // 類似コンテンツを探す
            const allTextElements = document.querySelectorAll('h2, h3, .title, .panel-title');
            const textMap = {};
            allTextElements.forEach(elem => {
                const text = elem.textContent?.trim();
                if (text) {
                    if (!textMap[text]) textMap[text] = [];
                    textMap[text].push({
                        tag: elem.tagName,
                        class: elem.className,
                        parent: elem.parentElement?.className
                    });
                }
            });
            
            // 重複を検出
            for (const [text, elements] of Object.entries(textMap)) {
                if (elements.length > 1) {
                    resultElements.duplicateResults.push({
                        text,
                        count: elements.length,
                        locations: elements
                    });
                }
            }
            
            return {
                scenarioCardCount: resultElements.scenarioCards.length,
                threePhaseCount: resultElements.threePhaseContainers.length,
                hasDuplicates: resultElements.duplicateResults.length > 0,
                duplicates: resultElements.duplicateResults,
                currentSituationExists: !!resultElements.currentSituation,
                resultsAreaVisible: resultElements.resultsArea ? window.getComputedStyle(resultElements.resultsArea).display !== 'none' : false
            };
        });
        
        console.log(`\n8カードシステム: ${afterAnalysis.scenarioCardCount}個のカード`);
        console.log(`3段階表示: ${afterAnalysis.threePhaseCount}個のコンテナ`);
        console.log(`現在の状況パネル: ${afterAnalysis.currentSituationExists ? '存在' : '非存在'}`);
        console.log(`結果エリア表示: ${afterAnalysis.resultsAreaVisible ? '表示中' : '非表示'}`);
        
        if (afterAnalysis.hasDuplicates) {
            console.log('\n⚠️ 重複コンテンツ検出:');
            afterAnalysis.duplicates.forEach(dup => {
                console.log(`  "${dup.text}" が ${dup.count}箇所に存在`);
            });
        }
        
        // 画面レイアウト分析
        const layoutAnalysis = await page.evaluate(() => {
            const viewport = {
                width: window.innerWidth,
                height: window.innerHeight
            };
            
            // 主要コンテンツエリアを特定
            const mainContent = document.querySelector('#main-container, .main-content, main');
            const leftContent = Array.from(document.querySelectorAll('*')).filter(el => {
                const rect = el.getBoundingClientRect();
                return rect.left < viewport.width / 2 && rect.width > 100 && rect.height > 100;
            });
            const rightContent = Array.from(document.querySelectorAll('*')).filter(el => {
                const rect = el.getBoundingClientRect();
                return rect.left > viewport.width / 2 && rect.width > 100 && rect.height > 100;
            });
            
            return {
                viewport,
                hasLeftContent: leftContent.length > 0,
                hasRightContent: rightContent.length > 0,
                leftContentCount: leftContent.length,
                rightContentCount: rightContent.length
            };
        });
        
        console.log('\n【レイアウト分析】');
        console.log(`画面サイズ: ${layoutAnalysis.viewport.width}x${layoutAnalysis.viewport.height}`);
        console.log(`左側コンテンツ: ${layoutAnalysis.leftContentCount}個の要素`);
        console.log(`右側コンテンツ: ${layoutAnalysis.rightContentCount}個の要素`);
        
        return { initialState, afterAnalysis, layoutAnalysis };
        
    } catch (error) {
        console.error('❌ 分析エラー:', error);
    } finally {
        console.log('\n⏱️ 10秒間表示確認...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        await browser.close();
    }
}

// 実行
analyzeUIStructure().then(() => {
    console.log('\n');
    console.log('【提案】UI構成の改善案');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. 左側パネル（現在の状況）を削除 - 入力前から表示は不自然');
    console.log('2. 結果表示を8カードシステムに一本化');
    console.log('3. 診断バーは開発時のみ表示（本番では非表示）');
    console.log('4. シンプルな構成: 上部に入力 → 下部に8カード結果');
    console.log('\n理想的なフロー:');
    console.log('  ① ユーザーが悩みを入力');
    console.log('  ② 分析ボタンクリック');
    console.log('  ③ 8つのシナリオカードが表示される（これだけ！）');
    console.log('  ④ 各カードの3段階タイムラインで詳細確認');
});