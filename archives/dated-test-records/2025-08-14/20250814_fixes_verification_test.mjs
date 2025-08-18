/**
 * Future Simulator修正検証テスト
 * CSP設定、386爻データ、options参照エラーの修正を確認
 */

import { chromium } from 'playwright';

async function verifyFixes() {
    console.log('🔧 Future Simulator修正検証テスト');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    const results = {
        cspIssues: [],
        dataInitialization: {},
        optionsErrors: 0,
        majorErrors: 0
    };
    
    try {
        const page = await browser.newPage();
        
        // エラー監視
        const errors = [];
        page.on('pageerror', error => {
            errors.push({
                message: error.message,
                type: 'page',
                timestamp: new Date().toISOString()
            });
            
            if (error.message.includes('options is not defined')) {
                results.optionsErrors++;
            }
            
            if (error.message.includes('is not a function') || 
                error.message.includes('Cannot read property') ||
                error.message.includes('TypeError')) {
                results.majorErrors++;
            }
            
            console.error('❌ Page Error:', error.message);
        });
        
        page.on('console', msg => {
            const text = msg.text();
            const type = msg.type();
            
            // CSP関連エラーを監視
            if (text.includes('Content Security Policy') || text.includes('CDN') || text.includes('kuromoji')) {
                if (text.includes('Refused to connect')) {
                    results.cspIssues.push(text);
                }
            }
            
            // 386爻データ初期化の監視
            if (text.includes('386') && text.includes('Authentic')) {
                if (text.includes('✅')) {
                    results.dataInitialization.success = true;
                    results.dataInitialization.message = text;
                } else if (text.includes('❌')) {
                    results.dataInitialization.success = false;
                    results.dataInitialization.error = text;
                }
            }
            
            if (type === 'error' || text.includes('❌')) {
                console.log(`[${type.toUpperCase()}] ${text}`);
            } else if (text.includes('✅') || text.includes('Loaded') || text.includes('initialized')) {
                console.log(`[SUCCESS] ${text}`);
            }
        });
        
        console.log('📍 Future Simulatorページを開いています...');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        
        console.log('⏱️  10秒待機（初期化とCSPテストのため）...');
        await page.waitForTimeout(10000);
        
        // 初期化状況の確認
        const initStatus = await page.evaluate(() => {
            return {
                futureSimulator: typeof window.FutureSimulator !== 'undefined',
                eightScenariosDisplay: typeof window.EightScenariosDisplay !== 'undefined',
                authentic386Analyzer: typeof window.Authentic386YaoAnalyzer !== 'undefined',
                canCreateEightScenarios: (() => {
                    try {
                        if (window.EightScenariosDisplay) {
                            const display = new window.EightScenariosDisplay({});
                            return { success: true };
                        }
                        return { success: false, error: 'Class not available' };
                    } catch (error) {
                        return { success: false, error: error.message };
                    }
                })()
            };
        });
        
        console.log('\\n🔍 修正検証結果:');
        console.log('===============================');
        
        // 1. Options参照エラー確認
        console.log('\\n1️⃣ Options参照エラー:');
        console.log(`   - options errors: ${results.optionsErrors}件`);
        console.log(`   - EightScenariosDisplay作成: ${initStatus.canCreateEightScenarios.success ? '✅' : '❌'}`);
        if (!initStatus.canCreateEightScenarios.success) {
            console.log(`   - Error: ${initStatus.canCreateEightScenarios.error}`);
        }
        
        // 2. CSP外部リソースアクセス確認
        console.log('\\n2️⃣ CSP外部リソースアクセス:');
        console.log(`   - CSP violations: ${results.cspIssues.length}件`);
        if (results.cspIssues.length > 0) {
            results.cspIssues.forEach(issue => {
                console.log(`   - ${issue}`);
            });
        } else {
            console.log('   - ✅ CDN接続エラーなし');
        }
        
        // 3. 386爻データ初期化確認
        console.log('\\n3️⃣ 386爻データ初期化:');
        if (results.dataInitialization.success !== undefined) {
            console.log(`   - 初期化: ${results.dataInitialization.success ? '✅ 成功' : '❌ 失敗'}`);
            const message = results.dataInitialization.success ? 
                           results.dataInitialization.message : 
                           results.dataInitialization.error;
            console.log(`   - ${message}`);
        } else {
            console.log('   - ⚠️  初期化ログが確認できませんでした');
        }
        
        // 4. 総合判定
        const overallScore = {
            optionsFixed: results.optionsErrors === 0 && initStatus.canCreateEightScenarios.success,
            cspFixed: results.cspIssues.length === 0,
            dataFixed: results.dataInitialization.success === true,
            majorErrorsGone: results.majorErrors < 3 // 以前は5件の重要エラーがあった
        };
        
        const fixedCount = Object.values(overallScore).filter(x => x).length;
        const totalFixes = Object.keys(overallScore).length;
        
        console.log('\\n🎯 修正総合評価:');
        console.log(`   - Options参照エラー修正: ${overallScore.optionsFixed ? '✅' : '❌'}`);
        console.log(`   - CSP外部リソース修正: ${overallScore.cspFixed ? '✅' : '❌'}`);
        console.log(`   - 386爻データ修正: ${overallScore.dataFixed ? '✅' : '❌'}`);
        console.log(`   - 重要エラー削減: ${overallScore.majorErrorsGone ? '✅' : '❌'}`);
        console.log(`   - スコア: ${fixedCount}/${totalFixes}`);
        
        const success = fixedCount >= 3; // 4項目中3項目以上で成功
        return {
            success,
            score: `${fixedCount}/${totalFixes}`,
            details: overallScore,
            errors: errors.length,
            ...results
        };
        
    } catch (error) {
        console.error('❌ 検証テストエラー:', error);
        return { success: false, error: error.message };
    } finally {
        console.log('\\n⏱️  5秒間ブラウザを開いたまま（最終確認）...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        await browser.close();
    }
}

// 実行
verifyFixes().then(result => {
    console.log('\\n🏁 修正検証完了:');
    console.log('=====================================');
    
    if (result.success) {
        console.log('🎉 修正は概ね成功しました！');
        console.log('Future Simulatorのユーザー体験が大幅に改善されました。');
    } else {
        console.log('⚠️  まだ修正が必要な問題があります。');
    }
    
    console.log(`📊 最終スコア: ${result.score || 'N/A'}`);
    
    if (result.details) {
        console.log('\\n📋 推奨アクション:');
        if (result.details.optionsFixed && result.details.cspFixed) {
            console.log('  - 主要な初期化問題は解決済み');
            console.log('  - ユーザー体験フローの最終確認を推奨');
        } else {
            console.log('  - 残存する問題の個別対応が必要');
        }
    }
    
}).catch(console.error);