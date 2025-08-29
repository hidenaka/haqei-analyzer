CREATE TABLE yaoci_lines (
    id INTEGER PRIMARY KEY,
    hexagram_id INTEGER NOT NULL,
    line_number INTEGER NOT NULL,
    yaoci_text TEXT NOT NULL,
    FOREIGN KEY (hexagram_id) REFERENCES hexagrams(id)
);