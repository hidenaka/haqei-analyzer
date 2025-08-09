<template>
  <div class="language-selector">
    <!-- コンパクト表示 -->
    <div 
      v-if="variant === 'compact'"
      class="language-selector__compact"
    >
      <button
        class="language-selector__trigger"
        @click="toggleDropdown"
        :aria-expanded="isOpen"
        :aria-label="t('common.selectLanguage')"
        ref="triggerRef"
      >
        <span class="language-selector__flag">
          {{ currentLocaleConfig.flag }}
        </span>
        <span 
          v-if="showLabel"
          class="language-selector__label"
        >
          {{ currentLocaleConfig.name }}
        </span>
        <svg
          class="language-selector__chevron"
          :class="{ 'language-selector__chevron--open': isOpen }"
          viewBox="0 0 24 24"
        >
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      </button>

      <!-- ドロップダウンメニュー -->
      <Transition name="fade-scale">
        <div
          v-if="isOpen"
          class="language-selector__dropdown"
          ref="dropdownRef"
        >
          <button
            v-for="locale in availableLocales"
            :key="locale.code"
            class="language-selector__option"
            :class="{ 'language-selector__option--active': locale.code === currentLocale }"
            @click="selectLocale(locale.code)"
          >
            <span class="language-selector__option-flag">
              {{ locale.flag }}
            </span>
            <span class="language-selector__option-name">
              {{ locale.name }}
            </span>
            <svg
              v-if="locale.code === currentLocale"
              class="language-selector__check"
              viewBox="0 0 24 24"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </button>
        </div>
      </Transition>
    </div>

    <!-- インライン表示 -->
    <div 
      v-else-if="variant === 'inline'"
      class="language-selector__inline"
    >
      <label 
        v-if="showLabel"
        class="language-selector__inline-label"
        :for="selectId"
      >
        {{ t('common.language') }}
      </label>
      <div class="language-selector__inline-wrapper">
        <select
          :id="selectId"
          class="language-selector__select"
          :value="currentLocale"
          @change="onSelectChange"
        >
          <option
            v-for="locale in availableLocales"
            :key="locale.code"
            :value="locale.code"
          >
            {{ locale.flag }} {{ locale.name }}
          </option>
        </select>
        <svg
          class="language-selector__select-chevron"
          viewBox="0 0 24 24"
        >
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      </div>
    </div>

    <!-- タブ表示 -->
    <div 
      v-else-if="variant === 'tabs'"
      class="language-selector__tabs"
      role="tablist"
    >
      <button
        v-for="locale in availableLocales"
        :key="locale.code"
        class="language-selector__tab"
        :class="{ 'language-selector__tab--active': locale.code === currentLocale }"
        @click="selectLocale(locale.code)"
        role="tab"
        :aria-selected="locale.code === currentLocale"
        :aria-label="`${t('common.switchTo')} ${locale.name}`"
      >
        <span class="language-selector__tab-flag">
          {{ locale.flag }}  
        </span>
        <span 
          v-if="showLabel"
          class="language-selector__tab-name"
        >
          {{ locale.name }}
        </span>
      </button>
    </div>

    <!-- スイッチ表示（2言語のみ） -->
    <div 
      v-else-if="variant === 'switch' && availableLocales.length === 2"
      class="language-selector__switch"
    >
      <div class="language-selector__switch-container">
        <button
          v-for="(locale, index) in availableLocales"
          :key="locale.code"
          class="language-selector__switch-option"
          :class="{ 
            'language-selector__switch-option--active': locale.code === currentLocale,
            'language-selector__switch-option--left': index === 0,
            'language-selector__switch-option--right': index === 1
          }"
          @click="selectLocale(locale.code)"
          :aria-label="`${t('common.switchTo')} ${locale.name}`"
        >
          <span class="language-selector__switch-flag">
            {{ locale.flag }}
          </span>
          <span 
            v-if="showLabel"
            class="language-selector__switch-name"
          >
            {{ locale.name }}
          </span>
        </button>
        <div 
          class="language-selector__switch-slider"
          :class="{ 'language-selector__switch-slider--right': currentLocale === availableLocales[1].code }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from '../composables/useI18n'
