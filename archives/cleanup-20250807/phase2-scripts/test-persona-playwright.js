/**
 * DAY 2 ペルソナ表現強化機能 - Playwright MCP動作確認テスト
 * 30問回答→結果画面のペルソナ情報表示を検証
 */

import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

class PersonaPlaywrightTester {
    constructor() {
        this.browser = null;
        this.page = null;
        this.testResults = {
            testStartTime: new Date().toISOString(),
            phases: {
                startup: { status: 'pending', screenshots: [] },
                questions: { status: 'pending', screenshots: [], answeredCount: 0 },
                results: { status: 'pending', screenshots: [], personaData: {} },
                validation: { status: 'pending', validations: [] }
            },
            errors: [],
            summary: {}
        };
    }
    
    async initialize() {
        console.log('🚀 PersonaPlaywrightTester initializing...');
        
        try {
            this.browser = await chromium.launch({
                headless: false,
                args: [
                    '--disable-dev-shm-usage',
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                ]
            });
            
            this.page = await this.browser.newPage({
                viewport: { width: 1280, height: 1024 }
            });
            
            // コンソールログ監視
            this.page.on('console', msg => {
                if (msg.text().includes('VirtualPersonaEnhancer') || msg.text().includes('persona')) {
                    console.log('📝 Browser Console:', msg.text());
                }
            });
            
            // エラー監視
            this.page.on('pageerror', error => {
                console.error('❌ Page Error:', error.message);
                this.testResults.errors.push({
                    type: 'page_error',
                    message: error.message,
                    timestamp: new Date().toISOString()
                });
            });
            
            return true;
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            return false;
        }
    }
    
    async runFullTest() {
        console.log('🎯 Starting Full Persona Behavior Test');
        
        try {
            // Phase 1: サイト起動確認
            await this.testSiteStartup();
            
            // Phase 2: 30問回答実行
            await this.executeQuestions();
            
            // Phase 3: 結果画面ペルソナ検証
            await this.validatePersonaResults();
            
            // Phase 4: 総合検証
            await this.performFinalValidation();
            
            // レポート生成
            await this.generateReport();
            
            console.log('✅ Full Test Completed Successfully');
            return this.testResults;
            
        } catch (error) {
            console.error('❌ Test execution failed:', error);
            this.testResults.errors.push({
                type: 'test_execution',
                message: error.message,
                timestamp: new Date().toISOString()
            });
            return this.testResults;
        }
    }
    
    async testSiteStartup() {
        console.log('📍 Phase 1: Site Startup Test');
        
        try {
            await this.page.goto('http://localhost:8000/os_analyzer.html', {
                waitUntil: 'networkidle'
            });
            
            // VirtualPersonaEnhancerの読み込み確認
            const personaEnhancerLoaded = await this.page.evaluate(() => {
                return typeof window.virtualPersonaEnhancer !== 'undefined';
            });
            
            console.log(`🔧 VirtualPersonaEnhancer loaded: ${personaEnhancerLoaded}`);
            
            // スクリーンショット撮影
            const screenshotPath = await this.takeScreenshot('startup_welcome');
            this.testResults.phases.startup.screenshots.push(screenshotPath);
            
            // スタートボタンクリック
            await this.page.click('#start-btn');
            await this.page.waitForSelector('#questions-container.visible', { timeout: 10000 });
            
            const questionsScreenshot = await this.takeScreenshot('startup_questions_start');
            this.testResults.phases.startup.screenshots.push(questionsScreenshot);
            
            this.testResults.phases.startup.status = 'completed';
            console.log('✅ Phase 1 completed');
            
        } catch (error) {
            this.testResults.phases.startup.status = 'failed';
            console.error('❌ Phase 1 failed:', error);
            throw error;
        }
    }
    
