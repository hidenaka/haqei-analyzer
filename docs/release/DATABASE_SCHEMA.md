# HAQEI データベース設計書

## データベース概要

HAQEI は Supabase (PostgreSQL 14+) を使用し、完全な Row Level Security (RLS) を実装しています。

## 主要テーブル設計

### analysis_results テーブル

分析結果を保存するメインテーブル

```sql
CREATE TABLE analysis_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  analysis_data JSONB NOT NULL,
  triple_os_data JSONB,
  hexagram_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- インデックス
  CONSTRAINT unique_session_per_user UNIQUE(user_id, session_id)
);

-- インデックス作成
CREATE INDEX idx_analysis_results_user_id ON analysis_results(user_id);
CREATE INDEX idx_analysis_results_created_at ON analysis_results(created_at DESC);
CREATE INDEX idx_analysis_results_session_id ON analysis_results(session_id);

-- JSONB フィールドのインデックス
CREATE INDEX idx_analysis_data_gin ON analysis_results USING GIN(analysis_data);
CREATE INDEX idx_triple_os_data_gin ON analysis_results USING GIN(triple_os_data);
CREATE INDEX idx_hexagram_data_gin ON analysis_results USING GIN(hexagram_data);
```

**データ構造例**
```json
{
  "analysis_data": {
    "triple_os": {
      "engine": {
        "score": 85,
        "characteristics": ["analytical", "strategic", "goal_oriented"],
        "strengths": ["decision_making", "planning"],
        "areas_for_growth": ["flexibility", "emotional_awareness"]
      },
      "interface": {
        "score": 78,
        "characteristics": ["collaborative", "empathetic", "communicative"],
        "strengths": ["teamwork", "relationship_building"],
        "areas_for_growth": ["assertiveness", "conflict_resolution"]
      },
      "safe_mode": {
        "score": 92,
        "characteristics": ["resilient", "adaptive", "self_caring"],
        "strengths": ["stress_management", "recovery"],
        "areas_for_growth": ["risk_taking", "openness_to_change"]
      }
    },
    "hexagram": {
      "primary": 23,
      "changing_lines": [2, 4],
      "resulting": 45,
      "interpretation": "時を待つ智慧...",
      "guidance": "現在は準備の時..."
    },
    "future_simulation": {
      "scenarios": [
        {
          "scenario": "career_advancement",
          "probability": 0.85,
          "timeline": "6_months",
          "key_factors": ["skill_development", "networking"]
        }
      ],
      "overall_probability": 0.89,
      "recommendations": ["スキル向上に注力", "人脈構築を継続"]
    }
  },
  "triple_os_data": {
    "detailed_scores": {
      "engine_subcategories": {...},
      "interface_subcategories": {...},
      "safe_mode_subcategories": {...}
    },
    "dimension_analysis": {...},
    "relationships": {...}
  },
  "hexagram_data": {
    "yao_analysis": [...],
    "seasonal_context": "winter_preparation",
    "cultural_interpretation": "東洋的解釈...",
    "action_guidance": [...]
  }
}
```

### diagnosis_history テーブル

診断履歴とメタデータ保存

```sql
CREATE TABLE diagnosis_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  diagnosis_type TEXT NOT NULL,
  result_data JSONB NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 制約
  CONSTRAINT valid_diagnosis_type CHECK (
    diagnosis_type IN (
      'triple_os_analysis', 
      'hexagram_divination', 
      'future_simulation',
      'comprehensive_analysis'
    )
  )
);

-- インデックス
CREATE INDEX idx_diagnosis_history_user_id ON diagnosis_history(user_id);
CREATE INDEX idx_diagnosis_history_type ON diagnosis_history(diagnosis_type);
CREATE INDEX idx_diagnosis_history_created_at ON diagnosis_history(created_at DESC);
```

### user_profiles テーブル

ユーザープロファイルと設定

```sql
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  preferences JSONB DEFAULT '{}',
  privacy_settings JSONB DEFAULT '{
    "data_sharing": false,
    "analytics": false,
    "cookies": "essential_only",
    "export_format": "json"
  }',
  last_login TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_last_login ON user_profiles(last_login DESC);
```

