/**
 * ScenarioDBProvider - 3072通りの事前計算シナリオDBを読み込むプロバイダ
 * Serena定義: 開始 卦/爻 × 8パス(J/Hの3ステップ)ごとに series(S0..S3) と最終到達を保持
 */
(function(global){
  'use strict';

  class ScenarioDBProvider {
    constructor(options = {}) {
      this.basePath = options.basePath || '/data/scenario-db';
      this.cache = new Map(); // key: hex -> bundle json
      this.dbVersion = null;
    }

    async loadBundle(hex) {
      const h = Number(hex);
      if (!Number.isFinite(h) || h < 1 || h > 64) return null;
      if (this.cache.has(h)) return this.cache.get(h);
      const url = `${this.basePath}/hex-${h}.json`;
      try {
        const res = await fetch(url, { credentials: 'same-origin' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json && json.dbVersion && !this.dbVersion) this.dbVersion = json.dbVersion;
        this.cache.set(h, json);
        return json;
      } catch (e) {
        console.warn('[ScenarioDBProvider] Bundle load failed:', url, e.message);
        this.cache.set(h, null);
        return null;
      }
    }

    // 1件取得
    async get(startHex, startLine, pathSig) {
      const bundle = await this.loadBundle(startHex);
      if (!bundle || !bundle.items) return null;
      const key = `${Number(startHex)}_${Number(startLine)}_${String(pathSig).toUpperCase()}`;
      return bundle.items[key] || null;
    }

    // 8件まとめ取得（存在する分のみ返却）
    async getAllForStart(startHex, startLine) {
      const bundle = await this.loadBundle(startHex);
      if (!bundle || !bundle.items) return [];
      const sigs = ['JJJ','JJH','JHJ','JHH','HJJ','HJH','HHJ','HHH'];
      const list = [];
      for (let i=0;i<sigs.length;i++) {
        const key = `${Number(startHex)}_${Number(startLine)}_${sigs[i]}`;
        const item = bundle.items[key];
        if (item) list.push({ ...item, pathSig: sigs[i] });
      }
      return list;
    }
  }

  global.ScenarioDBProvider = ScenarioDBProvider;
})(typeof window !== 'undefined' ? window : this);

