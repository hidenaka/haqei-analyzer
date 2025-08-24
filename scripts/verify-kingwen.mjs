#!/usr/bin/env node
/**
 * King Wen Mapping Verification Script
 * v4.3.1 - 生成ではなく検証によるソース・オブ・トゥルース保証
 * 
 * 致命度High修正: 二進の自然順≠King Wen順の破綻修正
 * config/kingwen-mapping.json を単一の真実として検証
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const scriptDir = new URL('.', import.meta.url).pathname;
const projectRoot = path.resolve(scriptDir, '..');
const mappingPath = path.join(projectRoot, 'config/kingwen-mapping.json');

try {
  const mapping = JSON.parse(await fs.readFile(mappingPath, 'utf8'));
  
  // 配列に変換（hexagramsオブジェクトから）
  const kw = Object.values(mapping.hexagrams);
  
  // Map構築（高速検索用）
  const num2bin = new Map(kw.map(x => [x.number, x.binary]));  // 下→上の6ビット
  const bin2num = new Map(kw.map(x => [x.binary, x.number]));
  const num2name = new Map(kw.map(x => [x.number, x.name]));

  console.log('🔍 King Wen Mapping Verification Starting...\n');

  // ビット反転ユーティリティ（変爻計算用）
  const flip = (bin, lines) => {
    const arr = bin.split('');
    for (const l of [...new Set(lines)]) { 
      const idx = l - 1; 
      if (idx < 0 || idx > 5) throw new Error(`Invalid line number: ${l}`);
      arr[idx] = arr[idx] === '1' ? '0' : '1'; 
    }
    return arr.join('');
  };

  // 1) Bijection（双射性）検証
  console.log('📋 1. Bijection Verification');
  if (kw.length !== 64) throw new Error(`Expected 64 hexagrams, got ${kw.length}`);
  if (new Set(kw.map(x => x.binary)).size !== 64) throw new Error('Binary representations not unique');
  if (new Set(kw.map(x => x.number)).size !== 64) throw new Error('King Wen numbers not unique');
  if (new Set(kw.map(x => x.name)).size !== 64) throw new Error('Hexagram names not unique');
  console.log('   ✅ All 64 mappings are unique and complete\n');

  // 2) Bit Orientation（ビット方位）検証 - 下→上の規約確認
  console.log('📋 2. Bit Orientation Verification (Bottom→Top)');
  const qian = num2bin.get(1);  // 乾: 111111（全陽）
  const kun = num2bin.get(2);   // 坤: 000000（全陰）
  if (!qian || qian !== '111111') throw new Error(`乾(1) should be '111111', got '${qian}'`);
  if (!kun || kun !== '000000') throw new Error(`坤(2) should be '000000', got '${kun}'`);
  
  // 初爻（index 0）が下、上爻（index 5）が上の確認
  if (qian[0] !== '1' || qian[5] !== '1') throw new Error('Bit orientation broken: 乾 should have all 1s');
  if (kun[0] !== '0' || kun[5] !== '0') throw new Error('Bit orientation broken: 坤 should have all 0s');
  console.log('   ✅ Bit orientation correct: index[0]=初爻(bottom), index[5]=上爻(top)\n');

  // 3) Involution（対合性）検証 - 同じ爻位を2回反転で原状復帰
  console.log('📋 3. Involution Verification (Double flip = identity)');
  let involutionTests = 0;
  for (const {number, binary} of kw) {
    for (let line = 1; line <= 6; line++) {
      const flipped1 = flip(binary, [line]);
      const flipped2 = flip(flipped1, [line]);
      if (flipped2 !== binary) {
        throw new Error(`Involution failed: hex ${number} line ${line}`);
      }
      involutionTests++;
    }
  }
  console.log(`   ✅ All ${involutionTests} involution tests passed\n`);

  // 4) Known Transformations（既知変換）検証
  console.log('📋 4. Known Transformation Verification');
  const knownTransforms = [
    { from: 1,  lines: [1], to: 10, desc: '乾初爻→履' },
    { from: 2,  lines: [1], to: 15, desc: '坤初爻→謙' },
    { from: 1,  lines: [6], to: 9, desc: '乾上爻→小畜' },
    { from: 2,  lines: [6], to: 16, desc: '坤上爻→豫' }
  ];

  for (const transform of knownTransforms) {
    const fromBinary = num2bin.get(transform.from);
    const toBinary = flip(fromBinary, transform.lines);
    const actualTo = bin2num.get(toBinary);
    
    if (actualTo !== transform.to) {
      const fromName = num2name.get(transform.from);
      const expectedName = num2name.get(transform.to);
      const actualName = num2name.get(actualTo);
      throw new Error(
        `Known transform failed: ${transform.desc}\n` +
        `  Expected: ${fromName}(${transform.from}) → ${expectedName}(${transform.to})\n` +
        `  Actual:   ${fromName}(${transform.from}) → ${actualName}(${actualTo})`
      );
    }
  }
  console.log(`   ✅ All ${knownTransforms.length} known transformations verified\n`);

  // 5) Complement Check（補卦関係）検証
  console.log('📋 5. Complement Relationship Verification');
  const knownComplements = [
    { a: 1, b: 2 },   // 乾↔坤
    { a: 3, b: 50 },  // 屯↔鼎（001010 ↔ 110101）
    { a: 63, b: 64 }  // 既済↔未済
  ];

  for (const {a, b} of knownComplements) {
    const binA = num2bin.get(a);
    const binB = num2bin.get(b);
    const complement = binA.split('').map(bit => bit === '1' ? '0' : '1').join('');
    
    if (complement !== binB) {
      throw new Error(`Complement failed: ${a}(${binA}) complement should be ${b}(${binB}), got ${complement}`);
    }
  }
  console.log(`   ✅ All ${knownComplements.length} complement relationships verified\n`);

  // 6) Statistical Validation（統計的妥当性）
  console.log('📋 6. Statistical Validation');
  const onesCount = kw.reduce((sum, hex) => sum + hex.binary.split('').filter(b => b === '1').length, 0);
  const expectedOnes = 64 * 6 / 2; // 384個中192個が1であるべき
  const tolerance = 20; // ±20個程度の許容範囲
  
  if (Math.abs(onesCount - expectedOnes) > tolerance) {
    throw new Error(`Bit balance failed: expected ~${expectedOnes} ones, got ${onesCount}`);
  }
  console.log(`   ✅ Bit balance acceptable: ${onesCount}/384 ones (expected ~${expectedOnes})\n`);

  // 7) Structural Integrity（構造的整合性）
  console.log('📋 7. Structural Integrity Check');
  
  // 重卦の存在確認（上下同じ卦）
  const doubleHexagrams = [1, 2, 29, 30, 51, 52, 57, 58]; // 乾坤坎離震艮巽兌
  for (const num of doubleHexagrams) {
    const binary = num2bin.get(num);
    const upper = binary.slice(3, 6);
    const lower = binary.slice(0, 3);
    if (upper !== lower) {
      throw new Error(`Double hexagram ${num} should have identical trigrams, got ${binary}`);
    }
  }
  console.log(`   ✅ All ${doubleHexagrams.length} double hexagrams verified\n`);

  console.log('🎉 King Wen Mapping Verification COMPLETED');
  console.log('   All structural, mathematical, and traditional relationships verified');
  console.log('   Source of Truth: config/kingwen-mapping.json is authoritative\n');

} catch (error) {
  console.error('❌ King Wen Mapping Verification FAILED');
  console.error('Error:', error.message);
  process.exit(1);
}