#!/usr/bin/env node
// Generate detailed explanations for all 3072 (64*6*8) keys
// Inputs:
//  - public/data/scenario-db-easy/hex-*.json (items with easy.oneLine/next3/why/caution/fit/avoid/outcome)
//  - public/data/h384-keyword-overrides.json (keywords per hex-line)
// Output:
//  - public/data/scenario-db-easy-detailed/hex-*.json { items: { key: { detail: string } } }

import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd());
const EASY_DIR = path.join(ROOT, 'public', 'data', 'scenario-db-easy');
const OUT_DIR = path.join(ROOT, 'public', 'data', 'scenario-db-easy-detailed');
const KW_PATH = path.join(ROOT, 'public', 'data', 'h384-keyword-overrides.json');

function readJSON(p){ return JSON.parse(fs.readFileSync(p, 'utf8')); }
function safeStr(v){ return (v==null) ? '' : String(v); }

function sanitizeSentence(s){
  // Normalize whitespace and remove trailing ASCII punctuation to fit style
  return safeStr(s)
    .replace(/\s+/g, ' ')
    .replace(/[\u0000-\u001f]/g,'')
    .trim()
}

function sliceToSentence(s){
  const t = sanitizeSentence(s);
  if (!t) return '';
  // Ensure Japanese full stop
  return /[。！？]$/.test(t) ? t : t + '。';
}

function pick(arr, idx, def=''){
  if (!Array.isArray(arr) || arr.length===0) return def;
  return safeStr(arr[Math.min(arr.length-1, Math.max(0, idx))] || def);
}

