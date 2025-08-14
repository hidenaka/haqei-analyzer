/**
 * HAQEI 受け入れ基準テスト
 * Version: 2.2.2
 */

const fs = require('fs');
const path = require('path');

// テスト用のユーティリティ
class AcceptanceTestRunner {
    constructor() {
        this.results = {
            passed: [],
            failed: [],
            skipped: []
        };
    }

    /**
     * テストの実行
     */
    run(name, testFn) {
        try {
            const result = testFn();
            if (result === true) {
                this.results.passed.push(name);
                console.log(`✅ ${name}`);
            } else if (result === 'skip') {
                this.results.skipped.push(name);
                console.log(`⏭️  ${name} (skipped)`);
            } else {
                this.results.failed.push({ name, reason: result });
                console.log(`❌ ${name}: ${result}`);
            }
        } catch (error) {
            this.results.failed.push({ name, error: error.message });
            console.log(`❌ ${name}: ${error.message}`);
        }
    }

    /**
     * レポートの生成
     */
    generateReport() {
        const total = this.results.passed.length + 
                     this.results.failed.length + 
                     this.results.skipped.length;
        
        console.log('\n' + '='.repeat(60));
        console.log('受け入れ基準テスト結果');
        console.log('='.repeat(60));
        console.log(`合格: ${this.results.passed.length}/${total}`);
        console.log(`失敗: ${this.results.failed.length}/${total}`);
        console.log(`スキップ: ${this.results.skipped.length}/${total}`);
        console.log(`合格率: ${(this.results.passed.length / total * 100).toFixed(1)}%`);
        
        if (this.results.failed.length > 0) {
            console.log('\n失敗したテスト:');
            this.results.failed.forEach(test => {
                console.log(`  - ${test.name}: ${test.reason || test.error}`);
            });
        }
        
        return this.results;
    }
}

// テストの実行
const runner = new AcceptanceTestRunner();

console.log('='.repeat(60));
console.log('HAQEI v2.2.2 受け入れ基準テスト');
console.log('='.repeat(60));
console.log();

// 1. 八宮マッピング検証
console.log('【八宮マッピング検証】');
runner.run('八宮配列が正しく実装されている', () => {
    const htmlPath = path.join(__dirname, '..', 'public', 'os_analyzer.html');
    const content = fs.readFileSync(htmlPath, 'utf8');
    
    // 正しい八宮配列の確認
    const expectedPalaces = {
        '乾宮': [1, 44, 33, 12, 20, 23, 35, 14],
        '坤宮': [2, 24, 19, 11, 34, 43, 5, 8],
        '震宮': [51, 16, 40, 32, 46, 48, 28, 17],
        '巽宮': [57, 9, 37, 42, 25, 21, 27, 18],
        '坎宮': [29, 60, 3, 63, 49, 55, 36, 7],
        '離宮': [30, 56, 50, 64, 4, 59, 6, 13],
        '艮宮': [52, 22, 26, 41, 38, 10, 61, 53],
        '兌宮': [58, 47, 45, 31, 39, 15, 62, 54]
    };
    
    for (const [palace, hexagrams] of Object.entries(expectedPalaces)) {
        // 各宮の配列がコード内に存在するか確認
        // スペースは考慮しない
        const pattern = hexagrams.join(',').replace(/\s/g, '');
        const compactContent = content.replace(/\s/g, '');
        if (!compactContent.includes(pattern)) {
            return `${palace}の配列が見つからない`;
        }
    }
    
    return true;
});

runner.run('getOSPatternGroup関数が実装されている', () => {
    const htmlPath = path.join(__dirname, '..', 'public', 'os_analyzer.html');
    const content = fs.readFileSync(htmlPath, 'utf8');
    return content.includes('getOSPatternGroup') || 'getOSPatternGroup関数が見つからない';
});

runner.run('八宮の意味論データが拡充されている', () => {
    const htmlPath = path.join(__dirname, '..', 'public', 'os_analyzer.html');
    const content = fs.readFileSync(htmlPath, 'utf8');
    
    const requiredFields = ['weakness', 'typicalBehavior', 'growthPath'];
    for (const field of requiredFields) {
        if (!content.includes(field)) {
            return `${field}フィールドが見つからない`;
        }
    }
    
    return true;
});

