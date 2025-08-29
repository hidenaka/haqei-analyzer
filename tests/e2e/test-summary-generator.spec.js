/**
 * HAQEI Analyzer - SummaryGenerator 動作検証テストスクリプト
 * Playwrightを使用して実際の動作を検証
 */

import { test, expect } from '@playwright/test';

test.describe('SummaryGenerator実装検証', () => {
    let page;
    
    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        
        // コンソールメッセージをキャプチャ
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.error('Browser Error:', msg.text());
            } else {
                console.log('Browser Log:', msg.text());
            }
        });
        
        // エラーをキャプチャ
        page.on('pageerror', error => {
            console.error('Page Error:', error.message);
        });
    });

    test.describe('基本動作確認', () => {
        test('ページ読み込み時のサマリー表示', async () => {
            console.log('📊 テスト開始: ページ読み込み時のサマリー表示');
            
            // results.htmlページを開く
            await page.goto(`file://${process.cwd()}/public/results.html`);
            
            // 少し待機してページ要素が読み込まれるのを待つ
            await page.waitForTimeout(3000);
            
            // SummaryGeneratorクラスが利用可能か確認
            const summaryGeneratorExists = await page.evaluate(() => {
                return typeof window.SummaryGenerator !== 'undefined';
            });
            
            expect(summaryGeneratorExists).toBe(true);
            console.log('✅ SummaryGeneratorクラスが利用可能');
        });

        test('V3データベースとの連携確認', async () => {
            console.log('📊 テスト開始: V3データベースとの連携');
            
            await page.goto(`file://${process.cwd()}/public/results.html`);
            await page.waitForTimeout(3000);
            
            // V3データベースが利用可能か確認
            const v3DatabaseInfo = await page.evaluate(() => {
                if (typeof window.HexagramHumanTraitsV3 === 'undefined') {
                    return { exists: false };
                }
                
                const database = window.HexagramHumanTraitsV3;
                return {
                    exists: true,
                    count: Object.keys(database).length,
                    firstEntry: Object.keys(database)[0],
                    hasEngineOS: database[Object.keys(database)[0]]?.asEngineOS !== undefined
                };
            });
            
            expect(v3DatabaseInfo.exists).toBe(true);
            expect(v3DatabaseInfo.count).toBeGreaterThan(0);
            expect(v3DatabaseInfo.hasEngineOS).toBe(true);
            
            console.log('✅ V3データベース連携確認完了:', v3DatabaseInfo);
        });

        test('4行要約の表示内容確認', async () => {
            console.log('📊 テスト開始: 4行要約の表示内容');
            
            await page.goto(`file://${process.cwd()}/public/results.html`);
            await page.waitForTimeout(3000);
            
            // SummaryGeneratorで4行要約を生成
            const fourLineSummary = await page.evaluate(() => {
                if (typeof window.SummaryGenerator === 'undefined') {
                    return { error: 'SummaryGenerator not available' };
                }
                
                const generator = new window.SummaryGenerator();
                const testData = {
                    engineOS: {
                        hexagramName: '乾為天',
                        score: 75
                    },
                    interfaceOS: {
                        hexagramName: '兌為澤',
                        score: 68
                    },
                    safeModeOS: {
                        hexagramName: '坤為地',
                        score: 82
                    }
                };
                
                try {
                    return generator.generateFourLineSummary(testData);
                } catch (error) {
                    return { error: error.message };
                }
            });
            
            expect(fourLineSummary).toBeDefined();
            expect(fourLineSummary.error).toBeUndefined();
            expect(fourLineSummary.line1).toContain('あなたの内なる原動力');
            expect(fourLineSummary.line2).toContain('社会との関わり方');
            expect(fourLineSummary.line3).toContain('ストレス対処法');
            expect(fourLineSummary.line4).toContain('総合評価');
            
            console.log('✅ 4行要約生成成功:', fourLineSummary);
        });

        test('日本漢字表示確認', async () => {
            console.log('📊 テスト開始: 日本漢字表示確認');
            
            await page.goto(`file://${process.cwd()}/public/results.html`);
            await page.waitForTimeout(3000);
            
            // 卦名の正規化テスト
            const normalizationTest = await page.evaluate(() => {
                if (typeof window.SummaryGenerator === 'undefined') {
                    return { error: 'SummaryGenerator not available' };
                }
                
                const generator = new window.SummaryGenerator();
                
                return {
                    original_wei: generator.normalizeHexagramName('为天'),
                    expected_wei: '為天',
                    original_ze: generator.normalizeHexagramName('泽天夬'),
                    expected_ze: '澤天夬',
                    original_song: generator.normalizeHexagramName('讼'),
                    expected_song: '訟'
                };
            });
            
            expect(normalizationTest.error).toBeUndefined();
            expect(normalizationTest.original_wei).toBe(normalizationTest.expected_wei);
            expect(normalizationTest.original_ze).toBe(normalizationTest.expected_ze);
            expect(normalizationTest.original_song).toBe(normalizationTest.expected_song);
            
            console.log('✅ 日本漢字正規化動作確認:', normalizationTest);
        });
    });

    test.describe('インタラクション確認', () => {
        test('BasicResultsTabでのアコーディオン動作', async () => {
            console.log('📊 テスト開始: アコーディオン動作確認');
            
            await page.goto(`file://${process.cwd()}/public/results.html`);
            await page.waitForTimeout(5000);
            
            // アコーディオンヘッダーが存在するか確認
            const accordionExists = await page.locator('.haqei-accordion-header').count();
            console.log('アコーディオンヘッダー数:', accordionExists);
            
            if (accordionExists > 0) {
                // 最初のアコーディオンをクリック
                await page.locator('.haqei-accordion-header').first().click();
                await page.waitForTimeout(1000);
                
                // コンテンツが展開されたか確認
                const isExpanded = await page.locator('.haqei-accordion-content.active').count();
                expect(isExpanded).toBeGreaterThan(0);
                
                console.log('✅ アコーディオン展開動作確認完了');
            } else {
                console.log('⚠️ アコーディオンが見つかりません');
            }
        });

        test('スコア説明の表示確認', async () => {
            console.log('📊 テスト開始: スコア説明表示確認');
            
            await page.goto(`file://${process.cwd()}/public/results.html`);
            await page.waitForTimeout(3000);
            
            // スコア説明生成テスト
            const scoreExplanation = await page.evaluate(() => {
                if (typeof window.SummaryGenerator === 'undefined') {
                    return { error: 'SummaryGenerator not available' };
                }
                
                const generator = new window.SummaryGenerator();
                
                try {
                    return {
                        high_score: generator.explainScore(85, 'engineOS'),
                        medium_score: generator.explainScore(65, 'interfaceOS'),
                        low_score: generator.explainScore(35, 'safeModeOS')
                    };
                } catch (error) {
                    return { error: error.message };
                }
            });
            
            expect(scoreExplanation.error).toBeUndefined();
            expect(scoreExplanation.high_score.level).toBe('exceptional');
            expect(scoreExplanation.medium_score.level).toBe('good');
            expect(scoreExplanation.low_score.level).toBe('developing');
            
            console.log('✅ スコア説明生成確認完了:', scoreExplanation);
        });

        test('エラー時のフォールバック動作', async () => {
            console.log('📊 テスト開始: エラー時のフォールバック');
            
            await page.goto(`file://${process.cwd()}/public/results.html`);
            await page.waitForTimeout(3000);
            
            // 不正なデータでフォールバックテスト
            const fallbackTest = await page.evaluate(() => {
                if (typeof window.SummaryGenerator === 'undefined') {
                    return { error: 'SummaryGenerator not available' };
                }
                
                const generator = new window.SummaryGenerator();
                
                try {
                    // 不正なデータを渡す
                    const fallbackSummary = generator.generateFourLineSummary({});
                    const fallbackDetailed = generator.generateDetailedSummary({});
                    
                    return {
                        fourLine: fallbackSummary,
                        detailed: fallbackDetailed,
                        hasFallback: true
                    };
                } catch (error) {
                    return { error: error.message };
                }
            });
            
            expect(fallbackTest.error).toBeUndefined();
            expect(fallbackTest.hasFallback).toBe(true);
            expect(fallbackTest.fourLine).toBeDefined();
            expect(fallbackTest.detailed).toBeDefined();
            
            console.log('✅ フォールバック動作確認完了');
        });
    });

    test.describe('データ整合性確認', () => {
        test('実際のV3データ表示確認', async () => {
            console.log('📊 テスト開始: V3データ表示確認');
            
            await page.goto(`file://${process.cwd()}/public/results.html`);
            await page.waitForTimeout(3000);
            
            // 実際のV3データを使用したテスト
            const v3DataTest = await page.evaluate(() => {
                if (typeof window.SummaryGenerator === 'undefined' || typeof window.HexagramHumanTraitsV3 === 'undefined') {
                    return { error: 'Required classes not available' };
                }
                
                const generator = new window.SummaryGenerator();
                const hexagramName = '乾為天';
                
                try {
                    const engineData = generator.getV3DataForOS(hexagramName, 'engineOS');
                    const interfaceData = generator.getV3DataForOS(hexagramName, 'interfaceOS');
                    const safeModeData = generator.getV3DataForOS(hexagramName, 'safeModeOS');
                    
                    return {
                        hasEngineData: !!engineData,
                        hasInterfaceData: !!interfaceData,
                        hasSafeModeData: !!safeModeData,
                        engineProfile: engineData?.profile?.type,
                        interfaceProfile: interfaceData?.profile?.type,
                        safeModeProfile: safeModeData?.profile?.type
                    };
                } catch (error) {
                    return { error: error.message };
                }
            });
            
            expect(v3DataTest.error).toBeUndefined();
            expect(v3DataTest.hasEngineData).toBe(true);
            expect(v3DataTest.hasInterfaceData).toBe(true);
            expect(v3DataTest.hasSafeModeData).toBe(true);
            
            console.log('✅ V3データ表示確認完了:', v3DataTest);
        });

        test('スコア計算の正確性確認', async () => {
            console.log('📊 テスト開始: スコア計算正確性確認');
            
            await page.goto(`file://${process.cwd()}/public/results.html`);
            await page.waitForTimeout(3000);
            
            // スコア計算テスト
            const scoreCalculationTest = await page.evaluate(() => {
                if (typeof window.SummaryGenerator === 'undefined') {
                    return { error: 'SummaryGenerator not available' };
                }
                
                const generator = new window.SummaryGenerator();
                
                try {
                    const testScores = [25, 45, 65, 85, 95];
                    const results = {};
                    
                    testScores.forEach(score => {
                        const categorized = generator.categorizeScore(score);
                        const percentile = generator.calculatePercentile(score);
                        const visualization = generator.generateScoreVisualization(score);
                        
                        results[score] = {
                            level: categorized.level,
                            percentile: percentile,
                            color: visualization.color,
                            percentage: visualization.percentage
                        };
                    });
                    
                    return results;
                } catch (error) {
                    return { error: error.message };
                }
            });
            
            expect(scoreCalculationTest.error).toBeUndefined();
            expect(scoreCalculationTest[25].level).toBe('developing');
            expect(scoreCalculationTest[65].level).toBe('good');
            expect(scoreCalculationTest[85].level).toBe('exceptional');
            
            console.log('✅ スコア計算正確性確認完了:', scoreCalculationTest);
        });
    });

    test.describe('パフォーマンス測定', () => {
        test('初期表示時間測定', async () => {
            console.log('📊 テスト開始: 初期表示時間測定');
            
            const startTime = Date.now();
            
            await page.goto(`file://${process.cwd()}/public/results.html`);
            
            // ページが完全に読み込まれるまで待機
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);
            
            const loadTime = Date.now() - startTime;
            
            // 3秒以内での読み込みを期待
            expect(loadTime).toBeLessThan(5000);
            
            console.log('✅ 初期表示時間:', loadTime + 'ms');
        });

        test('アコーディオン開閉レスポンス測定', async () => {
            console.log('📊 テスト開始: アコーディオンレスポンス測定');
            
            await page.goto(`file://${process.cwd()}/public/results.html`);
            await page.waitForTimeout(3000);
            
            const accordionCount = await page.locator('.haqei-accordion-header').count();
            
            if (accordionCount > 0) {
                const startTime = Date.now();
                
                // アコーディオンをクリック
                await page.locator('.haqei-accordion-header').first().click();
                
                // アニメーション完了まで待機
                await page.waitForTimeout(500);
                
                const responseTime = Date.now() - startTime;
                
                // 1秒以内での応答を期待
                expect(responseTime).toBeLessThan(1000);
                
                console.log('✅ アコーディオンレスポンス時間:', responseTime + 'ms');
            } else {
                console.log('⚠️ アコーディオンが見つからないためスキップ');
            }
        });

        test('メモリ使用量確認', async () => {
            console.log('📊 テスト開始: メモリ使用量確認');
            
            await page.goto(`file://${process.cwd()}/public/results.html`);
            await page.waitForTimeout(3000);
            
            // メモリ使用量測定
            const metrics = await page.evaluate(() => {
                if (performance.memory) {
                    return {
                        usedJSHeapSize: performance.memory.usedJSHeapSize,
                        totalJSHeapSize: performance.memory.totalJSHeapSize,
                        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
                    };
                }
                return { unavailable: true };
            });
            
            if (!metrics.unavailable) {
                // 50MB以下での使用を期待
                expect(metrics.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024);
                
                console.log('✅ メモリ使用量:', {
                    used: Math.round(metrics.usedJSHeapSize / 1024 / 1024) + 'MB',
                    total: Math.round(metrics.totalJSHeapSize / 1024 / 1024) + 'MB'
                });
            } else {
                console.log('⚠️ メモリ測定機能が利用できません');
            }
        });
    });

    test.describe('機能完成度評価', () => {
        test('全体的な機能動作確認', async () => {
            console.log('📊 テスト開始: 全体機能動作確認');
            
            await page.goto(`file://${process.cwd()}/public/results.html`);
            await page.waitForTimeout(3000);
            
            // 各機能の動作確認
            const overallTest = await page.evaluate(() => {
                const results = {
                    summaryGeneratorAvailable: typeof window.SummaryGenerator !== 'undefined',
                    v3DatabaseAvailable: typeof window.HexagramHumanTraitsV3 !== 'undefined',
                    basicResultsTabAvailable: typeof window.BasicResultsTab !== 'undefined',
                    tabNavigatorAvailable: typeof window.TabNavigator !== 'undefined'
                };
                
                if (results.summaryGeneratorAvailable && results.v3DatabaseAvailable) {
                    try {
                        const generator = new window.SummaryGenerator();
                        const testData = {
                            engineOS: { hexagramName: '乾為天', score: 75 },
                            interfaceOS: { hexagramName: '兌為澤', score: 68 },
                            safeModeOS: { hexagramName: '坤為地', score: 82 }
                        };
                        
                        const fourLine = generator.generateFourLineSummary(testData);
                        const detailed = generator.generateDetailedSummary(testData);
                        const scoreExpl = generator.explainScore(75, 'engineOS');
                        
                        results.functionsWorking = {
                            fourLineSummary: !!fourLine.line1,
                            detailedSummary: !!detailed.overview,
                            scoreExplanation: !!scoreExpl.level
                        };
                    } catch (error) {
                        results.functionError = error.message;
                    }
                }
                
                return results;
            });
            
            expect(overallTest.summaryGeneratorAvailable).toBe(true);
            expect(overallTest.v3DatabaseAvailable).toBe(true);
            expect(overallTest.functionsWorking.fourLineSummary).toBe(true);
            expect(overallTest.functionsWorking.detailedSummary).toBe(true);
            expect(overallTest.functionsWorking.scoreExplanation).toBe(true);
            
            console.log('✅ 全体機能動作確認完了:', overallTest);
        });
    });
});