'use strict';

const fs = require('fs');
const path = require('path');

function loadJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function saveJSON(p, obj) { fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf8'); }

function main() {
  const file = path.resolve(__dirname, '..', 'public', 'data', 'narratives_chain.v1.json');
  const db = loadJSON(file);
  
  // 坤為地 六二
  const baseKey2 = '坤為地 六二 | ';
  const updates2 = {
    JJJ: {
      chain_long:
        'まず、正しく四角く大きな道を歩みます。無理をせず、自然体で、着実に前進を続けます。' +
        '続いて、その歩みがさらに安定します。リズムが生まれ、呼吸が整い、長距離を歩ける体力がつきます。' +
        '最後に、道が広がり、仲間が増えます。一人の歩みが、多くの人を導く道となっていきます。' +
        '突破口は、正道を外れないことにあります。まずは基本に忠実に、誠実な歩みを続けましょう。',
      suitability: '正統的な方法で着実に成果を上げたい場面',
      caution: '柔軟性を失って、硬直化しないよう注意'
    },
    JJH: {
      chain_long:
        'まず、まっすぐな道を進みます。迷いなく、疑いなく、信じた道を歩み続けます。' +
        '続いて、その確信を深めます。経験が積み重なり、自信となって、歩みはより力強くなります。' +
        '最後に、方向を少し調整します。状況の変化を読み取り、微調整しながら、最適な進路を保ちます。' +
        '突破口は、確信と柔軟性の両立にあります。まずは芯を持ちながら、状況に応じて調整しましょう。',
      suitability: '信念を持ちながら、適応力も発揮したい場面',
      caution: '頑固になりすぎて、必要な変更を拒まないよう注意'
    }
  };

  // 坤為地 六三
  const baseKey3 = '坤為地 六三 | ';
  const updates3 = {
    JJJ: {
      chain_long:
        'まず、才能を内に秘めて進みます。目立たず、騒がず、しかし確実に実力を蓄えていきます。' +
        '続いて、その蓄積がさらに深まります。表には出ない努力が、内側で大きな力となって育ちます。' +
        '最後に、時が来れば自然に認められます。無理に主張せずとも、実力が評価される時が必ず来ます。' +
        '突破口は、焦らない忍耐にあります。まずは実力を磨き、機が熟すのを待ちましょう。',
      suitability: '目立たずに実力を蓄積したい場面',
      caution: '消極的になりすぎて、チャンスを逃さないよう注意'
    }
  };

  // 坤為地 六四
  const baseKey4 = '坤為地 六四 | ';
  const updates4 = {
    JJJ: {
      chain_long:
        'まず、袋を閉じるように、慎重に守りを固めます。余計なものを入れず、大切なものを守ります。' +
        '続いて、その守りをさらに堅固にします。隙を作らず、しかし息苦しくならない程度に調整します。' +
        '最後に、守りの中で力を蓄えます。外に出る時を待ちながら、内側で確実に成長していきます。' +
        '突破口は、守りの中での成長にあります。まずは安全を確保し、その中で着実に力をつけましょう。',
      suitability: '守勢に徹しながら、力を蓄えたい場面',
      caution: '守りが硬すぎて、機会を逃さないよう注意'
    }
  };

  // 坤為地 六五
  const baseKey5 = '坤為地 六五 | ';
  const updates5 = {
    JJJ: {
      chain_long:
        'まず、黄色い裳のような中庸の美を体現します。派手すぎず、地味すぎず、品位ある存在感を示します。' +
        '続いて、その品位がさらに深まります。内面からの輝きが、自然な威厳となって現れます。' +
        '最後に、多くの人から尊敬を集めます。誇示せずとも、その徳が自然に人を引き寄せます。' +
        '突破口は、中庸の美徳にあります。まずは極端を避け、バランスの取れた生き方を実践しましょう。',
      suitability: '品位と威厳を保ちながら、影響力を発揮したい場面',
      caution: '謙虚すぎて、必要な主張ができなくならないよう注意'
    }
  };

  // 坤為地 上六
  const baseKey6 = '坤為地 上六 | ';
  const updates6 = {
    JJJ: {
      chain_long:
        'まず、陰陽が激突する戦場に立ちます。対立の極致で、どちらも譲らない緊張が続きます。' +
        '続いて、その対立がさらに深まります。傷つけ合い、消耗し合い、共に疲弊していきます。' +
        '最後に、戦いの無意味さに気づきます。勝者も敗者もなく、ただ疲れだけが残ることを理解します。' +
        '突破口は、戦わない勇気にあります。まずは争いから身を引き、別の解決策を探しましょう。',
      suitability: '不毛な対立から脱却したい場面',
      caution: '逃げと撤退を混同しないよう、戦略的に判断する'
    }
  };

  // 坤為地 用六
  const baseKey7 = '坤為地 用六 | ';
  const updates7 = {
    JJJ: {
      chain_long:
        'まず、永遠の貞節を保ちます。時代が変わっても、状況が変わっても、変わらない誠実さを貫きます。' +
        '続いて、その一貫性が信頼を生みます。ぶれない姿勢が、多くの人の拠り所となっていきます。' +
        '最後に、不変の中に真の変化を見出します。表面は変わらずとも、内側では常に成長し続けます。' +
        '突破口は、変わらない芯にあります。まずは自分の核となる価値観を確立し、それを守り続けましょう。',
      suitability: '長期的な信頼関係を築きたい場面',
      caution: '頑固と一貫性を混同しないよう、本質を見極める'
    }
  };

  // すべての更新を適用
  const allUpdates = [
    { baseKey: baseKey2, updates: updates2, pos: 2 },
    { baseKey: baseKey3, updates: updates3, pos: 3 },
    { baseKey: baseKey4, updates: updates4, pos: 4 },
    { baseKey: baseKey5, updates: updates5, pos: 5 },
    { baseKey: baseKey6, updates: updates6, pos: 6 },
    { baseKey: baseKey7, updates: updates7, pos: 7 }
  ];

  // 各パターンの基本設定
  const patterns = ['JJJ', 'JJH', 'JHJ', 'JHH', 'HJJ', 'HJH', 'HHJ', 'HHH'];
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

  allUpdates.forEach(({ baseKey, updates, pos }) => {
    patterns.forEach(pat => {
      const k = baseKey + pat;
      if (!db[k]) {
        db[k] = {
          tone: 'story',
          start: { hex: '坤為地', pos: pos },
          final: {},
          label: labels[pat]
        };
      }
      
      // デフォルトのテキストを設定（簡略版）
      if (!updates[pat]) {
        updates[pat] = {
          chain_long: '',
          suitability: '',
          caution: ''
        };
      }
      
      Object.assign(db[k], updates[pat], { updated_at: new Date().toISOString() });
    });
  });

  saveJSON(file, db);
  console.log('Updated 坤為地 remaining patterns');
}

main();