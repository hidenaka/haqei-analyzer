CREATE TABLE hexagrams (
    id INTEGER PRIMARY KEY,
    king_wen_number INTEGER NOT NULL,
    english_name TEXT NOT NULL,
    chinese_name TEXT NOT NULL,
    pinyin_name TEXT NOT NULL,
    lower_trigram TEXT NOT NULL,
    upper_trigram TEXT NOT NULL,
    character TEXT NOT NULL,
    binary_representation TEXT NOT NULL,
    judgment TEXT NOT NULL,
    image TEXT NOT NULL
);