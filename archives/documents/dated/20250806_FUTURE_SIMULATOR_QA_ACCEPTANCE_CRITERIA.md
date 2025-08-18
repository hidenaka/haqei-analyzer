# Future Simulator QA受入テスト基準書

**作成日**: 2025年8月6日  
**担当**: Requirements Analyst Agent (HAQEI)  
**テスト対象**: Future Simulator Complete Recovery  
**品質基準**: Production-Ready Deployment

---

## 🎯 受入基準概要

### 品質ゲートウェイ
すべての機能が以下の基準を満たす必要があります：

```
✅ PASS基準: 100% of Critical tests + 95% of High Priority tests
⚠️ CONDITIONAL: 90% of Critical tests + 90% of High Priority tests (要改善計画)
❌ FAIL: <90% of Critical tests (実装継続不可)
```

### テストカテゴリ
1. **Functional Tests** (機能テスト) - 40%
2. **Performance Tests** (性能テスト) - 25%
3. **Usability Tests** (ユーザビリティテスト) - 20%
4. **Compatibility Tests** (互換性テスト) - 15%

---

## 🔴 Critical Tests (Must Pass 100%)

### CT-001: JavaScript基盤動作確認
**目的**: 全JavaScript実行環境の正常性確認

#### CT-001-1: Console Error完全除去
```javascript
// Test Specification
describe('Console Error Elimination', () => {
  let consoleErrors = [];
  
  beforeEach(() => {
    // Capture console errors
    window.addEventListener('error', (e) => {
      consoleErrors.push(e.error);
    });
  });
  
  test('No console errors on page load', async () => {
    await page.goto('http://localhost:3000/future_simulator.html');
    await page.waitForLoadState('networkidle');
    
    const errors = await page.evaluate(() => {
      return window.consoleErrors || [];
    });
    
    expect(errors).toEqual([]);
  });
  
  test('No console errors during interaction', async () => {
    await page.fill('#worryInput', 'テストテキスト');
    await page.click('#aiGuessBtn');
    await page.waitForTimeout(3000);
    
    const errors = await page.evaluate(() => {
      return window.consoleErrors || [];
    });
    
    expect(errors).toEqual([]);
  });
});
```

**受入基準**:
- [ ] ページロード時のconsole error = 0
- [ ] ユーザー操作中のconsole error = 0  
- [ ] Network request failures = 0
- [ ] JavaScript parsing errors = 0

#### CT-001-2: H384_DATABASE重複解決確認
```javascript
test('H384_DATABASE conflict resolution', async () => {
  const result = await page.evaluate(() => {
    // Check if H384_DATABASE exists and is functional
    if (!window.H384_DATABASE) return { exists: false };
    
    try {
      const instance = new window.H384_DATABASE();
      const initResult = instance.initialize ? instance.initialize() : true;
      
      return {
        exists: true,
        instantiable: true,
        initializable: !!initResult,
        methods: Object.getOwnPropertyNames(instance),
        conflicts: window.HAQEI_NAMESPACE ? 
          window.HAQEI_NAMESPACE.conflictCount || 0 : 0
      };
    } catch (error) {
      return { 
        exists: true, 
        instantiable: false, 
        error: error.message 
      };
    }
  });
  
  expect(result.exists).toBe(true);
  expect(result.instantiable).toBe(true);
  expect(result.conflicts).toBe(0);
});
```

**受入基準**:
- [ ] H384_DATABASE クラス正常インスタンス化
- [ ] Namespace競合 = 0件
- [ ] Proxy pattern動作確認
- [ ] 既存機能への影響なし

### CT-002: UI基本機能確認

#### CT-002-1: 入力フォーム即座表示
```javascript
test('Input form immediate visibility', async () => {
  await page.goto('http://localhost:3000/future_simulator.html');
  
  // Check visibility within 1 second
  await page.waitForSelector('#worryInput', { 
    state: 'visible', 
    timeout: 1000 
  });
  
  const inputVisible = await page.isVisible('#worryInput');
  const inputEnabled = await page.isEnabled('#worryInput');
  const inputContent = await page.isVisible('#input-content');
  
  expect(inputVisible).toBe(true);
  expect(inputEnabled).toBe(true);
  expect(inputContent).toBe(true);
});
```

**受入基準**:
- [ ] テキスト入力フォーム1秒以内表示
- [ ] Input focus可能状態
- [ ] Placeholder text表示
- [ ] Container visibility confirmed

#### CT-002-2: 基本入力処理
```javascript
test('Basic input processing', async () => {
  await page.fill('#worryInput', '将来に不安を感じています');
  
  const inputValue = await page.inputValue('#worryInput');
  expect(inputValue).toBe('将来に不安を感じています');
  
  // Button should be clickable
  const buttonEnabled = await page.isEnabled('#aiGuessBtn');
  expect(buttonEnabled).toBe(true);
  
  await page.click('#aiGuessBtn');
  
  // Loading should appear
  await page.waitForSelector('#results-loading', { 
    state: 'visible', 
    timeout: 2000 
  });
});
```

