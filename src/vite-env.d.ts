/// <reference types="vite/client" />

// Vite環境変数の型定義
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_BUILD_TIME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_BUNENJIN_MODE: string
  readonly VITE_ICHING_MODE: string
  readonly VITE_DEBUG_MODE: string
  readonly MODE: string
  readonly BASE_URL: string
  readonly PROD: boolean
  readonly DEV: boolean
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Vue コンポーネントの型定義
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// アセットファイルの型定義
declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.gif' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}

declare module '*.ico' {
  const src: string
  export default src
}

// CSS Modules
declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string }
  export default classes
}

// Web Worker
declare module '*?worker' {
  const workerConstructor: {
    new (): Worker
  }
  export default workerConstructor
}

declare module '*?worker&inline' {
  const workerConstructor: {
    new (): Worker
  }
  export default workerConstructor
}

// WASM
declare module '*.wasm' {
  const wasmModule: WebAssembly.Module
  export default wasmModule
}

// JSON
declare module '*.json' {
  const value: any
  export default value
}

// グローバル型拡張
declare global {
  interface Window {
    // HAQEI専用グローバル変数
    HAQEI_CONFIG?: {
      apiBaseUrl: string
      version: string
      bunenjinMode: boolean
      ichingMode: boolean
    }
    
    // Analytics
    gtag?: (...args: any[]) => void
    
    // Service Worker
    workbox?: any
  }
  
  // bunenjin philosophy namespace
  namespace bunenjin {
    interface MultipleDividual {
      id: string
      name: string
      active: boolean
    }
    
    interface Strategy {
      name: string
      context: string[]
      effectiveness: number
    }
  }
  
  // I Ching namespace
  namespace iching {
    interface Hexagram {
      number: number
      name: string
      meaning: string
    }
    
    interface Reading {
      hexagram: Hexagram
      lines: number[]
      interpretation: string
    }
  }
}

export {}