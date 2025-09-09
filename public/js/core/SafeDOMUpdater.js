/**
 * SafeDOMUpdater - innerHTML禁止、差分更新のみ
 * Canvas要素を破壊しないDOM更新システム
 */

class SafeDOMUpdater {
  constructor() {
    this.preservedElements = new Map();
    this.initialized = false;
  }

  /**
   * 結果コンテナの安全な更新
   */
  updateResultsContainer(analysisResult) {
    const container = document.getElementById('resultsContainer');
    if (!container) {
      console.error('❌ resultsContainer not found');
      return false;
    }

    // 既存のCanvas要素を保護
    this.preserveCanvasElements(container);
    
    // CRITICAL: eight-scenarios-display-containerも保護
    const eightScenariosContainer = document.getElementById('eight-scenarios-display-container');
    if (eightScenariosContainer) {
      this.preservedElements.set('eight-scenarios-container', {
        element: eightScenariosContainer,
        parent: eightScenariosContainer.parentElement,
        nextSibling: eightScenariosContainer.nextSibling
      });
      console.log('🛡️ Preserved eight-scenarios-display-container');
    }

    // コンテナを表示
    container.style.display = 'block';

    // 必要な構造を確保（innerHTMLを使わない）
    this.ensureResultStructure(container);

    // 各セクションを安全に更新
    this.updateAnalysisSummary(container, analysisResult);
    this.updateScenariosDisplay(container, analysisResult);
    this.updateChartsSection(container, analysisResult);

    // Canvas要素を復元
    this.restoreCanvasElements(container);
    
    // eight-scenarios-display-containerを復元
    const preserved = this.preservedElements.get('eight-scenarios-container');
    if (preserved && !document.contains(preserved.element)) {
      if (preserved.parent && document.contains(preserved.parent)) {
        preserved.parent.appendChild(preserved.element);
        console.log('✅ Restored eight-scenarios-display-container');
      }
    }

    console.log('✅ Results updated safely without destroying Canvas and Container');
    return true;
  }

  /**
   * Canvas要素の保護
   */
  preserveCanvasElements(container) {
    const canvases = container.querySelectorAll('canvas');
    canvases.forEach(canvas => {
      const rng = window.seedableRandom || { next: () => 0.5 };
      const key = canvas.id || canvas.className || rng.next().toString();
      this.preservedElements.set(key, {
        element: canvas,
        parent: canvas.parentElement,
        nextSibling: canvas.nextSibling
      });
    });
    console.log(`🛡️ Preserved ${canvases.length} canvas elements`);
  }

  /**
   * Canvas要素の復元
   */
  restoreCanvasElements(container) {
    this.preservedElements.forEach((info, key) => {
      if (!document.contains(info.element)) {
        // 元の位置に復元
        if (info.parent && document.contains(info.parent)) {
          if (info.nextSibling && document.contains(info.nextSibling)) {
            info.parent.insertBefore(info.element, info.nextSibling);
          } else {
            info.parent.appendChild(info.element);
          }
          console.log(`✅ Restored canvas: ${key}`);
        }
      }
    });
  }

  /**
   * 結果構造の確保（innerHTMLを使わない）
   */
  ensureResultStructure(container) {
    // result-containerの確保
    let resultDiv = container.querySelector('.result-container');
    if (!resultDiv) {
      resultDiv = document.createElement('div');
      resultDiv.className = 'result-container';
      container.appendChild(resultDiv);
    }

    // result-layoutの確保
    let layoutDiv = resultDiv.querySelector('.result-layout');
    if (!layoutDiv) {
      layoutDiv = document.createElement('div');
      layoutDiv.className = 'result-layout';
      resultDiv.appendChild(layoutDiv);
    }

    // 左パネル（分析サマリー）の確保
    let summaryPanel = layoutDiv.querySelector('.analysis-summary-panel');
    if (!summaryPanel) {
      summaryPanel = document.createElement('div');
      summaryPanel.className = 'analysis-summary-panel';
      layoutDiv.appendChild(summaryPanel);
    }

    // eight-scenarios-display-containerの確保
    let scenariosContainer = container.querySelector('#eight-scenarios-display-container');
    if (!scenariosContainer) {
      scenariosContainer = document.createElement('div');
      scenariosContainer.id = 'eight-scenarios-display-container';
      scenariosContainer.className = 'eight-scenarios-container';
      scenariosContainer.style.cssText = 'margin: 20px 0; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 12px;';
      summaryPanel.appendChild(scenariosContainer);
    }

    return { resultDiv, layoutDiv, summaryPanel, scenariosContainer };
  }

