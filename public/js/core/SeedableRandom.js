/**
 * SeedableRandom - 決定論的疑似乱数生成器
 * v4.3.0 - this.rng.next()の完全代替
 * 
 * @module SeedableRandom
 * @description Linear Congruential Generator (LCG)による完全な決定論的動作を保証
 */

/**
 * シード可能な乱数生成器
 * @class
 */
class SeedableRandom {
  /**
   * @param {number} [seed=12345] - 初期シード値
   */
  constructor(seed = 12345) {
    this.seed = seed;
    this.current = seed;
    
    // LCGパラメータ（Numerical Recipes推奨値）
    this.a = 1664525;
    this.c = 1013904223;
    this.m = Math.pow(2, 32);
  }
  
  /**
   * 次の疑似乱数を生成（0-1の範囲）
   * @returns {number} 0以上1未満の乱数
   */
  next() {
    this.current = (this.a * this.current + this.c) % this.m;
    return this.current / this.m;
  }
  
  /**
   * 範囲指定の整数乱数を生成
   * @param {number} min - 最小値（含む）
   * @param {number} max - 最大値（含む）
   * @returns {number} min以上max以下の整数
   */
  nextInt(min, max) {
    if (min > max) {
      throw new RangeError(`min (${min}) must be <= max (${max})`);
    }
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  
  /**
   * 範囲指定の浮動小数点乱数を生成
   * @param {number} min - 最小値
   * @param {number} max - 最大値
   * @returns {number} min以上max未満の浮動小数点数
   */
  nextFloat(min, max) {
    if (min > max) {
      throw new RangeError(`min (${min}) must be <= max (${max})`);
    }
    return this.next() * (max - min) + min;
  }
  
  /**
   * ブール値をランダムに生成
   * @param {number} [probability=0.5] - trueになる確率（0-1）
   * @returns {boolean}
   */
  nextBoolean(probability = 0.5) {
    return this.next() < probability;
  }
  
  /**
   * 配列から要素をランダムに選択
   * @template T
   * @param {T[]} array - 選択元の配列
   * @returns {T} ランダムに選択された要素
   */
  choice(array) {
    if (!Array.isArray(array) || array.length === 0) {
      throw new Error('Array must be non-empty');
    }
    return array[this.nextInt(0, array.length - 1)];
  }
  
  /**
   * 配列から複数要素をランダムに選択（重複なし）
   * @template T
   * @param {T[]} array - 選択元の配列
   * @param {number} count - 選択する要素数
   * @returns {T[]} ランダムに選択された要素の配列
   */
  sample(array, count) {
    if (!Array.isArray(array) || array.length === 0) {
      throw new Error('Array must be non-empty');
    }
    if (count > array.length) {
      throw new RangeError('Sample size cannot be larger than array length');
    }
    
    const shuffled = this.shuffle([...array]);
    return shuffled.slice(0, count);
  }
  
  /**
   * 配列をシャッフル（Fisher-Yatesアルゴリズム）
   * @template T
   * @param {T[]} array - シャッフルする配列
   * @returns {T[]} シャッフルされた新しい配列
   */
  shuffle(array) {
    const shuffled = [...array];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
  }
  
  /**
   * 重み付き選択
   * @template T
   * @param {T[]} items - 選択肢の配列
   * @param {number[]} weights - 各選択肢の重み
   * @returns {T} 重みに基づいて選択された要素
   */
  weightedChoice(items, weights) {
    if (!Array.isArray(items) || !Array.isArray(weights)) {
      throw new TypeError('Both items and weights must be arrays');
    }
    
    if (items.length !== weights.length) {
      throw new Error('Items and weights must have the same length');
    }
    
    if (items.length === 0) {
      throw new Error('Arrays must be non-empty');
    }
    
    const total = weights.reduce((sum, w) => {
      if (w < 0) throw new Error('Weights must be non-negative');
      return sum + w;
    }, 0);
    
    if (total === 0) {
      throw new Error('Total weight must be positive');
    }
    
    let threshold = this.next() * total;
    
    for (let i = 0; i < items.length; i++) {
      threshold -= weights[i];
      if (threshold <= 0) {
        return items[i];
      }
    }
    
    // フォールバック（浮動小数点誤差対策）
    return items[items.length - 1];
  }
  
  /**
   * 正規分布乱数生成（Box-Muller変換）
   * @param {number} [mean=0] - 平均値
   * @param {number} [stdDev=1] - 標準偏差
   * @returns {number} 正規分布に従う乱数
   */
  gaussian(mean = 0, stdDev = 1) {
    // Box-Muller変換
    const u1 = this.next();
    const u2 = this.next();
    
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    
    return z0 * stdDev + mean;
  }
  
  /**
   * 指数分布乱数生成
   * @param {number} [lambda=1] - レート パラメータ
   * @returns {number} 指数分布に従う乱数
   */
  exponential(lambda = 1) {
    if (lambda <= 0) {
      throw new RangeError('Lambda must be positive');
    }
    return -Math.log(1 - this.next()) / lambda;
  }
  
  /**
   * シードをリセット
   */
  reset() {
    this.current = this.seed;
  }
  
  /**
   * 新しいシードを設定
   * @param {number} newSeed - 新しいシード値
   */
  setSeed(newSeed) {
    this.seed = newSeed;
    this.current = newSeed;
  }
  
  /**
   * 現在の内部状態を取得
   * @returns {{seed: number, current: number}}
   */
  getState() {
    return {
      seed: this.seed,
      current: this.current
    };
  }
  
  /**
   * 内部状態を復元
   * @param {{seed: number, current: number}} state - 復元する状態
   */
  setState(state) {
    this.seed = state.seed;
    this.current = state.current;
  }
  
  /**
   * クローンを作成
   * @returns {SeedableRandom} 同じ状態の新しいインスタンス
   */
  clone() {
    const cloned = new SeedableRandom(this.seed);
    cloned.current = this.current;
    return cloned;
  }
}

/**
 * グローバル乱数マネージャー
 * @class
 */
class RandomnessManager {
  constructor() {
    /**
     * モード別の乱数生成器を管理
     * @type {Map<string, SeedableRandom>}
     * @private
     */
    this.generators = new Map();
    
    /**
     * デフォルトシード値のマップ
     * @type {Object<string, number>}
     * @private
     */
    this.defaultSeeds = {
      deterministic: 12345,
      testing: 67890,
      production: null  // 実行時に生成
    };
  }
  
