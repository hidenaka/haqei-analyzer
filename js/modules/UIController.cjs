/**
 * UIController Module - TDD GREEN Phase
 * 段階的表示制御・ユーザーインターフェースシステム
 *
 * HaQei哲学のUI実装：3分人結果の段階的表示とインタラクション
 *
 * @description
 * このモジュールは、results.htmlでの3分人分析結果表示を制御します。
 * Phase 1（基本表示）とPhase 2（詳細表示）の段階的ロードを管理し、
 * ユーザーフレンドリーなインタラクションを提供します。
 *
 * @philosophy
 * - **段階的体験**: Phase 1→2の自然な情報展開
 * - **直感的操作**: クリック一つで詳細情報にアクセス
 * - **視覚的調和**: 3分人カードの美しいレイアウト
 * - **エラー配慮**: ユーザーに優しいエラーハンドリング
 *
 * @module UIController
 * @version 1.0.0
 * @author HAQEI System
 */

/**
 * @typedef {Object} InteractionAnalysis
 * @property {string} harmony - 協調パターンの説明
 * @property {string} conflict - 対立パターンの説明
 * @property {string} growth - 成長方向の説明
 * @property {Array} paradoxes - パラドックス配列
 * @property {Array} hiddenStrengths - 隠れた強み配列
 */

/**
 * UI状態管理
 */
const UIState = {
  currentPattern: null,
  basicModeActive: true,
  detailedModeActive: false,
  loadedDetailedViews: new Set(),
  currentError: null,
};

/**
 * 分人カード表示テンプレート
 */
const BUNJIN_CARD_TEMPLATES = {
  engine: {
    title: 'Engine分人',
    subtitle: '本質的価値観システム',
    description: 'あなたの核となる価値判断の基準',
    color: '#FF6B6B',
    icon: '⚡',
  },
  interface: {
    title: 'Interface分人',
    subtitle: '社会的役割表現システム',
    description: '他者に見せる自分・社会的適応',
    color: '#4ECDC4',
    icon: '🌐',
  },
  safeMode: {
    title: 'SafeMode分人',
    subtitle: '防御・保護システム',
    description: '困難時の自分・ストレス対処',
    color: '#45B7D1',
    icon: '🛡️',
  },
};

/**
 * 初期表示の実行
 *
 * 3分人パターンを受け取り、results.htmlの初期レイアウトを構築。
 * Phase 1の基本情報表示を行い、Phase 2への導線を設定。
 *
 * @param {Object} pattern - BunJinAnalyzerで生成されたパターン
 * @returns {boolean} 成功時true、失敗時false
 * @example
 * const success = initializeDisplay(pattern);
 * // DOM elements populated, basic mode activated
 */
function initializeDisplay(pattern) {
  // 入力検証
  if (!pattern || !pattern.hexagrams || !pattern.id) {
    UIState.currentError = 'Invalid pattern data';
    return false;
  }

  try {
    // 状態更新
    UIState.currentPattern = pattern;
    UIState.basicModeActive = true;
    UIState.detailedModeActive = false;
    UIState.loadedDetailedViews.clear();

    // パターンヘッダー表示
    renderPatternHeader(pattern);

    // 3分人カードグリッド表示
    renderBunJinGrid(pattern);

    // インタラクションセクション基本表示
    renderBasicInteractions();

    return true;
  } catch (error) {
    UIState.currentError = error.message;
    return false;
  }
}

/**
 * 詳細表示の読み込み
 *
 * 指定された分人の詳細情報を非同期で読み込み、Phase 2表示を実現。
 * HexagramDBとInsightEngineとの連携で深い洞察を提供。
 *
 * @param {string} bunJinType - 'engine', 'interface', 'safeMode'のいずれか
 * @returns {Promise<boolean>} 成功時true、失敗時false
 * @example
 * await loadDetailedView('engine');
 * // Detailed information loaded and displayed
 */
async function loadDetailedView(bunJinType) {
  // 入力検証
  if (!['engine', 'interface', 'safeMode'].includes(bunJinType)) {
    return false;
  }

  if (!UIState.currentPattern) {
    return false;
  }

  try {
    // Phase 2モード有効化
    UIState.detailedModeActive = true;
    UIState.loadedDetailedViews.add(bunJinType);

    // 詳細データ読み込み（模擬実装）
    await simulateDetailedDataLoading(bunJinType);

    // 詳細表示レンダリング
    renderDetailedCard(bunJinType);

    return true;
  } catch (error) {
    UIState.currentError = error.message;
    return false;
  }
}

