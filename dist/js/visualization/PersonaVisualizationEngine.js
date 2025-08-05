/**
 * PersonaVisualizationEngine.js - 仮想人格視覚化エンジン
 * 
 * 目的：
 * - 易経卦の視覚的表現とアニメーション
 * - 仮想人格のキャラクター的表現
 * - 3つのOSの動的関係性の可視化
 * - bunenjin哲学に基づく美学的インターフェース
 * 
 * 機能：
 * - 六爻（ろうこう）の動的表示
 * - OSトランジションアニメーション
 * - キャラクター化されたペルソナ表現
 * - インタラクティブな卦の解釈
 * 
 * @version 1.0.0
 * @date 2025-08-04
 * @author bunenjin-strategy-navigator
 */

class PersonaVisualizationEngine {
    constructor(canvasId, options = {}) {
        this.canvasId = canvasId;
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas?.getContext('2d');
        this.options = options;
        
        // アニメーション状態
        this.animationId = null;
        this.isAnimating = false;
        this.animationFrame = 0;
        
        // ビジュアル設定
        this.colors = {
            yang: '#FFD700', // 陽爻 - 金色
            yin: '#4682B4',  // 陰爻 - 鋼青色
            background: '#0F172A',
            accent: '#6366F1',
            text: '#F1F5F9'
        };
        
        // キャンバス初期化
        this.initializeCanvas();
        
        console.log('🎨 PersonaVisualizationEngine initialized');
    }
    
    /**
     * キャンバス初期化
     */
    initializeCanvas() {
        if (!this.canvas) return;
        
        // 高DPI対応
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.ctx.scale(dpr, dpr);
        
        // アンチエイリアシング設定
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
    }
    
    /**
     * 六爻（ろうこう）を描画
     * @param {number} hexagramNumber - 卦番号（1-64）
     * @param {Object} position - 描画位置 {x, y}
     * @param {number} size - サイズ
     * @param {number} animationPhase - アニメーション位相（0-1）
     */
    drawHexagram(hexagramNumber, position, size = 100, animationPhase = 0) {
        if (!this.ctx) return;
        
        const lines = this.getHexagramLines(hexagramNumber);
        const lineHeight = size / 8;
        const lineWidth = size * 0.8;
        const gapWidth = lineWidth * 0.3;
        
        this.ctx.save();
        
        // 六爻を下から上に描画（易経の伝統的表記）
        for (let i = 0; i < 6; i++) {
            const y = position.y + size - (i + 1) * lineHeight;
            const isYang = lines[i] === 1;
            
            // アニメーション効果
            const alpha = 0.7 + 0.3 * Math.sin(animationPhase * Math.PI * 2 + i * 0.5);
            const glow = 5 + 3 * Math.sin(animationPhase * Math.PI * 4 + i * 0.3);
            
            if (isYang) {
                // 陽爻（実線）
                this.drawYangLine(position.x, y, lineWidth, lineHeight * 0.6, alpha, glow);
            } else {
                // 陰爻（破線）
                this.drawYinLine(position.x, y, lineWidth, gapWidth, lineHeight * 0.6, alpha, glow);
            }
        }
        
        this.ctx.restore();
    }
    
    /**
     * 陽爻（実線）を描画
     */
    drawYangLine(x, y, width, height, alpha, glow) {
        this.ctx.save();
        
        // グロー効果
        this.ctx.shadowColor = this.colors.yang;
        this.ctx.shadowBlur = glow;
        this.ctx.globalAlpha = alpha;
        
        // グラデーション
        const gradient = this.ctx.createLinearGradient(x, y, x + width, y);
        gradient.addColorStop(0, this.colors.yang + '80');
        gradient.addColorStop(0.5, this.colors.yang);
        gradient.addColorStop(1, this.colors.yang + '80');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x, y, width, height);
        
