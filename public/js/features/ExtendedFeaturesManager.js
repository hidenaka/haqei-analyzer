/**
 * ExtendedFeaturesManager.js - HAQEI Extended Features Integration
 * 
 * Integrates PDF Export, SNS Sharing, and Results History features
 * Provides unified interface for all extended functionality
 * 
 * @version 1.0.0
 * @date 2025-08-04
 * @author extended-features-developer
 */

class ExtendedFeaturesManager {
    constructor(options = {}) {
        this.options = {
            enablePDFExport: true,
            enableSNSSharing: true,
            enableResultsHistory: true,
            enableAdvancedAnalytics: true,
            privacyMode: true,
            autoSaveResults: true,
            ...options
        };
        
        this.pdfExporter = null;
        this.snsSharer = null;
        this.historyManager = null;
        this.currentAnalysis = null;
        this.isInitialized = false;
        
        console.log('🚀 ExtendedFeaturesManager initialized');
    }
    
    /**
     * Initialize all extended features
     */
    async init(analysisResult = null) {
        try {
            console.log('🔄 Initializing extended features...');
            
            // Initialize PDF Export Manager
            if (this.options.enablePDFExport) {
                this.pdfExporter = new PDFExportManager({
                    privacyMode: this.options.privacyMode
                });
                console.log('✅ PDF Export Manager initialized');
            }
            
            // Initialize SNS Sharing Manager
            if (this.options.enableSNSSharing) {
                this.snsSharer = new SNSSharingManager({
                    privacyMode: this.options.privacyMode,
                    analytics: this.options.enableAdvancedAnalytics
                });
                
                if (analysisResult) {
                    await this.snsSharer.init(analysisResult);
                }
                console.log('✅ SNS Sharing Manager initialized');
            }
            
            // Initialize Results History Manager
            if (this.options.enableResultsHistory) {
                this.historyManager = new ResultsHistoryManager({
                    enableCompression: true,
                    maxHistorySize: 50
                });
                await this.historyManager.init();
                console.log('✅ Results History Manager initialized');
                
                // Auto-save current result
                if (analysisResult && this.options.autoSaveResults) {
                    await this.saveCurrentResult(analysisResult);
                }
            }
            
            // Set current analysis
            if (analysisResult) {
                this.currentAnalysis = analysisResult;
            }
            
            // Setup UI integration
            this.setupUIIntegration();
            
            this.isInitialized = true;
            console.log('✅ All extended features initialized successfully');
            
            return true;
            
        } catch (error) {
            console.error('❌ Failed to initialize extended features:', error);
            throw error;
        }
    }
    
    /**
     * Setup UI integration for extended features
     */
    setupUIIntegration() {
        try {
            // Add feature buttons to results page
            this.addFeatureButtons();
            
            // Setup keyboard shortcuts
            this.setupKeyboardShortcuts();
            
            // Setup context menus
            this.setupContextMenus();
            
            console.log('✅ UI integration setup completed');
            
        } catch (error) {
            console.error('❌ Failed to setup UI integration:', error);
        }
    }
    
