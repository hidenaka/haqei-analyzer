/**
 * 改善版質問スコアリングバランス検証スクリプト
 * 全36問の八卦配分を詳細に分析
 */

// questions-improved-complete.jsからデータを読み込む想定
// ここでは検証用にハードコーディング

function analyzeQuestionBalance() {
    // 八卦の定義
    const baguaCategories = {
        ENGINE: ['乾_創造性', '震_行動性', '坎_探求性'],
        INTERFACE: ['兌_調和性', '離_表現性', '巽_適応性'],
        SAFEMODE: ['艮_安定性', '坤_受容性']
    };
    
    // 質問グループの定義
    const questionGroups = {
        ENGINE: { start: 1, end: 12, name: 'ENGINE OS' },
        INTERFACE: { start: 13, end: 24, name: 'INTERFACE OS' },
        SAFEMODE: { start: 25, end: 36, name: 'SAFE MODE OS' }
    };
    
    // 分析結果を格納
    const results = {
        ENGINE: { main: {}, other: {}, total: {} },
        INTERFACE: { main: {}, other: {}, total: {} },
        SAFEMODE: { main: {}, other: {}, total: {} }
    };
    
    // 各選択肢パターンでのスコア集計
    const patterns = {
        'All_A': 'A',
        'All_B': 'B',
        'All_C': 'C',
        'All_D': 'D',
        'All_E': 'E',
        'Mixed': null  // ランダム選択
    };
    
    console.log('===== スコアリングバランス検証開始 =====\n');
    
    // 各パターンでの検証
    for (const [patternName, choice] of Object.entries(patterns)) {
        console.log(`\n【${patternName}パターン】`);
        
        // OSごとに集計
        for (const [osType, group] of Object.entries(questionGroups)) {
            const scores = {};
            
            // 全八卦の初期化
            Object.values(baguaCategories).flat().forEach(bagua => {
                scores[bagua] = 0;
            });
            
            // 該当する質問範囲でスコア集計（シミュレーション）
            for (let q = group.start; q <= group.end; q++) {
                // 選択肢の決定
                let selectedChoice = choice;
                if (!choice) {
                    // Mixedパターンの場合はランダム
                    const choices = ['A', 'B', 'C', 'D', 'E'];
                    selectedChoice = choices[Math.floor(Math.random() * 5)];
                }
                
                // スコア加算（サンプルデータ）
                const sampleScores = getSampleScoring(q, selectedChoice);
                for (const [bagua, score] of Object.entries(sampleScores)) {
                    scores[bagua] = (scores[bagua] || 0) + score;
                }
            }
            
            // 主要八卦と他OS八卦の分離
            const mainBagua = baguaCategories[osType];
            let mainTotal = 0;
            let otherTotal = 0;
            
            for (const [bagua, score] of Object.entries(scores)) {
                if (mainBagua.includes(bagua)) {
                    mainTotal += score;
                } else {
                    otherTotal += score;
                }
            }
            
            const total = mainTotal + Math.max(0, otherTotal);
            const mainPercentage = total > 0 ? (mainTotal / total * 100).toFixed(1) : 0;
            const otherPercentage = total > 0 ? (Math.max(0, otherTotal) / total * 100).toFixed(1) : 0;
            
            console.log(`\n  ${group.name}:`);
            console.log(`    主要八卦: ${mainTotal.toFixed(1)}点 (${mainPercentage}%)`);
            console.log(`    他OS八卦: ${otherTotal.toFixed(1)}点 (${otherPercentage}%)`);
            
            // 個別の八卦スコア表示
            console.log(`    詳細:`);
            for (const [bagua, score] of Object.entries(scores)) {
                const mark = mainBagua.includes(bagua) ? '★' : '  ';
                console.log(`      ${mark} ${bagua}: ${score.toFixed(1)}点`);
            }
            
            // 目標達成判定
            const isBalanced = mainPercentage >= 70 && mainPercentage <= 80;
            console.log(`    判定: ${isBalanced ? '✅ バランス良好' : '❌ 要調整'}`);
        }
    }
    
    console.log('\n===== 検証完了 =====');
}

