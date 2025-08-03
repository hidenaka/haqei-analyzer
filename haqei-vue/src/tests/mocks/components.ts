/**
 * E2Eテスト用モックコンポーネント
 * 
 * 目的：
 * - 実際のコンポーネントが存在しない場合のテスト実行支援
 * - 統合テストでのコンポーネント依存関係の解決
 * - クロスプラットフォームテストでの一貫した動作保証
 */

import { defineComponent, h } from 'vue'

// DiagnosisFlow Mock Component
export const MockDiagnosisFlow = defineComponent({
  name: 'MockDiagnosisFlow',
  template: `
    <div class="diagnosis-flow-mock" data-testid="diagnosis-flow">
      <h2>HAQEI 診断フロー (Mock)</h2>
      <div class="progress-bar">
        <div class="progress" style="width: 50%"></div>
      </div>
      <div class="question-container">
        <p>現在の質問: サンプル質問です</p>
        <div class="response-buttons">
          <button v-for="i in 7" :key="i" @click="handleResponse(i)">{{ i }}</button>
        </div>
      </div>
      <div class="navigation">
        <button @click="previousQuestion">前の質問</button>
        <button @click="nextQuestion">次の質問</button>
      </div>
    </div>
  `,
  methods: {
    handleResponse(value: number) {
      console.log(`Response selected: ${value}`)
    },
    previousQuestion() {
      console.log('Previous question')
    },
    nextQuestion() {
      console.log('Next question')
    }
  }
})

// TripleOSAnalyzer Mock Component
export const MockTripleOSAnalyzer = defineComponent({
  name: 'MockTripleOSAnalyzer',
  props: {
    responses: {
      type: Array,
      default: () => []
    }
  },
  template: `
    <div class="triple-os-analyzer-mock" data-testid="triple-os-analyzer">
      <h2>Triple OS 分析結果 (Mock)</h2>
      <div class="os-results">
        <div class="engine-os">
          <h3>Engine OS</h3>
          <div class="score">85/100</div>
          <div class="characteristics">創造性、指導力</div>
        </div>
        <div class="interface-os">
          <h3>Interface OS</h3>
          <div class="score">78/100</div>
          <div class="characteristics">調和性、柔軟性</div>
        </div>
        <div class="safe-mode-os">
          <h3>Safe Mode OS</h3>
          <div class="score">73/100</div>
          <div class="characteristics">安定性、内省性</div>
        </div>
      </div>
      <div class="analysis-chart">
        <canvas ref="chartCanvas" width="400" height="300"></canvas>
      </div>
    </div>
  `,
  mounted() {
    // Chart描画のシミュレーション
    const canvas = this.$refs.chartCanvas as HTMLCanvasElement
    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#4CAF50'
        ctx.fillRect(50, 50, 100, 100)
        ctx.fillStyle = '#2196F3'
        ctx.fillRect(200, 75, 100, 75)
        ctx.fillStyle = '#FF9800'
        ctx.fillRect(350, 100, 100, 50)
      }
    }
  }
})

