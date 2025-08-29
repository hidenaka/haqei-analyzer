CREATE TABLE hexagram_lines (
    id INTEGER PRIMARY KEY,
    hexagram_id INTEGER NOT NULL,
    line_number INTEGER NOT NULL,
    line_text TEXT NOT NULL,
    line_value INTEGER NOT NULL,
    FOREIGN KEY (hexagram_id) REFERENCES hexagrams(id)
);