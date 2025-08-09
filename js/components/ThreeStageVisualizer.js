/**
 * ThreeStageVisualizer - 3段階選択プロセスの可視化
 * Binary Tree構造で易経の変化哲学を視覚的に表現
 */

console.log('🎨 ThreeStageVisualizer Loading...');

(function(global) {
  'use strict';

  class ThreeStageVisualizer {
    constructor() {
      this.name = 'ThreeStageVisualizer';
      this.version = '2.0.0';
      this.container = null;
      this.canvas = null;
      this.selectedPath = [];
      this.hoveredNode = null;
      this.animationFrame = null;
    }

    /**
     * 初期化
     */
    initialize(containerId) {
      console.log('🔄 ThreeStageVisualizer initializing...');
      
      this.container = document.getElementById(containerId);
      if (!this.container) {
        console.error(`❌ Container not found: ${containerId}`);
        return false;
      }

      this.setupCanvas();
      this.setupEventListeners();
      
      console.log('✅ ThreeStageVisualizer initialized');
      return true;
    }

    /**
     * Canvas設定
     */
    setupCanvas() {
      // 既存のcanvasがあれば削除
      const existingCanvas = this.container.querySelector('canvas');
      if (existingCanvas) {
        existingCanvas.remove();
      }

      // 新しいcanvas作成
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'three-stage-canvas';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '400px';
      this.canvas.style.borderRadius = '12px';
      this.canvas.style.background = 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95))';
      
      this.container.appendChild(this.canvas);
      
      // コンテキスト取得
      this.ctx = this.canvas.getContext('2d');
      
      // サイズ設定
      this.resizeCanvas();
    }

    /**
     * Canvasリサイズ
     */
    resizeCanvas() {
      const rect = this.container.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = 400;
    }

    /**
     * イベントリスナー設定
     */
    setupEventListeners() {
      // リサイズ対応
      window.addEventListener('resize', () => this.resizeCanvas());
      
      // マウスイベント
      this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      this.canvas.addEventListener('click', (e) => this.handleClick(e));
      this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
    }

    /**
     * 3段階プロセスの描画
     */
    drawThreeStageProcess(process, scenarios) {
      if (!this.ctx) return;

      // キャンバスクリア
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // 背景グラデーション
      const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
      gradient.addColorStop(0, 'rgba(17, 24, 39, 0.95)');
      gradient.addColorStop(1, 'rgba(31, 41, 55, 0.95)');
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // ノード配置計算
      const nodes = this.calculateNodePositions(process);
      
      // 接続線の描画
      this.drawConnections(nodes);
      
      // ノードの描画
      this.drawNodes(nodes, process);
      
      // ステージラベルの描画
      this.drawStageLabels(process);
      
      // 選択パスのハイライト
      if (this.selectedPath.length > 0) {
        this.highlightSelectedPath(nodes);
      }

      // シナリオとの連携表示
      if (scenarios && scenarios.length > 0) {
        this.drawScenarioConnections(nodes, scenarios);
      }
    }

    /**
     * ノード位置計算
     */
    calculateNodePositions(process) {
      const nodes = [];
      const width = this.canvas.width;
      const height = this.canvas.height;
      const padding = 60;
      
      // 開始ノード
      nodes.push({
        id: 'start',
        x: padding,
        y: height / 2,
        type: 'start',
        label: '現在'
      });

      // Stage 1ノード
      const stage1Y = height / 3;
      nodes.push({
        id: 'stage1-conservative',
        x: width * 0.25,
        y: stage1Y,
        type: 'choice',
        stage: 1,
        choice: 'conservative',
        data: process.stages[0].choices[0]
      });
      
      nodes.push({
        id: 'stage1-progressive',
        x: width * 0.25,
        y: height * 2/3,
        type: 'choice',
        stage: 1,
        choice: 'progressive',
        data: process.stages[0].choices[1]
      });

      // Stage 2ノード
      const stage2X = width * 0.5;
      ['conservative', 'progressive'].forEach((s1, i) => {
        ['collaborative', 'independent'].forEach((s2, j) => {
          nodes.push({
            id: `stage2-${s1}-${s2}`,
            x: stage2X,
            y: (i * 2 + j + 1) * height / 5,
            type: 'choice',
            stage: 2,
            choice: s2,
            parent: `stage1-${s1}`,
            data: process.stages[1].choices[j]
          });
        });
      });

      // Stage 3ノード（8つの最終ノード）
      const stage3X = width * 0.75;
      let nodeIndex = 0;
      ['conservative', 'progressive'].forEach((s1) => {
        ['collaborative', 'independent'].forEach((s2) => {
          ['cautious', 'decisive'].forEach((s3, k) => {
            nodes.push({
              id: `stage3-${s1}-${s2}-${s3}`,
              x: stage3X,
              y: (nodeIndex + 1) * height / 9,
              type: 'outcome',
              stage: 3,
              choice: s3,
              parent: `stage2-${s1}-${s2}`,
              data: process.stages[2].choices[k],
              scenarioIndex: nodeIndex
            });
            nodeIndex++;
          });
        });
      });

      return nodes;
    }

    /**
     * 接続線の描画
     */
    drawConnections(nodes) {
      this.ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
      this.ctx.lineWidth = 2;
      
      nodes.forEach(node => {
        if (node.parent) {
          const parent = nodes.find(n => n.id === node.parent);
          if (parent) {
            this.drawCurvedLine(parent.x, parent.y, node.x, node.y);
          }
        } else if (node.type === 'choice' && node.stage === 1) {
          const start = nodes.find(n => n.id === 'start');
          if (start) {
            this.drawCurvedLine(start.x, start.y, node.x, node.y);
          }
        }
      });
    }

    /**
     * 曲線の描画
     */
    drawCurvedLine(x1, y1, x2, y2) {
      const ctx = this.ctx;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      
      const cp1x = x1 + (x2 - x1) * 0.5;
      const cp1y = y1;
      const cp2x = x1 + (x2 - x1) * 0.5;
      const cp2y = y2;
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
      ctx.stroke();
    }

    /**
     * ノードの描画
     */
    drawNodes(nodes, process) {
      nodes.forEach(node => {
        this.drawNode(node);
      });
    }

    /**
     * 単一ノードの描画
     */
    drawNode(node) {
      const ctx = this.ctx;
      const radius = node.type === 'start' ? 15 : 12;
      
      // ノードの色設定
      let fillColor = 'rgba(55, 65, 81, 0.8)';
      let strokeColor = 'rgba(99, 102, 241, 0.5)';
      
      if (node.type === 'start') {
        fillColor = 'rgba(99, 102, 241, 0.8)';
        strokeColor = '#6366F1';
      } else if (node.data) {
        const compatibility = node.data.compatibility || 50;
        if (compatibility > 70) {
          fillColor = 'rgba(16, 185, 129, 0.8)';
          strokeColor = '#10B981';
        } else if (compatibility > 50) {
          fillColor = 'rgba(59, 130, 246, 0.8)';
          strokeColor = '#3B82F6';
        } else {
          fillColor = 'rgba(245, 158, 11, 0.8)';
          strokeColor = '#F59E0B';
        }
      }
      
      // ホバー効果
      if (this.hoveredNode === node.id) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = strokeColor;
      }
      
      // ノード描画
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.shadowBlur = 0;
      
      // ラベル描画
      if (node.data && node.data.name) {
        ctx.fillStyle = '#E5E7EB';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.data.name, node.x, node.y + radius + 15);
      } else if (node.type === 'start') {
        ctx.fillStyle = '#E5E7EB';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('現在', node.x, node.y + radius + 15);
      }
    }

    /**
     * ステージラベルの描画
     */
    drawStageLabels(process) {
      const ctx = this.ctx;
      ctx.fillStyle = '#A5B4FC';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      
      const stagePositions = [
        { x: this.canvas.width * 0.25, y: 30, text: '第一段階' },
        { x: this.canvas.width * 0.5, y: 30, text: '第二段階' },
        { x: this.canvas.width * 0.75, y: 30, text: '第三段階' }
      ];
      
      stagePositions.forEach(pos => {
        ctx.fillText(pos.text, pos.x, pos.y);
      });
    }

    /**
     * 選択パスのハイライト
     */
    highlightSelectedPath(nodes) {
      if (this.selectedPath.length === 0) return;
      
      const ctx = this.ctx;
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 4;
      ctx.setLineDash([5, 5]);
      
      // パスに沿って線を描画
      for (let i = 0; i < this.selectedPath.length - 1; i++) {
        const currentNode = nodes.find(n => n.choice === this.selectedPath[i] && n.stage === i + 1);
        const nextNode = nodes.find(n => n.choice === this.selectedPath[i + 1] && n.stage === i + 2);
        
        if (currentNode && nextNode) {
          this.drawCurvedLine(currentNode.x, currentNode.y, nextNode.x, nextNode.y);
        }
      }
      
      ctx.setLineDash([]);
    }

    /**
     * シナリオとの連携表示
     */
    drawScenarioConnections(nodes, scenarios) {
      // 各シナリオに対応するノードをハイライト
      scenarios.forEach((scenario, index) => {
        if (scenario.visualPath) {
          const finalNode = nodes.find(n => n.scenarioIndex === index);
          if (finalNode) {
            // シナリオ番号表示
            const ctx = this.ctx;
            ctx.fillStyle = '#FDE047';
            ctx.font = 'bold 12px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`#${scenario.id}`, finalNode.x, finalNode.y - 20);
          }
        }
      });
    }

    /**
     * マウス移動処理
     */
    handleMouseMove(event) {
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // ノード上にマウスがあるか確認
      // この処理は簡略化のため省略
    }

    /**
     * クリック処理
     */
    handleClick(event) {
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // クリックされたノードの処理
      // この処理は簡略化のため省略
    }

    /**
     * マウス離脱処理
     */
    handleMouseLeave() {
      this.hoveredNode = null;
    }

    /**
     * パス選択
     */
    selectPath(path) {
      this.selectedPath = path;
      // 再描画をトリガー
    }

    /**
     * アニメーション開始
     */
    startAnimation() {
      const animate = () => {
        // アニメーション処理
        this.animationFrame = requestAnimationFrame(animate);
      };
      animate();
    }

    /**
     * アニメーション停止
     */
    stopAnimation() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
    }
  }

  // グローバル登録
  if (typeof window !== 'undefined') {
    window.ThreeStageVisualizer = ThreeStageVisualizer;
  }

  console.log('✅ ThreeStageVisualizer loaded');
  
})(typeof window !== 'undefined' ? window : this);