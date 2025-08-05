/**
 * TripleOSResultsView セキュリティパッチ
 * innerHTML使用箇所をSecureDOMに置き換える修正
 */

// セキュリティユーティリティを読み込む
if (!window.SecurityValidator || !window.SecureDOM) {
    console.error('Security utilities not loaded. Please include SecurityValidator.js and SecureDOM.js');
}

// TripleOSResultsViewクラスの拡張
(function() {
    // 元のrenderメソッドを保存
    const originalRender = TripleOSResultsView.prototype.render;
    
    // セキュアなrenderメソッドに置き換え
    TripleOSResultsView.prototype.render = async function() {
        try {
            const tripleOSData = await this.extractTripleOSData(this.analysisResult);
            
            if (!tripleOSData || 
                !tripleOSData.engineOS || 
                !tripleOSData.interfaceOS || 
                !tripleOSData.safeModeOS) {
                
                // セキュアなエラー表示
                SecureDOM.setHTML(this.container, `
                    <div class="error-container" role="alert">
                        <div class="error-icon">⚠️</div>
                        <h2 class="error-title">トリプルOS分析データが不完全です</h2>
                        <p class="error-message">エンジンOS、インターフェースOS、セーフモードOSのデータを読み込めませんでした。</p>
                        <p class="error-advice">ページをリロードするか、分析を再実行してください。</p>
                    </div>
                `, {
                    ALLOWED_TAGS: ['div', 'h2', 'p'],
                    ALLOWED_ATTR: ['class', 'role']
                });
                return;
            }
            
            // generateMainHTMLメソッドを使用してHTMLを生成
            const html = this.generateMainHTML(tripleOSData);
            
            // セキュアなHTML挿入
            SecureDOM.setHTML(this.container, html, {
                ALLOWED_TAGS: ['div', 'h1', 'h2', 'h3', 'h4', 'p', 'span', 'ul', 'li', 'button', 'section', 'header', 'article', 'canvas'],
                ALLOWED_ATTR: ['class', 'id', 'data-tab', 'data-value', 'data-os-type', 'aria-label', 'aria-selected', 'role', 'tabindex']
            });
            
            // イベントリスナーの設定
            this.attachEventListeners();
            
            // グラフの初期化
            await this.initializeVisualizations();
            
        } catch (error) {
            console.error('❌ [TripleOSResultsView] Render error:', error);
            SecureDOM.setText(this.container, 'エラーが発生しました。ページをリロードしてください。');
        }
    };
    
    // updateSectionContentメソッドのセキュア化
    const originalUpdateSectionContent = TripleOSResultsView.prototype.updateSectionContent;
    
    TripleOSResultsView.prototype.updateSectionContent = function(element, htmlContent, fallbackMessage) {
        try {
            if (htmlContent) {
                SecureDOM.setHTML(element, htmlContent, {
                    ALLOWED_TAGS: ['div', 'h3', 'h4', 'p', 'span', 'ul', 'li', 'strong', 'em', 'small'],
                    ALLOWED_ATTR: ['class', 'style']
                });
            } else {
                const fallback = fallbackMessage || `<div class="error-note"><small>❌ データの読み込みに失敗しました</small></div>`;
                SecureDOM.setHTML(element, fallback, {
                    ALLOWED_TAGS: ['div', 'small'],
                    ALLOWED_ATTR: ['class']
                });
            }
        } catch (error) {
            console.error('❌ Section update error:', error);
            SecureDOM.setText(element, '❌ 表示エラーが発生しました');
        }
    };
    
    // showNotImplementedMessageメソッドのセキュア化
    const originalShowNotImplementedMessage = TripleOSResultsView.prototype.showNotImplementedMessage;
    
    TripleOSResultsView.prototype.showNotImplementedMessage = function(element) {
        const message = '🚧 まだ実装していません - 今後実装予定です';
        SecureDOM.setText(element, message);
    };
    
    // 動的コンテンツ生成メソッドのセキュア化
    const secureContentMethods = [
        '_renderEngineOSAnalysis',
        '_renderInterfaceOSAnalysis', 
        '_renderSafeModeOSAnalysis',
        '_renderCompatibilityAnalysis',
        '_renderAdvancedAnalysis'
    ];
    
    secureContentMethods.forEach(methodName => {
        const originalMethod = TripleOSResultsView.prototype[methodName];
        if (originalMethod) {
            TripleOSResultsView.prototype[methodName] = function(...args) {
                const content = originalMethod.apply(this, args);
                
                // 動的に生成されたコンテンツをエスケープ
                if (typeof content === 'string') {
                    // 特定のHTMLタグは許可しつつ、危険な要素は除去
                    return DOMPurify ? DOMPurify.sanitize(content, {
                        ALLOWED_TAGS: ['div', 'h3', 'h4', 'p', 'span', 'ul', 'li', 'strong', 'em', 'small', 'table', 'tr', 'td', 'th'],
                        ALLOWED_ATTR: ['class', 'style', 'data-value', 'data-type']
                    }) : SecurityValidator.escapeHtml(content);
                }
                return content;
            };
        }
    });
    
    console.log('✅ TripleOSResultsView security patch applied successfully');
})();