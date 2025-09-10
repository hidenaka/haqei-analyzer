/**
 * EightBranchesDisplay - 進/変の8分岐を簡素表示
 */
(function(global){
  'use strict';

  class EightBranchesDisplay {
    constructor() {
      this.name = 'EightBranchesDisplay';
      this.container = null;
      this.version = '1.1.0';
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

      const summary = document.createElement('div');
      summary.textContent = this._summary(branch.series);
      summary.style.fontSize = '.9em';
      summary.style.color = '#cbd5e1';
      summary.style.margin = '6px 0 8px';

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
