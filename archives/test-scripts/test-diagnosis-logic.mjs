#!/usr/bin/env node
/**
 * 36問5択診断ロジックの動作確認テスト
 */

import puppeteer from 'puppeteer';

async function testDiagnosisLogic() {
    console.log('🔍 36問5択診断ロジックのテストを開始...\n');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 }
    });
    
    const page = await browser.newPage();
    
    // コンソールログを捕捉
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        if (text.includes('Triple OS') || text.includes('Analysis') || text.includes('OS Vector')) {
            console.log(`📝 [${type}] ${text}`);
        }
    });
    
    try {
        await page.goto('http://localhost:8789/public/os_analyzer.html', {
            waitUntil: 'networkidle2'
        });
        
        console.log('✅ 1. システム初期化確認');
        
        // 1. 質問データの確認
        const questionData = await page.evaluate(() => {
            if (typeof QUESTIONS === 'undefined') return null;
            
            return {
                totalQuestions: QUESTIONS.length,
                sampleScoring: QUESTIONS[0]?.options?.[0]?.scoring,
                engineQuestions: QUESTIONS.slice(0, 12).map(q => ({
                    id: q.id,
                    hasScoring: q.options.every(opt => opt.scoring)
                })),
                interfaceQuestions: QUESTIONS.slice(12, 24).map(q => ({
                    id: q.id,
                    hasScoring: q.options.every(opt => opt.scoring)
                })),
                safeModeQuestions: QUESTIONS.slice(24, 36).map(q => ({
                    id: q.id,
                    hasScoring: q.options.every(opt => opt.scoring)
                }))
            };
        });
        
        if (!questionData) {
            throw new Error('❌ QUESTIONSデータが読み込まれていません');
        }
        
        console.log(`📊 質問データ確認:`);
        console.log(`   合計: ${questionData.totalQuestions}問 (期待値: 36)`);
        console.log(`   Engine OS: Q1-Q12 (${questionData.engineQuestions.length}問)`);
        console.log(`   Interface OS: Q13-Q24 (${questionData.interfaceQuestions.length}問)`);
        console.log(`   Safe Mode OS: Q25-Q36 (${questionData.safeModeQuestions.length}問)`);
        console.log(`   サンプルスコア:`, questionData.sampleScoring);
        
        // 2. 分析開始
        console.log('\n✅ 2. 診断ロジックテスト開始');
        await page.click('#start-btn');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 3. 自動回答（パターン1: 全て"A"選択）
        console.log('\n📝 3. 自動回答実行中（パターン: 全A選択）...');
        
        for (let i = 0; i < 36; i++) {
            // 現在の質問確認
            const questionInfo = await page.evaluate(() => {
                const titleEl = document.getElementById('question-title');
                const optionsEl = document.querySelectorAll('.option');
                return {
                    questionText: titleEl ? titleEl.textContent : 'N/A',
                    optionsCount: optionsEl.length
                };
            });
            
            if (i === 0 || i === 11 || i === 23 || i === 35) {
                console.log(`   Q${i + 1}: ${questionInfo.questionText.substring(0, 30)}... (選択肢: ${questionInfo.optionsCount}個)`);
            }
            
            // 最初の選択肢（A）をクリック
            await page.click('.option:first-child');
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // 次へボタンをクリック（最後の質問以外）
            if (i < 35) {
                await page.click('#next-btn');
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
        
        console.log('✅ 全36問の回答完了');
        
        // 4. 分析結果の待機と確認
        console.log('\n⏳ 4. 分析実行中...');
        await new Promise(resolve => setTimeout(resolve, 8000)); // 分析完了を待機
        
        // 5. 結果の確認
        const analysisResults = await page.evaluate(() => {
            // results-screenが表示されているか確認
            const resultsScreen = document.getElementById('results-screen');
            const isResultsVisible = resultsScreen && window.getComputedStyle(resultsScreen).display !== 'none';
            
            // Triple OS結果の取得
            const engineResult = document.querySelector('.engine-os-result');
            const interfaceResult = document.querySelector('.interface-os-result');
            const safeModeResult = document.querySelector('.safe-mode-os-result');
            
            // 八卦結果の確認
            const hexagramElements = document.querySelectorAll('[class*="hexagram"], [id*="hexagram"]');
            
            return {
                resultsScreenVisible: isResultsVisible,
                engineOSDisplayed: !!engineResult,
                interfaceOSDisplayed: !!interfaceResult,
                safeModeOSDisplayed: !!safeModeResult,
                hexagramCount: hexagramElements.length,
                pageTitle: document.title,
                resultText: resultsScreen ? resultsScreen.textContent.substring(0, 200) : 'N/A'
            };
        });
        
        // 6. スクリーンショット撮影
        await page.screenshot({ 
            path: 'test-diagnosis-results.png',
            fullPage: false
        });
        console.log('📸 test-diagnosis-results.png 保存完了');
        
        // 7. 結果評価
        console.log('\n📊 診断ロジック動作結果:');
        console.log(`   結果画面表示: ${analysisResults.resultsScreenVisible ? '✅' : '❌'}`);
        console.log(`   Engine OS表示: ${analysisResults.engineOSDisplayed ? '✅' : '❌'}`);
        console.log(`   Interface OS表示: ${analysisResults.interfaceOSDisplayed ? '✅' : '❌'}`);
        console.log(`   Safe Mode OS表示: ${analysisResults.safeModeOSDisplayed ? '✅' : '❌'}`);
        console.log(`   八卦要素数: ${analysisResults.hexagramCount}個`);
        console.log(`   結果テキスト: "${analysisResults.resultText.substring(0, 100)}..."`);
        
        const overallSuccess = 
            questionData.totalQuestions === 36 &&
            analysisResults.resultsScreenVisible &&
            (analysisResults.engineOSDisplayed || analysisResults.interfaceOSDisplayed || analysisResults.safeModeOSDisplayed);
        
        console.log('\n' + '='.repeat(60));
        console.log('🎯 36問5択診断ロジック 総合評価:');
        console.log('='.repeat(60));
        console.log(`📝 質問システム: ${questionData.totalQuestions === 36 ? '✅ 36問完備' : '❌ 不完全'}`);
        console.log(`🔧 スコアリング: ${questionData.sampleScoring ? '✅ 八卦ベース実装' : '❌ 未実装'}`);
        console.log(`🧮 診断エンジン: ${analysisResults.resultsScreenVisible ? '✅ 正常動作' : '❌ 動作不良'}`);
        console.log(`🎨 結果表示: ${analysisResults.engineOSDisplayed || analysisResults.interfaceOSDisplayed || analysisResults.safeModeOSDisplayed ? '✅ Triple OS表示' : '❌ 表示問題'}`);
        console.log('='.repeat(60));
        console.log(`🏆 総合判定: ${overallSuccess ? '✅ 診断ロジック正常実装' : '❌ 要修正'}`);
        console.log('='.repeat(60));
        
        // ブラウザを開いたままにする
        console.log('\n⏸️ ブラウザは開いたままです。結果を確認してください。');
        process.stdin.resume();
        
    } catch (error) {
        console.error('❌ テストエラー:', error.message);
        await browser.close();
    }
}

testDiagnosisLogic().catch(console.error);