  /**
   * 分析サマリーの更新（差分のみ）
   */
  updateAnalysisSummary(container, analysisResult) {
    const summaryPanel = container.querySelector('.analysis-summary-panel');
    if (!summaryPanel) return;

    // 現在の卦情報を更新
    let hexagramInfo = summaryPanel.querySelector('#currentHexagramInfo');
    if (!hexagramInfo) {
      hexagramInfo = document.createElement('span');
      hexagramInfo.id = 'currentHexagramInfo';
      
      let positionCard = summaryPanel.querySelector('.current-position-card');
      if (!positionCard) {
        positionCard = document.createElement('div');
        positionCard.className = 'current-position-card';
        summaryPanel.insertBefore(positionCard, summaryPanel.firstChild);
      }
      
      const hexagramHighlight = positionCard.querySelector('.hexagram-highlight') || positionCard;
      hexagramHighlight.appendChild(hexagramInfo);
    }

    // テキストのみ更新
    const hexagramText = analysisResult.currentHexagram || 
                        analysisResult.hexagramName || 
                        '分析中...';
    
    if (hexagramInfo.textContent !== hexagramText) {
      hexagramInfo.textContent = hexagramText;
    }
  }

  /**
   * シナリオ表示の更新
   */
  updateScenariosDisplay(container, analysisResult) {
    const scenariosContainer = container.querySelector('#eight-scenarios-display-container');
    if (!scenariosContainer) return;

    // DOMPreserverがあれば使用
    if (window.DOMPreserver) {
      const preserver = new window.DOMPreserver();
      
      // スケルトンが未マウントなら初期化
      if (scenariosContainer.dataset.mounted !== 'true') {
        preserver.mountSkeletonOnce();
      }

      // シナリオデータの抽出
      const scenarios = this.extractScenarios(analysisResult);
      
      // 差分レンダリング
      preserver.renderScenarioCards(scenarios);
      
      // チャートデータの抽出と描画
      const chartData = this.extractChartData(analysisResult);
      preserver.renderCharts(chartData);
    } else {
      // フォールバック：基本的な差分更新
      this.basicScenarioUpdate(scenariosContainer, analysisResult);
    }
  }

  /**
   * チャートセクションの更新
   */
  updateChartsSection(container, analysisResult) {
    // Canvasが既に存在する場合はChart.jsインスタンスのみ更新
    const canvases = container.querySelectorAll('canvas');
    
    canvases.forEach(canvas => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 既存のChartインスタンスを破棄
      if (canvas.chart) {
        canvas.chart.destroy();
      }

      // IDに基づいて適切なチャートを再作成
      if (canvas.id === 'currentPositionChart') {
        this.createPositionChart(ctx, analysisResult);
      } else if (canvas.id === 'futureBranchingChart') {
        this.createBranchingChart(ctx, analysisResult);
      } else if (canvas.id === 'scenarioComparisonChart') {
        this.createComparisonChart(ctx, analysisResult);
      }
    });

