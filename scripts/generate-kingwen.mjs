#!/usr/bin/env node
/**
 * King Wenマッピング自動生成スクリプト
 * CSVから正確な二進表記を生成し、手動編集エラーを防止
 */

import fs from 'fs/promises';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 八卦から3ビット二進表記への変換
const trigramToBits = {
  '乾': '111',  // ☰ 天
  '坤': '000',  // ☷ 地
  '震': '001',  // ☳ 雷
  '坎': '010',  // ☵ 水
  '艮': '100',  // ☶ 山
  '巽': '110',  // ☴ 風
  '離': '101',  // ☲ 火
  '兌': '011'   // ☱ 澤
};

// 逆マッピング（検証用）
const bitsToTrigram = Object.fromEntries(
  Object.entries(trigramToBits).map(([k, v]) => [v, k])
);

async function generateKingWenMapping() {
  console.log('🔄 King Wenマッピング生成開始...');
  
  try {
    // CSVファイル読み込み
    const csvPath = path.join(__dirname, '..', 'data', 'kingwen-canonical.csv');
    const csvContent = await fs.readFile(csvPath, 'utf-8');
    
    // CSV解析
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',');
    const rows = lines.slice(1).map(line => line.split(','));
    
    // マッピング生成
    const hexagrams = {};
    const binaryToNum = {};
    
    for (const [num, name, lower, upper] of rows) {
      // 下爻→上爻の順で6ビット生成
      const lowerBits = trigramToBits[lower.trim()];
      const upperBits = trigramToBits[upper.trim()];
      
      if (!lowerBits || !upperBits) {
        throw new Error(`Unknown trigram: lower=${lower}, upper=${upper} for hexagram ${num}`);
      }
      
      // 重要: ビット表現の規約
      // - 文字列の左側（位置0-2）が下卦
      // - 文字列の右側（位置3-5）が上卦
      // 例: 地天泰(11) = 乾(下111) + 坤(上000) = 111000
      const binary = lowerBits + upperBits;
      
      hexagrams[num] = {
        number: parseInt(num),
        name: name.trim(),
        trigrams: [lower.trim(), upper.trim()],
        binary: binary,
        structure: {
          lower: {
            name: lower.trim(),
            bits: lowerBits
          },
          upper: {
            name: upper.trim(),
            bits: upperBits
          }
        }
      };
      
      // 逆引き用
      binaryToNum[binary] = parseInt(num);
    }
    
    // 検証: 64卦すべて存在
    if (Object.keys(hexagrams).length !== 64) {
      throw new Error(`Expected 64 hexagrams, got ${Object.keys(hexagrams).length}`);
    }
    
    // 検証: binaryが重複していない
    const uniqueBinaries = new Set(Object.values(hexagrams).map(h => h.binary));
    if (uniqueBinaries.size !== 64) {
      throw new Error(`Binary values are not unique: ${uniqueBinaries.size}/64`);
    }
    
    // 出力オブジェクト作成
    const output = {
      version: '4.3.0',
      generatedAt: new Date().toISOString(),
      encoding: 'lowerToUpper',
      generator: {
        name: 'generate-kingwen.mjs',
        version: '1.0.0'
      },
      hexagrams: hexagrams,
      binaryToNum: binaryToNum,
      metadata: {
        totalHexagrams: 64,
        sourceFile: 'data/kingwen-canonical.csv',
        trigramSystem: '八卦',
        bitOrder: 'lower-first'
      }
    };
    
    // チェックサム計算
    const jsonString = JSON.stringify(output, null, 2);
    const checksum = crypto.createHash('sha256')
      .update(jsonString)
      .digest('hex');
    
    output.checksum = checksum;
    
    // ファイル出力
    const outputPath = path.join(__dirname, '..', 'config', 'kingwen-mapping.json');
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(output, null, 2));
    
    // 統計出力
    console.log('✅ King Wenマッピング生成完了:');
    console.log(`   - 卦数: ${Object.keys(hexagrams).length}`);
    console.log(`   - チェックサム: ${checksum.substring(0, 16)}...`);
    console.log(`   - 出力先: ${outputPath}`);
    
    // 既知の値を検証（回帰防止）
    const knownValues = [
      { num: 1, binary: '111111', name: '乾為天' },
      { num: 2, binary: '000000', name: '坤為地' },
      { num: 11, binary: '111000', name: '地天泰' },  // 重要: 天が下、地が上
      { num: 12, binary: '000111', name: '天地否' },  // 重要: 地が下、天が上
      { num: 63, binary: '101010', name: '水火既済' },
      { num: 64, binary: '010101', name: '火水未済' }
    ];
    
    console.log('\n🔍 既知値検証:');
    for (const known of knownValues) {
      const actual = hexagrams[known.num];
      if (actual.binary !== known.binary) {
        throw new Error(
          `Binary mismatch for ${known.name}(${known.num}): ` +
          `expected ${known.binary}, got ${actual.binary}`
        );
      }
      console.log(`   ✓ ${known.name}(${known.num}): ${known.binary}`);
    }
    
    return output;
    
  } catch (error) {
    console.error('❌ エラー:', error.message);
    process.exit(1);
  }
}

// 実行
if (import.meta.url === `file://${process.argv[1]}`) {
  generateKingWenMapping();
}

export { generateKingWenMapping };