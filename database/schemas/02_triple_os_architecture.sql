-- =====================================================================
-- HAQEI Database Schema: Triple OS Architecture
-- =====================================================================
-- 目的: Engine OS / Interface OS / Safe Mode OS の独立したデータ構造
-- 哲学: 人間の多層的な意識構造をデータベースでモデリング
-- 作成: 2025-08-03 by Database Architect Agent (Sub-Agent 2)
-- =====================================================================

-- =====================================================================
-- 1. ユーザー基盤テーブル
-- =====================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,                  -- Supabase Auth連携用（オプション）
    username VARCHAR(50) UNIQUE,                -- ローカル識別子
    
    -- プライバシー設定（bunenjin哲学）
    privacy_level VARCHAR(20) DEFAULT 'maximum',    -- maximum, high, medium, low
    data_sharing_consent BOOLEAN DEFAULT FALSE,     -- データ共有同意
    analytics_opt_in BOOLEAN DEFAULT FALSE,         -- 分析参加同意
    
    -- セッション管理
    last_active_at TIMESTAMP WITH TIME ZONE,
    total_sessions INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,            -- ソフトデリート
    
    -- データ保持期間（GDPR準拠）
    data_retention_until TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 years')
);

-- =====================================================================
-- 2. Engine OS (価値観システム) テーブル
-- =====================================================================

CREATE TABLE engine_os_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- 価値観コア要素
    intrinsic_motivation JSONB NOT NULL,           -- 内在的動機の構造化データ
    core_values JSONB NOT NULL,                    -- 核となる価値観
    life_philosophy TEXT,                          -- 人生哲学
    
    -- 易経的価値観マッピング
    primary_hexagram_id INTEGER REFERENCES hexagrams(id),
    secondary_hexagram_id INTEGER REFERENCES hexagrams(id),
    value_hexagram_mapping JSONB,                  -- 価値観→卦のマッピング
    
    -- 強み・志向性
    strength_areas JSONB,                          -- 強み領域の構造化
    growth_aspirations JSONB,                      -- 成長願望
    authenticity_score INTEGER CHECK (authenticity_score BETWEEN 0 AND 100),
    
    -- bunenjin統合要素
    philosophical_alignment TEXT,                   -- 哲学的一致性
    wisdom_integration_level INTEGER CHECK (wisdom_integration_level BETWEEN 0 AND 10),
    
    -- 分析結果メタデータ  
    analysis_confidence NUMERIC(5,2) CHECK (analysis_confidence BETWEEN 0 AND 100),
    last_analysis_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)  -- 1ユーザー1Engine OSプロファイル
);

-- =====================================================================
-- 3. Interface OS (社会適応システム) テーブル
-- =====================================================================

CREATE TABLE interface_os_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- 社会適応メカニズム
    social_adaptation_patterns JSONB NOT NULL,     -- 社会適応パターン
    communication_styles JSONB NOT NULL,           -- コミュニケーションスタイル
    relationship_strategies JSONB,                 -- 関係性戦略
    
    -- 易経的社会性マッピング
    primary_hexagram_id INTEGER REFERENCES hexagrams(id),
    secondary_hexagram_id INTEGER REFERENCES hexagrams(id),
    social_hexagram_mapping JSONB,                 -- 社会性→卦のマッピング
    
    -- 適応能力指標
    adaptability_score INTEGER CHECK (adaptability_score BETWEEN 0 AND 100),
    social_intelligence_score INTEGER CHECK (social_intelligence_score BETWEEN 0 AND 100),
    empathy_level INTEGER CHECK (empathy_level BETWEEN 0 AND 10),
    
    -- 対人関係パターン
    interpersonal_patterns JSONB,                  -- 対人パターン分析
    conflict_resolution_style VARCHAR(50),         -- 衝突解決スタイル
    leadership_tendencies JSONB,                   -- リーダーシップ傾向
    
    -- bunenjin統合要素
    harmony_seeking_score INTEGER CHECK (harmony_seeking_score BETWEEN 0 AND 10),
    collective_wisdom_integration TEXT,
    
    -- 分析結果メタデータ
    analysis_confidence NUMERIC(5,2) CHECK (analysis_confidence BETWEEN 0 AND 100),
    last_analysis_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)  -- 1ユーザー1Interface OSプロファイル
);

