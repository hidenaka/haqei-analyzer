-- =====================================================================
-- HAQEI Supabase Storage Management Setup
-- =====================================================================
-- プロジェクト: HAQEI Analyzer (HArmony, QI Energy, Intelligence)
-- TASK-040: Supabase Storage設定の完全実装
-- ストレージ: bunenjin哲学準拠のファイル管理システム
-- 作成: 2025-08-03 - Storage統合完了版
-- =====================================================================

-- Migration 004: Storage設定とファイル管理システム
-- 1. Storageバケット設定
-- 2. ファイルアクセス制御（RLS）
-- 3. ファイルメタデータ管理
-- 4. 自動バックアップ・クリーンアップ

BEGIN;

-- =====================================================================
-- Storage Bucket作成（Supabase Dashboard実行推奨）
-- =====================================================================

-- メインバケット：haqei-user-data
-- 以下をSupabase DashboardのStorageセクションで実行：
-- 1. バケット名: haqei-user-data
-- 2. パブリック: false (プライベート)
-- 3. AVIF変換: false
-- 4. ファイルサイズ制限: 10MB

-- =====================================================================
-- ファイルメタデータ管理テーブル
-- =====================================================================

-- ユーザーファイル管理テーブル
CREATE TABLE IF NOT EXISTS user_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- ファイル基本情報
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL UNIQUE,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    mime_type VARCHAR(100),
    
    -- カテゴリ・分類
    category VARCHAR(50) NOT NULL DEFAULT 'documents', -- results, documents, exports, backups
    subcategory VARCHAR(50),
    tags TEXT[],
    
    -- メタデータ
    description TEXT,
    analysis_session_id UUID REFERENCES analysis_sessions(id) ON DELETE SET NULL,
    is_analysis_result BOOLEAN DEFAULT false,
    is_backup BOOLEAN DEFAULT false,
    
    -- アクセス制御
    privacy_level VARCHAR(20) DEFAULT 'private', -- private, shared, public
    shared_with UUID[], -- ユーザーIDの配列
    share_token VARCHAR(255) UNIQUE,
    share_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Storage情報
    storage_bucket VARCHAR(100) DEFAULT 'haqei-user-data',
    storage_object_id TEXT,
    checksum TEXT,
    
    -- bunenjin統合
    wisdom_shared BOOLEAN DEFAULT false,
    collective_growth_contribution BOOLEAN DEFAULT false,
    
    -- 監査情報
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    download_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ファイルバージョン管理テーブル
CREATE TABLE IF NOT EXISTS file_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID NOT NULL REFERENCES user_files(id) ON DELETE CASCADE,
    
    -- バージョン情報
    version_number INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    checksum TEXT NOT NULL,
    
    -- 変更情報
    change_description TEXT,
    changed_by UUID REFERENCES users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(file_id, version_number)
);

-- ストレージ使用量追跡テーブル
CREATE TABLE IF NOT EXISTS storage_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- 使用量統計
    total_files INTEGER DEFAULT 0,
    total_size BIGINT DEFAULT 0,
    
    -- カテゴリ別使用量
    results_size BIGINT DEFAULT 0,
    documents_size BIGINT DEFAULT 0,
    exports_size BIGINT DEFAULT 0,
    backups_size BIGINT DEFAULT 0,
    
    -- 制限・クォータ
    storage_limit BIGINT DEFAULT 104857600, -- 100MB
    file_count_limit INTEGER DEFAULT 1000,
    
    -- 更新情報
    last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- =====================================================================
-- Row Level Security for Storage
-- =====================================================================

-- user_filesテーブルのRLS有効化
ALTER TABLE user_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_usage ENABLE ROW LEVEL SECURITY;

-- ファイルアクセスポリシー（基本）
CREATE POLICY user_files_owner_access ON user_files
FOR ALL USING (
    user_id = COALESCE(auth.uid(), current_setting('app.current_user_id', true)::UUID)
);