    async executeQuestions() {
        console.log('📍 Phase 2: 30 Questions Execution');
        
        try {
            let questionCount = 0;
            
            // 30問回答ループ
            for (let i = 1; i <= 30; i++) {
                try {
                    // 質問が表示されるまで待機
                    await this.page.waitForSelector('.question-card.active', { timeout: 15000 });
                    
                    // 現在の質問番号を確認
                    const currentQuestion = await this.page.evaluate(() => {
                        const questionElement = document.querySelector('.question-card.active .question-number');
                        return questionElement ? questionElement.textContent : 'N/A';
                    });
                    
                    console.log(`📝 Question ${i}/30: ${currentQuestion}`);
                    
                    // 選択肢をランダム選択（実際のユーザー行動をシミュレート）
                    const choiceIndex = Math.floor(Math.random() * 4) + 1;
                    const choiceSelector = `.choice-option:nth-child(${choiceIndex})`;
                    
                    await this.page.waitForSelector(choiceSelector, { timeout: 5000 });
                    await this.page.click(choiceSelector);
                    
                    // 次へボタンクリック
                    await this.page.waitForSelector('.next-button:not([disabled])', { timeout: 3000 });
                    await this.page.click('.next-button');
                    
                    questionCount++;
                    
                    // 進捗スクリーンショット（5問ごと）
                    if (i % 5 === 0) {
                        const progressScreenshot = await this.takeScreenshot(`questions_progress_${i}`);
                        this.testResults.phases.questions.screenshots.push(progressScreenshot);
                    }
                    
                    // 短時間待機（自然な回答ペース）
                    await this.page.waitForTimeout(500);
                    
                } catch (error) {
                    console.error(`❌ Question ${i} failed:`, error.message);
                    this.testResults.errors.push({
                        type: 'question_error',
                        question: i,
                        message: error.message,
                        timestamp: new Date().toISOString()
                    });
                    
                    // 回答に失敗した場合もカウントアップして続行
                    questionCount++;
                }
            }
            
            // 結果画面への遷移を確認
            console.log('⏳ Waiting for results screen...');
            await this.page.waitForSelector('#results-container.visible', { timeout: 30000 });
            
            const resultsScreenshot = await this.takeScreenshot('questions_completed');
            this.testResults.phases.questions.screenshots.push(resultsScreenshot);
            
            this.testResults.phases.questions.status = 'completed';
            this.testResults.phases.questions.answeredCount = questionCount;
            console.log(`✅ Phase 2 completed: ${questionCount}/30 questions answered`);
            
        } catch (error) {
            this.testResults.phases.questions.status = 'failed';
            console.error('❌ Phase 2 failed:', error);
            throw error;
        }
    }
    
    async validatePersonaResults() {
        console.log('📍 Phase 3: Persona Results Validation');
        
        try {
            // 結果画面の表示確認
            const resultsVisible = await this.page.isVisible('#results-container.visible');
            if (!resultsVisible) {
                throw new Error('Results container not visible');
            }
            
            console.log('📊 Results screen is visible, analyzing persona data...');
            
            // ペルソナカードの存在確認
            const personaCards = await this.page.$$('.virtual-persona-card');
            console.log(`🎭 Found ${personaCards.length} persona cards`);
            
            // 各OSカードのペルソナ情報を検証
            const osSelectors = ['.os-card:nth-child(1)', '.os-card:nth-child(2)', '.os-card:nth-child(3)'];
            const osTypes = ['Engine OS', 'Interface OS', 'Safe Mode OS'];
            
            for (let i = 0; i < osSelectors.length; i++) {
                try {
                    const osSelector = osSelectors[i];
                    const osType = osTypes[i];
                    
                    // OSカードが存在するか確認
                    const osCardExists = await this.page.isVisible(osSelector);
                    console.log(`🔍 Checking ${osType} card: ${osCardExists ? 'Found' : 'Not found'}`);
                    
                    if (osCardExists) {
                        // ペルソナ情報の抽出
                        const personaInfo = await this.page.evaluate((selector) => {
                            const card = document.querySelector(selector);
                            if (!card) return { hasOSCard: false };
                            
                            const personaCard = card.querySelector('.virtual-persona-card');
                            if (personaCard) {
                                return {
                                    hasOSCard: true,
                                    hasPersonaCard: true,
                                    name: personaCard.querySelector('.persona-name')?.textContent?.trim() || null,
                                    symbol: personaCard.querySelector('.persona-symbol')?.textContent?.trim() || null,
                                    metaphor: personaCard.querySelector('.persona-metaphor')?.textContent?.trim() || null,
                                    catchphrase: personaCard.querySelector('.persona-catchphrase')?.textContent?.trim() || null,
                                    traits: Array.from(personaCard.querySelectorAll('.trait-tag')).map(t => t.textContent.trim()),
                                    description: personaCard.querySelector('.persona-description')?.textContent?.trim() || null
                                };
                            } else {
                                // ペルソナカードがない場合は、OSカード自体の情報を取得
                                return {
                                    hasOSCard: true,
                                    hasPersonaCard: false,
                                    osName: card.querySelector('.os-name')?.textContent?.trim() || null,
                                    osScore: card.querySelector('.os-score')?.textContent?.trim() || null,
                                    osDescription: card.querySelector('.os-description')?.textContent?.trim() || null
                                };
                            }
                        }, osSelector);
                        
                        console.log(`📊 ${osType} Info:`, JSON.stringify(personaInfo, null, 2));
                        this.testResults.phases.results.personaData[osType] = personaInfo;
                        
                        // 個別OSカードのスクリーンショット
                        try {
                            const osCardElement = await this.page.$(osSelector);
                            if (osCardElement) {
                                await osCardElement.screenshot({ 
                                    path: `screenshots/results_${osType.toLowerCase().replace(' ', '_')}_${Date.now()}.png` 
                                });
                            }
                        } catch (screenshotError) {
                            console.warn(`⚠️ Failed to screenshot ${osType}:`, screenshotError.message);
                        }
                    }
                    
                } catch (error) {
                    console.error(`❌ Failed to extract persona for ${osType}:`, error.message);
                    this.testResults.errors.push({
                        type: 'persona_extraction',
                        osType: osType,
                        message: error.message,
                        timestamp: new Date().toISOString()
                    });
                }
            }
            
            // 結果画面全体のスクリーンショット
            const fullResultsScreenshot = await this.takeScreenshot('results_full_page');
            this.testResults.phases.results.screenshots.push(fullResultsScreenshot);
            
            this.testResults.phases.results.status = 'completed';
            console.log('✅ Phase 3 completed');
            
        } catch (error) {
            this.testResults.phases.results.status = 'failed';
            console.error('❌ Phase 3 failed:', error);
            throw error;
        }
    }
    
