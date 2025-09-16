/*
  Generate personalized overrides for H384: produce a JSON
  mapping 通し番号 -> { '現代解釈の要約_plain': <personalized> }
*/

global.window = global;
global.document = { readyState: 'complete', addEventListener: ()=>{} };

const fs = require('fs');

require('../public/assets/H384H64database.js');

function toPersonalPerspective(text){
  try {
    let t = String(text||'');
    const rules = [
      [/組織|チーム|部門|部署|社内横断|部門横断/g, '関係資源'],
      [/周囲|関係者|メンバー|人々|大衆|皆/g, '必要な相手'],
      [/仲間と共に|皆で|協働|共創/g, '自分のペースで周囲を活用し'],
      [/協力を得て/g, '必要な支援や資源を整えて'],
      [/合意形成/g, '自分の中の納得と優先順位付け'],
      [/リーダーシップ/g, '自己決定と自己管理'],
      [/信頼を得て/g, '一貫性を積み重ねて'],
      [/求心力/g, '軸の明確さ'],
      [/評価|称賛|支持/g, '手応え'],
      [/関係を丁寧に整え/g, '自分の作業環境を整え'],
      [/協力関係/g, '関係資源の使い方'],
      [/周囲の信頼/g, '自分への信頼と一貫性'],
      [/目標を共有/g, '目的を自分の言葉で明確にし'],
      [/メンバー/g, '関係資源']
    ];
    rules.forEach(([a,b])=>{ t = t.replace(a,b); });
    return t;
  } catch { return String(text||''); }
}

function main(){
  const data = window.H384_DATA || [];
  const overrides = {};
  const changed = [];
  for (const e of data){
    const base = String(e['現代解釈の要約']||'');
    if (!base) continue;
    const p = toPersonalPerspective(base);
    if (p && p !== base) {
      overrides[e['通し番号']] = { '現代解釈の要約_plain': p };
      changed.push({ id: e['通し番号'], from: base.slice(0,80), to: p.slice(0,80) });
    }
  }
  fs.writeFileSync('public/assets/H384H64database.personal.json', JSON.stringify(overrides, null, 2));
  console.log('✅ personalized overrides generated:', Object.keys(overrides).length);
  console.log('sample:', changed.slice(0,5));
}

main();

