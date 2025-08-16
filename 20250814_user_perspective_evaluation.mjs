/**
 * ユーザー目線での最終評価
 * 実際のユーザージャーニーを体験し、改善点を洗い出し
 */

import { chromium } from 'playwright';

async function userPerspectiveEvaluation() {
    console.log('👤 ユーザー目線での最終評価');
    console.log('=====================================');
    console.log('シナリオ: 新しいユーザーが初めてHaQeiを使用');
    console.log('目的: 転職について客観的な分析を求める\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        
        // 初回アクセス
        console.log('【Step 1】サイトに初回アクセス');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        
        await page.waitForTimeout(3000);
        
        // 第一印象の評価
        const firstImpression = await page.evaluate(() => {
            const title = document.querySelector('h1')?.textContent?.trim();
            const subtitle = document.querySelector('h1')?.nextElementSibling?.textContent?.trim();
            const description = document.querySelector('p')?.textContent?.trim();
            
            // 統計情報の確認
            const statsElements = document.querySelectorAll('[class*="stat"], .text-gray-500, .text-sm');
            const hasStats = Array.from(statsElements).some(el => 
                el.textContent.includes('384') || 
                el.textContent.includes('分析精度') ||
                el.textContent.includes('パターン')
            );
            
            // 入力欄の確認
            const textarea = document.querySelector('textarea, #worryInput, #situation-text');
            const inputVisible = textarea && window.getComputedStyle(textarea).display !== 'none';
            const placeholder = textarea?.placeholder;
            
            // ボタンの確認
            const button = document.querySelector('button[type="submit"], .analyze-btn, #aiGuessBtn');
            const buttonText = button?.textContent?.trim();
            const buttonVisible = button && window.getComputedStyle(button).display !== 'none';
            
            // 全体的な印象
            const bodyText = document.body.textContent;
            const hasEmotionalWords = /悩み|迷い|不安|心配|解決|答え/.test(bodyText);
            const hasAnalyticalWords = /分析|パターン|384|データ|予測|確率/.test(bodyText);
            
            return {
                title,
                subtitle,
                description,
                hasStats,
                textarea: {
                    visible: inputVisible,
                    placeholder,
                    id: textarea?.id
                },
                button: {
                    visible: buttonVisible,
                    text: buttonText
                },
                impression: {
                    hasEmotionalWords,
                    hasAnalyticalWords,
                    overall: hasAnalyticalWords && !hasEmotionalWords ? 'analytical' : 
                             hasEmotionalWords ? 'emotional' : 'neutral'
                }
            };
        });
        
        console.log('\\n📊 第一印象の評価:');
        console.log('--------------------------------');
        console.log(`タイトル: "${firstImpression.title}"`);
        console.log(`サブタイトル: "${firstImpression.subtitle}"`);
        console.log(`統計情報表示: ${firstImpression.hasStats ? '✅ あり' : '❌ なし'}`);
        console.log(`全体の印象: ${firstImpression.impression.overall}`);
        
        if (firstImpression.impression.overall === 'emotional') {
            console.log('⚠️ まだ感情的な表現が残っている');
        } else if (firstImpression.impression.overall === 'analytical') {
            console.log('✅ 客観的・分析的な印象を与えている');
        }
        
        // 入力体験の評価
        console.log('\\n【Step 2】入力体験の評価');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const inputExperience = await page.evaluate(() => {
            const textarea = document.querySelector('textarea, #worryInput, #situation-text');
            if (!textarea) return { found: false };
            
            const rect = textarea.getBoundingClientRect();
            const style = window.getComputedStyle(textarea);
            
            return {
                found: true,
                id: textarea.id,
                placeholder: textarea.placeholder,
                visible: style.display !== 'none' && style.visibility !== 'hidden',
                size: {
                    width: rect.width,
                    height: rect.height
                },
                accessible: rect.width > 0 && rect.height > 0
            };
        });
        
        if (inputExperience.found && inputExperience.accessible) {
            console.log(`✅ 入力欄発見: ID="${inputExperience.id}"`);
            console.log(`   サイズ: ${inputExperience.size.width}×${inputExperience.size.height}px`);
            console.log(`   プレースホルダー: "${inputExperience.placeholder}"`);
            
            // プレースホルダーの評価
            const placeholderScore = (() => {
                if (!inputExperience.placeholder) return 0;
                const emotional = /悩み|迷い|不安|心配/.test(inputExperience.placeholder);
                const objective = /状況|客観的|記述|データ|環境/.test(inputExperience.placeholder);
                
                if (objective && !emotional) return 100;
                if (objective && emotional) return 60;
                if (!objective && !emotional) return 40;
                return 20;
            })();
            
            console.log(`   プレースホルダー評価: ${placeholderScore}/100点`);
            
        } else {
            console.log('❌ 入力欄が見つからない、またはアクセスできない');
        }
        
        // 実際に入力してみる
        console.log('\\n【Step 3】実際の分析体験');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const testInput = '現在IT企業で5年勤務。技術スキルの成長停滞を感じており、転職を検討中。ただし家族もおり、安定性も重要。新しい環境での成長と現在の安定のどちらを優先すべきか判断に迷っている。';
        
        await page.fill('textarea, #worryInput, #situation-text', testInput);
        console.log('✅ テスト用状況を入力');
        
        // 分析実行
        const analysisStartTime = Date.now();
        await page.click('button[type="submit"], .analyze-btn, #aiGuessBtn');
        console.log('🔄 分析実行をクリック');
        
        // 結果表示を待機
        try {
            await page.waitForSelector('.score-comparison-chart, .scenario-card, .eight-scenarios', { timeout: 15000 });
            const analysisTime = Date.now() - analysisStartTime;
            console.log(`⏱️ 分析完了: ${(analysisTime/1000).toFixed(1)}秒`);
            
            // 結果の評価
            await page.waitForTimeout(2000);
            
            const results = await page.evaluate(() => {
                // スコアグラフ
                const scoreChart = document.querySelector('.score-comparison-chart, canvas');
                const hasScoreVisualization = !!scoreChart;
                
                // 8カード
                const scenarioCards = document.querySelectorAll('.scenario-card, [class*="scenario"], [class*="card"]');
                const cardCount = scenarioCards.length;
                
                // グラフの詳細
                const hasH384Reference = document.body.textContent.includes('384') || document.body.textContent.includes('H384');
                const hasScoreNumbers = /S[1-7]|スコア|Score|\d+%/.test(document.body.textContent);
                
                // カードの内容確認
                const cardSample = Array.from(scenarioCards).slice(0, 3).map(card => ({
                    title: card.querySelector('[class*="title"], h3, h4')?.textContent?.trim(),
                    content: card.textContent?.substring(0, 100) + '...'
                }));
                
                return {
                    scoreVisualization: hasScoreVisualization,
                    cardCount,
                    hasH384Reference,
                    hasScoreNumbers,
                    cardSample
                };
            });
            
            console.log('\\n📈 結果表示の評価:');
            console.log('--------------------------------');
            console.log(`スコアグラフ: ${results.scoreVisualization ? '✅ 表示' : '❌ 非表示'}`);
            console.log(`H384データベース言及: ${results.hasH384Reference ? '✅ あり' : '❌ なし'}`);
            console.log(`スコア数値表示: ${results.hasScoreNumbers ? '✅ あり' : '❌ なし'}`);
            console.log(`シナリオカード: ${results.cardCount}個`);
            
            if (results.cardCount === 8) {
                console.log('✅ 8つのシナリオ正常表示');
            } else {
                console.log(`⚠️ カード数が不足: ${results.cardCount}/8`);
            }
            
            if (results.cardSample.length > 0) {
                console.log('\\nカードサンプル:');
                results.cardSample.forEach((card, i) => {
                    console.log(`  ${i+1}. "${card.title}"`);
                });
            }
            
        } catch (error) {
            console.log('❌ 分析結果の表示でタイムアウト');
            console.log('   期待される要素が15秒以内に表示されなかった');
        }
        
        // スクリーンショット撮影
        await page.screenshot({ 
            path: '20250814_final_user_perspective.png',
            fullPage: false
        });
        
        console.log('\\n📸 最終画面のスクリーンショット保存');
        
        // 総合評価
        console.log('\\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎯 ユーザー目線での総合評価');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        let totalScore = 0;
        let maxScore = 100;
        
        // 評価項目
        console.log('\\n【評価項目】');
        
        // 1. 第一印象（30点）
        const impressionScore = firstImpression.impression.overall === 'analytical' ? 30 : 
                               firstImpression.impression.overall === 'neutral' ? 20 : 10;
        totalScore += impressionScore;
        console.log(`第一印象（客観性）: ${impressionScore}/30点`);
        
        // 2. 入力体験（25点）
        const inputScore = inputExperience.accessible ? 25 : 0;
        totalScore += inputScore;
        console.log(`入力体験: ${inputScore}/25点`);
        
        // 3. 結果表示（45点）
        const resultScore = (() => {
            let score = 0;
            if (results?.scoreVisualization) score += 15;
            if (results?.hasH384Reference) score += 15;
            if (results?.cardCount >= 6) score += 15;
            return score;
        })();
        totalScore += resultScore;
        console.log(`結果表示: ${resultScore}/45点`);
        
        const percentage = Math.round((totalScore / maxScore) * 100);
        
        console.log('\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`総合評価: ${totalScore}/${maxScore}点 (${percentage}%)`);
        
        if (percentage >= 80) {
            console.log('🏆 優秀 - ユーザーが期待する体験を提供');
            console.log('\\n✅ 客観的分析ツールとしての価値を十分に伝えている');
        } else if (percentage >= 60) {
            console.log('✅ 良好 - 基本的な体験は提供できている');
            console.log('\\n⚠️ さらなる改善で理想的な体験に近づけられる');
        } else {
            console.log('⚠️ 要改善 - ユーザー体験に課題がある');
        }
        
        console.log('\\n【改善提案】');
        if (impressionScore < 25) {
            console.log('• タイトル・説明文の更なる客観化');
        }
        if (inputScore < 20) {
            console.log('• 入力欄の視認性・アクセシビリティ向上');
        }
        if (resultScore < 35) {
            console.log('• 結果表示の安定性とデータ視覚化の強化');
        }
        
        return {
            totalScore,
            percentage,
            firstImpression,
            inputExperience,
            results
        };
        
    } catch (error) {
        console.error('❌ 評価エラー:', error);
        return null;
    } finally {
        console.log('\\n⏱️ 30秒間画面を確認...');
        await new Promise(resolve => setTimeout(resolve, 30000));
        await browser.close();
    }
}

// 実行
userPerspectiveEvaluation().then(result => {
    if (result) {
        console.log('\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📋 評価完了サマリー');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`最終スコア: ${result.totalScore}/100点 (${result.percentage}%)`);
        
        if (result.percentage >= 80) {
            console.log('\\n🎉 HaQeiは客観的分析ツールとして');
            console.log('   ユーザーの期待を満たしています！');
        }
    }
}).catch(console.error);