        this.ctx.restore();
    }
    
    /**
     * 陰爻（破線）を描画
     */
    drawYinLine(x, y, width, gapWidth, height, alpha, glow) {
        this.ctx.save();
        
        // グロー効果
        this.ctx.shadowColor = this.colors.yin;
        this.ctx.shadowBlur = glow;
        this.ctx.globalAlpha = alpha;
        
        // グラデーション
        const gradient = this.ctx.createLinearGradient(x, y, x + width, y);
        gradient.addColorStop(0, this.colors.yin + '80');
        gradient.addColorStop(0.5, this.colors.yin);
        gradient.addColorStop(1, this.colors.yin + '80');
        
        this.ctx.fillStyle = gradient;
        
        // 左側の線
        const leftWidth = (width - gapWidth) / 2;
        this.ctx.fillRect(x, y, leftWidth, height);
        
        // 右側の線
        const rightX = x + leftWidth + gapWidth;
        this.ctx.fillRect(rightX, y, leftWidth, height);
        
        this.ctx.restore();
    }
    
    /**
     * 卦番号から六爻の配列を取得
     * @param {number} hexagramNumber 卦番号（1-64）
     * @returns {number[]} 六爻配列（1=陽爻, 0=陰爻）
     */
    getHexagramLines(hexagramNumber) {
        // 簡易的な卦の定義（実際の実装では完全な64卦データを使用）
        const hexagrams = {
            1: [1, 1, 1, 1, 1, 1], // 乾為天
            2: [0, 0, 0, 0, 0, 0], // 坤為地
            3: [1, 0, 0, 0, 1, 0], // 水雷屯
            4: [0, 1, 0, 0, 0, 1], // 山水蒙
            5: [1, 1, 1, 0, 1, 0], // 水天需
            6: [0, 1, 0, 1, 1, 1], // 天水訟
            7: [0, 1, 0, 0, 0, 0], // 地水師
            8: [0, 0, 0, 0, 1, 0], // 水地比
            // ... 他の卦も同様に定義
        };
        
        return hexagrams[hexagramNumber] || [1, 0, 1, 0, 1, 0]; // デフォルト
    }
    
    /**
     * 仮想人格キャラクターを描画
     * @param {Object} osData - OS分析データ
     * @param {Object} position - 描画位置
     * @param {number} size - サイズ
     * @param {number} animationPhase - アニメーション位相
     */
    drawPersonaCharacter(osData, position, size = 200, animationPhase = 0) {
        if (!this.ctx) return;
        
        this.ctx.save();
        
        // キャラクターベースの描画
        this.drawCharacterBase(position, size, animationPhase);
        
        // OS特性の視覚化
        this.drawOSAura(osData, position, size, animationPhase);
        
        // 六爻シンボル
        if (osData.hexagramInfo) {
            const hexagramPos = {
                x: position.x - size * 0.1,
                y: position.y - size * 0.3
            };
            this.drawHexagram(
                osData.hexagramInfo.number,
                hexagramPos,
                size * 0.2,
                animationPhase
            );
        }
        
        this.ctx.restore();
    }
    
    /**
     * キャラクターベースを描画
     */
    drawCharacterBase(position, size, animationPhase) {
        const centerX = position.x;
        const centerY = position.y;
        const radius = size * 0.3;
        
        // 呼吸するような効果
        const breathScale = 1 + 0.05 * Math.sin(animationPhase * Math.PI * 2);
        const actualRadius = radius * breathScale;
        
        // 外側のオーラ
        const outerGradient = this.ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, actualRadius * 1.5
        );
        outerGradient.addColorStop(0, this.colors.accent + '40');
        outerGradient.addColorStop(0.7, this.colors.accent + '20');
        outerGradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = outerGradient;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, actualRadius * 1.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // メインボディ
        const innerGradient = this.ctx.createRadialGradient(
            centerX, centerY - actualRadius * 0.3, 0,
            centerX, centerY, actualRadius
        );
        innerGradient.addColorStop(0, this.colors.text + 'CC');
        innerGradient.addColorStop(0.8, this.colors.accent + 'AA');
        innerGradient.addColorStop(1, this.colors.accent + '66');
        
        this.ctx.fillStyle = innerGradient;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, actualRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // エネルギー粒子
        this.drawEnergyParticles(centerX, centerY, actualRadius * 2, animationPhase);
    }
    
    /**
     * OSオーラを描画
     */
    drawOSAura(osData, position, size, animationPhase) {
        const osType = osData.osType || 'unknown';
        const strength = (osData.matchPercentage || 50) / 100;
        
        const colors = {
            engine: '#FF6B35',    // エンジンOS - オレンジ
            interface: '#4ECDC4', // インターフェースOS - ティール
            safemode: '#45B7D1'   // セーフモードOS - ブルー
        };
        
        const auraColor = colors[osType] || this.colors.accent;
        const intensity = strength * (0.7 + 0.3 * Math.sin(animationPhase * Math.PI * 2));
        
        // オーラリング
        for (let i = 0; i < 3; i++) {
            const radius = size * (0.4 + i * 0.1) * (1 + 0.1 * Math.sin(animationPhase * Math.PI * 2 + i));
            const alpha = intensity * (0.6 - i * 0.2);
            
            this.ctx.strokeStyle = auraColor + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }
    
    /**
     * エネルギー粒子を描画
     */
    drawEnergyParticles(centerX, centerY, range, animationPhase) {
        const particleCount = 12;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2 + animationPhase * Math.PI * 0.5;
            const distance = range * (0.6 + 0.4 * Math.sin(animationPhase * Math.PI * 3 + i));
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            const size = 2 + 2 * Math.sin(animationPhase * Math.PI * 4 + i);
            const alpha = 0.5 + 0.5 * Math.sin(animationPhase * Math.PI * 2 + i * 0.3);
            
            this.ctx.fillStyle = this.colors.accent + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    /**
     * 3つのOSの関係性を描画
     * @param {Object} tripleOSData - 3つのOSデータ
     * @param {number} animationPhase - アニメーション位相
     */
    drawTripleOSRelationship(tripleOSData, animationPhase = 0) {
        if (!this.ctx || !this.canvas) return;
        
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.25;
        
        // 背景をクリア
        this.ctx.clearRect(0, 0, width, height);
        
        // 3つのOSの位置
        const positions = [
            { x: centerX, y: centerY - radius, os: tripleOSData.engineOS, type: 'engine' },      // Engine OS (上)
            { x: centerX - radius * 0.866, y: centerY + radius * 0.5, os: tripleOSData.interfaceOS, type: 'interface' }, // Interface OS (左下)
            { x: centerX + radius * 0.866, y: centerY + radius * 0.5, os: tripleOSData.safeModeOS, type: 'safemode' }   // Safe Mode OS (右下)
        ];
        
        // 関係線を描画
        this.drawRelationshipLines(positions, animationPhase);
        
        // 各OSを描画
        positions.forEach((pos, index) => {
            if (pos.os) {
                const osData = { ...pos.os, osType: pos.type };
                this.drawPersonaCharacter(osData, pos, 80, animationPhase + index * 0.33);
                
                // OSラベル
                this.drawOSLabel(pos, pos.type, pos.os);
            }
        });
        
        // 中央に統合シンボル
        this.drawIntegrationSymbol(centerX, centerY, 30, animationPhase);
    }
    
    /**
     * 関係線を描画
     */
    drawRelationshipLines(positions, animationPhase) {
        this.ctx.save();
        
        for (let i = 0; i < positions.length; i++) {
            const start = positions[i];
            const end = positions[(i + 1) % positions.length];
            
            // アニメーション効果
            const alpha = 0.3 + 0.2 * Math.sin(animationPhase * Math.PI * 2 + i);
            const lineWidth = 2 + Math.sin(animationPhase * Math.PI * 3 + i);
            
            // グラデーション線
            const gradient = this.ctx.createLinearGradient(start.x, start.y, end.x, end.y);
            gradient.addColorStop(0, this.colors.accent + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
            gradient.addColorStop(0.5, this.colors.yang + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
            gradient.addColorStop(1, this.colors.accent + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = lineWidth;
            this.ctx.beginPath();
            this.ctx.moveTo(start.x, start.y);
            this.ctx.lineTo(end.x, end.y);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    /**
     * OSラベルを描画
     */
    drawOSLabel(position, osType, osData) {
        this.ctx.save();
        
        const labels = {
            engine: '🔥 Engine',
            interface: '🌟 Interface',
            safemode: '🛡️ Safe Mode'
        };
        
        const label = labels[osType] || osType;
        const percentage = osData.matchPercentage || 0;
        
        // ラベル背景
        this.ctx.fillStyle = this.colors.background + 'CC';
        this.ctx.strokeStyle = this.colors.accent;
        this.ctx.lineWidth = 1;
        
        const textWidth = this.ctx.measureText(label).width + 20;
        const labelY = position.y + 60;
        
        this.ctx.fillRect(position.x - textWidth/2, labelY - 15, textWidth, 30);
        this.ctx.strokeRect(position.x - textWidth/2, labelY - 15, textWidth, 30);
        
        // ラベルテキスト
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '12px Inter, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(label, position.x, labelY - 5);
        this.ctx.fillText(`${percentage.toFixed(1)}%`, position.x, labelY + 8);
        
        this.ctx.restore();
    }
    
    /**
     * 統合シンボルを描画
     */
    drawIntegrationSymbol(x, y, size, animationPhase) {
        this.ctx.save();
        
        const rotationSpeed = animationPhase * Math.PI * 0.5;
        
        this.ctx.translate(x, y);
        this.ctx.rotate(rotationSpeed);
        
        // 太極図風のシンボル
        const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        gradient.addColorStop(0, this.colors.yang);
        gradient.addColorStop(0.5, this.colors.yin);
        gradient.addColorStop(1, this.colors.yang);
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 中央の統合点
        this.ctx.fillStyle = this.colors.text;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    /**
     * アニメーション開始
     */
    startAnimation(tripleOSData) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.animationFrame = 0;
        
        const animate = () => {
            if (!this.isAnimating) return;
            
            this.animationFrame += 0.016; // 60fps
            const phase = this.animationFrame * 0.5; // アニメーション速度調整
            
            this.drawTripleOSRelationship(tripleOSData, phase);
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
        console.log('🎬 PersonaVisualizationEngine animation started');
    }
    
    /**
     * アニメーション停止
     */
    stopAnimation() {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        console.log('⏹️ PersonaVisualizationEngine animation stopped');
    }
    
    /**
     * 静的な六爻表示
     * @param {number} hexagramNumber - 卦番号
     * @param {Object} position - 位置
     * @param {number} size - サイズ
     */
    drawStaticHexagram(hexagramNumber, position, size = 100) {
        this.drawHexagram(hexagramNumber, position, size, 0);
    }
    
    /**
     * キャンバスをクリア
     */
    clear() {
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        }
    }
    
    /**
     * リサイズ処理
     */
    resize() {
        this.initializeCanvas();
    }
    
    /**
     * 破棄処理
     */
    destroy() {
        this.stopAnimation();
        this.clear();
        console.log('🗑️ PersonaVisualizationEngine destroyed');
    }
}

// グローバルエクスポート
window.PersonaVisualizationEngine = PersonaVisualizationEngine;

console.log('✅ PersonaVisualizationEngine loaded successfully');