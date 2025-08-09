/**
 * BunJinAnalyzer Module - TDD REFACTOR Phase
 * 3分人×易経×262,144パターン解析システム
 *
 * HaQei哲学の中核実装：3つの分人システムと易経メタファーの統合
 *
 * @description
 * このモジュールは、ユーザーの30問回答から3つの分人（Engine/Interface/SafeMode）
 * それぞれに対応する64卦を決定し、262,144通り（64³）のパターン解析を実現します。
 *
 * @philosophy
 * - **Engine分人**: 本質的価値観システム（内なる真の自分、価値判断の核）
 * - **Interface分人**: 社会的役割表現システム（他者に見せる自分、社会的適応）
 * - **SafeMode分人**: 防御・保護システム（困難時の自分、ストレス対処）
 *
 * @module BunJinAnalyzer
 * @version 1.0.0
 * @author HAQEI System
 */

/**
 * @typedef {Object} DimensionalScores
 * @property {number} qian_creativity - 創造性スコア (0-100)
 * @property {number} zhen_action - 行動力スコア (0-100)
 * @property {number} kan_exploration - 探求心スコア (0-100)
 * @property {number} gen_stability - 安定性スコア (0-100)
 * @property {number} kun_receptiveness - 受容性スコア (0-100)
 * @property {number} xun_adaptability - 適応性スコア (0-100)
 * @property {number} li_expression - 表現力スコア (0-100)
 * @property {number} dui_harmony - 調和性スコア (0-100)
 */

/**
 * @typedef {Object} BunJinHexagrams
 * @property {number} engine - Engine分人の卦番号 (1-64)
 * @property {number} interface - Interface分人の卦番号 (1-64)
 * @property {number} safeMode - SafeMode分人の卦番号 (1-64)
 */

/**
 * @typedef {Object} BunJinPattern
 * @property {string} id - パターンID (例: '01-02-03')
 * @property {BunJinHexagrams} hexagrams - 3分人の卦番号
 * @property {number} totalPatterns - 総パターン数 (262,144)
 */

/**
 * @typedef {Object} BasicInsights
 * @property {string} harmony - 協調パターンの洞察
 * @property {string} conflict - 対立パターンの洞察
 * @property {string} growth - 成長方向の洞察
 */

/**
 * 8次元スコア計算用の重み配列
 *
 * 各分人システムが8つの易経次元にどの程度影響を受けるかを定義。
 * HaQei哲学に基づき、分人の特性に応じて重み付けを調整。
 *
 * @type {Object<string, DimensionalScores>}
 */
const DIMENSION_WEIGHTS = {
  engine: {
    // Engine分人: 内なる価値観
    qian_creativity: 0.2, // 創造性
    zhen_action: 0.15, // 行動力
    kan_exploration: 0.2, // 探求心
    gen_stability: 0.1, // 安定性
    kun_receptiveness: 0.1, // 受容性
    xun_adaptability: 0.05, // 適応性
    li_expression: 0.1, // 表現力
    dui_harmony: 0.1, // 調和性
  },
  interface: {
    // Interface分人: 社会的表現
    qian_creativity: 0.1, // 創造性
    zhen_action: 0.1, // 行動力
    kan_exploration: 0.05, // 探求心
    gen_stability: 0.15, // 安定性
    kun_receptiveness: 0.15, // 受容性
    xun_adaptability: 0.2, // 適応性
    li_expression: 0.2, // 表現力
    dui_harmony: 0.15, // 調和性
  },
  safeMode: {
    // SafeMode分人: 防御システム
    qian_creativity: 0.05, // 創造性
    zhen_action: 0.1, // 行動力
    kan_exploration: 0.05, // 探求心
    gen_stability: 0.25, // 安定性
    kun_receptiveness: 0.2, // 受容性
    xun_adaptability: 0.15, // 適応性
    li_expression: 0.05, // 表現力
    dui_harmony: 0.15, // 調和性
  },
};

