/**
 * ProgressiveDataManager.js - プログレッシブデータ読み込みシステム
 * HAQEI Analyzer Bundle Optimization Implementation
 * 
 * 目的:
 * - 大容量データファイルの分割読み込み
 * - バンドルサイズ削減（8.74MB → 1.8MB）
 * - Core Web Vitals改善
 * - メモリ効率的なデータ管理
 * 
 * 機能:
 * - チャンク単位のデータ読み込み
 * - 優先度ベースのローディング
 * - キャッシュ管理
 * - プログレス追跡
 * 
 * バージョン: v1.0.0-progressive
 * 作成日: 2025-08-05
 */

class ProgressiveDataManager {
  constructor() {
    this.loadedChunks = new Set();
    this.chunkQueue = [];
    this.loadingChunks = new Map();
    this.dataCache = new Map();
    
    // チャンク構成
    this.chunkConfig = {
      hexagrams: {
        totalChunks: 10,
        baseUrl: '/js/data/chunks/hexagrams_chunk_',
        globalVar: 'HEXAGRAMS_CHUNK_'
      },
      h384_yao: {
        totalChunks: 10,
        baseUrl: '/js/data/chunks/h384_yao_chunk_',
        globalVar: 'H384_YAO_CHUNK_'
      },
      h384_structure: {
        totalChunks: 5,
        baseUrl: '/js/data/chunks/h384_structure_chunk_',
        globalVar: 'H384_STRUCTURE_CHUNK_'
      }
    };
    
    // 統合データ
    this.hexagramsData = [];
    this.h384YaoData = {};
    this.h384StructureData = {};
    
    console.log('🔄 ProgressiveDataManager initialized');
  }
  