    /**
     * Add feature buttons to the UI
     */
    addFeatureButtons() {
        const targetContainer = document.querySelector('.vp-action-buttons') || 
                               document.querySelector('.vp-side-panel') ||
                               document.querySelector('.virtual-persona-container');
        
        if (!targetContainer) {
            console.warn('⚠️ Target container not found for feature buttons');
            return;
        }
        
        const featuresContainer = document.createElement('div');
        featuresContainer.className = 'extended-features-container';
        featuresContainer.innerHTML = `
            <div class="extended-features-section">
                <h4 class="extended-features-title">📤 エクスポート & シェア</h4>
                <div class="extended-features-buttons">
                    ${this.options.enablePDFExport ? `
                        <button class="extended-feature-button pdf-export" onclick="extendedFeatures.exportToPDF()">
                            <span class="icon">📄</span>
                            PDF出力
                        </button>
                    ` : ''}
                    
                    ${this.options.enableSNSSharing ? `
                        <div class="sns-sharing-group">
                            <button class="extended-feature-button sns-share-main" onclick="extendedFeatures.showSharingMenu()">
                                <span class="icon">📱</span>
                                SNS共有
                            </button>
                            <div class="sns-sharing-dropdown" id="sns-sharing-dropdown" style="display: none;">
                                <button onclick="extendedFeatures.shareToTwitter()">
                                    <span class="icon">🐦</span>
                                    Twitter
                                </button>
                                <button onclick="extendedFeatures.shareToFacebook()">
                                    <span class="icon">📘</span>
                                    Facebook
                                </button>
                                <button onclick="extendedFeatures.shareToLinkedIn()">
                                    <span class="icon">💼</span>
                                    LinkedIn
                                </button>
                                <button onclick="extendedFeatures.shareToInstagram()">
                                    <span class="icon">📷</span>
                                    Instagram
                                </button>
                                <button onclick="extendedFeatures.copyShareLink()">
                                    <span class="icon">📋</span>
                                    リンクコピー
                                </button>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            ${this.options.enableResultsHistory ? `
                <div class="extended-features-section">
                    <h4 class="extended-features-title">📚 履歴管理</h4>
                    <div class="extended-features-buttons">
                        <button class="extended-feature-button history-view" onclick="extendedFeatures.showHistory()">
                            <span class="icon">📋</span>
                            結果履歴
                        </button>
                        <button class="extended-feature-button bookmark-toggle" onclick="extendedFeatures.toggleBookmark()">
                            <span class="icon">📌</span>
                            ブックマーク
                        </button>
                        <button class="extended-feature-button favorite-toggle" onclick="extendedFeatures.toggleFavorite()">
                            <span class="icon">⭐</span>
                            お気に入り
                        </button>
                        <button class="extended-feature-button comparison-view" onclick="extendedFeatures.showComparison()">
                            <span class="icon">🔍</span>
                            結果比較
                        </button>
                    </div>
                </div>
            ` : ''}
            
            <div class="extended-features-section">
                <h4 class="extended-features-title">⚙️ 設定</h4>
                <div class="extended-features-buttons">
                    <button class="extended-feature-button privacy-toggle" onclick="extendedFeatures.togglePrivacyMode()">
                        <span class="icon">🔒</span>
                        プライバシー設定
                    </button>
                    <button class="extended-feature-button export-all" onclick="extendedFeatures.showExportOptions()">
                        <span class="icon">💾</span>
                        データエクスポート
                    </button>
                </div>
            </div>
        `;
        
        // Add CSS styles
        if (!document.getElementById('extended-features-styles')) {
            const styles = document.createElement('style');
            styles.id = 'extended-features-styles';
            styles.textContent = this.getFeatureStyles();
            document.head.appendChild(styles);
        }
        
        targetContainer.appendChild(featuresContainer);
        
        // Setup dropdown click outside handler
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('sns-sharing-dropdown');
            const button = e.target.closest('.sns-share-main');
            
            if (!button && dropdown && dropdown.style.display !== 'none') {
                dropdown.style.display = 'none';
            }
        });
        
        console.log('✅ Feature buttons added to UI');
    }
    
    /**
     * Get CSS styles for extended features
     */
    getFeatureStyles() {
        return `
            .extended-features-container {
                margin-top: 2rem;
                padding: 1.5rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .extended-features-section {
                margin-bottom: 1.5rem;
            }
            
            .extended-features-section:last-child {
                margin-bottom: 0;
            }
            
            .extended-features-title {
                color: #F1F5F9;
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 0.75rem;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .extended-features-buttons {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .extended-feature-button {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.75rem 1rem;
                background: rgba(99, 102, 241, 0.2);
                border: 1px solid rgba(99, 102, 241, 0.3);
                border-radius: 8px;
                color: #E2E8F0;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.2s ease;
                text-align: left;
                width: 100%;
            }
            
            .extended-feature-button:hover {
                background: rgba(99, 102, 241, 0.3);
                border-color: rgba(99, 102, 241, 0.5);
                transform: translateY(-1px);
            }
            
            .extended-feature-button:active {
                transform: translateY(0);
            }
            
            .extended-feature-button .icon {
                font-size: 16px;
                min-width: 20px;
            }
            
            .sns-sharing-group {
                position: relative;
            }
            
            .sns-sharing-dropdown {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: #1E293B;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                margin-top: 0.25rem;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                z-index: 1000;
            }
            
            .sns-sharing-dropdown button {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                width: 100%;
                padding: 0.75rem 1rem;
                background: none;
                border: none;
                color: #E2E8F0;
                font-size: 13px;
                cursor: pointer;
                transition: background-color 0.2s ease;
            }
            
            .sns-sharing-dropdown button:hover {
                background: rgba(99, 102, 241, 0.2);
            }
            
            .sns-sharing-dropdown button:first-child {
                border-radius: 8px 8px 0 0;
            }
            
            .sns-sharing-dropdown button:last-child {
                border-radius: 0 0 8px 8px;
            }
            
            .extended-features-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10B981;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                z-index: 10000;
                font-size: 14px;
                max-width: 300px;
                word-wrap: break-word;
            }
            
            .extended-features-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            
            .extended-features-modal-content {
                background: #1E293B;
                border-radius: 12px;
                padding: 2rem;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                margin: 1rem;
                color: #F1F5F9;
            }
            
            .extended-features-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .extended-features-modal-title {
                font-size: 18px;
                font-weight: 600;
                margin: 0;
            }
            
            .extended-features-modal-close {
                background: none;
                border: none;
                color: #94A3B8;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.2s ease;
            }
            
            .extended-features-modal-close:hover {
                background: rgba(255, 255, 255, 0.1);
            }
        `;
    }
    
    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + P for PDF export
            if ((e.ctrlKey || e.metaKey) && e.key === 'p' && this.options.enablePDFExport) {
                e.preventDefault();
                this.exportToPDF();
            }
            
            // Ctrl/Cmd + S for SNS sharing
            if ((e.ctrlKey || e.metaKey) && e.key === 's' && this.options.enableSNSSharing) {
                e.preventDefault();
                this.showSharingMenu();
            }
            
            // Ctrl/Cmd + H for history
            if ((e.ctrlKey || e.metaKey) && e.key === 'h' && this.options.enableResultsHistory) {
                e.preventDefault();
                this.showHistory();
            }
        });
        
        console.log('✅ Keyboard shortcuts setup completed');
    }
    
    /**
     * Setup context menus
     */
    setupContextMenus() {
        // Add context menu for OS cards
        document.addEventListener('contextmenu', (e) => {
            const osCard = e.target.closest('.vp-os-card');
            if (osCard && this.currentAnalysis) {
                e.preventDefault();
                this.showOSContextMenu(e, osCard);
            }
        });
    }
    
    /**
     * PDF Export Methods
     */
    
    async exportToPDF(options = {}) {
        try {
            if (!this.pdfExporter) {
                throw new Error('PDF Export not available');
            }
            
            if (!this.currentAnalysis) {
                throw new Error('No analysis result available for export');
            }
            
            this.showNotification('📄 PDF生成中...', 'info');
            
            await this.pdfExporter.generateAnalysisReport(
                this.currentAnalysis,
                this.getInsights(),
                options
            );
            
            await this.pdfExporter.downloadPDF();
            
            this.showNotification('✅ PDFエクスポートが完了しました！');
            
            // Track export
            this.trackFeatureUsage('pdf_export');
            
        } catch (error) {
            console.error('❌ PDF export failed:', error);
            this.showNotification('❌ PDFエクスポートに失敗しました: ' + error.message, 'error');
        }
    }
    
    /**
     * SNS Sharing Methods
     */
    
    showSharingMenu() {
        const dropdown = document.getElementById('sns-sharing-dropdown');
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        }
    }
    
    async shareToTwitter() {
        try {
            if (!this.snsSharer) {
                throw new Error('SNS Sharing not available');
            }
            
            await this.snsSharer.shareToTwitter();
            this.showNotification('🐦 Twitterシェアを開始しました！');
            this.trackFeatureUsage('twitter_share');
            
        } catch (error) {
            console.error('❌ Twitter sharing failed:', error);
            this.showNotification('❌ Twitterシェアに失敗しました', 'error');
        }
    }
    
    async shareToFacebook() {
        try {
            if (!this.snsSharer) {
                throw new Error('SNS Sharing not available');
            }
            
            await this.snsSharer.shareToFacebook();
            this.showNotification('📘 Facebookシェアを開始しました！');
            this.trackFeatureUsage('facebook_share');
            
        } catch (error) {
            console.error('❌ Facebook sharing failed:', error);
            this.showNotification('❌ Facebookシェアに失敗しました', 'error');
        }
    }
    
    async shareToLinkedIn() {
        try {
            if (!this.snsSharer) {
                throw new Error('SNS Sharing not available');
            }
            
            await this.snsSharer.shareToLinkedIn();
            this.showNotification('💼 LinkedInシェアを開始しました！');
            this.trackFeatureUsage('linkedin_share');
            
        } catch (error) {
            console.error('❌ LinkedIn sharing failed:', error);
            this.showNotification('❌ LinkedInシェアに失敗しました', 'error');
        }
    }
    
    async shareToInstagram() {
        try {
            if (!this.snsSharer) {
                throw new Error('SNS Sharing not available');
            }
            
            await this.snsSharer.shareToInstagram();
            this.trackFeatureUsage('instagram_share');
            
        } catch (error) {
            console.error('❌ Instagram sharing failed:', error);
            this.showNotification('❌ Instagram用コンテンツの準備に失敗しました', 'error');
        }
    }
    
    async copyShareLink() {
        try {
            if (!this.snsSharer) {
                throw new Error('SNS Sharing not available');
            }
            
            await this.snsSharer.copyToClipboard();
            this.trackFeatureUsage('copy_link');
            
        } catch (error) {
            console.error('❌ Copy to clipboard failed:', error);
            this.showNotification('❌ リンクのコピーに失敗しました', 'error');
        }
    }
    
    /**
     * History Management Methods
     */
    
    async saveCurrentResult(analysisResult, metadata = {}) {
        try {
            if (!this.historyManager) {
                throw new Error('History Manager not available');
            }
            
            const result = await this.historyManager.addResult(analysisResult, metadata);
            console.log('✅ Result saved to history:', result.id);
            
            return result;
            
        } catch (error) {
            console.error('❌ Failed to save result:', error);
            throw error;
        }
    }
    
    showHistory() {
        if (!this.historyManager) {
            this.showNotification('❌ 履歴機能が利用できません', 'error');
            return;
        }
        
        const history = this.historyManager.getHistory({ limit: 20 });
        this.showHistoryModal(history);
        this.trackFeatureUsage('view_history');
    }
    
    showHistoryModal(history) {
        const modal = document.createElement('div');
        modal.className = 'extended-features-modal';
        modal.innerHTML = `
            <div class="extended-features-modal-content">
                <div class="extended-features-modal-header">
                    <h3 class="extended-features-modal-title">📚 分析結果履歴</h3>
                    <button class="extended-features-modal-close">&times;</button>
                </div>
                <div class="history-content">
                    ${history.length === 0 ? 
                        '<p>履歴がありません。</p>' : 
                        this.renderHistoryList(history)
                    }
                </div>
            </div>
        `;
        
        // Close modal handlers
        modal.querySelector('.extended-features-modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        document.body.appendChild(modal);
    }
    
    renderHistoryList(history) {
        return `
            <div class="history-list">
                ${history.map(result => {
                    const date = new Date(result.timestamp);
                    const analysis = this.historyManager.options.enableCompression ? 
                        this.historyManager.decompressData(result.analysisResult) : result.analysisResult;
                    
                    return `
                        <div class="history-item" data-id="${result.id}">
                            <div class="history-item-header">
                                <div class="history-item-date">
                                    ${date.toLocaleDateString()} ${date.toLocaleTimeString()}
                                </div>
                                <div class="history-item-actions">
                                    ${result.isBookmarked ? '<span class="bookmark-indicator">📌</span>' : ''}
                                    ${result.isFavorite ? '<span class="favorite-indicator">⭐</span>' : ''}
                                </div>
                            </div>
                            <div class="history-item-content">
                                <div class="history-item-os">
                                    <span>🔥 ${analysis.engineOS?.hexagramInfo?.name || 'Unknown'}</span>
                                    <span>🌟 ${analysis.interfaceOS?.hexagramInfo?.name || 'Unknown'}</span>
                                    <span>🛡️ ${analysis.safeModeOS?.hexagramInfo?.name || 'Unknown'}</span>
                                </div>
                                <div class="history-item-integration">
                                    統合レベル: ${this.historyManager.calculateIntegrationLevel(analysis)}%
                                </div>
                            </div>
                            <div class="history-item-buttons">
                                <button onclick="extendedFeatures.loadHistoryResult('${result.id}')">読み込み</button>
                                <button onclick="extendedFeatures.toggleBookmark('${result.id}')">
                                    ${result.isBookmarked ? 'ブックマーク解除' : 'ブックマーク'}
                                </button>
                                <button onclick="extendedFeatures.compareWithCurrent('${result.id}')">比較</button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    async toggleBookmark(id = null) {
        try {
            if (!this.historyManager) {
                throw new Error('History Manager not available');
            }
            
            const targetId = id || this.historyManager.currentResult?.id;
            if (!targetId) {
                throw new Error('No result to bookmark');
            }
            
            const isBookmarked = await this.historyManager.toggleBookmark(targetId);
            this.showNotification(
                isBookmarked ? '📌 ブックマークに追加しました' : '📌 ブックマークを削除しました'
            );
            
            this.trackFeatureUsage('toggle_bookmark');
            
        } catch (error) {
            console.error('❌ Failed to toggle bookmark:', error);
            this.showNotification('❌ ブックマーク操作に失敗しました', 'error');
        }
    }
    
    async toggleFavorite(id = null) {
        try {
            if (!this.historyManager) {
                throw new Error('History Manager not available');
            }
            
            const targetId = id || this.historyManager.currentResult?.id;
            if (!targetId) {
                throw new Error('No result to favorite');
            }
            
            const isFavorite = await this.historyManager.toggleFavorite(targetId);
            this.showNotification(
                isFavorite ? '⭐ お気に入りに追加しました' : '⭐ お気に入りを削除しました'
            );
            
            this.trackFeatureUsage('toggle_favorite');
            
        } catch (error) {
            console.error('❌ Failed to toggle favorite:', error);
            this.showNotification('❌ お気に入り操作に失敗しました', 'error');
        }
    }
    
    showComparison() {
        if (!this.historyManager) {
            this.showNotification('❌ 履歴機能が利用できません', 'error');
            return;
        }
        
        const history = this.historyManager.getHistory({ limit: 10 });
        if (history.length < 2) {
            this.showNotification('❌ 比較するには2つ以上の結果が必要です', 'error');
            return;
        }
        
        this.showComparisonModal(history);
        this.trackFeatureUsage('view_comparison');
    }
    
    /**
     * Privacy and Settings Methods
     */
    
    togglePrivacyMode() {
        this.options.privacyMode = !this.options.privacyMode;
        
        // Update all managers
        if (this.snsSharer) {
            this.snsSharer.setPrivacyMode(this.options.privacyMode);
        }
        
        this.showNotification(
            `🔒 プライバシーモード: ${this.options.privacyMode ? 'ON' : 'OFF'}`
        );
        
        this.trackFeatureUsage('toggle_privacy');
    }
    
    showExportOptions() {
        if (!this.historyManager) {
            this.showNotification('❌ 履歴機能が利用できません', 'error');
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'extended-features-modal';
        modal.innerHTML = `
            <div class="extended-features-modal-content">
                <div class="extended-features-modal-header">
                    <h3 class="extended-features-modal-title">💾 データエクスポート</h3>
                    <button class="extended-features-modal-close">&times;</button>
                </div>
                <div class="export-options">
                    <button onclick="extendedFeatures.exportHistoryToJSON()" class="extended-feature-button">
                        <span class="icon">📄</span>
                        JSON形式でエクスポート
                    </button>
                    <button onclick="extendedFeatures.exportHistoryToCSV()" class="extended-feature-button">
                        <span class="icon">📊</span>
                        CSV形式でエクスポート
                    </button>
                    <button onclick="extendedFeatures.exportSummaryReport()" class="extended-feature-button">
                        <span class="icon">📋</span>
                        サマリーレポート
                    </button>
                </div>
            </div>
        `;
        
        // Close modal handlers
        modal.querySelector('.extended-features-modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        document.body.appendChild(modal);
    }
    
    async exportHistoryToJSON() {
        try {
            await this.historyManager.exportToJSON();
            this.showNotification('✅ JSONエクスポートが完了しました！');
            this.trackFeatureUsage('export_json');
        } catch (error) {
            console.error('❌ JSON export failed:', error);
            this.showNotification('❌ JSONエクスポートに失敗しました', 'error');
        }
    }
    
    async exportHistoryToCSV() {
        try {
            await this.historyManager.exportToCSV();
            this.showNotification('✅ CSVエクスポートが完了しました！');
            this.trackFeatureUsage('export_csv');
        } catch (error) {
            console.error('❌ CSV export failed:', error);
            this.showNotification('❌ CSVエクスポートに失敗しました', 'error');
        }
    }
    
    async exportSummaryReport() {
        try {
            await this.historyManager.exportSummaryReport();
            this.showNotification('✅ サマリーレポートが完了しました！');
            this.trackFeatureUsage('export_summary');
        } catch (error) {
            console.error('❌ Summary export failed:', error);
            this.showNotification('❌ サマリーエクスポートに失敗しました', 'error');
        }
    }
    
    /**
     * Utility Methods
     */
    
    showNotification(message, type = 'success', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `extended-features-notification ${type}`;
        notification.textContent = message;
        
        // Different colors for different types
        if (type === 'error') {
            notification.style.background = '#EF4444';
        } else if (type === 'info') {
            notification.style.background = '#3B82F6';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, duration);
    }
    
    trackFeatureUsage(feature) {
        if (!this.options.enableAdvancedAnalytics) return;
        
        const usage = JSON.parse(localStorage.getItem('haqei_feature_usage') || '{}');
        usage[feature] = (usage[feature] || 0) + 1;
        usage.lastUsed = new Date().toISOString();
        
        localStorage.setItem('haqei_feature_usage', JSON.stringify(usage));
        console.log(`📊 Feature usage tracked: ${feature}`);
    }
    
    getInsights() {
        // Get insights from storage or generate basic ones
        try {
            const storageManager = new StorageManager();
            return storageManager.getInsights();
        } catch {
            return null;
        }
    }
    
    updateCurrentAnalysis(analysisResult) {
        this.currentAnalysis = analysisResult;
        
        // Update SNS sharer if available
        if (this.snsSharer) {
            this.snsSharer.init(analysisResult);
        }
        
        // Auto-save if enabled
        if (this.options.autoSaveResults && this.historyManager) {
            this.saveCurrentResult(analysisResult);
        }
    }
    
    getFeatureStatistics() {
        const stats = {
            isInitialized: this.isInitialized,
            features: {
                pdfExport: !!this.pdfExporter,
                snsSharing: !!this.snsSharer,
                resultsHistory: !!this.historyManager
            },
            usage: JSON.parse(localStorage.getItem('haqei_feature_usage') || '{}'),
            historyStats: this.historyManager ? this.historyManager.getStatistics() : null
        };
        
        return stats;
    }
}

// Global instance
window.extendedFeatures = null;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other components to initialize
    setTimeout(() => {
        if (typeof window.virtualPersonaView !== 'undefined' && window.virtualPersonaView.analysisResult) {
            window.extendedFeatures = new ExtendedFeaturesManager();
            window.extendedFeatures.init(window.virtualPersonaView.analysisResult);
        }
    }, 2000);
});

// Export for manual initialization
window.ExtendedFeaturesManager = ExtendedFeaturesManager;

console.log('✅ ExtendedFeaturesManager loaded successfully');