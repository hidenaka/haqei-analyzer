#!/usr/bin/env node
/**
 * 監査可能ベンチマークスクリプト
 * v4.3.1 - 環境固定・実行レシピ・分位点対応
 * 
 * Medium修正: 非監査的な性能主張の修正
 */

import { performance } from 'node:perf_hooks';
import { SeedableRandom } from '../public/js/core/SeedableRandom.js';
import os from 'node:os';

console.log('🚀 Auditable Benchmark System\n');

// 環境情報の記録
const env = {
  node: process.version,
  platform: os.platform(),
  arch: os.arch(),
  cpu: os.cpus()[0].model,
  memory: `${Math.round(os.totalmem() / 1024 / 1024 / 1024)}GB`,
  timestamp: new Date().toISOString(),
  warmupIterations: 1000,
  measureIterations: 10000
};

console.log('🖥️  Environment Information:');
Object.entries(env).forEach(([key, value]) => {
  console.log(`   ${key}: ${value}`);
});
console.log();

// 統計計算ユーティリティ
const calculateStats = (times) => {
  const sorted = [...times].sort((a, b) => a - b);
  const n = sorted.length;
  
  return {
    min: sorted[0],
    max: sorted[n - 1],
    mean: times.reduce((a, b) => a + b) / n,
    median: n % 2 === 0 ? (sorted[n/2 - 1] + sorted[n/2]) / 2 : sorted[Math.floor(n/2)],
    p95: sorted[Math.floor(n * 0.95)],
    p99: sorted[Math.floor(n * 0.99)],
    stddev: Math.sqrt(times.reduce((sum, x) => sum + Math.pow(x - times.reduce((a, b) => a + b) / n, 2), 0) / n)
  };
};

// 監査可能ベンチマーク関数
const benchmarkFunction = (fn, name, iterations = env.measureIterations) => {
  console.log(`📊 Benchmarking: ${name}`);
  
  // Warm-up phase
  console.log(`   Warming up (${env.warmupIterations} iterations)...`);
  for (let i = 0; i < env.warmupIterations; i++) {
    fn();
  }
  
  // 実測定 - 複数回実行して分布を取得
  console.log(`   Measuring (${iterations} iterations)...`);
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    const end = performance.now();
    times.push(end - start);
  }
  
  const stats = calculateStats(times);
  
  console.log(`   Results (μs per operation):`);
  console.log(`     Mean: ${(stats.mean * 1000).toFixed(3)} μs`);
  console.log(`     Median: ${(stats.median * 1000).toFixed(3)} μs`);
  console.log(`     95th percentile: ${(stats.p95 * 1000).toFixed(3)} μs`);
  console.log(`     99th percentile: ${(stats.p99 * 1000).toFixed(3)} μs`);
  console.log(`     Standard deviation: ${(stats.stddev * 1000).toFixed(3)} μs`);
  console.log(`     Operations/sec: ${(1000 / stats.mean).toFixed(0)}`);
  console.log();
  
  return { name, stats, iterations };
};

// SeedableRandom決定論テスト
console.log('🎲 SeedableRandom Deterministic Verification:');

const rng1 = new SeedableRandom(12345);
const rng2 = new SeedableRandom(12345);

const sequence1 = Array.from({length: 10}, () => rng1.next());
const sequence2 = Array.from({length: 10}, () => rng2.next());

const isIdentical = sequence1.every((val, idx) => val === sequence2[idx]);
console.log(`   Deterministic behavior: ${isIdentical ? '✅ VERIFIED' : '❌ FAILED'}`);
console.log(`   First 5 values: [${sequence1.slice(0, 5).map(v => v.toFixed(6)).join(', ')}]`);
console.log();

// ベンチマーク実行
console.log('📈 Performance Benchmarks:');

const rng = new SeedableRandom(42);

const results = [
  benchmarkFunction(() => rng.next(), 'SeedableRandom.next()', 50000),
  benchmarkFunction(() => rng.nextInt(1, 100), 'SeedableRandom.nextInt(1,100)', 20000),
  benchmarkFunction(() => rng.nextFloat(0, 1), 'SeedableRandom.nextFloat(0,1)', 20000),
  benchmarkFunction(() => {
    const arr = [1, 2, 3, 4, 5];
    rng.shuffle(arr);
    return arr;
  }, 'SeedableRandom.shuffle([1,2,3,4,5])', 5000)
];

// サマリーレポート
console.log('📋 Benchmark Summary:');
console.log('=' .repeat(80));
console.log('Operation'.padEnd(35) + 'Mean (μs)'.padEnd(12) + 'P95 (μs)'.padEnd(12) + 'Ops/sec');
console.log('-' .repeat(80));

results.forEach(result => {
  const { name, stats } = result;
  console.log(
    name.padEnd(35) + 
    (stats.mean * 1000).toFixed(1).padEnd(12) + 
    (stats.p95 * 1000).toFixed(1).padEnd(12) + 
    (1000 / stats.mean).toFixed(0)
  );
});

console.log('=' .repeat(80));

// 品質評価
const overallMean = results.reduce((sum, r) => sum + r.stats.mean, 0) / results.length;
console.log(`\n🏆 Performance Assessment:`);
console.log(`   Overall mean latency: ${(overallMean * 1000).toFixed(2)} μs`);
console.log(`   Performance grade: ${overallMean < 0.01 ? 'A+' : overallMean < 0.1 ? 'A' : overallMean < 1 ? 'B' : 'C'}`);

// 注意事項
console.log(`\n⚠️  Important Notes:`);
console.log(`   - Results are environment-specific`);
console.log(`   - SeedableRandom is optimized for determinism, not cryptographic strength`);
console.log(`   - LCG does not pass advanced statistical tests (by design)`);
console.log(`   - Use case: Reproducible simulations and testing`);

console.log(`\n✅ Benchmark completed successfully`);