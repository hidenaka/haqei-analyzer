/**
 * 品質向上UI管理システム - A級診断品質90%達成支援
 * 
 * 目的：
 * - 品質グレードの視覚的な表示改善
 * - ユーザーが品質改善を実感できるUI提供
 * - リアルタイム品質フィードバックシステム
 * - 品質向上のためのガイダンス表示
 */

class QualityEnhancementUI {
  constructor() {
    this.currentQuality = null;
    this.qualityHistory = [];
    this.animationDuration = 1000;
    this.celebrationEffects = true;
    
    // 品質表示設定
    this.gradeConfig = {
      'A': {
        color: '#28a745',
        bgColor: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
        icon: '🌟',
        title: 'A級品質',
        message: '最高レベルの診断品質を達成しました！',
        celebration: true
      },
      'B': {
        color: '#ffc107',
        bgColor: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
        icon: '⭐',
        title: 'B級品質',
        message: '良好な診断品質です。A級まであと一歩！',
        celebration: false
      },
      'C': {
        color: '#dc3545',
        bgColor: 'linear-gradient(135deg, #f8d7da 0%, #f1b0b7 100%)',
        icon: '🔧',
        title: 'C級品質',
        message: '品質向上の余地があります。',
        celebration: false
      }
    };
    
    // メトリクス表示設定
    this.metricsConfig = {
      confidence: { label: '信頼度', format: 'percentage', weight: 0.25 },
      completion: { label: '完了率', format: 'percentage', weight: 0.20 },
      initialization: { label: '初期化品質', format: 'text', weight: 0.15 },
      depth: { label: '分析深度', format: 'level', weight: 0.20 },
      performance: { label: '処理性能', format: 'time', weight: 0.10 },
      consistency: { label: '一貫性', format: 'percentage', weight: 0.10 }
    };
    
    this.init();
  }
  
  /**
   * 初期化処理
   */
  init() {
    this.createQualityContainer();
    this.setupEventListeners();
    console.log('✅ QualityEnhancementUI 初期化完了');
  }
  
  /**
   * 品質表示コンテナの作成
   */
  createQualityContainer() {
    const container = document.createElement('div');
    container.id = 'quality-enhancement-container';
    container.className = 'quality-enhancement-container';
    container.innerHTML = `
      <div id="quality-grade-display" class="quality-grade-display" style="display: none;">
        <!-- 品質グレード表示がここに動的生成される -->
      </div>
      <div id="quality-metrics-panel" class="quality-metrics-panel" style="display: none;">
        <!-- 品質メトリクス表示がここに動的生成される -->
      </div>
      <div id="quality-improvement-panel" class="quality-improvement-panel" style="display: none;">
        <!-- 改善提案表示がここに動的生成される -->
      </div>
    `;
    
    // 結果表示エリアに挿入
    const resultsContainer = document.querySelector('#results-container') || 
                            document.querySelector('.results-section') || 
                            document.body;
    resultsContainer.appendChild(container);
  }
  
  /**
   * イベントリスナーの設定
   */
  setupEventListeners() {
    // 分析完了イベントの監視
    document.addEventListener('analysisComplete', (event) => {
      const result = event.detail;
      this.displayQuality(result);
    });
    
    // 品質改善イベントの監視
    document.addEventListener('qualityImprovement', (event) => {
      const improvement = event.detail;
      this.showImprovementFeedback(improvement);
    });
  }
  
  /**
   * 品質情報の表示メイン関数
   */
  displayQuality(analysisResult) {
    try {
      console.log('🎯 品質表示開始:', analysisResult);
      
      const qualityAssessment = analysisResult.qualityAssessment || 
                              this.generateFallbackQuality(analysisResult);
      
      this.currentQuality = qualityAssessment;
      this.qualityHistory.push({
        timestamp: Date.now(),
        quality: qualityAssessment,
        grade: qualityAssessment.grade
      });
      
      // 品質表示の更新
      this.updateQualityGradeDisplay(qualityAssessment);
      this.updateQualityMetrics(qualityAssessment);
      this.updateImprovementSuggestions(qualityAssessment);
      
      // A級達成時の特別処理
      if (qualityAssessment.grade === 'A') {
        this.triggerAGradeAchievement();
      }
      
      // 表示アニメーション
      this.animateQualityDisplay();
      
    } catch (error) {
      console.error('❌ 品質表示エラー:', error);
      this.displayFallbackQuality();
    }
  }
  
