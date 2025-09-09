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
    '沢山咸': { base: '感応と交流', action: '心を通わせる', quality: '素直に' },
    '雷風恒': { base: '恒常と持続', action: '継続する', quality: '着実に' },
    '天山遯': { base: '退避と撤退', action: '身を引く', quality: '賢明に' },
    '雷天大壮': { base: '強大な力', action: '力を発揮する', quality: '力強く' },
    '火地晋': { base: '前進と昇進', action: '上昇する', quality: '積極的に' },
    '地火明夷': { base: '明を傷つく', action: '困難を耐える', quality: '忍耐強く' },
    '風火家人': { base: '家族と調和', action: '家を治める', quality: '愛情深く' },
    '火沢睽': { base: '対立と相違', action: '違いを認める', quality: '寛容に' },
    '水山蹇': { base: '困難な道', action: '障害を越える', quality: '慎重に' },
    '雷水解': { base: '解放と解決', action: '問題を解く', quality: '爽快に' },
    '山沢損': { base: '損失と犠牲', action: '与える', quality: '惜しみなく' },
    '風雷益': { base: '利益と増加', action: '豊かにする', quality: '寛大に' },
    '沢天夬': { base: '決断と決行', action: '断固として行う', quality: '決然と' },
    '天風姤': { base: '遭遇と出会い', action: '機会を活かす', quality: '機敏に' },
    '沢地萃': { base: '集合と結集', action: '人を集める', quality: '魅力的に' },
    '地風升': { base: '上昇と成長', action: '着実に登る', quality: '地道に' },
    '沢水困': { base: '困窮と制約', action: '耐え抜く', quality: '辛抱強く' },
    '水風井': { base: '井戸と源泉', action: '深く掘る', quality: '根気よく' },
    '沢火革': { base: '変革と革命', action: '変化を起こす', quality: '勇敢に' },
    '火風鼎': { base: '新秩序', action: '基盤を作る', quality: '堅実に' },
    '震為雷': { base: '震動と覚醒', action: '目覚める', quality: '素早く' },
    '艮為山': { base: '静止と安定', action: '動きを止める', quality: '静かに' },
    '風山漸': { base: '漸進と段階', action: '徐々に進む', quality: 'ゆっくりと' },
    '雷沢帰妹': { base: '不自然な関係', action: '調整する', quality: '慎重に' },
    '雷火豊': { base: '豊かさの極み', action: '繁栄を享受する', quality: '感謝して' },
    '火山旅': { base: '旅と流浪', action: '移動する', quality: '軽やかに' },
    '巽為風': { base: '浸透と影響', action: '染み込む', quality: '優しく' },
    '兌為沢': { base: '喜びと交流', action: '楽しむ', quality: '明るく' },
    '風水渙': { base: '分散と解消', action: '散らばる', quality: '自然に' },
    '水沢節': { base: '節度と制限', action: '節制する', quality: '適度に' },
    '風沢中孚': { base: '誠実と信頼', action: '信じる', quality: '真心で' },
    '雷山小過': { base: '小さな行き過ぎ', action: '調整する', quality: '細やかに' },
    '水火既済': { base: '完成と成就', action: '完成させる', quality: '完璧に' },
    '火水未済': { base: '未完成', action: '完成を目指す', quality: '根気強く' }
  };

  const theme = themes[hexName] || { base: '人生の局面', action: '対処する', quality: '知恵を持って' };
  
  // パターンごとに異なる物語展開を生成
  const storyTypes = {
    'JJJ': {
      phase1: '土台を築く段階です',
      phase2: '基礎が固まり、安定してきます',
      phase3: '成果が見え始め、次への準備が整います',
      breakthrough: '一貫した努力の継続'
    },
    'JJH': {
      phase1: '基本を身につける段階です',
      phase2: '理解が深まり、熟練度が上がります',
      phase3: '視野を広げ、新しい可能性を探ります',
      breakthrough: '基礎固めの後の視野拡大'
    },
    'JHJ': {
      phase1: '準備を整える段階です',
      phase2: 'アプローチを変え、別の道を試みます',
      phase3: '新しい方法で深く掘り下げます',
      breakthrough: '柔軟な戦略の切り替え'
    },
    'JHH': {
      phase1: '慎重に始める段階です',
      phase2: '方向を調整し、軌道修正します',
      phase3: 'さらに微調整を重ね、最適化します',
      breakthrough: '継続的な調整と改善'
    },
    'HJJ': {
      phase1: '発想を転換する段階です',
      phase2: '新しい視点で深めていきます',
      phase3: 'さらに磨きをかけ、完成度を高めます',
      breakthrough: '新しい視点からの深化'
    },
    'HJH': {
      phase1: '別の角度から見る段階です',
      phase2: 'その視点で実践し、検証します',
      phase3: '再び視点を変え、統合します',
      breakthrough: '多角的な視点の統合'
    },
    'HHJ': {
      phase1: '思考を解放する段階です',
      phase2: 'さらに自由に発想を広げます',
      phase3: '新しい発想で集中的に取り組みます',
      breakthrough: '制約からの解放'
    },
    'HHH': {
      phase1: '根本から見直す段階です',
      phase2: 'さらに深く変革を進めます',
      phase3: '次元そのものを超越します',
      breakthrough: '完全な再創造'
    }
  };
  
  const story = storyTypes[pattern];
  
  const narrative = `まず、${theme.base}において、${story.phase1}。${theme.quality}${theme.action}努力を始め、小さな変化を積み重ねていきます。続いて、${story.phase2}。経験が蓄積され、自信が生まれ、より大きな成果へとつながっていきます。最後に、${story.phase3}。これまでの努力が実を結び、新たな地平が開けます。突破口は、${story.breakthrough}にあります。まずは現状を正確に把握し、${theme.quality}一歩ずつ前進しましょう。`;

  return {
    chain_long: narrative,
    tone: 'story',
    suitability: `${theme.base}の状況で、${theme.action}必要がある場面`,
    caution: `${theme.quality}進めることの重要性を忘れず、焦らないこと`,
    label: labels[pattern],
    start: { hex: hexName, pos: linePos },
    final: { hex: hexName, pos: (linePos + 2) % 6 + 1 },
    updated_at: new Date().toISOString()
  };
}

