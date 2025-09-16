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
      this.scenariosDisplay = null; // 旧UI
      this.branchesDisplay = null;  // 新UI
      this.branchGenerator = null;  // 新ユーティリティ
      this._lineStatesCache = null; // Nowの主理由用
      
      // 現在の分析結果
      this.currentAnalysis = null;

      // グローバル委譲のデバウンス
      this._clickBusy = false;
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
      
      // 8シナリオ表示 or 8分岐表示（フィーチャーフラグ）
      const useEightBranches = (window.HAQEI_CONFIG && window.HAQEI_CONFIG.useEightBranches) !== false;
      if (useEightBranches) {
        if (window.EightBranchesDisplay) {
          this.branchesDisplay = new window.EightBranchesDisplay();
        }
        if (window.BranchGenerator) {
          this.branchGenerator = new window.BranchGenerator();
        }
      } else {
        if (window.EightScenariosDisplay) {
          this.scenariosDisplay = new window.EightScenariosDisplay();
          const scenariosContainer = document.getElementById('eight-scenarios-display');
          if (scenariosContainer) {
            this.scenariosDisplay.initialize('eight-scenarios-display');
          }
        }
      }
      
      console.log('✅ Visualizers initialized');
    }

    /**
     * イベントリスナー設定
     */
    setupEventListeners() {
      // 直接バインド（存在する場合）
      const analyzeBtn = document.getElementById('aiGuessBtn');
      if (analyzeBtn) {
        analyzeBtn.addEventListener('click', async () => {
          await this.performAnalysis();
        });
      }

      // DOM置換に強いグローバル委譲
      this.setupGlobalDelegates();
      
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
     * DOM置換に耐えるグローバル委譲
     */
    setupGlobalDelegates() {
      // クリック委譲（分析ボタン）
      document.addEventListener('click', async (e) => {
        const el = e.target && (e.target.closest ? e.target.closest('#aiGuessBtn') : null);
        if (!el) return;
        if (this._clickBusy) return;
        this._clickBusy = true;
        try {
          await this.performAnalysis();
        } finally {
          setTimeout(() => { this._clickBusy = false; }, 300);
        }
      }, true);

      // Enterキーでも分析実行
      document.addEventListener('keypress', async (e) => {
        const input = e.target && e.target.id === 'worryInput';
        if (!input) return;
        if (e.key === 'Enter' && e.shiftKey === false) {
          e.preventDefault();
          if (this._clickBusy) return;
          this._clickBusy = true;
          try {
            await this.performAnalysis();
          } finally {
            setTimeout(() => { this._clickBusy = false; }, 300);
          }
        }
      }, true);
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
      
      // 1. 現在の状況表示（主理由＝行状態テキスト）
      await this.displayCurrentSituation(analysis.currentSituation);
      
      // 2. 3段階プロセスの可視化
      if (this.visualizer && analysis.threeStageProcess) {
        const container = document.getElementById('three-stage-visualizer');
        if (!container) {
          // コンテナを作成
          const newContainer = document.createElement('div');
          newContainer.id = 'three-stage-visualizer';
          newContainer.style.marginTop = '2rem';
          
          const resultArea = document.getElementById('resultArea');
          if (resultArea) {
            resultArea.appendChild(newContainer);
          }
          
          this.visualizer.initialize('three-stage-visualizer');
        }
        
        this.visualizer.drawThreeStageProcess(
          analysis.threeStageProcess,
          analysis.eightScenarios
        );
      }
      
      // 3. 8分岐または従来8シナリオ表示
      const useEightBranches = (window.HAQEI_CONFIG && window.HAQEI_CONFIG.useEightBranches) !== false;
      if (useEightBranches && this.branchesDisplay && this.branchGenerator) {
        // コンテナ確保（resultsContainer → resultArea → body の順で追加）
        let container = document.getElementById('eight-branches-display');
        if (!container) {
          container = document.createElement('div');
          container.id = 'eight-branches-display';
          container.style.marginTop = '2rem';
          const host = document.getElementById('resultsContainer') || document.getElementById('resultArea') || document.body;
          host.appendChild(container);
        }
        this.branchesDisplay.initialize('eight-branches-display');

        // 現在の卦と爻位を抽出
        const startHex = analysis.currentSituation['卦番号'];
        const yaoName = analysis.currentSituation['爻'];
        const startLine = this.parseLinePosition(yaoName);

        // 8分岐を生成して描画
        try {
          const branches = await this.branchGenerator.generateEightBranches(startHex, startLine);
          this.branchesDisplay.displayBranches(branches);
        } catch (e) {
          console.error('❌ EightBranches の生成に失敗:', e);
        }
      } else if (this.scenariosDisplay && analysis.eightScenarios) {
        const container = document.getElementById('eight-scenarios-display');
        if (!container) {
          // コンテナを作成
          const newContainer = document.createElement('div');
          newContainer.id = 'eight-scenarios-display';
          newContainer.style.marginTop = '2rem';
          
          const resultArea = document.getElementById('resultArea');
          if (resultArea) {
            resultArea.appendChild(newContainer);
          }
          
          this.scenariosDisplay.initialize('eight-scenarios-display');
        }
        
        this.scenariosDisplay.displayScenarios(
          analysis.eightScenarios,
          analysis.threeStageProcess
        );
        
        // アニメーション開始
        setTimeout(() => {
          this.scenariosDisplay.animateDisplay();
        }, 100);
      }
      
      // 4. 結果エリアを表示
      const resultArea = document.getElementById('resultArea');
      if (resultArea) {
        resultArea.style.display = 'block';
        resultArea.scrollIntoView({ behavior: 'smooth' });
      }
    }

    /**
     * 現在の状況表示
     */
    async displayCurrentSituation(situation) {
      // 既存のNowブロックがなければ最小構成で生成（resultsContainer優先）
      const host = document.getElementById('resultsContainer') || document.getElementById('resultArea') || document.body;
      let block = document.getElementById('current-status-block');
      if (!block) {
        block = document.createElement('div');
        block.id = 'current-status-block';
        block.style.cssText = 'margin:1rem 0;padding:1rem;border:1px solid rgba(99,102,241,.35);border-radius:12px;background:rgba(17,24,39,.6)';
        host.insertBefore(block, host.firstChild || null);
      }
      const hexName = situation['卦名'] || situation.hexagramName || (situation.hexagram && situation.hexagram.name) || '';
      const yaoName = situation['爻'] || situation.yaoName || (situation.yao && situation.yao.name) || '';
      if (!document.getElementById('now-main-reason')) {
        block.innerHTML = `
          <div style="color:#cbd5e1;font-weight:700;margin-bottom:.25rem;">現在の状況</div>
          <div style="color:#e5e7eb;margin-bottom:.25rem;">${hexName} ${yaoName}</div>
          <div id="now-main-reason" style="color:#a5b4fc;font-size:.95rem;line-height:1.5;">読み込み中...</div>
        `;
      } else {
        // 既存のタイトルだけ更新
        const titleEls = block.querySelectorAll('div');
        if (titleEls && titleEls[1]) titleEls[1].textContent = `${hexName} ${yaoName}`;
      }
      // 主理由 = 行状態テキスト（h384-line-states）
      const hex = situation['卦番号'] || situation.hexagramNumber || (situation.hexagram && situation.hexagram.number) || 0;
      const line = Number.isFinite(situation.yaoPosition) ? situation.yaoPosition : this.parseLinePosition(yaoName);
      const text = await this.getLineStateText(hex, line);
      const main = document.getElementById('now-main-reason');
      if (main) main.textContent = text || '（未登録）';

      // 旧UI要素があれば隠す
      ['currentKeywords','recommendedDirection','overall-score','overall-label','currentPositionChart'].forEach(id=>{
        const el = document.getElementById(id); if (el) el.style.display='none';
      });

      // 視認性向上: ホストを表示してスクロール
      host.style.display = 'block';
      try { block.scrollIntoView({ behavior: 'smooth' }); } catch {}
    }

    // 爻名 → 爻位（1..6）
    parseLinePosition(yaoName) {
      const map = { '初九':1,'初六':1,'九二':2,'六二':2,'九三':3,'六三':3,'九四':4,'六四':4,'九五':5,'六五':5,'上九':6,'上六':6 };
      return map[yaoName] || 1;
    }

    // 行状態テキストの取得（キャッシュ）
    async getLineStateText(hex, line) {
      if (!this._lineStatesCache) {
        try {
          const res = await fetch('/data/h384-line-states.json', { cache: 'no-cache' });
          if (res.ok) {
            this._lineStatesCache = await res.json();
          } else {
            this._lineStatesCache = {};
          }
        } catch (_) {
          this._lineStatesCache = {};
        }
      }
      const key = `${hex}-${line}`;
      const v = this._lineStatesCache[key];
      if (typeof v === 'string') return v;
      if (v && typeof v.text === 'string') return v.text;
      return '（未登録）';
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
          '現状を基盤に、信頼できる仲間と共に慎重に進めていきましょう。急がず、着実な一歩を重視してください。',
        'conservative,collaborative,decisive': 
          '既存の枠組みを活用しながら、チームで迅速な意思決定を行いましょう。協力関係を大切にしてください。',
        'conservative,independent,cautious': 
          '自分のペースを保ちながら、独自の道を慎重に開拓していきましょう。焦る必要はありません。',
        'conservative,independent,decisive': 
          '既存の資源を活用しつつ、独自の判断で素早く行動しましょう。自信を持って進んでください。',
        'progressive,collaborative,cautious': 
          '新しい可能性を仲間と共に慎重に探求していきましょう。革新と安全性のバランスを重視してください。',
        'progressive,collaborative,decisive': 
          'チーム一丸となって、大胆な変革を迅速に実行しましょう。勢いを大切にしてください。',
        'progressive,independent,cautious': 
          '独自の革新的アイデアを、計画的に実現していきましょう。準備を怠らないでください。',
        'progressive,independent,decisive': 
          '自分の直感を信じて、革新的な道を迷わず進みましょう。今がその時です。'
      };
      
      const key = scenario.path.join(',');
      return recommendations[key] || '状況をよく観察し、最適なタイミングで行動を起こしましょう。';
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