### migration_logs テーブル

データ移行履歴管理

```sql
CREATE TABLE migration_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  migration_type TEXT NOT NULL,
  source_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  data_count INTEGER,
  status TEXT DEFAULT 'pending',
  error_details JSONB,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  CONSTRAINT valid_migration_status CHECK (
    status IN ('pending', 'in_progress', 'completed', 'failed', 'rolled_back')
  )
);

-- インデックス
CREATE INDEX idx_migration_logs_user_id ON migration_logs(user_id);
CREATE INDEX idx_migration_logs_status ON migration_logs(status);
CREATE INDEX idx_migration_logs_started_at ON migration_logs(started_at DESC);
```

## Row Level Security (RLS) ポリシー

### analysis_results RLS

```sql
-- RLS有効化
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

-- ユーザー自身のデータのみアクセス可能
CREATE POLICY "Users can access own analysis results" ON analysis_results
  FOR ALL USING (auth.uid() = user_id);

-- 管理者アクセス（緊急時のみ）
CREATE POLICY "Admin access for analysis results" ON analysis_results
  FOR ALL USING (
    auth.jwt() ->> 'email' = 'admin@haqei.com' AND
    auth.jwt() ->> 'role' = 'admin'
  );
```

### diagnosis_history RLS

```sql
ALTER TABLE diagnosis_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access own diagnosis history" ON diagnosis_history
  FOR ALL USING (auth.uid() = user_id);
```

### user_profiles RLS

```sql
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access own profile" ON user_profiles
  FOR ALL USING (auth.uid() = id);
```

### migration_logs RLS

```sql
ALTER TABLE migration_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access own migration logs" ON migration_logs
  FOR ALL USING (auth.uid() = user_id);
```

## ビュー・関数定義

### 分析結果サマリービュー

```sql
CREATE OR REPLACE VIEW analysis_summary AS
SELECT 
  ar.user_id,
  COUNT(*) as total_analyses,
  MAX(ar.created_at) as last_analysis,
  AVG((ar.analysis_data->'triple_os'->'engine'->>'score')::numeric) as avg_engine_score,
  AVG((ar.analysis_data->'triple_os'->'interface'->>'score')::numeric) as avg_interface_score,
  AVG((ar.analysis_data->'triple_os'->'safe_mode'->>'score')::numeric) as avg_safe_mode_score,
  COUNT(DISTINCT ar.analysis_data->'hexagram'->>'primary') as unique_hexagrams
FROM analysis_results ar
GROUP BY ar.user_id;
```

### 診断統計関数

```sql
CREATE OR REPLACE FUNCTION get_user_diagnosis_stats(target_user_id UUID)
RETURNS TABLE (
  total_diagnoses BIGINT,
  avg_completion_time NUMERIC,
  most_common_type TEXT,
  improvement_trend NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_diagnoses,
    AVG((dh.result_data->>'completion_time')::numeric) as avg_completion_time,
    MODE() WITHIN GROUP (ORDER BY dh.diagnosis_type) as most_common_type,
    -- 改善トレンド計算（簡易版）
    CASE 
      WHEN COUNT(*) >= 2 THEN
        (AVG(CASE WHEN dh.created_at >= NOW() - INTERVAL '30 days' 
             THEN (dh.result_data->>'accuracy_score')::numeric END) - 
         AVG(CASE WHEN dh.created_at < NOW() - INTERVAL '30 days' 
             THEN (dh.result_data->>'accuracy_score')::numeric END))
      ELSE 0
    END as improvement_trend
  FROM diagnosis_history dh
  WHERE dh.user_id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## トリガー・制約

### 更新日時自動更新

```sql
-- 更新日時自動更新トリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- analysis_results テーブルに適用
CREATE TRIGGER update_analysis_results_updated_at
  BEFORE UPDATE ON analysis_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- user_profiles テーブルに適用
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### データ整合性制約

