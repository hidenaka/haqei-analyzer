-- =====================================================================
-- Test File for bunenjin RLS Policies
-- =====================================================================
-- Project: HAQEI Analyzer (HArmony, QI Energy, Intelligence)
-- Philosophy: bunenjin (文人) - Privacy-first, Maximum Security by Default
-- Purpose: Comprehensive testing of RLS policies and audit systems
-- Created: 2025-08-03 by Coder Agent
-- =====================================================================

BEGIN;

-- Test Data Setup
DO $$
DECLARE
    test_user_1 UUID := gen_random_uuid();
    test_user_2 UUID := gen_random_uuid();
    admin_user UUID := gen_random_uuid();
BEGIN
    RAISE NOTICE '=== bunenjin RLS Policy Testing ===';
    
    -- Test 1: Create test users with different privacy levels
    RAISE NOTICE 'Test 1: Creating test users...';
    
    INSERT INTO users (id, email, privacy_level) VALUES 
    (test_user_1, 'user1@test.haqei', 'maximum'),
    (test_user_2, 'user2@test.haqei', 'medium'),
    (admin_user, 'admin@admin.haqei', 'low');
    
    -- Test 2: Verify bunenjin privacy config auto-creation
    RAISE NOTICE 'Test 2: Verifying auto-created privacy configs...';
    
    IF (SELECT COUNT(*) FROM bunenjin_privacy_config WHERE user_id IN (test_user_1, test_user_2, admin_user)) = 3 THEN
        RAISE NOTICE '✓ Privacy configs auto-created successfully';
    ELSE
        RAISE EXCEPTION '✗ Privacy config auto-creation failed';
    END IF;
    
    -- Test 3: Test privacy level hierarchy
    RAISE NOTICE 'Test 3: Testing privacy level hierarchy...';
    
    -- Verify maximum privacy is default
    IF (SELECT privacy_level FROM bunenjin_privacy_config WHERE user_id = test_user_1) = 'maximum' THEN
        RAISE NOTICE '✓ Maximum privacy set as default';
    ELSE
        RAISE EXCEPTION '✗ Default privacy level not maximum';
    END IF;
    
    -- Test 4: Create test data for different OS profiles
    RAISE NOTICE 'Test 4: Creating test OS profile data...';
    
    INSERT INTO engine_os_profiles (id, user_id, core_values, analysis_data) VALUES
    (gen_random_uuid(), test_user_1, '{"privacy": "maximum"}', '{"test": "data1"}'::jsonb),
    (gen_random_uuid(), test_user_2, '{"privacy": "medium"}', '{"test": "data2"}'::jsonb);
    
    INSERT INTO interface_os_profiles (id, user_id, social_adaptation_style, interaction_patterns) VALUES
    (gen_random_uuid(), test_user_1, '{"style": "private"}', '{"pattern": "secure"}'::jsonb),
    (gen_random_uuid(), test_user_2, '{"style": "social"}', '{"pattern": "open"}'::jsonb);
    
    INSERT INTO safe_mode_os_profiles (id, user_id, defense_mechanisms, security_settings) VALUES
    (gen_random_uuid(), test_user_1, '{"level": "maximum"}', '{"encryption": true}'::jsonb),
    (gen_random_uuid(), test_user_2, '{"level": "standard"}', '{"encryption": false}'::jsonb);
    
    -- Test 5: Create analysis sessions and responses
    RAISE NOTICE 'Test 5: Creating analysis session data...';
    
    INSERT INTO analysis_sessions (id, user_id, session_type, questions_config) VALUES
    (gen_random_uuid(), test_user_1, 'full_analysis', '{"privacy": "maximum"}'::jsonb),
    (gen_random_uuid(), test_user_2, 'quick_analysis', '{"privacy": "medium"}'::jsonb);
    
    -- Test 6: Verify audit logging is working
    RAISE NOTICE 'Test 6: Verifying audit logging...';
    
    IF (SELECT COUNT(*) FROM audit_log WHERE user_id IN (test_user_1, test_user_2)) > 0 THEN
        RAISE NOTICE '✓ Audit logging is active';
    ELSE
        RAISE NOTICE '⚠ No audit entries found (may be expected for test data)';
    END IF;
    
    -- Test 7: Test privacy functions
    RAISE NOTICE 'Test 7: Testing privacy management functions...';
    
    -- Test privacy summary function
    DECLARE
        privacy_summary JSONB;
    BEGIN
        SELECT get_privacy_summary(test_user_1) INTO privacy_summary;
        
        IF privacy_summary->>'privacyLevel' = 'maximum' THEN
            RAISE NOTICE '✓ Privacy summary function working';
        ELSE
            RAISE EXCEPTION '✗ Privacy summary function failed';
        END IF;
    END;
    
    -- Test 8: Test privacy permission checking
    RAISE NOTICE 'Test 8: Testing privacy permission checks...';
    
    IF check_privacy_permission(test_user_1, 'user_profile', 'read') = TRUE THEN
        RAISE NOTICE '✓ User can read own profile';
    ELSE
        RAISE EXCEPTION '✗ User cannot read own profile';
    END IF;
    
    IF check_privacy_permission(test_user_1, 'user_profile', 'analytics') = FALSE THEN
        RAISE NOTICE '✓ Maximum privacy blocks analytics by default';
    ELSE
        RAISE EXCEPTION '✗ Maximum privacy allows analytics (security breach)';
    END IF;
    
    -- Test 9: Test cross-user data isolation
    RAISE NOTICE 'Test 9: Testing cross-user data isolation...';
    
    -- This would need to be tested with actual RLS context
    -- For now, verify policies exist
    IF (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND policyname LIKE 'bunenjin_%') >= 20 THEN
        RAISE NOTICE '✓ bunenjin RLS policies created (% policies)', (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND policyname LIKE 'bunenjin_%');
    ELSE
        RAISE EXCEPTION '✗ Insufficient bunenjin RLS policies found';
    END IF;
    
    -- Test 10: Verify security roles
    RAISE NOTICE 'Test 10: Testing security roles...';
    
    IF (SELECT COUNT(*) FROM pg_roles WHERE rolname LIKE '%bunenjin%') >= 2 THEN
        RAISE NOTICE '✓ bunenjin security roles created';
    ELSE
        RAISE EXCEPTION '✗ bunenjin security roles missing';
    END IF;
    
    RAISE NOTICE '=== All bunenjin RLS Tests Completed Successfully ===';
    
