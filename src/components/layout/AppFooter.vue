<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-content">
        <p>&copy; 2025 HAQEI Analyzer. All rights reserved.</p>
        <div class="footer-links">
          <a href="/privacy.html" class="footer-link">プライバシーポリシー</a>
          <a href="/terms.html" class="footer-link">利用規約</a>
          <a href="/tokushoho.html" class="footer-link">特定商取引法</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app-footer {
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-primary);
  margin-top: auto;
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--space-6);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.footer-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.footer-links {
  display: flex;
  gap: var(--space-4);
}

.footer-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--text-sm);
  transition: color var(--transition-fast);
}

.footer-link:hover {
  color: var(--text-primary);
}

@media (max-width: 640px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>