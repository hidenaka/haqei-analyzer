'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

function readJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }

function loadH384(dbPath) {
  const code = fs.readFileSync(dbPath, 'utf8');
  const m = code.match(/let\s+H384_DATA\s*=\s*(\[([\s\S]*?)\]);/);
  if (!m) return [];
  const arrCode = 'var H384_OUT = ' + m[1] + ';';
  const sb = {};
  vm.createContext(sb);
  vm.runInContext(arrCode, sb, { filename: dbPath + ':array' });
  return Array.isArray(sb.H384_OUT) ? sb.H384_OUT : [];
}

const MIN_HEX = [
  { name_jp: '乾為天', binary: '111111' },
  { name_jp: '坤為地', binary: '000000' },
  { name_jp: '水雷屯', binary: '001010' },
  { name_jp: '山水蒙', binary: '010100' },
  { name_jp: '水天需', binary: '111010' },
  { name_jp: '天水訟', binary: '010111' },
  { name_jp: '地水師', binary: '010000' },
  { name_jp: '水地比', binary: '000010' },
  { name_jp: '風天小畜', binary: '111110' },
  { name_jp: '天澤履', binary: '011111' },
  { name_jp: '地天泰', binary: '111000' },
  { name_jp: '天地否', binary: '000111' },
  { name_jp: '天火同人', binary: '101111' },
  { name_jp: '火天大有', binary: '111101' },
  { name_jp: '地山謙', binary: '100000' },
  { name_jp: '雷地豫', binary: '000001' },
  { name_jp: '澤雷随', binary: '001011' },
  { name_jp: '山風蠱', binary: '110100' },
  { name_jp: '地澤臨', binary: '011000' },
  { name_jp: '風地観', binary: '000110' },
  { name_jp: '火雷噬嗑', binary: '001101' },
  { name_jp: '山火賁', binary: '101100' },
  { name_jp: '山地剥', binary: '000100' },
  { name_jp: '地雷復', binary: '001000' },
  { name_jp: '天雷無妄', binary: '001111' },
  { name_jp: '山天大畜', binary: '111100' },
  { name_jp: '山雷頤', binary: '001100' },
  { name_jp: '澤風大過', binary: '110011' },
  { name_jp: '坎為水', binary: '010010' },
  { name_jp: '離為火', binary: '101101' },
  { name_jp: '澤山咸', binary: '100011' },
  { name_jp: '雷風恒', binary: '110001' },
  { name_jp: '天山遯', binary: '100111' },
  { name_jp: '雷天大壮', binary: '111001' },
  { name_jp: '火地晋', binary: '000101' },
  { name_jp: '地火明夷', binary: '101000' },
  { name_jp: '風火家人', binary: '101110' },
  { name_jp: '火澤睽', binary: '011101' },
  { name_jp: '水山蹇', binary: '100010' },
  { name_jp: '雷水解', binary: '010001' },
  { name_jp: '山澤損', binary: '011100' },
  { name_jp: '風雷益', binary: '001110' },
  { name_jp: '澤天夬', binary: '111011' },
  { name_jp: '天風姤', binary: '110111' },
  { name_jp: '澤地萃', binary: '000011' },
  { name_jp: '地風升', binary: '110000' },
  { name_jp: '澤水困', binary: '010011' },
  { name_jp: '水風井', binary: '110010' },
  { name_jp: '澤火革', binary: '101011' },
  { name_jp: '火風鼎', binary: '110101' },
  { name_jp: '震為雷', binary: '001001' },
  { name_jp: '艮為山', binary: '100100' },
  { name_jp: '風山漸', binary: '100110' },
  { name_jp: '雷澤帰妹', binary: '011001' },
  { name_jp: '雷火豊', binary: '101001' },
  { name_jp: '火山旅', binary: '100101' },
  { name_jp: '巽為風', binary: '110110' },
  { name_jp: '兌為澤', binary: '011011' },
  { name_jp: '風水渙', binary: '010110' },
  { name_jp: '水澤節', binary: '011010' },
  { name_jp: '風澤中孚', binary: '011110' },
  { name_jp: '雷山小過', binary: '100001' },
  { name_jp: '水火既済', binary: '101010' },
  { name_jp: '火水未済', binary: '010101' },
];

const NAME_TO_INDEX = new Map(MIN_HEX.map((h, i) => [h.name_jp, i]));
const PATTERNS = ['JJJ','JJH','JHJ','JHH','HJJ','HJH','HHJ','HHH'];

