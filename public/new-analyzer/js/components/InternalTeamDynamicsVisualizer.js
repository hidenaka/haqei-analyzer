// InternalTeamDynamicsVisualizer.js - 内的チーム力学の可視化コンポーネント
// HaQei Analyzer - Internal Team Dynamics Visualization Component

class InternalTeamDynamicsVisualizer extends BaseComponent {
    constructor(containerId, options = {}) {
        super(containerId, options);
        this.animationId = null;
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.radarChart = null;
        this.currentDynamics = null;
    }

    get defaultOptions() {
        return {
            ...super.defaultOptions,
            width: 600,
            height: 400,
            enableParticles: true,
            enableRadar: true,
            animationSpeed: 1.0,
            particleCount: 50,
            showLabels: true,
        };
    }

    /**
     * 内的チーム力学データを設定
     * @param {Object} analysisResult - 3層OS分析結果
     * @param {Object} compatibilityData - 相性分析データ
     */
    setDynamicsData(analysisResult, compatibilityData) {
        this.currentDynamics = this._processDynamicsData(analysisResult, compatibilityData);
        console.log("🎯 InternalTeamDynamicsVisualizer: Dynamics data set", this.currentDynamics);
    }

    /**
     * 内的チーム力学データを処理
     */
    _processDynamicsData(analysisResult, compatibilityData) {
        const { engineOS, interfaceOS, safeModeOS } = analysisResult;
        
        // 5次元評価軸
        const dimensions = {
            energy: this._calculateEnergyDimension(engineOS, interfaceOS, safeModeOS),
            harmony: this._calculateHarmonyDimension(compatibilityData),
            stability: this._calculateStabilityDimension(safeModeOS),
            adaptability: this._calculateAdaptabilityDimension(interfaceOS),
            integration: this._calculateIntegrationDimension(analysisResult.consistencyScore)
        };

        // エネルギーフローの計算
        const energyFlow = this._calculateEnergyFlow(compatibilityData);

        // 統合パスの計算
        const integrationPath = this._calculateIntegrationPath(dimensions);

        return {
            dimensions,
            energyFlow,
            integrationPath,
            osData: { engineOS, interfaceOS, safeModeOS }
        };
    }

    /**
     * 5次元のうち各次元を計算
     */
    _calculateEnergyDimension(engineOS, interfaceOS, safeModeOS) {
        // エンジンOSの強度を基準にエネルギー次元を計算
        const engineStrength = engineOS.strength || 0.5;
        const interfaceMatch = interfaceOS.matchScore || 50;
        const safeModeActivation = safeModeOS.activationLevel || 0.3;
        
        return (engineStrength + (interfaceMatch / 100) + (1 - safeModeActivation)) / 3;
    }

    _calculateHarmonyDimension(compatibilityData) {
        if (!compatibilityData || !compatibilityData.engineInterface) return 0.5;
        
        const { synergy, harmony, tension, conflict } = compatibilityData.engineInterface;
        return (synergy + harmony - tension - conflict + 2) / 4; // -1~1を0~1に正規化
    }

    _calculateStabilityDimension(safeModeOS) {
        // セーフモードOSの安定性指標
        return 1 - (safeModeOS.activationLevel || 0.3);
    }

    _calculateAdaptabilityDimension(interfaceOS) {
        // インターフェースOSの適応性
        return (interfaceOS.matchScore || 50) / 100;
    }

    _calculateIntegrationDimension(consistencyScore) {
        return consistencyScore?.overall || 0.5;
    }

    /**
     * エネルギーフローの状態を計算
     */
    _calculateEnergyFlow(compatibilityData) {
        if (!compatibilityData) return { type: 'neutral', intensity: 0.5 };

        const overallSynergy = (
            compatibilityData.engineInterface?.synergy +
            compatibilityData.engineSafeMode?.synergy +
            compatibilityData.interfaceSafeMode?.synergy
        ) / 3;

        const overallConflict = (
            compatibilityData.engineInterface?.conflict +
            compatibilityData.engineSafeMode?.conflict +
            compatibilityData.interfaceSafeMode?.conflict
        ) / 3;

        if (overallSynergy > 0.6) {
            return { type: 'smooth', intensity: overallSynergy, color: '#27ae60' };
        } else if (overallConflict > 0.6) {
            return { type: 'collision', intensity: overallConflict, color: '#e74c3c' };
        } else {
            return { type: 'chaotic', intensity: 0.5, color: '#9b59b6' };
        }
    }

