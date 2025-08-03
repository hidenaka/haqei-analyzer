import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import errorHandlerPlugin from './plugins/errorHandler'

// Import global styles
import './styles/variables.css'
import './styles/theme.css'

const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)

// Error handling plugin
app.use(errorHandlerPlugin, {
  enableLogging: import.meta.env.DEV,
  enableReporting: import.meta.env.PROD,
  errorPageRoute: '/error',
  onError: (error, info) => {
    console.error('Custom error handler:', error, info)
  }
})

// Mount the app
app.mount('#app')
