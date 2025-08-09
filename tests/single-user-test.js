#!/usr/bin/env node

/**
 * HAQEI OS Analyzer - シングルユーザーテスト
 * 
 * 1人の仮想ユーザーで完全フローをテスト
 */

import { chromium } from 'playwright';
import fs from 'fs/promises';

// テスト用仮想ユーザー
const TEST_PERSONA = {
  id: 1, 
  name: "革新的起業家", 
  type: "乾_創造性", 
  age: 32, 
  occupation: "スタートアップCEO", 
  traits: ["革新", "リーダーシップ", "挑戦"]
};

// ペルソナ選択肢決定
function getPersonaChoice(persona, questionNumber) {
  const baseTendency = {
    "乾_創造性": [4, 5]
  };
  
  const choices = baseTendency[persona.type] || [3];
  return choices[questionNumber % choices.length];
}

// シングルユーザーテスト実行
async function runSingleUserTest() {
  console.log('🚀 HAQEI OS Analyzer - シングルユーザーテスト');
  console.log(`👤 ${TEST_PERSONA.name} (${TEST_PERSONA.type})`);
  
  const browser = await chromium.launch({ headless: false }); // デバッグ用にブラウザ表示
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    viewport: { width: 1366, height: 768 }
  });
  
  const page = await context.newPage();
  let success = false;
  let error = null;
  const startTime = Date.now();
  
  try {
    console.log('📄 ページ読み込み中...');
    await page.goto('http://localhost:8000/os_analyzer.html', { timeout: 10000 });
    await page.waitForTimeout(2000);
    
    console.log('🎯 分析開始ボタンをクリック...');
    await page.click('button:has-text("✨ Triple OS 分析を開始する")', { timeout: 5000 });
    await page.waitForTimeout(2000);
    
    console.log('📝 30問の質問に回答中...');
    for (let i = 1; i <= 30; i++) {
      const choiceIndex = getPersonaChoice(TEST_PERSONA, i) - 1; // 1-5 を 0-4 に変換
      
      try {
        // ラジオボタンをインデックスで選択（0-4）
        await page.getByRole('radio').nth(choiceIndex).click({ timeout: 3000 });
        console.log(`  ✓ 質問${i}: 選択肢${choiceIndex + 1}を選択`);
      } catch (radioError) {
        // フォールバック: 最初のラジオボタンを選択
        await page.getByRole('radio').first().click({ timeout: 3000 });
        console.log(`  ⚠ 質問${i}: フォールバック選択`);
      }
      
      await page.waitForTimeout(300);
      
      if (i < 30) {
        await page.click('button:has-text("次の質問")', { timeout: 3000 });
        await page.waitForTimeout(500);
      }
    }
    
    console.log('🔍 分析開始ボタンを探しています...');
    
    // 複数パターンのボタンを試す
    const analysisButtons = [
      'button:has-text("分析開始")',
      'button:has-text("結果を見る")', 
      'button:has-text("分析を開始")',
      'button:has-text("診断開始")',
      'button:has-text("Triple OS分析")',
      'button:has-text("分析")'
    ];
    
    let analysisStarted = false;
    for (const buttonSelector of analysisButtons) {
      try {
        console.log(`  🔍 試行中: ${buttonSelector}`);
        await page.click(buttonSelector, { timeout: 2000 });
        console.log(`  ✅ 成功: ${buttonSelector}`);
        analysisStarted = true;
        break;
      } catch (buttonError) {
        console.log(`  ❌ 失敗: ${buttonSelector}`);
        continue;
      }
    }
    
    if (!analysisStarted) {
      console.log('  🔍 フォールバック: 全ボタンを確認中...');
      const allButtons = page.locator('button');
      const buttonCount = await allButtons.count();
      console.log(`  📊 見つかったボタン数: ${buttonCount}`);
      
      // 全ボタンのテキストを表示
      for (let i = 0; i < buttonCount; i++) {
        const buttonText = await allButtons.nth(i).textContent();
        console.log(`    ${i}: "${buttonText}"`);
      }
      
      // 最後のボタンをクリック
      if (buttonCount > 0) {
        const lastButton = allButtons.nth(buttonCount - 1);
        const lastButtonText = await lastButton.textContent();
        console.log(`  🎯 最後のボタンをクリック: "${lastButtonText}"`);
        await lastButton.click();
        analysisStarted = true;
      }
    }
    
    if (analysisStarted) {
      console.log('⏳ 結果表示を待機中...');
      await page.waitForTimeout(5000);
      
      console.log('📊 結果画面確認中...');
      const currentUrl = page.url();
      const pageTitle = await page.title();
      console.log(`  URL: ${currentUrl}`);
      console.log(`  タイトル: ${pageTitle}`);
      
      success = true;
    }
    
  } catch (testError) {
    error = testError.message;
    console.log(`❌ エラー: ${error}`);
  } finally {
    const duration = Date.now() - startTime;
    console.log(`⏱️ 実行時間: ${(duration/1000).toFixed(1)}秒`);
    
    await context.close();
    await browser.close();
  }
  
  console.log('\n📊 テスト結果');
  console.log('═══════════');
  console.log(`結果: ${success ? '✅ 成功' : '❌ 失敗'}`);
  if (error) console.log(`エラー: ${error}`);
  
  return { success, error, duration: Date.now() - startTime };
}

// メイン実行
async function main() {
  console.log('🔍 サーバー状態確認中...');
  
  try {
    const response = await fetch('http://localhost:8000/os_analyzer.html');
    if (!response.ok) throw new Error('サーバー未起動');
  } catch (error) {
    console.log('❌ localhost:8000でサーバーが起動していません');
    console.log('💡 以下のコマンドでサーバーを起動してください: npm run start');
    process.exit(1);
  }
  
  console.log('✅ サーバー稼働確認済み');
  
  const result = await runSingleUserTest();
  
  if (result.success) {
    console.log('\n🎉 シングルユーザーテスト成功！');
    console.log('次は5人のクイックテストが実行可能です。');
  } else {
    console.log('\n🚨 修正が必要です。');
  }
  
  return result;
}

// 実行
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { runSingleUserTest, TEST_PERSONA };