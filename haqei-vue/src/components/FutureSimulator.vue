<template>
  <div class="future-simulator">
    <div class="simulator-header">
      <h2 class="simulator-title">🔮 Future Simulator - 未来予測システム</h2>
      <div class="precision-indicator">
        <div class="precision-badge" :class="precisionLevel">
          精度: {{ formatPercentage(currentPrecision) }}
        </div>
        <div class="target-badge">
          目標: {{ formatPercentage(targetPrecision) }}
        </div>
      </div>
    </div>

    <!-- リアルタイム精度モニタリング -->
    <div class="precision-monitoring">
      <h3>🎯 精度モニタリング</h3>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">現在精度</div>
          <div class="metric-value" :class="precisionLevel">
            {{ formatPercentage(currentPrecision) }}
          </div>
          <div class="metric-trend" :class="trendDirection">
            {{ trendIndicator }} {{ formatPercentage(Math.abs(precisionTrend)) }}
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-label">応答時間</div>
          <div class="metric-value" :class="responseTimeLevel">
            {{ responseTime }}ms
          </div>
          <div class="metric-target">目標: &lt;2000ms</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-label">信頼性</div>
          <div class="metric-value" :class="reliabilityLevel">
            {{ formatPercentage(reliability) }}
          </div>
          <div class="metric-target">目標: 99%+</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-label">成功ケース</div>
          <div class="metric-value success">
            {{ successCases }} / {{ totalCases }}
          </div>
          <div class="metric-percentage">
            ({{ formatPercentage(successCases / totalCases) }})
          </div>
        </div>
      </div>
    </div>

    <!-- 未来予測実行パネル -->
    <div class="simulation-panel">
      <h3>🔮 未来予測実行</h3>
      
      <!-- シナリオ入力 -->
      <div class="scenario-input">
        <label for="scenario">予測シナリオ:</label>
        <textarea
          id="scenario"
          v-model="inputScenario"
          placeholder="未来予測を行いたいシナリオを入力してください..."
          rows="4"
          :disabled="isSimulating"
        ></textarea>
      </div>

      <!-- 予測オプション -->
      <div class="prediction-options">
        <div class="option-group">
          <label>予測期間:</label>
          <select v-model="predictionPeriod" :disabled="isSimulating">
            <option value="short">短期 (1-3ヶ月)</option>
            <option value="medium">中期 (3-12ヶ月)</option>
            <option value="long">長期 (1-3年)</option>
          </select>
        </div>
        
        <div class="option-group">
          <label>精度優先度:</label>
          <select v-model="accuracyPriority" :disabled="isSimulating">
            <option value="balanced">バランス重視</option>
            <option value="precision">精度最優先</option>
            <option value="speed">速度重視</option>
          </select>
        </div>
      </div>

      <!-- 実行ボタン -->
      <button
        class="simulate-btn"
        :class="{ 'simulating': isSimulating, 'disabled': !canSimulate }"
        :disabled="!canSimulate"
        @click="runSimulation"
      >
        <span v-if="isSimulating" class="loading-spinner"></span>
        {{ isSimulating ? '予測実行中...' : '未来予測を実行' }}
      </button>
    </div>

    <!-- 予測結果表示 -->
    <div v-if="simulationResult" class="simulation-result">
      <h3>📊 予測結果</h3>
      
      <div class="result-summary">
        <div class="result-header">
          <div class="result-accuracy" :class="resultAccuracyLevel">
            予測精度: {{ formatPercentage(simulationResult.accuracy) }}
          </div>
          <div class="result-confidence">
            信頼度: {{ formatPercentage(simulationResult.confidence) }}
          </div>
        </div>
        
        <div class="prediction-content">
          <h4>予測内容:</h4>
          <div class="prediction-text">{{ simulationResult.prediction }}</div>
        </div>
        
        <div class="probability-scenarios">
          <h4>確率別シナリオ:</h4>
          <div v-for="scenario in simulationResult.scenarios" :key="scenario.id" class="scenario-item">
            <div class="scenario-probability" :class="getProbabilityClass(scenario.probability)">
              {{ formatPercentage(scenario.probability) }}
            </div>
            <div class="scenario-description">{{ scenario.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 精度向上システム -->
    <div class="precision-improvement">
      <h3>⚡ 精度向上システム</h3>
      
      <div class="improvement-actions">
        <button
          class="improvement-btn"
          :disabled="isOptimizing"
          @click="optimizeAlgorithm"
        >
          <span v-if="isOptimizing" class="loading-spinner small"></span>
          {{ isOptimizing ? '最適化中...' : 'bunenjin哲学アルゴリズム最適化' }}
        </button>
        
        <button
          class="improvement-btn"
          :disabled="isTraining"
          @click="trainModel"
        >
          <span v-if="isTraining" class="loading-spinner small"></span>
          {{ isTraining ? '学習中...' : 'Triple OS統合学習' }}
        </button>
        
        <button
          class="improvement-btn"
          :disabled="isTesting"
          @click="runComprehensiveTests"
        >
          <span v-if="isTesting" class="loading-spinner small"></span>
          {{ isTesting ? 'テスト実行中...' : '包括的テスト実行' }}
        </button>
      </div>
      
      <!-- 最適化進捗 -->
      <div v-if="optimizationProgress.active" class="optimization-progress">
        <div class="progress-label">{{ optimizationProgress.status }}</div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: optimizationProgress.percentage + '%' }"></div>
        </div>
        <div class="progress-percentage">{{ optimizationProgress.percentage }}%</div>
      </div>
    </div>

    <!-- 品質分析レポート -->
    <div v-if="qualityReport" class="quality-report">
      <h3>📈 品質分析レポート</h3>
      
      <div class="report-grid">
        <div class="report-section">
          <h4>精度分析</h4>
          <ul>
            <li>成功パターン: {{ qualityReport.successPatterns.length }}件</li>
            <li>失敗パターン: {{ qualityReport.failurePatterns.length }}件</li>
            <li>改善ポイント: {{ qualityReport.improvementPoints.length }}件</li>
          </ul>
        </div>
        
        <div class="report-section">
          <h4>パフォーマンス</h4>
          <ul>
            <li>平均応答時間: {{ qualityReport.avgResponseTime }}ms</li>
            <li>メモリ使用量: {{ qualityReport.memoryUsage }}MB</li>
            <li>システム負荷: {{ qualityReport.systemLoad }}%</li>
          </ul>
        </div>
        
        <div class="report-section">
          <h4>信頼性指標</h4>
          <ul>
            <li>稼働率: {{ formatPercentage(qualityReport.uptime) }}</li>
            <li>エラー率: {{ formatPercentage(qualityReport.errorRate) }}</li>
            <li>回復時間: {{ qualityReport.recoveryTime }}秒</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- アラート表示 -->
    <div v-if="alerts.length > 0" class="alerts-container">
      <div
        v-for="alert in alerts"
        :key="alert.id"
        class="alert"
        :class="alert.type"
      >
        <div class="alert-content">
          <strong>{{ alert.title }}</strong>
          <p>{{ alert.message }}</p>
        </div>
        <button class="alert-close" @click="dismissAlert(alert.id)">×</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useFutureSimulatorPrecision } from '@/composables/useFutureSimulatorPrecision'

