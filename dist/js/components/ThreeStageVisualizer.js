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
      console.log('🔄 ThreeStageVisualizer initializing with container:', containerId);
      
      this.container = document.getElementById(containerId);
      if (!this.container) {
        console.error(`❌ Container not found: ${containerId}`);
        return false;
      }

      // CSS スタイリング初期化（最優先）
      this.initializeStyles();

      // visualizer-contentも確認・作成
      this.ensureVisualizerContent();
      
      this.setupCanvas();
      this.setupEventListeners();
      
      console.log('✅ ThreeStageVisualizer initialized');
      return true;
    }

    /**
     * CSS スタイル初期化 (URGENT FIX)
     */
    initializeStyles() {
      console.log('🎨 [URGENT] ThreeStageVisualizer: Initializing CSS styles');
      
      // コンテナ自身のスタイリング適用
      if (this.container) {
        this.container.style.cssText = `
          background: linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95));
          border-radius: 15px;
          border: 2px solid rgba(99, 102, 241, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          padding: 25px;
          margin: 20px 0;
          min-height: 500px;
          position: relative;
          backdrop-filter: blur(10px);
        `;
        
        console.log('✅ [URGENT] ThreeStageVisualizer container styled');
      }
      
      // 動的CSS inject
      this.injectDynamicCSS();
    }

    /**
     * 動的CSS注入
     */
    injectDynamicCSS() {
      const styleId = 'three-stage-visualizer-dynamic-styles';
      
      // 既存のスタイルを削除
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
      
      // 新しいスタイルを作成・注入
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = `
        #three-stage-visualizer {
          background: linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95)) !important;
          border-radius: 15px !important;
          border: 2px solid rgba(99, 102, 241, 0.3) !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
          padding: 25px !important;
          margin: 20px 0 !important;
          min-height: 500px !important;
          position: relative !important;
          backdrop-filter: blur(10px) !important;
        }
        
        #three-stage-visualizer .visualizer-content {
          background: rgba(17, 24, 39, 0.7) !important;
          border-radius: 10px !important;
          border: 1px solid rgba(99, 102, 241, 0.2) !important;
          padding: 20px !important;
          margin: 15px 0 !important;
          min-height: 400px !important;
          color: #E5E7EB !important;
        }
        
        #three-stage-visualizer canvas.three-stage-canvas {
          border-radius: 12px !important;
          background: linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95)) !important;
          border: 1px solid rgba(99, 102, 241, 0.3) !important;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
        }
        
        #three-stage-visualizer h3 {
          color: #A5B4FC !important;
          font-size: 1.25rem !important;
          font-weight: 700 !important;
          margin-bottom: 15px !important;
          text-align: center !important;
        }
        
        #three-stage-visualizer .stage-info {
          background: rgba(55, 65, 81, 0.6) !important;
          border-radius: 8px !important;
          padding: 12px !important;
          margin: 8px 0 !important;
          color: #E5E7EB !important;
        }
      `;
      
      document.head.appendChild(styleElement);
      console.log('✅ [URGENT] Dynamic CSS injected for ThreeStageVisualizer');
    }

    /**
     * visualizer-contentコンテナの確保
     */
    ensureVisualizerContent() {
      let visualizerContent = this.container.querySelector('.visualizer-content');
      if (!visualizerContent) {
        console.log('⚠️ visualizer-content not found, creating...');
        visualizerContent = document.createElement('div');
        visualizerContent.className = 'visualizer-content';
        visualizerContent.style.cssText = `
          background: rgba(17, 24, 39, 0.7);
          border-radius: 10px;
          border: 1px solid rgba(99, 102, 241, 0.2);
          padding: 20px;
          margin: 15px 0;
          min-height: 400px;
          color: #E5E7EB;
        `;
        this.container.appendChild(visualizerContent);
      } else {
        // 既存のvisualizer-contentにもスタイル適用
        visualizerContent.style.cssText = `
          background: rgba(17, 24, 39, 0.7);
          border-radius: 10px;
          border: 1px solid rgba(99, 102, 241, 0.2);
          padding: 20px;
          margin: 15px 0;
          min-height: 400px;
          color: #E5E7EB;
        `;
      }
      this.visualizerContent = visualizerContent;
      console.log('✅ [URGENT] visualizer-content styled and ensured:', this.visualizerContent);
    }

    /**
     * Canvas設定
     */
    setupCanvas() {
      console.log('🎨 [CANVAS DEBUG] setupCanvas called');
      console.log('🎨 [CANVAS DEBUG] visualizerContent:', !!this.visualizerContent);
      console.log('🎨 [CANVAS DEBUG] container:', !!this.container);
      
      // visualizer-contentコンテナを使用
      const targetContainer = this.visualizerContent || this.container;
      console.log('🎨 [CANVAS DEBUG] targetContainer:', !!targetContainer);
      
      if (!targetContainer) {
        console.error('❌ [CANVAS DEBUG] No target container available');
        return;
      }
      
      // 既存のcanvasがあれば削除
      const existingCanvas = targetContainer.querySelector('canvas');
      if (existingCanvas) {
        console.log('🎨 [CANVAS DEBUG] Removing existing canvas');
        existingCanvas.remove();
      }

      // 新しいcanvas作成
      console.log('🎨 [CANVAS DEBUG] Creating new canvas');
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'three-stage-canvas';
      this.canvas.id = 'three-stage-canvas-' + Date.now(); // 一意のID付与
      this.canvas.style.cssText = `
        width: 100%;
        height: 400px;
        border-radius: 12px;
        background: linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95));
        border: 1px solid rgba(99, 102, 241, 0.3);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: block;
      `;
      
      targetContainer.appendChild(this.canvas);
      
      console.log('✅ [URGENT] Canvas created and appended:', {
        canvasId: this.canvas.id,
        canvasClass: this.canvas.className,
        parentElement: targetContainer.className || targetContainer.id,
        canvasElement: this.canvas
      });
      
      // コンテキスト取得
      console.log('🎨 [CANVAS DEBUG] Getting canvas context...');
      this.ctx = this.canvas.getContext('2d');
      console.log('🎨 [CANVAS DEBUG] Context obtained:', !!this.ctx);
      
      if (!this.ctx) {
        console.error('❌ [CANVAS DEBUG] Failed to get 2d context');
        return;
      }
      
      // サイズ設定
      this.resizeCanvas();
      
      console.log('✅ Canvas setup complete in:', targetContainer.className);
    }

    /**
     * Canvasリサイズ
     */
    resizeCanvas() {
      const rect = this.container.getBoundingClientRect();
      const width = Math.max(rect.width, 290); // 最小幅確保
      const height = 400;
      
      this.canvas.width = width;
      this.canvas.height = height;
      
      console.log('📐 [DEBUG] Canvas resized to:', width, 'x', height);
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
      console.log('🎨 [CRITICAL DEBUG] drawThreeStageProcess called');
      console.log('🎨 [CRITICAL DEBUG] Process data:', process);
      console.log('🎨 [CRITICAL DEBUG] Scenarios data:', scenarios);
      
      // URGENT: Canvas context 確認
      if (!this.ctx) {
        console.error('❌ [CRITICAL] Canvas context not available');
        console.log('🔍 [DEBUG] Canvas state:', this.canvas);
        console.log('🔍 [DEBUG] Container state:', this.container);
        
        // Canvas再セットアップ試行
        this.setupCanvas();
        if (!this.ctx) {
          this.showErrorMessage('Canvas初期化エラー');
          return;
        }
      }

      // URGENT: プロセスデータ包括的チェック
      if (!process) {
        console.error('❌ [CRITICAL] Process data is null/undefined');
        // フォールバックデータで描画
        process = this.createFallbackProcess();
      }
      
      if (!process.stages || process.stages.length === 0) {
        console.error('❌ [CRITICAL] Process stages empty/invalid:', process);
        // フォールバックデータで描画
        process = this.createFallbackProcess();
      }

      console.log('✅ [CRITICAL DEBUG] Drawing with process:', process);

      // キャンバスクリア & 寸法確認
      console.log('🎨 [DEBUG] Canvas dimensions:', this.canvas.width, 'x', this.canvas.height);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // 背景グラデーション
      const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
      gradient.addColorStop(0, 'rgba(17, 24, 39, 0.95)');
      gradient.addColorStop(1, 'rgba(31, 41, 55, 0.95)');
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // 即座に確認用テストドット描画
      this.ctx.fillStyle = '#FF0000';
      this.ctx.fillRect(10, 10, 20, 20);
      console.log('🔴 [DEBUG] Red test square drawn at (10,10)');

      try {
        // ノード配置計算
        console.log('🔍 [DEBUG] Calculating node positions...');
        const nodes = this.calculateNodePositions(process);
        console.log('✅ [DEBUG] Nodes calculated:', nodes.length, nodes);
        
        if (nodes.length === 0) {
          console.error('❌ [CRITICAL] No nodes calculated!');
          this.drawEmergencyContent();
          return;
        }
        
        // 接続線の描画
        console.log('🔍 [DEBUG] Drawing connections...');
        this.drawConnections(nodes);
        
        // ノードの描画
        console.log('🔍 [DEBUG] Drawing nodes...');
        this.drawNodes(nodes, process);
        
        // ステージラベルの描画
        console.log('🔍 [DEBUG] Drawing stage labels...');
        this.drawStageLabels(process);
        
        // 選択パスのハイライト
        if (this.selectedPath.length > 0) {
          console.log('🔍 [DEBUG] Highlighting selected path...');
          this.highlightSelectedPath(nodes);
        }

        // シナリオとの連携表示
        if (scenarios && scenarios.length > 0) {
          console.log('🔍 [DEBUG] Drawing scenario connections...');
          this.drawScenarioConnections(nodes, scenarios);
        }

        // 情報テキストの表示
        console.log('🔍 [DEBUG] Drawing info text...');
        this.drawInfoText(process);
        
        // visualizer-contentに状態表示
        this.updateVisualizerContent(process, nodes);
        
        console.log('🎉 [SUCCESS] ThreeStageProcess drawn successfully');
        
      } catch (error) {
        console.error('❌ [CRITICAL ERROR] Drawing ThreeStageProcess:', error);
        console.error('❌ [STACK TRACE]:', error.stack);
        this.showErrorMessage('描画エラーが発生しました: ' + error.message);
        this.drawEmergencyContent();
      }
    }

    /**
     * 情報テキストの描画
     */
    drawInfoText(process) {
      const ctx = this.ctx;
      ctx.fillStyle = '#E5E7EB';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.textAlign = 'center';
      
      // タイトル表示
      const title = process.progressTheme || '三段階選択プロセス';
      ctx.fillText(title, this.canvas.width / 2, 20);
      
      // 説明表示
      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = '#9CA3AF';
      ctx.fillText('各段階での選択により、異なる未来への道が開かれます', this.canvas.width / 2, this.canvas.height - 15);
    }

    /**
     * エラーメッセージ表示
     */
    showErrorMessage(message) {
      if (!this.ctx) return;
      
      // 背景をクリア
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // エラー背景
      this.ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // エラーメッセージ
      this.ctx.fillStyle = '#EF4444';
      this.ctx.font = 'bold 16px Inter, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`⚠️ ${message}`, this.canvas.width / 2, this.canvas.height / 2);
    }

    /**
     * ノード位置計算
     */
    calculateNodePositions(process) {
      const nodes = [];
      const width = this.canvas.width;
      const height = this.canvas.height;
      const padding = 60;
      
      // プロセスデータの安全性チェック
      if (!process || !process.stages || process.stages.length < 3) {
        console.error('❌ Insufficient process data for node calculation');
        return nodes;
      }
      
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
      const stage1 = process.stages[0];
      if (stage1 && stage1.choices && stage1.choices.length >= 2) {
        nodes.push({
          id: 'stage1-conservative',
          x: width * 0.25,
          y: stage1Y,
          type: 'choice',
          stage: 1,
          choice: 'conservative',
          data: stage1.choices[0]
        });
        
        nodes.push({
          id: 'stage1-progressive',
          x: width * 0.25,
          y: height * 2/3,
          type: 'choice',
          stage: 1,
          choice: 'progressive',
          data: stage1.choices[1]
        });
      }

      // Stage 2ノード
      const stage2X = width * 0.5;
      const stage2 = process.stages[1];
      if (stage2 && stage2.choices && stage2.choices.length >= 2) {
        ['conservative', 'progressive'].forEach((s1, i) => {
          ['collaborative', 'independent'].forEach((s2, j) => {
            const choiceData = stage2.choices[j] || stage2.choices[j % stage2.choices.length];
            nodes.push({
              id: `stage2-${s1}-${s2}`,
              x: stage2X,
              y: (i * 2 + j + 1) * height / 5,
              type: 'choice',
              stage: 2,
              choice: s2,
              parent: `stage1-${s1}`,
              data: choiceData
            });
          });
        });
      }

      // Stage 3ノード（8つの最終ノード）
      const stage3X = width * 0.75;
      const stage3 = process.stages[2];
      if (stage3 && stage3.choices && stage3.choices.length >= 2) {
        let nodeIndex = 0;
        ['conservative', 'progressive'].forEach((s1) => {
          ['collaborative', 'independent'].forEach((s2) => {
            ['cautious', 'decisive'].forEach((s3, k) => {
              const choiceData = stage3.choices[k] || stage3.choices[k % stage3.choices.length];
              nodes.push({
                id: `stage3-${s1}-${s2}-${s3}`,
                x: stage3X,
                y: (nodeIndex + 1) * height / 9,
                type: 'outcome',
                stage: 3,
                choice: s3,
                parent: `stage2-${s1}-${s2}`,
                data: choiceData,
                scenarioIndex: nodeIndex
              });
              nodeIndex++;
            });
          });
        });
      }

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

    /**
     * フォールバック用プロセスデータ作成
     */
    createFallbackProcess() {
      console.log('🆘 [EMERGENCY] Creating fallback process data');
      
      return {
        progressTheme: '緊急フォールバック3段階プロセス',
        changeTheme: 'システム復旧プロセス',
        stages: [
          {
            stageNumber: 1,
            title: '第一段階：初期判断',
            description: '現状の理解と基本方針の決定',
            choices: [
              {
                id: 'conservative',
                name: '保守的選択',
                keywords: ['安定', '継続'],
                description: '現状維持を基本とした選択',
                compatibility: 65,
                outcome: { successProbability: 70 }
              },
              {
                id: 'progressive',
                name: '進取的選択', 
                keywords: ['革新', '前進'],
                description: '新しい挑戦に向けた選択',
                compatibility: 75,
                outcome: { successProbability: 80 }
              }
            ]
          },
          {
            stageNumber: 2,
            title: '第二段階：実行方法',
            description: '選択した方針の実行アプローチ',
            choices: [
              {
                id: 'collaborative',
                name: '協調的選択',
                keywords: ['協力', '調和'],
                description: '他者との協調を重視した実行',
                compatibility: 70,
                outcome: { successProbability: 75 }
              },
              {
                id: 'independent',
                name: '独立的選択',
                keywords: ['自立', '主導'],
                description: '独自の判断による実行',
                compatibility: 80,
                outcome: { successProbability: 85 }
              }
            ]
          },
          {
            stageNumber: 3,
            title: '第三段階：タイミング',
            description: '実行のタイミングと速度の決定',
            choices: [
              {
                id: 'cautious',
                name: '慎重な選択',
                keywords: ['計画', '準備'],
                description: '十分な準備を重視したタイミング',
                compatibility: 60,
                outcome: { successProbability: 72 }
              },
              {
                id: 'decisive',
                name: '決断的選択',
                keywords: ['迅速', '決断'],
                description: '機を逃さない迅速な決断',
                compatibility: 85,
                outcome: { successProbability: 88 }
              }
            ]
          }
        ]
      };
    }

    /**
     * 緊急時描画コンテンツ
     */
    drawEmergencyContent() {
      console.log('🆘 [EMERGENCY] Drawing emergency content');
      
      if (!this.ctx) return;
      
      // 緊急時背景
      this.ctx.fillStyle = '#FEF3C7';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // 警告テキスト
      this.ctx.fillStyle = '#D97706';
      this.ctx.font = 'bold 24px Inter, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('⚠️ システム復旧中', this.canvas.width / 2, this.canvas.height / 2 - 20);
      
      this.ctx.font = '16px Inter, sans-serif';
      this.ctx.fillText('フォールバックデータで表示しています', this.canvas.width / 2, this.canvas.height / 2 + 20);
    }

    /**
     * visualizer-content更新
     */
    updateVisualizerContent(process, nodes) {
      console.log('📝 [DEBUG] Updating visualizer-content');
      
      const visualizerContent = this.container.querySelector('.visualizer-content');
      if (!visualizerContent) {
        console.warn('⚠️ visualizer-content not found');
        return;
      }
      
      const stagesInfo = process.stages.map(stage => `
        <div style="margin: 10px 0; padding: 10px; background: #f0f9ff; border-radius: 6px;">
          <strong>${stage.title}</strong><br>
          <small>${stage.description}</small><br>
          選択肢: ${stage.choices.length}個
        </div>
      `).join('');
      
      visualizerContent.innerHTML = `
        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <h5 style="margin: 0 0 10px 0; color: #1f2937;">🎨 三段階可視化システム</h5>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 12px;">
            <div><strong>プロセス:</strong> ${process.progressTheme || 'N/A'}</div>
            <div><strong>ノード数:</strong> ${nodes.length}</div>
            <div><strong>描画状態:</strong> ✅ 完了</div>
          </div>
        </div>
        <div style="font-size: 14px;">
          ${stagesInfo}
        </div>
      `;
      
      console.log('✅ [DEBUG] visualizer-content updated successfully');
    }
  }

  // グローバル登録
  if (typeof window !== 'undefined') {
    window.ThreeStageVisualizer = ThreeStageVisualizer;
  }

  console.log('✅ ThreeStageVisualizer loaded');
  
})(typeof window !== 'undefined' ? window : this);