import { readFile } from 'fs/promises';

async function checkMockV3Usage() {
  try {
    // mockファイルを読み込む
    const mockContent = await readFile('./results-dynamic-mockup.html', 'utf-8');
    
    // V3データベースファイルを読み込む
    const v3Content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // windowオブジェクトを模擬
    const window = {};
    eval(v3Content);
    
    const allV3Hexagrams = Object.keys(window.HexagramHumanTraitsV3);
    
    // mockで定義されている卦を抽出
    const mockDefinedHexagrams = [];
    const mockUsedHexagrams = new Set();
    
    // v3Databaseで定義されている卦を探す
    const v3DatabaseMatch = mockContent.match(/const v3Database = \{([^}]+\}){5,}/s);
    if (v3DatabaseMatch) {
      const hexPattern = /"([^"]+)":\s*\{[^}]*nickname:/g;
      let match;
      while ((match = hexPattern.exec(mockContent)) !== null) {
        mockDefinedHexagrams.push(match[1]);
      }
    }
    
    // dataPatterns内で使用されている卦を探す
    const patternsMatch = mockContent.match(/const dataPatterns = \{[\s\S]*?\};/);
    if (patternsMatch) {
      const hexagramPattern = /hexagram:\s*"([^"]+)"/g;
      let match;
      while ((match = hexagramPattern.exec(patternsMatch[0])) !== null) {
        mockUsedHexagrams.add(match[1]);
      }
    }
    
    console.log('=== Mock V3データベース使用状況レポート ===\n');
    
    console.log('【mockで定義されている卦】');
    mockDefinedHexagrams.forEach(hex => {
      console.log(`  ✓ ${hex}`);
    });
    
    console.log(`\n合計: ${mockDefinedHexagrams.length}個\n`);
    
    console.log('【mockのdataPatternsで実際に使用されている卦】');
    Array.from(mockUsedHexagrams).forEach(hex => {
      console.log(`  ★ ${hex}`);
    });
    
    console.log(`\n合計: ${mockUsedHexagrams.size}個\n`);
    
    console.log('=== 全64卦のチェックリスト ===\n');
    console.log('【凡例】');
    console.log('  ✅ = mockで定義済み + 使用されている');
    console.log('  📝 = mockで定義済み（未使用）');
    console.log('  ❌ = mockで未定義\n');
    
    allV3Hexagrams.forEach((hexName, index) => {
      const isDefined = mockDefinedHexagrams.includes(hexName);
      const isUsed = mockUsedHexagrams.has(hexName);
      
      let status = '❌';
      if (isDefined && isUsed) {
        status = '✅';
      } else if (isDefined && !isUsed) {
        status = '📝';
      }
      
      const hex = window.HexagramHumanTraitsV3[hexName];
      console.log(`${String(index + 1).padStart(2, '0')}. ${status} ${hexName} (${hex.nickname})`);
    });
    
    // 統計
    const definedCount = mockDefinedHexagrams.length;
    const usedCount = mockUsedHexagrams.size;
    const undefinedCount = allV3Hexagrams.length - definedCount;
    
    console.log('\n=== 統計サマリー ===');
    console.log(`✅ 定義済み＆使用中: ${Array.from(mockUsedHexagrams).filter(h => mockDefinedHexagrams.includes(h)).length}個`);
    console.log(`📝 定義済み＆未使用: ${mockDefinedHexagrams.filter(h => !mockUsedHexagrams.has(h)).length}個`);
    console.log(`❌ 未定義: ${undefinedCount}個`);
    console.log(`全体: ${allV3Hexagrams.length}個`);
    
    // 未定義の卦リスト
    const undefinedHexagrams = allV3Hexagrams.filter(h => !mockDefinedHexagrams.includes(h));
    if (undefinedHexagrams.length > 0) {
      console.log('\n【mockで未定義の卦一覧】');
      undefinedHexagrams.forEach((hex, i) => {
        const data = window.HexagramHumanTraitsV3[hex];
        if (i % 3 === 0) process.stdout.write('\n  ');
        process.stdout.write(`${hex}(${data.nickname})  `);
      });
      console.log('');
    }
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

checkMockV3Usage();