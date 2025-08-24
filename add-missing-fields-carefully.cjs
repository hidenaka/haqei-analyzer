#!/usr/bin/env node

/**
 * 欠落しているフィールドを各卦の既存データに基づいて丁寧に追加するスクリプト
 */

const fs = require('fs');
const path = require('path');

// V3データベースファイルを読み込み
const v3FilePath = path.join(__dirname, 'public/js/data/hexagram-human-traits-v3.js');
let fileContent = fs.readFileSync(v3FilePath, 'utf-8');

// deepInsightフィールドが欠落している卦のリスト
const missingHexagrams = [
    '水雷屯', '山水蒙', '水天需', '天水訟', '地水師', '水地比',
    '風天小畜', '天澤履', '地天泰', '天地否', '天火同人', '火天大有', '地山謙', '雷地豫',
    '澤雷随', '山風蠱', '地澤臨', '風地観', '火雷噬嗑', '山火賁', '地雷復',
    '山天大畜', '山雷頤', '澤風大過', '坎為水', '離為火', '澤山咸', '雷風恒',
    '天山遯', '雷天大壮', '火地晋', '地火明夷', '風火家人', '火澤睽', '水山蹇', '雷水解',
    '山澤損', '風雷益', '澤天夬', '天風姤', '澤地萃', '地風升', '澤水困', '水風井',
    '澤火革', '火風鼎', '震為雷', '艮為山', '風山漸', '雷澤帰妹', '雷火豊', '火山旅',
    '巽為風', '兌為澤', '風水渙', '水澤節', '風澤中孚', '雷山小過', '水火既済', '火水未済'
];

// 特別に処理が必要な卦
const specialHexagrams = ['山地剝', '天雷无妄'];

// 各卦の既存データを取得する関数
function getExistingHexagramData(hexagramName) {
    // 卦のセクション全体を探す
    const hexagramRegex = new RegExp(`"${hexagramName}":\\s*\\{([\\s\\S]*?)\\}\\s*(?:,\\s*"[^"]+"|\\s*\\})`, 'g');
    const match = fileContent.match(hexagramRegex);
    
    if (!match || !match[0]) {
        console.log(`⚠️ ${hexagramName} のデータが見つかりません`);
        return null;
    }
    
    try {
        // JSONとして解析を試みる
        const jsonStr = match[0].replace(/,\s*$/, '');
        const wrappedJson = `{${jsonStr}}`;
        const data = eval(`(${wrappedJson})`);
        return data[hexagramName];
    } catch (e) {
        console.log(`⚠️ ${hexagramName} のデータ解析に失敗: ${e.message}`);
        return null;
    }
}

// Interface OS用のdeepInsightを生成
function generateInterfaceDeepInsight(hexagramName, existingData) {
    if (!existingData || !existingData.asInterfaceOS) return null;
    
    const interfaceData = existingData.asInterfaceOS;
    const traits = interfaceData.traits || [];
    const communication = interfaceData.communicationStyle || {};
    const relationships = interfaceData.relationshipTips || {};
    
    return {
        coreValue: `${traits[0] || '対人関係'}を重視 - ${hexagramName}の特性を活かした独自の人間関係構築に価値を見出す`,
        socialMission: `${communication.style || '独自の方法'}で社会と関わり、${hexagramName}らしい貢献をすること`,
        relationshipPattern: `${relationships.focus || '信頼'}を基盤に、${traits[1] || '調和的'}な関係性を築く`,
        connectionPath: `1. ${hexagramName}の本質を理解する 2. 相手の立場を尊重する 3. 相互理解を深める`
    };
}

// Communication Patternsを生成
function generateCommunicationPatterns(hexagramName, existingData) {
    if (!existingData || !existingData.asInterfaceOS) return null;
    
    const interfaceData = existingData.asInterfaceOS;
    const style = interfaceData.communicationStyle || {};
    const traits = interfaceData.traits || [];
    
    return {
        firstImpression: `${traits[0] || '親しみやすい'}印象を与え、${hexagramName}の持つ独特な雰囲気が伝わる`,
        presentation: `${style.tone || '明確'}で${style.approach || '説得力のある'}プレゼンテーション`,
        listening: `${traits[1] || '共感的'}な姿勢で相手の話を聞き、${hexagramName}らしい理解を示す`,
        conflict: `${style.conflictResolution || '建設的'}な方法で問題を解決し、関係性を維持する`
    };
}

// SafeMode OS用のdeepInsightを生成
function generateSafeModeDeepInsight(hexagramName, existingData) {
    if (!existingData || !existingData.asSafeModeOS) return null;
    
    const safeModeData = existingData.asSafeModeOS;
    const traits = safeModeData.traits || [];
    const warningSign = safeModeData.warningSign || {};
    const recovery = safeModeData.howToRecover || {};
    
    return {
        coreValue: `${traits[0] || '自己防衛'}を重視 - ${hexagramName}独自の方法で安全を確保することに価値を見出す`,
        defenseMechanism: `${warningSign.behavior || '警戒的'}な反応で自己を守り、${traits[1] || '慎重'}に対処する`,
        vulnerablePoint: `${warningSign.trigger || '予期せぬ変化'}に対して脆弱。${hexagramName}の弱点が露呈しやすい`,
        healingPath: `1. ${recovery.step1 || '安全な環境を確保'} 2. ${recovery.step2 || '内なる力を回復'} 3. ${recovery.step3 || '段階的に前進'}`
    };
}

