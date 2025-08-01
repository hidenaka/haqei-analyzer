/**
 * 状況分析システム用Web Worker
 * 
 * 目的：
 * - 重い計算処理をバックグラウンドスレッドで実行
 * - UIスレッドのブロッキングを防止
 * - レスポンシブなユーザー体験の提供
 */

// 必要なスクリプトの読み込み
self.importScripts(
  './HexagramDatabase.js',
  './TextVectorizer.js',
  './SituationClassifier.js',
  './DynamicIChingMapper.js'
);

// グローバル変数
let vectorizer = null;
let classifier = null;
let mapper = null;
let initialized = false;

/**
 * Worker初期化
 * 
 * 目的：
 * - 各分析コンポーネントのインスタンス化
 * - 初期化エラーの処理
 * 
 * 処理内容：
 * 1. 各コンポーネントのインスタンス作成
 * 2. 初期化成功/失敗の通知
 * 
 * 副作用：
 * - グローバル変数の更新
 * - メインスレッドへのメッセージ送信
 */
function initialize() {
  try {
    vectorizer = new TextVectorizer();
    classifier = new SituationClassifier();
    mapper = new DynamicIChingMapper();
    initialized = true;
    
    self.postMessage({
      type: 'initialized',
      success: true
    });
  } catch (error) {
    self.postMessage({
      type: 'initialized',
      success: false,
      error: {
        message: error.message,
        stack: error.stack
      }
    });
  }
}

/**
 * テキスト分析の実行
 * 
 * 目的：
 * - メインスレッドから受け取ったテキストを分析
 * - 各フェーズの進捗を報告
 * 
 * 入力：
 * @param {string} text - 分析対象テキスト
 * @param {string} requestId - リクエスト識別子
 * @param {Object} options - 分析オプション
 * 
 * 処理内容：
 * 1. ベクトル化
 * 2. 状況分類
 * 3. 易経マッピング
 * 4. 結果の統合
 * 
 * 副作用：
 * - 各フェーズでプログレス通知
 * - 完了時に結果送信
 * - エラー時にエラー通知
 */
async function analyzeText(text, requestId, options = {}) {
  if (!initialized) {
    self.postMessage({
      type: 'error',
      requestId,
      error: {
        message: 'Worker not initialized',
        phase: 'initialization'
      }
    });
    return;
  }
  
  try {
    // Phase 1: ベクトル化
    self.postMessage({
      type: 'progress',
      requestId,
      phase: 'vectorization',
      progress: 0
    });
    
    const vectorResult = vectorizer.vectorize(text);
    
    self.postMessage({
      type: 'progress',
      requestId,
      phase: 'vectorization',
      progress: 25
    });
    
    // Phase 2: 状況分類
    self.postMessage({
      type: 'progress',
      requestId,
      phase: 'classification',
      progress: 25
    });
    
    const situationAnalysis = classifier.analyzeSituation(text);
    
    self.postMessage({
      type: 'progress',
      requestId,
      phase: 'classification',
      progress: 50
    });
    
    // Phase 3: 易経マッピング
    self.postMessage({
      type: 'progress',
      requestId,
      phase: 'mapping',
      progress: 50
    });
    
    const ichingResult = mapper.mapToHexagram(situationAnalysis);
    
    self.postMessage({
      type: 'progress',
      requestId,
      phase: 'mapping',
      progress: 75
    });
    
    // Phase 4: 結果統合
    self.postMessage({
      type: 'progress',
      requestId,
      phase: 'integration',
      progress: 75
    });
    
    const integratedResult = integrateResults(
      text,
      vectorResult,
      situationAnalysis,
      ichingResult,
      options
    );
    
    self.postMessage({
      type: 'progress',
      requestId,
      phase: 'complete',
      progress: 100
    });
    
    // 結果送信
    self.postMessage({
      type: 'result',
      requestId,
      result: integratedResult
    });
    
  } catch (error) {
    self.postMessage({
      type: 'error',
      requestId,
      error: {
        message: error.message,
        stack: error.stack,
        phase: getCurrentPhase()
      }
    });
  }
}

