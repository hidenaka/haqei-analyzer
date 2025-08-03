-- =====================================================================
-- HAQEI Database Schema: 易経64卦システム
-- =====================================================================
-- 目的: 易経の64卦・八卦・384爻の完全なリレーショナルモデリング
-- 哲学: bunenjin思想に基づく古典的智慧の現代的データ構造化
-- 作成: 2025-08-03 by Database Architect Agent (Sub-Agent 1)
-- =====================================================================

-- =====================================================================
-- 1. 八卦基本テーブル (8 Trigrams)
-- =====================================================================

CREATE TABLE trigrams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(10) NOT NULL UNIQUE,           -- 乾、坤、震、巽、坎、離、艮、兌
    name_chinese CHAR(1) NOT NULL UNIQUE,       -- ☰、☷、☳、☴、☵、☲、☶、☱
    binary_value CHAR(3) NOT NULL UNIQUE,       -- 111, 000, 001, 011, 010, 101, 100, 110
    element VARCHAR(10) NOT NULL,               -- 天、地、雷、風、水、火、山、沢
    attribute VARCHAR(20) NOT NULL,             -- 剛健、順従、動、順、陥、麗、止、悦
    direction VARCHAR(10),                      -- 北西、南西、東、南東、北、南、北東、西
    season VARCHAR(10),                         -- 初冬、晩夏、春、初夏、冬、夏、晩冬、秋
    family_role VARCHAR(10),                    -- 父、母、長男、長女、中男、中女、少男、少女
    
    -- bunenjin哲学統合
    philosophical_principle TEXT,               -- 各卦の哲学的原理
    modern_interpretation TEXT,                 -- 現代的解釈
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 八卦基本データ挿入
INSERT INTO trigrams (name, name_chinese, binary_value, element, attribute, direction, season, family_role, philosophical_principle, modern_interpretation) VALUES
('乾', '☰', '111', '天', '剛健', '北西', '初冬', '父', '創造的力・主導性・剛毅', 'リーダーシップ・革新・積極性'),
('坤', '☷', '000', '地', '順従', '南西', '晩夏', '母', '受容性・養育・包容', '協調性・共感・サポート'),
('震', '☳', '001', '雷', '動', '東', '春', '長男', '動的エネルギー・行動力', '実行力・挑戦・エネルギッシュ'),
('巽', '☴', '011', '風', '順', '南東', '初夏', '長女', '浸透力・柔軟性・影響', '適応性・影響力・洞察'),
('坎', '☵', '010', '水', '陥', '北', '冬', '中男', '流動性・困難・智慧', '柔軟性・粘り強さ・深い理解'),
('離', '☲', '101', '火', '麗', '南', '夏', '中女', '明知・美・分離', '知性・美的感覚・識別力'),
('艮', '☶', '100', '山', '止', '北東', '晩冬', '少男', '停止・境界・内省', '慎重さ・内省・境界設定'),
('兌', '☱', '110', '沢', '悦', '西', '秋', '少女', '喜悦・開放・交流', '社交性・楽観性・表現力');

-- =====================================================================
-- 2. 64卦基本テーブル (64 Hexagrams)
-- =====================================================================

CREATE TABLE hexagrams (
    id SERIAL PRIMARY KEY,
    number INTEGER NOT NULL UNIQUE CHECK (number BETWEEN 1 AND 64),
    name VARCHAR(10) NOT NULL UNIQUE,           -- 乾為天、坤為地、水雷屯...
    name_chinese VARCHAR(4) NOT NULL,           -- 中国語表記
    upper_trigram_id INTEGER NOT NULL REFERENCES trigrams(id),
    lower_trigram_id INTEGER NOT NULL REFERENCES trigrams(id),
    
    -- 卦の属性
    judgment TEXT NOT NULL,                     -- 卦辞（判断）
    image TEXT NOT NULL,                        -- 象辞（イメージ）
    
    -- bunenjin哲学的解釈
    philosophical_meaning TEXT NOT NULL,        -- 哲学的意味
    life_guidance TEXT NOT NULL,               -- 人生指導
    business_application TEXT,                  -- ビジネス応用
    relationship_guidance TEXT,                 -- 人間関係指導
    
    -- Triple OS関連付け
    engine_os_relevance INTEGER CHECK (engine_os_relevance BETWEEN 0 AND 10),
    interface_os_relevance INTEGER CHECK (interface_os_relevance BETWEEN 0 AND 10),
    safe_mode_os_relevance INTEGER CHECK (safe_mode_os_relevance BETWEEN 0 AND 10),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(upper_trigram_id, lower_trigram_id)
);

