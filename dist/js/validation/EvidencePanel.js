/**
 * 7日間バリデーションスプリント - UI根拠パネル
 * 
 * 機能:
 * - 本卦・変爻・之卦の表示
 * - 爻辞出典の明示
 * - 進爻ヒューリスティック注記
 * - 透明性とトレーサビリティの向上
 */

class EvidencePanel {
    constructor() {
        this.panelElement = null;
        this.isVisible = false;
        this.currentEvidence = null;
        
        this.initializePanel();
        console.log('📋 EvidencePanel initialized - 根拠表示システム起動');
    }
    
    /**
     * パネルのHTML構造を初期化
     */
    initializePanel() {
        // 既存パネルがあれば削除
        const existingPanel = document.getElementById('evidence-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
        
        // パネル要素作成
        this.panelElement = document.createElement('div');
        this.panelElement.id = 'evidence-panel';
        this.panelElement.className = 'evidence-panel';
        this.panelElement.innerHTML = this.getPanelHTML();
        
        // スタイル適用
        this.applyStyles();
        
        // DOMに追加（body の最後）
        document.body.appendChild(this.panelElement);
        
        // イベントリスナー設定
        this.setupEventListeners();
        
        // 初期状態は非表示
        this.hide();
    }
    
    /**
     * パネルのHTML構造
     */
    getPanelHTML() {
        return `
            <div class="evidence-panel-header">
                <h3>🔍 根拠・透明性情報</h3>
                <button class="evidence-close-btn" title="パネルを閉じる">×</button>
            </div>
            <div class="evidence-panel-content">
                <div class="evidence-section">
                    <h4>📖 易経的根拠</h4>
                    <div id="hexagram-info">
                        <div class="evidence-item">
                            <span class="evidence-label">本卦:</span>
                            <span id="main-hexagram">未設定</span>
                        </div>
                        <div class="evidence-item">
                            <span class="evidence-label">変爻:</span>
                            <span id="changing-lines">未設定</span>
                        </div>
                        <div class="evidence-item">
                            <span class="evidence-label">之卦:</span>
                            <span id="derived-hexagram">未設定</span>
                        </div>
                        <div class="evidence-item">
                            <span class="evidence-label">出典:</span>
                            <span id="source-citation">未設定</span>
                        </div>
                    </div>
                </div>
                
                <div class="evidence-section">
                    <h4>⚠️ ヒューリスティック注記</h4>
                    <div id="heuristic-note">
                        <div class="evidence-warning">
                            <strong>進爻について:</strong><br>
                            「進爻」は易経の正典にない当システム独自のヒューリスティック手法です。
                            爻位の段階的進行による解釈を提供していますが、古典的易経とは異なる
                            現代的解釈であることをご理解ください。
                        </div>
                    </div>
                </div>
                
                <div class="evidence-section">
                    <h4>🔄 処理レベル情報</h4>
                    <div id="processing-info">
                        <div class="evidence-item">
                            <span class="evidence-label">Fallbackレベル:</span>
                            <span id="fallback-level" class="fallback-full">Full</span>
                        </div>
                        <div class="evidence-item">
                            <span class="evidence-label">信頼度:</span>
                            <span id="confidence-level">高</span>
                        </div>
                    </div>
                </div>
                
                <div class="evidence-section">
                    <h4>🎯 HaQei哲学整合性</h4>
                    <div id="haqei-alignment">
                        <div class="evidence-item">
                            <span class="evidence-label">主体性:</span>
                            <span id="agency-note">あなたの選択・判断を支援</span>
                        </div>
                        <div class="evidence-item">
                            <span class="evidence-label">非決定論:</span>
                            <span id="non-deterministic-note">最終判断は常にあなたが行います</span>
                        </div>
                        <div class="evidence-item">
                            <span class="evidence-label">矛盾受容:</span>
                            <span id="contradiction-note">複数の道が同時に有効です</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * パネルスタイルを適用
     */
    applyStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .evidence-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 400px;
                max-height: 80vh;
                background: #1e293b;
                border: 1px solid #334155;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                z-index: 1000;
                font-family: 'Inter', 'Noto Sans JP', sans-serif;
                color: #ffffff;
                overflow-y: auto;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
            }
            
            .evidence-panel.visible {
                opacity: 1;
                transform: translateX(0);
            }
            
            .evidence-panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                background: #2563eb;
                border-radius: 8px 8px 0 0;
                border-bottom: 1px solid #3b82f6;
            }
            
            .evidence-panel-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }
            
            .evidence-close-btn {
                background: none;
                border: none;
                color: #ffffff;
                font-size: 18px;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                transition: background 0.2s;
            }
            
            .evidence-close-btn:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .evidence-panel-content {
                padding: 20px;
            }
            
            .evidence-section {
                margin-bottom: 24px;
            }
            
            .evidence-section:last-child {
                margin-bottom: 0;
            }
            
            .evidence-section h4 {
                margin: 0 0 12px 0;
                font-size: 14px;
                font-weight: 600;
                color: #60a5fa;
                border-bottom: 1px solid #374151;
                padding-bottom: 6px;
            }
            
            .evidence-item {
                display: flex;
                margin-bottom: 8px;
                align-items: flex-start;
            }
            
            .evidence-label {
                font-weight: 500;
                color: #94a3b8;
                min-width: 80px;
                margin-right: 8px;
                font-size: 13px;
            }
            
            .evidence-item span:not(.evidence-label) {
                color: #e2e8f0;
                font-size: 13px;
                line-height: 1.4;
            }
            
            .evidence-warning {
                background: #451a03;
                border: 1px solid #92400e;
                border-radius: 4px;
                padding: 12px;
                font-size: 12px;
                line-height: 1.4;
                color: #fed7aa;
            }
            
            .fallback-full { color: #10b981; }
            .fallback-partial { color: #f59e0b; }
            .fallback-minimal { color: #ef4444; }
            .fallback-emergency { color: #dc2626; font-weight: bold; }
            
            /* モバイル対応 */
            @media (max-width: 640px) {
                .evidence-panel {
                    width: 90vw;
                    right: 5vw;
                    max-height: 70vh;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * イベントリスナー設定
     */
    setupEventListeners() {
        // 閉じるボタン
        const closeBtn = this.panelElement.querySelector('.evidence-close-btn');
        closeBtn.addEventListener('click', () => this.hide());
        
        // ESCキーで閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
    }
    
    /**
     * 卦情報を表示
     * @param {Object} hexagramInfo - 卦情報
     */
    displayHexagramInfo(hexagramInfo) {
        const mainHex = this.panelElement.querySelector('#main-hexagram');
        const changingLines = this.panelElement.querySelector('#changing-lines');
        const derivedHex = this.panelElement.querySelector('#derived-hexagram');
        const citation = this.panelElement.querySelector('#source-citation');
        
        mainHex.textContent = hexagramInfo.mainHexagram || '未設定';
        changingLines.textContent = hexagramInfo.changingLines || '未設定';
        derivedHex.textContent = hexagramInfo.derivedHexagram || '未設定';
        citation.textContent = hexagramInfo.citation || 'システム生成';
        
        console.log('📖 卦情報表示更新:', hexagramInfo);
    }
    
    /**
     * 変爻情報を表示
     * @param {Array} lines - 変爻配列
     */
    displayChangingLines(lines) {
        const changingLinesElement = this.panelElement.querySelector('#changing-lines');
        if (lines && lines.length > 0) {
            changingLinesElement.textContent = lines.join('、') + '爻';
        } else {
            changingLinesElement.textContent = 'なし';
        }
    }
    
    /**
     * ヒューリスティック注記を表示
     * @param {string} note - 注記内容
     */
    displayHeuristicNote(note) {
        if (note) {
            const noteElement = this.panelElement.querySelector('#heuristic-note .evidence-warning');
            
            // 進爻関連の場合は特別な透明性注記を追加
            let enhancedNote = note;
            if (note.includes('進爻') || note.includes('advance') || note.includes('進む')) {
                enhancedNote = `<strong>⚠️ 進爻について:</strong><br>
                進爻は古典易経にない当システム独自の分析手法です。<br>
                従来の変爻（陰陽反転）とは異なり、現在の爻位から次の段階へ進む動的解釈を提供します。<br><br>
                <strong>手法の根拠:</strong> HaQei哲学の「非決定論的選択肢提示」に基づく<br>
                <strong>限界:</strong> 古典的易経解釈とは異なる現代的適応<br>
                <strong>代替解釈:</strong> 伝統的な変爻解釈も参考にすることを推奨<br><br>
                <strong>分析内容:</strong><br>${note}`;
            }
            
            noteElement.innerHTML = enhancedNote;
        }
    }
    
    /**
     * Fallbackレベルを表示
     * @param {string} level - full/partial/minimal/emergency
     */
    displayFallbackLevel(level) {
        const fallbackElement = this.panelElement.querySelector('#fallback-level');
        const confidenceElement = this.panelElement.querySelector('#confidence-level');
        
        // クラスをリセット
        fallbackElement.className = '';
        
        // レベルに応じた表示
        switch (level) {
            case 'full':
                fallbackElement.className = 'fallback-full';
                fallbackElement.textContent = 'Full（完全データ）';
                confidenceElement.textContent = '高';
                break;
            case 'partial':
                fallbackElement.className = 'fallback-partial';
                fallbackElement.textContent = 'Partial（部分データ）';
                confidenceElement.textContent = '中';
                break;
            case 'minimal':
                fallbackElement.className = 'fallback-minimal';
                fallbackElement.textContent = 'Minimal（最小データ）';
                confidenceElement.textContent = '低';
                break;
            case 'emergency':
                fallbackElement.className = 'fallback-emergency';
                fallbackElement.textContent = 'Emergency（緊急フォールバック）';
                confidenceElement.textContent = '要注意';
                break;
            default:
                fallbackElement.textContent = level || '未設定';
                confidenceElement.textContent = '不明';
        }
        
        console.log('🔄 Fallbackレベル表示更新:', level);
    }
    
    /**
     * パネルを表示
     */
    show() {
        this.panelElement.classList.add('visible');
        this.isVisible = true;
        console.log('👁️ 根拠パネル表示');
    }
    
    /**
     * パネルを非表示
     */
    hide() {
        this.panelElement.classList.remove('visible');
        this.isVisible = false;
        console.log('👁️ 根拠パネル非表示');
    }
    
    /**
     * パネル表示の切り替え
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    /**
     * 包括的な根拠情報を更新
     * @param {Object} evidenceData - 全根拠データ
     */
    updateEvidence(evidenceData) {
        this.currentEvidence = evidenceData;
        
        // 卦情報更新
        if (evidenceData.hexagram) {
            this.displayHexagramInfo(evidenceData.hexagram);
        }
        
        // 変爻情報更新
        if (evidenceData.changingLines) {
            this.displayChangingLines(evidenceData.changingLines);
        }
        
        // Fallbackレベル更新
        if (evidenceData.fallbackLevel) {
            this.displayFallbackLevel(evidenceData.fallbackLevel);
        }
        
        // カスタム注記
        if (evidenceData.heuristicNote) {
            this.displayHeuristicNote(evidenceData.heuristicNote);
        }
        
        console.log('📋 根拠情報一括更新完了');
    }
    
    /**
     * システム情報取得
     */
    getSystemInfo() {
        return {
            version: '1.0.0',
            isVisible: this.isVisible,
            hasEvidence: !!this.currentEvidence,
            panelId: this.panelElement.id
        };
    }
}

// ブラウザ環境でグローバルに公開
if (typeof window !== 'undefined') {
    window.EvidencePanel = EvidencePanel;
    console.log('📋 EvidencePanel registered to window object');
}

// Node.js環境対応
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EvidencePanel;
}

console.log('📋 EvidencePanel.js loaded successfully - 7日間バリデーションスプリント用根拠表示システム');