-- =====================================================================
-- 4. Safe Mode OS (防御システム) テーブル
-- =====================================================================

CREATE TABLE safe_mode_os_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- 防御メカニズム
    defense_mechanisms JSONB NOT NULL,             -- 防御機制の構造化データ
    risk_assessment_patterns JSONB NOT NULL,       -- リスク評価パターン
    stress_response_strategies JSONB,              -- ストレス反応戦略
    
    -- 易経的防御マッピング
    primary_hexagram_id INTEGER REFERENCES hexagrams(id),
    secondary_hexagram_id INTEGER REFERENCES hexagrams(id),
    safety_hexagram_mapping JSONB,                 -- 安全性→卦のマッピング
    
    -- 安全性指標
    risk_tolerance_level INTEGER CHECK (risk_tolerance_level BETWEEN 0 AND 10),
    anxiety_management_score INTEGER CHECK (anxiety_management_score BETWEEN 0 AND 100),
    resilience_level INTEGER CHECK (resilience_level BETWEEN 0 AND 10),
    
    -- 防御パターン詳細
    threat_recognition_patterns JSONB,             -- 脅威認識パターン
    safety_seeking_behaviors JSONB,               -- 安全追求行動
    comfort_zone_boundaries JSONB,                -- コンフォートゾーン境界
    
    -- bunenjin統合要素
    wisdom_based_caution TEXT,                     -- 智慧に基づく慎重さ
    protective_instinct_balance INTEGER CHECK (protective_instinct_balance BETWEEN 0 AND 10),
    
    -- 分析結果メタデータ
    analysis_confidence NUMERIC(5,2) CHECK (analysis_confidence BETWEEN 0 AND 100),
    last_analysis_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)  -- 1ユーザー1Safe Mode OSプロファイル
);

-- =====================================================================
-- 5. Triple OS相互作用テーブル
-- =====================================================================

CREATE TABLE os_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- 相互作用の種類
    interaction_type VARCHAR(50) NOT NULL,         -- harmony, conflict, synthesis, dominance
    primary_os VARCHAR(20) NOT NULL CHECK (primary_os IN ('engine', 'interface', 'safe_mode')),
    secondary_os VARCHAR(20) NOT NULL CHECK (secondary_os IN ('engine', 'interface', 'safe_mode')),
    
    -- 相互作用の詳細
    interaction_strength INTEGER CHECK (interaction_strength BETWEEN 0 AND 10),
    interaction_quality VARCHAR(20),               -- positive, negative, neutral, complex
    resolution_pattern JSONB,                      -- 解決パターン
    
    -- 易経的解釈
    representative_hexagram_id INTEGER REFERENCES hexagrams(id),
    transformation_hexagram_id INTEGER REFERENCES hexagrams(id),
    iching_interpretation TEXT,
    
    -- 時間的要素
    frequency VARCHAR(20),                          -- rare, occasional, frequent, constant
    duration_pattern VARCHAR(20),                  -- brief, moderate, extended, persistent
    
    -- bunenjin統合解釈
    philosophical_meaning TEXT,
    growth_opportunity TEXT,
    harmony_potential TEXT,
    
    -- 観測記録
    observed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    context_description TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CHECK (primary_os != secondary_os)
);

-- =====================================================================
-- 6. 分析セッションテーブル
-- =====================================================================

