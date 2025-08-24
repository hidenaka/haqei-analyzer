import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    console.log('🔍 BasicResultsTab 詳細データ内容確認');
    console.log('レビュー日時:', new Date().toISOString());
    console.log('目的: 固定データ vs データベースデータの詳細確認');
    console.log('============================================\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        devtools: true
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // コンソールログとエラー監視
    const consoleLogs = [];
    
    page.on('console', msg => {
        const text = msg.text();
        consoleLogs.push({ type: msg.type(), text, timestamp: new Date().toISOString() });
        console.log(`[${msg.type()}] ${text}`);
    });
    
    // Phase 1: ページ読み込み
    console.log('📋 Phase 1: ページ読み込みとデータソース確認\n');
    const resultsPath = `file://${path.join(__dirname, 'public', 'results.html')}`;
    
    await page.goto(resultsPath);
    await page.waitForTimeout(3000);
    
    // Phase 2: 実際のデータ内容を詳細確認
    console.log('📋 Phase 2: データ内容の詳細分析\n');
    
    const detailedDataAnalysis = await page.evaluate(() => {
        const analysis = {
            timestamp: new Date().toISOString(),
            dataSource: {},
            displayedContent: {},
            isTestData: false,
            fixedDataDetected: []
        };
        
        // 1. BasicResultsTabの実際のデータ確認
        if (window.basicResultsTab && window.basicResultsTab.analysisData) {
            const data = window.basicResultsTab.analysisData;
            analysis.dataSource = {
                hasData: !!data,
                engineOS: {
                    score: data.engine?.score,
                    hexagram: data.engine?.hexagram,
                    isTestData: data.engineOS?.isTestData || false
                },
                interfaceOS: {
                    score: data.interface?.score, 
                    hexagram: data.interface?.hexagram,
                    isTestData: data.interfaceOS?.isTestData || false
                },
                safeModeOS: {
                    score: data.safeMode?.score,
                    hexagram: data.safeMode?.hexagram,
                    isTestData: data.safeModeOS?.isTestData || false
                }
            };
            
            // テストデータフラグ確認
            analysis.isTestData = data.engineOS?.isTestData || data.interfaceOS?.isTestData || data.safeModeOS?.isTestData;
        }
        
        // 2. 実際に表示されているコンテンツの確認
        const containers = {
            osCards: document.getElementById('os-cards-container'),
            personality: document.getElementById('personality-profile-container'),
            summary: document.getElementById('analysis-summary-container'),
            recommendations: document.getElementById('recommendations-container')
        };
        
        Object.entries(containers).forEach(([name, container]) => {
            if (container) {
                const content = container.innerHTML;
                analysis.displayedContent[name] = {
                    exists: true,
                    contentLength: content.length,
                    hasContent: content.length > 50,
                    contentPreview: content.substring(0, 200) + (content.length > 200 ? '...' : '')
                };
                
                // 固定データの検出
                const fixedDataPatterns = [
                    'データが見つかりません',
                    'データ開発中です', 
                    '推奨アクション',
                    '🚧 まだ実装していません',
                    'テストデータ',
                    '開発中です',
                    'サンプルデータ'
                ];
                
                fixedDataPatterns.forEach(pattern => {
                    if (content.includes(pattern)) {
                        analysis.fixedDataDetected.push({
                            container: name,
                            pattern: pattern,
                            context: content.match(new RegExp(`.{0,50}${pattern}.{0,50}`, 'i'))?.[0] || pattern
                        });
                    }
                });
            } else {
                analysis.displayedContent[name] = { exists: false };
            }
        });
        
        // 3. StorageManagerの状態確認
        analysis.storageManager = {
            exists: typeof StorageManager !== 'undefined',
            hasData: false,
            dataType: 'unknown'
        };
        
        if (typeof StorageManager !== 'undefined') {
            try {
                const sm = new StorageManager();
                const storedData = sm.getAnalysisResult();
                analysis.storageManager.hasData = !!storedData;
                analysis.storageManager.dataType = typeof storedData;
                analysis.storageManager.dataKeys = storedData ? Object.keys(storedData) : [];
            } catch (e) {
                analysis.storageManager.error = e.message;
            }
        }
        
        // 4. generatePersonalityProfile関数の状態
        analysis.personalityFunction = {
            exists: typeof window.generatePersonalityProfile === 'function',
            returnType: 'unknown'
        };
        
        if (typeof window.generatePersonalityProfile === 'function' && analysis.dataSource.hasData) {
            try {
                const result = window.generatePersonalityProfile(analysis.dataSource);
                analysis.personalityFunction.returnType = typeof result;
                analysis.personalityFunction.hasContent = result && Object.keys(result).length > 0;
            } catch (e) {
                analysis.personalityFunction.error = e.message;
            }
        }
        
        return analysis;
    });
    
    // Phase 3: 分析結果の詳細レポート
    console.log('📋 Phase 3: 詳細分析結果\n');
    
    console.log('=== データソース分析 ===');
    console.log('データ存在:', detailedDataAnalysis.dataSource.hasData ? '✅' : '❌');
    console.log('テストデータフラグ:', detailedDataAnalysis.isTestData ? '🔧 テストデータ' : '📊 実データ');
    
    console.log('\n=== エンジンOS ===');
    console.log('  スコア:', detailedDataAnalysis.dataSource.engineOS?.score || 'なし');
    console.log('  卦名:', detailedDataAnalysis.dataSource.engineOS?.hexagram || 'なし');
    console.log('  テストデータ:', detailedDataAnalysis.dataSource.engineOS?.isTestData ? '✅' : '❌');
    
    console.log('\n=== インターフェースOS ===');
    console.log('  スコア:', detailedDataAnalysis.dataSource.interfaceOS?.score || 'なし');
    console.log('  卦名:', detailedDataAnalysis.dataSource.interfaceOS?.hexagram || 'なし');
    console.log('  テストデータ:', detailedDataAnalysis.dataSource.interfaceOS?.isTestData ? '✅' : '❌');
    
    console.log('\n=== セーフモードOS ===');
    console.log('  スコア:', detailedDataAnalysis.dataSource.safeModeOS?.score || 'なし');
    console.log('  卦名:', detailedDataAnalysis.dataSource.safeModeOS?.hexagram || 'なし');
    console.log('  テストデータ:', detailedDataAnalysis.dataSource.safeModeOS?.isTestData ? '✅' : '❌');
    
    console.log('\n=== 表示コンテンツ分析 ===');
    Object.entries(detailedDataAnalysis.displayedContent).forEach(([name, content]) => {
        console.log(`\n${name}:`);
        console.log(`  存在: ${content.exists ? '✅' : '❌'}`);
        if (content.exists) {
            console.log(`  コンテンツ長: ${content.contentLength}文字`);
            console.log(`  内容有り: ${content.hasContent ? '✅' : '❌'}`);
            console.log(`  プレビュー: ${content.contentPreview}`);
        }
    });
    
    console.log('\n=== 固定データ検出結果 ===');
    if (detailedDataAnalysis.fixedDataDetected.length > 0) {
        console.log('🚨 固定データが検出されました:');
        detailedDataAnalysis.fixedDataDetected.forEach((detection, index) => {
            console.log(`  ${index + 1}. コンテナ: ${detection.container}`);
            console.log(`     パターン: "${detection.pattern}"`);
            console.log(`     文脈: ${detection.context}`);
        });
    } else {
        console.log('✅ 固定データパターンは検出されませんでした');
    }
    
    console.log('\n=== StorageManager状態 ===');
    console.log('存在:', detailedDataAnalysis.storageManager.exists ? '✅' : '❌');
    console.log('データ有り:', detailedDataAnalysis.storageManager.hasData ? '✅' : '❌');
    console.log('データタイプ:', detailedDataAnalysis.storageManager.dataType);
    if (detailedDataAnalysis.storageManager.dataKeys) {
        console.log('データキー:', detailedDataAnalysis.storageManager.dataKeys.join(', '));
    }
    if (detailedDataAnalysis.storageManager.error) {
        console.log('エラー:', detailedDataAnalysis.storageManager.error);
    }
    
    console.log('\n=== 人物像生成機能 ===');
    console.log('関数存在:', detailedDataAnalysis.personalityFunction.exists ? '✅' : '❌');
    console.log('戻り値タイプ:', detailedDataAnalysis.personalityFunction.returnType);
    console.log('コンテンツ有り:', detailedDataAnalysis.personalityFunction.hasContent ? '✅' : '❌');
    if (detailedDataAnalysis.personalityFunction.error) {
        console.log('エラー:', detailedDataAnalysis.personalityFunction.error);
    }
    
    // Phase 4: スクリーンショット撮影
    console.log('\n📋 Phase 4: 詳細確認用スクリーンショット撮影\n');
    
    await page.screenshot({ 
        path: path.join(__dirname, '20250819_詳細データ確認スクリーンショット.png'),
        fullPage: true 
    });
    console.log('📸 詳細確認スクリーンショット保存完了');
    
    // Phase 5: 問題判定と推奨対応
    console.log('\n============================================');
    console.log('📊 詳細分析結果サマリー\n');
    
    const issues = [];
    const recommendations = [];
    
    // 問題の特定
    if (detailedDataAnalysis.isTestData) {
        issues.push('テストデータが使用されている');
        recommendations.push('実際の診断データに置き換える');
    }
    
    if (detailedDataAnalysis.fixedDataDetected.length > 0) {
        issues.push(`${detailedDataAnalysis.fixedDataDetected.length}個の固定データパターンを検出`);
        recommendations.push('固定データを動的データに置き換える');
    }
    
    if (!detailedDataAnalysis.storageManager.hasData) {
        issues.push('StorageManagerに有効なデータがない');
        recommendations.push('データ取得処理の修正が必要');
    }
    
    if (!detailedDataAnalysis.personalityFunction.hasContent) {
        issues.push('人物像生成機能が正常に動作していない');
        recommendations.push('generatePersonalityProfile関数の確認が必要');
    }
    
    // 結果判定
    if (issues.length === 0) {
        console.log('🎉 問題は検出されませんでした - データは正常に動的取得されています');
    } else {
        console.log(`⚠️ ${issues.length}個の問題が検出されました:`);
        issues.forEach((issue, index) => {
            console.log(`  ${index + 1}. ${issue}`);
        });
        
        console.log('\n💡 推奨対応:');
        recommendations.forEach((rec, index) => {
            console.log(`  ${index + 1}. ${rec}`);
        });
        
        console.log('\n🚨 結論: 固定データ問題が確認されました');
        console.log('CLAUDE.mdの指示に従い、BasicResultsTab固定データ問題修正指示書の実装が必要です');
    }
    
    console.log('\n============================================');
    console.log('詳細分析完了。ブラウザを確認してください。');
    
    // ブラウザを開いたままにする
    await new Promise(() => {});
})();