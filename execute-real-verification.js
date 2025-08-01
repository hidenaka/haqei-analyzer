/**
 * Future Simulator 実動作検証スクリプト
 * 実際にシステムを動作させて結果を記録
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const TEST_CASES = [
  {
    id: 'personal_anxiety',
    text: '私は最近とても不安に感じています。将来のことを考えると夜も眠れず、自分に自信が持てません。どうすればいいでしょうか。',
    expectedContext: 'personal',
    validHexagrams: [3, 4, 5, 27, 29, 47], // 屯、蒙、需、頤、坎、困
    description: '個人的な不安と自信の欠如'
  },
  {
    id: 'workplace_relationship',
    text: '職場の上司との関係に悩んでいます。コミュニケーションがうまくいかず、毎日がストレスです。',
    expectedContext: 'relationship',
    validHexagrams: [6, 18, 38, 45, 47], // 訟、蠱、睽、萃、困
    description: '職場での人間関係の悩み'
  },
  {
    id: 'career_decision',
    text: '転職を考えているが、家族のことも心配で決断できない。経済的な不安もあり、どうすればいいかわからない。',
    expectedContext: 'hybrid',
    validHexagrams: [5, 21, 25, 47, 64], // 需、噬嗑、無妄、困、未済
    description: '複合的な悩み（転職・家族・経済）'
  },
  {
    id: 'life_meaning',
    text: '人生の意味がわからなくなりました。存在することの価値について深く考えています。',
    expectedContext: 'philosophical',
    validHexagrams: [4, 20, 22, 27, 61], // 蒙、観、贲、頤、中孚
    description: '哲学的・存在論的な悩み'
  },
  {
    id: 'technical_choice',
    text: 'APIの設計で悩んでいます。RESTとGraphQLどちらを選ぶべきか、アーキテクチャの決定に迷っています。',
    expectedContext: 'technical',
    validHexagrams: [5, 21, 43, 50], // 需、噬嗑、夬、鼎
    description: '技術的な判断の悩み'
  },
  {
    id: 'emotional_extreme',
    text: 'もう本当に嫌だ！！！絶対に無理！！死にたい！！！',
    expectedContext: 'personal',
    validHexagrams: [29, 47, 36, 39], // 坎、困、明夷、蹇
    description: '極度の感情的表現'
  },
  {
    id: 'short_input',
    text: '困った',
    expectedContext: 'hybrid',
    validHexagrams: [3, 4, 5, 47], // 屯、蒙、需、困
    description: '短すぎる入力'
  }
];

class RealVerificationTester {
  constructor() {
    this.results = [];
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    console.log('🚀 Puppeteer起動中...');
    
    // Headless: falseで実際のブラウザを表示
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 800 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    
    // コンソールログを監視
    this.page.on('console', msg => {
      console.log(`[ブラウザ] ${msg.type()}: ${msg.text()}`);
    });
    
    // エラーを監視
    this.page.on('pageerror', error => {
      console.error(`[ページエラー] ${error.message}`);
    });
  }

  async testSingleCase(testCase) {
    console.log(`\n📝 テストケース実行: ${testCase.id}`);
    console.log(`入力: "${testCase.text}"`);
    
    const startTime = Date.now();
    
    try {
      // Future Simulatorページに移動
      await this.page.goto('http://localhost:8788/future_simulator.html', {
        waitUntil: 'networkidle0',
        timeout: 30000
      });
      
      // kuromoji.js初期化を待つ
      console.log('⏳ kuromoji.js初期化待機中...');
      await this.page.waitForFunction(
        () => window.kuromojiTokenizer !== undefined,
        { timeout: 30000 }
      );
      console.log('✅ kuromoji.js初期化完了');
      
      // テキスト入力
      await this.page.waitForSelector('#worryInput', { timeout: 10000 });
      await this.page.click('#worryInput');
      await this.page.type('#worryInput', testCase.text);
      
      // 分析実行ボタンをクリック
      await this.page.waitForSelector('#aiGuessBtn', { timeout: 10000 });
      await this.page.click('#aiGuessBtn');
      
      // 結果を待つ（最大30秒）
      console.log('⏳ 分析実行中...');
      
      // 結果表示を待つ
      await this.page.waitForFunction(
        () => {
          const resultElement = document.querySelector('#analysisResult');
          return resultElement && resultElement.innerHTML.trim() !== '' && 
                 !resultElement.innerHTML.includes('分析中') &&
                 !resultElement.innerHTML.includes('処理中');
        },
        { timeout: 30000 }
      );
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      // 結果を取得
      const result = await this.page.evaluate(() => {
        const resultElement = document.querySelector('#analysisResult');
        const resultHTML = resultElement ? resultElement.innerHTML : '';
        
        // 卦番号と爻番号を抽出
        const hexagramMatch = resultHTML.match(/(\d+)卦/);
        const lineMatch = resultHTML.match(/(\d+)爻/);
        
        // 信頼度を抽出
        const confidenceMatch = resultHTML.match(/信頼度[：:]\s*(\d+)%/);
        
        // コンテキストを抽出（if available）
        const contextMatch = resultHTML.match(/コンテキスト[：:]\s*(\w+)/);
        
        return {
          html: resultHTML,
          hexagram: hexagramMatch ? parseInt(hexagramMatch[1]) : null,
          line: lineMatch ? parseInt(lineMatch[1]) : null,
          confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : null,
          context: contextMatch ? contextMatch[1] : null,
          hasResult: resultHTML.length > 100 // 結果があるかの簡易判定
        };
      });
      
      const testResult = {
        testId: testCase.id,
        description: testCase.description,
        inputText: testCase.text,
        expectedContext: testCase.expectedContext,
        validHexagrams: testCase.validHexagrams,
        responseTime,
        success: result.hasResult,
        actualResult: result,
        timestamp: new Date().toISOString()
      };
      
      // 妥当性評価
      if (result.hexagram) {
        testResult.isValidHexagram = testCase.validHexagrams.includes(result.hexagram);
        testResult.hexagramName = this.getHexagramName(result.hexagram);
      }
      
      this.results.push(testResult);
      
      console.log(`✅ テスト完了: ${responseTime}ms`);
      if (result.hexagram) {
        console.log(`📊 結果: ${result.hexagram}卦${result.line}爻 (信頼度: ${result.confidence}%)`);
        console.log(`🎯 妥当性: ${testResult.isValidHexagram ? '適切' : '要検討'}`);
      }
      
      return testResult;
      
    } catch (error) {
      console.error(`❌ テスト失敗: ${error.message}`);
      
      const testResult = {
        testId: testCase.id,
        description: testCase.description,
        inputText: testCase.text,
        expectedContext: testCase.expectedContext,
        responseTime: Date.now() - startTime,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
      
      this.results.push(testResult);
      return testResult;
    }
  }

  getHexagramName(hexagramNumber) {
    const names = {
      1: '乾為天', 2: '坤為地', 3: '水雷屯', 4: '山水蒙', 5: '水天需',
      6: '天水訟', 7: '地水師', 8: '水地比', 9: '風天小畜', 10: '天沢履',
      21: '火雷噬嗑', 22: '山火贲', 27: '山雷頤', 29: '坎為水', 31: '沢山咸',
      36: '地火明夷', 38: '火沢睽', 39: '水山蹇', 43: '沢天夬', 47: '沢水困',
      49: '沢火革', 50: '火風鼎', 61: '風沢中孚', 64: '火水未済'
    };
    return names[hexagramNumber] || `${hexagramNumber}卦`;
  }

  async runAllTests() {
    console.log('🎯 Future Simulator 実動作検証開始');
    
    for (const testCase of TEST_CASES) {
      await this.testSingleCase(testCase);
      
      // テスト間の間隔
      await this.page.waitForTimeout(2000);
    }
    
    console.log('\n🎉 全テスト完了');
    return this.generateReport();
  }

  generateReport() {
    const successfulTests = this.results.filter(r => r.success);
    const failedTests = this.results.filter(r => !r.success);
    const validHexagrams = this.results.filter(r => r.isValidHexagram);
    
    const avgResponseTime = successfulTests.length > 0 
      ? successfulTests.reduce((sum, r) => sum + r.responseTime, 0) / successfulTests.length
      : 0;

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: this.results.length,
        successful: successfulTests.length,
        failed: failedTests.length,
        validHexagrams: validHexagrams.length,
        averageResponseTime: Math.round(avgResponseTime),
        successRate: Math.round((successfulTests.length / this.results.length) * 100),
        hexagramValidityRate: validHexagrams.length > 0 
          ? Math.round((validHexagrams.length / successfulTests.length) * 100) 
          : 0
      },
      details: this.results
    };

    // レポートファイルに保存
    fs.writeFileSync(
      'future-simulator-real-verification-report.json',
      JSON.stringify(report, null, 2)
    );

    // コンソール出力
    console.log('\n' + '='.repeat(60));
    console.log('📊 Future Simulator 実動作検証レポート');
    console.log('='.repeat(60));
    console.log(`テスト総数: ${report.summary.totalTests}`);
    console.log(`成功: ${report.summary.successful} (${report.summary.successRate}%)`);
    console.log(`失敗: ${report.summary.failed}`);
    console.log(`適切な卦選出: ${report.summary.validHexagrams}/${report.summary.successful}`);
    console.log(`卦妥当性率: ${report.summary.hexagramValidityRate}%`);
    console.log(`平均応答時間: ${report.summary.averageResponseTime}ms`);

    if (failedTests.length > 0) {
      console.log('\n❌ 失敗したテスト:');
      failedTests.forEach(test => {
        console.log(`  • ${test.testId}: ${test.error}`);
      });
    }

    if (successfulTests.length > 0) {
      console.log('\n📋 成功したテストの詳細:');
      successfulTests.forEach(test => {
        const validity = test.isValidHexagram ? '✅' : '❌';
        console.log(`  ${validity} ${test.testId}: ${test.actualResult.hexagram}卦${test.actualResult.line}爻 (${test.responseTime}ms)`);
      });
    }

    return report;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// メイン実行
async function main() {
  const tester = new RealVerificationTester();
  
  try {
    await tester.initialize();
    const report = await tester.runAllTests();
    
    console.log('\n📄 詳細レポートを future-simulator-real-verification-report.json に保存しました');
    
    // 総合評価
    if (report.summary.successRate >= 90 && report.summary.hexagramValidityRate >= 70) {
      console.log('\n🎉 総合評価: 優秀 - システムは適切に動作しています');
    } else if (report.summary.successRate >= 70) {
      console.log('\n⚠️ 総合評価: 良好 - いくつかの改善点があります');
    } else {
      console.log('\n❌ 総合評価: 要改善 - 重要な問題があります');
    }
    
  } catch (error) {
    console.error('❌ 検証実行エラー:', error);
  } finally {
    await tester.close();
  }
}

// 実行
main().catch(console.error);