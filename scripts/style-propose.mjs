#!/usr/bin/env node
import fs from 'fs';

const RULES = JSON.parse(fs.readFileSync('scripts/style-rules.json','utf8'));
const REPORT = JSON.parse(fs.readFileSync('.style-report.json','utf8'));

// Seed suggestions for common templates
const suggestions = {
  '歩幅は細いが、切れずにつながる。': [
    '歩幅は小さいが、途切れず続く。',
    '歩を小さく保ち、継続する。',
    '無理をかけずにつなげていく。'
  ],
  'すぐ止めて点検': [
    'いったん止めて見直す',
    'ひと呼吸おいて確かめる',
    '区切って点検する'
  ],
  'まずは静かに確かめ': [
    'まず落ち着いて確認し',
    'はじめに静かに見定め',
    '先に静かに確認し'
  ],
  '小さく整えれば': [
    '小さく整え直せば',
    '少し整えれば'
  ],
  '小さく締めれば': [
    '少し絞れば',
    '小さく抑えれば'
  ],
  '横ばいで保てる': [
    '変わらず保てる',
    'そのまま維持できる'
  ],
  '横ばいで保つ': [
    '変わらず保つ',
    'そのまま維持する'
  ],
  '横ばいで続く': [
    '変わらず続く',
    'そのまま続けられる'
  ],
  '横ばいで守れる': [
    '変わらず守れる'
  ]
};

// Build proposal list (10-20 items)
const templateTop = REPORT.summary.templateTop;
const proposals = [];
for(const [phrase,count] of templateTop){
  const sug = suggestions[phrase];
  if(!sug) continue;
  proposals.push({ phrase, count, suggestions: sug });
  if(proposals.length >= 20) break;
}

// Add NG replacements proposals as well
for(const [from,to] of Object.entries(RULES.replacements)){
  proposals.push({ phrase: from, type: 'ng-replacement', suggestion: to });
}

fs.writeFileSync('.style-proposals.json', JSON.stringify({ proposals }, null, 2));
console.log('Wrote .style-proposals.json with', proposals.length, 'items');

