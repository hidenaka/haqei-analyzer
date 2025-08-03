<template>
  <div class="about-view">
    <div class="about-header">
      <h1>HaQei Analyzerについて</h1>
      <p class="about-subtitle">
        易経の智慧と現代心理学を融合した革新的な人格分析システム
      </p>
    </div>
    
    <div class="about-content">
      <section class="section">
        <h2>🎭 Triple OS Architecture</h2>
        <div class="os-grid">
          <div class="os-card">
            <h3>Engine OS</h3>
            <p>あなたの核となる価値観システム。深層の信念と動機を司る</p>
          </div>
          <div class="os-card">
            <h3>Interface OS</h3>
            <p>社会との接点システム。他者との関係性と適応を管理</p>
          </div>
          <div class="os-card">
            <h3>SafeMode OS</h3>
            <p>緊急時の防御システム。ストレス下での反応パターンを制御</p>
          </div>
        </div>
      </section>
      
      <section class="section">
        <h2>📊 8次元測定システム</h2>
        <div class="dimensions-grid">
          <div class="dimension-item">
            <span class="dimension-symbol">乾</span>
            <span class="dimension-name">創造性</span>
          </div>
          <div class="dimension-item">
            <span class="dimension-symbol">震</span>
            <span class="dimension-name">行動性</span>
          </div>
          <div class="dimension-item">
            <span class="dimension-symbol">坎</span>
            <span class="dimension-name">探求性</span>
          </div>
          <div class="dimension-item">
            <span class="dimension-symbol">艮</span>
            <span class="dimension-name">安定性</span>
          </div>
          <div class="dimension-item">
            <span class="dimension-symbol">坤</span>
            <span class="dimension-name">受容性</span>
          </div>
          <div class="dimension-item">
            <span class="dimension-symbol">巽</span>
            <span class="dimension-name">適応性</span>
          </div>
          <div class="dimension-item">
            <span class="dimension-symbol">離</span>
            <span class="dimension-name">表現性</span>
          </div>
          <div class="dimension-item">
            <span class="dimension-symbol">兌</span>
            <span class="dimension-name">調和性</span>
          </div>
        </div>
      </section>
      
      <section class="section">
        <h2>🔮 易経64卦システム</h2>
        <p class="section-description">
          あなたの人格パターンを古代中国の智慧である易経の64卦と対応させ、
          深層心理と行動パターンを解析します。各卦には固有の意味と解釈があり、
          現代の心理学的知見と組み合わせることで、より深い自己理解を促進します。
        </p>
      </section>
      
      <section class="section">
        <h2>🎯 分析プロセス</h2>
        <div class="process-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>価値観質問（Q1-Q24）</h3>
              <p>あなたの核となる価値観とEngine OSを特定</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>シナリオ質問（Q25-Q30）</h3>
              <p>極限状況での内面と外面の反応パターンを分析</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>統合分析</h3>
              <p>Triple OS間の整合性と相互作用を評価</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>結果表示</h3>
              <p>詳細な分析結果と改善提案を提供</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    
    <div class="about-footer">
      <HButton 
        variant="primary" 
        size="large"
        @click="startAnalysis"
      >
        分析を開始する
      </HButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import HButton from '@/components/common/HButton.vue'

/**
 * AboutView - システム詳細説明ページ
 * 
 * 目的：
 * - HaQei Analyzerの詳細な説明
 * - Triple OS Architectureの解説
 * - 8次元測定システムの紹介
 * - 分析プロセスの説明
 */

const router = useRouter()

/**
 * 分析開始処理
 * 質問画面に遷移してHaQei分析を開始
 */
function startAnalysis(): void {
  router.push('/questions')
}
</script>

<style scoped>
.about-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

/* Header */
.about-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
  border-bottom: 2px solid var(--border-color);
}

.about-header h1 {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.about-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Content */
.about-content {
  margin-bottom: 3rem;
}

.section {
  margin-bottom: 3rem;
}

.section h2 {
  font-size: 1.75rem;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  border-left: 4px solid var(--primary-color);
  padding-left: 1rem;
}

.section-description {
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* OS Grid */
.os-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.os-card {
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.os-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.os-card h3 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.os-card p {
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Dimensions Grid */
.dimensions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.dimension-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.dimension-item:hover {
  transform: scale(1.05);
}

.dimension-symbol {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.dimension-name {
  color: var(--text-primary);
  font-weight: 500;
}

/* Process Steps */
.process-steps {
  display: grid;
  gap: 2rem;
  margin-top: 1.5rem;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.step-number {
  width: 40px;
  height: 40px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.step-content h3 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.step-content p {
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Footer */
.about-footer {
  text-align: center;
  padding: 2rem 0;
  border-top: 2px solid var(--border-color);
}

/* Responsive */
@media (max-width: 768px) {
  .about-view {
    padding: 1rem;
  }
  
  .about-header h1 {
    font-size: 2rem;
  }
  
  .os-grid {
    grid-template-columns: 1fr;
  }
  
  .dimensions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .step {
    flex-direction: column;
    text-align: center;
  }
}
</style>