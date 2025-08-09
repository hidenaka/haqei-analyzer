# Supabase セットアップガイド

**作成日**: 2025年8月2日  
**バージョン**: v1.0  
**作成者**: HAQEI開発チーム

## 📋 概要

HaQei AnalyzerにSupabaseデータベースを統合するための完全なセットアップガイド。

## 🎯 実装内容

### ✅ 完了した作業

#### 1. Supabaseクライアント設定
- `src/services/supabase.ts`: クライアント初期化
- 環境変数からの設定読み込み
- 接続テスト機能
- エラーハンドリング

#### 2. TypeScript型定義
- `src/types/supabase.ts`: 完全なデータベース型定義
- テーブル構造（4テーブル）
- Row/Insert/Update型の分離
- Enum型定義

#### 3. 環境設定
- `.env.example`: 設定テンプレート
- 開発環境での接続確認機能

## 🗄️ データベース設計

### テーブル構造

#### 1. analysis_results
**目的**: 分析結果の永続化
```sql
CREATE TABLE analysis_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  analysis_data JSONB NOT NULL,
  triple_os_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  status analysis_status DEFAULT 'completed',
  metadata JSONB
);
```

#### 2. user_profiles
**目的**: ユーザープロフィール管理
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  preferences JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ
);
```

#### 3. diagnosis_history
**目的**: 診断履歴の追跡
```sql
CREATE TABLE diagnosis_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  analysis_result_id UUID REFERENCES analysis_results(id) ON DELETE CASCADE,
  completion_time INTEGER NOT NULL,
  question_count INTEGER NOT NULL,
  dimension_scores JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4. shared_results
**目的**: 結果シェア機能
```sql
CREATE TABLE shared_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_result_id UUID REFERENCES analysis_results(id) ON DELETE CASCADE,
  share_token TEXT UNIQUE NOT NULL,
  privacy_level sharing_privacy DEFAULT 'private',
  expires_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  custom_message TEXT
);
```

### Enum型定義
```sql
-- 分析ステータス
CREATE TYPE analysis_status AS ENUM ('in_progress', 'completed', 'error');

-- シェアのプライバシーレベル
CREATE TYPE sharing_privacy AS ENUM ('public', 'private', 'limited');
```

## 🛠️ セットアップ手順

### 1. Supabaseプロジェクト作成
1. [supabase.com](https://supabase.com) でアカウント作成
2. 新規プロジェクト作成
3. プロジェクト設定から以下を取得：
   - Project URL
   - Anon (public) key

### 2. 環境変数設定
```bash
cp .env.example .env
```

`.env`ファイルを編集：
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. データベーススキーマ適用
Supabase SQL Editorで以下を実行：

```sql
-- 1. Enum型の作成
CREATE TYPE analysis_status AS ENUM ('in_progress', 'completed', 'error');
CREATE TYPE sharing_privacy AS ENUM ('public', 'private', 'limited');

-- 2. テーブル作成（上記SQL参照）

-- 3. RLS (Row Level Security) 設定
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnosis_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_results ENABLE ROW LEVEL SECURITY;

-- 4. ポリシー作成（例）
CREATE POLICY "Users can view own analysis results" ON analysis_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analysis results" ON analysis_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 4. 依存関係インストール
```bash
cd haqei-vue
npm install @supabase/supabase-js
```

## 🔧 使用方法

### 基本的な使用例

```typescript
import { supabase } from '@/services/supabase'

// 分析結果の保存
const saveAnalysisResult = async (data: AnalysisResultInsert) => {
  const { data: result, error } = await supabase
    .from('analysis_results')
    .insert(data)
    .select()
    .single()
  
  if (error) throw error
  return result
}

// 分析結果の取得
const getAnalysisResults = async (userId: string) => {
  const { data, error } = await supabase
    .from('analysis_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}
```

## 🔐 セキュリティ設定

### Row Level Security (RLS)
- 全テーブルでRLS有効化済み
- ユーザーは自分のデータのみアクセス可能
- 共有結果は適切な権限制御

### 認証
- Supabase Auth統合
- メール/パスワード認証
- ソーシャルログイン対応準備

## 📊 監視とメンテナンス

### パフォーマンス監視
- Supabaseダッシュボードでクエリ監視
- インデックス最適化
- 接続プール設定

### バックアップ
- 自動バックアップ設定（1日1回）
- 手動バックアップのスケジュール設定

## 🚀 次のステップ

### 実装予定機能
1. **TASK-034**: データベーススキーマの詳細設計
2. **TASK-035**: Supabaseクライアント設定の完了
3. **TASK-036**: 基本CRUD操作の実装
4. **TASK-037**: Row Level Security設定
5. **TASK-038**: データマイグレーションスクリプト

### 長期計画
- リアルタイムサブスクリプション
- ファイルストレージ統合
- エッジ関数の活用

## ⚠️ 注意事項

### セキュリティ
- Service Role Keyをクライアントに露出しない
- 環境変数の適切な管理
- RLSポリシーの継続的見直し

### パフォーマンス
- クエリの最適化
- インデックス戦略
- 接続数の監視

### 開発効率
- 型安全性の維持
- エラーハンドリングの統一
- テストデータの管理

---

**実装ステータス**: Phase 1 完了  
**次期作業**: TASK-034（データベーススキーマ設計）