**受入基準**:
- [ ] テキスト入力正常受付
- [ ] ボタンクリック反応
- [ ] ローディング表示開始
- [ ] Character limit enforcement (if applicable)

### CT-003: AI分析処理確認

#### CT-003-1: 分析実行成功
```javascript
test('AI analysis execution success', async () => {
  await page.fill('#worryInput', '仕事で大きな挑戦をしようと思っています');
  await page.click('#aiGuessBtn');
  
  // Wait for analysis completion (max 10 seconds)
  const startTime = Date.now();
  await page.waitForFunction(() => {
    const loadingElement = document.getElementById('results-loading');
    return loadingElement && loadingElement.style.display === 'none';
  }, { timeout: 10000 });
  
  const analysisTime = Date.now() - startTime;
  
  // Check results appeared
  const resultArea = await page.isVisible('#resultArea');
  const scenarios = await page.$$('.scenario-card');
  
  expect(resultArea).toBe(true);
  expect(scenarios.length).toBe(8);
  expect(analysisTime).toBeLessThan(10000);
});
```

**受入基準**:
- [ ] 分析処理10秒以内完了
- [ ] 結果表示エリア出現
- [ ] 8つのシナリオカード生成
- [ ] エラーハンドリング適切動作

#### CT-003-2: 分析結果品質確認
```javascript
test('Analysis result quality', async () => {
  await page.fill('#worryInput', '新しい恋愛関係に期待と不安があります');
  await page.click('#aiGuessBtn');
  
  await page.waitForFunction(() => {
    return document.querySelectorAll('.scenario-card').length === 8;
  });
  
  const scenarios = await page.$$eval('.scenario-card', cards => {
    return cards.map(card => ({
      title: card.querySelector('.scenario-title')?.textContent || '',
      content: card.querySelector('.scenario-content')?.textContent || '',
      probability: card.querySelector('.probability')?.textContent || '',
      timeframe: card.querySelector('.timeframe')?.textContent || ''
    }));
  });
  
  // Quality checks
  scenarios.forEach((scenario, index) => {
    expect(scenario.title).toContain('未来パターン');
    expect(scenario.content.length).toBeGreaterThan(10);
    expect(scenario.probability).toMatch(/\d+%/);
    expect(scenario.timeframe).toBeTruthy();
  });
  
  // Uniqueness check
  const contents = scenarios.map(s => s.content);
  const uniqueContents = [...new Set(contents)];
  expect(uniqueContents.length).toBe(contents.length);
});
```

**受入基準**:
- [ ] 各シナリオに有意なコンテンツ
- [ ] 確率値の妥当性(10-95%)
- [ ] 時間枠の多様性
- [ ] コンテンツの一意性確保

---

## 🟠 High Priority Tests (Must Pass 95%)

### HP-001: インタラクション機能

#### HP-001-1: カード選択動作
```javascript
test('Card selection interaction', async () => {
  // Setup: Complete analysis first
  await page.fill('#worryInput', 'テスト用入力');
  await page.click('#aiGuessBtn');
  await page.waitForSelector('.scenario-card');
  
  // Test card selection
  const firstCard = await page.$('.scenario-card:first-child');
  await firstCard.click();
  
  // Check selection state
  const isSelected = await firstCard.evaluate(card => 
    card.classList.contains('selected')
  );
  
  expect(isSelected).toBe(true);
  
  // Check visual feedback
  const hasCheckmark = await firstCard.$('.selection-checkmark');
  expect(hasCheckmark).toBeTruthy();
  
  // Test deselection
  await firstCard.click();
  const isDeselected = await firstCard.evaluate(card => 
    !card.classList.contains('selected')
  );
  
  expect(isDeselected).toBe(true);
});
```

#### HP-001-2: 選択数制限確認
```javascript
test('Selection limit enforcement', async () => {
  await page.fill('#worryInput', 'テスト用入力');
  await page.click('#aiGuessBtn');
  await page.waitForSelector('.scenario-card');
  
  const cards = await page.$$('.scenario-card');
  
  // Select maximum number (3)
  for (let i = 0; i < 3; i++) {
    await cards[i].click();
  }
  
  // Try to select 4th card
  await cards[3].click();
  
  // Check that 4th card is not selected
  const fourthSelected = await cards[3].evaluate(card => 
    card.classList.contains('selected')
  );
  
  expect(fourthSelected).toBe(false);
  
  // Check warning message appears
  await page.waitForSelector('.selection-limit-message', { timeout: 1000 });
});
```

