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

function distinctFinal(head, final, fallback){
  let nf = phraseMap.get(final) || phraseMap.get((head.split('、')[1]||'').trim()) || fallback || final;
  if (norm(nf)===norm(final) || sim(head,nf)>=0.85){
    const cands=['静かな集中が続く','歩調はほどよいまま','落ち着いた合いが保たれる','静けさが保たれる'];
    nf = cands.find(c=> sim(head,c)<0.6 && norm(c)!==norm(final)) || '静かな集中が続く';
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
    if (norm(head)===norm(final) || s>=0.85){
      const nf = distinctFinal(head, final, ez.outcome);
      ez.next3 = ez.next3 || {}; ez.next3.final = nf; it.easy = ez;
      it.meta = it.meta || {}; it.meta.easyCurated = { verified:true, by:'manual-fix', ts:new Date().toISOString(), style:'situation-v2' };
      fileChanged=true; changed++; edits.push({ key, from: final, to: nf, head });
    }
  }
  if (fileChanged){ fs.writeFileSync(file, JSON.stringify(b,null,2)+'\n','utf8'); files++; }
}
console.log(JSON.stringify({ files, changed, edits: edits.slice(0,20) }, null, 2));

