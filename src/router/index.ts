import { 
  createRouter, 
  createWebHistory, 
  RouteRecordRaw,
  NavigationGuardNext,
  RouteLocationNormalized
} from 'vue-router'
import type { RouteMeta, NavigationGuardResult } from '@/types'

// 型安全なルート定義
interface TypedRouteRecord extends Omit<RouteRecordRaw, 'meta'> {
  meta?: RouteMeta;
}

const routes: TypedRouteRecord[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      requiresAuth: false,
      HaQeiLevel: 'public',
      title: 'HAQEI Analyzer - HaQei哲学による個性分析',
      description: '易経とHaQei哲学に基づく革新的な個性分析システム',
      keywords: ['個性分析', 'HaQei', '易経', 'I Ching', 'Triple OS']
    }
  },
  {
    path: '/quick-analyzer',
    name: 'QuickAnalyzer',
    component: () => import('@/views/QuickAnalyzerView.vue'),
    meta: {
      requiresAuth: false,
      HaQeiLevel: 'basic',
      title: 'クイック分析 - HAQEI',
      description: '短時間で基本的な個性分析を実行',
      keywords: ['クイック分析', '簡易診断']
    }
  },
  {
    path: '/os-analyzer',
    name: 'OSAnalyzer',
    component: () => import('@/views/OSAnalyzerView.vue'),
    meta: {
      requiresAuth: false,
      HaQeiLevel: 'advanced',
      ichingRequired: true,
      title: 'OS Analyzer - Triple OS分析',
      description: 'Engine/Interface/SafeMode の3層OS分析システム',
      keywords: ['OS分析', 'Triple OS', 'Engine OS', 'Interface OS', 'Safe Mode']
    }
  },
  {
    path: '/results/:id',
    name: 'Results',
    component: () => import('@/views/ResultsView.vue'),
    props: (route: RouteLocationNormalized): Record<string, unknown> => ({ 
      id: route.params.id,
      sessionId: route.query.session as string | undefined
    }),
    meta: {
      requiresAuth: false,
      HaQeiLevel: 'basic',
      title: '分析結果 - HAQEI',
      description: '個性分析の詳細結果とHaQei哲学に基づく洞察'
    }
  },
  {
    path: '/future-simulator',
    name: 'FutureSimulator',
    component: () => import('@/views/FutureSimulatorView.vue'),
    meta: {
      requiresAuth: false,
      HaQeiLevel: 'expert',
      ichingRequired: true,
      title: 'Future Simulator - 未来シミュレーション',
      description: '易経の変化パターンに基づく未来予測システム',
      keywords: ['未来予測', 'シミュレーション', '変化パターン', '易経変爻']
    }
  },
  {
    path: '/cockpit',
    name: 'Cockpit',
    component: () => import('@/views/CockpitView.vue'),
    meta: { 
      requiresAuth: true,
      HaQeiLevel: 'expert',
      title: 'Management Cockpit - HAQEI',
      description: 'システム管理とパフォーマンス監視'
    }
  },
  {
    path: '/professional-report',
    name: 'ProfessionalReport',
    component: () => import('@/views/ProfessionalReportView.vue'),
    meta: { 
      requiresAuth: true,
      HaQeiLevel: 'expert',
      title: 'Professional Report - HAQEI',
      description: 'プロフェッショナル向け詳細分析レポート'
    }
  },
  {
    path: '/error/:code?',
    name: 'Error',
    component: () => import('@/views/ErrorView.vue'),
    props: true,
    meta: {
      requiresAuth: false,
      HaQeiLevel: 'public',
      title: 'エラー - HAQEI'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      requiresAuth: false,
      HaQeiLevel: 'public',
      title: 'ページが見つかりません - HAQEI'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes as RouteRecordRaw[],
  scrollBehavior(
    to: RouteLocationNormalized, 
    from: RouteLocationNormalized, 
    savedPosition: { left: number; top: number } | null
  ): { top: number; left?: number } | { top: number; left?: number } | null {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 型安全な認証チェック関数
function checkAuthentication(): boolean {
  // TODO: 実際の認証ロジックを実装
  // 現在はfalseを返すが、実際の認証システムと連携する
  try {
    const token = localStorage.getItem('auth_token')
    return token !== null && token.length > 0
  } catch (error) {
    console.warn('認証チェック中にエラーが発生:', error)
    return false
  }
}

// HaQeiレベルチェック関数
function checkBunenjinLevel(requiredLevel: RouteMeta['HaQeiLevel']): boolean {
  if (!requiredLevel || requiredLevel === 'public') {
    return true
  }
  
  // TODO: ユーザーのHaQeiレベルチェックを実装
  // 現在は基本レベル以下は許可
  const userLevel = 'basic' // TODO: 実際のユーザーレベルを取得
  
  const levelHierarchy = ['public', 'basic', 'advanced', 'expert']
  const userLevelIndex = levelHierarchy.indexOf(userLevel)
  const requiredLevelIndex = levelHierarchy.indexOf(requiredLevel)
  
  return userLevelIndex >= requiredLevelIndex
}

// I Ching知識チェック関数
function checkIChingKnowledge(): boolean {
  // TODO: ユーザーの易経知識レベルをチェック
  // 現在は簡単なローカルストレージチェック
  try {
    const ichingLevel = localStorage.getItem('iching_knowledge_level')
    return ichingLevel !== null
  } catch (error) {
    console.warn('易経知識チェック中にエラーが発生:', error)
    return false
  }
}

// 型安全なナビゲーションガード
router.beforeEach((
  to: RouteLocationNormalized, 
  from: RouteLocationNormalized, 
  next: NavigationGuardNext
): void => {
  const meta = to.meta as RouteMeta | undefined
  
  // ページタイトル設定
  if (meta?.title) {
    document.title = meta.title
  }
  
  // メタデータ設定
  if (meta?.description) {
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', meta.description)
    }
  }
  
  // 認証チェック
  if (meta?.requiresAuth) {
    const isAuthenticated = checkAuthentication()
    
    if (!isAuthenticated) {
      next({ 
        name: 'Home', 
        query: { 
          redirect: to.fullPath,
          error: 'auth_required'
        } 
      })
      return
    }
  }
  
  // HaQeiレベルチェック
  if (meta?.HaQeiLevel && !checkBunenjinLevel(meta.HaQeiLevel)) {
    next({
      name: 'Error',
      params: { code: 'insufficient_HaQei_level' },
      query: { 
        required: meta.HaQeiLevel,
        redirect: to.fullPath
      }
    })
    return
  }
  
  // 易経知識チェック
  if (meta?.ichingRequired && !checkIChingKnowledge()) {
    next({
      name: 'Error', 
      params: { code: 'iching_knowledge_required' },
      query: { redirect: to.fullPath }
    })
    return
  }
  
  next()
})

// エラーハンドリング
router.onError((error: Error) => {
  console.error('Router error:', error)
  // TODO: エラーレポートをサーバーに送信
})

export default router
export type { TypedRouteRecord }