/**
 * NarrativesChainLoader
 * - Loads /public/data/authoring/narratives_chain_complete_final.json
 * - Provides lookup by (startHexNum, startLineNum, pattern)
 * - Uses H384_DATA to normalize hex/line names for key construction
 */
(function (global) {
  const STATE = {
    loaded: false,
    loading: null,
    data: null,
    index: null, // key: "卦名 爻名 | TRIAD" -> entry
  };

  function assert(cond, msg) {
    if (!cond) throw new Error('[NarrativesChainLoader] ' + msg);
  }

  async function loadJSON(url) {
    // Append version to avoid stale caches
    try {
      const v = (global.HAQEI_CONFIG && global.HAQEI_CONFIG.appVersion) ? global.HAQEI_CONFIG.appVersion : Date.now();
      const sep = url.includes('?') ? '&' : '?';
      url = `${url}${sep}v=${encodeURIComponent(v)}`;
    } catch {}
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error('Fetch failed: ' + res.status + ' ' + res.statusText);
    return await res.json();
  }

  function buildIndex(db) {
    const idx = new Map();
    for (const [k, v] of Object.entries(db)) {
      idx.set(k, v);
    }
    return idx;
  }

  function getHexLineNamesFromH384(hexNum, lineNum) {
    assert(Array.isArray(global.H384_DATA), 'H384_DATA is not loaded');
    const index = (hexNum - 1) * 6 + (lineNum - 1);
    const entry = global.H384_DATA[index];
    assert(entry && entry['卦名'] && entry['爻'], `H384 entry missing for hex=${hexNum} line=${lineNum}`);
    return { hexName: String(entry['卦名']).trim(), lineName: String(entry['爻']).trim() };
  }

  function normalize(str) {
    return String(str || '')
      .replace(/\s+/g, ' ')
      .replace(/　+/g, ' ')
      .trim();
  }

  async function ensureLoaded() {
    if (STATE.loaded) return true;
    if (STATE.loading) return STATE.loading;
    STATE.loading = (async () => {
      // Prefer autofilled -> merged -> final
      let db;
      try {
        try { db = await loadJSON('./data/authoring/narratives_chain_complete_final.merged_autofilled.json'); }
        catch(_e1) { db = await loadJSON('./data/authoring/narratives_chain_complete_final.merged.json'); }
      } catch (e) {
        db = await loadJSON('./data/authoring/narratives_chain_complete_final.json');
      }
      STATE.data = db;
      STATE.index = buildIndex(db);
      STATE.loaded = true;
      return true;
    })();
    return STATE.loading;
  }

  function getTriadEntryByStart(hexNum, lineNum, pattern) {
    assert(STATE.loaded && STATE.index, 'Loader not initialized');
    const names = getHexLineNamesFromH384(hexNum, lineNum);
    const candidates = [];
    const base = `${names.hexName} ${names.lineName} | ${pattern}`;
    candidates.push(base);
    // normalized
    candidates.push(`${normalize(names.hexName)} ${normalize(names.lineName)} | ${pattern}`);
    // collapse spaces in hexName
    candidates.push(`${normalize(names.hexName).replace(/\s+/g,'')} ${normalize(names.lineName)} | ${pattern}`);

    let entry = null, usedKey = null;
    for (const k of candidates) {
      if (STATE.index.has(k)) { entry = STATE.index.get(k); usedKey = k; break; }
    }
    assert(entry, `Narrative not found for key: ${base}`);
    return entry;
  }

  function getTriadOneLinerByStart(hexNum, lineNum, pattern) {
    const entry = getTriadEntryByStart(hexNum, lineNum, pattern);
    const one = entry.one_liner || '';
    const code = entry.path_code || '';
    return { one_liner: one, path_code: code };
  }

  global.NarrativesChain = {
    ensureLoaded,
    getTriadEntryByStart,
    getTriadOneLinerByStart,
  };
})(typeof window !== 'undefined' ? window : globalThis);