    /**
     * 統合パスを計算
     */
    _calculateIntegrationPath(dimensions) {
        const pathPoints = [];
        const angles = [0, 72, 144, 216, 288]; // 5次元の角度
        
        Object.values(dimensions).forEach((value, index) => {
            const angle = angles[index] * Math.PI / 180;
            const radius = value * 150; // 最大半径150px
            pathPoints.push({
                x: 300 + radius * Math.cos(angle), // 中心座標300,200
                y: 200 + radius * Math.sin(angle),
                value: value
            });
        });

        return pathPoints;
    }

    /**
     * コンポーネントをレンダリング
     */
    render() {
        if (!this.currentDynamics) {
            this.container.innerHTML = `
                <div class="dynamics-error">
                    内的チーム力学データがありません。
                </div>
            `;
            return;
        }

        this.container.innerHTML = `
            <div class="internal-team-dynamics-container">
                <div class="dynamics-header">
                    <h3>内的チーム力学の可視化</h3>
                    <p>あなたの3つのOSの相互作用とエネルギーフローを可視化します</p>
                </div>
                
                <div class="dynamics-content">
                    <div class="radar-chart-section">
                        <h4>5次元バランスチャート</h4>
                        <canvas id="team-dynamics-radar" width="400" height="400"></canvas>
                        <div class="radar-legend">
                            <div class="legend-item"><span class="color-box energy"></span>エネルギー</div>
                            <div class="legend-item"><span class="color-box harmony"></span>調和</div>
                            <div class="legend-item"><span class="color-box stability"></span>安定性</div>
                            <div class="legend-item"><span class="color-box adaptability"></span>適応性</div>
                            <div class="legend-item"><span class="color-box integration"></span>統合</div>
                        </div>
                    </div>
                    
                    <div class="particle-animation-section">
                        <h4>エネルギーフローアニメーション</h4>
                        <canvas id="energy-flow-particles" width="600" height="400"></canvas>
                        <div class="flow-status">
                            <span class="flow-type">${this._getFlowTypeLabel()}</span>
                            <span class="flow-intensity">強度: ${Math.round(this.currentDynamics.energyFlow.intensity * 100)}%</span>
                        </div>
                    </div>
                </div>
                
                <div class="integration-path-section">
                    <h4>統合パスの可視化</h4>
                    <div class="path-description">${this._generatePathDescription()}</div>
                </div>
                
                <div class="dynamics-controls">
                    <button id="play-pause-btn" class="btn btn-primary">
                        <span id="play-pause-text">一時停止</span>
                    </button>
                    <button id="reset-animation-btn" class="btn btn-secondary">リセット</button>
                </div>
            </div>
        `;

        this._initializeVisualizations();
        this._bindEvents();
    }

    /**
     * 可視化要素を初期化
     */
    _initializeVisualizations() {
        if (this.options.enableRadar) {
            this._initializeRadarChart();
        }
        
        if (this.options.enableParticles) {
            this._initializeParticleAnimation();
        }
    }

    /**
     * 5次元レーダーチャートを初期化
     */
    _initializeRadarChart() {
        const canvas = document.getElementById('team-dynamics-radar');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const centerX = 200;
        const centerY = 200;
        const maxRadius = 150;

        // レーダーチャートの描画
        this._drawRadarGrid(ctx, centerX, centerY, maxRadius);
        this._drawRadarData(ctx, centerX, centerY, maxRadius);
    }

