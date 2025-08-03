<template>
  <div class="triple-os-overview">
    <!-- 統合スコア -->
    <div class="consistency-display">
      <div class="consistency-circle">
        <div class="progress-ring">
          <svg class="progress-svg" width="120" height="120">
            <circle
              class="progress-ring-bg"
              cx="60"
              cy="60"
              r="50"
              fill="transparent"
              stroke="#e0e7ff"
              stroke-width="8"
            />
            <circle
              class="progress-ring-progress"
              cx="60"
              cy="60"
              r="50"
              fill="transparent"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="strokeDashoffset"
              stroke-width="8"
              stroke-linecap="round"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div class="progress-text">
            <span class="score-value">{{ consistencyScore }}%</span>
            <span class="score-label">整合性</span>
          </div>
        </div>
      </div>
      <div class="consistency-info">
        <h3>Triple OS 整合性スコア</h3>
        <p class="consistency-description">{{ getConsistencyDescription(consistencyScore) }}</p>
        <div class="consistency-level" :class="getConsistencyLevel(consistencyScore)">
          {{ getConsistencyLevelText(consistencyScore) }}
        </div>
      </div>
    </div>

    <!-- OS詳細カード -->
    <div class="os-cards">
      <!-- Engine OS -->
      <div class="os-card engine-os">
        <div class="os-header">
          <div class="os-icon">⚙️</div>
          <div class="os-info">
            <h4>Engine OS</h4>
            <span class="os-subtitle">価値観システム</span>
          </div>
          <button 
            class="detail-button"
            @click="$emit('os-detail-click', 'engine')"
          >
            詳細
          </button>
        </div>
        <div class="os-content">
          <div class="hexagram-info">
            <span class="hexagram-number">第{{ engineOS.hexagramId }}卦</span>
            <span class="hexagram-name">{{ engineOS.hexagramName }}</span>
          </div>
          <div class="os-characteristics">
            <div class="characteristic-item">
              <span class="characteristic-label">主要特性</span>
              <span class="characteristic-value">{{ engineOS.primaryTrigram || '創造的エネルギー' }}</span>
            </div>
            <div class="characteristic-item">
              <span class="characteristic-label">動機</span>
              <span class="characteristic-value">{{ getEngineMotivation(engineOS.hexagramId) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Interface OS -->
      <div class="os-card interface-os">
        <div class="os-header">
          <div class="os-icon">🌐</div>
          <div class="os-info">
            <h4>Interface OS</h4>
            <span class="os-subtitle">社会的システム</span>
          </div>
          <button 
            class="detail-button"
            @click="$emit('os-detail-click', 'interface')"
          >
            詳細
          </button>
        </div>
        <div class="os-content">
          <div class="hexagram-info">
            <span class="hexagram-number">第{{ interfaceOS.hexagramId }}卦</span>
            <span class="hexagram-name">{{ interfaceOS.hexagramName }}</span>
          </div>
          <div class="os-characteristics">
            <div class="characteristic-item">
              <span class="characteristic-label">表現スタイル</span>
              <span class="characteristic-value">{{ getInterfaceStyle(interfaceOS.hexagramId) }}</span>
            </div>
            <div class="characteristic-item">
              <span class="characteristic-label">コミュニケーション</span>
              <span class="characteristic-value">{{ getCommunicationStyle(interfaceOS.hexagramId) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- SafeMode OS -->
      <div class="os-card safemode-os">
        <div class="os-header">
          <div class="os-icon">🛡️</div>
          <div class="os-info">
            <h4>SafeMode OS</h4>
            <span class="os-subtitle">防御システム</span>
          </div>
          <button 
            class="detail-button"
            @click="$emit('os-detail-click', 'safemode')"
          >
            詳細
          </button>
        </div>
        <div class="os-content">
          <div class="hexagram-info">
            <span class="hexagram-number">第{{ safeModeOS.hexagramId }}卦</span>
            <span class="hexagram-name">{{ safeModeOS.hexagramName }}</span>
          </div>
          <div class="os-characteristics">
            <div class="characteristic-item">
              <span class="characteristic-label">防御スタイル</span>
              <span class="characteristic-value">{{ getSafeModeStyle(safeModeOS.hexagramId) }}</span>
            </div>
            <div class="characteristic-item">
              <span class="characteristic-label">回復方法</span>
              <span class="characteristic-value">{{ getRecoveryMethod(safeModeOS.hexagramId) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 統合的洞察 -->
    <div class="integration-insights">
      <h3>統合的洞察</h3>
      <div class="insights-grid">
        <div class="insight-card">
          <div class="insight-icon">🔄</div>
          <div class="insight-content">
            <h4>バランス傾向</h4>
            <p>{{ getBalanceTendency() }}</p>
          </div>
        </div>
        <div class="insight-card">
          <div class="insight-icon">⚡</div>
          <div class="insight-content">
            <h4>エネルギーフロー</h4>
            <p>{{ getEnergyFlow() }}</p>
          </div>
        </div>
        <div class="insight-card">
          <div class="insight-icon">🎯</div>
          <div class="insight-content">
            <h4>最適化の方向性</h4>
            <p>{{ getOptimizationDirection() }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'

/**
 * TripleOSOverview - Triple OS分析結果の概要表示
 * 
 * 目的：
 * - 3つのOSの基本情報を統合的に表示
 * - 整合性スコアの視覚的表現
 * - 各OSの特性と相互関係の理解促進
 * - bunenjin哲学に基づく洞察の提供
 */

interface OSInfo {
  hexagramId: number
  hexagramName: string
  primaryTrigram?: string
  secondaryTrigram?: string
  trigramEnergies?: Record<string, number>
}

// Props
const props = defineProps({
  engineOS: {
    type: Object as PropType<OSInfo>,
    required: true
  },
  interfaceOS: {
    type: Object as PropType<OSInfo>,
    required: true
  },
  safeModeOS: {
    type: Object as PropType<OSInfo>,
    required: true
  },
  consistencyScore: {
    type: Number,
    required: true
  }
})

// Emits
const emit = defineEmits(['os-detail-click'])

// プログレスリング用の計算
const circumference = computed(() => 2 * Math.PI * 50)
const strokeDashoffset = computed(() => {
  return circumference.value - (props.consistencyScore / 100) * circumference.value
})

// 整合性レベルの判定
function getConsistencyLevel(score: number): string {
  if (score >= 80) return 'high'
  if (score >= 60) return 'medium'
  return 'low'
}

function getConsistencyLevelText(score: number): string {
  if (score >= 80) return '高度に統合'
  if (score >= 60) return '適度なバランス'
  return '多様性重視'
}

function getConsistencyDescription(score: number): string {
  if (score >= 80) {
    return '3つのOSが非常に良く調和しており、内面と外面の一致度が高い状態です。一貫した行動パターンを示しやすく、安定した自己表現が期待できます。'
  } else if (score >= 60) {
    return '各OSがバランス良く機能しており、状況に応じて柔軟に対応できる状態です。適度な多様性が創造性を促進する可能性があります。'
  } else {
    return '各OSが独立性を保ちながら機能しており、豊かな多面性を持っています。この多様性は創造的な可能性を秘めていますが、場面に応じた調整も重要です。'
  }
}

// Engine OS関連
function getEngineMotivation(hexagramId: number): string {
  const motivations: Record<number, string> = {
    1: '創造的リーダーシップ',
    2: '支援と受容',
    3: '困難な状況での突破',
    4: '学習と成長',
    5: '準備と待機',
    // 他の卦に対応する動機を追加
  }
  return motivations[hexagramId] || '自己実現'
}

// Interface OS関連
function getInterfaceStyle(hexagramId: number): string {
  const styles: Record<number, string> = {
    1: '堂々とした指導的表現',
    2: '温かく包容的な表現',
    3: '粘り強い実直な表現',
    4: '謙虚で学習的な表現',
    5: '慎重で準備された表現',
    // 他の卦に対応するスタイルを追加
  }
  return styles[hexagramId] || '自然体な表現'
}

function getCommunicationStyle(hexagramId: number): string {
  const styles: Record<number, string> = {
    1: '明確で直接的',
    2: '共感的で協調的',
    3: '忍耐強く持続的',
    4: '質問重視で探求的',
    5: '慎重で計画的',
    // 他の卦に対応するスタイルを追加
  }
  return styles[hexagramId] || '状況適応型'
}

// SafeMode OS関連
function getSafeModeStyle(hexagramId: number): string {
  const styles: Record<number, string> = {
    1: '前向きな挑戦継続',
    2: '安全な環境への退避',
    3: '困難への正面対峙',
    4: '学習による理解深化',
    5: '計画的な準備強化',
    // 他の卦に対応するスタイルを追加
  }
  return styles[hexagramId] || '自己保護重視'
}

function getRecoveryMethod(hexagramId: number): string {
  const methods: Record<number, string> = {
    1: '新たな挑戦による活力回復',
    2: '支援的環境での休息',
    3: '段階的な問題解決',
    4: '知識習得による自信回復',
    5: '十分な準備時間の確保',
    // 他の卦に対応する回復方法を追加
  }
  return methods[hexagramId] || '自然な回復プロセス'
}

// 統合的洞察
function getBalanceTendency(): string {
  if (props.consistencyScore >= 80) {
    return '3つのOSが高度に連携し、統一された人格表現を示しています。安定性が高く、信頼できる行動パターンを持っています。'
  } else if (props.consistencyScore >= 60) {
    return '各OSが適度なバランスを保ちながら、状況に応じて最適なシステムを活用しています。柔軟性と安定性のバランスが取れています。'
  } else {
    return '各OSが独自の特性を発揮し、多面的で創造的なアプローチを可能にしています。変化への適応力が高い傾向があります。'
  }
}

function getEnergyFlow(): string {
  // 実際の実装では、各OSの特性に基づいてより詳細な分析を行う
  return '価値観システムから社会的表現へのエネルギーフローがスムーズで、防御システムが適切にサポートしています。'
}

function getOptimizationDirection(): string {
  if (props.consistencyScore < 60) {
    return 'OS間の協調性を高めることで、より効果的な自己表現と目標達成が可能になります。'
  } else if (props.consistencyScore < 80) {
    return '現在の良好なバランスを維持しながら、特定の状況での最適化を図ることが推奨されます。'
  } else {
    return '高い統合性を活かして、より高度な自己実現と社会貢献を目指すことができます。'
  }
}
</script>

<style scoped>
.triple-os-overview {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* 整合性表示 */
.consistency-display {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid var(--border-color);
}

.consistency-circle {
  position: relative;
  flex-shrink: 0;
}

.progress-ring {
  position: relative;
}

.progress-ring-progress {
  stroke: var(--primary-color);
  transition: stroke-dashoffset 0.5s ease-in-out;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.score-value {
  display: block;
  font-size: 1.75rem;
  font-weight: bold;
  color: var(--primary-color);
}

.score-label {
  display: block;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.consistency-info {
  flex: 1;
}

.consistency-info h3 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1.5rem;
}

.consistency-description {
  margin: 0 0 1rem 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

.consistency-level {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
  display: inline-block;
}

.consistency-level.high {
  background: linear-gradient(45deg, #4ECDC4, #45B7D1);
}

.consistency-level.medium {
  background: linear-gradient(45deg, #FFD93D, #FF8C94);
}

.consistency-level.low {
  background: linear-gradient(45deg, #FF8C94, #FF6B6B);
}

/* OSカード */
.os-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.os-card {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.os-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.os-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.os-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--bg-primary);
}

.os-info {
  flex: 1;
}

.os-info h4 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.2rem;
}

.os-subtitle {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.detail-button {
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.detail-button:hover {
  background: var(--primary-hover);
}

.os-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.hexagram-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
}

.hexagram-number {
  font-size: 0.9rem;
  color: var(--primary-color);
  font-weight: 500;
}

.hexagram-name {
  color: var(--text-primary);
  font-weight: 500;
}

.os-characteristics {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.characteristic-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--bg-primary);
  border-radius: 6px;
}

.characteristic-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.characteristic-value {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.9rem;
  text-align: right;
}

/* 統合的洞察 */
.integration-insights {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--border-color);
}

.integration-insights h3 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  text-align: center;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.insight-card {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-primary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.insight-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, var(--primary-color), #6C5CE7);
  border-radius: 10px;
  color: white;
  flex-shrink: 0;
}

.insight-content h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.insight-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
}

/* レスポンシブ */
@media (max-width: 768px) {
  .consistency-display {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
  
  .os-cards {
    grid-template-columns: 1fr;
  }
  
  .insights-grid {
    grid-template-columns: 1fr;
  }
  
  .characteristic-item {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>