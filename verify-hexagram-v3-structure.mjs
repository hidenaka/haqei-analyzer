/**
 * 64卦v3データベース構造検証スクリプト
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 各パートファイルをチェック
const parts = [
    { file: 'hexagram-human-traits-v3-part1.js', range: '1-8', start: 1, end: 8 },
    { file: 'hexagram-human-traits-v3-part2.js', range: '9-16', start: 9, end: 16 },
    { file: 'hexagram-human-traits-v3-part3.js', range: '17-24', start: 17, end: 24 },
    { file: 'hexagram-human-traits-v3-part4.js', range: '25-32', start: 25, end: 32 },
    { file: 'hexagram-human-traits-v3-part5.js', range: '33-40', start: 33, end: 40 },
    { file: 'hexagram-human-traits-v3-part6.js', range: '41-48', start: 41, end: 48 },
    { file: 'hexagram-human-traits-v3-part7.js', range: '49-56', start: 49, end: 56 },
    { file: 'hexagram-human-traits-v3-part8.js', range: '57-64', start: 57, end: 64 }
];

// 期待される64卦の名前とID
const expectedHexagrams = [
    { id: 1, name: '乾為天' },
    { id: 2, name: '坤為地' },
    { id: 3, name: '水雷屯' },
    { id: 4, name: '山水蒙' },
    { id: 5, name: '水天需' },
    { id: 6, name: '天水訟' },
    { id: 7, name: '地水師' },
    { id: 8, name: '水地比' },
    { id: 9, name: '風天小畜' },
    { id: 10, name: '天澤履' },
    { id: 11, name: '地天泰' },
    { id: 12, name: '天地否' },
    { id: 13, name: '天火同人' },
    { id: 14, name: '火天大有' },
    { id: 15, name: '地山謙' },
    { id: 16, name: '雷地豫' },
    { id: 17, name: '澤雷随' },
    { id: 18, name: '山風蠱' },
    { id: 19, name: '地澤臨' },
    { id: 20, name: '風地観' },
    { id: 21, name: '火雷噬嗑' },
    { id: 22, name: '山火賁' },
    { id: 23, name: '山地剥' },
    { id: 24, name: '地雷復' },
    { id: 25, name: '天雷無妄' },
    { id: 26, name: '山天大畜' },
    { id: 27, name: '山雷頤' },
    { id: 28, name: '澤風大過' },
    { id: 29, name: '坎為水' },
    { id: 30, name: '離為火' },
    { id: 31, name: '澤山咸' },
    { id: 32, name: '雷風恒' },
    { id: 33, name: '天山遯' },
    { id: 34, name: '雷天大壮' },
    { id: 35, name: '火地晋' },
    { id: 36, name: '地火明夷' },
    { id: 37, name: '風火家人' },
    { id: 38, name: '火澤睽' },
    { id: 39, name: '水山蹇' },
    { id: 40, name: '雷水解' },
    { id: 41, name: '山澤損' },
    { id: 42, name: '風雷益' },
    { id: 43, name: '澤天夬' },
    { id: 44, name: '天風姤' },
    { id: 45, name: '澤地萃' },
    { id: 46, name: '地風升' },
    { id: 47, name: '澤水困' },
    { id: 48, name: '水風井' },
    { id: 49, name: '澤火革' },
    { id: 50, name: '火風鼎' },
    { id: 51, name: '震為雷' },
    { id: 52, name: '艮為山' },
    { id: 53, name: '風山漸' },
    { id: 54, name: '雷澤帰妹' },
    { id: 55, name: '雷火豊' },
    { id: 56, name: '火山旅' },
    { id: 57, name: '巽為風' },
    { id: 58, name: '兌為澤' },
    { id: 59, name: '風水渙' },
    { id: 60, name: '水澤節' },
    { id: 61, name: '風澤中孚' },
    { id: 62, name: '雷山小過' },
    { id: 63, name: '水火既済' },
    { id: 64, name: '火水未済' }
];

// 必須のキー構造
const requiredStructure = {
    id: 'number',
    symbol: 'string',
    element: 'string',
    nickname: 'string',
    emoji: 'string',
    asEngineOS: {
        profile: ['type', 'description', 'metaphor'],
        normalState: ['whatHappens', 'example', 'energyLevel'],
        superMode: ['when', 'whatHappens', 'example', 'energyLevel'],
        restMode: ['whatHappens', 'howToRest', 'note'],
        maintenance: ['whatYouNeed', 'howToCharge', 'warning', 'tip']
    },
    asInterfaceOS: {
        profile: ['type', 'description', 'metaphor'],
        howToTalk: ['style', 'example', 'goodAt', 'notGoodAt'],
        bestEnvironment: ['where', 'example', 'withWho', 'avoid'],
        relationshipTips: ['strength', 'weakness', 'advice']
    },
    asSafeModeOS: {
        profile: ['type', 'description', 'metaphor'],
        stressResponse: ['whatYouDo', 'example', 'goodPoint', 'badPoint'],
        emergencyMode: ['whatHappens', 'example', 'recovery', 'timeToRecover'],
        howToRecover: ['bestWay', 'example', 'environment', 'support']
    },
    osBalance: {
        keys: ['idealBalance', 'whenBalanced', 'whenImbalanced', 'tip']
    }
};

// データ検証関数
function validateHexagramStructure(hexagram, name) {
    const errors = [];
    
    // 基本プロパティチェック
    ['id', 'symbol', 'element', 'nickname', 'emoji'].forEach(key => {
        if (!hexagram[key]) {
            errors.push(`  ❌ ${name}: Missing ${key}`);
        }
    });
    
    // OS構造チェック
    ['asEngineOS', 'asInterfaceOS', 'asSafeModeOS'].forEach(osType => {
        if (!hexagram[osType]) {
            errors.push(`  ❌ ${name}: Missing ${osType}`);
            return;
        }
        
        const os = hexagram[osType];
        const expected = requiredStructure[osType];
        
        Object.keys(expected).forEach(section => {
            if (!os[section]) {
                errors.push(`  ❌ ${name}.${osType}: Missing ${section}`);
                return;
            }
            
            expected[section].forEach(field => {
                if (!os[section][field]) {
                    errors.push(`  ❌ ${name}.${osType}.${section}: Missing ${field}`);
                }
            });
        });
    });
    
    // osBalanceチェック
    if (!hexagram.osBalance) {
        errors.push(`  ❌ ${name}: Missing osBalance`);
    } else {
        requiredStructure.osBalance.keys.forEach(key => {
            if (!hexagram.osBalance[key]) {
                errors.push(`  ❌ ${name}.osBalance: Missing ${key}`);
            }
        });
    }
    
    return errors;
}

console.log('====================================');
console.log('64卦 v3データベース構造検証');
console.log('====================================\n');

let allHexagrams = [];
let totalErrors = [];
let foundHexagrams = new Set();

// 各パートファイルを検証
for (const [index, part] of parts.entries()) {
    console.log(`\n📁 Part ${index + 1}: ${part.file} (卦 ${part.range})`);
    console.log('----------------------------------------');
    
    const filePath = join(__dirname, 'public/js/data', part.file);
    
    try {
        // ファイル読み込み（文字列として読み込んで評価）
        const fileContent = readFileSync(filePath, 'utf-8');
        
        // constの名前を取得
        const constNameMatch = fileContent.match(/const\s+(\w+)\s*=/);
        if (!constNameMatch) {
            throw new Error('データオブジェクトが見つかりません');
        }
        const constName = constNameMatch[1];
        
        // evalを使用してオブジェクトを取得（実環境では避けるべきだが、検証用なので使用）
        const dataObj = eval(`(function() { ${fileContent}; return ${constName}; })()`);
        
        const keys = Object.keys(dataObj);
        console.log(`  ✅ ファイル読み込み成功`);
        console.log(`  📊 含まれる卦数: ${keys.length}`);
        
        // 期待される卦の確認
        const expectedInPart = expectedHexagrams.slice(part.start - 1, part.end);
        console.log(`  📋 期待される卦: ${expectedInPart.map(h => h.name).join(', ')}`);
        
        // 各卦の検証
        let partErrors = [];
        expectedInPart.forEach(expected => {
            if (dataObj[expected.name]) {
                foundHexagrams.add(expected.name);
                const hexagram = dataObj[expected.name];
                
                // ID確認
                if (hexagram.id !== expected.id) {
                    partErrors.push(`  ⚠️ ${expected.name}: ID不一致 (期待: ${expected.id}, 実際: ${hexagram.id})`);
                }
                
                // 構造検証
                const structureErrors = validateHexagramStructure(hexagram, expected.name);
                partErrors = partErrors.concat(structureErrors);
                
                allHexagrams.push({ name: expected.name, data: hexagram });
            } else {
                partErrors.push(`  ❌ ${expected.name} が見つかりません`);
            }
        });
        
        // 余分な卦がないか確認
        keys.forEach(key => {
            if (!expectedInPart.find(h => h.name === key)) {
                partErrors.push(`  ⚠️ 予期しない卦: ${key}`);
            }
        });
        
        if (partErrors.length === 0) {
            console.log(`  ✅ Part ${index + 1} 検証完了 - エラーなし`);
        } else {
            console.log(`  ⚠️ Part ${index + 1} で問題を検出:`);
            partErrors.forEach(error => console.log(error));
            totalErrors = totalErrors.concat(partErrors);
        }
        
    } catch (error) {
        console.log(`  ❌ ファイル読み込みエラー: ${error.message}`);
        totalErrors.push(`Part ${index + 1}: ファイル読み込みエラー`);
    }
}

// 全体の検証結果
console.log('\n====================================');
console.log('検証結果サマリー');
console.log('====================================');

console.log(`\n📊 統計:`);
console.log(`  - 検証したパート数: ${parts.length}`);
console.log(`  - 見つかった卦の総数: ${foundHexagrams.size}/64`);
console.log(`  - エラー総数: ${totalErrors.length}`);

// 欠落している卦の確認
const missingHexagrams = expectedHexagrams.filter(h => !foundHexagrams.has(h.name));
if (missingHexagrams.length > 0) {
    console.log(`\n❌ 欠落している卦 (${missingHexagrams.length}個):`);
    missingHexagrams.forEach(h => {
        console.log(`  - ${h.id}. ${h.name}`);
    });
} else {
    console.log(`\n✅ 全64卦が存在します`);
}

// 最終判定
if (totalErrors.length === 0 && foundHexagrams.size === 64) {
    console.log('\n🎉 検証成功！');
    console.log('全64卦が正しい構造で実装されています。');
    console.log('統合作業を進めることができます。');
} else {
    console.log('\n⚠️ 検証で問題が見つかりました');
    console.log('統合前に修正が必要です。');
}

// 簡易的な内容チェック
console.log('\n====================================');
console.log('内容の簡易チェック');
console.log('====================================');

// 各卦のニックネームとemojiをリスト表示
console.log('\n📝 各卦のニックネームとemoji:');
allHexagrams.sort((a, b) => a.data.id - b.data.id).forEach(h => {
    console.log(`  ${h.data.id}. ${h.name}: ${h.data.nickname} ${h.data.emoji}`);
});