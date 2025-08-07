const puppeteer = require('puppeteer');

async function testResultsDirect() {
    console.log('🚀 Results.html 直接テスト開始');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 }
    });
    
    const page = await browser.newPage();
    
    // コンソールログを監視（DataManagerログを除外）
    page.on('console', msg => {
        const text = msg.text();
        if (!text.includes('[DataManager]') && !text.includes('利用可能なデータ')) {
            console.log(`[Browser] ${text}`);
        }
    });
    
    try {
        // 完全な分析結果データを作成
        const completeAnalysisData = {
            engineOS: {
                hexagramId: "11",
                hexagramName: "地天泰",
                hexagramSymbol: "☷☰",
                primaryElement: "earth",
                traits: ["安定性", "調和", "豊かさ"],
                scores: {
                    authenticity: 85,
                    consistency: 78,
                    influence: 82
                },
                description: "あなたの価値観システムは「地天泰」のように、天地が調和し、すべてが順調に進む状態を示しています。"
            },
            interfaceOS: {
                hexagramId: "17",
                hexagramName: "沢雷随",
                hexagramSymbol: "☱☳",
                primaryElement: "lake",
                traits: ["柔軟性", "適応力", "共感力"],
                scores: {
                    adaptability: 75,
                    expressiveness: 70,
                    socialAlignment: 73
                },
                description: "社会的な場面では「沢雷随」のように、状況に応じて柔軟に対応します。"
            },
            safeModeOS: {
                hexagramId: "51",
                hexagramName: "震為雷",
                hexagramSymbol: "☳☳",
                primaryElement: "thunder",
                traits: ["瞬発力", "警戒心", "回復力"],
                scores: {
                    reactivity: 88,
                    resilience: 80,
                    protectionLevel: 85
                },
                description: "防御システムは「震為雷」のように、危機を素早く察知します。"
            }
        };
        
        // 30問の回答データ
        const completeAnswers = [];
        for (let i = 1; i <= 30; i++) {
            completeAnswers.push({
                questionId: `q${i}`,
                selectedValue: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
                timestamp: new Date(Date.now() - (30 - i) * 10000).toISOString()
            });
        }
        
        // ページ遷移前にLocalStorageにデータを設定
        await page.evaluateOnNewDocument((analysisData, answers) => {
            // セッションデータ
            localStorage.setItem('haqei_session', JSON.stringify({
                sessionId: 'test-' + Date.now(),
                stage: 'results',
                completedAt: new Date().toISOString()
            }));
            
            // 回答データ
            localStorage.setItem('haqei_answers', JSON.stringify(answers));
            
            // 分析結果
            localStorage.setItem('haqei_analysis_result', JSON.stringify(analysisData));
            
            // 診断結果
            localStorage.setItem('haqei_diagnosis_result', JSON.stringify({
                analysisResult: analysisData,
                userAnswers: answers,
                timestamp: new Date().toISOString()
            }));
        }, completeAnalysisData, completeAnswers);
        
        console.log('✅ テストデータを準備しました');
        
        // Results.htmlを開く
        console.log('\n📱 Results.htmlを開いています...');
        await page.goto('http://localhost:3000/results.html', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        
        // ページ読み込み完了を待つ
        await page.waitForTimeout(3000);
        
        // ローディング画面の状態を確認
        const loadingVisible = await page.evaluate(() => {
            const loading = document.querySelector('.loading-container');
            return loading && window.getComputedStyle(loading).display !== 'none';
        });
        
        console.log(`\n📊 ローディング画面: ${loadingVisible ? '表示中' : '非表示'}`);
        
        // 画面の状態を確認
        const pageState = await page.evaluate(() => {
            const state = {
                title: document.title,
                containers: {}
            };
            
            // 主要なコンテナを確認
            const containerIds = [
                'virtual-persona-container',
                'personality-construction-container',
                'dialogue-section',
                'triple-os-container'
            ];
            
            containerIds.forEach(id => {
                const element = document.getElementById(id);
                state.containers[id] = {
                    exists: !!element,
                    visible: element ? window.getComputedStyle(element).display !== 'none' : false
                };
            });
            
            // Triple OSの要素を確認
            const tripleOS = {
                engine: document.querySelector('.engine-os'),
                interface: document.querySelector('.interface-os'),
                safeMode: document.querySelector('.safemode-os')
            };
            
            state.tripleOS = {};
            for (const [key, element] of Object.entries(tripleOS)) {
                if (element) {
                    state.tripleOS[key] = {
                        exists: true,
                        title: element.querySelector('h3')?.textContent,
                        content: element.textContent.substring(0, 100)
                    };
                }
            }
            
            return state;
        });
        
        console.log('\n🔍 ページ状態:');
        console.log(`タイトル: ${pageState.title}`);
        
        console.log('\nコンテナ表示状態:');
        for (const [id, info] of Object.entries(pageState.containers)) {
            console.log(`- ${id}: ${info.exists ? (info.visible ? '✅ 表示中' : '⚠️ 非表示') : '❌ 存在しない'}`);
        }
        
        if (Object.keys(pageState.tripleOS).length > 0) {
            console.log('\n🎯 Triple OS要素:');
            for (const [key, info] of Object.entries(pageState.tripleOS)) {
                if (info) {
                    console.log(`- ${key}: ${info.title || '(タイトルなし)'}`);
                }
            }
        }
        
        // スクリーンショットを撮る
        console.log('\n📸 スクリーンショットを保存中...');
        
        // フルページ
        await page.screenshot({ 
            path: 'results-full-page.png',
            fullPage: true 
        });
        console.log('✅ フルページ: results-full-page.png');
        
        // ビューポート内
        await page.screenshot({ 
            path: 'results-viewport.png'
        });
        console.log('✅ ビューポート: results-viewport.png');
        
        // エラーメッセージの確認
        const errorMessages = await page.evaluate(() => {
            const errors = [];
            document.querySelectorAll('.error-message, .error, [class*="error"]').forEach(el => {
                if (el.textContent.trim()) {
                    errors.push(el.textContent.trim());
                }
            });
            return errors;
        });
        
        if (errorMessages.length > 0) {
            console.log('\n⚠️ エラーメッセージ:');
            errorMessages.forEach(msg => console.log(`- ${msg}`));
        }
        
        console.log('\n✅ Results.html直接テスト完了！');
        
    } catch (error) {
        console.error('\n❌ エラー発生:', error.message);
        console.error(error.stack);
        await page.screenshot({ path: 'results-direct-error.png' });
        console.log('📸 エラースクリーンショット: results-direct-error.png');
    } finally {
        console.log('\n💡 ブラウザは開いたままです。手動で確認後、Ctrl+Cで終了してください。');
    }
}

// テスト実行
testResultsDirect();