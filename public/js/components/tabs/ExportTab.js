/**
 * ExportTab.js
 * HAQEI タブナビゲーションシステム - エクスポートタブ
 * 
 * 機能:
 * - 分析結果のエクスポート（PDF、JSON、CSV）
 * - カスタムレポート生成
 * - データ共有とリンク生成
 * - 印刷用フォーマット
 * - クラウド保存連携
 */

class ExportTab extends BaseTabView {
    constructor(tabId) {
        super(tabId);
        this.analysisData = null;
        this.exportFormats = ['pdf', 'json', 'csv', 'html'];
        this.reportTemplates = [];
        this.exportHistory = [];
        this.isExporting = false;
    }

    /**
     * タブコンテンツの初期化
     */
    init() {
        this.initializeReportTemplates();
        this.loadExportHistory();
        this.bindEvents();
    }

    /**
     * レポートテンプレートの初期化
     */
    initializeReportTemplates() {
        this.reportTemplates = [
            {
                id: 'comprehensive',
                name: '総合レポート',
                description: 'すべての分析結果を含む詳細レポート',
                icon: '📊',
                sections: ['basic', 'detailed', 'insights', 'scenarios'],
                estimatedPages: 15
            },
            {
                id: 'summary',
                name: 'サマリーレポート',
                description: '主要な結果のみを含む簡潔なレポート',
                icon: '📋',
                sections: ['basic', 'insights'],
                estimatedPages: 5
            },
            {
                id: 'insights-only',
                name: '洞察レポート',
                description: '易経的洞察と推奨事項に特化したレポート',
                icon: '🔮',
                sections: ['insights'],
                estimatedPages: 8
            },
            {
                id: 'scenarios',
                name: 'シナリオレポート',
                description: '人格シミュレーション結果に特化したレポート',
                icon: '🎭',
                sections: ['scenarios'],
                estimatedPages: 10
            },
            {
                id: 'data-only',
                name: 'データエクスポート',
                description: '生データとスコアのみ（分析用）',
                icon: '💾',
                sections: ['data'],
                estimatedPages: 2
            }
        ];
    }

    /**
     * メインコンテンツのレンダリング
     */
    renderContent(container) {
        if (!this.analysisData) {
            this.showLoading(container);
            return;
        }

        const content = `
            <div class="export-container">
                ${this.renderHeader()}
                ${this.renderMobileExport()}
                ${this.renderQuickExport()}
                ${this.renderReportTemplates()}
                ${this.renderCustomExport()}
                ${this.renderExportHistory()}
                ${this.renderSharingOptions()}
            </div>
        `;

        container.innerHTML = content;
        this.initializeInteractiveElements();
    }

