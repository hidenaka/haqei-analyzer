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

    loadState();
    populateHexSelect();
    renderPatternGrid();
    updatePatternSelection();
    syncControls();
    initControls();
    initSearch();
    initFav();
    setMode(state.mode);
  }

  document.addEventListener('DOMContentLoaded', init);
})();

