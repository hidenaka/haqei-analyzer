#!/usr/bin/env node
/**
 * 簡易診断ロジック確認テスト
 */

import puppeteer from 'puppeteer';

async function testDiagnosisSimple() {
    console.log('🔍 診断ロジック簡易確認テスト開始...\n');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 }
    });
    
    const page = await browser.newPage();
    
    // ログ収集
    const diagnosticLogs = [];
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Triple OS') || text.includes('Analysis') || text.includes('OS Vector') || text.includes('Engine OS')) {
            diagnosticLogs.push(text);
            console.log(`📝 ${text}`);
        }
    });
    
    try {
        await page.goto('http://localhost:8789/public/os_analyzer.html', {
            waitUntil: 'networkidle2'
        });
        
        // 1. 質問システムの確認
        console.log('✅ 1. 質問データ構造確認');
        
        const systemCheck = await page.evaluate(() => {
            return {
                questionsLoaded: typeof QUESTIONS !== 'undefined',
                questionsCount: typeof QUESTIONS !== 'undefined' ? QUESTIONS.length : 0,
                firstQuestionHasScoring: typeof QUESTIONS !== 'undefined' && QUESTIONS[0] ? 
                    QUESTIONS[0].options.every(opt => opt.scoring) : false,
                engineOSQuestions: typeof QUESTIONS !== 'undefined' ? 
                    QUESTIONS.slice(0, 12).length : 0,
                tripleOSEngineExists: typeof TripleOSEngine !== 'undefined'
            };
        });
        
        console.log(`   QUESTIONSロード: ${systemCheck.questionsLoaded ? '✅' : '❌'}`);
        console.log(`   質問数: ${systemCheck.questionsCount}/36`);
        console.log(`   スコアリング: ${systemCheck.firstQuestionHasScoring ? '✅' : '❌'}`);
        console.log(`   Engine OS質問: ${systemCheck.engineOSQuestions}/12`);
        console.log(`   診断エンジン: ${systemCheck.tripleOSEngineExists ? '✅' : '❌'}`);
        
        // 2. 分析開始
        console.log('\n✅ 2. 分析開始テスト');
        await page.click('#start-btn');
        
        // 質問画面の表示を待機
        await page.waitForSelector('#question-title', { timeout: 5000 });
        
        // 3. 最初の質問の確認
        const firstQuestion = await page.evaluate(() => {
            const title = document.getElementById('question-title');
            const optionsContainer = document.getElementById('options-container');
            const options = optionsContainer.querySelectorAll('.option');
            
            return {
                questionTitle: title ? title.textContent : 'N/A',
                optionsCount: options.length,
                optionsText: Array.from(options).slice(0, 2).map(opt => opt.textContent.trim()),
                hasActiveScreen: document.getElementById('question-screen').classList.contains('active')
            };
        });
        
        console.log(`   質問タイトル: "${firstQuestion.questionTitle.substring(0, 40)}..."`);
        console.log(`   選択肢数: ${firstQuestion.optionsCount}/5`);
        console.log(`   画面アクティブ: ${firstQuestion.hasActiveScreen ? '✅' : '❌'}`);
        
        if (firstQuestion.optionsCount > 0) {
            console.log(`   選択肢例: "${firstQuestion.optionsText[0].substring(0, 20)}..."`);
            
            // 4. 選択肢をクリックしてテスト
            console.log('\n✅ 3. 選択肢クリックテスト');
            await page.click('.option:first-child');
            
            // 次へボタンが有効になるか確認
            const nextButtonEnabled = await page.evaluate(() => {
                const nextBtn = document.getElementById('next-btn');
                return nextBtn && !nextBtn.disabled;
            });
            
            console.log(`   次へボタン有効化: ${nextButtonEnabled ? '✅' : '❌'}`);
            
            if (nextButtonEnabled) {
                // 次の質問に進む
                await page.click('#next-btn');
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const secondQuestion = await page.evaluate(() => {
                    const title = document.getElementById('question-title');
                    const progress = document.getElementById('progress-fill');
                    return {
                        questionTitle: title ? title.textContent.substring(0, 30) : 'N/A',
                        progressWidth: progress ? progress.style.width : '0%'
                    };
                });
                
                console.log(`   2問目表示: "${secondQuestion.questionTitle}..."`);
                console.log(`   進捗バー: ${secondQuestion.progressWidth}`);
            }
        }
        
        // 5. スコアリングメカニズムの確認
        console.log('\n✅ 4. スコアリングメカニズム確認');
        
        const scoringTest = await page.evaluate(() => {
            // 最初の質問の選択肢Aのスコアリングデータ確認
            if (typeof QUESTIONS !== 'undefined' && QUESTIONS[0]) {
                const firstOption = QUESTIONS[0].options[0];
                return {
                    hasScoring: !!firstOption.scoring,
                    scoringKeys: firstOption.scoring ? Object.keys(firstOption.scoring) : [],
                    sampleScore: firstOption.scoring ? firstOption.scoring['乾_創造性'] : null
                };
            }
            return { hasScoring: false };
        });
        
        console.log(`   スコアリング実装: ${scoringTest.hasScoring ? '✅' : '❌'}`);
        console.log(`   八卦要素数: ${scoringTest.scoringKeys.length}/8`);
        console.log(`   サンプルスコア: ${scoringTest.sampleScore}`);
        
        // 6. スクリーンショット
        await page.screenshot({ 
            path: 'test-diagnosis-simple.png',
            fullPage: false
        });
        console.log('\n📸 test-diagnosis-simple.png 保存完了');
        
        // 7. 総合評価
        const overallDiagnosis = 
            systemCheck.questionsLoaded &&
            systemCheck.questionsCount === 36 &&
            systemCheck.firstQuestionHasScoring &&
            firstQuestion.optionsCount === 5 &&
            scoringTest.hasScoring;
            
        console.log('\n' + '='.repeat(50));
        console.log('🎯 36問5択診断ロジック 実装状況:');
        console.log('='.repeat(50));
        console.log(`📝 36問システム: ${systemCheck.questionsCount === 36 ? '✅ 完全実装' : '❌ 不完全'}`);
        console.log(`🎰 5択選択肢: ${firstQuestion.optionsCount === 5 ? '✅ 完全実装' : '❌ 不完全'}`);
        console.log(`🧮 八卦スコアリング: ${scoringTest.hasScoring ? '✅ 完全実装' : '❌ 未実装'}`);
        console.log(`🔧 Triple OSエンジン: ${systemCheck.tripleOSEngineExists ? '✅ 実装済み' : '❌ 未実装'}`);
        console.log(`🎨 UI統合: ${firstQuestion.hasActiveScreen ? '✅ 正常動作' : '❌ 問題あり'}`);
        console.log('='.repeat(50));
        console.log(`🏆 診断ロジック総合: ${overallDiagnosis ? '✅ 正しく実装されています' : '❌ 要確認・修正'}`);
        console.log('='.repeat(50));
        
        if (diagnosticLogs.length > 0) {
            console.log('\n📊 診断関連ログ:');
            diagnosticLogs.forEach(log => console.log(`   ${log}`));
        }
        
        console.log('\n⏸️ ブラウザは開いたままです。手動で確認してください。');
        process.stdin.resume();
        
    } catch (error) {
        console.error('❌ テストエラー:', error.message);
        await browser.close();
    }
}

testDiagnosisSimple().catch(console.error);