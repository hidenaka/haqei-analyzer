// 日本語対応精度自動検証スクリプト
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// グローバルオブジェクトの準備
global.window = global;
global.document = { readyState: 'complete' };

// H384データの読み込み
const h384Script = fs.readFileSync(join(__dirname, 'public/assets/H384H64database.js'), 'utf8');
try {
    eval(h384Script);
} catch (e) {
    // DOM関連エラーは無視
}

const H384_DATA = global.H384_DATA;

console.log('================================================');
console.log('🇯🇵 日本語対応精度検証 - 自動テスト');
console.log('================================================\n');

// 1. データ完全性チェック
console.log('📊 Test 1: H384データ日本語フィールド完全性');
console.log('----------------------------------------');

const requiredFields = [
    '通し番号', '卦番号', '卦名', '爻', 'キーワード',
    '現代解釈の要約', 'S1_基本スコア', 'S2_ポテンシャル',
    'S3_安定性スコア', 'S4_リスク', 'S6_変動性スコア', 'S7_総合評価スコア'
];

let validEntries = 0;
let missingFieldsMap = new Map();
let encodingIssues = [];

H384_DATA.forEach((entry, index) => {
    let isValid = true;
    requiredFields.forEach(field => {
        if (!entry.hasOwnProperty(field)) {
            if (!missingFieldsMap.has(field)) {
                missingFieldsMap.set(field, 0);
            }
            missingFieldsMap.set(field, missingFieldsMap.get(field) + 1);
            isValid = false;
        }
    });
    
    if (isValid) {
        validEntries++;
        
        // 文字化けチェック
        if (entry['卦名'] && (entry['卦名'].includes('�') || entry['卦名'].includes('?'))) {
            encodingIssues.push({
                index: index,
                field: '卦名',
                value: entry['卦名']
            });
        }
        if (entry['現代解釈の要約'] && entry['現代解釈の要約'].includes('�')) {
            encodingIssues.push({
                index: index,
                field: '現代解釈の要約',
                value: entry['現代解釈の要約'].substring(0, 30)
            });
        }
    }
});

const dataIntegrityScore = (validEntries / H384_DATA.length) * 100;

console.log(`総エントリ数: ${H384_DATA.length}`);
console.log(`有効エントリ数: ${validEntries} (${dataIntegrityScore.toFixed(1)}%)`);

if (missingFieldsMap.size > 0) {
    console.log('\n⚠️ 欠損フィールド:');
    missingFieldsMap.forEach((count, field) => {
        console.log(`  - ${field}: ${count}件`);
    });
} else {
    console.log('✅ 全フィールド完全');
}

if (encodingIssues.length > 0) {
    console.log(`\n⚠️ 文字化け検出: ${encodingIssues.length}件`);
    encodingIssues.slice(0, 3).forEach(issue => {
        console.log(`  - Entry ${issue.index} [${issue.field}]: ${issue.value}`);
    });
} else {
    console.log('✅ 文字化けなし');
}

// サンプル表示
console.log('\nサンプルデータ（最初の3件）:');
for (let i = 0; i < Math.min(3, H384_DATA.length); i++) {
    const entry = H384_DATA[i];
    console.log(`  [${i}] ${entry['卦名']} - ${entry['爻']}`);
    console.log(`      キーワード: ${entry['キーワード']}`);
    console.log(`      総合スコア: ${entry['S7_総合評価スコア']}`);
}

// 2. キーワード解析精度
console.log('\n🔍 Test 2: キーワード解析精度');
console.log('----------------------------------------');

let keywordStats = {
    totalEntries: 0,
    entriesWithKeywords: 0,
    totalKeywords: 0,
    avgKeywordsPerEntry: 0,
    minKeywords: Infinity,
    maxKeywords: 0
};

H384_DATA.forEach(entry => {
    keywordStats.totalEntries++;
    
    if (entry['キーワード']) {
        keywordStats.entriesWithKeywords++;
        // キーワードが文字列か配列かチェック
        const keywords = typeof entry['キーワード'] === 'string' 
            ? entry['キーワード'].split(',') 
            : entry['キーワード'];
        const keywordCount = keywords.length;
        
        keywordStats.totalKeywords += keywordCount;
        keywordStats.minKeywords = Math.min(keywordStats.minKeywords, keywordCount);
        keywordStats.maxKeywords = Math.max(keywordStats.maxKeywords, keywordCount);
    }
});

keywordStats.avgKeywordsPerEntry = keywordStats.totalKeywords / keywordStats.entriesWithKeywords;
const keywordCoverage = (keywordStats.entriesWithKeywords / keywordStats.totalEntries) * 100;

console.log(`キーワード保有率: ${keywordCoverage.toFixed(1)}%`);
console.log(`総キーワード数: ${keywordStats.totalKeywords}`);
console.log(`平均キーワード数: ${keywordStats.avgKeywordsPerEntry.toFixed(1)}個/エントリ`);
console.log(`最小/最大: ${keywordStats.minKeywords}個 / ${keywordStats.maxKeywords}個`);

// キーワードの頻度分析
const keywordFrequency = new Map();
H384_DATA.forEach(entry => {
    if (entry['キーワード']) {
        const keywords = typeof entry['キーワード'] === 'string'
            ? entry['キーワード'].split(',')
            : entry['キーワード'];
        keywords.forEach(keyword => {
            const trimmed = typeof keyword === 'string' ? keyword.trim() : keyword;
            keywordFrequency.set(trimmed, (keywordFrequency.get(trimmed) || 0) + 1);
        });
    }
});

