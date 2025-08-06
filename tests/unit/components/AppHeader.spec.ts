import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: { template: '<div>Home</div>' } },
    { path: '/quick-analyzer', name: 'QuickAnalyzer', component: { template: '<div>Quick</div>' } },
    { path: '/os-analyzer', name: 'OSAnalyzer', component: { template: '<div>OS</div>' } },
    { path: '/future-simulator', name: 'FutureSimulator', component: { template: '<div>Future</div>' } }
  ]
})

describe('AppHeader', () => {
  let wrapper: VueWrapper<any>

  beforeEach(async () => {
    // Ensure router is ready before mounting
    await router.push('/')
    await router.isReady()
    
    wrapper = mount(AppHeader, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': {
            template: '<a class="router-link nav-link" :href="to"><slot /></a>',
            props: ['to']
          }
        }
      }
    })
  })

  it('renders properly', () => {
    const heading = wrapper.find('h1')
    expect(heading.exists()).toBe(true)
    expect(heading.text()).toBe('HAQEI Analyzer')
  })

  it('contains navigation links', () => {
    const links = wrapper.findAll('.nav-link')
    expect(links.length).toBeGreaterThanOrEqual(3)
    
    // Filter out any extra links and focus on the main navigation
    const navLinks = links.filter(link => link.text().trim().length > 0)
    expect(navLinks.length).toBeGreaterThanOrEqual(3)
    
    // Check if main navigation links exist
    const linkTexts = navLinks.map(link => link.text().trim())
    expect(linkTexts).toContain('クイック診断')
    expect(linkTexts).toContain('詳細分析')
    expect(linkTexts).toContain('未来シミュレーター')
  })

  it('has proper navigation structure', () => {
    const nav = wrapper.find('.nav-container')
    expect(nav.exists()).toBe(true)
    
    const logo = wrapper.find('.logo')
    expect(logo.exists()).toBe(true)
    
    const navMenu = wrapper.find('.nav-menu')
    expect(navMenu.exists()).toBe(true)
  })

  it('displays app header with correct styling classes', () => {
    const header = wrapper.find('.app-header')
    expect(header.exists()).toBe(true)
    expect(header.classes()).toContain('app-header')
  })
})