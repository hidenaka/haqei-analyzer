# Claude Code セキュアbash設定 - 詳細要件定義書

**文書種別**: REQ（要件定義書）  
**作成日**: 2025年8月3日  
**対象プロジェクト**: HAQEI Analyzer  
**要件責任者**: Requirements Analyst Agent  
**技術承認**: CTO Agent  

---

## 📋 エグゼクティブサマリー

### 目的
Claude Codeにおけるセキュアbash設定システムを実装し、HAQEIプロジェクトの機密データ保護と開発効率性を両立する包括的なセキュリティフレームワークを構築する。

### 主要成果物
1. **~/.claude/settings.json** - セキュリティ設定ファイル
2. **deny-check.sh** - 事前実行セキュリティチェックスクリプト
3. **HAQEI固有保護ルール** - Triple OS・易経データ専用セキュリティポリシー
4. **統合ワークフロー** - Cipher/Serena/Tsumikiとの連携仕様

### 期待効果
- **セキュリティ**: 機密データ漏洩リスク 90%削減
- **開発効率**: セキュリティチェック自動化により開発速度 20%向上
- **保守性**: 統一設定による管理コスト 60%削減

---

## 🛡️ 1. セキュリティ設定ファイル仕様（~/.claude/settings.json）

### 1.1 基本構造定義

```json
{
  "version": "1.0.0",
  "project": "haqei-analyzer",
  "philosophy": "HaQei",
  "permissions": {
    "deny": [
      // 拒否コマンドパターン配列
    ],
    "allow_with_confirmation": [
      // 確認付き許可コマンドパターン配列
    ],
    "critical_paths": [
      // 重要パス保護配列
    ]
  },
  "hooks": {
    "PreToolUse": [
      {
        "script": "~/.claude/scripts/deny-check.sh",
        "timeout": 5000,
        "required": true
      }
    ]
  },
  "haqei_specific": {
    // HAQEI固有設定
  },
  "logging": {
    // ログ設定
  }
}
```

### 1.2 基本拒否パターン（permissions.deny）

#### 1.2.1 システム破壊的コマンド
```json
[
  "Bash(rm -rf /*)",
  "Bash(sudo rm *)",
  "Bash(chmod 777 *)",
  "Bash(chown * *)",
  "Bash(mkfs.*)",
  "Bash(dd if=* of=*)",
  "Bash(> /dev/sd*)",
  "Bash(fdisk *)"
]
```

#### 1.2.2 Git設定変更禁止
```json
[
  "Bash(git config --global *)",
  "Bash(git config user.*)",
  "Bash(git config --system *)",
  "Bash(git remote set-url *)",
  "Bash(git push --force *)",
  "Bash(git push -f *)"
]
```

#### 1.2.3 ネットワークセキュリティ
```json
[
  "Bash(curl * | bash)",
  "Bash(wget * | sh)",
  "Bash(ssh-keygen -f * -N '')",
  "Bash(netcat -l *)",
  "Bash(nc -l *)",
  "Bash(python -m http.server *)",
  "Bash(python3 -m http.server *)"
]
```

### 1.3 確認付き許可パターン（permissions.allow_with_confirmation）

```json
[
  "Bash(npm install *)",
  "Bash(npm update *)",
  "Bash(git push origin *)",
  "Bash(git merge *)",
  "Bash(docker run *)",
  "Bash(docker build *)"
]
```

### 1.4 重要パス保護（permissions.critical_paths）

```json
[
  "/Users/hideakimacbookair/Desktop/haqei-analyzer/data/",
  "/Users/hideakimacbookair/Desktop/haqei-analyzer/public/assets/",
  "/Users/hideakimacbookair/Desktop/haqei-analyzer/cipher.config.yaml",
  "/Users/hideakimacbookair/Desktop/haqei-analyzer/haqei-serena-integration.yaml",
  "/Users/hideakimacbookair/Desktop/haqei-analyzer/.env*",
  "~/.claude/",
  "~/.ssh/",
  "~/.gitconfig"
]
```

