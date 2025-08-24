# 改善診断ロジック v2 統合ガイド

## 📋 概要
Codex専門家フィードバックに基づく改善診断ロジック v2を本番環境に統合するためのガイド

## 🎯 主要改善点

### 1. 線形写像(H8_norm)による純卦確率計算
```javascript
// 旧: 単純なHerfindahl値使用
let alpha = alphaMin + (alphaMax - alphaMin) * herfindahl;

// 新: 正規化された線形写像
const Hmin = 1/8;  // 理論最小値
const Hmax = 1;    // 理論最大値
const H8_norm = (herfindahl - Hmin) / (Hmax - Hmin);
let alpha = alphaMin + (alphaMax - alphaMin) * k * H8_norm;
```

### 2. 乱数シード対応（再現性）
```javascript
// コンストラクタでRNGをDI可能に
constructor(options = {}) {
    this.rng = options.rng || (() => Math.random());
    // ...
}
```

### 3. 強化されたログ出力
```javascript
logData: {
    alpha,
    herfindahl,
    herfindahlNorm: H8_norm,
    entropy,
    tau: params.tau,
    k: params.k,
    method: isPureHexagram ? 'pure' : 'pair',
    configVersion: '2.0.0'
}
```

## 📦 統合手順

### Step 1: バックアップ
```bash
# 現在の実装をバックアップ
cp public/js/core/TripleOSInteractionAnalyzer.js \
   public/js/core/TripleOSInteractionAnalyzer_backup_$(date +%Y%m%d).js
```

### Step 2: 診断エンジンクラスの追加
`improved-diagnostic-logic-v2.js`から以下のクラスをコピー：
- `SeededRandom` クラス
- `ImprovedDiagnosticEngineV2` クラス

### Step 3: TripleOSInteractionAnalyzerへの統合

#### 3.1 コンストラクタの更新
```javascript
constructor(options = {}) {
    // 既存のコード...
    
    // v2診断エンジンの初期化
    this.diagnosticEngine = new ImprovedDiagnosticEngineV2(options);
}
```

#### 3.2 診断メソッドの更新
```javascript
performDiagnosis(keywordVector, osType) {
    return this.diagnosticEngine.performDiagnosis(keywordVector, osType);
}
```

### Step 4: os_analyzer.htmlでの使用

```javascript
// 既存のアナライザー初期化
const analyzer = new TripleOSInteractionAnalyzer({
    rng: options.useSeededRandom ? 
         (() => seededRandom.next()) : 
         undefined,
    debug: true
});
```

## ✅ テストチェックリスト

### 1. 単体テスト
- [ ] 再現性テスト（同じシードで同じ結果）
- [ ] 期待値検証（α ≈ 実測純卦率）
- [ ] パラメータ感度分析
- [ ] エッジケーステスト

### 2. 統合テスト
- [ ] 既存のUI動作確認
- [ ] localStorage連携確認
- [ ] エラーハンドリング確認
- [ ] パフォーマンス計測

### 3. 回帰テスト
- [ ] 30問質問フロー完走
- [ ] 各OS診断結果の妥当性
- [ ] 純卦率12-18%の確認
- [ ] ユーザー体験の検証

## 📊 期待される改善効果

### 純卦率の適正化
- 目標: 12-18%（集中度に応じて変動）
- 旧: ReLU下限値により不自然に高い（20-25%）
- 新: Softmax一本化で自然な分布

### 説明可能性の向上
- 気の集中度（Herfindahl指数）と純卦率が連動
- 「純卦＝気が澄み切った状態」という易経思想を反映
- ログデータによる診断プロセスの可視化

### 再現性の確保
- シード付き乱数による決定論的動作
- 回帰テスト・CI/CDでの安定性
- デバッグ・問題解析の容易化

## 🚨 注意事項

### 互換性
- v2は後方互換性を維持
- 既存のAPIインターフェースは変更なし
- localStorage形式も維持

### パフォーマンス
- メモ化キャッシュは既存実装を流用
- バッチ処理での検証は非同期化済み
- 本番環境では `debug: false` 推奨

### デプロイ
1. ステージング環境でのフルテスト
2. A/Bテストによる段階的ロールアウト
3. メトリクス監視（純卦率、応答時間）
4. ユーザーフィードバック収集

## 📝 設定パラメータ

### OS別推奨値
```javascript
// Engine OS（本来性重視）
TEMPERATURE.engine = 1.2
PURE_CONTROL.engine = { 
    k: 1.2,        // 集中時に純卦率UP
    alphaMin: 0.10,
    alphaMax: 0.25 
}

// Interface OS（バランス重視）
TEMPERATURE.interface = 1.5
PURE_CONTROL.interface = { 
    k: 1.0,        // 標準的な変動
    alphaMin: 0.08,
    alphaMax: 0.20 
}

// Safe Mode OS（安定性重視）
TEMPERATURE.safemode = 1.8
PURE_CONTROL.safemode = { 
    k: 0.8,        // 抑制的な変動
    alphaMin: 0.06,
    alphaMax: 0.15 
}
```

## 🔄 ロールバック手順

問題が発生した場合：
```bash
# バックアップから復元
cp public/js/core/TripleOSInteractionAnalyzer_backup_YYYYMMDD.js \
   public/js/core/TripleOSInteractionAnalyzer.js

# ブラウザキャッシュクリア
# localStorage保持（データは互換性あり）
```

## 📚 参考資料

- `improved-diagnostic-logic-v2.js` - v2実装コード
- `test-improved-logic-v2.html` - 検証環境
- `.serena/memories/improved_logic_implementation_20250811.md` - 実装記録
- `expert-consultation-diagnostic-logic-report.md` - 専門家フィードバック

---

最終更新: 2025-01-11
バージョン: 2.0.0