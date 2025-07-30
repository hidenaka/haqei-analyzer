// DataManagerパフォーマンステスト
// 使用方法: node test-datamanager-performance.js

console.log('🚀 DataManagerパフォーマンステスト開始\n');

// 模擬的なhexagramデータを生成
function createMockHexagramData(count = 64) {
  const hexagrams = [];
  for (let i = 1; i <= count; i++) {
    hexagrams.push({
      hexagram_id: i,
      name_jp: `八卦${i}`,
      name: `Hexagram${i}`,
      catchphrase: `テストキャッチフレーズ${i}`,
      description: `テスト説明文${i}`,
      keywords: [`キーワード${i}`, `テスト${i}`]
    });
  }
  return hexagrams;
}

// 模擬的なグローバル環境を設定
global.window = {
  HAQEI_DATA: {
    hexagrams: createMockHexagramData(64),
    os_manual: {},
    trigrams_master: [],
    element_relationships: [],
    action_plans: {},
    tuan_den: {},
    tai_sho_den: {},
    sho_den: {},
    jo_ka_den: {},
    zatsu_ka_den: {}
  },
  WORLDVIEW_QUESTIONS: [],
  SCENARIO_QUESTIONS: [],
  H64_8D_VECTORS: {}
};

global.performance = {
  now: () => Date.now()
};

// DataManagerクラスの簡略版（テスト用）
class DataManager {
  constructor() {
    this.data = {};
    this.loaded = false;
    this.cache = new Map();
    this.hexagramIndex = new Map();
    this.hexagramNameIndex = new Map();
    this.hexagramArray = null;
    this.cacheTimeout = 300000;
    this.performanceMetrics = {
      operationCount: 0,
      cacheHits: 0,
      cacheMisses: 0,
      totalOperationTime: 0
    };
  }

  async loadData() {
    console.log('📥 データ読み込み開始');
    this.data = {
      hexagrams: global.window.HAQEI_DATA.hexagrams,
      questions: { worldview: [], scenarios: [] },
      vectors: {},
      osManual: {}
    };
    this.buildHexagramIndexes();
    this.loaded = true;
    console.log('✅ データ読み込み完了\n');
  }

  buildHexagramIndexes() {
    this.hexagramIndex.clear();
    this.hexagramNameIndex.clear();
    
    if (Array.isArray(this.data.hexagrams)) {
      this.data.hexagrams.forEach(hexagram => {
        if (hexagram && hexagram.hexagram_id) {
          this.hexagramIndex.set(hexagram.hexagram_id, hexagram);
          if (hexagram.name_jp) {
            this.hexagramNameIndex.set(hexagram.name_jp, hexagram);
          }
        }
      });
      this.hexagramArray = this.data.hexagrams.slice();
    }
    
    console.log(`🔨 インデックス構築完了: ID索引=${this.hexagramIndex.size}件, 名前索引=${this.hexagramNameIndex.size}件`);
  }

  // 旧版（非効率版）
  getAllHexagramData_OLD() {
    const hexagramsData = this.data.hexagrams || {};
    if (Array.isArray(hexagramsData)) {
      return hexagramsData;
    } else if (typeof hexagramsData === "object") {
      return Object.values(hexagramsData); // 毎回変換
    }
    return [];
  }

  findHexagramById_OLD(hexagramId) {
    const hexagrams = this.getAllHexagramData_OLD();
    return hexagrams.find(h => h && h.hexagram_id === hexagramId) || null;
  }

  // 新版（高効率版）
  getAllHexagramData_NEW() {
    if (this.hexagramArray) {
      return this.hexagramArray; // キャッシュ使用
    }
    return this.getAllHexagramData_OLD(); // フォールバック
  }

  findHexagramById_NEW(hexagramId) {
    if (this.hexagramIndex.has(hexagramId)) {
      return this.hexagramIndex.get(hexagramId); // O(1)検索
    }
    return this.findHexagramById_OLD(hexagramId); // フォールバック
  }

  // パフォーマンス統計をリセット
  resetMetrics() {
    this.performanceMetrics = {
      operationCount: 0,
      cacheHits: 0,
      cacheMisses: 0,
      totalOperationTime: 0
    };
  }

  getPerformanceStats() {
    return {
      operationCount: this.performanceMetrics.operationCount,
      cacheHitRate: this.performanceMetrics.cacheHits / 
        (this.performanceMetrics.cacheHits + this.performanceMetrics.cacheMisses) * 100,
      avgOperationTime: this.performanceMetrics.totalOperationTime / 
        this.performanceMetrics.operationCount
    };
  }
}

