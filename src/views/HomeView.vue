<template>
  <div class="home-view">
    <section class="hero">
      <h1 class="hero-title">HAQEI Analyzer</h1>
      <p class="hero-subtitle">易経の知恵とAIが融合した、あなたの戦略的人生ナビゲーター</p>
      
      <div class="cta-buttons">
        <router-link to="/quick-analyzer" class="btn btn-primary">
          今すぐ診断を始める
        </router-link>
        <router-link to="/os-analyzer" class="btn btn-secondary">
          詳細分析へ
        </router-link>
      </div>
    </section>
    
    <section class="features">
      <div class="feature-grid">
        <div class="feature-card">
          <h3>Triple OS分析</h3>
          <p>価値観・社会的・防御の3つのシステムから、あなたの本質を解明</p>
        </div>
        <div class="feature-card">
          <h3>易経64卦</h3>
          <p>古代の叡智を現代的に解釈し、人生の指針を提供</p>
        </div>
        <div class="feature-card">
          <h3>AI統合</h3>
          <p>最新のAI技術で、個別化された戦略的アドバイスを生成</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home-view {
  min-height: calc(100vh - 200px);
}

.hero {
  text-align: center;
  padding: var(--space-16) 0;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: var(--space-4);
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: var(--text-xl);
  color: var(--text-secondary);
  margin-bottom: var(--space-8);
}

.cta-buttons {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  text-decoration: none;
  font-weight: 600;
  transition: all var(--transition-base);
  display: inline-block;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.btn-secondary:hover {
  background-color: var(--primary-color);
  color: white;
}

.features {
  padding: var(--space-16) 0;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);
}

.feature-card {
  background-color: var(--bg-card);
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-primary);
  transition: transform var(--transition-base);
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-card h3 {
  color: var(--primary-color);
  margin-bottom: var(--space-3);
}

.feature-card p {
  color: var(--text-secondary);
  margin: 0;
}</style>