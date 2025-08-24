#!/usr/bin/env node

/**
 * すべての卦のすべてのOSに新規フィールドを確実に追加するスクリプト
 */

const fs = require('fs');
const path = require('path');

// V3データベースファイルを読み込み
const v3FilePath = path.join(__dirname, 'public/js/data/hexagram-human-traits-v3.js');
let fileContent = fs.readFileSync(v3FilePath, 'utf-8');

// すべての卦（64卦）のリスト
const allHexagrams = [
    '乾為天', '坤為地', '水雷屯', '山水蒙', '水天需', '天水訟', '地水師', '水地比',
    '風天小畜', '天澤履', '地天泰', '天地否', '天火同人', '火天大有', '地山謙', '雷地豫',
    '澤雷随', '山風蠱', '地澤臨', '風地観', '火雷噬嗑', '山火賁', '山地剝', '地雷復',
    '天雷无妄', '山天大畜', '山雷頤', '澤風大過', '坎為水', '離為火', '澤山咸', '雷風恒',
    '天山遯', '雷天大壮', '火地晋', '地火明夷', '風火家人', '火澤睽', '水山蹇', '雷水解',
    '山澤損', '風雷益', '澤天夬', '天風姤', '澤地萃', '地風升', '澤水困', '水風井',
    '澤火革', '火風鼎', '震為雷', '艮為山', '風山漸', '雷澤帰妹', '雷火豊', '火山旅',
    '巽為風', '兌為澤', '風水渙', '水澤節', '風澤中孚', '雷山小過', '水火既済', '火水未済'
];

// 八卦の基本属性マップ
const trigramAttributes = {
    '天': { nature: '創造', energy: '剛健', direction: '上昇' },
    '地': { nature: '受容', energy: '柔順', direction: '安定' },
    '水': { nature: '流動', energy: '陥険', direction: '下降' },
    '火': { nature: '明照', energy: '附麗', direction: '拡散' },
    '雷': { nature: '震動', energy: '奮発', direction: '衝撃' },
    '風': { nature: '浸透', energy: '柔軟', direction: '入込' },
    '山': { nature: '静止', energy: '安定', direction: '不動' },
    '澤': { nature: '喜悦', energy: '和楽', direction: '交流' }
};

// 卦名から属性を取得
function getHexagramAttributes(hexagramName) {
    const chars = hexagramName.split('');
    const attributes = [];
    
    for (const char of chars) {
        if (trigramAttributes[char]) {
            attributes.push(trigramAttributes[char]);
        }
    }
    
    return attributes;
}

// Engine OS用 deepInsight生成（各卦の特性に基づく）
function generateEngineDeepInsight(hexagramName) {
    const attrs = getHexagramAttributes(hexagramName);
    const nature = attrs.map(a => a.nature).join('と');
    const energy = attrs.map(a => a.energy).join('・');
    
    return {
        coreValue: `${nature} - ${hexagramName}の本質を体現し、独自の価値を創造することに価値を見出す`,
        lifeMission: `${energy}のエネルギーを活かし、世界に新しい可能性をもたらすこと`,
        innerConflict: `${attrs[0]?.nature || '陽'}と${attrs[1]?.nature || '陰'}のバランス。理想と現実の間での葛藤`,
        growthPath: `1. ${hexagramName}の本質を理解する 2. 強みを最大限に活かす 3. 弱みを成長の糧にする`
    };
}

// Daily Patterns生成
function generateDailyPatterns(hexagramName) {
    const attrs = getHexagramAttributes(hexagramName);
    const energy = attrs[0]?.energy || '独自';
    const direction = attrs[0]?.direction || '前進';
    
    return {
        morning: `${energy}のエネルギーと共に目覚め、${direction}への意識で1日を始める`,
        decision: `${hexagramName}の本質に従い、直感と理性のバランスを取りながら判断`,
        problemSolving: `${attrs[0]?.nature || '独自'}の視点から問題を分析し、${attrs[1]?.nature || '調和'}的に解決`,
        creativity: `${energy}と${attrs[1]?.energy || '創造'}が融合する時、最も創造的になる`
    };
}

// Strength/Weakness生成
function generateStrengthWeakness(hexagramName) {
    const attrs = getHexagramAttributes(hexagramName);
    const mainStrength = attrs[0]?.nature || '独自性';
    const hiddenNature = attrs[1]?.nature || '潜在力';
    
    return {
        topStrength: `${mainStrength}の力 - ${hexagramName}特有の強みを最大限に発揮する能力`,
        hiddenTalent: `${hiddenNature}の才能 - まだ開花していない${hexagramName}の潜在能力`,
        blindSpot: `${mainStrength}への過度の依存。バランスを欠いた時の脆弱性`,
        improvement: `${hexagramName}の陰陽バランスを意識し、全体性を保つ練習`
    };
}

// Interface OS用 deepInsight生成
function generateInterfaceDeepInsight(hexagramName) {
    const attrs = getHexagramAttributes(hexagramName);
    const social = attrs[0]?.nature || '関係';
    
    return {
        coreValue: `${social}的つながり - ${hexagramName}らしい人間関係を築くことに価値を見出す`,
        socialMission: `${hexagramName}の特性を活かし、社会に独自の貢献をすること`,
        relationshipPattern: `${attrs[0]?.energy || '独自'}なスタイルで人と関わり、${attrs[1]?.energy || '調和'}を保つ`,
        connectionPath: `1. 自分らしさを大切に 2. 相手を尊重する 3. 互恵的な関係を築く`
    };
}