    /**
     * モバイル向けエクスポートセクションのレンダリング
     */
    renderMobileExport() {
        const { engineOS, interfaceOS, safeModeOS } = this.analysisData;
        const totalScore = this.getTotalScore();
        const analysisDate = this.getAnalysisDate();
        
        return `
            <div class="mobile-export-section">
                <h3 class="section-title">📱 モバイル共有</h3>
                <div class="mobile-export-container">
                    <!-- SNS共有カード -->
                    <div class="export-card sns-card">
                        <div class="card-header">
                            <h4 class="card-title">SNS共有カード</h4>
                            <span class="card-subtitle">Instagram・Twitter対応</span>
                        </div>
                        <div class="card-preview" id="sns-card-preview">
                            <div class="preview-content">
                                <div class="preview-header">
                                    <h5>HAQEI分析結果</h5>
                                    <span class="preview-date">${analysisDate}</span>
                                </div>
                                <div class="preview-scores">
                                    <div class="os-score">
                                        <span class="os-name">Engine OS</span>
                                        <span class="score-value">${engineOS.score}%</span>
                                    </div>
                                    <div class="os-score">
                                        <span class="os-name">Interface OS</span>
                                        <span class="score-value">${interfaceOS.score}%</span>
                                    </div>
                                    <div class="os-score">
                                        <span class="os-name">Safe Mode OS</span>
                                        <span class="score-value">${safeModeOS.score}%</span>
                                    </div>
                                </div>
                                <div class="preview-hexagram">
                                    <div class="os-hexagram">${engineOS.hexagram}</div>
                                    <div class="os-hexagram">${interfaceOS.hexagram}</div>
                                    <div class="os-hexagram">${safeModeOS.hexagram}</div>
                                </div>
                                <div class="preview-total">
                                    <span class="total-label">総合スコア</span>
                                    <span class="total-score">${totalScore}%</span>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <button class="share-btn instagram-btn" data-platform="instagram">
                                <span class="btn-icon">📷</span>
                                Instagram
                            </button>
                            <button class="share-btn twitter-btn" data-platform="twitter">
                                <span class="btn-icon">🐦</span>
                                Twitter
                            </button>
                            <button class="share-btn save-image-btn" data-action="save-image">
                                <span class="btn-icon">💾</span>
                                画像保存
                            </button>
                        </div>
                    </div>
                    
                    <!-- LINE共有 -->
                    <div class="export-card line-card">
                        <div class="card-header">
                            <h4 class="card-title">LINE共有</h4>
                            <span class="card-subtitle">テキスト形式で共有</span>
                        </div>
                        <div class="line-text-preview" id="line-text-preview">
                            <div class="preview-text">
🔮 HAQEI分析結果 🔮
📅 ${analysisDate}

💪 Engine OS: ${engineOS.score}% ${engineOS.hexagram}
🤝 Interface OS: ${interfaceOS.score}% ${interfaceOS.hexagram}
🛡️ Safe Mode OS: ${safeModeOS.score}% ${safeModeOS.hexagram}

📊 総合スコア: ${totalScore}%

#HAQEI #易経分析 #自己理解
                            </div>
                        </div>
                        <div class="card-footer">
                            <button class="share-btn line-btn" data-platform="line">
                                <span class="btn-icon">💬</span>
                                LINEで共有
                            </button>
                            <button class="share-btn copy-text-btn" data-action="copy-text">
                                <span class="btn-icon">📋</span>
                                テキストコピー
                            </button>
                        </div>
                    </div>
                    
                    <!-- QRコード -->
                    <div class="export-card qr-card">
                        <div class="card-header">
                            <h4 class="card-title">QRコード共有</h4>
                            <span class="card-subtitle">結果ページへの直接アクセス</span>
                        </div>
                        <div class="qr-code-container" id="qr-code-container">
                            <div class="qr-placeholder">
                                <span class="qr-icon">📱</span>
                                <p>QRコードを生成中...</p>
                            </div>
                        </div>
                        <div class="card-footer">
                            <button class="share-btn generate-qr-btn" data-action="generate-qr">
                                <span class="btn-icon">🔗</span>
                                QRコード生成
                            </button>
                            <button class="share-btn save-qr-btn" data-action="save-qr" disabled>
                                <span class="btn-icon">💾</span>
                                QR保存
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- コピー通知 -->
                <div class="copy-notification" id="copy-notification">
                    <span class="notification-icon">✅</span>
                    <span class="notification-text">コピーしました！</span>
                </div>
            </div>
        `;
    }

