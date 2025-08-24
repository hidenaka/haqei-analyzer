/**
 * Future Simulator v4.3.1 実装
 * 実装指示書に基づく完全リファクタリング版
 */

// ========================================
// 1. 型定義とコントラクト
// ========================================

/**
 * @typedef {'JJJ'|'JJH'|'JHJ'|'JHH'|'HJJ'|'HJH'|'HHJ'|'HHH'} ScenarioId
 * @typedef {1|2|3|4|5|6} LineNum
 * @typedef {0|1|2} TimePoint
 * 
 * @typedef {{
 *   safety: number;
 *   stability: number;
 *   potential: number;
 * }} Metrics
 * 
 * @typedef {{
 *   t: TimePoint;
 *   fromHex: number;
 *   op: '進爻'|'変爻';
 *   line?: LineNum;
 *   toHex: number;
 *   note: string;
 *   metrics: Metrics;
 * }} Stage
 * 
 * @typedef {{
 *   id: ScenarioId;
 *   path: [Stage, Stage, Stage];
 *   summary: string;
 *   glossary: Array<{term: string; tip: string}>;
 * }} Scenario
 */

// 専門用語→平易文の置換テーブル
const TERM_REPLACEMENTS = {
  '両者敗北': 'どちらも得をしにくい条件',
  '進爻': '状況を一歩進める判断',
  '変爻': '方向を切り替える判断',
  '六三': '第3段階',
  '九二': '第2段階',
  '初九': '第1段階',
  '上九': '最終段階',
  '用九': '純陽の力',
  '用六': '純陰の力'
};

// 平易文テンプレート
const NOTE_TEMPLATES = {
  0: [
    '今は土台づくりが大切です。無理な拡大より、今できることを確実に進めましょう。',
    'まずは足元を固めることから始めてください。急がば回れの精神が大切です。',
    '基礎をしっかりと築く時期です。焦らず着実に進めていきましょう。'
  ],
  1: [
    '小さく切り替えると流れが整います。やり方を一部見直し、負担を減らしてください。',
    '少し方向を調整することで、新しい可能性が開けます。',
    '今が転換点です。柔軟に対応することで道が開けるでしょう。'
  ],
  2: [
    '安定を確認して次の挑戦へ。続ける/変えるの判断基準を明文化しておきましょう。',
    'これまでの経験を活かして、次のステップへ進む準備が整いました。',
    '成果が見え始めています。この調子で進めていきましょう。'
  ]
};

// ========================================
// 2. ユーティリティ関数
// ========================================

function byId(id) {
  return document.getElementById(id);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function newTraceId(rng) {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0];
  const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-');
  const random = Math.floor(rng.next() * 10000).toString().padStart(4, '0');
  return `FS-${dateStr}-${timeStr}-${random}`;
}

function showUserMessage(message, type = 'info') {
  const bar = document.createElement('div');
  bar.textContent = message;
  bar.style.cssText = `
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 16px;
    padding: 10px 14px;
    border-radius: 8px;
    color: #fff;
    font-size: 14px;
    z-index: 9999;
    background: ${type === 'error' ? '#d33' : type === 'warning' ? '#e0a800' : '#007bff'};
  `;
  document.body.appendChild(bar);
  setTimeout(() => bar.remove(), 2500);
}

function validateInput(text) {
  if (!text) return { valid: false, message: 'テキストを入力してください' };
  if (text.length < 10) return { valid: false, message: '10文字以上で具体的に入力してください' };
  if (text.length > 1000) return { valid: false, message: '1000文字以内で入力してください' };
  return { valid: true };
}

// ========================================
// 3. 生成エンジン（3層フォールバック）
// ========================================

class FutureBranchingEngine {
  constructor({ rng, h384, mapper }) {
    this.rng = rng;
    this.h384 = h384;
    this.mapper = mapper;
  }

  /**
   * Strict mode: 形態素解析を使った高精度生成
   */
  async generateStrict(text, trace) {
    // TODO: 実際の形態素解析実装
    // 今は簡易実装
    const initialHex = this.estimateHexFromText(text);
    return this.generateFromInitialHex(initialHex, trace, 'strict');
  }