-- =====================================================================
-- 3. 爻（Yao Lines）テーブル - 384爻の完全定義
-- =====================================================================

CREATE TABLE yao_lines (
    id SERIAL PRIMARY KEY,
    hexagram_id INTEGER NOT NULL REFERENCES hexagrams(id),
    position INTEGER NOT NULL CHECK (position BETWEEN 1 AND 6), -- 初爻、二爻、三爻、四爻、五爻、上爻
    line_type VARCHAR(10) NOT NULL CHECK (line_type IN ('陰', '陽')),
    
    -- 爻辞
    text TEXT NOT NULL,                         -- 爻辞原文
    interpretation TEXT NOT NULL,               -- 解釈
    
    -- bunenjin統合解釈
    modern_meaning TEXT NOT NULL,               -- 現代的意味
    action_guidance TEXT NOT NULL,              -- 行動指針
    timing_advice TEXT,                         -- タイミングアドバイス
    
    -- Triple OS影響度
    engine_os_impact INTEGER CHECK (engine_os_impact BETWEEN 0 AND 10),
    interface_os_impact INTEGER CHECK (interface_os_impact BETWEEN 0 AND 10),
    safe_mode_os_impact INTEGER CHECK (safe_mode_os_impact BETWEEN 0 AND 10),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(hexagram_id, position)
);

-- =====================================================================
-- 4. 卦変（Hexagram Transformation）テーブル
-- =====================================================================

CREATE TABLE hexagram_transformations (
    id SERIAL PRIMARY KEY,
    source_hexagram_id INTEGER NOT NULL REFERENCES hexagrams(id),
    target_hexagram_id INTEGER NOT NULL REFERENCES hexagrams(id),
    changing_lines INTEGER[] NOT NULL,          -- 変爻位置の配列 [1,3,5]など
    
    -- 変化の意味
    transformation_meaning TEXT NOT NULL,       -- 変化の意味
    process_guidance TEXT NOT NULL,             -- プロセス指導
    timing_significance TEXT,                   -- タイミング的意義
    
    -- bunenjin哲学的解釈
    philosophical_insight TEXT,                 -- 哲学的洞察
    life_lesson TEXT,                          -- 人生の教訓
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(source_hexagram_id, target_hexagram_id, changing_lines)
);

-- =====================================================================
-- 5. 五行相関テーブル（Five Elements Correlation）
-- =====================================================================

CREATE TABLE five_elements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(10) NOT NULL UNIQUE,           -- 木、火、土、金、水
    color VARCHAR(10),                          -- 青、赤、黄、白、黒
    direction VARCHAR(10),                      -- 東、南、中央、西、北
    season VARCHAR(10),                         -- 春、夏、土用、秋、冬
    
    -- bunenjin統合属性
    personality_trait TEXT,                     -- 性格特性
    business_strength TEXT,                     -- ビジネス強み
    relationship_style TEXT,                    -- 関係性スタイル
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO five_elements (name, color, direction, season, personality_trait, business_strength, relationship_style) VALUES
('木', '青', '東', '春', '成長志向・創造性・柔軟性', '革新・開発・成長戦略', '育成・協力・建設的'),
('火', '赤', '南', '夏', '情熱・表現力・社交性', 'マーケティング・営業・リーダーシップ', '熱意・インスピレーション・明るさ'),
('土', '黄', '中央', '土用', '安定性・信頼性・包容力', '運営・管理・基盤構築', '安心感・支援・調和'),
('金', '白', '西', '秋', '論理性・効率性・完璧主義', '品質管理・システム化・合理化', '公正・規律・明確性'),
('水', '黒', '北', '冬', '適応性・智慧・内省', '戦略・研究・深い分析', '理解・忍耐・深いつながり');

