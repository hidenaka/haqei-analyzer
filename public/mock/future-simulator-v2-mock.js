// Mock data + rendering for Future Simulator V2 layout
// This file does not depend on backends. It just paints a realistic layout.

(function () {
  const DEBUG_WARN = false;
  function isFileProtocol() {
    try { return String(location.protocol) === 'file:'; } catch(_) { return false; }
  }
  function hexToRgba(hex, alpha) {
    try {
      const h = String(hex).replace('#','');
      const r = parseInt(h.substring(0,2),16);
      const g = parseInt(h.substring(2,4),16);
      const b = parseInt(h.substring(4,6),16);
      const a = Math.max(0, Math.min(1, Number(alpha)));
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    } catch(_) { return hex; }
  }

  // Qualitative wording helpers (unify chips and sentences)
  function effectLevelToWord(level) {
    if (level === '大') return '大きめ';
    if (level === '中') return '中程度';
    if (level === '小') return '控えめ';
    return 'ふつう';
  }
  function levelToWordLR(level) { // for 負荷/リスク
    if (level === '低') return '低め';
    if (level === '中') return '中程度';
    if (level === '高') return '高め';
    return 'ふつう';
  }
  // Selection state and chart reference
  let selectedPatternId = null;
  let chartRef = null;
  // Shared patterns + style mapping
  let PATTERN_DATA = null; // computed once and reused
  const PATTERN_STYLE = new Map(); // id -> { color, faded, dash }
  // Text variant: 固定で 'plain'（読みやすい表現）
  let TEXT_VARIANT = 'plain';
  // External data cache (DB export in /public/data)
  let HEXAGRAMS_DATA = null; // raw array
  let HEX_BY_NAME = new Map(); // name_jp -> info
  
  // H384 (384爻) DB index
  let H384_INDEX = null; // key: 卦名|爻 -> row
  let H384_INDEX_NUM = null; // key: 卦番号|爻 -> row
  // Koudo Shishin plain-language source map (name -> {shin, hen})
  let KOUDO_SHISHIN_MAP = null;
  // Story narratives (authored dataset per line)
  let NARRATIVES = null; // Map key: "卦名 爻"
  // 3-phase chain narratives (authored per start+pattern)
  let CHAIN_NARRATIVES = null; // Map key: "卦名 爻 | PATTERN"
  // Full 64-hexagram dataset (King Wen order). bit order: lower-first (bottom→top), left-to-right.
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

  // Fast lookup maps and King Wen next mapping
  const NAME_TO_INDEX = new Map(MIN_HEX.map((h, i) => [h.name_jp, i]));
  const NAME_TO_NUMBER = new Map(MIN_HEX.map((h, i) => [h.name_jp, i + 1]));
  const BINARY_TO_INDEX = new Map(MIN_HEX.map((h, i) => [String(h.binary), i]));
  // ---- Mock single result ----
  const userInput = '新規事業でチームを率い、確実に成果を出したい。自分が前に立って意思決定し、周囲を巻き込みたい。';

  const single = {
    fullName: '地天泰 六五',
    hexagramName: '地天泰',
    position: 5,
    shin: '', // 後でkoudo_shishinから埋める
    hen: '',
    theme: '',
    keywords: [],
    modern: '',
    yaoci: '泰にして小往き大来たる。吉なり。',
    confidencePct: 87,
    source: 'D1',
    linesCount: 386,
  };

  // ---- Mock 8 patterns ----
  const PATTERNS = ['JJJ','JJH','JHJ','JHH','HJJ','HJH','HHJ','HHH'];
  function labelForPattern(p, startHex, finalHex) {
    const hCount = (p.match(/H/g) || []).length;
    // ベース名（ステップの構成で表現）
    const baseMap = {
      JJJ: '一貫深化',
      JJH: '二段深化→視点切替',
      JHJ: '深化→視点切替→再深化',
      JHH: '初動深化→連続切替',
      HJJ: '視点切替→二段深化',
      HJH: '視点切替→深化→再切替',
      HHJ: '連続切替→深化',
      HHH: '連続視点切替',
    };
    const base = baseMap[p] || p;
    // 最終の実態（開始と同じテーマか、再構成か）をサフィックスで補足
    const suffix = (finalHex === startHex && hCount === 0) ? '（テーマ継続）' : (finalHex === startHex ? '（再整流）' : '（構造転換）');
    return `${base} ${suffix}`;
  }

  function getBinaryByName(name) {
    const h = hexByName(name);
    return h ? String(h.binary) : '';
  }

  function readURLVariant() {
    try {
      const u = new URL(window.location.href);
      const v = u.searchParams.get('variant') || (u.searchParams.get('plain') === '1' ? 'plain' : null);
      return (v === 'plain' || v === 'classic') ? v : null;
    } catch (_) { return null; }
  }

  function getStoredVariant() {
    try { return localStorage.getItem('fsv2_text_variant'); } catch(_) { return null; }
  }

  function storeVariant(v) {
    try { localStorage.setItem('fsv2_text_variant', v); } catch(_) {}
  }

  function setTextVariant(v) { TEXT_VARIANT = 'plain'; }

  function initVariant() { setTextVariant('plain'); }

  async function loadKoudoShishin() {
    if (KOUDO_SHISHIN_MAP) return;
    KOUDO_SHISHIN_MAP = new Map();
    try {
      if (isFileProtocol()) {
        // Minimal inline fallback to avoid file:// CORS errors
        const fallback = [
          { name: '地天泰 六五', now: '安定と調和が成熟し、穏やかな繁栄を保つ段階。', shin: 'いまの強みを公正に配分し、持続させる。', hen: '扱いを変え、役割委任と循環の設計にシフト。' },
          { name: '地天泰 上六', now: '行き過ぎに注意し、過度の安心からの崩れを防ぐ局面。', shin: '過剰を避け、慎みを取り戻す。', hen: '構造を見直し、余剰を循環させる。' },
        ];
        fallback.forEach(item => KOUDO_SHISHIN_MAP.set(String(item.name).trim(), { now: item.now, shin: item.shin, hen: item.hen }));
        return;
      }
      const res = await fetch('../data/koudo_shishin.json', { cache: 'no-store' });
      if (!res.ok) return;
      const arr = await res.json();
      (arr || []).forEach(item => {
        if (!item || !item.name) return;
        KOUDO_SHISHIN_MAP.set(String(item.name).trim(), { now: item.now || '', shin: item.shin || '', hen: item.hen || '' });
      });
    } catch (_) {}
  }

  async function loadNarratives() {
    if (NARRATIVES) return;
    NARRATIVES = new Map();
    try {
      // Prefer pre-injected global
      if (typeof window !== 'undefined' && window.__NARRATIVES__ && typeof window.__NARRATIVES__ === 'object') {
        const obj = window.__NARRATIVES__;
        Object.entries(obj).forEach(([k,v]) => { if (k) NARRATIVES.set(String(k), v); });
        return;
      }
      if (isFileProtocol()) {
        // file:// 環境は生成済みJSONを相対パスでfetchできないことがあるので軽いフォールバック
        try {
          const res = await fetch('../data/narratives.v1.json');
          if (res.ok) {
            const obj = await res.json();
            Object.entries(obj).forEach(([k,v]) => { if (k) NARRATIVES.set(String(k), v); });
            return;
          }
        } catch(_) {}
      } else {
        const res = await fetch('../data/narratives.v1.json', { cache: 'no-store' });
        if (res.ok) {
          const obj = await res.json();
          Object.entries(obj).forEach(([k,v]) => { if (k) NARRATIVES.set(String(k), v); });
        }
      }
    } catch(_) {}
  }

  async function loadChainNarratives() {
    if (CHAIN_NARRATIVES) return;
    CHAIN_NARRATIVES = new Map();
    try {
      if (typeof window !== 'undefined' && window.__CHAIN_NARRATIVES__ && typeof window.__CHAIN_NARRATIVES__ === 'object') {
        const obj = window.__CHAIN_NARRATIVES__;
        Object.entries(obj).forEach(([k,v]) => { if (k) CHAIN_NARRATIVES.set(String(k), v); });
        return;
      }
      const url = '../data/narratives_chain.v1.json';
      if (isFileProtocol()) {
        try { const res = await fetch(url); if (res.ok) { const obj = await res.json(); Object.entries(obj).forEach(([k,v]) => { if (k) CHAIN_NARRATIVES.set(String(k), v); }); return; } } catch(_) {}
      } else {
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const obj = await res.json();
          Object.entries(obj).forEach(([k,v]) => { if (k) CHAIN_NARRATIVES.set(String(k), v); });
        }
      }
    } catch(_) {}
  }

  function yaoLabelFor(hexName, pos) {
    // Canonical Koudo label: 初九/初六, 九二/六二, 九三/六三, 九四/六四, 九五/六五, 上九/上六
    const bin = getBinaryByName(hexName);
    const ch = String(bin).charAt(pos - 1);
    const yang = ch === '1';
    const numList = ['初','二','三','四','五','上'];
    const num = numList[pos-1] || '';
    const yao = yang ? '九' : '六';
    if (pos === 1) return num + yao; // 初九/初六
    if (pos === 6) return num + yao; // 上九/上六
    return yao + num;               // 九二/六二 〜 九五/六五
  }

  function ensureH384Index() {
    if (H384_INDEX) return;
    // H384_DATA may be defined as a global (let) not attached to window
    let arr = [];
    try {
      if (typeof H384_DATA !== 'undefined' && Array.isArray(H384_DATA)) arr = H384_DATA;
    } catch (_) {}
    if (!arr.length && typeof window !== 'undefined' && Array.isArray(window.H384_DATA)) arr = window.H384_DATA;
    H384_INDEX = new Map();
    H384_INDEX_NUM = new Map();
    for (const row of arr) {
      if (!row || !row['卦名'] || !row['爻']) continue;
      H384_INDEX.set(`${row['卦名']}|${row['爻']}`, row);
      if (typeof row['卦番号'] === 'number') {
        H384_INDEX_NUM.set(`${row['卦番号']}|${row['爻']}`, row);
      }
    }
    // Merge plain-language overrides if provided
    try {
      const plain = (typeof H384_PLAIN !== 'undefined') ? H384_PLAIN : (window?.H384_PLAIN);
      if (plain && typeof plain === 'object') {
        for (const [idx, overrides] of Object.entries(plain)) {
          const num = parseInt(idx, 10);
          // Find row by 通し番号
          for (const r of H384_INDEX.values()) {
            if (Number(r['通し番号']) === num) {
              Object.assign(r, overrides);
              break;
            }
          }
        }
      }
    } catch (_) {}
    // Merge Koudo Shishin when available
    try {
      if (KOUDO_SHISHIN_MAP) {
        for (const r of H384_INDEX.values()) {
          const key = `${r['卦名']} ${r['爻']}`;
          const ks = KOUDO_SHISHIN_MAP.get(key);
          if (ks && !r['現代解釈の要約_plain']) {
            r['現代解釈の要約_plain'] = ks.now || ks.shin || r['現代解釈の要約_plain'];
          }
        }
      }
    } catch(_) {}
  }

  function getH384(hexName, pos) {
    ensureH384Index();
    const label = yaoLabelFor(hexName, pos);
    let hit = H384_INDEX.get(`${hexName}|${label}`);
    if (hit) return hit;
    // Try normalized variants
    const norm = hexName.replace(/澤/g, '沢').replace(/觀/g, '観').replace(/歸/g, '帰');
    if (norm !== hexName) {
      hit = H384_INDEX.get(`${norm}|${label}`);
      if (hit) return hit;
    }
    // Try by hex number
    const num = NAME_TO_NUMBER.get(hexName);
    if (num) {
      hit = H384_INDEX_NUM.get(`${num}|${label}`);
    }
    return hit;
  }

  function hexByName(name) {
    const idx = NAME_TO_INDEX.get(name);
    return (idx !== undefined) ? MIN_HEX[idx] : undefined;
  }

  function hexByBinary(bin) {
    const idx = BINARY_TO_INDEX.get(String(bin));
    return (idx !== undefined) ? MIN_HEX[idx] : undefined;
  }

  function flipBitAt(binStr, pos) {
    // pos: 1..6 (左から)
    const idx = pos - 1;
    const arr = binStr.split('');
    arr[idx] = arr[idx] === '1' ? '0' : '1';
    return arr.join('');
  }

  function nextKingWenName(currentName) {
    const idx = NAME_TO_INDEX.get(currentName);
    if (idx === undefined) return currentName;
    const next = MIN_HEX[(idx + 1) % MIN_HEX.length];
    return next.name_jp;
  }
  // Each pattern: scores across [start, p1, p2, p3]
  function buildPatterns() {
    return PATTERNS.map((p, pIdx) => {
      const route = [];
      let hex = '地天泰';
      let pos = 5;
      let score = getBaselineScore(hex, pos);
      if (!Number.isFinite(score)) {
        if (DEBUG_WARN) console.warn('[FSV2] Missing start baseline score for', hex, yaoLabelFor(hex, pos));
        score = 0;
      }
      const scores = [score];
      let topVisits = 0;
      const details = [];
      let prevHex = hex;
      let prevPos = pos;
      for (let s=0; s<3; s++) {
        const step = p[s];
        const before = { hex: hex, pos: pos, binary: getBinaryByName(hex) };
        if (step === 'J') {
          if (pos < 6) {
            pos += 1; // 通常爻: 爻位+1
          } else {
            // 上爻: 1回目は据え置き（深化）、2回目は序卦伝の次卦へ（pos=1）
            if (topVisits === 0) {
              topVisits += 1; // 据え置き
              pos = 6;
            } else {
              hex = nextKingWenName(hex);
              pos = 1;
            }
          }
        } else {
          // 変爻: その爻の陰陽反転（posはそのまま）
          const curr = hexByName(hex);
          const flipped = curr ? flipBitAt(String(curr.binary), pos) : null;
          const nextHex = flipped ? hexByBinary(flipped) : null;
          hex = nextHex?.name_jp || hex;
        }
        route.push({ hex, pos });

        const after = { hex: hex, pos: pos, binary: getBinaryByName(hex) };
        const isAdvance = step === 'J';
        const themeShift = isAdvance ? ((before.pos === 6 && after.pos === 1 && before.hex !== after.hex) ? 'structural' : 'none') : 'reframe';
        // Use DB baseline for score after each phase
        let afterBase = getBaselineScore(after.hex, after.pos);
        if (!Number.isFinite(afterBase)) {
          if (DEBUG_WARN) console.warn('[FSV2] Missing baseline score for', after.hex, yaoLabelFor(after.hex, after.pos), 'carrying forward previous score');
          afterBase = scores[s];
        }
        scores[s+1] = afterBase;
        score = afterBase;
        const scoreDelta = scores[s+1] - scores[s];
        const actionLabel = isAdvance ? '進爻' : '変爻';
        // DB-driven narratives
        const bRow = getH384(before.hex, before.pos);
        const aRow = getH384(after.hex, after.pos);
        const bKw = new Set((bRow?.['キーワード'] || []).map(String));
        const aKw = new Set((aRow?.['キーワード'] || []).map(String));
        const added = [...aKw].filter(k => !bKw.has(k));
        const removed = [...bKw].filter(k => !aKw.has(k));
        let summary = `${before.hex} ${yaoLabelFor(before.hex, before.pos)} → ${after.hex} ${yaoLabelFor(after.hex, after.pos)}（${themeShift==='structural'?'章替え': themeShift==='reframe'?'転換':'継続'}）`;
        let narrative;
        const sameNode = before.hex === after.hex && before.pos === after.pos;
        if (sameNode) {
          // 据え置き深化（同一点での最適化）
          const metrics = [];
          if (typeof aRow?.['S3_安定性スコア'] === 'number') metrics.push(`安定性 ${aRow['S3_安定性スコア']}`);
          if (typeof aRow?.['S6_変動性スコア'] === 'number') metrics.push(`変動性 ${aRow['S6_変動性スコア']}`);
          if (typeof aRow?.['S2_ポテンシャル'] === 'number') metrics.push(`ポテンシャル ${aRow['S2_ポテンシャル']}`);
          summary = `${before.hex} ${yaoLabelFor(before.hex, before.pos)}（据え置き・精緻化）`;
          narrative = [
            aRow?.['現代解釈の要約'] || '',
            metrics.length ? `注目指標: ${metrics.join(' / ')}` : ''
          ].filter(Boolean).join(' / ');
        } else {
          narrative = [
            aRow?.['現代解釈の要約'] || '',
            added.length ? `新たに強まる: ${added.join('・')}` : '',
            removed.length ? `弱まる: ${removed.join('・')}` : ''
          ].filter(Boolean).join(' / ');
        }
        const risks = [];
        const opportunities = [];
        const riskLevel = (aRow && typeof aRow['S4_リスク'] === 'number') ? aRow['S4_リスク'] : 0;
        const stance = aRow?.['S5_主体性推奨スタンス'] || '';
        if (stance) opportunities.push(`推奨スタンス: ${stance}`);
        if (riskLevel) opportunities.push(`リスク傾向: ${Math.abs(riskLevel) >= 55 ? '高' : Math.abs(riskLevel) >= 35 ? '中' : '低'}`);
        details.push({
          phase: s+1,
          action: isAdvance ? 'advance' : 'transform',
          before,
          after,
          delta: { pos: after.pos - before.pos, themeShift },
          scoreDelta,
          summary,
          narrative,
          risks,
          opportunities,
          actionLabel,
        });
        prevHex = hex; prevPos = pos;
      }
    const patterns = {
      id: p,
      get label() { return labelForPattern(p, '地天泰', route[route.length-1]?.hex || ''); },
      route: [{hex:'地天泰', pos:5}, ...route],
      scores,
      details,
      // Avoid referencing undefined label map; set later from computed label
      final: { name: '', summary: 'パターンに応じた到達点のイメージ' }
      };
    // final.name もダサい記号は避け、ラベル由来に
    patterns.final.name = `${patterns.label}（最終）`;
    // Compute narrative chain and metrics
    const chain = computeNarrativeChain(patterns);
    const metrics = computePatternMetrics(patterns);
    patterns.narrativeChain = chain.chain;
    patterns.headline = chain.headline;
    patterns.metrics = metrics;
    return patterns;
  });
  }

  function pickConnector(kind, phase) {
    if (phase === 2) {
      return kind === 'structural' ? '章が切り替わり、' : kind === 'reframe' ? '視点が変わり、' : 'そのまま、';
    }
    if (phase === 3) {
      return kind === 'structural' ? '最終盤で章が切り替わり、' : kind === 'reframe' ? '最終盤で視点が変わり、' : '最終的に、';
    }
    return '';
  }

  function shrink(text, maxLen=28) {
    const t = String(text||'').replace(/[。\.]/g,'、');
    return t.length <= maxLen ? t : (t.slice(0, maxLen-1) + '…');
  }

  function getRowText(row, key) {
    if (!row) return '';
    if (TEXT_VARIANT === 'plain' && row[`${key}_plain`]) return row[`${key}_plain`];
    return row[key] || '';
  }

  function getKoudoTexts(hex, pos) {
    // Try robust keying: H384 row label優先 → 計算ラベル → 正規化
    if (!KOUDO_SHISHIN_MAP) return null;
    try {
      const row = getH384(hex, pos);
      if (row && row['卦名'] && row['爻']) {
        const k1 = `${row['卦名']} ${row['爻']}`;
        const hit1 = KOUDO_SHISHIN_MAP.get(k1);
        if (hit1) return hit1;
      }
    } catch(_) {}
    try {
      const raw = `${hex} ${yaoLabelFor(hex, pos)}`;
      const hit2 = KOUDO_SHISHIN_MAP.get(raw);
      if (hit2) return hit2;
      // normalize variants（沢/澤など）
      const normHex = String(hex).replace(/澤/g,'沢').replace(/觀/g,'観').replace(/歸/g,'帰');
      const k3 = `${normHex} ${yaoLabelFor(hex, pos)}`;
      const hit3 = KOUDO_SHISHIN_MAP.get(k3);
      if (hit3) return hit3;
    } catch(_) {}
    return null;
  }

  function getPreferredText(hex, pos) {
    // Prefer Koudo now → Koudo shin → H384 plain/classic
    try {
      const ks = getKoudoTexts(hex, pos);
      if (ks && ks.now) return String(ks.now);
      if (ks && ks.shin) return String(ks.shin);
      const row = getH384(hex, pos);
      if (row) return getRowText(row, '現代解釈の要約');
    } catch (_) {}
    return '';
  }

  function getKoudoShinHen(hex, pos, isAdvance) {
    try {
      // Prefer authored narrative if available
      const key = `${hex} ${yaoLabelFor(hex, pos)}`;
      const nv = NARRATIVES?.get(key);
      if (nv && (nv.long || nv.short)) {
        return String(nv.long || nv.short);
      }
      const ks = getKoudoTexts(hex, pos);
      if (ks) {
        const primary = isAdvance ? ks.shin : ks.hen;
        if (primary) return String(primary);
        const fallbackPair = isAdvance ? ks.hen : ks.shin;
        if (fallbackPair) return String(fallbackPair);
      }
      // 最後の手段としてH384説明で埋める（空白を避ける）
      const row = getH384(hex, pos);
      if (row) return getRowText(row, '現代解釈の要約');
    } catch (_) {}
    return '（執筆中）';
  }

  function firstSentence(text) {
    const t = String(text || '').trim();
    if (!t) return '';
    const idx = t.indexOf('。');
    if (idx === -1) return t;
    return t.slice(0, idx + 1);
  }

  function computeNarrativeChain(p) {
    // Prefer authored chain narrative if available
    try {
      const start = p.route[0];
      const yao = yaoLabelFor(start.hex, start.pos);
      const key = `${start.hex} ${yao} | ${p.id}`;
      const authored = CHAIN_NARRATIVES?.get(key);
      if (authored && authored.chain_long) {
        const headBase = `${start.hex}→${p.route[3].hex}`;
        const headline = shrink(`${headBase}: ${firstSentence(authored.chain_long)}`);
        return { chain: String(authored.chain_long), headline };
      }
    } catch(_) {}
    const parts = [];
    const d0 = p.details[0];
    const d1 = p.details[1];
    const d2 = p.details[2];
    function ensurePeriod(s) {
      const t = String(s || '').trim();
      if (!t) return '';
      return /[。.]$/.test(t) ? t : (t + '。');
    }
    function stripLeadingConnector(s) {
      let t = String(s || '').trim();
      t = t.replace(/^(まず|次に|そして|最後に|最終的に|そこで|ここで|一方で|やがて|その後|さらに|また|観点を切り替え|章が切り替わり)[、,]\s*/u, '');
      return t;
    }
    function connectorFor(shift, phase) {
      if (phase === 1) return 'まず、';
      if (phase === 2) {
        if (shift === 'structural') return 'そこで章が切り替わり、';
        if (shift === 'reframe') return 'そこで観点を切り替え、';
        return '続いて、';
      }
      if (phase === 3) {
        if (shift === 'structural') return '最後に章が切り替わり、';
        if (shift === 'reframe') return '最後は観点を変え、';
        return '最後に、';
      }
      return '';
    }
    function phaseText(d, phaseIndex) {
      if (!d) return '';
      const isAdvance = d.action === 'advance';
      let txt = getKoudoShinHen(d.after.hex, d.after.pos, isAdvance);
      // 補強: Koudo/H384が空や占位なら、詳細のnarrativeや汎用表現で補う
      const isPlaceholder = !txt || /執筆中/.test(String(txt));
      if (isPlaceholder) {
        if (d.narrative) {
          txt = firstSentence(d.narrative);
        } else {
          const shift = d.delta?.themeShift === 'structural' ? '章が切り替わり' : (d.delta?.themeShift === 'reframe' ? '視点が変わり' : 'そのまま');
          const act = isAdvance ? '深めて' : '扱いを変えて';
          txt = `${shift}、${d.after.hex} ${d.after.pos}爻の要点に沿って${act}進みます`;
        }
      }
      return String(txt || '').trim();
    }
    const raw0 = phaseText(d0, 1);
    const raw1 = phaseText(d1, 2);
    const raw2 = phaseText(d2, 3);
    const t0 = stripLeadingConnector(raw0);
    const t1 = stripLeadingConnector(raw1);
    const t2 = stripLeadingConnector(raw2);
    const seen = new Set();
    if (t0) {
      const c = connectorFor(p.details[0]?.delta?.themeShift, 1);
      const s = ensurePeriod(t0);
      parts.push(c + s.replace(/。$/, '。'));
      seen.add(t0);
    }
    if (t1 && !seen.has(t1)) {
      const c = connectorFor(p.details[1]?.delta?.themeShift, 2);
      parts.push(c + ensurePeriod(t1));
      seen.add(t1);
    }
    if (t2 && !seen.has(t2)) {
      const c = connectorFor(p.details[2]?.delta?.themeShift, 3);
      parts.push(c + ensurePeriod(t2));
      seen.add(t2);
    }
    let chain = parts.join('');
    // 最低限のフォールバック（全て空のとき）
    if (!chain) {
      const start = p.route[0]; const last = p.route[3];
      chain = `${start.hex}から始まり、段階的に${last.hex}へ到達します。テーマの深化と視点の転換を適切に織り交ぜる流れです。`;
    }
    const start = p.route[0]; const last = p.route[3];
    // まとめの「結論/向く状況/注意点」を付与
    const startScore = (Array.isArray(p.scores) && typeof p.scores[0] === 'number') ? p.scores[0] : null;
    const finalScore = (Array.isArray(p.scores) && typeof p.scores[3] === 'number') ? p.scores[3] : null;
    const delta = (finalScore != null && startScore != null) ? finalScore - startScore : null;
    const structuralCount = (p.details || []).filter(d => d.delta?.themeShift === 'structural').length;
    const reframeCount = (p.details || []).filter(d => d.delta?.themeShift === 'reframe').length;
    const hasStructural = structuralCount > 0;
    const hasReframe = reframeCount > 0;
    const suit = hasStructural
      ? '大きな転換期や新章への移行に向きます'
      : hasReframe
        ? '視点や運用の切替でブレイクスルーを狙う場面に向きます'
        : '現状の強みを着実に伸ばしたい場面に向きます';
    const caution = hasStructural
      ? '関係者調整や移行時の負荷・リスク管理に留意してください'
      : hasReframe
        ? '意図の共有と合意形成（巻き込み）を先に整えるとスムーズです'
        : '安定が続く局面では慢心や固定化に注意してください';
    // 結論の数値は省略し、適用場面と注意点のみを提示
    chain = `${chain}${suit}。注意点：${caution}。`;
    const headBase = `${start.hex}→${last.hex}`;
    const headTail = [t2, t1, t0].find(v => v && !/執筆中/.test(String(v))) || '段階的に最適化';
    const headline = shrink(`${headBase}: ${firstSentence(headTail)}`);
    return { chain, headline };
  }

  function levelFrom(value, tLow, tHigh) {
    if (!Number.isFinite(value)) return '—';
    if (value >= tHigh) return '高';
    if (value >= tLow) return '中';
    return '低';
  }

  function computePatternMetrics(p) {
    const start = p.scores[0];
    const final = p.scores[3];
    const delta = (Number.isFinite(final) && Number.isFinite(start)) ? (final - start) : 0;
    // 負荷: 章替え(構造転換)回数 + H回数 + S6平均
    const structuralCount = p.details.filter(d => d.delta?.themeShift === 'structural').length;
    const hCount = p.id.split('').filter(c => c === 'H').length;
    const rows = p.details.map(d => getH384(d.after.hex, d.after.pos));
    const s6Values = rows.map(r => (typeof r?.['S6_変動性スコア'] === 'number') ? r['S6_変動性スコア'] : 0);
    const s6Avg = s6Values.reduce((a,b)=>a+b,0) / (s6Values.length||1);
    const loadScore = structuralCount*2 + hCount*1 + (s6Avg/50); // 粗い合成
    const loadLevel = levelFrom(loadScore, 1.5, 3.0);
    // リスク: S4の最大
    const s4Values = rows.map(r => (typeof r?.['S4_リスク'] === 'number') ? Math.abs(r['S4_リスク']) : 0);
    const s4Max = Math.max(...s4Values, 0);
    const riskLevel = levelFrom(s4Max, 35, 55);
    // 成果: Δ基礎スコア → 大/中/小（閾値はデータ分布で調整）
    const effLevel = delta >= 20 ? '大' : (delta >= 8 ? '中' : (delta >= 0 ? '小' : '負'));
    return { effectDelta: delta, effectLevel: effLevel, loadLevel, riskLevel };
  }

  function computePatternStyles(patterns) {
    // Blue-centric, harmonious palette aligned with unified design
    const palette = [
      '#1d4ed8', // blue-700
      '#3b82f6', // blue-500
      '#60a5fa', // blue-400
      '#93c5fd', // blue-300
      '#0ea5e9', // sky-500
      '#06b6d4', // cyan-500
      '#6366f1', // indigo-500
      '#8b5cf6', // violet-500
    ];
    const dashes = [[], [6,4], [2,3], [8,4,2,4], [1,6], [8,2], [4,2,4,2], [2,2,2,2]];
    patterns.forEach((p, i) => {
      const color = palette[i % palette.length];
      const dash = dashes[i % dashes.length];
      const faded = color + '40'; // 25% alpha
      PATTERN_STYLE.set(p.id, { color, faded, dash });
    });
  }

  // ---- Render Single ----
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = String(text ?? '').trim();
  }

  async function hydrateFromKoudoShishin() {
    // 乾為天 九五（実データの具体文）
    single.shin = 'リーダーシップが最高潮に達している絶頂期です。このテーマを深めることは、その力を驕ることなく、公明正大に使い続けること。その徳高い姿勢が、次のステージ（上九）で陥りがちな「行き過ぎによる後悔」を避けるための、唯一のブレーキとなります。';
    // 転換視点（hen）は、後段で現在テーマの“扱いを変える”という実務的説明として生成する
    single.hen  = '';
  }

  function uniq(arr) {
    return Array.from(new Set(arr.filter(Boolean).map(s => String(s).trim())));
  }

  function extractKeywordsFromText(txt) {
    if (!txt) return [];
    // 簡易抽出: 全角カンマ・読点・空白で分割して2文字以上を拾う
    return txt.split(/[、，,。\s]+/).filter(w => w && w.length >= 2);
  }

  function buildChangePlain(theme, keywords, transHint) {
    // ユーザーに分かる言葉で、いまのテーマ/キーワードの“扱い”を意図的に変えることを説明する
    const base = (keywords || []).slice(0, 5).join('・') || '現在の強み';
    const moves = [
      '自分が前に出る比率を減らし、判断や役割を“任せる（委ねる）”',
      '成果や資源を“分ける（循環させる）”方向に配分する',
      '意志で押すのではなく“仕組み”にのせて運用する（透明なルール・定例・可視化）'
    ];
    const hint = transHint ? `（ヒント）${transHint}` : '';
    const respect = '（伝統注釈：古典ではこの転換を別の視点に対応づけて語りますが、ここでは実務の言葉で示しています）';
    return `今のテーマ/キーワード（例：${base}）の“扱い”を意図的に変えることで転換します。具体的には、${moves.join('。')}。${hint} ${respect}`;
  }

  async function hydrateFromEnhanced() {
    // 乾為天 九五（enhanced の該当爻）
    const lineText = '飛龍在天，利見大人';
    const meaning = '龍が天に飛ぶ、最高の活躍時期';
    const trait = 'リーダーシップの完全開花';
    const trans = '最高位での影響力発揮';
    const hexKeywords = ['創造', 'リーダーシップ', '力', '自強不息'];
    const desc2 = 'あなたの心の奥底には、天を翔ける龍のような壮大なエネルギーが宿っています。新しい道を切り開き、人々を導くことに最も価値を見出すあなたは、生まれながらのリーダーです。';
    const personalityApp = 'リーダーシップと継続的な成長への責任感';
    const guidance = '天の道に倣い、持続的な自己向上に努める';

    single.theme = [lineText, meaning, trait].filter(Boolean).join(' / ');
    const extraKw = extractKeywordsFromText(`${meaning} ${trait}`);
    single.keywords = uniq([...hexKeywords, ...extraKw]).slice(0, 8);
    single.modern = [single.shin, desc2, personalityApp, guidance].filter(Boolean).join(' / ');
    // 転換視点は「次のテーマを先取り」せず、いまのテーマ/キーワードの扱いを変える説明にする
    single.hen = buildChangePlain(single.theme, single.keywords, trans);
  }

  async function loadHexagramsData() {
    if (HEXAGRAMS_DATA && HEX_BY_NAME.size) return;
    if (typeof window !== 'undefined' && Array.isArray(window.HEXAGRAMS)) {
      HEXAGRAMS_DATA = window.HEXAGRAMS;
    } else {
      try {
        if (isFileProtocol()) {
          // Minimal inline fallback to avoid file:// CORS errors
          HEXAGRAMS_DATA = [
            { name_jp: '地天泰', catchphrase: '異なる要素を調和させる、平和を愛する調整役', description: '調和・安定・繁栄を呼ぶバランサー', keywords: '平和,繁栄,調和' },
            { name_jp: '天地否', catchphrase: '自分の内なる世界を深く追求する思想家', description: '閉塞の中で内省を深める時期', keywords: '閉塞,不調和,停滞' }
          ];
        } else {
          const res = await fetch('../data/hexagrams.json', { cache: 'no-store' });
          if (res.ok) HEXAGRAMS_DATA = await res.json();
        }
      } catch (_) {
        HEXAGRAMS_DATA = [];
      }
    }
    HEX_BY_NAME.clear();
    (HEXAGRAMS_DATA || []).forEach(h => { if (h && h.name_jp) HEX_BY_NAME.set(h.name_jp, h); });
  }

  function getBaselineScore(hexName, pos) {
    // Use only H384_DATA (S1_基本スコア). No mock fallback values.
    const h384 = getH384(hexName, pos);
    if (h384 && typeof h384['S1_基本スコア'] === 'number') return h384['S1_基本スコア'];
    return NaN;
  }

  function renderLongText(id, text) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = '';
    const parts = String(text||'').split(/[。\.]/).filter(Boolean);
    parts.forEach((seg) => {
      const p = document.createElement('p');
      p.textContent = seg + '。';
      el.appendChild(p);
    });
  }

  async function loadHexagramsData() {
    if (HEXAGRAMS_DATA && HEX_BY_NAME.size) return;
    // Prefer pre-injected global (e.g., window.HEXAGRAMS) to support file:// usage
    if (typeof window !== 'undefined' && Array.isArray(window.HEXAGRAMS)) {
      HEXAGRAMS_DATA = window.HEXAGRAMS;
    } else {
      try {
        if (isFileProtocol()) {
          HEXAGRAMS_DATA = [
            { name_jp: '地天泰', catchphrase: '異なる要素を調和させる、平和を愛する調整役', description: '調和・安定・繁栄を呼ぶバランサー', keywords: '平和,繁栄,調和' },
            { name_jp: '天地否', catchphrase: '自分の内なる世界を深く追求する思想家', description: '閉塞の中で内省を深める時期', keywords: '閉塞,不調和,停滞' }
          ];
        } else {
          const res = await fetch('../data/hexagrams.json', { cache: 'no-store' });
          if (res.ok) {
            HEXAGRAMS_DATA = await res.json();
          }
        }
      } catch (_) {
        // Fallback: minimal fields for common hexagrams when fetch is unavailable (file://)
        HEXAGRAMS_DATA = [
          { name_jp: '地天泰', catchphrase: '異なる要素を調和させる、平和を愛する調整役', description: '調和・安定・繁栄を呼ぶバランサー', keywords: '平和,繁栄,調和' },
          { name_jp: '天地否', catchphrase: '自分の内なる世界を深く追求する思想家', description: '閉塞の中で内省を深める時期', keywords: '閉塞,不調和,停滞' }
        ];
      }
    }
    HEX_BY_NAME.clear();
    (HEXAGRAMS_DATA || []).forEach(h => { if (h && h.name_jp) HEX_BY_NAME.set(h.name_jp, h); });
  }

  async function renderSingle() {
    await hydrateFromKoudoShishin();
    await hydrateFromEnhanced();
    // Koudo 'now' のみ使用（未執筆時は保持）
    try {
      const ks = getKoudoTexts(single.hexagramName, single.position);
      if (ks && ks.now) single.modern = ks.now;
    } catch(_) {}
    setText('fsv2-usertext', userInput);
    setText('fsv2-name', single.fullName);
    setText('fsv2-hex', `${single.hexagramName} ${single.position}爻`);
    renderLongText('fsv2-modern', single.modern);
    renderLongText('fsv2-theme', single.theme);
    renderLongText('fsv2-keywords', single.keywords.join('、'));
    renderLongText('fsv2-shin', single.shin);
    renderLongText('fsv2-hen', single.hen);
    setText('fsv2-yaoci', single.yaoci);
    setText('fsv2-conf', `${single.confidencePct}%`);
    const badgeHost = document.getElementById('fsv2-badges');
    if (badgeHost) {
      const b1 = document.createElement('span'); b1.className='badge'; b1.textContent = `データ: ${single.linesCount}行`;
      badgeHost.appendChild(b1);
    }
  }

  // ---- Render Chart ----
  function renderChart() {
    const ctx = document.getElementById('fsv2-linechart').getContext('2d');
    const patterns = PATTERN_DATA || buildPatterns();
    if (!window.Chart) {
      const st = document.getElementById('mock-status');
      if (st) st.textContent = '⚠️ Chart.jsが読み込まれていません。';
      return;
    }
    const datasets = patterns.map((p, i) => {
      const style = PATTERN_STYLE.get(p.id) || { color: '#888', faded: '#8884', dash: [] };
      return {
        label: p.label,
        data: p.scores,
        borderColor: style.color,
        pointBackgroundColor: style.color,
        backgroundColor: 'transparent',
        tension: 0.35,
        pointRadius: 3,
        pointHoverRadius: 5,
        hitRadius: 12,
        borderWidth: 2,
        borderDash: style.dash,
        // custom fields for highlighting
        _id: p.id,
        _color: style.color,
        _faded: style.faded,
        fill: false,
        order: i,
      };
    });
    try { console.log('[FSV2] Pattern scores (DB baseline):', patterns.map(p => ({ id: p.id, route: p.route.map(r=>`${r.hex}${r.pos}`), scores: p.scores }))); } catch (_) {}
    // Dynamic Y max based on data
    const allVals = patterns.flatMap(p => p.scores).filter(v => typeof v === 'number' && isFinite(v));
    const maxVal = allVals.length ? Math.max(...allVals) : 100;
    const yMax = Math.max(10, Math.ceil((maxVal + 5) / 10) * 10);

    chartRef = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['起点', 'Phase 1', 'Phase 2', 'Phase 3'],
        datasets
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: '#334155', // slate-700
              font: { size: 12, weight: '500' },
              boxWidth: 12,
            }
          },
          tooltip: {
            backgroundColor: 'rgba(255,255,255,0.96)',
            titleColor: '#0f172a',
            bodyColor: '#0f172a',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            padding: 10,
            displayColors: true,
            boxPadding: 4,
          }
        },
        scales: {
          x: {
            ticks: { color: '#64748b', font: { size: 12 } }, // slate-500
            grid: { color: '#e5e7eb' }, // gray-200
            title: { display: false },
          },
          y: {
            beginAtZero: true,
            min: 0, max: yMax,
            ticks: { color: '#64748b', font: { size: 12 } },
            grid: { color: '#e5e7eb' },
          },
        }
      }
    });
  }

  // ---- Featured (Top 3 recommendations) ----
  function renderFeatured() {
    const host = document.getElementById('fsv2-featured');
    if (!host) return;
    const patterns = (PATTERN_DATA && Array.isArray(PATTERN_DATA) ? PATTERN_DATA : buildPatterns()).slice();
    // Ensure styles/metrics exist
    patterns.forEach((p) => {
      if (!p.metrics) p.metrics = computePatternMetrics(p);
      if (!PATTERN_STYLE.get(p.id)) {
        // fallback: assign a basic style if missing
        PATTERN_STYLE.set(p.id, { color: '#3b82f6', faded: '#3b82f640', dash: [] });
      }
    });
    // Sort by 効果Δ 降順 → リスク 低 → 負荷 低
    const levelRank = { '大': 3, '中': 2, '小': 1, '負': 0 };
    const effectRank = (p) => levelRank[p.metrics?.effectLevel] ?? 0;
    const lv = (s) => s === '低' ? 0 : s === '中' ? 1 : s === '高' ? 2 : 3;
    patterns.sort((a, b) => {
      const dv = (b.metrics?.effectDelta ?? -1) - (a.metrics?.effectDelta ?? -1);
      if (dv !== 0) return dv;
      const el = (effectRank(b) - effectRank(a)); if (el !== 0) return el;
      const rr = lv(a.metrics?.riskLevel) - lv(b.metrics?.riskLevel); if (rr !== 0) return rr;
      return lv(a.metrics?.loadLevel) - lv(b.metrics?.loadLevel);
    });
    const top3 = patterns.slice(0, 3);
    // Assign distinct roles based on metrics (not position): 攻め/安定/バランス
    function levelToNum(s) { return s === '低' ? 0 : s === '中' ? 1 : s === '高' ? 2 : 1; }
    function effectToNum(s) { return s === '大' ? 3 : s === '中' ? 2 : s === '小' ? 1 : 0; }
    function scoreForAttack(p) {
      const d = Number(p.metrics?.effectDelta ?? 0);
      return effectToNum(p.metrics?.effectLevel) * 100 + d; // prioritize level, then delta
    }
    function scoreForDefense(p) {
      // lower is better (risk, then load)
      return levelToNum(p.metrics?.riskLevel) * 10 + levelToNum(p.metrics?.loadLevel);
    }
    // Determine unique roles
    const attackPick = [...top3].sort((a,b)=>scoreForAttack(b)-scoreForAttack(a))[0];
    const defensePick = [...top3].sort((a,b)=>scoreForDefense(a)-scoreForDefense(b)).find(p=>p!==attackPick) || top3[0];
    const balancePick = top3.find(p=>p!==attackPick && p!==defensePick) || top3[2];
    const roleOf = new Map([[attackPick,'攻め'],[defensePick,'安定'],[balancePick,'バランス']]);
    host.innerHTML = '';
    top3.forEach((p, i) => {
      const style = PATTERN_STYLE.get(p.id) || { color: '#3b82f6' };
      const card = document.createElement('div');
      card.className = 'card';

      // Header with color swatch and label
      const head = document.createElement('div'); head.className = 'card-header';
      const title = document.createElement('div'); title.className = 'card-title';
      const sw = document.createElement('span');
      sw.style.cssText = `display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:8px;background:${style.color}`;
      const ttl = document.createElement('span'); ttl.textContent = p.label || `パターン ${p.id}`;
      title.appendChild(sw); title.appendChild(ttl); head.appendChild(title); card.appendChild(head);

      // Body with at-a-glance row, role-based summary, chips and suitability
      const body = document.createElement('div'); body.className = 'card-body';
      const start = p.route[0];
      const last = p.route[3];

      // At-a-glance: 期待値/最終到達/総評
      const glance = document.createElement('div'); glance.style.display='grid'; glance.style.gridTemplateColumns='1fr'; glance.style.gap='6px'; glance.style.marginBottom='6px';
      // 期待（質的表現）
      const delta = Number(p.metrics?.effectDelta ?? 0);
      const deltaChip = document.createElement('span');
      deltaChip.className = 'badge2';
      function deltaToWord(d){
        if (d >= 15) return 'かなり高め';
        if (d >= 6) return '高め';
        if (d >= 1) return 'やや高め';
        if (d <= -8) return '慎重';
        if (d <= -1) return '控えめ';
        return 'ふつう';
      }
      const word = deltaToWord(delta);
      let col = '#475569'; if (/高め/.test(word)) col = '#16a34a'; if (/慎重|控えめ/.test(word)) col = '#ef4444';
      deltaChip.style.borderColor = col; deltaChip.style.color = col;
      deltaChip.textContent = `期待: ${word} / 成果:${effectLevelToWord(p.metrics?.effectLevel)}`;

      const finalLine = document.createElement('div'); finalLine.className = 'muted2';
      finalLine.textContent = `最終: ${last.hex} ${last.pos}爻`;

      // Overall quick tag
      const risk = p.metrics?.riskLevel; const load = p.metrics?.loadLevel;
      const role = roleOf.get(p) || 'バランス';
      const overall = document.createElement('span'); overall.className = 'badge2';
      let tag = role; let color = role==='攻め' ? '#2563eb' : role==='安定' ? '#10b981' : '#3b82f6';
      overall.style.borderColor = color; overall.style.color = color; overall.textContent = tag;

      const headWrap = document.createElement('div'); headWrap.style.display='flex'; headWrap.style.gap='6px'; headWrap.style.flexWrap='wrap';
      headWrap.appendChild(deltaChip); headWrap.appendChild(overall);
      glance.appendChild(headWrap);
      glance.appendChild(finalLine);
      body.appendChild(glance);

      // Summary (role-based, semantically distinct)
      function buildSummaryByRole(p, role) {
        const counts = { cont:0, ref:0, struct:0 };
        (p.details||[]).forEach(d=>{ if (d?.delta?.themeShift==='reframe') counts.ref++; else if (d?.delta?.themeShift==='structural') counts.struct++; else counts.cont++; });
      const eff = p.metrics?.effectLevel;
      const delta = Number(p.metrics?.effectDelta ?? 0);
      const word = deltaToWord(delta);
      if (role === '攻め') {
          return `短期に伸ばす一手。期待は${word}（成果:${effectLevelToWord(eff)}）。切替${counts.ref}や章替え${counts.struct}でブレイクスルーを狙う。`;
      } else if (role === '安定') {
          const risk = p.metrics?.riskLevel; const load = p.metrics?.loadLevel;
          return `安心運用の本命。負荷は${levelToWordLR(load)}・リスクは${levelToWordLR(risk)}。継続${counts.cont}中心で馴染ませやすい。`;
      } else {
          const risk = p.metrics?.riskLevel; const load = p.metrics?.loadLevel;
          return `攻守の均衡。期待は${word}。負荷${levelToWordLR(load)}・リスク${levelToWordLR(risk)}で、継続/転換/章替えの配合により無理なく前進。`;
      }
      }
      const summaryEl = document.createElement('div'); summaryEl.className = 'muted2'; summaryEl.textContent = buildSummaryByRole(p, role);
      body.appendChild(summaryEl);

      // Metrics chips
      const chips = document.createElement('div'); chips.className = 'badges';
      const c1 = document.createElement('span'); c1.className = 'badge2'; c1.textContent = `📈 成果: ${effectLevelToWord(p.metrics?.effectLevel)}`;
      const c2 = document.createElement('span'); c2.className = 'badge2'; c2.textContent = `🧭 負荷: ${levelToWordLR(p.metrics?.loadLevel)}`;
      const c3 = document.createElement('span'); c3.className = 'badge2'; c3.textContent = `⚠️ リスク: ${levelToWordLR(p.metrics?.riskLevel)}`;
      chips.appendChild(c1); chips.appendChild(c2); chips.appendChild(c3);
      body.appendChild(chips);

      // Evidence (ユーザー語での理由付け)
      try {
        const counts = { cont:0, ref:0, struct:0 };
        (p.details||[]).forEach(d=>{ if (d?.delta?.themeShift==='reframe') counts.ref++; else if (d?.delta?.themeShift==='structural') counts.struct++; else counts.cont++; });
        const risk = p.metrics?.riskLevel; const load = p.metrics?.loadLevel; const eff = p.metrics?.effectLevel;
        function reasonForEffect() {
          if (eff === '大') return '打ち手がはっきりしており、成果に結びつきやすい構成です';
          if (eff === '中') return '積み上げと見直しの両方で、着実に伸ばせます';
          if (eff === '小') return '小さな前進を重ねる前提で、無理なく進められます';
          return '現状から無理のない伸びを狙います';
        }
        function reasonForLoad() {
          const change = counts.struct + counts.ref;
          if (change >= 3) return 'やり方や関係の組み替えが必要です（合意形成を先に）';
          if (change >= 1) return 'いくつかの見直しが必要です（段取りを小さく刻むとスムーズ）';
          return '現状の型を活かしつつ調整中心で進められます';
        }
        function reasonForRisk() {
          if (risk === '低') return '現場調整で吸収できる範囲の不確実性です';
          if (risk === '中') return '事前の合意と段取りで十分にカバーできます';
          if (risk === '高') return '利害調整と検証の手当てを前提に計画しましょう';
          return '不確実性は状況に応じて管理可能です';
        }
        const ev = document.createElement('div'); ev.className = 'muted2'; ev.style.marginTop = '6px';
        ev.textContent = `理由: ${reasonForEffect()} / ${reasonForLoad()} / ${reasonForRisk()}`;
        body.appendChild(ev);
      } catch(_) {}

      // Suitability (if authored chain exists) — avoid duplicate when variant used
      try {
        const key = `${start.hex} ${yaoLabelFor(start.hex, start.pos)} | ${p.id}`;
        const authored = CHAIN_NARRATIVES?.get(key);
        if (authored && authored.suitability && role !== '安定') {
          const suit = document.createElement('div'); suit.className = 'muted2'; suit.textContent = `適する場面: ${authored.suitability}`;
          body.appendChild(suit);
        }
      } catch(_) {}
      card.appendChild(body);

      // Footer with CTA
      const footer = document.createElement('div'); footer.className = 'card-footer';
      const btn = document.createElement('button'); btn.className = 'btn btn-primary btn-sm'; btn.textContent = '詳細を見る';
      btn.addEventListener('click', (e) => { e.stopPropagation(); openModalForPattern(p); });
      footer.appendChild(btn);
      card.appendChild(footer);

      // Hover highlight ties to chart
      card.addEventListener('mouseenter', () => updateChartHighlight(p.id));
      card.addEventListener('mouseleave', () => updateChartHighlight(null));
      card.addEventListener('click', () => openModalForPattern(p));

      host.appendChild(card);
    });
  }

  function updateChartHighlight(id) {
    selectedPatternId = id || null;
    if (!chartRef) return;
    chartRef.data.datasets.forEach((ds) => {
      const isSel = id && ds._id === id;
      if (!id) {
        ds.borderColor = ds._color;
        ds.pointRadius = 3;
        ds.borderWidth = 2;
        ds.fill = false;
        ds.backgroundColor = 'transparent';
      } else if (isSel) {
        ds.borderColor = ds._color;
        ds.pointRadius = 5;
        ds.borderWidth = 3;
        ds.fill = true;
        ds.backgroundColor = hexToRgba(ds._color, 0.12);
      } else {
        ds.borderColor = ds._faded;
        ds.pointRadius = 2;
        ds.borderWidth = 1;
        ds.fill = false;
        ds.backgroundColor = 'transparent';
      }
    });
    chartRef.update('none');
  }

  // ---- Render 8 Cards ----
  function renderPatterns() {
    const host = document.getElementById('fsv2-patterns');
    if (!host) return;
    const patterns = PATTERN_DATA || buildPatterns();
    host.innerHTML = '';
    const st = document.getElementById('mock-status');
    if (st) st.textContent = `描画準備: パターン数=${patterns.length}`;
    patterns.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `${p.label} の詳細を開く`);

      const h = document.createElement('div');
      h.className = 'card-title';
      const style = PATTERN_STYLE.get(p.id);
      const sw = document.createElement('span');
      sw.style.display = 'inline-block';
      sw.style.width = '10px';
      sw.style.height = '10px';
      sw.style.borderRadius = '2px';
      sw.style.marginRight = '8px';
      sw.style.verticalAlign = 'middle';
      sw.style.background = style?.color || '#999';
      const title = document.createElement('span');
      title.textContent = p.label || `パターン ${p.id}`;
      h.appendChild(sw);
      h.appendChild(title);
      card.appendChild(h);

      // headline（1文で中身が伝わるように）
      if (p.headline) {
        const sub = document.createElement('div');
        sub.className = 'muted2';
        sub.textContent = p.headline;
        card.appendChild(sub);
      }

      // metrics（ユーザー向け語彙に）
      if (p.metrics) {
        const chips = document.createElement('div'); chips.className = 'badges';
        const c1 = document.createElement('span'); c1.className = 'badge2'; c1.textContent = `📈 成果: ${effectLevelToWord(p.metrics?.effectLevel)}`;
        const c2 = document.createElement('span'); c2.className = 'badge2'; c2.textContent = `🧭 負荷: ${levelToWordLR(p.metrics?.loadLevel)}`;
        const c3 = document.createElement('span'); c3.className = 'badge2'; c3.textContent = `⚠️ リスク: ${levelToWordLR(p.metrics?.riskLevel)}`;
        chips.appendChild(c1); chips.appendChild(c2); chips.appendChild(c3);
        card.appendChild(chips);
      }

      // CTA群
      const btn = document.createElement('button'); btn.className='btn btn-primary btn-sm'; btn.textContent='この進め方の詳細を見る';
      btn.addEventListener('click', (e)=>{ e.stopPropagation(); openModalForPattern(p); });
      const btn2 = document.createElement('button');
      btn2.className='btn btn-sm btn-outline';
      btn2.textContent='グラフで確認';
      btn2.style.marginLeft = '8px';
      // マウスホバーで一時ハイライト
      btn2.addEventListener('mouseenter', () => updateChartHighlight(p.id));
      btn2.addEventListener('mouseleave', () => updateChartHighlight(null));
      // クリック時はモーダルを開かず、グラフへスクロール＋強調（数秒）
      btn2.addEventListener('click', (e) => {
        e.stopPropagation();
        try {
          const el = document.getElementById('fsv2-linechart');
          if (el && typeof el.scrollIntoView === 'function') {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } catch(_) {}
        updateChartHighlight(p.id);
        // 数秒後に強調を解除
        setTimeout(() => updateChartHighlight(null), 3500);
      });
      const cta = document.createElement('div'); cta.style.margin = '8px 0'; cta.appendChild(btn); cta.appendChild(btn2);
      card.appendChild(cta);

      // 最終の到達点
      const final = document.createElement('div');
      final.innerHTML = `<div class="muted">最終の到達点</div>`;
      const v = document.createElement('div');
      v.className = 'value';
      // 質的表現に置換（数値スコアは出さない）
      const effL = effectLevelToWord(p.metrics?.effectLevel);
      const loadL = levelToWordLR(p.metrics?.loadLevel);
      const riskL = levelToWordLR(p.metrics?.riskLevel);
      v.textContent = `${p.final.name} / 評価: 成果${effL}・負荷${loadL}・リスク${riskL}`;
      card.appendChild(final);
      card.appendChild(v);

      card.addEventListener('click', () => openModalForPattern(p));
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModalForPattern(p); } });
      host.appendChild(card);
    });
    if (st) st.textContent = `✅ モック描画完了。カード=${host.children.length}`;
  }

  // ---- Modal rendering ----
  function qs(id) { return document.getElementById(id); }
  function showModal() {
    qs('fsv2-modal-backdrop')?.classList.add('show');
    qs('fsv2-modal')?.classList.add('show');
  }
  function hideModal() {
    qs('fsv2-modal-backdrop')?.classList.remove('show');
    qs('fsv2-modal')?.classList.remove('show');
    // Reset chart highlight when closing
    updateChartHighlight(null);
  }
  function formatBadge(text, cls='chip') {
    const span = document.createElement('span');
    span.className = cls; span.textContent = text; return span;
  }
  function openModalForPattern(p) {
    // Highlight chart series for this pattern
    updateChartHighlight(p.id);
    const title = qs('fsv2-modal-title');
    const summary = qs('fsv2-modal-summary');
    const timeline = qs('fsv2-modal-timeline');
    if (!title || !summary || !timeline) return;
    title.textContent = p.label || p.id;
    const start = p.route[0];
    const last = p.route[3];
    // Build a human summary sentence (サマリー調)
    function metricsSentence(m) {
      if (!m) return '';
      const eff = m.effectLevel === '大' ? '大きく' : m.effectLevel === '中' ? '中程度に' : m.effectLevel === '小' ? '小さく' : '控えめに';
      const load = m.loadLevel === '高' ? '高め' : m.loadLevel === '中' ? '中程度' : '小さめ';
      const risk = m.riskLevel === '高' ? '高め' : m.riskLevel === '中' ? '中程度' : '低め';
      return `成果は${eff}、負荷は${load}、リスクは${risk}。`;
    }
    let oneLiner = '';
    try {
      const key = `${start.hex} ${yaoLabelFor(start.hex, start.pos)} | ${p.id}`;
      const authored = CHAIN_NARRATIVES?.get(key);
      if (authored && authored.chain_long) {
        oneLiner = firstSentence(authored.chain_long);
      }
    } catch(_) {}
    if (!oneLiner) oneLiner = p.headline || `${start.hex}から${last.hex}への流れ。`;
    const metaLine = metricsSentence(p.metrics);
    summary.textContent = `${oneLiner} ${metaLine}`.trim();
    timeline.innerHTML = '';
    // Legend row (構造タグとアクション凡例)
    const legend = document.createElement('div'); legend.className='legend muted2';
    const lgKeep = document.createElement('span'); lgKeep.className='tag keep'; lgKeep.textContent='継続'; legend.appendChild(lgKeep);
    const lgRef = document.createElement('span'); lgRef.className='tag reframe'; lgRef.textContent='転換'; legend.appendChild(lgRef);
    const lgStr = document.createElement('span'); lgStr.className='tag struct'; lgStr.textContent='章替え'; legend.appendChild(lgStr);
    const lgAct1 = document.createElement('span'); lgAct1.className='badge'; lgAct1.textContent='↑ 深める'; legend.appendChild(lgAct1);
    const lgAct2 = document.createElement('span'); lgAct2.className='badge'; lgAct2.textContent='↺ 変える'; legend.appendChild(lgAct2);
    timeline.appendChild(legend);

    // 説明（見方）
    const help = document.createElement('div'); help.className = 'help';
    const close = document.createElement('span'); close.className = 'close'; close.textContent = '×';
    const helpTitle = document.createElement('div'); helpTitle.className = 'title'; helpTitle.textContent = '見方';
    const body = document.createElement('div');
    body.innerHTML = [
      '・継続＝同じテーマの深掘り、転換＝視点や扱いの変更、章替え＝テーマ自体の構造転換',
      '・↑ 深める＝その爻を進める、↺ 変える＝同じ爻で陰陽を反転（視点を切替）',
      '・成果＝スコアの伸び／負荷＝変化の大きさ／リスク＝不確実性の高さ'
    ].map(s=>`<div class="micro">${s}</div>`).join('');
    close.addEventListener('click', () => help.remove());
    help.appendChild(close); help.appendChild(helpTitle); help.appendChild(body);
    timeline.appendChild(help);

    // 現状サマリ（1文）: now → shin → H384 の順でフォールバック
    try {
      const startPref = getPreferredText(start.hex, start.pos);
      const nowLine = document.createElement('div'); nowLine.className='muted2';
      nowLine.style.margin = '4px 0 8px';
      nowLine.textContent = firstSentence(startPref) || '（現状テキスト：執筆中）';
      timeline.appendChild(nowLine);
    } catch(_) {}

    // パターンの評価（ラベルのみ）
    if (p.metrics) {
      const badges = document.createElement('div'); badges.className='badges';
      const b1 = document.createElement('span'); b1.className='badge2'; b1.textContent = `成果: ${effectLevelToWord(p.metrics?.effectLevel)}`;
      const b2 = document.createElement('span'); b2.className='badge2'; b2.textContent = `負荷: ${levelToWordLR(p.metrics?.loadLevel)}`;
      const b3 = document.createElement('span'); b3.className='badge2'; b3.textContent = `リスク: ${levelToWordLR(p.metrics?.riskLevel)}`;
      badges.appendChild(b1); badges.appendChild(b2); badges.appendChild(b3);
      timeline.appendChild(badges);

      // 根拠（ユーザー語）
      try {
        const counts = { cont:0, ref:0, struct:0 };
        (p.details||[]).forEach(d=>{ if (d?.delta?.themeShift==='reframe') counts.ref++; else if (d?.delta?.themeShift==='structural') counts.struct++; else counts.cont++; });
        const risk = p.metrics?.riskLevel; const load = p.metrics?.loadLevel; const eff = p.metrics?.effectLevel;
        function reasonForEffect() {
          if (eff === '大') return '打ち手が明確で、成果につながりやすい構成';
          if (eff === '中') return '積み上げと見直しの両輪で伸ばせる';
          if (eff === '小') return '小さな前進を重ねる前提で進められる';
          return '現状から無理のない伸びを狙う';
        }
        function reasonForLoad() {
          const change = counts.struct + counts.ref;
          if (change >= 3) return 'やり方や関係の組み替えが前提';
          if (change >= 1) return 'いくつかの見直しが必要';
          return '現状の型を活かした調整中心';
        }
        function reasonForRisk() {
          if (risk === '低') return '現場調整で吸収できる範囲';
          if (risk === '中') return '事前合意と段取りで十分にカバー可能';
          if (risk === '高') return '利害調整と検証の手当てを前提に';
          return '適切な管理で対応可能';
        }
        const ev = document.createElement('div'); ev.className = 'muted2'; ev.style.marginTop = '6px';
        ev.textContent = `理由: ${reasonForEffect()} / ${reasonForLoad()} / ${reasonForRisk()}`;
        timeline.appendChild(ev);
      } catch(_) {}
    }
    // 概要グリッド（3フェーズ要約） + クリックで単一詳細表示
    const st1 = document.createElement('div'); st1.className = 'section-title'; st1.textContent = 'このパターンの流れ（3フェーズ）';
    timeline.appendChild(st1);
    // フェーズのタイムライン（視覚的な流れ）
    const steps = document.createElement('div'); steps.className = 'timeline-steps';
    const map = { none: ['継続','keep'], reframe: ['転換','reframe'], structural: ['章替え','struct'] };
    p.details.forEach((d, i) => {
      const st = document.createElement('div'); st.className = 'step';
      const num = document.createElement('span'); num.className = 'num'; num.textContent = String(d.phase);
      const [lab] = map[d.delta.themeShift] || ['継続','keep'];
      const labEl = document.createElement('span'); labEl.className = 'label'; labEl.textContent = `${lab}（${d.action === 'advance' ? '深める' : '変える'}）`;
      st.appendChild(num); st.appendChild(labEl); steps.appendChild(st);
      if (i < p.details.length - 1) { const arrow = document.createElement('span'); arrow.className = 'arrow'; arrow.textContent = '→'; steps.appendChild(arrow); }
    });
    timeline.appendChild(steps);
    // 3フェーズまとめ（文章に一本化）
    const st3 = document.createElement('div'); st3.className = 'section-title'; st3.textContent = '3フェーズまとめ（文章）';
    const para = document.createElement('div'); para.style.marginTop = '6px'; para.textContent = p.narrativeChain || '（要約準備中）';
    timeline.appendChild(st3);
    timeline.appendChild(para);
    showModal();
  }

  // ---- Run ----
  function bootstrap() {
    Promise.resolve()
      .then(loadHexagramsData)
      .then(loadKoudoShishin)
      .then(loadNarratives)
      .then(loadChainNarratives)
      .then(() => {
        initVariant();
        PATTERN_DATA = buildPatterns();
        computePatternStyles(PATTERN_DATA);
      })
      .then(() => renderSingle())
      .then(() => {
        try { renderChart(); } catch (e) { console.error('Chart render error:', e); }
        try { renderFeatured(); } catch (e) { console.error('Featured render error:', e); }
        try { renderPatterns(); } catch (e) { console.error('Pattern render error:', e); }
        const st = document.getElementById('mock-status');
        const ok = document.getElementById('fsv2-name')?.textContent?.trim() && document.getElementById('fsv2-patterns')?.children.length >= 1;
        if (st) st.textContent = ok ? '✅ モック描画完了。' : '⚠️ モック描画に問題があります。';

      // Modal wiring
      const closeBtn = document.getElementById('fsv2-modal-close');
      const backdrop = document.getElementById('fsv2-modal-backdrop');
      closeBtn?.addEventListener('click', hideModal);
      backdrop?.addEventListener('click', hideModal);
      window.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideModal(); });
    });
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(bootstrap, 0);
  } else {
    window.addEventListener('DOMContentLoaded', bootstrap);
  }
})();
