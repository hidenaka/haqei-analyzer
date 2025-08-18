/**
 * Triple OS Fingerprint Visualization System
 * v2.1 Implementation - Zone A
 * Based on 20250812_OS_ANALYZER_RESULTS_PAGE_V2.1_IMPLEMENTATION_READY.md
 */

class TripleOSFingerprint {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas?.getContext('2d');
        
        // カラーシステム定義（v2.1仕様準拠）
        this.colors = {
            engine: {
                primary: '#E74C3C',
                light: '#EC7063',
                dark: '#C0392B'
            },
            interface: {
                primary: '#3498DB',
                light: '#5DADE2',
                dark: '#2874A6'
            },
            safe: {
                primary: '#27AE60',
                light: '#52BE80',
                dark: '#1E8449'
            },
            synergy: {
                high: '#2ECC71',
                medium: '#F1C40F',
                low: '#95A5A6'
            },
            tension: {
                high: '#E74C3C',
                medium: '#E67E22',
                low: '#BDC3C7'
            },
            confidence: {
                high: '#16A085',
                medium: '#F39C12',
                low: '#E74C3C'
            }
        };
        
        // 三角形の頂点座標
        this.vertices = {
            engine: { x: 250, y: 80, label: 'Engine OS' },
            interface: { x: 100, y: 320, label: 'Interface OS' },
            safe: { x: 400, y: 320, label: 'Safe Mode OS' }
        };
        
        // アニメーション設定
        this.animationConfig = {
            initial: {
                duration: 800,
                easing: this.easeOutCubic,
                sequence: ['vertices', 'edges', 'centroid']
            },
            switchLens: {
                duration: 400,
                easing: this.easeOut,
                morphing: true
            }
        };
        
