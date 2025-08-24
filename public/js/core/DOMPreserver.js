/**
 * DOMPreserver - Canvas要素保護とDOM差分更新システム
 * 
 * Thinking Harderフィードバックに基づく実装
 * 不変条件: Chart DOM要素は削除・置換しない
 * 可変条件: テキスト/カードは差分パッチで更新
 */

class DOMPreserver {
  constructor() {
    this.charts = new Map(); // chartId -> Chart instance
    this.mounted = false;
    this.debug = true; // 開発時は true
    
    // 不変条件を定義
    this.invariants = {
      containerId: 'eight-scenarios-display-container',
      chartIds: ['three-stage', 'current-position', 'future-branches'],
      maxScenarioCards: 8
    };
  }

  /**
   * 1. スケルトン固定 - 初期レンダリング（1回だけ）
   */
  mountSkeletonOnce() {
    const container = document.getElementById(this.invariants.containerId);
    if (!container) {
      console.error(`❌ Container ${this.invariants.containerId} not found`);
      return false;
    }
    
    if (container.dataset.mounted === 'true') {
      console.log('✅ Skeleton already mounted');
      return true;
    }
    
    // HTMLスケルトンを1度だけ描画
    container.innerHTML = `
      <section id="scenarios-cards" aria-live="polite" class="scenarios-grid">
        <!-- 8枚のシナリオカードがここに入る -->
      </section>
      
      <section id="score-visualization" class="score-visualization-container">
        <h3>📊 スコア比較・変化プロセス可視化</h3>
        
        <div class="chart-root" data-chart-id="three-stage">
          <h4>3段階変化プロセス</h4>
          <canvas id="three-stage-canvas" width="640" height="240"></canvas>
        </div>
        
        <div class="chart-root" data-chart-id="current-position">
          <h4>現在位置の詳細分析</h4>
          <canvas id="current-position-canvas" width="640" height="240"></canvas>
        </div>
        
        <div class="chart-root" data-chart-id="future-branches">
          <h4>未来分岐パスの比較</h4>
          <canvas id="future-branches-canvas" width="640" height="240"></canvas>
        </div>
      </section>
    `;
    
    container.dataset.mounted = 'true';
    container.dataset.owned = 'haqei';
    
    // Canvas要素に保護フラグを設定
    container.querySelectorAll('canvas').forEach(canvas => {
      canvas.dataset.preserve = 'true';
    });
    
    console.log('✅ DOM Skeleton mounted successfully');
    this.mounted = true;
    
    // 開発時のみ: 破壊的操作を禁止
    if (this.debug) {
      this.guardCriticalRoots();
      this.watchForChartDestruction();
    }
    
    return true;
  }

  /**
   * 2. Chart.jsライフサイクル管理
   */
  getCtx(chartId) {
    const canvas = document.querySelector(`.chart-root[data-chart-id="${chartId}"] canvas`);
    if (!canvas) {
      console.error(`❌ Canvas for ${chartId} not found`);
      return null;
    }
    return canvas.getContext('2d');
  }
  
  upsertChart(chartId, configFactory) {
    const existed = this.charts.get(chartId);
    if (existed) {
      console.log(`🔄 Destroying existing chart: ${chartId}`);
      existed.destroy(); // Chart.jsインスタンスのみ破棄（DOMは残す）
    }
    
    const ctx = this.getCtx(chartId);
    if (!ctx) return null;
    
    console.log(`📊 Creating new chart: ${chartId}`);
    const chart = new window.Chart(ctx, configFactory());
    this.charts.set(chartId, chart);
    
    return chart;
  }
  
