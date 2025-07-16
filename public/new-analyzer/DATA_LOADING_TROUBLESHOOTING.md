# HAQEI Data Loading Troubleshooting Guide

## Overview

This document provides troubleshooting steps for HAQEI_DATA loading issues in the analyzer.html application.

## Common Issues and Solutions

### 1. "Critical data missing: HAQEI_DATA not found" Error

**Symptoms:**
- Application fails to initialize
- Console shows "HAQEI_DATA not found" error
- DataManager.loadData() throws an error

**Root Cause:**
- data_box.js script hasn't finished loading when DataManager is initialized
- Script loading timing issues
- Missing or corrupted data_box.js file

**Solutions:**

#### Solution 1: Check Script Loading Order
1. Open browser developer tools (F12)
2. Check Console tab for loading errors
3. Verify data_box.js loads before DataManager initialization
4. Look for the message "✅ HAQEI_DATA グローバル変数設定完了"

#### Solution 2: Clear Browser Cache
1. Hard refresh the page (Ctrl/Cmd + F5)
2. Clear browser cache and cookies
3. Disable browser extensions that might interfere

#### Solution 3: Check Network Issues
1. Open Network tab in developer tools
2. Reload the page
3. Check if data_box.js loads successfully (status 200)
4. Verify file size is reasonable (not 0 bytes)

### 2. Script Loading Timeout

**Symptoms:**
- "⚠️ [LoadingCheck] 読み込み確認がタイムアウトしました" message
- Application initializes with partial data
- Some features may not work correctly

**Solutions:**

#### Solution 1: Wait for Complete Loading
1. Wait 5-10 seconds after page load
2. Check if `window.scriptLoadingStatus.allLoaded` becomes true
3. If not, refresh the page

#### Solution 2: Check Script Loading Status
```javascript
// Run in browser console
console.log('Loading Status:', window.scriptLoadingStatus);
console.log('HAQEI_DATA:', typeof window.HAQEI_DATA);
console.log('DataManager:', typeof DataManager);
```

### 3. Data Validation Errors

**Symptoms:**
- "データ構造検証に失敗しました" errors
- Missing or incomplete data in the application
- Features work partially

**Solutions:**

#### Solution 1: Check Data Integrity
1. Open browser console
2. Run: `window.dataManager.getDataStats()`
3. Verify all data counts are reasonable
4. Check for validation errors in logs

#### Solution 2: Force Data Reload
```javascript
// Run in browser console
window.dataManager.clearLogs();
await window.dataManager.loadData();
console.log('Reload result:', window.dataManager.getLoadingLogs());
```

### 4. Fallback Data Mode

**Symptoms:**
- "⚠️ フォールバックデータを設定しました" message
- Limited functionality
- Empty or minimal data sets

**Root Cause:**
- Primary data sources failed to load
- System activated emergency fallback mode

**Solutions:**

#### Solution 1: Refresh and Retry
1. Hard refresh the page (Ctrl/Cmd + F5)
2. Wait for complete loading
3. Check if primary data loads successfully

#### Solution 2: Verify File Availability
1. Check if data_box.js file exists and is accessible
2. Verify questions.js, vectors.js, and hexagrams.js are loading
3. Check server logs for any file access errors

## Diagnostic Tools

### Browser Console Commands

#### Check Loading Status
```javascript
// Check script loading status
console.log('Script Status:', window.scriptLoadingStatus);

// Check data availability
console.log('Data Status:', {
  HAQEI_DATA: !!window.HAQEI_DATA,
  WORLDVIEW_QUESTIONS: !!window.WORLDVIEW_QUESTIONS,
  SCENARIO_QUESTIONS: !!window.SCENARIO_QUESTIONS,
  H64_8D_VECTORS: !!window.H64_8D_VECTORS
});
```

#### Check DataManager Status
```javascript
// Check DataManager state
if (window.dataManager) {
  console.log('DataManager loaded:', window.dataManager.loaded);
  console.log('Loading logs:', window.dataManager.getLoadingLogs());
  console.log('Data stats:', window.dataManager.getDataStats());
}
```

#### Force Data Reload
```javascript
// Force reload data
if (window.dataManager) {
  window.dataManager.clearLogs();
  window.dataManager.loadData().then(() => {
    console.log('Reload complete');
  }).catch(err => {
    console.error('Reload failed:', err);
  });
}
```

### Test Page

A test page is available at `test-datamanager-fix.html` that provides:
- Script loading status monitoring
- Basic functionality tests
- Data loading tests
- getDataStats verification
- Console output capture

## Prevention Tips

### 1. Proper Script Loading
- Ensure data_box.js loads before DataManager initialization
- Use the enhanced script loading verification in analyzer.html
- Monitor console for loading completion messages

### 2. Error Monitoring
- Check browser console regularly for warnings
- Monitor network requests for failed file loads
- Use the built-in loading status tracking

### 3. Performance Optimization
- Avoid hard refreshes unless necessary
- Use browser caching effectively
- Monitor loading times with performance tools

## Advanced Troubleshooting

### Server Configuration
- Ensure proper MIME types for .js files
- Check server response headers
- Verify file permissions

### Module Loading Issues
- data_box.js uses ES6 modules but also sets global variables
- Ensure both ES6 and global variable access work
- Check for module loading conflicts

### Browser Compatibility
- Test on multiple browsers
- Check for ES6 feature support
- Verify async/await compatibility

## Contact Information

For persistent issues:
1. Check browser console for detailed error messages
2. Use the test page for comprehensive diagnostics
3. Document specific error messages and browser/OS information
4. Review recent changes to data files or script loading order

## Version Information

This troubleshooting guide corresponds to the enhanced data loading implementation that includes:
- Improved async data loading with retry mechanism
- Enhanced error handling and logging
- Robust fallback mechanisms
- Data integrity validation
- Script loading order verification

Last updated: 2024-07-16