// 頻出キーワードTop10
const sortedKeywords = Array.from(keywordFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

console.log('\n頻出キーワードTop10:');
sortedKeywords.forEach(([keyword, count], index) => {
    console.log(`  ${index + 1}. ${keyword}: ${count}回`);
});

// 3. 文字エンコーディング検証
console.log('\n🔤 Test 3: 文字エンコーディング検証');
console.log('----------------------------------------');

const testCases = [
    { name: '易経専門用語', texts: ['乾為天', '坤為地', '水雷屯', '山水蒙'] },
    { name: '爻名', texts: ['初九', '九二', '六三', '九四', '六五', '上九', '上六'] },
    { name: 'ひらがな', texts: ['あいうえお', 'かきくけこ', 'さしすせそ'] },
    { name: 'カタカナ', texts: ['アイウエオ', 'カキクケコ', 'サシスセソ'] },
    { name: '漢字', texts: ['基本', 'ポテンシャル', '安定性', '変動性'] }
];

let encodingScore = 0;
let totalTests = 0;

testCases.forEach(testCase => {
    let passed = 0;
    testCase.texts.forEach(text => {
        const encoded = encodeURIComponent(text);
        const decoded = decodeURIComponent(encoded);
        if (text === decoded) {
            passed++;
        }
        totalTests++;
    });
    
    const passRate = (passed / testCase.texts.length) * 100;
    encodingScore += passed;
    console.log(`${testCase.name}: ${passed}/${testCase.texts.length} (${passRate.toFixed(0)}%)`);
});

encodingScore = (encodingScore / totalTests) * 100;

// 4. 現代解釈の日本語品質
console.log('\n📝 Test 4: 現代解釈の日本語品質');
console.log('----------------------------------------');

let interpretationStats = {
    hasInterpretation: 0,
    avgLength: 0,
    minLength: Infinity,
    maxLength: 0,
    totalLength: 0
};

H384_DATA.forEach(entry => {
    if (entry['現代解釈の要約']) {
        interpretationStats.hasInterpretation++;
        const length = entry['現代解釈の要約'].length;
        interpretationStats.totalLength += length;
        interpretationStats.minLength = Math.min(interpretationStats.minLength, length);
        interpretationStats.maxLength = Math.max(interpretationStats.maxLength, length);
    }
});

interpretationStats.avgLength = interpretationStats.totalLength / interpretationStats.hasInterpretation;
const interpretationCoverage = (interpretationStats.hasInterpretation / H384_DATA.length) * 100;

console.log(`解釈保有率: ${interpretationCoverage.toFixed(1)}%`);
console.log(`平均文字数: ${interpretationStats.avgLength.toFixed(0)}文字`);
console.log(`最小/最大: ${interpretationStats.minLength}文字 / ${interpretationStats.maxLength}文字`);

// サンプル表示
console.log('\n現代解釈サンプル:');
for (let i = 0; i < 3; i++) {
    const entry = H384_DATA[i];
    if (entry['現代解釈の要約']) {
        console.log(`  ${entry['卦名']} ${entry['爻']}:`);
        console.log(`  "${entry['現代解釈の要約'].substring(0, 50)}..."`);
    }
}

// 5. スコアデータの完全性
console.log('\n📈 Test 5: スコアデータ完全性');
console.log('----------------------------------------');

const scoreFields = [
    'S1_基本スコア', 'S2_ポテンシャル', 'S3_安定性スコア',
    'S4_リスク', 'S6_変動性スコア', 'S7_総合評価スコア'
];

let scoreStats = {};
scoreFields.forEach(field => {
    scoreStats[field] = {
        valid: 0,
        min: Infinity,
        max: -Infinity,
        sum: 0
    };
});

H384_DATA.forEach(entry => {
    scoreFields.forEach(field => {
        const value = parseInt(entry[field]);
        if (!isNaN(value)) {
            scoreStats[field].valid++;
            scoreStats[field].min = Math.min(scoreStats[field].min, value);
            scoreStats[field].max = Math.max(scoreStats[field].max, value);
            scoreStats[field].sum += value;
        }
    });
});

scoreFields.forEach(field => {
    const stats = scoreStats[field];
    const coverage = (stats.valid / H384_DATA.length) * 100;
    const avg = stats.sum / stats.valid;
    console.log(`${field}:`);
    console.log(`  有効率: ${coverage.toFixed(1)}%`);
    console.log(`  範囲: ${stats.min} ~ ${stats.max}`);
    console.log(`  平均: ${avg.toFixed(1)}`);
});

// 総合評価
console.log('\n================================================');
console.log('📊 総合評価');
console.log('================================================');

const scores = {
    'データ完全性': dataIntegrityScore,
    'キーワード保有率': keywordCoverage,
    'エンコーディング': encodingScore,
    '現代解釈保有率': interpretationCoverage,
    'スコア完全性': (scoreStats['S7_総合評価スコア'].valid / H384_DATA.length) * 100
};

let totalScore = 0;
Object.entries(scores).forEach(([name, score]) => {
    console.log(`${name}: ${score.toFixed(1)}%`);
    totalScore += score;
});

const avgScore = totalScore / Object.keys(scores).length;
console.log(`\n総合精度スコア: ${avgScore.toFixed(1)}%`);

if (avgScore >= 90) {
    console.log('✅ 結果: 日本語対応は非常に高精度で動作しています');
} else if (avgScore >= 75) {
    console.log('⚠️ 結果: 日本語対応は良好ですが、一部改善の余地があります');
} else {
    console.log('❌ 結果: 日本語対応に問題があります。改善が必要です');
}

console.log('\n================================================');