### HP-002: データエクスポート機能

#### HP-002-1: JSON エクスポート確認
```javascript
test('JSON export functionality', async () => {
  // Complete analysis
  await page.fill('#worryInput', 'エクスポートテスト用テキスト');
  await page.click('#aiGuessBtn');
  await page.waitForSelector('.scenario-card');
  
  // Select some cards
  const cards = await page.$$('.scenario-card');
  await cards[0].click();
  await cards[2].click();
  
  // Trigger export
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('#export-json-btn')
  ]);
  
  // Verify download
  expect(download.suggestedFilename()).toMatch(/future_analysis_.*\.json/);
  
  // Check file content
  const path = await download.path();
  const content = await require('fs').promises.readFile(path, 'utf8');
  const data = JSON.parse(content);
  
  expect(data.exportMetadata).toBeDefined();
  expect(data.inputAnalysis).toBeDefined();
  expect(data.userSelections.selectedCount).toBe(2);
});
```

#### HP-002-2: CSV エクスポート確認
```javascript
test('CSV export functionality', async () => {
  // Setup analysis
  await page.fill('#worryInput', 'CSVエクスポートテスト');
  await page.click('#aiGuessBtn');
  await page.waitForSelector('.scenario-card');
  
  // Export CSV
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('#export-csv-btn')
  ]);
  
  expect(download.suggestedFilename()).toMatch(/future_analysis_.*\.csv/);
  
  // Verify CSV structure
  const path = await download.path();
  const content = await require('fs').promises.readFile(path, 'utf8');
  const lines = content.split('\n');
  
  // Check header
  expect(lines[0]).toContain('Category,Metric,Value,Timestamp');
  
  // Check data rows
  expect(lines.length).toBeGreaterThan(10);
  expect(lines.some(line => line.includes('Emotion'))).toBe(true);
  expect(lines.some(line => line.includes('Keyword'))).toBe(true);
});
```

---

## 🟡 Medium Priority Tests (Must Pass 85%)

### MP-001: パフォーマンステスト

#### MP-001-1: ページロード性能
```javascript
test('Page load performance', async () => {
  const startTime = Date.now();
  
  await page.goto('http://localhost:3000/future_simulator.html');
  await page.waitForLoadState('networkidle');
  
  const loadTime = Date.now() - startTime;
  
  // Performance metrics
  const metrics = await page.evaluate(() => {
    const perfData = performance.getEntriesByType('navigation')[0];
    return {
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
      loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
      firstPaint: performance.getEntriesByType('paint')
        .find(entry => entry.name === 'first-paint')?.startTime || 0
    };
  });
  
  expect(loadTime).toBeLessThan(5000); // 5 seconds max
  expect(metrics.domContentLoaded).toBeLessThan(2000); // 2 seconds max
  expect(metrics.firstPaint).toBeLessThan(1500); // 1.5 seconds max
});
```

#### MP-001-2: 分析処理性能
```javascript
test('Analysis processing performance', async () => {
  const testTexts = [
    '短いテキスト',
    '中程度の長さのテキストです。いくつかの文章が含まれています。',
    '非常に長いテキストの例です。' + 'この文章を繰り返します。'.repeat(50)
  ];
  
  for (const text of testTexts) {
    await page.fill('#worryInput', text);
    
    const startTime = Date.now();
    await page.click('#aiGuessBtn');
    
    await page.waitForFunction(() => {
      const loading = document.getElementById('results-loading');
      return loading && loading.style.display === 'none';
    });
    
    const processingTime = Date.now() - startTime;
    
    expect(processingTime).toBeLessThan(8000); // 8 seconds max regardless of text length
  }
});
```

### MP-002: ブラウザ互換性テスト

#### MP-002-1: クロスブラウザ機能確認
```javascript
// This would be run across different browser contexts
const browsers = ['chromium', 'firefox', 'webkit'];

browsers.forEach(browserName => {
  test(`Cross-browser compatibility: ${browserName}`, async () => {
    const browser = await playwright[browserName].launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('http://localhost:3000/future_simulator.html');
    
    // Basic functionality test
    await page.fill('#worryInput', 'ブラウザ互換性テスト');
    await page.click('#aiGuessBtn');
    
    const scenarios = await page.waitForSelector('.scenario-card', { timeout: 10000 });
    expect(scenarios).toBeTruthy();
    
    await browser.close();
  });
});
```

---

## 🔵 Low Priority Tests (Must Pass 70%)

### LP-001: アクセシビリティテスト

