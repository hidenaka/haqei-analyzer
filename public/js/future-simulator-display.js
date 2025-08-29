/**
 * Future Simulator 新表示システム
 * 8パターンシナリオカード with 進爻/変爻ロジック
 * 
 * @version 1.0.0
 * @date 2025-08-16
 */

class FutureSimulatorDisplay {
  constructor() {
    this.scenarios = [];
    this.currentHexagram = null;
    this.currentLine = null;
    this.chart = null;
    this.expressionEngine = new FutureSimulatorExpression();
    console.log('✨ FutureSimulatorDisplay initialized with expression engine');
  }

  /**
   * 8パターン生成（進爻/変爻の3フェーズ組み合わせ）
   */
  generateEightPatterns(hexagramIndex, lineIndex) {
    const patterns = [];
    const combinations = [
      ['進爻', '進爻', '進爻'],
      ['進爻', '進爻', '変爻'],
      ['進爻', '変爻', '進爻'],
      ['進爻', '変爻', '変爻'],
      ['変爻', '進爻', '進爻'],
      ['変爻', '進爻', '変爻'],
      ['変爻', '変爻', '進爻'],
      ['変爻', '変爻', '変爻']
    ];

    combinations.forEach((pattern, index) => {
      const scenario = this.calculateScenario(hexagramIndex, lineIndex, pattern);
      scenario.originalId = index + 1; // 元のID保持
      scenario.id = index + 1;
      scenario.pattern = pattern;
      // 各フェーズにシナリオIDを埋め込み
      scenario.phases.forEach(phase => {
        phase.scenarioId = index + 1;
      });
      patterns.push(scenario);
    });

    // スコアで降順ソート（IDは保持）
    patterns.sort((a, b) => b.finalScore - a.finalScore);
    
    // 表示用IDを再割り当て（元IDは保持）
    patterns.forEach((pattern, index) => {
      pattern.displayId = index + 1;
    });
    
    return patterns;
  }

  /**
   * シナリオ計算
   */
  calculateScenario(hexagramIndex, lineIndex, pattern) {
    const phases = [];
    let currentHex = hexagramIndex;
    let currentLine = lineIndex;
    
    // 初期状態
    const initialData = this.getHexagramData(currentHex, currentLine);
    phases.push({
      phase: '現在',
      hexagram: currentHex,
      line: currentLine,
      data: initialData,
      score: initialData?.S7_総合評価スコア || 50
    });

    // 3フェーズ計算
    pattern.forEach((action, phaseIndex) => {
      if (action === '進爻') {
        // 同じ卦の次の爻へ
        currentLine = Math.min(currentLine + 1, 5);
      } else {
        // 変爻：陰陽反転で新しい卦へ
        const result = this.performHengYao(currentHex, currentLine);
        currentHex = result.hexagram;
        // 変爻後も同じ爻位置を保持
      }

      const phaseData = this.getHexagramData(currentHex, currentLine);
      phases.push({
        phase: `Phase${phaseIndex + 1}`,
        action: action,
        hexagram: currentHex,
        line: currentLine,
        data: phaseData,
        score: phaseData?.S7_総合評価スコア || 50
      });
    });

    return {
      phases: phases,
      finalScore: phases[phases.length - 1].score,
      scoreChange: phases[phases.length - 1].score - phases[0].score,
      trend: this.analyzeTrend(phases)
    };
  }

  /**
   * H384データベースから爻データ取得
   */
  getHexagramData(hexagramIndex, lineIndex) {
    if (!window.H384_DATA) {
      console.warn('H384データベースが見つかりません');
      return null;
    }

    // 卦番号と爻位置から該当データを検索
    const lineNames = ['初九', '九二', '九三', '九四', '九五', '上九', 
                      '初六', '六二', '六三', '六四', '六五', '上六'];
    
    const data = window.H384_DATA.find(item => 
      item['卦番号'] === hexagramIndex && 
      lineNames.includes(item['爻']) &&
      this.getLinePosition(item['爻']) === lineIndex
    );

    return data || this.generateFallbackData(hexagramIndex, lineIndex);
  }

  /**
   * 爻名から位置インデックス取得
   */
  getLinePosition(lineName) {
    const positions = {
      '初九': 0, '初六': 0,
      '九二': 1, '六二': 1,
      '九三': 2, '六三': 2,
      '九四': 3, '六四': 3,
      '九五': 4, '六五': 4,
      '上九': 5, '上六': 5
    };
    return positions[lineName] || 0;
  }

  /**
   * 変爻実行（陰陽反転）
   */
  performHengYao(hexagramIndex, lineIndex) {
    // 簡易実装：次の卦へ移動
    // 実際は二進数変換で陰陽反転する必要がある
    const newHexagram = (hexagramIndex % 64) + 1;
    return {
      hexagram: newHexagram,
      line: lineIndex
    };
  }

