#!/usr/bin/env node
/**
 * HAQEI v4.3.1 決定論性検証スクリプト
 * 最終バンドルでのMath.random完全除去を強制的に確認
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const BANNED_APIS = [
    'Math.random()',
    'crypto.getRandomValues('
];

// テストファイルパターン（除外対象）
const TEST_PATTERNS = [
    /test-.*\.html$/,
    /test-.*\.js$/,
    /\.backup/,
    /auto-answer-test/
];

// セキュリティ関連ファイル（crypto.getRandomValues使用許可）
const SECURITY_PATTERNS = [
    /security\/.*\.js$/,
    /CSRFProtectionSystem\.js$/,
    /SecurityHeaderManager\.js$/
];

class DeterminismVerifier {
    constructor() {
        this.violations = [];
        this.checkedFiles = 0;
        this.excludedFiles = 0;
    }

    async verify() {
        console.log('🔍 HAQEI v4.3.1 決定論性検証開始');
        console.log(`対象ディレクトリ: ${DIST_DIR}`);
        
        if (!fs.existsSync(DIST_DIR)) {
            console.error(`❌ dist ディレクトリが見つかりません: ${DIST_DIR}`);
            console.error('npm run build を実行してください');
            process.exit(1);
        }

        await this.scanDirectory(DIST_DIR);
        return this.generateReport();
    }

    async scanDirectory(dirPath) {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            
            if (entry.isDirectory()) {
                await this.scanDirectory(fullPath);
            } else if (entry.isFile()) {
                await this.checkFile(fullPath);
            }
        }
    }

    async checkFile(filePath) {
        const relativePath = path.relative(DIST_DIR, filePath);
        
        // テストファイル除外判定
        if (this.isTestFile(relativePath)) {
            this.excludedFiles++;
            console.log(`⏭️  除外: ${relativePath} (テストファイル)`);
            return;
        }

        // 対象拡張子のみチェック
        const ext = path.extname(filePath).toLowerCase();
        if (!['.html', '.js', '.ts', '.jsx', '.tsx'].includes(ext)) {
            return;
        }

        this.checkedFiles++;
        
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            await this.scanContent(relativePath, content);
        } catch (error) {
            console.warn(`⚠️  ファイル読み込みエラー: ${relativePath} - ${error.message}`);
        }
    }

    isTestFile(relativePath) {
        return TEST_PATTERNS.some(pattern => pattern.test(relativePath));
    }

    async scanContent(relativePath, content) {
        const lines = content.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineNumber = i + 1;
            
            for (const bannedAPI of BANNED_APIS) {
                if (line.includes(bannedAPI)) {
                    // SeedableRandom.js内の参照は除外（実装コードのため）
                    if (relativePath.includes('SeedableRandom.js') && 
                        (line.includes('originalRandom') || line.includes('Math.random = function'))) {
                        continue;
                    }
                    
                    // セキュリティファイルでのcrypto.getRandomValues使用は許可
                    if (bannedAPI.includes('crypto.getRandomValues') && 
                        this.isSecurityFile(relativePath)) {
                        console.log(`🔐 許可: ${relativePath}:${lineNumber} (セキュリティコンテキスト)`);
                        continue;
                    }
                    
                    this.violations.push({
                        file: relativePath,
                        line: lineNumber,
                        api: bannedAPI,
                        content: line.trim(),
                        severity: 'error'
                    });
                }
            }
        }
    }

    isSecurityFile(relativePath) {
        return SECURITY_PATTERNS.some(pattern => pattern.test(relativePath));
    }

    generateReport() {
        console.log('\n📊 検証結果');
        console.log(`チェック対象ファイル: ${this.checkedFiles}`);
        console.log(`除外ファイル: ${this.excludedFiles}`);
        console.log(`違反件数: ${this.violations.length}`);

        if (this.violations.length === 0) {
            console.log('\n✅ SUCCESS: 禁止API使用なし');
            console.log('🚀 決定論性要件を満たしています');
            return true;
        }

        console.log('\n❌ FAILED: 禁止API使用を検出');
        console.log('\n詳細:');
        
        this.violations.forEach((violation, index) => {
            console.log(`\n${index + 1}. ${violation.file}:${violation.line}`);
            console.log(`   API: ${violation.api}`);
            console.log(`   内容: ${violation.content}`);
        });

        console.log('\n🔧 修正方法:');
        console.log('1. Math.random() → SeedableRandom.next() または nextInt()');
        console.log('2. crypto.getRandomValues() → 決定論的代替案');
        console.log('3. テストファイルの場合は除外パターンに追加');

        return false;
    }
}

// 実行
async function main() {
    const verifier = new DeterminismVerifier();
    const success = await verifier.verify();
    
    console.log(`\n🎯 最終判定: ${success ? 'PASS' : 'FAIL'}`);
    process.exit(success ? 0 : 1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export default DeterminismVerifier;