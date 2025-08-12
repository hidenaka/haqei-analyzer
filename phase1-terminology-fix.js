/**
 * Phase 1: 用語統一（三爻→八卦）と純卦許容の修正スクリプト
 * 
 * このスクリプトは os_analyzer.html に対して以下の修正を行います：
 * 1. 「三爻」を「八卦」に置換
 * 2. 純卦（同一八卦の重複）を許容するロジックに変更
 * 3. 関数名とクラス名の統一
 */

// 修正対象リスト
const PHASE1_FIXES = {
    // 用語の統一
    terminology: {
        "三爻": "八卦",
        "trigram": "bagua",
        "Trigram": "Bagua",
        "TRIGRAM": "BAGUA"
    },
    
    // 純卦ロジックの修正箇所
    pureHexagramLogic: {
        // 現在のロジック（純卦を排除）
        current: `// 上位2つが同じ場合、第3位を使用
                if (topTrigram1 === topTrigram2 && sortedTrigrams[2]) {
                    topTrigram2 = sortedTrigrams[2][0];
                    console.log(\`ℹ️ 三爻重複検出: \${topTrigram1} が上位2つを占めたため、第3位の \${topTrigram2} を使用\`);
                }`,
        
        // 修正後のロジック（純卦を許容）
        fixed: `// 純卦（同一八卦の重複）を許容
                const isPureHexagram = topBagua1 === topBagua2;
                if (isPureHexagram) {
                    console.log(\`✨ 純卦検出: \${topBagua1}為\${topBagua1} (同一八卦の重複)\`);
                }`
    },
    
    // 関数名の変更マッピング
    functionRenames: {
        "calculateTrigramEnergies": "calculateBaguaEnergies",
        "selectTopTrigrams": "selectTopBagua",
        "getTrigramName": "getBaguaName",
        "getTrigramStability": "getBaguaStability",
        "calculateTrigramCompatibility": "calculateBaguaCompatibility",
        "analyzeTrigramConsistency": "analyzeBaguaConsistency",
        "selectComplementaryTrigram": "selectComplementaryBagua",
        "selectInterfaceTrigrams": "selectInterfaceBagua",
        "selectDefensiveTrigrams": "selectDefensiveBagua",
        "calculateSocialTrigramEnergies": "calculateSocialBaguaEnergies",
        "calculateDefensiveTrigramEnergies": "calculateDefensiveBaguaEnergies",
        "renderTrigramEnergyAnalysis": "renderBaguaEnergyAnalysis",
        "getTrigramStrength": "getBaguaStrength"
    },
    
    // 変数名の変更マッピング  
    variableRenames: {
        "trigramEnergies": "baguaEnergies",
        "trigramVector": "baguaVector",
        "trigramMapping": "baguaMapping",
        "topTrigram": "topBagua",
        "upperTrigram": "upperBagua",
        "lowerTrigram": "lowerBagua",
        "sortedTrigrams": "sortedBagua",
        "trigramBonus": "baguaBonus",
        "trigramScores": "baguaScores",
        "commonTrigrams": "commonBagua",
        "uniqueTrigrams": "uniqueBagua",
        "defensiveTrigramEnergies": "defensiveBaguaEnergies",
        "socialTrigramEnergies": "socialBaguaEnergies",
        "primaryTrigram": "primaryBagua",
        "secondaryTrigram": "secondaryBagua"
    },
    
    // CSSクラス名の変更
    cssClasses: {
        ".trigram-energy-section": ".bagua-energy-section",
        "#trigram-balance-analysis": "#bagua-balance-analysis",
        ".trigram-composition": ".bagua-composition"
    },
    
    // コメントとログメッセージの修正
    comments: {
        "// 易経準拠の正統三爻": "// 易経準拠の正統八卦",
        "// 三爻エネルギー": "// 八卦エネルギー",
        "// 8次元ベクトルから8三爻": "// 8次元ベクトルから八卦",
        "// 最も強い2つの三爻": "// 最も強い2つの八卦",
        "// 上位2つの三爻": "// 上位2つの八卦",
        "三爻重複検出": "八卦選択",
        "三爻エネルギー分析": "八卦エネルギー分析",
        "三爻構成分析": "八卦構成分析"
    }
};

// 修正実行関数
function applyPhase1Fixes(htmlContent) {
    let modifiedContent = htmlContent;
    
    // 1. 用語の統一
    Object.entries(PHASE1_FIXES.terminology).forEach(([old, replacement]) => {
        const regex = new RegExp(old, 'g');
        modifiedContent = modifiedContent.replace(regex, replacement);
    });
    
    // 2. 関数名の変更
    Object.entries(PHASE1_FIXES.functionRenames).forEach(([old, replacement]) => {
        const regex = new RegExp(`\\b${old}\\b`, 'g');
        modifiedContent = modifiedContent.replace(regex, replacement);
    });
    
    // 3. 変数名の変更
    Object.entries(PHASE1_FIXES.variableRenames).forEach(([old, replacement]) => {
        const regex = new RegExp(`\\b${old}\\b`, 'g');
        modifiedContent = modifiedContent.replace(regex, replacement);
    });
    
    // 4. CSSクラス名の変更
    Object.entries(PHASE1_FIXES.cssClasses).forEach(([old, replacement]) => {
        modifiedContent = modifiedContent.replace(old, replacement);
    });
    
    // 5. 純卦ロジックの修正（特定の箇所）
    // 同一八卦を第3位に置き換える処理を削除
    const pureHexagramPattern = /if\s*\(topTrigram1\s*===\s*topTrigram2.*?\{[^}]*sortedTrigrams\[2\][^}]*\}/gs;
    modifiedContent = modifiedContent.replace(pureHexagramPattern, (match) => {
        return `// 純卦（同一八卦の重複）を許容
                if (topBagua1 === topBagua2) {
                    console.log(\`✨ 純卦検出: \${topBagua1}為\${topBagua1} (同一八卦の重複)\`);
                }`;
    });
    
    return modifiedContent;
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { applyPhase1Fixes, PHASE1_FIXES };
}

console.log('Phase 1 修正スクリプトが準備されました。');
console.log('使用方法: applyPhase1Fixes(htmlContent) を実行してください。');