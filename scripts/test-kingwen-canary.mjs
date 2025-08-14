#!/usr/bin/env node
/**
 * King Wen Verification Canary Test
 * v4.3.1 - "テストのテスト" で検証スクリプトが本当に効いているかチェック
 * 
 * 意図的に壊したマッピングで必ず失敗することを確認
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

console.log('🐤 King Wen Verification Canary Test\n');
console.log('Purpose: Verify that verification script actually catches corruption\n');

const originalMapping = path.join(process.cwd(), 'config/kingwen-mapping.json');
const brokenMapping = path.join(process.cwd(), 'config/kingwen-mapping-broken.json');
const backupMapping = path.join(process.cwd(), 'config/kingwen-mapping.backup.json');

try {
  // 1. Backup original mapping
  console.log('📋 Step 1: Backup original mapping');
  await fs.copyFile(originalMapping, backupMapping);
  console.log('   ✅ Original mapping backed up');
  
  // 2. Replace with broken mapping
  console.log('\n📋 Step 2: Replace with intentionally broken mapping');
  await fs.copyFile(brokenMapping, originalMapping);
  console.log('   ✅ Broken mapping in place (mapping[1] = 999)');
  
  // 3. Run verification - should FAIL
  console.log('\n📋 Step 3: Run King Wen verification (should FAIL)');
  let verificationFailed = false;
  
  try {
    const result = execSync('node scripts/verify-kingwen.mjs', { 
      encoding: 'utf8', 
      stdio: 'pipe' 
    });
    console.log('   ❌ CANARY FAILED - Verification script did not detect corruption!');
    console.log('   🚨 This indicates the verification script is not working correctly');
    verificationFailed = false;
  } catch (error) {
    console.log('   ✅ CANARY PASSED - Verification script correctly detected corruption');
    console.log('   🔍 Error output (expected):');
    const errorOutput = error.stdout || error.stderr || 'No output';
    console.log('     ' + errorOutput.split('\n').slice(0, 3).join('\n     '));
    verificationFailed = true;
  }
  
  // 4. Restore original mapping
  console.log('\n📋 Step 4: Restore original mapping');
  await fs.copyFile(backupMapping, originalMapping);
  await fs.unlink(backupMapping);
  console.log('   ✅ Original mapping restored');
  
  // 5. Verify restoration worked
  console.log('\n📋 Step 5: Verify restoration (should PASS)');
  try {
    execSync('node scripts/verify-kingwen.mjs', { stdio: 'pipe' });
    console.log('   ✅ Restoration verified - mapping works correctly');
  } catch (error) {
    console.log('   ❌ Restoration failed - original mapping may be corrupted');
    throw new Error('Failed to restore working King Wen mapping');
  }
  
  // Final assessment
  console.log('\n' + '='.repeat(60));
  if (verificationFailed) {
    console.log('🎉 CANARY TEST PASSED');
    console.log('   ✅ Verification script correctly detects corruption');
    console.log('   ✅ This proves the verification system is working');
    console.log('   ✅ Production data is protected against silent corruption');
    process.exit(0);
  } else {
    console.log('❌ CANARY TEST FAILED');
    console.log('   🚨 Verification script did not detect intentional corruption');
    console.log('   ⚠️  This suggests the verification system may be broken');
    process.exit(1);
  }
  
} catch (error) {
  // Ensure cleanup
  try {
    await fs.copyFile(backupMapping, originalMapping);
    await fs.unlink(backupMapping);
    console.log('   🔧 Emergency cleanup completed');
  } catch (cleanupError) {
    console.error('   ❌ Emergency cleanup failed:', cleanupError.message);
  }
  
  console.error(`\n❌ Canary test failed: ${error.message}`);
  process.exit(1);
}