  /**
   * Heuristic mode: 簡易ヒューリスティック
   */
  async generateHeuristic(text, trace) {
    const initialHex = this.simpleHexEstimate(text);
    return this.generateFromInitialHex(initialHex, trace, 'heuristic');
  }

  /**
   * Baseline mode: 固定パス（最終安全網）
   */
  generateBaseline(trace) {
    const fixedHex = 11; // 泰
    return this.generateFromInitialHex(fixedHex, trace, 'baseline');
  }

  /**
   * 初期卦から8シナリオを生成
   */
  generateFromInitialHex(initialHex, trace, mode) {
    const scenarios = [];
    const scenarioIds = ['JJJ', 'JJH', 'JHJ', 'JHH', 'HJJ', 'HJH', 'HHJ', 'HHH'];
    
    scenarioIds.forEach(id => {
      const path = this.generatePath(initialHex, id);
      const summary = this.generateSummary(id, path);
      const glossary = this.extractGlossary(path);
      
      scenarios.push({
        id,
        path,
        summary,
        glossary,
        __meta: { mode, trace, initialHex }
      });
    });
    
    return scenarios;
  }

  /**
   * JJJ等のパターンから3段階パスを生成
   */
  generatePath(initialHex, pattern) {
    const path = [];
    let currentHex = initialHex;
    
    for (let t = 0; t < 3; t++) {
      const action = pattern[t];
      const isProgress = action === 'J';
      const op = isProgress ? '進爻' : '変爻';
      
      // 次の卦を決定
      let nextHex;
      let line = undefined;
      
      if (isProgress) {
        // 進爻: 簡易的に+1
        nextHex = (currentHex % 64) + 1;
      } else {
        // 変爻: ランダムな爻を変更
        line = Math.floor(this.rng.next() * 6) + 1;
        nextHex = this.applyLineChange(currentHex, line);
      }
      
      // メトリクス生成（0-100にクランプ）
      const metrics = {
        safety: clamp(50 + this.rng.next() * 40 - 20),
        stability: clamp(50 + this.rng.next() * 40 - 20),
        potential: clamp(50 + this.rng.next() * 40 - 20)
      };
      
      // 平易文のnote生成
      const templates = NOTE_TEMPLATES[t];
      const note = templates[Math.floor(this.rng.next() * templates.length)];
      
      path.push({
        t,
        fromHex: currentHex,
        op,
        line,
        toHex: nextHex,
        note,
        metrics
      });
      
      currentHex = nextHex;
    }
    
    return path;
  }

  /**
   * 爻変更を適用
   */
  applyLineChange(hex, line) {
    // 簡易実装: 別の卦番号を返す
    return ((hex + line * 7) % 64) + 1;
  }

  /**
   * シナリオのサマリー生成（平易文）
   */
  generateSummary(id, path) {
    const summaries = {
      'JJJ': '着実に現在の道を深めていく安定路線です。',
      'JJH': '基盤を固めてから新しい挑戦に踏み出します。',
      'JHJ': '早めに方向転換し、新たな道を開拓します。',
      'JHH': '大胆に変化を受け入れ、全く新しい境地へ。',
      'HJJ': '一度リセットしてから着実に再構築します。',
      'HJH': '変化と安定を交互に繰り返しながら進みます。',
      'HHJ': '二度の大きな転換を経て新境地に到達します。',
      'HHH': '完全な変革を通じて生まれ変わります。'
    };
    return summaries[id] || '未来への道筋を探ります。';
  }

  /**
   * 専門用語を抽出してglossaryを作成
   */
  extractGlossary(path) {
    const glossary = [];
    const usedTerms = new Set();
    
    path.forEach(stage => {
      if (stage.op && !usedTerms.has(stage.op)) {
        usedTerms.add(stage.op);
        glossary.push({
          term: stage.op,
          tip: stage.op === '進爻' ? 
            '易経で「状況を前進させる」を意味する専門用語' : 
            '易経で「状況を変化させる」を意味する専門用語'
        });
      }
    });
    
    return glossary;
  }

