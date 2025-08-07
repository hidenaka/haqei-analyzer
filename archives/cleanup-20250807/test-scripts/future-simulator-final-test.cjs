#!/usr/bin/env node

/**
 * Future Simulator Final Integration Test
 * Phase 11-12 Waterfall Testing
 */

const http = require('http');
const fs = require('fs');

// Test configuration
const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}`;

// Test results collector
const testResults = {
  phase11: [],
  phase12: [],
  summary: {
    total: 0,
    passed: 0,
    failed: 0
  }
};

// Helper function to make HTTP requests
function testEndpoint(path, testName) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${path}`;
    
    http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const success = res.statusCode === 200 && data.length > 0;
        const result = {
          name: testName,
          path: path,
          statusCode: res.statusCode,
          contentLength: data.length,
          success: success,
          timestamp: new Date().toISOString()
        };
        
        testResults.phase11.push(result);
        testResults.summary.total++;
        
        if (success) {
          testResults.summary.passed++;
          console.log(`✅ ${testName}: PASS (${data.length} bytes)`);
        } else {
          testResults.summary.failed++;
          console.log(`❌ ${testName}: FAIL (status: ${res.statusCode})`);
        }
        
        resolve(result);
      });
    }).on('error', (err) => {
      const result = {
        name: testName,
        path: path,
        error: err.message,
        success: false,
        timestamp: new Date().toISOString()
      };
      
      testResults.phase11.push(result);
      testResults.summary.total++;
      testResults.summary.failed++;
      
      console.log(`❌ ${testName}: ERROR - ${err.message}`);
      resolve(result);
    });
  });
}

// Content verification test
function verifyContent(path, keywords, testName) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${path}`;
    
    http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const foundKeywords = keywords.filter(keyword => data.includes(keyword));
        const success = foundKeywords.length === keywords.length;
        
        const result = {
          name: testName,
          path: path,
          keywords: keywords,
          foundKeywords: foundKeywords,
          missingKeywords: keywords.filter(k => !foundKeywords.includes(k)),
          success: success,
          timestamp: new Date().toISOString()
        };
        
        testResults.phase12.push(result);
        testResults.summary.total++;
        
        if (success) {
          testResults.summary.passed++;
          console.log(`✅ ${testName}: All keywords found`);
        } else {
          testResults.summary.failed++;
          console.log(`❌ ${testName}: Missing keywords: ${result.missingKeywords.join(', ')}`);
        }
        
        resolve(result);
      });
    }).on('error', (err) => {
      const result = {
        name: testName,
        path: path,
        error: err.message,
        success: false,
        timestamp: new Date().toISOString()
      };
      
      testResults.phase12.push(result);
      testResults.summary.total++;
      testResults.summary.failed++;
      
      console.log(`❌ ${testName}: ERROR - ${err.message}`);
      resolve(result);
    });
  });
}

// Main test execution
async function runTests() {
  console.log('');
  console.log('🚀 Future Simulator Final Integration Test');
  console.log('==========================================');
  console.log('');
  
  console.log('📋 Phase 11: Integration Testing');
  console.log('--------------------------------');
  
  // Phase 11: Basic endpoint tests
  await testEndpoint('/future_simulator.html', 'Future Simulator HTML');
  await testEndpoint('/js/core/H384_DATABASE.js', 'H384 Database Script');
  await testEndpoint('/js/future-simulator-ui-enhancements.js', 'UI Enhancements Script');
  await testEndpoint('/js/h384-compatibility-wrapper.js', 'Compatibility Wrapper');
  await testEndpoint('/css/styles.css', 'Main Stylesheet');
  await testEndpoint('/data/h384.json', 'H384 Data JSON');
  
  console.log('');
  console.log('📋 Phase 12: Content Verification');
  console.log('---------------------------------');
  
  // Phase 12: Content verification tests
  await verifyContent(
    '/future_simulator.html',
    ['worryInput', 'aiGuessBtn', 'resultArea', 'scenarioGrid', 'choiceContainer'],
    'HTML Structure Verification'
  );
  
  await verifyContent(
    '/future_simulator.html',
    ['未来を分析', '8つの可能性', 'データエクスポート'],
    'Japanese Content Verification'
  );
  
  await verifyContent(
    '/js/future-simulator-ui-enhancements.js',
    ['FutureSimulatorUIEnhancements', 'initialize', 'animateCardHover', 'createRippleEffect'],
    'UI Enhancement Functions'
  );
  
  await verifyContent(
    '/js/core/H384_DATABASE.js',
    ['H384Database', 'getHexagram', 'getLineText'],
    'H384 Database Functions'
  );
  
  // Generate test report
  console.log('');
  console.log('📊 Test Summary');
  console.log('===============');
  console.log(`Total Tests: ${testResults.summary.total}`);
  console.log(`✅ Passed: ${testResults.summary.passed}`);
  console.log(`❌ Failed: ${testResults.summary.failed}`);
  console.log(`Success Rate: ${((testResults.summary.passed / testResults.summary.total) * 100).toFixed(1)}%`);
  
  // Save detailed report
  const reportPath = './FUTURE_SIMULATOR_FINAL_TEST_REPORT.json';
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  
  // Exit with appropriate code
  process.exit(testResults.summary.failed > 0 ? 1 : 0);
}

// Check if server is running
function checkServer() {
  return new Promise((resolve) => {
    http.get(BASE_URL, (res) => {
      resolve(true);
    }).on('error', () => {
      console.log('⚠️  Server not running on port 3001');
      console.log('Please start the server with: node local-dev-server.js --port=3001');
      resolve(false);
    });
  });
}

// Main execution
(async () => {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Tests aborted - server not running');
    process.exit(1);
  }
  
  await runTests();
})();