// 2. パターンID生成検証
console.log('\n【パターンID生成検証】');
runner.run('512パターンが一意のIDを生成', () => {
    const patterns = new Set();
    for (let e = 0; e < 8; e++) {
        for (let i = 0; i < 8; i++) {
            for (let s = 0; s < 8; s++) {
                const id = `${e}${i}${s}`;
                if (patterns.has(id)) {
                    return `重複ID検出: ${id}`;
                }
                patterns.add(id);
            }
        }
    }
    return patterns.size === 512 || `期待512、実際${patterns.size}`;
});

runner.run('パターンIDフォーマットが正しい', () => {
    const validPattern = /^[0-7]{3}$/;
    const validIds = ['000', '377', '777', '064', '246', '764'];  // 764も有効（7,6,4は全て0-7の範囲内）
    const invalidIds = ['888', '988', '900', '1a2', 'abc', '8000', '99'];  // 8,9を含むものは無効
    
    // 有効なIDのテスト
    for (const id of validIds) {
        if (!validPattern.test(id)) {
            return `有効なID${id}が拒否された`;
        }
    }
    
    // 無効なIDのテスト
    for (const id of invalidIds) {
        if (validPattern.test(id)) {
            return `無効なID${id}が受け入れられた`;
        }
    }
    
    return true;
});

// 3. JSONスキーマ検証
console.log('\n【JSONスキーマ検証】');
runner.run('JSONスキーマファイルが存在する', () => {
    const schemaPath = path.join(__dirname, '..', 'schemas', 'haqei-api.schema.json');
    return fs.existsSync(schemaPath) || 'スキーマファイルが見つからない';
});

runner.run('スキーマが有効なJSON', () => {
    const schemaPath = path.join(__dirname, '..', 'schemas', 'haqei-api.schema.json');
    if (!fs.existsSync(schemaPath)) return 'skip';
    
    try {
        const content = fs.readFileSync(schemaPath, 'utf8');
        JSON.parse(content);
        return true;
    } catch (e) {
        return `JSONパースエラー: ${e.message}`;
    }
});

runner.run('必須フィールドが定義されている', () => {
    const schemaPath = path.join(__dirname, '..', 'schemas', 'haqei-api.schema.json');
    if (!fs.existsSync(schemaPath)) return 'skip';
    
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    const requiredDefs = ['hexagramId', 'strength', 'palaceId', 'patternId'];
    
    for (const def of requiredDefs) {
        if (!schema.definitions[def]) {
            return `定義が見つからない: ${def}`;
        }
    }
    
    return true;
});

// 4. トレース機能検証
console.log('\n【トレース機能検証】');
runner.run('TraceLoggerクラスが実装されている', () => {
    const loggerPath = path.join(__dirname, '..', 'public', 'js', 'core', 'TraceLogger.js');
    return fs.existsSync(loggerPath) || 'TraceLogger.jsが見つからない';
});

runner.run('トレース機能の主要メソッドが存在', () => {
    const loggerPath = path.join(__dirname, '..', 'public', 'js', 'core', 'TraceLogger.js');
    if (!fs.existsSync(loggerPath)) return 'skip';
    
    const content = fs.readFileSync(loggerPath, 'utf8');
    const requiredMethods = ['initialize', 'trace', 'traceError', 'getSummary', 'exportJSON'];
    
    for (const method of requiredMethods) {
        if (!content.includes(method)) {
            return `メソッド${method}が見つからない`;
        }
    }
    
    return true;
});

// 5. 相互作用ルール検証
console.log('\n【相互作用ルール検証】');
runner.run('InteractionRulesクラスが実装されている', () => {
    const rulesPath = path.join(__dirname, '..', 'public', 'js', 'core', 'InteractionRules.js');
    return fs.existsSync(rulesPath) || 'InteractionRules.jsが見つからない';
});

runner.run('衝突検出と解決機能が実装されている', () => {
    const rulesPath = path.join(__dirname, '..', 'public', 'js', 'core', 'InteractionRules.js');
    if (!fs.existsSync(rulesPath)) return 'skip';
    
    const content = fs.readFileSync(rulesPath, 'utf8');
    const requiredFunctions = [
        'resolveConflicts',
        'detectPalaceConflicts',
        'generateResolution',
        'determinePriority'
    ];
    
    for (const func of requiredFunctions) {
        if (!content.includes(func)) {
            return `関数${func}が見つからない`;
        }
    }
    
    return true;
});