-- ファイル共有ポリシー
CREATE POLICY user_files_shared_access ON user_files
FOR SELECT USING (
    user_id = COALESCE(auth.uid(), current_setting('app.current_user_id', true)::UUID)
    OR (
        privacy_level = 'shared'
        AND (
            COALESCE(auth.uid(), current_setting('app.current_user_id', true)::UUID) = ANY(shared_with)
            OR (
                share_token IS NOT NULL 
                AND share_expires_at > NOW()
                AND current_setting('app.share_token', true) = share_token
            )
        )
    )
    OR (
        privacy_level = 'public'
        AND deleted_at IS NULL
    )
);

-- ファイルバージョン履歴アクセス
CREATE POLICY file_versions_owner_access ON file_versions
FOR ALL USING (
    file_id IN (
        SELECT id FROM user_files 
        WHERE user_id = COALESCE(auth.uid(), current_setting('app.current_user_id', true)::UUID)
    )
);

-- ストレージ使用量アクセス
CREATE POLICY storage_usage_owner_access ON storage_usage
FOR ALL USING (
    user_id = COALESCE(auth.uid(), current_setting('app.current_user_id', true)::UUID)
);

-- =====================================================================
-- Storage管理関数
-- =====================================================================

-- ファイル登録関数
CREATE OR REPLACE FUNCTION register_user_file(
    p_user_id UUID,
    p_file_name VARCHAR,
    p_file_path TEXT,
    p_file_size BIGINT,
    p_file_type VARCHAR,
    p_category VARCHAR DEFAULT 'documents',
    p_mime_type VARCHAR DEFAULT NULL,
    p_analysis_session_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    file_id UUID;
    current_usage storage_usage%ROWTYPE;
BEGIN
    -- ストレージ制限チェック
    SELECT * INTO current_usage
    FROM storage_usage 
    WHERE user_id = p_user_id;
    
    IF current_usage.user_id IS NULL THEN
        -- 初回利用時の使用量レコード作成
        INSERT INTO storage_usage (user_id) VALUES (p_user_id);
        SELECT * INTO current_usage FROM storage_usage WHERE user_id = p_user_id;
    END IF;
    
    -- サイズ制限チェック
    IF (current_usage.total_size + p_file_size) > current_usage.storage_limit THEN
        RAISE EXCEPTION 'Storage limit exceeded. Current: %MB, Limit: %MB', 
            ROUND((current_usage.total_size + p_file_size) / 1048576.0, 2),
            ROUND(current_usage.storage_limit / 1048576.0, 2);
    END IF;
    
    -- ファイル数制限チェック
    IF current_usage.total_files >= current_usage.file_count_limit THEN
        RAISE EXCEPTION 'File count limit exceeded. Limit: %', current_usage.file_count_limit;
    END IF;
    
    -- ファイル登録
    INSERT INTO user_files (
        user_id,
        file_name,
        file_path,
        file_size,
        file_type,
        mime_type,
        category,
        analysis_session_id,
        is_analysis_result,
        checksum
    ) VALUES (
        p_user_id,
        p_file_name,
        p_file_path,
        p_file_size,
        p_file_type,
        p_mime_type,
        p_category,
        p_analysis_session_id,
        p_analysis_session_id IS NOT NULL,
        md5(p_file_path || p_file_size::text || extract(epoch from NOW())::text)
    ) RETURNING id INTO file_id;
    
    -- 使用量更新
    PERFORM update_storage_usage(p_user_id);
    
    -- 監査ログ
    INSERT INTO access_audit_log (
        user_id,
        accessed_user_id,
        table_name,
        operation,
        row_id,
        access_granted
    ) VALUES (
        p_user_id,
        p_user_id,
        'user_files',
        'REGISTER_FILE',
        file_id,
        true
    );
    
    RETURN file_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ストレージ使用量更新関数
CREATE OR REPLACE FUNCTION update_storage_usage(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
    usage_stats RECORD;
BEGIN
    -- 使用量統計の計算
    SELECT 
        COUNT(*) as total_files,
        COALESCE(SUM(file_size), 0) as total_size,
        COALESCE(SUM(CASE WHEN category = 'results' THEN file_size ELSE 0 END), 0) as results_size,
        COALESCE(SUM(CASE WHEN category = 'documents' THEN file_size ELSE 0 END), 0) as documents_size,
        COALESCE(SUM(CASE WHEN category = 'exports' THEN file_size ELSE 0 END), 0) as exports_size,
        COALESCE(SUM(CASE WHEN category = 'backups' THEN file_size ELSE 0 END), 0) as backups_size
    INTO usage_stats
    FROM user_files 
    WHERE user_id = p_user_id 
    AND deleted_at IS NULL;
    
    -- 使用量テーブル更新
    INSERT INTO storage_usage (
        user_id,
        total_files,
        total_size,
        results_size,
        documents_size,
        exports_size,
        backups_size,
        last_calculated_at,
        updated_at
    ) VALUES (
        p_user_id,
        usage_stats.total_files,
        usage_stats.total_size,
        usage_stats.results_size,
        usage_stats.documents_size,
        usage_stats.exports_size,
        usage_stats.backups_size,
        NOW(),
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        total_files = EXCLUDED.total_files,
        total_size = EXCLUDED.total_size,
        results_size = EXCLUDED.results_size,
        documents_size = EXCLUDED.documents_size,
        exports_size = EXCLUDED.exports_size,
        backups_size = EXCLUDED.backups_size,
        last_calculated_at = EXCLUDED.last_calculated_at,
        updated_at = EXCLUDED.updated_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ファイル削除関数（論理削除）
CREATE OR REPLACE FUNCTION delete_user_file(
    p_user_id UUID,
    p_file_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    file_record user_files%ROWTYPE;
BEGIN
    -- ファイル所有権確認
    SELECT * INTO file_record
    FROM user_files 
    WHERE id = p_file_id 
    AND user_id = p_user_id 
    AND deleted_at IS NULL;
    
    IF file_record.id IS NULL THEN
        RETURN false;
    END IF;
    
    -- 論理削除
    UPDATE user_files 
    SET 
        deleted_at = NOW(),
        updated_at = NOW()
    WHERE id = p_file_id;
    
    -- 使用量更新
    PERFORM update_storage_usage(p_user_id);
    
    -- 監査ログ
    INSERT INTO access_audit_log (
        user_id,
        accessed_user_id,
        table_name,
        operation,
        row_id,
        access_granted
    ) VALUES (
        p_user_id,
        p_user_id,
        'user_files',
        'DELETE_FILE',
        p_file_id,
        true
    );
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ファイル共有トークン生成関数
CREATE OR REPLACE FUNCTION create_file_share_token(
    p_user_id UUID,
    p_file_id UUID,
    p_expires_hours INTEGER DEFAULT 24
)
RETURNS TEXT AS $$
DECLARE
    share_token TEXT;
    file_record user_files%ROWTYPE;
BEGIN
    -- ファイル所有権確認
    SELECT * INTO file_record
    FROM user_files 
    WHERE id = p_file_id 
    AND user_id = p_user_id 
    AND deleted_at IS NULL;
    
    IF file_record.id IS NULL THEN
        RAISE EXCEPTION 'File not found or access denied';
    END IF;
    
    -- 共有トークン生成
    share_token := encode(gen_random_bytes(32), 'base64');
    
    -- ファイル情報更新
    UPDATE user_files 
    SET 
        privacy_level = 'shared',
        share_token = share_token,
        share_expires_at = NOW() + (p_expires_hours || ' hours')::INTERVAL,
        updated_at = NOW()
    WHERE id = p_file_id;
    
    -- 監査ログ
    INSERT INTO access_audit_log (
        user_id,
        accessed_user_id,
        table_name,
        operation,
        row_id,
        access_granted
    ) VALUES (
        p_user_id,
        p_user_id,
        'user_files',
        'CREATE_SHARE_TOKEN',
        p_file_id,
        true
    );
    
    RETURN share_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- 自動バックアップ・クリーンアップ
-- =====================================================================

-- 古いファイルの自動クリーンアップ
CREATE OR REPLACE FUNCTION cleanup_old_files()
RETURNS INTEGER AS $$
DECLARE
    cleanup_count INTEGER := 0;
    user_record RECORD;
BEGIN
    -- ユーザー別にクリーンアップ実行
    FOR user_record IN 
        SELECT DISTINCT u.id, u.privacy_level, ps.auto_delete_after_days
        FROM users u
        LEFT JOIN privacy_settings ps ON u.id = ps.user_id
        WHERE u.deleted_at IS NULL
    LOOP
        -- プライバシー設定に基づく自動削除
        UPDATE user_files 
        SET deleted_at = NOW()
        WHERE user_id = user_record.id
        AND deleted_at IS NULL
        AND created_at < NOW() - (user_record.auto_delete_after_days || ' days')::INTERVAL;
        
        GET DIAGNOSTICS cleanup_count = cleanup_count + ROW_COUNT;
    END LOOP;
    
    -- 期限切れ共有トークンのクリーンアップ
    UPDATE user_files 
    SET 
        privacy_level = 'private',
        share_token = NULL,
        share_expires_at = NULL
    WHERE share_expires_at < NOW();
    
    RETURN cleanup_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 分析結果の自動バックアップ
CREATE OR REPLACE FUNCTION auto_backup_analysis_results()
RETURNS INTEGER AS $$
DECLARE
    backup_count INTEGER := 0;
    analysis_record RECORD;
    backup_data JSONB;
BEGIN
    -- 未バックアップの完了済み分析セッションを検索
    FOR analysis_record IN
        SELECT 
            a.*,
            u.privacy_level
        FROM analysis_sessions a
        JOIN users u ON a.user_id = u.id
        WHERE a.completion_status = 'completed'
        AND a.completed_at > NOW() - INTERVAL '24 hours'
        AND NOT EXISTS (
            SELECT 1 FROM user_files uf 
            WHERE uf.analysis_session_id = a.id 
            AND uf.is_backup = true
            AND uf.deleted_at IS NULL
        )
    LOOP
        -- 分析結果データの構築
        SELECT jsonb_build_object(
            'session_id', analysis_record.id,
            'user_id', analysis_record.user_id,
            'analysis_data', analysis_record.vue_session_data,
            'triple_os_summary', jsonb_build_object(
                'harmony_score', analysis_record.overall_harmony_score,
                'integration_level', analysis_record.integration_level,
                'primary_hexagram', analysis_record.primary_life_hexagram_id
            ),
            'metadata', jsonb_build_object(
                'completed_at', analysis_record.completed_at,
                'duration_minutes', analysis_record.duration_minutes,
                'questions_answered', analysis_record.questions_answered,
                'backup_created_at', NOW()
            )
        ) INTO backup_data;
        
        -- バックアップファイル登録
        INSERT INTO user_files (
            user_id,
            file_name,
            file_path,
            file_size,
            file_type,
            category,
            analysis_session_id,
            is_analysis_result,
            is_backup,
            description,
            privacy_level
        ) VALUES (
            analysis_record.user_id,
            'analysis_backup_' || analysis_record.id || '_' || to_char(NOW(), 'YYYYMMDD_HH24MISS') || '.json',
            'backups/analysis_' || analysis_record.id || '.json',
            length(backup_data::text),
            'json',
            'backups',
            analysis_record.id,
            true,
            true,
            'Automatic backup of completed analysis session',
            CASE analysis_record.privacy_level 
                WHEN 'maximum' THEN 'private'
                WHEN 'high' THEN 'private'
                WHEN 'medium' THEN 'shared'
                WHEN 'low' THEN 'shared'
            END
        );
        
        backup_count := backup_count + 1;
    END LOOP;
    
    RETURN backup_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- ストレージ監視・レポート
-- =====================================================================

-- ストレージ使用状況レポート
CREATE OR REPLACE FUNCTION generate_storage_usage_report()
RETURNS JSONB AS $$
DECLARE
    report JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_users', (SELECT COUNT(*) FROM storage_usage),
        'total_files', (SELECT SUM(total_files) FROM storage_usage),
        'total_storage_used', (SELECT SUM(total_size) FROM storage_usage),
        'average_usage_per_user', (
            SELECT ROUND(AVG(total_size) / 1048576.0, 2) 
            FROM storage_usage 
            WHERE total_files > 0
        ),
        'storage_distribution', (
            SELECT jsonb_object_agg(
                usage_tier,
                user_count
            )
            FROM (
                SELECT 
                    CASE 
                        WHEN total_size = 0 THEN 'empty'
                        WHEN total_size < 1048576 THEN 'under_1mb'
                        WHEN total_size < 10485760 THEN '1mb_to_10mb'
                        WHEN total_size < 52428800 THEN '10mb_to_50mb'
                        ELSE 'over_50mb'
                    END as usage_tier,
                    COUNT(*) as user_count
                FROM storage_usage
                GROUP BY usage_tier
            ) tier_stats
        ),
        'category_breakdown', (
            SELECT jsonb_object_agg(
                category_name,
                total_size_mb
            )
            FROM (
                SELECT 
                    'results' as category_name,
                    ROUND(SUM(results_size) / 1048576.0, 2) as total_size_mb
                FROM storage_usage
                UNION ALL
                SELECT 
                    'documents',
                    ROUND(SUM(documents_size) / 1048576.0, 2)
                FROM storage_usage
                UNION ALL
                SELECT 
                    'exports',
                    ROUND(SUM(exports_size) / 1048576.0, 2)
                FROM storage_usage
                UNION ALL
                SELECT 
                    'backups',
                    ROUND(SUM(backups_size) / 1048576.0, 2)
                FROM storage_usage
            ) category_stats
        ),
        'generated_at', NOW()
    ) INTO report;
    
    RETURN report;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- インデックス最適化
-- =====================================================================

-- ファイル検索最適化インデックス
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_files_user_category_time
ON user_files(user_id, category, created_at DESC) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_files_analysis_session
ON user_files(analysis_session_id) WHERE analysis_session_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_files_share_token
ON user_files(share_token) WHERE share_token IS NOT NULL;

-- ストレージ使用量検索インデックス
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_storage_usage_size_desc
ON storage_usage(total_size DESC);

-- ファイルバージョン履歴インデックス
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_file_versions_file_version
ON file_versions(file_id, version_number DESC);

-- =====================================================================
-- 定期実行ジョブ設定（pg_cron拡張使用）
-- =====================================================================

-- 日次クリーンアップ（毎日午前3時）
SELECT cron.schedule('storage-daily-cleanup', '0 3 * * *', 'SELECT cleanup_old_files();');

-- 分析結果自動バックアップ（6時間ごと）
SELECT cron.schedule('analysis-auto-backup', '0 */6 * * *', 'SELECT auto_backup_analysis_results();');

-- 使用量統計更新（1時間ごと）
SELECT cron.schedule('storage-usage-update', '0 * * * *', 
    'SELECT update_storage_usage(id) FROM users WHERE deleted_at IS NULL;');

COMMIT;

-- 完了メッセージ
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'HAQEI Storage Management COMPLETED!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Storage: Supabase Storage integrated';
    RAISE NOTICE 'Security: RLS-protected file access';
    RAISE NOTICE 'Features: Auto-backup & cleanup enabled';
    RAISE NOTICE 'Tables: % storage tables created', (
        SELECT COUNT(*) 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND (table_name LIKE '%file%' OR table_name LIKE '%storage%')
    );
    RAISE NOTICE 'Functions: % storage functions created', (
        SELECT COUNT(*) 
        FROM information_schema.routines 
        WHERE routine_schema = 'public' 
        AND (routine_name LIKE '%file%' OR routine_name LIKE '%storage%')
    );
    RAISE NOTICE '========================================';
    RAISE NOTICE 'TASK-040: Supabase Storage COMPLETE!';
    RAISE NOTICE '========================================';
END $$;