/**
 * PersonalitySafetyHelpers.js - Safe OS Personality Access Utilities
 * 
 * Provides safe access methods for OS personality properties with fallback values
 * and consistent data structure handling across the HAQEI system.
 * 
 * Created: 2025-08-03
 * Purpose: Prevent undefined/null errors in personality property access
 */

class PersonalitySafetyHelpers {
  /**
   * Default fallback values for each OS type
   */
  static DEFAULT_VALUES = {
    engine: {
      priorities: ['創造性', '理想実現', '価値観一致'],
      voice: '情熱的で理想主義的な語り口',
      strengths: ['創造力', '情熱', '信念の強さ'],
      weaknesses: ['現実的配慮不足', '妥協への抵抗', '完璧主義'],
      fears: ['妥協', '平凡さ', '価値観の否定'],
      desires: ['本質的な価値の創造', '理想的な世界', '真の自己実現']
    },
    interface: {
      priorities: ['調和維持', '関係性', '相互理解'],
      voice: '温かく配慮深い話し方',
      strengths: ['共感力', '協調性', '思いやり'],
      weaknesses: ['自己主張の弱さ', '境界線の曖昧さ', '過度な配慮'],
      fears: ['孤立', '対立', '他者を傷つけること'],
      desires: ['皆が幸せな環境', '深い絆', '相互理解']
    },
    safemode: {
      priorities: ['安全性', 'リスク管理', '安定性'],
      voice: '慎重で分析的な表現',
      strengths: ['慎重さ', '分析力', '危機管理能力'],
      weaknesses: ['過度な心配', '変化への抵抗', '機会の逸失'],
      fears: ['未知の危険', '予期せぬ変化', '制御不能な状況'],
      desires: ['予測可能な環境', '確実な安全', '準備された対策']
    }
  };

  /**
   * Safe personality priorities access
   * @param {Object} os - OS object
   * @returns {Array<string>} - Priority array with fallback
   */
  static safeGetPersonalityPriorities(os) {
    if (!os) {
      console.warn('⚠️ safeGetPersonalityPriorities: os is null/undefined');
      return this.DEFAULT_VALUES.engine.priorities; // Default fallback
    }

    // Determine OS type
    const osType = this.getOSType(os);
    const fallbackPriorities = this.DEFAULT_VALUES[osType]?.priorities || this.DEFAULT_VALUES.engine.priorities;

    // Try multiple access patterns
    try {
      // Pattern 1: Direct personality.priorities access
      if (os.personality && Array.isArray(os.personality.priorities) && os.personality.priorities.length > 0) {
        return os.personality.priorities;
      }

      // Pattern 2: PersonalityOS structure
      if (os.personalityOS && os.personalityOS.personality && Array.isArray(os.personalityOS.personality.priorities)) {
        return os.personalityOS.personality.priorities;
      }

      // Pattern 3: Characteristics access
      if (os.characteristics && Array.isArray(os.characteristics.priorities)) {
        return os.characteristics.priorities;
      }

      // Pattern 4: Legacy structure
      if (Array.isArray(os.priorities)) {
        return os.priorities;
      }

      console.warn(`⚠️ No valid priorities found for OS type: ${osType}, using fallback`);
      return fallbackPriorities;

    } catch (error) {
      console.error('❌ Error in safeGetPersonalityPriorities:', error);
      return fallbackPriorities;
    }
  }

  /**
   * Safe personality voice access
   * @param {Object} os - OS object
   * @returns {string} - Voice string with fallback
   */
  static safeGetPersonalityVoice(os) {
    if (!os) {
      console.warn('⚠️ safeGetPersonalityVoice: os is null/undefined');
      return this.DEFAULT_VALUES.engine.voice;
    }

    const osType = this.getOSType(os);
    const fallbackVoice = this.DEFAULT_VALUES[osType]?.voice || this.DEFAULT_VALUES.engine.voice;

    try {
      // Pattern 1: Direct personality.voice access
      if (os.personality && typeof os.personality.voice === 'string' && os.personality.voice.trim()) {
        return os.personality.voice;
      }

      // Pattern 2: PersonalityOS structure
      if (os.personalityOS && os.personalityOS.personality && typeof os.personalityOS.personality.voice === 'string') {
        return os.personalityOS.personality.voice;
      }

      // Pattern 3: Characteristics access
      if (os.characteristics && typeof os.characteristics.voice === 'string') {
        return os.characteristics.voice;
      }

      // Pattern 4: Legacy structure
      if (typeof os.voice === 'string') {
        return os.voice;
      }

      console.warn(`⚠️ No valid voice found for OS type: ${osType}, using fallback`);
      return fallbackVoice;

    } catch (error) {
      console.error('❌ Error in safeGetPersonalityVoice:', error);
      return fallbackVoice;
    }
  }

