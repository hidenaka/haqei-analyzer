import { readFile } from 'fs/promises';

async function listShortDescriptions() {
  try {
    console.log('=== 10文字未満の説明リスト ===\n');
    
    // データベース読み込み
    const content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // 説明文を抽出
    const lines = content.split('\n');
    const shortDescriptions = new Map();
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const matches = line.match(/"([^"]*[ぁ-んァ-ヶー一-龯][^"]*)"/g);
      
      if (matches) {
        matches.forEach(match => {
          const text = match.slice(1, -1);
          
          // 10文字未満の日本語説明のみ
          if (text.length < 10 && !text.match(/^[a-zA-Z_]+$/)) {
            // 前後の文脈から卦名を推定
            let hexagram = '';
            let context = '';
            
            // 前の行から卦名を探す
            for (let j = i - 1; j >= Math.max(0, i - 30); j--) {
              if (lines[j].includes('name:')) {
                const nameMatch = lines[j].match(/"name":\s*"([^"]+)"/);
                if (nameMatch) {
                  hexagram = nameMatch[1];
                  break;
                }
              }
            }
            
            // どのプロパティか特定
            const propMatch = line.match(/(\w+):\s*"/);
            if (propMatch) {
              context = propMatch[1];
            }
            
            if (!shortDescriptions.has(text.length)) {
              shortDescriptions.set(text.length, []);
            }
            
            shortDescriptions.get(text.length).push({
              text,
              hexagram: hexagram || '不明',
              context,
              line: i + 1
            });
          }
        });
      }
    }
    
    // 文字数別に表示
    const lengths = Array.from(shortDescriptions.keys()).sort((a, b) => a - b);
    
    lengths.forEach(length => {
      const items = shortDescriptions.get(length);
      console.log(`\n【${length}文字】${items.length}件\n`);
      
      // 同じテキストをグループ化
      const textGroups = new Map();
      items.forEach(item => {
        if (!textGroups.has(item.text)) {
          textGroups.set(item.text, []);
        }
        textGroups.get(item.text).push(item);
      });
      
      // ユニークなテキストを表示
      let count = 0;
      textGroups.forEach((locations, text) => {
        if (count < 20) {
          console.log(`"${text}"`);
          // 最初の出現場所のみ表示
          if (locations[0].hexagram !== '不明') {
            console.log(`  └─ ${locations[0].hexagram}`);
          }
          count++;
        }
      });
      
      if (textGroups.size > 20) {
        console.log(`... 他 ${textGroups.size - 20}種類`);
      }
    });
    
    // 修正が必要な理由を分析
    console.log('\n【修正が必要な理由】\n');
    console.log('1-3文字: 卦名のみで説明になっていない');
    console.log('4-6文字: タイプ名や役割名のみで具体性に欠ける');
    console.log('7-9文字: 概念的すぎて理解しにくい');
    
    console.log('\n【修正の優先順位】');
    console.log('1. 1-3文字の卦名 → 適切な説明に置き換え');
    console.log('2. 4-6文字のタイプ名 → 具体的な特徴を追加');
    console.log('3. 7-9文字の抽象的な説明 → より詳細な説明に拡張');
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

listShortDescriptions();