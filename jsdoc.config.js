/**
 * JSDoc Configuration for HAQEI Project
 * Comprehensive documentation following bunenjin philosophy
 */

module.exports = {
  source: {
    include: [
      './public/js/core/',
      './public/js/components/',
      './public/js/os-analyzer/', 
      './public/js/future-simulator/',
      './src/'
    ],
    exclude: [
      './node_modules/',
      './public/assets/',
      './public/dict/',
      './tests/',
      './coverage/'
    ],
    includePattern: '\\.(js|ts|vue)$',
    excludePattern: '\\.test\\.(js|ts)$'
  },
  
  opts: {
    destination: './docs/api/',
    recurse: true,
    readme: './README.md'
  },
  
  plugins: [
    'plugins/markdown',
    'plugins/summarize'
  ],
  
  templates: {
    cleverLinks: false,
    monospaceLinks: false
  },
  
  // Bunenjin philosophy: Multi-perspective documentation
  metadata: {
    title: 'HAQEI Future Simulator - I Ching Integration API',
    description: 'Complete API documentation following bunenjin philosophy with authentic I Ching integration',
    version: '1.0.0',
    author: 'HAQEI Development Team',
    philosophy: 'bunenjin - Multi-persona approach avoiding single-identity assumptions'
  },
  
  // Custom tags for I Ching and bunenjin concepts
  tags: {
    allowUnknownTags: true,
    dictionaries: ['jsdoc', 'closure']
  },
  
  // Output configuration
  opts: {
    destination: './docs/api/',
    recurse: true,
    readme: './README.md',
    template: 'node_modules/better-docs'
  }
}