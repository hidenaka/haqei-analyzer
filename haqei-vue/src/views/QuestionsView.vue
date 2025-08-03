<template>
  <div class="questions-view">
    <div class="container">
      <div class="header">
        <h1>HAQEI 診断</h1>
        <p>30の質問にお答えください</p>
      </div>
      
      <QuestionFlow />
    </div>
  </div>
</template>

<script setup lang="ts">
import QuestionFlow from '@/components/QuestionFlow.vue'
</script>

<style scoped>
.questions-view {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.header p {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }
}
</style>