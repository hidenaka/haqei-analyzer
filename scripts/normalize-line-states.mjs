// scripts/normalize-line-states.mjs
// h384-line-states.json の文体を助言調→状況説明調へ正規化して上書き保存
import { readFile, writeFile } from 'fs/promises';

function toNeutral(text){
  try {
    let t = String(text||'').trim();
    if (!t) return t;
    const pairs = [
      [/しましょう(?=。|$)/g, 'する局面です'],
      [/すべき(?=。|$)/g, 'が求められやすい局面です'],
      [/したほうがいい|した方がいい/g, 'しやすい局面です'],
      [/するのがよい|するのが良い/g, 'となりやすいです'],
      [/のがよい|のが良い/g, 'であることが多いです'],
      [/おすすめです/g, '選ばれがちです'],
      [/推奨されます/g, '適合しやすいです'],
      [/望ましいでしょう/g, '望ましい傾向があります'],
      [/が良いでしょう/g, 'が適している傾向です'],
      [/しまうと良い/g, 'しやすい'],
      [/心がけましょう/g, '心がける局面です'],
      [/が望ましい/g, 'が望まれる傾向です'],
      [/していけば良いです|していけばよいです/g, 'していきやすい局面です'],
      [/すれば良いです|すればよいです/g, 'する局面です'],
      [/進めば良いです|進めばよいです/g, '進む局面です'],
      [/見直せば良いです|見直せばよいです/g, '見直しが焦点になりやすい局面です'],
      [/整えれば良いです|整えればよいです/g, '整える局面です'],
      [/調整すれば良いです|調整すればよいです/g, '調整が焦点になりやすい局面です'],
    ];
    pairs.forEach(([re, rep]) => { t = t.replace(re, rep); });
    t = t.replace(/ください(?=。|$)/g, 'する局面です');
    t = t.replace(/必ず/g, '基本的に');
    t = t.replace(/ですです/g, 'です');
    t = t.replace(/です。です/g, 'です。');
    t = t.replace(/。。+/g, '。');
    t = t.replace(/\s+。/g, '。');
    return t;
  } catch { return String(text||''); }
}

async function main(){
  const path = './public/data/h384-line-states.json';
  const raw = await readFile(path, 'utf-8');
  const obj = JSON.parse(raw);
  let changed = 0;
  for (const k of Object.keys(obj)){
    const before = obj[k];
    if (typeof before === 'string'){
      const after = toNeutral(before);
      if (after !== before) { obj[k] = after; changed++; }
    } else if (before && typeof before.text === 'string'){
      const after = toNeutral(before.text);
      if (after !== before.text) { obj[k].text = after; changed++; }
    }
  }
  await writeFile(path, JSON.stringify(obj, null, 2), 'utf-8');
  console.log(`✅ normalized h384-line-states.json: changed ${changed} entries`);
}

main().catch(e=>{ console.error('normalize failed', e); process.exit(1); });