### 1.5 HAQEI固有設定（haqei_specific）

```json
{
  "triple_os_protection": {
    "engine_os_data": "protected",
    "interface_os_data": "protected", 
    "safemode_os_data": "protected"
  },
  "iching_data_protection": {
    "hexagram_database": "read_only",
    "bagua_relationships": "read_only",
    "yao_mappings": "read_only"
  },
  "HaQei_philosophy": {
    "user_sovereignty": "enforced",
    "local_first": "enforced",
    "privacy_first": "enforced"
  },
  "cipher_integration": {
    "memory_path": "/Users/hideakimacbookair/Desktop/haqei-analyzer/data/cipher-memory",
    "access_level": "protected"
  },
  "development_tools": {
    "allowed_servers": ["localhost:3001", "localhost:8080", "localhost:5173"],
    "port_range": "3000-9000",
    "external_access": "denied"
  }
}
```

### 1.6 ログ設定（logging）

```json
{
  "enabled": true,
  "level": "info",
  "file": "~/.claude/logs/security.log",
  "rotation": {
    "max_size": "10MB",
    "max_files": 5
  },
  "events": {
    "command_denied": true,
    "confirmation_requested": true,
    "path_violation": true,
    "haqei_protection_triggered": true
  }
}
```

---

## 🔍 2. deny-check.sh スクリプト仕様

### 2.1 スクリプト構造

```bash
#!/bin/bash

# deny-check.sh - Claude Code セキュリティチェックスクリプト
# HAQEI Analyzer プロジェクト専用版
# Version: 1.0.0
# Created: 2025-08-03

# 設定読み込み
CONFIG_FILE="$HOME/.claude/settings.json"
LOG_FILE="$HOME/.claude/logs/security.log"

# メイン関数
main() {
    # 引数検証
    # コマンドパターンマッチング
    # HAQEI固有チェック
    # ログ出力
    # 結果返却
}

# 基本拒否パターンチェック
check_basic_deny_patterns() {
    # システム破壊的コマンド検出
    # Git設定変更検出
    # ネットワークセキュリティ違反検出
}

# HAQEI固有保護チェック
check_haqei_protection() {
    # Triple OSデータ保護
    # 易経データ保護
    # Cipher記憶保護
    # HaQei哲学原則遵守確認
}

# パス保護チェック
check_path_protection() {
    # 重要パスアクセス制御
    # 読み取り専用制約
    # 書き込み制限確認
}

# ログ出力
log_security_event() {
    # タイムスタンプ付きログ
    # イベント分類
    # 詳細情報記録
}
```

### 2.2 機能要件詳細

#### 2.2.1 コマンド解析機能
- **入力**: bashコマンド文字列
- **処理**: 
  1. コマンド構造解析（`;`、`&&`、`||`分離）
  2. パイプライン分解
  3. 引数・オプション抽出
  4. パス展開・変数展開
- **出力**: 構造化コマンド情報

#### 2.2.2 パターンマッチング機能
- **glob形式パターン**: `*`、`?`、`[...]`対応
- **正規表現パターン**: 高度なマッチング
- **部分マッチング**: コマンド要素単位での検証
- **除外ルール**: ホワイトリスト優先処理

#### 2.2.3 HAQEI固有チェック機能
- **データ分類**: Triple OS・易経・Cipher・設定ファイル
- **アクセス制御**: 読み取り専用・保護・禁止
- **HaQei原則**: ユーザー主権・ローカルファースト・プライバシーファースト
- **開発ツール**: 許可ポート・サーバー・外部アクセス制御

#### 2.2.4 ログ・レポート機能
- **リアルタイムログ**: JSON形式構造化ログ
- **イベント分類**: DENY/ALLOW/CONFIRM/WARNING
- **詳細情報**: コマンド・理由・タイムスタンプ・コンテキスト
- **統計情報**: 日次・週次・月次集計