CREATE TABLE analysis_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- セッション基本情報
    session_type VARCHAR(30) NOT NULL,             -- initial, follow_up, deep_dive, verification
    completion_status VARCHAR(20) DEFAULT 'in_progress', -- in_progress, completed, abandoned
    
    -- 分析結果統合
    engine_os_profile_id UUID REFERENCES engine_os_profiles(id),
    interface_os_profile_id UUID REFERENCES interface_os_profiles(id),
    safe_mode_os_profile_id UUID REFERENCES safe_mode_os_profiles(id),
    
    -- 総合スコア
    overall_harmony_score INTEGER CHECK (overall_harmony_score BETWEEN 0 AND 100),
    integration_level INTEGER CHECK (integration_level BETWEEN 0 AND 10),
    authenticity_alignment INTEGER CHECK (authenticity_alignment BETWEEN 0 AND 100),
    
    -- 易経総合解釈
    primary_life_hexagram_id INTEGER REFERENCES hexagrams(id),
    guidance_hexagram_id INTEGER REFERENCES hexagrams(id),
    transformation_path JSONB,                     -- 変化の道筋
    
    -- bunenjin統合要素
    wisdom_synthesis TEXT,                          -- 智慧の統合
    life_guidance_summary TEXT,                    -- 人生指導要約
    philosophical_insight TEXT,                    -- 哲学的洞察
    
    -- セッションメタデータ
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    questions_answered INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- 7. 質問応答履歴テーブル
-- =====================================================================

CREATE TABLE question_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES analysis_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- 質問情報
    question_id VARCHAR(10) NOT NULL,              -- q1, q2, ..., q30
    question_text TEXT NOT NULL,
    question_category VARCHAR(30),                 -- engine_os, interface_os, safe_mode_os, integration
    
    -- 回答情報
    response_value INTEGER NOT NULL CHECK (response_value BETWEEN 1 AND 7),
    response_confidence INTEGER CHECK (response_confidence BETWEEN 1 AND 5),
    response_time_seconds INTEGER,                 -- 回答に要した時間
    
    -- 分析への影響
    engine_os_weight NUMERIC(3,2) DEFAULT 0,
    interface_os_weight NUMERIC(3,2) DEFAULT 0,
    safe_mode_os_weight NUMERIC(3,2) DEFAULT 0,
    
    -- 易経的関連付け
    influenced_hexagrams INTEGER[],                -- 影響を受ける卦のID配列
    
    -- メタデータ
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revised_at TIMESTAMP WITH TIME ZONE,           -- 回答修正時刻
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(session_id, question_id)
);

-- =====================================================================
-- 8. プライバシー設定詳細テーブル
-- =====================================================================

CREATE TABLE privacy_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- データ管理設定
    profile_visibility VARCHAR(20) DEFAULT 'private', -- private, anonymous, shared
    data_export_format VARCHAR(20) DEFAULT 'json',    -- json, csv, pdf
    auto_delete_enabled BOOLEAN DEFAULT TRUE,
    auto_delete_after_days INTEGER DEFAULT 2555,      -- ~7年
    
    -- 分析データ制御
    store_engine_os_data BOOLEAN DEFAULT TRUE,
    store_interface_os_data BOOLEAN DEFAULT TRUE,
    store_safe_mode_os_data BOOLEAN DEFAULT TRUE,
    store_interaction_data BOOLEAN DEFAULT TRUE,
    
    -- 研究・改善同意
    anonymous_research_participation BOOLEAN DEFAULT FALSE,
    algorithm_improvement_contribution BOOLEAN DEFAULT FALSE,
    
    -- bunenjin哲学的同意
    wisdom_sharing_consent BOOLEAN DEFAULT FALSE,     -- 匿名化された智慧の共有
    collective_growth_participation BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- =====================================================================
-- 9. インデックス定義（パフォーマンス最適化）
-- =====================================================================

-- ユーザー検索インデックス
CREATE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;
CREATE INDEX idx_users_username ON users(username) WHERE username IS NOT NULL;
CREATE INDEX idx_users_active ON users(last_active_at) WHERE deleted_at IS NULL;

