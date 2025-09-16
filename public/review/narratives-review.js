(() => {
  const DB = (window.__CHAIN_NARRATIVES__ || {});
  const keysAll = Object.keys(DB);
  const state = {
    keys: [...keysAll],
    idx: 0,
    done: new Set(JSON.parse(localStorage.getItem('nr_done') || '[]')),
    edits: JSON.parse(localStorage.getItem('nr_edits') || '{}'),
    filters: { hex: '', pos: '', pat: '', onlyUndone: false },
  };

  const el = id => document.getElementById(id);
  const entryKey = el('entryKey');
  const routePill = el('routePill');
  const patPill = el('patPill');
  const qualityPill = el('qualityPill');
  const donePill = el('donePill');
  const bodyBox = el('bodyBox');
  const suitBox = el('suitBox');
  const cautionBox = el('cautionBox');
  const stats = el('stats');
  const progressPill = el('progressPill');
  const saveHint = el('saveHint');

  function splitSents(t){ return String(t||'').split('。').map(s=>s.trim()).filter(Boolean); }
  function audit(body){
    const s = splitSents(body);
    const issues = [];
    if (s.length < 2) issues.push('短い');
    if (s.length > 6) issues.push('長い');
    const first = (s[0]||'');
    if (/^続いて|^そこで|^最後に/.test(first)) issues.push('接続不自然');
    if (/。。|、、|，，/.test(body)) issues.push('句読点重複');
    return issues;
  }

  function parseKey(k){
    const m = k.match(/^(.*?)\s+(初九|九二|九三|九四|九五|上六|上九|用九|用六)\s*\|\s*(JJJ|JJH|JHJ|JHH|HJJ|HJH|HHJ|HHH)$/);
    return m ? { hex:m[1], pos:m[2], pat:m[3] } : { hex:'', pos:'', pat:'' };
  }

  function applyFilters(){
    const { hex, pos, pat, onlyUndone } = state.filters;
    state.keys = keysAll.filter(k => {
      const info = parseKey(k);
      if (hex && info.hex !== hex) return false;
      if (pos && info.pos !== pos) return false;
      if (pat && info.pat !== pat) return false;
      if (onlyUndone && state.done.has(k)) return false;
      return true;
    });
    state.idx = 0;
    render();
  }

  function loadToUI(){
    const k = state.keys[state.idx];
    const v = DB[k] || {};
    const info = parseKey(k);
    entryKey.textContent = k || '(なし)';
    routePill.textContent = `起点: ${v.start?.hex||'?'} ${v.start?.pos||'?'} → 最終: ${v.final?.hex||'?'} ${v.final?.pos||'?'} `;
    patPill.textContent = `パターン: ${info.pat}`;
    const issues = audit(v.chain_long||'');
    qualityPill.textContent = issues.length ? `確認推奨: ${issues.join(' / ')}` : 'OK';
    qualityPill.className = 'pill ' + (issues.length ? 'warn' : 'ok');
    donePill.textContent = state.done.has(k) ? '確認済み' : '未確認';
    bodyBox.value = (state.edits[k]?.chain_long) ?? (v.chain_long||'');
    suitBox.value = (state.edits[k]?.suitability) ?? (v.suitability||'');
    cautionBox.value = (state.edits[k]?.caution) ?? (v.caution||'');
    const sCount = splitSents(bodyBox.value).length;
    const len = bodyBox.value.length;
    stats.textContent = `文数: ${sCount} / 文字数: ${len}`;
    progressPill.textContent = `${state.idx+1} / ${state.keys.length}`;
  }

  function render(){
    if (state.keys.length === 0){
      entryKey.textContent = '（該当なし）';
      bodyBox.value = ''; suitBox.value=''; cautionBox.value='';
      progressPill.textContent = '0 / 0';
      return;
    }
    loadToUI();
  }

  function saveCurrent(){
    const k = state.keys[state.idx];
    state.edits[k] = {
      chain_long: bodyBox.value.trim(),
      suitability: suitBox.value.trim(),
      caution: cautionBox.value.trim()
    };
    localStorage.setItem('nr_edits', JSON.stringify(state.edits));
    saveHint.textContent = '保存しました（ブラウザ内）';
    setTimeout(()=> saveHint.textContent = '', 1500);
  }

  function markDone(){
    const k = state.keys[state.idx];
    state.done.add(k);
    localStorage.setItem('nr_done', JSON.stringify([...state.done]));
    render();
  }

  function next(){ if (state.idx < state.keys.length-1){ state.idx++; render(); } }
  function prev(){ if (state.idx > 0){ state.idx--; render(); } }

  function exportJSON(){
    // Apply edits on top of DB and download
    const merged = JSON.parse(JSON.stringify(DB));
    for (const [k, ed] of Object.entries(state.edits)){
      if (!merged[k]) continue;
      if (ed.chain_long) merged[k].chain_long = ed.chain_long;
      merged[k].suitability = ed.suitability ?? merged[k].suitability;
      merged[k].caution = ed.caution ?? merged[k].caution;
      merged[k].updated_at = new Date().toISOString();
    }
    const blob = new Blob([JSON.stringify(merged, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'narratives_chain.v1.reviewed.json';
    a.click();
    setTimeout(()=> URL.revokeObjectURL(a.href), 1000);
  }

  // Filters
  (function initFilters(){
    const hexSet = new Set();
    keysAll.forEach(k=>{ const info = parseKey(k); if (info.hex) hexSet.add(info.hex); });
    const hexSel = document.getElementById('filterHex');
    hexSel.innerHTML = '<option value="">卦: すべて</option>' + [...hexSet].map(h=>`<option>${h}</option>`).join('');
    hexSel.addEventListener('change', (e)=>{ state.filters.hex = e.target.value; applyFilters(); });
    document.getElementById('filterPos').addEventListener('change', (e)=>{ state.filters.pos = e.target.value; applyFilters(); });
    document.getElementById('filterPat').addEventListener('change', (e)=>{ state.filters.pat = e.target.value; applyFilters(); });
    document.getElementById('onlyUndone').addEventListener('change', (e)=>{ state.filters.onlyUndone = e.target.checked; applyFilters(); });
  })();

  // Buttons
  document.getElementById('nextBtn').addEventListener('click', next);
  document.getElementById('prevBtn').addEventListener('click', prev);
  document.getElementById('saveBtn').addEventListener('click', saveCurrent);
  document.getElementById('markDoneBtn').addEventListener('click', ()=>{ saveCurrent(); markDone(); next(); });
  document.getElementById('exportBtn').addEventListener('click', exportJSON);

  // Keyboard shortcuts
  window.addEventListener('keydown', (e)=>{
    if (e.target && (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT')) return;
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
    if (e.key.toLowerCase() === 's') saveCurrent();
    if (e.key.toLowerCase() === 'd') { saveCurrent(); markDone(); next(); }
  });

  // First render
  applyFilters();
})();

