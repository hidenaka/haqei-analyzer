import { chromium } from 'playwright';

console.log('🔍 フェーズ2実装レビュー開始\n');

const browser = await chromium.launch({ 
    headless: false,
    devtools: true 
});
const context = await browser.newContext();
const page = await context.newPage();

// エラー収集
const errors = [];
page.on('console', msg => {
    if (msg.type() === 'error') {
        errors.push(msg.text());
    }
});

try {
    // ページを開く
    console.log('📍 Step 1: ページを開く');
    await page.goto('http://localhost:8012/public/results.html', {
        waitUntil: 'networkidle'
    });
    await page.waitForTimeout(2000);

    // 基本タブの確認
    console.log('\n✅ Step 2: 基本タブの動作確認');
    const basicTabVisible = await page.evaluate(() => {
        const container = document.querySelector('.basic-results-container');
        const cards = document.querySelectorAll('.os-card');
        return {
            containerVisible: !!container,
            cardsCount: cards.length,
            hasContent: cards.length > 0
        };
    });
    console.log(`  基本タブ: ${basicTabVisible.containerVisible ? '✅' : '❌'}`);
    console.log(`  OSカード数: ${basicTabVisible.cardsCount}`);

    // 詳細分析タブに切り替え
    console.log('\n🔍 Step 3: 詳細分析タブに切り替え');
    
    // タブボタンを探してクリック
    const tabClicked = await page.evaluate(() => {
        // 複数の可能なセレクタを試す
        const selectors = [
            'button[onclick*="detailed-analysis"]',
            'button[onclick*="detailed"]',
            '.tab-button:nth-child(2)',
            '[data-tab="detailed-analysis"]',
            '[data-tab="detailed"]'
        ];
        
        for (const selector of selectors) {
            const button = document.querySelector(selector);
            if (button) {
                button.click();
                return { clicked: true, selector };
            }
        }
        
        // それでも見つからない場合は、テキストで検索
        const buttons = Array.from(document.querySelectorAll('button'));
        const detailButton = buttons.find(b => 
            b.textContent.includes('詳細分析') || 
            b.textContent.includes('Detailed')
        );
        if (detailButton) {
            detailButton.click();
            return { clicked: true, selector: 'text-based' };
        }
        
        return { clicked: false, buttons: buttons.map(b => b.textContent) };
    });
    
    console.log(`  タブクリック: ${tabClicked.clicked ? '✅' : '❌'}`);
    if (!tabClicked.clicked) {
        console.log('  利用可能なボタン:', tabClicked.buttons);
    }
    
    await page.waitForTimeout(1000);

    // DetailedAnalysisTabの存在確認
    console.log('\n📊 Step 4: DetailedAnalysisTabの確認');
    const detailsCheck = await page.evaluate(() => {
        return {
            classExists: typeof DetailedAnalysisTab !== 'undefined',
            chartJsLoaded: typeof Chart !== 'undefined',
            containerExists: !!document.querySelector('.detailed-analysis-container'),
            chartCanvasExists: !!document.getElementById('balanceChart')
        };
    });
    
    Object.entries(detailsCheck).forEach(([key, value]) => {
        console.log(`  ${key}: ${value ? '✅' : '❌'}`);
    });

    // チャートの状態確認
    console.log('\n📈 Step 5: チャート要素の確認');
    const chartElements = await page.evaluate(() => {
        const canvas = document.getElementById('balanceChart');
        const chartContainer = document.querySelector('.chart-container');
        const balanceInterpretation = document.getElementById('balanceInterpretation');
        const synergyCards = document.getElementById('synergyCards');
        const summaryPanel = document.getElementById('summaryPanel');
        const actionCards = document.getElementById('actionCards');
        
        return {
            canvas: {
                exists: !!canvas,
                width: canvas?.width,
                height: canvas?.height,
                hasContext: canvas ? !!canvas.getContext('2d') : false
            },
            containers: {
                chartContainer: !!chartContainer,
                balanceInterpretation: !!balanceInterpretation,
                synergyCards: !!synergyCards,
                summaryPanel: !!summaryPanel,
                actionCards: !!actionCards
            },
            content: {
                interpretationHasContent: balanceInterpretation?.innerHTML?.length > 50,
                synergyHasContent: synergyCards?.innerHTML?.length > 50,
                summaryHasContent: summaryPanel?.innerHTML?.length > 50,
                actionHasContent: actionCards?.innerHTML?.length > 50
            }
        };
    });
    
    console.log('  Canvas:');
    Object.entries(chartElements.canvas).forEach(([key, value]) => {
        console.log(`    ${key}: ${value}`);
    });
    
    console.log('  Containers:');
    Object.entries(chartElements.containers).forEach(([key, value]) => {
        console.log(`    ${key}: ${value ? '✅' : '❌'}`);
    });
    
    console.log('  Content:');
    Object.entries(chartElements.content).forEach(([key, value]) => {
        console.log(`    ${key}: ${value ? '✅' : '❌'}`);
    });

    // レンダリングメソッドの確認
    console.log('\n🔧 Step 6: レンダリングメソッドの存在確認');
    const methodsCheck = await page.evaluate(() => {
        if (typeof DetailedAnalysisTab === 'undefined') {
            return { error: 'DetailedAnalysisTab not defined' };
        }
        
        // タブインスタンスを探す
        let instance = null;
        if (window.tabNavigator && window.tabNavigator.tabs) {
            instance = window.tabNavigator.tabs.get('detailed');
        }
        
        if (!instance) {
            // 新しいインスタンスを作成してチェック
            instance = new DetailedAnalysisTab();
        }
        
        return {
            instanceFound: !!instance,
            methods: {
                generateContent: typeof instance.generateContent === 'function',
                renderBalanceChart: typeof instance.renderBalanceChart === 'function',
                renderBalanceInterpretation: typeof instance.renderBalanceInterpretation === 'function',
                renderSynergyAnalysis: typeof instance.renderSynergyAnalysis === 'function',
                renderIntegratedSummary: typeof instance.renderIntegratedSummary === 'function',
                renderActionPlan: typeof instance.renderActionPlan === 'function',
                setData: typeof instance.setData === 'function'
            }
        };
    });
    
    if (methodsCheck.error) {
        console.log(`  ❌ ${methodsCheck.error}`);
    } else {
        console.log(`  Instance found: ${methodsCheck.instanceFound ? '✅' : '❌'}`);
        console.log('  Methods:');
        Object.entries(methodsCheck.methods).forEach(([method, exists]) => {
            console.log(`    ${method}: ${exists ? '✅' : '❌'}`);
        });
    }

    // 手動でレンダリングを試みる
    console.log('\n🎨 Step 7: 手動レンダリング試行');
    const renderResult = await page.evaluate(() => {
        try {
            // タブインスタンスを取得または作成
            let tab = window.tabNavigator?.tabs?.get('detailed');
            if (!tab && typeof DetailedAnalysisTab !== 'undefined') {
                tab = new DetailedAnalysisTab();
                tab.setData({
                    engineOS: { score: 75, hexagram: { name: '乾为天', symbol: '☰' } },
                    interfaceOS: { score: 82, hexagram: { name: '兌为泽', symbol: '☱' } },
                    safeModeOS: { score: 68, hexagram: { name: '坤为地', symbol: '☷' } }
                });
            }
            
            if (tab) {
                // 各レンダリングメソッドを試行
                const results = {};
                
                if (typeof tab.renderBalanceChart === 'function') {
                    try {
                        tab.renderBalanceChart();
                        results.chart = 'success';
                    } catch (e) {
                        results.chart = e.message;
                    }
                }
                
                if (typeof tab.renderBalanceInterpretation === 'function') {
                    try {
                        tab.renderBalanceInterpretation();
                        results.interpretation = 'success';
                    } catch (e) {
                        results.interpretation = e.message;
                    }
                }
                
                if (typeof tab.renderSynergyAnalysis === 'function') {
                    try {
                        tab.renderSynergyAnalysis();
                        results.synergy = 'success';
                    } catch (e) {
                        results.synergy = e.message;
                    }
                }
                
                return { success: true, results };
            }
            
            return { success: false, message: 'Tab instance not found' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    });
    
    console.log(`  レンダリング試行: ${renderResult.success ? '✅' : '❌'}`);
    if (renderResult.results) {
        Object.entries(renderResult.results).forEach(([method, result]) => {
            console.log(`    ${method}: ${result === 'success' ? '✅' : '❌ ' + result}`);
        });
    }

    // スクリーンショット
    await page.screenshot({ 
        path: 'phase2-review-screenshot.png', 
        fullPage: true 
    });
    console.log('\n📸 スクリーンショット: phase2-review-screenshot.png');

    // エラー確認
    console.log('\n❌ JavaScriptエラー:');
    if (errors.length > 0) {
        errors.slice(0, 5).forEach(err => console.log(`  - ${err.substring(0, 100)}`));
    } else {
        console.log('  なし ✅');
    }

    // 最終評価
    console.log('\n========== 評価 ==========');
    const score = {
        phase1: basicTabVisible.hasContent ? 30 : 0,
        tabStructure: detailsCheck.containerExists ? 20 : 0,
        chartLibrary: detailsCheck.chartJsLoaded ? 20 : 0,
        methods: methodsCheck.methods?.renderBalanceChart ? 30 : 0
    };
    
    const total = Object.values(score).reduce((a, b) => a + b, 0);
    
    console.log(`フェーズ1実装: ${score.phase1}/30点`);
    console.log(`タブ構造: ${score.tabStructure}/20点`);
    console.log(`Chart.js: ${score.chartLibrary}/20点`);
    console.log(`メソッド実装: ${score.methods}/30点`);
    console.log(`総合: ${total}/100点`);
    
    if (total >= 80) {
        console.log('\n🎉 実装は良好です');
    } else if (total >= 50) {
        console.log('\n⚠️ 部分的な実装です');
    } else {
        console.log('\n❌ 実装が不完全です');
    }

} finally {
    console.log('\n🌐 ブラウザを開いたままにします');
    console.log('終了するには Ctrl+C を押してください');
    await new Promise(() => {});
}