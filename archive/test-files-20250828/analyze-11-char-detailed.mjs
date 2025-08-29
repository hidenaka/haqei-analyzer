import { readFile } from 'fs/promises';

async function analyze11CharDetailed() {
  try {
    console.log('=== 11文字の説明を詳細分析 ===\n');
    
    // データベース読み込み
    const content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // window.HexagramHumanTraitsV3 のデータを解析
    const dataMatch = content.match(/window\.HexagramHumanTraitsV3\s*=\s*(\{[\s\S]*?\});/);
    if (!dataMatch) {
      console.error('データが見つかりません');
      return;
    }
    
    // evalを使わずに文字列解析で11文字を抽出
    const lines = content.split('\n');
    const elevenCharDescriptions = [];
    let currentHexagram = '';
    let currentOS = '';
    let currentSection = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 卦名を検出
      if (line.includes('"name":')) {
        const nameMatch = line.match(/"name":\s*"([^"]+)"/);
        if (nameMatch) {
          currentHexagram = nameMatch[1];
        }
      }
      
      // OS名を検出
      if (line.includes('asEngineOS:')) {
        currentOS = 'EngineOS';
      } else if (line.includes('asInterfaceOS:')) {
        currentOS = 'InterfaceOS';
      } else if (line.includes('asSafeModeOS:')) {
        currentOS = 'SafeModeOS';
      } else if (line.includes('osBalance:')) {
        currentOS = 'Balance';
      }
      
      // セクション名を検出
      const sectionMatch = line.match(/^\s*(\w+):\s*[\{"]|^\s*"(\w+)":\s*"/);
      if (sectionMatch) {
        currentSection = sectionMatch[1] || sectionMatch[2];
      }
      
      // 11文字の文字列を検出
      const stringMatches = line.match(/"([^"]+)"/g);
      if (stringMatches) {
        stringMatches.forEach(match => {
          const text = match.slice(1, -1);
          if (text.length === 11 && !text.match(/^[a-zA-Z_]+$/)) {
            // 英語のプロパティ名を除外
            elevenCharDescriptions.push({
              text,
              hexagram: currentHexagram,
              os: currentOS,
              section: currentSection,
              line: i + 1
            });
          }
        });
      }
    }
    
    // 重複を除いてユニークなものを集計
    const uniqueDescriptions = new Map();
    elevenCharDescriptions.forEach(desc => {
      if (!uniqueDescriptions.has(desc.text)) {
        uniqueDescriptions.set(desc.text, []);
      }
      uniqueDescriptions.get(desc.text).push({
        hexagram: desc.hexagram,
        os: desc.os,
        section: desc.section
      });
    });
    
    console.log(`【11文字の説明: ユニーク ${uniqueDescriptions.size}件】\n`);
    
    // カテゴリ別に分類
    const categories = {
      insufficient: [],  // 情報不足
      action: [],       // 動作系（〜する、〜していく）
      state: [],        // 状態系（〜がある、〜になる）
      compound: [],     // 複合語（、を含む）
      good: []          // 適切
    };
    
    uniqueDescriptions.forEach((locations, text) => {
      // カテゴリ判定
      if (text.includes('、')) {
        categories.compound.push({ text, locations });
      } else if (text.endsWith('する') || text.endsWith('いく') || text.endsWith('ていく')) {
        categories.action.push({ text, locations });
      } else if (text.endsWith('がある') || text.endsWith('になる') || text.endsWith('しやすい')) {
        categories.state.push({ text, locations });
      } else if (text.match(/^[^を]+を[^を]+$/) && !text.includes('て') && !text.includes('し')) {
        categories.insufficient.push({ text, locations });
      } else {
        categories.good.push({ text, locations });
      }
    });
    
    // 各カテゴリのサンプルを表示
    console.log('【情報不足の可能性がある11文字】');
    categories.insufficient.slice(0, 20).forEach(({ text, locations }) => {
      console.log(`  "${text}"`);
      if (locations[0]) {
        console.log(`    └─ ${locations[0].hexagram} (${locations[0].os})`);
      }
    });
    
    console.log('\n【複合語（、を含む）】');
    categories.compound.slice(0, 20).forEach(({ text, locations }) => {
      console.log(`  "${text}"`);
      if (locations[0]) {
        console.log(`    └─ ${locations[0].hexagram} (${locations[0].os})`);
      }
    });
    
    console.log('\n【動作系（修正候補）】');
    categories.action.slice(0, 20).forEach(({ text, locations }) => {
      console.log(`  "${text}"`);
      if (locations[0]) {
        console.log(`    └─ ${locations[0].hexagram} (${locations[0].os})`);
      }
    });
    
    console.log('\n【状態系（修正候補）】');
    categories.state.slice(0, 20).forEach(({ text, locations }) => {
      console.log(`  "${text}"`);
      if (locations[0]) {
        console.log(`    └─ ${locations[0].hexagram} (${locations[0].os})`);
      }
    });
    
    console.log('\n【統計】');
    console.log(`情報不足の可能性: ${categories.insufficient.length}件`);
    console.log(`複合語: ${categories.compound.length}件`);
    console.log(`動作系: ${categories.action.length}件`);
    console.log(`状態系: ${categories.state.length}件`);
    console.log(`適切: ${categories.good.length}件`);
    
    const needsImprovement = categories.insufficient.length + categories.compound.length + 
                             categories.action.length + categories.state.length;
    console.log(`\n修正が必要な可能性: ${needsImprovement}件 / ${uniqueDescriptions.size}件`);
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

analyze11CharDetailed();