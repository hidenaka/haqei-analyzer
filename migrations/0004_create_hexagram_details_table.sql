CREATE TABLE hexagram_details (
    id INTEGER PRIMARY KEY,
    hexagram_id INTEGER NOT NULL,
    detail_type TEXT NOT NULL,
    detail_text TEXT NOT NULL,
    FOREIGN KEY (hexagram_id) REFERENCES hexagrams(id)
);