-- =====================================================================
-- 6. 卦と五行の関連テーブル
-- =====================================================================

CREATE TABLE hexagram_five_elements (
    id SERIAL PRIMARY KEY,
    hexagram_id INTEGER NOT NULL REFERENCES hexagrams(id),
    element_id INTEGER NOT NULL REFERENCES five_elements(id),
    relationship_type VARCHAR(20) NOT NULL,     -- primary, secondary, contrary
    influence_strength INTEGER CHECK (influence_strength BETWEEN 1 AND 10),
    
    UNIQUE(hexagram_id, element_id)
);

-- =====================================================================
-- 7. 卦の組み合わせ相性テーブル
-- =====================================================================

CREATE TABLE hexagram_compatibility (
    id SERIAL PRIMARY KEY,
    hexagram1_id INTEGER NOT NULL REFERENCES hexagrams(id),
    hexagram2_id INTEGER NOT NULL REFERENCES hexagrams(id),
    compatibility_type VARCHAR(20) NOT NULL,    -- harmonious, challenging, neutral, transformative
    compatibility_score INTEGER CHECK (compatibility_score BETWEEN 0 AND 100),
    
    -- bunenjin統合解釈
    relationship_dynamics TEXT,                 -- 関係性の力学
    collaborative_potential TEXT,               -- 協力可能性
    growth_opportunities TEXT,                  -- 成長機会
    challenges_and_solutions TEXT,              -- 課題と解決策
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CHECK (hexagram1_id != hexagram2_id),
    UNIQUE(hexagram1_id, hexagram2_id)
);

-- =====================================================================
-- 8. インデックス定義（パフォーマンス最適化）
-- =====================================================================

-- 基本検索インデックス
CREATE INDEX idx_hexagrams_number ON hexagrams(number);
CREATE INDEX idx_hexagrams_name ON hexagrams(name);
CREATE INDEX idx_hexagrams_trigrams ON hexagrams(upper_trigram_id, lower_trigram_id);

-- 爻検索インデックス
CREATE INDEX idx_yao_lines_hexagram_position ON yao_lines(hexagram_id, position);
CREATE INDEX idx_yao_lines_type ON yao_lines(line_type);

-- Triple OS関連インデックス
CREATE INDEX idx_hexagrams_engine_os ON hexagrams(engine_os_relevance) WHERE engine_os_relevance > 5;
CREATE INDEX idx_hexagrams_interface_os ON hexagrams(interface_os_relevance) WHERE interface_os_relevance > 5;
CREATE INDEX idx_hexagrams_safe_mode_os ON hexagrams(safe_mode_os_relevance) WHERE safe_mode_os_relevance > 5;

-- 変化・相性検索インデックス
CREATE INDEX idx_transformations_source ON hexagram_transformations(source_hexagram_id);
CREATE INDEX idx_transformations_target ON hexagram_transformations(target_hexagram_id);
CREATE INDEX idx_compatibility_score ON hexagram_compatibility(compatibility_score);

-- =====================================================================
-- 9. 関数定義（ビジネスロジック）
-- =====================================================================

