<template>
  <div class="eastern-triple-os" :class="visualizationTheme">
    <!-- 五行思想に基づく Triple OS 視覚化 -->
    <div class="wuxing-container" aria-label="五行思想による Triple OS 分析">
      <div class="wuxing-center">
        <div class="center-symbol">
          <span class="taiji-symbol">☯</span>
          <div class="center-text">{{ translate('tripleOS.balance') }}</div>
        </div>
      </div>
      
      <!-- Engine OS - 火の要素 -->
      <div class="os-element os-engine wuxing-fire" :class="{ active: activeOS === 'engine' }">
        <div class="element-header">
          <div class="element-symbol">🔥</div>
          <h3 class="element-title">{{ translate('tripleOS.engine.title') }}</h3>
          <div class="element-chinese">火</div>
        </div>
        
        <div class="element-content">
          <div class="os-strength-meter">
            <div class="meter-container">
              <svg class="circular-meter" viewBox="0 0 100 100">
                <circle 
                  class="meter-background" 
                  cx="50" 
                  cy="50" 
                  r="45"
                  fill="none"
                  stroke-width="8"
                />
                <circle 
                  class="meter-progress" 
                  cx="50" 
                  cy="50" 
                  r="45"
                  fill="none"
                  stroke-width="8"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="engineOffset"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div class="meter-value">{{ engineData.strength }}%</div>
            </div>
            <div class="strength-label">{{ translate('tripleOS.strength') }}</div>
          </div>
          
          <div class="os-characteristics">
            <div class="characteristic-item" v-for="char in engineData.characteristics" :key="char.id">
              <div class="char-icon">{{ char.icon }}</div>
              <div class="char-content">
                <div class="char-name">{{ char.name }}</div>
                <div class="char-value">{{ char.value }}</div>
              </div>
            </div>
          </div>
          
          <div class="os-keywords">
            <span 
              v-for="keyword in engineData.keywords" 
              :key="keyword"
              class="keyword-tag fire-tag"
            >
              {{ keyword }}
            </span>
          </div>
        </div>
        
        <div class="element-interactions">
          <div class="interaction-arrows">
            <div class="arrow to-interface" title="Interface OS への影響">→</div>
            <div class="arrow to-safemode" title="SafeMode OS への影響">↘</div>
          </div>
        </div>
      </div>
      
      <!-- Interface OS - 水の要素 -->
      <div class="os-element os-interface wuxing-water" :class="{ active: activeOS === 'interface' }">
        <div class="element-header">
          <div class="element-symbol">💧</div>
          <h3 class="element-title">{{ translate('tripleOS.interface.title') }}</h3>
          <div class="element-chinese">水</div>
        </div>
        
        <div class="element-content">
          <div class="os-adaptability-flow">
            <div class="flow-container">
              <div class="flow-wave" v-for="n in 5" :key="n" :style="{ animationDelay: `${n * 0.2}s` }"></div>
            </div>
            <div class="adaptability-value">{{ interfaceData.adaptability }}%</div>
            <div class="adaptability-label">{{ translate('tripleOS.adaptability') }}</div>
          </div>
          
          <div class="social-harmony-chart">
            <div class="harmony-radar">
              <svg viewBox="0 0 200 200" class="radar-svg">
                <!-- 背景グリッド -->
                <g class="radar-grid">
                  <circle cx="100" cy="100" r="20" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
                  <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
                  <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
                  <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
                  
                  <!-- 軸線 -->
                  <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
                  <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
                  <line x1="42" y1="42" x2="158" y2="158" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
                  <line x1="158" y1="42" x2="42" y2="158" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
                </g>
                
                <!-- データポリゴン -->
                <polygon 
                  :points="interfaceRadarPoints"
                  fill="rgba(3, 169, 244, 0.3)"
                  stroke="rgba(3, 169, 244, 0.8)"
                  stroke-width="2"
                />
                
                <!-- データポイント -->
                <circle 
                  v-for="(point, index) in interfaceData.socialSkills" 
                  :key="index"
                  :cx="point.x" 
                  :cy="point.y" 
                  r="4"
                  fill="rgba(3, 169, 244, 1)"
                />
              </svg>
            </div>
            <div class="radar-labels">
              <div class="radar-label" v-for="skill in interfaceData.socialSkills" :key="skill.name">
                {{ skill.name }}: {{ skill.value }}
              </div>
            </div>
          </div>
          
          <div class="os-keywords">
            <span 
              v-for="keyword in interfaceData.keywords" 
              :key="keyword"
              class="keyword-tag water-tag"
            >
              {{ keyword }}
            </span>
          </div>
        </div>
        
        <div class="element-interactions">
          <div class="interaction-arrows">
            <div class="arrow to-engine" title="Engine OS への影響">↖</div>
            <div class="arrow to-safemode" title="SafeMode OS への影響">↓</div>
          </div>
        </div>
      </div>
      
      <!-- SafeMode OS - 土の要素 -->
      <div class="os-element os-safemode wuxing-earth" :class="{ active: activeOS === 'safemode' }">
        <div class="element-header">
          <div class="element-symbol">🌱</div>
          <h3 class="element-title">{{ translate('tripleOS.safemode.title') }}</h3>
          <div class="element-chinese">土</div>
        </div>
        
        <div class="element-content">
          <div class="protection-shield">
            <div class="shield-container">
              <!-- 防御層の視覚化 -->
              <div class="shield-layer" v-for="(layer, index) in safemodeData.protectionLayers" :key="index">
                <div 
                  class="layer-segment"
                  v-for="(segment, segIndex) in 8"
                  :key="segIndex"
                  :style="{
                    transform: `rotate(${segIndex * 45}deg)`,
                    backgroundColor: `rgba(76, 175, 80, ${layer.strength * 0.01})`,
                    animationDelay: `${(index + segIndex) * 0.1}s`
                  }"
                ></div>
              </div>
              <div class="shield-center">
                <div class="protection-value">{{ safemodeData.protection }}%</div>
                <div class="protection-label">{{ translate('tripleOS.protection') }}</div>
              </div>
            </div>
          </div>
          
          <div class="stress-response-chart">
            <div class="response-timeline">
              <div 
                v-for="response in safemodeData.stressResponses" 
                :key="response.id"
                class="response-item"
                :class="`response-${response.intensity}`"
              >
                <div class="response-trigger">{{ response.trigger }}</div>
                <div class="response-action">{{ response.action }}</div>
                <div class="response-meter">
                  <div 
                    class="meter-fill"
                    :style="{ width: `${response.effectiveness}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="os-keywords">
            <span 
              v-for="keyword in safemodeData.keywords" 
              :key="keyword"
              class="keyword-tag earth-tag"
            >
              {{ keyword }}
            </span>
          </div>
        </div>
        
        <div class="element-interactions">
          <div class="interaction-arrows">
            <div class="arrow to-engine" title="Engine OS への影響">↑</div>
            <div class="arrow to-interface" title="Interface OS への影響">↗</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 相互作用の可視化 -->
    <div class="interaction-flow-visualization" aria-label="OS間相互作用">
      <h4 class="flow-title">{{ translate('tripleOS.interactions.title') }}</h4>
      <div class="flow-diagram">
        <svg class="interaction-svg" viewBox="0 0 400 300">
          <!-- 相互作用の矢印と流れ -->
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="rgba(104, 159, 56, 0.8)" />
            </marker>
          </defs>
          
          <!-- Engine → Interface 流れ -->
          <path 
            d="M 100 100 Q 200 50 300 100"
            fill="none"
            stroke="rgba(244, 67, 54, 0.6)"
            stroke-width="3"
            marker-end="url(#arrowhead)"
            class="flow-path"
          >
            <animate attributeName="stroke-dasharray" values="0,300;150,150;300,0" dur="3s" repeatCount="indefinite"/>
          </path>
          
          <!-- Interface → SafeMode 流れ -->
          <path 
            d="M 300 120 Q 350 200 300 250"
            fill="none"
            stroke="rgba(3, 169, 244, 0.6)"
            stroke-width="3"
            marker-end="url(#arrowhead)"
            class="flow-path"
          >
            <animate attributeName="stroke-dasharray" values="0,300;150,150;300,0" dur="3s" repeatCount="indefinite" begin="1s"/>
          </path>
          
          <!-- SafeMode → Engine 流れ -->
          <path 
            d="M 280 250 Q 150 280 100 150"
            fill="none"
            stroke="rgba(76, 175, 80, 0.6)"
            stroke-width="3"
            marker-end="url(#arrowhead)"
            class="flow-path"
          >
            <animate attributeName="stroke-dasharray" values="0,300;150,150;300,0" dur="3s" repeatCount="indefinite" begin="2s"/>
          </path>
          
          <!-- OS ノード -->
          <circle cx="100" cy="125" r="20" fill="rgba(244, 67, 54, 0.8)" class="os-node engine-node"/>
          <circle cx="300" cy="100" r="20" fill="rgba(3, 169, 244, 0.8)" class="os-node interface-node"/>
          <circle cx="300" cy="250" r="20" fill="rgba(76, 175, 80, 0.8)" class="os-node safemode-node"/>
          
          <!-- ノードラベル -->
          <text x="100" y="130" text-anchor="middle" fill="white" font-size="10" font-weight="bold">E</text>
          <text x="300" y="105" text-anchor="middle" fill="white" font-size="10" font-weight="bold">I</text>
          <text x="300" y="255" text-anchor="middle" fill="white" font-size="10" font-weight="bold">S</text>
        </svg>
      </div>
      
      <div class="interaction-legend">
        <div class="legend-item">
          <div class="legend-color engine-color"></div>
          <span>{{ translate('tripleOS.interactions.engine') }}</span>
        </div>
        <div class="legend-item">
          <div class="legend-color interface-color"></div>
          <span>{{ translate('tripleOS.interactions.interface') }}</span>
        </div>
        <div class="legend-item">
          <div class="legend-color safemode-color"></div>
          <span>{{ translate('tripleOS.interactions.safemode') }}</span>
        </div>
      </div>
    </div>
    
    <!-- バランス状態の総合評価 -->
    <div class="balance-assessment" aria-label="Triple OS バランス評価">
      <h4 class="assessment-title">{{ translate('tripleOS.balance.title') }}</h4>
      <div class="balance-visualization">
        <div class="balance-triangle">
          <svg viewBox="0 0 200 200" class="triangle-svg">
            <!-- 三角形の枠 -->
            <path 
              d="M 100 20 L 180 160 L 20 160 Z"
              fill="none"
              stroke="rgba(0,0,0,0.2)"
              stroke-width="2"
            />
            
            <!-- バランスポイント -->
            <circle 
              :cx="balancePoint.x" 
              :cy="balancePoint.y" 
              r="8"
              fill="rgba(255, 152, 0, 0.8)"
              class="balance-point zen-float"
            />
            
            <!-- 理想バランス領域 -->
            <circle 
              cx="100" 
              cy="120" 
              r="30"
              fill="rgba(104, 159, 56, 0.1)"
              stroke="rgba(104, 159, 56, 0.3)"
              stroke-width="2"
              stroke-dasharray="5,5"
            />
            
            <!-- 頂点ラベル -->
            <text x="100" y="15" text-anchor="middle" font-size="12" font-weight="bold">Engine</text>
            <text x="185" y="170" text-anchor="middle" font-size="12" font-weight="bold">Interface</text>
            <text x="15" y="170" text-anchor="middle" font-size="12" font-weight="bold">SafeMode</text>
          </svg>
        </div>
        
        <div class="balance-metrics">
          <div class="metric-item">
            <div class="metric-label">{{ translate('tripleOS.balance.harmony') }}</div>
            <div class="metric-value">{{ balanceMetrics.harmony }}%</div>
            <div class="metric-bar">
              <div class="bar-fill" :style="{ width: `${balanceMetrics.harmony}%` }"></div>
            </div>
          </div>
          
          <div class="metric-item">
            <div class="metric-label">{{ translate('tripleOS.balance.stability') }}</div>
            <div class="metric-value">{{ balanceMetrics.stability }}%</div>
            <div class="metric-bar">
              <div class="bar-fill" :style="{ width: `${balanceMetrics.stability}%` }"></div>
            </div>
          </div>
          
          <div class="metric-item">
            <div class="metric-label">{{ translate('tripleOS.balance.flexibility') }}</div>
            <div class="metric-value">{{ balanceMetrics.flexibility }}%</div>
            <div class="metric-bar">
              <div class="bar-fill" :style="{ width: `${balanceMetrics.flexibility}%` }"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="balance-insights">
        <div class="insight-item" v-for="insight in balanceInsights" :key="insight.id">
          <div class="insight-icon">{{ insight.icon }}</div>
          <div class="insight-content">
            <h5 class="insight-title">{{ insight.title }}</h5>
            <p class="insight-description">{{ insight.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * EasternTripleOSVisualization - 東洋的美意識に基づくTriple OS視覚化コンポーネント
 * 
 * 特徴：
 * - 五行思想（木火土金水）による OS 要素の配置
 * - 太極図と易経の象徴体系の統合
 * - 相互作用の動的視覚化
 * - バランス状態の三角図表現
 * - 東洋的色彩と形状の活用
 */

interface OSCharacteristic {
  id: string
  name: string
  icon: string
  value: number
}

interface SocialSkill {
  name: string
  value: number
  x: number
  y: number
}

interface ProtectionLayer {
  strength: number
  type: string
}

interface StressResponse {
  id: string
  trigger: string
  action: string
  effectiveness: number
  intensity: 'low' | 'medium' | 'high'
}

interface BalanceMetrics {
  harmony: number
  stability: number
  flexibility: number
}

interface BalanceInsight {
  id: string
  icon: string
  title: string
  description: string
}

const { t } = useI18n()

// TypeScript用のtヘルパー関数
const translate = (key: string, params?: Record<string, any>) => {
  try {
    return t(key, params)
  } catch {
    return key
  }
}

// 視覚化テーマ
const visualizationTheme = ref('eastern-wuxing')
const activeOS = ref('')

// Engine OS データ（火の要素）
const engineData = ref({
  strength: 75,
  characteristics: [
    { id: 'passion', name: '情熱', icon: '🔥', value: 85 },
    { id: 'determination', name: '決意', icon: '💪', value: 70 },
    { id: 'creativity', name: '創造性', icon: '🎨', value: 80 },
    { id: 'leadership', name: '指導力', icon: '👑', value: 65 }
  ] as OSCharacteristic[],
  keywords: ['情熱', '創造', '指導', '革新', '直感']
})

// Interface OS データ（水の要素）
const interfaceData = ref({
  adaptability: 68,
  socialSkills: [
    { name: '共感力', value: 75, x: 100, y: 30 },
    { name: '表現力', value: 70, x: 150, y: 80 },
    { name: '協調性', value: 65, x: 130, y: 140 },
    { name: '対話力', value: 80, x: 70, y: 140 },
    { name: '観察力', value: 85, x: 50, y: 80 }
  ] as SocialSkill[],
  keywords: ['適応', '調和', '表現', '共感', '柔軟']
})

// SafeMode OS データ（土の要素）
const safemodeData = ref({
  protection: 82,
  protectionLayers: [
    { strength: 90, type: '基本防御' },
    { strength: 75, type: '感情制御' },
    { strength: 85, type: '危機回避' },
    { strength: 70, type: '適応調整' }
  ] as ProtectionLayer[],
  stressResponses: [
    { id: 'avoid', trigger: '対立', action: '回避', effectiveness: 85, intensity: 'high' as const },
    { id: 'analyze', trigger: '不安', action: '分析', effectiveness: 70, intensity: 'medium' as const },
    { id: 'withdraw', trigger: '圧力', action: '撤退', effectiveness: 75, intensity: 'medium' as const },
    { id: 'adapt', trigger: '変化', action: '適応', effectiveness: 90, intensity: 'low' as const }
  ] as StressResponse[],
  keywords: ['防御', '安定', '慎重', '保護', '持続']
})

// 円周の計算
const circumference = computed(() => 2 * Math.PI * 45)

// Engine OS メーターのオフセット
const engineOffset = computed(() => {
  const progress = engineData.value.strength / 100
  return circumference.value * (1 - progress)
})

// Interface OS レーダーチャートのポイント
const interfaceRadarPoints = computed(() => {
  return interfaceData.value.socialSkills.map(skill => `${skill.x},${skill.y}`).join(' ')
})

// バランス状態の計算
const balancePoint = computed(() => {
  const engine = engineData.value.strength
  const interface_ = interfaceData.value.adaptability
  const safemode = safemodeData.value.protection
  
  // 三角形内のバランスポイント計算
  const total = engine + interface_ + safemode
  const engineWeight = engine / total
  const interfaceWeight = interface_ / total
  const safemodeWeight = safemode / total
  
  // 三角形の頂点座標
  const engineVertex = { x: 100, y: 20 }
  const interfaceVertex = { x: 180, y: 160 }
  const safemodeVertex = { x: 20, y: 160 }
  
  // 重心計算
  const x = engineVertex.x * engineWeight + interfaceVertex.x * interfaceWeight + safemodeVertex.x * safemodeWeight
  const y = engineVertex.y * engineWeight + interfaceVertex.y * interfaceWeight + safemodeVertex.y * safemodeWeight
  
  return { x, y }
})

// バランスメトリクス
const balanceMetrics = ref<BalanceMetrics>({
  harmony: 78,
  stability: 82,
  flexibility: 71
})

// バランスインサイト
const balanceInsights = ref<BalanceInsight[]>([
  {
    id: 'strong_foundation',
    icon: '🏔️',
    title: 'しっかりとした基盤',
    description: 'SafeMode OS が強固で、安定した判断ができます'
  },
  {
    id: 'creative_drive',
    icon: '🌟',
    title: '創造的な推進力',
    description: 'Engine OS の情熱が新しいアイデアを生み出します'
  },
  {
    id: 'social_harmony',
    icon: '🤝',
    title: '社会的調和',
    description: 'Interface OS が円滑な人間関係を築きます'
  }
])

// OS 要素のホバー処理
const onOSHover = (osType: string) => {
  activeOS.value = osType
}

const onOSLeave = () => {
  activeOS.value = ''
}

// アニメーション初期化
onMounted(() => {
  // レーダーチャートのポイント位置を計算
  interfaceData.value.socialSkills = interfaceData.value.socialSkills.map((skill, index) => {
    const angle = (index * 72 - 90) * (Math.PI / 180) // 5角形の各頂点
    const radius = (skill.value / 100) * 60 + 20 // 最小20、最大80の半径
    return {
      ...skill,
      x: 100 + Math.cos(angle) * radius,
      y: 100 + Math.sin(angle) * radius
    }
  })
})
</script>

<style scoped>
.eastern-triple-os {
  padding: var(--ma-contemplative);
  background: var(--paper-texture);
  border-radius: 1.618rem;
  min-height: 100vh;
}

.eastern-wuxing .wuxing-container {
  display: grid;
  grid-template-areas: 
    ". engine ."
    "safemode center interface"
    ". . .";
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: var(--ma-social);
  max-width: 80rem;
  margin: 0 auto;
  position: relative;
}

.wuxing-center {
  grid-area: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.center-symbol {
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  background: var(--zen-white);
  border: 3px solid var(--bamboo-green);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  position: relative;
}

.taiji-symbol {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  animation: zenFloat 6s ease-in-out infinite;
}

.center-text {
  font-size: 0.75rem;
  font-weight: bold;
  color: var(--ink-black);
}

/* OS 要素の基本スタイル */
.os-element {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.618rem;
  padding: var(--ma-social);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.os-element::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  opacity: 0.1;
  transition: all var(--transition-slow);
  pointer-events: none;
}

.os-element:hover {
  transform: translateY(-0.5rem);
  box-shadow: var(--shadow-xl);
}

.os-element.active::before {
  opacity: 0.3;
}

/* 五行要素の配置 */
.os-engine {
  grid-area: engine;
}

.os-interface {
  grid-area: interface;
}

.os-safemode {
  grid-area: safemode;
}

/* 五行色彩システム */
.wuxing-fire {
  border-left: 6px solid var(--fire-red);
}

.wuxing-fire::before {
  background: radial-gradient(circle, var(--fire-red) 0%, transparent 70%);
}

.wuxing-water {
  border-left: 6px solid var(--sky-blue);
}

.wuxing-water::before {
  background: radial-gradient(circle, var(--sky-blue) 0%, transparent 70%);
}

.wuxing-earth {
  border-left: 6px solid var(--bamboo-green);
}

.wuxing-earth::before {
  background: radial-gradient(circle, var(--bamboo-green) 0%, transparent 70%);
}

/* 要素ヘッダー */
.element-header {
  display: flex;
  align-items: center;
  gap: var(--ma-personal);
  margin-bottom: var(--ma-social);
}

.element-symbol {
  font-size: 2rem;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
}

.element-title {
  flex: 1;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--ink-black);
}

.element-chinese {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--wabi-grey);
}

/* Engine OS の円形メーター */
.os-strength-meter {
  text-align: center;
  margin-bottom: var(--ma-social);
}

.meter-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto var(--ma-personal);
}

