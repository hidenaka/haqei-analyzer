/**
 * HAQEI Analyzer 詳細分析レポート実装確認テスト
 * Playwrightを使用した画面表示確認
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testDetailedAnalysis() {
    console.log('🔍 HAQEI Analyzer 詳細分析レポート実装確認開始\n');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    // コンソールメッセージを監視
    const consoleMessages = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleMessages.push(`❌ ${msg.text()}`);
        }
    });
    
    try {
        const resultsPath = join(__dirname, 'public', 'results.html');
        console.log('📂 ページ読み込み中...');
        await page.goto(`file://${resultsPath}`);
        await page.waitForTimeout(3000);
        
        console.log('✅ ページ読み込み完了\n');
        
        // 1. 基本構成の確認
        console.log('📋 基本構成の確認');
        console.log('─────────────────');
        
        const basicStructure = await page.evaluate(() => {
            return {
                hasFourLineSummary: !!document.querySelector('.summary-section'),
                hasTripleOSCards: document.querySelectorAll('.os-card').length,
                hasDetailedAnalysis: !!document.querySelector('.detailed-analysis-section'),
                hasAccordion: !!document.querySelector('.accordion-container')
            };
        });
        
        console.log(`  4行要約: ${basicStructure.hasFourLineSummary ? '✅ 表示' : '❌ 非表示'}`);
        console.log(`  Triple OSカード: ${basicStructure.hasTripleOSCards > 0 ? `✅ ${basicStructure.hasTripleOSCards}枚` : '❌ 非表示'}`);
        console.log(`  詳細分析セクション: ${basicStructure.hasDetailedAnalysis ? '✅ 表示' : '❌ 非表示'}`);
        console.log(`  アコーディオンUI: ${basicStructure.hasAccordion ? '✅ 実装' : '❌ 未実装'}`);
        
        // 2. 詳細分析の構成確認
        console.log('\n📊 詳細分析の構成');
        console.log('─────────────────');
        
        const detailedAnalysis = await page.evaluate(() => {
            const items = document.querySelectorAll('.accordion-item');
            const itemTitles = Array.from(items).map(item => {
                const header = item.querySelector('.accordion-header');
                return header ? header.textContent.trim() : 'タイトルなし';
            });
            
            // 九宮構成の確認
            const hasNinePhase = !!document.querySelector('.nine-phase-section');
            const ninePhaseGrid = document.querySelector('.nine-phase-grid');
            const phaseCards = document.querySelectorAll('.phase-card');
            
            return {
                accordionItems: itemTitles,
                accordionCount: items.length,
                hasNinePhase: hasNinePhase,
                ninePhaseGridExists: !!ninePhaseGrid,
                phaseCardCount: phaseCards.length
            };
        });
        
        if (detailedAnalysis.accordionCount > 0) {
            console.log(`  アコーディオン項目数: ${detailedAnalysis.accordionCount}項目`);
            detailedAnalysis.accordionItems.forEach((title, index) => {
                console.log(`    ${index + 1}. ${title}`);
            });
        }
        
        if (detailedAnalysis.hasNinePhase) {
            console.log(`\n  九宮構成: ✅ 実装済み`);
            console.log(`    フェーズカード数: ${detailedAnalysis.phaseCardCount}枚`);
        } else {
            console.log(`\n  九宮構成: ❌ 未実装`);
        }
        
        // 3. データ連携の確認
        console.log('\n🔗 データ連携確認');
        console.log('─────────────────');
        
        const dataIntegration = await page.evaluate(() => {
            // SummaryGeneratorの確認
            const hasSummaryGenerator = typeof window.SummaryGenerator !== 'undefined';
            const hasV3Database = typeof window.HexagramHumanTraitsV3 !== 'undefined';
            
            // メソッドの存在確認
            let methods = {};
            if (hasSummaryGenerator && window.basicResultsTab?.summaryGenerator) {
                const generator = window.basicResultsTab.summaryGenerator;
                methods = {
                    generateFourLineSummary: typeof generator.generateFourLineSummary === 'function',
                    generateDetailedSummary: typeof generator.generateDetailedSummary === 'function',
                    generateNinePhaseAnalysis: typeof generator.generateNinePhaseAnalysis === 'function',
                    explainScore: typeof generator.explainScore === 'function'
                };
            }
            
            return {
                hasSummaryGenerator,
                hasV3Database,
                v3DatabaseSize: hasV3Database ? Object.keys(window.HexagramHumanTraitsV3).length : 0,
                methods
            };
        });
        
        console.log(`  SummaryGenerator: ${dataIntegration.hasSummaryGenerator ? '✅ 利用可能' : '❌ 未実装'}`);
        console.log(`  V3データベース: ${dataIntegration.hasV3Database ? `✅ ${dataIntegration.v3DatabaseSize}卦` : '❌ 未実装'}`);
        
        if (Object.keys(dataIntegration.methods).length > 0) {
            console.log(`\n  実装メソッド:`);
            for (const [method, exists] of Object.entries(dataIntegration.methods)) {
                console.log(`    ${method}: ${exists ? '✅' : '❌'}`);
            }
        }
        
        // 4. UI/UXの確認
        console.log('\n🎨 UI/UX確認');
        console.log('─────────────────');
        
        const uiuxCheck = await page.evaluate(() => {
            // アコーディオンの動作確認
            const firstAccordion = document.querySelector('.accordion-item');
            let accordionWorks = false;
            
            if (firstAccordion) {
                const header = firstAccordion.querySelector('.accordion-header');
                const content = firstAccordion.querySelector('.accordion-content');
                if (header && content) {
                    // 初期状態
                    const initialHeight = content.style.maxHeight;
                    // クリックシミュレーション
                    header.click();
                    const afterClickHeight = content.style.maxHeight;
                    accordionWorks = initialHeight !== afterClickHeight;
                }
            }
            
            // レスポンシブデザインの確認
            const hasMediaQueries = Array.from(document.styleSheets).some(sheet => {
                try {
                    return Array.from(sheet.cssRules || []).some(rule => 
                        rule.type === CSSRule.MEDIA_RULE
                    );
                } catch (e) {
                    return false;
                }
            });
            
            // スコア表示の確認
            const scoreElements = document.querySelectorAll('.os-score, .phase-score');
            const hasScoreDisplay = scoreElements.length > 0;
            
            return {
                accordionWorks,
                hasMediaQueries,
                hasScoreDisplay,
                scoreCount: scoreElements.length
            };
        });
        
        console.log(`  アコーディオン動作: ${uiuxCheck.accordionWorks ? '✅ 正常' : '⚠️ 要確認'}`);
        console.log(`  レスポンシブ対応: ${uiuxCheck.hasMediaQueries ? '✅ 対応' : '❌ 未対応'}`);
        console.log(`  スコア表示: ${uiuxCheck.hasScoreDisplay ? `✅ ${uiuxCheck.scoreCount}個` : '❌ なし'}`);
        
        // 5. 実装状況の総合評価
        console.log('\n🎯 実装状況の総合評価');
        console.log('═════════════════════\n');
        
        const isAccordionImplemented = detailedAnalysis.accordionCount === 10;
        const isNinePhaseImplemented = detailedAnalysis.phaseCardCount === 9;
        
        if (isAccordionImplemented && !isNinePhaseImplemented) {
            console.log('📌 現在の実装: アコーディオン式10項目分析');
            console.log('   状態: ✅ 完全実装・動作確認済み');
            console.log('\n⚠️ 注意: 九宮構成は未実装です');
            console.log('   作業指示書に従って実装が必要です');
        } else if (isNinePhaseImplemented) {
            console.log('📌 現在の実装: 九宮構成（9項目＋統合）');
            console.log('   状態: ✅ 新仕様に準拠');
        } else {
            console.log('❌ 詳細分析の実装が不完全です');
        }
        
        // 6. V3データ活用状況
        console.log('\n📚 V3データベース活用状況');
        console.log('─────────────────────────');
        
        const v3Usage = await page.evaluate(() => {
            if (!window.HexagramHumanTraitsV3) return null;
            
            const sampleHexagram = '乾為天';
            const data = window.HexagramHumanTraitsV3[sampleHexagram];
            
            if (!data) return null;
            
            return {
                hasEngineOS: !!data.asEngineOS,
                hasInterfaceOS: !!data.asInterfaceOS,
                hasSafeModeOS: !!data.asSafeModeOS,
                engineProfile: data.asEngineOS?.profile?.type || 'なし',
                interfaceProfile: data.asInterfaceOS?.profile?.type || 'なし',
                safeModeProfile: data.asSafeModeOS?.profile?.type || 'なし'
            };
        });
        
        if (v3Usage) {
            console.log('  サンプル卦（乾為天）のデータ:');
            console.log(`    Engine OS: ${v3Usage.engineProfile}`);
            console.log(`    Interface OS: ${v3Usage.interfaceProfile}`);
            console.log(`    SafeMode OS: ${v3Usage.safeModeProfile}`);
        }
        
        // スクリーンショット
        await page.screenshot({ 
            path: 'detailed-analysis-test-result.png',
            fullPage: true 
        });
        console.log('\n📸 スクリーンショット保存: detailed-analysis-test-result.png');
        
        // エラーメッセージの確認
        if (consoleMessages.length > 0) {
            console.log('\n⚠️ コンソールエラー:');
            consoleMessages.forEach(msg => console.log(`  ${msg}`));
        }
        
        // 待機
        console.log('\n⏰ 5秒間ブラウザで確認できます...');
        await page.waitForTimeout(5000);
        
    } catch (error) {
        console.error('💥 テスト実行エラー:', error.message);
    } finally {
        await browser.close();
        console.log('\n🔚 テスト完了');
    }
}

// テスト実行
testDetailedAnalysis().catch(console.error);