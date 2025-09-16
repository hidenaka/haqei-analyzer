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
      // Feature flags and runtime state
      try {
        const ff = (window.HAQEI_CONFIG && window.HAQEI_CONFIG.featureFlags) || {};
        this.enableEvidence = ff.evidencePanel !== false;
        this.enableCompare = ff.comparePanel !== false;
        this.showBadges = ff.showBadges !== false;
        this.showEndpointPreview = ff.showEndpointPreview !== false;
        this.minimalCardHeader = ff.minimalCardHeader !== false; // 既定ON
        this.titleEmoji = ff.titleEmoji === true; // 既定OFF
        this.showOutcomeStamp = ff.showOutcomeStamp === true; // 既定OFF
        this.enableConfidenceBar = ff.showConfidenceBar === true; // 既定OFF（既存フラグを尊重）
      } catch { this.enableEvidence = false; this.enableCompare = false; this.showBadges = false; this.minimalCardHeader = true; this.titleEmoji = false; this.showOutcomeStamp = false; this.enableConfidenceBar = false; }
      this.displayMode = 'applied';
      this.visualStrengthen = (window.HAQEI_CONFIG?.featureFlags?.visualStrengthen !== false);
      this._lastBranches = null;
      this._lastSituation = null;
      this._compare = new Map();
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
      // effect type mapping (関係/構造/実行)
      this._effectMap = {
        関係: ['信頼','合意形成','協業','支援','関係','関係調整','連携','公正','透明性','支持'],
        構造: ['制度','設計','基盤','土台づくり','整備','構造','仕組み','再発防止','補強'],
        実行: ['好機','推進','前進','実行','実装','行動','成果','スピード']
      };
    }

    initialize(containerId) {
      const el = document.getElementById(containerId);
      if (!el) return false;
      this.container = el;
      this.container.innerHTML = '';
      return true;
    }

    _rerender(){
      try {
        if (!this.container) return;
        // 再描画（最終描画時のデータを使用）
        this.displayBranches(this._lastBranches || [], this._lastSituation || null);
      } catch (e) {
        try { console.warn('EightBranchesDisplay _rerender error:', e?.message||e); } catch {}
      }
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
    _toNeutralJapanese(text){
      try {
        let t = String(text||'').trim();
        if (!t) return t;
        // 語尾や推奨表現を状況説明寄りに置換（軽量ルール）
        const pairs = [
          [/しましょう(?=。|$)/g, 'する局面です'],
          [/すべき(?=。|$)/g, 'が求められやすい局面です'],
          [/したほうがいい|した方がいい/g, 'しやすい局面です'],
          [/するのがよい|するのが良い/g, 'となりやすいです'],
          [/のがよい|のが良い/g, 'であることが多いです'],
          [/おすすめです/g, '選ばれがちです'],
          [/推奨されます/g, '適合しやすいです'],
          [/望ましいでしょう/g, '望ましい傾向があります'],
          [/が良いでしょう/g, 'が適している傾向です'],
          [/しまうと良い/g, 'しやすい'],
          [/心がけましょう/g, '心がける局面です'],
          [/が望ましい/g, 'が望まれる傾向です'],
          // 「〜すれば良いです」系の緩和
          [/していけば良いです|していけばよいです/g, 'していきやすい局面です'],
          [/すれば良いです|すればよいです/g, 'する局面です'],
          [/進めば良いです|進めばよいです/g, '進む局面です'],
          [/見直せば良いです|見直せばよいです/g, '見直しが焦点になりやすい局面です'],
          [/整えれば良いです|整えればよいです/g, '整える局面です'],
          [/調整すれば良いです|調整すればよいです/g, '調整が焦点になりやすい局面です'],
        ];
        pairs.forEach(([re, rep]) => { t = t.replace(re, rep); });
        // 命令調の簡易弱体化
        t = t.replace(/ください(?=。|$)/g, 'する局面です');
        // 強い断定の和らげ
        t = t.replace(/必ず/g, '基本的に');
        // 重複終止の整理
        t = t.replace(/ですです/g, 'です');
        t = t.replace(/です。です/g, 'です。');
        t = t.replace(/。。+/g, '。');
        t = t.replace(/\s+。/g, '。');
        return t;
      } catch { return String(text||''); }
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
    _tagKeyOnly(tag){
      const t = String(tag||'');
      const i = t.indexOf(':');
      return (i>=0) ? t.slice(i+1) : t;
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
        if (actions.join('→') === '進→進→進') {
          if (d13 >= 10) return '序盤から終盤まで加速しながら正攻法で押し切る構成';
          if (d13 <= -10) return '正攻法で進むが、後半は無理せず守りを固める構成';
          return '序盤から終盤まで正攻法で押し切る構成';
        }
        if (actions.join('→') === '進→進→変') {
          if (d13 <= -10) return '押し切り基調から最後は方向転換で安全に締める';
          return '押し切りつつ最後は必要最小限の調整で仕上げる';
        }
        if (actions.join('→') === '進→変→進') return '中盤で方針を切替えて再加速する構成';
        if (actions.join('→') === '進→変→変') return '初手は進み、後半は路線転換で再設計していく構成';
        if (actions.join('→') === '変→進→進') return 'まず切替え、以降は前進で成果を固める構成';
        if (actions.join('→') === '変→進→変') return '切替え→前進の後、最後に微修正で整える構成';
        if (actions.join('→') === '変→変→進') return '段階的に切替えた上で、最後は前進でまとめる構成';
        if (actions.join('→') === '変→変→変') return '三段階で順次切替えて新路線を築く構成';
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
    _short(txt, max=80){
      try { const t=String(txt||'').trim(); return (t.length>max) ? (t.slice(0,max-1)+'…') : t; } catch { return txt; }
    }
    _effectTypes(keys){
      const counts = { 関係:0, 構造:0, 実行:0 };
      const list = Array.from(new Set(keys||[]));
      list.forEach(k=>{
        Object.entries(this._effectMap).forEach(([type, arr])=>{ if (arr.includes(k)) counts[type]++; });
      });
      const ranked = Object.entries(counts).sort((a,b)=> b[1]-a[1]).filter(([,c])=>c>0).map(([t])=>t);
      return ranked.slice(0,2);
    }
    _difficultyHeuristics(keys){
      const set = new Set(keys||[]);
      const negotiation = ['合意形成','関係調整','連携','協業','公正','透明性'];
      const specialty  = ['制度','設計','基盤','補強','再発防止','専門','技術'];
      const hasNeg = negotiation.some(w=>set.has(w));
      const hasSpec= specialty.some(w=>set.has(w));
      const negLevel = hasNeg ? '高' : '中';
      const specLevel= hasSpec? '中〜高' : '中';
      return { negotiation: negLevel, specialty: specLevel };
    }
    _stepTags(branch){
      try {
        const steps = Array.isArray(branch?.steps) ? branch.steps.slice(0,3) : [];
        return steps.map(s => this._featureTag(s)).filter(Boolean);
      } catch { return []; }
    }
    _fitFromSteps(branch){
      const tags = this._stepTags(branch).map(t=>this._tagKeyOnly(t));
      if (!tags.length) return [];
      const out = [];
      if (tags[0]) out.push(`今は「${tags[0]}」が強み`);
      if (tags[1]) out.push(`途中は「${tags[1]}」に気を配れる`);
      return out.slice(0,2);
    }
    _avoidFromSteps(branch){
      const tags = this._stepTags(branch).map(t=>this._tagKeyOnly(t));
      if (!tags.length) return [];
      // Step2を優先し、優しい表現に
      const base = tags[1] || tags[0];
      return base ? [`「${base}」への気配りが苦手な人`] : [];
    }
    _tradeoffFromSteps(branch){
      const tags = this._stepTags(branch).map(t=>this._tagKeyOnly(t));
      const gain = tags[0] ? `「${tags[0]}」を伸ばせる` : '小さく前進を積み上げられる';
      const loss = tags[2] ? `「${tags[2]}」に手間がかかるかも` : '別案より少し時間がかかるかも';
      return { gain, loss };
    }
    _top3Explain(top){
      try {
        const annotate = (b) => {
          const score = this._branchScore(b);
          const reason = this._short(this._seriesNarrative(b), 80);
          return { id: b?.id, series: b?.series, score, reason };
        };
        const a = top[0] ? annotate(top[0]) : { id:1, series:'', score:0, reason:'' };
        const b = top[1] ? annotate(top[1]) : { id:2, series:'', score:0, reason:'' };
        const c = top[2] ? annotate(top[2]) : { id:3, series:'', score:0, reason:'' };
        return { a, b, c };
      } catch {
        const fallback = (i)=> ({ id: top[i]?.id || (i+1), series: top[i]?.series||'', score: this._branchScore(top[i]||{}), reason: '総合的に妥当' });
        return { a: fallback(0), b: fallback(1), c: fallback(2) };
      }
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
    _branchScore(branch){
      try {
        const base = this._score(branch?.series || '');
        const steps = Array.isArray(branch?.steps) ? branch.steps.slice(0,3) : [];
        const weights = [0.5, 0.3, 0.2];
        let wsum = 0, acc = 0;
        steps.forEach((s, i) => {
          const v = this._getBasicScore(s?.hex, s?.line);
          const w = weights[i] || 0;
          if (Number.isFinite(v)) { acc += v * w; wsum += w; }
        });
        let combined = wsum ? Math.round(acc / wsum) : base;
        const actions = String(branch?.series||'').split('→');
        const pat = actions.join('→');
        if (pat === '進→進→進') combined += 5;
        if (pat === '変→変→変') combined -= 5;
        combined = Math.round((combined * 0.7) + (base * 0.3));
        return Math.min(100, Math.max(0, combined));
      } catch { return this._score(branch?.series || '') || 50; }
    }
    _evidenceForStep(hex, line){
      try {
        const yaoNames = this._yaoCandidatesByLine(line);
        const data = (window.H384_DATA && Array.isArray(window.H384_DATA)) ? window.H384_DATA : [];
        const entry = data.find(e => Number(e['卦番号']) === Number(hex) && yaoNames.includes(String(e['爻'])));
        const S1 = Number(entry && entry['S1_基本スコア']);
        const S7 = Number(entry && entry['S7_総合評価スコア']);
        let keywords = [];
        const raw = entry && (Array.isArray(entry['キーワード']) ? entry['キーワード'] : (typeof entry['キーワード']==='string' ? entry['キーワード'].split(/、|,|\s+/).filter(Boolean) : []));
        if (raw && raw.length) keywords = this._normalizeKeywords(raw).slice(0,5);
        return { S1, S7, keywords, hexName: entry && entry['卦名'], yaoName: entry && entry['爻'] };
      } catch { return null; }
    }

    _renderComparePanel(){
      try {
        if (!this.enableCompare) return;
        // 比較機能は不要のため非表示
        return;
      } catch {}
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
      const classic = (window.HAQEI_CONFIG?.featureFlags?.layoutClassic !== false);
      const __easy = (window.HAQEI_CONFIG?.featureFlags?.lowReadingLevel !== false);
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
      // A11y: フォーカス可能・グループ化
      try {
        card.tabIndex = 0;
        card.setAttribute('role', 'group');
        card.setAttribute('aria-label', `分岐${branch.id} ${branch.series} の概要`);
      } catch {}
      // Badges (現代解釈 / 推定)
      if (this.showBadges) {
        const badgeWrap = document.createElement('div');
        badgeWrap.style.display = 'flex';
        badgeWrap.style.gap = '6px';
        badgeWrap.style.flexWrap = 'wrap';
        badgeWrap.style.marginBottom = '6px';
        const mkBadge = (text, bg, fg) => {
          const s = document.createElement('span');
          s.textContent = text;
          s.style.fontSize = '.75em';
          s.style.padding = '2px 6px';
          s.style.borderRadius = '9999px';
          s.style.border = '1px solid rgba(99,102,241,.35)';
          s.style.background = bg;
          s.style.color = fg;
          return s;
        };
        const applied = mkBadge('現代解釈', 'rgba(99,102,241,.15)', '#c7d2fe');
        try { applied.setAttribute('data-test','badge-applied'); } catch {}
        badgeWrap.appendChild(applied);
        card.appendChild(badgeWrap);
        card.__badgeWrap = badgeWrap;
      }

      const title = document.createElement('div');
      try { title.setAttribute('data-role','branch-title'); } catch {}
      const badge = this._badge(branch.series);
      const __numCirc = '①②③④⑤⑥⑦⑧'[ (branch.id-1) % 8 ] || String(branch.id);
      if (this.minimalCardHeader) {
        title.textContent = `${__numCirc} 分岐${branch.id}｜${branch.series}`;
      } else {
        title.innerHTML = `${__numCirc} 分岐${branch.id}｜${branch.series} <span style=\"margin-left:8px;padding:2px 8px;border-radius:9999px;background:${badge.color}22;color:${badge.color};font-size:.8em;\">${badge.label}</span>`;
      }
      title.style.fontWeight = '600';
      title.style.color = '#A5B4FC';
      title.style.marginBottom = '8px';
      // Visual spiral (mini glyph)
      try {
        if (this.visualStrengthen) {
          const style = (window.HAQEI_CONFIG?.featureFlags?.visualStyle) || 'track';
          const glyph = (style==='spiral') ? this._renderSpiralGlyph(branch) : this._renderTrackGlyph(branch);
          if (glyph) {
            glyph.style.float = 'left';
            glyph.style.marginRight = '8px';
            glyph.style.marginTop = '2px';
            card.appendChild(glyph);
          }
        }
      } catch {}
      // intuitive emoji prefix（既定OFF or minimal時は非表示）
      try { if (this.titleEmoji && !this.minimalCardHeader) { const em = this._emoji(branch.series); title.innerHTML = `${em} ` + title.innerHTML; } } catch {}

      // Outcome stamp (top-right)
      try {
        if (this.visualStrengthen && this.showOutcomeStamp && !this.minimalCardHeader) {
          const st = this._outcomeStamp(branch);
          if (st && st.text) {
            const stamp = document.createElement('span');
            stamp.textContent = st.text;
            stamp.setAttribute('data-test','outcome-stamp');
            stamp.style.float = 'right';
            stamp.style.marginLeft = '8px';
            stamp.style.padding = '2px 8px';
            stamp.style.borderRadius = '9999px';
            stamp.style.fontSize = '.75em';
            stamp.style.border = '1px solid rgba(99,102,241,.35)';
            stamp.style.background = st.bg;
            stamp.style.color = st.fg;
            card.appendChild(stamp);
          }
        }
      } catch {}

      const summary = document.createElement('div');
      // Default summary (fallback)
      summary.textContent = this._summary(branch.series);
      summary.style.fontSize = '.9em';
      summary.style.color = '#cbd5e1';
      summary.setAttribute('data-section','summary');
      summary.style.margin = '6px 0 8px';
      try { summary.setAttribute('aria-label', `まとめ: ${summary.textContent}`); } catch {}

      // Try to enrich with easy oneLine/next3/fit/avoid/caution
      const easyBlock = document.createElement('div');
      easyBlock.style.margin = '6px 0 8px';
      easyBlock.style.padding = '8px 10px';
      easyBlock.style.background = 'rgba(30,41,59,0.35)';
      easyBlock.style.border = '1px dashed rgba(99,102,241,0.35)';
      easyBlock.style.borderRadius = '8px';
      easyBlock.style.display = 'none';
      try { easyBlock.setAttribute('role','region'); easyBlock.setAttribute('aria-label','やさしい指針'); } catch {}

      const applyEasyToDOM = (easy) => {
        if (!easy) return;
        try {
          // Replace summary with oneLine if available
          if (easy.oneLine && typeof easy.oneLine === 'string') {
            summary.textContent = easy.oneLine;
          }
          // Helper: truncate for readability
          const truncate = (t, n=42) => {
            try { const s=String(t||'').trim(); return s.length>n ? s.slice(0,n-1)+'…' : s; } catch { return t; }
          };
          // Build next3 lines with icons and short text
          const n3 = easy.next3 || {};
          const makeLine = (icon, label, text) => {
            if (!text) return null;
            const row = document.createElement('div');
            row.style.display='flex'; row.style.alignItems='center'; row.style.gap='6px';
            row.style.marginTop='4px'; row.style.fontSize='.9em'; row.style.color='#cbd5e1';
            const ico = document.createElement('span'); ico.textContent = icon; ico.ariaHidden='true';
            const lab = document.createElement('span'); lab.textContent = label; lab.style.color = '#A5B4FC'; lab.style.minWidth='3.5em'; lab.style.fontWeight='600';
            const txt = document.createElement('span'); txt.textContent = truncate(text, 48); txt.title = String(text);
            row.appendChild(ico); row.appendChild(lab); row.appendChild(txt);
            return row;
          };

          const linesWrap = document.createElement('div');
          const L1 = makeLine('🕒','いま', n3.first);
          const L2 = makeLine('▶','すぐ', n3.second);
          const L3 = makeLine('🎯','この先', n3.final);
          [L1,L2,L3].forEach(x=>{ if(x) linesWrap.appendChild(x); });

          // Fit/Avoid as small chips, Caution as warning row
          const chipsWrap = document.createElement('div');
          chipsWrap.style.display='flex'; chipsWrap.style.flexWrap='wrap'; chipsWrap.style.gap='6px'; chipsWrap.style.marginTop='8px';
          const chip = (text, kind) => {
            if (!text) return null;
            const s = document.createElement('span');
            s.textContent = text;
            s.style.fontSize='.75em'; s.style.padding='2px 6px'; s.style.borderRadius='9999px';
            s.style.border='1px solid rgba(99,102,241,.35)';
            s.style.background = kind==='avoid' ? 'rgba(239,68,68,.15)' : 'rgba(16,185,129,.15)';
            s.style.color = kind==='avoid' ? '#FCA5A5' : '#86EFAC';
            try { s.setAttribute('role','note'); s.setAttribute('aria-label', text); } catch {}
            return s;
          };
          const fitTxt = (easy.fit||'').replace(/^合う場面:\s*/, '');
          const avoidTxt = (easy.avoid||'').replace(/^合わない場面:\s*/, '');
          const fitChip = chip(`向いている: ${truncate(fitTxt, 24)}`, 'fit');
          const avoidChip = chip(`非推奨: ${truncate(avoidTxt, 24)}`, 'avoid');
          [fitChip, avoidChip].forEach(x=>{ if(x) chipsWrap.appendChild(x); });

          const cautionRow = document.createElement('div');
          if (easy.caution){
            cautionRow.style.marginTop='6px'; cautionRow.style.fontSize='.8em'; cautionRow.style.color='#FCA5A5';
            cautionRow.textContent = `⚠ 留意: ${easy.caution}`;
            try { cautionRow.setAttribute('role','note'); cautionRow.setAttribute('aria-label', `留意: ${easy.caution}`); } catch {}
          }

          // Mount easy block
          easyBlock.innerHTML = '';
          const hdr = document.createElement('div');
          hdr.textContent = 'やさしい指針';
          hdr.style.fontWeight = '600';
          hdr.style.fontSize = '.9em';
          hdr.style.color = '#A5B4FC';
          easyBlock.appendChild(hdr);
          if (linesWrap.childNodes.length) easyBlock.appendChild(linesWrap);
          if (chipsWrap.childNodes.length) easyBlock.appendChild(chipsWrap);
          if (easy.caution) easyBlock.appendChild(cautionRow);
          easyBlock.style.display = 'block';
        } catch {}
      };

      try {
        const start = (Array.isArray(branch?.steps) && branch.steps[0]) ? branch.steps[0] : null;
        if (start && window.easyScenarioLoader) {
          const keySig = String(branch.series||'');
          const ready = window.easyScenarioLoader.getEasyIfReady(start.hex, start.line, keySig);
          if (ready) {
            applyEasyToDOM(ready);
          } else {
            // Load asynchronously and then render
            window.easyScenarioLoader.getEasy(start.hex, start.line, keySig).then(ez => {
              if (ez) applyEasyToDOM(ez);
            }).catch(()=>{});
          }
        }
      } catch {}
      // recommendation score bar — link to comparison chart metric (final S7). If S7 missing, skip rendering.
      const __scoreWrap = document.createElement('div');
      __scoreWrap.setAttribute('data-section','score');
      __scoreWrap.style.margin = '6px 0 4px';
      ( () => {
        try {
          const steps = Array.isArray(branch?.steps) ? branch.steps.slice(0,3) : [];
          const last = steps[steps.length-1] || {};
          const s7 = this._getS7Score(last.hex, last.line);
          if (!Number.isFinite(s7)) {
            // S7が最終ステップで取得できない場合は、推定複合スコアの細メーターを表示
            const est = Math.max(0, Math.min(100, Math.round(this._branchScore(branch))));
            const wrap = document.createElement('div');
            wrap.style.opacity = '.95';
            const meter = document.createElement('div');
            meter.style.height = '4px';
            meter.style.background = 'rgba(148,163,184,.25)';
            meter.style.borderRadius = '6px';
            const fill = document.createElement('div');
            fill.style.height = '100%';
            fill.style.width = est + '%';
            fill.style.borderRadius = '6px';
            fill.style.background = 'linear-gradient(90deg, #94A3B8, #22C55E)';
            meter.appendChild(fill);
            const lab = document.createElement('div');
            lab.textContent = `推定: ${est}%`;
            lab.style.fontSize = '.75em';
            lab.style.color = '#94a3b8';
            lab.style.marginTop = '2px';
            const note = document.createElement('div');
            note.textContent = '推定のため評価バー非表示';
            note.style.fontSize = '.7em';
            note.style.color = '#64748b';
            note.style.marginTop = '2px';
            try { meter.setAttribute('role','meter'); meter.setAttribute('aria-valuenow', String(est)); meter.setAttribute('aria-valuemin','0'); meter.setAttribute('aria-valuemax','100'); } catch {}
            wrap.appendChild(meter);
            wrap.appendChild(lab);
            wrap.appendChild(note);
            __scoreWrap.appendChild(wrap);
            // 推定バッジ追加
            try {
              if (card.__badgeWrap) {
                const estBadge = document.createElement('span');
                estBadge.textContent = '推定';
                estBadge.style.fontSize = '.75em';
                estBadge.style.padding = '2px 6px';
                estBadge.style.borderRadius = '9999px';
                estBadge.style.border = '1px solid rgba(99,102,241,.35)';
                estBadge.style.background = 'rgba(148,163,184,.15)';
                estBadge.style.color = '#cbd5e1';
                estBadge.setAttribute('data-test','badge-estimated');
                card.__badgeWrap.appendChild(estBadge);
              }
            } catch {}
            return;
          }
          const __bar = document.createElement('div');
          __bar.style.height = '6px';
          __bar.style.background = 'rgba(148,163,184,.3)';
          __bar.style.borderRadius = '6px';
          const __fill = document.createElement('div');
          __fill.style.height = '100%';
          __fill.style.width = Math.max(0, Math.min(100, Math.round(s7))) + '%';
          __fill.style.borderRadius = '6px';
          __fill.style.background = 'linear-gradient(90deg, #6366F1, #22C55E)';
          __bar.appendChild(__fill);
          const __label = document.createElement('div');
          __label.textContent = `適合度: ${Math.round(s7)}%`;
          __label.style.fontSize = '.8em';
          __label.style.color = '#94a3b8';
          __label.style.marginTop = '4px';
          try { __bar.setAttribute('role','meter'); __bar.setAttribute('aria-valuenow', String(Math.round(s7))); __bar.setAttribute('aria-valuemin','0'); __bar.setAttribute('aria-valuemax','100'); } catch {}
          const __micro = document.createElement('div');
          __micro.textContent = __easy ? '目安（上のグラフの最終点）' : '指標: Chart最終点(S7)';
          __micro.style.fontSize = '.75em';
          __micro.style.color = '#64748b';
          __micro.style.marginTop = '2px';
          __scoreWrap.appendChild(__bar);
          __scoreWrap.appendChild(__label);
          __scoreWrap.appendChild(__micro);
        } catch {}
      })();
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
      // effect types and difficulty (heuristics) — Classicでは非表示
      // Confidence bar: completely feature-gated (default: off)
      if (!classic && (window.HAQEI_CONFIG?.featureFlags?.showConfidenceBar === true)) {
        try {
          const kw = this._deriveQuickKeywords(branch);
          const types = this._effectTypes(kw);
          const diff = this._difficultyHeuristics(kw);
          const neutral = '#38BDF8';
          types.forEach(t => __chips.appendChild(__mkChip(t, neutral)));
          __chips.appendChild(__mkChip(`利害調整:${diff.negotiation}`, '#F59E0B'));
          __chips.appendChild(__mkChip(`専門性:${diff.specialty}`, '#8B5CF6'));
        } catch {}
      }
      // 3-sec tips
      // Prefer data-driven modern keywords; fallback to generic tips
      const __kw = this._deriveQuickKeywords(branch);
      const __tips = __kw.length ? __kw : this._tips(branch.series);
      // 系列固有フレーズで差分を強調
      const __flavor = (() => {
        try {
          const pat = String(branch.series||'');
          const acts = pat.split('→');
          const stepsLocal = Array.isArray(branch?.steps) ? branch.steps.slice(0,3) : [];
          const lastText = stepsLocal[2]?.lineText || '';
          const sev = this._severityScore(lastText);
          const lastAct = acts[2] || '';
          if (sev >= 3) return lastAct === '変' ? '最後は安全側に切替えて立て直す' : '最後は守りに着地して被害を抑える';
          if (sev >= 1) return lastAct === '変' ? '最後は慎重に調整して締める' : '慎重さを伴って仕上げる';
          switch (pat) {
            case '進→進→進': return '勢い維持で押し切る';
            case '進→進→変': return '最後は微調整で締める';
            case '進→変→進': return '中盤の切替で再加速';
            case '進→変→変': return '後半は設計し直す';
            case '変→進→進': return '初手転換で安定化';
            case '変→進→変': return '締めに向けて整える';
            case '変→変→進': return '段階転換ののち前進';
            case '変→変→変': return '全面転換で新路線';
            default: return '';
          }
        } catch { return ''; }
      })();
      // Summary block (action-oriented)
      const __summaryWrap = document.createElement('div');
      __summaryWrap.style.fontSize = '.85em';
      __summaryWrap.style.color = '#cbd5e1';
      __summaryWrap.style.margin = '4px 0 6px';
      __summaryWrap.setAttribute('data-section','summary');
      const __overview = document.createElement('div');
      __overview.style.marginBottom = '2px';
      __overview.textContent = '全体像: ' + this._short(this._toNeutralJapanese(this._seriesNarrative(branch)), 90);

      // 終点の一行（Step3のNow相当を短く） — 非同期で後置
      (async () => {
        try {
          const stepsArr = Array.isArray(branch?.steps) ? branch.steps.slice(0,3) : [];
          const last = stepsArr[2] || stepsArr[1] || stepsArr[0] || null;
          if (!last) return;
          if (this.showEndpointPreview) {
            const info = await this._endpointInfoForStep(last.hex, last.line);
            if (info && (info.title || info.summary || (info.keywords||[]).length)) {
              const block = document.createElement('div');
              try { block.setAttribute('data-test','endpoint-block'); block.setAttribute('role','group'); block.setAttribute('aria-label', `終点情報: ${info.title||''}`); } catch {}
              block.style.margin = '4px 0';
              block.style.padding = '6px 8px';
              block.style.border = '1px dashed rgba(99,102,241,.35)';
              block.style.borderRadius = '8px';
              block.style.background = 'rgba(30,41,59,0.35)';
              // title line
              if (info.title) {
                const t = document.createElement('div');
                t.style.color = '#a5b4fc';
                t.style.fontWeight = '600';
                t.style.marginBottom = '2px';
                t.textContent = `終点: ${info.title}`;
                block.appendChild(t);
              }
              // meta row (S7 + keywords)
              if ((info.s7!=null) || (info.keywords && info.keywords.length)) {
                const meta = document.createElement('div');
                meta.style.display='flex'; meta.style.gap='6px'; meta.style.flexWrap='wrap'; meta.style.alignItems='center';
                if (info.s7!=null) {
                  const pill = document.createElement('span');
                  pill.textContent = `到達S7: ${info.s7}`;
                  pill.style.fontSize = '.75em';
                  pill.style.padding = '2px 6px';
                  pill.style.borderRadius = '9999px';
                  pill.style.border = '1px solid rgba(34,197,94,.35)';
                  pill.style.background = 'rgba(34,197,94,.10)';
                  pill.style.color = '#86EFAC';
                  meta.appendChild(pill);
                }
                (info.keywords||[]).slice(0,3).forEach(k => {
                  const chip=document.createElement('span');
                  chip.textContent = k;
                  chip.style.fontSize = '.75em'; chip.style.padding='1px 6px'; chip.style.border='1px solid rgba(148,163,184,.35)'; chip.style.borderRadius='9999px'; chip.style.color='#cbd5e1';
                  meta.appendChild(chip);
                });
                block.appendChild(meta);
              }
              // summary text
              if (info.summary) {
                const s = document.createElement('div');
                s.style.color = '#cbd5e1'; s.style.fontSize = '.85em'; s.style.marginTop = '2px';
                s.textContent = this._short(info.summary, 90);
                block.appendChild(s);
              }
              __summaryWrap.appendChild(block);
            }
          } else {
            const endLine = await this._oneLinerForStep(last.hex, last.line);
            if (endLine) {
              const __end = document.createElement('div');
              __end.style.color = '#a5b4fc';
              __end.style.fontSize = '.85em';
              __end.style.margin = '2px 0';
              __end.textContent = '終点: ' + this._short(endLine, 60);
              __summaryWrap.appendChild(__end);
            }
          }
        } catch {}
      })();
      const __traits = document.createElement('div'); // 特徴行は非表示
      // 強みが現れやすい点は削除

      // Visual effects (関係/構造/実行) icons
      try {
        if (this.visualStrengthen) {
          let types = this._effectTypes(__kw);
          // フォールバック: 少なくとも1種は出す
          if (!types || types.length === 0) {
            const prog = String(branch.series||'').split('→').filter(a=>a==='進').length;
            const trans= String(branch.series||'').split('→').filter(a=>a==='変').length;
            if (prog >= 2) types = ['実行'];
            else if (trans >= 2) types = ['構造'];
            else types = ['関係'];
          }
          if (types && types.length) {
            const row = document.createElement('div');
            row.style.display = 'flex'; row.style.gap='6px'; row.style.alignItems='center'; row.style.margin='2px 0';
            row.setAttribute('data-test','visual-effects');
            const iconOf = t => t==='関係' ? '🤝' : (t==='構造' ? '🏗' : '🏃');
            types.slice(0,2).forEach(t => { const s=document.createElement('span'); s.textContent = iconOf(t); s.setAttribute('aria-label', t); row.appendChild(s); });
            __summaryWrap.appendChild(row);
          }
        }
      } catch {}
      const __next = document.createElement('div');
      const __acts = this._toActionPhrases(__kw);
      // Stage-specific framing if possible
      const steps = Array.isArray(branch?.steps) ? branch.steps.slice(0,3) : [];
      if (__kw.length && steps.length === 3) {
        const nowAct = (__acts[0] || __tips[0] || '').toString();
        const midAct = (__acts[1] || __tips[1] || nowAct).toString();
        const finAct = (__acts[2] || __tips[2] || midAct).toString();
        __next.textContent = this._short(`移行の観点: まず「${nowAct}」が焦点になりやすい → つぎ「${midAct}」→ 終盤「${finAct}」`, 110);
      } else {
        const items = (__acts.length?__acts:__tips).map(t=>`「${t}」が焦点`).join(' / ');
        __next.textContent = this._short(`移行の観点: ${items}`, 110);
      }
      __summaryWrap.appendChild(__overview);
      if (__traits.textContent) __summaryWrap.appendChild(__traits);
      __summaryWrap.appendChild(__reason);
      // 流れ（進/変を動詞に）
      try {
        const flowWords = String(branch.series||'').split('→').map(t => t==='進' ? '前進' : '切替').join(' → ');
        const __flow = document.createElement('div');
        __flow.style.fontSize = '.8em';
        __flow.style.color = '#94a3b8';
        __flow.style.marginTop = '2px';
        __flow.textContent = `流れ: ${flowWords}`;
        __summaryWrap.appendChild(__flow);
      } catch {}

      // Sparkline (S1 trend) — 指定によりS1_基本スコアを可視化
      try {
        if (this.visualStrengthen) {
          const s1s = (Array.isArray(branch.steps) ? branch.steps.slice(0,3) : []).map(s => this._getS1Value(s.hex, s.line, s.action));
          const anyMissing = s1s.some(v => v==null);
          const svgNS='http://www.w3.org/2000/svg';
          const w=60,h=20,pad=4; const min=0,max=100;
          const ys = s1s.map(v => v==null ? 60 : v).map(v => {
            const t = (v-min)/(max-min); return h - (pad + (h-2*pad)*t);
          });
          const xs = [pad, w/2, w-pad];
          const sv = document.createElementNS(svgNS,'svg');
          sv.setAttribute('width',String(w)); sv.setAttribute('height',String(h)); sv.setAttribute('data-test','visual-spark');
          const pl = document.createElementNS(svgNS,'polyline');
          pl.setAttribute('fill','none'); pl.setAttribute('stroke', anyMissing?'#94a3b8':'#3B82F6'); pl.setAttribute('stroke-width','1.5');
          if (anyMissing) pl.setAttribute('stroke-dasharray','3 2');
          pl.setAttribute('points', `${xs[0]},${ys[0]} ${xs[1]},${ys[1]} ${xs[2]},${ys[2]}`);
          sv.appendChild(pl);
          __summaryWrap.appendChild(sv);
          // 検証用: S1値を埋め込み
          const marker = document.createElement('span');
          marker.setAttribute('data-test','s1-values');
          marker.style.display = 'none';
          marker.textContent = s1s.map(v => (v==null? '' : String(v))).join(',');
          __summaryWrap.appendChild(marker);
        }
      } catch {}
      // 「今とつながる」行は非表示（全体像／強みが現れやすい点に置き換え方針）
      // 以前のロジックは保持するがDOMへは追加しない
      try {
        /* no-op: replaced by 強みが現れやすい点 */
      } catch {}
      // scenario-db-easy-detailed から Now×triad の詳細を表示
      ;(async () => {
        try {
          const triad = this._triadFromSeries(String(branch.series||''));
          const step0 = (Array.isArray(branch.steps) ? branch.steps[0] : null);
          if (!step0 || !triad) return;
          const det = await this._getDetailedDetail(step0.hex, step0.line, triad);
          if (det) {
            const d = document.createElement('div');
            d.style.fontSize = '.85em'; d.style.color = '#cbd5e1'; d.style.marginTop = '2px';
            d.textContent = '到達時の様子: ' + this._short(det, 110);
            __summaryWrap.appendChild(d);
          }
        } catch {}
      })();
      __summaryWrap.appendChild(__next);

      // Decision support (fit/caution/outcome + avoid/tradeoff) — optional
      let __ds = null;
      if (this.showDecisionSupport) {
        __ds = document.createElement('div');
        __ds.style.borderTop = '1px dashed rgba(99,102,241,0.35)';
        __ds.style.marginTop = '6px';
        __ds.style.paddingTop = '6px';
        __ds.setAttribute('data-section','summary');
      }
      const actions = String(branch.series||'').split('→');
      const lastText = steps[2]?.lineText || '';
      const lastSeverity = this._severityScore(lastText);
      const s1 = this._getBasicScore(steps[0]?.hex, steps[0]?.line);
      const s3 = this._getBasicScore(steps[2]?.hex, steps[2]?.line);
      const d13 = (s3 ?? s1 ?? 0) - (s1 ?? 0);
      // 卦・爻に基づく内容を優先し、足りない場合にキーワード辞書へフォールバック
      if (false && this.showDecisionSupport && __ds) {
        let fit = this._fitFromSteps(branch);
        if (!fit.length) fit = this._fitPhrases(__kw);
        const caution = this._cautionPhrase(lastSeverity, actions[2]);
        const outcome = this._outcomePhrase(actions, d13, lastSeverity);
        const mk = (label,val)=>{ const d=document.createElement('div'); d.textContent = `${label}: ${val}`; d.style.fontSize='.84em'; d.style.color='#cbd5e1'; d.style.marginTop='2px'; return d; };
        if (!fit.length) fit = this._fitFromSteps(branch);
        if (fit.length) __ds.appendChild(mk(__easy ? '向いている' : '合う条件', fit.join(' / ')));
        let avoid = this._avoidFromSteps(branch);
        if (!avoid.length) avoid = this._avoidPhrases(__kw);
        if (avoid.length) __ds.appendChild(mk(__easy ? '向かない' : '避けたい人', avoid.join(' / ')));
        let to = this._tradeoffFromSteps(branch);
        if (!to || (!to.gain && !to.loss)) to = this._tradeoff(__kw);
        __ds.appendChild(mk(__easy ? '得られること' : '得るもの', to.gain));
        __ds.appendChild(mk(__easy ? '気になる点' : '失う可能性', to.loss));
        __ds.appendChild(mk('留意点', caution));
        __ds.appendChild(mk('到達時の様子', outcome));
      }

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
      if (false && this.showDecisionSupport && __ds && timeMemo) __ds.appendChild(mk('時機', timeMemo));
      // 比較ボタン（__dsが無い場合は__summaryWrapに付ける）
      if (false && this.enableCompare) {
        const cmp = document.createElement('button');
        cmp.textContent = this._compare.has(branch.id) ? '比較から外す' : '比較に追加';
        cmp.style.marginTop = '6px';
        cmp.style.fontSize = '.85em';
        cmp.style.padding = '4px 8px';
        cmp.style.borderRadius = '8px';
        cmp.style.background = this._compare.has(branch.id) ? 'rgba(239,68,68,.2)' : 'rgba(99,102,241,.2)';
        cmp.style.color = '#E5E7EB';
        cmp.style.border = '1px solid rgba(99,102,241,.35)';
        cmp.onclick = (e) => {
          e.stopPropagation();
          if (this._compare.has(branch.id)) { this._compare.delete(branch.id); }
          else {
            if (this._compare.size >= 2) { const first = this._compare.keys().next().value; this._compare.delete(first); }
            this._compare.set(branch.id, branch);
          }
          this._renderComparePanel();
          this._rerender();
        };
        try {
          const target = __ds || __summaryWrap;
          target.appendChild(cmp);
        } catch {}
      }
      // influence/impact と 確信度バー — Classicでは非表示
      if (!classic && this.enableConfidenceBar) {
        // influence words (bridge input -> branch) with scoring and percentage
        try {
          const tags = (window.HAQEI_INPUT_TAGS||[]).map(String);
          const tally = this._keywordTally(branch);
          let scored = tags.map(t => [t, tally.get(t)||0]).filter(([,w])=>w>0);
          if (!scored.length) {
            const infl = (__kw||[]).filter(k => tags.includes(k));
            if (infl.length) { const target = __ds || __summaryWrap; target.appendChild(mk('影響語', infl.join(' / '))); }
          } else {
            scored.sort((a,b)=>b[1]-a[1]);
            const top2 = scored.slice(0,2).map(([t])=>t);
            const total = Array.from(tally.values()).reduce((a,b)=>a+b,0) || 1;
            const wsum = scored.reduce((a, [,w])=>a+w, 0);
            const pct = Math.round((wsum/total)*100);
            { const target = __ds || __summaryWrap; target.appendChild(mk('影響語', top2.join(' / '))); target.appendChild(mk('影響度', `${pct}%`)); }
          }
        } catch {}
        // confidence bar
        try {
          const used = window.integratedAnalysisResult?.systemsUsed || {};
          const usedCount = Object.values(used).filter(Boolean).length || 0;
          const fallback = !!(global.futureSimulator?.branchGenerator?.usedFallback);
          const missing = branch.steps.filter(st => !Number.isFinite(this._getBasicScore(st.hex, st.line))).length;
          const steps = Array.isArray(branch?.steps) ? branch.steps.slice(0,3) : [];
          const basicCount = steps.filter(st => Number.isFinite(this._getBasicScore(st.hex, st.line))).length;
          // Show confidence only when一定の根拠がある（どれかが真）: 解析システムを1つ以上使用 / H384基本スコアが2段以上取得
          const hasSignal = (usedCount > 0) || (basicCount >= 2);
          if (!hasSignal) {
            // 情報が少なすぎる場合は自信度を表示しない
            throw new Error('insufficient-signal');
          }
          let conf = Math.round((usedCount/4)*100) - (fallback?10:0) - (missing*5);
          conf = Math.max(0, Math.min(100, conf));
          const wrap = document.createElement('div');
          wrap.style.marginTop = '4px';
          const bar = document.createElement('div');
          bar.style.height = '4px'; bar.style.background='rgba(148,163,184,.3)'; bar.style.borderRadius='6px';
          const fill = document.createElement('div');
          fill.style.height='100%'; fill.style.width = conf+'%'; fill.style.borderRadius='6px'; fill.style.background = 'linear-gradient(90deg,#22C55E,#16A34A)';
          bar.appendChild(fill);
          const lbl = document.createElement('div');
          const __easyLbl = (window.HAQEI_CONFIG?.featureFlags?.lowReadingLevel !== false);
          lbl.textContent = `${__easyLbl ? '自信度' : '確信度'}: ${conf}%`;
          lbl.title = __easyLbl ? '使えたデータの多さと推測の少なさの目安（使用システム/4 − 推定/欠損の補正）' : '算出: 活用率(使用システム/4) − フォールバック補正 − 欠損データ×5%';
          lbl.style.fontSize='.75em'; lbl.style.color='#94a3b8'; lbl.style.marginTop='2px';
          wrap.appendChild(bar); wrap.appendChild(lbl);
          { const target = __ds || __summaryWrap; target.appendChild(wrap); }
        } catch {}
      }

      // Evidence fold（根拠折りたたみ）— Classicでは非表示
      let __ev = null;
      if (!classic) {
        __ev = document.createElement('details');
        __ev.style.marginTop = '6px';
        __ev.style.borderTop = '1px dashed rgba(99,102,241,0.35)';
        __ev.setAttribute('data-section','evidence');
        try { __ev.setAttribute('data-preserve','true'); } catch {}
      const __evsum = document.createElement('summary');
      __evsum.textContent = __easy ? '理由（引用と使い方）' : '根拠（引用と適用）';
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
      }
      // mount（見出し直下に要約を配置）
      // タイトルと要約（oneLine/seriesNarrative）はカード最上部に配置して視認性を向上
      try { summary.style.marginTop = '2px'; summary.style.marginBottom = '6px'; } catch {}
      card.appendChild(title);
      card.appendChild(summary);

      // その下にスコア/チップ/補足まとめ
      card.appendChild(__scoreWrap);
      card.appendChild(__chips);
      card.appendChild(__summaryWrap);
      // Mount easy block（補助ガイド）
      card.appendChild(easyBlock);
      if (__ds) card.appendChild(__ds);

      const details = document.createElement('details');
      details.style.borderTop = '1px dashed rgba(99,102,241,0.35)';
      const sum = document.createElement('summary');
      sum.textContent = __easy ? 'くわしく見る' : '詳細を見る';
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
          foot.textContent = __easy ? '※ 行き先は一部予測です' : '※ 変爻先は推定を含みます';
        foot.style.fontSize = '0.8em';
        foot.style.opacity = '0.75';
        foot.style.marginTop = '8px';
        ul.appendChild(foot);
      }

      details.appendChild(sum);
      details.appendChild(ul);
      try { details.setAttribute('data-section', classic ? 'summary' : 'evidence'); details.setAttribute('data-preserve','true'); } catch {}
      card.appendChild(details);
      if (__ev) card.appendChild(__ev);

      card.addEventListener('click', () => {
        const ev = new CustomEvent('branchSelected', { detail: { id: branch.id, series: branch.series, steps: branch.steps } });
        this.container.dispatchEvent(ev);
      });
      return card;
    }

    _renderSpiralGlyph(branch){
      try {
        const size = 60, cx = 30, cy = 30;
        const series = String(branch.series||'');
        const acts = series.split('→');
        const moreProg = (acts.filter(a=>a==='進').length >= 2);
        const clockwise = moreProg; // 進み基調=時計回り
        const s7s = (Array.isArray(branch.steps) ? branch.steps.slice(0,3) : []).map(s => this._getS7Value(s.hex, s.line, s.action));
        const estimated = s7s.some(v => v == null);
        const rBase = [12, 20, 28];
        const r = rBase.map((rb, i) => {
          const v = s7s[i];
          if (v == null) return rb; // 推定時は補正なし
          return rb + Math.round((v-60)/40*3); // 60±40の範囲を±3px程度で微調整
        });
        const wBase = 2;
        const strokeW = wBase + (Math.max(...(s7s.filter(x=>x!=null)))||60)/100; // 太さ微調整
        // 角度
        const seg = Math.PI * 0.9; // 各セグメントの角度（変＝接線方向に使う）
        const start0 = clockwise ? -Math.PI/2 : -Math.PI/2 + seg;
        const starts = [start0, clockwise ? start0+seg : start0-seg, clockwise ? start0+2*seg : start0-2*seg];
        // path作成
        const svgNS = 'http://www.w3.org/2000/svg';
        const wrap = document.createElement('div');
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('width', String(size));
        svg.setAttribute('height', String(size));
        svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
        svg.setAttribute('data-test','spiral-glyph');
        svg.setAttribute('role','img');
        svg.setAttribute('aria-label', `螺旋: ${series}`);
        // 背景リング（Now/Step1/2/3）
        try {
          [10, 18, 26].forEach(R => {
            const ring = document.createElementNS(svgNS,'circle');
            ring.setAttribute('cx', String(cx)); ring.setAttribute('cy', String(cy)); ring.setAttribute('r', String(R));
            ring.setAttribute('fill','none'); ring.setAttribute('stroke','rgba(203,213,225,.25)'); ring.setAttribute('stroke-width','0.5');
            svg.appendChild(ring);
          });
        } catch {}
        // Now center
        const c = document.createElementNS(svgNS, 'circle');
        c.setAttribute('cx', String(cx)); c.setAttribute('cy', String(cy)); c.setAttribute('r', '2');
        c.setAttribute('fill', '#cbd5e1'); svg.appendChild(c);
        const colorOf = a => a==='進' ? '#22C55E' : '#F59E0B';
        // まず接線（変）を描画 → 次に放射（進）を重ねて見やすく
        for (let i=0;i<3;i++){
          if (acts[i] !== '変') continue;
          const a0 = starts[i]; const a1 = clockwise ? a0 + seg : a0 - seg; const Rcurr = r[i];
          const x0 = cx + Rcurr*Math.cos(a0), y0 = cy + Rcurr*Math.sin(a0);
          const x1 = cx + Rcurr*Math.cos(a1), y1 = cy + Rcurr*Math.sin(a1);
          const path = document.createElementNS(svgNS, 'path');
          path.setAttribute('fill','none'); path.setAttribute('stroke', colorOf('変')); path.setAttribute('stroke-width', String(strokeW));
          if (estimated) { path.setAttribute('stroke-dasharray','3 3'); path.classList.add('is-estimated'); }
          path.setAttribute('d', `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${Rcurr} ${Rcurr} 0 0 ${clockwise?1:0} ${x1.toFixed(1)} ${y1.toFixed(1)}`);
          svg.appendChild(path);
          // ピボット
          const dsize=3; const px=x0, py=y0; const diamond=document.createElementNS(svgNS,'polygon');
          diamond.setAttribute('points', `${(px).toFixed(1)},${(py-dsize).toFixed(1)} ${(px+dsize).toFixed(1)},${(py).toFixed(1)} ${(px).toFixed(1)},${(py+dsize).toFixed(1)} ${(px-dsize).toFixed(1)},${(py).toFixed(1)}`);
          diamond.setAttribute('fill', colorOf('変')); if (estimated) diamond.setAttribute('opacity','0.6'); svg.appendChild(diamond);
          // 最終矢頭
          if (i===2){
            const tri = document.createElementNS(svgNS, 'polygon'); const a=a1; const tipX=x1, tipY=y1; const w=4,h=6; const ortho=a+Math.PI/2;
            const p1x=tipX, p1y=tipY;
            const p2x=tipX - h*Math.cos(a) + w*Math.cos(ortho);
            const p2y=tipY - h*Math.sin(a) + w*Math.sin(ortho);
            const p3x=tipX - h*Math.cos(a) - w*Math.cos(ortho);
            const p3y=tipY - h*Math.sin(a) - w*Math.sin(ortho);
            tri.setAttribute('points', `${p1x.toFixed(1)},${p1y.toFixed(1)} ${p2x.toFixed(1)},${p2y.toFixed(1)} ${p3x.toFixed(1)},${p3y.toFixed(1)}`);
            tri.setAttribute('fill', colorOf('変')); if (estimated) tri.setAttribute('opacity','0.6'); svg.appendChild(tri);
          }
        }
        for (let i=0;i<3;i++){
          if (acts[i] !== '進') continue;
          const ang = starts[i]; const Rcurr = r[i];
          // 放射線を長め・太めで描画（視認性向上）
          const Rstart = Math.max(6, Rcurr - 12); // 12pxの長さを確保
          const x0 = cx + Rstart*Math.cos(ang), y0 = cy + Rstart*Math.sin(ang);
          const x1 = cx + Rcurr*Math.cos(ang), y1 = cy + Rcurr*Math.sin(ang);
          const path = document.createElementNS(svgNS, 'path');
          path.setAttribute('fill','none'); path.setAttribute('stroke', colorOf('進'));
          path.setAttribute('stroke-width', String(Math.max(2.5, strokeW)));
          if (estimated) { path.setAttribute('stroke-dasharray','3 3'); path.classList.add('is-estimated'); }
          path.setAttribute('d', `M ${x0.toFixed(1)} ${y0.toFixed(1)} L ${x1.toFixed(1)} ${y1.toFixed(1)}`);
          svg.appendChild(path);
          if (i===2){
            const tri = document.createElementNS(svgNS, 'polygon');
            const a = ang; const tipX = x1, tipY = y1; const w=4, h=6; const ortho = a + Math.PI/2;
            tri.setAttribute('points', `${tipX.toFixed(1)},${tipY.toFixed(1)} ${(tipX - h*Math.cos(a) + w*Math.cos(ortho)).toFixed(1)},${(tipY - h*Math.sin(a) + w*Math.sin(ortho)).toFixed(1)} ${(tipX - h*Math.cos(a) - w*Math.cos(ortho)).toFixed(1)},${(tipY - h*Math.sin(a) - w*Math.sin(ortho)).toFixed(1)}`);
            tri.setAttribute('fill', colorOf('進')); if (estimated) tri.setAttribute('opacity','0.6'); svg.appendChild(tri);
          }
        }
        // ステップ番号（最後に重ねる）
        for (let i=0;i<3;i++){
          const a0 = starts[i]; const a1 = (acts[i]==='進') ? a0 : (clockwise ? a0+seg : a0-seg);
          const mid = (a0 + a1) / 2; const Rm = acts[i]==='進' ? r[i] - 4 : r[i];
          const tx = cx + (Rm+1)*Math.cos(mid); const ty = cy + (Rm+1)*Math.sin(mid);
          const t = document.createElementNS(svgNS,'text');
          t.setAttribute('x', tx.toFixed(1)); t.setAttribute('y', ty.toFixed(1));
          t.setAttribute('fill', '#cbd5e1'); t.setAttribute('font-size','7'); t.setAttribute('text-anchor','middle'); t.setAttribute('dominant-baseline','middle'); t.textContent = String(i+1);
          svg.appendChild(t);
        }
        wrap.appendChild(svg);
        return wrap;
      } catch { return null; }
    }

    _getS7Value(hex, line, action){
      try {
        const candidates = {1:['初九','初六'],2:['九二','六二'],3:['九三','六三'],4:['九四','六四'],5:['九五','六五'],6:['上九','上六']};
        const yao = candidates[line] || [];
        const data = (window.H384_DATA && Array.isArray(window.H384_DATA)) ? window.H384_DATA : [];
        const entry = data.find(e => Number(e['卦番号']) === Number(hex) && yao.includes(String(e['爻'])));
        const v = Number(entry && entry['S7_総合評価スコア']);
        if (Number.isFinite(v)) return v;
      } catch {}
      // fallback heuristic
      return action==='進' ? 70 : 55;
    }

    _getS1Value(hex, line, action){
      try {
        const candidates = {1:['初九','初六'],2:['九二','六二'],3:['九三','六三'],4:['九四','六四'],5:['九五','六五'],6:['上九','上六']};
        const yao = candidates[line] || [];
        const data = (window.H384_DATA && Array.isArray(window.H384_DATA)) ? window.H384_DATA : [];
        const entry = data.find(e => Number(e['卦番号']) === Number(hex) && yao.includes(String(e['爻'])));
        const v = Number(entry && entry['S1_基本スコア']);
        if (Number.isFinite(v)) return v;
      } catch {}
      // fallback heuristic
      return action==='進' ? 60 : 50;
    }

    _triadFromSeries(series){
      try {
        const parts = String(series||'').split('→');
        if (parts.length !== 3) return null;
        return parts.map(p => (p==='進' ? 'J' : 'H')).join('');
      } catch { return null; }
    }

    async _getDetailedDetail(hex, line, triad){
      try {
        const h = Number(hex);
        const url = `./data/scenario-db-easy-detailed/hex-${h}.json`;
        window.__DETAILED_CACHE = window.__DETAILED_CACHE || new Map();
        let data = window.__DETAILED_CACHE.get(h);
        if (!data){
          const res = await fetch(url, { credentials: 'same-origin' });
          if (!res.ok) throw new Error(`Failed to fetch ${url}`);
          data = await res.json();
          window.__DETAILED_CACHE.set(h, data);
        }
        const key = `${h}_${Math.max(1,Math.min(6,Number(line||1)))}_${String(triad||'')}`;
        const entry = data?.items?.[key];
        return entry?.detail || '';
      } catch { return ''; }
    }

    _renderTrackGlyph(branch){
      try {
        const svgNS = 'http://www.w3.org/2000/svg';
        const W=100, H=22; const yBase=11; const x = [8, 36, 64, 92];
        const acts = String(branch.series||'').split('→');
        const s1s = (Array.isArray(branch.steps) ? branch.steps.slice(0,3) : []).map(s => this._getS1Value(s.hex, s.line, s.action));
        const est = s1s.some(v => v==null);
        const colorJ = '#22C55E', colorH='#F59E0B';
        const wrap = document.createElement('div');
        const svg = document.createElementNS(svgNS,'svg');
        svg.setAttribute('width',String(W)); svg.setAttribute('height',String(H)); svg.setAttribute('data-test','track-glyph');
        svg.setAttribute('role','img'); svg.setAttribute('aria-label', `経路: ${acts.join('→')}`);
        // Gradient stroke（進→変の区間を色替え）
        const gid = `grad_${branch.id || 0}_${acts.join('')}`;
        const defs = document.createElementNS(svgNS,'defs');
        const grad = document.createElementNS(svgNS,'linearGradient');
        grad.setAttribute('id', gid); grad.setAttribute('x1','0'); grad.setAttribute('y1','0'); grad.setAttribute('x2','1'); grad.setAttribute('y2','0');
        const stops = [];
        const boundaries = [0, 0.333, 0.666, 1];
        for (let i=0;i<3;i++){
          const c = (acts[i]==='変') ? colorH : colorJ;
          const s0 = boundaries[i], s1 = boundaries[i+1];
          stops.push([s0, c],[s1, c]);
        }
        stops.forEach(([off, col])=>{ const st=document.createElementNS(svgNS,'stop'); st.setAttribute('offset', `${Math.round(off*100)}%`); st.setAttribute('stop-color', col); grad.appendChild(st); });
        defs.appendChild(grad); svg.appendChild(defs);
        // 背景レール
        const rail = document.createElementNS(svgNS,'line');
        rail.setAttribute('x1',x[0]); rail.setAttribute('y1',yBase); rail.setAttribute('x2',x[3]); rail.setAttribute('y2',yBase);
        rail.setAttribute('stroke','rgba(203,213,225,.4)'); rail.setAttribute('stroke-width','2'); rail.setAttribute('stroke-linecap','round');
        svg.appendChild(rail);
        // 連続パス（J/Hで上下に少しバンプ）
        const path = document.createElementNS(svgNS,'path');
        let d = `M ${x[0]} ${yBase}`;
        for (let i=0;i<3;i++){
          const yOff = (acts[i]==='変') ? -3 : 0; // 変で少し上にバンプ
          const xm = (x[i] + x[i+1]) / 2; const ym = yBase + yOff;
          d += ` Q ${xm} ${ym} ${x[i+1]} ${yBase}`;
        }
        path.setAttribute('d', d);
        path.setAttribute('fill','none');
        path.setAttribute('stroke', `url(#${gid})`);
        path.setAttribute('stroke-width','3');
        path.setAttribute('stroke-linecap','round'); path.setAttribute('stroke-linejoin','round');
        if (est) path.setAttribute('stroke-dasharray','3 3');
        svg.appendChild(path);
        // 変ゲート（小菱形＆「変」ピル）
        for (let i=0;i<3;i++){
          if (acts[i] !== '変') continue;
          const xm=(x[i]+x[i+1])/2, ym=yBase-3;
          const dsize=3; const diamond=document.createElementNS(svgNS,'polygon');
          diamond.setAttribute('points', `${(xm).toFixed(1)},${(ym-dsize).toFixed(1)} ${(xm+dsize).toFixed(1)},${(ym).toFixed(1)} ${(xm).toFixed(1)},${(ym+dsize).toFixed(1)} ${(xm-dsize).toFixed(1)},${(ym).toFixed(1)}`);
          diamond.setAttribute('fill', colorH); svg.appendChild(diamond);
          // ピル
          const pillW=12, pillH=10; const px=xm-pillW/2, py=ym-14;
          const rect=document.createElementNS(svgNS,'rect'); rect.setAttribute('x',px.toFixed(1)); rect.setAttribute('y',py.toFixed(1)); rect.setAttribute('rx','4'); rect.setAttribute('ry','4'); rect.setAttribute('width',String(pillW)); rect.setAttribute('height',String(pillH)); rect.setAttribute('fill','rgba(245,158,11,.25)'); rect.setAttribute('stroke',colorH); rect.setAttribute('stroke-width','0.6'); svg.appendChild(rect);
          const txt=document.createElementNS(svgNS,'text'); txt.setAttribute('x',(xm).toFixed(1)); txt.setAttribute('y',(py+pillH/2+3).toFixed(1)); txt.setAttribute('fill',colorH); txt.setAttribute('font-size','8'); txt.setAttribute('text-anchor','middle'); txt.textContent='変'; svg.appendChild(txt);
        }
        // 区間ラベル（進/変）
        for (let i=0;i<3;i++){
          const xm=(x[i]+x[i+1])/2; const lab=document.createElementNS(svgNS,'text'); lab.setAttribute('x',xm.toFixed(1)); lab.setAttribute('y',String(yBase+10)); lab.setAttribute('font-size','8'); lab.setAttribute('text-anchor','middle'); lab.setAttribute('fill', acts[i]==='変'? colorH : colorJ); lab.textContent = (acts[i]==='変' ? '変' : '進'); svg.appendChild(lab);
        }
        // ノード（Step1/2/3）
        for (let i=1;i<4;i++){
          const c = document.createElementNS(svgNS,'circle'); c.setAttribute('cx',x[i]); c.setAttribute('cy',yBase); c.setAttribute('r','2.5');
          c.setAttribute('fill','#E2E8F0'); svg.appendChild(c);
        }
        // 矢頭（終点）
        const tri = document.createElementNS(svgNS,'polygon');
        const tx = x[3], ty = yBase; const w=4, h=6;
        tri.setAttribute('points', `${tx},${ty} ${tx-6},${ty-3} ${tx-6},${ty+3}`);
        tri.setAttribute('fill', colorJ); if (est) tri.setAttribute('opacity','0.7');
        svg.appendChild(tri);
        wrap.appendChild(svg); return wrap;
      } catch { return null; }
    }

    async _oneLinerForStep(hex, line){
      // line-states → H384要約 → キーワード の順で返す
      try {
        if (!this._lineStates) {
          const r = await fetch('./data/h384-line-states.json', { cache:'no-cache' });
          this._lineStates = r.ok ? await r.json() : {};
        }
      } catch {}
      try {
        const key = `${Number(hex)}-${Number(line)}`;
        const v = this._lineStates && this._lineStates[key];
        const txt = (typeof v === 'string') ? v : (v && v.text) || '';
        if (txt && txt.trim()) return txt.trim();
      } catch {}
      try {
        const data = (window.H384_DATA && Array.isArray(window.H384_DATA)) ? window.H384_DATA : [];
        const candidates = {1:['初九','初六'],2:['九二','六二'],3:['九三','六三'],4:['九四','六四'],5:['九五','六五'],6:['上九','上六']};
        const yao = candidates[Number(line)] || [];
        const entry = data.find(e => Number(e['卦番号']) === Number(hex) && yao.includes(String(e['爻'])));
        if (entry) {
          const sum = (typeof entry['現代解釈の要約'] === 'string') ? entry['現代解釈の要約'].trim() : '';
          if (sum) return sum;
          const kwRaw = Array.isArray(entry['キーワード']) ? entry['キーワード'] : (typeof entry['キーワード']==='string' ? entry['キーワード'].split(/、|,|\s+/).filter(Boolean) : []);
          const kw = (kwRaw || []).slice(0,3).join('、');
          if (kw) return `キーワード: ${kw}`;
        }
      } catch {}
      return '';
    }

  async _endpointInfoForStep(hex, line){
      try {
        const yaoNames = this._yaoCandidatesByLine(line);
        const data = (window.H384_DATA && Array.isArray(window.H384_DATA)) ? window.H384_DATA : [];
        const entry = data.find(e => Number(e['卦番号']) === Number(hex) && (yaoNames||[]).includes(String(e['爻'])));
        const title = entry ? `${String(entry['卦名']||'').trim()} ${String(entry['爻']||'').trim()}`.trim() : '';
        const s7 = entry ? Number(entry['S7_総合評価スコア']) : null;
        let keywords = [];
        if (entry) {
          const raw = Array.isArray(entry['キーワード']) ? entry['キーワード'] : (typeof entry['キーワード']==='string' ? entry['キーワード'].split(/、|,|\s+/).filter(Boolean) : []);
          keywords = this._normalizeKeywords(raw).slice(0,3);
        }
        const summary = this._toNeutralJapanese(this._toPersonalPerspective(await this._oneLinerForStep(hex, line)));
        return { title, s7: (Number.isFinite(s7)? s7 : null), keywords, summary };
      } catch { return null; }
  }

  _outcomeStamp(branch){
      try {
        const series = String(branch.series||'');
        const acts = series.split('→');
        const steps = Array.isArray(branch.steps)?branch.steps.slice(0,3):[];
        const lastText = steps[2]?.lineText || '';
        const sev = this._severityScore(lastText);
        const prog = acts.filter(a=>a==='進').length;
        const trans= acts.filter(a=>a==='変').length;
        let text=''; let bg='rgba(34,197,94,.15)'; let fg='#86EFAC';
        if (trans===3) { text='大転換'; bg='rgba(245,158,11,.15)'; fg='#FBBF24'; }
        else if (prog===3) { text='前進'; bg='rgba(16,185,129,.15)'; fg='#86EFAC'; }
        else if (trans===2) { text='転換'; bg='rgba(245,158,11,.15)'; fg='#FBBF24'; }
        else { text='調整'; bg='rgba(59,130,246,.15)'; fg='#93C5FD'; }
        if (sev>=3) { text='安全優先'; bg='rgba(148,163,184,.15)'; fg='#CBD5E1'; }
        return { text, bg, fg };
      } catch { return { text:'', bg:'', fg:'' }; }
    }

    async displayBranches(branches, currentSituation) {
      if (!this.container) return;
      this._lastBranches = branches;
      this._lastSituation = currentSituation;
      this.container.innerHTML = '';
      try { this.container.setAttribute('data-preserve','true'); } catch {}
      try { console.log('EightBranchesDisplay: rendering', Array.isArray(branches)?branches.length:0, 'branches'); } catch {}

      // Optional debug: observe childList changes and sample details count
      try {
        const dbg = !!(window.HAQEI_CONFIG?.debug?.observeEightBranches);
        if (dbg) {
          const obs = new MutationObserver((muts)=>{
            try { console.debug('EightBranchesDisplay: mutation(count=', muts.length, ')'); } catch {}
          });
          obs.observe(this.container, { childList: true, subtree: true });
          const sample = (t)=> setTimeout(()=>{
            try {
              const d = this.container.querySelectorAll('details').length;
              console.debug(`EightBranchesDisplay: sample@${t}ms details=`, d);
            } catch {}
          }, t);
          sample(0); sample(50); sample(100);
          // auto-stop after short window
          setTimeout(()=>{ try { obs.disconnect(); } catch {} }, 300);
        }
      } catch {}

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
          let linePos = Number(currentSituation.yaoPosition || 0) || 0;
          const yao = String(currentSituation.yaoName || currentSituation['爻'] || '').trim();
          // If numeric position is missing, derive from yaoName (e.g., 六二 -> 2)
          if (!linePos && yao) {
            const map = {
              '初九':1,'九二':2,'九三':3,'九四':4,'九五':5,'上九':6,
              '初六':1,'六二':2,'六三':3,'六四':4,'六五':5,'上六':6
            };
            linePos = map[yao] || 0;
          }

          const lineKey = () => `${hex}-${linePos}`;
          let mainText = '';
      try {
        if (!this._lineStates) {
          const r = await fetch('./data/h384-line-states.json', { cache:'no-cache' });
          this._lineStates = r.ok ? await r.json() : {};
        }
        if (!window.H384_PERSONAL) {
          try { const pr = await fetch('/assets/H384H64database.personal.json', { cache:'no-cache' }); if (pr.ok) window.H384_PERSONAL = await pr.json(); } catch {}
        }
        const v = this._lineStates[lineKey()];
        mainText = (typeof v === 'string') ? v : (v && v.text) || '';
      } catch {}
      // Fallback: H384_DATA から該当爻の「現代解釈の要約」やキーワードを表示
      if (!mainText || !mainText.trim()) {
        try {
          const data = (window.H384_DATA && Array.isArray(window.H384_DATA)) ? window.H384_DATA : [];
          const entry = data.find(e => Number(e['卦番号']) === hex && (String(e['爻']) === (yao || '')));
          if (entry) {
            // personalized override
            const linePos2 = linePos || Number(String(yao).match(/[一二三四五上]/) ? {'初':1,'九':0}[String(yao)[0]] : 0);
            const serial = (hex>0 && linePos? ((hex-1)*6 + linePos) : null);
            const override = (serial && window.H384_PERSONAL && window.H384_PERSONAL[String(serial)]) || null;
            const sumBase = (typeof entry['現代解釈の要約'] === 'string') ? entry['現代解釈の要約'].trim() : '';
            const sum = (override && override['現代解釈の要約_plain']) ? override['現代解釈の要約_plain'] : sumBase;
            if (sum) mainText = sum;
            else {
              const kwRaw = Array.isArray(entry['キーワード']) ? entry['キーワード'] : (typeof entry['キーワード']==='string' ? entry['キーワード'].split(/、|,|\s+/).filter(Boolean) : []);
              const kw = (kwRaw || []).slice(0,3).join('、');
              if (kw) mainText = `キーワード: ${kw}`;
            }
          }
        } catch {}
      }

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

          // Header line
          const headerLine = document.createElement('div');
          headerLine.style.display = 'flex';
          headerLine.style.alignItems = 'center';
          headerLine.style.gap = '.75rem';
          headerLine.style.flexWrap = 'wrap';
          const h1 = document.createElement('div');
          h1.textContent = 'Now 現在の状況';
          h1.style.fontWeight = '700';
          h1.style.color = '#c7d2fe';
          const h2 = document.createElement('div');
          h2.textContent = `${hexName || '卦未確定'} ${yao || (linePos?('第'+linePos+'爻'):'')}`;
          h2.style.color = '#e5e7eb';
          headerLine.appendChild(h1);
          headerLine.appendChild(h2);
          if (baseScore) {
            const s = document.createElement('span');
            s.textContent = `現在地点の土台の強さ: ${baseScore}`;
            s.style.marginLeft = 'auto';
            s.style.color = '#a5b4fc';
            s.style.fontSize = '.85em';
            headerLine.appendChild(s);
          }
          now.appendChild(headerLine);

          // Main reason line with test-id compatibility (#now-main-reason)
          const main = document.createElement('div');
          main.style.color = '#a5b4fc';
          main.style.marginTop = '4px';
          main.style.fontSize = '.95em';
          // 互換のため、既に他所で #now-main-reason が無ければ本要素にIDを付与
          try {
            if (!document.getElementById('now-main-reason')) {
              main.id = 'now-main-reason';
            }
          } catch {}
          const personalizedMain = this._toPersonalPerspective(mainText || '（行状態テキスト未登録）');
          main.textContent = this._toNeutralJapanese(personalizedMain);
          now.appendChild(main);
          // Now補足（先の見方を短く）
          const hint = document.createElement('div');
          hint.style.color = '#94a3b8';
          hint.style.fontSize = '.85em';
          hint.style.marginTop = '2px';
          hint.textContent = 'この先はNowから3手の代表的な道筋です。';
          now.appendChild(hint);
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
          const getS7 = (hex, line) => {
            try {
              const candidates = {
                1: ['初九','初六'], 2: ['九二','六二'], 3: ['九三','六三'],
                4: ['九四','六四'], 5: ['九五','六五'], 6: ['上九','上六']
              }[line] || [];
              const data = (window.H384_DATA && Array.isArray(window.H384_DATA)) ? window.H384_DATA : [];
              const found = data.find(e => Number(e['卦番号']) === Number(hex) && candidates.includes(String(e['爻'])));
              const v = Number(found && found['S7_総合評価スコア']);
              if (Number.isFinite(v)) return v;
            } catch {}
            return null;
          };
          const palette = ['#10B981','#3B82F6','#F59E0B','#EF4444','#A78BFA','#22C55E','#EAB308','#06B6D4'];
          const dashes  = [[], [6,3], [2,3], [8,4], [1,4], [10,2,2,2], [4,4,1,4], [12,3]];
          const shapes  = ['circle','triangle','rectRot','rectRounded','star','cross','dash','line'];
          const toDataset = (b, idx) => {
            const vals = b.steps.map(s => getS7(s.hex, s.line)).map((v,i) => v ?? (b.steps[i].action === '進' ? 70 : 55));
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
      try { grid.setAttribute('data-preserve','true'); grid.setAttribute('data-role','branches-grid'); } catch {}
      const __bottomCardNodes = [];

      // compare section: おすすめTOP3（簡易比較）— Classicでは無効
      try {
        const scored = branches.map(b => ({ b, s: this._branchScore(b) }));
        scored.sort((x,y)=> y.s - x.s);
        const top = scored.slice(0,3).map(x=>x.b);
        const classic = (window.HAQEI_CONFIG?.featureFlags?.layoutClassic !== false);
        if (!classic && top.length===3) {
          const box = document.createElement('div');
          box.setAttribute('data-section','compare');
          box.style.border='1px solid rgba(99,102,241,.35)'; box.style.borderRadius='10px'; box.style.padding='10px 12px'; box.style.margin='6px 0 10px';
          const h = document.createElement('div'); h.textContent='比較TOP3（簡易）'; h.style.color='#c7d2fe'; h.style.fontWeight='700'; h.style.marginBottom='4px';
          const explain = this._top3Explain(top);
          this._topExplainCache = explain;
          const mk = (rank,item,sub)=>{ const d=document.createElement('div'); d.style.color='#cbd5e1'; d.style.fontSize='.9em'; d.textContent = `${rank}. 分岐${item.id}｜${item.series}｜${item.score}% - ${sub}`; return d; };
          box.appendChild(h);
          box.appendChild(mk(1,explain.a,explain.a.reason));
          box.appendChild(mk(2,explain.b,explain.b.reason));
          box.appendChild(mk(3,explain.c,explain.c.reason));
          // 常時表示: なぜ他ではないか（TOP3理由差分の固定行）
          try {
            const why = document.createElement('div');
            why.style.marginTop='4px';
            why.style.fontSize='.85em';
            why.style.color='#cbd5e1';
            why.textContent = `なぜ他ではないか: 2位→${explain.b.reason} ／ 3位→${explain.c.reason}`;
            box.appendChild(why);
          } catch {}
          this.container.appendChild(box);
          // 上段固定グリッド（有効時）
          const flag = (window.HAQEI_CONFIG?.featureFlags?.enableTop3Mode !== false);
          if (flag) {
            const topGrid = document.createElement('div');
            topGrid.style.display='grid'; topGrid.style.gridTemplateColumns='repeat(auto-fill, minmax(280px, 1fr))'; topGrid.style.gap='12px';
            topGrid.setAttribute('data-section','compare');
            try { topGrid.setAttribute('data-preserve','true'); } catch {}
            const topIds = new Set(top.map(t=>t.id));
            top.forEach((b,i)=> { try { const n = this._card(b,i); if (n) { try { n.setAttribute('data-preserve','true'); } catch {}; topGrid.appendChild(n); } } catch {}});
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
            // 残りを下段グリッドへ（遅延挿入のため保持）
            branches.filter(b => !topIds.has(b.id)).forEach((b,i)=> { try { const n=this._card(b,i); if(n){ __bottomCardNodes.push(n); } } catch {} });
            // 後続でgridを見出しとともにappend
          } else {
            // フラグ無効時は通常どおり全カード
      // Render all cards (robust): per-card try/catch to avoid stopping on one error
      (Array.isArray(branches)?branches:[]).forEach((b, i) => {
        try {
          const el = this._card(b, i);
          if (el) { __bottomCardNodes.push(el); }
        } catch (e) {
          console.warn('EightBranchesDisplay: card render error for id', b?.id||i+1, e?.message||e);
          const fallback = document.createElement('div');
          fallback.style.border = '1px solid rgba(99,102,241,.35)';
          fallback.style.borderRadius = '10px';
          fallback.style.padding = '12px 14px';
          fallback.style.background = 'rgba(17,24,39,0.35)';
          fallback.style.color = '#E5E7EB';
          const head = document.createElement('div'); head.textContent = `分岐${b?.id||i+1}`; head.style.color='#A5B4FC'; head.style.fontWeight='600';
          const body = document.createElement('div'); body.textContent = '（簡易表示: 描画でエラーが発生しました）'; body.style.fontSize='.9em'; body.style.color='#cbd5e1';
          try {
            if (window.HAQEI_CONFIG?.debug?.showErrors) {
              const pre = document.createElement('pre');
              pre.textContent = String(e?.stack || e?.message || e);
              pre.style.whiteSpace = 'pre-wrap'; pre.style.fontSize = '.75em'; pre.style.color = '#94a3b8'; pre.style.marginTop = '6px';
              body.appendChild(pre);
            } else {
              fallback.title = String(e?.message || e);
            }
          } catch {}
          fallback.appendChild(head); fallback.appendChild(body);
          __bottomCardNodes.push(fallback);
        }
      });
          }
        } else {
          // Classic時またはTOP3が成立しない場合: 全カードを通常描画
          (Array.isArray(branches)?branches:[]).forEach((b, i) => {
            try {
              const el = this._card(b, i);
              if (el) { __bottomCardNodes.push(el); }
            } catch (e) {
              console.warn('EightBranchesDisplay: card render error for id', b?.id||i+1, e?.message||e);
              const fallback = document.createElement('div');
              fallback.style.border = '1px solid rgba(99,102,241,.35)';
              fallback.style.borderRadius = '10px';
              fallback.style.padding = '12px 14px';
              fallback.style.background = 'rgba(17,24,39,0.35)';
              fallback.style.color = '#E5E7EB';
              const head = document.createElement('div'); head.textContent = `分岐${b?.id||i+1}`; head.style.color='#A5B4FC'; head.style.fontWeight='600';
              const body = document.createElement('div'); body.textContent = '（簡易表示: 描画でエラーが発生しました）'; body.style.fontSize='.9em'; body.style.color='#cbd5e1';
              try {
                if (window.HAQEI_CONFIG?.debug?.showErrors) {
                  const pre = document.createElement('pre');
                  pre.textContent = String(e?.stack || e?.message || e);
                  pre.style.whiteSpace = 'pre-wrap'; pre.style.fontSize = '.75em'; pre.style.color = '#94a3b8'; pre.style.marginTop = '6px';
                  body.appendChild(pre);
                } else {
                  fallback.title = String(e?.message || e);
                }
              } catch {}
              fallback.appendChild(head); fallback.appendChild(body);
              __bottomCardNodes.push(fallback);
            }
          });
        }
      } catch {}

      const heading = document.createElement('div');
      heading.textContent = '選べる8つの進路（進む/変える）';
      heading.style.color = '#c7d2fe';
      heading.style.fontWeight = '700';
      heading.style.margin = '8px 0 2px';
      this.container.appendChild(heading);
      // モードトグル（現代解釈/根拠）
      if (this.enableEvidence) {
        const bar = document.createElement('div');
        bar.id = 'display-mode-bar';
        bar.style.display='flex'; bar.style.gap='8px'; bar.style.alignItems='center'; bar.style.margin='0 0 6px';
        const lab = document.createElement('span'); lab.textContent='表示:'; lab.style.color='#94a3b8'; lab.style.fontSize='.9em';
        const mkBtn = (text, key) => { const b=document.createElement('button'); b.textContent=text; b.style.fontSize='.85em'; b.style.padding='4px 8px'; b.style.borderRadius='8px'; b.style.border='1px solid rgba(99,102,241,.35)'; b.style.background = (this.displayMode===key)?'rgba(99,102,241,.25)':'rgba(30,41,59,.35)'; b.style.color='#E5E7EB'; b.onclick=()=>{ this.displayMode=key; this._rerender(); }; return b; };
        bar.appendChild(lab);
        bar.appendChild(mkBtn('現代解釈', 'applied'));
        bar.appendChild(mkBtn('根拠', 'evidence'));
        this.container.appendChild(bar);
      }
      // 凡例ピル（進/変）
      const legend = document.createElement('div');
      legend.style.display = 'flex';
      legend.style.gap = '8px';
      legend.style.flexWrap = 'wrap';
      legend.style.alignItems = 'center';
      legend.style.margin = '0 0 6px';
      const pill = (label, desc, bg, fg) => {
        const p = document.createElement('span');
        p.textContent = `${label} = ${desc}`;
        p.style.fontSize = '.8em';
        p.style.padding = '2px 8px';
        p.style.borderRadius = '9999px';
        p.style.border = '1px solid rgba(99,102,241,.35)';
        p.style.background = bg; p.style.color = fg;
        p.setAttribute('role','note'); p.setAttribute('aria-label', `${label}は「${desc}」の意味`);
        return p;
      };
      legend.appendChild(pill('進', '今のやり方で進める', 'rgba(16,185,129,.15)', '#86EFAC'));
      legend.appendChild(pill('変', 'やり方を切り替える', 'rgba(239,68,68,.15)', '#FCA5A5'));
      this.container.appendChild(legend);

      // 読み方（10秒） 折りたたみ
      const guide = document.createElement('details');
      guide.style.margin = '0 0 8px';
      guide.setAttribute('role','group');
      guide.setAttribute('aria-label','読み方（10秒）');
      const sum = document.createElement('summary');
      sum.textContent = '読み方（10秒）';
      sum.style.cursor = 'pointer';
      sum.style.color = '#cbd5e1';
      sum.style.fontSize = '.9em';
      sum.style.outline = 'none';
      const box = document.createElement('div');
      box.style.marginTop = '4px';
      box.style.padding = '8px 10px';
      box.style.border = '1px dashed rgba(99,102,241,.35)';
      box.style.borderRadius = '8px';
      box.style.background = 'rgba(30,41,59,0.35)';
      box.style.color = '#cbd5e1';
      box.style.fontSize = '.9em';
      box.innerHTML = [
        '・これはNow（現在）から3ステップの推移を概観します。',
        '・タイトルの「進/変」は「前進/切替」を表します。',
        '・読み順の目安: 「全体像 → 強みが現れやすい点 → 移行の観点」。',
        '・安全重視は進み基調、発想転換は転換基調に寄りやすいです。',
        '・適合度が無い場合はテキストの比較観察を重視してください。'
      ].join('<br>');
      guide.appendChild(sum);
      guide.appendChild(box);
      this.container.appendChild(guide);

      // 補助テキスト（短い説明）
      const helper = document.createElement('div');
      helper.textContent = 'カードには「全体像」「強みが現れやすい点」「移行の観点」「留意点」「到達時の様子」を表示します。';
      helper.style.color = '#94a3b8';
      helper.style.fontSize = '.85em';
      helper.style.margin = '0 0 8px';
      this.container.appendChild(helper);
      // 比較パネル（初期表示）
      if (this.enableCompare) {
        try { this._renderComparePanel(); } catch {}
      }
      this.container.appendChild(grid);

      // Defer bottom-card insertion via rAF and self-diagnose; retry if wiped
      const __appendDeferred = async () => {
        try {
          const frag = document.createDocumentFragment();
          __bottomCardNodes.forEach(n => { if (n) { try { n.setAttribute('data-preserve','true'); } catch {}; frag.appendChild(n); } });
          await new Promise(res => requestAnimationFrame(() => { try { grid.appendChild(frag); } catch {}; res(); }));
          const ccount = grid.childElementCount;
          const dcount = this.container.querySelectorAll('details').length;
          try { console.debug('cards appended:', ccount, 'details:', dcount); } catch {}
          // Re-apply view toggles after insertion
          try { if (typeof window.applyViewToggles === 'function') window.applyViewToggles(); } catch {}
          return { ccount, dcount };
        } catch { return { ccount: grid.childElementCount, dcount: this.container.querySelectorAll('details').length }; }
      };

      let __diag = await __appendDeferred();
      if ((__diag.ccount === 0) && __bottomCardNodes.length) {
        // retry with short delay(s)
        await new Promise(r => setTimeout(r, 70));
        __diag = await __appendDeferred();
        if ((__diag.ccount === 0)) {
          await new Promise(r => setTimeout(r, 110));
          __diag = await __appendDeferred();
        }
      }

      // Final fallback: minimal cards to avoid blank UI
      try {
        if ((!grid.childElementCount) && Array.isArray(branches) && branches.length) {
          const frag2 = document.createDocumentFragment();
          branches.forEach((b,i)=>{
            const box = document.createElement('div');
            box.style.border='1px solid rgba(99,102,241,.35)'; box.style.borderRadius='10px'; box.style.padding='10px 12px';
            box.style.background='rgba(17,24,39,.35)'; box.style.color='#E5E7EB';
            try { box.setAttribute('data-preserve','true'); } catch {}
            const head=document.createElement('div'); head.textContent=`分岐${b?.id||i+1}｜${b?.series||''}`; head.style.color='#A5B4FC'; head.style.fontWeight='700';
            const body=document.createElement('div'); body.textContent=(b?.steps||[]).map((s,idx)=>`Step${idx+1} ${s.action||''}: ${s.lineText||''}`).join(' / ');
            body.style.fontSize='.85em'; body.style.color='#cbd5e1';
            box.appendChild(head); box.appendChild(body);
            frag2.appendChild(box);
          });
          grid.innerHTML = '';
          grid.appendChild(frag2);
          console.warn('EightBranchesDisplay: minimal fallback cards rendered');
        }
      } catch {}

      // evidenceモード切替の明示反映（summaryを隠し、evidenceを開く）
      try {
        const applyMode = async () => {
          const isEvidence = (this.displayMode === 'evidence');
          const root = this.container;
          // Show/Hide summary sections
          root.querySelectorAll('[data-section="summary"]').forEach(el => {
            try { el.style.display = isEvidence ? 'none' : ''; } catch {}
          });
          // Open/Close details and evidence sections
          root.querySelectorAll('details').forEach(d => { try { d.open = isEvidence; } catch {} });
          root.querySelectorAll('[data-section="evidence"]').forEach(d => {
            try { if (d.tagName?.toLowerCase() === 'details') d.open = isEvidence; } catch {}
          });
        };
        await new Promise(res => requestAnimationFrame(() => res()));
        await applyMode();
      } catch {}
    }

    // チーム前提の文面を個人視点へ穏やかに置換
    _toPersonalPerspective(text){
      try {
        let t = String(text||'');
        const rules = [
          [/組織|チーム|部門|部署|社内横断|部門横断/g, '関係資源'],
          [/周囲|関係者|メンバー|人々|大衆|皆/g, '必要な相手'],
          [/仲間と共に|皆で|協働|共創/g, '自分のペースで周囲を活用し'],
          [/協力を得て/g, '必要な支援や資源を整えて'],
          [/合意形成/g, '自分の中の納得と優先順位付け'],
          [/リーダーシップ/g, '自己決定と自己管理'],
          [/信頼を得て/g, '一貫性を積み重ねて'],
          [/求心力/g, '軸の明確さ'],
          [/評価|称賛|支持/g, '手応え'],
          [/関係を丁寧に整え/g, '自分の作業環境を整え'],
          [/協力関係/g, '関係資源の使い方'],
          [/周囲の信頼/g, '自分への信頼と一貫性'],
          [/目標を共有/g, '目的を自分の言葉で明確にし'],
          [/メンバー/g, '関係資源']
        ];
        rules.forEach(([a,b])=>{ t = t.replace(a,b); });
        return t;
      } catch { return String(text||''); }
    }

  }
  if (typeof window !== 'undefined') {
    global.EightBranchesDisplay = EightBranchesDisplay;
  }

  console.log('✅ EightBranchesDisplay loaded');
})(typeof window !== 'undefined' ? window : this);
