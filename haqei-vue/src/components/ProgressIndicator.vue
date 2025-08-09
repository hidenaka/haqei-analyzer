<template>
  <div class="progress-indicator">
    <!-- Circular Progress -->
    <div class="circular-progress">
      <svg viewBox="0 0 100 100" class="progress-svg">
        <!-- Background circle -->
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="var(--progress-bg)"
          stroke-width="8"
        />
        <!-- Progress circle -->
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="var(--progress-color)"
          stroke-width="8"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeDashoffset"
          class="progress-circle"
        />
      </svg>
      <div class="progress-text">
        <span class="progress-value">{{ progressPercentage }}%</span>
        <span class="progress-label">完了</span>
      </div>
    </div>

    <!-- Linear Progress with Milestones -->
    <div class="linear-progress">
      <div class="progress-header">
        <span class="progress-title">{{ currentStep }} / {{ totalSteps }}</span>
        <span class="progress-subtitle">{{ phaseLabel }}</span>
      </div>
      
      <div class="progress-track">
        <div 
          class="progress-fill" 
          :style="{ width: progressPercentage + '%' }"
        ></div>
        
        <!-- Milestones -->
        <div 
          v-for="milestone in milestones" 
          :key="milestone.step"
          class="progress-milestone"
          :class="{ 
            'completed': currentStep >= milestone.step,
            'active': currentStep === milestone.step 
          }"
          :style="{ left: getMilestonePosition(milestone.step) + '%' }"
          :title="milestone.label"
        >
          <span class="milestone-dot"></span>
          <span class="milestone-label">{{ milestone.label }}</span>
        </div>
      </div>

      <!-- Step Details -->
      <div class="step-details">
        <div 
          v-for="(phase, index) in phases" 
          :key="index"
          class="phase-item"
          :class="{ 
            'completed': isPhaseCompleted(phase),
            'active': isPhaseActive(phase) 
          }"
        >
          <span class="phase-icon">{{ phase.icon }}</span>
          <div class="phase-info">
            <span class="phase-name">{{ phase.name }}</span>
            <span class="phase-range">{{ phase.range }}</span>
          </div>
          <span class="phase-status">
            <template v-if="isPhaseCompleted(phase)">✓</template>
            <template v-else-if="isPhaseActive(phase)">
              {{ getPhaseProgress(phase) }}%
            </template>
          </span>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="progress-stats">
      <div class="stat-item">
        <span class="stat-label">回答済み</span>
        <span class="stat-value">{{ answered }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">残り</span>
        <span class="stat-value">{{ remaining }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">予想時間</span>
        <span class="stat-value">{{ estimatedTime }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentStep: number
  totalSteps: number
  answered?: number
}

const props = withDefaults(defineProps<Props>(), {
  answered: 0
})

// Constants
const QUESTIONS_PER_MINUTE = 2 // Average questions answered per minute
const circumference = 2 * Math.PI * 45 // Circle circumference

// Phases definition
const phases = [
  { 
    name: '価値観質問', 
    icon: '💭', 
    range: 'Q1-Q24',
    start: 1,
    end: 24
  },
  { 
    name: 'シナリオ質問', 
    icon: '🎭', 
    range: 'Q25-Q30',
    start: 25,
    end: 30
  }
]

// Milestones
const milestones = [
  { step: 8, label: '導入完了' },
  { step: 16, label: '中間地点' },
  { step: 24, label: '価値観完了' },
  { step: 30, label: '全問完了' }
]

// Computed properties
const progressPercentage = computed(() => {
  return Math.round((props.currentStep / props.totalSteps) * 100)
})

const strokeDashoffset = computed(() => {
  const progress = props.currentStep / props.totalSteps
  return circumference * (1 - progress)
})

const phaseLabel = computed(() => {
  const phase = phases.find(p => 
    props.currentStep >= p.start && props.currentStep <= p.end
  )
  return phase ? phase.name : ''
})

const remaining = computed(() => {
  return props.totalSteps - props.answered
})

const estimatedTime = computed(() => {
  const remainingQuestions = props.totalSteps - props.currentStep
  const minutes = Math.ceil(remainingQuestions / QUESTIONS_PER_MINUTE)
  
  if (minutes < 1) return '完了間近'
  if (minutes === 1) return '約1分'
  return `約${minutes}分`
})

// Methods
function getMilestonePosition(step: number): number {
  return (step / props.totalSteps) * 100
}

function isPhaseCompleted(phase: typeof phases[0]): boolean {
  return props.currentStep > phase.end
}

function isPhaseActive(phase: typeof phases[0]): boolean {
  return props.currentStep >= phase.start && props.currentStep <= phase.end
}

function getPhaseProgress(phase: typeof phases[0]): number {
  if (props.currentStep < phase.start) return 0
  if (props.currentStep > phase.end) return 100
  
  const phaseLength = phase.end - phase.start + 1
  const phaseProgress = props.currentStep - phase.start + 1
  return Math.round((phaseProgress / phaseLength) * 100)
}
</script>

<style scoped>
.progress-indicator {
  display: grid;
  gap: 2rem;
}

/* Circular Progress */
.circular-progress {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
}

.progress-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-circle {
  transition: stroke-dashoffset 0.5s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.progress-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.progress-label {
  display: block;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Linear Progress */
.linear-progress {
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: 12px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.progress-title {
  font-size: 1.1rem;
  font-weight: 600;
}

.progress-subtitle {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.progress-track {
  position: relative;
  height: 8px;
  background: var(--progress-bg);
  border-radius: 4px;
  overflow: visible;
  margin-bottom: 2rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
  border-radius: 4px;
  transition: width 0.5s ease;
}

/* Milestones */
.progress-milestone {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.milestone-dot {
  width: 16px;
  height: 16px;
  background: var(--bg-primary);
  border: 3px solid var(--border-color);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.progress-milestone.completed .milestone-dot {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.progress-milestone.active .milestone-dot {
  background: var(--accent-color);
  border-color: var(--accent-color);
  box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.2);
}

.milestone-label {
  position: absolute;
  top: 24px;
  font-size: 0.75rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

/* Step Details */
.step-details {
  display: grid;
  gap: 0.75rem;
}

.phase-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.phase-item.active {
  background: var(--primary-light);
  box-shadow: 0 2px 8px rgba(var(--primary-rgb), 0.1);
}

.phase-item.completed {
  opacity: 0.7;
}

.phase-icon {
  font-size: 1.5rem;
}

.phase-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.phase-name {
  font-weight: 500;
}

.phase-range {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.phase-status {
  font-weight: 600;
  color: var(--primary-color);
}

/* Quick Stats */
.progress-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.stat-value {
  display: block;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* CSS Variables */
:root {
  --progress-bg: #e5e7eb;
  --progress-color: var(--primary-color);
  --primary-rgb: 79, 70, 229;
  --accent-rgb: 236, 72, 153;
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  :root {
    --progress-bg: #374151;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .circular-progress {
    width: 100px;
    height: 100px;
  }
  
  .progress-value {
    font-size: 1.25rem;
  }
  
  .progress-stats {
    grid-template-columns: repeat(3, 1fr);
    font-size: 0.9rem;
  }
  
  .milestone-label {
    font-size: 0.7rem;
  }
}
</style>