import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/quick-analyzer',
    name: 'QuickAnalyzer',
    component: () => import('@/views/QuickAnalyzerView.vue')
  },
  {
    path: '/os-analyzer',
    name: 'OSAnalyzer',
    component: () => import('@/views/OSAnalyzerView.vue')
  },
  {
    path: '/results/:id',
    name: 'Results',
    component: () => import('@/views/ResultsView.vue'),
    props: true
  },
  {
    path: '/future-simulator',
    name: 'FutureSimulator',
    component: () => import('@/views/FutureSimulatorView.vue')
  },
  {
    path: '/cockpit',
    name: 'Cockpit',
    component: () => import('@/views/CockpitView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/professional-report',
    name: 'ProfessionalReport',
    component: () => import('@/views/ProfessionalReportView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guard for protected routes
router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth) {
    // TODO: Check authentication status
    const isAuthenticated = false
    
    if (!isAuthenticated) {
      next({ name: 'Home', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router