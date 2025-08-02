// シンプルなTriple OSテスト
const puppeteer = require('puppeteer');

async function simpleTest() {
    console.log('🔍 シンプルなTriple OSテスト開始\n');
    
    const browser = await puppeteer.launch({
        headless: false,
        devtools: true // 開発者ツールを開く
    });
    
    const page = await browser.newPage();
    
    // エラーを含むすべてのコンソールログを表示
    page.on('console', msg => console.log(`[${msg.type()}] ${msg.text()}`));
    page.on('pageerror', error => console.error('[PAGE ERROR]', error.message));
    
    try {
        await page.goto('http://localhost:3000/debug-triple-os.html');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // コンソールで直接テスト
        const result = await page.evaluate(async () => {
            console.log('=== ブラウザ内で直接テスト開始 ===');
            
            try {
                // DataManager初期化
                const dataManager = new DataManager();
                await dataManager.loadAllData();
                console.log('DataManager初期化完了');
                
                // TripleOSEngine初期化
                const tripleOSEngine = new TripleOSEngine(dataManager);
                console.log('TripleOSEngine初期化完了');
                
                // シンプルな回答データ
                const testAnswers = [{
                    questionId: 'q1',
                    selectedChoice: 'q1a',
                    choiceText: 'テスト選択肢A',
                    selectedValue: 'A'
                }];
                
                // analyzeUserを直接呼ぶ
                console.log('analyzeUser呼び出し中...');
                const analysisResult = await tripleOSEngine.analyzeUser(testAnswers);
                
                return {
                    success: true,
                    result: analysisResult,
                    hasTripleOS: !!(analysisResult?.engineOS && analysisResult?.interfaceOS && analysisResult?.safeModeOS)
                };
                
            } catch (error) {
                console.error('エラー発生:', error);
                return {
                    success: false,
                    error: error.message,
                    stack: error.stack
                };
            }
        });
        
        console.log('\n📊 テスト結果:');
        console.log(JSON.stringify(result, null, 2));
        
        // 最小限の回答で再テスト
        console.log('\n🔬 30問の完全な回答でテスト...');
        const fullResult = await page.evaluate(async () => {
            try {
                const dataManager = new DataManager();
                await dataManager.loadAllData();
                
                const tripleOSEngine = new TripleOSEngine(dataManager);
                
                // 30問の回答を生成
                const answers = [];
                for (let i = 1; i <= 30; i++) {
                    const choices = ['a', 'b', 'c', 'd'];
                    const choice = choices[Math.floor(Math.random() * 4)];
                    answers.push({
                        questionId: `q${i}`,
                        selectedChoice: `q${i}${choice}`,
                        choiceText: `選択肢${choice.toUpperCase()}`,
                        selectedValue: choice.toUpperCase()
                    });
                }
                
                console.log('30問の回答を使用して分析開始...');
                const result = await tripleOSEngine.analyzeUser(answers);
                
                // 結果を保存
                const storageManager = new StorageManager();
                const saveSuccess = storageManager.saveAnalysisResult(result);
                
                return {
                    success: true,
                    analysisType: result?.analysisType,
                    hasEngineOS: !!result?.engineOS,
                    hasInterfaceOS: !!result?.interfaceOS,
                    hasSafeModeOS: !!result?.safeModeOS,
                    saved: saveSuccess
                };
                
            } catch (error) {
                return {
                    success: false,
                    error: error.message
                };
            }
        });
        
        console.log('完全テスト結果:', fullResult);
        
        // LocalStorageの最終確認
        const storageData = await page.evaluate(() => {
            const data = localStorage.getItem('haqei_analysis_result');
            if (data) {
                const parsed = JSON.parse(data);
                return {
                    exists: true,
                    hasTripleOS: !!(parsed.engineOS && parsed.interfaceOS && parsed.safeModeOS),
                    engineOSName: parsed.engineOS?.name
                };
            }
            return { exists: false };
        });
        
        console.log('\n💾 LocalStorage最終確認:', storageData);
        
    } catch (error) {
        console.error('❌ テストエラー:', error.message);
    } finally {
        console.log('\n🔚 ブラウザは開いたままにします（手動で確認してください）');
        // await browser.close();
    }
}

simpleTest();