  /**
   * 3. シナリオカードの差分レンダリング（innerHTML禁止）
   */
  renderScenarioCards(scenarios) {
    const container = document.getElementById('scenarios-cards');
    if (!container) {
      console.error('❌ scenarios-cards container not found');
      return;
    }
    
    // 8枚に正規化
    const normalizedScenarios = this.normalizeScenarios(scenarios);
    
    // 既存カードをキーでマップ化
    const existingCards = new Map(
      [...container.children].map(el => [el.dataset.key, el])
    );
    
    normalizedScenarios.forEach((scenario, idx) => {
      const key = String(idx);
      let card = existingCards.get(key);
      
      if (!card) {
        // 新規カード作成
        card = document.createElement('article');
        card.dataset.key = key;
        card.className = 'scenario-card';
        card.innerHTML = `
          <div class="card-header">
            <h3 class="scenario-title"></h3>
            <span class="scenario-code"></span>
          </div>
          <div class="card-body">
            <p class="scenario-summary"></p>
            <div class="three-phases">
              <div class="phase phase-1">
                <span class="phase-label">第1段：</span>
                <span class="phase-content"></span>
              </div>
              <div class="phase phase-2">
                <span class="phase-label">第2段：</span>
                <span class="phase-content"></span>
              </div>
              <div class="phase phase-3">
                <span class="phase-label">第3段：</span>
                <span class="phase-content"></span>
              </div>
            </div>
            <div class="scenario-score">
              <span class="score-label">総合スコア：</span>
              <span class="score-value"></span>
            </div>
          </div>
        `;
        container.appendChild(card);
      }
      
      // 差分更新（textContentのみ変更）
      this.patchText(card, '.scenario-title', this.toFriendlyTitle(scenario));
      this.patchText(card, '.scenario-code', scenario.code || '');
      this.patchText(card, '.scenario-summary', this.toFriendlySummary(scenario));
      
      // 3段階プロセスの更新
      this.patchText(card, '.phase-1 .phase-content', scenario.phase1 || '現状の深化');
      this.patchText(card, '.phase-2 .phase-content', scenario.phase2 || '変化の兆し');
      this.patchText(card, '.phase-3 .phase-content', scenario.phase3 || '新たな様式');
      
      // スコア更新
      const score = scenario.totalScore || scenario.score?.total || 0;
      this.patchText(card, '.score-value', `${Math.round(score)}点`);
    });
    
    // 余剰カードの削除（8枚を超える場合）
    [...container.children].forEach(el => {
      const key = Number(el.dataset.key);
      if (key >= normalizedScenarios.length) {
        el.remove();
      }
    });
    
    console.log(`✅ Rendered ${normalizedScenarios.length} scenario cards`);
  }
  