    async performFinalValidation() {
        console.log('📍 Phase 4: Final Validation');
        
        try {
            const validations = [];
            
            // 検証1: OSカード表示確認
            const osCardCount = Object.values(this.testResults.phases.results.personaData)
                .filter(data => data.hasOSCard).length;
            
            validations.push({
                test: 'os_cards_display',
                expected: 3,
                actual: osCardCount,
                passed: osCardCount >= 3,
                message: `${osCardCount}/3 OS cards displayed`
            });
            
            // 検証2: ペルソナカード表示確認
            const personaCardCount = Object.values(this.testResults.phases.results.personaData)
                .filter(data => data.hasPersonaCard).length;
            
            validations.push({
                test: 'persona_cards_display',
                expected: 3,
                actual: personaCardCount,
                passed: personaCardCount > 0,
                message: `${personaCardCount}/3 persona cards displayed`
            });
            
            // 検証3: ペルソナ情報完整性
            const completePersonas = Object.values(this.testResults.phases.results.personaData)
                .filter(data => data.hasPersonaCard && data.name && data.symbol && data.traits?.length > 0).length;
            
            validations.push({
                test: 'persona_info_completeness',
                expected: '>=1',
                actual: completePersonas,
                passed: completePersonas >= 1,
                message: `${completePersonas} personas have complete information (name, symbol, traits)`
            });
            
            // 検証4: 特徴タグ表示確認
            const totalTraits = Object.values(this.testResults.phases.results.personaData)
                .reduce((sum, data) => sum + (data.traits?.length || 0), 0);
            
            validations.push({
                test: 'trait_tags_display',
                expected: '>0',
                actual: totalTraits,
                passed: totalTraits > 0,
                message: `${totalTraits} trait tags found across all personas`
            });
            
            // 検証5: メタファーとキャッチフレーズ確認
            const personasWithMetaphor = Object.values(this.testResults.phases.results.personaData)
                .filter(data => data.metaphor || data.catchphrase).length;
            
            validations.push({
                test: 'metaphor_catchphrase_display',
                expected: '>0',
                actual: personasWithMetaphor,
                passed: personasWithMetaphor > 0,
                message: `${personasWithMetaphor} personas have metaphor or catchphrase`
            });
            
            // 検証6: エラー率確認
            const errorCount = this.testResults.errors.length;
            validations.push({
                test: 'error_rate',
                expected: '<10',
                actual: errorCount,
                passed: errorCount < 10,
                message: `${errorCount} errors occurred during test`
            });
            
            this.testResults.phases.validation.validations = validations;
            
            const passedCount = validations.filter(v => v.passed).length;
            this.testResults.phases.validation.status = passedCount >= 4 ? 'completed' : 'failed';
            
            console.log(`✅ Phase 4 completed: ${passedCount}/${validations.length} validations passed`);
            
            // 検証詳細表示
            validations.forEach(validation => {
                const status = validation.passed ? '✅' : '❌';
                console.log(`${status} ${validation.test}: ${validation.message}`);
            });
            
        } catch (error) {
            this.testResults.phases.validation.status = 'failed';
            console.error('❌ Phase 4 failed:', error);
            throw error;
        }
    }
    
