/**
 * SeedableRandom Bridge v2 - P0-2 Root Cause Resolution
 * Immediate fallback + async enhancement pattern
 */

console.log('[HAQEI][P0-2] Initializing improved SeedableRandom bridge...');

// STEP 1: Immediate fallback setup (synchronous)
// This prevents "RandomnessManager required" errors during script loading
class FallbackRandomnessManager {
    constructor() {
        this.fallback = true;
        console.log('[HAQEI][P0-2] ⚠️ Using fallback RandomnessManager');
    }
    
    getGenerator(type = 'default') {
        // 決定論的フォールバック実装（Math.random使用禁止）
        let counter = 0;
        return {
            next: () => {
                counter++;
                return (counter * 0.618033988749) % 1; // 黄金比ベース
            },
            nextInt: (min, max) => {
                counter++;
                const val = (counter * 0.618033988749) % 1;
                return Math.floor(val * (max - min + 1)) + min;
            },
            seed: 12345,
            fallback: true
        };
    }
    
    getState() { return { fallback: true }; }
    setState(state) { /* noop */ }
}

// Set fallback globals IMMEDIATELY
window.randomnessManager = new FallbackRandomnessManager();
window.RandomnessManager = FallbackRandomnessManager;

// STEP 2: Async enhancement (replace fallback with real implementation)
(async function enhanceBridge() {
    try {
        console.log('[HAQEI][P0-2] Attempting SeedableRandom ES6 module import...');
        
        // Dynamic import of the ES6 module
        const moduleResult = await import('./SeedableRandom.js');
        const { SeedableRandom, RandomnessManager, randomnessManager } = moduleResult;
        
        // Verify import success
        if (!SeedableRandom || !RandomnessManager || !randomnessManager) {
            throw new Error('Incomplete module import: missing exports');
        }
        
        // Replace fallback with real implementation
        window.SeedableRandom = SeedableRandom;
        window.RandomnessManager = RandomnessManager;
        window.randomnessManager = randomnessManager;
        
        console.log('[HAQEI][P0-2] ✅ Real SeedableRandom loaded, fallback replaced');
        console.log(`[HAQEI][P0-2] RandomnessManager type: ${randomnessManager.constructor.name}`);
        
        // Notify waiting components
        window.dispatchEvent(new CustomEvent('RandomnessManagerReady', {
            detail: { 
                randomnessManager, 
                SeedableRandom, 
                RandomnessManager,
                enhanced: true
            }
        }));
        
    } catch (error) {
        console.warn('[HAQEI][P0-2] ⚠️ ES6 module enhancement failed, keeping fallback:', error.message);
        
        // Enhance fallback with better randomness if needed
        if (!window.randomnessManager.enhanced) {
            window.randomnessManager.enhanced = false;
            window.randomnessManager.error = error.message;
        }
        
        // Still notify, so waiting components don't hang
        window.dispatchEvent(new CustomEvent('RandomnessManagerReady', {
            detail: { 
                randomnessManager: window.randomnessManager,
                enhanced: false,
                error: error.message
            }
        }));
    }
})();

console.log('[HAQEI][P0-2] Bridge initialization complete (fallback active)');