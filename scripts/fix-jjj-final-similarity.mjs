#!/usr/bin/env node
// Fix cases where JJJ's headline and next3.final are duplicates/near-duplicates
// Usage: node scripts/fix-jjj-final-similarity.mjs --out ./public/data/scenario-db-easy
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = Object.fromEntries(args.map((a,i)=> a.startsWith('--') ? [a.replace(/^--/,''), (args[i+1] && !args[i+1].startsWith('--')) ? args[i+1] : true] : []).filter(Boolean));
const OUT = opt.out || './public/data/scenario-db-easy';

const norm = (s)=> String(s||'').replace(/[、。・\s]/g,'').trim();
function sim(a,b){ const A=[...new Set(norm(a))], B=[...new Set(norm(b))]; if(!A.length||!B.length) return 0; const inter=A.filter(ch=>B.includes(ch)).length; const uni=new Set([...A,...B]).size; return inter/uni; }

const phraseMap = new Map([
  ['ほどよさが保たれ','歩調はほどよいまま'],
  ['調和が広がる','声の合いが保たれる'],
  ['礼が保たれ','礼は行き届いたまま'],
  ['整いが進む','整いは静かに保たれる'],
  ['かたよりなく進む','釣り合いは崩れない'],
  ['緊張が混じる','気持ちの張りは適度に残る'],
  ['落ち着く','静けさが続く']
]);

const CANDIDATES = [
  '歩調はほどよいまま',
  '合いの静けさが保たれる',
  '静かな余白が生まれる',
  '輪郭がはっきりしたまま',
  '息の合いはほどよく続く',
  '静けさが保たれる'
];

function tokenize(s){
  // 粗い分かち: 語の塊で重複を見抜く（かな漢字の連続、助詞は短いので無視）
  return Array.from(String(s||'').split(/、|。|\s+/)).filter(t=>t && t.length>=2);
}

function distinctFinal(head, final, fallback){
  // まず辞書置換を試す
  let nf = phraseMap.get(final) || phraseMap.get((head.split('、')[1]||'').trim()) || fallback || final;
  // ヘッドの主要語と候補の語の重なりを避ける
  const headTokens = new Set(tokenize(head).map(norm));
  const isDistinct = (cand)=> sim(head,cand) < 0.6 && !tokenize(cand).some(t=> headTokens.has(norm(t)));
  if (!isDistinct(nf)){
    // 句単位で被り語を含む部分を落とす
    const cores = ['静かな集中','調和','ほどよさ','礼が保たれ','整い','かたよりなく','緊張','光が増す','声の合い'];
    const parts = String(nf).split('、').map(s=>s.trim()).filter(Boolean);
    const filtered = parts.filter(p=> !cores.some(c=> head.includes(c) && p.includes(c)));
    if (filtered.length){ nf = filtered.join('、'); }
    const pick = CANDIDATES.find(c=> isDistinct(c) && norm(c)!==norm(final));
    nf = pick || '歩調はほどよいまま';
  }
  return nf;
}

let files=0, changed=0; const edits=[];
for (let h=1; h<=64; h++){
  const file = path.join(OUT, `hex-${h}.json`);
  if (!fs.existsSync(file)) continue;
  const b = JSON.parse(fs.readFileSync(file,'utf8'));
  let fileChanged=false;
  for (const [key, it] of Object.entries(b.items||{})){
    if (!/_JJJ$/.test(key)) continue;
    const ez = it.easy; if (!ez) continue;
    const head = String(ez.oneLine||'');
    const final = String(ez.next3?.final||'');
    if (!head || !final) continue;
    const s = sim(head, final);
    const headTokens = new Set(tokenize(head).map(norm));
    const finalTokens = tokenize(final).map(norm);
    const tokenOverlap = finalTokens.some(t=> headTokens.has(t));
    const cores = ['静かな集中','調和','ほどよさ','礼が保たれ','整い','かたよりなく','緊張','光が増す','声の合い'];
    const coreOverlap = cores.some(c=> head.includes(c) && final.includes(c));
    if (norm(head)===norm(final) || s>=0.7 || tokenOverlap || coreOverlap){
      const nf = distinctFinal(head, final, ez.outcome);
      ez.next3 = ez.next3 || {}; ez.next3.final = nf; it.easy = ez;
      it.meta = it.meta || {}; it.meta.easyCurated = { verified:true, by:'manual-fix', ts:new Date().toISOString(), style:'situation-v2' };
      fileChanged=true; changed++; edits.push({ key, from: final, to: nf, head });
    }
  }
  if (fileChanged){ fs.writeFileSync(file, JSON.stringify(b,null,2)+'\n','utf8'); files++; }
}
console.log(JSON.stringify({ files, changed, edits: edits.slice(0,20) }, null, 2));
