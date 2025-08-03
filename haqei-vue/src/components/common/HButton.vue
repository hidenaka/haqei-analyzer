<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="button-spinner">
      <svg class="spinner" viewBox="0 0 24 24">
        <circle class="spinner-circle" cx="12" cy="12" r="10" />
      </svg>
    </span>
    <span v-if="icon && !loading" class="button-icon">
      <i :class="`icon-${icon}`"></i>
    </span>
    <span class="button-text">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

/**
 * HButton - 統一されたボタンコンポーネント
 * 
 * 目的：
 * - 一貫したボタンデザインとインタラクション
 * - ローディング状態の表示
 * - アクセシビリティ対応
 * - TypeScript型安全性の確保
 * 
 * 機能：
 * - 4種類のバリアント（primary, secondary, danger, ghost）
 * - 3段階のサイズ（small, medium, large）
 * - ローディング・無効化状態
 * - アイコン表示対応
 * - 全幅表示オプション
 */

interface Props {
  /** ボタンのスタイルバリアント（デフォルト: primary） */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  /** ボタンサイズ（デフォルト: medium） */
  size?: 'small' | 'medium' | 'large'
  /** 無効化状態（デフォルト: false） */
  disabled?: boolean
  /** ローディング状態（デフォルト: false） */
  loading?: boolean
  /** 表示するアイコン名 */
  icon?: string
  /** 全幅表示（デフォルト: false） */
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  disabled: false,
  loading: false,
  icon: '',
  fullWidth: false
})

// Emits
interface Emits {
  /** クリックイベント */
  click: [event: MouseEvent]
}

const emit = defineEmits<Emits>()

// スロットの取得
const slots = useSlots()

/**
 * ボタンのCSSクラスを動的に生成
 * 
 * 処理内容：
 * 1. 基本クラス 'h-button' を設定
 * 2. variant と size に基づくクラスを追加
 * 3. 状態に基づく条件付きクラスを追加
 * 
 * 戻り値：
 * - CSS クラス名の配列
 */
const buttonClasses = computed((): (string | Record<string, boolean>)[] => {
  return [
    'h-button',
    `h-button--${props.variant}`,
    `h-button--${props.size}`,
    {
      'h-button--disabled': props.disabled,
      'h-button--loading': props.loading,
      'h-button--full-width': props.fullWidth,
      'h-button--icon-only': Boolean(props.icon) && !slots.default
    }
  ]
})

/**
 * クリックイベントハンドラー
 * 
 * 目的：
 * - 無効化・ローディング中のクリックを防ぐ
 * - 有効なクリックイベントのみを emit
 * 
 * 入力：
 * - event: MouseEvent - クリックイベント
 * 
 * 処理内容：
 * 1. ボタンが有効かつローディング中でないかチェック
 * 2. 条件を満たす場合のみクリックイベントを emit
 * 
 * 副作用：
 * - 条件に応じて 'click' イベントを emit
 */
function handleClick(event: MouseEvent): void {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.h-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

/* Sizes */
.h-button--small {
  padding: 0.375rem 1rem;
  font-size: 0.875rem;
}

.h-button--large {
  padding: 0.75rem 2rem;
  font-size: 1.125rem;
}

/* Variants */
.h-button--primary {
  background: var(--primary-color);
  color: white;
}

.h-button--primary:hover:not(.h-button--disabled):not(.h-button--loading) {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.h-button--secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.h-button--secondary:hover:not(.h-button--disabled):not(.h-button--loading) {
  background: var(--bg-primary);
  transform: translateY(-1px);
}

.h-button--danger {
  background: #FF6B6B;
  color: white;
}

.h-button--danger:hover:not(.h-button--disabled):not(.h-button--loading) {
  background: #FF5252;
  transform: translateY(-1px);
}

.h-button--ghost {
  background: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.h-button--ghost:hover:not(.h-button--disabled):not(.h-button--loading) {
  background: var(--primary-color);
  color: white;
}

/* States */
.h-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.h-button--loading {
  cursor: wait;
}

.h-button--full-width {
  width: 100%;
}

.h-button--icon-only {
  padding: 0.5rem;
}

.h-button--icon-only.h-button--small {
  padding: 0.375rem;
}

.h-button--icon-only.h-button--large {
  padding: 0.75rem;
}

/* Loading spinner */
.button-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 1em;
  height: 1em;
  animation: spin 1s linear infinite;
}

.spinner-circle {
  fill: none;
  stroke: currentColor;
  stroke-width: 3;
  stroke-dasharray: 50;
  stroke-dashoffset: 12.5;
  stroke-linecap: round;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Icons */
.button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

[class^="icon-"] {
  font-style: normal;
  font-size: 1.1em;
}

.icon-download::before { content: '⬇'; }
.icon-share::before { content: '↗'; }
.icon-arrow-right::before { content: '→'; }
.icon-arrow-left::before { content: '←'; }
.icon-check::before { content: '✓'; }
.icon-close::before { content: '×'; }

/* Focus styles */
.h-button:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Active state */
.h-button:active:not(.h-button--disabled):not(.h-button--loading) {
  transform: scale(0.98);
}
</style>