.circular-meter {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.meter-background {
  stroke: rgba(244, 67, 54, 0.1);
}

.meter-progress {
  stroke: var(--fire-red);
  transition: stroke-dashoffset 2s ease;
}

.meter-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--fire-red);
}

.strength-label {
  font-size: 0.875rem;
  color: var(--wabi-grey);
}

/* OS 特性 */
.os-characteristics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--ma-personal);
  margin-bottom: var(--ma-social);
}

.characteristic-item {
  display: flex;
  align-items: center;
  gap: var(--ma-intimate);
  padding: var(--ma-intimate);
  background: rgba(0, 0, 0, 0.03);
  border-radius: 0.5rem;
}

.char-icon {
  font-size: 1.25rem;
}

.char-content {
  flex: 1;
}

.char-name {
  font-size: 0.75rem;
  color: var(--wabi-grey);
}

.char-value {
  font-weight: bold;
  color: var(--ink-black);
}

/* Interface OS の流れアニメーション */
.os-adaptability-flow {
  text-align: center;
  margin-bottom: var(--ma-social);
}

.flow-container {
  position: relative;
  width: 100px;
  height: 60px;
  margin: 0 auto var(--ma-personal);
  overflow: hidden;
  border-radius: 2rem;
  background: rgba(3, 169, 244, 0.1);
}

