module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    // HAQEI v4.3.1 決定論的要件: Math.random完全禁止
    'no-restricted-globals': ['error', {
      name: 'Math.random',
      message: '❌ Math.random禁止: SeedableRandomを使用してください。distにMath.randomが残るとビルド失敗します。'
    }],
    
    // 追加の決定論性保証ルール
    'no-restricted-syntax': [
      'error',
      {
        selector: 'CallExpression[callee.object.name="Math"][callee.property.name="random"]',
        message: '❌ Math.random()禁止: SeedableRandom.nextInt() または next() を使用してください'
      },
      {
        selector: 'CallExpression[callee.object.name="crypto"][callee.property.name="getRandomValues"]',
        message: '❌ crypto.getRandomValues()禁止: 決定論的な代替手段を使用してください'
      },
      {
        selector: 'CallExpression[callee.object.name="performance"][callee.property.name="now"]',
        message: '⚠️ performance.now()注意: 順序決定に使用する場合は決定論的代替案を検討してください'
      }
    ],
    
    // 一般的なコード品質ルール
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'no-undef': 'error'
  },
  
  // テストファイルでは緩い設定
  overrides: [
    {
      files: ['test-*.html', 'test-*.js', '**/test/**/*.js'],
      rules: {
        'no-restricted-globals': 'warn', // テストではwarning
        'no-restricted-syntax': 'warn',
        'no-console': 'off'
      }
    }
  ]
};