  /**
   * Safe personality strengths access
   * @param {Object} os - OS object
   * @returns {Array<string>} - Strengths array with fallback
   */
  static safeGetPersonalityStrengths(os) {
    if (!os) {
      console.warn('⚠️ safeGetPersonalityStrengths: os is null/undefined');
      return this.DEFAULT_VALUES.engine.strengths;
    }

    const osType = this.getOSType(os);
    const fallbackStrengths = this.DEFAULT_VALUES[osType]?.strengths || this.DEFAULT_VALUES.engine.strengths;

    try {
      // Try multiple access patterns
      if (os.personality && Array.isArray(os.personality.strengths) && os.personality.strengths.length > 0) {
        return os.personality.strengths;
      }

      if (os.personalityOS && os.personalityOS.personality && Array.isArray(os.personalityOS.personality.strengths)) {
        return os.personalityOS.personality.strengths;
      }

      if (os.characteristics && Array.isArray(os.characteristics.strengths)) {
        return os.characteristics.strengths;
      }

      if (Array.isArray(os.strengths)) {
        return os.strengths;
      }

      console.warn(`⚠️ No valid strengths found for OS type: ${osType}, using fallback`);
      return fallbackStrengths;

    } catch (error) {
      console.error('❌ Error in safeGetPersonalityStrengths:', error);
      return fallbackStrengths;
    }
  }

  /**
   * Safe personality weaknesses access
   * @param {Object} os - OS object
   * @returns {Array<string>} - Weaknesses array with fallback
   */
  static safeGetPersonalityWeaknesses(os) {
    if (!os) {
      console.warn('⚠️ safeGetPersonalityWeaknesses: os is null/undefined');
      return this.DEFAULT_VALUES.engine.weaknesses;
    }

    const osType = this.getOSType(os);
    const fallbackWeaknesses = this.DEFAULT_VALUES[osType]?.weaknesses || this.DEFAULT_VALUES.engine.weaknesses;

    try {
      if (os.personality && Array.isArray(os.personality.weaknesses) && os.personality.weaknesses.length > 0) {
        return os.personality.weaknesses;
      }

      if (os.personalityOS && os.personalityOS.personality && Array.isArray(os.personalityOS.personality.weaknesses)) {
        return os.personalityOS.personality.weaknesses;
      }

      if (os.characteristics && Array.isArray(os.characteristics.weaknesses)) {
        return os.characteristics.weaknesses;
      }

      if (Array.isArray(os.weaknesses)) {
        return os.weaknesses;
      }

      console.warn(`⚠️ No valid weaknesses found for OS type: ${osType}, using fallback`);
      return fallbackWeaknesses;

    } catch (error) {
      console.error('❌ Error in safeGetPersonalityWeaknesses:', error);
      return fallbackWeaknesses;
    }
  }

  /**
   * Safe personality fears access
   * @param {Object} os - OS object
   * @returns {Array<string>} - Fears array with fallback
   */
  static safeGetPersonalityFears(os) {
    if (!os) {
      return this.DEFAULT_VALUES.engine.fears;
    }

    const osType = this.getOSType(os);
    const fallbackFears = this.DEFAULT_VALUES[osType]?.fears || this.DEFAULT_VALUES.engine.fears;

    try {
      if (os.personality && Array.isArray(os.personality.fears)) {
        return os.personality.fears;
      }

      if (os.personalityOS && os.personalityOS.personality && Array.isArray(os.personalityOS.personality.fears)) {
        return os.personalityOS.personality.fears;
      }

      return fallbackFears;

    } catch (error) {
      console.error('❌ Error in safeGetPersonalityFears:', error);
      return fallbackFears;
    }
  }

