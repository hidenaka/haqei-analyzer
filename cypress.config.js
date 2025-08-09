/**
 * Cypress E2E Testing Configuration
 * HAQEI Future Simulator I Ching Integration
 * Following HaQei philosophy with comprehensive testing scenarios
 */

const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    // Base configuration
    baseUrl: 'http://localhost:8080',
    supportFile: 'tests/cypress/support/e2e.js',
    specPattern: 'tests/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    fixturesFolder: 'tests/cypress/fixtures',
    screenshotsFolder: 'tests/cypress/screenshots',
    videosFolder: 'tests/cypress/videos',
    downloadsFolder: 'tests/cypress/downloads',
    
    // Test execution settings
    experimentalStudio: true,
    experimentalWebKitSupport: true,
    
    // Performance requirements (2-second response time)
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    
    // Viewport configurations for responsive testing
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Video and screenshot settings
    video: true,
    videoCompression: 32,
    screenshotOnRunFailure: true,
    
    // Browser configuration
    chromeWebSecurity: false,
    
    setupNodeEvents(on, config) {
      // HaQei philosophy: Multi-persona testing setup
      on('task', {
        'HaQei:generatePersonaTestData': (persona) => {
          const personas = {
            analytical_thinker: {
              preferredInputs: ['detailed_analysis', 'logical_sequences'],
              testPatterns: ['step_by_step', 'data_validation']
            },
            intuitive_feeler: {
              preferredInputs: ['emotional_resonance', 'symbolic_meaning'],
              testPatterns: ['flow_based', 'experience_focused']
            },
            pragmatic_doer: {
              preferredInputs: ['practical_solutions', 'quick_results'],
              testPatterns: ['efficiency_focused', 'outcome_oriented']
            },
            creative_explorer: {
              preferredInputs: ['novel_approaches', 'experimental_features'],
              testPatterns: ['boundary_testing', 'creative_flows']
            }
          }
          return personas[persona] || null
        },
        
        'iching:validateAuthenticity': (hexagramData) => {
          // Validate I Ching authenticity
          const requiredElements = [
            'hexagram_number',
            'chinese_name', 
            'english_translation',
            'lines_yin_yang',
            'judgment',
            'image'
          ]
          
          return requiredElements.every(element => 
            hexagramData.hasOwnProperty(element) && 
            hexagramData[element] !== null
          )
        },
        
        'performance:measureResponseTime': (startTime) => {
          return Date.now() - startTime
        }
      })
      
      // Plugin registrations
      require('cypress-mochawesome-reporter/plugin')(on)
      
      return config
    }
  },
  
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite'
    },
    specPattern: 'tests/cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'tests/cypress/support/component.js'
  },
  
  // HaQei philosophy configuration
  env: {
    BUNENJIN_PHILOSOPHY_MODE: true,
    ICHING_AUTHENTICITY_CHECK: true,
    PERFORMANCE_TARGET_MS: 2000,
    MULTI_PERSONA_TESTING: true,
    
    // Test data configuration  
    TEST_USER_PROFILES: {
      analytical: 'analytical_thinker',
      intuitive: 'intuitive_feeler',
      pragmatic: 'pragmatic_doer', 
      creative: 'creative_explorer'
    }
  }
})