/**
 * @typedef {Object} HexagramInfo
 * @property {string} name - 卦名 (例: '乾為天')
 * @property {string} trait - 特性 (例: '創造的理想主義')
 * @property {string} energy - エネルギー属性 (例: '陽剛')
 */

/**
 * 64卦基本情報データベース（HexagramDBとの連携用）
 *
 * 注意: 現在は実装の最小セットのみ。本格運用時は全64卦の情報を含める。
 * HexagramDBモジュールとの統合により、詳細情報を動的に取得可能。
 *
 * @type {Object<number, HexagramInfo>}
 */
const HEXAGRAM_BASIC_INFO = {
  1: { name: '乾為天', trait: '創造的理想主義', energy: '陽剛' },
  2: { name: '坤為地', trait: '受容的協調主義', energy: '陰柔' },
  3: { name: '水雷屯', trait: '困難克服型', energy: '陽動' },
  4: { name: '山水蒙', trait: '学習成長型', energy: '陰静' },
  5: { name: '水天需', trait: '忍耐準備型', energy: '陽静' },
  // Note: 実装拡張時は全64卦を追加
};

/**
 * 30問の質問から3分人の64卦を算出
 *
 * HaQei分析の中核処理。ユーザーの30問回答を8次元スコアに変換し、
 * 各分人システム（Engine/Interface/SafeMode）に最適な易経の卦を決定。
 *
 * @param {Record<string, any>} answers - 30問の回答データ (q1-q30)
 * @returns {BunJinHexagrams|null} 3分人の卦番号、または入力無効時はnull
 * @example
 * const answers = { q1: 'A', q2: 'B', ..., q30: 'C' };
 * const hexagrams = calculateBunJinHexagrams(answers);
 * // Returns: { engine: 23, interface: 45, safeMode: 12 }
 */
function calculateBunJinHexagrams(answers) {
  // 入力検証
  if (!answers || typeof answers !== 'object') {
    return null;
  }

  // 30問の回答が全て存在するかチェック
  const expectedQuestions = [];
  for (let i = 1; i <= 30; i++) {
    expectedQuestions.push(`q${i}`);
  }

  const hasAllAnswers = expectedQuestions.every((q) => answers[q] !== undefined);
  if (!hasAllAnswers) {
    return null;
  }

  // 8次元スコア計算（仮想的な実装 - 実際はos_analyzerから取得）
  const scores = calculateDimensionalScores(answers);

  // 各分人システムの卦を決定
  const engineHexagram = calculateHexagramFromScores(scores, 'engine');
  const interfaceHexagram = calculateHexagramFromScores(scores, 'interface');
  const safeModeHexagram = calculateHexagramFromScores(scores, 'safeMode');

  return {
    engine: engineHexagram,
    interface: interfaceHexagram,
    safeMode: safeModeHexagram,
  };
}

/**
 * 30問回答から8次元スコアを計算
 *
 * 現在は簡易実装。本格版では各質問が特定の次元に対応し、
 * より精密なスコア算出アルゴリズムを使用する予定。
 *
 * @param {Record<string, any>} answers - 回答データ
 * @returns {DimensionalScores} 8次元スコア (各次元0-100の範囲)
 * @private
 */
function calculateDimensionalScores(answers) {
  const scores = {
    qian_creativity: 0,
    zhen_action: 0,
    kan_exploration: 0,
    gen_stability: 0,
    kun_receptiveness: 0,
    xun_adaptability: 0,
    li_expression: 0,
    dui_harmony: 0,
  };

  // 簡易計算：回答に基づくスコア算出
  Object.entries(answers).forEach(([, answer], index) => {
    const dimensionIndex = index % 8;
    const dimensions = Object.keys(scores);
    const baseScore = answer === 'A' ? 3 : answer === 'B' ? 2 : 1;

    scores[dimensions[dimensionIndex]] += baseScore;
  });

  // 正規化（0-100）
  Object.keys(scores).forEach((key) => {
    scores[key] = Math.min(100, Math.max(0, scores[key] * 8));
  });

  return scores;
}