/**
 * 結果の統合（簡易版）
 * 
 * 目的：
 * - 各分析結果を統合して最終結果を生成
 * 
 * 入力：
 * @param {string} text - 元のテキスト
 * @param {Object} vectorResult - ベクトル化結果
 * @param {Object} situationAnalysis - 状況分析結果
 * @param {Object} ichingResult - 易経マッピング結果
 * @param {Object} options - オプション
 * 
 * 出力：
 * @returns {Object} 統合された分析結果
 */
function integrateResults(text, vectorResult, situationAnalysis, ichingResult, options) {
  return {
    input: {
      text: text,
      length: text.length,
      timestamp: new Date().toISOString()
    },
    
    vectorization: {
      features: vectorResult.features,
      featureImportance: analyzeFeatureImportance(vectorResult)
    },
    
    situation: {
      archetype: {
        primary: situationAnalysis.archetype.primary,
        score: situationAnalysis.archetype.score,
        name: getArchetypeName(situationAnalysis.archetype.primary)
      },
      temporal: situationAnalysis.temporal,
      dynamics: situationAnalysis.dynamics,
      relationships: situationAnalysis.relationships,
      emotions: situationAnalysis.emotions,
      confidence: situationAnalysis.confidence
    },
    
    iching: {
      hexagram: {
        number: ichingResult.primary.hexagram,
        name: ichingResult.primary.essence.name || `第${ichingResult.primary.hexagram}卦`,
        essence: ichingResult.primary.essence
      },
      line: ichingResult.line,
      alternatives: ichingResult.alternatives.map(alt => ({
        number: alt.hexagram,
        name: alt.essence.name || `第${alt.hexagram}卦`,
        score: alt.score
      })),
      interpretation: ichingResult.interpretation,
      confidence: ichingResult.confidence
    },
    
    metadata: {
      analysisVersion: '2.0',
      totalConfidence: calculateTotalConfidence(situationAnalysis, ichingResult),
      processingSteps: ['vectorization', 'situation_analysis', 'iching_mapping'],
      options: options
    }
  };
}

/**
 * 特徴重要度の分析（簡易版）
 */
function analyzeFeatureImportance(vectorResult) {
  const importance = {
    emotional: 0.3,
    temporal: 0.2,
    relational: 0.3,
    structural: 0.2
  };
  
  return importance;
}

/**
 * アーキタイプ名の取得
 */
function getArchetypeName(archetype) {
  const names = {
    creation: '創始期',
    development: '発展期',
    transformation: '変革期',
    maturity: '成熟期'
  };
  
  return names[archetype] || archetype;
}

/**
 * 総合信頼度の計算
 */
function calculateTotalConfidence(situationAnalysis, ichingResult) {
  return (situationAnalysis.confidence * 0.4 + ichingResult.confidence * 0.6);
}

/**
 * 現在のフェーズ取得（エラー報告用）
 */
let currentPhase = 'initialization';

function getCurrentPhase() {
  return currentPhase;
}

/**
 * メッセージ受信ハンドラー
 * 
 * 目的：
 * - メインスレッドからのメッセージを処理
 * - 適切なアクションを実行
 * 
 * 処理内容：
 * 1. メッセージタイプの判定
 * 2. 対応する処理の実行
 * 3. エラーハンドリング
 */
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'initialize':
      initialize();
      break;
      
    case 'analyze':
      currentPhase = 'analysis';
      analyzeText(data.text, data.requestId, data.options);
      break;
      
    case 'ping':
      // ヘルスチェック用
      self.postMessage({ type: 'pong' });
      break;
      
    default:
      self.postMessage({
        type: 'error',
        error: {
          message: `Unknown message type: ${type}`
        }
      });
  }
});

// Worker起動時の自動初期化
initialize();