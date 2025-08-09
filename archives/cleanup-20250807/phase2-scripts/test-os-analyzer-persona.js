/**
 * OS Analyzer統合ペルソナテスト - 実際のページでの動作確認
 */

import { chromium } from 'playwright';
import fs from 'fs/promises';

async function testOSAnalyzerPersona() {
    console.log('🎯 OS Analyzer Persona Integration Test Starting...');
    
    let browser = null;
    
    try {
        browser = await chromium.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage({
            viewport: { width: 1280, height: 1024 }
        });
        
        // コンソール監視（ペルソナ関連のみ）
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('VirtualPersonaEnhancer') || text.includes('persona') || text.includes('🎭')) {
                console.log('📝 Persona Console:', text);
            }
        });
        
        page.on('pageerror', error => {
            console.error('❌ Page Error:', error.message);
        });
        
        console.log('🌐 Loading OS Analyzer...');
        await page.goto('http://localhost:8000/os_analyzer.html', {
            waitUntil: 'networkidle'
        });
        
        // VirtualPersonaEnhancer初期化確認
        const personaStatus = await page.evaluate(() => {
            return {
                enhancerClass: typeof VirtualPersonaEnhancer !== 'undefined',
                enhancerInstance: typeof window.virtualPersonaEnhancer !== 'undefined',
                enhancerReady: window.virtualPersonaEnhancer?.isInitialized || false
            };
        });
        
        console.log('🔍 Persona Status:', personaStatus);
        
        // 初期スクリーンショット
        await fs.mkdir('screenshots', { recursive: true });
        await page.screenshot({ 
            path: `screenshots/os_analyzer_initial_${Date.now()}.png`,
            fullPage: true
        });
        
        // スタートボタンをクリック
        console.log('🚀 Starting analysis...');
        await page.click('#start-btn');
        
        // 質問画面の表示確認
        await page.waitForSelector('#questions-container.visible', { timeout: 15000 });
        console.log('✅ Questions screen loaded');
        
        // 30問を高速回答（テスト用）
        console.log('📝 Answering 30 questions...');
        
        for (let i = 1; i <= 30; i++) {
            try {
                // 質問が表示されるまで待機
                await page.waitForSelector('.question-card.active', { timeout: 10000 });
                
                // ランダム選択
                const choiceIndex = Math.floor(Math.random() * 4) + 1;
                await page.click(`.choice-option:nth-child(${choiceIndex})`);
                
                // 次へボタン
                await page.waitForSelector('.next-button:not([disabled])', { timeout: 5000 });
                await page.click('.next-button');
                
                if (i % 10 === 0) {
                    console.log(`📝 Progress: ${i}/30 questions answered`);
                }
                
                // 短時間待機
                await page.waitForTimeout(300);
                
            } catch (error) {
                console.warn(`⚠️ Question ${i} issue:`, error.message);
                // 続行
            }
        }
        
        console.log('⏳ Waiting for results screen...');
        
        // 結果画面の表示を待機
        await page.waitForSelector('#results-container.visible', { timeout: 30000 });
        console.log('✅ Results screen loaded');
        
        // 結果画面のスクリーンショット
        await page.screenshot({ 
            path: `screenshots/os_analyzer_results_${Date.now()}.png`,
            fullPage: true
        });
        
        // ペルソナカードの確認
        const personaCards = await page.$$('.virtual-persona-card');
        console.log(`🎭 Found ${personaCards.length} persona cards in results`);
        
        // OSカードの確認
        const osCards = await page.$$('.os-card');
        console.log(`💻 Found ${osCards.length} OS cards`);
        
        // 各OSカードのペルソナ情報を詳細確認
        const osPersonaData = {};
        
        for (let i = 0; i < Math.min(osCards.length, 3); i++) {
            try {
                const cardSelector = `.os-card:nth-child(${i + 1})`;
                
                const osInfo = await page.evaluate((selector) => {
                    const card = document.querySelector(selector);
                    if (!card) return null;
                    
                    const osName = card.querySelector('.os-name')?.textContent?.trim();
                    const personaCard = card.querySelector('.virtual-persona-card');
                    
                    if (personaCard) {
                        return {
                            osName: osName,
                            hasPersonaCard: true,
                            personaName: personaCard.querySelector('.persona-name')?.textContent?.trim(),
                            personaSymbol: personaCard.querySelector('.persona-symbol')?.textContent?.trim(),
                            personaMetaphor: personaCard.querySelector('.persona-metaphor')?.textContent?.trim(),
                            personaCatchphrase: personaCard.querySelector('.persona-catchphrase')?.textContent?.trim(),
                            personaTraits: Array.from(personaCard.querySelectorAll('.trait-tag')).map(t => t.textContent.trim()),
                            personaDescription: personaCard.querySelector('.persona-description')?.textContent?.trim()
                        };
                    } else {
                        return {
                            osName: osName,
                            hasPersonaCard: false,
                            osDescription: card.querySelector('.os-description')?.textContent?.trim(),
                            osScore: card.querySelector('.os-score')?.textContent?.trim()
                        };
                    }
                }, cardSelector);
                
                if (osInfo) {
                    osPersonaData[`OS_${i + 1}`] = osInfo;
                    console.log(`💻 OS Card ${i + 1} (${osInfo.osName}):`, osInfo.hasPersonaCard ? 'Has Persona' : 'No Persona');
                    
                    if (osInfo.hasPersonaCard) {
                        console.log(`   🎭 Persona: ${osInfo.personaName} ${osInfo.personaSymbol}`);
                        console.log(`   📝 Traits: ${osInfo.personaTraits.join(', ')}`);
                    }
                }
                
                // 個別OSカードのスクリーンショット
                try {
                    const cardElement = await page.$(cardSelector);
                    if (cardElement) {
                        await cardElement.screenshot({ 
                            path: `screenshots/os_card_${i + 1}_${Date.now()}.png` 
                        });
                    }
                } catch (error) {
                    console.warn(`⚠️ Failed to screenshot OS card ${i + 1}:`, error.message);
                }
                
            } catch (error) {
                console.error(`❌ Failed to analyze OS card ${i + 1}:`, error.message);
            }
        }
        
        // 検証結果
        const validations = [];
        
        // 検証1: OSカード表示
        const osCardCount = osCards.length;
        validations.push({
            test: 'OS Cards Display',
            expected: 3,
            actual: osCardCount,
            passed: osCardCount >= 3
        });
        
        // 検証2: ペルソナカード統合
        const cardsWithPersona = Object.values(osPersonaData).filter(data => data.hasPersonaCard).length;
        validations.push({
            test: 'Persona Integration',
            expected: '≥1',
            actual: cardsWithPersona,
            passed: cardsWithPersona >= 1
        });
        
        // 検証3: ペルソナ完整性
        const completePersonas = Object.values(osPersonaData).filter(data => 
            data.hasPersonaCard && data.personaName && data.personaSymbol && data.personaTraits?.length > 0
        ).length;
        validations.push({
            test: 'Persona Completeness',
            expected: '≥1',
            actual: completePersonas,
            passed: completePersonas >= 1
        });
        
        // 検証4: 特徴タグ
        const totalTraits = Object.values(osPersonaData).reduce((sum, data) => 
            sum + (data.personaTraits?.length || 0), 0
        );
        validations.push({
            test: 'Trait Tags',
            expected: '>0',
            actual: totalTraits,
            passed: totalTraits > 0
        });
        
        // 結果レポート
        const passedCount = validations.filter(v => v.passed).length;
        const overallSuccess = passedCount >= 3;
        
        console.log('\n=== OS ANALYZER PERSONA TEST SUMMARY ===');
        console.log(`Overall Status: ${overallSuccess ? 'SUCCESS' : 'NEEDS_ATTENTION'}`);
        console.log(`Validations Passed: ${passedCount}/${validations.length}`);
        console.log(`OS Cards: ${osCardCount}`);
        console.log(`Persona Cards: ${cardsWithPersona}`);
        console.log(`Complete Personas: ${completePersonas}`);
        console.log(`Total Trait Tags: ${totalTraits}`);
        
        console.log('\n📊 Validation Details:');
        validations.forEach(v => {
            const status = v.passed ? '✅' : '❌';
            console.log(`${status} ${v.test}: ${v.actual} (expected: ${v.expected})`);
        });
        
        // JSON レポート保存
        const report = {
            timestamp: new Date().toISOString(),
            overallSuccess: overallSuccess,
            validations: validations,
            osPersonaData: osPersonaData,
            personaStatus: personaStatus,
            summary: {
                osCards: osCardCount,
                personaCards: cardsWithPersona,
                completePersonas: completePersonas,
                totalTraits: totalTraits
            }
        };
        
        await fs.mkdir('test-reports', { recursive: true });
        const reportPath = `test-reports/os-analyzer-persona-test-${Date.now()}.json`;
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
        console.log(`📄 Report saved: ${reportPath}`);
        
        console.log('==========================================\n');
        
        return overallSuccess;
        
    } catch (error) {
        console.error('❌ OS Analyzer test failed:', error);
        return false;
    } finally {
        if (browser) {
            console.log('⏱️ Keeping browser open for 10 seconds for inspection...');
            await new Promise(resolve => setTimeout(resolve, 10000));
            await browser.close();
            console.log('🧹 Browser closed');
        }
    }
}

testOSAnalyzerPersona();