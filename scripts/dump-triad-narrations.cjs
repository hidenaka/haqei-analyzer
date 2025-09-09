#!/usr/bin/env node
// Dump all 64×6×8 triad narrations to JSON for human review
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = process.cwd();
const HDB_PATH = path.join(root, 'public/assets/H384H64database.js');
const overridesPath = path.join(root, 'public/data/h384-keyword-overrides.json');
const lineStatesPath = path.join(root, 'public/data/h384-line-states.json');
const explainPath = path.join(root, 'public/data/keyword-explanations.json');
const OUT_PATH = path.join(root, 'public/data/debug/triad-narrations-all.json');

function loadH384H64() {
  const code = fs.readFileSync(HDB_PATH, 'utf-8');
  const ctx = { window: {}, document: { createElement(){return{};}, body:{} }, console, globalThis:{} };
  vm.createContext(ctx);
  vm.runInContext(code, ctx, { filename: 'H384H64database.js' });
  return { H64: ctx.window.H64_DATA, H384: ctx.window.H384_DATA };
}

const PRIORITY = ['退避','直感','協力関係','協力','基盤','基礎','安定','調整','信頼','警告','油断','目印','車輪','つながり','対立','合意','現場','安全策','優先順位','効率'];
function normalizeToken(s){
  let t = String(s||'');
  const map = [
    [/孚交如|孚/g, '信頼'],[/攣如/g,'つながり'],[/鄰/g,'近しい人'],[/血去/g,'危険回避'],[/夬履/g,'決断'],[/賁如皤如|賁如濡如|賁如/g,'装い'],[/婦貞/g,'節度'],[/帝乙/g,'高い徳'],[/愬愬/g,'慎重さ'],[/白茅/g,'素直'],[/高陵/g,'遠望'],[/車止/g,'停止'],[/武人大君/g,'規律'],[/台所/g,'身近'],[/皮膚/g,'表面的'],[/足先/g,'初動'],[/蒙昧/g,'学び'],[/啓発/g,'学び'],[/刑罰/g,'規律'],[/坦坦/g,'安定'],[/幽人貞/g,'内省'],[/郊外/g,'外部'],[/祗悔/g,'反省'],[/玄黄/g,'混乱'],[/三駆/g,'段取り'],[/朋簪/g,'仲間'],[/侵伐/g,'断行'],[/黄色/g,'落ち着き'],[/労謙/g,'謙虚'],[/堅氷/g,'警戒'],[/明夷/g,'慎重さ'],[/何度/g,'反復'],[/師左/g,'撤退'],[/夫妻反目/g,'対立'],[/莧陸/g,'障害除去'],[/井戸/g,'基盤'],[/株木/g,'停滞'],[/高宗/g,'大義'],[/祖父/g,'伝統'],[/帝乙妹/g,'高い徳'],[/高い徳妹/g,'高い徳'],[/三人/g,'協力者'],[/城隍/g,'防御'],[/雄羊/g,'突破'],[/酒食/g,'余裕'],[/砂地/g,'足場'],[/頻繁/g,'反復'],[/素履/g,'基本姿勢'],[/堅固/g,'堅実'],[/他人/g,'他者'],[/甘美/g,'喜び'],[/三品/g,'多様な成果'],[/優柔不断/g,'判断明確'],[/公天子/g,'公的秩序'],[/大車以/g,'大きな責任'],[/威張/g,'謙虚'],[/戚嗟/g,'嘆き'],[/最終的/g,'結論'],[/多少/g,'程度'],[/次々/g,'連続'],[/人選/g,'適材配置'],[/小子/g,'小さな課題'],[/丈夫/g,'大局'],[/考咎/g,'先代の課題'],[/官渝/g,'方針転換'],[/无妄|無妄/g,'自然さ'],[/往来/g,'やりとり'],[/拘係/g,'忠誠'],[/貞正/g,'正しさ'],[/中正/g,'中庸'],[/案内/g,'指針'],[/突然/g,'変化に備え'],[/日暮/g,'変化に備え'],[/中程度/g,'適度'],[/樽酒/g,'簡素な供物'],[/瓦器/g,'素朴な道具'],[/簋/g,'器'],[/禴祭/g,'形式的儀礼'],[/衣袽/g,'継続警戒'],[/坎穴/g,'落とし穴'],[/鴻雁/g,'段階的対応'],[/小人/g,'正道'],[/旅先|旅人/g,'外部'],[/一本/g,'一貫性'],[/全身全霊/g,'集中'],[/退却/g,'退避'],[/指導(?!者)/g,'指針'],[/文様/g,'装い'],[/過度/g,'適度'],[/自分/g,'内省'],[/祖母/g,'伝統'],[/真昼/g,'明るさ'],[/左腹|背中/g,'弱点'],[/箕子/g,'正道'],[/故郷/g,'原点'],[/先祖/g,'伝統'],[/鼫鼠/g,'小さな課題'],[/疇祉/g,'成果'],[/大人吉/g,'正道'],[/警告を重く受け止め[るて]?/g,'警告'],[/艱貞/g,'堅実'],[/翩翩/g,'柔軟'],[/冥豫/g,'混乱'],[/最高/g,'最善'],[/国家/g,'公的立場'],[/三匹/g,'協力者'],[/背負/g,'責任感'],[/主人/g,'責任者'],[/非常/g,'緊急対応'],[/東隣/g,'近しい人'],[/問題/g,'課題'],[/徐徐|徐々/g,'段階的対応'],[/尻尾/g,'弱点'],[/病気/g,'体調'],[/太鼓/g,'合図'],[/衝動的行動/g,'衝動を抑え'],[/依存関係/g,'依存を見直し'],[/大事業/g,'大きな目標'],[/用事/g,'実務'],[/十朋/g,'資源'],[/憧憧/g,'不安'],[/自己犠牲/g,'献身'],[/大君/g,'指導者'],[/満月/g,'成熟'],[/極限状況/g,'厳しい状況'],[/枯楊稊/g,'再生の兆し'],[/霊亀/g,'直感'],[/模様/g,'傾向'],[/中行/g,'中庸'],[/良馬逐/g,'適材配置'],[/童牛/g,'慎重'],[/忍耐力/g,'忍耐'],[/岐山/g,'原点'],[/枯楊華/g,'再生の兆し'],[/棟隆/g,'成長'],[/後半/g,'次段階'],[/階段/g,'段取り']
    ,[/己日/g,'適切な時'],[/革言三/g,'繰り返し周知'],[/黄牛/g,'誠実'],[/大人(?!吉)/g,'指導者'],[/女性/g,'配偶者'],[/中身/g,'本質'],[/外見/g,'装い'],[/赤紱/g,'正当性'],[/葛藟/g,'つながり強化'],[/心快/g,'安心感'],[/細々/g,'小さな調整'],[/帰妹/g,'新しい関係'],[/片目/g,'視野'],[/大変吉/g,'幸運'],[/最初/g,'初動'],[/床下/g,'基盤'],[/実力以上/g,'等身大'],[/一心不乱/g,'集中'],[/渙散/g,'混乱'],[/戸庭/g,'身近な範囲'],[/人情/g,'配慮'],[/進退/g,'方針転換'],[/誠意/g,'誠実'],[/爵位/g,'公的立場'],[/放置/g,'静観'],[/旋元吉/g,'基本姿勢'],[/未完成/g,'仕上げ前'],[/私心/g,'私心を抑え']
  ];
  for (const [a,b] of map) t = t.replace(a,b);
  return t.trim();
}
function pickKeyword(hex,line,overrides,states){
  const key = `${Number(hex)}-${Number(line)}`;
  const arrRaw = (overrides[key]||[]).map(s=>String(s).trim());
  const arr = arrRaw.map(normalizeToken).filter(Boolean);
  if (arr.length){
    const hit = arr.find(k=>PRIORITY.includes(k));
    if (hit) return hit;
    return arr[0];
  }
  const s = normalizeToken(states[key]||'');
  for (const p of PRIORITY){ if (s.includes(p)) return p; }
  const m = s.match(/[\u4E00-\u9FFFァ-ヶー]{2,6}/);
  return m ? normalizeToken(m[0]) : '';
}
function explain(dict, kw, mode){
  const e = dict[kw];
  if (e && e[mode]) return e[mode];
  if (mode==='np') return kw ? `${kw}を意識し` : '';
  return kw ? `${kw}を意識して進めます` : '';
}
function sanitize(s){
  return String(s)
    .replace(/\s+/g,' ')
    .replace(/、、/g,'、')
    .replace(/にに/g,'に')
    .replace(/をに/g,'に')
    .replace(/視点を([^、。]*?)を(意識|重視|広げ|深め|整え|抑え|見極め|確認|明確|優先|心がけ|進め|頼り|見据え|目を配り|捉え|支え|重んじ|分かち合い)に切り替え/g,'視点を$1に切り替え')
    .replace(/視点を([^、。]*?)に目を配りに切り替え/g,'視点を$1に切り替え')
    .trim();
}
function composeStage(stepChar, kw, isLast, dict){
  const kw2 = normalizeToken(kw);
  const np = explain(dict, kw2, 'np');
  const vp = explain(dict, kw2, 'vp');
  if (isLast){
    if (np) return sanitize(`最後に、${np}、得た成果を定着させます。`);
    if (vp) return sanitize(`最後に、${vp}。結果を安定させます。`);
    return '最後に、得た成果を定着させます。';
  }
  if (stepChar==='J'){
    if (vp) return sanitize(`次に、${vp}。この流れを少し深めます。`);
    if (np) return sanitize(`次に、${np}、一歩前に進みます。`);
    return '次に、無理せず一歩進めます。';
  }
  if (np){
    const npChk = String(np).replace(/[、。]+$/,'');
    const shouldFallbackToVP = /に注意し$|に配慮し$|を改善し$|を見直し$|を強化し$|を確認し$|を検証し$|を築き$|し合い$|を重ね$|を保ち$|を揃え$|を避け$|を恐れず$|に進め$/.test(npChk);
    if (!shouldFallbackToVP){
      let core = np
        .replace(/を(意識|重視|大切|確認|守り|強め|整え|優先|明確|定め|見極め|築き|高め|心がけ|深め|広げ)(する|し|して)?$/,'')
        .replace(/を(意識|重視|大切|確認|守り|強め|整え|築き|高め|心がけ|深め|広げ)(し)?$/,'')
        .replace(/を大切に$/,'')
        .replace(/に向き合い$/,'')
        .replace(/(を|に|へ)$/,'')
        .replace(/、。?$/,'');
      if (!core) core = kw || '';
      const nonConcept = new Set(['一度立ち止まり','身近','身近な範囲','初動']);
      if (core && !/[しす]$/.test(core) && !nonConcept.has(core)) {
        return sanitize(`次に、視点を${core}に切り替え、流れを整えます。`);
      }
    }
    if (vp) return sanitize(`次に、${vp}。無理なく方向転換します。`);
    return '次に、視点を切り替え、流れを整えます。';
  }
  if (vp) return sanitize(`次に、${vp}。無理なく方向転換します。`);
  return '次に、視点を切り替え、流れを整えます。';
}
function transformHex(H64, hex, line){
  const row = H64.find(r=>Number(r['卦番号'])===Number(hex));
  if (!row) return hex;
  const field = line===1?'初爻変': line===2?'二爻変': line===3?'三爻変': line===4?'四爻変': line===5?'五爻変':'上爻変';
  const next= Number(row[field]);
  return Number.isFinite(next)? next : hex;
}
function follow({hex,line}, ch, H64){
  if (ch==='J') return { hex, line: line<6?line+1:1 };
  return { hex: transformHex(H64, hex, line), line };
}
function* allCombos(){
  const TRIADS = ['JJJ','JJH','JHJ','JHH','HJJ','HJH','HHJ','HHH'];
  for (let hex=1; hex<=64; hex++){
    for (let line=1; line<=6; line++){
      for (const t of TRIADS){ yield {hex,line,triad:t}; }
    }
  }
}

function main(){
  const {H64,H384} = loadH384H64();
  const overrides = JSON.parse(fs.readFileSync(overridesPath,'utf8'));
  const states = JSON.parse(fs.readFileSync(lineStatesPath,'utf8'));
  const dict = JSON.parse(fs.readFileSync(explainPath,'utf8'));
  const out = [];
  for (const {hex,line,triad} of allCombos()){
    let state = {hex,line};
    const narr = [];
    for (let i=0;i<3;i++){
      const next = follow(state, triad[i], H64);
      const kw = pickKeyword(next.hex,next.line,overrides,states);
      narr.push( composeStage(triad[i], kw, i===2, dict) );
      state = next;
    }
    const key = `${hex}-${line}`;
    const h384 = H384[(hex-1)*6+(line-1)] || {};
    out.push({ hex, line, triad, start: `${h384['卦名']} ${h384['爻']}`, narrations: narr });
  }
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${out.length} entries to ${OUT_PATH}`);
}

try{ main(); } catch(e){ console.error('dump failed:', e.message); process.exit(1); }
