/**
 * Switch Lenses アニメーション実装
 * Phase 2: Zone C - インタラクティブな条件反転シミュレーション
 */

class AnimatedSwitchLenses {
    constructor(container, baseScores = null) {
        this.container = container;
        this.baseScores = baseScores || {
            engine: 0.33,
            interface: 0.33,
            safe: 0.34
        };
        
        // アニメーション設定
        this.animationConfig = {
            duration: 300,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fps: 60
        };
        
        // 係数行列（v2.1仕様準拠）
        this.matrix = [
            [-0.10, +0.00, +0.10],  // U: 不確実性
            [+0.12, -0.08, -0.04],  // T: 時間圧力
            [-0.05, -0.12, +0.17]   // R: 社会的リスク
        ];
        
        this.sensitivity = 1.2;
        
        // 現在値
        this.currentValues = {
            uncertainty: 0.5,
            timePressure: 0.5,
            socialRisk: 0.5
        };
        
        // アニメーション状態
        this.animationFrames = new Map();
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        this.render();
        this.attachEventListeners();
        this.startAutoAnimation();
    }
    
    render() {
        this.container.innerHTML = `
            <div class="switch-lenses-container">
                <h3 class="zone-title">Switch Lenses - 条件反転シミュレーション</h3>
                
                <div class="sliders-grid">
                    ${this.renderSlider('uncertainty', '不確実性', this.currentValues.uncertainty)}
                    ${this.renderSlider('timePressure', '時間圧力', this.currentValues.timePressure)}
                    ${this.renderSlider('socialRisk', '社会的リスク', this.currentValues.socialRisk)}
                </div>
                
                <div class="visualization-container">
                    <canvas id="switch-visualization" width="400" height="300"></canvas>
                    <div class="mode-indicator">
                        <span class="mode-label">予測モード:</span>
                        <span class="mode-value" id="predicted-mode">Balanced</span>
                    </div>
                </div>
                
                <div class="predictions-panel">
                    <h4>状況予測</h4>
                    <div id="predictions-content" class="predictions-content">
                        <!-- 動的に生成される予測内容 -->
                    </div>
                </div>
                
                <div class="preset-scenarios">
                    <h4>シナリオプリセット</h4>
                    <div class="preset-buttons">
                        ${this.renderPresetButtons()}
                    </div>
                </div>
            </div>
        `;
        
        this.canvas = document.getElementById('switch-visualization');
        this.ctx = this.canvas.getContext('2d');
        
        // 初期描画
        this.updateVisualization();
    }
    
    renderSlider(id, label, value) {
        const percentage = Math.round(value * 100);
        
        return `
            <div class="slider-group" data-slider="${id}">
                <div class="slider-header">
                    <label for="${id}-slider">${label}</label>
                    <span class="slider-value">${percentage}%</span>
                </div>
                <div class="slider-container">
                    <input 
                        type="range" 
                        id="${id}-slider" 
                        min="0" 
                        max="100" 
                        value="${percentage}"
                        class="animated-slider"
                    >
                    <div class="slider-track">
                        <div class="slider-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
                <div class="slider-labels">
                    <span class="label-low">低</span>
                    <span class="label-mid">中</span>
                    <span class="label-high">高</span>
                </div>
            </div>
        `;
    }
    
    renderPresetButtons() {
        const presets = [
            { id: 'calm', label: '平常時', icon: '☀️' },
            { id: 'pressure', label: '締切直前', icon: '⏰' },
            { id: 'social', label: '重要会議', icon: '👥' },
            { id: 'chaos', label: 'カオス', icon: '🌪️' }
        ];
        
        return presets.map(preset => `
            <button class="preset-btn" data-preset="${preset.id}">
                <span class="preset-icon">${preset.icon}</span>
                <span class="preset-label">${preset.label}</span>
            </button>
        `).join('');
    }
    
    attachEventListeners() {
        // スライダーイベント
        this.container.querySelectorAll('.animated-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const id = e.target.id.replace('-slider', '');
                const value = e.target.value / 100;
                this.animateToValue(id, value);
            });
            
            // タッチサポート
            slider.addEventListener('touchstart', (e) => {
                this.handleTouchStart(e);
            });
            
