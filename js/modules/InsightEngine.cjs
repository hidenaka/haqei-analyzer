/**
 * InsightEngine Module - TDD GREEN Phase
 * 「あっ！」レベル洞察生成システム
 *
 * HaQei哲学の核心実装：3分人の易経メタファーから深い洞察を生成
 *
 * @description
 * このモジュールは、BunJinAnalyzerモジュールで算出された3分人の卦組み合わせから、
 * 意外な発見・パラドックス・隠れた強みを発見し、統合的な成長方向を提示します。
 *
 * @philosophy
 * - **意外性の価値**: 「そんなことがわかるの？」レベルの驚き創出
 * - **パラドックスの受容**: 矛盾を統合する智慧の提示
 * - **隠れた強みの発見**: 「弱み」の中に「強み」を見出す視点転換
 * - **実践的統合**: 具体的で実行可能な成長戦略の提示
 *
 * @module InsightEngine
 * @version 1.0.0
 * @author HAQEI System
 */

/**
 * @typedef {Object} DeepInsights
 * @property {string[]} surprises - 意外な発見（「あっ！」ポイント）
 * @property {string[]} paradoxes - パラドックス（矛盾の統合）
 * @property {string[]} hiddenStrengths - 隠れた強み
 * @property {string} growthDirection - 成長方向
 * @property {string} integrationPath - 統合への道筋
 */

/**
 * @typedef {Object} Paradox
 * @property {string} description - パラドックスの説明
 * @property {string} integration - 統合への提案
 */

/**
 * @typedef {Object} HiddenStrength
 * @property {string} apparentWeakness - 表面的な弱み
 * @property {string} actualStrength - 実際の強み
 * @property {string} application - 活用方法
 */

/**
 * @typedef {Object} GrowthSuggestion
 * @property {string} primaryDirection - 主要成長方向
 * @property {string[]} challenges - 成長時の課題
 * @property {string[]} opportunities - 成長機会
 * @property {string[]} nextSteps - 具体的次のステップ
 */

/**
 * 64卦の基本特性データベース
 *
 * パラドックス発見・隠れた強み分析に使用
 * HexagramDBモジュールとの統合により、詳細情報を動的に取得可能。
 */
const HEXAGRAM_INSIGHTS_DB = {
  1: {
    name: '乾為天',
    core: '創造',
    shadow: '過度な理想主義',
    strength: '無限の可能性',
    paradox: '完璧を求めすぎて行動を躊躇する',
  },
  2: {
    name: '坤為地',
    core: '受容',
    shadow: '受動的すぎる',
    strength: '調和的統合力',
    paradox: '柔軟性が時として最強の力となる',
  },
  3: {
    name: '水雷屯',
    core: '困難克服',
    shadow: '困難に囚われる',
    strength: '逆境からの学び',
    paradox: '困難こそが成長の最良の機会',
  },
  4: {
    name: '山水蒙',
    core: '学習成長',
    shadow: '知識不足の不安',
    strength: '素直な学習能力',
    paradox: '無知を認めることが真の知識への第一歩',
  },
  5: {
    name: '水天需',
    core: '忍耐準備',
    shadow: '待つことへの焦り',
    strength: '適切なタイミング感覚',
    paradox: '急がば回れの智慧',
  },
  // Note: 実装拡張時は全64卦を追加
};

/**
 * パターンから深い洞察を生成
 *
 * 3分人の卦組み合わせから、表面的な分析では得られない深い洞察を生成。
 * 「あっ、そんなことがわかるの？」レベルの気づきを創出することが目標。
 *
 * @param {Object} pattern - BunJinAnalyzerで生成されたパターン
 * @returns {DeepInsights|null} 深い洞察、または入力無効時はnull
 * @example
 * const insights = generateDeepInsights(pattern);
 * // Returns: { surprises: [...], paradoxes: [...], ... }
 */
function generateDeepInsights(pattern) {
  // 入力検証
  if (!pattern || !pattern.hexagrams) {
    return null;
  }

  const { engine, interface: interfaceOS, safeMode } = pattern.hexagrams;

  // 卦番号の有効性チェック
  if (!isValidHexagram(engine) || !isValidHexagram(interfaceOS) || !isValidHexagram(safeMode)) {
    return null;
  }

  // 各要素の生成
  const surprises = generateSurprises(engine, interfaceOS, safeMode);
  const paradoxes = generateParadoxTexts(engine, interfaceOS, safeMode);
  const hiddenStrengths = generateHiddenStrengthTexts(engine, interfaceOS, safeMode);
  const growthDirection = generateGrowthDirectionText(engine, interfaceOS, safeMode);
  const integrationPath = generateIntegrationPathText(engine, interfaceOS, safeMode);

  return {
    surprises,
    paradoxes,
    hiddenStrengths,
    growthDirection,
    integrationPath,
  };
}

