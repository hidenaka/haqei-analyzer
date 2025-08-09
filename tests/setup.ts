import { config } from '@vue/test-utils'
import { vi } from 'vitest'
import '@testing-library/jest-dom'

// Configure Vue Test Utils global stubs
config.global.stubs = {
  // Router components
  'router-link': true,
  'router-view': true,
  // Common UI components
  'transition': false,
  'transition-group': false,
  // Custom components that might not be available
  'HaqeiComponent': true,
  'IChingHexagram': true,
  'HaQeiPhilosophyIndicator': true
}

// Configure global mocks
config.global.mocks = {
  $t: (key: string) => key,
  $router: {
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    currentRoute: {
      value: {
        path: '/',
        params: {},
        query: {},
        hash: '',
        fullPath: '/',
        matched: [],
        name: null,
      }
    }
  },
  $route: {
    path: '/',
    params: {},
    query: {},
    hash: '',
    fullPath: '/',
    matched: [],
    name: null,
  },
}

// Mock HAQEI-specific composables
vi.mock('@/composables/useHaQeiPhilosophy', () => ({
  default: () => ({
    philosophyState: vi.fn(() => ({ isActive: true, principle: 'test' })),
    validatePhilosophy: vi.fn(() => true),
    applyHaQeiLogic: vi.fn(() => ({ valid: true, message: 'test' }))
  })
}))

vi.mock('@/composables/useIChingInterpretation', () => ({
  default: () => ({
    interpretHexagram: vi.fn(() => ({ meaning: 'test', guidance: 'test' })),
    calculateTransformation: vi.fn(() => ({ from: 1, to: 2, path: 'test' })),
    validateOrthodoxy: vi.fn(() => true)
  })
}))

// Mock DOM APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return []
  }
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock Web APIs
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(() => null),
    removeItem: vi.fn(() => null),
    clear: vi.fn(() => null),
  },
  writable: true,
})

Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(() => null),
    removeItem: vi.fn(() => null),
    clear: vi.fn(() => null),
  },
  writable: true,
})

// Mock fetch API
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
)

// Mock URL constructor
global.URL.createObjectURL = vi.fn(() => 'mock-url')
global.URL.revokeObjectURL = vi.fn()

// Mock crypto API
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: vi.fn((arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256)
      }
      return arr
    }),
    randomUUID: vi.fn(() => '00000000-0000-0000-0000-000000000000')
  }
})

// Console suppression for cleaner test output
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

beforeEach(() => {
  // Reset mocks before each test
  vi.clearAllMocks()
})

afterEach(() => {
  // Clean up after each test
  vi.restoreAllMocks()
})

// Suppress specific console warnings in tests
console.error = (...args) => {
  const message = args.join(' ')
  if (
    message.includes('Vue Router warn') ||
    message.includes('component(s)') ||
    message.includes('children property')
  ) {
    return
  }
  originalConsoleError(...args)
}

console.warn = (...args) => {
  const message = args.join(' ')
  if (
    message.includes('Vue Router warn') ||
    message.includes('[Vue warn]')
  ) {
    return
  }
  originalConsoleWarn(...args)
}