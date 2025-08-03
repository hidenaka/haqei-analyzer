import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home' },
    { path: '/quick-analyzer', name: 'QuickAnalyzer' },
    { path: '/os-analyzer', name: 'OSAnalyzer' },
    { path: '/future-simulator', name: 'FutureSimulator' }
  ]
})

describe('AppHeader', () => {
  it('renders properly', () => {
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [router]
      }
    })
    
    expect(wrapper.find('h1').text()).toBe('HAQEI Analyzer')
  })

  it('contains navigation links', () => {
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [router]
      }
    })
    
    const links = wrapper.findAll('.nav-link')
    expect(links).toHaveLength(3)
    expect(links[0].text()).toBe('クイック診断')
    expect(links[1].text()).toBe('詳細分析')
    expect(links[2].text()).toBe('未来シミュレーター')
  })
})