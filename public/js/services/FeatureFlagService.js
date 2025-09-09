class FeatureFlagService {
    constructor() {
        const rng = window.seedableRandom || { next: () => 0.5 };
        this.flags = {
            'ab_test_variant': rng.next() < 0.5 ? 'A' : 'B'
        };
    }
    
    getFlag(flagName) {
        return this.flags[flagName];
    }
    
    isEnabled(flagName) {
        return !!this.flags[flagName];
    }
    
    getVariant(flagName) {
        return this.flags[flagName];
    }
}

export const featureFlag = new FeatureFlagService();