        this.currentAnimation = null;
        this.setupCanvas();
    }
    
    setupCanvas() {
        if (!this.canvas) return;
        
        // Retina対応
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.ctx.scale(dpr, dpr);
        
        // キャンバスサイズに応じて頂点座標を調整
        this.adjustVertices(rect.width, rect.height);
    }
    
    adjustVertices(width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.35;
        
        // 正三角形の頂点を計算
        this.vertices = {
            engine: {
                x: centerX,
                y: centerY - radius,
                label: 'Engine OS'
            },
            interface: {
                x: centerX - radius * Math.cos(Math.PI / 6),
                y: centerY + radius * Math.sin(Math.PI / 6),
                label: 'Interface OS'
            },
            safe: {
                x: centerX + radius * Math.cos(Math.PI / 6),
                y: centerY + radius * Math.sin(Math.PI / 6),
                label: 'Safe Mode OS'
            }
        };
    }
    
    /**
     * メイン描画メソッド
     * @param {Object} data - Triple OSのスコアとメトリクス
     */
    draw(data) {
        if (!this.ctx) return;
        
        // キャンバスクリア
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 背景グラデーション
        this.drawBackground();
        
        // 三角形の辺を描画（シナジー/テンション表示）
        this.drawEdges(data.metrics);
        
        // 頂点を描画
        this.drawVertices(data.scores);
        
        // 重心点を描画
        const centroid = this.calculateCentroid(data.scores);
        this.drawCentroid(centroid, data.metrics.confidence);
        
        // ラベルを描画
        this.drawLabels(data.scores);
    }
    
    drawBackground() {
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2
        );
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.02)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * 辺の描画（シナジー/テンション可視化）
     */
    drawEdges(metrics) {
        const edges = [
            { from: 'engine', to: 'interface', synergy: metrics.synergy_edges.EI },
            { from: 'interface', to: 'safe', synergy: metrics.synergy_edges.IS },
            { from: 'safe', to: 'engine', synergy: metrics.synergy_edges.ES }
        ];
        
        edges.forEach(edge => {
            const from = this.vertices[edge.from];
            const to = this.vertices[edge.to];
            
            // 線の太さ = シナジー強度（2-10px）
            const lineWidth = 2 + edge.synergy * 8;
            
            // 線の色 = シナジーレベル
            let strokeColor;
            if (edge.synergy >= 0.6) {
                strokeColor = this.colors.synergy.high;
            } else if (edge.synergy >= 0.3) {
                strokeColor = this.colors.synergy.medium;
            } else {
                strokeColor = this.colors.synergy.low;
            }
            
            // テンションが高い場合は破線
            const tension = metrics.tension || 0;
            if (tension > 0.5) {
                this.ctx.setLineDash([10, 5]);
            } else {
                this.ctx.setLineDash([]);
            }
            
            this.ctx.strokeStyle = strokeColor;
            this.ctx.lineWidth = lineWidth;
            this.ctx.globalAlpha = 0.3 + edge.synergy * 0.5;
            
            this.ctx.beginPath();
            this.ctx.moveTo(from.x, from.y);
            this.ctx.lineTo(to.x, to.y);
            this.ctx.stroke();
            
            this.ctx.globalAlpha = 1;
            this.ctx.setLineDash([]);
        });
    }
    
    /**
     * 頂点の描画
     */
    drawVertices(scores) {
        Object.entries(this.vertices).forEach(([osType, vertex]) => {
            const score = scores[osType];
            const radius = 8 + score * 12; // 8-20px
            
            // 外枠
            this.ctx.strokeStyle = this.colors[osType].primary;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(vertex.x, vertex.y, radius, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // 内部塗り（スコアに応じた透明度）
            this.ctx.fillStyle = this.hexToRgba(
                this.colors[osType].primary,
                score * 0.3 + 0.2
            );
            this.ctx.fill();
        });
    }
    
    /**
     * 重心点の計算と描画
     */
    calculateCentroid(scores) {
        const weights = {
            engine: scores.engine || 0.33,
            interface: scores.interface || 0.33,
            safe: scores.safe || 0.34
        };
        
        const total = weights.engine + weights.interface + weights.safe;
        
        return {
            x: (this.vertices.engine.x * weights.engine +
                this.vertices.interface.x * weights.interface +
                this.vertices.safe.x * weights.safe) / total,
            y: (this.vertices.engine.y * weights.engine +
                this.vertices.interface.y * weights.interface +
                this.vertices.safe.y * weights.safe) / total
        };
    }
    
    drawCentroid(point, confidence) {
        // コンフィデンスに応じた表示
        if (confidence < 0.5) {
            // 低精度：点線円＋警告色
            this.ctx.setLineDash([5, 5]);
            this.ctx.strokeStyle = this.colors.confidence.low;
            this.ctx.fillStyle = this.hexToRgba(this.colors.confidence.low, 0.1);
            
            // パルスアニメーション追加
            this.addPulseAnimation(point);
        } else if (confidence < 0.75) {
            // 中精度
            this.ctx.setLineDash([]);
            this.ctx.strokeStyle = this.colors.confidence.medium;
            this.ctx.fillStyle = this.hexToRgba(this.colors.confidence.medium, 0.1);
        } else {
            // 高精度
            this.ctx.setLineDash([]);
            this.ctx.strokeStyle = this.colors.confidence.high;
            this.ctx.fillStyle = this.hexToRgba(this.colors.confidence.high, 0.1);
        }
        
        // 輪郭の太さ = confidence（2-8px）
        this.ctx.lineWidth = 2 + confidence * 6;
        
        // 重心点描画
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
    }
    
    /**
     * ラベル描画
     */
    drawLabels(scores) {
        this.ctx.font = 'bold 12px sans-serif';
        this.ctx.textAlign = 'center';
        
        Object.entries(this.vertices).forEach(([osType, vertex]) => {
            const score = scores[osType];
            const radius = 8 + score * 12;
            
            // OSタイプラベル
            this.ctx.fillStyle = this.colors[osType].primary;
            this.ctx.fillText(
                vertex.label.toUpperCase(),
                vertex.x,
                vertex.y - radius - 8
            );
            
            // スコア表示
            this.ctx.font = '10px sans-serif';
            this.ctx.fillStyle = '#94a3b8';
            this.ctx.fillText(
                `${Math.round(score * 100)}%`,
                vertex.x,
                vertex.y + radius + 16
            );
        });
    }
    
    /**
     * パルスアニメーション（低精度時）
     */
    addPulseAnimation(point) {
        if (this.currentAnimation) return;
        
        let scale = 0.95;
        let growing = true;
        const animate = () => {
            if (growing) {
                scale += 0.003;
                if (scale >= 1.05) growing = false;
            } else {
                scale -= 0.003;
                if (scale <= 0.95) growing = true;
            }
            
            this.ctx.save();
            this.ctx.globalAlpha = 0.3;
            this.ctx.strokeStyle = this.colors.confidence.low;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 15 * scale, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.restore();
            
            this.currentAnimation = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * Switch Lenses更新時のアニメーション
     */
    animateTransition(beforeState, afterState) {
        const startTime = performance.now();
        const duration = this.animationConfig.switchLens.duration;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = this.animationConfig.switchLens.easing(progress);
            
            // 補間されたスコアを計算
            const interpolatedScores = {
                engine: this.lerp(beforeState.engine, afterState.engine, eased),
                interface: this.lerp(beforeState.interface, afterState.interface, eased),
                safe: this.lerp(beforeState.safe, afterState.safe, eased)
            };
            
            // 再描画
            this.draw({
                scores: interpolatedScores,
                metrics: afterState.metrics
            });
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    // ユーティリティメソッド
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    lerp(start, end, t) {
        return start + (end - start) * t;
    }
    
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    easeOut(t) {
        return 1 - Math.pow(1 - t, 2);
    }
    
    /**
     * リサイズ対応
     */
    resize() {
        this.setupCanvas();
    }
    
    /**
     * クリーンアップ
     */
    destroy() {
        if (this.currentAnimation) {
            cancelAnimationFrame(this.currentAnimation);
        }
        this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TripleOSFingerprint;
}