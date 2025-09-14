/**
 * ResultPageController - 新しい結果表示画面のメインコントローラー
 * 2025-08-07 全面リニューアル版
 */

class ResultPageController {
  constructor() {
    this.name = 'ResultPageController';
    this.version = '2.0.0';
    this.analysisData = null;
    this.charts = {};
    this.initialized = false;
    
    console.log('🎯 ResultPageController v2.0.0 initializing...');
  }

  /**
   * 初期化
   */
  async initialize() {
    try {
      console.log('🔄 Initializing ResultPageController...');
      
      // Chart.jsの確認
      if (typeof Chart === 'undefined') {
        console.warn('⚠️ Chart.js not loaded, loading now...');
        await this.loadChartJS();
      }
      
      // コンポーネントの初期化
      await this.initializeComponents();
      
      this.initialized = true;
      console.log('✅ ResultPageController initialized');
      return true;
      
    } catch (error) {
      console.error('❌ ResultPageController initialization failed:', error);
      return false;
    }
  }

  /**
   * Chart.jsの動的読み込み
   */
  async loadChartJS() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/js/lib/chart.min.js';
      script.onload = () => {
        console.log('✅ Chart.js loaded');
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * コンポーネントの初期化
   */
  async initializeComponents() {
    // 各コンポーネントはここで初期化予定
    console.log('📦 Initializing components...');
  }

  /**
   * 分析結果の表示
   */
  async displayResults(analysisData) {
    try {
      console.log('🎨 Displaying analysis results...');
      this.analysisData = analysisData;
      
      // H384データベースからデータを取得
      await this.loadH384Data(analysisData);
      
      // 結果エリアを表示
      const resultArea = document.getElementById('resultArea');
      if (resultArea) {
        resultArea.style.display = 'block';
      }
      
      // 各要素の更新（EightBranchesモードでは数値/グラフ/旧8シナリオを抑止）
      const minimalMode = (window.HAQEI_CONFIG && window.HAQEI_CONFIG.useEightBranches) !== false;
      await this.updateCurrentPosition(analysisData);
      if (!minimalMode) {
        await this.updateScores(analysisData);
        await this.renderCurrentGraph(analysisData);
        await this.updateIChingInterpretation(analysisData);
        await this.renderFutureBranchingGraph(analysisData);
        await this.updateThemeBoxes(analysisData);
        await this.renderEightScenarios(analysisData);
      } else {
        // EightBranchesモードでは、不要要素を明示的に非表示
        const hideById = (id) => { const el = document.getElementById(id); if (el) el.style.display = 'none'; };
        hideById('overall-score');
        hideById('overall-label');
        hideById('transition-score');
        hideById('transition-label');
        hideById('currentPositionChart');
        hideById('futureBranchingChart');
        hideById('ichingInterpretation');
        // 旧8シナリオ領域（存在すれば）
        hideById('eight-scenarios-display');
      }
      
      console.log('✅ Results displayed successfully');
      
    } catch (error) {
      console.error('❌ Failed to display results:', error);
    }
  }

  /**
   * H384データベースからデータを読み込み
   */
  async loadH384Data(analysisData) {
    try {
      // Personalized overrides lazy-load
      if (!window.H384_PERSONAL) {
        try {
          const r = await fetch('/assets/H384H64database.personal.json', { cache:'no-cache' });
          if (r.ok) window.H384_PERSONAL = await r.json();
        } catch {}
      }
      // H384_DATAがグローバルに定義されているかチェック
      if (typeof H384_DATA === 'undefined') {
        console.warn('⚠️ H384_DATA not loaded, loading now...');
        await this.loadH384Database();
      }
      
      // 現在の卦と爻から通し番号を計算
      if (analysisData.currentHexagram && analysisData.currentYao) {
        const hexagramNum = analysisData.currentHexagram.number || 1;
        const yaoPosition = analysisData.currentYao.position || 1;
        
        // 通し番号 = (卦番号 - 1) * 7 + 爻位置
        const serialNumber = (hexagramNum - 1) * 7 + yaoPosition;
        
        // H384データから該当データを取得
        const h384Entry = H384_DATA.find(entry => entry['通し番号'] === serialNumber);
        
        if (h384Entry) {
          // データを分析データに統合
          const serial = serialNumber;
          const override = (window.H384_PERSONAL && window.H384_PERSONAL[String(serial)]) || null;
          const merged = { ...h384Entry };
          if (override && override['現代解釈の要約_plain']) {
            merged['現代解釈の要約'] = override['現代解釈の要約_plain'];
          }
          analysisData.h384Data = merged;
          
          // スコアデータの統合
          analysisData.overallScore = h384Entry['S7_総合評価スコア'] || 50;
          analysisData.currentGraph = {
            basic: h384Entry['S1_基本スコア'] || 50,
            potential: h384Entry['S2_ポテンシャル'] || 50,
            stability: h384Entry['S3_安定性スコア'] || 50,
            risk: Math.abs(h384Entry['S4_リスク'] || -35),
            volatility: h384Entry['S6_変動性スコア'] || 50
          };
          
          // 卦名と爻名の更新
          if (!analysisData.currentHexagram.name) {
            analysisData.currentHexagram.name = h384Entry['卦名'];
          }
          if (!analysisData.currentYao.name) {
            analysisData.currentYao.name = h384Entry['爻'];
          }
          
          // キーワードと解釈の追加
          analysisData.keywords = merged['キーワード'] || [];
          analysisData.modernInterpretation = merged['現代解釈の要約'] || '';
          
          console.log('✅ H384 data loaded:', merged);
        } else {
          console.warn(`⚠️ No H384 data found for serial number: ${serialNumber}`);
        }
      }
      
    } catch (error) {
      console.error('❌ Failed to load H384 data:', error);
    }
  }

  /**
   * H384データベースの動的読み込み
   */
  async loadH384Database() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/assets/H384H64database.js';
      script.onload = () => {
        console.log('✅ H384 database loaded');
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * 現在地の更新
   */
  async updateCurrentPosition(data) {
    try {
      // ROOT CAUSE FIX: HTMLの実際のID要素と連携
      const hexagramInfoElement = document.getElementById('currentHexagramInfo');
      const themeDescElement = document.getElementById('currentThemeDescription');
      
      if (data.h384Data) {
        // H384データベースから実データを表示
        const hexagramName = data.h384Data['卦名'] || '乾為天';
        const yaoName = data.h384Data['爻'] || '初爻';
        const modernInterp = data.h384Data['現代解釈の要約'] || '';
        
        if (hexagramInfoElement) {
          hexagramInfoElement.textContent = `${hexagramName} ${yaoName}`;
        }
        // EightBranchesモードでは主理由は別ブロック(now-main-reason)が担うため、ここでは記述しない
        const minimalMode = (window.HAQEI_CONFIG && window.HAQEI_CONFIG.useEightBranches) !== false;
        if (!minimalMode && themeDescElement) {
          const personalized = this._toPersonalPerspective(modernInterp);
          themeDescElement.innerHTML = `<p>${personalized}</p>`;
        } else if (themeDescElement) {
          themeDescElement.style.display = 'none';
        }
      }
      
    } catch (error) {
      console.error('❌ Failed to update current position:', error);
    }
  }

  // 個人視点への軽い置換（EightBranchesDisplayに合わせる）
  _toPersonalPerspective(text){
    try {
      let t = String(text||'');
      const rules = [
        [/組織|チーム|部門|部署|社内横断|部門横断/g, '関係資源'],
        [/周囲|関係者|メンバー|人々|大衆|皆/g, '必要な相手'],
        [/仲間と共に|皆で|協働|共創/g, '自分のペースで周囲を活用し'],
        [/協力を得て/g, '必要な支援や資源を整えて'],
        [/合意形成/g, '自分の中の納得と優先順位付け'],
        [/リーダーシップ/g, '自己決定と自己管理'],
        [/信頼を得て/g, '一貫性を積み重ねて'],
        [/求心力/g, '軸の明確さ'],
        [/評価|称賛|支持/g, '手応え'],
        [/関係を丁寧に整え/g, '自分の作業環境を整え'],
        [/協力関係/g, '関係資源の使い方'],
        [/周囲の信頼/g, '自分への信頼と一貫性'],
        [/目標を共有/g, '目的を自分の言葉で明確にし'],
        [/メンバー/g, '関係資源']
      ];
      rules.forEach(([a,b])=>{ t = t.replace(a,b); });
      return t;
    } catch { return String(text||''); }
  }

  /**
   * スコアの更新
   */
  async updateScores(data) {
    try {
      // 総合評価スコア
      const overallScore = document.getElementById('overall-score');
      const overallLabel = document.getElementById('overall-label');
      
      if (overallScore && data.overallScore !== undefined) {
        overallScore.textContent = Math.round(data.overallScore);
        
        if (overallLabel) {
          const label = this.getScoreLabel(data.overallScore);
          overallLabel.textContent = `点 ${label}`;
        }
      }
      
      // 移行コスト (変動性スコアから計算)
      const transitionScore = document.getElementById('transition-score');
      const transitionLabel = document.getElementById('transition-label');
      
      // H384データから変動性スコアを使用して移行コストを計算
      let transitionCost = data.transitionCost;
      if (data.h384Data && data.h384Data['S6_変動性スコア'] !== undefined) {
        // 変動性スコアが高いほど移行コストも高い
        transitionCost = data.h384Data['S6_変動性スコア'];
      }
      
      if (transitionScore && transitionCost !== undefined) {
        transitionScore.textContent = Math.round(transitionCost);
        
        if (transitionLabel) {
          const label = this.getTransitionLabel(transitionCost);
          transitionLabel.textContent = `点 ${label}`;
        }
      }
      
    } catch (error) {
      console.error('❌ Failed to update scores:', error);
    }
  }

  /**
   * 現在地グラフのレンダリング
   */
  async renderCurrentGraph(data) {
    try {
      const canvas = document.getElementById('currentPositionChart');
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      
      // 既存のチャートを破棄（完全クリーンアップ）
      if (this.charts.currentPosition) {
        this.charts.currentPosition.destroy();
      }
      
      // Chart.jsグローバルレジストリからも削除
      Chart.getChart(canvas)?.destroy();
      
      // グラフデータ（写真と同じ5要素）
      const graphData = {
        labels: ['基本', '潜在力', '安定性', 'リスク', '変動性'],
        datasets: [{
          data: [
            data.currentGraph?.basic || 60,
            data.currentGraph?.potential || 80,
            data.currentGraph?.stability || 40,
            data.currentGraph?.risk || 70,
            data.currentGraph?.volatility || 90
          ],
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',   // 青
            'rgba(16, 185, 129, 0.7)',   // 緑
            'rgba(251, 191, 36, 0.7)',   // 黄
            'rgba(239, 68, 68, 0.7)',    // 赤
            'rgba(139, 92, 246, 0.7)'    // 紫
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(251, 191, 36, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(139, 92, 246, 1)'
          ],
          borderWidth: 1
        }]
      };
      
      // Chart.js設定 (v3+対応)
      this.charts.currentPosition = new Chart(ctx, {
        type: 'bar',
        data: graphData,
        options: {
          indexAxis: 'y', // horizontalBar equivalent
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              max: 100,
              ticks: {
                color: '#cbd5e0'
              },
              grid: {
                color: 'rgba(75, 85, 99, 0.3)'
              }
            },
            y: {
              ticks: {
                color: '#cbd5e0'
              },
              grid: {
                color: 'rgba(75, 85, 99, 0.3)'
              }
            }
          }
        }
      });
      
    } catch (error) {
      console.error('❌ Failed to render current graph:', error);
    }
  }

