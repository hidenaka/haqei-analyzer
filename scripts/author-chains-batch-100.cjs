'use strict';

const fs = require('fs');
const path = require('path');

function loadJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function saveJSON(p, obj) { fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf8'); }

// パターンラベルの定義
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
  // 各卦と爻に応じた物語を生成する関数
  const themes = {
    '水雷屯': { base: '困難な立ち上げ', action: '基盤を築く', quality: '忍耐強く' },
    '山水蒙': { base: '無知からの学び', action: '知識を吸収する', quality: '謙虚に' },
    '水天需': { base: '待機と準備', action: '機を待つ', quality: '焦らず' },
    '天水訟': { base: '争いと対立', action: '和解を探る', quality: '冷静に' },
    '地水師': { base: '組織の統率', action: '規律を保つ', quality: '公正に' },
    '水地比': { base: '協力と親和', action: '信頼を築く', quality: '誠実に' },
    '風天小畜': { base: '小さな蓄積', action: '力を蓄える', quality: 'コツコツと' },
    '天沢履': { base: '危険な前進', action: '慎重に進む', quality: '礼儀正しく' },
    '地天泰': { base: '調和と繁栄', action: 'バランスを保つ', quality: '寛大に' },
    '天地否': { base: '閉塞と停滞', action: '内面を充実させる', quality: '耐え忍んで' },
    '天火同人': { base: '仲間との協力', action: '志を共にする', quality: '開かれた心で' },
    '火天大有': { base: '大いなる所有', action: '成果を分かち合う', quality: '謙虚に' }
  };

  const theme = themes[hexName] || { base: '変化の時', action: '前進する', quality: '着実に' };
  
  // パターンに応じた物語構造
  const narratives = {
    'JJJ': `まず、${theme.base}の中で、${theme.quality}${theme.action}努力を始めます。小さな一歩から始め、確実に積み重ねていきます。続いて、その努力がさらに深まります。経験が蓄積され、コツを掴み、効率が上がっていきます。最後に、努力が実を結び始めます。目に見える成果が現れ、次の段階への準備が整います。突破口は、${theme.quality}継続することにあります。まずは小さな成功を積み重ね、着実に前進しましょう。`,
    
    'JJH': `まず、${theme.base}において、基礎を固めます。土台作りに時間をかけ、急がず着実に進めます。続いて、基礎がさらに強固になります。繰り返しの中で、揺るぎない土台が完成していきます。最後に、視点を切り替えます。守りから攻めへ、準備から実行へと転換し、新たな展開を迎えます。突破口は、基礎固めの後の転換にあります。まずは土台を確実にし、タイミングを見て動きましょう。`,
    
    'JHJ': `まず、${theme.action}ための準備を整えます。必要な要素を確認し、計画を立てます。次に、アプローチを変えます。直接的な方法から、間接的な方法へと戦略を転換します。最後に、新しいアプローチで深めます。予想外の効果が現れ、より良い結果へとつながります。突破口は、柔軟な戦略転換にあります。まずは複数の選択肢を用意し、状況に応じて切り替えましょう。`,
    
    'JHH': `まず、${theme.quality}一歩を踏み出します。慎重に状況を見極めながら、着実に前進します。続いて、方向を調整します。環境の変化を読み取り、柔軟に対応していきます。最後に、さらに調整を加えます。微調整を重ねながら、最適な道筋を見つけます。突破口は、継続的な調整にあります。まずは大まかな方向を定め、細かく修正していきましょう。`,
    
    'HJJ': `まず、従来のやり方を見直します。${theme.base}の本質を理解し、新しいアプローチを模索します。続いて、新しい方法で深めます。試行錯誤しながら、より効果的な道を見つけます。最後に、さらに磨きをかけます。細部を調整し、完成度を高めていきます。突破口は、発想の転換にあります。まずは固定観念を捨て、新しい可能性を探りましょう。`,
    
    'HJH': `まず、視点を変えて${theme.base}を捉え直します。別の角度から見ることで、新しい理解が生まれます。次に、その理解を実践で試します。理論と実践を往復しながら、理解を深めます。最後に、再び視点を変えます。得られた経験を基に、さらに高い次元での理解を目指します。突破口は、理論と実践の統合にあります。まずは新しい視点を持ち、実践で検証しましょう。`,
    
    'HHJ': `まず、発想を転換します。次に、さらに転換します。二度の転換で、全く新しい地平が開けます。最後に、その新しい視野で${theme.action}ことに集中します。革新的なアプローチが、予想を超える成果を生みます。突破口は、常識からの解放にあります。まずは「できない」という思い込みを外し、自由に発想しましょう。`,
    
    'HHH': `まず、形を変えます。続いて、質を変えます。最後に、次元を変えます。三度の変革で、${theme.base}は全く別のものへと昇華されます。制約から自由になり、新しい可能性が無限に広がります。突破口は、根本的な再定義にあります。まずは問題そのものを問い直し、全く新しい解決策を創造しましょう。`
  };

  return {
    chain_long: narratives[pattern],
    tone: 'story',
    suitability: `${theme.base}に対処し、${theme.action}必要がある場面`,
    caution: `${theme.quality}進めることを忘れず、焦りは禁物`,
    label: labels[pattern],
    start: { hex: hexName, pos: linePos },
    final: { hex: hexName, pos: (linePos + 2) % 6 + 1 }, // 簡略化した計算
    updated_at: new Date().toISOString()
  };
}

