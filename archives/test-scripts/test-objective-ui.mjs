/**
 * 客観的分析ツールUIテスト
 * 期待される要素と表現の確認
 */

import { chromium } from 'playwright';

async function testObjectiveUI() {
    console.log('🔬 客観的分析ツールUI - テスト');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        
        await page.waitForTimeout(2000);
        
        console.log('📊 期待される要素の確認');
        console.log('--------------------------------');
        
        // 期待される要素
        const expectedElements = {
            // 分析的な表現
            analyticalTitle: {
                selector: 'h1',
                expectedText: ['分析', '予測', 'システム', '易経'],
                shouldNotContain: ['悩み', '解決', '答え', '寄り添']
            },
            
            // データ表示
            dataDisplay: {
                selector: '.stats, .data-stats, .analysis-stats',
                expectedContent: ['384', 'パターン', '確率', 'スコア']
            },
            
            // 入力欄
            inputArea: {
                selector: '#situation-text, textarea',
                placeholder: ['状況', '客観的', '記述'],
                shouldNotContain: ['悩み', '迷い', '不安']
            },
            
            // 分析ボタン
            analyzeButton: {
                selector: '.analyze-btn, button[type="submit"]',
                expectedText: ['分析', '実行', '開始'],
                shouldNotContain: ['解決', '見つける', '答え']
            }
        };
        
        // 各要素をチェック
        const results = await page.evaluate((expected) => {
            const testResults = {};
            
            // タイトルチェック
            const title = document.querySelector('h1');
            const titleText = title?.textContent || '';
            testResults.title = {
                exists: !!title,
                text: titleText,
                hasAnalyticalTerms: false,
                hasEmotionalTerms: false
            };
            
            // 分析的用語チェック
            ['分析', '予測', 'システム', '易経', '384'].forEach(term => {
                if (titleText.includes(term)) {
                    testResults.title.hasAnalyticalTerms = true;
                }
            });
            
            // 感情的用語チェック
            ['悩み', '解決', '答え', '寄り添'].forEach(term => {
                if (titleText.includes(term)) {
                    testResults.title.hasEmotionalTerms = true;
                }
            });
            
            // 入力欄チェック（複数のテキストエリアを確認）
            const allTextareas = document.querySelectorAll('textarea');
            const worryInput = document.querySelector('#worryInput');
            const situationText = document.querySelector('#situation-text');
            
            // 実際に表示されているテキストエリアを特定
            let activeTextarea = null;
            if (worryInput && window.getComputedStyle(worryInput).display !== 'none') {
                activeTextarea = worryInput;
            } else if (situationText && window.getComputedStyle(situationText).display !== 'none') {
                activeTextarea = situationText;
            } else if (allTextareas.length > 0) {
                activeTextarea = allTextareas[0];
            }
            
            testResults.input = {
                exists: !!activeTextarea,
                placeholder: activeTextarea?.placeholder || '',
                id: activeTextarea?.id || '',
                allPlaceholders: Array.from(allTextareas).map(t => ({ id: t.id, placeholder: t.placeholder })),
                hasObjectiveTerms: false,
                hasEmotionalTerms: false
            };
            
            if (activeTextarea?.placeholder) {
                ['状況', '客観的', '記述', 'データ'].forEach(term => {
                    if (activeTextarea.placeholder.includes(term)) {
                        testResults.input.hasObjectiveTerms = true;
                    }
                });
                
                ['悩み', '迷い', '不安', '心配'].forEach(term => {
                    if (activeTextarea.placeholder.includes(term)) {
                        testResults.input.hasEmotionalTerms = true;
                    }
                });
            }
            
            // ボタンチェック
            const button = document.querySelector('.analyze-btn, button[type="submit"]');
            const buttonText = button?.textContent || '';
            testResults.button = {
                exists: !!button,
                text: buttonText,
                hasAnalyticalTerms: false,
                hasEmotionalTerms: false
            };
            
            ['分析', '実行', '開始', '予測'].forEach(term => {
                if (buttonText.includes(term)) {
                    testResults.button.hasAnalyticalTerms = true;
                }
            });
            
            ['解決', '見つける', '答え', '癒'].forEach(term => {
                if (buttonText.includes(term)) {
                    testResults.button.hasEmotionalTerms = true;
                }
            });
            
            // データ表示要素
            const dataElements = document.querySelectorAll('.stats, .data-stats, .analysis-stats, .metrics');
            testResults.dataDisplay = {
                count: dataElements.length,
                has384Reference: false,
                hasScoreDisplay: false
            };
            
            document.body.textContent.split('\n').forEach(line => {
                if (line.includes('384')) testResults.dataDisplay.has384Reference = true;
                if (line.includes('スコア') || line.includes('Score')) testResults.dataDisplay.hasScoreDisplay = true;
            });
            
            return testResults;
        }, expectedElements);
        
        // 結果出力
        console.log('\n📈 テスト結果:');
        console.log('--------------------------------');
        
        // タイトル評価
        console.log('\n【タイトル】');
        if (results.title.hasAnalyticalTerms && !results.title.hasEmotionalTerms) {
            console.log('✅ 分析的表現を使用');
        } else if (results.title.hasEmotionalTerms) {
            console.log('❌ 感情的表現が含まれている');
            console.log(`   現在: "${results.title.text}"`);
            console.log('   推奨: "易経未来分析システム" or "384パターン状況分析"');
        } else {
            console.log('⚠️ 分析的表現が不足');
        }
        
        // 入力欄評価
        console.log('\n【入力欄】');
        if (results.input.hasObjectiveTerms && !results.input.hasEmotionalTerms) {
            console.log('✅ 客観的な表現を使用');
        } else if (results.input.hasEmotionalTerms) {
            console.log('❌ 感情的表現が含まれている');
            console.log(`   現在ID: ${results.input.id}`);
            console.log(`   現在プレースホルダー: "${results.input.placeholder}"`);
            console.log('   推奨: "現在の状況を客観的に記述してください"');
            console.log('\n   全入力欄の状況:');
            results.input.allPlaceholders.forEach(p => {
                console.log(`     ${p.id}: "${p.placeholder}"`);
            });
        } else {
            console.log('⚠️ より客観的な表現が必要');
        }
        
        // ボタン評価
        console.log('\n【分析ボタン】');
        if (results.button.hasAnalyticalTerms && !results.button.hasEmotionalTerms) {
            console.log('✅ 分析的表現を使用');
        } else if (results.button.hasEmotionalTerms) {
            console.log('❌ 感情的表現が含まれている');
            console.log(`   現在: "${results.button.text}"`);
            console.log('   推奨: "分析実行" or "パターン分析開始"');
        } else {
            console.log('⚠️ より分析的な表現が必要');
        }
        
        // データ表示評価
        console.log('\n【データ表示】');
        if (results.dataDisplay.has384Reference) {
            console.log('✅ 384パターンへの言及あり');
        } else {
            console.log('❌ 384パターンへの言及なし');
        }
        
        if (results.dataDisplay.hasScoreDisplay) {
            console.log('✅ スコア表示あり');
        } else {
            console.log('⚠️ スコア表示を追加すべき');
        }
        
        // 総合評価
        let score = 0;
        if (results.title.hasAnalyticalTerms && !results.title.hasEmotionalTerms) score += 25;
        if (results.input.hasObjectiveTerms && !results.input.hasEmotionalTerms) score += 25;
        if (results.button.hasAnalyticalTerms && !results.button.hasEmotionalTerms) score += 25;
        if (results.dataDisplay.has384Reference && results.dataDisplay.hasScoreDisplay) score += 25;
        
        console.log('\n=====================================');
        console.log(`総合スコア: ${score}/100点`);
        
        if (score >= 75) {
            console.log('✅ 客観的分析ツールとして適切');
        } else {
            console.log('❌ 改善が必要');
            console.log('\n推奨される変更:');
            console.log('1. タイトルを「易経未来分析システム」に変更');
            console.log('2. 入力欄のプレースホルダーを客観的表現に');
            console.log('3. ボタンテキストを「分析実行」に');
            console.log('4. 384パターンとスコアを明示的に表示');
        }
        
        return results;
        
    } catch (error) {
        console.error('❌ テストエラー:', error);
    } finally {
        await browser.close();
    }
}

// 実行
testObjectiveUI().catch(console.error);