  /**
   * データチャンクの読み込み
   */
  async loadDataChunk(dataType, chunkIndex, priority = 'low') {
    const chunkId = `${dataType}_${chunkIndex}`;
    
    // 既に読み込み済み
    if (this.loadedChunks.has(chunkId)) {
      return Promise.resolve(this.getChunkData(dataType, chunkIndex));
    }
    
    // 読み込み中の場合は既存のPromiseを返す
    if (this.loadingChunks.has(chunkId)) {
      return this.loadingChunks.get(chunkId);
    }
    
    const config = this.chunkConfig[dataType];
    if (!config) {
      throw new Error(`Unknown data type: ${dataType}`);
    }
    
    const chunkUrl = `${config.baseUrl}${chunkIndex}.js`;
    
    const loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = chunkUrl;
      script.async = true;
      
      // 優先度設定
      if (priority === 'high') {
        script.fetchPriority = 'high';
      }
      
      script.onload = () => {
        this.loadedChunks.add(chunkId);
        this.loadingChunks.delete(chunkId);
        
        // グローバル変数からデータを取得して統合
        const globalVarName = `${config.globalVar}${chunkIndex}`;
        const chunkData = window[globalVarName];
        
        if (chunkData) {
          this.integrateChunkData(dataType, chunkIndex, chunkData);
          console.log(`✅ Loaded chunk: ${chunkId}`);
          resolve(chunkData);
        } else {
          reject(new Error(`Chunk data not found: ${globalVarName}`));
        }
      };
      
      script.onerror = () => {
        this.loadingChunks.delete(chunkId);
        console.error(`❌ Failed to load chunk: ${chunkId}`);
        reject(new Error(`Failed to load chunk: ${chunkId}`));
      };
      
      // 優先度に応じた読み込みタイミング
      if (priority === 'high') {
        document.head.appendChild(script);
      } else {
        // 低優先度は少し遅延させる
        setTimeout(() => {
          document.head.appendChild(script);
        }, Math.random() * 500);
      }
    });
    
    this.loadingChunks.set(chunkId, loadPromise);
    return loadPromise;
  }
  
  /**
   * チャンクデータの統合
   */
  integrateChunkData(dataType, chunkIndex, chunkData) {
    switch (dataType) {
      case 'hexagrams':
        // 配列データの統合
        if (Array.isArray(chunkData)) {
          this.hexagramsData = this.hexagramsData.concat(chunkData);
        }
        break;
        
      case 'h384_yao':
      case 'h384_structure':
        // オブジェクトデータの統合
        const targetData = dataType === 'h384_yao' ? this.h384YaoData : this.h384StructureData;
        Object.assign(targetData, chunkData);
        break;
    }
  }
  
  /**
   * 必要なデータのプログレッシブ読み込み
   */
  async loadRequiredData(requirements = {}) {
    const loadPromises = [];
    
    // 基本的なhexagramデータ（最初の2チャンク）
    if (requirements.hexagrams) {
      loadPromises.push(
        this.loadDataChunk('hexagrams', 0, 'high'),
        this.loadDataChunk('hexagrams', 1, 'high')
      );
    }
    
    // 特定の卦番号に必要なチャンク
    if (requirements.hexagramId) {
      const chunkIndex = Math.floor((requirements.hexagramId - 1) / 7);
      loadPromises.push(
        this.loadDataChunk('hexagrams', chunkIndex, 'high')
      );
    }
    
    // H384データ（爻辞）
    if (requirements.yaoText && requirements.hexagramId) {
      // 特定の卦に対応するチャンクを計算
      const yaoChunkIndex = Math.floor((requirements.hexagramId - 1) / 7);
      loadPromises.push(
        this.loadDataChunk('h384_yao', yaoChunkIndex, 'medium')
      );
    }
    
    await Promise.all(loadPromises);
    
    console.log(`✅ Required data loaded: ${Object.keys(requirements).join(', ')}`);
  }
  
  /**
   * 全データの段階的読み込み
   */
  async loadAllDataProgressively() {
    console.log('🔄 Starting progressive data loading...');
    
    // Stage 1: クリティカルデータ（最初の表示に必要）
    await Promise.all([
      this.loadDataChunk('hexagrams', 0, 'high'),
      this.loadDataChunk('hexagrams', 1, 'high')
    ]);
    
    console.log('✅ Stage 1: Critical data loaded');
    
    // Stage 2: セカンダリデータ（インタラクション後）
    const stage2Promises = [];
    for (let i = 2; i < 5; i++) {
      stage2Promises.push(this.loadDataChunk('hexagrams', i, 'medium'));
    }
    
    setTimeout(async () => {
      await Promise.all(stage2Promises);
      console.log('✅ Stage 2: Secondary data loaded');
      
      // Stage 3: 残りのデータ（バックグラウンド）
      this.loadRemainingDataInBackground();
    }, 2000);
  }
  
  /**
   * バックグラウンドでの残りデータ読み込み
   */
  async loadRemainingDataInBackground() {
    const remainingPromises = [];
    
    // 残りのhexagramチャンク
    for (let i = 5; i < this.chunkConfig.hexagrams.totalChunks; i++) {
      remainingPromises.push(
        this.loadDataChunk('hexagrams', i, 'low')
      );
    }
    
    // H384データチャンク
    for (let i = 0; i < this.chunkConfig.h384_yao.totalChunks; i++) {
      remainingPromises.push(
        this.loadDataChunk('h384_yao', i, 'low')
      );
    }
    
    for (let i = 0; i < this.chunkConfig.h384_structure.totalChunks; i++) {
      remainingPromises.push(
        this.loadDataChunk('h384_structure', i, 'low')
      );
    }
    
    // バッチ処理で読み込み
    const batchSize = 3;
    for (let i = 0; i < remainingPromises.length; i += batchSize) {
      const batch = remainingPromises.slice(i, i + batchSize);
      await Promise.all(batch);
      
      // 次のバッチまで少し待機
      if (i + batchSize < remainingPromises.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log('✅ Stage 3: All background data loaded');
    this.dispatchLoadCompleteEvent();
  }
  
  /**
   * チャンクデータの取得
   */
  getChunkData(dataType, chunkIndex) {
    const config = this.chunkConfig[dataType];
    const globalVarName = `${config.globalVar}${chunkIndex}`;
    return window[globalVarName];
  }
  
  /**
   * 統合データの取得
   */
  getHexagram(hexagramId) {
    return this.hexagramsData.find(h => h.hexagram_id === hexagramId);
  }
  
  getYaoText(key) {
    return this.h384YaoData[key];
  }
  
  getHexagramStructure(hexagramId) {
    return this.h384StructureData[hexagramId];
  }
  
  /**
   * 読み込み進捗の取得
   */
  getLoadingProgress() {
    const totalChunks = 
      this.chunkConfig.hexagrams.totalChunks +
      this.chunkConfig.h384_yao.totalChunks +
      this.chunkConfig.h384_structure.totalChunks;
    
    const loadedCount = this.loadedChunks.size;
    const progress = (loadedCount / totalChunks) * 100;
    
    return {
      loaded: loadedCount,
      total: totalChunks,
      percentage: Math.round(progress)
    };
  }
  
  /**
   * 読み込み完了イベントの送信
   */
  dispatchLoadCompleteEvent() {
    const event = new CustomEvent('progressive-data-loaded', {
      detail: {
        hexagrams: this.hexagramsData.length,
        yaoTexts: Object.keys(this.h384YaoData).length,
        structures: Object.keys(this.h384StructureData).length,
        progress: this.getLoadingProgress()
      }
    });
    
    document.dispatchEvent(event);
  }
  
  /**
   * メモリクリーンアップ
   */
  cleanup() {
    // グローバル変数をクリーンアップ
    this.loadedChunks.forEach(chunkId => {
      const [dataType, chunkIndex] = chunkId.split('_');
      const config = this.chunkConfig[dataType];
      if (config) {
        const globalVarName = `${config.globalVar}${chunkIndex}`;
        delete window[globalVarName];
      }
    });
    
    console.log('🧹 Progressive data manager cleaned up');
  }
}

// グローバル公開
if (typeof window !== 'undefined') {
  window.ProgressiveDataManager = ProgressiveDataManager;
  console.log('✅ ProgressiveDataManager loaded');
}

// Node.js環境でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProgressiveDataManager;
}