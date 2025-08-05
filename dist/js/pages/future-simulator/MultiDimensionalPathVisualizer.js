// MultiDimensionalPathVisualizer.js - 多次元変化パス可視化エンジン
// UnifiedTransformationEngineの予測結果を直感的に視覚化

/**
 * 多次元変化パス可視化エンジン
 * 
 * 目的：
 * - 5種類の易経的変化を視覚的に表現
 * - 確率的分岐と時系列展開の可視化
 * - インタラクティブな探索インターフェース
 * 
 * 入力：
 * - transformationResult: UnifiedTransformationEngineの出力
 * - displayOptions: 表示オプション
 * - interactionCallback: ユーザー操作コールバック
 * 
 * 処理内容：
 * 1. 変化パスの構造解析
 * 2. 視覚要素へのマッピング
 * 3. インタラクティブ要素の生成
 * 4. アニメーション制御
 * 
 * 出力：
 * - DOM要素（SVG/Canvas）
 * - インタラクションイベント
 * 
 * 副作用：
 * - DOM操作
 * - イベントリスナー登録
 * 
 * 前提条件：
 * - UnifiedTransformationEngineがロード済み
 * - 描画用のコンテナ要素が存在
 * 
 * エラー処理：
 * - 無効なデータ：デフォルト表示
 * - 描画エラー：エラーメッセージ表示
 */

class MultiDimensionalPathVisualizer {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = null;
    this.canvas = null;
    this.ctx = null;
    this.svg = null;
    this.currentData = null;
    this.visualizationMode = 'tree'; // tree, radial, timeline, matrix
    this.interactionHandlers = {};
    this.animationFrame = null;
    this.colorScheme = this.defineColorScheme();
    