.flow-wave {
  position: absolute;
  top: 0;  
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(3, 169, 244, 0.3) 50%, 
    transparent 100%);
  animation: flowWave 3s linear infinite;
}

@keyframes flowWave {
  0% { left: -100%; }
  100% { left: 100%; }
}

.adaptability-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--sky-blue);
}

.adaptability-label {
  font-size: 0.875rem;
  color: var(--wabi-grey);
}

/* レーダーチャート */
.social-harmony-chart {
  margin-bottom: var(--ma-social);
}

.harmony-radar {
  width: 200px;
  height: 200px;
  margin: 0 auto var(--ma-personal);
}

.radar-svg {
  width: 100%;
  height: 100%;
}

.radar-labels {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--ma-intimate);
}

.radar-label {
  font-size: 0.75rem;
  text-align: center;
  color: var(--wabi-grey);
}

/* SafeMode OS の防御シールド */
.protection-shield {
  text-align: center;
  margin-bottom: var(--ma-social);
}

.shield-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto var(--ma-personal);
}

.shield-layer {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
}

.layer-segment {
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  height: 50%;
  background: rgba(76, 175, 80, 0.3);
  transform-origin: bottom;
  animation: shieldPulse 2s ease-in-out infinite;
}

@keyframes shieldPulse {
  0%, 100% { height: 50%; opacity: 0.3; }
  50% { height: 60%; opacity: 0.7; }
}