  /**
   * シナリオを8枚に正規化（重複削除）
   */
  normalizeScenarios(scenarios) {
    if (!scenarios || scenarios.length === 0) return [];
    
    // 重複削除（コードベースでユニーク化）
    const uniqueMap = new Map();
    scenarios.forEach(s => {
      const key = s.code || s.name || JSON.stringify(s);
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, s);
      }
    });
    
    const unique = Array.from(uniqueMap.values());
    
    // 8枚に制限
    return unique.slice(0, 8);
  }
  
  /**
   * テキスト差分更新ヘルパー
   */
  patchText(root, selector, text) {
    const node = root.querySelector(selector);
    if (node && node.textContent !== text) {
      node.textContent = text;
    }
  }
  
  /**
   * 専門用語をユーザーフレンドリーに変換
   */
  toFriendlyTitle(scenario) {
    const codeMap = {
      'JJJ': '現状維持を深める',
      'JJC': '内的価値観の転換',
      'JCJ': '外的環境への適応',
      'JCC': '根本的な変革',
      'CJJ': '新たな基盤の構築',
      'CJC': '創造的な統合',
      'CCJ': '持続可能な発展',
      'CCC': '完全な刷新'
    };
    
    return codeMap[scenario.code] || scenario.name || '未来パターン';
  }
  
  toFriendlySummary(scenario) {
    // 易経専門用語を平易な表現に変換
    let summary = scenario.description || scenario.summary || '';
    
    const termMap = {
      '両者敗北': '現状が停滞しやすい局面',
      '進爻': '状況の自然な進展',
      '変爻': '積極的な変化の選択',
      '六三': '第3段階の転換点',
      '初九': '始まりの段階',
      '上九': '完成の段階'
    };
    
    Object.entries(termMap).forEach(([term, friendly]) => {
      summary = summary.replace(new RegExp(term, 'g'), friendly);
    });
    
    return summary;
  }
  
  /**
   * 3. 破壊的操作の禁止（開発時のみ）
   */
  guardCriticalRoots() {
    const container = document.getElementById(this.invariants.containerId);
    if (!container) return;
    
    // innerHTML設定を禁止
    const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    Object.defineProperty(container, 'innerHTML', {
      set(value) {
        console.error(`🛑 [FORBIDDEN] innerHTML set on #${this.id} - Canvas要素が破壊されます！`);
        console.trace();
        // 開発時はエラーをthrow
        if (window.DOMPreserver?.debug) {
          throw new Error('innerHTML is forbidden on chart containers');
        }
      },
      get: descriptor.get
    });
    
    // chart-root要素も保護
    document.querySelectorAll('.chart-root').forEach(el => {
      Object.defineProperty(el, 'innerHTML', {
        set(value) {
          console.error(`🛑 [FORBIDDEN] innerHTML set on chart-root`);
          console.trace();
        },
        get: descriptor.get
      });
    });
    
    console.log('✅ Critical DOM roots are now protected');
  }
  
  /**
   * Canvas削除の監視
   */
  watchForChartDestruction() {
    const container = document.getElementById(this.invariants.containerId);
    if (!container) return;
    
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.removedNodes.forEach(node => {
          if (node.nodeType === 1 && node.matches?.('canvas')) {
            console.error(`🛑 Canvas removed from DOM!`, {
              id: node.id,
              className: node.className,
              parent: mutation.target
            });
            console.trace();
          }
        });
      });
    });
    
    observer.observe(container, {
      childList: true,
      subtree: true
    });
    
    console.log('✅ Canvas destruction watcher activated');
  }
  
  /**
   * チャート描画メインメソッド
   */
  renderCharts(analysisResults) {
    if (!this.mounted) {
      console.warn('⚠️ Skeleton not mounted, mounting now...');
      this.mountSkeletonOnce();
    }
    
    // 3段階プロセスチャート
    this.upsertChart('three-stage', () => ({
      type: 'line',
      data: {
        labels: ['現在', '変化期', '新様式'],
        datasets: [{
          label: '変化の流れ',
          data: analysisResults.phaseScores || [70, 65, 75],
          borderColor: '#4A90E2',
          backgroundColor: 'rgba(74, 144, 226, 0.1)',
          tension: 0.3
        }]
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false
      }
    }));
    
    // 現在位置チャート
    this.upsertChart('current-position', () => ({
      type: 'bar',
      data: {
        labels: ['基本', 'ポテンシャル', '安定性', 'リスク', '変動性'],
        datasets: [{
          label: '現在の状態',
          data: analysisResults.currentScores || [70, 65, 60, 40, 50],
          backgroundColor: [
            '#4A90E2',
            '#50C878',
            '#FFD700',
            '#FF6B6B',
            '#9B59B6'
          ]
        }]
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false
      }
    }));
    
    // 未来分岐チャート
    const scenarios = analysisResults.scenarios || [];
    this.upsertChart('future-branches', () => ({
      type: 'radar',
      data: {
        labels: ['実現性', '安定性', '成長性', 'リスク', '変革度'],
        datasets: scenarios.slice(0, 3).map((s, i) => ({
          label: this.toFriendlyTitle(s),
          data: [
            s.feasibility || 50,
            s.stability || 50,
            s.growth || 50,
            s.risk || 50,
            s.transformation || 50
          ],
          borderColor: ['#4A90E2', '#50C878', '#FFD700'][i],
          backgroundColor: ['rgba(74,144,226,0.2)', 'rgba(80,200,120,0.2)', 'rgba(255,215,0,0.2)'][i]
        }))
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false
      }
    }));
    
    console.log('✅ All charts rendered successfully');
  }
}

// グローバルに公開
window.DOMPreserver = DOMPreserver;