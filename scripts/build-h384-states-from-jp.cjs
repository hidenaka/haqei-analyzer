#!/usr/bin/env node
// Build line state sentences (JP) from enhanced_hexagrams_complete.json
// Map key: "<hexagram_id>-<line_position>" -> short sentence (16-40 chars target)

const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '../data/enhanced_hexagrams_complete.json');
const OUT = path.resolve(__dirname, '../public/data/h384-line-states.json');

function firstSentence(s) {
  if (!s) return '';
  const str = String(s).trim();
  const idx = str.search(/[。．!！?？]/);
  return idx >= 0 ? str.slice(0, idx) : str;
}

function modernizeJP(s) {
  if (!s) return '';
  let t = String(s);
  // Normalize punctuation
  t = t.replace(/[，]/g, '、').replace(/[．]/g, '。');
  // Replace archaic or formal terms with modern friendly tone
  const reps = [
    [/なり/g, 'です'],
    [/べし/g, 'しましょう'],
    [/元吉/g, 'とても良いです'],
    [/大いに吉/g, 'とても良いです'],
    [/吉(?![\w一-龯])/g, '良いです'],
    [/凶/g, '注意が必要です'],
    [/無咎/g, '問題ありません'],
    [/有悔/g, '後悔につながります'],
    [/必要性/g, 'が必要です'],
    [/可能性/g, 'の可能性があります'],
    [/傾向/g, 'になりがちです'],
    [/怠らず/g, '怠りません'],
    [/正しくあれ/g, '正しくあることが大切です'],
    [/あらざることなし/g, 'ないことはありません'],
    [/のが必要です/g, 'が必要です'],
    [/必要があるです/g, '必要があります'],
    [/必要がある$/g, '必要があります'],
    [/([ぁ-ん])です$/g, (m, p1) => {
      const map = { 'く': 'きます', 'ぐ': 'ぎます', 'す': 'します', 'つ': 'ちます', 'ぶ': 'びます', 'む': 'みます', 'ぬ': 'にます', 'る': 'ります' };
      return map[p1] ? map[p1] : p1 + 'です';
    }],
    [/築くです/g, '築きます'],
    [/悲しむです/g, '悲しみます'],
    [/あるです/g, 'あります'],
    [/良いです、大きな/g, '良いです。大きな'],
    [/学ばずして利あらざることなし/g, '学べば必ず利があります'],
    [/学ばずして利ないことはありません/g, '学べば必ず利があります'],
    [/的なになり/g, '的になり'],
    [/せよです/g, 'しましょう'],
    // Metaphor simplifications (animals / archaic imagery)
    [/その血は玄黄/g, '血が濁ります'],
    [/玄黄/g, '濁った色'],
    [/龍、野に戦い/g, '激しい対立が起こり'],
    [/龍が天に飛ぶ、最高の活躍時期/g, '最盛期'],
    [/鹿を追って林に入る/g, '準備なしに目標を追って深入りする'],
    [/馬に乗って進退に迷い/g, '進むべきか戻るべきか迷い'],
    [/馬に乗って進退し/g, '進むか戻るか迷いながら'],
    [/馬に乗って/g, ''],
    [/黄裳/g, '落ち着いた装い（黄色）'],
    // Classical to modern paraphrase (指定語)
    [/郊に同人す、悔いなし/g, '外の人と連携し、後悔はありません'],
    [/門に同人す、咎なし/g, '身近な人と協力しても問題ありません'],
    [/宗に同人す、吝し/g, '身内だけの協力に偏りがちで、慎重さが必要です'],
    [/宗に同人す/g, '身内で協力します'],
    [/淵/g, '危険な深み'],
    [/狐/g, '小さな問題'],
    [/黄矢/g, '公正な手段'],
    [/豹変/g, '素早く変化'],
    [/精神的感応/g, '直感的につながる'],
    [/感応/g, '共鳴'],
    // Classical single-word modernizations
    [/孚/g, '信頼'],
    [/攣如/g, 'つながり'],
    [/鄰/g, '近しい人'],
    // Generic polite conversions for common verb endings before です
    [/([一-龯]{1,6})くです(?=。|$)/g, '$1きます'],
    [/([一-龯]{1,6})ぐです(?=。|$)/g, '$1ぎます'],
    [/([一-龯]{1,6})むです(?=。|$)/g, '$1みます'],
    [/([一-龯]{1,6})ぶです(?=。|$)/g, '$1びます'],
    [/([一-龯]{1,6})るです(?=。|$)/g, '$1ります'],
    [/([一-龯]{1,6})ぬです(?=。|$)/g, '$1にます'],
    [/([一-龯]{1,6})つです(?=。|$)/g, '$1ちます'],
    // Specific fixes
    [/築くです/g, '築きます'],
    [/悲しむです/g, '悲しみます'],
  ];
  for (const [a, b] of reps) t = t.replace(a, b);
  // Verb endings: ～ない → ～ません (simple cases)
  t = t.replace(/しない(?=。|$)/g, 'しません');
  t = t.replace(/ない(?=。|$)/g, 'ません');
  // Post punctuation generic verb polite
  t = t.replace(/くです。/g, 'きます。')
       .replace(/ぐです。/g, 'ぎます。')
       .replace(/むです。/g, 'みます。')
       .replace(/ぶです。/g, 'びます。')
       .replace(/るです。/g, 'ります。')
       .replace(/つです。/g, 'ちます。')
       .replace(/あるです。/g, 'あります。');
  // Polite-tail conversion for dictionary endings
  const politeTail = (str) => {
    const end = (a,b) => str.endsWith(a) ? str.slice(0, -a.length) + b : null;
    let r = null;
    r = end('できる', 'できます') || end('する', 'します') || end('ある', 'あります') || end('なる', 'なります');
    if (!r) {
      const last = str.slice(-1);
      const map = { 'く':'きます','ぐ':'ぎます','む':'みます','ぶ':'びます','る':'ります','つ':'ちます','ぬ':'にます','す':'します','う':'います' };
      if (map[last]) r = str.slice(0, -1) + map[last];
    }
    return r || str;
  };
  const beforePolite = t;
  t = politeTail(t);
  const converted = t !== beforePolite;
  // Clean awkward duplicates
  t = t.replace(/ますです。/g, 'ます。').replace(/ですです。/g, 'です。');
  t = t.replace(/です。\s*です。/g, 'です。');
  t = t.replace(/案内なしに準備なしに/g, '準備や案内なしに');
  // Clean awkward composites from layered replacements
  t = t.replace(/ありまします/g, 'あります')
       .replace(/でします/g, 'です')
       .replace(/れります/g, 'れます')
       .replace(/されります/g, 'されます')
       .replace(/だです/g, 'です')
       .replace(/ながらながら/g, 'ながら')
       .replace(/ですである/g, 'です')
       .replace(/であります/g, 'です')
       .replace(/するになりがち/g, 'しがち')
       .replace(/変えります/g, '変えます')
       .replace(/在りて/g, 'の中にいて')
       .replace(/臧らざる/g, '認めない')
       // newly added cleaner rules
       .replace(/になりがちになりがち/g, 'になりがち')
       .replace(/厳格にです/g, '厳格にします')
        // rare typo from mappings
       .replace(/素晴/g, '素早');
  // Parentheses removal (ban brackets in final text)
  t = t.replace(/（[^）]*）/g, '');
  // Refine negatives and polite forms
  t = t.replace(/ではません/g, 'ではありません')
       .replace(/ありませんです/g, 'ありません')
       .replace(/ませんです/g, 'ません');
  // Common verb naturalization
  t = t.replace(/得ります/g, '得られます')
       .replace(/していります/g, 'しています')
       .replace(/いります/g, 'います');
  // If sentence lacks polite ending, add です for noun/adjective endings
  if (!/(です|ます|ません)[。!?？]?$/.test(t)) {
    t = t + 'です';
  }
  // Ensure period
  if (!/[。!?？]$/.test(t)) t += '。';
  return t;
}

