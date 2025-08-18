# Phase 2 緊急アクションプラン - 5MB目標達成

## 🎯 目標

**現在**: 30MB  
**目標**: 5MB  
**必要削減**: 25MB（83%削減）

---

## 📊 現状分析

```
public/ (30MB)
├── dict/    17MB (56.7%) ← 最大の課題
├── js/      11MB (36.7%) ← 第2の課題  
├── data/    912KB (3.0%)
├── css/     200KB (0.7%)
└── その他   880KB (2.9%)
```

---

## 🚀 実行計画

### STEP 1: 辞書ファイル最適化（17MB → 1MB）

#### 即時実行
1. **必須辞書のみ残す**
   - kuromoji基本辞書のみ保持（~1MB）
   - その他は動的ロード化

2. **削除対象**
   ```
   /public/dict/
   ├── base.dat.gz (削除)
   ├── cc.dat.gz (削除)
   ├── check.dat.gz (削除)
   ├── tid.dat.gz (削除)
   ├── tid_map.dat.gz (削除)
   ├── tid_pos.dat.gz (削除)
   ├── unk.dat.gz (削除)
   ├── unk_char.dat.gz (削除)
   ├── unk_compat.dat.gz (削除)
   ├── unk_invoke.dat.gz (削除)
   └── unk_map.dat.gz (削除)
   ```

3. **オンデマンドローディング実装**
   ```javascript
   // 必要時のみロード
   async function loadDictionary(type) {
     if (!needed) return cached;
     const dict = await fetch(`/api/dict/${type}`);
     return dict;
   }
   ```

### STEP 2: JavaScriptコード分割（11MB → 3MB）

#### 即時実行
1. **Core Bundle（~1MB）**
   - app.js
   - 初期表示に必須のみ

2. **Lazy Bundles（動的ロード）**
   - 分析エンジン → 使用時ロード
   - 結果表示 → 必要時ロード
   - ヘルプシステム → 要求時ロード

3. **削除候補**
   ```
   /public/js/
   ├── /lib/ の未使用ライブラリ
   ├── /shared/ の重複ユーティリティ
   └── /os-analyzer/ の非必須コンポーネント
   ```

### STEP 3: 動的インポート実装

```javascript
// Before - 全て初期ロード
import { VirtualQuestionFlow } from './VirtualQuestionFlow.js';
import { AnalysisEngine } from './AnalysisEngine.js';

// After - 必要時のみロード
const loadQuestionFlow = () => import('./VirtualQuestionFlow.js');
const loadAnalysis = () => import('./AnalysisEngine.js');
```

---

## ⚡ 即時実行コマンド

```bash
# 1. 辞書ファイル削減
find public/dict -name "*.dat.gz" -size +1M -delete

# 2. 未使用JSライブラリ削除
rm -rf public/js/lib/unused-*.js

# 3. サイズ確認
du -sh public/
```

---

## 📈 期待効果

| 項目 | 現在 | 目標 | 削減量 |
|------|------|------|--------|
| 辞書 | 17MB | 1MB | -16MB |
| JS | 11MB | 3MB | -8MB |
| その他 | 2MB | 1MB | -1MB |
| **合計** | **30MB** | **5MB** | **-25MB** |

---

## ⏱️ タイムライン

- **10分**: 辞書ファイル削減
- **20分**: JSコード分割準備
- **20分**: 動的インポート実装
- **10分**: 検証とテスト

**総所要時間**: 約1時間

---

## ✅ 成功基準

- [ ] publicディレクトリ 5MB以下
- [ ] 初期ロード 3秒以内
- [ ] 全機能動作確認
- [ ] エラーゼロ

---

**開始時刻**: 即時  
**完了予定**: 1時間以内