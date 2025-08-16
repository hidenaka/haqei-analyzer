import { chromium } from 'playwright';

/**
 * 🎯 実際の分析結果確認テスト - フォールバックではなく実データを確認
 */

async function realAnalysisTest() {
    console.log('🎯 実際の分析結果確認テスト開始\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 30  // 超高速
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        const analysisLogs = [];
        
        // コンソールメッセージ監視（特に分析関連）
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('Triple OS') || text.includes('Engine OS') || 
                text.includes('Interface OS') || text.includes('Safe Mode OS') ||
                text.includes('analyzeTripleOS') || text.includes('DEBUG')) {
                analysisLogs.push(text);
                console.log(`[ANALYSIS] ${text}`);
            }
        });
        
        // 1. ページロード
        console.log('📡 ページロード中...');
        await page.goto('http://localhost:8788/os_analyzer.html');
        await page.waitForTimeout(2000);
        
        // 2. 分析開始
        console.log('🖱️ 分析開始...');
        await page.locator('#start-btn').click();
        await page.waitForTimeout(500);
        
        // 3. 36問に超高速回答
        console.log('\n📝 36問に超高速回答中...');
        for (let i = 1; i <= 36; i++) {
            // 選択肢を選択（異なる選択肢を選ぶことで多様な結果を得る）
            const optionIndex = i % 5; // 0-4の範囲で選択肢を変える
            const options = await page.locator('.option').all();
            if (options[optionIndex]) {
                await options[optionIndex].click();
            } else {
                await page.locator('.option').first().click();
            }
            await page.waitForTimeout(30);
            
            // 次へボタン
            if (i < 36) {
                const nextBtn = page.locator('#next-btn');
                await nextBtn.click();
            } else {
                await page.locator('#next-btn').click();
            }
            await page.waitForTimeout(30);
            
            if (i % 9 === 0) {
                console.log(`  進捗: ${i}/36`);
            }
        }
        
        console.log('✅ 36問完了');
        
        // 4. 分析処理を待機（重要：実際の分析が完了するまで待つ）
        console.log('\n⏳ 分析処理待機中（実際の計算）...');
        await page.waitForTimeout(10000); // 10秒待機
        
        // 5. 実際の分析結果を取得
        console.log('\n🔍 実際の分析結果取得中...\n');
        
        const analysisResults = await page.evaluate(() => {
            const results = {
                osCards: [],
                rawData: {},
                debugInfo: {}
            };
            
            // OSカードから実データを取得
            const cards = document.querySelectorAll('.os-card, .os-result-card');
            cards.forEach((card, index) => {
                const osName = card.querySelector('.os-name, .card-title, h3')?.textContent?.trim();
                const percentage = card.querySelector('.os-percentage, .percentage, .strength')?.textContent?.trim();
                const hexagramInfo = card.querySelector('.os-hexagram-info span')?.textContent?.trim();
                const hexagramName = card.querySelectorAll('.os-hexagram-info span')[1]?.textContent?.trim();
                
                // エネルギーバーからbaguaEnergiesを取得
                const energyBars = {};
                card.querySelectorAll('.energy-bar').forEach(bar => {
                    const label = bar.querySelector('.energy-label')?.textContent?.trim();
                    const value = bar.querySelector('.energy-value')?.textContent?.trim();
                    if (label && value) {
                        energyBars[label] = value;
                    }
                });
                
                results.osCards.push({
                    index: index,
                    name: osName,
                    percentage: percentage,
                    hexagramId: hexagramInfo,
                    hexagramName: hexagramName,
                    baguaEnergies: energyBars
                });
            });
            
            // グローバル変数から実データを取得（デバッグ用）
            if (window.currentAnalyzer) {
                results.debugInfo.hasAnalyzer = true;
                if (window.currentAnalyzer.state && window.currentAnalyzer.state.tripleOSResults) {
                    results.rawData = window.currentAnalyzer.state.tripleOSResults;
                }
            }
            
            // コンテナの存在確認
            results.debugInfo.containerExists = !!document.getElementById('os-cards-container');
            results.debugInfo.containerChildren = document.getElementById('os-cards-container')?.children.length || 0;
            results.debugInfo.resultsScreenVisible = document.getElementById('results-screen')?.classList.contains('active');
            
            return results;
        });
        
        // 6. 結果表示
        console.log('=== 実際の分析結果 ===\n');
        
        if (analysisResults.osCards.length > 0) {
            console.log('📊 Triple OSカード情報:');
            analysisResults.osCards.forEach(card => {
                console.log(`\n  ${card.name}:`);
                console.log(`    強度: ${card.percentage}`);
                console.log(`    易卦: ${card.hexagramId} ${card.hexagramName || ''}`);
                if (Object.keys(card.baguaEnergies).length > 0) {
                    console.log('    八卦エネルギー:');
                    Object.entries(card.baguaEnergies).forEach(([bagua, energy]) => {
                        console.log(`      ${bagua}: ${energy}`);
                    });
                }
            });
        } else {
            console.log('❌ OSカードが表示されていません');
        }
        
        if (analysisResults.rawData && Object.keys(analysisResults.rawData).length > 0) {
            console.log('\n📋 生データ（内部状態）:');
            if (analysisResults.rawData.engineOS) {
                console.log('  Engine OS:', {
                    strength: analysisResults.rawData.engineOS.strength,
                    hexagramId: analysisResults.rawData.engineOS.hexagramId,
                    hexagramName: analysisResults.rawData.engineOS.hexagramName
                });
            }
            if (analysisResults.rawData.interfaceOS) {
                console.log('  Interface OS:', {
                    strength: analysisResults.rawData.interfaceOS.strength,
                    hexagramId: analysisResults.rawData.interfaceOS.hexagramId,
                    hexagramName: analysisResults.rawData.interfaceOS.hexagramName
                });
            }
            if (analysisResults.rawData.safeModeOS) {
                console.log('  Safe Mode OS:', {
                    strength: analysisResults.rawData.safeModeOS.strength,
                    hexagramId: analysisResults.rawData.safeModeOS.hexagramId,
                    hexagramName: analysisResults.rawData.safeModeOS.hexagramName
                });
            }
        }
        
        console.log('\n🔍 デバッグ情報:');
        console.log('  コンテナ存在:', analysisResults.debugInfo.containerExists);
        console.log('  子要素数:', analysisResults.debugInfo.containerChildren);
        console.log('  結果画面表示:', analysisResults.debugInfo.resultsScreenVisible);
        console.log('  分析ログ数:', analysisLogs.length);
        
        // スクリーンショット
        await page.screenshot({ 
            path: 'real_analysis_result_20250816.png',
            fullPage: false 
        });
        console.log('\n📸 スクリーンショット保存: real_analysis_result_20250816.png');
        
        // 判定
        const hasRealData = analysisResults.osCards.some(card => 
            card.percentage && card.percentage !== 'N/A' && card.percentage !== '0%'
        );
        
        if (hasRealData) {
            console.log('\n✅ 実際の分析データが表示されています！');
        } else {
            console.log('\n⚠️ 分析データが正しく表示されていない可能性があります');
        }
        
        return {
            success: hasRealData,
            osCards: analysisResults.osCards,
            debugInfo: analysisResults.debugInfo
        };
        
    } catch (error) {
        console.error('❌ テストエラー:', error.message);
        return { success: false, error: error.message };
    } finally {
        console.log('\n⚠️ ブラウザは開いたままです。手動確認してください。');
    }
}

// 実行
realAnalysisTest()
    .then(result => {
        console.log('\n' + '='.repeat(50));
        if (result.success) {
            console.log('🎉 実際の分析結果が正常に表示されています！');
        } else {
            console.log('❌ 分析結果の表示に問題があります');
        }
        console.log('='.repeat(50));
    })
    .catch(error => {
        console.error('❌ 致命的エラー:', error);
    });