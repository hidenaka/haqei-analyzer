/**
 * Future Simulator Data Loader (wrapper)
 * - Wraps easyScenarioLoader (public/js/scenario-easy-loader.js)
 * - Adds triad key handling (JJJ..HHH), neighbor prefetch, keyword fetch, and search.
 */
(function(global){
  'use strict';

  const TRIADS = ['JJJ','JJH','JHJ','JHH','HJJ','HJH','HHJ','HHH'];

  function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

  class FutureSimData {
    constructor(){
      this.triads = TRIADS.slice();
      this._kw = null; // { 'hex-line': [...] }
      this._kwPending = null;
    }

    buildKey(hex, line, triad){
      const h = Number(hex);
      const ln = clamp(Number(line||1), 1, 6);
      const sig = String(triad||'').toUpperCase();
      if (!this.triads.includes(sig)) return null;
      return `${h}_${ln}_${sig}`;
    }

    async ensureHex(hex){
      if (!global.easyScenarioLoader) throw new Error('easyScenarioLoader missing');
      return global.easyScenarioLoader.loadHex(Number(hex));
    }

    getEntryIfReady(hex){
      return global.easyScenarioLoader?.getHex(Number(hex));
    }

    async getRecord(hex, line, triad){
      const k = this.buildKey(hex, line, triad);
      if (!k) return null;
      const ready = this.getEntryIfReady(hex);
      if (ready && ready.items && ready.items[k]) return ready.items[k];
      await this.ensureHex(hex);
      const entry = this.getEntryIfReady(hex);
      return entry && entry.items ? entry.items[k] || null : null;
    }

    async getOneLine(hex, line, triad){
      const rec = await this.getRecord(hex, line, triad);
      return rec && rec.easy ? rec.easy.oneLine || null : null;
    }

    async prefetchAround(hex, radius = 2){
      const h = Number(hex);
      const tasks = [];
      for (let d = -radius; d <= radius; d++){
        const t = h + d;
        if (t >= 1 && t <= 64){
          tasks.push(this.ensureHex(t).catch(()=>null));
        }
      }
      await Promise.all(tasks);
    }

    async loadKeywords(){
      if (this._kw) return this._kw;
      if (this._kwPending) return this._kwPending;
      const url = './data/h384-keyword-overrides.json';
      this._kwPending = fetch(url, { credentials: 'same-origin' })
        .then(r => { if (!r.ok) throw new Error(`Failed to load ${url}`); return r.json(); })
        .then(j => { this._kw = j || {}; this._kwPending = null; return this._kw; })
        .catch(err => { console.warn('[FutureSimData] keyword load failed', err); this._kwPending = null; this._kw = {}; return this._kw; });
      return this._kwPending;
    }

    async getKeywords(hex, line){
      const map = await this.loadKeywords();
      return map?.[`${Number(hex)}-${Number(line)}`] || [];
    }

    /**
     * Search within loaded caches only to avoid large IO
     */
    searchLoaded(query){
      const q = String(query||'').trim();
      if (!q) return [];
      const hit = [];
      const loader = global.easyScenarioLoader;
      if (!loader || !loader.cache) return hit;
      for (const [hex, entry] of loader.cache.entries()){
        const items = entry?.items || {};
        for (const [key, rec] of Object.entries(items)){
          const txt = rec?.easy?.oneLine || '';
          if (txt.includes(q)){
            const [h, ln, triad] = key.split('_');
            hit.push({ key, hex: Number(h), line: Number(ln), triad, oneLine: txt });
          }
        }
      }
      return hit;
    }

    /**
     * Simple helper to extract a few basic fields to support "簡易" mode without additional sources
     */
    async getSimpleView(hex, line, triad){
      const rec = await this.getRecord(hex, line, triad);
      if (!rec) return null;
      return {
        series: rec.series || '',
        finalHex: rec.finalHex || null,
        finalLine: rec.finalLine || null,
        probability: typeof rec.probability === 'number' ? rec.probability : null
      };
    }
  }

  global.futureSimData = new FutureSimData();
})(window);

