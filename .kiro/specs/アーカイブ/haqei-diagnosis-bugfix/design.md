# Design Document

## Overview

HaQei 診断システムの 3 つの重要なバグを修正するための設計書です。現在のシステムでは、データ参照の不整合、オブジェクト表示エラー、統合洞察機能の不足により、ユーザーに対して不正確で理解しにくい診断結果が提供されています。

この設計では、データ参照ロジックの統一化、オブジェクト表示エラーの解消、統合洞察機能の実装を通じて、より正確で魅力的な診断結果を提供するシステムを構築します。

## Architecture

### 現在のアーキテクチャの問題点

1. **データ参照の分散**: 同一卦 ID に対して複数のデータソース（hexagrams、osManual）から個別に情報を取得
2. **型安全性の欠如**: オブジェクト型データの文字列変換処理が不適切
3. **洞察ロジックの不足**: OS 組み合わせの分析・統合機能が存在しない

### 改善後のアーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                    TestInputSystem                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│  │ Data Unification│  │ Type Safety     │  │ Insight Engine  ││
│  │ Layer           │  │ Layer           │  │                 ││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    DataManager                              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│  │ Unified Data    │  │ hexagrams       │  │ osManual        ││
│  │ Provider        │  │ Data            │  │ Data            ││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. DataManager 拡張

#### 新規メソッド: getUnifiedHexagramData()

```javascript
interface UnifiedHexagramData {
  id: number;
  name: string;
  catchphrase: string;
  description: string;
  strategy: string;
  keywords: string[];
  hexagramData: HexagramData;
  osManualData: OSManualData;
}

getUnifiedHexagramData(hexagramId: number): UnifiedHexagramData | null
```

**責任**:

- 複数のデータソースから統一されたデータオブジェクトを生成
- データの優先順位管理（hexagramData > osManualData）
- エラーハンドリングとログ出力

### 2. TestInputSystem 拡張

#### 新規メソッド: generateUnifiedOSDetail()

```javascript
generateUnifiedOSDetail(unifiedData: UnifiedHexagramData): string
```

**責任**:

- 統一されたデータから一貫した詳細テキストを生成
- フォーマット統一とエラーハンドリング

#### 新規メソッド: analyzeOSCombination()

```javascript
interface OSCombinationAnalysis {
  characteristics: {
    engine: OSCharacteristics;
    interface: OSCharacteristics;
    safe: OSCharacteristics;
  };
  hasContrast: boolean;
  dominantTheme: string;
  unifyingMessage: string;
}

analyzeOSCombination(
  engineData: UnifiedHexagramData,
  interfaceData: UnifiedHexagramData,
  safeData: UnifiedHexagramData
): OSCombinationAnalysis
```

**責任**:

- 3 つの OS の特性分析と分類
- 矛盾・対比の検出
- 統合メッセージの生成

#### 新規メソッド: categorizeOSType()

```javascript
interface OSCharacteristics {
  type: 'creative' | 'harmonious' | 'stable' | 'analytical' | 'balanced';
  energy: 'active' | 'social' | 'calm' | 'deep' | 'moderate';
  focus: 'innovation' | 'relationship' | 'security' | 'understanding' | 'general';
}

categorizeOSType(osData: UnifiedHexagramData): OSCharacteristics
```

**責任**:

- OS 名から特性の自動分類
- 拡張可能な分類ロジック

#### 修正メソッド: generateUserText()

**変更点**:

- `window.getOSDetailText()` → `this.generateUnifiedOSDetail()`
- 直接的なデータ参照 → 統一データ取得
- オブジェクト型安全処理の追加
- 統合洞察ロジックの組み込み

## Data Models

### UnifiedHexagramData

```javascript
{
  id: number,                    // 卦ID
  name: string,                  // 卦名（統一）
  catchphrase: string,           // キャッチコピー（統一）
  description: string,           // 説明（統一）
  strategy: string,              // 戦略的役割（統一）
  keywords: string[],            // キーワード配列（統一）
  hexagramData: object,          // 元のhexagramsデータ
  osManualData: object           // 元のosManualデータ
}
```

### OSCombinationAnalysis

```javascript
{
  characteristics: {
    engine: OSCharacteristics,
    interface: OSCharacteristics,
    safe: OSCharacteristics
  },
  hasContrast: boolean,          // 矛盾する特性の存在
  dominantTheme: string,         // 支配的テーマ
  unifyingMessage: string        // 統合メッセージ
}
```

### OSCharacteristics

```javascript
{
  type: string,                  // 基本タイプ
  energy: string,                // エネルギー特性
  focus: string                  // 焦点領域
}
```

## Error Handling

### 1. データ不整合エラー

**発生条件**: 卦 ID に対応するデータが存在しない
**処理方法**:

- エラーログ出力
- デフォルト値またはエラーメッセージ表示
- 処理継続（システム停止回避）

### 2. オブジェクト型エラー

**発生条件**: 期待される文字列がオブジェクト型
**処理方法**:

- 型チェック実装
- 適切な文字列変換（text/content/interpretation プロパティ優先）
- フォールバック処理（JSON.stringify）

### 3. 統合洞察生成エラー

**発生条件**: OS 分析・分類処理の失敗
**処理方法**:

- 基本的な洞察メッセージの提供
- エラー詳細のログ出力
- ユーザーへの分かりやすいメッセージ表示

## Testing Strategy

### 1. 単体テスト

#### DataManager.getUnifiedHexagramData()

- 正常系: 有効な卦 ID での統一データ取得
- 異常系: 存在しない卦 ID でのエラーハンドリング
- 境界値: データソース間の優先順位確認

#### TestInputSystem.analyzeOSCombination()

- 正常系: 各種 OS 組み合わせでの分析結果確認
- 異常系: 不正なデータでのエラーハンドリング
- 特殊ケース: 矛盾する組み合わせでの統合メッセージ生成

### 2. 統合テスト

#### データ整合性テスト

```javascript
// 同一卦IDから取得したデータの一貫性確認
const testId = 1;
const unifiedData = dataManager.getUnifiedHexagramData(testId);
assert(unifiedData.name === expectedName);
assert(unifiedData.catchphrase === expectedCatchphrase);
```

#### オブジェクト表示テスト

```javascript
// [object Object]エラーの解消確認
const taiShoDen = dataManager.getTaiShoDenData(1);
const displayText = generateSafeDisplayText(taiShoDen);
assert(!displayText.includes("[object Object]"));
```

#### 統合洞察テスト

```javascript
// 矛盾する組み合わせでの魅力的表現確認
const analysis = analyzeOSCombination(creativeOS, harmonicOS, stableOS);
assert(analysis.hasContrast === true);
assert(analysis.unifyingMessage.includes("多面的リーダーシップ"));
```

### 3. 回帰テスト

- 既存機能への影響確認
- パフォーマンス劣化の検証
- ユーザーインターフェースの動作確認

### 4. エンドツーエンドテスト

- 実際の診断フロー全体での動作確認
- 複数ユーザーでの一括処理テスト
- エラー発生時の復旧処理テスト

## Implementation Considerations

### 1. 後方互換性

- 既存の API インターフェースを維持
- 段階的な移行による影響最小化
- 旧機能の並行稼働期間設定

### 2. パフォーマンス

- データキャッシュ機能の活用
- 不要な処理の削減
- 非同期処理の適切な実装

### 3. 拡張性

- 新しい OS 分類の追加容易性
- 洞察ロジックのカスタマイズ性
- 多言語対応の考慮

### 4. 保守性

- コードの可読性向上
- 適切なコメント・ドキュメント
- テストカバレッジの確保