function condenseJP(...parts) {
  const joined = parts.filter(Boolean).map(x => String(x).trim()).filter(Boolean);
  if (!joined.length) return '';
  // Prefer meaning, then personality_trait
  let s1 = firstSentence(joined[0]);
  let s2 = joined[1] ? firstSentence(joined[1]) : '';
  // Combine if short
  let s = s1;
  if (s.length < 18 && s2) s = `${s1}。${s2}`;
  // Trim to ~48 chars
  if (s.length > 60) {
    const cut = s.slice(0, 58);
    const natural = Math.max(cut.lastIndexOf('。'), cut.lastIndexOf('、'), cut.lastIndexOf(' '));
    s = (natural > 20 ? cut.slice(0, natural) : cut).trim();
  }
  // Modernize tone
  s = modernizeJP(s);
  return s;
}

function build() {
  const src = JSON.parse(fs.readFileSync(SRC, 'utf8'));
  const map = {};
  for (const hex of src) {
    const id = Number(hex.hexagram_id);
    if (!Array.isArray(hex.six_lines)) continue;
    for (const line of hex.six_lines) {
      const pos = Number(line.position);
      const key = `${id}-${pos}`;
      const sentence = condenseJP(line.meaning, line.personality_trait);
      if (sentence) map[key] = sentence;
    }
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(map, null, 2), 'utf8');
  console.log('✅ Built line states:', Object.keys(map).length, 'entries');
  console.log('📄 Saved to', OUT);
}

if (require.main === module) build();
