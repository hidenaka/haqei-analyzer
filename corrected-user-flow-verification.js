import { chromium } from 'playwright';

async function correctedUserFlowVerification() {
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 500
    });
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });
    const page = await context.newPage();

    const report = {
        step1_mainPage: { status: 'pending', details: '', screenshot: '' },
        step2_osAnalyzer: { status: 'pending', details: '', screenshot: '' },
        step3_startQuiz: { status: 'pending', details: '', screenshot: '' },
        step4_questionFlow: { status: 'pending', details: '', screenshot: '' },
        step5_resultsPage: { status: 'pending', details: '', screenshot: '' },
        errors: [],
        usabilityIssues: [],
        performanceIssues: [],
        systemAssessment: ''
    };

    try {
        // Step 1: メインページアクセス
        console.log('🔍 Step 1: メインページ(index.html)アクセステスト');
        await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
        
        report.step1_mainPage.screenshot = 'step1-mainpage-access.png';
        await page.screenshot({ 
            path: report.step1_mainPage.screenshot,
            fullPage: false 
        });
        
        const title = await page.title();
        const hasHAQEI = await page.textContent('body').then(text => text.includes('HAQEI'));
        
        if (hasHAQEI || title.includes('HAQEI')) {
            report.step1_mainPage.status = 'success';
            report.step1_mainPage.details = `タイトル: ${title}`;
        } else {
            report.step1_mainPage.status = 'failed';
            report.step1_mainPage.details = 'HAQEIコンテンツが見つからない';
        }

        // Step 2: OS Analyzerアクセス
        console.log('🔍 Step 2: OS Analyzer(public/os_analyzer.html)アクセステスト');
        await page.goto('http://localhost:8080/public/os_analyzer.html', { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);
        
        report.step2_osAnalyzer.screenshot = 'step2-os-analyzer-access.png';
        await page.screenshot({ 
            path: report.step2_osAnalyzer.screenshot,
            fullPage: false 
        });
        
        const osAnalyzerTitle = await page.title();
        const hasStartButton = await page.locator('#start-btn').count() > 0;
        
        if (osAnalyzerTitle.includes('OS') && hasStartButton) {
            report.step2_osAnalyzer.status = 'success';
            report.step2_osAnalyzer.details = `OS Analyzerページ正常アクセス - スタートボタンあり`;
        } else {
            report.step2_osAnalyzer.status = 'failed';
            report.step2_osAnalyzer.details = `スタートボタン: ${hasStartButton ? '有' : '無'}`;
        }

        // Step 3: クイズ開始テスト
        console.log('🔍 Step 3: Triple OS 分析開始テスト');
        
        const startButton = page.locator('#start-btn');
        if (await startButton.count() > 0) {
            await startButton.click();
            await page.waitForTimeout(2000);
            
            // 質問画面が表示されているかチェック
            const questionScreenVisible = await page.locator('#question-screen').isVisible();
            const questionTitle = await page.locator('#question-title').textContent().catch(() => '');
            
            report.step3_startQuiz.screenshot = 'step3-quiz-start.png';
            await page.screenshot({ 
                path: report.step3_startQuiz.screenshot,
                fullPage: false 
            });
            
            if (questionScreenVisible && questionTitle) {
                report.step3_startQuiz.status = 'success';
                report.step3_startQuiz.details = `質問画面表示成功 - 質問: ${questionTitle}`;
            } else {
                report.step3_startQuiz.status = 'failed';
                report.step3_startQuiz.details = '質問画面の表示に失敗';
            }
        } else {
            report.step3_startQuiz.status = 'failed';
            report.step3_startQuiz.details = 'スタートボタンが見つからない';
        }

        // Step 4: 質問フローテスト（最初の3問に答える）
        console.log('🔍 Step 4: 質問フローテスト（3問サンプル）');
        
        let questionsAnswered = 0;
        for (let i = 0; i < 3; i++) {
            try {
                // 質問オプションが表示されるまで待機
                await page.waitForSelector('.option-btn', { timeout: 5000 });
                
                // 最初のオプションを選択
                const optionButtons = await page.locator('.option-btn').all();
                if (optionButtons.length > 0) {
                    await optionButtons[0].click();
                    await page.waitForTimeout(1000);
                    questionsAnswered++;
                } else {
                    break;
                }
            } catch (error) {
                console.log(`質問 ${i + 1} で停止:`, error.message);
                break;
            }
        }
        
        report.step4_questionFlow.screenshot = 'step4-question-flow.png';
        await page.screenshot({ 
            path: report.step4_questionFlow.screenshot,
            fullPage: false 
        });
        
        if (questionsAnswered >= 3) {
            report.step4_questionFlow.status = 'success';
            report.step4_questionFlow.details = `${questionsAnswered}問の回答に成功`;
        } else if (questionsAnswered > 0) {
            report.step4_questionFlow.status = 'partial';
            report.step4_questionFlow.details = `${questionsAnswered}問のみ回答可能`;
        } else {
            report.step4_questionFlow.status = 'failed';
            report.step4_questionFlow.details = '質問に回答できない';
        }

        // Step 5: 全30問を自動回答して結果画面をテスト
        console.log('🔍 Step 5: 全質問回答→結果画面テスト');
        
        // 残りの質問を自動回答
        let totalQuestionsAnswered = questionsAnswered;
        while (totalQuestionsAnswered < 30) {
            try {
                await page.waitForSelector('.option-btn', { timeout: 3000 });
                const optionButtons = await page.locator('.option-btn').all();
                if (optionButtons.length > 0) {
                    // ランダムにオプションを選択
                    const randomIndex = Math.floor(Math.random() * optionButtons.length);
                    await optionButtons[randomIndex].click();
                    await page.waitForTimeout(500);
                    totalQuestionsAnswered++;
                } else {
                    break;
                }
            } catch (error) {
                console.log(`質問 ${totalQuestionsAnswered + 1} で停止:`, error.message);
                break;
            }
        }
        
        // 結果画面を待機
        await page.waitForTimeout(5000);
        
        // 結果画面の確認
        const resultsScreenVisible = await page.locator('#results-screen, #analysis-screen').first().isVisible();
        const hasTripleOSResults = await page.textContent('body').then(text => 
            text.includes('Engine OS') || text.includes('Interface OS') || text.includes('Safe Mode OS')
        );
        
        report.step5_resultsPage.screenshot = 'step5-results.png';
        await page.screenshot({ 
            path: report.step5_resultsPage.screenshot,
            fullPage: false 
        });
        
        if (resultsScreenVisible && hasTripleOSResults) {
            report.step5_resultsPage.status = 'success';
            report.step5_resultsPage.details = `結果画面表示成功 - Triple OS分析結果を表示`;
        } else {
            report.step5_resultsPage.status = 'failed';
            report.step5_resultsPage.details = `結果画面: ${resultsScreenVisible ? '表示' : '非表示'}, Triple OS結果: ${hasTripleOSResults ? '有' : '無'}`;
        }

        // システム全体の評価
        const finalContent = await page.textContent('body');
        const hasCharts = await page.locator('canvas').count() > 0;
        const hasDetailedAnalysis = finalContent.includes('卦') || finalContent.includes('分析');
        const hasActionableInsights = finalContent.includes('アドバイス') || finalContent.includes('推奨') || finalContent.includes('指針');
        
        report.systemAssessment = `
システム機能評価:
- 質問システム: ${totalQuestionsAnswered}/30問 (${Math.round(totalQuestionsAnswered/30*100)}%)
- 視覚化: ${hasCharts ? 'チャート表示有' : 'チャート表示無'}
- 詳細分析: ${hasDetailedAnalysis ? '易経ベース分析有' : '分析内容不十分'}
- 実用性: ${hasActionableInsights ? '実用的指針有' : '指針不足'}

本来目的適合性:
- 自己理解ツールとして: ${hasDetailedAnalysis ? '適合' : '不適合'}
- 戦略的人生ナビとして: ${hasActionableInsights ? '適合' : '不適合'}
- Triple OS理論実装: ${hasTripleOSResults ? '実装済' : '未実装'}
        `.trim();

        // コンソールエラーをチェック
        page.on('console', msg => {
            if (msg.type() === 'error') {
                report.errors.push(`Console Error: ${msg.text()}`);
            }
        });

    } catch (error) {
        console.error('テスト実行エラー:', error);
        report.errors.push(`テスト実行エラー: ${error.message}`);
    }

    await browser.close();
    
    // レポート生成
    console.log('\n📊 === 修正版検証結果レポート ===');
    console.log('1. メインページアクセス:', report.step1_mainPage.status, '-', report.step1_mainPage.details);
    console.log('2. OS Analyzerアクセス:', report.step2_osAnalyzer.status, '-', report.step2_osAnalyzer.details);
    console.log('3. クイズ開始:', report.step3_startQuiz.status, '-', report.step3_startQuiz.details);
    console.log('4. 質問フロー:', report.step4_questionFlow.status, '-', report.step4_questionFlow.details);
    console.log('5. 結果表示:', report.step5_resultsPage.status, '-', report.step5_resultsPage.details);
    
    console.log('\n🎯 システム全体評価:');
    console.log(report.systemAssessment);
    
    if (report.errors.length > 0) {
        console.log('\n❌ 発見されたエラー:');
        report.errors.forEach(error => console.log('  -', error));
    }
    
    // 実用性の最終判定
    const successCount = [
        report.step1_mainPage.status,
        report.step2_osAnalyzer.status,
        report.step3_startQuiz.status,
        report.step4_questionFlow.status,
        report.step5_resultsPage.status
    ].filter(status => status === 'success').length;
    
    console.log('\n🏆 総合判定:');
    console.log(`成功率: ${successCount}/5 ステップ (${Math.round(successCount/5*100)}%)`);
    
    if (successCount >= 4) {
        console.log('✅ システムは実用可能レベル');
    } else if (successCount >= 3) {
        console.log('⚠️ システムは部分的に実用可能');
    } else {
        console.log('❌ システムは実用困難');
    }
    
    return report;
}

correctedUserFlowVerification().catch(console.error);