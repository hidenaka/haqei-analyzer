// HaQei Analyzer - Results View Component
class ResultsView extends BaseComponent {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.analysisResult = null;
    this.insights = null;
  }

  get defaultOptions() {
    return {
      ...super.defaultOptions,
      onExploreMore: null,
      onRetakeTest: null,
    };
  }

  setData(analysisResult, insights) {
    this.analysisResult = analysisResult;
    this.insights = insights;
    this.render();
  }

  render() {
    if (!this.analysisResult) {
      this.container.innerHTML = `
        <div class="results-container">
          <div class="error">分析結果が見つかりません。</div>
        </div>
      `;
      return;
    }

    const primaryOS = this.analysisResult.primaryOS;
    const vector = this.analysisResult.eightDimensionVector;

    this.container.innerHTML = `
      <div class="results-container">
        <div class="results-header">
          <h2 class="results-title">🎯 あなたの人格OS</h2>
          <div class="primary-result">
            <div class="hexagram-display">
              <div class="hexagram-name">${primaryOS.hexagramInfo.name}</div>
              <div class="hexagram-reading">${
                primaryOS.hexagramInfo.reading || ""
              }</div>
              <div class="match-percentage">${primaryOS.matchPercentage.toFixed(
                1
              )}%</div>
              <div class="trigram-composition">構成八卦: ${this.getTrigramComposition(
                primaryOS
              )}</div>
            </div>
          </div>
        </div>

        <div class="results-content">
          <div class="dimension-chart">
            <h3>8次元バランス</h3>
            <div class="dimensions-grid">
              ${this.renderDimensionScores(vector)}
            </div>
          </div>

          <div class="insights-section">
            <h3>深い洞察</h3>
            <div class="insights-content">
              ${this.renderInsights()}
            </div>
          </div>

          <div class="alternative-matches">
            <h3>その他の可能性</h3>
            <div class="matches-list">
              ${this.renderAlternativeMatches()}
            </div>
          </div>
        </div>

        <div class="results-actions">
          <button id="explore-more-btn" class="btn btn-primary">
            💡 さらに詳しく探る
          </button>
          <button id="retake-test-btn" class="btn btn-secondary">
            🔄 もう一度診断する
          </button>
        </div>

        <div class="premium-section">
          <div class="premium-card">
            <div class="premium-header">
              <h3>🌟 プロフェッショナル戦略レポート</h3>
              <div class="premium-price">¥2,980</div>
            </div>
            <div class="premium-content">
              <p class="premium-description">
                あなたの<strong>${primaryOS.hexagramInfo.name}</strong>人格OSに特化した、
                Gemini Pro AIによる高精度な実践戦略レポートを取得しませんか？
              </p>
              
              <div class="premium-benefits">
                <h4>無料版との違い</h4>
                <div class="comparison-grid">
                  <div class="comparison-item">
                    <div class="free-feature">無料版: 「分析」</div>
                    <div class="premium-feature">有料版: 「実践戦略」</div>
                  </div>
                  <div class="comparison-item">
                    <div class="free-feature">無料版: 「知る」</div>
                    <div class="premium-feature">有料版: 「行動する」</div>
                  </div>
                  <div class="comparison-item">
                    <div class="free-feature">無料版: 「理解」</div>
                    <div class="premium-feature">有料版: 「変化」</div>
                  </div>
                </div>

                <div class="benefits-list">
                  <div class="benefit-item">
                    <span class="benefit-icon">📋</span>
                    <span class="benefit-text">具体的な行動計画（最初の三手）</span>
                  </div>
                  <div class="benefit-item">
                    <span class="benefit-icon">🛡️</span>
                    <span class="benefit-text">リスク管理戦略（守りの戦略）</span>
                  </div>
                  <div class="benefit-item">
                    <span class="benefit-icon">📈</span>
                    <span class="benefit-text">3ヶ月実行ロードマップ</span>
                  </div>
                  <div class="benefit-item">
                    <span class="benefit-icon">🤝</span>
                    <span class="benefit-text">6ヶ月継続サポートシステム</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="premium-actions">
              <button id="upgrade-to-premium-btn" class="btn btn-premium">
                🚀 プロフェッショナルレポートを取得する
              </button>
              <div class="premium-note">
                診断結果は自動的に引き継がれます
              </div>
            </div>
          </div>
        </div>

        <div class="data-management-section">
          <div class="data-card">
            <h3>📊 診断データの管理</h3>
            <p>あなたの診断結果を保存・エクスポートして、他のツールでも活用できます。</p>
            
            <div class="data-actions">
              <button id="export-json-btn" class="btn btn-outline">
                📄 JSON形式でエクスポート
              </button>
              <button id="export-summary-btn" class="btn btn-outline">
                📝 サマリーをエクスポート
              </button>
              <button id="view-insights-btn" class="btn btn-outline">
                🔍 詳細洞察を表示
              </button>
            </div>
            
            <div class="cross-platform-info">
              <h4>他のHaQeiツールとの連携</h4>
              <div class="platform-links">
                <a href="future_simulator.html" class="platform-link">
                  🔮 未来分岐シミュレーター
                </a>
                <a href="cockpit.html" class="platform-link">
                  🎛️ 戦略コックピット
                </a>
                <a href="library.html" class="platform-link">
                  📚 HaQeiライブラリ
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderDimensionScores(vector) {
    const dimensions = [
      { key: "乾_創造性", name: "創造性", icon: "🌟" },
      { key: "震_行動性", name: "行動性", icon: "⚡" },
      { key: "坎_探求性", name: "探求性", icon: "🔍" },
      { key: "艮_安定性", name: "安定性", icon: "🗻" },
      { key: "坤_受容性", name: "受容性", icon: "🌍" },
      { key: "巽_適応性", name: "適応性", icon: "🌊" },
      { key: "離_表現性", name: "表現性", icon: "🔥" },
      { key: "兌_調和性", name: "調和性", icon: "☯️" },
    ];

    return dimensions
      .map((dim) => {
        const score = vector[dim.key] || 0;
        const percentage = Math.max(0, Math.min(100, (score + 5) * 10)); // -5〜+5を0〜100%に変換

        return `
        <div class="dimension-item">
          <div class="dimension-header">
            <span class="dimension-icon">${dim.icon}</span>
            <span class="dimension-name">${dim.name}</span>
            <span class="dimension-score">${score.toFixed(1)}</span>
          </div>
          <div class="dimension-bar">
            <div class="dimension-fill" style="width: ${percentage}%"></div>
          </div>
        </div>
      `;
      })
      .join("");
  }

  renderInsights() {
    if (!this.insights) {
      return "<p>洞察を生成中...</p>";
    }

    return `
      <div class="insight-summary">
        <h4>🎯 総合的な洞察</h4>
        <p>${this.insights.summary}</p>
      </div>
      
      <div class="insight-details">
        <h4>🔍 詳細な特徴</h4>
        <ul>
          ${
            this.insights.details
              ?.map((detail) => `<li>${detail}</li>`)
              .join("") || "<li>詳細な洞察を生成中...</li>"
          }
        </ul>
      </div>
      
      <div class="insight-recommendations">
        <h4>💡 おすすめのアクション</h4>
        <ul>
          ${
            this.insights.recommendations
              ?.map((rec) => `<li>${rec}</li>`)
              .join("") || "<li>推奨事項を生成中...</li>"
          }
        </ul>
      </div>
    `;
  }

  renderAlternativeMatches() {
    if (
      !this.analysisResult.alternativeMatches ||
      this.analysisResult.alternativeMatches.length === 0
    ) {
      return "<p>その他のマッチングを計算中...</p>";
    }

    return this.analysisResult.alternativeMatches
      .map(
        (match, index) => `
      <div class="alternative-match">
        <div class="match-rank">${index + 2}</div>
        <div class="match-info">
          <div class="match-name">${match.hexagramInfo.name}</div>
          <div class="match-percentage">${match.matchPercentage.toFixed(
            1
          )}%</div>
        </div>
      </div>
    `
      )
      .join("");
  }

  bindEvents() {
    const exploreMoreBtn = this.container.querySelector("#explore-more-btn");
    const retakeTestBtn = this.container.querySelector("#retake-test-btn");
    const upgradeToPremiumBtn = this.container.querySelector("#upgrade-to-premium-btn");
    const exportJsonBtn = this.container.querySelector("#export-json-btn");
    const exportSummaryBtn = this.container.querySelector("#export-summary-btn");
    const viewInsightsBtn = this.container.querySelector("#view-insights-btn");

    if (exploreMoreBtn) {
      exploreMoreBtn.addEventListener("click", () => {
        if (this.options.onExploreMore) {
          this.options.onExploreMore(this.analysisResult);
        }
      });
    }

    if (retakeTestBtn) {
      retakeTestBtn.addEventListener("click", () => {
        if (this.options.onRetakeTest) {
          this.options.onRetakeTest();
        } else {
          // デフォルトの処理: ページリロード
          window.location.reload();
        }
      });
    }

    // プレミアム版アップグレード
    if (upgradeToPremiumBtn) {
      upgradeToPremiumBtn.addEventListener("click", () => {
        this.handlePremiumUpgrade();
      });
    }

    // データエクスポート機能
    if (exportJsonBtn) {
      exportJsonBtn.addEventListener("click", () => {
        this.handleDataExport('json');
      });
    }

    if (exportSummaryBtn) {
      exportSummaryBtn.addEventListener("click", () => {
        this.handleDataExport('summary');
      });
    }

    // 詳細洞察表示
    if (viewInsightsBtn) {
      viewInsightsBtn.addEventListener("click", () => {
        this.showDetailedInsights();
      });
    }
  }

  // プレミアム版アップグレードの処理
  async handlePremiumUpgrade() {
    try {
      console.log('🚀 Initiating premium upgrade...');

      // CrossPlatformBridgeを使用してデータを準備
      if (typeof window !== 'undefined' && window.CrossPlatformBridge) {
        const bridge = new window.CrossPlatformBridge();
        
        // 現在の分析結果を使用して統一フォーマットデータを作成
        const rawAnswers = this.getRawAnswers();
        const completionResult = await bridge.completeDiagnosis(
          this.analysisResult, 
          rawAnswers,
          { source: 'os_analyzer_premium_upgrade' }
        );

        if (completionResult.success) {
          // プロフェッショナルレポート用のデータを準備
          const professionalData = bridge.prepareProfessionalReportData();
          
          if (professionalData.success) {
            // professional_report.htmlに遷移
            window.location.href = 'professional_report.html';
          } else {
            throw new Error('プロフェッショナルレポートデータの準備に失敗しました');
          }
        } else {
          throw new Error('診断データの準備に失敗しました');
        }
      } else {
        // フォールバック: 直接遷移
        console.warn('⚠️ CrossPlatformBridge not available, using fallback');
        window.location.href = 'professional_report.html';
      }

    } catch (error) {
      console.error('❌ Premium upgrade failed:', error);
      alert('プレミアム版へのアップグレードに失敗しました。もう一度お試しください。');
    }
  }

  // データエクスポートの処理
  async handleDataExport(format) {
    try {
      console.log(`📤 Exporting data in ${format} format...`);

      if (typeof window !== 'undefined' && window.CrossPlatformBridge) {
        const bridge = new window.CrossPlatformBridge();
        
        // 現在の分析結果を統一フォーマットで保存
        const rawAnswers = this.getRawAnswers();
        const completionResult = await bridge.completeDiagnosis(
          this.analysisResult, 
          rawAnswers,
          { source: 'os_analyzer_export' }
        );

        if (completionResult.success) {
          // データをエクスポート
          const exportResult = await bridge.exportDiagnosisData(format);
          
          if (exportResult.success) {
            // ファイルとしてダウンロード
            this.downloadFile(exportResult.data, exportResult.filename, format);
            
            // 成功メッセージ
            this.showNotification(
              `✅ ${format.toUpperCase()}形式でのエクスポートが完了しました。`,
              'success'
            );
          } else {
            throw new Error('エクスポートに失敗しました');
          }
        } else {
          throw new Error('診断データの準備に失敗しました');
        }
      } else {
        // フォールバック: 簡易エクスポート
        console.warn('⚠️ CrossPlatformBridge not available, using fallback');
        this.fallbackExport(format);
      }

    } catch (error) {
      console.error('❌ Data export failed:', error);
      this.showNotification(
        `❌ データのエクスポートに失敗しました: ${error.message}`,
        'error'
      );
    }
  }

  // ファイルダウンロード
  downloadFile(data, filename, format) {
    try {
      const mimeTypes = {
        json: 'application/json',
        summary: 'text/plain',
        csv: 'text/csv'
      };

      const blob = new Blob([data], { type: mimeTypes[format] || 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('❌ File download failed:', error);
      this.showNotification('ファイルのダウンロードに失敗しました', 'error');
    }
  }

  // フォールバックエクスポート
  fallbackExport(format) {
    try {
      let data, filename;
      const timestamp = new Date().toISOString().slice(0, 10);

      if (format === 'json') {
        data = JSON.stringify(this.analysisResult, null, 2);
        filename = `haqei_analysis_${timestamp}.json`;
      } else {
        data = this.generateSimpleSummary();
        filename = `haqei_summary_${timestamp}.txt`;
      }

      this.downloadFile(data, filename, format);
      this.showNotification('エクスポートが完了しました（簡易版）', 'success');

    } catch (error) {
      console.error('❌ Fallback export failed:', error);
      this.showNotification('エクスポートに失敗しました', 'error');
    }
  }

  // 簡易サマリー生成
  generateSimpleSummary() {
    const primaryOS = this.analysisResult.primaryOS;
    const vector = this.analysisResult.eightDimensionVector;

    let summary = '=== HaQei OS分析結果 ===\n';
    summary += `生成日時: ${new Date().toLocaleString('ja-JP')}\n\n`;
    summary += `主要人格OS: ${primaryOS.hexagramInfo.name}\n`;
    summary += `適合度: ${primaryOS.matchPercentage.toFixed(1)}%\n\n`;
    
    summary += '--- 8次元バランス ---\n';
    Object.entries(vector).forEach(([key, value]) => {
      const dimensionName = key.split('_')[1] || key;
      summary += `${dimensionName}: ${(value * 100).toFixed(1)}%\n`;
    });
    
    summary += '\n=== レポート終了 ===\n';
    summary += 'このデータは HaQei OS分析ツールで生成されました。\n';

    return summary;
  }

  // 詳細洞察の表示
  showDetailedInsights() {
    try {
      // モーダルまたは新しいセクションで詳細洞察を表示
      const insightsModal = document.createElement('div');
      insightsModal.className = 'insights-modal';
      insightsModal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()">
          <div class="modal-content" onclick="event.stopPropagation()">
            <div class="modal-header">
              <h3>🔍 詳細洞察</h3>
              <button class="modal-close" onclick="this.closest('.insights-modal').remove()">×</button>
            </div>
            <div class="modal-body">
              ${this.generateDetailedInsights()}
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary" onclick="this.closest('.insights-modal').remove()">
                閉じる
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(insightsModal);

    } catch (error) {
      console.error('❌ Failed to show detailed insights:', error);
      this.showNotification('詳細洞察の表示に失敗しました', 'error');
    }
  }

  // 詳細洞察の生成
  generateDetailedInsights() {
    const primaryOS = this.analysisResult.primaryOS;
    const vector = this.analysisResult.eightDimensionVector;

    let insights = '<div class="detailed-insights">';
    
    // 人格OS詳細
    insights += `
      <div class="insight-section">
        <h4>🎯 主要人格OS：${primaryOS.hexagramInfo.name}</h4>
        <p><strong>適合度：</strong>${primaryOS.matchPercentage.toFixed(1)}%</p>
        <p><strong>特徴：</strong>${primaryOS.hexagramInfo.description || '詳細分析中...'}</p>
      </div>
    `;

    // 8次元分析
    insights += `
      <div class="insight-section">
        <h4>📊 8次元バランス詳細</h4>
        <div class="dimensions-detailed">
    `;

    Object.entries(vector).forEach(([key, value]) => {
      const percentage = (value * 100).toFixed(1);
      const dimensionName = key.split('_')[1] || key;
      const strength = value > 0.7 ? '強い' : value > 0.4 ? '中程度' : '弱い';
      
      insights += `
        <div class="dimension-detail">
          <strong>${dimensionName}：</strong>${percentage}% （${strength}）
        </div>
      `;
    });

    insights += '</div></div>';

    // 戦略的提案
    insights += `
      <div class="insight-section">
        <h4>💡 戦略的提案</h4>
        <p>より具体的な戦略と行動計画については、プロフェッショナルレポートをご利用ください。</p>
        <ul>
          <li>あなたの${primaryOS.hexagramInfo.name}特性を活かした具体的行動計画</li>
          <li>リスク管理と防御戦略</li>
          <li>3ヶ月実行ロードマップ</li>
        </ul>
      </div>
    `;

    insights += '</div>';
    return insights;
  }

  // 回答データの取得（ヘルパーメソッド）
  getRawAnswers() {
    // StorageManagerから回答データを取得
    try {
      if (typeof window !== 'undefined' && window.StorageManager) {
        const storage = new window.StorageManager();
        return storage.getAnswers() || [];
      }
      return [];
    } catch (error) {
      console.warn('⚠️ Failed to get raw answers:', error);
      return [];
    }
  }

  // 通知表示
  showNotification(message, type = 'info') {
    try {
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      `;

      document.body.appendChild(notification);

      // 3秒後に自動削除
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);

    } catch (error) {
      console.error('❌ Failed to show notification:', error);
    }
  }

  // 🔧 trigramComposition安全取得メソッド
  getTrigramComposition(osData) {
    // 既存のtrigramCompositionがあればそれを使用
    if (osData.trigramComposition) {
      return osData.trigramComposition;
    }
    // hexagramInfoから生成
    if (osData.hexagramInfo) {
      const upperTrigram = this.getTrigramName(
        osData.hexagramInfo.upper_trigram_id
      );
      const lowerTrigram = this.getTrigramName(
        osData.hexagramInfo.lower_trigram_id
      );
      return `${upperTrigram} + ${lowerTrigram}`;
    }
    // フォールバック
    return "乾 + 乾";
  }

  // 🔧 八卦名取得ヘルパー
  getTrigramName(trigramId) {
    const trigramNames = {
      1: "乾",
      2: "兌",
      3: "離",
      4: "震",
      5: "巽",
      6: "坎",
      7: "艮",
      8: "坤",
    };
    return trigramNames[trigramId] || "乾";
  }
}