/**
 * パラドックス発見
 *
 * 3分人間の対立・矛盾パターンを発見し、統合への道筋を提示。
 * 「矛盾」を「複雑性の豊かさ」として再定義する視点を提供。
 *
 * @param {Object} hexagrams - 3分人の卦番号
 * @returns {Paradox[]|null} パラドックス配列、または入力無効時はnull
 * @example
 * const paradoxes = findParadoxes({ engine: 1, interface: 2, safeMode: 3 });
 * // Returns: [{ description: '...', integration: '...' }]
 */
function findParadoxes(hexagrams) {
  // 入力検証
  if (!hexagrams || typeof hexagrams !== 'object') {
    return null;
  }

  const { engine, interface: interfaceOS, safeMode } = hexagrams;

  // 卦番号の有効性チェック
  if (!isValidHexagram(engine) || !isValidHexagram(interfaceOS) || !isValidHexagram(safeMode)) {
    return null;
  }

  const paradoxes = [];

  // Engine-Interface パラドックス
  const engineInterfaceParadox = analyzeEngineInterfaceParadox(engine, interfaceOS);
  if (engineInterfaceParadox) {
    paradoxes.push(engineInterfaceParadox);
  }

  // Engine-SafeMode パラドックス
  const engineSafeModeParadox = analyzeEngineSafeModeParadox(engine, safeMode);
  if (engineSafeModeParadox) {
    paradoxes.push(engineSafeModeParadox);
  }

  // Interface-SafeMode パラドックス
  const interfaceSafeModeParadox = analyzeInterfaceSafeModeParadox(interfaceOS, safeMode);
  if (interfaceSafeModeParadox) {
    paradoxes.push(interfaceSafeModeParadox);
  }

  return paradoxes.length > 0 ? paradoxes : [];
}

/**
 * 隠れた強み発見
 *
 * 「弱み」や「問題」と思われる特性の中に隠された強みを発見。
 * ポジティブ・リフレーミングにより、新たな自己理解を促進。
 *
 * @param {Object} hexagrams - 3分人の卦番号
 * @returns {HiddenStrength[]|null} 隠れた強み配列、または入力無効時はnull
 * @example
 * const strengths = discoverHiddenStrengths({ engine: 1, interface: 2, safeMode: 3 });
 * // Returns: [{ apparentWeakness: '...', actualStrength: '...', application: '...' }]
 */
function discoverHiddenStrengths(hexagrams) {
  // 入力検証
  if (!hexagrams || typeof hexagrams !== 'object') {
    return null;
  }

  const { engine, interface: interfaceOS, safeMode } = hexagrams;

  // 卦番号の有効性チェック
  if (!isValidHexagram(engine) || !isValidHexagram(interfaceOS) || !isValidHexagram(safeMode)) {
    return null;
  }

  const hiddenStrengths = [];

  // Engine分人の隠れた強み
  const engineStrength = analyzeEngineHiddenStrength(engine);
  if (engineStrength) {
    hiddenStrengths.push(engineStrength);
  }

  // Interface分人の隠れた強み
  const interfaceStrength = analyzeInterfaceHiddenStrength(interfaceOS);
  if (interfaceStrength) {
    hiddenStrengths.push(interfaceStrength);
  }

  // SafeMode分人の隠れた強み
  const safeModeStrength = analyzeSafeModeHiddenStrength(safeMode);
  if (safeModeStrength) {
    hiddenStrengths.push(safeModeStrength);
  }

  return hiddenStrengths.length > 0 ? hiddenStrengths : [];
}

/**
 * 成長方向提示
 *
 * 3分人の統合的発展に向けた具体的で実行可能な成長戦略を提示。
 * バランス・調和・統合の3段階で成長プロセスを構造化。
 *
 * @param {Object} hexagrams - 3分人の卦番号
 * @returns {GrowthSuggestion|null} 成長提案、または入力無効時はnull
 * @example
 * const growth = suggestGrowthDirection({ engine: 1, interface: 2, safeMode: 3 });
 * // Returns: { primaryDirection: '...', challenges: [...], opportunities: [...], nextSteps: [...] }
 */