/**
 * スコアと分人タイプから対応する卦を算出
 *
 * 各分人システムの特性に基づいた重み付きスコア計算により、
 * 最も適合する64卦の中から1つを決定する。
 *
 * @param {DimensionalScores} scores - 8次元スコア
 * @param {'engine'|'interface'|'safeMode'} bunJinType - 分人タイプ
 * @returns {number} 1-64の卦番号
 * @private
 */
function calculateHexagramFromScores(scores, bunJinType) {
  const weights = DIMENSION_WEIGHTS[bunJinType];

  // 重み付きスコア計算
  let totalScore = 0;
  Object.entries(weights).forEach(([dimension, weight]) => {
    totalScore += scores[dimension] * weight;
  });

  // 64卦への変換（1-64の範囲に正規化）
  const hexagramNumber = Math.floor((totalScore / 100) * 63) + 1;
  return Math.min(64, Math.max(1, hexagramNumber));
}

/**
 * BunJin hexagramsから262,144パターンを解析
 *
 * 3つの分人の卦組み合わせから、262,144通り（64³）のパターンの中での
 * 固有識別子を生成し、パターン分析の基盤データを構築。
 *
 * @param {BunJinHexagrams} hexagrams - 3分人の卦番号
 * @returns {BunJinPattern|null} パターン分析結果、または入力無効時はnull
 * @example
 * const pattern = analyzePattern({ engine: 1, interface: 2, safeMode: 3 });
 * // Returns: { id: '01-02-03', hexagrams: {...}, totalPatterns: 262144 }
 */
function analyzePattern(hexagrams) {
  // 入力検証
  if (!hexagrams || typeof hexagrams !== 'object') {
    return null;
  }

  const { engine, interface: interfaceOS, safeMode } = hexagrams;

  // 卦番号の有効性チェック
  if (!isValidHexagram(engine) || !isValidHexagram(interfaceOS) || !isValidHexagram(safeMode)) {
    return null;
  }

  // パターンID生成
  const patternId = [
    engine.toString().padStart(2, '0'),
    interfaceOS.toString().padStart(2, '0'),
    safeMode.toString().padStart(2, '0'),
  ].join('-');

  return {
    id: patternId,
    hexagrams: {
      engine,
      interface: interfaceOS,
      safeMode,
    },
    totalPatterns: 262144, // 64³
  };
}

/**
 * 卦番号の有効性を検証
 *
 * 易経の64卦システムに準拠し、1-64の範囲内の整数であることを確認。
 *
 * @param {number} hexagram - 検証する卦番号
 * @returns {boolean} 有効な卦番号かどうか
 * @private
 */
function isValidHexagram(hexagram) {
  return Number.isInteger(hexagram) && hexagram >= 1 && hexagram <= 64;
}

/**
 * パターンから基本洞察を生成
 *
 * 3分人の卦の組み合わせから、協調・対立・成長の3つの観点で
 * 基本的な洞察を生成。より深い洞察はInsightEngineモジュールで処理。
 *
 * @param {BunJinPattern} pattern - 分析パターン
 * @returns {BasicInsights|null} 基本洞察、または入力無効時はnull
 * @example
 * const insights = generateBasicInsights(pattern);
 * // Returns: { harmony: '...', conflict: '...', growth: '...' }
 */
