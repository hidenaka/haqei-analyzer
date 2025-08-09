<template>
  <div class="results-view">
    <h1>診断結果</h1>
    <p>診断ID: {{ id }}</p>
    <p>Coming soon...</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string
}

const props = defineProps<Props>()
</script>

<style scoped>
.results-view {
  padding: var(--space-8) 0;
}
</style>