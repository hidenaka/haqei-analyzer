-- Migration UP
CREATE TABLE IF NOT EXISTS lines_384 (
    id INTEGER PRIMARY KEY,
    hexagram_id INTEGER NOT NULL,
    line_number INTEGER NOT NULL,
    keywords TEXT NOT NULL,
    interpretation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (line_number BETWEEN 1 AND 6),
    CHECK (hexagram_id BETWEEN 1 AND 64)
);

-- Migration DOWN (ロールバック)
DROP TABLE IF EXISTS lines_384;