// Communication Patterns生成
function generateCommunicationPatterns(hexagramName) {
    const attrs = getHexagramAttributes(hexagramName);
    const style = attrs[0]?.energy || '独自';
    
    return {
        firstImpression: `${style}な印象を与え、${hexagramName}らしさが伝わる`,
        presentation: `${attrs[0]?.nature || '明確'}で${attrs[1]?.nature || '説得力のある'}プレゼンテーション`,
        listening: `${style}な視点から相手の話を理解し、共感を示す`,
        conflict: `${hexagramName}の知恵を活かし、建設的な解決を目指す`
    };
}

// SafeMode OS用 deepInsight生成
function generateSafeModeDeepInsight(hexagramName) {
    const attrs = getHexagramAttributes(hexagramName);
    const defense = attrs[0]?.nature || '防御';
    
    return {
        coreValue: `${defense}による自己保護 - ${hexagramName}独自の方法で安全を確保することに価値を見出す`,
        defenseMechanism: `${attrs[0]?.energy || '独自'}な防御反応で自己を守る`,
        vulnerablePoint: `${attrs[1]?.nature || '変化'}への対応が弱点。予期せぬ状況での脆弱性`,
        healingPath: `1. ${hexagramName}の本質に立ち返る 2. 内なる力を信じる 3. 適切なサポートを受ける`
    };
}

// Stress Patterns生成
function generateStressPatterns(hexagramName) {
    const attrs = getHexagramAttributes(hexagramName);
    const stress = attrs[0]?.energy || 'ストレス';
    
    return {
        earlySign: `${stress}のバランスが崩れ始め、いつもと違う行動が現れる`,
        peakStress: `${hexagramName}の特性が過剰に現れ、極端な状態になる`,
        breakingPoint: `${attrs[0]?.nature || '本来'}の力を失い、機能不全に陥る`,
        preventiveMeasure: `${hexagramName}の陰陽バランスを保つ定期的なセルフケア`
    };
}

// 各卦を処理
function processHexagram(hexagramName) {
    console.log(`📝 ${hexagramName} を処理中...`);
    
    let updated = false;
    
    // Engine OS の処理
    const enginePattern = `"asEngineOS": {[^}]*?"maintenance": {[^}]*?}`;
    const engineRegex = new RegExp(`("${hexagramName}"[\\s\\S]*?${enginePattern})`, 'g');
    
    fileContent = fileContent.replace(engineRegex, (match) => {
        if (!match.includes('"deepInsight"')) {
            const newFields = `
            "deepInsight": ${JSON.stringify(generateEngineDeepInsight(hexagramName), null, 16)},
            "dailyPatterns": ${JSON.stringify(generateDailyPatterns(hexagramName), null, 16)},
            "strengthWeakness": ${JSON.stringify(generateStrengthWeakness(hexagramName), null, 16)}`;
            
            // maintenanceの後に追加
            const insertPoint = match.lastIndexOf('}');
            const before = match.substring(0, insertPoint);
            const after = match.substring(insertPoint);
            updated = true;
            return before + '},' + newFields + '\n        ' + after;
        }
        return match;
    });
    
    // Interface OS の処理
    const interfacePattern = `"asInterfaceOS": {[^}]*?"relationshipTips": {[^}]*?}`;
    const interfaceRegex = new RegExp(`("${hexagramName}"[\\s\\S]*?${interfacePattern})`, 'g');
    
    fileContent = fileContent.replace(interfaceRegex, (match) => {
        if (!match.includes('"deepInsight"')) {
            const newFields = `
            "deepInsight": ${JSON.stringify(generateInterfaceDeepInsight(hexagramName), null, 16)},
            "communicationPatterns": ${JSON.stringify(generateCommunicationPatterns(hexagramName), null, 16)}`;
            
            const insertPoint = match.lastIndexOf('}');
            const before = match.substring(0, insertPoint);
            const after = match.substring(insertPoint);
            updated = true;
            return before + '},' + newFields + '\n        ' + after;
        }
        return match;
    });
    
    // SafeMode OS の処理
    const safeModePattern = `"asSafeModeOS": {[^}]*?"howToRecover": {[^}]*?}`;
    const safeModeRegex = new RegExp(`("${hexagramName}"[\\s\\S]*?${safeModePattern})`, 'g');
    
    fileContent = fileContent.replace(safeModeRegex, (match) => {
        if (!match.includes('"deepInsight"')) {
            const newFields = `
            "deepInsight": ${JSON.stringify(generateSafeModeDeepInsight(hexagramName), null, 16)},
            "stressPatterns": ${JSON.stringify(generateStressPatterns(hexagramName), null, 16)}`;
            
            const insertPoint = match.lastIndexOf('}');
            const before = match.substring(0, insertPoint);
            const after = match.substring(insertPoint);
            updated = true;
            return before + '},' + newFields + '\n        ' + after;
        }
        return match;
    });
    
    if (updated) {
        console.log(`  ✅ ${hexagramName} - 新規フィールド追加完了`);
    } else {
        console.log(`  ⏭️  ${hexagramName} - 既に更新済み`);
    }
    
    return updated;
}

// メイン処理
function main() {
    console.log('🚀 全64卦への新規フィールド追加を開始\n');
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    allHexagrams.forEach(hexagramName => {
        if (processHexagram(hexagramName)) {
            updatedCount++;
        } else {
            skippedCount++;
        }
    });
    
    // ファイルに書き戻し
    fs.writeFileSync(v3FilePath, fileContent);
    
    console.log(`\n✨ 完了！`);
    console.log(`  📊 更新: ${updatedCount}卦`);
    console.log(`  ⏭️  スキップ: ${skippedCount}卦`);
    
    // 最終確認
    const deepInsightCount = (fileContent.match(/"deepInsight"/g) || []).length;
    console.log(`\n📈 最終統計:`);
    console.log(`  deepInsightフィールド数: ${deepInsightCount} (目標: 192 = 64卦 × 3OS)`);
}

// 実行
main();