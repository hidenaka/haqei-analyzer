/**
 * PerformanceMonitoringDashboard.js - パフォーマンス監視ダッシュボード
 * HAQEI Analyzer Real-time Performance Monitoring System
 * 
 * 目的:
 * - リアルタイムパフォーマンス監視
 * - Core Web Vitals追跡
 * - メモリ使用量可視化
 * - パフォーマンスレポート生成
 * 
 * 機能:
 * - ダッシュボードUI生成
 * - リアルタイムグラフ表示
 * - アラート通知
 * - CSV/JSONエクスポート
 * 
 * バージョン: v1.0.0-monitoring-dashboard
 * 作成日: 2025-08-06
 */

class PerformanceMonitoringDashboard {
  constructor(options = {}) {
    this.options = {
      containerId: 'performance-dashboard',
      updateInterval: 1000,  // 1秒ごとに更新
      historySize: 60,       // 60秒分の履歴
      enableAutoHide: true,
      position: 'bottom-right',
      theme: 'dark',
      ...options
    };
    
    // データストレージ
    this.metrics = {
      webVitals: new Map(),
      memory: new Map(),
      custom: new Map()
    };
    
    // 履歴データ
    this.history = {
      fcp: [],
      lcp: [],
      fid: [],
      cls: [],
      inp: [],
      memory: [],
      fps: []
    };
    
    // UI要素
    this.container = null;
    this.charts = new Map();
    this.isVisible = false;
    this.isMinimized = false;
    
    // 更新タイマー
    this.updateTimer = null;
    
    // パフォーマンスオブザーバー
    this.observers = new Map();
    
    console.log('📊 PerformanceMonitoringDashboard initialized');
  }
  
  /**
   * ダッシュボードの初期化
   */
  async initialize() {
    console.log('🚀 Initializing Performance Dashboard...');
    
    try {
      // UI作成
      this.createDashboardUI();
      
      // オブザーバー設定
      this.setupObservers();
      
      // イベントリスナー設定
      this.setupEventListeners();
      
      // 初期データ収集
      await this.collectInitialData();
      
      // 更新開始
      this.startUpdating();
      
      console.log('✅ Performance Dashboard initialized');
      return true;
      
    } catch (error) {
      console.error('❌ Dashboard initialization failed:', error);
      return false;
    }
  }
  
