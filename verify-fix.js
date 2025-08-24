import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    console.log('🚀 HAQEI修正確認テスト開始\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        devtools: true
    });
    const page = await browser.newPage();
    
    // エラーを記録
    const errors = [];
    const warnings = [];
    const logs = [];
    
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        
        if (type === 'error') {
            errors.push(text);
            console.error('❌ ERROR:', text.substring(0, 150));
        } else if (type === 'warning') {
            warnings.push(text);
            console.warn('⚠️  WARN:', text.substring(0, 150));
        } else if (text.includes('TripleOSInteractionAnalyzer') || 
                   text.includes('synergy') || 
                   text.includes('DetailedAnalysisTab')) {
            logs.push(text);
            console.log('📝 LOG:', text.substring(0, 150));
        }
    });
    
    page.on('pageerror', error => {
        errors.push(error.message);
        console.error('❌ PAGE ERROR:', error.message);
    });
    
    try {
        // results.htmlを開く
        const resultsPath = `file://${path.join(__dirname, 'public', 'results.html')}`;
        console.log('📄 ページを開いています:', resultsPath);
        await page.goto(resultsPath);
        await page.waitForTimeout(3000);
        
        // 初期状態の確認
        console.log('\n========== 初期状態確認 ==========');
        const initialState = await page.evaluate(() => {
            return {
                errorContainerVisible: window.getComputedStyle(document.getElementById('error-container')).display !== 'none',
                tabButtonCount: document.querySelectorAll('.haqei-tab-button').length,
                activeTab: document.querySelector('.haqei-tab-button.active')?.dataset.tab,
                backgroundColor: window.getComputedStyle(document.body).backgroundColor
            };
        });
        
        console.log('エラー表示:', initialState.errorContainerVisible ? '❌ あり' : '✅ なし');
        console.log('タブボタン数:', initialState.tabButtonCount);
        console.log('アクティブタブ:', initialState.activeTab || 'なし');
        console.log('背景色:', initialState.backgroundColor);
        
        // 基本結果タブの確認
        console.log('\n========== 基本結果タブ ==========');
        const basicState = await page.evaluate(() => {
            const panel = document.querySelector('[data-tab="basic"].haqei-tab-panel');
            if (!panel) return null;
            
            const osCards = panel.querySelectorAll('.os-card');
            return {
                isActive: panel.classList.contains('active'),
                osCardCount: osCards.length,
                osCards: Array.from(osCards).map(card => ({
                    name: card.querySelector('.os-name')?.textContent,
                    score: card.querySelector('.score-value')?.textContent
                }))
            };
        });
        
        if (basicState) {
            console.log('アクティブ:', basicState.isActive ? '✅' : '❌');
            console.log('OSカード数:', basicState.osCardCount);
            basicState.osCards.forEach(card => {
                console.log(`  • ${card.name}: ${card.score}点`);
            });
        }
        
        // 詳細分析タブをクリック
        console.log('\n========== 詳細分析タブテスト ==========');
        const detailedButton = await page.$('[data-tab="detailed"]');
        if (detailedButton) {
            console.log('詳細分析タブをクリック...');
            await detailedButton.click();
            await page.waitForTimeout(2000);
            
            // エラーチェック
            const recentErrors = errors.filter(e => 
                e.includes('engine_interface') || 
                e.includes('DetailedAnalysisTab') ||
                e.includes('renderInteractionDetails')
            );
            
            if (recentErrors.length > 0) {
                console.log('\n❌ 詳細分析タブでエラー発生:');
                recentErrors.forEach(err => console.log('  •', err));
            } else {
                console.log('✅ エラーなし');
            }
            
            // 詳細分析タブの内容確認
            const detailedContent = await page.evaluate(() => {
                const panel = document.querySelector('[data-tab="detailed"].haqei-tab-panel');
                if (!panel) return null;
                
                // 各セクションの存在確認
                const sections = {
                    balance: panel.querySelector('.balance-analysis-section'),
                    synergy: panel.querySelector('.synergy-analysis-section'),
                    interaction: panel.querySelector('.interaction-details-section'),
                    integrated: panel.querySelector('.integrated-summary-section'),
                    action: panel.querySelector('.action-plan-section')
                };
                
                // シナジーカードの詳細
                const synergyCards = Array.from(panel.querySelectorAll('.synergy-card')).map(card => {
                    const title = card.querySelector('.synergy-title')?.textContent;
                    const score = card.querySelector('.synergy-score')?.textContent;
                    return { title, score };
                });
                
                // 相互作用の詳細
                let interactionData = null;
                if (sections.interaction) {
                    const items = sections.interaction.querySelectorAll('.synergy-item');
                    interactionData = Array.from(items).map(item => {
                        const label = item.querySelector('span')?.textContent;
                        const value = item.querySelector('span:last-child')?.textContent;
                        return { label, value };
                    });
                }
                
                return {
                    isActive: panel.classList.contains('active'),
                    hasContent: panel.textContent.trim().length > 100,
                    sections: {
                        balance: !!sections.balance,
                        synergy: !!sections.synergy,
                        interaction: !!sections.interaction,
                        integrated: !!sections.integrated,
                        action: !!sections.action
                    },
                    synergyCards,
                    interactionData
                };
            });
            
            if (detailedContent) {
                console.log('\n詳細分析タブの状態:');
                console.log('アクティブ:', detailedContent.isActive ? '✅' : '❌');
                console.log('コンテンツ:', detailedContent.hasContent ? '✅ あり' : '❌ なし');
                
                console.log('\nセクション存在確認:');
                console.log('  • バランス分析:', detailedContent.sections.balance ? '✅' : '❌');
                console.log('  • シナジー分析:', detailedContent.sections.synergy ? '✅' : '❌');
                console.log('  • 相互作用詳細:', detailedContent.sections.interaction ? '✅' : '❌');
                console.log('  • 統合サマリー:', detailedContent.sections.integrated ? '✅' : '❌');
                console.log('  • アクションプラン:', detailedContent.sections.action ? '✅' : '❌');
                
                if (detailedContent.synergyCards.length > 0) {
                    console.log('\nシナジーカード:');
                    detailedContent.synergyCards.forEach(card => {
                        console.log(`  • ${card.title}: ${card.score}`);
                    });
                }
                
                if (detailedContent.interactionData) {
                    console.log('\n相互作用データ:');
                    detailedContent.interactionData.forEach(item => {
                        console.log(`  • ${item.label}: ${item.value}`);
                    });
                }
            }
        }
        
        // スクリーンショット撮影
        await page.screenshot({ 
            path: path.join(__dirname, 'verification-detailed.png'),
            fullPage: true 
        });
        
        // 基本結果タブに戻る
        const basicButton = await page.$('[data-tab="basic"]');
        if (basicButton) {
            await basicButton.click();
            await page.waitForTimeout(1000);
            await page.screenshot({ 
                path: path.join(__dirname, 'verification-basic.png')
            });
        }
        
        // 最終サマリー
        console.log('\n========== 最終サマリー ==========');
        console.log(`エラー総数: ${errors.length}`);
        console.log(`警告総数: ${warnings.length}`);
        
        if (errors.length === 0) {
            console.log('\n✅ すべてのテストが成功しました！');
        } else {
            console.log('\n❌ エラーが発生しています:');
            errors.slice(0, 5).forEach((err, i) => {
                console.log(`${i + 1}. ${err.substring(0, 200)}`);
            });
        }
        
        console.log('\n📸 スクリーンショット保存:');
        console.log('  • verification-detailed.png (詳細分析タブ)');
        console.log('  • verification-basic.png (基本結果タブ)');
        
    } catch (error) {
        console.error('\n❌ テスト実行エラー:', error.message);
    }
    
    console.log('\n🔍 ブラウザのDevToolsコンソールを確認してください');
    console.log('終了するにはCtrl+Cを押してください\n');
    
    // ブラウザを開いたままにする
    await new Promise(() => {});
})();