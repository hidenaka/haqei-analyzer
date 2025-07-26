3 層人格 OS 診断システム - 技術設計書（改訂版）
概要
3 層人格 OS 診断システムにおいて、analyzer.html でのデータ読み込みの問題を解決し、さらに内なるチーム分析のための多次元評価システムを実装する包括的な設計を行います。
アーキテクチャ
システム全体構成
┌─────────────────────────────────────────────────────────────────┐
│ Enhanced HAQEI Analysis System │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│ │ Data Layer │ │ Analysis Engine │ │ Presentation │ │
│ │ │ │ │ │ │ │
│ │ • HAQEI_DATA │ │ • TripleOS │ │ • Enhanced │ │
│ │ • Compatibility │ │ Engine │ │ Results View │ │
│ │ Matrix DB │ │ • Compatibility │ │ • Visualization │ │
│ │ • 64 卦 Details │ │ Calculator │ │ Components │ │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
データフロー設計
javascript// 1. 初期化フロー（修正版）
async function initializeApplication() {
// データ読み込みの確実な実行
await DataLoadingManager.ensureAllDataLoaded();

// 多次元評価データベースの初期化
await CompatibilityDatabase.initialize();

// アプリケーション初期化
const app = new HAQEIAnalyzer();
await app.initialize();
}

// 2. データ読み込み管理
class DataLoadingManager {
static async ensureAllDataLoaded() {
// データの可用性チェック
await this.waitForGlobalData('HAQEI_DATA', 5000);
await this.waitForGlobalData('H64_8D_VECTORS', 5000);

    // 新規：相性マトリックスデータ
    await this.loadCompatibilityMatrix();

}

static async loadCompatibilityMatrix() {
try {
const response = await fetch('/data/compatibility_matrix.json');
window.COMPATIBILITY_MATRIX = await response.json();
} catch (error) {
console.warn('Compatibility matrix not found, using default');
window.COMPATIBILITY_MATRIX = this.generateDefaultMatrix();
}
}
}
コンポーネント設計