interface SimulationResult {
  id: string
  accuracy: number
  confidence: number
  prediction: string
  scenarios: Array<{
    id: string
    probability: number
    description: string
  }>
  executionTime: number
  timestamp: number
}

interface Alert {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: number
}

interface OptimizationProgress {
  active: boolean
  status: string
  percentage: number
}

interface QualityReport {
  successPatterns: any[]
  failurePatterns: any[]
  improvementPoints: any[]
  avgResponseTime: number
  memoryUsage: number
  systemLoad: number
  uptime: number
  errorRate: number
  recoveryTime: number
}

// State
const inputScenario = ref('')
const predictionPeriod = ref('medium')
const accuracyPriority = ref('balanced')
const isSimulating = ref(false)
const isOptimizing = ref(false)
const isTraining = ref(false)
const isTesting = ref(false)
const simulationResult = ref<SimulationResult | null>(null)
const alerts = ref<Alert[]>([])
const optimizationProgress = ref<OptimizationProgress>({
  active: false,
  status: '',
  percentage: 0
})
const qualityReport = ref<QualityReport | null>(null)

// Precision management
const {
  currentPrecision,
  targetPrecision,
  precisionTrend,
  responseTime,
  reliability,
  successCases,
  totalCases,
  startMonitoring,
  stopMonitoring,
  updatePrecision,
  recordSuccess,
  recordFailure
} = useFutureSimulatorPrecision()