  /**
   * ダッシュボードUIの作成
   */
  createDashboardUI() {
    // 既存の要素チェック
    this.container = document.getElementById(this.options.containerId);
    
    if (!this.container) {
      // コンテナ作成
      this.container = document.createElement('div');
      this.container.id = this.options.containerId;
      this.container.className = `perf-dashboard ${this.options.theme}`;
      
      // スタイル設定
      this.applyStyles();
      
      document.body.appendChild(this.container);
    }
    
    // ダッシュボードHTML
    this.container.innerHTML = `
      <div class="perf-dashboard-header">
        <h3 class="perf-dashboard-title">
          <span class="icon">📊</span>
          Performance Monitor
        </h3>
        <div class="perf-dashboard-controls">
          <button class="perf-btn minimize" title="Minimize">_</button>
          <button class="perf-btn close" title="Close">×</button>
        </div>
      </div>
      
      <div class="perf-dashboard-body">
        <!-- Core Web Vitals -->
        <div class="perf-section web-vitals">
          <h4>Core Web Vitals</h4>
          <div class="perf-metrics-grid">
            <div class="perf-metric" data-metric="fcp">
              <div class="metric-label">FCP</div>
              <div class="metric-value">--</div>
              <div class="metric-status"></div>
            </div>
            <div class="perf-metric" data-metric="lcp">
              <div class="metric-label">LCP</div>
              <div class="metric-value">--</div>
              <div class="metric-status"></div>
            </div>
            <div class="perf-metric" data-metric="fid">
              <div class="metric-label">FID</div>
              <div class="metric-value">--</div>
              <div class="metric-status"></div>
            </div>
            <div class="perf-metric" data-metric="cls">
              <div class="metric-label">CLS</div>
              <div class="metric-value">--</div>
              <div class="metric-status"></div>
            </div>
            <div class="perf-metric" data-metric="inp">
              <div class="metric-label">INP</div>
              <div class="metric-value">--</div>
              <div class="metric-status"></div>
            </div>
          </div>
        </div>
        
        <!-- Memory Usage -->
        <div class="perf-section memory">
          <h4>Memory Usage</h4>
          <div class="perf-memory-bar">
            <div class="memory-bar-fill" style="width: 0%"></div>
            <div class="memory-bar-text">0 MB / 0 MB</div>
          </div>
          <div class="perf-memory-details">
            <span class="memory-used">Used: <strong>0 MB</strong></span>
            <span class="memory-total">Total: <strong>0 MB</strong></span>
            <span class="memory-percentage">(<strong>0%</strong>)</span>
          </div>
        </div>
        
        <!-- Performance Graph -->
        <div class="perf-section graph">
          <h4>Performance Timeline</h4>
          <div class="perf-graph-container">
            <canvas id="perf-graph-canvas" width="300" height="150"></canvas>
          </div>
          <div class="perf-graph-legend">
            <span class="legend-item fcp">FCP</span>
            <span class="legend-item lcp">LCP</span>
            <span class="legend-item memory">Memory</span>
          </div>
        </div>
        
        <!-- Status & Actions -->
        <div class="perf-section status">
          <div class="perf-status-indicator">
            <span class="status-dot"></span>
            <span class="status-text">Monitoring Active</span>
          </div>
          <div class="perf-actions">
            <button class="perf-btn export" title="Export Data">📥</button>
            <button class="perf-btn clear" title="Clear History">🗑️</button>
            <button class="perf-btn settings" title="Settings">⚙️</button>
          </div>
        </div>
      </div>
    `;
    
    // Canvas取得
    this.canvas = this.container.querySelector('#perf-graph-canvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.isVisible = true;
  }
  
  /**
   * スタイル適用
   */
  applyStyles() {
    const styles = `
      .perf-dashboard {
        position: fixed;
        ${this.getPositionStyles()}
        width: 320px;
        background: rgba(20, 20, 20, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        font-family: 'Inter', -apple-system, sans-serif;
        font-size: 12px;
        color: #e0e0e0;
        z-index: 10000;
        transition: all 0.3s ease;
      }
      
      .perf-dashboard.minimized {
        height: auto !important;
      }
      
      .perf-dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        cursor: move;
      }
      
      .perf-dashboard-title {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      
      .perf-dashboard-controls {
        display: flex;
        gap: 4px;
      }
      
      .perf-btn {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #e0e0e0;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s;
      }
      
      .perf-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.3);
      }
      
      .perf-dashboard-body {
        padding: 12px;
        max-height: 500px;
        overflow-y: auto;
      }
      
      .perf-dashboard.minimized .perf-dashboard-body {
        display: none;
      }
      
      .perf-section {
        margin-bottom: 16px;
      }
      
      .perf-section h4 {
        margin: 0 0 8px 0;
        font-size: 12px;
        font-weight: 600;
        color: #b0b0b0;
        text-transform: uppercase;
      }
      
      .perf-metrics-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 8px;
      }
      
      .perf-metric {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        padding: 8px;
        text-align: center;
      }
      
      .metric-label {
        font-size: 10px;
        color: #888;
        margin-bottom: 4px;
      }
      
      .metric-value {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 4px;
      }
      
      .metric-status {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        margin: 0 auto;
        background: #666;
      }
      
      .metric-status.good { background: #4ade80; }
      .metric-status.needs-improvement { background: #fbbf24; }
      .metric-status.poor { background: #ef4444; }
      
      .perf-memory-bar {
        position: relative;
        height: 24px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 8px;
      }
      
      .memory-bar-fill {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        transition: width 0.3s ease;
      }
      
      .memory-bar-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 11px;
        font-weight: 500;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }
      
      .perf-memory-details {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        color: #888;
      }
      
      .perf-graph-container {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        padding: 8px;
        margin-bottom: 8px;
      }
      
      .perf-graph-legend {
        display: flex;
        justify-content: center;
        gap: 16px;
        font-size: 10px;
      }
      
      .legend-item {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      
      .legend-item::before {
        content: '';
        width: 12px;
        height: 2px;
        display: block;
      }
      
      .legend-item.fcp::before { background: #4ade80; }
      .legend-item.lcp::before { background: #3b82f6; }
      .legend-item.memory::before { background: #8b5cf6; }
      
      .perf-status-indicator {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }
      
      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #4ade80;
        animation: pulse 2s infinite;
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      .perf-actions {
        display: flex;
        gap: 8px;
      }
      
      /* スクロールバー */
      .perf-dashboard-body::-webkit-scrollbar {
        width: 6px;
      }
      
      .perf-dashboard-body::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
      }
      
      .perf-dashboard-body::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
      }
    `;
    
    // スタイル要素作成
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
  }
  
  /**
   * 位置スタイル取得
   */
  getPositionStyles() {
    const positions = {
      'top-left': 'top: 20px; left: 20px;',
      'top-right': 'top: 20px; right: 20px;',
      'bottom-left': 'bottom: 20px; left: 20px;',
      'bottom-right': 'bottom: 20px; right: 20px;'
    };
    
    return positions[this.options.position] || positions['bottom-right'];
  }
  
  /**
   * オブザーバー設定
   */
  setupObservers() {
    // Web Vitals観測
    this.setupWebVitalsObserver();
    
    // メモリ監視イベント
    document.addEventListener('memory-status', (event) => {
      this.updateMemoryMetrics(event.detail);
    });
    
    // カスタムパフォーマンスイベント
    document.addEventListener('performance-update', (event) => {
      this.updateCustomMetrics(event.detail);
    });
  }
  
  /**
   * Web Vitalsオブザーバー設定
   */
  setupWebVitalsObserver() {
    // FCP観測
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          this.updateWebVital('fcp', entry.startTime);
        }
      });
    });
    fcpObserver.observe({ entryTypes: ['paint'] });
    
    // LCP観測
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        this.updateWebVital('lcp', lastEntry.startTime);
      }
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    
    // FID観測
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        const fid = entry.processingStart - entry.startTime;
        this.updateWebVital('fid', fid);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
    
    // CLS観測
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.updateWebVital('cls', clsValue);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
    
    // INP観測
    let maxINP = 0;
    const inpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        const inp = entry.processingEnd - entry.startTime;
        if (inp > maxINP) {
          maxINP = inp;
          this.updateWebVital('inp', inp);
        }
      });
    });
    inpObserver.observe({ entryTypes: ['event'] });
  }
  
  /**
   * イベントリスナー設定
   */
  setupEventListeners() {
    // ヘッダーのドラッグ
    this.setupDraggable();
    
    // コントロールボタン
    const minimizeBtn = this.container.querySelector('.minimize');
    const closeBtn = this.container.querySelector('.close');
    const exportBtn = this.container.querySelector('.export');
    const clearBtn = this.container.querySelector('.clear');
    
    minimizeBtn?.addEventListener('click', () => this.toggleMinimize());
    closeBtn?.addEventListener('click', () => this.close());
    exportBtn?.addEventListener('click', () => this.exportData());
    clearBtn?.addEventListener('click', () => this.clearHistory());
    
    // キーボードショートカット
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        this.toggle();
      }
    });
  }
  
  /**
   * ドラッグ可能設定
   */
  setupDraggable() {
    const header = this.container.querySelector('.perf-dashboard-header');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    
    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('.perf-dashboard-controls')) return;
      
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
      isDragging = true;
      header.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      xOffset = currentX;
      yOffset = currentY;
      
      this.container.style.transform = `translate(${currentX}px, ${currentY}px)`;
    });
    
    document.addEventListener('mouseup', () => {
      isDragging = false;
      header.style.cursor = 'move';
    });
  }
  
  /**
   * 初期データ収集
   */
  async collectInitialData() {
    // メモリ情報
    if (performance.memory) {
      this.updateMemoryMetrics({
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      });
    }
    
    // Navigation Timing
    if (performance.timing) {
      const timing = performance.timing;
      const navigationStart = timing.navigationStart;
      
      // 計算されたメトリクス
      const ttfb = timing.responseStart - navigationStart;
      const domContentLoaded = timing.domContentLoadedEventEnd - navigationStart;
      const loadComplete = timing.loadEventEnd - navigationStart;
      
      this.metrics.custom.set('ttfb', ttfb);
      this.metrics.custom.set('domContentLoaded', domContentLoaded);
      this.metrics.custom.set('loadComplete', loadComplete);
    }
  }
  
  /**
   * 更新開始
   */
  startUpdating() {
    this.updateTimer = setInterval(() => {
      this.updateDisplay();
      this.updateGraph();
    }, this.options.updateInterval);
    
    // 初回更新
    this.updateDisplay();
  }
  
  /**
   * Web Vital更新
   */
  updateWebVital(metric, value) {
    this.metrics.webVitals.set(metric, value);
    
    // 履歴に追加
    if (this.history[metric]) {
      this.history[metric].push({
        value,
        timestamp: Date.now()
      });
      
      // 履歴サイズ制限
      if (this.history[metric].length > this.options.historySize) {
        this.history[metric].shift();
      }
    }
    
    // 即座に表示更新
    this.updateMetricDisplay(metric, value);
  }
  
  /**
   * メトリクス表示更新
   */
  updateMetricDisplay(metric, value) {
    const element = this.container.querySelector(`[data-metric="${metric}"]`);
    if (!element) return;
    
    const valueEl = element.querySelector('.metric-value');
    const statusEl = element.querySelector('.metric-status');
    
    // 値表示
    let displayValue;
    let status = 'good';
    
    switch (metric) {
      case 'fcp':
      case 'lcp':
      case 'fid':
      case 'inp':
        displayValue = `${Math.round(value)}ms`;
        
        // 閾値判定
        if (metric === 'fcp') {
          if (value > 3000) status = 'poor';
          else if (value > 1800) status = 'needs-improvement';
        } else if (metric === 'lcp') {
          if (value > 4000) status = 'poor';
          else if (value > 2500) status = 'needs-improvement';
        } else if (metric === 'fid' || metric === 'inp') {
          if (value > 300) status = 'poor';
          else if (value > 100) status = 'needs-improvement';
        }
        break;
        
      case 'cls':
        displayValue = value.toFixed(3);
        if (value > 0.25) status = 'poor';
        else if (value > 0.1) status = 'needs-improvement';
        break;
        
      default:
        displayValue = value;
    }
    
    valueEl.textContent = displayValue;
    statusEl.className = `metric-status ${status}`;
  }
  
  /**
   * メモリメトリクス更新
   */
  updateMemoryMetrics(data) {
    const used = data.usedJSHeapSize || 0;
    const total = data.totalJSHeapSize || 0;
    const limit = data.jsHeapSizeLimit || 0;
    
    this.metrics.memory.set('used', used);
    this.metrics.memory.set('total', total);
    this.metrics.memory.set('limit', limit);
    
    // 履歴に追加
    this.history.memory.push({
      used,
      total,
      percentage: (used / limit) * 100,
      timestamp: Date.now()
    });
    
    if (this.history.memory.length > this.options.historySize) {
      this.history.memory.shift();
    }
    
    // メモリ表示更新
    this.updateMemoryDisplay();
  }
  
  /**
   * メモリ表示更新
   */
  updateMemoryDisplay() {
    const used = this.metrics.memory.get('used') || 0;
    const total = this.metrics.memory.get('total') || 0;
    const limit = this.metrics.memory.get('limit') || 0;
    
    const percentage = limit > 0 ? (used / limit) * 100 : 0;
    
    // バー更新
    const barFill = this.container.querySelector('.memory-bar-fill');
    const barText = this.container.querySelector('.memory-bar-text');
    
    barFill.style.width = `${percentage}%`;
    barText.textContent = `${(used / 1024 / 1024).toFixed(1)} MB / ${(limit / 1024 / 1024).toFixed(0)} MB`;
    
    // 詳細更新
    const usedEl = this.container.querySelector('.memory-used strong');
    const totalEl = this.container.querySelector('.memory-total strong');
    const percentEl = this.container.querySelector('.memory-percentage strong');
    
    usedEl.textContent = `${(used / 1024 / 1024).toFixed(1)} MB`;
    totalEl.textContent = `${(total / 1024 / 1024).toFixed(1)} MB`;
    percentEl.textContent = `${percentage.toFixed(1)}%`;
    
    // 色の変更
    if (percentage > 80) {
      barFill.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
    } else if (percentage > 60) {
      barFill.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
    } else {
      barFill.style.background = 'linear-gradient(90deg, #3b82f6, #8b5cf6)';
    }
  }
  
  /**
   * カスタムメトリクス更新
   */
  updateCustomMetrics(data) {
    if (data.type && data.data) {
      this.metrics.custom.set(data.type, data.data);
    }
  }
  
  /**
   * 表示更新
   */
  updateDisplay() {
    // Web Vitals更新
    this.metrics.webVitals.forEach((value, metric) => {
      this.updateMetricDisplay(metric, value);
    });
    
    // メモリ更新
    this.updateMemoryDisplay();
    
    // FPS計算
    this.calculateFPS();
  }
  
  /**
   * グラフ更新
   */
  updateGraph() {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    // クリア
    ctx.clearRect(0, 0, width, height);
    
    // グリッド描画
    this.drawGrid(ctx, width, height);
    
    // データ描画
    this.drawGraphLine(ctx, this.history.fcp, '#4ade80', 'fcp', 4000);
    this.drawGraphLine(ctx, this.history.lcp, '#3b82f6', 'lcp', 6000);
    this.drawGraphLine(ctx, this.history.memory, '#8b5cf6', 'memory', 100);
  }
  
  /**
   * グリッド描画
   */
  drawGrid(ctx, width, height) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // 横線
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }
  
  /**
   * グラフライン描画
   */
  drawGraphLine(ctx, history, color, type, maxValue) {
    if (history.length < 2) return;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const step = this.canvas.width / (this.options.historySize - 1);
    
    history.forEach((point, index) => {
      const x = index * step;
      let y;
      
      if (type === 'memory') {
        y = this.canvas.height - (point.percentage / maxValue) * this.canvas.height;
      } else {
        y = this.canvas.height - (point.value / maxValue) * this.canvas.height;
      }
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
  }
  
  /**
   * FPS計算
   */
  calculateFPS() {
    let lastTime = performance.now();
    let frames = 0;
    
    const measureFPS = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        
        this.history.fps.push({
          value: fps,
          timestamp: Date.now()
        });
        
        if (this.history.fps.length > this.options.historySize) {
          this.history.fps.shift();
        }
        
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }
  
  /**
   * データエクスポート
   */
  exportData() {
    const data = {
      timestamp: new Date().toISOString(),
      webVitals: Object.fromEntries(this.metrics.webVitals),
      memory: Object.fromEntries(this.metrics.memory),
      custom: Object.fromEntries(this.metrics.custom),
      history: {
        fcp: this.history.fcp.slice(-10),
        lcp: this.history.lcp.slice(-10),
        memory: this.history.memory.slice(-10)
      }
    };
    
    // JSONダウンロード
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('📥 Performance data exported');
  }
  
  /**
   * 履歴クリア
   */
  clearHistory() {
    Object.keys(this.history).forEach(key => {
      this.history[key] = [];
    });
    
    console.log('🗑️ Performance history cleared');
  }
  
  /**
   * 最小化トグル
   */
  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    this.container.classList.toggle('minimized', this.isMinimized);
  }
  
  /**
   * 表示トグル
   */
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }
  
  /**
   * 表示
   */
  show() {
    this.container.style.display = 'block';
    this.isVisible = true;
    
    if (!this.updateTimer) {
      this.startUpdating();
    }
  }
  
  /**
   * 非表示
   */
  hide() {
    this.container.style.display = 'none';
    this.isVisible = false;
    
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
  }
  
  /**
   * 閉じる
   */
  close() {
    this.hide();
    
    // 完全に削除する場合
    if (this.options.enableAutoHide) {
      this.destroy();
    }
  }
  
  /**
   * 破棄
   */
  destroy() {
    // タイマー停止
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
    }
    
    // オブザーバー停止
    this.observers.forEach(observer => observer.disconnect());
    
    // DOM削除
    if (this.container) {
      this.container.remove();
    }
    
    console.log('💥 PerformanceMonitoringDashboard destroyed');
  }
}

// グローバル公開
if (typeof window !== 'undefined') {
  window.PerformanceMonitoringDashboard = PerformanceMonitoringDashboard;
  console.log('✅ PerformanceMonitoringDashboard loaded');
}

// Node.js環境でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceMonitoringDashboard;
}