/**
 * 相互作用分析の表示
 *
 * InsightEngineで生成された分人間相互作用分析を表示。
 * 協調・対立・成長の3つの観点とパラドックス・隠れた強みを統合表示。
 *
 * @param {InteractionAnalysis} interactions - 相互作用分析データ
 * @returns {boolean} 成功時true、失敗時false
 * @example
 * displayInteractions(interactionAnalysis);
 * // Interaction section populated with analysis
 */
function displayInteractions(interactions) {
  // 入力検証
  if (!interactions || typeof interactions !== 'object') {
    return false;
  }

  try {
    // インタラクションセクション取得
    const interactionElement = getElementById('interaction-section');
    if (!interactionElement) {
      return false;
    }

    // 相互作用分析HTML生成
    const interactionHTML = generateInteractionHTML(interactions);
    interactionElement.innerHTML = interactionHTML;

    return true;
  } catch (error) {
    UIState.currentError = error.message;
    return false;
  }
}

/**
 * エラーハンドリング
 *
 * ユーザーフレンドリーなエラー表示を提供。
 * エラーコンテキストに応じた適切なメッセージとリカバリー方法を提示。
 *
 * @param {Error} error - エラーオブジェクト
 * @param {string} context - エラー発生コンテキスト
 * @returns {boolean} 常にtrue（エラー処理完了）
 * @example
 * handleError(new Error('Network timeout'), 'api-call');
 * // User-friendly error message displayed
 */
function handleError(error, context) {
  // エラー情報保存
  UIState.currentError = {
    message: error.message,
    context: context,
    timestamp: new Date().toISOString(),
  };

  try {
    // エラーメッセージの生成
    const userFriendlyMessage = generateErrorMessage(error, context);

    // エラー表示エリア取得または作成
    let errorElement = getElementById('error-display');
    if (!errorElement) {
      errorElement = createErrorDisplayElement();
    }

    // エラー表示
    errorElement.innerHTML = userFriendlyMessage;
    errorElement.style.display = 'block';

    // エラーログ記録（本番環境では適切なログシステムに送信）
    if (typeof window !== 'undefined' && window.console) {
      window.console.error(`UIController Error [${context}]:`, error.message);
    }

    return true;
  } catch (displayError) {
    // フォールバック：コンソールエラーのみ
    if (typeof window !== 'undefined' && window.console) {
      window.console.error('UIController: Failed to display error message', displayError);
      window.console.error('Original error:', error.message);
    }
    return true;
  }
}

/**
 * 基本モード状態確認
 *
 * 現在Phase 1基本モードが有効かどうかを確認。
 *
 * @returns {boolean} 基本モードが有効な場合true
 */
function isBasicMode() {
  return UIState.basicModeActive;
}

/**
 * 詳細モード状態確認
 *
 * 現在Phase 2詳細モードが有効かどうかを確認。
 *
 * @returns {boolean} 詳細モードが有効な場合true
 */
function isDetailedMode() {
  return UIState.detailedModeActive;
}

/**
 * UI状態リセット（テスト用）
 *
 * UIStateを初期状態にリセット。主にテスト環境での状態クリア用。
 *
 * @returns {boolean} 常にtrue
 */
function resetUIState() {
  UIState.currentPattern = null;
  UIState.basicModeActive = true;
  UIState.detailedModeActive = false;
  UIState.loadedDetailedViews.clear();
  UIState.currentError = null;
  return true;
}

// =============================================================================
// ヘルパー関数群（DOM操作・HTML生成）
// =============================================================================

/**
 * パターンヘッダーレンダリング
 */
function renderPatternHeader(pattern) {
  const headerElement = getElementById('pattern-header');
  if (!headerElement) return;

  headerElement.innerHTML = `
    <div class="pattern-info">
      <h1 class="pattern-id">パターン ${pattern.id}</h1>
      <p class="pattern-total">262,144通りの中の固有パターン</p>
      <div class="pattern-stats">
        <span class="stat">Engine: ${getHexagramName(pattern.hexagrams.engine)}</span>
        <span class="stat">Interface: ${getHexagramName(pattern.hexagrams.interface)}</span>
        <span class="stat">SafeMode: ${getHexagramName(pattern.hexagrams.safeMode)}</span>
      </div>
    </div>
  `;
}

