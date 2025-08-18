// 自動検証スクリプト
// future_simulator.htmlの実際の動作を検証

const puppeteer = require('puppeteer');

async function verifyIntegration() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    console.log('🔍 検証開始...\n');
    
    // ページを開く
    await page.goto('file://' + __dirname + '/public/future_simulator.html');
    await page.waitForTimeout(2000);
    
    // 1. DataDrivenAnalyzer初期化チェック
    console.log('📋 チェック1: DataDrivenAnalyzer初期化');
    const analyzerCheck = await page.evaluate(() => {
        return {
            hasH384: typeof window.H384_DATA !== 'undefined',
            h384Length: window.H384_DATA ? window.H384_DATA.length : 0,
            hasAnalyzer: typeof window.dataAnalyzer !== 'undefined',
            analyzerReady: window.dataAnalyzer ? !!window.dataAnalyzer.keywordMap : false
        };
    });
    
    console.log('  H384_DATA loaded:', analyzerCheck.hasH384 ? `✅ (${analyzerCheck.h384Length} entries)` : '❌');
    console.log('  DataDrivenAnalyzer:', analyzerCheck.hasAnalyzer ? '✅' : '❌');
    console.log('  Analyzer Ready:', analyzerCheck.analyzerReady ? '✅' : '❌');
    console.log('');
    
    // 2. 進爻生成テスト
    console.log('📋 チェック2: 進爻生成（スコアベース）');
    const jinTest = await page.evaluate(() => {
        if (!window.dataAnalyzer) return { error: 'Analyzer not found' };
        
        try {
            const result = window.dataAnalyzer.generateJinConnection(11, '初九', 11, '九二');
            return {
                success: true,
                result: result,
                hasScore: result.includes('スコア') || result.includes('ポイント'),
                hasInterpretation: result.includes('現代解釈') || result.includes('状況')
            };
        } catch (e) {
            return { error: e.message };
        }
    });
    
    if (jinTest.success) {
        console.log('  生成成功:', '✅');
        console.log('  スコア情報:', jinTest.hasScore ? '✅' : '❌');
        console.log('  解釈情報:', jinTest.hasInterpretation ? '✅' : '❌');
        console.log('  出力例:', jinTest.result.substring(0, 100) + '...');
    } else {
        console.log('  エラー:', jinTest.error);
    }
    console.log('');
    
    // 3. 変爻生成テスト
    console.log('📋 チェック3: 変爻生成（スコアベース）');
    const hengTest = await page.evaluate(() => {
        if (!window.dataAnalyzer) return { error: 'Analyzer not found' };
        
        try {
            const result = window.dataAnalyzer.generateHengShift(11, '初九', 18, '初六');
            return {
                success: true,
                result: result,
                hasVolatility: result.includes('変動性'),
                hasPotential: result.includes('ポテンシャル')
            };
        } catch (e) {
            return { error: e.message };
        }
    });
    
    if (hengTest.success) {
        console.log('  生成成功:', '✅');
        console.log('  変動性分析:', hengTest.hasVolatility ? '✅' : '❌');
        console.log('  ポテンシャル分析:', hengTest.hasPotential ? '✅' : '❌');
        console.log('  出力例:', hengTest.result.substring(0, 100) + '...');
    } else {
        console.log('  エラー:', hengTest.error);
    }
    console.log('');
    
    // 4. 実際のシナリオ生成テスト
    console.log('📋 チェック4: 実際のシナリオ生成');
    
    // テキスト入力
    await page.type('#worryInput', '仕事で新しいプロジェクトを任されたが、自信がない');
    
    // ボタンクリック
    await page.click('#generateButton');
    await page.waitForTimeout(2000);
    
    // 結果確認
    const scenarioCheck = await page.evaluate(() => {
        const resultsDiv = document.getElementById('resultsDiv');
        const scenarios = document.querySelectorAll('.scenario-card');
        
        // 最初のシナリオの説明を取得
        let firstDescription = '';
        if (scenarios.length > 0) {
            const descEl = scenarios[0].querySelector('.scenario-description');
            firstDescription = descEl ? descEl.textContent : '';
        }
        
        return {
            hasResults: resultsDiv && resultsDiv.innerHTML.length > 0,
            scenarioCount: scenarios.length,
            firstDescription: firstDescription,
            hasDataDrivenContent: firstDescription.includes('スコア') || 
                                  firstDescription.includes('ポイント') ||
                                  firstDescription.includes('評価')
        };
    });
    
    console.log('  結果表示:', scenarioCheck.hasResults ? '✅' : '❌');
    console.log('  シナリオ数:', scenarioCheck.scenarioCount);
    console.log('  データ駆動型説明:', scenarioCheck.hasDataDrivenContent ? '✅' : '❌');
    if (scenarioCheck.firstDescription) {
        console.log('  説明例:', scenarioCheck.firstDescription.substring(0, 100) + '...');
    }
    console.log('');
    
    // 5. 総合評価
    console.log('📊 総合評価');
    const allChecks = [
        analyzerCheck.hasAnalyzer,
        jinTest.success && jinTest.hasScore,
        hengTest.success && (hengTest.hasVolatility || hengTest.hasPotential),
        scenarioCheck.hasResults && scenarioCheck.scenarioCount === 8
    ];
    
    const passedChecks = allChecks.filter(c => c).length;
    const totalChecks = allChecks.length;
    const percentage = Math.round((passedChecks / totalChecks) * 100);
    
    console.log(`  合格項目: ${passedChecks}/${totalChecks}`);
    console.log(`  達成率: ${percentage}%`);
    
    if (percentage === 100) {
        console.log('\n✅ 完璧！DataDrivenAnalyzerが正常に統合され、動作しています。');
    } else if (percentage >= 75) {
        console.log('\n⚠️ ほぼ完成。一部の機能に問題があります。');
    } else {
        console.log('\n❌ 統合に問題があります。修正が必要です。');
    }
    
    await browser.close();
}

// 実行
verifyIntegration().catch(console.error);