  /**
   * テキストから初期卦を推定（簡易版）
   */
  estimateHexFromText(text) {
    // 文字列のハッシュ値から決定（決定論的）
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash = hash & hash;
    }
    return (Math.abs(hash) % 64) + 1;
  }

  simpleHexEstimate(text) {
    // さらに簡易版
    return (text.length % 64) + 1;
  }
}

// ========================================
// 4. 描画関数（一元管理）
// ========================================

/**
 * シナリオカードを描画（唯一の描画関数）
 */
function renderScenarios(scenarios, options = {}) {
  const { trace, degraded = false, error = null } = options;
  
  assert(Array.isArray(scenarios) && scenarios.length === 8, '8件のシナリオが必要です');
  
  const container = byId('resultsContainer');
  if (!container) {
    console.error('resultsContainer not found');
    return;
  }
  
  // 既存のコンテンツをクリア
  container.innerHTML = '';
  container.style.display = 'block';
  
  // メインコンテナ作成
  const mainDiv = document.createElement('div');
  mainDiv.className = 'scenarios-main-container';
  mainDiv.style.cssText = `
    margin: 20px 0;
    padding: 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
  `;
  
  // タイトル
  const title = document.createElement('h3');
  title.style.cssText = 'color: #A78BFA; margin-bottom: 20px; font-size: 1.5rem;';
  title.textContent = '🔮 あなたの未来への8つの道筋';
  mainDiv.appendChild(title);
  
  // グリッドコンテナ
  const grid = document.createElement('div');
  grid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
  `;
  
  // 各シナリオカードを生成
  scenarios.forEach(scenario => {
    const card = createScenarioCard(scenario);
    grid.appendChild(card);
  });
  
  mainDiv.appendChild(grid);
  
  // メタ情報（トレースID等）
  if (trace) {
    const metaDiv = document.createElement('div');
    metaDiv.style.cssText = `
      margin-top: 20px;
      padding: 10px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 5px;
      font-size: 12px;
      color: #888;
    `;
    metaDiv.textContent = `Trace ID: ${trace}`;
    
    if (degraded) {
      metaDiv.style.background = 'rgba(255, 0, 0, 0.1)';
      metaDiv.style.color = '#faa';
      metaDiv.textContent += ' | ⚠️ 暫定結果（フォールバックモード）';
    }
    
    mainDiv.appendChild(metaDiv);
  }
  
  container.appendChild(mainDiv);
}

/**
 * 個別のシナリオカードを作成
 */
function createScenarioCard(scenario) {
  const card = document.createElement('div');
  card.className = 'scenario-card-v431';
  card.dataset.scenarioId = scenario.id;
  
  // カラー設定
  const colors = {
    'JJJ': '#4ade80',
    'JJH': '#60a5fa', 
    'JHJ': '#f59e0b',
    'JHH': '#ef4444',
    'HJJ': '#a78bfa',
    'HJH': '#ec4899',
    'HHJ': '#14b8a6',
    'HHH': '#f43f5e'
  };
  
  const color = colors[scenario.id] || '#888';
  
  card.style.cssText = `
    background: linear-gradient(135deg, ${color}22, ${color}11);
    border: 1px solid ${color}55;
    padding: 15px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
  `;
  
  // ヘッダー（ID表示）
  const header = document.createElement('div');
  header.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 10px;';
  header.innerHTML = `
    <span style="font-weight: bold; color: ${color};">${scenario.id}</span>
    <span style="font-size: 12px; color: #888;">クリックで詳細</span>
  `;
  card.appendChild(header);
  
  // サマリー
  const summary = document.createElement('p');
  summary.style.cssText = 'margin: 10px 0; line-height: 1.5;';
  summary.textContent = scenario.summary;
  card.appendChild(summary);
  
  // 最終到達点
  const lastStage = scenario.path[2];
  const destination = document.createElement('div');
  destination.style.cssText = 'margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: #aaa;';
  destination.textContent = `最終到達: 第${lastStage.toHex}卦`;
  card.appendChild(destination);
  
  // クリックイベント
  card.addEventListener('click', () => {
    showScenarioModal(scenario);
  });
  
  // ホバーエフェクト
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-2px)';
    card.style.boxShadow = `0 8px 25px ${color}44`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
    card.style.boxShadow = 'none';
  });
  
  return card;
}

/**
 * シナリオ詳細モーダル表示
 */
function showScenarioModal(scenario) {
  // 既存のモーダルを削除
  const existingModal = document.getElementById('scenario-modal-v431');
  if (existingModal) {
    existingModal.remove();
  }
  
  // モーダル作成
  const modal = document.createElement('div');
  modal.id = 'scenario-modal-v431';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;
  
  // モーダルコンテンツ
  const content = document.createElement('div');
  content.style.cssText = `
    background: #1a1a2e;
    border-radius: 12px;
    padding: 30px;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    color: white;
  `;
  
  // タイトル
  const title = document.createElement('h2');
  title.style.cssText = 'margin-bottom: 20px; color: #A78BFA;';
  title.textContent = `シナリオ ${scenario.id} の詳細`;
  content.appendChild(title);
  
  // 3段階タイムライン
  const timeline = document.createElement('div');
  timeline.style.cssText = 'margin: 20px 0;';
  
  scenario.path.forEach((stage, index) => {
    const stageDiv = document.createElement('div');
    stageDiv.style.cssText = `
      margin: 15px 0;
      padding: 15px;
      background: rgba(255, 255, 255, 0.05);
      border-left: 3px solid #A78BFA;
      border-radius: 5px;
    `;
    
    stageDiv.innerHTML = `
      <h4 style="color: #60a5fa; margin-bottom: 10px;">第${index + 1}段階</h4>
      <p style="margin: 10px 0;">${stage.note}</p>
      <div style="display: flex; gap: 20px; margin-top: 10px; font-size: 12px; color: #888;">
        <span>安全性: ${stage.metrics.safety.toFixed(0)}%</span>
        <span>安定性: ${stage.metrics.stability.toFixed(0)}%</span>
        <span>可能性: ${stage.metrics.potential.toFixed(0)}%</span>
      </div>
    `;
    
    timeline.appendChild(stageDiv);
  });
  
  content.appendChild(timeline);
  
  // 用語集（glossary）
  if (scenario.glossary && scenario.glossary.length > 0) {
    const glossaryDiv = document.createElement('div');
    glossaryDiv.style.cssText = `
      margin-top: 20px;
      padding: 15px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 5px;
    `;
    
    glossaryDiv.innerHTML = '<h4 style="color: #888; margin-bottom: 10px;">用語説明</h4>';
    
    scenario.glossary.forEach(item => {
      const termDiv = document.createElement('div');
      termDiv.style.cssText = 'margin: 5px 0; font-size: 12px;';
      termDiv.innerHTML = `<strong>${item.term}</strong>: ${item.tip}`;
      glossaryDiv.appendChild(termDiv);
    });
    
    content.appendChild(glossaryDiv);
  }
  
  // 閉じるボタン
  const closeBtn = document.createElement('button');
  closeBtn.style.cssText = `
    margin-top: 20px;
    padding: 10px 20px;
    background: #A78BFA;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  `;
  closeBtn.textContent = '閉じる';
  closeBtn.onclick = () => modal.remove();
  content.appendChild(closeBtn);
  
  modal.appendChild(content);
  
  // 外側クリックで閉じる
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  document.body.appendChild(modal);
}

