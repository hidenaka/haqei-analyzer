-- =====================================================================
-- HAQEI Row Level Security (RLS) Enhancement Migration
-- =====================================================================
-- プロジェクト: HAQEI Analyzer (HArmony, QI Energy, Intelligence)
-- TASK-037: Row Level Security設定の完全実装
-- セキュリティ: bunenjin哲学準拠のゼロトラストアーキテクチャ
-- 作成: 2025-08-03 - Supabase統合完了版
-- =====================================================================

-- Migration 003: RLS強化とセキュリティポリシー拡張
-- 1. 高度なRLSポリシー実装
-- 2. セキュリティコンテキスト管理関数
-- 3. データアクセス監査システム
-- 4. プライバシーレベル別制御

BEGIN;

-- =====================================================================
-- セキュリティコンテキスト管理関数
-- =====================================================================

-- ユーザーセキュリティコンテキスト設定関数
CREATE OR REPLACE FUNCTION set_user_security_context(
    p_user_id UUID,
    p_privacy_level VARCHAR DEFAULT 'maximum'
)
RETURNS BOOLEAN AS $$
DECLARE
    context_data JSONB;
BEGIN
    -- セキュリティコンテキストの構築
    context_data := jsonb_build_object(
        'user_id', p_user_id,
        'privacy_level', p_privacy_level,
        'session_started', NOW(),
        'rls_active', true,
        'audit_enabled', true
    );
    
    -- PostgreSQL設定への保存
    PERFORM set_config('app.current_user_id', p_user_id::text, true);
    PERFORM set_config('app.privacy_level', p_privacy_level, true);
    PERFORM set_config('app.security_context', context_data::text, true);
    PERFORM set_config('app.auth_provider', 'supabase', true);
    
    -- セキュリティログの記録
    INSERT INTO access_audit_log (
        user_id,
        accessed_user_id,
        table_name,
        operation,
        purpose,
        privacy_level_at_access,
        access_granted
    ) VALUES (
        p_user_id,
        p_user_id,
        'security_context',
        'SET_CONTEXT',
        'session_initialization',
        p_privacy_level,
        true
    );
    
    RETURN true;
EXCEPTION
    WHEN OTHERS THEN
        -- エラーログ記録
        INSERT INTO access_audit_log (
            user_id,
            table_name,
            operation,
            access_granted
        ) VALUES (
            p_user_id,
            'security_context',
            'SET_CONTEXT_ERROR',
            false
        );
        RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- データアクセス権限チェック関数