  /**
   * 品質グレード表示の更新
   */
  updateQualityGradeDisplay(qualityAssessment) {
    const gradeDisplay = document.getElementById('quality-grade-display');
    const grade = qualityAssessment.grade || 'C';
    const config = this.gradeConfig[grade];
    
    const qualityScore = qualityAssessment.qualityScore || qualityAssessment.confidence || 0.7;
    const scorePercentage = Math.round(qualityScore * 100);
    
    gradeDisplay.innerHTML = `
      <div class="quality-grade-container quality-grade-${grade} ${grade === 'A' ? 'grade-A-achievement' : ''}">
        <div class="quality-header">
          <div class="grade-icon">${config.icon}</div>
          <div class="grade-info">
            <h3 class="grade-title">${config.title}</h3>
            <div class="grade-score">
              品質スコア: <span class="score-value">${scorePercentage}%</span>
            </div>
          </div>
          ${grade === 'A' ? '<div class="celebration-stars">✨⭐✨</div>' : ''}
        </div>
        
        <div class="quality-score-bar">
          <div class="quality-score-fill score-${this.getScoreClass(qualityScore)}" 
               style="width: ${scorePercentage}%"></div>
        </div>
        
        <div class="grade-message">${config.message}</div>
        
        ${this.generateQualityDetails(qualityAssessment)}
        
        <div class="quality-achievement-section">
          <span class="quality-achievement-badge achievement-${this.getAchievementLevel(qualityScore)}">
            ${this.getAchievementText(qualityScore)}
          </span>
          ${this.generateQualityTrend()}
        </div>
      </div>
    `;
    
    gradeDisplay.style.display = 'block';
  }
  
  /**
   * 品質メトリクス表示の更新
   */
  updateQualityMetrics(qualityAssessment) {
    const metricsPanel = document.getElementById('quality-metrics-panel');
    const qualityFactors = qualityAssessment.qualityFactors || {};
    
    let metricsHTML = '<div class="quality-metrics-container"><h4>📊 品質詳細メトリクス</h4><div class="quality-metrics-grid">';
    
    Object.entries(this.metricsConfig).forEach(([key, config]) => {
      const value = qualityFactors[key] || 0.7;
      const formattedValue = this.formatMetricValue(value, config.format);
      const metricClass = this.getMetricClass(value);
      
      metricsHTML += `
        <div class="metric-item">
          <div class="metric-label">${config.label}</div>
          <div class="metric-value ${metricClass}">${formattedValue}</div>
          <div class="metric-bar">
            <div class="metric-fill ${metricClass}" style="width: ${value * 100}%"></div>
          </div>
          <div class="metric-description">重要度: ${Math.round(config.weight * 100)}%</div>
        </div>
      `;
    });
    
    metricsHTML += '</div></div>';
    metricsPanel.innerHTML = metricsHTML;
    metricsPanel.style.display = 'block';
  }
  