function buildDetail({hex, line, triad, rec, keywords}){
  // Triad semantics: affects emphasis across phases
  // Map triad to emphasis profile for variety and differentiation
  const profiles = {
    JJJ: { start:'start', mid:'focus', end:'advance' },
    JJH: { start:'advance', mid:'reduce', end:'align' },
    JHJ: { start:'advance', mid:'refit', end:'advance' },
    JHH: { start:'probe', mid:'order', end:'stabilize' },
    HJJ: { start:'align', mid:'focus', end:'continue' },
    HJH: { start:'reduce', mid:'recheck', end:'stabilize' },
    HHJ: { start:'order', mid:'probe', end:'step' },
    HHH: { start:'observe', mid:'prepare', end:'ready' },
  };
  const prof = profiles[triad] || profiles.JJJ;

  const easy = rec?.easy || {};
  const steps = Array.isArray(rec?.steps) ? rec.steps : [];
  const next3 = easy?.next3 || {};
  const why = Array.isArray(easy?.why) ? easy.why : [];
  const caution = safeStr(easy?.caution || '');
  const outcome = safeStr(easy?.outcome || '');
  const fit = safeStr(easy?.fit || '');
  const avoid = safeStr(easy?.avoid || '');

  // Keyword meanings per hex-line (4 items). Use as conceptual anchors; integrate via paraphrase fragments.
  const kw = Array.isArray(keywords) ? keywords.slice(0,4) : [];

  // Helper: derive paraphrase fragments from keywords (meaning-oriented; no direct quoting needed)
  function kwFrag(word){
    if (!word) return '';
    // Map common patterns to neutral paraphrases
    if (word.includes('始動') || word.includes('萌芽')) return '始まりの注意と基礎作り';
    if (word.includes('困難') || word.includes('停滞')) return '滞りの芽を早めに抑える';
    if (word.includes('損失') || word.includes('浪費')) return '無駄な消耗を避ける';
    if (word.includes('尾を濡ら') || word.includes('詰め')) return '最後の詰めで崩さない';
    if (word.includes('持続') || word.includes('安定')) return '一定の状態を保つ';
    if (word.includes('実行') || word.includes('達成')) return '要点から実行して積み上げる';
    if (word.includes('慎重') || word.includes('無難')) return '控えめに進めて乱れを抑える';
    if (word.includes('本質') || word.includes('真実')) return '中身を見て判断を整える';
    if (word.includes('完成') || word.includes('集大成')) return '仕上げに向けて整える';
    if (word.includes('対立') || word.includes('争い')) return '摩擦を避けて段取りを揃える';
    return '要点を見て整える';
  }

  const kw1 = kwFrag(kw[0]);
  const kw2 = kwFrag(kw[1]);
  const kw3 = kwFrag(kw[2]);
  const kw4 = kwFrag(kw[3]);

  // Phase sentences
  let s1Base = steps[0]?.lineText || easy?.oneLine || '';
  // Avoid arrow notation in base texts
  const toNaturalOrder = (txt) => {
    const raw = safeStr(txt).trim();
    if (!raw) return '';
    if (raw.includes('→')){
      const parts = raw.split('→').map(p=>p.trim()).filter(Boolean);
      if (parts.length >= 2){
        const head = parts.slice(0,3).join('、');
        return `${head}の順に進める`;
      }
    }
    return raw;
  };
  s1Base = toNaturalOrder(s1Base);
  let s1 = '';
  switch (prof.start){
    case 'start':
      if (/^(始め|初め|はじめ)/.test(s1Base)) {
        s1 = sliceToSentence(s1Base);
      } else {
        s1 = `始まりは${s1Base.replace(/。+$/,'')}。`;
      }
      break;
    case 'advance':
      s1 = sliceToSentence(s1Base);
      break;
    case 'align':
      s1 = sliceToSentence('向きを確かめ、合う形へ整える');
      break;
    case 'reduce':
      s1 = sliceToSentence('まず量と範囲を小さくする');
      break;
    case 'probe':
      s1 = sliceToSentence('一歩出して様子を確かめる');
      break;
    case 'observe':
      s1 = sliceToSentence('全体を保ち、観察と準備に集中する');
      break;
    default:
      s1 = sliceToSentence(s1Base);
  }

  // Middle sentences: use next3.first/second and why[0]
  const s2 = sliceToSentence(toNaturalOrder(next3.first) || kw1 || '要点を見極める');
  const s3 = sliceToSentence(toNaturalOrder(next3.second) || kw2 || '段取りを整える');
  function whyMorph(cause){
    const t = safeStr(cause).trim();
    if (!t) return '';
    if (/ため$/.test(t)) return t; // already ends with ため
    if (/が強み$/.test(t)) return t + 'のため';
    if (/から$/.test(t)) return t + '。';
    return t + 'ため';
  }
  const s4 = sliceToSentence(why[0] ? whyMorph(why[0]) : (kw3 || '乱れを抑えられる'));

  // End sentences: next3.final/outcome + caution/Fit/Avoid compressed
  const endCore = sliceToSentence(toNaturalOrder(next3.final) || outcome || kw4 || '静かに次へ進める');

  // Caution integrated as a discouragement sentence
  function naturalizeCaution(c){
    const t = safeStr(c).replace(/[。．]$/,'').trim();
    if (!t) return '';
    // If pattern like "〜だと〜" -> "〜は避ける"
    if (t.includes('だと')){
      const idxd = t.lastIndexOf('だと');
      if (idxd > 0){
        return sliceToSentence(t.slice(0, idxd) + 'は避ける');
      }
    }
    // If ends with dictionary verb (〜る/〜ない), add のは避ける
    if (/[るない]$/.test(t)) return sliceToSentence(t + 'のは避ける');
    // If already contains topic marker は, append 避ける
    const idx = t.lastIndexOf('は');
    if (idx > 0) return sliceToSentence(t + '避ける');
    return sliceToSentence(t + 'は避ける');
  }
  const cautionSent = caution ? naturalizeCaution(caution) : '';

  // Fit/Avoid: make them soft qualifiers
  function morphFit(s){
    const t = safeStr(s).replace(/^合う場面:\s*/,'').trim();
    if (!t) return '';
    return /の$/.test(t) ? t + 'ときに向く' : t + 'のときに向く';
  }
  function morphAvoid(s){
    const t = safeStr(s).replace(/^合わない場面:\s*/,'').trim();
    if (!t) return '';
    return /の$/.test(t) ? t + '計画とは相性がよくない' : t + 'の計画とは相性がよくない';
  }
  const fitSent = fit ? sliceToSentence(morphFit(fit)) : '';
  const avoidSent = avoid ? sliceToSentence(morphAvoid(avoid)) : '';

  // Build paragraph with 5–7 sentences
  const parts = [s1, s2, s3, s4, endCore, cautionSent, fitSent, avoidSent]
    .filter(Boolean)
    .slice(0, 7); // cap to 7 sentences for readability

  // Reduce repeated endings like 〜する。〜する。
  const text = parts.join('');
  return text;
}

function main(){
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const kwMap = readJSON(KW_PATH);
  const files = fs.readdirSync(EASY_DIR).filter(f => /^hex-\d+\.json$/.test(f));
  let total = 0;

  for (const f of files){
    const hex = Number(f.match(/hex-(\d+)\.json/)[1]);
    const src = readJSON(path.join(EASY_DIR, f));
    const outItems = {};
    const items = src?.items || {};
    for (const [key, rec] of Object.entries(items)){
      const [h, line, triad] = key.split('_');
      const kwords = kwMap?.[`${Number(h)}-${Number(line)}`] || [];
      const detail = buildDetail({ hex:Number(h), line:Number(line), triad, rec, keywords: kwords });
      outItems[key] = { detail };
      total++;
    }
    const out = { items: outItems };
    const outPath = path.join(OUT_DIR, f);
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  }

  console.log(`Generated detailed explanations: ${total}`);
}

main();