    /**
     * ヘッダーセクションのレンダリング
     */
    renderHeader() {
        return `
            <div class="export-header">
                <h2 class="export-title">
                    <span class="export-icon">📤</span>
                    エクスポート & 共有
                </h2>
                <p class="export-subtitle">
                    あなたの分析結果を様々な形式でエクスポートし、共有することができます
                </p>
                <div class="export-stats">
                    <div class="stat-item">
                        <span class="stat-icon">📊</span>
                        <span class="stat-label">分析データ</span>
                        <span class="stat-value">${this.getDataSize()}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">📅</span>
                        <span class="stat-label">分析日時</span>
                        <span class="stat-value">${this.getAnalysisDate()}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">🔢</span>
                        <span class="stat-label">総合スコア</span>
                        <span class="stat-value">${this.getTotalScore()}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * クイックエクスポートセクションのレンダリング
     */
    renderQuickExport() {
        return `
            <div class="quick-export-section">
                <h3 class="section-title">クイックエクスポート</h3>
                <div class="quick-export-grid">
                    ${this.exportFormats.map(format => `
                        <div class="quick-export-card" data-format="${format}">
                            <div class="export-format-icon">${this.getFormatIcon(format)}</div>
                            <h4 class="export-format-name">${this.getFormatName(format)}</h4>
                            <p class="export-format-description">${this.getFormatDescription(format)}</p>
                            <button class="quick-export-btn" data-format="${format}">
                                <span class="btn-icon">⬇️</span>
                                ${format.toUpperCase()}でダウンロード
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * レポートテンプレートセクションのレンダリング
     */
    renderReportTemplates() {
        return `
            <div class="report-templates-section">
                <h3 class="section-title">レポートテンプレート</h3>
                <div class="templates-grid">
                    ${this.reportTemplates.map(template => `
                        <div class="template-card" data-template="${template.id}">
                            <div class="template-header">
                                <div class="template-icon">${template.icon}</div>
                                <div class="template-info">
                                    <h4 class="template-name">${template.name}</h4>
                                    <p class="template-description">${template.description}</p>
                                </div>
                            </div>
                            <div class="template-details">
                                <div class="template-sections">
                                    <span class="detail-label">含まれるセクション:</span>
                                    <div class="section-tags">
                                        ${template.sections.map(section => `
                                            <span class="section-tag">${this.getSectionName(section)}</span>
                                        `).join('')}
                                    </div>
                                </div>
                                <div class="template-pages">
                                    <span class="detail-label">推定ページ数:</span>
                                    <span class="pages-count">${template.estimatedPages}ページ</span>
                                </div>
                            </div>
                            <div class="template-actions">
                                <button class="template-preview-btn" data-template="${template.id}">
                                    <span class="btn-icon">👁️</span>
                                    プレビュー
                                </button>
                                <button class="template-generate-btn" data-template="${template.id}">
                                    <span class="btn-icon">📄</span>
                                    生成
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * カスタムエクスポートセクションのレンダリング
     */
    renderCustomExport() {
        return `
            <div class="custom-export-section">
                <h3 class="section-title">カスタムエクスポート</h3>
                <div class="custom-export-container">
                    <div class="export-options">
                        <div class="option-group">
                            <h4 class="option-title">含めるセクション</h4>
                            <div class="section-checkboxes">
                                <label class="checkbox-item">
                                    <input type="checkbox" id="include-basic" checked>
                                    <span class="checkbox-label">基本結果</span>
                                </label>
                                <label class="checkbox-item">
                                    <input type="checkbox" id="include-detailed" checked>
                                    <span class="checkbox-label">詳細分析</span>
                                </label>
                                <label class="checkbox-item">
                                    <input type="checkbox" id="include-insights" checked>
                                    <span class="checkbox-label">洞察</span>
                                </label>
                                <label class="checkbox-item">
                                    <input type="checkbox" id="include-scenarios">
                                    <span class="checkbox-label">シナリオ</span>
                                </label>
                                <label class="checkbox-item">
                                    <input type="checkbox" id="include-charts" checked>
                                    <span class="checkbox-label">グラフ・チャート</span>
                                </label>
                                <label class="checkbox-item">
                                    <input type="checkbox" id="include-raw-data">
                                    <span class="checkbox-label">生データ</span>
                                </label>
                            </div>
                        </div>
                        <div class="option-group">
                            <h4 class="option-title">出力形式</h4>
                            <div class="format-radio-group">
                                <label class="radio-item">
                                    <input type="radio" name="export-format" value="pdf" checked>
                                    <span class="radio-label">PDF（推奨）</span>
                                </label>
                                <label class="radio-item">
                                    <input type="radio" name="export-format" value="html">
                                    <span class="radio-label">HTML</span>
                                </label>
                                <label class="radio-item">
                                    <input type="radio" name="export-format" value="docx">
                                    <span class="radio-label">Word文書</span>
                                </label>
                            </div>
                        </div>
                        <div class="option-group">
                            <h4 class="option-title">レポート設定</h4>
                            <div class="report-settings">
                                <div class="setting-item">
                                    <label for="report-title">レポートタイトル</label>
                                    <input type="text" id="report-title" value="HAQEI 分析レポート" placeholder="カスタムタイトルを入力">
                                </div>
                                <div class="setting-item">
                                    <label for="report-author">作成者</label>
                                    <input type="text" id="report-author" placeholder="作成者名（オプション）">
                                </div>
                                <div class="setting-item">
                                    <label class="checkbox-item">
                                        <input type="checkbox" id="include-timestamp" checked>
                                        <span class="checkbox-label">タイムスタンプを含める</span>
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <label class="checkbox-item">
                                        <input type="checkbox" id="include-watermark">
                                        <span class="checkbox-label">HAQEIウォーターマークを含める</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="export-preview">
                        <h4 class="preview-title">プレビュー</h4>
                        <div class="preview-container">
                            <div class="preview-document">
                                <div class="preview-header">
                                    <div class="preview-title-text">HAQEI 分析レポート</div>
                                    <div class="preview-date">${new Date().toLocaleDateString('ja-JP')}</div>
                                </div>
                                <div class="preview-content">
                                    <div class="preview-section">📊 基本結果</div>
                                    <div class="preview-section">🔍 詳細分析</div>
                                    <div class="preview-section">💡 洞察</div>
                                    <div class="preview-section">📈 グラフ・チャート</div>
                                </div>
                                <div class="preview-footer">
                                    <div class="preview-pages">推定: 12ページ</div>
                                </div>
                            </div>
                        </div>
                        <button class="custom-export-btn" id="generate-custom-report">
                            <span class="btn-icon">🚀</span>
                            カスタムレポートを生成
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * エクスポート履歴セクションのレンダリング
     */
    renderExportHistory() {
        return `
            <div class="export-history-section">
                <h3 class="section-title">エクスポート履歴</h3>
                <div class="history-container">
                    ${this.exportHistory.length > 0 ? `
                        <div class="history-list">
                            ${this.exportHistory.map(item => `
                                <div class="history-item">
                                    <div class="history-icon">${this.getFormatIcon(item.format)}</div>
                                    <div class="history-info">
                                        <div class="history-name">${item.name}</div>
                                        <div class="history-details">
                                            <span class="history-format">${item.format.toUpperCase()}</span>
                                            <span class="history-size">${item.size}</span>
                                            <span class="history-date">${item.date}</span>
                                        </div>
                                    </div>
                                    <div class="history-actions">
                                        <button class="history-download-btn" data-id="${item.id}">
                                            <span class="btn-icon">⬇️</span>
                                        </button>
                                        <button class="history-share-btn" data-id="${item.id}">
                                            <span class="btn-icon">🔗</span>
                                        </button>
                                        <button class="history-delete-btn" data-id="${item.id}">
                                            <span class="btn-icon">🗑️</span>
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="no-history-message">
                            <span class="message-icon">📁</span>
                            <p>まだエクスポート履歴がありません</p>
                            <p class="message-subtitle">上記のオプションからレポートを生成してください</p>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    /**
     * 共有オプションセクションのレンダリング
     */
    renderSharingOptions() {
        return `
            <div class="sharing-options-section">
                <h3 class="section-title">共有オプション</h3>
                <div class="sharing-container">
                    <div class="sharing-method">
                        <div class="method-icon">🔗</div>
                        <div class="method-content">
                            <h4 class="method-title">共有リンク生成</h4>
                            <p class="method-description">分析結果を閲覧できる安全なリンクを生成します</p>
                            <div class="link-options">
                                <label class="checkbox-item">
                                    <input type="checkbox" id="link-password" checked>
                                    <span class="checkbox-label">パスワード保護</span>
                                </label>
                                <label class="checkbox-item">
                                    <input type="checkbox" id="link-expiry" checked>
                                    <span class="checkbox-label">有効期限設定（7日間）</span>
                                </label>
                            </div>
                            <button class="generate-link-btn">
                                <span class="btn-icon">🔗</span>
                                共有リンクを生成
                            </button>
                        </div>
                    </div>
                    <div class="sharing-method">
                        <div class="method-icon">📧</div>
                        <div class="method-content">
                            <h4 class="method-title">メール送信</h4>
                            <p class="method-description">レポートを直接メールで送信します</p>
                            <div class="email-form">
                                <input type="email" id="recipient-email" placeholder="送信先メールアドレス">
                                <textarea id="email-message" placeholder="メッセージ（オプション）" rows="3"></textarea>
                                <button class="send-email-btn">
                                    <span class="btn-icon">📧</span>
                                    メールで送信
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="sharing-method">
                        <div class="method-icon">☁️</div>
                        <div class="method-content">
                            <h4 class="method-title">クラウド保存</h4>
                            <p class="method-description">Google Drive、Dropboxなどに保存します</p>
                            <div class="cloud-services">
                                <button class="cloud-service-btn" data-service="google-drive">
                                    <span class="service-icon">📁</span>
                                    Google Drive
                                </button>
                                <button class="cloud-service-btn" data-service="dropbox">
                                    <span class="service-icon">📦</span>
                                    Dropbox
                                </button>
                                <button class="cloud-service-btn" data-service="onedrive">
                                    <span class="service-icon">☁️</span>
                                    OneDrive
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * ユーティリティメソッド
     */
    getFormatIcon(format) {
        const icons = {
            pdf: '📄',
            json: '📋',
            csv: '📊',
            html: '🌐',
            docx: '📝'
        };
        return icons[format] || '📄';
    }

    getFormatName(format) {
        const names = {
            pdf: 'PDF文書',
            json: 'JSONデータ',
            csv: 'CSVファイル',
            html: 'Webページ'
        };
        return names[format] || format.toUpperCase();
    }

    getFormatDescription(format) {
        const descriptions = {
            pdf: '印刷に適した高品質なレポート形式',
            json: '他のアプリケーションで利用可能な構造化データ',
            csv: 'スプレッドシートで開ける表形式データ',
            html: 'ブラウザで閲覧可能なWebページ形式'
        };
        return descriptions[format] || '';
    }

    getSectionName(section) {
        const names = {
            basic: '基本結果',
            detailed: '詳細分析',
            insights: '洞察',
            scenarios: 'シナリオ',
            data: 'データ'
        };
        return names[section] || section;
    }

    getDataSize() {
        if (!this.analysisData) return '0KB';
        const dataString = JSON.stringify(this.analysisData);
        const sizeInBytes = new Blob([dataString]).size;
        return this.formatFileSize(sizeInBytes);
    }

    getAnalysisDate() {
        if (this.analysisData && this.analysisData.timestamp) {
            return new Date(this.analysisData.timestamp).toLocaleDateString('ja-JP');
        }
        return new Date().toLocaleDateString('ja-JP');
    }

    getTotalScore() {
        if (!this.analysisData) return '0';
        const { engineOS, interfaceOS, safeModeOS } = this.analysisData;
        const total = engineOS.score + interfaceOS.score + safeModeOS.score;
        return Math.round(total / 3);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * エクスポート処理
     */
    async exportData(format, options = {}) {
        if (this.isExporting) {
            console.warn('Export already in progress');
            return;
        }

        this.isExporting = true;
        this.showExportProgress();

        try {
            let exportedData;
            
            switch (format) {
                case 'pdf':
                    exportedData = await this.exportToPDF(options);
                    break;
                case 'json':
                    exportedData = await this.exportToJSON(options);
                    break;
                case 'csv':
                    exportedData = await this.exportToCSV(options);
                    break;
                case 'html':
                    exportedData = await this.exportToHTML(options);
                    break;
                default:
                    throw new Error(`Unsupported format: ${format}`);
            }

            this.downloadFile(exportedData, format);
            this.addToExportHistory(exportedData, format);
            this.showExportSuccess();

        } catch (error) {
            console.error('Export failed:', error);
            this.showExportError(error.message);
        } finally {
            this.isExporting = false;
            this.hideExportProgress();
        }
    }

    /**
     * PDF エクスポート
     */
    async exportToPDF(options) {
        // PDF生成のシミュレーション
        await this.delay(2000);
        
        const pdfContent = this.generatePDFContent(options);
        return {
            content: pdfContent,
            filename: `haqei-analysis-${Date.now()}.pdf`,
            mimeType: 'application/pdf'
        };
    }

    /**
     * JSON エクスポート
     */
    async exportToJSON(options) {
        await this.delay(500);
        
        const jsonData = {
            metadata: {
                exportDate: new Date().toISOString(),
                version: '1.0',
                format: 'HAQEI Analysis Data'
            },
            analysisData: this.analysisData,
            options: options
        };
        
        return {
            content: JSON.stringify(jsonData, null, 2),
            filename: `haqei-data-${Date.now()}.json`,
            mimeType: 'application/json'
        };
    }

    /**
     * CSV エクスポート
     */
    async exportToCSV(options) {
        await this.delay(800);
        
        const csvContent = this.generateCSVContent();
        return {
            content: csvContent,
            filename: `haqei-scores-${Date.now()}.csv`,
            mimeType: 'text/csv'
        };
    }

    /**
     * HTML エクスポート
     */
    async exportToHTML(options) {
        await this.delay(1200);
        
        const htmlContent = this.generateHTMLContent(options);
        return {
            content: htmlContent,
            filename: `haqei-report-${Date.now()}.html`,
            mimeType: 'text/html'
        };
    }

    /**
     * ファイルダウンロード
     */
    downloadFile(exportData, format) {
        const blob = new Blob([exportData.content], { type: exportData.mimeType });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = exportData.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }

    /**
     * エクスポート履歴への追加
     */
    addToExportHistory(exportData, format) {
        const historyItem = {
            id: Date.now().toString(),
            name: exportData.filename,
            format: format,
            size: this.formatFileSize(new Blob([exportData.content]).size),
            date: new Date().toLocaleDateString('ja-JP'),
            timestamp: Date.now()
        };
        
        this.exportHistory.unshift(historyItem);
        
        // 履歴は最大10件まで保持
        if (this.exportHistory.length > 10) {
            this.exportHistory = this.exportHistory.slice(0, 10);
        }
        
        this.saveExportHistory();
        this.updateHistoryDisplay();
    }

    /**
     * インタラクティブ要素の初期化
     */
    initializeInteractiveElements() {
        // クイックエクスポートボタン
        document.querySelectorAll('.quick-export-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = e.target.dataset.format;
                this.exportData(format);
            });
        });

        // テンプレート生成ボタン
        document.querySelectorAll('.template-generate-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const templateId = e.target.dataset.template;
                this.generateTemplateReport(templateId);
            });
        });

        // カスタムエクスポートボタン
        const customExportBtn = document.getElementById('generate-custom-report');
        if (customExportBtn) {
            customExportBtn.addEventListener('click', () => {
                this.generateCustomReport();
            });
        }

        // その他のイベントバインディング
        this.bindSharingEvents();
        this.bindHistoryEvents();
    }

    /**
     * イベントバインディング
     */
    bindEvents() {
        this.bindMobileExportEvents();
        this.bindSharingEvents();
        this.bindHistoryEvents();
    }

    /**
     * モバイルエクスポートイベントのバインド
     */
    bindMobileExportEvents() {
        // SNS共有ボタン
        document.querySelectorAll('.share-btn[data-platform]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const platform = e.target.closest('.share-btn').dataset.platform;
                this.shareToSocialMedia(platform);
            });
        });

        // 画像保存ボタン
        const saveImageBtn = document.querySelector('.save-image-btn');
        if (saveImageBtn) {
            saveImageBtn.addEventListener('click', () => {
                this.saveAsImage();
            });
        }

        // テキストコピーボタン
        const copyTextBtn = document.querySelector('.copy-text-btn');
        if (copyTextBtn) {
            copyTextBtn.addEventListener('click', () => {
                this.copyTextToClipboard();
            });
        }

        // QRコード生成ボタン
        const generateQrBtn = document.querySelector('.generate-qr-btn');
        if (generateQrBtn) {
            generateQrBtn.addEventListener('click', () => {
                this.generateQRCode();
            });
        }

        // QRコード保存ボタン
        const saveQrBtn = document.querySelector('.save-qr-btn');
        if (saveQrBtn) {
            saveQrBtn.addEventListener('click', () => {
                this.saveQRCode();
            });
        }
    }

