<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BunenjinPhilosophyUI from './components/bunenjin/BunenjinPhilosophyUI.vue'
import EasternTripleOSVisualization from './components/bunenjin/EasternTripleOSVisualization.vue'
import IChing64HexagramNavigation from './components/bunenjin/IChing64HexagramNavigation.vue'
import CulturalAdaptiveInterface from './components/bunenjin/CulturalAdaptiveInterface.vue'

/**
 * App.vue - HAQEIアプリケーションのメインコンポーネント
 * 
 * bunenjin哲学と東洋的美意識を完全統合した
 * 世界最高レベルのUI/UX体験を提供
 */

const appMode = ref<'philosophy' | 'triple-os' | 'iching' | 'cultural'>('philosophy')
const isLoading = ref(true)

// アプリケーション初期化
onMounted(async () => {
  // 東洋的美意識に基づく優雅な読み込み
  await new Promise(resolve => setTimeout(resolve, 1618)) // 黄金比秒
  isLoading.value = false
})

const switchMode = (mode: typeof appMode.value) => {
  appMode.value = mode
}
</script>

<template>
  <div class="haqei-app" :class="{ loading: isLoading }">
    <!-- 読み込み画面 - 東洋的美意識 -->
    <div v-if="isLoading" class="loading-screen">
      <div class="loading-mandala">
        <div class="mandala-layer" v-for="n in 4" :key="n"></div>
        <div class="loading-symbol">☯</div>
      </div>
      <p class="loading-text">智慧を読み込み中...</p>
    </div>

    <!-- メインアプリケーション -->
    <div v-else class="main-app">
      <!-- モード切り替えナビゲーション -->
      <nav class="mode-navigation" role="navigation">
        <div class="mode-tabs">
          <button 
            class="mode-tab"
            :class="{ active: appMode === 'philosophy' }"
            @click="switchMode('philosophy')"
          >
            <span class="tab-icon">🎭</span>
            <span class="tab-label">bunenjin哲学</span>
          </button>
          
          <button 
            class="mode-tab"
            :class="{ active: appMode === 'triple-os' }"
            @click="switchMode('triple-os')"
          >
            <span class="tab-icon">⚡</span>
            <span class="tab-label">Triple OS</span>
          </button>
          
          <button 
            class="mode-tab"
            :class="{ active: appMode === 'iching' }"
            @click="switchMode('iching')"
          >
            <span class="tab-icon">☰</span>
            <span class="tab-label">易経64卦</span>
          </button>
          
          <button 
            class="mode-tab"
            :class="{ active: appMode === 'cultural' }"
            @click="switchMode('cultural')"
          >
            <span class="tab-icon">🌍</span>
            <span class="tab-label">文化適応</span>
          </button>
        </div>
      </nav>

      <!-- 動的コンテンツエリア -->
      <main class="app-content" role="main">
        <Transition name="zen-fade" mode="out-in">
          <BunenjinPhilosophyUI v-if="appMode === 'philosophy'" key="philosophy" />
          <EasternTripleOSVisualization v-else-if="appMode === 'triple-os'" key="triple-os" />
          <IChing64HexagramNavigation v-else-if="appMode === 'iching'" key="iching" />
          <CulturalAdaptiveInterface v-else-if="appMode === 'cultural'" key="cultural" />
        </Transition>
      </main>
    </div>
  </div>
</template>

<style scoped>
.haqei-app {
  min-height: 100vh;
  background: var(--paper-texture);
  font-family: var(--font-family-base);
  position: relative;
  overflow-x: hidden;
}

/* 読み込み画面 - 東洋的美意識 */
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: 
    radial-gradient(circle at 30% 30%, rgba(104, 159, 56, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(3, 169, 244, 0.1) 0%, transparent 50%),
    var(--zen-white);
  z-index: var(--z-modal);
}

.loading-mandala {
  position: relative;
  width: 8rem;
  height: 8rem;
  margin-bottom: var(--ma-contemplative);
}

.mandala-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid;
  border-radius: 50%;
  animation: mandalaSpin 4s linear infinite;
}

.mandala-layer:nth-child(1) {
  border-color: var(--fire-red);
  animation-duration: 4s;
}