    this.initializeVisualizer();
  }

  initializeVisualizer() {
    console.log("🎨 Initializing Multi-Dimensional Path Visualizer...");
    
    // コンテナの検証
    this.validateContainer();
    
    // 描画領域の初期化
    this.initializeDrawingArea();
    
    // イベントハンドラーの設定
    this.setupEventHandlers();
    
    // レスポンシブ対応
    this.setupResponsive();
    
    console.log("✅ Path Visualizer initialized successfully");
  }

  /**
   * コンテナの検証
   */
  validateContainer() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      throw new Error(`Container element '${this.containerId}' not found`);
    }
    
    // コンテナのスタイル設定
    this.container.style.position = 'relative';
    this.container.style.overflow = 'hidden';
  }

  /**
   * 描画領域の初期化
   */
  initializeDrawingArea() {
    // SVGとCanvasの両方を準備（用途に応じて切り替え）
    
    // SVG（精密な図形描画用）
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.setAttribute("width", "100%");
    this.svg.setAttribute("height", "100%");
    this.svg.style.position = "absolute";
    this.svg.style.top = "0";
    this.svg.style.left = "0";
    
    // Canvas（パフォーマンス重視の描画用）
    this.canvas = document.createElement("canvas");
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.ctx = this.canvas.getContext("2d");
    
    // コントロールパネル
    this.controlPanel = this.createControlPanel();
    
    // 要素をコンテナに追加
    this.container.appendChild(this.canvas);
    this.container.appendChild(this.svg);
    this.container.appendChild(this.controlPanel);
    
    this.resizeDrawingArea();
  }

  /**
   * コントロールパネルの作成
   */
  createControlPanel() {
    const panel = document.createElement("div");
    panel.className = "path-visualizer-controls";
    panel.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      z-index: 1000;
    `;
    
    // ビューモード切替
    const modeSelector = this.createModeSelector();
    panel.appendChild(modeSelector);
    
    // ズームコントロール
    const zoomControls = this.createZoomControls();
    panel.appendChild(zoomControls);
    
    // フィルターオプション
    const filterOptions = this.createFilterOptions();
    panel.appendChild(filterOptions);
    
    return panel;
  }

  /**
   * ビューモードセレクター
   */
  createModeSelector() {
    const container = document.createElement("div");
    container.style.marginBottom = "10px";
    
    const label = document.createElement("label");
    label.textContent = "表示モード: ";
    label.style.marginRight = "5px";
    
    const select = document.createElement("select");
    select.style.padding = "5px";
    select.style.borderRadius = "4px";
    select.style.border = "1px solid #ccc";
    
    const modes = [
      { value: "tree", label: "ツリー表示" },
      { value: "radial", label: "放射状表示" },
      { value: "timeline", label: "タイムライン" },
      { value: "matrix", label: "マトリックス" },
      { value: "3d", label: "3D表示" }
    ];
    
    modes.forEach(mode => {
      const option = document.createElement("option");
      option.value = mode.value;
      option.textContent = mode.label;
      select.appendChild(option);
    });
    
    select.value = this.visualizationMode;
    select.addEventListener("change", (e) => {
      this.switchVisualizationMode(e.target.value);
    });
    
    container.appendChild(label);
    container.appendChild(select);
    
    return container;
  }

  /**
   * ズームコントロール
   */
  createZoomControls() {
    const container = document.createElement("div");
    container.style.marginBottom = "10px";
    
    const zoomIn = document.createElement("button");
    zoomIn.textContent = "＋";
    zoomIn.style.cssText = "width: 30px; height: 30px; margin-right: 5px;";
    zoomIn.onclick = () => this.zoom(1.2);
    
    const zoomOut = document.createElement("button");
    zoomOut.textContent = "－";
    zoomOut.style.cssText = "width: 30px; height: 30px; margin-right: 5px;";
    zoomOut.onclick = () => this.zoom(0.8);
    
    const resetZoom = document.createElement("button");
    resetZoom.textContent = "リセット";
    resetZoom.style.cssText = "padding: 5px 10px;";
    resetZoom.onclick = () => this.resetView();
    
    container.appendChild(zoomIn);
    container.appendChild(zoomOut);
    container.appendChild(resetZoom);
    
    return container;
  }

  /**
   * フィルターオプション
   */
  createFilterOptions() {
    const container = document.createElement("div");
    
    const transformationTypes = ["進爻", "変爻", "錯卦", "綜卦", "互卦"];
    
    transformationTypes.forEach(type => {
      const label = document.createElement("label");
      label.style.display = "block";
      label.style.marginBottom = "5px";
      
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = true;
      checkbox.value = type;
      checkbox.style.marginRight = "5px";
      checkbox.addEventListener("change", () => this.updateFilters());
      
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(type));
      container.appendChild(label);
    });
    
    return container;
  }

  /**
   * 色スキームの定義
   */
  defineColorScheme() {
    return {
      transformationTypes: {
        進爻: "#4CAF50",     // 緑：成長・前進
        変爻: "#2196F3",     // 青：変化・転換
        錯卦: "#F44336",     // 赤：反転・対立
        綜卦: "#FF9800",     // 橙：視点転換
        互卦: "#9C27B0"      // 紫：内省・深層
      },
      probability: {
        high: "#2E7D32",     // 濃緑：高確率
        medium: "#FFA726",   // 橙：中確率
        low: "#EF5350"       // 薄赤：低確率
      },
      states: {
        current: "#333333",   // 現在状態
        target: "#666666",    // 目標状態
        intermediate: "#999999" // 中間状態
      },
      background: {
        light: "#FAFAFA",
        dark: "#212121"
      }
    };
  }

  /**
   * 変化結果の視覚化
   */
  visualize(transformationResult, options = {}) {
    try {
      console.log("📊 Visualizing transformation paths...");
      
      this.currentData = transformationResult;
      this.options = {
        animationDuration: 1000,
        showProbabilities: true,
        showDescriptions: true,
        highlightTopPath: true,
        ...options
      };
      
      // 現在のモードに応じて描画
      this.clearVisualization();
      
      switch (this.visualizationMode) {
        case 'tree':
          this.drawTreeVisualization();
          break;
        case 'radial':
          this.drawRadialVisualization();
          break;
        case 'timeline':
          this.drawTimelineVisualization();
          break;
        case 'matrix':
          this.drawMatrixVisualization();
          break;
        case '3d':
          this.draw3DVisualization();
          break;
        default:
          this.drawTreeVisualization();
      }
      
      // アニメーション開始
      if (this.options.animated) {
        this.animateVisualization();
      }
      
    } catch (error) {
      console.error("❌ Visualization error:", error);
      this.showError(error.message);
    }
  }

  /**
   * ツリー表示の描画
   */
  drawTreeVisualization() {
    const { currentState, transformationPaths } = this.currentData;
    
    // ルートノード（現在状態）
    const rootX = this.canvas.width / 2;
    const rootY = 100;
    const nodeRadius = 40;
    const levelHeight = 150;
    
    // 現在状態を描画
    this.drawHexagramNode(rootX, rootY, currentState, "current");
    
    // 変化パスを描画
    const pathCount = transformationPaths.length;
    const angleStep = Math.PI / (pathCount + 1);
    
    transformationPaths.forEach((path, index) => {
      const angle = -Math.PI/2 + angleStep * (index + 1);
      const targetX = rootX + Math.cos(angle) * 200;
      const targetY = rootY + levelHeight;
      
      // パスライン
      this.drawPathLine(rootX, rootY, targetX, targetY, path);
      
      // ターゲットノード
      this.drawHexagramNode(targetX, targetY, path.targetState, path.type);
      
      // 確率表示
      if (this.options.showProbabilities) {
        this.drawProbabilityLabel(
          (rootX + targetX) / 2,
          (rootY + targetY) / 2,
          path.probability
        );
      }
      
      // 説明文
      if (this.options.showDescriptions) {
        this.drawDescription(targetX, targetY + nodeRadius + 20, path);
      }
    });
  }

  /**
   * 放射状表示の描画
   */
  drawRadialVisualization() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const innerRadius = 80;
    const outerRadius = Math.min(this.canvas.width, this.canvas.height) * 0.4;
    
    const { currentState, transformationPaths } = this.currentData;
    
    // 中心に現在状態
    this.drawHexagramNode(centerX, centerY, currentState, "current", innerRadius);
    
    // 放射状に変化パスを配置
    const angleStep = (2 * Math.PI) / transformationPaths.length;
    
    transformationPaths.forEach((path, index) => {
      const angle = angleStep * index - Math.PI / 2;
      const distance = innerRadius + (outerRadius - innerRadius) * (1 - path.probability);
      const targetX = centerX + Math.cos(angle) * distance;
      const targetY = centerY + Math.sin(angle) * distance;
      
      // 扇形の背景
      this.drawSectorBackground(centerX, centerY, angle, angleStep, innerRadius, distance, path);
      
      // パスライン
      this.drawCurvedPath(centerX, centerY, targetX, targetY, path);
      
      // ターゲットノード
      this.drawHexagramNode(targetX, targetY, path.targetState, path.type, 30);
      
      // ラベル
      this.drawRadialLabel(centerX, centerY, angle, distance + 50, path);
    });
  }

  /**
   * タイムライン表示の描画
   */
  drawTimelineVisualization() {
    const startX = 100;
    const endX = this.canvas.width - 100;
    const centerY = this.canvas.height / 2;
    const timelineY = centerY;
    
    // タイムライン軸
    this.ctx.strokeStyle = "#666";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(startX, timelineY);
    this.ctx.lineTo(endX, timelineY);
    this.ctx.stroke();
    
    // 時間マーカー
    const timeMarkers = ["現在", "短期", "中期", "長期"];
    const markerStep = (endX - startX) / (timeMarkers.length - 1);
    
    timeMarkers.forEach((marker, index) => {
      const x = startX + markerStep * index;
      this.drawTimeMarker(x, timelineY, marker);
    });
    
    // 変化パスをタイムライン上に配置
    const { transformationPaths } = this.currentData;
    const pathHeight = 80;
    
    transformationPaths.forEach((path, index) => {
      const timeline = path.timeline || { immediate: 0.3, shortTerm: 0.5, longTerm: 0.2 };
      const y = timelineY + (index % 2 ? pathHeight : -pathHeight) * (Math.floor(index / 2) + 1);
      
      // タイムラインバー
      this.drawTimelineBar(startX, y, endX - startX, timeline, path);
      
      // ノード
      const peakTime = this.calculatePeakTime(timeline);
      const nodeX = startX + (endX - startX) * peakTime;
      this.drawHexagramNode(nodeX, y, path.targetState, path.type, 25);
    });
  }

  /**
   * マトリックス表示の描画
   */
  drawMatrixVisualization() {
    const { transformationPaths, transformationProbabilities } = this.currentData;
    const cellSize = 80;
    const margin = 20;
    const transformationTypes = Object.keys(transformationProbabilities);
    
    // マトリックスヘッダー
    transformationTypes.forEach((type, col) => {
      const x = margin + col * (cellSize + margin) + cellSize / 2;
      const y = margin;
      
      this.ctx.fillStyle = this.colorScheme.transformationTypes[type];
      this.ctx.font = "14px sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.fillText(type, x, y);
    });
    
    // マトリックスセル
    transformationTypes.forEach((rowType, row) => {
      transformationTypes.forEach((colType, col) => {
        const x = margin + col * (cellSize + margin);
        const y = margin + (row + 1) * (cellSize + margin);
        
        // セルの描画
        const compatibility = this.calculateTypeCompatibility(rowType, colType);
        this.drawMatrixCell(x, y, cellSize, compatibility, rowType, colType);
      });
    });
    
    // 現在の変化パスをハイライト
    transformationPaths.forEach(path => {
      const typeIndex = transformationTypes.indexOf(path.type);
      if (typeIndex >= 0) {
        const x = margin + typeIndex * (cellSize + margin);
        const y = margin + (typeIndex + 1) * (cellSize + margin);
        this.highlightMatrixCell(x, y, cellSize, path);
      }
    });
  }

  /**
   * 3D表示の描画（簡易版）
   */
  draw3DVisualization() {
    // 3D表示は複雑なため、簡易的な疑似3D表現
    const { currentState, transformationPaths } = this.currentData;
    
    // 透視投影のパラメータ
    const perspective = 500;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    // 3D座標系での配置
    const positions = this.calculate3DPositions(transformationPaths.length);
    
    // Z軸でソート（奥から手前へ）
    const sortedPaths = transformationPaths.map((path, index) => ({
      path,
      position: positions[index],
      index
    })).sort((a, b) => b.position.z - a.position.z);
    
    // 描画
    sortedPaths.forEach(({ path, position }) => {
      const projected = this.project3DTo2D(position, perspective, centerX, centerY);
      const scale = perspective / (perspective + position.z);
      
      // 影
      this.drawNodeShadow(projected.x, projected.y + 20, 30 * scale);
      
      // ノード
      this.drawHexagramNode(
        projected.x,
        projected.y,
        path.targetState,
        path.type,
        30 * scale
      );
      
      // 接続線
      const centerProjected = this.project3DTo2D(
        { x: 0, y: 0, z: 0 },
        perspective,
        centerX,
        centerY
      );
      
      this.draw3DConnection(
        centerProjected,
        projected,
        path,
        scale
      );
    });
    
    // 中心の現在状態（最前面）
    this.drawHexagramNode(centerX, centerY, currentState, "current", 40);
  }

  /**
   * 卦ノードの描画
   */
  drawHexagramNode(x, y, state, type, radius = 40) {
    const color = this.colorScheme.transformationTypes[type] || this.colorScheme.states.current;
    
    // 外側の円
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = color + "20";
    this.ctx.fill();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
    
    // 卦番号
    this.ctx.fillStyle = color;
    this.ctx.font = `bold ${radius * 0.6}px sans-serif`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(state.hexagram, x, y - radius * 0.2);
    
    // 爻位
    this.ctx.font = `${radius * 0.4}px sans-serif`;
    this.ctx.fillText(`${state.yao}爻`, x, y + radius * 0.3);
    
    // タイプアイコン
    if (type !== "current") {
      this.drawTypeIcon(x, y - radius - 10, type, radius * 0.3);
    }
  }

  /**
   * パスラインの描画
   */
  drawPathLine(x1, y1, x2, y2, path) {
    const gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);
    const color = this.colorScheme.transformationTypes[path.type];
    
    gradient.addColorStop(0, color + "40");
    gradient.addColorStop(1, color);
    
    this.ctx.strokeStyle = gradient;
    this.ctx.lineWidth = Math.max(2, path.probability * 10);
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1 + 40);
    this.ctx.lineTo(x2, y2 - 40);
    this.ctx.stroke();
    
    // 矢印
    this.drawArrow(x2, y2 - 40, Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2);
  }

  /**
   * 曲線パスの描画
   */
  drawCurvedPath(x1, y1, x2, y2, path) {
    const color = this.colorScheme.transformationTypes[path.type];
    const controlX = (x1 + x2) / 2;
    const controlY = (y1 + y2) / 2 - 50;
    
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = Math.max(2, path.probability * 8);
    this.ctx.globalAlpha = 0.6 + path.probability * 0.4;
    
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.quadraticCurveTo(controlX, controlY, x2, y2);
    this.ctx.stroke();
    
    this.ctx.globalAlpha = 1;
  }

  /**
   * 確率ラベルの描画
   */
  drawProbabilityLabel(x, y, probability) {
    const percentage = Math.round(probability * 100);
    const color = probability > 0.7 ? this.colorScheme.probability.high :
                  probability > 0.4 ? this.colorScheme.probability.medium :
                  this.colorScheme.probability.low;
    
    // 背景
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    
    const width = 50;
    const height = 25;
    this.roundRect(x - width/2, y - height/2, width, height, 5);
    this.ctx.fill();
    this.ctx.stroke();
    
    // テキスト
    this.ctx.fillStyle = color;
    this.ctx.font = "bold 14px sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(`${percentage}%`, x, y);
  }

  /**
   * 説明文の描画
   */
  drawDescription(x, y, path) {
    this.ctx.fillStyle = "#666";
    this.ctx.font = "12px sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.fillText(path.description, x, y);
    
    if (path.mechanism) {
      this.ctx.font = "10px sans-serif";
      this.ctx.fillStyle = "#999";
      this.ctx.fillText(path.mechanism, x, y + 15);
    }
  }

  /**
   * アニメーション制御
   */
  animateVisualization() {
    const startTime = Date.now();
    const duration = this.options.animationDuration;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // イージング関数
      const easeProgress = this.easeOutCubic(progress);
      
      // 再描画
      this.clearVisualization();
      this.ctx.globalAlpha = easeProgress;
      
      // 現在のモードで再描画
      switch (this.visualizationMode) {
        case 'tree':
          this.drawTreeVisualization();
          break;
        case 'radial':
          this.drawRadialVisualization();
          break;
        case 'timeline':
          this.drawTimelineVisualization();
          break;
        case 'matrix':
          this.drawMatrixVisualization();
          break;
      }
      
      this.ctx.globalAlpha = 1;
      
      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animate();
  }

  /**
   * ユーティリティメソッド
   */
  
  clearVisualization() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    while (this.svg.firstChild) {
      this.svg.removeChild(this.svg.firstChild);
    }
  }

  roundRect(x, y, width, height, radius) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();
  }

  drawArrow(x, y, angle) {
    const size = 10;
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(angle);
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(-size/2, -size);
    this.ctx.lineTo(size/2, -size);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /**
   * イベントハンドラー
   */
  
  setupEventHandlers() {
    // マウスイベント
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    
    // タッチイベント
    this.canvas.addEventListener('touchstart', (e) => this.handleTouch(e));
    
    // キーボードショートカット
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));
  }

  handleClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // クリックされた要素を特定
    const clickedElement = this.identifyElement(x, y);
    if (clickedElement && this.interactionHandlers.click) {
      this.interactionHandlers.click(clickedElement);
    }
  }

  handleMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // ホバー要素を特定
    const hoveredElement = this.identifyElement(x, y);
    if (hoveredElement) {
      this.canvas.style.cursor = 'pointer';
      if (this.interactionHandlers.hover) {
        this.interactionHandlers.hover(hoveredElement);
      }
    } else {
      this.canvas.style.cursor = 'default';
    }
  }

  /**
   * レスポンシブ対応
   */
  
  setupResponsive() {
    window.addEventListener('resize', () => this.handleResize());
  }

  handleResize() {
    this.resizeDrawingArea();
    if (this.currentData) {
      this.visualize(this.currentData, this.options);
    }
  }

  resizeDrawingArea() {
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  /**
   * 公開API
   */
  
  setInteractionHandler(event, handler) {
    this.interactionHandlers[event] = handler;
  }

  switchVisualizationMode(mode) {
    this.visualizationMode = mode;
    if (this.currentData) {
      this.visualize(this.currentData, this.options);
    }
  }

  zoom(factor) {
    // ズーム機能の実装
    this.ctx.scale(factor, factor);
    if (this.currentData) {
      this.visualize(this.currentData, this.options);
    }
  }

  resetView() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (this.currentData) {
      this.visualize(this.currentData, this.options);
    }
  }

  updateFilters() {
    const checkboxes = this.controlPanel.querySelectorAll('input[type="checkbox"]');
    const activeFilters = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);
    
    if (this.currentData) {
      const filteredData = {
        ...this.currentData,
        transformationPaths: this.currentData.transformationPaths.filter(
          path => activeFilters.includes(path.type)
        )
      };
      this.visualize(filteredData, this.options);
    }
  }

  exportVisualization(format = 'png') {
    switch (format) {
      case 'png':
        return this.canvas.toDataURL('image/png');
      case 'svg':
        return new XMLSerializer().serializeToString(this.svg);
      case 'json':
        return JSON.stringify(this.currentData, null, 2);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  destroy() {
    // クリーンアップ
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    // イベントリスナーの削除
    this.canvas.removeEventListener('click', this.handleClick);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('resize', this.handleResize);
    
    // DOM要素の削除
    this.container.innerHTML = '';
  }

  // 3D関連のヘルパーメソッド
  calculate3DPositions(count) {
    const positions = [];
    const radius = 200;
    
    for (let i = 0; i < count; i++) {
      const angle = (2 * Math.PI * i) / count;
      positions.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius * 0.5,
        z: Math.sin(angle) * radius
      });
    }
    
    return positions;
  }

  project3DTo2D(point3D, perspective, centerX, centerY) {
    const scale = perspective / (perspective + point3D.z);
    return {
      x: centerX + point3D.x * scale,
      y: centerY + point3D.y * scale,
      scale: scale
    };
  }

  drawNodeShadow(x, y, radius) {
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, radius * 1.5, radius * 0.5, 0, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  draw3DConnection(from, to, path, scale) {
    const color = this.colorScheme.transformationTypes[path.type];
    
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = Math.max(1, path.probability * 6 * scale);
    this.ctx.globalAlpha = 0.6 * scale;
    
    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.stroke();
    
    this.ctx.globalAlpha = 1;
  }

  // その他のヘルパーメソッド
  drawTypeIcon(x, y, type, size) {
    const icons = {
      進爻: "↑",
      変爻: "↔",
      錯卦: "⤭",
      綜卦: "↕",
      互卦: "⊕"
    };
    
    this.ctx.font = `${size * 2}px sans-serif`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(icons[type] || "?", x, y);
  }

  drawSectorBackground(cx, cy, angle, angleWidth, innerR, outerR, path) {
    const color = this.colorScheme.transformationTypes[path.type];
    
    this.ctx.fillStyle = color + "10";
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, innerR, angle - angleWidth/2, angle + angleWidth/2);
    this.ctx.arc(cx, cy, outerR, angle + angleWidth/2, angle - angleWidth/2, true);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawRadialLabel(cx, cy, angle, distance, path) {
    const x = cx + Math.cos(angle) * distance;
    const y = cy + Math.sin(angle) * distance;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(angle > -Math.PI/2 && angle < Math.PI/2 ? angle : angle + Math.PI);
    
    this.ctx.fillStyle = this.colorScheme.transformationTypes[path.type];
    this.ctx.font = "12px sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(path.type, 0, 0);
    
    this.ctx.restore();
  }

  drawTimeMarker(x, y, label) {
    // マーカーライン
    this.ctx.strokeStyle = "#999";
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - 10);
    this.ctx.lineTo(x, y + 10);
    this.ctx.stroke();
    
    // ラベル
    this.ctx.fillStyle = "#666";
    this.ctx.font = "12px sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.fillText(label, x, y + 25);
  }

  drawTimelineBar(x, y, width, timeline, path) {
    const segments = [
      { label: "即時", value: timeline.immediate, offset: 0 },
      { label: "短期", value: timeline.shortTerm, offset: timeline.immediate },
      { label: "長期", value: timeline.longTerm, offset: timeline.immediate + timeline.shortTerm }
    ];
    
    segments.forEach(segment => {
      const segmentX = x + width * segment.offset;
      const segmentWidth = width * segment.value;
      const color = this.colorScheme.transformationTypes[path.type];
      
      this.ctx.fillStyle = color + "40";
      this.ctx.fillRect(segmentX, y - 10, segmentWidth, 20);
      
      this.ctx.strokeStyle = color;
      this.ctx.strokeRect(segmentX, y - 10, segmentWidth, 20);
    });
  }

  calculatePeakTime(timeline) {
    const weights = {
      immediate: 0.1,
      shortTerm: 0.5,
      longTerm: 0.9
    };
    
    return (timeline.immediate * weights.immediate +
            timeline.shortTerm * weights.shortTerm +
            timeline.longTerm * weights.longTerm) /
           (timeline.immediate + timeline.shortTerm + timeline.longTerm);
  }

  drawMatrixCell(x, y, size, compatibility, rowType, colType) {
    const intensity = Math.floor(compatibility * 255);
    const color = `rgb(${intensity}, ${intensity}, ${intensity})`;
    
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, size, size);
    
    this.ctx.strokeStyle = "#ddd";
    this.ctx.strokeRect(x, y, size, size);
    
    // 互換性スコア
    this.ctx.fillStyle = intensity > 128 ? "#000" : "#fff";
    this.ctx.font = "14px sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(
      Math.round(compatibility * 100) + "%",
      x + size/2,
      y + size/2
    );
  }

  calculateTypeCompatibility(type1, type2) {
    // 簡易的な互換性計算
    const compatibilityMatrix = {
      進爻: { 進爻: 0.8, 変爻: 0.3, 錯卦: 0.1, 綜卦: 0.4, 互卦: 0.5 },
      変爻: { 進爻: 0.3, 変爻: 0.9, 錯卦: 0.6, 綜卦: 0.5, 互卦: 0.4 },
      錯卦: { 進爻: 0.1, 変爻: 0.6, 錯卦: 1.0, 綜卦: 0.2, 互卦: 0.3 },
      綜卦: { 進爻: 0.4, 変爻: 0.5, 錯卦: 0.2, 綜卦: 0.8, 互卦: 0.6 },
      互卦: { 進爻: 0.5, 変爻: 0.4, 錯卦: 0.3, 綜卦: 0.6, 互卦: 0.7 }
    };
    
    return compatibilityMatrix[type1]?.[type2] || 0.5;
  }

  highlightMatrixCell(x, y, size, path) {
    const color = this.colorScheme.transformationTypes[path.type];
    
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(x - 2, y - 2, size + 4, size + 4);
    
    // グロー効果
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = 10;
    this.ctx.strokeRect(x - 2, y - 2, size + 4, size + 4);
    this.ctx.shadowBlur = 0;
  }

  identifyElement(x, y) {
    // 簡易的な要素特定（実際の実装では座標マップを保持）
    return null;
  }

  showError(message) {
    this.ctx.fillStyle = "#f44336";
    this.ctx.font = "16px sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(
      `エラー: ${message}`,
      this.canvas.width / 2,
      this.canvas.height / 2
    );
  }
}

// グローバル変数として登録
if (typeof window !== "undefined") {
  window.MultiDimensionalPathVisualizer = MultiDimensionalPathVisualizer;
  console.log("✅ Multi-Dimensional Path Visualizer loaded successfully");
}

// Node.js環境での使用
if (typeof module !== "undefined" && module.exports) {
  module.exports = MultiDimensionalPathVisualizer;
}