    bindSharingEvents() {
        // 共有リンク生成
        const generateLinkBtn = document.querySelector('.generate-link-btn');
        if (generateLinkBtn) {
            generateLinkBtn.addEventListener('click', () => {
                this.generateSharingLink();
            });
        }

        // メール送信
        const sendEmailBtn = document.querySelector('.send-email-btn');
        if (sendEmailBtn) {
            sendEmailBtn.addEventListener('click', () => {
                this.sendEmailReport();
            });
        }

        // クラウドサービス
        document.querySelectorAll('.cloud-service-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const service = e.target.dataset.service;
                this.saveToCloudService(service);
            });
        });
    }

    bindHistoryEvents() {
        // 履歴アクションボタン
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('history-download-btn')) {
                const itemId = e.target.dataset.id;
                this.redownloadHistoryItem(itemId);
            } else if (e.target.classList.contains('history-share-btn')) {
                const itemId = e.target.dataset.id;
                this.shareHistoryItem(itemId);
            } else if (e.target.classList.contains('history-delete-btn')) {
                const itemId = e.target.dataset.id;
                this.deleteHistoryItem(itemId);
            }
        });
    }

    /**
     * SNSプラットフォームへの共有
     */
    async shareToSocialMedia(platform) {
        try {
            const imageData = await this.generateSNSImage();
            const shareText = this.generateShareText();
            
            switch (platform) {
                case 'instagram':
                    this.shareToInstagram(imageData);
                    break;
                case 'twitter':
                    this.shareToTwitter(shareText, imageData);
                    break;
                case 'line':
                    this.shareToLine(shareText);
                    break;
                default:
                    console.warn('未対応のプラットフォーム:', platform);
            }
        } catch (error) {
            console.error('SNS共有エラー:', error);
            this.showExportError('共有に失敗しました');
        }
    }

    /**
     * SNS用画像の生成
     */
    async generateSNSImage() {
        const cardElement = document.getElementById('sns-card-preview');
        if (!cardElement) {
            throw new Error('プレビューカードが見つかりません');
        }

        // html2canvasライブラリを使用（実際の実装では外部ライブラリが必要）
        if (typeof html2canvas !== 'undefined') {
            const canvas = await html2canvas(cardElement, {
                backgroundColor: '#ffffff',
                scale: 1, // スケールを1に減らして大きすぎる画像を防ぐ
                width: 1080,
                height: 1080
            });
            
            // サイズ検証
            if (typeof ImageSizeValidator !== 'undefined') {
                const validatedCanvas = ImageSizeValidator.validateAndResize(canvas, {
                    maxDimension: 4000
                });
                return validatedCanvas.toDataURL('image/png');
            }
            
            return canvas.toDataURL('image/png');
        } else {
            // フォールバック: Canvas APIを使用した簡易実装
            return this.generateImageFallback();
        }
    }

    /**
     * 画像生成のフォールバック実装
     */
    generateImageFallback() {
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d');
        
        // 背景
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, 1080, 1080);
        
        // タイトル
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('HAQEI分析結果', 540, 150);
        
        // スコア表示
        const { engineOS, interfaceOS, safeModeOS } = this.analysisData;
        const scores = [
            { name: 'Engine OS', score: engineOS.score, y: 300 },
            { name: 'Interface OS', score: interfaceOS.score, y: 450 },
            { name: 'Safe Mode OS', score: safeModeOS.score, y: 600 }
        ];
        
        ctx.font = '36px Arial';
        scores.forEach(item => {
            ctx.fillStyle = '#34495e';
            ctx.textAlign = 'left';
            ctx.fillText(item.name, 200, item.y);
            ctx.textAlign = 'right';
            ctx.fillText(`${item.score}%`, 880, item.y);
        });
        
        // 総合スコア
        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 42px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`総合スコア: ${this.getTotalScore()}%`, 540, 800);
        
        return canvas.toDataURL('image/png');
    }

    /**
     * 共有用テキストの生成
     */
    generateShareText() {
        const { engineOS, interfaceOS, safeModeOS } = this.analysisData;
        const totalScore = this.getTotalScore();
        const analysisDate = this.getAnalysisDate();
        
        return `🔮 HAQEI分析結果 🔮\n📅 ${analysisDate}\n\n💪 Engine OS: ${engineOS.score}% ${engineOS.hexagram}\n🤝 Interface OS: ${interfaceOS.score}% ${interfaceOS.hexagram}\n🛡️ Safe Mode OS: ${safeModeOS.score}% ${safeModeOS.hexagram}\n\n📊 総合スコア: ${totalScore}%\n\n#HAQEI #易経分析 #自己理解`;
    }

    /**
     * Instagramへの共有
     */
    shareToInstagram(imageData) {
        // モバイルデバイスの場合、Instagram URLスキームを使用
        if (this.isMobileDevice()) {
            // 画像をダウンロードしてからInstagramアプリを開く
            this.downloadImage(imageData, 'haqei-analysis.png');
            setTimeout(() => {
                window.open('instagram://camera', '_blank');
            }, 1000);
        } else {
            // デスクトップの場合、画像をダウンロード
            this.downloadImage(imageData, 'haqei-analysis.png');
            alert('画像をダウンロードしました。Instagramアプリで投稿してください。');
        }
    }

    /**
     * Twitterへの共有
     */
    shareToTwitter(text, imageData) {
        const encodedText = encodeURIComponent(text);
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
        
        // 画像も一緒にダウンロード
        this.downloadImage(imageData, 'haqei-analysis.png');
        
        // Twitterを開く
        window.open(twitterUrl, '_blank');
    }

    /**
     * LINEへの共有
     */
    shareToLine(text) {
        const encodedText = encodeURIComponent(text);
        const lineUrl = `https://social-plugins.line.me/lineit/share?text=${encodedText}`;
        window.open(lineUrl, '_blank');
    }

    /**
     * 画像として保存
     */
    async saveAsImage() {
        try {
            const imageData = await this.generateSNSImage();
            this.downloadImage(imageData, 'haqei-analysis.png');
            this.showCopyNotification('画像を保存しました');
        } catch (error) {
            console.error('画像保存エラー:', error);
            this.showExportError('画像の保存に失敗しました');
        }
    }

    /**
     * 画像のダウンロード
     */
    downloadImage(dataUrl, filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * テキストをクリップボードにコピー
     */
    async copyTextToClipboard() {
        try {
            const text = this.generateShareText();
            await navigator.clipboard.writeText(text);
            this.showCopyNotification('テキストをコピーしました');
        } catch (error) {
            console.error('コピーエラー:', error);
            // フォールバック: 古いブラウザ対応
            this.copyTextFallback();
        }
    }

    /**
     * テキストコピーのフォールバック
     */
    copyTextFallback() {
        const text = this.generateShareText();
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopyNotification('テキストをコピーしました');
        } catch (error) {
            console.error('フォールバックコピーエラー:', error);
            this.showExportError('コピーに失敗しました');
        }
        
        document.body.removeChild(textArea);
    }

    /**
     * QRコードの生成
     */
    async generateQRCode() {
        try {
            const shareUrl = this.generateShareUrl();
            const qrContainer = document.getElementById('qr-code-container');
            
            // QRコード生成（実際の実装では外部ライブラリが必要）
            if (typeof QRCode !== 'undefined') {
                qrContainer.innerHTML = '';
                new QRCode(qrContainer, {
                    text: shareUrl,
                    width: 200,
                    height: 200,
                    colorDark: '#000000',
                    colorLight: '#ffffff'
                });
            } else {
                // フォールバック: Google Charts APIを使用
                this.generateQRCodeFallback(shareUrl, qrContainer);
            }
            
            // QR保存ボタンを有効化
            const saveQrBtn = document.querySelector('.save-qr-btn');
            if (saveQrBtn) {
                saveQrBtn.disabled = false;
            }
            
        } catch (error) {
            console.error('QRコード生成エラー:', error);
            this.showExportError('QRコードの生成に失敗しました');
        }
    }

    /**
     * QRコード生成のフォールバック
     */
    generateQRCodeFallback(url, container) {
        const encodedUrl = encodeURIComponent(url);
        const qrApiUrl = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodedUrl}`;
        
        container.innerHTML = `
            <img src="${qrApiUrl}" alt="QRコード" style="max-width: 200px; max-height: 200px;">
        `;
    }

    /**
     * 共有URLの生成
     */
    generateShareUrl() {
        // 現在のページURLをベースに共有URLを生成
        const baseUrl = window.location.origin + window.location.pathname;
        const params = new URLSearchParams({
            shared: 'true',
            timestamp: Date.now()
        });
        return `${baseUrl}?${params.toString()}`;
    }

    /**
     * QRコードの保存
     */
    saveQRCode() {
        try {
            const qrContainer = document.getElementById('qr-code-container');
            const qrImage = qrContainer.querySelector('img') || qrContainer.querySelector('canvas');
            
            if (qrImage) {
                if (qrImage.tagName === 'IMG') {
                    // 画像の場合
                    const link = document.createElement('a');
                    link.download = 'haqei-qr-code.png';
                    link.href = qrImage.src;
                    link.click();
                } else if (qrImage.tagName === 'CANVAS') {
                    // Canvasの場合
                    const dataUrl = qrImage.toDataURL('image/png');
                    this.downloadImage(dataUrl, 'haqei-qr-code.png');
                }
                
                this.showCopyNotification('QRコードを保存しました');
            } else {
                throw new Error('QRコードが見つかりません');
            }
        } catch (error) {
            console.error('QRコード保存エラー:', error);
            this.showExportError('QRコードの保存に失敗しました');
        }
    }

    /**
     * コピー通知の表示
     */
    showCopyNotification(message = 'コピーしました！') {
        const notification = document.getElementById('copy-notification');
        if (notification) {
            const textElement = notification.querySelector('.notification-text');
            if (textElement) {
                textElement.textContent = message;
            }
            
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    }

    /**
     * モバイルデバイスの判定
     */
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * ヘルパーメソッド
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showExportProgress() {
        // プログレス表示の実装
        console.log('Export in progress...');
    }

    hideExportProgress() {
        // プログレス非表示の実装
        console.log('Export progress hidden');
    }

    showExportSuccess() {
        // 成功メッセージの実装
        console.log('Export completed successfully');
    }

    showExportError(message) {
        // エラーメッセージの実装
        console.error('Export failed:', message);
    }

    generatePDFContent(options) {
        // PDF生成ロジックの実装
        return 'PDF content placeholder';
    }

    generateCSVContent() {
        // CSV生成ロジックの実装
        const { engineOS, interfaceOS, safeModeOS } = this.analysisData;
        
        const csvRows = [
            ['OS Type', 'Score', 'Traits', 'Strengths', 'Challenges'],
            ['Engine OS', engineOS.score, engineOS.traits.join(';'), engineOS.strengths.join(';'), engineOS.challenges.join(';')],
            ['Interface OS', interfaceOS.score, interfaceOS.traits.join(';'), interfaceOS.strengths.join(';'), interfaceOS.challenges.join(';')],
            ['Safe Mode OS', safeModeOS.score, safeModeOS.traits.join(';'), safeModeOS.strengths.join(';'), safeModeOS.challenges.join(';')]
        ];
        
        return csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    }

    generateHTMLContent(options) {
        // HTML生成ロジックの実装
        return `
            <!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <title>HAQEI 分析レポート</title>
                <style>
                    body { font-family: 'Hiragino Sans', sans-serif; margin: 40px; }
                    .header { text-align: center; margin-bottom: 40px; }
                    .section { margin-bottom: 30px; }
                    .os-card { border: 1px solid #ddd; padding: 20px; margin: 10px 0; border-radius: 8px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>HAQEI 分析レポート</h1>
                    <p>生成日: ${new Date().toLocaleDateString('ja-JP')}</p>
                </div>
                <div class="content">
                    ${this.generateHTMLSections(options)}
                </div>
            </body>
            </html>
        `;
    }

    generateHTMLSections(options) {
        // HTMLセクション生成の実装
        return '<div class="section"><h2>分析結果</h2><p>詳細な分析結果がここに表示されます。</p></div>';
    }

    loadExportHistory() {
        // ローカルストレージから履歴を読み込み
        const saved = localStorage.getItem('haqei-export-history');
        if (saved) {
            try {
                this.exportHistory = JSON.parse(saved);
            } catch (e) {
                console.warn('Failed to load export history:', e);
                this.exportHistory = [];
            }
        }
    }

    saveExportHistory() {
        // ローカルストレージに履歴を保存
        try {
            localStorage.setItem('haqei-export-history', JSON.stringify(this.exportHistory));
        } catch (e) {
            console.warn('Failed to save export history:', e);
        }
    }

    updateHistoryDisplay() {
        // 履歴表示の更新
        const historyContainer = document.querySelector('.export-history-section');
        if (historyContainer) {
            const newContent = this.renderExportHistory();
            historyContainer.innerHTML = newContent;
            this.bindHistoryEvents();
        }
    }

    /**
     * データ設定
     */
    setData(data) {
        this.analysisData = data;
    }

    /**
     * クリーンアップ
     */
    destroy() {
        this.isExporting = false;
        super.destroy();
    }
}

// グローバルスコープに登録
window.ExportTab = ExportTab;