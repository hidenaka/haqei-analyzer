/**
 * EightScenariosDisplay - 8つの未来シナリオの可視化表示
 * 3段階の選択過程を明確に表示し、易経的意味付けを含む
 */

console.log('🎯 EightScenariosDisplay Loading...');

(function(global) {
  'use strict';

  class EightScenariosDisplay {
    constructor(options = {}) {
      
    // v4.3.1 決定論的要件: SeedableRandom統合
    this.rng = options.randomnessManager || window.randomnessManager || 
               (() => { throw new Error('RandomnessManager required for deterministic behavior'); });
    this.name = 'EightScenariosDisplay';
      this.version = '2.0.0';
      this.container = null;
      this.scenarios = [];
      this.selectedScenario = null;
      this.threeStageProcess = null;
      // 分析入力テキスト（現在地バーに表示）
      this.userInputText = '';
      // 意図・おすすめ・比較
      this.userIntent = 'maintain';
      this.recommendedIds = new Set();
      this.compareSelected = [];
    }

    _buildDetailedReasons(cs) {
      try {
        if (!cs) return '';
        const ig = window.iChingGuidance;
        const input = String(this.userInputText||'');
        const sem = (ig && input) ? ig.getSemantics(input) : { keywords:[], categories:[], frames:[] };
        const frames = Array.isArray(sem.frames) ? sem.frames : [];
        const cats = Array.isArray(sem.categories) ? sem.categories : [];
        // 候補（現在地）のカテゴリを推定
        let entryCats = [];
        try {
          const e = cs.rawData || {};
          const kw = Array.isArray(e['キーワード']) ? e['キーワード'] : String(e['キーワード']||'').split(/[、,\s]+/).filter(Boolean);
          const summary = String(e['現代解釈の要約']||'');
          const tokens = kw.concat(summary.split(/[\s\p{P}\p{S}、。・…！？!?,，．。]+/u).filter(Boolean));
          const norm = ig && ig.normalizeTokens ? ig.normalizeTokens(tokens) : tokens.map(s=>String(s).toLowerCase());
          const set = new Set(norm);
          entryCats = ig && ig.detectCategories ? Array.from(ig.detectCategories(set)) : [];
        } catch {}
        // ブリッジング誘導の明示化
        let bridgeLines = '';
        try {
          const bridging = (ig && ig.bridging) ? ig.bridging : [];
          const hasCats = new Set(cats);
          const entrySet = new Set(entryCats);
          const matched = [];
          bridging.forEach(rule => {
            if (hasCats.has(rule.has)) {
              const favored = (rule.favors||[]).filter(f => entrySet.has(f));
              if (favored.length) matched.push({ has: rule.has, favors: favored, w: rule.w });
            }
          });
          if (matched.length) {
            bridgeLines = matched.map(m => `・「${m.has}」の文脈 → 「${m.favors.join('／')}」を優先（+${m.w}）`).join('<br/>');
          }
        } catch {}
        // キーワード/カテゴリ一致
        const rs = cs.reasons || {};
        const kw = (rs.matchKw||[]).slice(0,6).join('、');
        const mcat = (rs.matchCat||[]).slice(0,6).join('、');
        const sim = (typeof rs.tfidfSim === 'number' && rs.tfidfSim>0) ? `・意味近接(TF‑IDF): ${(rs.tfidfSim*100).toFixed(1)}%` : '';
        const simTerms = (rs.tfidfTerms&&rs.tfidfTerms.length) ? `・近接語: ${rs.tfidfTerms.join('、')}` : '';
        const frameLine = frames.length ? `・認識した文脈: ${frames.join('、')}` : '';
        const catLine = cats.length ? `・検出カテゴリ: ${cats.join('、')}` : '';
        const kwLine = kw ? `・キーワード一致: ${kw}` : '';
        const catMatchLine = mcat ? `・カテゴリ一致: ${mcat}` : '';
        const bridgeBlock = bridgeLines ? `・ブリッジ誘導:<br/>${bridgeLines}` : '';
        const resultLine = `・現在地: ${cs.hexagramName || ''} ${cs.yaoName || ''}`;
        const parts = [frameLine, catLine, kwLine, catMatchLine, sim, simTerms, bridgeBlock, resultLine].filter(Boolean);
        if (!parts.length) return '';
        return parts.join('<br/>');
      } catch { return ''; }
    }

    /**
     * 初期化
     */
    initialize(containerId) {
      // 解析前でもコンテナとスタイルは初期化しておく（後続のdisplayScenariosで描画可能に）
      if (!window.futureAnalysisCompleted) {
        console.log('⏳ EightScenariosDisplay initializing before analysis completion');
      } else {
        console.log('🔄 EightScenariosDisplay initializing...');
      }
      
      this.container = document.getElementById(containerId);
      if (!this.container) {
        console.error(`❌ Container not found: ${containerId}`);
        return false;
      }

      this.setupStyles();
      console.log('✅ EightScenariosDisplay initialized');
      return true;
    }

    /**
     * スタイル設定
     */
    setupStyles() {
      // 動的スタイルの追加
      if (!document.getElementById('eight-scenarios-styles')) {
        const style = document.createElement('style');
        style.id = 'eight-scenarios-styles';
        style.textContent = `
          .eight-scenarios-container {
            padding: 2rem;
            background: linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95));
            border-radius: 16px;
            border: 1px solid rgba(99, 102, 241, 0.2);
          }
          
          .scenario-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
          }
          
          .scenario-card {
            background: rgba(30, 41, 59, 0.8);
            border: 2px solid rgba(99, 102, 241, 0.3);
            border-radius: 12px;
            padding: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          
          .scenario-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 32px rgba(99, 102, 241, 0.4);
            border-color: rgba(99, 102, 241, 0.6);
          }
          
          .scenario-card.selected {
            background: rgba(99, 102, 241, 0.2);
            border-color: #6366F1;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
          }
          
          .scenario-rank {
            position: absolute;
            top: 0.75rem;
            right: 0.75rem;
            background: linear-gradient(135deg, #10B981, #059669);
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: bold;
          }
          
          .scenario-title {
            font-size: 1.125rem;
            font-weight: bold;
            color: #A5B4FC;
            margin-bottom: 0.75rem;
          }
          
          .scenario-path {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin: 1rem 0;
            padding: 0.75rem;
            background: rgba(17, 24, 39, 0.5);
            border-radius: 8px;
          }
          
          .path-stage {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
          }
          
          .path-arrow {
            color: #6366F1;
            font-size: 1.25rem;
          }
          
          .stage-label {
            font-size: 0.75rem;
            color: #9CA3AF;
            margin-bottom: 0.25rem;
          }
          
          .stage-choice {
            padding: 0.25rem 0.5rem;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 500;
            text-align: center;
          }
          
          .choice-conservative { background: rgba(59, 130, 246, 0.2); color: #60A5FA; }
          .choice-progressive { background: rgba(16, 185, 129, 0.2); color: #10B981; }
          .choice-collaborative { background: rgba(245, 158, 11, 0.2); color: #F59E0B; }
          .choice-independent { background: rgba(139, 92, 246, 0.2); color: #8B5CF6; }
          .choice-cautious { background: rgba(239, 68, 68, 0.2); color: #EF4444; }
          .choice-decisive { background: rgba(6, 182, 212, 0.2); color: #06B6D4; }
          
          .scenario-probability {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin: 0.75rem 0;
          }
          
          .probability-bar {
            flex: 1;
            height: 8px;
            background: rgba(55, 65, 81, 0.5);
            border-radius: 4px;
            overflow: hidden;
          }
          
          .probability-fill {
            height: 100%;
            background: linear-gradient(90deg, #3B82F6, #6366F1);
            border-radius: 4px;
            transition: width 0.3s ease;
          }
          
          .probability-text {
            font-size: 0.875rem;
            font-weight: bold;
            color: #A5B4FC;
            min-width: 45px;
            text-align: right;
          }
          
          .scenario-description {
            color: #D1D5DB;
            font-size: 0.875rem;
            line-height: 1.5;
            margin: 0.75rem 0;
          }
          
          .scenario-characteristics {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin: 0.75rem 0;
          }
          
          .characteristic-tag {
            padding: 0.25rem 0.5rem;
            background: rgba(99, 102, 241, 0.1);
            border: 1px solid rgba(99, 102, 241, 0.3);
            border-radius: 6px;
            font-size: 0.75rem;
            color: #C7D2FE;
          }
          
          .scenario-iching {
            margin-top: 1rem;
            padding: 0.75rem;
            background: rgba(165, 180, 252, 0.1);
            border-left: 3px solid #6366F1;
            border-radius: 4px;
          }
          
          .iching-hexagram {
            font-weight: bold;
            color: #FDE047;
            margin-bottom: 0.25rem;
          }
          
          .iching-meaning {
            font-size: 0.875rem;
            color: #E5E7EB;
            font-style: italic;
          }
          
          .three-stage-header {
            text-align: center;
            margin-bottom: 2rem;
          }
          
          .three-stage-title {
            font-size: 1.5rem;
            font-weight: bold;
            color: #A5B4FC;
            margin-bottom: 0.5rem;
          }
          
          .three-stage-subtitle {
            color: #9CA3AF;
            font-size: 1rem;
          }
          
          .stage-selector {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin: 2rem 0;
            padding: 1rem;
            background: rgba(17, 24, 39, 0.5);
            border-radius: 12px;
          }
          
          .stage-option {
            padding: 1rem 1.5rem;
            background: rgba(55, 65, 81, 0.5);
            border: 2px solid transparent;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .stage-option:hover {
            background: rgba(99, 102, 241, 0.2);
            border-color: rgba(99, 102, 241, 0.5);
          }
          
          .stage-option.selected {
            background: rgba(99, 102, 241, 0.3);
            border-color: #6366F1;
          }
          
          .option-title {
            font-weight: bold;
            color: #E5E7EB;
            margin-bottom: 0.25rem;
          }
          
          .option-description {
            font-size: 0.875rem;
            color: #9CA3AF;
          }
        `;
        document.head.appendChild(style);
      }
    }

    /**
     * 8つのシナリオを表示
     */
    displayScenarios(scenarios, threeStageProcess, currentSituation = null, topCandidates = []) {
      if (!this.container) return;
      
      // 動的色システムを適用
      this.applyScenariosColors(scenarios);
      
      this.scenarios = scenarios;
      this.threeStageProcess = threeStageProcess;
      this.currentSituation = currentSituation || (threeStageProcess && threeStageProcess.currentSituation) || null;
      this.topCandidates = Array.isArray(topCandidates) ? topCandidates : [];
      
      // コンテナをクリア
      this.container.innerHTML = '';
      
      // メインコンテナ作成
      const mainContainer = document.createElement('div');
      mainContainer.className = 'eight-scenarios-container';
      
      // ヘッダー追加
      mainContainer.appendChild(this.createHeader());

      // 現在地の固定要約バー（入力と現在地の要旨を表示）
      mainContainer.appendChild(this.createCurrentSummaryBar());

      // 外部辞書のロード
      this._ensureLineStatesLoaded();
      this._ensureScenarioCopyLoaded();

      // 意図トグル
      mainContainer.appendChild(this.createIntentToggle());

      // おすすめ（簡素カード）と比較トレイ
      const recoPanel = document.createElement('div');
      recoPanel.id = 'recommendations-panel';
      mainContainer.appendChild(recoPanel);
      const compareTray = document.createElement('div');
      compareTray.id = 'compare-tray';
      compareTray.style.cssText = 'margin:.5rem 0;display:none;';
      mainContainer.appendChild(compareTray);

      // 3段階セレクターは現在非表示（要望により一旦撤去）
      
      // おすすめ計算と表示
      this._updateRecommendations(scenarios);
      this._renderRecommendationsPanelCards(recoPanel, scenarios);

      // シナリオグリッド追加
      const grid = this.createScenarioGrid(scenarios);
      mainContainer.appendChild(grid);

      // 比較トレイ初期描画
      this._renderCompareTray(compareTray, scenarios);

      // スコア比較グラフは末尾に配置（必要な時のみ参照）
      mainContainer.appendChild(this.createScoreComparisonChart(scenarios));
      
      this.container.appendChild(mainContainer);
    }

    _ensureLineStatesLoaded() {
      if (this._lineStatesLoading || this.lineStates) return;
      this._lineStatesLoading = true;
      const url = `/data/h384-line-states.json?v=${encodeURIComponent(this.version || '1.0.0')}`;
      fetch(url).then(r=>r.json()).then(json=>{
        this.lineStates = json;
      }).catch(()=>{
        this.lineStates = null;
      }).finally(()=>{ this._lineStatesLoading = false; });
    }

    _getLineState(hex, line) {
      try {
        if (!this.lineStates) return '';
        const key = `${Number(hex)}-${Number(line)}`;
        return this.lineStates[key] || '';
      } catch { return ''; }
    }

    _ensureScenarioCopyLoaded() {
      if (this._copyLoading || this.copyDict) return;
      this._copyLoading = true;
      const url = `/data/scenario-copy.json?v=${encodeURIComponent(this.version || '1.0.0')}`;
      fetch(url).then(r=> r.ok ? r.json() : Promise.reject(new Error('copy not found')))
        .then(json => { this.copyDict = json || {}; })
        .catch(()=>{ this.copyDict = null; })
        .finally(()=>{ this._copyLoading = false; });
    }

    // 現在地の固定要約ヘッダー（1–2行）
    createCurrentSummaryBar() {
      try {
        const bar = document.createElement('div');
        bar.id = 'current-summary-bar';
        bar.style.cssText = 'position:sticky;top:0;z-index:30;background:rgba(2,6,23,.85);backdrop-filter:blur(6px);border:1px solid rgba(99,102,241,.25);border-radius:10px;padding:.5rem .75rem;margin:.5rem 0;color:#cbd5e1;display:flex;gap:.75rem;align-items:center;flex-wrap:wrap;';

        const cs = this.currentSituation || (this.threeStageProcess && this.threeStageProcess.currentSituation) || {};
        const name = (cs.hexagramName && cs.yaoName) ? `${String(cs.hexagramName).trim()} ${String(cs.yaoName).trim()}` : '現在の状況';
        const s0 = this._getCurrentBaseScoreFromH384();
        // threeStageProcessにスコアがない場合もあるので、表示は名称中心に
        const left = document.createElement('div');
        left.style.cssText = 'display:flex;gap:.5rem;align-items:center;flex-wrap:wrap;';
        left.innerHTML = `
          <span style="color:#a5b4fc;font-weight:700;">Now</span>
          <span style="color:#e5e7eb;">${name}</span>
          ${Number.isFinite(s0) ? `<span style="color:#94a3b8;">現在地点の土台の強さ ${Math.round(s0)}</span>` : ''}
        `;

        const right = document.createElement('div');
        right.style.cssText = 'margin-left:auto;color:#c7d2fe;display:flex;gap:.35rem;align-items:center;';
        const snippet = (() => {
          const t = (this.userInputText||'').replace(/[\r\n]+/g,' ').trim();
          if (!t) return '';
          const max = 40;
          const short = t.length > max ? t.slice(0,max) + '…' : t;
          const safeTitle = t.replace(/"/g,'&quot;');
          return `<span style="opacity:.7;color:#94a3b8;">入力</span><span title="${safeTitle}" style="max-width:420px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#e5e7eb;">「${short}」</span>`;
        })();
        right.innerHTML = snippet;

        // 理由（システムの理解）: 行状態辞書を直接提示
        const reason = document.createElement('div');
        reason.style.cssText = 'flex-basis:100%;display:block;color:#cbd5e1;margin-top:.25rem;';
        let lineText = '';
        try {
          const hex = Number(cs.hexagramNumber || cs['卦番号']);
          const yaoName = String(cs.yaoName || cs['爻'] || '');
          const lineMap = { '初九':1,'九二':2,'九三':3,'九四':4,'九五':5,'上九':6,'初六':1,'六二':2,'六三':3,'六四':4,'六五':5,'上六':6 };
          const line = lineMap[yaoName];
          if (Number.isFinite(hex) && Number.isFinite(line)) {
            lineText = this._getLineState(hex, line) || '';
          }
        } catch {}

        if (lineText) {
          const summary = document.createElement('div');
          summary.style.cssText = 'background:rgba(99,102,241,.08);border:1px solid rgba(99,102,241,.25);border-radius:8px;padding:.5rem .6rem;';
          summary.innerHTML = `<span style="color:#a5b4fc;font-weight:700;">理由（システムの理解）</span><br/>${this._normalizeJa(lineText)}`;
          reason.appendChild(summary);
        }

        bar.appendChild(left);
        bar.appendChild(right);
        if (lineText) bar.appendChild(reason);

        // 詳細な理由（文脈→解釈の明示）
        const detailWrap = document.createElement('div');
        detailWrap.style.cssText = 'flex-basis:100%;margin-top:.25rem;';
        const details = this._buildDetailedReasons(cs);
        if (details) {
          const toggleId = `reason-details-${Date.now().toString(36)}`;
          detailWrap.innerHTML = `
            <button type="button" aria-expanded="false" aria-controls="${toggleId}" style="font-size:.8rem;color:#c7d2fe;background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.35);padding:.2rem .5rem;border-radius:6px;cursor:pointer;">詳細理由を表示</button>
            <div id="${toggleId}" style="display:none;margin-top:.4rem;border-left:2px solid rgba(99,102,241,.35);padding-left:.6rem;color:#cbd5e1;font-size:.85rem;line-height:1.5;">${details}</div>
          `;
          const btn = detailWrap.querySelector('button');
          const panel = detailWrap.querySelector(`#${toggleId}`);
          btn.addEventListener('click', () => {
            const vis = panel.style.display === 'none';
            panel.style.display = vis ? 'block' : 'none';
            btn.textContent = vis ? '詳細理由を隠す' : '詳細理由を表示';
            btn.setAttribute('aria-expanded', String(vis));
          });
          bar.appendChild(detailWrap);
        }
        return bar;
      } catch {
        return document.createElement('div');
      }
    }

    // 現在地（卦・爻）からH384_DATAのS1_基本スコアを取得
    _getCurrentBaseScoreFromH384() {
      try {
        const cs = this.threeStageProcess && this.threeStageProcess.currentSituation ? this.threeStageProcess.currentSituation : {};
        const hex = Number(cs.hexagramNumber || cs['卦番号']);
        const yaoName = String(cs.yaoName || cs['爻'] || '');
        const lineMap = { '初九':1,'九二':2,'九三':3,'九四':4,'九五':5,'上九':6,'初六':1,'六二':2,'六三':3,'六四':4,'六五':5,'上六':6 };
        const line = lineMap[yaoName];
        if (!window.H384_DATA || !Number.isFinite(hex) || !Number.isFinite(line)) return NaN;
        const idx = (hex - 1) * 6 + (line - 1);
        const entry = window.H384_DATA[idx];
        const s0 = Number(entry && entry['S1_基本スコア']);
        return s0;
      } catch { return NaN; }
    }

  // 分析入力テキストを保持（現在地バーで表示）
  setUserInput(text) {
    try { this.userInputText = String(text || ''); } catch { this.userInputText = ''; }
  }

  // 軽い日本語正規化
  _normalizeJa(s) {
    try {
      if (!s) return '';
      let t = String(s);
      const rules = [
        [/素早らしい/g, '素早い'],
        [/がちなになりがち/g, 'がち'],
        [/です、/g, 'です。'],
        [/、、+/g, '、'],
        [/。。+/g, '。']
      ];
      for (const [a,b] of rules) t = t.replace(a,b);
      return t.trim();
    } catch { return String(s || ''); }
  }

  // 意図トグル
  createIntentToggle() {
    const wrap = document.createElement('div');
    wrap.className = 'intent-toggle';
    wrap.style.cssText = 'display:flex;gap:.5rem;align-items:center;justify-content:flex-start;margin:.5rem 0 0;';
    const label = document.createElement('div');
    label.textContent = 'あなたの意図:';
    label.style.cssText = 'color:#cbd5e1;font-size:.9rem;';
    const mkBtn = (key, text) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = text;
      b.dataset.intent = key;
      b.style.cssText = 'padding:.3rem .6rem;border-radius:999px;border:1px solid rgba(99,102,241,.35);background:rgba(99,102,241,.1);color:#c7d2fe;font-size:.85rem;cursor:pointer;';
      const sync = () => {
        if (this.userIntent === key) { b.style.background = 'rgba(99,102,241,.35)'; b.style.color = '#fff'; }
        else { b.style.background = 'rgba(99,102,241,.1)'; b.style.color = '#c7d2fe'; }
      };
      b.addEventListener('click', () => {
        this.userIntent = key;
        Array.from(wrap.querySelectorAll('button[data-intent]')).forEach(btn => {
          if (btn.dataset.intent === this.userIntent) { btn.style.background = 'rgba(99,102,241,.35)'; btn.style.color = '#fff'; }
          else { btn.style.background = 'rgba(99,102,241,.1)'; btn.style.color = '#c7d2fe'; }
        });
        if (Array.isArray(this.scenarios) && this.scenarios.length) {
          this._updateRecommendations(this.scenarios);
          const panel = document.getElementById('recommendations-panel');
          if (panel) this._renderRecommendationsPanelCards(panel, this.scenarios);
        }
        try { this.container && this.container.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch {}
      });
      setTimeout(sync, 0);
      return b;
    };
    wrap.appendChild(label);
    wrap.appendChild(mkBtn('maintain','安定志向'));
    wrap.appendChild(mkBtn('improve','変革志向'));
    wrap.appendChild(mkBtn('recovery','回復志向'));
    return wrap;
  }

  _renderRecommendationsPanelCards(panelEl, scenarios) {
    try {
      const top = this._topRecommendations || [];
      panelEl.innerHTML = '';
      const header = document.createElement('div');
      header.textContent = 'あなたへの候補';
      header.style.cssText = 'margin:.35rem 0 .5rem;color:#cbd5e1;font-size:.9rem;';
      panelEl.appendChild(header);
      const list = document.createElement('div');
      list.style.cssText = 'display:flex;gap:.75rem;flex-wrap:wrap;';
      panelEl.appendChild(list);
      top.forEach((id) => {
        const s = scenarios.find(x => x.id === id);
        if (!s) return;
        const phases = this.calculateThreePhases(s);
        const scores = this.calculateScoreProgression(s, phases);
        const metrics = this._computeScenarioMetrics(s, scores);
        const triadLocal = (s.route||[]).map(r=>r==='progress'?'J':'H').join('');
        const decide = this._decideTypeAndAction(triadLocal, metrics, '');
        const net = metrics.series.S3 - metrics.series.S0; const sign = net>0?'+':''; const col = net>0?'#34D399': net<0?'#F87171':'#94a3b8';
        const mini = document.createElement('div');
        mini.className = 'reco-mini-card';
        mini.style.cssText = 'flex:1;min-width:260px;border:1px solid rgba(99,102,241,.35);border-radius:10px;padding:.5rem .75rem;background:rgba(17,24,39,.5);cursor:pointer;';
        mini.innerHTML = `
          <div style="display:flex;align-items:center;gap:.5rem;">
            <span class="type-stamp" style="background:${decide.color}1A;border:1px solid ${decide.color}80;color:${decide.color};padding:.1rem .45rem;border-radius:999px;font-size:.75rem;font-weight:700;">${decide.type}</span>
            <span class="sparkline">${this._buildSparkline([metrics.series.S0,metrics.series.S1,metrics.series.S2,metrics.series.S3])}</span>
            <span style="margin-left:auto;color:${col};font-weight:700;">合計差分 ${sign}${net}</span>
            <span class="action-chip" style="background:rgba(148,163,184,.15);border:1px solid rgba(148,163,184,.4);color:#E5E7EB;padding:.1rem .45rem;border-radius:999px;font-size:.75rem;">${decide.action}</span>
          </div>`;
        mini.addEventListener('click', () => {
          const gridCard = this.container.querySelector(`[data-scenario-id="${s.id}"]`);
          if (gridCard) { gridCard.scrollIntoView({ behavior: 'smooth', block: 'center' }); this.selectScenario(s); }
        });
        list.appendChild(mini);
      });
    } catch { panelEl.innerHTML=''; }
  }

  _updateRecommendations(scenarios) {
    try {
      const scored = scenarios.map(s => {
        const phases = this.calculateThreePhases(s);
        const scores = this.calculateScoreProgression(s, phases);
        const metrics = this._computeScenarioMetrics(s, scores);
        const fits = this._computeIntentFits(s, metrics);
        return { id: s.id, fits };
      });
      const key = this.userIntent || 'maintain';
      scored.sort((a,b) => (b.fits[key]||0) - (a.fits[key]||0));
      this._topRecommendations = scored.slice(0,2).map(x => x.id);
      this.recommendedIds = new Set(this._topRecommendations);
    } catch { this._topRecommendations = []; this.recommendedIds = new Set(); }
  }

  _computeIntentFits(scenario, metrics) {
    const s0 = metrics.series.S0, s3 = metrics.series.S3;
    const net = s3 - s0;
    const prob = (typeof scenario.probability === 'number') ? (scenario.probability>1? scenario.probability/100 : scenario.probability) : 0.5;
    const n = (v, m) => Math.max(0, Math.min(1, m ? v/m : v));
    const improve = Math.max(0, 0.6*n(net, 100) + 0.2*Math.max(0, Math.min(1, prob)) - 0.2*n(metrics.maxDrawdown, 30));
    const maintain = Math.max(0, 0.6*(1 - n(Math.abs(net), 100)) + 0.2*Math.max(0, Math.min(1, prob)) - 0.2*n(metrics.avgAbsDelta, 20));
    const recovery = Math.max(0, 0.5*Math.max(0, Math.min(1, metrics.recoveryRatio)) + 0.3*(1 - n(metrics.maxDrawdown, 30)) - 0.2*n(metrics.osc, 3));
    return { improve, maintain, recovery };
  }

  _buildSparkline(series) {
    try {
      const [S0,S1,S2,S3] = series;
      const W = 120, H = 24, P = 6;
      const xs = [P, W/3, (2*W)/3, W-P];
      const clamp01 = v => Math.max(0, Math.min(100, v));
      const ys = [S0,S1,S2,S3].map(s => H - Math.round((clamp01(s) / 100) * (H-2)) - 1);
      const seg = (i, color) => `<line x1="${xs[i]}" y1="${ys[i]}" x2="${xs[i+1]}" y2="${ys[i+1]}" stroke="${color}" stroke-width="2" stroke-linecap="round" />`;
      const lines = [];
      const cUp = '#60A5FA', cDown = '#F87171';
      lines.push(seg(0, ys[1] < ys[0] ? cUp : ys[1] > ys[0] ? cDown : '#94a3b8'));
      lines.push(seg(1, ys[2] < ys[1] ? cUp : ys[2] > ys[1] ? cDown : '#94a3b8'));
      lines.push(seg(2, ys[3] < ys[2] ? cUp : ys[3] > ys[2] ? cDown : '#94a3b8'));
      const dots = [0,1,2,3].map(i => `<circle cx="${xs[i]}" cy="${ys[i]}" r="${i===3?2.8:1.8}" fill="${i===3?'#e5e7eb':'#cbd5e1'}" stroke="#64748b" stroke-width="0.5" />`).join('');
      return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${lines.join('')}${dots}</svg>`;
    } catch { return ''; }
  }

  _deriveKeywordFlags(kwsText) {
    const has = (re) => new RegExp(re).test(kwsText||'');
    return { cautious: has('慎重|警戒|危険回避'), reform: has('改革|断行|決断|突破'), coop: has('協力|合意|信頼|配慮') };
  }

  _decideTypeAndAction(triad, metrics, kwsText) {
    const flags = this._deriveKeywordFlags(kwsText);
    const net = (metrics?.series?.S3||0) - (metrics?.series?.S0||0);
    const mostlyJ = (triad.match(/J/g)||[]).length >= 2;
    const hasH = (triad.match(/H/g)||[]).length >= 1;
    let type = 'バランス型';
    let color = '#94a3b8';
    if (metrics.recoveryRatio > 0.7 && (metrics.timeBelowStart>0 || metrics.maxDrawdown>0)) { type='回復安定型'; color='#10B981'; }
    if (hasH && net > 0 && metrics.avgAbsDelta >= 2) { type='転換上振れ型'; color='#F59E0B'; }
    if (mostlyJ && net >= 0 && metrics.avgAbsDelta < 3) { type='安定伸長型'; color='#60A5FA'; }
    let action = '整える';
    if (flags.reform) action = '切替';
    else if (flags.cautious) action = '安全';
    else if (flags.coop) action = '協調';
    else if (net >= 5) action = '集中';
    return { type, color, action };
  }

  _computeScenarioMetrics(scenario, fallbackScores) {
    const triad = (scenario.route||[]).map(r=>r==='progress'?'J':'H').join('');
    const clamp100 = v => Math.max(0, Math.min(100, Math.round(v || 0)));
    const series = [fallbackScores.current, fallbackScores.phase1, fallbackScores.phase2, fallbackScores.phase3].map(clamp100);
    const [S0,S1,S2,S3] = series;
    const d1 = S1 - S0, d2 = S2 - S1, d3 = S3 - S2;
    let peak = S0, maxDD = 0;
    for (const s of series) { if (s > peak) peak = s; maxDD = Math.max(maxDD, peak - s); }
    const avgAbsDelta = (Math.abs(d1)+Math.abs(d2)+Math.abs(d3))/3;
    const osc = (Math.sign(d2) !== Math.sign(d1) ? 1 : 0) + (Math.sign(d3) !== Math.sign(d2) ? 1 : 0);
    const timeBelowStart = [S1,S2,S3].filter(s => s < S0).length;
    const timeBelow50 = [S0,S1,S2,S3].filter(s => s < 50).length;
    const minS = Math.min(S0,S1,S2,S3);
    const recoveryRatio = (S3 - minS) / Math.max(1, (S0 - minS));
    const countJ = (triad.match(/J/g)||[]).length; const countH = (triad.match(/H/g)||[]).length;
    const changeIntensity = countH + 0.5*countJ;
    const n = (v, m) => Math.max(0, Math.min(1, v/m));
    const D = 100 * Math.max(0, Math.min(1,
      0.30*(1 - S3/100) + 0.25*n(maxDD, 30) + 0.15*n(avgAbsDelta, 20) + 0.08*n(osc, 3) + 0.07*n(timeBelowStart, 3) + 0.07*n(timeBelow50, 4) + 0.06*n(changeIntensity, 3) - 0.10*Math.max(0, Math.min(1, recoveryRatio))
    ));
    const difficulty = Math.round(D);
    const difficultyLabel = difficulty >= 70 ? '高' : difficulty >= 40 ? '中' : '低';
    return { series: { S0,S1,S2,S3, d1,d2,d3 }, maxDrawdown: Math.round(maxDD), avgAbsDelta: Math.round(avgAbsDelta*10)/10, osc, timeBelowStart, timeBelow50, recoveryRatio: Math.round(recoveryRatio*100)/100, changeIntensity, difficulty, difficultyLabel };
  }

  _toggleCompare(id, on) {
    try {
      if (on) {
        if (this.compareSelected.includes(id)) return this._renderCompareTray(document.getElementById('compare-tray'), this.scenarios);
        this.compareSelected.push(id);
        while (this.compareSelected.length > 2) this.compareSelected.shift();
      } else {
        this.compareSelected = this.compareSelected.filter(x => x !== id);
      }
      this._renderCompareTray(document.getElementById('compare-tray'), this.scenarios);
    } catch {}
  }

  _renderCompareTray(trayEl, scenarios) {
    try {
      if (!trayEl) return;
      if (!this.compareSelected.length) { trayEl.style.display = 'none'; trayEl.innerHTML = ''; return; }
      trayEl.style.display = 'block';
      const head = document.createElement('div');
      head.style.cssText = 'color:#cbd5e1;font-size:.9rem;margin-bottom:.25rem;display:flex;gap:.5rem;align-items:center;';
      head.innerHTML = `比較中 (${this.compareSelected.length}/2)`;
      const clearBtn = document.createElement('button');
      clearBtn.textContent = 'クリア';
      clearBtn.style.cssText = 'margin-left:.5rem;padding:.15rem .5rem;border:1px solid rgba(148,163,184,.4);border-radius:6px;background:rgba(148,163,184,.1);color:#e5e7eb;cursor:pointer;';
      clearBtn.onclick = () => { this.compareSelected = []; this._renderCompareTray(trayEl, scenarios); };
      head.appendChild(clearBtn);
      const itemsWrap = document.createElement('div');
      itemsWrap.style.cssText = 'display:flex;gap:.75rem;flex-wrap:wrap;';
      const items = this.compareSelected.map(id => scenarios.find(s => s.id === id)).filter(Boolean);
      items.forEach(s => {
        const phases = this.calculateThreePhases(s);
        const scores = this.calculateScoreProgression(s, phases);
        const metrics = this._computeScenarioMetrics(s, scores);
        const net = metrics.series.S3 - metrics.series.S0; const sign = net>0?'+':''; const col = net>0?'#34D399': net<0?'#F87171':'#94a3b8';
        const card = document.createElement('div');
        card.style.cssText = 'flex:1;min-width:260px;border:1px solid rgba(99,102,241,.35);border-radius:10px;padding:.5rem .75rem;background:rgba(17,24,39,.5)';
        card.innerHTML = `
          <div style=\"display:flex;align-items:center;gap:.5rem;\">
            <div style=\"color:#a5b4fc;font-weight:700;\">シナリオ ${s.id}</div>
            <div>${this._buildSparkline([metrics.series.S0,metrics.series.S1,metrics.series.S2,metrics.series.S3])}</div>
            <div style=\"margin-left:auto;color:${col};font-weight:700;\">合計差分 ${sign}${net}</div>
          </div>
          <div style=\"display:flex;gap:.5rem;margin-top:.25rem;color:#cbd5e1;font-size:.85rem;\">
            <div>難易度: <strong style=\"color:${metrics.difficulty>=70?'#F87171':metrics.difficulty>=40?'#FBBF24':'#34D399'}\">${metrics.difficultyLabel}</strong> (${metrics.difficulty})</div>
            <div style=\"color:#94a3b8;\">一時後退: ▼${metrics.maxDrawdown}</div>
          </div>`;
        itemsWrap.appendChild(card);
      });
      trayEl.innerHTML = '';
      trayEl.appendChild(head);
      trayEl.appendChild(itemsWrap);
    } catch {}
  }

    /**
     * ヘッダー作成
     */
    createHeader() {
      const header = document.createElement('div');
      header.className = 'three-stage-header';
      header.innerHTML = `
        <h2 class="three-stage-title">🎯 8つの未来シナリオ</h2>
        <p class="three-stage-subtitle">あなたの状況に基づく選択肢の全体像</p>
      `;
      return header;
    }
    
    /**
     * スコア比較チャート作成
     */
    createScoreComparisonChart(scenarios) {
      // ScoreVisualizationクラスを動的に読み込み
      if (!window.ScoreVisualization) {
        const script = document.createElement('script');
        script.src = '/js/components/ScoreVisualization.js';
        document.head.appendChild(script);
        
        // 読み込み完了まで待機メッセージ
        const placeholder = document.createElement('div');
        placeholder.className = 'score-chart-placeholder';
        placeholder.innerHTML = '<p style="color: #94A3B8; text-align: center;">📊 グラフ読み込み中...</p>';
        
        script.onload = () => {
          const visualization = new window.ScoreVisualization();
          const chart = visualization.createComparisonChart(scenarios);
          placeholder.replaceWith(chart);
        };
        
        return placeholder;
      }
      
      const visualization = new window.ScoreVisualization();
      return visualization.createComparisonChart(scenarios);
    }

    /**
     * 3段階セレクター作成
     */
    createStageSelector() {
      const selector = document.createElement('div');
      selector.className = 'stage-selector';
      
      if (this.threeStageProcess && this.threeStageProcess.stages) {
        this.threeStageProcess.stages.forEach((stage, index) => {
          const stageDiv = document.createElement('div');
          stageDiv.innerHTML = `
            <h3 style="color: #A5B4FC; margin-bottom: 1rem;">${stage.title}</h3>
            <div style="display: flex; gap: 1rem;">
              ${stage.choices.map(choice => `
                <div class="stage-option" data-stage="${index}" data-choice="${choice.id}">
                  <div class="option-title">${choice.name}</div>
                  <div class="option-description">${choice.description}</div>
                  <div style="margin-top: 0.5rem; font-size: 0.75rem; color: #10B981;">
                    適合度: ${choice.compatibility}%
                  </div>
                </div>
              `).join('')}
            </div>
          `;
          selector.appendChild(stageDiv);
        });
      }
      
      // イベントリスナー追加
      selector.addEventListener('click', (e) => {
        const option = e.target.closest('.stage-option');
        if (option) {
          this.handleStageSelection(option);
        }
      });
      
      return selector;
    }

    /**
     * シナリオグリッド作成
     */
    createScenarioGrid(scenarios) {
      const grid = document.createElement('div');
      grid.className = 'scenario-grid';
      
      scenarios.forEach((scenario, index) => {
        const card = this.createScenarioCard(scenario, index);
        grid.appendChild(card);
      });
      
      return grid;
    }

    /**
     * シナリオカード作成
     */
    createScenarioCard(scenario, index) {
        // ROOT CAUSE FIX: 易経3段階変化を表示するカードを生成
        const card = document.createElement('div');
      card.className = 'scenario-card';
      card.dataset.scenarioId = scenario.id;
      
      // 動的色とアイコンの取得
      const visualization = this.getScenarioVisualization(scenario);
        
        // ROOT CAUSE FIX: 3段階変化データの生成
        const phases = this.calculateThreePhases(scenario);
        const scores = this.calculateScoreProgression(scenario, phases);
      
      // カード全体に色を適用
      card.style.borderLeft = `4px solid ${visualization.color}`;
      card.style.setProperty('--scenario-color', visualization.color);
      
      // ランク表示はノイズのため廃止
      
      // 変化方式を判定（8パスの内訳：4基軸×2方式）
      const changeMethod = this.determineChangeMethod(index);
      const methodLabel = changeMethod.type === 'advance' ? '爻が進む' : '爻が変わる';
      const methodColor = changeMethod.type === 'advance' ? '#10b981' : '#f59e0b';
      const axisLabel = changeMethod.axis; // 基軸（天地人時の4基軸）
      
      // 視覚要約用のメトリクス
      const scoresForMetrics = this.calculateScoreProgression(scenario, phases);
      const metrics = this._computeScenarioMetrics(scenario, scoresForMetrics);
      const triadLocal = (scenario.route||[]).map(r=>r==='progress'?'J':'H').join('');
      const decide = this._decideTypeAndAction(triadLocal, metrics, '');
      const net = (metrics.series.S3 - metrics.series.S0);
      const sign = net>0?'+':'';
      const netCol = net>0?'#34D399': net<0?'#F87171':'#94a3b8';

      // 外部コピー辞書
      const combo = scenario.path || scenario.route || scenario.combo;
      const key = Array.isArray(combo) ? combo.join(',') : null;
      const cpy = (this.copyDict && key) ? this.copyDict[key] : null;
      const displayTitle = (cpy && cpy.title) ? cpy.title : (scenario.title || scenario.description || '統合的変化');
      const displayDesc = (cpy && cpy.description) ? cpy.description : (scenario.description || '');

      card.innerHTML = `
        <!-- 見出し帯（タイプ / スパークライン / 合計差分 / アクション / 比較） -->
        <div class="visual-summary" style="display:flex;align-items:center;gap:.5rem;margin:.25rem 0 .35rem;flex-wrap:wrap;">
          <span class="type-stamp" style="background:${decide.color}1A;border:1px solid ${decide.color}80;color:${decide.color};padding:.15rem .5rem;border-radius:999px;font-size:.78rem;font-weight:700;">${decide.type}</span>
          <span class="sparkline" style="display:inline-flex;align-items:center;">${this._buildSparkline([metrics.series.S0,metrics.series.S1,metrics.series.S2,metrics.series.S3])}</span>
          <span style="color:${netCol};font-size:.85rem;font-weight:700;">合計差分 ${sign}${net}</span>
          <span class="action-chip" style="margin-left:auto;background:rgba(148,163,184,.15);border:1px solid rgba(148,163,184,.4);color:#E5E7EB;padding:.15rem .5rem;border-radius:999px;font-size:.78rem;">${decide.action}</span>
          <label style="margin-left:.25rem;display:inline-flex;align-items:center;gap:.25rem;color:#cbd5e1;font-size:.8rem;"><input type="checkbox" class="compare-toggle" data-id="${scenario.id}" style="accent-color:#6366F1;"/> 比較</label>
        </div>
        <!-- ヘッダー：卦変化表示 -->
        <div class="hexagram-transformation">
          <span class="current-hexagram">
            ${scenario.hexagramInfo?.name || '現在卦'} ${scenario.hexagramInfo?.line || ''}
          </span>
          <span class="transform-arrow">→</span>
          <span class="target-hexagram">
            ${scenario.targetHexagram?.name || '変化卦'} ${scenario.targetHexagram?.line || ''}
          </span>
        </div>
        
        <!-- 変化方式表示（爻が進む/爻が変わる） -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 0.5rem 0; padding: 0.5rem; background: rgba(99, 102, 241, 0.1); border-radius: 0.25rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-weight: bold; color: ${methodColor};">${methodLabel}</span>
            <span style="font-size: 0.75rem; color: #94a3b8;">(${axisLabel})</span>
          </div>
          <div style="font-size: 0.75rem; color: #a5b4fc;">
            パス${index + 1}/8
          </div>
        </div>
        
        <h3 class="scenario-title" style="color: ${visualization.color}">
          <span class="scenario-icon-set">
            <span class="traditional-icon">${visualization.traditional}</span>
            <span class="modern-emoji">${visualization.modern}</span>
          </span>
          シナリオ ${scenario.id}: ${displayTitle}
        </h3>
        ${displayDesc ? `<div class="scenario-description">${this._normalizeJa(displayDesc)}</div>` : ''}
        
        <!-- 時間的反復ステップ表示 -->
        ${this.renderTemporalSteps(scenario)}
        
        <!-- 3段階変化プロセス -->
        <div class="three-phase-container">
          <h4>☯ 3段階変化プロセス</h4>
          
          <!-- フェーズ1：動爻期 -->
          <div class="phase-block phase-1">
            <div class="phase-header">
              <span class="phase-icon">⚡</span>
              <span class="phase-name">動爻期</span>
            </div>
            <div class="phase-content">
              <div class="score-indicator">
                現在地点の土台の強さ: ${scores.current} → ${scores.phase1}
                <span class="${scores.phase1 > scores.current ? 'positive' : 'negative'}">
                  (${scores.phase1 > scores.current ? '+' : ''}${scores.phase1 - scores.current})
                </span>
              </div>
              ${(() => {
                try {
                  const step = (scenario.steps && scenario.steps[0]) ? scenario.steps[0] : null;
                  if (!step) return '';
                  const st = this._getLineState(step.hex, step.line);
                  return st ? `<div class=\"phase-description\"><strong>第1段階の状態:</strong> ${this._normalizeJa(st)}</div>` : '';
                } catch { return ''; }
              })()}
            </div>
          </div>
          
          <!-- フェーズ2：転爻期 -->
          <div class="phase-block phase-2">
            <div class="phase-header">
              <span class="phase-icon">🔄</span>
              <span class="phase-name">転爻期</span>
            </div>
            <div class="phase-content">
              <div class="score-indicator">
                現在地点の土台の強さ: ${scores.phase1} → ${scores.phase2}
                <span class="${scores.phase2 > scores.phase1 ? 'positive' : 'negative'}">
                  (${scores.phase2 > scores.phase1 ? '+' : ''}${scores.phase2 - scores.phase1})
                </span>
              </div>
              ${(() => {
                try {
                  const step = (scenario.steps && scenario.steps[1]) ? scenario.steps[1] : null;
                  if (!step) return '';
                  const st = this._getLineState(step.hex, step.line);
                  return st ? `<div class=\"phase-description\"><strong>第2段階の状態:</strong> ${this._normalizeJa(st)}</div>` : '';
                } catch { return ''; }
              })()}
            </div>
          </div>
              ${(() => {
                try {
                  const step = (scenario.steps && scenario.steps[2]) ? scenario.steps[2] : { hex: scenario.finalHex, line: scenario.finalLine };
                  const st = this._getLineState(step.hex, step.line);
                  return st ? `<div class=\"phase-description\"><strong>第3段階の状態:</strong> ${this._normalizeJa(st)}</div>` : '';
                } catch { return ''; }
              })()}
          <!-- フェーズ3：成爻期 -->
          <div class="phase-block phase-3">
            <div class="phase-header">
              <span class="phase-icon">🎯</span>
              <span class="phase-name">成爻期</span>
            </div>
            <div class="phase-content">
              <div class="score-indicator final-score">
                最終スコア: ${scores.phase3}点
                <span class="${scores.phase3 > scores.current ? 'positive' : 'negative'}">
                  (合計差分${scores.phase3 > scores.current ? '+' : ''}${scores.phase3 - scores.current})
                </span>
              </div>
              <div class="phase-description">${phases.phase3.description}</div>
            </div>
          </div>
        </div>
        
        <!-- 実現可能性 -->
        <div class="scenario-probability">
          <div class="probability-bar">
            <div class="probability-fill" style="width: ${scenario.probability * 100}%"></div>
          </div>
          <span class="probability-text">実現可能性: ${(scenario.probability * 100).toFixed(1)}%</span>
        </div>
        
        <!-- 易経の智慧 -->
        <div class="scenario-iching">
          <div class="iching-hexagram">
            ☯ ${scenario.iChingReference?.hexagram || ''}
          </div>
          <div class="iching-meaning">
            「${scenario.iChingReference?.meaning || phases.wisdom || ''}」
          </div>
        </div>
      `;
      
      // クリックイベント
      card.addEventListener('click', () => {
        this.selectScenario(scenario);
      });

      // 比較トグル
      const toggle = card.querySelector('input.compare-toggle');
      if (toggle) {
        toggle.addEventListener('click', (ev) => ev.stopPropagation());
        toggle.addEventListener('change', (ev) => {
          const checked = ev.target.checked;
          const id = scenario.id;
          this._toggleCompare(id, checked);
        });
      }

      // 合う人/避ける人（簡潔テキスト）を追加
      try {
        const fit = this._composeFitTexts(scenario);
        const box = document.createElement('div');
        box.className = 'audience-fit';
        box.style.cssText = 'margin:.75rem 0 .25rem;padding:.5rem;border:1px dashed rgba(148,163,184,.35);border-radius:8px;background:rgba(15,23,42,.35);';
        box.innerHTML = `
          <div style=\"color:#a7f3d0;font-size:.9rem;\">合う人: ${fit.fit}</div>
          <div style=\"color:#fecaca;font-size:.9rem;\">避ける人: ${fit.avoid}</div>
        `;
        card.appendChild(box);
      } catch {}

      return card;
    }

    // 合う人/避ける人の簡潔生成（スコア推移とルートの有無から）
    _composeFitTexts(scenario) {
      try {
        const phases = this.calculateThreePhases(scenario);
        const scores = this.calculateScoreProgression(scenario, phases);
        const net = (scores.phase3 || 0) - (scores.current || 0);
        const route = scenario.route || [];
        const hasTransform = route.includes('transform') || route.includes('complete') || route.includes('adjust');
        let fit = '';
        let avoid = '';
        if (hasTransform && net >= 0) {
          fit = '一度切り替え、負荷を抑えて伸ばしたい人';
          avoid = '現状維持で小さく積み上げたい人';
        } else if (!hasTransform && net >= 0) {
          fit = '負荷を増やさず、今の路線で伸ばしたい人';
          avoid = '短期で大きな転換だけを狙う人';
        } else if (net < 0) {
          fit = 'まず体制を整え、安定を取り戻したい人';
          avoid = 'すぐに大きく攻めたい人';
        } else {
          fit = '状況を見ながら着実に整えたい人';
          avoid = '極端な打ち手を好む人';
        }
        return { fit: this._normalizeJa(fit), avoid: this._normalizeJa(avoid) };
      } catch { return { fit: '', avoid: '' }; }
    }

    /**
     * パス可視化作成
     */
    createPathVisualization(path) {
      const stages = ['第一段階', '第二段階', '第三段階'];
      const choiceNames = {
        'conservative': '保守的',
        'progressive': '進歩的',
        'collaborative': '協調的',
        'independent': '独立的',
        'cautious': '慎重',
        'decisive': '決断的'
      };
      
      return path.map((choice, index) => `
        <div class="path-stage">
          <div class="stage-label">${stages[index]}</div>
          <div class="stage-choice choice-${choice}">
            ${choiceNames[choice]}
          </div>
        </div>
        ${index < path.length - 1 ? '<span class="path-arrow">→</span>' : ''}
      `).join('');
    }

    /**
     * ランクスタイル取得
     */
    getRankStyle(probability) {
      if (probability > 70) {
        return 'background: linear-gradient(135deg, #FDE047, #F59E0B);';
      } else if (probability > 60) {
        return 'background: linear-gradient(135deg, #10B981, #059669);';
      } else if (probability > 50) {
        return 'background: linear-gradient(135deg, #3B82F6, #2563EB);';
      } else if (probability > 40) {
        return 'background: linear-gradient(135deg, #F59E0B, #DC2626);';
      } else {
        return 'background: linear-gradient(135deg, #6B7280, #4B5563);';
      }
    }

    /**
     * 動的色システムを適用
     */
    applyScenariosColors(scenarios) {
      if (window.haqeiColorSystem && window.haqeiColorSystem.applyScenariosColorsToDom) {
        window.haqeiColorSystem.applyScenariosColorsToDom(scenarios);
        console.log('🎨 シナリオ色をCSS変数に適用完了');
      }
    }

    /**
     * シナリオの可視化情報を取得
     */
    getScenarioVisualization(scenario) {
      if (window.haqeiColorSystem) {
        const viz = window.haqeiColorSystem.getScenarioVisualization(scenario);
        return viz;
      }
      
      // ROOT CAUSE FIX: フォールバック値にもtraditional/modernを設定
      return {
        color: '#757575',
        lightColor: '#f5f5f5',
        darkColor: '#424242',
        traditional: '☯',  // ROOT CAUSE FIX: undefined防止
        modern: '🎯',      // ROOT CAUSE FIX: undefined防止
        trigramName: '一般',
        trigramKey: 'default',
        gradient: 'linear-gradient(135deg, #757575, #424242)',
        cssClass: 'trigram-default'
      };
    }

    /**
     * ROOT CAUSE FIX: 3段階変化フェーズの計算
     */
    calculateThreePhases(scenario) {
        // H384データベースから実データを取得
        const currentLine = scenario.hexagramInfo?.lineNumber || 7;
        const targetLine = scenario.targetHexagram?.lineNumber || currentLine + 6;
        
        return {
            phase1: {
                description: this.getPhase1Description(scenario),
                yaoBefore: scenario.hexagramInfo?.line || '初爻',
                yaoAfter: this.calculateNextYao(scenario.hexagramInfo?.line),
                timeframe: '1-3ヶ月'
            },
            phase2: {
                description: this.getPhase2Description(scenario),
                heavenBalance: Math.round(30 + this.rng.next() * 40),
                humanBalance: Math.round(30 + this.rng.next() * 40),
                earthBalance: Math.round(30 + this.rng.next() * 40),
                timeframe: '3-6ヶ月'
            },
            phase3: {
                description: this.getPhase3Description(scenario),
                finalYao: scenario.targetHexagram?.line || '上爻',
                realizationRate: Math.round(scenario.probability * 100),
                timeframe: '6-12ヶ月'
            },
            wisdom: this.getIChingWisdom(scenario)
        };
    }
    
    /**
     * 基礎スコアの推移計算
     */
    calculateScoreProgression(scenario, phases) {
        // 事前計算DBのseriesがあればそれを優先
        if (scenario && scenario.dbSeries && typeof scenario.dbSeries.S0 === 'number') {
            const s = scenario.dbSeries;
            return {
                current: Math.min(100, Math.max(0, s.S0)),
                phase1: Math.min(100, Math.max(0, s.S1)),
                phase2: Math.min(100, Math.max(0, s.S2)),
                phase3: Math.min(100, Math.max(0, s.S3))
            };
        }

        const baseScore = scenario.hexagramInfo?.score || 
                         scenario.score || 
                         Math.round(50 + this.rng.next() * 30);
        
        // 各フェーズでのスコア変化を易経原理に基づいて計算
        const phase1Change = this.calculatePhase1Change(scenario);
        const phase2Change = this.calculatePhase2Change(scenario);
        const phase3Change = this.calculatePhase3Change(scenario);
        
        // NaN対策: 各値が数値であることを保証
        const safeBaseScore = isNaN(baseScore) ? 50 : baseScore;
        const safePhase1Change = isNaN(phase1Change) ? 0 : phase1Change;
        const safePhase2Change = isNaN(phase2Change) ? 0 : phase2Change;
        const safePhase3Change = isNaN(phase3Change) ? 0 : phase3Change;
        
        return {
            current: safeBaseScore,
            phase1: Math.min(100, Math.max(0, safeBaseScore + safePhase1Change)),
            phase2: Math.min(100, Math.max(0, safeBaseScore + safePhase1Change + safePhase2Change)),
            phase3: Math.min(100, Math.max(0, safeBaseScore + safePhase1Change + safePhase2Change + safePhase3Change))
        };
    }
    
    /**
     * フェーズ1の変化計算（動爻期）
     */
    calculatePhase1Change(scenario) {
        // 陽変・陰変による基礎的な変化
        if (scenario.route && scenario.route[0] === 'progress') {
            return Math.round(10 + this.rng.next() * 15); // 陽的発展
        } else if (scenario.route && scenario.route[0] === 'transform') {
            return Math.round(-5 + this.rng.next() * 20); // 転換による一時的調整
        }
        return Math.round(-5 + this.rng.next() * 15);
    }
    
    /**
     * フェーズ2の変化計算（転爻期）
     */
    calculatePhase2Change(scenario) {
        // 三才調和による中間調整
        if (scenario.route && scenario.route[1] === 'continue') {
            return Math.round(5 + this.rng.next() * 10); // 継続的成長
        } else if (scenario.route && scenario.route[1] === 'adjust') {
            return Math.round(0 + this.rng.next() * 10); // 調整期
        } else if (scenario.route && scenario.route[1] === 'complete') {
            return Math.round(-10 + this.rng.next() * 30); // 大転換
        }
        return Math.round(0 + this.rng.next() * 10);
    }
    
    /**
     * フェーズ3の変化計算（成爻期）
     */
    calculatePhase3Change(scenario) {
        // 最終到達点での安定化
        // probabilityが undefined またはNaNの場合のデフォルト値を設定
        const probability = (scenario.probability !== undefined && !isNaN(scenario.probability)) 
                          ? scenario.probability 
                          : 0.5; // デフォルト50%
        const probabilityBonus = Math.round(probability * 20);
        return probabilityBonus + Math.round(-5 + this.rng.next() * 10);
    }
    
    /**
     * 変化方式の判定（4基軸×2方式 = 8パス）
     * @param {number} index - シナリオのインデックス(0-7)
     * @returns {Object} 変化方式情報
     */
    determineChangeMethod(index) {
        // 4基軸：天（創造）、地（安定）、人（関係）、時（変化）
        const axes = ['天基軸', '地基軸', '人基軸', '時基軸'];
        const axisIndex = Math.floor(index / 2); // 0-1→天, 2-3→地, 4-5→人, 6-7→時
        
        // 2方式：爻が進む（advance） vs 爻が変わる（transform）
        const isAdvance = index % 2 === 0;
        
        return {
            type: isAdvance ? 'advance' : 'transform',
            axis: axes[axisIndex],
            description: isAdvance 
                ? `${axes[axisIndex]}に沿って順次進展する`
                : `${axes[axisIndex]}において質的変化を起こす`
        };
    }
    
    /**
     * 各フェーズの説明文生成
     */
    getPhase1Description(scenario) {
        const action = scenario.route?.[0] || 'progress';
        const descriptions = {
            'progress': '現状を維持しながら内なる力を蓄積し、次の段階への準備を整える',
            'transform': '既存の枠組みから脱却し、新たな可能性を模索し始める'
        };
        return descriptions[action] || '変化の兆しが現れ、内的エネルギーが動き始める';
    }
    
    getPhase2Description(scenario) {
        const action = scenario.route?.[1] || 'continue';
        const descriptions = {
            'continue': '順調な発展を続け、着実に目標へ近づいていく',
            'adjust': '状況に応じて柔軟に調整し、バランスを取りながら前進',
            'complete': '根本的な転換を経て、新たな段階へと移行',
            'integrate': '異なる要素を統合し、より高次の調和を実現'
        };
        return descriptions[action] || '天・人・地の三才が調和し、変化が具体化していく';
    }
    
    getPhase3Description(scenario) {
        const probability = scenario.probability || 0.5;
        if (probability > 0.7) {
            return '理想的な形で目標を達成し、新たな安定状態を確立する';
        } else if (probability > 0.5) {
            return '着実な努力により目標に到達し、持続可能な成果を得る';
        } else if (probability > 0.3) {
            return '困難を乗り越えて目標に近づき、貴重な経験と学びを得る';
        }
        return '挑戦的な道のりを経て、予期せぬ形での成長と発見がある';
    }
    
    /**
     * 次の爻を計算
     */
    calculateNextYao(currentYao) {
        const yaoOrder = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
        const currentIndex = yaoOrder.findIndex(y => currentYao?.includes(y.substring(0, 1)));
        if (currentIndex >= 0 && currentIndex < 5) {
            return yaoOrder[currentIndex + 1];
        }
        return '変爻';
    }
    
    /**
     * 時間的反復ステップのレンダリング
     */
    renderTemporalSteps(scenario) {
        // scenarioかpatternデータからtemporalStepsを取得
        const steps = scenario.temporalSteps || scenario.pattern?.temporalSteps || [];
        
        if (!steps.length) {
            return ''; // ステップがない場合は空を返す
        }
        
        return `
        <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(248, 250, 252, 0.8); border-radius: 0.5rem; border-left: 3px solid #fbbf24;">
            <div style="font-size: 0.875rem; font-weight: bold; color: #fbbf24; margin-bottom: 0.5rem;">
                ✨ 時間的反復ステップ (${steps.length}段階)
            </div>
            ${steps.map(step => `
                <div style="display: flex; gap: 0.75rem; margin-bottom: 0.5rem; align-items: flex-start;">
                    <div style="min-width: 1.5rem; height: 1.5rem; background: #6366f1; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: bold;">
                        ${step.step}
                    </div>
                    <div style="flex: 1; color: #e2e8f0; font-size: 0.875rem; line-height: 1.5;">
                        ${step.description}
                    </div>
                </div>
            `).join('')}
        </div>
        `;
    }
    
    /**
     * 易経の智慧を取得
     */
    getIChingWisdom(scenario) {
        const wisdoms = [
            '時に従い、機を見て動く',
            '陰極まりて陽となす、変化の妙',
            '天地の道理に従い、自然な発展を遂げる',
            '剛柔並び済し、調和の中に真理あり',
            '進退を知り、時機を得て成功す'
        ];
        
        // シナリオの特性に基づいて適切な智慧を選択
        const index = Math.abs(this.simpleHash(JSON.stringify(scenario))) % wisdoms.length;
        return wisdoms[index];
    }
    
    /**
     * 簡易ハッシュ関数
     */
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    }

    /**
     * ランククラス取得
     */
    getRankClass() { return ''; }

    /**
     * ステージ選択処理
     */
    handleStageSelection(option) {
      // 選択状態の更新
      const stage = option.dataset.stage;
      const choice = option.dataset.choice;
      
      // 同じステージの他の選択肢をクリア
      document.querySelectorAll(`.stage-option[data-stage="${stage}"]`).forEach(opt => {
        opt.classList.remove('selected');
      });
      
      // 選択したオプションをハイライト
      option.classList.add('selected');
      
      // 該当するシナリオをフィルタリング
      this.filterScenariosBySelection();
    }

    /**
     * 選択に基づくシナリオフィルタリング
     */
    filterScenariosBySelection() {
      const selectedChoices = [];
      
      // 選択された選択肢を取得
      document.querySelectorAll('.stage-option.selected').forEach(option => {
        selectedChoices.push({
          stage: parseInt(option.dataset.stage),
          choice: option.dataset.choice
        });
      });
      
      // シナリオカードをフィルタリング
      document.querySelectorAll('.scenario-card').forEach(card => {
        const scenarioId = parseInt(card.dataset.scenarioId);
        const scenario = this.scenarios.find(s => s.id === scenarioId);
        
        if (scenario) {
          let matches = true;
          
          selectedChoices.forEach(selected => {
            if (scenario.path[selected.stage] !== selected.choice) {
              matches = false;
            }
          });
          
          if (matches) {
            card.style.display = 'block';
            card.style.opacity = '1';
          } else {
            card.style.opacity = '0.3';
          }
        }
      });
    }

    /**
     * シナリオ選択
     */
    selectScenario(scenario) {
      // 既存の選択をクリア
      document.querySelectorAll('.scenario-card').forEach(card => {
        card.classList.remove('selected');
      });
      
      // 新しい選択を設定
      const selectedCard = document.querySelector(`[data-scenario-id="${scenario.id}"]`);
      if (selectedCard) {
        selectedCard.classList.add('selected');
      }
      
      this.selectedScenario = scenario;
      
      // 動的詳細情報パネルを表示
      this.showScenarioDetails(scenario);
      
      // カスタムイベント発火
      const event = new CustomEvent('scenarioSelected', {
        detail: scenario
      });
      this.container.dispatchEvent(event);
      
      console.log('📍 Selected scenario:', scenario);
    }

    /**
     * シナリオ詳細情報パネル表示
     */
    showScenarioDetails(scenario) {
      // 詳細パネルを作成または更新
      let detailPanel = document.getElementById('scenario-detail-panel');
      if (!detailPanel) {
        detailPanel = this.createDetailPanel();
        document.body.appendChild(detailPanel);
      }
      
      // 3段階データを動的生成
      const phases = this.calculateThreePhases(scenario);
      const scores = this.calculateScoreProgression(scenario, phases);
      
      // パネル内容を更新
      detailPanel.innerHTML = `
        <div class="detail-panel-header">
          <h2>🎯 シナリオ${scenario.id}詳細分析</h2>
          <button class="close-btn" onclick="this.parentElement.parentElement.style.display='none'">×</button>
        </div>
        
        <div class="detail-content">
          <div class="scenario-overview">
            <h3>${scenario.title || scenario.description || '統合的変化シナリオ'}</h3>
            <div class="probability-display">
              <span>実現可能性: <strong>${(scenario.probability * 100).toFixed(1)}%</strong></span>
            </div>
          </div>
          
          <div class="three-phases-detail">
            <h4>☯ 3段階変化プロセス詳細</h4>
            
            <div class="phase-detail phase-1">
              <h5>⚡ 動爻期 (${phases.phase1.timeframe})</h5>
              <p><strong>スコア変化:</strong> ${scores.current} → ${scores.phase1} 
                <span class="score-change ${scores.phase1 > scores.current ? 'positive' : 'negative'}">
                  (${scores.phase1 > scores.current ? '+' : ''}${scores.phase1 - scores.current})
                </span>
              </p>
              <p><strong>変化内容:</strong> ${phases.phase1.description}</p>
              <p><strong>爻の変化:</strong> ${phases.phase1.yaoBefore} → ${phases.phase1.yaoAfter}</p>
            </div>
            
            <div class="phase-detail phase-2">
              <h5>🔄 転爻期 (${phases.phase2.timeframe})</h5>
              <p><strong>スコア変化:</strong> ${scores.phase1} → ${scores.phase2}
                <span class="score-change ${scores.phase2 > scores.phase1 ? 'positive' : 'negative'}">
                  (${scores.phase2 > scores.phase1 ? '+' : ''}${scores.phase2 - scores.phase1})
                </span>
              </p>
              <p><strong>変化内容:</strong> ${phases.phase2.description}</p>
              <div class="balance-display">
                <div>天のバランス: ${phases.phase2.heavenBalance}%</div>
                <div>人のバランス: ${phases.phase2.humanBalance}%</div>
                <div>地のバランス: ${phases.phase2.earthBalance}%</div>
              </div>
            </div>
            
            <div class="phase-detail phase-3">
              <h5>🎯 成爻期 (${phases.phase3.timeframe})</h5>
              <p><strong>最終スコア:</strong> ${scores.phase3}点
                <span class="score-change ${scores.phase3 > scores.current ? 'positive' : 'negative'}">
                  (合計${scores.phase3 > scores.current ? '+' : ''}${scores.phase3 - scores.current})
                </span>
              </p>
              <p><strong>変化内容:</strong> ${phases.phase3.description}</p>
              <p><strong>最終爻:</strong> ${phases.phase3.finalYao}</p>
              <p><strong>実現率:</strong> ${phases.phase3.realizationRate}%</p>
            </div>
          </div>
          
          <div class="iching-wisdom-detail">
            <h4>📜 易経の智慧</h4>
            <blockquote>「${phases.wisdom}」</blockquote>
            ${scenario.iChingReference ? `
              <div class="hexagram-info">
                <p><strong>関連卦:</strong> ${scenario.iChingReference.hexagram || ''}</p>
                <p><strong>意味:</strong> ${scenario.iChingReference.meaning || ''}</p>
              </div>
            ` : ''}
          </div>
        </div>
      `;
      
      // パネルを表示
      detailPanel.style.display = 'block';
      detailPanel.scrollTop = 0;
    }

    /**
     * 詳細パネル要素作成
     */
    createDetailPanel() {
      const panel = document.createElement('div');
      panel.id = 'scenario-detail-panel';
      panel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 700px;
        max-height: 80vh;
        background: linear-gradient(135deg, rgba(17, 24, 39, 0.98), rgba(31, 41, 55, 0.98));
        border: 2px solid rgba(99, 102, 241, 0.5);
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        z-index: 10000;
        color: #E5E7EB;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        overflow-y: auto;
        display: none;
        backdrop-filter: blur(10px);
      `;
      
      // パネル用スタイルを追加
      if (!document.getElementById('scenario-detail-styles')) {
        const style = document.createElement('style');
        style.id = 'scenario-detail-styles';
        style.textContent = `
          .detail-panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 1.5rem;
            border-bottom: 1px solid rgba(99, 102, 241, 0.3);
          }
          
          .detail-panel-header h2 {
            margin: 0;
            color: #A5B4FC;
          }
          
          .close-btn {
            background: rgba(239, 68, 68, 0.2);
            border: 1px solid rgba(239, 68, 68, 0.4);
            color: #FCA5A5;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .close-btn:hover {
            background: rgba(239, 68, 68, 0.3);
          }
          
          .detail-content {
            padding: 1.5rem;
          }
          
          .scenario-overview h3 {
            color: #FDE047;
            margin-bottom: 0.5rem;
          }
          
          .probability-display {
            margin-bottom: 1rem;
            font-size: 1.1rem;
          }
          
          .three-phases-detail h4 {
            color: #10B981;
            margin-bottom: 1rem;
          }
          
          .phase-detail {
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: rgba(55, 65, 81, 0.3);
            border-left: 3px solid #6366F1;
            border-radius: 8px;
          }
          
          .phase-detail h5 {
            color: #C7D2FE;
            margin-bottom: 0.5rem;
          }
          
          .score-change.positive {
            color: #10B981;
          }
          
          .score-change.negative {
            color: #F87171;
          }
          
          .balance-display {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 0.5rem;
            margin-top: 0.5rem;
            font-size: 0.875rem;
          }
          
          .iching-wisdom-detail blockquote {
            background: rgba(165, 180, 252, 0.1);
            border-left: 3px solid #6366F1;
            margin: 0.5rem 0;
            padding: 1rem;
            border-radius: 4px;
            font-style: italic;
          }
        `;
        document.head.appendChild(style);
      }
      
      return panel;
    }

    /**
     * アニメーション開始
     */
    animateDisplay() {
      const cards = document.querySelectorAll('.scenario-card');
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        }, index * 100);
      });
    }
  }

  // グローバル登録
  if (typeof window !== 'undefined') {
    window.EightScenariosDisplay = EightScenariosDisplay;
  }

  console.log('✅ EightScenariosDisplay loaded');
  
})(typeof window !== 'undefined' ? window : this);
