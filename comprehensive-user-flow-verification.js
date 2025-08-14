import { chromium } from 'playwright';

async function comprehensiveUserFlowVerification() {
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000
    });
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });
    const page = await context.newPage();

    const report = {
        step1_mainPage: { status: 'pending', details: '', screenshot: '' },
        step2_osAnalyzer: { status: 'pending', details: '', screenshot: '' },
        step3_worryInput: { status: 'pending', details: '', screenshot: '' },
        step4_scenarioGeneration: { status: 'pending', details: '', screenshot: '' },
        step5_futureSimulator: { status: 'pending', details: '', screenshot: '' },
        errors: [],
        usabilityIssues: [],
        performanceIssues: [],
        futureSimulatorAssessment: ''
    };

    try {
        // Step 1: メインページアクセス
        console.log('🔍 Step 1: メインページ(index.html)アクセステスト');
        await page.goto('http://localhost:8080/');
        await page.waitForTimeout(3000);
        
        // エラーチェック
        const errors = await page.evaluate(() => {
            return window.console.errors || [];
        });
        
        report.step1_mainPage.screenshot = await page.screenshot({ 
            path: 'step1-mainpage-access.png',
            fullPage: true 
        });
        
        const title = await page.title();
        const bodyContent = await page.textContent('body');
        
        if (bodyContent.includes('HAQEI') || title.includes('HAQEI')) {
            report.step1_mainPage.status = 'success';
            report.step1_mainPage.details = `タイトル: ${title}`;
        } else {
            report.step1_mainPage.status = 'failed';
            report.step1_mainPage.details = 'HAQEIコンテンツが見つからない';
        }

        // Step 2: OS Analyzerアクセス
        console.log('🔍 Step 2: OS Analyzer(public/os_analyzer.html)アクセステスト');
        await page.goto('http://localhost:8080/public/os_analyzer.html');
        await page.waitForTimeout(3000);
        
        report.step2_osAnalyzer.screenshot = await page.screenshot({ 
            path: 'step2-os-analyzer-access.png',
            fullPage: true 
        });
        
        const osAnalyzerTitle = await page.title();
        const hasStartButton = await page.$('button, input[type="button"], .start-btn, #start-btn') !== null;
        
        if (osAnalyzerTitle.includes('OS') || hasStartButton) {
            report.step2_osAnalyzer.status = 'success';
            report.step2_osAnalyzer.details = `OS Analyzerページ正常アクセス - タイトル: ${osAnalyzerTitle}`;
        } else {
            report.step2_osAnalyzer.status = 'failed';
            report.step2_osAnalyzer.details = 'OS Analyzerコンテンツまたはスタートボタンが見つからない';
        }

        // Step 3: 悩み入力テスト
        console.log('🔍 Step 3: 悩み入力フローテスト');
        
        // 悩み入力エリアを探す
        const worryInput = await page.$('textarea, input[type="text"]');
        if (worryInput) {
            await worryInput.fill('転職について悩んでいます。現在の仕事に満足していませんが、家族もいるので収入面で不安があります。');
            
            // スタートボタンを探してクリック
            const startButton = await page.$('button:has-text("開始"), button:has-text("スタート"), button:has-text("START"), #startBtn, .start-btn');
            if (startButton) {
                await startButton.click();
                await page.waitForTimeout(5000);
                
                report.step3_worryInput.screenshot = await page.screenshot({ 
                    path: 'step3-worry-input.png',
                    fullPage: true 
                });
                
                report.step3_worryInput.status = 'success';
                report.step3_worryInput.details = '悩み入力とスタートボタンクリック完了';
            } else {
                report.step3_worryInput.status = 'failed';
                report.step3_worryInput.details = 'スタートボタンが見つからない';
            }
        } else {
            report.step3_worryInput.status = 'failed';
            report.step3_worryInput.details = '悩み入力エリアが見つからない';
        }

        // Step 4: 8シナリオ生成テスト
        console.log('🔍 Step 4: 8シナリオ生成→選択テスト');
        await page.waitForTimeout(10000); // 分析時間待機
        
        // シナリオが表示されているかチェック
        const scenarios = await page.$$('.scenario, .option, .choice');
        const scenarioTexts = await page.$$eval('.scenario, .option, .choice', els => 
            els.map(el => el.textContent)
        ).catch(() => []);
        
        report.step4_scenarioGeneration.screenshot = await page.screenshot({ 
            path: 'step4-scenarios.png',
            fullPage: true 
        });
        
        if (scenarios.length >= 3 || scenarioTexts.length >= 3) {
            report.step4_scenarioGeneration.status = 'success';
            report.step4_scenarioGeneration.details = `${scenarios.length}個のシナリオオプションを検出`;
            
            // 最初のシナリオを選択
            if (scenarios[0]) {
                await scenarios[0].click();
                await page.waitForTimeout(3000);
            }
        } else {
            report.step4_scenarioGeneration.status = 'failed';
            report.step4_scenarioGeneration.details = 'シナリオオプションが生成されていない';
        }

        // Step 5: Future Simulator機能評価
        console.log('🔍 Step 5: Future Simulator機能評価');
        await page.waitForTimeout(5000);
        
        const finalContent = await page.textContent('body');
        const hasFutureContent = finalContent.includes('未来') || finalContent.includes('予測') || finalContent.includes('シミュレーション');
        const hasAdviceContent = finalContent.includes('アドバイス') || finalContent.includes('指針') || finalContent.includes('推奨');
        
        report.step5_futureSimulator.screenshot = await page.screenshot({ 
            path: 'step5-future-simulator.png',
            fullPage: true 
        });
        
        if (hasFutureContent && hasAdviceContent) {
            report.step5_futureSimulator.status = 'success';
            report.step5_futureSimulator.details = 'Future Simulatorが適切に機能している';
        } else {
            report.step5_futureSimulator.status = 'partial';
            report.step5_futureSimulator.details = 'Future Simulatorの機能が不完全';
        }

        // Future Simulator本来目的適合性評価
        report.futureSimulatorAssessment = `
悩み解決適合性: ${hasFutureContent && hasAdviceContent ? '高' : '低'}
- 未来予測機能: ${hasFutureContent ? '有' : '無'}
- 具体的指針: ${hasAdviceContent ? '有' : '無'}
- 選択肢提示: ${scenarios.length >= 3 ? '適切' : '不足'}
        `.trim();

    } catch (error) {
        console.error('テスト実行エラー:', error);
        report.errors.push(`テスト実行エラー: ${error.message}`);
    }

    await browser.close();
    
    // レポート生成
    console.log('\n📊 === 検証結果レポート ===');
    console.log('1. メインページアクセス:', report.step1_mainPage.status, report.step1_mainPage.details);
    console.log('2. OS Analyzerアクセス:', report.step2_osAnalyzer.status, report.step2_osAnalyzer.details);
    console.log('3. 悩み入力フロー:', report.step3_worryInput.status, report.step3_worryInput.details);
    console.log('4. シナリオ生成:', report.step4_scenarioGeneration.status, report.step4_scenarioGeneration.details);
    console.log('5. Future Simulator:', report.step5_futureSimulator.status, report.step5_futureSimulator.details);
    
    console.log('\n🎯 Future Simulator目的適合性:');
    console.log(report.futureSimulatorAssessment);
    
    if (report.errors.length > 0) {
        console.log('\n❌ 発見されたエラー:');
        report.errors.forEach(error => console.log('  -', error));
    }
    
    return report;
}

comprehensiveUserFlowVerification().catch(console.error);