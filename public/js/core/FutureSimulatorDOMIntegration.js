/**
 * Future Simulator DOM Integration
 * 既存のfuture-simulator-core.jsとDOMPreserverを統合
 */

class FutureSimulatorDOMIntegration {
  constructor() {
    this.domPreserver = new window.DOMPreserver();
    this.initialized = false;
  }
  
  /**
   * 初期化 - 1度だけ実行
   */
  initialize() {
    if (this.initialized) return;
    
    console.log('🚀 Initializing Future Simulator DOM Integration');
    
    // スケルトンをマウント
    const mounted = this.domPreserver.mountSkeletonOnce();
    
    if (!mounted) {
      console.error('❌ Failed to mount DOM skeleton');
      return false;
    }
    
    this.initialized = true;
    
    // 既存のfuture-simulator-coreにフックを設定
    this.hookIntoExistingSystem();
    
    return true;
  }
  
  /**
   * 既存システムへのフック
   * innerHTML操作を差分更新に置き換え
   */
  hookIntoExistingSystem() {
    const originalDisplayAuthentic = window.haqeiFutureSimulator?.displayAuthentic386Results;
    const originalDisplayBinary = window.haqeiFutureSimulator?.displayBinaryTreeResults;
    
    if (originalDisplayAuthentic) {
      window.haqeiFutureSimulator.displayAuthentic386Results = (analysisResult) => {
        console.log('🔄 Intercepting displayAuthentic386Results');
        return this.displayResultsWithPreservation(analysisResult, originalDisplayAuthentic);
      };
    }
    
    if (originalDisplayBinary) {
      window.haqeiFutureSimulator.displayBinaryTreeResults = (analysisResult) => {
        console.log('🔄 Intercepting displayBinaryTreeResults');
        return this.displayResultsWithPreservation(analysisResult, originalDisplayBinary);
      };
    }
    
    console.log('✅ Hooked into existing display functions');
  }
  
  /**
   * Canvas要素を保護しながら結果を表示
   */
  displayResultsWithPreservation(analysisResult, originalFunction) {
    const resultsContainer = document.getElementById('resultsContainer');
    if (!resultsContainer) {
      console.error('❌ resultsContainer not found');
      return;
    }
    
    // 1. まずスケルトンが存在することを確認
    if (!this.initialized) {
      this.initialize();
    }
    
    // 2. eight-scenarios-display-containerが存在しない場合は作成
    let scenariosContainer = resultsContainer.querySelector('#eight-scenarios-display-container');
    if (!scenariosContainer) {
      const containerHTML = `
        <div id="eight-scenarios-display-container" 
             class="eight-scenarios-container" 
             style="margin: 20px 0; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 12px;">
        </div>
      `;
      
      // 一時的にコンテナを追加（innerHTMLは使わない）
      const temp = document.createElement('div');
      temp.innerHTML = containerHTML;
      scenariosContainer = temp.firstElementChild;
      resultsContainer.appendChild(scenariosContainer);
      
      // スケルトンをマウント
      this.domPreserver.mountSkeletonOnce();
    }
    
    // 3. シナリオデータを抽出
    const scenarios = this.extractScenarios(analysisResult);
    const chartData = this.extractChartData(analysisResult);
    
    // 4. 差分更新でレンダリング
    this.domPreserver.renderScenarioCards(scenarios);
    this.domPreserver.renderCharts(chartData);
    
    // 5. テキスト部分のみ元の関数で更新（Canvas領域は除外）
    this.updateTextOnlyAreas(resultsContainer, analysisResult);
    
    // 6. 結果コンテナを表示
    resultsContainer.style.display = 'block';
    
    console.log('✅ Results displayed with Canvas preservation');
  }
  
  /**
   * 分析結果からシナリオを抽出
   */
  extractScenarios(analysisResult) {
    // 複数の可能性のあるパスから抽出
    const scenarios = 
      analysisResult.scenarios ||
      analysisResult.finalEightPaths ||
      analysisResult.eightScenarios ||
      [];
    
    // 8つのシナリオに正規化
    return scenarios.map((s, idx) => ({
      code: s.code || s.pattern || this.generateCode(idx),
      name: s.name || s.hexagramName || `シナリオ${idx + 1}`,
      description: s.description || s.summary || '',
      phase1: s.phase1 || '現在の状況を深める',
      phase2: s.phase2 || '変化の兆しが現れる',
      phase3: s.phase3 || '新たな様式へ移行',
      totalScore: s.totalScore || s.score?.total || s.probability * 100 || 50,
      feasibility: s.feasibility || 60,
      stability: s.stability || 55,
      growth: s.growth || 65,
      risk: s.risk || 40,
      transformation: s.transformation || 70
    }));
  }
  
  /**
   * チャートデータを抽出
   */
  extractChartData(analysisResult) {
    return {
      phaseScores: [
        analysisResult.currentScore || 70,
        analysisResult.transitionScore || 65,
        analysisResult.futureScore || 75
      ],
      currentScores: [
        analysisResult.scores?.S1 || 70,
        analysisResult.scores?.S2 || 65,
        analysisResult.scores?.S3 || 60,
        analysisResult.scores?.S4 || 40,
        analysisResult.scores?.S5 || 50
      ],
      scenarios: this.extractScenarios(analysisResult)
    };
  }
  
  /**
   * シナリオコードを生成
   */
  generateCode(index) {
    const codes = ['JJJ', 'JJC', 'JCJ', 'JCC', 'CJJ', 'CJC', 'CCJ', 'CCC'];
    return codes[index % 8];
  }
  
  /**
   * Canvas以外のテキスト領域を更新
   */
  updateTextOnlyAreas(container, analysisResult) {
    // 現在の卦情報を更新
    const hexagramInfo = container.querySelector('#currentHexagramInfo');
    if (hexagramInfo) {
      hexagramInfo.textContent = analysisResult.currentHexagram || '分析中...';
    }
    
    // テーマ説明を更新
    const themeDesc = container.querySelector('#currentThemeDescription');
    if (themeDesc) {
      const themeText = analysisResult.themeDescription || '現在の状況を分析しています';
      // 差分更新
      if (themeDesc.textContent !== themeText) {
        themeDesc.textContent = themeText;
      }
    }
    
    console.log('✅ Text areas updated');
  }
}

// グローバルに公開
window.FutureSimulatorDOMIntegration = FutureSimulatorDOMIntegration;

// 自動初期化（DOMContentLoadedで実行）
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.futureSimulatorDOM = new FutureSimulatorDOMIntegration();
    window.futureSimulatorDOM.initialize();
  });
} else {
  // 既にDOM読み込み済みの場合
  window.futureSimulatorDOM = new FutureSimulatorDOMIntegration();
  window.futureSimulatorDOM.initialize();
}