// パフォーマンステスト実行
async function runPerformanceTest() {
  const dataManager = new DataManager();
  await dataManager.loadData();

  const testIterations = 1000;
  const testIds = [1, 15, 32, 47, 64, 5, 23, 41, 58, 12]; // ランダムなID

  console.log(`📊 パフォーマンステスト開始 (反復回数: ${testIterations}回)\n`);

  // ===== 旧版テスト =====
  console.log('🐌 旧版（非効率版）テスト開始');
  const oldStartTime = performance.now();
  
  for (let i = 0; i < testIterations; i++) {
    // getAllHexagramDataテスト
    dataManager.getAllHexagramData_OLD();
    
    // findHexagramByIdテスト
    for (const id of testIds) {
      dataManager.findHexagramById_OLD(id);
    }
  }
  
  const oldEndTime = performance.now();
  const oldTotalTime = oldEndTime - oldStartTime;
  
  console.log(`⏱️ 旧版実行時間: ${oldTotalTime.toFixed(2)}ms`);
  console.log(`📈 旧版平均時間: ${(oldTotalTime / testIterations).toFixed(4)}ms/回\n`);

  // ===== 新版テスト =====
  console.log('⚡ 新版（高効率版）テスト開始');
  const newStartTime = performance.now();
  
  for (let i = 0; i < testIterations; i++) {
    // getAllHexagramDataテスト
    dataManager.getAllHexagramData_NEW();
    
    // findHexagramByIdテスト
    for (const id of testIds) {
      dataManager.findHexagramById_NEW(id);
    }
  }
  
  const newEndTime = performance.now();
  const newTotalTime = newEndTime - newStartTime;
  
  console.log(`⏱️ 新版実行時間: ${newTotalTime.toFixed(2)}ms`);
  console.log(`📈 新版平均時間: ${(newTotalTime / testIterations).toFixed(4)}ms/回\n`);

  // ===== 結果比較 =====
  const speedImprovement = oldTotalTime / newTotalTime;
  const timeReduction = ((oldTotalTime - newTotalTime) / oldTotalTime) * 100;

  console.log('🎯 パフォーマンス改善結果:');
  console.log(`🚀 速度向上倍率: ${speedImprovement.toFixed(2)}倍`);
  console.log(`📉 時間短縮率: ${timeReduction.toFixed(1)}%`);
  console.log(`💾 メモリ効率: インデックスサイズ ${dataManager.hexagramIndex.size}件`);
  
  // 具体的な改善例
  if (speedImprovement > 10) {
    console.log('🎉 劇的な改善！90%以上の時間短縮を達成');
  } else if (speedImprovement > 5) {
    console.log('🌟 大幅改善！80%以上の時間短縮を達成');
  } else if (speedImprovement > 2) {
    console.log('👍 良好な改善！50%以上の時間短縮を達成');
  }

  // ===== メモリ使用量テスト =====
  console.log('\n💾 メモリ使用量分析:');
  const indexMemory = dataManager.hexagramIndex.size * 100; // 概算
  const cacheMemory = dataManager.cache.size * 50; // 概算
  console.log(`📊 ID索引メモリ: ~${(indexMemory / 1024).toFixed(1)}KB`);
  console.log(`📊 キャッシュメモリ: ~${(cacheMemory / 1024).toFixed(1)}KB`);
  console.log(`📊 総推定メモリ: ~${((indexMemory + cacheMemory) / 1024).toFixed(1)}KB`);

  // ===== 検索精度テスト =====
  console.log('\n🎯 検索精度テスト:');
  let accuracyTestPassed = 0;
  for (let id = 1; id <= 64; id++) {
    const oldResult = dataManager.findHexagramById_OLD(id);
    const newResult = dataManager.findHexagramById_NEW(id);
    
    if (JSON.stringify(oldResult) === JSON.stringify(newResult)) {
      accuracyTestPassed++;
    }
  }
  
  console.log(`✅ 検索精度: ${accuracyTestPassed}/64 (${(accuracyTestPassed/64*100).toFixed(1)}%)`);
  
  if (accuracyTestPassed === 64) {
    console.log('🎉 完全一致！新版は旧版と100%同じ結果を返します');
  }

  console.log('\n🏁 パフォーマンステスト完了');
}

// テスト実行
runPerformanceTest().catch(console.error);