function generateBasicInsights(pattern) {
  // 入力検証
  if (!pattern || !pattern.hexagrams) {
    return null;
  }

  const { engine, interface: interfaceOS, safeMode } = pattern.hexagrams;

  // 各卦の基本特性取得
  const engineTrait = getHexagramTrait(engine);
  const interfaceTrait = getHexagramTrait(interfaceOS);
  const safeModeTrait = getHexagramTrait(safeMode);

  // 相互作用分析
  const harmony = generateHarmonyInsight(engineTrait, interfaceTrait, safeModeTrait);
  const conflict = generateConflictInsight(engineTrait, interfaceTrait, safeModeTrait);
  const growth = generateGrowthInsight(engineTrait, interfaceTrait, safeModeTrait);

  return {
    harmony,
    conflict,
    growth,
  };
}

/**
 * 卦番号から特性を取得
 *
 * 基本的な卦情報データベースから特性文字列を取得。
 * 未知の卦番号の場合は汎用的な特性文字列を返す。
 *
 * @param {number} hexagramId - 卦番号 (1-64)
 * @returns {string} 特性を表す文字列
 * @private
 */
function getHexagramTrait(hexagramId) {
  const hexagramInfo = HEXAGRAM_BASIC_INFO[hexagramId];
  return hexagramInfo ? hexagramInfo.trait : '未知の特性';
}

/**
 * 協調パターンの洞察生成
 *
 * 3分人の特性が調和的に機能する状態を分析し、
 * ユーザーの最適状態についての洞察を提供。
 *
 * @param {string} engineTrait - Engine分人の特性
 * @param {string} interfaceTrait - Interface分人の特性
 * @param {string} safeModeTrait - SafeMode分人の特性
 * @returns {string} 協調パターンの説明文
 * @private
 */
function generateHarmonyInsight(engineTrait, interfaceTrait, safeModeTrait) {
  return (
    `あなたの内なる${engineTrait}と社会的な${interfaceTrait}、そして防御的な${safeModeTrait}が調和的に働く時、` +
    `真の力が発揮されます。この3つの側面が統合された時の状態が、あなたの最も自然で力強い在り方です。`
  );
}

/**
 * 対立パターンの洞察生成
 *
 * 3分人間の潜在的な緊張や矛盾を分析し、
 * 内的葛藤の理解と受容に向けた洞察を提供。
 *
 * @param {string} engineTrait - Engine分人の特性
 * @param {string} interfaceTrait - Interface分人の特性
 * @param {string} safeModeTrait - SafeMode分人の特性
 * @returns {string} 対立パターンの説明文
 * @private
 */
function generateConflictInsight(engineTrait, interfaceTrait, safeModeTrait) {
  return (
    `時として内なる${engineTrait}と社会的な${interfaceTrait}の間に緊張が生じ、` +
    `さらに防御的な${safeModeTrait}が加わることで複雑な内的葛藤が生まれます。` +
    `この緊張を理解し、受け入れることが成長の鍵となります。`
  );
}

/**
 * 成長方向の洞察生成
 *
 * 3分人の統合的な発展方向を分析し、
 * バランスの取れた成長への具体的な道筋を提示。
 *
 * @param {string} engineTrait - Engine分人の特性
 * @param {string} interfaceTrait - Interface分人の特性
 * @param {string} safeModeTrait - SafeMode分人の特性
 * @returns {string} 成長方向の説明文
 * @private
 */
function generateGrowthInsight(engineTrait, interfaceTrait, safeModeTrait) {
  return (
    `${engineTrait}を核として、${interfaceTrait}を社会的な表現手段として活用し、` +
    `${safeModeTrait}を適切な自己保護として機能させることで、` +
    `バランスの取れた統合的な成長が期待できます。`
  );
}

/**
 * Module exports for BunJinAnalyzer
 * @namespace BunJinAnalyzer
 */
module.exports = {
  calculateBunJinHexagrams,
  analyzePattern,
  generateBasicInsights,

  // Export constants for testing and integration
  constants: {
    TOTAL_PATTERNS: 262144,
    MAX_HEXAGRAM_NUMBER: 64,
    MIN_HEXAGRAM_NUMBER: 1,
    REQUIRED_QUESTIONS: 30,
  },
};