import type { SupportedLocale } from '../i18n'

// Props
interface Props {
  variant?: 'compact' | 'inline' | 'tabs' | 'switch'
  showLabel?: boolean
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'compact',
  showLabel: true,
  size: 'medium',
  disabled: false
})

// Emits
interface Emits {
  localeChanged: [locale: SupportedLocale]
}

const emit = defineEmits<Emits>()

// Composables
const { locale, availableLocales, setLocale, t } = useI18n()

// リアクティブ状態
const isOpen = ref(false)
const triggerRef = ref<HTMLElement>()
const dropdownRef = ref<HTMLElement>()

// 計算プロパティ
const currentLocale = computed(() => locale.value)

const currentLocaleConfig = computed(() => 
  availableLocales.value.find(l => l.code === currentLocale.value) || availableLocales.value[0]
)

const selectId = computed(() => `language-selector-${Math.random().toString(36).substr(2, 9)}`)

// メソッド
const selectLocale = (localeCode: SupportedLocale): void => {
  if (props.disabled || localeCode === currentLocale.value) return
  
  setLocale(localeCode)
  emit('localeChanged', localeCode)
  closeDropdown()
}

const toggleDropdown = (): void => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

const closeDropdown = (): void => {
  isOpen.value = false
}

const onSelectChange = (event: Event): void => {
  const target = event.target as HTMLSelectElement
  selectLocale(target.value as SupportedLocale)
}

// クリック外側検知
const handleClickOutside = (event: Event): void => {
  if (!triggerRef.value || !dropdownRef.value) return
  
  const target = event.target as Node
  if (!triggerRef.value.contains(target) && !dropdownRef.value.contains(target)) {
    closeDropdown()
  }
}

// キーボードナビゲーション
const handleKeyDown = (event: KeyboardEvent): void => {
  if (!isOpen.value) return
  
  switch (event.key) {
    case 'Escape':
      closeDropdown()
      triggerRef.value?.focus()
      break
    case 'Tab':
      // タブキーでドロップダウンを閉じる
      closeDropdown()
      break
  }
}

// ライフサイクル
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeyDown)
})

// ドロップダウンが開いた時の処理
const onDropdownOpen = async (): Promise<void> => {
  await nextTick()
  // フォーカス管理やポジション調整などを実装可能
}

// 外部からの制御用
defineExpose({
  closeDropdown,
  selectLocale,
  currentLocale: currentLocale.value
})
</script>

<style scoped>
/* =================================
   言語セレクター ベーススタイル
   ================================= */

.language-selector {
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* =================================
   コンパクト表示
   ================================= */

.language-selector__compact {
  position: relative;
}

.language-selector__trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: currentColor;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.language-selector__trigger:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.language-selector__trigger:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.language-selector__trigger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.language-selector__flag {
  font-size: 16px;
  line-height: 1;
}

.language-selector__label {
  font-weight: 500;
}

.language-selector__chevron {
  width: 16px;
  height: 16px;
  fill: currentColor;
  transition: transform 0.2s ease;
}

.language-selector__chevron--open {
  transform: rotate(180deg);
}

.language-selector__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 1000;
  overflow: hidden;
}

.language-selector__option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  border: none;
  color: #374151;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.language-selector__option:hover {
  background: rgba(59, 130, 246, 0.1);
}

.language-selector__option--active {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  font-weight: 600;
}

.language-selector__option-flag {
  font-size: 16px;
}

.language-selector__option-name {
  flex: 1;
}

