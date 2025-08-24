/**
 * Context Type Safety System Tests
 * v4.3.0 - Comprehensive test suite
 */

// ES Module import
import { ContextTypeSystem, ContextAwarePrimaryLineSelector } from '../public/js/core/ContextTypeSystem.js';

/**
 * テストランナー
 */
class ContextTypeSystemTestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.contextSystem = new ContextTypeSystem();
    this.lineSelector = new ContextAwarePrimaryLineSelector();
  }
  
  /**
   * テストを追加
   */
  test(name, fn) {
    this.tests.push({ name, fn });
  }
  
  /**
   * アサーション
   */
  assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }
  
  /**
   * 等価性チェック
   */
  assertEqual(actual, expected, message) {
    const actualStr = JSON.stringify(actual);
    const expectedStr = JSON.stringify(expected);
    if (actualStr !== expectedStr) {
      throw new Error(`${message}\nExpected: ${expectedStr}\nActual: ${actualStr}`);
    }
  }
  
  /**
   * テストを実行
   */
  async run() {
    console.log('🧪 Context Type Safety System Tests\n');
    console.log('=' .repeat(50));
    
    for (const test of this.tests) {
      try {
        await test.fn.call(this);
        this.passed++;
        console.log(`✅ ${test.name}`);
      } catch (error) {
        this.failed++;
        console.log(`❌ ${test.name}`);
        console.log(`   Error: ${error.message}`);
      }
    }
    
    console.log('=' .repeat(50));
    console.log(`\n📊 Results: ${this.passed} passed, ${this.failed} failed`);
    console.log(`Total: ${this.tests.length} tests`);
    
    return this.failed === 0;
  }
}

// テストインスタンス作成
const runner = new ContextTypeSystemTestRunner();

// ===========================================
// Context正規化テスト
// ===========================================

runner.test('null/undefinedはデフォルト値を返す', function() {
  const result1 = this.contextSystem.normalizeContext(null);
  const result2 = this.contextSystem.normalizeContext(undefined);
  
  this.assertEqual(result1.domain, 'default', 'null should return default domain');
  this.assertEqual(result2.domain, 'default', 'undefined should return default domain');
  this.assert(result1.urgency === 5, 'Default urgency should be 5');
});

runner.test('文字列Contextを正規化', function() {
  const result = this.contextSystem.normalizeContext('business');
  
  this.assertEqual(result.domain, 'business', 'String should be treated as domain');
  this.assertEqual(result.question, 'business', 'String should also be stored as question');
  this.assertEqual(result.category, 'general', 'Should have default category');
});

runner.test('オブジェクトContextを正規化', function() {
  const input = {
    domain: 'personal',
    question: 'What should I do?',
    urgency: 8
  };
  
  const result = this.contextSystem.normalizeContext(input);
  
  this.assertEqual(result.domain, 'personal', 'Domain should be preserved');
  this.assertEqual(result.question, 'What should I do?', 'Question should be preserved');
  this.assertEqual(result.urgency, 8, 'Urgency should be preserved');
});

runner.test('無効な型でTypeError', function() {
  let errorThrown = false;
  
  try {
    this.contextSystem.normalizeContext(123);
  } catch (error) {
    errorThrown = error instanceof TypeError;
  }
  
  this.assert(errorThrown, 'Should throw TypeError for number input');
});

// ===========================================
// ドメイン検証テスト
// ===========================================

runner.test('有効なドメインの検証', function() {
  const domains = ['business', 'personal', 'relationship', 'health'];
  
  for (const domain of domains) {
    const result = this.contextSystem.validateDomain(domain);
    this.assertEqual(result, domain, `Valid domain ${domain} should be preserved`);
  }
});

runner.test('ドメインエイリアスのマッピング', function() {
  this.assertEqual(this.contextSystem.validateDomain('work'), 'business', 'work→business');
  this.assertEqual(this.contextSystem.validateDomain('job'), 'career', 'job→career');
  this.assertEqual(this.contextSystem.validateDomain('love'), 'relationship', 'love→relationship');
  this.assertEqual(this.contextSystem.validateDomain('medical'), 'health', 'medical→health');
});

runner.test('無効なドメインはdefaultを返す', function() {
  const result = this.contextSystem.validateDomain('invalid_domain');
  this.assertEqual(result, 'default', 'Invalid domain should return default');
});