function main() {
  const file = path.resolve(__dirname, '..', 'public', 'data', 'narratives_chain.v1.json');
  const db = loadJSON(file);
  
  // 残りの卦（約30卦）
  const hexagrams = [
    { name: '沢山咸', lines: ['初六', '六二', '九三', '九四', '九五', '上六'] },
    { name: '雷風恒', lines: ['初六', '九二', '九三', '九四', '六五', '上六'] },
    { name: '天山遯', lines: ['初六', '六二', '九三', '九四', '九五', '上九'] },
    { name: '雷天大壮', lines: ['初九', '九二', '九三', '九四', '六五', '上六'] },
    { name: '火地晋', lines: ['初六', '六二', '六三', '九四', '六五', '上九'] },
    { name: '地火明夷', lines: ['初九', '六二', '九三', '六四', '六五', '上六'] },
    { name: '風火家人', lines: ['初九', '六二', '九三', '六四', '九五', '上九'] },
    { name: '火沢睽', lines: ['初九', '九二', '六三', '九四', '六五', '上九'] },
    { name: '水山蹇', lines: ['初六', '六二', '九三', '六四', '九五', '上六'] },
    { name: '雷水解', lines: ['初六', '九二', '六三', '九四', '六五', '上六'] },
    { name: '山沢損', lines: ['初九', '九二', '六三', '六四', '六五', '上九'] },
    { name: '風雷益', lines: ['初九', '六二', '六三', '六四', '九五', '上九'] },
    { name: '沢天夬', lines: ['初九', '九二', '九三', '九四', '九五', '上六'] },
    { name: '天風姤', lines: ['初六', '九二', '九三', '九四', '九五', '上九'] },
    { name: '沢地萃', lines: ['初六', '六二', '六三', '九四', '九五', '上六'] },
    { name: '地風升', lines: ['初六', '九二', '九三', '六四', '六五', '上六'] },
    { name: '沢水困', lines: ['初六', '九二', '六三', '九四', '九五', '上六'] },
    { name: '水風井', lines: ['初六', '九二', '九三', '六四', '九五', '上六'] },
    { name: '沢火革', lines: ['初九', '六二', '九三', '九四', '九五', '上六'] },
    { name: '火風鼎', lines: ['初六', '九二', '九三', '九四', '六五', '上九'] },
    { name: '震為雷', lines: ['初九', '六二', '六三', '九四', '六五', '上六'] },
    { name: '艮為山', lines: ['初六', '六二', '九三', '六四', '六五', '上九'] },
    { name: '風山漸', lines: ['初六', '六二', '九三', '六四', '九五', '上九'] },
    { name: '雷沢帰妹', lines: ['初九', '九二', '六三', '九四', '六五', '上六'] },
    { name: '雷火豊', lines: ['初九', '六二', '九三', '九四', '六五', '上六'] },
    { name: '火山旅', lines: ['初六', '六二', '九三', '九四', '六五', '上九'] },
    { name: '巽為風', lines: ['初六', '九二', '九三', '六四', '九五', '上九'] },
    { name: '兌為沢', lines: ['初九', '九二', '六三', '九四', '九五', '上六'] },
    { name: '風水渙', lines: ['初六', '九二', '六三', '六四', '九五', '上九'] },
    { name: '水沢節', lines: ['初九', '九二', '六三', '六四', '九五', '上六'] },
    { name: '風沢中孚', lines: ['初九', '九二', '六三', '六四', '九五', '上九'] },
    { name: '雷山小過', lines: ['初六', '六二', '九三', '九四', '六五', '上六'] },
    { name: '水火既済', lines: ['初九', '九二', '六三', '九四', '六五', '上六'] },
    { name: '火水未済', lines: ['初六', '九二', '九三', '六四', '九五', '上六'] }
  ];

  const patterns = ['JJJ', 'JJH', 'JHJ', 'JHH', 'HJJ', 'HJH', 'HHJ', 'HHH'];
  let updateCount = 0;
  let skipCount = 0;

  hexagrams.forEach(hex => {
    hex.lines.forEach((line, idx) => {
      patterns.forEach(pattern => {
        const key = `${hex.name} ${line} | ${pattern}`;
        
        if (db[key] && db[key].chain_long && db[key].chain_long !== '') {
          skipCount++;
        } else {
          const narrative = generateNarrative(hex.name, line, idx + 1, pattern);
          db[key] = narrative;
          updateCount++;
        }
        
        if (updateCount > 0 && updateCount % 50 === 0) {
          console.log(`Updated ${updateCount} entries...`);
        }
      });
    });
  });

  saveJSON(file, db);
  console.log(`Successfully updated ${updateCount} entries (skipped ${skipCount} existing)`);
}

main();