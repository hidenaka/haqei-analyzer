# エージェント向けドキュメント作成・保存指示書

**作成日**: 2025年7月30日  
**対象**: 全HAQEIプロジェクトエージェント・AI開発者

## 📁 必須ドキュメント保存ルール

### 保存先ディレクトリの決定フロー

```javascript
function determineDocumentPath(documentType, content) {
    const baseDir = '/Users/hideakimacbookair/Desktop/haqei-analyzer/docs/';
    
    // 1. レポート系 → /reports/
    if (documentType.includes('report') || 
        documentType.includes('feedback') ||
        documentType.includes('analysis_summary') ||
        documentType.includes('integration_report')) {
        return baseDir + 'reports/';
    }
    
    // 2. 実装記録系 → /implementation/
    if (documentType.includes('implementation') ||
        documentType.includes('code_change') ||
        documentType.includes('technical_record') ||
        documentType.includes('phase_record')) {
        return baseDir + 'implementation/';
    }
    
    // 3. 要件・仕様系 → /requirements/
    if (documentType.includes('requirements') ||
        documentType.includes('specification') ||
        documentType.includes('feature_request') ||
        documentType.includes('error_requirements')) {
        return baseDir + 'requirements/';
    }
    
    // 4. 開発プロセス系 → /development/
    if (documentType.includes('development') ||
        documentType.includes('workflow') ||
        documentType.includes('ai_rules') ||
        documentType.includes('guidelines')) {
        return baseDir + 'development/';
    }
    
    // 5. ガイド系 → /guides/
    if (documentType.includes('guide') ||
        documentType.includes('tutorial') ||
        documentType.includes('manual') ||
        documentType.includes('usage')) {
        return baseDir + 'guides/';
    }
    
    // 6. 分析系 → /analysis/
    if (documentType.includes('analysis') ||
        documentType.includes('performance') ||
        documentType.includes('optimization') ||
        documentType.includes('research')) {
        return baseDir + 'analysis/';
    }
    
    // デフォルト: reports
    return baseDir + 'reports/';
}
```

### ファイル命名規則（必須）

```
YYYY-MM-DD_[カテゴリ]_[内容名]_[バージョン].md
```

#### カテゴリ別接頭辞
- **REPORT**: レポート類
- **IMPL**: 実装記録
- **REQ**: 要件書
- **GUIDE**: ガイド類
- **ANALYSIS**: 分析類
- **DEV**: 開発プロセス
- **ARCHIVE**: アーカイブ

#### 命名例
```
2025-07-30_REPORT_フィードバックシステム統合評価_v1.0.md
2025-07-30_IMPL_3人格エージェント実装記録_v2.1.md
2025-07-30_REQ_UX改善要件定義_v1.0.md
2025-07-30_GUIDE_システム操作マニュアル_v1.0.md
2025-07-30_ANALYSIS_パフォーマンス最適化調査_v1.0.md
```

## 🤖 エージェント別指示

### feedback-personas.js エージェント
```javascript
// フィードバックレポート生成時
const reportPath = '/Users/hideakimacbookair/Desktop/haqei-analyzer/docs/reports/';
const fileName = `${new Date().toISOString().split('T')[0]}_REPORT_フィードバック評価結果_v1.0.md`;
```

### cto-consolidation-agent.js エージェント
```javascript
// CTO統合レポート生成時
const reportPath = '/Users/hideakimacbookair/Desktop/haqei-analyzer/docs/reports/';
const fileName = `${new Date().toISOString().split('T')[0]}_REPORT_CTO統合分析_v1.0.md`;
```

### bunenjin-strategy-navigator エージェント
```javascript
// 戦略分析レポート生成時
const analysisPath = '/Users/hideakimacbookair/Desktop/haqei-analyzer/docs/analysis/';
const fileName = `${new Date().toISOString().split('T')[0]}_ANALYSIS_戦略ナビゲーション分析_v1.0.md`;
```

### haqei-programmer エージェント
```javascript
// 実装記録作成時
const implPath = '/Users/hideakimacbookair/Desktop/haqei-analyzer/docs/implementation/';
const fileName = `${new Date().toISOString().split('T')[0]}_IMPL_機能実装記録_v1.0.md`;
```

