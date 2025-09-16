/**
 * BranchGenerator - 進爻/変爻のみで8分岐を生成
 * - A=進、B=変の3手（AAA..BBB）を展開
 * - KingWenMappingの定義に準拠して変爻を算出
 * - 行状態テキストは public/data/h384-line-states.json の "<hex>-<line>" を参照
 */

(function(global){
  'use strict';

  class BranchGenerator {
    constructor() {
      this.lineStates = null;
      this.kingWen = null;
      this.initialized = false;
      this.usedFallback = false; // いずれかでフォールバックを使ったか
      this._initPromise = null;
    }

    async initialize() {
      if (this.initialized) return true;
      if (this._initPromise) return this._initPromise;

      this._initPromise = (async () => {
        try {
          const { KingWenMapping } = await import('../iching/KingWenMapping.js');
          this.kingWen = new KingWenMapping();
          await this.kingWen.initialize();
        } catch (e) {
          console.warn('⚠️ KingWenMapping 動的読み込みに失敗。フォールバックが使われる可能性があります:', e?.message || e);
          try {
            const mod = await import('../iching/KingWenMapping.js');
            this.kingWen = new mod.KingWenMapping();
            await this.kingWen.initialize();
          } catch (e2) {
            console.warn('⚠️ KingWenMapping のフォールバック初期化も失敗:', e2?.message || e2);
          }
        }

        try {
          const url = '/data/h384-line-states.json';
          const res = await fetch(url, { cache: 'no-cache' });
          if (!res.ok) throw new Error('HTTP ' + res.status);
          this.lineStates = await res.json();
        } catch (e) {
          console.error('❌ 行状態テキストの読み込みに失敗:', e?.message || e);
          this.lineStates = {};
        }

        this.initialized = true;
        return true;
      })();

      return this._initPromise;
    }

    _getLineText(hex, line) {
      if (!this.lineStates) return { text: '', registered: false };
      const key = `${hex}-${line}`;
      const entry = this.lineStates[key];
      if (typeof entry === 'string') return { text: entry, registered: true };
      if (entry && typeof entry.text === 'string') return { text: entry.text, registered: true };
      return { text: '', registered: false };
    }

    _transformHex(hex, line) {
      let newHex = null;
      try {
        if (!this.kingWen || !this.kingWen.initialized) this.usedFallback = true;
        newHex = this.kingWen.calculateTransformedHex(hex, line);
      } catch (e) {
        console.warn('⚠️ calculateTransformedHex 失敗。フォールバック算出を使用:', e?.message || e);
        this.usedFallback = true;
        const estimated = ((hex - 1) ^ (1 << (line - 1))) + 1;
        newHex = estimated;
      }
      return newHex || hex;
    }

    _advanceLine(line) {
      if (line < 6) return { line: line + 1, note: null, progressed: true };
      return { line, note: '進不可（最終）', progressed: false };
    }

    _actionSeries() {
      return [
        ['A','A','A'], ['A','A','B'], ['A','B','A'], ['A','B','B'],
        ['B','A','A'], ['B','A','B'], ['B','B','A'], ['B','B','B']
      ];
    }

    async generateEightBranches(hex, line) {
      await this.initialize();
      const results = [];
      const seriesList = this._actionSeries();
      let usedFallbackInAny = false;

      seriesList.forEach((series, idx) => {
        let curHex = hex;
        let curLine = line;
        const steps = [];
        let valid = true;
        let notes = [];

        series.forEach(action => {
          if (action === 'A') {
            const adv = this._advanceLine(curLine);
            if (!adv.progressed) { notes.push(adv.note); valid = false; }
            curLine = adv.line;
            const { text, registered } = this._getLineText(curHex, curLine);
            steps.push({ hex: curHex, line: curLine, action: '進', lineText: registered ? text : (text || '') });
          } else {
            const beforeHex = curHex;
            const newHex = this._transformHex(curHex, curLine);
            if (newHex === beforeHex) { usedFallbackInAny = true; notes.push('変爻先推定'); }
            curHex = newHex;
            const { text, registered } = this._getLineText(curHex, curLine);
            if (!registered) usedFallbackInAny = true;
            steps.push({ hex: curHex, line: curLine, action: '変', lineText: registered ? text : (text || '') });
          }
        });

        if (notes.length > 0) steps[steps.length - 1].note = notes.join(' / ');
        results.push({ id: idx + 1, steps, valid, series: series.map(s => (s === 'A' ? '進' : '変')).join('→') });
      });

      this.usedFallback = this.usedFallback || usedFallbackInAny;
      return results;
    }
  }

  if (typeof window !== 'undefined') {
    global.BranchGenerator = BranchGenerator;
  }

  console.log('✅ BranchGenerator loaded');

})(typeof window !== 'undefined' ? window : this);

