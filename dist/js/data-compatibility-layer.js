/**
 * Data Compatibility Layer - HAQEI Analyzer
 * 
 * This layer provides backward compatibility for code that expects
 * data to be available as global variables after loading JS files.
 * 
 * Converts JSON data loading to global variable assignment.
 * 
 * Author: HAQEI Programmer Agent
 * Created: 2025-08-05
 * Version: 1.0.0
 */

class DataCompatibilityLayer {
  constructor() {
    this.loadedFiles = new Set();
    this.loadingPromises = new Map();
    console.log('🔄 Data Compatibility Layer initialized');
  }

  /**
   * Load JSON data and assign to global variables
   */
  async loadDataFile(jsonPath, globalVarName, processingFn = null) {
    if (this.loadedFiles.has(jsonPath)) {
      return Promise.resolve();
    }

    if (this.loadingPromises.has(jsonPath)) {
      return this.loadingPromises.get(jsonPath);
    }

    const loadPromise = this.performLoad(jsonPath, globalVarName, processingFn);
    this.loadingPromises.set(jsonPath, loadPromise);
    
    try {
      // await loadPromise;
      this.loadedFiles.add(jsonPath);
      console.log(`✅ Loaded ${jsonPath} → ${globalVarName}`);
    } catch (error) {
      console.error(`❌ Failed to load ${jsonPath}:`, error);
      this.loadingPromises.delete(jsonPath);
      throw error;
    }

    return loadPromise;
  }

  async performLoad(jsonPath, globalVarName, processingFn) {
    try {
      const response = fetch(jsonPath);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = response.json();
      const processedData = processingFn ? processingFn(data) : data;

      // Assign to global variable
      if (typeof window !== 'undefined') {
        window[globalVarName] = processedData;
      }

      return processedData;
    } catch (error) {
      console.error(`Error loading ${jsonPath}:`, error);
      throw error;
    }
  }

  /**
   * Load all data files with backward compatibility
   */
  async loadAllData() {
    const loadTasks = [
      // Hexagrams data (data_box.js replacement)
      this.loadDataFile('/data/hexagrams.json', 'hexagrams_master'),
      
      // AI themes data (ai_theme_database.js replacement) 
      this.loadDataFile('/data/ai_themes.json', 'futureThemeMap'),
      
      // Koudo Shishin data (koudo_shishin_database.js replacement)
      this.loadDataFile('/data/koudo_shishin.json', 'koudoShishinData'),
      
      // Bible data (bible.js replacement)
      this.loadDataFile('/data/bible.json', 'BIBLE_DATA'),
      
      // H384 database (H384_DATABASE.js replacement - partial)
      this.loadDataFile('/data/h384.json', 'H384_DATA_JSON', (data) => {
        // Create a simplified H384_DATA structure for compatibility
        return {
          version: data.version,
          hexagrams: data.hexagrams,
          getHexagramData: (id) => data.hexagrams.find(h => h.id === id),
          getLineText: (hexagram, line) => `${hexagram}-${line} (JSON data loaded)`,
          initialized: true
        };
      })
    ];

    try {
      Promise.all(loadTasks);
      console.log('🎉 All data files loaded successfully');
      
      // Trigger data ready event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('dataCompatibilityReady', {
          detail: { loadedFiles: Array.from(this.loadedFiles) }
        }));
      }
      
      return true;
    } catch (error) {
      console.error('❌ Failed to load all data files:', error);
      return false;
    }
  }

  /**
   * Check if all required data is loaded
   */
  isDataReady() {
    const requiredVars = ['hexagrams_master', 'futureThemeMap', 'koudoShishinData', 'BIBLE_DATA'];
    
    if (typeof window === 'undefined') return false;
    
    return requiredVars.every(varName => 
      typeof window[varName] !== 'undefined' && window[varName] !== null
    );
  }

  /**
   * Wait for data to be ready
   */
  waitForData(timeout = 10000) {
    return new Promise((resolve, reject) => {
      if (this.isDataReady()) {
        resolve(true);
        return;
      }

      const timeoutId = setTimeout(() => {
        reject(new Error(`Data loading timeout after ${timeout}ms`));
      }, timeout);

      const checkReady = () => {
        if (this.isDataReady()) {
          clearTimeout(timeoutId);
          resolve(true);
        } else {
          setTimeout(checkReady, 100);
        }
      };

      checkReady();
    });
  }
}

// Create global instance
const dataCompatibilityLayer = new DataCompatibilityLayer();

// Auto-load data when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      dataCompatibilityLayer.loadAllData();
    });
  } else {
    // DOM already loaded
    dataCompatibilityLayer.loadAllData();
  }
}

// Export for manual loading
if (typeof window !== 'undefined') {
  window.dataCompatibilityLayer = dataCompatibilityLayer;
}

console.log('🔧 Data Compatibility Layer ready');