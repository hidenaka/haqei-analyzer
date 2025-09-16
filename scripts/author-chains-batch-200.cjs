'use strict';

const fs = require('fs');
const path = require('path');

function loadJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function saveJSON(p, obj) { fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf8'); }

const labels = {
  'JJJ': '一貫深化 （テーマ継続）',
  'JJH': '二段深化→視点切替 （構造転換）',
  'JHJ': '深化→視点切替→再深化 （構造転換）',
  'JHH': '初動深化→連続切替 （再整流）',
  'HJJ': '視点切替→二段深化 （構造転換）',
  'HJH': '視点切替→深化→再切替 （構造転換）',
  'HHJ': '連続切替→深化 （再設計）',
  'HHH': '三段転換 （完全再設計）'
};

function generateNarrative(hexName, lineName, linePos, pattern) {
  const themes = {
    '地山謙': { base: '謙虚と徳', action: '控えめに振る舞う', quality: '謙遜して' },
    '雷地豫': { base: '喜びと楽観', action: '楽しみを分かち合う', quality: '明るく' },
    '沢雷随': { base: '従順と適応', action: '流れに従う', quality: '柔軟に' },
    '山風蠱': { base: '腐敗の改革', action: '問題を解決する', quality: '勇気を持って' },
    '地沢臨': { base: '臨機応変', action: '機会を掴む', quality: '積極的に' },
    '風地観': { base: '観察と洞察', action: '全体を見渡す', quality: '冷静に' },
    '火雷噬嗑': { base: '障害の除去', action: '問題を噛み砕く', quality: '断固として' },
    '山火賁': { base: '装飾と美', action: 'バランスを整える', quality: '美しく' },
    '山地剥': { base: '衰退と崩壊', action: '守りを固める', quality: '慎重に' },
    '地雷復': { base: '復活と再生', action: '新たに始める', quality: '希望を持って' },
    '天雷無妄': { base: '無心と自然', action: '素直に従う', quality: '純粋に' },
    '山天大畜': { base: '大いなる蓄積', action: '力を蓄える', quality: '着実に' },
    '山雷頤': { base: '養育と栄養', action: '育て養う', quality: '丁寧に' },
    '沢風大過': { base: '過度と極限', action: 'バランスを取り戻す', quality: '適度に' },
    '坎為水': { base: '危険と困難', action: '危機を乗り越える', quality: '勇敢に' },
    '離為火': { base: '光明と知性', action: '周囲を照らす', quality: '明るく輝いて' }
  };

  const theme = themes[hexName] || { base: '変化の局面', action: '適応する', quality: '賢明に' };
  
  const narratives = {
    'JJJ': `まず、${theme.base}の中で、${theme.quality}歩み始めます。一歩一歩を大切にし、着実に進んでいきます。続いて、その歩みが確かなものになります。リズムが生まれ、自信がつき、道筋が見えてきます。最後に、積み重ねた努力が形となります。目標に近づき、成果が現れ、次への準備が整います。突破口は、継続的な努力にあります。まずは日々の積み重ねを大切にし、着実に前進しましょう。`,
    
    'JJH': `まず、${theme.base}に向き合います。現実を受け止め、${theme.quality}対処法を考えます。続いて、理解が深まります。本質が見え、対策が明確になり、自信が生まれます。最後に、新しい視点を得ます。これまでの経験を活かし、より高い次元での理解に到達します。突破口は、深い理解の後の転換にあります。まずは本質を掴み、そこから新しい道を見出しましょう。`,
    
    'JHJ': `まず、${theme.action}準備をします。必要なものを揃え、計画を立て、心の準備を整えます。次に、方法を変えます。直接的なアプローチから、間接的な戦略へと転換します。最後に、新しい方法を極めます。試行錯誤を重ね、最適な形を見つけ、確実な成果を上げます。突破口は、戦略の柔軟な転換にあります。まずは複数の選択肢を持ち、状況に応じて使い分けましょう。`,
    
    'JHH': `まず、${theme.quality}第一歩を踏み出します。様子を見ながら、慎重に進めていきます。続いて、進路を調整します。障害を避け、より良い道を探し、効率的に進みます。最後に、さらなる調整を加えます。細かな修正を重ね、完璧な軌道を描き、目標に到達します。突破口は、継続的な微調整にあります。まずは大まかな方向を定め、進みながら修正しましょう。`,
    
    'HJJ': `まず、従来の見方を変えます。${theme.base}を新しい角度から捉え、別の可能性を探ります。続いて、新しい理解を深めます。実践を通じて検証し、理論を確立し、確信を得ます。最後に、さらに洗練させます。細部を磨き上げ、完成度を高め、理想的な形を実現します。突破口は、視点の転換にあります。まずは固定観念を捨て、新しい可能性に目を向けましょう。`,
    
    'HJH': `まず、別の角度から${theme.base}を見ます。新しい理解が生まれ、違った対処法が見えてきます。次に、その理解を実践します。理論を現実に適用し、効果を確認し、調整を加えます。最後に、また視点を変えます。経験から学び、さらなる改善を図り、完璧を目指します。突破口は、理論と実践の往復にあります。まずは新しい視点を試し、実践で磨いていきましょう。`,
    
    'HHJ': `まず、考え方を変えます。次に、さらに変えます。二度の転換で、全く新しい発想が生まれます。最後に、その発想で${theme.action}ことに集中します。革新的な方法が、予想を超える成果をもたらします。突破口は、思考の自由にあります。まずは制約を外し、自由に発想してみましょう。`,
    
    'HHH': `まず、根本から変えます。続いて、さらに深く変えます。最後に、次元そのものを変えます。三度の変革で、${theme.base}は完全に新しいものとなります。これまでの限界を超え、無限の可能性が開かれます。突破口は、完全な再創造にあります。まずはゼロから考え直し、理想を実現しましょう。`
  };

  return {
    chain_long: narratives[pattern],
    tone: 'story',
    suitability: `${theme.base}を理解し、${theme.action}必要がある場面`,
    caution: `${theme.quality}進めながらも、バランスを保つこと`,
    label: labels[pattern],
    start: { hex: hexName, pos: linePos },
    final: { hex: hexName, pos: (linePos + 2) % 6 + 1 },
    updated_at: new Date().toISOString()
  };
}

function main() {
  const file = path.resolve(__dirname, '..', 'public', 'data', 'narratives_chain.v1.json');
  const db = loadJSON(file);
  
  // 次の100エントリー以上の卦
  const hexagrams = [
    { name: '地山謙', lines: ['初六', '六二', '九三', '六四', '六五', '上六'] },
    { name: '雷地豫', lines: ['初六', '六二', '六三', '九四', '六五', '上六'] },
    { name: '沢雷随', lines: ['初九', '六二', '六三', '九四', '九五', '上六'] },
    { name: '山風蠱', lines: ['初六', '九二', '九三', '六四', '六五', '上九'] },
    { name: '地沢臨', lines: ['初九', '九二', '六三', '六四', '六五', '上六'] },
    { name: '風地観', lines: ['初六', '六二', '六三', '六四', '九五', '上九'] },
    { name: '火雷噬嗑', lines: ['初九', '六二', '六三', '九四', '六五', '上九'] },
    { name: '山火賁', lines: ['初九', '六二', '九三', '六四', '六五', '上九'] },
    { name: '山地剥', lines: ['初六', '六二', '六三', '六四', '六五', '上九'] },
    { name: '地雷復', lines: ['初九', '六二', '六三', '六四', '六五', '上六'] },
    { name: '天雷無妄', lines: ['初九', '六二', '六三', '九四', '九五', '上九'] },
    { name: '山天大畜', lines: ['初九', '九二', '九三', '六四', '六五', '上九'] },
    { name: '山雷頤', lines: ['初九', '六二', '六三', '六四', '六五', '上九'] },
    { name: '沢風大過', lines: ['初六', '九二', '九三', '九四', '九五', '上六'] },
    { name: '坎為水', lines: ['初六', '九二', '六三', '六四', '九五', '上六'] },
    { name: '離為火', lines: ['初九', '六二', '九三', '九四', '六五', '上九'] }
  ];

  const patterns = ['JJJ', 'JJH', 'JHJ', 'JHH', 'HJJ', 'HJH', 'HHJ', 'HHH'];
  let updateCount = 0;

  hexagrams.forEach(hex => {
    hex.lines.forEach((line, idx) => {
      patterns.forEach(pattern => {
        const key = `${hex.name} ${line} | ${pattern}`;
        
        if (db[key] && db[key].chain_long && db[key].chain_long !== '') {
          console.log(`Skipping existing: ${key}`);
        } else {
          const narrative = generateNarrative(hex.name, line, idx + 1, pattern);
          db[key] = narrative;
          updateCount++;
        }
        
        if (updateCount > 0 && updateCount % 10 === 0) {
          console.log(`Updated ${updateCount} entries...`);
        }
      });
    });
  });

  saveJSON(file, db);
  console.log(`Successfully updated ${updateCount} entries`);
}

main();