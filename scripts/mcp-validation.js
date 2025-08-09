#!/usr/bin/env node

/**
 * MCP Validation System - User Behavior Verification
 * 
 * This script ensures all implementations are validated through actual user behavior
 * testing before completion is reported.
 */

const { execSync } = require('child_process');

class MCPValidationSystem {
  constructor() {
    this.validationSteps = [
      'browser_launch',
      'navigation_test', 
      'interaction_test',
      'screenshot_capture',
      'error_detection',
      'completion_verification'
    ];
    
    this.results = {
      passed: [],
      failed: [],
      screenshots: [],
      errors: []
    };
  }

  /**
   * Main validation workflow
   */
  async validateImplementation(feature, url = 'http://localhost:3000') {
    console.log(`🧪 Starting MCP Validation for: ${feature}`);
    
    try {
      // Step 1: Browser Launch
      await this.launchBrowser(url);
      
      // Step 2: Navigation Test
      await this.testNavigation(feature);
      
      // Step 3: Interaction Test  
      await this.testInteractions(feature);
      
      // Step 4: Screenshot Capture
      await this.captureScreenshots(feature);
      
      // Step 5: Error Detection
      await this.detectErrors();
      
      // Step 6: Completion Verification
      return this.verifyCompletion(feature);
      
    } catch (error) {
      this.results.errors.push(`Validation failed: ${error.message}`);
      return false;
    }
  }

  async launchBrowser(url) {
    console.log('🌐 Launching browser...');
    
    try {
      // Use MCP playwright integration
      const command = `npx playwright test --grep="browser-launch" --project=chromium`;
      execSync(command, { stdio: 'inherit' });
      this.results.passed.push('browser_launch');
    } catch (error) {
      this.results.failed.push('browser_launch');
      throw new Error(`Browser launch failed: ${error.message}`);
    }
  }

  async testNavigation(feature) {
    console.log(`🧭 Testing navigation for ${feature}...`);
    
    try {
      const command = `npx playwright test --grep="navigation-${feature}" --project=chromium`;
      execSync(command, { stdio: 'inherit' });
      this.results.passed.push('navigation_test');
    } catch (error) {
      this.results.failed.push('navigation_test');
      throw new Error(`Navigation test failed: ${error.message}`);
    }
  }

  async testInteractions(feature) {
    console.log(`👆 Testing user interactions for ${feature}...`);
    
    try {
      const command = `npx playwright test --grep="interaction-${feature}" --project=chromium`;
      execSync(command, { stdio: 'inherit' });
      this.results.passed.push('interaction_test');
    } catch (error) {
      this.results.failed.push('interaction_test');
      throw new Error(`Interaction test failed: ${error.message}`);
    }
  }

  async captureScreenshots(feature) {
    console.log(`📸 Capturing screenshots for ${feature}...`);
    
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotPath = `screenshots/${feature}-${timestamp}.png`;
      
      const command = `npx playwright test --grep="screenshot-${feature}" --project=chromium`;
      execSync(command, { stdio: 'inherit' });
      
      this.results.screenshots.push(screenshotPath);
      this.results.passed.push('screenshot_capture');
    } catch (error) {
      this.results.failed.push('screenshot_capture');
      throw new Error(`Screenshot capture failed: ${error.message}`);
    }
  }

  async detectErrors() {
    console.log('🔍 Detecting runtime errors...');
    
    try {
      const command = `npx playwright test --grep="error-detection" --project=chromium`;
      execSync(command, { stdio: 'inherit' });
      this.results.passed.push('error_detection');
    } catch (error) {
      this.results.failed.push('error_detection');
      // Don't throw here - errors are expected to be caught
    }
  }

  verifyCompletion(feature) {
    const totalSteps = this.validationSteps.length;
    const passedSteps = this.results.passed.length;
    const successRate = (passedSteps / totalSteps) * 100;
    
    console.log('\n📊 Validation Results:');
    console.log(`✅ Passed: ${this.results.passed.length}/${totalSteps}`);
    console.log(`❌ Failed: ${this.results.failed.length}/${totalSteps}`);
    console.log(`📸 Screenshots: ${this.results.screenshots.length}`);
    console.log(`⚠️  Errors: ${this.results.errors.length}`);
    console.log(`📈 Success Rate: ${successRate.toFixed(1)}%`);
    
    if (successRate >= 90) {
      console.log(`\n🎉 MCP Validation PASSED for ${feature}`);
      console.log('✅ Feature verified via MCP - user flow confirmed working');
      return true;
    } else {
      console.log(`\n❌ MCP Validation FAILED for ${feature}`);
      console.log('🚫 Implementation incomplete - user experience not verified');
      return false;
    }
  }

  /**
   * Generate validation report
   */
  generateReport(feature) {
    const report = {
      feature: feature,
      timestamp: new Date().toISOString(),
      results: this.results,
      validation: {
        total_steps: this.validationSteps.length,
        passed_steps: this.results.passed.length,
        failed_steps: this.results.failed.length,
        success_rate: (this.results.passed.length / this.validationSteps.length) * 100
      },
      recommendations: this.generateRecommendations()
    };
    
    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.results.failed.includes('browser_launch')) {
      recommendations.push('Fix server startup issues or port conflicts');
    }
    
    if (this.results.failed.includes('navigation_test')) {
      recommendations.push('Check routing and URL navigation');
    }
    
    if (this.results.failed.includes('interaction_test')) {
      recommendations.push('Verify button clicks and form inputs work');
    }
    
    if (this.results.screenshots.length === 0) {
      recommendations.push('Ensure screenshot capture is working');
    }
    
    if (this.results.errors.length > 0) {
      recommendations.push('Fix JavaScript runtime errors');
    }
    
    return recommendations;
  }
}

// CLI Interface
if (require.main === module) {
  const feature = process.argv[2] || 'default';
  const url = process.argv[3] || 'http://localhost:3000';
  
  const validator = new MCPValidationSystem();
  
  validator.validateImplementation(feature, url)
    .then(success => {
      if (success) {
        console.log('\n🎯 COMPLETION CRITERIA MET');
        console.log('✅ Ready to report task completion');
        process.exit(0);
      } else {
        console.log('\n🚫 COMPLETION CRITERIA NOT MET');
        console.log('❌ Do not report completion until MCP validation passes');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Validation system error:', error.message);
      process.exit(1);
    });
}

module.exports = MCPValidationSystem;