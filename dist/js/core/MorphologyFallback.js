/**
 * MorphologyFallback.js - Lightweight Japanese text processing fallback
 * 
 * Provides basic Japanese text analysis without requiring large dictionaries
 * Used when kuromoji dictionaries are not available
 */

class MorphologyFallback {
  constructor() {
    this.hiraganaPattern = /[\u3042-\u3096]/g;
    this.katakanaPattern = /[\u30A0-\u30FF]/g;
    this.kanjiPattern = /[\u4E00-\u9FAF]/g;
    this.asciiPattern = /[\u0020-\u007E]/g;
    
    // Basic Japanese patterns for fallback analysis
    this.patterns = {
      honorifics: /お[\u3042-\u3096]{1,3}|ご[\u4E00-\u9FAF]{1,3}/g,
      particles: /は|が|を|に|で|と|や|の|か|も|よ|ね|な|だ|である/g,
      verbs: /する|した|して|される|できる|ある|いる|なる|来る|行く/g,
      adjectives: /い$|な$|的$/g,
      negation: /ない|ません|しない|できない|ではない/g,
      positive: /良い|素晴らしい|優秀|成功|達成|満足/g,
      negative: /悪い|困難|問題|失敗|不安|心配/g
    };
    
    console.log('🔤 MorphologyFallback initialized - Basic Japanese analysis ready');
  }

  /**
   * Basic text analysis without full morphological parsing
   * @param {string} text - Text to analyze
   * @returns {Object} Analysis results
   */
  analyzeText(text) {
    if (!text || typeof text !== 'string') {
      return this.createEmptyResult();
    }

    const result = {
      originalText: text,
      length: text.length,
      characterTypes: this.analyzeCharacterTypes(text),
      patterns: this.detectPatterns(text),
      sentiment: this.analyzeSentiment(text),
      keywords: this.extractKeywords(text),
      readability: this.calculateReadability(text)
    };

    return result;
  }

  /**
   * Analyze character types in text
   * @private
   */
  analyzeCharacterTypes(text) {
    return {
      hiragana: (text.match(this.hiraganaPattern) || []).length,
      katakana: (text.match(this.katakanaPattern) || []).length,
      kanji: (text.match(this.kanjiPattern) || []).length,
      ascii: (text.match(this.asciiPattern) || []).length,
      total: text.length
    };
  }

  /**
   * Detect linguistic patterns
   * @private
   */
  detectPatterns(text) {
    const patterns = {};
    
    for (const [patternName, regex] of Object.entries(this.patterns)) {
      const matches = text.match(regex) || [];
      patterns[patternName] = {
        count: matches.length,
        matches: matches.slice(0, 5) // Limit to first 5 matches
      };
    }
    
    return patterns;
  }

  /**
   * Basic sentiment analysis
   * @private
   */
  analyzeSentiment(text) {
    const positiveMatches = text.match(this.patterns.positive) || [];
    const negativeMatches = text.match(this.patterns.negative) || [];
    const negationMatches = text.match(this.patterns.negation) || [];
    
    // Simple scoring system
    let score = positiveMatches.length - negativeMatches.length;
    
    // Adjust for negation
    if (negationMatches.length > 0) {
      score -= negationMatches.length * 0.5;
    }
    
    // Normalize to -1 to 1 range
    const normalizedScore = Math.max(-1, Math.min(1, score / Math.max(1, text.length / 10)));
    
    return {
      score: normalizedScore,
      confidence: Math.min(0.7, (positiveMatches.length + negativeMatches.length) / 10),
      positive: positiveMatches.length,
      negative: negativeMatches.length,
      negation: negationMatches.length
    };
  }