.shield-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--zen-white);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--bamboo-green);
}

.protection-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--bamboo-green);
}

.protection-label {
  font-size: 0.625rem;
  color: var(--wabi-grey);
}

/* ストレス反応チャート */
.stress-response-chart {
  margin-bottom: var(--ma-social);
}

.response-timeline {
  display: flex;
  flex-direction: column;
  gap: var(--ma-intimate);
}

.response-item {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: var(--ma-intimate);
  align-items: center;
  padding: var(--ma-intimate);
  border-radius: 0.5rem;
}

.response-item.response-high {
  background: rgba(244, 67, 54, 0.1);
}

.response-item.response-medium {
  background: rgba(255, 152, 0, 0.1);
}

.response-item.response-low {
  background: rgba(76, 175, 80, 0.1);
}

.response-trigger,
.response-action {
  font-size: 0.75rem;
  text-align: center;
  color: var(--ink-black);
}

.response-meter {
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  background: var(--bamboo-green);
  transition: width 1s ease;
}

/* キーワードタグ */
.os-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ma-intimate);
  margin-top: var(--ma-personal);
}

.keyword-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
}

.fire-tag {
  background: var(--fire-red);
}

.water-tag {
  background: var(--sky-blue);
}

.earth-tag {
  background: var(--bamboo-green);
}