function main() {
  const file = path.resolve(__dirname, '..', 'public', 'data', 'narratives_chain.v1.json');
  const db = loadJSON(file);
  
  // 処理する卦のリスト（約100エントリー分）
  const hexagrams = [
    { name: '水雷屯', lines: ['初九', '六二', '六三', '六四', '九五', '上六'] },
    { name: '山水蒙', lines: ['初六', '九二', '六三', '六四', '六五', '上九'] },
    { name: '水天需', lines: ['初九', '九二', '九三', '六四', '九五', '上六'] },
    { name: '天水訟', lines: ['初六', '九二', '六三', '九四', '九五', '上九'] },
    { name: '地水師', lines: ['初六', '九二', '六三', '六四', '六五', '上六'] },
    { name: '水地比', lines: ['初六', '六二', '六三', '六四', '九五', '上六'] },
    { name: '風天小畜', lines: ['初九', '九二', '九三', '六四', '九五', '上九'] },
    { name: '天沢履', lines: ['初九', '九二', '六三', '九四', '九五', '上九'] },
    { name: '地天泰', lines: ['初九', '九二', '九三', '六四', '六五', '上六'] },
    { name: '天地否', lines: ['初六', '六二', '六三', '九四', '九五', '上九'] },
    { name: '天火同人', lines: ['初九', '六二', '九三', '九四', '九五', '上九'] },
    { name: '火天大有', lines: ['初九', '九二', '九三', '九四', '六五', '上九'] }
  ];

  const patterns = ['JJJ', 'JJH', 'JHJ', 'JHH', 'HJJ', 'HJH', 'HHJ', 'HHH'];
  let updateCount = 0;

  hexagrams.forEach(hex => {
    hex.lines.forEach((line, idx) => {
      patterns.forEach(pattern => {
        const key = `${hex.name} ${line} | ${pattern}`;
        
        // すでに存在して内容がある場合はスキップ
        if (db[key] && db[key].chain_long && db[key].chain_long !== '') {
          console.log(`Skipping existing entry: ${key}`);
        } else {
          // 新規作成または空のエントリーを更新
          const narrative = generateNarrative(hex.name, line, idx + 1, pattern);
          db[key] = narrative;
          updateCount++;
        }
        
        if (updateCount % 10 === 0) {
          console.log(`Updated ${updateCount} entries...`);
        }
      });
    });
  });

  saveJSON(file, db);
  console.log(`Successfully updated ${updateCount} entries`);
}

main();