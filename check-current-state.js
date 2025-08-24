import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    console.log('🔍 BasicResultsTab 現状分析\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        devtools: true
    });
    const page = await browser.newPage();
    
    // コンソールログを詳細に記録
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('generatePersonalityProfile') || 
            text.includes('renderPersonalityProfile') ||
            text.includes('BasicResultsTab')) {
            console.log(`[${msg.type()}] ${text}`);
        }
    });
    
    // results.htmlを開く
    const resultsPath = `file://${path.join(__dirname, 'public', 'results.html')}`;
    await page.goto(resultsPath);
    await page.waitForTimeout(3000);
    
    // 基本結果タブの詳細な構成を分析
    const tabStructure = await page.evaluate(() => {
        const panel = document.querySelector('[data-tab="basic"].haqei-tab-panel');
        if (!panel) return { error: 'Panel not found' };
        
        const sections = [];
        
        // 1. ヘッダーセクション
        const header = panel.querySelector('.results-header');
        if (header) {
            sections.push({
                name: 'ヘッダー',
                exists: true,
                title: header.querySelector('.results-title')?.textContent?.trim(),
                subtitle: header.querySelector('.results-subtitle')?.textContent?.trim()
            });
        }
        
        // 2. OSカードセクション
        const osCardsSection = panel.querySelector('.os-cards-section');
        const osCards = panel.querySelectorAll('.os-card');
        sections.push({
            name: 'OSカード',
            exists: !!osCardsSection,
            count: osCards.length,
            cards: Array.from(osCards).map(card => ({
                name: card.querySelector('.os-name')?.textContent?.trim(),
                score: card.querySelector('.score-value')?.textContent?.trim(),
                hexagram: card.querySelector('.hexagram-name')?.textContent?.trim(),
                hasHumanTraits: !!card.querySelector('.human-traits')
            }))
        });
        
        // 3. 人物像セクション
        const personalitySection = panel.querySelector('.personality-section');
        const personalityContainer = panel.querySelector('#personality-profile-container');
        sections.push({
            name: '人物像',
            exists: !!personalitySection,
            hasContainer: !!personalityContainer,
            content: personalityContainer?.innerHTML?.substring(0, 100),
            hasContent: personalityContainer?.innerHTML?.length > 50
        });
        
        // 4. 履歴比較セクション
        const historicalSection = panel.querySelector('.historical-comparison-section');
        sections.push({
            name: '履歴比較',
            exists: !!historicalSection,
            hasCharts: !!panel.querySelector('.comparison-chart')
        });
        
        // 5. サマリーセクション
        const summarySection = panel.querySelector('.summary-section');
        const summaryContainer = panel.querySelector('#summary-container');
        sections.push({
            name: 'サマリー',
            exists: !!summarySection,
            hasContainer: !!summaryContainer,
            totalScore: summaryContainer?.querySelector('.total-score-value')?.textContent?.trim()
        });
        
        // 6. アクションセクション
        const actionSection = panel.querySelector('.action-section');
        sections.push({
            name: 'アクション',
            exists: !!actionSection,
            cardCount: panel.querySelectorAll('.action-card').length
        });
        
        // 関数の存在確認
        const functions = {
            generatePersonalityProfile: typeof window.generatePersonalityProfile === 'function',
            getHumanTraitsByName: typeof window.getHumanTraitsByName === 'function',
            HexagramHumanTraits: !!window.HexagramHumanTraits
        };
        
        return {
            sections,
            functions,
            totalHeight: panel.scrollHeight,
            hasContent: panel.innerHTML.length > 1000
        };
    });
    
    console.log('\n========== BasicResultsTab 構成分析 ==========\n');
    
    if (tabStructure.sections) {
        console.log('📋 セクション構成:');
        tabStructure.sections.forEach(section => {
            const status = section.exists ? '✅' : '❌';
            console.log(`\n${status} ${section.name}セクション`);
            Object.entries(section).forEach(([key, value]) => {
                if (key !== 'name' && key !== 'exists') {
                    console.log(`   - ${key}: ${value}`);
                }
            });
        });
    }
    
    console.log('\n📚 関数の存在:');
    Object.entries(tabStructure.functions).forEach(([name, exists]) => {
        console.log(`   ${exists ? '✅' : '❌'} ${name}`);
    });
    
    // スクリーンショット
    await page.screenshot({ 
        path: path.join(__dirname, 'current-basic-tab.png'),
        fullPage: true 
    });
    
    console.log('\n📸 スクリーンショット: current-basic-tab.png');
    console.log('\n分析完了。ブラウザを確認してください。');
    
    // ブラウザを開いたままにする
    await new Promise(() => {});
})();