    console.log(`✅ Updated ${canvases.length} charts without destroying Canvas elements`);
  }

  /**
   * シナリオデータの抽出
   */
  extractScenarios(analysisResult) {
    const scenarios = 
      analysisResult.scenarios ||
      analysisResult.finalEightPaths ||
      analysisResult.eightScenarios ||
      [];

    return scenarios.slice(0, 8).map((s, idx) => ({
      code: s.code || s.pattern || `S${idx + 1}`,
      name: s.name || s.hexagramName || `シナリオ${idx + 1}`,
      description: s.description || s.summary || '',
      totalScore: s.totalScore || s.score?.total || s.probability * 100 || 50,
      phase1: s.phase1 || '現在',
      phase2: s.phase2 || '変化',
      phase3: s.phase3 || '未来'
    }));
  }

  /**
   * チャートデータの抽出
   */
  extractChartData(analysisResult) {
    return {
      phaseScores: [
        analysisResult.currentScore || 70,
        analysisResult.transitionScore || 65,
        analysisResult.futureScore || 75
      ],
      currentScores: [
        analysisResult.scores?.S1 || 70,
        analysisResult.scores?.S2 || 65,
        analysisResult.scores?.S3 || 60,
        analysisResult.scores?.S4 || 40,
        analysisResult.scores?.S5 || 50
      ],
      scenarios: this.extractScenarios(analysisResult)
    };
  }

  /**
   * 基本的なシナリオ更新（フォールバック）
   */
  basicScenarioUpdate(container, analysisResult) {
    const scenarios = this.extractScenarios(analysisResult);
    
    // scenarios-cardsセクションの確保
    let cardsSection = container.querySelector('#scenarios-cards');
    if (!cardsSection) {
      cardsSection = document.createElement('section');
      cardsSection.id = 'scenarios-cards';
      cardsSection.className = 'scenarios-grid';
      container.appendChild(cardsSection);
    }

    // 既存カードの更新または新規作成
    scenarios.forEach((scenario, idx) => {
      let card = cardsSection.children[idx];
      
      if (!card) {
        card = document.createElement('article');
        card.className = 'scenario-card';
        card.dataset.key = String(idx);
        cardsSection.appendChild(card);
      }

      // タイトルの更新
      let title = card.querySelector('.scenario-title');
      if (!title) {
        title = document.createElement('h3');
        title.className = 'scenario-title';
        card.appendChild(title);
      }
      if (title.textContent !== scenario.name) {
        title.textContent = scenario.name;
      }

      // 説明の更新
      let desc = card.querySelector('.scenario-summary');
      if (!desc) {
        desc = document.createElement('p');
        desc.className = 'scenario-summary';
        card.appendChild(desc);
      }
      if (desc.textContent !== scenario.description) {
        desc.textContent = scenario.description;
      }
    });

    // 余分なカードの削除
    while (cardsSection.children.length > scenarios.length) {
      cardsSection.removeChild(cardsSection.lastChild);
    }
  }

  /**
   * Chart.js グラフ作成メソッド
   */
  createPositionChart(ctx, analysisResult) {
    if (!window.Chart) return;

    const chart = new window.Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['基本', 'ポテンシャル', '安定性', 'リスク', '変動性'],
        datasets: [{
          label: '現在の状態',
          data: [
            analysisResult.scores?.S1 || 70,
            analysisResult.scores?.S2 || 65,
            analysisResult.scores?.S3 || 60,
            analysisResult.scores?.S4 || 40,
            analysisResult.scores?.S5 || 50
          ],
          backgroundColor: ['#4A90E2', '#50C878', '#FFD700', '#FF6B6B', '#9B59B6']
        }]
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false
      }
    });

    ctx.canvas.chart = chart;
  }

  createBranchingChart(ctx, analysisResult) {
    if (!window.Chart) return;

    const chart = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: ['現在', '変化期', '新様式'],
        datasets: [{
          label: '変化の流れ',
          data: [70, 65, 75],
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
    });

    ctx.canvas.chart = chart;
  }

  createComparisonChart(ctx, analysisResult) {
    if (!window.Chart) return;

    const scenarios = this.extractScenarios(analysisResult).slice(0, 3);
    
    const chart = new window.Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['実現性', '安定性', '成長性', 'リスク', '変革度'],
        datasets: scenarios.map((s, i) => ({
          label: s.name,
          data: [60, 55, 65, 40, 70],
          borderColor: ['#4A90E2', '#50C878', '#FFD700'][i],
          backgroundColor: ['rgba(74,144,226,0.2)', 'rgba(80,200,120,0.2)', 'rgba(255,215,0,0.2)'][i]
        }))
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false
      }
    });

    ctx.canvas.chart = chart;
  }
}

// グローバルに公開
window.SafeDOMUpdater = SafeDOMUpdater;