            slider.addEventListener('touchmove', (e) => {
                this.handleTouchMove(e);
            });
        });
        
        // プリセットボタン
        this.container.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.currentTarget.dataset.preset;
                this.applyPreset(preset);
            });
        });
    }
    
    animateToValue(parameter, targetValue) {
        const startValue = this.currentValues[parameter];
        const delta = targetValue - startValue;
        
        if (Math.abs(delta) < 0.01) return;
        
        // 既存のアニメーションをキャンセル
        if (this.animationFrames.has(parameter)) {
            cancelAnimationFrame(this.animationFrames.get(parameter));
        }
        
        const startTime = performance.now();
        const duration = this.animationConfig.duration;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // イージング関数適用
            const easedProgress = this.easeInOutCubic(progress);
            
            // 値を更新
            this.currentValues[parameter] = startValue + delta * easedProgress;
            
            // UI更新
            this.updateSliderUI(parameter, this.currentValues[parameter]);
            this.updateVisualization();
            this.updatePredictions();
            
            if (progress < 1) {
                const frameId = requestAnimationFrame(animate);
                this.animationFrames.set(parameter, frameId);
            } else {
                this.animationFrames.delete(parameter);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    updateSliderUI(parameter, value) {
        const slider = this.container.querySelector(`[data-slider="${parameter}"]`);
        if (!slider) return;
        
        const percentage = Math.round(value * 100);
        
        // 値表示を更新
        slider.querySelector('.slider-value').textContent = `${percentage}%`;
        
        // フィルを更新
        const fill = slider.querySelector('.slider-fill');
        if (fill) {
            fill.style.width = `${percentage}%`;
            
            // 色の変化
            const hue = 120 - (value * 120); // 緑→赤
            fill.style.background = `linear-gradient(90deg, 
                hsl(${hue}, 70%, 50%), 
                hsl(${hue - 20}, 80%, 60%))`;
        }
    }
    
    updateVisualization() {
        const { uncertainty, timePressure, socialRisk } = this.currentValues;
        
        // 新しいOS配分を計算
        const newScores = this.calculateNewScores(uncertainty, timePressure, socialRisk);
        
        // Canvas描画
        this.drawVisualization(newScores);
        
        // モード表示更新
        this.updateModeIndicator(newScores);
    }
    
    calculateNewScores(U, T, R) {
        const conditions = [U, T, R];
        
        // 変化量計算
        const deltas = [0, 0, 0];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                deltas[j] += conditions[i] * this.matrix[i][j];
            }
        }
        
        // 重み更新（対数空間）
        const logWeights = [
            Math.log(this.baseScores.engine + 0.01),
            Math.log(this.baseScores.interface + 0.01),
            Math.log(this.baseScores.safe + 0.01)
        ];
        
        const adjustedLogWeights = logWeights.map((w, i) => 
            w + this.sensitivity * deltas[i]
        );
        
        // Softmax正規化
        const maxLog = Math.max(...adjustedLogWeights);
        const expWeights = adjustedLogWeights.map(w => 
            Math.exp(w - maxLog)
        );
        const sumExp = expWeights.reduce((a, b) => a + b, 0);
        
        return {
            engine: expWeights[0] / sumExp,
            interface: expWeights[1] / sumExp,
            safe: expWeights[2] / sumExp
        };
    }
    
    drawVisualization(scores) {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // クリア
        ctx.clearRect(0, 0, width, height);
        
        // 背景グラデーション
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.05)');
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0.05)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // 三角形描画
        this.drawTriangle(ctx, scores);
        
        // バー描画
        this.drawBars(ctx, scores);
        
        // アニメーション波形
        this.drawWaveform(ctx, scores);
    }
    
    drawTriangle(ctx, scores) {
        const centerX = 200;
        const centerY = 150;
        const radius = 80;
        
        // 頂点計算
        const vertices = [
            { x: centerX, y: centerY - radius, label: 'Engine', color: '#E74C3C' },
            { x: centerX - radius * 0.866, y: centerY + radius * 0.5, label: 'Interface', color: '#3498DB' },
            { x: centerX + radius * 0.866, y: centerY + radius * 0.5, label: 'Safe', color: '#27AE60' }
        ];
        
        // 三角形の輪郭
        ctx.beginPath();
        ctx.moveTo(vertices[0].x, vertices[0].y);
        vertices.forEach(v => ctx.lineTo(v.x, v.y));
        ctx.closePath();
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 重心点
        const barycenter = {
            x: centerX + (scores.engine - scores.interface) * radius * 0.5,
            y: centerY + (scores.safe - (scores.engine + scores.interface) / 2) * radius * 0.866
        };
        
        // 重心点描画（アニメーション）
        const time = Date.now() / 1000;
        const pulse = Math.sin(time * 2) * 0.2 + 1;
        
        ctx.beginPath();
        ctx.arc(barycenter.x, barycenter.y, 8 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(168, 85, 247, 0.8)';
        ctx.fill();
        
        // ラベル
        vertices.forEach((v, i) => {
            const score = i === 0 ? scores.engine : i === 1 ? scores.interface : scores.safe;
            
            ctx.font = '12px sans-serif';
            ctx.fillStyle = v.color;
            ctx.textAlign = 'center';
            ctx.fillText(v.label, v.x, v.y - 15);
            ctx.fillText(`${(score * 100).toFixed(0)}%`, v.x, v.y - 30);
        });
    }
    
    drawBars(ctx, scores) {
        const startX = 320;
        const startY = 50;
        const barWidth = 20;
        const maxHeight = 180;
        const spacing = 30;
        
        const data = [
            { label: 'E', value: scores.engine, color: '#E74C3C' },
            { label: 'I', value: scores.interface, color: '#3498DB' },
            { label: 'S', value: scores.safe, color: '#27AE60' }
        ];
        
        data.forEach((item, i) => {
            const x = startX + i * (barWidth + spacing);
            const height = item.value * maxHeight;
            const y = startY + maxHeight - height;
            
            // バー本体
            ctx.fillStyle = item.color;
            ctx.fillRect(x, y, barWidth, height);
            
            // グロー効果
            ctx.shadowColor = item.color;
            ctx.shadowBlur = 10;
            ctx.fillRect(x, y, barWidth, height);
            ctx.shadowBlur = 0;
            
            // ラベル
            ctx.fillStyle = '#E2E8F0';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(item.label, x + barWidth / 2, startY + maxHeight + 20);
        });
    }
    
    drawWaveform(ctx, scores) {
        const time = Date.now() / 1000;
        const startX = 10;
        const endX = 390;
        const centerY = 280;
        const amplitude = 10;
        
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
        ctx.lineWidth = 1;
        
        for (let x = startX; x <= endX; x += 2) {
            const progress = (x - startX) / (endX - startX);
            const wave = Math.sin((progress * 4 + time) * Math.PI) * amplitude;
            const modulation = scores.engine * 0.3 + scores.interface * 0.3 + scores.safe * 0.4;
            const y = centerY + wave * modulation;
            
            if (x === startX) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
    }
    
    updateModeIndicator(scores) {
        const max = Math.max(scores.engine, scores.interface, scores.safe);
        let mode = 'Balanced';
        let color = '#6366F1';
        
        if (max === scores.engine) {
            mode = 'Engine主導';
            color = '#E74C3C';
        } else if (max === scores.interface) {
            mode = 'Interface主導';
            color = '#3498DB';
        } else if (max === scores.safe) {
            mode = 'Safe主導';
            color = '#27AE60';
        }
        
        const modeElement = document.getElementById('predicted-mode');
        if (modeElement) {
            modeElement.textContent = mode;
            modeElement.style.color = color;
            
            // パルスアニメーション
            modeElement.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                modeElement.style.animation = '';
            }, 500);
        }
    }
    
    updatePredictions() {
        const { uncertainty, timePressure, socialRisk } = this.currentValues;
        const predictions = [];
        
        // 不確実性の影響
        if (uncertainty > 0.7) {
            predictions.push({
                icon: '⚠️',
                text: '高い不確実性により、Safe Mode OSが活性化します'
            });
        } else if (uncertainty < 0.3) {
            predictions.push({
                icon: '✨',
                text: '明確な状況で、Engine OSが効率的に機能します'
            });
        }
        
        // 時間圧力の影響
        if (timePressure > 0.7) {
            predictions.push({
                icon: '⏱️',
                text: '時間圧力により、直感的な判断が優先されます'
            });
        } else if (timePressure < 0.3) {
            predictions.push({
                icon: '🎯',
                text: '十分な時間があり、熟考した選択が可能です'
            });
        }
        
        // 社会的リスクの影響
        if (socialRisk > 0.7) {
            predictions.push({
                icon: '🛡️',
                text: 'Interface OSが強化され、慎重な対応を取ります'
            });
        } else if (socialRisk < 0.3) {
            predictions.push({
                icon: '💫',
                text: '自然な自己表現が可能な環境です'
            });
        }
        
        // 複合パターン
        if (uncertainty > 0.6 && timePressure > 0.6) {
            predictions.push({
                icon: '🔥',
                text: 'ストレスフルな状況：バランスの再調整が必要です'
            });
        }
        
        const predictionsContent = document.getElementById('predictions-content');
        if (predictionsContent) {
            predictionsContent.innerHTML = predictions.map(p => `
                <div class="prediction-item">
                    <span class="prediction-icon">${p.icon}</span>
                    <span class="prediction-text">${p.text}</span>
                </div>
            `).join('');
        }
    }
    
    applyPreset(presetId) {
        const presets = {
            calm: { uncertainty: 0.2, timePressure: 0.2, socialRisk: 0.3 },
            pressure: { uncertainty: 0.4, timePressure: 0.9, socialRisk: 0.5 },
            social: { uncertainty: 0.5, timePressure: 0.4, socialRisk: 0.8 },
            chaos: { uncertainty: 0.9, timePressure: 0.8, socialRisk: 0.7 }
        };
        
        const preset = presets[presetId];
        if (!preset) return;
        
        // 全パラメータをアニメーション
        Object.entries(preset).forEach(([param, value]) => {
            this.animateToValue(param, value);
            
            // スライダーも更新
            const slider = document.getElementById(`${param}-slider`);
            if (slider) {
                slider.value = value * 100;
            }
        });
        
        // ボタンにフィードバック
        const btn = this.container.querySelector(`[data-preset="${presetId}"]`);
        if (btn) {
            btn.classList.add('active');
            setTimeout(() => btn.classList.remove('active'), 1000);
        }
    }
    
    startAutoAnimation() {
        // 初期アニメーション（ユーザーの注意を引く）
        setTimeout(() => {
            this.demoAnimation();
        }, 1000);
    }
    
    demoAnimation() {
        const sequence = [
            { param: 'uncertainty', value: 0.7, delay: 0 },
            { param: 'timePressure', value: 0.3, delay: 500 },
            { param: 'socialRisk', value: 0.6, delay: 1000 },
            { param: 'uncertainty', value: 0.5, delay: 2000 },
            { param: 'timePressure', value: 0.5, delay: 2500 },
            { param: 'socialRisk', value: 0.5, delay: 3000 }
        ];
        
        sequence.forEach(step => {
            setTimeout(() => {
                this.animateToValue(step.param, step.value);
                const slider = document.getElementById(`${step.param}-slider`);
                if (slider) slider.value = step.value * 100;
            }, step.delay);
        });
    }
    
    handleTouchStart(e) {
        e.preventDefault();
        this.touchStartX = e.touches[0].clientX;
        this.touchStartValue = parseFloat(e.target.value);
    }
    
    handleTouchMove(e) {
        if (!this.touchStartX) return;
        
        e.preventDefault();
        const currentX = e.touches[0].clientX;
        const deltaX = currentX - this.touchStartX;
        const sliderWidth = e.target.offsetWidth;
        const deltaValue = (deltaX / sliderWidth) * 100;
        
        const newValue = Math.max(0, Math.min(100, this.touchStartValue + deltaValue));
        e.target.value = newValue;
        
        const event = new Event('input', { bubbles: true });
        e.target.dispatchEvent(event);
    }
    
    easeInOutCubic(t) {
        return t < 0.5 
            ? 4 * t * t * t 
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
}

