import { chromium } from 'playwright';

/**
 * 🔧 分析ロジック修正後の検証
 */

async function verifyAnalysisFix() {
    console.log('🔧 分析ロジック修正後の検証\n');
    console.log('=' .repeat(60));
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 30
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // エラーログとコンソールログを監視
        const errorLogs = [];
        const analysisLogs = [];
        
        page.on('console', msg => {
            const text = msg.text();
            if (msg.type() === 'error' || text.includes('Error') || text.includes('❌')) {
                errorLogs.push(text);
                console.log(`[ERROR] ${text}`);
            } else if (text.includes('Triple') || text.includes('分析') || text.includes('ExpressionGenerator') || 
                      text.includes('TripleOSInteractionAnalyzer') || text.includes('strength') || text.includes('percentage')) {
                analysisLogs.push(text);
                console.log(`[ANALYSIS] ${text}`);
            }
        });
        
        // ページエラーも監視
        page.on('pageerror', err => {
            errorLogs.push(err.message);
            console.error('[PAGE ERROR]', err.message);
        });
        
        console.log('【修正確認テスト】');
        
        // 1. ページロード
        console.log('\n📡 ページロード...');
        await page.goto('http://localhost:8788/os_analyzer.html');
        await page.waitForTimeout(2000);
        
        // 2. 分析開始
        console.log('🖱️ 分析開始...');
        await page.locator('#start-btn').click();
        await page.waitForTimeout(500);
        
        // 3. 固定パターンで回答（エラー確認）
        console.log('\n📝 36問回答中...');
        for (let i = 0; i < 36; i++) {
            await page.locator('input[value="A"]').first().click();
            await page.waitForTimeout(20);
            if (i < 35) {
                await page.locator('#next-btn').click();
                await page.waitForTimeout(20);
            }
        }
        
        // 4. 分析実行
        console.log('\n🔄 分析実行...');
        await page.locator('#next-btn').click();
        console.log('⏳ 分析処理中（エラーログを確認中）...');
        await page.waitForTimeout(8000);
        
        // 5. 分析結果の詳細確認
        console.log('\n📊 分析結果の詳細確認...');
        
        const analysisResults = await page.evaluate(() => {
            // DOM要素から詳細データを取得
            const cards = document.querySelectorAll('.os-card, .os-result-card');
            const results = {};
            
            cards.forEach(card => {
                const name = card.querySelector('.os-name, .card-title, h3')?.textContent?.trim();
                const percentage = card.querySelector('.os-percentage, .percentage, .strength, .os-strength')?.textContent?.trim();
                const hexagram = card.querySelector('.os-hexagram-info span')?.textContent?.trim();
                const hexagramName = card.querySelectorAll('.os-hexagram-info span')[1]?.textContent?.trim();
                
                // エネルギーバーの値も取得
                const energyBars = {};
                card.querySelectorAll('.energy-bar').forEach(bar => {
                    const label = bar.querySelector('.energy-label')?.textContent?.trim();
                    const value = bar.querySelector('.energy-value')?.textContent?.trim();
                    if (label && value) {
                        energyBars[label] = value;
                    }
                });
                
                if (name) {
                    results[name] = { 
                        percentage, 
                        hexagram, 
                        hexagramName,
                        energyBars,
                        hasRealData: percentage && percentage !== 'N/A' && percentage !== '0%'
                    };
                }
            });
            
            // 内部データも確認
            const analyzer = window.criticalCSSAnalyzer;
            const internalData = {};
            if (analyzer?.state?.tripleOSResults) {
                const tos = analyzer.state.tripleOSResults;
                internalData.engineOS = {
                    strength: tos.engineOS?.strength,
                    percentage: tos.engineOS?.percentage,
                    hexagramId: tos.engineOS?.hexagramId,
                    hasRealStrength: tos.engineOS?.strength > 0
                };
                internalData.interfaceOS = {
                    strength: tos.interfaceOS?.strength,
                    percentage: tos.interfaceOS?.percentage,
                    hexagramId: tos.interfaceOS?.hexagramId,
                    hasRealStrength: tos.interfaceOS?.strength > 0
                };
                internalData.safeModeOS = {
                    strength: tos.safeModeOS?.strength,
                    percentage: tos.safeModeOS?.percentage,
                    hexagramId: tos.safeModeOS?.hexagramId,
                    hasRealStrength: tos.safeModeOS?.strength > 0
                };
            }
            
            return { domResults: results, internalData };
        });
        
        // 6. 結果表示
        console.log('\n=== 修正後の分析結果 ===');
        
        // エラー確認
        console.log(`\nエラーログ数: ${errorLogs.length}`);
        if (errorLogs.length > 0) {
            console.log('発生したエラー:');
            errorLogs.slice(0, 3).forEach((err, i) => {
                console.log(`  ${i + 1}. ${err}`);
            });
        }
        
        // DOM結果
        console.log('\nDOM表示結果:');
        Object.entries(analysisResults.domResults).forEach(([name, data]) => {
            console.log(`  ${name}:`);
            console.log(`    強度: ${data.percentage || 'N/A'}`);
            console.log(`    易卦: ${data.hexagram || 'N/A'} ${data.hexagramName || ''}`);
            console.log(`    実データ: ${data.hasRealData ? '✅ あり' : '❌ なし'}`);
        });
        
        // 内部データ
        if (analysisResults.internalData.engineOS) {
            console.log('\n内部計算データ:');
            ['engineOS', 'interfaceOS', 'safeModeOS'].forEach(osType => {
                const data = analysisResults.internalData[osType];
                if (data) {
                    console.log(`  ${osType}:`);
                    console.log(`    強度: ${data.strength || 'N/A'}`);
                    console.log(`    パーセンテージ: ${data.percentage || 'N/A'}`);
                    console.log(`    易卦ID: ${data.hexagramId || 'N/A'}`);
                    console.log(`    実計算: ${data.hasRealStrength ? '✅ あり' : '❌ なし'}`);
                }
            });
        }
        
        // 7. 判定
        const hasRealDOMData = Object.values(analysisResults.domResults).some(d => d.hasRealData);
        const hasRealInternalData = analysisResults.internalData.engineOS?.hasRealStrength;
        const noInitializationErrors = !errorLogs.some(err => err.includes('options is not defined') || err.includes('ExpressionGenerator'));
        
        console.log('\n=== 修正効果判定 ===');
        console.log(`初期化エラー解決: ${noInitializationErrors ? '✅ 成功' : '❌ 未解決'}`);
        console.log(`DOM実データ表示: ${hasRealDOMData ? '✅ 成功' : '❌ 未解決'}`);
        console.log(`内部実計算: ${hasRealInternalData ? '✅ 成功' : '❌ 未解決'}`);
        
        // スクリーンショット
        await page.screenshot({ 
            path: 'analysis_fix_verification_20250816.png',
            fullPage: false 
        });
        
        return {
            errorCount: errorLogs.length,
            noInitializationErrors,
            hasRealDOMData,
            hasRealInternalData,
            domResults: analysisResults.domResults,
            internalData: analysisResults.internalData
        };
        
    } catch (error) {
        console.error('❌ テストエラー:', error.message);
        return { error: error.message };
    } finally {
        console.log('\n📸 スクリーンショット: analysis_fix_verification_20250816.png');
        console.log('⚠️ ブラウザは開いたままです。');
    }
}

// 実行
verifyAnalysisFix()
    .then(result => {
        console.log('\n' + '=' .repeat(60));
        console.log('🏁 修正検証完了');
        console.log('=' .repeat(60));
        
        if (result.noInitializationErrors && result.hasRealInternalData) {
            console.log('\n🎉 修正成功！実際の分析計算が動作しています！');
        } else if (result.noInitializationErrors) {
            console.log('\n✅ 初期化エラーは解決しましたが、まだ計算ロジックに問題があります');
        } else {
            console.log('\n❌ まだ初期化エラーが残っています');
        }
    })
    .catch(error => {
        console.error('❌ 致命的エラー:', error);
    });