### 2.3 エラーハンドリング仕様

#### 2.3.1 設定ファイルエラー
- **ファイル不存在**: デフォルト設定で継続、警告ログ
- **JSON解析エラー**: 安全モード（全拒否）に移行
- **設定不整合**: 厳格な設定を優先適用

#### 2.3.2 システムエラー
- **権限不足**: 可能な範囲でチェック継続
- **ディスク容量不足**: ログ出力停止、処理継続
- **ネットワークエラー**: ローカル処理のみ継続

#### 2.3.3 パフォーマンス制約
- **タイムアウト**: 5秒以内で処理完了
- **メモリ制限**: 最大10MB使用
- **CPU制限**: 1コア使用率50%以内

---

## 🏗️ 3. HAQEI固有保護要件

### 3.1 Triple OS データ保護

#### 3.1.1 Engine OS（価値観システム）保護
```bash
# 保護対象ファイル
protected_engine_files=(
    "public/assets/H384H64database.js"
    "public/js/data/hexagram_details.js"
    "public/js/os-analyzer/core/Engine.js"
    "public/js/os-analyzer/core/TripleOSEngine.js"
)

# 保護ルール
- 読み取り: 許可
- 書き込み: 事前確認必須
- 削除: 拒否
- 外部送信: 拒否
```

#### 3.1.2 Interface OS（社会的システム）保護
```bash
# 保護対象ファイル
protected_interface_files=(
    "public/js/data/compatibility_matrix.js"
    "public/js/components/TripleOSResultsView.js"
    "public/js/os-analyzer/engines/CompatibilityEngine.js"
)

# 保護ルール
- 読み取り: 許可
- 書き込み: 事前確認必須
- バックアップ: 自動実行
- バージョン管理: 強制
```

#### 3.1.3 SafeMode OS（防御システム）保護
```bash
# 保護対象ファイル
protected_safemode_files=(
    "public/js/os-analyzer/core/ShadowAnalyzer.js"
    "public/js/os-analyzer/validation/IChingOrthodoxyValidator.js"
    "public/js/shared/core/ErrorHandler.js"
)

# 保護ルール
- 読み取り: 許可
- 書き込み: 管理者確認必須
- セキュリティ機能削除: 拒否
- 外部依存追加: 事前確認必須
```

### 3.2 易経データ保護

#### 3.2.1 64卦システム保護
```bash
# 保護対象
- 64卦の基本構造データ
- 卦間関係性マッピング
- 爻辞・卦辞の原典データ
- 変卦・互卦・錯卦・綜卦の関係性

# セキュリティルール
- 原典データ: 読み取り専用
- 解釈データ: 編集履歴記録必須
- 関係性データ: 整合性チェック必須
- メタデータ: バックアップ自動実行
```

#### 3.2.2 八卦・爻システム保護
```bash
# 保護対象
- 八卦の基本属性（五行・方位・時間等）
- 爻の陰陽パターン
- 爻位の意味体系
- 変化の法則データ

# セキュリティルール
- 基本属性: 変更禁止
- パターンデータ: 検証必須
- 法則データ: 論理整合性確認必須
```

### 3.3 HaQei哲学原則保護

#### 3.3.1 ユーザー主権原則
```bash
# 保護要件
- ユーザーデータの外部送信: 拒否
- 分析結果の外部保存: 拒否
- 個人情報の収集: 最小限
- データ削除権: 完全保証

# 技術実装
- LocalStorage優先使用
- Cookie使用最小化
- 外部API呼び出し制限
- 匿名化処理強制
```

#### 3.3.2 ローカルファースト原則
```bash
# 保護要件
- 全機能のオフライン動作: 保証
- ローカルデータ処理: 優先
- ネットワーク依存: 最小化
- データ同期: ユーザー制御

# 技術実装
- Service Worker活用
- IndexedDB使用
- CDN依存排除
- Progressive Web App化
```

