/**
 * SeedableRandom Tests
 * v4.3.0 - 決定論的乱数生成器のテスト
 */

import { SeedableRandom, RandomnessManager } from '../public/js/core/SeedableRandom.js';

/**
 * テストランナー
 */
class SeedableRandomTestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }
  
  test(name, fn) {
    this.tests.push({ name, fn });
  }
  
  assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }
  
  assertClose(actual, expected, tolerance = 0.001, message) {
    if (Math.abs(actual - expected) > tolerance) {
      throw new Error(`${message}\nExpected: ${expected} ± ${tolerance}\nActual: ${actual}`);
    }
  }
  
  async run() {
    console.log('🎲 SeedableRandom Tests\n');
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

const runner = new SeedableRandomTestRunner();

// ===========================================
// 決定論的動作テスト
// ===========================================

runner.test('同一シードで完全一致', function() {
  const rand1 = new SeedableRandom(42);
  const rand2 = new SeedableRandom(42);
  
  for (let i = 0; i < 100; i++) {
    const val1 = rand1.next();
    const val2 = rand2.next();
    this.assert(val1 === val2, `Values should match at iteration ${i}`);
  }
});

runner.test('リセット後の再現性', function() {
  const rand = new SeedableRandom(123);
  
  // 最初の10個を記録
  const first = [];
  for (let i = 0; i < 10; i++) {
    first.push(rand.next());
  }
  
  // リセット
  rand.reset();
  
  // 同じ値が出るか確認
  for (let i = 0; i < 10; i++) {
    const val = rand.next();
    this.assert(val === first[i], `Value should match after reset at index ${i}`);
  }
});

runner.test('異なるシードで異なる値', function() {
  const rand1 = new SeedableRandom(100);
  const rand2 = new SeedableRandom(200);
  
  let differences = 0;
  for (let i = 0; i < 100; i++) {
    if (rand1.next() !== rand2.next()) {
      differences++;
    }
  }
  
  // 90%以上は異なるはず
  this.assert(differences > 90, `Should have mostly different values (got ${differences}/100)`);
});

// ===========================================
// 範囲テスト
// ===========================================

runner.test('next()は0-1の範囲', function() {
  const rand = new SeedableRandom();
  
  for (let i = 0; i < 1000; i++) {
    const val = rand.next();
    this.assert(val >= 0 && val < 1, `Value ${val} should be in [0, 1)`);
  }
});

runner.test('nextInt()の範囲と包含性', function() {
  const rand = new SeedableRandom(456);
  
  const min = 5;
  const max = 10;
  const counts = {};
  
  for (let i = min; i <= max; i++) {
    counts[i] = 0;
  }
  
  for (let i = 0; i < 600; i++) {
    const val = rand.nextInt(min, max);
    this.assert(val >= min && val <= max, `Value ${val} should be in [${min}, ${max}]`);
    counts[val]++;
  }
  
  // すべての値が少なくとも1回は出現
  for (let i = min; i <= max; i++) {
    this.assert(counts[i] > 0, `Value ${i} should appear at least once`);
  }
});

runner.test('nextFloat()の範囲', function() {
  const rand = new SeedableRandom();
  
  for (let i = 0; i < 100; i++) {
    const val = rand.nextFloat(2.5, 7.5);
    this.assert(val >= 2.5 && val < 7.5, `Value ${val} should be in [2.5, 7.5)`);
  }
});

// ===========================================
// 配列操作テスト
// ===========================================

runner.test('shuffle()の決定論性', function() {
  const rand1 = new SeedableRandom(789);
  const rand2 = new SeedableRandom(789);
  
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  const shuffled1 = rand1.shuffle(arr);
  const shuffled2 = rand2.shuffle(arr);
  
  for (let i = 0; i < arr.length; i++) {
    this.assert(shuffled1[i] === shuffled2[i], `Shuffled arrays should match at index ${i}`);
  }
  
  // 元の配列は変更されない
  this.assert(arr[0] === 1 && arr[9] === 10, 'Original array should not be modified');
});

runner.test('choice()の動作', function() {
  const rand = new SeedableRandom(111);
  const options = ['a', 'b', 'c', 'd', 'e'];
  
  const counts = {};
  options.forEach(opt => counts[opt] = 0);
  
  for (let i = 0; i < 500; i++) {
    const choice = rand.choice(options);
    this.assert(options.includes(choice), 'Choice should be from the array');
    counts[choice]++;
  }
  
  // すべての選択肢が選ばれる
  options.forEach(opt => {
    this.assert(counts[opt] > 0, `Option ${opt} should be chosen at least once`);
  });
});

runner.test('sample()の重複なし', function() {
  const rand = new SeedableRandom(222);
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  const sample = rand.sample(arr, 5);
  
  this.assert(sample.length === 5, 'Sample should have 5 elements');
  
  // 重複チェック
  const unique = new Set(sample);
  this.assert(unique.size === 5, 'Sample should have no duplicates');
  
  // すべての要素が元の配列から
  sample.forEach(val => {
    this.assert(arr.includes(val), `Value ${val} should be from original array`);
  });
});

// ===========================================
// 重み付き選択テスト
// ===========================================

runner.test('weightedChoice()の基本動作', function() {
  const rand = new SeedableRandom(333);
  const items = ['A', 'B', 'C'];
  const weights = [10, 5, 1];  // A:B:C = 10:5:1
  
  const counts = { A: 0, B: 0, C: 0 };
  
  for (let i = 0; i < 1600; i++) {
    const choice = rand.weightedChoice(items, weights);
    counts[choice]++;
  }
  
  // 大まかな比率チェック（統計的変動を考慮）
  const ratioAB = counts.A / counts.B;
  const ratioBC = counts.B / counts.C;
  
  this.assert(ratioAB > 1.5 && ratioAB < 2.5, `A:B ratio should be ~2 (got ${ratioAB})`);
  this.assert(ratioBC > 3 && ratioBC < 7, `B:C ratio should be ~5 (got ${ratioBC})`);
});

runner.test('weightedChoice()のエッジケース', function() {
  const rand = new SeedableRandom();
  
  // ゼロ重みのテスト
  const items = ['A', 'B', 'C'];
  const weights = [0, 10, 0];
  
  for (let i = 0; i < 10; i++) {
    const choice = rand.weightedChoice(items, weights);
    this.assert(choice === 'B', 'Should always choose B with zero weights for others');
  }
});

// ===========================================
// 分布テスト
// ===========================================

runner.test('gaussian()の平均と標準偏差', function() {
  const rand = new SeedableRandom(444);
  const mean = 100;
  const stdDev = 15;
  
  const values = [];
  for (let i = 0; i < 1000; i++) {
    values.push(rand.gaussian(mean, stdDev));
  }
  
  // サンプル平均
  const sampleMean = values.reduce((a, b) => a + b, 0) / values.length;
  this.assertClose(sampleMean, mean, 1.5, 'Sample mean should be close to expected');
  
  // サンプル標準偏差
  const variance = values.reduce((sum, val) => {
    return sum + Math.pow(val - sampleMean, 2);
  }, 0) / values.length;
  const sampleStdDev = Math.sqrt(variance);
  
  this.assertClose(sampleStdDev, stdDev, 2, 'Sample std dev should be close to expected');
});

runner.test('exponential()の分布', function() {
  const rand = new SeedableRandom(555);
  const lambda = 2;
  
  const values = [];
  for (let i = 0; i < 1000; i++) {
    values.push(rand.exponential(lambda));
  }
  
  // すべて正の値
  values.forEach(val => {
    this.assert(val > 0, 'Exponential values should be positive');
  });
  
  // 理論的な平均は1/lambda
  const expectedMean = 1 / lambda;
  const sampleMean = values.reduce((a, b) => a + b, 0) / values.length;
  
  this.assertClose(sampleMean, expectedMean, 0.05, 'Sample mean should match theoretical');
});

// ===========================================
// 状態管理テスト
// ===========================================

runner.test('getState()とsetState()', function() {
  const rand1 = new SeedableRandom(666);
  
  // いくつか値を生成
  for (let i = 0; i < 5; i++) {
    rand1.next();
  }
  
  // 状態を保存
  const state = rand1.getState();
  
  // さらに値を生成
  const nextValues = [];
  for (let i = 0; i < 3; i++) {
    nextValues.push(rand1.next());
  }
  
  // 新しいインスタンスに状態を復元
  const rand2 = new SeedableRandom();
  rand2.setState(state);
  
  // 同じ値が出るはず
  for (let i = 0; i < 3; i++) {
    const val = rand2.next();
    this.assert(val === nextValues[i], `Restored state should produce same values at ${i}`);
  }
});

runner.test('clone()の独立性', function() {
  const original = new SeedableRandom(777);
  
  // いくつか値を生成
  for (let i = 0; i < 5; i++) {
    original.next();
  }
  
  // クローン作成
  const cloned = original.clone();
  
  // 両方から同じ値が出る
  for (let i = 0; i < 3; i++) {
    const val1 = original.next();
    const val2 = cloned.next();
    this.assert(val1 === val2, `Clone should produce same values at ${i}`);
  }
  
  // 片方を進めても影響しない
  original.next();
  original.next();
  
  const val1 = cloned.next();
  const val2 = original.next();
  this.assert(val1 !== val2, 'Clone should be independent after divergence');
});

// ===========================================
// RandomnessManagerテスト
// ===========================================

runner.test('RandomnessManagerのモード管理', function() {
  const manager = new RandomnessManager();
  
  const gen1 = manager.getGenerator('deterministic');
  const gen2 = manager.getGenerator('deterministic');
  
  // 同じインスタンスを返す
  this.assert(gen1 === gen2, 'Should return same instance for same mode');
  
  const gen3 = manager.getGenerator('testing');
  this.assert(gen1 !== gen3, 'Different modes should have different instances');
});

runner.test('RandomnessManagerのリセット', function() {
  const manager = new RandomnessManager();
  
  const gen1 = manager.getGenerator('deterministic');
  const val1 = gen1.next();
  
  manager.resetGenerator('deterministic');
  
  const gen2 = manager.getGenerator('deterministic');
  const val2 = gen2.next();
  
  this.assert(gen1 !== gen2, 'Should be different instance after reset');
  this.assert(val1 === val2, 'Should produce same first value after reset');
});

// ===========================================
// エラー処理テスト
// ===========================================

runner.test('無効な入力のエラー処理', function() {
  const rand = new SeedableRandom();
  
  // nextInt with invalid range
  try {
    rand.nextInt(10, 5);
    this.assert(false, 'Should throw for invalid range');
  } catch (e) {
    this.assert(e instanceof RangeError, 'Should throw RangeError');
  }
  
  // choice with empty array
  try {
    rand.choice([]);
    this.assert(false, 'Should throw for empty array');
  } catch (e) {
    this.assert(e instanceof Error, 'Should throw Error');
  }
  
  // sample with oversized count
  try {
    rand.sample([1, 2, 3], 5);
    this.assert(false, 'Should throw for oversized sample');
  } catch (e) {
    this.assert(e instanceof RangeError, 'Should throw RangeError');
  }
  
  // weightedChoice with mismatched lengths
  try {
    rand.weightedChoice(['A', 'B'], [1]);
    this.assert(false, 'Should throw for mismatched lengths');
  } catch (e) {
    this.assert(e instanceof Error, 'Should throw Error');
  }
});

// テスト実行
runner.run().then(success => {
  if (typeof process !== 'undefined') {
    process.exit(success ? 0 : 1);
  }
});