// DataMigrationDialog Mock Component
export const MockDataMigrationDialog = defineComponent({
  name: 'MockDataMigrationDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  template: `
    <div v-if="modelValue" class="data-migration-dialog-mock" data-testid="data-migration-dialog">
      <div class="dialog-overlay">
        <div class="dialog-content">
          <h2>データ移行 (Mock)</h2>
          <div class="migration-progress">
            <div class="step active">
              <span class="step-number">1</span>
              <span class="step-title">データ検出</span>
            </div>
            <div class="step">
              <span class="step-number">2</span>
              <span class="step-title">プライバシー設定</span>
            </div>
            <div class="step">
              <span class="step-number">3</span>
              <span class="step-title">移行実行</span>
            </div>
          </div>
          <div class="detected-data">
            <p>検出されたデータ: 7件</p>
            <ul>
              <li>ユーザーデータ: 1件</li>
              <li>セッションデータ: 1件</li>
              <li>Triple OSデータ: 3件</li>
              <li>分析結果: 2件</li>
            </ul>
          </div>
          <div class="privacy-settings">
            <label>
              <input type="radio" name="privacy" value="maximum" checked>
              最大プライバシー
            </label>
            <label>
              <input type="radio" name="privacy" value="high">
              高プライバシー
            </label>
            <label>
              <input type="radio" name="privacy" value="medium">
              中プライバシー
            </label>
          </div>
          <div class="dialog-actions">
            <button @click="startMigration" class="primary-button">移行開始</button>
            <button @click="closeDialog" class="secondary-button">キャンセル</button>
          </div>
        </div>
      </div>
    </div>
  `,
  methods: {
    startMigration() {
      console.log('Migration started')
      this.$emit('migration-started')
    },
    closeDialog() {
      this.$emit('update:modelValue', false)
    }
  }
})

// FutureSimulator Mock Component
export const MockFutureSimulator = defineComponent({
  name: 'MockFutureSimulator',
  props: {
    tripleOSData: {
      type: Object,
      default: () => ({})
    }
  },
  template: `
    <div class="future-simulator-mock" data-testid="future-simulator">
      <h2>Future Simulator (Mock)</h2>
      <div class="simulation-controls">
        <label>
          シミュレーション期間:
          <select v-model="simulationPeriod">
            <option value="1year">1年後</option>
            <option value="3years">3年後</option>
            <option value="5years">5年後</option>
          </select>
        </label>
        <button @click="runSimulation" class="simulate-button">シミュレーション実行</button>
      </div>
      <div v-if="simulationResults" class="simulation-results">
        <h3>予測結果</h3>
        <div class="prediction-chart">
          <canvas ref="predictionCanvas" width="500" height="300"></canvas>
        </div>
        <div class="predictions">
          <div class="prediction-item">
            <h4>キャリア発展</h4>
            <div class="probability">87%</div>
            <p>リーダーシップポジションへの昇進可能性が高い</p>
          </div>
          <div class="prediction-item">
            <h4>人間関係</h4>
            <div class="probability">92%</div>
            <p>強固な人的ネットワークの構築が期待される</p>
          </div>
          <div class="prediction-item">
            <h4>個人成長</h4>
            <div class="probability">78%</div>
            <p>継続的な自己改善と成長が見込まれる</p>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      simulationPeriod: '3years',
      simulationResults: null as any
    }
  },
  methods: {
    runSimulation() {
      console.log('Running future simulation...')
      
      // シミュレーション結果の生成
      this.simulationResults = {
        period: this.simulationPeriod,
        confidence: 0.85,
        predictions: [
          { category: 'career', probability: 0.87 },
          { category: 'relationships', probability: 0.92 },
          { category: 'growth', probability: 0.78 }
        ]
      }

      // チャート描画のシミュレーション
      this.$nextTick(() => {
        const canvas = this.$refs.predictionCanvas as HTMLCanvasElement
        if (canvas && canvas.getContext) {
          const ctx = canvas.getContext('2d')
          if (ctx) {
            // 簡単な予測チャートを描画
            ctx.fillStyle = '#E3F2FD'
            ctx.fillRect(0, 0, 500, 300)
            
            ctx.strokeStyle = '#1976D2'
            ctx.lineWidth = 3
            ctx.beginPath()
            ctx.moveTo(50, 250)
            ctx.lineTo(150, 200)
            ctx.lineTo(250, 150)
            ctx.lineTo(350, 100)
            ctx.lineTo(450, 80)
            ctx.stroke()
          }
        }
      })
    }
  }
})

// Settings Mock Component
export const MockSettings = defineComponent({
  name: 'MockSettings',
  template: `
    <div class="settings-mock" data-testid="settings">
      <h2>設定 (Mock)</h2>
      <div class="settings-section">
        <h3>プライバシー設定</h3>
        <label>
          <input type="checkbox" v-model="settings.analytics" />
          分析データの使用を許可
        </label>
        <label>
          <input type="checkbox" v-model="settings.notifications" />
          通知を受け取る
        </label>
      </div>
      <div class="settings-section">
        <h3>表示設定</h3>
        <label>
          テーマ:
          <select v-model="settings.theme">
            <option value="light">ライト</option>
            <option value="dark">ダーク</option>
            <option value="auto">自動</option>
          </select>
        </label>
        <label>
          言語:
          <select v-model="settings.language">
            <option value="ja">日本語</option>
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>
        </label>
      </div>
    </div>
  `,
  data() {
    return {
      settings: {
        analytics: true,
        notifications: false,
        theme: 'light',
        language: 'ja'
      }
    }
  }
})

// モックコンポーネントのエクスポート用マップ
export const mockComponents = {
  DiagnosisFlow: MockDiagnosisFlow,
  TripleOSAnalyzer: MockTripleOSAnalyzer,
  DataMigrationDialog: MockDataMigrationDialog,
  FutureSimulator: MockFutureSimulator,
  Settings: MockSettings
}

export default mockComponents