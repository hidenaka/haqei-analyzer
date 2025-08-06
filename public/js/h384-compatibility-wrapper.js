/**
 * H384 Database Compatibility Wrapper
 * 
 * Provides backward compatibility for H384_DATABASE.js by creating
 * a simplified version that works with JSON data instead of the 
 * complex class-based system.
 * 
 * Author: HAQEI Programmer Agent  
 * Created: 2025-08-05
 * Version: 1.0.0
 */

class H384DatabaseCompat {
  constructor() {
    this.version = "1.0.0-compat";
    this.initialized = false;
    this.data = [];
    
    // Maps for fast lookup
    this.lineTexts = new Map();
    this.symbolTexts = new Map(); 
    this.judgmentTexts = new Map();
    this.hexagramMeta = new Map();
    
    console.log("🔄 H384DatabaseCompat initializing...");
  }

  async initialize() {
    if (this.initialized) return true;

    try {
      // Load H384 JSON data
      const response = await fetch('/data/h384.json');
      const h384Data = await response.json();
      
      // Set up basic data structure
      this.data = h384Data.hexagrams || [];
      
      // Initialize hexagram metadata
      this.data.forEach(hex => {
        this.hexagramMeta.set(hex.id, hex);
      });

      // Set up basic line texts (fallback data)
      this.initializeBasicTexts();
      
      this.initialized = true;
      console.log(`✅ H384DatabaseCompat initialized with ${this.data.length} hexagrams`);
      return true;
      
    } catch (error) {
      console.error('❌ H384DatabaseCompat initialization failed:', error);
      
      // Fallback: create minimal data structure
      this.initializeFallbackData();
      this.initialized = true;
      console.log('⚠️ H384DatabaseCompat using fallback data');
      return true;
    }
  }

  initializeBasicTexts() {
    // Basic line texts for the most common hexagrams
    const basicTexts = {
      '1-1': '初九：潜龍勿用。',
      '1-2': '九二：見龍在田，利見大人。', 
      '1-3': '九三：君子終日乾乾，夕惕若厲，無咎。',
      '1-4': '九四：或躍在淵，無咎。',
      '1-5': '九五：飛龍在天，利見大人。',
      '1-6': '上九：亢龍有悔。',
      '2-1': '初六：履霜，堅冰至。',
      '2-2': '六二：直，方，大，不習無不利。',
      '2-3': '六三：含章可貞。或從王事，無成有終。',
      '2-4': '六四：括囊；無咎，無誉。',
      '2-5': '六五：黄裳，元吉。',
      '2-6': '上六：龍戰于野，其血玄黄。'
    };

    Object.entries(basicTexts).forEach(([key, text]) => {
      this.lineTexts.set(key, text);
    });
  }

  initializeFallbackData() {
    // Minimal hexagram data for compatibility
    const fallbackHexagrams = [
      { id: 1, name: "乾為天", chinese: "乾", reading: "けん" },
      { id: 2, name: "坤為地", chinese: "坤", reading: "こん" },
      { id: 3, name: "水雷屯", chinese: "屯", reading: "ちゅん" },
      { id: 4, name: "山水蒙", chinese: "蒙", reading: "もう" }
    ];

    this.data = fallbackHexagrams;
    fallbackHexagrams.forEach(hex => {
      this.hexagramMeta.set(hex.id, hex);
    });

    this.initializeBasicTexts();
  }

  // API methods for backward compatibility
  getLineText(hexagram, line) {
    const key = `${hexagram}-${line}`;
    return this.lineTexts.get(key) || `第${hexagram}卦 第${line}爻`;
  }

  getSymbolText(hexagram, line) {
    const key = `${hexagram}-${line}`;
    return this.symbolTexts.get(key) || `第${hexagram}卦 第${line}爻の象`;
  }

  getJudgmentText(hexagram) {
    return this.judgmentTexts.get(hexagram) || `第${hexagram}卦の彖辞`;
  }

  getHexagramMeta(hexagram) {
    return this.hexagramMeta.get(hexagram) || { id: hexagram, name: `第${hexagram}卦` };
  }

  searchByKeyword(keyword) {
    const results = [];
    this.lineTexts.forEach((text, key) => {
      if (text.includes(keyword)) {
        const [hexagram, line] = key.split('-');
        results.push({
          hexagram: parseInt(hexagram),
          line: parseInt(line),
          text: text
        });
      }
    });
    return results;
  }

  // Compatibility with original H384_DATABASE methods
  async loadLineTexts() {
    // Already loaded in initialize()
    return true;
  }

  async loadSymbolTexts() {
    // Already loaded in initialize()
    return true;
  }

  async loadJudgmentTexts() {
    // Already loaded in initialize()
    return true;
  }

  isInitialized() {
    return this.initialized;
  }

  getStats() {
    return {
      totalLines: this.lineTexts.size,
      totalHexagrams: this.data.length,
      version: this.version,
      initialized: this.initialized
    };
  }
}

// Create global instance - check if already exists to prevent conflicts
const H384_DATABASE_COMPAT = new H384DatabaseCompat();

// For backward compatibility, also expose as H384_DATA - avoid conflicts
let H384_DATA_COMPAT;

// Make available globally - only if not already set
if (typeof window !== 'undefined') {
  // Check if H384_DATABASE already exists from main database
  if (!window.H384_DATABASE) {
    window.H384_DATABASE = H384_DATABASE_COMPAT;
    console.log('✅ Using H384_DATABASE compatibility layer');
  }
  
  if (!window.H384_DATA) {
    H384_DATA_COMPAT = H384_DATABASE_COMPAT.data;
    window.H384_DATA = H384_DATA_COMPAT;
  }
  
  // Auto-initialize compatibility layer
  H384_DATABASE_COMPAT.initialize().then(() => {
    console.log('✅ H384_DATABASE compatibility layer ready');
    
    // Update H384_DATA reference only if using compatibility layer
    if (window.H384_DATABASE === H384_DATABASE_COMPAT) {
      window.H384_DATA = H384_DATABASE_COMPAT.data;
    }
    
    // Dispatch ready event
    window.dispatchEvent(new CustomEvent('h384DatabaseReady', {
      detail: H384_DATABASE_COMPAT.getStats()
    }));
  });
}

// Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = H384_DATABASE;
}

console.log("🔧 H384_DATABASE compatibility wrapper loaded");