#### 3.3.3 プライバシーファースト原則
```bash
# 保護要件
- 分析処理: 完全ローカル実行
- 個人識別情報: 収集禁止
- 行動追跡: 実装禁止
- データ暗号化: 保存時強制

# 技術実装
- トラッキングスクリプト禁止
- 外部リソース読み込み制限
- 暗号化ライブラリ使用
- プライバシーポリシー実装
```

### 3.4 Cipher統合保護

#### 3.4.1 記憶データ保護
```bash
# 保護対象
cipher_memory_path="/Users/hideakimacbookair/Desktop/haqei-analyzer/data/cipher-memory"

# セキュリティルール
- 直接ファイルアクセス: 拒否
- API経由アクセス: 認証必須
- バックアップ: 暗号化必須
- ログ: 機密情報除去必須
```

#### 3.4.2 設定ファイル保護
```bash
# 保護対象ファイル
protected_config_files=(
    "cipher.config.yaml"
    "haqei-serena-integration.yaml"
    ".env*"
    "claude-mcp-config.json"
)

# 保護ルール
- 環境変数: マスキング必須
- APIキー: 外部出力禁止
- 設定変更: バックアップ自動作成
- 権限管理: 読み取り専用ユーザー制限
```

---

## 🔄 4. 開発ワークフロー統合仕様

### 4.1 Cipher統合

#### 4.1.1 記憶共有プロトコル
```yaml
cipher_integration:
  security_context: "claude_code_secure"
  memory_sharing:
    security_events:
      - command_denials
      - protection_violations
      - configuration_changes
    learning_patterns:
      - safe_command_patterns
      - project_specific_rules
      - user_behavior_analysis
```

#### 4.1.2 哲学原則適用
```yaml
HaQei_security:
  principles:
    user_sovereignty:
      - security_transparency: "full_disclosure"
      - user_control: "maximum"
      - data_ownership: "complete"
    harmony_balance:
      - security_vs_productivity: "balanced"
      - protection_vs_freedom: "nuanced"
      - automation_vs_control: "user_choice"
```

### 4.2 Serena統合

#### 4.2.1 コード監視強化
```yaml
serena_security:
  file_monitoring:
    security_critical_files:
      - "~/.claude/settings.json"
      - "~/.claude/scripts/deny-check.sh"
      - "public/assets/*.js"
      - "cipher.config.yaml"
  
  symbol_protection:
    critical_symbols:
      - security_check_functions
      - permission_validation
      - data_protection_logic
      - encryption_functions
```

#### 4.2.2 セマンティック分析
```yaml
semantic_security:
  analysis_targets:
    - security_hole_detection
    - privilege_escalation_risks
    - data_leak_vectors
    - configuration_vulnerabilities
  
  automated_reports:
    - daily_security_scan
    - weekly_vulnerability_assessment
    - monthly_compliance_check
```

### 4.3 Tsumiki統合

#### 4.3.1 TDD セキュリティテスト
```yaml
tdd_security:
  test_categories:
    - "/tdd-security-requirements"
    - "/tdd-security-testcases"
    - "/tdd-security-red"
    - "/tdd-security-green"
    - "/tdd-security-refactor"
  
  quality_gates:
    - security_test_coverage: ">= 95%"
    - vulnerability_count: "0"
    - compliance_score: ">= 4.5/5.0"
```

#### 4.3.2 品質保証プロセス
```yaml
quality_security:
  automated_checks:
    - security_pattern_compliance
    - haqei_philosophy_alignment  
    - data_protection_verification
    - performance_security_balance
  
  manual_reviews:
    - penetration_testing
    - social_engineering_assessment
    - privacy_audit
    - business_continuity_test
```

---

## 📈 5. 実装計画とテスト仕様

### 5.1 段階的導入計画