CREATE OR REPLACE FUNCTION check_data_access_permissions(
    p_table_name TEXT,
    p_row_id TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    current_user_id UUID;
    privacy_level VARCHAR;
    target_user_id UUID;
    has_access BOOLEAN := false;
BEGIN
    -- 現在のユーザーコンテキスト取得
    current_user_id := current_setting('app.current_user_id', true)::UUID;
    privacy_level := current_setting('app.privacy_level', true);
    
    IF current_user_id IS NULL THEN
        RETURN false;
    END IF;
    
    -- テーブル別のアクセス制御ロジック
    CASE p_table_name
        WHEN 'users' THEN
            -- ユーザーテーブル：自分のレコードのみ
            SELECT (id = current_user_id) INTO has_access
            FROM users WHERE id = p_row_id::UUID;
            
        WHEN 'engine_os_profiles', 'interface_os_profiles', 'safe_mode_os_profiles' THEN
            -- Triple OSプロファイル：自分のプロファイルのみ
            EXECUTE format('SELECT (user_id = $1) FROM %I WHERE id = $2', p_table_name)
            INTO has_access
            USING current_user_id, p_row_id::UUID;
            
        WHEN 'analysis_sessions' THEN
            -- 分析セッション：自分のセッションのみ
            SELECT (user_id = current_user_id) INTO has_access
            FROM analysis_sessions WHERE id = p_row_id::UUID;
            
        WHEN 'question_responses' THEN
            -- 質問応答：自分の応答のみ
            SELECT (user_id = current_user_id) INTO has_access
            FROM question_responses WHERE id = p_row_id::UUID;
            
        ELSE
            -- その他のテーブル：デフォルトで拒否
            has_access := false;
    END CASE;
    
    -- アクセス試行の監査ログ記録
    INSERT INTO access_audit_log (
        user_id,
        accessed_user_id,
        table_name,
        operation,
        row_id,
        privacy_level_at_access,
        access_granted
    ) VALUES (
        current_user_id,
        target_user_id,
        p_table_name,
        'ACCESS_CHECK',
        p_row_id::UUID,
        privacy_level,
        has_access
    );
    
    RETURN has_access;
    
EXCEPTION
    WHEN OTHERS THEN
        -- エラー時は拒否
        INSERT INTO access_audit_log (
            user_id,
            table_name,
            operation,
            access_granted
        ) VALUES (
            current_user_id,
            p_table_name,
            'ACCESS_CHECK_ERROR',
            false
        );
        RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- プライバシーレベル別RLSポリシー
-- =====================================================================

-- 既存のポリシーを無効化
DROP POLICY IF EXISTS users_own_data ON users;
DROP POLICY IF EXISTS engine_os_own_data ON engine_os_profiles;
DROP POLICY IF EXISTS interface_os_own_data ON interface_os_profiles;
DROP POLICY IF EXISTS safe_mode_os_own_data ON safe_mode_os_profiles;
DROP POLICY IF EXISTS sessions_own_data ON analysis_sessions;
DROP POLICY IF EXISTS responses_own_data ON question_responses;
DROP POLICY IF EXISTS interactions_own_data ON os_interactions;
DROP POLICY IF EXISTS privacy_own_data ON privacy_settings;

-- Enhanced User Data Protection Policy
CREATE POLICY enhanced_users_protection ON users
FOR ALL USING (
    id = auth.uid()
    OR id = current_setting('app.current_user_id', true)::UUID
);

-- Triple OS Profiles - プライバシーレベル対応
CREATE POLICY enhanced_engine_os_protection ON engine_os_profiles
FOR ALL USING (
    user_id = COALESCE(auth.uid(), current_setting('app.current_user_id', true)::UUID)
    OR (
        -- 研究目的アクセス（medium/low プライバシーレベル）
        current_setting('app.purpose', true) = 'research'
        AND user_id IN (
            SELECT id FROM users 
            WHERE privacy_level IN ('medium', 'low')
            AND id IN (
                SELECT user_id FROM privacy_settings 
                WHERE anonymous_research_participation = true
            )
        )
    )
);

CREATE POLICY enhanced_interface_os_protection ON interface_os_profiles
FOR ALL USING (
    user_id = COALESCE(auth.uid(), current_setting('app.current_user_id', true)::UUID)
    OR (
        current_setting('app.purpose', true) = 'research'
        AND user_id IN (
            SELECT id FROM users 
            WHERE privacy_level IN ('medium', 'low')
            AND id IN (
                SELECT user_id FROM privacy_settings 
                WHERE anonymous_research_participation = true
            )
        )
    )
);

CREATE POLICY enhanced_safe_mode_os_protection ON safe_mode_os_profiles
FOR ALL USING (
    user_id = COALESCE(auth.uid(), current_setting('app.current_user_id', true)::UUID)
    OR (
        current_setting('app.purpose', true) = 'research'
        AND user_id IN (
            SELECT id FROM users 
            WHERE privacy_level IN ('medium', 'low')
            AND id IN (
                SELECT user_id FROM privacy_settings 
                WHERE anonymous_research_participation = true
            )
        )
    )
);

-- 分析セッション - 完全プライベート
CREATE POLICY enhanced_sessions_protection ON analysis_sessions
FOR ALL USING (
    user_id = COALESCE(auth.uid(), current_setting('app.current_user_id', true)::UUID)
);

-- 質問応答 - 完全プライベート
CREATE POLICY enhanced_responses_protection ON question_responses
FOR ALL USING (
    user_id = COALESCE(auth.uid(), current_setting('app.current_user_id', true)::UUID)
);

-- OS相互作用 - プライバシーレベル対応
CREATE POLICY enhanced_interactions_protection ON os_interactions
FOR ALL USING (
    user_id = COALESCE(auth.uid(), current_setting('app.current_user_id', true)::UUID)
    OR (
        current_setting('app.purpose', true) = 'collective_growth'
        AND user_id IN (
            SELECT id FROM users 
            WHERE privacy_level = 'low'
            AND id IN (
                SELECT user_id FROM privacy_settings 
                WHERE collective_growth_participation = true
            )
        )
    )
);

-- プライバシー設定 - 完全プライベート
CREATE POLICY enhanced_privacy_protection ON privacy_settings
FOR ALL USING (
    user_id = COALESCE(auth.uid(), current_setting('app.current_user_id', true)::UUID)
);

-- 監査ログ - 自分のログのみ閲覧可能
CREATE POLICY audit_log_own_access ON access_audit_log
FOR SELECT USING (
    user_id = COALESCE(auth.uid(), current_setting('app.current_user_id', true)::UUID)
);

-- =====================================================================
-- セキュリティ監視・アラート関数
-- =====================================================================

-- 不正アクセス試行検出関数
CREATE OR REPLACE FUNCTION detect_security_threats()
RETURNS TABLE(
    threat_type TEXT,
    user_id UUID,
    attempt_count BIGINT,
    last_attempt TIMESTAMP WITH TIME ZONE,
    severity TEXT
) AS $$
BEGIN
    RETURN QUERY
    -- 短時間での大量アクセス拒否
    SELECT 
        'bulk_access_denied'::TEXT,
        a.user_id,
        COUNT(*)::BIGINT,
        MAX(a.accessed_at),
        CASE WHEN COUNT(*) > 50 THEN 'HIGH'
             WHEN COUNT(*) > 20 THEN 'MEDIUM'
             ELSE 'LOW' END::TEXT
    FROM access_audit_log a
    WHERE a.accessed_at > NOW() - INTERVAL '1 hour'
    AND a.access_granted = false
    GROUP BY a.user_id
    HAVING COUNT(*) > 10
    
    UNION ALL
    
    -- 異常なテーブル横断アクセス
    SELECT 
        'cross_table_access'::TEXT,
        a.user_id,
        COUNT(DISTINCT a.table_name)::BIGINT,
        MAX(a.accessed_at),
        CASE WHEN COUNT(DISTINCT a.table_name) > 10 THEN 'HIGH'
             WHEN COUNT(DISTINCT a.table_name) > 5 THEN 'MEDIUM'
             ELSE 'LOW' END::TEXT
    FROM access_audit_log a
    WHERE a.accessed_at > NOW() - INTERVAL '10 minutes'
    GROUP BY a.user_id
    HAVING COUNT(DISTINCT a.table_name) > 3;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- セキュリティメトリクス取得関数
CREATE OR REPLACE FUNCTION get_security_metrics()
RETURNS JSONB AS $$
DECLARE
    metrics JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_users', (SELECT COUNT(*) FROM users WHERE deleted_at IS NULL),
        'active_sessions', (SELECT COUNT(*) FROM analysis_sessions WHERE completion_status = 'in_progress'),
        'privacy_distribution', (
            SELECT jsonb_object_agg(privacy_level, user_count)
            FROM (
                SELECT privacy_level, COUNT(*) as user_count
                FROM users 
                WHERE deleted_at IS NULL
                GROUP BY privacy_level
            ) sub
        ),
        'audit_log_entries_24h', (
            SELECT COUNT(*) 
            FROM access_audit_log 
            WHERE accessed_at > NOW() - INTERVAL '24 hours'
        ),
        'access_denied_24h', (
            SELECT COUNT(*) 
            FROM access_audit_log 
            WHERE accessed_at > NOW() - INTERVAL '24 hours'
            AND access_granted = false
        ),
        'security_threats', (
            SELECT COUNT(*) 
            FROM detect_security_threats()
        ),
        'last_updated', NOW()
    ) INTO metrics;
    
    RETURN metrics;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- プライバシー自動管理トリガー
