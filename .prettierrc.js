/**
 * Prettier Configuration for HAQEI Project
 * Consistent code formatting following HaQei philosophy
 */

module.exports = {
  // Basic formatting
  semi: false,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  tabWidth: 2,
  useTabs: false,
  
  // Line length for readability (HaQei philosophy: clear communication)
  printWidth: 80,
  
  // Vue.js specific
  vueIndentScriptAndStyle: false,
  
  // HTML formatting
  htmlWhitespaceSensitivity: 'css',
  
  // Bracket spacing
  bracketSpacing: true,
  bracketSameLine: false,
  
  // Arrow function parentheses
  arrowParens: 'avoid',
  
  // End of line
  endOfLine: 'lf',
  
  // Embedded language formatting
  embeddedLanguageFormatting: 'auto',
  
  // Override for specific file types
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 120,
        trailingComma: 'none'
      }
    },
    {
      files: '*.md',
      options: {
        printWidth: 100,
        proseWrap: 'always'
      }
    },
    {
      files: '*.vue',
      options: {
        printWidth: 100
      }
    },
    {
      files: ['*.js', '*.ts'],
      options: {
        // I Ching data files may have longer lines for readability
        printWidth: 100
      }
    }
  ]
}