#### LP-001-1: キーボードナビゲーション
```javascript
test('Keyboard accessibility', async () => {
  await page.goto('http://localhost:3000/future_simulator.html');
  
  // Tab navigation test
  await page.keyboard.press('Tab');
  const focusedElement = await page.evaluate(() => document.activeElement.id);
  
  expect(['worryInput', 'aiGuessBtn']).toContain(focusedElement);
  
  // Complete analysis for card testing
  await page.fill('#worryInput', 'キーボードナビゲーションテスト');
  await page.click('#aiGuessBtn');
  await page.waitForSelector('.scenario-card');
  
  // Tab to first card
  await page.keyboard.press('Tab');
  const cardFocused = await page.evaluate(() => 
    document.activeElement.classList.contains('scenario-card')
  );
  
  expect(cardFocused).toBe(true);
  
  // Select with Enter key
  await page.keyboard.press('Enter');
  const cardSelected = await page.evaluate(() => 
    document.activeElement.classList.contains('selected')
  );
  
  expect(cardSelected).toBe(true);
});
```

#### LP-001-2: スクリーンリーダー対応
```javascript
test('Screen reader compatibility', async () => {
  await page.goto('http://localhost:3000/future_simulator.html');
  
  // Check ARIA labels
  const inputLabel = await page.getAttribute('#worryInput', 'aria-label');
  const buttonLabel = await page.getAttribute('#aiGuessBtn', 'aria-label');
  
  expect(inputLabel || '').toBeTruthy();
  expect(buttonLabel || '').toBeTruthy();
  
  // Complete analysis
  await page.fill('#worryInput', 'スクリーンリーダーテスト');
  await page.click('#aiGuessBtn');
  await page.waitForSelector('.scenario-card');
  
  // Check cards have proper ARIA attributes
  const cards = await page.$$('.scenario-card');
  for (const card of cards) {
    const role = await card.getAttribute('role');
    const selected = await card.getAttribute('aria-selected');
    
    expect(['button', 'option']).toContain(role || '');
    expect(['true', 'false']).toContain(selected || 'false');
  }
});
```

---

## 📊 テスト実行戦略

### 自動テスト実行
```bash
# Package.json scripts
{
  "scripts": {
    "test:critical": "playwright test --grep '@critical'",
    "test:high": "playwright test --grep '@high'", 
    "test:medium": "playwright test --grep '@medium'",
    "test:low": "playwright test --grep '@low'",
    "test:all": "playwright test",
    "test:performance": "playwright test --grep '@performance'",
    "test:accessibility": "playwright test --grep '@accessibility'"
  }
}
```

### CI/CD統合
```yaml
# GitHub Actions example
name: Future Simulator QA Tests
on: [push, pull_request]

jobs:
  qa-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
        
      - name: Install Playwright
        run: npx playwright install
        
      - name: Run Critical Tests
        run: npm run test:critical
        
      - name: Run High Priority Tests  
        run: npm run test:high
        continue-on-error: true
        
      - name: Generate Test Report
        run: npx playwright show-report
        if: always()
```

### 手動テストチェックリスト

#### 基本動作確認 (必須)
- [ ] ページが正常にロードされる
- [ ] テキスト入力が即座に可能
- [ ] AI分析ボタンが機能する
- [ ] 8つのシナリオが生成される
- [ ] カード選択が機能する
- [ ] データエクスポートが機能する

#### ユーザーエクスペリエンス確認
- [ ] UI操作が直感的
- [ ] ローディング時間が許容範囲
- [ ] エラーメッセージが適切
- [ ] モバイル表示が適切
- [ ] アニメーションがスムーズ

#### エッジケース確認
- [ ] 空文字入力時の挙動
- [ ] 極端に長いテキスト入力
- [ ] 連続クリック時の挙動
- [ ] ネットワーク切断時の挙動
- [ ] ブラウザバック/フォワード

---

## 🎯 最終受入基準

### ✅ PASS条件
1. **Critical Tests**: 100% pass
2. **High Priority Tests**: 95% pass  
3. **Medium Priority Tests**: 85% pass
4. **Low Priority Tests**: 70% pass
5. **Manual Testing**: All basic functionality confirmed
6. **Performance**: All benchmarks met
7. **Browser Support**: Minimum 3 major browsers functional

### 📋 リリース判定基準
- [ ] 全Console errorが解決済み
- [ ] Core功能が完全動作
- [ ] ユーザビリティテスト合格
- [ ] セキュリティ検証完了
- [ ] ドキュメント更新済み
- [ ] 本番環境動作確認済み

### 🚀 品質保証完了証明
```
品質保証担当者: _______________
テスト実行日: 2025年8月6日
総テスト実行数: _____ / _____
合格率: _____%
リリース承認: [ ] 承認 [ ] 条件付き承認 [ ] 却下

承認者サイン: _______________
承認日時: _______________
```

---

**次のフェーズ**: 実装開始とリアルタイム品質監視の開始