-- Triple OS プロファイル検索
CREATE INDEX idx_engine_os_user ON engine_os_profiles(user_id);
CREATE INDEX idx_interface_os_user ON interface_os_profiles(user_id);
CREATE INDEX idx_safe_mode_os_user ON safe_mode_os_profiles(user_id);

-- 相互作用分析インデックス
CREATE INDEX idx_os_interactions_user ON os_interactions(user_id);
CREATE INDEX idx_os_interactions_type ON os_interactions(interaction_type, primary_os, secondary_os);
CREATE INDEX idx_os_interactions_observed ON os_interactions(observed_at);

-- セッション・質問応答インデックス
CREATE INDEX idx_analysis_sessions_user ON analysis_sessions(user_id);
CREATE INDEX idx_analysis_sessions_status ON analysis_sessions(completion_status, started_at);
CREATE INDEX idx_question_responses_session ON question_responses(session_id, question_id);

-- =====================================================================
-- 10. 関数定義（ビジネスロジック）
-- =====================================================================

-- Triple OS統合スコア計算
CREATE OR REPLACE FUNCTION calculate_triple_os_integration(user_uuid UUID)
RETURNS TABLE(
    engine_strength INTEGER,
    interface_strength INTEGER,
    safe_mode_strength INTEGER,
    overall_harmony INTEGER,
    dominant_os TEXT
) AS $$
DECLARE
    engine_score INTEGER;
    interface_score INTEGER;
    safe_mode_score INTEGER;
    harmony_score INTEGER;
    dominant TEXT;
BEGIN
    -- 各OSの強度を取得
    SELECT e.authenticity_score INTO engine_score
    FROM engine_os_profiles e WHERE e.user_id = user_uuid;
    
    SELECT i.adaptability_score INTO interface_score
    FROM interface_os_profiles i WHERE i.user_id = user_uuid;
    
    SELECT s.resilience_level * 10 INTO safe_mode_score
    FROM safe_mode_os_profiles s WHERE s.user_id = user_uuid;
    
    -- 調和スコア計算（標準偏差の逆数ベース）
    harmony_score := 100 - ABS(engine_score - interface_score) - ABS(interface_score - safe_mode_score) - ABS(safe_mode_score - engine_score);
    
    -- 支配的OS判定
    IF engine_score >= interface_score AND engine_score >= safe_mode_score THEN
        dominant := 'Engine OS (価値観システム)';
    ELSIF interface_score >= safe_mode_score THEN
        dominant := 'Interface OS (社会適応システム)';
    ELSE
        dominant := 'Safe Mode OS (防御システム)';
    END IF;
    
    RETURN QUERY SELECT engine_score, interface_score, safe_mode_score, harmony_score, dominant;
END;
$$ LANGUAGE plpgsql;

