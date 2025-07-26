// InteractiveConnectionsVisualizer.js - OS間動力学の可視化
// HaQei Analyzer - Interactive OS Connections Visualization

class InteractiveConnectionsVisualizer {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.options = options;
        
        this.engineOS = options.engineOS;
        this.interfaceOS = options.interfaceOS;
        this.safeModeOS = options.safeModeOS;
        this.dataManager = options.dataManager;
        
        this.svg = null;
        this.connections = [];
        this.activeTooltip = null;
        
        console.log("🔗 [InteractiveConnectionsVisualizer] Initializing OS connections visualization", {
            engineOS: this.engineOS,
            interfaceOS: this.interfaceOS,
            safeModeOS: this.safeModeOS
        });
    }

    // 初期化
    async init() {
        console.log("🚀 [InteractiveConnectionsVisualizer] Starting visualization initialization");
        
        if (!this.container) {
            console.error("❌ [InteractiveConnectionsVisualizer] Container not found:", this.containerId);
            return;
        }

        await this.render();
        this._attachEventListeners();
        
        console.log("✅ [InteractiveConnectionsVisualizer] Visualization initialization completed");
    }

    // メインレンダリング
    async render() {
        console.log("🎨 [InteractiveConnectionsVisualizer] Rendering OS connections");
        
        // コンテナのサイズを取得
        const containerWidth = this.container.offsetWidth || 800;
        const containerHeight = 400;
        
        // SVG要素の作成
        this.container.innerHTML = `
            <div class="connections-visualization">
                <h3 class="connections-title">3OS間の相互作用</h3>
                <svg id="os-connections-svg" width="${containerWidth}" height="${containerHeight}" viewBox="0 0 ${containerWidth} ${containerHeight}">
                    <defs>
                        ${this._createGradients()}
                        ${this._createMarkers()}
                    </defs>
                    <g class="connections-group"></g>
                    <g class="nodes-group"></g>
                </svg>
                <div class="connections-legend">
                    <div class="legend-item harmony">
                        <span class="legend-line"></span>
                        <span class="legend-label">調和・相生</span>
                    </div>
                    <div class="legend-item conflict">
                        <span class="legend-line"></span>
                        <span class="legend-label">葛藤・相剋</span>
                    </div>
                    <div class="legend-item tension">
                        <span class="legend-line"></span>
                        <span class="legend-label">緊張・バランス</span>
                    </div>
                </div>
            </div>
        `;
        
        this.svg = document.getElementById('os-connections-svg');
        
        // ノードとコネクションの描画
        await this._drawNodes();
        await this._drawConnections();
        
        // ツールチップ要素の追加
        this._createTooltipElement();
    }

    // グラデーション定義
    _createGradients() {
        return `
            <!-- 調和グラデーション -->
            <linearGradient id="harmonyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#22c55e;stop-opacity:0.6" />
                <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.6" />
            </linearGradient>
            
            <!-- 葛藤グラデーション -->
            <linearGradient id="conflictGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#ef4444;stop-opacity:0.6" />
                <stop offset="100%" style="stop-color:#f97316;stop-opacity:0.6" />
            </linearGradient>
            
            <!-- 緊張グラデーション -->
            <linearGradient id="tensionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#a855f7;stop-opacity:0.6" />
                <stop offset="100%" style="stop-color:#6b7280;stop-opacity:0.6" />
            </linearGradient>
        `;
    }

    // 矢印マーカー定義
    _createMarkers() {
        return `
            <!-- 調和矢印 -->
            <marker id="harmonyArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#22c55e" />
            </marker>
            
            <!-- 葛藤矢印 -->
            <marker id="conflictArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
            </marker>
            
            <!-- 緊張矢印 -->
            <marker id="tensionArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#a855f7" />
            </marker>
        `;
    }

    // ノード（OS）の描画
    async _drawNodes() {
        const nodesGroup = this.svg.querySelector('.nodes-group');
        const width = this.svg.viewBox.baseVal.width;
        const height = this.svg.viewBox.baseVal.height;
        
        // ノード位置の計算（正三角形配置）
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.35;
        
        const nodes = [
            {
                os: this.engineOS,
                type: 'engine',
                x: centerX - radius * Math.cos(Math.PI / 6),
                y: centerY - radius * Math.sin(Math.PI / 6),
                icon: '🔥',
                color: '#ef4444'
            },
            {
                os: this.interfaceOS,
                type: 'interface',
                x: centerX + radius * Math.cos(Math.PI / 6),
                y: centerY - radius * Math.sin(Math.PI / 6),
                icon: '🌐',
                color: '#22c55e'
            },
            {
                os: this.safeModeOS,
                type: 'safemode',
                x: centerX,
                y: centerY + radius,
                icon: '🛡️',
                color: '#a855f7'
            }
        ];
        
        // ノードの描画
        nodes.forEach(node => {
            const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            nodeGroup.setAttribute('class', `os-node ${node.type}-node`);
            nodeGroup.setAttribute('transform', `translate(${node.x}, ${node.y})`);
            nodeGroup.setAttribute('data-os-type', node.type);
            
            // 背景円
            const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            bgCircle.setAttribute('r', '60');
            bgCircle.setAttribute('fill', `${node.color}20`);
            bgCircle.setAttribute('stroke', node.color);
            bgCircle.setAttribute('stroke-width', '2');
            bgCircle.setAttribute('class', 'node-bg');
            
            // 内側円
            const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            innerCircle.setAttribute('r', '50');
            innerCircle.setAttribute('fill', `${node.color}40`);
            innerCircle.setAttribute('class', 'node-inner');
            
            // アイコンテキスト
            const iconText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            iconText.setAttribute('text-anchor', 'middle');
            iconText.setAttribute('dominant-baseline', 'central');
            iconText.setAttribute('font-size', '30');
            iconText.setAttribute('class', 'node-icon');
            iconText.textContent = node.icon;
            
            // OS名テキスト
            const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            nameText.setAttribute('text-anchor', 'middle');
            nameText.setAttribute('y', '80');
            nameText.setAttribute('font-size', '14');
            nameText.setAttribute('fill', '#e2e8f0');
            nameText.setAttribute('class', 'node-name');
            nameText.textContent = node.os.osName;
            
            nodeGroup.appendChild(bgCircle);
            nodeGroup.appendChild(innerCircle);
            nodeGroup.appendChild(iconText);
            nodeGroup.appendChild(nameText);
            nodesGroup.appendChild(nodeGroup);
            
            // ノード情報を保存
            node.element = nodeGroup;
        });
        
        this.nodes = nodes;
    }

    // コネクション（関係線）の描画
    async _drawConnections() {
        const connectionsGroup = this.svg.querySelector('.connections-group');
        
        // OS間の関係を分析
        const relationships = await this._analyzeRelationships();
        
        // 各関係線を描画
        relationships.forEach(rel => {
            const connection = this._drawConnection(
                rel.from,
                rel.to,
                rel.type,
                rel.strength,
                rel.description
            );
            
            if (connection) {
                connectionsGroup.appendChild(connection);
                this.connections.push({
                    element: connection,
                    data: rel
                });
            }
        });
    }

    // 関係性の分析
    async _analyzeRelationships() {
        const relationships = [];
        
        // エンジン↔インターフェース
        const engineInterfaceRel = this._getRelationshipType(
            this.engineOS.trigram,
            this.interfaceOS.trigram
        );
        relationships.push({
            from: this.nodes[0], // engine
            to: this.nodes[1],   // interface
            type: engineInterfaceRel.type,
            strength: engineInterfaceRel.strength,
            description: this._generateRelationshipDescription('engine-interface', engineInterfaceRel)
        });
        
        // エンジン↔セーフモード
        const engineSafemodeRel = this._getRelationshipType(
            this.engineOS.trigram,
            this.safeModeOS.trigram
        );
        relationships.push({
            from: this.nodes[0], // engine
            to: this.nodes[2],   // safemode
            type: engineSafemodeRel.type,
            strength: engineSafemodeRel.strength,
            description: this._generateRelationshipDescription('engine-safemode', engineSafemodeRel)
        });
        
        // インターフェース↔セーフモード
        const interfaceSafemodeRel = this._getRelationshipType(
            this.interfaceOS.trigram,
            this.safeModeOS.trigram
        );
        relationships.push({
            from: this.nodes[1], // interface
            to: this.nodes[2],   // safemode
            type: interfaceSafemodeRel.type,
            strength: interfaceSafemodeRel.strength,
            description: this._generateRelationshipDescription('interface-safemode', interfaceSafemodeRel)
        });
        
        return relationships;
    }

    // 関係タイプの判定
    _getRelationshipType(trigram1, trigram2) {
        // TRIGRAM_INTERACTIONSデータを使用（実際の実装では外部データを参照）
        const interactionScore = this._calculateInteractionScore(trigram1, trigram2);
        
        if (interactionScore > 0.7) {
            return { type: 'harmony', strength: interactionScore };
        } else if (interactionScore < 0.3) {
            return { type: 'conflict', strength: 1 - interactionScore };
        } else {
            return { type: 'tension', strength: 0.5 };
        }
    }

    // 相互作用スコアの計算（簡易版）
    _calculateInteractionScore(trigram1, trigram2) {
        // 実際の実装ではTRIGRAM_INTERACTIONSデータを使用
        // ここでは簡易的な計算
        const trigramValues = {
            '☰': 1, '☱': 2, '☲': 3, '☳': 4,
            '☴': 5, '☵': 6, '☶': 7, '☷': 8
        };
        
        const val1 = trigramValues[trigram1] || 1;
        const val2 = trigramValues[trigram2] || 1;
        const diff = Math.abs(val1 - val2);
        
        return 1 - (diff / 8);
    }

    // 関係性の説明文生成
    _generateRelationshipDescription(pair, relationship) {
        const descriptions = {
            'engine-interface': {
                harmony: "あなたの内なるエネルギーは、この社会的表現を通じて自然に輝きます。両者は互いを高め合う理想的な関係です。",
                conflict: "内なる衝動と外的表現の間に葛藤があります。この緊張を理解し、バランスを取ることが成長の鍵となります。",
                tension: "エンジンとインターフェースは異なる方向を向いていますが、この違いが独自の魅力を生み出しています。"
            },
            'engine-safemode': {
                harmony: "あなたの情熱と防御機制は調和しています。必要な時に適切に自己保護ができる健全な状態です。",
                conflict: "強い推進力と防御反応が衝突しやすい傾向があります。自己理解を深めることで、より建設的な関係を築けます。",
                tension: "エネルギーと防御のバランスが課題です。状況に応じて適切に切り替えることを意識しましょう。"
            },
            'interface-safemode': {
                harmony: "社会的な振る舞いと自己防衛が自然に連携しています。健全な境界線を保ちながら人と関われます。",
                conflict: "外向きの顔と内なる防御が矛盾を生じやすいです。本音と建前のバランスを見直す機会かもしれません。",
                tension: "社会的役割と自己保護の間で揺れ動くことがあります。両方を大切にしながら統合していきましょう。"
            }
        };
        
        return descriptions[pair]?.[relationship.type] || "これらのOSは独特な相互作用を持っています。";
    }

    // 個別の接続線を描画
    _drawConnection(fromNode, toNode, type, strength, description) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        // 曲線パスの計算
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        
        // 制御点の計算（ベジェ曲線用）
        const mx = (fromNode.x + toNode.x) / 2;
        const my = (fromNode.y + toNode.y) / 2;
        const offset = dr * 0.2;
        
        // パスデータ
        const pathData = `M ${fromNode.x} ${fromNode.y} Q ${mx + offset} ${my - offset} ${toNode.x} ${toNode.y}`;
        
        path.setAttribute('d', pathData);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-width', Math.max(2, strength * 4));
        path.setAttribute('data-description', description);
        path.setAttribute('data-relationship-type', type);
        
        // タイプ別スタイル設定
        switch(type) {
            case 'harmony':
                path.setAttribute('stroke', 'url(#harmonyGradient)');
                path.setAttribute('stroke-dasharray', '5,5');
                path.setAttribute('class', 'connection-path harmony-path');
                path.setAttribute('marker-end', 'url(#harmonyArrow)');
                break;
            case 'conflict':
                path.setAttribute('stroke', 'url(#conflictGradient)');
                path.setAttribute('stroke-dasharray', '3,7');
                path.setAttribute('class', 'connection-path conflict-path');
                path.setAttribute('marker-end', 'url(#conflictArrow)');
                break;
            case 'tension':
                path.setAttribute('stroke', 'url(#tensionGradient)');
                path.setAttribute('stroke-dasharray', '10,5');
                path.setAttribute('class', 'connection-path tension-path');
                path.setAttribute('marker-end', 'url(#tensionArrow)');
                break;
        }
        
        // アニメーション
        this._addConnectionAnimation(path, type);
        
        return path;
    }

    // 接続線のアニメーション追加
    _addConnectionAnimation(path, type) {
        const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animate.setAttribute('attributeName', 'stroke-dashoffset');
        animate.setAttribute('repeatCount', 'indefinite');
        
        switch(type) {
            case 'harmony':
                animate.setAttribute('from', '0');
                animate.setAttribute('to', '10');
                animate.setAttribute('dur', '2s');
                break;
            case 'conflict':
                animate.setAttribute('from', '0');
                animate.setAttribute('to', '-10');
                animate.setAttribute('dur', '1.5s');
                break;
            case 'tension':
                animate.setAttribute('values', '0;15;0');
                animate.setAttribute('dur', '3s');
                break;
        }
        
        path.appendChild(animate);
    }

    // ツールチップ要素の作成
    _createTooltipElement() {
        const tooltip = document.createElement('div');
        tooltip.className = 'connection-tooltip';
        tooltip.style.display = 'none';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <div class="tooltip-title"></div>
                <div class="tooltip-description"></div>
            </div>
        `;
        document.body.appendChild(tooltip);
        this.activeTooltip = tooltip;
    }

    // イベントリスナーの設定
    _attachEventListeners() {
        // 接続線のホバーイベント
        this.connections.forEach(conn => {
            conn.element.addEventListener('mouseenter', (e) => {
                this._showConnectionTooltip(e, conn.data);
                conn.element.classList.add('highlighted');
            });
            
            conn.element.addEventListener('mouseleave', () => {
                this._hideTooltip();
                conn.element.classList.remove('highlighted');
            });
            
            conn.element.addEventListener('click', (e) => {
                this._showDetailModal(conn.data);
            });
        });
        
        // ノードのホバーイベント
        this.nodes.forEach(node => {
            node.element.addEventListener('mouseenter', () => {
                this._highlightNodeConnections(node);
            });
            
            node.element.addEventListener('mouseleave', () => {
                this._clearHighlights();
            });
        });
        
        // ウィンドウリサイズ対応
        window.addEventListener('resize', () => {
            this._handleResize();
        });
    }

    // ツールチップ表示
    _showConnectionTooltip(event, connectionData) {
        const tooltip = this.activeTooltip;
        const titleEl = tooltip.querySelector('.tooltip-title');
        const descEl = tooltip.querySelector('.tooltip-description');
        
        titleEl.textContent = `${connectionData.from.os.osName} ↔ ${connectionData.to.os.osName}`;
        descEl.textContent = connectionData.description;
        
        tooltip.style.display = 'block';
        
        // 位置調整
        const rect = event.target.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        let top = rect.top - tooltipRect.height - 10;
        
        // 画面端の調整
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) {
            top = rect.bottom + 10;
        }
        
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }

    // ツールチップ非表示
    _hideTooltip() {
        if (this.activeTooltip) {
            this.activeTooltip.style.display = 'none';
        }
    }

    // ノード関連の接続をハイライト
    _highlightNodeConnections(node) {
        this.connections.forEach(conn => {
            if (conn.data.from === node || conn.data.to === node) {
                conn.element.classList.add('node-highlighted');
            } else {
                conn.element.classList.add('dimmed');
            }
        });
    }

    // ハイライトクリア
    _clearHighlights() {
        this.connections.forEach(conn => {
            conn.element.classList.remove('node-highlighted', 'dimmed');
        });
    }

    // 詳細モーダル表示（将来実装）
    _showDetailModal(connectionData) {
        console.log("🔍 [InteractiveConnectionsVisualizer] Showing detail modal for:", connectionData);
        // Phase 3の拡張実装で詳細モーダルを追加
    }

    // リサイズ処理
    _handleResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.render();
        }, 250);
    }

    // パブリックメソッド: 関係性の更新
    updateRelationships(newData) {
        if (newData.engineOS) this.engineOS = newData.engineOS;
        if (newData.interfaceOS) this.interfaceOS = newData.interfaceOS;
        if (newData.safeModeOS) this.safeModeOS = newData.safeModeOS;
        
        this.render();
    }

    // パブリックメソッド: アニメーションの一時停止/再開
    toggleAnimation(enabled = true) {
        const animations = this.svg.querySelectorAll('animate');
        animations.forEach(anim => {
            if (enabled) {
                anim.beginElement();
            } else {
                anim.endElement();
            }
        });
    }
}

// クラスをグローバルスコープに登録
if (typeof window !== 'undefined') {
    window.InteractiveConnectionsVisualizer = InteractiveConnectionsVisualizer;
}