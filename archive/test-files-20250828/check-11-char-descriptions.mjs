import { readFile } from 'fs/promises';

async function check11CharDescriptions() {
  try {
    console.log('=== 11文字の説明を抽出して確認 ===\n');
    
    // データベース読み込み
    const content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // 11文字の説明を抽出
    const pattern = /"[^"]+"/g;
    const matches = content.match(pattern) || [];
    
    const elevenCharDescriptions = new Map();
    
    matches.forEach(match => {
      const text = match.slice(1, -1); // ダブルクォートを除去
      if (text.length === 11) {
        if (!elevenCharDescriptions.has(text)) {
          elevenCharDescriptions.set(text, []);
        }
        
        // どの卦のどのパスにあるか特定（簡易的に）
        const lines = content.split('\n');
        let currentHexagram = '';
        let currentPath = '';
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.includes(match)) {
            // 前の行から卦名を探す
            for (let j = i - 1; j >= Math.max(0, i - 50); j--) {
              if (lines[j].includes('// ') && lines[j].includes('卦')) {
                currentHexagram = lines[j].replace(/.*\/\/ /, '').replace(/ - .*/, '');
                break;
              } else if (lines[j].includes('"name":')) {
                const nameMatch = lines[j].match(/"name":\s*"([^"]+)"/);
                if (nameMatch) {
                  currentHexagram = nameMatch[1];
                  break;
                }
              }
            }
            
            // パスを特定
            const pathMatch = line.match(/(\w+):\s*"/);
            if (pathMatch) {
              currentPath = pathMatch[1];
            }
            
            elevenCharDescriptions.get(text).push({
              hexagram: currentHexagram || '不明',
              path: currentPath || '不明',
              lineNumber: i + 1
            });
            break;
          }
        }
      }
    });
    
    // 結果を表示（最初の50件）
    console.log(`【11文字の説明: 合計 ${elevenCharDescriptions.size}件】\n`);
    
    let count = 0;
    const samples = [];
    
    elevenCharDescriptions.forEach((locations, text) => {
      if (count < 50) {
        samples.push({ text, locations });
        count++;
      }
    });
    
    // サンプルを表示
    console.log('【サンプル（最初の50件）】\n');
    samples.forEach(({ text, locations }) => {
      console.log(`"${text}"`);
      locations.slice(0, 1).forEach(loc => {
        console.log(`  └─ ${loc.hexagram || '場所不明'}`);
      });
    });
    
    // 情報不足と思われるものを判定
    console.log('\n【内容が不十分な可能性がある11文字の説明】\n');
    
    const insufficientPatterns = [
      /^手伝ってもらう$/,
      /^することがある$/,
      /^していく$/,
      /^を持つ$/,
      /^を得る$/,
      /^する$/,
      /^なる$/,
      /^がある$/,
      /^できる$/,
      /^いく$/,
      /しやすい$/,
      /になりやすい$/,
      /^[^、。]+する力$/,
      /^[^、。]+を[^、。]+$/
    ];
    
    let insufficientCount = 0;
    elevenCharDescriptions.forEach((locations, text) => {
      const isInsufficient = insufficientPatterns.some(pattern => pattern.test(text));
      if (isInsufficient || text.includes('、') || !text.includes('を') && !text.includes('に') && !text.includes('で') && !text.includes('が')) {
        if (insufficientCount < 30) {
          console.log(`❓ "${text}"`);
          locations.slice(0, 1).forEach(loc => {
            console.log(`    └─ ${loc.hexagram || '場所不明'}`);
          });
          insufficientCount++;
        }
      }
    });
    
    console.log(`\n合計: ${insufficientCount}件の11文字説明が内容不十分の可能性があります`);
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

check11CharDescriptions();