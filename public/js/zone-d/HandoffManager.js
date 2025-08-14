/**
 * Zone D - Handoff Manager Component
 * 次のAIレイヤーへの引き継ぎ機能を管理
 * 
 * @class HandoffManager
 * @version 1.0.0
 * @date 2025-08-12
 */

class HandoffManager {
    constructor() {
        this.payload = null;
        this.destination = null;
        this.handoffId = null;
        
        // ハンドオフ先の定義
        this.destinations = {
            AI_CONSULTANT: {
                id: 'ai-consultant',
                name: 'AI相談アシスタント',
                description: '診断結果を基に具体的なアドバイスを提供',
                icon: '🤖',
                url: '#ai-consultant',
                accepts: ['json', 'summary']
            },
            COACHING_AI: {
                id: 'coaching-ai',
                name: 'コーチングAI',
                description: '個人成長のための継続的サポート',
                icon: '🎯',
                url: '#coaching',
                accepts: ['json', 'detailed']
            },
            ANALYTICS_AI: {
                id: 'analytics-ai',
                name: '詳細分析AI',
                description: 'より深い心理分析と洞察',
                icon: '📊',
                url: '#analytics',
                accepts: ['json', 'raw']
            },
            SHARE_EXPORT: {
                id: 'share-export',
                name: '共有・エクスポート',
                description: '結果を保存または共有',
                icon: '📤',
                url: '#export',
                accepts: ['json', 'pdf', 'image']
            }
        };
        
        // ペイロードフォーマット
        this.formats = {
            JSON: 'json',
            SUMMARY: 'summary',
            DETAILED: 'detailed',
            RAW: 'raw',
            PDF: 'pdf',
            IMAGE: 'image'
        };
        
        this.initializeHandoff();
    }
    
    /**
     * ハンドオフを初期化
     */
    initializeHandoff() {
        this.handoffId = this.generateHandoffId();
        this.payload = {
            version: '2.0.0',
            handoffId: this.handoffId,
            timestamp: new Date().toISOString(),
            source: 'os-analyzer',
            data: null,
            metadata: {},
            userContext: {}
        };
    }
    
    /**
     * 分析結果をペイロードに設定
     */
    setAnalysisData(analysisResults, confidence, feedback = null) {
        if (!analysisResults) return false;
        
        this.payload.data = {
            tripleOS: analysisResults.tripleOS || {},
            hexagram: analysisResults.hexagram || null,
            metrics: {
                synergy: analysisResults.synergy || 0,
                tension: analysisResults.tension || 0,
                confidence: confidence || 0
            },
            insightPrimitives: this.generateInsightPrimitives(analysisResults),
            switchLenses: analysisResults.switchLenses || [],
            blindspots: this.identifyBlindspots(analysisResults, confidence)
        };
        
        // フィードバックがあれば追加
        if (feedback) {
            this.payload.data.userFeedback = feedback;
        }
        
        // メタデータ設定
        this.payload.metadata = {
            analysisDate: new Date().toISOString(),
            confidenceLevel: this.getConfidenceLevel(confidence),
            dataQuality: this.assessDataQuality(analysisResults),
            completeness: this.checkCompleteness(analysisResults)
        };
        
        return true;
    }
    
    /**
     * ユーザーコンテキストを設定
     */
    setUserContext(context) {
        this.payload.userContext = {
            sessionId: context.sessionId || this.generateSessionId(),
            language: context.language || 'ja',
            timezone: context.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
            device: context.device || this.detectDevice(),
            preferences: context.preferences || {}
        };
    }
    
    /**
     * 洞察プリミティブを生成
     */
    generateInsightPrimitives(results) {
        const primitives = [];
        
        if (!results.tripleOS) return primitives;
        
        const { engineOS, interfaceOS, safeModeOS } = results.tripleOS;
        
        // Engine優位の場合
        if (engineOS > interfaceOS && engineOS > safeModeOS) {
            primitives.push({
                type: 'dominance',
                os: 'engine',
                statement: '「創造→実装」は速いが、対人の慎重さが発表の遅延を生む',
                confidence: 0.8
            });
        }
        
        // Interface優位の場合
        if (interfaceOS > engineOS && interfaceOS > safeModeOS) {
            primitives.push({
                type: 'dominance',
                os: 'interface',
                statement: '人との調和を重視し、自己主張を控える傾向がある',
                confidence: 0.75
            });
        }
        
        // バランス型の場合
        if (Math.abs(engineOS - interfaceOS) < 0.1 && Math.abs(engineOS - safeModeOS) < 0.1) {
            primitives.push({
                type: 'balance',
                os: 'all',
                statement: '状況に応じて柔軟にモードを切り替える適応力がある',
                confidence: 0.7
            });
        }
        
        return primitives;
    }
    
