#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// V3データベースファイルを読み込み
const v3FilePath = path.join(__dirname, 'public/js/data/hexagram-human-traits-v3.js');
const fileContent = fs.readFileSync(v3FilePath, 'utf-8');

// すべての卦名
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

console.log('🔍 新規フィールドの追加状況を確認中...\n');

const missingFields = {
    engineOS: [],
    interfaceOS: [],
    safeModeOS: []
};

let totalMissing = 0;

allHexagrams.forEach(hexagramName => {
    // 各卦のセクションを探す
    const hexagramRegex = new RegExp(`"${hexagramName}": \\{[\\s\\S]*?"osBalance"[\\s\\S]*?\\}\\s*\\}`, 'g');
    const match = fileContent.match(hexagramRegex);
    
    if (match && match[0]) {
        const section = match[0];
        
        // Engine OSのdeepInsightをチェック
        if (!section.includes('"asEngineOS"') || !section.match(/"asEngineOS"[\s\S]*?"deepInsight"/)) {
            missingFields.engineOS.push(hexagramName);
            totalMissing++;
        }
        
        // Interface OSのdeepInsightをチェック  
        if (!section.includes('"asInterfaceOS"') || !section.match(/"asInterfaceOS"[\s\S]*?"deepInsight"/)) {
            missingFields.interfaceOS.push(hexagramName);
            totalMissing++;
        }
        
        // SafeMode OSのdeepInsightをチェック
        if (!section.includes('"asSafeModeOS"') || !section.match(/"asSafeModeOS"[\s\S]*?"deepInsight"/)) {
            missingFields.safeModeOS.push(hexagramName);
            totalMissing++;
        }
    } else {
        console.log(`⚠️ ${hexagramName} のセクションが見つかりません`);
    }
});

console.log('📊 結果:\n');

console.log(`Engine OSでdeepInsightがない卦 (${missingFields.engineOS.length}個):`);
if (missingFields.engineOS.length > 0) {
    missingFields.engineOS.forEach(name => console.log(`  - ${name}`));
} else {
    console.log('  ✅ すべて追加済み');
}

console.log(`\nInterface OSでdeepInsightがない卦 (${missingFields.interfaceOS.length}個):`);
if (missingFields.interfaceOS.length > 0) {
    missingFields.interfaceOS.forEach(name => console.log(`  - ${name}`));
} else {
    console.log('  ✅ すべて追加済み');
}

console.log(`\nSafeMode OSでdeepInsightがない卦 (${missingFields.safeModeOS.length}個):`);
if (missingFields.safeModeOS.length > 0) {
    missingFields.safeModeOS.forEach(name => console.log(`  - ${name}`));
} else {
    console.log('  ✅ すべて追加済み');
}

console.log(`\n📈 統計:`);
console.log(`  deepInsightフィールド総数: ${(64 * 3) - totalMissing}/192`);
console.log(`  未追加箇所: ${totalMissing}箇所`);

// 未追加の卦リストを出力
if (totalMissing > 0) {
    const allMissing = new Set([
        ...missingFields.engineOS,
        ...missingFields.interfaceOS,
        ...missingFields.safeModeOS
    ]);
    
    console.log(`\n📝 フィールドが不足している卦 (${allMissing.size}個):`);
    Array.from(allMissing).forEach(name => console.log(`  - ${name}`));
}