/* 相互作用の視覚化 */
.interaction-flow-visualization {
  margin-top: var(--ma-transcendent);
  padding: var(--ma-social);
  background: rgba(255, 255, 255, 0.5);
  border-radius: 1rem;
}

.flow-title {
  text-align: center;
  margin-bottom: var(--ma-social);
  color: var(--ink-black);
}

.flow-diagram {
  margin-bottom: var(--ma-social);
}

.interaction-svg {
  width: 100%;
  height: 300px;
  max-width: 400px;
  margin: 0 auto;
  display: block;
}

.flow-path {
  stroke-dasharray: 300;
  stroke-dashoffset: 300;
}

.os-node {
  cursor: pointer;
  transition: all var(--transition-base);
}

.os-node:hover {
  transform: scale(1.2);
}

.interaction-legend {
  display: flex;
  justify-content: center;
  gap: var(--ma-social);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--ma-intimate);
  font-size: 0.875rem;
}

.legend-color {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
}

.engine-color {
  background: var(--fire-red);
}

.interface-color {
  background: var(--sky-blue);
}

.safemode-color {
  background: var(--bamboo-green);
}

/* バランス評価 */
.balance-assessment {
  margin-top: var(--ma-transcendent);
  padding: var(--ma-social);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
}

.assessment-title {
  text-align: center;
  margin-bottom: var(--ma-social);
  color: var(--ink-black);
}