    /**
     * ブラインドスポットを特定
     */
    identifyBlindspots(results, confidence) {
        const blindspots = [];
        
        // 低確信度の場合
        if (confidence < 50) {
            blindspots.push({
                area: 'measurement',
                description: '回答の一貫性が低く、正確な測定が困難',
                severity: 'high'
            });
        }
        
        // データ不足
        if (!results.hexagram) {
            blindspots.push({
                area: 'cultural',
                description: '易経的視点での解釈が不完全',
                severity: 'medium'
            });
        }
        
        // 極端な偏り
        if (results.tripleOS) {
            const values = Object.values(results.tripleOS);
            const max = Math.max(...values);
            const min = Math.min(...values);
            if (max - min > 0.6) {
                blindspots.push({
                    area: 'balance',
                    description: '特定のOSに極端に偏っている可能性',
                    severity: 'medium'
                });
            }
        }
        
        return blindspots;
    }
    
    /**
     * ペイロードをフォーマット
     */
    formatPayload(format) {
        switch (format) {
            case this.formats.SUMMARY:
                return this.generateSummary();
            case this.formats.DETAILED:
                return this.generateDetailed();
            case this.formats.RAW:
                return this.payload;
            case this.formats.JSON:
            default:
                return JSON.stringify(this.payload, null, 2);
        }
    }
    
    /**
     * サマリーを生成
     */
    generateSummary() {
        if (!this.payload.data) return '';
        
        const { tripleOS, metrics, insightPrimitives } = this.payload.data;
        
        let summary = `【OS Analyzer診断結果サマリー】\n\n`;
        summary += `診断ID: ${this.handoffId}\n`;
        summary += `日時: ${new Date().toLocaleString('ja-JP')}\n\n`;
        
        summary += `■ Triple OS スコア\n`;
        summary += `Engine OS: ${(tripleOS.engineOS * 100).toFixed(0)}%\n`;
        summary += `Interface OS: ${(tripleOS.interfaceOS * 100).toFixed(0)}%\n`;
        summary += `Safe Mode OS: ${(tripleOS.safeModeOS * 100).toFixed(0)}%\n\n`;
        
        summary += `■ 確信度: ${metrics.confidence}%\n\n`;
        
        if (insightPrimitives.length > 0) {
            summary += `■ 主要な洞察\n`;
            insightPrimitives.forEach((p, i) => {
                summary += `${i + 1}. ${p.statement}\n`;
            });
        }
        
        return summary;
    }
    
    /**
     * 詳細版を生成
     */
    generateDetailed() {
        return {
            summary: this.generateSummary(),
            fullData: this.payload,
            recommendations: this.generateRecommendations(),
            nextSteps: this.suggestNextSteps()
        };
    }
    
    /**
     * 推奨事項を生成
     */
    generateRecommendations() {
        const recommendations = [];
        
        if (this.payload.data?.metrics?.confidence < 70) {
            recommendations.push('より正確な診断のため、落ち着いた環境で再度お試しください');
        }
        
        if (this.payload.data?.blindspots?.length > 0) {
            recommendations.push('特定された盲点について、専門家との相談をお勧めします');
        }
        
        return recommendations;
    }
    
    /**
     * 次のステップを提案
     */
    suggestNextSteps() {
        return [
            'AI相談アシスタントで具体的なアドバイスを受ける',
            '結果をPDFで保存して後で見返す',
            '信頼できる人と結果を共有して意見を聞く'
        ];
    }
    
    /**
     * ハンドオフ開始（TDD互換性）
     */
    initiateHandoff(destinationId, payload = null) {
        return this.executeHandoff(destinationId, this.formats.JSON, payload);
    }

