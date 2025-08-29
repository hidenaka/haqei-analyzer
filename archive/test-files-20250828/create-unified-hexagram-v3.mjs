/**
 * 64卦 v3データベース統合スクリプト
 * 8つのパートファイルを1つのファイルに統合
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 各パートファイル
const parts = [
    'hexagram-human-traits-v3-part1.js',
    'hexagram-human-traits-v3-part2.js',
    'hexagram-human-traits-v3-part3.js',
    'hexagram-human-traits-v3-part4.js',
    'hexagram-human-traits-v3-part5.js',
    'hexagram-human-traits-v3-part6.js',
    'hexagram-human-traits-v3-part7.js',
    'hexagram-human-traits-v3-part8.js'
];

console.log('====================================');
console.log('64卦 v3データベース統合処理');
console.log('====================================\n');

// 全データを格納するオブジェクト
let allHexagrams = {};
let hexagramCount = 0;

// 各パートファイルを読み込んで統合
for (const [index, partFile] of parts.entries()) {
    console.log(`📁 Part ${index + 1}: ${partFile} を処理中...`);
    
    const filePath = join(__dirname, 'public/js/data', partFile);
    
    try {
        // ファイル読み込み
        const fileContent = readFileSync(filePath, 'utf-8');
        
        // constの名前を取得
        const constNameMatch = fileContent.match(/const\s+(\w+)\s*=/);
        if (!constNameMatch) {
            throw new Error('データオブジェクトが見つかりません');
        }
        const constName = constNameMatch[1];
        
        // オブジェクトのコンテンツ部分を抽出（const xxx = { ... } の中身）
        const objectMatch = fileContent.match(/const\s+\w+\s*=\s*({[\s\S]*?});/);
        if (!objectMatch) {
            throw new Error('オブジェクトの内容が見つかりません');
        }
        
        // evalを使用してオブジェクトを取得
        const dataObj = eval(`(${objectMatch[1]})`);
        
        const keys = Object.keys(dataObj);
        console.log(`  ✅ ${keys.length}個の卦を読み込みました`);
        
        // 統合
        Object.assign(allHexagrams, dataObj);
        hexagramCount += keys.length;
        
    } catch (error) {
        console.log(`  ❌ エラー: ${error.message}`);
    }
}

console.log(`\n📊 統合結果: 合計 ${hexagramCount} 個の卦`);

// 統合ファイルの作成
const outputPath = join(__dirname, 'public/js/data', 'hexagram-human-traits-v3.js');

const fileHeader = `/**
 * Triple OS 人格システムデータベース v3.0 - 統合版
 * 全64卦の完全データベース
 * 
 * このファイルは8つのパートファイルから自動生成されました。
 * 直接編集せず、パートファイルを編集してから再生成してください。
 * 
 * @author Claude Code
 * @date ${new Date().toISOString().split('T')[0]}
 * @version 3.0.0
 */

`;

const fileContent = fileHeader + 
    'const HexagramHumanTraitsV3 = ' + 
    JSON.stringify(allHexagrams, null, 4) + 
    ';\n\n' +
    '// エクスポート\n' +
    'if (typeof module !== \'undefined\' && module.exports) {\n' +
    '    module.exports = HexagramHumanTraitsV3;\n' +
    '}\n';

try {
    writeFileSync(outputPath, fileContent, 'utf-8');
    console.log(`\n✅ 統合ファイルを作成しました: ${outputPath}`);
    
    // ファイルサイズを確認
    const stats = readFileSync(outputPath, 'utf-8');
    const sizeInKB = Math.round(stats.length / 1024);
    console.log(`📦 ファイルサイズ: ${sizeInKB} KB`);
    
    // 各卦のID順にソートして表示
    const sortedHexagrams = Object.entries(allHexagrams)
        .sort((a, b) => a[1].id - b[1].id)
        .map(([name, data]) => `${data.id}. ${name} (${data.nickname})`);
    
    console.log('\n📝 含まれる卦一覧:');
    sortedHexagrams.forEach((item, index) => {
        if (index % 8 === 0) console.log('');
        process.stdout.write(item.padEnd(20));
    });
    console.log('\n');
    
    console.log('🎉 統合処理が完了しました！');
    
} catch (error) {
    console.log(`\n❌ ファイル書き込みエラー: ${error.message}`);
}