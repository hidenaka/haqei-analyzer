/**
 * EightBranchesDisplay - 進/変の8分岐を簡素表示
 */
(function(global){
  'use strict';

  class EightBranchesDisplay {
    constructor() {
      this.name = 'EightBranchesDisplay';
      this.container = null;
      this.version = '1.2.0';
      this._lineStates = null;
      this._modernMap = {
        'ポテンシャル': '伸びしろ',
        '基礎固め': '土台づくり',
        '学習': 'インプット',
        'チャンス到来': '好機',
        '公の場': '表舞台',
        '出会い': '良縁',
        'リスクあり': 'リスク高め',
        '内省': 'ふり返り',
        '努力': '地道な努力',
        'タイミング': '好機を見極め',
        '問題なし': '障害少',
        'リーダー': '牽引役',
        'リーダーシップ': 'リーダーシップ',
        '公明正大': '公正・透明性',
        '亢龍': 'やり過ぎ',
        '傲慢': '慢心',
        '引き際': '退き際',
        '協力': '協業',
        '吉': '追い風',
        '自律': '自走',
        '予兆': '兆し',
        '初霜': '小さなサイン',
        '始まりの注意': '初動注意',
        '公正': '公正',
        '受容性': '受け止め力',
        '大地の徳': '安定基盤',
        '才能を隠す': '黙って支える',
        '時期を待つ': '機を待つ'
      };
      this._stopWords = new Set(['吉','凶','問題なし','小さなサイン']);
      this._actionMap = {
        '伸びしろ': '伸びしろを活かす',
        '土台づくり': '土台を固める',
        'インプット': '情報を集める',
        '好機': '好機をつかむ',
        '表舞台': '表に立って動く',
        '良縁': '協力者とつながる',
        'リスク高め': 'リスクを先に潰す',
        'ふり返り': 'いったん振り返る',
        '地道な努力': '地道に積み上げる',
        '好機を見極め': '好機を見極める',
        '障害少': 'このまま押し進める',
        '牽引役': '先頭に立って引っ張る',
        'リーダーシップ': 'リーダーシップを発揮',
        '公正・透明性': '透明性を担保する',
        'やり過ぎ': '出力を抑える',
        '慢心': '慢心を戒める',
        '退き際': '退き際を見極める',
        '協業': '協力者を巻き込む',
        '追い風': '追い風を使う',
        '自走': '自走を促す',
        '兆し': '兆しを逃さない',
        '初動注意': '初動を丁寧に',
        '公正': '公正に進める',
        '受け止め力': '相手を受け止める',
        '安定基盤': '基盤を強化する',
        '黙って支える': '縁の下で支える',
        '機を待つ': '機を待つ'
      };
      // decision support dictionaries
      this._avoidMap = {
        'リスク高め': '短期で成果を急ぐ人',
        '好機': '準備より即断を優先しがちな人は非推奨',
        '土台づくり': '基盤整備に時間を割けない状況',
        '合意形成': '独断で進めたい場合'
      };
      this._gainMap = {
        '信頼': '関係の安定と支援の拡大',
        '合意形成': '承認獲得と実行安定',
        '好機': '短期の前進と波及効果',
        '土台づくり': '再現性と継続性の向上'
      };
      this._lossMap = {
        '信頼': '意思決定の速度低下',
        '合意形成': '調整コストの増加',
        '好機': '検討の深さの不足',
        '土台づくり': '初動の目に見える成果が遅れる'
      };
    }

    initialize(containerId) {
      const el = document.getElementById(containerId);
      if (!el) return false;
      this.container = el;
      this.container.innerHTML = '';
      return true;
    }

    _badge(series) {
      const cProg = (series.match(/進/g) || []).length;
      const cTrans = (series.match(/変/g) || []).length;
      if (cProg === 3) return { label: '連続進行', color: '#10B981' };
      if (cTrans === 3) return { label: '全面転換', color: '#EF4444' };
      if (cProg === 2) return { label: '進み基調', color: '#3B82F6' };
      if (cTrans === 2) return { label: '転換基調', color: '#F59E0B' };
      return { label: '折衷', color: '#A78BFA' };
    }

    _summary(series) {
      const cProg = (series.match(/進/g) || []).length;
      const cTrans = (series.match(/変/g) || []).length;
      if (cProg === 3) return '迷いなく前進する三段階の道筋です。';
      if (cTrans === 3) return '抜本的な路線変更を三段階で進めます。';
      if (cProg === 2) return '前進しつつ要所で見直す堅実な道筋です。';
      if (cTrans === 2) return '転換を主に据えつつ進む現実的な道筋です。';
      return '前進と転換を組み合わせたバランス型の道筋です。';
    }

    // copy functionality removed per UX decision

    // --- Modern keyword helpers ---
    _modernizeTerm(t){
      const s = String(t||'').trim();
      if (!s) return '';
      return this._modernMap[s] || s;
    }
    _normalizeKeywords(list){
      const out = [];
      const seen = new Set();
      (list||[]).forEach(x => {
        const v = this._modernizeTerm(x);
        if (!v || this._stopWords.has(v)) return;
        if (!seen.has(v)) { seen.add(v); out.push(v); }
      });
      return out;
    }
    _getKeywordsFor(hex, yaoNames){
      try {
        const data = (window.H384_DATA && Array.isArray(window.H384_DATA)) ? window.H384_DATA : [];
        const found = data.find(e => Number(e['卦番号']) === Number(hex) && (yaoNames||[]).includes(String(e['爻'])));
        const kw = found && found['キーワード'];
        if (Array.isArray(kw)) return kw;
        if (typeof kw === 'string') return kw.split(/、|,|\s+/).filter(Boolean);
      } catch {}
      return [];
    }
    _getEntryFor(hex, line){
      try {
        const yaoNames = this._yaoCandidatesByLine(line);
        const data = (window.H384_DATA && Array.isArray(window.H384_DATA)) ? window.H384_DATA : [];
        return data.find(e => Number(e['卦番号']) === Number(hex) && (yaoNames||[]).includes(String(e['爻'])));
      } catch { return null; }
    }
    _primaryKeywordFromEntry(entry){
      if (!entry) return '';
      const raw = Array.isArray(entry['キーワード']) ? entry['キーワード'] : (typeof entry['キーワード']==='string' ? entry['キーワード'].split(/、|,|\s+/).filter(Boolean): []);
      const normalized = this._normalizeKeywords(raw);
      return normalized[0] || '';
    }
    _featureTag(step){
      try {
        const entry = this._getEntryFor(step.hex, step.line);
        if (!entry) return '';
        const hex = String(entry['卦名']||'').trim();
        const yao = String(entry['爻']||'').trim();
        const key = this._primaryKeywordFromEntry(entry);
        const left = (hex ? hex.replace(/為.*/, hex) : '') + (yao ? yao : '');
        if (left && key) return `${left}:${key}`;
        if (left) return left;
        return key;
      } catch { return ''; }
    }
    _yaoCandidatesByLine(line){
      const n = Number(line);
      const map = {1:['初九','初六'],2:['九二','六二'],3:['九三','六三'],4:['九四','六四'],5:['九五','六五'],6:['上九','上六']};
      return map[n] || [];
    }
    _deriveQuickKeywords(branch){
      // Backward-compatible: prioritize Step1/2 if aggregate fails
      const collectFromStep = (step) => this._getKeywordsFor(step.hex, this._yaoCandidatesByLine(step.line));
      try {
        const steps = Array.isArray(branch?.steps) ? branch.steps : [];
        if (!steps.length) return [];
        // Weighted aggregation across 3 steps
        const weights = [0.5, 0.35, 0.15];
        const tally = new Map();
        steps.slice(0,3).forEach((s,idx)=>{
          const kws = this._normalizeKeywords(collectFromStep(s)).slice(0,3);
          const w = weights[idx] ?? 0.1;
          kws.forEach(k => tally.set(k, (tally.get(k)||0) + w));
        });
        const ranked = Array.from(tally.entries()).sort((a,b)=> b[1]-a[1]).map(([k])=>k);
        if (ranked.length) return ranked.slice(0,3);
      } catch {}
      // Fallback
      let raw = [];
      if (branch && Array.isArray(branch.steps) && branch.steps.length) {
        raw = raw.concat(collectFromStep(branch.steps[0]));
        if (raw.length < 3 && branch.steps[1]) raw = raw.concat(collectFromStep(branch.steps[1]));
      }
      const normalized = this._normalizeKeywords(raw);
      normalized.sort((a,b)=> a.length - b.length);
      return normalized.slice(0,3);
    }
    _getBasicScore(hex, line){
      try {
        const candidates = {1:['初九','初六'],2:['九二','六二'],3:['九三','六三'],4:['九四','六四'],5:['九五','六五'],6:['上九','上六']}[Number(line)] || [];
        const data = (window.H384_DATA && Array.isArray(window.H384_DATA)) ? window.H384_DATA : [];
        const found = data.find(e => Number(e['卦番号']) === Number(hex) && candidates.includes(String(e['爻'])));
        const v = Number(found && found['S1_基本スコア']);
        return Number.isFinite(v) ? v : null;
      } catch { return null; }
    }
    _severityScore(text){
      const t = String(text||'');
      const HIGH = ['退く','退避','撤退','中止','治療','補強','再発防止','亀裂','損害','危険','深刻','崩れる','破綻','被害','断つ'];
      const MED  = ['見直し','調整','修正','慎重','注意','警戒','停滞','迷い','課題','リスク','再検討'];
      let s = 0;
      HIGH.forEach(k => { if (t.includes(k)) s += 2; });
      MED.forEach(k => { if (t.includes(k)) s += 1; });
      return s; // 0:低, 1-2:中, >=3:高
    }
    _seriesNarrative(branch){
      try {
        const series = String(branch?.series||'');
        const steps = Array.isArray(branch?.steps) ? branch.steps.slice(0,3) : [];
        const actions = series.split('→');
        const sScores = steps.map(s => this._getBasicScore(s.hex, s.line));
        const lastText = steps[2]?.lineText || '';
        const lastSeverity = this._severityScore(lastText);
        const lastAction = actions[2] || '';
        const d13 = (sScores[2] ?? sScores[1] ?? sScores[0] ?? 0) - (sScores[0] ?? 0);

        // 1) 最終ステップが深刻: 一時退避・立て直し系
        if (lastSeverity >= 3) {
          if (lastAction === '変') return '最後は一時退避して立て直す構成';
          return '最後は安全側に切り替えて被害拡大を防ぐ構成';
        }
        // 2) 最終ステップが中程度: 調整/修正の明示
        if (lastSeverity >= 1) {
          if (lastAction === '変') return '押し上げつつ最後は路線を調整して着地する';
          return '前進を保ちつつ要所で慎重に調整して仕上げる';
        }
        // 3) スコアの趨勢: 仕上げのニュアンス
        if (actions.join('') === '進→進→進') {
          if (d13 >= 10) return '序盤から終盤まで加速しながら正攻法で押し切る構成';
          if (d13 <= -10) return '正攻法で進むが、後半は無理せず守りを固める構成';
          return '序盤から終盤まで正攻法で押し切る構成';
        }
        if (actions.join('') === '進→進→変') {
          if (d13 <= -10) return '押し切り基調から最後は方向転換で安全に締める';
          return '押し切りつつ最後は必要最小限の調整で仕上げる';
        }
        if (actions.join('') === '進→変→進') return '中盤で方針を切替えて再加速する構成';
        if (actions.join('') === '進→変→変') return '初手は進み、後半は路線転換で再設計していく構成';
        if (actions.join('') === '変→進→進') return 'まず切替え、以降は前進で成果を固める構成';
        if (actions.join('') === '変→進→変') return '切替え→前進の後、最後に微修正で整える構成';
        if (actions.join('') === '変→変→進') return '段階的に切替えた上で、最後は前進でまとめる構成';
        if (actions.join('') === '変→変→変') return '三段階で順次切替えて新路線を築く構成';
      } catch {}
      return '三段構成で段階的に前進と転換を組み合わせる構成';
    }

    _toActionPhrases(keywords){
      const unique = Array.from(new Set(keywords||[]));
      const mapped = unique.map(k => this._actionMap[k] || (k + 'を活かす'));
      return mapped.slice(0, 2);
    }
    _avoidPhrases(keys){
      const out = [];
      (keys||[]).forEach(k=>{ const v=this._avoidMap[k]; if(v && !out.includes(v)) out.push(v); });
      return out.slice(0,1);
    }
    _tradeoff(keys){
      const gains=[]; const losses=[];
      (keys||[]).forEach(k=>{
        const g=this._gainMap[k]; if(g && !gains.includes(g)) gains.push(g);
        const l=this._lossMap[k]; if(l && !losses.includes(l)) losses.push(l);
      });
      return { gain: (gains[0]||'小さな前進を積み上げる'), loss: (losses[0]||'別案より初動負荷が増える') };
    }
    // --- Decision support helpers ---
    _fitPhrases(keys){
      const map = {
        '信頼': '信頼が資産として効いている',
        '合意形成': '承認・利害調整が鍵になる',
        '大衆の支持': '支持を広げやすい土壌がある',
        '好機': '今が仕掛け時',
        '土台づくり': '基盤整備を先に進めたい',
        '協業': '外部/他部署と連携が必要',
        '透明性': '透明性の担保が求められる',
        '公正・透明性': '透明性の担保が求められる'
      };
      const out = [];
      (keys||[]).forEach(k=>{ if(map[k] && !out.includes(map[k])) out.push(map[k]); });
      return out.slice(0,2);
    }
    _cautionPhrase(lastSeverity, lastAction){
      if (lastSeverity >= 3) return '被害最小化を最優先。拡大する施策は避ける';
      if (lastSeverity >= 1) return (lastAction==='変') ? '終盤は調整コスト発生。余裕を確保' : '後半は慎重に微修正しつつ進める';
      return '勢い任せにせず、根拠と合意を揃えて進める';
    }
    _outcomePhrase(actions, d13, lastSeverity){
      const pat = actions.join('');
      if (actions[2]==='変' && lastSeverity>=3) return 'ダメージを抑えて再起の下地を整える';
      if (pat==='進→進→進') {
        if (d13>=10) return '支持を束ねて成果に転換する';
        if (d13<=-10) return '前進を維持しつつ守りを固める';
        return '信頼を資本に前進を確定させる';
      }
      if (actions[2]==='変') return '軌道修正で合意を取り付けて着地する';
      return '切替え後に前進へ繋ぎ成果をまとめる';
    }

    // --- UX helpers for intuitive understanding ---
    _counts(series){
      return {
        prog: (series.match(/進/g) || []).length,
        trans: (series.match(/変/g) || []).length
      };
    }
    _emoji(series){
      const { prog, trans } = this._counts(series);
      if (prog === 3) return '🚀';
      if (trans === 3) return '🔄';
      if (prog === 2) return '➡️';
      if (trans === 2) return '🧭';
      return '⚖️';
    }
    _score(series){
      const { prog, trans } = this._counts(series);
      if (prog === 3) return 90;
      if (prog === 2 && trans === 1) return 80;
      if (prog === 1 && trans === 2) return 60;
      if (trans === 3) return 50;
      return 70;
    }
    _risk(series){
      const { prog, trans } = this._counts(series);
      if (prog === 3) return {label:'リスク低', color:'#10B981'};
      if (trans === 3) return {label:'リスク高', color:'#EF4444'};
      if (trans === 2) return {label:'リスク中', color:'#F59E0B'};
      return {label:'リスク中', color:'#3B82F6'};
    }
    _effort(series){
      const { prog, trans } = this._counts(series);
      if (prog === 3) return {label:'手間 少', color:'#93C5FD'};
      if (trans === 3) return {label:'手間 多', color:'#FCA5A5'};
      if (trans === 2) return {label:'手間 中', color:'#FDE68A'};
      return {label:'手間 中', color:'#A78BFA'};
    }
    _tips(series){
      const { prog, trans } = this._counts(series);
      if (prog === 3) return ['小さく確実に進む','協力者と進捗を共有','正攻法で実力を見せる'];
      if (trans === 3) return ['原因の分解と収束計画','合意形成と安全策','段階的な再起動準備'];
      if (prog === 2) return ['節目で見直し','根拠と透明性','小回りを効かせる'];
      if (trans === 2) return ['変える範囲を明確化','影響ケア','段階的切替'];
      return ['優先度で仕分け','進む/変えるの整理','負担分散'];
    }

    _card(branch, idx) {
      const card = document.createElement('div');
      const __palette = ['#10B981','#3B82F6','#F59E0B','#EF4444','#A78BFA','#22C55E','#EAB308','#06B6D4'];
      const __color = __palette[idx % __palette.length];
      card.style.border = `1px solid ${__color}66`;
      card.style.borderRadius = '10px';
      card.style.padding = '12px 14px';
      card.style.background = 'rgba(17,24,39,0.35)';
      card.style.color = '#E5E7EB';
      card.style.boxShadow = '0 2px 6px rgba(0,0,0,0.25)';
      card.style.cursor = 'pointer';

      const title = document.createElement('div');
      const badge = this._badge(branch.series);
      const __numCirc = '①②③④⑤⑥⑦⑧'[ (branch.id-1) % 8 ] || String(branch.id);
      title.innerHTML = `${__numCirc} 分岐${branch.id}｜${branch.series} <span style="margin-left:8px;padding:2px 8px;border-radius:9999px;background:${badge.color}22;color:${badge.color};font-size:.8em;">${badge.label}</span>`;
      title.style.fontWeight = '600';
      title.style.color = '#A5B4FC';
      title.style.marginBottom = '8px';
      // intuitive emoji prefix
      try { const em = this._emoji(branch.series); title.innerHTML = `${em} ` + title.innerHTML; } catch {}

      const summary = document.createElement('div');
      summary.textContent = this._summary(branch.series);
      summary.style.fontSize = '.9em';
      summary.style.color = '#cbd5e1';
      summary.setAttribute('data-section','summary');
      summary.style.margin = '6px 0 8px';
      // recommendation score bar
      const __score = this._score(branch.series);
      const __scoreWrap = document.createElement('div');
      __scoreWrap.setAttribute('data-section','summary');
      __scoreWrap.style.margin = '6px 0 4px';
      const __bar = document.createElement('div');
      __bar.style.height = '6px';
      __bar.style.background = 'rgba(148,163,184,.3)';
      __bar.style.borderRadius = '6px';
      const __fill = document.createElement('div');
      __fill.style.height = '100%';
      __fill.style.width = Math.max(10, Math.min(100, __score)) + '%';
      __fill.style.borderRadius = '6px';
      __fill.style.background = 'linear-gradient(90deg, #6366F1, #22C55E)';
      __bar.appendChild(__fill);
      const __label = document.createElement('div');
      __label.textContent = `おすすめ度: ${__score}%`;
      __label.style.fontSize = '.8em';
      __label.style.color = '#94a3b8';
      __label.style.marginTop = '4px';
      const __micro = document.createElement('div');
      __micro.textContent = '指標（根拠: 入力語×状況一致×安定度）';
      __micro.style.fontSize = '.75em';
      __micro.style.color = '#64748b';
      __micro.style.marginTop = '2px';
      __scoreWrap.appendChild(__bar);
      __scoreWrap.appendChild(__label);
      __scoreWrap.appendChild(__micro);
      // risk/effort chips
      const __chips = document.createElement('div');
      __chips.style.display = 'flex';
      __chips.style.gap = '8px';
      __chips.style.margin = '6px 0 8px';
      const __risk = this._risk(branch.series);
      const __eff = this._effort(branch.series);
      const __mkChip = (t,c)=>{const s=document.createElement('span'); s.textContent=t; s.style.padding='2px 8px'; s.style.borderRadius='9999px'; s.style.border=`1px solid ${c}66`; s.style.color=c; s.style.fontSize='.75em'; return s;};
      __chips.appendChild(__mkChip(__risk.label, __risk.color));
      __chips.appendChild(__mkChip(__eff.label, __eff.color));
      // 3-sec tips
      // Prefer data-driven modern keywords; fallback to generic tips
      const __kw = this._deriveQuickKeywords(branch);
      const __tips = __kw.length ? __kw : this._tips(branch.series);
      // Summary block (action-oriented)
      const __summaryWrap = document.createElement('div');
      __summaryWrap.style.fontSize = '.85em';
      __summaryWrap.style.color = '#cbd5e1';
      __summaryWrap.style.margin = '4px 0 6px';
      __summaryWrap.setAttribute('data-section','summary');
      const __overview = document.createElement('div');
      __overview.style.marginBottom = '2px';
      __overview.textContent = `全体像: ${this._seriesNarrative(branch)}`;
      const __traits = document.createElement('div');
      try {
        const steps = Array.isArray(branch?.steps) ? branch.steps.slice(0,3) : [];
        const tags = steps.map(s => this._featureTag(s)).filter(Boolean);
        if (tags.length) {
          __traits.textContent = `特徴(卦・爻): ${tags.join(' → ')}`;
          __traits.style.marginBottom = '2px';
          __traits.setAttribute('data-section','learn');
          __traits.title = '各ステップの卦・爻と主要語（短訳）';
        }
      } catch {}
      const __reason = document.createElement('div');
      __reason.textContent = `選ぶ理由: ${__tips.join(' / ')}`;
      const __next = document.createElement('div');
      const __acts = this._toActionPhrases(__kw);
      // Stage-specific framing if possible
      const steps = Array.isArray(branch?.steps) ? branch.steps.slice(0,3) : [];
      if (__kw.length && steps.length === 3) {
        const nowAct = (__acts[0] || __tips[0] || '').toString();
        const midAct = (__acts[1] || __tips[1] || nowAct).toString();
        const finAct = (__acts[2] || __tips[2] || midAct).toString();
        __next.textContent = `次の一手: まず「${nowAct}」→ つぎ「${midAct}」→ 仕上げ「${finAct}」`;
      } else {
        __next.textContent = `次の一手: ${(__acts.length?__acts:__tips).join(' / ')}`;
      }
      __summaryWrap.appendChild(__overview);
      if (__traits.textContent) __summaryWrap.appendChild(__traits);
      __summaryWrap.appendChild(__reason);
      __summaryWrap.appendChild(__next);

      // Decision support (fit/caution/outcome + avoid/tradeoff)
      const __ds = document.createElement('div');
      __ds.style.borderTop = '1px dashed rgba(99,102,241,0.35)';
      __ds.style.marginTop = '6px';
      __ds.style.paddingTop = '6px';
      __ds.setAttribute('data-section','summary');
      const actions = String(branch.series||'').split('→');
      const lastText = steps[2]?.lineText || '';
      const lastSeverity = this._severityScore(lastText);
      const s1 = this._getBasicScore(steps[0]?.hex, steps[0]?.line);
      const s3 = this._getBasicScore(steps[2]?.hex, steps[2]?.line);
      const d13 = (s3 ?? s1 ?? 0) - (s1 ?? 0);
      const fit = this._fitPhrases(__kw);
      const caution = this._cautionPhrase(lastSeverity, actions[2]);
      const outcome = this._outcomePhrase(actions, d13, lastSeverity);
      const mk = (label,val)=>{ const d=document.createElement('div'); d.textContent = `${label}: ${val}`; d.style.fontSize='.84em'; d.style.color='#cbd5e1'; d.style.marginTop='2px'; return d; };
      if (fit.length) __ds.appendChild(mk('合う条件', fit.join(' / ')));
      const avoid = this._avoidPhrases(__kw);
      if (avoid.length) __ds.appendChild(mk('避けたい人', avoid.join(' / ')));
      const to = this._tradeoff(__kw);
      __ds.appendChild(mk('得るもの', to.gain));
      __ds.appendChild(mk('失う可能性', to.loss));
      __ds.appendChild(mk('注意点', caution));
      __ds.appendChild(mk('成果イメージ', outcome));

      // Optional: 時機メモ（根拠がある場合のみ）
      const timeMemo = (() => {
        try {
          const txt = (steps.map(s=>String(s.lineText||'').trim()).join(' '));
          const urgent = /(今すぐ|急|速やか|早めに)/;
          const waity  = /(待つ|時至る|しばらく|機を|熟す)/;
          const longt  = /(長期|時間をかけ|数週|数か月|数ヶ月)/;
          if (urgent.test(txt)) return '急ぎ目';
          if (waity.test(txt))  return '待ち優先';
          if (longt.test(txt))  return '時間をかける';
          return '';
        } catch { return ''; }
      })();
      if (timeMemo) __ds.appendChild(mk('時機', timeMemo));
      // influence words (bridge input -> branch) with scoring
      try {
        const tags = (window.HAQEI_INPUT_TAGS||[]).map(String);
        const tally = this._keywordTally(branch);
        let scored = tags.map(t => [t, tally.get(t)||0]).filter(([,w])=>w>0);
        if (!scored.length) {
          const infl = (__kw||[]).filter(k => tags.includes(k));
          if (infl.length) __ds.appendChild(mk('影響語', infl.join(' / ')));
        } else {
          scored.sort((a,b)=>b[1]-a[1]);
          const top2 = scored.slice(0,2).map(([t])=>t);
          __ds.appendChild(mk('影響語', top2.join(' / ')));
        }
      } catch {}
      // confidence bar
      try {
        const used = window.integratedAnalysisResult?.systemsUsed || {};
        const usedCount = Object.values(used).filter(Boolean).length || 0;
        const fallback = !!(global.futureSimulator?.branchGenerator?.usedFallback);
        const missing = branch.steps.filter(st => !Number.isFinite(this._getBasicScore(st.hex, st.line))).length;
        let conf = Math.round((usedCount/4)*100) - (fallback?10:0) - (missing*5);
        conf = Math.max(10, Math.min(100, conf));
        const wrap = document.createElement('div');
        wrap.style.marginTop = '4px';
        const bar = document.createElement('div');
        bar.style.height = '4px'; bar.style.background='rgba(148,163,184,.3)'; bar.style.borderRadius='6px';
        const fill = document.createElement('div');
        fill.style.height='100%'; fill.style.width = conf+'%'; fill.style.borderRadius='6px'; fill.style.background = 'linear-gradient(90deg,#22C55E,#16A34A)';
        bar.appendChild(fill);
        const lbl = document.createElement('div');
        lbl.textContent = `確信度: ${conf}%`;
        lbl.title = '算出: 活用率(使用システム/4) − フォールバック補正 − 欠損データ×5%';
        lbl.style.fontSize='.75em'; lbl.style.color='#94a3b8'; lbl.style.marginTop='2px';
        wrap.appendChild(bar); wrap.appendChild(lbl);
        __ds.appendChild(wrap);
      } catch {}

      // Evidence fold
      const __ev = document.createElement('details');
      __ev.style.marginTop = '6px';
      __ev.style.borderTop = '1px dashed rgba(99,102,241,0.35)';
      __ev.setAttribute('data-section','evidence');
      const __evsum = document.createElement('summary');
      __evsum.textContent = '根拠（引用と適用）';
      __evsum.style.cursor = 'pointer';
      __evsum.style.padding = '6px 0';
      const __evBody = document.createElement('div');
      __evBody.style.fontSize = '.85em';
      __evBody.style.color = '#cbd5e1';
      const quote = (steps[1]?.lineText || steps[0]?.lineText || steps[2]?.lineText || '').trim().slice(0, 60);
      const src = this._featureTag(steps[1] || steps[0] || steps[2] || {});
      const apply = `今回は「${(__kw[0]||'状況')}」が効いています`;
      __evBody.innerHTML = `<div>引用: 「${quote}…」 — ${src}</div><div>適用: ${apply}</div>`;
      __ev.appendChild(__evsum);
      __ev.appendChild(__evBody);
      // mount
      card.appendChild(__scoreWrap);
      card.appendChild(__chips);
      card.appendChild(__summaryWrap);
      card.appendChild(__ds);

      const details = document.createElement('details');
      details.style.borderTop = '1px dashed rgba(99,102,241,0.35)';
      const sum = document.createElement('summary');
      sum.textContent = '詳細を見る';
      sum.style.cursor = 'pointer';
      sum.style.padding = '8px 0';

      const ul = document.createElement('ul');
      ul.style.listStyle = 'disc';
      ul.style.paddingInlineStart = '18px';
      ul.style.display = 'flex';
      ul.style.flexDirection = 'column';
      ul.style.gap = '6px';

      branch.steps.forEach((step, i) => {
        const li = document.createElement('li');
        li.style.lineHeight = '1.4';
        const stepNum = i + 1;
        const head = `${'Step' + stepNum} ${step.action === '進' ? '進爻' : '変爻'}`;
        const text = step.lineText && step.lineText.length > 0 ? step.lineText : '（未登録）';
        li.textContent = `${head}: ${text}`;
        if (step.note) {
          const small = document.createElement('div');
          small.textContent = step.note;
          small.style.fontSize = '0.85em';
          small.style.opacity = '0.75';
          small.style.marginTop = '2px';
          li.appendChild(small);
        }
        ul.appendChild(li);
      });

      if (global.futureSimulator?.branchGenerator?.usedFallback) {
        const foot = document.createElement('div');
        foot.textContent = '※ 変爻先は推定を含みます';
        foot.style.fontSize = '0.8em';
        foot.style.opacity = '0.75';
        foot.style.marginTop = '8px';
        ul.appendChild(foot);
      }

      details.appendChild(sum);
      details.appendChild(ul);
      details.setAttribute('data-section','evidence');
      card.appendChild(title);
      card.appendChild(summary);
      card.appendChild(details);
      card.appendChild(__ev);

      card.addEventListener('click', () => {
        const ev = new CustomEvent('branchSelected', { detail: { id: branch.id, series: branch.series, steps: branch.steps } });
        this.container.dispatchEvent(ev);
      });
      return card;
    }

  async displayBranches(branches, currentSituation) {
      if (!this.container) return;
      this.container.innerHTML = '';

      // NOW: current situation summary
      try {
        if (currentSituation) {
          const now = document.createElement('div');
          now.style.margin = '6px 0 10px';
          now.style.padding = '10px 12px';
          now.style.border = '1px solid rgba(99,102,241,.35)';
          now.style.borderRadius = '10px';
          now.style.background = 'rgba(17,24,39,.35)';
          now.style.color = '#E5E7EB';

          const hex = Number(currentSituation.hexagramNumber || currentSituation['卦番号']);
          const hexName = String(currentSituation.hexagramName || currentSituation['卦名'] || '').trim();
          const linePos = Number(currentSituation.yaoPosition || 0) || (function(n){return Number(n)||0})(0);
          const yao = String(currentSituation.yaoName || currentSituation['爻'] || '').trim();

          const lineKey = () => `${hex}-${linePos}`;
          let mainText = '';
          try {
            if (!this._lineStates) {
              const r = await fetch('./data/h384-line-states.json', { cache:'no-cache' });
              this._lineStates = r.ok ? await r.json() : {};
            }
            const v = this._lineStates[lineKey()];
            mainText = (typeof v === 'string') ? v : (v && v.text) || '';
          } catch {}

          // 基礎スコア
          let baseScore = '';
          try {
            const candidates = {1:['初九','初六'],2:['九二','六二'],3:['九三','六三'],4:['九四','六四'],5:['九五','六五'],6:['上九','上六']};
            const yaoNames = yao ? [yao] : (candidates[linePos] || []);
            const data = (window.H384_DATA && Array.isArray(window.H384_DATA)) ? window.H384_DATA : [];
            const found = data.find(e => Number(e['卦番号']) === hex && (yaoNames.includes(String(e['爻']))));
            const v = Number(found && found['S1_基本スコア']);
            if (Number.isFinite(v)) baseScore = `${v}`;
          } catch {}

          now.innerHTML = `
            <div style="display:flex;align-items:center;gap:.75rem;flex-wrap:wrap;">
              <div style="font-weight:700;color:#c7d2fe;">Now 現在の状況</div>
              <div style="color:#e5e7eb;">${hexName || '卦未確定'} ${yao || (linePos?('第'+linePos+'爻'):'')}</div>
              ${baseScore ? `<span style=\"margin-left:auto;color:#a5b4fc;font-size:.85em;\">現在地点の土台の強さ: ${baseScore}</span>` : ''}
            </div>
            <div style="color:#a5b4fc;margin-top:4px;font-size:.95em;">${mainText || '（行状態テキスト未登録）'}</div>
          `;
          this.container.appendChild(now);
        }
      } catch(e) { console.warn('NOW block error:', e?.message||e); }

      // Comparison chart (wave/line) for intuitive overview
      try {
        const chartWrap = document.createElement('div');
        chartWrap.style.margin = '8px 0 12px';
        chartWrap.setAttribute('data-section','compare');
        const canvas = document.createElement('canvas');
        canvas.id = 'eight-branches-comparison';
        canvas.height = 160;
        chartWrap.appendChild(canvas);
        this.container.appendChild(chartWrap);
        if (window.Chart) {
          const labels = ['Step1', 'Step2', 'Step3'];
          const getBasicScore = (hex, line) => {
            try {
              const candidates = {
                1: ['初九','初六'], 2: ['九二','六二'], 3: ['九三','六三'],
                4: ['九四','六四'], 5: ['九五','六五'], 6: ['上九','上六']
              }[line] || [];
              const data = (window.H384_DATA && Array.isArray(window.H384_DATA)) ? window.H384_DATA : [];
              const found = data.find(e => Number(e['卦番号']) === Number(hex) && candidates.includes(String(e['爻'])));
              const v = Number(found && found['S1_基本スコア']);
              if (Number.isFinite(v)) return v;
            } catch {}
            return null;
          };
          const palette = ['#10B981','#3B82F6','#F59E0B','#EF4444','#A78BFA','#22C55E','#EAB308','#06B6D4'];
          const dashes  = [[], [6,3], [2,3], [8,4], [1,4], [10,2,2,2], [4,4,1,4], [12,3]];
          const shapes  = ['circle','triangle','rectRot','rectRounded','star','cross','dash','line'];
          const toDataset = (b, idx) => {
            const vals = b.steps.map(s => getBasicScore(s.hex, s.line)).map((v,i) => v ?? (b.steps[i].action === '進' ? 70 : 55));
            const color = palette[idx % palette.length];
            return {
              label: `分岐${b.id}`,
              data: vals,
              borderColor: color,
              backgroundColor: color + '55',
              tension: 0.35,
              pointRadius: 3,
              pointStyle: shapes[idx % shapes.length],
              borderDash: dashes[idx % dashes.length],
              fill: false
            };
          };
          const cfg = {
            type: 'line',
            data: { labels, datasets: branches.map((b,idx)=>toDataset(b,idx)) },
            options: {
              responsive: true,
              plugins: { legend: { display: true, position: 'top', labels: { color: '#cbd5e1', boxWidth: 16, boxHeight: 2 } } },
              scales: {
                y: { min: 0, max: 100, grid: { color: 'rgba(148,163,184,.2)' } },
                x: { grid: { display: false } }
              }
            }
          };
          new Chart(canvas.getContext('2d'), cfg);
        }
      } catch(e) { console.warn('Comparison chart error:', e?.message||e); }

      const grid = document.createElement('div');
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
      grid.style.gap = '12px';

      // compare section: おすすめTOP3（簡易比較）
      try {
        const scored = branches.map(b => ({ b, s: this._branchScore(b) }));
        scored.sort((x,y)=> y.s - x.s);
        const top = scored.slice(0,3).map(x=>x.b);
        if (top.length===3) {
          const box = document.createElement('div');
          box.setAttribute('data-section','compare');
          box.style.border='1px solid rgba(99,102,241,.35)'; box.style.borderRadius='10px'; box.style.padding='10px 12px'; box.style.margin='6px 0 10px';
          const h = document.createElement('div'); h.textContent='おすすめTOP3（簡易比較）'; h.style.color='#c7d2fe'; h.style.fontWeight='700'; h.style.marginBottom='4px';
          const explain = this._top3Explain(top);
          this._topExplainCache = explain;
          const mk = (rank,item,sub)=>{ const d=document.createElement('div'); d.style.color='#cbd5e1'; d.style.fontSize='.9em'; d.textContent = `${rank}. 分岐${item.id}｜${item.series}｜${item.score}% - ${sub}`; return d; };
          box.appendChild(h);
          box.appendChild(mk(1,explain.a,explain.a.reason));
          box.appendChild(mk(2,explain.b,explain.b.reason));
          box.appendChild(mk(3,explain.c,explain.c.reason));
          this.container.appendChild(box);
          // 上段固定グリッド（有効時）
          const flag = (window.HAQEI_CONFIG?.featureFlags?.enableTop3Mode !== false);
          if (flag) {
            const topGrid = document.createElement('div');
            topGrid.style.display='grid'; topGrid.style.gridTemplateColumns='repeat(auto-fill, minmax(280px, 1fr))'; topGrid.style.gap='12px';
            topGrid.setAttribute('data-section','compare');
            const topIds = new Set(top.map(t=>t.id));
            top.forEach((b,i)=> topGrid.appendChild(this._card(b,i)));
            // annotate first card with "なぜ他ではないか"
            try {
              const first = topGrid.firstElementChild;
              if (first) {
                const note = document.createElement('div');
                note.style.marginTop='4px'; note.style.fontSize='.85em'; note.style.color='#cbd5e1';
                note.textContent = `なぜ他ではないか: 2位→${explain.b.reason} ／ 3位→${explain.c.reason}`;
                first.appendChild(note);
              }
            } catch {}
            this.container.appendChild(topGrid);
            // 残りを下段グリッドへ
            branches.filter(b => !topIds.has(b.id)).forEach((b,i)=> grid.appendChild(this._card(b,i)));
            // 後続でgridを見出しとともにappend
          } else {
            // フラグ無効時は通常どおり全カード
            branches.forEach((b, i) => grid.appendChild(this._card(b, i)));
          }
        }
      } catch {}

      const heading = document.createElement('div');
      heading.textContent = '選べる8つの進路（進む/変える）';
      heading.style.color = '#c7d2fe';
      heading.style.fontWeight = '700';
      heading.style.margin = '8px 0 2px';
      this.container.appendChild(heading);
      const helper = document.createElement('div');
      helper.textContent = '進=現行を深める / 変=路線を切り替える（各カードに特徴・合う条件・注意点・成果イメージを表示）';
      helper.style.color = '#94a3b8';
      helper.style.fontSize = '.9em';
      helper.style.margin = '0 0 8px';
      this.container.appendChild(helper);
      this.container.appendChild(grid);
    }
  }

  if (typeof window !== 'undefined') {
    global.EightBranchesDisplay = EightBranchesDisplay;
  }

  console.log('✅ EightBranchesDisplay loaded');
})(typeof window !== 'undefined' ? window : this);
