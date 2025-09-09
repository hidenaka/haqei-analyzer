#!/usr/bin/env node
// Random spot-check for line states and keyword explanation/narration readiness
const fs = require('fs');
const path = require('path');

function loadJSON(p){return JSON.parse(fs.readFileSync(p,'utf8'))}
function sample(arr,n){const a=[...arr];const out=[];while(a.length&&out.length<n){out.push(a.splice(Math.floor(Math.random()*a.length),1)[0]);}return out}

const root=process.cwd();
const states=loadJSON(path.join(root,'public/data/h384-line-states.json'));
const overrides=loadJSON(path.join(root,'public/data/h384-keyword-overrides.json'));
const explain=loadJSON(path.join(root,'public/data/keyword-explanations.json'));

const keys=Object.keys(states);
const pick=sample(keys,20);

const badPatterns=[/ですです/g,/ますです/g,/でします/g,/ありまします/g,/れります/g,/せよです/g,/的なになり/g,/玄黄/g,/郊に同人/g,/鹿を追って/g];

let issues=[];
let okCount=0;

for(const k of pick){
  const txt=states[k];
  const [hex,line]=k.split('-').map(Number);
  // heuristics
  const endsGood=/[。!?？]$/.test(txt);
  const noBad=!badPatterns.some(r=>r.test(txt));
  const lenOK = txt.length>=12 && txt.length<=80;
  const ov = overrides[k]||[];
  const expHit = ov.find(w=>explain[w]);
  const rec={key:k, state:txt, overrides:ov, hasExplanation:!!expHit, checks:{endsGood,noBad,lenOK}};
  if(endsGood && noBad && lenOK) okCount++; else issues.push(rec);
}

console.log('=== Spot-check (20 samples) ===');
console.log('OK:', okCount, '/ 20');
if(issues.length){
  console.log('
Issues:');
  for(const it of issues){
    console.log(`- ${it.key} :: ${JSON.stringify(it.checks)}
  state: ${it.state}
  kw: ${it.overrides.join(' / ')}`);
  }
}
console.log('
Note: hasExplanation=true indicates at least one override keyword is mapped in explanations.');
