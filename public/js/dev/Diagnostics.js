/**
 * Diagnostics for IChingGuidanceEngine and H384 mapping
 * Usage in console: runIChingDiagnostics()
 */
(function(global){
  'use strict';

  async function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

  async function ensureEngineReady() {
    let tries = 0;
    while ((!global.iChingGuidance || !global.iChingGuidance.isInitialized) && tries < 50) {
      await sleep(100);
      tries++;
    }
    if (!global.iChingGuidance) throw new Error('iChingGuidance not available');
    if (!global.iChingGuidance.isInitialized) await global.iChingGuidance.initialize();
  }

  function findH384By(hexNum, yaoName) {
    try {
      if (!global.H384_DATA) return null;
      return global.H384_DATA.find(e => Number(e['卦番号'])===Number(hexNum) && String(e['爻'])===String(yaoName));
    } catch { return null; }
  }

  async function testCase(text, expectIncludes) {
    const res = await global.iChingGuidance.performCompleteAnalysis(text);
    const cs = res && res.currentSituation;
    const ok = cs && (!expectIncludes || (String(cs.hexagramName||'').includes(expectIncludes.hexagramName||'') && (!expectIncludes.yaoName || String(cs.yaoName||'')===String(expectIncludes.yaoName))));
    console.info('[CASE]', { text, result: cs ? `${cs.hexagramName} ${cs.yaoName}` : null, ok });
    return { ok, cs };
  }

  async function randomHitRate(n=30) {
    let hit=0;
    const N = Math.min(n, (global.H384_DATA||[]).length);
    for (let i=0;i<N;i++) {
      const e = global.H384_DATA[Math.floor(Math.random()*global.H384_DATA.length)];
      const kw = Array.isArray(e['キーワード']) ? e['キーワード'].join('、') : String(e['キーワード']||'');
      const text = `${kw} ${e['現代解釈の要約']||''}`.trim();
      /* eslint-disable no-await-in-loop */
      const r = await global.iChingGuidance.performCompleteAnalysis(text);
      const cs = r && r.currentSituation;
      if (cs && Number(cs.hexagramNumber)===Number(e['卦番号']) && String(cs.yaoName)===String(e['爻'])) hit++;
    }
    console.info('[RANDOM-HIT-RATE]', { hit, N, rate: (hit/N*100).toFixed(1)+'%' });
    return { hit, N };
  }

  // パラフレーズ評価: 同義語置換と語順入替でロバスト性を確認
  function paraphraseText(base) {
    try {
      const swaps = [
        ['協力','連携'],['合意','合意形成'],['基盤','土台'],['整備','標準化'],
        ['改革','刷新'],['退避','撤退'],['受容','受け入れ'],['決断','意思決定'],
        ['共鳴','感応'],['危険','リスク']
      ];
      let t = String(base);
      swaps.forEach(([a,b])=>{ if (Math.random()<0.4) t = t.replace(new RegExp(a,'g'), b); });
      // 簡易シャッフル: 文の区切りで並び替え
      const parts = t.split(/、|。|\s+/).filter(Boolean);
      if (parts.length>3 && Math.random()<0.5) {
        parts.sort(()=>Math.random()-0.5);
        t = parts.join('、');
      }
      return t;
    } catch { return base; }
  }

  async function randomHitRateWithParaphrase(n=30, variants=2) {
    let hit1=0, hit3=0, total=0;
    const N = Math.min(n, (global.H384_DATA||[]).length);
    for (let i=0;i<N;i++) {
      const e = global.H384_DATA[Math.floor(Math.random()*global.H384_DATA.length)];
      const kw = Array.isArray(e['キーワード']) ? e['キーワード'].join('、') : String(e['キーワード']||'');
      const base = `${kw} ${e['現代解釈の要約']||''}`.trim();
      for (let v=0; v<variants; v++) {
        const text = paraphraseText(base);
        /* eslint-disable no-await-in-loop */
        const top = await global.iChingGuidance.rankCandidates(text, 3);
        if (top && top.length) {
          total++;
          if (Number(top[0].hexagramNumber)===Number(e['卦番号']) && String(top[0].yaoName)===String(e['爻'])) hit1++;
          if (top.some(t => Number(t.hexagramNumber)===Number(e['卦番号']) && String(t.yaoName)===String(e['爻']))) hit3++;
        }
      }
    }
    console.info('[PARAPHRASE-HIT-RATE]', {
      total,
      hit1, rate1: total? (hit1/total*100).toFixed(1)+'%':'NA',
      hit3, rate3: total? (hit3/total*100).toFixed(1)+'%':'NA'
    });
    return { total, hit1, hit3 };
  }

  async function runIChingDiagnostics() {
    try {
      console.info('[DIAG] Starting IChing diagnostics...');
      await ensureEngineReady();
      if (!global.H384_DATA) { console.warn('[DIAG] H384_DATA not loaded'); }

      // Case 1: 協力・公の場 → 同人系を期待
      const text1 = '新しい仕事、マジで人足りてない。Aさんは頑張ってくれてるけど、Bさんはやる気がない。公の場で協力し合って進めたい。';
      await testCase(text1, { hexagramName: '同人' });

      // Case 2: 基盤整備 → 井
      const text2 = '基盤を整備して仕組みを持続可能にしたい。焦らず堅実に整える。';
      await testCase(text2, { hexagramName: '井' });

      // Case 3: 改革・刷新 → 革
      const text3 = '抜本的に改めたい。枠組みを刷新し、転換を図る。';
      await testCase(text3, { hexagramName: '革' });

      // 用九・用六の検証
      const eYongJiu = findH384By(1,'用九');
      if (eYongJiu) {
        const textYJ = `${(eYongJiu['キーワード']||[]).join('、')} 決断 断行`;
        await testCase(textYJ, { hexagramName:eYongJiu['卦名'], yaoName:'用九' });
      }
      const eYongLiu = findH384By(2,'用六');
      if (eYongLiu) {
        const textYL = `${(eYongLiu['キーワード']||[]).join('、')} 受容 慎重`;
        await testCase(textYL, { hexagramName:eYongLiu['卦名'], yaoName:'用六' });
      }

      // ランダム・ヒットレート
      await randomHitRate(30);
      await randomHitRateWithParaphrase(30, 2);

      console.info('[DIAG] Completed.');
    } catch (e) {
      console.error('[DIAG] Failed:', e);
    }
  }

  global.runIChingDiagnostics = runIChingDiagnostics;
})(typeof window !== 'undefined' ? window : this);