/**
 * 分人グリッドレンダリング
 */
function renderBunJinGrid(pattern) {
  const gridElement = getElementById('bunjin-grid');
  if (!gridElement) return;

  const { engine, interface: interfaceOS, safeMode } = pattern.hexagrams;

  gridElement.innerHTML = `
    <div class="bunjin-card" data-type="engine">
      ${generateBunJinCardHTML('engine', engine)}
    </div>
    <div class="bunjin-card" data-type="interface">  
      ${generateBunJinCardHTML('interface', interfaceOS)}
    </div>
    <div class="bunjin-card" data-type="safeMode">
      ${generateBunJinCardHTML('safeMode', safeMode)}
    </div>
  `;
}

/**
 * 基本インタラクション表示
 */
function renderBasicInteractions() {
  const interactionElement = getElementById('interaction-section');
  if (!interactionElement) return;

  interactionElement.innerHTML = `
    <div class="interaction-basic">
      <h3>3分人の相互作用</h3>
      <p>あなたの3つの分人システムの相互作用分析です。</p>
      <div class="load-detailed-button">
        <button onclick="loadFullInteractionAnalysis()">詳細な相互作用を見る</button>
      </div>
    </div>
  `;
}

/**
 * 詳細カードレンダリング
 */
function renderDetailedCard(bunJinType) {
  const cardElement = document.querySelector(`[data-type="${bunJinType}"]`);
  if (!cardElement) return;

  const template = BUNJIN_CARD_TEMPLATES[bunJinType];
  const hexagramId = UIState.currentPattern.hexagrams[bunJinType];

  // 詳細情報追加
  const detailedInfo = `
    <div class="detailed-info">
      <h4>詳細分析</h4>
      <p>卦: ${getHexagramName(hexagramId)}</p>
      <p>特性: ${getHexagramTrait(hexagramId)}</p>
      <p>役割: ${template.description}</p>
    </div>
  `;

  cardElement.innerHTML += detailedInfo;
  cardElement.classList.add('detailed-loaded');
}

/**
 * 分人カードHTML生成
 */
function generateBunJinCardHTML(bunJinType, hexagramId) {
  const template = BUNJIN_CARD_TEMPLATES[bunJinType];

  return `
    <div class="card-header" style="background-color: ${template.color}">
      <span class="card-icon">${template.icon}</span>
      <h3 class="card-title">${template.title}</h3>
    </div>
    <div class="card-content">
      <h4 class="card-subtitle">${template.subtitle}</h4>
      <p class="card-hexagram">${getHexagramName(hexagramId)}</p>
      <p class="card-description">${template.description}</p>
      <button class="detail-button" onclick="loadDetailedView('${bunJinType}')">詳しく見る</button>
    </div>
  `;
}

/**
 * 相互作用HTML生成
 */
function generateInteractionHTML(interactions) {
  return `
    <div class="interaction-analysis">
      <h3>相互作用分析</h3>
      
      <div class="harmony-section">
        <h4>🌟 調和パターン</h4>
        <p>${interactions.harmony}</p>
      </div>
      
      <div class="conflict-section">
        <h4>⚡ 対立パターン</h4>
        <p>${interactions.conflict}</p>
      </div>
      
      <div class="growth-section">
        <h4>🚀 成長方向</h4>
        <p>${interactions.growth}</p>
      </div>
      
      ${interactions.paradoxes ? generateParadoxesHTML(interactions.paradoxes) : ''}
      ${interactions.hiddenStrengths ? generateHiddenStrengthsHTML(interactions.hiddenStrengths) : ''}
    </div>
  `;
}

/**
 * パラドックスHTML生成
 */
function generateParadoxesHTML(paradoxes) {
  if (!Array.isArray(paradoxes) || paradoxes.length === 0) return '';

  const paradoxItems = paradoxes
    .map(
      (paradox) => `
    <div class="paradox-item">
      <h5>矛盾の発見</h5>
      <p>${paradox.description}</p>
      <h5>統合への道</h5>
      <p>${paradox.integration}</p>
    </div>
  `
    )
    .join('');

  return `
    <div class="paradoxes-section">
      <h4>🔄 パラドックス統合</h4>
      ${paradoxItems}
    </div>
  `;
}

