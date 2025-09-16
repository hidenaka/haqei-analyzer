#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const root = process.cwd();
const H384_PATH = path.join(root, 'public/assets/H384H64database.js');
const NARR_PATH = path.join(root, 'public/data/authoring/narratives_chain_complete_final.merged.json');
const COMPOSER_PATH = path.join(root, 'public/js/components/TriadNarrativeComposer.js');
const OUT_PATH = path.join(root, 'public/data/authoring/narratives_chain_complete_final.merged_autofilled.json');

const TRIADS = ['JJJ','JJH','JHJ','JHH','HJJ','HJH','HHJ','HHH'];

function loadH384H64Into(context) {
  const code = fs.readFileSync(H384_PATH, 'utf-8');
  vm.runInContext(code, context, { filename: 'H384H64database.js' });
}
function loadComposerInto(context) {
  const code = fs.readFileSync(COMPOSER_PATH, 'utf-8');
  vm.runInContext(code, context, { filename: 'TriadNarrativeComposer.js' });
}

function main() {
  const base = JSON.parse(fs.readFileSync(NARR_PATH, 'utf-8'));
  const out = { ...base };

  const dummyDoc = { addEventListener: ()=>{}, body:{}, createElement: ()=>({}) };
  const context = { console, window: {}, globalThis: {}, document: dummyDoc };
  vm.createContext(context);
  loadH384H64Into(context);
  loadComposerInto(context);
  const H384 = context.window.H384_DATA || [];
  const composer = context.window.TriadNarrativeComposer;

  const norm = s => String(s||'').trim();
  const mapLine = name => name.includes('初')?1: name.includes('二')?2: name.includes('三')?3: name.includes('四')?4: name.includes('五')?5: 6;

  let added = 0;
  for (const e of H384) {
    const hexName = norm(e['卦名']);
    const lineName = norm(e['爻']);
    if (!hexName || !lineName) continue;
    const hexNum = Number(e['卦番号']);
    const lineNum = mapLine(lineName);
    for (const t of TRIADS) {
      const key = `${hexName} ${lineName} | ${t}`;
      if (out[key]) continue;
      // Generate entry via composer
      let chain = '';
      try { chain = composer && composer.compose ? composer.compose(hexNum, lineNum, t) : ''; }
      catch { chain = ''; }
      const path_code = t.split('').map(c=> c==='J'?'進':'変').join('→');
      let one = '';
      if (chain) {
        const first = chain.split('。')[0];
        if (first) one = first + '。';
      }
      if (!one) {
        const idx = (hexNum-1)*6 + (lineNum-1);
        const h = H384[idx];
        one = h ? String(h['現代解釈の要約']||'').trim() : '';
      }
      // naive triad_p placeholders
      const triad_p1 = t[0]==='J'?'第一段：進展の始まり':'第一段：視点の転換';
      const triad_p2 = t[1]==='J'?'第二段：深化と展開':'第二段：方向の再定義';
      const triad_p3 = t[2]==='J'?'第三段：定着と完成':'第三段：刷新の結実';
      const triad_headline = `${triad_p1.replace('第一段：','').replace('：','')} → ${triad_p2.replace('第二段：','').replace('：','')} → ${triad_p3.replace('第三段：','').replace('：','')}`;
      out[key] = {
        one_liner: one,
        chain_long: chain || one,
        triad_p1, triad_p2, triad_p3,
        triad_headline,
        path_code
      };
      added++;
    }
  }
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2), 'utf-8');
  console.log(`Autofilled entries: ${added}`);
  console.log(`Wrote: ${OUT_PATH}`);
}

try { main(); } catch (e) { console.error('fill-missing failed:', e.message); process.exit(1); }
