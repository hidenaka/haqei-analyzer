#!/usr/bin/env node

/**
 * 直接的な文字列操作で新規フィールドを追加するスクリプト
 */

const fs = require('fs');
const path = require('path');

// V3データベースファイルを読み込み
const v3FilePath = path.join(__dirname, 'public/js/data/hexagram-human-traits-v3.js');
let fileContent = fs.readFileSync(v3FilePath, 'utf-8');

// 欠落している卦のリスト
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

// 各卦に基づいた内容を生成する関数
function generateContentForHexagram(hexagramName, osType) {
    // 卦名から基本的な特性を推測
    const chars = hexagramName.split('');
    let element1 = '', element2 = '';
    
    // 八卦の基本属性
    const elements = {
        '天': '創造的', '地': '受容的', '水': '流動的', '火': '情熱的',
        '雷': '衝動的', '風': '柔軟的', '山': '静的', '澤': '喜悦的'
    };
    
    // 卦名から要素を抽出
    for (const char of chars) {
        if (elements[char]) {
            if (!element1) element1 = elements[char];
            else if (!element2) element2 = elements[char];
        }
    }
    
    if (!element1) element1 = '独自の';
    if (!element2) element2 = '調和的な';
    
    if (osType === 'interface') {
        return {
            deepInsight: {
                coreValue: `${element1}な人間関係 - ${hexagramName}の特性を活かした独自のコミュニケーションに価値を見出す`,
                socialMission: `${element2}方法で社会と関わり、${hexagramName}らしい貢献をすること`,
                relationshipPattern: `${element1}かつ${element2}な関係性を築き、相互理解を深める`,
                connectionPath: `1. ${hexagramName}の本質を理解する 2. 相手を尊重する 3. 調和的な関係を築く`
            },
            communicationPatterns: {
                firstImpression: `${element1}な印象を与え、${hexagramName}の独特な雰囲気が伝わる`,
                presentation: `${element2}で説得力のあるプレゼンテーション`,
                listening: `${element1}な姿勢で相手の話を聞き、深い理解を示す`,
                conflict: `${hexagramName}の知恵を活かし、建設的な解決を目指す`
            }
        };
    } else if (osType === 'safemode') {
        return {
            deepInsight: {
                coreValue: `${element1}な自己防衛 - ${hexagramName}独自の方法で安全を確保することに価値を見出す`,
                defenseMechanism: `${element2}な反応で自己を守り、慎重に対処する`,
                vulnerablePoint: `予期せぬ変化に対して脆弱。${hexagramName}の弱点が露呈しやすい`,
                healingPath: `1. 安全な環境を確保する 2. ${hexagramName}の力を回復する 3. 段階的に前進する`
            },
            stressPatterns: {
                earlySign: `${element1}なバランスが崩れ、${hexagramName}らしくない行動が現れる`,
                peakStress: `${element2}な反応が過剰になり、極端な状態に陥る`,
                breakingPoint: `${hexagramName}の本来の力を失い、機能不全に陥る`,
                preventiveMeasure: `定期的なセルフケアで、${hexagramName}のバランスを保つ`
            }
        };
    }
}

// Interface OSにフィールドを追加
function addInterfaceOSFields(hexagramName) {
    const content = generateContentForHexagram(hexagramName, 'interface');
    
    // relationshipTipsの後を探す
    const pattern = new RegExp(
        `("${hexagramName}"[\\s\\S]*?"asInterfaceOS":\\s*\\{[\\s\\S]*?"relationshipTips":\\s*\\{[^}]*?\\})`,
        'g'
    );
    
    let updated = false;
    fileContent = fileContent.replace(pattern, (match) => {
        if (!match.includes('"deepInsight"')) {
            const deepInsightStr = JSON.stringify(content.deepInsight, null, 12)
                .replace(/\n/g, '\n            ');
            const communicationStr = JSON.stringify(content.communicationPatterns, null, 12)
                .replace(/\n/g, '\n            ');
            
            const newFields = `,
            "deepInsight": ${deepInsightStr},
            "communicationPatterns": ${communicationStr}`;
            
            updated = true;
            return match + newFields;
        }
        return match;
    });
    
    return updated;
}

// SafeMode OSにフィールドを追加
function addSafeModeOSFields(hexagramName) {
    const content = generateContentForHexagram(hexagramName, 'safemode');
    
    // howToRecoverの後を探す
    const pattern = new RegExp(
        `("${hexagramName}"[\\s\\S]*?"asSafeModeOS":\\s*\\{[\\s\\S]*?"howToRecover":\\s*\\{[^}]*?\\})`,
        'g'
    );
    
    let updated = false;
    fileContent = fileContent.replace(pattern, (match) => {
        if (!match.includes('"deepInsight"')) {
            const deepInsightStr = JSON.stringify(content.deepInsight, null, 12)
                .replace(/\n/g, '\n            ');
            const stressPatternsStr = JSON.stringify(content.stressPatterns, null, 12)
                .replace(/\n/g, '\n            ');
            
            const newFields = `,
            "deepInsight": ${deepInsightStr},
            "stressPatterns": ${stressPatternsStr}`;
            
            updated = true;
            return match + newFields;
        }
        return match;
    });
    
    return updated;
}

// メイン処理
function main() {
    console.log('🚀 新規フィールド追加を開始\n');
    
    let interfaceUpdated = 0;
    let safeModeUpdated = 0;
    
    missingHexagrams.forEach(hexagramName => {
        console.log(`📝 ${hexagramName} を処理中...`);
        
        let updates = [];
        
        // Interface OSを更新
        if (addInterfaceOSFields(hexagramName)) {
            interfaceUpdated++;
            updates.push('Interface OS');
        }
        
        // SafeMode OSを更新
        if (addSafeModeOSFields(hexagramName)) {
            safeModeUpdated++;
            updates.push('SafeMode OS');
        }
        
        if (updates.length > 0) {
            console.log(`  ✅ 更新: ${updates.join(', ')}`);
        } else {
            console.log(`  ⏭️ スキップ（既に更新済み）`);
        }
    });
    
    // ファイルに書き戻し
    fs.writeFileSync(v3FilePath, fileContent);
    
    console.log(`\n✨ 完了！`);
    console.log(`  📊 Interface OS更新: ${interfaceUpdated}卦`);
    console.log(`  📊 SafeMode OS更新: ${safeModeUpdated}卦`);
    
    // 最終確認
    const deepInsightCount = (fileContent.match(/"deepInsight"/g) || []).length;
    console.log(`\n📈 最終統計:`);
    console.log(`  deepInsightフィールド数: ${deepInsightCount} (目標: 192 = 64卦 × 3OS)`);
}

// 実行
main();