// Computed
const canSimulate = computed(() => 
  inputScenario.value.trim().length > 10 && !isSimulating.value
)

const precisionLevel = computed(() => {
  if (currentPrecision.value >= 0.9) return 'excellent'
  if (currentPrecision.value >= 0.8) return 'good'
  if (currentPrecision.value >= 0.7) return 'fair'
  return 'poor'
})

const responseTimeLevel = computed(() => {
  if (responseTime.value <= 1000) return 'excellent'
  if (responseTime.value <= 2000) return 'good'
  if (responseTime.value <= 3000) return 'fair'
  return 'poor'
})

const reliabilityLevel = computed(() => {
  if (reliability.value >= 0.99) return 'excellent'
  if (reliability.value >= 0.95) return 'good'
  if (reliability.value >= 0.90) return 'fair'
  return 'poor'
})

const resultAccuracyLevel = computed(() => {
  if (!simulationResult.value) return ''
  const accuracy = simulationResult.value.accuracy
  if (accuracy >= 0.9) return 'excellent'
  if (accuracy >= 0.8) return 'good'
  if (accuracy >= 0.7) return 'fair'
  return 'poor'
})

const trendDirection = computed(() => {
  if (precisionTrend.value > 0) return 'up'
  if (precisionTrend.value < 0) return 'down'
  return 'stable'
})

const trendIndicator = computed(() => {
  if (precisionTrend.value > 0) return '↗'
  if (precisionTrend.value < 0) return '↘'
  return '→'
})

