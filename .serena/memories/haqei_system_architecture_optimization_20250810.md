# HAQEIシステム最適アーキテクチャ設計書
日付: 2025/08/10
作成者: System Architecture Designer

## 現状分析結果

### 核心ロジック実装状況
- **H384DatabaseConnector**: ✅ 完全実装済み（386エントリ対応）
- **Authentic8ScenariosSystem**: ✅ HaQei哲学×8方向生成システム実装済み  
- **OS Analyzer**: ✅ Triple OS生成システム（8次元→三爻→六十四卦判定）実装済み

### 契約駆動開発の現状
- **契約A（Triple OS）**: ✅ types.js で検証スキーマ実装済み
- **契約B（Future Paths）**: ✅ types.js で検証スキーマ実装済み
- **契約保存機能**: ❌ 未実装（**P0重要問題**）

### generate8Scenarios呼び出し関係図
```
IChingGuidanceEngine.js:964 (メイン呼び出し)
    ↓
IChingChoiceLogic.js:425 (実装)
    ↓ 
Authentic8ScenariosSystem.js:228 (HaQei版実装)
```

## 最適アーキテクチャ設計

### 1. 読み込み順序の最適化

```javascript
// Phase 1: 核心インフラ（同期読み込み・必須）
1. types.js                    // 契約検証（Single Source of Truth）
2. storage.js                  // localStorage統一
3. DataPersistenceManager.js   // 永続化管理

// Phase 2: データレイヤー（並行読み込み可能）
4. H384DatabaseConnector.js   // 386エントリDB接続
5. assets/H384H64database.js   // データベース本体
6. assets/H64_profile_vectors.js // ベクターデータ

// Phase 3: コアロジック（依存関係順・重要）
7. IChingChoiceLogic.js        // 基本ロジック
8. IChingGuidanceEngine.js     // 統合エンジン（generate8Scenarios呼び出し元）
9. Authentic8ScenariosSystem.js // HaQei実装（generate8Scenarios実装）

// Phase 4: UI/UX（遅延読み込み・パフォーマンス重視）
10. 各種表示コンポーネント
```

### 2. 契約保存機能実装（最優先P0）

**実装位置**: `DataPersistenceManager.js` 内に契約専用メソッド追加

```javascript
class DataPersistenceManager {
  /**
   * 契約保存（Triple OS / Future Paths）
   * @param {string} contractType - 'tripleOS' | 'futurePaths'
   * @param {Object} data - 契約データ
   * @returns {Promise<Object>} 保存された契約データ
   */
  async saveContract(contractType, data) {
    // 1. 契約検証（types.jsのvalidation使用）
    const validation = contractType === 'tripleOS' 
      ? validateTripleOS(data)
      : validateFuturePaths(data);
    
    if (!validation.valid) {
      throw new Error(`Contract ${contractType} validation failed: ${validation.errors.join(', ')}`);
    }
    
    // 2. メタデータ付与
    const contractData = {
      ...data,
      contractType,
      version: '1.0.0',
      savedAt: new Date().toISOString(),
      sessionId: this.generateSessionId(),
      checksum: this.calculateChecksum(data)
    };
    
    // 3. 冗長保存（データ保護）
    const key = `haqei.contract.${contractType}`;
    localStorage.setItem(key, JSON.stringify(contractData));
    await this.saveToIndexedDB('contracts', contractData);
    
    // 4. 保存確認イベント発火
    window.dispatchEvent(new CustomEvent('haqei:contractSaved', {
      detail: { contractType, data: contractData }
    }));
    
    console.log(`✅ Contract ${contractType} saved successfully`);
    return contractData;
  }
  
  /**
   * 契約読み込み
   */
  async loadContract(contractType) {
    const key = `haqei.contract.${contractType}`;
    const stored = localStorage.getItem(key);
    
    if (!stored) {
      return null;
    }
    
    try {
      const data = JSON.parse(stored);
      
      // 整合性チェック
      const validation = contractType === 'tripleOS' 
        ? validateTripleOS(data)
        : validateFuturePaths(data);
      
      if (!validation.valid) {
        console.warn(`Contract ${contractType} integrity check failed:`, validation.errors);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error(`Failed to load contract ${contractType}:`, error);
      return null;
    }
  }
}
```

### 3. イベントハンドラー配置戦略

**集約型イベントバスアーキテクチャ**