/**
 * グラフを描画
 */
function renderCharts(scenarios) {
  // TODO: Chart.jsを使ったグラフ描画
  // 各シナリオのmetricsを時系列グラフで表示
  console.log('Charts rendering for', scenarios.length, 'scenarios');
}

// ========================================
// 5. 初期化とバインディング
// ========================================

/**
 * UIバインディング（単一点）
 */
function bindUI({ engine, rng }) {
  const input = byId('worryInput');
  const btn = byId('aiGuessBtn');
  const results = byId('resultsContainer');
  
  assert(input && btn && results, '必須DOM要素が見つかりません');
  
  // 二重バインド防止
  if (btn.dataset.bound === '1') {
    console.log('Already bound, skipping');
    return;
  }
  btn.dataset.bound = '1';
  
  // 既存のイベントリスナーを削除
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);
  
  // 処理中フラグ管理
  let isProcessing = false;
  
  // 新しいイベントリスナー
  newBtn.addEventListener('click', async () => {
    // 処理中の場合はスキップ
    if (isProcessing) {
      console.log('Already processing, skipping duplicate click');
      return;
    }
    
    const text = (input.value || '').trim();
    const validation = validateInput(text);
    
    if (!validation.valid) {
      showUserMessage(validation.message, 'warning');
      // ボタンが無効化されている場合は有効化
      newBtn.disabled = false;
      return;
    }
    
    const trace = newTraceId(rng);
    console.log('🔍 Analysis started with trace:', trace);
    
    // 処理開始
    isProcessing = true;
    newBtn.disabled = true;
    const originalText = newBtn.textContent;
    newBtn.textContent = '解析中...';
    
    // タイムアウト設定（フェールセーフ）
    const timeoutId = setTimeout(() => {
      console.warn('Analysis timeout - resetting button');
      isProcessing = false;
      newBtn.disabled = false;
      newBtn.textContent = originalText;
    }, 10000); // 10秒でタイムアウト
    
    try {
      // 3層フォールバックで生成
      let scenarios;
      let mode = 'strict';
      
      try {
        scenarios = await engine.generateStrict(text, trace);
      } catch (e1) {
        console.warn('Strict mode failed:', e1);
        mode = 'heuristic';
        try {
          scenarios = await engine.generateHeuristic(text, trace);
        } catch (e2) {
          console.warn('Heuristic mode failed:', e2);
          mode = 'baseline';
          scenarios = engine.generateBaseline(trace);
        }
      }
      
      // 描画
      renderScenarios(scenarios, { 
        trace, 
        degraded: mode === 'baseline',
        error: mode === 'baseline' ? 'フォールバックモード' : null
      });
      
      renderCharts(scenarios);
      
      // 成功メッセージ
      if (mode === 'baseline') {
        showUserMessage('暫定結果を表示しています', 'warning');
      } else {
        showUserMessage('分析が完了しました', 'info');
      }
      
    } catch (error) {
      console.error('Analysis error:', error);
      showUserMessage('エラーが発生しました', 'error');
    } finally {
      // タイムアウトをクリア
      clearTimeout(timeoutId);
      // 必ずボタンを有効化
      isProcessing = false;
      newBtn.disabled = false;
      newBtn.textContent = originalText || '分析開始';
      console.log('Button reset complete');
    }
  });
  
  console.log('✅ UI binding complete');
}