1. DataManager 拡張
   javascriptclass EnhancedDataManager extends DataManager {
   constructor() {
   super();
   this.compatibilityData = null;
   this.hexagramDetails = new Map();
   }

async loadData() {
// 既存のデータ読み込み（修正版）
await this.loadBaseData();

    // 新規：拡張データの読み込み
    await this.loadCompatibilityData();
    await this.loadHexagramDetails();

    // データ整合性チェック
    this.validateDataIntegrity();

}

async loadBaseData() {
// データ可用性の確認
const maxRetries = 3;
let retries = 0;

    while (!window.HAQEI_DATA && retries < maxRetries) {
      console.log(`Waiting for HAQEI_DATA... (attempt ${retries + 1})`);
      await this.delay(1000);
      retries++;
    }

    if (!window.HAQEI_DATA) {
      throw new DataLoadingError('HAQEI_DATA not available after retries');
    }

    // データのマッピング
    this.data = {
      hexagrams: window.HAQEI_DATA.hexagrams_master || [],
      osManual: window.HAQEI_DATA.os_manual || {},
      trigramsMaster: window.HAQEI_DATA.trigrams_master || [],
      vectors: window.H64_8D_VECTORS || {},
      // 新規追加
      compatibilityMatrix: window.COMPATIBILITY_MATRIX || {},
    };

}

// 新規：多次元評価データの読み込み
async loadCompatibilityData() {
this.compatibilityData = new CompatibilityDatabase();
await this.compatibilityData.initialize();
}

// 修正：getDataStats メソッドの実装
getDataStats() {
return {
hexagramCount: Object.keys(this.data.hexagrams || {}).length,
vectorCount: Object.keys(this.data.vectors || {}).length,
compatibilityCount: this.compatibilityData?.getEntryCount() || 0,
loadedAt: new Date().toISOString(),
dataIntegrity: this.checkDataIntegrity()
};
}
} 2. 多次元相性評価エンジン
javascriptclass MultidimensionalCompatibilityEngine {
constructor(dataManager) {
this.dataManager = dataManager;
this.evaluationCache = new Map();
}

// 内なるチームの多次元評価
evaluateInternalTeam(engineOS, interfaceOS, safemodeOS) {
const cacheKey = `${engineOS.hexagramId}_${interfaceOS.hexagramId}_${safemodeOS.hexagramId}`;

    if (this.evaluationCache.has(cacheKey)) {
      return this.evaluationCache.get(cacheKey);
    }

    const evaluation = {
      // 5つの評価軸
      dimensions: {
        functionalEfficiency: this.evaluateFunctionalEfficiency(engineOS, interfaceOS),
        growthPotential: this.evaluateGrowthPotential(engineOS, interfaceOS, safemodeOS),
        stressResilience: this.evaluateStressResilience(engineOS, safemodeOS),
        creativity: this.evaluateCreativity(engineOS, interfaceOS),
        integrationChallenge: this.evaluateIntegrationChallenge(engineOS, interfaceOS, safemodeOS)
      },

      // 総合評価
      overallType: this.determineCompatibilityType(/* dimensions */),

      // 詳細分析
      analysis: {
        engineInterfaceRelation: this.analyzeEngineInterfaceRelation(engineOS, interfaceOS),
        engineSafemodeRelation: this.analyzeEngineSafemodeRelation(engineOS, safemodeOS),
        interfaceSafemodeRelation: this.analyzeInterfaceSafemodeRelation(interfaceOS, safemodeOS),
        tripleOSDynamics: this.analyzeTripleOSDynamics(engineOS, interfaceOS, safemodeOS)
      },

      // 実践的ガイダンス
      guidance: this.generatePracticalGuidance(/* evaluation results */)
    };

    this.evaluationCache.set(cacheKey, evaluation);
    return evaluation;

}

// エンジン-インターフェース関係の分析
analyzeEngineInterfaceRelation(engineOS, interfaceOS) {
const baseData = this.dataManager.getCompatibilityData(
engineOS.hexagramId,
interfaceOS.hexagramId
);

    return {
      relationType: this.determineRelationType(baseData),
      synergyScore: baseData.synergyScore,
      philosophy: baseData.philosophy,
      practicalEffect: baseData.practicalEffect,
      challenges: baseData.challenges,
      opportunities: baseData.opportunities
    };

}
} 3. 相性データベース構造
javascriptclass CompatibilityDatabase {
constructor() {
this.entries = new Map();
this.specialPatterns = new Map();
}

async initialize() {
// 基本相性データの読み込み
await this.loadBaseCompatibilityData();

    // 特殊パターンの定義
    this.defineSpecialPatterns();

}

async loadBaseCompatibilityData() {
// 64×64 の組み合わせデータ
for (let i = 1; i <= 64; i++) {
for (let j = 1; j <= 64; j++) {
const key = `${i}_${j}`;
this.entries.set(key, await this.generateCompatibilityEntry(i, j));
}
}
}

generateCompatibilityEntry(hexagram1Id, hexagram2Id) {
// 易経の理論に基づく相性計算
const trigrams1 = this.getTrigramsForHexagram(hexagram1Id);
const trigrams2 = this.getTrigramsForHexagram(hexagram2Id);

    return {
      functionalEfficiency: this.calculateFunctionalEfficiency(trigrams1, trigrams2),
      growthPotential: this.calculateGrowthPotential(trigrams1, trigrams2),
      stressResilience: this.calculateStressResilience(trigrams1, trigrams2),
      creativity: this.calculateCreativity(trigrams1, trigrams2),
      integrationChallenge: this.calculateIntegrationChallenge(trigrams1, trigrams2),

      // 質的分析
      philosophy: this.generatePhilosophy(hexagram1Id, hexagram2Id),
      practicalEffect: this.generatePracticalEffect(hexagram1Id, hexagram2Id),
      challenges: this.identifyChallenges(hexagram1Id, hexagram2Id),
      opportunities: this.identifyOpportunities(hexagram1Id, hexagram2Id)
    };

}
} 4. エラーハンドリング強化
javascriptclass DataLoadingError extends Error {
constructor(message, code, details) {
super(message);
this.name = 'DataLoadingError';
this.code = code;
this.details = details;
this.timestamp = new Date().toISOString();
}
}