  /**
   * Extract basic keywords
   * @private
   */
  extractKeywords(text) {
    // Split by common delimiters and filter
    const words = text
      .split(/[\s、。！？\n\r\t]+/)
      .filter(word => word.length > 1)
      .filter(word => !this.isStopWord(word))
      .slice(0, 10); // Limit to top 10
    
    // Count frequency
    const frequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    // Sort by frequency
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word, count]) => ({ word, count }));
  }

  /**
   * Check if word is a stop word
   * @private
   */
  isStopWord(word) {
    const stopWords = [
      'の', 'に', 'は', 'を', 'が', 'で', 'と', 'から', 'まで', 'より',
      'こと', 'もの', 'これ', 'それ', 'あれ', 'この', 'その', 'あの',
      'です', 'である', 'だった', 'でした', 'します', 'された'
    ];
    
    return stopWords.includes(word) || word.length < 2;
  }

  /**
   * Calculate basic readability score
   * @private
   */
  calculateReadability(text) {
    const chars = this.analyzeCharacterTypes(text);
    const sentences = text.split(/[。！？]/).length - 1;
    const avgSentenceLength = sentences > 0 ? text.length / sentences : text.length;
    
    // Simple readability formula (lower is easier)
    const kanjiRatio = chars.kanji / chars.total;
    const lengthFactor = Math.min(2, avgSentenceLength / 20);
    const complexity = kanjiRatio * 0.7 + lengthFactor * 0.3;
    
    return {
      score: Math.max(0, Math.min(1, 1 - complexity)),
      complexity: complexity,
      avgSentenceLength: avgSentenceLength,
      kanjiRatio: kanjiRatio
    };
  }

  /**
   * Create empty result structure
   * @private
   */
  createEmptyResult() {
    return {
      originalText: '',
      length: 0,
      characterTypes: { hiragana: 0, katakana: 0, kanji: 0, ascii: 0, total: 0 },
      patterns: {},
      sentiment: { score: 0, confidence: 0, positive: 0, negative: 0, negation: 0 },
      keywords: [],
      readability: { score: 0, complexity: 0, avgSentenceLength: 0, kanjiRatio: 0 }
    };
  }

  /**
   * Compatibility method for kuromoji-style tokenization
   * @param {string} text - Text to tokenize
   * @returns {Array} Mock tokens for compatibility
   */
  tokenize(text) {
    const analysis = this.analyzeText(text);
    
    // Create mock tokens for compatibility with existing code
    const mockTokens = text
      .split(/[\s、。！？\n\r\t]+/)
      .filter(word => word.length > 0)
      .map((word, index) => ({
        surface_form: word,
        pos: this.guessPartOfSpeech(word),
        pos_detail_1: '*',
        pos_detail_2: '*',
        pos_detail_3: '*',
        conjugated_type: '*',
        conjugated_form: '*',
        basic_form: word,
        reading: word,
        pronunciation: word,
        word_id: index,
        word_type: 'KNOWN'
      }));
    
    return mockTokens;
  }

  /**
   * Guess part of speech for compatibility
   * @private
   */
  guessPartOfSpeech(word) {
    if (this.patterns.particles.test(word)) return '助詞';
    if (this.patterns.verbs.test(word)) return '動詞';
    if (this.patterns.adjectives.test(word)) return '形容詞';
    if (this.kanjiPattern.test(word)) return '名詞';
    if (this.hiraganaPattern.test(word)) return '助詞';
    return '名詞'; // Default
  }

  /**
   * Check if fallback mode is active
   */
  isFallbackMode() {
    return true; // Always true for fallback
  }

  /**
   * Get analysis capabilities
   */
  getCapabilities() {
    return {
      morphologicalAnalysis: false,
      sentimentAnalysis: true,
      keywordExtraction: true,
      characterAnalysis: true,
      patternDetection: true,
      readabilityAnalysis: true,
      mode: 'fallback'
    };
  }
}

// Global instance
window.MorphologyFallback = MorphologyFallback;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.morphologyFallback = new MorphologyFallback();
  });
} else {
  window.morphologyFallback = new MorphologyFallback();
}