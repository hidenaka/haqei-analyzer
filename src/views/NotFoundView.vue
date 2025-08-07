<template>
  <div class="not-found-view">
    <div class="not-found-container">
      <div class="not-found-icon">
        <svg 
          width="120" 
          height="120" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            stroke-width="2"
          />
          <path 
            d="M9 9h.01" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          />
          <path 
            d="M15 9h.01" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          />
          <path 
            d="M8 15s1.5 2 4 2 4-2 4-2" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          />
        </svg>
      </div>
      
      <h1 class="not-found-title">404</h1>
      <h2 class="not-found-subtitle">ページが見つかりません</h2>
      
      <p class="not-found-message">
        お探しのページは存在しないか、移動された可能性があります。
      </p>
      
      <div class="philosophy-section">
        <div class="HaQei-wisdom">
          <h3>HaQei哲学からの洞察</h3>
          <p>
            迷いもまた一つの「個」の状態です。Multiple Dividualsの概念では、
            どこにいても常に新しい発見があります。道に迷うことで、
            予期しない価値ある出会いが生まれることもあるのです。
          </p>
        </div>
        
        <div class="iching-wisdom">
          <h3>易経からの智慧</h3>
          <div class="hexagram-info">
            <div class="hexagram-number">履 10</div>
            <div class="hexagram-meaning">
              <strong>履卦（天沢履）</strong>
              <p>
                道を踏み間違えることもあります。しかし正しい道筋を見つけることで、
                より大きな理解と成長が得られます。一歩一歩、慎重に進みましょう。
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="search-suggestions">
        <h3>おすすめページ</h3>
        <div class="suggestions-grid">
          <RouterLink 
            to="/" 
            class="suggestion-card"
          >
            <div class="suggestion-icon">🏠</div>
            <div class="suggestion-title">ホーム</div>
            <div class="suggestion-desc">トップページに戻る</div>
          </RouterLink>
          
          <RouterLink 
            to="/os-analyzer" 
            class="suggestion-card"
          >
            <div class="suggestion-icon">🔍</div>
            <div class="suggestion-title">OS Analyzer</div>
            <div class="suggestion-desc">Triple OS分析を開始</div>
          </RouterLink>
          
          <RouterLink 
            to="/quick-analyzer" 
            class="suggestion-card"
          >
            <div class="suggestion-icon">⚡</div>
            <div class="suggestion-title">クイック分析</div>
            <div class="suggestion-desc">簡易個性分析</div>
          </RouterLink>
          
          <RouterLink 
            to="/future-simulator" 
            class="suggestion-card"
          >
            <div class="suggestion-icon">🔮</div>
            <div class="suggestion-title">Future Simulator</div>
            <div class="suggestion-desc">未来シミュレーション</div>
          </RouterLink>
        </div>
      </div>
      
      <div class="navigation-actions">
        <button 
          @click="goBack" 
          class="btn btn-secondary"
          :disabled="!canGoBack"
          type="button"
        >
          前のページに戻る
        </button>
        
        <RouterLink 
          to="/" 
          class="btn btn-primary"
        >
          ホームに戻る
        </RouterLink>
      </div>
      
      <div class="help-section">
        <details class="help-details">
          <summary>困ったときは？</summary>
          <div class="help-content">
            <ul>
              <li>
                <strong>URLを確認</strong>: 
                スペルミスや不正な文字が含まれていないか確認してください
              </li>
              <li>
                <strong>ブックマーク</strong>: 
                古いブックマークの場合、ページが移動している可能性があります
              </li>
              <li>
                <strong>リンク切れ</strong>: 
                外部サイトからのリンクが古い場合があります
              </li>
              <li>
                <strong>一時的な問題</strong>: 
                しばらく時間をおいてから再度アクセスしてみてください
              </li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const canGoBack = computed(() => {
  return window.history.length > 1
})

const goBack = (): void => {
  if (canGoBack.value) {
    router.back()
  } else {
    router.push('/')
  }
}

onMounted(() => {
  document.title = 'ページが見つかりません - HAQEI Analyzer'
  
  // 404エラーをレポート
  console.warn('404 Page Not Found:', {
    path: window.location.pathname,
    referrer: document.referrer,
    timestamp: new Date().toISOString()
  })
})
</script>

<style scoped>
.not-found-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.not-found-container {
  max-width: 800px;
  width: 100%;
  background: white;
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.not-found-icon {
  color: #f59e0b;
  margin-bottom: 2rem;
  opacity: 0.8;
}

.not-found-title {
  font-size: 6rem;
  font-weight: 900;
  color: #374151;
  margin: 0;
  line-height: 1;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.not-found-subtitle {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 1rem 0;
}

.not-found-message {
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 3rem;
  line-height: 1.6;
}

.philosophy-section {
  display: grid;
  gap: 2rem;
  margin: 3rem 0;
}

.HaQei-wisdom,
.iching-wisdom {
  background: #f8fafc;
  border-radius: 12px;
  padding: 2rem;
  text-align: left;
  border-left: 4px solid #3b82f6;
}

.HaQei-wisdom h3,
.iching-wisdom h3 {
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.HaQei-wisdom p,
.iching-wisdom p {
  color: #4b5563;
  line-height: 1.7;
  margin: 0;
}

.hexagram-info {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.hexagram-number {
  background: #667eea;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 700;
  min-width: 60px;
}

.hexagram-meaning {
  flex: 1;
}

.hexagram-meaning strong {
  color: #374151;
  display: block;
  margin-bottom: 0.5rem;
}

.search-suggestions {
  margin: 3rem 0;
}

.search-suggestions h3 {
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.suggestion-card {
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  text-decoration: none;
  transition: all 0.3s;
  display: block;
}

.suggestion-card:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.suggestion-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.suggestion-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.suggestion-desc {
  color: #6b7280;
  font-size: 0.875rem;
}

.navigation-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 3rem 0;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
  transform: translateY(-1px);
}

.help-section {
  margin-top: 3rem;
}

.help-details {
  background: #f3f4f6;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: left;
}

.help-details summary {
  cursor: pointer;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.help-details summary::-webkit-details-marker {
  display: none;
}

.help-details summary::before {
  content: '▶';
  transition: transform 0.2s;
}

.help-details[open] summary::before {
  transform: rotate(90deg);
}

.help-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.help-content li {
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
  color: #4b5563;
  line-height: 1.6;
}

.help-content li:last-child {
  border-bottom: none;
}

.help-content strong {
  color: #374151;
}

@media (max-width: 768px) {
  .not-found-container {
    padding: 2rem;
  }
  
  .not-found-title {
    font-size: 4rem;
  }
  
  .not-found-subtitle {
    font-size: 1.5rem;
  }
  
  .suggestions-grid {
    grid-template-columns: 1fr;
  }
  
  .navigation-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
  
  .hexagram-info {
    flex-direction: column;
  }
  
  .hexagram-number {
    align-self: flex-start;
  }
}
</style>