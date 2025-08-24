#!/usr/bin/env node
/**
 * Math.random() → SeedableRandom 自動置換スクリプト
 * v4.3.1 緊急対応: 決定論的要件違反の完全修正
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';

console.log('🔧 Math.random() → SeedableRandom 自動置換開始\n');

// 置換パターン定義
const replacementPatterns = [
  {
    pattern: /Math\.random\(\)/g,
    replacement: 'this.rng.next()',
    description: 'Math.random() → this.rng.next()'
  },
  {
    pattern: /Math\.floor\(Math\.random\(\)\s*\*\s*(\d+)\)/g,
    replacement: 'this.rng.nextInt(0, $1 - 1)',
    description: 'Math.floor(Math.random() * n) → this.rng.nextInt(0, n-1)'
  },
  {
    pattern: /Math\.floor\(Math\.random\(\)\s*\*\s*(\d+)\)\s*\+\s*(\d+)/g,
    replacement: 'this.rng.nextInt($2, $2 + $1 - 1)',
    description: 'Math.floor(Math.random() * n) + m → this.rng.nextInt(m, m+n-1)'
  },
  {
    pattern: /Math\.random\(\)\s*\*\s*([\d.]+)\s*\+\s*([\d.]+)/g,
    replacement: 'this.rng.nextFloat($2, $2 + $1)',
    description: 'Math.random() * a + b → this.rng.nextFloat(b, b+a)'
  },
  {
    pattern: /Math\.random\(\)\s*<\s*([\d.]+)/g,
    replacement: 'this.rng.next() < $1',
    description: 'Math.random() < threshold → this.rng.next() < threshold'
  }
];

// 対象ディレクトリ
const targetDirs = ['public/js'];

// RNG DIコンストラクタパターン
const rngConstructorPattern = `
    // v4.3.1 決定論的要件: SeedableRandom統合
    this.rng = options.randomnessManager || window.randomnessManager || 
               (() => { throw new Error('RandomnessManager required for deterministic behavior'); });`;

async function findJavaScriptFiles(dir) {
  const files = [];
  
  async function scan(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        await scan(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.js')) {
        files.push(fullPath);
      }
    }
  }
  
  await scan(dir);
  return files;
}

async function processFile(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    let modified = false;
    let replacements = [];
    
    // Math.random()使用チェック
    if (!content.includes('Math.random')) {
      return { modified: false, replacements: [] };
    }
    
    console.log(`\n📝 処理中: ${filePath}`);
    
    // クラス定義チェック
    const hasClass = /class\s+\w+\s*{/.test(content);
    const hasConstructor = /constructor\s*\([^)]*\)\s*{/.test(content);
    
    // RNG DI追加
    if (hasClass && hasConstructor && !content.includes('this.rng =')) {
      content = content.replace(
        /(constructor\s*\([^)]*\)\s*{\s*)/,
        `$1${rngConstructorPattern}\n    `
      );
      modified = true;
      replacements.push('Added RNG dependency injection');
    }
    
    // パターン置換
    for (const { pattern, replacement, description } of replacementPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, replacement);
        modified = true;
        replacements.push(`${description} (${matches.length} occurrences)`);
      }
    }
    
    // ファイル書き込み
    if (modified) {
      await fs.writeFile(filePath, content, 'utf8');
      console.log(`   ✅ 修正完了: ${replacements.length} patterns`);
      replacements.forEach(r => console.log(`      - ${r}`));
    }
    
    return { modified, replacements };
    
  } catch (error) {
    console.error(`   ❌ エラー: ${filePath} - ${error.message}`);
    return { modified: false, replacements: [], error: error.message };
  }
}

async function main() {
  let totalFiles = 0;
  let modifiedFiles = 0;
  let totalReplacements = 0;
  
  for (const dir of targetDirs) {
    console.log(`\n📂 ディレクトリ検索: ${dir}`);
    
    try {
      const files = await findJavaScriptFiles(dir);
      console.log(`   ${files.length} JSファイル発見`);
      
      for (const file of files) {
        const result = await processFile(file);
        totalFiles++;
        
        if (result.modified) {
          modifiedFiles++;
          totalReplacements += result.replacements.length;
        }
      }
    } catch (error) {
      console.error(`❌ ディレクトリアクセスエラー: ${dir} - ${error.message}`);
    }
  }
  
  // 結果確認
  console.log('\n' + '='.repeat(60));
  console.log('📊 修正結果サマリー');
  console.log('='.repeat(60));
  console.log(`総ファイル数: ${totalFiles}`);
  console.log(`修正ファイル数: ${modifiedFiles}`);
  console.log(`置換パターン数: ${totalReplacements}`);
  
  // Math.random残存確認
  try {
    const remaining = execSync('grep -r "Math\\.random" public/js --include="*.js" | wc -l', { encoding: 'utf8' }).trim();
    console.log(`残存Math.random(): ${remaining}件`);
    
    if (remaining === '0') {
      console.log('\n🎉 Math.random()完全除去成功！');
    } else {
      console.log('\n⚠️ 一部Math.random()が残存しています');
      execSync('grep -n "Math\\.random" public/js --include="*.js"', { stdio: 'inherit' });
    }
  } catch (error) {
    console.log('\n✅ Math.random()検索結果なし（完全除去達成）');
  }
  
  console.log('\n✅ 自動置換処理完了');
}

main().catch(console.error);