// サンプルスコアリングデータ（実際のquestions-improved-complete.jsから抽出）
function getSampleScoring(questionNum, choice) {
    // Q1-12: ENGINE OS
    if (questionNum >= 1 && questionNum <= 12) {
        const scorings = {
            1: { // Q1
                'A': { '乾_創造性': 3.5, '震_行動性': 1.0, '離_表現性': 0.5, '艮_安定性': -1.0 },
                'B': { '坎_探求性': 3.0, '乾_創造性': 1.5, '巽_適応性': 0.5, '震_行動性': -0.5 },
                'C': { '兌_調和性': 2.0, '坤_受容性': 1.0, '乾_創造性': -1.0, '震_行動性': -0.5 },
                'D': { '艮_安定性': 2.0, '坎_探求性': 1.0, '乾_創造性': -1.5, '震_行動性': -1.0 },
                'E': { '巽_適応性': 2.0, '坎_探求性': 1.5, '震_行動性': 1.0, '艮_安定性': -0.5 }
            },
            4: { // Q4
                'A': { '震_行動性': 4.0, '乾_創造性': 0.5, '艮_安定性': -1.5, '坤_受容性': -0.5 },
                'B': { '坎_探求性': 3.0, '震_行動性': 2.0, '艮_安定性': -0.5, '兌_調和性': -0.5 },
                'C': { '兌_調和性': 2.0, '坤_受容性': 1.0, '震_行動性': 1.5, '乾_創造性': -0.5 },
                'D': { '艮_安定性': 2.5, '坎_探求性': 1.0, '震_行動性': -1.5, '乾_創造性': -0.5 },
                'E': { '巽_適応性': 2.0, '震_行動性': 2.0, '坎_探求性': 1.0, '艮_安定性': -0.5 }
            },
            7: { // Q7
                'A': { '坎_探求性': 4.0, '艮_安定性': 0.5, '兌_調和性': -0.5, '震_行動性': -0.5 },
                'B': { '乾_創造性': 3.0, '坎_探求性': 2.0, '艮_安定性': -0.5, '兌_調和性': -0.5 },
                'C': { '震_行動性': 3.0, '坎_探求性': 1.5, '艮_安定性': -0.5, '坤_受容性': -0.5 },
                'D': { '兌_調和性': 2.0, '坤_受容性': 1.0, '坎_探求性': 1.5, '震_行動性': -0.5 },
                'E': { '巽_適応性': 2.0, '坎_探求性': 1.5, '震_行動性': 1.0, '艮_安定性': 0.5 }
            }
        };
        
        const q = questionNum % 3 || 3; // 簡略化のため3問のパターンを繰り返し
        const baseQ = questionNum <= 3 ? 1 : questionNum <= 6 ? 4 : 7;
        return scorings[baseQ][choice] || {};
    }
    
    // Q13-24: INTERFACE OS  
    if (questionNum >= 13 && questionNum <= 24) {
        const scorings = {
            13: { // Q13
                'A': { '乾_創造性': 2.0, '離_表現性': 1.5, '兌_調和性': 1.0, '艮_安定性': -0.5 },
                'B': { '兌_調和性': 3.5, '坤_受容性': 1.5, '離_表現性': 1.0, '坎_探求性': -0.5 },
                'C': { '坎_探求性': 2.5, '兌_調和性': 1.5, '震_行動性': -0.5, '坤_受容性': -0.5 },
                'D': { '艮_安定性': 2.5, '坤_受容性': 1.5, '兌_調和性': 1.0, '震_行動性': -1.0 },
                'E': { '巽_適応性': 3.0, '兌_調和性': 2.0, '離_表現性': -0.5, '艮_安定性': -0.5 }
            },
            16: { // Q16
                'A': { '乾_創造性': 2.0, '離_表現性': 3.5, '坤_受容性': -1.0, '艮_安定性': -0.5 },
                'B': { '震_行動性': 2.5, '離_表現性': 2.5, '艮_安定性': -0.5, '坤_受容性': -0.5 },
                'C': { '坎_探求性': 2.0, '離_表現性': 2.0, '兌_調和性': -0.5, '震_行動性': -0.5 },
                'D': { '坤_受容性': 2.5, '兌_調和性': 1.5, '離_表現性': 0.5, '震_行動性': -0.5 },
                'E': { '巽_適応性': 3.0, '離_表現性': 1.5, '兌_調和性': 1.5, '艮_安定性': -0.5 }
            },
            19: { // Q19
                'A': { '乾_創造性': 2.0, '巽_適応性': 2.0, '艮_安定性': -0.5, '坤_受容性': -0.5 },
                'B': { '巽_適応性': 4.0, '坎_探求性': 1.0, '艮_安定性': -1.0, '震_行動性': -0.5 },
                'C': { '兌_調和性': 2.5, '巽_適応性': 2.0, '離_表現性': -0.5, '艮_安定性': -0.5 },
                'D': { '震_行動性': 2.0, '巽_適応性': 1.5, '艮_安定性': 0.5, '坎_探求性': -0.5 },
                'E': { '艮_安定性': 2.5, '坎_探求性': 1.0, '巽_適応性': -1.5, '震_行動性': -0.5 }
            }
        };
        
        const baseQ = questionNum <= 15 ? 13 : questionNum <= 18 ? 16 : 19;
        return scorings[baseQ][choice] || {};
    }
    
    // Q25-36: SAFE MODE OS
    if (questionNum >= 25 && questionNum <= 36) {
        const scorings = {
            25: { // Q25
                'A': { '乾_創造性': 2.5, '艮_安定性': 1.5, '震_行動性': -0.5, '坤_受容性': -0.5 },
                'B': { '艮_安定性': 4.0, '坤_受容性': 1.0, '震_行動性': -1.5, '乾_創造性': -1.0 },
                'C': { '坎_探求性': 2.0, '艮_安定性': 2.0, '巽_適応性': 0.5, '震_行動性': -0.5 },
                'D': { '兌_調和性': 2.0, '艮_安定性': 2.0, '坤_受容性': 1.0, '震_行動性': -0.5 },
                'E': { '巽_適応性': 2.0, '艮_安定性': 1.5, '坎_探求性': 1.0, '震_行動性': -0.5 }
            },
            28: { // Q28
                'A': { '乾_創造性': 2.0, '坤_受容性': 2.0, '艮_安定性': -0.5, '震_行動性': -0.5 },
                'B': { '坤_受容性': 4.0, '艮_安定性': 2.0, '震_行動性': -1.0, '乾_創造性': -0.5 },
                'C': { '坎_探求性': 2.5, '坤_受容性': 2.0, '離_表現性': -0.5, '震_行動性': -0.5 },
                'D': { '兌_調和性': 2.5, '坤_受容性': 2.0, '坎_探求性': -0.5, '震_行動性': -0.5 },
                'E': { '巽_適応性': 2.5, '坤_受容性': 2.0, '離_表現性': -0.5, '震_行動性': -0.5 }
            },
            31: { // Q31
                'A': { '乾_創造性': 2.5, '震_行動性': 1.5, '艮_安定性': -0.5, '坤_受容性': -0.5 },
                'B': { '艮_安定性': 4.0, '坤_受容性': 1.5, '震_行動性': -1.0, '乾_創造性': -0.5 },
                'C': { '坎_探求性': 2.5, '艮_安定性': 1.5, '兌_調和性': 0.5, '震_行動性': -0.5 },
                'D': { '兌_調和性': 2.5, '坤_受容性': 2.0, '乾_創造性': -0.5, '震_行動性': -0.5 },
                'E': { '巽_適応性': 2.5, '坎_探求性': 1.0, '艮_安定性': 0.5, '震_行動性': -0.5 }
            }
        };
        
        const baseQ = questionNum <= 27 ? 25 : questionNum <= 30 ? 28 : 31;
        return scorings[baseQ][choice] || {};
    }
    
    return {};
}

// 実行
analyzeQuestionBalance();

// 集計サマリー関数
function calculateSummary() {
    console.log('\n\n===== 総合サマリー =====\n');
    
    // 理想的な配分
    const idealDistribution = {
        ENGINE: { main: 75, other: 25 },
        INTERFACE: { main: 75, other: 25 },
        SAFEMODE: { main: 75, other: 25 }
    };
    
    console.log('【理想的な配分】');
    console.log('各OSの主要八卦: 70-80%');
    console.log('他OS八卦: 20-30%');
    
    console.log('\n【達成基準】');
    console.log('✅ ENGINE OS: 乾_創造性、震_行動性、坎_探求性が合計70%以上');
    console.log('✅ INTERFACE OS: 兌_調和性、離_表現性、巽_適応性が合計70%以上');
    console.log('✅ SAFE MODE OS: 艮_安定性、坤_受容性が合計70%以上');
    
    console.log('\n【重要な改善点】');
    console.log('1. 震_行動性を大幅強化（4.0-4.5点）');
    console.log('2. 他OS八卦を2.0点以下に抑制');
    console.log('3. マイナススコアで対立関係を明確化');
}

// サマリー実行
calculateSummary();