/**
 * DataReceiver Module - TDD REFACTOR Phase
 * Handles user data retrieval and validation for HAQEI analysis
 * @module DataReceiver
 */

/**
 * Load and validate user analysis data from localStorage
 * @returns {UserAnalysisData|null} Validated user data or null if invalid/missing
 */
function loadUserData() {
  try {
    // Check if running in Node.js test environment
    const storage = typeof window !== 'undefined' ? window.localStorage : global.window?.localStorage;
    if (!storage) {
      return null;
    }

    const rawData = storage.getItem('haqei_user_analysis');
    if (!rawData) {
      return null;
    }

    const data = JSON.parse(rawData);
    return validateData(data) ? data : null;
  } catch (error) {
    console.error('DataReceiver.loadUserData: Parse error', error);
    return null;
  }
}

/**
 * Validate user analysis data structure and required fields
 * @param {any} data - Data to validate
 * @returns {boolean} True if valid UserAnalysisData structure
 */
function validateData(data) {
  if (!data || typeof data !== 'object') {
    return false;
  }

  // Required field existence check
  if (!data.answers || typeof data.answers !== 'object') {
    return false;
  }

  if (!data.scores || typeof data.scores !== 'object') {
    return false;
  }

  // Required 8-dimension scores validation
  const requiredDimensions = [
    'qian_creativity',
    'zhen_action',
    'kan_exploration',
    'gen_stability',
    'kun_receptiveness',
    'xun_adaptability',
    'li_expression',
    'dui_harmony',
  ];

  return requiredDimensions.every((dimension) => typeof data.scores[dimension] === 'number');
}

/**
 * Redirect to OS analyzer page (browser environment only)
 */
function redirectToAnalyzer() {
  if (typeof window !== 'undefined') {
    window.location.href = 'os_analyzer.html';
  }
}

const DataReceiver = {
  loadUserData,
  validateData,
  redirectToAnalyzer,
};

// Always export for CommonJS (Node.js)
module.exports = {
  loadUserData,
  validateData,
  redirectToAnalyzer,
};

// Export for browser
if (typeof window !== 'undefined') {
  window.DataReceiver = DataReceiver;
}
