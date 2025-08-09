import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import errorHandlerPlugin from './plugins/errorHandler'
import i18n from './plugins/i18n'

// Import global styles with async loading
import './styles/variables.css'
import './styles/theme.css'
import './styles/eastern-aesthetics.css'

// Performance monitoring
const startTime = performance.now()

const app = createApp(App)

// Use plugins with optimizations
const pinia = createPinia()

// Pinia devtools disabled in production
if (import.meta.env.PROD) {
  pinia.use(() => {
    // No-op in production
  })
}

app.use(pinia)
app.use(router)
app.use(i18n)

// Error handling plugin with performance optimization
app.use(errorHandlerPlugin, {
  enableLogging: import.meta.env.DEV,
  enableReporting: import.meta.env.PROD,
  errorPageRoute: '/error',
  onError: (error, info) => {
    // Console.error only in development
    if (import.meta.env.DEV) {
      console.error('Custom error handler:', error, info)
    }
    // Production error reporting could be added here
  }
})

// Performance optimization: disable devtools in production
if (import.meta.env.PROD) {
  app.config.devtools = false
}

// Global error handling
app.config.errorHandler = (err, vm, info) => {
  if (import.meta.env.DEV) {
    console.error('Global error:', err, info)
  }
  // Could send to error reporting service in production
}

// Performance API integration
app.config.performance = import.meta.env.DEV

// Mount the app with performance measurement
const mountTime = performance.now() - startTime
app.mount('#app')

// Performance logging
if (import.meta.env.DEV) {
  console.log(`⚡ Vue3 App mounted in ${mountTime.toFixed(2)}ms`)
  
  // Additional performance metrics
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const loadTime = performance.now() - startTime
      console.log(`🚀 Total load time: ${loadTime.toFixed(2)}ms`)
    })
  }
}

// Service Worker registration for production
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('SW registered: ', registration)
    } catch (registrationError) {
      console.log('SW registration failed: ', registrationError)
    }
  })
}