// Stress Patternsを生成
function generateStressPatterns(hexagramName, existingData) {
    if (!existingData || !existingData.asSafeModeOS) return null;
    
    const safeModeData = existingData.asSafeModeOS;
    const warningSign = safeModeData.warningSign || {};
    const traits = safeModeData.traits || [];
    
    return {
        earlySign: `${warningSign.early || 'いつもと違う行動'}が現れ、${hexagramName}のバランスが崩れ始める`,
        peakStress: `${traits[0] || '極端な反応'}が強まり、${hexagramName}の特性が過剰に現れる`,
        breakingPoint: `${warningSign.critical || '機能不全'}に陥り、本来の${hexagramName}の力を失う`,
        preventiveMeasure: `${warningSign.prevention || '定期的なセルフケア'}で、${hexagramName}のバランスを保つ`
    };
}

// 各卦を処理
function processHexagram(hexagramName) {
    console.log(`📝 ${hexagramName} を処理中...`);
    
    // 既存データを取得
    const existingData = getExistingHexagramData(hexagramName);
    if (!existingData) {
        console.log(`  ⚠️ ${hexagramName} - データ取得失敗`);
        return false;
    }
    
    let updated = false;
    
    // Interface OSにdeepInsightとcommunicationPatternsを追加
    const interfaceDeepInsight = generateInterfaceDeepInsight(hexagramName, existingData);
    const communicationPatterns = generateCommunicationPatterns(hexagramName, existingData);
    
    if (interfaceDeepInsight && communicationPatterns) {
        // Interface OSセクションを探して更新
        const interfacePattern = new RegExp(
            `("${hexagramName}"[\\s\\S]*?"asInterfaceOS":\\s*\\{[\\s\\S]*?"relationshipTips":\\s*\\{[^}]*?\\})`,
            'g'
        );
        
        fileContent = fileContent.replace(interfacePattern, (match) => {
            if (!match.includes('"deepInsight"')) {
                const newFields = `,
            "deepInsight": ${JSON.stringify(interfaceDeepInsight, null, 16)},
            "communicationPatterns": ${JSON.stringify(communicationPatterns, null, 16)}`;
                
                // relationshipTipsの閉じ括弧の後に追加
                const insertPoint = match.lastIndexOf('}');
                const before = match.substring(0, insertPoint + 1);
                const after = match.substring(insertPoint + 1);
                updated = true;
                return before + newFields + after;
            }
            return match;
        });
    }
    
    // SafeMode OSにdeepInsightとstressPatternsを追加
    const safeModeDeepInsight = generateSafeModeDeepInsight(hexagramName, existingData);
    const stressPatterns = generateStressPatterns(hexagramName, existingData);
    
    if (safeModeDeepInsight && stressPatterns) {
        // SafeMode OSセクションを探して更新
        const safeModePattern = new RegExp(
            `("${hexagramName}"[\\s\\S]*?"asSafeModeOS":\\s*\\{[\\s\\S]*?"howToRecover":\\s*\\{[^}]*?\\})`,
            'g'
        );
        
        fileContent = fileContent.replace(safeModePattern, (match) => {
            if (!match.includes('"deepInsight"')) {
                const newFields = `,
            "deepInsight": ${JSON.stringify(safeModeDeepInsight, null, 16)},
            "stressPatterns": ${JSON.stringify(stressPatterns, null, 16)}`;
                
                // howToRecoverの閉じ括弧の後に追加
                const insertPoint = match.lastIndexOf('}');
                const before = match.substring(0, insertPoint + 1);
                const after = match.substring(insertPoint + 1);
                updated = true;
                return before + newFields + after;
            }
            return match;
        });
    }
    
    if (updated) {
        console.log(`  ✅ ${hexagramName} - 新規フィールド追加完了`);
    } else {
        console.log(`  ⏭️ ${hexagramName} - 既に更新済み`);
    }
    
    return updated;
}

// メイン処理
function main() {
    console.log('🚀 欠落フィールドの追加を開始\n');
    
    let updatedCount = 0;
    let failedCount = 0;
    
    // 通常の卦を処理
    missingHexagrams.forEach(hexagramName => {
        if (processHexagram(hexagramName)) {
            updatedCount++;
        } else {
            failedCount++;
        }
    });
    
    // 特別な卦（山地剝、天雷无妄）も確認
    specialHexagrams.forEach(hexagramName => {
        console.log(`🔍 ${hexagramName} を確認中...`);
        const exists = fileContent.includes(`"${hexagramName}"`);
        if (!exists) {
            console.log(`  ⚠️ ${hexagramName} - データ自体が存在しません（別途追加が必要）`);
        } else {
            if (processHexagram(hexagramName)) {
                updatedCount++;
            }
        }
    });
    
    // ファイルに書き戻し
    fs.writeFileSync(v3FilePath, fileContent);
    
    console.log(`\n✨ 完了！`);
    console.log(`  📊 更新: ${updatedCount}卦`);
    console.log(`  ⚠️ 失敗: ${failedCount}卦`);
    
    // 最終確認
    const deepInsightCount = (fileContent.match(/"deepInsight"/g) || []).length;
    console.log(`\n📈 最終統計:`);
    console.log(`  deepInsightフィールド数: ${deepInsightCount} (目標: 192 = 64卦 × 3OS)`);
}

// 実行
main();