  /**
   * トレンド分析
   */
  analyzeTrend(phases) {
    const scores = phases.map(p => p.score);
    const changes = [];
    
    for (let i = 1; i < scores.length; i++) {
      changes.push(scores[i] - scores[i-1]);
    }

    const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
    
    if (avgChange > 5) return '上昇トレンド';
    if (avgChange < -5) return '下降トレンド';
    if (Math.max(...changes) - Math.min(...changes) > 10) return '変動型';
    return '安定型';
  }

  /**
   * フォールバックデータ生成
   */
  generateFallbackData(hexagramIndex, lineIndex) {
    return {
      '卦番号': hexagramIndex,
      '卦名': `卦${hexagramIndex}`,
      '爻': `爻${lineIndex + 1}`,
      'キーワード': ['変化', '調整', '発展'],
      'S7_総合評価スコア': 50 + Math.floor((window.seedableRandom?.next() || 0.5) * 30),
      '現代解釈の要約': '状況は変化の中にあります'
    };
  }

  /**
   * UI描画
   */
  render(containerId, hexagramIndex, lineIndex) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('コンテナが見つかりません:', containerId);
      return;
    }

    // 8パターン生成
    this.scenarios = this.generateEightPatterns(hexagramIndex, lineIndex);
    
    // HTML生成
    container.innerHTML = this.generateHTML();
    container.style.display = 'block';
    
    // グラフ描画
    this.renderChart();
    
    // イベントリスナー設定
    this.attachEventListeners();
    
    console.log('✅ Future Simulator表示完了');
  }

  /**
   * HTML生成
   */
  generateHTML() {
    return `
      <div class="future-simulator-container">
        <!-- 現在の状況 -->
        <div class="current-situation">
          <h3>現在の状況</h3>
          <div class="situation-info">
            ${this.scenarios[0]?.phases[0]?.data ? 
              `<p>${this.scenarios[0].phases[0].data['卦名']} ${this.scenarios[0].phases[0].data['爻']}</p>
               <p>キーワード: ${this.scenarios[0].phases[0].data['キーワード'].join('、')}</p>
               <p>スコア: ${this.scenarios[0].phases[0].score}/100</p>` 
              : '<p>データ読み込み中...</p>'}
          </div>
        </div>

        <!-- スコア推移グラフ -->
        <div class="score-chart-container">
          <h3>8パターンのスコア推移比較</h3>
          <canvas id="scoreChart" width="400" height="200"></canvas>
        </div>

        <!-- 8つのシナリオカード -->
        <div class="scenario-cards">
          <h3>未来シナリオ（タップで詳細）</h3>
          <div class="cards-grid">
            ${this.scenarios.map(scenario => this.generateCardHTML(scenario)).join('')}
          </div>
        </div>

        <!-- 詳細モーダル -->
        <div id="detailModal" class="modal" style="display: none;">
          <div class="modal-content">
            <span class="close">&times;</span>
            <div id="modalBody"></div>
          </div>
        </div>
      </div>

      <style>
        .future-simulator-container {
          padding: 20px;
          background: #1a1a2e;
          color: #eee;
          border-radius: 10px;
        }

        .current-situation {
          background: #16213e;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .score-chart-container {
          background: #16213e;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .scenario-card {
          background: #16213e;
          border: 1px solid #0f3460;
          border-radius: 8px;
          padding: 15px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .scenario-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(94, 84, 142, 0.3);
        }

        .scenario-card.recommended {
          border-color: #e94560;
          background: linear-gradient(135deg, #16213e, #1a1a2e);
        }

        .score-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: bold;
        }

        .score-high { background: #10b981; }
        .score-medium { background: #f59e0b; }
        .score-low { background: #ef4444; }

        .modal {
          position: fixed;
          z-index: 1000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.8);
        }

        .modal-content {
          background-color: #16213e;
          margin: 5% auto;
          padding: 20px;
          border: 1px solid #0f3460;
          width: 90%;
          max-width: 600px;
          border-radius: 10px;
          max-height: 80vh;
          overflow-y: auto;
        }

        .close {
          color: #aaa;
          float: right;
          font-size: 28px;
          font-weight: bold;
          cursor: pointer;
        }

        .close:hover { color: #fff; }
      </style>
    `;
  }

  /**
   * カードHTML生成（感情配慮表現統合）
   */
  generateCardHTML(scenario) {
    const isRecommended = scenario.finalScore >= 80;
    const scoreClass = scenario.finalScore >= 80 ? 'score-high' : 
                       scenario.finalScore >= 60 ? 'score-medium' : 'score-low';
    
    // 感情配慮表現エンジン使用
    const cardSummary = this.expressionEngine.generateCardSummary(scenario);
    const evaluation = this.expressionEngine.generateComprehensiveEvaluation(scenario);
    
    return `
      <div class="scenario-card ${isRecommended ? 'recommended' : ''}" 
           data-scenario-id="${scenario.id}">
        <div class="card-header">
          <h4>${cardSummary.strategyIcon} シナリオ${scenario.id} [${scenario.pattern.map(p => p[0]).join('')}]</h4>
          <span class="score-badge ${scoreClass}">${scenario.finalScore}点</span>
        </div>
        <div class="card-body">
          <p class="strategy-type">${cardSummary.strategyName}</p>
          <p class="score-change">
            ${scenario.phases[0].score}→${scenario.finalScore} 
            (${scenario.scoreChange > 0 ? '+' : ''}${scenario.scoreChange}点)
          </p>
          <p class="process-description">${cardSummary.shortDescription}</p>
          <div class="card-footer">
            <span class="difficulty">難易度: ${cardSummary.difficulty}</span>
            <span class="trend">${cardSummary.trend} ${scenario.trend}</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * グラフ描画
   */
  renderChart() {
    const canvas = document.getElementById('scoreChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const datasets = this.scenarios.slice(0, 8).map((scenario, index) => ({
      label: `シナリオ${scenario.id}`,
      data: scenario.phases.map(p => p.score),
      borderColor: this.getChartColor(index),
      backgroundColor: this.getChartColor(index, 0.1),
      tension: 0.3
    }));

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['現在', 'Phase1', 'Phase2', 'Phase3'],
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { color: '#eee' }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 0,
            max: 100,
            ticks: { color: '#eee' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          },
          x: {
            ticks: { color: '#eee' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          }
        }
      }
    });
  }

  /**
   * チャートカラー取得
   */
  getChartColor(index, alpha = 1) {
    const colors = [
      `rgba(239, 68, 68, ${alpha})`,   // red
      `rgba(245, 158, 11, ${alpha})`,  // amber
      `rgba(16, 185, 129, ${alpha})`,  // emerald
      `rgba(59, 130, 246, ${alpha})`,  // blue
      `rgba(139, 92, 246, ${alpha})`,  // violet
      `rgba(236, 72, 153, ${alpha})`,  // pink
      `rgba(14, 165, 233, ${alpha})`,  // sky
      `rgba(168, 85, 247, ${alpha})`   // purple
    ];
    return colors[index % colors.length];
  }

  /**
   * イベントリスナー設定
   */
  attachEventListeners() {
    // カードクリック
    document.querySelectorAll('.scenario-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const scenarioId = parseInt(card.dataset.scenarioId);
        this.showDetail(scenarioId);
      });
    });

    // モーダル閉じる
    const modal = document.getElementById('detailModal');
    const closeBtn = modal?.querySelector('.close');
    
    closeBtn?.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }

  /**
   * 詳細表示
   */
  showDetail(scenarioId) {
    const scenario = this.scenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = this.generateDetailHTML(scenario);
    modal.style.display = 'block';
  }

  /**
   * 詳細HTML生成（感情配慮表現統合）
   */
  generateDetailHTML(scenario) {
    const totalChange = scenario.finalScore - scenario.phases[0].score;
    const evaluation = this.expressionEngine.generateComprehensiveEvaluation(scenario);
    
    return `
      <h2>${evaluation.result.split(' ')[0]} シナリオ${scenario.id}詳細 [${scenario.pattern.join('・')}]</h2>
      
      ${scenario.phases.map((phase, index) => {
        let phaseDescription = null;
        if (index > 0 && phase.data) {
          phaseDescription = this.expressionEngine.generatePhaseDescription(
            phase.data, 
            scenario.phases[index-1], 
            phase.action
          );
        }
        
        return `
        <div class="phase-detail">
          <h3>${phaseDescription?.icon || ''} ${phase.phase}</h3>
          ${phase.action ? `<p class="action">選択: ${phase.action}</p>` : ''}
          ${phase.data ? `
            <p><strong>${phase.data['卦名']} ${phase.data['爻']}</strong></p>
            <p>キーワード: ${phase.data['キーワード'].join('、')}</p>
            <p class="score-expression">
              ${phaseDescription?.scoreExpression || `スコア: ${phase.score}/100`}
              ${index > 0 ? ` (${phase.score >= scenario.phases[index-1].score ? '+' : ''}${phase.score - scenario.phases[index-1].score})` : ''}
            </p>
            <p class="interpretation">${phaseDescription?.description || phase.data['現代解釈の要約']}</p>
            ${phaseDescription?.guidance ? `<p class="guidance">💡 ${phaseDescription.guidance}</p>` : ''}
            ${phaseDescription?.prediction ? `<p class="prediction">🎯 ${phaseDescription.prediction}</p>` : ''}
          ` : ''}
        </div>
      `;}).join('<hr>')}
      
      <div class="summary">
        <h3>📊 総合評価</h3>
        <p><strong>評価結果:</strong> ${evaluation.result}</p>
        <p><strong>過程の特徴:</strong> ${evaluation.process}</p>
        <p><strong>難易度:</strong> ${evaluation.difficulty}</p>
        
        <h4>🎯 行動の流れ:</h4>
        <p>${evaluation.phaseDetails}</p>
        
        <h4>💡 HaQei分析の根拠:</h4>
        <p>${evaluation.logic}</p>
        
        <div class="prediction-summary">
          <h4>🔮 この道筋の予測:</h4>
          <p>${this.expressionEngine.generatePrediction(totalChange, scenario.pattern[0])}</p>
        </div>
      </div>
    `;
  }
}

// グローバルに公開
window.FutureSimulatorDisplay = FutureSimulatorDisplay;