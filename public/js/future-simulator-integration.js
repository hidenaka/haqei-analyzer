/**
 * Future Simulator Integration - 統合実装
 * H384データベース、段階的選択プロセス、8つのシナリオを統合
 */

console.log('🚀 Future Simulator Integration Loading...');

(function(global) {
  'use strict';

  class FutureSimulatorIntegration {
    constructor() {
      this.name = 'FutureSimulatorIntegration';
      this.version = '3.0.0';
      this.isInitialized = false;
      
      // エンジン群
      this.h384db = null;
      this.guidanceEngine = null;
      this.visualizer = null;
      this.scenariosDisplay = null;
      this.resultPageController = null;  // 新しい結果ページコントローラー
      
      // 現在の分析結果
      this.currentAnalysis = null;

      // 3072通りDB
      this.scenarioDB = null;
      this.useScenarioDB = !!(global.HAQEI_CONFIG && global.HAQEI_CONFIG.useScenarioDB);
    }

    /**
     * 初期化
     */
    async initialize() {
      console.log('🔄 FutureSimulatorIntegration initializing...');
      
      try {
        // H384データベース初期化
        await this.initializeDatabase();
        
        // 易経ガイダンスエンジン初期化
        await this.initializeGuidanceEngine();
        
        // ビジュアライザー初期化
        this.initializeVisualizers();
        
        // イベントリスナー設定
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.log('✅ FutureSimulatorIntegration initialized successfully');
        return true;
      } catch (error) {
        console.error('❌ FutureSimulatorIntegration initialization failed:', error);
        return false;
      }
    }

    /**
     * データベース初期化
     */
    async initializeDatabase() {
      // H384DatabaseConnectorの初期化を待つ
      if (window.h384db) {
        this.h384db = window.h384db;
        if (!this.h384db.isLoaded) {
          await this.h384db.initialize();
        }
        console.log('✅ H384 Database connected');
      } else {
        console.warn('⚠️ H384 Database not available, creating new instance');
        this.h384db = new window.H384DatabaseConnector();
        await this.h384db.initialize();
      }
    }

    /**
     * ガイダンスエンジン初期化
     */
    async initializeGuidanceEngine() {
      if (window.iChingGuidance) {
        this.guidanceEngine = window.iChingGuidance;
        if (!this.guidanceEngine.isInitialized) {
          await this.guidanceEngine.initialize();
        }
        console.log('✅ I Ching Guidance Engine initialized');
      } else {
        console.warn('⚠️ Creating new I Ching Guidance Engine');
        this.guidanceEngine = new window.IChingGuidanceEngine();
        await this.guidanceEngine.initialize();
      }
    }

    /**
     * ScenarioDBProviderのロード
     */
    async ensureScenarioDBProvider() {
      if (!this.useScenarioDB) return false;
      if (global.ScenarioDBProvider) {
        if (!this.scenarioDB) this.scenarioDB = new global.ScenarioDBProvider({ basePath: '/data/scenario-db' });
        return true;
      }
      // 動的ロード
      await new Promise((resolve) => {
        const s = document.createElement('script');
        s.src = '/js/providers/ScenarioDBProvider.js';
        s.onload = () => resolve(true);
        s.onerror = () => resolve(false);
        document.head.appendChild(s);
      });
      if (global.ScenarioDBProvider && !this.scenarioDB) this.scenarioDB = new global.ScenarioDBProvider({ basePath: '/data/scenario-db' });
      return !!this.scenarioDB;
    }

    /**
     * ビジュアライザー初期化
     */
    initializeVisualizers() {
      // 3段階ビジュアライザー
      if (window.ThreeStageVisualizer) {
        this.visualizer = new window.ThreeStageVisualizer();
        
        // コンテナがあれば初期化
        const visualizerContainer = document.getElementById('three-stage-visualizer');
        if (visualizerContainer) {
          this.visualizer.initialize('three-stage-visualizer');
        }
      }
      
      // 8シナリオ表示
      if (window.EightScenariosDisplay) {
        this.scenariosDisplay = new window.EightScenariosDisplay({});
        
        // コンテナがあれば初期化
        const scenariosContainer = document.getElementById('eight-scenarios-display');
        if (scenariosContainer) {
          this.scenariosDisplay.initialize('eight-scenarios-display');
        }
      }
      
      // 結果ページコントローラー初期化
      if (window.ResultPageController) {
        this.resultPageController = new window.ResultPageController();
        this.resultPageController.initialize();
        console.log('✅ ResultPageController initialized');
      }
      
      console.log('✅ Visualizers initialized');
    }

    /**
     * イベントリスナー設定
     */
    setupEventListeners() {
      // 分析ボタン
      const analyzeBtn = document.getElementById('aiGuessBtn');
      if (analyzeBtn) {
        analyzeBtn.addEventListener('click', async () => {
          await this.performAnalysis();
        });
      }
      
      // エンターキーでも分析実行
      const worryInput = document.getElementById('worryInput');
      if (worryInput) {
        worryInput.addEventListener('keypress', async (e) => {
          if (e.key === 'Enter' && e.shiftKey === false) {
            e.preventDefault();
            await this.performAnalysis();
          }
        });
      }
      
      // シナリオ選択イベント
      const scenariosContainer = document.getElementById('eight-scenarios-display');
      if (scenariosContainer) {
        scenariosContainer.addEventListener('scenarioSelected', (e) => {
          this.handleScenarioSelection(e.detail);
        });
      }
    }

    /**
     * 分析実行
     */
    async performAnalysis() {
      const worryInput = document.getElementById('worryInput');
      if (!worryInput) return;
      
      const inputText = worryInput.value.trim();
      if (!inputText || inputText.length < 10) {
        alert('10文字以上の内容を入力してください');
        return;
      }
      
      // ローディング表示
      this.showLoading(true);
      
      try {
        // 易経ガイダンスエンジンで完全分析
        const analysis = await this.guidanceEngine.performCompleteAnalysis(inputText);
        
        if (analysis) {
          this.currentAnalysis = analysis;
          
          // 結果表示
          await this.displayResults(analysis);
          
          // localStorageに保存
          this.saveAnalysis(analysis);
        } else {
          throw new Error('分析に失敗しました');
        }
      } catch (error) {
        console.error('❌ Analysis failed:', error);
        alert('分析中にエラーが発生しました');
      } finally {
        this.showLoading(false);
      }
    }

    /**
     * 結果表示
     */
    async displayResults(analysis) {
      console.log('📊 Displaying analysis results:', analysis);
      
      // 新しいResultPageControllerを使用
      if (this.resultPageController) {
        // 分析データをResultPageController用に整形
        const resultData = {
          currentHexagram: {
            number: analysis.currentSituation?.hexagramNumber || 1,
            name: analysis.currentSituation?.hexagramName
          },
          currentYao: {
            position: analysis.currentSituation?.yaoPosition || 1,
            name: analysis.currentSituation?.yaoName
          },
          theme: analysis.currentSituation?.theme,
          themeDetail: analysis.currentSituation?.description,
          scenarios: analysis.eightScenarios,
          progressTheme: analysis.threeStageProcess?.progressTheme,
          changeTheme: analysis.threeStageProcess?.changeTheme
        };
        
        // ResultPageControllerで結果を表示
        await this.resultPageController.displayResults(resultData);
        
        // choice1, choice2カードを更新（重複回避のため再度実行）
        if (analysis.currentSituation) {
          this.updateChoiceCards(analysis.currentSituation);
        }
      }

      // 1. 現在の状況表示（既存表示のみ）
      this.displayCurrentSituation(analysis.currentSituation);
      
      // 2. 3段階プロセスの可視化
      console.log('🎯 [CRITICAL DEBUG] threeStageProcess check:', {
        hasVisualizer: !!this.visualizer,
        hasThreeStageProcess: !!analysis.threeStageProcess,
        threeStageProcessData: analysis.threeStageProcess,
        stagesCount: analysis.threeStageProcess?.stages?.length
      });
      
      if (this.visualizer && analysis.threeStageProcess) {
        const container = document.getElementById('three-stage-visualizer');
        if (!container) {
          // コンテナを作成
          const newContainer = document.createElement('div');
          newContainer.id = 'three-stage-visualizer';
          newContainer.style.marginTop = '2rem';
          const mount = document.getElementById('resultsContainer') || document.body;
          mount.appendChild(newContainer);
          
          this.visualizer.initialize('three-stage-visualizer');
        }
        
        this.visualizer.drawThreeStageProcess(
          analysis.threeStageProcess,
          analysis.eightScenarios
        );
      }
      
      // 3. 8つのシナリオ表示（3072DB優先）
      if (this.scenariosDisplay) {
        const container = document.getElementById('eight-scenarios-display');
        if (!container) {
          // コンテナを作成
          const newContainer = document.createElement('div');
          newContainer.id = 'eight-scenarios-display';
          newContainer.style.marginTop = '2rem';
          const mount = document.getElementById('resultsContainer') || document.body;
          mount.appendChild(newContainer);
          
          this.scenariosDisplay.initialize('eight-scenarios-display');
        }
        
        // 8つのシナリオ表示を有効化（DB→フォールバック）
        let scenariosToShow = analysis.eightScenarios || [];
        const startHex = analysis.currentSituation?.hexagramNumber;
        const startLineName = analysis.currentSituation?.yaoName || '';
        const lineMap = { '初九':1,'九二':2,'九三':3,'九四':4,'九五':5,'上九':6,'初六':1,'六二':2,'六三':3,'六四':4,'六五':5,'上六':6 };
        const startLine = lineMap[startLineName];
        if (this.useScenarioDB && startHex && startLine) {
          const ok = await this.ensureScenarioDBProvider();
          if (ok) {
            try {
              const dbItems = await this.scenarioDB.getAllForStart(startHex, startLine);
              if (dbItems && dbItems.length) {
                scenariosToShow = this.mapDbItemsToUIScenarios(dbItems, analysis.currentSituation);
              }
            } catch (e) { console.warn('ScenarioDB fallback used:', e.message); }
          }
        }

        if (scenariosToShow && scenariosToShow.length > 0) {
          // 入力テキストを現在地バーに連携
          try { if (typeof this.scenariosDisplay.setUserInput === 'function') { this.scenariosDisplay.setUserInput(analysis.inputText || ''); } } catch {}
          this.scenariosDisplay.displayScenarios(
            scenariosToShow,
            analysis.threeStageProcess,
            analysis.currentSituation,
            analysis.topCandidates || []
          );
          
          // アニメーション開始
          setTimeout(() => {
            this.scenariosDisplay.animateDisplay();
          }, 100);
        } else {
          console.warn('⚠️ No eightScenarios data available for display');
        }
      }
      
      // 4. 結果エリアを表示（resultsContainer優先）
      const resultsContainer = document.getElementById('resultsContainer');
      if (resultsContainer) {
        resultsContainer.style.display = 'block';
        try { resultsContainer.scrollIntoView({ behavior: 'smooth' }); } catch {}
      } else {
        const resultArea = document.getElementById('resultArea');
        if (resultArea) {
          resultArea.style.display = 'block';
          try { resultArea.scrollIntoView({ behavior: 'smooth' }); } catch {}
        }
      }
      
      // 分析完了フラグを設定
      window.futureAnalysisCompleted = true;
      
      // I Ching simulator section を表示
      const ichingSection = document.getElementById('iching-simulator-section');
      if (ichingSection) {
        ichingSection.style.display = 'block';
        ichingSection.style.opacity = '1';
      }
    }

    

    // DB→UIシナリオへのマッピング
    mapDbItemsToUIScenarios(dbItems, currentSituation) {
      const sigToRoute = (sig) => Array.from(String(sig)).map(ch => ch==='J' ? 'progress' : 'transform');
      const sigOrder = ['JJJ','JJH','JHJ','JHH','HJJ','HJH','HHJ','HHH'];
      // H384から名前取得
      const startName = currentSituation?.hexagramName || '';
      const startYao = currentSituation?.yaoName || '';
      const startLineNumber = (() => { const m={ '初九':1,'九二':2,'九三':3,'九四':4,'九五':5,'上九':6,'初六':1,'六二':2,'六三':3,'六四':4,'六五':5,'上六':6 }; return m[startYao]||1; })();

      const scenarios = [];
      sigOrder.forEach((sig, idx) => {
        const item = dbItems.find(x => x.pathSig === sig);
        if (!item) return;
        const s = {
          id: idx+1,
          path: sigToRoute(sig),
          route: sigToRoute(sig),
          probability: Math.round(((item.probability ?? 0.5) * 100)),
          hexagramInfo: { name: startName, line: startYao, lineNumber: startLineNumber },
          targetHexagram: { name: this.getHexName(item.finalHex) || '到達卦', line: this.getYaoName(item.finalLine) || '', lineNumber: item.finalLine },
          finalHex: item.finalHex,
          finalLine: item.finalLine,
          // DBのseriesを優先利用できるように拡張フィールドで渡す
          dbSeries: item.series,
          steps: Array.isArray(item.steps) ? item.steps : []
        };
        scenarios.push(s);
      });
      return scenarios;
    }

    getHexName(hex) {
      try {
        const h = Number(hex);
        if (!window.H64_DATA || !Number.isFinite(h)) return '';
        const entry = window.H64_DATA[h-1];
        return entry && entry['卦名'] ? String(entry['卦名']).trim() : '';
      } catch { return ''; }
    }

    getYaoName(line) {
      const map = {1:'初九',2:'九二',3:'九三',4:'九四',5:'九五',6:'上九'};
      const alt = {1:'初六',2:'六二',3:'六三',4:'六四',5:'六五',6:'上六'};
      // 陽/陰は不明のため九側を既定、H384ベースで必要なら後日拡張
      return map[line] || alt[line] || '';
    }

    /**
     * 現在の状況表示
     */
    displayCurrentSituation(situation) {
      // タイトル更新
      const currentTitle = document.getElementById('currentTitle');
      if (currentTitle) {
        // 卦の図形を生成
        const hexagramVisual = this.generateHexagramVisual(situation['卦番号']);
        currentTitle.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; gap: 1rem;">
            ${hexagramVisual}
            <span>${situation['卦名']} ${situation['爻']}</span>
          </div>
        `;
      }
      
      // キーワード更新
      const currentKeywords = document.getElementById('currentKeywords');
      if (currentKeywords && situation['キーワード']) {
        currentKeywords.textContent = situation['キーワード'].join(' / ');
      }
      
      // サマリー更新
      const currentSummary = document.getElementById('currentSummary');
      if (currentSummary) {
        currentSummary.textContent = situation['現代解釈の要約'];
      }
      
      // 推奨方向性更新
      const recommendedDirection = document.getElementById('recommendedDirection');
      if (recommendedDirection) {
        const stance = situation['S5_主体性推奨スタンス'];
        let direction = '';
        
        if (stance === '能動') {
          direction = '積極的に行動を起こし、主体的に状況を切り開くという選択肢があります。';
        } else if (stance === '受動') {
          direction = '状況を慎重に観察し、適切なタイミングを待つという道筋が考えられます。';
        } else {
          direction = 'バランスを保ちながら、状況に応じた柔軟な対応という選択肢があります。';
        }
        
        recommendedDirection.textContent = direction;
      }
      
      // 選択カードの動的更新（ResultPageController使用時も実行）
      this.updateChoiceCards(situation);
    }
    
    /**
     * 卦の図形を生成（陰陽の線）
     */
    generateHexagramVisual(hexagramNumber) {
      // 64卦のバイナリ表現（下から上へ：初爻→上爻）
      const hexagramStructures = {
        1: '111111', 2: '000000', 3: '010001', 4: '100010',
        5: '010111', 6: '111010', 7: '000010', 8: '010000',
        // ... 簡略化のため一部のみ
      };
      
      const structure = hexagramStructures[hexagramNumber] || '000000';
      const lines = structure.split('').reverse(); // 上から下に表示
      
      let html = '<div style="display: flex; flex-direction: column; gap: 2px;">';
      lines.forEach(line => {
        if (line === '1') {
          // 陽爻（実線）
          html += '<div style="width: 40px; height: 4px; background: currentColor;"></div>';
        } else {
          // 陰爻（破線）
          html += '<div style="display: flex; gap: 4px;"><div style="width: 18px; height: 4px; background: currentColor;"></div><div style="width: 18px; height: 4px; background: currentColor;"></div></div>';
        }
      });
      html += '</div>';
      
      return html;
    }
    
    /**
     * 選択カードを動的に更新
     */
    updateChoiceCards(situation) {
      const choice1 = document.getElementById('choice1');
      const choice2 = document.getElementById('choice2');
      
      if (choice1 && situation) {
        // テーマに従う選択肢
        const followKeywords = situation['キーワード'] || [];
        choice1.innerHTML = `
          <h3 class="text-lg font-bold text-blue-300 mb-2">テーマに従う道</h3>
          <p class="text-sm text-gray-300 mb-3">「${followKeywords.join('、')}」を受け入れて行動する</p>
          <div class="text-xs bg-blue-500/20 text-blue-200 px-2 py-1 rounded">
            ${situation['S5_主体性推奨スタンス'] === '能動' ? '積極的行動' : '慎重な観察'}
          </div>
        `;
      }
      
      if (choice2 && situation) {
        // テーマに従わない選択肢
        const rejectKeywords = situation['キーワード'] || [];
        choice2.innerHTML = `
          <h3 class="text-lg font-bold text-emerald-300 mb-2">新たな道を探る</h3>
          <p class="text-sm text-gray-300 mb-3">「${rejectKeywords.join('、')}」とは異なる選択を模索</p>
          <div class="text-xs bg-emerald-500/20 text-emerald-200 px-2 py-1 rounded">
            ${situation['S5_主体性推奨スタンス'] === '能動' ? '慎重な転換' : '積極的変革'}
          </div>
        `;
      }
    }

    /**
     * シナリオ選択処理
     */
    handleScenarioSelection(scenario) {
      console.log('🎯 Scenario selected:', scenario);
      
      // 選択パスをビジュアライザーに反映
      if (this.visualizer) {
        this.visualizer.selectPath(scenario.path);
      }
      
      // 詳細情報を表示（必要に応じて実装）
      this.displayScenarioDetails(scenario);
    }

    /**
     * シナリオ詳細表示
     */
    displayScenarioDetails(scenario) {
      // 詳細表示エリアがなければ作成
      let detailsContainer = document.getElementById('scenario-details');
      if (!detailsContainer) {
        detailsContainer = document.createElement('div');
        detailsContainer.id = 'scenario-details';
        detailsContainer.style.marginTop = '2rem';
        detailsContainer.style.padding = '1.5rem';
        detailsContainer.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))';
        detailsContainer.style.borderRadius = '12px';
        detailsContainer.style.border = '1px solid rgba(99, 102, 241, 0.3)';
        
        const resultArea = document.getElementById('resultArea');
        if (resultArea) {
          resultArea.appendChild(detailsContainer);
        }
      }
      
      detailsContainer.innerHTML = `
        <h3 style="color: #A5B4FC; margin-bottom: 1rem;">
          選択されたシナリオ: ${scenario.title}
        </h3>
        <div style="color: #E5E7EB;">
          <p style="margin-bottom: 1rem;">${scenario.description}</p>
          <div style="display: flex; gap: 2rem; margin-bottom: 1rem;">
            <div>
              <strong style="color: #FDE047;">成功確率:</strong> ${scenario.probability}%
            </div>
            <div>
              <strong style="color: #FDE047;">易経参照:</strong> ${scenario.iChingReference.hexagram}
            </div>
          </div>
          <div style="margin-top: 1rem;">
            <strong style="color: #10B981;">推奨アクション:</strong>
            <p style="margin-top: 0.5rem;">
              ${this.generateActionRecommendation(scenario)}
            </p>
          </div>
        </div>
      `;
      
      detailsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * アクション推奨生成
     */
    generateActionRecommendation(scenario) {
      const recommendations = {
        'conservative,collaborative,cautious': 
          '現状を基盤に、信頼できる仲間と共に慎重に進むという選択肢があります。着実な一歩を重視する道筋も考えられます。',
        'conservative,collaborative,decisive': 
          '既存の枠組みを活用しながら、チームで迅速な意思決定を行うという選択肢があります。協力関係を重視する方向性も見えています。',
        'conservative,independent,cautious': 
          '自分のペースを保ちながら、独自の道を慎重に開拓する道筋があります。焦らない進め方も可能です。',
        'conservative,independent,decisive': 
          '既存の資源を活用しつつ、独自の判断で素早く行動する道筋があります。自信を持って進むという選択肢も考えられます。',
        'progressive,collaborative,cautious': 
          '新しい可能性を仲間と共に慎重に探求する道筋があります。革新と安全性のバランスを重視する選択肢も考えられます。',
        'progressive,collaborative,decisive': 
          'チーム一丸となって、大胆な変革を迅速に実行する選択肢があります。勢いを重視する方向性も見えています。',
        'progressive,independent,cautious': 
          '独自の革新的アイデアを、計画的に実現する道筋があります。十分な準備を行う選択肢も考えられます。',
        'progressive,independent,decisive': 
          '自分の直感を信じて、革新的な道を進むという選択肢があります。今が好機であるという見方もできます。'
      };
      
      const key = scenario.path.join(',');
      return recommendations[key] || '状況をよく観察し、適切なタイミングで行動を起こすという選択肢があります。';
    }

    /**
     * ローディング表示
     */
    showLoading(show) {
      const loadingSpinner = document.getElementById('loadingSpinner');
      const originalIcon = document.getElementById('originalIcon');
      const buttonText = document.getElementById('buttonText');
      const aiGuessBtn = document.getElementById('aiGuessBtn');
      
      if (show) {
        if (loadingSpinner) loadingSpinner.style.display = 'block';
        if (originalIcon) originalIcon.style.display = 'none';
        if (buttonText) buttonText.textContent = '分析中...';
        if (aiGuessBtn) aiGuessBtn.disabled = true;
      } else {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        if (originalIcon) originalIcon.style.display = 'block';
        if (buttonText) buttonText.textContent = '分析実行';
        if (aiGuessBtn) aiGuessBtn.disabled = false;
      }
    }

    /**
     * 分析結果保存
     */
    saveAnalysis(analysis) {
      if (typeof localStorage !== 'undefined') {
        const history = JSON.parse(localStorage.getItem('future_simulator_history') || '[]');
        history.unshift(analysis);
        
        // 最新10件のみ保持
        if (history.length > 10) {
          history.length = 10;
        }
        
        localStorage.setItem('future_simulator_history', JSON.stringify(history));
      }
    }

    /**
     * 分析履歴取得
     */
    getAnalysisHistory() {
      if (typeof localStorage !== 'undefined') {
        return JSON.parse(localStorage.getItem('future_simulator_history') || '[]');
      }
      return [];
    }
  }

  // グローバル登録
  if (typeof window !== 'undefined') {
    window.FutureSimulatorIntegration = FutureSimulatorIntegration;
    
    // 自動初期化
    window.futureSimulator = new FutureSimulatorIntegration();
    
    // DOMContentLoaded時に初期化
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        window.futureSimulator.initialize();
      });
    } else {
      // 既に読み込み済みの場合
      setTimeout(() => {
        window.futureSimulator.initialize();
      }, 100);
    }
  }

  console.log('✅ FutureSimulatorIntegration loaded');
  
})(typeof window !== 'undefined' ? window : this);