  /**
   * Safe personality desires access
   * @param {Object} os - OS object
   * @returns {Array<string>} - Desires array with fallback
   */
  static safeGetPersonalityDesires(os) {
    if (!os) {
      return this.DEFAULT_VALUES.engine.desires;
    }

    const osType = this.getOSType(os);
    const fallbackDesires = this.DEFAULT_VALUES[osType]?.desires || this.DEFAULT_VALUES.engine.desires;

    try {
      if (os.personality && Array.isArray(os.personality.desires)) {
        return os.personality.desires;
      }

      if (os.personalityOS && os.personalityOS.personality && Array.isArray(os.personalityOS.personality.desires)) {
        return os.personalityOS.personality.desires;
      }

      return fallbackDesires;

    } catch (error) {
      console.error('❌ Error in safeGetPersonalityDesires:', error);
      return fallbackDesires;
    }
  }

  /**
   * Determine OS type from OS object
   * @param {Object} os - OS object
   * @returns {string} - OS type ('engine', 'interface', 'safemode')
   */
  static getOSType(os) {
    if (!os) return 'engine';

    // Direct osType property
    if (os.osType) {
      return this.normalizeOSType(os.osType);
    }

    // From osName
    if (os.osName) {
      const name = os.osName.toLowerCase();
      if (name.includes('engine')) return 'engine';
      if (name.includes('interface')) return 'interface';
      if (name.includes('safe')) return 'safemode';
    }

    // From constructor name
    if (os.constructor && os.constructor.name) {
      const name = os.constructor.name.toLowerCase();
      if (name.includes('engine')) return 'engine';
      if (name.includes('interface')) return 'interface';
      if (name.includes('safe')) return 'safemode';
    }

    // Default fallback
    return 'engine';
  }

  /**
   * Normalize OS type string
   * @param {string} osType - Raw OS type
   * @returns {string} - Normalized OS type
   */
  static normalizeOSType(osType) {
    if (!osType || typeof osType !== 'string') return 'engine';

    const normalized = osType.toLowerCase().trim();
    
    if (normalized.includes('engine')) return 'engine';
    if (normalized.includes('interface')) return 'interface';
    if (normalized.includes('safe')) return 'safemode';
    
    return normalized; // Return as-is if already normalized
  }

  /**
   * Validate OS object structure
   * @param {Object} os - OS object to validate
   * @returns {boolean} - True if valid structure
   */
  static validateOSStructure(os) {
    if (!os || typeof os !== 'object') {
      return false;
    }

    // Check for at least one valid property
    const hasValidProperty = 
      os.osType || 
      os.osName || 
      os.personality || 
      os.personalityOS || 
      os.characteristics;

    return Boolean(hasValidProperty);
  }

  /**
   * Create complete personality object with all safe defaults
   * @param {string} osType - OS type
   * @returns {Object} - Complete personality object
   */
  static createCompletePersonality(osType = 'engine') {
    const normalizedType = this.normalizeOSType(osType);
    const defaults = this.DEFAULT_VALUES[normalizedType] || this.DEFAULT_VALUES.engine;

    return {
      voice: defaults.voice,
      priorities: [...defaults.priorities],
      fears: [...defaults.fears],
      desires: [...defaults.desires],
      strengths: [...defaults.strengths],
      weaknesses: [...defaults.weaknesses]
    };
  }

  /**
   * Merge OS personality data safely
   * @param {Object} os - OS object
   * @param {Object} newPersonalityData - New personality data to merge
   * @returns {Object} - Updated OS object
   */
  static mergePersonalitySafely(os, newPersonalityData) {
    if (!os || typeof os !== 'object') {
      console.warn('⚠️ mergePersonalitySafely: invalid OS object');
      return os;
    }

    if (!newPersonalityData || typeof newPersonalityData !== 'object') {
      console.warn('⚠️ mergePersonalitySafely: invalid personality data');
      return os;
    }

    try {
      // Ensure personality object exists
      if (!os.personality) {
        os.personality = {};
      }

      // Safely merge each property
      Object.keys(newPersonalityData).forEach(key => {
        const value = newPersonalityData[key];
        if (Array.isArray(value)) {
          os.personality[key] = [...value]; // Create copy of array
        } else if (typeof value === 'string' && value.trim()) {
          os.personality[key] = value;
        }
      });

      return os;

    } catch (error) {
      console.error('❌ Error in mergePersonalitySafely:', error);
      return os;
    }
  }
}

// Global availability
if (typeof window !== 'undefined') {
  window.PersonalitySafetyHelpers = PersonalitySafetyHelpers;
}

// Node.js support
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PersonalitySafetyHelpers;
}

console.log('✅ PersonalitySafetyHelpers.js loaded successfully');