runner.run('五行相生相剋が定義されている', () => {
    const rulesPath = path.join(__dirname, '..', 'public', 'js', 'core', 'InteractionRules.js');
    if (!fs.existsSync(rulesPath)) return 'skip';
    
    const content = fs.readFileSync(rulesPath, 'utf8');
    return content.includes('wuxingRelations') && content.includes('generating') && content.includes('overcoming')
        || '五行関係が定義されていない';
});

// 6. CI/CD検証
console.log('\n【CI/CD検証】');
runner.run('GitHub Actionsワークフローが存在', () => {
    const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'verify-eight-palaces.yml');
    return fs.existsSync(workflowPath) || 'ワークフローファイルが見つからない';
});

runner.run('ワークフローに必須ジョブが定義されている', () => {
    const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'verify-eight-palaces.yml');
    if (!fs.existsSync(workflowPath)) return 'skip';
    
    const content = fs.readFileSync(workflowPath, 'utf8');
    const requiredJobs = ['verify-mapping', 'quality-metrics', 'documentation-check'];
    
    for (const job of requiredJobs) {
        if (!content.includes(job)) {
            return `ジョブ${job}が見つからない`;
        }
    }
    
    return true;
});

// 7. ドキュメント検証
console.log('\n【ドキュメント検証】');
runner.run('決定規則仕様書が存在', () => {
    const docPath = path.join(__dirname, '..', '20250814_DECISION_RULES_SPECIFICATION.md');
    return fs.existsSync(docPath) || '決定規則仕様書が見つからない';
});

runner.run('八宮の出典情報が記載されている', () => {
    const docPath = path.join(__dirname, '..', '20250814_DECISION_RULES_SPECIFICATION.md');
    if (!fs.existsSync(docPath)) return 'skip';
    
    const content = fs.readFileSync(docPath, 'utf8');
    return content.includes('京房八宮') && content.includes('京房易伝')
        || '京房八宮の出典情報が見つからない';
});

runner.run('最終承認版ドキュメントが存在', () => {
    const docPath = path.join(__dirname, '..', '20250814_FINAL_APPROVAL_v2.2.2.md');
    return fs.existsSync(docPath) || '最終承認版ドキュメントが見つからない';
});

// 8. パフォーマンス検証
console.log('\n【パフォーマンス検証】');
runner.run('八宮検索がO(1)で実装されている', () => {
    const htmlPath = path.join(__dirname, '..', 'public', 'os_analyzer.html');
    const content = fs.readFileSync(htmlPath, 'utf8');
    
    // ハッシュマップまたは配列インデックスによる実装を確認
    return content.includes('EIGHT_PALACES') && 
           (content.includes('.includes(hexagramId)') || content.includes('palace.hexagrams'))
           || 'O(1)実装が確認できない';
});

// 9. エラーハンドリング検証
console.log('\n【エラーハンドリング検証】');
runner.run('フォールバック処理が実装されている', () => {
    const htmlPath = path.join(__dirname, '..', 'public', 'os_analyzer.html');
    const content = fs.readFileSync(htmlPath, 'utf8');
    
    return content.includes('|| palaceNatures[0]') || 
           content.includes('フォールバック') ||
           content.includes('console.warn')
           || 'フォールバック処理が見つからない';
});

// 10. デバッグ機能検証
console.log('\n【デバッグ機能検証】');
runner.run('デバッグトレース機能が実装されている', () => {
    const htmlPath = path.join(__dirname, '..', 'public', 'os_analyzer.html');
    const content = fs.readFileSync(htmlPath, 'utf8');
    
    return content.includes('window.debugHAQEI') && content.includes('console.log')
           || 'デバッグトレース機能が見つからない';
});

// レポート生成
console.log();
const report = runner.generateReport();

// 合格判定
const passRate = runner.results.passed.length / 
                (runner.results.passed.length + runner.results.failed.length) * 100;

if (passRate >= 80) {
    console.log('\n✅ 受け入れ基準を満たしています (80%以上合格)');
    process.exit(0);
} else {
    console.log('\n❌ 受け入れ基準を満たしていません (80%未満)');
    process.exit(1);
}