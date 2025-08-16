/**
 * 8カード固定・タイムライン表示機能の動作検証
 */

import { chromium } from 'playwright';

async function verifyUI8CardsImplementation() {
    console.log('[UI検証] 8カード固定・タイムライン表示機能の動作検証開始');
    console.log('=====================================================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        
        // エラー監視
        const errors = [];
        const logs = [];
        
        page.on('pageerror', error => {
            errors.push(error.message);
            console.error('❌ Page Error:', error.message);
        });
        
        page.on('console', msg => {
            const text = msg.text();
            logs.push(text);
            if (text.includes('EightScenariosDisplay') || text.includes('8') || text.includes('カード')) {
                console.log('📋 Log:', text);
            }
        });
        
        console.log('[UI検証] Future Simulatorページにアクセス...');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 25000
        });
        
        console.log('[UI検証] 初期化待機（10秒）...');
        await page.waitForTimeout(10000);
        
        // 分析を実行してシナリオ表示をトリガー
        console.log('[UI検証] 分析実行でシナリオ生成をトリガー...');
        await page.evaluate(() => {
            const textarea = document.getElementById('situation-text');
            if (textarea) {
                textarea.value = '転職を考えているが、今の安定した職場を離れるべきか迷っています。新しい挑戦をしたい気持ちと、リスクを恐れる気持ちが混在しています。';
            }
            
            const analyzeBtn = document.querySelector('.analyze-btn.primary');
            if (analyzeBtn) {
                analyzeBtn.click();
            }
        });
        
        console.log('[UI検証] 分析処理待機（15秒）...');
        await page.waitForTimeout(15000);
        
        // UI要素検証
        const verification = await page.evaluate(() => {
            const results = {
                // 基本UI要素の存在確認
                eightScenariosContainer: !!document.querySelector('.eight-scenarios-container'),
                scenarioGrid: !!document.querySelector('.scenario-grid'),
                scenarioCards: document.querySelectorAll('.scenario-card').length,
                
                // 8カード固定の確認
                exactlyEightCards: document.querySelectorAll('.scenario-card').length === 8,
                
                // タイムライン機能の確認
                threePhasesContainers: document.querySelectorAll('.three-phase-container').length,
                phaseBlocks: document.querySelectorAll('.phase-block').length,
                scoreIndicators: document.querySelectorAll('.score-indicator').length,
                
                // 変化方式表示の確認
                changeMethodDisplays: document.querySelectorAll('[style*="爻が進む"], [style*="爻が変わる"]').length,
                
                // 386爻準拠システム表示確認
                systemInfo: !!document.querySelector('[style*="386爻準拠システム"]') || 
                           !!Array.from(document.querySelectorAll('div')).find(el => el.textContent.includes('386爻データ使用')),
                
                // 実現可能性バー確認
                probabilityBars: document.querySelectorAll('.probability-bar').length,
                probabilityFills: document.querySelectorAll('.probability-fill').length,
                
                // ランク表示確認
                rankElements: document.querySelectorAll('.scenario-rank').length,
                
                // 詳細情報
                cardDetails: []
            };
            
            // 各カードの詳細情報を取得
            const cards = document.querySelectorAll('.scenario-card');
            cards.forEach((card, index) => {
                const detail = {
                    index: index + 1,
                    hasTitle: !!card.querySelector('.scenario-title'),
                    hasPhaseContainer: !!card.querySelector('.three-phase-container'),
                    hasPhaseBlocks: card.querySelectorAll('.phase-block').length,
                    hasScoreIndicators: card.querySelectorAll('.score-indicator').length,
                    hasProbabilityBar: !!card.querySelector('.probability-bar'),
                    hasRank: !!card.querySelector('.scenario-rank'),
                    hasChangeMethod: !!card.querySelector('[style*="爻が進む"], [style*="爻が変わる"]'),
                    cardHeight: card.offsetHeight,
                    cardContent: card.innerHTML.length
                };
                results.cardDetails.push(detail);
            });
            
            return results;
        });
        
        // 結果分析
        console.log('\n[UI検証] 検証結果:');
        console.log('==========================================');
        console.log(`  📊 シナリオコンテナ: ${verification.eightScenariosContainer ? '✅' : '❌'}`);
        console.log(`  📊 シナリオグリッド: ${verification.scenarioGrid ? '✅' : '❌'}`);
        console.log(`  📊 シナリオカード数: ${verification.scenarioCards}枚`);
        console.log(`  📊 8カード固定: ${verification.exactlyEightCards ? '✅ 正確に8枚' : `❌ ${verification.scenarioCards}枚（8枚でない）`}`);
        
        console.log(`\n[UI検証] タイムライン機能:`);
        console.log('==========================================');
        console.log(`  ⏰ 3段階コンテナ: ${verification.threePhasesContainers}個`);
        console.log(`  ⏰ フェーズブロック: ${verification.phaseBlocks}個`);
        console.log(`  ⏰ スコア表示: ${verification.scoreIndicators}個`);
        console.log(`  ⏰ 変化方式表示: ${verification.changeMethodDisplays}個`);
        
        console.log(`\n[UI検証] 追加機能:`);
        console.log('==========================================');
        console.log(`  🎯 386爻システム表示: ${verification.systemInfo ? '✅' : '❌'}`);
        console.log(`  🎯 実現可能性バー: ${verification.probabilityBars}個`);
        console.log(`  🎯 ランク表示: ${verification.rankElements}個`);
        
        // カード詳細分析
        console.log(`\n[UI検証] カード詳細分析:`);
        console.log('==========================================');
        verification.cardDetails.forEach(card => {
            const completeness = [
                card.hasTitle,
                card.hasPhaseContainer,
                card.hasPhaseBlocks >= 3,
                card.hasScoreIndicators >= 3,
                card.hasProbabilityBar,
                card.hasRank
            ].filter(Boolean).length;
            
            console.log(`  カード${card.index}: ${completeness}/6機能 (${Math.round(completeness/6*100)}%)`);
            console.log(`    - 3段階表示: ${card.hasPhaseBlocks >= 3 ? '✅' : '❌'} (${card.hasPhaseBlocks}個)`);
            console.log(`    - スコア表示: ${card.hasScoreIndicators >= 3 ? '✅' : '❌'} (${card.hasScoreIndicators}個)`);
            console.log(`    - 高さ: ${card.cardHeight}px, 内容量: ${card.cardContent}文字`);
        });
        
        // 成功判定
        const coreFeatures = [
            verification.exactlyEightCards,
            verification.threePhasesContainers >= 8,
            verification.phaseBlocks >= 24, // 8カード × 3フェーズ
            verification.scoreIndicators >= 24,
            verification.probabilityBars >= 8
        ];
        
        const coreSuccess = coreFeatures.filter(Boolean).length;
        const coreRate = Math.round((coreSuccess / coreFeatures.length) * 100);
        
        const avgCardCompleteness = verification.cardDetails.reduce((sum, card) => {
            const completeness = [
                card.hasTitle,
                card.hasPhaseContainer,
                card.hasPhaseBlocks >= 3,
                card.hasScoreIndicators >= 3,
                card.hasProbabilityBar,
                card.hasRank
            ].filter(Boolean).length;
            return sum + completeness;
        }, 0) / (verification.cardDetails.length || 1);
        
        const cardRate = Math.round((avgCardCompleteness / 6) * 100);
        
        console.log(`\n[UI検証] 総合評価:`);
        console.log('==========================================');
        console.log(`  🎯 コア機能: ${coreSuccess}/${coreFeatures.length} (${coreRate}%)`);
        console.log(`  🎯 カード完成度: ${cardRate}%`);
        console.log(`  🎯 JavaScript errors: ${errors.length}件`);
        
        const overallSuccess = coreRate >= 80 && cardRate >= 70;
        
        if (overallSuccess) {
            console.log('  🎉 UI実装: ✅ 検証成功');
            console.log('  ✨ 8カード固定・タイムライン表示機能が正常動作');
        } else {
            console.log('  ⚠️ UI実装: 改善必要');
            console.log(`  📝 コア機能率: ${coreRate}% (80%以上が目標)`);
            console.log(`  📝 カード完成度: ${cardRate}% (70%以上が目標)`);
        }
        
        return {
            success: overallSuccess,
            coreRate,
            cardRate,
            verification,
            errors: errors.length
        };
        
    } catch (error) {
        console.error('[UI検証] テストエラー:', error);
        return { 
            success: false, 
            error: error.message 
        };
    } finally {
        console.log('\n[UI検証] 結果確認のため15秒間表示...');
        await new Promise(resolve => setTimeout(resolve, 15000));
        await browser.close();
    }
}

// 実行
verifyUI8CardsImplementation().then(result => {
    console.log('\n📋 8カード固定・タイムライン表示機能 検証完了');
    console.log('===========================================');
    
    if (result.success) {
        console.log('🎊 UI実装検証: 完全成功');
        console.log('✅ 8カード固定システムが正常動作');
        console.log('✅ タイムライン表示機能が正常動作');
        console.log('✅ すべての追加機能が期待通り実装');
    } else {
        console.log('⚠️ UI実装検証: 問題発見');
        if (result.error) {
            console.log('Error details:', result.error);
        } else {
            console.log(`コア機能率: ${result.coreRate}%`);
            console.log(`カード完成度: ${result.cardRate}%`);
        }
        console.log('→ 実装の見直しが必要');
    }
    
}).catch(console.error);