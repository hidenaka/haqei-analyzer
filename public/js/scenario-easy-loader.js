/**
 * Scenario Easy Loader
 * - Loads curated easy data per hex from public/data/scenario-db-easy/hex-*.json
 * - Provides key-based access: `${hex}_${line}_${sig}` where sig in {JJJ,JJH,JHJ,JHH,HJJ,HJH,HHJ,HHH}
 */
(function(global){
  'use strict';

  class ScenarioEasyLoader {
    constructor(){
      this.cache = new Map(); // hex -> { items, loadedAt }
      this._pending = new Map(); // hex -> Promise
    }

    /**
     * Build easy key from inputs
     * @param {number} hex 1..64
     * @param {number} line 1..6
     * @param {string|string[]} seriesOrPattern '進→変→進' or ['進爻','変爻','進爻']
     */
    buildKey(hex, line, seriesOrPattern){
      const h = Number(hex);
      const ln = Math.min(6, Math.max(1, Number(line||1)));
      let sig = '';
      if (Array.isArray(seriesOrPattern)) {
        sig = seriesOrPattern.map(a => (String(a).includes('進') ? 'J' : 'H')).join('');
      } else {
        const parts = String(seriesOrPattern||'').split('→');
        sig = parts.map(p => (String(p).includes('進') ? 'J' : 'H')).join('');
      }
      if (!sig || sig.length!==3) return null;
      return `${h}_${ln}_${sig}`;
    }

    /**
     * Returns cached JSON for hex if present
     */
    getHex(hex){
      return this.cache.get(Number(hex));
    }

    /**
     * Fetch and cache hex JSON (idempotent)
     */
    async loadHex(hex){
      const n = Number(hex);
      if (this.cache.has(n)) return this.cache.get(n);
      if (this._pending.has(n)) return this._pending.get(n);
      const url = `./data/scenario-db-easy/hex-${n}.json`;
      const p = fetch(url, { credentials: 'same-origin' })
        .then(async res => {
          if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
          const data = await res.json();
          const items = (data && data.items) ? data.items : {};
          const wrapped = { items, loadedAt: new Date().toISOString() };
          this.cache.set(n, wrapped);
          this._pending.delete(n);
          return wrapped;
        })
        .catch(err => {
          console.error('[ScenarioEasyLoader] loadHex error:', err);
          this._pending.delete(n);
          throw err;
        });
      this._pending.set(n, p);
      return p;
    }

    /**
     * Get easy object if available (does not trigger fetch)
     */
    getEasyIfReady(hex, line, seriesOrPattern){
      const entry = this.getHex(hex);
      if (!entry) return null;
      const key = this.buildKey(hex, line, seriesOrPattern);
      if (!key) return null;
      const rec = entry.items[key];
      return rec && rec.easy ? rec.easy : null;
    }

    /**
     * Ensure data is loaded then return easy object (or null)
     */
    async getEasy(hex, line, seriesOrPattern){
      const ready = this.getEasyIfReady(hex, line, seriesOrPattern);
      if (ready) return ready;
      try {
        await this.loadHex(hex);
        return this.getEasyIfReady(hex, line, seriesOrPattern);
      } catch {
        return null;
      }
    }
  }

  global.easyScenarioLoader = new ScenarioEasyLoader();
})(window);