// ===========================================
// urgency検証テスト
// ===========================================

runner.test('urgencyの範囲制限（0-10）', function() {
  const test1 = this.contextSystem.normalizeContext({ urgency: -5 });
  const test2 = this.contextSystem.normalizeContext({ urgency: 15 });
  const test3 = this.contextSystem.normalizeContext({ urgency: 7 });
  
  this.assertEqual(test1.urgency, 0, 'Negative urgency should be clamped to 0');
  this.assertEqual(test2.urgency, 10, 'Urgency > 10 should be clamped to 10');
  this.assertEqual(test3.urgency, 7, 'Valid urgency should be preserved');
});

// ===========================================
// Context等価性テスト
// ===========================================

runner.test('Context等価性チェック', function() {
  const ctx1 = 'business';
  const ctx2 = { domain: 'business', question: 'business' };
  
  const isEqual = this.contextSystem.areContextsEqual(ctx1, ctx2);
  this.assert(isEqual, 'String and equivalent object should be equal');
});

runner.test('異なるContextの非等価性', function() {
  const ctx1 = { domain: 'business', urgency: 5 };
  const ctx2 = { domain: 'personal', urgency: 5 };
  
  const isEqual = this.contextSystem.areContextsEqual(ctx1, ctx2);
  this.assert(!isEqual, 'Different domains should not be equal');
});

// ===========================================
// Contextマージテスト
// ===========================================

runner.test('Contextのマージ', function() {
  const base = { domain: 'business', urgency: 5 };
  const updates = { urgency: 8, category: 'finance' };
  
  const merged = this.contextSystem.mergeContext(base, updates);
  
  this.assertEqual(merged.domain, 'business', 'Domain should be preserved');
  this.assertEqual(merged.urgency, 8, 'Urgency should be updated');
  this.assertEqual(merged.category, 'finance', 'Category should be added');
});

// ===========================================
// シリアライズ/デシリアライズテスト
// ===========================================

runner.test('Contextのシリアライズとデシリアライズ', function() {
  const original = {
    domain: 'personal',
    question: 'Test question',
    urgency: 7,
    metadata: { key: 'value' }
  };
  
  const serialized = this.contextSystem.serialize(original);
  const deserialized = this.contextSystem.deserialize(serialized);
  
  this.assertEqual(deserialized.domain, original.domain, 'Domain should be preserved');
  this.assertEqual(deserialized.question, original.question, 'Question should be preserved');
  this.assertEqual(deserialized.urgency, original.urgency, 'Urgency should be preserved');
  this.assertEqual(deserialized.metadata.key, 'value', 'Metadata should be preserved');
});

runner.test('無効なJSONのデシリアライズ', function() {
  const result = this.contextSystem.deserialize('invalid json');
  
  this.assertEqual(result.domain, 'default', 'Should return default for invalid JSON');
  this.assertEqual(result.urgency, 5, 'Should have default urgency');
});

// ===========================================
// 主爻選択テスト
// ===========================================

runner.test('単一変爻の主爻選択', function() {
  const result = this.lineSelector.selectPrimaryLine([3], 'business');
  this.assertEqual(result, 3, 'Single line should be returned as-is');
});

runner.test('複数変爻での5爻優先（business）', function() {
  const result = this.lineSelector.selectPrimaryLine([2, 5, 6], 'business');
  this.assertEqual(result, 5, 'Line 5 should be prioritized for business');
});

runner.test('5爻なしの場合は最下位（business）', function() {
  const result = this.lineSelector.selectPrimaryLine([2, 3, 6], 'business');
  this.assertEqual(result, 2, 'Should select lowest when line 5 is absent');
});

runner.test('personalドメインでは最下位優先', function() {
  const result = this.lineSelector.selectPrimaryLine([3, 4, 5], 'personal');
  this.assertEqual(result, 3, 'Personal domain should prioritize lowest line');
});

runner.test('文字列とオブジェクトContextの互換性', function() {
  const result1 = this.lineSelector.selectPrimaryLine([2, 5], 'business');
  const result2 = this.lineSelector.selectPrimaryLine([2, 5], { domain: 'business' });
  
  this.assertEqual(result1, result2, 'String and object context should produce same result');
});

// ===========================================
// 解釈モード決定テスト
// ===========================================

