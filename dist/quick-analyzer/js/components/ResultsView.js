/**
 * ResultsView - 診断結果表示コンポーネント
 * 八卦結果、詳細インサイト、チャート表示機能を提供
 */
class ResultsView extends BaseComponent {
  constructor(containerId, options = {}) {
    super(containerId, {
      showChart: true,
      showDetailedInsights: true,
      showActionButtons: true,
      enableSharing: false,
      chartType: 'radar',
      animateReveal: true,
      ...options
    });
    
    this.analysisResult = null;
    this.dataManager = null;
    this.calculator = null;
    this.storageManager = null;
    this.chart = null;
    
    // 結果表示設定
    this.RESULT_CONFIG = {
      revealDelay: 500,
      chartAnimationDuration: 1000,
      insightRevealStagger: 200,
      enablePrint: true,
      autoSave: true
    };
    
    // チャート設定
    this.CHART_CONFIG = {
      type: 'radar',
      responsive: true,
      maintainAspectRatio: true,
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      borderColor: 'rgb(99, 102, 241)',
      pointBackgroundColor: 'rgb(99, 102, 241)',
      gridColor: 'rgba(156, 163, 175, 0.3)'
    };
  }

  /**
   * デフォルトオプションを取得
   * @returns {Object}
   */
  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      showChart: true,
      showDetailedInsights: true,
      showActionButtons: true,
      enableSharing: false,
      chartType: 'radar',
      animateReveal: true,
      theme: 'default'
    };
  }

  /**
   * 初期化前処理
   * @returns {Promise<void>}
   */
  async beforeInit() {
    this.log('debug', 'beforeInit', 'Initializing ResultsView');
    
    // 依存関係の初期化
    await this.initializeDependencies();
  }

  /**
   * 依存関係を初期化
   * @returns {Promise<void>}
   */
  async initializeDependencies() {
    // DataManagerの取得（グローバルインスタンスを使用）
    if (window.quickAnalyzerApp && window.quickAnalyzerApp.dataManager) {
      this.dataManager = window.quickAnalyzerApp.dataManager;
    } else if (window.DataManager) {
      this.dataManager = new DataManager();
      if (!this.dataManager.isLoaded()) {
        await this.dataManager.init();
      }
    }
    
    // Calculatorの初期化
    if (window.Calculator) {
      this.calculator = new Calculator();
      if (!this.calculator.initialized) {
        await this.calculator.init();
      }
    }
    
    // StorageManagerの初期化
    if (window.StorageManager) {
      this.storageManager = new StorageManager('haqei_results_');
    }
  }

  /**
   * メインコンテンツをレンダリング
   * @returns {Promise<string>}
   */
  async renderContent() {
    if (!this.analysisResult) {
      return this.renderNoResultsMessage();
    }
    
    return `
      <div class="results-view" data-animate="true">
        ${this.renderResultsHeader()}
        ${this.renderPrimaryResult()}
        ${this.renderChartSection()}
        ${this.renderDetailedInsights()}
        ${this.renderActionButtons()}
      </div>
    `;
  }

  /**
   * 結果ヘッダーをレンダリング
   * @returns {string}
   */
  renderResultsHeader() {
    return `
      <div class="results-header">
        <h2 class="results-title">診断結果</h2>
        <div class="results-subtitle">
          あなたの八卦アバターが決定しました
        </div>
        <div class="confidence-indicator">
          <div class="confidence-level">
            信頼度: ${Math.round(this.analysisResult.confidence * 100)}%
          </div>
          <div class="confidence-description">
            ${this.analysisResult.insights.confidence.description}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 主要結果をレンダリング
   * @returns {string}
   */
  renderPrimaryResult() {
    const trigram = this.analysisResult.primaryTrigram;
    
    return `
      <div class="result-card primary-result" data-animate="true">
        <div class="result-content">
          <div class="result-intro">あなたの八卦アバターは...</div>
          
          <div class="trigram-name">${this.escapeHtml(trigram.name)}</div>
          
          <div class="avatar-name">【${this.escapeHtml(trigram.avatarName)}】</div>
          
          <div class="trigram-details">
            <div class="element-nature">
              <span class="element">${this.escapeHtml(trigram.element)}</span>
              <span class="separator">•</span>
              <span class="nature">${this.escapeHtml(trigram.nature)}</span>
            </div>
          </div>
          
          <div class="result-description">
            ${this.escapeHtml(trigram.description)}
          </div>
          
          ${this.renderCharacteristics(trigram)}
        </div>
      </div>
    `;
  }

  /**
   * 特徴リストをレンダリング
   * @param {Object} trigram - 八卦データ
   * @returns {string}
   */
  renderCharacteristics(trigram) {
    if (!trigram.characteristics || trigram.characteristics.length === 0) {
      return '';
    }
    
    return `
      <div class="characteristics-section">
        <h4 class="characteristics-title">主な特徴</h4>
        <div class="characteristics-list">
          ${trigram.characteristics.map((characteristic, index) => `
            <div class="characteristic-item" style="--index: ${index}">
              <span class="characteristic-icon">✦</span>
              <span class="characteristic-text">${this.escapeHtml(characteristic)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * チャートセクションをレンダリング
   * @returns {string}
   */
  renderChartSection() {
    if (!this.options.showChart) {
      return '';
    }
    
    return `
      <div class="chart-section" data-animate="true">
        <div class="chart-header">
          <h3 class="chart-title">八卦バランス分析</h3>
          <div class="chart-description">
            あなたの各八卦への適合度を表しています
          </div>
        </div>
        
        <div class="chart-container">
          <div class="chart-wrapper">
            <canvas id="results-chart" width="400" height="400"></canvas>
          </div>
          
          <div class="chart-legend">
            ${this.renderChartLegend()}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * チャート凡例をレンダリング
   * @returns {string}
   */
  renderChartLegend() {
    const trigrams = this.dataManager.getTrigrams();
    const scores = this.analysisResult.trigramScores;
    
    return Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4) // 上位4つを表示
      .map(([id, score]) => {
        const trigram = trigrams[id];
        const isPrimary = parseInt(id) === this.analysisResult.primaryTrigram.id;
        
        return `
          <div class="legend-item ${isPrimary ? 'primary' : ''}">
            <div class="legend-indicator"></div>
            <div class="legend-content">
              <div class="legend-name">${trigram.name}</div>
              <div class="legend-score">${Math.round(score * 100)}%</div>
            </div>
          </div>
        `;
      }).join('');
  }

  /**
   * 詳細インサイトをレンダリング
   * @returns {string}
   */
  renderDetailedInsights() {
    if (!this.options.showDetailedInsights) {
      return '';
    }
    
    const insights = this.analysisResult.insights;
    
    return `
      <div class="detailed-insights" data-animate="true">
        <h3 class="insights-title">詳細分析</h3>
        
        <div class="insights-grid">
          ${this.renderStrengthsSection(insights.basic.strengths)}
          ${this.renderChallengesSection(insights.basic.challenges)}
          ${this.renderPersonalizedInsights(insights.personalized)}
          ${this.renderActionRecommendations(insights.actions)}
        </div>
      </div>
    `;
  }

  /**
   * 強みセクションをレンダリング
   * @param {Array} strengths - 強み配列
   * @returns {string}
   */
  renderStrengthsSection(strengths) {
    if (!strengths || strengths.length === 0) return '';
    
    return `
      <div class="insight-section strengths-section">
        <h4 class="insight-title">
          <span class="insight-icon">💪</span>
          あなたの強み
        </h4>
        <div class="insight-list">
          ${strengths.map((strength, index) => `
            <div class="insight-item" style="--index: ${index}">
              <span class="insight-bullet">•</span>
              <span class="insight-text">${this.escapeHtml(strength)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * 課題セクションをレンダリング
   * @param {Array} challenges - 課題配列
   * @returns {string}
   */
  renderChallengesSection(challenges) {
    if (!challenges || challenges.length === 0) return '';
    
    return `
      <div class="insight-section challenges-section">
        <h4 class="insight-title">
          <span class="insight-icon">🎯</span>
          成長のポイント
        </h4>
        <div class="insight-list">
          ${challenges.map((challenge, index) => `
            <div class="insight-item" style="--index: ${index}">
              <span class="insight-bullet">•</span>
              <span class="insight-text">${this.escapeHtml(challenge)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * パーソナライズされたインサイトをレンダリング
   * @param {Object} personalized - パーソナライズドインサイト
   * @returns {string}
   */
  renderPersonalizedInsights(personalized) {
    if (!personalized) return '';
    
    return `
      <div class="insight-section personalized-section">
        <h4 class="insight-title">
          <span class="insight-icon">🌟</span>
          あなただけの特性
        </h4>
        
        ${personalized.balanceAnalysis ? `
          <div class="balance-analysis">
            <div class="balance-title">性格バランス</div>
            <div class="balance-description">
              ${this.escapeHtml(personalized.balanceAnalysis.interpretation)}
            </div>
            <div class="balance-stats">
              <div class="stat-item">
                <span class="stat-label">全体的な強さ</span>
                <span class="stat-value">${Math.round(personalized.balanceAnalysis.overall * 100)}%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">特性の多様性</span>
                <span class="stat-value">${Math.round(personalized.balanceAnalysis.diversity * 100)}%</span>
              </div>
            </div>
          </div>
        ` : ''}
        
        ${this.renderSecondaryInfluences(personalized.secondaryInfluences)}
      </div>
    `;
  }

  /**
   * 副次的影響をレンダリング
   * @param {Array} influences - 影響配列
   * @returns {string}
   */
  renderSecondaryInfluences(influences) {
    if (!influences || influences.length === 0) return '';
    
    return `
      <div class="secondary-influences">
        <div class="influences-title">副次的な特性</div>
        <div class="influences-list">
          ${influences.map((influence, index) => `
            <div class="influence-item" style="--index: ${index}">
              <div class="influence-name">${this.escapeHtml(influence.trigram.name)}</div>
              <div class="influence-level ${influence.influence}">${this.getInfluenceLabel(influence.influence)}</div>
              <div class="influence-score">${Math.round(influence.score * 100)}%</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * 影響レベルのラベルを取得
   * @param {string} level - 影響レベル
   * @returns {string}
   */
  getInfluenceLabel(level) {
    const labels = {
      strong: '強い影響',
      moderate: '中程度の影響',
      mild: '軽微な影響',
      weak: '微弱な影響'
    };
    return labels[level] || level;
  }

  /**
   * 行動推奨をレンダリング
   * @param {Object} actions - 行動推奨
   * @returns {string}
   */
  renderActionRecommendations(actions) {
    if (!actions) return '';
    
    return `
      <div class="insight-section actions-section">
        <h4 class="insight-title">
          <span class="insight-icon">🚀</span>
          おすすめの行動
        </h4>
        
        ${actions.immediate && actions.immediate.length > 0 ? `
          <div class="action-group">
            <h5 class="action-group-title">今すぐできること</h5>
            <div class="action-list immediate">
              ${actions.immediate.map((action, index) => `
                <div class="action-item" style="--index: ${index}">
                  <span class="action-priority">!</span>
                  <span class="action-text">${this.escapeHtml(action)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        ${actions.longTerm && actions.longTerm.length > 0 ? `
          <div class="action-group">
            <h5 class="action-group-title">長期的な取り組み</h5>
            <div class="action-list long-term">
              ${actions.longTerm.map((action, index) => `
                <div class="action-item" style="--index: ${index}">
                  <span class="action-priority">→</span>
                  <span class="action-text">${this.escapeHtml(action)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * アクションボタンをレンダリング
   * @returns {string}
   */
  renderActionButtons() {
    if (!this.options.showActionButtons) {
      return '';
    }
    
    return `
      <div class="action-buttons" data-animate="true">
        <button type="button" class="btn btn-primary" id="save-result-btn">
          📊 結果を保存
        </button>
        
        <button type="button" class="btn btn-secondary" id="retake-btn">
          🔄 もう一度診断する
        </button>
        
        <a href="../os_analyzer.html" class="btn btn-secondary">
          🔍 さらに詳しく分析する
        </a>
        
        ${this.options.enableSharing ? `
          <button type="button" class="btn btn-secondary" id="share-result-btn">
            📤 結果をシェア
          </button>
        ` : ''}
        
        ${this.RESULT_CONFIG.enablePrint ? `
          <button type="button" class="btn btn-secondary" id="print-result-btn">
            🖨️ 印刷
          </button>
        ` : ''}
      </div>
    `;
  }

  /**
   * 結果なしメッセージをレンダリング
   * @returns {string}
   */
  renderNoResultsMessage() {
    return `
      <div class="no-results-message">
        <h3>診断結果がありません</h3>
        <p>まずは質問に回答して診断を完了してください。</p>
        <button type="button" class="btn btn-primary" id="start-diagnosis-btn">
          診断を開始する
        </button>
      </div>
    `;
  }

  /**
   * レンダリング後処理
   * @returns {Promise<void>}
   */
  async afterRender() {
    // イベントリスナーの設定
    this.bindActionEvents();
    
    // チャートの描画
    if (this.options.showChart && this.analysisResult) {
      await this.renderChart();
    }
    
    // アニメーションの適用
    if (this.options.animateReveal) {
      this.applyRevealAnimations();
    }
    
    // 結果の自動保存
    if (this.RESULT_CONFIG.autoSave && this.analysisResult) {
      this.saveResult();
    }
  }

  /**
   * アクションイベントをバインド
   */
  bindActionEvents() {
    // 保存ボタン
    const saveBtn = this.$('#save-result-btn');
    if (saveBtn) {
      this.addEventListener(saveBtn, 'click', this.handleSaveResult);
    }
    
    // 再診断ボタン
    const retakeBtn = this.$('#retake-btn');
    if (retakeBtn) {
      this.addEventListener(retakeBtn, 'click', this.handleRetake);
    }
    
    // シェアボタン
    const shareBtn = this.$('#share-result-btn');
    if (shareBtn) {
      this.addEventListener(shareBtn, 'click', this.handleShare);
    }
    
    // 印刷ボタン
    const printBtn = this.$('#print-result-btn');
    if (printBtn) {
      this.addEventListener(printBtn, 'click', this.handlePrint);
    }
    
    // 診断開始ボタン
    const startBtn = this.$('#start-diagnosis-btn');
    if (startBtn) {
      this.addEventListener(startBtn, 'click', this.handleStartDiagnosis);
    }
  }

  /**
   * チャートを描画
   * @returns {Promise<void>}
   */
  async renderChart() {
    const canvas = this.$('#results-chart');
    if (!canvas || !window.Chart) {
      this.log('warn', 'renderChart', 'Chart.js not available or canvas not found');
      return;
    }
    
    try {
      const chartData = this.prepareChartData();
      const ctx = canvas.getContext('2d');
      
      // 既存のチャートを破棄
      if (this.chart) {
        this.chart.destroy();
      }
      
      this.chart = new Chart(ctx, {
        type: this.options.chartType,
        data: chartData,
        options: this.getChartOptions()
      });
      
      this.log('debug', 'renderChart', 'Chart rendered successfully');
      
    } catch (error) {
      this.handleError(error, 'renderChart');
    }
  }

  /**
   * チャートデータを準備
   * @returns {Object}
   */
  prepareChartData() {
    const trigrams = this.dataManager.getTrigrams();
    const scores = this.analysisResult.trigramScores;
    
    const labels = [];
    const data = [];
    
    // 八卦の順序で並べる
    for (let i = 1; i <= 8; i++) {
      const trigram = trigrams[i];
      if (trigram) {
        labels.push(trigram.name);
        data.push(Math.round(scores[i] * 100));
      }
    }
    
    return {
      labels: labels,
      datasets: [{
        label: '適合度 (%)',
        data: data,
        backgroundColor: this.CHART_CONFIG.backgroundColor,
        borderColor: this.CHART_CONFIG.borderColor,
        pointBackgroundColor: this.CHART_CONFIG.pointBackgroundColor,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    };
  }

  /**
   * チャートオプションを取得
   * @returns {Object}
   */
  getChartOptions() {
    return {
      responsive: this.CHART_CONFIG.responsive,
      maintainAspectRatio: this.CHART_CONFIG.maintainAspectRatio,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return `${context.label}: ${context.parsed.r}%`;
            }
          }
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 20,
            color: this.CHART_CONFIG.gridColor
          },
          grid: {
            color: this.CHART_CONFIG.gridColor
          },
          pointLabels: {
            font: {
              size: 12,
              weight: 'bold'
            },
            color: '#374151'
          }
        }
      },
      animation: {
        duration: this.CHART_CONFIG.chartAnimationDuration,
        easing: 'easeOutQuart'
      }
    };
  }

  /**
   * リビールアニメーションを適用
   */
  applyRevealAnimations() {
    const sections = this.$$('[data-animate="true"]');
    
    sections.forEach((section, index) => {
      setTimeout(() => {
        section.classList.add('animate-fadeIn');
      }, index * this.RESULT_CONFIG.insightRevealStagger);
    });
    
    // 特性アイテムの段階的表示
    const characteristics = this.$$('.characteristic-item');
    characteristics.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animate-slideInFromRight');
      }, this.RESULT_CONFIG.revealDelay + (index * 100));
    });
  }

  /**
   * 分析結果を設定
   * @param {Object} result - 分析結果
   */
  setAnalysisResult(result) {
    this.analysisResult = result;
    this.log('info', 'setAnalysisResult', 'Analysis result set', {
      primaryTrigram: result.primaryTrigram.name,
      confidence: result.confidence
    });
    
    // 再レンダリング
    this.render();
  }

  /**
   * 回答データから結果を計算して表示
   * @param {Object} answers - 回答データ
   * @returns {Promise<void>}
   */
  async calculateAndDisplayResult(answers) {
    try {
      if (!this.calculator) {
        throw new Error('Calculator not initialized');
      }
      
      this.log('info', 'calculateAndDisplayResult', 'Calculating result from answers');
      
      const result = this.calculator.calculateResult(answers);
      this.setAnalysisResult(result);
      
      // 計算完了イベントを発火
      this.emit('resultCalculated', {
        result,
        answers
      });
      
    } catch (error) {
      this.handleError(error, 'calculateAndDisplayResult');
      throw error;
    }
  }

  /**
   * 結果保存ハンドラー
   * @param {Event} event - クリックイベント
   */
  handleSaveResult(event) {
    event.preventDefault();
    this.saveResult();
    
    // 保存完了メッセージ
    this.showMessage('結果を保存しました！', 'success');
  }

  /**
   * 再診断ハンドラー
   * @param {Event} event - クリックイベント
   */
  handleRetake(event) {
    event.preventDefault();
    
    // 確認ダイアログ
    if (confirm('診断をやり直しますか？現在の結果は失われます。')) {
      this.emit('retakeRequested');
    }
  }

  /**
   * シェアハンドラー
   * @param {Event} event - クリックイベント
   */
  handleShare(event) {
    event.preventDefault();
    
    if (this.analysisResult) {
      const shareText = this.generateShareText();
      
      if (navigator.share) {
        navigator.share({
          title: 'HaQei 八卦診断結果',
          text: shareText,
          url: window.location.href
        });
      } else {
        // フォールバック: クリップボードにコピー
        navigator.clipboard.writeText(shareText).then(() => {
          this.showMessage('シェア用テキストをコピーしました！', 'success');
        });
      }
    }
  }

  /**
   * 印刷ハンドラー
   * @param {Event} event - クリックイベント
   */
  handlePrint(event) {
    event.preventDefault();
    
    // 印刷用のスタイルを適用
    document.body.classList.add('print-mode');
    
    // 印刷実行
    window.print();
    
    // 印刷用スタイルを削除
    setTimeout(() => {
      document.body.classList.remove('print-mode');
    }, 1000);
  }

  /**
   * 診断開始ハンドラー
   * @param {Event} event - クリックイベント
   */
  handleStartDiagnosis(event) {
    event.preventDefault();
    this.emit('startDiagnosisRequested');
  }

  /**
   * 結果を保存
   */
  saveResult() {
    if (!this.storageManager || !this.analysisResult) return;
    
    const saveData = {
      result: this.analysisResult,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    this.storageManager.save('latest_result', saveData, {
      expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30日間
    });
    
    this.log('info', 'saveResult', 'Result saved to storage');
  }

  /**
   * シェア用テキストを生成
   * @returns {string}
   */
  generateShareText() {
    const trigram = this.analysisResult.primaryTrigram;
    return `私の八卦アバターは「${trigram.name}」【${trigram.avatarName}】でした！\n\n${trigram.description}\n\n#HaQei #八卦診断`;
  }

  /**
   * メッセージを表示
   * @param {string} message - メッセージ
   * @param {string} type - タイプ
   */
  showMessage(message, type = 'info') {
    // 簡易的なメッセージ表示
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === 'success' ? '#10b981' : '#6366f1'};
      color: white;
      border-radius: 8px;
      z-index: 1000;
      animation: slideInFromRight 0.3s ease;
    `;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
      messageEl.remove();
    }, 3000);
  }

  /**
   * 現在の結果を取得
   * @returns {Object|null}
   */
  getCurrentResult() {
    return this.analysisResult;
  }

  /**
   * チャートを更新
   * @param {Object} newData - 新しいデータ
   */
  updateChart(newData) {
    if (this.chart) {
      this.chart.data = newData;
      this.chart.update();
    }
  }

  /**
   * コンポーネント破棄
   */
  destroy() {
    // チャートの破棄
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    
    super.destroy();
  }
}

// グローバルに公開
window.ResultsView = ResultsView;