import { chromium } from 'playwright';

/**
 * 🔍 シンプルな保存問題デバッグ
 */

async function simpleSaveDebug() {
    console.log('🔍 シンプルな保存問題デバッグ開始\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000  // ゆっくり実行
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // コンソールメッセージ監視
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('saveAnswer') || text.includes('currentAnalyzer') || 
                text.includes('state.answers')) {
                console.log(`[CONSOLE] ${text}`);
            }
        });
        
        // エラー監視
        page.on('pageerror', err => {
            console.error('[PAGE ERROR]', err.message);
        });
        
        // 1. ページロード
        console.log('📡 ページロード...');
        await page.goto('http://localhost:8788/os_analyzer.html');
        await page.waitForTimeout(2000);
        
        // 2. 初期状態確認
        console.log('\n📋 初期状態確認:');
        const initialState = await page.evaluate(() => {
            console.log('Checking for analyzer objects...');
            
            const result = {
                hasCriticalCSSAnalyzer: !!window.criticalCSSAnalyzer,
                hasCurrentAnalyzer: !!window.currentAnalyzer,
                hasOSAnalyzer: !!window.OSAnalyzer,
                analyzerInfo: null
            };
            
            // アナライザーの詳細情報
            if (window.criticalCSSAnalyzer) {
                result.analyzerInfo = {
                    hasState: !!window.criticalCSSAnalyzer.state,
                    stateAnswers: window.criticalCSSAnalyzer.state?.answers,
                    answersType: typeof window.criticalCSSAnalyzer.state?.answers,
                    answersLength: window.criticalCSSAnalyzer.state?.answers?.length
                };
            }
            
            return result;
        });
        
        console.log('  window.criticalCSSAnalyzer:', initialState.hasCriticalCSSAnalyzer);
        console.log('  window.currentAnalyzer:', initialState.hasCurrentAnalyzer);
        console.log('  window.OSAnalyzer:', initialState.hasOSAnalyzer);
        if (initialState.analyzerInfo) {
            console.log('  アナライザー詳細:', JSON.stringify(initialState.analyzerInfo, null, 2));
        }
        
        // 3. 分析開始
        console.log('\n🖱️ 分析開始...');
        await page.locator('#start-btn').click();
        await page.waitForTimeout(1000);
        
        // 4. 最初の質問で詳細デバッグ
        console.log('\n📝 最初の質問で詳細デバッグ:');
        
        // 選択前の状態
        const beforeClick = await page.evaluate(() => {
            const analyzer = window.criticalCSSAnalyzer || window.currentAnalyzer;
            if (!analyzer) return { error: 'No analyzer found' };
            
            return {
                hasState: !!analyzer.state,
                currentQuestion: analyzer.state?.currentQuestion,
                answers: analyzer.state?.answers,
                answersType: typeof analyzer.state?.answers,
                answersLength: analyzer.state?.answers?.length,
                saveAnswerExists: typeof analyzer.state?.saveAnswer === 'function'
            };
        });
        
        console.log('選択前の状態:', JSON.stringify(beforeClick, null, 2));
        
        // 選択肢をクリック
        console.log('\n🖱️ 選択肢をクリック...');
        await page.locator('.option').first().click();
        await page.waitForTimeout(1000);
        
        // 選択後の状態
        const afterClick = await page.evaluate(() => {
            const analyzer = window.criticalCSSAnalyzer || window.currentAnalyzer;
            if (!analyzer) return { error: 'No analyzer found' };
            
            // saveAnswerを手動で呼び出してみる
            try {
                if (analyzer.state && analyzer.state.saveAnswer) {
                    console.log('Manually calling saveAnswer...');
                    analyzer.state.saveAnswer(0, { selectedOption: 'A', text: 'Test' });
                }
            } catch (e) {
                console.error('Error calling saveAnswer:', e);
            }
            
            return {
                hasState: !!analyzer.state,
                currentQuestion: analyzer.state?.currentQuestion,
                answers: analyzer.state?.answers,
                answersType: typeof analyzer.state?.answers,
                answersLength: analyzer.state?.answers?.length,
                firstAnswer: analyzer.state?.answers?.[0]
            };
        });
        
        console.log('選択後の状態:', JSON.stringify(afterClick, null, 2));
        
        // 5. saveAnswer関数の存在と動作確認
        console.log('\n🔧 saveAnswer関数の詳細:');
        const saveAnswerInfo = await page.evaluate(() => {
            const analyzer = window.criticalCSSAnalyzer || window.currentAnalyzer;
            if (!analyzer?.state) return { error: 'No state found' };
            
            const info = {
                saveAnswerExists: typeof analyzer.state.saveAnswer === 'function',
                saveAnswerCode: null,
                testSave: null
            };
            
            if (info.saveAnswerExists) {
                // 関数のコードを取得
                info.saveAnswerCode = analyzer.state.saveAnswer.toString().substring(0, 200);
                
                // テスト保存
                try {
                    analyzer.state.saveAnswer(1, { selectedOption: 'B', text: 'Debug Test' });
                    info.testSave = {
                        success: true,
                        answer1: analyzer.state.answers?.[1]
                    };
                } catch (e) {
                    info.testSave = {
                        success: false,
                        error: e.message
                    };
                }
            }
            
            return info;
        });
        
        console.log('saveAnswer情報:', JSON.stringify(saveAnswerInfo, null, 2));
        
        // スクリーンショット
        await page.screenshot({ 
            path: 'simple_debug_20250816.png',
            fullPage: false 
        });
        
        return {
            initialState,
            beforeClick,
            afterClick,
            saveAnswerInfo
        };
        
    } catch (error) {
        console.error('❌ デバッグエラー:', error);
        return { error: error.message };
    } finally {
        console.log('\n⚠️ ブラウザは開いたままです。手動で確認してください。');
    }
}

// 実行
simpleSaveDebug()
    .then(result => {
        console.log('\n' + '='.repeat(50));
        console.log('📋 デバッグ完了');
        
        if (!result.error) {
            console.log('\n主な発見:');
            if (result.initialState?.hasCriticalCSSAnalyzer) {
                console.log('✅ criticalCSSAnalyzerは存在');
            } else {
                console.log('❌ criticalCSSAnalyzerが存在しない');
            }
            
            if (result.saveAnswerInfo?.saveAnswerExists) {
                console.log('✅ saveAnswer関数は存在');
            } else {
                console.log('❌ saveAnswer関数が存在しない');
            }
            
            if (result.saveAnswerInfo?.testSave?.success) {
                console.log('✅ saveAnswerのテスト保存成功');
            } else {
                console.log('❌ saveAnswerのテスト保存失敗');
            }
        }
        
        console.log('='.repeat(50));
    })
    .catch(error => {
        console.error('❌ 致命的エラー:', error);
    });