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

    // 分離されたブラウザインスタンスを起動
    this.browser = await chromium.launchPersistentContext(this.userDataDir, {
      headless: false,
      viewport: { width: 1280, height: 720 },
      slowMo: 500,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        `--user-data-dir=${this.userDataDir}`
      ]
    });

    this.page = await this.browser.newPage();
    console.log(`✅ [${this.instanceId}] ブラウザインスタンス起動完了`);
  }

  async takeScreenshot(name, description = '') {
    const filename = `${this.instanceId}-${name}-${Date.now()}.png`;
    const filepath = path.join(__dirname, 'screenshots', filename);
    
    // スクリーンショットディレクトリを作成
    if (!fs.existsSync(path.dirname(filepath))) {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
    }

    await this.page.screenshot({ path: filepath, fullPage: true });
    
    this.results.screenshots.push({
      name: name,
      description: description,
      filename: filename,
      timestamp: new Date().toISOString()
    });
    
    console.log(`📸 [${this.instanceId}] スクリーンショット保存: ${filename}`);
    return filepath;
  }

  async testWelcomeScreen() {
    console.log(`📱 [${this.instanceId}] 1. ウェルカム画面の検証開始`);
    
    try {
      await this.page.goto('http://localhost:9000/os_analyzer.html');
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });

      // ウェルカム画面の表示確認
      const welcomeContainer = this.page.locator('#welcome-container');
      const isWelcomeVisible = await welcomeContainer.isVisible({ timeout: 5000 });
      
      // 不要な進捗ガイダンスの非表示確認
      const progressGuidance = this.page.locator('.progress-guidance:visible, .progress-guidance-fixed:visible');
      const guidanceCount = await progressGuidance.count();
      
      // 進捗バーの文字確認
      const progressElements = this.page.locator('.progress-current-fixed, .welcome-status, .progress-current');
      let progressText = '';
      if (await progressElements.count() > 0) {
        progressText = await progressElements.first().textContent() || '';
      }

      // 文字化けチェック（日本語以外の不正文字を検出）
      const hasGarbledText = /[^\u0000-\u007F\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u0020-\u007E]/.test(progressText);
      
      await this.takeScreenshot('welcome-screen', 'ウェルカム画面の表示状態');

      this.results.tests.welcomeScreen = {
        passed: isWelcomeVisible && guidanceCount === 0 && !hasGarbledText,
        details: {
          welcomeVisible: isWelcomeVisible,
          unwantedElementsHidden: guidanceCount === 0,
          progressText: progressText,
          noGarbledText: !hasGarbledText,
          guidanceCount: guidanceCount
        }
      };

      console.log(`✅ [${this.instanceId}] ウェルカム画面表示: ${isWelcomeVisible}`);
      console.log(`✅ [${this.instanceId}] 不要要素非表示: ${guidanceCount === 0}`);
      console.log(`✅ [${this.instanceId}] 進捗テキスト: "${progressText}"`);
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
        '.btn-primary',
        'button.start',
        '[onclick*="start"]'
      ];

      let startButton = null;
      for (const selector of startSelectors) {
        const element = this.page.locator(selector);
        if (await element.count() > 0) {
          startButton = element.first();
          break;
        }
      }

      if (startButton) {
        await startButton.click();
        await this.page.waitForTimeout(3000);

        // 設問画面の表示確認
        const questionsContainer = this.page.locator('#questions-container');
        const isQuestionsVisible = await questionsContainer.isVisible();

        // 進捗ガイダンスが適切に表示されているか確認
        const guidanceInQuestions = this.page.locator('.progress-guidance-fixed:visible, .progress-guidance:visible');
        const guidanceVisibleInQuestions = await guidanceInQuestions.count() > 0;

        // 設問テキストの確認
        const questionSelectors = [
          '.question-text',
          '.haqei-question h3',
          '.question h3',
          'h3:has-text("？")',
          '.virtual-question h3'
        ];

        let questionText = '';
        let hasQuestionText = false;
        
        for (const selector of questionSelectors) {
          const element = this.page.locator(selector);
          if (await element.count() > 0) {
            questionText = await element.first().textContent() || '';
            hasQuestionText = true;
            break;
          }
        }

        await this.takeScreenshot('questions-screen', '設問画面の表示状態');

        this.results.tests.questionTransition = {
          passed: isQuestionsVisible && hasQuestionText,
          details: {
            questionsVisible: isQuestionsVisible,
            hasQuestionText: hasQuestionText,
            questionText: questionText.substring(0, 100),
            guidanceVisible: guidanceVisibleInQuestions
          }
        };

        console.log(`✅ [${this.instanceId}] 設問画面表示: ${isQuestionsVisible}`);
        console.log(`✅ [${this.instanceId}] 設問テキスト: ${hasQuestionText}`);
        console.log(`📝 [${this.instanceId}] 設問内容: "${questionText.substring(0, 50)}..."`);

      } else {
        throw new Error('開始ボタンが見つかりません');
      }

    } catch (error) {
      console.error(`❌ [${this.instanceId}] 設問遷移テスト失敗:`, error.message);
      this.results.tests.questionTransition = { passed: false, error: error.message };
      await this.takeScreenshot('questions-transition-error', '設問遷移テストエラー');
    }
  }

  async testQuestionAnswering() {
    console.log(`📱 [${this.instanceId}] 3. 設問回答テスト`);
    
    try {
      // 選択肢を探してクリック
      const optionSelectors = [
        'input[type="radio"]',
        '.option-button',
        '.choice',
        'button[data-value]',
        '.virtual-question button'
      ];

      let optionButton = null;
      for (const selector of optionSelectors) {
        const elements = this.page.locator(selector);
        if (await elements.count() > 0) {
          optionButton = elements.first();
          break;
        }
      }

      if (optionButton) {
        await optionButton.click();
        await this.page.waitForTimeout(1000);

        // 次へボタンを探してクリック
        const nextSelectors = [
          'button:has-text("次へ")',
          'button:has-text("回答")',
          '.next-button',
          'button.next',
          '[onclick*="next"]'
        ];

        let nextButton = null;
        for (const selector of nextSelectors) {
          const element = this.page.locator(selector);
          if (await element.count() > 0 && await element.isVisible()) {
            nextButton = element.first();
            break;
          }
        }

        if (nextButton) {
          await nextButton.click();
          await this.page.waitForTimeout(2000);

          // 進捗の更新確認
          const progressElements = this.page.locator('.progress-current-fixed, .progress-current');
          let updatedProgressText = '';
          if (await progressElements.count() > 0) {
            updatedProgressText = await progressElements.first().textContent() || '';
          }

          await this.takeScreenshot('question-answered', '設問回答後の状態');

          this.results.tests.questionAnswering = {
            passed: true,
            details: {
              optionClicked: true,
              nextButtonClicked: true,
              progressUpdated: updatedProgressText.length > 0,
              progressText: updatedProgressText
            }
          };

          console.log(`✅ [${this.instanceId}] 選択肢クリック: 成功`);
          console.log(`✅ [${this.instanceId}] 次へボタン: 成功`);
          console.log(`✅ [${this.instanceId}] 進捗更新: "${updatedProgressText}"`);

        } else {
          throw new Error('次へボタンが見つかりません');
        }
      } else {
        throw new Error('選択肢が見つかりません');
      }

    } catch (error) {
      console.error(`❌ [${this.instanceId}] 設問回答テスト失敗:`, error.message);
      this.results.tests.questionAnswering = { passed: false, error: error.message };
      await this.takeScreenshot('question-answering-error', '設問回答テストエラー');
    }
  }

  async testErrorDialogs() {
    console.log(`📱 [${this.instanceId}] 4. エラーダイアログテスト`);
    
    try {
      // エラーダイアログが不適切に表示されていないか確認
      const errorDialogSelectors = [
        '.user-friendly-error-modal-fixed',
        '.user-friendly-error-modal',
        '.error-dialog',
        '.modal.error',
        '[class*="error"][class*="modal"]'
      ];

      let totalErrorDialogs = 0;
      const errorDialogDetails = [];

      for (const selector of errorDialogSelectors) {
        const elements = this.page.locator(selector);
        const count = await elements.count();
        if (count > 0) {
          totalErrorDialogs += count;
          for (let i = 0; i < count; i++) {
            const isVisible = await elements.nth(i).isVisible();
            if (isVisible) {
              const text = await elements.nth(i).textContent();
              errorDialogDetails.push({ selector, text: text?.substring(0, 100) });
            }
          }
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
    const reportPath = path.join(__dirname, 'reports', `verification-report-${this.instanceId}-${Date.now()}.json`);
    if (!fs.existsSync(path.dirname(reportPath))) {
      fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`\n🎯 [${this.instanceId}] 検証結果サマリー:`);
    console.log('==========================================');
    console.log(`📊 総合スコア: ${this.results.overallScore}/100`);
    console.log(`✅ 成功テスト: ${passedTests}/${totalTests}`);
    console.log(`❌ 失敗テスト: ${totalTests - passedTests}/${totalTests}`);
    console.log('==========================================');
    console.log(`📄 詳細レポート: ${reportPath}`);
    console.log(`📸 スクリーンショット: ${this.results.screenshots.length}枚`);

    return report;
  }

  async cleanup() {
    console.log(`🔄 [${this.instanceId}] ブラウザを5秒後に閉じます...`);
    await this.page.waitForTimeout(5000);
    if (this.browser) {
      await this.browser.close();
    }
  }

  async runFullVerification() {
    try {
      await this.initialize();
      await this.testWelcomeScreen();
      await this.testQuestionTransition();
      await this.testQuestionAnswering();
      await this.testErrorDialogs();
      
      const report = await this.generateReport();
      return report;
      
    } catch (error) {
      console.error(`💥 [${this.instanceId}] 検証中に重大エラー:`, error);
      await this.takeScreenshot('critical-error', '重大エラー発生時');
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// 複数インスタンス同時実行の関数
async function runMultipleVerifications(instanceCount = 1) {
  console.log(`🚀 ${instanceCount}個のインスタンスで並列検証を開始`);
  
  const verifiers = [];
  const promises = [];

  for (let i = 0; i < instanceCount; i++) {
    const instanceId = `instance-${i + 1}`;
    const verifier = new HAQEIPlaywrightVerifier(instanceId);
    verifiers.push(verifier);
    promises.push(verifier.runFullVerification());
  }

  try {
    const reports = await Promise.all(promises);
    
    console.log('\n🎉 全インスタンス検証完了!');
    console.log('==========================================');
    
    reports.forEach((report, index) => {
      console.log(`📊 [${report.instanceId}] スコア: ${report.overallScore}/100`);
    });
    
    const averageScore = reports.reduce((sum, report) => sum + report.overallScore, 0) / reports.length;
    console.log(`📈 平均スコア: ${Math.round(averageScore)}/100`);
    console.log('==========================================');
    
    return reports;
    
  } catch (error) {
    console.error('💥 並列検証でエラーが発生:', error);
    throw error;
  }
}

// コマンドライン引数の処理
const args = process.argv.slice(2);
const instanceCount = args.length > 0 ? parseInt(args[0]) : 1;

if (require.main === module) {
  runMultipleVerifications(instanceCount)
    .then((reports) => {
      console.log(`🎊 検証完了! ${reports.length}個のレポートが生成されました`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 検証失敗:', error);
      process.exit(1);
    });
}

module.exports = { HAQEIPlaywrightVerifier, runMultipleVerifications };