  /**
   * 易経解釈の更新
   */
  async updateIChingInterpretation(data) {
    try {
      // ROOT CAUSE FIX: HTML実際のID要素と連携
      const contentElement = document.getElementById('ichingInterpretation');
      if (!contentElement) return;
      
      // H384データから解釈を取得
      if (data.h384Data) {
        const keywords = data.h384Data['キーワード'] || [];
        const interpretation = data.h384Data['現代解釈の要約'] || '';
        const stance = data.h384Data['S5_主体性推奨スタンス'] || '中立';
        
        contentElement.innerHTML = `
          <p class="stage-title">
            ${keywords.length > 0 ? keywords.join('・') : '現在の状況'}
          </p>
          <p class="stage-description">${interpretation}</p>
          <p class="stage-advice">推奨スタンス: ${stance === '能動' ? '積極的に行動する' : stance === '受動' ? '状況を見守る' : 'バランスを保つ'}</p>
        `;
      } else if (data.ichingInterpretation) {
        // フォールバック
        contentElement.innerHTML = `
          <p class="stage-title">${data.ichingInterpretation.title || '現在の状況'}</p>
          <p class="stage-description">${data.ichingInterpretation.description || '詳細な解釈を読み込み中...'}</p>
        `;
      }
      
    } catch (error) {
      console.error('❌ Failed to update I Ching interpretation:', error);
    }
  }

