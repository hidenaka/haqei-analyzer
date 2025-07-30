# HAQEI Analyzer × Cipher統合

## 概要
HAQEI AnalyzerにCipherの記憶層を統合し、セッション間での文脈継続性とbunenjin哲学の一貫性を実現。

## Cipherの導入効果

### Dual Memory Layer
- **プログラミング概念記憶**: Triple OS Architecture、bunenjin哲学、易経的アプローチの保持
- **推論ステップ記憶**: 実装決定、設計思想、問題解決プロセスの蓄積

### 文脈継続性
- 新しいClaude Codeセッション開始時も過去の文脈を自動継承
- プロジェクト固有の制約とガイドラインの継続的適用
- 一貫したコードスタイルと設計パターンの維持

## 使用方法

### 1. Cipherサーバー起動
```bash
npm run cipher:start
```

### 2. 環境変数設定
`.env.cipher`ファイルでAnthropic API Keyを設定：
```
ANTHROPIC_API_KEY=your_api_key_here
```

### 3. 新セッション開始時
1. Cipherサーバーが稼働していることを確認
2. CLAUDE.mdの指示に従い、Cipherアプローチを適用
3. 過去の記憶と文脈を自動的に継承

## ファイル構成

```
├── cipher.config.yaml      # Cipher設定ファイル
├── cipher-server.js        # HAQEIカスタムCipherサーバー
├── .env.cipher            # 環境変数（要設定）
├── data/cipher-memory/    # メモリデータ（自動生成）
└── logs/                  # ログファイル（自動生成）
```

## bunenjin哲学統合

Cipherの記憶共有理念とbunenjin哲学の融合により：
- 易経的思考パターンの継続
- ユーザー主権とプライバシーファーストの維持
- Triple OS Architectureの一貫性保持

これにより、真の「記憶する分析システム」として進化します。