```sql
-- 分析データの必須フィールド検証
ALTER TABLE analysis_results ADD CONSTRAINT valid_analysis_data
CHECK (
  analysis_data ? 'triple_os' AND
  analysis_data->'triple_os' ? 'engine' AND
  analysis_data->'triple_os' ? 'interface' AND
  analysis_data->'triple_os' ? 'safe_mode'
);

-- スコア範囲検証
ALTER TABLE analysis_results ADD CONSTRAINT valid_score_range
CHECK (
  (analysis_data->'triple_os'->'engine'->>'score')::numeric BETWEEN 0 AND 100 AND
  (analysis_data->'triple_os'->'interface'->>'score')::numeric BETWEEN 0 AND 100 AND
  (analysis_data->'triple_os'->'safe_mode'->>'score')::numeric BETWEEN 0 AND 100
);
```

## インデックス最適化

### 複合インデックス

```sql
-- ユーザー+作成日時での高速検索
CREATE INDEX idx_analysis_results_user_created 
ON analysis_results(user_id, created_at DESC);

-- 診断タイプ+ユーザーでの検索最適化
CREATE INDEX idx_diagnosis_history_type_user 
ON diagnosis_history(diagnosis_type, user_id, created_at DESC);
```

### JSONB 検索最適化

```sql
-- Triple OS スコア範囲検索
CREATE INDEX idx_engine_score 
ON analysis_results USING BTREE (
  ((analysis_data->'triple_os'->'engine'->>'score')::numeric)
);

CREATE INDEX idx_interface_score 
ON analysis_results USING BTREE (
  ((analysis_data->'triple_os'->'interface'->>'score')::numeric)
);

CREATE INDEX idx_safe_mode_score 
ON analysis_results USING BTREE (
  ((analysis_data->'triple_os'->'safe_mode'->>'score')::numeric)
);

-- 卦番号での検索
CREATE INDEX idx_primary_hexagram 
ON analysis_results USING BTREE (
  ((analysis_data->'hexagram'->>'primary')::integer)
);
```

## バックアップ・復旧

### 自動バックアップ設定

```sql
-- ポイントインタイム復旧用関数
CREATE OR REPLACE FUNCTION create_user_data_backup(target_user_id UUID)
RETURNS TABLE (
  backup_id UUID,
  backup_timestamp TIMESTAMPTZ,
  data_size_bytes BIGINT
) AS $$
DECLARE
  backup_uuid UUID := gen_random_uuid();
BEGIN
  -- バックアップ作成ロジック
  RETURN QUERY
  SELECT 
    backup_uuid,
    NOW(),
    0::BIGINT; -- 実際のサイズ計算は実装時に追加
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### データアーカイブ

```sql
-- 古いデータのアーカイブ
CREATE TABLE analysis_results_archive (
  LIKE analysis_results INCLUDING ALL
);

-- アーカイブ処理関数
CREATE OR REPLACE FUNCTION archive_old_analysis_results(
  older_than_days INTEGER DEFAULT 365
)
RETURNS INTEGER AS $$
DECLARE
  archived_count INTEGER;
BEGIN
  WITH archived_data AS (
    DELETE FROM analysis_results
    WHERE created_at < NOW() - (older_than_days || ' days')::INTERVAL
    RETURNING *
  )
  INSERT INTO analysis_results_archive
  SELECT * FROM archived_data;
  
  GET DIAGNOSTICS archived_count = ROW_COUNT;
  RETURN archived_count;
END;
$$ LANGUAGE plpgsql;
```

## パフォーマンス監視

### 統計情報取得

```sql
-- テーブル統計
CREATE OR REPLACE VIEW table_statistics AS
SELECT 
  schemaname,
  tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes,
  n_live_tup as live_tuples,
  n_dead_tup as dead_tuples,
  last_vacuum,
  last_autovacuum,
  last_analyze,
  last_autoanalyze
FROM pg_stat_user_tables
WHERE schemaname = 'public';
```

### スロークエリ検出

```sql
-- 実行時間の長いクエリを特定
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements
WHERE mean_time > 100  -- 100ms以上のクエリ
ORDER BY mean_time DESC
LIMIT 10;
```

---

**データベース設計責任者**: データベースアーキテクト  
**最終更新**: 2025-08-03  
**スキーマバージョン**: 1.0.0  
**データベース**: PostgreSQL 14+ (Supabase)