```javascript
// 新規作成: js/core/HAQEIEventBus.js
window.HAQEIEventBus = {
  listeners: new Map(),
  
  // イベント登録
  on(event, handler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(handler);
  },
  
  // イベント発火
  emit(event, data) {
    const handlers = this.listeners.get(event) || [];
    handlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Event handler error for ${event}:`, error);
      }
    });
  },
  
  // 契約保存の統一インターフェース
  async saveContract(type, data) {
    try {
      const dataPersistence = window.dataPersistenceManager;
      const savedData = await dataPersistence.saveContract(type, data);
      
      this.emit('contractSaved', { type, data: savedData });
      this.emit(`contract${type}Saved`, savedData);
      
      return savedData;
    } catch (error) {
      console.error('Contract save failed:', error);
      this.emit('contractSaveError', { type, error });
      throw error;
    }
  }
};
```

## 実装優先順序（Phase別）

### Phase 1: 契約保存機能実装（P0・最優先）
**期間**: 1-2日
**目標**: データ損失防止

1. **DataPersistenceManager.js 拡張**
   - saveContract/loadContract メソッド追加
   - バリデーション統合
   - エラーハンドリング強化

2. **os_analyzer.html 保存トリガー**
   - Triple OS分析完了時の自動保存
   - ユーザー手動保存ボタン追加
   - 保存状態表示

3. **future_simulator.html 保存トリガー**
   - 8シナリオ生成完了時の自動保存
   - セッション復旧機能
   - 契約データ表示

### Phase 2: 読み込み順序最適化（P1）
**期間**: 2-3日
**目標**: 安定性向上

1. **HTML読み込み順序統一**
   ```html
   <!-- 1. 核心インフラ -->
   <script src="js/core/types.js"></script>
   <script src="js/core/storage.js"></script>
   <script src="js/core/DataPersistenceManager.js"></script>
   
   <!-- 2. データレイヤー -->
   <script src="js/core/H384DatabaseConnector.js"></script>
   <script src="assets/H384H64database.js"></script>
   
   <!-- 3. コアロジック -->
   <script src="js/core/IChingChoiceLogic.js"></script>
   <script src="js/core/IChingGuidanceEngine.js"></script>
   <script src="js/components/Authentic8ScenariosSystem.js"></script>
   ```

2. **依存関係明示**
   - 各ファイルに依存関係コメント追加
   - 読み込み完了確認機能
   - フォールバック処理実装

### Phase 3: イベントバス統合（P2）
**期間**: 3-4日
**目標**: データ連携強化

1. **HAQEIEventBus実装**
2. **ページ間データ連携**
3. **リアルタイム状態同期**

### Phase 4: パフォーマンス最適化（P3）
**期間**: 継続的改善
**目標**: UX向上

1. **遅延読み込み実装**
2. **バンドルサイズ最適化** 
3. **キャッシュ戦略強化**

## 重要な設計判断（ADR）

### ADR-001: Single Source of Truth
**決定**: `types.js` を契約定義の唯一の真実源とする
**理由**: データ整合性保証、保守性向上
**影響**: 全ページで同一の検証ロジック使用必須

### ADR-002: 段階的読み込み戦略
**決定**: 核心インフラ → データレイヤー → コアロジック → UI の順序
**理由**: 依存関係エラー防止、デバッグ容易性
**影響**: 初期読み込み時間がやや増加するが安定性大幅向上

### ADR-003: 契約保存の冗長化
**決定**: localStorage + IndexedDB の二重保存
**理由**: データ損失防止、パフォーマンス・永続性両立
**影響**: ストレージ使用量増加、整合性管理複雑化

## 品質メトリクス目標

- **データ整合性**: 99.9%（契約バリデーション通過率）
- **読み込み成功率**: 99.5%（依存関係エラー撲滅）
- **パフォーマンス**: 初期読み込み3秒以内（95%ile）
- **契約保存成功率**: 99.8%（データ損失防止）

## 次のアクション

1. **即座実行**: Phase 1契約保存機能実装開始
2. **今週完了**: 契約保存トリガー各ページ実装
3. **来週開始**: 読み込み順序最適化
4. **継続監視**: 品質メトリクス測定・改善

---

この設計に基づき、HAQEIシステムは契約駆動開発の完全実現とアーキテクチャの最適化を達成できる。