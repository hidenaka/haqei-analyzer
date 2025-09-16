/* global futureSimData, easyScenarioLoader */
(function(){
  'use strict';

  const TRIADS = futureSimData.triads;

  const els = {};
  const state = {
    hex: 64,
    line: 1,
    triadIdx: 0,
    mode: 'detailed' // 'detailed' | 'simple'
  };

  function saveState(){
    try { localStorage.setItem('fsim_state', JSON.stringify({ hex: state.hex, line: state.line, triadIdx: state.triadIdx, mode: state.mode })); } catch {}
  }
  function loadState(){
    try {
      const raw = localStorage.getItem('fsim_state');
      if (!raw) return;
      const s = JSON.parse(raw);
      if (s && s.hex>=1 && s.hex<=64) state.hex = s.hex;
      if (s && s.line>=1 && s.line<=6) state.line = s.line;
      if (s && Number.isInteger(s.triadIdx)) state.triadIdx = Math.max(0, Math.min(TRIADS.length-1, s.triadIdx));
      if (s && (s.mode==='detailed' || s.mode==='simple')) state.mode = s.mode;
    } catch {}
  }

  function $(id){ return document.getElementById(id); }

  function patternBadge(triad){
    const chars = String(triad).split('');
    const dots = chars.map(c => `<span class="${c==='J'?'badge-J':'badge-H'}" title="${c}"></span>`).join('');
    return `<span class="pattern-badge" aria-hidden="true">${dots}</span>`;
  }

  function renderPatternGrid(){
    const grid = els.patternGrid;
    grid.innerHTML = '';
    TRIADS.forEach((t, idx) => {
      const div = document.createElement('div');
      div.className = 'pattern-item';
      div.setAttribute('role','radio');
      div.setAttribute('aria-checked', String(idx===state.triadIdx));
      div.tabIndex = 0;
      div.innerHTML = `${t} ${patternBadge(t)}`;
      div.addEventListener('click', () => { state.triadIdx = idx; updatePatternSelection(); updateAll(); });
      div.addEventListener('keydown', (e) => { if (e.key==='Enter' || e.key===' ') { e.preventDefault(); state.triadIdx = idx; updatePatternSelection(); updateAll(); }});
      grid.appendChild(div);
    });
  }

  function updatePatternSelection(){
    const nodes = els.patternGrid.querySelectorAll('.pattern-item');
    nodes.forEach((n, i) => n.setAttribute('aria-checked', String(i===state.triadIdx)));
  }

  function populateHexSelect(){
    const sel = els.hexSelect;
    sel.innerHTML = '';
    for (let i=1;i<=64;i++){
      const opt = document.createElement('option');
      opt.value = String(i); opt.textContent = `hex ${i}`;
      sel.appendChild(opt);
    }
    sel.value = String(state.hex);
  }

  async function updateAll(){
    saveState();
    const hex = state.hex;
    const line = state.line;
    const triad = TRIADS[state.triadIdx];

    els.status.textContent = `hex ${hex} / line ${line} / pattern ${triad}`;
    els.oneLine.classList.add('skeleton');
    els.oneLine.textContent = '';
    els.meta.textContent = '';
    els.keywords.innerHTML = '';
    if (els.cardsGrid) els.cardsGrid.innerHTML = '';

    // Prefetch neighbors
    futureSimData.prefetchAround(hex, 2).catch(()=>{});

    // Load detailed or simple view
    try {
      if (state.mode === 'detailed'){
        const rec = await futureSimData.getRecord(hex, line, triad);
        if (!rec){
          els.oneLine.classList.remove('skeleton');
          els.oneLine.textContent = `データ未整備（key: ${hex}_${line}_${triad}）`;
          els.meta.textContent = '';
        } else {
          const easy = rec.easy || {};
          const one = easy.oneLine || '';
          els.oneLine.classList.remove('skeleton');
          els.oneLine.textContent = one || '（oneLine未設定）';
          const prob = typeof rec.probability==='number' ? `、P=${(rec.probability*100).toFixed(0)}%` : '';
          els.meta.textContent = `series: ${rec.series || '-'} / final: ${rec.finalHex || '-'}-${rec.finalLine || '-'}${prob}`;
        }
      } else {
        const simple = await futureSimData.getSimpleView(hex, line, triad);
        els.oneLine.classList.remove('skeleton');
        if (!simple){
          els.oneLine.textContent = `データ未整備（key: ${hex}_${line}_${triad}）`;
          els.meta.textContent = '';
        } else {
          els.oneLine.textContent = `series: ${simple.series || '-'} / final: ${simple.finalHex || '-'}-${simple.finalLine || '-'}`;
          const prob = (typeof simple.probability==='number') ? `P=${(simple.probability*100).toFixed(0)}%` : '';
          els.meta.textContent = prob;
        }
      }
    } catch (e){
      console.warn('[fsim] render error', e);
      els.oneLine.classList.remove('skeleton');
      els.oneLine.textContent = '読み込みに失敗しました。リトライしてください。';
    }

    // Keywords
    try {
      const kws = await futureSimData.getKeywords(hex, line);
      els.keywords.innerHTML = (kws||[]).map(k => `<span class="kw">${escapeHtml(k)}</span>`).join('');
    } catch {}

    // 8-cards view（全体像／要点）
    try { await renderCards(hex, line); } catch(e){ console.warn('[fsim] renderCards error', e); }

    // Now section
    try { await renderNow(hex, line, triad); } catch(e){ console.warn('[fsim] now error', e); }
    // Top3 section
    try { await renderTop3(hex, line, triad); } catch(e){ console.warn('[fsim] top3 error', e); }
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
  }

  function setMode(mode){
    state.mode = mode;
    els.modeDetailed.setAttribute('aria-pressed', String(mode==='detailed'));
    els.modeSimple.setAttribute('aria-pressed', String(mode==='simple'));
    updateAll();
  }

  async function renderCards(hex, line){
    const grid = els.cardsGrid; if (!grid) return;
    const TRI = futureSimData.triads;
    const current = TRI[state.triadIdx];
    const list = TRI.map(sig => ({ sig }));
    grid.innerHTML = '';
    const tasks = list.slice(0,8).map(async it => {
      const rec = await futureSimData.getRecord(hex, line, it.sig);
      const one = rec?.easy?.oneLine || '';
      const view = buildOverviewAndStrengths(it.sig);
      const card = document.createElement('div');
      card.className = 'panel-2';
      card.style.minHeight = '88px';
      card.innerHTML = `
        <div class="small" style="display:flex;align-items:center;gap:6px;justify-content:space-between;">
          <span>${escapeHtml(it.sig)} ${patternBadge(it.sig)}</span>
          ${it.sig===current?'<span style="color:#22c55e;">現在</span>':''}
        </div>
        <div class="value" style="margin-top:6px;font-size:13px;line-height:1.6;">
          <div><b>全体像:</b> ${escapeHtml(view.overview)}</div>
          <div style="margin-top:4px;"><b>強みが現れやすい点:</b> ${escapeHtml(view.strengths)}</div>
          <div style="margin-top:4px;"><b>流れ:</b> ${escapeHtml(flowLabel(it.sig))}</div>
          <div style="margin-top:4px;"><b>移行の観点:</b> ${escapeHtml(transitionHint(it.sig))}</div>
          <div style="margin-top:4px;"><b>留意点:</b> ${escapeHtml(cautionHint(it.sig))}</div>
          <div style="margin-top:4px;" class="small muted">到達時の様子: ${escapeHtml(one)}</div>
        </div>
        <div class="row" style="margin-top:6px; justify-content: flex-end;">
          <button class="ghost" aria-label="比較に追加" data-sig="${it.sig}">比較に追加</button>
        </div>
      `;
      card.querySelector('button[data-sig]')?.addEventListener('click', () => addToCompare(hex, line, it.sig, view));
      grid.appendChild(card);
    });
    await Promise.all(tasks);
  }

  function buildOverviewAndStrengths(sig){
    // 汎用テンプレート（進=J / 変=H の並びで構成）
    const map = {
      'JJJ': {
        overview: '序盤から終盤まで加速しながら正攻法で押し切る構成',
        strengths: '勢い維持で押し切る / 信頼 / 合意形成 / 大衆の支持'
      },
      'JJH': {
        overview: '押し切りつつ最後は必要最小限の調整で仕上げる',
        strengths: '最後は微調整で締める / 信頼 / 合意形成 / 大衆の支持'
      },
      'JHJ': {
        overview: '中盤で方針を切替えて再加速する構成',
        strengths: '中盤の切替で再加速 / 信頼 / 合意形成 / 大衆の支持'
      },
      'JHH': {
        overview: '初手は進み、後半は路線転換で再設計していく構成',
        strengths: '後半は設計し直す / 信頼 / 合意形成 / 大衆の支持'
      },
      'HJJ': {
        overview: 'まず切替え、以降は前進で成果を固める構成',
        strengths: '初手転換で安定化 / 追い風 / 不安 / 恩恵'
      },
      'HJH': {
        overview: '切替え→前進の後、最後に微修正で整える構成',
        strengths: '締めに向けて整える / 不安 / 追い風 / 恩恵'
      },
      'HHJ': {
        overview: '段階的に切替えた上で、最後は前進でまとめる構成',
        strengths: '段階転換ののち前進 / 不安 / 追い風 / 恩恵'
      },
      'HHH': {
        overview: '三段階で順次切替えて新路線を築く構成',
        strengths: '全面転換で新路線 / 不安 / 追い風 / 恩恵'
      }
    };
    return map[sig] || { overview: '', strengths: '' };
  }

  function flowLabel(sig){
    const map = { J:'前進', H:'切替' };
    return sig.split('').map(c => map[c]||c).join(' → ');
  }

  function transitionHint(sig){
    const t = {
      'JJJ': 'まず「信頼を活かす」→ つぎ「合意形成を活かす」→ 終盤「大衆の支持」',
      'JJH': 'まず「信頼を活かす」→ つぎ「合意形成を活かす」→ 終盤「大衆の支持」',
      'JHJ': 'まず「信頼を活かす」→ つぎ「合意形成を活かす」→ 終盤「大衆の支持」',
      'JHH': 'まず「信頼を活かす」→ つぎ「合意形成を活かす」→ 終盤「大衆の支持」',
      'HJJ': 'まず「追い風を使う」→ つぎ「不安を活かす」→ 終盤「恩恵」',
      'HJH': 'まず「不安を活かす」→ つぎ「追い風を使う」→ 終盤「恩恵」',
      'HHJ': 'まず「不安を活かす」→ つぎ「追い風を使う」→ 終盤「恩恵」',
      'HHH': 'まず「不安を活かす」→ つぎ「追い風を使う」→ 終盤「恩恵」'
    };
    return t[sig] || '';
  }

  function cautionHint(sig){
    const c = {
      'JJJ': '見せ場の誇示は反発',
      'JJH': '名目のための前進は危うい',
      'JHJ': '善意の増速は崩れる',
      'JHH': '見せ場狙いはぶれを生む',
      'HJJ': '飾りで押すと濁る',
    };
    return c[sig] || '体裁優先は曇る';
  }

  async function renderNow(hex, line, triad){
    const name = `hex ${hex}`; // 卦名は簡易表記
    const rec = await futureSimData.getRecord(hex, line, triad);
    const one = rec?.easy?.oneLine || '-';
    if (els.nowHexName) els.nowHexName.textContent = name;
    if (els.nowHexLine) els.nowHexLine.textContent = `line ${line}`;
    if (els.nowSummary) els.nowSummary.textContent = one;
    if (els.nowStrength) els.nowStrength.textContent = rec?.probability ? String(Math.round(rec.probability*100)) : '-';
  }

  async function renderTop3(hex, line, triad){
    const TRI = futureSimData.triads;
    const dist = (a,b)=> a.split('').reduce((s, ch, i)=> s + (ch!==b[i]?1:0), 0);
    const scores = TRI.map(sig => ({ sig, d: dist(sig, triad) }))
      .sort((a,b)=> a.d-b.d)
      .slice(0,3)
      .map((it, idx) => ({
        rank: idx+1,
        sig: it.sig,
        pct: 84 - it.d*6 - idx*3, // 簡易比率
        overview: buildOverviewAndStrengths(it.sig).overview
      }));
    if (els.top3List){
      els.top3List.innerHTML = scores.map(s => `${s.rank}. 分岐${s.rank}｜${flowLabel(s.sig)}｜${s.pct}% - ${escapeHtml(s.overview)}`).join('<br>');
    }
    if (els.top3Why && scores[1] && scores[2]){
      els.top3Why.textContent = `なぜ他ではないか: 2位→${scores[1].overview} ／ 3位→${scores[2].overview}`;
    }
  }

  // 比較（最大2）
  function addToCompare(hex, line, sig, view){
    const bucket = els.compareBucket; if (!bucket) return;
    if (bucket.childElementCount >= 2) return;
    const div = document.createElement('div');
    div.className = 'panel-2';
    div.innerHTML = `<div class="small"><b>${sig}</b> ${patternBadge(sig)}</div>
      <div class="small">全体像: ${escapeHtml(view.overview)}</div>
      <div class="small">強み: ${escapeHtml(view.strengths)}</div>
      <div class="row" style="justify-content:flex-end; margin-top:4px;"><button class="ghost">削除</button></div>`;
    div.querySelector('button')?.addEventListener('click', ()=> div.remove());
    bucket.appendChild(div);
  }

  function truncate(s, n){
    const str = String(s||'');
    return str.length>n ? (str.slice(0,n-1)+'…') : str;
  }

  function initFav(){
    els.favBtn.addEventListener('click', () => {
      const triad = TRIADS[state.triadIdx];
      const entry = { hex: state.hex, line: state.line, triad };
      try {
        const raw = localStorage.getItem('fsim_favs');
        const list = raw ? JSON.parse(raw) : [];
        const key = `${entry.hex}_${entry.line}_${entry.triad}`;
        if (!list.find(x => `${x.hex}_${x.line}_${x.triad}`===key)) list.push(entry);
        localStorage.setItem('fsim_favs', JSON.stringify(list));
        renderFavs();
      } catch {}
    });
    renderFavs();
  }

  function renderFavs(){
    const wrap = els.favList; wrap.innerHTML = '';
    let list = [];
    try { list = JSON.parse(localStorage.getItem('fsim_favs')||'[]') || []; } catch {}
    list.forEach(it => {
      const b = document.createElement('button');
      b.className = 'fav';
      b.textContent = `${it.hex}-${it.line}-${it.triad}`;
      b.addEventListener('click', () => {
        state.hex = clamp(it.hex,1,64);
        state.line = clamp(it.line,1,6);
        state.triadIdx = Math.max(0, TRIADS.indexOf(it.triad));
        syncControls();
        updatePatternSelection();
        updateAll();
      });
      wrap.appendChild(b);
    });
  }

  function initSearch(){
    els.searchBtn.addEventListener('click', doSearch);
    els.searchInput.addEventListener('keydown', (e)=>{ if (e.key==='Enter') doSearch(); });
  }
  function doSearch(){
    const q = els.searchInput.value.trim();
    const out = els.searchResults; out.innerHTML = '';
    if (!q) return;
    const results = futureSimData.searchLoaded(q).slice(0, 50);
    if (!results.length){
      out.innerHTML = `<div class="small">一致なし（読み込み済みから検索）</div>`;
      return;
    }
    results.forEach(r => {
      const div = document.createElement('div');
      div.className = 'search-item';
      div.innerHTML = `<div><b>${r.hex}-${r.line}-${r.triad}</b></div><div class="small">${escapeHtml(r.oneLine)}</div>`;
      div.addEventListener('click', () => {
        state.hex = r.hex; state.line = r.line; state.triadIdx = TRIADS.indexOf(r.triad);
        syncControls(); updatePatternSelection(); updateAll();
        out.innerHTML = '';
      });
      out.appendChild(div);
    });
  }

  function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

  function syncControls(){
    els.hexSelect.value = String(state.hex);
    els.lineSelect.value = String(state.line);
  }

  function initControls(){
    // hex select
    els.hexSelect.addEventListener('change', () => {
      state.hex = clamp(Number(els.hexSelect.value),1,64);
      updateAll();
    });
    // line
    els.lineSelect.addEventListener('change', () => {
      state.line = clamp(Number(els.lineSelect.value),1,6);
      els.lineSelect.value = String(state.line);
      updateAll();
    });
    els.prevLine.addEventListener('click', () => { state.line = clamp(state.line-1,1,6); syncControls(); updateAll(); });
    els.nextLine.addEventListener('click', () => { state.line = clamp(state.line+1,1,6); syncControls(); updateAll(); });
    // pattern next/prev
    els.nextPattern.addEventListener('click', () => { state.triadIdx = (state.triadIdx+1)%TRIADS.length; updatePatternSelection(); updateAll(); });
    els.prevPattern.addEventListener('click', () => { state.triadIdx = (state.triadIdx-1+TRIADS.length)%TRIADS.length; updatePatternSelection(); updateAll(); });
    // mode toggle
    els.modeDetailed.addEventListener('click', ()=> setMode('detailed'));
    els.modeSimple.addEventListener('click', ()=> setMode('simple'));
  }

  function init(){
    els.hexSelect = $('hexSelect');
    els.lineSelect = $('lineSelect');
    els.patternGrid = $('patternGrid');
    els.status = $('status');
    els.oneLine = $('oneLine');
    els.meta = $('meta');
    els.keywords = $('keywords');
    els.prevLine = $('prevLine');
    els.nextLine = $('nextLine');
    els.nextPattern = $('nextPattern');
    els.prevPattern = $('prevPattern');
    els.searchInput = $('searchInput');
    els.searchBtn = $('searchBtn');
    els.searchResults = $('searchResults');
    els.favBtn = $('favBtn');
    els.favList = $('favList');
    els.modeDetailed = $('mode-detailed');
    els.modeSimple = $('mode-simple');
    els.cardsGrid = $('cardsGrid');
    // New sections
    els.userInput = $('userInput');
    els.runAnalysis = $('runAnalysis');
    els.nowHexName = $('nowHexName');
    els.nowHexLine = $('nowHexLine');
    els.nowStrength = $('nowStrength');
    els.nowSummary = $('nowSummary');
    els.top3List = $('top3List');
    els.top3Why = $('top3Why');
    els.compareBucket = $('compareBucket');

    loadState();
    populateHexSelect();
    renderPatternGrid();
    updatePatternSelection();
    syncControls();
    initControls();
    initSearch();
    initFav();
    setMode(state.mode);

    // Run analysis: 現状は入力を保存し、hex/lineは既存UIに従う簡易実装
    els.runAnalysis?.addEventListener('click', () => {
      const txt = (els.userInput?.value || '').trim();
      if (txt) localStorage.setItem('fsim_user_input', txt);
      updateAll();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