class ErrorHandler {
static async handleDataLoadingError(error) {
console.error('Data loading error:', error);

    // ユーザーへの通知
    const userMessage = this.getUserFriendlyMessage(error);
    this.notifyUser(userMessage);

    // フォールバック処理
    if (error.code === 'HAQEI_DATA_MISSING') {
      return await this.loadFallbackData();
    }

    // エラーレポート
    this.reportError(error);

}

static async loadFallbackData() {
try {
// ローカルストレージから復元
const cachedData = localStorage.getItem('haqei_fallback_data');
if (cachedData) {
return JSON.parse(cachedData);
}

      // 最小限のデフォルトデータ
      return {
        hexagrams: this.generateMinimalHexagramData(),
        vectors: this.generateMinimalVectorData()
      };
    } catch (e) {
      console.error('Fallback data loading failed:', e);
      return null;
    }

}
}
データモデル
拡張されたデータ構造
javascript// グローバルデータ構造（改訂版）
window.HAQEI_DATA = {
// 既存データ
hexagrams_master: [],
os_manual: {},
trigrams_master: [],

// 新規追加
compatibility_matrix: {
version: "1.0",
entries: {}, // 64×64 のマトリックス
specialPatterns: {},
metadata: {}
}
};

// 多次元評価結果の構造
const InternalTeamEvaluation = {
timestamp: Date,
osConfiguration: {
engine: HexagramData,
interface: HexagramData,
safemode: HexagramData
},

multidimensionalScores: {
functionalEfficiency: Number, // 0-1
growthPotential: Number, // 0-1
stressResilience: Number, // 0-1
creativity: Number, // 0-1
integrationChallenge: Number // 0-1
},

compatibilityType: String, // SYNERGY | HARMONY | TENSION | CONFLICT | CHAOS

relationships: {
engineInterface: RelationshipAnalysis,
engineSafemode: RelationshipAnalysis,
interfaceSafemode: RelationshipAnalysis
},

guidance: {
strengths: String[],
challenges: String[],
recommendations: String[],
integrationPath: IntegrationPath
},

contextualAdjustments: {
lifeStage: Object,
currentChallenges: Object,
goals: Object
}
};
テスト戦略
単体テスト
javascriptdescribe('EnhancedDataManager', () => {
test('should load data with retry mechanism', async () => {
// データ可用性のシミュレーション
setTimeout(() => {
window.HAQEI_DATA = mockHaqeiData;
}, 2000);

    const manager = new EnhancedDataManager();
    await manager.loadData();

    expect(manager.getDataStats().hexagramCount).toBeGreaterThan(0);

});

test('should handle missing compatibility data gracefully', async () => {
const manager = new EnhancedDataManager();
await manager.loadData();

    const stats = manager.getDataStats();
    expect(stats.compatibilityCount).toBeDefined();

});
});
統合テスト
javascriptdescribe('Internal Team Analysis Integration', () => {
test('should perform complete analysis workflow', async () => {
const analyzer = new HAQEIAnalyzer();
await analyzer.initialize();

    const result = await analyzer.analyzeTripleOS(mockAnswers);
    const evaluation = result.internalTeamEvaluation;

    expect(evaluation.multidimensionalScores).toBeDefined();
    expect(evaluation.compatibilityType).toBeOneOf([
      'SYNERGY', 'HARMONY', 'TENSION', 'CONFLICT', 'CHAOS'
    ]);

});
});
実装フェーズ
Phase 1: データ読み込み問題の解決（即時対応）

DataManager.getDataStats()メソッドの実装
非同期データ読み込みの修正
リトライメカニズムの実装
基本的なエラーハンドリング

Phase 2: 多次元評価基盤の構築（1-2 週間）

CompatibilityDatabase の実装
MultidimensionalCompatibilityEngine の実装
64×64 相性マトリックスの初期データ作成
基本的な評価結果表示

Phase 3: 高度な可視化と動的評価（3-4 週間）

5 次元レーダーチャートの実装
エネルギーフロービジュアライゼーション
コンテキスト依存評価システム
統合ガイダンス生成の高度化

この設計により、当面のデータ読み込み問題を解決しつつ、「内なるチーム分析」という革新的な機能を段階的に実装していきます。