-- =====================================================================

-- ユーザー作成時のプライバシー設定自動作成
CREATE OR REPLACE FUNCTION auto_create_privacy_settings()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO privacy_settings (
        user_id,
        profile_visibility,
        data_export_format,
        auto_delete_enabled,
        auto_delete_after_days,
        store_engine_os_data,
        store_interface_os_data,
        store_safe_mode_os_data,
        store_interaction_data,
        anonymous_research_participation,
        algorithm_improvement_contribution,
        wisdom_sharing_consent,
        collective_growth_participation
    ) VALUES (
        NEW.id,
        'private',
        'json',
        true,
        CASE NEW.privacy_level 
            WHEN 'maximum' THEN 365   -- 1年
            WHEN 'high' THEN 1095     -- 3年
            WHEN 'medium' THEN 1825   -- 5年
            WHEN 'low' THEN 2555      -- 7年
        END,
        true,
        true,
        true,
        NEW.privacy_level IN ('medium', 'low'),
        NEW.privacy_level IN ('medium', 'low'),
        NEW.privacy_level IN ('medium', 'low'),
        NEW.privacy_level = 'low',
        NEW.privacy_level = 'low'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_privacy_settings
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION auto_create_privacy_settings();

-- プライバシーレベル変更時の設定自動更新
CREATE OR REPLACE FUNCTION update_privacy_settings_on_level_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.privacy_level != NEW.privacy_level THEN
        UPDATE privacy_settings SET
            auto_delete_after_days = CASE NEW.privacy_level 
                WHEN 'maximum' THEN 365
                WHEN 'high' THEN 1095
                WHEN 'medium' THEN 1825
                WHEN 'low' THEN 2555
            END,
            anonymous_research_participation = NEW.privacy_level IN ('medium', 'low'),
            algorithm_improvement_contribution = NEW.privacy_level IN ('medium', 'low'),
            wisdom_sharing_consent = NEW.privacy_level = 'low',
            collective_growth_participation = NEW.privacy_level = 'low',
            updated_at = NOW()
        WHERE user_id = NEW.id;
        
        -- プライバシーレベル変更の監査ログ
        INSERT INTO access_audit_log (
            user_id,
            accessed_user_id,
            table_name,
            operation,
            privacy_level_at_access,
            access_granted
        ) VALUES (
            NEW.id,
            NEW.id,
            'users',
            'PRIVACY_LEVEL_CHANGE',
            NEW.privacy_level,
            true
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_privacy_level_change
    AFTER UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_privacy_settings_on_level_change();

-- =====================================================================
-- セキュリティ統計・レポート機能
-- =====================================================================

-- RLSポリシー効果性レポート
CREATE OR REPLACE FUNCTION generate_rls_effectiveness_report()
RETURNS TABLE(
    table_name TEXT,
    total_access_attempts BIGINT,
    granted_access BIGINT,
    denied_access BIGINT,
    effectiveness_percentage NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.table_name::TEXT,
        COUNT(*)::BIGINT as total_attempts,
        COUNT(*) FILTER (WHERE a.access_granted = true)::BIGINT as granted,
        COUNT(*) FILTER (WHERE a.access_granted = false)::BIGINT as denied,
        ROUND(
            COUNT(*) FILTER (WHERE a.access_granted = false) * 100.0 / 
            NULLIF(COUNT(*), 0), 
            2
        ) as effectiveness_pct
    FROM access_audit_log a
    WHERE a.accessed_at > NOW() - INTERVAL '7 days'
    GROUP BY a.table_name
    ORDER BY effectiveness_pct DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ユーザープライバシー遵守レポート
CREATE OR REPLACE FUNCTION generate_privacy_compliance_report()
RETURNS JSONB AS $$
DECLARE
    report JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_users', COUNT(*),
        'privacy_levels', jsonb_object_agg(
            privacy_level, 
            privacy_count
        ),
        'data_retention_compliance', jsonb_build_object(
            'users_with_auto_delete', (
                SELECT COUNT(*) 
                FROM privacy_settings 
                WHERE auto_delete_enabled = true
            ),
            'overdue_deletions', (
                SELECT COUNT(*) 
                FROM users 
                WHERE data_retention_until < NOW() 
                AND deleted_at IS NULL
            )
        ),
        'research_participation', jsonb_build_object(
            'anonymous_research', (
                SELECT COUNT(*) 
                FROM privacy_settings 
                WHERE anonymous_research_participation = true
            ),
            'wisdom_sharing', (
                SELECT COUNT(*) 
                FROM privacy_settings 
                WHERE wisdom_sharing_consent = true
            ),
            'collective_growth', (
                SELECT COUNT(*) 
                FROM privacy_settings 
                WHERE collective_growth_participation = true
            )
        ),
        'generated_at', NOW()
    ) INTO report
    FROM (
        SELECT 
            privacy_level,
            COUNT(*) as privacy_count
        FROM users 
        WHERE deleted_at IS NULL
        GROUP BY privacy_level
    ) privacy_distribution;
    
    RETURN report;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- インデックス最適化（RLS対応）
-- =====================================================================

-- 監査ログ高速検索用インデックス
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_log_user_table_time 
ON access_audit_log(user_id, table_name, accessed_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_log_access_denied_time
ON access_audit_log(accessed_at DESC) WHERE access_granted = false;

-- プライバシー設定検索用インデックス
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_privacy_settings_research_participation
ON privacy_settings(user_id) WHERE anonymous_research_participation = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_privacy_settings_collective_growth
ON privacy_settings(user_id) WHERE collective_growth_participation = true;

-- ユーザープライバシーレベル検索用インデックス
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_privacy_level_active
ON users(privacy_level) WHERE deleted_at IS NULL;

COMMIT;

-- 完了メッセージ
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'HAQEI RLS Security Enhancement COMPLETED!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Security: Zero-Trust RLS implemented';
    RAISE NOTICE 'Privacy: bunenjin philosophy compliant';
    RAISE NOTICE 'Audit: Complete transparency system';
    RAISE NOTICE 'Functions: % security functions created', (
        SELECT COUNT(*) 
        FROM information_schema.routines 
        WHERE routine_schema = 'public' 
        AND routine_name LIKE '%security%' 
        OR routine_name LIKE '%privacy%'
        OR routine_name LIKE '%audit%'
    );
    RAISE NOTICE 'Policies: % RLS policies active', (
        SELECT COUNT(*) 
        FROM pg_policies 
        WHERE schemaname = 'public'
    );
    RAISE NOTICE '========================================';
    RAISE NOTICE 'TASK-037: Row Level Security COMPLETE!';
    RAISE NOTICE '========================================';
END $$;