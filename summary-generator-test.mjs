/**
 * HAQEI Analyzer - SummaryGenerator 簡易動作検証
 * 
 * Node.js環境でPlaywright経由で動作を確認
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runSummaryGeneratorTests() {
    console.log('🔍 HAQEI SummaryGenerator動作検証開始');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    // コンソールログをキャプチャ
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.error('🚨 Browser Error:', msg.text());
        } else {
            console.log('📝 Browser Log:', msg.text());
        }
    });
    
    // エラーをキャプチャ
    page.on('pageerror', error => {
        console.error('💥 Page Error:', error.message);
    });
    
    try {
        const resultsPath = join(__dirname, 'public', 'results.html');
        console.log('📂 Loading:', `file://${resultsPath}`);
        
        await page.goto(`file://${resultsPath}`);
        console.log('✅ ページ読み込み完了');
        
        // 少し待機
        await page.waitForTimeout(5000);
        
        // 🔍 Test 1: SummaryGeneratorクラスの存在確認
        console.log('\n🧪 Test 1: SummaryGeneratorクラス存在確認');
        const summaryGeneratorExists = await page.evaluate(() => {
            return {
                summaryGenerator: typeof window.SummaryGenerator !== 'undefined',
                v3Database: typeof window.HexagramHumanTraitsV3 !== 'undefined',
                basicResultsTab: typeof window.BasicResultsTab !== 'undefined'
            };
        });
        
        console.log('📊 クラス存在確認結果:', summaryGeneratorExists);
        
        // 🔍 Test 2: V3データベース内容確認
        console.log('\n🧪 Test 2: V3データベース内容確認');
        const v3DatabaseInfo = await page.evaluate(() => {
            if (typeof window.HexagramHumanTraitsV3 === 'undefined') {
                return { error: 'V3データベースが見つかりません' };
            }
            
            const db = window.HexagramHumanTraitsV3;
            const firstKey = Object.keys(db)[0];
            const firstEntry = db[firstKey];
            
            return {
                totalHexagrams: Object.keys(db).length,
                firstHexagram: firstKey,
                hasEngineOS: !!firstEntry?.asEngineOS,
                hasInterfaceOS: !!firstEntry?.asInterfaceOS,
                hasSafeModeOS: !!firstEntry?.asSafeModeOS,
                sampleProfile: firstEntry?.asEngineOS?.profile?.type || 'なし'
            };
        });
        
        console.log('📊 V3データベース確認結果:', v3DatabaseInfo);
        
        // 🔍 Test 3: SummaryGenerator機能テスト
        console.log('\n🧪 Test 3: SummaryGenerator機能テスト');
        const functionalTest = await page.evaluate(() => {
            if (typeof window.SummaryGenerator === 'undefined') {
                return { error: 'SummaryGeneratorが利用できません' };
            }
            
            try {
                const generator = new window.SummaryGenerator();
                
                // テストデータ
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
                
                // 各機能をテスト
                const fourLineSummary = generator.generateFourLineSummary(testData);
                const detailedSummary = generator.generateDetailedSummary(testData);
                const scoreExplanation = generator.explainScore(75, 'engineOS');
                const osProfile = generator.getOSProfile('乾為天', 'engineOS');
                
                return {
                    success: true,
                    fourLineSummary: {
                        hasAllLines: !!(fourLineSummary.line1 && fourLineSummary.line2 && fourLineSummary.line3 && fourLineSummary.line4),
                        line1Sample: fourLineSummary.line1?.substring(0, 30) + '...',
                        line4Sample: fourLineSummary.line4?.substring(0, 30) + '...'
                    },
                    detailedSummary: {
                        hasOverview: !!detailedSummary.overview,
                        hasRecommendations: !!detailedSummary.recommendations,
                        overviewSample: detailedSummary.overview?.substring(0, 50) + '...'
                    },
                    scoreExplanation: {
                        level: scoreExplanation.level,
                        message: scoreExplanation.message,
                        percentile: scoreExplanation.percentile
                    },
                    osProfile: {
                        type: osProfile.type || 'データなし',
                        hasDescription: !!osProfile.description
                    }
                };
                
            } catch (error) {
                return { error: error.message };
            }
        });
        
        console.log('📊 SummaryGenerator機能テスト結果:', JSON.stringify(functionalTest, null, 2));
        
        // 🔍 Test 4: 日本漢字正規化テスト
        console.log('\n🧪 Test 4: 日本漢字正規化テスト');
        const normalizationTest = await page.evaluate(() => {
            if (typeof window.SummaryGenerator === 'undefined') {
                return { error: 'SummaryGeneratorが利用できません' };
            }
            
            const generator = new window.SummaryGenerator();
            
            return {
                '为天 → 為天': generator.normalizeHexagramName('为天'),
                '泽天夬 → 澤天夬': generator.normalizeHexagramName('泽天夬'),
                '讼 → 訟': generator.normalizeHexagramName('讼'),
                '师 → 師': generator.normalizeHexagramName('师'),
                '风 → 風': generator.normalizeHexagramName('风')
            };
        });
        
        console.log('📊 正規化テスト結果:', normalizationTest);
        
        // 🔍 Test 5: エラーハンドリングテスト
        console.log('\n🧪 Test 5: エラーハンドリングテスト');
        const errorHandlingTest = await page.evaluate(() => {
            if (typeof window.SummaryGenerator === 'undefined') {
                return { error: 'SummaryGeneratorが利用できません' };
            }
            
            const generator = new window.SummaryGenerator();
            
            try {
                // 不正なデータでテスト
                const fallbackFourLine = generator.generateFourLineSummary({});
                const fallbackDetailed = generator.generateDetailedSummary(null);
                
                return {
                    fallbackWorking: !!(fallbackFourLine.line1 && fallbackDetailed.overview),
                    fallbackSample: fallbackFourLine.line1?.substring(0, 40) + '...'
                };
            } catch (error) {
                return { error: error.message };
            }
        });
        
        console.log('📊 エラーハンドリングテスト結果:', errorHandlingTest);
        
        // 🔍 Test 6: BasicResultsTabでの統合確認
        console.log('\n🧪 Test 6: BasicResultsTab統合確認');
        const integrationTest = await page.evaluate(() => {
            if (typeof window.BasicResultsTab === 'undefined') {
                return { error: 'BasicResultsTabが利用できません' };
            }
            
            try {
                // BasicResultsTabにアクセス（既に初期化されている場合）
                if (window.basicResultsTab) {
                    return {
                        tabExists: true,
                        hasSummaryGenerator: !!window.basicResultsTab.summaryGenerator,
                        hasV3Database: !!window.basicResultsTab.v3Database,
                        hasAnalysisData: !!window.basicResultsTab.analysisData
                    };
                } else {
                    return { error: 'BasicResultsTabインスタンスが見つかりません' };
                }
            } catch (error) {
                return { error: error.message };
            }
        });
        
        console.log('📊 BasicResultsTab統合確認結果:', integrationTest);
        
        // 🔍 Test 7: パフォーマンステスト
        console.log('\n🧪 Test 7: パフォーマンステスト');
        const performanceTest = await page.evaluate(() => {
            if (typeof window.SummaryGenerator === 'undefined') {
                return { error: 'SummaryGeneratorが利用できません' };
            }
            
            const generator = new window.SummaryGenerator();
            const testData = {
                engineOS: { hexagramName: '乾為天', score: 75 },
                interfaceOS: { hexagramName: '兌為澤', score: 68 },
                safeModeOS: { hexagramName: '坤為地', score: 82 }
            };
            
            // 実行時間測定
            const iterations = 100;
            const startTime = performance.now();
            
            for (let i = 0; i < iterations; i++) {
                generator.generateFourLineSummary(testData);
            }
            
            const endTime = performance.now();
            const avgTime = (endTime - startTime) / iterations;
            
            // メモリ使用量（可能な場合）
            const memoryInfo = performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
            } : null;
            
            return {
                averageExecutionTime: Math.round(avgTime * 100) / 100,
                iterations: iterations,
                memoryUsage: memoryInfo
            };
        });
        
        console.log('📊 パフォーマンステスト結果:', performanceTest);
        
        // 📋 総合評価レポート
        console.log('\n📋 ========== 総合評価レポート ==========');
        
        const overallScore = {
            クラス存在: summaryGeneratorExists.summaryGenerator ? '✅' : '❌',
            V3データベース: summaryGeneratorExists.v3Database ? '✅' : '❌',
            基本機能: functionalTest.success ? '✅' : '❌',
            日本漢字正規化: normalizationTest['为天 → 為天'] === '為天' ? '✅' : '❌',
            エラーハンドリング: errorHandlingTest.fallbackWorking ? '✅' : '❌',
            BasicResultsTab統合: integrationTest.tabExists ? '✅' : '❌'
        };
        
        console.log('🎯 機能完成度:', overallScore);
        
        const passedTests = Object.values(overallScore).filter(v => v === '✅').length;
        const totalTests = Object.keys(overallScore).length;
        const completionRate = Math.round((passedTests / totalTests) * 100);
        
        console.log(`🏆 総合完成度: ${completionRate}% (${passedTests}/${totalTests})`);
        
        if (completionRate >= 80) {
            console.log('🌟 優秀: SummaryGeneratorは十分に実装されています');
        } else if (completionRate >= 60) {
            console.log('⚡ 良好: SummaryGeneratorは基本的に動作していますが改善余地があります');
        } else {
            console.log('🔧 要改善: SummaryGeneratorに重要な問題があります');
        }
        
        // スクリーンショット撮影
        await page.screenshot({ 
            path: 'summary-generator-test-result.png',
            fullPage: true 
        });
        console.log('📸 スクリーンショットを保存しました: summary-generator-test-result.png');
        
        // 最終待機
        console.log('\n⏰ 5秒間待機してブラウザを確認できます...');
        await page.waitForTimeout(5000);
        
    } catch (error) {
        console.error('💥 テスト実行エラー:', error.message);
    } finally {
        await browser.close();
        console.log('🔚 テスト完了');
    }
}

// テスト実行
runSummaryGeneratorTests().catch(console.error);