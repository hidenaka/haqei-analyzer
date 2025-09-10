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

    _copy(text) {
      try { navigator.clipboard && navigator.clipboard.writeText(text); } catch {}
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

    _card(branch) {
      const card = document.createElement('div');
      card.style.border = '1px solid rgba(99,102,241,0.35)';
      card.style.borderRadius = '10px';
      card.style.padding = '12px 14px';
      card.style.background = 'rgba(17,24,39,0.35)';
      card.style.color = '#E5E7EB';
      card.style.boxShadow = '0 2px 6px rgba(0,0,0,0.25)';
      card.style.cursor = 'pointer';

      const title = document.createElement('div');
      const badge = this._badge(branch.series);
      title.innerHTML = `分岐${branch.id}｜${branch.series} <span style="margin-left:8px;padding:2px 8px;border-radius:9999px;background:${badge.color}22;color:${badge.color};font-size:.8em;">${badge.label}</span>`;
      title.style.fontWeight = '600';
      title.style.color = '#A5B4FC';
      title.style.marginBottom = '8px';
      // intuitive emoji prefix
      try { const em = this._emoji(branch.series); title.innerHTML = `${em} ` + title.innerHTML; } catch {}

      const summary = document.createElement('div');
      summary.textContent = this._summary(branch.series);
      summary.style.fontSize = '.9em';
      summary.style.color = '#cbd5e1';
      summary.style.margin = '6px 0 8px';
      // recommendation score bar
      const __score = this._score(branch.series);
      const __scoreWrap = document.createElement('div');
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
      __scoreWrap.appendChild(__bar);
      __scoreWrap.appendChild(__label);
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
      const __tips = this._tips(branch.series);
      const __tipsEl = document.createElement('div');
      __tipsEl.style.fontSize = '.85em';
      __tipsEl.style.color = '#cbd5e1';
      __tipsEl.style.margin = '4px 0 6px';
      __tipsEl.textContent = `3秒要約: ${__tips.join(' / ')}`;
      // mount
      card.appendChild(__scoreWrap);
      card.appendChild(__chips);
      card.appendChild(__tipsEl);

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
      const copyBtn = document.createElement('button');
      copyBtn.textContent = 'この分岐をコピー';
      copyBtn.style.marginTop = '8px';
      copyBtn.style.fontSize = '.85em';
      copyBtn.style.padding = '6px 10px';
      copyBtn.style.border = '1px solid rgba(99,102,241,0.5)';
      copyBtn.style.borderRadius = '8px';
      copyBtn.style.background = 'transparent';
      copyBtn.style.color = '#c7d2fe';
      copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = `分岐${branch.id}｜${branch.series}\n` + branch.steps.map((s,i)=>`Step${i+1} ${s.action==='進'?'進爻':'変爻'}: ${s.lineText||''}`).join('\n');
        this._copy(text);
      });

      details.appendChild(sum);
      details.appendChild(ul);
      card.appendChild(title);
      card.appendChild(summary);
      card.appendChild(details);
      card.appendChild(copyBtn);

      card.addEventListener('click', () => {
        const ev = new CustomEvent('branchSelected', { detail: { id: branch.id, series: branch.series, steps: branch.steps } });
        this.container.dispatchEvent(ev);
      });
      return card;
    }

    displayBranches(branches) {
      if (!this.container) return;
      this.container.innerHTML = '';

      // Comparison chart (wave/line) for intuitive overview
      try {
        const chartWrap = document.createElement('div');
        chartWrap.style.margin = '8px 0 12px';
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
          const toDataset = (b) => {
            const colors = { '連続進行': '#10B981', '進み基調': '#3B82F6', '転換基調': '#F59E0B', '全面転換': '#EF4444', '折衷': '#A78BFA' };
            const badge = this._badge(b.series);
            const vals = b.steps.map(s => getBasicScore(s.hex, s.line)).map((v,i) => v ?? (b.steps[i].action === '進' ? 70 : 55));
            return {
              label: `分岐${b.id}`,
              data: vals,
              borderColor: colors[badge.label] || '#94A3B8',
              backgroundColor: (colors[badge.label] || '#94A3B8') + '55',
              tension: 0.35,
              pointRadius: 3,
              fill: false
            };
          };
          const cfg = {
            type: 'line',
            data: { labels, datasets: branches.map(toDataset) },
            options: {
              responsive: true,
              plugins: { legend: { display: false } },
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

      branches.forEach(b => grid.appendChild(this._card(b)));
      const heading = document.createElement('div');
      heading.textContent = '八分岐（進/変）の候補';
      heading.style.color = '#c7d2fe';
      heading.style.fontWeight = '700';
      heading.style.margin = '8px 0 6px';
      this.container.appendChild(heading);
      this.container.appendChild(grid);
    }
  }

  if (typeof window !== 'undefined') {
    global.EightBranchesDisplay = EightBranchesDisplay;
  }

  console.log('✅ EightBranchesDisplay loaded');
})(typeof window !== 'undefined' ? window : this);
