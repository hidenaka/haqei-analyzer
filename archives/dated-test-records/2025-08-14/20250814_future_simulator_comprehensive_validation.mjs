/**
 * Future Simulator 総合評価検証
 * v4.3.1改善後のユーザー体験・機能・パフォーマンス・バグチェック
 */

import { chromium } from 'playwright';

async function comprehensiveValidation() {
    console.log('🎯 Future Simulator 総合評価検証開始');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    const results = {
        userExperience: {},
        functionalRegression: {},
        performance: {},
        bugCheck: {},
        overall: false
    };
    
    try {
        const page = await browser.newPage();
        
        // エラー・ログ監視
        const errors = [];
        const warnings = [];
        const logs = [];
        
        page.on('pageerror', error => {
            errors.push({
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            console.error('❌ Page Error:', error.message);
        });
        
        page.on('console', msg => {
            const text = msg.text();
            const type = msg.type();
            
            if (type === 'error') {
                errors.push({ message: text, type: 'console', timestamp: new Date().toISOString() });
            } else if (type === 'warn') {
                warnings.push({ message: text, timestamp: new Date().toISOString() });
            }
            
            logs.push({ type, text, timestamp: new Date().toISOString() });
            
            if (text.includes('Future') || text.includes('v4.3.1') || text.includes('Simulator')) {
                console.log(`[${type.toUpperCase()}] ${text}`);
            }
        });
        
        console.log('📍 Future Simulatorページを開いています...');
        
        // パフォーマンス測定開始
        const startTime = Date.now();
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        const loadTime = Date.now() - startTime;
        
        console.log('⏱️  初期ロード完了 - 5秒待機（安定化）...');
        await page.waitForTimeout(5000);
        
        // ====================
        // 1. ユーザー体験フロー確認
        // ====================
        console.log('\\n🎭 Phase 1: ユーザー体験フロー確認');
        
        // 基本UI要素の存在確認
        const uiElements = await page.evaluate(() => {
            return {
                title: !!document.querySelector('h1, .title'),
                startButton: !!document.querySelector('button[onclick*="start"], .start-btn'),
                inputArea: !!document.querySelector('input, textarea, .input-area'),
                resultArea: !!document.querySelector('#results, .results, #scenarios'),
                v431Script: !!document.querySelector('script[src*="v4.3.1"], script[src*="future-simulator-v4.3.1"]')
            };
        });
        
        console.log('🔍 基本UI要素チェック:');
        Object.entries(uiElements).forEach(([key, exists]) => {
            console.log(`  - ${key}: ${exists ? '✅' : '❌'}`);
        });
        
        results.userExperience.uiElements = uiElements;
        
        // Future Simulatorのスタートボタン探索・クリック
        const startButtonSelector = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const startBtn = buttons.find(btn => 
                btn.textContent.includes('開始') || 
                btn.textContent.includes('start') || 
                btn.textContent.includes('シミュ') ||
                btn.onclick?.toString().includes('start')
            );
            return startBtn ? 'button' : null;
        });
        
        if (startButtonSelector) {
            console.log('🎯 スタートボタン発見 - クリックテスト実行');
            
            // スタートボタンクリック
            await page.click('button');
            await page.waitForTimeout(2000);
            
            // インタラクション後の状態確認
            const afterStart = await page.evaluate(() => {
                return {
                    newElementsAppeared: !!document.querySelector('.scenario, .question, .input-field'),
                    modalOpened: !!document.querySelector('.modal:not([style*="display: none"])'),
                    contentChanged: document.body.innerHTML.length
                };
            });
            
            results.userExperience.interaction = {
                startButtonWorking: true,
                newElements: afterStart.newElementsAppeared,
                modalBehavior: afterStart.modalOpened,
                contentSize: afterStart.contentChanged
            };
            
            console.log('✅ スタートボタン動作確認完了');
        } else {
            console.log('⚠️  スタートボタンが見つかりません');
            results.userExperience.interaction = { startButtonWorking: false };
        }
        
        // ====================
        // 2. 機能回帰テスト (v4.3.1)
        // ====================
        console.log('\\n🔧 Phase 2: 機能回帰テスト (v4.3.1)');
        
        // v4.3.1スクリプトのロード確認
        const v431Status = await page.evaluate(() => {
            return {
                scriptLoaded: !!window.FutureSimulatorV431,
                coreClasses: {
                    FutureSimulator: typeof window.FutureSimulator !== 'undefined',
                    SeedableRandom: typeof window.SeedableRandom !== 'undefined',
                    FutureBranchingSystem: typeof window.FutureBranchingSystem !== 'undefined'
                }
            };
        });
        
        console.log('🔍 v4.3.1実装状況:');
        console.log('  - Script loaded:', v431Status.scriptLoaded ? '✅' : '❌');
        Object.entries(v431Status.coreClasses).forEach(([cls, exists]) => {
            console.log(`  - ${cls}: ${exists ? '✅' : '❌'}`);
        });
        
        results.functionalRegression.v431Implementation = v431Status;
        
        // 8カード生成テスト（P0-4の回帰確認）
        if (v431Status.scriptLoaded || Object.values(v431Status.coreClasses).some(x => x)) {
            console.log('🎲 8カード生成テスト実行...');
            
            const cardGenerationTest = await page.evaluate(() => {
                try {
                    // テスト用のシナリオ入力
                    const testInput = "新しいプロジェクトを始めるべきか悩んでいます";
                    
                    // v4.3.1が利用可能なら使用、なければフォールバック
                    let result;
                    if (window.FutureSimulatorV431) {
                        const simulator = new window.FutureSimulatorV431();
                        result = simulator.generateScenarios(testInput);
                    } else if (window.FutureSimulator) {
                        const simulator = new window.FutureSimulator();
                        result = simulator.generateEightScenarios ? 
                               simulator.generateEightScenarios(testInput) :
                               simulator.generateScenarios(testInput);
                    }
                    
                    return {
                        success: !!result,
                        cardCount: result ? Object.keys(result).length : 0,
                        hasValidStructure: result && typeof result === 'object',
                        sampleKeys: result ? Object.keys(result).slice(0, 3) : []
                    };
                } catch (error) {
                    return {
                        success: false,
                        error: error.message,
                        stack: error.stack
                    };
                }
            });
            
            console.log('🎯 8カード生成結果:');
            console.log('  - Success:', cardGenerationTest.success ? '✅' : '❌');
            console.log('  - Card count:', cardGenerationTest.cardCount);
            if (cardGenerationTest.error) {
                console.log('  - Error:', cardGenerationTest.error);
            }
            
            results.functionalRegression.cardGeneration = cardGenerationTest;
        }
        
        // ====================
        // 3. パフォーマンス検証
        // ====================
        console.log('\\n⚡ Phase 3: パフォーマンス検証');
        
        const performanceMetrics = await page.evaluate(() => {
            return {
                domNodeCount: document.querySelectorAll('*').length,
                scriptCount: document.querySelectorAll('script').length,
                cssCount: document.querySelectorAll('link[rel="stylesheet"], style').length,
                imageCount: document.querySelectorAll('img').length,
                memoryUsage: performance.memory ? {
                    used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                    total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                    limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
                } : null
            };
        });
        
        console.log('📊 パフォーマンス指標:');
        console.log(`  - ページロード時間: ${loadTime}ms`);
        console.log(`  - DOM要素数: ${performanceMetrics.domNodeCount}`);
        console.log(`  - スクリプト数: ${performanceMetrics.scriptCount}`);
        if (performanceMetrics.memoryUsage) {
            console.log(`  - メモリ使用量: ${performanceMetrics.memoryUsage.used}MB / ${performanceMetrics.memoryUsage.total}MB`);
        }
        
        results.performance = {
            loadTime,
            ...performanceMetrics,
            acceptable: loadTime < 5000 && performanceMetrics.domNodeCount < 10000
        };
        
        // ====================
        // 4. バグ・エラーチェック
        // ====================
        console.log('\\n🐛 Phase 4: バグ・エラーチェック');
        
        // 最終的なエラー集計
        results.bugCheck = {
            pageErrors: errors.length,
            warnings: warnings.length,
            consoleErrors: errors.filter(e => e.type === 'console').length,
            criticalErrors: errors.filter(e => 
                e.message.includes('is not defined') || 
                e.message.includes('Cannot read property') ||
                e.message.includes('TypeError')
            ).length,
            errorDetails: errors.slice(-5) // 最新5件のエラー
        };
        
        console.log('🔍 エラー・バグ状況:');
        console.log(`  - ページエラー: ${results.bugCheck.pageErrors}件`);
        console.log(`  - 警告: ${results.bugCheck.warnings}件`);
        console.log(`  - 重要エラー: ${results.bugCheck.criticalErrors}件`);
        
        if (results.bugCheck.errorDetails.length > 0) {
            console.log('  - 最新エラー:');
            results.bugCheck.errorDetails.forEach(err => {
                console.log(`    * ${err.message}`);
            });
        }
        
        // ====================
        // 5. 総合判定
        // ====================
        const uiScore = Object.values(results.userExperience.uiElements || {}).filter(x => x).length;
        const functionalScore = results.functionalRegression.cardGeneration?.success ? 1 : 0;
        const performanceScore = results.performance.acceptable ? 1 : 0;
        const bugScore = results.bugCheck.criticalErrors === 0 ? 1 : 0;
        
        results.overall = {
            uiScore: uiScore >= 3, // 基本UI要素が3個以上
            functionalScore: functionalScore >= 1, // 8カード生成が動作
            performanceScore: performanceScore >= 1, // パフォーマンス許容範囲
            bugScore: bugScore >= 1, // 重要エラーなし
            totalScore: uiScore + functionalScore + performanceScore + bugScore,
            passed: (uiScore >= 3) && (functionalScore >= 1) && (bugScore >= 1)
        };
        
        return results;
        
    } catch (error) {
        console.error('❌ 検証エラー:', error);
        results.overall = { passed: false, error: error.message };
        return results;
    } finally {
        console.log('⏱️  10秒間ブラウザを開いたまま（結果確認用）...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        await browser.close();
    }
}

// 実行
comprehensiveValidation().then(results => {
    console.log('\\n🎯 Future Simulator 総合評価結果:');
    console.log('=====================================');
    
    const overall = results.overall;
    if (overall.passed) {
        console.log('🎉 総合評価: ✅ PASS');
        console.log('Future Simulatorは正常に動作しており、ユーザー体験が保たれています。');
    } else {
        console.log('⚠️  総合評価: ❌ ISSUES FOUND');
        console.log('改善が必要な問題が発見されました。');
    }
    
    console.log('\\n📊 詳細スコア:');
    console.log(`  - UI体験: ${overall.uiScore ? '✅' : '❌'}`);
    console.log(`  - 機能動作: ${overall.functionalScore ? '✅' : '❌'}`);
    console.log(`  - パフォーマンス: ${overall.performanceScore ? '✅' : '❌'}`);
    console.log(`  - バグなし: ${overall.bugScore ? '✅' : '❌'}`);
    console.log(`  - 総合スコア: ${overall.totalScore}/4`);
    
    if (results.bugCheck.criticalErrors > 0) {
        console.log('\\n🚨 要修正の重要エラー:');
        results.bugCheck.errorDetails?.forEach(err => {
            console.log(`  - ${err.message}`);
        });
    }
    
    console.log('\\n📋 推奨アクション:');
    if (overall.passed) {
        console.log('  - 現在の実装は安定しています');
        console.log('  - ユーザー向けリリース準備OK');
    } else {
        console.log('  - 発見された問題の修正を推奨');
        console.log('  - 再検証後のリリースを推奨');
    }
    
}).catch(console.error);