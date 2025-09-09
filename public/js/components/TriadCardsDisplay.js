/**
 * TriadCardsDisplay - 8つのカード（JJJ〜HHH）テキスト表示
 * - narratives_chain_complete_final.json から三段階の物語カードを取得
 * - NarrativesChainLoader と H384_DATA を活用
 */

(function (global) {
  'use strict';

  const TRIADS = ['JJJ','JJH','JHJ','JHH','HJJ','HJH','HHJ','HHH'];

  class TriadCardsDisplay {
    constructor() {
      this.container = null;
      this.cardsRoot = null;
    }

    initialize(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) {
        console.error('[TriadCardsDisplay] Container not found:', containerId);
        return false;
      }
      this.container.innerHTML = '';
      this.container.appendChild(this._createStyles());
      const header = document.createElement('div');
      header.className = 'triad-header';
      header.innerHTML = '<h2 class="triad-title">📚 三段階の変化カード（JJJ〜HHH）</h2>';
      this.container.appendChild(header);

      this.cardsRoot = document.createElement('div');
      this.cardsRoot.className = 'triad-grid';
      this.container.appendChild(this.cardsRoot);
      return true;
    }

    async displayForStart(hexNum, lineNum) {
      if (!this.container) return;
      if (!global.NarrativesChain) {
        console.error('[TriadCardsDisplay] NarrativesChain loader not available');
        return;
      }
      await global.NarrativesChain.ensureLoaded();

      // 取得と描画
      this.cardsRoot.innerHTML = '';
      for (const triad of TRIADS) {
        let entry;
        try {
          entry = global.NarrativesChain.getTriadEntryByStart(hexNum, lineNum, triad);
        } catch (e) {
          console.warn('[TriadCardsDisplay] Missing triad', triad, e.message);
          continue;
        }
        // Prefer one-liner if available
        let one = '';
        let code = '';
        try {
          const ol = global.NarrativesChain.getTriadOneLinerByStart(hexNum, lineNum, triad);
          one = ol.one_liner || '';
          code = ol.path_code || '';
        } catch {}
        const card = this._createCard(triad, entry, one, code);
        this.cardsRoot.appendChild(card);
      }
    }

    _createCard(triad, data, oneLiner, pathCode) {
      const card = document.createElement('div');
      card.className = 'triad-card';
      const isPlaceholder = (txt) => {
        if (!txt) return true;
        const norm = String(txt).replace(/[\s\n\r]/g, '');
        return ['状況転換段階','状況開始段階','状況発展段階','状況頂点段階','状況完成段階','変化展開段階','完成到達段階'].some(w => norm.includes(w));
      };
      const triadHuman = triad.split('').map(c => c==='J'?'進':'変').join('→');
      const headline = (!isPlaceholder(data.triad_headline) && data.triad_headline) ? data.triad_headline : (oneLiner || `三段の変化（${triadHuman}）`);
      const suit = data.suitability || '';
      const caution = data.caution || '';
      // Show one-liner only; fall back to static chain_long if missing
      let story = oneLiner || data.chain_long || '';

      card.innerHTML = `
        <div class="triad-ribbon">${triad}</div>
        <div class="triad-headline">${headline}</div>
        <div class="triad-meta">
          ${pathCode ? `<div class="triad-path" style="font-size:12px;color:#6b7280;">${pathCode}</div>` : ''}
        </div>
        <div class="triad-story">${story}</div>
      `;
      return card;
    }

    _createStyles() {
      const style = document.createElement('style');
      style.textContent = `
        .triad-title { font-size: 1.25rem; font-weight: 700; color: #1f2937; margin: 0 0 0.5rem; }
        .triad-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
        .triad-card { position: relative; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
        .triad-ribbon { position: absolute; top: 0; right: 0; background: #6366F1; color: white; font-weight: 700; padding: 4px 10px; border-bottom-left-radius: 8px; }
        .triad-headline { font-weight: 700; color: #111827; margin-bottom: 8px; }
        .triad-meta { display: grid; gap: 4px; margin-bottom: 8px; }
        .triad-meta span { font-weight: 600; color: #374151; margin-right: 6px; }
        .triad-story { color: #374151; line-height: 1.6; font-size: 0.95rem; }
      `;
      return style;
    }
  }

  global.TriadCardsDisplay = TriadCardsDisplay;
})(typeof window !== 'undefined' ? window : globalThis);
