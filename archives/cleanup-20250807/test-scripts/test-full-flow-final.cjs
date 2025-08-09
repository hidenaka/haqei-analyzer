const puppeteer = require('puppeteer');

async function testCompleteFlow() {
    console.log('🚀 最終的な完全フローテスト開始\n');
    console.time('Total Time');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 }
    });
    
    const page = await browser.newPage();
    
    // 重要なログを表示
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Triple') || 
            text.includes('Analysis') || 
            text.includes('save') || 
            text.includes('Result') ||
            text.includes('Error') ||
            text.includes('analyzeTripleOS')) {
            console.log(`[Browser] ${text}`);
        }
    });
    
    try {
        // Step 1: デバッグページでテスト
        console.log('📝 Step 1: デバッグページでTriple OS生成を確認');
        await page.goto('http://localhost:3000/debug-triple-os.html');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // TripleOSEngine直接テスト
        console.log('\n🔬 TripleOSEngine直接テスト実行...');
        // ボタンをテキストで検索
        const buttons = await page.$$('button');
        for (const button of buttons) {
            const text = await page.evaluate(el => el.textContent, button);
            if (text && text.includes('TripleOSEngine直接テスト')) {
                await button.click();
                break;
            }
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const directTestResult = await page.evaluate(() => {
            const output = document.getElementById('output');
            return output ? output.textContent : '';
        });
        
        console.log('直接テスト結果（抜粋）:');
        const lines = directTestResult.split('\n').slice(0, 20);
        lines.forEach(line => {
            if (line.includes('✅') || line.includes('❌') || line.includes('engineOS')) {
                console.log(line);
            }
        });
        
        // LocalStorage確認
        console.log('\n💾 LocalStorage確認...');
        // LocalStorage確認ボタンをクリック
        const storageButtons = await page.$$('button');
        for (const button of storageButtons) {
            const text = await page.evaluate(el => el.textContent, button);
            if (text && text.includes('LocalStorage確認')) {
                await button.click();
                break;
            }
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const storageCheck = await page.evaluate(() => {
            const analysisResult = localStorage.getItem('haqei_analysis_result');
            if (analysisResult) {
                try {
                    const parsed = JSON.parse(analysisResult);
                    return {
                        exists: true,
                        hasTripleOS: !!(parsed.engineOS && parsed.interfaceOS && parsed.safeModeOS),
                        engineOSName: parsed.engineOS?.name,
                        dataSize: analysisResult.length
                    };
                } catch (e) {
                    return { exists: true, error: e.message };
                }
            }
            return { exists: false };
        });
        
        console.log('LocalStorage状態:', storageCheck);
        
        // Step 2: 実際のアプリでフローテスト
        console.log('\n📱 Step 2: 実際のアプリケーションでテスト');
        
        // データをクリア
        await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
        
        await page.goto('http://localhost:3000/os_analyzer.html');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 分析開始
        await page.waitForSelector('#start-analysis-btn', { visible: true });
        await page.click('#start-analysis-btn');
        console.log('✅ 分析開始');
        
        // 設問画面で回答を高速入力
        await page.waitForSelector('#questions-container', { visible: true });
        console.log('⚡ 高速回答入力...');
        
        const analysisTriggered = await page.evaluate(() => {
            // 30問の回答を作成（修正されたフォーマット）
            const answers = [];
            for (let i = 1; i <= 30; i++) {
                const choices = ['A', 'B', 'C', 'D'];
                const choice = choices[Math.floor(Math.random() * 4)];
                answers.push({
                    questionId: `q${i}`,
                    selectedValue: choice,
                    selectedChoice: `q${i}${choice.toLowerCase()}`,
                    choiceText: `選択肢${choice}のテキスト`,
                    timestamp: new Date().toISOString()
                });
            }
            
            // LocalStorageに保存
            localStorage.setItem('haqei_answers', JSON.stringify(answers));
            
            // セッション更新
            const session = JSON.parse(localStorage.getItem('haqei_session') || '{}');
            session.currentQuestionIndex = 29;
            session.stage = 'analysis';
            localStorage.setItem('haqei_session', JSON.stringify(session));
            
            // proceedToAnalysisを呼ぶ
            if (typeof proceedToAnalysis === 'function') {
                console.log('🎯 Calling proceedToAnalysis');
                proceedToAnalysis(answers);
                return true;
            }
            
            return false;
        });
        
        if (analysisTriggered) {
            console.log('✅ 分析処理開始');
        } else {
            console.log('⚠️ 分析処理の開始に失敗');
        }
        
        // 分析完了を待つ
        console.log('\n⏳ 分析完了を待機中...');
        await new Promise(resolve => setTimeout(resolve, 10000)); // 10秒待機
        
        // 最終的なTriple OSデータ確認
        console.log('\n🔍 最終的なTriple OSデータ確認');
        const finalResult = await page.evaluate(() => {
            const results = {};
            
            // 各種キーでTriple OSデータを探す
            const keys = [
                'haqei_analysis_result',
                'haqei_diagnosis_result',
                'haqei_simple_analysis_result'
            ];
            
            keys.forEach(key => {
                const data = localStorage.getItem(key);
                if (data) {
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.engineOS || parsed.interfaceOS || parsed.safeModeOS) {
                            results[key] = {
                                hasEngineOS: !!parsed.engineOS,
                                hasInterfaceOS: !!parsed.interfaceOS,
                                hasSafeModeOS: !!parsed.safeModeOS,
                                engineOSName: parsed.engineOS?.name,
                                interfaceOSName: parsed.interfaceOS?.name,
                                safeModeOSName: parsed.safeModeOS?.name
                            };
                        }
                    } catch (e) {
                        results[key] = { error: e.message };
                    }
                }
            });
            
            return results;
        });
        
        console.log('\n📊 最終結果:');
        console.log(JSON.stringify(finalResult, null, 2));
        
        // 現在のURL確認
        const currentUrl = page.url();
        console.log(`\n📍 現在のURL: ${currentUrl}`);
        
        if (currentUrl.includes('results.html')) {
            console.log('🎉 results.htmlに到達！');
            
            // エラー確認
            const hasError = await page.evaluate(() => {
                const errorEl = document.querySelector('.error-message');
                return errorEl && window.getComputedStyle(errorEl).display !== 'none';
            });
            
            if (hasError) {
                const errorText = await page.evaluate(() => {
                    return document.querySelector('.error-message')?.textContent;
                });
                console.log(`❌ エラー表示: ${errorText}`);
            } else {
                console.log('✅ エラーなし - 結果が正常に表示されている可能性');
            }
        }
        
        // スクリーンショット
        await page.screenshot({ 
            path: 'final-flow-test-result.png', 
            fullPage: true 
        });
        console.log('\n📸 スクリーンショット: final-flow-test-result.png');
        
        console.timeEnd('Total Time');
        console.log('\n✅ テスト完了！');
        
    } catch (error) {
        console.error('\n❌ エラー:', error.message);
        await page.screenshot({ path: 'final-flow-test-error.png' });
    } finally {
        await new Promise(resolve => setTimeout(resolve, 5000));
        await browser.close();
    }
}

// 実行
testCompleteFlow();