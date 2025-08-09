<template>
  <header class="app-header">
    <nav class="nav-container">
      <router-link to="/" class="logo">
        <h1>HAQEI Analyzer</h1>
      </router-link>
      
      <ul class="nav-menu">
        <li>
          <router-link to="/quick-analyzer" class="nav-link">
            クイック診断
          </router-link>
        </li>
        <li>
          <router-link to="/os-analyzer" class="nav-link">
            詳細分析
          </router-link>
        </li>
        <li>
          <router-link to="/future-simulator" class="nav-link">
            未来シミュレーター
          </router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app-header {
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--space-4) var(--space-6);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  text-decoration: none;
  color: var(--text-primary);
}

.logo h1 {
  font-size: var(--text-xl);
  margin: 0;
  font-weight: 700;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: var(--space-6);
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-fast);
}

.nav-link:hover {
  color: var(--text-primary);
}

.nav-link.router-link-active {
  color: var(--primary-color);
}
</style>