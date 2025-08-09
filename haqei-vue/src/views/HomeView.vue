<template>
  <div class="home-view">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">HaQei Analyzer</h1>
        <p class="hero-subtitle">
          易経の智慧を現代の心理学と融合させた<br>
          革新的な人格分析システム
        </p>
        <div class="hero-features">
          <div class="feature">
            <span class="feature-icon">🎭</span>
            <span class="feature-text">Triple OS分析</span>
          </div>
          <div class="feature">
            <span class="feature-icon">📊</span>
            <span class="feature-text">8次元測定</span>
          </div>
          <div class="feature">
            <span class="feature-icon">🔮</span>
            <span class="feature-text">易経64卦対応</span>
          </div>
        </div>
        <div class="hero-actions">
          <HButton 
            variant="primary" 
            size="large"
            @click="startAnalysis"
          >
            分析を開始する
          </HButton>
          <HButton 
            variant="secondary" 
            size="large"
            @click="learnMore"
          >
            詳細を見る
          </HButton>
        </div>
      </div>
    </div>
    
    <div class="info-section">
      <div class="info-grid">
        <div class="info-card">
          <h3>Triple OS Architecture</h3>
          <p>Engine OS（価値観）、Interface OS（社会適応）、SafeMode OS（防御機制）の3層構造で人格を分析</p>
        </div>
        <div class="info-card">
          <h3>8次元測定</h3>
          <p>易経の八卦に基づく創造性・行動性・探求性・安定性・受容性・適応性・表現性・調和性を測定</p>
        </div>
        <div class="info-card">
          <h3>シナリオ分析</h3>
          <p>極限状況での内面と外面の反応を分析し、真の人格パターンを明らかに</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import HButton from '@/components/common/HButton.vue'

/**
 * HomeView - アプリケーションのランディングページ
 * 
 * 目的：
 * - HaQei Analyzerの概要説明
 * - 分析開始への誘導
 * - システムの特徴紹介
 * 
 * 機能：
 * - ヒーローセクションでの魅力的な紹介
 * - 主要機能の視覚的説明
 * - 分析開始ボタンでのスムーズな遷移
 */

const router = useRouter()

/**
 * 分析開始処理
 * 質問画面に遷移してHaQei分析を開始
 */
function startAnalysis(): void {
  router.push('/questions')
}

/**
 * 詳細情報表示処理
 * About画面に遷移してシステム詳細を表示
 */
function learnMore(): void {
  router.push('/about')
}
</script>

<style scoped>
.home-view {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  max-width: 800px;
  width: 100%;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-features {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  backdrop-filter: blur(10px);
}

.feature-icon {
  font-size: 1.5rem;
}

.feature-text {
  font-weight: 500;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Info Section */
.info-section {
  padding: 4rem 2rem;
  background: var(--bg-secondary);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.info-card {
  background: var(--bg-primary);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.info-card h3 {
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.info-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .hero-features {
    gap: 1rem;
  }
  
  .feature {
    padding: 0.5rem 1rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>