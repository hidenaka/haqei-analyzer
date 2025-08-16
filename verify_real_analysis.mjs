import { chromium } from 'playwright';

/**
 * 🔍 実際の分析結果が計算されて表示されているか検証
 * 固定文ではなく、回答に基づいた動的な結果か確認
 */

async function verifyRealAnalysis() {
    console.log('🔍 実際の分析結果検証テスト\n');
    console.log('=' .repeat(60));
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 50
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // コンソールログを監視
        const analysisLogs = [];
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('Triple') || text.includes('分析') || text.includes('Engine') || 
                text.includes('Interface') || text.includes('Safe') || text.includes('計算') ||
                text.includes('analyze') || text.includes('calculate')) {
                analysisLogs.push(text);
                console.log(`[LOG] ${text}`);
            }
        });
        
        console.log('【テスト1: 異なる回答パターンで結果が変わるか】\n');
        
        // パターン1: すべてA選択
        console.log('📝 パターン1: すべてA選択');
        await page.goto('http://localhost:8788/os_analyzer.html');
        await page.waitForTimeout(1000);
        await page.locator('#start-btn').click();
        await page.waitForTimeout(500);
        
        // 36問すべてAを選択
        for (let i = 0; i < 36; i++) {
            await page.locator('input[value="A"]').first().click();
            await page.waitForTimeout(20);
            if (i < 35) {
                await page.locator('#next-btn').click();
                await page.waitForTimeout(20);
            }
        }
        
        // 分析実行
        await page.locator('#next-btn').click();
        await page.waitForTimeout(5000);
        
        // 結果取得
        const pattern1Result = await page.evaluate(() => {
            const cards = document.querySelectorAll('.os-card, .os-result-card');
            const results = {};
            
            // DOMから表示内容を取得
            cards.forEach(card => {
                const name = card.querySelector('.os-name, .card-title, h3')?.textContent?.trim();
                const percentage = card.querySelector('.os-percentage, .percentage, .strength, .os-strength')?.textContent?.trim();
                const hexagram = card.querySelector('.os-hexagram-info span')?.textContent?.trim();
                if (name) {
                    results[name] = { percentage, hexagram };
                }
            });
            
            // 内部データも確認
            const analyzer = window.criticalCSSAnalyzer;
            const internalData = {};
            if (analyzer?.state?.tripleOSResults) {
                const tos = analyzer.state.tripleOSResults;
                if (tos.engineOS) internalData.engineOS = { strength: tos.engineOS.strength, hexagramId: tos.engineOS.hexagramId };
                if (tos.interfaceOS) internalData.interfaceOS = { strength: tos.interfaceOS.strength, hexagramId: tos.interfaceOS.hexagramId };
                if (tos.safeModeOS) internalData.safeModeOS = { strength: tos.safeModeOS.strength, hexagramId: tos.safeModeOS.hexagramId };
            }
            
            return { dom: results, internal: internalData };
        });
        
        console.log('パターン1結果（すべてA）:');
        console.log('  DOM表示:', JSON.stringify(pattern1Result.dom, null, 2));
        console.log('  内部データ:', JSON.stringify(pattern1Result.internal, null, 2));
        
        // スクリーンショット
        await page.screenshot({ path: 'analysis_pattern1_all_A.png', fullPage: false });
        
        // パターン2: すべてE選択
        console.log('\n📝 パターン2: すべてE選択');
        await page.goto('http://localhost:8788/os_analyzer.html');
        await page.waitForTimeout(1000);
        await page.locator('#start-btn').click();
        await page.waitForTimeout(500);
        
        // 36問すべてEを選択
        for (let i = 0; i < 36; i++) {
            await page.locator('input[value="E"]').first().click();
            await page.waitForTimeout(20);
            if (i < 35) {
                await page.locator('#next-btn').click();
                await page.waitForTimeout(20);
            }
        }
        
        // 分析実行
        await page.locator('#next-btn').click();
        await page.waitForTimeout(5000);
        
        // 結果取得
        const pattern2Result = await page.evaluate(() => {
            const cards = document.querySelectorAll('.os-card, .os-result-card');
            const results = {};
            
            cards.forEach(card => {
                const name = card.querySelector('.os-name, .card-title, h3')?.textContent?.trim();
                const percentage = card.querySelector('.os-percentage, .percentage, .strength, .os-strength')?.textContent?.trim();
                const hexagram = card.querySelector('.os-hexagram-info span')?.textContent?.trim();
                if (name) {
                    results[name] = { percentage, hexagram };
                }
            });
            
            const analyzer = window.criticalCSSAnalyzer;
            const internalData = {};
            if (analyzer?.state?.tripleOSResults) {
                const tos = analyzer.state.tripleOSResults;
                if (tos.engineOS) internalData.engineOS = { strength: tos.engineOS.strength, hexagramId: tos.engineOS.hexagramId };
                if (tos.interfaceOS) internalData.interfaceOS = { strength: tos.interfaceOS.strength, hexagramId: tos.interfaceOS.hexagramId };
                if (tos.safeModeOS) internalData.safeModeOS = { strength: tos.safeModeOS.strength, hexagramId: tos.safeModeOS.hexagramId };
            }
            
            return { dom: results, internal: internalData };
        });
        
        console.log('パターン2結果（すべてE）:');
        console.log('  DOM表示:', JSON.stringify(pattern2Result.dom, null, 2));
        console.log('  内部データ:', JSON.stringify(pattern2Result.internal, null, 2));
        
        // スクリーンショット
        await page.screenshot({ path: 'analysis_pattern2_all_E.png', fullPage: false });
        
        // パターン3: ランダム選択
        console.log('\n📝 パターン3: ランダム選択');
        await page.goto('http://localhost:8788/os_analyzer.html');
        await page.waitForTimeout(1000);
        await page.locator('#start-btn').click();
        await page.waitForTimeout(500);
        
        // ランダムに選択
        for (let i = 0; i < 36; i++) {
            const options = ['A', 'B', 'C', 'D', 'E'];
            const randomOption = options[Math.floor(Math.random() * options.length)];
            await page.locator(`input[value="${randomOption}"]`).first().click();
            await page.waitForTimeout(20);
            if (i < 35) {
                await page.locator('#next-btn').click();
                await page.waitForTimeout(20);
            }
        }
        
        // 分析実行
        await page.locator('#next-btn').click();
        await page.waitForTimeout(5000);
        
        // 結果取得
        const pattern3Result = await page.evaluate(() => {
            const cards = document.querySelectorAll('.os-card, .os-result-card');
            const results = {};
            
            cards.forEach(card => {
                const name = card.querySelector('.os-name, .card-title, h3')?.textContent?.trim();
                const percentage = card.querySelector('.os-percentage, .percentage, .strength, .os-strength')?.textContent?.trim();
                const hexagram = card.querySelector('.os-hexagram-info span')?.textContent?.trim();
                if (name) {
                    results[name] = { percentage, hexagram };
                }
            });
            
            const analyzer = window.criticalCSSAnalyzer;
            const internalData = {};
            if (analyzer?.state?.tripleOSResults) {
                const tos = analyzer.state.tripleOSResults;
                if (tos.engineOS) internalData.engineOS = { strength: tos.engineOS.strength, hexagramId: tos.engineOS.hexagramId };
                if (tos.interfaceOS) internalData.interfaceOS = { strength: tos.interfaceOS.strength, hexagramId: tos.interfaceOS.hexagramId };
                if (tos.safeModeOS) internalData.safeModeOS = { strength: tos.safeModeOS.strength, hexagramId: tos.safeModeOS.hexagramId };
            }
            
            return { dom: results, internal: internalData };
        });
        
        console.log('パターン3結果（ランダム）:');
        console.log('  DOM表示:', JSON.stringify(pattern3Result.dom, null, 2));
        console.log('  内部データ:', JSON.stringify(pattern3Result.internal, null, 2));
        
        // スクリーンショット
        await page.screenshot({ path: 'analysis_pattern3_random.png', fullPage: false });
        
        // 分析ログ確認
        console.log('\n【分析関連ログ】');
        console.log(`収集されたログ数: ${analysisLogs.length}`);
        if (analysisLogs.length > 0) {
            console.log('最初の5件:');
            analysisLogs.slice(0, 5).forEach(log => console.log(`  - ${log}`));
        }
        
        // 結果の比較
        console.log('\n' + '=' .repeat(60));
        console.log('【検証結果】');
        console.log('=' .repeat(60));
        
        // パターン間の違いをチェック
        const hasInternalData = pattern1Result.internal.engineOS || pattern2Result.internal.engineOS || pattern3Result.internal.engineOS;
        const hasDOMData = Object.keys(pattern1Result.dom).length > 0 || Object.keys(pattern2Result.dom).length > 0;
        
        // 結果が異なるかチェック
        const pattern1JSON = JSON.stringify(pattern1Result);
        const pattern2JSON = JSON.stringify(pattern2Result);
        const pattern3JSON = JSON.stringify(pattern3Result);
        
        const resultsAreDifferent = pattern1JSON !== pattern2JSON || pattern2JSON !== pattern3JSON;
        
        console.log(`\n内部データ存在: ${hasInternalData ? '✅ あり' : '❌ なし'}`);
        console.log(`DOM表示データ: ${hasDOMData ? '✅ あり' : '❌ なし'}`);
        console.log(`パターン間の違い: ${resultsAreDifferent ? '✅ 異なる（動的）' : '❌ 同じ（固定）'}`);
        
        if (!hasInternalData && !hasDOMData) {
            console.log('\n❌ 問題: 分析結果が生成されていません');
        } else if (!resultsAreDifferent) {
            console.log('\n⚠️ 警告: すべてのパターンで同じ結果（固定文の可能性）');
        } else {
            console.log('\n✅ 正常: 回答に応じて異なる結果が生成されています');
        }
        
        // 実際の数値があるかチェック
        const hasActualNumbers = pattern1Result.internal.engineOS?.strength > 0 || 
                                pattern2Result.internal.engineOS?.strength > 0;
        
        console.log(`実際の数値計算: ${hasActualNumbers ? '✅ あり' : '❌ なし（N/Aまたは0）'}`);
        
        return {
            hasInternalData,
            hasDOMData,
            resultsAreDifferent,
            hasActualNumbers,
            patterns: {
                pattern1: pattern1Result,
                pattern2: pattern2Result,
                pattern3: pattern3Result
            }
        };
        
    } catch (error) {
        console.error('❌ エラー:', error.message);
        return { error: error.message };
    } finally {
        console.log('\n📸 スクリーンショット保存:');
        console.log('  - analysis_pattern1_all_A.png');
        console.log('  - analysis_pattern2_all_E.png');
        console.log('  - analysis_pattern3_random.png');
        console.log('\n⚠️ ブラウザは開いたままです。');
    }
}

// 実行
verifyRealAnalysis()
    .then(result => {
        console.log('\n' + '=' .repeat(60));
        console.log('🏁 検証完了');
        console.log('=' .repeat(60));
        
        if (result.hasActualNumbers && result.resultsAreDifferent) {
            console.log('\n✅ 実装確認: 実際の分析計算が行われています');
        } else {
            console.log('\n❌ 問題確認: 固定文または計算が行われていない可能性があります');
        }
    })
    .catch(error => {
        console.error('❌ 致命的エラー:', error);
    });