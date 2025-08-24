#!/usr/bin/env node
/**
 * T02.1: 8宮マッピング自動検出・修正ツール
 * 重複検出、不足抽出、CI破壊（未解決時exit 1）
 */

const fs = require('fs');
const path = require('path');

const EIGHT_PALACES_PATH = path.join(__dirname, '../public/assets/eight_palaces.v1.json');

class EightPalacesFixer {
    constructor() {
        this.data = null;
        this.errors = [];
        this.warnings = [];
    }

    loadData() {
        try {
            if (!fs.existsSync(EIGHT_PALACES_PATH)) {
                throw new Error(`File not found: ${EIGHT_PALACES_PATH}`);
            }
            
            const content = fs.readFileSync(EIGHT_PALACES_PATH, 'utf8');
            this.data = JSON.parse(content);
            console.log('✅ Loaded eight_palaces.v1.json');
        } catch (error) {
            console.error('❌ Failed to load eight_palaces.v1.json:', error.message);
            process.exit(1);
        }
    }

    validateStructure() {
        if (!this.data.palaces || typeof this.data.palaces !== 'object') {
            this.errors.push('Missing or invalid "palaces" object');
            return false;
        }

        const palaceNames = Object.keys(this.data.palaces);
        if (palaceNames.length !== 8) {
            this.errors.push(`Expected 8 palaces, found ${palaceNames.length}`);
        }

        for (const [name, palace] of Object.entries(this.data.palaces)) {
            if (!palace.hexagrams || !Array.isArray(palace.hexagrams)) {
                this.errors.push(`Palace "${name}" missing hexagrams array`);
                continue;
            }

            if (palace.hexagrams.length !== 8) {
                this.errors.push(`Palace "${name}" has ${palace.hexagrams.length} hexagrams, expected 8`);
            }

            // Check hexagram number validity (1-64)
            for (const hex of palace.hexagrams) {
                if (!Number.isInteger(hex) || hex < 1 || hex > 64) {
                    this.errors.push(`Palace "${name}" contains invalid hexagram: ${hex}`);
                }
            }

            // Check for duplicates within palace
            const uniqueInPalace = new Set(palace.hexagrams);
            if (uniqueInPalace.size !== palace.hexagrams.length) {
                this.errors.push(`Palace "${name}" contains duplicate hexagrams`);
            }
        }

        return this.errors.length === 0;
    }

    analyzeHexagramCoverage() {
        const seen = new Map();
        const duplicates = [];
        const allHexagrams = new Set();

        // Collect all hexagrams and detect duplicates
        for (const [palaceName, palace] of Object.entries(this.data.palaces)) {
            if (!palace.hexagrams) continue;

            for (const hex of palace.hexagrams) {
                if (seen.has(hex)) {
                    duplicates.push({
                        hexagram: hex,
                        palaceA: seen.get(hex),
                        palaceB: palaceName
                    });
                } else {
                    seen.set(hex, palaceName);
                }
                allHexagrams.add(hex);
            }
        }

        // Find missing hexagrams (1-64)
        const expectedHexagrams = Array.from({length: 64}, (_, i) => i + 1);
        const missing = expectedHexagrams.filter(hex => !allHexagrams.has(hex));

        return {
            total: allHexagrams.size,
            duplicates,
            missing,
            complete: missing.length === 0 && duplicates.length === 0,
            coverage: allHexagrams
        };
    }

    generateFixTemplate(analysis) {
        const template = {
            timestamp: new Date().toISOString(),
            analysis: {
                totalUnique: analysis.total,
                duplicateCount: analysis.duplicates.length,
                missingCount: analysis.missing.length,
                isComplete: analysis.complete
            },
            duplicates: analysis.duplicates,
            missing: analysis.missing,
            manualFixRequired: true,
            instructions: [
                "1. Review the duplicates list below",
                "2. Decide which palace each duplicate hexagram should belong to",
                "3. Manually edit eight_palaces.v1.json",
                "4. Run this tool again to verify",
                "5. Repeat until all issues are resolved"
            ]
        };

        const templatePath = path.join(__dirname, '../eight-palaces-fix-template.json');
        fs.writeFileSync(templatePath, JSON.stringify(template, null, 2));
        console.log(`📋 Fix template saved to: ${templatePath}`);
    }

    displayResults(analysis) {
        console.log('\n📊 Eight Palaces Analysis Results:');
        console.log(`   Total Unique Hexagrams: ${analysis.total}/64`);
        console.log(`   Complete Coverage: ${analysis.complete ? '✅' : '❌'}`);

        if (analysis.duplicates.length > 0) {
            console.log('\n❌ Duplicate Hexagrams Found:');
            analysis.duplicates.forEach(dup => {
                console.log(`   Hexagram ${dup.hexagram}: "${dup.palaceA}" vs "${dup.palaceB}"`);
            });
        }

        if (analysis.missing.length > 0) {
            console.log('\n❌ Missing Hexagrams:');
            console.log(`   ${analysis.missing.join(', ')}`);
        }

        if (this.errors.length > 0) {
            console.log('\n❌ Structural Errors:');
            this.errors.forEach(error => console.log(`   ${error}`));
        }

        if (this.warnings.length > 0) {
            console.log('\n⚠️ Warnings:');
            this.warnings.forEach(warning => console.log(`   ${warning}`));
        }
    }

    run() {
        console.log('🔍 Eight Palaces Fixer - Starting Analysis...\n');

        this.loadData();
        
        const structureValid = this.validateStructure();
        if (!structureValid) {
            console.log('\n❌ Structure validation failed');
            this.displayResults({ total: 0, duplicates: [], missing: [], complete: false });
            return false;
        }

        const analysis = this.analyzeHexagramCoverage();
        this.displayResults(analysis);

        if (!analysis.complete || this.errors.length > 0) {
            this.generateFixTemplate(analysis);
            console.log('\n❌ Issues found. Manual fixing required.');
            console.log('   1. Check the generated fix template');
            console.log('   2. Edit eight_palaces.v1.json manually');
            console.log('   3. Run this tool again');
            return false;
        } else {
            console.log('\n✅ Eight Palaces coverage is perfect!');
            console.log('   All 64 hexagrams are uniquely assigned to palaces.');
            
            // Mark as verified
            this.data.metadata.verified = true;
            this.data.metadata.verifiedAt = new Date().toISOString();
            fs.writeFileSync(EIGHT_PALACES_PATH, JSON.stringify(this.data, null, 2));
            
            return true;
        }
    }
}

// CLI execution
if (require.main === module) {
    const fixer = new EightPalacesFixer();
    const success = fixer.run();
    process.exit(success ? 0 : 1);
}

module.exports = { EightPalacesFixer };