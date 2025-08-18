import { chromium } from 'playwright';

/**
 * 🔍 N/A表示問題の根本原因調査
 * 各問題について5WHY分析を実施
 */

async function investigateDisplayIssues() {
    console.log('🔍 N/A表示問題の根本原因調査\n');
    console.log('=' .repeat(60));
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 50
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // 分析ログ収集
        const analysisLogs = [];
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('strength') || text.includes('percentage') || text.includes('hexagram') || 
                text.includes('Triple') || text.includes('result') || text.includes('display')) {
                analysisLogs.push(text);
                console.log(`[LOG] ${text}`);
            }
        });
        
        console.log('【段階的原因調査】\n');
        
        // 1. 基本的な分析実行
        console.log('1. 基本分析実行...');
        await page.goto('http://localhost:8788/os_analyzer.html');
        await page.waitForTimeout(1000);
        await page.locator('#start-btn').click();
        await page.waitForTimeout(300);
        
        // 簡単な回答
        for (let i = 0; i < 36; i++) {
            await page.locator('input[value="A"]').first().click();
            await page.waitForTimeout(10);
            if (i < 35) {
                await page.locator('#next-btn').click();
                await page.waitForTimeout(10);
            }
        }
        
        await page.locator('#next-btn').click();
        await page.waitForTimeout(5000);
        
        // 2. 分析結果の詳細調査
        console.log('\n2. 分析結果データ構造調査...');
        
        const dataInvestigation = await page.evaluate(() => {
            const investigation = {
                step1_analyzerExists: !!window.criticalCSSAnalyzer,
                step2_stateExists: !!window.criticalCSSAnalyzer?.state,
                step3_tripleOSResultsExists: !!window.criticalCSSAnalyzer?.state?.tripleOSResults,
                step4_rawTripleOSData: null,
                step5_domElements: {},
                step6_displayProcess: {}
            };
            
            // Step 4: 生データ確認
            if (window.criticalCSSAnalyzer?.state?.tripleOSResults) {
                const tos = window.criticalCSSAnalyzer.state.tripleOSResults;
                investigation.step4_rawTripleOSData = {
                    engineOS: {
                        exists: !!tos.engineOS,
                        strength: tos.engineOS?.strength,
                        percentage: tos.engineOS?.percentage,
                        hexagramId: tos.engineOS?.hexagramId,
                        hexagramName: tos.engineOS?.hexagramName,
                        name: tos.engineOS?.name,
                        keys: tos.engineOS ? Object.keys(tos.engineOS) : []
                    },
                    interfaceOS: {
                        exists: !!tos.interfaceOS,
                        strength: tos.interfaceOS?.strength,
                        percentage: tos.interfaceOS?.percentage,
                        hexagramId: tos.interfaceOS?.hexagramId,
                        hexagramName: tos.interfaceOS?.hexagramName,
                        name: tos.interfaceOS?.name,
                        keys: tos.interfaceOS ? Object.keys(tos.interfaceOS) : []
                    },
                    safeModeOS: {
                        exists: !!tos.safeModeOS,
                        strength: tos.safeModeOS?.strength,
                        percentage: tos.safeModeOS?.percentage,
                        hexagramId: tos.safeModeOS?.hexagramId,
                        hexagramName: tos.safeModeOS?.hexagramName,
                        name: tos.safeModeOS?.name,
                        keys: tos.safeModeOS ? Object.keys(tos.safeModeOS) : []
                    }
                };
            }
            
            // Step 5: DOM要素の確認
            const cards = document.querySelectorAll('.os-card, .os-result-card');
            cards.forEach((card, index) => {
                const cardInfo = {
                    index,
                    exists: true,
                    innerHTML: card.innerHTML.substring(0, 200),
                    elements: {}
                };
                
                // 各要素の存在確認
                const selectors = [
                    '.os-name', '.card-title', 'h3',
                    '.os-percentage', '.percentage', '.strength', '.os-strength',
                    '.os-hexagram-info', '.hexagram-id', '.hexagram-name'
                ];
                
                selectors.forEach(selector => {
                    const element = card.querySelector(selector);
                    cardInfo.elements[selector] = {
                        exists: !!element,
                        textContent: element?.textContent?.trim(),
                        innerHTML: element?.innerHTML
                    };
                });
                
                investigation.step5_domElements[`card${index}`] = cardInfo;
            });
            
            // Step 6: 表示プロセスの確認
            investigation.step6_displayProcess = {
                resultsScreenActive: document.getElementById('results-screen')?.classList.contains('active'),
                osCardsContainerExists: !!document.getElementById('os-cards-container'),
                osCardsContainerChildren: document.getElementById('os-cards-container')?.children.length || 0
            };
            
            return investigation;
        });
        
        // 3. 結果分析とWHY分析
        console.log('\n3. 根本原因分析（5WHY）...\n');
        
        // 分析結果を表示
        console.log('=== データ構造調査結果 ===');
        console.log(`Step1 - Analyzer存在: ${dataInvestigation.step1_analyzerExists ? '✅' : '❌'}`);
        console.log(`Step2 - State存在: ${dataInvestigation.step2_stateExists ? '✅' : '❌'}`);
        console.log(`Step3 - TripleOS結果存在: ${dataInvestigation.step3_tripleOSResultsExists ? '✅' : '❌'}`);
        
        if (dataInvestigation.step4_rawTripleOSData) {
            console.log('\nStep4 - 生データ詳細:');
            ['engineOS', 'interfaceOS', 'safeModeOS'].forEach(osType => {
                const data = dataInvestigation.step4_rawTripleOSData[osType];
                console.log(`  ${osType}:`);
                console.log(`    存在: ${data.exists ? '✅' : '❌'}`);
                console.log(`    強度: ${data.strength} (type: ${typeof data.strength})`);
                console.log(`    パーセンテージ: ${data.percentage} (type: ${typeof data.percentage})`);
                console.log(`    易卦ID: ${data.hexagramId} (type: ${typeof data.hexagramId})`);
                console.log(`    易卦名: ${data.hexagramName} (type: ${typeof data.hexagramName})`);
                console.log(`    利用可能キー: [${data.keys?.join(', ')}]`);
            });
        }
        
        console.log('\nStep5 - DOM要素詳細:');
        Object.entries(dataInvestigation.step5_domElements).forEach(([cardName, cardInfo]) => {
            console.log(`  ${cardName}:`);
            
            // 重要な要素のチェック
            const importantSelectors = ['.os-name', '.os-percentage', '.os-hexagram-info'];
            importantSelectors.forEach(selector => {
                const element = cardInfo.elements[selector];
                if (element) {
                    console.log(`    ${selector}: ${element.exists ? '存在' : '不存在'} - "${element.textContent}"`);
                }
            });
        });
        
        console.log('\nStep6 - 表示プロセス:');
        console.log(`  結果画面アクティブ: ${dataInvestigation.step6_displayProcess.resultsScreenActive ? '✅' : '❌'}`);
        console.log(`  OSカードコンテナ: ${dataInvestigation.step6_displayProcess.osCardsContainerExists ? '✅' : '❌'}`);
        console.log(`  カード数: ${dataInvestigation.step6_displayProcess.osCardsContainerChildren}`);
        
        // 4. 5WHY分析の実行
        console.log('\n=== 5WHY根本原因分析 ===\n');
        
        // 問題1: N/A表示問題
        console.log('【問題1: パーセンテージがN/A表示】');
        const hasRealPercentage = dataInvestigation.step4_rawTripleOSData?.engineOS?.percentage > 0;
        
        if (hasRealPercentage) {
            console.log('Why1: なぜN/Aが表示される？ → 生データは存在するがDOM反映されない');
            console.log('Why2: なぜDOM反映されない？ → 表示処理で適切なセレクタが使われていない');
            console.log('Why3: なぜ適切なセレクタでない？ → DOMとデータの連携部分の実装不足');
            console.log('Why4: なぜ連携実装不足？ → 表示ロジックが開発途中で止まっている');
            console.log('Why5: なぜ途中で止まった？ → 分析エンジン修正に注力し、表示部分が後回しになった');
            console.log('→ 対策: 生データをDOM要素に反映する処理を実装');
        } else {
            console.log('Why1: なぜN/Aが表示される？ → 生データ自体が空/undefined');
            console.log('Why2: なぜ生データが空？ → 分析結果の計算処理に問題');
            console.log('Why3: なぜ計算処理に問題？ → 分析エンジンから戻り値が正しく設定されていない');
            console.log('Why4: なぜ戻り値設定されない？ → 分析関数の戻り値の構造が期待と異なる');
            console.log('Why5: なぜ構造が異なる？ → 分析エンジンと表示部分の仕様の不一致');
            console.log('→ 対策: 分析エンジンの戻り値構造を確認・修正');
        }
        
        // 問題2: 易卦情報表示問題
        console.log('\n【問題2: 易卦情報がN/A表示】');
        const hasRealHexagram = dataInvestigation.step4_rawTripleOSData?.engineOS?.hexagramId > 0;
        
        if (hasRealHexagram) {
            console.log('Why1: なぜ易卦がN/A表示？ → 易卦IDは存在するが名前が取得できない');
            console.log('Why2: なぜ名前取得できない？ → H64_DATAとの連携処理が動作していない');
            console.log('Why3: なぜ連携動作しない？ → 易卦ID→名前変換の処理が未実装');
            console.log('Why4: なぜ変換処理未実装？ → 表示部分で易卦データベース参照が不完全');
            console.log('Why5: なぜ参照不完全？ → データベース構造と表示ロジックの連携設計不足');
            console.log('→ 対策: H64_DATAから易卦名を取得する処理を実装');
        } else {
            console.log('Why1: なぜ易卦がN/A表示？ → 易卦ID自体が未設定/0');
            console.log('Why2: なぜ易卦ID未設定？ → 分析エンジンで易卦決定処理が動作していない');
            console.log('Why3: なぜ決定処理動作しない？ → 八卦エネルギーから64卦への変換が失敗');
            console.log('Why4: なぜ変換失敗？ → TripleOSInteractionAnalyzerの64卦選択ロジックにバグ');
            console.log('Why5: なぜバグがある？ → 八卦スコア→64卦マッピングの実装が不完全');
            console.log('→ 対策: 八卦→64卦変換ロジックを確認・修正');
        }
        
        // スクリーンショット
        await page.screenshot({ 
            path: 'display_issue_investigation_20250816.png',
            fullPage: false 
        });
        
        return {
            dataInvestigation,
            hasRealPercentage,
            hasRealHexagram,
            analysisLogsCount: analysisLogs.length
        };
        
    } catch (error) {
        console.error('❌ 調査エラー:', error.message);
        return { error: error.message };
    } finally {
        console.log('\n📸 スクリーンショット: display_issue_investigation_20250816.png');
        console.log('⚠️ ブラウザは開いたままです。手動で詳細確認してください。');
    }
}

// 実行
investigateDisplayIssues()
    .then(result => {
        console.log('\n' + '=' .repeat(60));
        console.log('🏁 根本原因調査完了');
        console.log('=' .repeat(60));
        
        if (!result.error) {
            console.log('\n📋 調査結果サマリー:');
            console.log(`分析ログ収集数: ${result.analysisLogsCount}`);
            console.log(`実データ存在（パーセンテージ）: ${result.hasRealPercentage ? '✅' : '❌'}`);
            console.log(`実データ存在（易卦）: ${result.hasRealHexagram ? '✅' : '❌'}`);
            
            if (result.hasRealPercentage && result.hasRealHexagram) {
                console.log('\n🎯 結論: データは存在するが表示処理に問題');
            } else {
                console.log('\n🎯 結論: データ生成自体に問題');
            }
        }
    })
    .catch(error => {
        console.error('❌ 致命的エラー:', error);
    });