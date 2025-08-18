/**
 * NaN表示問題の詳細調査
 * シナリオカード内のNaNを特定
 */

import { chromium } from 'playwright';

async function investigateNaNIssue() {
    console.log('🔍 NaN表示問題の詳細調査');
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
        
        await page.waitForTimeout(3000);
        
        // 分析実行
        console.log('🧪 分析実行...');
        await page.fill('#situation-text', 'NaN問題調査のためのテスト分析を実行します。');
        await page.click('.analyze-btn.primary');
        
        await page.waitForTimeout(5000);
        
        // シナリオカードの詳細調査
        const nanInvestigation = await page.evaluate(() => {
            const cards = document.querySelectorAll('.scenario-card');
            const results = [];
            
            cards.forEach((card, index) => {
                // テキスト全体を取得
                const fullText = card.textContent || '';
                const innerHTML = card.innerHTML;
                
                // NaNを含む部分を特定
                const nanMatches = [];
                const lines = fullText.split('\n');
                lines.forEach((line, lineIndex) => {
                    if (line.includes('NaN')) {
                        nanMatches.push({
                            lineIndex,
                            line: line.trim(),
                            context: lines.slice(Math.max(0, lineIndex - 1), Math.min(lines.length, lineIndex + 2))
                        });
                    }
                });
                
                // スコア要素を詳しく調査
                const scoreElements = card.querySelectorAll('.score-indicator, .final-score, [class*="score"]');
                const scoreInfo = Array.from(scoreElements).map(el => ({
                    class: el.className,
                    text: el.textContent,
                    hasNaN: el.textContent.includes('NaN')
                }));
                
                // データ属性を調査
                const dataAttributes = {};
                for (let attr of card.attributes) {
                    if (attr.name.startsWith('data-')) {
                        dataAttributes[attr.name] = attr.value;
                    }
                }
                
                results.push({
                    cardIndex: index + 1,
                    hasNaN: fullText.includes('NaN'),
                    nanCount: (fullText.match(/NaN/g) || []).length,
                    nanMatches,
                    scoreElements: scoreInfo,
                    dataAttributes,
                    htmlSnippet: innerHTML.substring(0, 500)
                });
            });
            
            return results;
        });
        
        console.log('\n📊 シナリオカード調査結果:');
        nanInvestigation.forEach(card => {
            if (card.hasNaN) {
                console.log(`\n❌ カード${card.cardIndex}: ${card.nanCount}個のNaN`);
                
                if (card.nanMatches.length > 0) {
                    console.log('  NaNを含む行:');
                    card.nanMatches.forEach(match => {
                        console.log(`    行${match.lineIndex}: "${match.line}"`);
                    });
                }
                
                if (card.scoreElements.length > 0) {
                    console.log('  スコア要素:');
                    card.scoreElements.forEach(score => {
                        if (score.hasNaN) {
                            console.log(`    ❌ ${score.class}: "${score.text}"`);
                        }
                    });
                }
                
                console.log('  HTMLスニペット:');
                console.log('  ', card.htmlSnippet.substring(0, 200));
            }
        });
        
        // JavaScriptコンソールでの計算チェック
        console.log('\n🔬 JavaScript計算チェック...');
        const calcCheck = await page.evaluate(() => {
            // EightScenariosDisplayクラスの存在確認
            if (window.EightScenariosDisplay) {
                const display = new window.EightScenariosDisplay();
                
                // calculateScoreProgressionのテスト
                const testScenario = {
                    finalScore: 75,
                    confidence: 80
                };
                
                const testPhases = [
                    { change: 10 },
                    { change: -5 },
                    { change: 15 }
                ];
                
                try {
                    const result = display.calculateScoreProgression(testScenario, testPhases);
                    return {
                        hasMethod: true,
                        testResult: result,
                        isNaN: Object.values(result).some(v => isNaN(v))
                    };
                } catch (error) {
                    return {
                        hasMethod: true,
                        error: error.message
                    };
                }
            }
            
            return { hasMethod: false };
        });
        
        console.log('計算メソッドチェック:', calcCheck);
        
        return nanInvestigation;
        
    } catch (error) {
        console.error('❌ 調査エラー:', error);
        return { error: error.message };
    } finally {
        console.log('\n⏱️ 15秒間表示確認...');
        await new Promise(resolve => setTimeout(resolve, 15000));
        await browser.close();
    }
}

// 実行
investigateNaNIssue().then(result => {
    console.log('\n🎯 NaN調査完了');
    console.log('====================');
    
    const nanCards = result.filter(card => card.hasNaN);
    if (nanCards.length > 0) {
        console.log('\n📋 修正が必要:');
        console.log(`- ${nanCards.length}個のカードでNaN表示`);
        console.log('- 主にスコア計算部分で発生');
        console.log('\n🔧 推奨修正:');
        console.log('- calculateScoreProgression内のNaNチェック強化');
        console.log('- finalScoreとconfidenceのデフォルト値設定');
    }
}).catch(console.error);