-- ユーザープライバシー検証関数
CREATE OR REPLACE FUNCTION verify_privacy_compliance(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    consent_valid BOOLEAN;
    retention_valid BOOLEAN;
BEGIN
    -- データ利用同意確認
    SELECT data_sharing_consent INTO consent_valid
    FROM users WHERE id = user_uuid;
    
    -- データ保持期間確認
    SELECT (data_retention_until > NOW()) INTO retention_valid
    FROM users WHERE id = user_uuid;
    
    RETURN (consent_valid AND retention_valid);
END;
$$ LANGUAGE plpgsql;

-- =====================================================================
-- 11. ビュー定義（複雑クエリの簡素化）
-- =====================================================================

-- ユーザー完全プロファイルビュー
CREATE VIEW user_complete_profiles AS
SELECT 
    u.id as user_id,
    u.username,
    u.privacy_level,
    e.authenticity_score as engine_authenticity,
    i.adaptability_score as interface_adaptability,
    s.resilience_level as safe_mode_resilience,
    calc.overall_harmony,
    calc.dominant_os
FROM users u
LEFT JOIN engine_os_profiles e ON u.id = e.user_id
LEFT JOIN interface_os_profiles i ON u.id = i.user_id
LEFT JOIN safe_mode_os_profiles s ON u.id = s.user_id
CROSS JOIN LATERAL calculate_triple_os_integration(u.id) calc
WHERE u.deleted_at IS NULL;

-- アクティブセッションビュー
CREATE VIEW active_analysis_sessions AS
SELECT 
    s.*,
    u.username,
    u.privacy_level,
    (s.questions_answered / 30.0 * 100) as completion_percentage
FROM analysis_sessions s
JOIN users u ON s.user_id = u.id
WHERE s.completion_status = 'in_progress'
AND s.started_at > NOW() - INTERVAL '24 hours';

-- =====================================================================
-- 12. トリガー関数（データ整合性・監査）
-- =====================================================================

-- 分析信頼度自動計算トリガー
CREATE OR REPLACE FUNCTION update_analysis_confidence()
RETURNS TRIGGER AS $$
BEGIN
    -- セッション完了時の信頼度計算
    IF NEW.completion_status = 'completed' AND OLD.completion_status != 'completed' THEN
        NEW.overall_harmony_score := (
            SELECT AVG(response_confidence * 20) 
            FROM question_responses 
            WHERE session_id = NEW.id
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_session_confidence 
    BEFORE UPDATE ON analysis_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_analysis_confidence();

-- プライバシー変更監査トリガー
CREATE OR REPLACE FUNCTION audit_privacy_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO privacy_audit_log (
        user_id, 
        changed_field, 
        old_value, 
        new_value, 
        changed_at
    ) VALUES (
        NEW.user_id,
        'privacy_level',
        OLD.privacy_level,
        NEW.privacy_level,
        NOW()
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 監査ログテーブル
CREATE TABLE privacy_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    changed_field VARCHAR(50) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER audit_privacy_settings_changes 
    AFTER UPDATE ON privacy_settings 
    FOR EACH ROW EXECUTE FUNCTION audit_privacy_changes();

-- =====================================================================
-- 13. データ検証制約
-- =====================================================================

-- Triple OS相互作用の妥当性制約
ALTER TABLE os_interactions ADD CONSTRAINT check_valid_interaction_strength
    CHECK (
        (interaction_type = 'harmony' AND interaction_strength >= 6) OR
        (interaction_type = 'conflict' AND interaction_strength <= 4) OR
        (interaction_type IN ('synthesis', 'dominance'))
    );

-- プライバシーレベル整合性制約
ALTER TABLE users ADD CONSTRAINT check_privacy_data_consistency
    CHECK (
        (privacy_level = 'maximum' AND data_sharing_consent = FALSE) OR
        privacy_level != 'maximum'
    );

-- =====================================================================
-- 14. コメント追加（ドキュメント化）
-- =====================================================================

COMMENT ON TABLE users IS 'HAQEI利用者基本情報 - プライバシーファースト設計';
COMMENT ON TABLE engine_os_profiles IS 'Engine OS - 価値観・内在的動機システム';
COMMENT ON TABLE interface_os_profiles IS 'Interface OS - 社会適応・コミュニケーションシステム';
COMMENT ON TABLE safe_mode_os_profiles IS 'Safe Mode OS - 防御・リスク管理システム';
COMMENT ON TABLE os_interactions IS 'Triple OS相互作用記録 - システム間の力学';
COMMENT ON TABLE analysis_sessions IS '分析セッション - 統合的な診断プロセス';

-- =====================================================================
-- 完了確認
-- =====================================================================

DO $$
BEGIN
    RAISE NOTICE 'Triple OSアーキテクチャスキーマ作成完了';
    RAISE NOTICE 'Core Tables: users, engine_os_profiles, interface_os_profiles, safe_mode_os_profiles';
    RAISE NOTICE 'Integration Tables: os_interactions, analysis_sessions, question_responses';
    RAISE NOTICE 'Privacy Tables: privacy_settings, privacy_audit_log';
    RAISE NOTICE 'bunenjin哲学統合: ✓ プライバシー主権, ✓ 智慧統合, ✓ 調和的成長';
END $$;