function hexByName(name) { const idx = NAME_TO_INDEX.get(name); return idx != null ? MIN_HEX[idx] : null; }
function hexByBinary(bin) { const idx = MIN_HEX.findIndex(h => String(h.binary) === String(bin)); return idx >= 0 ? MIN_HEX[idx] : null; }
function flipBitAt(binStr, pos) { const i = pos - 1; const arr = String(binStr).split(''); arr[i] = arr[i] === '1' ? '0' : '1'; return arr.join(''); }
function nextKingWenName(currentName) { const idx = NAME_TO_INDEX.get(currentName); if (idx == null) return currentName; return MIN_HEX[(idx + 1) % MIN_HEX.length].name_jp; }
function parsePos(label) { const map = {'初':1,'二':2,'三':3,'四':4,'五':5,'上':6}; const m = String(label).match(/(初|二|三|四|五|上)/); return m ? map[m[1]] : 1; }

function buildFinalFromPattern(startHex, startPos, pattern) {
  let hex = startHex;
  let pos = startPos;
  let topVisits = 0;
  for (let s=0; s<3; s++) {
    const step = pattern[s];
    if (step === 'J') {
      if (pos < 6) pos += 1; else { if (topVisits === 0) { topVisits += 1; pos = 6; } else { hex = nextKingWenName(hex); pos = 1; } }
    } else {
      const curr = hexByName(hex);
      const flipped = curr ? flipBitAt(String(curr.binary), pos) : null;
      const nextHex = flipped ? hexByBinary(flipped) : null;
      hex = nextHex ? nextHex.name_jp : hex;
    }
  }
  return { hex, pos };
}

function validate() {
  const problems = [];
  const base = path.resolve(__dirname, '..', 'public', 'data');
  const chainPath = path.join(base, 'narratives_chain.v1.json');
  const linePath = path.join(base, 'narratives.v1.json');
  const chain = readJSON(chainPath);
  const lines = readJSON(linePath);

  // 1) Coverage sanity
  const chainKeys = Object.keys(chain);
  const totalExpected = 384 * 8; // 起点384 x 8パターン
  if (chainKeys.length !== totalExpected) problems.push({ kind: 'coverage', msg: `chain entries ${chainKeys.length} != expected ${totalExpected}` });

  // 2) Iterate and validate
  const tooShort = []; const tooLong = []; const emptyBody = []; const placeholders = []; const mismatchFinal = [];
  const dupSet = new Map(); const repeated = [];

  for (const k of chainKeys) {
    const v = chain[k] || {};
    const body = String(v.chain_long || '').trim();
    if (!body) emptyBody.push(k);
    if (body && body.length < 40) tooShort.push(k);
    if (body && body.length > 700) tooLong.push(k);
    if (/（執筆中）|TODO|要約|未定|\?\?\?/.test(body)) placeholders.push(k);
    // duplication check on normalized body
    const norm = body.replace(/[\s　]/g, '');
    if (norm) {
      dupSet.set(norm, (dupSet.get(norm) || 0) + 1);
    }
    // key parse and final validation
    const m = k.match(/^(.*?)\s+(初九|九二|九三|九四|九五|上六|上九|用九|用六)\s*\|\s*(JJJ|JJH|JHJ|JHH|HJJ|HJH|HHJ|HHH)$/);
    if (m) {
      const startHex = m[1]; const startPos = parsePos(m[2]); const pat = m[3];
      const last = buildFinalFromPattern(startHex, startPos, pat);
      if (v.final && (v.final.hex !== last.hex || Number(v.final.pos) !== Number(last.pos))) {
        mismatchFinal.push({ key: k, expected: last, found: v.final });
      }
    } else {
      problems.push({ kind: 'key_format', key: k, msg: 'invalid key format' });
    }
  }
  // find repeated bodies used more than N times (likelyコピー)
  for (const [norm, cnt] of dupSet.entries()) {
    if (cnt >= 4) repeated.push({ occurrences: cnt, sample: norm.slice(0, 40) + '…' });
  }

  const report = {
    summary: {
      total: chainKeys.length,
      empty: emptyBody.length,
      tooShort: tooShort.length,
      tooLong: tooLong.length,
      placeholders: placeholders.length,
      mismatchFinal: mismatchFinal.length,
      repeatedBodies4plus: repeated.length,
    },
    samples: {
      empty: emptyBody.slice(0, 20),
      tooShort: tooShort.slice(0, 20),
      tooLong: tooLong.slice(0, 10),
      placeholders: placeholders.slice(0, 20),
      mismatchFinal: mismatchFinal.slice(0, 10),
      repeated: repeated.slice(0, 20),
    }
  };
  const outPath = path.resolve(__dirname, '..', 'reports', 'narratives_chain_validation.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8');
  console.log('Validation summary:', report.summary);
  console.log('Report written:', outPath);
}

if (require.main === module) validate();