/**
 * 隠れた強みHTML生成
 */
function generateHiddenStrengthsHTML(hiddenStrengths) {
  if (!Array.isArray(hiddenStrengths) || hiddenStrengths.length === 0) return '';

  const strengthItems = hiddenStrengths
    .map(
      (strength) => `
    <div class="strength-item">
      <span class="apparent-weakness">${strength.apparentWeakness}</span>
      <span class="arrow">→</span>
      <span class="actual-strength">${strength.actualStrength}</span>
    </div>
  `
    )
    .join('');

  return `
    <div class="hidden-strengths-section">
      <h4>💎 隠れた強み</h4>
      ${strengthItems}
    </div>
  `;
}

/**
 * エラーメッセージ生成
 */
function generateErrorMessage(error, context) {
  const errorMessages = {
    'data-loading': '分析データの読み込みに失敗しました。ページを再読み込みしてください。',
    'api-call': 'サーバーとの通信でエラーが発生しました。しばらく後にお試しください。',
    calculation: '分析計算でエラーが発生しました。入力データを確認してください。',
    display: '表示処理でエラーが発生しました。ブラウザを更新してください。',
  };

  const defaultMessage = 'エラーが発生しました。しばらく後にお試しください。';
  const userMessage = errorMessages[context] || defaultMessage;

  return `
    <div class="error-container">
      <h4>⚠️ エラーが発生しました</h4>
      <p>${userMessage}</p>
      <details>
        <summary>技術的詳細</summary>
        <p>Context: ${context}</p>
        <p>Error: ${error.message}</p>
      </details>
      <button onclick="location.reload()">ページを再読み込み</button>
    </div>
  `;
}

/**
 * エラー表示要素作成
 */
function createErrorDisplayElement() {
  const errorElement = document.createElement('div');
  errorElement.id = 'error-display';
  errorElement.className = 'error-display';
  errorElement.style.display = 'none';

  // ページの先頭に追加
  if (document.body) {
    document.body.insertBefore(errorElement, document.body.firstChild);
  }

  return errorElement;
}

/**
 * 詳細データ読み込みシミュレーション
 */
async function simulateDetailedDataLoading(bunJinType) {
  // Phase 2データ読み込みの模擬実装
  return new Promise((resolve) => {
    setTimeout(() => {
      // Phase 2データ読み込み完了（本番環境では適切なログ記録）
      if (typeof window !== 'undefined' && window.console && window.console.log) {
        window.console.log(`Detailed data loaded for ${bunJinType}`);
      }
      resolve();
    }, 500); // 500ms模擬遅延
  });
}

/**
 * DOM要素取得ヘルパー
 */
function getElementById(id) {
  // テスト環境対応
  if (typeof document !== 'undefined' && document.getElementById) {
    return document.getElementById(id);
  }
  // モック環境での代替実装
  return { innerHTML: '', style: {} };
}

/**
 * 卦名取得ヘルパー
 */
function getHexagramName(hexagramId) {
  const hexagramNames = {
    1: '乾為天',
    2: '坤為地',
    3: '水雷屯',
    4: '山水蒙',
    5: '水天需',
    // 簡易実装：必要に応じて64卦まで拡張
  };
  return hexagramNames[hexagramId] || `第${hexagramId}卦`;
}

/**
 * 卦特性取得ヘルパー
 */
function getHexagramTrait(hexagramId) {
  const hexagramTraits = {
    1: '創造的理想主義',
    2: '受容的協調主義',
    3: '困難克服型',
    4: '学習成長型',
    5: '忍耐準備型',
    // 簡易実装：必要に応じて64卦まで拡張
  };
  return hexagramTraits[hexagramId] || '特性分析中';
}

/**
 * Module exports for UIController
 * @namespace UIController
 */
module.exports = {
  initializeDisplay,
  loadDetailedView,
  displayInteractions,
  handleError,
  isBasicMode,
  isDetailedMode,
  resetUIState,

  // Export constants for testing and integration
  constants: {
    BUNJIN_TYPES: ['engine', 'interface', 'safeMode'],
    ERROR_CONTEXTS: ['data-loading', 'api-call', 'calculation', 'display'],
    UI_STATES: ['basic', 'detailed', 'error'],
  },
};
