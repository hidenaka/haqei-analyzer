/**
 * 統一スコアリングシステム統合動作確認テスト
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testIntegration() {
    console.log('===== 統合動作確認テスト =====\n');
    
    const browser = await chromium.launch({ 
        headless: true,
        args: ['--no-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // ファイルを直接開く（サーバー不要）
        const filePath = `file://${join(__dirname, 'public', 'os_analyzer.html')}`;
        console.log(`📁 Opening: ${filePath}\n`);
        
        await page.goto(filePath, { waitUntil: 'domcontentloaded' });
        
        // 1. 統一質問システムの読み込み確認
        console.log('1️⃣ 統一質問システムの読み込み確認');
        console.log('-'.repeat(50));
        
        const questionsLoaded = await page.evaluate(() => {
            return {
                hasQuestions: typeof window.QUESTIONS !== 'undefined',
                hasUnifiedQuestions: typeof window.unifiedQuestions !== 'undefined',
                questionsCount: window.QUESTIONS ? window.QUESTIONS.length : 0,
                isIdentical: window.QUESTIONS === window.unifiedQuestions
            };
        });
        
        console.log(`  window.QUESTIONS: ${questionsLoaded.hasQuestions ? '✅ 存在' : '❌ なし'}`);
        console.log(`  window.unifiedQuestions: ${questionsLoaded.hasUnifiedQuestions ? '✅ 存在' : '❌ なし'}`);
        console.log(`  質問数: ${questionsLoaded.questionsCount}/36 ${questionsLoaded.questionsCount === 36 ? '✅' : '❌'}`);
        console.log(`  互換性レイヤー: ${questionsLoaded.isIdentical ? '✅ 正常' : '❌ 異常'}`);
        
        // 2. 質問データの内容確認
        console.log('\n2️⃣ 質問データの内容確認');
        console.log('-'.repeat(50));
        
        const dataValidation = await page.evaluate(() => {
            if (!window.QUESTIONS || window.QUESTIONS.length === 0) {
                return { valid: false, error: 'No questions loaded' };
            }
            
            const firstQuestion = window.QUESTIONS[0];
            const hasRequiredFields = 
                firstQuestion.hasOwnProperty('id') &&
                firstQuestion.hasOwnProperty('text') &&
                firstQuestion.hasOwnProperty('options') &&
                firstQuestion.hasOwnProperty('osType');
            
            // スコアリング構造チェック
            let totalScore = 0;
            if (firstQuestion.options && firstQuestion.options[0]) {
                const scoring = firstQuestion.options[0].scoring;
                totalScore = Object.values(scoring || {}).reduce((sum, val) => sum + val, 0);
            }
            
            return {
                valid: hasRequiredFields,
                firstQuestionId: firstQuestion.id,
                firstQuestionText: firstQuestion.text.substring(0, 30) + '...',
                hasOsType: !!firstQuestion.osType,
                scoringTotal: totalScore.toFixed(1)
            };
        });
        
        console.log(`  データ構造: ${dataValidation.valid ? '✅ 正常' : '❌ 異常'}`);
        console.log(`  Q1 ID: ${dataValidation.firstQuestionId}`);
        console.log(`  Q1 テキスト: ${dataValidation.firstQuestionText}`);
        console.log(`  OSタイプフィールド: ${dataValidation.hasOsType ? '✅ あり' : '❌ なし'}`);
        console.log(`  Q1-A選択肢の合計点: ${dataValidation.scoringTotal}点 ${dataValidation.scoringTotal === '6.0' ? '✅' : '❌'}`);
        
        // 3. UIの初期化確認
        console.log('\n3️⃣ UI要素の確認');
        console.log('-'.repeat(50));
        
        const uiElements = await page.evaluate(() => {
            return {
                welcomeScreen: !!document.getElementById('welcome-screen'),
                questionScreen: !!document.getElementById('question-screen'),
                resultsScreen: !!document.getElementById('results-screen'),
                startBtn: !!document.getElementById('start-btn')
            };
        });
        
        console.log(`  ウェルカム画面: ${uiElements.welcomeScreen ? '✅' : '❌'}`);
        console.log(`  質問画面: ${uiElements.questionScreen ? '✅' : '❌'}`);
        console.log(`  結果画面: ${uiElements.resultsScreen ? '✅' : '❌'}`);
        console.log(`  開始ボタン: ${uiElements.startBtn ? '✅' : '❌'}`);
        
        // 4. 開始ボタンのクリックテスト
        console.log('\n4️⃣ アプリケーション動作テスト');
        console.log('-'.repeat(50));
        
        if (uiElements.startBtn) {
            await page.click('#start-btn');
            await page.waitForTimeout(500);
            
            const afterStart = await page.evaluate(() => {
                const welcomeHidden = document.getElementById('welcome-screen')?.classList.contains('hidden') ||
                                     !document.getElementById('welcome-screen')?.classList.contains('active');
                const questionVisible = document.getElementById('question-screen')?.classList.contains('active') ||
                                       !document.getElementById('question-screen')?.classList.contains('hidden');
                const questionContainer = document.getElementById('question-container');
                const hasQuestionText = questionContainer ? questionContainer.textContent.length > 0 : false;
                
                return {
                    welcomeHidden,
                    questionVisible,
                    hasQuestionText
                };
            });
            
            console.log(`  ウェルカム画面非表示: ${afterStart.welcomeHidden ? '✅' : '⚠️'}`);
            console.log(`  質問画面表示: ${afterStart.questionVisible ? '✅' : '⚠️'}`);
            console.log(`  質問テキスト表示: ${afterStart.hasQuestionText ? '✅' : '⚠️'}`);
        }
        
        // 5. 総合評価
        console.log('\n📊 総合評価');
        console.log('='.repeat(50));
        
        const allChecks = [
            questionsLoaded.hasQuestions,
            questionsLoaded.questionsCount === 36,
            questionsLoaded.isIdentical,
            dataValidation.valid,
            dataValidation.scoringTotal === '6.0',
            uiElements.welcomeScreen,
            uiElements.questionScreen,
            uiElements.resultsScreen,
            uiElements.startBtn
        ];
        
        const passedCount = allChecks.filter(check => check).length;
        const successRate = (passedCount / allChecks.length * 100).toFixed(0);
        
        console.log(`成功率: ${successRate}% (${passedCount}/${allChecks.length})`);
        
        if (successRate === '100') {
            console.log('\n🎉 統合成功！統一スコアリングシステムが正常に動作しています！');
        } else if (successRate >= '70') {
            console.log('\n✅ 統合はほぼ成功。一部の項目を確認してください。');
        } else {
            console.log('\n⚠️ 統合に問題があります。詳細を確認してください。');
        }
        
    } catch (error) {
        console.error('❌ エラー発生:', error.message);
    } finally {
        await browser.close();
    }
    
    console.log('\n===== テスト完了 =====');
}

// 実行
testIntegration().catch(console.error);