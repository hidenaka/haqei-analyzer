import { readFile } from 'fs/promises';

async function analyzeCharacterDistribution() {
  try {
    console.log('=== V3データベース 文字数分布分析 ===\n');
    
    // データベース読み込み
    const content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // 日本語の説明文を抽出（プロパティ名や英語を除外）
    const pattern = /"([^"]*[ぁ-んァ-ヶー一-龯][^"]*)"/g;
    const matches = content.match(pattern) || [];
    
    const distribution = new Map();
    const descriptions = [];
    
    matches.forEach(match => {
      const text = match.slice(1, -1); // ダブルクォートを除去
      
      // 英語のプロパティ名を除外
      if (text.match(/^[a-zA-Z_]+$/) || text.match(/^(name|profile|description|metaphor|example)$/)) {
        return;
      }
      
      const length = text.length;
      descriptions.push({ text, length });
      
      if (!distribution.has(length)) {
        distribution.set(length, { count: 0, samples: [] });
      }
      
      const data = distribution.get(length);
      data.count++;
      
      // サンプルを最大10個まで保存
      if (data.samples.length < 10) {
        data.samples.push(text);
      }
    });
    
    // 文字数でソート
    const sortedDistribution = Array.from(distribution.entries()).sort((a, b) => a[0] - b[0]);
    
    // 統計情報
    const totalDescriptions = descriptions.length;
    let under10 = 0;
    let under15 = 0;
    let under20 = 0;
    let over30 = 0;
    
    sortedDistribution.forEach(([length, data]) => {
      if (length < 10) under10 += data.count;
      if (length < 15) under15 += data.count;
      if (length < 20) under20 += data.count;
      if (length > 30) over30 += data.count;
    });
    
    console.log('【統計サマリー】');
    console.log(`総説明数: ${totalDescriptions}件`);
    console.log(`10文字未満: ${under10}件 (${(under10/totalDescriptions*100).toFixed(1)}%)`);
    console.log(`15文字未満: ${under15}件 (${(under15/totalDescriptions*100).toFixed(1)}%)`);
    console.log(`20文字未満: ${under20}件 (${(under20/totalDescriptions*100).toFixed(1)}%)`);
    console.log(`30文字超: ${over30}件 (${(over30/totalDescriptions*100).toFixed(1)}%)\n`);
    
    console.log('【文字数分布詳細】');
    console.log('文字数 | 件数 | グラフ');
    console.log('-------|------|' + '-'.repeat(50));
    
    // 分布をグラフ表示
    const maxCount = Math.max(...Array.from(distribution.values()).map(d => d.count));
    sortedDistribution.forEach(([length, data]) => {
      const barLength = Math.round(data.count / maxCount * 40);
      const bar = '█'.repeat(barLength);
      console.log(`${String(length).padStart(6)} | ${String(data.count).padStart(4)} | ${bar}`);
    });
    
    console.log('\n【短い説明（10文字以下）のサンプル】');
    sortedDistribution.forEach(([length, data]) => {
      if (length <= 10) {
        console.log(`\n● ${length}文字 (${data.count}件):`);
        data.samples.slice(0, 5).forEach(sample => {
          console.log(`  "${sample}"`);
        });
        if (data.count > 5) {
          console.log(`  ... 他 ${data.count - 5}件`);
        }
      }
    });
    
    console.log('\n【11-12文字の説明サンプル（情報不足の可能性）】');
    sortedDistribution.forEach(([length, data]) => {
      if (length === 11 || length === 12) {
        console.log(`\n● ${length}文字 (${data.count}件):`);
        
        // 情報不足の可能性があるパターンを検出
        const insufficientSamples = data.samples.filter(text => {
          return text.endsWith('する') || 
                 text.endsWith('いく') || 
                 text.endsWith('ある') ||
                 text.includes('、') ||
                 !text.includes('を') && !text.includes('に') && !text.includes('で') && !text.includes('て');
        });
        
        if (insufficientSamples.length > 0) {
          console.log('  【要確認】');
          insufficientSamples.slice(0, 5).forEach(sample => {
            console.log(`  ❓ "${sample}"`);
          });
        }
        
        console.log('  【その他】');
        data.samples.filter(text => !insufficientSamples.includes(text)).slice(0, 3).forEach(sample => {
          console.log(`  ✓ "${sample}"`);
        });
      }
    });
    
    console.log('\n【推奨事項】');
    if (under10 > 0) {
      console.log(`⚠️ まだ${under10}件の10文字未満の説明があります。修正が必要です。`);
    }
    
    const count11_12 = (distribution.get(11)?.count || 0) + (distribution.get(12)?.count || 0);
    if (count11_12 > 100) {
      console.log(`⚠️ 11-12文字の説明が${count11_12}件あります。内容を確認して情報不足のものは修正を検討してください。`);
    }
    
    if (under15 > totalDescriptions * 0.3) {
      console.log(`📊 15文字未満の説明が${(under15/totalDescriptions*100).toFixed(1)}%を占めています。`);
      console.log('   より詳細な説明への改善を検討することをお勧めします。');
    }
    
    // 理想的な分布の提案
    console.log('\n【理想的な文字数分布】');
    console.log('10-14文字: 簡潔だが最小限の情報を含む');
    console.log('15-20文字: 適度に詳細で理解しやすい（推奨）');
    console.log('21-30文字: 詳細な説明で具体的');
    console.log('30文字超: 非常に詳細（必要に応じて）');
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

analyzeCharacterDistribution();