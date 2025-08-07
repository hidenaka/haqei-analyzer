/**
 * 易経専門家による巽エネルギー検証テスト
 * ユーザーの指摘：巽（風）が高い値なのに関係ない64卦が表示される問題の検証
 */

import puppeteer from 'puppeteer';
import fs from 'fs';

class IChingValidationTest {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testResults = {
      timestamp: new Date().toISOString(),
      issues: [],
      findings: [],
      recommendations: []
    };
  }

  async initialize() {
    this.browser = await puppeteer.launch({ 
      headless: false, 
      defaultViewport: null,
      args: ['--start-maximized']
    });
    this.page = await this.browser.newPage();
    
    // コンソールログを監視
    this.page.on('console', msg => {
      console.log('PAGE LOG:', msg.text());
      if (msg.text().includes('エネルギー') || msg.text().includes('巽') || msg.text().includes('風')) {
        this.testResults.findings.push(`Console: ${msg.text()}`);
      }
    });
  }

  async navigateToHAQEI() {
    console.log('🌐 HAQEIシステムにアクセス中...');
    
    // 直接OS Analyzerにアクセス
    await this.page.goto('http://localhost:8788/os_analyzer.html');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // ページが正しく読み込まれたか確認
    const title = await this.page.title();
    console.log('📄 ページタイトル:', title);
    
    // 質問開始ボタンを探す
    try {
      await this.page.waitForSelector('.start-button, #startButton, button', { timeout: 5000 });
      console.log('✅ OS Analyzer画面表示成功');
      
      // 開始ボタンがあればクリック
      const startButton = await this.page.$('.start-button') || await this.page.$('#startButton') || await this.page.$('button');
      if (startButton) {
        const buttonText = await this.page.evaluate(el => el.textContent, startButton);
        console.log('🎯 開始ボタン見つかりました:', buttonText);
        await startButton.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.log('⚠️ 開始ボタンが見つかりませんが、続行します');
    }
  }

  /**
   * 巽（風）エネルギーが高くなるような回答パターンを実行
   */
  async simulateWindEnergyAnswers() {
    console.log('🌪️ 巽（風）エネルギーを高める回答パターンを実行...');
    
    // 巽（風）の特性：柔軟性、適応力、浸透力、影響力
    const windEnergyAnswers = [
      4, 4, 3, 4, 4,  // Q1-5: 柔軟性・適応性重視
      3, 4, 4, 3, 4,  // Q6-10: 影響力・浸透力
      4, 3,           // Q11-12: Engine OS完了
      4, 4, 4, 3, 4,  // Q13-17: Interface OS - 人間関係での適応性
      4, 3, 4, 4, 3,  // Q18-22: 柔軟なコミュニケーション
      4, 4,           // Q23-24: Interface OS完了
      3, 4, 4, 4, 3,  // Q25-29: Safe Mode OS - 安全への適応
      4, 4, 3, 4, 4,  // Q30-34: 柔軟な対応力
      4, 3            // Q35-36: Safe Mode OS完了
    ];
    
    let questionCount = 0;
    
    for (let i = 0; i < windEnergyAnswers.length; i++) {
      try {
        // 質問が表示されるまで待機
        try {
          await this.page.waitForSelector('.question-container, .question-text, .question', { timeout: 5000 });
        } catch (error) {
          console.log(`⚠️ 質問${i+1}: 質問コンテナが見つかりません、継続します`);
        }
        
        // 回答ボタンを選択（複数パターンを試行）
        const answerValue = windEnergyAnswers[i];
        let answerButton = await this.page.$(`input[value="${answerValue}"]`) ||
                          await this.page.$(`button[data-value="${answerValue}"]`) ||
                          await this.page.$(`button:nth-of-type(${answerValue})`) ||
                          await this.page.$(`label:nth-of-type(${answerValue}) input`) ||
                          await this.page.$(`input[name="answer"]:nth-of-type(${answerValue})`);
        
        if (answerButton) {
          await answerButton.click();
          console.log(`✅ 質問${questionCount + 1}: 回答${answerValue}を選択`);
          await new Promise(resolve => setTimeout(resolve, 500));
        } else {
          console.log(`⚠️ 質問${questionCount + 1}: 回答ボタンが見つかりません`);
          
          // 代替手段：すべてのボタンを表示してデバッグ
          const allButtons = await this.page.$$eval('button, input', els => 
            els.map(el => ({
              tag: el.tagName,
              type: el.type,
              value: el.value,
              text: el.textContent?.slice(0, 20),
              dataset: Object.keys(el.dataset || {})
            }))
          );
          console.log(`デバッグ - 利用可能なボタン:`, allButtons.slice(0, 5));
        }
        
        // 次へボタンをクリック
        const nextButton = await this.page.$('button:has-text("次へ")') ||
                          await this.page.$('button[onclick*="next"]') ||
                          await this.page.$('.next-button') ||
                          await this.page.$('button:last-of-type');
        if (nextButton) {
          await nextButton.click();
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          console.log(`⚠️ 質問${questionCount + 1}: 次へボタンが見つかりません`);
        }
        
        questionCount++;
        console.log(`質問 ${questionCount} 回答: ${answerValue}`);
        
        // 結果画面に到達したかチェック
        const resultElement = await this.page.$('.result-container, .os-result, #results');
        if (resultElement) {
          console.log('✅ 結果画面に到達');
          break;
        }
        
      } catch (error) {
        console.warn(`質問 ${i+1} でエラー:`, error.message);
        // エラーでも続行
      }
    }
  }

  /**
   * エネルギー分布と64卦の分析
   */
  async analyzeEnergyAndHexagrams() {
    console.log('🔍 エネルギー分布と64卦の関係を分析...');
    
    // エネルギー分布を取得
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const energyDistribution = await this.page.evaluate(() => {
      // エネルギー分布を探す
      const energyElements = document.querySelectorAll('[data-trigram], .energy-bar, .trigram-energy');
      const distribution = {};
      
      energyElements.forEach(element => {
        const trigram = element.dataset?.trigram || element.textContent;
        const value = element.dataset?.value || element.style?.width || element.textContent;
        if (trigram && value) {
          distribution[trigram] = value;
        }
      });
      
      return distribution;
    });
    
    // 64卦の結果を取得
    const hexagramResults = await this.page.evaluate(() => {
      const results = {};
      const hexagramElements = document.querySelectorAll('.hexagram-result, .os-hexagram, [data-hexagram]');
      
      hexagramElements.forEach((element, index) => {
        const osType = element.dataset?.osType || `OS${index + 1}`;
        const hexagramName = element.textContent || element.dataset?.hexagram;
        const hexagramNumber = element.dataset?.hexagramNumber;
        
        results[osType] = {
          name: hexagramName,
          number: hexagramNumber
        };
      });
      
      return results;
    });
    
    // スクリーンショット撮影
    await this.page.screenshot({ 
      path: `iching_validation_result_${Date.now()}.png`,
      fullPage: true
    });
    
    this.testResults.findings.push({
      energyDistribution,
      hexagramResults,
      timestamp: new Date().toISOString()
    });
    
    console.log('📊 エネルギー分布:', energyDistribution);
    console.log('🔯 64卦結果:', hexagramResults);
    
    return { energyDistribution, hexagramResults };
  }

  /**
   * 易経的正統性の検証
   */
  validateIChingAuthenticity(energyDistribution, hexagramResults) {
    console.log('⚡ 易経的正統性を検証中...');
    
    // 巽（風）を含む正統な64卦
    const windRelatedHexagrams = {
      9: '風天小畜',     // 上巽下乾
      18: '山風蠱',      // 上艮下巽  
      20: '風地観',      // 上巽下坤
      42: '風雷益',      // 上巽下震
      44: '天風姤',      // 上乾下巽
      46: '地風升',      // 上坤下巽
      48: '水風井',      // 上坎下巽
      50: '火風鼎',      // 上離下巽
      53: '風山漸',      // 上巽下艮
      57: '巽為風',      // 上巽下巽
      59: '風水渙',      // 上巽下坎
      61: '風沢中孚'     // 上巽下兌
    };
    
    const issues = [];
    const recommendations = [];
    
    // 巽エネルギーが高い場合の検証
    if (energyDistribution['巽'] || energyDistribution['風']) {
      const windEnergyLevel = parseFloat(energyDistribution['巽'] || energyDistribution['風'] || '0');
      
      if (windEnergyLevel > 7) { // 高エネルギーレベル
        // 表示された64卦が巽を含むかチェック
        Object.values(hexagramResults).forEach((result, index) => {
          if (result.name && result.number) {
            const hexNumber = parseInt(result.number);
            if (!windRelatedHexagrams[hexNumber]) {
              issues.push({
                severity: 'HIGH',
                description: `巽エネルギー高値(${windEnergyLevel})なのに、巽を含まない64卦「${result.name}(${result.number})」が表示されている`,
                osType: `OS${index + 1}`,
                expectedHexagrams: Object.values(windRelatedHexagrams)
              });
            }
          }
        });
      }
    }
    
    // 改善提案
    if (issues.length > 0) {
      recommendations.push({
        type: 'ALGORITHM_IMPROVEMENT',
        description: '三爻エネルギー→64卦マッピングアルゴリズムの改善',
        specifics: [
          '最高エネルギーの三爻を優先的に上卦・下卦に配置',
          '巽エネルギー高値時は巽を含む12卦から選択',
          '複数三爻高値時のバランス調整アルゴリズム追加'
        ]
      });
      
      recommendations.push({
        type: 'HAQEI_PHILOSOPHY_INTEGRATION',
        description: 'HaQei分人理論との整合性向上',
        specifics: [
          '巽（風）特性とInterface OSの親和性強化',
          '適応性・柔軟性の評価軸調整',
          '複数人格の調和における巽の役割明確化'
        ]
      });
    }
    
    this.testResults.issues = issues;
    this.testResults.recommendations = recommendations;
    
    return { issues, recommendations };
  }

  async generateReport() {
    const reportPath = `iching_validation_report_${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(this.testResults, null, 2));
    
    console.log('📋 検証レポートを生成:', reportPath);
    return reportPath;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async runFullValidation() {
    try {
      await this.initialize();
      await this.navigateToHAQEI();
      await this.simulateWindEnergyAnswers();
      
      const { energyDistribution, hexagramResults } = await this.analyzeEnergyAndHexagrams();
      const { issues, recommendations } = this.validateIChingAuthenticity(energyDistribution, hexagramResults);
      
      console.log('\n🎯 検証結果サマリー:');
      console.log(`発見された問題: ${issues.length}件`);
      console.log(`改善提案: ${recommendations.length}件`);
      
      if (issues.length > 0) {
        console.log('\n❌ 発見された問題:');
        issues.forEach((issue, i) => {
          console.log(`${i+1}. [${issue.severity}] ${issue.description}`);
        });
      }
      
      if (recommendations.length > 0) {
        console.log('\n💡 改善提案:');
        recommendations.forEach((rec, i) => {
          console.log(`${i+1}. ${rec.type}: ${rec.description}`);
        });
      }
      
      const reportPath = await this.generateReport();
      return { issues, recommendations, reportPath };
      
    } catch (error) {
      console.error('❌ 検証テスト中にエラー:', error);
      this.testResults.issues.push({
        severity: 'CRITICAL',
        description: `テスト実行エラー: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    } finally {
      await this.cleanup();
    }
  }
}

// テスト実行
const tester = new IChingValidationTest();
tester.runFullValidation().then((result) => {
  console.log('\n✅ 易経専門家検証完了');
  console.log('結果:', result);
  process.exit(0);
}).catch((error) => {
  console.error('❌ テスト失敗:', error);
  process.exit(1);
});

export default IChingValidationTest;