function suggestGrowthDirection(hexagrams) {
  // 入力検証
  if (!hexagrams || typeof hexagrams !== 'object') {
    return null;
  }

  const { engine, interface: interfaceOS, safeMode } = hexagrams;

  // 卦番号の有効性チェック
  if (!isValidHexagram(engine) || !isValidHexagram(interfaceOS) || !isValidHexagram(safeMode)) {
    return null;
  }

  // 主要成長方向の決定
  const primaryDirection = determinePrimaryGrowthDirection(engine, interfaceOS, safeMode);

  // 成長時の課題分析
  const challenges = analyzeGrowthChallenges();

  // 成長機会の特定
  const opportunities = identifyGrowthOpportunities();

  // 具体的次のステップ
  const nextSteps = generateNextSteps();

  return {
    primaryDirection,
    challenges,
    opportunities,
    nextSteps,
  };
}

// =============================================================================
// ヘルパー関数群
// =============================================================================

/**
 * 卦番号の有効性検証
 */
function isValidHexagram(hexagram) {
  return Number.isInteger(hexagram) && hexagram >= 1 && hexagram <= 64;
}

/**
 * 意外な発見生成
 */
function generateSurprises(engine, interfaceOS, safeMode) {
  const engineInfo = getHexagramInfo(engine);
  const interfaceInfo = getHexagramInfo(interfaceOS);
  const safeModeInfo = getHexagramInfo(safeMode);

  return [
    `あなたの本質的価値観（${engineInfo.name}）と社会的表現（${interfaceInfo.name}）の組み合わせは、262,144パターン中でも特に${engine === interfaceOS ? '一致' : '対照的'}な特徴を持っています。`,
    `防御システム（${safeModeInfo.name}）の「${safeModeInfo.core}」は、実はあなたの最も創造的な源泉である可能性が高いです。`,
    `3つの分人が完全に統合された時、あなたは「${generateIntegratedPersonality(engine, interfaceOS, safeMode)}」という稀有な人格を発揮します。`,
  ];
}

/**
 * パラドックステキスト生成
 */
function generateParadoxTexts(engine, interfaceOS, safeMode) {
  const paradoxes = findParadoxes({ engine, interface: interfaceOS, safeMode });
  return paradoxes ? paradoxes.map((p) => p.description) : [];
}

/**
 * 隠れた強みテキスト生成
 */
function generateHiddenStrengthTexts(engine, interfaceOS, safeMode) {
  const strengths = discoverHiddenStrengths({ engine, interface: interfaceOS, safeMode });
  return strengths ? strengths.map((s) => `${s.apparentWeakness} → ${s.actualStrength}`) : [];
}

/**
 * 成長方向テキスト生成
 */
function generateGrowthDirectionText(engine, interfaceOS, safeMode) {
  const suggestion = suggestGrowthDirection({ engine, interface: interfaceOS, safeMode });
  return suggestion
    ? suggestion.primaryDirection
    : '統合的な成長に向かって進むことが推奨されます。';
}

/**
 * 統合パステキスト生成
 */
function generateIntegrationPathText(engine, interfaceOS, safeMode) {
  const engineInfo = getHexagramInfo(engine);
  const interfaceInfo = getHexagramInfo(interfaceOS);
  const safeModeInfo = getHexagramInfo(safeMode);

  return `${engineInfo.core}の力を核として、${interfaceInfo.core}を社会的表現手段として活用し、${safeModeInfo.core}を統合的な成長基盤として機能させることで、3分人の完全な調和が実現されます。`;
}

/**
 * Engine-Interface パラドックス分析
 */
function analyzeEngineInterfaceParadox(engine, interfaceOS) {
  const engineInfo = getHexagramInfo(engine);
  const interfaceInfo = getHexagramInfo(interfaceOS);

  // 簡易実装：対照的な特性の場合
  if (engine !== interfaceOS) {
    return {
      description: `内なる「${engineInfo.core}」と社会的な「${interfaceInfo.core}」の間に緊張があります。しかし、この対立こそがあなたの複雑で豊かな人格の源泉です。`,
      integration: `${engineInfo.core}を内的指針として保ちながら、状況に応じて${interfaceInfo.core}を適切に表現することで、両方の強みを活用できます。`,
    };
  }
  return null;
}

/**
 * Engine-SafeMode パラドックス分析
 */
function analyzeEngineSafeModeParadox(engine, safeMode) {
  const engineInfo = getHexagramInfo(engine);
  const safeModeInfo = getHexagramInfo(safeMode);

  return {
    description: `理想的自己（${engineInfo.core}）と防御的自己（${safeModeInfo.core}）の間に興味深いバランスがあります。`,
    integration: `${engineInfo.core}を追求する際に${safeModeInfo.core}の智慧を活用することで、持続可能な成長が可能になります。`,
  };
}

/**
 * Interface-SafeMode パラドックス分析
 */
