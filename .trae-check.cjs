#!/usr/bin/env node
/**
 * TRAE作業前必須チェックスクリプト
 * このスクリプトは、TRAEが任意の作業を開始する前に実行すべき必須チェックを行います。
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class TRAEPreWorkCheck {
    constructor() {
        this.projectRoot = process.cwd();
        this.mandatoryReadFile = path.join(this.projectRoot, 'docs', 'TRAE_MANDATORY_READ.md');
        this.workInstructionFile = path.join(this.projectRoot, 'docs', '20250819_TRAE作業指示書テンプレート.md');
        this.checksPassed = [];
        this.checksWarnings = [];
        this.checksErrors = [];
    }

    /**
     * メインチェック実行
     */
    async runPreWorkCheck() {
        console.log('🚨 TRAE作業前必須チェック開始');
        console.log('=' .repeat(50));
        
        // 1. 必須ドキュメントの存在確認
        this.checkMandatoryDocuments();
        
        // 2. プロジェクト構造の確認
        this.checkProjectStructure();
        
        // 3. 既存ファイルの状態確認
        this.checkExistingFiles();
        
        // 4. Git状態の確認
        this.checkGitStatus();
        
        // 5. 結果表示
        this.displayResults();
        
        return this.checksErrors.length === 0;
    }

    /**
     * 必須ドキュメントの存在と読み込み確認
     */
    checkMandatoryDocuments() {
        console.log('📋 必須ドキュメント確認中...');
        
        // TRAE_MANDATORY_READ.mdの確認
        if (fs.existsSync(this.mandatoryReadFile)) {
            this.checksPassed.push('✅ TRAE_MANDATORY_READ.md が存在します');
            
            // ファイル内容の重要項目確認
            const content = fs.readFileSync(this.mandatoryReadFile, 'utf8');
            if (content.includes('絶対禁止事項') && content.includes('必須実行手順')) {
                this.checksPassed.push('✅ 必須ガイドライン項目が含まれています');
            } else {
                this.checksWarnings.push('⚠️ 必須ガイドライン項目が不完全です');
            }
        } else {
            this.checksErrors.push('❌ TRAE_MANDATORY_READ.md が見つかりません');
        }
        
        // 作業指示書テンプレートの確認
        if (fs.existsSync(this.workInstructionFile)) {
            this.checksPassed.push('✅ 作業指示書テンプレートが存在します');
        } else {
            this.checksWarnings.push('⚠️ 作業指示書テンプレートが見つかりません');
        }
    }

    /**
     * プロジェクト構造の確認
     */
    checkProjectStructure() {
        console.log('🏗️ プロジェクト構造確認中...');
        
        const criticalDirs = ['public', 'js', 'docs', 'data'];
        const criticalFiles = ['package.json', 'index.html'];
        
        criticalDirs.forEach(dir => {
            const dirPath = path.join(this.projectRoot, dir);
            if (fs.existsSync(dirPath)) {
                this.checksPassed.push(`✅ ${dir}/ ディレクトリが存在します`);
            } else {
                this.checksErrors.push(`❌ ${dir}/ ディレクトリが見つかりません`);
            }
        });
        
        criticalFiles.forEach(file => {
            const filePath = path.join(this.projectRoot, file === 'index.html' ? 'public/index.html' : file);
            if (fs.existsSync(filePath)) {
                this.checksPassed.push(`✅ ${file} が存在します`);
            } else {
                this.checksWarnings.push(`⚠️ ${file} が見つかりません`);
            }
        });
    }

    /**
     * 既存ファイルの状態確認
     */
    checkExistingFiles() {
        console.log('📁 既存ファイル状態確認中...');
        
        try {
            // JavaScriptファイルの数を確認
            const jsFiles = this.findFiles('**/*.js', 'public/js');
            this.checksPassed.push(`✅ JavaScriptファイル: ${jsFiles.length}個`);
            
            // CSSファイルの確認
            const cssFiles = this.findFiles('**/*.css', 'public');
            this.checksPassed.push(`✅ CSSファイル: ${cssFiles.length}個`);
            
            // HTMLファイルの確認
            const htmlFiles = this.findFiles('**/*.html', 'public');
            this.checksPassed.push(`✅ HTMLファイル: ${htmlFiles.length}個`);
            
        } catch (error) {
            this.checksWarnings.push(`⚠️ ファイル検索エラー: ${error.message}`);
        }
    }

    /**
     * Git状態の確認
     */
    checkGitStatus() {
        console.log('🔄 Git状態確認中...');
        
        try {
            // Git リポジトリの確認
            if (fs.existsSync(path.join(this.projectRoot, '.git'))) {
                this.checksPassed.push('✅ Gitリポジトリが初期化されています');
                
                // 未コミットの変更確認
                const status = execSync('git status --porcelain', { encoding: 'utf8' });
                if (status.trim()) {
                    this.checksWarnings.push('⚠️ 未コミットの変更があります');
                    console.log('   変更ファイル:');
                    status.split('\n').forEach(line => {
                        if (line.trim()) console.log(`   ${line}`);
                    });
                } else {
                    this.checksPassed.push('✅ 作業ディレクトリがクリーンです');
                }
            } else {
                this.checksWarnings.push('⚠️ Gitリポジトリが見つかりません');
            }
        } catch (error) {
            this.checksWarnings.push(`⚠️ Git状態確認エラー: ${error.message}`);
        }
    }

    /**
     * ファイル検索ヘルパー
     */
    findFiles(pattern, baseDir) {
        const fullPath = path.join(this.projectRoot, baseDir);
        if (!fs.existsSync(fullPath)) return [];
        
        const files = [];
        const searchDir = (dir) => {
            const items = fs.readdirSync(dir);
            items.forEach(item => {
                const itemPath = path.join(dir, item);
                const stat = fs.statSync(itemPath);
                if (stat.isDirectory()) {
                    searchDir(itemPath);
                } else if (pattern.includes(path.extname(item))) {
                    files.push(itemPath);
                }
            });
        };
        
        searchDir(fullPath);
        return files;
    }

    /**
     * 結果表示
     */
    displayResults() {
        console.log('\n' + '=' .repeat(50));
        console.log('📊 チェック結果サマリー');
        console.log('=' .repeat(50));
        
        if (this.checksPassed.length > 0) {
            console.log('\n✅ 成功項目:');
            this.checksPassed.forEach(item => console.log(`  ${item}`));
        }
        
        if (this.checksWarnings.length > 0) {
            console.log('\n⚠️ 警告項目:');
            this.checksWarnings.forEach(item => console.log(`  ${item}`));
        }
        
        if (this.checksErrors.length > 0) {
            console.log('\n❌ エラー項目:');
            this.checksErrors.forEach(item => console.log(`  ${item}`));
            console.log('\n🚨 エラーが検出されました。作業を開始する前に修正してください。');
        } else {
            console.log('\n🎉 すべてのチェックが完了しました！');
            console.log('\n📋 次のステップ:');
            console.log('  1. docs/TRAE_MANDATORY_READ.md を熟読してください');
            console.log('  2. 作業指示書テンプレートを参照してください');
            console.log('  3. 重複チェックを実行してから作業を開始してください');
        }
        
        console.log('\n' + '=' .repeat(50));
    }

    /**
     * 重複チェック機能
     */
    static checkDuplication(fileName, functionName = null, className = null) {
        console.log('🔍 重複チェック実行中...');
        
        const projectRoot = process.cwd();
        let duplications = [];
        
        // ファイル名重複チェック
        if (fileName) {
            try {
                const result = execSync(`find . -name "${fileName}" -type f`, { encoding: 'utf8' });
                if (result.trim()) {
                    duplications.push(`ファイル名重複: ${fileName}`);
                    console.log(`❌ ファイル名重複検出: ${fileName}`);
                    result.split('\n').forEach(line => {
                        if (line.trim()) console.log(`   ${line}`);
                    });
                }
            } catch (error) {
                console.log(`⚠️ ファイル検索エラー: ${error.message}`);
            }
        }
        
        // 関数名重複チェック
        if (functionName) {
            try {
                const result = execSync(`grep -r "function ${functionName}" ./public/js/ || true`, { encoding: 'utf8' });
                if (result.trim()) {
                    duplications.push(`関数名重複: ${functionName}`);
                    console.log(`❌ 関数名重複検出: ${functionName}`);
                }
            } catch (error) {
                console.log(`⚠️ 関数検索エラー: ${error.message}`);
            }
        }
        
        // クラス名重複チェック
        if (className) {
            try {
                const result = execSync(`grep -r "class ${className}" ./public/js/ || true`, { encoding: 'utf8' });
                if (result.trim()) {
                    duplications.push(`クラス名重複: ${className}`);
                    console.log(`❌ クラス名重複検出: ${className}`);
                }
            } catch (error) {
                console.log(`⚠️ クラス検索エラー: ${error.message}`);
            }
        }
        
        if (duplications.length === 0) {
            console.log('✅ 重複は検出されませんでした');
            return true;
        } else {
            console.log('🚨 重複が検出されました。別の名前を使用してください。');
            return false;
        }
    }
}

// コマンドライン実行時の処理
if (require.main === module) {
    const checker = new TRAEPreWorkCheck();
    
    // コマンドライン引数の処理
    const args = process.argv.slice(2);
    
    if (args[0] === 'check-duplication') {
        // 重複チェックモード
        const fileName = args[1];
        const functionName = args[2];
        const className = args[3];
        TRAEPreWorkCheck.checkDuplication(fileName, functionName, className);
    } else {
        // 通常のプリワークチェック
        checker.runPreWorkCheck().then(success => {
            process.exit(success ? 0 : 1);
        });
    }
}

module.exports = TRAEPreWorkCheck;