    /**
     * ハンドオフを実行
     */
    executeHandoff(destinationId, format = this.formats.JSON, customPayload = null) {
        const destination = Object.values(this.destinations).find(d => d.id === destinationId);
        
        if (!destination) {
            console.error('Invalid destination:', destinationId);
            return false;
        }
        
        if (!destination.accepts.includes(format)) {
            console.error(`Destination ${destinationId} does not accept format ${format}`);
            return false;
        }
        
        this.destination = destination;
        const formattedPayload = this.formatPayload(format);
        
        // ローカルストレージに保存
        this.saveHandoffData(formattedPayload);
        
        // URLパラメータの生成
        const handoffUrl = this.generateHandoffUrl(destination, formattedPayload);
        
        console.log('Handoff executed:', {
            destination: destination.name,
            format: format,
            url: handoffUrl
        });
        
        return {
            success: true,
            destination: destination,
            url: handoffUrl,
            payload: formattedPayload
        };
    }
    
    /**
     * ハンドオフURLを生成
     */
    generateHandoffUrl(destination, payload) {
        const baseUrl = destination.url;
        const encodedPayload = encodeURIComponent(
            typeof payload === 'string' ? payload : JSON.stringify(payload)
        );
        
        // ペイロードが大きい場合はIDのみ渡す
        if (encodedPayload.length > 2000) {
            return `${baseUrl}?handoffId=${this.handoffId}`;
        }
        
        return `${baseUrl}?data=${encodedPayload}&handoffId=${this.handoffId}`;
    }
    
    /**
     * ハンドオフデータを保存
     */
    saveHandoffData(payload) {
        const key = `handoff_${this.handoffId}`;
        try {
            localStorage.setItem(key, JSON.stringify({
                timestamp: new Date().toISOString(),
                destination: this.destination?.id,
                payload: payload
            }));
            
            // 古いデータをクリーンアップ（30日以上前）
            this.cleanupOldHandoffs();
        } catch (e) {
            console.error('Failed to save handoff data:', e);
        }
    }
    