  /**
   * 未来分岐グラフのレンダリング
   */
  async renderFutureBranchingGraph(data) {
    try {
      const canvas = document.getElementById('futureBranchingChart');
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      
      // 既存のチャートを破棄（完全クリーンアップ）
      if (this.charts.futureBranching) {
        this.charts.futureBranching.destroy();
      }
      
      // Chart.jsグローバルレジストリからも削除
      Chart.getChart(canvas)?.destroy();
      
      // 8シナリオのデータ（写真と同じ配色）
      const colors = [
        'rgba(16, 185, 129, 1)',   // シナリオ1（緑）
        'rgba(59, 130, 246, 1)',   // シナリオ2（青）
        'rgba(139, 92, 246, 1)',   // シナリオ3（紫）
        'rgba(251, 191, 36, 1)',   // シナリオ4（黄）
        'rgba(239, 68, 68, 1)',    // シナリオ5（赤）
        'rgba(156, 163, 175, 1)',  // シナリオ6（灰）
        'rgba(245, 158, 11, 1)',   // シナリオ7（橙）
        'rgba(236, 72, 153, 1)'    // シナリオ8（ピンク）
      ];
      
      const datasets = [];
      if (data.scenarios && data.scenarios.length > 0) {
        data.scenarios.forEach((scenario, index) => {
          // Debug: Check if phase scores are available
          console.log(`📊 [DEBUG] Scenario ${index + 1} phase scores:`, {
            phase1: scenario.phase1Score,
            phase2: scenario.phase2Score,
            phase3: scenario.phase3Score || scenario.score
          });
          
          datasets.push({
            label: `シナリオ${index + 1} (${scenario.score}点)`,
            data: [
              data.overallScore || data.currentPosition?.score || 36,  // 現在地
              scenario.phase1Score || data.overallScore || 40,         // フェーズ1
              scenario.phase2Score || Math.round((scenario.phase1Score + scenario.score) / 2) || 50,  // フェーズ2
              scenario.phase3Score || scenario.score                   // フェーズ3（最終）
            ],
            borderColor: colors[index],
            backgroundColor: colors[index].replace('1)', '0.2)'),
            fill: false,
            tension: 0.2
          });
        });
      }
      
      // グラフ設定
      this.charts.futureBranching = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['現在地', 'フェーズ1', 'フェーズ2', 'フェーズ3'],
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                color: '#cbd5e0',
                font: {
                  size: 10
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                color: '#cbd5e0'
              },
              grid: {
                color: 'rgba(75, 85, 99, 0.3)'
              }
            },
            x: {
              ticks: {
                color: '#cbd5e0'
              },
              grid: {
                color: 'rgba(75, 85, 99, 0.3)'
              }
            }
          }
        }
      });
      
    } catch (error) {
      console.error('❌ Failed to render future branching graph:', error);
    }
  }

  /**
   * テーマボックスの更新
   */
  async updateThemeBoxes(data) {
    try {
      const progressContent = document.getElementById('progress-theme-content');
      const changeContent = document.getElementById('change-theme-content');
      
      if (progressContent && data.progressTheme) {
        progressContent.textContent = data.progressTheme;
      }
      
      if (changeContent && data.changeTheme) {
        changeContent.textContent = data.changeTheme;
      }
      
    } catch (error) {
      console.error('❌ Failed to update theme boxes:', error);
    }
  }

  /**
   * 8シナリオグリッドのレンダリング
   */
  async renderEightScenarios(data) {
    try {
      // EightScenariosDisplayが既に動作している場合はスキップ
      const eightScenariosDisplay = document.getElementById('eight-scenarios-display');
      if (eightScenariosDisplay && eightScenariosDisplay.children.length > 0) {
        console.log('ℹ️ EightScenariosDisplay already rendered, skipping duplicate');
        return;
      }
      
      const gridElement = document.getElementById('scenarios-grid');
      if (!gridElement) return;
      
      gridElement.innerHTML = '';
      
      if (data.scenarios && data.scenarios.length > 0) {
        data.scenarios.forEach((scenario, index) => {
          const card = this.createScenarioCard(scenario, index + 1);
          gridElement.appendChild(card);
        });
      }
      
    } catch (error) {
      console.error('❌ Failed to render eight scenarios:', error);
    }
  }

  /**
   * シナリオカードの作成
   */
  createScenarioCard(scenario, number) {
    const card = document.createElement('div');
    card.className = 'scenario-card-new';
    
    const rank = this.getScenarioRank(scenario.score);
    
    card.innerHTML = `
      <div class="scenario-header">
        <span class="scenario-rank rank-${rank.toLowerCase()}">${rank}</span>
        <span class="scenario-score">${Math.round(scenario.score)}点</span>
      </div>
      <div class="scenario-name">シナリオ ${number}</div>
      <div class="scenario-name">${scenario.name || '天地否 九五'}</div>
      <div class="scenario-steps">
        <div>初動: ${scenario.initialStep || '慎重スタート'}</div>
        <div>安定: ${scenario.stableStep || '着実な成長'}</div>
      </div>
      <canvas class="scenario-mini-graph" id="scenario-graph-${number}"></canvas>
    `;
    
    // ミニグラフを後で描画
    setTimeout(() => {
      this.renderMiniGraph(`scenario-graph-${number}`, scenario);
    }, 100);
    
    return card;
  }

  /**
   * ミニグラフのレンダリング
   */
  renderMiniGraph(canvasId, scenario) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // 既存のChart.jsインスタンスを破棄
    if (canvas.chartInstance) {
      canvas.chartInstance.destroy();
    }
    
    // 新しいチャートインスタンスを作成し、参照を保持
    canvas.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['基', '潜', '安', 'リ', '変'],
        datasets: [{
          data: [
            scenario.basic || 50,
            scenario.potential || 60,
            scenario.stability || 40,
            scenario.risk || 30,
            scenario.volatility || 70
          ],
          backgroundColor: [
            'rgba(59, 130, 246, 0.6)',
            'rgba(16, 185, 129, 0.6)',
            'rgba(251, 191, 36, 0.6)',
            'rgba(239, 68, 68, 0.6)',
            'rgba(139, 92, 246, 0.6)'
          ]
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            display: false,
            beginAtZero: true,
            max: 100
          },
          y: {
            display: true,
            ticks: {
              font: { size: 8 },
              color: '#a0aec0'
            }
          }
        }
      }
    });
  }

  /**
   * ヘルパー関数：爻名の取得
   */
  getYaoName(position, hexagramData) {
    // H384データから正確な爻名を取得
    if (this.analysisData && this.analysisData.h384Data && this.analysisData.h384Data['爻']) {
      return this.analysisData.h384Data['爻'];
    }
    
    // フォールバック：デフォルトの爻名
    const yaoNames = {
      1: '初九',
      2: '九二', 
      3: '六三',
      4: '九四',
      5: '九五',
      6: '上九'
    };
    return yaoNames[position] || '初九';
  }

  /**
   * ヘルパー関数：スコアラベルの取得
   */
  getScoreLabel(score) {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  }

  /**
   * ヘルパー関数：移行ラベルの取得
   */
  getTransitionLabel(cost) {
    if (cost >= 70) return '困難';
    if (cost >= 40) return '普通';
    return '容易';
  }

  /**
   * ヘルパー関数：シナリオランクの取得
   */
  getScenarioRank(score) {
    if (score >= 90) return 'S';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    if (score >= 40) return 'E';
    return 'F';
  }
}

// グローバルに公開
if (typeof window !== 'undefined') {
  window.ResultPageController = ResultPageController;
}