.language-selector__check {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

/* =================================
   インライン表示
   ================================= */

.language-selector__inline {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.language-selector__inline-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.language-selector__inline-wrapper {
  position: relative;
}

.language-selector__select {
  width: 100%;
  padding: 10px 40px 10px 12px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  appearance: none;
  transition: border-color 0.2s ease;
}

.language-selector__select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.language-selector__select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.language-selector__select-chevron {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  fill: #6b7280;
  pointer-events: none;
}

/* =================================
   タブ表示
   ================================= */

.language-selector__tabs {
  display: flex;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 4px;
}

.language-selector__tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  justify-content: center;
}

.language-selector__tab:hover:not(.language-selector__tab--active) {
  background: rgba(255, 255, 255, 0.5);
  color: #374151;
}

.language-selector__tab--active {
  background: white;
  color: #3b82f6;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.language-selector__tab-flag {
  font-size: 16px;
}

/* =================================
   スイッチ表示
   ================================= */

.language-selector__switch {
  position: relative;
}

.language-selector__switch-container {
  position: relative;
  display: flex;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 24px;
  padding: 2px;
}

.language-selector__switch-option {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  border: none;
  border-radius: 20px;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s ease;
  z-index: 2;
  position: relative;
}

.language-selector__switch-option--active {
  color: #3b82f6;
  font-weight: 600;
}

.language-selector__switch-flag {
  font-size: 16px;
}

.language-selector__switch-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: calc(50% - 2px);
  height: calc(100% - 4px);
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.language-selector__switch-slider--right {
  transform: translateX(100%);
}

/* =================================
   サイズバリエーション
   ================================= */

/* Small */
.language-selector[data-size="small"] .language-selector__trigger {
  padding: 6px 8px;
  font-size: 12px;
}

.language-selector[data-size="small"] .language-selector__flag {
  font-size: 14px;
}

.language-selector[data-size="small"] .language-selector__chevron {
  width: 12px;
  height: 12px;
}

/* Large */
.language-selector[data-size="large"] .language-selector__trigger {
  padding: 12px 16px;
  font-size: 16px;
}

.language-selector[data-size="large"] .language-selector__flag {
  font-size: 20px;
}

.language-selector[data-size="large"] .language-selector__chevron {
  width: 20px;
  height: 20px;
}

/* =================================
   アニメーション
   ================================= */

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(-8px);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-8px);
}

/* =================================
   ダークモード対応
   ================================= */

@media (prefers-color-scheme: dark) {
  .language-selector__dropdown {
    background: rgba(17, 24, 39, 0.95);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .language-selector__option {
    color: #d1d5db;
  }
  
  .language-selector__option:hover {
    background: rgba(59, 130, 246, 0.2);
  }
  
  .language-selector__option--active {
    background: rgba(59, 130, 246, 0.2);
  }
  
  .language-selector__select {
    background: #374151;
    border-color: #4b5563;
    color: #d1d5db;
  }
  
  .language-selector__tabs {
    background: rgba(255, 255, 255, 0.05);
  }
  
  .language-selector__tab--active {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .language-selector__switch-container {
    background: rgba(255, 255, 255, 0.05);
  }
  
  .language-selector__switch-slider {
    background: rgba(255, 255, 255, 0.1);
  }
}

/* =================================
   レスポンシブ対応
   ================================= */

@media (max-width: 768px) {
  .language-selector__dropdown {
    position: fixed;
    top: auto;
    bottom: 20px;
    left: 20px;
    right: 20px;
    margin: 0;
  }
  
  .language-selector__tabs {
    flex-direction: column;
  }
  
  .language-selector__tab {
    justify-content: flex-start;
  }
}

/* =================================
   アクセシビリティ対応
   ================================= */

@media (prefers-reduced-motion: reduce) {
  .language-selector__chevron,
  .language-selector__switch-slider,
  .fade-scale-enter-active,
  .fade-scale-leave-active {
    transition: none;
  }
}

/* 高コントラストモード */
@media (prefers-contrast: high) {
  .language-selector__trigger,
  .language-selector__dropdown,
  .language-selector__select {
    border-width: 2px;
  }
  
  .language-selector__option--active {
    background: #3b82f6;
    color: white;
  }
}
</style>