#### 5.1.1 フェーズ1：基盤構築（週1）
- **目標**: 基本セキュリティ設定の実装
- **成果物**:
  - `~/.claude/settings.json` 基本版
  - `deny-check.sh` プロトタイプ
  - 基本ログ機能
- **検証項目**:
  - 基本拒否パターン動作確認
  - ログ出力正常性
  - パフォーマンス基準達成

#### 5.1.2 フェーズ2：HAQEI固有機能（週2）
- **目標**: プロジェクト特化保護機能の実装
- **成果物**:
  - Triple OS データ保護
  - 易経データ保護
  - HaQei原則適用
- **検証項目**:
  - データ保護機能動作確認
  - 原則違反検出精度
  - 開発効率性維持

#### 5.1.3 フェーズ3：ツール統合（週3）
- **目標**: Cipher/Serena/Tsumiki統合
- **成果物**:
  - 記憶共有プロトコル
  - セマンティック監視
  - TDDセキュリティテスト
- **検証項目**:
  - ツール間連携動作
  - 統合効果測定
  - ワークフロー最適化

#### 5.1.4 フェーズ4：本格運用（週4）
- **目標**: 全機能統合と運用開始
- **成果物**:
  - 完全版設定ファイル
  - 運用マニュアル
  - 保守手順書
- **検証項目**:
  - 全機能統合テスト
  - 長期運用テスト
  - ユーザビリティ評価

### 5.2 テスト仕様

#### 5.2.1 単体テスト
```bash
# deny-check.sh 単体テスト
test_basic_deny_patterns() {
    # 各拒否パターンの検証
    # 境界値テスト
    # エラー処理テスト
}

test_haqei_protection() {
    # Triple OS保護機能テスト
    # 易経データ保護テスト
    # HaQei原則適用テスト
}

test_performance() {
    # 処理時間測定（< 5秒）
    # メモリ使用量測定（< 10MB）
    # CPU使用率測定（< 50%）
}
```

#### 5.2.2 統合テスト
```bash
# Claude Code + セキュリティ統合テスト
test_claude_integration() {
    # 実際のClaude Codeでのコマンド実行
    # 設定ファイル読み込み確認
    # ログ出力確認
}

test_tool_integration() {
    # Cipher記憶共有テスト
    # Serenaファイル監視テスト
    # TsumikiTDDテスト統合
}
```

#### 5.2.3 セキュリティテスト
```bash
# セキュリティ脆弱性テスト
test_security_bypass() {
    # パターン回避試行
    # 権限昇格試行
    # 設定ファイル改ざん試行
}

test_data_protection() {
    # 機密データアクセス試行
    # 外部送信試行
    # 暗号化バイパス試行
}
```

### 5.3 品質基準

#### 5.3.1 機能要件達成基準
- **拒否精度**: >= 99.5%（false negative < 0.5%）
- **許可精度**: >= 98.0%（false positive < 2.0%）
- **応答時間**: <= 5秒（95%ile）
- **可用性**: >= 99.9%（月次）

#### 5.3.2 セキュリティ基準
- **データ保護**: 機密データ漏洩 0件
- **アクセス制御**: 不正アクセス検出率 >= 99%
- **ログ完全性**: 改ざん検出機能 100%動作
- **復旧時間**: システム障害からの復旧 <= 30分

#### 5.3.3 ユーザビリティ基準
- **学習コスト**: 新規開発者 <= 1時間で習得
- **操作性**: 追加操作 <= 5%増加
- **透明性**: セキュリティ動作の完全可視化
- **カスタマイズ性**: ユーザー固有ルール追加対応

---

## 🎯 6. 成功指標と評価基準

### 6.1 定量的指標

#### 6.1.1 セキュリティ効果
- **機密データ保護**: 漏洩インシデント 0件/月
- **不正コマンド検出**: 検出率 >= 99.5%
- **システム侵入**: 防御成功率 >= 99.9%
- **データ整合性**: 改ざん検出率 100%