### haqei-requirements-analyst エージェント
```javascript
// 要件書作成時
const reqPath = '/Users/hideakimacbookair/Desktop/haqei-analyzer/docs/requirements/';
const fileName = `${new Date().toISOString().split('T')[0]}_REQ_機能要件定義_v1.0.md`;
```

## ⚠️ 禁止事項

### 絶対に避けるべき保存場所
```javascript
// ❌ これらの場所には保存しない
'/Users/hideakimacbookair/Desktop/haqei-analyzer/'  // ルートディレクトリ
'/Users/hideakimacbookair/Desktop/haqei-analyzer/docs/'  // docsルート
'/Users/hideakimacbookair/Desktop/haqei-analyzer/docs/code-explanations/'  // 廃止予定
```

### 避けるべきファイル名パターン
```javascript
// ❌ 悪い例
'feedback-report.md'  // 日付なし
'implementation_notes.md'  // カテゴリなし
'temp_analysis.md'  // 一時ファイル名
'memo.md'  // 不明確な名前
```

## ✅ 実装チェックリスト

### ドキュメント作成時の必須確認項目
- [ ] 適切なディレクトリに保存されているか
- [ ] ファイル名が命名規則に従っているか
- [ ] 日付が正確に設定されているか
- [ ] カテゴリが内容に適しているか
- [ ] バージョン番号が適切か
- [ ] 重複ファイルが発生していないか

### コード実装例

```javascript
// エージェント内でのドキュメント保存処理
function saveDocument(content, documentType, title) {
    const today = new Date().toISOString().split('T')[0];
    const category = getCategoryPrefix(documentType);
    const directory = determineDocumentPath(documentType, content);
    const fileName = `${today}_${category}_${title}_v1.0.md`;
    const fullPath = directory + fileName;
    
    // 重複チェック
    if (fs.existsSync(fullPath)) {
        const version = getNextVersion(directory, fileName);
        fileName = fileName.replace('v1.0', `v${version}`);
    }
    
    // ファイル作成
    fs.writeFileSync(directory + fileName, content);
    console.log(`📄 ドキュメント保存: ${directory + fileName}`);
}

function getCategoryPrefix(documentType) {
    const categoryMap = {
        'report': 'REPORT',
        'implementation': 'IMPL',
        'requirements': 'REQ',
        'guide': 'GUIDE',
        'analysis': 'ANALYSIS',
        'development': 'DEV'
    };
    return categoryMap[documentType] || 'REPORT';
}
```

## 🔄 月次整理ルール

### 自動アーカイブ処理
```javascript
// 月末に実行される自動整理
function monthlyArchiveProcess() {
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    const archiveDir = `/Users/hideakimacbookair/Desktop/haqei-analyzer/docs/archive/${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}/`;
    
    // 古いバージョンをアーカイブに移動
    moveOldVersionsToArchive(archiveDir);
    
    // 重複ファイルの統合
    consolidateDuplicateFiles();
    
    // 不要ファイルの削除
    cleanupUnnecessaryFiles();
}
```

## 🎯 エージェント向け簡易チェック

### 保存前の3ステップ確認
1. **どこに？** → ディレクトリ決定フロー実行
2. **どんな名前で？** → 命名規則適用
3. **重複は？** → 既存ファイル確認

### エラー回避のためのバリデーション
```javascript
function validateDocumentSave(path, fileName, content) {
    const errors = [];
    
    // パスチェック
    if (!path.includes('/docs/')) {
        errors.push('docsディレクトリ外への保存は禁止');
    }
    
    // ファイル名チェック
    if (!/^\d{4}-\d{2}-\d{2}_[A-Z]+_.+_v\d+\.\d+\.md$/.test(fileName)) {
        errors.push('ファイル名が命名規則に違反');
    }
    
    // 内容チェック
    if (content.length < 100) {
        errors.push('内容が薄すぎる可能性');
    }
    
    return errors;
}
```

---

**重要**: この指示書は全HAQEIプロジェクトエージェントが遵守すべき必須ルールです。  
**違反時**: 保存処理を停止し、適切な場所への再保存を要求してください。

*最終更新: 2025年7月30日*  
*管理者: HAQEI開発チーム*