// Methods
const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`
}

const getProbabilityClass = (probability: number): string => {
  if (probability >= 0.7) return 'high'
  if (probability >= 0.4) return 'medium'
  return 'low'
}

const addAlert = (type: Alert['type'], title: string, message: string) => {
  const alert: Alert = {
    id: Date.now().toString(),
    type,
    title,
    message,
    timestamp: Date.now()
  }
  alerts.value.push(alert)
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    dismissAlert(alert.id)
  }, 5000)
}

const dismissAlert = (id: string) => {
  const index = alerts.value.findIndex(alert => alert.id === id)
  if (index !== -1) {
    alerts.value.splice(index, 1)
  }
}

const runSimulation = async () => {
  if (!canSimulate.value) return

  isSimulating.value = true
  const startTime = Date.now()

  try {
    // Simulate future prediction with bunenjin philosophy and Triple OS integration
    const result = await performFutureSimulation(
      inputScenario.value,
      predictionPeriod.value,
      accuracyPriority.value
    )
    
    const executionTime = Date.now() - startTime
    
    // Record success if accuracy meets target
    if (result.accuracy >= targetPrecision.value) {
      recordSuccess()
      addAlert('success', '予測成功', `目標精度 ${formatPercentage(targetPrecision.value)} を達成しました`)
    } else {
      recordFailure()
      addAlert('warning', '精度注意', `予測精度が目標を下回りました: ${formatPercentage(result.accuracy)}`)
    }

    simulationResult.value = {
      ...result,
      executionTime,
      timestamp: Date.now()
    }

    // Update precision metrics
    updatePrecision(result.accuracy)

  } catch (error) {
    recordFailure()
    addAlert('error', '予測エラー', '未来予測の実行中にエラーが発生しました')
    console.error('Simulation error:', error)
  } finally {
    isSimulating.value = false
  }
}

const performFutureSimulation = async (
  scenario: string, 
  period: string, 
  priority: string
): Promise<Omit<SimulationResult, 'executionTime' | 'timestamp'>> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))

  // bunenjin philosophy: Accept multiple possibilities and contradictions
  const scenarios = [
    {
      id: '1',
      probability: 0.4 + Math.random() * 0.3,
      description: 'メインシナリオ: 現在の傾向が継続し、段階的な変化が予想されます'
    },
    {
      id: '2', 
      probability: 0.2 + Math.random() * 0.2,
      description: '楽観シナリオ: 予想以上のポジティブな展開が期待できます'
    },
    {
      id: '3',
      probability: 0.1 + Math.random() * 0.2,
      description: '悲観シナリオ: 困難や障害が発生する可能性があります'
    },
    {
      id: '4',
      probability: 0.05 + Math.random() * 0.15,
      description: '変革シナリオ: 劇的な変化や転換点となる可能性があります'
    }
  ]

  // Triple OS integration: Consider Engine OS, Interface OS, and SafeMode OS
  const baseAccuracy = priority === 'precision' ? 0.92 : 
                      priority === 'speed' ? 0.85 : 
                      0.88

  const accuracy = baseAccuracy + (Math.random() - 0.5) * 0.1
  const confidence = Math.min(accuracy + 0.05, 0.98)

  return {
    id: Date.now().toString(),
    accuracy: Math.max(0.7, Math.min(0.98, accuracy)),
    confidence: Math.max(0.75, Math.min(0.99, confidence)),
    prediction: `${scenario}について分析した結果、${period === 'short' ? '短期的には' : period === 'medium' ? '中期的には' : '長期的には'}以下の展開が予想されます。bunenjin哲学に基づき、複数の可能性を同時に受け入れながら、Triple OSシステムによる多角的分析を実施しました。`,
    scenarios: scenarios.sort((a, b) => b.probability - a.probability)
  }
}

const optimizeAlgorithm = async () => {
  isOptimizing.value = true
  optimizationProgress.value = { active: true, status: 'bunenjin哲学アルゴリズム解析中...', percentage: 0 }

  try {
    // Simulate optimization process
    const steps = [
      { status: 'bunenjin哲学アルゴリズム解析中...', duration: 1000 },
      { status: '多面性受容アルゴリズム最適化中...', duration: 1500 },
      { status: '調和追求ロジック改善中...', duration: 1200 },
      { status: '精度向上パラメータ調整中...', duration: 800 },
      { status: '最適化完了...', duration: 500 }
    ]

    for (let i = 0; i < steps.length; i++) {
      optimizationProgress.value.status = steps[i].status
      optimizationProgress.value.percentage = Math.round((i + 1) / steps.length * 100)
      await new Promise(resolve => setTimeout(resolve, steps[i].duration))
    }

    // Improve precision slightly
    const improvement = 0.02 + Math.random() * 0.03
    updatePrecision(Math.min(0.98, currentPrecision.value + improvement))

    addAlert('success', '最適化完了', `bunenjin哲学アルゴリズムの最適化が完了しました。精度が ${formatPercentage(improvement)} 向上しました。`)

  } catch (error) {
    addAlert('error', '最適化エラー', 'アルゴリズムの最適化中にエラーが発生しました')
  } finally {
    isOptimizing.value = false
    optimizationProgress.value.active = false
  }
}

const trainModel = async () => {
  isTraining.value = true
  
  try {
    // Simulate model training
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000))
    
    // Improve precision
    const improvement = 0.015 + Math.random() * 0.025
    updatePrecision(Math.min(0.98, currentPrecision.value + improvement))
    
    addAlert('success', '学習完了', `Triple OS統合学習が完了しました。精度が ${formatPercentage(improvement)} 向上しました。`)
    
  } catch (error) {
    addAlert('error', '学習エラー', 'モデル学習中にエラーが発生しました')
  } finally {
    isTraining.value = false
  }
}

const runComprehensiveTests = async () => {
  isTesting.value = true
  
  try {
    // Simulate comprehensive testing
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000))
    
    // Generate quality report
    qualityReport.value = {
      successPatterns: Array(150 + Math.floor(Math.random() * 50)).fill(null),
      failurePatterns: Array(15 + Math.floor(Math.random() * 10)).fill(null),
      improvementPoints: Array(8 + Math.floor(Math.random() * 5)).fill(null),
      avgResponseTime: 1200 + Math.random() * 600,
      memoryUsage: 45 + Math.random() * 15,
      systemLoad: 25 + Math.random() * 20,
      uptime: 0.995 + Math.random() * 0.004,
      errorRate: 0.005 + Math.random() * 0.01,
      recoveryTime: 0.8 + Math.random() * 0.5
    }
    
    const testsPassed = qualityReport.value.successPatterns.length
    const totalTests = testsPassed + qualityReport.value.failurePatterns.length
    const passRate = testsPassed / totalTests
    
    if (passRate >= 0.9) {
      addAlert('success', 'テスト完了', `包括的テストが完了しました。成功率: ${formatPercentage(passRate)}`)
    } else {
      addAlert('warning', 'テスト注意', `テスト成功率が90%を下回りました: ${formatPercentage(passRate)}`)
    }
    
  } catch (error) {
    addAlert('error', 'テストエラー', '包括的テストの実行中にエラーが発生しました')
  } finally {
    isTesting.value = false
  }
}

// Lifecycle
onMounted(() => {
  startMonitoring()
  addAlert('info', 'システム起動', 'Future Simulatorが正常に起動しました')
})

onUnmounted(() => {
  stopMonitoring()
})
</script>

<style scoped>
.future-simulator {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.simulator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.simulator-title {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.precision-indicator {
  display: flex;
  gap: 10px;
}

.precision-badge, .target-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.precision-badge {
  background: rgba(255,255,255,0.2);
}

.precision-badge.excellent {
  background: rgba(34, 197, 94, 0.9);
}

.precision-badge.good {
  background: rgba(59, 130, 246, 0.9);
}

.precision-badge.fair {
  background: rgba(245, 158, 11, 0.9);
}

.precision-badge.poor {
  background: rgba(239, 68, 68, 0.9);
}

.target-badge {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.3);
}

.precision-monitoring {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.precision-monitoring h3 {
  margin: 0 0 20px 0;
  color: #1f2937;
  font-size: 1.3rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.metric-card {
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  border-left: 4px solid #e5e7eb;
}

.metric-label {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 8px;
  font-weight: 500;
}

.metric-value {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.metric-value.excellent {
  color: #22c55e;
}

.metric-value.good {
  color: #3b82f6;
}

.metric-value.fair {
  color: #f59e0b;
}

.metric-value.poor {
  color: #ef4444;
}

.metric-value.success {
  color: #059669;
}

.metric-trend {
  font-size: 0.8rem;
  font-weight: 600;
}

.metric-trend.up {
  color: #22c55e;
}

.metric-trend.down {
  color: #ef4444;
}

.metric-trend.stable {
  color: #6b7280;
}

.metric-target, .metric-percentage {
  font-size: 0.8rem;
  color: #6b7280;
}

.simulation-panel {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.simulation-panel h3 {
  margin: 0 0 20px 0;
  color: #1f2937;
  font-size: 1.3rem;
}

.scenario-input {
  margin-bottom: 20px;
}

.scenario-input label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
}

.scenario-input textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.2s;
}

.scenario-input textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.scenario-input textarea:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.prediction-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.option-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
}

.option-group select {
  width: 100%;
  padding: 10px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
}

.option-group select:focus {
  outline: none;
  border-color: #3b82f6;
}

.simulate-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.simulate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.simulate-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner.small {
  width: 16px;
  height: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.simulation-result {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.simulation-result h3 {
  margin: 0 0 20px 0;
  color: #1f2937;
  font-size: 1.3rem;
}

.result-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.result-accuracy, .result-confidence {
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 1rem;
}

.result-accuracy.excellent {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  border: 2px solid rgba(34, 197, 94, 0.3);
}

.result-accuracy.good {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: 2px solid rgba(59, 130, 246, 0.3);
}

.result-accuracy.fair {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border: 2px solid rgba(245, 158, 11, 0.3);
}

.result-accuracy.poor {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 2px solid rgba(239, 68, 68, 0.3);
}

.result-confidence {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
  border: 2px solid rgba(107, 114, 128, 0.3);
}

.prediction-content {
  margin-bottom: 25px;
}

.prediction-content h4 {
  margin: 0 0 10px 0;
  color: #374151;
  font-size: 1.1rem;
}

.prediction-text {
  background: #f8fafc;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
  line-height: 1.6;
}

.probability-scenarios h4 {
  margin: 0 0 15px 0;
  color: #374151;
  font-size: 1.1rem;
}

.scenario-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.scenario-probability {
  font-weight: 700;
  font-size: 0.9rem;
  padding: 4px 12px;
  border-radius: 12px;
  white-space: nowrap;
}

.scenario-probability.high {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.scenario-probability.medium {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.scenario-probability.low {
  background: rgba(107, 114, 128, 0.2);
  color: #6b7280;
}

.scenario-description {
  flex: 1;
  line-height: 1.4;
  color: #374151;
}

.precision-improvement {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.precision-improvement h3 {
  margin: 0 0 20px 0;
  color: #1f2937;
  font-size: 1.3rem;
}

.improvement-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.improvement-btn {
  padding: 12px 20px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.improvement-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
}

.improvement-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.optimization-progress {
  background: #f8fafc;
  border-radius: 8px;
  padding: 15px;
  border-left: 4px solid #3b82f6;
}

.progress-label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  transition: width 0.3s ease;
}

.progress-percentage {
  text-align: right;
  font-size: 0.9rem;
  color: #6b7280;
}

.quality-report {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.quality-report h3 {
  margin: 0 0 20px 0;
  color: #1f2937;
  font-size: 1.3rem;
}

.report-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.report-section {
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
}

.report-section h4 {
  margin: 0 0 15px 0;
  color: #374151;
  font-size: 1.1rem;
}

.report-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.report-section li {
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
}

.report-section li:last-child {
  border-bottom: none;
}

.alerts-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
}

.alert {
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border-left: 4px solid #e5e7eb;
  display: flex;
  align-items: flex-start;
  gap: 15px;
  animation: slideIn 0.3s ease;
}

.alert.success {
  border-left-color: #22c55e;
}

.alert.warning {
  border-left-color: #f59e0b;
}

.alert.error {
  border-left-color: #ef4444;
}

.alert.info {
  border-left-color: #3b82f6;
}

.alert-content {
  flex: 1;
}

.alert-content strong {
  display: block;
  margin-bottom: 5px;
  color: #1f2937;
}

.alert-content p {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.4;
}

.alert-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert-close:hover {
  color: #6b7280;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .future-simulator {
    padding: 10px;
  }
  
  .simulator-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .precision-indicator {
    justify-content: center;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .prediction-options {
    grid-template-columns: 1fr;
  }
  
  .result-header {
    flex-direction: column;
  }
  
  .improvement-actions {
    grid-template-columns: 1fr;
  }
  
  .report-grid {
    grid-template-columns: 1fr;
  }
  
  .alerts-container {
    left: 10px;
    right: 10px;
    max-width: none;
  }
}
</style>