// スタイル定義
const styles = `
<style>
.switch-lenses-container {
    padding: 1.5rem;
}

.sliders-grid {
    display: grid;
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.slider-group {
    background: rgba(15, 23, 42, 0.4);
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid rgba(99, 102, 241, 0.2);
}

.slider-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.slider-value {
    font-weight: 600;
    color: #8B5CF6;
}

.slider-container {
    position: relative;
    margin-bottom: 0.5rem;
}

.slider-track {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    height: 8px;
    background: rgba(99, 102, 241, 0.1);
    border-radius: 4px;
    pointer-events: none;
}

.slider-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease, background 0.3s ease;
}

.animated-slider {
    position: relative;
    z-index: 1;
}

.slider-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: #64748B;
}

.visualization-container {
    background: rgba(15, 23, 42, 0.6);
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 1.5rem;
}

#switch-visualization {
    width: 100%;
    height: auto;
    display: block;
}

.mode-indicator {
    text-align: center;
    margin-top: 1rem;
    padding: 0.5rem;
    background: rgba(99, 102, 241, 0.1);
    border-radius: 6px;
}

.mode-value {
    font-size: 1.25rem;
    font-weight: 700;
    transition: color 0.3s ease;
}

.predictions-panel {
    background: rgba(15, 23, 42, 0.4);
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1.5rem;
}

.prediction-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    margin: 0.5rem 0;
    background: rgba(99, 102, 241, 0.05);
    border-radius: 6px;
    animation: slideIn 0.3s ease;
}

.prediction-icon {
    font-size: 1.25rem;
}

.preset-scenarios {
    background: rgba(15, 23, 42, 0.4);
    border-radius: 8px;
    padding: 1rem;
}

.preset-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.preset-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.75rem;
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 6px;
    color: #E2E8F0;
    cursor: pointer;
    transition: all 0.2s ease;
}

.preset-btn:hover {
    background: rgba(99, 102, 241, 0.2);
    transform: translateY(-2px);
}

.preset-btn.active {
    background: rgba(99, 102, 241, 0.3);
    border-color: #6366F1;
    animation: pulse 0.5s ease;
}

.preset-icon {
    font-size: 1.5rem;
}

.preset-label {
    font-size: 0.875rem;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
    .preset-buttons {
        grid-template-columns: repeat(2, 1fr);
    }
    
    #switch-visualization {
        height: 250px;
    }
}
</style>
`;

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnimatedSwitchLenses, styles };
}