// ========================================
// 6. メイン初期化
// ========================================

async function initializeFutureSimulator() {
  try {
    console.log('🚀 Future Simulator v4.3.1 initializing...');
    
    // RNG初期化
    const seed = 12345; // TODO: configから読む
    
    // SeedableRandomフォールバック実装
    class SimpleSeedableRandom {
      constructor(seed = 12345) { 
        this.seed = seed >>> 0; 
        this.current = seed;
      }
      next() { 
        this.current = (1664525 * this.current + 1013904223) >>> 0; 
        return this.current / 2**32; 
      }
    }
    
    const rng = window.randomnessManager?.getGenerator?.('deterministic', seed) || 
                (window.SeedableRandom ? new window.SeedableRandom(seed) : new SimpleSeedableRandom(seed));
    
    // ダミーのh384とmapper（実際は既存のものを使う）
    const h384 = { load: async () => true };
    const mapper = {};
    
    // エンジン初期化
    const engine = new FutureBranchingEngine({ rng, h384, mapper });
    
    // UIバインド
    bindUI({ engine, rng });
    
    console.log('✅ Future Simulator v4.3.1 ready');
    
  } catch (error) {
    console.error('Initialization failed:', error);
    showUserMessage('初期化に失敗しました', 'error');
  }
}

// DOMContentLoadedで初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFutureSimulator);
} else {
  initializeFutureSimulator();
}

// グローバルエクスポート
window.FutureSimulatorV431 = {
  initialize: initializeFutureSimulator,
  renderScenarios,
  renderCharts
};