/**
 * Vue Router設定
 * 
 * 目的：
 * アプリケーションのルーティングを管理
 * 
 * ルート構成：
 * - / : ホーム
 * - /questions : 質問フロー
 * - /analysis : 分析結果（簡易版）
 * - /results : 詳細結果
 */

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/questions',
      name: 'questions',
      component: () => import('@/views/QuestionsView.vue')
    },
    {
      path: '/analysis',
      name: 'analysis',
      component: () => import('@/views/AnalysisView.vue')
    },
    {
      path: '/results',
      name: 'results',
      component: () => import('@/views/ResultsView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue')
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Add any authentication or progress checks here
  next()
})

export default router