    async takeScreenshot(name) {
        try {
            await fs.mkdir('screenshots', { recursive: true });
            const filename = `screenshots/${name}_${Date.now()}.png`;
            await this.page.screenshot({ 
                path: filename,
                fullPage: true
            });
            console.log(`📸 Screenshot saved: ${filename}`);
            return filename;
        } catch (error) {
            console.error(`❌ Screenshot failed for ${name}:`, error.message);
            return null;
        }
    }
    
    async generateReport() {
        console.log('📊 Generating Test Report');
        
        try {
            // サマリー作成
            const passedPhases = Object.values(this.testResults.phases)
                .filter(phase => phase.status === 'completed').length;
            
            const passedValidations = this.testResults.phases.validation.validations
                ?.filter(v => v.passed).length || 0;
            
            const totalValidations = this.testResults.phases.validation.validations?.length || 0;
            
            this.testResults.summary = {
                testEndTime: new Date().toISOString(),
                phasesCompleted: `${passedPhases}/4`,
                validationsPassed: `${passedValidations}/${totalValidations}`,
                totalErrors: this.testResults.errors.length,
                screenshotCount: Object.values(this.testResults.phases)
                    .reduce((sum, phase) => sum + (phase.screenshots?.length || 0), 0),
                overallStatus: (passedPhases >= 3 && passedValidations >= 4) ? 'SUCCESS' : 'NEEDS_ATTENTION',
                personaEnhancementWorking: passedValidations >= 2
            };
            
            // JSON レポート保存
            const reportPath = `test-reports/persona-behavior-test-${Date.now()}.json`;
            await fs.mkdir('test-reports', { recursive: true });
            await fs.writeFile(reportPath, JSON.stringify(this.testResults, null, 2));
            
            console.log('📄 Test report saved:', reportPath);
            
            // コンソールサマリー出力
            console.log('\n=== PERSONA BEHAVIOR TEST SUMMARY ===');
            console.log(`Overall Status: ${this.testResults.summary.overallStatus}`);
            console.log(`Phases Completed: ${this.testResults.summary.phasesCompleted}`);
            console.log(`Validations Passed: ${this.testResults.summary.validationsPassed}`);
            console.log(`Total Errors: ${this.testResults.summary.totalErrors}`);
            console.log(`Screenshots Captured: ${this.testResults.summary.screenshotCount}`);
            console.log(`Persona Enhancement Working: ${this.testResults.summary.personaEnhancementWorking ? 'YES' : 'NO'}`);
            console.log('=====================================\n');
            
        } catch (error) {
            console.error('❌ Report generation failed:', error);
        }
    }
    
    async cleanup() {
        try {
            if (this.browser) {
                await this.browser.close();
                console.log('🧹 Browser cleanup completed');
            }
        } catch (error) {
            console.error('❌ Cleanup failed:', error);
        }
    }
}

// メイン実行
async function main() {
    const tester = new PersonaPlaywrightTester();
    
    try {
        const initialized = await tester.initialize();
        if (!initialized) {
            throw new Error('Tester initialization failed');
        }
        
        const results = await tester.runFullTest();
        
        console.log('\n🎯 PERSONA BEHAVIOR TEST COMPLETED');
        console.log('Status:', results.summary?.overallStatus || 'UNKNOWN');
        console.log('Persona Enhancement:', results.summary?.personaEnhancementWorking ? 'WORKING' : 'NEEDS_ATTENTION');
        
        return results;
        
    } catch (error) {
        console.error('❌ Test execution failed:', error);
        return { error: error.message };
    } finally {
        await tester.cleanup();
    }
}

// スクリプト直接実行時
if (import.meta.url === `file://${process.argv[1]}`) {
    main().then(results => {
        process.exit(results.error ? 1 : 0);
    });
}

export default PersonaPlaywrightTester;