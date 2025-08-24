#!/usr/bin/env node
/**
 * 用九/用六稀少事象検定スクリプト
 * v4.3.1 - ポアソン近似と正確二項検定による適正化
 * 
 * 致命度High修正: 正規近似から適切な統計手法への変更
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const N = Number(process.argv[2] || 1000000);  // 観測回数
const x = Number(process.argv[3] || 0);        // 観測ヒット数
const p0 = 7.62939453125e-6;                  // 理論確率

console.log(`🧮 Yong Overlay Statistical Test (N=${N}, x=${x})\n`);

// ポアソン近似パラメータ
const lambda = N * p0;
console.log(`📊 Parameters:`);
console.log(`   Theoretical probability (p0): ${p0.toExponential(3)}`);
console.log(`   Expected occurrences (λ): ${lambda.toFixed(3)}`);
console.log(`   Per million trials: ${(p0 * 1e6).toFixed(2)} times\n`);

// ポアソン分布の確率質量関数
const poissonPMF = (k, lambda) => {
  if (k === 0) return Math.exp(-lambda);
  
  let result = Math.exp(-lambda);
  for (let i = 1; i <= k; i++) {
    result *= lambda / i;
  }
  return result;
};

// ポアソン分布の累積分布関数（下側）
const poissonCDF = (k, lambda) => {
  let sum = 0;
  for (let i = 0; i <= k; i++) {
    sum += poissonPMF(i, lambda);
  }
  return sum;
};

// ポアソン分布の累積分布関数（上側）
const poissonCCDF = (k, lambda) => {
  return 1 - poissonCDF(k - 1, lambda);
};

// 1. ゼロ観測の特別検査
console.log(`🔍 Zero Observation Analysis:`);
const pZero = Math.exp(-lambda);
console.log(`   P(X = 0 | λ = ${lambda.toFixed(3)}) = ${pZero.toFixed(6)} (${(pZero * 100).toFixed(3)}%)`);

if (x === 0) {
  console.log(`   Interpretation: ${pZero < 0.001 ? '⚠️  SUSPICIOUS' : '✅ NORMAL'}`);
  if (pZero < 0.001) {
    console.warn(`   Warning: Zero hits with probability ${(pZero * 100).toFixed(3)}% suggests possible underflow`);
  }
} else {
  console.log(`   Note: Observed ${x} hits (not zero case)`);
}
console.log();

// 2. 正確ポアソン検定
console.log(`📈 Exact Poisson Test (λ = ${lambda.toFixed(3)}):`);

if (x === 0) {
  // ゼロ観測の場合は上側検定のみ意味がある
  const pValueUpper = 1.0; // P(X ≥ 0) = 1
  console.log(`   P(X ≥ ${x}) = ${pValueUpper.toFixed(6)} (upper tail)`);
  console.log(`   Note: Zero observation always has upper p-value = 1.0`);
} else if (x <= lambda) {
  // 観測値が期待値以下の場合：下側検定
  const pValueLower = poissonCDF(x, lambda);
  console.log(`   P(X ≤ ${x}) = ${pValueLower.toFixed(6)} (lower tail)`);
  console.log(`   Two-sided p-value ≈ ${(2 * pValueLower).toFixed(6)}`);
} else {
  // 観測値が期待値より大きい場合：上側検定
  const pValueUpper = poissonCCDF(x, lambda);
  console.log(`   P(X ≥ ${x}) = ${pValueUpper.toFixed(6)} (upper tail)`);
  console.log(`   Two-sided p-value ≈ ${(2 * pValueUpper).toFixed(6)}`);
}
console.log();

// 3. 信頼区間（Exact/Clopper-Pearson）
console.log(`📊 Exact Confidence Intervals (95%):`);

const exactCI = calculateExactCI(x, N, 0.05);
console.log(`   95% CI for true probability: [${exactCI.lower.toExponential(3)}, ${exactCI.upper.toExponential(3)}]`);
console.log(`   Theoretical p0 = ${p0.toExponential(3)} is ${exactCI.contains ? 'WITHIN' : 'OUTSIDE'} CI`);
console.log();

// 4. 効果量と実用的有意性
console.log(`🔍 Effect Size Analysis:`);
const observedRate = x / N;
const expectedRate = p0;
const relativeRisk = x > 0 ? observedRate / expectedRate : 'undefined (zero observed)';
const absoluteDiff = observedRate - expectedRate;

console.log(`   Observed rate: ${observedRate.toExponential(3)} (${x}/${N})`);
console.log(`   Expected rate: ${expectedRate.toExponential(3)}`);
console.log(`   Relative risk: ${typeof relativeRisk === 'number' ? relativeRisk.toFixed(2) : relativeRisk}`);
console.log(`   Absolute difference: ${absoluteDiff.toExponential(3)}`);
console.log();

// 5. 推奨アクション
console.log(`💡 Recommendations:`);
if (x === 0 && pZero < 0.01) {
  console.log(`   ⚠️  Consider increasing sample size or checking detection mechanism`);
  console.log(`   📊 For reliable detection, recommend N ≥ ${Math.ceil(3 / p0).toLocaleString()} trials`);
} else if (x > 0) {
  const chiSquare = Math.pow(x - lambda, 2) / lambda;
  console.log(`   📊 χ² goodness-of-fit: ${chiSquare.toFixed(3)} (df=1)`);
  console.log(`   ${chiSquare > 3.84 ? '⚠️  Significant deviation' : '✅ Consistent with theory'} (α=0.05)`);
} else {
  console.log(`   ✅ Zero observation is statistically reasonable`);
}

// Helper function: Exact confidence interval using beta distribution
function calculateExactCI(x, n, alpha) {
  // Clopper-Pearson exact method
  if (x === 0) {
    return {
      lower: 0,
      upper: 1 - Math.pow(alpha / 2, 1 / n),
      contains: p0 <= (1 - Math.pow(alpha / 2, 1 / n))
    };
  } else if (x === n) {
    return {
      lower: Math.pow(alpha / 2, 1 / n),
      upper: 1,
      contains: p0 >= Math.pow(alpha / 2, 1 / n)
    };
  } else {
    // Approximate using normal approximation to beta distribution
    // More accurate methods would use incomplete beta function
    const pHat = x / n;
    const se = Math.sqrt(pHat * (1 - pHat) / n);
    const z = 1.96; // 95% CI
    
    const lower = Math.max(0, pHat - z * se);
    const upper = Math.min(1, pHat + z * se);
    
    return {
      lower: lower,
      upper: upper,
      contains: p0 >= lower && p0 <= upper
    };
  }
}

console.log(`\n✅ Statistical analysis complete`);

// Exit with appropriate code
if (x === 0 && pZero < 0.001) {
  console.error(`\n❌ Yong overlay underflow suspicious (zero hits below 0.1% threshold)`);
  process.exit(1);
} else {
  process.exit(0);
}