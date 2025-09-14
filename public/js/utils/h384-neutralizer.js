// h384-neutralizer.js
// H384_DATAの「現代解釈の要約」を助言調→状況説明調に正規化（起動時一回）
(function(global){
  'use strict';
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
      return t;
    } catch { return String(text||''); }
  }

  try {
    if (Array.isArray(global.H384_DATA)) {
      let changed = 0;
      global.H384_DATA.forEach((e)=>{
        if (e && typeof e['現代解釈の要約'] === 'string') {
          const before = e['現代解釈の要約'];
          const after = toNeutral(before);
          if (after !== before) { e['現代解釈の要約'] = after; changed++; }
        }
      });
      try { console.log(`📝 H384 neutralized summaries: ${changed}`); } catch {}
    } else {
      try { console.warn('H384 neutralizer: H384_DATA not array'); } catch {}
    }
  } catch (e) { try { console.warn('H384 neutralizer error:', e?.message||e); } catch {} }
})(typeof window !== 'undefined' ? window : globalThis);