  /**
   * 乱数生成器を取得または作成
   * @param {string} [mode='deterministic'] - モード（deterministic/testing/exploration/production）
   * @param {number} [seed] - カスタムシード値
   * @returns {SeedableRandom} 乱数生成器インスタンス
   */
  getGenerator(mode = 'deterministic', seed = null) {
    const key = `${mode}_${seed || 'default'}`;
    
    if (!this.generators.has(key)) {
      let actualSeed;
      
      switch (mode) {
        case 'deterministic':
        case 'testing':
          actualSeed = seed || this.defaultSeeds[mode];
          break;
          
        case 'exploration':
        case 'production':
          // 時刻ベースシード（記録する）
          actualSeed = seed || Date.now();
          console.log(`${mode} seed: ${actualSeed}`);
          break;
          
        default:
          console.warn(`Unknown mode: ${mode}, using deterministic`);
          actualSeed = seed || this.defaultSeeds.deterministic;
      }
      
      this.generators.set(key, new SeedableRandom(actualSeed));
    }
    
    return this.generators.get(key);
  }
  
  /**
   * 特定モードの生成器をリセット
   * @param {string} [mode='deterministic'] - リセットするモード
   */
  resetGenerator(mode = 'deterministic') {
    const pattern = new RegExp(`^${mode}_`);
    
    for (const key of this.generators.keys()) {
      if (pattern.test(key)) {
        this.generators.delete(key);
      }
    }
  }
  
  /**
   * すべての生成器をリセット
   */
  resetAll() {
    this.generators.clear();
  }
  
  /**
   * this.rng.next()の使用を検出（開発時）
   * @static
   */
  static detectMathRandom() {
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      const originalRandom = Math.random;
      
      Math.random = function() {
        console.error('⚠️ this.rng.next() detected! Use SeedableRandom instead.');
        console.trace();
        return originalRandom.call(Math);
      };
      
      console.log('🔍 Math.random detection enabled');
    }
  }
  
  /**
   * this.rng.next()をSeedableRandomで置換（テスト用）
   * @param {number} [seed=12345] - シード値
   * @static
   */
  static replaceMathRandom(seed = 12345) {
    const generator = new SeedableRandom(seed);
    
    Math.random = function() {
      return generator.next();
    };
    
    console.log(`🔄 Math.random replaced with SeedableRandom (seed: ${seed})`);
  }
  
  /**
   * this.rng.next()を元に戻す
   * @static
   */
  static restoreMathRandom() {
    // Note: This requires saving the original Math.random
    console.warn('⚠️ Math.random restoration not implemented');
  }
}

// グローバルインスタンス
const randomnessManager = new RandomnessManager();

// グローバルエクスポート
if (typeof window !== 'undefined') {
  window.SeedableRandom = SeedableRandom;
  window.RandomnessManager = RandomnessManager;
  window.randomnessManager = randomnessManager;
}

// グローバル公開
window.SeedableRandom = SeedableRandom;
window.RandomnessManager = RandomnessManager;
window.randomnessManager = randomnessManager;

console.log('✅ SeedableRandom v4.3.0 loaded');