    /**
     * レーダーチャートのグリッドを描画
     */
    _drawRadarGrid(ctx, centerX, centerY, maxRadius) {
        const dimensions = ['エネルギー', '調和', '安定性', '適応性', '統合'];
        const angles = [0, 72, 144, 216, 288];

        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;

        // 同心円を描画
        for (let i = 1; i <= 5; i++) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, (maxRadius / 5) * i, 0, 2 * Math.PI);
            ctx.stroke();
        }

        // 軸線を描画
        ctx.strokeStyle = '#bbb';
        angles.forEach((angle, index) => {
            const radian = angle * Math.PI / 180;
            const x = centerX + maxRadius * Math.cos(radian);
            const y = centerY + maxRadius * Math.sin(radian);

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();

            // ラベルを描画
            ctx.fillStyle = '#333';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            const labelX = centerX + (maxRadius + 20) * Math.cos(radian);
            const labelY = centerY + (maxRadius + 20) * Math.sin(radian);
            ctx.fillText(dimensions[index], labelX, labelY);
        });
    }

    /**
     * レーダーチャートのデータを描画
     */
    _drawRadarData(ctx, centerX, centerY, maxRadius) {
        const dimensions = this.currentDynamics.dimensions;
        const values = Object.values(dimensions);
        const angles = [0, 72, 144, 216, 288];

        // データポリゴンを描画
        ctx.fillStyle = 'rgba(52, 152, 219, 0.3)';
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 2;

        ctx.beginPath();
        values.forEach((value, index) => {
            const angle = angles[index] * Math.PI / 180;
            const radius = value * maxRadius;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // データポイントを描画
        ctx.fillStyle = '#3498db';
        values.forEach((value, index) => {
            const angle = angles[index] * Math.PI / 180;
            const radius = value * maxRadius;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    /**
     * パーティクルアニメーションを初期化
     */
    _initializeParticleAnimation() {
        this.canvas = document.getElementById('energy-flow-particles');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this._createParticles();
        this._startAnimation();
    }

    /**
     * パーティクルを作成
     */
    _createParticles() {
        const flowType = this.currentDynamics.energyFlow.type;
        const intensity = this.currentDynamics.energyFlow.intensity;
        const color = this.currentDynamics.energyFlow.color;

        this.particles = [];
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: this._getParticleVelocity(flowType, 'x') * intensity,
                vy: this._getParticleVelocity(flowType, 'y') * intensity,
                size: Math.random() * 4 + 2,
                color: color,
                life: 1.0,
                maxLife: Math.random() * 100 + 50
            });
        }
    }

    /**
     * フローサイプに応じたパーティクル速度を取得
     */
    _getParticleVelocity(flowType, axis) {
        switch (flowType) {
            case 'smooth':
                return axis === 'x' ? (Math.random() - 0.5) * 2 : (Math.random() - 0.5) * 2;
            case 'collision':
                return (Math.random() - 0.5) * 8;
            case 'chaotic':
                return (Math.random() - 0.5) * 6;
            default:
                return (Math.random() - 0.5) * 3;
        }
    }

    /**
     * アニメーションを開始
     */
    _startAnimation() {
        const animate = () => {
            this._updateParticles();
            this._drawParticles();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    /**
     * パーティクルを更新
     */
    _updateParticles() {
        const flowType = this.currentDynamics.energyFlow.type;
        
        this.particles.forEach(particle => {
            // 位置更新
            particle.x += particle.vx;
            particle.y += particle.vy;

            // 画面外処理
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }

            // フローサイプ別の特殊効果
            if (flowType === 'collision') {
                // 衝突効果：他のパーティクルとの衝突検知
                this._handleCollisions(particle);
            } else if (flowType === 'chaotic') {
                // 混沌効果：ランダムな方向変更
                if (Math.random() < 0.02) {
                    particle.vx += (Math.random() - 0.5) * 2;
                    particle.vy += (Math.random() - 0.5) * 2;
                }
            }

            // ライフサイクル
            particle.life -= 1 / particle.maxLife;
            if (particle.life <= 0) {
                particle.life = 1.0;
                particle.x = Math.random() * this.canvas.width;
                particle.y = Math.random() * this.canvas.height;
            }
        });
    }

    /**
     * パーティクル衝突処理
     */
    _handleCollisions(particle) {
        this.particles.forEach(other => {
            if (particle !== other) {
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < particle.size + other.size) {
                    // 簡単な弾性衝突
                    const tempVx = particle.vx;
                    const tempVy = particle.vy;
                    particle.vx = other.vx;
                    particle.vy = other.vy;
                    other.vx = tempVx;
                    other.vy = tempVy;
                }
            }
        });
    }

    /**
     * パーティクルを描画
     */
    _drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 3つのOSエリアを描画
        this._drawOSAreas();

        // パーティクルを描画
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    /**
     * 3つのOSエリアを描画
     */
    _drawOSAreas() {
        const width = this.canvas.width;
        const height = this.canvas.height;

        // エンジンOS（左上）
        this.ctx.fillStyle = 'rgba(255, 107, 107, 0.1)';
        this.ctx.fillRect(0, 0, width / 2, height / 2);
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.font = '14px sans-serif';
        this.ctx.fillText('エンジンOS', 10, 20);

        // インターフェースOS（右上）
        this.ctx.fillStyle = 'rgba(78, 205, 196, 0.1)';
        this.ctx.fillRect(width / 2, 0, width / 2, height / 2);
        this.ctx.fillStyle = '#4ecdc4';
        this.ctx.fillText('インターフェースOS', width / 2 + 10, 20);

        // セーフモードOS（下部中央）
        this.ctx.fillStyle = 'rgba(149, 165, 166, 0.1)';
        this.ctx.fillRect(width / 4, height / 2, width / 2, height / 2);
        this.ctx.fillStyle = '#95a5a6';
        this.ctx.fillText('セーフモードOS', width / 4 + 10, height / 2 + 20);
    }

    /**
     * イベントをバインド
     */
    _bindEvents() {
        const playPauseBtn = this.container.querySelector('#play-pause-btn');
        const resetBtn = this.container.querySelector('#reset-animation-btn');

        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                this._toggleAnimation();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this._resetAnimation();
            });
        }
    }

    /**
     * アニメーションの再生/一時停止を切り替え
     */
    _toggleAnimation() {
        const playPauseText = this.container.querySelector('#play-pause-text');
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
            playPauseText.textContent = '再生';
        } else {
            this._startAnimation();
            playPauseText.textContent = '一時停止';
        }
    }

    /**
     * アニメーションをリセット
     */
    _resetAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this._createParticles();
        this._startAnimation();
        
        const playPauseText = this.container.querySelector('#play-pause-text');
        if (playPauseText) {
            playPauseText.textContent = '一時停止';
        }
    }

    /**
     * フロータイプのラベルを取得
     */
    _getFlowTypeLabel() {
        const flowType = this.currentDynamics.energyFlow.type;
        switch (flowType) {
            case 'smooth': return 'スムーズな流れ（調和）';
            case 'collision': return '衝突する粒子（葛藤）';
            case 'chaotic': return 'ランダムな粒子（混沌）';
            default: return '中立的な流れ';
        }
    }

    /**
     * 統合パスの説明を生成
     */
    _generatePathDescription() {
        const dimensions = this.currentDynamics.dimensions;
        const strongest = Object.entries(dimensions).sort(([,a], [,b]) => b - a)[0];
        const weakest = Object.entries(dimensions).sort(([,a], [,b]) => a - b)[0];

        const labels = {
            energy: 'エネルギー',
            harmony: '調和',
            stability: '安定性',
            adaptability: '適応性',
            integration: '統合'
        };

        return `
            あなたの内的チームの最強の要素は「${labels[strongest[0]]}」(${Math.round(strongest[1] * 100)}%)で、
            最も成長の余地があるのは「${labels[weakest[0]]}」(${Math.round(weakest[1] * 100)}%)です。
            これらのバランスを改善することで、より統合された人格を形成できます。
        `;
    }

    /**
     * コンポーネントを破棄
     */
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        super.destroy();
    }
}

export default InternalTeamDynamicsVisualizer;