.mandala-layer:nth-child(2) {
  border-color: var(--sky-blue);
  animation-duration: 6s;
  animation-direction: reverse;
}

.mandala-layer:nth-child(3) {
  border-color: var(--bamboo-green);
  animation-duration: 8s;
}

.mandala-layer:nth-child(4) {
  border-color: var(--autumn-gold);
  animation-duration: 10s;
  animation-direction: reverse;
}

@keyframes mandalaSpin {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
}

.loading-symbol {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  animation: zenFloat 3s ease-in-out infinite;
}

.loading-text {
  font-size: 1.125rem;
  color: var(--wabi-grey);
  text-align: center;
  animation: breathe 2s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

/* メインアプリケーション */
.main-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* モード切り替えナビゲーション */
.mode-navigation {
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: var(--ma-social) 0;
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  backdrop-filter: blur(10px);
}

.mode-tabs {
  display: flex;
  justify-content: center;
  gap: var(--ma-personal);
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--ma-social);
}

.mode-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ma-intimate);
  padding: var(--ma-personal) var(--ma-social);
  background: transparent;
  border: 2px solid transparent;
  border-radius: 1rem;
  cursor: pointer;
  transition: all var(--transition-base);
  min-width: 120px;
  position: relative;
  overflow: hidden;
}

.mode-tab::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: var(--silk-shimmer);
  transition: all var(--transition-slow);
  z-index: 1;
}

.mode-tab:hover::before {
  left: 100%;
}

.mode-tab:hover {
  border-color: var(--bamboo-green);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.mode-tab.active {
  background: var(--bamboo-green);
  color: white;
  border-color: var(--bamboo-green);
  box-shadow: var(--shadow-lg);
}

.tab-icon {
  font-size: 1.5rem;
  position: relative;
  z-index: 2;
}

.tab-label {
  font-size: 0.875rem;
  font-weight: 600;
  position: relative;
  z-index: 2;
}

/* アプリケーションコンテンツ */
.app-content {
  flex: 1;
  position: relative;
}

/* 禅的フェードトランジション */
.zen-fade-enter-active,
.zen-fade-leave-active {
  transition: all 0.618s cubic-bezier(0.23, 1, 0.32, 1);
}

.zen-fade-enter-from {
  opacity: 0;
  transform: translateY(2rem) scale(0.95);
}

.zen-fade-leave-to {
  opacity: 0;
  transform: translateY(-1rem) scale(1.05);
}

.zen-fade-enter-to,
.zen-fade-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .mode-tabs {
    flex-wrap: wrap;
    gap: var(--ma-intimate);
  }
  
  .mode-tab {
    min-width: 100px;
    padding: var(--ma-intimate) var(--ma-personal);
  }
  
  .tab-icon {
    font-size: 1.25rem;
  }
  
  .tab-label {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .mode-tabs {
    grid-template-columns: repeat(2, 1fr);
    display: grid;
    gap: var(--ma-intimate);
  }
  
  .mode-tab {
    min-width: auto;
  }
}

/* アクセシビリティ対応 */
@media (prefers-reduced-motion: reduce) {
  .mandala-layer,
  .loading-symbol,
  .loading-text {
    animation: none;
  }
  
  .zen-fade-enter-active,
  .zen-fade-leave-active {
    transition: opacity 0.2s ease;
  }
  
  .zen-fade-enter-from,
  .zen-fade-leave-to {
    transform: none;
  }
}

@media (prefers-contrast: high) {
  .mode-tab {
    border-width: 3px;
  }
  
  .mode-tab.active {
    background: #000000;
    border-color: #000000;
  }
}

/* フォーカス表示の強化 */
.mode-tab:focus-visible {
  outline: 3px solid var(--bamboo-green);
  outline-offset: 2px;
}

/* ダークモード対応の準備 */
@media (prefers-color-scheme: dark) {
  .loading-screen {
    background: 
      radial-gradient(circle at 30% 30%, rgba(104, 159, 56, 0.2) 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, rgba(3, 169, 244, 0.2) 0%, transparent 50%),
      var(--ink-black);
  }
  
  .mode-navigation {
    background: rgba(26, 26, 26, 0.95);
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }
  
  .loading-text {
    color: var(--zen-white);
  }
}
</style>
