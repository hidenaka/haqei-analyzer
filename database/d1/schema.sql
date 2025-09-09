-- D1 Database Schema for HaQei Analyzer
-- SQLite compatible schema for Cloudflare D1
-- Enhanced schema to support complete JSON data integration

-- Trigrams table (8 basic trigrams)
CREATE TABLE IF NOT EXISTS trigrams (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  element TEXT,
  attribute TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Hexagrams table (64 hexagrams)
CREATE TABLE IF NOT EXISTS hexagrams (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  nameClassical TEXT,
  reading TEXT,
  binary TEXT,
  upperTrigramId INTEGER,
  lowerTrigramId INTEGER,
  catchphrase TEXT,
  description TEXT,
  keywords TEXT,
  timeConcept TEXT,
  virtue TEXT,
  emotion TEXT,
  guaCiText TEXT,
  guaCiMeaning TEXT,
  guaCiGuidance TEXT,
  daXiangText TEXT,
  daXiangMeaning TEXT,
  daXiangApplication TEXT,
  wuxingElement TEXT,
  personalityArchetype TEXT,
  engineOsRelevance INTEGER DEFAULT 0,
  interfaceOsRelevance INTEGER DEFAULT 0,
  safeModeRelevance INTEGER DEFAULT 0,
  primaryActivation TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (upperTrigramId) REFERENCES trigrams(id),
  FOREIGN KEY (lowerTrigramId) REFERENCES trigrams(id)
);

-- Lines table (384 lines total)
CREATE TABLE IF NOT EXISTS lines (
  id INTEGER PRIMARY KEY,
  hexagramId INTEGER NOT NULL,
  position INTEGER NOT NULL, -- 1-6
  name TEXT NOT NULL,
  text TEXT,
  meaning TEXT,
  personalityTrait TEXT,
  transformationPotential TEXT,
  shinGuidance TEXT, -- from koudo_shishin.json
  henGuidance TEXT,  -- from koudo_shishin.json
  keywords TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hexagramId) REFERENCES hexagrams(id)
);

-- Special Yao table (for 用九/用六)
CREATE TABLE IF NOT EXISTS specialYao (
  id INTEGER PRIMARY KEY,
  hexagramId INTEGER NOT NULL,
  name TEXT NOT NULL, -- 用九 or 用六
  text TEXT,
  meaning TEXT,
  interpretation TEXT,
  personalityTrait TEXT,
  transformationPotential TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hexagramId) REFERENCES hexagrams(id)
);

-- Hexagram relationships table
CREATE TABLE IF NOT EXISTS hexagramRelationships (
  id INTEGER PRIMARY KEY,
  hexagramId INTEGER NOT NULL,
  huGua INTEGER,
  zongGua INTEGER,
  cuoGua INTEGER,
  sequencePosition INTEGER,
  sequenceNext INTEGER,
  sequenceLogic TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hexagramId) REFERENCES hexagrams(id),
  FOREIGN KEY (huGua) REFERENCES hexagrams(id),
  FOREIGN KEY (zongGua) REFERENCES hexagrams(id),
  FOREIGN KEY (cuoGua) REFERENCES hexagrams(id),
  FOREIGN KEY (sequenceNext) REFERENCES hexagrams(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lines_hexagram_id ON lines(hexagramId);
CREATE INDEX IF NOT EXISTS idx_lines_position ON lines(position);
CREATE INDEX IF NOT EXISTS idx_lines_hexagram_position ON lines(hexagramId, position);
CREATE INDEX IF NOT EXISTS idx_hexagrams_name ON hexagrams(name);
CREATE INDEX IF NOT EXISTS idx_hexagrams_binary ON hexagrams(binary);
CREATE INDEX IF NOT EXISTS idx_hexagrams_trigrams ON hexagrams(upperTrigramId, lowerTrigramId);
CREATE INDEX IF NOT EXISTS idx_special_yao_hexagram ON specialYao(hexagramId);
CREATE INDEX IF NOT EXISTS idx_relationships_hexagram ON hexagramRelationships(hexagramId);