.balance-visualization {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--ma-social);
  margin-bottom: var(--ma-social);
}

.balance-triangle {
  display: flex;
  justify-content: center;
}

.triangle-svg {
  width: 200px;
  height: 200px;
}

.balance-point {
  cursor: pointer;
  transition: all var(--transition-base);
}

.balance-point:hover {
  transform: scale(1.5);
}

.balance-metrics {
  display: flex;
  flex-direction: column;
  gap: var(--ma-personal);
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: var(--ma-intimate);
}

.metric-label {
  font-size: 0.875rem;
  color: var(--wabi-grey);
}

.metric-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--ink-black);
}

.metric-bar {
  height: 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: var(--bamboo-green);
  transition: width 1s ease;
}

/* バランスインサイト */
.balance-insights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--ma-personal);
}

.insight-item {
  display: flex;
  gap: var(--ma-personal);
  padding: var(--ma-personal);
  background: rgba(104, 159, 56, 0.05);
  border-radius: 0.5rem;
}

.insight-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.insight-content {
  flex: 1;
}

.insight-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: var(--ma-intimate);
  color: var(--ink-black);
}

.insight-description {
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--wabi-grey);
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .wuxing-container {
    grid-template-areas: 
      "center"
      "engine"
      "interface"
      "safemode";
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
  
  .balance-visualization {
    grid-template-columns: 1fr;
  }
  
  .os-characteristics {
    grid-template-columns: 1fr;
  }
  
  .interaction-legend {
    flex-direction: column;
    align-items: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .taiji-symbol,
  .flow-wave,
  .shield-layer,
  .balance-point {
    animation: none;
  }
  
  .flow-path {
    stroke-dasharray: none;
    stroke-dashoffset: 0;
  }
}
</style>