#### 6.1.2 開発効率性
- **開発速度**: セキュリティ導入後の速度低下 <= 5%
- **エラー率**: セキュリティ関連エラー <= 1%/日
- **学習時間**: 新規開発者の習得時間 <= 1時間
- **設定時間**: 初期設定完了時間 <= 30分

#### 6.1.3 システム性能
- **応答時間**: コマンドチェック <= 5秒
- **メモリ使用**: 追加使用量 <= 10MB
- **CPU使用**: 追加使用率 <= 5%
- **ディスク使用**: ログファイル <= 100MB/月

### 6.2 定性的指標

#### 6.2.1 開発者体験
- **使いやすさ**: 直感的な設定・操作
- **透明性**: セキュリティ動作の明確な可視化
- **カスタマイズ性**: プロジェクト固有要件への対応
- **サポート性**: 問題解決の迅速性

#### 6.2.2 HaQei哲学適合性
- **ユーザー主権**: 完全なユーザー制御の実現
- **ローカルファースト**: オフライン完結性の保証
- **プライバシーファースト**: 個人情報保護の徹底
- **調和とバランス**: セキュリティと利便性の両立

### 6.3 継続改善基準

#### 6.3.1 月次レビュー項目
- セキュリティインシデント分析
- 開発効率性メトリクス評価
- ユーザーフィードバック収集・分析
- システム性能傾向分析

#### 6.3.2 四半期改善項目
- 新脅威への対応策検討
- 設定最適化と自動化推進
- ツール統合効果の深化
- HaQei哲学の更なる実装

---

## 📚 7. 関連資料とリファレンス

### 7.1 参照資料
- [Claude Code セキュアbash設定](https://wasabeef.jp/blog/claude-code-secure-bash)
- HAQEI Analyzer CLAUDE.md
- HaQei哲学原典
- Triple OS Architecture仕様書

### 7.2 設定ファイル
- `/Users/hideakimacbookair/Desktop/haqei-analyzer/cipher.config.yaml`
- `/Users/hideakimacbookair/Desktop/haqei-analyzer/haqei-serena-integration.yaml`
- `/Users/hideakimacbookair/Desktop/haqei-analyzer/.serena/project.yml`

### 7.3 関連ドキュメント
- `docs/development/DEVELOPMENT_GUIDE.md`
- `docs/requirements/20250802_REQ_HAQEI_Modernization_Requirements_v1.md`
- `docs/implementation/2025-08-01_IMPL_TSUMIKI_AGENTS_MIGRATION_PLAN.md`

---

## ✅ 8. 承認と次期ステップ

### 8.1 要件承認チェックリスト
- [ ] CTOによる技術仕様承認
- [ ] I Ching Expertによる易経データ保護承認
- [ ] QA Testによるテスト仕様承認
- [ ] Programmerによる実装可能性確認

### 8.2 実装開始条件
1. **環境準備**: Claude Code環境の確認
2. **権限設定**: 管理者権限の取得
3. **バックアップ**: 既存設定のバックアップ
4. **テスト環境**: 分離されたテスト環境の構築

### 8.3 次期アクション
1. **実装計画詳細化**: Programmerによる技術実装計画
2. **テスト計画策定**: QA Testによる包括的テスト計画
3. **セキュリティ監査**: 外部専門家による監査実施
4. **ユーザー教育**: 開発チーム向け教育プログラム

---

**文書管理**
- **初版作成**: 2025年8月3日
- **レビュー予定**: 2025年8月5日
- **承認期限**: 2025年8月7日
- **実装開始予定**: 2025年8月10日

**Contact**
- **要件責任者**: Requirements Analyst Agent
- **技術レビュー**: CTO Agent  
- **最終承認**: プロジェクトオーナー

---

*この要件定義書は、HAQEIプロジェクトのHaQei哲学に基づき、ユーザー主権・ローカルファースト・プライバシーファーストの原則を最優先として策定されています。*