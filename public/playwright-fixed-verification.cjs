const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class HAQEIPlaywrightVerifier {
  constructor(instanceId = 'default') {
    this.instanceId = instanceId;
    this.userDataDir = path.join(__dirname, `playwright-profiles/profile-${instanceId}`);
    this.browser = null;
    this.context = null;
    this.page = null;
    this.results = {
      instanceId: instanceId,
      timestamp: new Date().toISOString(),
      tests: {},
      screenshots: [],
      overallScore: 0
    };
  }

  async initialize() {
    console.log(`🚀 [${this.instanceId}] HAQEIアナライザー Playwright検証開始`);
    
    // プロファイルディレクトリを作成
    if (!fs.existsSync(path.dirname(this.userDataDir))) {
      fs.mkdirSync(path.dirname(this.userDataDir), { recursive: true });
    }

    try {
      // 修正: launchPersistentContextの正しい使用方法
      this.browser = await chromium.launchPersistentContext(this.userDataDir, {
        headless: false,
        viewport: { width: 1280, height: 720 },
        slowMo: 300,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security'
        ]
      });

      // launchPersistentContextではcontextがbrowserオブジェクトになる
      this.context = this.browser;
      this.page = await this.browser.newPage();
      
      console.log(`✅ [${this.instanceId}] ブラウザインスタンス起動完了`);
      
    } catch (error) {
      console.error(`❌ [${this.instanceId}] ブラウザ起動失敗:`, error.message);
      
      // フォールバック: 通常のlaunch方式
      console.log(`🔄 [${this.instanceId}] フォールバック方式で再試行...`);
      
      this.browser = await chromium.launch({
        headless: false,
        slowMo: 300,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      this.context = await this.browser.newContext({
        viewport: { width: 1280, height: 720 }
      });
      
      this.page = await this.context.newPage();
      console.log(`✅ [${this.instanceId}] フォールバック方式で起動完了`);
    }
  }

  async takeScreenshot(name, description = '') {
    const filename = `${this.instanceId}-${name}-${Date.now()}.png`;
    const filepath = path.join(__dirname, 'screenshots', filename);
    
    // スクリーンショットディレクトリを作成
    if (!fs.existsSync(path.dirname(filepath))) {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
    }

    try {
      await this.page.screenshot({ path: filepath, fullPage: true });
      
      this.results.screenshots.push({
        name: name,
        description: description,
        filename: filename,
        timestamp: new Date().toISOString()
      });
      
      console.log(`📸 [${this.instanceId}] スクリーンショット保存: ${filename}`);
      return filepath;
      
    } catch (error) {
      console.error(`❌ [${this.instanceId}] スクリーンショット失敗:`, error.message);
      return null;
    }
  }

  async testWelcomeScreen() {
    console.log(`📱 [${this.instanceId}] 1. ウェルカム画面の検証開始`);
    
    try {
      await this.page.goto('http://localhost:9000/os_analyzer.html', { 
        waitUntil: 'networkidle',
        timeout: 15000 
      });

      // ページ読み込み完了を待機
      await this.page.waitForTimeout(3000);

      // ウェルカム画面の表示確認
      const welcomeContainer = this.page.locator('#welcome-container');
      const isWelcomeVisible = await welcomeContainer.isVisible({ timeout: 5000 });
      
      // 不要な進捗ガイダンスの非表示確認
      await this.page.waitForTimeout(1000); // DOM更新を待機
      const progressGuidance = this.page.locator('.progress-guidance:visible, .progress-guidance-fixed:visible');
      const guidanceCount = await progressGuidance.count();
      
      // 進捗バーの文字確認
      const progressElements = this.page.locator('.progress-current-fixed, .welcome-status, .progress-current');
      let progressText = '';
      const progressCount = await progressElements.count();
      
      if (progressCount > 0) {
        try {
          progressText = await progressElements.first().textContent({ timeout: 3000 }) || '';
        } catch (e) {
          console.log(`⚠️ [${this.instanceId}] 進捗テキスト取得失敗: ${e.message}`);
        }
      }

      // 文字化けチェック
      const hasGarbledText = progressText.length > 0 && 
        /[^\u0000-\u007F\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u0020-\u007E\s]/.test(progressText);
      
      await this.takeScreenshot('welcome-screen', 'ウェルカム画面の表示状態');

      this.results.tests.welcomeScreen = {
        passed: isWelcomeVisible && guidanceCount === 0 && !hasGarbledText,
        details: {
          welcomeVisible: isWelcomeVisible,
          unwantedElementsHidden: guidanceCount === 0,
          progressText: progressText,
          noGarbledText: !hasGarbledText,
          guidanceCount: guidanceCount,
          progressElementsFound: progressCount
        }
      };

      console.log(`✅ [${this.instanceId}] ウェルカム画面表示: ${isWelcomeVisible}`);
      console.log(`✅ [${this.instanceId}] 不要要素非表示: ${guidanceCount === 0} (要素数: ${guidanceCount})`);
      console.log(`✅ [${this.instanceId}] 進捗テキスト: "${progressText}" (要素数: ${progressCount})`);
      console.log(`✅ [${this.instanceId}] 文字化けなし: ${!hasGarbledText}`);

    } catch (error) {
      console.error(`❌ [${this.instanceId}] ウェルカム画面テスト失敗:`, error.message);
      this.results.tests.welcomeScreen = { passed: false, error: error.message };
      await this.takeScreenshot('welcome-screen-error', 'ウェルカム画面テストエラー');
    }
  }

  async testQuestionTransition() {
    console.log(`📱 [${this.instanceId}] 2. 設問画面への遷移テスト`);
    
    try {
      // 診断開始ボタンを探してクリック
      const startSelectors = [
        'button:has-text("診断を開始")',
        'button:has-text("開始")', 
        '.start-button',
        '.btn-primary:visible',
        'button.start:visible',
        '[onclick*="start"]:visible',
        'button:visible'
      ];

      let startButton = null;
      let usedSelector = '';
      
      for (const selector of startSelectors) {
        try {
          const element = this.page.locator(selector);
          const count = await element.count();
          if (count > 0 && await element.first().isVisible({ timeout: 1000 })) {
            startButton = element.first();
            usedSelector = selector;
            break;
          }
        } catch (e) {
          // このセレクタでは見つからなかった
          continue;
        }
      }

      if (startButton) {
        console.log(`🔘 [${this.instanceId}] 開始ボタン発見: ${usedSelector}`);
        
        // ボタンクリック前にスクリーンショット
        await this.takeScreenshot('before-start-click', '開始ボタンクリック前');
        
        await startButton.click({ timeout: 5000 });
        await this.page.waitForTimeout(4000); // 画面遷移を待機

        // 設問画面の表示確認
        const questionsContainer = this.page.locator('#questions-container');
        const isQuestionsVisible = await questionsContainer.isVisible({ timeout: 5000 });

        // 設問テキストの確認
        const questionSelectors = [
          '.question-text',
          '.haqei-question h3',
          '.question h3',
          'h3:has-text("？")',
          '.virtual-question h3',
          'h3:visible',
          '.question-content'
        ];

        let questionText = '';
        let hasQuestionText = false;
        let usedQuestionSelector = '';
        
        for (const selector of questionSelectors) {
          try {
            const element = this.page.locator(selector);
            const count = await element.count();
            if (count > 0) {
              const text = await element.first().textContent({ timeout: 2000 });
              if (text && text.trim().length > 0) {
                questionText = text.trim();
                hasQuestionText = true;
                usedQuestionSelector = selector;
                break;
              }
            }
          } catch (e) {
            continue;
          }
        }

        await this.takeScreenshot('questions-screen', '設問画面の表示状態');

        this.results.tests.questionTransition = {
          passed: isQuestionsVisible && hasQuestionText,
          details: {
            questionsVisible: isQuestionsVisible,
            hasQuestionText: hasQuestionText,
            questionText: questionText.substring(0, 100),
            startButtonSelector: usedSelector,
            questionSelector: usedQuestionSelector
          }
        };

        console.log(`✅ [${this.instanceId}] 設問画面表示: ${isQuestionsVisible}`);
        console.log(`✅ [${this.instanceId}] 設問テキスト: ${hasQuestionText}`);
        console.log(`📝 [${this.instanceId}] 設問内容: "${questionText.substring(0, 80)}..."`);

      } else {
        throw new Error('開始ボタンが見つかりません');
      }

    } catch (error) {
      console.error(`❌ [${this.instanceId}] 設問遷移テスト失敗:`, error.message);
      this.results.tests.questionTransition = { passed: false, error: error.message };
      await this.takeScreenshot('questions-transition-error', '設問遷移テストエラー');
    }
  }

  async testErrorDialogs() {
    console.log(`📱 [${this.instanceId}] 3. エラーダイアログテスト`);
    
    try {
      // エラーダイアログが不適切に表示されていないか確認
      const errorDialogSelectors = [
        '.user-friendly-error-modal-fixed:visible',
        '.user-friendly-error-modal:visible',
        '.error-dialog:visible',
        '.modal.error:visible',
        '[class*="error"][class*="modal"]:visible'
      ];

      let totalErrorDialogs = 0;
      const errorDialogDetails = [];

      for (const selector of errorDialogSelectors) {
        try {
          const elements = this.page.locator(selector);
          const count = await elements.count();
          totalErrorDialogs += count;
          
          if (count > 0) {
            for (let i = 0; i < count; i++) {
              try {
                const text = await elements.nth(i).textContent({ timeout: 1000 });
                errorDialogDetails.push({ 
                  selector, 
                  text: text?.substring(0, 100) || 'テキストなし' 
                });
              } catch (e) {
                errorDialogDetails.push({ 
                  selector, 
                  text: 'テキスト取得失敗' 
                });
              }
            }
          }
        } catch (e) {
          // このセレクタでエラーが発生した場合は無視
        }
      }

      await this.takeScreenshot('error-dialogs-check', 'エラーダイアログの確認');

      this.results.tests.errorDialogs = {
        passed: totalErrorDialogs === 0,
        details: {
          totalErrorDialogs: totalErrorDialogs,
          errorDialogDetails: errorDialogDetails
        }
      };

      console.log(`✅ [${this.instanceId}] エラーダイアログ数: ${totalErrorDialogs}`);
      if (totalErrorDialogs > 0) {
        console.log(`⚠️ [${this.instanceId}] 検出されたエラーダイアログ:`, errorDialogDetails);
      }

    } catch (error) {
      console.error(`❌ [${this.instanceId}] エラーダイアログテスト失敗:`, error.message);
      this.results.tests.errorDialogs = { passed: false, error: error.message };
    }
  }

  async generateReport() {
    console.log(`📊 [${this.instanceId}] 検証結果の生成`);

    // 総合スコアの計算
    const tests = this.results.tests;
    const passedTests = Object.values(tests).filter(test => test.passed).length;
    const totalTests = Object.keys(tests).length;
    this.results.overallScore = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

    // 詳細レポートの生成
    const report = {
      instanceId: this.instanceId,
      timestamp: this.results.timestamp,
      overallScore: this.results.overallScore,
      summary: {
        totalTests: totalTests,
        passedTests: passedTests,
        failedTests: totalTests - passedTests
      },
      testResults: tests,
      screenshots: this.results.screenshots
    };

    // レポートファイルの保存
    const reportsDir = path.join(__dirname, 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const reportPath = path.join(reportsDir, `verification-report-${this.instanceId}-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`\n🎯 [${this.instanceId}] 検証結果サマリー:`);
    console.log('==========================================');
    console.log(`📊 総合スコア: ${this.results.overallScore}/100`);
    console.log(`✅ 成功テスト: ${passedTests}/${totalTests}`);
    console.log(`❌ 失敗テスト: ${totalTests - passedTests}/${totalTests}`);
    
    // 各テストの詳細結果
    Object.entries(tests).forEach(([testName, result]) => {
      const status = result.passed ? '✅' : '❌';
      console.log(`${status} ${testName}: ${result.passed ? 'PASS' : 'FAIL'}`);
      if (!result.passed && result.error) {
        console.log(`   エラー: ${result.error}`);
      }
    });
    
    console.log('==========================================');
    console.log(`📄 詳細レポート: ${reportPath}`);
    console.log(`📸 スクリーンショット: ${this.results.screenshots.length}枚`);

    return report;
  }

  async cleanup() {
    console.log(`🔄 [${this.instanceId}] ブラウザを3秒後に閉じます...`);
    
    try {
      if (this.page) {
        await this.page.waitForTimeout(3000);
      }
    } catch (e) {
      // ページが既に閉じられている場合
    }
    
    try {
      if (this.context && this.context !== this.browser) {
        await this.context.close();
      }
    } catch (e) {
      console.log(`⚠️ [${this.instanceId}] Context close warning:`, e.message);
    }
    
    try {
      if (this.browser) {
        await this.browser.close();
      }
    } catch (e) {
      console.log(`⚠️ [${this.instanceId}] Browser close warning:`, e.message);
    }
    
    console.log(`✅ [${this.instanceId}] ブラウザ終了完了`);
  }

  async runFullVerification() {
    try {
      await this.initialize();
      await this.testWelcomeScreen();
      await this.testQuestionTransition();
      await this.testErrorDialogs();
      
      const report = await this.generateReport();
      return report;
      
    } catch (error) {
      console.error(`💥 [${this.instanceId}] 検証中に重大エラー:`, error);
      try {
        await this.takeScreenshot('critical-error', '重大エラー発生時');
      } catch (e) {
        // スクリーンショットも失敗した場合
      }
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// 実行部分
if (require.main === module) {
  const verifier = new HAQEIPlaywrightVerifier('main-test');
  
  verifier.runFullVerification()
    .then((report) => {
      console.log(`🎊 検証完了! スコア: ${report.overallScore}/100`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 検証失敗:', error.message);
      process.exit(1);
    });
}

module.exports = { HAQEIPlaywrightVerifier };