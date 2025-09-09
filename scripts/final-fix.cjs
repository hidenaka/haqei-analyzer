const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../public/data/narratives_chain.v1.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('最終修正処理を開始...\n');

let fixedCount = 0;
const improvedData = {};

Object.entries(data).forEach(([key, value]) => {
  let narrative = value.chain_long;
  let wasFixed = false;
  
  // 短すぎるナラティブ（100文字未満）を検出して拡充
  if (narrative.length < 100) {
    const parts = key.split(' | ');
    const hexAndLine = parts[0].split(' ');
    const hexName = hexAndLine[0];
    const lineName = hexAndLine[1];
    const pattern = parts[1];
    
    // ナラティブが極端に短い場合、完全に書き直し
    if (narrative.length < 80) {
      // パターンに応じた展開を生成
      const patternNarratives = {
        'JJJ': `まず、${hexName}の${lineName}において、論理的かつ体系的なアプローチで課題に取り組む。続いて、計画通りに実行し、予測可能な成果を着実に積み上げていく。最後に、確実な成功を収め、次の段階への明確な道筋を確立する。突破口：徹底した計画性と一貫した実行力が最大の成果をもたらす。`,
        'JJH': `まず、${hexName}の${lineName}で、計画的に開始しながらも状況に応じた柔軟性を保つ。続いて、バランスの取れた方法で進展させ、必要に応じて調整を加える。最後に、理想と現実を統合した実践的な成果を得る。突破口：計画性と柔軟性の絶妙なバランスが成功の鍵となる。`,
        'JHJ': `まず、${hexName}の${lineName}から、積極的に行動を開始し、動的な展開を作り出す。続いて、状況の変化に応じて戦略を調整し、新たな可能性を探求する。最後に、予想を超えた成果を達成し、革新的な突破を実現する。突破口：変化への適応力と創造的な発想が新たな道を開く。`,
        'JHH': `まず、${hexName}の${lineName}において、慎重に計画を立てて着手する。続いて、実践の中で得た経験を活かし、徐々に柔軟な対応へと移行する。最後に、理論と実践を融合させた成熟した成果を得る。突破口：段階的な成長と経験の蓄積が深い理解をもたらす。`,
        'HJJ': `まず、${hexName}の${lineName}で、直感的な洞察から行動を開始する。続いて、その直感を論理的に検証し、体系的なアプローチへと発展させる。最後に、直感と論理を統合した確実な成功を収める。突破口：直感の鋭さと論理的思考の融合が独自の強みとなる。`,
        'HJH': `まず、${hexName}の${lineName}から、流動的で自然な形で物事を進める。続いて、状況の流れに身を任せながら、必要な調整を柔軟に行う。最後に、有機的で調和の取れた成果を実現する。突破口：自然な流れとの調和が最適な結果を生み出す。`,
        'HHJ': `まず、${hexName}の${lineName}において、内省的に状況を観察し、深い理解を得る。続いて、その洞察を基に慎重に行動を起こし、着実に前進する。最後に、内的な成長と外的な成果を同時に達成する。突破口：深い内省と慎重な実践が真の成功をもたらす。`,
        'HHH': `まず、${hexName}の${lineName}で、完全に直感と自然の流れに従って進む。続いて、無為自然の中で物事が有機的に展開し、調和が生まれる。最後に、努力を超えた自然な成功と深い充足感を得る。突破口：無為の中にある最大の力を体現することで奇跡的な成果を得る。`
      };
      
      narrative = patternNarratives[pattern] || patternNarratives['JJJ'];
      wasFixed = true;
      fixedCount++;
    } else {
      // 80-100文字の場合は、内容を補強
      if (!narrative.includes('において')) {
        narrative = narrative.replace('まず、', `まず、${hexName}の${lineName}において、`);
      }
      
      // 突破口を充実させる
      if (narrative.includes('突破口：') && narrative.endsWith('。')) {
        const breakIdx = narrative.indexOf('突破口：');
        const currentBreakthrough = narrative.substring(breakIdx);
        if (currentBreakthrough.length < 30) {
          narrative = narrative.substring(0, breakIdx) + 
            `突破口：この局面での重要な学びと実践が、次なる発展への確実な基盤となる。`;
        }
      }
      wasFixed = true;
      fixedCount++;
    }
  }
  
  // 3フェーズ構造が不完全な場合の修正
  const hasFirst = narrative.includes('まず、');
  const hasSecond = narrative.includes('続いて、');
  const hasThird = narrative.includes('最後に、');
  
  if (!hasFirst || !hasSecond || !hasThird) {
    const parts = key.split(' | ');
    const hexAndLine = parts[0];
    
    if (!hasFirst) {
      narrative = `まず、${hexAndLine}の状況を正確に把握し、適切な対応を開始する。` + narrative;
    }
    
    if (!hasSecond) {
      const firstEnd = narrative.indexOf('。');
      if (firstEnd > 0) {
        narrative = narrative.substring(0, firstEnd + 1) + 
          `続いて、段階的な発展を遂げ、新たな局面へと移行する。` + 
          narrative.substring(firstEnd + 1);
      }
    }
    
    if (!hasThird) {
      const secondPeriod = narrative.indexOf('。', narrative.indexOf('続いて、'));
      if (secondPeriod > 0) {
        narrative = narrative.substring(0, secondPeriod + 1) + 
          `最後に、全体的な成果を確認し、次の段階への準備を整える。` + 
          narrative.substring(secondPeriod + 1);
      }
    }
    
    wasFixed = true;
    fixedCount++;
  }
  
  // データを保存
  improvedData[key] = {
    ...value,
    chain_long: narrative,
    updated_at: wasFixed ? new Date().toISOString() : value.updated_at
  };
});

// ファイルに保存
fs.writeFileSync(dataPath, JSON.stringify(improvedData, null, 2), 'utf8');

console.log('='.repeat(60));
console.log('最終修正結果');
console.log('='.repeat(60));
console.log(`修正されたエントリー: ${fixedCount}件`);
console.log('\n最終修正が完了しました！');