function analyzeInterfaceSafeModeParadox(interfaceOS, safeMode) {
  const interfaceInfo = getHexagramInfo(interfaceOS);
  const safeModeInfo = getHexagramInfo(safeMode);

  return {
    description: `社会的表現（${interfaceInfo.core}）と防御機制（${safeModeInfo.core}）の使い分けに特徴があります。`,
    integration: `場面に応じて${interfaceInfo.core}と${safeModeInfo.core}を適切に選択することで、柔軟で戦略的な行動が可能になります。`,
  };
}

/**
 * Engine隠れた強み分析
 */
function analyzeEngineHiddenStrength(engine) {
  const engineInfo = getHexagramInfo(engine);

  return {
    apparentWeakness: engineInfo.shadow || '理想主義的すぎる',
    actualStrength: engineInfo.strength || '明確な価値観を持つ力',
    application: `${engineInfo.core}の特性を、判断基準として活用することで一貫性のある選択が可能になります。`,
  };
}

/**
 * Interface隠れた強み分析
 */
function analyzeInterfaceHiddenStrength(interfaceOS) {
  const interfaceInfo = getHexagramInfo(interfaceOS);

  return {
    apparentWeakness: interfaceInfo.shadow || '表面的に見える',
    actualStrength: interfaceInfo.strength || '社会的適応力',
    application: `${interfaceInfo.core}の能力を、チームワークやコミュニケーションで発揮することで影響力を拡大できます。`,
  };
}

/**
 * SafeMode隠れた強み分析
 */
function analyzeSafeModeHiddenStrength(safeMode) {
  const safeModeInfo = getHexagramInfo(safeMode);

  return {
    apparentWeakness: safeModeInfo.shadow || '消極的に見える',
    actualStrength: safeModeInfo.strength || 'リスク管理能力',
    application: `${safeModeInfo.core}の智慧を、長期戦略の立案で活用することで安定した成長が可能になります。`,
  };
}

/**
 * 主要成長方向決定
 */
function determinePrimaryGrowthDirection(engine, interfaceOS, safeMode) {
  const engineInfo = getHexagramInfo(engine);
  const interfaceInfo = getHexagramInfo(interfaceOS);
  const safeModeInfo = getHexagramInfo(safeMode);

  return `${engineInfo.core}を核とした価値観を大切にしながら、${interfaceInfo.core}による社会的表現力を向上させ、${safeModeInfo.core}の智慧でリスクを管理する統合的アプローチが最適な成長方向です。`;
}

/**
 * 成長時の課題分析
 */
function analyzeGrowthChallenges() {
  return [
    '3分人間のバランス調整の困難さ',
    '状況に応じた適切な分人選択の判断',
    '統合的視点の維持と実践',
  ];
}

/**
 * 成長機会特定
 */
function identifyGrowthOpportunities() {
  return [
    '多様な状況での柔軟な対応能力の向上',
    '複雑性を受容する統合的思考の発達',
    '自己理解の深化による戦略的選択の精度向上',
  ];
}

/**
 * 具体的次ステップ生成
 */
function generateNextSteps() {
  return [
    '日常で3つの分人の働きを意識的に観察する',
    '各分人の特性を活かす具体的場面を特定する',
    '分人間の対立が生じた時の統合方法を実践する',
  ];
}

/**
 * 統合人格生成
 */
function generateIntegratedPersonality(engine, interfaceOS, safeMode) {
  const engineInfo = getHexagramInfo(engine);
  const interfaceInfo = getHexagramInfo(interfaceOS);
  const safeModeInfo = getHexagramInfo(safeMode);

  return `${engineInfo.core}的${interfaceInfo.core}者with${safeModeInfo.core}`;
}

/**
 * 卦情報取得
 */
function getHexagramInfo(hexagramId) {
  return (
    HEXAGRAM_INSIGHTS_DB[hexagramId] || {
      name: `第${hexagramId}卦`,
      core: '未定義',
      shadow: '不明',
      strength: '隠れた可能性',
      paradox: '複雑性の受容',
    }
  );
}

/**
 * Module exports for InsightEngine
 * @namespace InsightEngine
 */
module.exports = {
  generateDeepInsights,
  findParadoxes,
  discoverHiddenStrengths,
  suggestGrowthDirection,

  // Export constants for testing and integration
  constants: {
    MAX_SURPRISES: 5,
    MAX_PARADOXES: 3,
    MAX_HIDDEN_STRENGTHS: 3,
    HEXAGRAM_INSIGHTS_COUNT: Object.keys(HEXAGRAM_INSIGHTS_DB).length,
  },
};