runner.test('0爻変化でhexagramモード', function() {
  const result = this.lineSelector.determineInterpretation([], 'default');
  
  this.assertEqual(result.mode, 'hexagram', 'No changes should be hexagram mode');
  this.assertEqual(result.primaryLine, null, 'Primary line should be null');
});

runner.test('1爻変化でsingleモード', function() {
  const result = this.lineSelector.determineInterpretation([3], 'default');
  
  this.assertEqual(result.mode, 'single', 'Single change should be single mode');
  this.assertEqual(result.primaryLine, 3, 'Primary line should be the single line');
});

runner.test('2-3爻変化でmainモード', function() {
  const result = this.lineSelector.determineInterpretation([2, 5], 'business');
  
  this.assertEqual(result.mode, 'main', '2-3 changes should be main mode');
  this.assertEqual(result.primaryLine, 5, 'Primary line should be selected');
});

runner.test('6爻変化でallモード', function() {
  const result = this.lineSelector.determineInterpretation([1, 2, 3, 4, 5, 6], 'default');
  
  this.assertEqual(result.mode, 'all', '6 changes should be all mode');
  this.assertEqual(result.primaryLine, null, 'Primary line should be null for all mode');
});

// ===========================================
// エラー検証テスト
// ===========================================

runner.test('無効な爻番号のフィルタリング', function() {
  const result = this.lineSelector.selectPrimaryLine([0, 3, 7, 5], 'default');
  
  // 0と7は無効なので、3と5のみが残り、5が優先される
  this.assertEqual(result, 5, 'Invalid line numbers should be filtered out');
});

runner.test('重複爻番号の除去', function() {
  const result = this.lineSelector.selectPrimaryLine([3, 3, 5, 5], 'default');
  
  this.assertEqual(result, 5, 'Duplicate lines should be removed');
});

runner.test('配列以外の入力でTypeError', function() {
  let errorThrown = false;
  
  try {
    this.lineSelector.selectPrimaryLine('not an array', 'default');
  } catch (error) {
    errorThrown = error instanceof TypeError;
  }
  
  this.assert(errorThrown, 'Should throw TypeError for non-array input');
});

// ===========================================
// 検証エラーメッセージテスト
// ===========================================

runner.test('検証エラーメッセージの生成', function() {
  const errors1 = this.contextSystem.getValidationErrors(123);
  this.assert(errors1.length > 0, 'Should have errors for number input');
  this.assert(errors1[0].includes('Invalid type'), 'Error should mention invalid type');
  
  const errors2 = this.contextSystem.getValidationErrors([]);
  this.assert(errors2.length > 0, 'Should have errors for array input');
  this.assert(errors2[0].includes('Arrays'), 'Error should mention arrays');
  
  const errors3 = this.contextSystem.getValidationErrors({ urgency: 'high' });
  this.assert(errors3.length > 0, 'Should have errors for non-numeric urgency');
  
  const errors4 = this.contextSystem.getValidationErrors({ urgency: 15 });
  this.assert(errors4.length > 0, 'Should have errors for out-of-range urgency');
});

// ===========================================
// 統合テスト
// ===========================================

runner.test('複雑なContextの統合処理', function() {
  const context = {
    domain: 'work',  // エイリアス→business
    question: 'Should I take this job?',
    category: 'career',
    urgency: 12,  // 範囲外→10にクランプ
    metadata: {
      location: 'Tokyo',
      salary: 'high'
    }
  };
  
  const normalized = this.contextSystem.normalizeContext(context);
  
  this.assertEqual(normalized.domain, 'business', 'work should map to business');
  this.assertEqual(normalized.urgency, 10, 'Urgency should be clamped to 10');
  this.assertEqual(normalized.metadata.location, 'Tokyo', 'Metadata should be preserved');
  
  // 主爻選択のテスト
  const interpretation = this.lineSelector.determineInterpretation([2, 5, 6], normalized);
  this.assertEqual(interpretation.primaryLine, 5, 'Should select line 5 for business context');
});

// ===========================================
// テスト実行
// ===========================================

if (typeof window === 'undefined') {
  // Node.js環境
  runner.run().then(success => {
    process.exit(success ? 0 : 1);
  });
} else {
  // ブラウザ環境
  window.runContextTests = () => runner.run();
  console.log('ℹ️ Run window.runContextTests() to execute tests');
}