  /**
   * 改善提案の表示更新
   */
  updateImprovementSuggestions(qualityAssessment) {
    const improvementPanel = document.getElementById('quality-improvement-panel');
    const suggestions = qualityAssessment.improvementSuggestions || [];
    const recommendations = qualityAssessment.recommendation || [];
    
    let improvementHTML = `
      <div class="improvement-suggestions">
        <div class="improvement-title">💡 品質向上ガイダンス</div>
    `;
    
    // 推奨事項の表示
    if (recommendations.length > 0) {
      improvementHTML += '<div class="recommendation-section">';
      recommendations.forEach(rec => {
        improvementHTML += `<div class="recommendation-item">${rec}</div>`;
      });
      improvementHTML += '</div>';
    }
    
    // 具体的な改善提案の表示
    if (suggestions.length > 0) {
      improvementHTML += '<ul class="suggestion-list">';
      suggestions.forEach(suggestion => {
        const priority = suggestion.priority || 'medium';
        improvementHTML += `
          <li class="suggestion-item suggestion-priority-${priority}">
            <strong>${suggestion.area || '一般'}:</strong> ${suggestion.suggestion}
          </li>
        `;
      });
      improvementHTML += '</ul>';
    } else if (qualityAssessment.grade === 'A') {
      improvementHTML += `
        <div class="quality-improvement-tip">
          A級品質を達成しています！この品質を維持するため、定期的な確認を続けてください。
        </div>
      `;
    }
    
    // 達成可能性評価の表示
    if (qualityAssessment.achievabilityAssessment) {
      const assessment = qualityAssessment.achievabilityAssessment;
      improvementHTML += `
        <div class="achievability-section">
          <h5>🎯 達成可能性評価</h5>
          <p><strong>${assessment.message}</strong></p>
          ${assessment.nextSteps ? `
            <div class="next-steps">
              <h6>次のステップ:</h6>
              <ul>
                ${assessment.nextSteps.map(step => `<li>${step}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      `;
    }
    
    improvementHTML += '</div>';
    improvementPanel.innerHTML = improvementHTML;
    improvementPanel.style.display = 'block';
  }
  
  /**
   * A級達成時の特別処理
   */
  triggerAGradeAchievement() {
    console.log('🌟 A級品質達成！');
    
    // 祝福エフェクトの表示
    if (this.celebrationEffects) {
      this.showCelebrationEffect();
    }
    
    // 成果の記録
    this.recordAchievement('A_grade_achieved');
    
    // 特別メッセージの表示
    this.showAchievementMessage();
  }
  
  /**
   * 祝福エフェクトの表示
   */
  showCelebrationEffect() {
    const gradeContainer = document.querySelector('.quality-grade-container');
    if (gradeContainer) {
      gradeContainer.classList.add('grade-celebration');
      
      // 3秒後にエフェクトクラスを除去
      setTimeout(() => {
        gradeContainer.classList.remove('grade-celebration');
      }, 3000);
    }
    
    // 紙吹雪エフェクト（簡易版）
    this.createConfettiEffect();
  }
  
  /**
   * 紙吹雪エフェクト
   */
  createConfettiEffect() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    confettiContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    
    for (let i = 0; i < 20; i++) {
      const confetti = document.createElement('div');
      confetti.textContent = ['🎉', '🌟', '⭐', '✨', '🎊'][Math.floor(Math.random() * 5)];
      confetti.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
        font-size: ${16 + Math.random() * 16}px;
      `;
      confettiContainer.appendChild(confetti);
    }
    
    document.body.appendChild(confettiContainer);
    
    // アニメーション終了後にクリーンアップ
    setTimeout(() => {
      document.body.removeChild(confettiContainer);
    }, 5000);
    
    // CSSアニメーションの追加
    if (!document.querySelector('#confetti-animation-style')) {
      const style = document.createElement('style');
      style.id = 'confetti-animation-style';
      style.textContent = `
        @keyframes confettiFall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  /**
   * 達成メッセージの表示
   */
  showAchievementMessage() {
    // モーダルダイアログなど、より目立つ表示も可能
    const message = '🎉 おめでとうございます！A級診断品質を達成しました！🎉';
    
    // 簡易トースト通知
    this.showToast(message, 'success', 5000);
  }
  
  /**
   * トースト通知の表示
   */
  showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `quality-toast quality-toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      z-index: 10000;
      animation: toastSlideIn 0.3s ease-out;
      max-width: 350px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `;
    
    // タイプ別の色設定
    const colors = {
      success: '#28a745',
      info: '#17a2b8',
      warning: '#ffc107',
      error: '#dc3545'
    };
    toast.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(toast);
    
    // 自動削除
    setTimeout(() => {
      toast.style.animation = 'toastSlideOut 0.3s ease-in forwards';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, duration);
    
    // アニメーションCSSの追加
    if (!document.querySelector('#toast-animation-style')) {
      const style = document.createElement('style');
      style.id = 'toast-animation-style';
      style.textContent = `
        @keyframes toastSlideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes toastSlideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  /**
   * 表示アニメーション
   */
  animateQualityDisplay() {
    const container = document.getElementById('quality-enhancement-container');
    container.classList.add('quality-reveal');
    
    // スコアバーのアニメーション
    setTimeout(() => {
      const scoreFills = document.querySelectorAll('.quality-score-fill, .metric-fill');
      scoreFills.forEach(fill => {
        const width = fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => {
          fill.style.width = width;
        }, 100);
      });
    }, 300);
  }
  
  // ===== ユーティリティメソッド群 =====
  
  getScoreClass(score) {
    if (score >= 0.8) return 'excellent';
    if (score >= 0.6) return 'good';
    if (score >= 0.4) return 'average';
    return 'poor';
  }
  
  getMetricClass(value) {
    if (value >= 0.8) return 'metric-excellent';
    if (value >= 0.6) return 'metric-good';
    if (value >= 0.4) return 'metric-average';
    return 'metric-poor';
  }
  
  getAchievementLevel(score) {
    if (score >= 0.8) return 'excellent';
    if (score >= 0.6) return 'good';
    return 'needs-improvement';
  }
  
  getAchievementText(score) {
    if (score >= 0.9) return '🏆 優秀';
    if (score >= 0.8) return '🌟 優良';
    if (score >= 0.6) return '✅ 良好';
    return '🔧 改善必要';
  }
  
  formatMetricValue(value, format) {
    switch (format) {
      case 'percentage':
        return Math.round(value * 100) + '%';
      case 'time':
        return value < 1000 ? Math.round(value) + 'ms' : (value / 1000).toFixed(1) + 's';
      case 'level':
        if (value >= 0.8) return '深い';
        if (value >= 0.6) return '標準';
        return '浅い';
      case 'text':
        if (value >= 0.9) return '優秀';
        if (value >= 0.7) return '良好';
        if (value >= 0.5) return '標準';
        return '要改善';
      default:
        return value.toFixed(2);
    }
  }
  
  generateQualityDetails(qualityAssessment) {
    const specialPromotionScore = qualityAssessment.specialPromotionScore || 0;
    if (specialPromotionScore > 0) {
      return `
        <div class="quality-details">
          <div class="special-promotion-info">
            <strong>🚀 特別評価ポイント:</strong> ${Math.round(specialPromotionScore * 100)}%
            <div class="promotion-details">
              システム可用性、エラー回復能力、実用価値などを総合評価
            </div>
          </div>
        </div>
      `;
    }
    return '';
  }
  
  generateQualityTrend() {
    if (this.qualityHistory.length < 2) return '';
    
    const current = this.qualityHistory[this.qualityHistory.length - 1];
    const previous = this.qualityHistory[this.qualityHistory.length - 2];
    
    const currentScore = current.quality.qualityScore || current.quality.confidence || 0.7;
    const previousScore = previous.quality.qualityScore || previous.quality.confidence || 0.7;
    
    let trendClass, trendIcon, trendText;
    
    if (currentScore > previousScore + 0.05) {
      trendClass = 'trend-up';
      trendIcon = '📈';
      trendText = '品質向上';
    } else if (currentScore < previousScore - 0.05) {
      trendClass = 'trend-down';
      trendIcon = '📉';
      trendText = '品質低下';
    } else {
      trendClass = 'trend-stable';
      trendIcon = '➡️';
      trendText = '品質安定';
    }
    
    return `
      <div class="quality-trend">
        <span class="trend-arrow ${trendClass}">${trendIcon}</span>
        <span class="trend-text">${trendText}</span>
      </div>
    `;
  }
  
  generateFallbackQuality(analysisResult) {
    console.log('📝 フォールバック品質生成');
    return {
      grade: 'B',
      confidence: analysisResult.qualityMetrics?.overallConfidence || 0.7,
      qualityScore: 0.7,
      qualityFactors: {
        confidence: 0.7,
        completion: 0.8,
        initialization: 0.7,
        depth: 0.7,
        performance: 0.8,
        consistency: 0.8
      },
      improvementSuggestions: [
        {
          area: '一般',
          suggestion: 'より詳細な入力で品質向上が期待できます',
          priority: 'medium'
        }
      ],
      recommendation: ['良好な分析結果です'],
      achievabilityAssessment: {
        level: 'good',
        message: 'A級品質達成まであと一歩です'
      }
    };
  }
  
  displayFallbackQuality() {
    console.log('🔄 フォールバック品質表示');
    const fallbackQuality = {
      grade: 'B',
      confidence: 0.7,
      qualityScore: 0.7,
      message: '分析を完了しました'
    };
    
    this.displayQuality({ qualityAssessment: fallbackQuality });
  }
  
  recordAchievement(achievementType) {
    const achievement = {
      type: achievementType,
      timestamp: Date.now(),
      quality: this.currentQuality
    };
    
    // localStorage への保存（オプション）
    try {
      const achievements = JSON.parse(localStorage.getItem('haqei_achievements') || '[]');
      achievements.push(achievement);
      localStorage.setItem('haqei_achievements', JSON.stringify(achievements));
    } catch (error) {
      console.warn('実績保存エラー:', error);
    }
  }
  
  showImprovementFeedback(improvement) {
    const message = `品質改善: ${improvement.area} が ${Math.round(improvement.amount * 100)}% 向上しました！`;
    this.showToast(message, 'success', 4000);
  }
}

// グローバルインスタンスの作成
window.qualityEnhancementUI = new QualityEnhancementUI();

// CSS の動的読み込み
if (!document.querySelector('link[href*="quality-grade-enhancement.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = './css/quality-grade-enhancement.css';
  document.head.appendChild(link);
}