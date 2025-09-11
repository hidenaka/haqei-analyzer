// Simple tag extractor based on semantic lexicon
export async function extractTags(inputText) {
  const text = String(inputText || '').toLowerCase();
  let lex = null;
  try {
    const res = await fetch('./data/semantic-lexicon.json', { cache: 'no-cache' });
    if (res.ok) lex = await res.json();
  } catch {}
  const buckets = [];
  const fallback = [
    '人手不足','納期','信頼','合意','合意形成','焦り','不安','制約','予算','リスク','支援','連携','協力','効果','品質','期限'
  ];
  const vocab = new Set(fallback);
  try {
    if (lex && Array.isArray(lex[0])) {
      lex.flat().forEach(w => { if (typeof w === 'string' && w.length <= 8) vocab.add(w); });
    }
    if (lex && typeof lex === 'object') {
      Object.values(lex).forEach(v => {
        if (Array.isArray(v)) v.forEach(w => { if (typeof w === 'string' && w.length <= 8) vocab.add(w); });
      });
    }
  } catch {}
  const found = [];
  vocab.forEach(w => { if (w && text.includes(String(w).toLowerCase())) found.push(w); });
  // de-duplicate while preserving order
  const seen = new Set();
  const tags = found.filter(w => { if (seen.has(w)) return false; seen.add(w); return true; }).slice(0, 10);
  return { tags };
}