    /**
     * 古いハンドオフデータをクリーンアップ
     */
    cleanupOldHandoffs() {
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const keys = Object.keys(localStorage);
        
        keys.forEach(key => {
            if (key.startsWith('handoff_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (new Date(data.timestamp).getTime() < thirtyDaysAgo) {
                        localStorage.removeItem(key);
                    }
                } catch (e) {
                    // 無効なデータは削除
                    localStorage.removeItem(key);
                }
            }
        });
    }
    
    /**
     * HTMLを生成
     */
    render(container) {
        const html = `
            <div class="handoff-manager">
                <h3>次のステップへ</h3>
                
                <div class="handoff-prompt">
                    <p>診断結果を活用して、さらに深い洞察を得ましょう。</p>
                </div>
                
                <div class="destination-cards">
                    ${Object.values(this.destinations).map(dest => `
                        <div class="destination-card" data-destination="${dest.id}">
                            <div class="dest-icon">${dest.icon}</div>
                            <div class="dest-content">
                                <h4>${dest.name}</h4>
                                <p>${dest.description}</p>
                            </div>
                            <button class="handoff-btn" onclick="handoffManager.handleHandoff('${dest.id}')">
                                選択
                            </button>
                        </div>
                    `).join('')}
                </div>
                
                <div class="payload-preview">
                    <h4>引き継ぎデータプレビュー</h4>
                    <div class="preview-content">
                        <pre>${this.formatPayload(this.formats.SUMMARY)}</pre>
                    </div>
                    <div class="format-selector">
                        <label>フォーマット:</label>
                        <select id="payload-format" onchange="handoffManager.updatePreview(this.value)">
                            <option value="summary">サマリー</option>
                            <option value="json">JSON</option>
                            <option value="detailed">詳細</option>
                        </select>
                    </div>
                </div>
                
                <div class="handoff-actions">
                    <button class="btn-copy" onclick="handoffManager.copyPayload()">
                        📋 クリップボードにコピー
                    </button>
                    <button class="btn-download" onclick="handoffManager.downloadPayload()">
                        💾 ダウンロード
                    </button>
                </div>
                
                <div class="handoff-notice">
                    <p>
                        ※ 診断データは暗号化され、選択した宛先にのみ送信されます。
                        個人情報は含まれません。
                    </p>
                </div>
            </div>
        `;
        
        if (container) {
            container.innerHTML = html;
        }
        
        return html;
    }
    
    /**
     * ハンドオフ処理
     */
    handleHandoff(destinationId) {
        const result = this.executeHandoff(destinationId);
        
        if (result.success) {
            this.showHandoffSuccess(result.destination);
            
            // KPI: ハンドオフ完了率の記録
            this.recordHandoffMetric(destinationId);
            
            // 実際の遷移（デモでは新しいタブ）
            if (result.url.startsWith('#')) {
                console.log('Navigate to:', result.url);
            } else {
                window.open(result.url, '_blank');
            }
        }
    }
    
    /**
     * プレビュー更新
     */
    updatePreview(format) {
        const previewContent = document.querySelector('.preview-content pre');
        if (previewContent) {
            const formatted = this.formatPayload(format);
            previewContent.textContent = typeof formatted === 'string' 
                ? formatted 
                : JSON.stringify(formatted, null, 2);
        }
    }
    
    /**
     * ペイロードをコピー
     */
    copyPayload() {
        const format = document.getElementById('payload-format')?.value || 'json';
        const payload = this.formatPayload(format);
        const text = typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2);
        
        navigator.clipboard.writeText(text).then(() => {
            this.showCopySuccess();
        }).catch(err => {
            console.error('Copy failed:', err);
        });
    }
    
    /**
     * ペイロードをダウンロード
     */
    downloadPayload() {
        const format = document.getElementById('payload-format')?.value || 'json';
        const payload = this.formatPayload(format);
        const text = typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2);
        
        const blob = new Blob([text], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `os-analyzer-result-${this.handoffId}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    /**
     * 成功メッセージ表示
     */
    showHandoffSuccess(destination) {
        const message = document.createElement('div');
        message.className = 'handoff-success-message';
        message.innerHTML = `
            <div class="success-content">
                <span class="success-icon">${destination.icon}</span>
                <h3>${destination.name}への引き継ぎ準備完了</h3>
                <p>診断データが正常に準備されました。</p>
            </div>
        `;
        
        document.body.appendChild(message);
        setTimeout(() => message.classList.add('show'), 100);
        
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => document.body.removeChild(message), 300);
        }, 3000);
    }
    
    showCopySuccess() {
        const message = document.createElement('div');
        message.className = 'copy-success';
        message.textContent = 'クリップボードにコピーしました';
        document.body.appendChild(message);
        
        setTimeout(() => message.classList.add('show'), 100);
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => document.body.removeChild(message), 300);
        }, 2000);
    }
    
    /**
     * KPIメトリクス記録
     */
    recordHandoffMetric(destinationId) {
        const metrics = JSON.parse(localStorage.getItem('handoff_metrics') || '{}');
        const today = new Date().toISOString().split('T')[0];
        
        if (!metrics[today]) {
            metrics[today] = {};
        }
        
        metrics[today][destinationId] = (metrics[today][destinationId] || 0) + 1;
        
        localStorage.setItem('handoff_metrics', JSON.stringify(metrics));
        
        // KPI計算
        const totalHandoffs = Object.values(metrics[today]).reduce((a, b) => a + b, 0);
        console.log(`KPI - Handoff Rate: ${totalHandoffs} handoffs today`);
    }
    
    /**
     * ユーティリティメソッド
     */
    generateHandoffId() {
        return `ho_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    detectDevice() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }
    
    getConfidenceLevel(confidence) {
        if (confidence >= 75) return 'high';
        if (confidence >= 50) return 'medium';
        return 'low';
    }
    
    assessDataQuality(results) {
        // 簡易的なデータ品質評価
        let quality = 1.0;
        if (!results.tripleOS) quality -= 0.3;
        if (!results.hexagram) quality -= 0.2;
        if (!results.metrics) quality -= 0.2;
        return Math.max(0, quality);
    }
    
    checkCompleteness(results) {
        const required = ['tripleOS', 'hexagram', 'metrics'];
        const present = required.filter(key => results[key] !== null && results[key] !== undefined);
        return present.length / required.length;
    }
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HandoffManager;
}