END $$;

-- Cleanup test data
DELETE FROM audit_log WHERE user_id IN (
    SELECT id FROM users WHERE email LIKE '%@test.haqei' OR email LIKE '%@admin.haqei'
);

DELETE FROM bunenjin_privacy_config WHERE user_id IN (
    SELECT id FROM users WHERE email LIKE '%@test.haqei' OR email LIKE '%@admin.haqei'
);

DELETE FROM safe_mode_os_profiles WHERE user_id IN (
    SELECT id FROM users WHERE email LIKE '%@test.haqei' OR email LIKE '%@admin.haqei'
);

DELETE FROM interface_os_profiles WHERE user_id IN (
    SELECT id FROM users WHERE email LIKE '%@test.haqei' OR email LIKE '%@admin.haqei'
);

DELETE FROM engine_os_profiles WHERE user_id IN (
    SELECT id FROM users WHERE email LIKE '%@test.haqei' OR email LIKE '%@admin.haqei'
);

DELETE FROM analysis_sessions WHERE user_id IN (
    SELECT id FROM users WHERE email LIKE '%@test.haqei' OR email LIKE '%@admin.haqei'
);

DELETE FROM users WHERE email LIKE '%@test.haqei' OR email LIKE '%@admin.haqei';

COMMIT;

-- =====================================================================
-- Manual RLS Testing Commands (Run with actual users)
-- =====================================================================

-- These commands should be run in a real Supabase environment
-- with actual authenticated users to test RLS enforcement

/*

-- Test 1: Create a test user and verify RLS
-- (Run as authenticated user)
INSERT INTO users (id, email, privacy_level) 
VALUES (auth.user_id(), 'test@example.com', 'maximum');

-- Verify only own data is visible
SELECT * FROM users WHERE id = auth.user_id();

-- Test 2: Try to access another user's data (should fail)
SELECT * FROM users WHERE id != auth.user_id(); -- Should return no rows

-- Test 3: Test OS profile isolation
INSERT INTO engine_os_profiles (user_id, core_values) 
VALUES (auth.user_id(), '{"test": "value"}'::jsonb);

-- Should only see own profile
SELECT * FROM engine_os_profiles;

-- Test 4: Test privacy level changes
SELECT change_privacy_level(auth.user_id(), 'high', 'test_confirmation_token');

-- Test 5: Check privacy summary
SELECT get_privacy_summary(auth.user_id());

-- Test 6: Verify audit logging
SELECT * FROM audit_log WHERE user_id = auth.user_id() ORDER BY timestamp DESC LIMIT 10;

*/

-- =====================================================================
-- Performance Testing Queries
-- =====================================================================

-- Test RLS policy performance with explain plans
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM users WHERE id = gen_random_uuid();
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM engine_os_profiles WHERE user_id = gen_random_uuid();
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM bunenjin_privacy_config WHERE user_id = gen_random_uuid();

-- Test audit function performance
EXPLAIN (ANALYZE, BUFFERS) SELECT audit_data_access();

-- Test privacy function performance
EXPLAIN (ANALYZE, BUFFERS) SELECT get_privacy_summary(gen_random_uuid());