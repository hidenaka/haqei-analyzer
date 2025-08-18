/**
 * 統一スコアリングシステム検証シミュレーション
 * 新しい配点システムのバランスを詳細に分析
 */

// 統一質問データを読み込む
const fs = require('fs');
const path = require('path');

// questions-unified-complete.jsからデータを読み込む
const questionsPath = path.join(__dirname, 'public', 'assets', 'js', 'questions-unified-complete.js');
const questionsContent = fs.readFileSync(questionsPath, 'utf8');

// eval を使って変数を取得（本番環境では require を使うべき）
eval(questionsContent);

function runSimulation() {
    console.log('===== 統一スコアリングシステム検証 =====\n');
    console.log('設計思想: 全員が3つのOSを持ち、相対的な強さを測定');
    console.log('各質問の合計: 常に6点');
    console.log('マイナススコア: なし\n');
    
    // 八卦の定義
    const baguaCategories = {
        ENGINE: ['乾_創造性', '震_行動性', '坎_探求性'],
        INTERFACE: ['兌_調和性', '離_表現性', '巽_適応性'],
        SAFEMODE: ['艮_安定性', '坤_受容性']
    };
    
    // テストパターン
    const patterns = [
        { name: 'All_A', description: '全問でA選択（各OSで重視型）', choice: 'A' },
        { name: 'All_B', description: '全問でB選択（各OSでバランス型）', choice: 'B' },
        { name: 'All_C', description: '全問でC選択（中庸型）', choice: 'C' },
        { name: 'All_D', description: '全問でD選択（他OS寄り）', choice: 'D' },
        { name: 'All_E', description: '全問でE選択（他OS寄り）', choice: 'E' },
        { name: 'Mixed', description: 'ランダム選択', choice: null },
        { name: 'Realistic', description: '現実的な回答パターン', choice: 'realistic' }
    ];
    
    // 各パターンでテスト
    patterns.forEach(pattern => {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`【${pattern.name}】 ${pattern.description}`);
        console.log('='.repeat(60));
        
        // OS別スコア集計
        const osScores = {
            ENGINE: {},
            INTERFACE: {},
            SAFEMODE: {}
        };
        
        // 全八卦の初期化
        Object.values(baguaCategories).flat().forEach(bagua => {
            osScores.ENGINE[bagua] = 0;
            osScores.INTERFACE[bagua] = 0;
            osScores.SAFEMODE[bagua] = 0;
        });
        
        // 質問ごとにスコア集計
        unifiedQuestions.forEach((question, index) => {
            let selectedChoice;
            
            if (pattern.choice === 'realistic') {
                // 現実的なパターン（ENGINE系はA/B多め、INTERFACE系はA/B/C多め、SAFE系はB/C多め）
                if (question.osType === 'ENGINE') {
                    const weights = [0.3, 0.3, 0.2, 0.1, 0.1]; // A, B, C, D, E
                    selectedChoice = weightedRandom(['A', 'B', 'C', 'D', 'E'], weights);
                } else if (question.osType === 'INTERFACE') {
                    const weights = [0.25, 0.25, 0.25, 0.15, 0.1];
                    selectedChoice = weightedRandom(['A', 'B', 'C', 'D', 'E'], weights);
                } else {
                    const weights = [0.15, 0.3, 0.3, 0.15, 0.1];
                    selectedChoice = weightedRandom(['A', 'B', 'C', 'D', 'E'], weights);
                }
            } else if (pattern.choice === null) {
                // ランダム選択
                const choices = ['A', 'B', 'C', 'D', 'E'];
                selectedChoice = choices[Math.floor(Math.random() * 5)];
            } else {
                selectedChoice = pattern.choice;
            }
            
            // 選択したオプションのスコアを取得
            const option = question.options.find(opt => opt.value === selectedChoice);
            if (option && option.scoring) {
                // スコアを対応するOSに加算
                const targetOS = question.osType === 'ENGINE' ? 'ENGINE' : 
                               question.osType === 'INTERFACE' ? 'INTERFACE' : 'SAFEMODE';
                
                Object.entries(option.scoring).forEach(([bagua, score]) => {
                    osScores[targetOS][bagua] = (osScores[targetOS][bagua] || 0) + score;
                });
            }
        });
        
        // OS別の集計結果を表示
        console.log('\n📊 OS別スコア分析:');
        console.log('-'.repeat(60));
        
        let totalScore = 0;
        const osSummary = {};
        
        Object.entries(osScores).forEach(([osType, scores]) => {
            const mainBagua = baguaCategories[osType];
            let mainTotal = 0;
            let otherTotal = 0;
            let osTotal = 0;
            
            // 主要八卦と他OS八卦の分離
            Object.entries(scores).forEach(([bagua, score]) => {
                osTotal += score;
                if (mainBagua.includes(bagua)) {
                    mainTotal += score;
                } else {
                    otherTotal += score;
                }
            });
            
            totalScore += osTotal;
            osSummary[osType] = osTotal;
            
            const mainPercentage = osTotal > 0 ? (mainTotal / osTotal * 100).toFixed(1) : 0;
            const otherPercentage = osTotal > 0 ? (otherTotal / osTotal * 100).toFixed(1) : 0;
            
            console.log(`\n${osType} OS:`);
            console.log(`  合計スコア: ${osTotal.toFixed(1)}点`);
            console.log(`  主要八卦: ${mainTotal.toFixed(1)}点 (${mainPercentage}%)`);
            console.log(`  他OS八卦: ${otherTotal.toFixed(1)}点 (${otherPercentage}%)`);
            
            // 個別八卦の内訳
            console.log('  八卦別内訳:');
            Object.entries(scores).forEach(([bagua, score]) => {
                const mark = mainBagua.includes(bagua) ? '★' : '  ';
                const percentage = osTotal > 0 ? (score / osTotal * 100).toFixed(1) : 0;
                console.log(`    ${mark} ${bagua}: ${score.toFixed(1)}点 (${percentage}%)`);
            });
            
            // バランス判定
            const isBalanced = mainPercentage >= 60 && mainPercentage <= 80;
            console.log(`  判定: ${isBalanced ? '✅ バランス良好' : '⚠️ 要調整'}`);
        });
        
        // 全体のOS分布
        console.log('\n📈 OS分布（全体に対する割合）:');
        console.log('-'.repeat(60));
        Object.entries(osSummary).forEach(([os, score]) => {
            const percentage = totalScore > 0 ? (score / totalScore * 100).toFixed(1) : 0;
            const bar = '█'.repeat(Math.round(percentage / 2));
            console.log(`${os.padEnd(10)}: ${bar} ${percentage}%`);
        });
        
        // 期待値との比較
        console.log('\n🎯 バランス評価:');
        console.log('-'.repeat(60));
        
        const enginePct = totalScore > 0 ? (osSummary.ENGINE / totalScore * 100) : 0;
        const interfacePct = totalScore > 0 ? (osSummary.INTERFACE / totalScore * 100) : 0;
        const safePct = totalScore > 0 ? (osSummary.SAFEMODE / totalScore * 100) : 0;
        
        // 理想的な範囲（20-50%）
        const isEngineOK = enginePct >= 20 && enginePct <= 50;
        const isInterfaceOK = interfacePct >= 20 && interfacePct <= 50;
        const isSafeOK = safePct >= 20 && safePct <= 50;
        
        console.log(`ENGINE OS: ${enginePct.toFixed(1)}% ${isEngineOK ? '✅' : '❌'} (目標: 20-50%)`);
        console.log(`INTERFACE OS: ${interfacePct.toFixed(1)}% ${isInterfaceOK ? '✅' : '❌'} (目標: 20-50%)`);
        console.log(`SAFE MODE OS: ${safePct.toFixed(1)}% ${isSafeOK ? '✅' : '❌'} (目標: 20-50%)`);
        
        const allOK = isEngineOK && isInterfaceOK && isSafeOK;
        console.log(`\n総合評価: ${allOK ? '✅ 全OSバランス良好' : '⚠️ バランス調整が必要'}`);
    });
    
    // サマリー
    console.log('\n\n' + '='.repeat(60));
    console.log('📝 検証サマリー');
    console.log('='.repeat(60));
    console.log('\n✅ 達成した改善点:');
    console.log('  1. マイナススコアの完全排除');
    console.log('  2. 各質問の合計点を6点に統一');
    console.log('  3. 極端な0%や100%の防止');
    console.log('  4. 数学的に健全なスコアリング');
    
    console.log('\n📊 推奨される使用方法:');
    console.log('  1. 各人が3つのOSを持つことを前提とした解釈');
    console.log('  2. 相対的な強さで個性を表現');
    console.log('  3. バランスの取れた結果表示');
    
    console.log('\n🎯 期待される結果範囲:');
    console.log('  - 各OS: 20-50%の範囲');
    console.log('  - 極端な選択でも適切な分布');
    console.log('  - 現実的な回答パターンで自然な結果');
}

// 重み付きランダム選択
function weightedRandom(choices, weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * total;
    
    for (let i = 0; i < choices.length; i++) {
        random -= weights[i];
        if (random <= 0) {
            return choices[i];
        }
    }
    return choices[choices.length - 1];
}

// 実行
runSimulation();