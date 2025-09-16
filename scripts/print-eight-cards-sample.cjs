#!/usr/bin/env node
/**
 * Print 8 Future Simulator sample cards (text-only)
 * - Loads H384_DATA from public/assets/H384H64database.js
 * - Picks a sample line (or by query)
 * - Generates 8 scenarios using the same combo patterns as the UI engine
 * - Outputs concise text for each card
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const HFILE = path.join(ROOT, 'public/assets/H384H64database.js');

function loadH384() {
  const code = fs.readFileSync(HFILE, 'utf8');
  // Mute logs from the data file to keep output clean
  const silentConsole = {
    log: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
  };
  const sandbox = {
    window: {},
    console: silentConsole,
    document: { readyState: 'complete', addEventListener: () => {} },
    setTimeout, clearTimeout,
  };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: 'H384H64database.js' });
  const H384 = sandbox.window.H384_DATA;
  if (!Array.isArray(H384) || H384.length === 0) throw new Error('H384_DATA not available');
  return H384;
}

// Choice combinations (3 stages → 8 scenarios)
const COMBOS = [
  ['conservative', 'collaborative', 'cautious'],
  ['conservative', 'collaborative', 'decisive'],
  ['conservative', 'independent', 'cautious'],
  ['conservative', 'independent', 'decisive'],
  ['progressive', 'collaborative', 'cautious'],
  ['progressive', 'collaborative', 'decisive'],
  ['progressive', 'independent', 'cautious'],
  ['progressive', 'independent', 'decisive'],
];

const TITLES = {
  'conservative,collaborative,cautious': '堅実な協調路線',
  'conservative,collaborative,decisive': '協調的現状改革',
  'conservative,independent,cautious': '独立的現状維持',
  'conservative,independent,decisive': '独自の保守革新',
  'progressive,collaborative,cautious': '慎重な共同革新',
  'progressive,collaborative,decisive': '迅速な協調変革',
  'progressive,independent,cautious': '計画的独立革新',
  'progressive,independent,decisive': '独創的即断革新',
};

const TEACHINGS = {
  'conservative,collaborative,cautious': '地山謙 - 謙虚に協力する',
  'conservative,collaborative,decisive': '地天泰 - 安定の中の決断',
  'conservative,independent,cautious': '山天大畜 - 内に力を蓄える',
  'conservative,independent,decisive': '天山遯 - 退いて機を待つ',
  'progressive,collaborative,cautious': '風天小畜 - 小さく蓄えて進む',
  'progressive,collaborative,decisive': '天火同人 - 志を同じくする',
  'progressive,independent,cautious': '火天大有 - 大いに保つ',
  'progressive,independent,decisive': '乾為天 - 天の道を行く',
};

function calcChoiceCompatibility(entry, choiceId) {
  // Mirror js/core/IChingGuidanceEngine.js logic
  const stance = entry['S5_主体性推奨スタンス'];
  const stability = Number(entry['S3_安定性スコア']) || 0;
  const potential = Number(entry['S2_ポテンシャル']) || 0;
  const variability = Number(entry['S6_変動性スコア']) || 0;
  const risk = Math.abs(Number(entry['S4_リスク']) || 0);
  const keywords = Array.isArray(entry['キーワード']) ? entry['キーワード'] : [];

  let compatibility = 50; // 基準値
  switch (choiceId) {
    case 'conservative':
      if (stance === '受動') compatibility += 30;
      if (stability > 60) compatibility += 20;
      break;
    case 'progressive':
      if (stance === '能動') compatibility += 30;
      if (potential > 60) compatibility += 20;
      break;
    case 'collaborative':
      if (keywords.includes('協力')) compatibility += 25;
      compatibility += stability * 0.3;
      break;
    case 'independent':
      if (keywords.includes('自立') || keywords.includes('独立')) compatibility += 25;
      compatibility += potential * 0.3;
      break;
    case 'cautious':
      if (risk > 50) compatibility += 30;
      break;
    case 'decisive':
      if (variability > 50) compatibility += 30;
      break;
  }
  return Math.min(100, Math.max(0, Math.round(compatibility)));
}

function predictOutcome(entry, choiceId) {
  const base = Number(entry['S7_総合評価スコア']) || 50;
  const comp = calcChoiceCompatibility(entry, choiceId);
  return Math.round((base * 0.5) + (comp * 0.5));
}

function scenarioProbability(entry, combo) {
  const probs = combo.map(choice => predictOutcome(entry, choice));
  return Math.round(probs.reduce((a, b) => a + b, 0) / probs.length);
}

function scenarioDescription(combo, entry) {
  let d = '';
  d += (combo[0] === 'conservative') ? '現状を基盤としながら、' : '新しい可能性を追求し、';
  d += (combo[1] === 'collaborative') ? '周囲との協力関係を重視して、' : '独自の道を切り開きながら、';
  d += (combo[2] === 'cautious') ? '慎重に計画を進める道。' : '機を見て素早く行動する道。';
  const keywords = Array.isArray(entry['キーワード']) ? entry['キーワード'] : [];
  if (keywords.length > 0) d += `特に「${keywords[0]}」の要素が重要となる。`;
  return d;
}

function pickSampleEntry(H384, query) {
  if (query) {
    // Try to find by 卦名 or 爻 text
    const q = query.trim();
    const found = H384.find(e => String(e['卦名']).includes(q) || String(e['爻']).includes(q));
    if (found) return found;
  }
  // Default: first entry (乾為天 初九)
  return H384[0];
}

function main() {
  const H384 = loadH384();
  const arg = process.argv.slice(2).join(' ');
  const entry = pickSampleEntry(H384, arg);

  const header = `${entry['卦名']} ${entry['爻']}（卦番号: ${entry['卦番号']} 通し番号: ${entry['通し番号']}）`;
  console.log('🔮 8つの未来シナリオ（サンプル出力）');
  console.log(`現在の状況: ${header}`);
  if (entry['現代解釈の要約']) {
    console.log(`要約: ${entry['現代解釈の要約']}`);
  }
  console.log('');

  const scenarios = COMBOS.map((combo, idx) => {
    const key = combo.join(',');
    const prob = scenarioProbability(entry, combo);
    const t = TITLES[key] || `シナリオ${idx + 1}`;
    const desc = scenarioDescription(combo, entry);
    const teaching = TEACHINGS[key] || entry['卦名'];
    const [hex, meaning] = teaching.split(' - ');
    return {
      id: idx + 1,
      title: t,
      probability: prob,
      description: desc,
      ichingHexagram: hex,
      ichingMeaning: meaning || (entry['現代解釈の要約'] || ''),
    };
  }).sort((a, b) => b.probability - a.probability);

  scenarios.forEach(s => {
    console.log(`【${s.id}】${s.title}（確率: ${s.probability}%）`);
    console.log(`  説明: ${s.description}`);
    console.log(`  易経: ${s.ichingHexagram}${s.ichingMeaning ? ' - ' + s.ichingMeaning : ''}`);
    console.log('');
  });
}

if (require.main === module) {
  try { main(); } catch (e) { console.error('❌', e.message); process.exit(1); }
}