-- 卦から八卦を取得する関数
CREATE OR REPLACE FUNCTION get_hexagram_trigrams(hex_id INTEGER)
RETURNS TABLE(upper_trigram TEXT, lower_trigram TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ut.name as upper_trigram,
        lt.name as lower_trigram
    FROM hexagrams h
    JOIN trigrams ut ON h.upper_trigram_id = ut.id
    JOIN trigrams lt ON h.lower_trigram_id = lt.id
    WHERE h.id = hex_id;
END;
$$ LANGUAGE plpgsql;

-- Triple OS適合度計算関数
CREATE OR REPLACE FUNCTION calculate_triple_os_fitness(hex_id INTEGER)
RETURNS TABLE(engine_fitness NUMERIC, interface_fitness NUMERIC, safe_mode_fitness NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        h.engine_os_relevance::NUMERIC / 10.0 as engine_fitness,
        h.interface_os_relevance::NUMERIC / 10.0 as interface_fitness,
        h.safe_mode_os_relevance::NUMERIC / 10.0 as safe_mode_fitness
    FROM hexagrams h
    WHERE h.id = hex_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================
-- 10. ビュー定義（複雑クエリの簡素化）
-- =====================================================================

-- 卦の詳細情報ビュー
CREATE VIEW hexagram_details AS
SELECT 
    h.id,
    h.number,
    h.name,
    h.name_chinese,
    ut.name as upper_trigram,
    lt.name as lower_trigram,
    h.judgment,
    h.image,
    h.philosophical_meaning,
    h.life_guidance,
    h.engine_os_relevance,
    h.interface_os_relevance,
    h.safe_mode_os_relevance
FROM hexagrams h
JOIN trigrams ut ON h.upper_trigram_id = ut.id
JOIN trigrams lt ON h.lower_trigram_id = lt.id;

-- Triple OS適合度上位ビュー
CREATE VIEW top_engine_os_hexagrams AS
SELECT * FROM hexagram_details 
WHERE engine_os_relevance >= 8 
ORDER BY engine_os_relevance DESC;

CREATE VIEW top_interface_os_hexagrams AS
SELECT * FROM hexagram_details 
WHERE interface_os_relevance >= 8 
ORDER BY interface_os_relevance DESC;

CREATE VIEW top_safe_mode_os_hexagrams AS
SELECT * FROM hexagram_details 
WHERE safe_mode_os_relevance >= 8 
ORDER BY safe_mode_os_relevance DESC;

-- =====================================================================
-- 11. トリガー関数（データ整合性保証）
-- =====================================================================

-- 更新日時自動更新トリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 各テーブルに更新日時トリガー適用
CREATE TRIGGER update_trigrams_updated_at 
    BEFORE UPDATE ON trigrams 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hexagrams_updated_at 
    BEFORE UPDATE ON hexagrams 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_yao_lines_updated_at 
    BEFORE UPDATE ON yao_lines 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================
-- 12. コメント追加（ドキュメント化）
-- =====================================================================

COMMENT ON TABLE trigrams IS '八卦基本情報 - 易経の基礎となる8つの卦';
COMMENT ON TABLE hexagrams IS '64卦詳細情報 - 易経の核となる64の卦';
COMMENT ON TABLE yao_lines IS '384爻情報 - 各卦の6つの爻線（64×6=384）';
COMMENT ON TABLE hexagram_transformations IS '卦変情報 - 爻の変化による卦の変転';
COMMENT ON TABLE five_elements IS '五行情報 - 木火土金水の基本属性';
COMMENT ON TABLE hexagram_compatibility IS '卦間相性 - 64卦間の調和・対立関係';

COMMENT ON COLUMN hexagrams.engine_os_relevance IS 'Engine OS（価値観システム）との関連度 0-10';
COMMENT ON COLUMN hexagrams.interface_os_relevance IS 'Interface OS（社会適応システム）との関連度 0-10';
COMMENT ON COLUMN hexagrams.safe_mode_os_relevance IS 'Safe Mode OS（防御システム）との関連度 0-10';

-- =====================================================================
-- 13. データ検証制約
-- =====================================================================

-- 爻の総数制約（64卦 × 6爻 = 384爻）
ALTER TABLE yao_lines ADD CONSTRAINT check_total_yao_count 
    CHECK ((SELECT COUNT(*) FROM yao_lines) <= 384);

-- 卦の重複組み合わせ防止
ALTER TABLE hexagram_compatibility ADD CONSTRAINT check_hexagram_pair_order
    CHECK (hexagram1_id < hexagram2_id);

-- =====================================================================
-- 完了確認
-- =====================================================================

-- スキーマ検証クエリ
DO $$
BEGIN
    RAISE NOTICE '易経64卦システムスキーマ作成完了';
    RAISE NOTICE 'テーブル数: %', (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%trigram%' OR table_name LIKE '%hexagram%' OR table_name LIKE '%yao%' OR table_name LIKE '%element%');
    RAISE NOTICE 'インデックス数: %', (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND indexname LIKE '%trigram%' OR indexname LIKE '%hexagram%' OR indexname LIKE '%yao%');
    RAISE NOTICE 'ビュー数: %', (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public' AND table_name LIKE '%hexagram%');
END $$;