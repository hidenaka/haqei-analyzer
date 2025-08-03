# HAQEI Analyzer 開発ガイド

## 🎯 開発方針

### 基本原則
1. **ユーザーファースト**: 常にユーザー体験を最優先に考える
2. **段階的移行**: レガシーシステムと新システムの共存を維持
3. **型安全性**: TypeScriptを活用した堅牢なコード
4. **テスト駆動**: 新機能には必ずテストを追加

### コーディング規約
- **命名規則**: 
  - コンポーネント: PascalCase (例: `QuestionFlow.vue`)
  - 関数/変数: camelCase (例: `calculateScore`)
  - 定数: UPPER_SNAKE_CASE (例: `MAX_QUESTIONS`)
- **インデント**: スペース2つ
- **行末**: セミコロンなし（Prettierで自動処理）
- **クォート**: シングルクォート使用

## 🏗️ アーキテクチャ

### ディレクトリ構造
```
src/
├── components/      # 再利用可能なUIコンポーネント
│   ├── common/     # 汎用コンポーネント（Button, Modal等）
│   ├── layout/     # レイアウトコンポーネント
│   └── features/   # 機能別コンポーネント
├── views/          # ルートごとのページコンポーネント
├── composables/    # Vue Composition API カスタムフック
├── stores/         # Pinia ストア（状態管理）
├── services/       # APIクライアント、外部サービス連携
├── utils/          # ユーティリティ関数
├── types/          # TypeScript型定義
└── styles/         # グローバルスタイル
```

### コンポーネント設計
```vue
<template>
  <!-- テンプレート -->
</template>

<script setup lang="ts">
// 1. Import statements
import { ref, computed } from 'vue'
import type { PropType } from 'vue'

// 2. Props definition
interface Props {
  title: string
  count?: number
}
const props = withDefaults(defineProps<Props>(), {
  count: 0
})

// 3. Emits definition
const emit = defineEmits<{
  update: [value: string]
  close: []
}>()

// 4. Reactive state
const isOpen = ref(false)

// 5. Computed properties
const displayCount = computed(() => `Count: ${props.count}`)

// 6. Methods
const handleClick = () => {
  emit('update', 'new value')
}

// 7. Lifecycle hooks
onMounted(() => {
  // initialization
})
</script>

<style scoped>
/* スコープ付きスタイル */
</style>
```

## 🧪 テスト戦略

### ユニットテスト
```typescript
// ComponentName.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ComponentName from '@/components/ComponentName.vue'

describe('ComponentName', () => {
  it('renders properly', () => {
    const wrapper = mount(ComponentName, {
      props: {
        title: 'Test Title'
      }
    })
    
    expect(wrapper.find('h1').text()).toBe('Test Title')
  })
})
```

### E2Eテスト
```typescript
// feature.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should perform expected behavior', async ({ page }) => {
    await page.goto('/path')
    await page.click('button[data-test="submit"]')
    await expect(page.locator('.result')).toBeVisible()
  })
})
```

## 🔌 API設計

### エンドポイント命名
- RESTful原則に従う
- 動詞ではなく名詞を使用
- 複数形を使用

```
GET    /api/analyses          # 一覧取得
POST   /api/analyses          # 新規作成
GET    /api/analyses/:id      # 個別取得
PUT    /api/analyses/:id      # 更新
DELETE /api/analyses/:id      # 削除
```

### レスポンス形式
```typescript
// 成功レスポンス
{
  "success": true,
  "data": {
    // response data
  },
  "meta": {
    "timestamp": "2025-01-01T00:00:00Z"
  }
}

// エラーレスポンス
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力値が無効です",
    "details": {
      // error details
    }
  }
}
```

## 📦 状態管理

### Piniaストア設計
```typescript
// stores/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  
  // Getters
  const isAuthenticated = computed(() => !!user.value)
  
  // Actions
  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    try {
      const response = await api.login(credentials)
      user.value = response.data
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    user,
    isLoading,
    isAuthenticated,
    login
  }
})
```

## 🎨 スタイリング

### CSS変数の活用
```scss
// styles/_variables.scss
:root {
  // Colors
  --primary-color: #4a90e2;
  --primary-hover: #357abd;
  
  // Spacing
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  
  // Typography
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
}
```

### BEM命名規則
```scss
.block {
  &__element {
    // Element styles
  }
  
  &--modifier {
    // Modifier styles
  }
}

// 例
.question-card {
  &__header {
    padding: var(--space-md);
  }
  
  &__body {
    padding: var(--space-lg);
  }
  
  &--active {
    border-color: var(--primary-color);
  }
}
```

## 🚀 デプロイメント

### 環境変数
```env
# .env.development
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx

# .env.production
VITE_API_URL=https://api.haqei.com
VITE_STRIPE_PUBLIC_KEY=pk_live_xxx
```

### ビルド最適化
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'chart': ['chart.js'],
          'utils': ['date-fns', 'axios']
        }
      }
    }
  }
})
```

## 📝 Git ワークフロー

### ブランチ戦略
- `main`: 本番環境
- `develop`: 開発環境
- `feature/*`: 新機能開発
- `fix/*`: バグ修正
- `refactor/*`: リファクタリング

### コミットメッセージ
```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: フォーマット修正
refactor: リファクタリング
test: テスト追加・修正
chore: ビルド・設定変更
```

### プルリクエスト
1. 機能ブランチを作成
2. 実装とテストを追加
3. `develop`へのPRを作成
4. コードレビュー
5. マージ

## 🔍 デバッグ

### Vue Devtools
- コンポーネントツリーの確認
- Piniaストアの状態確認
- パフォーマンス計測

### ブラウザデバッグ
```javascript
// 開発環境でのみ有効
if (import.meta.env.DEV) {
  console.log('Debug info:', data)
  // @ts-ignore
  window.__APP_STATE__ = store
}
```

## 📚 参考資料

- [Vue 3 ドキュメント](https://v3.ja.vuejs.org/)
- [TypeScript ハンドブック](https://www.typescriptlang.org/docs/)
- [Vite ガイド](https://ja.vitejs.dev/guide/)
- [Pinia ドキュメント](https://pinia.vuejs.org/)

---

更新日: 2025-01-02